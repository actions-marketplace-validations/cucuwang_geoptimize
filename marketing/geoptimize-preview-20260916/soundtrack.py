#!/usr/bin/env python3
"""Render the original GeoOptimize preview soundtrack.

Reproducibility: run this file with
`/Users/te-shuwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 soundtrack.py`
from this directory.  The fixed seed, 48 kHz sample rate, 30.0-second length,
and all synthesis parameters are defined below; no downloaded samples or
external sound libraries are used.  It writes `assets/soundtrack.wav` as
16-bit stereo PCM and prints concise readback measurements.
"""

from __future__ import annotations

import math
import re
import subprocess
import wave
from pathlib import Path

import numpy as np


SEED = 20260916
SAMPLE_RATE = 48_000
DURATION_SECONDS = 30.0
SAMPLES = int(SAMPLE_RATE * DURATION_SECONDS)
BPM = 128
BEAT = 60.0 / BPM
OUTFILE = Path(__file__).parent / "assets" / "soundtrack.wav"
RNG = np.random.default_rng(SEED)

NOTE = {
    "D2": 38, "E2": 40, "F#2": 42, "G2": 43, "A2": 45, "B2": 47,
    "D3": 50, "E3": 52, "F#3": 54, "G3": 55, "A3": 57, "B3": 59,
    "C#4": 61, "D4": 62, "E4": 64, "F#4": 66, "G4": 67, "A4": 69,
    "B4": 71, "C#5": 73, "D5": 74, "E5": 76, "F#5": 78, "A5": 81,
}


def hz(name: str) -> float:
    return 440.0 * 2.0 ** ((NOTE[name] - 69) / 12.0)


mix = np.zeros((SAMPLES, 2), dtype=np.float64)


def section_gain(time: float) -> float:
    """Phrase boundaries follow the supplied picture timing, with soft edges."""
    if time < 4.7:
        return 0.56
    if time < 12.0:
        return 0.80
    if time < 21.0:
        return 1.00
    if time < 25.0:
        return 1.10
    if time < 29.0:
        return 0.92
    return 0.0


def add_stereo(start: float, mono: np.ndarray, gain: float = 1.0,
               pan: float = 0.0, width_delay: int = 0) -> None:
    """Place a finite mono voice into the stereo timeline with equal-power pan."""
    index = int(round(start * SAMPLE_RATE))
    if index >= SAMPLES or index + len(mono) <= 0:
        return
    source_lo = max(0, -index)
    dest_lo = max(0, index)
    dest_hi = min(SAMPLES, index + len(mono))
    source_hi = source_lo + (dest_hi - dest_lo)
    signal = mono[source_lo:source_hi] * gain
    left = math.cos((pan + 1.0) * math.pi / 4.0)
    right = math.sin((pan + 1.0) * math.pi / 4.0)
    mix[dest_lo:dest_hi, 0] += signal * left
    mix[dest_lo:dest_hi, 1] += signal * right
    if width_delay:
        delayed_lo = dest_lo + width_delay
        delayed_hi = dest_hi + width_delay
        if delayed_lo < SAMPLES:
            clipped_hi = min(SAMPLES, delayed_hi)
            delay_signal = signal[:clipped_hi - delayed_lo]
            mix[delayed_lo:clipped_hi, 0] += delay_signal * right * 0.18
            mix[delayed_lo:clipped_hi, 1] += delay_signal * left * 0.18


def exp_env(length: int, attack: float, decay: float, release: float = 0.0) -> np.ndarray:
    t = np.arange(length) / SAMPLE_RATE
    envelope = np.minimum(1.0, t / max(attack, 1.0 / SAMPLE_RATE))
    envelope *= np.exp(-t / decay)
    if release:
        envelope *= np.minimum(1.0, (length / SAMPLE_RATE - t) / release)
    return np.maximum(envelope, 0.0)


def pluck(note: str, start: float, length: float = 0.52, gain: float = 0.20,
          pan: float = 0.0) -> None:
    count = max(1, int(length * SAMPLE_RATE))
    t = np.arange(count) / SAMPLE_RATE
    frequency = hz(note)
    # Rounded, harmonic-rich pluck with a quiet octave body and no sharp edge.
    voice = (
        np.sin(2 * np.pi * frequency * t)
        + 0.33 * np.sin(2 * np.pi * frequency * 2.0 * t + 0.22)
        + 0.12 * np.sin(2 * np.pi * frequency * 3.0 * t + 0.54)
        + 0.08 * np.sin(2 * np.pi * frequency * 0.5 * t)
    )
    voice *= exp_env(count, 0.009, 0.26, 0.03)
    add_stereo(start, voice, gain, pan, width_delay=11)


def pad(notes: tuple[str, ...], start: float, length: float, gain: float) -> None:
    count = max(1, int(length * SAMPLE_RATE))
    t = np.arange(count) / SAMPLE_RATE
    envelope = np.minimum(1.0, t / 0.18) * np.minimum(1.0, (length - t) / 0.34)
    envelope = np.maximum(envelope, 0.0) * (0.86 + 0.14 * np.sin(2 * np.pi * 0.22 * t))
    for offset, name in enumerate(notes):
        frequency = hz(name)
        vibrato = 0.003 * np.sin(2 * np.pi * (0.18 + offset * 0.03) * t)
        voice = (
            0.74 * np.sin(2 * np.pi * frequency * (1.0 + vibrato) * t + offset * 0.3)
            + 0.18 * np.sin(2 * np.pi * frequency * 2 * t + 0.4)
        ) * envelope
        add_stereo(start, voice, gain / len(notes), (-0.42 + offset * 0.30), width_delay=17 + offset * 4)


def bass(note: str, start: float, length: float = 0.39, gain: float = 0.27) -> None:
    count = max(1, int(length * SAMPLE_RATE))
    t = np.arange(count) / SAMPLE_RATE
    frequency = hz(note)
    # Sine plus a gentle odd harmonic stays audible on small speakers.
    voice = np.sin(2 * np.pi * frequency * t) + 0.22 * np.sin(2 * np.pi * frequency * 3 * t)
    voice *= exp_env(count, 0.014, 0.23, 0.04)
    add_stereo(start, voice, gain, -0.03)


def kick(start: float, gain: float) -> None:
    count = int(0.27 * SAMPLE_RATE)
    t = np.arange(count) / SAMPLE_RATE
    frequency = 47.0 + 58.0 * np.exp(-t / 0.045)
    phase = 2 * np.pi * np.cumsum(frequency) / SAMPLE_RATE
    voice = (np.sin(phase) + 0.10 * np.sin(2 * phase)) * exp_env(count, 0.003, 0.105, 0.035)
    add_stereo(start, voice, gain)


def snare(start: float, gain: float) -> None:
    count = int(0.17 * SAMPLE_RATE)
    t = np.arange(count) / SAMPLE_RATE
    noise = RNG.standard_normal(count)
    # A brief, smoothed pop replaces abrasive white-noise snare fizz.
    smooth = np.convolve(noise, np.ones(17) / 17.0, mode="same")
    voice = 0.36 * smooth + 0.26 * np.sin(2 * np.pi * 188 * t)
    voice *= exp_env(count, 0.004, 0.050, 0.028)
    add_stereo(start, voice, gain, 0.04, width_delay=7)


def digital_pop(start: float, gain: float, pan: float) -> None:
    count = int(0.095 * SAMPLE_RATE)
    t = np.arange(count) / SAMPLE_RATE
    frequency = 900.0 + 520.0 * np.exp(-t / 0.020)
    phase = 2 * np.pi * np.cumsum(frequency) / SAMPLE_RATE
    voice = (np.sin(phase) + 0.22 * np.sin(2 * phase)) * exp_env(count, 0.002, 0.026, 0.015)
    add_stereo(start, voice, gain, pan, width_delay=5)


def warm_riser(start: float, length: float, gain: float) -> None:
    count = int(length * SAMPLE_RATE)
    t = np.arange(count) / SAMPLE_RATE
    frequency = 180.0 + 520.0 * (t / length) ** 1.45
    phase = 2 * np.pi * np.cumsum(frequency) / SAMPLE_RATE
    envelope = np.sin(np.pi * t / length) ** 1.35
    voice = (np.sin(phase) + 0.13 * np.sin(0.5 * phase)) * envelope
    add_stereo(start, voice, gain, -0.10, width_delay=23)


def add_transition_markers() -> None:
    """Give the picture-cut times a musical cue even where they sit between bars."""
    # 4.70s: groove pickup arrives before the next bar's full drum pattern.
    bass("B2", 4.70, 0.38, 0.17)
    kick(4.70, 0.17)
    kick(4.70 + BEAT, 0.13)
    snare(4.70 + BEAT, 0.085)
    pluck("F#4", 4.70 + BEAT * 0.5, gain=0.090, pan=0.20)

    # 12.00s: a small bright response signals the denser product-demo section.
    digital_pop(12.00, 0.038, -0.56)
    pluck("D5", 12.00, gain=0.145, pan=0.22)
    pluck("F#4", 12.00 + BEAT * 0.5, gain=0.092, pan=-0.24)
    bass("D2", 12.00, 0.36, 0.18)

    # 21.00s: gentle lift, deliberately rounded instead of a harsh sweep.
    warm_riser(21.00, 0.98, 0.042)
    digital_pop(21.00 + BEAT * 0.65, 0.035, 0.52)
    pluck("A4", 21.00 + BEAT * 0.25, gain=0.105, pan=-0.18)


def render_cta() -> None:
    """A short D-major landing for the call to action, ending before the tail."""
    pad(("D3", "F#3", "A3", "C#4"), 25.00, 4.35, 0.072)
    cta_hook = ("D4", "A4", "F#4", "C#5", "A4", "F#4", "E4", "D4")
    for step, name in enumerate(cta_hook):
        start = 25.00 + step * BEAT / 2
        pluck(name, start, length=0.48, gain=0.112 + 0.010 * (step % 2),
              pan=-0.24 if step % 2 == 0 else 0.24)
    for step, name in enumerate(("F#4", "A4", "D5", "A4", "F#4")):
        start = 27.05 + step * BEAT / 2
        pluck(name, start, length=0.42, gain=0.088, pan=0.20 if step % 2 else -0.20)
    for start, accent in ((25.00, 1.0), (25.00 + BEAT, 0.68),
                          (25.00 + BEAT * 2, 0.88), (25.00 + BEAT * 3, 0.56),
                          (27.05, 0.76), (27.05 + BEAT * 2, 0.66)):
        if start < 29.0:
            bass("D2", start, 0.35, 0.20 * accent)
            kick(start, 0.19 * accent)
    snare(25.00 + BEAT, 0.095)
    snare(25.00 + BEAT * 3, 0.080)
    digital_pop(26.15, 0.026, 0.52)
    pluck("D5", 28.12, length=0.72, gain=0.115, pan=0.10)
    pluck("A4", 28.37, length=0.60, gain=0.078, pan=-0.20)
    pad(("D3", "F#3", "A3", "C#4"), 28.40, 0.92, 0.052)


# Four-chord identity: Dmaj7, Aadd9, Bm7, Gmaj7.  Each chord lasts one bar.
CHORDS = (
    (("D3", "F#3", "A3", "C#4"), "D2", ("D4", "A4", "F#4", "C#5", "A4", "F#4", "E4", "A4")),
    (("A2", "C#4", "E4", "B4"), "A2", ("E4", "B4", "C#5", "E5", "B4", "A4", "E4", "C#5")),
    (("B2", "D3", "F#3", "A3"), "B2", ("F#4", "A4", "B4", "D5", "A4", "F#4", "D4", "A4")),
    (("G2", "B2", "D3", "F#3"), "G2", ("D4", "G4", "B4", "D5", "B4", "A4", "G4", "D4")),
)


def render_arrangement() -> None:
    bar = BEAT * 4
    # The looping section stops at the CTA cut.  Its last tails can cross 25.0s.
    bar_count = math.ceil(25.0 / bar)
    for bar_index in range(bar_count):
        start = bar_index * bar
        chord, root, hook = CHORDS[bar_index % len(CHORDS)]
        intensity = section_gain(start)
        if intensity <= 0:
            continue
        remaining = min(bar, 25.0 - start)
        pad(chord, start, remaining + 0.30, 0.075 * intensity)

        # Opening arrives as a sparse invitation; the hook then becomes the motif.
        if start < 4.7:
            pluck(hook[0], start + 0.00, gain=0.13, pan=-0.20)
            pluck(hook[3], start + BEAT * 1.5, gain=0.11, pan=0.17)
            pluck(hook[5], start + BEAT * 2.75, gain=0.10, pan=-0.10)
        else:
            note_count = 8 if start < 21.0 else 10
            for step in range(note_count):
                note_time = start + step * BEAT / 2
                if note_time >= 25.0:
                    break
                hook_note = hook[step % len(hook)]
                swing = 0.018 if step % 2 else 0.0
                pluck(hook_note, note_time + swing, gain=(0.13 + 0.018 * (step % 3)) * intensity,
                      pan=(-0.25 if step % 2 == 0 else 0.25))
                if start >= 12.0 and step in (2, 6):
                    pluck(hook_note, note_time + 0.102, length=0.30, gain=0.055 * intensity,
                          pan=(0.48 if step % 2 else -0.48))

        if start >= 4.7:
            # Bouncy bass uses two accented beats and one anticipatory eighth.
            for position, length, accent in ((0.0, 0.39, 1.0), (1.0, 0.32, 0.72),
                                             (2.0, 0.39, 0.92), (2.75, 0.24, 0.56)):
                bass_time = start + position * BEAT
                if bass_time < 25.0:
                    bass(root, bass_time, length, 0.23 * intensity * accent)
            for beat_index in range(4):
                kick_time = start + beat_index * BEAT
                if kick_time < 25.0:
                    kick(kick_time, 0.24 * intensity * (1.05 if beat_index in (0, 2) else 0.78))
            for beat_index in (1, 3):
                snare_time = start + beat_index * BEAT
                if snare_time < 25.0:
                    snare(snare_time, 0.13 * intensity)

        # Digital details are intentionally intermittent, leaving visual text breathing room.
        if start >= 12.0:
            for step in (1, 5):
                pop_time = start + step * BEAT / 2 + 0.032
                if pop_time < 25.0:
                    digital_pop(pop_time, 0.030 * intensity, -0.58 if step == 1 else 0.58)
        if 21.0 <= start < 25.0:
            warm_riser(start + BEAT * 2.5, min(BEAT * 1.15, 25.0 - (start + BEAT * 2.5)), 0.035)

    add_transition_markers()
    render_cta()


def finalize_and_write() -> tuple[float, float]:
    # The final second is a fully quiet tail.  A cosine fade starts at 29.0 exactly.
    fade_start = int(29.0 * SAMPLE_RATE)
    fade = 0.5 + 0.5 * np.cos(np.linspace(0.0, np.pi, SAMPLES - fade_start, endpoint=True))
    mix[fade_start:] *= fade[:, None]
    if not np.isfinite(mix).all():
        raise RuntimeError("Synthesis produced a non-finite sample")

    # Gentle tanh limiting avoids transient clipping while keeping the text-friendly mix restrained.
    limited = np.tanh(mix * 1.16) / math.tanh(1.16)
    rms = float(np.sqrt(np.mean(limited ** 2)))
    # Empirically calibrated for this arrangement to land near -18 LUFS by EBU R128.
    target_rms = 10.0 ** (-20.1 / 20.0)
    if rms > 0:
        limited *= target_rms / rms
    peak_limit = 10.0 ** (-1.65 / 20.0)
    peak = float(np.max(np.abs(limited)))
    if peak > peak_limit:
        limited *= peak_limit / peak
    if not np.isfinite(limited).all() or np.max(np.abs(limited)) > 1.0:
        raise RuntimeError("Invalid output level")

    pcm = np.round(np.clip(limited, -1.0, 1.0) * 32767.0).astype("<i2")
    OUTFILE.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUTFILE), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())
    return float(np.max(np.abs(pcm))) / 32767.0, float(np.sqrt(np.mean((pcm / 32767.0) ** 2)))


def measured_lufs(path: Path) -> str:
    try:
        report = subprocess.run(
            ["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-filter_complex", "ebur128=peak=true", "-f", "null", "-"],
            check=True, capture_output=True, text=True,
        ).stderr
        values = re.findall(r"I:\s*(-?\d+(?:\.\d+)?)\s*LUFS", report)
        return values[-1] if values else "unavailable"
    except (OSError, subprocess.CalledProcessError):
        return "unavailable"


def main() -> None:
    render_arrangement()
    peak, rms = finalize_and_write()
    with wave.open(str(OUTFILE), "rb") as wav:
        frames = wav.getnframes()
        rate = wav.getframerate()
        channels = wav.getnchannels()
        width = wav.getsampwidth() * 8
    print(
        f"wrote={OUTFILE} duration={frames / rate:.6f}s samples={frames} "
        f"format={rate}Hz/{channels}ch/{width}-bit peak={20 * math.log10(peak):.2f}dBFS "
        f"rms={20 * math.log10(rms):.2f}dBFS integrated={measured_lufs(OUTFILE)}LUFS bytes={OUTFILE.stat().st_size}"
    )


if __name__ == "__main__":
    main()
