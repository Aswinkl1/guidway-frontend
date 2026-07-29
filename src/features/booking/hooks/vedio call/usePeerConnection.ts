import type { Socket } from "socket.io-client";
import {
  SignalingType,
  WEBRTC_EVENTS,
  type SignalingMessage,
} from "../../types/vedioCall.types";
import { useCallback, useEffect, useRef, useState } from "react";

export const usePeerConnection = (
  socket: Socket | null,
  bookingId: string | undefined,
  localStream: MediaStream | null,
  localShareStream: MediaStream | null,
) => {
  if (!localStream) {
    console.log("no local stream");
  }
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteVedioStream, setRemoteVedioStream] =
    useState<MediaStream | null>(null);

  const localStreamRef = useRef<MediaStream | null>(localStream);
  // const localShareRef = useRef<MediaStream | null>(localShareStream);
  const screenSendersRef = useRef<RTCRtpSender[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    const pc = peerConnection.current;
    if (!pc) return;

    if (localShareStream) {
      localShareStream.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, localShareStream);
        screenSendersRef.current.push(sender);
      });
    } else {
      if (screenSendersRef.current.length > 0) {
        screenSendersRef.current.forEach((track) => {
          pc.removeTrack(track);
        });
        screenSendersRef.current = [];
      }
    }
  }, [localShareStream]);
  const CONFIG = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const initilizePeerConnection = useCallback(() => {
    if (peerConnection.current) {
      console.log("Cleaning up old connection...");
      peerConnection.current.onicecandidate = null;
      peerConnection.current.ontrack = null;
      peerConnection.current.close();
      peerConnection.current = null;
      setRemoteVedioStream(null);
    }
    const pc = new RTCPeerConnection(CONFIG);
    pc.onicecandidate = (event) => {
      console.log("icecandiate got", event.candidate);
      if (event.candidate && socket) {
        socket.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
          bookingId,
          message: { type: SignalingType.ICE_CANDIDATE, data: event.candidate },
        });
      }
    };

    pc.onnegotiationneeded = async (event) => {
      console.log("we are on negotation");
      if (pc.signalingState !== "stable") return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket?.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
        bookingId,
        message: { type: SignalingType.OFFER, data: offer },
      });

      console.log(
        "succeffully created the offer and emmited the singal from onnegotiationneeded",
      );
    };

    const currentStream = localStreamRef.current;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        console.log("adding track...");
        pc.addTrack(track, currentStream);
      });
    }

    pc.ontrack = (event) => {
      console.log("getting remote vedio");
      const incomingStream = event.streams[0];
      // setRemoteVedioStream(event.streams[0]);
      setRemoteStreams((prevStreams) => {
        if (prevStreams.some((s) => s.id === incomingStream.id)) {
          return prevStreams;
        }
        return [...prevStreams, incomingStream];
      });

      incomingStream.onremovetrack = () => {
        console.log("A remote track was removed!");
        // If the stream has no tracks left, it's completely dead. Delete it.
        if (incomingStream.getTracks().length === 0) {
          setRemoteStreams((prev) =>
            prev.filter((s) => s.id !== incomingStream.id),
          );
        }
      };
    };

    peerConnection.current = pc;
    return pc;
  }, [socket, bookingId]);

  const handleUserJoined = useCallback(async () => {
    console.log("user is jonniedez");
    console.log(localStreamRef.current);
    const pc = initilizePeerConnection();
    const currentStream = localStreamRef.current;

    console.log("currentStream", currentStream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket?.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
      bookingId,
      message: { type: SignalingType.OFFER, data: offer },
    });
  }, [initilizePeerConnection, socket, bookingId]);

  const handleSingallingMessage = useCallback(
    async (message: SignalingMessage) => {
      const pc = peerConnection.current || initilizePeerConnection();

      if (message.type == SignalingType.OFFER) {
        console.log("got the offer");

        await pc.setRemoteDescription(new RTCSessionDescription(message.data));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit(WEBRTC_EVENTS.SIGNALING_MESSAGE, {
          bookingId,
          message: { type: SignalingType.ANSWER, data: answer },
        });
      }

      if (message.type === SignalingType.ICE_CANDIDATE) {
        console.log("adding ice candidate");
        await pc.addIceCandidate(new RTCIceCandidate(message.data));
      }

      if (message.type === SignalingType.ANSWER) {
        console.log("got an answer");
        await pc.setRemoteDescription(message.data);
      }
    },
    [initilizePeerConnection, bookingId, socket],
  );

  return {
    handleSingallingMessage,
    handleUserJoined,
    remoteStreams,
  };
};
