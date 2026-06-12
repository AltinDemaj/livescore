export type RenderJobStatus = "queued" | "bundling" | "rendering" | "completed" | "failed";

export type RenderJob = {
  id: string;
  status: RenderJobStatus;
  progress: number;
  renderedFrames: number;
  encodedFrames: number;
  message: string;
  outputPath?: string;
  outputUrl?: string;
  error?: string;
  startedAt: number;
  updatedAt: number;
};

const globalForRenderJobs = globalThis as typeof globalThis & {
  __rainRenderJobs?: Map<string, RenderJob>;
};

const jobs =
  globalForRenderJobs.__rainRenderJobs ?? new Map<string, RenderJob>();

if (!globalForRenderJobs.__rainRenderJobs) {
  globalForRenderJobs.__rainRenderJobs = jobs;
}

export const createRenderJob = (): RenderJob => {
  const id = crypto.randomUUID();
  const job: RenderJob = {
    id,
    status: "queued",
    progress: 0,
    renderedFrames: 0,
    encodedFrames: 0,
    message: "Render queued",
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };

  jobs.set(id, job);
  return job;
};

export const getRenderJob = (id: string): RenderJob | undefined => {
  return jobs.get(id);
};

export const getActiveRenderJob = (): RenderJob | undefined => {
  return [...jobs.values()].find((job) =>
    ["queued", "bundling", "rendering"].includes(job.status),
  );
};

export const updateRenderJob = (
  id: string,
  patch: Partial<RenderJob>,
): RenderJob | undefined => {
  const current = jobs.get(id);
  if (!current) {
    return undefined;
  }

  const next: RenderJob = {
    ...current,
    ...patch,
    updatedAt: Date.now(),
  };

  jobs.set(id, next);
  return next;
};
