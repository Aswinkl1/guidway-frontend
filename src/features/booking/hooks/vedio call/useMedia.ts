import { useState } from "react";

export const useMedia = () => {
  const [localScreenStream, setLocalScreenStream] =
    useState<MediaStream | null>(null);
  const [localCameraStream, setLocalCameraStream] =
    useState<MediaStream | null>(null);
  // const localScreenRef = useRef<mediast>();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalCameraStream(stream);
    return stream;
  };

  const startShareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    setLocalScreenStream(stream);
    return stream;
  };

  return {
    localCameraStream,
    startCamera,
    localScreenStream,
    startShareScreen,
  };
};
