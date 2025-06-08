import React from "react";
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
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 1L1 13M1 1L13 13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
