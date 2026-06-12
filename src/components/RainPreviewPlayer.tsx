"use client";

import { Player } from "@remotion/player";
import { RainComposition } from "@/remotion/RainComposition";
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  DEFAULT_DURATION_IN_FRAMES,
  DEFAULT_SEED,
} from "@/remotion/constants";

export const RainPreviewPlayer: React.FC = () => {
  return (
    <Player
      component={RainComposition}
      inputProps={{ seed: DEFAULT_SEED }}
      durationInFrames={DEFAULT_DURATION_IN_FRAMES}
      compositionWidth={COMPOSITION_WIDTH}
      compositionHeight={COMPOSITION_HEIGHT}
      fps={COMPOSITION_FPS}
      controls
      loop
      style={{
        width: "100%",
        aspectRatio: `${COMPOSITION_WIDTH} / ${COMPOSITION_HEIGHT}`,
        borderRadius: "1rem",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
      }}
    />
  );
};
