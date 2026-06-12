import { Composition } from "remotion";
import {
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_ID,
  COMPOSITION_WIDTH,
  DEFAULT_DURATION_IN_FRAMES,
  DEFAULT_SEED,
} from "./constants";
import { RainComposition } from "./RainComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_ID}
        component={RainComposition}
        durationInFrames={DEFAULT_DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_WIDTH}
        height={COMPOSITION_HEIGHT}
        defaultProps={{
          seed: DEFAULT_SEED,
        }}
      />
    </>
  );
};
