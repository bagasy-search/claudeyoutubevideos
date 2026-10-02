// Piezas compartidas del kit Hazel: cama de foto con Ken-Burns al azar, etiqueta manila con hilo, sello de goma,
// entrada con resorte. Todo determinista (semilla), textos por props.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE, hexA, manilaBg, rnd } from "./HzTheme";

export const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// cama de foto (la del objeto del que se habla) — Ken-Burns al azar por semilla (sentido 50/50, foco 30-70 %)
export const HzBed: React.FC<{ src?: string; seed?: number; dim?: number; blur?: number }> = ({ src, seed = 7, dim = 0.18, blur = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const r = (o: number) => rnd(seed * 31 + o);
  const amp = 0.04 + 0.06 * r(1), acerca = r(2) > 0.5;
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], ease);
  const z = 1.06 + (acerca ? amp * k : amp * (1 - k));
  if (!src) return <AbsoluteFill style={{ ...manilaBg(HZ.manila2) }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: HZ.manila2 }}>
      {/\.mp4$/.test(src)
        ? <OffthreadVideo src={staticFile(src)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: `${(30 + 40 * r(3)).toFixed(1)}% ${(30 + 40 * r(4)).toFixed(1)}%`, filter: blur ? `blur(${blur}px)` : undefined }} />
        : <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: `${(30 + 40 * r(3)).toFixed(1)}% ${(30 + 40 * r(4)).toFixed(1)}%`, filter: blur ? `blur(${blur}px)` : undefined }} />}
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(31,27,22,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

export const useIn = (delay = 0, damping = 14, stiffness = 120) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};

// salida suave en los últimos N cuadros (para que el corte al plano siguiente no sea brusco dentro del componente)
export const useOut = (n = 8) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  return interpolate(f, [durationInFrames - n, durationInFrames], [1, 0], ease);
};

// etiqueta manila de tasación con ojal reforzado y hilo
export const Tag: React.FC<{ w: number; h: number; children?: React.ReactNode; color?: string; style?: React.CSSProperties; hole?: "left" | "top" }> = ({ w, h, children, color = HZ.manila, style, hole = "left" }) => {
  const notch = Math.min(w, h) * 0.22;
  const clip = hole === "left"
    ? `polygon(${notch}px 0, 100% 0, 100% 100%, ${notch}px 100%, 0 ${h - notch}px, 0 ${notch}px)`
    : `polygon(0 ${notch}px, ${notch}px 0, ${w - notch}px 0, 100% ${notch}px, 100% 100%, 0 100%)`;
  const hx = hole === "left" ? notch * 0.85 : w / 2, hy = hole === "left" ? h / 2 : notch * 0.85;
  return (
    <div style={{ position: "relative", width: w, height: h, filter: `drop-shadow(0 14px 22px ${HZ.shadow})`, ...style }}>
      <div style={{ position: "absolute", inset: 0, clipPath: clip, ...manilaBg(color) }} />
      <div style={{ position: "absolute", left: hx - 20, top: hy - 20, width: 40, height: 40, borderRadius: 20, background: HZ.white, border: `5px solid ${HZ.gold}`, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", inset: 0, paddingLeft: hole === "left" ? notch * 1.6 : 24, paddingTop: hole === "top" ? notch * 1.6 : 18, paddingRight: 24, paddingBottom: 18, display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

// sello de goma que cae y "golpea" (escala 1.6 → 1 con rebote, rotación fija)
export const Stamp: React.FC<{ text: string; at?: number; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ text, at = 10, color = HZ.red, size = 96, rot = -8, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  const sc = interpolate(s, [0, 1], [1.7, 1]); const op = interpolate(f - at, [0, 3], [0, 1], ease);
  return (
    <div style={{ display: "inline-block", transform: `rotate(${rot}deg) scale(${sc})`, opacity: op, padding: `${size * 0.12}px ${size * 0.32}px`, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.14, color, fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: size * 0.04, lineHeight: 1, textTransform: "uppercase", mixBlendMode: "multiply", maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 75%, #000 90%)", ...style }}>{text}</div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = HZ.inkSoft, size = 30 }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: size, letterSpacing: size * 0.18, textTransform: "uppercase", color }}>{children}</div>
);
export const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = HZ.ink, size = 84, style }) => (
  <div style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.02, color, ...style }}>{children}</div>
);
export const Typed: React.FC<{ text: string; at?: number; cps?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, at = 0, cps = 28, size = 40, color = HZ.ink, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((f - at) / fps) * cps));
  return <div style={{ fontFamily: TYPE, fontSize: size, color, whiteSpace: "pre-wrap", ...style }}>{text.slice(0, n)}<span style={{ opacity: n < text.length && n > 0 ? 1 : 0 }}>▌</span></div>;
};
export { hexA };
