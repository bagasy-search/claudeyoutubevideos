// pk.tsx · kit de PROPS fotorreales (recortes agnes en public/img/<slug>/cut/<id>.webp) con física por código:
// caer con rebote y aplastado, hamacarse, deslizar, cámara curva orgánica, mesa de madera, agua con brillos y la palabra grande dentro de la escena.
import React from "react";
import { H, Mode, Stage, cl, eio, phys } from "./hkit";
import { Prop, Puff } from "./obj";

// escena genérica (fondo + máscara de entrada del modo del héroe) y utilidades
export const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
export const D = (h: H) => Math.max(4, h.out - h.at);
export const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
export const bt = (h: H, i: number, d: number) => h.bt?.[i] ?? d;
export type C = React.FC<{ t: number; h: H }>;
export const SER = "Georgia, 'Times New Roman', serif";
// cae desde arriba y rebota: k (0..1 llegada), dy (desplazamiento), sq (aplastado al tocar)
export const land = (tt: number, at: number, h = 700, w = 9, z = 0.34) => {
  if (tt < at) return { on: false, k: 0, dy: -h, sq: 0 };
  const s = phys(tt, at, w, z);
  return { on: true, k: cl(s), dy: s < 1 ? -(1 - s) * h : 0, sq: s > 1 ? Math.min(1, (s - 1) * 5) : 0 };
};
// péndulo amortiguado que arranca en at con amplitud a (grados)
export const swing = (tt: number, at: number, a = 14, w = 3.2, k = 0.9) => tt < at ? 0 : a * Math.exp(-k * (tt - at)) * Math.sin(w * (tt - at));
// polvo al tocar: 3 bocanadas que se abren y se apagan
export const Dust: React.FC<{ tt: number; at: number; x: number; y: number; w?: number; col?: string }> = ({ tt, at, x, y, w = 300, col }) => {
  const p = (tt - at) / 0.9; if (p <= 0 || p >= 1) return null;
  return <>{[-1, 0, 1].map((d) => <Puff key={d} x={x + d * w * (0.25 + 0.35 * p)} y={y - 20 - 30 * p} r={w * (0.16 + 0.22 * p)} o={(1 - p) * 0.9} col={col} />)}</>;
};
// prop que cae, rebota y se aplasta; polvo al tocar
export const Drop: React.FC<{ tt: number; at: number; id: string; x: number; y: number; w: number; r?: number; h?: number; dust?: boolean; flip?: boolean; ry?: number }> = ({ tt, at, id, x, y, w, r = 0, h = 760, dust = true, flip, ry }) => {
  const L = land(tt, at, h); if (!L.on) return null;
  return <><Prop id={id} x={x} y={y + L.dy} w={w} r={r * (1 - L.k * 0.4)} sq={L.sq} flip={flip} ry={ry} sh={L.k} />{dust && <Dust tt={tt} at={at + 0.13} x={x} y={y} w={w * 0.6} />}</>;
};
// cámara curva: empuje suave con deriva en arco y un leve balanceo (nunca zoom lineal)
export const Cam: React.FC<{ tt: number; d: number; z?: number; fx?: number; fy?: number; ax?: number; children: React.ReactNode }> = ({ tt, d, z = 0.07, fx = 960, fy = 540, ax = 26, children }) => {
  const p = eio(tt, 0, d), s = 1 + z * p, dx = ax * Math.sin(p * Math.PI) - ax * 0.5 * p, dy = -ax * 0.4 * Math.sin(p * Math.PI * 0.8), rr = 0.5 * Math.sin(tt * 0.35);
  return <div style={{ position: "absolute", inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${dx}px,${dy}px) rotate(${rr}deg) scale(${s})` }}>{children}</div>;
};
// mesa de madera en perspectiva (de y0 hacia abajo) con veta y borde de luz
export const Mesa: React.FC<{ y0?: number; tone?: string }> = ({ y0 = 820, tone = "#9a6c3e" }) => <>
  <div style={{ position: "absolute", left: -200, top: y0, width: 2320, height: 1300 - y0, background: `repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 3px, transparent 3px 140px), repeating-linear-gradient(180deg, rgba(255,230,190,.05) 0 2px, transparent 2px 19px), linear-gradient(180deg, ${tone}, #4a2e16)`, transform: "perspective(900px) rotateX(38deg)", transformOrigin: "50% 0" }} />
  <div style={{ position: "absolute", left: 0, top: y0 - 4, width: 1920, height: 10, background: "linear-gradient(90deg,transparent,rgba(255,226,180,.35),transparent)", filter: "blur(3px)" }} />
</>;
// agua: superficie desde y0 con brillos que corren
export const Agua: React.FC<{ tt: number; y0: number; col?: string; deep?: string; o?: number }> = ({ tt, y0, col = "#5a7a6a", deep = "#1e3a34", o = 1 }) => <div style={{ position: "absolute", left: 0, top: y0, width: 1920, height: 1080 - y0 + 40, opacity: o, background: `linear-gradient(${col}, ${deep})`, overflow: "hidden" }}>
  {Array.from({ length: 16 }, (_, k) => { const y = (k * 37) % (1080 - y0 + 20), x = ((k * 211 + tt * (30 + k * 6)) % 2300) - 200; return <div key={k} style={{ position: "absolute", left: x, top: y, width: 120 + (k % 4) * 70, height: 4, borderRadius: 4, background: "rgba(230,240,230,.28)", filter: "blur(1px)" }} />; })}
</div>;
// anillos concéntricos en el agua
export const Rings: React.FC<{ tt: number; at: number; x: number; y: number; s?: number }> = ({ tt, at, x, y, s = 1 }) => { const p = (tt - at) / 1.6; if (p <= 0 || p >= 1) return null;
  return <>{[0, 0.25, 0.5].map((d) => { const q = cl((p - d) / (1 - d)); return q <= 0 ? null : <div key={d} style={{ position: "absolute", left: x - 200 * s * q, top: y - 40 * s * q, width: 400 * s * q, height: 80 * s * q, borderRadius: "50%", border: `${4 * (1 - q) + 1}px solid rgba(235,245,240,${0.7 * (1 - q)})` }} />; })}</>; };
// palabra grande DENTRO de la escena (entra con resorte, sombra real); nunca rótulo chico
export const Word: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; col?: string; r?: number; out?: number }> = ({ tt, at, x, y, txt, size = 150, col = "#f3e6c6", r = -2, out = 1e9 }) => {
  const s = phys(tt, at, 8, 0.42) * (1 - cl((tt - out) / 0.4)); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`, fontFamily: SER, fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", letterSpacing: 2, textShadow: "0 3px 0 rgba(0,0,0,.35), 0 14px 28px rgba(0,0,0,.75)" }}>{txt}</div>;
};
// foco cálido que barre/ilumina (luz de escena)
export const Glow: React.FC<{ x: number; y: number; r: number; o?: number; col?: string }> = ({ x, y, r, o = 1, col = "255,214,150" }) => o <= 0 ? null : <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(${col},${0.55 * o}), rgba(${col},0) 70%)`, mixBlendMode: "screen" }} />;
// viñeta + luz de arriba para unir los recortes con la escena
export const Luz: React.FC<{ o?: number }> = ({ o = 1 }) => <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: o, background: "radial-gradient(ellipse 70% 60% at 50% 38%, rgba(255,236,200,.10), rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />;
export { Prop, Puff };
