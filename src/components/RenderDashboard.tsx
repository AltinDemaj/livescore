"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  COMPOSITION_FPS,
  DEFAULT_DURATION_IN_FRAMES,
} from "@/remotion/constants";

type RenderStatus = {
  id: string;
  status: "queued" | "bundling" | "rendering" | "completed" | "failed";
  progress: number;
  renderedFrames: number;
  encodedFrames: number;
  message: string;
  outputUrl: string | null;
  error: string | null;
};

const durationLabel = `${Math.round(DEFAULT_DURATION_IN_FRAMES / COMPOSITION_FPS / 60)} minutes`;

export const RenderDashboard: React.FC = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [renderStatus, setRenderStatus] = useState<RenderStatus | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollJob = useCallback(
    (jobId: string) => {
      stopPolling();

      pollRef.current = setInterval(async () => {
        const response = await fetch(`/api/render?jobId=${jobId}`);
        const data = (await response.json()) as RenderStatus;

        if (!response.ok) {
          stopPolling();
          setRenderStatus((current) =>
            current
              ? {
                  ...current,
                  status: "failed",
                  error: data.error ?? "Unable to fetch render status",
                }
              : null,
          );
          return;
        }

        setRenderStatus(data);

        if (data.status === "completed" || data.status === "failed") {
          stopPolling();
          setIsStarting(false);
        }
      }, 1500);
    },
    [stopPolling],
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const startRender = async () => {
    setIsStarting(true);
    setRenderStatus(null);

    const response = await fetch("/api/render", { method: "POST" });
    const data = (await response.json()) as RenderStatus & {
      alreadyRunning?: boolean;
    };

    if (!response.ok) {
      setIsStarting(false);
      setRenderStatus({
        id: "unknown",
        status: "failed",
        progress: 0,
        renderedFrames: 0,
        encodedFrames: 0,
        message: "Failed to start render",
        outputUrl: null,
        error: "The render API returned an error",
      });
      return;
    }

    setRenderStatus(data);
    pollJob(data.id);
  };

  const progressPercent = Math.round((renderStatus?.progress ?? 0) * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Export for YouTube</h2>
          <p className="mt-1 text-sm text-white/55">
            Renders a 3840×2160 · 60fps · {durationLabel} H.264 MP4 to{" "}
            <code className="text-white/75">/public/output.mp4</code>
          </p>
        </div>

        <Button
          onClick={startRender}
          disabled={
            isStarting ||
            renderStatus?.status === "bundling" ||
            renderStatus?.status === "rendering" ||
            renderStatus?.status === "queued"
          }
          className="min-w-[180px]"
        >
          {isStarting || renderStatus?.status === "bundling" || renderStatus?.status === "rendering"
            ? "Rendering..."
            : "Render 4K Video"}
        </Button>
      </div>

      {renderStatus ? (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>{renderStatus.message}</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid gap-2 text-xs text-white/45 sm:grid-cols-3">
            <p>Status: {renderStatus.status}</p>
            <p>Rendered frames: {renderStatus.renderedFrames}</p>
            <p>Encoded frames: {renderStatus.encodedFrames}</p>
          </div>

          {renderStatus.status === "completed" && renderStatus.outputUrl ? (
            <a
              href={renderStatus.outputUrl}
              className="inline-flex text-sm font-medium text-sky-300 hover:text-sky-200"
              download
            >
              Download output.mp4
            </a>
          ) : null}

          {renderStatus.error ? (
            <p className="text-sm text-red-300">{renderStatus.error}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
