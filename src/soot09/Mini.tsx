import React from "react";
import { AbsoluteFill } from "remotion";
import { prog } from "./kit";

// CUADRO 0 = la miniatura elegida, sin texto ni flecha, rehecha en código con su nivel de detalle: noche de ventisca,
// bosque con siluetas de ojos encendidos, empalizada de estacas con veta y nieve, torres, guardia, antorchas que tiñen
// todo de naranja contra el azul frío, cajas/barriles/rueda/choclo nevados, y el colono de rodillas mostrando el barril
// VACÍO. Coordenadas en el espacio de la miniatura (1672x941). Cobra vida (ventisca, antorchas, parpadeo, temblor)
// y a los 0,55 s la cámara se mete en su cara → la cara del gancho de P0.
const W = 1672, H = 941, SC = 1920 / W;
const rr = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Pino: React.FC<{ x: number; y: number; h: number; c: string; n: string }> = ({ x, y, h, c, n }) => {
  const tiers = 5;
  return (
    <g>
      <rect x={x - h * 0.025} y={y - h * 0.15} width={h * 0.05} height={h * 0.2} fill="#0a0f1c" />
      {Array.from({ length: tiers }, (_, i) => {
        const ty = y - h * 0.12 - i * (h * 0.85) / tiers, w = h * 0.34 * (1 - i / (tiers + 1.2));
        const top = ty - h * 0.3;
        return (
          <g key={i}>
            <path d={`M ${x} ${top} L ${x + w} ${ty} Q ${x + w * 0.5} ${ty - 10} ${x} ${ty + 6} Q ${x - w * 0.5} ${ty - 10} ${x - w} ${ty} Z`} fill={c} />
            <path d={`M ${x} ${top + 6} L ${x - w * 0.82} ${ty - 6} Q ${x - w * 0.45} ${ty - 20} ${x - w * 0.1} ${ty - 12} Q ${x - w * 0.3} ${ty - 40} ${x} ${top + 6} Z`} fill={n} opacity={0.75} />
          </g>
        );
      })}
    </g>
  );
};

// silueta del bosque: cabeza con plumas, hombros, ojos que brillan
const Acecho: React.FC<{ x: number; y: number; s: number; t: number; k: number }> = ({ x, y, s, t, k }) => {
  const p = Math.sin(t * 6 + k * 2.3) > 0.9 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -34 70 Q -36 18 -14 10 L 14 10 Q 36 18 34 70 Z" fill="#070b16" />
      <ellipse cx={0} cy={-6} rx={18} ry={21} fill="#080c18" />
      {[-40, -22, -6, 8, 24, 40].map((a, i) => <path key={i} d={`M 0 -14 L ${Math.sin((a * Math.PI) / 180) * 42 - 4} ${-Math.cos((a * Math.PI) / 180) * 42 - 14} L ${Math.sin((a * Math.PI) / 180) * 42 + 4} ${-Math.cos((a * Math.PI) / 180) * 42 - 14} Z`} fill="#080c18" />)}
      <circle cx={0} cy={-4} r={22} fill="#ffb030" opacity={0.12} />
      <ellipse cx={-7} cy={-4} rx={4} ry={3.4 * p} fill="#ffcf50" />
      <ellipse cx={7} cy={-4} rx={4} ry={3.4 * p} fill="#ffcf50" />
    </g>
  );
};

const Antorcha: React.FC<{ x: number; y: number; s?: number; t: number; k: number }> = ({ x, y, s = 1, t, k }) => {
  const f = 1 + Math.sin(t * 17 + k) * 0.09 + Math.sin(t * 7.3 + k * 2) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-30} r={170} fill="url(#mGlow)" />
      <rect x={-6} y={0} width={12} height={70} fill="#2a180e" />
      <path d="M -14 -6 L 14 -6 L 9 12 L -9 12 Z" fill="#3a2418" stroke="#1a0e08" strokeWidth={2} />
      <g transform={`scale(${f} ${f * (1 + Math.sin(t * 11 + k) * 0.06)})`}>
        <path d="M 0 -64 C 18 -40 22 -24 15 -10 C 8 0 -8 0 -15 -10 C -22 -24 -12 -40 0 -64 Z" fill="#ff7a14" />
        <path d="M 0 -46 C 10 -31 12 -20 8 -12 C 4 -5 -4 -5 -8 -12 C -12 -20 -7 -31 0 -46 Z" fill="#ffc83a" />
        <path d="M 0 -30 C 4 -22 5 -17 3 -13 C 1 -10 -1 -10 -3 -13 C -5 -17 -4 -22 0 -30 Z" fill="#fff4c0" />
      </g>
      {[0, 1, 2].map((i) => { const ph = (t * 1.6 + i / 3 + k) % 1; return <circle key={i} cx={Math.sin(i * 3 + t * 5) * 10} cy={-60 - ph * 70} r={2.4 * (1 - ph)} fill="#ffb040" opacity={1 - ph} />; })}
    </g>
  );
};

// estaca de la empalizada: punta, veta, nieve en la punta y carámbanos
const Estaca: React.FC<{ x: number; top: number; bot: number; w: number; k: number }> = ({ x, top, bot, w, k }) => (
  <g>
    <path d={`M ${x} ${bot} L ${x} ${top + w * 0.7} L ${x + w / 2} ${top} L ${x + w} ${top + w * 0.7} L ${x + w} ${bot} Z`} fill="url(#mEst)" stroke="#1e110a" strokeWidth={2.5} />
    <path d={`M ${x + w * 0.62} ${top + w * 0.9} L ${x + w * 0.62} ${bot}`} stroke="#ffb46a" strokeWidth={2} opacity={0.35} />
    {[0.3, 0.55, 0.8].map((q, i) => <path key={i} d={`M ${x + w * 0.2 + i * 3} ${top + (bot - top) * q} q ${w * 0.15} -10 ${w * 0.35} 2`} stroke="#22130a" strokeWidth={1.6} fill="none" opacity={0.7} />)}
    <path d={`M ${x - 3} ${top + w * 0.78} L ${x + w / 2} ${top - 4} L ${x + w + 3} ${top + w * 0.78} Q ${x + w * 0.75} ${top + w * 0.95} ${x + w / 2} ${top + w * 0.82} Q ${x + w * 0.25} ${top + w * 0.98} ${x - 3} ${top + w * 0.78} Z`} fill="#eef3ff" />
    {[0.25, 0.6].map((q, i) => <path key={i} d={`M ${x + w * q - 2} ${top + w * 0.86} l 2 ${10 + rr(k + i) * 16} l 2 ${-10 - rr(k + i) * 16} Z`} fill="#dceaff" />)}
  </g>
);

const Barrilito: React.FC<{ x: number; y: number; w: number; h: number; k: number }> = ({ x, y, w, h, k }) => (
  <g>
    <path d={`M ${x} ${y} Q ${x - w * 0.08} ${y + h / 2} ${x} ${y + h} L ${x + w} ${y + h} Q ${x + w * 1.08} ${y + h / 2} ${x + w} ${y} Z`} fill="url(#mBarr)" stroke="#2a160a" strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${x + (w * (i + 1)) / 7} ${y + 4} Q ${x + (w * (i + 1)) / 7 + (i - 2.5) * 2} ${y + h / 2} ${x + (w * (i + 1)) / 7} ${y + h - 2}`} stroke="#2e180a" strokeWidth={1.6} fill="none" opacity={0.75} />)}
    {[0.2, 0.8].map((q) => <path key={q} d={`M ${x - w * 0.04} ${y + h * q} Q ${x + w / 2} ${y + h * q + 6} ${x + w * 1.04} ${y + h * q}`} stroke="#3c383c" strokeWidth={h * 0.07} fill="none" />)}
    <path d={`M ${x - 6} ${y + 4} Q ${x + w / 2} ${y - h * 0.22} ${x + w + 6} ${y + 4} Q ${x + w * 0.8} ${y + h * 0.1} ${x + w * 0.55} ${y + h * 0.05} Q ${x + w * 0.3} ${y + h * 0.13} ${x - 6} ${y + 4} Z`} fill="#f2f6ff" />
    {[0.2, 0.45, 0.75].map((q, i) => <path key={i} d={`M ${x + w * q} ${y + h * 0.07} l 2.5 ${8 + rr(k * 3 + i) * 14} l 2.5 ${-8 - rr(k * 3 + i) * 14} Z`} fill="#d8e8ff" />)}
  </g>
);

const Caja: React.FC<{ x: number; y: number; w: number; h: number; k: number }> = ({ x, y, w, h, k }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="url(#mCaja)" stroke="#1e110a" strokeWidth={3} />
    {[1, 2, 3].map((i) => <line key={i} x1={x} y1={y + (h * i) / 4} x2={x + w} y2={y + (h * i) / 4} stroke="#2a170b" strokeWidth={2.5} />)}
    {Array.from({ length: 8 }, (_, i) => { const yy = y + h * (0.06 + i * 0.12); return <path key={"v" + i} d={`M ${x + w * 0.1} ${yy} q ${w * 0.2} ${-3 + rr(k + i) * 6} ${w * 0.4} 0 t ${w * 0.4} 0`} stroke="#3a200e" strokeWidth={1.3} fill="none" opacity={0.6} />; })}
    {Array.from({ length: 3 }, (_, i) => <ellipse key={"n" + i} cx={x + w * (0.25 + rr(k * 5 + i) * 0.5)} cy={y + h * (0.2 + i * 0.25)} rx={5} ry={2.5} fill="#2a160a" opacity={0.7} />)}
    <rect x={x} y={y} width={w * 0.09} height={h} fill="#4a2c16" stroke="#1e110a" strokeWidth={2} />
    <rect x={x + w * 0.91} y={y} width={w * 0.09} height={h} fill="#4a2c16" stroke="#1e110a" strokeWidth={2} />
    <path d={`M ${x + w * 0.09} ${y + h} L ${x + w * 0.91} ${y}`} stroke="#4a2c16" strokeWidth={w * 0.06} />
    {[[0.045, 0.1], [0.955, 0.1], [0.045, 0.9], [0.955, 0.9]].map(([a, b], i) => <circle key={i} cx={x + w * a} cy={y + h * b} r={3} fill="#2a2a2e" />)}
    <path d={`M ${x - 8} ${y + 6} Q ${x + w * 0.2} ${y - h * 0.2} ${x + w * 0.55} ${y - h * 0.12} Q ${x + w * 0.85} ${y - h * 0.22} ${x + w + 8} ${y + 4} Q ${x + w * 0.7} ${y + h * 0.12} ${x + w * 0.4} ${y + h * 0.08} Q ${x + w * 0.15} ${y + h * 0.15} ${x - 8} ${y + 6} Z`} fill="#f2f6ff" />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M ${x + w * (0.12 + i * 0.18)} ${y + h * 0.08} l 3 ${10 + rr(k * 7 + i) * 18} l 3 ${-10 - rr(k * 7 + i) * 18} Z`} fill="#d6e6ff" />)}
  </g>
);

export const Mini: React.FC<{ t: number }> = ({ t }) => {
  if (t > 1.0) return null;
  const vive = prog(t, 0.03, 0.3);
  const zoom = prog(t, 0.55, 1.0);
  const k = zoom * zoom;
  const tiembla = Math.sin(t * 60) * 2.5 * vive;
  const parp = t > 0.3 && t < 0.38;
  const sc = 1 + k * 3.2 + vive * 0.02;
  // cara del colono en px de 1920: (640, 410) de la miniatura
  const fx = 640 * SC, fy = 410 * SC;
  const gota = (t * 1.4) % 1;
  return (
    <AbsoluteFill style={{ opacity: 1 - prog(t, 0.75, 1.0), transformOrigin: `${fx}px ${fy}px`, transform: `translate(${(960 - fx) * k}px, ${(640 - fy) * k}px) scale(${sc})` }}>
      <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="mCielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060a1e" /><stop offset="0.45" stopColor="#141f48" /><stop offset="1" stopColor="#2e3c74" /></linearGradient>
          <radialGradient id="mBruma" cx="0.3" cy="0.5" r="0.6"><stop offset="0" stopColor="#8aa0e0" stopOpacity={0.18} /><stop offset="1" stopColor="#8aa0e0" stopOpacity={0} /></radialGradient>
          <radialGradient id="mGlow"><stop offset="0" stopColor="#ffb040" stopOpacity={0.5} /><stop offset="0.25" stopColor="#ff8a20" stopOpacity={0.14} /><stop offset="1" stopColor="#ff7a10" stopOpacity={0} /></radialGradient>
          <radialGradient id="mCalida" cx="0.78" cy="0.32" r="0.55"><stop offset="0" stopColor="#ff8a2a" stopOpacity={0.22} /><stop offset="0.6" stopColor="#ff6a1a" stopOpacity={0.06} /><stop offset="1" stopColor="#ff7a2a" stopOpacity={0} /></radialGradient>
          <linearGradient id="mEst" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#24150a" /><stop offset="0.45" stopColor="#4e3018" /><stop offset="0.72" stopColor="#7a4a24" /><stop offset="1" stopColor="#1e1008" /></linearGradient>
          <linearGradient id="mPuerta" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2412" /><stop offset="0.5" stopColor="#5a3a1e" /><stop offset="1" stopColor="#2e1c0c" /></linearGradient>
          <linearGradient id="mBarr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3e2210" /><stop offset="0.4" stopColor="#8a5428" /><stop offset="0.65" stopColor="#a06838" /><stop offset="1" stopColor="#3a1e0c" /></linearGradient>
          <linearGradient id="mCaja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7e5230" /><stop offset="1" stopColor="#4a2c16" /></linearGradient>
          <linearGradient id="mNieve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aab6e6" /><stop offset="0.5" stopColor="#d8e0fa" /><stop offset="1" stopColor="#f6f8ff" /></linearGradient>
          <radialGradient id="mNieveCal" cx="0.75" cy="0.78" r="0.35"><stop offset="0" stopColor="#ffd2a0" stopOpacity={0.35} /><stop offset="1" stopColor="#ffd2a0" stopOpacity={0} /></radialGradient>
          <linearGradient id="mAcero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c8c4c8" /><stop offset="0.35" stopColor="#8a868c" /><stop offset="0.75" stopColor="#5a565c" /><stop offset="1" stopColor="#3a383e" /></linearGradient>
          <radialGradient id="mPiel" cx="0.6" cy="0.4" r="0.7"><stop offset="0" stopColor="#ffd6b0" /><stop offset="0.7" stopColor="#f4b88e" /><stop offset="1" stopColor="#d88c64" /></radialGradient>
          <linearGradient id="mJubon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a1210" /><stop offset="0.55" stopColor="#8a2420" /><stop offset="0.85" stopColor="#b0402c" /><stop offset="1" stopColor="#5a1612" /></linearGradient>
          <radialGradient id="mHueco" cx="0.45" cy="0.55" r="0.6"><stop offset="0" stopColor="#140a04" /><stop offset="0.7" stopColor="#2e180a" /><stop offset="1" stopColor="#4a2a14" /></radialGradient>
          <filter id="mVeta" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.35 0.012" numOctaves={3} seed={4} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.06  0 0 0 0 0.03  0 0 0 0 0.01  0 0 0 -2.6 1.75" result="a" />
            <feComposite in="a" in2="SourceGraphic" operator="in" result="b" />
            <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="b" /></feMerge>
          </filter>
          <filter id="mVetaH" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.3" numOctaves={3} seed={7} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.06  0 0 0 0 0.03  0 0 0 0 0.01  0 0 0 -2.6 1.75" result="a" />
            <feComposite in="a" in2="SourceGraphic" operator="in" result="b" />
            <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="b" /></feMerge>
          </filter>
          <filter id="mGrumo" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={4} seed={11} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.76  0 0 0 0 0.96  0 0 0 -1.6 0.82" result="a" />
            <feComposite in="a" in2="SourceGraphic" operator="in" result="b" />
            <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="b" /></feMerge>
          </filter>
          <filter id="mBokeh"><feGaussianBlur stdDeviation={6} /></filter>
        </defs>

        {/* cielo y bosque frío */}
        <rect width={W} height={H} fill="url(#mCielo)" />
        {Array.from({ length: 22 }, (_, i) => <Pino key={"a" + i} x={-30 + i * 82 + rr(i) * 40} y={330 + rr(i + 9) * 60} h={300 + rr(i + 3) * 140} c="#0e1838" n="#3a4c80" />)}
        <rect width={W} height={H} fill="url(#mBruma)" />
        {Array.from({ length: 10 }, (_, i) => <Pino key={"b" + i} x={-20 + i * 60 + rr(i + 40) * 30} y={470 + rr(i + 41) * 50} h={420 + rr(i + 42) * 160} c="#0c1530" n="#5a6ca0" />)}
        {[[30, 230, 1], [110, 270, 1.1], [190, 300, 1], [270, 330, 1.05], [60, 360, 1.2], [345, 360, 1.15], [150, 400, 1.3], [250, 420, 1.25], [400, 395, 1.2], [440, 340, 0.95], [330, 270, 0.85], [470, 430, 1.1]].map(([x, y, s], i) => <Acecho key={i} x={x} y={y} s={s} t={t} k={i} />)}
        {/* troncos de primer plano del bosque */}
        {[[180, 160, 18], [300, 120, 14], [410, 180, 12]].map(([x, y, w], i) => <path key={i} d={`M ${x} ${y} L ${x + w} ${y} L ${x + w + 6} 470 L ${x - 6} 470 Z`} fill="#0a1022" />)}

        {/* torre izquierda */}
        <g>
          <rect x={945} y={180} width={180} height={140} fill="#4e321c" stroke="#1e110a" strokeWidth={3} />
          {[195, 225, 255, 285].map((y) => <line key={y} x1={945} y1={y} x2={1125} y2={y} stroke="#24140a" strokeWidth={2} />)}
          {[935, 1000, 1065, 1125].map((x) => <rect key={x} x={x} y={90} width={12} height={95} fill="#3e2614" stroke="#1e110a" strokeWidth={2} />)}
          <rect x={925} y={170} width={225} height={22} fill="#6a4426" stroke="#1e110a" strokeWidth={3} />
          <path d="M 905 98 L 1022 32 L 1140 98 Z" fill="#5a3a20" stroke="#1e110a" strokeWidth={3} />
        </g>
        <path d="M 900 100 L 1022 26 L 1145 100 Q 1100 112 1060 104 Q 1020 116 980 106 Q 940 114 900 100 Z" fill="#eef3ff" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${912 + i * 27} ${104} l 3 ${10 + rr(i + 60) * 22} l 3 ${-10 - rr(i + 60) * 22} Z`} fill="#d6e6ff" />)}
        <rect x={921} y={164} width={233} height={12} rx={6} fill="#eef3ff" />
        {/* torre derecha */}
        <g>
          <rect x={1462} y={150} width={200} height={440} fill="#4e321c" stroke="#1e110a" strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => <line key={i} x1={1462} y1={185 + i * 32} x2={1662} y2={185 + i * 32} stroke="#24140a" strokeWidth={2} />)}
          {[1458, 1525, 1592, 1652].map((x) => <rect key={x} x={x} y={52} width={12} height={100} fill="#3e2614" stroke="#1e110a" strokeWidth={2} />)}
          <rect x={1445} y={140} width={227} height={22} fill="#6a4426" stroke="#1e110a" strokeWidth={3} />
          <path d="M 1430 56 L 1555 -6 L 1680 56 Z" fill="#5a3a20" stroke="#1e110a" strokeWidth={3} />
        </g>
        <path d="M 1425 58 L 1555 -12 L 1685 58 Q 1640 72 1600 62 Q 1550 76 1500 64 Q 1460 72 1425 58 Z" fill="#eef3ff" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${1440 + i * 27} ${62} l 3 ${10 + rr(i + 80) * 24} l 3 ${-10 - rr(i + 80) * 24} Z`} fill="#d6e6ff" />)}
        <rect x={1441} y={134} width={235} height={12} rx={6} fill="#eef3ff" />
        <ellipse cx={1540} cy={110} rx={16} ry={18} fill="#140c08" /><circle cx={1534} cy={108} r={3} fill="#ffc040" /><circle cx={1546} cy={108} r={3} fill="#ffc040" />

        {/* guardia con lanza */}
        <g>
          <line x1={1168} y1={70} x2={1168} y2={250} stroke="#1a100a" strokeWidth={6} /><path d="M 1160 72 L 1168 40 L 1176 72 Z" fill="#6a6670" />
          <line x1={1232} y1={80} x2={1232} y2={250} stroke="#1a100a" strokeWidth={6} /><path d="M 1224 82 L 1232 50 L 1240 82 Z" fill="#6a6670" />
          <path d="M 1165 250 Q 1160 170 1200 158 Q 1240 170 1236 250 Z" fill="#2a1a12" />
          <path d="M 1176 150 Q 1200 116 1224 150 Z" fill="#4a464c" /><ellipse cx={1200} cy={152} rx={30} ry={6} fill="#4a464c" />
          <ellipse cx={1200} cy={164} rx={16} ry={17} fill="#20140e" />
          <circle cx={1194} cy={163} r={3} fill="#ffc040" /><circle cx={1206} cy={163} r={3} fill="#ffc040" />
          <path d="M 1180 200 L 1222 200" stroke="#ff9a4a" strokeWidth={3} opacity={0.6} />
        </g>

        {/* empalizada */}
        <g>
          {Array.from({ length: 30 }, (_, i) => { const x = 720 + i * 31; if (x > 1150 && x < 1420) return null; const top = 250 - Math.min(i, 14) * 2.5 + (i % 2) * 9 + rr(i) * 8; return <Estaca key={i} x={x} top={top} bot={630} w={30} k={i} />; })}
          {Array.from({ length: 7 }, (_, i) => <Estaca key={"d" + i} x={1440 + i * 33} top={470 + (i % 2) * 8} bot={640} w={32} k={i + 50} />)}
          {Array.from({ length: 6 }, (_, i) => <Estaca key={"g" + i} x={1590 + i * 26} top={150 + (i % 2) * 10} bot={600} w={26} k={i + 70} />)}
        </g>
        {/* portón */}
        <g>
          <rect x={1150} y={255} width={270} height={355} fill="url(#mPuerta)" stroke="#1e110a" strokeWidth={4} />
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1={1150 + i * 30} y1={255} x2={1150 + i * 30} y2={610} stroke="#2a170b" strokeWidth={2.5} />)}
          <line x1={1285} y1={255} x2={1285} y2={610} stroke="#1a0e06" strokeWidth={6} />
          {Array.from({ length: 27 }, (_, i) => <path key={"pv" + i} d={`M ${1156 + i * 10} 260 q ${-3 + rr(i + 900) * 6} 170 0 345`} stroke="#3a220e" strokeWidth={1.2} fill="none" opacity={0.55} />)}
          {[290, 450, 575].map((y) => <rect key={y} x={1150} y={y} width={270} height={22} fill="#5a3a20" stroke="#1e110a" strokeWidth={2} />)}
          <path d="M 1160 450 L 1278 300" stroke="#5a3a20" strokeWidth={20} /><path d="M 1295 300 L 1412 450" stroke="#5a3a20" strokeWidth={20} />
          <path d="M 1160 575 L 1278 470" stroke="#5a3a20" strokeWidth={20} /><path d="M 1412 575 L 1295 470" stroke="#5a3a20" strokeWidth={20} />
        </g>
        {[290, 450, 575].map((y) => Array.from({ length: 10 }, (_, i) => <circle key={y + "-" + i} cx={1162 + i * 27.5} cy={y + 11} r={3.2} fill="#24242a" />))}
        {[290, 450, 575].map((y) => <path key={y} d={`M 1148 ${y + 2} Q 1285 ${y - 12} 1422 ${y + 2} Q 1285 ${y + 6} 1148 ${y + 2} Z`} fill="#eef3ff" />)}
        <path d="M 1146 258 Q 1285 236 1424 258 Q 1285 266 1146 258 Z" fill="#eef3ff" />

        {/* antorchas y su luz cálida */}
        <Antorcha x={1118} y={170} t={t} k={1} />
        <Antorcha x={1448} y={150} t={t} k={2} />
        <Antorcha x={1458} y={505} t={t} k={3} s={0.95} />
        <Antorcha x={792} y={420} t={t} k={4} s={0.5} />
        <rect width={W} height={H} fill="url(#mCalida)" />

        {/* suelo nevado: loma a la izquierda, campo, luz cálida al pie del fuerte */}
        <g filter="url(#mGrumo)">
          <path d="M 0 300 Q 120 330 260 440 Q 420 560 700 610 Q 1000 640 1300 620 Q 1520 600 1672 590 L 1672 941 L 0 941 Z" fill="url(#mNieve)" />
        </g>
        <path d="M 0 300 Q 120 330 260 440 Q 420 560 700 610 Q 1000 640 1300 620 Q 1520 600 1672 590 L 1672 941 L 0 941 Z" fill="url(#mNieveCal)" />
        {Array.from({ length: 70 }, (_, i) => { const x = rr(i + 300) * W, y = 560 + rr(i + 301) * 380; return <circle key={i} cx={x} cy={y} r={1.2 + rr(i + 302) * 1.8} fill={x > 1000 ? "#fff0d0" : "#ffffff"} opacity={0.9} />; })}

        {/* izquierda: cajas, barriles, rueda, choclo */}
        <g>
          <Caja x={-10} y={320} w={115} h={110} k={1} />
          <Caja x={-10} y={430} w={120} h={150} k={2} />
          <Barrilito x={120} y={470} w={130} h={120} k={3} />
          <Caja x={255} y={520} w={135} h={95} k={4} />
          <Barrilito x={410} y={555} w={60} h={55} k={5} />
          <Caja x={0} y={560} w={190} h={80} k={6} />
        </g>
        <g transform="translate(270 650)">
          <circle r={92} fill="none" stroke="#3a2412" strokeWidth={14} />
          <circle r={92} fill="none" stroke="#7a4e2a" strokeWidth={6} />
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 5) * 88} y2={Math.sin((i * Math.PI) / 5) * 88} stroke="#5a3a1e" strokeWidth={7} />)}
          <circle r={16} fill="#3a2412" />
          <path d="M -96 -22 Q 0 -112 96 -22 Q 0 -86 -96 -22 Z" fill="#eef3ff" />
        </g>
        {/* barril caído con rueda */}
        <g transform="translate(470 645) rotate(-6)">
          <rect x={-85} y={-45} width={160} height={90} rx={20} fill="url(#mCaja)" stroke="#1e110a" strokeWidth={3} />
          {[-50, 0, 50].map((x) => <rect key={x} x={x - 4} y={-46} width={8} height={92} fill="#3c383c" />)}
          <circle cx={78} cy={0} r={44} fill="#5a3a1e" stroke="#1e110a" strokeWidth={3} />
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={78} y1={0} x2={78 + Math.cos((i * Math.PI) / 4) * 40} y2={Math.sin((i * Math.PI) / 4) * 40} stroke="#2a170b" strokeWidth={4} />)}
          <path d="M -90 -38 Q 0 -78 110 -34 Q 0 -50 -90 -38 Z" fill="#eef3ff" />
        </g>
        {/* choclos y bolsas */}
        <path d="M -10 690 Q 80 640 200 690 Q 120 720 -10 740 Z" fill="#5a4a24" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${10 + i * 26} ${700} q 10 -40 22 -50`} stroke="#6a5a2a" strokeWidth={5} fill="none" />)}
        <g transform="translate(300 725) rotate(-8)">
          <ellipse rx={68} ry={22} fill="#e8a43a" />
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-56 + i * 14} y1={-18} x2={-56 + i * 14} y2={18} stroke="#b0741a" strokeWidth={3} />)}
          {Array.from({ length: 3 }, (_, i) => <line key={i} x1={-64} y1={-10 + i * 10} x2={64} y2={-10 + i * 10} stroke="#c88a26" strokeWidth={2} />)}
          <path d="M -68 0 L -130 -30 L -110 6 L -135 22 Z" fill="#8a7a3a" />
          <path d="M -20 -26 Q 20 -40 60 -20 Q 20 -28 -20 -26 Z" fill="#eef3ff" />
        </g>
        <g transform="translate(390 745) rotate(14)"><ellipse rx={48} ry={18} fill="#d89432" />{Array.from({ length: 7 }, (_, i) => <line key={i} x1={-40 + i * 13} y1={-14} x2={-40 + i * 13} y2={14} stroke="#a0681a" strokeWidth={3} />)}</g>
        <g>
          <Caja x={200} y={760} w={295} h={140} k={7} />
          <Caja x={-10} y={790} w={225} h={160} k={8} />
        </g>

        {/* derecha: cajas, barriles, estacas cruzadas */}
        <g>
          <Barrilito x={1190} y={640} w={125} h={72} k={9} />
          <Barrilito x={1372} y={645} w={135} h={95} k={10} />
          <Barrilito x={1388} y={612} w={40} h={30} k={11} />
          <Caja x={1020} y={700} w={350} h={170} k={12} />
        </g>
        <g>
          <path d="M 1450 568 L 1640 800" stroke="#2a170b" strokeWidth={32} strokeLinecap="round" /><path d="M 1450 568 L 1640 800" stroke="#5e3c20" strokeWidth={24} strokeLinecap="round" />
          <path d="M 1660 600 L 1500 830" stroke="#2a170b" strokeWidth={30} strokeLinecap="round" /><path d="M 1660 600 L 1500 830" stroke="#5e3c20" strokeWidth={22} strokeLinecap="round" />
          <path d="M 1440 565 Q 1460 548 1480 572 Q 1460 566 1440 565 Z" fill="#eef3ff" />
        </g>
        <path d="M 1370 941 Q 1460 830 1600 820 Q 1672 818 1700 840 L 1700 941 Z" fill="#f8faff" />
        <path d="M 1400 860 Q 1520 820 1650 838" stroke="#c4d0f2" strokeWidth={8} fill="none" />
      </svg>

      {/* el colono */}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${tiembla}px)` }}>
        <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* piernas de rodillas en la nieve */}
          <path d="M 600 720 Q 590 780 640 800 L 720 820 Q 760 800 740 760 L 690 720 Z" fill="#3a2a24" />
          <path d="M 620 790 Q 690 840 760 820 L 770 845 Q 680 860 610 820 Z" fill="#241814" />
          <path d="M 740 700 Q 820 710 850 760 L 900 770 Q 940 790 930 820 L 840 820 Q 800 790 760 760 Z" fill="#3a2a24" />
          <path d="M 845 770 Q 900 765 940 790 Q 948 815 925 822 L 842 822 Z" fill="#241814" />
          <path d="M 600 800 Q 680 790 720 812 Q 800 800 860 815 Q 900 810 950 828 Q 860 850 760 842 Q 660 850 600 800 Z" fill="#eef3ff" />
          <path d="M 640 740 q 20 -6 30 8 M 800 750 q 18 -4 26 10" stroke="#eef3ff" strokeWidth={8} strokeLinecap="round" fill="none" />
          {/* jubón */}
          <path d="M 585 545 Q 640 520 700 530 Q 760 535 790 560 L 810 700 Q 800 740 760 742 L 610 742 Q 575 730 580 690 Z" fill="url(#mJubon)" stroke="#2a0a08" strokeWidth={3} />
          {[600, 640, 680, 720, 760].map((x) => <path key={x} d={`M ${x} 700 L ${x + 6} 742`} stroke="#3a0e0c" strokeWidth={2} />)}
          {[575, 605, 635].map((y) => <circle key={y} cx={700} cy={y} r={5} fill="#e0b040" stroke="#7a5a10" strokeWidth={1.5} />)}
          <rect x={590} y={678} width={220} height={24} fill="#2a1810" stroke="#140a06" strokeWidth={2} />
          <rect x={748} y={672} width={34} height={36} rx={4} fill="none" stroke="#e0b040" strokeWidth={6} />
          <path d="M 600 560 Q 630 600 620 650 M 690 620 Q 720 640 760 630" stroke="#eef3ff" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.9} />
          <path d="M 795 570 L 806 690" stroke="#ff9a50" strokeWidth={4} opacity={0.55} />
          {/* brazo izquierdo (del espectador) sosteniendo el barril por abajo */}
          <path d="M 600 560 Q 580 620 625 660 Q 680 690 740 640 L 728 606 Q 680 640 650 620 Q 640 590 640 565 Z" fill="url(#mJubon)" stroke="#2a0a08" strokeWidth={3} />
          <path d="M 724 600 Q 760 590 770 615 Q 760 650 738 648 Z" fill="#f2f0ea" stroke="#b8b0a0" strokeWidth={2} />
          {/* gola */}
          <g>
            <ellipse cx={660} cy={530} rx={118} ry={36} fill="#d8d4cc" />
            {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={660 + Math.cos(a) * 104} cy={530 + Math.sin(a) * 28} rx={20} ry={15} fill="#f8f6f0" stroke="#bcb6aa" strokeWidth={2} />; })}
            {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <ellipse key={i} cx={660 + Math.cos(a) * 70} cy={530 + Math.sin(a) * 18} rx={16} ry={11} fill="#ffffff" stroke="#c8c2b6" strokeWidth={1.5} />; })}
            <path d="M 560 520 Q 600 500 640 512" stroke="#dceaff" strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
          {/* cabeza */}
          <path d="M 540 400 Q 545 300 640 300 Q 745 300 752 400 Q 752 500 650 520 Q 545 510 540 400 Z" fill="url(#mPiel)" />
          <ellipse cx={538} cy={445} rx={22} ry={30} fill="#f0a882" /><path d="M 532 430 q 10 12 0 28" stroke="#c87858" strokeWidth={3} fill="none" />
          <path d="M 540 360 Q 520 400 540 450 Q 548 410 560 395 Z M 742 350 Q 768 380 752 430 Q 744 395 730 380 Z" fill="#d0782a" />
          {/* cejas preocupadas */}
          <path d="M 568 352 Q 600 336 630 358" stroke="#8a4a1a" strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d="M 672 346 Q 706 326 738 340" stroke="#8a4a1a" strokeWidth={9} strokeLinecap="round" fill="none" />
          {/* ojos grandes mirando arriba a la derecha */}
          {parp ? (
            <g stroke="#3a1a0a" strokeWidth={6} strokeLinecap="round" fill="none"><path d="M 578 412 Q 608 422 640 412" /><path d="M 668 400 Q 702 410 736 400" /></g>
          ) : (
            <g>
              <ellipse cx={610} cy={410} rx={34} ry={42} fill="#ffffff" stroke="#2a140a" strokeWidth={4} />
              <ellipse cx={703} cy={398} rx={36} ry={44} fill="#ffffff" stroke="#2a140a" strokeWidth={4} />
              <circle cx={620} cy={400} r={20} fill="#1a0e08" /><circle cx={714} cy={388} r={21} fill="#1a0e08" />
              <circle cx={626} cy={392} r={7} fill="#fff" /><circle cx={720} cy={380} r={7.5} fill="#fff" />
              <circle cx={614} cy={410} r={3} fill="#fff" /><circle cx={708} cy={398} r={3} fill="#fff" />
            </g>
          )}
          {/* lágrimas, rubor, escarcha */}
          <ellipse cx={585} cy={466} rx={26} ry={14} fill="#ff7a6a" opacity={0.45} />
          <ellipse cx={735} cy={452} rx={22} ry={13} fill="#ff7a6a" opacity={0.45} />
          <path d="M 640 445 Q 652 472 646 498" stroke="#9fd6ff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.85} />
          <circle cx={646} cy={500 + gota * 30} r={5 * (1 - gota * 0.4)} fill="#9fd6ff" opacity={1 - gota} />
          <path d="M 740 420 q 6 16 0 22 q -6 -6 0 -22 Z" fill="#bfe6ff" />
          <path d="M 556 470 l 8 -4 M 560 482 l 10 -2 M 728 470 l 10 2" stroke="#e8f4ff" strokeWidth={3} strokeLinecap="round" />
          {/* boca gritando */}
          <path d="M 640 470 Q 676 448 712 462 Q 728 500 708 528 Q 676 546 648 526 Q 628 500 640 470 Z" fill="#4a0e10" stroke="#2a0606" strokeWidth={4} />
          <path d="M 646 470 Q 676 454 708 464 L 708 476 Q 676 468 644 482 Z" fill="#ffffff" />
          <path d="M 654 522 Q 678 500 702 520 Q 678 538 654 522 Z" fill="#e0606a" />
          {/* casco morrión */}
          <g>
            <path d="M 520 340 Q 520 220 640 205 Q 760 205 770 330 Z" fill="url(#mAcero)" stroke="#2a282c" strokeWidth={4} />
            <path d="M 640 205 Q 652 270 650 336" stroke="#3a383e" strokeWidth={6} fill="none" />
            <path d="M 560 330 Q 570 250 640 222" stroke="#e0dce0" strokeWidth={7} fill="none" opacity={0.7} strokeLinecap="round" />
            {[540, 575, 610, 690, 725, 755].map((x, i) => <circle key={x} cx={x} cy={330 - (i === 0 || i === 5 ? 6 : 0)} r={4} fill="#2a282c" />)}
            <path d="M 470 360 Q 640 300 800 330 Q 815 345 795 352 Q 640 330 480 382 Q 460 375 470 360 Z" fill="url(#mAcero)" stroke="#2a282c" strokeWidth={4} />
            <path d="M 480 360 Q 640 308 790 334" stroke="#d8d4d8" strokeWidth={3} fill="none" opacity={0.6} />
            {/* nieve sobre el casco y el ala, carámbanos */}
            <path d="M 545 260 Q 570 215 640 208 Q 710 208 745 260 Q 700 236 660 244 Q 610 238 545 260 Z" fill="#f2f6ff" />
            <path d="M 470 360 Q 520 340 560 340 Q 530 356 485 376 Z" fill="#f2f6ff" />
            <path d="M 720 326 Q 770 320 800 330 Q 770 336 730 336 Z" fill="#f2f6ff" />
            {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${488 + i * 20} ${372 - i * 4} l 2.5 ${10 + rr(i + 120) * 16} l 2.5 ${-10 - rr(i + 120) * 16} Z`} fill="#d6e6ff" />)}
          </g>
          {/* el barril VACÍO, boca hacia nosotros */}
          <g transform={`translate(930 510) rotate(${-24 + Math.sin(t * 9) * 1.6 * vive})`}>
            <g>
              <path d="M 0 -172 C 110 -196 230 -186 280 -150 Q 300 0 280 150 C 230 186 110 196 0 172 Z" fill="url(#mBarr)" stroke="#24120a" strokeWidth={4} />
              {Array.from({ length: 7 }, (_, i) => { const yy = -150 + i * 50; return <path key={i} d={`M 10 ${yy * 1.1} Q 150 ${yy * 1.18} 280 ${yy * 0.9}`} stroke="#2e180a" strokeWidth={2.2} fill="none" opacity={0.8} />; })}
            </g>
            {[40, 160, 262].map((x, i) => <path key={x} d={`M ${x} ${-178 + i * 8} Q ${x + 16} 0 ${x} ${178 - i * 8}`} stroke="#38343a" strokeWidth={18} fill="none" />)}
            {[40, 160].map((x) => [-120, -60, 0, 60, 120].map((y) => <circle key={x + "-" + y} cx={x + 12 - Math.abs(y) * 0.04} cy={y} r={3.5} fill="#7a767c" />))}
            {/* boca: aro, interior oscuro con duelas */}
            <ellipse cx={0} cy={0} rx={122} ry={176} fill="#8a5a2c" stroke="#24120a" strokeWidth={4} />
            <ellipse cx={0} cy={0} rx={116} ry={168} fill="none" stroke="#3a363c" strokeWidth={14} />
            {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 116} cy={Math.sin(a) * 168} r={3.5} fill="#8a868c" />; })}
            <ellipse cx={4} cy={4} rx={100} ry={150} fill="url(#mHueco)" />
            {Array.from({ length: 9 }, (_, i) => { const x = -80 + i * 20; const hh = Math.sqrt(Math.max(0, 1 - (x / 100) ** 2)) * 146; return <path key={i} d={`M ${x} ${-hh} Q ${x * 0.35 + 20} 0 ${x} ${hh}`} stroke="#4a2a14" strokeWidth={2} fill="none" opacity={0.7} />; })}
            <ellipse cx={30} cy={10} rx={46} ry={80} fill="#0c0602" opacity={0.6} />
            <path d="M -70 110 Q 0 150 70 110 Q 0 132 -70 110 Z" fill="#c8d4f4" opacity={0.7} />
            {/* nieve sobre el lomo y el borde; carámbanos */}
            <path d="M -110 -80 Q -90 -190 20 -186 Q 160 -200 280 -152 Q 160 -170 60 -164 Q -40 -166 -110 -80 Z" fill="#f2f6ff" />
            {Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (1.1 + i * 0.06); return <path key={i} d={`M ${Math.cos(a) * 118 - 3} ${Math.sin(a) * 170} l 3 ${16 + rr(i + 200) * 26} l 3 ${-16 - rr(i + 200) * 26} Z`} fill="#d6e8ff" opacity={0.95} />; })}
            <path d="M 18 140 l 3 26 l 3 -26 Z" fill="#d6e8ff" />
          </g>
          {/* manos sobre el barril */}
          <g>
            <path d="M 752 588 Q 780 562 806 580 Q 818 600 800 620 Q 778 632 758 618 Z" fill="url(#mPiel)" stroke="#c07a56" strokeWidth={3} />
            {[0, 1, 2].map((i) => <path key={i} d={`M ${780 + i * 9} ${572 + i * 4} q 12 -6 18 4`} stroke="#c07a56" strokeWidth={2.5} fill="none" />)}
            <path d="M 1078 560 Q 1104 552 1112 578 Q 1110 604 1090 610 Q 1070 600 1072 580 Z" fill="url(#mPiel)" stroke="#c07a56" strokeWidth={3} />
            <path d="M 1090 600 q 0 -16 10 -24" stroke="#c07a56" strokeWidth={2.5} fill="none" />
          </g>
          {/* nieve de primer plano que le tapa las rodillas */}
          <path d="M 520 941 Q 540 800 700 790 Q 820 784 900 800 Q 990 830 1010 941 Z" fill="#f6f9ff" /><path d="M 560 860 Q 700 800 860 812" stroke="#ffffff" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M 620 860 Q 760 838 900 868" stroke="#c4d0f2" strokeWidth={8} fill="none" />
        </svg>
      </div>

      {/* ventisca: rayas diagonales, copos, y copos grandes desenfocados cerca de la lente */}
      <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 150 }, (_, i) => {
          const v = 300 + rr(i + 400) * 400, y = ((rr(i + 401) * H + t * v * (0.4 + vive)) % (H + 60)) - 30, x = ((rr(i + 402) * W - t * v * 0.35 * (0.4 + vive)) % W + W) % W;
          return <line key={i} x1={x} y1={y} x2={x - 5} y2={y + 14 + rr(i + 403) * 14} stroke="#ffffff" strokeWidth={1.6 + rr(i + 404) * 1.6} strokeLinecap="round" opacity={0.55 + rr(i + 405) * 0.35} />;
        })}
        {Array.from({ length: 90 }, (_, i) => {
          const v = 120 + rr(i + 500) * 200, y = ((rr(i + 501) * H + t * v * (0.4 + vive)) % (H + 20)) - 10, x = ((rr(i + 502) * W - t * v * 0.3 + W) % W);
          return <circle key={i} cx={x} cy={y} r={1.6 + rr(i + 503) * 2.6} fill="#ffffff" opacity={0.85} />;
        })}
        <g filter="url(#mBokeh)">
          {Array.from({ length: 9 }, (_, i) => {
            const y = ((rr(i + 600) * H + t * 260) % (H + 80)) - 40, x = rr(i + 601) * W - t * 80;
            return <ellipse key={i} cx={x} cy={y} rx={12 + rr(i + 602) * 14} ry={20 + rr(i + 603) * 20} transform={`rotate(-20 ${x} ${y})`} fill="#e8f0ff" opacity={0.55} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
