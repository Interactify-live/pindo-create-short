import {
  CSSProperties,
  ComponentRef,
  useCallback,
  useRef,
  useState,
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

function VideoPlayer({
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
    [],
  );

  const onVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onToggleVideoClick = useCallback(() => {
    if (!videoRef.current) {
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((prev) => !prev); // Optimized state update
  }, [isPlaying]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
              maxWidth: "auto",
              height: "calc(100vh - 92px)",
            }}
          >
            {media &&
              media.fileType === VideoType &&
              activeInteraction === -1 && (
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
              )}
            {media && media.fileType === VideoType ? (
              <MultipleNativePlayer
                onEnded={onVideoEnded}
                ref={videoRef}
                sources={[media.data]}
                loop
                onClick={onVideoClick}
              />
            ) : (
              <img
                src={media && media.data.src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "black",
                }}
              />
            )}
            {medias &&
              medias[activeMedia] &&
              medias[activeMedia].interactions.map((interaction, index) => (
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
              ))}
          </div>
        )}
      </Draggable.Container>
    </div>
  );
}

export { VideoPlayer };
