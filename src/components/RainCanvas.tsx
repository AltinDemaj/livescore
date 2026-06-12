import { useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { PARTICLE_COUNT } from "@/remotion/constants";

type RainParticle = {
  baseX: number;
  initialY: number;
  speed: number;
  length: number;
  thickness: number;
  opacity: number;
  phase: number;
  windAmplitude: number;
};

type Splash = {
  x: number;
  age: number;
  radius: number;
  opacity: number;
};

const createParticles = (
  seed: number,
  width: number,
  height: number,
): RainParticle[] => {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const particleSeed = `${seed}-particle-${index}`;

    return {
      baseX: random(`${particleSeed}-x`) * width,
      initialY: random(`${particleSeed}-y`) * (height + 200) - 200,
      speed: 16 + random(`${particleSeed}-speed`) * 34,
      length: 14 + random(`${particleSeed}-length`) * 42,
      thickness: 0.9 + random(`${particleSeed}-thickness`) * 1.8,
      opacity: 0.12 + random(`${particleSeed}-opacity`) * 0.42,
      phase: random(`${particleSeed}-phase`) * Math.PI * 2,
      windAmplitude: 6 + random(`${particleSeed}-wind`) * 18,
    };
  });
};

const collectSplashes = (
  particles: RainParticle[],
  frame: number,
  width: number,
  height: number,
): Splash[] => {
  const splashes: Splash[] = [];

  for (const particle of particles) {
    const travelDistance = particle.initialY + particle.speed * frame;
    const cycleLength = height + particle.length + 80;
    const positionInCycle =
      ((travelDistance % cycleLength) + cycleLength) % cycleLength;
    const bottomHit = positionInCycle - (height - particle.length);

    if (bottomHit >= 0 && bottomHit <= 14) {
      const x =
        particle.baseX +
        Math.sin(frame * 0.018 + particle.phase) * particle.windAmplitude;

      splashes.push({
        x: ((x % width) + width) % width,
        age: bottomHit,
        radius: 4 + bottomHit * 1.4,
        opacity: Math.max(0, 0.45 - bottomHit * 0.03),
      });
    }
  }

  return splashes;
};

export type RainCanvasProps = {
  seed?: number;
  className?: string;
};

export const RainCanvas: React.FC<RainCanvasProps> = ({
  seed = 42,
  className,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useMemo(
    () => createParticles(seed, width, height),
    [seed, width, height],
  );

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const devicePixelRatio =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(12, 20, 36, 0.15)");
    gradient.addColorStop(1, "rgba(4, 8, 18, 0.35)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.lineCap = "round";

    for (const particle of particles) {
      const travelDistance = particle.initialY + particle.speed * frame;
      const cycleLength = height + particle.length + 80;
      const positionInCycle =
        ((travelDistance % cycleLength) + cycleLength) % cycleLength;
      const y = positionInCycle - particle.length;
      const x =
        particle.baseX +
        Math.sin(frame * 0.018 + particle.phase) * particle.windAmplitude;

      context.strokeStyle = `rgba(168, 198, 230, ${particle.opacity})`;
      context.lineWidth = particle.thickness;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x - particle.windAmplitude * 0.12, y + particle.length);
      context.stroke();
    }

    const splashes = collectSplashes(particles, frame, width, height);
    for (const splash of splashes) {
      context.strokeStyle = `rgba(180, 210, 245, ${splash.opacity})`;
      context.lineWidth = 1.2;
      context.beginPath();
      context.ellipse(
        splash.x,
        height - 2,
        splash.radius,
        splash.radius * 0.35,
        0,
        0,
        Math.PI * 2,
      );
      context.stroke();
    }
  }, [frame, height, particles, width]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};
