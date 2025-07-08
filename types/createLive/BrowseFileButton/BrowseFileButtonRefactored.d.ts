/// <reference types="react" />
import { Media } from '../../interactions/types.d/types';
interface Props {
    onSelect(files: File[]): void;
    disabled: boolean;
    showToast: (message: string) => void;
    medias: Media[];
}
declare function BrowseFileButtonRefactored({ onSelect, disabled, showToast, medias }: Props): JSX.Element;
export default BrowseFileButtonRefactored;
