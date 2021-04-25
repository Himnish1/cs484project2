import React, { useState, useEffect } from "react";
import "./App.css";
import Frames from "./Frames";
import configData from "./config.json";

function App() {
  const exercises = ["arm_circles", "jumping_jacks", "knee_drives"];
  let twods = [];
  exercises.forEach((exercise) => {
    const twod = require(`./recordings_json/twod/${exercise}.json`);
    twods.push(twod);
  });
  const [src, setSrc] = useState();
  const [data, setData] = useState();
  const [frame_index, setFrameIndex] = useState(0);

  useEffect(() => {
    Frames(configData.prodIP, setData, setSrc).start();

    const interval = setInterval(() => {
      setFrameIndex(frame_index + 1);
    }, 300);
    return () => clearInterval(interval);
  }, [frame_index]);

  // console.log(frame_index);
  // console.log(data);
  // console.log(data && data.people ? Object.keys(data.people) : null);

  return (
    <div className="App">
      {exercises.map((exercise, index) => (
        <div key={index}>
          <div>{exercise} Recording</div>
          <img
            src={`data:image/pnjpegg;base64,${
              twods[index][frame_index % twods[index].length].src
            }`}
            alt={exercise}
          />
        </div>
      ))}
      <div>Live Feed</div>
      <img src={src} alt="live_feed" />
      {data && data.people
        ? Object.keys(data.people).map((person, index) => {
            // console.log(data.people[person]);
            const keypoints = data.people[person].keypoints;
            if (keypoints.RElbow && keypoints.LElbow)
              return (
                <div key={index}>
                  <div>Person {person}</div>
                  <div>X-Coordinate: {keypoints.RElbow[0].toFixed(2)}</div>
                  <div>Y-Coordinate: {keypoints.RElbow[1].toFixed(2)}</div>
                  <div>Z-Coordinate: {keypoints.RElbow[2].toFixed(2)}</div>
                  <div>
                    {keypoints.RElbow[1] < 0 && keypoints.LElbow[1] < 0
                      ? "Both Arms Raised!"
                      : keypoints.RElbow[1] < 0
                      ? "Right Arm Raised!"
                      : keypoints.LElbow[1] < 0
                      ? "Left Arm Raised!"
                      : "Nothing"}
                  </div>
                </div>
              );
            return null;
          })
        : null}
    </div>
  );
}

export default App;
