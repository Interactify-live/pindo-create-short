import React from "react";
export type InteractionValidate<Payload> = (props: {
  payload: Payload;
}) => Partial<Record<keyof Payload, Array<string | undefined>>>;
