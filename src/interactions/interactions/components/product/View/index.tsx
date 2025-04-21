// @ts-nocheck
import { ProductCard } from "./ProductCard";
import classnames from "classnames";
import styles from "./styles.module.scss";
import { InteractionView } from "../../../types/interactionView";

interface Payload {
  style: "simple" | "detailed";
  products: { price?: string; title: string; image: string; url: string }[];
}

function View({
  payload,
  className,
  onClick,
  isUserView,
}: InteractionView<Payload>) {
  const isGroup = payload.products.length > 1;
  const type =
    payload.style === "simple" && isGroup ? "simple-group" : payload.style;

  return (
    <div
      onClick={onClick?.bind(null, payload)}
      className={classnames(className, styles.container, {
        [styles["container--user-view"]]: isUserView,
      })}
    >
      {payload.products.map((product, index) => {
        let marginRight = payload.style === "detailed" ? 12 : 8;
        if (index === payload.products.length - 1) {
          marginRight = 0;
        }

        return (
          <ProductCard
            key={index}
            isUserView={isUserView}
            style={{ marginRight }}
            type={type}
            product={product}
          />
        );
      })}
    </div>
  );
}
export { View };
