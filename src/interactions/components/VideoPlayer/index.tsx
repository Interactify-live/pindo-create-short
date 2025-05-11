import {
  CSSProperties,
  ComponentRef,
  useCallback,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import { MultipleNativePlayer } from "../MultipleNativePlayer";
import { InteractionView } from "./InteractionView";
import styles from "./styles.module.scss";
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
  }, [setIsPlaying]);
  const onToggleVideoClick = () => {
    if (!videoRef.current) {
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((isPlaying) => !isPlaying);
  };

  return (
    <div
      className={classnames(wrapperClassName, styles.container)}
      style={style}
    >
      <Draggable.Container>
        {({ ref }) => (
          <div
            ref={ref}
            className={classnames(
              className,
              "ratio-9-16 bg-neutral-30 lg:rounded-2 pos-relative overflow-hidden w-full h-full",
            )}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "black",
            }}
          >
            {media.fileType === VideoType && activeInteraction === -1 && (
              <button
                onClick={onToggleVideoClick}
                className="rounded-circle pos-absolute right-0 mr-3 mb-3 z-10"
                color="white"
                style={{
                  right: "calc(50% - 55px)",
                  padding: 0,
                  background: "none",
                  border: "none",
                }}
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            )}
            {media.fileType === VideoType ? (
              <MultipleNativePlayer
                onEnded={onVideoEnded}
                className="w-full h-full"
                ref={videoRef}
                sources={[media.data]}
                loop
                onClick={onVideoClick}
              />
            ) : (
              <img src={media.data.src} style={{ width: "100%" }} />
            )}
            {medias[activeMedia].interactions.map((interaction, index) => (
              <InteractionView
                index={index}
                key={index}
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
