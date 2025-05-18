import { isMobile, isSafari } from "react-device-detect";

export const getDevices = async (): Promise<MediaDeviceInfo[]> => {
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  console.log(
    "get",
    mediaDevices.filter((m) => m.kind === "videoinput"),
  );
  let videoDevices: MediaDeviceInfo[] = [];

  const clusteredByFacingMode = mediaDevices
    .filter((mediaDevice) => mediaDevice.kind === "videoinput")
    .map(
      (mediaDevice: any) =>
        [
          mediaDevice.getCapabilities?.()?.facingMode?.[0] || "unknown",
          mediaDevice,
        ] as const,
    )
    .reduce(
      (cluster: any, [facingMode, mediaDevice]) => ({
        ...cluster,
        [facingMode]: [...(cluster[facingMode] || []), mediaDevice],
      }),
      {},
    );

  for (const facingMode in clusteredByFacingMode) {
    const cluster = clusteredByFacingMode[facingMode];

    if (facingMode === "unknown") {
      videoDevices = videoDevices.concat(cluster);
      continue;
    }

    let selectedItem: MediaDeviceInfo | null = null;
    let selectedItemWidth = Infinity;
    for (const clusterItem of cluster) {
      const capabilities = clusterItem.getCapabilities?.();
      const clusterItemWidth = capabilities?.width?.max ?? Infinity;

      if (clusterItemWidth <= selectedItemWidth) {
        selectedItem = clusterItem;
        selectedItemWidth = clusterItemWidth;
      }
    }

    if (selectedItem !== null) {
      videoDevices.push(selectedItem);
    }
  }

  return videoDevices;
};

export function getConstraints(videoDevice: InputDeviceInfo | null) {
  const ASPECT_RATIO = 9 / 16;
  let VIDEO_WIDTH = 750;
  let VIDEO_HEIGHT = VIDEO_WIDTH / ASPECT_RATIO;

  if (
    isMobile &&
    window.matchMedia("(orientation:portrait)").matches &&
    !isSafari
  ) {
    [VIDEO_HEIGHT, VIDEO_WIDTH] = [VIDEO_WIDTH, VIDEO_HEIGHT];
  }

  return {
    video: {
      deviceId: { exact: videoDevice?.deviceId },
      // ...(videoDevice ? { deviceId: videoDevice?.deviceId } : {}),
      // frameRate: { ideal: 30 },
      // width: { ideal: VIDEO_WIDTH },
      // height: { ideal: VIDEO_HEIGHT },
    },
    audio: true,
  };
}
