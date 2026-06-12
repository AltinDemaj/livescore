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
  horizonY: height * 0.58,
  carCenterX: width * 0.5,
  carBaseY: height * 0.86,
  carScale: width * 0.00115,
});

type Point = { x: number; y: number };

const scalePoint = (
  point: Point,
  layout: CarSceneLayout,
  offsetX = 0,
  offsetY = 0,
): Point => ({
  x: layout.carCenterX + (point.x + offsetX) * layout.carScale,
  y: layout.carBaseY + (point.y + offsetY) * layout.carScale,
});

export const getCarBodyPath = (layout: CarSceneLayout): Point[] => {
  const pts: Point[] = [
    { x: -220, y: -95 },
    { x: -170, y: -145 },
    { x: -40, y: -165 },
    { x: 120, y: -158 },
    { x: 210, y: -125 },
    { x: 250, y: -70 },
    { x: 255, y: -20 },
    { x: 235, y: 0 },
    { x: -235, y: 0 },
    { x: -250, y: -25 },
    { x: -245, y: -70 },
  ];

  return pts.map((p) => scalePoint(p, layout));
};

export const getCarWindowPath = (layout: CarSceneLayout): Point[] => {
  const pts: Point[] = [
    { x: -155, y: -138 },
    { x: -35, y: -152 },
    { x: 105, y: -145 },
    { x: 185, y: -118 },
    { x: 170, y: -88 },
    { x: -120, y: -92 },
  ];

  return pts.map((p) => scalePoint(p, layout));
};

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
  { cx: layout.carCenterX - layout.carScale * 145, cy: layout.carBaseY + 2, r: layout.carScale * 42 },
  { cx: layout.carCenterX + layout.carScale * 155, cy: layout.carBaseY + 2, r: layout.carScale * 42 },
];
