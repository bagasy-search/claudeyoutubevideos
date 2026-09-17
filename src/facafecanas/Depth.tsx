// Depth.tsx — primitivas de PROFUNDIDAD del canal Federer Archivos, versión CLARA (papel clínico).
// Portado del kit premium Rowe (RoweDepth) y REBRANDEADO: papel crema + tinta oscura + TEAL/verde
// clínico + ÁMBAR para números y avisos + ROJO sólo para la alerta. Nada de fondo negro ni viñeta:
// la atmósfera es la foto real del vlog, luminosa, apenas desenfocada, con un velo crema.
// ⛔ Sin backdrop-filter (x5 el render). ⛔ Sin Math.random (el farm rinde en paralelo).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";
import { F_INTER } from "../VideoEdit/kit/premium/theme";

export const V = {
  paper: "#FBF7EE",
  paper2: "#F3ECDD",
  card: "#FFFDF8",
  ink: "#1C2A30",
  ink2: "#3D4E55",
  mute: "#6D7C82",
  teal: "#12B3AE",
  tealDeep: "#0C8A86",
  green: "#2F8F5B",
  amber: "#E0A23A",
  amberDeep: "#B7791F",
  danger: "#D6453C",
  white: "#FFFFFF",
};
export const F_DISPLAY = F_INTER;
export const F_BODY = F_INTER;
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const eOut = Easing.out(Easing.cubic);
export const eIO = Easing.bezier(0.4, 0, 0.2, 1);
export const ramp = (f: number, a: number, b: number, ease = eOut) => interpolate(f, [a, b], [0, 1], { ...CL, easing: ease });
export const spr = (f: number, fps: number, delay: number, damping = 120, mass = 0.85) =>
  spring({ frame: f - delay, fps, config: { damping, mass } });
export const rnd = (k: number) => {
  let x = (Math.round(k * 1000) | 0) ^ 0x9e3779b9;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};
export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const x = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};
export const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));
export const SHADOW = (h: number) => `0 ${Math.round(h * 0.06)}px ${Math.round(h * 0.16)}px ${rgba("#27343A", 0.28)}, 0 6px 16px ${rgba("#27343A", 0.16)}`;

/** Plano 0+1: la foto REAL del vlog, luminosa, levemente desenfocada, con parallax lento + velo crema + luces suaves. */
export const Atmosphere: React.FC<{ frame: number; img?: string; blur?: number; veil?: number; seed?: number; camX?: number }> = ({ frame, img, blur = 10, veil = 0.34, seed = 3, camX = 0 }) => {
  const z = 1.12 + Math.sin(frame / 260) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: V.paper, overflow: "hidden" }}>
      {img ? (
        <Img src={src(img)} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          filter: `blur(${blur}px)`, transform: `scale(${z.toFixed(4)}) translateX(${(camX * -0.35).toFixed(2)}px)`,
        }} />
      ) : null}
      <AbsoluteFill style={{ background: rgba(V.paper, veil) }} />
      {Array.from({ length: 6 }).map((_, i) => {
        const s = 380 + rnd(seed * 31 + i) * 420;
        const x = rnd(seed * 17 + i * 3) * 100, y = rnd(seed * 13 + i * 7) * 100;
        const dy = Math.sin(frame / (110 + i * 13) + i) * 22;
        const col = i % 2 === 0 ? V.teal : V.amber;
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle, ${rgba(col, 0.1)} 0%, ${rgba(col, 0)} 70%)`, transform: `translate(-50%,-50%) translate(${(camX * 0.3).toFixed(1)}px, ${dy.toFixed(1)}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Acabado liviano: motas de luz de ventana (sin grano oscuro, sin viñeta). */
export const Finish: React.FC<{ frame: number; seed?: number; camX?: number }> = ({ frame, seed = 5, camX = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: 14 }).map((_, i) => {
      const x = (rnd(seed + i * 5) * 100 + frame * (0.01 + rnd(i) * 0.03)) % 100;
      const y = (rnd(seed * 3 + i) * 100 - frame * (0.02 + rnd(i * 2) * 0.03) + 200) % 100;
      const s = 3 + rnd(i * 11) * 5;
      return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s, borderRadius: "50%", background: rgba("#FFFFFF", 0.35 + rnd(i * 7) * 0.3), transform: `translateX(${(camX * 1.2).toFixed(1)}px)` }} />;
    })}
  </AbsoluteFill>
);

export const Plane: React.FC<{ depth: number; camX: number; camY?: number; z?: number; children: React.ReactNode }> = ({ depth, camX, camY = 0, z = 0, children }) => (
  <AbsoluteFill style={{ zIndex: z, transform: `translate(${(camX * (depth - 0.4) * 2.2).toFixed(2)}px, ${(camY * (depth - 0.4) * 2.2).toFixed(2)}px)` }}>{children}</AbsoluteFill>
);

/** Tarjeta de PAPEL con FOTO: marco blanco, sombra suave de objeto, etiqueta en banda crema con tinta. */
export const PaperPhoto: React.FC<{
  img?: string; w: number; h: number; blur?: number; label?: string; sub?: string; dim?: number; glow?: string; glowK?: number;
  push?: number; desat?: number; children?: React.ReactNode; labelSize?: number; tone?: string;
}> = ({ img, w, h, blur = 0, label, sub, dim = 0, glow, glowK = 0, push = 0, desat = 0, children, labelSize = 40, tone = V.teal }) => (
  <div style={{
    width: w, height: h, borderRadius: 24, position: "relative", overflow: "hidden", background: V.card,
    border: `10px solid ${V.card}`,
    boxShadow: [SHADOW(h), glow && glowK > 0 ? `0 0 0 4px ${rgba(glow, 0.95 * glowK)}, 0 0 ${Math.round(60 * glowK)}px ${rgba(glow, 0.45 * glowK)}` : ""].filter(Boolean).join(", "),
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
  }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 14, overflow: "hidden" }}>
      {img ? <Img src={src(img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.04 + push).toFixed(4)})`, filter: `saturate(${(1 - desat * 0.85).toFixed(2)}) brightness(${(1 - dim * 0.35).toFixed(2)})` }} /> : null}
      {dim > 0.01 ? <div style={{ position: "absolute", inset: 0, background: rgba(V.paper, dim * 0.45) }} /> : null}
    </div>
    {label ? (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 22px 16px", background: rgba(V.card, 0.96), borderTop: `4px solid ${tone}` }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: labelSize, lineHeight: 1.05, color: V.ink }}>{label}</div>
        {sub ? <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 26, color: V.ink2, marginTop: 6 }}>{sub}</div> : null}
      </div>
    ) : null}
    {children}
  </div>
);

export const useCam = (frame: number, fps: number, hits: number[] = [], push = 0.05, len = 150) => {
  const p = interpolate(frame, [0, len], [1, 1 + push], { ...CL, easing: eOut });
  const drift = Math.sin((frame / fps) * 0.45) * 9;
  const driftY = Math.cos((frame / fps) * 0.33) * 5;
  let shake = 0, punch = 0;
  for (const h of hits) {
    const t = frame - h;
    if (t >= 0 && t < 8) { shake += Math.sin(t * 2.4) * 4 * (1 - t / 8); punch += Math.sin((t / 8) * Math.PI) * 0.012; }
  }
  return { scale: p + punch, camX: drift + shake, camY: driftY };
};

export const SlashLine: React.FC<{ d: string; u: number; width?: number; color?: string }> = ({ d, u, width = 18, color = V.danger }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 1920 1080" preserveAspectRatio="none">
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u}
      style={{ filter: `drop-shadow(0 4px 10px ${rgba("#27343A", 0.35)})` }} />
  </svg>
);

/** Titular sobre papel: chip crema con regla de color + texto en tinta (legible sobre cualquier foto). */
export const Headline: React.FC<{ kicker?: string; title?: string; a: number; color?: string; center?: boolean; size?: number }> = ({ kicker, title, a, color = V.tealDeep, center, size = 64 }) => (
  <div style={{ display: "flex", justifyContent: center ? "center" : "flex-start", opacity: a, transform: `translateY(${((1 - a) * 18).toFixed(1)}px)` }}>
    <div style={{ background: rgba(V.card, 0.95), borderRadius: 18, padding: "16px 34px 18px", boxShadow: SHADOW(120), borderLeft: `8px solid ${color}`, maxWidth: 1500 }}>
      {kicker ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color }}>{kicker}</div> : null}
      {title ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.06, color: V.ink, marginTop: kicker ? 4 : 0 }}>{title}</div> : null}
    </div>
  </div>
);

export const Chip: React.FC<{ text: string; color: string; ink?: string; size?: number }> = ({ text, color, ink = V.white, size = 30 }) => (
  <div style={{ display: "inline-block", padding: "8px 22px", borderRadius: 999, background: color, color: ink, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: 3, boxShadow: `0 8px 20px ${rgba(color, 0.35)}` }}>{text}</div>
);

/** Envoltura de segmento: entra/sale con zoom-through + blur, sin fundido a negro. */
export const SegmentShell: React.FC<{ frame: number; dur: number; children: React.ReactNode; inF?: number; outF?: number }> = ({ frame, dur, children, inF = 9, outF = 8 }) => {
  const a = ramp(frame, 0, inF);
  const b = 1 - ramp(frame, dur - outF, dur, Easing.in(Easing.cubic));
  const k = Math.min(a, b);
  const s = frame < dur / 2 ? 1.1 - 0.1 * a : 1 + 0.06 * (1 - b);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, k * 1.6), transform: `scale(${s.toFixed(4)})`, filter: k < 0.999 ? `blur(${((1 - k) * 12).toFixed(2)}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};
