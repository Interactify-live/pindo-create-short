import { Payload } from "../options";

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
}

function MobileConfig({ setPayload, payload }: Props) {
  return (
    <>
      <div
        style={{
          height: 280,
          maxHeight: "100%",
          top: `calc(var(--window-inner-height) / 2 - 140px)`,
          position: "absolute",
          right: 0,
          zIndex: 40,
        }}
      ></div>
      <div
        style={{
          height: 32,
          top: `calc(var(--window-inner-height) - 16px - 32px)`,
          position: "absolute",
          width: "100%",
          left: 0,
          right: 0,
          paddingLeft: "16px",
          zIndex: 40,
        }}
      ></div>
    </>
  );
}

export { MobileConfig };
