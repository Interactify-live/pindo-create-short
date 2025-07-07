import { useState, useEffect, useCallback } from 'react';
import { getConstraints, getDevices } from '../../utils/camera';

export interface CameraDevice extends MediaDeviceInfo {
  facing: 'user' | 'environment' | 'unknown';
}

export const useCamera = () => {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeDevices = useCallback(async () => {
    try {
      setError(null);
      const videoDevices = await getDevices();
      // Transform MediaDeviceInfo to CameraDevice
      const cameraDevices: CameraDevice[] = videoDevices.map(device => ({
        ...device,
        facing: 'unknown' as const, // Default facing, can be enhanced later
      }));
      setDevices(cameraDevices);
      setIsInitialized(true);
    } catch (err) {
      setError('Failed to access camera devices');
      console.error('Camera initialization error:', err);
    }
  }, []);

  const startCamera = useCallback(async (deviceIndex?: number) => {
    try {
      setError(null);

      // Stop existing stream
      if (mediaStream) {
        mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }

      const targetIndex = deviceIndex ?? currentDeviceIndex;
      const device = devices[targetIndex];

      if (!device) {
        throw new Error('No camera device available');
      }

      const stream = await navigator.mediaDevices.getUserMedia(
        getConstraints(device)
      );

      setMediaStream(stream);
      setCurrentDeviceIndex(targetIndex);

      return stream;
    } catch (err) {
      setError('Failed to start camera');
      console.error('Camera start error:', err);
      throw err;
    }
  }, [devices, currentDeviceIndex, mediaStream]);

  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  const switchCamera = useCallback(() => {
    if (devices.length > 1) {
      const nextIndex = (currentDeviceIndex + 1) % devices.length;
      startCamera(nextIndex);
    }
  }, [devices.length, currentDeviceIndex, startCamera]);

  useEffect(() => {
    initializeDevices();
  }, [initializeDevices]);

  useEffect(() => {
    if (devices.length > 0 && !mediaStream) {
      startCamera();
    }
  }, [devices, mediaStream, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    devices,
    currentDevice: devices[currentDeviceIndex],
    mediaStream,
    isInitialized,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    canSwitchCamera: devices.length > 1,
  };
};