// lc02 completo: «Can TWO people survive the first winter alone?» — 80 planos sobre la voz (D:/rtmp/lc02_PLAN_MxM.md).
// HUD fuera del montaje con cuadros globales: °F y DAY cambian en el CORTE de plano (ojo v2: nunca a mitad de plano); POPULATION en la palabra.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import { MarcaCorto } from "../../anikit/pantalla";
import { FRIO, Poblacion, Segundo } from "../hud";
import * as A from "./lc02_planos1";
import * as B from "./lc02_planos2";

const S = (t: number) => Math.round(t * 30);
const FUN = (d = 12): Trans => ({ tipo: "fundido", d });
const LUZ = (d = 14, color?: string): Trans => ({ tipo: "luz", d, color });
const CORT: Trans = { tipo: "cortina", color: "#1d1624" };

const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mini], [0.98, A.P02Enero, LUZ(10, "#eef4ff")], [2.98, A.P03Termo], [5.24, A.P04SinLuz], [7.26, A.P05Nadie], [10.38, A.P06Cuarto],
  [15.48, A.P07Dia41, LUZ(10)], [18.26, A.P08Comida], [23.12, A.P09Pregunta], [28.52, A.P10Cuenta, CORT], [29.58, A.P11Puertas, FUN(10)],
  [39.4, A.P12Plastico], [43.58, A.P13Corte], [49.44, A.P14Inventario], [59.16, A.P15Lenia], [62.02, A.P16Cuerdas], [66.82, A.P17Cuerda],
  [71.4, A.P18Noviembre, FUN(10)], [74.62, A.P19Liniero], [79.5, A.P20Regla, CORT], [83.64, A.P21DeADos], [87.56, A.P22Bosque], [93.14, A.P23Seca],
  [99.09, A.P24DosEstufas], [103.65, A.P25Pila], [107.97, A.P26Frio, FUN(14)], [112.69, A.P27Bajo], [119.15, A.P28Piel], [122.81, A.P29Canios],
  [130.67, A.P30Capas], [139.13, A.P31Salida], [146.95, A.P32Invisible], [151.73, A.P33Parrilla], [161.17, A.P34Ferreteria], [164.5, A.P35Alarmas],
  [167.57, A.P36Grita], [170.81, A.P37Hollin], [172.69, A.P38Nieve], [178.53, A.P39Nueve], [182.89, A.P40Dia83, FUN(14)],
  [188.05, B.P41Reloj, FUN(10)], [194.41, B.P42Torre], [198.48, B.P43Fecha], [199.6, B.P44Cena, LUZ(12)], [204.38, B.P45Navidad, FUN(12)],
  [208.1, B.P46Diente, FUN(16)], [216.08, B.P47Sabe], [220.54, B.P48Absceso], [225.16, B.P49Cabeza], [230.4, B.P50Dentista], [233.98, B.P51Farmacia],
  [237.38, B.P52Tormenta], [242.14, B.P53Frasco], [252.28, B.P54Pinzas], [259.28, B.P55Vela], [263.32, B.P56Nieve],
  [271.3, B.P57Sonrie, LUZ(14)], [276.84, B.P58Silencio, FUN(16)], [284.2, B.P59Antartida], [293.5, B.P60Mirada], [298.89, B.P61Nadie],
  [300.87, B.P62Regla3, CORT], [305.89, B.P63Lee], [308.35, B.P64Pulso], [310.41, B.P65Cartas], [311.67, B.P66Caminan, LUZ(12)], [316.23, B.P67Hielo],
  [322.53, B.P68Lago], [328.39, B.P69Sol, LUZ(16, "#fff3d8")], [335.45, B.P70Ultima], [339.97, B.P71Abrazo], [343.93, B.P72Escaner, FUN(14)],
  [352.63, B.P73Estatica], [357.97, B.P74Voz], [362.09, B.P75Gus], [368.57, B.P76Ventana], [375.19, B.P77Agarra],
  [378.75, B.P78Tres], [382.59, B.P79Cta, CORT], [391.05, B.P80Next, CORT],
];
export const LC02_FRAMES = 11830;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = S(t);
  const b = i + 1 < CORTES.length ? S(CORTES[i + 1][0]) : LC02_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

const HudLc02: React.FC = () => (
  <>
    {/* cuadro 0 = la miniatura: −30°F arriba a la izquierda + POPULATION: 2 */}
    <Segundo claves={[{ f: 0, v: -30 }, { f: S(2.98), v: -28, d: 1 }, { f: S(119.15), v: -31, d: 1 }, { f: S(172.69), v: -20, d: 1 }, { f: S(182.89), v: -12, d: 1 }, { f: S(208.1), v: -15, d: 1 }, { f: S(271.3), v: -8, d: 1 }, { f: S(328.39), v: 18, d: 1 }]}
      sufijo="°F" icono="temp" color={FRIO} y={122} desde={-60} signo />
    <Segundo claves={[{ f: 0, v: 41 }, { f: S(29.58), v: 42, d: 1 }, { f: S(103.65), v: 60, d: 1 }, { f: S(182.89), v: 83, d: 1 }, { f: S(208.1), v: 90, d: 1 }, { f: S(271.3), v: 100, d: 1 }, { f: S(328.39), v: 130, d: 1 }]}
      prefijo="DAY " icono="dia" y={196} desde={S(15.5)} />
    <Poblacion claves={[{ f: 0, v: 2 }, { f: S(381.45), v: 3, d: 8 }]} desde={-60} />
    <MarcaCorto />
  </>
);

export const Lc02: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    <HudLc02 />
    {audio && <Audio src={staticFile("lc02.wav")} />}
  </AbsoluteFill>
);
