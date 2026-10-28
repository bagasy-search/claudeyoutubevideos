// tz02 completo: «The Prince Who Had Never Seen a Phone» — planos cortados sobre la voz (ver D:/rtmp/tz02_PLAN_MxM.md).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../anikit/montaje";
import * as A from "./planos1";
import * as B from "./planos2";

// [inicio en s, plano, transición de entrada]
const CORTES: [number, React.FC, Trans?][] = [
  [0, A.Q01Mini], [2.0, A.Q02Palacio, { tipo: "fundido", d: 10 }], [7.1, A.Q03Bolsillo], [10.14, A.Q04Dia2, { tipo: "fundido", d: 10 }], [15.72, A.Q05Entra],
  [23.38, A.Q06YaEsta], [30.92, A.Q07Mandarina], [38.5, A.Q08Viniste], [41.86, A.Q09Mano], [45.18, A.Q10NoWay], [48.4, A.Q11Necesito], [51.56, A.Q12UnaNoche],
  [59.98, A.Q13Estira], [64.6, A.Q14NoSelo], [69.3, A.Q15Titila],
  [72.66, A.Q16Kapila, { tipo: "luz", d: 14, fuerza: 0.5 }], [77.56, A.Q17Rey], [80.68, A.Q18Bebe], [83.48, A.Q19Asita], [90.56, A.Q20PorQue], [95.22, A.Q21DosCosas],
  [104.18, A.Q22Sufrimiento], [108.96, A.Q23Decision], [113.67, A.Q24TresPalacios, { tipo: "fundido", d: 10 }], [119.01, A.Q25Musicos], [126.1, A.Q26SinViejos],
  [128.75, A.Q27Noche, { tipo: "fundido", d: 10 }], [134.03, A.Q28Crece, { tipo: "fundido", d: 10 }], [139.03, A.Q29Princesa], [142.7, A.Q30Aburrido],
  [147.75, A.Q31Callado, { tipo: "luz", d: 12, fuerza: 0.5 }], [150.67, A.Q32Feed], [153.59, A.Q33Gajo], [157.35, A.Q34Algoritmo], [166.13, A.Q35Scroll], [170.33, A.Q36Feliz],
  [174.47, A.Q37NoContesta], [176.09, A.Q38Contador], [183.87, A.Q39Entrega], [189.99, A.Q40Negro], [191.61, A.Q41Sisea], [194.67, A.Q42Cero],
  [198.07, B.Q43Ruega, { tipo: "luz", d: 14, fuerza: 0.5 }], [206.33, B.Q44Ordena], [217.0, B.Q45Cuatro], [219.0, B.Q46Viejo], [225.49, B.Q47QueLePasa], [228.01, B.Q48Viejo],
  [232.55, B.Q49ATodos], [235.71, B.Q50ATi],
  [238.65, B.Q51Camina, { tipo: "luz", d: 12, fuerza: 0.5 }], [245.63, B.Q52Parada], [252.61, B.Q53Manos], [254.99, B.Q54NuncaLoVio],
  [259.61, B.Q55Enfermo, { tipo: "luz", d: 12, fuerza: 0.5 }], [264.19, B.Q56Laptop, { tipo: "fundido", d: 12 }], [271.93, B.Q57Diane], [280.99, B.Q58Diecinueve],
  [283.43, B.Q59Funeral, { tipo: "luz", d: 12, fuerza: 0.5 }], [289.73, B.Q60Bici, { tipo: "fundido", d: 12 }], [309.2, B.Q61ComoLaSuya], [310.69, B.Q62Parado],
  [313.2, B.Q63Monje, { tipo: "luz", d: 14, fuerza: 0.5 }], [325.01, B.Q64Quien], [326.63, B.Q65Dejo], [331.13, B.Q66Jaula, { tipo: "fundido", d: 12 }], [339.88, B.Q67Sale],
  [343.78, B.Q68Dia3, { tipo: "fundido", d: 12 }], [346.38, B.Q69Toalla], [352.16, B.Q70Tiende], [357.12, B.Q71Ochenta], [358.96, B.Q72NoAgarra], [360.32, B.Q73Vi],
  [371.1, B.Q74Hermoso], [379.96, B.Q75Lago], [382.58, B.Q76Porton], [395.1, B.Q77Agarra], [398.2, B.Q78Llama],
  [408.52, B.Q79Dia4, { tipo: "fundido", d: 12 }], [412.88, B.Q80Noche], [423.72, B.Q81Premio], [427.52, B.Q82Agarra], [429.34, B.Q83Cta, { tipo: "fundido", d: 14 }],
];
export const TZ02_FRAMES = 13290;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : TZ02_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

export const Tz02: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    {audio && <Audio src={staticFile("tz02.wav")} />}
  </AbsoluteFill>
);

// prueba suelta de un plano por nombre (stills)
const TODOS: Record<string, React.FC> = { ...(A as any), ...(B as any) };
export const PruebaTz02: React.FC<{ n: string }> = ({ n }) => { const El = TODOS[n]; return <AbsoluteFill style={{ background: "#000" }}>{El ? <El /> : null}</AbsoluteFill>; };
