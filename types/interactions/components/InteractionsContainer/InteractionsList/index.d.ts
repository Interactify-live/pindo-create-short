/// <reference types="react" />
import { Interaction } from "../../Interactions";
interface Props {
    onClickInteraction: (interaction: Interaction) => void;
    className?: string;
}
declare function InteractionsList({ onClickInteraction, className }: Props): JSX.Element;
export { InteractionsList };
