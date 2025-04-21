import { ComponentRef, useEffect, useRef, useState } from "react";
import { isMobile, isSafari } from "react-device-detect";
import { CheckOutlined, SyncOutlined } from "@ant-design/icons";
import classnames from "classnames";
import { Button } from "../components/Button";
import { BrowseFileButton } from "./BrowseFileButton/BrowseFileButton";
import Progressbar from "./Progressbar/Progressbar";
import { VIDEO_MAX_DURATION } from "../shared/constants";
import useMediaRecorder from "./useMediaRecorder";
import RecordButton from "./RecordButton/RecordButton";

function getConstraints(videoDevice: InputDeviceInfo | null, index: number) {
  const ASPECT_RATIO = 9 / 16;
  let VIDEO_WIDTH = 750;
  let VIDEO_HEIGHT = VIDEO_WIDTH / ASPECT_RATIO;

  if (
    isMobile &&
    window.matchMedia("(orientation:portrait)").matches &&
    !isSafari
  ) {
    [VIDEO_HEIGHT, VIDEO_WIDTH] = [VIDEO_WIDTH, VIDEO_HEIGHT];
  }

  return {
    video: {
      ...(videoDevice ? { deviceId: videoDevice?.deviceId } : {}),
      frameRate: { ideal: 30 },
      width: { ideal: VIDEO_WIDTH },
      height: { ideal: VIDEO_HEIGHT },
    },
    audio: true,
  };
}

interface Props {
  onSelect: (file: File) => void;
  onSubmit: VoidFunction;
}
function Videos({ onSubmit, onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordButtonRef = useRef<ComponentRef<typeof RecordButton>>(null);

  const [videoDevices, setVideoDevices] = useState<InputDeviceInfo[]>([]);
  const [videoDeviceIndex, setVideoDeviceIndex] = useState<number>(0);
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((mediaDevices) => {
        let videoDevices: any = [];

        const clusteredByFacingMode = mediaDevices
          .filter((mediaDevice) => mediaDevice.kind === "videoinput")
          .map(
            (mediaDevice: any) =>
              [
                mediaDevice.getCapabilities?.()?.facingMode?.[0] || "unknown",
                mediaDevice,
              ] as const,
          )
          .reduce(
            (cluster: any, [facingMode, mediaDevice]) => ({
              ...cluster,
              [facingMode]: [...(cluster[facingMode] || []), mediaDevice],
            }),
            {},
          );

        for (const facingMode in clusteredByFacingMode) {
          const cluster = clusteredByFacingMode[facingMode];

          if (facingMode === "unknown") {
            videoDevices = videoDevices.concat(cluster);
            continue;
          }

          let selectedItem = null;
          let selectedItemWidth = Infinity;
          for (const clusterItem of cluster) {
            const capabilities = clusterItem.getCapabilities();
            const clusterItemWidth = capabilities.width.max;

            if (clusterItemWidth <= selectedItemWidth) {
              selectedItem = clusterItem;
              selectedItemWidth = clusterItemWidth;
            }
          }

          if (selectedItem !== null) {
            videoDevices.push(selectedItem);
          }
        }

        setVideoDevices(videoDevices);
      })
      .catch((e) => {
        console.error("enumerateDevices", e);
      });
  }, []);

  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        getConstraints(videoDevices[videoDeviceIndex], videoDeviceIndex),
      );

      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (e) {
      console.error("getUserMedia", e);
      throw e;
    }
  };
  const stopVideo = (stream = mediaStream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
  useEffect(() => {
    if (!videoDevices.length) {
      return;
    }

    let isUnmounted = false;
    let mediaStream: MediaStream | null = null;

    startVideo().then((stream) => {
      mediaStream = stream;

      if (isUnmounted) {
        stopVideo(stream);
      }
    });

    return () => {
      stopVideo(mediaStream);
      isUnmounted = true;
    };
  }, [videoDevices, videoDeviceIndex]);

  interface Video {
    file: File;
    duration: number;
    originDuration: number;
    trim: { start: number; end: number };
    src: string;
  }

  const [videos, setVideos] = useState<Video[]>([]);

  const totalVideosDuration = videos.reduce(
    (totalDuration, video) => totalDuration + video.duration,
    0,
  );
  const maxRecordableDuration =
    Math.max(VIDEO_MAX_DURATION - totalVideosDuration, 0) * 1000;
  const { record, stop, isRecording } = useMediaRecorder({
    onRecordStart: () => {
      recordButtonRef.current?.start(maxRecordableDuration);
    },
    maxDuration: maxRecordableDuration,
    onRecordEnd: (file) => {
      recordButtonRef.current?.stop();
      onSelect(file);
    },
  });
  const onSwitchCameraClick = () => {
    setVideoDeviceIndex(
      (videoDeviceIndex) => (videoDeviceIndex + 1) % videoDevices.length,
    );
  };

  return (
    <div className="pos-fixed w-full h-full">
      <Progressbar
        videos={[]}
        onDelete={() => {}}
        className="pos-absolute w-full p-6 z-10"
      />
      <video
        playsInline
        muted
        className="w-full h-full fit-cover"
        autoPlay
        ref={videoRef}
      />

      <div className="pos-absolute bottom-0 w-full d-flex flex-col ai-center">
        {videoDevices.length > 1 && (
          <Button
            onClick={onSwitchCameraClick}
            shape="fill"
            className={classnames("rounded-circle ratio-square", {
              "opacity-60": isRecording,
            })}
            bgColor="black-40p"
            disabled={isRecording}
          >
            <SyncOutlined className="color-white" />
          </Button>
        )}

        <div className="d-flex p-6 ai-center jc-between z-10 w-full">
          <BrowseFileButton disabled={isRecording} onSelect={onSelect} />
          {mediaStream && maxRecordableDuration > 0 && (
            <RecordButton
              ref={recordButtonRef}
              onClick={() => {
                if (isRecording) {
                  stop();
                } else {
                  record(mediaStream);
                }
              }}
            />
          )}
          <Button
            onClick={() => {
              if (!isRecording) {
                onSubmit();
              }
            }}
            // bgColor="primary-60"
            className={classnames("ratio-square", {
              "opacity-60": isRecording,
            })}
            style={{ width: 42, padding: 0 }}
          >
            <CheckOutlined className="color-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Videos;
