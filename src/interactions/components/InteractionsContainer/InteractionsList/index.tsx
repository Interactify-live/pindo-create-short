import classnames from "classnames";
import { INTERACTIONS, Interaction } from "../../Interactions";
import styles from "./styles.module.scss";

interface Props {
  onClickInteraction: (interaction: Interaction) => void;
  className?: string;
}

function InteractionsList({ onClickInteraction, className }: Props) {
  return (
    <div
      className={classnames("d-flex flex-wrap-wrap w-full", className, {
        "bg-neutral-90": true,
        [styles["container--mobile"]]: true,
      })}
    >
      {Object.values(INTERACTIONS).map((interaction) => {
        const { type, name, icon: Icon } = interaction;
        return (
          <div
            onClick={() => onClickInteraction(interaction)}
            key={type}
            className={classnames(
              "d-flex flex-col ai-center jc-center cursor-pointer",
              {
                [styles.interactionItem]: false,
                "flex-1 pt-2 pb-3": true,
                "ratio-square": false,
              },
            )}
          >
            <Icon className="color-primary-60 m-2" style={{ fontSize: 20 }} />
            <span
              className={classnames("tg-body-sm", {
                "color-neutral-90": false,
                "color-neutral-0": true,
              })}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { InteractionsList };
