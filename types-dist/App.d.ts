/// <reference types="react" />
import { MediaResult } from "./interactions/types.d/types";
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}
declare function App(props: {
    onFinish: (medias: MediaResult[]) => void;
    uploadFile?: (file: File, onProgress: (progress: number) => void) => Promise<string>;
}): JSX.Element;
export default App;
