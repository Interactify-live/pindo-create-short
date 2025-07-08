import { FileType, Media } from '../../interactions/types.d/types';
export interface ProcessedMedia {
    file: File;
    type: FileType;
    thumbnail?: File;
    duration?: number;
    src: string;
    thumbnailSrc?: string;
}
export declare const processMediaFile: (file: File) => Promise<ProcessedMedia>;
export declare const validateMediaConstraints: (medias: Media[], newMediaType: FileType, showToast: (message: string) => void) => boolean;
export declare const validateVideoDuration: (duration: number, showToast: (message: string) => void) => boolean;
export declare const cleanupMediaUrls: (media: ProcessedMedia) => void;
