import { useEffect, useRef } from "react";
import { Pin } from "lucide-react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  label?: string;
  isPinned?: boolean;
  onPin?: () => void;
}

export function VideoPlayer({
  stream,
  isLocal = false,
  label,
  isPinned,
  onPin,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      onClick={onPin}
      className={`relative w-full h-full rounded-xl overflow-hidden bg-neutral-900 border-2 transition-all duration-200 cursor-pointer group ${
        isPinned
          ? "border-blue-500 ring-2 ring-blue-500/50"
          : "border-gray-800 hover:border-gray-600"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // ALWAYS mute local stream to prevent loud audio feedback loop!
        className="w-full h-full object-cover"
      />

      {/* Pin indicator - only shows on hover or when pinned */}
      <div
        className={`absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md p-1.5 transition-opacity ${
          isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Pin
          size={14}
          className={isPinned ? "text-blue-400 fill-blue-400" : "text-white"}
        />
      </div>

      {/* Participant Label */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium">
        {label || (isLocal ? "You" : "Peer")}
      </div>
    </div>
  );
}
