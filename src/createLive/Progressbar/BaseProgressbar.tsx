import classnames from "classnames";
import { VIDEO_INDEX_COLORS } from "../../shared/constants";
import styles from "./styles.module.scss";

interface Props {
  className?: string;
  width?: number | string;
  percents: number[];
  onDelete: ({ index }: { index: number }) => void;
}

function Progressbar({ onDelete, className, percents, width }: Props) {
  return (
    <div
      style={{ width }}
      className={classnames("d-flex ai-center", className)}
    >
      <span className="text-body-sm color-neutral-100">0s</span>
      <div
        className={classnames(
          "mx-1 flex-1 rounded-4 bg-neutral-10 d-flex",
          styles.bar,
        )}
      >
        {percents.map((percent, index) => (
          <div
            style={{
              background: VIDEO_INDEX_COLORS[index % VIDEO_INDEX_COLORS.length],
              width: `calc(${percent}% - ${
                ((percents.length - 1) * 2) / percents.length
              }px`,
            }}
            key={index}
            className={classnames(styles.barItem, "pos-relative")}
          ></div>
        ))}
      </div>
      <span className="text-body-sm color-neutral-100">60s</span>
    </div>
  );
}

export { Progressbar };
