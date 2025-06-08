import React from "react";
interface GColorRGB {
  r: number;
  g: number;
  b: number;
}

interface GColorRGBA extends GColorRGB {
  a: number;
}

export type { GColorRGBA, GColorRGB };
