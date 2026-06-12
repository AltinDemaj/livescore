export type CarSceneLayout = {
  width: number;
  height: number;
  groundY: number;
  horizonY: number;
  carCenterX: number;
  carBaseY: number;
  carScale: number;
};

export const getCarSceneLayout = (
  width: number,
  height: number,
): CarSceneLayout => ({
  width,
  height,
  groundY: height * 0.86,
  horizonY: height * 0.56,
  carCenterX: width * 0.5,
  carBaseY: height * 0.865,
  carScale: width * 0.0012,
});

type Point = { x: number; y: number };

const scalePoint = (point: Point, layout: CarSceneLayout): Point => ({
  x: layout.carCenterX + point.x * layout.carScale,
  y: layout.carBaseY + point.y * layout.carScale,
});

export const getCarBodyPath = (layout: CarSceneLayout): Point[] => {
  const pts: Point[] = [
    { x: -235, y: -88 },
    { x: -185, y: -148 },
    { x: -55, y: -172 },
    { x: 95, y: -168 },
    { x: 185, y: -148 },
    { x: 235, y: -108 },
    { x: 262, y: -58 },
    { x: 268, y: -8 },
    { x: 248, y: 4 },
    { x: -248, y: 4 },
    { x: -268, y: -12 },
    { x: -262, y: -62 },
  ];

  return pts.map((p) => scalePoint(p, layout));
};

export const getCarWindowPath = (layout: CarSceneLayout): Point[] => {
  const pts: Point[] = [
    { x: -168, y: -142 },
    { x: -42, y: -158 },
    { x: 88, y: -152 },
    { x: 178, y: -128 },
    { x: 162, y: -94 },
    { x: -138, y: -98 },
  ];

  return pts.map((p) => scalePoint(p, layout));
};

export const getCarHoodCrease = (layout: CarSceneLayout): Point[] => {
  const pts: Point[] = [
    { x: 95, y: -168 },
    { x: 185, y: -148 },
    { x: 235, y: -108 },
    { x: 262, y: -58 },
  ];

  return pts.map((p) => scalePoint(p, layout));
};

export const getSideMirror = (layout: CarSceneLayout) => ({
  x: layout.carCenterX - layout.carScale * 175,
  y: layout.carBaseY - layout.carScale * 108,
  w: layout.carScale * 22,
  h: layout.carScale * 14,
});

export const getHeadlights = (layout: CarSceneLayout) => [
  {
    x: layout.carCenterX + layout.carScale * 248,
    y: layout.carBaseY - layout.carScale * 28,
    r: layout.carScale * 16,
  },
  {
    x: layout.carCenterX + layout.carScale * 218,
    y: layout.carBaseY - layout.carScale * 42,
    r: layout.carScale * 11,
  },
];

export const getTaillights = (layout: CarSceneLayout) => [
  {
    x: layout.carCenterX - layout.carScale * 252,
    y: layout.carBaseY - layout.carScale * 32,
    r: layout.carScale * 10,
  },
];

export const tracePath = (
  context: CanvasRenderingContext2D,
  points: Point[],
  close = true,
) => {
  if (points.length === 0) {
    return;
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }
  if (close) {
    context.closePath();
  }
};

export const getCarSurfaceY = (x: number, layout: CarSceneLayout): number | null => {
  const body = getCarBodyPath(layout);
  const roof = body.slice(0, 6);
  let minX = Infinity;
  let maxX = -Infinity;

  for (const point of roof) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
  }

  if (x < minX || x > maxX) {
    return null;
  }

  const samples: number[] = [];
  for (let i = 0; i < roof.length; i++) {
    const a = roof[i];
    const b = roof[(i + 1) % roof.length];
    const left = Math.min(a.x, b.x);
    const right = Math.max(a.x, b.x);

    if (x >= left && x <= right && a.x !== b.x) {
      const t = (x - a.x) / (b.x - a.x);
      const y = a.y + (b.y - a.y) * t;
      samples.push(y);
    }
  }

  if (samples.length === 0) {
    return null;
  }

  return Math.min(...samples);
};

export const getWheelSpecs = (layout: CarSceneLayout) => [
  {
    cx: layout.carCenterX - layout.carScale * 148,
    cy: layout.carBaseY + 3,
    r: layout.carScale * 44,
  },
  {
    cx: layout.carCenterX + layout.carScale * 158,
    cy: layout.carBaseY + 3,
    r: layout.carScale * 44,
  },
];
