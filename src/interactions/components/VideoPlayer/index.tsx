import {
  CSSProperties,
  ComponentRef,
  useCallback,
  useRef,
  useState,
} from "react";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import classnames from "classnames";
import { MultipleNativePlayer } from "../MultipleNativePlayer";
import { InteractionView } from "./InteractionView";
import styles from "./styles.module.scss";
import { Draggable } from "../../draggable";
import { Button } from "../../../components/Button";
import { InteractionItem, Video } from "../../types.d/types";

interface Props {
  className?: string;
  style?: CSSProperties;
  wrapperClassName?: string;
  interactions: InteractionItem[];
  setInteractions: React.Dispatch<React.SetStateAction<InteractionItem[]>>;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  videos: Video[];
  cover: string;
}

function VideoPlayer({
  wrapperClassName,
  className,
  style,
  interactions,
  setInteractions,
  activeInteraction,
  videos,
  cover,
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
          >
            {activeInteraction === -1 && (
              <Button
                onClick={onToggleVideoClick}
                shape="fill"
                className="rounded-circle pos-absolute right-0 mr-3 mb-3 z-10"
                color="white"
                style={{ bottom: 70 }}
                size="lg"
              >
                {isPlaying ? (
                  <PauseOutlined
                    style={{ fontSize: 16, color: "var(--color-neutral-80)" }}
                  />
                ) : (
                  <CaretRightOutlined
                    style={{ fontSize: 16, color: "var(--color-neutral-80)" }}
                  />
                )}
              </Button>
            )}
            <MultipleNativePlayer
              onEnded={onVideoEnded}
              className="w-full h-full"
              ref={videoRef}
              sources={videos}
              loop
              onClick={onVideoClick}
              cover={cover}
            />
            {interactions.map((interaction, index) => (
              <InteractionView
                index={index}
                key={index}
                interaction={interaction}
                interactions={interactions}
                setInteractions={setInteractions}
              />
            ))}
          </div>
        )}
      </Draggable.Container>
    </div>
  );
}

export { VideoPlayer };
