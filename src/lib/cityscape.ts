import { random } from "remotion";

export type WindowLight = {
  x: number;
  y: number;
  w: number;
  h: number;
  warmth: number;
  flickerPhase: number;
};

export type BuildingSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  kind: "house" | "tower" | "apartment";
  roofHue: number;
  windows: WindowLight[];
};

const buildWindows = (
  seed: string,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  cols: number,
  rows: number,
): WindowLight[] => {
  const windows: WindowLight[] = [];
  const padX = bw * 0.12;
  const padY = bh * 0.14;
  const cellW = (bw - padX * 2) / cols;
  const cellH = (bh - padY * 2) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = random(`${seed}-lit-${row}-${col}`) > 0.28;
      if (!lit) {
        continue;
      }

      windows.push({
        x: bx + padX + col * cellW + cellW * 0.18,
        y: by + padY + row * cellH + cellH * 0.2,
        w: cellW * 0.55,
        h: cellH * 0.45,
        warmth: 0.55 + random(`${seed}-warm-${row}-${col}`) * 0.45,
        flickerPhase: random(`${seed}-flicker-${row}-${col}`) * Math.PI * 2,
      });
    }
  }

  return windows;
};

export const generateCityscape = (
  seed: number,
  width: number,
  horizonY: number,
): BuildingSpec[] => {
  const buildings: BuildingSpec[] = [];

  for (let i = 0; i < 36; i++) {
    const kindRoll = random(`${seed}-kind-${i}`);
    const kind: BuildingSpec["kind"] =
      kindRoll > 0.72 ? "tower" : kindRoll > 0.38 ? "apartment" : "house";

    const bw =
      kind === "house"
        ? 55 + random(`${seed}-w-${i}`) * 75
        : kind === "apartment"
          ? 70 + random(`${seed}-w-${i}`) * 90
          : 35 + random(`${seed}-w-${i}`) * 55;

    const bh =
      kind === "house"
        ? 55 + random(`${seed}-h-${i}`) * 85
        : kind === "apartment"
          ? 90 + random(`${seed}-h-${i}`) * 140
          : 120 + random(`${seed}-h-${i}`) * 200;

    const bx = random(`${seed}-x-${i}`) * (width + 120) - 60;
    const by = horizonY - bh;

    buildings.push({
      x: bx,
      y: by,
      width: bw,
      height: bh,
      depth: random(`${seed}-depth-${i}`),
      kind,
      roofHue: random(`${seed}-roof-${i}`),
      windows: buildWindows(
        `${seed}-win-${i}`,
        bx,
        by,
        bw,
        bh,
        kind === "house" ? 2 : kind === "apartment" ? 3 : 2,
        kind === "house" ? 2 : kind === "apartment" ? 4 : 6,
      ),
    });
  }

  return buildings.sort((a, b) => a.depth - b.depth);
};

export const getWindowBrightness = (
  window: WindowLight,
  frame: number,
  lightningFlash: number,
): number => {
  const flicker =
    0.72 +
    Math.sin(frame * 0.03 + window.flickerPhase) * 0.08 +
    Math.sin(frame * 0.11 + window.flickerPhase * 2) * 0.05;

  return Math.min(1, flicker + lightningFlash * 0.45);
};
