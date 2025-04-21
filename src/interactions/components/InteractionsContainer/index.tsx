import { CSSProperties, useState } from "react";
import { Interaction } from "../Interactions";
import { InteractionsList } from "./InteractionsList";
import { RelativeGeometric } from "../../draggable";
import { InteractionItem } from "../../types.d/types";

interface Props {
  className?: string;
  onAddInteraction: (interaction: Interaction) => void;
  style: CSSProperties;
  onDelete: VoidFunction;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  interactions: InteractionItem[];
  setInteractions: React.Dispatch<React.SetStateAction<InteractionItem[]>>;
}

function InteractionsContainer({
  onDelete,
  style,
  className,
  onAddInteraction,
  interactions,
  setInteractions,
  activeInteraction,
  setActiveInteraction,
}: Props) {
  const hasAnyActiveInteraction = activeInteraction !== -1;
  console.log("HAS", hasAnyActiveInteraction);

  const { interaction, payload } = interactions[activeInteraction] || {};
  const setPayload = (key: any, value: any) => {
    setInteractions((prev: any) => {
      const updated = [...prev];
      const interaction = { ...updated[activeInteraction] };
      interaction.payload = { ...interaction.payload, [key]: value };
      updated[activeInteraction] = interaction;
      return updated;
    });
  };
  const interactionItem = interactions[activeInteraction];

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
