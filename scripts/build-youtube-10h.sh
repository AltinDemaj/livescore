#!/usr/bin/env bash
set -euo pipefail

# YouTube Partner Program–friendly export:
# 20 unique 30-minute renders (different seeds) concatenated — NOT looped.

SEGMENTS="${YOUTUBE_SEGMENTS:-20}"
SEGMENT_MINUTES="${YOUTUBE_SEGMENT_MINUTES:-30}"
SCALE="${YOUTUBE_SCALE:-0.5}"
SEG_DIR="public/youtube-segments"
OUTPUT="public/youtube-10hours-unique.mp4"
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
  npx remotion render src/remotion/index.ts RainForSleeping "$SEG_FILE" \
    --props="{\"seed\":${SEED},\"segmentIndex\":${i}}" \
    --scale="${SCALE}"
done

echo ""
echo "==> Concatenating segments (no stream_loop)..."
: > "$CONCAT_LIST"
for i in $(seq 1 "$SEGMENTS"); do
  SEG_FILE="${SEG_DIR}/segment-$(printf '%03d' "$i").mp4"
  if [[ ! -f "$SEG_FILE" ]]; then
    echo "ERROR: Missing $SEG_FILE"
    exit 1
  fi
  printf "file '%s'\n" "$SEG_FILE" >> "$CONCAT_LIST"
done

ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" \
  -c:v libx264 -preset faster -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart \
  "$OUTPUT"

echo ""
echo "==> Done: $OUTPUT"
echo "    Total runtime: ~$((SEGMENTS * SEGMENT_MINUTES)) minutes"
echo "    Upload to YouTube — see YOUTUBE.md"
