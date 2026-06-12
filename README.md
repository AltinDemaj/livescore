# Rain for Sleeping — Remotion Video Studio

A Next.js App Router project integrated with Remotion to programmatically generate 4K, 60fps ambient rain videos for YouTube. The composition uses a deterministic HTML5 Canvas particle system, seeded thunder/lightning events, and synchronized audio loops.

## Tech Stack

- Next.js (App Router, TypeScript, Tailwind CSS)
- Remotion (`@remotion/player`, `@remotion/cli`, `@remotion/google-fonts`, `@remotion/bundler`, `@remotion/renderer`)
- HTML5 Canvas API for high-performance rain physics

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Dashboard with Remotion Player + render controls
│   └── api/render/route.ts      # Server-side Remotion bundle + render API
├── components/
│   ├── RainCanvas.tsx           # Canvas particle rain system
│   ├── RainPreviewPlayer.tsx    # Browser preview wrapper
│   └── RenderDashboard.tsx      # Render progress UI
├── lib/
│   ├── render-jobs.ts           # In-memory render job tracking
│   └── render-video.ts          # Remotion bundle + render pipeline
└── remotion/
    ├── index.ts                 # Remotion entry point
    ├── Root.tsx                 # Composition registration
    ├── RainComposition.tsx      # Main video composition
    ├── constants.ts             # 4K timing + particle constants
    └── thunder.ts               # Seeded thunder scheduling
public/
└── audio/
    ├── heavy-rain.mp3
    └── thunder.mp3
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the Next.js dashboard
npm run dev

# 3. Open Remotion Studio (optional, for frame-by-frame editing)
npm run remotion
```

Visit [http://localhost:3000](http://localhost:3000) to preview the composition and trigger a render.

## Mobile testing (Cursor mobile web)

1. Start the dev server (listens on all interfaces):
   ```bash
   npm run dev:mobile
   ```
2. In Cursor, **forward port `3000`** (Ports panel).
3. Open the forwarded HTTPS URL on your phone.
4. Go to **`/mobile`** for the lightweight test page, or stay on **`/`** (auto mobile mode).
5. Tap play on the **instant MP4 preview** (`/mobile-demo.mp4`).

Health check: `GET /api/health`

## Rendering

### Dashboard API

1. Click **Render 4K Video** on the dashboard.
2. The API creates a background job and returns a `jobId`.
3. Poll `GET /api/render?jobId=<id>` for progress.
4. When complete, download `/public/output.mp4`.

### CLI (local)

```bash
npm run render:local
```

## Composition Specs

| Setting | Value |
| --- | --- |
| Resolution | 3840 × 2160 (4K UHD) |
| Frame rate | 60 fps |
| Duration | 18,000 frames (5 minutes) |
| Rain particles | 2,800 canvas droplets |
| Thunder cadence | Every 45–60 seconds (seeded) |

## Audio Assets

Replace the generated placeholder files in `public/audio/` with your own high-quality loops:

- `heavy-rain.mp3` — continuous ambient rain bed (looped)
- `thunder.mp3` — short thunder rumble clips (triggered programmatically)

## Notes

- The canvas particle system is fully deterministic via Remotion's `random()` seeding, so identical frames always produce identical output during server renders.
- Full 4K renders are CPU/GPU intensive. Allow several minutes for a 5-minute export.
- For production deployments, consider moving renders to a dedicated worker or Remotion Lambda instead of the Next.js API route.
