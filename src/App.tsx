import React from "react";
import { drawMap, MapData } from "./draw";

function App() {
  return <MapCanvas />;
}

function MapCanvas() {
  const [data, setData] = React.useState<MapData>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    fetch("./data.json")
      .then((d) => d.json())
      .then(setData);
  }, []);

  React.useEffect(() => {
    if (!data) return;
    drawMap(canvasRef.current!, data);
  }, [data]);

  return (
    <canvas ref={canvasRef} style={{ width: "100vmin", height: "100vmin" }} />
  );
}

export default App;
