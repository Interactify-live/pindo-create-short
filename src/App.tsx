import React, { useEffect, useState } from "react";
import Videos from "./createLive/Videos";
import ShortCreateInteractionsStep from "./interactions";
import { RelativeGeometric } from "./interactions/draggable";
import { Interaction } from "./interactions/interactions";
import { InteractionItem, Video } from "./interactions/types.d/types";
import "./shared/generated-styles.scss";
import { getMediaDuration } from "./shared/utils";

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeInteraction, setActiveInteraction] = useState<number>(-1);
  const [interactions, setInteractions] = useState<InteractionItem[]>([]);
  const [isInteractionStep, setIsInteractionStep] = useState(false);
  useEffect(() => {
    console.log(videos);
  }, [videos]);

  return (
    <div>
      {!isInteractionStep ? (
        <Videos
          onSelect={async (f) => {
            const duration = await getMediaDuration(f);

            setVideos([
              {
                file: f,
                duration: duration,
                originDuration: duration,
                trim: { start: 0, end: duration },
                src: URL.createObjectURL(f),
              },
            ]);
          }}
          onSubmit={() => {
            setIsInteractionStep(true);
          }}
        />
      ) : (
        <ShortCreateInteractionsStep
          activeInteraction={activeInteraction}
          setActiveInteraction={setActiveInteraction}
          interactions={interactions}
          setInteractions={setInteractions}
          videos={videos}
          cover={
            "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg"
          }
        />
      )}
    </div>
  );
}

export default App;
