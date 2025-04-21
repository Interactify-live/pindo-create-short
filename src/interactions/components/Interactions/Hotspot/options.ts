import { ComponentProps } from "react";
import { FontSizeOutlined } from "@ant-design/icons";
import { INTERACTIONS } from "../../../interactions";
import { InteractionValidate } from "../../../types/interactionValidator";
import { Validators } from "../../../validators";

const HotspotInteraction = INTERACTIONS["hotspot"];

export type Payload = ComponentProps<typeof HotspotInteraction.View>["payload"];

const name = "Hotspot";
const icon = FontSizeOutlined;
const type = HotspotInteraction.type;
const defaultPayload: Payload = {
  url: "",
  color: "rgba(234, 32, 136, 0.2)",
};
const draggableOptions = {
  resizable: true,
};
const { View } = HotspotInteraction;
const validate: InteractionValidate<Payload> = ({ payload }) => ({
  url: [
    Validators.required("url", payload.url),
    Validators.url("url", payload.url),
  ],
  color: [Validators.required("color", payload.color)],
});

export { name, icon, type, defaultPayload, draggableOptions, View, validate };
