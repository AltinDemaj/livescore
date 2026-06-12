import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RainCanvas } from "@/components/RainCanvas";
import { DEFAULT_SEED } from "./constants";
import { getLightningOpacity, getThunderEvents } from "./thunder";

export type RainCompositionProps = {
  seed?: number;
};

export const RainComposition: React.FC<RainCompositionProps> = ({
  seed = DEFAULT_SEED,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const thunderEvents = getThunderEvents(seed, durationInFrames);

  const lightningOpacity = thunderEvents.reduce((maxOpacity, event) => {
    return Math.max(maxOpacity, getLightningOpacity(frame, event));
  }, 0);

  const ambientVolume = interpolate(
    frame,
    [0, 120, durationInFrames - 120, durationInFrames],
    [0, 0.78, 0.78, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill className="bg-[#03050a]">
      <RainCanvas seed={seed} className="absolute inset-0 h-full w-full" />

      <AbsoluteFill
        style={{
          backgroundColor: `rgba(210, 230, 255, ${lightningOpacity * 0.35})`,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      <Audio
        src={staticFile("audio/heavy-rain.mp3")}
        volume={ambientVolume}
        loop
      />

      {thunderEvents.map((event, index) => (
        <Sequence
          key={`thunder-audio-${event.frame}-${index}`}
          from={event.frame}
          durationInFrames={5 * 60}
          layout="none"
        >
          <Audio
            src={staticFile("audio/thunder.mp3")}
            volume={event.audioVolume}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
