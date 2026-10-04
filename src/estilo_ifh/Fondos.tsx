// Fondos "pintados" 100% SVG: tinta irregular + cel shading + degradés de aerógrafo.
import React from "react";
import { TINTA } from "./Personaje";

const W = 1920, H = 1080;
// pseudo-azar determinista
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const L = { stroke: TINTA, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// Grano + viñeta comunes (encima de todo)
export const Acabado: React.FC<{ vig?: number; id: string }> = ({ vig = 0.55, id }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs>
      <radialGradient id={`vg${id}`} cx="50%" cy="48%" r="75%">
        <stop offset="55%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#120a06" stopOpacity={vig} />
      </radialGradient>
      <filter id={`gr${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.09 0" /></filter>
    </defs>
    <rect width={W} height={H} filter={`url(#gr${id})`} />
    <rect width={W} height={H} fill={`url(#vg${id})`} />
  </svg>
);

// Ventanas en grilla
const Ventanas: React.FC<{ x: number; y: number; cols: number; rows: number; w: number; h: number; gx: number; gy: number; luz?: string; seed?: number }> =
  ({ x, y, cols, rows, w, h, gx, gy, luz = "#f6d58a", seed = 0 }) => (
    <g>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols); const xx = x + c * (w + gx), yy = y + r * (h + gy);
        const on = rnd(i + seed) > 0.72;
        return (
          <g key={i}>
            <rect x={xx} y={yy} width={w} height={h} fill={on ? luz : "#3c4a57"} {...L} strokeWidth={2.4} />
            {!on && <path d={`M${xx + 3},${yy + h - 4} L${xx + w * 0.6},${yy + 3}`} stroke="#9fb3c2" strokeWidth={5} opacity={0.35} />}
            <path d={`M${xx + w / 2},${yy} V${yy + h} M${xx},${yy + h / 2} H${xx + w}`} stroke={TINTA} strokeWidth={1.6} opacity={0.7} />
            <rect x={xx - 4} y={yy + h} width={w + 8} height={6} fill="#d9cdb8" {...L} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );

/* ───────────────────────── CALLE AL AMANECER ───────────────────────── */
export const FondoCalle: React.FC = () => {
  const edif = [
    { x: -20, w: 380, h: 470, c: "#b5664a", t: "#8e4a35" },
    { x: 360, w: 300, h: 380, c: "#d7b98d", t: "#b4966b" },
    { x: 660, w: 420, h: 430, c: "#6f8a7c", t: "#536c60" },
    { x: 1080, w: 330, h: 500, c: "#c98c5a", t: "#a46c3f" },
    { x: 1410, w: 530, h: 410, c: "#a7a3a0", t: "#85807c" },
  ];
  const base = 640;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d93b8" /><stop offset="0.45" stopColor="#e9b4a2" /><stop offset="1" stopColor="#f7d7a4" />
        </linearGradient>
        <radialGradient id="sol" cx="78%" cy="38%" r="40%"><stop offset="0" stopColor="#fff3cf" stopOpacity={0.95} /><stop offset="1" stopColor="#ffd7a0" stopOpacity={0} /></radialGradient>
        <linearGradient id="calz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d5a5c" /><stop offset="1" stopColor="#3a3739" /></linearGradient>
        <linearGradient id="sombraEdif" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#2b1a2a" stopOpacity={0} /><stop offset="1" stopColor="#2b1a2a" stopOpacity={0.35} /></linearGradient>
        <linearGradient id="bruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7d7a4" stopOpacity={0} /><stop offset="1" stopColor="#f7d7a4" stopOpacity={0.55} /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#cielo)" />
      <rect width={W} height={H} fill="url(#sol)" />
      {/* nubes */}
      {[[260, 150, 1.2], [880, 110, 0.9], [1500, 190, 1.1]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.75}>
          <path d="M-120,20 Q-110,-20 -60,-10 Q-40,-45 10,-25 Q50,-50 90,-15 Q140,-15 130,20 Z" fill="#fbe2cf" />
          <path d="M-120,20 Q-20,30 130,20" stroke="#e1a49a" strokeWidth={6} opacity={0.6} fill="none" />
        </g>
      ))}
      {/* skyline lejano en bruma */}
      <g fill="#c99a9a" opacity={0.55}>
        {Array.from({ length: 18 }).map((_, i) => { const w = 70 + rnd(i) * 90, h = 120 + rnd(i + 9) * 260; return <rect key={i} x={i * 112 - 30} y={base - 230 - h} width={w} height={h + 240} />; })}
      </g>
      {/* grúa */}
      <g stroke="#a77f86" strokeWidth={5} fill="none" opacity={0.7}>
        <path d="M1620,90 V420 M1500,110 H1790 M1620,90 L1520,110 M1620,90 L1780,110" />
        <path d="M1740,110 V170" strokeWidth={2} />
      </g>
      <rect y={200} width={W} height={base - 200} fill="url(#bruma)" />
      {/* edificios */}
      {edif.map((e, i) => {
        const top = base - e.h;
        return (
          <g key={i}>
            <rect x={e.x} y={top} width={e.w} height={e.h} fill={e.c} {...L} />
            {/* ladrillos sugeridos */}
            {Array.from({ length: 14 }).map((_, k) => <path key={k} d={`M${e.x + 20 + rnd(k + i * 20) * (e.w - 60)},${top + 30 + rnd(k * 3 + i) * (e.h - 160)} h${16 + rnd(k) * 20}`} stroke={e.t} strokeWidth={3} opacity={0.7} />)}
            <rect x={e.x - 8} y={top - 16} width={e.w + 16} height={20} fill={e.t} {...L} />
            <rect x={e.x} y={top} width={e.w} height={e.h} fill="url(#sombraEdif)" />
            <Ventanas x={e.x + 34} y={top + 50} cols={Math.floor((e.w - 40) / 70)} rows={Math.max(1, Math.floor((e.h - 200) / 95))} w={46} h={60} gx={24} gy={35} seed={i * 50} />
            {/* toldo + vidriera en planta baja */}
            <path d={`M${e.x + 14},${base - 150} h${e.w - 28} l18,46 h${-(e.w + 8)} Z`} fill={["#3f7d6b", "#c4473a", "#e1b44c", "#3e5f93", "#7b4d7e"][i]} {...L} />
            {Array.from({ length: Math.floor(e.w / 40) }).map((_, k) => <path key={k} d={`M${e.x + 14 + k * 40},${base - 150} l${10},46`} stroke="#fff" strokeWidth={9} opacity={0.25} />)}
            <rect x={e.x + 30} y={base - 100} width={e.w - 60} height={100} fill="#2f4250" {...L} />
            <path d={`M${e.x + 50},${base - 4} L${e.x + 120},${base - 96}`} stroke="#cfe3ea" strokeWidth={16} opacity={0.22} />
            <rect x={e.x + e.w / 2 - 26} y={base - 92} width={52} height={92} fill="#5b3b2a" {...L} />
          </g>
        );
      })}
      {/* vereda */}
      <rect y={base} width={W} height={130} fill="#cdb79c" {...L} />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${i * 130 - 40},${base} L${i * 130 - 90},${base + 130}`} stroke="#a58f75" strokeWidth={2.4} />)}
      <path d={`M0,${base + 30} H${W}`} stroke="#a58f75" strokeWidth={2} />
      {/* cordón */}
      <rect y={base + 130} width={W} height={22} fill="#e6dccb" {...L} />
      {/* calzada */}
      <rect y={base + 152} width={W} height={H - base - 152} fill="url(#calz)" />
      {/* senda peatonal en perspectiva */}
      {Array.from({ length: 9 }).map((_, i) => { const x0 = 980 + i * 70; return <path key={i} d={`M${x0},${base + 162} l40,0 l${70 + i * 18},${H - base - 162} l-70,0 Z`} fill="#eae6dc" opacity={0.92} />; })}
      <path d={`M0,${base + 300} H900`} stroke="#e8c45d" strokeWidth={8} strokeDasharray="70 50" />
      {/* faroles + sombras largas */}
      {[180, 760, 1640].map((x, i) => (
        <g key={i}>
          <path d={`M${x},${base + 110} L${x - 420},${base + 132}`} stroke="#3d2733" strokeWidth={14} opacity={0.25} />
          <path d={`M${x},${base + 110} V${base - 260}`} stroke="#2e3439" strokeWidth={10} />
          <path d={`M${x},${base - 260} q0,-26 34,-26`} stroke="#2e3439" strokeWidth={7} fill="none" />
          <path d={`M${x + 22},${base - 286} h34 l-6,18 h-22 Z`} fill="#3b434a" {...L} strokeWidth={2.4} />
        </g>
      ))}
      {/* árboles jóvenes en maceteros */}
      {[470, 1270].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 330},${base + 110} Q${x - 160},${base + 125} ${x},${base + 112}`} stroke="#3d2733" strokeWidth={26} opacity={0.18} fill="none" />
          <rect x={x - 34} y={base + 70} width={68} height={44} fill="#8b6a4e" {...L} />
          <path d={`M${x},${base + 70} V${base - 110}`} stroke="#5b3e2a" strokeWidth={8} />
          <ellipse cx={x} cy={base - 170} rx={70} ry={95} fill="#6e8b45" {...L} />
          <ellipse cx={x + 22} cy={base - 140} rx={40} ry={55} fill="#56703a" opacity={0.9} />
          <ellipse cx={x - 24} cy={base - 210} rx={26} ry={30} fill="#9ab565" opacity={0.85} />
        </g>
      ))}
      {/* cables */}
      <path d="M0,140 Q500,250 1000,170 T1920,210" stroke="#3a3138" strokeWidth={3} fill="none" />
      <path d="M0,170 Q520,290 1000,205 T1920,250" stroke="#3a3138" strokeWidth={2.4} fill="none" />
      {/* auto estacionado */}
      <g transform={`translate(1500 ${base + 230})`}>
        <path d="M-180,40 Q-185,-10 -150,-20 L-100,-70 Q-60,-90 40,-88 Q110,-86 140,-30 L185,-18 Q205,0 200,40 Z" fill="#9b3b32" {...L} />
        <path d="M-90,-62 L-60,-20 H40 L40,-78 Q-40,-80 -90,-62 Z M58,-76 L60,-20 H125 Q105,-70 58,-76 Z" fill="#33505e" {...L} strokeWidth={2.4} />
        <circle cx={-110} cy={42} r={30} fill="#1f1e20" {...L} /><circle cx={120} cy={42} r={30} fill="#1f1e20" {...L} />
        <circle cx={-110} cy={42} r={11} fill="#8a8a8a" /><circle cx={120} cy={42} r={11} fill="#8a8a8a" />
        <path d="M-160,0 H190" stroke="#ffb0a0" strokeWidth={5} opacity={0.45} />
      </g>
      {/* luz rasante cálida */}
      <rect width={W} height={H} fill="#ffb978" opacity={0.08} />
    </svg>
  );
};

/* ───────────────────────── ESCONDITE SUBTERRÁNEO ───────────────────────── */
export const FondoEscondite: React.FC<{ luz: number }> = ({ luz }) => {
  const piso = 690;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="lamp" cx="45%" cy="22%" r="62%"><stop offset="0" stopColor="#ffd98a" stopOpacity={0.75 * luz} /><stop offset="0.5" stopColor="#e7a253" stopOpacity={0.18 * luz} /><stop offset="1" stopColor="#1a0e08" stopOpacity={0.55} /></radialGradient>
        <linearGradient id="pisoG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d8573" /><stop offset="1" stopColor="#4c463d" /></linearGradient>
      </defs>
      {/* pared de tablas */}
      <rect width={W} height={piso} fill="#7a4a36" />
      {Array.from({ length: 24 }).map((_, i) => (
        <g key={i}>
          <rect x={i * 82} y={0} width={82} height={piso} fill={["#7f4c37", "#8a5440", "#6f4231", "#83503b"][i % 4]} {...L} strokeWidth={2.6} />
          <path d={`M${i * 82 + 20 + rnd(i) * 40},${120 + rnd(i + 3) * 400} q8,6 0,14 q-8,-6 0,-14`} fill="#4b2c1f" opacity={0.8} />
          <path d={`M${i * 82 + 14},${rnd(i * 5) * 200} v${80 + rnd(i) * 160}`} stroke="#a46a51" strokeWidth={2} opacity={0.5} />
          <circle cx={i * 82 + 10} cy={30} r={3} fill="#2a1a12" /><circle cx={i * 82 + 72} cy={piso - 40} r={3} fill="#2a1a12" />
        </g>
      ))}
      {/* zócalo */}
      <rect y={piso - 40} width={W} height={40} fill="#4f3125" {...L} />
      {/* caño vertical */}
      <rect x={900} y={0} width={46} height={piso - 40} fill="#8f949a" {...L} />
      <rect x={900} y={0} width={14} height={piso - 40} fill="#c8ccd0" opacity={0.6} />
      {[140, 420].map((y) => <rect key={y} x={892} y={y} width={62} height={24} fill="#6d7278" {...L} />)}
      {/* ventanuco con pinos */}
      <g>
        <rect x={420} y={150} width={260} height={150} fill="#1e3247" {...L} strokeWidth={5} />
        {[460, 520, 590, 650].map((x, i) => <path key={i} d={`M${x},${300} l26,-${90 + i * 10} l26,${90 + i * 10} Z`} fill="#2f5c47" stroke="#16261d" strokeWidth={2} />)}
        <path d="M420,225 H680 M550,150 V300" stroke={TINTA} strokeWidth={5} />
      </g>
      {/* placa con lámpara de emergencia */}
      <rect x={250} y={180} width={70} height={100} rx={10} fill="#5a6470" {...L} />
      <ellipse cx={285} cy={230} rx={18} ry={30} fill="#ffcf73" opacity={0.6 + 0.4 * luz} />
      {/* pizarra con mapa, notas e hilos */}
      <g>
        <rect x={1100} y={120} width={720} height={430} fill="#e9dfc6" {...L} strokeWidth={5} />
        <path d="M1150,200 Q1260,150 1340,230 T1520,260 Q1640,200 1700,300 T1760,470 Q1600,520 1460,470 T1220,500 Q1140,420 1190,330 Z" fill="#e6c34e" stroke="#9c7c1f" strokeWidth={3} />
        <path d="M1260,260 Q1400,330 1500,300 M1380,400 Q1500,380 1620,430" stroke="#b7932c" strokeWidth={3} fill="none" />
        {[[1170, 150, -4], [1310, 140, 3], [1660, 150, -2], [1720, 330, 4], [1150, 440, 2], [1560, 470, -3], [1430, 220, 5]].map(([x, y, r], i) => (
          <g key={i} transform={`rotate(${r} ${x} ${y})`}>
            <rect x={x} y={y} width={78} height={64} fill={i % 3 === 0 ? "#fdf6dd" : i % 3 === 1 ? "#cfe3ef" : "#f3d0c5"} {...L} strokeWidth={2} />
            {[0, 1, 2].map((k) => <path key={k} d={`M${x + 10},${y + 18 + k * 14} h${40 + rnd(i + k) * 18}`} stroke="#6c6458" strokeWidth={2.4} />)}
            <circle cx={x + 39} cy={y + 6} r={5} fill="#c0392b" stroke={TINTA} strokeWidth={1.4} />
          </g>
        ))}
        <path d="M1209,156 L1470,226 L1599,476 M1349,146 L1759,336 M1699,156 L1470,226" stroke="#c0392b" strokeWidth={2.4} fill="none" />
      </g>
      {/* lámpara colgante enjaulada */}
      <path d="M760,0 V120" stroke={TINTA} strokeWidth={4} />
      <g transform="translate(760 150)">
        <ellipse cx={0} cy={0} rx={30} ry={38} fill="#ffe7a8" opacity={0.6 + 0.4 * luz} />
        <path d="M-30,-20 Q0,-50 30,-20 V20 Q0,50 -30,20 Z M-30,0 H30 M0,-36 V44" fill="none" stroke={TINTA} strokeWidth={4} />
      </g>
      {/* piso de baldosas en perspectiva */}
      <rect y={piso} width={W} height={H - piso} fill="url(#pisoG)" {...L} />
      {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M${960 + (i - 11) * 120},${piso} L${960 + (i - 11) * 330},${H}`} stroke="#3e392f" strokeWidth={2.4} />)}
      {[730, 790, 870, 970].map((y) => <path key={y} d={`M0,${y} H${W}`} stroke="#3e392f" strokeWidth={2.4} />)}
      {/* papeles en el piso */}
      {[[600, 900, 12], [1300, 960, -20], [1500, 820, 30]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={70} height={46} transform={`rotate(${r} ${x} ${y})`} fill="#efe8d5" {...L} strokeWidth={2} />)}
      {/* cajones apilados izq */}
      {[[40, 560, 230, 170], [70, 400, 190, 160], [270, 600, 170, 130]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={["#a87b4f", "#b98a5b", "#9c7046"][i]} {...L} strokeWidth={3.4} />
          <path d={`M${x},${y} L${x + w},${y + h} M${x + w},${y} L${x},${y + h}`} stroke="#6f4d2f" strokeWidth={6} />
          <rect x={x} y={y} width={w} height={h} fill="none" {...L} strokeWidth={3.4} />
        </g>
      ))}
      {/* banco de madera */}
      <g>
        <path d="M1240,740 L1640,740 L1600,800 L1200,800 Z" fill="#9c6c47" {...L} />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${1228 + k * 84},${745} l-14,50`} stroke="#6a4630" strokeWidth={3} />)}
        <path d="M1215,800 v70 M1590,800 v70" stroke={TINTA} strokeWidth={8} />
      </g>
      {/* luz y sombra de la lámpara */}
      <rect width={W} height={H} fill="url(#lamp)" />
    </svg>
  );
};

/* ───────────────────────── CUARTO DEL STREAMER ───────────────────────── */
export const FondoCuarto: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="pared" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8b8f95" /><stop offset="1" stopColor="#686b70" /></linearGradient>
      <radialGradient id="lampara" cx="74%" cy="40%" r="35%"><stop offset="0" stopColor="#ffd28a" stopOpacity={0.55} /><stop offset="1" stopColor="#ffd28a" stopOpacity={0} /></radialGradient>
      <linearGradient id="haz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dc" stopOpacity={0.5} /><stop offset="1" stopColor="#fff6dc" stopOpacity={0} /></linearGradient>
    </defs>
    <rect width={W} height={720} fill="url(#pared)" />
    {/* esquina */}
    <path d="M1250,0 V720" stroke="#55585d" strokeWidth={4} />
    <rect x={1250} width={670} height={720} fill="#4f5257" />
    {/* piso */}
    <rect y={720} width={W} height={360} fill="#b9b3a7" {...L} />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${i * 140 - 200},${720} L${i * 200 - 700},${H}`} stroke="#8e887d" strokeWidth={2.4} />)}
    {[790, 890].map((y) => <path key={y} d={`M0,${y} H${W}`} stroke="#8e887d" strokeWidth={2.4} />)}
    {/* haz de luz de ventana */}
    <path d="M220,0 L620,0 L900,1080 L300,1080 Z" fill="url(#haz)" opacity={0.6} />
    {/* puerta con póster */}
    <rect x={720} y={150} width={300} height={570} fill="#a9aaa9" {...L} strokeWidth={4} />
    <rect x={740} y={170} width={260} height={530} fill="none" stroke="#7f8180" strokeWidth={3} />
    <circle cx={990} cy={450} r={9} fill="#3a3a3a" />
    <rect x={790} y={230} width={160} height={110} fill="#2a2b2f" {...L} transform="rotate(-6 870 285)" />
    <path d="M815,280 h110 M830,300 h80" stroke="#d5d5d5" strokeWidth={6} transform="rotate(-6 870 285)" />
    {/* póster rojo + reloj */}
    <rect x={250} y={90} width={150} height={200} fill="#9e2b28" {...L} transform="rotate(3 325 190)" />
    <circle cx={325} cy={180} r={44} fill="#cf5a43" stroke={TINTA} strokeWidth={2.4} />
    {/* perchero */}
    <g stroke="#3a2c25" strokeWidth={8} fill="none" strokeLinecap="round">
      <path d="M1140,700 V250 M1140,270 l-40,-40 M1140,290 l40,-46 M1140,330 l-34,-20 M1100,710 l40,-18 l40,18" />
    </g>
    <path d="M1170,300 q30,40 10,160 l-30,-6 q10,-90 20,-154 Z" fill="#4b5a3d" {...L} />
    {/* mueble bajo con cajas */}
    <rect x={60} y={430} width={540} height={290} fill="#c7a77c" {...L} strokeWidth={4} />
    <rect x={60} y={420} width={560} height={26} fill="#a88a61" {...L} />
    <rect x={90} y={470} width={220} height={220} fill="#8e7756" {...L} />
    <rect x={340} y={470} width={230} height={220} fill="#b79669" {...L} />
    <rect x={110} y={530} width={180} height={110} fill="#d8c19a" {...L} />
    <path d="M110,560 H290" stroke="#a58c65" strokeWidth={3} />
    <rect x={100} y={360} width={130} height={60} fill="#5d5f63" {...L} />
    <rect x={260} y={390} width={170} height={30} fill="#efe9dc" {...L} strokeWidth={2} transform="rotate(-3 345 405)" />
    {/* cama a la derecha */}
    <path d="M1300,560 L1920,520 L1920,900 L1260,900 Z" fill="#3e4a46" {...L} strokeWidth={4} />
    <path d="M1320,600 Q1500,540 1700,580 Q1850,610 1920,560 V720 Q1700,760 1500,700 Q1360,670 1300,700 Z" fill="#5f706a" {...L} />
    <path d="M1400,640 q60,-30 120,0 M1600,660 q50,-26 110,8" stroke="#2f3a37" strokeWidth={3} fill="none" />
    <rect x={1380} y={500} width={190} height={80} rx={30} fill="#d9d4c4" {...L} />
    {/* velador */}
    <path d="M1760,330 h120 l-24,-90 h-72 Z" fill="#d8b26a" {...L} />
    <path d="M1820,330 V470 M1780,470 h80" stroke={TINTA} strokeWidth={6} />
    <rect width={W} height={H} fill="url(#lampara)" />
    {/* medias y envoltorio en el piso */}
    <path d="M560,960 q40,-20 70,6 q-10,30 -60,20 Z" fill="#6f7a4d" {...L} />
    <rect x={980} y={930} width={70} height={30} fill="#d8573a" {...L} strokeWidth={2} transform="rotate(14 1015 945)" />
    <rect width={W} height={H} fill="#2d3540" opacity={0.12} />
  </svg>
);

/* ───────────────────────── DESIERTO (paneo infinito) ───────────────────────── */
// tira de 1920 px que se repite; `off` = desplazamiento por capa
const Colinas: React.FC<{ y: number; amp: number; color: string; seed: number; off: number; borde?: boolean }> = ({ y, amp, color, seed, off, borde = true }) => {
  const tira = (dx: number) => {
    let d = `M${dx},${H} L${dx},${y}`;
    for (let i = 0; i <= 12; i++) {
      const x = dx + i * 160, yy = y - (Math.sin(i * 1.3 + seed) * 0.5 + 0.5) * amp - rnd(i + seed) * amp * 0.3;
      d += ` Q${x - 80},${yy - amp * 0.25} ${x},${yy}`;
    }
    return d + ` L${dx + 1920},${H} Z`;
  };
  const o = -(off % 1920);
  return (
    <g>
      <path d={tira(o)} fill={color} stroke={borde ? TINTA : "none"} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={tira(o + 1920)} fill={color} stroke={borde ? TINTA : "none"} strokeWidth={2.6} strokeLinejoin="round" />
    </g>
  );
};

export const FondoDesierto: React.FC<{ t: number }> = ({ t }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="cieloD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f9bd1" /><stop offset="0.7" stopColor="#bfe0ee" /><stop offset="1" stopColor="#f0e2c4" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#cieloD)" />
    <circle cx={1500} cy={170} r={38} fill="#fffbe9" />
    <circle cx={1500} cy={170} r={90} fill="#fffbe9" opacity={0.25} />
    {[[300, 180], [900, 130], [1300, 250]].map(([x, y], i) => (
      <ellipse key={i} cx={((x - t * 0.15) % 2100 + 2100) % 2100 - 100} cy={y} rx={140} ry={26} fill="#fff" opacity={0.7} />
    ))}
    {/* mesetas lejanas */}
    <Colinas y={560} amp={90} color="#d9c2a8" seed={2} off={t * 0.25} borde={false} />
    <Colinas y={620} amp={110} color="#c8a27a" seed={5} off={t * 0.7} />
    {/* postes de teléfono */}
    {Array.from({ length: 4 }).map((_, i) => {
      const x = ((i * 560 - t * 1.6) % 2240 + 2240) % 2240 - 160;
      return (
        <g key={i}>
          <path d={`M${x},${700} V${330}`} stroke="#5b3f2b" strokeWidth={9} />
          <path d={`M${x - 50},${360} H${x + 50}`} stroke="#5b3f2b" strokeWidth={7} />
        </g>
      );
    })}
    <Colinas y={720} amp={70} color="#b5875a" seed={9} off={t * 1.6} />
    {/* matas secas */}
    {Array.from({ length: 10 }).map((_, i) => {
      const x = ((i * 230 - t * 2.6) % 2300 + 2300) % 2300 - 100;
      return <path key={i} d={`M${x},790 l-18,-40 M${x},790 l0,-50 M${x},790 l20,-38 M${x},790 l-34,-20 M${x},790 l34,-22`} stroke="#6b5a2c" strokeWidth={4} strokeLinecap="round" />;
    })}
    <rect y={780} width={W} height={300} fill="#a17650" />
  </svg>
);
