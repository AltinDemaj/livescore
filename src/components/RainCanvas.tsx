import { useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import {
  generateCityscape,
  getWindowBrightness,
} from "@/lib/cityscape";
import {
  getCarBodyPath,
  getCarHoodCrease,
  getCarSceneLayout,
  getCarSurfaceY,
  getCarWindowPath,
  getHeadlights,
  getSideMirror,
  getTaillights,
  getWheelSpecs,
  tracePath,
} from "@/lib/car-scene";
import { getActiveLightningBolts } from "@/lib/lightning-bolts";
import { PARTICLE_COUNT } from "@/remotion/constants";
import { getLightningOpacity, getThunderEvents } from "@/remotion/thunder";

type RainParticle = {
  baseX: number;
  initialY: number;
  speed: number;
  length: number;
  thickness: number;
  opacity: number;
  phase: number;
  windAmplitude: number;
  depth: number;
};

type Splash = {
  x: number;
  y: number;
  age: number;
  radius: number;
  opacity: number;
  kind: "ground" | "car";
};

const createParticles = (
  seed: number,
  width: number,
  height: number,
): RainParticle[] => {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const particleSeed = `${seed}-particle-${index}`;
    const depth = random(`${particleSeed}-depth`);

    return {
      baseX: random(`${particleSeed}-x`) * width,
      initialY: random(`${particleSeed}-y`) * (height + 300) - 300,
      speed: 20 + random(`${particleSeed}-speed`) * 38 + depth * 12,
      length: 16 + random(`${particleSeed}-length`) * 48 + depth * 20,
      thickness: 0.7 + random(`${particleSeed}-thickness`) * 1.6,
      opacity: 0.1 + random(`${particleSeed}-opacity`) * 0.35 + depth * 0.2,
      phase: random(`${particleSeed}-phase`) * Math.PI * 2,
      windAmplitude: 8 + random(`${particleSeed}-wind`) * 22,
      depth,
    };
  });
};

const getParticlePosition = (
  particle: RainParticle,
  frame: number,
  height: number,
) => {
  const travelDistance = particle.initialY + particle.speed * frame;
  const cycleLength = height + particle.length + 120;
  const positionInCycle =
    ((travelDistance % cycleLength) + cycleLength) % cycleLength;
  const y = positionInCycle - particle.length;
  const x =
    particle.baseX +
    Math.sin(frame * 0.016 + particle.phase) * particle.windAmplitude;

  return { x, y, tipY: y + particle.length };
};

const drawSky = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  lightningFlash: number,
) => {
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, `rgba(8, 14, 28, ${1 - lightningFlash * 0.15})`);
  sky.addColorStop(0.45, `rgba(12, 20, 36, ${1 - lightningFlash * 0.1})`);
  sky.addColorStop(1, "rgba(4, 8, 14, 1)");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(
    width * 0.5,
    height * 0.15,
    0,
    width * 0.5,
    height * 0.2,
    width * 0.55,
  );
  glow.addColorStop(0, `rgba(90, 120, 180, ${0.08 + lightningFlash * 0.25})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
};

const drawCityscape = (
  context: CanvasRenderingContext2D,
  width: number,
  layout: ReturnType<typeof getCarSceneLayout>,
  seed: number,
  frame: number,
  lightningFlash: number,
) => {
  const buildings = generateCityscape(seed, width, layout.horizonY);

  context.fillStyle = "rgba(5, 8, 14, 0.92)";
  context.fillRect(0, layout.horizonY - 8, width, layout.height - layout.horizonY + 8);

  for (const building of buildings) {
    const alpha = 0.55 + building.depth * 0.4;
    const baseR = 10 + building.depth * 14;
    const baseG = 12 + building.depth * 16;
    const baseB = 20 + building.depth * 22;

    if (building.kind === "house") {
      context.fillStyle = `rgba(${baseR + 6}, ${baseG + 4}, ${baseB}, ${alpha})`;
      context.fillRect(building.x, building.y, building.width, building.height);
      context.fillStyle = `rgba(${18 + building.roofHue * 20}, ${14 + building.roofHue * 10}, ${20}, ${alpha})`;
      context.beginPath();
      context.moveTo(building.x - 4, building.y);
      context.lineTo(building.x + building.width * 0.5, building.y - building.height * 0.18);
      context.lineTo(building.x + building.width + 4, building.y);
      context.closePath();
      context.fill();
    } else {
      context.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${alpha})`;
      context.fillRect(building.x, building.y, building.width, building.height);
      context.fillStyle = `rgba(6, 8, 14, ${alpha * 0.9})`;
      context.fillRect(building.x + building.width * 0.08, building.y - 6, building.width * 0.84, 6);
    }

    for (const window of building.windows) {
      const brightness = getWindowBrightness(window, frame, lightningFlash);
      const r = 220 + window.warmth * 35;
      const g = 150 + window.warmth * 70;
      const b = 60 + window.warmth * 30;
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.25 + brightness * 0.65})`;
      context.fillRect(window.x, window.y, window.w, window.h);

      context.fillStyle = `rgba(255, 230, 170, ${brightness * 0.35})`;
      context.fillRect(window.x, window.y, window.w, window.h * 0.35);
    }
  }

  const cityGlow = context.createLinearGradient(0, layout.horizonY - 120, 0, layout.horizonY + 40);
  cityGlow.addColorStop(0, `rgba(255, 190, 100, ${0.04 + lightningFlash * 0.08})`);
  cityGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = cityGlow;
  context.fillRect(0, layout.horizonY - 120, width, 160);
};

const drawWetGround = (
  context: CanvasRenderingContext2D,
  width: number,
  layout: ReturnType<typeof getCarSceneLayout>,
  frame: number,
  lightningFlash: number,
) => {
  const ground = context.createLinearGradient(0, layout.horizonY, 0, layout.groundY + 80);
  ground.addColorStop(0, "rgba(10, 14, 22, 1)");
  ground.addColorStop(1, `rgba(18, 22, 30, ${0.95 + lightningFlash * 0.05})`);
  context.fillStyle = ground;
  context.fillRect(0, layout.horizonY, width, layout.groundY - layout.horizonY + 120);

  context.fillStyle = "rgba(8, 10, 16, 1)";
  context.fillRect(0, layout.groundY, width, layout.height - layout.groundY);

  for (let i = 0; i < 80; i++) {
    const y = layout.groundY + 8 + (i % 10) * 5;
    const shimmer = 0.03 + Math.sin(frame * 0.04 + i) * 0.02 + lightningFlash * 0.08;
    context.fillStyle = `rgba(120, 140, 170, ${shimmer})`;
    context.fillRect(0, y, width, 1);
  }

  for (let i = 0; i < 6; i++) {
    const px = width * (0.12 + i * 0.14);
    const py = layout.groundY + 18;
    const ripple = (frame * 0.8 + i * 40) % 60;
    context.strokeStyle = `rgba(150, 180, 220, ${0.15 - ripple * 0.002})`;
    context.lineWidth = 1.2;
    context.beginPath();
    context.ellipse(px, py, 20 + ripple, 6 + ripple * 0.2, 0, 0, Math.PI * 2);
    context.stroke();
  }
};

const drawCarReflection = (
  context: CanvasRenderingContext2D,
  layout: ReturnType<typeof getCarSceneLayout>,
  lightningFlash: number,
) => {
  const reflection = context.createLinearGradient(
    0,
    layout.carBaseY,
    0,
    layout.groundY + 80,
  );
  reflection.addColorStop(0, `rgba(80, 110, 150, ${0.22 + lightningFlash * 0.2})`);
  reflection.addColorStop(1, "rgba(10, 14, 22, 0)");
  context.fillStyle = reflection;
  context.fillRect(
    layout.carCenterX - layout.carScale * 280,
    layout.carBaseY,
    layout.carScale * 560,
    layout.groundY - layout.carBaseY + 60,
  );
};

const drawCar = (
  context: CanvasRenderingContext2D,
  layout: ReturnType<typeof getCarSceneLayout>,
  frame: number,
  lightningFlash: number,
) => {
  const body = getCarBodyPath(layout);
  const windowPath = getCarWindowPath(layout);
  const hoodCrease = getCarHoodCrease(layout);
  const wheels = getWheelSpecs(layout);
  const mirror = getSideMirror(layout);
  const headlights = getHeadlights(layout);
  const taillights = getTaillights(layout);

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.75)";
  context.shadowBlur = 42;
  context.shadowOffsetY = 22;
  tracePath(context, body);
  const bodyGradient = context.createLinearGradient(
    layout.carCenterX - layout.carScale * 260,
    layout.carBaseY - layout.carScale * 190,
    layout.carCenterX + layout.carScale * 260,
    layout.carBaseY,
  );
  bodyGradient.addColorStop(0, "rgba(34, 38, 48, 0.98)");
  bodyGradient.addColorStop(0.35, "rgba(20, 24, 32, 0.98)");
  bodyGradient.addColorStop(0.7, "rgba(12, 14, 20, 0.98)");
  bodyGradient.addColorStop(1, "rgba(8, 9, 14, 0.98)");
  context.fillStyle = bodyGradient;
  context.fill();
  context.restore();

  tracePath(context, body);
  const wetSheen = context.createLinearGradient(
    layout.carCenterX - layout.carScale * 220,
    layout.carBaseY - layout.carScale * 175,
    layout.carCenterX + layout.carScale * 140,
    layout.carBaseY - layout.carScale * 30,
  );
  wetSheen.addColorStop(0, `rgba(200, 225, 255, ${0.04 + lightningFlash * 0.22})`);
  wetSheen.addColorStop(0.28, `rgba(140, 175, 230, ${0.22 + lightningFlash * 0.3})`);
  wetSheen.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  context.fillStyle = wetSheen;
  context.fill();

  tracePath(context, hoodCrease, false);
  context.strokeStyle = "rgba(255, 255, 255, 0.06)";
  context.lineWidth = 1.5;
  context.stroke();

  context.fillStyle = "rgba(14, 16, 22, 0.95)";
  context.fillRect(mirror.x, mirror.y, mirror.w, mirror.h);
  context.fillStyle = `rgba(120, 150, 190, ${0.2 + lightningFlash * 0.25})`;
  context.fillRect(mirror.x + 2, mirror.y + 2, mirror.w - 4, mirror.h - 4);

  tracePath(context, windowPath);
  const glass = context.createLinearGradient(
    layout.carCenterX,
    layout.carBaseY - layout.carScale * 165,
    layout.carCenterX,
    layout.carBaseY - layout.carScale * 75,
  );
  glass.addColorStop(0, "rgba(24, 36, 58, 0.88)");
  glass.addColorStop(0.5, "rgba(12, 18, 32, 0.92)");
  glass.addColorStop(1, "rgba(6, 10, 18, 0.96)");
  context.fillStyle = glass;
  context.fill();

  tracePath(context, windowPath);
  context.strokeStyle = `rgba(170, 200, 240, ${0.18 + lightningFlash * 0.4})`;
  context.lineWidth = 2.2;
  context.stroke();

  context.strokeStyle = "rgba(80, 95, 120, 0.5)";
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(layout.carCenterX - layout.carScale * 10, layout.carBaseY - layout.carScale * 155);
  context.lineTo(layout.carCenterX - layout.carScale * 8, layout.carBaseY - layout.carScale * 92);
  context.stroke();

  for (let i = 0; i < 16; i++) {
    const wx = layout.carCenterX - layout.carScale * 130 + i * layout.carScale * 18;
    const wy = layout.carBaseY - layout.carScale * 135 + Math.sin(frame * 0.18 + i) * 2;
    context.strokeStyle = `rgba(190, 215, 245, ${0.06 + (i % 3) * 0.05})`;
    context.lineWidth = 0.9;
    context.beginPath();
    context.moveTo(wx, wy);
    context.lineTo(wx - 5, wy + 16 + (i % 5) * 3);
    context.stroke();
  }

  for (const wheel of wheels) {
    context.fillStyle = "rgba(4, 4, 6, 0.98)";
    context.beginPath();
    context.ellipse(wheel.cx, wheel.cy, wheel.r, wheel.r * 0.9, 0, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(42, 46, 54, 0.95)";
    context.lineWidth = layout.carScale * 9;
    context.beginPath();
    context.ellipse(wheel.cx, wheel.cy, wheel.r * 0.64, wheel.r * 0.56, 0, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = "rgba(70, 75, 85, 0.7)";
    context.lineWidth = layout.carScale * 2;
    for (let s = 0; s < 5; s++) {
      const angle = (s / 5) * Math.PI * 2 + frame * 0.01;
      context.beginPath();
      context.moveTo(wheel.cx, wheel.cy);
      context.lineTo(wheel.cx + Math.cos(angle) * wheel.r * 0.55, wheel.cy + Math.sin(angle) * wheel.r * 0.48);
      context.stroke();
    }
  }

  for (const light of headlights) {
    const glow = context.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.r * 3.5);
    glow.addColorStop(0, `rgba(255, 245, 210, ${0.35 + lightningFlash * 0.15})`);
    glow.addColorStop(0.4, "rgba(200, 220, 255, 0.08)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(light.x - light.r * 4, light.y - light.r * 4, light.r * 8, light.r * 8);
    context.fillStyle = "rgba(255, 248, 220, 0.9)";
    context.beginPath();
    context.ellipse(light.x, light.y, light.r, light.r * 0.75, 0, 0, Math.PI * 2);
    context.fill();
  }

  for (const light of taillights) {
    context.fillStyle = "rgba(180, 30, 30, 0.85)";
    context.beginPath();
    context.ellipse(light.x, light.y, light.r, light.r * 0.7, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(255, 80, 80, 0.35)";
    context.fillRect(light.x - light.r * 2, light.y - light.r, light.r * 2, light.r * 2);
  }

  context.strokeStyle = "rgba(255, 255, 255, 0.1)";
  context.lineWidth = 2;
  tracePath(context, body);
  context.stroke();
};

const drawLightningBolts = (
  context: CanvasRenderingContext2D,
  bolts: ReturnType<typeof getActiveLightningBolts>,
) => {
  for (const bolt of bolts) {
    context.save();
    context.shadowColor = "rgba(180, 220, 255, 0.9)";
    context.shadowBlur = 20;
    context.strokeStyle = `rgba(230, 245, 255, ${bolt.opacity})`;
    context.lineWidth = bolt.width;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(bolt.points[0].x, bolt.points[0].y);
    for (let i = 1; i < bolt.points.length; i++) {
      context.lineTo(bolt.points[i].x, bolt.points[i].y);
    }
    context.stroke();
    context.restore();
  }
};

const drawRainLayer = (
  context: CanvasRenderingContext2D,
  particles: RainParticle[],
  frame: number,
  width: number,
  height: number,
  minDepth: number,
  maxDepth: number,
) => {
  context.lineCap = "round";
  for (const particle of particles) {
    if (particle.depth < minDepth || particle.depth > maxDepth) {
      continue;
    }

    const { x, y } = getParticlePosition(particle, frame, height);
    const windOffset = particle.windAmplitude * 0.14;
    context.strokeStyle = `rgba(190, 215, 245, ${particle.opacity})`;
    context.lineWidth = particle.thickness;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x - windOffset, y + particle.length);
    context.stroke();
  }
};

const collectSplashes = (
  particles: RainParticle[],
  frame: number,
  width: number,
  layout: ReturnType<typeof getCarSceneLayout>,
): Splash[] => {
  const splashes: Splash[] = [];

  for (const particle of particles) {
    const { x, tipY } = getParticlePosition(particle, frame, layout.height);
    const wrappedX = ((x % width) + width) % width;
    const carSurfaceY = getCarSurfaceY(wrappedX, layout);

    if (carSurfaceY !== null && tipY >= carSurfaceY - 4 && tipY <= carSurfaceY + 10) {
      const age = tipY - carSurfaceY;
      if (age >= 0 && age <= 12) {
        splashes.push({
          x: wrappedX,
          y: carSurfaceY,
          age,
          radius: 2.5 + age * 0.9,
          opacity: Math.max(0, 0.5 - age * 0.04),
          kind: "car",
        });
      }
      continue;
    }

    if (tipY >= layout.groundY - 2 && tipY <= layout.groundY + 14) {
      const age = tipY - layout.groundY;
      if (age >= 0 && age <= 14) {
        splashes.push({
          x: wrappedX,
          y: layout.groundY,
          age,
          radius: 4 + age * 1.5,
          opacity: Math.max(0, 0.4 - age * 0.025),
          kind: "ground",
        });
      }
    }
  }

  return splashes;
};

const drawSplashes = (
  context: CanvasRenderingContext2D,
  splashes: Splash[],
) => {
  for (const splash of splashes) {
    context.strokeStyle =
      splash.kind === "car"
        ? `rgba(200, 225, 255, ${splash.opacity})`
        : `rgba(160, 190, 230, ${splash.opacity})`;
    context.lineWidth = splash.kind === "car" ? 1 : 1.3;
    context.beginPath();
    context.ellipse(
      splash.x,
      splash.y,
      splash.radius,
      splash.radius * (splash.kind === "car" ? 0.25 : 0.35),
      0,
      0,
      Math.PI * 2,
    );
    context.stroke();
  }
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
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useMemo(
    () => createParticles(seed, width, height),
    [seed, width, height],
  );

  const thunderEvents = useMemo(
    () => getThunderEvents(seed, durationInFrames),
    [seed, durationInFrames],
  );

  const lightningFlash = useMemo(() => {
    return thunderEvents.reduce((max, event) => {
      return Math.max(max, getLightningOpacity(frame, event));
    }, 0);
  }, [frame, thunderEvents]);

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

    const layout = getCarSceneLayout(width, height);
    const bolts = getActiveLightningBolts(
      seed,
      frame,
      width,
      height,
      thunderEvents,
    );

    drawSky(context, width, height, lightningFlash);
    drawCityscape(context, width, layout, seed, frame, lightningFlash);
    drawWetGround(context, width, layout, frame, lightningFlash);
    drawCarReflection(context, layout, lightningFlash);
    drawRainLayer(context, particles, frame, width, height, 0, 0.45);
    drawCar(context, layout, frame, lightningFlash);
    drawRainLayer(context, particles, frame, width, height, 0.45, 1);
    drawLightningBolts(context, bolts);

    const splashes = collectSplashes(particles, frame, width, layout);
    drawSplashes(context, splashes);

    const vignette = context.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.2,
      width / 2,
      height / 2,
      width * 0.75,
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.45)");
    context.fillStyle = vignette;
    context.fillRect(0, 0, width, height);
  }, [frame, height, lightningFlash, particles, seed, thunderEvents, width]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
};
