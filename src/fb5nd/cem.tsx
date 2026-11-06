// fb5nd · piezas propias del video del piso de cemento alisado: el contrapiso áspero con piedritas, la carpeta que va de
// mojada a mate a espejo (con la ventana reflejada), la mano, la llana de acero, el colador de cocina, el cuarto del fondo.
import React from "react";
import { C, cl, e, lerp, hash } from "./lib";
import { mkF, quad, MAD } from "./piso";

export type F = (u: number, v: number) => [number, number];
export const CONTRA = "#8a7a64", CONTRA2 = "#6c5e4b", CARP = "#a49c8e", CARPM = "#6f685d", ESPEJO = "#c9c4ba";

// superficie de piso en perspectiva. rug = cuánto contrapiso áspero (piedritas), moj = mojado oscuro, brillo = espejo con
// la ventana reflejada (0..1), hum = gotitas, top/side colores.
export const Piso: React.FC<{ cx: number; y: number; w: number; d: number; h?: number; rug?: number; moj?: number; brillo?: number; t?: number; seed?: number; children?: (f: F) => React.ReactNode }> = ({ cx, y, w, d, h = 40, rug = 0, moj = 0, brillo = 0, t = 0, seed = 1, children }) => {
  const f = mkF(cx, y, w, d), [a, b] = [f(0, 1), f(1, 1)];
  const top = rug > 0.5 ? CONTRA : CARP;
  return (
    <g>
      <polygon points={quad(f, 0, 0, 1, 1)} fill={top} />
      <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={h} fill={rug > 0.5 ? CONTRA2 : CARPM} />
      {rug > 0.02 && Array.from({ length: 90 }, (_, i) => { const [x, yy] = f(hash(i, 11 + seed), hash(i, 12 + seed)), r = 3 + 9 * hash(i, 13 + seed); return <ellipse key={i} cx={x} cy={yy} rx={r} ry={r * 0.6} fill={hash(i, 14) > 0.5 ? "#a3927a" : "#5a4c3b"} opacity={rug} />; })}
      {rug < 0.98 && Array.from({ length: 50 }, (_, i) => { const [x, yy] = f(hash(i, 21 + seed), hash(i, 22 + seed)); return <circle key={i} cx={x} cy={yy} r={1.2 + 1.5 * hash(i, 23)} fill="rgba(40,30,20,.18)" opacity={1 - rug} />; })}
      {moj > 0.02 && <polygon points={quad(f, 0, 0, 1, 1)} fill="#4f4a42" opacity={0.6 * moj} />}
      {brillo > 0.02 && <Reflejo f={f} k={brillo} t={t} />}
      {children?.(f)}
    </g>
  );
};
// la ventana del cuarto reflejada en el piso: un trapecio claro con la cruz del marco y un brillo que corre
export const Reflejo: React.FC<{ f: F; k: number; t: number; u0?: number; v0?: number }> = ({ f, k, t, u0 = 0.32, v0 = 0.12 }) => {
  const q = (u: number, v: number, uu: number, vv: number) => quad(f, u0 + u, v0 + v, u0 + uu, v0 + vv);
  const s = 0.5 + 0.5 * Math.sin(t * 0.7);
  return (
    <g opacity={k}>
      <polygon points={quad(f, 0, 0, 1, 1)} fill="#d8d3c9" opacity={0.25} />
      <polygon points={q(0, 0, 0.36, 0.5)} fill="#eaf3ff" opacity={0.55 + 0.1 * s} />
      <polygon points={q(0.17, 0, 0.19, 0.5)} fill="#7b7468" opacity={0.7} />
      <polygon points={q(0, 0.24, 0.36, 0.26)} fill="#7b7468" opacity={0.7} />
      <polygon points={q(-0.04, 0.5, 0.4, 0.62)} fill="#fff" opacity={0.12} />
    </g>
  );
};
// el CUARTO del fondo: pared, ventana con luz, zócalo. Va detrás del piso.
export const Cuarto: React.FC<{ x?: number; w?: number; y?: number; luz?: number }> = ({ x = 960, w = 1300, y = 110, luz = 1 }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={330} fill="#b9ad98" />
    <rect x={x - 170} y={y + 50} width={340} height={210} fill="#dfeeff" opacity={0.6 + 0.4 * luz} stroke="#f2ede3" strokeWidth={14} />
    <line x1={x} y1={y + 50} x2={x} y2={y + 260} stroke="#f2ede3" strokeWidth={10} />
    <line x1={x - 170} y1={y + 155} x2={x + 170} y2={y + 155} stroke="#f2ede3" strokeWidth={10} />
    <rect x={x - w / 2} y={y + 314} width={w} height={16} fill="#8a7a64" />
  </g>
);
// MANO plana (de arriba): palma + 4 dedos + pulgar; rot en grados
export const Mano: React.FC<{ x: number; y: number; rot?: number; s?: number; col?: string }> = ({ x, y, rot = 0, s = 1, col = "#d9a882" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-40} width={120} height={120} rx={46} fill={col} />
    {[-45, -15, 15, 45].map((dx, i) => <rect key={i} x={dx - 13} y={-130 + Math.abs(dx) * 0.6} width={26} height={100} rx={13} fill={col} />)}
    <rect x={52} y={-10} width={26} height={80} rx={13} fill={col} transform="rotate(-35 65 30)" />
    <rect x={-40} y={70} width={80} height={90} rx={20} fill="#3b6a8a" />
  </g>
);
// LLANA DE ACERO vista de arriba (rectángulo largo de metal con mango de madera) — distinta de la de madera
export const LlanaAcero: React.FC<{ x: number; y: number; rot?: number; s?: number; brillo?: number }> = ({ x, y, rot = 0, s = 1, brillo = 0.5 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-170} y={-55} width={340} height={110} rx={14} fill="#c6ccd2" stroke="#6f7780" strokeWidth={4} />
    <rect x={-160} y={-48} width={320} height={26} rx={10} fill="#eef3f7" opacity={brillo} />
    <rect x={-90} y={-14} width={180} height={28} rx={14} fill={MAD} stroke="#5e3a1c" strokeWidth={3} />
  </g>
);
// LLANA DE MADERA vista de arriba (fratás)
export const Fratas: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-60} width={300} height={120} rx={20} fill="#b88752" stroke="#6d4a26" strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={-140} y1={-36 + i * 24} x2={140} y2={-30 + i * 24} stroke="#8a5f33" strokeWidth={2} />)}
    <path d="M-70,0 Q0,-60 70,0" fill="none" stroke="#5e3a1c" strokeWidth={22} strokeLinecap="round" />
  </g>
);
// COLADOR de cocina con mango; caen granos grises abajo (k = cuánto cae)
export const Colador: React.FC<{ x: number; y: number; t: number; k: number; s?: number; rot?: number }> = ({ x, y, t, k, s = 1, rot = 0 }) => (
  <g>
    <g transform={`translate(${x},${y}) rotate(${rot + 6 * Math.sin(t * 9) * k}) scale(${s})`}>
      <rect x={110} y={-14} width={220} height={28} rx={14} fill="#3a3f45" />
      <ellipse cx={0} cy={0} rx={130} ry={44} fill="#9aa2a9" stroke="#5d646b" strokeWidth={6} />
      <path d="M-120,4 Q0,140 120,4" fill="#b8bfc5" stroke="#5d646b" strokeWidth={5} />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-90 + (i % 10) * 20} cy={30 + Math.floor(i / 10) * 22} r={3} fill="#4b5157" />)}
      <ellipse cx={0} cy={-4} rx={110} ry={30} fill="#d2cdc3" />
    </g>
    {k > 0.02 && Array.from({ length: 70 }, (_, i) => { const ph = (t * 0.9 + hash(i, 4)) % 1; return <circle key={i} cx={x + (hash(i, 5) - 0.5) * 220 * s + ph * 10} cy={y + 70 * s + ph * 320} r={2 + 2 * hash(i, 6)} fill="#ddd8ce" opacity={k * (1 - ph * 0.7)} />; })}
  </g>
);
// manguera de nivel transparente en U con el agua a la misma altura en las dos puntas (lvl px desde arriba)
export const MangueraU: React.FC<{ x0: number; x1: number; y: number; h0: number; h1: number; lvl: number; k: number }> = ({ x0, x1, y, h0, h1, lvl, k }) => {
  const d = `M${x0},${y - h0} L${x0},${y} Q${(x0 + x1) / 2},${y + 120} ${x1},${y} L${x1},${y - h1}`;
  return (
    <g opacity={k}>
      <path d={d} fill="none" stroke="rgba(214,240,255,.35)" strokeWidth={30} strokeLinecap="round" />
      <path d={`M${x0},${lvl} L${x0},${y} Q${(x0 + x1) / 2},${y + 120} ${x1},${y} L${x1},${lvl}`} fill="none" stroke={C.water} strokeWidth={18} strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgba(255,255,255,.4)" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
// pisada: suela de zapatilla de arriba con relieve de dibujo
export const Suela: React.FC<{ x: number; y: number; s?: number; rot?: number; col?: string; o?: number }> = ({ x, y, s = 1, rot = 0, col = "#3a3530", o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <path d="M-40,-120 Q0,-150 40,-120 Q55,-40 40,20 Q50,90 30,120 Q0,140 -30,120 Q-50,90 -40,20 Q-55,-40 -40,-120 Z" fill={col} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-30} y1={-100 + i * 26} x2={30} y2={-100 + i * 26} stroke="rgba(255,255,255,.15)" strokeWidth={6} />)}
  </g>
);
export const lerpCol = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b), c = A.map((x, i) => Math.round(lerp(x, B[i], cl(k))).toString(16).padStart(2, "0"));
  return "#" + c.join("");
};
export const ease = e;
