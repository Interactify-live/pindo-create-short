import { ComponentRef, useEffect, useRef, useState } from "react";
import { BrowseFileButton } from "./BrowseFileButton/BrowseFileButton";
import useMediaRecorder from "./useMediaRecorder";
import RecordButton from "./RecordButton/RecordButton";
import FlashButton from "./FlashButton/FlashButton";
import CloseButton from "./CloseButton/CloseButton";
import {
  FileType,
  ImageType,
  Video,
  VideoType,
} from "../interactions/types.d/types";
import { getConstraints, getDevices } from "../utils/camera";
import { VIDEO_MAX_DURATION } from "../shared/constants";

interface Props {
  onSelect: (file: File, mediaType: FileType) => void;
}

function Capture({ onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordButtonRef = useRef<ComponentRef<typeof RecordButton>>(null);
  const [captureType, setCaptureType] = useState<FileType>(ImageType);

  const [videoDevices, setVideoDevices] = useState<InputDeviceInfo[]>([]);
  const [videoDeviceIndex, setVideoDeviceIndex] = useState<number>(0);

  useEffect(() => {
    getDevices()
      .then((videoDevices) => setVideoDevices(videoDevices))
      .catch((e) => console.error("enumerateDevices", e));
  }, []);

  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        getConstraints(videoDevices[videoDeviceIndex]),
      );
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        initialize(videoRef.current);
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

  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    if (!videoDevices.length) return;

    let isUnmounted = false;
    let mediaStream: MediaStream | null = null;

    startVideo().then((stream) => {
      mediaStream = stream;
      if (isUnmounted) stopVideo(stream);
    });

    return () => {
      stopVideo(mediaStream);
      isUnmounted = true;
    };
  }, [videoDevices, videoDeviceIndex]);

  const totalVideosDuration = videos.reduce(
    (totalDuration, video) => totalDuration + video.duration,
    0,
  );

  const maxRecordableDuration =
    Math.max(VIDEO_MAX_DURATION - totalVideosDuration, 0) * 1000;

  const { record, stop, isRecording, takePhoto, initialize } = useMediaRecorder(
    {
      onRecordStart: () =>
        recordButtonRef.current?.start(maxRecordableDuration),
      onRecordEnd: (file) => {
        recordButtonRef.current?.stop();
        onSelect(file, VideoType);
      },
      onPhotoTaken: (file) => onSelect(file, ImageType),
    },
  );

  const onSwitchCameraClick = () => {
    setVideoDeviceIndex((index) => (index + 1) % videoDevices.length);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "black",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Top header */}
      <div style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "22px 16px 0",
          }}
        >
          <div>
            <FlashButton />
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>انتشار آگهی</div>
          <div>
            <CloseButton />
          </div>
        </div>
      </div>

      {/* Main camera preview */}
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <video
          playsInline
          muted
          autoPlay
          ref={videoRef}
          style={{
            display: "block",
            width: "100vw",
            height: "calc(100vh - 92px)",
            margin: "0 auto",
            backgroundColor: "black",
            maxHeight: "100vh",
          }}
        />

        {/* Capture mode switch */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: "0",
            color: "white",
            background: "rgba(0, 0, 0, 0.4)",
            height: "150px",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
              marginTop: "auto",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                background: captureType === VideoType ? "white" : "transparent",
                fontSize: "14px",
                borderRadius: "14px",
                padding: "5px 12px",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={() => setCaptureType(VideoType)}
            >
              ویدئو
            </button>
            <button
              style={{
                background: captureType === ImageType ? "white" : "transparent",
                fontSize: "14px",
                borderRadius: "14px",
                padding: "5px 12px",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={() => setCaptureType(ImageType)}
            >
              عکس
            </button>
          </div>
        </div>
      </div>

      {/* Bottom control bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "black",
          height: "92px",
          flexShrink: 0,
        }}
      >
        {/* Left: Gallery */}
        <div
          style={{
            display: "flex",
            width: "100px",
            marginLeft: "30px",
            justifyContent: "flex-start",
          }}
        >
          <BrowseFileButton
            disabled={isRecording}
            onSelect={(file: File) => onSelect(file, VideoType)}
          />
        </div>

        {/* Center: Record Button */}
        <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
          {mediaStream && (
            <RecordButton
              captureType={captureType}
              ref={recordButtonRef}
              onClick={() => {
                if (captureType === VideoType) {
                  isRecording ? stop() : record(mediaStream);
                } else {
                  takePhoto();
                }
              }}
            />
          )}
        </div>

        {/* Right: Switch Camera */}
        <div
          style={{
            display: "flex",
            width: "100px",
            marginRight: "30px",
            justifyContent: "flex-end",
          }}
        >
          {videoDevices.length > 1 && (
            <button
              onClick={onSwitchCameraClick}
              disabled={isRecording}
              style={{
                padding: 0,
                background: "transparent",
                border: "none",
                borderRadius: "50%",
                aspectRatio: 1,
                opacity: isRecording ? "0.6" : "1",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 12.5C22 18.02 17.52 22.5 12 22.5C6.48 22.5 3.11 16.94 3.11 16.94M3.11 16.94H7.63M3.11 16.94V21.94M2 12.5C2 6.98 6.44 2.5 12 2.5C18.67 2.5 22 8.06 22 8.06M22 8.06V3.06M22 8.06H17.56"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ color: "white", fontSize: "10px" }}>بچرخ</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Capture;
