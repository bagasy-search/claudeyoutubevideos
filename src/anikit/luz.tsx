// Iluminación por capas, todo en SVG con transparencias (sin filtros CSS ni blend modes: el farm usa swangle).
// Orden típico dentro de una escena: set → Charco (piso) → actores → Cono/Haces/Polvo (aire) → Halo (fuentes).
import React, { useId } from "react";
import { random } from "remotion";

const uid = () => useId().replace(/[^a-zA-Z0-9]/g, "");

// resplandor redondo (la bombita, el sol, una ventana encendida)
export const Halo: React.FC<{ x: number; y: number; r: number; color: string; fuerza?: number }> = ({ x, y, r, color, fuerza = 0.6 }) => {
  const id = uid();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={fuerza} />
          <stop offset="0.25" stopColor={color} stopOpacity={fuerza * 0.45} />
          <stop offset="0.6" stopColor={color} stopOpacity={fuerza * 0.12} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </g>
  );
};

// cono de lámpara / farol: trapecio que se desvanece hacia abajo
export const Cono: React.FC<{ x: number; y: number; alto: number; ancho: number; boca?: number; color: string; fuerza?: number; ang?: number }> = ({ x, y, alto, ancho, boca = 30, color, fuerza = 0.28, ang = 0 }) => {
  const id = uid();
  return (
    <g transform={`translate(${x},${y}) rotate(${ang})`}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={fuerza} />
          <stop offset="0.7" stopColor={color} stopOpacity={fuerza * 0.35} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={id + "h"} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={1} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={id + "m"}><rect x={-ancho / 2} y={0} width={ancho} height={alto} fill={`url(#${id}h)`} /></mask>
      </defs>
      <path d={`M${-boca / 2},0 L${boca / 2},0 L${ancho / 2},${alto} L${-ancho / 2},${alto} Z`} fill={`url(#${id})`} mask={`url(#${id}m)`} />
      <path d={`M${-boca / 4},0 L${boca / 4},0 L${ancho / 4},${alto} L${-ancho / 4},${alto} Z`} fill={`url(#${id})`} mask={`url(#${id}m)`} opacity={0.8} />
    </g>
  );
};

// charco de luz en el piso (elipse) — es lo que "apoya" a los personajes en la luz
export const Charco: React.FC<{ x: number; y: number; rx: number; ry?: number; color: string; fuerza?: number }> = ({ x, y, rx, ry, color, fuerza = 0.45 }) => {
  const id = uid();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={fuerza} />
          <stop offset="0.55" stopColor={color} stopOpacity={fuerza * 0.55} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx * 0.16} fill={`url(#${id})`} />
    </g>
  );
};

// haces de luz diagonales (ventana al atardecer, sol entre árboles): titilan muy lento
export const Haces: React.FC<{ x: number; y: number; ang?: number; largo?: number; n?: number; ancho?: number; color: string; fuerza?: number; f: number; seed?: number }> = ({ x, y, ang = 28, largo = 1100, n = 5, ancho = 70, color, fuerza = 0.18, f, seed = 1 }) => {
  const id = uid();
  return (
    <g transform={`translate(${x},${y}) rotate(${ang})`}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={1} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {Array.from({ length: n }).map((_, i) => {
        const w = ancho * (0.5 + random(`h${seed}${i}`) * 0.9);
        const dx = (i - (n - 1) / 2) * ancho * 1.25 + random(`hx${seed}${i}`) * 30;
        const o = fuerza * (0.55 + 0.45 * Math.sin(f / 40 + i * 1.7 + seed));
        // 3 pasadas de ancho decreciente: el borde del haz queda suave (sin filtros)
        return <g key={i}>{[1, 0.68, 0.36].map((k) => { const ww = w * k, cx = dx + w * 0.6 * (1 - k) * 0; return <path key={k} d={`M${cx - ww / 2},0 L${cx + ww / 2},0 L${cx + ww * 1.6 + (w - ww) * 0.55},${largo} L${cx - ww * 0.4 + (w - ww) * 0.55},${largo} Z`} fill={`url(#${id})`} opacity={o / 2.2} />; })}</g>;
      })}
    </g>
  );
};

// polvo / motas flotando en la luz (Awaken las tiene en casi todo plano cálido)
export const Polvo: React.FC<{ x: number; y: number; w: number; h: number; n?: number; color?: string; f: number; seed?: number; tam?: number }> = ({ x, y, w, h, n = 40, color = "#fff3d6", f, seed = 0, tam = 2.4 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: string) => random(`p${seed}${k}${i}`);
      const px = x + ((r("x") * w + f * (0.15 + r("v") * 0.35)) % w);
      const py = y + ((r("y") * h - f * (0.08 + r("u") * 0.22) + h * 10) % h);
      const o = 0.25 + 0.55 * Math.abs(Math.sin(f / (25 + r("t") * 40) + i));
      return <circle key={i} cx={px + Math.sin(f / 30 + i) * 6} cy={py} r={tam * (0.5 + r("s"))} fill={color} opacity={o} />;
    })}
  </g>
);

// luz de lámpara colgante completa: cable, pantalla, bombita, cono y charco
export const LamparaColgante: React.FC<{ x: number; y: number; piso: number; color?: string; pantalla?: string; fuerza?: number; techo?: number; f?: number; parpadeo?: boolean }> = ({ x, y, piso, color = "#ffcf7a", pantalla = "#e3a531", fuerza = 1, techo = -100, f = 0, parpadeo }) => {
  const fl = parpadeo ? (random(`fl${Math.floor(f / 3)}`) > 0.93 ? 0.45 : 1) : 1;
  const k = fuerza * fl;
  return (
    <g>
      <line x1={x} y1={techo} x2={x} y2={y - 22} stroke="#14100e" strokeWidth={3} />
      <Halo x={x} y={y + 6} r={260} color={color} fuerza={0.35 * k} />
      <Cono x={x} y={y + 4} alto={piso - y} ancho={(piso - y) * 1.15} boca={70} color={color} fuerza={0.22 * k} />
      <path d={`M${x - 40},${y + 4} Q${x - 36},${y - 22} ${x},${y - 24} Q${x + 36},${y - 22} ${x + 40},${y + 4} Z`} fill={pantalla} />
      <path d={`M${x - 40},${y + 4} L${x + 40},${y + 4}`} stroke="#fff2c8" strokeWidth={3} opacity={0.8 * k} />
      <ellipse cx={x} cy={y + 6} rx={14} ry={7} fill="#fff6dc" opacity={k} />
      <Charco x={x} y={piso} rx={(piso - y) * 0.55} color={color} fuerza={0.4 * k} />
    </g>
  );
};

// farol de calle: poste curvo + cabezal + cono + charco
export const Farol: React.FC<{ x: number; piso: number; alto?: number; color?: string; lado?: 1 | -1; fuerza?: number }> = ({ x, piso, alto = 520, color = "#ffe2a8", lado = 1, fuerza = 1 }) => {
  const top = piso - alto;
  const hx = x + lado * 70;
  return (
    <g>
      <rect x={x - 7} y={top + 20} width={14} height={alto - 20} fill="#2a2a33" />
      <rect x={x - 12} y={piso - 30} width={24} height={30} rx={4} fill="#22222a" />
      <path d={`M${x},${top + 30} Q${x},${top} ${hx},${top + 8}`} stroke="#2a2a33" strokeWidth={10} fill="none" />
      <Halo x={hx} y={top + 20} r={340} color={color} fuerza={0.7 * fuerza} />
      <Cono x={hx} y={top + 22} alto={alto - 22} ancho={alto * 0.95} boca={40} color={color} fuerza={0.36 * fuerza} />
      <path d={`M${hx - 26},${top + 22} L${hx + 26},${top + 22} L${hx + 18},${top + 6} L${hx - 18},${top + 6} Z`} fill="#33333d" />
      <ellipse cx={hx} cy={top + 23} rx={20} ry={5} fill="#fff7e0" opacity={fuerza} />
      <Charco x={hx} y={piso + 10} rx={alto * 0.48} color={color} fuerza={0.42 * fuerza} />
    </g>
  );
};

// lluvia: líneas finas inclinadas en dos profundidades
export const Lluvia: React.FC<{ f: number; w?: number; h?: number; n?: number; color?: string; seed?: number; x0?: number; largo?: number }> = ({ f, w = 1920, h = 1080, n = 140, color = "#c9d3e0", seed = 0, x0 = 0, largo = 1 }) => (
  <g opacity={0.8}>
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: string) => random(`ll${seed}${k}${i}`);
      const vel = 26 + r("v") * 18;
      const L = (22 + r("l") * 30) * largo;
      const x = x0 + r("x") * w;
      const y = ((r("y") * h + f * vel) % (h + 80)) - 40;
      return <line key={i} x1={x} y1={y} x2={x - L * 0.12} y2={y + L} stroke={color} strokeWidth={1 + r("w") * 1.3} opacity={0.35 + r("o") * 0.5} strokeLinecap="round" />;
    })}
  </g>
);
