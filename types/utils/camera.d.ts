export declare const getDevices: () => Promise<MediaDeviceInfo[]>;
export declare function getConstraints(videoDevice: InputDeviceInfo | null): {
    video: {
        deviceId: {
            exact: string | undefined;
        };
    };
    audio: boolean;
};
