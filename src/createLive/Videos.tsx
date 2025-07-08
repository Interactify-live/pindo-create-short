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
import { Camera, Rotate } from "../icons";

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
        setVideoDevices(videoDevices as InputDeviceInfo[]);
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
        flexGrow: 1,
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div>
        <div
          style={{
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            height: "100px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              paddingRight: "16px",
            }}
          >
            <Camera />
          </div>

          {/* Centered buttons */}
          <div
            style={{
              margin: "0 auto",
              display: "flex",
              gap: "12px",
              padding: "8px",
              border: "1px solid rgba(141, 143, 144, 1)",
              borderRadius: "8px",
              background: "transparent",
            }}
          >
            <button
              style={{
                background: captureType === ImageType ? "white" : "transparent",
                fontSize: "14px",
                borderRadius: "32px",
                padding: "2px 13px",
                border: "none",
                fontWeight: "bold",
                color: captureType === ImageType ? "black" : "white",
                width: "60px",
                height: "40px",
              }}
              onClick={() => setCaptureType(ImageType)}
            >
              عکس
            </button>
            <button
              style={{
                background: captureType === VideoType ? "white" : "transparent",
                fontSize: "14px",
                borderRadius: "32px",
                padding: "2px 13px",
                border: "none",
                fontWeight: "bold",
                color: captureType === VideoType ? "black" : "white",
                width: "60px",
                height: "40px",
              }}
              onClick={() => setCaptureType(VideoType)}
            >
              ویدئو
            </button>
          </div>
        </div>
      </div>
      <div style={{ background: "rgba(38, 38, 38, 1)", height: "100%" }}>
        <div
          style={{
            flexGrow: 1,
            margin: "10px",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "calc(100% - 50px)",
          }}
        >
          <div
            style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "22px 16px 0",
              }}
            >
              <div>
                <FlashButton />
              </div>
            </div>
          </div>
          <video
            playsInline
            muted
            autoPlay
            ref={videoRef}
            style={{
              display: "block",
              width: "100%",
              // height: "calc(100dvh - 105px)", // bottom bar height
              margin: "0 auto",
              backgroundColor: "black",
              // maxHeight: "100dvh",
            }}
          />
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
                <Rotate />
                <span style={{ color: "white", fontSize: "10px" }}>بچرخ</span>
              </div>
            </button>
          )}
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
        <div
          style={{
            display: "flex",
            width: "100px",
            marginLeft: "30px",
            justifyContent: "flex-end",
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
      </div>
    </div>
  );
};

export default Capture;

// {/* Capture mode switch */}
// <div
//   style={{
//     position: "absolute",
//     width: "100%",
//     bottom: "0",
//     color: "white",
//     background: "rgba(0, 0, 0, 0.4)",
//     height: "120px",
//     display: "flex",
//   }}
// >
//   <div
//     style={{
//       width: "100%",
//       marginTop: "auto",
//       marginBottom: "24px",
//       display: "flex",
//       justifyContent: "center", // Center the main content
//       alignItems: "center",
//       position: "relative", // Needed for absolute positioning of the last button
//     }}
//   >
//     {/* Center group for the two buttons */}
//     <div style={{ display: "flex", gap: "5px" }}>
//       <button
//         style={{
//           background:
//             captureType === VideoType
//               ? "white"
//               : "rgba(255,255,255,0.3)",
//           fontSize: "14px",
//           borderRadius: "14px",
//           padding: "5px 12px",
//           border: "none",
//           fontWeight: "bold",
//           color: "black",
//         }}
//         onClick={() => setCaptureType(VideoType)}
//       >
//         ویدئو
//       </button>
//       <button
//         style={{
//           background:
//             captureType === ImageType
//               ? "white"
//               : "rgba(255,255,255,0.3)",
//           fontSize: "14px",
//           borderRadius: "14px",
//           padding: "5px 12px",
//           border: "none",
//           fontWeight: "bold",
//           color: "black",
//         }}
//         onClick={() => setCaptureType(ImageType)}
//       >
//         عکس
//       </button>
//     </div>

//     {/* Continue button positioned absolutely on the right */}
//     {medias.length > 0 && (
//       <button
//         style={{
//           background: "rgba(37, 79, 195, 1)",
//           color: "white",
//           border: "none",
//           width: "100px",
//           height: "40px",
//           borderRadius: "5px",
//           position: "absolute",
//           right: "20px", // Position on the right edge
//         }}
//         onClick={() => setIsInteractionStep(true)}
//       >
//         بازگشت
//       </button>
//     )}
//   </div>
// </div>
