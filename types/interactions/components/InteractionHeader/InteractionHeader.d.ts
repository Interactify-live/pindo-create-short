import React from "react";
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
    coverIndex: number;
    setCoverIndex: (index: number) => void;
}
declare const InteractionHeader: React.FC<InteractionHeaderProps>;
export default InteractionHeader;
