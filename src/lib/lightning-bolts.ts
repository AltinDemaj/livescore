import { random } from "remotion";
import type { ThunderEvent } from "@/remotion/thunder";
import { getLightningOpacity } from "@/remotion/thunder";

type Point = { x: number; y: number };

export type LightningBolt = {
  points: Point[];
  opacity: number;
  width: number;
};

const buildBolt = (
  seed: string,
  startX: number,
  startY: number,
  endY: number,
  segments: number,
): Point[] => {
  const points: Point[] = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;
  const step = (endY - startY) / segments;

  for (let i = 0; i < segments; i++) {
    x += (random(`${seed}-x-${i}`) - 0.5) * 80;
    y += step + random(`${seed}-y-${i}`) * 12;
    points.push({ x, y });
  }

  return points;
};

export const getActiveLightningBolts = (
  seed: number,
  frame: number,
  width: number,
  height: number,
  events: ThunderEvent[],
): LightningBolt[] => {
  const bolts: LightningBolt[] = [];

  for (let index = 0; index < events.length; index++) {
    const event = events[index];
    const opacity = getLightningOpacity(frame, event);

    if (opacity <= 0.02) {
      continue;
    }

    const startX = width * (0.25 + random(`bolt-x-${seed}-${index}`) * 0.5);
    const main = buildBolt(
      `bolt-main-${seed}-${index}-${event.frame}`,
      startX,
      0,
      height * 0.72,
      10,
    );

    bolts.push({
      points: main,
      opacity: opacity * 0.95,
      width: 3.5,
    });

    const branchStart = main[Math.floor(main.length / 2)];
    const branch = buildBolt(
      `bolt-branch-${seed}-${index}-${event.frame}`,
      branchStart.x,
      branchStart.y,
      branchStart.y + height * 0.2,
      5,
    );

    bolts.push({
      points: branch,
      opacity: opacity * 0.65,
      width: 2,
    });
  }

  return bolts;
};
