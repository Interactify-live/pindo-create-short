import React from "react";
import Trash from "../../../icons/trash";
import { InteractionsContainer } from "../InteractionsContainer";
import { INTERACTIONS_CONTAINER_BASE_WIDTH } from "../../../shared/constants";
import { Interaction } from "../Interactions";
import { Media } from "../../types.d/types";

interface InteractionHeaderProps {
  activeMedia: number;
  setActiveMedia: (index: number) => void;
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  setInteractionStep: (value: boolean) => void;
  hasAnyActiveInteraction: boolean;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  medias: Media[];
  onAddInteraction: (interaction: Interaction) => void;
  onDeleteActiveInteraction: () => void;
  onSaveActiveInteraction: () => void;
}

const InteractionHeader: React.FC<InteractionHeaderProps> = ({
  activeMedia,
  setActiveMedia,
  setMedias,
  setInteractionStep,
  hasAnyActiveInteraction,
  activeInteraction,
  setActiveInteraction,
  medias,
  onAddInteraction,
  onDeleteActiveInteraction,
  onSaveActiveInteraction,
}) => {
  const handleDeleteMedia = () => {
    setMedias((prev) => {
      const updated = prev.filter((_, i) => i !== activeMedia);
      if (updated.length === 0) {
        setInteractionStep(false);
      } else {
        console.log("INO", activeMedia);
        if (activeMedia > 0) {
          setActiveMedia(activeMedia - 1);
        } else {
          setActiveMedia(0);
        }
      }
      return updated;
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 999,
        width: "100%",
        direction: "rtl",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
          borderRadius: "15px",
          padding: "10px",
        }}
        onClick={handleDeleteMedia}
      >
        <Trash />
      </div>
      <div style={{padding: "10px"}}>
      {hasAnyActiveInteraction ? (
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <button
            color="white"
            style={{ background: "none", border: "none", opacity: 50 }}
            onClick={onDeleteActiveInteraction}
          >
            <Trash />
          </button>
          <button
            style={{
              background: "rgba(56, 78, 216, 1)",
              color: "white",
              width: "60px",
              height: "30px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              marginLeft: "25px",
              marginRight: "auto",
            }}
            onClick={onSaveActiveInteraction}
          >
            تایید
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            position: "relative",
          }}
        >
          <div>
            {medias[activeMedia] && medias[activeMedia].interactions && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "transparent",
                    borderRadius: "15px",
                  }}
                >
                  <InteractionsContainer
                    activeInteraction={activeInteraction}
                    setActiveInteraction={setActiveInteraction}
                    medias={medias}
                    setMedias={setMedias}
                    activeMedia={activeMedia}
                    style={{ width: INTERACTIONS_CONTAINER_BASE_WIDTH }}
                    onAddInteraction={onAddInteraction}
                    onDelete={onDeleteActiveInteraction}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default InteractionHeader;