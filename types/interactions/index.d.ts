import React from "react";
import { Media, MediaResult } from "./types.d/types";
interface Props {
    medias: Media[];
    setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
    setInteractionStep: React.Dispatch<React.SetStateAction<boolean>>;
    coverIndex: number;
    setCoverIndex: React.Dispatch<React.SetStateAction<number>>;
    onFinish: (medias: MediaResult[]) => void;
    uploadFile?: (file: File, onProgress: (progress: number) => void) => Promise<string>;
}
declare const ShortCreateInteractionsStep: React.FC<Props>;
export { ShortCreateInteractionsStep };
export default ShortCreateInteractionsStep;
