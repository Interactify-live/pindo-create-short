import React from "react";
import { ComponentProps } from "react";
import { INTERACTIONS } from "../../../interactions";
import { InteractionValidate } from "../../../types/interactionValidator";
import { Validators } from "../../../validators";
import TextButton from "../../../../createLive/TextButton/TextButton";

const TextInteraction = INTERACTIONS["text"];

export type Payload = ComponentProps<typeof TextInteraction.View>["payload"];

const name = "Text";
const icon = TextButton;
const type = TextInteraction.type;
const defaultPayload: Payload = {
  text: "",
  size: 30,
  background: "rgba(0,0,0,0)",
  color: "#fff",
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
