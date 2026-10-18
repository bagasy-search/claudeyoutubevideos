// oldtech01v2 · VERSIÓN EN ESPAÑOL (voz Fish doc_es_narr): el mismo video de 20 min, con los textos traducidos y el tiempo
// remapeado frase por frase a la voz en español (cada plano conserva su lugar dentro de su frase; ningún clip se regenera).
import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { Full } from "./Full";
import { W_ES, W_EN, ES_END } from "./warp";

export const ES_FRAMES = Math.round((ES_END + 1) * FPS);
export const enDe = (tEs: number) => interpolate(tEs, W_ES, W_EN, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const FullES: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Freeze frame={enDe(f / FPS) * FPS}><Full farm /></Freeze>
    </AbsoluteFill>
  );
};
