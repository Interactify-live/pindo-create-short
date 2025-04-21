import { TextInteraction } from "./components/text";
import { ButtonInteraction } from "./components/button";
import { ProductInteraction } from "./components/product";
import { HotspotInteraction } from "./components/hotspot";

const INTERACTIONS = {
  [TextInteraction.type]: TextInteraction,
  [ButtonInteraction.type]: ButtonInteraction,
  [ProductInteraction.type]: ProductInteraction,
  [HotspotInteraction.type]: HotspotInteraction,
} as const;

export { INTERACTIONS };

export type InteractionType = keyof typeof INTERACTIONS;
export type Interaction = (typeof INTERACTIONS)[keyof typeof INTERACTIONS];
