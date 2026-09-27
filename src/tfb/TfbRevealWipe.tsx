// TfbRevealWipe — antes/después del MISMO encuadre con una cortina que es un chorro de agua: el borde es ondulado y
// vivo, lleva salpicaduras, y lo que queda atrás es el "después". before/after = nodos a pantalla completa (Img o video).
// Etiquetas ANTES/DESPUÉS (props) que se encienden según el lado. Sirve para cualquier limpieza/pintura/reparación.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, noise, pop, smooth, textShadow } from "./theme";

export type TfbRevealWipeProps = { dur: number; before: React.ReactNode; after: React.ReactNode; from?: number; to?: number; beforeLabel?: string; afterLabel?: string; hold?: number };
export const TfbRevealWipe: React.FC<TfbRevealWipeProps> = ({ dur, before, after, from = 6, to = 44, beforeLabel, afterLabel }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const p = interpolate(f, [from, to], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [dur - 6, dur], [1, 0], { ...clamp, easing: easeIn });
  const X = -120 + p * 2160;
  const N = 36, pts: string[] = [];
  for (let i = 0; i <= N; i++) { const y = (i / N) * 1080; const x = X + smooth(2, i * 0.7 + f * 0.35) * 46 + Math.sin(i * 0.9 + f * 0.5) * 14; pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`); }
  const poly = `polygon(0px 0px, ${pts.join(", ")}, 0px 1080px)`;
  const lb = pop(f, fps, 2, 13), la = pop(f, fps, to - 6, 11);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", inset: 0 }}>{before}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: poly }}>{after}</div>
      {p > 0 && p < 1 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><linearGradient id="trw_g" x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0" /><stop offset="0.7" stopColor="#e8f6ff" stopOpacity="0.55" /><stop offset="1" stopColor="#ffffff" stopOpacity="0.9" /></linearGradient></defs>
          <polyline points={pts.map(s => s.replace(/px/g, "")).join(" ")} fill="none" stroke="url(#trw_g)" strokeWidth={34} opacity={0.75} />
          {Array.from({ length: 70 }, (_, i) => { const y = ((i * 131) % 1080) + noise(i, f) * 8; const life = ((f * 3 + i * 17) % 40) / 40; const x = X + 10 + life * (60 + (i % 7) * 22); return <circle key={i} cx={x} cy={y - life * 30} r={2 + (i % 4)} fill="#ffffff" opacity={(1 - life) * 0.85} />; })}
        </svg>
      ) : null}
      {beforeLabel ? <div style={{ position: "absolute", right: 70, top: 60, fontFamily: F.impact, fontSize: 64, color: C.white, background: "rgba(12,12,12,0.7)", padding: "6px 22px", transform: `scale(${lb})`, opacity: 1 - la, textShadow }}>{beforeLabel}</div> : null}
      {afterLabel ? <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.impact, fontSize: 64, color: C.ink, background: C.yellow, padding: "6px 22px", transform: `scale(${la}) rotate(-2deg)`, boxShadow: C.shadow }}>{afterLabel}</div> : null}
    </div>
  );
};
