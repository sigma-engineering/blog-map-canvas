import React from "react";

function App() {
  return <MapCanvas />;
}

const colorTheme = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"];

function MapCanvas() {
  const [data, setData] = React.useState<[number, number][][]>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const w = window.innerWidth;
  const h = window.innerWidth;

  React.useEffect(() => {
    fetch("./data.txt")
      .then((d) => d.text())
      .then((text) => {
        const lines = text
          .split("\n")
          .map((line) =>
            line
              .split(" ")
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

    const ctx = canvasRef.current!.getContext("2d")!;

    ctx.fillStyle = colorTheme[1];
    ctx.fillRect(0, 0, w, w);

    const scaleX = (1 / (maxX - minX)) * w;
    const scaleY = (1 / (maxY - minY)) * h;
    const scale = Math.min(scaleX, scaleY);
    ctx.scale(scale, scale);
    ctx.translate(-minX, -minY);

    let i = 0;
    for (const polygon of data) {
      if (polygon.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(polygon[0][0], polygon[0][1]);
      for (let i = 1; i < polygon.length; i++) {
        ctx.lineTo(polygon[i][0], polygon[i][1]);
      }
      ctx.fillStyle = colorTheme[3];
      ctx.fill();
    }
    console.log(`done drawing ${data.length} lines`);
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      style={{ width: "100vmin", height: "100vmin" }}
    />
  );
}

export default App;
