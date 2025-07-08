import { FileType } from '../../interactions/types.d/types';
interface MediaFile {
    file: File;
    type: FileType;
    thumbnail?: File;
    duration?: number;
}
export declare const useMedia: () => {
    processMediaFile: (file: File) => Promise<MediaFile>;
    validateMediaFile: (file: File, type: FileType) => string[];
    isProcessing: boolean;
};
export {};
