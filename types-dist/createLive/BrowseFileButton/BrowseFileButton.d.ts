/// <reference types="react" />
import { Media } from "../../interactions/types.d/types";
interface Props {
    onSelect(files: File[]): void;
    disabled: boolean;
    showToast: any;
    medias: Media[];
}
declare function BrowseFileButton({ onSelect, disabled, showToast, medias }: Props): JSX.Element;
export { BrowseFileButton };
