import { MutableRefObject, useEffect, useRef, useState } from "react";

function getSupportedMimeType() {
  const VIDEO_CODECS = ["vp8", "vp9", "h265", "h.265", "h264", "h.264"];
  const MIME_TYPES = ["video/webm", "video/mp4"] as const;

  const COMBINATIONS = MIME_TYPES.map((mimeType) =>
    VIDEO_CODECS.map((codec) => [
      `${mimeType};codecs=${codec}`,
      `${mimeType};codecs=${codec.toUpperCase()}`,
    ]),
  ).flat(2);

  return COMBINATIONS.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );
}

function useMediaRecorder({
  onRecordEnd,
  maxDuration,
  onRecordStart,
  onPhotoTaken,
}: {
  maxDuration?: number;
  onRecordStart?: VoidFunction;
  onRecordEnd?: (blob: File) => void;
  onPhotoTaken?: (photo: File) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null);
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const streamRef: MutableRefObject<MediaStream | null> = useRef(null);

  useEffect(() => {
    if (!isRecording || !maxDuration) {
      return;
    }

    const timeout = setTimeout(() => {
      mediaRecorder.current?.stop();
    }, maxDuration);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRecording]);

  const initialize = async (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
    } catch (error) {
      console.error("Error initializing camera:", error);
    }
  };

  const record = (stream: MediaStream) => {
    if (!onRecordStart) return;

    setIsRecording(true);
    onRecordStart();

    const mimeType = getSupportedMimeType();
    const fileExtension = mimeType?.split("/")[1];

    mediaRecorder.current = new MediaRecorder(stream, { mimeType });
    const recordedChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.current.onstop = () => {
      if (!onRecordEnd) return;

      const recordedBlob = new Blob(recordedChunks, { type: mimeType });
      recordedChunks.length = 0;
      const file = new File([recordedBlob], `recorded-video.${fileExtension}`, {
        type: mimeType,
      });
      onRecordEnd(file);
      setIsRecording(false);
      mediaRecorder.current = null;
    };

    mediaRecorder.current.start();
  };

  const takePhoto = () => {
    console.log(videoRef.current);
    if (!videoRef.current || !onPhotoTaken) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-photo.png", {
            type: "image/png",
          });
          onPhotoTaken(file);
        }
      }, "image/png");
    }
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return {
    initialize,
    record,
    stop,
    takePhoto,
    isRecording,
  };
}

useMediaRecorder.isSupported = () =>
  typeof MediaRecorder === "function" && getSupportedMimeType();

export default useMediaRecorder;
