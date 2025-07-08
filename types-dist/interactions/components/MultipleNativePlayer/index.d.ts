import { ComponentProps } from "react";
import ReactPlayer from "react-player";
interface Source {
    src: string;
    trim?: {
        start: number;
        end: number;
    };
    duration: number;
}
interface Props extends Omit<ComponentProps<typeof ReactPlayer>, "src" | "onEnded"> {
    sources: Source[];
    onClick: (props: {
        toggleMuted: () => void;
    }) => void;
    cover?: string;
    autoPlay?: boolean;
}
interface Ref {
    getDuration: () => number;
    getCurrentTime: () => number;
    setCurrentTime: (currentTime: number) => void;
    onTimeUpdate: (callback: () => void) => void;
    play: VoidFunction;
    pause: VoidFunction;
}
declare const MultipleNativePlayer: import("react").MemoExoticComponent<import("react").ForwardRefExoticComponent<Omit<Props, "ref"> & import("react").RefAttributes<Ref>>>;
export { MultipleNativePlayer };
