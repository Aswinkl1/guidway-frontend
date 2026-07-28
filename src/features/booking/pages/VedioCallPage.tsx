import { useEffect, useState } from "react";
import { VideoPlayer } from "../components/VedioTile";
import { useMedia } from "../hooks/vedio call/useMedia";
import { Camera, CameraOff, Mic, MicOff, ScreenShare } from "lucide-react";
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
  const { handleSingallingMessage, handleUserJoined, remoteVedioStream } =
    usePeerConnection(socket, id, localCameraStream);

  useWertcSocket({
    bookingId: id,
    socket,
    handleSingaling: handleSingallingMessage,
    handleUserJoint: handleUserJoined,
  });

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
        <VideoPlayer
          stream={localScreenStream}
          isLocal={true}
          isPinned={false}
          // key={1}
          label="ScreenShare"
        />

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
        </div>
      </div>
    </>
  );
};
