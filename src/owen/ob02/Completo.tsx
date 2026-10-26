// ob02 completo: «Owen sees everyone's BATTERY» — 40 planos cortados sobre la voz (ver D:/rtmp/ob02_PLAN_MxM.md).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import * as A from "./planos";

const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mini], [1.0, A.P02SemanaPasada, { tipo: "luz", d: 8 }], [2.62, A.P03Despierta, { tipo: "luz", d: 10, color: "#0e1430" }], [5.5, A.P04Rosa, { tipo: "fundido", d: 12 }],
  [17.42, A.P05Espejo, { tipo: "cortina", color: "#1d1f24" }], [26.04, A.P06Semana, { tipo: "luz", d: 14 }], [35.86, A.P07Combustible, { tipo: "fundido", d: 10 }], [53.04, A.P08Adenosina, { tipo: "fundido", d: 10 }],
  [66.2, A.P09Tiny, { tipo: "luz", d: 14 }], [79.64, A.P10Ruta, { tipo: "fundido", d: 12 }], [81.56, A.P11Muro, { tipo: "cortina" }], [91.9, A.P12Scrubs], [98.52, A.P13Lata, { tipo: "fundido", d: 8 }],
  [104.86, A.P14Capa, { tipo: "luz", d: 10 }], [114.11, A.P15Receptores, { tipo: "fundido", d: 10 }], [123.14, A.P16MedioVida, { tipo: "fundido", d: 10 }], [132.57, A.P17Abernathy, { tipo: "luz", d: 12 }],
  [146.69, A.P18Cafe, { tipo: "fundido", d: 12 }], [159.84, A.P19Lena], [173.28, A.P20Quieto, { tipo: "fundido", d: 12 }], [178.25, A.P21Caida, { tipo: "luz", d: 10 }], [192.07, A.P22Bajon, { tipo: "fundido", d: 10 }],
  [202.99, A.P23Chofer, { tipo: "luz", d: 10 }], [209.33, A.P24Choques, { tipo: "fundido", d: 10 }], [219.39, A.P25Alcohol, { tipo: "fundido", d: 10 }], [228.75, A.P26Abrigo, { tipo: "cortina" }], [239.33, A.P27Cien],
  [251.51, A.P28Suya, { tipo: "fundido", d: 12 }], [259.49, A.P29Deriva], [265.35, A.P30Frena], [269.13, A.P31Micro, { tipo: "luz", d: 10 }], [277.77, A.P32Siesta, { tipo: "fundido", d: 12 }],
  [289.33, A.P33Nasa, { tipo: "luz", d: 10 }], [307.43, A.P34Despacio, { tipo: "fundido", d: 12 }], [311.79, A.P35Rosa, { tipo: "fundido", d: 14 }], [329.99, A.P36Mensaje, { tipo: "luz", d: 12, color: "#0e1430" }],
  [348.31, A.P37Piensa, { tipo: "fundido", d: 10 }], [355.67, A.P38Escribe, { tipo: "fundido", d: 10 }], [359.51, A.P39Gancho, { tipo: "luz", d: 14 }], [372.91, A.P40Cta, { tipo: "fundido", d: 12 }],
];
export const OB02_FRAMES = 11460;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : OB02_FRAMES;
  return { dur: b - a, el: <El /> }; // corte seco siempre (OJO DEL DIRECTOR v1: fundidos = fantasmas y flashes)
});

export const Ob02: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    {audio && <Audio src={staticFile("ob02.wav")} />}
  </AbsoluteFill>
);
