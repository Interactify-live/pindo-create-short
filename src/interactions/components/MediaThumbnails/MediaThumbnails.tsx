import React, { useMemo, memo, useCallback } from "react";
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
  ) => Promise<any>;
  setInteractionStep: (value: boolean) => void;
  coverIndex: number;
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  uploadProgress: Map<string, number>;
}

// Progress overlay component that shows upload progress
const ProgressOverlay = memo<{
  fileId: string;
  uploadProgress: Map<string, number>;
}>(({ fileId, uploadProgress }) => {
  const progress = uploadProgress.get(fileId) || 0;
  const isUploading = uploadProgress.has(fileId) && progress < 1;

  if (!isUploading) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: `${(1 - progress) * 100}%`,
        background: "rgba(0, 0, 0, 0.6)",
        borderRadius: "0 0 4px 4px",
        transition: "height 0.1s ease-out",
        pointerEvents: "none",
        willChange: "height",
        transform: "translateZ(0)", // Force hardware acceleration
      }}
    />
  );
});

ProgressOverlay.displayName = "ProgressOverlay";

// Memoized individual media item component to prevent unnecessary re-renders
const MediaItem = memo<{
  media: Media;
  idx: number;
  activeMedia: number;
  coverIndex: number;
  uploadProgress: Map<string, number>;
  onMediaClick: (idx: number) => void;
}>(({ media, idx, activeMedia, coverIndex, uploadProgress, onMediaClick }) => {
  // Create a unique ID for this file to check if it's being uploaded
  const fileId = useMemo(
    () =>
      `${media.data.file.name}-${media.data.file.size}-${media.data.file.lastModified}`,
    [media.data.file.name, media.data.file.size, media.data.file.lastModified]
  );

  const handleClick = useCallback(() => {
    onMediaClick(idx);
  }, [idx, onMediaClick]);

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
          <div style={{ position: "relative", height: "100%" }}>
            <img
              src={video.thumbnail}
              alt="video thumbnail"
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "10px",
                transform: "translateZ(0)", // Force hardware acceleration
                backfaceVisibility: "hidden", // Prevent flickering
                boxSizing: "border-box",
                border: idx === activeMedia ? "4px solid #0C8CE9" : "none",
                display: "block",
              }}
              onClick={handleClick}
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
            <ProgressOverlay fileId={fileId} uploadProgress={uploadProgress} />
          </div>
        ) : (
          <div
            style={{
              width: "62px",
              height: "62px",
              background: "#ccc",
              borderRadius: "10px",
              position: "relative",
              boxSizing: "border-box",
              border: idx === activeMedia ? "4px solid #0C8CE9" : "none",
            }}
            onClick={handleClick}
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
            <ProgressOverlay fileId={fileId} uploadProgress={uploadProgress} />
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
          onClick={handleClick}
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
        <ProgressOverlay fileId={fileId} uploadProgress={uploadProgress} />
      </div>
    </div>
  );
});

MediaItem.displayName = "MediaItem";

const MediaThumbnails: React.FC<MediaThumbnailsProps> = memo(
  ({
    medias,
    activeMedia,
    setActiveMedia,
    setActiveInteraction,
    uploadFile,
    setInteractionStep,
    coverIndex,
    setMedias,
    uploadProgress,
  }) => {
    const handleMediaClick = useCallback(
      (idx: number) => {
        setActiveMedia(idx);
        setActiveInteraction(-1);
      },
      [setActiveMedia, setActiveInteraction]
    );

    const handleAddClick = useCallback(() => {
      setInteractionStep(false);
    }, [setInteractionStep]);

    // Memoize the media items to prevent unnecessary re-renders
    const mediaItems = useMemo(() => {
      return medias.map((media, idx) => (
        <MediaItem
          key={`${media.data.file.name}-${media.data.file.size}-${media.data.file.lastModified}`}
          media={media}
          idx={idx}
          activeMedia={activeMedia}
          coverIndex={coverIndex}
          uploadProgress={uploadProgress}
          onMediaClick={handleMediaClick}
        />
      ));
    }, [medias, activeMedia, coverIndex, uploadProgress, handleMediaClick]);

    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          overflow: "auto",
          minWidth: 0,
          width: "100%",
          flexShrink: 0,
          height: "100%",
        }}
      >
        {mediaItems}
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
            onClick={handleAddClick}
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
  }
);

MediaThumbnails.displayName = "MediaThumbnails";

export default MediaThumbnails;
