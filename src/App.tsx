import React from "react";
import css from "./App.module.css";

function App() {
  return (
    <div className={css.App}>
      <MapCanvas />
    </div>
  );
}

const colorTheme = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"];

function MapCanvas() {
  const [data, setData] = React.useState<[number, number][][]>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    fetch("./data.txt")
      .then((d) => d.text())
      .then((text) => {
        const lines = text
          .split("\n")
          .map((line) =>
            line
              .split(/\s+/)
              .map(
                (coord) => coord.split(",").map(parseFloat) as [number, number]
              )
          );

        setData(lines);
      });
  }, []);

  React.useEffect(() => {
    if (!data) return;

    // TODO dry up
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
    console.log(minX, maxX, minY, maxY);
    // const maxX = -75;
    // const minX = -78;
    // const maxY = 39;
    // const minY = 38;

    const ctx = canvasRef.current!.getContext("2d")!;

    const scaleX = (1 / (maxX - minX)) * w;
    const scaleY = (1 / (maxY - minY)) * h;
    ctx.scale(scaleX, scaleY);
    ctx.translate(-minX, -minY);

    ctx.fillStyle = colorTheme[1];
    ctx.fillRect(minX, minY, maxX - minX, maxY - minY);

    ctx.lineWidth = 1 / Math.min(scaleX, scaleY);

    for (const polygon of data) {
      if (polygon.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(polygon[0][0], polygon[0][1]);
      for (let i = 1; i < polygon.length; i++) {
        ctx.lineTo(polygon[i][0], polygon[i][1]);
      }
      ctx.fillStyle = colorTheme[3];
      ctx.strokeStyle = colorTheme[3];
      // ctx.closePath();
      // ctx.fill();
      ctx.stroke();
    }
    console.log("done drawing");
  }, [data]);

  const w = 800;
  const h = 800;
  return <canvas ref={canvasRef} width={w} height={h} />;
}

export default App;
