// SETS DEL LAGO:
// · Puente  = arriba del tablero del Aerial Lift Bridge (piso PUENTE_PISO): torres gigantes de celosía a los lados, la
//   viga arriba, el lago Superior humeando detrás (horizonte), el muelle con el faro y Canal Park con luces.
// · CanalPark = a nivel de la calle de Canal Park (piso CANAL_PISO): el edificio de ladrillo de Gus (su ventana con
//   farol, `ventanaGus`), el muelle, el puente atrás y el lago. Lo reusan los Ep.2-3 (Gus y Ore).
// props: hora · luces 0..1 · nieve · vapor 0..1 · cae · hielo 0..1 (borde del lago congelado) · ventanaGus 0..1
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo, Ladrillos, SetProps, osc } from "../../anikit/sets/comun";
import { AMBAR } from "../elenco";
import { Banco, Edificio, Estrellas, Farola, NieveCae, Vapor, prendida } from "./comun";
import { Hora, LUCES } from "./hora";
import { PuenteLift } from "./puenteLift";

export const PUENTE_PISO = 900;
export const PUENTE_PUNTOS = { centro: 1200, torreI: -150, torreD: 2550, baranda: 1200 };
export const CANAL_PISO = 900;
export const CANAL_PUNTOS = { gus: 400, ventanaGus: { x: 470, y: 380 }, muelle: 1700, puente: 2600, lago: 1500 };

type P = SetProps & { hora?: Hora; luces?: number; nieve?: number; vapor?: number; cae?: boolean; hielo?: number; ventanaGus?: number };

const Lago: React.FC<{ f: number; hora: Hora; y: number; vapor: number; hielo: number; x0?: number; w?: number }> = ({ f, hora, y, vapor, hielo, x0 = -2000, w = 8000 }) => {
  const L = LUCES[hora];
  return (
    <g>
      <defs><linearGradient id="lgo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={L.lago[0]} /><stop offset="1" stopColor={L.lago[1]} /></linearGradient></defs>
      <rect x={x0} y={y} width={w} height={900} fill="url(#lgo)" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={x0 + random(`lo${i}`) * w + Math.sin(f / 40 + i) * 10} y={y + 14 + random(`ly${i}`) * 300} width={40 + random(`lw${i}`) * 120} height={3} rx={2} fill={L.sol} opacity={0.28} />)}
      {hielo > 0 && <path d={`M${x0},${y + 380 - 200 * hielo} ${Array.from({ length: 30 }).map((_, i) => `L${x0 + (i / 29) * w},${y + 380 - 200 * hielo + random(`hi${i}`) * 30}`).join(" ")} L${x0 + w},${y + 900} L${x0},${y + 900} Z`} fill={L.nieve} opacity={0.85} />}
      <Vapor f={f} x0={x0 + 1500} w={5000} y={y + 40} o={vapor} n={40} />
    </g>
  );
};

export const Puente: React.FC<P> = ({ capa, f, pal, hora = "noche", luces = 1, nieve = 0.6, vapor = 0.7, cae = false, hielo = 0 }) => {
  const L = LUCES[hora];
  const P = PUENTE_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} />
        <Estrellas f={f} o={L.estrellas} />
        <Halo x={1300} y={L.solY} r={480} color={L.sol} fuerza={0.4} />
        <circle cx={1300} cy={L.solY} r={40} fill={L.sol} opacity={0.9} />
        <Lago f={f} hora={hora} y={560} vapor={vapor} hielo={hielo} />
        {/* muelle con el faro */}
        <rect x={-600} y={600} width={900} height={18} fill="#2a2230" />
        <rect x={270} y={510} width={26} height={92} fill="#e8e2d8" /><rect x={262} y={500} width={42} height={16} fill="#2a2230" />
        <circle cx={283} cy={492} r={8} fill={prendida("faro", luces, 1.1) ? "#ffcf6e" : "#3a3040"} />
        {/* Canal Park a lo lejos (izq) */}
        {Array.from({ length: 7 }).map((_, i) => <Edificio key={i} x={-1500 + i * 150} y={620} w={120} h={70 + random(`cpl${i}`) * 90} color={osc("#3a2a3c", 0.8)} luces={luces} seed={`cpl${i}`} techoNieve={nieve} />)}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {/* baranda del tablero, delante de los pies */}
        <rect x={-1500} y={P - 70} width={6000} height={8} fill="#1b1520" />
        {Array.from({ length: 60 }).map((_, i) => <path key={i} d={`M${-1500 + i * 100},${P - 66} L${-1450 + i * 100},${P + 4} M${-1400 + i * 100},${P - 66} L${-1450 + i * 100},${P + 4}`} stroke="#1b1520" strokeWidth={5} />)}
        {nieve > 0 && <rect x={-1500} y={P - 78} width={6000} height={8} rx={4} fill={L.nieve} opacity={nieve} />}
        <rect x={-1500} y={P + 4} width={6000} height={300} fill="#17121c" />
        {cae && <NieveCae f={f} n={140} x0={-800} w={4400} />}
      </g>
    );
  }
  return (
    <g>
      <PuenteLift x={-300} y={P + 270} W={3000} H={1500} color="#1d1624" luces={luces} detalle={2.2} nieve={nieve} />
      {/* piso del tablero (rejilla) */}
      <rect x={-300} y={P - 6} width={3000} height={14} fill="#2a2232" />
      {nieve > 0 && <rect x={-300} y={P - 10} width={3000} height={6} fill={L.nieve} opacity={nieve * 0.7} />}
      {/* farolas del puente */}
      {[300, 1200, 2100].map((x, i) => <Farola key={x} x={x} piso={P} on={luces > 0.05 ? luces : 0} alto={420} lado={i % 2 ? -1 : 1} />)}
    </g>
  );
};

// el edificio de Gus (ladrillo, 4 pisos, sótano con ventanita) — reusable
export const EdificioGus: React.FC<{ x: number; piso: number; luces: number; ventana: number; nieve: number }> = ({ x, piso, luces, ventana, nieve }) => (
  <g>
    <rect x={x} y={piso - 620} width={420} height={620} fill="#5a2e2a" />
    <Ladrillos x={x} y={piso - 620} w={420} h={620} color="#3e1e1c" />
    <rect x={x - 10} y={piso - 636} width={440} height={20} fill="#3e1e1c" />
    {nieve > 0 && <rect x={x - 12} y={piso - 648} width={444} height={14} rx={6} fill="#eef2fa" opacity={nieve} />}
    {Array.from({ length: 4 }).map((_, r) => [0, 1, 2].map((c) => {
      const esGus = r === 1 && c === 1;
      const lit = esGus ? ventana : prendida(`gus${r}${c}`, luces, 0.4) ? 1 : 0;
      return <g key={`${r}${c}`}><rect x={x + 40 + c * 130 - 6} y={piso - 580 + r * 130 - 6} width={92} height={102} fill="#3e1e1c" /><rect x={x + 40 + c * 130} y={piso - 580 + r * 130} width={80} height={90} fill={lit > 0.1 ? "#ffd27a" : "#221c2a"} opacity={lit > 0.1 ? 0.6 + 0.4 * lit : 1} />{esGus && lit > 0.1 && <Halo x={x + 80 + c * 130} y={piso - 535 + r * 130} r={160} color={AMBAR} fuerza={0.8 * lit} />}</g>;
    }))}
    <rect x={x + 170} y={piso - 110} width={80} height={110} fill="#2a1a18" />
    <text x={x + 210} y={piso - 124} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={22} fill="#e8d9b5">CANAL PARK</text>
  </g>
);

export const CanalPark: React.FC<P> = ({ capa, f, pal, hora = "noche", luces = 0, nieve = 0.8, vapor = 0.6, cae = false, hielo = 0.3, ventanaGus = 1 }) => {
  const L = LUCES[hora];
  const P = CANAL_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} />
        <Estrellas f={f} o={L.estrellas} />
        <Lago f={f} hora={hora} y={600} vapor={vapor} hielo={hielo} />
        <PuenteLift x={1900} y={700} W={1000} H={560} color="#1b1520" luces={luces} detalle={1} nieve={nieve} />
      </g>
    );
  }
  if (capa === "frente") return cae ? <NieveCae f={f} n={150} x0={-800} w={4400} /> : null;
  return (
    <g>
      {/* paseo y costa */}
      <rect x={-1500} y={P - 10} width={6000} height={1400} fill={nieve > 0.2 ? L.nieve : "#3a3442"} />
      <rect x={900} y={P - 30} width={3000} height={24} fill="#2a2232" />
      <EdificioGus x={CANAL_PUNTOS.gus - 200} piso={P} luces={luces} ventana={ventanaGus} nieve={nieve} />
      <Edificio x={-700} y={P} w={380} h={420} color={osc("#4a3a52", 0.85)} luces={luces} seed="cpk1" techoNieve={nieve} />
      <Farola x={900} piso={P} on={luces} lado={1} />
      <Banco x={-1500} w={6000} piso={P + 20} alto={50 * nieve} color={L.nieve} seed="ck" />
    </g>
  );
};
