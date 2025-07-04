import React from "react";
import { Media, VideoType } from "../../interactions/types.d/types";

interface Props {
  onSelect(files: File[]): void;
  disabled: boolean;
  showToast: any;
  medias: Media[];
}

function BrowseFileButton({ onSelect, disabled, showToast, medias }: Props) {
  const onClick = () => {
    if (disabled) {
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "video/mp4,image/png,image/jpeg";
    input.click();
    input.oninput = () => {
      if (input.files && input.files.length > 0) {
        const files = Array.from(input.files);

        // Separate videos and images
        let videos = files.filter((file) => file.type.startsWith("video/"));
        let images = files.filter(
          (file) =>
            file.type.startsWith("image/") &&
            ["image/jpeg", "image/png"].includes(file.type)
        );

        // Check existing media
        const hasExistingVideo = medias.some(
          (file) => file.fileType === VideoType
        );
        const existingImageCount = medias.filter(
          (file) => file.fileType !== VideoType
        ).length;

        // Case 1: Trying to add multiple videos
        if (videos.length > 1) {
          showToast("شما حداکثر یک ویدیو می توانید داشته باشید");
          videos = [videos[0]];
        }

        // Case 2: Trying to add a video when one already exists
        if (videos.length > 0 && hasExistingVideo) {
          showToast("شما حداکثر یک ویدیو می توانید داشته باشید");
          videos = [];
        }

        // Case 3: Trying to add too many images (including existing ones)
        const totalImagesAfterAdd = existingImageCount + images.length;
        if (totalImagesAfterAdd > 10) {
          const allowedImages = 10 - existingImageCount;
          showToast(`شما حداکثر ۱۰ تصویر می توانید داشته باشید`);

          // If also trying to add a video, prioritize the video
          if (videos.length > 0 && !hasExistingVideo) {
            onSelect([videos[0], ...images.slice(0, allowedImages)]);
          } else {
            onSelect(images.slice(0, allowedImages));
          }
        } else {
          onSelect([...videos, ...images]);
        }
      }
    };
  };
  return (
    <div
      onClick={onClick}
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 23.25H9C3.57 23.25 1.25 20.93 1.25 15.5V9.5C1.25 4.07 3.57 1.75 9 1.75H15C20.43 1.75 22.75 4.07 22.75 9.5V15.5C22.75 20.93 20.43 23.25 15 23.25ZM9 3.25C4.39 3.25 2.75 4.89 2.75 9.5V15.5C2.75 20.11 4.39 21.75 9 21.75H15C19.61 21.75 21.25 20.11 21.25 15.5V9.5C21.25 4.89 19.61 3.25 15 3.25H9Z"
          fill="white"
        />
        <path
          d="M9 11.25C7.48 11.25 6.25 10.02 6.25 8.5C6.25 6.98 7.48 5.75 9 5.75C10.52 5.75 11.75 6.98 11.75 8.5C11.75 10.02 10.52 11.25 9 11.25ZM9 7.25C8.31 7.25 7.75 7.81 7.75 8.5C7.75 9.19 8.31 9.75 9 9.75C9.69 9.75 10.25 9.19 10.25 8.5C10.25 7.81 9.69 7.25 9 7.25Z"
          fill="white"
        />
        <path
          d="M2.66977 20.2001C2.42977 20.2001 2.18977 20.0801 2.04977 19.8701C1.81977 19.5301 1.90977 19.0601 2.25977 18.8301L7.18977 15.5201C8.26977 14.7901 9.75977 14.8801 10.7398 15.7101L11.0698 16.0001C11.5698 16.4301 12.4198 16.4301 12.9098 16.0001L17.0698 12.4301C18.1298 11.5201 19.7998 11.5201 20.8698 12.4301L22.4998 13.8301C22.8098 14.1001 22.8498 14.5701 22.5798 14.8901C22.3098 15.2001 21.8398 15.2401 21.5198 14.9701L19.8898 13.5701C19.3898 13.1401 18.5398 13.1401 18.0398 13.5701L13.8798 17.1401C12.8198 18.0501 11.1498 18.0501 10.0798 17.1401L9.74977 16.8501C9.28977 16.4601 8.52977 16.4201 8.01977 16.7701L3.08977 20.0801C2.95977 20.1601 2.80977 20.2001 2.66977 20.2001Z"
          fill="white"
        />
      </svg>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 500,
          lineHeight: "16px",
          marginTop: "4px",
        }}
      >
        گالری
      </span>
    </div>
  );
}

export { BrowseFileButton };
