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
  jag: number,
): Point[] => {
  const points: Point[] = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;
  const step = (endY - startY) / segments;

  for (let i = 0; i < segments; i++) {
    x += (random(`${seed}-x-${i}`) - 0.5) * jag;
    y += step + random(`${seed}-y-${i}`) * 14;
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

    const boltCount = 1 + Math.floor(random(`bolt-count-${seed}-${event.frame}`) * 2);
    for (let b = 0; b < boltCount; b++) {
      const startX =
        width * (0.08 + random(`bolt-x-${seed}-${event.frame}-${b}`) * 0.84);
      const main = buildBolt(
        `bolt-main-${seed}-${event.frame}-${b}`,
        startX,
        0,
        height * (0.55 + random(`bolt-depth-${seed}-${event.frame}-${b}`) * 0.2),
        8 + Math.floor(random(`bolt-segs-${seed}-${event.frame}-${b}`) * 6),
        60 + random(`bolt-jag-${seed}-${event.frame}-${b}`) * 50,
      );

      bolts.push({
        points: main,
        opacity: opacity * (0.75 + random(`bolt-op-${seed}-${event.frame}-${b}`) * 0.25),
        width: 2.5 + random(`bolt-w-${seed}-${event.frame}-${b}`) * 2.5,
      });

      const branchCount = 1 + Math.floor(random(`branch-count-${seed}-${event.frame}-${b}`) * 2);
      for (let c = 0; c < branchCount; c++) {
        const branchStart = main[2 + Math.floor(random(`branch-at-${seed}-${event.frame}-${b}-${c}`) * (main.length - 3))];
        const branch = buildBolt(
          `bolt-branch-${seed}-${event.frame}-${b}-${c}`,
          branchStart.x,
          branchStart.y,
          branchStart.y + height * (0.08 + random(`branch-len-${seed}-${event.frame}-${b}-${c}`) * 0.18),
          4,
          40,
        );

        bolts.push({
          points: branch,
          opacity: opacity * (0.35 + random(`branch-op-${seed}-${event.frame}-${b}-${c}`) * 0.35),
          width: 1.2 + random(`branch-w-${seed}-${event.frame}-${b}-${c}`) * 1.2,
        });
      }
    }
  }

  return bolts;
};
