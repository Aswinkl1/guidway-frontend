import { useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      auth: { token },
    });
    console.log("token", token);
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
