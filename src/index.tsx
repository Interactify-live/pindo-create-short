import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "./reset.scss";

const container = document.getElementById("root");
const root = createRoot(container!);
// function setCSSVars() {
//   document.documentElement.style.setProperty(
//     "--window-inner-height",
//     `${window.innerHeight}px`,
//   );
// }
// window.onresize = setCSSVars;
// setCSSVars();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
