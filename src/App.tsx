import React, { useState } from "react";
import ShortCreateInteractionsStep from "./interactions";
import {
  FileType,
  Media,
  MediaResult,
  VideoType,
} from "./interactions/types.d/types";
import { getMediaDuration } from "./shared/utils";
import Capture from "./createLive/Videos";
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

function App(props: {
  onFinish: (medias: MediaResult[]) => void;
  uploadFile?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
}) {
  const [medias, setMedias] = useState<Media[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isInteractionStep, setIsInteractionStep] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  return (
    <div style={{ height: "100%" }}>
      {!isInteractionStep ? (
        <Capture
          medias={medias}
          showToast={showToast}
          setIsInteractionStep={setIsInteractionStep}
          onSelect={async (
            f: File,
            mediaType: FileType,
            thumb: File | null
          ) => {
            if (mediaType === VideoType) {
              if (!thumb) return;
              const duration = await getMediaDuration(f);

              setMedias((prevMedias: Media[]) => {
                return [
                  ...prevMedias,
                  {
                    data: {
                      file: f,
                      duration: duration,
                      originDuration: duration,
                      trim: { start: 0, end: duration },
                      src: URL.createObjectURL(f),
                      thumbnail: URL.createObjectURL(thumb),
                    },
                    fileType: mediaType,
                    interactions: [],
                  },
                ];
              });
            } else {
              setMedias((prevMedias: Media[]) => {
                return [
                  ...prevMedias,
                  {
                    data: {
                      file: f,
                      src: URL.createObjectURL(f),
                    },
                    fileType: mediaType,
                    interactions: [],
                  },
                ];
              });
            }

            setIsInteractionStep(true);
          }}
        />
      ) : (
        <ShortCreateInteractionsStep
          setInteractionStep={setIsInteractionStep}
          medias={medias}
          setMedias={setMedias}
          coverIndex={coverIndex}
          setCoverIndex={setCoverIndex}
          onFinish={props.onFinish}
          uploadFile={props.uploadFile}
        />
      )}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "190px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 237, 235, 1)",
            color: "rgba(224, 50, 64, 1)",
            padding: "12px 20px",
            border: "1px solid rgba(224, 50, 64, 1)",
            borderRadius: "10px",
            fontSize: "14px",
            zIndex: 9999,
            width: "80%",
            direction: "rtl",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <svg
            width="18"
            height="26"
            viewBox="0 0 18 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5.5C13.1421 5.5 16.5 8.85786 16.5 13C16.5 17.1421 13.1421 20.5 9 20.5C4.85786 20.5 1.5 17.1421 1.5 13C1.5 8.85786 4.85786 5.5 9 5.5ZM7.5 11.5V13H8.25V16.75H9.75V11.5H7.5ZM9 9.25C8.58579 9.25 8.25 9.58579 8.25 10C8.25 10.4142 8.58579 10.75 9 10.75C9.41421 10.75 9.75 10.4142 9.75 10C9.75 9.58579 9.41421 9.25 9 9.25Z"
              fill="#E03240"
            />
          </svg>

          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
