import React from "react";
import { AbsoluteFill } from "remotion";
import { ent } from "./kit";
import { Trampas } from "./kit2";
import { Apion, Act } from "./actor";
import { Pancarta, IconoTrampa } from "./mar";

// Placa de capítulo de cada trampa: set propio con foco de luz, el ícono gigante de la trampa,
// la fila de las 7 trampas y Apion actuando sobre el piso iluminado (no el barco + baranda de siempre).
const TONO: Record<number, [string, string]> = {
  1: ["#5a3fc0", "#160f30"], 2: ["#a0602c", "#22120a"], 3: ["#b0402a", "#260d0a"], 4: ["#c08a20", "#261a06"],
  5: ["#2a8a9a", "#071c22"], 6: ["#3a4a9a", "#0a0c24"], 7: ["#3a9a4a", "#0a2410"],
};
export const TituloTrampa: React.FC<{ t: number; t0: number; n: number; titulo: string; acts: [number, Act][] }> = ({ t, t0, n, titulo, acts }) => {
  const [luz, fondo] = TONO[n];
  const e = ent(t, t0 + 0.12, 0, { damping: 11, stiffness: 140 });
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 38% 42%, ${luz}, ${fondo} 72%)` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <polygon points="560,0 760,0 1020,900 300,900" fill="#fff" opacity={0.06} />
        <polygon points="1360,0 1500,0 1700,920 1160,920" fill="#fff" opacity={0.05} />
        <ellipse cx={660} cy={900} rx={520} ry={70} fill="#000" opacity={0.35} />
        <ellipse cx={1430} cy={915} rx={300} ry={46} fill="#000" opacity={0.35} />
        <circle cx={640} cy={620} r={230 * e} fill={luz} opacity={0.45} />
        <g transform={`translate(640 620) scale(${3.2 * e}) rotate(${Math.sin(t * 1.6) * 5})`}><IconoTrampa n={n} /></g>
      </svg>
      <Pancarta t={t} t0={t0 + 0.05} n={n} titulo={titulo} x={960} y={290} />
      <Trampas t={t} t0={t0 + 0.3} n={n} x={1300} y={980} />
      <Apion t={t} t0={t0 + 0.1} x={1430} y={915} h={430} desde="nada" viejo={n === 7} acts={acts} />
    </>
  );
};
