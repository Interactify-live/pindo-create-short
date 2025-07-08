declare function useMediaRecorder({ onRecordEnd, maxDuration, onRecordStart, onPhotoTaken, }: {
    maxDuration?: number;
    onRecordStart?: VoidFunction;
    onRecordEnd?: (blob: File, thumb: File) => void;
    onPhotoTaken?: (photo: File) => void;
}): {
    initialize: (videoElement: HTMLVideoElement, stream: MediaStream) => Promise<void>;
    record: (stream: MediaStream) => Promise<void>;
    stop: () => Promise<void>;
    clear: () => Promise<void>;
    takePhoto: () => void;
    isRecording: boolean;
};
declare namespace useMediaRecorder {
    var isSupported: () => string | false;
}
export default useMediaRecorder;
