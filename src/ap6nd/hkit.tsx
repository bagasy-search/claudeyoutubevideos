// hkit — los rivales de ap6nb: humanos de otras especies dibujados por código, en silueta con volumen y sin rasgos reconocibles.
// Todo sale de useCurrentFrame(); x,y = pie de la figura, coordenadas 1920×1080.
import React from "react";

export type Herr = "lasca" | "lanza" | "hacha" | "lanzadardos" | undefined;
export const Rival: React.FC<{ x: number; y: number; s?: number; h?: number; w?: number; c?: string; brow?: number; arm?: number; crest?: boolean; lean?: number; swing?: number; flip?: boolean; tool?: Herr; raise?: number; op?: number }> = ({ x, y, s = 1, h = 1, w = 1, c = "#7a5233", brow = 0.5, arm = 1, crest, lean = 0, swing = 0, flip, tool, raise = 0, op = 1 }) => {
  const L = 95 * h, T = 78 * h, hy = -(L + T + 20 * h), sw = Math.sin(swing) * 20;
  const shade = "rgba(0,0,0,.28)", g = 26 * w, al = 88 * arm * h, ax = 14 + raise * 40, ay = -(L + T - 8) + al * (1 - raise * 1.7);
  return (
    <g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * s},${s})`} opacity={op}>
      <g transform={`rotate(${lean})`}>
        <path d={`M-6,${-L} L${-14 + sw * 0.5},${-L * 0.5} L${-16 + sw},-2`} stroke={c} strokeWidth={17 * w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={`M-16,${-L} L${-24 - sw * 0.5},${-L * 0.5} L${-26 - sw},-2`} stroke={shade} strokeWidth={17 * w} strokeLinecap="round" fill="none" />
        <path d={`M-10,${-L} L${10 - sw * 0.5},${-L * 0.5} L${12 - sw},-2`} stroke={c} strokeWidth={17 * w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x={-g} y={-(L + T)} width={g * 2} height={T + 8} rx={g * 0.72} fill={c} />
        <rect x={-g} y={-(L + T)} width={g * 0.8} height={T + 8} rx={g * 0.4} fill={shade} />
        <ellipse cx={8} cy={hy} rx={20 * h} ry={22 * h} fill={c} />
        <path d={`M${-12 * h},${hy - 16 * h} Q${6 * h},${hy - 34 * h} ${26 * h},${hy - 12 * h} L${28 * h},${hy - 4 * h} L${-12 * h},${hy - 6 * h} Z`} fill="#231610" />
        {crest && <path d={`M${-10 * h},${hy - 18 * h} Q${6 * h},${hy - 46 * h} ${22 * h},${hy - 20 * h}`} stroke="#231610" strokeWidth={7} fill="none" />}
        <rect x={6 * h} y={hy - 6 * h} width={24 * h} height={(3 + 7 * brow) * h} rx={3} fill="#1c120c" />
        <path d={`M16,${-(L + T - 8)} L${ax},${-(L + T - 8) + al * 0.5 * (1 - raise)} L${ax + 8},${ay}`} stroke={c} strokeWidth={14 * w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {tool === "lasca" && <path d={`M${ax + 2},${ay - 2} l26,-14 l8,24 l-24,8 Z`} fill="#b8b2a4" stroke="#5f5a50" strokeWidth={3} />}
        {tool === "hacha" && <path d={`M${ax - 2},${ay - 14} q24,-6 36,20 q-16,28 -38,18 Z`} fill="#a79c86" stroke="#5a5244" strokeWidth={3} />}
        {tool === "lanza" && <g transform={`translate(${ax + 8},${ay}) rotate(-78)`}><rect x={-170} y={-4} width={300} height={8} rx={4} fill="#8a6a42" /><path d="M130,-6 L176,0 L130,6 Z" fill="#6b5233" /></g>}
        {tool === "lanzadardos" && <g transform={`translate(${ax + 8},${ay}) rotate(-58)`}><rect x={0} y={-3} width={92} height={6} rx={3} fill="#c2a06a" /><rect x={86} y={-120} width={5} height={250} fill="#9a7a4a" /><path d="M86,-138 l3,-22 l3,22 Z" fill="#6a665c" /></g>}
      </g>
    </g>
  );
};
// fragmento de hueso fósil (color crema) con grietas
export const Fosil: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; curve?: number; c?: string }> = ({ x, y, w = 120, h = 34, rot = 0, curve = 0, c = "#c9b184" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <path d={`M${-w / 2},${-h * 0.42} Q0,${-h * 0.42 - curve} ${w / 2},${-h * 0.42} q${h * 0.42},${h * 0.42} 0,${h * 0.84} Q0,${h * 0.42 - curve} ${-w / 2},${h * 0.42} q${-h * 0.42},${-h * 0.42} 0,${-h * 0.84} Z`} fill={c} stroke="#6d5a39" strokeWidth={3} />
    <path d={`M${-w * 0.2},${-h * 0.28} l${w * 0.08},${h * 0.2} l${-w * 0.03},${h * 0.2}`} stroke="#7f6a45" strokeWidth={2} fill="none" />
  </g>
);
// piedra tallada vista de cerca
export const Lasca: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, glow = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-110,40 L-40,-58 L92,-30 L120,26 L-20,62 Z" fill="#aaa294" stroke="#5a5448" strokeWidth={4} />
    <path d="M-40,-58 L-8,10 L92,-30 M-8,10 L-20,62 M-8,10 L120,26" stroke="rgba(60,55,45,.55)" strokeWidth={3} fill="none" />
    <path d="M-110,40 L-20,62 L120,26" stroke="#fff6dc" strokeWidth={4 + 5 * glow} opacity={0.2 + 0.8 * glow} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${14 * glow}px #ffe9b0)` }} />
  </g>
);
