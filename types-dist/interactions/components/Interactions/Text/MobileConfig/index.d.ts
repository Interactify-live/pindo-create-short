/// <reference types="react" />
import { Payload } from "../options";
interface Props {
    setPayload: <T extends keyof Payload>(key: T, value: Payload[T]) => void;
    payload: Payload;
}
declare function MobileConfig({ setPayload, payload }: Props): JSX.Element;
export { MobileConfig };
