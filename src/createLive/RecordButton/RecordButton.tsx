import classnames from "classnames";
import styles from "./styles.module.scss";
import {
  forwardRef,
  MouseEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface Props {
  onClick: MouseEventHandler<HTMLElement>;
}
interface Ref {
  start: (animationDurationInMilliSeconds: number) => void;
  stop: VoidFunction;
}

const CONTAINER_SIZE = 80 + 3;

const RecordButton = forwardRef<Ref, Props>(({ onClick }: Props, ref) => {
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
    ctx.arc(0, 0, (CONTAINER_SIZE - 3) / 2, 0, endAngle);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    draw();
  }, []);

  return (
    <div
      className={classnames(
        styles.container,
        "pos-relative d-flex ai-center jc-center overflow-visible cursor-pointer",
      )}
      onClick={onClick}
    >
      <canvas
        width={CONTAINER_SIZE}
        height={CONTAINER_SIZE}
        ref={canvasRef}
        className="pos-absolute w-full h-full"
      />
      <div
        className={classnames(styles.button, "bg-red-50 rounded-circle")}
      ></div>
    </div>
  );
});

export default RecordButton;
