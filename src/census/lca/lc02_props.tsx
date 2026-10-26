// lc02 · utilería y diagramas del invierno: mantas escocesas, motosierra, tablas, linterna, escáner, reloj radiocontrolado,
// torre WWVB, la casa en corte, la pila de una cuerda, el diente, la cabeza, la estación antártica, las dos estufas.
import React from "react";
import { interpolate } from "remotion";
import { Halo } from "../../anikit/luz";
import { AMBAR, ROJO_CENSO } from "../elenco";
import { F_MONO } from "../hud";

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// manta escocesa (tapa de la cintura para abajo a alguien sentado); x,y = centro de la base
export const Manta: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; raya?: string; id?: string }> = ({ x, y, w = 260, h = 200, color = "#9a3a34", raya = "#2a2a4a", id = "m" }) => (
  <g>
    <defs>
      <pattern id={`esc${id}`} width={44} height={44} patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
        <rect width={44} height={44} fill={color} />
        <rect width={44} height={10} y={16} fill={raya} opacity={0.55} /><rect width={10} height={44} x={16} fill={raya} opacity={0.55} />
        <rect width={44} height={3} y={30} fill="#f2e2c8" opacity={0.5} /><rect width={3} height={44} x={30} fill="#f2e2c8" opacity={0.5} />
      </pattern>
    </defs>
    <path d={`M${x - w / 2},${y} Q${x - w / 2 - 20},${y - h * 0.6} ${x - w * 0.32},${y - h} Q${x},${y - h - 30} ${x + w * 0.34},${y - h + 6} Q${x + w / 2 + 16},${y - h * 0.5} ${x + w / 2},${y} Z`} fill={`url(#esc${id})`} />
    <path d={`M${x - w * 0.32},${y - h} Q${x},${y - h - 30} ${x + w * 0.34},${y - h + 6}`} stroke="#00000033" strokeWidth={8} fill="none" />
    {Array.from({ length: Math.floor(w / 18) }).map((_, i) => <rect key={i} x={x - w / 2 + 6 + i * 18} y={y - 4} width={4} height={16} fill={color} />)}
  </g>
);

export const Motosierra: React.FC<{ f?: number; on?: boolean }> = ({ f = 0, on }) => (
  <g transform={`translate(0,-30) rotate(${on ? Math.sin(f) * 2 : 0})`}>
    <rect x={-30} y={-26} width={70} height={46} rx={10} fill="#e07a1a" /><rect x={-40} y={-34} width={30} height={12} rx={5} fill="#2a2228" />
    <rect x={38} y={-12} width={150} height={20} rx={10} fill="#b8bcc4" /><rect x={38} y={-12} width={150} height={20} rx={10} fill="none" stroke="#2a2228" strokeWidth={4} strokeDasharray={on ? `6 4` : "6 0"} strokeDashoffset={on ? -f * 4 : 0} />
  </g>
);

export const Tablas: React.FC = () => (
  <g transform="translate(-40,-40) rotate(-14)">
    {[0, 1, 2].map((i) => <rect key={i} x={-90} y={-30 + i * 22} width={220} height={18} rx={3} fill={["#a8875a", "#8f7048", "#b89a6a"][i]} />)}
  </g>
);

export const Linterna: React.FC<{ largo?: number }> = ({ largo = 520 }) => (
  <g>
    <path d={`M0,-120 L${largo},-220 L${largo},-20 Z`} fill="#fff6c8" opacity={0.28} />
    <rect x={-30} y={-132} width={36} height={22} rx={6} fill="#2a2a32" />
  </g>
);

export const Libro: React.FC = () => (<g transform="translate(-10,-40)"><rect x={-34} y={-24} width={68} height={46} rx={3} fill="#3a5a8a" /><rect x={-2} y={-24} width={4} height={46} fill="#f2ece0" /><rect x={-30} y={-20} width={26} height={38} fill="#f8f2e2" /><rect x={4} y={-20} width={26} height={38} fill="#f8f2e2" /></g>);

export const BolsaDormir: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = "#2f5a8a" }) => (
  <g><path d={`M${x - 120},${y} Q${x - 140},${y - 120} ${x - 60},${y - 170} L${x + 70},${y - 170} Q${x + 140},${y - 120} ${x + 120},${y} Z`} fill={color} /><path d={`M${x - 100},${y - 60} H${x + 100}`} stroke="#00000033" strokeWidth={6} /></g>
);

// el escáner de mano de los cazadores (pantalla completa, x,y centro)
export const Escaner: React.FC<{ f: number; x?: number; y?: number; s?: number; freq?: number; voz?: number }> = ({ f, x = 960, y = 560, s = 1, freq = 162.4, voz = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-40} y={-470} width={30} height={200} rx={12} fill="#1c1a20" />
    <rect x={-170} y={-300} width={340} height={620} rx={46} fill="#2a2a30" />
    <rect x={-150} y={-280} width={300} height={580} rx={36} fill="#34343c" />
    <rect x={-120} y={-240} width={240} height={150} rx={12} fill="#9fc28a" />
    <text x={0} y={-170} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={54} fill="#1d2a18">{freq.toFixed(3)}</text>
    <path d={Array.from({ length: 40 }).map((_, i) => `${i ? "L" : "M"}${-110 + i * 5.6},${-125 + (voz > 0 ? Math.sin(i * 0.9 + f * 0.8) * 18 * voz * Math.abs(Math.sin(f / 7 + i / 5)) : (Math.sin(i * 7.1 + f * 3.3) * Math.cos(i * 1.3 + f)) * 9)}`).join(" ")} stroke="#1d2a18" strokeWidth={3} fill="none" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-110 + (i % 3) * 80} y={-60 + Math.floor(i / 3) * 70} width={60} height={50} rx={10} fill="#4a4a54" />)}
    {Array.from({ length: 6 }).map((_, i) => <rect key={`r${i}`} x={-90} y={230 + i * 10} width={180} height={4} rx={2} fill="#1c1a20" />)}
    <circle cx={110} cy={-270} r={10} fill={voz > 0 ? "#5aff7a" : Math.floor(f / 12) % 2 ? "#ff5a3a" : "#5a2a22"} />
  </g>
);

// reloj radiocontrolado (pantalla, x,y centro): fecha que el reloj "escucha"
export const RelojRadio: React.FC<{ x?: number; y?: number; s?: number; fecha?: string; hora?: string; f: number }> = ({ x = 960, y = 540, s = 1, fecha = "DEC 25", hora = "11:42", f }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-170} width={520} height={340} rx={30} fill="#e8e4dc" /><rect x={-230} y={-140} width={460} height={280} rx={16} fill="#1c2420" />
    <text x={0} y={-30} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={120} fill="#bfe8c8">{hora}</text>
    <text x={0} y={90} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={74} fill={AMBAR}>{fecha}</text>
    {[0, 1, 2].map((k) => <path key={k} d={`M${170 + k * 14},${-110 - k * 10} q${16 + k * 8},${14 + k * 8} 0,${30 + k * 16}`} stroke="#bfe8c8" strokeWidth={5} fill="none" opacity={0.3 + 0.7 * (Math.floor(f / 8) % 3 >= k ? 1 : 0)} />)}
  </g>
);

// la torre WWVB (Fort Collins) emitiendo para nadie
export const TorreWWVB: React.FC<{ f: number; x?: number; piso?: number }> = ({ f, x = 960, piso = 900 }) => (
  <g>
    <rect x={-200} y={piso} width={2400} height={300} fill="#c9b994" />
    {[-300, 0, 300].map((d) => <g key={d}><path d={`M${x + d - 16},${piso} L${x + d},${piso - 560} L${x + d + 16},${piso} Z`} fill="#3a3440" />{[1, 2, 3, 4].map((k) => <path key={k} d={`M${x + d - 16 + k * 3},${piso - k * 120} L${x + d + 16 - k * 3},${piso - k * 120 - 60}`} stroke="#3a3440" strokeWidth={4} />)}<circle cx={x + d} cy={piso - 566} r={8} fill="#ff4a3a" opacity={Math.floor(f / 15 + d) % 2 ? 1 : 0.25} /></g>)}
    <path d={`M${x - 300},${piso - 520} H${x + 300}`} stroke="#3a3440" strokeWidth={3} />
    {[0, 1, 2, 3].map((k) => { const r = ((f * 3 + k * 70) % 280) + 40; return <circle key={k} cx={x} cy={piso - 560} r={r} fill="none" stroke={AMBAR} strokeWidth={6} opacity={Math.max(0, 1 - r / 320)} />; })}
    <rect x={x + 380} y={piso - 140} width={240} height={140} fill="#6a6a72" /><rect x={x + 420} y={piso - 100} width={50} height={40} fill={AMBAR} opacity={0.7} />
  </g>
);

// la casa en corte: sólo un cuarto queda caliente
export const CasaCorte: React.FC<{ f: number; frio: number }> = ({ f, frio }) => {
  const cuartos = [[600, 330, 340, 230, 0], [960, 330, 360, 230, 0], [600, 580, 340, 250, 0], [960, 580, 360, 250, 1]];
  return (
    <g>
      <path d="M560,330 L1140,110 L1340,330 Z" fill="#3a2a2e" />
      <rect x={560} y={330} width={780} height={500} fill="#8a3a2e" />
      {cuartos.map(([x, y, w, h, cal], i) => {
        const c = cal ? "#ff9a4a" : `rgb(${Math.round(interpolate(frio, [0, 1], [230, 120]))},${Math.round(interpolate(frio, [0, 1], [180, 180]))},${Math.round(interpolate(frio, [0, 1], [140, 240]))})`;
        return <g key={i}><rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill={c} opacity={0.9} />{!cal && frio > 0.5 && <text x={x + w / 2} y={y + h / 2 + 18} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={44} fill="#ffffff" opacity={(frio - 0.5) * 2}>❄</text>}</g>;
      })}
      <Halo x={1140} y={720} r={260} color="#ff9a4a" fuerza={0.5 + 0.1 * Math.sin(f / 4)} />
      <rect x={1080} y={720} width={90} height={90} rx={8} fill="#26222a" /><rect x={1095} y={740} width={60} height={45} rx={6} fill="#ff8a3a" />
      <rect x={1140} y={330} width={20} height={390} fill="#1c1a20" />
    </g>
  );
};

// una cuerda de leña: 4 × 4 × 8 pies, con medidas
export const Cuerda: React.FC<{ x: number; piso: number; prog: number; esc?: number }> = ({ x, piso, prog, esc = 1 }) => {
  const W = 8 * 90 * esc, H = 4 * 90 * esc;
  const filas = Math.round(8 * prog);
  return (
    <g>
      {Array.from({ length: filas }).map((_, r) => Array.from({ length: 16 }).map((__, c) => <g key={`${r}${c}`}><circle cx={x + 22 * esc + c * 45 * esc} cy={piso - 22 * esc - r * 45 * esc} r={21 * esc} fill={(r + c) % 3 ? "#8a5a3a" : "#7a4a2e"} /><circle cx={x + 22 * esc + c * 45 * esc} cy={piso - 22 * esc - r * 45 * esc} r={10 * esc} fill="#c89a6a" /></g>))}
      <g opacity={interpolate(prog, [0.8, 1], [0, 1], cl)} fontFamily={F_MONO} fontWeight={800} fontSize={44} fill={AMBAR}>
        <path d={`M${x},${piso + 40} H${x + W}`} stroke={AMBAR} strokeWidth={5} /><text x={x + W / 2} y={piso + 96} textAnchor="middle">8 FT</text>
        <path d={`M${x - 40},${piso} V${piso - H}`} stroke={AMBAR} strokeWidth={5} /><text x={x - 60} y={piso - H / 2} textAnchor="end">4 FT</text>
        <text x={x + W + 30} y={piso - H - 20}>4 FT DEEP</text>
      </g>
    </g>
  );
};

// el diente con absceso (pantalla completa)
export const Diente: React.FC<{ f: number; inf: number }> = ({ f, inf }) => (
  <g transform="translate(960,560)">
    <rect x={-700} y={60} width={1400} height={400} fill="#c86a7a" />
    <path d="M-170,-260 Q-200,-60 -150,60 Q-130,240 -90,320 Q-60,340 -50,250 Q-30,120 0,110 Q30,120 50,250 Q60,340 90,320 Q130,240 150,60 Q200,-60 170,-260 Q0,-330 -170,-260 Z" fill="#f6f0e2" stroke="#d8ccb4" strokeWidth={8} />
    <circle cx={70} cy={330} r={40 + 60 * inf + 6 * Math.sin(f / 4) * inf} fill="#e8b23a" opacity={inf} />
    <circle cx={70} cy={330} r={(40 + 60 * inf) * 1.6} fill="#e2483a" opacity={0.35 * inf} />
  </g>
);

// cabeza de perfil con el camino de la infección: mandíbula → cuello → sangre
export const CabezaInf: React.FC<{ prog: number[] }> = ({ prog }) => (
  <g transform="translate(760,560)">
    <path d="M-220,-300 Q-60,-420 140,-320 Q260,-240 250,-80 Q290,-40 270,0 Q300,40 250,80 Q240,170 140,190 L120,420 L-160,420 L-140,140 Q-280,40 -220,-300 Z" fill="#d9cbb8" stroke="#2a2228" strokeWidth={8} />
    <circle cx={120} cy={-130} r={22} fill="#2a2228" />
    {[[150, 120, 160, 120], [150, 120, 40, 300], [40, 300, -40, 470]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={a + (c - a) * prog[i]} y2={b + (d - b) * prog[i]} stroke="#e2483a" strokeWidth={18} strokeLinecap="round" />)}
    <circle cx={150} cy={120} r={26} fill="#e8b23a" />
  </g>
);

// la estación antártica en la noche polar
export const Antartida: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#14203a" />
    {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={(i * 337) % 1920} cy={(i * 191) % 520} r={i % 5 ? 1.6 : 2.6} fill="#ffffff" opacity={0.4 + 0.4 * Math.sin(f / 20 + i)} />)}
    <path d={`M0,300 Q480,${200 + 30 * Math.sin(f / 30)} 960,280 T1920,240`} stroke="#5affb0" strokeWidth={60} fill="none" opacity={0.18} />
    <path d="M0,760 Q600,700 1100,740 T1920,720 V1080 H0 Z" fill="#dfe8f4" />
    {[[640, 560, 380, 160], [1060, 600, 260, 120]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} rx={10} fill={i ? "#3a6a9a" : "#c0352c"} />{[0, 1, 2].map((k) => <rect key={k} x={x + 30 + k * (w / 3)} y={y + 40} width={40} height={30} fill={AMBAR} opacity={0.85} />)}{[0, 1, 2, 3].map((k) => <rect key={`p${k}`} x={x + 10 + k * (w / 3.4)} y={y + h} width={14} height={70} fill="#2a2a32" />)}</g>)}
    <rect x={1400} y={420} width={8} height={300} fill="#2a2a32" /><path d={`M1408,430 h70 v40 h-70 Z`} fill="#c0352c" transform={`skewY(${Math.sin(f / 6) * 4})`} />
  </g>
);

// el termómetro de la ventana (pantalla completa)
export const Termometro: React.FC<{ temp: number; x?: number; y?: number }> = ({ temp, x = 960, y = 540 }) => {
  const h = interpolate(temp, [-40, 40], [40, 520], cl);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-90} y={-330} width={180} height={660} rx={40} fill="#e8e4dc" />
      <rect x={-18} y={-290} width={36} height={540} rx={18} fill="#ffffff" stroke="#bdb6a8" strokeWidth={4} />
      <rect x={-12} y={250 - h} width={24} height={h} rx={12} fill={ROJO_CENSO} />
      <circle cx={0} cy={262} r={44} fill={ROJO_CENSO} />
      {[-40, -20, 0, 20, 40].map((t) => { const yy = 250 - interpolate(t, [-40, 40], [40, 520]); return <g key={t}><rect x={22} y={yy - 2} width={28} height={4} fill="#3a3440" /><text x={56} y={yy + 10} fontFamily={F_MONO} fontWeight={800} fontSize={26} fill="#3a3440">{t}</text></g>; })}
    </g>
  );
};

// el frasco de antibióticos
export const Frasco: React.FC<{ x?: number; y?: number }> = ({ x = 700, y = 560 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-120} y={-260} width={240} height={60} rx={12} fill="#f2ece0" />
    <rect x={-140} y={-200} width={280} height={420} rx={30} fill="#e0882a" opacity={0.92} />
    <rect x={-120} y={-120} width={240} height={200} rx={8} fill="#f8f2e2" />
    <text x={0} y={-60} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={30} fill="#2a2228">ANTIBIOTIC</text>
    <text x={0} y={-15} textAnchor="middle" fontFamily={F_MONO} fontWeight={700} fontSize={22} fill="#5a5258">TAKE 3x DAILY</text>
    <rect x={-100} y={20} width={200} height={6} fill="#c8c0b0" /><rect x={-100} y={40} width={150} height={6} fill="#c8c0b0" />
  </g>
);

// pinzas de extracción
export const Pinzas: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`translate(0,-40) scale(${s}) rotate(-30)`}>
    <path d="M0,0 Q-10,-60 -30,-120 L-18,-124 Q4,-64 10,0 Z" fill="#c8ccd4" /><path d="M10,0 Q24,-60 46,-120 L34,-124 Q14,-64 0,0 Z" fill="#aeb2ba" />
    <path d="M-4,0 Q-10,30 -6,50 L10,50 Q14,30 14,0 Z" fill="#c8ccd4" />
  </g>
);

// cartas en la mesa (x,y centro)
export const Cartas: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${x - 120 + i * 60},${y - Math.max(0, 20 - Math.abs(f / 3 - i * 4))}) rotate(${-10 + i * 5})`}><rect x={-30} y={-44} width={60} height={88} rx={6} fill="#fbf8f1" stroke="#c8c0b0" strokeWidth={2} /><text x={0} y={10} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill={i % 2 ? "#c0352c" : "#1c1a20"}>{["A", "7", "K", "3", "Q"][i]}</text></g>)}
  </g>
);

// un pino (verde o con nieve)
export const Pino: React.FC<{ x: number; piso: number; h?: number; color?: string; nieve?: number }> = ({ x, piso, h = 420, color = "#2f6a44", nieve = 0 }) => (
  <g>
    <rect x={x - 12} y={piso - 60} width={24} height={60} fill="#5a3a24" />
    {[0, 1, 2].map((k) => <path key={k} d={`M${x - (h * 0.38 - k * 30)},${piso - 50 - k * h * 0.26} L${x},${piso - h * 0.48 - k * h * 0.26} L${x + (h * 0.38 - k * 30)},${piso - 50 - k * h * 0.26} Z`} fill={color} />)}
    {nieve > 0 && [0, 1, 2].map((k) => <path key={`n${k}`} d={`M${x - 30},${piso - h * 0.4 - k * h * 0.26} L${x},${piso - h * 0.48 - k * h * 0.26} L${x + 30},${piso - h * 0.4 - k * h * 0.26} Z`} fill="#f2f6fc" opacity={nieve} />)}
  </g>
);
