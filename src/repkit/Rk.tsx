// repkit · helpers compartidos del kit de "Claudio el Repositor" (Claude, 12-oct-2026).
// Tiempos: TODO en segundos ABSOLUTOS del video. Cada componente recibe `from` (segundo donde arranca)
// y `dur` (segundos que vive). Dentro, el tiempo local se calcula con at(t) = fr(t) - fr(from).
// Imágenes: rutas relativas a public/ (ej. "img/repkit/door.png"). Nunca se hardcodea un slug.
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { fr, cl, ez, eo, lin, sp, Mark, C as BASE_C, HAND, SERIF } from "../ckeggs/Base";
export { fr, cl, ez, eo, lin, sp, Mark, HAND, SERIF };

// ── fuentes del canal ──
const bar = loadBarlow("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
const osw = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] });
const plx = loadPlex("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });
const ant = loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
export const LABEL_SANS = bar.fontFamily; // etiquetas, nombres, chips
export const PRICE = osw.fontFamily;      // dígitos de precio (condensada, bold)
export const MONO = plx.fontFamily;       // ticket térmico
export const STAMP = ant.fontFamily;      // texto del sello de goma

// ── paleta del canal ──
export const RK = {
  shelf: "#F7F5EE",   // blanco de cartel de góndola
  price: "#D7262B",   // rojo de precio
  offer: "#FFD43B",   // amarillo de oferta
  apron: "#1F4D3A",   // verde del delantal (sello)
  fluo: "#E6F3FF",    // tinte de tubo fluorescente frío
  ink: "#1B1B1B",     // tinta
  paper: "#FBF8EF",   // papel de ticket / cartel
  pen: "#1F2A5A",     // birome azul de la planilla
  green: "#2BB35A",   // check / CONVIENE
  lcd: "#8CFF9A",     // LCD verde
};
export const shadowBig = "0 40px 80px rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.3)";
export const im = (k: string) => staticFile(k);
export const fmtPeso = (n: number) => "$ " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const fmtNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ── cámara: lleva el punto (x,y) del lienzo 1920x1080 al centro con escala s; eased entre claves ──
export type Cam = { t: number; s: number; x: number; y: number };
export const camAt = (f: number, at: (t: number) => number, K: Cam[], dur = 1.1) => {
  let c = K[0];
  for (let i = 1; i < K.length; i++) {
    const p = c, q = K[i], u = ez((f - at(q.t)) / (dur * 30));
    if (f >= at(q.t)) c = { t: q.t, s: p.s + (q.s - p.s) * u, x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u };
  }
  return c;
};
export const camStyle = (c: Cam): React.CSSProperties => ({ transformOrigin: "0 0", transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})` });

// ── grano y tratamiento (propios, sin assets: ruido SVG inline) ──
const NOISE = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
export const Grain: React.FC<{ o?: number }> = ({ o = 0.09 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, opacity: o, mixBlendMode: "multiply" }} />
);
export const Grade: React.FC<{ vig?: number; warm?: number }> = ({ vig = 0.3, warm = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background:
    `linear-gradient(180deg, rgba(230,243,255,${0.04}) 0%, rgba(255,236,200,0) 45%, rgba(20,16,12,${0.12 * warm}) 100%), radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 56%, rgba(10,8,6,${vig}) 100%)` }} />
);

// ── envoltorio temporal: Sequence desde `from` durante `dur` segundos; adentro f = cuadros locales ──
export const Shell: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => (
  <Sequence from={fr(from)} durationInFrames={Math.max(2, fr(dur))} layout="none">{children}</Sequence>
);
// tiempo local: f = cuadros desde `from`, at(t) = cuadro local de un segundo absoluto t
export const useLocal = (from: number) => {
  const frame = useCurrentFrame();
  return { f: frame, at: (t: number) => fr(t) - fr(from) };
};
// fundido a blanco (sellado de paso) entre t0 y t1, absolutos
export const WhiteOut: React.FC<{ at: (t: number) => number; t0: number; t1: number; f: number }> = ({ at, t0, t1, f }) => {
  const u = cl((f - at(t0)) / Math.max(1, at(t1) - at(t0)));
  return u > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: ez(u) }} /> : null;
};
export { BASE_C };
export const sealShadow = "drop-shadow(0 3px 2px rgba(0,0,0,0.35))";
