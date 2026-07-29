import { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "../components/VedioTile";
import { useMedia } from "../hooks/vedio call/useMedia";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { usePeerConnection } from "../hooks/vedio call/usePeerConnection";
import { useParams } from "react-router";
import { useWertcSocket } from "../hooks/vedio call/useWebrtcSocket";

export const VedioCallPage = () => {
  const [isMute, setIsMute] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const {
    localCameraStream,
    startCamera,
    startShareScreen,
    localScreenStream,
  } = useMedia();
  const socket = useSocket();
  const { id } = useParams();
  const {
    handleSingallingMessage,
    handleUserJoined,
    remoteStreams,
    messages,
    sendMessage,
  } = usePeerConnection(socket, id, localCameraStream, localScreenStream);

  useWertcSocket({
    bookingId: id,
    socket,
    handleSingaling: handleSingallingMessage,
    handleUserJoint: handleUserJoined,
    localCameraStream,
  });

  const chatInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    startCamera();
  }, []);

  function toggleMic() {
    const vedioTrack = localCameraStream?.getAudioTracks()[0];
    if (vedioTrack) {
      vedioTrack.enabled = !vedioTrack.enabled;
    }
    setIsMute((v) => !v);
  }

  function handleShareScreen() {
    startShareScreen();
  }

  function toggleCamera() {
    const vedioTrack = localCameraStream?.getVideoTracks()[0];
    if (vedioTrack) {
      vedioTrack.enabled = !vedioTrack.enabled;
    }
    setIsCameraOff((v) => !v);
  }

  // startCamera();
  const handleSendMessage = () => {
    const text = chatInputRef.current?.value;
    if (text && text.trim() !== "") {
      sendMessage(text);
      chatInputRef.current.value = "";
    }
  };

  function handleEndCall() {
    if (localCameraStream) {
      localCameraStream.getTracks().forEach((track) => track.stop());
    }

    if (localScreenStream) {
      localScreenStream.getTracks().forEach((track) => track.stop());
    }
  }

  return (
    <>
      <div className="absolute">
        <VideoPlayer
          stream={localCameraStream}
          isLocal={true}
          isPinned={false}
          // key={1}
          label="you"
        />
        {localScreenStream && (
          <VideoPlayer
            stream={localScreenStream}
            isLocal={true}
            isPinned={false}
            // key={1}
            label="ScreenShare"
          />
        )}
        {remoteStreams.map((stream) => {
          return (
            <VideoPlayer
              stream={stream}
              isLocal={true}
              isPinned={false}
              key={stream.id}
              label="friend"
            />
          );
        })}

        <div className="">
          <button className="border-2 rounded-full p-2" onClick={toggleMic}>
            {isMute ? <MicOff /> : <Mic />}
          </button>
          <button className="border-2 rounded-full p-2" onClick={toggleCamera}>
            {isCameraOff ? <CameraOff /> : <Camera />}
          </button>

          <button
            className="border-2 rounded-full p-2"
            onClick={handleShareScreen}
          >
            <ScreenShare />
          </button>
          <button
            className="border-2 border-red-600 bg-red-600 rounded-full p-2 text-white hover:bg-red-700 transition-colors"
            onClick={handleEndCall}
          >
            <PhoneOff />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 mt-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg w-fit max-w-[80%] ${
                msg.sender === "you"
                  ? "bg-blue-500 text-white self-end" // My messages go to the right
                  : "bg-gray-300 text-black self-start" // Their messages go to the left
              }`}
            >
              <span className="text-xs font-bold block mb-1">{msg.sender}</span>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex p-2 bg-white border-t-2 mt-5">
          <input
            type="text"
            ref={chatInputRef}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded-l-md"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-600 text-white px-4 font-bold rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
