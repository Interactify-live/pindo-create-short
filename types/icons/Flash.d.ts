/// <reference types="react" />
interface FlashProps {
    isFlashOn?: boolean;
    width?: string;
    height?: string;
    fill?: string;
}
export default function Flash({ isFlashOn, width, height, fill }: FlashProps): JSX.Element;
export {};
