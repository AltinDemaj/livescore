#!/usr/bin/env bash
set -euo pipefail

HOURS="${YOUTUBE_HOURS:-10}"
SEGMENT="public/loop-segment.mp4"
OUTPUT="public/youtube-10hours.mp4"
DURATION_SECONDS=$((HOURS * 3600))

echo "==> Rain for Sleeping — ${HOURS}-hour YouTube build"
echo "    Step 1: Render 10-minute master loop (1080p for manageable file size)"

if [[ ! -f "$SEGMENT" ]]; then
  npm run render:loop-segment
fi

echo "==> Step 2: Extend loop to ${HOURS} hours with ffmpeg"
ffmpeg -y \
  -stream_loop -1 \
  -i "$SEGMENT" \
  -c:v libx264 \
  -preset faster \
  -crf 20 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 192k \
  -movflags +faststart \
  -t "$DURATION_SECONDS" \
  "$OUTPUT"

echo "==> Done: $OUTPUT"
echo "    Upload this file to YouTube (see YOUTUBE.md)"
