/// <reference types="react" />
import { Media, MediaResult } from "../../types.d/types";
interface BottomControlsProps {
    medias: Media[];
    activeMedia: number;
    setActiveMedia: (index: number) => void;
    setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
    setInteractionStep: (value: boolean) => void;
    uploadFile?: (file: File, onProgress: (progress: number) => void) => Promise<string>;
    uploadProgressValue: number;
    onFinish: (medias: MediaResult[]) => void;
    coverIndex: number;
}
declare const BottomControls: React.FC<BottomControlsProps>;
export default BottomControls;
