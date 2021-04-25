function Exercises(setData, setSrc) {
  const recordedFr = 'ws://127.0.0.1:4444/frames';
  const recorded2D = 'ws://127.0.0.1:4444/twod';

  const exerciseObj = {
    socket_frames: null,
    socket_twod: null,

    start: () => {
      exerciseObj.socket_frames = new WebSocket(recordedFr);
      exerciseObj.socket_twod = new WebSocket(recorded2D);
      exerciseObj.socket_frames.onmessage = function (event) {
        exerciseObj.store(JSON.parse(event.data));
      };
      exerciseObj.socket_twod.onmessage = function (event) {
        exerciseObj.show(JSON.parse(event.data));
      };
    },

    show: (frame) => {
      setSrc("data:image/pnjpegg;base64," + frame.src);
    },

    store: (frame) => {
      setData(frame);
    },
  };

  return exerciseObj;
}

export default Exercises;
