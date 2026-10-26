// SET · PLANTA DE AGUA DE LAKEWOOD (lc-b, Ep.3). Piso LK_PISO (la costa). Mundo útil x −600 … 4400.
//   el lago con la toma (crib) en x 0 y el caño bajo el agua que corre por el fondo (en corte) hasta la planta
//   · la planta (1500…4100): fachada de ladrillo que se abre en corte (`corte`) y deja ver 8 bombas (1650…2550),
//   filtros de arena (2650…3250), tanques de químicos (3350…3700), el tablero eléctrico (LK_PUNTOS.tablero) y el
//   manómetro grande (3880). `flujo` 0..1 = el agua que corre por el caño y las bombas que giran; `aguja` 0..1.
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo, Ladrillos, SetProps, acl, mezclar, osc } from "../../anikit/sets/comun";
import { Banco, Vapor } from "../mundo/comun";
import { Hora, LUCES } from "../mundo/hora";

export const LK_PISO = 900;
export const LK_AGUA = 640; // superficie del lago
export const LK_PUNTOS = { toma: 0, cano: 700, planta: 2700, bombas: 2100, filtros: 2950, quimicos: 3520, tablero: 3780, manometro: 3950, puerta: 1620 };

type P = SetProps & { hora?: Hora; corte?: number; flujo?: number; aguja?: number; nieve?: number; manuales?: number };

export const Lakewood: React.FC<P> = ({ capa, f, hora = "invierno", corte = 0, flujo = 0, aguja = 0.15, nieve = 0.6, manuales = 0 }) => {
  const L = LUCES[hora];
  const P = LK_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} x={-2000} w={8000} />
        <Halo x={600} y={L.solY} r={420} color={L.sol} fuerza={0.55} />
        <rect x={-2000} y={LK_AGUA - 40} width={8000} height={2000} fill={L.lago[0]} />
        <Vapor f={f} x0={-1500} w={3500} y={LK_AGUA - 20} o={hora === "invierno" ? 0.55 : 0.2} />
      </g>
    );
  }
  if (capa === "frente") {
    return <g>{Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={-500 + i * 520} cy={P + 160} rx={110} ry={46} fill={mezclar("#5a5660", L.tinte, 0.3)} />)}</g>;
  }
  const agua1 = L.lago[0], agua2 = L.lago[1];
  const dash = -f * 6 * flujo;
  const giro = f * 9 * flujo;
  const cano = `M40,980 L40,1060 L1350,1060 Q1480,1060 1480,960 L1480,${P - 40} L1650,${P - 40} L3300,${P - 40}`;
  return (
    <g>
      {/* lago en corte: superficie, profundidad y fondo */}
      <rect x={-2000} y={LK_AGUA} width={3550} height={800} fill={agua1} />
      <rect x={-2000} y={LK_AGUA + 120} width={3550} height={700} fill={mezclar(agua1, agua2, 0.6)} />
      <rect x={-2000} y={LK_AGUA + 300} width={3550} height={1600} fill={agua2} />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-1800 + i * 240 + Math.sin(f / 26 + i) * 14} y={LK_AGUA + 6 + (i % 3) * 6} width={110} height={4} rx={2} fill={acl(agua1, 0.4)} opacity={0.6} />)}
      <path d={`M-2000,1120 Q-800,1080 0,1110 Q800,1140 1550,1100 L1550,2600 L-2000,2600 Z`} fill="#3a3436" />
      {/* la toma (crib) en el fondo */}
      <rect x={-40} y={930} width={160} height={70} fill="#6a6660" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-30 + i * 26} y={938} width={12} height={54} fill="#3a3a40" />)}
      {/* caño (borde + agua que corre) */}
      <path d={cano} stroke="#55525a" strokeWidth={46} fill="none" strokeLinejoin="round" />
      <path d={cano} stroke={mezclar("#2a4a6a", "#5ab0ff", flujo)} strokeWidth={30} fill="none" strokeLinejoin="round" />
      {flujo > 0.02 && <path d={cano} stroke="#d8f0ff" strokeWidth={8} fill="none" strokeDasharray="30 50" strokeDashoffset={dash} opacity={0.8 * flujo} />}
      {/* costa */}
      <path d={`M1500,${LK_AGUA} L1550,${P - 30} L4400,${P - 30} L4400,2600 L1550,2600 Z`} fill={mezclar("#5a5048", L.tinte, 0.3)} />
      <rect x={1500} y={P - 34} width={2900} height={12} fill={osc("#5a5048", 0.8)} />
      {nieve > 0 && <Banco x={1500} w={2900} piso={P - 30} alto={30 * nieve} color={L.nieve} seed="lk" />}

      {/* PLANTA: interior (siempre dibujado), fachada encima que se desvanece con `corte` */}
      <g>
        <rect x={1560} y={P - 560} width={2560} height={530} fill="#2a2e38" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={1560} y={P - 540 + i * 60} width={2560} height={2} fill="#343a46" />)}
        {/* bombas */}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 1700 + i * 115;
          return (
            <g key={i}>
              <rect x={x - 30} y={P - 200} width={60} height={160} rx={10} fill="#3a6a8a" />
              <rect x={x - 22} y={P - 260} width={44} height={60} rx={8} fill="#2f5a76" />
              <circle cx={x} cy={P - 140} r={22} fill="#1d3a50" />
              <rect x={x - 3} y={P - 160} width={6} height={40} fill="#8fd3ff" transform={`rotate(${giro + i * 20} ${x} ${P - 140})`} opacity={0.4 + 0.6 * flujo} />
              <rect x={x - 6} y={P - 330} width={12} height={70} fill="#55525a" />
            </g>
          );
        })}
        <rect x={1650} y={P - 338} width={940} height={16} fill="#55525a" />
        {/* filtros de arena */}
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={2650 + k * 200} y={P - 300} width={170} height={260} fill="#4a4e58" />
            <rect x={2662 + k * 200} y={P - 180} width={146} height={130} fill="#c9b48a" />
            <rect x={2662 + k * 200} y={P - 230} width={146} height={50} fill={mezclar("#2a4a6a", "#5ab0ff", flujo)} opacity={0.8} />
          </g>
        ))}
        {/* tanques de químicos */}
        {[["#e8c040", "CL"], ["#d8d0c0", "AL"], ["#9ad0a0", "F"]].map(([c, t], k) => (
          <g key={k}>
            <rect x={3350 + k * 120} y={P - 330} width={100} height={290} rx={50} fill={c} />
            <rect x={3365 + k * 120} y={P - 220} width={70} height={40} fill="#2a2e38" />
            <text x={3400 + k * 120} y={P - 190} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={26} fill="#f6ecd2">{t}</text>
          </g>
        ))}
        {/* tablero eléctrico */}
        <rect x={3700} y={P - 400} width={150} height={260} fill="#5a6270" />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={3716 + (i % 3) * 44} y={P - 384 + Math.floor(i / 3) * 56} width={30} height={40} fill="#3a404c" />)}
        {/* manómetro grande */}
        <g transform={`translate(${LK_PUNTOS.manometro},${P - 330})`}>
          <circle r={74} fill="#efe6d2" stroke="#55525a" strokeWidth={12} />
          <path d="M-52,30 A60,60 0 1 1 52,30" stroke="#7cc46a" strokeWidth={10} fill="none" />
          <path d="M30,52 A60,60 0 0 0 52,30" stroke="#d8382c" strokeWidth={10} fill="none" />
          <rect x={-3} y={-58} width={6} height={60} rx={3} fill="#2a2020" transform={`rotate(${interpolate(aguja, [0, 1], [-135, 135])})`} />
          <circle r={8} fill="#2a2020" />
        </g>
        {/* pila de manuales (Dev) */}
        {Array.from({ length: Math.round(manuales * 14) }).map((_, i) => <rect key={i} x={2240 + (random(`mn${i}`) - 0.5) * 14} y={P - 40 - (i + 1) * 16} width={110} height={15} rx={2} fill={["#3a5a8a", "#c0352c", "#e8c040", "#2a7a5a"][i % 4]} />)}
        <Halo x={2600} y={P - 400} r={900} color={L.borde} fuerza={0.15} />
      </g>
      {/* fachada (se desvanece) */}
      <g opacity={1 - corte}>
        <rect x={1540} y={P - 600} width={2600} height={570} fill={mezclar("#8a4a3a", L.tinte, 0.35)} />
        <Ladrillos x={1540} y={P - 600} w={2600} h={570} color={osc("#8a4a3a", 0.7)} />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={1640 + i * 245} y={P - 520} width={120} height={260} rx={60} fill={mezclar("#2a3040", L.tinte, 0.3)} />)}
        <rect x={1540} y={P - 640} width={2600} height={46} fill={osc("#8a4a3a", 0.7)} />
        <rect x={2500} y={P - 700} width={680} height={60} fill="#e9dcc0" />
        <text x={2840} y={P - 656} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={38} fill="#3a2a20" letterSpacing={4}>LAKEWOOD PUMPING STATION</text>
        <rect x={1580} y={P - 210} width={90} height={180} fill="#3a2e2a" />
      </g>
      {nieve > 0 && <rect x={1530} y={P - 652} width={2620} height={14 * nieve} rx={5} fill={L.nieve} />}
    </g>
  );
};
