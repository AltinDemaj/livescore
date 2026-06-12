"use client";

export const MobileRainPreview: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
        <p className="text-sm font-medium text-sky-100">Mobile test mode</p>
        <p className="mt-1 text-xs leading-5 text-white/60">
          This lightweight clip plays instantly on phones. Use the forwarded
          Cursor port URL (port 3000) to open this page on mobile.
        </p>
      </div>

      <video
        className="w-full rounded-2xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        src="/mobile-demo.mp4"
        controls
        playsInline
        loop
        preload="metadata"
      />

      <p className="text-center text-xs text-white/45">
        10-second rain preview · includes audio · tap play
      </p>
    </section>
  );
};
