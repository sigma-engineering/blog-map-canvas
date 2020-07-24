import React from "react";
import { drawMap, MapData } from "./draw";

function App() {
  return <MapCanvas />;
}

function MapCanvas() {
  const [data, setData] = React.useState<MapData>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    fetch("./data.bin")
      .then((d) => d.arrayBuffer())
      .then((ab) => {
        let i32Arr = new Int32Array(ab);

        let polygons: MapData = [];
        let i = 0;
        let scale = 10000;
        while (i < i32Arr.length) {
          let numPairs = i32Arr[i++];
          let poly: [number, number][] = [];
          for (let j = 0; j < numPairs; j++) {
            poly.push([i32Arr[i++] / scale, i32Arr[i++] / scale]);
          }
          polygons.push(poly);
        }

        return polygons;
      })
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
