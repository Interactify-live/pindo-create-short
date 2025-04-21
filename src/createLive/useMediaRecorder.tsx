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
}: {
  maxDuration?: number;
  onRecordStart: VoidFunction;
  onRecordEnd: (blob: File) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null);

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

  const record = (stream: MediaStream) => {
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
      const recordedBlob = new Blob(recordedChunks, { type: mimeType });
      recordedChunks.length = 0;
      const file = new File([recordedBlob], `recorded-short.${fileExtension}`, {
        type: mimeType,
      });
      onRecordEnd(file);
      setIsRecording(false);
      mediaRecorder.current = null;
    };
    mediaRecorder.current.start();
  };
  const stop = () => {
    mediaRecorder.current?.stop();
  };

  return { record, stop, isRecording };
}

useMediaRecorder.isSupported = () =>
  typeof MediaRecorder === "function" && getSupportedMimeType();

export default useMediaRecorder;
