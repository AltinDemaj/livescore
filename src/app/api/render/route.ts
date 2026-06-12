import { NextResponse } from "next/server";
import {
  createRenderJob,
  getActiveRenderJob,
  getRenderJob,
  type RenderJob,
} from "@/lib/render-jobs";
import { runRainVideoRender } from "@/lib/render-video";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const serializeJob = (job: RenderJob) => ({
  id: job.id,
  status: job.status,
  progress: Number(job.progress.toFixed(4)),
  renderedFrames: job.renderedFrames,
  encodedFrames: job.encodedFrames,
  message: job.message,
  outputUrl: job.outputUrl ?? null,
  error: job.error ?? null,
  startedAt: job.startedAt,
  updatedAt: job.updatedAt,
});

export async function POST() {
  const activeJob = getActiveRenderJob();

  if (activeJob) {
    return NextResponse.json(
      {
        ...serializeJob(activeJob),
        alreadyRunning: true,
      },
      { status: 202 },
    );
  }

  const job = createRenderJob();

  void runRainVideoRender(job.id);

  return NextResponse.json(
    {
      ...serializeJob(job),
      alreadyRunning: false,
    },
    { status: 202 },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json(
      { error: "Missing jobId query parameter" },
      { status: 400 },
    );
  }

  const job = getRenderJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Render job not found" }, { status: 404 });
  }

  return NextResponse.json(serializeJob(job));
}
