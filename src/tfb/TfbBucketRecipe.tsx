// TfbBucketRecipe — la receta como baldes/jarras numerados que se LLENAN con la proporción exacta.
// Cada ítem entra en su cuadro `at` (relativo al Sequence): el recipiente cae con resorte, el material sube
// hasta su nivel (amount / maxAmount) con una ola, y el número cuenta hasta `amount`. Signos "+" entre ítems.
// Panel oscuro translúcido abajo (el footage sigue vivo arriba) o `full` a pantalla completa.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, TEXT_SHADOW, clamp, ease, inOut, pop } from "./theme";

export type RecipeItem = { label: string; amount: number; unit?: string; color: string; at: number; grain?: boolean };
const Bucket: React.FC<{ fill: number; color: string; f: number; grain?: boolean; id: string }> = ({ fill, color, f, grain, id }) => {
  const top = 200 - 170 * fill; // nivel (y) dentro del balde de 200 de alto
  const wave = (x: number) => top + Math.sin(x / 18 + f / 5) * 4 * (fill > 0.02 ? 1 : 0);
  let d = `M 12 ${wave(12)}`; for (let x = 12; x <= 168; x += 6) d += ` L ${x} ${wave(x)}`; d += " L 168 214 L 12 214 Z";
  return (
    <svg width={180} height={230} viewBox="0 0 180 230">
      <defs>
        <clipPath id={"cb" + id}><path d="M 14 30 L 166 30 L 150 214 Q 90 224 30 214 Z" /></clipPath>
        <linearGradient id={"gb" + id} x1="0" x2="1"><stop offset="0" stopColor="#6d747c" /><stop offset="0.5" stopColor="#9aa2ab" /><stop offset="1" stopColor="#5e656d" /></linearGradient>
      </defs>
      <path d="M 14 30 L 166 30 L 150 214 Q 90 224 30 214 Z" fill={`url(#gb${id})`} opacity={0.35} />
      <g clipPath={`url(#cb${id})`}>
        <path d={d} fill={color} />
        {grain && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={20 + ((i * 37) % 140)} cy={Math.max(top + 8, 205 - ((i * 53) % 150))} r={2.2} fill="rgba(0,0,0,0.18)" />)}
        <rect x={0} y={0} width={30} height={230} fill="rgba(255,255,255,0.18)" transform="skewX(-6)" />
      </g>
      <path d="M 14 30 L 166 30 L 150 214 Q 90 224 30 214 Z" fill="none" stroke="#e9edf1" strokeWidth={5} />
      <path d="M 10 30 L 170 30" stroke="#f5f7f9" strokeWidth={9} strokeLinecap="round" />
      <path d="M 22 36 Q 90 -26 158 36" fill="none" stroke="#cfd5db" strokeWidth={5} />
    </svg>
  );
};
export const TfbBucketRecipe: React.FC<{ dur: number; items: RecipeItem[]; title?: string; full?: boolean }> = ({ dur, items, title, full }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const o = inOut(f, dur, 10, 12);
  const max = Math.max(...items.map((i) => i.amount));
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: full ? "center" : "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div style={{ marginBottom: full ? 0 : 46, padding: "26px 50px 30px", borderRadius: 28,
        background: full ? "rgba(12,12,12,0.92)" : "linear-gradient(180deg, rgba(15,15,15,0.78), rgba(15,15,15,0.9))",
        boxShadow: "0 24px 70px rgba(0,0,0,0.55)", border: "2px solid rgba(255,255,255,0.12)",
        transform: `translateY(${(1 - o) * 60}px)` }}>
        {title && <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 34, color: C.yellow, letterSpacing: 3, textAlign: "center", marginBottom: 6, textTransform: "uppercase" }}>{title}</div>}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          {items.map((it, i) => {
            const s = pop(f, fps, it.at, 12), fillP = interpolate(f, [it.at + 6, it.at + 30], [0, it.amount / max], { ...clamp, easing: ease });
            const n = Math.round(interpolate(f, [it.at + 6, it.at + 30], [0, it.amount], clamp));
            return (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ fontFamily: F_DISPLAY, fontSize: 90, color: C.white, opacity: s, marginBottom: 110, textShadow: TEXT_SHADOW }}>+</div>}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * -120}px) scale(${0.6 + 0.4 * s})` }}>
                  <div style={{ fontFamily: F_DISPLAY, fontSize: 88, lineHeight: 1, color: C.yellow, textShadow: TEXT_SHADOW }}>{n}{it.unit ? <span style={{ fontSize: 40, marginLeft: 8 }}>{it.unit}</span> : null}</div>
                  <Bucket fill={fillP} color={it.color} f={f} grain={it.grain} id={String(i)} />
                  <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 30, color: C.white, textTransform: "uppercase", letterSpacing: 1, marginTop: 4, textAlign: "center", maxWidth: 240 }}>{it.label}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
