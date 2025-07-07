import React from "react";
import MediaThumbnails from "../MediaThumbnails";
import { Media, ImageType, MediaResult, InteractionItemResult } from "../../types.d/types";

// Utility function to convert numbers to Persian numerals
const toPersianNumbers = (num: number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

interface BottomControlsProps {
  medias: Media[];
  activeMedia: number;
  setActiveMedia: (index: number) => void;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  setInteractionStep: (value: boolean) => void;
  uploadFile?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
  uploadProgressValue: number;
  onFinish: (medias: MediaResult[]) => void;
  coverIndex: number;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  medias,
  activeMedia,
  setActiveMedia,
  setActiveInteraction,
  setInteractionStep,
  uploadFile,
  uploadProgressValue,
  onFinish,
  coverIndex,
}) => {
  const handleFinish = () => {
    onFinish(
      medias.map((media): MediaResult => {
        return {
          ...media,
          interactions: media.interactions.map(
            (interactionItem): InteractionItemResult => {
              return {
                payload: interactionItem.payload,
                geometric: interactionItem.geometric,
                interaction: interactionItem.interaction.type,
              };
            }
          ),
        };
      })
    );
  };

  return (
    <div style={{
          width: "100%",
          // height: "90px",
    }}>
      <div
        style={{
          width: "100%",
          paddingBottom: "13px",
          paddingLeft: "16px",
          paddingRight: "16px",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          direction: "rtl",
        }}
      >
        <MediaThumbnails
          medias={medias}
          activeMedia={activeMedia}
          setActiveMedia={setActiveMedia}
          setActiveInteraction={setActiveInteraction}
          uploadFile={uploadFile}
          uploadProgressValue={uploadProgressValue}
          setInteractionStep={setInteractionStep}
          coverIndex={coverIndex}
        />
      </div>
        <div>
          <div style={{ color: "white", display: "flex", marginBottom: "15px" }}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "5px",
                border: "1.5px solid rgba(255, 255, 255, 1)",
                borderRadius: "8px",
                width: "63px",
                textAlign: "center",
                fontSize: "10px",
              }}
            >
              {toPersianNumbers(medias.filter((m) => m.fileType === ImageType).length)} / {toPersianNumbers(10)}
            </div>
          </div>
        </div>
      <div
        style={{
          background: "black",
          height: "52px",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{
            width: "100%",
            height: "48px",
            background: "rgba(68, 68, 68, 1)",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            border: "none",
            borderRadius: "9px",
          }}
          onClick={handleFinish}
        >
          ادامه
        </button>
      </div>
    </div>
  );
};

export default BottomControls;