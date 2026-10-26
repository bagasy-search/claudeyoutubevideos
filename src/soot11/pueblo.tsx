import React from "react";
import { rnd, clamp } from "../soot/lib";
import { C, fontFamily } from "./kit";
import { Persona, CIVIL } from "./persona";
import {
  SUELO, useMundo, Vis, Calle, Fachwerk, G, Taburete, Jarra, Hogaza, Saco, Horca, Diario, Farol, Rio, Puente, Muralla, Banco, Vitral, Espada,
} from "./mundo";

// El pueblo de soot11 (Núremberg, c. 1580) — todo en coordenadas de mundo, de izquierda a derecha:
//   iglesia 200-1700 · panadería 1900-2600 · taberna 2800-3900 · mercado 4100-5500 · río 5600-7600 con la
//   CASA DEL VERDUGO sobre el puente (6250-7000) · calle 7700-8400 · carpinteros 8500-9300 · muralla 9500-10300 ·
//   afuera: desolladero 10600-11300 y la colina de la horca 11600-12500.
// Lejos del pueblo: París (30000-33000) y la página del diario con Hof 1553 (-20000).
export const X = {
  iglesia: [200, 1700], panaderia: [1900, 2600], taberna: [2800, 3900], mercado: [4100, 5500], rio: [5600, 7600], casa: [6250, 7000],
  calle: [7700, 8400], carpinteros: [8500, 9300], muralla: [9500, 10300], desolladero: [10600, 11300], horca: [11600, 12500],
  paris: [30000, 33000], hof: [-21500, -18500],
} as const;
// puntos útiles (x, y del piso donde se paran los personajes)
export const PT = {
  bancoVerdugo: 1560, puertaIglesia: 1660, altar: 420, mostrador: 2330, taburete: 3800, mesaTaberna: 3200,
  escritorio: 6440, espadaPared: 6800, puertaAtras: 7056, frenteCasa: 6620, plaza: 4800,
};

const Pasto: React.FC<{ x0: number; x1: number }> = ({ x0, x1 }) => {
  const { hora } = useMundo();
  const k = clamp(hora / 2, 0, 1);
  const c = k > 0.5 ? "#2a3a4a" : "#6fae4a", c2 = k > 0.5 ? "#1f2c3a" : "#5a9a3a";
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <rect x={x0} y={SUELO} width={x1 - x0} height={900} fill={c} />
      {Array.from({ length: Math.floor((x1 - x0) / 60) }, (_, i) => <path key={i} d={`M ${x0 + i * 60} ${SUELO + 4} l 10 -26 l 10 26`} fill={c2} />)}
    </svg>
  );
};

// ── iglesia por DENTRO (corte de la nave): muro de piedra, columnas con arcos, vitrales altos con haces de luz
// de color, arañas de velas, altar con escalones y cirios; piso de baldosas; banco solo junto a la puerta
const Iglesia: React.FC = () => {
  const { t } = useMundo();
  const X0 = 200, X1 = 1700, TOP = SUELO - 700;
  const cols = [380, 760, 1140, 1520];
  const vits = [570, 950, 1330];
  const llama = (k: number) => 1 + Math.sin(t * 11 + k * 1.7) * 0.12 + Math.sin(t * 6.3 + k) * 0.08;
  return (
    <Vis x0={0} x1={1750}>
      <Fachwerk x={20} w={180} h={760} muro="#d9c9ae" viga="#8a7660" techo="#5a6a8a" pisos={4} puerta={false} />
      <G x={110} y={SUELO - 640}><path d="M -34 0 Q -40 -60 0 -64 Q 40 -60 34 0 Z" fill="#c98f2a" /><circle cx={0} cy={6} r={10} fill="#8a5414" /></G>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <defs>
          <linearGradient id="igMuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f8170" /><stop offset="0.55" stopColor="#c2b39a" /><stop offset="1" stopColor="#d8c9ad" /></linearGradient>
          <linearGradient id="igHaz" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity={0.55} /><stop offset="1" stopColor="#ffd98a" stopOpacity={0} /></linearGradient>
          <radialGradient id="igVela"><stop offset="0" stopColor="#ffe6a0" stopOpacity={0.7} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
        </defs>
        {/* techo a dos aguas y muro del fondo */}
        <path d={`M ${X0 - 30} ${TOP + 10} L ${(X0 + X1) / 2} ${TOP - 190} L ${X1 + 30} ${TOP + 10} Z`} fill="#4a5878" stroke="#2b3550" strokeWidth={10} />
        <rect x={X0} y={TOP} width={X1 - X0} height={SUELO - TOP} fill="url(#igMuro)" />
        {Array.from({ length: 12 }, (_, f) => Array.from({ length: 16 }, (_, c) => <rect key={`${f}-${c}`} x={X0 + c * 96 + (f % 2) * 48} y={TOP + f * 58} width={90} height={52} rx={6} fill="#6e624f" opacity={0.12} />))}
        {/* arcos entre columnas */}
        {cols.slice(0, -1).map((c, i) => <path key={i} d={`M ${c + 25} ${SUELO - 120} L ${c + 25} ${TOP + 230} Q ${(c + cols[i + 1]) / 2} ${TOP + 40} ${cols[i + 1] - 25} ${TOP + 230} L ${cols[i + 1] - 25} ${SUELO - 120}`} fill="none" stroke="#9a8a70" strokeWidth={16} />)}
        {/* vitrales altos + haz de luz que baja en diagonal hasta el piso */}
        {vits.map((v, i) => <path key={`h${i}`} d={`M ${v - 70} ${TOP + 340} L ${v + 70} ${TOP + 340} L ${v + 330} ${SUELO + 60} L ${v + 40} ${SUELO + 60} Z`} fill="url(#igHaz)" opacity={0.75 + Math.sin(t * 0.9 + i) * 0.15} />)}
        {/* columnas con capitel y base */}
        {cols.map((c) => <g key={c}><rect x={c - 26} y={TOP + 150} width={52} height={SUELO - TOP - 150} fill="#b9a988" stroke="#7d6e56" strokeWidth={5} /><rect x={c - 40} y={TOP + 136} width={80} height={24} rx={4} fill="#cfc0a2" stroke="#7d6e56" strokeWidth={5} /><rect x={c - 40} y={SUELO - 28} width={80} height={28} rx={4} fill="#cfc0a2" stroke="#7d6e56" strokeWidth={5} /></g>)}
        {/* piso de baldosas */}
        <rect x={X0} y={SUELO} width={X1 - X0} height={220} fill="#a8946f" />
        {Array.from({ length: 3 }, (_, f) => Array.from({ length: 16 }, (_, c) => (c + f) % 2 ? null : <rect key={`b${f}-${c}`} x={X0 + c * 94} y={SUELO + f * 60} width={94} height={60} fill="#c8b48c" />))}
        {/* alfombra roja al altar */}
        <rect x={X0} y={SUELO + 8} width={PT.altar + 160 - X0} height={30} fill="#9e2531" opacity={0.85} />
        {/* muros cortados (se lee como corte de la nave) */}
        <rect x={X0 - 10} y={TOP} width={34} height={SUELO - TOP + 220} fill="#7d6e56" />
        <rect x={X1 - 24} y={TOP} width={34} height={SUELO - TOP + 220} fill="#7d6e56" />
      </svg>
      {vits.map((v, i) => <Vitral key={v} x={v} y={TOP + 400} t={t + i} s={0.82} />)}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        {/* arañas de velas colgando */}
        {[760, 1140].map((x, k) => (
          <g key={x}>
            <line x1={x} y1={TOP - 40} x2={x} y2={TOP + 120} stroke="#3b2614" strokeWidth={5} />
            <path d={`M ${x - 110} ${TOP + 120} Q ${x} ${TOP + 170} ${x + 110} ${TOP + 120}`} fill="none" stroke="#c98f2a" strokeWidth={10} />
            {[-110, -55, 0, 55, 110].map((d, j) => <g key={j}><rect x={x + d - 7} y={TOP + 92 + Math.abs(d) * -0.1} width={14} height={30} fill="#f6efe0" /><circle cx={x + d} cy={TOP + 84} r={34 * llama(k * 5 + j)} fill="url(#igVela)" /><ellipse cx={x + d} cy={TOP + 80} rx={6} ry={12 * llama(k * 5 + j)} fill="#ffcf5a" /></g>)}
          </g>
        ))}
        {/* altar: escalones, mantel con borde dorado, cruz, cirios */}
        <g transform={`translate(${PT.altar} ${SUELO})`}>
          <rect x={-200} y={-40} width={400} height={40} fill="#cfc0a2" stroke="#7d6e56" strokeWidth={5} />
          <rect x={-160} y={-80} width={320} height={40} fill="#ddd0b4" stroke="#7d6e56" strokeWidth={5} />
          <rect x={-120} y={-210} width={240} height={130} fill="#b8a07a" />
          <rect x={-136} y={-226} width={272} height={70} fill="#f6efe0" /><rect x={-136} y={-166} width={272} height={10} fill={C.oro} />
          <rect x={-9} y={-420} width={18} height={190} fill="#c98f2a" stroke="#8a5414" strokeWidth={4} /><rect x={-60} y={-370} width={120} height={18} fill="#c98f2a" stroke="#8a5414" strokeWidth={4} />
          {[-100, 100].map((d, j) => <g key={d}><rect x={d - 9} y={-330} width={18} height={104} fill="#f6efe0" stroke="#c9bca4" strokeWidth={3} /><circle cx={d} cy={-346} r={44 * llama(20 + j)} fill="url(#igVela)" /><ellipse cx={d} cy={-344} rx={8} ry={16 * llama(20 + j)} fill="#ffcf5a" /></g>)}
        </g>
      </svg>
      {[620, 840, 1060, 1280].map((x) => <Banco key={x} x={x} y={SUELO} w={200} />)}
      <Banco x={PT.bancoVerdugo} y={SUELO} w={120} />
      {/* puerta lateral abierta (luz y corriente de aire que entra) */}
      <G x={PT.puertaIglesia + 20} y={SUELO}><path d="M -40 0 L -40 -280 Q 0 -320 40 -280 L 40 0 Z" fill="#fff3c4" opacity={0.85} /></G>
    </Vis>
  );
};
const Panaderia: React.FC = () => {
  const { t } = useMundo();
  return (
    <Vis x0={1880} x1={2650}>
      <Fachwerk x={1900} w={700} h={520} abierta fondo="#f2d3a0" muro="#f3dcb0" techo="#c2452e" pisos={1} cartel="BREAD" />
      {/* horno */}
      <G x={2060} y={SUELO}><path d="M -130 0 L -130 -170 Q 0 -300 130 -170 L 130 0 Z" fill="#b5694a" /><path d="M -60 -40 L -60 -110 Q 0 -160 60 -110 L 60 -40 Z" fill="#ff8a3d" opacity={0.75 + 0.2 * Math.sin(t * 9)} /></G>
      {/* estantes con hogazas */}
      {[0, 1].map((f) => <G key={f} x={2380} y={SUELO - 300 - f * 110}><rect x={-160} y={0} width={320} height={16} fill="#7d4a24" /></G>)}
      {[2270, 2380, 2490].map((x, i) => <Hogaza key={x} x={x} y={SUELO - 300} s={0.6} />)}
      {[2270, 2380, 2490].map((x, i) => <Hogaza key={x} x={x} y={SUELO - 410} s={0.6} />)}
      {/* mostrador */}
      <G x={PT.mostrador} y={SUELO}><rect x={-150} y={-150} width={300} height={150} fill="#a8622c" /><rect x={-165} y={-166} width={330} height={24} rx={8} fill="#c98a4a" /></G>
    </Vis>
  );
};
const Taberna: React.FC<{ vacioTaburete?: boolean }> = () => {
  const { t } = useMundo();
  return (
    <Vis x0={2780} x1={3950}>
      <Fachwerk x={2800} w={1100} h={560} abierta fondo="#c98f5a" muro="#f0c79a" techo="#8a2f2a" pisos={1} cartel="ALE" />
      {/* chimenea */}
      <G x={2990} y={SUELO}><rect x={-120} y={-260} width={240} height={260} fill="#8a6a5a" /><rect x={-80} y={-150} width={160} height={150} fill="#3b2614" />{[0, 1, 2].map((i) => <path key={i} d={`M ${-40 + i * 40} -10 Q ${-50 + i * 40 + Math.sin(t * 8 + i) * 8} -70 ${-30 + i * 40} -110 Q ${-10 + i * 40} -60 ${-20 + i * 40} -10 Z`} fill={i === 1 ? "#ffd27a" : "#ff7a3d"} />)}</G>
      {/* barriles */}
      {[[3420, 0], [3520, 0], [3470, -110]].map(([x, dy], i) => <G key={i} x={x} y={SUELO + dy}><ellipse cx={0} cy={-55} rx={50} ry={56} fill="#9a5a2a" /><rect x={-52} y={-80} width={104} height={10} fill="#4a2810" /><rect x={-52} y={-36} width={104} height={10} fill="#4a2810" /></G>)}
      {/* mesas */}
      {[3180, 3640].map((x) => <G key={x} x={x} y={SUELO}><rect x={-140} y={-150} width={280} height={26} rx={8} fill="#a8622c" /><rect x={-110} y={-130} width={20} height={130} fill="#6b3a1f" /><rect x={90} y={-130} width={20} height={130} fill="#6b3a1f" /></G>)}
      {/* gancho con la jarra encadenada del verdugo (pared del rincón) */}
      <Jarra x={PT.taburete} y={SUELO - 300} s={0.7} cadena espuma={false} color="#6a6a7a" />
    </Vis>
  );
};
const Puesto: React.FC<{ x: number; tela: string }> = ({ x, tela }) => (
  <G x={x} y={SUELO}>
    <rect x={-150} y={-260} width={12} height={260} fill="#6b3a1f" /><rect x={138} y={-260} width={12} height={260} fill="#6b3a1f" />
    <path d="M -180 -260 L 180 -260 L 160 -330 L -160 -330 Z" fill={tela} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${-180 + i * 60} -260 q 30 30 60 0`} fill={tela} />)}
    <rect x={-160} y={-120} width={320} height={120} fill="#a8622c" />
  </G>
);
const Mercado: React.FC = () => (
  <Vis x0={4050} x1={5550}>
    <Fachwerk x={4050} w={300} h={560} techo="#b5452c" muro="#f7e0b8" pisos={3} />
    <Puesto x={4520} tela={C.rojo} />
    <Puesto x={5120} tela={C.teal} />
    {[4440, 4560, 4680].map((x, i) => <Saco key={x} x={x} y={SUELO - 118} s={0.55} />)}
    {[5050, 5190].map((x) => <Saco key={x} x={x} y={SUELO - 118} s={0.55} color="#e8c890" />)}
    <Fachwerk x={5300} w={280} h={600} techo="#9a3a2a" muro="#efd2a8" pisos={3} />
  </Vis>
);
// casa del verdugo sobre el puente: `abre` 0 = fachada cerrada, 1 = corte (se ve el interior)
const CasaVerdugo: React.FC<{ abre: number; espada: boolean }> = ({ abre, espada }) => {
  const { t, hora } = useMundo();
  const x = X.casa[0], w = X.casa[1] - X.casa[0];
  return (
    <Vis x0={5500} x1={7700}>
      <Rio x0={X.rio[0]} x1={X.rio[1]} />
      <Puente x0={X.rio[0]} x1={X.rio[1]} />
      <Fachwerk x={x} w={w} h={600} abierta fondo="#e9c99a" muro="#f6dfb6" techo="#a8322a" pisos={1} />
      {/* interior: escritorio con el diario, estante de frascos (remedios), la espada en la pared, la puerta de atrás */}
      <G x={PT.escritorio} y={SUELO - 10}><rect x={-170} y={-170} width={340} height={26} rx={8} fill="#8a5a2a" /><rect x={-150} y={-150} width={20} height={150} fill="#5a3418" /><rect x={130} y={-150} width={20} height={150} fill="#5a3418" /></G>
      <Diario x={PT.escritorio} y={SUELO - 250} s={0.36} escribe={1} />
      <G x={PT.escritorio + 30} y={SUELO - 196}><rect x={-10} y={-60} width={20} height={60} fill="#fff6e0" /><path d={`M 0 -60 Q ${8 + Math.sin(t * 9) * 3} -84 0 -100 Q -8 -84 0 -60 Z`} fill="#ffb020" /></G>
      {[0, 1].map((f) => <G key={f} x={6290 + 90} y={SUELO - 330 - f * 120}><rect x={-110} y={0} width={220} height={14} fill="#7d4a24" />{[-80, -30, 20, 70].map((dx, i) => <g key={i}><rect x={dx - 14} y={-50} width={28} height={50} rx={8} fill={[C.teal, C.lima, C.ambar, C.rosa][(i + f) % 4]} opacity={0.85} /><rect x={dx - 8} y={-62} width={16} height={14} fill="#8a5a2a" /></g>)}</G>)}
      <G x={PT.espadaPared} y={SUELO - 520}><rect x={-80} y={-20} width={160} height={20} fill="#5a3418" /><rect x={-80} y={380} width={160} height={20} fill="#5a3418" /></G>
      {espada && <Espada x={PT.espadaPared} y={SUELO - 150} s={0.42} />}
      <G x={PT.puertaAtras} y={SUELO - 10}><rect x={-56} y={-330} width={120} height={330} fill="#d9b88a" /><path d="M -70 -330 L 4 -390 L 78 -330 Z" fill="#8a2a24" /><rect x={-30} y={-250} width={66} height={250} rx={6} fill="#5a3418" /><circle cx={24} cy={-125} r={7} fill={C.oro} /></G>
      <Farol x={PT.puertaAtras + 100} y={SUELO - 300} on={clamp((hora - 1.1) * 2, 0, 1)} />
      {/* fachada que se abre como casa de muñecas */}
      {abre < 1 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - abre, transformOrigin: `${x}px ${SUELO}px`, transform: `perspective(2000px) rotateY(${-abre * 70}deg)` }}>
          <Fachwerk x={x} w={w} h={600} muro="#f6dfb6" techo="#a8322a" pisos={2} luz={0.2} />
        </div>
      )}
    </Vis>
  );
};
const Carpinteros: React.FC = () => (
  <Vis x0={8450} x1={9350}>
    <Fachwerk x={8500} w={800} h={540} abierta fondo="#e2c08a" muro="#f3dcb0" techo="#b5452c" pisos={1} cartel="WOOD" />
    {[0, 1, 2, 3].map((i) => <G key={i} x={8650 + i * 30} y={SUELO - 20 - i * 26}><rect x={-120} y={-24} width={360} height={24} rx={6} fill={i % 2 ? "#c98a4a" : "#b5763a"} /></G>)}
    <G x={9150} y={SUELO}><rect x={-100} y={-110} width={200} height={20} fill="#8a5a2a" /><rect x={-90} y={-90} width={16} height={90} fill="#5a3418" /><rect x={74} y={-90} width={16} height={90} fill="#5a3418" /></G>
  </Vis>
);
const Afuera: React.FC = () => {
  const { t } = useMundo();
  return (
    <>
      <Vis x0={10300} x1={13500}><Pasto x0={10300} x1={13500} /></Vis>
      <Vis x0={10550} x1={11350}>
        {/* desolladero: cerco, carro, galpón */}
        <Fachwerk x={10650} w={420} h={360} muro="#cdb08a" viga="#5a4030" techo="#6a5a4a" pisos={1} />
        {Array.from({ length: 10 }, (_, i) => <G key={i} x={10600 + i * 75} y={SUELO + 10}><rect x={-6} y={-120} width={12} height={120} fill="#7d5a3a" /></G>)}
        <G x={10600} y={SUELO - 70}><rect x={0} y={0} width={680} height={10} fill="#7d5a3a" /></G>
        <G x={11180} y={SUELO}><rect x={-110} y={-120} width={220} height={70} fill="#8a5a2a" /><circle cx={-70} cy={-40} r={40} fill="none" stroke="#4a2810" strokeWidth={12} /><circle cx={70} cy={-40} r={40} fill="none" stroke="#4a2810" strokeWidth={12} /></G>
      </Vis>
      <Vis x0={11500} x1={12700}>
        <G x={12050} y={SUELO + 20}><path d="M -560 0 Q -300 -230 0 -240 Q 300 -230 560 0 Z" fill="#5a9a3a" /></G>
        <Horca x={11960} y={SUELO - 215} s={0.9} />
        {[0, 1, 2].map((i) => { const k = (t * 0.25 + i / 3) % 1; return <G key={i} x={11700 + k * 700} y={SUELO - 640 - Math.sin(k * 9 + i) * 40}><path d={`M -24 0 Q -12 ${-14 * Math.sin(t * 12 + i)} 0 0 Q 12 ${-14 * Math.sin(t * 12 + i)} 24 0`} stroke="#1d1430" strokeWidth={6} fill="none" /></G>; })}
      </Vis>
    </>
  );
};
// París (otra ciudad, se llega "por el cielo"): techos azul pizarra, Notre-Dame al fondo, mercado de granos
const Paris: React.FC = () => (
  <Vis x0={X.paris[0] - 300} x1={X.paris[1] + 300}>
    <G x={31500} y={SUELO - 40} s={1.3}>
      <g fill="#b9ad94" stroke="#5e5442" strokeWidth={6} strokeLinejoin="round">
        <rect x={-420} y={-560} width={170} height={560} /><rect x={250} y={-560} width={170} height={560} /><rect x={-250} y={-380} width={500} height={380} />
        <path d="M -430 -560 L -240 -560 L -240 -590 L -430 -590 Z M 240 -560 L 430 -560 L 430 -590 L 240 -590 Z" fill="#8f846c" />
        <path d="M -10 -380 L 0 -640 L 10 -380 Z" fill="#5a6a8a" />
      </g>
      <circle cx={0} cy={-220} r={92} fill="#3e4a6e" stroke="#5e5442" strokeWidth={6} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-220} x2={Math.cos((i * Math.PI) / 6) * 88} y2={-220 + Math.sin((i * Math.PI) / 6) * 88} stroke="#e9c46a" strokeWidth={5} />)}
      <circle cx={0} cy={-220} r={22} fill="#c0392b" />
      {[-335, 335].map((x) => [-470, -330, -190].map((y) => <path key={x + "_" + y} d={`M ${x - 26} ${y + 60} L ${x - 26} ${y} Q ${x} ${y - 38} ${x + 26} ${y} L ${x + 26} ${y + 60} Z`} fill="#2e3550" />))}
      <path d="M -70 0 L -70 -110 Q 0 -190 70 -110 L 70 0 Z" fill="#4a3a2a" stroke="#5e5442" strokeWidth={6} />
    </G>
    {[30100, 30500, 32400, 32800].map((x, i) => <Fachwerk key={x} x={x} w={380} h={520 + (i % 2) * 80} muro="#efe4d0" viga="#c9bca4" techo="#5a6a8a" pisos={3} />)}
    <Puesto x={31200} tela={C.violeta} />
    <Puesto x={31800} tela={C.ambar} />
    {[30950, 31080, 31330, 31650, 31780, 31950, 32100].map((x, i) => <Saco key={x} x={x} y={SUELO} s={0.7} color={i % 2 ? "#e8c890" : "#d9b77a"} />)}
  </Vis>
);

export type EstadoPueblo = { abreCasa: number; espada?: boolean };
// vida de pueblo: vecinos fijos en los huecos entre edificios, cada uno con su tarea en bucle
// (así ningún paneo pasa por una calle muerta); de noche se van a dormir
const Escoba: React.FC = () => <g transform="rotate(160)"><rect x={-5} y={-10} width={10} height={200} fill="#8a5a2a" /><path d="M -26 190 L 26 190 L 34 250 L -34 250 Z" fill="#d9b060" /></g>;
const Canasta: React.FC = () => <g><path d="M -40 0 L 40 0 L 30 44 L -30 44 Z" fill="#b8843a" stroke="#6b4a1a" strokeWidth={5} />{[-20, 0, 20].map((d) => <circle key={d} cx={d} cy={-4} r={14} fill="#d9a050" />)}</g>;
const Tabla: React.FC = () => <rect x={-160} y={-14} width={320} height={26} rx={4} fill="#b07a42" stroke="#6b4a1a" strokeWidth={5} />;
const Lanza: React.FC = () => <g><rect x={-5} y={-330} width={10} height={420} fill="#6b3a1f" /><path d="M -14 -330 L 0 -380 L 14 -330 Z" fill="#cfd6e0" /></g>;
const Vecinos: React.FC = () => {
  const { t, hora } = useMundo();
  if (hora > 1.15) return null;
  const va = (a: number, b: number, per: number, k = 0) => { const u = ((t + k) % per) / per; const f = u < 0.5 ? u * 2 : 2 - u * 2; return { x: a + (b - a) * (f * f * (3 - 2 * f)), flip: u >= 0.5 }; };
  const s1 = va(2660, 2790, 7), s2 = va(5470, 5620, 3.2, 1), s3 = va(8420, 8520, 6, 2);
  return (
    <>
      <Vis x0={1700} x1={1880}><Persona x={1790} y={SUELO - 24} h={235} t={t} seed={701} ropa={CIVIL(11)} gorro="toca" bD={40 + Math.sin(t * 5) * 30} cD={30} manoD={<Escoba />} inclina={Math.sin(t * 5) * 4} /></Vis>
      <Vis x0={2600} x1={2850}><Persona x={s1.x} y={SUELO - 24} h={240} t={t} seed={702} ropa={CIVIL(12)} camina={1.2} flip={s1.flip} bD={150} cD={150} bI={150} cI={150} manoD={<g transform="translate(-30 -40)"><Saco x={0} y={0} s={0.45} /></g>} /></Vis>
      <Vis x0={3920} x1={4100}>
        <Persona x={3960} y={SUELO - 24} h={240} t={t} seed={703} ropa={CIVIL(13)} habla={Math.sin(t * 0.9) > 0} bD={Math.sin(t * 0.9) > 0 ? 90 + Math.sin(t * 4) * 14 : 8} cD={60} />
        <Persona x={4060} y={SUELO - 24} h={225} t={t} seed={704} ropa={CIVIL(14)} gorro="toca" flip habla={Math.sin(t * 0.9) <= 0} expr={Math.sin(t * 0.9) > 0.6 ? "feliz" : "neutro"} bD={30} cD={130} bI={30} cI={130} />
      </Vis>
      <Vis x0={5420} x1={5680}><Persona x={s2.x} y={SUELO - 24} h={170} t={t} seed={705} ropa={CIVIL(15)} camina={2.2} flip={s2.flip} expr="feliz" bD={70} manoD={<circle cx={0} cy={0} r={46} fill="none" stroke="#8a5a2a" strokeWidth={8} />} /></Vis>
      <Vis x0={7560} x1={7700}><Persona x={7630} y={SUELO - 24} h={235} t={t} seed={706} ropa={CIVIL(16)} gorro="toca" bI={100} cI={60} manoI={<Canasta />} ladea={Math.sin(t * 0.7) * 6} habla={Math.sin(t * 0.5) > 0.3} /></Vis>
      <Vis x0={8350} x1={8600}><Persona x={s3.x} y={SUELO - 24} h={240} t={t} seed={707} ropa={CIVIL(17)} camina={1.1} flip={s3.flip} bD={160} cD={170} bI={160} cI={170} manoD={<g transform="translate(0 -60)"><Tabla /></g>} /></Vis>
      <Vis x0={9330} x1={9460}><Persona x={9400} y={SUELO - 24} h={250} t={t} seed={708} ropa={{ ...CIVIL(18), tunica: "#5a6a8a", tunica2: "#3a4a6a" }} gorro="campesino" bD={20} manoD={<Lanza />} expr={(t % 9) < 1.2 ? "sorpresa" : "neutro"} /></Vis>
    </>
  );
};
export const Pueblo: React.FC<EstadoPueblo> = ({ abreCasa, espada }) => (
  <>
    <Calle x0={-200} x1={10320} rio={[X.rio[0], X.rio[1]]} />
    <Calle x0={X.paris[0] - 2000} x1={X.paris[1] + 2000} />
    <Iglesia />
    <Panaderia />
    <Taberna />
    <Mercado />
    <CasaVerdugo abre={abreCasa} espada={espada !== false} />
    <Vis x0={7650} x1={8450}>
      <Fachwerk x={7700} w={330} h={620} muro="#f0d4a8" techo="#b5452c" pisos={3} />
      <Fachwerk x={8060} w={330} h={540} muro="#e8c8a0" techo="#9a3a2a" pisos={3} />
    </Vis>
    <Carpinteros />
    <Vis x0={9400} x1={10400}><Muralla x={9500} w={800} /></Vis>
    <Afuera />
    <Paris />
    <Vecinos />
  </>
);

// figuras de fondo para llenar el pueblo (no tocan la acción)
export const rndPos = (seed: number) => rnd(seed);
export { Taburete, fontFamily };
