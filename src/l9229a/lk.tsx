// kit compartido de Lou (l92, 30-oct): lo que el evaluador pidió en la vuelta 1 de l9229a para TODAS las piezas —
// la foto real del lugar detrás (nunca fondo liso), la mesa de fórmica, la letra a mano que se escribe y la caja de 1920×1080.
import React from "react";
import { Img } from "remotion";
import { HAND, cl, img } from "./hkit";

export const BOX = { position: "absolute" as const, left: 0, top: 0, width: 1920, height: 1080 };
export const Fondo: React.FC<{ id: string; tt: number; b?: number; br?: number; s?: number; y?: string }> = ({ id, tt, b = 5, br = 0.72, s = 1.08, y = "50%" }) => <>
  <Img src={img(id)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", objectPosition: `50% ${y}`, filter: `blur(${b}px) brightness(${br}) saturate(.9)`, transform: `scale(${s + 0.012 * tt})` }} />
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, rgba(10,6,2,.55) 100%)" }} />
</>;
export const Formica: React.FC<{ y0?: number }> = ({ y0 = 760 }) => <>
  <div style={{ position: "absolute", left: -300, top: y0, width: 2520, height: 1200 - y0, transformOrigin: "50% 0", transform: "perspective(900px) rotateX(40deg)",
    background: "radial-gradient(ellipse 50% 40% at 40% 20%, rgba(255,250,220,.35), transparent 70%), repeating-radial-gradient(circle at 30% 40%, rgba(120,90,20,.05) 0 2px, transparent 2px 9px), linear-gradient(180deg,#e9c457,#c99a2e)" }} />
  <div style={{ position: "absolute", left: 0, top: y0 - 6, width: 1920, height: 14, background: "linear-gradient(#f4f4f4,#8a8a8a 50%,#3a3a3a)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
</>;
export const Ink: React.FC<{ tt: number; at: number; dur: number; x: number; y: number; txt: string; size?: number; col?: string; w?: number }> = ({ tt, at, dur, x, y, txt, size = 52, col = "#22314f", w = 900 }) => {
  const p = cl((tt - at) / dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, lineHeight: 1.12, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{txt}</div>;
};
// copos que caen (o cruzan de costado con viento)
export const Nieve: React.FC<{ tt: number; n?: number; wind?: number; o?: number }> = ({ tt, n = 50, wind = 40, o = 0.85 }) => <>{Array.from({ length: n }, (_, k) => <div key={k} style={{ position: "absolute", left: ((k * 137 + tt * wind * (1 + (k % 3))) % 2000) - 40, top: (k * 71 + tt * (70 + (k % 4) * 25)) % 1100 - 20, width: 6 + (k % 3) * 3, height: 6 + (k % 3) * 3, borderRadius: "50%", background: "#fff", opacity: o }} />)}</>;
