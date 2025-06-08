import React from "react";
import { INTERACTIONS_CONTAINER_BASE_WIDTH } from "../../../shared/constants";
import { Geometric } from "../types/geometric";
import { RelativeGeometric } from "../types/relative-geometric";

const CONTAINER_HEIGHT = (INTERACTIONS_CONTAINER_BASE_WIDTH * 16) / 9;

function makeGeometricRelative(geometric: Geometric): RelativeGeometric {
  const relativeX = geometric.x / INTERACTIONS_CONTAINER_BASE_WIDTH;
  const relativeY = geometric.y / CONTAINER_HEIGHT;

  return {
    ...geometric,
    relativeX: `${relativeX * 100}%`,
    relativeY: `${relativeY * 100}%`,
  } as const;
}

export { makeGeometricRelative };
