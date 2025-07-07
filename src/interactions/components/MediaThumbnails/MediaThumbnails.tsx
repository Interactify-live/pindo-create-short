import React from "react";
import { Media, Video, Image, VideoType, ImageType } from "../../types.d/types";

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
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.2"
              d="M18.9404 4.03291H17.0095L16.044 2.58472H12.1822L11.2167 4.03291H9.28577C9.02972 4.03291 8.78415 4.13463 8.60309 4.31568C8.42203 4.49674 8.32031 4.74231 8.32031 4.99837V11.7566C8.32031 12.0126 8.42203 12.2582 8.60309 12.4393C8.78415 12.6203 9.02972 12.7221 9.28577 12.7221H18.9404C19.1964 12.7221 19.442 12.6203 19.6231 12.4393C19.8041 12.2582 19.9058 12.0126 19.9058 11.7566V4.99837C19.9058 4.74231 19.8041 4.49674 19.6231 4.31568C19.442 4.13463 19.1964 4.03291 18.9404 4.03291ZM14.1131 10.3084C13.6834 10.3084 13.2634 10.181 12.9062 9.94231C12.549 9.70361 12.2706 9.36435 12.1061 8.96741C11.9417 8.57048 11.8987 8.13371 11.9825 7.71232C12.0663 7.29094 12.2732 6.90388 12.577 6.60008C12.8808 6.29628 13.2679 6.08939 13.6893 6.00557C14.1107 5.92175 14.5474 5.96477 14.9444 6.12918C15.3413 6.2936 15.6806 6.57203 15.9193 6.92926C16.158 7.28649 16.2854 7.70648 16.2854 8.13612C16.2854 8.71224 16.0565 9.26477 15.6491 9.67215C15.2417 10.0795 14.6892 10.3084 14.1131 10.3084Z"
              fill="#6F6F6F"
            />
            <path
              d="M18.9387 3.55024H17.2661L16.4436 2.31687C16.3996 2.25082 16.3399 2.19667 16.2699 2.1592C16.1999 2.12173 16.1217 2.1021 16.0424 2.10205H12.1805C12.1011 2.1021 12.023 2.12173 11.953 2.1592C11.883 2.19667 11.8233 2.25082 11.7792 2.31687L10.9562 3.55024H9.28413C8.90004 3.55024 8.53169 3.70282 8.2601 3.97441C7.98851 4.246 7.83594 4.61435 7.83594 4.99843V11.7567C7.83594 12.1407 7.98851 12.5091 8.2601 12.7807C8.53169 13.0523 8.90004 13.2048 9.28413 13.2048H18.9387C19.3228 13.2048 19.6912 13.0523 19.9628 12.7807C20.2343 12.5091 20.3869 12.1407 20.3869 11.7567V4.99843C20.3869 4.61435 20.2343 4.246 19.9628 3.97441C19.6912 3.70282 19.3228 3.55024 18.9387 3.55024ZM19.4215 11.7567C19.4215 11.8847 19.3706 12.0075 19.2801 12.098C19.1895 12.1885 19.0668 12.2394 18.9387 12.2394H9.28413C9.1561 12.2394 9.03332 12.1885 8.94279 12.098C8.85226 12.0075 8.8014 11.8847 8.8014 11.7567V4.99843C8.8014 4.8704 8.85226 4.74762 8.94279 4.65709C9.03332 4.56656 9.1561 4.5157 9.28413 4.5157H11.215C11.2945 4.51575 11.3728 4.49617 11.4429 4.4587C11.513 4.42122 11.5728 4.36701 11.6169 4.30089L12.4388 3.06751H15.7835L16.6059 4.30089C16.6501 4.36701 16.7098 4.42122 16.7799 4.4587C16.85 4.49617 16.9283 4.51575 17.0078 4.5157H18.9387C19.0668 4.5157 19.1895 4.56656 19.2801 4.65709C19.3706 4.74762 19.4215 4.8704 19.4215 4.99843V11.7567ZM14.1114 5.48116C13.5863 5.48116 13.073 5.63688 12.6364 5.92861C12.1998 6.22035 11.8595 6.63501 11.6585 7.12015C11.4576 7.60529 11.405 8.13912 11.5074 8.65415C11.6099 9.16917 11.8627 9.64225 12.2341 10.0136C12.6054 10.3849 13.0784 10.6377 13.5935 10.7402C14.1085 10.8426 14.6423 10.79 15.1275 10.5891C15.6126 10.3881 16.0273 10.0478 16.319 9.61123C16.6107 9.17461 16.7664 8.66129 16.7664 8.13618C16.7656 7.43227 16.4857 6.75742 15.9879 6.25968C15.4902 5.76194 14.8153 5.48196 14.1114 5.48116ZM14.1114 9.82573C13.7773 9.82573 13.4506 9.72664 13.1728 9.54099C12.8949 9.35534 12.6784 9.09147 12.5505 8.78274C12.4226 8.47402 12.3891 8.1343 12.4543 7.80656C12.5195 7.47882 12.6804 7.17777 12.9167 6.94148C13.153 6.70519 13.4541 6.54428 13.7818 6.47909C14.1096 6.4139 14.4493 6.44735 14.758 6.57523C15.0667 6.70311 15.3306 6.91967 15.5162 7.19751C15.7019 7.47536 15.801 7.80202 15.801 8.13618C15.801 8.58428 15.623 9.01402 15.3061 9.33088C14.9893 9.64773 14.5595 9.82573 14.1114 9.82573Z"
              fill="#6F6F6F"
            />
            <path
              d="M10.9125 6.92916C10.9125 7.07319 10.8553 7.21132 10.7535 7.31317C10.6516 7.41502 10.5135 7.47223 10.3694 7.47223H6.93V10.9117C6.93 11.0557 6.87278 11.1938 6.77093 11.2957C6.66909 11.3975 6.53096 11.4548 6.38692 11.4548C6.24289 11.4548 6.10476 11.3975 6.00291 11.2957C5.90107 11.1938 5.84385 11.0557 5.84385 10.9117V7.47223H2.4044C2.26037 7.47223 2.12224 7.41502 2.02039 7.31317C1.91854 7.21132 1.86133 7.07319 1.86133 6.92916C1.86133 6.78513 1.91854 6.647 2.02039 6.54515C2.12224 6.44331 2.26037 6.38609 2.4044 6.38609H5.84385V2.94664C5.84385 2.8026 5.90107 2.66447 6.00291 2.56263C6.10476 2.46078 6.24289 2.40356 6.38692 2.40356C6.53096 2.40356 6.66909 2.46078 6.77093 2.56263C6.87278 2.66447 6.93 2.8026 6.93 2.94664V6.38609H10.3694C10.5135 6.38609 10.6516 6.44331 10.7535 6.54515C10.8553 6.647 10.9125 6.78513 10.9125 6.92916Z"
              fill="#6F6F6F"
            />
          </svg>
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
