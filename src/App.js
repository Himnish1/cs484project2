import React, { useState, useEffect } from "react";
import "./App.css";
import Frames from "./Frames";
import configData from "./config.json";

function App() {
  const [src, setSrc] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    Frames(configData.devIP, setData, setSrc).start();
  }, []);

  console.log(data);

  return (
    <div className="App">
      <img src={src} />
    </div>
  );
}

export default App;
