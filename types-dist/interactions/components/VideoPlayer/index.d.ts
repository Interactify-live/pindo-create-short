import { CSSProperties } from "react";
import { Media } from "../../types.d/types";
interface Props {
    className?: string;
    style?: CSSProperties;
    wrapperClassName?: string;
    medias: Media[];
    setMedias: React.Dispatch<React.SetStateAction<Media[]>>;
    activeMedia: number;
    activeInteraction: number;
    setActiveInteraction: React.Dispatch<React.SetStateAction<number>>;
    media: Media;
}
declare function VideoPlayer({ wrapperClassName, className, style, medias, setMedias, activeMedia, activeInteraction, setActiveInteraction, media, }: Props): JSX.Element;
export { VideoPlayer };
