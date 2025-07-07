import { useState } from "react";
import { Flash } from "../../icons";

export default function FlashButton() {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const handleClick = () => {
    console.log("CLICKED");
    setIsFlashOn(!isFlashOn);
    if (window.ReactNativeWebView?.postMessage) {
      console.log("MATCHED");
      window.ReactNativeWebView.postMessage("toggle-flashlight");
    } else {
      console.warn("ReactNativeWebView not available");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "rgba(0, 18, 18, 0.2)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Flash isFlashOn={isFlashOn} />
    </button>
  );
}
