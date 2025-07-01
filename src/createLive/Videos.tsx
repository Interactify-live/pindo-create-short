import React, { ComponentRef, useEffect, useRef, useState } from "react";
import { BrowseFileButton } from "./BrowseFileButton/BrowseFileButton";
import useMediaRecorder from "./useMediaRecorder";
import RecordButton from "./RecordButton/RecordButton";
import FlashButton from "./FlashButton/FlashButton";
import CloseButton from "./CloseButton/CloseButton";
import {
  FileType,
  ImageType,
  Media,
  Video,
  VideoType,
} from "../interactions/types.d/types";
import { getConstraints, getDevices } from "../utils/camera";
import { VIDEO_MAX_DURATION } from "../shared/constants";
import { generateThumbnailFromFile } from "../utils/thumbnail";
import { getMediaDuration } from "../shared/utils";

interface Props {
  onSelect: (file: File, mediaType: FileType, thumb: any | null) => void;
  showToast: any;
  medias: Media[];
  setIsInteractionStep: any;
}

const Capture: React.FC<Props> = ({
  onSelect,
  showToast,
  medias,
  setIsInteractionStep,
}: Props): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordButtonRef = useRef<ComponentRef<typeof RecordButton>>(null);
  const [captureType, setCaptureType] = useState<FileType>(ImageType);
  useEffect(() => {
    console.log("ASDFASDFASDF");
  }, []);

  const [videoDevices, setVideoDevices] = useState<InputDeviceInfo[]>([]);
  const [videoDeviceIndex, setVideoDeviceIndex] = useState<number>(0);
  console.log("KKKKKKKKKKKKKKKKKK");

  useEffect(() => {
    console.log("kir");
    getDevices()
      .then((videoDevices) => {
        console.log(videoDevices);
        setVideoDevices(videoDevices);
      })
      .catch((e) => console.error("enumerateDevices", e));
  }, []);

  const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
  const startVideo = async () => {
    try {
      // if (mediaStream) {
      //   mediaStream.getTracks().forEach((track) => track.stop());
      // }
      const stream = await navigator.mediaDevices.getUserMedia(
        getConstraints(videoDevices[videoDeviceIndex])
      );
      console.log("index", videoDeviceIndex, videoDevices[videoDeviceIndex]);
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        initialize(videoRef.current, stream);
      }
      return stream;
    } catch (e) {
      console.error("getUserMedia", e);
      throw e;
    }
  };

  const stopVideo = async (stream = mediaStream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    if (!videoDevices.length) return;

    let isUnmounted = false;
    let mediaStream: MediaStream | null = null;

    stopVideo(mediaStream).then(() => {
      startVideo().then((stream) => {
        mediaStream = stream;
        if (isUnmounted) stopVideo(stream);
      });
    });

    return () => {
      stopVideo(mediaStream);
      isUnmounted = true;
    };
  }, [videoDevices, videoDeviceIndex]);

  const totalVideosDuration = videos.reduce(
    (totalDuration, video) => totalDuration + video.duration,
    0
  );

  const maxRecordableDuration =
    Math.max(VIDEO_MAX_DURATION - totalVideosDuration, 0) * 1000;

  const { record, stop, clear, isRecording, takePhoto, initialize } =
    useMediaRecorder({
      maxDuration: VIDEO_MAX_DURATION * 1000,
      onRecordStart: () =>
        recordButtonRef.current?.start(maxRecordableDuration),
      onRecordEnd: async (videoFile, thumbnailFile) => {
        getMediaDuration(videoFile).then((duration) => {
          if (medias.filter((m) => m.fileType === VideoType).length >= 1) {
            showToast("شما حداکثر یک ویدیو می توانید داشته باشید");
            if (videoRef.current && mediaStream) {
              initialize(videoRef.current, mediaStream);
              recordButtonRef.current?.stop();
              return;
            }
          }
          if (duration < 5 || duration > 70) {
            showToast("ویدیو باید بیشتر از ۵ و کمتر از ۷۰ ثانیه باشد");
            if (videoRef.current && mediaStream) {
              initialize(videoRef.current, mediaStream);
              recordButtonRef.current?.stop();
            }
          } else {
            clear();
            onSelect(videoFile, VideoType, thumbnailFile); // 🟢 All in one place
          }
        });
      },
      onPhotoTaken: (f) => {
        console.log("TOOK", f);

        // Check existing media
        const existingImageCount = medias.filter(
          (file) => file.fileType !== VideoType
        ).length;

        const totalImagesAfterAdd = existingImageCount + 1;
        if (totalImagesAfterAdd > 10) {
          showToast(`شما حداکثر ۱۰ تصویر می توانید داشته باشید`);
        } else {
          onSelect(f, ImageType, null); // 🟢 All in one place
        }
      },
    });

  const onSwitchCameraClick = () => {
    setVideoDeviceIndex((index) => (index + 1) % videoDevices.length);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
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
          <div
            style={{
              flex: 1,
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                display: "block",
                width: "100px",
                padding: "5px",
                borderRadius: "15px",
              }}
            >
              انتشار آگهی
            </div>
          </div>
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
          height: "calc(100dvh - 105px)", // bottom bar height
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
            height: "calc(100dvh - 105px)", // bottom bar height
            margin: "0 auto",
            backgroundColor: "black",
            // maxHeight: "100dvh",
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
            height: "120px",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
              marginTop: "auto",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center", // Center the main content
              alignItems: "center",
              position: "relative", // Needed for absolute positioning of the last button
            }}
          >
            {/* Center group for the two buttons */}
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                style={{
                  background:
                    captureType === VideoType
                      ? "white"
                      : "rgba(255,255,255,0.3)",
                  fontSize: "14px",
                  borderRadius: "14px",
                  padding: "5px 12px",
                  border: "none",
                  fontWeight: "bold",
                  color: "black",
                }}
                onClick={() => setCaptureType(VideoType)}
              >
                ویدئو
              </button>
              <button
                style={{
                  background:
                    captureType === ImageType
                      ? "white"
                      : "rgba(255,255,255,0.3)",
                  fontSize: "14px",
                  borderRadius: "14px",
                  padding: "5px 12px",
                  border: "none",
                  fontWeight: "bold",
                  color: "black",
                }}
                onClick={() => setCaptureType(ImageType)}
              >
                عکس
              </button>
            </div>

            {/* Continue button positioned absolutely on the right */}
            {medias.length > 0 && (
              <button
                style={{
                  background: "rgba(37, 79, 195, 1)",
                  color: "white",
                  border: "none",
                  width: "100px",
                  height: "40px",
                  borderRadius: "5px",
                  position: "absolute",
                  right: "20px", // Position on the right edge
                }}
                onClick={() => setIsInteractionStep(true)}
              >
                بازگشت
              </button>
            )}
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
          paddingBottom: "13px",
          background: "black",
          height: "105px",
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
            medias={medias}
            disabled={isRecording}
            showToast={showToast}
            onSelect={async (files: File[]) => {
              for (const file of files) {
                const type = file.type;
                const isVideo = type.startsWith("video/");
                const isImage = type.startsWith("image/");

                if (isVideo) {
                  const thumb = await generateThumbnailFromFile(file);
                  onSelect(file, VideoType, thumb); // this is your own handler
                } else if (isImage) {
                  onSelect(file, ImageType, null);
                } else {
                  console.warn("Unsupported file type:", type);
                }
              }
            }}
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
};

export default Capture;
