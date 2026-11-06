// fb5nb · PIEZAS CON CUERPO del yesonato: la losa del piso en perspectiva (trapecio con frente), el piso EN CORTE por capas
// (contrapiso con piedritas, imprimación lechosa, yeso, sellador que brilla), el balde en corte, el brillo que corre,
// la regla, la llana, la moneda y la lija. Todo f(t); el relieve y la sombra los pone kit.Svg.
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export const CONT = "#8f8a80", CONT2 = "#67625a", YESO = "#f1ebdf", YESOH = "#c9c1b1", IMPR = "rgba(246,243,232,.55)", SELL = "rgba(255,238,200,.38)", ARENA = "#d9c49a", GRIS = "#c9cbcc", COLA = "#f6f3ea", MAD = "#9a6233";

// punto sobre una losa trapecial: u 0..1 a lo ancho, v 0..1 de atrás (arriba) hacia adelante
export const mkF = (cx: number, y: number, w: number, d: number, back = 0.68) => (u: number, v: number): [number, number] => {
  const hw = lerp(back, 1, v) * w / 2;
  return [cx + (u - 0.5) * 2 * hw, y + v * d];
};
export const quad = (f: (u: number, v: number) => [number, number], u0: number, v0: number, u1: number, v1: number) =>
  [f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)].map((p) => p.join(",")).join(" ");

// la losa: cara de arriba (top) + frente (canto). children se dibujan encima, con f() para ubicar cosas en el piso
export const Losa: React.FC<{ cx: number; y: number; w: number; d: number; h?: number; top?: string; side?: string; children?: (f: (u: number, v: number) => [number, number]) => React.ReactNode }> = ({ cx, y, w, d, h = 46, top = CONT, side = CONT2, children }) => {
  const f = mkF(cx, y, w, d);
  const [a, b] = [f(0, 1), f(1, 1)];
  return (
    <g>
      <polygon points={quad(f, 0, 0, 1, 1)} fill={top} />
      <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={h} fill={side} />
      {Array.from({ length: 60 }, (_, i) => { const [x, yy] = f(hash(i, 11), hash(i, 12)); return <circle key={i} cx={x} cy={yy} r={1.5 + 2.5 * hash(i, 13)} fill="rgba(40,36,30,.18)" />; })}
      {children?.(f)}
    </g>
  );
};

// brillo diagonal que barre un polígono (el «espejo de agua»)
export const Brillo: React.FC<{ id: string; pts: string; k: number; o?: number; w?: number }> = ({ id, pts, k, o = 0.55, w = 220 }) => {
  if (o <= 0.01) return null;
  const x = lerp(-400, 2300, cl(k));
  return (
    <g>
      <defs>
        <clipPath id={`br${id}`}><polygon points={pts} /></clipPath>
        <linearGradient id={`bg${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} /><stop offset=".5" stopColor="#fffaf0" stopOpacity={o} /><stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#br${id})`}><polygon points={`${x},0 ${x + w},0 ${x + w - 500},1080 ${x - 500},1080`} fill={`url(#bg${id})`} /></g>
    </g>
  );
};

// el piso EN CORTE: capas de abajo hacia arriba desde la línea `y` (base). Cada capa {h, k (0..1 cuánto llegó), tipo}
export type Capa = { h: number; k: number; tipo: "tierra" | "cont" | "impr" | "yeso" | "sell" | "cer"; col?: string; moj?: number };
export const Capas: React.FC<{ x: number; y: number; w: number; capas: Capa[]; seed?: number }> = ({ x, y, w, capas, seed = 1 }) => {
  let base = y;
  return (
    <g>
      {capas.map((c, i) => {
        const h = c.h * cl(c.k), top = base - h; base = top;
        if (h < 0.5) return null;
        const col = c.col ?? (c.tipo === "tierra" ? "#5b3c24" : c.tipo === "cont" ? CONT : c.tipo === "impr" ? "#f3efe4" : c.tipo === "yeso" ? YESO : c.tipo === "cer" ? "#8a4b2a" : "#ffe9b8");
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={h} fill={col} opacity={c.tipo === "sell" ? 0.55 : c.tipo === "impr" ? 0.8 : 1} />
            {c.tipo === "yeso" && (c.moj ?? 0) > 0 && <rect x={x} y={top} width={w} height={h} fill="#7d8a96" opacity={0.45 * (c.moj ?? 0)} />}
            {(c.tipo === "cont" || c.tipo === "tierra") && Array.from({ length: Math.round(w / 26) }, (_, j) => (
              <ellipse key={j} cx={x + hash(j, seed + i) * w} cy={top + (0.15 + 0.7 * hash(j, seed + i + 9)) * h} rx={4 + 7 * hash(j, seed + 3)} ry={3 + 4 * hash(j, seed + 4)} fill={c.tipo === "tierra" ? "#3e2816" : "#6c675e"} />
            ))}
            {c.tipo === "sell" && <rect x={x} y={top} width={w} height={Math.min(4, h)} fill="#fffaf0" opacity={0.85} />}
            {c.tipo === "cer" && Array.from({ length: Math.floor(w / 160) }, (_, j) => <rect key={j} x={x + 160 * (j + 1) - 3} y={top} width={6} height={h} fill="#4a3220" />)}
          </g>
        );
      })}
    </g>
  );
};

// balde en corte: nivel lvl 0..1, color del líquido, grumos/islita opcionales
export const Balde: React.FC<{ x: number; y: number; s?: number; lvl: number; liq?: string; crema?: number; children?: React.ReactNode }> = ({ x, y, s = 1, lvl, liq = "#cfe8f6", crema = 0, children }) => {
  const W = 300 * s, H = 340 * s, top = y - H, ly = y - H * 0.92 * cl(lvl);
  const xl = (yy: number) => x - lerp(W * 0.42, W * 0.5, (y - yy) / H), xr = (yy: number) => x + lerp(W * 0.42, W * 0.5, (y - yy) / H);
  return (
    <g>
      <path d={`M${x - W * 0.5},${top} Q${x},${top - 150 * s} ${x + W * 0.5},${top}`} fill="none" stroke="#5e5547" strokeWidth={7 * s} />
      <polygon points={`${x - W * 0.5},${top} ${x + W * 0.5},${top} ${x + W * 0.42},${y} ${x - W * 0.42},${y}`} fill="#e8e3d8" opacity={0.35} stroke="#f6f1e6" strokeWidth={6 * s} />
      {lvl > 0.01 && <polygon points={`${xl(ly)},${ly} ${xr(ly)},${ly} ${x + W * 0.42},${y} ${x - W * 0.42},${y}`} fill={liq} opacity={0.92} />}
      {lvl > 0.01 && <ellipse cx={x} cy={ly} rx={(xr(ly) - xl(ly)) / 2} ry={14 * s} fill={liq} stroke="rgba(255,255,255,.6)" strokeWidth={3} />}
      {crema > 0 && <ellipse cx={x} cy={ly} rx={(xr(ly) - xl(ly)) / 2 * 0.98} ry={14 * s} fill={YESO} opacity={crema} />}
      {children}
      <rect x={x - W * 0.5 - 6} y={top - 8} width={W + 12} height={16 * s} rx={8} fill="#d9d3c6" />
    </g>
  );
};

// regla de aluminio (vista desde arriba, girable) · llana · moneda · taco de lija
export const Regla: React.FC<{ x: number; y: number; l?: number; rot?: number }> = ({ x, y, l = 700, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-l / 2} y={-16} width={l} height={32} rx={4} fill="#c8ccd0" stroke="#7d848c" strokeWidth={3} />
    <rect x={-l / 2} y={-16} width={l} height={8} fill="#eef2f5" />
  </g>
);
export const Llana: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-150,0 L130,0 Q160,0 160,-20 L160,-26 L-150,-26 Z" fill="#cfd5da" stroke="#6f7780" strokeWidth={3} />
    <rect x={-60} y={-56} width={120} height={30} rx={6} fill={MAD} />
    <rect x={-20} y={-90} width={40} height={40} rx={10} fill="#5e3a1c" />
  </g>
);
export const Moneda: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 60, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <ellipse rx={r} ry={r * 0.28} cy={10} fill="#8a6a2c" />
    <ellipse rx={r} ry={r * 0.28} fill="#e5c060" stroke="#a8842e" strokeWidth={4} />
    <ellipse rx={r * 0.7} ry={r * 0.19} fill="none" stroke="#a8842e" strokeWidth={3} />
  </g>
);
export const Lija: React.FC<{ x: number; y: number; g: number; col?: string; s?: number }> = ({ x, y, g, col = "#c7884a", s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-70} width={220} height={140} rx={10} fill={col} />
    {Array.from({ length: Math.round(220 - g / 1.6) }, (_, i) => <circle key={i} cx={-100 + 200 * hash(i, g)} cy={-60 + 120 * hash(i, g + 1)} r={Math.max(0.8, 5 - g / 55)} fill="rgba(40,24,10,.45)" />)}
    <text y={14} textAnchor="middle" fontSize={56} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">{g}</text>
  </g>
);
// bolsa de yeso (40 kg) con etiqueta
export const Bolsa: React.FC<{ x: number; y: number; s?: number; txt?: string; col?: string }> = ({ x, y, s = 1, txt = "YESO", col = "#f2efe6" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,-170 Q-130,-180 -110,-190 L110,-190 Q130,-180 120,-170 L130,140 Q130,160 110,160 L-110,160 Q-130,160 -130,140 Z" fill={col} stroke="#b7ad98" strokeWidth={4} />
    <rect x={-95} y={-60} width={190} height={90} rx={8} fill="#2f5f8a" />
    <text y={4} textAnchor="middle" fontSize={50} fontWeight={800} fill="#fff" fontFamily="Barlow Condensed">{txt}</text>
    <text y={110} textAnchor="middle" fontSize={34} fontWeight={700} fill="#6c6555" fontFamily="Barlow">40 KG</text>
  </g>
);
// bidón de cola vinílica
export const Bidon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-90} y={-160} width={180} height={240} rx={24} fill="#f8f6f0" stroke="#b9b2a2" strokeWidth={4} />
    <rect x={-30} y={-195} width={60} height={40} rx={8} fill="#d8352a" />
    <path d="M40,-150 Q110,-150 110,-60 L110,-20" fill="none" stroke="#b9b2a2" strokeWidth={14} />
    <rect x={-70} y={-90} width={140} height={80} rx={8} fill="#f0a93a" />
    <text y={-36} textAnchor="middle" fontSize={40} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">COLA</text>
  </g>
);
// gota de agua en bolita sobre el piso sellado (o que se mete si no está sellado)
export const Gotita: React.FC<{ x: number; y: number; r?: number; ent?: number }> = ({ x, y, r = 40, ent = 0 }) => (
  <g>
    <ellipse cx={x} cy={y + r * 0.2} rx={r * (1 + ent)} ry={r * 0.25 * (1 + ent)} fill="rgba(60,70,80,.35)" />
    <ellipse cx={x} cy={y - r * 0.35 * (1 - ent)} rx={r * (1 + 0.6 * ent)} ry={r * 0.6 * (1 - 0.85 * ent)} fill="rgba(140,205,255,.75)" />
    <ellipse cx={x - r * 0.35} cy={y - r * 0.6 * (1 - ent)} rx={r * 0.25} ry={r * 0.12} fill="#fff" opacity={0.8 * (1 - ent)} />
  </g>
);
