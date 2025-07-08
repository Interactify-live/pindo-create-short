import React, { useState, useEffect, useRef } from "react";
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
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(
    new Map()
  );
  const uploadingFilesRef = useRef<Map<string, number>>(new Map());

  const showToast = (message: string, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

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

          // Check if this file is already being uploaded using both state and ref
          const isAlreadyUploading =
            uploadingFiles.has(fileId) || uploadingFilesRef.current.has(fileId);

          // Only upload if not already being uploaded
          if (!isAlreadyUploading) {
            console.log("Starting upload for file:", fileId);
            // Add to uploading files with 0 progress
            setUploadingFiles((prev: Map<string, number>) =>
              new Map(prev).set(fileId, 0)
            );

            const onProgress = (progress: number) => {
              console.log("Progress update:", { fileId, progress });
              // Convert percentage (0-100) to decimal (0-1) for calculations
              setUploadingFiles((prev: Map<string, number>) => {
                const newMap = new Map(prev);
                newMap.set(fileId, progress / 100);
                return newMap;
              });
            };

            // Start upload for this media
            props.uploadFile!(media.data.file, onProgress)
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
                setUploadingFiles((prev: Map<string, number>) => {
                  const newMap = new Map(prev);
                  newMap.delete(fileId);
                  return newMap;
                });
              })
              .catch((error: any) => {
                console.error("Upload failed:", error);
                // Remove from uploading files on error
                setUploadingFiles((prev: Map<string, number>) => {
                  const newMap = new Map(prev);
                  newMap.delete(fileId);
                  return newMap;
                });
              });
          }
        }
      });
    }
  }, [medias, props.uploadFile, uploadingFiles]);

  // Update ref when uploadingFiles state changes
  useEffect(() => {
    uploadingFilesRef.current = uploadingFiles;
  }, [uploadingFiles]);

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
          uploadingFiles={uploadingFiles}
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
