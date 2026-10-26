import React from "react";
import { AbsoluteFill } from "remotion";
import { rnd } from "../soot/lib";
import { prog } from "./kit";

// CUADRO 0 = la miniatura de soot12 sin texto ni flecha, rehecha en código (D:/rtmp/soot_ola/minis/soot12_elegida.png),
// con su NIVEL DE DETALLE: luz cálida del fuego contra la noche azul, madera con veta, piel y paja con hebras, anatomía
// completa (vos agachado con el cuchillo, el perro de presa con collar de pinchos, el vikingo con UN ojo abierto y el hacha).
// Desde el cuadro 0 cobra vida: llamas, chispas y humo, el perro ladra, el segundo ojo se abre y la cámara empuja hacia vos.
const T = "#1a0e14"; // tinta
const PIEL = "#f4bf94", PIEL2 = "#d9926a";

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="pc_cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050a2e" /><stop offset="0.45" stopColor="#13246a" /><stop offset="0.75" stopColor="#24409a" /><stop offset="1" stopColor="#0d1638" /></linearGradient>
    <radialGradient id="pc_luna"><stop offset="0" stopColor="#ffffff" /><stop offset="0.35" stopColor="#dfe8ff" stopOpacity={0.9} /><stop offset="1" stopColor="#6a8ae0" stopOpacity={0} /></radialGradient>
    <linearGradient id="pc_rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a3f9a" /><stop offset="1" stopColor="#0b1a4a" /></linearGradient>
    <radialGradient id="pc_suelo" cx="0.52" cy="0.25" r="0.75"><stop offset="0" stopColor="#f0a24a" /><stop offset="0.3" stopColor="#b8642c" /><stop offset="0.62" stopColor="#5a2e1e" /><stop offset="1" stopColor="#140c18" /></radialGradient>
    <linearGradient id="pc_tela" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6d090" /><stop offset="0.6" stopColor="#e0a462" /><stop offset="1" stopColor="#9a6436" /></linearGradient>
    <linearGradient id="pc_tela2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e0a060" /><stop offset="0.6" stopColor="#a8683a" /><stop offset="1" stopColor="#5a3420" /></linearGradient>
    <linearGradient id="pc_madera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2814" /><stop offset="0.45" stopColor="#8a4e22" /><stop offset="0.8" stopColor="#c27a34" /><stop offset="1" stopColor="#ffb25a" /></linearGradient>
    <linearGradient id="pc_metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8dce6" /><stop offset="0.5" stopColor="#8a8e9e" /><stop offset="1" stopColor="#4a4c5a" /></linearGradient>
    <linearGradient id="pc_casco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a4e5e" /><stop offset="0.5" stopColor="#8e94a6" /><stop offset="0.85" stopColor="#d8b078" /><stop offset="1" stopColor="#ffcf8a" /></linearGradient>
    <linearGradient id="pc_paja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d08a" /><stop offset="0.5" stopColor="#c8904a" /><stop offset="1" stopColor="#6a4224" /></linearGradient>
    <linearGradient id="pc_capa" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a6040" /><stop offset="0.6" stopColor="#4a3020" /><stop offset="1" stopColor="#1e1410" /></linearGradient>
    <linearGradient id="pc_perro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a3a34" /><stop offset="0.5" stopColor="#2a201e" /><stop offset="1" stopColor="#120c0c" /></linearGradient>
    <radialGradient id="pc_glow"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.9} /><stop offset="0.4" stopColor="#ff8a2a" stopOpacity={0.35} /><stop offset="1" stopColor="#ff6a1a" stopOpacity={0} /></radialGradient>
    <radialGradient id="pc_glowT"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.8} /><stop offset="1" stopColor="#ff7a1a" stopOpacity={0} /></radialGradient>
    <linearGradient id="pc_roca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c86a2e" /><stop offset="0.25" stopColor="#4a2a22" /><stop offset="1" stopColor="#120c14" /></linearGradient>
    <linearGradient id="pc_rocaF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4a78" /><stop offset="0.3" stopColor="#1a2038" /><stop offset="1" stopColor="#080a14" /></linearGradient>
    <linearGradient id="pc_frio" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1a2a8a" stopOpacity={0.35} /><stop offset="0.35" stopColor="#1a2a8a" stopOpacity={0} /></linearGradient>
    <linearGradient id="pc_piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0610" stopOpacity={0} /><stop offset="1" stopColor="#0a0610" stopOpacity={0.6} /></linearGradient>
    <radialGradient id="pc_calor"><stop offset="0" stopColor="#ff9a3a" stopOpacity={0.35} /><stop offset="1" stopColor="#ff6a1a" stopOpacity={0} /></radialGradient>
    <radialGradient id="pc_vin" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#05030a" stopOpacity={0.55} /></radialGradient>
  </defs>
);

// llama con 3 capas que se mueve sola
const Llama: React.FC<{ x: number; y: number; h: number; w: number; t: number; seed: number }> = ({ x, y, h, w, t, seed }) => {
  const r = rnd(seed);
  const n = 5;
  const fs = Array.from({ length: n }, () => [r(), r(), r()]);
  return (
    <g transform={`translate(${x} ${y})`}>
      {fs.map(([a, b, c], i) => {
        const fx = -w / 2 + (i + 0.5) * (w / n);
        const hh = h * (0.55 + a * 0.45 + 0.12 * Math.sin(t * (10 + b * 6) + i * 2)) * (1 - Math.abs(fx) / w);
        const ww = (w / n) * 1.5;
        const sw = Math.sin(t * 8 + c * 6) * ww * 0.35;
        return (
          <g key={i}>
            <path d={`M ${fx - ww / 2} 0 Q ${fx - ww / 2} ${-hh * 0.55} ${fx + sw} ${-hh} Q ${fx + ww / 2} ${-hh * 0.55} ${fx + ww / 2} 0 Z`} fill="#ff4a1a" opacity={0.9} />
            <path d={`M ${fx - ww / 3} 0 Q ${fx - ww / 3} ${-hh * 0.45} ${fx + sw * 0.7} ${-hh * 0.75} Q ${fx + ww / 3} ${-hh * 0.45} ${fx + ww / 3} 0 Z`} fill="#ffa21a" />
            <path d={`M ${fx - ww / 6} 0 Q ${fx - ww / 6} ${-hh * 0.3} ${fx + sw * 0.4} ${-hh * 0.45} Q ${fx + ww / 6} ${-hh * 0.3} ${fx + ww / 6} 0 Z`} fill="#fff4b0" />
          </g>
        );
      })}
    </g>
  );
};

const Antorcha: React.FC<{ x: number; y: number; s: number; t: number; seed: number }> = ({ x, y, s, t, seed }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-10} r={150} fill="url(#pc_glowT)" opacity={0.7 + 0.15 * Math.sin(t * 9 + seed)} />
    <rect x={-9} y={0} width={18} height={420} fill="url(#pc_madera)" stroke={T} strokeWidth={4} />
    <path d="M -26 -10 L 26 -10 L 18 30 L -18 30 Z" fill="#3a2a22" stroke={T} strokeWidth={4} />
    <path d="M -24 4 L 24 4 M -22 18 L 22 18" stroke="#6a5a4a" strokeWidth={3} />
    <Llama x={0} y={-8} h={110} w={46} t={t} seed={seed} />
  </g>
);

// escudo redondo: 8 gajos rojo/crema, borde de cuero, umbo de hierro, luz del fuego de un lado
const Escudo: React.FC<{ x: number; y: number; r: number; luz?: number }> = ({ x, y, r, luz = 0.6 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#3a1e14" stroke={T} strokeWidth={r * 0.06} />
    {Array.from({ length: 8 }, (_, i) => {
      const a0 = (i / 8) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2, rr = r * 0.9;
      return <path key={i} d={`M 0 0 L ${Math.cos(a0) * rr} ${Math.sin(a0) * rr} A ${rr} ${rr} 0 0 1 ${Math.cos(a1) * rr} ${Math.sin(a1) * rr} Z`} fill={i % 2 ? "#f0dcc0" : "#c42a24"} />;
    })}
    <circle r={r * 0.9} fill="none" stroke="#5a2e1a" strokeWidth={r * 0.05} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={Math.cos(i / 12 * 6.28) * r * 0.95} cy={Math.sin(i / 12 * 6.28) * r * 0.95} r={r * 0.025} fill="#c8b8a0" />)}
    <path d={`M ${-r * 0.9} 0 A ${r * 0.9} ${r * 0.9} 0 0 1 ${r * 0.2} ${-r * 0.88}`} stroke="#fff" strokeOpacity={0.12} strokeWidth={r * 0.18} fill="none" />
    <path d={`M ${r * 0.3} ${r * 0.85} A ${r * 0.9} ${r * 0.9} 0 0 0 ${r * 0.9} 0`} stroke="#ffb05a" strokeOpacity={luz * 0.5} strokeWidth={r * 0.1} fill="none" />
    <circle r={r * 0.22} fill="url(#pc_metal)" stroke={T} strokeWidth={r * 0.035} />
    <circle cx={-r * 0.06} cy={-r * 0.07} r={r * 0.07} fill="#fff" opacity={0.5} />
  </g>
);

// tienda de cumbrera en perspectiva: frente abierto (interior oscuro con brasa), techo lateral que se aleja, palos y sogas
const Tienda: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const dx = w * 0.55, dy = -w * 0.3;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M 0 ${-h} L ${dx} ${-h + dy} L ${w / 2 + dx} ${dy} L ${w / 2} 0 Z`} fill="url(#pc_tela2)" stroke={T} strokeWidth={3} />
      {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M ${dx * k} ${-h + dy * k} L ${w / 2 + dx * k} ${dy * k}`} stroke="#a0683a" strokeWidth={2} opacity={0.6} />)}
      <path d={`M ${-w / 2} 0 L 0 ${-h} L ${w / 2} 0 Z`} fill="url(#pc_tela)" stroke={T} strokeWidth={3} />
      <path d={`M ${-w * 0.3} 0 L 0 ${-h * 0.82} L ${w * 0.3} 0 Z`} fill="#2a140c" />
      <path d={`M ${-w * 0.22} 0 Q 0 ${-h * 0.5} ${w * 0.22} 0 Z`} fill="#c8601e" opacity={0.45} />
      <path d={`M ${-w * 0.3} 0 L 0 ${-h * 0.82} L ${-w * 0.36} ${-h * 0.05} Z`} fill="#f0c080" stroke={T} strokeWidth={2} />
      <path d={`M ${w * 0.3} 0 L 0 ${-h * 0.82} L ${w * 0.4} ${-h * 0.1} Z`} fill="#d89858" stroke={T} strokeWidth={2} />
      <path d={`M ${-w * 0.07} ${-h * 0.9} L ${w * 0.1} ${-h * 1.14} M ${w * 0.07} ${-h * 0.9} L ${-w * 0.1} ${-h * 1.14}`} stroke="#4a2a14" strokeWidth={Math.max(4, w * 0.03)} strokeLinecap="round" />
      <path d={`M ${dx - w * 0.07} ${-h + dy + h * 0.1} L ${dx + w * 0.1} ${-h + dy - h * 0.14} M ${dx + w * 0.07} ${-h + dy + h * 0.1} L ${dx - w * 0.1} ${-h + dy - h * 0.14}`} stroke="#4a2a14" strokeWidth={Math.max(3, w * 0.025)} strokeLinecap="round" />
      <path d={`M 0 ${-h} L ${-w * 0.75} ${h * 0.02} M ${w / 2 + dx} ${dy} L ${w * 1.25} ${h * 0.05}`} stroke="#d8b888" strokeWidth={1.5} opacity={0.6} />
    </g>
  );
};

// cabeza vikinga detallada: casco cónico con nasal y remaches, barba con hebras, cejas pobladas
const Vikingo: React.FC<{ x: number; y: number; s: number; ojoI: number; ojoD: number; mira: number; barba?: string }> = ({ x, y, s, ojoI, ojoD, mira, barba = "#b0552a" }) => {
  const b2 = "#6a2e14";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -112 0 Q -126 160 0 196 Q 126 160 112 0 Z" fill={barba} stroke={T} strokeWidth={6} />
      {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M ${-96 + i * 11} ${60 + (i % 3) * 8} q ${(i % 2 ? 6 : -6)} 50 ${(i % 2 ? -2 : 2)} ${90 - Math.abs(i - 9) * 7}`} stroke={b2} strokeWidth={3} fill="none" opacity={0.7} />)}
      <ellipse cx={-110} cy={4} rx={20} ry={28} fill={PIEL} stroke={T} strokeWidth={5} />
      <ellipse cx={110} cy={4} rx={20} ry={28} fill={PIEL2} stroke={T} strokeWidth={5} />
      <path d="M -100 -20 Q -104 90 0 104 Q 104 90 100 -20 Q 100 -90 0 -96 Q -100 -90 -100 -20 Z" fill={PIEL} stroke={T} strokeWidth={6} />
      <path d="M 40 -80 Q 104 -50 98 30 Q 80 80 40 96 Q 90 30 40 -80 Z" fill={PIEL2} opacity={0.5} />
      <ellipse cx={-60} cy={30} rx={20} ry={12} fill="#f08a7a" opacity={0.5} />
      <ellipse cx={60} cy={30} rx={20} ry={12} fill="#f08a7a" opacity={0.5} />
      {ojoI > 0.5 ? <><ellipse cx={-38} cy={-8} rx={30} ry={33} fill="#fff" stroke={T} strokeWidth={5} /><circle cx={-38 + mira * 10} cy={-6} r={15} fill={T} /><circle cx={-42 + mira * 10} cy={-11} r={5} fill="#fff" /></> : <path d="M -64 -4 Q -38 10 -12 -4" stroke={T} strokeWidth={6} fill="none" strokeLinecap="round" />}
      {ojoD > 0.5 ? <><ellipse cx={40} cy={-8} rx={32} ry={35} fill="#fff" stroke={T} strokeWidth={5} /><circle cx={40 + mira * 10} cy={-6} r={16} fill={T} /><circle cx={36 + mira * 10} cy={-12} r={5} fill="#fff" /></> : <path d="M 14 -4 Q 40 10 66 -4" stroke={T} strokeWidth={6} fill="none" strokeLinecap="round" />}
      <path d={`M -74 ${ojoI > 0.5 ? -52 : -38} Q -40 ${ojoI > 0.5 ? -60 : -30} -10 -36`} stroke={barba} strokeWidth={16} strokeLinecap="round" fill="none" />
      <path d={`M 10 -40 Q 44 ${ojoD > 0.5 ? -66 : -34} 78 ${ojoD > 0.5 ? -56 : -40}`} stroke={barba} strokeWidth={16} strokeLinecap="round" fill="none" />
      <path d="M -12 0 Q -26 44 -10 52 Q 10 60 22 46 Q 14 30 10 0" fill="#e8806a" stroke={T} strokeWidth={5} />
      <path d="M -86 62 Q -40 40 0 62 Q 40 40 86 62 Q 50 84 0 76 Q -50 84 -86 62 Z" fill={barba} stroke={T} strokeWidth={5} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${-76 + i * 20} 62 q 4 10 0 16`} stroke={b2} strokeWidth={3} fill="none" />)}
      <path d="M -26 104 Q 0 94 26 104" stroke={T} strokeWidth={5} fill="none" />
      {/* casco */}
      <path d="M -112 -34 Q -110 -168 0 -182 Q 110 -168 112 -34 Z" fill="url(#pc_casco)" stroke={T} strokeWidth={7} />
      <path d="M -70 -150 Q -20 -170 30 -160" stroke="#fff" strokeOpacity={0.35} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M 0 -182 L 0 -40" stroke="#5a5e6e" strokeWidth={8} />
      <rect x={-120} y={-52} width={240} height={30} rx={10} fill="url(#pc_casco)" stroke={T} strokeWidth={6} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-100 + i * 25} cy={-37} r={4} fill="#e8e0d0" stroke={T} strokeWidth={1.5} />)}
      <path d="M -12 -24 L 12 -24 L 10 34 Q 0 42 -10 34 Z" fill="url(#pc_metal)" stroke={T} strokeWidth={5} />
      <circle cx={0} cy={-184} r={8} fill="#9a9eae" stroke={T} strokeWidth={4} />
    </g>
  );
};

// hacha de barba en una mano cerrada
const Hacha: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-13} y={-170} width={26} height={330} rx={10} fill="url(#pc_madera)" stroke={T} strokeWidth={6} />
    {[-120, -60, 0, 60].map((k) => <path key={k} d={`M -10 ${k} q 10 14 20 4`} stroke="#4a2814" strokeWidth={2} fill="none" />)}
    <path d="M 10 -168 Q 120 -210 150 -110 Q 164 -30 134 30 Q 80 -40 10 -56 Z" fill="url(#pc_metal)" stroke={T} strokeWidth={7} strokeLinejoin="round" />
    <path d="M 130 -150 Q 160 -80 140 10" stroke="#fff" strokeOpacity={0.8} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 16 -150 L 40 -150 L 40 -70 L 16 -70" fill="#5a5e6e" stroke={T} strokeWidth={4} />
    <g transform="translate(0 60)">
      <path d="M -46 -30 Q -50 30 -10 40 Q 40 44 46 10 Q 48 -30 20 -36 Z" fill={PIEL} stroke={T} strokeWidth={6} />
      {[-24, -4, 16].map((k) => <path key={k} d={`M ${k} -34 q 6 10 4 26`} stroke={T} strokeWidth={4} fill="none" />)}
      <path d="M -46 -10 Q -64 -40 -40 -50 Q -20 -54 -10 -36" fill={PIEL} stroke={T} strokeWidth={6} />
    </g>
  </g>
);

// manta de piel/paja con hebras (el bulto donde duermen los vikingos)
const Manta: React.FC<{ d: string; seed: number; n: number; x0: number; x1: number; y0: number; y1: number }> = ({ d, seed, n, x0, x1, y0, y1 }) => {
  const r = rnd(seed);
  return (
    <g>
      <path d={d} fill="url(#pc_paja)" stroke={T} strokeWidth={5} />
      {Array.from({ length: n }, (_, i) => { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), a = (r() - 0.5) * 1.4, l = 14 + r() * 26; return <path key={i} d={`M ${x} ${y} q ${Math.sin(a) * l * 0.6} ${-l * 0.4} ${Math.sin(a) * l} ${-l}`} stroke={r() > 0.5 ? "#fff0c0" : "#8a5a2e"} strokeOpacity={0.55} strokeWidth={2.5} fill="none" />; })}
    </g>
  );
};

const Barril: React.FC<{ x: number; y: number; w: number; h: number; luz: number }> = ({ x, y, w, h, luz }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M ${-w / 2} ${-h / 2} Q ${-w / 2 - w * 0.09} 0 ${-w / 2} ${h / 2} L ${w / 2} ${h / 2} Q ${w / 2 + w * 0.09} 0 ${w / 2} ${-h / 2} Z`} fill="url(#pc_madera)" stroke={T} strokeWidth={7} />
    {Array.from({ length: 7 }, (_, i) => { const k = -w / 2 + (i + 1) * (w / 8); return <path key={i} d={`M ${k} ${-h / 2} Q ${k * 1.18} 0 ${k} ${h / 2}`} stroke="#3a1e0e" strokeWidth={3} fill="none" opacity={0.7} />; })}
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${-w / 2 + (i * 37) % w} ${-h / 2 + ((i * 53) % h)} q 6 20 0 40`} stroke="#5a3016" strokeWidth={2} fill="none" opacity={0.5} />)}
    {[-0.36, 0.0, 0.36].map((k, i) => <g key={i}><path d={`M ${-w / 2 - w * 0.06} ${k * h} Q 0 ${k * h + 16} ${w / 2 + w * 0.06} ${k * h}`} stroke="#2a2630" strokeWidth={22} fill="none" /><path d={`M ${w * 0.1} ${k * h + 2} Q ${w * 0.3} ${k * h + 4} ${w / 2 + w * 0.05} ${k * h - 4}`} stroke="#ffb05a" strokeOpacity={luz} strokeWidth={6} fill="none" />{[-0.4, -0.1, 0.2, 0.45].map((m) => <circle key={m} cx={m * w} cy={k * h + 8} r={4} fill="#8a8a9a" />)}</g>)}
    <ellipse cx={0} cy={-h / 2} rx={w / 2} ry={w * 0.1} fill="#6a3a1a" stroke={T} strokeWidth={6} />
    <path d={`M ${w / 2 - 6} ${-h / 2 + 10} Q ${w / 2 + w * 0.08} 0 ${w / 2 - 6} ${h / 2 - 10}`} stroke="#ffcf7a" strokeOpacity={luz} strokeWidth={10} fill="none" />
  </g>
);

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  const z = 1 + 0.16 * prog(t, 0.25, 1.6) ** 1.4;
  const abre = t > 0.85;
  const mira = t > 0.55 ? -1 : -0.7;
  const ladra = t > 0.4;
  const boca = ladra ? 10 + Math.abs(Math.sin(t * 11)) * 16 : 6;
  const r = rnd(77);
  const estrellas = Array.from({ length: 90 }, () => [r() * 1920, r() * 420, r()]);
  const tierra = Array.from({ length: 160 }, () => [r() * 1920, 700 + r() * 380, r()]);
  const chispas = Array.from({ length: 46 }, () => [r(), r(), r()]);
  // capa de piel: contorno en punta (mechones) alrededor del cuerpo agachado
  const capa = "M " + Array.from({ length: 49 }, (_, i) => {
    const a = 1.35 + (i / 48) * 3.75, rr = i % 2 ? 1 : 1.13;
    return `${310 + Math.cos(a) * 240 * rr} ${730 + Math.sin(a) * 180 * rr}`;
  }).join(" L ") + " Z";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#050a2e" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "760px 640px" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
          <Defs />
          {/* ── noche fría: cielo, nubes, estrellas, luna */}
          <rect width={1920} height={1080} fill="url(#pc_cielo)" />
          {estrellas.map(([x, y, k], i) => <circle key={i} cx={x} cy={y} r={k > 0.9 ? 2.6 : 1.4} fill="#e8eeff" opacity={0.35 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />)}
          <path d="M -40 230 Q 80 160 220 200 Q 300 140 420 190 Q 520 150 640 210 Q 560 250 380 240 Q 200 270 -40 260 Z" fill="#2a3e8a" opacity={0.75} />
          <path d="M -40 300 Q 120 250 260 300 Q 420 270 560 320 L 560 340 L -40 340 Z" fill="#1e2e70" opacity={0.7} />
          <circle cx={304} cy={367} r={120} fill="url(#pc_luna)" opacity={0.6} />
          <circle cx={304} cy={367} r={38} fill="#f6f8ff" />
          <path d="M 250 362 Q 300 352 362 368" stroke="#3a50a0" strokeWidth={9} fill="none" opacity={0.8} />
          {/* montañas y bosque lejano */}
          <path d="M -20 430 L 90 360 L 180 400 L 300 330 L 430 405 L 560 360 L 700 420 L 700 470 L -20 470 Z" fill="#18276a" />
          <path d="M 640 430 L 760 350 L 880 300 L 1000 340 L 1120 270 L 1300 240 L 1500 200 L 1700 150 L 1920 120 L 1920 480 L 640 480 Z" fill="#101c4e" />
          {Array.from({ length: 22 }, (_, i) => { const x = 880 + i * 42, hh = 70 + ((i * 37) % 60); return <path key={i} d={`M ${x} ${330 - (i > 10 ? 40 : 0)} l 20 -${hh} l 20 ${hh} Z`} fill="#0c2236" />; })}
          {/* ── río con reflejos de luna y de fuego */}
          <path d="M -20 455 L 760 455 Q 700 540 640 650 L -20 660 Z" fill="url(#pc_rio)" />
          {Array.from({ length: 26 }, (_, i) => { const y = 470 + (i % 9) * 20, x = 30 + ((i * 97) % 600) + Math.sin(t * 2 + i) * 12; return <path key={i} d={`M ${x} ${y} l ${30 + (i % 4) * 14} 0`} stroke={i % 5 === 0 ? "#ffb05a" : "#8ab8ff"} strokeWidth={4} strokeLinecap="round" opacity={0.65} />; })}
          <path d="M 270 470 l 70 0 M 280 492 l 50 0 M 290 514 l 34 0" stroke="#e8f0ff" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
          {/* drakkars varados: casco con tablas, velas a rayas, escudos en la borda, proa de dragón */}
          {[[190, 448, 0.52], [420, 446, 0.5], [580, 446, 0.32]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M -140 0 Q 0 40 140 0 L 120 -18 Q 0 6 -120 -18 Z" fill="#3a2214" stroke={T} strokeWidth={4} />
              <path d="M -130 -8 Q 0 22 130 -8" stroke="#6a3e1e" strokeWidth={3} fill="none" />
              {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={-100 + k * 25} cy={-8} r={9} fill={k % 2 ? "#c42a24" : "#f0dcc0"} stroke={T} strokeWidth={2} />)}
              <path d="M 120 -18 Q 160 -60 150 -110 Q 168 -116 172 -98 Q 166 -60 140 -10 Z" fill="#3a2214" stroke={T} strokeWidth={4} />
              <path d="M -120 -18 Q -150 -50 -146 -80" stroke="#3a2214" strokeWidth={10} fill="none" />
              <rect x={-4} y={-170} width={8} height={160} fill="#3a2214" />
              <path d="M -80 -160 L 80 -160 L 76 -40 L -76 -40 Z" fill="#e8d8c0" stroke={T} strokeWidth={3} />
              {Array.from({ length: 4 }, (_, k) => <rect key={k} x={-64 + k * 40} y={-160} width={20} height={120} fill="#b8262a" />)}
              <path d="M -80 -160 L 80 -160 L 76 -40 L -76 -40 Z" fill="#0a1a5a" opacity={0.35} />
            </g>
          ))}
          {/* muelle */}
          <rect x={-10} y={505} width={170} height={16} fill="#2a1a14" stroke={T} strokeWidth={3} />
          {[20, 80, 140].map((x) => <rect key={x} x={x} y={440} width={16} height={190} fill="#22160f" stroke={T} strokeWidth={3} />)}
          <Llama x={145} y={438} h={38} w={20} t={t} seed={9} />
          {/* ── empalizada, torre y estandartes */}
          {Array.from({ length: 12 }, (_, i) => { const x = 1010 + i * 42, hh = 120 + (i % 3) * 10; return <g key={i}><path d={`M ${x} 345 L ${x} ${345 - hh} L ${x + 20} ${345 - hh - 20} L ${x + 40} ${345 - hh} L ${x + 40} 345 Z`} fill="#3a2418" stroke={T} strokeWidth={3} /><path d={`M ${x + 30} 345 L ${x + 30} ${345 - hh}`} stroke="#c8783a" strokeWidth={4} opacity={0.5} /></g>; })}
          <rect x={1160} y={90} width={96} height={170} fill="#2e1c12" stroke={T} strokeWidth={4} />
          <path d="M 1146 96 L 1208 40 L 1270 96 Z" fill="#22140c" stroke={T} strokeWidth={4} />
          {[0, 1, 2].map((k) => <rect key={k} x={1164 + k * 32} y={128} width={14} height={34} fill="#ffb05a" opacity={0.7} />)}
          {[[1278, 150], [850, 264], [630, 380]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 3} y={y - 14} width={6} height={140} fill="#22140c" />
              <path d={`M ${x} ${y} L ${x + 50} ${y} L ${x + 50} ${y + 96} L ${x + 25} ${y + 80} L ${x} ${y + 96} Z`} fill="#a01e26" stroke={T} strokeWidth={3} />
              <path d={`M ${x + 25} ${y + 16} l 0 46 M ${x + 12} ${y + 30} l 13 -12 l 13 12 M ${x + 14} ${y + 56} l 22 0`} stroke="#e8c88a" strokeWidth={3} fill="none" />
            </g>
          ))}
          {/* ── antorchas del fondo */}
          <Antorcha x={740} y={420} s={0.42} t={t} seed={1} />
          <Antorcha x={1096} y={200} s={0.5} t={t} seed={2} />
          <Antorcha x={1378} y={44} s={0.55} t={t} seed={3} />
          {/* ── suelo cálido del campamento */}
          <path d="M -20 650 Q 400 600 760 610 Q 1200 600 1940 660 L 1940 1100 L -20 1100 Z" fill="url(#pc_suelo)" />
          {tierra.map(([x, y, k], i) => <ellipse key={i} cx={x} cy={y} rx={4 + k * 10} ry={2 + k * 4} fill={k > 0.5 ? "#ffcf8a" : "#2a1410"} opacity={0.22} />)}
          {/* ── hilera de tiendas que se aleja (de lejos a cerca) */}
          <Tienda x={735} y={548} w={130} h={125} />
          <Tienda x={792} y={556} w={160} h={165} />
          <Tienda x={872} y={570} w={210} h={215} />
          <Tienda x={1010} y={590} w={290} h={305} />
          <Tienda x={1245} y={610} w={400} h={410} />
          {/* vikingos en sus mantas, cada uno con un ojo abierto */}
          <Manta d="M 650 560 Q 700 520 760 560 Z" seed={1} n={10} x0={660} x1={750} y0={530} y1={558} />
          <Vikingo x={700} y={520} s={0.17} ojoI={0} ojoD={t > 1.05 ? 1 : 0} mira={-1} barba="#c9773a" />
          <Manta d="M 730 570 Q 790 510 860 570 Z" seed={2} n={14} x0={740} x1={850} y0={530} y1={566} />
          <Vikingo x={790} y={515} s={0.21} ojoI={0} ojoD={1} mira={-1} barba="#8a4a2a" />
          <Manta d="M 860 600 Q 960 500 1060 600 Z" seed={3} n={26} x0={870} x1={1050} y0={530} y1={596} />
          <Vikingo x={950} y={500} s={0.3} ojoI={0} ojoD={1} mira={-1} barba="#a8552a" />
          <Hacha x={1005} y={510} s={0.3} rot={20} />
          <Manta d="M 1060 640 Q 1210 470 1360 640 Z" seed={4} n={40} x0={1080} x1={1350} y0={520} y1={636} />
          <Vikingo x={1210} y={470} s={0.5} ojoI={0} ojoD={1} mira={-1} barba="#9a4a24" />
          <Hacha x={1300} y={495} s={0.48} rot={16} />
          {/* escudos apoyados */}
          <Escudo x={812} y={604} r={34} />
          <Escudo x={918} y={612} r={46} />
          <Escudo x={1044} y={618} r={58} luz={0.8} />
          <Escudo x={1180} y={630} r={74} luz={0.8} />
          {/* ── la fogata: anillo de piedras, troncos, trípode y olla, resplandor */}
          <ellipse cx={976} cy={700} rx={520} ry={300} fill="url(#pc_glow)" opacity={0.9 + 0.1 * Math.sin(t * 9)} />
          <path d="M 836 720 L 880 560 L 924 720 M 880 560 L 880 640" stroke="#2a1810" strokeWidth={9} strokeLinecap="round" />
          <path d="M 856 640 Q 880 700 904 640 Z" fill="#2a2630" stroke={T} strokeWidth={4} />
          <path d="M 862 642 Q 880 650 898 642" stroke="#ffb05a" strokeWidth={3} />
          {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={910 + i * 18} cy={716 + Math.sin(i) * 4} rx={14} ry={10} fill="#4a3a3a" stroke={T} strokeWidth={3} />)}
          <rect x={920} y={690} width={130} height={18} rx={9} fill="#5a2e14" stroke={T} strokeWidth={3} transform="rotate(12 985 699)" />
          <rect x={920} y={690} width={130} height={18} rx={9} fill="#7a3e18" stroke={T} strokeWidth={3} transform="rotate(-12 985 699)" />
          <Llama x={980} y={705} h={240} w={150} t={t} seed={4} /><Llama x={1000} y={708} h={150} w={90} t={t + 0.3} seed={11} />
          {/* tronco junto al fuego */}
          <g transform="translate(800 790)"><rect x={-50} y={-26} width={100} height={52} rx={10} fill="url(#pc_madera)" stroke={T} strokeWidth={4} /><ellipse cx={50} cy={0} rx={14} ry={26} fill="#c8783a" stroke={T} strokeWidth={4} /><circle cx={50} cy={0} r={8} fill="none" stroke="#6a3a1a" strokeWidth={2} /></g>
          {/* ── la tienda grande de la derecha y el vikingo del ojo abierto */}
          <path d="M 1430 1100 L 1690 -40 L 1960 -40 L 1960 1100 Z" fill="url(#pc_tela2)" stroke={T} strokeWidth={6} />
          <path d="M 1470 1100 L 1730 -40" stroke="#3a2010" strokeWidth={30} />
          <path d="M 1478 1100 L 1738 -40" stroke="#c8783a" strokeWidth={6} opacity={0.6} />
          <path d="M 1580 1100 L 1800 -40" stroke="#3a2010" strokeWidth={18} />
          <path d="M 1530 900 Q 1700 300 1960 260 L 1960 1100 L 1530 1100 Z" fill="#3a1e0e" opacity={0.85} />
          <Manta d="M 1440 760 Q 1500 470 1700 470 Q 1900 460 1960 520 L 1960 820 L 1440 820 Z" seed={5} n={110} x0={1450} x1={1950} y0={470} y1={810} />
          <Vikingo x={1699} y={385} s={1.05} ojoI={abre ? 1 : 0} ojoD={1} mira={mira} barba="#a8481e" />
          <Hacha x={1760} y={520} s={0.95} rot={14} />
          <Escudo x={1540} y={712} r={140} luz={0.9} />
          {/* ── el perro de presa: cuerpo macizo, patas, collar de pinchos, hocico con dientes */}
          <g transform={`translate(${1230 - (ladra ? Math.abs(Math.sin(t * 11)) * 10 : 0)} 800)`}>
            <path d="M -110 -80 Q -40 -170 120 -150 Q 240 -130 250 -20 Q 252 60 200 96 L -60 100 Q -130 60 -110 -80 Z" fill="url(#pc_perro)" stroke={T} strokeWidth={6} />
            <path d="M -60 -120 Q 40 -160 160 -130" stroke="#ff9a4a" strokeWidth={8} opacity={0.4} fill="none" />
            {[[-70, 70, 120], [10, 80, 120], [150, 70, 110], [210, 60, 100]].map(([x, y, h], i) => (
              <g key={i}>
                <path d={`M ${x - 26} ${y - 40} Q ${x - 30} ${y + h * 0.5} ${x - 20} ${y + h} L ${x + 26} ${y + h} Q ${x + 26} ${y + h * 0.5} ${x + 28} ${y - 40} Z`} fill={i < 2 ? "#2a201e" : "#1a1412"} stroke={T} strokeWidth={5} />
                <path d={`M ${x - 30} ${y + h} Q ${x} ${y + h + 18} ${x + 34} ${y + h} Z`} fill="#3a2e2a" stroke={T} strokeWidth={4} />
                <path d={`M ${x - 8} ${y + h + 2} l 0 10 M ${x + 10} ${y + h + 2} l 0 10`} stroke={T} strokeWidth={3} />
              </g>
            ))}
            <path d="M 240 -60 Q 290 -90 280 -140" stroke="#2a201e" strokeWidth={22} fill="none" strokeLinecap="round" />
            {/* collar de cuero con pinchos */}
            <path d="M -40 -150 Q -6 -40 -50 50" stroke="#7a2e18" strokeWidth={36} fill="none" />
            <path d="M -40 -150 Q -6 -40 -50 50" stroke="#a8502a" strokeWidth={10} fill="none" opacity={0.6} />
            {[-130, -95, -60, -25, 10].map((k, i) => <g key={i} transform={`translate(${-28 + Math.sin(i) * 6} ${k})`}><path d="M -10 0 L 6 -16 L 10 4 Z" fill="#e8ecf4" stroke={T} strokeWidth={2} /></g>)}
            {/* cabeza */}
            <g transform={`rotate(${ladra ? Math.sin(t * 11) * 3 : 0} -60 -40)`}>
              <path d="M -190 -40 Q -210 -150 -110 -170 Q -10 -180 10 -90 Q 24 -10 -50 30 Q -170 50 -190 -40 Z" fill="url(#pc_perro)" stroke={T} strokeWidth={6} />
              <path d="M -60 -160 L -30 -210 Q -14 -170 -10 -120 Z" fill="#2a201e" stroke={T} strokeWidth={5} />
              <path d="M -150 -150 L -170 -200 Q -126 -184 -110 -160 Z" fill="#2a201e" stroke={T} strokeWidth={5} />
              <path d="M -150 -80 Q -170 -10 -196 0 Q -200 50 -130 52 Q -80 54 -60 20 Q -70 -40 -150 -80 Z" fill="#8a5a3a" stroke={T} strokeWidth={5} />
              <path d="M -160 -98 L -110 -78 M -80 -84 L -36 -104" stroke={T} strokeWidth={9} strokeLinecap="round" />
              <ellipse cx={-128} cy={-66} rx={12} ry={9} fill="#ffd27a" /><circle cx={-130} cy={-66} r={5} fill={T} />
              <ellipse cx={-60} cy={-72} rx={12} ry={9} fill="#ffd27a" /><circle cx={-62} cy={-72} r={5} fill={T} />
              <ellipse cx={-178} cy={-34} rx={20} ry={14} fill="#120c0c" /><circle cx={-184} cy={-38} r={4} fill="#fff" opacity={0.5} />
              <path d={`M -196 -6 Q -140 -16 -80 -4 L -80 ${10 + boca} Q -140 ${16 + boca} -194 ${8 + boca} Z`} fill="#6a1414" stroke={T} strokeWidth={5} />
              <path d="M -196 -6 Q -140 -22 -80 -4" fill="#c25a5a" stroke={T} strokeWidth={4} />
              {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${-190 + i * 16} -8 l 8 ${i === 0 || i === 6 ? 22 : 14} l 8 ${i === 0 || i === 6 ? -22 : -14}`} fill="#fffaf0" stroke={T} strokeWidth={2.5} />)}
              {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${-190 + i * 16} ${10 + boca} l 8 ${i === 1 || i === 5 ? -20 : -12} l 8 ${i === 1 || i === 5 ? 20 : 12}`} fill="#fffaf0" stroke={T} strokeWidth={2.5} />)}
              {ladra && Array.from({ length: 4 }, (_, i) => <circle key={i} cx={-210 - ((t * 200 + i * 30) % 80)} cy={-10 + i * 8} r={3} fill="#e8f0ff" opacity={0.7} />)}
            </g>
          </g>
          {/* ── el barril y vos */}
          <Barril x={650} y={826} w={218} h={410} luz={0.7} />
          {/* capa de piel con mechones */}
          <path d={capa} fill="url(#pc_capa)" stroke={T} strokeWidth={5} strokeLinejoin="round" /><path d="M 330 570 Q 470 580 515 660 Q 480 760 430 820" stroke="#ff9a4a" strokeWidth={10} fill="none" opacity={0.45} />
          {Array.from({ length: 34 }, (_, i) => { const a = (i / 34) * Math.PI * 1.15 + 2.2, x = 290 + Math.cos(a) * 230, y = 735 + Math.sin(a) * 175; return <path key={i} d={`M ${x} ${y} l ${Math.cos(a) * 30 + (i % 2 ? 8 : -8)} ${Math.sin(a) * 30}`} stroke="#3e2a1c" strokeWidth={7} strokeLinecap="round" />; })}
          {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${110 + (i * 29) % 380} ${600 + (i * 47) % 260} q 6 -14 14 -18`} stroke="#a8784e" strokeWidth={3} fill="none" opacity={0.55} />)}
          {/* piernas agachadas */}
          <path d="M 250 850 Q 190 890 200 960" stroke="#5a4028" strokeWidth={70} fill="none" strokeLinecap="round" />
          <path d="M 330 820 Q 470 820 490 900 L 470 960" stroke="#6a4a2e" strokeWidth={72} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 400 812 Q 470 818 486 880" stroke="#ffb05a" strokeWidth={8} fill="none" opacity={0.35} />
          <path d="M 420 930 L 420 1010 Q 470 1036 540 1018 L 530 980 Q 510 960 500 930 Z" fill="#7a3e1a" stroke={T} strokeWidth={6} />
          <path d="M 424 960 L 500 956" stroke="#4a2410" strokeWidth={5} />
          <path d="M 160 940 L 150 1010 Q 190 1030 260 1016 L 250 960 Z" fill="#6a3418" stroke={T} strokeWidth={6} />
          {/* torso con túnica y cinturón */}
          <path d="M 280 650 Q 400 600 500 680 Q 520 760 480 830 L 300 840 Q 260 750 280 650 Z" fill="#7a5a3a" stroke={T} strokeWidth={6} />
          <path d="M 296 800 Q 400 816 486 800" stroke="#3a2214" strokeWidth={16} fill="none" />
          <rect x={376} y={796} width={22} height={18} fill="#c8a24a" stroke={T} strokeWidth={3} />
          <path d="M 420 640 Q 490 680 500 760" stroke="#ffb05a" strokeWidth={8} fill="none" opacity={0.3} />
          {/* brazo izquierdo apoyado en el barril */}
          <path d="M 470 700 Q 540 730 572 720" stroke="#7a5a3a" strokeWidth={44} fill="none" strokeLinecap="round" />
          <path d="M 556 700 Q 600 696 600 726 Q 598 752 566 750 Q 548 740 556 700 Z" fill={PIEL} stroke={T} strokeWidth={5} />
          {[708, 722, 736].map((k) => <path key={k} d={`M 590 ${k} l 10 0`} stroke={T} strokeWidth={3} />)}
          {/* brazo derecho con el cuchillo */}
          <path d="M 330 700 Q 260 770 236 812" stroke="#7a5a3a" strokeWidth={46} fill="none" strokeLinecap="round" />
          <g transform="translate(230 818) rotate(-22)">
            <rect x={-50} y={-11} width={70} height={22} rx={7} fill="#3a2214" stroke={T} strokeWidth={4} />
            {[-40, -28, -16, -4].map((k) => <path key={k} d={`M ${k} -10 l 0 20`} stroke="#6a4a2e" strokeWidth={2} />)}
            <rect x={18} y={-24} width={14} height={48} rx={4} fill="#5a5e6e" stroke={T} strokeWidth={4} />
            <path d="M 32 -14 L 250 -6 L 290 0 L 250 8 L 32 14 Z" fill="url(#pc_metal)" stroke={T} strokeWidth={5} />
            <path d="M 50 -4 L 246 -1" stroke="#fff" strokeWidth={4} opacity={0.85} />
            <path d="M 60 6 L 240 4" stroke="#ffb05a" strokeWidth={3} opacity={0.5} />
          </g>
          <path d="M 208 790 Q 250 784 260 812 Q 262 846 224 848 Q 196 840 208 790 Z" fill={PIEL} stroke={T} strokeWidth={5} />
          {[800, 814, 828].map((k) => <path key={k} d={`M 208 ${k} q 10 4 20 0`} stroke={T} strokeWidth={3} fill="none" />)}
          {/* cabeza: pelo rubio, gorro de cuero con costuras, ojos enormes, boca de susto */}
          <g transform="translate(522 580)">
            <path d="M -96 -20 Q -120 60 -80 100 L -60 30 Z M 70 -30 Q 110 30 96 70 L 70 10 Z" fill="#c8964a" stroke={T} strokeWidth={4} />
            <path d="M -92 10 Q -96 92 -10 100 Q 80 100 92 10 Q 90 -70 0 -76 Q -90 -70 -92 10 Z" fill={PIEL} stroke={T} strokeWidth={6} />
            <path d="M -92 10 Q -94 80 -40 96 Q -80 60 -76 0 Z" fill={PIEL2} opacity={0.5} />
            <path d="M 50 -60 Q 94 -20 90 30" stroke="#ffcf9a" strokeWidth={8} fill="none" opacity={0.7} />
            <ellipse cx={-10} cy={50} rx={18} ry={10} fill="#f08a7a" opacity={0.45} />
            <ellipse cx={70} cy={44} rx={16} ry={9} fill="#f08a7a" opacity={0.45} />
            <ellipse cx={-18} cy={10} rx={30} ry={34} fill="#fff" stroke={T} strokeWidth={5} />
            <ellipse cx={52} cy={6} rx={30} ry={34} fill="#fff" stroke={T} strokeWidth={5} />
            <circle cx={t > 0.7 ? -2 : -8} cy={t > 0.7 ? 0 : 14} r={14} fill={T} /><circle cx={t > 0.7 ? -6 : -12} cy={t > 0.7 ? -5 : 9} r={4} fill="#fff" />
            <circle cx={t > 0.7 ? 70 : 62} cy={t > 0.7 ? -4 : 10} r={14} fill={T} /><circle cx={t > 0.7 ? 66 : 58} cy={t > 0.7 ? -9 : 5} r={4} fill="#fff" />
            <path d="M -48 -30 Q -20 -40 6 -26 M 30 -30 Q 56 -42 84 -30" stroke="#8a5a2a" strokeWidth={8} strokeLinecap="round" fill="none" />
            <path d="M 4 70 Q 22 56 40 70 Q 34 82 22 82 Q 10 82 4 70 Z" fill="#6a1a1a" stroke={T} strokeWidth={4} />
            <path d="M 30 26 Q 38 40 28 46" stroke={PIEL2} strokeWidth={5} fill="none" />
            <path d="M -96 -8 Q -116 -8 -116 18 Q -112 40 -92 36" fill={PIEL} stroke={T} strokeWidth={5} />
            {/* gorro */}
            <path d="M -112 -28 Q -116 -150 0 -158 Q 116 -150 118 -28 Z" fill="#4e443c" stroke={T} strokeWidth={7} />
            {[-60, 0, 60].map((k) => <path key={k} d={`M 0 -156 Q ${k * 1.1} -100 ${k * 1.6} -36`} stroke="#2a221e" strokeWidth={4} fill="none" />)}
            <path d="M 40 -140 Q 100 -110 110 -40" stroke="#c8783a" strokeWidth={8} fill="none" opacity={0.45} />
            <path d="M -124 -36 Q 0 -10 128 -36 L 128 -12 Q 0 14 -124 -12 Z" fill="#3e3630" stroke={T} strokeWidth={6} />
            <circle cx={0} cy={-160} r={12} fill="#3e3630" stroke={T} strokeWidth={4} />
          </g>
          {/* ── primer plano oscuro: piedras y cajas con borde de fuego, pasto frío a la izquierda */}
          {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M ${i * 22} 1080 q ${(i % 2 ? 10 : -10)} -${60 + (i % 5) * 20} ${(i % 2 ? 26 : -6)} -${110 + (i % 4) * 30}`} stroke="#0e1a30" strokeWidth={8} fill="none" />)}
          <path d="M 120 1080 Q 160 1010 260 1000 Q 360 1000 380 1080 Z" fill="url(#pc_rocaF)" />
          <path d="M 640 1080 Q 660 1040 760 1030 Q 860 1030 880 1080 Z" fill="url(#pc_roca)" />
          <g transform="translate(1180 1010) rotate(-6)"><rect x={-110} y={-90} width={220} height={180} rx={14} fill="url(#pc_roca)" stroke={T} strokeWidth={6} /><path d="M -100 -82 L 104 -82" stroke="#ffb05a" strokeWidth={6} opacity={0.7} />{[-60, 0, 60].map((k) => <path key={k} d={`M ${k} -80 L ${k} 80`} stroke="#120a0a" strokeWidth={4} />)}</g>
          <g transform="translate(1420 960) rotate(4)"><rect x={-150} y={-80} width={300} height={170} rx={16} fill="url(#pc_roca)" stroke={T} strokeWidth={6} /><path d="M -140 -72 L 140 -72" stroke="#ffb05a" strokeWidth={7} opacity={0.8} /><circle cx={-110} cy={-40} r={7} fill="#5a5e6e" /><circle cx={110} cy={-40} r={7} fill="#5a5e6e" /></g>
          <g transform="translate(1760 990)"><rect x={-200} y={-110} width={400} height={220} rx={18} fill="url(#pc_roca)" stroke={T} strokeWidth={6} /><path d="M -190 -100 L 190 -100" stroke="#ffb05a" strokeWidth={8} opacity={0.8} /></g>
          <circle cx={1850} cy={800} r={180} fill="url(#pc_glow)" opacity={0.8} />
          <Llama x={1860} y={880} h={180} w={130} t={t} seed={8} />
          {/* ── chispas y brasas que suben, humo */}
          {chispas.map(([a, b, c], i) => { const k = (t * (0.35 + b * 0.4) + a) % 1; const ox = i % 3 === 0 ? 1850 : 980; return <circle key={i} cx={ox + Math.sin(i * 3 + t * 2 + c * 6) * (60 + k * 120)} cy={(i % 3 === 0 ? 840 : 680) - k * 560} r={2 + c * 3} fill={c > 0.5 ? "#ffe08a" : "#ff8a3a"} opacity={(1 - k) * 0.95} />; })}
          {[0, 1, 2].map((i) => { const k = (t * 0.25 + i / 3) % 1; return <circle key={i} cx={980 + Math.sin(t + i) * 40} cy={540 - k * 300} r={40 + k * 60} fill="#c8c0d8" opacity={(1 - k) * 0.12} />; })}
          {/* luz fría de luna desde la izquierda, sombra del primer plano, calor del fuego y viñeta */}
          <rect y={820} width={1920} height={260} fill="url(#pc_piso)" />
          <ellipse cx={1000} cy={640} rx={900} ry={520} fill="url(#pc_calor)" style={{ mixBlendMode: "screen" }} />
          <rect width={1920} height={1080} fill="url(#pc_frio)" />
          <rect width={1920} height={1080} fill="url(#pc_vin)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
