import React from "react";
import { Check } from "../../../icons";
import { Media, VideoType } from "../../types.d/types";

interface CoverSelectorProps {
  coverIndex: number;
  activeMedia: number;
  setCoverIndex: (index: number) => void;
  medias: Media[];
}

const CoverSelector: React.FC<CoverSelectorProps> = ({
  coverIndex,
  activeMedia,
  setCoverIndex,
  medias,
}) => {
  // Don't render if there are no medias or if the active media is a video
  if (!medias || medias.length === 0 || activeMedia >= medias.length) {
    return null;
  }

  const currentMedia = medias[activeMedia];
  if (currentMedia.fileType === VideoType) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "25px",
        display: "flex",
        width: "100%",
        height: "40px",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingLeft: "16px",
          paddingRight: "16px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <button
            style={{
              background: "rgba(224, 224, 226, 1)",
              padding: "5px 15px",
              border: "none",
              borderRadius: "15px",
            }}
            onClick={() => {
              setCoverIndex(activeMedia);
            }}
          >
            {coverIndex === activeMedia ? (
              <div style={{ display: "flex" }}>
                <div>انتخاب شده به عنوان عکس کاور</div>
                <div style={{ marginLeft: "5px" }}>
                  <Check />
                </div>
              </div>
            ) : (
              <div>انتخاب به عنوان عکس کاور</div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverSelector;
