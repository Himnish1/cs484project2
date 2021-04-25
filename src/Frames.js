function Frames(ip, setData, setLive) {
  const url_frames = (ip) => `ws://${ip}:8888/frames`;
  const url_twod = (ip) => `ws://${ip}:8888/twod`;

  const framesObj = {
    socket_frames: null,
    socket_twod: null,

    start: () => {
      framesObj.socket_frames = new WebSocket(url_frames(ip));
      framesObj.socket_twod = new WebSocket(url_twod(ip));
      framesObj.socket_frames.onmessage = function (event) {
        framesObj.store(JSON.parse(event.data));
      };
      framesObj.socket_twod.onmessage = function (event) {
        framesObj.show(JSON.parse(event.data));
      };
    },

    show: (frame) => {
      setLive("data:image/pnjpegg;base64," + frame.src);
    },

    store: (frame) => {
      setData(frame);
    },
  };

  return framesObj;
}

export default Frames;
