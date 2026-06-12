import { loadFont } from "@remotion/google-fonts/Inter";
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

const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
});

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
    [0, 0.72, 0.72, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill className="bg-[#04070f] text-white">
      <AbsoluteFill
        className="bg-gradient-to-b from-[#0a1222] via-[#060b16] to-[#02040a]"
        style={{ fontFamily }}
      />

      <AbsoluteFill className="items-center justify-center px-[8%] py-[6%]">
        <div className="relative h-full w-full max-w-[88%]">
          <div className="absolute inset-0 rounded-[2.5rem] bg-sky-950/20 blur-3xl" />

          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/20 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-md">
            <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-white/5 px-10 py-6 backdrop-blur-xl">
              <div>
                <p className="text-sm font-light uppercase tracking-[0.45em] text-sky-100/55">
                  Ambient Sleep
                </p>
                <h1 className="mt-2 text-4xl font-light tracking-[0.08em] text-white/90">
                  Rain for Sleeping
                </h1>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-light tracking-[0.2em] text-white/60 backdrop-blur-lg">
                4K · 60FPS
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-[#0d1628]/80 via-[#09111f]/90 to-[#050912]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,170,255,0.12),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />

              <RainCanvas seed={seed} className="absolute inset-0 h-full w-full" />

              <div className="pointer-events-none absolute inset-0 border border-white/5" />
              <div className="pointer-events-none absolute inset-5 rounded-[1.5rem] border border-white/10" />
            </div>

            <div className="relative z-20 border-t border-white/10 bg-black/30 px-10 py-5 backdrop-blur-xl">
              <p className="text-center text-sm font-light tracking-[0.35em] text-white/45">
                Deep night rainfall · gentle thunder · crafted for rest
              </p>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255, 255, 255, ${lightningOpacity})`,
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
