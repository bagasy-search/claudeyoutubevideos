import type React from "react";
import type { Key } from "./mundo";

export type Parte = {
  a: number; b: number; keys: Key[]; pal: [number, string, number?][];
  fondo?: (t: number) => React.ReactNode; mundo?: (t: number) => React.ReactNode; frente?: (t: number) => React.ReactNode; hud?: (t: number) => React.ReactNode;
  lejos?: (t: number) => React.ReactNode; sinBarco?: (t: number) => boolean;
};
