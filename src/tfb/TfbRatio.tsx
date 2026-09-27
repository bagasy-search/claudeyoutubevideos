// TfbRatio — PROPORCIÓN con baldes: N baldes de un material contra M del otro, que caen y se LLENAN (el contenido sube
// con ondita) y un gran "1 : 3" que se arma en el medio. Colores y rótulos por props (sirve para cualquier mezcla).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, easeOut, outro, pop, strokeText } from "./theme";

type Side = { n: number; label: string; color: string; speck?: string };
const Bucket: React.FC<{ fill: number; color: string; speck?: string; wave: number; seed: number }> = ({ fill, color, speck, wave, seed }) => {
  const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return v - Math.floor(v); };
  const top = 200 - 160 * fill;
  return (
    <svg width={170} height={220} viewBox="0 0 170 220">
      <defs><clipPath id={`bk${seed}`}><path d="M18,30 L152,30 L136,210 L34,210 Z" /></clipPath></defs>
      <path d="M18,30 L152,30 L136,210 L34,210 Z" fill="rgba(20,20,20,0.85)" />
      <g clipPath={`url(#bk${seed})`}>
        <path d={`M0,${top} Q42,${top - 6 * wave} 85,${top} T170,${top} L170,220 L0,220 Z`} fill={color} />
        {speck && Array.from({ length: 50 }).map((_, k) => { const y = top + 4 + rnd(k) * (210 - top); return y > top ? <circle key={k} cx={20 + rnd(k + 99) * 130} cy={y} r={1.6 + rnd(k + 7) * 1.6} fill={speck} /> : null; })}
      </g>
      <path d="M18,30 L152,30 L136,210 L34,210 Z" fill="none" stroke={TFB.white} strokeWidth={6} strokeLinejoin="round" />
      <path d="M22,30 Q85,-18 148,30" fill="none" stroke={TFB.white} strokeWidth={5} />
    </svg>
  );
};
export const TfbRatio: React.FC<{ dur: number; a: Side; b: Side; title?: string; footer?: string }> = ({ dur, a, b, title, footer }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 8) * interpolate(f, [0, 8], [0, 1], clamp);
  const row = (s: Side, off: number, seed: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", gap: 14 }}>
        {Array.from({ length: s.n }).map((_, i) => { const d = off + i * 7, p = pop(f, fps, d, 11, 0.6), fl = interpolate(f, [d + 6, d + 26], [0, 0.92], { ...clamp, easing: easeOut });
          return <div key={i} style={{ transform: `translateY(${(1 - p) * -160}px) rotate(${(1 - p) * 12}deg)`, opacity: p }}><Bucket fill={fl} color={s.color} speck={s.speck} wave={Math.sin(f / 4 + i) * (1 - fl / 1.2)} seed={seed * 10 + i} /></div>; })}
      </div>
      <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 40, color: TFB.white, letterSpacing: 2, textShadow: "0 3px 10px rgba(0,0,0,0.8)" }}>{s.label}</div>
    </div>
  );
  const pc = pop(f, fps, 10 + a.n * 7 + 8, 10, 0.55);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 52%, rgba(10,10,10,0.55), rgba(0,0,0,0.85))" }} />
      {title && <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 80, color: TFB.white, textTransform: "uppercase", textShadow: "0 6px 0 rgba(0,0,0,0.45)" }}>{title}</div>}
      <div style={{ position: "absolute", top: 330, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 60 }}>
        {row(a, 6, 1)}
        <div style={{ fontFamily: ANTON, fontSize: 190, color: TFB.yellow, lineHeight: 1, marginTop: 10, transform: `scale(${interpolate(pc, [0, 1], [2.2, 1])})`, opacity: pc, ...strokeText(8) }}>{a.n}:{b.n}</div>
        {row(b, 10 + a.n * 7, 2)}
      </div>
      {footer && (() => { const p = pop(f, fps, 10 + (a.n + b.n) * 7 + 18, 12, 0.6); return <div style={{ position: "absolute", bottom: 130, width: "100%", textAlign: "center", opacity: p,
        transform: `translateY(${(1 - p) * 30}px)` }}><span style={{ fontFamily: ANTON, fontSize: 58, color: TFB.ink, background: TFB.yellow, padding: "4px 26px 8px", borderRadius: 12, boxShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>{footer}</span></div>; })()}
    </AbsoluteFill>
  );
};
