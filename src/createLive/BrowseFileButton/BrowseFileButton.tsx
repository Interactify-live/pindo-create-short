import React from "react";
import { Media, VideoType } from "../../interactions/types.d/types";
import { Gallery } from "../../icons";

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

        // Filter out duplicate files that are already in the medias array
        const uniqueFiles = files.filter((file) => {
          return !medias.some((media) => {
            const existingFile = media.data.file;
            return (
              existingFile.name === file.name &&
              existingFile.size === file.size &&
              existingFile.lastModified === file.lastModified
            );
          });
        });

        if (uniqueFiles.length === 0) {
          showToast("تمام فایل‌های انتخاب شده قبلاً اضافه شده‌اند", "warning");
          return;
        }

        if (uniqueFiles.length < files.length) {
          showToast("برخی فایل‌های تکراری نادیده گرفته شدند", "info");
        }

        // Separate videos and images
        let videos = uniqueFiles.filter((file) =>
          file.type.startsWith("video/")
        );
        let images = uniqueFiles.filter(
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
      <Gallery />
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
