import { CSSProperties, useState } from "react";
import { Interaction } from "../Interactions";
import { InteractionsList } from "./InteractionsList";
import { RelativeGeometric } from "../../draggable";
import { InteractionItem, Media } from "../../types.d/types";

interface Props {
  className?: string;
  onAddInteraction: (interaction: Interaction) => void;
  style: CSSProperties;
  onDelete: VoidFunction;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  activeMedia: number;
}

function InteractionsContainer({
  onDelete,
  style,
  className,
  onAddInteraction,
  medias,
  setMedias,
  activeMedia,
  activeInteraction,
  setActiveInteraction,
}: Props) {
  const hasAnyActiveInteraction = activeInteraction !== -1;
  console.log("HAS", hasAnyActiveInteraction);

  const { interaction, payload } =
    medias[activeMedia].interactions[activeInteraction] || {};
  const setPayload = (key: string, value: any) => {
    setMedias((prevMedias) => {
      return prevMedias.map((media, mediaIndex) => {
        if (mediaIndex === activeMedia) {
          const updatedInteractions = media.interactions.map(
            (interaction, interactionIndex) => {
              if (interactionIndex === activeInteraction) {
                return {
                  ...interaction,
                  payload: {
                    ...interaction.payload,
                    [key]: value,
                  },
                };
              }
              return interaction;
            },
          );

          return {
            ...media,
            interactions: updatedInteractions,
          };
        }
        return media;
      });
    });
  };
  const interactionItem = medias[activeMedia].interactions[activeInteraction];

  const ConfigComponent = (interactionItem as any)?.Config;
  return (
    <>
      {interaction && ConfigComponent && (
        <ConfigComponent payload={payload} setPayload={setPayload} />
      )}
      {!hasAnyActiveInteraction && (
        <InteractionsList
          className={className}
          onClickInteraction={onAddInteraction}
        />
      )}
    </>
  );
}

export { InteractionsContainer };
