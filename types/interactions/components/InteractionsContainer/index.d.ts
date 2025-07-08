import { CSSProperties } from "react";
import { Interaction } from "../Interactions";
import { Media } from "../../types.d/types";
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
declare function InteractionsContainer({ onDelete, style, className, onAddInteraction, medias, setMedias, activeMedia, activeInteraction, setActiveInteraction, }: Props): JSX.Element;
export { InteractionsContainer };
