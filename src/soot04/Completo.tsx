import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { FPS } from "./kit";
import { CamCtx, camAt, CapaMundo, CapaLejos, Fondo, Olas, Submarino, palAt } from "./mundo";
import { Sol, Nube } from "./kit3";
import { bx, LugaresFijos, BarcoNuestro } from "./estado";
import type { Parte } from "./parte";
import { P0 } from "./P0";
import { P1 } from "./P1";
import { P2 } from "./P2";
import { P3 } from "./P3";
import { P4 } from "./P4";
import { P5 } from "./P5";
import { P6 } from "./P6";
import { P7 } from "./P7";
import { P8 } from "./P8";
import { Cuadro0 } from "./Cuadro0";
import { MostrarInsertos, Ins } from "./insertos";
import { INS_A } from "./ins_a";
import { INS_B } from "./ins_b";
import { INS_C } from "./ins_c";
import { INS_D } from "./ins_d";
import { Primerplano } from "./primerplano";

// Soot 04 completo: UN mundo, UNA cámara. Cada parte aporta sus claves de cámara, su paleta y lo que pone
// en el mundo (detrás de las olas / en el mundo / delante del agua) y en pantalla (hud). Tiempo absoluto.
export const COMPLETO_DUR = Math.ceil(901.8 * FPS);
const PARTES: Parte[] = [P0, P1, P2, P3, P4, P5, P6, P7, P8];
const KEYS = PARTES.flatMap((p) => p.keys).sort((a, b) => a.t - b.t);
const INSERTOS: Ins[] = [...INS_A, ...INS_B, ...INS_C, ...INS_D].sort((a, b) => a.a - b.a);
const PAL = PARTES.flatMap((p) => p.pal).sort((a, b) => a[0] - b[0]);

const LejosBase: React.FC<{ t: number; noche: boolean }> = ({ t, noche }) => (
  <>
    <Sol x={1300} y={-430} r={noche ? 80 : 110} col={noche ? "#fff6d8" : "#fff0b0"} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Nube key={i} x={i * 1500 - 3000 + ((t * 8) % 1500)} y={-560 - (i % 3) * 140} s={0.6 + (i % 3) * 0.25} col={noche ? "#4a3a88" : "#fff"} op={noche ? 0.5 : 0.85} />)}
  </>
);

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cam = camAt(KEYS, t, bx);
  const pal = palAt(PAL, t);
  const act = PARTES.filter((p) => t >= p.a - 1.5 && t < p.b + 1.5);
  const ult = PAL.filter((k) => k[0] <= t).slice(-1)[0]?.[1];
  const noche = ult === "noche" || ult === "abismo";
  const lejos = act.find((p) => p.lejos && t >= p.a && t < p.b)?.lejos;
  const sinBarco = act.some((p) => t >= p.a && t < p.b && p.sinBarco?.(t));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0820" }}>
      <CamaraMano intensidad={0.7}>
        <CamCtx.Provider value={{ cam, t }}>
          <Fondo pal={pal} />
          <CapaLejos f={0.22}>{lejos ? lejos(t) : <LejosBase t={t} noche={noche} />}</CapaLejos>
          <CapaMundo>
            <Submarino />
            {act.map((p, i) => <React.Fragment key={`f${i}`}>{p.fondo?.(t)}</React.Fragment>)}
            <Olas pal={pal} />
            <LugaresFijos t={t} />
            {!sinBarco && <BarcoNuestro t={t} />}
            {act.map((p, i) => <React.Fragment key={`m${i}`}>{p.mundo?.(t)}</React.Fragment>)}
            <Olas pal={pal} frente />
            {act.map((p, i) => <React.Fragment key={`d${i}`}>{p.frente?.(t)}</React.Fragment>)}
          </CapaMundo>
          <Primerplano t={t} lista={INSERTOS} />
          {act.map((p, i) => <React.Fragment key={`h${i}`}>{p.hud?.(t)}</React.Fragment>)}
          <MostrarInsertos t={t} lista={INSERTOS} />
        </CamCtx.Provider>
      </CamaraMano>
      <Cuadro0 t={t} />
    </AbsoluteFill>
  );
};
