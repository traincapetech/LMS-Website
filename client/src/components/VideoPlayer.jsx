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

      player.ready(() => {
        // Backward 10s button
        const backwardButton = player.controlBar.addChild("button", {}, 1);
        backwardButton.controlText("Backward 10s");
        backwardButton.addClass("vjs-seek-backward-10");
        backwardButton.el().innerHTML = `
          <div class="vjs-seek-button-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <text x="12" y="16" font-size="7" font-weight="bold" fill="currentColor" stroke-width="0" text-anchor="middle">10</text>
            </svg>
          </div>
        `;
        backwardButton.on("click", () => {
          player.currentTime(Math.max(0, player.currentTime() - 10));
        });

        // Forward 10s button
        const forwardButton = player.controlBar.addChild("button", {}, 2);
        forwardButton.controlText("Forward 10s");
        forwardButton.addClass("vjs-seek-forward-10");
        forwardButton.el().innerHTML = `
          <div class="vjs-seek-button-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <text x="12" y="16" font-size="7" font-weight="bold" fill="currentColor" stroke-width="0" text-anchor="middle">10</text>
            </svg>
          </div>
        `;
        forwardButton.on("click", () => {
          player.currentTime(
            Math.min(player.duration(), player.currentTime() + 10)
          );
        });

        // Keyboard Shortcuts
        const handleKeyDown = (e) => {
          // Ignore if user is typing in an input
          if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
            return;
          }

          if (e.key === "ArrowLeft") {
            e.preventDefault();
            player.currentTime(Math.max(0, player.currentTime() - 10));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            player.currentTime(
              Math.min(player.duration(), player.currentTime() + 10)
            );
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        player.on("dispose", () => {
          window.removeEventListener("keydown", handleKeyDown);
        });
      });
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
