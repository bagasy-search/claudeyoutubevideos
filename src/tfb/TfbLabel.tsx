// TfbLabel — rótulo de impacto (estilo miniatura): caja que se abre con barrido + texto que sube; salida en barrido.
// ≤12 palabras. `kicker` = línea chica arriba. Posición en px sobre 1920x1080.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, pop } from "./theme";

export type TfbLabelProps = {
  text: string; kicker?: string; dur: number;
  x?: number; y?: number; align?: "left" | "center" | "right";
  variant?: "yellow" | "white" | "red" | "ink"; size?: number; rotate?: number; maxWidth?: number;
};
const V = {
  yellow: { bg: C.yellow, fg: C.ink, kbg: C.ink, kfg: C.yellow },
  white: { bg: C.white, fg: C.ink, kbg: C.red, kfg: C.white },
  red: { bg: C.red, fg: C.white, kbg: C.white, kfg: C.red },
  ink: { bg: "rgba(12,12,12,0.86)", fg: C.white, kbg: C.yellow, kfg: C.ink },
};
export const TfbLabel: React.FC<TfbLabelProps> = ({ text, kicker, dur, x = 120, y = 820, align = "left", variant = "yellow", size = 64, rotate = -1.5, maxWidth = 1200 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), v = V[variant];
  const open = interpolate(f, [0, 9], [0, 100], { ...clamp, easing: ease });
  const close = interpolate(f, [dur - 8, dur], [0, 100], { ...clamp, easing: easeIn });
  const s = pop(f, fps, 2, 11);
  const ty = interpolate(s, [0, 1], [26, 0]);
  const kIn = interpolate(f, [5, 13], [0, 100], { ...clamp, easing: ease });
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0%";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(${tx}) rotate(${rotate}deg)`, transformOrigin: "left center", display: "flex", flexDirection: "column", alignItems: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start", gap: 8, clipPath: `inset(-40px ${close}% -40px 0)` }}>
      {kicker ? (
        <div style={{ background: v.kbg, color: v.kfg, fontFamily: F.ui, fontWeight: 900, fontSize: size * 0.36, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", clipPath: `inset(0 ${100 - kIn}% 0 0)`, boxShadow: C.shadow }}>{kicker}</div>
      ) : null}
      <div style={{ background: v.bg, padding: `${size * 0.14}px ${size * 0.34}px ${size * 0.08}px`, clipPath: `inset(0 ${100 - open}% 0 0)`, boxShadow: C.shadow, maxWidth }}>
        <div style={{ fontFamily: F.impact, fontSize: size, lineHeight: 1.05, color: v.fg, textTransform: "uppercase", transform: `translateY(${ty}px)`, opacity: s }}>{text}</div>
      </div>
    </div>
  );
};
