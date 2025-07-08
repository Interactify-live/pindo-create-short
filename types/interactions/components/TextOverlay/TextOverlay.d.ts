import React from "react";
interface TextOverlayProps {
    showOverlay: boolean;
    overlayInput: string;
    setOverlayInput: (value: string) => void;
    onSave: (text: string) => void;
    onClose: () => void;
}
declare const TextOverlay: React.FC<TextOverlayProps>;
export default TextOverlay;
