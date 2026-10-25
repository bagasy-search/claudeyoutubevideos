import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Lam, PisoCapas, PISOS, CIVIL, LEGIO_ESC, CENTURION, GERMANO, ESPOSA, OFICIAL, Cartel, Papiro, Numero } from "./kit";
import { Act, camara, JURA, ALZA_ARMA, ESTOCADA, CARGA_HOMBRO } from "./actor";

export const Prueba: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const cam = camara(t, [[0, 0, -20, 120], [4, 0, -20, 160]], 5);
  return (
    <AbsoluteFill style={{ backgroundColor: "#d9c7a3" }}>
      <PisoCapas cam={cam} piso={PISOS.tierra} />
      <Lam D={1000} cam={cam} sombra>
        <Act t={t} a={{ look: CIVIL, ruta: [[0, -620]], poses: [[0, JURA]] }} />
        <Act t={t} a={{ look: { ...LEGIO_ESC, arma: "gladio" }, ruta: [[0, -330]], poses: [[0, ESTOCADA]] }} />
        <Act t={t} a={{ look: CENTURION, ruta: [[0, -40]], poses: [[0, ALZA_ARMA]], seed: 3 }} />
        <Act t={t} a={{ look: { ...LEGIO_ESC, furca: true, arma: "pilum", armaAng: 10 }, ruta: [[0, 230], [3, 330]], seed: 4 }} />
        <Act t={t} a={{ look: GERMANO, ruta: [[0, 500]], mira: -1, seed: 5 }} />
        <Act t={t} a={{ look: ESPOSA, ruta: [[0, 700]], mira: -1, seed: 6 }} />
        <Act t={t} a={{ look: OFICIAL, ruta: [[0, 880]], mira: -1, seed: 7 }} />
        <Cartel x={-200} y={-300} texto="25 YEARS" t={t} t0={0.5} sub="OF SERVICE" />
        <Papiro x={520} y={-260} w={420} t={t} t0={0.2} titulo="CONTRACT" lineas={[{ txt: "25 years of service", t: 0.5 }, { txt: "no wife", t: 0.9, tachar: 1.3 }]} />
        <Numero x={-650} y={-250} t={t} t0={0.3} a={0} b={300} pre="" suf=" DENARII" fs={80} />
      </Lam>
    </AbsoluteFill>
  );
};
