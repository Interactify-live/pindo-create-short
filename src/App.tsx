import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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

// Custom hook for upload progress tracking
const useUploadProgress = () => {
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(
    new Map()
  );
  const progressRef = useRef<Map<string, number>>(new Map());

  const updateProgress = useCallback((fileId: string, progress: number) => {
    progressRef.current.set(fileId, progress);
    setUploadProgress(new Map(progressRef.current));
  }, []);

  const removeProgress = useCallback((fileId: string) => {
    progressRef.current.delete(fileId);
    setUploadProgress(new Map(progressRef.current));
  }, []);

  const getProgress = useCallback((fileId: string) => {
    return progressRef.current.get(fileId) || 0;
  }, []);

  return { uploadProgress, updateProgress, removeProgress, getProgress };
};

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

  // Use custom hook for upload progress tracking
  const { uploadProgress, updateProgress, removeProgress } =
    useUploadProgress();

  // Use refs to track upload state without causing rerenders
  const uploadingFilesRef = useRef<Map<string, number>>(new Map());
  const uploadPromisesRef = useRef<Map<string, Promise<string>>>(new Map());

  const showToast = useCallback((message: string, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  // Handle upload progress for media items that need uploading
  useEffect(() => {
    console.log("=== UPLOAD EFFECT RUNNING ===");
    console.log("Upload effect triggered:", {
      mediasLength: medias.length,
      hasUploadFile: !!props.uploadFile,
      uploadFileType: typeof props.uploadFile,
    });
    console.log(
      "All medias:",
      medias.map((m: Media) => ({
        fileName: m.data.file.name,
        isUploaded: m.isUploaded,
      }))
    );

    if (props.uploadFile && medias.length > 0) {
      // Find all media items that need uploading
      medias.forEach((media: Media, index: number) => {
        console.log("Checking media:", {
          index,
          isUploaded: media.isUploaded,
          fileName: media.data.file.name,
        });

        if (!media.isUploaded) {
          // Create a unique ID for this file
          const fileId = `${media.data.file.name}-${media.data.file.size}-${media.data.file.lastModified}`;

          // Check if this file is already being uploaded using ref
          const isAlreadyUploading = uploadingFilesRef.current.has(fileId);

          // Only upload if not already being uploaded
          if (!isAlreadyUploading) {
            console.log("Starting upload for file:", fileId);
            // Add to uploading files with 0 progress
            uploadingFilesRef.current.set(fileId, 0);
            updateProgress(fileId, 0);

            const onProgress = (progress: number) => {
              console.log("Progress update:", { fileId, progress });
              // Update progress in ref without causing rerender
              uploadingFilesRef.current.set(fileId, progress / 100);
              // Update progress in state for UI display
              updateProgress(fileId, progress / 100);
            };

            // Start upload for this media and store the promise
            const uploadPromise = props.uploadFile!(media.data.file, onProgress)
              .then((uploadedUrl: string) => {
                console.log("Upload completed:", uploadedUrl);
                // Mark the media as uploaded
                setMedias((prevMedias: Media[]) => {
                  return prevMedias.map((m: Media, i: number) => {
                    if (i === index) {
                      return {
                        ...m,
                        isUploaded: true,
                      };
                    }
                    return m;
                  });
                });
                // Remove from uploading files
                uploadingFilesRef.current.delete(fileId);
                uploadPromisesRef.current.delete(fileId);
                removeProgress(fileId);
                return uploadedUrl;
              })
              .catch((error: any) => {
                console.error("Upload failed:", error);
                // Remove from uploading files on error
                uploadingFilesRef.current.delete(fileId);
                uploadPromisesRef.current.delete(fileId);
                removeProgress(fileId);
                throw error;
              });

            uploadPromisesRef.current.set(fileId, uploadPromise);
          }
        }
      });
    }
  }, [medias, props.uploadFile, updateProgress, removeProgress]);

  // Memoize the onSelect callback to prevent unnecessary rerenders
  const handleMediaSelect = useCallback(
    async (f: File, mediaType: FileType, thumb: File | null) => {
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
    },
    []
  );

  return (
    <div
      style={{
        height: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        background: "#262626",
        direction: "rtl",
      }}
    >
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
          uploadProgress={uploadProgress}
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
