import React, { ComponentProps } from "react";
import { VIDEO_MAX_DURATION } from "../../shared/constants";
import { Progressbar as ProgressbarComponent } from "./BaseProgressbar";

interface Props
  extends Pick<ComponentProps<typeof ProgressbarComponent>, "onDelete"> {
  className?: string;
  videos: {
    file: File;
    duration: number;
    originDuration: number;
    trim: { start: number; end: number };
    src: string;
  }[];
}

function Progressbar({ className, onDelete, videos }: Props) {
  return (
    <ProgressbarComponent
      onDelete={onDelete}
      className={className}
      width={"100%"}
      percents={videos.map(
        (video) => (video.duration / VIDEO_MAX_DURATION) * 100,
      )}
    />
  );
}

export default Progressbar;
