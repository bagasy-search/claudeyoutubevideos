import React from "react";
import { AbsoluteFill } from "remotion";
import { prog } from "./kit";

// Cuadro 0 = la miniatura elegida (D:/rtmp/soot_ola/minis/soot05_elegida.png) rehecha en SVG, sin el texto ni la flecha.
// La escena cobra vida (antorcha, monedas que brillan, ratas, el carcelero que se ríe) y a los 0,9 s la cámara se mete
// en el grillete de la muñeca del preso: ahí empalma con el primerísimo plano del grillete del mundo (d0.tsx).
export const PORTADA_FIN = 0.8;

const Rata: React.FC<{ x: number; y: number; s: number; t: number; flip?: boolean; boca?: boolean }> = ({ x, y, s, t, flip, boca }) => {
  const b = Math.sin(t * 9 + x) * 3;
  return (
    <g transform={`translate(${x} ${y + b}) scale(${flip ? -s : s} ${s})`}>
      <path d={`M 70 20 Q 150 ${30 + Math.sin(t * 6 + x) * 20} 220 ${-10 + Math.cos(t * 5) * 10}`} stroke="#e58a9a" strokeWidth={9} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={0} rx={95} ry={62} fill="#3d3a48" />
      <ellipse cx={-10} cy={18} rx={70} ry={34} fill="#4e4a5c" />
      <path d="M -70 -20 Q -150 -10 -160 30 Q -120 50 -70 40 Z" fill="#3d3a48" />
      <circle cx={-60} cy={-58} r={30} fill="#3d3a48" /><circle cx={-60} cy={-58} r={18} fill="#e58a9a" />
      <circle cx={-118} cy={-6} r={16} fill="#fff" /><circle cx={-122} cy={-6} r={9} fill="#14101f" /><circle cx={-125} cy={-10} r={3} fill="#fff" />
      <circle cx={-160} cy={30} r={9} fill="#e58a9a" />
      {boca && <path d="M -150 44 Q -130 64 -112 46" fill="#7a1f35" />}
      {[-1, 0, 1].map((k) => <line key={k} x1={-158} y1={30} x2={-210} y2={22 + k * 14} stroke="#cfc8d8" strokeWidth={2} />)}
    </g>
  );
};

const Eslabones: React.FC<{ d: [number, number][]; w?: number }> = ({ d, w = 26 }) => (
  <g>
    {d.slice(1).map(([x, y], i) => {
      const [px, py] = d[i];
      const a = (Math.atan2(y - py, x - px) * 180) / Math.PI;
      return <ellipse key={i} cx={(x + px) / 2} cy={(y + py) / 2} rx={w * 0.9} ry={w * 0.5} transform={`rotate(${a + (i % 2 ? 90 : 0) * 0.35} ${(x + px) / 2} ${(y + py) / 2})`} fill="none" stroke="#6c6c7a" strokeWidth={w * 0.32} />;
    })}
  </g>
);

const Esposa: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.92} fill="none" stroke="#2e2e38" strokeWidth={r * 0.36} />
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.92} fill="none" stroke="#5e5e6c" strokeWidth={r * 0.12} transform={`translate(${-r * 0.08} ${-r * 0.08})`} />
    <rect x={x - r * 0.25} y={y - r * 1.15} width={r * 0.5} height={r * 0.3} rx={6} fill="#4a4a58" />
  </g>
);

export const Portada: React.FC<{ t: number }> = ({ t }) => {
  if (t >= PORTADA_FIN) return null;
  // empuje lento y después zambullida en el grillete de la muñeca (760, 610)
  const z = 1 + 0.03 * prog(t, 0, 0.2) + 4 * Math.pow(prog(t, 0.2, PORTADA_FIN), 2);
  const op = 1 - prog(t, 0.6, PORTADA_FIN);
  const fl = 1 + 0.08 * Math.sin(t * 31) + 0.05 * Math.sin(t * 17);
  const ri = Math.sin(Math.min(1, t / 0.4) * Math.PI) * 0.6; // risa del carcelero
  const bri = 0.6 + 0.4 * Math.abs(Math.sin(t * 7));
  return (
    <AbsoluteFill style={{ opacity: op, transformOrigin: "760px 610px", transform: `scale(${z})` }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="pt_fondo" cx="0.55" cy="0.3" r="0.9"><stop offset="0" stopColor="#3a3f5a" /><stop offset="0.55" stopColor="#252536" /><stop offset="1" stopColor="#120e18" /></radialGradient>
          <radialGradient id="pt_fuego" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffcf6a" stopOpacity={0.75} /><stop offset="1" stopColor="#ff8a2a" stopOpacity={0} /></radialGradient>
          <linearGradient id="pt_rayo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe0ff" stopOpacity={0.45} /><stop offset="1" stopColor="#bfe0ff" stopOpacity={0} /></linearGradient>
          <radialGradient id="pt_oro" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2a8" stopOpacity={0.9} /><stop offset="1" stopColor="#ffc93a" stopOpacity={0} /></radialGradient>
          <linearGradient id="pt_piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2e26" /><stop offset="1" stopColor="#1a130f" /></linearGradient>
        </defs>
        {/* pared de piedra */}
        <rect width={1920} height={1080} fill="url(#pt_fondo)" />
        {Array.from({ length: 11 }, (_, r) => Array.from({ length: 13 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 160 - (r % 2) * 80 + 6} y={r * 86 + 6} width={148} height={74} rx={12} fill={(r * 7 + c * 3) % 5 === 0 ? "#3b3a4c" : "#302f40"} opacity={0.85} />
        )))}
        {/* ventana con rejas y rayos */}
        <path d="M 1040 330 L 1040 90 Q 1170 -10 1300 90 L 1300 330 Z" fill="#9fc4ef" />
        <path d="M 1040 330 L 1040 90 Q 1170 -10 1300 90 L 1300 330 Z" fill="none" stroke="#4a4458" strokeWidth={22} />
        {[1090, 1140, 1190, 1240].map((x) => <rect key={x} x={x - 7} y={30} width={14} height={300} fill="#2e2a3a" />)}
        <rect x={1040} y={190} width={260} height={12} fill="#2e2a3a" />
        <path d="M 1040 330 L 1300 330 L 1050 1080 L 560 1080 Z" fill="url(#pt_rayo)" opacity={0.5 + 0.08 * Math.sin(t * 3)} />
        {/* antorcha */}
        <circle cx={1820} cy={150} r={300 * fl} fill="url(#pt_fuego)" />
        <rect x={1795} y={170} width={50} height={110} rx={8} fill="#5a3a22" />
        <path d="M 1780 175 L 1860 175 L 1850 210 L 1790 210 Z" fill="#3a2a1e" />
        <path d={`M 1820 ${60 - 14 * fl} Q 1860 120 1842 170 L 1798 170 Q 1780 120 1820 ${60 - 14 * fl} Z`} fill="#ff9a2a" />
        <path d={`M 1820 ${100 - 10 * fl} Q 1840 140 1830 170 L 1810 170 Q 1800 140 1820 ${100 - 10 * fl} Z`} fill="#ffe28a" />
        {/* puerta de madera a la izquierda */}
        <rect x={-20} y={60} width={210} height={900} fill="#6a4426" />
        {[0, 1, 2].map((k) => <rect key={k} x={-20} y={60 + k * 300} width={210} height={14} fill="#3a2414" />)}
        {[150, 450, 750].map((y) => <rect key={y} x={-20} y={y} width={230} height={40} rx={6} fill="#3a3a46" />)}
        {[150, 450, 750].map((y) => [30, 110, 180].map((x) => <circle key={`${y}${x}`} cx={x} cy={y + 20} r={9} fill="#7a7a88" />))}
        {/* cadenas que cuelgan */}
        <Eslabones d={Array.from({ length: 9 }, (_, i) => [250 + Math.sin(t * 2 + i * 0.3) * 4, i * 58 - 20])} w={22} />
        <Eslabones d={Array.from({ length: 5 }, (_, i) => [1390, i * 50 - 20])} w={20} />
        {/* cajones */}
        <rect x={1140} y={690} width={240} height={200} fill="#7a5230" stroke="#4a2e18" strokeWidth={10} />
        <rect x={1180} y={600} width={170} height={100} fill="#86603a" stroke="#4a2e18" strokeWidth={8} />
        {/* piso */}
        <path d="M 0 860 Q 960 800 1920 860 L 1920 1080 L 0 1080 Z" fill="url(#pt_piso)" />
        {Array.from({ length: 40 }, (_, i) => <line key={i} x1={(i * 97) % 1920} y1={880 + (i % 5) * 34} x2={(i * 97) % 1920 + 40} y2={870 + (i % 5) * 34} stroke="#c9a23a" strokeWidth={4} opacity={0.5} />)}
        {/* calavera y huesos */}
        <g transform="translate(220 720)">
          <rect x={-120} y={70} width={200} height={20} rx={10} fill="#d9cbb0" transform="rotate(-12)" />
          <rect x={-60} y={90} width={220} height={18} rx={9} fill="#cbbd9e" transform="rotate(14)" />
          <ellipse cx={0} cy={0} rx={82} ry={76} fill="#d9cbb0" />
          <rect x={-46} y={44} width={92} height={50} rx={14} fill="#d9cbb0" />
          <ellipse cx={-30} cy={0} rx={22} ry={26} fill="#2a1f1a" /><ellipse cx={30} cy={0} rx={22} ry={26} fill="#2a1f1a" />
          <path d="M 0 22 L -10 44 L 10 44 Z" fill="#2a1f1a" />
          {[-30, -10, 10, 30].map((x) => <rect key={x} x={x - 6} y={60} width={12} height={26} fill="#2a1f1a" opacity={0.6} />)}
        </g>
        {/* ── el preso, sentado, con la mano extendida y las monedas */}
        <g>
          {/* cadena de la muñeca al piso */}
          <Eslabones d={[[770, 640], [790, 720], [770, 800], [730, 870], [650, 900], [560, 920], [470, 930], [380, 940]]} w={26} />
          {/* cuerpo y piernas */}
          <path d="M 470 620 Q 600 560 700 640 L 760 900 Q 600 950 420 920 Z" fill="#b39a76" />
          {[[520, 700], [610, 760], [560, 850], [680, 820], [470, 800]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} l 26 -8 l 8 22 l -24 10 Z`} fill="#7a5a3a" opacity={0.7} />)}
          <path d="M 430 900 L 420 940 L 470 930 L 460 960 L 520 940 L 560 970 L 590 940 L 660 960 L 700 930 L 760 950 L 750 900 Z" fill="#b39a76" />
          <path d="M 430 930 Q 520 880 640 930 Q 600 975 470 970 Z" fill="#e8a27a" /><path d="M 560 940 Q 680 900 780 950 Q 740 990 600 985 Z" fill="#f2b48a" /><ellipse cx={420} cy={962} rx={46} ry={22} fill="#d98d66" /><ellipse cx={790} cy={962} rx={46} ry={22} fill="#d98d66" />
          {/* brazo extendido */}
          <path d="M 640 650 Q 760 610 880 585" stroke="#e8a27a" strokeWidth={62} strokeLinecap="round" fill="none" />
          <Esposa x={762} y={622} r={46} />
          {/* mano con monedas */}
          <ellipse cx={905} cy={590} rx={82} ry={40} fill="#f0b48a" />
          <circle cx={905} cy={555} r={120 * bri} fill="url(#pt_oro)" />
          {[[870, 570], [905, 560], [940, 568], [890, 545], [925, 540]].map(([x, y], i) => (
            <g key={i}><ellipse cx={x} cy={y} rx={30} ry={18} fill="#e8b020" stroke="#a87a10" strokeWidth={4} /><ellipse cx={x - 6} cy={y - 4} rx={10} ry={5} fill="#fff2a8" opacity={0.8} /></g>
          ))}
          <path d={`M 960 ${505 - 10 * bri} l 8 22 l 22 8 l -22 8 l -8 22 l -8 -22 l -22 -8 l 22 -8 Z`} fill="#fff8d0" opacity={bri} />
          {/* cabeza */}
          <ellipse cx={540} cy={470} rx={150} ry={145} fill="#f2b48a" />
          <circle cx={430} cy={500} r={30} fill="#f2b48a" />
          <ellipse cx={470} cy={530} rx={30} ry={18} fill="#e8848a" opacity={0.5} /><ellipse cx={640} cy={530} rx={30} ry={18} fill="#e8848a" opacity={0.5} />
          <path d="M 400 420 Q 420 320 540 310 Q 660 320 690 420 L 650 400 L 610 430 L 560 400 L 500 430 L 450 400 Z" fill="#d9a83a" />
          {/* gorro de cuero */}
          <path d="M 380 430 Q 380 290 540 280 Q 700 290 700 430 Q 540 400 380 430 Z" fill="#c99a2a" />
          <path d="M 370 432 Q 540 395 712 432 L 712 456 Q 540 420 370 456 Z" fill="#a87a1a" />
          <circle cx={540} cy={278} r={18} fill="#a87a1a" />
          {/* ojos grandes y boca abierta */}
          <ellipse cx={500} cy={470} rx={44} ry={52} fill="#fff" /><ellipse cx={600} cy={462} rx={44} ry={52} fill="#fff" />
          <circle cx={514 + Math.sin(t * 2) * 3} cy={480} r={22} fill="#14101f" /><circle cx={614 + Math.sin(t * 2) * 3} cy={472} r={22} fill="#14101f" />
          <circle cx={507} cy={470} r={7} fill="#fff" /><circle cx={607} cy={462} r={7} fill="#fff" />
          <path d="M 460 405 Q 495 390 528 408" stroke="#7a4a1a" strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M 572 400 Q 605 385 640 400" stroke="#7a4a1a" strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={`M 525 ${555} Q 550 ${520 - 6 * Math.sin(t * 8)} 580 555 Q 552 ${598 + 4 * Math.sin(t * 8)} 525 555 Z`} fill="#7a1f35" />
          {[[470, 380], [610, 520], [430, 470]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="#9a6a4a" opacity={0.6} />)}
        </g>
        {/* ── el carcelero */}
        <g transform={`translate(0 ${-ri * 6})`}>
          {/* cuerpo rojo */}
          <path d="M 1000 1080 Q 990 560 1160 480 Q 1330 430 1500 480 Q 1700 560 1720 1080 Z" fill="#c83a2a" />
          <path d="M 1100 520 Q 1300 600 1560 510 L 1530 470 Q 1320 520 1130 480 Z" fill="#6a4426" />
          <path d="M 1080 520 Q 1150 470 1260 500 Q 1350 560 1450 500 Q 1560 470 1600 540 Q 1500 590 1340 600 Q 1170 590 1080 520 Z" fill="#7a5638" />
          <rect x={1060} y={760} width={620} height={80} fill="#5a3418" />
          <rect x={1300} y={745} width={110} height={110} rx={10} fill="none" stroke="#c9a23a" strokeWidth={16} />
          <rect x={1260} y={560} width={70} height={70} rx={8} fill="none" stroke="#c9a23a" strokeWidth={12} />
          <rect x={1240} y={580} width={420} height={40} fill="#5a3418" transform="rotate(-8 1450 600)" />
          {/* brazo que agarra las monedas */}
          <path d="M 1180 560 Q 1080 600 1000 560" stroke="#c83a2a" strokeWidth={110} strokeLinecap="round" fill="none" />
          <ellipse cx={985} cy={540} rx={66} ry={56} fill="#f0b090" />
          <path d="M 940 520 Q 930 560 960 580" stroke="#d8906a" strokeWidth={10} fill="none" />
          {/* brazo con los grilletes */}
          <path d="M 1560 600 Q 1620 680 1540 720" stroke="#c83a2a" strokeWidth={110} strokeLinecap="round" fill="none" />
          <rect x={1500} y={640} width={110} height={70} rx={14} fill="#7a5638" />
          <ellipse cx={1520} cy={735} rx={64} ry={54} fill="#f0b090" />
          <Eslabones d={[[1480, 720], [1420, 700], [1360, 720], [1320, 790], [1300, 860], [1280, 920]]} w={26} />
          <Eslabones d={[[1540, 760], [1560, 830], [1580, 880]]} w={26} />
          <g transform={`rotate(${Math.sin(t * 4) * 4} 1280 900)`}><Esposa x={1260} y={990} r={92} /></g>
          <g transform={`rotate(${Math.sin(t * 4 + 1) * 4} 1580 880)`}><Esposa x={1600} y={960} r={92} /></g>
          {/* cabeza */}
          <ellipse cx={1330} cy={330} rx={200} ry={185} fill="#f0b090" />
          <ellipse cx={1200} cy={390} rx={44} ry={30} fill="#e8848a" opacity={0.5} /><ellipse cx={1460} cy={390} rx={44} ry={30} fill="#e8848a" opacity={0.5} />
          <ellipse cx={1262} cy={292} rx={36} ry={40} fill="#fff" /><ellipse cx={1398} cy={292} rx={36} ry={40} fill="#fff" />
          <circle cx={1272} cy={302} r={18} fill="#14101f" /><circle cx={1390} cy={302} r={18} fill="#14101f" />
          <path d="M 1206 236 L 1310 270" stroke="#3a2418" strokeWidth={22} strokeLinecap="round" />
          <path d="M 1454 236 L 1350 270" stroke="#3a2418" strokeWidth={22} strokeLinecap="round" />
          <ellipse cx={1330} cy={352} rx={46} ry={38} fill="#e07a6a" />
          <path d={`M 1206 418 Q 1330 ${520 + ri * 24} 1460 418 Q 1330 ${446 + ri * 8} 1206 418 Z`} fill="#7a1f35" />
          <path d="M 1240 428 Q 1330 452 1420 428 L 1410 446 Q 1330 466 1250 446 Z" fill="#fff" />
          <path d="M 1330 380 Q 1240 372 1176 428 Q 1250 410 1330 400 Q 1410 410 1484 428 Q 1420 372 1330 380 Z" fill="#4a2a17" />
          <path d="M 1140 300 Q 1130 230 1160 200 L 1180 300 Z" fill="#4a2a17" /><path d="M 1520 300 Q 1530 230 1500 200 L 1480 300 Z" fill="#4a2a17" />
          {/* casco de hierro */}
          <path d="M 1110 210 Q 1120 30 1330 20 Q 1540 30 1550 210 Z" fill="#6a6e7c" />
          <ellipse cx={1330} cy={206} rx={270} ry={40} fill="#7a7e8c" />
          <ellipse cx={1330} cy={196} rx={250} ry={22} fill="#8a8e9c" />
          <path d="M 1180 100 Q 1250 50 1330 48" stroke="#a8acb8" strokeWidth={14} fill="none" strokeLinecap="round" />
          <circle cx={1330} cy={14} r={20} fill="#5a5e6c" />
          {[1160, 1240, 1420, 1500].map((x) => <circle key={x} cx={x} cy={196} r={7} fill="#4a4e5a" />)}
        </g>
        {/* ratas */}
        <Rata x={150 + Math.min(1, t) * 20} y={930} s={0.95} t={t} boca />
        <Rata x={980} y={860} s={0.55} t={t} flip />
        <Rata x={1720 - Math.min(1, t) * 30} y={990} s={0.6} t={t} />
        {/* luz cálida general */}
        <rect width={1920} height={1080} fill="#ff9a3a" opacity={0.06 * fl} />
      </svg>
    </AbsoluteFill>
  );
};
