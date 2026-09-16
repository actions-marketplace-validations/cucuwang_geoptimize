# geoptimize video preview

30-second English product film, 1920 × 1080, 30 fps. Playful typography, restrained
spring motion, a moving document scan and an original instrumental soundtrack.
The design retains geoptimize's dark ground and mint-green accent.

The intended viewer is a developer maintaining a static website or documentation.
The film introduces a first local scan and ends with the npm installation command.
It uses verified public demonstration data and makes no search-outcome claims.

## Files

- `output/geoptimize-preview-v2.mp4`: current review copy with sound and varied transitions.
- `output/geoptimize-preview-v1.mp4`: preserved first preview.
- `index.html`, `scene.js`: editable Canvas source and accessible local player.
- `source-data.json`, `source-notes.md`: pinned public product evidence.
- `soundtrack.py`: original deterministic 128 BPM music.
- `ATTRIBUTION.md`: motion-web credit, font licenses and preview usage scope.
- `output/verification.json`: dimensions, duration, stream properties and hashes.
- `output/verification-v2.json`, `output/layout-audit-v2.json`: current media and text-layout readback.

## Reproduce

Requires Node, Puppeteer Core, Chrome, FFmpeg and Python with NumPy. The parent
checkout already has Puppeteer Core. `GEO_CHROME` can select a Chrome executable.
No global dependency installation is needed in the producing workspace.

```sh
python3 soundtrack.py
node render.mjs
ffmpeg -y -i output/silent.mp4 -i assets/soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t 30 -movflags +faststart output/geoptimize-preview-v2.mp4
```

`node render.mjs --stills` writes representative frames only. Rendering runs through
an ephemeral loopback HTTP server which is closed on completion. Every frame is
evaluated at its exact timestamp; no mouse operation or live webpage is recorded.

The optional HTML player starts paused, including under reduced motion. Serve this
folder over a local HTTP server to use its play, seek and sound controls. The MP4 is
the primary review artifact and requires no server.

## Editorial structure

| Seconds | Content |
| --- | --- |
| 0–4.7 | A page looks ready; a closer scan reveals a reason to check. |
| 4.7–9.4 | geoptimize introduction and its local scan command. |
| 9.4–15 | The actual synthetic fixture's five readiness dimensions. |
| 15–21 | Editing the fixture and comparing two concrete finding counts. |
| 21–25.3 | Local scans, offline reports and the existing CI capability. |
| 25.3–30 | Brand, installation command and repository URL. |

The overall score is not shown increasing, since the fixture's later score reflects
several content changes beyond the two findings highlighted in the video.

Each boundary now has its own motion: circular reveal, terminal opening,
horizontal push, diagonal sweep and a small zoom into a beat cut. Incoming scene
clocks continue through the boundary rather than restarting. Heading travel is
bounded to its own area so it cannot cross a fixed caption.

## Validation scope

The video is a stylized product explanation, not a literal screen recording.
Validation checks the rendered frames, playback duration, codec, sound levels,
source-data consistency and deterministic frame output. It does not claim new
runtime validation of geoptimize's CLI or a released marketing campaign.

The v2 layout pass checks transformed font-glyph boxes in all 900 frames, along
with settled text against the safe area and its own clipping region. Text pairs
are checked within each scene; the opaque transition masks intentionally replace
one scene with the next. The tiny HTML labels in overlapping paper illustrations
are decorative and excluded from the glyph-pair audit. Representative mid-transition
frames are also reviewed visually.
