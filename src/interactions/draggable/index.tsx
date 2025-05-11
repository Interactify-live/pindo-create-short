import {
  createContext,
  Fragment,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  TouchEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import styles from "./styles.module.scss";
import { Geometric } from "./types/geometric";
import { RelativeGeometric } from "./types/relative-geometric";
import { makeGeometricRelative } from "./utils/makeGeometricRelative";

const context = createContext<{
  containerRef: HTMLElement | null;
}>({
  containerRef: null,
});

function DraggableContainer({
  children,
}: {
  children: (props: { ref: any }) => ReactNode;
}) {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  return (
    <context.Provider value={{ containerRef }}>
      {children({ ref: (ref: any) => setContainerRef(ref) })}
    </context.Provider>
  );
}

const RESIZE_DIRECTIONS = ["TR", "TL", "BR", "BL", "CR", "CL"] as const;
type ResizeDirection = (typeof RESIZE_DIRECTIONS)[number];

type ResizeHandleRenderer = (props: {
  direction: ResizeDirection;
  onMouseDown: MouseEventHandler;
  onTouchStart: TouchEventHandler;
}) => ReactElement;
const defaultResizeHandleRenderer: ResizeHandleRenderer = ({
  onMouseDown,
  onTouchStart,
  direction,
}) => (
  <div
    onMouseDown={onMouseDown}
    onTouchStartCapture={onTouchStart}
    className={classnames(styles[`resizeHandle${direction}`])}
  ></div>
);

function getPointerEventPosition(e: MouseEvent | TouchEvent) {
  // if event is touch
  if ("touches" in e) {
    const touch = e.touches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }

  // if event is mouse
  return { clientX: e.clientX, clientY: e.clientY };
}

function DraggableItem({
  children,
  geometric,
  onChange,
  draggable = true,
  resizable,
  resizeHandles = ["TR", "TL", "BR", "BL"],
  renderResizeHandle = defaultResizeHandleRenderer,
}: {
  children?: ReactNode;
  geometric: Geometric;
  onChange: (
    props: Partial<Geometric>,
    options: { container: HTMLElement },
  ) => void;
  draggable?: boolean;
  resizable?: boolean;
  resizeHandles?: Array<ResizeDirection>;
  renderResizeHandle?: ResizeHandleRenderer;
}) {
  const { containerRef } = useContext(context);
  const [isActive, setIsActive] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const updateMousePos = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    mousePos.current.x = clientX;
    mousePos.current.y = clientY;
  };
  const justMoved = useRef(false);
  const resize = useRef<{
    isResizing: boolean;
    resizeDirection: (typeof RESIZE_DIRECTIONS)[number];
  }>({ isResizing: false, resizeDirection: "TL" });

  const onUp = () => {
    setIsActive(false);
    resize.current.isResizing = false;
  };
  const onDown = (e: any) => {
    const { clientX, clientY } = getPointerEventPosition(e);
    updateMousePos({ clientY, clientX });
    setIsActive(true);
    justMoved.current = false;
  };

  const onResizeHandlePointerDown =
    (resizeDirection: ResizeDirection) => () => {
      resize.current = {
        isResizing: true,
        resizeDirection,
      };
    };

  useEffect(() => {
    if (!containerRef) return;

    const containerWidth = containerRef.getBoundingClientRect().width;

    const onMove = (e: any) => {
      const { clientX, clientY } = getPointerEventPosition(e);
      const mouseMoveX = clientX - mousePos.current.x;
      const mouseMoveY = clientY - mousePos.current.y;

      if (resize.current.isResizing && resizable) {
        let { x, y, width, height } = geometric;

        switch (resize.current.resizeDirection) {
          case "BR":
            width += mouseMoveX;
            height += mouseMoveY;
            break;

          case "BL":
            width -= mouseMoveX;
            height += mouseMoveY;
            x += mouseMoveX;
            break;

          case "TL":
            width -= mouseMoveX;
            height -= mouseMoveY;
            x += mouseMoveX;
            y += mouseMoveY;
            break;

          case "TR":
            width += mouseMoveX;
            height -= mouseMoveY;
            y += mouseMoveY;
            break;

          case "CR":
            width += mouseMoveX;
            break;

          case "CL":
            width -= mouseMoveX;
            x += mouseMoveX;
            break;
        }

        onChange(
          {
            x,
            y,
            width,
            height,
          },
          { container: containerRef },
        );
      } else if (isActive && draggable) {
        justMoved.current = true;

        onChange(
          {
            x: geometric.x + mouseMoveX,
            y: geometric.y + mouseMoveY,
          },
          { container: containerRef },
        );
      }

      updateMousePos({ clientY, clientX });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [containerRef, isActive, geometric]);

  return (
    <div
      onClickCapture={(e) => {
        if (justMoved.current) {
          e.stopPropagation();
        }
      }}
      onMouseDown={onDown}
      onTouchStart={onDown}
      className={classnames(styles["item"], {
        "cursor-move": isActive,
        [styles["item--active"]]: isActive,
        "cursor-pointer": !isActive,
      })}
      style={{
        maxWidth: "100%",
        position: "absolute",
        boxSizing: "border-box",
        userSelect: "none",
        left: geometric.x,
        top: geometric.y,
        width: resizable ? geometric.width : "auto",
        height: resizable ? geometric.height : "auto",
      }}
    >
      {resizable && (
        <div className={styles.resizeHandles}>
          {resizeHandles.map((direction) => (
            <Fragment key={direction}>
              {renderResizeHandle({
                onMouseDown: onResizeHandlePointerDown(direction),
                onTouchStart: onResizeHandlePointerDown(direction),
                direction,
              })}
            </Fragment>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}

const Draggable = {
  Item: DraggableItem,
  Container: DraggableContainer,
};

export { Draggable, makeGeometricRelative };
export type { Geometric, RelativeGeometric };
