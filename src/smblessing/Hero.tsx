// smblessing · componentes HERO de los primeros 60 s (Claude, 12-oct-2026). Regla del dueño: el primer minuto tiene que ser increíble.
// Cada uno es una escena con capas (fondo, objeto héroe, elementos que se construyen), la palabra de la voz manda el tiempo.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from "remotion";
import { SERIF, LABEL, C, Grain, img, fr, cl, eo, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const shadow = "0 8px 30px rgba(0,0,0,0.7)";

// ── HERO 1 · lo que vamos a hacer (promesa): titular grande + tres tarjetas que se escriben en su palabra
export const HeroPromise: P<{ k: string; head: string; lines: { t: number; txt: string }[] }> = ({ a, d, k, head, lines }) => {
  const { f, at } = useT(a);
  const push = 1.03 + 0.07 * (f / Math.max(1, d));
  const sweep = interpolate(f, [0, d], [-40, 140]);
  const hTitle = sp(f, 2, 14, 120);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 40%" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) saturate(0.85) sepia(0.15)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,14,28,0.25) 0%, rgba(20,14,28,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,240,215,0.10) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)` }} />
      <div style={{ position: "absolute", left: 150, top: 150, width: 1620, transform: `translateY(${(1 - hTitle) * 40}px)`, opacity: hTitle }}>
        <div style={{ fontFamily: LABEL, color: C.lilac, letterSpacing: 8, fontSize: 30, marginBottom: 18, textShadow: shadow }}>WHAT WE WILL DO TOGETHER</div>
        <div style={{ fontFamily: SERIF, color: "#FBF8F2", fontSize: 128, lineHeight: 1.02, textShadow: shadow }}>{head}</div>
      </div>
      {lines.map((ln, i) => {
        const s = sp(f, at(ln.t), 13, 150);
        const x = (1 - s) * 90;
        return (
          <div key={i} style={{ position: "absolute", left: 150, top: 560 + i * 128, width: 1300, opacity: s, transform: `translateX(${x}px)`,
            background: "rgba(251,248,242,0.94)", borderRadius: 10, padding: "26px 36px", boxShadow: "0 18px 40px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, border: `4px solid ${C.lilacDeep}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.lilacDeep, fontFamily: LABEL, fontSize: 30 }}>{i + 1}</div>
            <div style={{ fontFamily: SERIF, color: C.ink, fontSize: 52 }}>{ln.txt}</div>
          </div>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};

// ── HERO 2 · el libro: la tapa sube con sombra, el número cuenta hasta 52 y las tres palabras (una verse, una story, una prayer) aparecen en su palabra
export const HeroBook: P<{ k: string; num: number; unit: string; lines: { t: number; txt: string }[]; t0: number; t1: number }> = ({ a, d, k, num, unit, lines, t0, t1 }) => {
  const { f, at } = useT(a);
  const rise = sp(f, 0, 12, 110);
  const cnt = Math.round(num * cl((at(t1) === 0 ? 1 : (f - at(t0)) / Math.max(1, at(t1) - at(t0)))));
  const push = 1.0 + 0.05 * (f / Math.max(1, d));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 40%, #3b2f4c 0%, #17121d 70%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 170, top: 120, width: 640, height: 840, transform: `translateY(${(1 - rise) * 260}px) scale(${push}) rotate(-2deg)`, opacity: rise,
        boxShadow: "0 60px 90px rgba(0,0,0,0.75), 0 10px 25px rgba(0,0,0,0.5)", borderRadius: 4, overflow: "hidden" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0) 12%)" }} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 230, width: 900 }}>
        <div style={{ fontFamily: SERIF, color: "#FBF8F2", fontSize: 230, lineHeight: 0.95, textShadow: shadow, fontVariantNumeric: "tabular-nums" }}>{f < at(t0) ? 0 : cnt}</div>
        <div style={{ fontFamily: LABEL, color: C.lilac, letterSpacing: 10, fontSize: 52, marginTop: 6, opacity: sp(f, at(t0) + 2, 14, 120) }}>{unit}</div>
      </div>
      {lines.map((ln, i) => {
        const s = sp(f, at(ln.t), 13, 150);
        return (
          <div key={i} style={{ position: "absolute", left: 900, top: 660 + i * 110, width: 980, opacity: s, transform: `translateX(${(1 - s) * 60}px)`, fontFamily: SERIF, color: "#FBF8F2", fontSize: 58, textShadow: shadow }}>
            <span style={{ color: C.red, marginRight: 22 }}>—</span>{ln.txt}
          </div>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};
