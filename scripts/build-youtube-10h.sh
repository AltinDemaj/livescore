#!/usr/bin/env bash
set -euo pipefail

# YouTube Partner Program–friendly export:
# 20 unique 30-minute renders (different seeds) concatenated — NOT looped.

SEGMENTS="${YOUTUBE_SEGMENTS:-20}"
SEGMENT_MINUTES="${YOUTUBE_SEGMENT_MINUTES:-30}"
SCALE="${YOUTUBE_SCALE:-0.5}"
EVERY_NTH="${YOUTUBE_EVERY_NTH_FRAME:-1}"
SEG_DIR="public/youtube-segments"
OUTPUT="${YOUTUBE_OUTPUT:-public/youtube-10hours-unique.mp4}"
CONCAT_LIST="${SEG_DIR}/concat-list.txt"

mkdir -p "$SEG_DIR"

echo "==> YouTube 10-hour UNIQUE build (no looping)"
echo "    ${SEGMENTS} segments × ${SEGMENT_MINUTES} min each"
echo "    Each segment uses a different seed + segmentIndex"
echo ""

for i in $(seq 1 "$SEGMENTS"); do
  SEG_FILE="${SEG_DIR}/segment-$(printf '%03d' "$i").mp4"
  SEED=$((1000 + i * 173))

  if [[ -f "$SEG_FILE" ]]; then
    echo "    [skip] Segment ${i}/${SEGMENTS} already exists"
    continue
  fi

  echo "    [render] Segment ${i}/${SEGMENTS} (seed=${SEED})..."
  FRAME_END=$((SEGMENT_MINUTES * 60 * 60 - 1))
  RENDER_ARGS=(render src/remotion/index.ts RainForSleeping "$SEG_FILE"
    --props="{\"seed\":${SEED},\"segmentIndex\":${i}}"
    --scale="${SCALE}"
    --frames="0-${FRAME_END}")
  if [[ "$EVERY_NTH" != "1" ]]; then
    RENDER_ARGS+=(--every-nth-frame="${EVERY_NTH}")
  fi
  ./node_modules/.bin/remotion "${RENDER_ARGS[@]}"
done

echo ""
if [[ "$SEGMENTS" -eq 1 ]]; then
  echo "==> Single segment — copying to output..."
  cp "${SEG_DIR}/segment-001.mp4" "$OUTPUT"
else
  echo "==> Concatenating segments (no stream_loop)..."
  : > "$CONCAT_LIST"
  for i in $(seq 1 "$SEGMENTS"); do
    SEG_FILE="${SEG_DIR}/segment-$(printf '%03d' "$i").mp4"
    if [[ ! -f "$SEG_FILE" ]]; then
      echo "ERROR: Missing $SEG_FILE"
      exit 1
    fi
    printf "file '%s'\n" "$(realpath "$SEG_FILE")" >> "$CONCAT_LIST"
  done

  ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" \
    -c:v libx264 -preset faster -crf 20 -pix_fmt yuv420p \
    -c:a aac -b:a 192k -movflags +faststart \
    "$OUTPUT"
fi

echo ""
echo "==> Done: $OUTPUT"
echo "    Total runtime: ~$((SEGMENTS * SEGMENT_MINUTES)) minutes"
echo "    Upload to YouTube — see YOUTUBE.md"
