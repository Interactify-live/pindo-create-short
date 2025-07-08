import { ComponentProps } from "react";
import { InteractionValidate } from "../../../types/interactionValidator";
import TextButton from "../../../../createLive/TextButton/TextButton";
declare const TextInteraction: {
    readonly type: "text";
    readonly View: typeof import("../../../interactions/components/text/View").View;
};
export type Payload = ComponentProps<typeof TextInteraction.View>["payload"];
declare const name = "Text";
declare const icon: typeof TextButton;
declare const type: "text";
declare const defaultPayload: Payload;
declare const draggableOptions: {};
declare const View: typeof import("../../../interactions/components/text/View").View;
declare const validate: InteractionValidate<Payload>;
export { View, name, icon, type, defaultPayload, draggableOptions, validate };
