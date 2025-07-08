import React, { memo, useCallback } from "react";
import { makeGeometricRelative } from "./draggable";
import { Interaction } from "./components/Interactions";
import InteractionHeader from "./components/InteractionHeader";
import MainContent from "./components/MainContent";
import TextOverlay from "./components/TextOverlay";
import BottomControls from "./components/BottomControls";
import { Media, MediaResult, InteractionItemResult } from "./types.d/types";
import { useEffect, useState } from "react";

interface Props {
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  setInteractionStep: React.Dispatch<React.SetStateAction<boolean>>;
  coverIndex: number;
  setCoverIndex: React.Dispatch<React.SetStateAction<number>>;
  onFinish: (medias: MediaResult[]) => void;
  uploadFile?: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
  uploadProgress: Map<string, number>;
}

const ShortCreateInteractionsStep: React.FC<Props> = memo(
  ({
    medias,
    setMedias,
    setInteractionStep,
    coverIndex,
    setCoverIndex,
    onFinish,
    uploadFile,
    uploadProgress,
  }: Props) => {
    const [activeInteraction, setActiveInteraction] = useState(-1);
    const hasAnyActiveInteraction = activeInteraction !== -1;
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayInput, setOverlayInput] = useState("");
    const [interaction, setInteraction] = useState<any>(null);
    const [activeMedia, setActiveMedia] = useState(
      medias.length > 0 ? medias.length - 1 : 0
    );

    useEffect(() => {
      console.log("KIR", medias[activeMedia]);
    }, [medias, activeMedia]);

    useEffect(() => {
      console.log("Updated interactions", medias);
    }, [medias]);

    const onAddInteraction = useCallback((interaction: Interaction) => {
      setOverlayInput("");
      setShowOverlay(true);
      setInteraction(interaction);
    }, []);

    const handleSaveTextInteraction = useCallback(
      (text: string) => {
        setMedias((prevMedias) => {
          return prevMedias.map((media, index) => {
            if (index === activeMedia) {
              const newInteraction = {
                interaction,
                payload: JSON.parse(
                  JSON.stringify({
                    ...interaction.defaultPayload,
                    text: text,
                  })
                ),
                geometric: makeGeometricRelative({
                  x: 50,
                  y: 50,
                  width: 100,
                  height: 100,
                }),
              };

              console.log(newInteraction);

              return {
                ...media,
                interactions: [...media.interactions, newInteraction],
              };
            }
            return media;
          });
        });

        setShowOverlay(false);
        setOverlayInput("");
      },
      [activeMedia, interaction, setMedias]
    );

    const handleCloseTextOverlay = useCallback(() => {
      setShowOverlay(false);
      setOverlayInput("");
    }, []);

    const onDeleteActiveInteraction = useCallback(() => {
      setMedias((prevMedias) => {
        return prevMedias.map((media, index) => {
          if (index === activeMedia) {
            return {
              ...media,
              interactions: media.interactions.filter(
                (_, i) => i !== activeInteraction
              ),
            };
          }
          return media;
        });
      });
      setActiveInteraction(-1);
    }, [activeMedia, activeInteraction, setMedias]);

    const onSaveActiveInteraction = useCallback(() => {
      const { interaction, payload } =
        medias[activeMedia].interactions[activeInteraction];
      const errorMessages = (interaction as any).validate({ payload });

      for (const errors of Object.values(errorMessages) as string[][]) {
        for (const error of errors) {
          if (typeof error !== "string" || error.length <= 0) continue;
          console.log("ERROR", error);
          return;
        }
      }

      setActiveInteraction(-1);
    }, [medias, activeMedia, activeInteraction]);

    return (
      <div
        style={{
          background: "#262626",
          flexGrow: 1,
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "16px", flexGrow: 1, display: "flex" }}>
          <div
            style={{
              border: "2px solid rgba(175, 177, 182, 1)",
              position: "relative",
              // width: "100%",
              // height: "calc(100% - 32px)",
              // margin: "16px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              // flex: 1,
            }}
          >
            <InteractionHeader
              activeMedia={activeMedia}
              setActiveMedia={setActiveMedia}
              setMedias={setMedias}
              setInteractionStep={setInteractionStep}
              hasAnyActiveInteraction={hasAnyActiveInteraction}
              activeInteraction={activeInteraction}
              setActiveInteraction={setActiveInteraction}
              medias={medias}
              onAddInteraction={onAddInteraction}
              onDeleteActiveInteraction={onDeleteActiveInteraction}
              onSaveActiveInteraction={onSaveActiveInteraction}
              coverIndex={coverIndex}
              setCoverIndex={setCoverIndex}
            />
            <MainContent
              medias={medias}
              setMedias={setMedias}
              activeMedia={activeMedia}
              activeInteraction={activeInteraction}
              setActiveInteraction={setActiveInteraction}
              coverIndex={coverIndex}
              setCoverIndex={setCoverIndex}
            />
          </div>
        </div>
        <BottomControls
          medias={medias}
          activeMedia={activeMedia}
          setActiveMedia={setActiveMedia}
          setActiveInteraction={setActiveInteraction}
          setInteractionStep={setInteractionStep}
          uploadFile={uploadFile}
          onFinish={onFinish}
          coverIndex={coverIndex}
          setMedias={setMedias}
          uploadProgress={uploadProgress}
        />
        <TextOverlay
          showOverlay={showOverlay}
          overlayInput={overlayInput}
          setOverlayInput={setOverlayInput}
          onSave={handleSaveTextInteraction}
          onClose={handleCloseTextOverlay}
        />
      </div>
    );
  }
);

ShortCreateInteractionsStep.displayName = "ShortCreateInteractionsStep";

export default ShortCreateInteractionsStep;
