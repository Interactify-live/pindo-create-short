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
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(
    new Map()
  );
  const uploadingFilesRef = useRef<Map<string, number>>(new Map());

  const { toast, showToast, hideToast } = useToast();

  // Debug: Log when component mounts and props change
  useEffect(() => {
    console.log("AppRefactored mounted/updated:", {
      hasUploadFile: !!props.uploadFile,
      uploadFileType: typeof props.uploadFile,
      mediasLength: medias.length,
    });
  }, [props.uploadFile, medias.length]);

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
      medias.map((m) => ({
        fileName: m.data.file.name,
        isUploaded: m.isUploaded,
      }))
    );
    if (props.uploadFile && medias.length > 0) {
      // Find all media items that need uploading
      medias.forEach((media, index) => {
        console.log("Checking media:", {
          index,
          isUploaded: media.isUploaded,
          fileName: media.data.file.name,
        });
        if (!media.isUploaded) {
          // Create a unique ID for this file
          const fileId = `${media.data.file.name}-${media.data.file.size}-${media.data.file.lastModified}`;

          // Check if this file is already being uploaded
          const isAlreadyUploading = uploadingFilesRef.current.has(fileId);

          // Only upload if not already being uploaded
          if (!isAlreadyUploading) {
            console.log("Starting upload for file:", fileId);
            // Add to uploading files with 0 progress
            setUploadingFiles((prev) => new Map(prev).set(fileId, 0));

            const onProgress = (progress: number) => {
              // Convert percentage (0-100) to decimal (0-1) for calculations
              setUploadingFiles((prev) =>
                new Map(prev).set(fileId, progress / 100)
              );
            };

            // Start upload for this media
            props
              .uploadFile(media.data.file, onProgress)
              .then((uploadedUrl) => {
                console.log("Upload completed:", uploadedUrl);
                // Mark the media as uploaded
                setMedias((prevMedias) => {
                  return prevMedias.map((m, i) => {
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
                setUploadingFiles((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(fileId);
                  return newMap;
                });
              })
              .catch((error) => {
                console.error("Upload failed:", error);
                // Remove from uploading files on error
                setUploadingFiles((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(fileId);
                  return newMap;
                });
              });
          }
        }
      });
    }
  }, [medias.length, props.uploadFile]);

  // Update ref when uploadingFiles state changes
  useEffect(() => {
    uploadingFilesRef.current = uploadingFiles;
  }, [uploadingFiles]);

  const handleMediaSelect = async (
    f: File,
    mediaType: FileType,
    thumb: File | null
  ) => {
    try {
      // Check if this file is already in the medias array
      const isDuplicate = medias.some((media) => {
        const existingFile = media.data.file;
        return (
          existingFile.name === f.name &&
          existingFile.size === f.size &&
          existingFile.lastModified === f.lastModified
        );
      });

      if (isDuplicate) {
        showToast("این فایل قبلاً اضافه شده است", "warning");
        return;
      }

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
      showToast("Error processing media file", "error");
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
          uploadingFiles={uploadingFiles}
        />
      )}

      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

export default AppRefactored;
