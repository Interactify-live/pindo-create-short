export const generateThumbnailFromFile = async (
  file: File,
): Promise<string> => {
  return new Promise((resolve) => {
    const videoEl = document.createElement("video");

    videoEl.src = URL.createObjectURL(file);
    videoEl.crossOrigin = "anonymous";
    videoEl.muted = true;
    videoEl.currentTime = 0; // Initial seek to 0 (optional)

    videoEl.addEventListener("loadeddata", () => {
      videoEl.currentTime = 0; // Ensure the video is at the start point

      // Wait until the video has actually seeked to the right position
      videoEl.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 42;
        canvas.height = 42;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/png");
          resolve(thumbnailUrl);
        } else {
          resolve(""); // fallback in case of failure
        }

        URL.revokeObjectURL(videoEl.src); // cleanup
      });
    });

    videoEl.addEventListener("error", () => {
      resolve(""); // in case of error
    });
  });
};
