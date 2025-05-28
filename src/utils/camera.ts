import { isMobile, isSafari } from "react-device-detect";

export const getDevices = async (): Promise<MediaDeviceInfo[]> => {
  console.log("RUNCOUNT");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    console.log("MEDIADEVICES", mediaDevices);

    const videoDevicesGrouped: Record<string, MediaDeviceInfo[]> = {
      user: [],
      environment: [],
      unknown: [],
    };

    for (const device of mediaDevices) {
      if (device.kind !== "videoinput") continue;

      let facing: "user" | "environment" | "unknown" = "unknown";

      const label = device.label.toLowerCase();

      if (label.includes("front")) {
        facing = "user";
      } else if (label.includes("back")) {
        facing = "environment";
      }

      videoDevicesGrouped[facing].push(device);
    }

    console.log("GROUPED BY FACING", videoDevicesGrouped);

    const videoDevices: MediaDeviceInfo[] = [];

    if (videoDevicesGrouped.environment.length > 0) {
      videoDevices.push(videoDevicesGrouped.environment[0]);
    }

    if (videoDevicesGrouped.user.length > 0) {
      videoDevices.push(videoDevicesGrouped.user[0]);
    }

    if (videoDevicesGrouped.unknown.length > 0) {
      videoDevices.push(videoDevicesGrouped.unknown[0]);
    }

    stream.getTracks().forEach((t) => t.stop());

    console.log("COUNT HERE");
    return videoDevices;
  } catch (err) {
    console.error("Failed to access media devices", err);
    return []; // ✅ Fix: Return fallback to match function return type
  }
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
      // deviceId: { exact: videoDevice?.deviceId },
      // ...(videoDevice ? { deviceId: videoDevice?.deviceId } : {}),
      // frameRate: { ideal: 30 },
      // width: { ideal: VIDEO_WIDTH },
      // height: { ideal: VIDEO_HEIGHT },
    },
    audio: true,
  };
}
