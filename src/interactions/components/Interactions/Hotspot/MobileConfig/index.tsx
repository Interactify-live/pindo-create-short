import { Payload } from "../options";
import { URLInput } from "../../../URLInput";

interface Props {
  setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
  payload: Payload;
}
function MobileConfig({ payload, setPayload }: Props) {
  return (
    <div className="pos-absolute bottom-0 left-0 w-full z-10">
      <URLInput
        value={payload.url}
        onChange={(e: any) => {
          setPayload("url", e.target.value);
        }}
      />
    </div>
  );
}

export { MobileConfig };
