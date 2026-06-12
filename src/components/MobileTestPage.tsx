"use client";

import { MobileRainPreview } from "@/components/MobileRainPreview";
import { useIsMobile } from "@/hooks/use-is-mobile";

export const MobileTestPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#04070f] px-4 py-6 text-white">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-100/50">
          Rain Studio
        </p>
        <h1 className="mt-2 text-2xl font-light">Mobile Rain Preview</h1>
        <p className="mt-2 text-sm text-white/55">
          Optimized for Cursor mobile web. Forward port{" "}
          <code className="text-white/80">3000</code> and open this page on
          your phone.
        </p>
      </header>

      <MobileRainPreview />

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        <p className="font-medium text-white/80">Connection check</p>
        <p className="mt-2">
          Device: {isMobile ? "Mobile detected" : "Desktop / tablet"}
        </p>
        <p className="mt-1 break-all">
          URL: {typeof window !== "undefined" ? window.location.href : "—"}
        </p>
        <a
          href="/api/health"
          className="mt-3 inline-block text-sky-300"
          target="_blank"
          rel="noreferrer"
        >
          Test API health →
        </a>
      </div>
    </div>
  );
};
