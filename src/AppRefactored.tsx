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
import { Toast } from "./shared/components";
import { useToast } from "./shared/hooks";
import { processMediaFile } from "./shared/utils/mediaUtils";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

function AppRefactored(props: {
  onFinish: (medias: MediaResult[]) => void;
  uploadFile?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
}) {
  const [medias, setMedias] = useState<Media[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isInteractionStep, setIsInteractionStep] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const handleMediaSelect = async (
    f: File,
    mediaType: FileType,
    thumb: File | null
  ) => {
    try {
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
    } catch (error) {
      showToast('Error processing media file', 'error');
    }
  };

  return (
    <div style={{ height: "100%", background: "#262626", direction: "rtl" }}>
      {!isInteractionStep ? (
        <Capture
          medias={medias}
          showToast={showToast}
          setIsInteractionStep={setIsInteractionStep}
          onSelect={handleMediaSelect}
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

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default AppRefactored;