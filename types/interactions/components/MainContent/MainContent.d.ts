/// <reference types="react" />
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
declare const MainContent: React.FC<MainContentProps>;
export default MainContent;
