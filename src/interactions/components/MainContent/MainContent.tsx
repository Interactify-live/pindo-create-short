import React, { memo } from "react";
import { VideoPlayer } from "../VideoPlayer";
import CoverSelector from "../CoverSelector";
import { Media } from "../../types.d/types";

interface MainContentProps {
  medias: Media[];
  setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
  activeMedia: number;
  activeInteraction: number;
  setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
  coverIndex: number;
  setCoverIndex: (index: number) => void;
}

const MainContent: React.FC<MainContentProps> = memo(
  ({
    medias,
    setMedias,
    activeMedia,
    activeInteraction,
    setActiveInteraction,
    coverIndex,
    setCoverIndex,
  }) => {
    return (
      <div
        style={{ position: "relative", height: "100%", borderRadius: "8px" }}
      >
        <VideoPlayer
          medias={medias}
          setMedias={setMedias}
          activeMedia={activeMedia}
          activeInteraction={activeInteraction}
          setActiveInteraction={setActiveInteraction}
          media={medias[activeMedia]}
        />
        <CoverSelector
          coverIndex={coverIndex}
          activeMedia={activeMedia}
          setCoverIndex={setCoverIndex}
          medias={medias}
        />
      </div>
    );
  }
);

MainContent.displayName = "MainContent";

export default MainContent;
