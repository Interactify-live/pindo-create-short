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
  uploadProgressValue: number;
  setInteractionStep: (value: boolean) => void;
  coverIndex: number;
}

const MediaThumbnails: React.FC<MediaThumbnailsProps> = ({
  medias,
  activeMedia,
  setActiveMedia,
  setActiveInteraction,
  uploadFile,
  uploadProgressValue,
  setInteractionStep,
  coverIndex,
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
      {medias.map((media, idx) => {
        // Only apply progress animation to the last media item (the one being uploaded)
        const isLastItem = idx === medias.length - 1;
        const showProgress = uploadFile && isLastItem;

        if (medias && medias[idx] && media.fileType === VideoType) {
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
                      // objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    onClick={() => handleMediaClick(idx)}
                  />
                  {/* Video Play Icon - Centered */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VideoPlay width={24} height={24} />
                  </div>
                  {showProgress && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: `${(1 - uploadProgressValue) * 100}%`,
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "0 0 4px 4px",
                        transition: "height 0.3s ease",
                      }}
                    />
                  )}
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
                  onClick={() => handleMediaClick(idx)}
                >
                  {/* Video Play Icon - Centered */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VideoPlay width={24} height={24} />
                  </div>
                  {showProgress && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: `${(1 - uploadProgressValue) * 100}%`,
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "0 0 4px 4px",
                        transition: "height 0.3s ease",
                      }}
                    />
                  )}
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
                onClick={() => handleMediaClick(idx)}
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
              {showProgress && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: `${(1 - uploadProgressValue) * 100}%`,
                    background: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "0 0 10px 10px",
                    transition: "height 0.3s ease",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
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
