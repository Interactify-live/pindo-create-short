/// <reference types="react" />
import { InteractionItem, Media } from "../../types.d/types";
declare function InteractionView({ interaction, medias, setMedias, activeMedia, activeInteraction, setActiveInteraction, index, }: {
    interaction: InteractionItem;
    medias: Media[];
    setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
    activeMedia: number;
    activeInteraction: number;
    setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
    index: number;
}): JSX.Element;
export { InteractionView };
