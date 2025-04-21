import { useCallback, useState } from "react";
import { Form } from "antd";
import debounce from "lodash/debounce";
import {
  Draggable,
  Geometric,
  makeGeometricRelative,
  RelativeGeometric,
} from "../../draggable";
import { Interaction } from "../Interactions";
import { InteractionItem } from "../../types.d/types";

/**
 * This component wraps Interaction.View component into DraggableItem.
 * Also there is a state called geometric which holds temporary geometric of interaction.
 * and dispatch the geometric to the form using debounce 1s.
 * I've done this to have a better performance.
 */

function InteractionView({
  interaction,
  interactions,
  setInteractions,
  index,
}: {
  interaction: InteractionItem;
  interactions: InteractionItem[];
  setInteractions: React.Dispatch<React.SetStateAction<InteractionItem[]>>;
  index: number;
}) {
  const [tmpGeometric, setTmpGeometric] = useState<Geometric>(
    interaction.geometric,
  );
  const { View, draggableOptions }: any = interaction.interaction;
  const [activeInteraction, setActiveInteraction] = useState<number>(0);

  const onClick = useCallback(() => {
    if (activeInteraction !== -1 && activeInteraction !== index) {
      const { interaction, payload } = interactions[activeInteraction];
      const errors = (interaction as any).validate({ payload });
      const isActiveInteractionValid = Object.values(errors)
        .flat()
        .every((item) => item === undefined);

      if (!isActiveInteractionValid) {
        console.log("HANDLE ERROR");
      }
    }

    setActiveInteraction(index);
  }, [activeInteraction]);

  const updateForm = useCallback(
    debounce((newGeometric: Geometric) => {
      interactions[index] = {
        ...interactions[index],
        geometric: makeGeometricRelative(newGeometric),
      };
      setInteractions(interactions.slice());
    }, 1000),
    [interaction, index],
  );
  const setPayload = (key: any, value: any) => {
    /**
     * Why try catch?
     * Button and Text interaction in their View component, call this function when they get unmounted.
     * So, If you remove these interactions, they will get unmounted and also call this function.
     * And this causes error.
     */
    try {
      interactions[activeInteraction].payload[key] = value;
      setInteractions(interactions.slice());
    } catch (e) {}
  };

  return (
    <Draggable.Item
      geometric={tmpGeometric}
      onChange={(newGeometric) => {
        const canOnlyMoveVertically =
          interaction.interaction.type === "product" &&
          interaction.payload.products.length >
            (interaction.payload.style === "simple" ? 2 : 3);

        setTmpGeometric((geometric) => ({
          ...geometric,
          ...newGeometric,
          ...(canOnlyMoveVertically ? { x: 0 } : {}),
        }));
        updateForm(tmpGeometric);
      }}
      {...draggableOptions}
    >
      <View
        isActive={index === activeInteraction}
        onClick={onClick}
        isDesktop={false}
        setPayload={setPayload}
        payload={interaction.payload}
      />
    </Draggable.Item>
  );
}

export { InteractionView };
