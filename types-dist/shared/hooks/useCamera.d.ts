export interface CameraDevice extends MediaDeviceInfo {
    facing: 'user' | 'environment' | 'unknown';
}
export declare const useCamera: () => {
    devices: CameraDevice[];
    currentDevice: CameraDevice;
    mediaStream: MediaStream | null;
    isInitialized: boolean;
    error: string | null;
    startCamera: (deviceIndex?: number) => Promise<MediaStream>;
    stopCamera: () => void;
    switchCamera: () => void;
    canSwitchCamera: boolean;
};
