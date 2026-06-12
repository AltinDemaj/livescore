"use client";

import dynamic from "next/dynamic";
import { RenderDashboard } from "@/components/RenderDashboard";
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  DEFAULT_DURATION_IN_FRAMES,
} from "@/remotion/constants";

const RainPreviewPlayer = dynamic(
  () =>
    import("@/components/RainPreviewPlayer").then(
      (module) => module.RainPreviewPlayer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-sm text-white/50">
        Loading Remotion player...
      </div>
    ),
  },
);

export const HomeDashboard: React.FC = () => {
  const durationMinutes = DEFAULT_DURATION_IN_FRAMES / COMPOSITION_FPS / 60;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04070f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,120,220,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.45em] text-sky-100/50">
            Remotion Studio
          </p>
          <h1 className="mt-3 text-4xl font-light tracking-tight text-white sm:text-5xl">
            Rain for Sleeping Video Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-white/60">
            Preview the ambient rain composition in the browser, then export a
            YouTube-ready 4K video with synchronized rain ambience and
            programmatic thunder events.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Live Preview</h2>
              <p className="text-xs uppercase tracking-[0.25em] text-white/45">
                {COMPOSITION_WIDTH}×{COMPOSITION_HEIGHT} · {COMPOSITION_FPS}fps
              </p>
            </div>
            <RainPreviewPlayer />
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-lg font-medium text-white">Composition</h2>
              <dl className="mt-4 space-y-3 text-sm text-white/65">
                <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                  <dt>Resolution</dt>
                  <dd className="text-white/85">3840 × 2160 (4K UHD)</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                  <dt>Frame rate</dt>
                  <dd className="text-white/85">60 fps</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                  <dt>Duration</dt>
                  <dd className="text-white/85">{durationMinutes} minutes</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/5 pb-3">
                  <dt>Particles</dt>
                  <dd className="text-white/85">2,800 canvas droplets</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Audio</dt>
                  <dd className="text-right text-white/85">
                    Looping rain + seeded thunder
                  </dd>
                </div>
              </dl>
            </div>

            <RenderDashboard />
          </section>
        </div>
      </div>
    </div>
  );
};
