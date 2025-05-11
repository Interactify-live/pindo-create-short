// import * as ButtonInteraction from "./Button";
// import * as HotspotInteraction from "./Hotspot";
// import * as ProductInteraction from "./Product";
import * as TextInteraction from "./Text";

const INTERACTIONS = {
  [TextInteraction.type]: TextInteraction,
  // [ButtonInteraction.type]: ButtonInteraction,
  // [ProductInteraction.type]: ProductInteraction,
  // [HotspotInteraction.type]: HotspotInteraction,
} as const;

export { INTERACTIONS };

export type Interaction = (typeof INTERACTIONS)[keyof typeof INTERACTIONS];
