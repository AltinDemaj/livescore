import { random } from "remotion";
import {
  COMPOSITION_FPS,
  DEFAULT_DURATION_IN_FRAMES,
  THUNDER_MAX_INTERVAL_FRAMES,
  THUNDER_MIN_INTERVAL_FRAMES,
} from "./constants";

export type ThunderEvent = {
  frame: number;
  flashDuration: number;
  peakOpacity: number;
  audioVolume: number;
};

export const getThunderEvents = (
  seed: number,
  durationInFrames: number = DEFAULT_DURATION_IN_FRAMES,
): ThunderEvent[] => {
  const events: ThunderEvent[] = [];
  let frame = Math.floor(
    THUNDER_MIN_INTERVAL_FRAMES * 0.5 +
      random(`thunder-start-${seed}`) *
        (THUNDER_MAX_INTERVAL_FRAMES - THUNDER_MIN_INTERVAL_FRAMES) *
        0.25,
  );

  let index = 0;

  while (frame < durationInFrames) {
    const doubleStrike = random(`thunder-double-${seed}-${index}`) > 0.72;

    events.push({
      frame,
      flashDuration:
        5 + Math.floor(random(`thunder-flash-${seed}-${index}`) * 14),
      peakOpacity: 0.5 + random(`thunder-opacity-${seed}-${index}`) * 0.45,
      audioVolume: 0.6 + random(`thunder-volume-${seed}-${index}`) * 0.35,
    });

    if (doubleStrike && frame + 8 < durationInFrames) {
      events.push({
        frame: frame + 5 + Math.floor(random(`thunder-double-offset-${seed}-${index}`) * 8),
        flashDuration: 4 + Math.floor(random(`thunder-double-flash-${seed}-${index}`) * 6),
        peakOpacity: 0.35 + random(`thunder-double-opacity-${seed}-${index}`) * 0.35,
        audioVolume: 0.45 + random(`thunder-double-volume-${seed}-${index}`) * 0.25,
      });
    }

    const interval =
      THUNDER_MIN_INTERVAL_FRAMES +
      random(`thunder-interval-${seed}-${index}`) *
        (THUNDER_MAX_INTERVAL_FRAMES - THUNDER_MIN_INTERVAL_FRAMES);

    frame += Math.floor(interval);
    index += 1;
  }

  if (durationInFrames <= 20 * COMPOSITION_FPS) {
    const previewStrikes: ThunderEvent[] = [
      {
        frame: Math.floor(2.8 * COMPOSITION_FPS),
        flashDuration: 10,
        peakOpacity: 0.82,
        audioVolume: 0.85,
      },
      {
        frame: Math.floor(6.5 * COMPOSITION_FPS),
        flashDuration: 12,
        peakOpacity: 0.68,
        audioVolume: 0.8,
      },
    ];

    return [...previewStrikes, ...events]
      .filter((event, idx, arr) => {
        return (
          event.frame < durationInFrames &&
          arr.findIndex((other) => Math.abs(other.frame - event.frame) < 45) ===
            idx
        );
      })
      .sort((a, b) => a.frame - b.frame);
  }

  return events;
};

export const getLightningOpacity = (
  frame: number,
  event: ThunderEvent,
): number => {
  const localFrame = frame - event.frame;

  if (localFrame < 0 || localFrame > event.flashDuration + 4) {
    return 0;
  }

  if (localFrame <= 2) {
    return event.peakOpacity * (localFrame / 2);
  }

  if (localFrame <= event.flashDuration) {
    const decay =
      1 - (localFrame - 2) / Math.max(1, event.flashDuration - 2);
    return event.peakOpacity * decay;
  }

  const tailFrame = localFrame - event.flashDuration;
  return event.peakOpacity * 0.15 * (1 - tailFrame / 4);
};

export const formatThunderTimestamp = (frame: number): string => {
  const totalSeconds = Math.floor(frame / COMPOSITION_FPS);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
