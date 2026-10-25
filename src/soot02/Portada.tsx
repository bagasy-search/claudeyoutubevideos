import React from "react";
import { rnd } from "../soot/lib";

// soot02 · CUADRO 0 = la miniatura elegida (soot02_elegida.png) SIN el texto y SIN la flecha, rehecha en SVG.
// Adentro del casco a la luz de las antorchas: el remero aterrado con el remo y el grillete, la fila de remeros detrás,
// y a la derecha el casco que revienta: el espolón de bronce entra entre astillas, espuma y tormenta.
// En t=0 queda idéntica a la miniatura; después cobra vida (el espolón empuja, vuelan astillas, cae la lluvia, transpira).
// Coordenadas en el espacio de la miniatura (1672x941), escalado a 1920x1080.

const ss = (x: number) => Math.max(0, Math.min(1, x));

const Remerito: React.FC<{ x: number; y: number; s: number; t: number; seed: number }> = ({ x, y, s, t, seed }) => {
  const k = Math.sin(t * 5 + seed) * 4;
  return (
    <g transform={`translate(${x} ${y + k}) scale(${s})`}>
      <path d="M -70 60 Q -80 -10 -40 -30 L 40 -30 Q 80 -10 72 60 Z" fill="#c8202a" />
      <rect x={-46} y={-20} width={92} height={40} rx={6} fill="#b9bcc4" />
      <rect x={-46} y={-2} width={92} height={5} fill="#7d808a" />
      <circle cx={0} cy={-100} r={70} fill="#f2b48a" />
      <path d="M -76 -108 Q -74 -190 0 -192 Q 74 -190 76 -108 Z" fill="#d9a032" />
      <path d="M -86 -104 L 86 -104" stroke="#a8731c" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-24} cy={-86} rx={17} ry={20} fill="#fff" /><ellipse cx={24} cy={-86} rx={17} ry={20} fill="#fff" />
      <circle cx={-22} cy={-84} r={8} fill="#1a1010" /><circle cx={26} cy={-84} r={8} fill="#1a1010" />
      <path d="M -20 -42 Q 0 -62 20 -42 Q 0 -30 -20 -42 Z" fill="#6a1a1a" />
      <ellipse cx={-44} cy={-60} rx={12} ry={7} fill="#ff8a8a" opacity={0.6} /><ellipse cx={44} cy={-60} rx={12} ry={7} fill="#ff8a8a" opacity={0.6} />
      <path d="M 50 -130 q 8 14 0 22 q -8 -8 0 -22 Z" fill="#5ad0ff" />
      <path d="M 60 0 L 190 -40" stroke="#7a4a24" strokeWidth={22} strokeLinecap="round" />
    </g>
  );
};

const Antorcha: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => {
  const f = Math.sin(t * 13 + i * 2) * 6, g = Math.sin(t * 9 + i) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-40} r={90} fill="#ffb347" opacity={0.1} /><circle cx={0} cy={-44} r={44} fill="#ffd27a" opacity={0.18} />
      <rect x={-8} y={0} width={16} height={70} fill="#5a3418" />
      <path d="M -22 0 L 22 0 L 16 18 L -16 18 Z" fill="#8a5a2a" />
      <path d={`M -20 0 Q -26 -40 ${-4 + g} ${-86 - f} Q 4 -50 10 -60 Q 24 -30 20 0 Z`} fill="#ff7a1a" />
      <path d={`M -10 0 Q -12 -30 ${g * 0.5} ${-56 - f * 0.6} Q 10 -26 10 0 Z`} fill="#ffe08a" />
    </g>
  );
};

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  const u = ss(t / 1.4);
  const empuje = u * 70; // el espolón entra
  const z = 1 + u * 0.06; // la cámara empuja apenas
  const tiembla = t > 0.02 ? Math.sin(t * 47) * 3 * (1 - u * 0.5) : 0;
  const r = rnd(41);
  // astillas alrededor del boquete
  const astillas = Array.from({ length: 34 }, (_, i) => {
    const a = (r() - 0.5) * Math.PI * 1.6 + Math.PI, d = 120 + r() * 300;
    const cx = 980 + Math.cos(a) * d * 0.55, cy = 470 + Math.sin(a) * d;
    return { x: cx, y: cy, rot: r() * 180, w: 40 + r() * 110, h: 14 + r() * 18, vx: (Math.cos(a) * 0.5 - 0.4) * (180 + r() * 260), vy: Math.sin(a) * (120 + r() * 200), vr: (r() - 0.5) * 500 };
  });
  const gotas = Array.from({ length: 90 }, (_, i) => ({ x: 1000 + r() * 680, y: r() * 941, l: 20 + r() * 30 }));
  const espuma = Array.from({ length: 70 }, () => ({ x: 960 + r() * 420, y: 200 + r() * 500, rr: 2 + r() * 6, vx: -(60 + r() * 380), vy: (r() - 0.6) * 260 }));
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080} viewBox="0 0 1672 941" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pt_casco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a1606" /><stop offset="0.45" stopColor="#7a3a12" /><stop offset="1" stopColor="#4a1e08" /></linearGradient>
        <radialGradient id="pt_luz" cx="0.3" cy="0.35" r="0.6"><stop offset="0" stopColor="#ff9a2a" stopOpacity={0.7} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
        <linearGradient id="pt_cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2c5a" /><stop offset="0.6" stopColor="#2a5a9a" /><stop offset="1" stopColor="#1a4a7a" /></linearGradient>
        <linearGradient id="pt_bronce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a8" /><stop offset="0.35" stopColor="#d9a032" /><stop offset="0.7" stopColor="#8a5a14" /><stop offset="1" stopColor="#4a2a08" /></linearGradient>
        <clipPath id="pt_boquete"><path d="M 900 0 L 1672 0 L 1672 941 L 1180 941 L 1120 860 L 1060 780 L 1010 690 L 960 600 L 930 520 L 905 420 L 900 300 L 880 200 Z" /></clipPath>
      </defs>
      <g transform={`translate(${836 + tiembla} 470) scale(${z}) translate(-836 -470)`}>
        {/* casco por dentro: paredes, techo de vigas en perspectiva hacia la izquierda */}
        <rect x={0} y={0} width={1672} height={941} fill="url(#pt_casco)" />
        {Array.from({ length: 9 }, (_, i) => <path key={"v" + i} d={`M ${-40 + i * 30} ${60 + i * 26} L ${900} ${-20 + i * 6}`} stroke="#3a1a08" strokeWidth={14 - i} opacity={0.7} />)}
        {Array.from({ length: 7 }, (_, i) => <rect key={"c" + i} x={20 + i * 120 * (1 + i * 0.2)} y={0} width={30 + i * 10} height={941} fill="#4a220c" opacity={0.55} />)}
        {Array.from({ length: 10 }, (_, i) => <path key={"p" + i} d={`M 0 ${700 + i * 24} L 900 ${640 + i * 34}`} stroke="#3a1a08" strokeWidth={6} opacity={0.5} />)}
        <rect x={0} y={0} width={1672} height={941} fill="url(#pt_luz)" />
        {[[180, 300, 0.7], [70, 340, 0.5], [720, 330, 0.9], [440, 260, 0.6], [20, 360, 0.4]].map(([x, y, s], i) => <Antorcha key={i} x={x} y={y} s={s} t={t} i={i} />)}
        {/* la fila de remeros detrás (perspectiva) */}
        <Remerito x={20} y={520} s={0.4} t={t} seed={1} />
        <Remerito x={90} y={530} s={0.55} t={t} seed={2} />
        <Remerito x={230} y={520} s={0.85} t={t} seed={3} />
        {/* banco */}
        <path d="M 0 760 L 900 730 L 900 941 L 0 941 Z" fill="#3a1a08" />
        {Array.from({ length: 6 }, (_, i) => <path key={"t" + i} d={`M 0 ${780 + i * 30} L 900 ${750 + i * 34}`} stroke="#5a3010" strokeWidth={8} />)}
        {/* boquete: tormenta afuera, el barco enemigo rojo y el espolón */}
        <g clipPath="url(#pt_boquete)">
          <rect x={880} y={0} width={800} height={941} fill="url(#pt_cielo)" />
          <path d={`M 880 ${520 + Math.sin(t * 3) * 10} Q 1100 420 1300 560 Q 1480 660 1672 520 L 1672 941 L 880 941 Z`} fill="#1f6aa8" />
          <path d={`M 880 ${640 + Math.sin(t * 2.4) * 12} Q 1150 560 1400 700 Q 1550 770 1672 660 L 1672 941 L 880 941 Z`} fill="#14507e" />
          {Array.from({ length: 9 }, (_, i) => <path key={"w" + i} d={`M ${900 + i * 90} ${620 + (i % 3) * 60 + Math.sin(t * 3 + i) * 8} q 40 -40 90 -10 q -30 -6 -50 20 Z`} fill="#e8f6ff" opacity={0.85} />)}
          <path d={`M 880 ${380 + Math.sin(t * 2) * 10} Q 960 300 1040 360 Q 1000 330 960 380 Z`} fill="#fff" opacity={0.8} />
          {/* casco rojo del barco enemigo arriba a la derecha */}
          <path d="M 1330 0 L 1672 0 L 1672 640 L 1420 600 Q 1340 360 1330 0 Z" fill="#c8202a" />
          <rect x={1330} y={60} width={342} height={26} fill="#1a1010" />
          <rect x={1330} y={96} width={342} height={10} fill="#d9a032" />
          <rect x={1370} y={300} width={302} height={30} fill="#1a1010" />
          <path d="M 1560 140 Q 1610 90 1660 110 Q 1620 150 1600 200 Z" fill="#d9a032" opacity={0.85} />
          {/* espolón */}
          <g transform={`translate(${-empuje} 0)`}>
            <path d="M 1420 360 L 1672 330 L 1672 690 L 1420 640 Z" fill="#c8202a" />
            <rect x={1440} y={330} width={60} height={330} rx={10} fill="url(#pt_bronce)" stroke="#4a2a08" strokeWidth={6} />
            <rect x={1370} y={370} width={80} height={260} rx={14} fill="url(#pt_bronce)" stroke="#4a2a08" strokeWidth={6} />
            <path d="M 1380 380 L 940 450 Q 925 462 940 474 L 1380 620 Z" fill="url(#pt_bronce)" stroke="#5a3408" strokeWidth={5} />
            <path d="M 1370 400 L 980 455" stroke="#fff3c4" strokeWidth={10} strokeLinecap="round" opacity={0.75} />
            {[420, 470, 520, 570].map((yy) => <circle key={yy} cx={1410} cy={yy} r={7} fill="#4a2a08" />)}
          </g>
          {/* lluvia */}
          {gotas.map((g, i) => { const yy = (g.y + t * 900) % 941; return <line key={i} x1={g.x} y1={yy} x2={g.x - 8} y2={yy + g.l} stroke="#cfe6ff" strokeWidth={3} opacity={0.6} />; })}
        </g>
        {/* espuma que entra */}
        {espuma.map((e, i) => <circle key={"e" + i} cx={e.x + e.vx * t} cy={e.y + e.vy * t + 200 * t * t} r={e.rr} fill="#fff" opacity={0.92} />)}
        {/* anillo de espuma que revienta por el boquete (como en la miniatura) */}
        {Array.from({ length: 46 }, (_, i) => { const rr2 = rnd(900 + i); const a = -Math.PI * 0.75 + rr2() * Math.PI * 1.5, d = 70 + rr2() * 200 + t * 90; const x = 1000 - empuje * 0.6 + Math.cos(a) * d * 0.8, y = 450 + Math.sin(a) * d * 1.25; return <circle key={"f" + i} cx={x} cy={y} r={14 + rr2() * 30} fill={i % 4 ? "#ffffff" : "#d8eeff"} opacity={0.88} />; })}
        {/* el rocío blanco que revienta alrededor de la punta */}
        {Array.from({ length: 16 }, (_, i) => { const a = -Math.PI * 0.9 + i * (Math.PI * 1.8 / 15), d = 60 + (i % 4) * 34 + t * 70; return <path key={"r" + i} d={`M ${960 - empuje} 450 L ${960 - empuje + Math.cos(a) * d * 1.2 + 40} ${450 + Math.sin(a) * d} L ${960 - empuje + Math.cos(a + 0.12) * d * 0.9 + 40} ${450 + Math.sin(a + 0.12) * d * 0.8} Z`} fill="#fff" opacity={0.9} />; })}
        {/* borde astillado del boquete */}
        <path d="M 880 200 L 900 300 L 905 420 L 930 520 L 960 600 L 1010 690 L 1060 780 L 1120 860 L 1180 941" stroke="#5a3010" strokeWidth={26} fill="none" strokeLinejoin="bevel" />
        {Array.from({ length: 14 }, (_, i) => { const y = 220 + i * 52, x = 890 + i * 20; return <path key={"b" + i} d={`M ${x} ${y} l ${-40 - (i % 3) * 20} ${-10 + (i % 2) * 24} l ${10} ${18}`} fill="#8a5a2a" stroke="#4a2a10" strokeWidth={4} />; })}
        {astillas.map((a, i) => <rect key={"a" + i} x={-a.w / 2} y={-a.h / 2} width={a.w} height={a.h} rx={3} fill={i % 3 ? "#a8682c" : "#7a4a1c"} stroke="#4a2a10" strokeWidth={3} transform={`translate(${a.x + a.vx * t} ${a.y + a.vy * t + 160 * t * t}) rotate(${a.rot + a.vr * t})`} />)}
        {/* el banco bajo el héroe */}
        <path d="M 240 716 L 780 694 L 780 736 L 240 762 Z" fill="#8a5428" stroke="#3a1a08" strokeWidth={5} />
        <path d="M 240 762 L 780 736 L 780 941 L 240 941 Z" fill="#4a2410" opacity={0.85} />
        {/* el héroe (coordenadas de la miniatura) */}
        <g transform={`translate(${Math.sin(t * 31) * 2} ${Math.sin(t * 23) * 2})`}>
          {/* piernas: izquierda baja al piso, derecha estirada hacia el grillete */}
          <path d="M 440 690 Q 370 760 392 846" stroke="#f2b48a" strokeWidth={46} strokeLinecap="round" fill="none" />
          <path d="M 590 690 Q 760 740 872 828" stroke="#f2b48a" strokeWidth={46} strokeLinecap="round" fill="none" />
          {[790, 810, 830].map((yy) => <line key={yy} x1={372} y1={yy} x2={412} y2={yy + 6} stroke="#6a3a18" strokeWidth={9} />)}
          <path d="M 352 852 L 430 852 Q 450 892 340 892 Z" fill="#6a3a18" stroke="#3a1a08" strokeWidth={4} />
          {[0, 1, 2].map((k) => <line key={k} x1={780 + k * 26} y1={772 + k * 18} x2={804 + k * 26} y2={752 + k * 18} stroke="#6a3a18" strokeWidth={9} />)}
          <path d="M 878 822 L 970 852 Q 980 892 880 870 Z" fill="#6a3a18" stroke="#3a1a08" strokeWidth={4} />
          {/* grillete y cadena hasta la placa */}
          <rect x={842} y={800} width={66} height={40} rx={12} fill="#7a7f8a" stroke="#2a2a30" strokeWidth={5} transform="rotate(34 875 820)" />
          {Array.from({ length: 10 }, (_, k) => <ellipse key={k} cx={918 + k * 32} cy={846 + k * 5 + Math.sin(t * 20 + k) * 2} rx={17} ry={10} fill="none" stroke="#4a4f5a" strokeWidth={7} transform={`rotate(${k % 2 ? 0 : 20} ${918 + k * 32} ${846 + k * 5})`} />)}
          <rect x={1230} y={868} width={58} height={40} rx={6} fill="#8a8f9a" stroke="#2a2a30" strokeWidth={5} />
          {/* falda, torso, lorica y cinto */}
          <path d="M 380 600 L 650 600 L 712 724 Q 540 750 336 730 Z" fill="#d8202a" stroke="#8a1018" strokeWidth={4} />
          <path d="M 372 446 Q 505 412 650 446 L 654 604 L 378 604 Z" fill="#d8202a" stroke="#8a1018" strokeWidth={4} />
          <rect x={398} y={452} width={232} height={96} rx={10} fill="#c4c8d0" stroke="#5a5f6a" strokeWidth={5} />
          {[480, 506, 530].map((yy) => <line key={yy} x1={400} y1={yy} x2={628} y2={yy} stroke="#7d808a" strokeWidth={4} />)}
          {[420, 610].map((xx) => <circle key={xx} cx={xx} cy={466} r={6} fill="#d9a032" />)}
          <rect x={376} y={584} width={280} height={30} rx={8} fill="#6a3a18" stroke="#3a1a08" strokeWidth={3} />
          <circle cx={515} cy={599} r={15} fill="#d9a032" stroke="#6a4a10" strokeWidth={4} />
          {/* brazos al remo */}
          <path d="M 390 462 Q 330 520 360 560" stroke="#d8202a" strokeWidth={50} strokeLinecap="round" fill="none" />
          <path d="M 360 560 L 440 528" stroke="#f2b48a" strokeWidth={40} strokeLinecap="round" />
          <path d="M 634 458 Q 690 470 700 500" stroke="#d8202a" strokeWidth={48} strokeLinecap="round" fill="none" />
          <path d="M 700 500 L 744 500" stroke="#f2b48a" strokeWidth={40} strokeLinecap="round" />
        </g>
        {/* el remo, en diagonal, por encima de las manos */}
        <path d={`M -20 ${580 + Math.sin(t * 4) * 6} L 860 ${484 + Math.sin(t * 4) * 6}`} stroke="#7a4a24" strokeWidth={32} strokeLinecap="round" />
        <path d={`M -20 ${572 + Math.sin(t * 4) * 6} L 860 ${476 + Math.sin(t * 4) * 6}`} stroke="#b8783a" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
        <ellipse cx={450} cy={530} rx={34} ry={30} fill="#f2b48a" stroke="#c98a5a" strokeWidth={4} />
        <ellipse cx={752} cy={498} rx={34} ry={30} fill="#f2b48a" stroke="#c98a5a" strokeWidth={4} />
        {/* cabeza */}
        <g transform={`translate(${505 + Math.sin(t * 29) * 3} 335)`}>
          <circle cx={0} cy={0} r={104} fill="#f2b48a" stroke="#c98a5a" strokeWidth={3} />
          <ellipse cx={-98} cy={8} rx={18} ry={26} fill="#e8a07a" />
          <path d="M -118 -38 Q -112 -140 0 -142 Q 112 -140 118 -38 Z" fill="#d9a032" stroke="#8a5a14" strokeWidth={4} />
          <path d="M -104 -56 Q -96 -126 -10 -132" stroke="#ffe08a" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />
          <path d="M -128 -38 L 128 -38" stroke="#a8731c" strokeWidth={20} strokeLinecap="round" />
          <path d="M -112 -30 L -126 40 L -100 44 Z" fill="#c8902a" stroke="#8a5a14" strokeWidth={3} />
          <ellipse cx={-36} cy={0} rx={31} ry={37} fill="#fff" stroke="#1a1010" strokeWidth={4} />
          <ellipse cx={48} cy={-6} rx={31} ry={37} fill="#fff" stroke="#1a1010" strokeWidth={4} />
          <circle cx={-34 + Math.sin(t * 6) * 3} cy={2} r={14} fill="#1a1010" /><circle cx={50 + Math.sin(t * 6) * 3} cy={-4} r={14} fill="#1a1010" />
          <circle cx={-30} cy={-4} r={4} fill="#fff" /><circle cx={54} cy={-10} r={4} fill="#fff" />
          <path d="M -66 -40 Q -40 -54 -12 -42" stroke="#5a3418" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M 20 -48 Q 50 -60 80 -44" stroke="#5a3418" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M -34 88 Q -30 34 8 32 Q 48 34 52 86 Q 8 74 -34 88 Z" fill="#6a1a1a" stroke="#3a0a0a" strokeWidth={4} />
          <path d="M -22 46 Q 8 36 40 46 L 36 54 Q 8 46 -18 54 Z" fill="#fff" />
          <path d="M -16 84 Q 8 70 34 82 Q 8 78 -16 84 Z" fill="#ff7a8a" />
          <ellipse cx={-74} cy={44} rx={18} ry={10} fill="#ff8a8a" opacity={0.6} /><ellipse cx={86} cy={36} rx={18} ry={10} fill="#ff8a8a" opacity={0.6} />
          {/* gotas de sudor: en t=0 donde están en la miniatura, después caen */}
          {[[-128, 10], [118, 20], [-80, -24], [140, -20], [-148, 56]].map(([x, y], i) => {
            const k = ((t * 1.3 + i * 0.37) % 1) * (t > 0.02 ? 1 : 0);
            return <path key={i} d={`M ${x} ${y + k * 120} q 12 20 0 30 q -12 -10 0 -30 Z`} fill="#5ad0ff" stroke="#fff" strokeWidth={3} opacity={1 - k * 0.6} />;
          })}
        </g>
      </g>
    </svg>
  );
};
