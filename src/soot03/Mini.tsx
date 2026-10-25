import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { K, Pal } from "./mundo";

// CUADRO 0 = la miniatura elegida (D:/rtmp/soot_ola/minis/soot03_elegida.png) rehecha en código, sin el texto ni la
// flecha: el legionario congelado en el muro, con las dos medias mojadas en alto, la antorcha a la izquierda, el muro
// que se pierde a la derecha y la horda de ojos en la niebla. En t=0 es la miniatura quieta; enseguida cobra vida
// (lluvia, goteo, antorcha, ojos que parpadean, tirita) y la cámara empuja a la cara hasta fundirse con el primer
// plano del protagonista en el muro (P0 arranca justo ahí).
const pr = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const FIN = 1.3;
export const keysM: K[] = [];
export const ambM: [number, Pal][] = [];

// la horda: [x, y, escala] (de atrás chiquitos a adelante grandes)
const HORDA: [number, number, number][] = [];
for (let f = 0; f < 7; f++) {
  const n = 9 + f * 2, y = 380 + f * 58, s = 0.22 + f * 0.11;
  for (let i = 0; i < n; i++) {
    const x = 1000 + (i + (f % 2) * 0.5) * (930 / n) + (rnd(f * 31 + i) - 0.5) * 90;
    if (y > 545 + (x - 1000) * 0.33 + 40 && f > 1) continue; // detrás del muro de la derecha no se ve
    HORDA.push([x, y + (rnd(i * 7 + f) - 0.5) * 50, s]);
  }
}
HORDA.push([1607, 700, 1.25], [1825, 728, 1.35], [1458, 545, 1.0], [1300, 515, 0.9], [1182, 488, 0.85], [1712, 600, 1.05]);
HORDA.sort((a, b) => a[1] - b[1]);

const Bicho: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => {
  const parp = (t * 1.7 + rnd(i) * 10) % 3.1 < 0.12 && t > 0.05 ? 0.15 : 1;
  const brillo = 0.8 + 0.2 * Math.sin(t * 6 + i);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {i % 3 === 0 && <><line x1={62} y1={70} x2={70} y2={-120} stroke="#121a2a" strokeWidth={7} /><path d="M 62 -150 L 78 -112 L 60 -112 Z" fill="#121a2a" /></>}
      <path d="M -70 90 Q -78 -10 -40 -48 Q 0 -70 40 -48 Q 78 -10 70 90 Z" fill="#141c2e" />
      <path d="M -38 -46 Q -70 -70 -62 -100 Q -48 -72 -26 -58 Z" fill="#141c2e" />
      <path d="M 38 -46 Q 70 -70 62 -100 Q 48 -72 26 -58 Z" fill="#141c2e" />
      <g transform={`scale(1 ${parp})`} style={{ transformOrigin: "0px -10px" }}>
        <circle cx={-18} cy={-12} r={16} fill="#ff8a1a" opacity={0.35 * brillo} />
        <circle cx={18} cy={-12} r={16} fill="#ff8a1a" opacity={0.35 * brillo} />
        <path d="M -28 -16 L -8 -10 L -12 -4 L -28 -8 Z" fill="#ffb84a" opacity={brillo} />
        <path d="M 28 -16 L 8 -10 L 12 -4 L 28 -8 Z" fill="#ffb84a" opacity={brillo} />
      </g>
    </g>
  );
};
const Llama: React.FC<{ x: number; y: number; s: number; t: number; i: number }> = ({ x, y, s, t, i }) => {
  const f = 1 + 0.12 * Math.sin(t * 22 + i) + 0.06 * Math.sin(t * 37 + i * 2);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-40} r={150} fill="#ff8a1a" opacity={0.18} />
      <circle cx={0} cy={-40} r={80} fill="#ffb347" opacity={0.25} />
      <g transform={`scale(${2 - f} ${f})`}>
        <path d="M 0 -150 Q 46 -80 40 -30 Q 34 6 0 10 Q -34 6 -40 -30 Q -46 -80 0 -150 Z" fill="#ff6a1a" />
        <path d="M 0 -110 Q 26 -60 22 -26 Q 18 2 0 4 Q -18 2 -22 -26 Q -26 -60 0 -110 Z" fill="#ffd25a" />
      </g>
    </g>
  );
};
const Nieve: React.FC<{ d: string }> = ({ d }) => <path d={d} fill="#e8f2fb" stroke="#bcd3ea" strokeWidth={3} />;
// carámbanos colgando de un borde (x0..x1 a la altura y)
const Hielo: React.FC<{ x0: number; x1: number; y: number; n: number; l?: number; seed?: number }> = ({ x0, x1, y, n, l = 40, seed = 1 }) => (
  <>{Array.from({ length: n }, (_, i) => { const x = x0 + ((i + 0.5) / n) * (x1 - x0); const h = l * (0.5 + rnd(i * 13 + seed)); return <path key={i} d={`M ${x - 7} ${y} L ${x + 7} ${y} L ${x} ${y + h} Z`} fill="#cfe6fa" opacity={0.9} />; })}</>
);
const Media: React.FC<{ x: number; y: number; rot: number; t: number; flip?: boolean }> = ({ x, y, rot, t, flip }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot + Math.sin(t * 5) * 2}) scale(${flip ? -1 : 1} 1)`}>
    {/* caña */}
    <path d="M -58 0 L 58 0 L 62 250 Q 64 300 100 320 Q 140 345 118 390 Q 96 420 40 400 L -40 360 Q -70 340 -66 280 Z" fill="#8a7a6a" stroke="#4a3a2e" strokeWidth={6} />
    {[30, 70, 110, 150, 190, 230].map((y, i) => <path key={i} d={`M -60 ${y} Q 0 ${y + 10} 60 ${y}`} stroke={i % 2 ? "#6a5a4a" : "#a89888"} strokeWidth={9} fill="none" />)}
    <path d="M -64 50 L 60 50" stroke="#3a2a22" strokeWidth={10} /><path d="M -64 66 L 60 66" stroke="#3a2a22" strokeWidth={6} />
    <path d="M 40 330 Q 110 330 118 380 Q 100 410 50 396 Z" fill="#5a4a3e" />
    <path d="M -62 0 Q 0 -20 62 0 L 58 18 Q 0 4 -58 18 Z" fill="#e8f2fb" />
    <Hielo x0={-58} x1={58} y={10} n={5} l={34} seed={rot} />
    {/* gotas que caen */}
    {[0, 1, 2, 3].map((k) => { const ph = ((t * 1.6 + k * 0.27 + (flip ? 0.13 : 0)) % 1); return <ellipse key={k} cx={-40 + k * 34} cy={330 + k * 18 + ph * 140} rx={7} ry={11} fill="#bfe3ff" opacity={t > 0.04 ? 1 - ph : 1} />; })}
    <path d="M -50 300 Q -48 340 -44 352" stroke="#bfe3ff" strokeWidth={8} strokeLinecap="round" fill="none" />
  </g>
);
const Soldado: React.FC<{ t: number }> = ({ t }) => {
  const tir = t > 0.15 ? Math.sin(t * 34) * 1.6 : 0;
  const parp = t > 0.55 && t < 0.68 ? 0.1 : 1;
  return (
    <g transform={`translate(${tir} 0)`}>
      {/* capa y túnica */}
      <path d="M 470 1080 L 440 760 Q 470 690 540 670 L 850 670 Q 905 690 920 760 L 900 1080 Z" fill="#8f1a20" />
      <path d="M 520 1080 L 530 700 Q 560 664 610 660 L 770 660 Q 820 664 840 700 L 860 1080 Z" fill="#c8262c" />
      {/* brazos levantados: manga corta roja y brazo desnudo */}
      <path d="M 450 640 Q 400 600 360 540" stroke="#f2c09a" strokeWidth={54} strokeLinecap="round" fill="none" />
      <path d="M 900 650 Q 990 630 1060 590" stroke="#f2c09a" strokeWidth={54} strokeLinecap="round" fill="none" />
      <path d="M 560 700 Q 500 680 455 645" stroke="#c8262c" strokeWidth={76} strokeLinecap="round" fill="none" />
      <path d="M 815 700 Q 860 680 895 652" stroke="#c8262c" strokeWidth={76} strokeLinecap="round" fill="none" />
      <path d="M 430 600 Q 400 580 380 556" stroke="#cfe6fa" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.8} />
      {/* lorica */}
      <path d="M 545 690 L 830 690 L 840 905 L 535 905 Z" fill="#b8bec8" stroke="#6a7080" strokeWidth={8} />
      {[740, 790, 840].map((y) => <path key={y} d={`M 540 ${y} L 836 ${y}`} stroke="#8a909c" strokeWidth={8} />)}
      <path d="M 540 690 Q 570 655 610 660 L 600 740 L 540 730 Z" fill="#9aa0ac" /><path d="M 835 690 Q 805 655 765 660 L 775 740 L 835 730 Z" fill="#9aa0ac" />
      <rect x={530} y={895} width={320} height={44} rx={10} fill="#6b3a1f" /><circle cx={690} cy={917} r={24} fill="#e6b422" />
      <path d="M 600 660 L 560 900" stroke="#6b3a1f" strokeWidth={22} /><path d="M 780 660 L 820 900" stroke="#6b3a1f" strokeWidth={22} />
      <Hielo x0={545} x1={830} y={905} n={8} l={50} seed={4} />
      {/* manos */}
      <circle cx={350} cy={525} r={48} fill="#f2c09a" /><circle cx={1075} cy={580} r={48} fill="#f2c09a" />
      <path d="M 320 500 Q 350 480 385 500" stroke="#d99a72" strokeWidth={8} fill="none" />
      {/* cabeza: cara azul de frío */}
      <ellipse cx={677} cy={560} rx={150} ry={135} fill="#7aa0e8" />
      <ellipse cx={677} cy={610} rx={130} ry={85} fill="#8fb2f0" />
      <circle cx={570} cy={620} r={30} fill="#f0a0b4" opacity={0.7} /><circle cx={790} cy={620} r={30} fill="#f0a0b4" opacity={0.7} />
      {/* ojos grandes asustados */}
      <g transform={`translate(0 ${560 * (1 - parp)}) scale(1 ${parp})`}>
        <ellipse cx={620} cy={555} rx={46} ry={54} fill="#fff" /><ellipse cx={738} cy={555} rx={46} ry={54} fill="#fff" />
        <circle cx={632} cy={565} r={26} fill="#1b1240" /><circle cx={726} cy={565} r={26} fill="#1b1240" />
        <circle cx={640} cy={554} r={9} fill="#fff" /><circle cx={734} cy={554} r={9} fill="#fff" />
      </g>
      <path d="M 574 500 Q 610 496 648 478" stroke="#1b1240" strokeWidth={12} strokeLinecap="round" fill="none" /><path d="M 784 500 Q 748 496 710 478" stroke="#1b1240" strokeWidth={12} strokeLinecap="round" fill="none" />
      {/* lágrimas */}
      <path d="M 590 600 Q 584 640 594 660" stroke="#cfeaff" strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M 770 600 Q 778 640 768 660" stroke="#cfeaff" strokeWidth={14} strokeLinecap="round" fill="none" />
      {/* boca apretada con dientes */}
      <rect x={622} y={630} width={112} height={50} rx={22} fill="#1b1240" />
      <rect x={630} y={636} width={96} height={38} rx={14} fill="#fff" />
      {[652, 676, 700].map((x) => <line key={x} x1={x} y1={636} x2={x} y2={674} stroke="#9aa" strokeWidth={4} />)}
      <line x1={630} y1={655} x2={726} y2={655} stroke="#9aa" strokeWidth={4} />
      {/* casco dorado con hielo */}
      <path d="M 500 520 Q 500 340 677 330 Q 855 340 855 520 L 830 520 Q 820 420 677 410 Q 535 420 525 520 Z" fill="#e0a82e" stroke="#9a6a14" strokeWidth={8} />
      <path d="M 520 470 Q 677 430 835 470" stroke="#9a6a14" strokeWidth={10} fill="none" />
      <rect x={662} y={318} width={30} height={30} rx={8} fill="#c99a2a" />
      <path d="M 495 520 L 470 640 Q 500 650 520 600 L 525 520 Z" fill="#e0a82e" stroke="#9a6a14" strokeWidth={6} />
      <path d="M 860 520 L 885 640 Q 855 650 835 600 L 830 520 Z" fill="#e0a82e" stroke="#9a6a14" strokeWidth={6} />
      <path d="M 560 360 Q 677 320 800 360" stroke="#fff4c0" strokeWidth={10} fill="none" opacity={0.7} />
      <Hielo x0={505} x1={850} y={515} n={12} l={46} seed={9} />
      <path d="M 560 352 Q 677 316 795 352 L 790 368 Q 677 336 565 368 Z" fill="#e8f2fb" />
    </g>
  );
};

export const Mini: React.FC<{ t: number }> = ({ t }) => {
  const push = pr(t, 0.25, FIN);
  const sc = 1 + push * 0.6;
  const op = 1 - pr(t, 1.0, 1.18);
  const wind = t * 1400;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(960 - 677) * push}px, ${(420 - 560) * push}px) scale(${sc})`, transformOrigin: "677px 560px" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="mcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1428" /><stop offset="0.45" stopColor="#1d3a66" /><stop offset="1" stopColor="#24406a" /></linearGradient>
            <radialGradient id="mluz" cx="0.78" cy="0.12" r="0.5"><stop offset="0" stopColor="#5f8fd0" stopOpacity="0.55" /><stop offset="1" stopColor="#5f8fd0" stopOpacity="0" /></radialGradient>
            <radialGradient id="mfuego" cx="0.04" cy="0.42" r="0.35"><stop offset="0" stopColor="#ff7a1a" stopOpacity="0.55" /><stop offset="1" stopColor="#ff7a1a" stopOpacity="0" /></radialGradient>
            <linearGradient id="mpiedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4258" /><stop offset="1" stopColor="#1e2436" /></linearGradient>
          </defs>
          <rect width={1920} height={1080} fill="url(#mcielo)" />
          <rect width={1920} height={1080} fill="url(#mluz)" />
          {/* nubes */}
          {[[1200, 70, 260], [1500, 40, 300], [1800, 110, 240], [1000, 130, 200], [1650, 180, 220]].map(([x, y, r], i) => <ellipse key={i} cx={x + Math.sin(t * 0.5 + i) * 6} cy={y} rx={r} ry={r * 0.32} fill="#16284a" opacity={0.85} />)}
          {/* montañas */}
          <path d="M 860 200 Q 1050 120 1200 160 Q 1350 100 1500 140 Q 1650 95 1920 130 L 1920 420 L 860 420 Z" fill="#2a4266" />
          <path d="M 880 270 Q 1080 200 1260 240 Q 1450 190 1640 230 Q 1780 200 1920 220 L 1920 470 L 880 470 Z" fill="#1c2e4c" />
          {Array.from({ length: 60 }, (_, i) => { const x = 880 + rnd(i + 300) * 1040, y = 250 + rnd(i + 400) * 120; return <path key={"p" + i} d={`M ${x} ${y - 34} L ${x + 14} ${y} L ${x - 14} ${y} Z`} fill="#16243c" />; })}
          {/* muro lejano en la loma */}
          <path d="M 960 300 L 1050 288 L 1050 330 L 960 340 Z" fill="#26324a" />
          <rect x={1050} y={250} width={70} height={84} fill="#26324a" />
          {[[1060, 248], [1160, 280], [1240, 290]].map(([x, y], i) => <Llama key={i} x={x} y={y} s={0.12} t={t} i={i + 10} />)}
          <path d="M 1120 300 L 1300 320 L 1300 336 L 1120 318 Z" fill="#26324a" />
          {/* valle en niebla (más claro, como en la miniatura) */}
          <path d="M 860 330 Q 1300 300 1920 320 L 1920 900 L 860 600 Z" fill="#33507a" opacity={0.75} />
          {Array.from({ length: 140 }, (_, i) => { const x = 860 + rnd(i + 700) * 1080, y = 330 + rnd(i + 900) * 300; if (y > 470 + (x - 860) * 0.3) return null; const h = 26 + (y - 320) * 0.18; return <path key={"q" + i} d={`M ${x} ${y - h} L ${x + h * 0.35} ${y} L ${x - h * 0.35} ${y} Z`} fill="#1a2a44" />; })}
          {/* niebla */}
          {[[1300, 470, 520], [1550, 560, 600], [1200, 620, 480]].map(([x, y, r], i) => <ellipse key={i} cx={x + Math.sin(t + i) * 10} cy={y} rx={r} ry={70} fill="#5a6a8a" opacity={0.28} />)}
          {/* la horda */}
          {HORDA.map(([x, y, s], i) => <Bicho key={i} x={x} y={y} s={s} t={t} i={i} />)}
          {/* el muro que se pierde a la derecha */}
          <path d="M 850 551 L 1920 987 L 1920 1080 L 850 1080 Z" fill="url(#mpiedra)" />
          {Array.from({ length: 16 }, (_, i) => { const x = 880 + i * 68; const y = 551 + (x - 850) * 0.408; return <React.Fragment key={i}><rect x={x} y={y - 30 - i * 0.6} width={40 + i * 1.2} height={36 + i * 1.5} fill="#3a4258" /><path d={`M ${x - 2} ${y - 30 - i * 0.6} q ${22 + i} -12 ${44 + i * 1.2} 0`} fill="#e8f2fb" /></React.Fragment>; })}
          {Array.from({ length: 9 }, (_, r) => Array.from({ length: 22 }, (_, c) => { const x = 860 + c * 50 + (r % 2) * 25, y = 575 + (x - 850) * 0.408 + r * 52; return <rect key={r * 22 + c} x={x} y={y} width={44 + c * 0.8} height={44 + c * 0.6} rx={6} fill={rnd(r * 22 + c) > 0.5 ? "#4a5068" : "#3e445a"} stroke="#161a28" strokeWidth={3} transform={`skewY(22.2) translate(0 ${-(x) * 0.408})`} />; }))}
          {/* torres del muro */}
          {[[1343, 689, 1], [1584, 804, 1.15], [1722, 907, 1.3]].map(([x, y, s], i) => <g key={i}><rect x={x - 34 * s} y={y - 90 * s} width={68 * s} height={160 * s} fill="#2e3548" /><path d={`M ${x - 38 * s} ${y - 90 * s} q ${38 * s} -18 ${76 * s} 0`} fill="#e8f2fb" /><rect x={x - 12 * s} y={y - 70 * s} width={24 * s} height={34 * s} fill="#ffb84a" opacity={0.7} /></g>)}
          {[[1332, 610], [1745, 815]].map(([x, y], i) => <g key={i}><rect x={x - 4} y={y} width={8} height={50} fill="#4a2e1a" /><Llama x={x} y={y} s={0.22} t={t} i={i + 20} /></g>)}
          {/* resplandor de la antorcha */}
          <rect width={1920} height={1080} fill="url(#mfuego)" />
          {/* muro alto atrás, a la izquierda */}
          <path d="M 0 390 L 290 420 L 300 700 L 0 700 Z" fill="#2e2c38" />
          {Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => <rect key={"b" + r * 3 + c} x={4 + c * 96 + (r % 2) * 30} y={420 + r * 66} width={88} height={58} rx={8} fill="#3c3846" stroke="#1a1820" strokeWidth={4} />))}
          <Nieve d="M -10 396 Q 120 376 296 414 Q 260 436 140 424 Q 60 420 -10 430 Z" />
          <Hielo x0={0} x1={290} y={426} n={8} l={50} seed={7} />
          {/* muro de adelante, a la izquierda */}
          <path d="M 0 640 Q 140 630 270 660 L 300 1080 L 0 1080 Z" fill="#2a2a34" />
          {Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 }, (_, c) => <rect key={r * 3 + c} x={6 + c * 92 + (r % 2) * 40} y={680 + r * 68} width={84} height={60} rx={8} fill="#3a3540" stroke="#1a1820" strokeWidth={4} />))}
          <Nieve d="M -10 650 Q 60 620 140 636 Q 220 628 290 664 Q 270 690 200 680 Q 100 676 -10 690 Z" />
          <Hielo x0={0} x1={280} y={680} n={9} l={60} seed={2} />
          {/* antorcha */}
          <path d="M 70 470 L 120 470 L 104 600 L 86 600 Z" fill="#6b3a1f" />
          <path d="M 50 440 L 140 440 L 125 485 L 65 485 Z" fill="#3a2414" stroke="#8a5a2a" strokeWidth={5} />
          <Llama x={95} y={438} s={1.05} t={t} i={1} />
          {/* chispas */}
          {Array.from({ length: 10 }, (_, i) => { const k = (t * 0.8 + rnd(i)) % 1; return <circle key={i} cx={95 + (rnd(i + 5) - 0.5) * 120 + k * 30} cy={400 - k * 260} r={3 + rnd(i) * 3} fill="#ffcf5a" opacity={1 - k} />; })}
          {/* el legionario */}
          <Soldado t={t} />
          <g transform="translate(350 540) scale(0.85) translate(-350 -540)"><Media x={350} y={540} rot={4} t={t} /></g>
          <g transform="translate(1062 600) scale(0.85) translate(-1062 -600)"><Media x={1062} y={600} rot={-4} t={t} flip /></g>
          {/* fila de hielo adelante */}
          <path d="M 0 960 Q 200 930 420 950 Q 560 940 760 960 L 760 1080 L 0 1080 Z" fill="#2a2a34" />
          {Array.from({ length: 6 }, (_, c) => <rect key={c} x={10 + c * 125} y={975} width={115} height={110} rx={10} fill="#3a3540" stroke="#1a1820" strokeWidth={4} />)}
          <Nieve d="M -10 970 Q 120 940 260 956 Q 420 940 560 960 Q 680 950 770 972 Q 720 996 560 986 Q 300 990 -10 996 Z" />
          <Hielo x0={0} x1={760} y={990} n={18} l={50} seed={5} />
          {/* lluvia */}
          {Array.from({ length: 140 }, (_, i) => {
            const x0 = rnd(i) * 2400 - 240, y0 = rnd(i + 999) * 1080;
            const y = (y0 + wind) % 1180 - 50, x = x0 - ((y0 + wind) % 1180) * 0.18;
            return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 52} stroke="#b8d0ee" strokeWidth={2.4} opacity={0.55} />;
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
export const SM: React.FC<{ t: number }> = ({ t }) => (t > FIN ? null : <Mini t={t} />);
