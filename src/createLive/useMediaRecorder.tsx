import { MutableRefObject, useEffect, useRef, useState } from "react";

function getSupportedMimeType() {
  const VIDEO_CODECS = ["h.264", "h264", "vp8", "vp9", "h265", "h.265"];
  const MIME_TYPES = ["video/webm", "video/mp4"] as const; // 🔁 mp4 first for iOS Safari

  const COMBINATIONS = MIME_TYPES.map((mimeType) =>
    VIDEO_CODECS.map((codec) => [
      `${mimeType};codecs=${codec}`,
      `${mimeType};codecs=${codec.toUpperCase()}`,
    ]),
  ).flat(2);

  const supported = COMBINATIONS.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );

  if (supported) return supported;

  // 🔁 fallback to just mimeType without codecs if no codec variant is supported
  return MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function useMediaRecorder({
  onRecordEnd,
  maxDuration,
  onRecordStart,
  onPhotoTaken,
}: {
  maxDuration?: number;
  onRecordStart?: VoidFunction;
  onRecordEnd?: (blob: File, thumb: File) => void;
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

  const initialize = async (
    videoElement: HTMLVideoElement,
    stream: MediaStream,
  ) => {
    videoRef.current = videoElement;
    try {
      streamRef.current = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
    } catch (error) {
      console.error("Error initializing camera:", error);
    }
  };

  const record = async (stream: MediaStream) => {
    if (!onRecordStart) return;

    // Ensure videoRef is ready
    if (!videoRef.current || videoRef.current.readyState < 2) {
      await new Promise((resolve) =>
        videoRef.current?.addEventListener("loadeddata", resolve, {
          once: true,
        }),
      );
    }

    // 📸 Capture photo before recording starts
    let photoFile: File | null = null;
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              photoFile = new File([blob], "captured-photo.png", {
                type: "image/png",
              });
            }
            resolve();
          }, "image/png");
        });
      }
    }

    // ✅ Start recording
    setIsRecording(true);
    onRecordStart();

    const mimeType = getSupportedMimeType();
    const fileExtension = mimeType?.split("/")[1];
    const recordedChunks: Blob[] = [];

    mediaRecorder.current = new MediaRecorder(stream, { mimeType });

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.current.onstop = () => {
      if (!onRecordEnd) return;

      const recordedBlob = new Blob(recordedChunks, { type: mimeType });
      recordedChunks.length = 0;

      const videoFile = new File(
        [recordedBlob],
        `recorded-video.${fileExtension}`,
        {
          type: mimeType,
        },
      );

      onRecordEnd(videoFile, photoFile!);
      setIsRecording(false);
      mediaRecorder.current = null;
    };

    mediaRecorder.current.start();
  };

  const takePhoto = () => {
    console.log(videoRef.current, videoRef, onPhotoTaken);
    if (!videoRef.current || !onPhotoTaken) return;
    console.log("CHECKED");
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

  const stop = async () => {
    mediaRecorder.current?.stop();
    // if (streamRef.current) {
    //   streamRef.current.getTracks().forEach((track) => track.stop());
    //   streamRef.current = null;
    // }
    // if (videoRef.current) {
    //   videoRef.current.srcObject = null;
    // }
  };

  const clear = async () => {
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
    clear,
    takePhoto,
    isRecording,
  };
}

useMediaRecorder.isSupported = () =>
  typeof MediaRecorder === "function" && getSupportedMimeType();

export default useMediaRecorder;
