import { Timestamp } from "firebase/firestore";

export type Color = {
  hex: string;
  isLocked: boolean;
};

export interface PaletteData {
    userId: string;
    name: string;
    description: string;
    colors: Color[];
    tags: string[];
}


export interface Palette extends PaletteData {
  id: string;
  createdAt: string;
  updatedAt: string;
}
