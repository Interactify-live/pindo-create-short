import React from "react";
import { Geometric } from "./geometric";

interface RelativeGeometric extends Geometric {
  relativeX: `${string}%`;
  relativeY: `${string}%`;
}

export type { RelativeGeometric };
