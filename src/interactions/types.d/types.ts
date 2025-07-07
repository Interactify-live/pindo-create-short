import React from "react";
import { RelativeGeometric } from "../draggable";
import { Interaction } from "../interactions";

export interface Video {
  file: File;
  duration: number;
  originDuration: number;
  trim: { start: number; end: number };
  src: string;
  thumbnail: string;
}

export interface Image {
  file: File;
  src: string;
}

export const VideoType = "video";
export const ImageType = "image";
export type FileType = typeof ImageType | typeof VideoType;

export interface InteractionItem {
  interaction: Interaction;
  payload: any;
  geometric: RelativeGeometric;
}
export interface Media {
  fileType: FileType;
  data: Video | Image;
  interactions: InteractionItem[];
  isUploaded?: boolean;
}

export interface InteractionItemResult {
  interaction: string;
  payload: any;
  geometric: RelativeGeometric;
}

export interface MediaResult {
  fileType: FileType;
  data: Video | Image;
  interactions: InteractionItemResult[];
}
