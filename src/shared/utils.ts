interface ReturnType {
  r: number;
  g: number;
  b: number;
  css: string;
}

function hexToRGB(hex: string): ReturnType {
  if (hex.startsWith("rgb")) {
    const [r, g, b] = hex
      .replace(/[^0-9,]/g, "")
      .split(",")
      .map((item) => parseInt(item));
    return { r, g, b, css: hex };
  }

  const temp = hex.replace(/^#/, "");

  const red = parseInt(temp.substring(0, 2), 16);
  const green = parseInt(temp.substring(2, 4), 16);
  const blue = parseInt(temp.substring(4, 6), 16);

  return { r: red, g: green, b: blue, css: `rgb(${red},${green},${blue})` };
}

function getMediaDuration(file: File): Promise<number> {
  const url = URL.createObjectURL(file);
  const revoke = () => URL.revokeObjectURL(url);

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.autoplay = true;

    /**
     * Previously I used onloadedmetadata event to get video.duration,
     * But, it was not working on webm video formats.
     * Now, I seek currentTime to a big number, then use onSeeked event.
     */
    video.currentTime = 7 * 24 * 60 * 1000;
    video.onseeked = () => {
      revoke();
      resolve(video.duration);
    };

    video.onerror = (e) => {
      revoke();
      console.error("getMediaDuration", e);
      reject(e);
    };
    video.src = url;
  });
}

export { getMediaDuration };
export { hexToRGB };
