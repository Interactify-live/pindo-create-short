import React from "react";
import { Media } from "../../types.d/types";
interface CoverSelectorProps {
    coverIndex: number;
    activeMedia: number;
    setCoverIndex: (index: number) => void;
    medias: Media[];
}
declare const CoverSelector: React.FC<CoverSelectorProps>;
export default CoverSelector;
