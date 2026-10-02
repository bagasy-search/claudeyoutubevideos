// Piezas compartidas del kit Earl: cama (foto/video) con Ken-Burns al azar, tapa de conservadora con tornillos,
// etiqueta de cinta de pintor, sello, subrayado y círculo de marcador que se dibujan, entrada con resorte.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EL, LABEL, MARKER, STENCIL, coolerBg, rnd } from "./ElTheme";

export const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const ElBed: React.FC<{ src?: string; seed?: number; dim?: number }> = ({ src, seed = 7, dim = 0.15 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const r = (o: number) => rnd(seed * 31 + o);
  const amp = 0.04 + 0.06 * r(1), acerca = r(2) > 0.5;
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], ease);
  const z = 1.06 + (acerca ? amp * k : amp * (1 - k));
  if (!src) return <AbsoluteFill style={{ background: `linear-gradient(${EL.sea}, ${EL.navy})` }} />;
  const st: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, transformOrigin: `${(30 + 40 * r(3)).toFixed(1)}% ${(30 + 40 * r(4)).toFixed(1)}%` };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: EL.navy }}>
      {/\.mp4$/.test(src) ? <OffthreadVideo src={staticFile(src)} muted playbackRate={Math.max(0.4, Math.min(1, 262 / Math.max(1, durationInFrames)))} style={st} /> : <Img src={staticFile(src)} style={st} />}
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(19,40,66,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

export const useIn = (delay = 0, damping = 14, stiffness = 120) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};

// tapa blanca de conservadora con borde y 4 tornillos (el "pizarrón" del galpón de Earl)
export const Lid: React.FC<{ w: number; h: number; rot?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, rot = -1, children, style }) => (
  <div style={{ position: "relative", width: w, height: h, transform: `rotate(${rot}deg)`, borderRadius: 26, border: `10px solid ${EL.cooler2}`, boxShadow: `0 26px 50px ${EL.shadow}, inset 0 -8px 0 rgba(0,0,0,0.05)`, ...coolerBg(), ...style }}>
    {[[22, 22], [w - 42, 22], [22, h - 42], [w - 42, h - 42]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: "radial-gradient(circle at 35% 35%, #fff, #9aa3a8)", boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }} />)}
    <div style={{ position: "absolute", inset: 0, padding: "46px 60px" }}>{children}</div>
  </div>
);

// cinta de pintor con texto a marcador (rótulo)
export const Tape: React.FC<{ text: string; rot?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, rot = -3, size = 40, color = EL.marker, style }) => (
  <div style={{ display: "inline-block", transform: `rotate(${rot}deg)`, background: "#EADBB0", padding: `${size * 0.15}px ${size * 0.5}px`, boxShadow: "0 4px 8px rgba(0,0,0,0.25)", fontFamily: MARKER, fontSize: size, color, clipPath: "polygon(1% 4%, 99% 0, 100% 96%, 0 100%)", ...style }}>{text}</div>
);

export const Stamp: React.FC<{ text: string; at?: number; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ text, at = 10, color = EL.red, size = 96, rot = -8, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  const sc = interpolate(s, [0, 1], [1.7, 1]); const op = interpolate(f - at, [0, 3], [0, 1], ease);
  return (
    <div style={{ display: "inline-block", transform: `rotate(${rot}deg) scale(${sc})`, opacity: op, padding: `${size * 0.12}px ${size * 0.32}px`, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.14, color, fontFamily: STENCIL, fontSize: size, letterSpacing: size * 0.03, lineHeight: 1, textTransform: "uppercase", mixBlendMode: "multiply", maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 75%, #000 90%)", ...style }}>{text}</div>
  );
};

// círculo de marcador a mano alzada
export const MarkerCircle: React.FC<{ cx: number; cy: number; rx: number; ry: number; at?: number; color?: string; width?: number; seed?: number }> = ({ cx, cy, rx, ry, at = 8, color = EL.red, width = 10, seed = 3 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 14], [0, 1], ease);
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) { const a = (i / 80) * Math.PI * 2.2 - 0.5; const j = 1 + (rnd(seed + i) - 0.5) * 0.05 + i * 0.0008; pts.push(`${(cx + Math.cos(a) * rx * j).toFixed(1)},${(cy + Math.sin(a) * ry * j).toFixed(1)}`); }
  const len = 2 * Math.PI * Math.max(rx, ry) * 1.2;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.35))" }} />
    </svg>
  );
};

// marcador que escribe letra por letra
export const Marker: React.FC<{ text: string; at?: number; cps?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, at = 0, cps = 20, size = 60, color = EL.marker, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((f - at) / fps) * cps));
  return <div style={{ fontFamily: MARKER, fontSize: size, color, whiteSpace: "pre-wrap", lineHeight: 1.08, ...style }}>{text.slice(0, n)}</div>;
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = EL.inkSoft, size = 30 }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: size * 0.18, textTransform: "uppercase", color }}>{children}</div>
);
