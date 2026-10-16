// Video completo hecho a mano: minuto 1 (Main) + capítulos coreografiados. Tiempo real de la voz v5.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Main } from "../Main";
import tmIntro from "../v5/tm_intro.json";
import { Ch2 } from "./Ch2";
import { Ch3 } from "./Ch3";
import { Ch4 } from "./Ch4";
import { Ch5 } from "./Ch5";
import { Ch6 } from "./Ch6";
import { Ch7 } from "./Ch7";
import { Ch8 } from "./Ch8";
import { Ch9 } from "./Ch9";
import { Ch10, CH10_END } from "./Ch10";

export const FPS = 30;
export const INTRO_END = 49.86;
// [inicio, fin, componente] — cada capítulo usa el tiempo absoluto del video
const CH: [number, number, React.FC][] = [
  [INTRO_END, 122.1, Ch2],
  [122.1, 222.4, Ch3],
  [222.4, 335.4, Ch4],
  [335.4, 480.5, Ch5],
  [480.5, 637.0, Ch6],
  [637.0, 799.3, Ch7],
  [799.3, 966.9, Ch8],
  [966.9, 1063.9, Ch9],
  [1063.9, CH10_END, Ch10],
];
export const HAND_END = CH[CH.length - 1][1];
export const Hand: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: "#2f6fb8" }}>
      {t < INTRO_END + 0.1 && <Sequence durationInFrames={Math.round((INTRO_END + 0.3) * FPS)}><Main tm={tmIntro as number[][]} intro /></Sequence>}
      {CH.map(([a, b, C], i) => (t >= a && t < b ? <C key={i} /> : null))}
    </AbsoluteFill>
  );
};
