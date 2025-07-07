import React from "react";
import { INTERACTIONS, Interaction } from "../../Interactions";

interface Props {
  onClickInteraction: (interaction: Interaction) => void;
  className?: string;
}

function InteractionsList({ onClickInteraction, className }: Props) {
  return (
    <div
    // className={classnames("d-flex flex-wrap-wrap w-full", className, {
    //   "bg-neutral-90": true,
    //   [styles["container--mobile"]]: true,
    // })}
    >
      {Object.values(INTERACTIONS).map((interaction) => {
        const { type, name, icon: Icon } = interaction;
        return (
          <div
            onClick={() => onClickInteraction(interaction)}
            key={type}
            // className={classnames(
            //   "d-flex flex-col ai-center jc-center cursor-pointer",
            //   {
            //     [styles.interactionItem]: false,
            //     "flex-1 pt-2 pb-3": true,
            //     "ratio-square": false,
            //   },
            // )}
            style={{
              fontSize: "24px",
              width: "40px",
              height: "40px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              background: "transparent",
              borderRadius: "50%",
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}

export { InteractionsList };
