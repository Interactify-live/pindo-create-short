import React, { memo, useCallback } from "react";
import MediaThumbnails from "../MediaThumbnails";
import {
  Media,
  ImageType,
  MediaResult,
  InteractionItemResult,
} from "../../types.d/types";

// Utility function to convert numbers to Persian numerals
const toPersianNumbers = (num: number): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
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
  ) => Promise<any>;
  onFinish: (medias: MediaResult[]) => void;
  coverIndex: number;
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  uploadProgress: Map<string, number>;
}

const BottomControls: React.FC<BottomControlsProps> = memo(
  ({
    medias,
    activeMedia,
    setActiveMedia,
    setActiveInteraction,
    setInteractionStep,
    uploadFile,
    onFinish,
    coverIndex,
    setMedias,
    uploadProgress,
  }) => {
    const handleFinish = useCallback(() => {
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
    }, [medias, onFinish]);

    return (
      <div
        style={{
          width: "100%",
          height: "220px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "12px",
            paddingLeft: "16px",
            paddingRight: "16px",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            direction: "rtl",
            height: "80px",
          }}
        >
          <MediaThumbnails
            medias={medias}
            activeMedia={activeMedia}
            setActiveMedia={setActiveMedia}
            setActiveInteraction={setActiveInteraction}
            uploadFile={uploadFile}
            setInteractionStep={setInteractionStep}
            coverIndex={coverIndex}
            setMedias={setMedias}
            uploadProgress={uploadProgress}
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          <div
            style={{ color: "white", display: "flex", marginBottom: "12px" }}
          >
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
              }}
            >
              <div>{toPersianNumbers(10)}</div>
              <div>/</div>
              <div>
                {toPersianNumbers(
                  medias.filter((m) => m.fileType === ImageType).length
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "black",
            flex: 1,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "52px",
          }}
        >
          <button
            style={{
              width: "100%",
              height: "44px",
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
  }
);

BottomControls.displayName = "BottomControls";

export default BottomControls;
