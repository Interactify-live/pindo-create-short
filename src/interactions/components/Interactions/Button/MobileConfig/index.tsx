import { Payload } from "../options";
import { ColorInput } from "../../../ColorInput";
import { URLInput } from "../../../URLInput";

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
}

function MobileConfig({ payload, setPayload }: Props) {
  return (
    <div>
      <div className="pos-absolute w-full left-0 right-0 z-10 bottom-0">
        <ColorInput
          className="pl-4 pb-4"
          value={payload.background}
          onChange={(hex) => {
            setPayload("background", hex);
            // @ts-ignore
            const decimal = Number(`0x${hex.slice(1)}`);
            setPayload("color", decimal > 0xffffff / 2 ? "#000" : "#fff");
          }}
        />
        <URLInput
          value={payload.url}
          onChange={(e) => {
            setPayload("url", e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export { MobileConfig };
