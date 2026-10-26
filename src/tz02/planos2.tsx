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
  Anillos, Auto, BiciDib, ManoGrande, suave, TelSvg, Burbuja, Calor, cl, Escoba, Etiqueta, FlorVentana, HojaCal, LagoDib, lerp, Lienzo, MamaDib, PortonDib, Recto, Retrato, TelMarco, Trazo, Vaho, ViejoDib, usePop,
} from "./extras";
import { ciclo, rimOro, Silueta, TENZO } from "./planos1";

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
export const Q43Ruega: React.FC = () => (
  <Kap cl={[mira(0, 2790, 620, 1.55), mira(248, 2800, 625, 1.8, { curva: "inout" })]}
    medio={<><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: 2580, y: KP }, { f: 50, x: 2720, y: KP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "triste" }, { f: 120, v: "determinado" }]}
      poses={[{ f: 0, v: CAMINA }, { f: 52, v: { hD: 88, cD: 8, hI: 84, cI: 10, tronco: 8 } }, { f: 150, v: { hD: 88, cD: 8, hI: 84, cI: 10, tronco: 12, cabeza: 6 } }, { f: 190, v: { hD: 150, cD: 20, hI: 20, cI: 20 } }]} habla={[[10, 240]]} />
      <A look={CHANNA} seed={34} ruta={[{ f: 0, x: 2860, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: 120, v: "miedo" }]} giros={[{ f: 0, v: 0 }, { f: 70, v: -0.4 }, { f: 85, v: 0.4 }, { f: 100, v: -0.4 }, { f: 115, v: 0 }]}
        poses={[{ f: 0, v: { hD: 20, cD: 20, hI: 20, cI: 20 } }, { f: 60, v: { hD: 60, cD: 90, hI: 55, cI: 95, tronco: -6 } }]} miradas={[{ f: 0, v: MIRA_L }, { f: 190, v: { x: 0.6, y: -0.2 } }]} /></>}
    hud={<><Pildora texto="AGE 29" x={960} y={110} desde={6} color="#ffe2a6" /><Etiqueta texto="JUST ONCE · OUTSIDE THE WALLS" x={960} y={190} desde={150} tam={42} color="#fff2c8" /></>} />
);
// ---------- 44 · el rey se entera: calles limpias, viejos y enfermos escondidos, flores en cada ventana ----------
const k44 = kDe(206.33);
export const Q44Ordena: React.FC = () => {
  const f = useF();
  const corte = k44(211.6);
  if (f < corte) return (
    <Kap cl={[mira(0, K.trono - 100, 610, 1.7), mira(corte, K.trono - 120, 615, 1.9)]}
      medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 100, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "enojo" }]} poses={[{ f: 0, v: "parado" }, { f: 30, v: { hD: 150, cD: 10, hI: 10, cI: 10 } }, { f: 70, v: { hD: 95, cD: 5, hI: 10, cI: 10 } }, { f: 110, v: { hD: 150, cD: 10, hI: 60, cI: 60 } }]} habla={[[20, 150]]} />}
      hud={<><Etiqueta texto="CLEAN STREETS" x={1350} y={180} desde={30} tam={44} /><Etiqueta texto="HIDE THE OLD AND THE SICK" x={1350} y={250} desde={80} tam={44} color="#ffb060" /><Etiqueta texto="FLOWERS IN EVERY WINDOW" x={1350} y={320} desde={120} tam={44} color="#ffd38a" /></>} />
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
        <rect width={1920} height={1080} fill="#1a1410" opacity={0.55} />
        <text x={960} y={190} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={64} letterSpacing={6} fill="#fff2c8">FOUR THINGS</text>
        {["I", "II", "III", "IV"].map((r, i) => {
          const s = interpolate(f - 6 - i * 7, [0, 8, 13], [0, 1.12, 1], cl);
          return (
            <g key={r} transform={`translate(${390 + i * 380},560) scale(${s})`}>
              <rect x={-150} y={-200} width={300} height={400} rx={24} fill="#f4e4c0" stroke="#8a5a2a" strokeWidth={8} />
              <path d="M0,-120 a46,46 0 1 1 -0.1,0 M-80,150 Q-80,-30 0,-40 Q80,-30 80,150 Z" fill="#3a2a22" opacity={0.85} />
              <text x={0} y={30} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={110} fill="#ffd38a">?</text>
              <text x={0} y={185} textAnchor="middle" fontFamily={F_HUD} fontWeight={700} fontSize={44} fill="#5a3418">{r}</text>
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
// ---------- 47 · «Channa, what is wrong with that man?» (Siddhartha señala; el viejo en cuadro) ----------
export const Q47QueLePasa: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 130, 610, 1.4), mira(75, K.viejo - 120, 610, 1.46)]} sp={{ portonAbierto: 1 }}
    medio={<><ViejoCamino x0={K.viejo + 90} dx={-12} n={75} /><CarrozaViaje x0={K.viejo - 390} x1={K.viejo - 380} n={75} caraS="sorpresa" hablaS={[[0, 70]]} miraS={{ x: 0.9, y: 0.2 }} miraC={{ x: 0.9, y: 0.2 }}
      posesS={[{ f: 0, v: SENTADO }, { f: 10, v: { ...SENTADO, hD: 95, cD: 4, tronco: 8 } }]} /></>} />
);
// ---------- 48 · «nothing is wrong with him, my prince. He is old. It happens to everyone» (cara de Channa) ----------
const k48 = kDe(228.01);
export const Q48Viejo: React.FC = () => (
  <Kap cl={[mira(0, K.viejo - 230, 560, 2.3), mira(136, K.viejo - 225, 560, 2.45)]} sp={{ portonAbierto: 1 }}
    medio={<CarrozaViaje x0={K.viejo - 330} x1={K.viejo - 330} n={1} caraS="duda" caraC="triste" miraS={{ x: 0.9, y: 0 }} miraC={{ x: -0.9, y: 0.1 }} hablaC={[[0, k48(229.8)], [k48(229.97), k48(230.9)], [k48(231.01), k48(232.5)]]}
      posesC={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }, { f: k48(230), v: { ...SENTADO, hD: 80, cD: 40, hI: 60, cI: 30, cabeza: 8 } }, { f: k48(231.1), v: { ...SENTADO, hD: 120, cD: 30, hI: 60, cI: 30 } }]} />}
    hud={<Etiqueta texto="IT HAPPENS TO EVERYONE" x={960} y={140} desde={k48(231.1)} tam={48} color="#fff2c8" />} />
);
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
// ---------- 50 · «to everyone, my prince. To you too» (los dos con el viejo; Siddhartha se ve envejecer) ----------
const k50 = kDe(235.71);
export const Q50ATi: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, K.viejo - 150, 600, 1.38), mira(89, K.viejo - 160, 600, 1.45)]} sp={{ portonAbierto: 1 }}
      medio={<><ViejoCamino x0={K.viejo + 78} dx={-8} n={89} /><CarrozaViaje x0={K.viejo - 390} x1={K.viejo - 390} n={1} caraS="miedo" caraC="triste" miraS={{ x: 0.2, y: 0.6 }} miraC={{ x: -0.9, y: 0 }} hablaC={[[0, k50(237.2)], [k50(237.31), k50(238.6)]]}
        posesC={[{ f: 0, v: { ...SENTADO, hD: 60, cD: 30, hI: 60, cI: 30 } }, { f: k50(237.3), v: { ...SENTADO, hD: 85, cD: 10, hI: 60, cI: 30 } }]} /></>}
      hud={<Burbuja x={960} y={250} r={150} desde={k50(237.3)} cx={720} cy={480}><Retrato x={0} y={0} r={80} tipo="sidd" edad={lerp(f, k50(237.5), 89, 0, 1)} cara="triste" /></Burbuja>} />
  );
};
// ---------- 51 · Leo vuelve a casa por Broadway a las 4, sin tel; mira todo ----------
const k51 = kDe(238.65);
export const Q51Camina: React.FC = () => (
  <Bwy cl={[mira(0, 1050, 640, 1.6), mira(209, 1750, 645, 1.6)]} sp={{ tren: 160 }}
    medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: 950, y: BP }, { f: 209, x: 1850, y: BP, curva: "lineal" }]} poses={[{ f: 0, v: CAMINA }]} ajuste={BOLSILLOS} caras={[{ f: 0, v: "neutral" }, { f: k51(242.45), v: "sorpresa" }]}
      miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: k51(241), v: { x: 0.3, y: -0.7 } }, { f: k51(243), v: { x: -0.6, y: -0.3 } }, { f: k51(244.2), v: { x: 0.8, y: 0.2 } }]} giros={[{ f: 0, v: 0 }, { f: k51(241), v: 0.3 }, { f: k51(243), v: -0.4 }, { f: k51(244.2), v: 0 }]} />}
    hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="4:00 AM · NO PHONE" desde={6} /></>} />
);
// ---------- 52 · en la parada del 36, un viejo con campera finita espera un bus que tarda una hora ----------
export const Q52Parada: React.FC = () => {
  const pop = usePop(60);
  return (
    <Bwy cl={[mira(0, BW.parada36 - 330, 600, 1.35), mira(208, BW.parada36 - 160, 610, 1.6, { curva: "inout" })]}
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
// ---------- 54 · pasó por esa parada mil veces. Nunca lo vio ----------
export const Q54NuncaLoVio: React.FC = () => {
  const f = useF();
  return (
    <Bwy cl={[mira(0, BW.parada36 - 200, 610, 1.6), mira(137, BW.parada36 - 210, 610, 1.75)]}
      medio={<>
        <A look={VIEJO_36} seed={57} ruta={[{ f: 0, x: BW.banco36 - 30, y: BP }]} asiento={[{ f: 0, v: 70 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 40, cD: 120, hI: 40, cI: 120, tronco: 12, cabeza: 10 } }]} caras={[{ f: 0, v: "cansado" }]} />
        {[0, 1, 2, 3].map((q) => <A key={q} look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 900, y: BP }, { f: 8 + q * 30, x: BW.parada36 - 900, y: BP }, { f: 48 + q * 30, x: BW.parada36 + 300, y: BP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 10, cI: 20, cabeza: 18 } }]} enManoD={<Tel />} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.8 } }]}
          opacidad={(fr: number) => (fr < 8 + q * 30 || fr > 48 + q * 30 ? 0 : 0.42)} />)}
        <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.parada36 - 330, y: BP }]} poses={[{ f: 0, v: CAMINA }]} ajuste={BOLSILLOS} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.4 } }]} />
      </>}
      hud={<><Hud2 m={0} est="congelado" /><div style={{ position: "absolute", left: 960, top: 120, transform: "translate(-50%,0)", textAlign: "center", fontFamily: F_HUD, color: "#f4efe6", textShadow: "0 3px 10px #000" }}>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#ff6a2b" }}>{Math.round(interpolate(f, [0, 120], [1, 1000], cl)).toLocaleString("en-US")}</div><div style={{ fontSize: 34, letterSpacing: 6, fontWeight: 600 }}>TIMES · NEVER SAW HIM</div></div></>} />
  );
};
// ---------- 55 · lo segundo: un enfermo tirado en el polvo, ardiendo de fiebre ----------
export const Q55Enfermo: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const pop = usePop(24);
  const c = [mira(0, K.enfermo - 120, 660, 1.75), mira(138, K.enfermo - 40, 680, 2.1, { curva: "inout" })];
  const p = enPantalla(c, f, fps, K.enfermo + 80, KP - 120);
  return (
    <Kap cl={c} sp={{ portonAbierto: 1 }}
      medio={<><A look={ENFERMO} seed={58} ruta={[{ f: 0, x: K.enfermo, y: KP }]} asiento={[{ f: 0, v: 8 }]} poses={ciclo({ tronco: -14, cabeza: 12, pI: 88, rI: 2, pD: 80, rD: 14, hD: 40, cD: 140, hI: 10, cI: 20 }, { tronco: -10, cabeza: 6, pI: 88, rI: 2, pD: 80, rD: 14, hD: 46, cD: 150, hI: 14, cI: 24 }, 22, 140)} caras={[{ f: 0, v: "cansado" }]} />
        <Calor x={K.enfermo + 40} y={KP - 150} f={f} w={200} /></>}
      hud={<><Pildora texto="II · A SICK MAN" x={960} y={110} desde={4} color="#ffe2a6" />
        <div style={{ position: "absolute", left: Math.min(1700, p.x + 260), top: Math.max(220, p.y - 260), transform: `translate(-50%,-50%) scale(${pop})`, fontFamily: F_HUD, fontWeight: 700, fontSize: 92, color: "#ff5a3a", textShadow: "0 0 20px #ff5a3a88, 0 3px 0 #0008" }}>{Math.round(interpolate(f, [24, 80], [98, 104], cl))}°F</div></>} />
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
// ---------- 57 · tres de su madre, Diane, en Peoria; en el último tose: «call me when you can, baby» ----------
const k57 = kDe(271.93);
export const Q57Diane: React.FC = () => {
  const f = useF();
  if (f >= k57(276.2)) return (
    <Cto cl={[mira(0, CTO_PUNTOS.colchon - 20, 600, 2.4), mira(80, CTO_PUNTOS.colchon - 20, 600, 2.55)]}
      leo={{ poses: [{ f: 0, v: { ...CAMA_S, cabeza: 26 } }, { f: k57(277.6), v: { ...CAMA_S, cabeza: 30, hD: 30, cD: 140 } }], enManoD: null, caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.5 } }, { f: k57(277.8), v: { x: 0.3, y: 0.8 } }] }}
      medio={<Laptop x={LAP.x} y={LAP.y} brillo={1} onda={1} />}
      hud={<><Hud2 m={0} est="congelado" /><Frase texto="“call me when you can, baby”" desde={k57(277.6)} y={150} tam={62} /></>} />
  );
  const n = Math.min(3, 1 + Math.floor(f / 30));
  const tos = f > k57(275.5) && f < k57(276.1);
  return (
    <Fondo>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={460} y={160} width={1000} height={640} rx={26} fill="#1b1e24" stroke="#3a3f48" strokeWidth={6} />
        <text x={520} y={250} fill="#9aa3ad" fontFamily={F_HUD} fontSize={40} fontWeight={700}>VOICEMAIL · 3 NEW</text>
        {Array.from({ length: n }).map((_, i) => {
          const act = i === n - 1;
          return (
            <g key={i} transform={`translate(520,${310 + i * 140})`} opacity={interpolate(f - i * 30, [0, 8], [0, 1], cl)}>
              <rect width={880} height={110} rx={18} fill={act ? "#3a2418" : "#262a31"} />
              <circle cx={60} cy={55} r={30} fill="#ff6a2b" />
              <text x={120} y={50} fill="#f4efe6" fontFamily={F_HUD} fontSize={40} fontWeight={700}>MOM · DIANE</text>
              <text x={120} y={92} fill="#9aa3ad" fontFamily={F_HUD} fontSize={30}>Peoria, IL</text>
              {Array.from({ length: 12 }).map((_, b) => { const pico = act && tos && b > 4 && b < 9; const h = pico ? 44 : act ? 6 + Math.abs(Math.sin(f / 3 + b)) * 26 : 6 + ((b * 7 + i * 5) % 9) * 3; return <rect key={b} x={560 + b * 24} y={55 - h} width={12} height={2 * h} rx={6} fill={pico ? "#ff3a2a" : "#ff6a2b"} opacity={0.85} />; })}
            </g>
          );
        })}
      </svg>
      {tos && <Etiqueta texto="*cough*" x={1180} y={640} desde={k57(275.5)} tam={44} color="#ffb060" />}
      <Hud2 m={0} est="congelado" />
    </Fondo>
  );
};
// ---------- 58 · el mensaje tiene 19 días: el calendario pasa 19 hojas ----------
export const Q58Diecinueve: React.FC = () => {
  const f = useF();
  const n = Math.min(19, 1 + Math.floor(f / 2.6));
  const caida = n < 19 ? (f % 2.6) / 2.6 : 0;
  return (
    <Fondo>
      <Lienzo>
        <HojaCal x={960} y={540} tam={1.7} n={String(Math.min(19, n + 1))} sub={n >= 19 ? "DAYS AGO" : "DAYS"} />
        {n < 19 && <HojaCal x={960} y={540} tam={1.7} n={String(n)} sub="DAYS" caida={caida} />}
      </Lienzo>
      <Hud2 m={0} est="congelado" />
    </Fondo>
  );
};
// ---------- 59 · lo tercero: un muerto en andas por la calle, y una familia llorando detrás ----------
const ANDAS = { hD: 160, cD: 14, hI: 158, cI: 16 };
export const Q59Funeral: React.FC = () => {
  const f = useF();
  const x = interpolate(f, [0, 189], [K.funeral - 300, K.funeral + 150], cl);
  return (
    <Kap cl={[mira(0, K.funeral - 420, 600, 1.5), mira(189, K.funeral - 60, 605, 1.6, { curva: "inout" })]} sp={{ portonAbierto: 1 }}
      medio={<>
        <A look={ALDEANO} seed={61} ruta={[{ f: 0, x: K.funeral - 180, y: KP }, { f: 189, x: K.funeral + 270, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: ANDAS }]} ajuste={(p) => ({ ...p, ...ANDAS })} caras={[{ f: 0, v: "triste" }]} />
        <A look={ALDEANO} seed={62} ruta={[{ f: 0, x: K.funeral - 420, y: KP }, { f: 189, x: K.funeral + 30, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: ANDAS }]} ajuste={(p) => ({ ...p, ...ANDAS })} caras={[{ f: 0, v: "triste" }]} />
        <Camilla x={x} y={KP - 280} /><path d={`M${x - 125},${KP - 312} Q${x - 60},${KP - 360} ${x + 40},${KP - 340} Q${x + 80},${KP - 380} ${x + 115},${KP - 340} L${x + 125},${KP - 312} Z`} fill="#f4ecd8" stroke="#b8a888" strokeWidth={3} />
        <A look={ALDEANA} seed={63} ruta={[{ f: 0, x: K.funeral - 620, y: KP }, { f: 189, x: K.funeral - 190, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "triste" }]} />
        <A look={ALDEANO} seed={64} ruta={[{ f: 0, x: K.funeral - 880, y: KP }, { f: 189, x: K.funeral - 450, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 60, cD: 100, hI: 10, cI: 10, tronco: 10, cabeza: 12 } }]} ajuste={(p) => ({ ...p, hD: 60, cD: 100 })} caras={[{ f: 0, v: "triste" }]} />
        <A look={ALDEANA} seed={65} escala={0.8} ruta={[{ f: 0, x: K.funeral - 740, y: KP }, { f: 189, x: K.funeral - 300, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 150, cD: 30 } }]} caras={[{ f: 0, v: "triste" }]} />
      </>} hud={<Pildora texto="III · A DEAD MAN" x={960} y={110} desde={4} color="#ffe2a6" />} />
  );
};
// ---------- 60 · al mediodía, Broadway y Argyle: una bici pintada de blanco, flores, una foto ----------
const k60 = kDe(289.73);
export const Q60Bici: React.FC = () => {
  const f = useF();
  const para = k60(296);
  return (
    <Bwy dia cl={[mira(0, BW.argyle - 520, 610, 1.3), mira(para, BW.ghostbike - 230, 610, 1.35, { curva: "inout" }), mira(k60(301.0), BW.ghostbike - 40, 690, 2.2, { curva: "inout" }), mira(584, BW.ghostbike - 30, 700, 2.5)]}
      medio={<>
        <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.argyle - 800, y: BP }, { f: para, x: BW.ghostbike - 280, y: BP, curva: "out" }]} poses={[{ f: 0, v: CAMINA }, { f: para + 40, v: { hD: 10, cD: 30, hI: 10, cI: 30, tronco: 6 } }]}
          ajuste={(p, fr) => (fr < para ? BOLSILLOS(p) : p)} caras={[{ f: 0, v: "neutral" }, { f: para, v: "sorpresa" }, { f: k60(300), v: "triste" }]} miradas={[{ f: 0, v: MIRA_T }, { f: para, v: { x: 0.8, y: 0.4 } }]} />
        <Auto x={interpolate(f, [k60(299), k60(302.5)], [BW.ghostbike - 1600, BW.ghostbike + 1400], cl)} piso={BP + 60} color="#c8403a" />
      </>}
      hud={<><Hud2 m={0} est="congelado" /><Rotulo texto="NOON · BROADWAY & ARGYLE" desde={6} hasta={para} />
        <Etiqueta texto="A WHITE BIKE" x={1400} y={170} desde={k60(297.5)} tam={44} /><Etiqueta texto="FLOWERS · A PHOTO" x={1400} y={240} desde={k60(299.5)} tam={44} color="#ffd38a" />
        <ManoLeo texto="a rider · hit by a car" x={640} y={430} desde={k60(303)} tam={84} /></>} />
  );
};
// ---------- 61 · «a bike just like his» ----------
export const Q61ComoLaSuya: React.FC = () => {
  const f = useF();
  return (
    <Bwy dia cl={[mira(0, BW.ghostbike - 140, 660, 1.9), mira(45, BW.ghostbike - 140, 660, 2.0)]}
      medio={<A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.ghostbike - 280, y: BP }]} poses={[{ f: 0, v: { hD: 10, cD: 30, hI: 10, cI: 30 } }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.4 } }]} />}
      hud={<><Hud2 m={0} est="congelado" /><Burbuja x={1180} y={300} r={160} desde={2} cx={820} cy={430}><rect x={-120} y={-120} width={240} height={240} fill="#e8eef4" /><rect x={-120} y={60} width={240} height={60} fill="#8a8f98" /><BiciDib color="#2a7ac8" jinete t={f / 6} /></Burbuja></>} />
  );
};
// ---------- 62 · Leo se queda parado mucho tiempo (el mundo acelera alrededor) ----------
export const Q62Parado: React.FC = () => {
  const f = useF();
  const h = 12 * 60 + f * 2.6;
  const hh = Math.floor(h / 60);
  return (
    <Bwy dia cl={[mira(0, BW.ghostbike - 160, 610, 1.45), mira(75, BW.ghostbike - 165, 610, 1.5)]}
      medio={<>
        <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.ghostbike - 280, y: BP }]} poses={[{ f: 0, v: { hD: 10, cD: 30, hI: 10, cI: 30 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.4 } }]} />
        {[0, 1, 2, 3, 4].map((q) => <Auto key={q} x={interpolate((f + q * 17) % 34, [0, 34], q % 2 ? [BW.ghostbike + 1300, BW.ghostbike - 1500] : [BW.ghostbike - 1500, BW.ghostbike + 1300])} piso={BP + 60 + (q % 2) * 40} dir={q % 2 ? -1 : 1} color={["#c8403a", "#3a6ac8", "#e0b040", "#4a8a5a", "#8a5ac8"][q]} />)}
      </>}
      hud={<><Hud2 m={0} est="congelado" /><div style={{ position: "absolute", left: 1500, top: 140, background: "#16151acc", borderRadius: 18, padding: "10px 26px", fontFamily: F_HUD, fontWeight: 700, fontSize: 64, color: "#f4efe6", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{hh > 12 ? hh - 12 : 12}:{String(Math.floor(h % 60)).padStart(2, "0")} PM</div>
        <Etiqueta texto="A LONG TIME" x={960} y={120} desde={20} tam={50} /></>} />
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
// ---------- 65 · «a man who left everything, to find out why we suffer» (contraplano: el monje) ----------
export const Q65Dejo: React.FC = () => (
  <Kap cl={[mira(0, K.monje + 240, 620, 1.9), mira(135, K.monje + 250, 625, 2.05)]} sp={{ portonAbierto: 1 }}
    medio={<A look={MONJE_JOVEN} seed={70} ruta={[{ f: 0, x: K.monje + 160, y: KP }, { f: 135, x: K.monje + 280, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 30, cD: 120, hI: 30, cI: 120 } }]} enManoI={CUENCO} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.1 } }, { f: 60, v: { x: -0.7, y: 0 } }]} giros={[{ f: 0, v: 0 }, { f: 60, v: -0.4 }]} />}
    hud={<><Etiqueta texto="LEFT EVERYTHING" x={960} y={140} desde={10} hasta={78} tam={52} color="#fff2c8" /><Etiqueta texto="TO FIND OUT WHY WE SUFFER" x={960} y={140} desde={80} tam={52} color="#ffd38a" /></>} />
);
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
// ---------- 67 · besa a su hijo dormido y sale a la oscuridad (cortina oscura en el cuadro 60) ----------
export const Q67Sale: React.FC = () => {
  const f = useF();
  const cort = interpolate(f, [48, 60, 72], [0, 1, 0], cl);
  return (
    <>
      {f < 60
        ? <Kap cl={[mira(0, K.cuna + 60, 650, 2.1), mira(60, K.cuna + 70, 650, 2.25)]} sp={{ noche: true }}
          medio={<><Bebe x={K.cuna} /><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.cuna + 170, y: KP }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { tronco: 8, cabeza: 4, hD: 30, cD: 20, hI: 30, cI: 20 } }, { f: 20, v: { tronco: 12, cabeza: 12, hD: 50, cD: 20, hI: 30, cI: 20 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.7 } }]} /></>} />
        : <Kap cl={[mira(0, K.porton - 80, 600, 1.3), mira(57, K.porton + 40, 600, 1.35)]} sp={{ noche: true, portonAbierto: 1 }}
          medio={<A look={SIDDHARTHA} seed={30} luz={rimOro} ruta={[{ f: 0, x: K.porton - 260, y: KP }, { f: 57, x: K.porton + 160, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: CAMINA }]} caras={[{ f: 0, v: "determinado" }]} opacidad={(fr: number) => interpolate(fr, [90, 116], [1, 0.2], cl)} />} />}
      <AbsoluteFill style={{ background: "#07060a", opacity: cort }} />
    </>
  );
};
// ---------- 68 · tres de la mañana. Día tres: la hoja del calendario cae (2 → 3) y Leo camina encorvado contra el frío, con vaho ----------
export const Q68Dia3: React.FC = () => {
  const f = useF();
  const x = interpolate(f, [0, 78], [BW.puertaLav + 560, BW.puertaLav + 170], cl);
  return (
    <>
      <Bwy cl={[mira(0, BW.puertaLav + 420, 640, 1.75), mira(78, BW.puertaLav + 300, 640, 1.85)]} sp={{ tren: 20 }}
        medio={<><A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.puertaLav + 560, y: BP }, { f: 78, x: BW.puertaLav + 170, y: BP, curva: "lineal" }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { ...CAMINA, tronco: 10, cabeza: 6 } }]} ajuste={BOLSILLOS} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: MIRA_L }]} />
          <Vaho x={x - 50} y={BP - 270} f={f} dir={-1} /></>}
        hud={<>{H3}<Rotulo texto="3:00 AM" desde={4} /></>} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <HojaCal x={330} y={400} n="3" sub="DAY" tam={0.8} />
        <g opacity={1 - lerp(f, 50, 60, 0, 1)}><HojaCal x={330} y={400} n="2" sub="DAY" tam={0.8} caida={lerp(f, 36, 60, 0, 0.75)} /></g>
      </svg>
    </>
  );
};
// ---------- 69 · Leo entra; Tenzo dobla una toalla, despacio, punta con punta ----------
export const Q69Toalla: React.FC = () => (
  <Lav cl={[mira(0, 1900, 600, 1.35), mira(90, 1720, 620, 1.55, { curva: "inout" }), mira(173, 1680, 680, 2.05, { curva: "inout" })]} toalla={(fr: number) => Math.min(1, fr / 170)}
    tenzo={{ poses: doblando(0, 173, 40), miradas: [{ f: 0, v: { x: -0.3, y: 0.7 } }] }} leo={{ ruta: [{ f: 0, x: 2400, y: LP }, { f: 120, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: CAMINA }], ajuste: BOLSILLOS, enManoD: null, caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }] }}
    hud={<>{H3}<Etiqueta texto="CORNER TO CORNER" x={760} y={170} desde={110} tam={44} /></>} />
);
// ---------- 70 · le tiende el tel: «here, like I promised» (la mano de Leo duda) ----------
const k70 = kDe(352.16);
const TIENDE = { ...SENTADO, hD: 85, cD: 5, hI: 20, cI: 40, tronco: 4, cabeza: 2 };
export const Q70Tiende: React.FC = () => (
  <Lav cl={[mira(0, 1830, 610, 1.75), mira(149, 1840, 610, 1.9)]} toalla={1}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 20, v: TIENDE }], enManoD: <Tel s={1.1} prendido={false} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], dir: [{ f: 0, v: 1 }], habla: [[k70(353.86), k70(355.6)]] }}
    leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: CAMINA }, { f: 60, v: { hD: 55, cD: 30, hI: 10, cI: 20 } }, { f: 85, v: { hD: 70, cD: 14, hI: 10, cI: 20 } }, { f: 105, v: { hD: 30, cD: 60, hI: 10, cI: 20 } }, { f: 125, v: { hD: 62, cD: 20, hI: 10, cI: 20 } }],
      enManoD: null, caras: [{ f: 0, v: "neutral" }, { f: 60, v: "duda" }], miradas: [{ f: 0, v: { x: -0.4, y: 0.4 } }] }} hud={H3} />
);
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
      hud={<>{H3}<Etiqueta texto="THE PALACE WAS VERY BEAUTIFUL" x={760} y={150} desde={k74(371.3)} hasta={k74(377.3)} tam={44} color="#fff2c8" />
        <Lienzo><Trazo d="M1060,560 Q1300,420 1500,470 Q1700,520 1860,330" p={lerp(f, k74(377.5), k74(379.3), 0, 1)} color="#ffd38a" w={12} guiones /></Lienzo>
        <Etiqueta texto="IT NEVER SHOWS YOU THE ROAD" x={760} y={150} desde={k74(377.5)} tam={44} color="#ffd38a" /></>} />
  );
};
// ---------- 75 · «so what do I do? Throw it in the lake?» ----------
export const Q75Lago: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 1900, 630, 2.05), mira(78, 1900, 630, 2.15)]} tenzo={{ no: true }} toalla={1}
      leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 60, cI: 60 } }, { f: 30, v: { hD: 160, cD: 60, hI: 30, cI: 30, tronco: -8 } }, { f: 46, v: { hD: 70, cD: 0, hI: 30, cI: 30, tronco: 10 } }], enManoD: null, caras: [{ f: 0, v: "duda" }, { f: 46, v: "picaro" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, 70]] }}
      hud={<>{H3}<Burbuja x={640} y={300} r={150} desde={36} cx={880} cy={460}><LagoDib t={lerp(f, 40, 78, 0, 1)} /></Burbuja></>} />
  );
};
// ---------- 76 · Tenzo se ríe bajito: «el príncipe no quemó el palacio, salió por el portón… todos los días, una vez» ----------
const k76 = kDe(382.58);
export const Q76Porton: React.FC = () => {
  const f = useF();
  const ab = k76(389.4);
  return (
    <Lav cl={[mira(0, 1640, 640, 2.1), mira(k76(389), 1700, 630, 1.85, { curva: "inout" }), mira(376, 1720, 625, 1.75, { curva: "inout" })]} toalla={1}
      tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, hD: 40, cD: 30, tronco: -10, cabeza: -6 } }, { f: 40, v: { ...DOBLA_A, hD: 40, cD: 30 } }, { f: ab, v: { ...SENTADO, hD: 60, cD: 100, hI: 60, cI: 100 } }, { f: ab + 30, v: { ...SENTADO, hD: 120, cD: 10, hI: 120, cI: 10, cabeza: -4 } }], enManoD: null, dir: [{ f: 0, v: 1 }],
        caras: [{ f: 0, v: "risa" }, { f: k76(385.5), v: "feliz" }], miradas: [{ f: 0, v: MIRA_T }], habla: [[k76(385.58), k76(389.28)], [k76(389.36), k76(394.9)]] }}
      leo={{ ruta: [{ f: 0, x: 1950, y: LP }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 10, cD: 120, hI: 10, cI: 120 } }], enManoD: null, caras: [{ f: 0, v: "duda" }, { f: k76(390), v: "neutral" }], miradas: [{ f: 0, v: MIRA_L }] }}
      hud={<>{H3}<Etiqueta texto="HE DIDN'T BURN THE PALACE" x={960} y={140} desde={k76(385.7)} hasta={ab} tam={46} color="#fff2c8" />
        <Burbuja x={960} y={330} r={150} desde={ab} cx={900} cy={540}><PortonDib a={lerp(f, ab + 10, ab + 50, 0, 1)} /></Burbuja>
        <Etiqueta texto="WALK OUT OF THE GATE · ONCE A DAY" x={960} y={110} desde={k76(391)} tam={42} color="#ffd38a" /></>} />
  );
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
      hud={<>{H3}<Etiqueta texto="FIRST TIME IN 19 DAYS" x={760} y={150} desde={10} hasta={k78(400.9)} tam={44} />{f >= k78(405.94) && <Frase texto="“Leo, baby… is that you?”" desde={k78(406)} y={150} tam={62} />}</>} />
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
// ---------- 80 · esa noche, a las 2, solo en su cuarto: el tel se prende; la sombra se inclina, más grande que nunca ----------
const k80 = kDe(412.88);
const ACOST = { tronco: -60, cabeza: -10, pI: 88, rI: 4, pD: 84, rD: 10, hD: 10, cD: 20, hI: 10, cI: 20 };
export const Q80Noche: React.FC = () => {
  const f = useF();
  const prende = f >= k80(416.2);
  const esc = interpolate(f, [k80(418.2), k80(421.4)], [1.3, 2.1], cl);
  return (
    <Cto cl={[mira(0, CTO_PUNTOS.colchon, 560, 1.25), mira(k80(416.1), CTO_PUNTOS.colchon + 100, 600, 1.5, { curva: "inout" }), mira(k80(421.4), CTO_PUNTOS.colchon, 520, 1.25, { curva: "inout" }), mira(326, CTO_PUNTOS.colchon, 520, 1.3)]}
      leo={{ poses: [{ f: 0, v: ACOST }, { f: 40, v: { ...ACOST, tronco: -70, cabeza: -20, hI: 120, cI: 40 } }, { f: k80(416.4), v: { ...ACOST, tronco: -40, cabeza: 10, hD: 40, cD: 30 } }], enManoD: null, caras: [{ f: 0, v: "cansado" }, { f: k80(416.4), v: "duda" }], miradas: [{ f: 0, v: prende ? { x: 0.8, y: 0.2 } : { x: 0, y: -0.6 } }], giros: [{ f: 0, v: 0 }, { f: 40, v: -0.5 }, { f: k80(416.4), v: 0.3 }] }}
      medio={<TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={prende ? 1 : 0} />}
      detras={f >= k80(418.2) ? maraCuarto(esc, CTO_PUNTOS.colchon - 120, { opacidad: () => Math.min(0.96, (f - k80(418.2)) / 30), caras: [{ f: 0, v: "picaro" }], habla: [[k80(421.5), k80(423.6)]] }) : null}
      hud={<><Hud2 m={126} dia={4} /><Rotulo texto="2:00 AM" desde={6} hasta={90} />{f >= k80(422.7) && <ManoMara texto="you did so well" x={1180} y={200} desde={k80(422.7)} tam={84} />}</>} />
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
export const Q82Agarra: React.FC = () => {
  const f = useF();
  return (
    <Cto cl={[mira(0, CTO_PUNTOS.colchon + 120, 700, 2.4), mira(54, CTO_PUNTOS.colchon + 130, 700, 2.6)]}
      leo={{ poses: [{ f: 0, v: ACOST }, { f: 14, v: { ...ACOST, tronco: -40, cabeza: 6, hD: 90, cD: 20 } }, { f: 40, v: { ...ACOST, tronco: -30, cabeza: 18, hD: 30, cD: 125 } }],
        enManoD: (fr: number) => (fr >= 26 ? <Tel /> : null), caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.3 } }, { f: 40, v: { x: 0.3, y: 0.7 } }] }}
      medio={<>{f < 26 && <TelMesa x={CTO_PUNTOS.colchon + 200} y={CP - 40} vibra={1} />}</>} hud={<Hud2 m={126} dia={4} est="sube" />} />
  );
};
// ---------- 83 · CTA: «What is in your palace?» — Leo en la puerta del lavadero al amanecer, Tenzo saluda ----------
export const Q83Cta: React.FC = () => (
  <Bwy dia cl={[mira(0, BW.puertaLav + 110, 600, 1.7), mira(410, BW.puertaLav + 100, 610, 1.85, { curva: "inout" })]}
    medio={<>
      <A look={TENZO} seed={2} ruta={[{ f: 0, x: BW.puertaLav - 40, y: BP }]} dir={[{ f: 0, v: 1 }]} poses={ciclo({ hD: 150, cD: 20, hI: 10, cI: 10 }, { hD: 160, cD: 50, hI: 10, cI: 10 }, 14, 420, 30)} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: MIRA_T }]} />
      <A look={LEO_CAPUCHA} seed={1} ruta={[{ f: 0, x: BW.puertaLav + 260, y: BP }]} dir={[{ f: 0, v: -1 }, { f: 160, v: 1 }]} poses={[{ f: 0, v: CAMINA }, { f: 80, v: { hD: 120, cD: 40, hI: 10, cI: 10 } }, { f: 130, v: CAMINA }]} ajuste={(p, fr) => (fr > 130 ? BOLSILLOS(p) : p)} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: MIRA_L }, { f: 160, v: { x: 0.8, y: -0.5 } }]} />
    </>}
    hud={<>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 430, background: "linear-gradient(#0c0d10ee 55%, #0c0d1000)" }} />
      <Frase texto="What is in your palace?" desde={4} y={120} tam={84} />
      <Frase texto="What would you see if you walked out of the gate?" desde={50} y={250} tam={46} color="#fff2c8" />
      <Pildora texto="SUBSCRIBE · DAY 5 TOMORROW" x={960} y={360} desde={170} color="#ff6a2b" />
    </>} />
);

export { LEO, AbsoluteFill, BW };
