import React from "react";
import { TextInteraction } from "./components/text";

const INTERACTIONS = {
  [TextInteraction.type]: TextInteraction,
} as const;

export { INTERACTIONS };

export type InteractionType = keyof typeof INTERACTIONS;
export type Interaction = (typeof INTERACTIONS)[keyof typeof INTERACTIONS];
