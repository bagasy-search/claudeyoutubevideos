import React from "react";
import { rnd } from "../soot/lib";

// soot02 · CUADRO 0 = la miniatura elegida (soot02_elegida.png) SIN el texto y SIN la flecha, rehecha en SVG con su nivel de detalle:
// el pasillo de remeros a la luz de las antorchas (cálida) contra la tormenta que entra por el boquete (fría),
// el héroe aterrado con lorica, remo, sandalias y grillete, el espolón de bronce martillado entre astillas y espuma.
// En t=0 queda idéntica a la miniatura; después cobra vida (empuja el espolón, vuelan astillas, cae la lluvia, parpadea, transpira).
// Coordenadas en el espacio de la miniatura (1672x941), escalado a 1920x1080.

const ss = (x: number) => Math.max(0, Math.min(1, x));
const OL = "#2a1206"; // contorno

// tabla de madera con vetas
const Tabla: React.FC<{ d: string; vetas: [number, number, number, number][]; fill?: string }> = ({ d, vetas, fill = "url(#pt_mad)" }) => (
  <g>
    <path d={d} fill={fill} stroke={OL} strokeWidth={4} strokeLinejoin="round" />
    {vetas.map(([x1, y1, x2, y2], i) => <path key={i} d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + (i % 2 ? 3 : -3)} ${x2} ${y2}`} stroke="#5a2c0e" strokeWidth={2.5} fill="none" opacity={0.7} />)}
  </g>
);

const Antorcha: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => {
  const f = Math.sin(t * 13 + i * 2) * 5, g = Math.sin(t * 9 + i) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-36} r={150} fill="url(#pt_glow)" />
      <path d="M -6 0 L 6 0 L 4 80 L -4 80 Z" fill="#4a2408" stroke={OL} strokeWidth={3} />
      <path d="M -20 -4 L 20 -4 L 14 20 L -14 20 Z" fill="url(#pt_bronceH)" stroke={OL} strokeWidth={3} />
      <path d={`M -18 -4 Q -26 -40 ${-4 + g} ${-90 - f} Q 6 -58 12 -66 Q 26 -34 18 -4 Z`} fill="#ff6a10" />
      <path d={`M -11 -4 Q -14 -32 ${g * 0.5} ${-64 - f * 0.6} Q 10 -30 11 -4 Z`} fill="#ffc34a" />
      <path d={`M -5 -4 Q -6 -20 ${g * 0.3} ${-36 - f * 0.3} Q 5 -18 5 -4 Z`} fill="#fff3c0" />
    </g>
  );
};

// cara asustada (para el héroe y los de atrás)
const Cara: React.FC<{ t: number; parp: number; mira?: number }> = ({ t, parp, mira = 0 }) => (
  <g>
    <ellipse cx={-34} cy={2} rx={34} ry={42 * (1 - parp * 0.9)} fill="#fff" stroke={OL} strokeWidth={5} />
    <ellipse cx={56} cy={-10} rx={34} ry={42 * (1 - parp * 0.9)} fill="#fff" stroke={OL} strokeWidth={5} />
    {parp < 0.5 && <>
      <circle cx={-28 + mira} cy={4} r={17} fill="#140a06" /><circle cx={62 + mira} cy={-8} r={17} fill="#140a06" />
      <circle cx={-22 + mira} cy={-3} r={6} fill="#fff" /><circle cx={68 + mira} cy={-15} r={6} fill="#fff" />
    </>}
    <path d="M -70 -52 Q -46 -62 -12 -46" stroke="#6a3410" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M 26 -58 Q 58 -76 88 -54" stroke="#6a3410" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M -28 102 Q -14 ${46 + Math.sin(t * 18) * 3} 24 44 Q 62 42 76 92 Q 70 104 58 100 Q 24 84 -10 108 Q -24 112 -28 102 Z`} fill="#7a1414" stroke={OL} strokeWidth={5} />
    <path d="M -14 66 Q 24 46 64 62 L 60 72 Q 24 58 -10 76 Z" fill="#fff" />
    <path d="M 0 102 Q 26 84 54 96 Q 26 92 0 102 Z" fill="#ff6f7f" />
    <ellipse cx={-76} cy={50} rx={20} ry={11} fill="#ff7f7f" opacity={0.55} />
    <ellipse cx={100} cy={38} rx={20} ry={11} fill="#ff7f7f" opacity={0.55} />
    <path d="M 14 40 Q 22 48 30 40" stroke="#c7765a" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

const Casco: React.FC = () => (
  <g>
    <path d="M -128 -14 Q -134 -156 0 -160 Q 132 -158 132 -30 Z" fill="url(#pt_casco)" stroke={OL} strokeWidth={5} />
    <path d="M -100 -60 Q -92 -132 -20 -146" stroke="#fff2b0" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.75} />
    <path d="M -146 -2 Q 0 -60 150 -32" stroke={OL} strokeWidth={30} fill="none" strokeLinecap="round" />
    <path d="M -146 -2 Q 0 -60 150 -32" stroke="#b07a1c" strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M -144 -8 Q 0 -66 148 -38" stroke="#f0c050" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
    <path d="M -124 -6 L -138 66 Q -118 80 -100 70 L -96 -12 Z" fill="url(#pt_casco)" stroke={OL} strokeWidth={4} />
    <rect x={-14} y={-186} width={24} height={34} rx={7} fill="url(#pt_casco)" stroke={OL} strokeWidth={4} />
    {[-90, -40, 20, 80].map((x, i) => <circle key={i} cx={x} cy={-26 - i * 7} r={5} fill="#7a4a10" />)}
  </g>
);

// remero de atrás, con cuerpo, lorica y manos al remo
const Remero: React.FC<{ x: number; y: number; s: number; t: number; seed: number }> = ({ x, y, s, t, seed }) => {
  const k = Math.sin(t * 5 + seed) * 3;
  return (
    <g transform={`translate(${x} ${y + k}) scale(${s})`}>
      <path d="M -150 170 Q -170 60 -110 30 L 110 20 Q 170 50 160 170 Z" fill="url(#pt_tun)" stroke={OL} strokeWidth={5} />
      <rect x={-80} y={50} width={160} height={110} rx={10} fill="url(#pt_lor)" stroke={OL} strokeWidth={4} />
      {[80, 108, 136].map((yy) => <line key={yy} x1={-78} y1={yy} x2={78} y2={yy} stroke="#7d828e" strokeWidth={4} />)}
      <path d="M -130 60 Q -150 140 -60 170" stroke={OL} strokeWidth={62} fill="none" strokeLinecap="round" />
      <path d="M -130 60 Q -150 140 -60 170" stroke="#f4b088" strokeWidth={52} fill="none" strokeLinecap="round" />
      <path d="M 130 50 Q 160 130 90 160" stroke={OL} strokeWidth={62} fill="none" strokeLinecap="round" />
      <path d="M 130 50 Q 160 130 90 160" stroke="#f4b088" strokeWidth={52} fill="none" strokeLinecap="round" />
      <ellipse cx={-50} cy={168} rx={40} ry={32} fill="url(#pt_piel)" stroke={OL} strokeWidth={4} />
      <ellipse cx={92} cy={160} rx={40} ry={32} fill="url(#pt_piel)" stroke={OL} strokeWidth={4} />
      <g transform="translate(0 -90) rotate(-6)">
        <circle cx={0} cy={0} r={110} fill="url(#pt_piel)" stroke={OL} strokeWidth={5} />
        <ellipse cx={-106} cy={12} rx={18} ry={26} fill="#e89a72" stroke={OL} strokeWidth={4} />
        <Cara t={t + seed} parp={0} />
        <Casco />
      </g>
    </g>
  );
};

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  const u = ss(t / 1.4);
  const empuje = u * 60; // el espolón entra
  const z = 1 + u * 0.06; // la cámara empuja apenas
  const tiembla = t > 0.02 ? Math.sin(t * 47) * 2.5 * (1 - u * 0.5) : 0;
  const parp = t > 0.7 && t < 0.82 ? Math.sin(((t - 0.7) / 0.12) * Math.PI) : 0;
  const r = rnd(41);
  // astillas que vuelan desde el boquete (en t=0, donde están en la miniatura)
  const astillas = Array.from({ length: 30 }, () => {
    const a = (r() - 0.5) * Math.PI * 1.5 + Math.PI, d = 110 + r() * 330;
    return { x: 960 + Math.cos(a) * d * 0.7, y: 440 + Math.sin(a) * d * 1.05, rot: r() * 180, w: 50 + r() * 110, h: 16 + r() * 16, vx: (Math.cos(a) * 0.5 - 0.4) * (160 + r() * 240), vy: Math.sin(a) * (120 + r() * 200) - 60, vr: (r() - 0.5) * 500 };
  });
  const gotas = Array.from({ length: 140 }, () => ({ x: 900 + r() * 780, y: r() * 941, l: 22 + r() * 34 }));
  const salpic = Array.from({ length: 260 }, () => {
    const a = -Math.PI * 0.85 + r() * Math.PI * 1.7, d = 40 + Math.pow(r(), 0.7) * 380;
    return { x: 980 + Math.cos(a) * d * 0.9, y: 440 + Math.sin(a) * d, rr: 1.5 + r() * 5, vx: Math.cos(a) * 160 - 120, vy: Math.sin(a) * 140 };
  });
  const martillo = Array.from({ length: 160 }, () => ({ x: 960 + r() * 440, f: r(), rr: 2 + r() * 4 }));
  // vigas del techo en fuga hacia el fondo del pasillo (izquierda)
  const VP = [60, 250];
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080} viewBox="0 0 1672 941" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pt_mad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8783a" /><stop offset="0.5" stopColor="#9a5424" /><stop offset="1" stopColor="#6a3410" /></linearGradient>
        <linearGradient id="pt_madOsc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a2a0c" /><stop offset="1" stopColor="#8a4a1c" /></linearGradient>
        <radialGradient id="pt_glow"><stop offset="0" stopColor="#ffb040" stopOpacity={0.55} /><stop offset="0.4" stopColor="#ff8a20" stopOpacity={0.2} /><stop offset="1" stopColor="#ff8a20" stopOpacity={0} /></radialGradient>
        <radialGradient id="pt_calida" cx="0.25" cy="0.4" r="0.7"><stop offset="0" stopColor="#ffb040" stopOpacity={0.6} /><stop offset="0.6" stopColor="#ff7a1a" stopOpacity={0.25} /><stop offset="1" stopColor="#3a1404" stopOpacity={0.45} /></radialGradient>
        <linearGradient id="pt_fria" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#7ac0ff" stopOpacity={0.3} /><stop offset="1" stopColor="#7ac0ff" stopOpacity={0} /></linearGradient>
        <linearGradient id="pt_cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0e1a3a" /><stop offset="0.45" stopColor="#24427a" /><stop offset="1" stopColor="#2e6aa8" /></linearGradient>
        <linearGradient id="pt_mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2aa0c8" /><stop offset="0.5" stopColor="#146a9a" /><stop offset="1" stopColor="#0a3a62" /></linearGradient>
        <linearGradient id="pt_bronce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0b0" /><stop offset="0.22" stopColor="#f0c050" /><stop offset="0.55" stopColor="#b07a20" /><stop offset="0.85" stopColor="#6a4210" /><stop offset="1" stopColor="#3a2206" /></linearGradient>
        <linearGradient id="pt_bronceH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d070" /><stop offset="1" stopColor="#8a5a14" /></linearGradient>
        <linearGradient id="pt_rojo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a8141c" /><stop offset="0.5" stopColor="#d82a2a" /><stop offset="1" stopColor="#8a1018" /></linearGradient>
        <radialGradient id="pt_casco" cx="0.35" cy="0.25" r="0.8"><stop offset="0" stopColor="#ffe68a" /><stop offset="0.45" stopColor="#d9a032" /><stop offset="1" stopColor="#7a4a10" /></radialGradient>
        <radialGradient id="pt_piel" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#ffd8b4" /><stop offset="0.7" stopColor="#f4b088" /><stop offset="1" stopColor="#d88a62" /></radialGradient>
        <linearGradient id="pt_pielV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d88a62" /><stop offset="0.4" stopColor="#ffd2ac" /><stop offset="1" stopColor="#e89a72" /></linearGradient>
        <linearGradient id="pt_tun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0383a" /><stop offset="1" stopColor="#a0121a" /></linearGradient>
        <linearGradient id="pt_lor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f6fa" /><stop offset="0.5" stopColor="#c4c8d2" /><stop offset="1" stopColor="#8a8f9c" /></linearGradient>
        <linearGradient id="pt_hierro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8aeb8" /><stop offset="0.5" stopColor="#5a606a" /><stop offset="1" stopColor="#2a2e36" /></linearGradient>
        <linearGradient id="pt_cuero" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5428" /><stop offset="1" stopColor="#4a2408" /></linearGradient>
        <radialGradient id="pt_gota" cx="0.35" cy="0.6" r="0.6"><stop offset="0" stopColor="#e0f6ff" /><stop offset="1" stopColor="#38a8f0" /></radialGradient>
        <clipPath id="pt_boquete"><path d="M 860 0 L 1672 0 L 1672 941 L 1120 941 L 1080 860 L 1010 760 L 940 660 L 890 560 L 862 460 L 866 340 L 850 200 Z" /></clipPath>
      </defs>
      <g transform={`translate(${836 + tiembla} 470) scale(${z}) translate(-836 -470)`}>
        {/* ---------- el pasillo de remeros (cálido) ---------- */}
        <rect x={0} y={0} width={1672} height={941} fill="#6a3010" />
        {/* techo: tablas en fuga */}
        {Array.from({ length: 12 }, (_, i) => {
          const x0 = -40 + i * 80, x1 = x0 + 80;
          return <Tabla key={"te" + i} d={`M ${VP[0] + (x0 - VP[0]) * 0.05} ${VP[1] - 40 - i * 4} L ${x0} -10 L ${x1} -10 L ${VP[0] + (x1 - VP[0]) * 0.05} ${VP[1] - 44 - i * 4} Z`} fill={i % 2 ? "url(#pt_mad)" : "url(#pt_madOsc)"} vetas={[[x0 + 20, 10, VP[0] + 10, VP[1] - 60], [x0 + 50, 10, VP[0] + 20, VP[1] - 60]]} />;
        })}
        {/* vigas transversales del techo */}
        {Array.from({ length: 7 }, (_, i) => { const k = Math.pow(0.62, i); const y = VP[1] - 40 - (VP[1] + 30) * k; return <path key={"vt" + i} d={`M ${VP[0] - 200 * k} ${y} L ${VP[0] + 900 * k} ${y - 60 * k} L ${VP[0] + 900 * k} ${y - 60 * k + 36 * k} L ${VP[0] - 200 * k} ${y + 36 * k} Z`} fill="#4a2208" stroke={OL} strokeWidth={3} />; })}
        {/* paredes con postes */}
        {Array.from({ length: 8 }, (_, i) => { const k = Math.pow(0.7, i); const x = VP[0] + 760 * k; return <Tabla key={"po" + i} d={`M ${x} ${VP[1] - 260 * k} L ${x + 50 * k} ${VP[1] - 270 * k} L ${x + 50 * k} ${VP[1] + 420 * k} L ${x} ${VP[1] + 430 * k} Z`} vetas={[[x + 18 * k, VP[1] - 250 * k, x + 18 * k, VP[1] + 410 * k]]} />; })}
        <Tabla d="M 770 60 L 850 50 L 850 941 L 770 941 Z" vetas={[[790, 80, 792, 920], [820, 70, 824, 920]]} />
        {/* piso de tablas */}
        {Array.from({ length: 9 }, (_, i) => <Tabla key={"pi" + i} d={`M 0 ${760 + i * 22} L 900 ${720 + i * 30} L 900 ${750 + i * 30} L 0 ${782 + i * 22} Z`} fill={i % 2 ? "url(#pt_madOsc)" : "url(#pt_mad)"} vetas={[[20, 770 + i * 22, 880, 734 + i * 30]]} />)}
        <rect x={0} y={0} width={1672} height={941} fill="url(#pt_calida)" />
        {([[270, 250, 0.95], [150, 310, 0.7], [75, 350, 0.5], [36, 378, 0.36], [12, 396, 0.26], [735, 335, 0.9]] as const).map(([x, y, s], i) => <Antorcha key={i} x={x} y={y} s={s} t={t} i={i} />)}
        {/* los remeros de atrás */}
        <Remero x={12} y={472} s={0.3} t={t} seed={1} />
        <Remero x={78} y={470} s={0.44} t={t} seed={2} />
        <Remero x={230} y={470} s={0.66} t={t} seed={3} />
        <path d="M -20 470 L 330 420" stroke="#6a3a18" strokeWidth={22} strokeLinecap="round" />
        <path d="M -20 540 L 420 470" stroke="#9a5424" strokeWidth={30} strokeLinecap="round" />

        {/* ---------- el boquete: tormenta afuera (fría) ---------- */}
        <g clipPath="url(#pt_boquete)">
          <rect x={840} y={0} width={840} height={941} fill="url(#pt_cielo)" />
          {Array.from({ length: 5 }, (_, i) => <ellipse key={"nu" + i} cx={900 + i * 150} cy={40 + (i % 2) * 40} rx={160} ry={50} fill="#142450" opacity={0.7} />)}
          {/* ola que se enrosca, con espuma */}
          <path d={`M 840 ${470 + Math.sin(t * 3) * 8} Q 920 120 1160 90 Q 1320 80 1360 200 Q 1240 150 1180 240 Q 1120 340 1200 520 L 840 941 Z`} fill="url(#pt_mar)" />
          <path d={`M 880 ${420 + Math.sin(t * 3) * 8} Q 960 150 1160 112 Q 1300 100 1350 196 Q 1260 170 1200 210`} stroke="#ffffff" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.95} />
          <path d={`M 1300 ${620 + Math.sin(t * 2.4) * 10} Q 1480 540 1672 600 L 1672 941 L 1180 941 Z`} fill="url(#pt_mar)" />
          <path d={`M 1300 ${640 + Math.sin(t * 2.4) * 10} Q 1480 560 1672 620`} stroke="#e8fbff" strokeWidth={14} fill="none" opacity={0.9} />
          {Array.from({ length: 14 }, (_, i) => <path key={"cr" + i} d={`M ${1200 + i * 34} ${720 + (i % 4) * 40 + Math.sin(t * 3 + i) * 6} q 26 -26 60 -8 q -22 -2 -34 14 Z`} fill="#dff6ff" opacity={0.8} />)}
          {/* el barco enemigo: casco rojo con franjas negra y dorada y el ala */}
          <path d="M 1300 0 L 1672 0 L 1672 700 L 1440 680 Q 1330 380 1300 0 Z" fill="url(#pt_rojo)" stroke={OL} strokeWidth={5} />
          <path d="M 1300 0 L 1500 0 L 1500 60 L 1310 70 Z" fill="#2a1a14" />
          <path d="M 1312 90 L 1672 70 L 1672 110 L 1316 128 Z" fill="#1a0e0a" />
          <path d="M 1316 132 L 1672 114 L 1672 128 L 1318 146 Z" fill="#e0b040" />
          <path d="M 1350 380 L 1672 360 L 1672 400 L 1356 420 Z" fill="#1a0e0a" />
          <path d="M 1356 424 L 1672 404 L 1672 416 L 1358 436 Z" fill="#e0b040" />
          {[0, 1, 2, 3, 4].map((k) => <path key={"al" + k} d={`M ${1560 + k * 12} ${180 - k * 4} Q ${1600 + k * 14} ${120 - k * 14} ${1672} ${130 - k * 18}`} stroke="#f0c050" strokeWidth={12} fill="none" strokeLinecap="round" />)}
          {/* espolón */}
          <g transform={`translate(${-empuje} 0)`}>
            <path d="M 1530 300 L 1672 290 L 1672 640 L 1530 630 Z" fill="url(#pt_rojo)" stroke={OL} strokeWidth={4} />
            <rect x={1530} y={330} width={142} height={20} fill="#e0b040" />
            <rect x={1460} y={290} width={80} height={350} rx={18} fill="url(#pt_bronce)" stroke={OL} strokeWidth={6} />
            {[320, 380, 440, 500, 560, 610].map((yy) => <g key={yy}><circle cx={1500} cy={yy} r={9} fill="#5a3408" /><circle cx={1497} cy={yy - 3} r={3} fill="#ffe8a0" /></g>)}
            <rect x={1380} y={305} width={86} height={320} rx={16} fill="url(#pt_bronce)" stroke={OL} strokeWidth={6} />
            <rect x={1420} y={305} width={10} height={320} fill="#2a1606" opacity={0.6} />
            <path d="M 1390 312 L 935 440 Q 920 448 935 456 L 1390 618 Z" fill="url(#pt_bronce)" stroke={OL} strokeWidth={6} strokeLinejoin="round" />
            {martillo.map((m, i) => { const w = (m.x - 935) / 455; const y = 446 + (m.f - 0.5) * 300 * w; return <circle key={"m" + i} cx={m.x} cy={y} r={m.rr * (0.4 + w * 0.6)} fill={i % 3 ? "#6a4210" : "#fff2b8"} opacity={0.5} />; })}
            <path d="M 1380 335 L 990 444" stroke="#fffbe0" strokeWidth={12} strokeLinecap="round" opacity={0.8} />
            {[0, 1, 2, 3].map((k) => <path key={"ch" + k} d={`M ${1080 + k * 70} ${470 + k * 14} q 3 ${40 + Math.sin(t * 6 + k) * 10} -2 ${90 + k * 10}`} stroke="#e8fbff" strokeWidth={4} fill="none" opacity={0.85} />)}
          </g>
          {/* lluvia */}
          {gotas.map((g, i) => { const yy = (g.y + t * 1100) % 960 - 20; return <line key={"ll" + i} x1={g.x} y1={yy} x2={g.x - 10} y2={yy + g.l} stroke="#d8ecff" strokeWidth={2.5} opacity={0.55} />; })}
        </g>
        {/* espuma y salpicaduras que revientan por el boquete */}
        {Array.from({ length: 90 }, (_, i) => { const q = rnd(900 + i); const a = -Math.PI * 0.8 + q() * Math.PI * 1.6, d = 40 + q() * 240 + t * 80; const x = 990 - empuje * 0.6 + Math.cos(a) * d * 0.75, y = 450 + Math.sin(a) * d * 1.2; const rr = 8 + q() * 22; return <g key={"f" + i}><circle cx={x + 3} cy={y + 4} r={rr} fill="#8ac8f0" opacity={0.6} /><circle cx={x} cy={y} r={rr} fill="#ffffff" opacity={0.9} /></g>; })}
        {salpic.map((e, i) => <circle key={"s" + i} cx={e.x + e.vx * t} cy={e.y + e.vy * t + 260 * t * t} r={e.rr} fill={i % 5 ? "#ffffff" : "#bfe6ff"} opacity={0.92} />)}
        {Array.from({ length: 18 }, (_, i) => { const a = -Math.PI * 0.9 + i * (Math.PI * 1.8 / 17), d = 70 + (i % 4) * 36 + t * 60; return <path key={"rc" + i} d={`M ${950 - empuje} 446 L ${950 - empuje + Math.cos(a) * d * 1.2 + 30} ${446 + Math.sin(a) * d} L ${950 - empuje + Math.cos(a + 0.1) * d * 0.9 + 30} ${446 + Math.sin(a + 0.1) * d * 0.8} Z`} fill="#fff" opacity={0.8} />; })}
        {/* tablas quebradas clavadas en el borde del boquete */}
        {Array.from({ length: 16 }, (_, i) => {
          const q = rnd(300 + i); const a = Math.PI * 0.55 + (i / 15) * Math.PI * 0.95, R = 300 + q() * 60;
          const cx = 990 + Math.cos(a) * R * 0.55, cy = 450 - Math.sin(a - Math.PI) * R * 1.05;
          const L = 90 + q() * 80, rot = (a * 180) / Math.PI + 180 + (q() - 0.5) * 30;
          return <g key={"tq" + i} transform={`translate(${cx} ${cy}) rotate(${rot})`}><Tabla d={`M 0 -14 L ${L} -10 L ${L + 26} -2 L ${L + 6} 4 L ${L + 20} 12 L 0 14 Z`} vetas={[[6, -4, L, -2], [6, 6, L - 10, 7]]} /></g>;
        })}
        {astillas.map((a, i) => <g key={"a" + i} transform={`translate(${a.x + a.vx * t} ${a.y + a.vy * t + 200 * t * t}) rotate(${a.rot + a.vr * t})`}><Tabla d={`M ${-a.w / 2} ${-a.h / 2} L ${a.w / 2 - 10} ${-a.h / 2} L ${a.w / 2 + 12} ${-a.h / 4} L ${a.w / 2 - 4} 0 L ${a.w / 2 + 8} ${a.h / 3} L ${-a.w / 2} ${a.h / 2} L ${-a.w / 2 - 10} 0 Z`} vetas={[[-a.w / 2 + 6, -2, a.w / 2 - 6, -1]]} /></g>)}
        {/* astillas grandes del frente abajo a la derecha */}
        {Array.from({ length: 9 }, (_, i) => { const x = 1000 + i * 70, y = 840 + (i % 3) * 30; return <g key={"fr" + i} transform={`translate(${x} ${y}) rotate(${-60 + (i % 4) * 30})`}><Tabla d="M 0 -18 L 150 -12 L 170 0 L 150 6 L 162 18 L 0 18 Z" vetas={[[8, -6, 150, -4], [8, 8, 140, 9]]} /></g>; })}

        {/* ---------- el héroe ---------- */}
        {/* banco */}
        <Tabla d="M 230 736 L 800 714 L 800 760 L 230 784 Z" vetas={[[250, 750, 790, 728], [250, 768, 790, 744]]} />
        <Tabla d="M 230 784 L 800 760 L 800 800 L 230 826 Z" fill="url(#pt_madOsc)" vetas={[[250, 806, 790, 780]]} />
        <Tabla d="M 300 826 L 340 824 L 340 941 L 300 941 Z" fill="url(#pt_madOsc)" vetas={[[318, 830, 320, 930]]} />
        <g transform={`translate(${Math.sin(t * 31) * 1.5} ${Math.sin(t * 23) * 1.5})`}>
          {/* pierna izquierda (al piso) con sandalia */}
          <path d="M 400 690 Q 330 720 345 790 L 360 860 L 438 860 L 440 790 Q 470 740 470 700 Z" fill="url(#pt_pielV)" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          {[0, 1, 2, 3].map((k) => <path key={"sl" + k} d={`M ${350 - k * 2} ${770 + k * 22} Q 395 ${790 + k * 22} ${442} ${764 + k * 22}`} stroke="url(#pt_cuero)" strokeWidth={14} fill="none" strokeLinecap="round" />)}
          <path d="M 316 862 Q 330 846 360 850 L 440 852 Q 470 856 474 880 Q 420 896 316 890 Z" fill="url(#pt_pielV)" stroke={OL} strokeWidth={5} />
          {[350, 378, 404, 430].map((x) => <path key={"de" + x} d={`M ${x} 868 q 8 -8 16 0`} stroke={OL} strokeWidth={3} fill="none" />)}
          <path d="M 310 888 L 480 884 L 482 900 L 308 904 Z" fill="url(#pt_cuero)" stroke={OL} strokeWidth={4} />
          {/* pierna derecha (estirada al grillete) */}
          <path d="M 600 660 Q 720 690 790 760 L 870 820 L 830 860 L 760 810 Q 660 760 590 740 Z" fill="url(#pt_pielV)" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          {[0, 1, 2].map((k) => <path key={"sr" + k} d={`M ${770 + k * 26} ${760 + k * 20} L ${800 + k * 26} ${818 + k * 14}`} stroke="url(#pt_cuero)" strokeWidth={14} strokeLinecap="round" />)}
          <path d="M 832 856 Q 860 830 900 846 L 960 870 Q 990 884 984 904 Q 920 912 846 890 Z" fill="url(#pt_pielV)" stroke={OL} strokeWidth={5} />
          {/* grillete y cadena hasta la placa */}
          <g transform="rotate(38 872 824)"><rect x={836} y={798} width={74} height={50} rx={14} fill="url(#pt_hierro)" stroke="#14161a" strokeWidth={5} /><rect x={840} y={804} width={66} height={10} rx={5} fill="#d8dde6" opacity={0.6} /><circle cx={898} cy={823} r={6} fill="#14161a" /></g>
          {Array.from({ length: 11 }, (_, k) => { const cx = 920 + k * 27, cy = 852 + k * 3 + Math.sin(t * 20 + k) * 2; return <g key={"ca" + k} transform={`rotate(${k % 2 ? 0 : 60} ${cx} ${cy})`}><ellipse cx={cx} cy={cy} rx={16} ry={10} fill="none" stroke="#14161a" strokeWidth={10} /><ellipse cx={cx} cy={cy} rx={16} ry={10} fill="none" stroke="#9aa0aa" strokeWidth={5} /></g>; })}
          <rect x={1196} y={858} width={70} height={48} rx={6} fill="url(#pt_hierro)" stroke="#14161a" strokeWidth={5} />
          {[[1210, 872], [1252, 872], [1210, 894], [1252, 894]].map(([x, y], k) => <circle key={"pl" + k} cx={x} cy={y} r={5} fill="#14161a" />)}
          {/* falda con pliegues */}
          <path d="M 400 600 L 690 594 Q 760 650 800 720 Q 640 760 470 760 Q 380 740 380 690 Z" fill="url(#pt_tun)" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          {[470, 540, 610, 680].map((x, k) => <path key={"pf" + k} d={`M ${x} 616 Q ${x + 14 + k * 6} 680 ${x + 20 + k * 10} 748`} stroke="#8a0c14" strokeWidth={5} fill="none" opacity={0.8} />)}
          {/* torso */}
          <path d="M 352 470 Q 380 410 480 400 L 640 392 Q 700 404 700 470 L 690 600 L 400 606 Z" fill="url(#pt_tun)" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          {/* lorica con tiras y remaches */}
          <path d="M 450 450 L 660 440 L 664 600 L 452 606 Z" fill="url(#pt_lor)" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          {[488, 524, 560].map((yy) => <path key={"lo" + yy} d={`M 452 ${yy + 4} L 662 ${yy - 4}`} stroke="#6a707c" strokeWidth={5} />)}
          {[[466, 462], [646, 454], [466, 590], [648, 584]].map(([x, y], k) => <circle key={"re" + k} cx={x} cy={y} r={8} fill="url(#pt_bronceH)" stroke={OL} strokeWidth={2} />)}
          <path d="M 470 448 L 490 398 M 640 442 L 620 394" stroke="#6a3a14" strokeWidth={18} strokeLinecap="round" />
          {/* cinto con tachas y hebilla */}
          <path d="M 394 592 L 696 584 L 698 620 L 396 628 Z" fill="url(#pt_cuero)" stroke={OL} strokeWidth={4} />
          {[430, 470, 640, 676].map((x) => <circle key={"ta" + x} cx={x} cy={607} r={5} fill="#e0b040" />)}
          <circle cx={590} cy={606} r={19} fill="url(#pt_bronceH)" stroke={OL} strokeWidth={4} /><circle cx={585} cy={600} r={6} fill="#fff4c0" />
          {/* brazos al remo */}
          <path d="M 360 450 Q 316 470 330 520" stroke="#c81e26" strokeWidth={70} strokeLinecap="round" fill="none" />
          <path d="M 340 512 Q 350 560 430 556" stroke={OL} strokeWidth={56} strokeLinecap="round" fill="none" />
          <path d="M 340 512 Q 350 560 430 556" stroke="#f6bc94" strokeWidth={46} strokeLinecap="round" fill="none" />
          <path d="M 690 420 Q 740 430 730 470" stroke="#c81e26" strokeWidth={66} strokeLinecap="round" fill="none" />
          <path d="M 728 468 Q 734 500 760 504" stroke={OL} strokeWidth={54} strokeLinecap="round" fill="none" />
          <path d="M 728 468 Q 734 500 760 504" stroke="#f6bc94" strokeWidth={44} strokeLinecap="round" fill="none" />
        </g>
        {/* el remo, en diagonal, por encima de las manos */}
        <g transform={`translate(0 ${Math.sin(t * 4) * 5})`}>
          <path d="M -30 690 L 846 486 L 852 512 L -24 724 Z" fill="url(#pt_mad)" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
          <path d="M -20 694 L 840 492" stroke="#f0a860" strokeWidth={6} opacity={0.75} />
          {[0, 1, 2].map((k) => <path key={"rv" + k} d={`M ${40 + k * 220} ${700 - k * 52} L ${200 + k * 220} ${662 - k * 52}`} stroke="#5a2c0e" strokeWidth={2.5} opacity={0.7} />)}
          {/* manos cerradas sobre el remo */}
          {[[452, 552], [760, 494]].map(([x, y], k) => <g key={"ma" + k} transform={`translate(${x} ${y}) rotate(-13)`}>
            <path d="M -44 -30 Q -50 30 -10 40 L 40 38 Q 56 0 44 -32 Q 0 -44 -44 -30 Z" fill="url(#pt_piel)" stroke={OL} strokeWidth={5} />
            {[-22, 0, 22].map((fx) => <path key={fx} d={`M ${fx} -34 Q ${fx + 4} -6 ${fx} 12`} stroke="#b8704a" strokeWidth={4} fill="none" />)}
            <path d="M -40 -6 Q -20 -14 -8 -2" stroke="#b8704a" strokeWidth={4} fill="none" />
          </g>)}
        </g>
        {/* cabeza inclinada */}
        <g transform={`translate(${515 + Math.sin(t * 29) * 2} 352) rotate(-9)`}>
          <circle cx={0} cy={10} r={114} fill="url(#pt_piel)" stroke={OL} strokeWidth={5} />
          <ellipse cx={-110} cy={20} rx={20} ry={28} fill="#e89a72" stroke={OL} strokeWidth={4} />
          <Cara t={t} parp={parp} mira={Math.sin(t * 5) * 2} />
          <Casco />
          {/* lágrima que corre y gotas de sudor: en t=0 donde están en la miniatura, después caen */}
          <path d={`M -56 44 Q -60 ${80 + t * 30} -52 ${110 + t * 40}`} stroke="#7ad0ff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.9} />
          {[[-140, -30], [140, -40], [-96, -66], [176, 20], [-158, 40], [40, -96]].map(([x, y], i) => {
            const k = ((t * 1.3 + i * 0.37) % 1) * (t > 0.02 ? 1 : 0);
            return <path key={"su" + i} d={`M ${x} ${y + k * 110} q 13 22 0 32 q -13 -10 0 -32 Z`} fill="url(#pt_gota)" stroke="#1a5a8a" strokeWidth={2.5} opacity={1 - k * 0.6} />;
          })}
        </g>
        {/* luz fría de la tormenta que baña el costado derecho */}
        <rect x={500} y={0} width={420} height={941} fill="url(#pt_fria)" />
      </g>
    </svg>
  );
};
