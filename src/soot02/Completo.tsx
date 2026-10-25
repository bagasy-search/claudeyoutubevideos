import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS, Astro, Estrellas } from "./kit";
import { Lluvia } from "./kit2";
import { CieloMix, Nubes, Olas, climaEn, Clave } from "./mar";
import { Gancho } from "./Gancho";
import { P1 } from "./P1";
import { P2 } from "./P2";
import { P3 } from "./P3";
import { P4 } from "./P4";
import { P5 } from "./P5";
import { P6 } from "./P6";
import { P7 } from "./P7";

// soot02 «Why Rowing on a Roman Warship Was a Death Trap» — video completo (908,7 s).
// Debajo de TODO vive el MUNDO: cielo + sol/luna + nubes + mar, que cambia de hora y de clima por keyframes y nunca corta.
// Las escenas con fondo="none" dejan verlo; las de interior (el casco, el mapa, la carta) lo tapan.
export const COMPLETO_DUR = Math.ceil(909.6 * FPS);
export const CLIMA: Clave[] = [
  [0, "noche", 0.3], [12.2, "tormenta", 1], [27.6, "tormenta", 1], [28.3, "dia", 0.25], [49, "dia", 0.2],
  [70, "dia", 0.2], [72.5, "tormenta", 0.9], [74.2, "tormenta", 0.9], [76, "dia", 0.25],
  [313, "dia", 0.2], [316.5, "noche", 0.3], [322.6, "noche", 0.3], [326, "tarde", 0.25], [334, "tarde", 0.3], [338.6, "tormenta", 0.9], [341.4, "tormenta", 0.9], [343.5, "dia", 0.25],
  [648.6, "dia", 0.25], [651.4, "tormenta", 1],
  [665, "tormenta", 0.6], [667, "tarde", 0.45], [673, "tarde", 0.5], [674.5, "tormenta", 1], [711, "tormenta", 0.9], [713, "dia", 0.3], [715, "dia", 0.3], [716.3, "tormenta", 1],
  [718.3, "tormenta", 1], [720.3, "dia", 0.3], [735.3, "dia", 0.3], [736.6, "tormenta", 1], [752.8, "tormenta", 1], [761.4, "tormenta", 0.9], [764.3, "dia", 0.2],
  [775.5, "dia", 0.2], [778.5, "ceniza", 0.5], [796.8, "ceniza", 0.5],
  [799.5, "tarde", 0.25], [801.5, "dia", 0.2], [880, "dia", 0.2], [884.5, "tarde", 0.25], [898, "tarde", 0.25], [901, "alba", 0.3],
];
const PARTES: [number, number, React.FC<{ t: number }>][] = [[0, 49.6, Gancho], [49.2, 212.1, P1], [211.7, 341.9, P2], [341.3, 442.5, P3], [442.0, 538.4, P4], [537.9, 653.3, P5], [652.5, 798.3, P6], [797.4, 910, P7]];

export const Mundo: React.FC<{ t: number }> = ({ t }) => {
  const m = climaEn(t, CLIMA);
  return (
    <AbsoluteFill>
      <CieloMix c={m.cielo} />
      {m.noche > 0.05 && <div style={{ opacity: m.noche, position: "absolute", inset: 0 }}><Estrellas t={t} n={60} seed={7} alto={520} /></div>}
      <div style={{ opacity: Math.max(0, 1 - m.noche - m.ola * 0.6), position: "absolute", inset: 0 }}><Astro x={1500} y={300} r={80} /></div>
      {m.noche > 0.3 && m.ola < 0.6 && <div style={{ opacity: m.noche, position: "absolute", inset: 0 }}><Astro x={420} y={220} r={60} luna /></div>}
      <Nubes t={t} n={6} seed={3} color={m.ola > 0.6 ? "#3a3d5e" : "#fff"} op={m.ola > 0.6 ? 0.9 : 0.7 * (1 - m.noche * 0.6)} vel={14 + m.ola * 60} alto={360} />
      <Olas t={t} y0={780} ola={m.ola} capas={4} noche={m.noche} />
      {m.ola > 0.7 && <div style={{ opacity: (m.ola - 0.7) / 0.3, position: "absolute", inset: 0 }}><Lluvia t={t} n={140} angulo={24} op={0.5} /></div>}
    </AbsoluteFill>
  );
};

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.8}>
        <Mundo t={t} />
        {PARTES.map(([a, b, P], i) => (t >= a && t < b ? <P key={i} t={t} /> : null))}
      </CamaraMano>
    </AbsoluteFill>
  );
};
