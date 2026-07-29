import { useEffect, useMemo, useRef, useState } from "react";
import { VideoPlayer } from "../components/VedioTile";
import { useMedia } from "../hooks/vedio call/useMedia";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  MessageSquare,
  PhoneOff,
  ScreenShare,
  X,
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { usePeerConnection } from "../hooks/vedio call/usePeerConnection";
import { useParams } from "react-router";
import { useWertcSocket } from "../hooks/vedio call/useWebrtcSocket";

// Unique key for each of the max-4 tiles so pin state can track them individually
type TileKey =
  | "local-cam"
  | "local-screen"
  | `remote-${string}`
  | "remote-screen";

export const VedioCallPage = () => {
  const [isMute, setIsMute] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pinnedId, setPinnedId] = useState<TileKey | null>(null);

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

  // Build the list of tiles (max 4) with stable keys, in one place,
  // so both pinned-tile lookup and the thumbnail rail stay in sync.
  const tiles = useMemo(() => {
    const list: {
      key: TileKey;
      stream: MediaStream;
      isLocal: boolean;
      label: string;
    }[] = [];

    if (localCameraStream) {
      list.push({
        key: "local-cam",
        stream: localCameraStream,
        isLocal: true,
        label: "You",
      });
    }
    if (localScreenStream) {
      list.push({
        key: "local-screen",
        stream: localScreenStream,
        isLocal: true,
        label: "Your Screen",
      });
    }
    remoteStreams.forEach((stream, idx) => {
      // Assumes at most one remote camera + one remote screen share stream;
      // if your remoteStreams array tags streams with a type, swap this logic in.
      const isScreen = idx === 1 && remoteStreams.length > 1;
      list.push({
        key: isScreen ? "remote-screen" : (`remote-${stream.id}` as TileKey),
        stream,
        isLocal: false,
        label: isScreen ? "Their Screen" : "Peer",
      });
    });

    return list;
  }, [localCameraStream, localScreenStream, remoteStreams]);

  const pinnedTile = tiles.find((t) => t.key === pinnedId) ?? null;
  const sideTiles = pinnedTile
    ? tiles.filter((t) => t.key !== pinnedTile.key)
    : [];

  function togglePin(key: TileKey) {
    setPinnedId((current) => (current === key ? null : key));
  }

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col overflow-hidden">
      {/* Main stage: video area + chat drawer share this row */}
      <div className="flex-1 flex min-h-0">
        {/* Video area — shrinks when chat opens */}
        <div className="flex-1 min-w-0 flex p-4 gap-3">
          {pinnedTile ? (
            <>
              {/* Big pinned tile */}
              <div className="flex-1 min-w-0 h-full">
                <VideoPlayer
                  stream={pinnedTile.stream}
                  isLocal={pinnedTile.isLocal}
                  isPinned={true}
                  label={pinnedTile.label}
                  onPin={() => togglePin(pinnedTile.key)}
                />
              </div>

              {/* Vertical thumbnail rail for the rest */}
              {sideTiles.length > 0 && (
                <div className="w-40 sm:w-48 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">
                  {sideTiles.map((t) => (
                    <div
                      key={t.key}
                      className="w-full aspect-video flex-shrink-0"
                    >
                      <VideoPlayer
                        stream={t.stream}
                        isLocal={t.isLocal}
                        isPinned={false}
                        label={t.label}
                        onPin={() => togglePin(t.key)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* No pin yet — equal grid, up to 4 tiles */
            <div
              className={`w-full h-full grid gap-3 ${
                tiles.length <= 1
                  ? "grid-cols-1"
                  : tiles.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2"
              }`}
            >
              {tiles.map((t) => (
                <VideoPlayer
                  key={t.key}
                  stream={t.stream}
                  isLocal={t.isLocal}
                  isPinned={false}
                  label={t.label}
                  onPin={() => togglePin(t.key)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat drawer — slides in, video area above already shrank via flex-1/min-w-0 */}
        {isChatOpen && (
          <div className="w-full max-w-sm flex-shrink-0 h-full bg-neutral-900 border-l border-neutral-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <span className="text-white font-semibold text-sm">Chat</span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg w-fit max-w-[85%] text-sm ${
                    msg.sender === "you"
                      ? "bg-blue-600 text-white self-end"
                      : "bg-neutral-800 text-white self-start"
                  }`}
                >
                  <span className="text-[10px] font-bold block mb-1 opacity-70">
                    {msg.sender}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex p-3 gap-2 border-t border-neutral-800">
              <input
                type="text"
                ref={chatInputRef}
                placeholder="Type a message..."
                className="flex-1 bg-neutral-800 text-white text-sm border border-neutral-700 p-2 rounded-md focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-md text-sm font-semibold transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating control bar */}
      <div className="flex-shrink-0 flex justify-center pb-6 pt-2">
        <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full px-3 py-2 shadow-xl">
          <button
            className={`rounded-full p-3 transition-colors ${
              isMute
                ? "bg-red-600 text-white"
                : "bg-neutral-800 text-white hover:bg-neutral-700"
            }`}
            onClick={toggleMic}
          >
            {isMute ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            className={`rounded-full p-3 transition-colors ${
              isCameraOff
                ? "bg-red-600 text-white"
                : "bg-neutral-800 text-white hover:bg-neutral-700"
            }`}
            onClick={toggleCamera}
          >
            {isCameraOff ? <CameraOff size={20} /> : <Camera size={20} />}
          </button>

          <button
            className="rounded-full p-3 bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            onClick={handleShareScreen}
          >
            <ScreenShare size={20} />
          </button>

          <button
            className={`rounded-full p-3 transition-colors ${
              isChatOpen
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-white hover:bg-neutral-700"
            }`}
            onClick={() => setIsChatOpen((v) => !v)}
          >
            <MessageSquare size={20} />
          </button>

          <button
            className="rounded-full p-3 bg-red-600 hover:bg-red-700 text-white transition-colors ml-1"
            onClick={handleEndCall}
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
