import React, { useState } from "react";
import ShortCreateInteractionsStep from "./interactions";
import { FileType, Media, VideoType } from "./interactions/types.d/types";
import "./App.css";
import { getMediaDuration } from "./shared/utils";
import Capture from "./createLive/Videos";
import { generateThumbnailFromFile } from "./utils/thumbnail";

function App() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isInteractionStep, setIsInteractionStep] = useState(false);

  return (
    <div style={{ height: "100%" }}>
      {!isInteractionStep ? (
        <Capture
          onSelect={async (f: File, mediaType: FileType) => {
            if (mediaType === VideoType) {
              const duration = await getMediaDuration(f);
              const thumb = await generateThumbnailFromFile(f);

              setMedias((prevMedias) => {
                return [
                  ...prevMedias,
                  {
                    data: {
                      file: f,
                      duration: duration,
                      originDuration: duration,
                      trim: { start: 0, end: duration },
                      src: URL.createObjectURL(f),
                      thumbnail: thumb,
                    },
                    fileType: mediaType,
                    interactions: [],
                  },
                ];
              });
            } else {
              setMedias((prevMedias) => {
                return [
                  ...prevMedias,
                  {
                    data: {
                      file: f,
                      src: URL.createObjectURL(f),
                    },
                    fileType: mediaType,
                    interactions: [],
                  },
                ];
              });
            }

            setIsInteractionStep(true);
          }}
        />
      ) : (
        <ShortCreateInteractionsStep
          setInteractionStep={setIsInteractionStep}
          medias={medias}
          setMedias={setMedias}
          coverIndex={coverIndex}
          setCoverIndex={setCoverIndex}
        />
      )}
    </div>
  );
}

export default App;
