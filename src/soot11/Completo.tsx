import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { Mundo, Lejania, Llave, horaEn } from "./mundo";
import { Pueblo } from "./pueblo";
import { P0K, P0H, P0Mundo, P0Pant, abreCasaP0, espadaP0 } from "./P0";
import { P1K, P1H, P1Mundo, P1Pant } from "./P1";
import { P2K, P2H, P2Mundo, P2Pant } from "./P2";
import { P3K, P3H, P3Mundo, P3Pant } from "./P3";
import { P4K, P4H, P4Mundo, P4Pant } from "./P4";
import { P5K, P5H, P5Mundo, P5Pant } from "./P5";
import { P6K, P6H, P6Mundo, P6Pant } from "./P6";
import { P7K, P7H, P7Mundo, P7Pant } from "./P7";
import { P8K, P8H, P8Mundo, P8Pant } from "./P8";
import { Mini } from "./Mini";
import { HUD } from "./actores";

// soot11 completo: UN mundo (el pueblo) y UNA cámara que viaja por todo el video. Cada parte aporta sus llaves de
// cámara, sus horas del día, sus actores (en el mundo) y sus gráficos (en pantalla), todo en tiempo absoluto.
export const DUR_S = 915.2;
export const COMPLETO_DUR = Math.ceil(DUR_S * FPS);
type Parte = { a: number; b: number; K: Llave[]; H: [number, number][]; M: React.FC<{ t: number }>; S: React.FC<{ t: number }> };
const PARTES: Parte[] = [
  { a: 0, b: 62.5, K: P0K, H: P0H, M: P0Mundo, S: P0Pant },
  { a: 59.4, b: 162.0, K: P1K, H: P1H, M: P1Mundo, S: P1Pant },
  { a: 162.0, b: 270.3, K: P2K, H: P2H, M: P2Mundo, S: P2Pant },
  { a: 270.3, b: 375.3, K: P3K, H: P3H, M: P3Mundo, S: P3Pant },
  { a: 375.3, b: 445.8, K: P4K, H: P4H, M: P4Mundo, S: P4Pant },
  { a: 445.8, b: 537.85, K: P5K, H: P5H, M: P5Mundo, S: P5Pant },
  { a: 537.85, b: 645.14, K: P6K, H: P6H, M: P6Mundo, S: P6Pant },
  { a: 645.14, b: 729.23, K: P7K, H: P7H, M: P7Mundo, S: P7Pant },
  { a: 729.23, b: 916, K: P8K, H: P8H, M: P8Mundo, S: P8Pant },
];
export const KEYS: Llave[] = PARTES.flatMap((p) => p.K);
const HORAS: [number, number][] = PARTES.flatMap((p) => p.H);
const abreCasa = (t: number) => (t < 62 ? abreCasaP0(t) : 1);
const espada = (t: number) => (t < 62.5 ? espadaP0(t) : true);

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const hora = horaEn(HORAS, t);
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.7}>
        <Mundo t={t} keys={KEYS} horas={HORAS} lejos={<Lejania hora={hora} />}>
          <Pueblo abreCasa={abreCasa(t)} espada={espada(t)} />
          {PARTES.map((p, i) => (t >= p.a && t < p.b ? <p.M key={i} t={t} /> : null))}
        </Mundo>
      </CamaraMano>
      {PARTES.map((p, i) => (t >= p.a && t < p.b ? <p.S key={i} t={t} /> : null))}
      <HUD t={t} t0={10.5} t1={906} valor={t > 865.6 ? 1 : 0} tGolpe={[12.3, 186.0, 265.6, 865.6].filter((g) => g <= t).pop() ?? -9} y={24} />
      <Mini t={t} />
    </AbsoluteFill>
  );
};
