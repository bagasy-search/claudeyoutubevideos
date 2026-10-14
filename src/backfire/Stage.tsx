// backfire/Stage.tsx — ESCENARIO COMPARTIDO del canal "Walt Brennecke" (EN, documental de especies
// invasoras: "case files"). TODOS los componentes de src/backfire/ lo consumen.
//
// MARCA: el EXPEDIENTE. Negro de oficina + papel/manila (las carpetas de Walt) + ROJO SELLO sólo para
// el dato que duele. Máquina de escribir para lo documental (fechas, fuentes, rótulos), mano alzada
// (Caveat) para las notas de Walt sobre fotos, Oswald para los números grandes.
//
// ⛔ Reglas del kit (vara D:/rtmp/ck6/VARA_EDICION.md):
//   · NADA dibujado con CSS que sea un objeto: mapas, documentos, animales, lugares = IMÁGENES REALES.
//     CSS/SVG sólo para cámara, chips, sellos, círculos rojos, líneas sobre el mapa, resaltados, grano.
//   · Los BEATS caen en PALABRAS: cada prop `at` es un segundo ABSOLUTO del video (sale de words.json).
//     El build inyecta `t0` (segundo absoluto donde arranca el componente) → `useAbs(t0)` da el
//     segundo absoluto del cuadro actual. Sin `t0` (stills sueltos) los `at` se leen como relativos.
//   · Siempre algo se mueve (push lento de cámara), nunca un componente sobre fondo vacío (cama de foto).
//   · OffthreadVideo SIEMPRE, muteado (el audio sale del máster mezclado).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const { fontFamily: oswald } = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: elite } = loadElite("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: caveat } = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const F_NUM = `${oswald}, 'Arial Narrow', sans-serif`;
export const F_BODY = `${inter}, 'Segoe UI', Arial, sans-serif`;
export const F_TYPE = `${elite}, 'Courier New', monospace`;
export const F_HAND = `${caveat}, 'Segoe Print', cursive`;

export const W = {
  ink0: "#0B0C0A",
  ink1: "#151612",
  paper: "#ECE4CF",
  paperDark: "#D9CDAE",
  manila: "#C9A45C",
  manilaDark: "#8E6E35",
  red: "#C0281F",       // sello / dato que duele
  redSoft: "#E04A3C",
  pin: "#D8352A",
  green: "#7FA35A",     // "lo que funciona"
  white: "#F4F0E6",
  bone: "#D3CAB4",
  smoke: "#9A968B",
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeIO = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.out(Easing.cubic);
export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const x = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};
// hash entero determinista (el farm rinde en paralelo: nada de Math.random)
export const rnd = (k: number) => {
  let h = (k | 0) ^ 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** Segundo ABSOLUTO del video en este cuadro (t0 lo inyecta rksafe_build). */
export const useAbs = (t0?: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (t0 ?? 0) + f / fps;
};
/** 0→1 entre `at` y `at+dur` (segundos absolutos). */
export const prog = (now: number, at: number | undefined, dur = 0.5, ez = easeOut) =>
  at === undefined ? 1 : interpolate(now, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ez });

/** Salida suave en los últimos `n` cuadros del componente (sin fundir a negro: sólo los textos). */
export const useOut = (durationInFrames?: number, n = 10) => {
  const f = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = durationInFrames ?? seq;
  return interpolate(f, [D - n, D], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

// ── CÁMARA POR KEYFRAMES: lleva el punto (x,y) del lienzo 1920x1080 al centro, a escala s ──────────
export type CamKey = { t: number; x: number; y: number; s: number };
export const camAt = (now: number, keys: CamKey[]) => {
  if (!keys.length) return { x: 960, y: 540, s: 1 };
  if (now <= keys[0].t) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (now <= b.t) {
      const p = easeIO(clamp01((now - a.t) / Math.max(0.001, b.t - a.t)));
      return { t: now, x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), s: lerp(a.s, b.s, p) };
    }
  }
  return keys[keys.length - 1];
};
/** transform de una capa 1920x1080 (transformOrigin 0 0) para la cámara c, sin mostrar borde. */
export const camStyle = (c: { x: number; y: number; s: number }): React.CSSProperties => {
  const s = Math.max(1, c.s);
  let tx = 960 - c.x * s, ty = 540 - c.y * s;
  tx = Math.min(0, Math.max(1920 - 1920 * s, tx));
  ty = Math.min(0, Math.max(1080 - 1080 * s, ty));
  return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})` };
};

// ── CAMA DE FOTO: va debajo de todo componente (nunca fondo plano) ────────────────────────────────
export const Bed: React.FC<{ src?: string; dim?: number; blur?: number }> = ({ src, dim = 0.55, blur = 0 }) => {
  const f = useCurrentFrame();
  const z = 1.05 + f * 0.00018;
  if (!src) return <AbsoluteFill style={{ background: `radial-gradient(110% 90% at 50% 20%, ${W.ink1} 0%, ${W.ink0} 75%)` }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z.toFixed(4)})`, filter: `brightness(${(1 - dim).toFixed(2)}) saturate(0.8)${blur ? ` blur(${blur}px)` : ""}` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(W.ink0, 0.45)} 0%, ${rgba(W.ink0, 0.2)} 45%, ${rgba(W.ink0, 0.7)} 100%)` }} />
    </AbsoluteFill>
  );
};

/** Grano + viñeta suave: une fotos de distintas fuentes en un solo look. */
export const Grade: React.FC<{ vignette?: number }> = ({ vignette = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(120% 95% at 50% 45%, transparent 55%, ${rgba(W.ink0, vignette)} 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.06, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)", backgroundSize: "3px 3px", backgroundPosition: `${(f * 7) % 3}px ${(f * 5) % 3}px`, mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

// ── CHIPS / RÓTULOS ────────────────────────────────────────────────────────────────────────────────
/** Crédito chico abajo a la derecha ("USFWS · public domain", "Name · CC BY 4.0"). Obligatorio en todo material ajeno. */
export const Credit: React.FC<{ text?: string; a?: number }> = ({ text, a = 1 }) => !text ? null : (
  <div style={{ position: "absolute", right: 34, bottom: 26, opacity: 0.88 * a, fontFamily: F_BODY, fontWeight: 500, fontSize: 19, color: W.white, background: rgba(W.ink0, 0.55), padding: "4px 10px", borderRadius: 3, letterSpacing: 0.3, textShadow: "0 1px 4px rgba(0,0,0,.9)" }}>{text}</div>
);

/** Chip de tipo de material: "REAL FOOTAGE", "DOCUMENT", "MAP" … arriba a la izquierda. */
export const KindChip: React.FC<{ text: string; a?: number; color?: string }> = ({ text, a = 1, color = W.red }) => (
  <div style={{ position: "absolute", left: 40, top: 36, opacity: a, transform: `translateX(${((1 - a) * -16).toFixed(1)}px)`, display: "flex", alignItems: "center", gap: 10, background: rgba(W.ink0, 0.66), padding: "7px 14px 7px 12px", borderRadius: 4, borderLeft: `4px solid ${color}` }}>
    <div style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
    <div style={{ fontFamily: F_TYPE, fontSize: 24, letterSpacing: 2.2, color: W.white }}>{text}</div>
  </div>
);

/** Nota de Walt a mano sobre una tira de papel (3-5 palabras). */
export const Note: React.FC<{ text: string; x: number; y: number; a?: number; rot?: number; size?: number }> = ({ text, x, y, a = 1, rot = -3, size = 54 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${(0.92 + 0.08 * a).toFixed(3)})`, background: W.paper, padding: "10px 26px 12px", boxShadow: "0 10px 28px rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>
    <div style={{ fontFamily: F_HAND, fontWeight: 700, fontSize: size, lineHeight: 1, color: "#1D1B16" }}>{text}</div>
  </div>
);

/** Sello de goma que CAE (escala 1.6→1, sacudón) cuando p pasa de 0 a 1. */
export const Stamp: React.FC<{ text: string; p: number; x: number; y: number; size?: number; rot?: number; color?: string }> = ({ text, p, x, y, size = 80, rot = -8, color = W.red }) => {
  if (p <= 0) return null;
  const s = interpolate(p, [0, 0.55, 0.8, 1], [1.7, 0.96, 1.02, 1]);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s.toFixed(3)})`, opacity: clamp01(p * 3) * 0.92, border: `${Math.round(size / 13)}px solid ${color}`, borderRadius: 10, padding: `${Math.round(size / 8)}px ${Math.round(size / 3.2)}px`, color, fontFamily: F_TYPE, fontSize: size, letterSpacing: 4, lineHeight: 1, whiteSpace: "nowrap", background: rgba(W.paper, 0.10), textShadow: `0 0 1px ${color}`, boxShadow: `0 0 0 2px ${rgba(color, 0.25)}` }}>{text}</div>
  );
};

/** Trazo rojo a mano alrededor de un punto (círculo imperfecto que se dibuja con p). */
export const RedCircle: React.FC<{ x: number; y: number; r: number; p: number; color?: string; seed?: number }> = ({ x, y, r, p, color = W.redSoft, seed = 3 }) => {
  if (p <= 0) return null;
  const pts: string[] = [];
  const N = 64, turns = 1.12;
  for (let i = 0; i <= N; i++) {
    const a = -Math.PI * 0.6 + (i / N) * Math.PI * 2 * turns;
    const k = 1 + 0.06 * Math.sin(i * 0.5 + seed) + 0.04 * (i / N);
    pts.push(`${(x + Math.cos(a) * r * k * 1.12).toFixed(1)},${(y + Math.sin(a) * r * k * 0.9).toFixed(1)}`);
  }
  const len = 2 * Math.PI * r * 1.15 * turns;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
    </svg>
  );
};

/** Formato de número con separador de miles (200,000,000). */
export const fmt = (n: number, dec = 0) => n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
