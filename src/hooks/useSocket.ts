import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");

    socketInstance.on("connect", () => {
      console.log("socket connected");
    });

    socketInstance.on("disconnect", () => {
      console.log("socket disconnected");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance?.disconnect();
    };
  }, []);

  return socket;
};
