import {
  CSSProperties,
  ComponentRef,
  useCallback,
  useRef,
  useState,
  memo,
} from "react";
import { MultipleNativePlayer } from "../MultipleNativePlayer";
import { InteractionView } from "./InteractionView";
import { Draggable } from "../../draggable";
import { Media, VideoType } from "../../types.d/types";
import Pause from "../../../icons/pause";
import Play from "../../../icons/play";

interface Props {
  className?: string;
  style?: CSSProperties;
  wrapperClassName?: string;
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  activeMedia: number;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  media: Media;
}

const VideoPlayer = memo(function VideoPlayer({
  wrapperClassName,
  className,
  style,
  medias,
  setMedias,
  activeMedia,
  activeInteraction,
  setActiveInteraction,
  media,
}: Props) {
  const videoRef = useRef<ComponentRef<typeof MultipleNativePlayer>>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onVideoClick = useCallback(
    ({ toggleMuted }: { toggleMuted: () => void }) => {
      toggleMuted();
    },
    []
  );

  const onVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onToggleVideoClick = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  // Memoize the play/pause button to prevent flickering
  const playPauseButton = useCallback(() => {
    if (!media || media.fileType !== VideoType || activeInteraction !== -1) {
      return null;
    }

    return (
      <button
        onClick={onToggleVideoClick}
        color="white"
        style={{
          right: "calc(50% - 35px)",
          padding: 0,
          background: "none",
          border: "none",
          borderRadius: "50%",
          position: "absolute",
          marginRight: "12px",
          marginBottom: "12px",
          zIndex: 40,
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
    );
  }, [media, activeInteraction, isPlaying, onToggleVideoClick]);

  // Memoize the media content to prevent unnecessary re-renders
  const mediaContent = useCallback(() => {
    if (!media) return null;

    if (media.fileType === VideoType) {
      return (
        <MultipleNativePlayer
          onEnded={onVideoEnded}
          ref={videoRef}
          sources={[media.data]}
          onClick={onVideoClick}
        />
      );
    } else {
      return (
        <img
          src={media?.data?.src}
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            backgroundColor: "black",
          }}
        />
      );
    }
  }, [media, onVideoEnded, onVideoClick]);

  // Memoize the interactions to prevent unnecessary re-renders
  const interactions = useCallback(() => {
    return medias?.[activeMedia]?.interactions.map((interaction, index) => (
      <InteractionView
        key={index}
        index={index}
        interaction={interaction}
        medias={medias}
        setMedias={setMedias}
        activeMedia={activeMedia}
        activeInteraction={activeInteraction}
        setActiveInteraction={setActiveInteraction}
      />
    ));
  }, [medias, activeMedia, activeInteraction, setActiveInteraction, setMedias]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      <Draggable.Container>
        {({ ref }) => (
          <div
            ref={ref}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "black",
              aspectRatio: "9 / 16",
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
              maxHeight: "100%",
            }}
          >
            {playPauseButton()}
            {mediaContent()}
            {interactions()}
          </div>
        )}
      </Draggable.Container>
    </div>
  );
});

export { VideoPlayer };
