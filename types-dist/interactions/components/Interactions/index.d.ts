import * as TextInteraction from "./Text";
declare const INTERACTIONS: {
    readonly text: typeof TextInteraction;
};
export { INTERACTIONS };
export type Interaction = (typeof INTERACTIONS)[keyof typeof INTERACTIONS];
