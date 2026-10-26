import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, Escena, prog } from "./kit";
import { Persona, CENTURION, CIVIL } from "./persona";
import { Campamento, CarpaInterior, PlazaArmas, PuertaPretoria, Valle, Bosque, Multitud, EnMano, pose } from "./kit3";

// Muestrario del arte base v5 (sólo para stills de revisión): cada 3 s un set/rig nuevo.
export const MUESTRARIO_DUR = 36 * FPS;
const Banco: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 260 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - 130, overflow: "visible" }} width={w} height={130}>
    <ellipse cx={w / 2 - 30} cy={128} rx={w / 2 + 20} ry={12} fill="#1d0f33" opacity={0.2} />
    <rect x={10} y={0} width={w - 20} height={26} rx={8} fill="#a8622c" /><rect x={30} y={20} width={20} height={110} fill="#6b3a1f" /><rect x={w - 50} y={20} width={20} height={110} fill="#6b3a1f" />
  </svg>
);

export const Muestrario: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const E = (k: number, n: React.ReactNode) => <Escena t={t} t0={k * 3} t1={k * 3 + 2.66} entra="corte" zoom={0.01}>{n}</Escena>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {E(0, <>
        <Campamento t={t} tropa={false} />
        <Banco x={1480} y={1030} />
        <Persona x={330} y={1040} h={520} t={t} seed={1} casco="legion" expr="feliz" />
        <Persona x={720} y={1040} h={540} t={t} seed={2} ropa={CENTURION} casco="centurion" giro="34" expr="enojado" bD={95} cD={5} />
        <Persona x={1100} y={1040} h={500} t={t} seed={3} ropa={CIVIL(1)} giro="perfil" camina={1.2} />
        <Persona x={1480} y={1040} h={520} t={t} seed={4} casco="legion" postura="sentado" expr="triste" />
        <Persona x={1760} y={1040} h={520} t={t} seed={5} ropa={CIVIL(2)} postura="agachado" giro="34" flip expr="miedo" />
      </>)}
      {E(1, <>
        <Campamento t={t} hora="tarde" angulo="bajo" />
        <Persona x={760} y={1080} h={820} t={t} seed={6} casco="legion" expr="orgullo" bD={150} cD={20} agarra={<EnMano.gladius />} agarraAng={-80} bI={20} cI={40} />
      </>)}
      {E(2, <Campamento t={t} angulo="cenital" />)}
      {E(3, <>
        <CarpaInterior t={t} />
        <Persona x={720} y={1030} h={500} t={t} seed={7} casco="no" postura="sentado" expr="dormido" />
        <Persona x={1160} y={1050} h={540} t={t} seed={8} giro="espalda" casco="legion" />
        <Persona x={1500} y={1060} h={520} t={t} seed={9} giro="34" flip expr="sorpresa" bD={70} cD={60} agarra={<EnMano.tablilla texto="HOME" />} />
      </>)}
      {E(4, <>
        <PlazaArmas t={t} />
        <Persona x={500 + ((t - 12) * 260) % 500} y={1040} h={500} t={t} seed={10} casco="legion" corre={1.6} expr="miedo" />
        <Persona x={1240} y={1050} h={540} t={t} seed={11} casco="legion" giro="34" {...pose("golpear", t)} agarra={<EnMano.gladius madera />} agarraAng={-30} expr="enojado" />
      </>)}
      {E(5, <>
        <PuertaPretoria t={t} abre={prog(t, 15.2, 16.6)} />
        <Persona x={420 + (t - 15) * 80} y={1060} h={500} t={t} seed={12} ropa={CIVIL(3)} giro="perfil" camina={1.3} agarra={<EnMano.bolsa txt="DENARII" />} expr="feliz" />
      </>)}
      {E(6, <>
        <Valle t={t} hora="tarde" />
        <Multitud t={t} n={16} filas={3} x0={300} x1={1620} y={1040} h={360} seed={3} />
      </>)}
      {E(7, <>
        <Bosque t={t} luz={0.5} />
        <Persona x={760} y={1040} h={520} t={t} seed={13} casco="legion" giro="34" bD={120} cD={40} agarra={<EnMano.antorcha t={t} />} agarraAng={-20} reaccion="susto" reaccionT0={22} />
        <Persona x={1220} y={1040} h={520} t={t} seed={14} casco="legion" giro="34" flip expr="miedo" agarraI={<EnMano.escudo />} bI={50} cI={60} />
      </>)}
      {E(8, <>
        <Campamento t={t} hora="noche" tropa={false} />
        <Persona x={300} y={1040} h={480} t={t} seed={15} casco="legion" reaccion="ojos" reaccionT0={24.3} />
        <Persona x={760} y={1040} h={480} t={t} seed={16} ropa={CIVIL(0)} reaccion="mandibula" reaccionT0={24.3} />
        <Persona x={1200} y={1040} h={480} t={t} seed={17} casco="legion" reaccion="derrite" reaccionT0={24.3} />
        <Persona x={1620} y={1040} h={480} t={t} seed={18} ropa={CIVIL(4)} reaccion="susto" reaccionT0={24.3} />
      </>)}
      {E(9, <>
        <Campamento t={t} hora="tarde" tropa={false} />
        <Multitud t={t} n={10} filas={2} ropa="civil" casco="no" accion="saludar" rompe={2} x0={360} x1={1560} y={1040} h={400} seed={5} />
      </>)}
      {E(10, <>
        <PlazaArmas t={t} angulo="bajo" hora="tarde" />
        <Persona x={700} y={1080} h={760} t={t} seed={19} casco="legion" giro="34" expr="triste" agarra={<EnMano.pala />} agarraAng={110} bD={30} cD={40} />
      </>)}
      {E(11, <>
        <Valle t={t} />
        <Persona x={300 + (t - 33) * 300} y={1040} h={500} t={t} seed={20} casco="legion" giro="perfil" corre={1.8} expr="miedo" />
        <Multitud t={t} n={6} filas={1} x0={1300} x1={1800} y={720} h={170} seed={9} casco="legion" accion="lanzar" />
      </>)}
    </AbsoluteFill>
  );
};
