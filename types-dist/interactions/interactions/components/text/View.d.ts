/// <reference types="react" />
import { InteractionView } from "../../types/interactionView";
interface Payload {
    text: string;
    size: number;
    background: string;
    color: string;
}
declare function View({ payload, className, onClick, ...props }: InteractionView<Payload>): JSX.Element;
export { View };
