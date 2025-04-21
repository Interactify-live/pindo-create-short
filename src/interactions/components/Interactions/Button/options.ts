import { ComponentProps } from "react";
import { BorderOutlined } from "@ant-design/icons";
import { INTERACTIONS } from "../../../interactions";
import { InteractionValidate } from "../../../types/interactionValidator";
import { Validators } from "../../../validators";

const ButtonInteraction: any = INTERACTIONS["button"];

export type Payload = ComponentProps<typeof ButtonInteraction.View>["payload"];

const name = "Button";
const icon = BorderOutlined;
const type = ButtonInteraction.type;
const defaultPayload: Payload = {
  text: "",
  url: "",
  background: "#683781",
  color: "white",
  size: { key: "medium", payload: { scale: 1 } },
};
const draggableOptions = {};
const { View } = ButtonInteraction;
const validate: InteractionValidate<Payload> = ({ payload }) => ({
  text: [
    Validators.required("Text", payload.text),
    Validators.maxLength("Text", payload.text, 50),
  ],
  url: [
    Validators.required("url", payload.url),
    Validators.url("url", payload.url),
  ],
  background: [Validators.required("background", payload.background)],
  color: [Validators.required("color", payload.color)],
});

export { View, name, icon, type, defaultPayload, draggableOptions, validate };
