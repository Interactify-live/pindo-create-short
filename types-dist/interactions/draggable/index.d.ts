import { MouseEventHandler, ReactElement, ReactNode, TouchEventHandler } from "react";
import { Geometric } from "./types/geometric";
import { RelativeGeometric } from "./types/relative-geometric";
import { makeGeometricRelative } from "./utils/makeGeometricRelative";
declare function DraggableContainer({ children, }: {
    children: (props: {
        ref: any;
    }) => ReactNode;
}): JSX.Element;
declare const RESIZE_DIRECTIONS: readonly ["TR", "TL", "BR", "BL", "CR", "CL"];
type ResizeDirection = (typeof RESIZE_DIRECTIONS)[number];
type ResizeHandleRenderer = (props: {
    direction: ResizeDirection;
    onMouseDown: MouseEventHandler;
    onTouchStart: TouchEventHandler;
}) => ReactElement;
declare function DraggableItem({ children, geometric, onChange, draggable, resizable, resizeHandles, renderResizeHandle, }: {
    children?: ReactNode;
    geometric: Geometric;
    onChange: (props: Partial<Geometric>, options: {
        container: HTMLElement;
    }) => void;
    draggable?: boolean;
    resizable?: boolean;
    resizeHandles?: Array<ResizeDirection>;
    renderResizeHandle?: ResizeHandleRenderer;
}): JSX.Element;
declare const Draggable: {
    Item: typeof DraggableItem;
    Container: typeof DraggableContainer;
};
export { Draggable, makeGeometricRelative };
export type { Geometric, RelativeGeometric };
