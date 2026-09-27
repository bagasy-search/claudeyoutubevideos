// TfbErrorList — "LOS N ERRORES": título rojo y cada error entra en su momento (`ats`, cuadros) con una X roja que se
// estampa (golpe + temblor). Columna izquierda sobre velo oscuro, el footage respira a la derecha.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, pop, textShadow } from "./theme";

export type TfbErrorListProps = { dur: number; title: string; items: string[]; ats: number[]; x?: number; y?: number; icon?: "x" | "check" | "q" };
export const TfbErrorList: React.FC<TfbErrorListProps> = ({ dur, title, items, ats, x = 90, y = 200, icon = "x" }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 8, dur], [1, 0], { ...clamp, easing: easeIn });
  const veil = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: ease });
  const t = pop(f, fps, 0, 12);
  const mark = icon === "x" ? C.red : icon === "q" ? C.yellowDeep : C.green;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 72%)", opacity: veil }} />
      <div style={{ position: "absolute", left: x, top: y }}>
        <div style={{ display: "inline-block", background: mark, color: icon === "q" ? C.ink : C.white, fontFamily: F.impact, fontSize: 70, padding: "4px 24px", transform: `scale(${t}) rotate(-2deg)`, transformOrigin: "left center", boxShadow: C.shadow }}>{title}</div>
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 30 }}>
          {items.map((it, i) => {
            const s = pop(f, fps, ats[i] ?? 20 + i * 20, 10, 0.6);
            const st = interpolate(s, [0, 1], [2.4, 1]);
            const sh = f - (ats[i] ?? 0) < 8 && f >= (ats[i] ?? 0) ? Math.sin(f * 3) * 6 : 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, s * 2), transform: `translateX(${sh}px)` }}>
                <svg width={78} height={78} viewBox="0 0 78 78" style={{ transform: `scale(${st})`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}>
                  <circle cx={39} cy={39} r={35} fill={C.white} />
                  {icon === "x" ? <path d="M24 24 L54 54 M54 24 L24 54" stroke={mark} strokeWidth={10} strokeLinecap="round" /> : icon === "q" ? <text x={39} y={55} textAnchor="middle" fontFamily={F.impact} fontSize={46} fill={C.ink}>{i + 1}</text> : <path d="M20 40 L34 54 L58 26" stroke={mark} strokeWidth={10} strokeLinecap="round" fill="none" />}
                </svg>
                <div style={{ fontFamily: F.impact, fontSize: 66, color: C.white, textTransform: "uppercase", textShadow, lineHeight: 1.05, maxWidth: 1000 }}>{it}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
