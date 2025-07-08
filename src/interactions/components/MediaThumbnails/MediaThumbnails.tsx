import React, { useMemo, memo } from "react";
import { Media, Video, Image, VideoType, ImageType } from "../../types.d/types";
import { Add, VideoPlay } from "../../../icons";

interface MediaThumbnailsProps {
  medias: Media[];
  activeMedia: number;
  setActiveMedia: (index: number) => void;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  uploadFile?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
  setInteractionStep: (value: boolean) => void;
  coverIndex: number;
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  uploadingFiles: Map<string, number>;
}

// Progress overlay component with CSS-only animations to prevent flickering
const ProgressOverlay = ({
  fileId,
  uploadingFiles,
}: {
  fileId: string;
  uploadingFiles: Map<string, number>;
}) => {
  const showProgress = uploadingFiles && uploadingFiles.has(fileId);
  const progressValue = uploadingFiles?.get(fileId) || 0;

  if (!showProgress) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: `${(1 - progressValue) * 100}%`,
        background: "rgba(0, 0, 0, 0.6)",
        borderRadius: "0 0 4px 4px",
        transition: "height 0.1s ease-out",
        pointerEvents: "none",
        willChange: "height",
        transform: "translateZ(0)", // Force hardware acceleration
      }}
    />
  );
};

// Memoized individual media item component to prevent unnecessary re-renders
const MediaItem = memo<{
  media: Media;
  idx: number;
  activeMedia: number;
  coverIndex: number;
  uploadingFiles: Map<string, number>;
  onMediaClick: (idx: number) => void;
}>(({ media, idx, activeMedia, coverIndex, uploadingFiles, onMediaClick }) => {
  // Create a unique ID for this file to check if it's being uploaded
  const fileId = `${media.data.file.name}-${media.data.file.size}-${media.data.file.lastModified}`;

  if (media.fileType === VideoType) {
    const video = media.data as Video;
    return (
      <div
        style={{
          position: "relative",
          width: "62px",
          height: "62px",
          flexShrink: 0,
        }}
        key={idx}
      >
        {video.thumbnail ? (
          <div style={{ position: "relative" }}>
            <img
              src={video.thumbnail}
              alt="video thumbnail"
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "4px",
                transform: "translateZ(0)", // Force hardware acceleration
                backfaceVisibility: "hidden", // Prevent flickering
              }}
              onClick={() => onMediaClick(idx)}
            />
            {/* Video Play Icon - Centered */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) translateZ(0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                backfaceVisibility: "hidden",
                willChange: "transform",
              }}
            >
              <VideoPlay width={24} height={24} />
            </div>
            <ProgressOverlay fileId={fileId} uploadingFiles={uploadingFiles} />
          </div>
        ) : (
          <div
            style={{
              width: "62px",
              height: "62px",
              background: "#ccc",
              borderRadius: "4px",
              position: "relative",
            }}
            onClick={() => onMediaClick(idx)}
          >
            {/* Video Play Icon - Centered */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) translateZ(0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                backfaceVisibility: "hidden",
                willChange: "transform",
              }}
            >
              <VideoPlay width={24} height={24} />
            </div>
            <ProgressOverlay fileId={fileId} uploadingFiles={uploadingFiles} />
          </div>
        )}
      </div>
    );
  }

  const image = media.data as Image;
  return (
    <div
      style={{
        position: "relative",
        width: "62px",
        height: "62px",
        flexShrink: 0,
        borderRadius: "4px",
      }}
      key={idx}
    >
      <div style={{ position: "relative" }}>
        <img
          onClick={() => onMediaClick(idx)}
          src={image.src}
          alt="image"
          style={{
            width: "62px",
            height: "62px",
            objectFit: "cover",
            boxSizing: "border-box",
            border: idx === activeMedia ? "4px solid #0C8CE9" : "none",
            display: "block",
            borderRadius: "10px",
          }}
        />
        {idx === coverIndex && (
          <div
            style={{
              position: "absolute",
              bottom: "0",
              height: "18px",
              background: "rgba(158, 158, 158, 0.7)",
              fontSize: "10px",
              textAlign: "center",
              color: "white",
              borderRadius: "0 0 10px 10px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            عکس اصلی
          </div>
        )}
        <ProgressOverlay fileId={fileId} uploadingFiles={uploadingFiles} />
      </div>
    </div>
  );
});

const MediaThumbnails: React.FC<MediaThumbnailsProps> = ({
  medias,
  activeMedia,
  setActiveMedia,
  setActiveInteraction,
  uploadFile,
  setInteractionStep,
  coverIndex,
  setMedias,
  uploadingFiles,
}) => {
  const handleMediaClick = (idx: number) => {
    setActiveMedia(idx);
    setActiveInteraction(-1);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        overflow: "auto",
        minWidth: 0,
        width: "100%",
        flexShrink: 0,
      }}
    >
      {medias.map((media, idx) => (
        <MediaItem
          key={`${media.data.file.name}-${media.data.file.size}-${media.data.file.lastModified}`}
          media={media}
          idx={idx}
          activeMedia={activeMedia}
          coverIndex={coverIndex}
          uploadingFiles={uploadingFiles}
          onMediaClick={handleMediaClick}
        />
      ))}
      <div
        style={{
          width: "62px",
          height: "62px",
          background: "#ccc",
          borderRadius: "10px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setInteractionStep(false)}
          style={{
            width: "100%",
            height: "100%",
            background: "none",
            color: "white",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Add />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              height: "18px",
              background: "rgba(158, 158, 158, 0.7)",
              fontSize: "10px",
              textAlign: "center",
              color: "white",
              borderRadius: "0 0 10px 10px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            افزودن
          </div>
        </button>
      </div>
    </div>
  );
};

export default MediaThumbnails;
