import { VideoPlayer } from "../components/VedioTile";
import { useMedia } from "../hooks/vedio call/useMedia";

export const VedioCallPage = () => {
  const { localCameraStream } = useMedia();
  return (
    <>
      <VideoPlayer
        stream={localCameraStream}
        isLocal={true}
        isPinned={false}
        // key={}
        label="you"
      />
    </>
  );
};
