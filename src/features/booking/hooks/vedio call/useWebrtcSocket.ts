import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { WEBRTC_EVENTS } from "../../types/vedioCall.types";

type useWebrtcSocket = {
  bookingId: string;
  socket: Socket | null;
};
export const useWertcSocket = ({ bookingId, socket }: useWebrtcSocket) => {
  if (!socket || !bookingId) {
    return;
  }

  useEffect(() => {
    socket.on(WEBRTC_EVENTS.USER_JOINED, (event) => {
      console.log(event);
    });

    socket.on(WEBRTC_EVENTS.SIGNALING_MESSAGE, (event) => {
      console.log(event);
    });

    return () => {
      socket.off(WEBRTC_EVENTS.USER_JOINED);
      socket.off(WEBRTC_EVENTS.SIGNALING_MESSAGE);
    };
  }, [socket]);
};
