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
import { Warning } from "./icons";
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
    <div style={{ height: "100%", background: "#262626", direction: "rtl" }}>
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
          <Warning />

          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
