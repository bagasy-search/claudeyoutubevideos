// OlrKit — piezas compartidas de los componentes de ollarder (hierro fundido): fondo de madera, tarjeta de papel,
// rótulo a lápiz, sellos y utilidades de tiempo. Todo por useCurrentFrame (nada de useFrame ni Math.random).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, LABEL, SERIF, HAND, SANS, hexA, woodBg, rnd } from "./OleTheme";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eo = Easing.bezier(0.16, 1, 0.3, 1);
export const eio = Easing.bezier(0.45, 0, 0.2, 1);
/** 0→1 entre t0 y t1 (segundos) con easing */
export const ramp = (t: number, t0: number, t1: number, e: (x: number) => number = eo) =>
  interpolate(t, [t0, Math.max(t1, t0 + 0.001)], [0, 1], { ...cl, easing: e });
export const useT = () => { const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); return { f, fps, t: f / fps, dur: durationInFrames / fps, durF: durationInFrames }; };
/** entrada + salida suaves de todo el componente */
export const useIO = (inS = 0.35, outS = 0.3) => { const { t, dur } = useT(); return Math.min(ramp(t, 0, inS), 1 - ramp(t, dur - outS, dur, Easing.in(Easing.quad))); };

/** mesa de madera con viñeta suave (luz clara) */
export const Wood: React.FC<{ children?: React.ReactNode; tone?: string; dim?: number }> = ({ children, tone = "#B98C5A", dim = 0 }) => (
  <AbsoluteFill style={{ ...woodBg(tone), overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,235,200,0.22), rgba(60,35,15,0.28) 100%)" }} />
    {dim > 0 ? <AbsoluteFill style={{ backgroundColor: hexA("#1B1A18", dim) }} /> : null}
    {children}
  </AbsoluteFill>
);

/** tarjeta de papel con sombra */
export const Paper: React.FC<{ w: number; h?: number; x?: number; y?: number; rot?: number; bg?: string; pad?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, x = 0, y = 0, rot = 0, bg = OLE.paper, pad = 34, children, style }) => (
  <div style={{ position: "absolute", left: "50%", top: "50%", width: w, height: h, transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`,
    background: bg, padding: pad, boxShadow: `0 22px 44px ${OLE.shadow}, 0 3px 6px rgba(0,0,0,0.18)`, borderRadius: 4, boxSizing: "border-box", ...style }}>
    {children}
  </div>
);

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = OLE.fire, size = 26 }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: size, letterSpacing: size * 0.26, color, lineHeight: 1 }}>{children}</div>
);

/** rótulo a lápiz (libreta) que se escribe de izquierda a derecha */
export const Pencil: React.FC<{ text: string; at: number; size?: number; color?: string; dur?: number; style?: React.CSSProperties }> = ({ text, at, size = 44, color = OLE.pencil, dur = 0.7, style }) => {
  const { t } = useT();
  const w = ramp(t, at, at + dur, Easing.linear) * 100;
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color, lineHeight: 1.12, clipPath: `inset(-12px ${100 - w}% -12px 0)`, whiteSpace: "nowrap", ...style }}>{text}</div>;
};

/** sello grande inclinado (✓ / ✗ / texto) que cae con rebote */
export const Seal: React.FC<{ text: string; at: number; color?: string; size?: number; rot?: number; x?: number; y?: number }> = ({ text, at, color = OLE.plaid, size = 70, rot = -8, x = 0, y = 0 }) => {
  const { t } = useT();
  const p = ramp(t, at, at + 0.28, Easing.out(Easing.back(2.4)));
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg) scale(${1.9 - 0.9 * p})`, opacity: p,
      border: `${Math.round(size / 9)}px solid ${color}`, color, padding: `${size * 0.1}px ${size * 0.32}px`, borderRadius: 8, fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: size * 0.12, lineHeight: 1,
      background: hexA(OLE.cream, 0.55), whiteSpace: "nowrap" }}>{text}</div>
  );
};

/** sartén vista desde arriba (SVG) — para mapas de calor, gotas y pruebas */
export const PanTop: React.FC<{ cx: number; cy: number; r: number; fill?: string; rim?: string; handle?: boolean; rot?: number; children?: React.ReactNode }> = ({ cx, cy, r, fill = "#1E1C1A", rim = "#3A3733", handle = true, rot = 0, children }) => (
  <g transform={`rotate(${rot} ${cx} ${cy})`}>
    {handle ? <path d={`M ${cx + r * 0.9} ${cy - r * 0.11} L ${cx + r * 2.05} ${cy - r * 0.08} Q ${cx + r * 2.28} ${cy} ${cx + r * 2.05} ${cy + r * 0.08} L ${cx + r * 0.9} ${cy + r * 0.11} Z`} fill={rim} /> : null}
    <circle cx={cx} cy={cy} r={r} fill={rim} />
    <circle cx={cx} cy={cy} r={r * 0.93} fill={fill} />
    {children}
  </g>
);

export { OLE, LABEL, SERIF, HAND, SANS, hexA, woodBg, rnd };
