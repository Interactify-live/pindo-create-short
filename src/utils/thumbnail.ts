import React from "react";
export const generateThumbnailFromFile = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    console.log("[Thumbnail] Starting thumbnail generation...");

    const videoEl = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    videoEl.src = objectUrl;
    videoEl.crossOrigin = "anonymous";
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.preload = "auto";

    const canvas = document.createElement("canvas");
    canvas.width = 42;
    canvas.height = 42;

    const cleanup = () => {
      console.log("[Thumbnail] Cleaning up");
      URL.revokeObjectURL(objectUrl);
      videoEl.remove();
      canvas.remove();
    };

    const fail = (reason: string) => {
      console.error("[Thumbnail] Failed:", reason);
      cleanup();
      reject(new Error(reason));
    };

    videoEl.addEventListener("error", (e) => {
      fail(`video error: ${e}`);
    });

    videoEl.addEventListener("loadedmetadata", () => {
      console.log("[Thumbnail] Metadata loaded. Duration:", videoEl.duration);
    });

    videoEl.addEventListener("loadeddata", async () => {
      console.log("[Thumbnail] Data loaded");
      try {
        await videoEl.play().catch(() => {}); // play to force frame load
        videoEl.pause();
        const seekTo = Math.min(0.1, videoEl.duration || 1);
        videoEl.currentTime = seekTo;
      } catch (err) {
        fail("Exception in loadeddata: " + err);
      }
    });

    const captureFrame = () => {
      console.log("[Thumbnail] Attempting to capture frame");
      const ctx = canvas.getContext("2d");
      if (!ctx) return fail("No canvas context");

      try {
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return fail("Failed to create blob from canvas");
          const thumbnailFile = new File([blob], "thumbnail.png", {
            type: "image/png",
          });
          console.log("[Thumbnail] Capture success");
          cleanup();
          resolve(thumbnailFile);
        }, "image/png");
      } catch (e) {
        fail("drawImage failed: " + e);
      }
    };

    videoEl.addEventListener("seeked", () => {
      console.log("[Thumbnail] Seeked event fired");
      captureFrame();
    });

    videoEl.addEventListener("timeupdate", function handleTimeUpdate() {
      console.log("[Thumbnail] timeupdate fired as fallback");
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      captureFrame();
    });
  });
};
