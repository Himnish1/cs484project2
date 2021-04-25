import React, { useState, useEffect } from "react";
import "./App.css";
import Frames from "./Frames";
import Exercises from "./Exercises";
import configData from "./config.json";
import moment from "moment";

function App() {
  const [live, setLive] = useState();
  const [exercise, setExercise] = useState();
  const [message, setMessage] = useState("Come workout with us!");
  const [start, setStart] = useState(false);
  const [liveData, setLiveData] = useState();
  const [exeData, setExeData] = useState();
  const [start_time, setStartTime] = useState();

  useEffect(() => {
    Frames(configData.prodIP, setLiveData, setLive).start();
    Exercises(setExeData, setExercise).start();
  }, []);

  useEffect(() => {
    console.log(message);
    if (liveData && liveData.people) {
      // if (liveData.people.length > 1) {
      //   setStart("Only one person, please. I'm scared of large crowds.");
      // }
      Object.keys(liveData.people).forEach((person) => {
        const pos = liveData.people[person].avg_position;
        const keypoints = liveData.people[person].keypoints;
        if (keypoints.RElbow && keypoints.LElbow && !start) {
          if (keypoints.RElbow[1] >= 0 && keypoints.LElbow[1] >= 0) {
            setMessage("Raise your elbows high like you're trying to touch the sky.");
          }
          else if (pos[2] > 3350) {
            setMessage("Come closer, we won't bite ;)");
          }
          else {
            setStart(true);
            setMessage("");
            setStartTime(Date.now());
          }
        }
      });
    }
  }, [liveData, message, start]);
  
  const timer = moment().diff(start_time, "seconds");
  if (timer === 30) {
    setStart(0);
    setStartTime(null);
  }

  return (
    <div className="view">
      <img className="live" src={live} alt="live feed" />
      {
      start
        ? 
          <>
            {start_time ? <div>{30 - timer}</div> : null}
            <img className="exercise" src={exercise} alt="exercise feed" />
          </>
        : <h1>{message}</h1>
      }   
    </div>
  );
}

export default App;
