import React from "react";
import { FileType, Media } from "../interactions/types.d/types";
interface Props {
    onSelect: (file: File, mediaType: FileType, thumb: any | null) => void;
    showToast: any;
    medias: Media[];
    setIsInteractionStep: any;
}
declare const Capture: React.FC<Props>;
export default Capture;
