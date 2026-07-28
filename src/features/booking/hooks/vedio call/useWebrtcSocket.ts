import { useEffect } from "react";
import type { Socket } from "socket.io-client";

type useWebrtcSocket = {
  bookingId: string;
  socket: Socket | null;
};
export const useWertcSocket = ({ bookingId, socket }: useWebrtcSocket) => {
  if (!socket || !bookingId) {
    return;
  }

  useEffect(() => {
    socket.on("user-joined", (event) => {
      console.log(event);
    });
  }, [socket]);
};
