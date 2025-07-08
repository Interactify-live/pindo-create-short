export interface InteractionView<Payload> {
    className?: string;
    payload: Payload;
    onClick?: (payload: Payload) => void;
    isActive?: boolean;
    isUserView?: boolean;
    setPayload?: <T extends keyof Payload>(key: T, value: any) => void;
    isDesktop?: boolean;
}
