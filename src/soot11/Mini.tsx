import React from "react";
import { clamp } from "../soot/lib";

// Cuadro 0 = la miniatura elegida (soot11_elegida.png) rehecha en código, SIN el texto y SIN la flecha:
// la iglesia dorada, el verdugo encapuchado solo en un banco larguísimo (hacha, bolsa de monedas) y la gente
// apretada en los bancos de la derecha, tapándose la boca, uno lo señala. 0-0,9 s cobra vida (rayos, velas,
// parpadeo, suspiro, empuje de cámara); 0,9-1,45 s la cámara entra por el vitral y aparece el pueblo (P0).
const T_ZOOM = 0.9, T_FIN = 1.45;

const Vela: React.FC<{ x: number; y: number; t: number; s?: number; i: number }> = ({ x, y, t, s = 1, i }) => {
  const f = 1 + Math.sin(t * 23 + i * 1.7) * 0.12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-34} r={34 * f} fill="#ffcf6a" opacity={0.25} />
      <rect x={-8} y={-22} width={16} height={34} rx={4} fill="#f6ead0" />
      <path d={`M 0 ${-46 * f} Q 9 -30 0 -22 Q -9 -30 0 ${-46 * f} Z`} fill="#ffd36a" />
    </g>
  );
};
const Arana: React.FC<{ x: number; y: number; w: number; t: number; k: number }> = ({ x, y, w, t, k }) => (
  <g>
    <line x1={x} y1={y - 140} x2={x} y2={y - 40} stroke="#3a2414" strokeWidth={5} />
    {[-1, 1].map((d) => <line key={d} x1={x} y1={y - 40} x2={x + d * w * 0.45} y2={y} stroke="#3a2414" strokeWidth={4} />)}
    <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.09} fill="none" stroke="#3a2414" strokeWidth={10} />
    {Array.from({ length: 7 }, (_, i) => <Vela key={i} x={x - w * 0.45 + (i * w * 0.9) / 6} y={y - 6 + Math.sin((i / 6) * Math.PI) * w * 0.05} t={t} i={i + k} s={1.1} />)}
  </g>
);
const Vitral: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => {
  const cols = ["#5ab8e8", "#f0c040", "#e86a9a", "#8ad04a", "#9a6ae0", "#f08a3a", "#ffe08a"];
  const nx = 5, ny = 9;
  return (
    <g>
      <path d={`M ${x} ${y + h} L ${x} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`} fill="#4a2a14" />
      <clipPath id={`vit${x}`}><path d={`M ${x + 10} ${y + h} L ${x + 10} ${y + w / 2} A ${w / 2 - 10} ${w / 2 - 10} 0 0 1 ${x + w - 10} ${y + w / 2} L ${x + w - 10} ${y + h} Z`} /></clipPath>
      <g clipPath={`url(#vit${x})`}>
        {Array.from({ length: nx * ny }, (_, i) => {
          const cx = i % nx, cy = Math.floor(i / nx);
          return <rect key={i} x={x + (cx * w) / nx} y={y + (cy * h) / ny} width={w / nx} height={h / ny} fill={cols[(cx * 3 + cy * 5) % cols.length]} stroke="#3a2010" strokeWidth={5} opacity={0.85 + 0.15 * Math.sin(t * 3 + i)} />;
        })}
        <rect x={x + w / 2 - 14} y={y + h * 0.18} width={28} height={h * 0.6} fill="#fff6c8" />
        <rect x={x + w * 0.22} y={y + h * 0.33} width={w * 0.56} height={26} fill="#fff6c8" />
      </g>
    </g>
  );
};
const Estandarte: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => (
  <g transform={`translate(${x} ${y}) skewX(${Math.sin(t * 2 + x) * 1.2})`}>
    <rect x={-8} y={-14} width={w + 16} height={14} rx={6} fill="#5a3418" />
    <path d={`M 0 0 L ${w} 0 L ${w} ${h} L ${w / 2} ${h - 34} L 0 ${h} Z`} fill="#8a1a24" stroke="#5e0f1d" strokeWidth={5} />
    <path d={`M ${w / 2 - 10} ${h * 0.18} h 20 v ${h * 0.16} h ${w * 0.22} v 20 h ${-w * 0.22} v ${h * 0.34} h -20 v ${-h * 0.34} h ${-w * 0.22} v -20 h ${w * 0.22} Z`} fill="#e8b040" />
  </g>
);
// cara de la multitud: ojos grandes que miran a la izquierda, mano a la boca
const Cara: React.FC<{ x: number; y: number; s: number; piel: string; ropa: string; tela?: string; t: number; i: number; barba?: boolean; boca?: boolean }> = ({ x, y, s, piel, ropa, tela, t, i, barba, boca = true }) => {
  const parp = Math.abs(t - (0.55 + i * 0.04)) < 0.05 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -110 220 Q -100 90 0 80 Q 100 90 110 220 Z" fill={ropa} />
      {tela && <path d="M -82 20 Q -90 -90 0 -96 Q 90 -90 82 20 Q 96 80 60 110 L -60 110 Q -96 80 -82 20 Z" fill={tela} />}
      <ellipse cx={0} cy={0} rx={62} ry={70} fill={piel} />
      {barba && <path d="M -50 20 Q -40 90 0 96 Q 40 90 50 20 Q 0 46 -50 20 Z" fill="#4a2a14" />}
      {[-22, 22].map((dx) => <g key={dx}><ellipse cx={dx} cy={-8} rx={18} ry={22 * parp} fill="#fff" stroke="#2b1c14" strokeWidth={3} /><circle cx={dx - 7} cy={-6} r={9 * parp} fill="#1d1410" /></g>)}
      <path d="M -36 -32 L -12 -42 M 36 -32 L 12 -42" stroke="#4a2a14" strokeWidth={5} strokeLinecap="round" />
      {boca && <ellipse cx={0} cy={44} rx={34} ry={24} fill={piel} stroke="#00000022" strokeWidth={3} />}
    </g>
  );
};

export const Mini: React.FC<{ t: number }> = ({ t }) => {
  if (t >= T_FIN) return null;
  const u = clamp((t - T_ZOOM) / (T_FIN - T_ZOOM), 0, 1);
  const ee = u * u * (3 - 2 * u);
  const empuje = 1 + clamp(t / T_ZOOM, 0, 1) * 0.035;
  const zoom = empuje * Math.exp(Math.log(7) * ee);
  const op = 1 - clamp((u - 0.55) / 0.45, 0, 1);
  const sus = Math.sin(clamp(t / 0.9, 0, 1) * Math.PI) * 6; // suspiro
  const rayo = 0.22 + 0.08 * Math.sin(t * 5);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: op }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, transform: `scale(${zoom})`, transformOrigin: "1450px 210px" }}>
        <defs>
          <linearGradient id="mpared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a3a20" /><stop offset="0.6" stopColor="#b06a34" /><stop offset="1" stopColor="#d8904a" /></linearGradient>
          <linearGradient id="mpiso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a6a5a" /><stop offset="1" stopColor="#c8a080" /></linearGradient>
          <linearGradient id="mrayo" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3c0" stopOpacity="0.9" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" /></linearGradient>
          <radialGradient id="mluz" cx="0.75" cy="0.25" r="0.7"><stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
          <linearGradient id="mbanco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c87a30" /><stop offset="1" stopColor="#7a3a14" /></linearGradient>
        </defs>
        {/* nave: pared, columnas, arcos */}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#mpared)" />
        {[60, 640, 1010, 1640].map((x, i) => <g key={x}><rect x={x} y={0} width={110 - i * 6} height={1000} fill="#8a5434" /><rect x={x + 12} y={0} width={22} height={1000} fill="#a86a40" opacity={0.6} /></g>)}
        {[[180, 640], [1120, 1640]].map(([a, b], i) => <path key={i} d={`M ${a} 700 L ${a} 260 Q ${(a + b) / 2} -80 ${b} 260 L ${b} 700`} fill="none" stroke="#7a4a2a" strokeWidth={26} opacity={0.6} />)}
        <Vitral x={1355} y={20} w={190} h={420} t={t} />
        <Vitral x={360} y={120} w={110} h={300} t={t} />
        <Vitral x={1075} y={180} w={50} h={360} t={t} />
        <rect x={0} y={0} width={1920} height={1080} fill="url(#mluz)" />
        {/* rayos de luz */}
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${1380 + i * 45} ${80 + i * 30} L ${1450 + i * 45} ${60 + i * 30} L ${760 + i * 150} 1080 L ${560 + i * 150} 1080 Z`} fill="url(#mrayo)" opacity={rayo + i * 0.03} />)}
        <Estandarte x={790} y={230} w={104} h={250} t={t} />
        <Estandarte x={1758} y={140} w={128} h={250} t={t} />
        <Arana x={1160} y={150} w={210} t={t} k={0} />
        <Arana x={1700} y={80} w={260} t={t} k={9} />
        {[[640, 380], [60, 430], [1475, 360]].map(([x, y], i) => <g key={i}><rect x={x - 5} y={y} width={10} height={200} fill="#3a2414" /><rect x={x - 50} y={y - 6} width={100} height={10} fill="#3a2414" />{[-40, 0, 40].map((d, k) => <Vela key={d} x={x + d} y={y - 6} t={t} i={i * 3 + k + 20} />)}</g>)}
        {/* gente del fondo (siluetas) */}
        {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={900 + i * 70} cy={560 + (i % 2) * 20} rx={34} ry={40} fill="#5a3420" opacity={0.6} />)}
        {/* piso */}
        <rect x={0} y={1000} width={1920} height={80} fill="url(#mpiso)" />
        <path d="M 0 1010 L 1920 1000" stroke="#ffe9b8" strokeWidth={6} opacity={0.5} />
        {/* bancos de la derecha con la multitud */}
        <Cara x={1265} y={500} s={0.95} piel="#c88a5a" ropa="#6a3a2a" tela="#7a4a2a" t={t} i={0} />
        <Cara x={1700} y={470} s={1.0} piel="#f0c49a" ropa="#7a2a2a" tela="#e0d6c0" t={t} i={1} />
        <Cara x={1880} y={440} s={1.05} piel="#f0c8a8" ropa="#7a5a4a" tela="#d8d0c4" t={t} i={2} barba />
        <Cara x={1440} y={540} s={1.02} piel="#f2c09a" ropa="#3a6a3a" tela="#f2ead8" t={t} i={3} />
        <Cara x={1555} y={445} s={1.0} piel="#e8b088" ropa="#2a5a6a" tela="#4a5a2a" t={t} i={4} barba boca={false} />
        <Cara x={1700} y={560} s={1.0} piel="#f0c09a" ropa="#7a2a3a" tela="#8a3a3a" t={t} i={5} />
        <Cara x={1860} y={665} s={0.95} piel="#f0c8a8" ropa="#8a3a4a" tela="#3a4a2a" t={t} i={6} />
        {/* manos a la boca */}
        {[[1440, 590], [1700, 610], [1265, 545], [1860, 705]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={42} ry={30} fill="#f0c49a" stroke="#00000022" strokeWidth={3} />)}
        {/* el que señala */}
        <path d={`M 1520 590 Q 1450 600 ${1390 - Math.sin(t * 6) * 6} 600`} stroke="#2a5a6a" strokeWidth={40} strokeLinecap="round" fill="none" />
        <ellipse cx={1378 - Math.sin(t * 6) * 6} cy={598} rx={26} ry={18} fill="#e8b088" />
        <path d={`M ${1360 - Math.sin(t * 6) * 6} 592 l -40 -4`} stroke="#e8b088" strokeWidth={14} strokeLinecap="round" />
        {/* respaldos de los bancos de la derecha */}
        <path d="M 1160 640 L 1920 700 L 1920 780 L 1160 720 Z" fill="url(#mbanco)" stroke="#4a2410" strokeWidth={5} />
        <path d="M 1160 760 L 1920 830 L 1920 880 L 1160 810 Z" fill="#7a4220" />
        {[1360, 1560].map((x) => <g key={x}><rect x={x} y={660} width={70} height={340} rx={10} fill="#8a4a20" stroke="#4a2410" strokeWidth={6} /><circle cx={x + 35} cy={660} r={36} fill="#8a4a20" stroke="#4a2410" strokeWidth={6} /></g>)}
        {/* el banco larguísimo y vacío de la izquierda */}
        <path d="M 0 470 L 1190 610 L 1190 720 L 0 600 Z" fill="url(#mbanco)" stroke="#4a2410" strokeWidth={6} />
        {[0, 1, 2].map((i) => <path key={i} d={`M 0 ${505 + i * 34} L 1190 ${640 + i * 28}`} stroke="#5a3010" strokeWidth={3} opacity={0.5} />)}
        <path d="M 0 790 L 1240 850 L 1240 880 L 0 830 Z" fill="#c07a3a" stroke="#4a2410" strokeWidth={5} />
        <path d="M 0 830 L 1240 880 L 1240 990 L 0 960 Z" fill="#6a3a18" />
        {[300, 700, 1000].map((x) => <rect key={x} x={x} y={860} width={24} height={130} fill="#4a2410" />)}
        <rect x={1195} y={600} width={62} height={400} rx={10} fill="#8a4a20" stroke="#4a2410" strokeWidth={6} />
        <circle cx={1226} cy={600} r={34} fill="#8a4a20" stroke="#4a2410" strokeWidth={6} />
        {/* el hacha apoyada */}
        <line x1={28} y1={1035} x2={236} y2={384} stroke="#6a4020" strokeWidth={26} strokeLinecap="round" />
        <rect x={10} y={1010} width={40} height={30} rx={6} fill="#8a8e98" />
        <path d="M 196 430 Q 60 400 52 470 Q 40 560 70 650 Q 150 600 214 560 Z" fill="#c8ccd6" stroke="#5a5e68" strokeWidth={7} />
        <path d="M 70 470 Q 62 560 84 630" stroke="#f2f4f8" strokeWidth={8} fill="none" />
        <rect x={190} y={440} width={48} height={110} rx={8} fill="#6a6e78" transform="rotate(18 214 495)" />
        <path d="M 230 370 L 250 330 L 260 380 Z" fill="#8a8e98" />
        {/* la bolsa de monedas */}
        <path d="M 160 810 Q 140 720 200 700 L 270 700 Q 330 720 318 810 Z" fill="#8a4a20" stroke="#4a2410" strokeWidth={6} />
        <path d="M 196 700 Q 235 680 274 700" stroke="#4a2410" strokeWidth={8} fill="none" />
        {[[200, 710], [230, 702], [262, 712], [150, 815], [182, 822], [250, 826], [290, 818]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={18} ry={9} fill="#f4c43a" stroke="#a87a14" strokeWidth={3} />)}
        {/* el verdugo, solo */}
        <g transform={`translate(0 ${sus * 0.4})`}>
          {/* piernas y botas */}
          <path d="M 330 760 L 470 760 L 470 900 L 344 900 Z" fill="#26222a" />
          <path d="M 480 760 L 620 760 L 640 900 L 508 900 Z" fill="#26222a" />
          {[[338, 470], [500, 640]].map(([a, b], i) => <g key={i}><path d={`M ${a} 880 L ${b - 14} 880 L ${b} 1000 Q ${b + 30} 1010 ${b + 32} 1034 L ${a - 6} 1034 Z`} fill="#7a4a24" stroke="#3a2010" strokeWidth={6} /><rect x={a + 14} y={930} width={(b - a) - 50} height={16} fill="#4a2a10" /><rect x={a + 50} y={926} width={24} height={24} rx={3} fill="none" stroke="#e0a840" strokeWidth={5} /></g>)}
          {/* torso con la túnica rota */}
          <path d="M 300 540 Q 330 480 420 480 Q 540 480 560 560 L 590 770 L 300 770 Z" fill="#2e2a34" />
          <path d="M 300 700 l 30 50 l 20 -40 l 26 54 l 24 -44 l 30 50 l 22 -46 l 28 52 l 24 -48 l 30 46 l 20 -60 L 590 700 Z" fill="#2e2a34" />
          <rect x={312} y={668} width={272} height={30} fill="#5a3418" /><rect x={420} y={662} width={48} height={42} rx={6} fill="none" stroke="#e0a840" strokeWidth={6} />
          {/* capucha */}
          <path d="M 330 560 Q 300 360 470 340 Q 620 350 610 520 Q 600 600 540 600 L 400 600 Q 340 600 330 560 Z" fill="#1d1a22" />
          {/* brazos sobre las rodillas, manos juntas */}
          <path d="M 330 560 Q 320 680 430 740" stroke="#2e2a34" strokeWidth={70} strokeLinecap="round" fill="none" />
          <path d="M 570 570 Q 600 690 510 740" stroke="#2e2a34" strokeWidth={70} strokeLinecap="round" fill="none" />
          <rect x={360} y={660} width={80} height={60} rx={14} fill="#7a4a24" transform="rotate(30 400 690)" /><rect x={505} y={662} width={80} height={60} rx={14} fill="#7a4a24" transform="rotate(-30 545 692)" />
          {[0, 1, 2].map((i) => <circle key={i} cx={378 + i * 22} cy={684 + i * 6} r={5} fill="#c08a3a" />)}
          <ellipse cx={470} cy={752} rx={58} ry={40} fill="#f0b88a" stroke="#c88a5a" strokeWidth={4} />
          {/* cabeza agachada */}
          <g transform={`translate(0 ${sus})`}>
            <ellipse cx={490} cy={470} rx={96} ry={104} fill="#f2c094" />
            <path d="M 396 430 Q 390 330 480 330 Q 600 330 588 440 Q 560 380 510 400 Q 460 370 430 410 Z" fill="#8a4a1e" />
            <path d="M 470 334 l -10 -40 l 30 32 l 10 -36 l 14 40" fill="#8a4a1e" />
            {[452, 534].map((x) => <g key={x}><ellipse cx={x} cy={482} rx={28} ry={34} fill="#fff" stroke="#2b1c14" strokeWidth={4} /><circle cx={x + 4} cy={500} r={15} fill="#1d1410" /><circle cx={x + 8} cy={494} r={4} fill="#fff" /></g>)}
            <path d="M 418 444 L 466 428 M 562 444 L 514 428" stroke="#5a2a10" strokeWidth={8} strokeLinecap="round" />
            <ellipse cx={420} cy={530} rx={20} ry={12} fill="#ff8a8a" opacity={0.5} /><ellipse cx={566} cy={530} rx={20} ry={12} fill="#ff8a8a" opacity={0.5} />
            <path d="M 470 556 Q 492 540 514 556" stroke="#5a2a10" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M 480 566 Q 492 590 504 566 Z" fill="#8a4a1e" />
          </g>
        </g>
      </svg>
      {/* destello al cruzar el vitral */}
      <div style={{ position: "absolute", inset: 0, background: "#fff6d8", opacity: clamp((u - 0.35) / 0.3, 0, 1) * (1 - clamp((u - 0.75) / 0.25, 0, 1)) * 0.9 }} />
    </div>
  );
};
