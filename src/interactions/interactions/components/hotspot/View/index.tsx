import { InteractionView } from "../../../types/interactionView";
import classnames from "classnames";
import styles from "./styles.module.scss";

interface Payload {
  url: string;
  color: string;
}

function View({
  payload,
  className,
  onClick,
  isUserView,
}: InteractionView<Payload>) {
  return (
    <a
      href={isUserView ? payload.url : undefined}
      target="_blank"
      onClick={onClick?.bind(null, payload)}
      className={classnames(className, styles.container)}
      style={{ background: payload.color }}
    />
  );
}

export { View };
