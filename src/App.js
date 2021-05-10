import React, { useState, useEffect } from "react";
import "./App.css";
import Frames from "./Frames";
import configData from "./config.json";
import moment from "moment";

const exercises = ["arm_circles", "knee_drives", "jumping_jacks"];
let twods = [];
exercises.forEach((exercise) => {
  const twod = require(`./recordings_json/twod/${exercise}.json`);
  twods.push(twod);
});

function App() {
  const [live, setLive] = useState();
  const [message, setMessage] = useState("Come workout with us!");
  const [exercise, setExercise] = useState(0);
  const [start, setStart] = useState(false);
  const [select, setSelect] = useState(false);
  const [ready, setReady] = useState(false);
  const [liveData, setLiveData] = useState();
  const [exeData, setExeData] = useState();
  const [start_time, setStartTime] = useState();
  const [frame_index, setFrameIndex] = useState(0);

  useEffect(() => {
    Frames(configData.prodIP, setLiveData, setLive).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(frame_index + 1);
    }, 300);
    return () => clearInterval(interval);
  }, [frame_index]);

  useEffect(() => {
    console.log(liveData);
    console.log(select);
    console.log(ready);
    if (liveData && liveData.people) {
      let count = 0;
      for (let i = 0; i < Object.keys(liveData.people).length; i++) {
        if (liveData.people[i] && liveData.people[i].avg_position[2] <= 3350) {
          count++;
        }
      }
      console.log(count);
      if (count === 0) {
        setSelect(false);
        setMessage("Come workout with us!");
      }
      if (count > 1) {
        setSelect(false);
        setMessage("Only one person, please. I'm scared of large crowds.");
      }
      else {
        Object.keys(liveData.people).forEach((person) => {
          const pos = liveData.people[person].avg_position;
          const keypoints = liveData.people[person].keypoints;
          if (keypoints.RElbow && keypoints.RShoulder && keypoints.LElbow && keypoints.LShoulder && !start) {
            // if wrists are above people's eyes/heads, they're up
            if (!select && !ready && !start) {
              if (pos[2] > 3350) {
                return;
              } else if ((keypoints.RElbow[1] > keypoints.RShoulder[1] || keypoints.LElbow[1] > keypoints.LShoulder[1]) && !select) {
                setMessage(
                  "Raise your hands high like you're trying to touch the sky."
                );
              } else {
                setMessage("Ok, put your hands down.");
                setSelect(true);
              }
            } 
            else if (select && !ready && !start) {
              if (keypoints.RElbow[1] > keypoints.RShoulder[1] && keypoints.LElbow[1] > keypoints.LShoulder[1]) {                
                setReady(true);
              } 
            }
            else if (select && ready && !start) {
              if (keypoints.RElbow[1] > keypoints.RShoulder[1] && keypoints.LElbow[1] > keypoints.LShoulder[1]) {
                setMessage("Pick an exercise. Raise your right hand for an easy one, left hand for a medium one, and both hands for a harder one.");                
              } // both hands, hard exercise
              else if (ready && keypoints.RElbow[1] < keypoints.RShoulder[1] && keypoints.LElbow[1] < keypoints.LShoulder[1]) {
                setMessage("Get ready! Start, now!");
                setTimeout(() => {
                  setStart(true);
                  setExercise(2);
                  setMessage("");
                  setStartTime(Date.now());
                }, 300);
              }
              // easy exercise
              else if (ready && keypoints.RElbow[1] < keypoints.RShoulder[1]) {
                setMessage("Get ready! Start, now!");
                setTimeout(() => {
                  setStart(true);
                  setExercise(0);
                  setMessage("");
                  setStartTime(Date.now());
                }, 300);
              }
              // medium one
              else if (ready && keypoints.LElbow[1] < keypoints.LShoulder[1]) {
                setMessage("Get ready! Start, now!");
                setTimeout(() => {
                  setStart(true);
                  setExercise(1);
                  setMessage("");
                  setStartTime(Date.now());
                }, 300);
              }
            } 
          }
        });
      }
    }
  }, [liveData, message, start, select, ready]);

  const timer = moment().diff(start_time, "seconds");

  if (timer === 30) {
    setStart(false);
    setSelect(false);
    setReady(false);
    setStartTime(null);

    setMessage("You're done! Go enjoy your day :)");

    setTimeout(() => {
      setMessage("Come workout with us!");
    }, 5000);
  }
  

  return (
    <div className="view">
      {start 
        ? 
          <>
            <img className="live" src={live} alt="live feed" />
            {start_time ? <div id="timer">{30 - timer}</div> : null}
            <img className="exercise" src={`data:image/pnjpegg;base64,${
                twods[exercise][frame_index % twods[exercise].length].src
              }`} alt="exercise feed" />
          </>
        : 
          <h1 id="message">{message}</h1>
      }
    </div>
  );
}

export default App;
