/// <reference types="react" />
import { Media } from "../../types.d/types";
interface MediaThumbnailsProps {
    medias: Media[];
    activeMedia: number;
    setActiveMedia: (index: number) => void;
    setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
    uploadFile?: (file: File, onProgress: (progress: number) => void) => Promise<string>;
    uploadProgressValue: number;
    setInteractionStep: (value: boolean) => void;
    coverIndex: number;
}
declare const MediaThumbnails: React.FC<MediaThumbnailsProps>;
export default MediaThumbnails;
