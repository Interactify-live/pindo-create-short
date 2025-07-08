import React, { MouseEventHandler } from "react";
import { FileType } from "../../interactions/types.d/types";
interface Props {
    onClick: MouseEventHandler<HTMLElement>;
    captureType: FileType;
}
interface Ref {
    start: (animationDurationInMilliSeconds: number) => void;
    stop: VoidFunction;
}
declare const CaptureButton: React.ForwardRefExoticComponent<Props & React.RefAttributes<Ref>>;
export default CaptureButton;
