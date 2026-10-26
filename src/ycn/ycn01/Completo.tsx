// ycn01 completo: «5 Strangers, 1 Bowling Alley, 30 Days (Day 1)» — 80 planos cortados sobre la voz (ver D:/rtmp/ycn01_PLAN_MxM.md).
// Muda: el farm mezcla ycn01_mix.wav (voz + foley + pad) en encfin.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import * as A from "./planos1";
import * as B from "./planos2";

const F = (d = 10): Trans => ({ tipo: "fundido", d });
const L = (d = 10, color?: string): Trans => ({ tipo: "luz", d, ...(color ? { color } : {}) });
// [inicio en s, plano, transición de entrada]
const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mano], [3.7, A.P02Cadena], [11.58, A.P03Agarra], [18.04, A.P04Fachada], [22.36, A.P05Ruta, F(10)], [27.4, A.P06Sala, L(10)], [31.5, A.P07Snack],
  [33.88, A.P08Rafi], [42.42, A.P09Martes, F(8)], [45.68, A.P10PinPals], [52.68, A.P11Dot], [58.3, A.P12Enfermera], [63.82, A.P13Rota, { tipo: "barrido" }], [67.86, A.P14Cal, { tipo: "cortina" }],
  [74.78, A.P15Parche], [79.74, A.P16Nell, { tipo: "cortina" }], [91.12, A.P17Papas], [96.72, A.P18Ana, F(10)], [103.3, A.P19Ocho], [108.74, A.P20Lluvia, F(8)], [115.32, A.P21Marlon, L(10)],
  [122.92, A.P22Chief], [130.48, A.P23Cinco, F(10)], [140.04, A.P24Cta, F(12)], [152.12, A.P25Golpe], [153.44, A.P26Tv, L(8, "#2a4aff")], [165.96, A.P27Nadie], [168.76, A.P28Sirenas],
  [172.78, A.P29Clic], [176.2, A.P30Mama], [188.52, A.P31Estatica], [193.52, A.P32Primavera, F(10)], [195.3, B.P33Sabia], [198.9, B.P34Entra, F(8)], [205.8, B.P35Toalla], [211.7, B.P36Cuenta],
  [215.8, B.P37Banco], [220.9, B.P38Cara], [226.46, B.P39Susurra], [232.91, B.P40Levanto], [241.13, B.P41Once], [244.83, B.P42Despacio], [249.39, B.P43Ruido], [256.81, B.P44Grito],
  [260.83, B.P45Puertas], [269.19, B.P46Waffle], [274.75, B.P47Nombre], [277.85, B.P48Cal], [282.95, B.P49Persiana, F(8)], [288.53, B.P50Tira], [291.41, B.P51Grita], [296.27, B.P52Walkie],
  [303.87, B.P53Tiro], [311.07, B.P54Metal], [314.33, B.P55Rueda], [323.11, B.P56Bien], [328.07, B.P57Golpes], [334.51, B.P58Palanca, { tipo: "cortina" }], [338.65, B.P59Paran], [344.2, B.P60Silencio, F(12)],
  [347.6, B.P61SeVan, F(10)], [351.41, B.P62Regla1, F(12)], [356.0, B.P63Regla2, F(10)], [361.3, B.P64Cuento], [369.4, B.P65Cuento2], [376.2, B.P66Freezer, { tipo: "cortina" }], [384.23, B.P67Tiza, F(10)],
  [386.91, B.P68Raya], [396.77, B.P69Mira], [401.91, B.P70DayOne], [408.3, B.P71Lado], [410.6, B.P72Tres, F(16)], [414.75, B.P73Toc], [419.95, B.P74Frio, { tipo: "cortina" }], [427.13, B.P75Ley, F(10)],
  [433.49, B.P76Vivo], [439.71, B.P77NoPodia], [441.1, B.P78Gus, L(14, "#ffd38a")], [451.21, B.P79Uno, L(10, "#0b0a0c")], [456.5, B.P80Final, F(16)],
];
export const YCN01_FRAMES = 466 * 30;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : YCN01_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

export const Ycn01: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
  </AbsoluteFill>
);
