// SET 5 · PAISAJE AL ATARDECER (Awaken «restart humanity»): cielo enorme naranja-rosa con sol bajo, cordilleras
// en perspectiva aérea, lago con reflejos, colinas con árboles, camino de tierra, cabaña con ventana encendida,
// fogata opcional y luciérnagas. Piso: ATARDECER_PISO. x útil: -1200 … 4800.
// Puntos: sol 1800, lago 1400, cabaña 3000, fogata 2500, árbol grande 600.
import React from "react";
import { random } from "remotion";
import { Charco, Halo, Haces } from "../luz";
import { Arbol, Arbusto, Cielo, Colinas, Cordillera, Nube, Pajaros, SetProps, Ventana, acl, mezclar, osc } from "./comun";

export const ATARDECER_PISO = 900;
export const ATARDECER_PUNTOS = { sol: 1800, lago: 1400, cabana: 3000, fogata: 2500, arbol: 600 };

export const Fogata: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Halo x={0} y={-40} r={320} color="#ff9a3a" fuerza={0.55 + 0.08 * Math.sin(f / 3)} />
    <Charco x={0} y={0} rx={260} color="#ff9a3a" fuerza={0.5} />
    {[-30, 0, 30].map((dx, i) => <rect key={i} x={-60} y={-12} width={120} height={16} rx={8} fill="#5a3420" transform={`rotate(${dx})`} />)}
    {[0, 1, 2].map((i) => {
      const h = 70 + 22 * Math.sin(f / 4 + i * 2) + i * 8;
      const w = 34 - i * 8;
      return <path key={i} d={`M${-w},-6 Q${-w * 0.6},${-h * 0.5} ${Math.sin(f / 5 + i) * 10},${-h} Q${w * 0.6},${-h * 0.5} ${w},-6 Z`} fill={["#ff7a2a", "#ffb43a", "#fff0a0"][i]} />;
    })}
    {Array.from({ length: 6 }).map((_, i) => {
      const t = ((f * 1.3 + i * 17) % 60) / 60;
      return <circle key={i} cx={Math.sin(i * 3 + f / 12) * 30 * t} cy={-60 - t * 160} r={3 * (1 - t)} fill="#ffd27a" opacity={1 - t} />;
    })}
  </g>
);

export const Atardecer: React.FC<SetProps & { fogata?: boolean; hora?: number }> = ({ capa, f, pal, fogata, hora = 0 }) => {
  const P = ATARDECER_PISO;
  // hora 0 = sol bajo · 1 = ya se puso (más violeta, cabaña más encendida)
  const cielo: [string, string, string] = [mezclar(pal.cielo[0], "#1d1838", hora), mezclar(pal.cielo[1], "#7a4a6a", hora), mezclar(pal.cielo[2], "#e88a5a", hora)];
  const solY = 520 + hora * 260;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={cielo} x={-2500} w={9000} />
        <Halo x={ATARDECER_PUNTOS.sol} y={solY} r={900} color="#ffe2a0" fuerza={0.75 - hora * 0.4} />
        <circle cx={ATARDECER_PUNTOS.sol} cy={solY} r={110} fill="#fff4cf" opacity={1 - hora * 0.6} />
        {[[-400, 180, 1.4], [700, 120, 1], [2600, 220, 1.6], [3800, 140, 1.1], [1300, 300, 0.8]].map(([x, y, s], i) => <Nube key={i} x={(x as number) + f * 0.12 * (i + 1)} y={y as number} s={s as number} color={acl(cielo[1], 0.35)} o={0.55} />)}
        <Pajaros x={900} y={260} f={f} n={4} color={osc(cielo[1], 0.4)} />
        <Cordillera y={P - 230} alto={330} color={mezclar(cielo[2], cielo[1], 0.55)} seed={1} />
        <Cordillera y={P - 180} alto={240} color={mezclar(cielo[1], "#5a3a5a", 0.45)} seed={2} puntas={18} />
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {/* pastos y flores en primer término + luciérnagas al caer el sol */}
        {Array.from({ length: 70 }).map((_, i) => {
          const x = -1200 + i * 90 + random(`ps${i}`) * 40;
          const h = 50 + random(`ph${i}`) * 70;
          const sway = Math.sin(f / 25 + i) * 6;
          return <path key={i} d={`M${x - 8},${P + 200} Q${x + sway * 0.5},${P + 200 - h * 0.6} ${x + sway},${P + 200 - h} Q${x + 2},${P + 200 - h * 0.5} ${x + 8},${P + 200} Z`} fill={osc(pal.piso, 0.55)} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-1000 + i * 420 + random(`fl${i}`) * 100} cy={P + 150 - random(`fy${i}`) * 50} r={7} fill={["#ffcf5a", "#ff8aa0", "#fff2e0"][i % 3]} />)}
        {hora > 0.3 && Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={-600 + random(`lu${i}`) * 5000 + Math.sin(f / 30 + i) * 30} cy={P - 100 - random(`lv${i}`) * 300 + Math.cos(f / 25 + i) * 20} r={3.5} fill="#fff0a0" opacity={(hora - 0.3) * Math.abs(Math.sin(f / 15 + i))} />)}
      </g>
    );
  }
  return (
    <g>
      {/* lago con reflejo del sol */}
      <rect x={-2000} y={P - 190} width={8000} height={200} fill={mezclar(cielo[2], "#4a3a6a", 0.35)} />
      {Array.from({ length: 26 }).map((_, i) => <rect key={i} x={ATARDECER_PUNTOS.sol - 160 + random(`lr${i}`) * 320 + Math.sin(f / 18 + i) * 10} y={P - 180 + i * 7} width={40 + random(`lw${i}`) * 120 * (1 - i / 30)} height={3} rx={2} fill="#fff1c4" opacity={0.75 * (1 - hora * 0.6)} />)}
      <Colinas y={P - 120} alto={160} color={mezclar(pal.piso, cielo[1], 0.35)} seed={3} />
      {[-600, -300, 200, 950, 1150, 2200, 3600, 3900, 4300].map((x, i) => <Arbol key={i} x={x} y={P - 60 - (i % 3) * 20} s={0.55 + (i % 3) * 0.12} copa={mezclar(osc(pal.piso, 0.7), cielo[1], 0.3)} tipo={i % 2 ? "pino" : "redondo"} />)}
      {/* terreno principal y camino */}
      <path d={`M-2000,${P - 30} Q800,${P - 70} 2000,${P - 20} Q3200,${P + 20} 6000,${P - 40} L6000,${P + 800} L-2000,${P + 800} Z`} fill={pal.piso} />
      <path d={`M-2000,${P + 10} Q1000,${P - 10} 2400,${P + 20} Q3600,${P + 40} 6000,${P + 10} L6000,${P + 70} Q3600,${P + 100} 2400,${P + 80} Q1000,${P + 50} -2000,${P + 70} Z`} fill={pal.vereda} opacity={0.9} />
      <Arbol x={ATARDECER_PUNTOS.arbol} y={P - 10} s={1.4} copa={osc(pal.piso, 0.62)} tronco="#3a2618" />
      <Arbusto x={-200} y={P - 10} w={300} h={60} color={osc(pal.piso, 0.8)} seed={2} />
      <Arbusto x={1900} y={P - 10} w={240} h={50} color={osc(pal.piso, 0.78)} seed={5} />
      {/* cabaña */}
      <g>
        <rect x={2800} y={P - 300} width={420} height={300} fill="#8a5a3a" />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={2800} y={P - 300 + i * 30} width={420} height={3} fill="#6a4228" />)}
        <path d={`M2770,${P - 290} L3010,${P - 470} L3250,${P - 290} Z`} fill="#b6463a" />
        <path d={`M2770,${P - 290} L3010,${P - 470} L3030,${P - 455} L2795,${P - 280} Z`} fill="#8e3229" />
        <rect x={3140} y={P - 470} width={40} height={90} fill="#5a3a2a" />
        {[0, 1, 2].map((k) => <circle key={k} cx={3160 + Math.sin(f / 20 + k) * 12 + k * 10} cy={P - 500 - k * 40 - ((f * 0.8) % 40)} r={14 + k * 6} fill="#efe4d8" opacity={0.25 - k * 0.06} />)}
        <Ventana x={2850} y={P - 230} w={110} h={100} luz="#ffd27a" prendida marco="#e9d8b8" />
        <rect x={3040} y={P - 200} width={110} height={200} fill="#4a2c1c" />
        <Halo x={2905} y={P - 180} r={220} color="#ffcf7a" fuerza={0.35 + hora * 0.4} />
      </g>
      {fogata && <Fogata x={ATARDECER_PUNTOS.fogata} y={P + 30} f={f} s={1.5} />}
      <Haces x={ATARDECER_PUNTOS.sol} y={solY} ang={60} largo={1600} n={5} ancho={110} color="#ffe6b0" fuerza={0.07 * (1 - hora)} f={f} seed={8} />
      <Charco x={ATARDECER_PUNTOS.sol} y={P + 30} rx={1400} color="#ffd59a" fuerza={0.22 * (1 - hora)} />
    </g>
  );
};
