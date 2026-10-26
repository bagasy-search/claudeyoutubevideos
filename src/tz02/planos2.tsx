// tz02 · planos 43-83 (198 s → final): las cuatro cosas en el camino, la caminata sin tel, día 3 en el lavadero, la llamada a mamá, día 4.
// v2 (26-oct): acción de cuerpo entero + componente-concepto por frase; sin saltos de cámara de 1 cuadro (ver director_tz02.md).
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { enPantalla, mira, useF } from "../anikit/camara";
import { F_HUD, Pildora } from "../anikit/pantalla";
import { ALDEANA, ALDEANO, CHANNA, ENFERMO, LEO, LEO_CAPUCHA, MONJE_JOVEN, REY, SIDDHARTHA, VIEJO, VIEJO_36 } from "../tenzo/elenco";
import { Frase, ManoLeo, ManoMara, Rotulo } from "../tenzo/hud";
import { Baston, Carroza, Cuenco, Laptop, Tel, TelMesa } from "../tenzo/utileria";
import { TelGrande } from "../tenzo/graficos";
import { CTO_PUNTOS, Cto, CP, DOBLA_A, doblando, kDe, Lav, LP, SENTADO } from "../tz01/base";
import { Fondo, maraCuarto } from "../tz01/planos1";
import { A, Bebe, BP, BW, Bwy, Camilla, Hud2, K, Kap, KP } from "./base";
import {
  Anillos, Auto, BiciDib, ManoGrande, suave, TelSvg, Burbuja, Calor, cl, Escoba, Etiqueta, FlorVentana, HojaCal, LagoDib, lerp, Lienzo, MamaDib, PortonDib, Recto, Retrato, TelMarco, Trazo, Vaho, ViejoDib, usePop, Lagrimas,
} from "./extras";
import { ciclo, rimOro, Silueta, TENZO } from "./planos1";
import { Amanecer, AmanecerCalle, CicloPorton, Desde, DoblaToalla, Envejece, Memorial, Placa, SombraGira, Tramos } from "./extras_b";

const MIRA_T = { x: 0.9, y: 0 }, MIRA_L = { x: -0.9, y: 0 };
const H3 = <Hud2 m={0} dia={3} est="congelado" />;
const CAMINA = { hD: 10, cD: 20, hI: 10, cI: 20 };
type Pose = Record<string, number>;
const BOLSILLOS = <T extends object>(p: T): T => ({ ...p, hD: -12, cD: 34, hI: -12, cI: 34 }); // manos en los bolsillos del buzo
type Pz = { f: number; v: Pose | string }[];
type Cara = { f: number; v: string }[];
// la carroza con Siddhartha y Channa: avanza de x0 a x1 en n cuadros (la carroza va DETRÁS de los dos)
const CarrozaViaje: React.FC<{ x0: number; x1: number; n: number; caraS?: string | Cara; hablaS?: [number, number][]; hablaC?: [number, number][]; miraS?: { x: number; y: number }; posesS?: Pz; posesC?: Pz; caraC?: string; miraC?: { x: number; y: number } }> = ({ x0, x1, n, caraS = "feliz", hablaS = [], hablaC = [], miraS = { x: 0.9, y: 0.1 }, posesS, posesC, caraC = "neutral", miraC }) => {
  const f = useF();
  const x = interpolate(f, [0, n], [x0, x1], cl);
  return (
    <>
      <Carroza x={x} piso={KP} rueda={f * 6} paso={f} />
      <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: x - 40, y: KP - 95 }]} asiento={[{ f: 0, v: 50 }]} poses={posesS ?? [{ f: 0, v: SENTADO }]} caras={typeof caraS === "string" ? [{ f: 0, v: caraS }] : caraS} miradas={[{ f: 0, v: miraS }]} habla={hablaS} />
      <A look={CHANNA} seed={34} ruta={[{ f: 0, x: x + 90, y: KP - 95 }]} asiento={[{ f: 0, v: 50 }]} poses={posesC ?? [{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }]} caras={[{ f: 0, v: caraC }]} miradas={miraC ? [{ f: 0, v: miraC }] : undefined} habla={hablaC} />
    </>
  );
};
// el viejo del camino: lo encorvado lo cuentan el bastón y el paso lento (tronco ≤12, cabeza ~10: con más el rig separa la cabeza)
const VIEJO_POSE = { tronco: 12, cabeza: 10, hD: 46, cD: 24, hI: 14, cI: 18 };
const ViejoCamino: React.FC<{ x0?: number; dx?: number; n?: number }> = ({ x0 = K.viejo, dx = -60, n = 200 }) => (
  <A look={VIEJO} seed={53} ruta={[{ f: 0, x: x0, y: KP }, { f: n, x: x0 + dx, y: KP, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: VIEJO_POSE }]} caras={[{ f: 0, v: "cansado" }]}
    ajuste={(p) => ({ ...p, hD: VIEJO_POSE.hD, cD: VIEJO_POSE.cD })} enManoD={<Recto ang={VIEJO_POSE.hD + VIEJO_POSE.tronco + VIEJO_POSE.cD}><Baston largo={150} /></Recto>} />
);

// ---------- 43 · a los 29, Siddhartha le ruega a Channa: afuera de los muros, una sola vez ----------
const k43 = kDe(198.07);
const AGARRA = { hD: 82, cD: 8, hI: 78, cI: 12, tronco: 10, cabeza: 4 };
export const Q43Ruega: React.FC = () => {
  const c = k43(203.85);
  const kb = kDe(203.85);
  return (
    <Tramos t={[
      [0, <Kap cl={[mira(0, 2790, 620, 1.55), mira(c, 2800, 625, 1.75, { curva: "inout" })]}
        medio={<><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: 2580, y: KP }, { f: 50, x: 2720, y: KP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "triste" }, { f: 120, v: "determinado" }]}
          poses={[{ f: 0, v: CAMINA }, { f: 52, v: { hD: 88, cD: 8, hI: 84, cI: 10, tronco: 8 } }, { f: 120, v: { hD: 150, cD: 20, hI: 20, cI: 20 } }, { f: 150, v: { hD: 88, cD: 8, hI: 84, cI: 10, tronco: 12, cabeza: 6 } }]} habla={[[10, c]]} />
          <A look={CHANNA} seed={34} ruta={[{ f: 0, x: 2860, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: 120, v: "miedo" }]} giros={[{ f: 0, v: 0 }, { f: 70, v: -0.4 }, { f: 85, v: 0.4 }, { f: 100, v: -0.4 }, { f: 115, v: 0 }]}
            poses={[{ f: 0, v: { hD: 20, cD: 20, hI: 20, cI: 20 } }, { f: 60, v: { hD: 60, cD: 90, hI: 55, cI: 95, tronco: -6 } }]} miradas={[{ f: 0, v: MIRA_L }, { f: 120, v: { x: 0.6, y: -0.2 } }]} /></>}
        hud={<><Pildora texto="AGE 29" x={960} y={110} desde={6} color="#ffe2a6" /><Placa texto="OUTSIDE THE WALLS" x={960} y={200} desde={k43(202.3)} tam={42} color="#fff2c8" /></>} />],
      // plano medio: le agarra los dos brazos y lo sacude al rogar; Channa mira el portón y termina asintiendo
      [c, <Kap cl={[mira(0, 2785, 700, 2.55), mira(75, 2790, 705, 2.7)]}
        medio={<><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: 2690, y: KP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: kb(204.83), v: "triste" }]}
          poses={[{ f: 0, v: AGARRA }]} ajuste={(p, fr) => ({ ...p, tronco: p.tronco + (fr < 50 ? Math.sin(fr * 0.7) * 5 : 0) })} habla={[[1, 22], [kb(204.83), 70]]} miradas={[{ f: 0, v: { x: 0.9, y: -0.1 } }]} />
          <A look={CHANNA} seed={34} ruta={[{ f: 0, x: 2870, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "miedo" }, { f: 40, v: "duda" }, { f: 60, v: "triste" }]}
            poses={[{ f: 0, v: { hD: 40, cD: 30, hI: 40, cI: 30, tronco: -8 } }]} miradas={[{ f: 0, v: MIRA_L }, { f: 22, v: { x: 0.7, y: -0.4 } }, { f: 44, v: MIRA_L }]} giros={[{ f: 0, v: 0 }, { f: 22, v: 0.5 }, { f: 44, v: 0 }]}
            ajuste={(p, fr) => ({ ...p, cabeza: (p.cabeza ?? 0) + (fr > 56 ? Math.max(0, Math.sin((fr - 56) * 0.5)) * 12 : 0) })} /></>}
        hud={<><Placa texto="JUST ONCE" x={960} y={130} desde={2} hasta={kb(204.8)} tam={46} color="#fff2c8" /><Placa texto="JUST TO SEE THE CITY" x={960} y={130} desde={kb(204.85)} tam={46} color="#ffd38a" /></>} />],
    ]} />
  );
};
// ---------- 44 · el rey se entera: calles limpias, viejos y enfermos escondidos, flores en cada ventana ----------
const k44 = kDe(206.33);
export const Q44Ordena: React.FC = () => {
  const f = useF();
  const corte = k44(211.6);
  if (f < corte) return (
    <Kap cl={[mira(0, K.trono - 100, 610, 1.7), mira(corte, K.trono - 120, 615, 1.9)]}
      medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 100, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "enojo" }]} poses={[{ f: 0, v: "parado" }, { f: 30, v: { hD: 150, cD: 10, hI: 10, cI: 10 } }, { f: 70, v: { hD: 95, cD: 5, hI: 10, cI: 10 } }, { f: 110, v: { hD: 150, cD: 10, hI: 60, cI: 60 } }]} habla={[[20, 150]]} />}
      hud={<><Placa texto="CLEAN STREETS" x={1300} y={180} desde={30} tam={42} /><Placa texto="HIDE THE OLD AND THE SICK" x={1300} y={262} desde={80} tam={42} color="#ffb060" /><Placa texto="FLOWERS IN EVERY WINDOW" x={1300} y={344} desde={120} tam={42} color="#ffd38a" /></>} />
  );
  const g = f - corte;
  return (
    <Kap cl={[mira(0, 3330, 620, 1.3), mira(320 - corte, 3520, 625, 1.4, { curva: "inout" })]} sp={{ flores: 1, portonAbierto: 1 }}
      medio={<>
        {[3180, 3420, 3660, 3900].map((x, i) => <FlorVentana key={x} x={x} y={KP - 330 + (i % 2) * 40} p={lerp(g, 6 + i * 12, 18 + i * 12, 0, 1)} />)}
        <A look={ALDEANO} seed={71} ruta={[{ f: 0, x: 3250, y: KP }, { f: 160, x: 3330, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={ciclo({ tronco: 12, hD: 70, cD: 40, hI: 60, cI: 50 }, { tronco: 12, hD: 40, cD: 50, hI: 30, cI: 60 }, 14, 200)} enManoD={<Recto ang={110}><Escoba /></Recto>} caras={[{ f: 0, v: "neutral" }]} />
        <A look={ALDEANA} seed={72} ruta={[{ f: 0, x: 3700, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={ciclo({ tronco: 12, hD: 70, cD: 40, hI: 60, cI: 50 }, { tronco: 12, hD: 40, cD: 50, hI: 30, cI: 60 }, 12, 200)} enManoD={<Recto ang={110}><Escoba /></Recto>} caras={[{ f: 0, v: "neutral" }]} />
        <A look={VIEJO} seed={53} ruta={[{ f: 0, x: 3920, y: KP }, { f: 100, x: 4160, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: VIEJO_POSE }]} caras={[{ f: 0, v: "triste" }]} opacidad={(fr: number) => interpolate(fr - corte, [70, 100], [1, 0], cl)} />
        <A look={ALDEANO} seed={73} ruta={[{ f: 0, x: 3800, y: KP }, { f: 100, x: 4040, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 88, cD: 5, hI: 84, cI: 8, tronco: 10 } }]} caras={[{ f: 0, v: "enojo" }]} opacidad={(fr: number) => interpolate(fr - corte, [80, 110], [1, 0], cl)} />
        <CarrozaViaje x0={2700} x1={3150} n={320 - corte} />
      </>} />
  );
};
// ---------- 45 · pero en el camino… cuatro cosas ----------
export const Q45Cuatro: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, 3700, 600, 1.1), mira(60, 3760, 600, 1.15)]} sp={{ flores: 0.3, portonAbierto: 1 }}
      medio={<CarrozaViaje x0={3550} x1={3700} n={60} />}
      hud={<Lienzo>
        <rect width={1920} height={1080} fill="#1a1410" opacity={0.78} />
        <text x={960} y={190} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={64} letterSpacing={6} fill="#fff2c8">FOUR THINGS</text>
        {["I", "II", "III", "IV"].map((r, i) => {
          // las 4 cartas caen boca abajo en fila (mismo tamaño) y se dan vuelta una por una
          const cae = interpolate(f - 2 - i * 4, [0, 8], [0, 1], { ...cl, easing: suave });
          const giro = interpolate(f - 18 - i * 7, [0, 8], [0, 1], cl);
          const sx = Math.abs(Math.cos(giro * Math.PI)) || 0.02;
          const frente = giro > 0.5;
          return (
            <g key={r} transform={`translate(${390 + i * 380},${560 - (1 - cae) * 700}) rotate(${(1 - cae) * (i % 2 ? 14 : -14)}) scale(${sx},1)`} opacity={cae > 0 ? 1 : 0}>
              {frente ? <>
                <rect x={-150} y={-200} width={300} height={400} rx={24} fill="#f4e4c0" stroke="#8a5a2a" strokeWidth={8} />
                <path d="M0,-120 a46,46 0 1 1 -0.1,0 M-80,150 Q-80,-30 0,-40 Q80,-30 80,150 Z" fill="#3a2a22" opacity={0.85} />
                <text x={0} y={30} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={110} fill="#ffd38a">?</text>
                <text x={0} y={185} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={44} fill="#5a3418">{r}</text>
              </> : <>
                <rect x={-150} y={-200} width={300} height={400} rx={24} fill="#8a3a2a" stroke="#f2c14a" strokeWidth={8} />
                <rect x={-120} y={-170} width={240} height={340} rx={14} fill="none" stroke="#f2c14a" strokeWidth={4} />
                <circle r={60} fill="none" stroke="#f2c14a" strokeWidth={6} /><path d="M0,-60 L0,60 M-60,0 L60,0 M-42,-42 L42,42 M42,-42 L-42,42" stroke="#f2c14a" strokeWidth={4} />
              </>}
            </g>
          );
        })}
      </Lienzo>} />
  );
};
// ---------- 46 · lo primero: un viejo. Doblado. Un bastón. La piel como corteza ----------
const k46 = kDe(219.0);
export const Q46Viejo: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 160, 640, 1.45), mira(k46(220.7), K.viejo - 40, 650, 1.9, { curva: "inout" }), mira(k46(223.3), K.viejo - 60, 630, 2.05, { curva: "inout" }), mira(195, K.viejo - 65, 630, 2.15)]}
    medio={<ViejoCamino x0={K.viejo + 40} dx={-110} n={195} />}
    hud={<><Pildora texto="I · AN OLD MAN" x={960} y={110} desde={4} color="#ffe2a6" />
      <Etiqueta texto="BENT" x={1380} y={250} desde={k46(220.9)} tam={46} /><Etiqueta texto="A CANE" x={1380} y={320} desde={k46(221.9)} tam={46} /><Etiqueta texto="SKIN LIKE BARK" x={1380} y={390} desde={k46(223.6)} tam={46} color="#ffd38a" /></>} />
);
// ---------- 47 · «Channa, what is wrong with that man?» — plano medio cerrado: Siddhartha se inclina y señala, el viejo entra por la derecha ----------
export const Q47QueLePasa: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 130, 640, 2.15), mira(75, K.viejo - 190, 630, 2.3, { curva: "inout" })]} sp={{ portonAbierto: 1 }}
    medio={<><ViejoCamino x0={K.viejo + 120} dx={-40} n={75} /><CarrozaViaje x0={K.viejo - 400} x1={K.viejo - 395} n={75} caraS={[{ f: 0, v: "neutral" }, { f: 8, v: "sorpresa" }, { f: 40, v: "duda" }]} hablaS={[[2, 20], [24, 70]]} miraS={{ x: 0.9, y: 0.2 }} miraC={{ x: -0.6, y: 0 }}
      posesS={[{ f: 0, v: SENTADO }, { f: 8, v: { ...SENTADO, hD: 95, cD: 4, tronco: 16, cabeza: 4 } }, { f: 40, v: { ...SENTADO, hD: 100, cD: 0, tronco: 20, cabeza: 2 } }, { f: 60, v: { ...SENTADO, hD: 60, cD: 60, hI: 40, cI: 90, tronco: 10 } }]} /></>}
    hud={<Placa texto="WHAT IS WRONG WITH THAT MAN?" x={960} y={130} desde={22} tam={42} color="#fff2c8" />} />
);
// ---------- 48 · «nothing is wrong with him, my prince. He is old. It happens to everyone»: contraplano de Channa → inserto del viejo → Channa ----------
const k48 = kDe(228.01);
const CarrozaQuieta: React.FC<{ caraC: string; hablaC: [number, number][]; posesC: Pz; caraS?: string; miraC?: { x: number; y: number } }> = ({ caraC, hablaC, posesC, caraS = "duda", miraC = { x: -0.9, y: 0.1 } }) => (
  <CarrozaViaje x0={K.viejo - 330} x1={K.viejo - 330} n={1} caraS={caraS} caraC={caraC} miraS={{ x: 0.9, y: 0 }} miraC={miraC} hablaC={hablaC} posesC={posesC} />
);
export const Q48Viejo: React.FC = () => {
  const b = k48(229.95), c = k48(230.98);
  return (
    <Tramos t={[
      [0, <Kap cl={[mira(0, K.viejo - 190, 590, 3.2), mira(b, K.viejo - 185, 590, 3.35)]} sp={{ portonAbierto: 1 }}
        medio={<CarrozaQuieta caraC="triste" hablaC={[[0, k48(229.8)]]} posesC={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }, { f: 16, v: { ...SENTADO, hD: 45, cD: 70, hI: 60, cI: 30, cabeza: 6 } }, { f: 40, v: { ...SENTADO, hD: 50, cD: 60, hI: 60, cI: 30, cabeza: 10 } }]} />}
        hud={<Placa texto="NOTHING IS WRONG WITH HIM" x={960} y={130} desde={6} tam={42} color="#fff2c8" />} />],
      [b, <Kap cl={[mira(0, K.viejo + 20, 680, 2.5), mira(c - b, K.viejo, 670, 2.7)]} sp={{ portonAbierto: 1 }}
        medio={<ViejoCamino x0={K.viejo + 70} dx={-30} n={c - b} />}
        hud={<Placa texto="HE IS OLD" x={1380} y={300} desde={2} tam={56} color="#ffd38a" />} />],
      [c, <Kap cl={[mira(0, K.viejo - 230, 620, 2.25), mira(136 - c, K.viejo - 225, 615, 2.4)]} sp={{ portonAbierto: 1 }}
        medio={<CarrozaQuieta caraC="triste" caraS="miedo" hablaC={[[0, 44]]} posesC={[{ f: 0, v: { ...SENTADO, hD: 50, cD: 60, hI: 60, cI: 30 } }, { f: 8, v: { ...SENTADO, hD: 60, cD: 20, hI: 60, cI: 30, tronco: -2 } }, { f: 30, v: { ...SENTADO, hD: 96, cD: -6, hI: 60, cI: 30, tronco: -6, cabeza: -4 } }]} />}
        hud={<Placa texto="IT HAPPENS TO EVERYONE" x={960} y={130} desde={2} tam={46} color="#fff2c8" />} />],
    ]} />
  );
};
// ---------- 49 · «to everyone? to my father? to my wife?» (Siddhartha con miedo + recuerdos) ----------
const k49 = kDe(232.55);
export const Q49ATodos: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, K.viejo - 420, 560, 2.2), mira(95, K.viejo - 430, 560, 2.45)]} sp={{ portonAbierto: 1 }}
      medio={<CarrozaViaje x0={K.viejo - 330} x1={K.viejo - 330} n={1} caraS={[{ f: 0, v: "sorpresa" }, { f: 30, v: "miedo" }]} miraS={{ x: -0.3, y: -0.6 }} hablaS={[[0, k49(233.3)], [k49(233.39), k49(234.5)], [k49(234.61), k49(235.6)]]}
        posesS={[{ f: 0, v: SENTADO }, { f: 20, v: { ...SENTADO, hD: 40, cD: 120, hI: 40, cI: 120, tronco: -6 } }]} />}
      hud={<>
        <Burbuja x={560} y={330} r={150} desde={k49(233.4)} cx={900} cy={500}><Retrato x={0} y={0} r={80} tipo="rey" edad={lerp(f, k49(233.6), 95, 0, 1)} cara="neutral" /></Burbuja>
        <Burbuja x={1360} y={330} r={150} desde={k49(234.6)} cx={1020} cy={500}><Retrato x={0} y={0} r={80} tipo="esposa" edad={lerp(f, k49(234.8), 95, 0, 1)} cara="neutral" /></Burbuja>
      </>} />
  );
};
// ---------- 50 · «to everyone, my prince. To you too»: Channa (primer plano de los dos) → la cara de Siddhartha envejece en 3 pasos ----------
const k50 = kDe(235.71);
export const Q50ATi: React.FC = () => {
  const b = k50(237.28);
  return (
    <Tramos t={[
      [0, <Kap cl={[mira(0, K.viejo - 400, 585, 3.1), mira(b, K.viejo - 395, 585, 3.3)]} sp={{ portonAbierto: 1 }}
        medio={<CarrozaQuieta caraC="triste" caraS="miedo" miraC={{ x: -0.9, y: 0 }} hablaC={[[0, k50(237.2)]]} posesC={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }, { f: 10, v: { ...SENTADO, hD: 45, cD: 70, hI: 60, cI: 30, cabeza: 8, tronco: 4 } }]} />}
        hud={<Placa texto="TO EVERYONE, MY PRINCE" x={960} y={130} desde={4} tam={44} color="#fff2c8" />} />],
      [b, <><Envejece s1={9} s2={22} /><Placa texto="TO YOU TOO" x={960} y={110} desde={1} tam={56} color="#ffd38a" /></>],
    ]} />
  );
};
// ---------- 51 · Leo vuelve a casa por Broadway a las 4, sin tel: busca el tel en el bolsillo (reflejo), y como no tiene nada que mirar, mira todo ----------
const k51 = kDe(238.65);
export const Q51Camina: React.FC = () => {
  const palpa = [k51(240.4), k51(241.9)];
  return (
    <Bwy cl={[0, 30, 60, 90, 120, 150, 180, 209].map((q) => mira(q, 950 + (900 * q) / 209 + 40, 780, 2.2, { curva: "inout" }))} sp={{ tren: 150 }}
      medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: 950, y: BP }, { f: 209, x: 1850, y: BP, curva: "lineal" }]} poses={[{ f: 0, v: CAMINA }]}
        ajuste={(p, fr) => (fr >= palpa[0] && fr < palpa[1] ? { ...p, hI: -12, cI: 34, hD: 22 + Math.sin(fr * 0.8) * 6, cD: 118, cabeza: 14 } : BOLSILLOS(p))}
        caras={[{ f: 0, v: "neutral" }, { f: palpa[0], v: "duda" }, { f: palpa[1], v: "neutral" }, { f: k51(243.2), v: "sorpresa" }, { f: k51(245), v: "feliz" }]}
        miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: palpa[0], v: { x: 0.3, y: 0.8 } }, { f: palpa[1], v: { x: 0.9, y: 0.1 } }, { f: k51(243.2), v: { x: 0.2, y: -0.9 } }, { f: k51(244.0), v: { x: -0.9, y: -0.2 } }, { f: k51(244.8), v: { x: 0.9, y: -0.5 } }]}
        giros={[{ f: 0, v: 0 }, { f: k51(243.2), v: 0.1 }, { f: k51(244.0), v: -0.5 }, { f: k51(244.8), v: 0.5 }]} />}
      hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="4:00 AM · NO PHONE" desde={6} hasta={palpa[1] + 10} />
        <Placa texto="NOTHING TO LOOK AT" x={960} y={1000} desde={k51(242.45)} hasta={k51(243.9)} tam={40} />
        <Placa texto="THE SNOW" x={1300} y={110} desde={k51(243.25)} tam={40} color="#bfe6ff" />
        <Placa texto="THE WINDOWS" x={330} y={560} desde={k51(244.05)} tam={40} color="#ffd38a" />
        <Placa texto="THE TRAIN" x={1600} y={330} desde={k51(244.85)} tam={40} color="#fff2c8" /></>} />
  );
};
// ---------- 52 · en la parada del 36, un viejo con campera finita espera un bus que tarda una hora ----------
export const Q52Parada: React.FC = () => {
  const pop = usePop(60);
  return (
    <Bwy cl={[mira(0, 3270, 560, 0.98), mira(66, 3280, 565, 1.02), mira(208, 3500, 650, 2.05, { curva: "inout" })]}
      medio={<>
        <A look={VIEJO_36} seed={57} ruta={[{ f: 0, x: BW.banco36 - 30, y: BP }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 40, cD: 120, hI: 40, cI: 120, tronco: 12, cabeza: 10 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.4 } }]} />
        <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 700, y: BP }, { f: 110, x: BW.parada36 - 330, y: BP }]} poses={[{ f: 0, v: CAMINA }]} ajuste={BOLSILLOS} caras={[{ f: 0, v: "neutral" }, { f: 120, v: "duda" }]}
          miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: 116, v: { x: 0.8, y: 0.4 } }]} giros={[{ f: 0, v: 0 }, { f: 116, v: 0.5 }]} />
      </>} hud={<><Hud2 m={0} est="congelado" />
        <div style={{ position: "absolute", left: 1280, top: 150, transform: `scale(${pop})`, transformOrigin: "left top", background: "#1d2a1f", border: "4px solid #8fd18f", borderRadius: 14, padding: "10px 24px", fontFamily: F_HUD, color: "#bff5bf", fontSize: 40, fontWeight: 700, letterSpacing: 3, whiteSpace: "nowrap" }}>36 · NEXT BUS 58 MIN</div></>} />
  );
};
// ---------- 53 · le tiemblan las manos de frío: se las sopla ----------
export const Q53Manos: React.FC = () => {
  const f = useF();
  const t = Math.sin(f * 1.7) * 3;
  return (
    <Bwy cl={[mira(0, BW.banco36 - 20, 690, 2.5), mira(72, BW.banco36 - 20, 690, 2.65)]}
      medio={<>
        <A look={VIEJO_36} seed={57} ruta={[{ f: 0, x: BW.banco36 - 30, y: BP }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 30 + t, cD: 150 - t, hI: 30 - t, cI: 150 + t, tronco: 10, cabeza: 4 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.6 } }]} habla={[[10, 22], [40, 52]]} />
        <Vaho x={BW.banco36 + 10} y={BP - 196} f={f} dir={1} desde={10} />
      </>} hud={<><Hud2 m={0} est="congelado" /><Etiqueta texto="SHAKING · COLD" x={1400} y={170} desde={20} tam={42} color="#bfe6ff" /></>} />
  );
};
// ---------- 54 · pasó por esa parada mil veces (fantasmas de Leo con el tel pasan de largo por delante del viejo). Nunca lo vio → el Leo de hoy entra y se para ----------
const k54 = kDe(254.99);
export const Q54NuncaLoVio: React.FC = () => {
  const f = useF();
  const llega = k54(257.7);
  const n = Math.round(interpolate(f, [0, 100], [10, 1000], { ...cl, easing: (t) => t * t }));
  return (
    <Bwy cl={[mira(0, BW.parada36 - 220, 790, 1.8), mira(139, BW.parada36 - 240, 790, 1.85)]}
      medio={<>
        <A look={VIEJO_36} seed={57} ruta={[{ f: 0, x: BW.banco36 - 30, y: BP }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 40, cD: 120, hI: 40, cI: 120, tronco: 12, cabeza: 10 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: -0.4, y: 0.4 } }, { f: llega + 20, v: { x: -0.9, y: 0 } }]} />
        {[0, 1, 2, 3, 4].map((q) => { const a0 = 2 + q * 18; return <A key={q} look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 900, y: BP + 30 }, { f: a0, x: BW.parada36 - 900, y: BP + 30 }, { f: a0 + 30, x: BW.parada36 + 420, y: BP + 30, curva: "lineal" }]} poses={[{ f: 0, v: CAMINA }]} ajuste={(p) => ({ ...p, hD: 30, cD: 120, cabeza: 18 })} enManoD={<Tel />} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }]}
          opacidad={(fr: number) => (fr < a0 || fr > a0 + 30 ? 0 : 0.55)} />; })}
        {f >= llega && <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 760, y: BP }, { f: llega, x: BW.parada36 - 760, y: BP }, { f: llega + 22, x: BW.parada36 - 420, y: BP, curva: "out" }]} poses={[{ f: 0, v: CAMINA }]} ajuste={BOLSILLOS} caras={[{ f: 0, v: "neutral" }, { f: llega + 24, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: llega + 24, v: { x: 0.8, y: 0.4 } }]} giros={[{ f: 0, v: 0 }, { f: llega + 24, v: 0.4 }]} />}
      </>}
      hud={<><Hud2 m={0} est="congelado" />
        <div style={{ position: "absolute", left: 1340, top: 840, transform: "translate(-50%,0)", textAlign: "center", fontFamily: F_HUD, color: "#f4efe6", background: "rgba(18,16,20,0.8)", borderRadius: 20, padding: "6px 34px 12px" }}>
          <div style={{ fontSize: 92, fontWeight: 700, color: "#ff6a2b", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>{n.toLocaleString("en-US")}</div><div style={{ fontSize: 32, letterSpacing: 6, fontWeight: 600 }}>TIMES WALKED PAST</div></div>
        <Placa texto="NEVER SAW HIM" x={640} y={930} desde={k54(258.05)} tam={50} color="#ffd38a" /></>} />
  );
};
// ---------- 55 · lo segundo: Siddhartha mira desde la carroza (contraplano) → el enfermo TIRADO en el polvo, retorciéndose, ardiendo de fiebre ----------
const k55 = kDe(259.61);
const TIRADO_A = { tronco: -84, cabeza: 6, pI: 80, rI: 30, pD: 70, rD: 50, hD: 40, cD: 140, hI: 10, cI: 30 };
const TIRADO_B = { tronco: -78, cabeza: 14, pI: 64, rI: 70, pD: 84, rD: 20, hD: 70, cD: 120, hI: 30, cI: 60 };
export const Q55Enfermo: React.FC = () => {
  const b = k55(262.6);
  return (
    <Tramos t={[
      [0, <Kap cl={[mira(0, K.enfermo - 520, 600, 2.7), mira(b, K.enfermo - 520, 600, 2.85)]} sp={{ portonAbierto: 1 }}
        medio={<CarrozaViaje x0={K.enfermo - 560} x1={K.enfermo - 560} n={1} caraS={[{ f: 0, v: "neutral" }, { f: 10, v: "miedo" }]} miraS={{ x: 0.9, y: 0.5 }} caraC="triste" miraC={{ x: 0.9, y: 0.5 }}
          posesS={[{ f: 0, v: SENTADO }, { f: 10, v: { ...SENTADO, hD: 40, cD: 140, hI: 40, cI: 130, tronco: -6 } }]} />}
        hud={<Pildora texto="II · A SICK MAN" x={960} y={110} desde={4} color="#ffe2a6" />} />],
      [b, <EnfermoPolvo />],
    ]} />
  );
};
const EnfermoPolvo: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const pop = usePop(30);
  const c = [mira(0, K.enfermo - 10, 820, 2.5), mira(107, K.enfermo + 10, 830, 2.75, { curva: "inout" })];
  const p = enPantalla(c, f, fps, K.enfermo + 40, KP - 120);
  return (
    <Kap cl={c} sp={{ portonAbierto: 1 }}
      medio={<><A look={ENFERMO} seed={58} ruta={[{ f: 0, x: K.enfermo, y: KP }]} asiento={[{ f: 0, v: 2 }]} poses={ciclo(TIRADO_A, TIRADO_B, 26, 120)} caras={[{ f: 0, v: "cansado" }, { f: 40, v: "triste" }]} miradas={[{ f: 0, v: { x: 0, y: -0.8 } }]} />
        {[0, 1, 2].map((q) => { const t = ((f + q * 13) % 39) / 39; return <ellipse key={q} cx={K.enfermo - 80 + q * 70 + t * 30} cy={KP - 10 - t * 40} rx={20 + t * 40} ry={8 + t * 14} fill="#d8b888" opacity={0.6 * (1 - t)} />; })}
        <Calor x={K.enfermo + 40} y={KP - 110} f={f} w={240} /></>}
      hud={<><Placa texto="LYING IN THE DUST" x={960} y={130} desde={2} hasta={k55(263.8) - k55(262.6)} tam={44} color="#fff2c8" />
        <div style={{ position: "absolute", left: Math.min(1700, p.x + 300), top: Math.max(260, p.y - 300), transform: `translate(-50%,-50%) scale(${pop})`, fontFamily: F_HUD, fontWeight: 700, fontSize: 96, color: "#ff5a3a", background: "rgba(18,16,20,0.75)", borderRadius: 20, padding: "0 26px" }}>{Math.round(interpolate(f, [30, 100], [99, 104], cl))}°F</div>
        <Placa texto="BURNING WITH FEVER" x={960} y={130} desde={k55(263.8) - k55(262.6)} tam={44} color="#ffb060" /></>} />
  );
};
// ---------- 56 · a las 5, Leo no duerme (acostado, da vueltas, el reloj marca 5:00); por primera vez en meses se sienta, abre la laptop vieja y aprieta play ----------
const LAP = { x: CTO_PUNTOS.colchon + 60, y: CP - 70 };
const CAMA_S = { tronco: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 60, cD: 40, hI: 50, cI: 40, cabeza: 22 };
const ACOST56 = { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 10, cD: 20, hI: 10, cI: 20 };
const k56 = kDe(264.19);
export const Q56Laptop: React.FC = () => {
  const f = useF();
  const sube = k56(267.75), abre = k56(268.9), play = k56(269.5);
  const brillo = lerp(f, abre, abre + 10, 0, 1);
  const pop = usePop(play);
  return (
    <Cto cl={[mira(0, CTO_PUNTOS.colchon + 20, 560, 1.4), mira(sube, CTO_PUNTOS.colchon + 20, 580, 1.5, { curva: "inout" }), mira(232, CTO_PUNTOS.colchon + 10, 640, 2.2, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: ACOST56 }, { f: 26, v: { ...ACOST56, tronco: -70, cabeza: -20, hI: 120, cI: 40 } }, { f: 58, v: { ...ACOST56, tronco: -55, cabeza: 0, hD: 150, cD: 60 } }, { f: 84, v: ACOST56 },
          { f: sube, v: ACOST56 }, { f: sube + 14, v: CAMA_S }, { f: abre - 8, v: { ...CAMA_S, tronco: 10, cabeza: 18, hD: 80, cD: 10 } }, { f: abre + 6, v: { ...CAMA_S, tronco: 6, cabeza: 16, hD: 60, cD: 60 } }, { f: play - 4, v: { ...CAMA_S, tronco: 12, cabeza: 18, hD: 72, cD: 4 } }, { f: play + 14, v: { ...CAMA_S, cabeza: 26, hD: 40, cD: 120, hI: 40, cI: 120 } }], enManoD: null,
        caras: [{ f: 0, v: "cansado" }, { f: 40, v: "triste" }, { f: sube, v: "duda" }, { f: play + 10, v: "triste" }],
        miradas: [{ f: 0, v: { x: 0, y: -0.8 } }, { f: 30, v: { x: 0.7, y: -0.5 } }, { f: 84, v: { x: 0, y: -0.8 } }, { f: sube + 10, v: { x: 0.6, y: 0.6 } }],
        giros: [{ f: 0, v: 0 }, { f: 26, v: -0.4 }, { f: 58, v: 0.3 }, { f: 84, v: 0 }] }}
      medio={<><Laptop x={interpolate(f, [abre - 20, abre - 4], [LAP.x + 300, LAP.x], { ...cl, easing: suave })} y={LAP.y} brillo={brillo} onda={f > play ? f / 3 : 0} /><g transform={`translate(${CTO_PUNTOS.colchon + 240},${CP - 400})`}><rect x={-130} y={-60} width={260} height={120} rx={20} fill="#0c0d10" stroke="#2c3038" strokeWidth={5} /><text x={0} y={26} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={78} fill="#ff4a3d" opacity={f % 30 < 15 ? 1 : 0.75}>5:00</text></g></>}
      hud={<><Hud2 m={0} est="congelado" /><Etiqueta texto="CAN'T SLEEP" x={960} y={130} desde={k56(266.4)} hasta={sube} tam={50} />
        <Etiqueta texto="FIRST TIME IN MONTHS" x={960} y={130} desde={sube + 4} hasta={play + 12} tam={50} color="#ffd38a" />
        {f > play && <div style={{ position: "absolute", left: 1290, top: 620, transform: `scale(${pop})`, fontFamily: F_HUD, fontSize: 46, fontWeight: 700, color: "#e9eef6", background: "#ff6a2b", padding: "8px 22px", borderRadius: 40 }}>▶ VOICEMAILS · 3</div>}</>} />
  );
};
/// ---------- 57 · tres de su madre, Diane, en Peoria → Leo escucha → el último: tose → «it's nothing… call me when you can, baby» ----------
const k57 = kDe(271.93);
const PanelVoz: React.FC = () => {
  const f = useF();
  const esc = interpolate(f, [0, 71], [1, 1.07], cl);
  const juega = Math.min(2, Math.floor(f / 26)); // cuál suena ahora
  return (
    <Fondo>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${esc})`, transformOrigin: "50% 60%" }}>
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={360} y={170} width={1000} height={640} rx={26} fill="#1b1e24" stroke="#3a3f48" strokeWidth={6} />
          <text x={420} y={260} fill="#9aa3ad" fontFamily={F_HUD} fontSize={40} fontWeight={700}>VOICEMAIL · 3 NEW</text>
          {[0, 1, 2].map((i) => {
            const act = i === juega;
            const ent = interpolate(f - i * 6, [0, 10], [0, 1], { ...cl, easing: suave });
            const prog = act ? ((f - i * 26) % 26) / 26 : i < juega ? 1 : 0;
            return (
              <g key={i} transform={`translate(${420 + (1 - ent) * 400},${320 + i * 150})`} opacity={ent}>
                <rect width={880} height={120} rx={18} fill={act ? "#3a2418" : "#262a31"} stroke={act ? "#ff6a2b" : "none"} strokeWidth={4} />
                <circle cx={60} cy={60} r={32} fill="#ff6a2b" /><path d={act ? "M50,44 L50,76 M70,44 L70,76" : "M50,44 L76,60 L50,76 Z"} stroke="#fff" strokeWidth={8} fill="#fff" strokeLinecap="round" />
                <text x={120} y={54} fill="#f4efe6" fontFamily={F_HUD} fontSize={40} fontWeight={700}>MOM · DIANE</text>
                <text x={120} y={96} fill="#9aa3ad" fontFamily={F_HUD} fontSize={30}>Peoria, IL · {["0:41", "0:22", "0:37"][i]}</text>
                {Array.from({ length: 12 }).map((_, bb) => { const h = act ? 8 + Math.abs(Math.sin(f / 2.6 + bb * 1.3)) * 30 : 6 + ((bb * 7 + i * 5) % 9) * 3; return <rect key={bb} x={560 + bb * 24} y={60 - h} width={12} height={2 * h} rx={6} fill="#ff6a2b" opacity={bb / 12 < prog ? 1 : 0.35} />; })}
              </g>
            );
          })}
          <g transform="translate(1560,360)" opacity={lerp(f, 14, 24, 0, 1)}>
            <rect x={-150} y={-120} width={300} height={330} rx={20} fill="#22262d" stroke="#3a3f48" strokeWidth={4} />
            <path d="M-100,-80 L60,-90 L90,-40 L80,60 L100,140 L-60,160 L-110,40 Z" fill="#3a4250" stroke="#5a6270" strokeWidth={3} />
            <circle cx={10} cy={-60} r={10} fill="#9aa3ad" /><text x={24} y={-70} fill="#9aa3ad" fontFamily={F_HUD} fontSize={22}>CHICAGO</text>
            <path d="M10,-60 Q-40,0 -20,60" stroke="#ff6a2b" strokeWidth={5} fill="none" pathLength={100} style={{ strokeDasharray: `${lerp(f, 20, 44, 0, 100)} 100` }} />
            <path d="M-20,60 m0,-34 a16,16 0 1 1 -0.1,0 Z M-20,60 l-12,-24 l24,0 Z" fill="#ff6a2b" />
            <text x={0} y={110} textAnchor="middle" fill="#f4efe6" fontFamily={F_HUD} fontSize={32} fontWeight={700}>PEORIA</text>
          </g>
        </svg>
      </div>
      <Hud2 m={0} est="congelado" />
    </Fondo>
  );
};
const TosMama: React.FC = () => {
  const f = useF();
  const toses = [8, 26, 42];
  const tos = toses.some((t) => f >= t && f < t + 9);
  const sac = tos ? Math.sin(f * 2.4) * 8 : 0;
  return (
    <Fondo>
      <Lienzo>
        <rect x={0} y={0} width={1920} height={1080} fill="#16181d" />
        <circle cx={560} cy={500} r={300} fill="#ff6a2b" opacity={0.08} />
        <g transform={`translate(${560 + sac},${500 + Math.abs(sac)})`}><Retrato x={0} y={0} r={220} tipo="mama" cara="triste" edad={0.2} /></g>
        {tos && <g transform="translate(770,560)">{[0, 1, 2].map((q) => <path key={q} d={`M${q * 30},${-30 + q * 20} q30,-10 50,10`} stroke="#ffb060" strokeWidth={8} fill="none" strokeLinecap="round" />)}</g>}
        <text x={1340} y={300} textAnchor="middle" fill="#9aa3ad" fontFamily={F_HUD} fontSize={40} fontWeight={700}>VOICEMAIL 3 / 3</text>
        {Array.from({ length: 26 }).map((_, bb) => { const pico = tos && bb % 3 !== 1; const h = pico ? 120 + (bb % 4) * 20 : 14 + Math.abs(Math.sin(f / 3 + bb)) * 40; return <rect key={bb} x={940 + bb * 31} y={560 - h} width={18} height={2 * h} rx={9} fill={pico ? "#ff3a2a" : "#ff6a2b"} opacity={0.9} />; })}
      </Lienzo>
      {toses.map((t, i) => <Placa key={t} texto="*cough*" x={1180 + i * 170} y={800} desde={t} hasta={t + 14} tam={46} color="#ffb060" />)}
      <Placa texto="SHE IS COUGHING" x={1340} y={180} desde={2} tam={44} color="#fff2c8" />
      <Hud2 m={0} est="congelado" />
    </Fondo>
  );
};
export const Q57Diane: React.FC = () => {
  const b = k57(274.3), c = k57(275.3), d = k57(277.2);
  const kd = kDe(277.2);
  return (
    <Tramos t={[
      [0, <PanelVoz />],
      [b, <Cto cl={[mira(0, CTO_PUNTOS.colchon - 60, 680, 2.6), mira(c - b, CTO_PUNTOS.colchon - 60, 680, 2.75)]}
        leo={{ poses: [{ f: 0, v: { ...CAMA_S, cabeza: 22, hD: 60, cD: 60 } }, { f: 14, v: { ...CAMA_S, cabeza: 26, tronco: 4, hD: 70, cD: 50 } }], enManoD: null, caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.5 } }] }}
        medio={<Laptop x={LAP.x} y={LAP.y} brillo={1} onda={1} />} hud={<Hud2 m={0} est="congelado" />} />],
      [c, <TosMama />],
      [d, <Cto cl={[mira(0, CTO_PUNTOS.colchon - 60, 670, 2.5), mira(272 - d, CTO_PUNTOS.colchon - 60, 680, 2.8, { curva: "inout" })]}
        leo={{ poses: [{ f: 0, v: { ...CAMA_S, cabeza: 22 } }, { f: kd(278.6), v: { ...CAMA_S, cabeza: 26, hD: 30, cD: 140 } }, { f: kd(280.2), v: { ...CAMA_S, cabeza: 34, tronco: 12, hD: 34, cD: 150, hI: 40, cI: 130 } }], enManoD: null,
          caras: [{ f: 0, v: "duda" }, { f: kd(278.6), v: "triste" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.5 } }, { f: kd(278.8), v: { x: 0.3, y: 0.8 } }] }}
        medio={<Laptop x={LAP.x} y={LAP.y} brillo={1} onda={1} />}
        hud={<><Hud2 m={0} est="congelado" /><Frase texto="“it’s nothing”" desde={1} hasta={kd(278.5)} y={150} tam={62} /><Frase texto="“call me when you can, baby”" desde={kd(278.6)} y={150} tam={62} /></>} />],
    ]} />
  );
};
// ---------- 58 · el mensaje tiene 19 días: las hojas del calendario se arrancan de a una (1 DAY → 19 DAYS AGO) ----------
// v4: avance CONTINUO (p fraccionaria): la hoja de arriba siempre está saliendo en vuelo (con 2 hojas anteriores todavía cayendo),
// así ningún cuadro queda idéntico al anterior ni hay saltos de 1 cuadro (eran los 5 lageos de v3). Empuje lento de cámara encima.
const P58 = 66;
const p58 = (f: number) => interpolate(f, [0, P58], [0, 18], { ...cl, easing: (t) => t * 0.5 + t * t * 0.5 });
const Hoja58: React.FC<{ t: number; m: number }> = ({ t, m }) => {
  // t 0..2.6: la hoja «m» recién arrancada se despega (en t=0 todavía tapa la nueva), sale a la derecha girando y cae fuera de cuadro
  const u = Math.min(2.6, t);
  const x = 960 + 560 * u, y = 540 - 200 * u + 820 * u * u;
  return <g transform={`rotate(${58 * u} ${x} ${y})`}><HojaCal x={x} y={y} tam={1.7} n={String(m)} sub={m === 1 ? "DAY" : "DAYS"} /></g>;
};
export const Q58Diecinueve: React.FC = () => {
  const f = useF();
  const pop = usePop(P58, 10, 200);
  const p = p58(f);
  const n = Math.min(19, 1 + Math.floor(p));
  const sub = n >= 19 ? "DAYS AGO" : n === 1 ? "DAY" : "DAYS";
  const empuje = interpolate(f, [0, 73], [1, 1.06], cl);
  // hojas en vuelo: cada hoja m se arranca cuando p cruza m y vuela con t = pv − m (continuo; tras P58 sigue a ritmo fijo)
  const pv = f < P58 ? p : 18 + (f - P58) * 0.3;
  const vuelo = [0, 1, 2, 3].map((k) => Math.floor(pv) - k).filter((m) => m >= 1 && m <= 18 && pv - m < 2.6);
  return (
    <Fondo>
      <Lienzo>
        <g transform={`translate(960,540) scale(${empuje}) translate(-960,-540)`}>
          <g opacity={0.5}>{[3, 2, 1].map((k) => <rect key={k} x={960 - 306 + k * 6} y={540 - 340 + k * 8} width={612} height={680} rx={40} fill="#d8d2c6" />)}</g>
          <g transform={`translate(960,540) scale(${n >= 19 ? 1 + 0.08 * pop : 1}) translate(-960,-540)`}><HojaCal x={960} y={540} tam={1.7} n={String(n)} sub={sub} /></g>
          {vuelo.map((m) => <Hoja58 key={m} m={m} t={pv - m} />)}
        </g>
      </Lienzo>
      {n >= 19 && <Placa texto="THE MESSAGE IS 19 DAYS OLD" x={960} y={1010} desde={P58} tam={42} color="#ffd38a" />}
      <Hud2 m={0} est="congelado" />
    </Fondo>
  );
};
/// ---------- 59 · lo tercero: un muerto en andas por la calle (cámara que acompaña, cerrada) → primer plano: la familia llorando detrás ----------
const ANDAS = { hD: 160, cD: 14, hI: 158, cI: 16 };
const k59 = kDe(283.43);
const Cortejo: React.FC<{ x0: number; x1: number; dur: number }> = ({ x0, x1, dur }) => {
  const f = useF();
  const x = interpolate(f, [0, dur], [x0, x1], cl);
  const r = (dx: number) => [{ f: 0, x: x0 + dx, y: KP }, { f: dur, x: x1 + dx, y: KP, curva: "lineal" as const }];
  return (
    <>
      <A look={ALDEANO} seed={61} ruta={r(120)} poses={[{ f: 0, v: ANDAS }]} ajuste={(p) => ({ ...p, ...ANDAS })} caras={[{ f: 0, v: "triste" }]} />
      <A look={ALDEANO} seed={62} ruta={r(-120)} poses={[{ f: 0, v: ANDAS }]} ajuste={(p) => ({ ...p, ...ANDAS })} caras={[{ f: 0, v: "triste" }]} />
      <g transform={`translate(0,${Math.abs(Math.sin(f / 4)) * -6})`}>
        <Camilla x={x} y={KP - 280} /><path d={`M${x - 125},${KP - 312} Q${x - 60},${KP - 360} ${x + 40},${KP - 340} Q${x + 80},${KP - 380} ${x + 115},${KP - 340} L${x + 125},${KP - 312} Z`} fill="#f4ecd8" stroke="#b8a888" strokeWidth={3} />
        {[0, 1, 2].map((k) => <circle key={k} cx={x - 80 + k * 70} cy={KP - 350 - (k % 2) * 10} r={12} fill={["#ffd06a", "#f4a8a0", "#fff2dc"][k]} />)}
      </g>
      <A look={ALDEANA} seed={63} ruta={r(-330)} poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "triste" }]} />
      <A look={ALDEANO} seed={64} ruta={r(-560)} poses={[{ f: 0, v: { hD: 60, cD: 100, hI: 10, cI: 10, tronco: 10, cabeza: 12 } }]} ajuste={(p) => ({ ...p, hD: 60, cD: 100 })} caras={[{ f: 0, v: "triste" }]} />
      <A look={ALDEANA} seed={65} escala={0.8} ruta={r(-450)} poses={[{ f: 0, v: { hD: 150, cD: 30 } }]} caras={[{ f: 0, v: "triste" }]} />
    </>
  );
};
export const Q59Funeral: React.FC = () => {
  const b = k59(287.53);
  const dur = 189;
  const X0 = K.funeral - 420, X1 = K.funeral + 120;
  const xc = (fr: number) => X0 + ((X1 - X0) * fr) / dur;
  return (
    <Tramos t={[
      [0, <Kap cl={[0, 30, 60, 90, 120].filter((q) => q <= b).map((q) => mira(q, xc(q) + 40, 590, 1.8, { curva: "inout" }))} sp={{ portonAbierto: 1 }}
        medio={<Cortejo x0={X0} x1={X1} dur={dur} />}
        hud={<><Pildora texto="III · A DEAD MAN" x={960} y={110} desde={4} color="#ffe2a6" /><Placa texto="CARRIED THROUGH THE STREET" x={960} y={1000} desde={k59(286.39)} tam={40} /></>} />],
      [b, <Desde d={-b}><Kap cl={[mira(b, xc(b) - 330, 650, 3.0), mira(dur, xc(dur) - 330, 650, 3.15)]} sp={{ portonAbierto: 1 }}
        medio={<><Cortejo x0={X0} x1={X1} dur={dur} /><LagrimasCortejo x0={X0 - 330} x1={X1 - 330} dur={dur} /></>}
        hud={<Placa texto="A FAMILY CRYING BEHIND IT" x={960} y={1000} desde={b + 4} tam={42} color="#ffe2a6" />} /></Desde>],
    ]} />
  );
};
const LagrimasCortejo: React.FC<{ x0: number; x1: number; dur: number }> = ({ x0, x1, dur }) => {
  const f = useF();
  const x = interpolate(f, [0, dur], [x0, x1], cl);
  return <Lagrimas x={x} y={640} f={f} dx={20} />;
};
// ---------- 60 · al mediodía, Broadway y Argyle: camina → frena en seco → la bici blanca (detalle) → la ficha del ciclista ----------
const k60 = kDe(289.73);
const QUIETO60 = { hD: 10, cD: 30, hI: 10, cI: 30, tronco: 6 };
export const Q60Bici: React.FC = () => {
  const para = k60(296), c = k60(297.1), d = k60(302.75);
  const XL = BW.ghostbike - 280;
  const kc = kDe(297.1), kd = kDe(302.75);
  return (
    <Tramos t={[
      [0, <Bwy dia cl={[0, 40, 80, 120, 160].map((q) => mira(q, BW.argyle - 800 + ((XL - (BW.argyle - 800)) * Math.min(q, para)) / para + 90, 790, 1.9, { curva: "inout" }))}
        medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.argyle - 800, y: BP }, { f: para, x: XL, y: BP, curva: "lineal" }]} poses={[{ f: 0, v: CAMINA }]}
          ajuste={(p) => BOLSILLOS(p)} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: MIRA_T }, { f: k60(294.2), v: { x: 0.2, y: 0.7 } }]} />}
        hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="NOON · BROADWAY & ARGYLE" desde={6} hasta={k60(294.4)} /><Placa texto="RODE PAST IT · EVERY NIGHT · 2 YEARS" x={960} y={1000} desde={k60(294.6)} tam={40} /></>} />],
      [para, <Bwy dia cl={[mira(0, XL + 150, 760, 2.4), mira(c - para, XL + 170, 760, 2.5)]}
        medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: XL - 30, y: BP }, { f: 6, x: XL, y: BP, curva: "out" }]} poses={[{ f: 0, v: { ...QUIETO60, tronco: -10, cabeza: -8 } }, { f: 8, v: QUIETO60 }]}
          caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.5 } }]} />}
        hud={<Hud2 m={0} est="congelado" />} />],
      [c, <Bwy dia cl={[mira(0, BW.ghostbike + 10, 760, 2.5), mira(d - c, BW.ghostbike + 40, 745, 2.8, { curva: "inout" })]}
        hud={<><Hud2 m={0} est="congelado" /><Placa texto="A BICYCLE" x={480} y={200} desde={2} tam={44} /><Placa texto="PAINTED COMPLETELY WHITE" x={480} y={280} desde={kc(298.17)} tam={44} />
          <Placa texto="CHAINED TO A POLE" x={480} y={360} desde={kc(299.69)} tam={44} /><Placa texto="FLOWERS · A PHOTO" x={480} y={440} desde={kc(301.05)} tam={44} color="#ffd38a" /></>} />],
      [d, <><Memorial edad={kd(304.19)} auto={kd(305.91)} noche={kd(307.99)} /><Hud2 m={0} est="congelado" /></>],
    ]} />
  );
};
// ---------- 61 · «a bike just like his» (primer plano, carteles fuera de cuadro; la mano al pecho) ----------
export const Q61ComoLaSuya: React.FC = () => {
  const f = useF();
  const XL = BW.ghostbike - 280;
  return (
    <Bwy dia cl={[mira(0, XL + 130, 700, 2.6), mira(45, XL + 130, 700, 2.75)]}
      medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: XL, y: BP }]} poses={[{ f: 0, v: { hD: 10, cD: 30, hI: 10, cI: 30 } }, { f: 12, v: { hD: 40, cD: 135, hI: 10, cI: 30, cabeza: 8 } }]} caras={[{ f: 0, v: "triste" }, { f: 12, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.5 } }, { f: 16, v: { x: 0.6, y: 0.8 } }]} />}
      hud={<><Hud2 m={0} est="congelado" /><Burbuja x={1340} y={420} r={190} desde={2} cx={860} cy={420}><rect x={-140} y={-140} width={280} height={280} fill="#e8eef4" /><rect x={-140} y={60} width={280} height={80} fill="#8a8f98" /><BiciDib color="#2a7ac8" jinete t={f / 6} /></Burbuja>
        <Placa texto="JUST LIKE HIS" x={1340} y={700} desde={6} tam={46} color="#ffd38a" /></>} />
  );
};
// ---------- 62 · Leo se queda parado mucho tiempo: time-lapse (la sombra gira, los autos rayan, él cambia de postura a saltos) ----------
const POSTURAS62 = [
  { hD: 10, cD: 30, hI: 10, cI: 30 },
  { hD: 20, cD: 150, hI: 20, cI: 150, tronco: 4 },
  { hD: 6, cD: 20, hI: 6, cI: 20, cabeza: 18, tronco: 8 },
  { hD: 40, cD: 135, hI: 10, cI: 30, cabeza: 6 },
  { hD: 10, cD: 30, hI: 10, cI: 30, cabeza: -6 },
];
export const Q62Parado: React.FC = () => {
  const f = useF();
  const h = 12 * 60 + f * 2.6;
  const hh = Math.floor(h / 60);
  const XL = BW.ghostbike - 280;
  const tarde = lerp(f, 0, 75, 0, 1);
  return (
    <>
      <Bwy dia cl={[mira(0, XL + 160, 790, 2.0), mira(75, XL + 160, 790, 2.0)]}
        medio={<>
          <SombraGira x={XL} piso={BP + 4} ang={-70 + f * 1.9} largo={240 + Math.abs(-70 + f * 1.9) * 2} />
          <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: XL, y: BP }]} poses={POSTURAS62.map((v, i) => ({ f: i * 15, v }))} ajuste={(p, fr) => ({ ...p, ...POSTURAS62[Math.min(4, Math.floor(fr / 15))] })}
            caras={[{ f: 0, v: "triste" }, { f: 30, v: "neutral" }, { f: 45, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.5 } }, { f: 30, v: { x: 0.6, y: 0.8 } }, { f: 60, v: { x: 0.9, y: 0.4 } }]} />
          {[0, 1, 2, 3, 4].map((q) => <Auto key={q} x={interpolate((f + q * 7) % 14, [0, 14], q % 2 ? [XL + 1300, XL - 1500] : [XL - 1500, XL + 1300])} piso={BP + 120 + (q % 2) * 60} dir={q % 2 ? -1 : 1} color={["#c8403a", "#3a6ac8", "#e0b040", "#4a8a5a", "#8a5ac8"][q]} />)}
        </>}
        hud={<><Hud2 m={0} est="congelado" /><div style={{ position: "absolute", left: 1460, top: 150, background: "#16151add", borderRadius: 18, padding: "10px 26px", fontFamily: F_HUD, fontWeight: 700, fontSize: 64, color: "#f4efe6", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{hh > 12 ? hh - 12 : 12}:{String(Math.floor(h % 60)).padStart(2, "0")} PM</div>
          <Placa texto="A LONG TIME" x={960} y={1000} desde={10} tam={54} color="#ffd38a" /></>} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,150,80,0.0), rgba(255,140,70,0.35))", opacity: tarde, mixBlendMode: "multiply", pointerEvents: "none" }} />
    </>
  );
};
// ---------- 63 · lo cuarto: un monje que camina despacio, sin nada, con una cara tan calma (se detiene por un chico) ----------
const k63 = kDe(313.2);
const CUENCO = <Recto ang={150}><g transform="translate(0,10)"><Cuenco s={0.9} /></g></Recto>;
export const Q63Monje: React.FC = () => (
  <Kap cl={[mira(0, K.monje - 320, 620, 1.35), mira(150, K.monje - 160, 630, 1.6, { curva: "inout" }), mira(260, K.monje - 120, 640, 2.0, { curva: "inout" }), mira(354, K.monje - 60, 640, 2.2)]} sp={{ portonAbierto: 1 }}
    medio={<>
      <A look={ALDEANO} seed={74} escala={0.78} ruta={[{ f: 0, x: K.monje + 260, y: KP }, { f: 120, x: K.monje + 260, y: KP }, { f: 160, x: K.monje - 20, y: KP }, { f: 220, x: K.monje - 20, y: KP }, { f: 270, x: K.monje + 300, y: KP }]} dir={[{ f: 0, v: -1 }, { f: 222, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: 165, v: { hD: 110, cD: 30, hI: 20, cI: 20 } }, { f: 222, v: CAMINA }]} caras={[{ f: 0, v: "feliz" }, { f: 180, v: "risa" }]} />
      <A look={MONJE_JOVEN} seed={70} ruta={[{ f: 0, x: K.monje - 420, y: KP }, { f: 150, x: K.monje - 140, y: KP, curva: "lineal" }, { f: 240, x: K.monje - 140, y: KP }, { f: 354, x: K.monje + 60, y: KP, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }, { f: 160, v: { hD: 60, cD: 60, hI: 30, cI: 120, tronco: 12, cabeza: 10 } }, { f: 230, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }]}
        enManoI={CUENCO} caras={[{ f: 0, v: "feliz" }, { f: 165, v: "risa" }, { f: 230, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.2 } }, { f: 155, v: { x: 0.6, y: 0.6 } }, { f: 230, v: { x: 0.9, y: 0.1 } }]} />
    </>} hud={<><Pildora texto="IV · A MONK" x={960} y={110} desde={4} color="#ffe2a6" /><Etiqueta texto="NOTHING · AND SO CALM" x={960} y={215} desde={k63(320)} tam={44} color="#fff2c8" /></>} />
);
// ---------- 64 · «who is that, Channa?»: Siddhartha (dibujado delante) se inclina y señala al monje que pasa al fondo; Channa gira a mirar ----------
export const Q64Quien: React.FC = () => {
  const f = useF();
  const X = K.monje - 580;
  return (
    <Kap cl={[mira(0, K.monje - 330, 590, 1.6), mira(49, K.monje - 310, 590, 1.68)]} sp={{ portonAbierto: 1 }}
      medio={<>
        <A look={MONJE_JOVEN} seed={70} ruta={[{ f: 0, x: K.monje + 20, y: KP }, { f: 49, x: K.monje + 60, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }]} enManoI={CUENCO} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }]} />
        <Carroza x={X} piso={KP} rueda={0} paso={f} />
        <A look={CHANNA} seed={34} ruta={[{ f: 0, x: X + 90, y: KP - 95 }]} asiento={[{ f: 0, v: 50 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }]} caras={[{ f: 0, v: "neutral" }, { f: 16, v: "duda" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0 } }, { f: 22, v: { x: -0.9, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: 22, v: -0.3 }]} />
        <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: X - 40, y: KP - 95 }]} asiento={[{ f: 0, v: 50 }]} poses={[{ f: 0, v: SENTADO }, { f: 8, v: { ...SENTADO, hD: 72, cD: 0, hI: 30, cI: 30, tronco: 14, cabeza: 2 } }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }]} habla={[[0, 45]]} />
      </>}
      hud={<Etiqueta texto="?" x={1560} y={440} desde={10} tam={110} color="#ffd38a" />} />
  );
};
/// ---------- 65 · «a man who left everything» (primer plano del monje: junta las manos y se inclina) → contraplano: Channa le explica al príncipe «to find out why we suffer» ----------
const k65 = kDe(326.63);
const REZA = { hD: 14, cD: 118, hI: 14, cI: 118 };
export const Q65Dejo: React.FC = () => {
  const b = k65(328.9);
  return (
    <Tramos t={[
      [0, <Kap cl={[mira(0, K.monje + 180, 650, 2.8), mira(b, K.monje + 200, 655, 2.95)]} sp={{ portonAbierto: 1 }}
        medio={<A look={MONJE_JOVEN} seed={70} ruta={[{ f: 0, x: K.monje + 140, y: KP }, { f: 18, x: K.monje + 200, y: KP, curva: "out" }]}
          poses={[{ f: 0, v: { hD: 10, cD: 20, hI: 10, cI: 20 } }, { f: 22, v: REZA }, { f: 36, v: { ...REZA, tronco: 20, cabeza: 14 } }, { f: 56, v: { ...REZA, tronco: 4, cabeza: 2 } }]}
          caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }, { f: 30, v: { x: -0.2, y: 0.7 } }, { f: 56, v: { x: -0.6, y: 0 } }]} />}
        hud={<Placa texto="A MAN WHO LEFT EVERYTHING" x={960} y={980} desde={6} tam={48} color="#fff2c8" />} />],
      [b, <Kap cl={[mira(0, K.viejo - 230, 620, 2.4), mira(135 - b, K.viejo - 225, 615, 2.55)]} sp={{ portonAbierto: 1 }}
        medio={<CarrozaQuieta caraC="neutral" caraS="sorpresa" miraC={{ x: -0.9, y: 0 }} hablaC={[[0, 50]]} posesC={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }, { f: 8, v: { ...SENTADO, hD: 80, cD: 40, hI: 60, cI: 30, tronco: -4 } }, { f: 30, v: { ...SENTADO, hD: 50, cD: 90, hI: 60, cI: 30, cabeza: 6 } }]} />}
        hud={<Placa texto="TO FIND OUT WHY WE SUFFER" x={960} y={130} desde={2} tam={50} color="#ffd38a" />} />],
    ]} />
  );
};
// ---------- 66 · esa noche mira su palacio: la música, la seda, el jardín… una jaula hermosa ----------
export const Q66Jaula: React.FC = () => {
  const f = useF();
  const r = interpolate(f, [60, 150], [0, 1], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) });
  const yb = interpolate(r, [0, 1], [-1080, 0]);
  return (
    <>
      <Kap cl={[mira(0, K.jardin - 30, 610, 2.0), mira(110, K.jardin - 20, 600, 1.4, { curva: "inout" }), mira(262, K.jardin, 470, 0.85, { curva: "inout" })]} sp={{ noche: true, flores: 0.5 }}
        medio={<A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.jardin, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.5, y: -0.3 } }, { f: 70, v: { x: -0.3, y: -0.8 } }]} poses={[{ f: 0, v: "parado" }, { f: 70, v: { hD: 120, cD: 30, hI: 10, cI: 10, cabeza: -10 } }, { f: 160, v: { hD: 40, cD: 100, hI: 10, cI: 10, cabeza: -6 } }]} />} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: Math.min(1, r * 1.4) }}>
        <path d={`M120,${yb} Q960,${yb - 480} 1800,${yb}`} stroke="#f2c14a" strokeWidth={18} fill="none" />
        {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={120 + i * 140} y={yb} width={14} height={1080} fill="#f2c14a" opacity={0.85} />)}
      </svg>
      <Etiqueta texto="A BEAUTIFUL CAGE" x={960} y={140} desde={170} tam={58} color="#ffd38a" />
    </>
  );
};
/// ---------- 67 · besa a su hijo dormido (noche con luz de luna/antorcha) → en el portón mira atrás una vez y sale a la oscuridad ----------
const k67 = kDe(339.88);
const Nocturno: React.FC<{ children: React.ReactNode; luz?: [number, number] }> = ({ children, luz = [1300, 300] }) => (
  <>
    <div style={{ position: "absolute", inset: 0, filter: "brightness(1.38) saturate(1.05)" }}>{children}</div>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", background: `radial-gradient(circle at ${luz[0]}px ${luz[1]}px, rgba(255,196,120,0.22) 0%, rgba(255,170,90,0.08) 30%, rgba(0,0,0,0) 60%)` }} />
  </>
);
export const Q67Sale: React.FC = () => {
  const b = k67(341.85);
  return (
    <Tramos t={[
      [0, <Nocturno luz={[1250, 380]}><Kap cl={[mira(0, K.cuna + 60, 660, 2.6), mira(b, K.cuna + 70, 665, 2.75)]} sp={{ noche: true }}
        medio={<><Bebe x={K.cuna} /><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.cuna + 125, y: KP }]} dir={[{ f: 0, v: -1 }, { f: b - 8, v: 1 }]}
          poses={[{ f: 0, v: { tronco: 6, cabeza: 4, hD: 30, cD: 20, hI: 30, cI: 20 } }, { f: 12, v: { tronco: 42, cabeza: 26, hD: 20, cD: 60, hI: 20, cI: 60 } }, { f: 36, v: { tronco: 42, cabeza: 26, hD: 20, cD: 60, hI: 20, cI: 60 } }, { f: 46, v: { tronco: 4, cabeza: -4, hD: 10, cD: 20, hI: 10, cI: 20 } }]}
          caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.8 } }, { f: 46, v: { x: -0.6, y: 0.3 } }]} />
          </>}
        hud={<><Placa texto="GOODBYE" x={960} y={980} desde={k67(341.12)} tam={50} color="#ffe2a6" /></>} /></Nocturno>],
      [b, <Nocturno luz={[1500, 260]}><Kap cl={[mira(0, K.porton - 160, 620, 1.75), mira(117 - b, K.porton + 20, 610, 1.85, { curva: "inout" })]} sp={{ noche: true, portonAbierto: 1 }}
        medio={<A look={SIDDHARTHA} seed={30} luz={rimOro} ruta={[{ f: 0, x: K.porton - 330, y: KP }, { f: 14, x: K.porton - 120, y: KP, curva: "out" }, { f: 30, x: K.porton - 120, y: KP }, { f: 60, x: K.porton + 260, y: KP, curva: "in" }]}
          dir={[{ f: 0, v: 1 }, { f: 16, v: -1 }, { f: 30, v: 1 }]} poses={[{ f: 0, v: CAMINA }, { f: 14, v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: 4 } }, { f: 30, v: CAMINA }]}
          caras={[{ f: 0, v: "triste" }, { f: 30, v: "determinado" }]} opacidad={(fr: number) => interpolate(fr, [50, 64], [1, 0], cl)} />}
        hud={<Placa texto="INTO THE DARK" x={960} y={980} desde={10} tam={50} color="#ffe2a6" />} /></Nocturno>],
    ]} />
  );
};
// ---------- 68 · tres de la mañana. Día tres: la hoja del 2 cae enseguida y queda el 3; Leo camina encorvado contra el frío, con vaho ----------
export const Q68Dia3: React.FC = () => {
  const f = useF();
  const x = interpolate(f, [0, 78], [BW.puertaLav + 560, BW.puertaLav + 170], cl);
  const pop = usePop(22, 10, 200);
  return (
    <>
      <Bwy cl={[mira(0, BW.puertaLav + 420, 640, 1.75), mira(78, BW.puertaLav + 300, 640, 1.85)]} sp={{ tren: 20 }}
        medio={<><A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.puertaLav + 560, y: BP }, { f: 78, x: BW.puertaLav + 170, y: BP, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { ...CAMINA, tronco: 10, cabeza: 6 } }]} ajuste={BOLSILLOS} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: MIRA_L }]} />
          <Vaho x={x - 50} y={BP - 270} f={f} dir={-1} /></>}
        hud={<>{H3}<Rotulo texto="3:00 AM" desde={4} /></>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(330,400) scale(${1 + 0.1 * pop}) translate(-330,-400)`}><HojaCal x={330} y={400} n="3" sub="DAY" tam={0.8} /></g>
        <g opacity={1 - lerp(f, 16, 24, 0, 1)}><HojaCal x={330} y={400} n="2" sub="DAY" tam={0.8} caida={lerp(f, 2, 22, 0, 0.75)} /></g>
      </svg>
    </>
  );
};
// ---------- 69 · Leo entra → inserto: las manos de Tenzo doblan la toalla, despacio, punta con punta ----------
const k69 = kDe(346.38);
export const Q69Toalla: React.FC = () => {
  const b = k69(348.2);
  const kb = kDe(348.2);
  return (
    <Tramos t={[
      [0, <Lav cl={[mira(0, 2050, 610, 1.6), mira(b, 1880, 620, 1.75, { curva: "inout" })]} toalla={0}
        tenzo={{ poses: doblando(0, b, 40), miradas: [{ f: 0, v: { x: -0.3, y: 0.7 } }] }} leo={{ ruta: [{ f: 0, x: 2400, y: LP }, { f: b, x: 2020, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: CAMINA }], ajuste: BOLSILLOS, enManoD: null, caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
        hud={<>{H3}<Placa texto="INTO THE LAUNDROMAT" x={960} y={980} desde={6} tam={42} /></>} />],
      [b, <><DoblaToalla p1={[4, kb(350.6)]} p2={[kb(350.9), kb(352.0)]} />{H3}
        <Placa texto="SLOWLY" x={960} y={140} desde={kb(350.14)} hasta={kb(350.85)} tam={56} color="#ffd38a" />
        <Placa texto="CORNER TO CORNER" x={960} y={140} desde={kb(350.9)} tam={56} color="#ffd38a" /></>],
    ]} />
  );
};
// ---------- 70 · plano medio: Tenzo le tiende el tel «here, like I promised» → primer plano: la mano de Leo sube, duda… y baja ----------
const k70 = kDe(352.16);
const TIENDE = { ...SENTADO, hD: 85, cD: 5, hI: 20, cI: 40, tronco: 4, cabeza: 2 };
export const Q70Tiende: React.FC = () => {
  const b = k70(355.9);
  return (
    <Tramos t={[
      [0, <Lav cl={[mira(0, 1840, 640, 2.2), mira(b, 1850, 640, 2.35)]} toalla={1}
        tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 18, v: TIENDE }], enManoD: <Tel s={1.1} prendido={false} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], dir: [{ f: 0, v: 1 }], habla: [[k70(353.86), k70(355.6)]] }}
        leo={{ ruta: [{ f: 0, x: 2020, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: CAMINA }], ajuste: BOLSILLOS, enManoD: null, caras: [{ f: 0, v: "neutral" }, { f: 40, v: "duda" }], miradas: [{ f: 0, v: { x: -0.4, y: 0.5 } }] }}
        hud={<>{H3}<Placa texto="HE HOLDS OUT THE PHONE" x={960} y={980} desde={4} hasta={k70(353.8)} tam={42} /><Placa texto="«HERE, LIKE I PROMISED.»" x={1010} y={150} desde={k70(353.86)} tam={50} color="#ffd38a" /></>} />],
      [b, <Lav cl={[mira(0, 1960, 620, 3.0), mira(149 - b, 1965, 620, 3.1)]} toalla={1}
        tenzo={{ poses: [{ f: 0, v: TIENDE }], enManoD: <Tel s={1.1} prendido={false} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], dir: [{ f: 0, v: 1 }] }}
        leo={{ ruta: [{ f: 0, x: 2020, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }],
          poses: [{ f: 0, v: { hD: -12, cD: 34, hI: -12, cI: 34 } }, { f: 7, v: { hD: 50, cD: 30, hI: -12, cI: 34 } }, { f: 11, v: { hD: 64, cD: 18, hI: -12, cI: 34, tronco: 6 } }, { f: 15, v: { hD: 56, cD: 34, hI: -12, cI: 34, tronco: 2, cabeza: 4 } },
            { f: 19, v: { hD: 62, cD: 22, hI: -12, cI: 34, tronco: 4 } }, { f: 27, v: { hD: 4, cD: 24, hI: -12, cI: 34, cabeza: 10, tronco: -2 } }],
          ajuste: (p, fr) => (fr > 11 && fr < 22 ? { ...p, cD: (p.cD ?? 0) + Math.sin(fr * 2.4) * 5 } : p),
          enManoD: null, caras: [{ f: 0, v: "duda" }, { f: 21, v: "triste" }], miradas: [{ f: 0, v: { x: -0.7, y: 0.5 } }, { f: 22, v: { x: -0.3, y: 0.9 } }] }}
        hud={<>{H3}<Placa texto="LEO LOOKS AT IT" x={1010} y={150} desde={4} tam={42} /></>} />],
    ]} />
  );
};
// ---------- 71 · ochenta y siete notificaciones ----------
export const Q71Ochenta: React.FC = () => {
  const f = useF();
  const n = Math.round(interpolate(f, [4, 46], [0, 87], { ...cl, easing: (t) => 1 - (1 - t) * (1 - t) }));
  return (
    <Fondo>
      <TelMarco x={960} y={560} s={0.82} vib={f < 50 ? 6 : 0}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F_HUD }}>
          <div style={{ fontSize: 230, fontWeight: 700, color: "#ff6a2b", lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: 40, letterSpacing: 4, color: "#c9ccd2", fontWeight: 600 }}>NOTIFICATIONS</div>
        </div>
      </TelMarco>
      <Lienzo><Anillos x={960} y={560} f={f} r0={300} /></Lienzo>
      {H3}
    </Fondo>
  );
};
// ---------- 72 · no lo agarra: por encima del hombro de Tenzo, su mano con el tel apagado; Leo niega y cruza los brazos ----------
export const Q72NoAgarra: React.FC = () => {
  const f = useF();
  const niega = f > 6 && f < 34 ? Math.sin((f - 6) * 0.55) * 9 : 0;
  return (
    <>
      <Lav cl={[mira(0, 1840, 600, 2.2), mira(41, 1850, 600, 2.3)]} toalla={1} tenzo={{ no: true }}
        leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 62, cD: 20, hI: 10, cI: 20 } }, { f: 12, v: { hD: 10, cD: 120, hI: 10, cI: 120, tronco: -4 } }], enManoD: null,
          caras: [{ f: 0, v: "duda" }, { f: 14, v: "triste" }], miradas: [{ f: 0, v: { x: -0.9, y: 0.3 } }, { f: 16, v: { x: -0.5, y: 0.6 } }], ajuste: (p) => ({ ...p, cabeza: (p.cabeza ?? 0) + niega }) }} hud={H3} />
      <Lienzo><TelSvg x={lerp(f, 0, 30, 560, 590)} y={640} w={110} ang={-8} prendido={0} /><ManoGrande x={lerp(f, 0, 30, 470, 500)} y={720} ang={98} piel="#f2bf8f" manga="#8e8a82" s={1.15} /></Lienzo>
      <Silueta lado="izq" pelo="calvo" borde="#ffc46a" />
    </>
  );
};
// ---------- 73 · «I saw an old man… my mom is sick… a white bike on Argyle… how did I not see any of it?» ----------
const k73 = kDe(360.32);
export const Q73Vi: React.FC = () => (
  <Lav cl={[mira(0, 1880, 620, 1.9), mira(323, 1890, 625, 2.15, { curva: "inout" })]} tenzo={{ no: true }} toalla={1}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }, { f: k73(366), v: { hD: 30, cD: 140, hI: 30, cI: 140, cabeza: 10 } }, { f: k73(369.2), v: { hD: 70, cD: 60, hI: 65, cI: 60, tronco: -4 } }], enManoD: null,
      caras: [{ f: 0, v: "duda" }, { f: k73(363), v: "triste" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k73(365.24)], [k73(365.32), k73(367.38)], [k73(369.18), k73(370.56)]] }}
    hud={<>{H3}
      <Burbuja x={420} y={330} r={135} desde={k73(360.6)} cx={760} cy={480}><ViejoDib /></Burbuja>
      <Burbuja x={760} y={210} r={120} desde={k73(365.4)} cx={900} cy={420}><MamaDib /></Burbuja>
      <Burbuja x={1460} y={260} r={130} desde={k73(367.5)} cx={1060} cy={430}><rect x={-120} y={-120} width={240} height={240} fill="#e8eef4" /><rect x={-120} y={60} width={240} height={60} fill="#8a8f98" /><BiciDib color="#f4f4f4" /></Burbuja>
      <ManoLeo texto="how did I not see it?" x={180} y={640} desde={k73(369.2)} tam={84} /></>} />
);
// ---------- 74 · «because the palace was very beautiful… it just never shows you the road» (contraplano; dibuja el camino) ----------
const k74 = kDe(371.1);
export const Q74Hermoso: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 1620, 640, 2.0), mira(266, 1630, 635, 2.25, { curva: "inout" })]} leo={{ no: true }} toalla={1}
      tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, hD: 40, cD: 30 } }, { f: k74(377.4), v: { ...SENTADO, hD: 110, cD: 10, hI: 20, cI: 30 } }, { f: k74(379), v: { ...SENTADO, hD: 70, cD: 20, hI: 20, cI: 30 } }], enManoI: <Tel s={1.1} prendido={false} />, dir: [{ f: 0, v: 1 }],
        caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_T }, { f: k74(377.4), v: { x: 0.9, y: -0.3 } }], habla: [[0, k74(372.6)], [k74(374.28), k74(375.8)], [k74(375.9), k74(377.4)], [k74(377.46), k74(379.08)]] }}
      hud={<>{H3}<Placa texto="THE PALACE WAS VERY BEAUTIFUL" x={1180} y={150} desde={k74(371.3)} hasta={k74(377.3)} tam={44} color="#fff2c8" />
        <Lienzo><Trazo d="M1060,560 Q1300,420 1500,470 Q1700,520 1860,330" p={lerp(f, k74(377.5), k74(379.3), 0, 1)} color="#ffd38a" w={12} guiones /></Lienzo>
        <Placa texto="IT NEVER SHOWS YOU THE ROAD" x={1180} y={150} desde={k74(377.5)} tam={44} color="#ffd38a" /></>} />
  );
};
const k75 = kDe(379.96);
// ---------- 75 · «so what do I do? Throw it in the lake?» (primer plano: amaga y "tira" el tel; el tel vuela en arco a la burbuja del lago y salpica) ----------
export const Q75Lago: React.FC = () => {
  const f = useF();
  const vu = lerp(f, 44, 58, 0, 1);
  const px = lerp(vu, 0, 1, 1040, 660), py = 430 - Math.sin(vu * Math.PI) * 260 + vu * -60;
  const salpica = f >= 58 ? Math.min(1, (f - 58) / 10) : 0;
  return (
    <Lav cl={[mira(0, 1840, 630, 2.6), mira(78, 1845, 630, 2.75)]} tenzo={{ no: true }} toalla={1}
      leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }],
        poses: [{ f: 0, v: { hD: 40, cD: 90, hI: 40, cI: 90 } }, { f: 22, v: { hD: 60, cD: 60, hI: 10, cI: 20 } }, { f: 36, v: { hD: 175, cD: 80, hI: 30, cI: 30, tronco: -16, cabeza: -8 } }, { f: 41, v: { hD: 110, cD: 20, hI: 30, cI: 30, tronco: 4 } }, { f: 44, v: { hD: 65, cD: 0, hI: 30, cI: 30, tronco: 16, cabeza: 8 } }, { f: 60, v: { hD: 30, cD: 30, hI: 20, cI: 30, tronco: 4 } }],
        enManoD: null, caras: [{ f: 0, v: "duda" }, { f: 34, v: "enojo" }, { f: 56, v: "picaro" }], miradas: [{ f: 0, v: { x: -0.6, y: 0.3 } }, { f: 44, v: { x: -0.9, y: -0.4 } }], habla: [[0, 70]] }}
      hud={<>{H3}
        <Burbuja x={560} y={320} r={170} desde={30} cx={860} cy={470}><LagoDib t={salpica} />
          {salpica > 0 && [0, 1, 2].map((k) => <circle key={k} cx={(k - 1) * 40} cy={-20 - salpica * 20 * (k % 2 ? 2 : 1)} r={10 + salpica * 18} fill="none" stroke="#ffffff" strokeWidth={5} opacity={1 - salpica * 0.7} />)}
          {salpica > 0 && [0, 1, 2, 3].map((k) => <circle key={`b${k}`} cx={-30 + k * 22} cy={10 - ((f - 58 + k * 5) % 20) * 3} r={6} fill="#eaf6ff" stroke="#6a9ac0" strokeWidth={2} />)}
        </Burbuja>
        {f >= 44 && f < 60 && <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <path d="M1040,430 Q850,120 660,370" stroke="#ffffff" strokeWidth={5} strokeDasharray="14 14" fill="none" opacity={0.7} />
          <g transform={`translate(${px},${py}) rotate(${vu * 540})`}><rect x={-20} y={-36} width={40} height={72} rx={8} fill="#15151a" stroke="#f4efe6" strokeWidth={3} /></g>
        </svg>}
        <Placa texto="THROW IT IN THE LAKE?" x={960} y={990} desde={k75(381.2)} tam={46} color="#ffd38a" />
      </>} />
  );
};
// ---------- 76 · primer plano: Tenzo se ríe bajito → dos-planos: abre un portón imaginario con las dos manos → gráfico: todos los días, una vez ----------
const k76 = kDe(382.58);
export const Q76Porton: React.FC = () => {
  const b = k76(385.5), c = k76(389.3);
  const kb = kDe(385.5), kc = kDe(389.3);
  const abre = kb(387.52);
  return (
    <Tramos t={[
      [0, <Lav cl={[mira(0, 1700, 660, 2.9), mira(b, 1700, 660, 3.05)]} toalla={1}
        tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, hD: 40, cD: 30 } }], ajuste: (p, fr) => ({ ...p, tronco: -6 + Math.sin(fr * 0.9) * 5 * (fr > 10 ? 1 : 0), cabeza: -8 + Math.sin(fr * 0.9 + 1) * 4, hI: 40, cI: 120 }), enManoD: null, dir: [{ f: 0, v: 1 }],
          caras: [{ f: 0, v: "risa" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.6 } }] }}
        leo={{ no: true }}
        hud={<>{H3}<Placa texto="A SMALL, SOFT LAUGH" x={960} y={990} desde={k76(383.6)} tam={44} color="#fff2c8" /></>} />],
      [b, <Lav cl={[mira(0, 1820, 640, 2.2), mira(c - b, 1830, 640, 2.35)]} toalla={1}
        tenzo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 40, cD: 60, hI: 40, cI: 60 } }, { f: abre - 12, v: { ...SENTADO, hD: 40, cD: 90, hI: -40, cI: -90, tronco: 4 } }, { f: abre - 4, v: { ...SENTADO, hD: 50, cD: 100, hI: -50, cI: -100, tronco: 6 } },
          { f: abre + 10, v: { ...SENTADO, hD: 118, cD: 8, hI: -118, cI: -8, cabeza: -6, tronco: -4 } }], giros: [{ f: 0, v: 0.6 }, { f: abre - 14, v: 0 }], enManoD: null, dir: [{ f: 0, v: 1 }],
          caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_T }], habla: [[2, c - b]] }}
        leo={{ ruta: [{ f: 0, x: 1990, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }, { f: abre + 6, v: { hD: 10, cD: 30, hI: 10, cI: 30 } }], enManoD: null, caras: [{ f: 0, v: "duda" }, { f: abre + 6, v: "sorpresa" }], miradas: [{ f: 0, v: MIRA_L }] }}
        hud={<>{H3}<Placa texto="HE DID NOT BURN THE PALACE" x={960} y={130} desde={2} hasta={abre} tam={46} color="#fff2c8" />
          <Burbuja x={980} y={300} r={150} desde={abre - 4} cx={700} cy={500}><PortonAbre desde={abre} /></Burbuja>
          <Placa texto="HE JUST WALKED OUT OF THE GATE" x={960} y={990} desde={abre} tam={46} color="#ffd38a" /></>} />],
      [c, <><CicloPorton t={{ cada: kc(389.36), sale: kc(390.18), una: kc(391.22), mira: kc(392.04), vuelve: kc(393.14) }} />{H3}</>],
    ]} />
  );
};
const PortonAbre: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  return <PortonDib a={lerp(f, desde, desde + 30, 0, 1)} />;
};
// ---------- 77 · Leo agarra el tel (inserto: la mano de Leo lo levanta de la palma de Tenzo) · no lo abre: se lo guarda en el bolsillo ----------
const k77 = kDe(395.1);
const ManosToma: React.FC<{ t: number }> = ({ t }) => {
  const va = suave(Math.min(1, t / 0.5)), sube = suave(Math.max(0, (t - 0.5) / 0.5));
  const PX = 1330, PY = 870 + sube * 30;
  const lx = 260 + va * 760 - sube * 520, ly = 360 + va * 330 - sube * 420;
  const tx = sube > 0 ? lx + 70 : PX - 60, ty = sube > 0 ? ly - 70 : PY - 100;
  return (
    <Lienzo>
      <defs><radialGradient id="farol77"><stop offset="0" stopColor="#ffc46a" stopOpacity={0.5} /><stop offset="1" stopColor="#ffc46a" stopOpacity={0} /></radialGradient><filter id="bok77"><feGaussianBlur stdDeviation="14" /></filter></defs>
      <rect width={1920} height={1080} fill="#2a2621" />
      <g filter="url(#bok77)" opacity={0.55}>{[0, 1, 2, 3, 4].map((k) => <g key={k}><rect x={-60 + k * 420} y={40} width={360} height={420} rx={20} fill="#d8d4cc" opacity={0.35} /><circle cx={120 + k * 420} cy={250} r={120} fill="#1e1d1f" opacity={0.7} /></g>)}</g>
      <circle cx={1500} cy={300} r={620} fill="url(#farol77)" />
      <rect x={-200} y={880} width={2400} height={400} fill="#4a463e" />
      <ManoGrande x={PX} y={PY} ang={-40} piel="#f2bf8f" manga="#8e8a82" palma s={1.5} />
      <TelSvg x={tx} y={ty} w={150} ang={sube > 0 ? -8 - (1 - sube) * 54 : -62} prendido={0} reflejo={0.6} />
      <ManoGrande x={lx} y={ly} ang={100 + sube * 20} piel="#ecc9a3" manga="#24242a" s={1.2} />
    </Lienzo>
  );
};
export const Q77Agarra: React.FC = () => {
  const f = useF();
  const c = k77(396.4);
  if (f < c) return <AbsoluteFill><ManosToma t={lerp(f, 2, c - 4, 0, 1)} />{H3}</AbsoluteFill>;
  return (
    <Lav cl={[mira(c, 1870, 590, 1.65), mira(93, 1880, 590, 1.75)]} toalla={1}
      tenzo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 10, cD: 120, hI: 10, cI: 120, cabeza: 4 } }], enManoD: null, dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_T }] }}
      leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }],
        poses: [{ f: 0, v: { hD: 15, cD: 75, hI: 10, cI: 20, cabeza: 14 } }, { f: k77(397.0), v: { hD: 18, cD: 70, hI: 25, cI: 70, cabeza: 18 } }, { f: k77(397.5), v: { hD: 15, cD: 75, hI: 10, cI: 20, cabeza: 12 } }, { f: k77(397.9), v: BOLSILLOS({ hD: 0, cD: 0, hI: 0, cI: 0, cabeza: 2 }) }],
        enManoD: (fr: number) => (fr < k77(397.8) ? <Tel prendido={false} /> : null), caras: [{ f: 0, v: "duda" }, { f: k77(397.5), v: "determinado" }], miradas: [{ f: 0, v: { x: -0.3, y: 0.7 } }, { f: k77(397.6), v: MIRA_L }] }}
      hud={<>{H3}<ManoLeo texto="doesn't open it" x={1180} y={200} desde={k77(396.6)} tam={84} /></>} />
  );
};
// ---------- 78 · hace algo que no hizo en 19 días: llama a su madre. Suena. Una. Dos. «Leo, baby, is that you?» ----------
const k78 = kDe(398.2);
export const Q78Llama: React.FC = () => {
  const f = useF();
  const pant = (f >= k78(400.9) && f < k78(403.3)) || (f >= k78(404.3) && f < k78(405.9));
  if (!pant) return (
    <Lav cl={[mira(0, 1900, 620, 2.2), mira(310, 1905, 615, 2.6, { curva: "inout" })]} tenzo={{ no: true }} toalla={1}
      leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 30, cD: 110, hI: 10, cI: 20 } }, { f: k78(400.4), v: { hD: 40, cD: 150, hI: 10, cI: 20, cabeza: 6 } }, { f: k78(405.9), v: { hD: 30, cD: 160, hI: 50, cI: 120, cabeza: 10 } }], enManoD: <Tel />,
        caras: [{ f: 0, v: "duda" }, { f: k78(403.3), v: "miedo" }, { f: k78(405.94), v: "triste" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.6 } }, { f: k78(400.4), v: { x: -0.6, y: 0 } }] }}
      hud={<>{H3}<Placa texto="FIRST TIME IN 19 DAYS" x={1180} y={150} desde={10} hasta={k78(400.9)} tam={44} />{f >= k78(405.94) && <Placa texto="«LEO, BABY… IS THAT YOU?»" x={1100} y={150} desde={k78(406)} tam={50} color="#ffd38a" />}</>} />
  );
  const uno = f < k78(404.96);
  return (
    <Fondo>
      <TelMarco x={960} y={560} s={0.82} vib={Math.floor(f / 6) % 2 ? 7 : 0}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 170, fontFamily: F_HUD }}>
          <div style={{ width: 170, height: 170, borderRadius: 85, background: "#ff6a2b", color: "#fff", fontSize: 90, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>D</div>
          <div style={{ fontSize: 70, color: "#f4efe6", fontWeight: 700, marginTop: 30 }}>MOM</div>
          <div style={{ fontSize: 36, color: "#9aa3ad", letterSpacing: 3 }}>{f < k78(403.22) ? "CALLING…" : "RINGING"}</div>
        </div>
      </TelMarco>
      <Lienzo><Anillos x={960} y={420} f={f} r0={160} /></Lienzo>
      {f >= k78(403.22) && <Etiqueta texto={uno ? "ONE" : "TWO"} x={1460} y={420} desde={uno ? k78(403.22) : k78(404.96)} tam={90} color="#ff6a2b" />}
      {H3}
    </Fondo>
  );
};
// ---------- 79 · día cuatro. Screen time: 2 h 06 m (baja desde 9 h 12 m) ----------
export const Q79Dia4: React.FC = () => <Fondo><TelGrande modo="screentime" min={552} minHasta={126} x={1250} desde={0} /><Hud2 m={126} dia={4} /><Rotulo texto="DAY 4 · 2H 06M" desde={4} /><ManoLeo texto="from 9h 12m" x={150} y={330} desde={20} tam={96} /><ManoLeo texto="to 2h 06m" x={150} y={470} desde={70} tam={96} /></Fondo>;
/// ---------- 80 · 2 AM: Leo da vueltas en la cama → inserto: el tel se prende en la mesita → la sombra se inclina en 2 tiempos, más grande que nunca ----------
const k80 = kDe(412.88);
const ACOST = { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 10, cD: 20, hI: 10, cI: 20 };
const MaraCrece: React.FC<{ s1: number; s2: number; habla: [number, number] }> = ({ s1, s2, habla }) => {
  const f = useF();
  const esc = interpolate(f, [0, s1, s1 + 14, s2, s2 + 14], [1.05, 1.05, 1.6, 1.6, 2.2], { ...cl, easing: suave });
  return maraCuarto(esc, CTO_PUNTOS.colchon - 140, { opacidad: () => Math.min(0.96, f / 16), caras: [{ f: 0, v: "picaro" }], habla: [habla] });
};
const BrilloTel: React.FC = () => {
  const f = useF();
  const o = Math.min(1, f / 6) * (0.8 + 0.2 * Math.sin(f * 0.8));
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", opacity: o, background: "radial-gradient(ellipse 520px 300px at 960px 560px, rgba(255,130,60,0.75), rgba(255,110,50,0.25) 45%, rgba(0,0,0,0) 75%)" }} />;
};
export const Q80Noche: React.FC = () => {
  const b = k80(416.2), c = k80(418.2);
  const kc = kDe(418.2);
  const VUELTA = [{ f: 0, v: ACOST }, { f: 22, v: { ...ACOST, tronco: -70, cabeza: -20, hI: 120, cI: 40 } }, { f: 46, v: { ...ACOST, tronco: -52, cabeza: 0, hD: 120, cD: 50 } }, { f: 72, v: { ...ACOST, tronco: -72, cabeza: -24, hI: 140, cI: 30 } }];
  return (
    <Tramos t={[
      [0, <Cto cl={[mira(0, CTO_PUNTOS.colchon - 40, 800, 1.9), mira(b, CTO_PUNTOS.colchon - 30, 800, 2.0)]}
        leo={{ poses: VUELTA, enManoD: null, caras: [{ f: 0, v: "cansado" }, { f: 46, v: "triste" }], miradas: [{ f: 0, v: { x: 0, y: -0.6 } }, { f: 46, v: { x: 0.6, y: -0.3 } }], giros: [{ f: 0, v: 0 }, { f: 22, v: -0.5 }, { f: 46, v: 0.4 }, { f: 72, v: -0.5 }] }}
        medio={<TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} bocaAbajo />}
        hud={<><Hud2 m={126} dia={4} /><Rotulo texto="2:00 AM" desde={6} hasta={80} /><Placa texto="ALONE IN HIS ROOM" x={960} y={990} desde={k80(414.9)} tam={42} /></>} />],
      [b, <Cto cl={[mira(0, CTO_PUNTOS.colchon + 200, 850, 3.4), mira(c - b, CTO_PUNTOS.colchon + 200, 850, 3.7)]}
        leo={{ poses: [{ f: 0, v: ACOST }], enManoD: null, caras: [{ f: 0, v: "cansado" }] }}
        medio={<TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={1} />}
        hud={<><Hud2 m={126} dia={4} /><Placa texto="THE PHONE LIGHTS UP" x={960} y={180} desde={4} tam={46} color="#ffd38a" /><BrilloTel /></>} />],
      [c, <Cto cl={[mira(0, CTO_PUNTOS.colchon, 560, 1.4), mira(kc(420.36), CTO_PUNTOS.colchon, 540, 1.3, { curva: "inout" }), mira(325 - c, CTO_PUNTOS.colchon, 520, 1.25, { curva: "inout" })]}
        leo={{ poses: [{ f: 0, v: { ...ACOST, tronco: -40, cabeza: 10, hD: 40, cD: 30 } }, { f: kc(420.36), v: { ...ACOST, tronco: -66, cabeza: -14, hD: 120, cD: 120, hI: 120, cI: 120 } }], enManoD: null,
          caras: [{ f: 0, v: "duda" }, { f: kc(420.36), v: "miedo" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.2 } }, { f: 14, v: { x: -0.6, y: -0.8 } }], giros: [{ f: 0, v: 0.3 }] }}
        medio={<TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={1} />}
        detras={<MaraCrece s1={2} s2={kc(420.36)} habla={[kc(421.5), kc(423.6)]} />}
        hud={<><Hud2 m={126} dia={4} /><Placa texto="THE SHADOW LEANS OVER HIS BED" x={960} y={990} desde={4} hasta={kc(420.3)} tam={42} /><Placa texto="BIGGER THAN EVER" x={960} y={990} desde={kc(420.36)} hasta={kc(422.6)} tam={50} color="#ff8a6a" />
          <ManoMara texto="you did so well" x={1180} y={200} desde={kc(422.72)} tam={84} /></>} />],
    ]} />
  );
};
// ---------- 81 · «you deserve a reward. Just ten minutes» (Mara le acerca el tel) ----------
const k81 = kDe(423.72);
export const Q81Premio: React.FC = () => (
  <Cto cl={[mira(0, CTO_PUNTOS.colchon - 20, 450, 1.4), mira(114, CTO_PUNTOS.colchon, 460, 1.5, { curva: "inout" })]}
    leo={{ poses: [{ f: 0, v: { ...ACOST, tronco: -40, cabeza: 10, hD: 40, cD: 30 } }, { f: 70, v: { ...ACOST, tronco: -34, cabeza: 12, hD: 70, cD: 20 } }], enManoD: null, caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.6, y: -0.3 } }] }}
    detras={maraCuarto(2.1, CTO_PUNTOS.colchon - 120, { caras: [{ f: 0, v: "picaro" }], habla: [[0, k81(425.8)], [k81(425.88), k81(426.7)]],
      poses: [{ f: 0, v: { tronco: 10, cabeza: 12, hD: 60, cD: 40, hI: -60, cI: -40 } }, { f: 30, v: { tronco: 12, cabeza: 12, hD: 80, cD: 8, hI: -60, cI: -40 } }], enManoD: <Tel s={1.0} /> })}
    hud={<><Hud2 m={126} dia={4} /><ManoMara texto="you deserve a reward" x={1150} y={200} desde={2} hasta={k81(425.8)} tam={84} /><ManoMara texto="just ten minutes" x={1150} y={200} desde={k81(425.9)} tam={84} /></>} />
);
// ---------- 82 · Leo agarra el tel ----------
// v4: las piernas van estiradas hacia atrás sobre el colchón (antes se encimaban con el torso = mancha) y la cámara abre: cuerpo entero.
const ACOST82 = { ...ACOST, pI: -92, rI: -14, pD: -86, rD: -8 };
export const Q82Agarra: React.FC = () => {
  const f = useF();
  return (
    <Cto cl={[mira(0, CTO_PUNTOS.colchon - 20, 690, 2.15), mira(54, CTO_PUNTOS.colchon - 10, 690, 2.3)]}
      leo={{ poses: [{ f: 0, v: ACOST82 }, { f: 14, v: { ...ACOST82, tronco: -40, cabeza: 6, hD: 90, cD: 20 } }, { f: 40, v: { ...ACOST82, tronco: -30, cabeza: 18, hD: 30, cD: 125 } }],
        enManoD: (fr: number) => (fr >= 26 ? <Tel /> : null), caras: [{ f: 0, v: "duda" }, { f: 30, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.3 } }, { f: 40, v: { x: 0.3, y: 0.7 } }] }}
      medio={<>{f < 26 && <TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={1} />}</>} hud={<Hud2 m={126} dia={4} est="sube" />} />
  );
};
// ---------- 83 · CTA ----------
// v4: 3 planos — A) general: Leo sale del lavadero, se estira, mira el cielo, saca el tel y lo GUARDA en el bolsillo; Tenzo asoma por la puerta.
// B) «tell me below»: plano medio de Tenzo en la puerta que señala abajo y saluda. C) AMANECER: el cielo pasa de azul a naranja, Leo se
// aleja hacia el sol (silueta), Tenzo saluda desde la puerta iluminada.
export const Q83Cta: React.FC = () => {
  const f = useF();
  const X = BW.puertaLav;
  const cB = 150, cC = 262;
  const clA = [mira(0, X + 160, 715, 1.9), mira(cB, X + 200, 715, 1.95, { curva: "inout" })];
  const clB = [mira(cB, X - 90, 655, 3.0), mira(cC, X - 80, 650, 3.15)];
  const textos = <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 400, background: "linear-gradient(#0c0d10e6 0%, #0c0d10c0 45%, #0c0d1000)" }} />
    <Frase texto="What is in your palace?" desde={4} y={95} tam={84} />
    <Frase texto="What would you see if you walked out of the gate?" desde={49} y={195} tam={46} color="#fff2c8" />
    <Placa texto="TELL ME BELOW ↓" x={960} y={1000} desde={153} hasta={190} tam={44} color="#ffd38a" />
    <Pildora texto="SUBSCRIBE · DAY 5 TOMORROW" x={960} y={1000} desde={192} color="#ff6a2b" />
  </>;
  if (f >= cC) return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Desde d={cC}><AmanecerCalle f={f - cC} dur={410 - cC} /></Desde>
      {textos}
    </AbsoluteFill>
  );
  return (
    <>
      <Bwy dia cl={f < cB ? clA : clB}
        medio={<>
          <A look={TENZO} seed={2} ruta={[{ f: 0, x: X - 260, y: BP }, { f: 100, x: X - 260, y: BP }, { f: 130, x: X + 20, y: BP, curva: "out" }]} dir={[{ f: 0, v: 1 }]} opacidad={(fr: number) => lerp(fr, 98, 108, 0, 1)}
            poses={[{ f: 0, v: CAMINA }, { f: 132, v: { hD: 40, cD: 30, hI: 10, cI: 10 } }, { f: 152, v: { hD: 35, cD: -6, hI: 10, cI: 10, tronco: 8, cabeza: 10 } }, { f: 176, v: { hD: 30, cD: -4, hI: 10, cI: 10, tronco: 8, cabeza: 12 } },
              ...ciclo({ hD: 138, cD: -12, hI: 10, cI: 10 }, { hD: 150, cD: 32, hI: 10, cI: 10 }, 14, 262, 186).slice(1)]}
            caras={[{ f: 0, v: "feliz" }, { f: 150, v: "risa" }, { f: 186, v: "feliz" }]} miradas={[{ f: 0, v: MIRA_T }, { f: 150, v: { x: 0.2, y: 0.2 } }, { f: 186, v: MIRA_T }]} habla={[[152, 176]]} />
          <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: X - 60, y: BP }, { f: 34, x: X + 340, y: BP, curva: "out" }]}
            dir={[{ f: 0, v: 1 }, { f: 132, v: -1 }]} opacidad={(fr: number) => lerp(fr, 0, 8, 0, 1)}
            poses={[{ f: 0, v: CAMINA }, { f: 44, v: { hD: 170, cD: 20, hI: 170, cI: 20, tronco: -6, cabeza: -10 } }, { f: 76, v: { hD: 10, cD: 20, hI: 10, cI: 20, cabeza: -14 } },
              { f: 96, v: { hD: 22, cD: 78, hI: 10, cI: 20, cabeza: 16 } }, { f: 112, v: { hD: 24, cD: 80, hI: 10, cI: 20, cabeza: 18 } }, { f: 122, v: { hD: -12, cD: 34, hI: -12, cI: 34, cabeza: 0 } }, { f: 140, v: { hD: -12, cD: 34, hI: -12, cI: 34, cabeza: -10 } }]}
            enManoD={(fr: number) => (fr >= 92 && fr < 121 ? <Tel prendido={false} /> : null)}
            caras={[{ f: 0, v: "neutral" }, { f: 44, v: "feliz" }, { f: 76, v: "sorpresa" }, { f: 98, v: "duda" }, { f: 118, v: "determinado" }, { f: 132, v: "feliz" }]}
            miradas={[{ f: 0, v: MIRA_T }, { f: 44, v: { x: 0.3, y: -0.9 } }, { f: 96, v: { x: 0.2, y: 0.8 } }, { f: 124, v: { x: 0.4, y: -0.8 } }, { f: 134, v: MIRA_L }]} />
        </>}
        hud={textos} />
      <Amanecer p={lerp(f, 0, cC, 0.15, 0.6)} />
    </>
  );
};

export { LEO, AbsoluteFill, BW };
