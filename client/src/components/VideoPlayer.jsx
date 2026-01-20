import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// import "videojs-contrib-quality-levels";
import "../utils/httpSourceSelector";
import "videojs-http-source-selector/dist/videojs-http-source-selector.css";

const VideoPlayer = ({ options, onReady }) => {
  const PlayerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!PlayerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (PlayerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      
      // ABS
    //   player.ready(() => {
    //     if (typeof player.httpSourceSelector === "function") {
    //       player.httpSourceSelector({
    //         default: "auto",
    //       });
    //     }
    //   });
    //   PlayerRef.current = player;
    }
  }, [options, onReady]);

  useEffect(() => {
    if (PlayerRef.current && !PlayerRef.current.isDisposed()) {
      PlayerRef.current.dispose();
      PlayerRef.current = null;
    }
  }, []);
  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
