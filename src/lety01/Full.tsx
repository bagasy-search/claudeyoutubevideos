// lety01 · el video entero: minuto 1 aprobado + tramos m2…m9 (cada uno con su mundo/cámara/piezas). Audio fuera de Remotion.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Min1, MIN1_END } from "./Min1";
import { M2, M2_END } from "./m2";
import { M3, M3_END } from "./m3";
import { M4, M4_END } from "./m4";
import { M5, M5_END } from "./m5";
import { M6, M6_END } from "./m6";
import { M7, M7_END } from "./m7";
import { M8, M8_END } from "./m8";
import { M9, M9_END } from "./m9";
import { s } from "./lib";

export const FULL_END = 810.04;
export const FULL_FRAMES = s(FULL_END);
const TRAMOS: [number, React.FC<{ t: number }>][] = [[M2_END, M2], [M3_END, M3], [M4_END, M4], [M5_END, M5], [M6_END, M6], [M7_END, M7], [M8_END, M8], [M9_END, M9]];

export const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < MIN1_END) return <Min1 />;
  const T = TRAMOS.find(([end]) => t < end);
  if (!T) return <AbsoluteFill style={{ background: "#000" }} />;
  const C = T[1];
  return <C t={t} />;
};
