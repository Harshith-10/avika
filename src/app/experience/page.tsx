"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function VRPlayer() {
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Refs to access the DOM elements directly, similar to document.getElementById
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: Let me live bro
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    // A-Frame requires the window object, so we must dynamically import it
    // only after the component has mounted on the client side.
    import("aframe").then(() => {
      setAframeLoaded(true);
    });
  }, []);

  const handlePlay = () => {
    // 1. Play audio & video
    if (audioRef.current && videoRef.current) {
      audioRef.current.play();
      videoRef.current.play();
    }

    // 2. Tell A-Frame to enter VR / Fullscreen mode
    if (sceneRef.current) {
      const sceneEl = sceneRef.current;
      if (sceneEl.hasLoaded) {
        sceneEl.enterVR();
      } else {
        sceneEl.addEventListener("loaded", () => {
          sceneEl.enterVR();
        });
      }
    }

    // 3. Hide the play button
    setHasStarted(true);
  };

  // Prevent rendering the A-Frame scene on the server to avoid hydration errors
  if (!aframeLoaded) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading VR Engine...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      {!hasStarted && (
        <Button
          onClick={handlePlay}
          size="xl"
          variant="outline"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-999"
        >
          Enter VR Experience
        </Button>
      )}

      <a-scene ref={sceneRef} antialias="true">
        <a-assets>
          {/** biome-ignore lint/a11y/useMediaCaption: We assume the user using a VR platform can access it with no problems */}
          <audio
            id="my-audio"
            ref={audioRef}
            src="/audio.opus"
            crossOrigin="anonymous"
          />
          {/* React requires camelCase for playsInline and crossOrigin */}
          {/** biome-ignore lint/a11y/useMediaCaption: We assume the user using a VR platform can access it with no problems */}
          <video
            id="my-video"
            ref={videoRef}
            src="/video.mp4"
            crossOrigin="anonymous"
            playsInline
            loop
          />
        </a-assets>

        <a-audiosphere src="#my-audio" rotation="0 -90 0"></a-audiosphere>
        <a-videosphere src="#my-video" rotation="0 -90 0"></a-videosphere>

        <a-entity id="rig" position="0 0 0">
          <a-camera position="0 0 0" wasd-controls="enabled: false"></a-camera>
        </a-entity>
      </a-scene>
    </div>
  );
}
