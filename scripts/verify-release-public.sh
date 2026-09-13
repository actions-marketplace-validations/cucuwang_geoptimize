#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME=geoptimize
EXPECTED_COMMIT=${1:-}
EXPECTED_PACKAGE_SHA256=${2:-}
REPOSITORY_ROOT=$(cd "$(dirname "$0")/.." && pwd -P)

if [ -z "$EXPECTED_COMMIT" ] || [ -z "$EXPECTED_PACKAGE_SHA256" ]; then
  echo "usage: $0 <expected-release-commit> <expected-package-sha256>" >&2
  exit 2
fi

if ! [[ "$EXPECTED_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
  echo "expected-release-commit must be a lowercase 40-character Git SHA" >&2
  exit 2
fi

if ! [[ "$EXPECTED_PACKAGE_SHA256" =~ ^[0-9a-f]{64}$ ]]; then
  echo "expected-package-sha256 must be a lowercase 64-character SHA-256" >&2
  exit 2
fi

for command_name in awk bash curl git jq mktemp node rm sleep tar; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "missing required command: $command_name" >&2
    exit 2
  fi
done

VERIFY_BASE=${TMPDIR:-/tmp}
VERIFY_BASE=${VERIFY_BASE%/}
if ! VERIFY_BASE=$(cd -- "$VERIFY_BASE" 2>/dev/null && pwd -P); then
  echo "temporary directory is unavailable: ${TMPDIR:-/tmp}" >&2
  exit 2
fi
VERIFY_ROOT=$(mktemp -d "$VERIFY_BASE/geoptimize-release-public.XXXXXX")
ARCHIVE_ROOT="$VERIFY_ROOT/source"
PACKUMENT_JSON="$VERIFY_ROOT/packument.json"
mkdir -p "$ARCHIVE_ROOT" "$VERIFY_ROOT/tmp"

cleanup() {
  case "$VERIFY_ROOT" in
    "$VERIFY_BASE"/geoptimize-release-public.*)
      rm -rf -- "$VERIFY_ROOT"
      ;;
    *)
      echo "Refusing to remove unexpected verification path: $VERIFY_ROOT" >&2
      ;;
  esac
}
trap cleanup EXIT

if ! git -C "$REPOSITORY_ROOT" rev-parse --verify "$EXPECTED_COMMIT^{commit}" >/dev/null 2>&1; then
  echo "expected release commit is not available in the local repository: $EXPECTED_COMMIT" >&2
  exit 2
fi

if ! git -C "$REPOSITORY_ROOT" archive --format=tar "$EXPECTED_COMMIT" | tar -xf - -C "$ARCHIVE_ROOT"; then
  echo "could not archive the exact release commit: $EXPECTED_COMMIT" >&2
  exit 2
fi

SOURCE_PACKAGE_JSON="$ARCHIVE_ROOT/package.json"
SOURCE_LOCK="$ARCHIVE_ROOT/package-lock.json"
SOURCE_VERIFIER="$ARCHIVE_ROOT/scripts/verify-release-v0.8.sh"
for source_file in "$SOURCE_PACKAGE_JSON" "$SOURCE_LOCK" "$SOURCE_VERIFIER" "$ARCHIVE_ROOT/scripts/prepare-release-consumer.mjs"; do
  if [ ! -f "$source_file" ]; then
    echo "exact release source is missing required verification file: $source_file" >&2
    exit 2
  fi
done

EXPECTED_VERSION=$(node -e "const fs=require('node:fs');const packageJson=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));process.stdout.write(packageJson.version)" "$SOURCE_PACKAGE_JSON")
if ! [[ "$EXPECTED_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "archived package.json version must be a numeric release version" >&2
  exit 2
fi

MAX_ATTEMPTS=${RELEASE_PUBLIC_VERIFY_MAX_ATTEMPTS:-10}
INITIAL_DELAY_SECONDS=${RELEASE_PUBLIC_VERIFY_INITIAL_DELAY_SECONDS:-15}
MAX_DELAY_SECONDS=${RELEASE_PUBLIC_VERIFY_MAX_DELAY_SECONDS:-30}
if ! [[ "$MAX_ATTEMPTS" =~ ^[1-9][0-9]*$ ]] || [ "$MAX_ATTEMPTS" -gt 12 ]; then
  echo "RELEASE_PUBLIC_VERIFY_MAX_ATTEMPTS must be an integer from 1 to 12" >&2
  exit 2
fi
if ! [[ "$INITIAL_DELAY_SECONDS" =~ ^[0-9]+$ ]] || [ "$INITIAL_DELAY_SECONDS" -gt 60 ]; then
  echo "RELEASE_PUBLIC_VERIFY_INITIAL_DELAY_SECONDS must be an integer from 0 to 60" >&2
  exit 2
fi
if ! [[ "$MAX_DELAY_SECONDS" =~ ^[0-9]+$ ]] || [ "$MAX_DELAY_SECONDS" -gt 60 ]; then
  echo "RELEASE_PUBLIC_VERIFY_MAX_DELAY_SECONDS must be an integer from 0 to 60" >&2
  exit 2
fi
attempt_limit=$((10#$MAX_ATTEMPTS))
delay=$((10#$INITIAL_DELAY_SECONDS))
delay_limit=$((10#$MAX_DELAY_SECONDS))

probe_packument() {
  local status latest version_present

  status=$(curl -sS -L --connect-timeout 5 --max-time 10 -o "$PACKUMENT_JSON" -w '%{http_code}' \
    "https://registry.npmjs.org/$PACKAGE_NAME" 2>/dev/null) || {
    echo "FAIL: npm packument probe returned no HTTP status; refusing retry" >&2
    return 2
  }

  case "$status" in
    404|429|5??)
      echo "INFO: npm packument probe returned HTTP $status; retryable visibility state"
      return 1
      ;;
    200)
      if ! jq -e 'type == "object" and (.versions | type == "object") and (."dist-tags" | type == "object")' \
        "$PACKUMENT_JSON" >/dev/null 2>&1; then
        echo "FAIL: npm packument has an unexpected JSON shape; refusing retry" >&2
        return 2
      fi

      version_present=$(jq -r --arg version "$EXPECTED_VERSION" '.versions[$version] != null' "$PACKUMENT_JSON")
      latest=$(jq -r '."dist-tags".latest // empty' "$PACKUMENT_JSON")
      if [ "$version_present" != true ]; then
        echo "INFO: npm $PACKAGE_NAME@$EXPECTED_VERSION is not visible in the packument yet; retryable visibility state"
        return 1
      fi
      if [ "$latest" != "$EXPECTED_VERSION" ]; then
        echo "FAIL: npm latest is ${latest:-missing}; expected $EXPECTED_VERSION" >&2
        return 2
      fi
      return 0
      ;;
    *)
      echo "FAIL: npm packument probe returned HTTP ${status:-error}; refusing retry" >&2
      return 2
      ;;
  esac
}

attempt=1
while [ "$attempt" -le "$attempt_limit" ]; do
  probe_status=0
  if probe_packument; then
    echo "INFO: npm $PACKAGE_NAME@$EXPECTED_VERSION is visible as latest; running the archived public verifier once"
    (cd "$ARCHIVE_ROOT" && TMPDIR="$VERIFY_ROOT/tmp" bash "$SOURCE_VERIFIER" "$EXPECTED_COMMIT" "$EXPECTED_PACKAGE_SHA256")
    exit $?
  else
    probe_status=$?
  fi
  if [ "$probe_status" -ne 1 ]; then
    exit "$probe_status"
  fi
  if [ "$attempt" -ge "$attempt_limit" ]; then
    echo "FAIL: npm $PACKAGE_NAME@$EXPECTED_VERSION did not become visible as latest within the bounded retry window" >&2
    exit 1
  fi

  next_attempt=$((attempt + 1))
  echo "INFO: retrying npm public verification (attempt $next_attempt/$attempt_limit) in ${delay}s"
  sleep "$delay"
  next_delay=$((delay * 2))
  if [ "$next_delay" -gt "$delay_limit" ]; then
    delay=$delay_limit
  else
    delay=$next_delay
  fi
  attempt=$next_attempt
done

echo "FAIL: public release verification exhausted its bounded retry window" >&2
exit 1
