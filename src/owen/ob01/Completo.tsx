// ob01 completo: «Owen wakes up and sees everyone's REAL age» — 46 planos cortados sobre la voz (ver D:/rtmp/ob01_PLAN_MxM.md).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import * as A from "./planos1";
import * as B from "./planos2";

// [inicio en s, plano, transición de entrada]
const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mini], [0.8, A.P02Rebobina], [1.9, A.P03Despierta, { tipo: "luz", d: 10, color: "#0e1430" }], [6.2, A.P04Fachada, { tipo: "fundido", d: 12 }],
  [9.5, A.P05Rosa, { tipo: "fundido", d: 12 }], [14.9, A.P06Baja], [17.9, A.P07Numero], [27.7, A.P08Taza], [31.2, A.P09Espejo, { tipo: "cortina", color: "#1d1f24" }],
  [39.7, A.P10Halden, { tipo: "luz", d: 18 }], [57.2, A.P11Semana, { tipo: "luz", d: 14 }], [60.5, A.P12DosEdades], [66.4, A.P13Adn, { tipo: "fundido", d: 10 }], [80.9, A.P14NoCoinciden],
  [88.7, A.P15Garaje, { tipo: "luz", d: 14 }], [96.8, A.P16Ruta, { tipo: "fundido", d: 12 }], [103.8, A.P17Tiny], [106.2, A.P18Puertas, { tipo: "cortina" }], [110.9, A.P19Suben], [123.4, A.P20Cuentas],
  [128.5, B.P21Abernathy], [141.9, B.P22Rie], [145.0, B.P23Agarre, { tipo: "luz", d: 12 }], [159.3, B.P24Manos, { tipo: "luz", d: 12 }], [164.6, B.P25Cafe], [169.3, B.P26Fumador, { tipo: "cortina" }],
  [179.5, B.P26bEspejo], [182.2, B.P27Lena, { tipo: "fundido", d: 12 }], [199.7, B.P28Caminan, { tipo: "fundido", d: 12 }], [206.8, B.P29Velocidad, { tipo: "luz", d: 12 }], [215.7, B.P30SuDia, { tipo: "fundido", d: 10 }],
  [227.4, B.P31Mediodia, { tipo: "luz", d: 12 }], [236.2, B.P32Soledad, { tipo: "luz", d: 12 }], [244.8, B.P33Solo, { tipo: "luz", d: 12 }], [250.2, B.P34Abrigo, { tipo: "cortina" }], [262.9, B.P35Pulsera],
  [275.4, B.P36Tiembla], [277.9, B.P37Casa, { tipo: "fundido", d: 14 }], [283.1, B.P38Rosa, { tipo: "fundido", d: 12 }], [311.9, B.P39Dee, { tipo: "fundido", d: 16 }], [331.2, B.P40SeMueven, { tipo: "luz", d: 12 }],
  [337.8, B.P41Lista, { tipo: "fundido", d: 10 }], [346.8, B.P42Escalera, { tipo: "luz", d: 12, color: "#0e1430" }], [361.6, B.P43Mensaje, { tipo: "fundido", d: 10 }], [378.8, B.P44Ventana, { tipo: "fundido", d: 12 }],
  [385.0, B.P45Baterias, { tipo: "luz", d: 14 }], [396.8, B.P46Cta, { tipo: "fundido", d: 12 }],
];
export const OB01_FRAMES = 12250;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = Math.round(t * 30);
  const b = i + 1 < CORTES.length ? Math.round(CORTES[i + 1][0] * 30) : OB01_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

export const Ob01: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    {audio && <Audio src={staticFile("ob01.wav")} />}
  </AbsoluteFill>
);
