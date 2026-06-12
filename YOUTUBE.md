# YouTube Channel Setup & Upload Guide

I **cannot** create a YouTube channel or publish videos for you — that requires **your** Google account, identity verification, and manual upload. Follow this guide after running the 10-hour build.

## 1. Create your YouTube channel (5 minutes)

1. On your phone or computer, go to [https://www.youtube.com](https://www.youtube.com)
2. Sign in with your **Google account** (or create one)
3. Tap your profile picture → **Create a channel**
4. Choose a name, e.g. **Rain & Thunder Sleep**
5. Add a profile picture and banner (optional)

## 2. Build the 10-hour video

On a **desktop or powerful machine** (this takes hours):

```bash
npm install

# Renders a 10-minute master loop, then extends to 10 hours
npm run build:youtube-10h
```

Output file: **`public/youtube-10hours.mp4`**

> **Why not render 10 hours directly?**  
> 10 hours at 4K/60fps would be ~2 million frames and days of render time.  
> Professional ambient channels loop a high-quality 10-minute segment — viewers don't notice.

### Faster test (1-minute loop extended to 1 hour)

```bash
npm run render:loop-segment -- --frames=0-3599 --scale=0.35
ffmpeg -y -stream_loop -1 -i public/loop-segment.mp4 -c copy -t 3600 public/youtube-1hour-test.mp4
```

## 3. Upload to YouTube

1. Open [YouTube Studio](https://studio.youtube.com)
2. Click **Create** → **Upload video**
3. Select `public/youtube-10hours.mp4`
4. Use these settings:

| Field | Suggested value |
| --- | --- |
| **Title** | Rain on Car at Night for Sleeping \| 10 Hours Thunder & Lightning |
| **Description** | 10 hours of heavy rain on a parked car with distant city lights, thunder and lightning. Perfect for sleep, study, and relaxation. |
| **Category** | Entertainment or Music |
| **Audience** | Not made for kids |
| **Tags** | rain sounds, thunder, sleep, ambient, 10 hours, rain on car |

5. Set thumbnail (screenshot from the video at ~0:30)
6. Visibility: **Public** or **Unlisted** for testing
7. Click **Publish**

## 4. Monetization (optional, later)

- Requires **1,000 subscribers** and **4,000 watch hours** (YouTube Partner Program)
- Ambient/sleep channels often qualify after consistent uploads

## 5. Replace audio (recommended before upload)

Swap placeholder files in `public/audio/` with licensed high-quality rain/thunder loops from:

- [Pixabay Audio](https://pixabay.com/sound-effects/search/rain/)
- [Freesound](https://freesound.org) (check licenses)

Then re-run `npm run build:youtube-10h`.

## Automated upload (advanced)

YouTube Data API v3 can upload programmatically, but requires:

- Google Cloud project
- OAuth consent + your login
- `YOUTUBE_CLIENT_ID` / `YOUTUBE_REFRESH_TOKEN` env vars

This is intentionally not bundled — channel ownership must stay with you.
