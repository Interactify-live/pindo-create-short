declare const INTERACTIONS: {
    readonly text: {
        readonly type: "text";
        readonly View: typeof import("./components/text/View").View;
    };
};
export { INTERACTIONS };
export type InteractionType = keyof typeof INTERACTIONS;
export type Interaction = (typeof INTERACTIONS)[keyof typeof INTERACTIONS];
