# YouTube Monetization-Safe Export Guide

## Why we do NOT loop

YouTube's Partner Program policies penalize **repetitive, looped, or low-effort reused content**. Stretching a short clip to 10 hours with `ffmpeg -stream_loop` can:

- Get flagged as **reused / repetitive content**
- Block or limit **monetization**
- Reduce distribution in recommendations

This project instead renders **20 unique 30-minute segments** (different seeds, lightning schedules, city layouts, rain physics) and **concatenates** them into one 10-hour file. No segment is copied.

## Build the 10-hour video

```bash
npm install
npm run build:youtube-10h
```

### What this does

| Step | Detail |
| --- | --- |
| Segments | 20 × 30 minutes = **10 hours** |
| Uniqueness | Each segment gets a unique `seed` + `segmentIndex` |
| Output | `public/youtube-10hours-unique.mp4` |
| Resume | Re-run the script — already-rendered segments are skipped |

> **Render time:** Each 30-min 1080p segment can take 1–3+ hours. Full build may take **days** on one machine. Render overnight or use multiple machines for different segment numbers.

### Test with fewer segments first

```bash
YOUTUBE_SEGMENTS=2 YOUTUBE_SEGMENT_MINUTES=5 npm run build:youtube-10h
```

Produces ~10 minutes of unique content to verify before a full 10-hour build.

## Create your channel & upload

1. [youtube.com](https://www.youtube.com) → sign in → **Create a channel**
2. [studio.youtube.com](https://studio.youtube.com) → **Upload** → `youtube-10hours-unique.mp4`
3. Suggested title: **Rain on Car at Night for Sleeping | 10 Hours Thunder & Lightning**
4. Description: mention it's 10 hours of **unique** rain and thunder (not a short loop)

## Monetization checklist

- Use **original** programmatic visuals (this Remotion project ✓)
- Use **licensed** rain/thunder audio (replace `public/audio/` placeholders)
- Do **not** loop a short clip to fake duration ✗
- Add a real **thumbnail** and description
- Need **1,000 subscribers** + **4,000 watch hours** for YPP

## Segment files

Intermediate renders: `public/youtube-segments/segment-001.mp4` … `segment-020.mp4`

These are gitignored. Keep them until concat succeeds.
