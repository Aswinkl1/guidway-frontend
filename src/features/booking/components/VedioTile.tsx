import { useEffect, useRef } from "react";

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

    // const playPromise = videoRef.current.play();

    // // 3. Handle the promise to prevent console errors
    // if (playPromise !== undefined) {
    //   playPromise.catch((error) => {
    //     // We can safely ignore AbortErrors caused by React mounting/unmounting
    //     if (error.name !== "AbortError") {
    //       console.error("Video playback failed:", error);
    //     }
    //   });
    // }
  }, [stream]);

  return (
    <div
      onClick={onPin}
      className={`relative rounded-xl overflow-hidden bg-black border-2 transition-all cursor-pointer ${
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

      {/* Participant Label */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium">
        {label || (isLocal ? "You" : "Peer")}
      </div>
    </div>
  );
}
