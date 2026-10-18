// oldtech01v2 · VERSIÓN EN ESPAÑOL (voz Fish doc_es_narr): el mismo video de 20 min, con los textos traducidos y el tiempo
// remapeado frase por frase a la voz en español (cada plano conserva su lugar dentro de su frase; ningún clip se regenera).
import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { FPS } from "./lib";
import { Full } from "./Full";
import { W_ES, W_EN, ES_END, EN_CUTS } from "./warp";

export const ES_FRAMES = Math.round((ES_END + 1) * FPS);
export const enDe = (tEs: number) => interpolate(tEs, W_ES, W_EN, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// a menos de 2 cuadros de un corte, redondear al cuadro entero (el EN se rindió así y está limpio)
const cerca = (g: number) => { let lo = 0, hi = EN_CUTS.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (EN_CUTS[m] < g) lo = m + 1; else hi = m; } return Math.min(Math.abs(EN_CUTS[lo] - g), lo > 0 ? Math.abs(EN_CUTS[lo - 1] - g) : 1e9) < 2; };
export const enFrame = (f: number) => { const g = enDe(f / FPS) * FPS; return cerca(g) ? Math.round(g) : g; };
export const FullES: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Freeze frame={enFrame(f)}><Full farm /></Freeze>
    </AbsoluteFill>
  );
};
