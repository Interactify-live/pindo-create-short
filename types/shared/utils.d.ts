interface ReturnType {
    r: number;
    g: number;
    b: number;
    css: string;
}
declare function hexToRGB(hex: string): ReturnType;
declare function getMediaDuration(file: File): Promise<number>;
export { getMediaDuration };
export { hexToRGB };
