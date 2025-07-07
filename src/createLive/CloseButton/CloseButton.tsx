import { Close } from "../../icons";

export default function CloseButton() {
  return (
    <button
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
      <Close />
    </button>
  );
}
