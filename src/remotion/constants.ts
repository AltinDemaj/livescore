export const COMPOSITION_ID = "RainForSleeping";

export const COMPOSITION_WIDTH = 3840;
export const COMPOSITION_HEIGHT = 2160;
export const COMPOSITION_FPS = 60;
/** 10-minute seamless loop segment (render once, extend to 10 hours via ffmpeg). */
export const LOOP_SEGMENT_DURATION_IN_FRAMES = 10 * 60 * COMPOSITION_FPS;

export const DEFAULT_DURATION_IN_FRAMES = LOOP_SEGMENT_DURATION_IN_FRAMES;

export const YOUTUBE_TARGET_HOURS = 10;

export const DEFAULT_SEED = 42;
export const PARTICLE_COUNT = 3_200;

/** Random lightning every 22–95 seconds in long renders. */
export const THUNDER_MIN_INTERVAL_FRAMES = 22 * COMPOSITION_FPS;
export const THUNDER_MAX_INTERVAL_FRAMES = 95 * COMPOSITION_FPS;
