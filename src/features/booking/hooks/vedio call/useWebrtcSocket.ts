import { useEffect, useRef } from "react";
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
  localCameraStream: MediaStream | null;
};
export const useWertcSocket = ({
  bookingId,
  socket,
  handleSingaling,
  handleUserJoint,
  localCameraStream,
}: useWebrtcSocket) => {
  const hasJoinedRoom = useRef<boolean>(false);
  useEffect(() => {
    if (!socket || !bookingId || !localCameraStream) {
      console.log(
        "soket or bookingid or localCameraStream is missing inside of useWebrtcSocket",
      );
      return;
    }
    if (!hasJoinedRoom.current) {
      console.log("emiited onse");
      socket.emit(WEBRTC_EVENTS.USER_JOINED, { bookingId });
      hasJoinedRoom.current = true;
    }

    socket.on(WEBRTC_EVENTS.USER_JOINED, handleUserJoint);

    socket.on(WEBRTC_EVENTS.SIGNALING_MESSAGE, handleSingaling);

    return () => {
      socket.off(WEBRTC_EVENTS.USER_JOINED);
      socket.off(WEBRTC_EVENTS.SIGNALING_MESSAGE);
    };
  }, [socket, localCameraStream]);
};
