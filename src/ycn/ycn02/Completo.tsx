// ycn02 completo: «Someone Is Knocking From Inside The Freezer (Day 9)» — 100 planos cortados sobre la voz (ver D:/rtmp/ycn02_PLAN_MxM.md).
// Muda: el farm mezcla ycn02_mix.wav (voz + foley + pad) en encfin.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import * as A from "./planos1";
import * as B from "./planos2";

const F = (d = 10): Trans => ({ tipo: "fundido", d });
const L = (d = 10, color?: string): Trans => ({ tipo: "luz", d, ...(color ? { color } : {}) });
// [inicio en s, plano, transición de entrada]
const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Manija], [2.08, A.P02Tres], [4.2, A.P03Golpes], [9.98, A.P04Para], [13.34, A.P05Resumen, F(10)], [18.4, A.P06Cinco], [22.62, A.P07Cal, { tipo: "barrido" }],
  [24.22, A.P08Nell], [27.38, A.P09Dot], [28.9, A.P10Marlon], [32.74, A.P11Primera, F(8)], [36.66, A.P12Edades, F(10)], [40.7, A.P13Nueve], [44.98, A.P14Luz, L(10, "#ffd38a")],
  [49.12, A.P15Marcador], [52.92, A.P16Ritual], [56.52, A.P17Cta, F(10)], [61.7, A.P18Pregunta, { tipo: "cortina" }], [66.04, A.P19Desayuno, F(10)], [71.94, A.P20Recuento], [81.36, A.P21Golosinas],
  [83.7, A.P22Mira], [85.26, A.P23Regla], [94.0, A.P24Mitad], [97.88, A.P25Cuenta], [101.52, A.P26Cuatro], [106.3, A.P27Sabia], [109.39, A.P28Comida, { tipo: "cortina" }],
  [117.8, A.P29Perilla], [123.47, A.P30Gus, F(10)], [130.23, A.P31Chili, F(8)], [132.1, A.P32Plata], [134.4, A.P33Papas], [141.23, A.P34Culpa, F(10)], [145.55, A.P35Apoya],
  [153.01, A.P36Peor], [154.77, A.P37Educacion], [160.59, A.P38Primavera, F(12)], [162.41, A.P39Idea, F(10)], [167.41, A.P40Ruido], [169.15, A.P41Siguen, F(8)], [175.45, A.P42Sonido, F(8)],
  [178.79, B.P43Explica, { tipo: "cortina" }], [184.93, B.P44Auto], [188.25, B.P45Pozo], [191.81, B.P46Rastrillo], [193.37, B.P47Cinta], [196.19, B.P48Vuelve], [197.81, B.P49Torreta],
  [206.17, B.P50Ruido], [212.57, B.P51Pista16, F(8)], [216.23, B.P52Una], [218.57, B.P53Ruta], [226.15, B.P54Hondo], [227.99, B.P55Barra], [234.19, B.P56Puerta, { tipo: "barrido" }],
  [235.88, B.P57Nell], [237.44, B.P58Cuarenta], [242.2, B.P59Lorraine], [247.88, B.P60Marlon], [251.62, B.P61Hombro], [254.91, B.P62Saco], [260.0, B.P63Raro],
  [263.81, B.P64Espera, F(12)], [265.61, B.P65Toc], [268.4, B.P66Llave], [271.44, B.P67Tren], [274.64, B.P68Senal], [277.61, B.P69Tiro], [279.32, B.P70Frio],
  [282.87, B.P71Lento], [289.12, B.P72Chomba], [295.11, B.P73Hacia], [299.79, B.P74Freidora], [307.0, B.P75Rugia], [310.9, B.P76Ahi], [313.0, B.P77Clic],
  [318.7, B.P78Grito], [324.31, B.P79Ella], [328.5, B.P80Otra], [335.74, B.P81Alfombra], [342.2, B.P82Madera], [348.54, B.P83Clang], [353.78, B.P84Salvo, F(12)],
  [357.48, B.P85Fuerte], [362.06, B.P86Entramos, F(10)], [366.56, B.P87Conteo], [377.26, B.P88Cuenta, F(8)], [384.3, B.P89Delantal, { tipo: "cortina" }], [388.56, B.P90Llave], [393.34, B.P91Basura, F(10)],
  [398.72, B.P92Mano, F(8)], [403.96, B.P93Helado, L(12, "#ffd38a")], [408.92, B.P94Risa], [412.18, B.P95Manga], [418.4, B.P96Venda], [423.92, B.P97Dedo], [428.72, B.P98Comentarios, F(12)],
  [432.34, B.P99Nueve, F(10)], [439.0, B.P100Final, F(16)],
];
export const YCN02_FRAMES = 449 * 30;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : YCN02_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

export const Ycn02: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
  </AbsoluteFill>
);
