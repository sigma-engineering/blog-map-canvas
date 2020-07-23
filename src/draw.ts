const COLOR_FG = "#ccc";

export type MapData = [number, number][][];

export function drawMap(canvas: HTMLCanvasElement, data: MapData) {
  const dim = Math.min(window.innerWidth, window.innerHeight);
  const w = dim;
  const h = dim;

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const minX = Math.min(
    ...data.map((poly) => Math.min(...poly.map((p) => p[0])))
  );
  const maxX = Math.max(
    ...data.map((poly) => Math.max(...poly.map((p) => p[0])))
  );
  const minY = Math.min(
    ...data.map((poly) => Math.min(...poly.map((p) => p[1])))
  );
  const maxY = Math.max(
    ...data.map((poly) => Math.max(...poly.map((p) => p[1])))
  );

  const startTime = Date.now();
  const scaleX = (1 / (maxX - minX)) * w;
  const scaleY = (1 / (maxY - minY)) * h;
  const scale = Math.min(scaleX, scaleY);
  ctx.scale(scale, scale);
  ctx.translate(-minX, -minY);

  for (const polygon of data) {
    if (polygon.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i][0], polygon[i][1]);
    }
    ctx.fillStyle = COLOR_FG;
    ctx.fill();
  }

  let pointCount = data.reduce((acc, poly) => poly.length + acc, 0);
  console.log(
    `done drawing ${data.length} lines / (${pointCount} points) in ${
      Date.now() - startTime
    }ms`
  );
}
