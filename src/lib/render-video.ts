import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_ID,
  COMPOSITION_WIDTH,
  DEFAULT_DURATION_IN_FRAMES,
  DEFAULT_SEED,
} from "@/remotion/constants";
import { updateRenderJob } from "./render-jobs";

export const OUTPUT_FILENAME = "output.mp4";

export const runRainVideoRender = async (jobId: string): Promise<void> => {
  const projectRoot = process.cwd();
  const entryPoint = path.join(projectRoot, "src/remotion/index.ts");
  const outputLocation = path.join(projectRoot, "public", OUTPUT_FILENAME);

  try {
    updateRenderJob(jobId, {
      status: "bundling",
      progress: 0,
      message: "Bundling Remotion composition",
    });

    const serveUrl = await bundle({
      entryPoint,
      webpackOverride: (config) => ({
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config.resolve?.alias as Record<string, string>),
            "@": path.join(projectRoot, "src"),
          },
        },
      }),
      onProgress: (progress) => {
        updateRenderJob(jobId, {
          status: "bundling",
          progress: Math.min(0.2, progress * 0.2),
          message: `Bundling composition (${Math.round(progress * 100)}%)`,
        });
      },
    });

    const inputProps = {
      seed: DEFAULT_SEED,
    };

    const composition = await selectComposition({
      serveUrl,
      id: COMPOSITION_ID,
      inputProps,
    });

    updateRenderJob(jobId, {
      status: "rendering",
      progress: 0.2,
      message: "Rendering 4K frames",
    });

    await renderMedia({
      serveUrl,
      composition: {
        ...composition,
        width: COMPOSITION_WIDTH,
        height: COMPOSITION_HEIGHT,
        fps: COMPOSITION_FPS,
        durationInFrames: DEFAULT_DURATION_IN_FRAMES,
      },
      codec: "h264",
      outputLocation,
      inputProps,
      overwrite: true,
      concurrency: 4,
      imageFormat: "jpeg",
      jpegQuality: 90,
      onProgress: ({ progress, renderedFrames, encodedFrames }) => {
        updateRenderJob(jobId, {
          status: "rendering",
          progress: 0.2 + progress * 0.8,
          renderedFrames,
          encodedFrames,
          message: `Rendering video (${Math.round(progress * 100)}%)`,
        });
      },
    });

    updateRenderJob(jobId, {
      status: "completed",
      progress: 1,
      message: "Render completed successfully",
      outputPath: outputLocation,
      outputUrl: `/${OUTPUT_FILENAME}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown render error";

    updateRenderJob(jobId, {
      status: "failed",
      progress: 0,
      message: "Render failed",
      error: message,
    });
  }
};
