import React from "react";
import { times } from "lodash";
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
  return <p>Here is where the map will go</p>;
}

export default App;
