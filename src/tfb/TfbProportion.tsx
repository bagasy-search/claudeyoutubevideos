// TfbProportion — proporción por volumen "con el mismo balde": una columna por ingrediente, que se llena balde a balde
// (cada balde cae con rebote) y cuenta. items = [{n, label, color}] (ej. 1 cemento · 2 arena · 3 piedra).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, easeIn, pop, textShadow } from "./theme";

export type TfbProportionProps = { dur: number; items: { n: number; label: string; color: string }[]; title?: string; every?: number; x?: number; y?: number; note?: string };
const Bucket: React.FC<{ fill: string; s: number }> = ({ fill, s }) => (
  <svg width={120} height={96} viewBox="0 0 120 96" style={{ transform: `translateY(${(1 - s) * -70}px) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.6), filter: "drop-shadow(0 5px 8px rgba(0,0,0,0.5))" }}>
    <path d="M16 18 L104 18 L94 90 L26 90 Z" fill="#f2f2ef" stroke="#1b1b1b" strokeWidth={4} />
    <path d="M22 30 L98 30 L94 60 L26 60 Z" fill={fill} opacity={0.95} />
    <path d="M14 18 Q60 -10 106 18" fill="none" stroke="#1b1b1b" strokeWidth={4} />
    <rect x={10} y={12} width={100} height={10} rx={4} fill="#dcdcd6" stroke="#1b1b1b" strokeWidth={3} />
  </svg>
);
export const TfbProportion: React.FC<TfbProportionProps> = ({ dur, items, title, every = 9, x = 960, y = 560, note }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const inP = pop(f, fps, 0, 15), out = interpolate(f, [dur - 8, dur], [1, 0], { ...clamp, easing: easeIn });
  let k = 0;
  const cols = items.map(it => { const start = 10 + k * every; k += it.n; return { ...it, start }; });
  const total = items.reduce((a, b) => a + b.n, 0);
  const noteP = pop(f, fps, 12 + total * every, 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - inP) * 40}px)`, opacity: out * Math.min(1, inP * 1.5), padding: "34px 54px 40px", borderRadius: 28, background: "rgba(12,12,12,0.8)", boxShadow: "0 20px 60px rgba(0,0,0,0.55)", border: "2px solid rgba(255,255,255,0.12)" }}>
      {title ? <div style={{ fontFamily: F.ui, fontWeight: 900, fontSize: 30, letterSpacing: 5, color: C.yellow, textAlign: "center", marginBottom: 18 }}>{title}</div> : null}
      <div style={{ display: "flex", gap: 70, alignItems: "flex-end" }}>
        {cols.map((c, i) => {
          const shown = Math.max(0, Math.min(c.n, Math.floor((f - c.start) / every) + 1));
          const num = pop(f, fps, c.start, 9);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", height: 3 * 88, justifyContent: "flex-start" }}>
                {Array.from({ length: c.n }, (_, j) => <div key={j} style={{ marginTop: -8 }}><Bucket fill={c.color} s={j < shown ? pop(f, fps, c.start + j * every, 10) : 0} /></div>)}
              </div>
              <div style={{ fontFamily: F.impact, fontSize: 110, lineHeight: 1, color: C.yellow, textShadow, transform: `scale(${num})` }}>{c.n}</div>
              <div style={{ fontFamily: F.impact, fontSize: 44, color: C.white, textTransform: "uppercase", textShadow, opacity: num }}>{c.label}</div>
            </div>
          );
        })}
      </div>
      {note ? <div style={{ marginTop: 18, textAlign: "center", fontFamily: F.hand, fontSize: 40, color: C.white, opacity: noteP, transform: `rotate(-2deg) scale(${0.85 + 0.15 * noteP})` }}>{note}</div> : null}
    </div>
  );
};
