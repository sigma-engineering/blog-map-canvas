const COLOR_BG = "#111";
const COLOR_FG = "#ffffff";

export type MapData = [number, number][][];

export function drawMap(canvas: HTMLCanvasElement, data: MapData) {
  const retinaScale = 2;
  const dim = Math.min(window.innerWidth, window.innerHeight) * retinaScale;
  const w = dim;
  const h = dim;

  const ctx = canvas.getContext("2d")!;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, w, h);
  const xPad = 0.04;
  const yPad = 0.01;

  const minX =
    Math.min(...data.map((poly) => Math.min(...poly.map((p) => p[0])))) - xPad;
  const maxX =
    Math.max(...data.map((poly) => Math.max(...poly.map((p) => p[0])))) + xPad;
  const minY =
    Math.min(...data.map((poly) => Math.min(...poly.map((p) => p[1])))) - yPad;
  const maxY =
    Math.max(...data.map((poly) => Math.max(...poly.map((p) => p[1])))) + yPad;

  const startTime = Date.now();
  const scaleX = (1 / (maxX - minX)) * w;
  const scaleY = (1 / (maxY - minY)) * h;
  ctx.scale(scaleX, scaleY);
  ctx.translate(-minX, -minY);

  console.log("bounds: ", minX, maxX, minY, maxY);

  for (const polygon of data) {
    if (polygon.length === 0) continue;
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
