// chencho01 · el video ENTERO (0 → 12:36): el minuto 1 y el resto son la misma toma; el resto toma la posta 0,2 s antes del fin
// del minuto 1 (con la cámara en la misma posición) para que el barrido al avatar sea uno solo.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Min1, MIN1_END } from "./Min1";
import { Rest, FULL_END } from "./Rest";
import { s } from "./lib";
export const FULL_FRAMES = s(FULL_END);
export const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#0b0907" }}><Rest />{t < MIN1_END - 0.2 && <AbsoluteFill><Min1 /></AbsoluteFill>}</AbsoluteFill>;
};
