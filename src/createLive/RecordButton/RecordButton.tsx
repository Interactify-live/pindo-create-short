import {
  forwardRef,
  MouseEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { FileType, VideoType } from "../../interactions/types.d/types";

interface Props {
  onClick: MouseEventHandler<HTMLElement>;
  captureType: FileType;
}
interface Ref {
  start: (animationDurationInMilliSeconds: number) => void;
  stop: VoidFunction;
}

const CONTAINER_SIZE = 50;
const BUTTON_SIZE = 40;
const BORDER_WIDTH = 3;

const CaptureButton = forwardRef<Ref, Props>(
  ({ onClick, captureType }: Props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const interval = useRef<NodeJS.Timer | null>(null);

    const stop = () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
      draw();
    };

    useImperativeHandle(ref, () => ({
      start: (animationDurationInMilliSeconds) => {
        stop();

        const stepPerMilliSecond =
          (2 * Math.PI) / animationDurationInMilliSeconds;
        const stepsPer50MilliSeconds = stepPerMilliSecond * 50;
        let value = 0;
        draw(value);
        interval.current = setInterval(() => {
          value += stepsPer50MilliSeconds;
          draw(value);
        }, 50);
      },
      stop,
    }));

    const draw = (endAngle = 2 * Math.PI) => {
      if (!canvasRef.current) {
        return;
      }
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, CONTAINER_SIZE, CONTAINER_SIZE);
      ctx.save();
      ctx.translate(CONTAINER_SIZE / 2, CONTAINER_SIZE / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.beginPath();
      ctx.arc(0, 0, (CONTAINER_SIZE - BORDER_WIDTH) / 2, 0, endAngle);
      ctx.lineWidth = BORDER_WIDTH;
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.restore();
    };

    useEffect(() => {
      draw();
    }, []);

    return (
      <div
        onClick={onClick}
        style={{
          width: `${CONTAINER_SIZE}px`,
          height: `${CONTAINER_SIZE}px`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          cursor: "pointer",
        }}
      >
        <canvas
          width={CONTAINER_SIZE}
          height={CONTAINER_SIZE}
          ref={canvasRef}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        <div
          style={{
            width: `${BUTTON_SIZE}px`,
            height: `${BUTTON_SIZE}px`,
            borderRadius: "50%",
            background: captureType === VideoType ? "#FF3F17" : "#FFFFFF",
          }}
        ></div>
      </div>
    );
  },
);

export default CaptureButton;
