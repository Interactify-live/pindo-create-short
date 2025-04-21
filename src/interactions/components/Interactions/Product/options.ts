import { ComponentProps } from "react";
import { AccountBookOutlined } from "@ant-design/icons";
import { INTERACTIONS } from "../../../interactions";
import { InteractionValidate } from "../../../types/interactionValidator";

const ProductInteraction = INTERACTIONS["product"];

export type Payload = ComponentProps<typeof ProductInteraction.View>["payload"];

const name = "Product";
const icon = AccountBookOutlined;
const type = "product";
const defaultPayload: Payload = {
  style: "detailed",
  products: [],
};
const draggableOptions = {};

const { View } = ProductInteraction;
const validate: InteractionValidate<Payload> = ({ payload }) => ({});

export { View, name, icon, type, defaultPayload, draggableOptions, validate };
