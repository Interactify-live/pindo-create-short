import { ComponentProps } from "react";
import { FontSizeOutlined } from "@ant-design/icons";
import { INTERACTIONS } from "../../../interactions";
import { InteractionValidate } from "../../../types/interactionValidator";
import { Validators } from "../../../validators";

const TextInteraction = INTERACTIONS["text"];

export type Payload = ComponentProps<typeof TextInteraction.View>["payload"];

const name = "Text";
const icon = FontSizeOutlined;
const type = TextInteraction.type;
const defaultPayload: Payload = {
  text: "",
  size: 30,
  background: "#ffffff",
  color: "#000000",
};
const draggableOptions = {};
const { View } = TextInteraction;
const validate: InteractionValidate<Payload> = ({ payload }) => ({
  text: [
    Validators.required("Text", payload.text),
    Validators.maxLength("Text", payload.text, 50),
  ],
  background: [Validators.required("background", payload.background)],
  color: [Validators.required("color", payload.color)],
});

export { View, name, icon, type, defaultPayload, draggableOptions, validate };
