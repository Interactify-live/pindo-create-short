import {
  ComponentProps,
  ComponentRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { Video } from "../../types.d/types";

interface Source {
  src: string;
  trim?: { start: number; end: number };
  duration: number;
}

interface Props
  extends Omit<ComponentProps<typeof ReactPlayer>, "src" | "onEnded"> {
  sources: Source[];
  onClick: (props: { toggleMuted: () => void }) => void;
  cover?: string;
  autoPlay?: boolean;
}

interface Ref {
  getDuration: () => number;
  getCurrentTime: () => number;
  setCurrentTime: (currentTime: number) => void;
  onTimeUpdate: (callback: () => void) => void;
  play: VoidFunction;
  pause: VoidFunction;
}

const MultipleNativePlayerComponent = forwardRef<Ref, Props>(
  (
    { onEnded, sources, className, cover, onClick, loop, ...props }: Props,
    ref,
  ) => {
    useEffect(() => {
      console.log("SOURCE", sources);
    }, [sources]);
    const [isReady, setIsReady] = useState(false);
    const videosRef = useRef<Array<ComponentRef<typeof ReactPlayer> | null>>(
      Array.from({ length: sources.length }, () => null),
    );
    const [currentSource, setCurrentSource] = useState(0);
    const currentSourceRef = useRef(0);
    // const timeUpdateCallback = useRef(() => void 0);
    const timeUpdateCallback = useRef<() => void>(() => {});
    const endedRef = useRef(true);
    const isPlayingRef = useRef(props.autoPlay);
    const isMuted = useRef(props.muted);
    const getVideoElement = (index = currentSourceRef.current) => {
      const currentReactPlayerRef = videosRef.current[index];
      return currentReactPlayerRef?.getInternalPlayer() as
        | HTMLVideoElement
        | undefined;
    };
    const getDurationOfSource = (source: Source) => {
      if (source.trim) {
        return source.trim.end - source.trim.start;
      }
      return source.duration;
    };
    const getValidStartTime = (videoIndex: number) => {
      const start = sources[videoIndex].trim?.start || 0;
      const end = sources[videoIndex].trim?.end || sources[videoIndex].duration;

      const video = getVideoElement(videoIndex);
      if (!video) {
        return start;
      }

      if (video.currentTime < start || video.currentTime > end) {
        return start;
      }
      return video.currentTime;
    };

    const toggleMuted = useCallback(() => {
      const video = getVideoElement();
      isMuted.current = !isMuted.current;
      if (video) {
        video.muted = isMuted.current;
      }
    }, []);
    useImperativeHandle(ref, () => ({
      toggleMuted,
      pause: () => {
        getVideoElement()?.pause();
        isPlayingRef.current = false;
      },
      play: () => {
        getVideoElement()?.play();
        endedRef.current = false;
        isPlayingRef.current = true;
      },
      getDuration: () =>
        sources.reduce((acc, curr) => acc + getDurationOfSource(curr), 0),
      getCurrentTime: () => {
        let currentTime = sources
          .slice(0, currentSourceRef.current)
          .reduce((acc, curr) => acc + getDurationOfSource(curr), 0);

        const video = getVideoElement();
        if (video) {
          const start = sources[currentSourceRef.current].trim?.start || 0;
          currentTime += Math.max(video.currentTime - start, 0);
        }

        return currentTime;
      },
      setCurrentTime: (currentTime: number) => {
        for (let i = 0; i < sources.length; i++) {
          const duration = getDurationOfSource(sources[i]);
          if (currentTime < duration) {
            const video = getVideoElement(i);
            if (video) {
              const start = sources[i].trim?.start || 0;
              video.currentTime = currentTime + start;
            }

            setCurrentSource(i);
            currentSourceRef.current = i;
            break;
          } else {
            currentTime -= duration;
          }
        }
      },
      onTimeUpdate: (callback) => {
        timeUpdateCallback.current = callback;
      },
    }));

    const gotoNextSource = () => {
      if (currentSourceRef.current >= sources.length - 1 && !loop) {
        endedRef.current = true;
        isPlayingRef.current = false;
      }
      setCurrentSource((currentSource) => {
        const newCurrentSource = (currentSource + 1) % sources.length;
        currentSourceRef.current = newCurrentSource;
        const video = getVideoElement();
        if (video) {
          video.currentTime = getValidStartTime(newCurrentSource);
        }
        return newCurrentSource;
      });
    };

    useEffect(() => {
      const video = getVideoElement();
      if (!video) return;

      const onLoadedMetadata = (e: any) => {
        e.currentTarget.currentTime =
          sources[currentSourceRef.current].trim?.start || 0;
        if (isPlayingRef.current) {
          video.play();
        }
      };
      const onTimeUpdate = (e: Event) => {
        const video = e.currentTarget as HTMLVideoElement;
        timeUpdateCallback.current();

        const trimEnd =
          sources[currentSourceRef.current].trim?.end || video.duration;
        if (video.currentTime < trimEnd) return;

        gotoNextSource();
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("timeupdate", onTimeUpdate);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("timeupdate", onTimeUpdate);
      };
    }, [sources, currentSource, isReady]);

    if (sources.length === 0) {
      return (
        <div
          style={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            color: "rgb(87, 87, 87)",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          No video available
        </div>
      );
    }

    return (
      <div
        style={{
          backgroundImage: cover ? `url(${cover})` : "unset",
          backgroundSize: "100%",
          width: "100%",
          height: "100%",
        }}
      >
        {sources.map((source, index) => (
          <ReactPlayer
            playsinline
            onReady={() => {
              if (!isReady) {
                setIsReady(true);
              }
            }}
            key={source.src}
            {...props}
            wrapper={({ children }) => (
              <div
                onClick={() => onClick({ toggleMuted })}
                style={{
                  display: currentSource === index ? "block" : "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                {children}
              </div>
            )}
            muted={isMuted.current}
            url={source.src}
            ref={(ref) => (videosRef.current[index] = ref)}
            onEnded={() => {
              onEnded?.();
              if (loop && sources.length > 1) {
                gotoNextSource();
              }
            }}
          />
        ))}
      </div>
    );
  },
);

const MultipleNativePlayer = memo(MultipleNativePlayerComponent);
export { MultipleNativePlayer };
