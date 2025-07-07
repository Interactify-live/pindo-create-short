import React from "react";
import { makeGeometricRelative } from "../../draggable";

interface TextOverlayProps {
  showOverlay: boolean;
  overlayInput: string;
  setOverlayInput: (value: string) => void;
  onSave: (text: string) => void;
  onClose: () => void;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  showOverlay,
  overlayInput,
  setOverlayInput,
  onSave,
  onClose,
}) => {
  if (!showOverlay) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        style={{
          position: "absolute",
          width: "60px",
          height: "30px",
          top: "20px",
          right: "20px",
          background: "rgba(56, 78, 216, 1)",
          color: "white",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          fontSize: "14px",
          cursor: "pointer",
        }}
        onClick={() => {
          onSave(overlayInput);
        }}
      >
        تایید
      </button>

      <textarea
        value={overlayInput}
        onChange={(e) => setOverlayInput(e.target.value)}
        placeholder="متن"
        style={{
          background: "transparent",
          outline: "none",
          caretColor: "rgba(56, 78, 216, 1)",
          fontSize: "28px",
          border: "none",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          width: "60%",
          textAlign: "center",
          direction: "rtl",
          resize: "none",
          overflow: "hidden",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
};

export default TextOverlay;