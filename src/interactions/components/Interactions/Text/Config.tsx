import React from "react";
import { MobileConfig } from "./MobileConfig";
import { Payload } from "./options";

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
}

function Config({ setPayload, payload }: Props) {
  return <MobileConfig payload={payload} setPayload={setPayload} />;
}

export { Config };
