// lc01 completo: «If every human vanished, how long would TWO last?» — 57 planos sobre la voz (D:/rtmp/lc01_PLAN_MxM.md).
// El HUD va FUERA del montaje con cuadros globales: los contadores cambian justo en la palabra.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM, Trans } from "../../anikit/montaje";
import { MarcaCorto } from "../../anikit/pantalla";
import { Poblacion, Segundo } from "../hud";
import * as A from "./lc01_planos1";
import * as B from "./lc01_planos2";

const S = (t: number) => Math.round(t * 30);
const FUN = (d = 12): Trans => ({ tipo: "fundido", d });
const LUZ = (d = 14, color?: string): Trans => ({ tipo: "luz", d, color });

const CORTES: [number, React.FC, Trans?][] = [
  [0, A.P01Mini], [1.2, A.P02Despierta, LUZ(10, "#fff3d8")], [6.42, A.P03Radio], [9.18, A.P04Calle, FUN()], [15.06, A.P05Vereda], [16.38, A.P06Autos], [17.54, A.P07Ciudad],
  [18.76, A.P08Ocho, LUZ(12)], [23.14, A.P09Pregunta], [29.4, A.P10Real], [35.38, A.P11Cuenta, { tipo: "cortina", color: "#1d1624" }],
  [36.18, A.P12Hora, FUN(16)], [42.28, A.P13Theo], [50.7, A.P14Bus], [58.36, A.P15Superior], [63.52, A.P16Campera], [70.22, A.P17Grita],
  [72.7, A.P18Lugares], [77.54, A.P19Holiday], [82.6, A.P20Censo, FUN(16)], [95.7, A.P21Existe, LUZ(12)], [103.44, A.P22Luces], [109.19, A.P23Represa],
  [123.17, A.P24Semaforos], [129.83, A.P25Colina], [141.99, A.P26Ventana], [151.37, A.P27June, LUZ(12)], [162.59, A.P28Quedo], [169.31, A.P29Interruptor],
  [173.93, B.P30Lobby], [178.85, B.P31Pizarra], [183.97, B.P32Baja], [186.77, B.P33Dos], [191.73, B.P34Super, LUZ(12)], [201.37, B.P35Gondola],
  [215.13, B.P36Calorias], [221.69, B.P37Ciudad], [229.01, B.P38Fresco], [240.61, B.P39Regla1, { tipo: "cortina", color: "#1d1624" }], [246.37, B.P40Agua],
  [258.49, B.P41Lago], [265.17, B.P42Mata], [275.91, B.P43Chicas], [282.21, B.P44Dentista], [289.61, B.P45Regla2, { tipo: "cortina", color: "#1d1624" }],
  [299.43, B.P46Casa, LUZ(14)], [310.5, B.P47Nafta], [326.52, B.P48Lista], [339.96, B.P49Nieve, FUN(16)], [347.48, B.P50Menos30], [360.54, B.P51Helada],
  [365.98, B.P52Cuentas], [383.32, B.P53Puente, FUN(16)], [392.68, B.P54Apagon], [406.26, B.P55Vela], [410.22, B.P56Linea], [421.8, B.P57Cta, FUN(16)],
];
export const LC01_FRAMES = 13020;

const planos: PlanoM[] = CORTES.map(([t, El, trans], i) => {
  const a = S(t);
  const b = i + 1 < CORTES.length ? S(CORTES[i + 1][0]) : LC01_FRAMES;
  return { dur: b - a, el: <El />, trans };
});

// HUD global (cuadros del video entero)
const HudLc01: React.FC = () => (
  <>
    {/* cuadro 0 = la miniatura: 8B tachado sobre POPULATION: 2 */}
    <Poblacion claves={2} tachado="8,000,000,000" tachaF={-40} desde={-60} hasta={S(1.1)} grande y={78} />
    {/* el gancho: 8 mil millones → 2 */}
    <Poblacion claves={[{ f: 0, v: 8000000000 }, { f: S(20.4), v: 2, d: 40 }]} desde={S(1.25)} hasta={S(35.6)} tachado={undefined} />
    {/* la historia: POPULATION 1 (cuaderno) → 2 (June) */}
    <Poblacion claves={[{ f: 0, v: 1 }, { f: S(189.2), v: 2, d: 10 }]} desde={S(95.0)} />
    <Segundo claves={1} prefijo="DAY " icono="dia" desde={S(58.4)} hasta={S(95.0)} y={48} />
    <Segundo claves={[{ f: 0, v: 1 }, { f: S(132.3), v: 3, d: 10 }, { f: S(300.5), v: 10, d: 8 }, { f: S(302), v: 30, d: 120 }, { f: S(341.2), v: 33, d: 10 }, { f: S(383.4), v: 41, d: 16 }]} prefijo="DAY " icono="dia" desde={S(95.0)} y={186} />
    <MarcaCorto />
  </>
);

export const Lc01: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={planos} />
    <HudLc01 />
    {audio && <Audio src={staticFile("lc01.wav")} />}
  </AbsoluteFill>
);
