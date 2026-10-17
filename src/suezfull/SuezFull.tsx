// Suez — video entero hecho a mano: intro de 21 s (Suez) + capítulos en tiempo absoluto de la voz.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Suez } from "./Suez";
import { Ch1, CH1 } from "./Ch1";
import { Ch2, CH2 } from "./Ch2";
import { Ch3, CH3 } from "./Ch3";
import { Ch4, CH4 } from "./Ch4";
import { Ch5, CH5 } from "./Ch5";
import { Ch6, CH6 } from "./Ch6";
import { Ch7, CH7 } from "./Ch7";
import { Ch8, CH8 } from "./Ch8";
import { Ch9, CH9 } from "./Ch9";
import { Ch10, CH10 } from "./Ch10";
import { Ch11, CH11 } from "./Ch11";

export const FPS = 30;
export const FULL_END = 788.0;
const CH: [[number, number], React.FC][] = [
  [CH1, Ch1],
  [CH2, Ch2],
  [CH3, Ch3],
  [CH4, Ch4],
  [CH5, Ch5],
  [CH6, Ch6],
  [CH7, Ch7],
  [CH8, Ch8],
  [CH9, Ch9],
  [CH10, Ch10],
  [CH11, Ch11],
];
export const SuezFull: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: "#e6d8b6" }}>
      {t < 21.0 && <Sequence durationInFrames={630}><Suez /></Sequence>}
      {CH.map(([[a, b], C], i) => (t >= a && t < b ? <C key={i} /> : null))}
    </AbsoluteFill>
  );
};
