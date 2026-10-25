import React from "react";
import { AbsoluteFill } from "remotion";
import { prog } from "./kit";
import { V, Tienda, Antorcha, Fogata, Drakkar, Llamas, EscudoR, Empalizada } from "./vik";

// CUADRO 0 = la miniatura de soot12 sin texto ni flecha, rehecha en código (D:/rtmp/soot_ola/minis/soot12_elegida.png):
// el campamento de noche junto al río, vos agachado detrás de un barril con un cuchillo, el perro que te gruñe al lado
// del fuego y el vikingo de la tienda grande con UN ojo abierto y el hacha en la mano. Desde ahí cobra vida:
// las llamas, el perro que ladra, el segundo ojo que se abre y la cámara que empuja hacia vos.
const TINTA = "#2a1530";

const CabezaVik: React.FC<{ x: number; y: number; s: number; t: number; ojoI: number; ojoD: number; mira?: number; barba?: string; piel?: string }> = ({ x, y, s, t, ojoI, ojoD, mira = -1, barba = "#b0602a", piel = "#f2b48a" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -100 10 Q -110 150 0 170 Q 110 150 100 10 Z" fill={barba} stroke={TINTA} strokeWidth={8} />
    <ellipse cx={0} cy={0} rx={96} ry={104} fill={piel} stroke={TINTA} strokeWidth={8} />
    <ellipse cx={-102} cy={10} rx={18} ry={26} fill={piel} stroke={TINTA} strokeWidth={6} />
    {/* ojos: 0 = cerrado (línea), 1 = abierto enorme */}
    {ojoI > 0.5 ? <><circle cx={-38} cy={-6} r={30} fill="#fff" stroke={TINTA} strokeWidth={6} /><circle cx={-38 + mira * 12} cy={-4} r={15} fill={TINTA} /></> : <path d="M -62 -4 Q -38 8 -14 -4" stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />}
    {ojoD > 0.5 ? <><circle cx={38} cy={-6} r={30} fill="#fff" stroke={TINTA} strokeWidth={6} /><circle cx={38 + mira * 12} cy={-4} r={15} fill={TINTA} /></> : <path d="M 14 -4 Q 38 8 62 -4" stroke={TINTA} strokeWidth={7} fill="none" strokeLinecap="round" />}
    <path d="M -66 -46 L -14 -34 M 14 -34 L 66 -46" stroke={barba} strokeWidth={14} strokeLinecap="round" />
    <ellipse cx={0} cy={34} rx={22} ry={18} fill="#e07a6a" stroke={TINTA} strokeWidth={5} />
    <path d="M -70 56 Q -30 40 0 62 Q 30 40 70 56 Q 40 80 0 74 Q -40 80 -70 56 Z" fill={barba} stroke={TINTA} strokeWidth={6} />
    <path d="M -24 96 Q 0 88 24 96" stroke={TINTA} strokeWidth={6} fill="none" />
    {/* casco cónico con nasal */}
    <path d="M -104 -30 Q -100 -150 0 -158 Q 100 -150 104 -30 Z" fill="#6e7486" stroke={TINTA} strokeWidth={8} />
    <rect x={-112} y={-44} width={224} height={26} rx={10} fill="#8a90a2" stroke={TINTA} strokeWidth={7} />
    <path d="M -50 -140 Q 0 -150 50 -140" stroke="#b8bed0" strokeWidth={10} fill="none" opacity={0.6} />
    <circle cx={0} cy={-158} r={9} fill="#8a90a2" stroke={TINTA} strokeWidth={5} />
    <path d={`M -10 ${-30 + Math.sin(t * 3) * 0} L 10 -30 L 8 30 L -8 30 Z`} fill="#8a90a2" stroke={TINTA} strokeWidth={5} />
  </g>
);
const HachaMano: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-12} y={-150} width={24} height={300} rx={10} fill={V.madera} stroke={TINTA} strokeWidth={7} />
    <path d="M 10 -150 Q 110 -190 130 -100 Q 140 -40 118 10 Q 70 -50 10 -60 Z" fill="#c8d0dc" stroke={TINTA} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 46 -140 Q 106 -140 116 -80" stroke="#fff" strokeOpacity={0.6} strokeWidth={8} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={60} rx={40} ry={34} fill="#f2b48a" stroke={TINTA} strokeWidth={7} />
  </g>
);
const Escudo: React.FC<{ x: number; y: number; r: number; k?: number }> = ({ x, y, r, k = 1 }) => (
  <svg style={{ position: "absolute", left: x - r, top: y - r, overflow: "visible" }} width={2 * r} height={2 * r} viewBox={`${-r} ${-r} ${2 * r} ${2 * r}`}>
    <EscudoR r={r} k={k} />
  </svg>
);

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  // la cámara: quieta en el cuadro 0, después empuja hacia vos y el perro
  const z = 1 + 0.16 * prog(t, 0.25, 1.6) ** 1.4;
  const abre = t > 0.85; // el segundo ojo del vikingo se abre
  const mira = t > 0.55 ? -1 : -0.6;
  const fuego = (x: number, y: number, s: number, seed: number) => <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}><Llamas t={t} x={x} y={y} s={s} ancho={120} seed={seed} /></svg>;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: V.noche0 }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "760px 640px" }}>
        {/* cielo, nubes, luna y montañas */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0a1440 0%, #1a2f78 45%, #2a3f8a 60%, #10183a 100%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 337) % 1920} cy={(i * 131) % 380} r={i % 5 === 0 ? 3 : 1.8} fill="#e8eeff" opacity={0.4 + 0.4 * Math.sin(t * 3 + i)} />)}
          <path d="M 0 180 Q 160 120 320 170 Q 460 110 620 160 L 620 230 L 0 240 Z" fill="#24357a" opacity={0.7} />
          <circle cx={305} cy={367} r={58} fill="#fff4d6" /><circle cx={305} cy={367} r={110} fill="#fff4d6" opacity={0.15} />
          <path d="M 220 360 Q 300 350 390 372" stroke="#3a4a8a" strokeWidth={14} fill="none" opacity={0.8} />
          <path d="M 0 420 L 120 330 L 260 400 L 420 320 L 600 410 L 760 360 L 900 420 L 900 470 L 0 470 Z" fill="#1c2a62" />
          <path d="M 860 420 L 1000 300 L 1200 380 L 1400 260 L 1700 330 L 1920 250 L 1920 470 L 860 470 Z" fill="#141f4e" />
          {/* río iluminado por la luna */}
          <path d="M 0 470 L 900 470 Q 760 560 700 640 L 0 660 Z" fill="#1d4f9a" />
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${40 + (i % 7) * 110 + Math.sin(t * 2 + i) * 10} ${500 + Math.floor(i / 7) * 60} l 60 0`} stroke="#8ab8f0" strokeWidth={5} strokeLinecap="round" opacity={0.6} />)}
          {/* pinos detrás de la empalizada */}
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${930 + i * 80} 330 l 30 -${70 + (i % 3) * 30} l 30 ${70 + (i % 3) * 30} Z`} fill="#0f2a3a" />)}
        </svg>
        {/* barcos varados en la orilla */}
        <Drakkar x={170} y={500} s={0.38} t={t} vela={1} />
        <Drakkar x={420} y={490} s={0.36} t={t} vela={1} />
        <Drakkar x={600} y={470} s={0.2} t={t} vela={1} />
        {/* muelle de troncos */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={0} y={530} width={180} height={22} fill="#4a3020" stroke={TINTA} strokeWidth={5} />
          {[30, 100, 160].map((x) => <rect key={x} x={x} y={500} width={20} height={150} fill="#3a2418" stroke={TINTA} strokeWidth={4} />)}
        </svg>
        {/* empalizada, torre y estandartes */}
        <div style={{ position: "absolute", left: 0, top: 0 }}><Empalizada x={1010} y={345} n={11} h={150} paso={44} /></div>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <rect x={1160} y={120} width={100} height={220} fill="#4a3020" stroke={TINTA} strokeWidth={7} />
          <path d="M 1140 130 L 1210 60 L 1280 130 Z" fill="#3a2418" stroke={TINTA} strokeWidth={7} />
          <rect x={1180} y={150} width={60} height={30} fill="#ffb347" opacity={0.7} />
          {[[1290, 130], [870, 270], [600, 360]].map(([x, y], i) => <g key={i}><rect x={x - 4} y={y - 20} width={8} height={160} fill="#3a2418" /><path d={`M ${x} ${y} L ${x + 60} ${y} L ${x + 60} ${y + 110} L ${x + 30} ${y + 90} L ${x} ${y + 110} Z`} fill="#b8202e" stroke={TINTA} strokeWidth={5} /><path d={`M ${x + 30} ${y + 20} l 0 50 M ${x + 16} ${y + 34} l 28 0`} stroke="#f4ead2" strokeWidth={5} /></g>)}
        </svg>
        {/* la hilera de tiendas que se aleja hacia el fondo */}
        {[[735, 470, 0.36], [826, 450, 0.46], [953, 430, 0.6], [1110, 410, 0.78], [1290, 390, 0.95]].map(([x, y, s], i) => <Tienda key={i} x={x} y={y} s={s} t={t} k={0} luz={i % 2 === 0} />)}
        {/* vikingos "dormidos" en las tiendas: un ojo abierto y el hacha a mano */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {[[700, 560, 40], [778, 548, 48], [948, 540, 60]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r * 1.6} ry={r * 0.7} fill="#b89870" stroke={TINTA} strokeWidth={5} />)}
          {[[700, 535, 0.2], [778, 520, 0.24], [948, 505, 0.3]].map(([x, y, s], i) => <CabezaVik key={i} x={x} y={y} s={s} t={t} ojoI={0} ojoD={t > 1.05 ? 1 : i === 2 ? 1 : 0} mira={-1} barba={["#c9773a", "#8a4a2a", "#d9a441"][i]} />)}
          <ellipse cx={1205} cy={560} rx={150} ry={70} fill="#c8a878" stroke={TINTA} strokeWidth={6} />
          <CabezaVik x={1205} y={480} s={0.48} t={t} ojoI={0} ojoD={1} mira={-1} barba="#a8552a" />
          <HachaMano x={1290} y={520} s={0.5} rot={14} />
        </svg>
        {/* escudos rojo y blanco apoyados */}
        <Escudo x={905} y={590} r={55} />
        <Escudo x={1030} y={600} r={62} />
        <Escudo x={1165} y={630} r={72} />
        <Escudo x={1310} y={640} r={88} />
        {/* antorchas */}
        <Antorcha x={740} y={440} s={0.45} t={t} />
        <Antorcha x={1097} y={240} s={0.5} t={t} />
        <Antorcha x={1380} y={90} s={0.5} t={t} />
        {/* suelo de tierra iluminado por el fuego */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <defs><radialGradient id="pt_suelo" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stopColor="#c8823a" /><stop offset="0.5" stopColor="#6a4428" /><stop offset="1" stopColor="#1e1a2e" /></radialGradient></defs>
          <path d="M 0 650 Q 500 620 760 640 Q 1100 640 1920 700 L 1920 1080 L 0 1080 Z" fill="url(#pt_suelo)" />
          <path d="M 0 650 Q 300 620 560 650 L 520 700 L 0 720 Z" fill="#1a2a3a" opacity={0.7} />
        </svg>
        {/* la fogata del centro con su trípode y olla */}
        <Fogata x={976} y={640} s={0.9} t={t} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 820 720 L 870 560 L 920 720 M 870 560 L 870 640" stroke="#3a2418" strokeWidth={10} />
          <path d="M 845 640 Q 870 690 895 640 Z" fill="#2a2a3a" stroke={TINTA} strokeWidth={5} />
          <rect x={790} y={770} width={90} height={60} rx={10} fill="#3a2a22" stroke={TINTA} strokeWidth={5} />
        </svg>
        {/* el perro que te gruñe */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
          <g transform={`translate(1190 790) translate(${t > 0.4 ? -Math.abs(Math.sin(t * 9)) * 12 : 0} 0)`}>
            <path d="M -40 -40 Q 120 -120 260 -40 Q 300 40 250 120 L 60 130 Q -40 110 -40 -40 Z" fill="#2e2624" stroke={TINTA} strokeWidth={8} />
            {[[-10, 110], [60, 120], [190, 120], [240, 110]].map(([x, h], i) => <path key={i} d={`M ${x} 60 L ${x} ${60 + h} L ${x + 44} ${60 + h} L ${x + 34} 60 Z`} fill="#2e2624" stroke={TINTA} strokeWidth={7} />)}
            <path d="M 280 -10 Q 330 -40 320 -80" stroke="#2e2624" strokeWidth={22} fill="none" strokeLinecap="round" />
            {/* collar de pinchos */}
            <path d="M -20 -70 Q 20 -10 -10 60" stroke="#8a3a22" strokeWidth={34} fill="none" />
            {[-60, -30, 0, 30].map((k, i) => <circle key={i} cx={0 + i * -2} cy={k} r={7} fill="#d8dee8" stroke={TINTA} strokeWidth={3} />)}
            {/* cabeza */}
            <g transform={`rotate(${t > 0.4 ? Math.sin(t * 9) * 3 : 0} -60 -10)`}>
              <path d="M -170 -20 Q -180 -110 -90 -130 Q 0 -140 20 -60 Q 30 30 -60 50 Q -150 60 -170 -20 Z" fill="#3a302c" stroke={TINTA} strokeWidth={8} />
              <path d="M -60 -126 L -20 -180 L 0 -110 Z" fill="#2e2624" stroke={TINTA} strokeWidth={7} />
              <path d="M -130 -118 L -150 -170 L -100 -128 Z" fill="#2e2624" stroke={TINTA} strokeWidth={7} />
              <path d="M -150 -66 L -100 -50 M -70 -54 L -26 -72" stroke={TINTA} strokeWidth={9} strokeLinecap="round" />
              <circle cx={-118} cy={-40} r={9} fill="#ffcf6a" /><circle cx={-50} cy={-46} r={9} fill="#ffcf6a" />
              <ellipse cx={-110} cy={-10} rx={22} ry={14} fill="#120e0e" />
              <path d={`M -170 10 Q -100 ${t > 0.4 ? 0 : 10} -40 14 L -40 ${t > 0.4 ? 54 : 44} Q -110 ${t > 0.4 ? 64 : 52} -168 40 Z`} fill="#7a1e1e" stroke={TINTA} strokeWidth={6} />
              {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${-160 + i * 20} 12 l 9 16 l 9 -16`} fill="#fff" stroke={TINTA} strokeWidth={3} />)}
              {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${-160 + i * 20} ${t > 0.4 ? 54 : 44} l 9 -14 l 9 14`} fill="#fff" stroke={TINTA} strokeWidth={3} />)}
            </g>
          </g>
        </svg>
        {/* la tienda grande de la derecha con el vikingo del ojo abierto */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <path d="M 1440 1080 L 1720 -40 L 1920 -40 L 1920 1080 Z" fill="#d8b070" stroke={TINTA} strokeWidth={10} />
          <path d="M 1500 1080 L 1740 0" stroke="#5e3a1e" strokeWidth={26} />
          <path d="M 1540 1080 L 1780 120 L 1920 120 L 1920 1080 Z" fill="#3a2418" opacity={0.55} />
          <path d="M 1500 760 Q 1640 560 1920 600 L 1920 1000 L 1500 1000 Z" fill="#8a6a4a" stroke={TINTA} strokeWidth={8} />
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${1520 + i * 30} ${700 - (i % 4) * 14} l 14 -26`} stroke="#5e4a32" strokeWidth={6} />)}
          <CabezaVik x={1690} y={430} s={1.0} t={t} ojoI={abre ? 1 : 0} ojoD={1} mira={mira} barba="#a8552a" />
          <HachaMano x={1800} y={560} s={0.95} rot={12} />
        </svg>
        <Escudo x={1535} y={790} r={140} />
        {/* el barril y vos, agachado con el cuchillo */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <g>
            <path d="M 540 640 Q 520 790 545 940 L 760 940 Q 785 790 765 640 Z" fill="#6a4426" stroke={TINTA} strokeWidth={8} />
            {[680, 790, 900].map((y) => <path key={y} d={`M 528 ${y} Q 652 ${y + 14} 776 ${y}`} stroke="#3a3040" strokeWidth={14} fill="none" />)}
            {[600, 650, 700].map((x) => <path key={x} d={`M ${x} 645 Q ${x - 6} 790 ${x} 935`} stroke="#4a2e18" strokeWidth={4} fill="none" />)}
            <ellipse cx={652} cy={640} rx={113} ry={22} fill="#7a5030" stroke={TINTA} strokeWidth={7} />
          </g>
          {/* capa de piel */}
          <path d="M 170 720 Q 210 590 400 600 Q 520 610 520 700 Q 470 840 300 860 Q 160 850 170 720 Z" fill="#3a2a22" stroke={TINTA} strokeWidth={8} />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${190 + i * 30} ${640 + (i % 3) * 10} l -14 -24`} stroke="#2a1e18" strokeWidth={6} />)}
          {/* piernas agachadas y botas */}
          <path d="M 300 830 L 380 900 L 340 960" stroke="#6a5038" strokeWidth={60} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 420 820 L 470 880 L 460 950" stroke="#6a5038" strokeWidth={56} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 300 940 Q 300 990 400 990 L 410 950 Z" fill="#6a3a1e" stroke={TINTA} strokeWidth={7} />
          <path d="M 430 935 Q 430 990 520 985 L 515 945 Z" fill="#6a3a1e" stroke={TINTA} strokeWidth={7} />
          {/* torso y brazo con el cuchillo */}
          <path d="M 330 690 Q 420 640 500 700 L 500 820 L 330 830 Z" fill="#7a6040" stroke={TINTA} strokeWidth={7} />
          <path d="M 400 740 Q 330 800 260 790" stroke="#7a6040" strokeWidth={44} fill="none" strokeLinecap="round" />
          <g transform="translate(250 790) rotate(-24)">
            <rect x={-30} y={-14} width={70} height={28} rx={8} fill="#3a2418" stroke={TINTA} strokeWidth={5} />
            <path d="M 40 -16 L 200 -6 L 230 0 L 200 8 L 40 16 Z" fill="#d8dee8" stroke={TINTA} strokeWidth={6} />
            <path d="M 60 -6 L 196 -2" stroke="#fff" strokeWidth={4} opacity={0.7} />
          </g>
          <circle cx={250} cy={790} r={26} fill="#f2b48a" stroke={TINTA} strokeWidth={6} />
          <path d="M 470 760 Q 540 760 560 720" stroke="#7a6040" strokeWidth={38} fill="none" strokeLinecap="round" />
          <circle cx={560} cy={716} r={22} fill="#f2b48a" stroke={TINTA} strokeWidth={6} />
          {/* cabeza grande, ojos enormes mirando al perro y luego al vikingo */}
          <g transform="translate(520 580) scale(0.82)">
            <path d="M -110 -10 Q -140 70 -96 110 L -60 40 Z" fill="#c9a060" stroke={TINTA} strokeWidth={6} />
            <ellipse cx={0} cy={10} rx={110} ry={112} fill="#f6c8a0" stroke={TINTA} strokeWidth={8} />
            <circle cx={-14} cy={30} r={30} fill="#fff" stroke={TINTA} strokeWidth={6} />
            <circle cx={58} cy={26} r={30} fill="#fff" stroke={TINTA} strokeWidth={6} />
            <circle cx={t > 0.7 ? 6 : -2} cy={t > 0.7 ? 22 : 34} r={14} fill={TINTA} />
            <circle cx={t > 0.7 ? 78 : 70} cy={t > 0.7 ? 18 : 30} r={14} fill={TINTA} />
            <path d="M -40 -8 L 6 -2 M 40 -4 L 86 -10" stroke="#6a4020" strokeWidth={10} strokeLinecap="round" />
            <path d="M 10 84 Q 26 68 42 84 Z" fill="#7a2a2a" stroke={TINTA} strokeWidth={5} />
            <ellipse cx={-104} cy={20} rx={18} ry={24} fill="#f6c8a0" stroke={TINTA} strokeWidth={6} />
            {/* gorro de cuero */}
            <path d="M -124 -40 Q -120 -170 4 -174 Q 124 -170 128 -40 Z" fill="#5a5048" stroke={TINTA} strokeWidth={8} />
            <path d="M -130 -46 Q 0 -26 134 -46 L 134 -24 Q 0 -4 -130 -24 Z" fill="#4a4038" stroke={TINTA} strokeWidth={7} />
            <circle cx={4} cy={-174} r={12} fill="#4a4038" stroke={TINTA} strokeWidth={5} />
          </g>
          {/* tocones y piedras del frente */}
          <path d="M 0 900 Q 120 860 260 900 L 260 1080 L 0 1080 Z" fill="#1a1626" opacity={0.85} />
          <path d="M 1060 1080 Q 1120 980 1360 960 Q 1480 960 1470 1080 Z" fill="#2a1e1a" stroke={TINTA} strokeWidth={8} />
          <path d="M 1330 900 L 1450 880 L 1460 960 L 1340 980 Z" fill="#5e3a24" stroke={TINTA} strokeWidth={7} />
          <path d="M 1500 1080 Q 1600 900 1920 880 L 1920 1080 Z" fill="#3a2418" stroke={TINTA} strokeWidth={8} />
        </svg>
        {fuego(1860, 820, 0.8, 7)}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 520px at 980px 640px, rgba(255,150,50,${0.30 + 0.04 * Math.sin(t * 9)}), rgba(255,120,40,0.08) 60%, rgba(0,0,0,0) 80%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 700px 500px at 1700px 500px, rgba(255,140,50,0.22), rgba(0,0,0,0) 70%)", mixBlendMode: "screen" }} />
        {/* chispas que suben */}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {Array.from({ length: 22 }, (_, i) => { const k = (t * 0.6 + i / 22) % 1; return <circle key={i} cx={960 + Math.sin(i * 7 + t * 2) * 90} cy={640 - k * 420} r={3} fill="#ffcf6a" opacity={(1 - k) * 0.9} />; })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
