import { RelativeGeometric } from "../draggable";
import { Interaction } from "../interactions";

export interface Video {
  file: File;
  duration: number;
  originDuration: number;
  trim: { start: number; end: number };
  src: string;
}
export interface InteractionItem {
  interaction: Interaction;
  payload: any;
  geometric: RelativeGeometric;
}
