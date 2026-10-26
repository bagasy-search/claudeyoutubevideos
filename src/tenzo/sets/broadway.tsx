// SET · BROADWAY Y LAWRENCE (Uptown) con nieve: la vía elevada de la línea roja sobre la calle, la vidriera del
// Spin City, el Green Mill (marquesina + cartel vertical de neón), la entrada de la estación Lawrence, la parada del 36
// y, en la esquina de Argyle, los carteles asiáticos y la ghost bike blanca.
// Piso (vereda): BWY_PISO. x útil: -600 … 5400. Puntos en BWY_PUNTOS.
// setProps: hora "noche" | "dia" (con la paleta PAL_DIA), tren (cuadro en que cruza; -1 no), nieve (default true).
import React from "react";
import { random } from "remotion";
import { Charco, Cono, Halo } from "../../anikit/luz";
import { Ladrillos, SetProps, osc } from "../../anikit/sets/comun";
import { GhostBike } from "../utileria";
import { FRIO } from "../elenco";
import { Nieve, Skyline, TrenElevado, ViaElevada } from "./chicago";

export const BWY_PISO = 900;
export const BWY_PUNTOS = { lavadero: 450, puertaLav: 760, greenmill: 1750, estacion: 2800, parada36: 3700, banco36: 3640, argyle: 4500, ghostbike: 4620, farol1: 1200, farol2: 3250 };

const FarolLed: React.FC<{ x: number; piso: number; dia?: boolean }> = ({ x, piso, dia }) => (
  <g>
    <rect x={x - 7} y={piso - 560} width={14} height={560} fill="#2a2e36" />
    <path d={`M${x},${piso - 540} Q${x},${piso - 580} ${x + 70},${piso - 572}`} stroke="#2a2e36" strokeWidth={10} fill="none" />
    <rect x={x + 44} y={piso - 580} width={60} height={14} rx={5} fill="#3a3f48" />
    {!dia && <><Halo x={x + 74} y={piso - 566} r={300} color="#e6eeff" fuerza={0.45} /><Cono x={x + 74} y={piso - 566} alto={566} ancho={560} boca={50} color="#e6eeff" fuerza={0.18} /><Charco x={x + 74} y={piso + 14} rx={300} color="#e6eeff" fuerza={0.3} /></>}
  </g>
);

export const Broadway: React.FC<SetProps & { hora?: "noche" | "dia"; tren?: number; nieve?: boolean }> = ({ capa, f, pal, hora = "noche", tren = -1, nieve = true }) => {
  const P = BWY_PISO;
  const dia = hora === "dia";
  if (capa === "lejos") {
    return (
      <g>
        <Skyline x0={-1500} w={9000} piso={P - 140} f={f} seed={11} dia={dia} />
        {!dia && <Halo x={2400} y={-200} r={1400} color="#3a4a6a" fuerza={0.25} />}
      </g>
    );
  }
  if (capa === "frente") {
    return nieve ? <Nieve f={f} x0={-800} w={6600} y0={-400} h={1700} n={70} seed={9} grande /> : null;
  }
  const neon = (c: string, on = true) => (dia ? osc(c, 0.75) : on ? c : osc(c, 0.4));
  const parp = random(`gm${Math.floor(f / 5)}`) > 0.95 ? 0.4 : 1;
  return (
    <g>
      {/* fachadas continuas de ladrillo, 2-3 pisos, con ventanas */}
      {[[-700, 900, 0], [200, 1000, 1], [1200, 1100, 2], [2300, 1000, 3], [3300, 1000, 1], [4300, 1300, 0]].map(([x, w, k]) => (
        <g key={x}>
          <rect x={x} y={P - 760 - (k % 2) * 80} width={w} height={760 + (k % 2) * 80} fill={pal.fachada[k % 4]} />
          <Ladrillos x={x} y={P - 760 - (k % 2) * 80} w={w} h={760 + (k % 2) * 80} color={pal.ladrillo} o={0.4} />
          {Array.from({ length: Math.floor(w / 170) }).map((_, c) => [0, 1].map((r) => {
            const on = random(`bw${x}${c}${r}`) > 0.7;
            return <rect key={`${c}${r}`} x={x + 50 + c * 170} y={P - 700 - (k % 2) * 80 + r * 150} width={90} height={110} fill={dia ? "#8d96a2" : on ? pal.ventana : pal.ventanaApagada} stroke={osc(pal.fachada[k % 4], 0.7)} strokeWidth={8} />;
          }))}
          <rect x={x} y={P - 770 - (k % 2) * 80} width={w} height={14} fill={osc(pal.fachada[k % 4], 0.75)} />
        </g>
      ))}
      {/* SPIN CITY: vidriera fría con las máquinas adentro */}
      <g transform={`translate(${BWY_PUNTOS.lavadero},0)`}>
        <rect x={-300} y={P - 380} width={600} height={360} fill={dia ? "#9aa6b4" : "#cfdcf0"} opacity={dia ? 0.7 : 0.85} />
        {Array.from({ length: 5 }).map((_, k) => <g key={k}><rect x={-270 + k * 112} y={P - 250} width={96} height={230} rx={6} fill="#dfe2e6" opacity={0.8} /><circle cx={-222 + k * 112} cy={P - 150} r={30} fill="#1e2632" opacity={0.8} /></g>)}
        <rect x={-310} y={P - 390} width={620} height={16} fill="#2a2e36" />
        <rect x={-260} y={P - 470} width={520} height={74} rx={8} fill="#1d2129" stroke={neon(FRIO)} strokeWidth={4} />
        <text x={0} y={P - 420} fontSize={44} textAnchor="middle" fill={neon("#e8eef8")} fontFamily="sans-serif" fontWeight={800} letterSpacing={5}>SPIN CITY 24H</text>
        {!dia && <Halo x={0} y={P - 200} r={520} color="#dfe8ff" fuerza={0.3} />}
        {!dia && <Charco x={0} y={P + 40} rx={420} color="#dfe8ff" fuerza={0.3} />}
        <rect x={290} y={P - 400} width={150} height={400} fill="#1a2028" stroke="#4a5160" strokeWidth={8} />
      </g>
      {/* GREEN MILL: marquesina + cartel vertical (neón verde pálido, casi blanco: la paleta manda) */}
      <g transform={`translate(${BWY_PUNTOS.greenmill},0)`}>
        <rect x={-260} y={P - 360} width={520} height={340} fill="#15171c" />
        <rect x={-120} y={P - 330} width={240} height={330} fill="#0f1114" />
        <rect x={-310} y={P - 470} width={620} height={110} rx={8} fill="#22262d" />
        {Array.from({ length: 22 }).map((_, k) => <circle key={k} cx={-290 + k * 27.5} cy={P - 462} r={5} fill={dia ? "#a8b0a8" : random(`bl${k}${Math.floor(f / 8)}`) > 0.5 ? "#f4f0dc" : "#9a9680"} />)}
        <text x={0} y={P - 400} fontSize={56} textAnchor="middle" fill={neon("#cfeedd")} opacity={parp} fontFamily="serif" fontWeight={800} letterSpacing={4}>GREEN MILL</text>
        <text x={0} y={P - 372} fontSize={20} textAnchor="middle" fill={neon("#e8e4dc")} fontFamily="sans-serif" fontWeight={700} letterSpacing={6}>COCKTAIL LOUNGE · JAZZ</text>
        <g transform="translate(250,-120)">
          <rect x={0} y={P - 760} width={84} height={380} rx={10} fill="#22262d" stroke={neon("#cfeedd")} strokeWidth={4} opacity={parp} />
          {"GREEN".split("").map((c, k) => <text key={k} x={42} y={P - 700 + k * 62} fontSize={50} textAnchor="middle" fill={neon("#cfeedd")} opacity={parp} fontFamily="serif" fontWeight={800}>{c}</text>)}
        </g>
        {!dia && <Halo x={0} y={P - 420} r={460} color="#cfeedd" fuerza={0.22 * parp} />}
      </g>
      {/* ESTACIÓN LAWRENCE (línea roja): entrada bajo la vía, cartel */}
      <g transform={`translate(${BWY_PUNTOS.estacion},0)`}>
        <rect x={-280} y={P - 430} width={560} height={410} fill="#1b1e24" />
        <rect x={-220} y={P - 330} width={440} height={330} fill={dia ? "#7d858f" : "#3a4458"} />
        {[-140, 0, 140].map((x) => <rect key={x} x={x - 50} y={P - 300} width={100} height={300} fill={dia ? "#a2aab4" : "#b7c6dc"} opacity={0.5} />)}
        <rect x={-300} y={P - 480} width={600} height={70} rx={6} fill="#e8e6e0" />
        <circle cx={-240} cy={P - 445} r={24} fill="#c23a32" />
        <text x={-240} y={P - 437} fontSize={22} textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontWeight={800}>CTA</text>
        <text x={30} y={P - 430} fontSize={44} textAnchor="middle" fill="#22262d" fontFamily="sans-serif" fontWeight={800} letterSpacing={6}>LAWRENCE</text>
        {!dia && <Halo x={0} y={P - 200} r={420} color="#b7c6dc" fuerza={0.25} />}
      </g>
      {/* parada del 36: refugio con banco y cartel */}
      <g transform={`translate(${BWY_PUNTOS.parada36},0)`}>
        <rect x={-210} y={P - 330} width={420} height={14} fill="#3a3f48" />
        <rect x={-200} y={P - 316} width={400} height={240} fill="#a9b8cc" opacity={dia ? 0.25 : 0.14} stroke="#4a5160" strokeWidth={6} />
        {[-200, 200].map((x) => <rect key={x} x={x - 6} y={P - 330} width={12} height={330} fill="#3a3f48" />)}
        <rect x={-150} y={P - 80} width={240} height={14} rx={4} fill="#5a616c" />
        {[-130, 70].map((x) => <rect key={x} x={x} y={P - 66} width={10} height={66} fill="#3a3f48" />)}
        <rect x={260} y={P - 560} width={12} height={560} fill="#3a3f48" />
        <rect x={226} y={P - 560} width={80} height={110} rx={6} fill="#e8e6e0" />
        <text x={266} y={P - 494} fontSize={52} textAnchor="middle" fill="#22262d" fontFamily="sans-serif" fontWeight={800}>36</text>
        <text x={266} y={P - 464} fontSize={14} textAnchor="middle" fill="#22262d" fontFamily="sans-serif" fontWeight={700}>BROADWAY</text>
      </g>
      {/* ARGYLE: carteles asiáticos en las vidrieras */}
      <g transform={`translate(${BWY_PUNTOS.argyle},0)`}>
        {[[-420, "PHO 777"], [-60, "BAKERY"], [300, "ARGYLE ST"]].map(([x, t], k) => (
          <g key={k}>
            <rect x={(x as number) - 140} y={P - 520} width={280} height={84} rx={6} fill={k === 2 ? "#2a5a3a" : "#2a2e36"} stroke={k === 2 ? "#e8e6e0" : neon("#e8d8b8")} strokeWidth={4} />
            <text x={x as number} y={P - 464} fontSize={k === 2 ? 34 : 40} textAnchor="middle" fill={k === 2 ? "#f4f2ee" : neon("#f2e6cc")} fontFamily="sans-serif" fontWeight={800} letterSpacing={3}>{t}</text>
            {k < 2 && <rect x={(x as number) - 140} y={P - 410} width={280} height={390} fill={dia ? "#8d96a2" : "#3a4458"} opacity={0.8} />}
          </g>
        ))}
        {/* farolitos de papel de la calle Argyle (apagados de noche, la única luz cálida es la de Tenzo) */}
        {[-500, -350, -200, -50, 100].map((x, k) => <ellipse key={k} cx={x} cy={P - 600 + (k % 2) * 10} rx={16} ry={20} fill={dia ? "#c9a49a" : "#4a3a3a"} />)}
        <path d={`M-520,${P - 620} Q-210,${P - 590} 120,${P - 620}`} stroke="#2a2e36" strokeWidth={2} fill="none" />
      </g>
      {/* vereda y calle con nieve acumulada */}
      <rect x={-900} y={P} width={7000} height={50} fill={pal.vereda} />
      <rect x={-900} y={P} width={7000} height={10} fill="#e9eef6" opacity={dia ? 0.75 : 0.6} />
      <rect x={-900} y={P + 50} width={7000} height={900} fill={pal.calle} />
      {Array.from({ length: 30 }).map((_, k) => <rect key={k} x={-900 + k * 240} y={P + 140} width={130} height={8} fill="#c9ccd2" opacity={0.35} />)}
      {Array.from({ length: 14 }).map((_, k) => <ellipse key={k} cx={-700 + k * 480 + random(`mn${k}`) * 100} cy={P + 52} rx={90 + random(`mr${k}`) * 60} ry={16} fill="#e9eef6" opacity={0.7} />)}
      <FarolLed x={BWY_PUNTOS.farol1} piso={P} dia={dia} />
      <FarolLed x={BWY_PUNTOS.farol2} piso={P} dia={dia} />
      <GhostBike x={BWY_PUNTOS.ghostbike} piso={P} />
      {/* la vía elevada encima de todo el set */}
      <ViaElevada x0={-900} w={7000} y={-120} piso={P} />
      {tren >= 0 && <TrenElevado x0={-900} w={7000} y={-120} f={f - tren} vel={44} />}
      {nieve && <Nieve f={f} x0={-800} w={6600} y0={-300} h={1300} n={160} seed={4} />}
    </g>
  );
};
