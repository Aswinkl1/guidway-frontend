import type { Socket } from "socket.io-client";
import {
  SignalingType,
  WEBRTC_EVENTS,
  type SignalingMessage,
} from "../../types/vedioCall.types";
import { useCallback, useRef, useState } from "react";

export const usePeerConnection = (
  socket: Socket | null,
  bookingId: string | undefined,
  localStream: MediaStream | null,
) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteVedioStream, setRemoteVedioStream] =
    useState<MediaStream | null>(null);
  const CONFIG = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const initilizePeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(CONFIG);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
          bookingId,
          message: { type: SignalingType.ICE_CANDIDATE, data: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteVedioStream(event.streams[0]);
    };

    peerConnection.current = pc;
    return pc;
  }, [socket, bookingId]);

  const handleUserJoined = useCallback(async () => {
    const pc = initilizePeerConnection();

    localStream?.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);

    socket?.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
      bookingId,
      message: { type: SignalingType.OFFER, data: offer },
    });
  }, [initilizePeerConnection, socket, bookingId]);

  const handleSingallingMessage = useCallback(
    async (message: SignalingMessage) => {
      const pc = peerConnection.current || initilizePeerConnection();

      if (message.type == SignalingType.OFFER) {
        pc.setRemoteDescription(new RTCSessionDescription(message.data));
        const answer = await pc.createAnswer();
        pc.setLocalDescription(answer);
        socket?.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
          bookingId,
          message: { type: SignalingType.ANSWER, data: answer },
        });
      }

      if (message.type === SignalingType.ICE_CANDIDATE) {
        await pc.addIceCandidate(new RTCIceCandidate(message.data));
      }

      if (message.type === SignalingType.ANSWER) {
        pc.setRemoteDescription(message.data);
      }
    },
    [initilizePeerConnection, bookingId, socket],
  );

  return {
    remoteVedioStream,
    handleSingallingMessage,
    handleUserJoined,
  };
};
