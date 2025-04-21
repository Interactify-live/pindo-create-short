import styles from "./styles.module.scss";
import { Payload } from "../../options";
import classnames from "classnames";
import { CSSProperties } from "react";

interface Props {
  product: Payload["products"][number];
  type?: Payload["style"] | "simple-group";
  className?: string;
  style?: CSSProperties;
  isUserView?: boolean;
}

function ProductCard({
  className,
  product,
  type = "simple-group",
  style,
  isUserView,
}: Props) {
  return (
    <a
      href={isUserView ? product.url : undefined}
      target="_blank"
      style={style}
      className={classnames(styles.container, className, {
        [styles.simple]: ["simple", "simple-group"].includes(type),
        [styles.simpleGroup]: type === "simple-group",
      })}
    >
      <img
        className={styles.image}
        draggable={false}
        src={product.image}
        alt={product.title}
      />
      <div className={styles.content}>
        <p className={styles.title}>{product.title}</p>
        <span className={styles.price}>{product.price}</span>
      </div>
    </a>
  );
}

export { ProductCard };
