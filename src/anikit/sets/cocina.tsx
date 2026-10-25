// SET 2 · COCINA AL ATARDECER (IFShift «100x»): ventanal al mar con sol bajo y haces, estantes con ~40 frascos,
// heladera, cocina con olla humeante, mesa con dos sillas en el centro, lámpara colgante y reloj.
// Piso: COCINA_PISO. x útil: -500 … 3000. Puntos: ventana 1150, mesa 1150, heladera 300, cocina 2150, estantes 2300.
import React from "react";
import { random } from "remotion";
import { Charco, Haces, Halo, LamparaColgante, Polvo } from "../luz";
import { Planta, SetProps, acl, osc } from "./comun";

export const COCINA_PISO = 900;
export const COCINA_PUNTOS = { heladera: 300, mesa: 1150, ventana: 1150, cocina: 2150, estantes: 2350, sillaI: 960, sillaD: 1340 };

export const Silla: React.FC<{ x: number; piso: number; dir?: 1 | -1; color?: string }> = ({ x, piso, dir = 1, color = "#c9935a" }) => (
  <g transform={`translate(${x},${piso}) scale(${dir},1)`}>
    <rect x={-34} y={-66} width={72} height={10} rx={3} fill={color} />
    <rect x={-32} y={-60} width={7} height={60} fill={osc(color, 0.7)} />
    <rect x={27} y={-60} width={7} height={60} fill={osc(color, 0.7)} />
    <rect x={-38} y={-190} width={9} height={130} rx={3} fill={color} />
    {[0, 1, 2].map((k) => <rect key={k} x={-38} y={-178 + k * 36} width={30} height={7} rx={2} fill={osc(color, 0.85)} />)}
  </g>
);

const Frasco: React.FC<{ x: number; y: number; t: number; seed: number }> = ({ x, y, t, seed }) => {
  const cols = ["#e8603a", "#f2c14a", "#7cc46a", "#5aa7d8", "#e9e4d8", "#c9463a", "#8f6bd1"];
  const c = cols[Math.floor(random(`fr${seed}`) * cols.length)];
  if (t === 0) return <g><rect x={x - 14} y={y - 44} width={28} height={44} rx={5} fill={acl(c, 0.35)} opacity={0.9} /><rect x={x - 14} y={y - 28} width={28} height={28} rx={4} fill={c} /><rect x={x - 15} y={y - 52} width={30} height={9} rx={2} fill="#a7692f" /></g>;
  if (t === 1) return <g><rect x={x - 10} y={y - 58} width={20} height={58} rx={6} fill={c} /><rect x={x - 5} y={y - 72} width={10} height={16} fill={osc(c, 0.7)} /></g>;
  if (t === 2) return <circle cx={x} cy={y - 18} r={18} fill={c} />;
  return <g><rect x={x - 16} y={y - 34} width={32} height={34} rx={3} fill={c} /><rect x={x - 16} y={y - 22} width={32} height={8} fill="#f4efe4" /></g>;
};

export const Cocina: React.FC<SetProps> = ({ capa, f, pal }) => {
  const P = COCINA_PISO;
  if (capa === "lejos") {
    // lo que se ve por el ventanal: cielo de atardecer, sol, mar con reflejos, barquitos y faro
    return (
      <g>
        <defs>
          <linearGradient id="ckcielo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f6a23e" /><stop offset="0.6" stopColor="#ffd77a" /><stop offset="1" stopColor="#fff3c8" /></linearGradient>
        </defs>
        <rect x={300} y={-100} width={1700} height={900} fill="url(#ckcielo)" />
        <Halo x={1420} y={420} r={420} color="#fff6c8" fuerza={0.95} />
        <circle cx={1420} cy={420} r={70} fill="#fffbe6" />
        <path d="M1250,500 Q1480,420 1760,470 L1760,520 L1250,520 Z" fill="#6b4d4a" />
        <rect x={1640} y={360} width={18} height={110} fill="#f4efe6" /><rect x={1640} y={380} width={18} height={14} fill="#e2483a" /><rect x={1640} y={415} width={18} height={14} fill="#e2483a" />
        <rect x={300} y={505} width={1700} height={400} fill="#f0b04e" />
        {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={1250 + random(`rf${i}`) * 300 + Math.sin(f / 20 + i) * 8} y={520 + i * 9} width={60 + random(`rw${i}`) * 80} height={4} rx={2} fill="#fff6d0" opacity={0.7} />)}
        {[760, 980].map((x, i) => (
          <g key={i} transform={`translate(${x + Math.sin(f / 70 + i) * 10},${505 + Math.sin(f / 25 + i) * 2})`}>
            <path d="M-36,0 L36,0 L26,12 L-26,12 Z" fill="#5a3a30" /><path d="M2,-4 L2,-76 L38,-4 Z" fill="#fbf2dc" />
          </g>
        ))}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <Haces x={1180} y={140} ang={32} largo={1200} n={6} ancho={60} color="#fff1c0" fuerza={0.16} f={f} />
        <Polvo x={700} y={150} w={1300} h={750} n={46} f={f} seed={2} />
      </g>
    );
  }
  // ---- capa media ----
  return (
    <g>
      {/* pared con revestimiento de listones verdes + guarda */}
      <defs><clipPath id="ckpared"><path clipRule="evenodd" d={`M-600,-400 H3600 V${P} H-600 Z M555,115 V725 H1745 V115 Z`} /></clipPath></defs>
      <g clipPath="url(#ckpared)">
        <rect x={-600} y={-400} width={4200} height={P + 400} fill={pal.fachada[0]} />
        {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={-600 + i * 90} y={-400} width={4} height={P + 400} fill={osc(pal.fachada[0], 0.85)} />)}
        <Halo x={1150} y={420} r={900} color="#ffcf7a" fuerza={0.35} />
      </g>
      {/* ventanal (el hueco deja ver la capa lejos) */}
      <rect x={540} y={100} width={1220} height={640} fill="none" stroke={acl(pal.fachada[1], 0.3)} strokeWidth={30} />
      <rect x={1140} y={100} width={22} height={640} fill={acl(pal.fachada[1], 0.3)} />
      {/* cortina corta de café y baranda */}
      <path d={`M545,560 Q600,585 655,560 Q710,585 765,560 Q820,585 875,560 Q930,585 985,560 Q1040,585 1095,560 Q1150,585 1205,560 Q1260,585 1315,560 Q1370,585 1425,560 Q1480,585 1535,560 Q1590,585 1645,560 Q1700,585 1755,560 L1755,555 L545,555 Z`} fill="#f4ecd8" />
      {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={580 + i * 90} y={590} width={20} height={150} rx={4} fill="#eae2d0" opacity={0.85} />)}
      <rect x={500} y={740} width={1300} height={26} rx={6} fill={acl(pal.fachada[1], 0.4)} />
      <Planta x={640} y={740} s={0.7} hoja="#e2a35a" maceta="#d2662f" f={f} seed={4} />
      {/* reloj de pared */}
      <g transform="translate(300,180)">
        <circle r={58} fill="#e9dfc8" stroke="#9a6a38" strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-2} y={-50} width={4} height={10} fill="#5a4030" transform={`rotate(${i * 30})`} />)}
        <rect x={-3} y={-36} width={6} height={38} rx={3} fill="#3a2a20" transform={`rotate(${f * 0.05})`} />
        <rect x={-2} y={-46} width={4} height={48} rx={2} fill="#c9463a" transform={`rotate(${f * 6})`} />
      </g>
      {/* cuadro del pez */}
      <rect x={1880} y={-20} width={170} height={110} rx={6} fill="#f4efe4" stroke="#c99b5a" strokeWidth={6} />
      <path d="M1920,35 Q1960,2 2000,35 Q1960,68 1920,35 Z M2000,35 L2025,15 L2025,55 Z" fill="#4d8fd0" />
      {/* estantes con frascos (≈40 objetos) */}
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x={1880} y={180 + r * 110} width={900} height={14} rx={3} fill="#9a6a38" />
          {Array.from({ length: 14 }).map((_, k) => <Frasco key={k} x={1910 + k * 62} y={180 + r * 110} t={(k * 3 + r) % 4} seed={r * 20 + k} />)}
        </g>
      ))}
      {/* azulejos detrás de la mesada */}
      {Array.from({ length: 2 }).map((_, r) => Array.from({ length: 13 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={1862 + c * 74} y={P - 400 + r * 42} width={70} height={38} rx={3} fill={(r + c) % 2 ? "#e8dcc0" : "#5b9a8b"} opacity={0.9} />
      )))}
      {/* heladera */}
      <g>
        <rect x={160} y={P - 600} width={280} height={600} rx={26} fill="#e6e2d6" />
        <rect x={160} y={P - 600} width={280} height={200} rx={26} fill="#efebe1" />
        <rect x={160} y={P - 404} width={280} height={8} fill="#cfcabc" />
        <rect x={400} y={P - 560} width={12} height={120} rx={6} fill="#b9b3a3" /><rect x={400} y={P - 370} width={12} height={160} rx={6} fill="#b9b3a3" />
        {[["#e2483a", 220, P - 330], ["#f2c14a", 270, P - 300], ["#4d8fd0", 330, P - 340], ["#7cc46a", 240, P - 250]].map(([c, x, y], i) => <rect key={i} x={x as number} y={y as number} width={34} height={26} rx={4} fill={c as string} transform={`rotate(${i * 7 - 10} ${x} ${y})`} />)}
        <rect x={250} y={P - 230} width={90} height={110} fill="#f8f5ee" transform={`rotate(4 290 ${P - 180})`} />
      </g>
      {/* mesada + cocina con olla */}
      <g>
        <rect x={1860} y={P - 300} width={960} height={300} fill="#5a3f30" />
        <rect x={1850} y={P - 316} width={980} height={24} rx={4} fill="#e9dcc4" />
        {[0, 1, 2, 3].map((k) => <g key={k}><rect x={1880 + k * 235} y={P - 270} width={215} height={250} rx={8} fill="#6a4b3a" /><rect x={1975 + k * 235} y={P - 160} width={26} height={8} rx={4} fill="#d9b37a" /></g>)}
        <rect x={2060} y={P - 330} width={240} height={14} rx={4} fill="#2b2b2b" />
        <rect x={2100} y={P - 430} width={160} height={100} rx={18} fill="#c9463a" />
        <rect x={2090} y={P - 440} width={180} height={16} rx={6} fill="#a8382e" />
        <rect x={2160} y={P - 458} width={40} height={18} rx={6} fill="#a8382e" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${2140 + k * 40},${P - 470} q14,-30 0,-60 q-14,-30 4,-60`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.25 + 0.15 * Math.sin(f / 9 + k)} transform={`translate(${Math.sin(f / 14 + k) * 6},${-((f * 1.5 + k * 40) % 40)})`} />)}
        <rect x={2560} y={P - 360} width={200} height={50} rx={4} fill="#b9c4c8" />
        <path d={`M2650,${P - 360} L2650,${P - 430} Q2650,${P - 460} 2690,${P - 460} L2700,${P - 460}`} stroke="#9aa5aa" strokeWidth={10} fill="none" />
      </g>
      {/* piso de madera y alfombra a rayas */}
      <rect x={-600} y={P} width={4200} height={900} fill={pal.piso} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-600} y={P + 12 + i * 22} width={4200} height={2} fill={osc(pal.piso, 0.8)} />)}
      <g>
        <path d={`M760,${P + 22} L1560,${P + 22} L1640,${P + 120} L680,${P + 120} Z`} fill="#c9b9a0" opacity={0.8} />
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${740 - i * 15},${P + 40 + i * 18} L${1580 + i * 15},${P + 40 + i * 18}`} stroke="#e8dcc6" strokeWidth={5} />)}
      </g>
      <Charco x={1160} y={P + 60} rx={700} color="#ffd88a" fuerza={0.45} />
      {/* mesa (el centro del set) */}
      <g>
        <rect x={930} y={P - 210} width={450} height={20} rx={5} fill="#d9a66a" />
        <rect x={940} y={P - 192} width={430} height={10} fill={osc("#d9a66a", 0.75)} />
        <rect x={970} y={P - 182} width={14} height={182} fill={osc("#d9a66a", 0.7)} />
        <rect x={1326} y={P - 182} width={14} height={182} fill={osc("#d9a66a", 0.7)} />
        <rect x={1000} y={P - 216} width={330} height={8} rx={3} fill="#4d8fd0" opacity={0.8} />
      </g>
      <LamparaColgante x={1155} y={-10} piso={P - 210} color="#ffd88a" pantalla="#e7b240" techo={-500} f={f} fuerza={0.6} />
    </g>
  );
};
