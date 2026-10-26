import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { fontFamily, prog } from "./kit";
import { Nubes, Estandarte, Torre, Carpa } from "./kit3";

// Cuadro 0 = la miniatura elegida (sootleg_mini_v2) SIN «IT'S A TRAP» y SIN la flecha, rehecha en SVG con el mismo
// encuadre: campamento soleado a la izquierda, calavera de fuego con picas a la derecha, el legionario de casco dorado
// firmando «25 YEARS» con la pluma y la sandalia sobre el cepo. Desde t=0 cobra vida (firma, parpadea, el fuego late,
// los estandartes flamean) y a los ~1,9 s la cámara se aleja: la miniatura se vuelve una postal que cae sobre Roma en el mapa.
const PIEL = "#f6c39a", PIEL2 = "#e09a72", ORO = "#f2b52e", ORO2 = "#b8780f", ORO3 = "#ffe08a";

const Legionario: React.FC<{ t: number }> = ({ t }) => {
  const ciclo = t % 3.4;
  const parp = ciclo > 2.2 && ciclo < 2.32 ? 0.1 : 1;
  const firma = prog(t, 0.15, 1.6);
  const qx = 860 + Math.sin(t * 24) * 10 * (t < 1.6 ? 1 : 0) + firma * 40, qy = 688 + Math.cos(t * 24) * 5 * (t < 1.6 ? 1 : 0);
  const resp = Math.sin(t * 2.4) * 3;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
      <defs>
        <linearGradient id="mCasco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={ORO3} /><stop offset="0.45" stopColor={ORO} /><stop offset="1" stopColor={ORO2} /></linearGradient>
        <radialGradient id="mCara" cx="0.45" cy="0.4" r="0.65"><stop offset="0.6" stopColor={PIEL} /><stop offset="1" stopColor={PIEL2} /></radialGradient>
        <linearGradient id="mLor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef1f5" /><stop offset="1" stopColor="#9aa3b0" /></linearGradient>
        <linearGradient id="mTun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8463a" /><stop offset="1" stopColor="#a8202a" /></linearGradient>
      </defs>
      <g transform={`translate(0 ${resp})`}>
        {/* pierna derecha que baja al cepo, con sandalia de tiras */}
        <path d="M 1190 700 Q 1260 760 1320 860 L 1372 846 Q 1316 740 1250 680 Z" fill="url(#mTun)" />
        <path d="M 1300 820 Q 1330 880 1350 930 L 1400 918 Q 1380 860 1352 808 Z" fill={PIEL} />
        <path d="M 1318 930 Q 1350 950 1440 944 Q 1462 930 1440 916 L 1356 914 Z" fill={PIEL} />
        <path d="M 1310 938 Q 1380 962 1452 948 L 1450 960 Q 1380 976 1308 952 Z" fill="#7a4520" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${1326 + i * 6} ${880 + i * 22} L ${1392 + i * 4} ${866 + i * 22}`} stroke="#8a4a1e" strokeWidth={11} strokeLinecap="round" />)}
        <path d="M 1350 926 L 1426 918" stroke="#8a4a1e" strokeWidth={10} strokeLinecap="round" />
        {/* torso inclinado hacia el pergamino */}
        <path d="M 900 470 Q 1010 420 1130 452 L 1196 720 Q 1060 760 940 720 Z" fill="url(#mTun)" />
        {/* lorica segmentata */}
        <path d="M 930 470 Q 1020 434 1120 462 L 1156 640 Q 1040 672 950 640 Z" fill="url(#mLor)" stroke="#6a7484" strokeWidth={5} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${938 + i * 3} ${500 + i * 30} Q 1040 ${470 + i * 30} ${1130 + i * 5} ${496 + i * 30}`} stroke="#6a7484" strokeWidth={5} fill="none" />)}
        {[[960, 482], [1110, 470], [946, 610], [1146, 604]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={ORO} stroke={ORO2} strokeWidth={3} />)}
        <path d="M 940 650 Q 1050 690 1170 650 L 1178 676 Q 1050 716 944 678 Z" fill="#6b3a1f" />
        <circle cx={1050} cy={688} r={16} fill={ORO} stroke={ORO2} strokeWidth={3} />
        {/* brazo izquierdo (de la imagen) apoyado en el pergamino */}
        <path d="M 1110 520 Q 1150 600 1090 690 L 1046 668 Q 1094 600 1070 530 Z" fill="url(#mTun)" />
        <path d="M 1086 670 Q 1060 700 1020 712 L 1000 680 Q 1040 670 1060 650 Z" fill={PIEL} />
        <ellipse cx={1000} cy={706} rx={50} ry={30} fill={PIEL} stroke={PIEL2} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${966 + i * 18} 722 q 4 12 12 10`} stroke={PIEL2} strokeWidth={4} fill="none" />)}
        {/* brazo derecho con la pluma */}
        <path d="M 930 520 Q 860 590 860 660 L 906 668 Q 908 610 960 556 Z" fill="url(#mTun)" />
        <path d="M 862 650 Q 852 680 860 700 L 900 694 Q 902 676 904 660 Z" fill={PIEL} />
        <g transform={`translate(${qx} ${qy})`}>
          <ellipse cx={0} cy={0} rx={40} ry={32} fill={PIEL} stroke={PIEL2} strokeWidth={3} />
          <g transform="rotate(-38)">
            <path d="M -4 20 L 0 -250 Q 60 -170 30 -60 Q 20 -10 -4 20 Z" fill="#fbfbf6" stroke="#c9c9bd" strokeWidth={3} />
            <path d="M 0 -230 Q 30 -150 14 -40" stroke="#c9c9bd" strokeWidth={3} fill="none" />
            {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${4 + i} ${-210 + i * 30} l 26 -14`} stroke="#d8d8cc" strokeWidth={3} />)}
            <line x1={-2} y1={20} x2={-6} y2={64} stroke="#222" strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
        {/* cabeza */}
        <g transform={`rotate(${Math.sin(t * 1.3) * 1.5} 1000 330)`}>
          <circle cx={872} cy={330} r={30} fill={PIEL2} /><circle cx={1132} cy={318} r={32} fill={PIEL} /><circle cx={1132} cy={318} r={16} fill={PIEL2} />
          <ellipse cx={1000} cy={318} rx={140} ry={146} fill="url(#mCara)" />
          <ellipse cx={920} cy={386} rx={30} ry={16} fill="#ff7b6b" opacity={0.35} /><ellipse cx={1090} cy={378} rx={30} ry={16} fill="#ff7b6b" opacity={0.35} />
          {/* ojos grandes mirando al espectador */}
          {[[938, 300], [1056, 296]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(1 ${parp})`}>
              <ellipse cx={0} cy={0} rx={42} ry={50} fill="#fff" stroke="#3b2416" strokeWidth={4} />
              <circle cx={6} cy={8} r={28} fill="#2a1a10" /><circle cx={14} cy={-4} r={10} fill="#fff" /><circle cx={-2} cy={20} r={5} fill="#fff" />
            </g>
          ))}
          <path d="M 900 236 Q 936 220 972 232" stroke="#8a5a2a" strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d="M 1020 228 Q 1058 214 1094 228" stroke="#8a5a2a" strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d="M 990 340 Q 1000 360 1014 346" stroke={PIEL2} strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* sonrisa abierta con lengua */}
          <path d={`M 940 382 Q 1000 ${458 + Math.sin(t * 6) * 4} 1062 378 Q 1004 396 940 382 Z`} fill="#6a1a22" />
          <path d="M 966 412 Q 1000 440 1036 410 Q 1004 420 966 412 Z" fill="#ff6f7a" />
          <path d="M 946 384 Q 1000 398 1058 380 L 1052 392 Q 1000 406 950 394 Z" fill="#fff" />
          {/* casco dorado con perilla, ala ancha y guardanuca */}
          <path d="M 840 250 Q 850 80 1000 70 Q 1150 76 1164 250 Z" fill="url(#mCasco)" />
          <path d="M 812 248 Q 1000 210 1196 246 L 1204 278 Q 1000 246 806 282 Z" fill={ORO2} />
          <path d="M 812 248 Q 1000 210 1196 246 L 1198 260 Q 1000 226 810 262 Z" fill={ORO} />
          <path d="M 880 150 Q 930 100 1010 96" stroke={ORO3} strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.9} />
          <rect x={986} y={40} width={28} height={36} rx={10} fill={ORO} stroke={ORO2} strokeWidth={4} />
          <circle cx={1000} cy={36} r={20} fill={ORO} stroke={ORO2} strokeWidth={4} />
          <path d="M 846 262 L 830 360 Q 860 372 880 350 L 880 268 Z" fill={ORO} stroke={ORO2} strokeWidth={4} />
          <path d="M 1158 258 L 1176 352 Q 1146 366 1124 344 L 1124 264 Z" fill={ORO} stroke={ORO2} strokeWidth={4} />
        </g>
      </g>
    </svg>
  );
};

export const Miniatura: React.FC<{ t: number }> = ({ t }) => {
  const r = rnd(5);
  const late = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 3.1);
  const tinta = prog(t, 0.15, 1.6);
  const cierra = prog(t, 1.45, 1.56);
  const sacude = t > 1.5 && t < 1.8 ? Math.sin(t * 90) * 10 * (1.8 - t) / 0.3 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* ── mitad izquierda: cielo azul y campamento */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#2f8fe0 0%,#6ab8f0 35%,#bfe4f8 62%,#f6e7c0 75%)" }} />
      <Nubes t={t + 4} seed={11} y={40} n={5} op={0.95} vel={18} />
      {/* ── mitad derecha: oscuridad roja con fuego, calavera y picas (degradado diagonal que se come el cielo) */}
      <AbsoluteFill style={{ background: "linear-gradient(105deg, rgba(0,0,0,0) 40%, rgba(60,8,12,.85) 52%, #2a0608 64%, #3a0a0c 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 82% 70%, rgba(255,90,30,${0.55 * late}), rgba(160,20,10,.25) 35%, transparent 60%)` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {/* calavera gigante en sombra roja */}
        <g transform={`translate(1450 300) scale(${1 + 0.015 * Math.sin(t * 2)})`} opacity={0.92}>
          <path d="M -300 -40 Q -300 -300 0 -310 Q 300 -300 300 -40 Q 300 90 210 130 L 200 230 L -200 230 L -210 130 Q -300 90 -300 -40 Z" fill="#24060a" />
          <path d="M -300 -40 Q -300 -300 0 -310 Q 300 -300 300 -40" fill="none" stroke="rgba(255,80,40,.35)" strokeWidth={10} />
          {[-120, 120].map((x) => <g key={x}><ellipse cx={x} cy={-10} rx={96} ry={92} fill={`rgba(255,60,30,${0.18 * late})`} /><path d={`M ${x - 80} -10 Q ${x - 70} -90 ${x} -86 Q ${x + 76} -86 ${x + 82} -6 Q ${x + 60} 70 ${x} 66 Q ${x - 70} 66 ${x - 80} -10 Z`} fill={`rgb(${200 + 55 * late},${40 + 30 * late},30)`} /></g>)}
          <path d="M 0 70 L -40 140 L 40 140 Z" fill={`rgba(230,50,30,${0.7 * late})`} />
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-150 + i * 38} y={176} width={24} height={58} fill="#c8301e" opacity={0.8} />)}
          {[-170, 210].map((y) => <rect key={y} x={-170} y={y} width={340} height={10} fill="#c8301e" opacity={0.7} />)}
        </g>
        {/* picas y cruces en silueta */}
        {[1190, 1300, 1560, 1640, 1730, 1810, 1880].map((x, i) => {
          const h = 360 + ((i * 97) % 160);
          return <g key={i} fill="#1a0406"><rect x={x - 5} y={760 - h} width={10} height={h + 40} /><path d={`M ${x - 18} ${760 - h} L ${x} ${700 - h} L ${x + 18} ${760 - h} Z`} />{i % 3 === 1 && <rect x={x - 40} y={820 - h} width={80} height={10} />}</g>;
        })}
        {/* tierra quemada con brasas */}
        <path d="M 1000 820 Q 1300 760 1920 780 L 1920 1080 L 960 1080 Z" fill="#5a2a14" />
        <path d="M 1000 860 Q 1400 820 1920 840 L 1920 1080 L 980 1080 Z" fill="#7a3a1a" />
        {Array.from({ length: 40 }, (_, i) => { const x = 1020 + r() * 900, y = 840 + r() * 230, s = 3 + r() * 7; return <circle key={i} cx={x} cy={y} r={s} fill={i % 3 ? "#4a1e0e" : "#a8501e"} />; })}
        {Array.from({ length: 26 }, (_, i) => { const x0 = 1100 + r() * 820, v = 40 + r() * 70, ph = r() * 10; const y = 1080 - ((t * v + ph * 100) % 700); return <circle key={`b${i}`} cx={x0 + Math.sin(t * 2 + ph) * 20} cy={y} r={3 + (i % 3)} fill={i % 2 ? "#ffb347" : "#ff6a3d"} opacity={0.8} />; })}
      </svg>
      {/* campamento: torre, estandartes, carpas y la fila de legionarios */}
      <Torre x={60} y={620} s={1.05} />
      {[[60, 600, 1.15], [330, 560, 0.95], [560, 590, 0.9], [710, 580, 0.75]].map(([x, y, s], i) => <Estandarte key={i} x={x} y={y} s={s} t={t} f={i * 1.3} />)}
      {[[250, 600], [420, 590], [600, 604]].map(([x, y], i) => <Carpa key={i} x={x} y={y} s={0.75} tono="#e8c08a" />)}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M -20 610 Q 400 580 860 640 L 860 760 L -20 760 Z" fill="#d9b268" />
        {Array.from({ length: 11 }, (_, i) => {
          const x = 140 + i * 62, y = 640 + (i % 2) * 6, b = Math.sin(t * 3 + i) * 1.5;
          return (
            <g key={i} transform={`translate(${x} ${y + b})`}>
              <rect x={-14} y={-64} width={28} height={44} rx={8} fill="#a3202f" /><rect x={-14} y={-60} width={28} height={18} fill="#9aa3b0" />
              <circle cx={0} cy={-78} r={14} fill="#e8b48a" /><path d="M -16 -80 Q 0 -102 16 -80 Z" fill="#6a6f78" />
              <rect x={-10} y={-20} width={7} height={22} fill="#5a3418" /><rect x={3} y={-20} width={7} height={22} fill="#5a3418" />
              <line x1={20} y1={-130} x2={20} y2={0} stroke="#5a3418" strokeWidth={4} /><path d="M 14 -130 L 20 -146 L 26 -130 Z" fill="#9aa3b0" />
            </g>
          );
        })}
        {/* mesa de madera */}
        <path d="M -20 760 L 900 730 L 940 1080 L -20 1080 Z" fill="#8a4e22" />
        <path d="M -20 760 L 900 730 L 902 750 L -20 784 Z" fill="#a8622c" />
        {Array.from({ length: 5 }, (_, i) => <line key={i} x1={-20} y1={830 + i * 55} x2={920} y2={800 + i * 58} stroke="#6b3a1a" strokeWidth={4} opacity={0.5} />)}
        {/* vaso de cuero con plumas */}
        {[[-34, -16], [-6, -4], [24, 10], [50, 22]].map(([dx, rot], i) => (
          <g key={i} transform={`translate(${92 + dx * 0.5} 650) rotate(${rot})`}>
            <path d="M 0 0 L -6 -210 Q 46 -150 30 -50 Q 20 -10 0 0 Z" fill="#f7f6ef" stroke="#c9c9bd" strokeWidth={3} />
            <path d="M -4 -190 Q 22 -120 12 -30" stroke="#c9c9bd" strokeWidth={3} fill="none" />
          </g>
        ))}
        <path d="M 36 640 L 150 640 L 140 770 L 46 770 Z" fill="#7a4520" stroke="#4a2810" strokeWidth={5} />
        <rect x={36} y={668} width={114} height={12} fill="#5a3418" />
      </svg>
      {/* pergamino «25 YEARS» que se firma */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <g transform="rotate(-7 600 860)">
          <path d="M 120 690 L 1060 680 Q 1110 760 1080 1120 L 100 1140 Z" fill="#f6e2b0" stroke="#c9a66a" strokeWidth={6} />
          <path d="M 120 690 L 1060 680 L 1062 700 L 122 712 Z" fill="#e4c88a" />
          <text x={760} y={810} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={104} fill="#2a1a10" transform="rotate(9 760 790)">25 YEARS</text>
          {[0, 1, 2].map((i) => <rect key={i} x={360 + i * 10} y={850 + i * 60} width={600 - i * 40} height={11} rx={5} fill="#3a2a1a" transform="rotate(8 600 900)" />)}
          <path d="M 230 950 l 40 40 M 270 950 l -40 40" stroke="#2a1a10" strokeWidth={12} strokeLinecap="round" />
          <path d="M 300 990 q 30 -60 50 -14 t 40 -6 q 20 -44 40 0 t 50 -6 q 30 24 70 -14" stroke="#1a1a3a" strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tinta} />
          <path d="M 280 1012 L 640 1000" stroke="#3a2a1a" strokeWidth={6} />
          {/* rollo de abajo */}
          <ellipse cx={180} cy={1110} rx={180} ry={70} fill="#ead09a" stroke="#c9a66a" strokeWidth={6} />
          <ellipse cx={120} cy={1110} rx={60} ry={40} fill="#c9a66a" />
        </g>
      </svg>
      {/* el cepo con dientes de hierro bajo la sandalia */}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <g transform={`translate(${1450 + sacude} 930) scale(${1 - 0.18 * cierra} ${1 + 0.02 * Math.sin(t * 9)})`}>
          <ellipse cx={0} cy={40} rx={330} ry={110} fill="#2a0e06" />
          <ellipse cx={0} cy={30} rx={300} ry={92} fill="none" stroke="#5a5e66" strokeWidth={34} />
          <ellipse cx={0} cy={36} rx={170} ry={50} fill="#4a4e56" /><ellipse cx={0} cy={30} rx={120} ry={34} fill="#7a7e86" />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2, x = Math.cos(a) * 300, y = Math.sin(a) * 92 + 30;
            const atras = Math.sin(a) < 0;
            const tx = x * (0.86 - 0.62 * cierra), ty = y - (atras ? 110 : 90) * (1 - 0.35 * cierra);
            return <path key={i} d={`M ${x - 30} ${y} L ${tx} ${ty} L ${x + 30} ${y} Z`} fill={atras ? "#6a6e76" : "#9aa0aa"} stroke="#3a3e46" strokeWidth={4} />;
          })}
          <rect x={250} y={-10} width={90} height={70} rx={10} fill="#3a3e46" /><circle cx={295} cy={25} r={14} fill="#7a7e86" />
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={360 + i * 48} cy={-10 - i * 20} rx={26} ry={16} fill="none" stroke="#4a4e56" strokeWidth={10} />)}
        </g>
      </svg>
      <Legionario t={t} />
      {/* chispazo del cepo */}
      {t > 1.48 && t < 1.85 && <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 86%, rgba(255,240,200,${0.9 * (1.85 - t) / 0.37}), transparent 30%)` }} />}
      {/* viñeta cálida/fría para que pegue como la imagen */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(30,8,20,.35))", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// capa del gancho: la miniatura viva y, entre 1,9 y 2,5 s, se encoge a postal y cae sobre Roma (x 1040, y 470 del mapa)
export const MINI_FIN = 2.6;
export const CapaMiniatura: React.FC<{ t: number; rx: number; ry: number }> = ({ t, rx, ry }) => {
  if (t >= MINI_FIN) return null;
  const u = interpolate(t, [1.9, 2.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const s = 1 - u * 0.86, x = (rx - 960) * u, y = (ry - 540) * u;
  const empuje = 1 + Math.min(t, 1.9) * 0.025;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s * empuje}) rotate(${u * -6}deg)`, opacity: t > 2.45 ? Math.max(0, 1 - (t - 2.45) / 0.15) : 1, boxShadow: u > 0 ? `0 ${30 * u}px ${60 * u}px rgba(0,0,0,.5)` : undefined, border: u > 0 ? `${12 * u / Math.max(0.2, s)}px solid #fff` : undefined }}>
      <Miniatura t={t} />
    </AbsoluteFill>
  );
};
