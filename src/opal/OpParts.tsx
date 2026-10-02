// Piezas compartidas del kit Opal: cama (foto o video) con Ken-Burns al azar, hoja de libreta clavada con chinche,
// etiqueta de bolsa de alimento cosida, sello de goma, círculo de lápiz que se dibuja, entrada con resorte.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OP, LABEL, SLAB, HAND, notebookBg, kraftBg, rnd } from "./OpTheme";

export const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const OpBed: React.FC<{ src?: string; seed?: number; dim?: number }> = ({ src, seed = 7, dim = 0.15 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const r = (o: number) => rnd(seed * 31 + o);
  const amp = 0.04 + 0.06 * r(1), acerca = r(2) > 0.5;
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], ease);
  const z = 1.06 + (acerca ? amp * k : amp * (1 - k));
  if (!src) return <AbsoluteFill style={{ ...kraftBg() }} />;
  const st: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: `${(30 + 40 * r(3)).toFixed(1)}% ${(30 + 40 * r(4)).toFixed(1)}%` };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OP.kraft }}>
      {/\.mp4$/.test(src) ? <OffthreadVideo src={staticFile(src)} muted style={st} /> : <Img src={staticFile(src)} style={st} />}
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(44,42,40,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

export const useIn = (delay = 0, damping = 14, stiffness = 120) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};
export const useOut = (n = 8) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  return interpolate(f, [durationInFrames - n, durationInFrames], [1, 0], ease);
};

// chinche roja
export const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 18, background: `radial-gradient(circle at 35% 30%, #f07a6e, ${OP.red} 55%, ${OP.redDeep})`, boxShadow: "0 6px 8px rgba(0,0,0,0.35)" }} />
);

// hoja de libreta rayada clavada (con sombra y leve rotación)
export const NotePage: React.FC<{ w: number; h: number; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, rot = -1.5, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, transform: `rotate(${rot}deg)`, boxShadow: `0 22px 40px ${OP.shadow}`, ...notebookBg(), ...style }}>
    <Pin x={w / 2} y={26} />
    <div style={{ position: "absolute", inset: 0, padding: "70px 44px 30px 150px" }}>{children}</div>
  </div>
);

// etiqueta de bolsa de alimento (kraft, borde cosido)
export const FeedTag: React.FC<{ w: number; h: number; children?: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ w, h, children, color = OP.white, style }) => (
  <div style={{ position: "relative", width: w, height: h, background: color, boxShadow: `0 16px 30px ${OP.shadow}`, ...style }}>
    <div style={{ position: "absolute", inset: 10, border: `3px dashed ${OP.kraftDeep}` }} />
    <div style={{ position: "absolute", inset: 0, padding: "26px 34px", display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
  </div>
);

export const Stamp: React.FC<{ text: string; at?: number; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ text, at = 10, color = OP.red, size = 96, rot = -8, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  const sc = interpolate(s, [0, 1], [1.7, 1]); const op = interpolate(f - at, [0, 3], [0, 1], ease);
  return (
    <div style={{ display: "inline-block", transform: `rotate(${rot}deg) scale(${sc})`, opacity: op, padding: `${size * 0.12}px ${size * 0.32}px`, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.14, color, fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: size * 0.04, lineHeight: 1, textTransform: "uppercase", mixBlendMode: "multiply", maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 75%, #000 90%)", ...style }}>{text}</div>
  );
};

// círculo de lápiz rojo que se dibuja a mano alzada (SVG, dos vueltas imperfectas)
export const PencilCircle: React.FC<{ cx: number; cy: number; rx: number; ry: number; at?: number; color?: string; width?: number; seed?: number }> = ({ cx, cy, rx, ry, at = 8, color = OP.red, width = 9, seed = 3 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 16], [0, 1], ease);
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const a = (i / 80) * Math.PI * 2.25 - 0.6;
    const j = 1 + (rnd(seed + i) - 0.5) * 0.05 + i * 0.0009;
    pts.push(`${(cx + Math.cos(a) * rx * j).toFixed(1)},${(cy + Math.sin(a) * ry * j).toFixed(1)}`);
  }
  const len = 2 * Math.PI * Math.max(rx, ry) * 1.25;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.35))" }} />
    </svg>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = OP.pencilSoft, size = 30 }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: size, letterSpacing: size * 0.18, textTransform: "uppercase", color }}>{children}</div>
);
export const Hand: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = OP.pencil, size = 64, style }) => (
  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.0, color, ...style }}>{children}</div>
);
export const Slab: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = OP.pencil, size = 84, style }) => (
  <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: size, lineHeight: 1.02, color, ...style }}>{children}</div>
);
// escritura a mano: revela letra por letra (como el lápiz)
export const Written: React.FC<{ text: string; at?: number; cps?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, at = 0, cps = 22, size = 60, color = OP.pencil, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((f - at) / fps) * cps));
  return <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color, whiteSpace: "pre-wrap", lineHeight: 1.05, ...style }}>{text.slice(0, n)}</div>;
};
