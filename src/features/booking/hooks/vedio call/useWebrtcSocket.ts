import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import {
  WEBRTC_EVENTS,
  type SignalingMessage,
} from "../../types/vedioCall.types";

type useWebrtcSocket = {
  bookingId: string | undefined;
  socket: Socket | null;
  handleUserJoint: () => void;
  handleSingaling: (message: SignalingMessage) => void;
};
export const useWertcSocket = ({
  bookingId,
  socket,
  handleSingaling,
  handleUserJoint,
}: useWebrtcSocket) => {
  useEffect(() => {
    if (!socket || !bookingId) {
      console.log("dhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhajk");
      return;
    }
    socket.on(WEBRTC_EVENTS.USER_JOINED, handleUserJoint);

    socket.on(WEBRTC_EVENTS.SIGNALING_MESSAGE, handleSingaling);

    return () => {
      socket.off(WEBRTC_EVENTS.USER_JOINED);
      socket.off(WEBRTC_EVENTS.SIGNALING_MESSAGE);
    };
  }, [socket]);
};
