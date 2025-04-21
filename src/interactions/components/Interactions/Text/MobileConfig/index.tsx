import { Slider } from "antd";
import { ColorInput } from "../../../ColorInput";
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
        }}
        className="pos-absolute right-0 z-10"
      >
        <Slider
          railStyle={{ background: "white" }}
          onChange={(value) => setPayload("size", value)}
          defaultValue={30}
          max={60}
          vertical
        />
      </div>
      <div
        className="pos-absolute w-full left-0 right-0 pl-4 z-10"
        style={{
          height: 32,
          top: `calc(var(--window-inner-height) - 16px - 32px)`,
        }}
      >
        <ColorInput
          value={payload.background}
          onChange={(hex) => {
            setPayload("background", hex);
            // @ts-ignore
            const decimal = Number(`0x${hex.slice(1)}`);
            setPayload("color", decimal > 0xffffff / 2 ? "#000" : "#fff");
          }}
        />
      </div>
    </>
  );
}

export { MobileConfig };
