// ob03 completo: «Owen can't feel TIRED anymore» — 35 planos cortados sobre la voz (ver D:/rtmp/ob03_PLAN_MxM.md).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import * as A from "./planos";

const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mini], [1.0, A.P02Recap, { tipo: "luz", d: 8 }], [4.0, A.P03Palabras, { tipo: "fundido", d: 10 }], [9.0, A.P04Lunes, { tipo: "luz", d: 12, color: "#0e1430" }],
  [20.36, A.P05Espejo, { tipo: "cortina", color: "#1d1f24" }], [28.42, A.P06Semana, { tipo: "luz", d: 12 }], [32.98, A.P07Adenosina, { tipo: "fundido", d: 10 }], [56.28, A.P08NoSiente, { tipo: "fundido", d: 10 }],
  [61.78, A.P09Memoria, { tipo: "luz", d: 14 }], [72.62, A.P10Abernathy, { tipo: "cortina" }], [83.16, A.P11Lena, { tipo: "fundido", d: 12 }], [95.5, A.P12Noche, { tipo: "luz", d: 12, color: "#0e1430" }],
  [107.56, A.P13Martes, { tipo: "fundido", d: 10 }], [112.44, A.P14Parada, { tipo: "cortina" }], [123.62, A.P15Sentir, { tipo: "luz", d: 10 }], [147.82, A.P16Abrigo, { tipo: "fundido", d: 12 }],
  [161.97, A.P17Libreta, { tipo: "luz", d: 10 }], [176.49, A.P18Direccion, { tipo: "fundido", d: 12 }], [179.53, A.P19Rosa, { tipo: "fundido", d: 12 }], [189.05, A.P20Edificio, { tipo: "fundido", d: 12 }],
  [192.61, A.P21Grietas, { tipo: "luz", d: 14 }], [201.83, A.P22Caras, { tipo: "cortina" }], [209.45, A.P23PasaCafe, { tipo: "fundido", d: 10 }], [213.47, A.P24Hipocampo, { tipo: "luz", d: 10 }],
  [232.85, A.P25Escalera, { tipo: "fundido", d: 14, color: "#0e1430" }], [243.15, A.P26Glinfa, { tipo: "luz", d: 10 }], [266.11, A.P27Gardner, { tipo: "fundido", d: 10 }], [285.07, A.P28Leche, { tipo: "fundido", d: 14 }],
  [294.63, A.P29Sobre], [301.33, A.P30Factura, { tipo: "luz", d: 10 }], [314.45, A.P31Mijo, { tipo: "fundido", d: 12 }], [326.12, A.P32Mensaje, { tipo: "luz", d: 12, color: "#0e1430" }],
  [338.65, A.P33Duerme, { tipo: "fundido", d: 10 }], [348.25, A.P34Precios, { tipo: "luz", d: 14 }], [358.06, A.P35Cta, { tipo: "fundido", d: 12 }],
];
export const OB03_FRAMES = 11060;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : OB03_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

export const Ob03: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    {audio && <Audio src={staticFile("ob03.wav")} />}
  </AbsoluteFill>
);
