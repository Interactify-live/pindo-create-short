import React from "react";
import { hexToRGB } from "./utils";

const COLORS = {
  black: {
    "": "#000000",
    "40p": "rgba(0,0,0,0.4)",
  },
  white: "#ffffff",
  transparent: "rgba(0,0,0,0)",
  neutral: {
    0: "#F8F8F8",
    10: "#EAEAEA",
    20: "#D6D6D6",
    30: "#C1C1C1",
    40: "#989898",
    50: "#838383",
    60: "#6D6D6D",
    70: "#575757",
    80: "#424242",
    90: "#2C2C2C",
    100: "#000000",
  },
  primary: {
    0: "#EADAFB",
    10: "#D6B5F8",
    20: "#C28FF5",
    30: "#AE6AF1",
    40: "#9A45ED",
    50: "#8820EB",
    60: "#7213CB",
    70: "#5B0FA2",
    80: "#450B7A",
    90: "#2E0851",
    100: "#180429",
  },
  secondary: {
    0: "#E0FFFA",
    10: "#B1EBE3",
    20: "#88D7CD",
    30: "#63C3B8",
    40: "#43AFA4",
    50: "#299B91",
    60: "#09867E",
    70: "#00726C",
    80: "#005E5B",
    90: "#004A49",
    100: "#003636",
  },
  green: {
    0: "#DEF5ED",
    50: "#3AC592",
    70: "#278361",
  },
  orange: {
    0: "#FFEED5",
    50: "#FF9900",
    70: "#AA6600",
  },
  red: {
    0: "#FFDFD8",
    50: "#FF4016",
    70: "#B92100",
  },
} as const;

function generateColors() {
  let styles = "";
  let cssVariables = "";

  for (let key in COLORS) {
    // @ts-ignore
    let values = COLORS[key];
    key = key.replace(/-+$/, "");

    if (typeof values === "string") {
      values = hexToRGB(values).css;

      cssVariables += `
        --color-${key}: ${values};
      `;
      styles += `
      .color-${key}{
        color: ${values};
      }
      .border-${key}{
        border-color: ${values};
      }
      .bg-${key}{
        background: ${values};
      }
      `;
      continue;
    }

    for (const variation in values) {
      const color = hexToRGB(values[variation]).css;

      const composedKey = `${key}-${variation}`.replace(/-*$/, "");

      cssVariables += `
        --color-${composedKey}: ${color};
      `;
      styles += `
      .color-${composedKey}{
        color: ${color};
      }
      .border-${composedKey}{
        border-color: ${color};
      }
      .bg-${composedKey}{
        background: ${color};
      }
      `;
    }
  }

  return `
    :root{${cssVariables}}
    ${styles}
  `;
}

export { COLORS, generateColors };
