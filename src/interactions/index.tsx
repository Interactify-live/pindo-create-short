import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import classnames from "classnames";
import { makeGeometricRelative, RelativeGeometric } from "./draggable";
import { INTERACTIONS_CONTAINER_BASE_WIDTH } from "../shared/constants";
import { Button } from "../components/Button";
import { Interaction } from "./components/Interactions";
import { InteractionsContainer } from "./components/InteractionsContainer";
import { VideoPlayer } from "./components/VideoPlayer";
import { InteractionItem, Video } from "./types.d/types";

interface Props {
  interactions: InteractionItem[];
  setInteractions: React.Dispatch<React.SetStateAction<InteractionItem[]>>;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  videos: Video[];
  cover: string;
}

function ShortCreateInteractionsStep({
  interactions,
  setInteractions,
  activeInteraction,
  setActiveInteraction,
  videos,
  cover,
}: Props) {
  const hasAnyActiveInteraction = activeInteraction !== -1;

  const onAddInteraction = (interaction: Interaction) => {
    setInteractions((prevInteractions) => [
      ...prevInteractions,
      {
        interaction,
        payload: JSON.parse(JSON.stringify(interaction.defaultPayload)),
        geometric: makeGeometricRelative({
          x: 50,
          y: 50,
          width: 100,
          height: 100,
        }),
      },
    ]);
    setActiveInteraction(interactions.length);
  };
  const onDeleteActiveInteraction = () => {
    setInteractions((prevInteractions) => {
      // Create a new array without the active interaction
      const updatedInteractions = prevInteractions.filter(
        (_, index) => index !== activeInteraction,
      );

      // Reset active interaction after deletion
      setActiveInteraction(-1);

      return updatedInteractions;
    });
  };
  const onSaveActiveInteraction = () => {
    const { interaction, payload } = interactions[activeInteraction];
    const errorMessages = (interaction as any).validate({ payload });

    for (const errors of Object.values(errorMessages) as string[][]) {
      for (const error of errors) {
        if (typeof error !== "string" || error.length <= 0) continue;
        console.log("ERROR", error);
        return;
      }
    }

    setActiveInteraction(-1);
  };

  return (
    <div className="d-flex flex-col-rev ai-center lg:ai-start lg:flex-row jc-center lg:pt-10 lg:h-auto">
      <div className="pos-absolute top-0 left-0 right-0 w-full px-3 pt-3 d-flex jc-between z-3">
        {hasAnyActiveInteraction ? (
          <>
            <Button
              bgColor="neutral-90"
              color="white"
              className="opacity-50"
              onClick={onDeleteActiveInteraction}
            >
              <DeleteOutlined />
            </Button>
            <Button
              color="white"
              bgColor="primary-50"
              onClick={onSaveActiveInteraction}
            >
              Done
              <CheckOutlined />
            </Button>
          </>
        ) : (
          <>
            <Button shape="outline" onClick={() => {}}>
              <ArrowLeftOutlined />
            </Button>
            <Button
              shape="fill"
              color="white"
              bgColor="primary-50"
              onClick={() => {}}
            >
              Next
              <ArrowRightOutlined />
            </Button>
          </>
        )}
      </div>
      <InteractionsContainer
        activeInteraction={activeInteraction}
        setActiveInteraction={setActiveInteraction}
        interactions={interactions}
        setInteractions={setInteractions}
        style={{
          width: INTERACTIONS_CONTAINER_BASE_WIDTH,
        }}
        onAddInteraction={onAddInteraction}
        className={classnames("z-10", {
          "pos-absolute bottom-0": true,
        })}
        onDelete={onDeleteActiveInteraction}
      />
      <VideoPlayer
        wrapperClassName={classnames({
          "flex-1 w-full h-inner-height": true,
        })}
        className={classnames({
          "h-inner-height": true,
        })}
        interactions={interactions}
        setInteractions={setInteractions}
        activeInteraction={activeInteraction}
        setActiveInteraction={setActiveInteraction}
        videos={videos}
        cover={cover}
      />
    </div>
  );
}

export { ShortCreateInteractionsStep };
export default ShortCreateInteractionsStep;
