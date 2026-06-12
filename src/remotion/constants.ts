export const COMPOSITION_ID = "RainForSleeping";

export const COMPOSITION_WIDTH = 3840;
export const COMPOSITION_HEIGHT = 2160;
export const COMPOSITION_FPS = 60;

/** Each YouTube segment is a fully unique render (never looped). */
export const YOUTUBE_SEGMENT_MINUTES = 30;
export const YOUTUBE_SEGMENT_COUNT = 20;
export const YOUTUBE_TARGET_HOURS = 10;

export const YOUTUBE_SEGMENT_DURATION_IN_FRAMES =
  YOUTUBE_SEGMENT_MINUTES * 60 * COMPOSITION_FPS;

export const DEFAULT_DURATION_IN_FRAMES = YOUTUBE_SEGMENT_DURATION_IN_FRAMES;

export const DEFAULT_SEED = 42;
export const PARTICLE_COUNT = 3_200;

/** Random lightning every 22–95 seconds. */
export const THUNDER_MIN_INTERVAL_FRAMES = 22 * COMPOSITION_FPS;
export const THUNDER_MAX_INTERVAL_FRAMES = 95 * COMPOSITION_FPS;
