// tz01 completo: «The Monk the Buddha Sent to a Prostitute» — planos cortados sobre la voz (ver D:/rtmp/tz01_PLAN_MxM.md).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../anikit/montaje";
import * as A from "./planos1";
import * as B from "./planos2";
import * as C from "./planos3";

// [inicio en s, plano, transición de entrada]
const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mini], [2.0, A.P02Mano], [4.24, A.P03Uptown, { tipo: "fundido", d: 10 }], [8.4, A.P04Tres], [9.7, A.P05Pantalla], [13.68, A.P06Dia],
  [16.14, A.P07Vacio], [18.12, A.P08Pulgar], [19.42, A.P09Brillo], [21.0, A.P10Sombra], [24.54, A.P11UnaMas], [25.9, A.P12Catorce, { tipo: "luz", d: 12 }],
  [29.04, A.P13NoGrita], [32.22, A.P14Merece, { tipo: "luz", d: 10 }], [35.5, A.P15Silencio], [39.6, A.P16Wilson, { tipo: "fundido", d: 12 }], [43.5, A.P17NuncaCierra],
  [46.74, A.P18Cartel], [47.94, A.P19Cuarenta], [56.36, A.P20NoSolo], [58.26, A.P21Rincon], [66.5, A.P22Farol], [75.12, A.P23Toalla], [83.08, A.P24Sienta],
  [91.94, A.P25Comi], [94.28, A.P26Hambre], [98.86, A.P27Deja], [102.96, A.P28Secadora],
  [112.36, B.P29Cuenta], [115.0, B.P29Calle, { tipo: "luz", d: 14 }], [121.5, B.P30Amrapali, { tipo: "fundido", d: 10 }], [125.16, B.P31Titila, { tipo: "luz", d: 8 }],
  [127.6, B.P31Elefantes, { tipo: "luz", d: 14 }], [131.5, B.P32Mangos, { tipo: "fundido", d: 10 }], [136.84, B.P33Reyes], [141.02, B.P34Todos], [146.8, B.P35Monjes, { tipo: "fundido", d: 10 }],
  [154.0, B.P36Joven], [161.4, B.P37Lluvias], [168.5, B.P38Aliento], [171.04, B.P39Reverencia], [174.4, B.P40Arboleda, { tipo: "fundido", d: 12 }],
  [186.86, B.P41Murmullo], [191.38, B.P42Escandalo], [197.96, B.P43Pregunta], [204.62, B.P44Ve], [208.6, B.P45NoCreen],
  [210.98, C.P46Levanta, { tipo: "luz", d: 12 }], [216.98, C.P47Asiente], [219.52, C.P48Bar], [223.76, C.P49Sigue],
  [226.64, C.P50Semana1, { tipo: "luz", d: 14 }], [232.11, C.P51Semana2, { tipo: "fundido", d: 10 }], [239.01, C.P52Fuego], [246.25, C.P53Lluvia, { tipo: "fundido", d: 10 }], [250.35, C.P54Achica],
  [253.15, C.P55Corren, { tipo: "fundido", d: 10 }], [262.61, C.P56Espera], [265.33, C.P57Vuelve, { tipo: "fundido", d: 14 }], [273.85, C.P58Detras], [279.03, C.P59Arrodilla],
  [288.09, C.P60Monja, { tipo: "fundido", d: 10 }], [292.05, C.P61Poemas, { tipo: "fundido", d: 12 }],
  [300.95, C.P62Vuelta, { tipo: "luz", d: 14 }], [308.63, C.P63NoMonje], [314.37, C.P64Mira], [319.59, C.P65Sabia], [324.97, C.P66Fuerte], [327.95, C.P67Papel],
  [331.93, C.P68Mirar], [337.5, C.P69SinSonrisa], [347.31, C.P70Cuanto], [352.81, C.P71Menos], [359.79, C.P72Ola, { tipo: "fundido", d: 10 }], [367.01, C.P73Pantalla],
  [374.27, C.P74NoResponde], [378.19, C.P75BocaAbajo], [382.45, C.P76Sube], [389.17, C.P77Sesenta], [395.77, C.P78Baja], [405.81, C.P79Zumba], [408.25, C.P80Puerta],
  [416.67, C.P81Nombre], [423.91, C.P82Arroz], [428.33, C.P83Manana], [438.33, C.P84Cierra], [442.09, C.P85Dia1], [451.17, C.P86Cta, { tipo: "fundido", d: 14 }],
];
export const TZ01_FRAMES = 13818;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : TZ01_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

export const Tz01: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    {audio && <Audio src={staticFile("tz01.wav")} />}
  </AbsoluteFill>
);

// prueba suelta de un plano por nombre (stills)
const TODOS: Record<string, React.FC> = { ...(A as any), ...(B as any), ...(C as any) };
export const PruebaTz01: React.FC<{ n: string }> = ({ n }) => { const El = TODOS[n]; return <AbsoluteFill style={{ background: "#000" }}>{El ? <El /> : null}</AbsoluteFill>; };
