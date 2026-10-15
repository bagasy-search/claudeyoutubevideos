// SplitVs.tsx — LO QUE ESPERABAN / LO QUE PASÓ: dos fotos reales lado a lado. La izquierda entra con
// la promesa (cálida), la derecha cae con el desastre (sello rojo). Es el corazón del canal en 1 plano.
//
// ⛔ Dos FOTOS reales (o fotos IA sin marcas), nunca íconos. Textos cortos: 2-7 palabras por lado.
// ⛔ Beats en palabras: `leftAt` (cuando dice lo que esperaban) · `rightAt` (cuando dice lo que pasó).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, F_TYPE, F_BODY, useAbs, prog, Bed, Grade, Stamp, Credit, rgba, useOut } from "./Stage";

const Side: React.FC<{ img?: string; head: string; text: string; a: number; x: number; tone: string; z: number; tilt: number }> = ({ img, head, text, a, x, tone, z, tilt }) => (
  <div style={{ position: "absolute", left: x, top: 205, width: 860, opacity: a, transform: `translateY(${((1 - a) * 50).toFixed(1)}px) rotate(${tilt}deg)` }}>
    <div style={{ background: W.paper, padding: 16, paddingBottom: 22, boxShadow: "0 24px 60px rgba(0,0,0,.7)" }}>
      <div style={{ width: 828, height: 500, overflow: "hidden", background: W.ink1 }}>
        {img ? <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})` }} /> : null}
      </div>
      <div style={{ fontFamily: F_TYPE, fontSize: 30, letterSpacing: 3, color: tone, marginTop: 16 }}>{head}</div>
      <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 44, lineHeight: 1.12, color: W.ink0, marginTop: 6 }}>{text}</div>
    </div>
  </div>
);

export const SplitVs: React.FC<{
  leftImg?: string;
  rightImg?: string;
  leftHead?: string;
  rightHead?: string;
  leftText: string;
  rightText: string;
  stamp?: string;            // "BACKFIRED" · "" lo apaga
  kicker?: string;           // línea de arriba · "" la apaga
  leftAt?: number;
  rightAt?: number;
  credit?: string;
  bed?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ leftImg, rightImg, leftHead = "WHAT THEY EXPECTED", rightHead = "WHAT HAPPENED", leftText, rightText, stamp = "BACKFIRED", kicker = "THE PLAN · THE RESULT", leftAt, rightAt, credit, bed, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  const la = prog(now, Math.min(leftAt ?? start, start + 0.1), 0.6);   // ⛔ entra YA: nada de cama vacía al arranque
  const ra = prog(now, rightAt ?? start + 2.2, 0.6);
  const sa = prog(now, (rightAt ?? start + 2.2) + 0.9, 0.35);
  const drift = 1 + 0.004 * Math.max(0, now - start);
  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0 }}>
      <Bed src={bed} dim={0.66} />
      <AbsoluteFill style={{ transform: `scale(${drift.toFixed(4)})`, opacity: out }}>
        <Side img={leftImg} head={leftHead} text={leftText} a={la} x={80} tone={W.manilaDark} z={Math.min(1.14, 1.02 + 0.012 * Math.max(0, now - start))} tilt={-1.6} />
        <Side img={rightImg} head={rightHead} text={rightText} a={ra} x={980} tone={W.red} z={Math.min(1.14, 1.02 + 0.014 * Math.max(0, now - (rightAt ?? start + 2.2)))} tilt={1.4} />
        {stamp ? <Stamp text={stamp} p={sa} x={73} y={44} size={86} rot={-9} /> : null}
      </AbsoluteFill>
      <Grade vignette={0.5} />
      {kicker ? <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: F_TYPE, fontSize: 30, letterSpacing: 6, color: rgba(W.white, 0.75), opacity: la * out }}>{kicker}</div> : null}
      <Credit text={credit} a={la} />
    </AbsoluteFill>
  );
};
