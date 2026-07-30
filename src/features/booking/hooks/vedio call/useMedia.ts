import { useState } from "react";
import toast from "react-hot-toast";

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
    if (localScreenStream) {
      toast.error("Screen is already sharing");
      return;
    }
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const screenTrack = stream.getVideoTracks()[0];

    screenTrack.onended = () => {
      console.log("User clicked the native browser 'Stop sharing' button!");

      setLocalScreenStream(null);

      stream.getTracks().forEach((track) => track.stop());
    };
    setLocalScreenStream(stream);

    return stream;
  };

  const stopCamera = () => {
    if (localCameraStream) {
      localCameraStream.getTracks().forEach((track) => track.stop());
      setLocalCameraStream(null);
    }
  };

  const stopScreenShare = () => {
    if (localScreenStream) {
      localScreenStream.getTracks().forEach((track) => track.stop());
      setLocalScreenStream(null);
    }
  };
  return {
    stopCamera,
    localCameraStream,
    stopScreenShare,
    startCamera,
    localScreenStream,
    startShareScreen,
  };
};
