// tz01 · planos 46-86 (211 → 460,6 s): Leo vuelve a mirar; las semanas en el pabellón; Amrapali se rinde; la ola; Tenzo se va; el CTA.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor, ActorProps } from "../anikit/actor";
import { Pildora } from "../anikit/pantalla";
import { ACENTO, AMRAPALI, AMRAPALI_MONJA, BLANCO_MANO, ESC, FAROL, LOTO, LOTO_ENSENA, MONJE_JOVEN } from "../tenzo/elenco";
import { Look } from "../anikit/personaje";
import { Frase, ManoMara, Rotulo } from "../tenzo/hud";
import { FarolMano, Tel } from "../tenzo/utileria";
import { Llama, Ola, TelGrande } from "../tenzo/graficos";
import { VAI_PISO, VAI_PUNTOS } from "../tenzo/sets/vaishali";
import { CEL_SENT, DOBLA_A, doblando, kDe, Lav, LAV_PUNTOS, LP, rimTel, Vai } from "./base";
import { Fondo, Hud } from "./planos1";
import { Buda, MONJE } from "./planos2";

const VP = VAI_PISO, V = VAI_PUNTOS, L = LAV_PUNTOS;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const A: React.FC<ActorProps> = (p) => <Actor escala={ESC} {...p} />;
const MX = V.pabellon - 200; // el monje sentado en el pabellón
const AMRA_SIN_JOYAS: Look = { ...AMRAPALI, accesorios: [{ t: "pelo", forma: "cola", color: "#1e1410" }, { t: "tunica", color: "#b8323a", largo: 1 }] };
const MIRA_TENZO = { x: 0.9, y: 0 };
const H83 = { m: 583 }; // desde el plano 73 el contador queda en 9h 43m

// el monje en el pabellón (loto, respira) y Amrapali bailando
const MonjePab: React.FC<{ o?: Partial<ActorProps> }> = ({ o = {} }) => (
  <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: MX, y: VP - 40 }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: LOTO }]} caras={[{ f: 0, v: "neutral" }]} dir={[{ f: 0, v: 1 }]} {...o} />
);
const BAILE_A = { hD: 125, cD: 40, hI: -60, cI: -30, tronco: 8, cabeza: 6 };
const BAILE_B = { hD: 60, cD: -30, hI: -125, cI: -40, tronco: -8, cabeza: -6 };
const bailando = (hasta: number, p = 30) => Array.from({ length: Math.ceil(hasta / p) }).map((_, i) => ({ f: i * p, v: i % 2 ? BAILE_B : BAILE_A }));

// ---------- 46 · Leo levanta la vista por primera vez: «wait, he just let him go?» ----------
const k46 = kDe(210.98);
export const P46Levanta: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 60, 650, 2.2), mira(178, L.leo + 80, 645, 2.4)]} tenzo={{ poses: doblando(0, 180, 40) }} mara={{ opacidad: () => 0.85 }}
    leo={{ poses: [{ f: 0, v: CEL_SENT }, { f: 40, v: { ...CEL_SENT, cabeza: -2, hD: 20, cD: 90 } }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 40, v: MIRA_TENZO }],
      caras: [{ f: 0, v: "cansado" }, { f: 44, v: "sorpresa" }], habla: [[k46(214.24), k46(216.86)]] }} hud={<Hud />} />
);
// ---------- 47 · el viejo asiente: «he let him go» ----------
const k47 = kDe(216.98);
export const P47Asiente: React.FC = () => (
  <Lav cl={[mira(0, 1700, 650, 2.5), mira(76, 1700, 645, 2.65)]} leo={{ no: true }} toalla={0.5}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 8, v: { ...DOBLA_A, cabeza: 30 } }, { f: 22, v: { ...DOBLA_A, cabeza: 4 } }, { f: 36, v: { ...DOBLA_A, cabeza: 26 } }, { f: 50, v: DOBLA_A }],
      habla: [[k47(218.14), k47(218.86)]], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], caras: [{ f: 0, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 48 · «that's insane… like sending an alcoholic to work in a bar» ----------
export const P48Bar: React.FC = () => (
  <Lav cl={[mira(0, L.leo, 650, 2.3), mira(126, L.leo + 10, 650, 2.5)]} tenzo={{ no: true }} mara={{ opacidad: () => 0.85, caras: [{ f: 0, v: "risa" }] }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0, hI: 40, cI: 90 } }, { f: 40, v: { ...CEL_SENT, cabeza: 0, hI: 70, cI: 60 } }], miradas: [{ f: 0, v: MIRA_TENZO }],
      caras: [{ f: 0, v: "sorpresa" }, { f: 30, v: "risa" }], habla: [[0, 24], [40, 125]] }} hud={<Hud />} />
);
// ---------- 49 · el viejo sonríe y sigue doblando ----------
export const P49Sigue: React.FC = () => (
  <Lav cl={[mira(0, 1640, 690, 2.6), mira(86, 1650, 690, 2.75)]} leo={{ no: true }} toalla={(f) => interpolate(f, [0, 86], [0.5, 0.75], cl)}
    tenzo={{ poses: doblando(0, 86, 28), caras: [{ f: 0, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 50 · la primera semana: ella baila, él mira y respira ----------
export const P50Semana1: React.FC = () => (
  <Vai cl={[mira(0, V.pabellon - 70, 560, 1.4), mira(163, V.pabellon - 70, 580, 1.6)]} sp={{ noche: true }}
    medio={<>
      <MonjePab />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: V.pabellon + 40, y: VP - 40 }, { f: 80, x: V.pabellon + 120, y: VP - 40 }, { f: 163, x: V.pabellon + 30, y: VP - 40 }]} dir={[{ f: 0, v: -1 }, { f: 60, v: 1 }, { f: 100, v: -1 }]}
        poses={bailando(170)} caras={[{ f: 0, v: "feliz" }]} giros={[{ f: 0, v: 0.4 }, { f: 80, v: -0.3 }, { f: 160, v: 0.4 }]} />
    </>}
    hud={<Pildora texto="WEEK 1" x={960} y={980} desde={8} color="#ffe2a6" />} />
);
// ---------- 51 · la segunda semana: seda y jazmín, tan cerca que él oye su corazón ----------
export const P51Semana2: React.FC = () => (
  <Vai cl={[mira(0, MX + 90, 600, 2.2), mira(206, MX + 80, 610, 2.7)]} sp={{ noche: true }}
    medio={<>
      <MonjePab />
      <A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: MX + 260, y: VP - 40 }, { f: 90, x: MX + 150, y: VP - 40 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: undefined }, { f: 96, v: 40 }]}
        poses={[{ f: 0, v: { hD: 40, cD: 60, hI: 20, cI: 40 } }, { f: 96, v: { tronco: -14, pI: 88, rI: 88, pD: 92, rD: 92, hD: 70, cD: 50, hI: 20, cI: 30, cabeza: 10 } }]}
        caras={[{ f: 0, v: "feliz" }, { f: 110, v: "picaro" }]} giros={[{ f: 0, v: 0.3 }]} />
    </>}
    hud={<Pildora texto="WEEK 2" x={960} y={980} desde={8} color="#ffe2a6" />} />
);
// ---------- 52 · sintió el fuego; no huyó, no obedeció ----------
export const P52Fuego: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, MX, 700, 2.0), mira(216, MX, 710, 2.3)]} sp={{ noche: true }}
      medio={<>
        <MonjePab o={{ caras: [{ f: 0, v: "neutral" }, { f: 60, v: "determinado" }, { f: 150, v: "neutral" }] }} />
        <Llama x={MX + 6} y={VP - 60} t={interpolate(f, [0, 70], [0.12, 0.42], cl)} f={f} />
      </>} />
  );
};
// ---------- 53 · lo miraba como se mira la lluvia desde una ventana ----------
export const P53Lluvia: React.FC = () => (
  <Vai cl={[mira(0, V.pabellon, 520, 1.0), mira(122, V.pabellon - 60, 540, 1.15)]} sp={{ noche: true, lluvia: true }}
    medio={<><MonjePab /><A look={AMRAPALI} seed={12} ruta={[{ f: 0, x: MX + 150, y: VP - 40 }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 40 }]} poses={[{ f: 0, v: { tronco: -6, pI: 88, rI: 88, pD: 92, rD: 92, hD: 30, cD: 40 } }]} caras={[{ f: 0, v: "neutral" }]} /></>} />
);
// ---------- 54 · cada noche el fuego un poco más chico ----------
export const P54Achica: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, MX, 700, 2.3), mira(84, MX, 700, 2.2)]} sp={{ noche: true }}
      medio={<><MonjePab /><Llama x={MX + 6} y={VP - 60} t={interpolate(f, [0, 28, 30, 56, 58, 84], [0.42, 0.42, 0.3, 0.3, 0.18, 0.16], cl)} f={f} /></>}
      hud={<Pildora texto={f < 30 ? "NIGHT 9" : f < 58 ? "NIGHT 17" : "NIGHT 26"} x={960} y={980} desde={0} color="#ffe2a6" />} />
  );
};
// ---------- 55 · cada semana alguien corría al Buda: «está perdido, maestro» ----------
const k55 = kDe(253.15);
export const P55Corren: React.FC = () => (
  <Vai cl={[mira(0, 4500, 620, 1.0), mira(130, 4900, 700, 1.2, { curva: "inout" }), mira(284, 5150, 740, 1.6)]} sp={{ murmullo: 0.6 }}
    medio={<>
      <Buda miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} />
      <A look={MONJE(1)} seed={81} ruta={[{ f: 0, x: 4100, y: VP }, { f: 130, x: V.buda - 280, y: VP, curva: "lineal" }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: { hD: 70, cD: 80, hI: -50, cI: 30, tronco: 14 } }, { f: 10, v: { hD: -50, cD: 30, hI: 70, cI: 80, tronco: 14 } }, { f: 20, v: { hD: 70, cD: 80, hI: -50, cI: 30, tronco: 14 } }, { f: 30, v: { hD: -50, cD: 30, hI: 70, cI: 80, tronco: 14 } }, { f: 40, v: { hD: 70, cD: 80, hI: -50, cI: 30, tronco: 14 } }, { f: 135, v: { hD: 90, cD: 60, hI: 80, cI: 70, tronco: 10 } }]}
        caras={[{ f: 0, v: "miedo" }, { f: 140, v: "enojo" }]} habla={[[k55(257.79), k55(262.43)]]} />
    </>}
    hud={<Pildora texto={"\"HE IS LOST, MASTER\""} x={960} y={980} desde={k55(258)} color="#ffe2a6" />} />
);
// ---------- 56 · y cada semana el Buda decía lo mismo ----------
export const P56Espera: React.FC = () => (
  <Vai cl={[mira(0, V.buda - 20, 770, 2.4), mira(82, V.buda - 20, 770, 2.6)]}
    medio={<Buda habla={[[60, 82]]} poses={[{ f: 0, v: LOTO }, { f: 56, v: LOTO_ENSENA }]} caras={[{ f: 0, v: "neutral" }, { f: 56, v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} />} />
);
// ---------- 57 · «wait» — cuatro meses después para la lluvia y el monje vuelve con la misma cara ----------
export const P57Vuelve: React.FC = () => (
  <Vai cl={[mira(0, 4300, 520, 0.9), mira(255, 4700, 560, 1.1)]} sp={{ lluvia: false }}
    medio={<>
      <Buda miradas={[{ f: 0, v: { x: -0.8, y: 0.1 } }]} />
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 3700, y: VP }, { f: 255, x: 4500, y: VP, curva: "lineal" }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} />
    </>}
    hud={<Rotulo texto="FOUR MONTHS LATER" desde={20} />} />
);
// ---------- 58 · detrás, Amrapali descalza, sin joyas, la cabeza baja ----------
export const P58Detras: React.FC = () => (
  <Vai cl={[mira(0, 4350, 600, 1.7), mira(154, 4560, 600, 1.8)]}
    medio={<>
      <A look={MONJE_JOVEN} seed={74} ruta={[{ f: 0, x: 4500, y: VP }, { f: 154, x: 4800, y: VP, curva: "lineal" }]} caras={[{ f: 0, v: "neutral" }]} poses={[{ f: 0, v: { hD: 60, cD: 70, hI: 50, cI: 80 } }]} />
      <A look={AMRA_SIN_JOYAS} seed={12} ruta={[{ f: 0, x: 4200, y: VP }, { f: 154, x: 4520, y: VP, curva: "lineal" }]} caras={[{ f: 0, v: "triste" }]} poses={[{ f: 0, v: { cabeza: 28, hD: 10, cD: 10, hI: 10, cI: 10 } }]} />
    </>} />
);
// ---------- 59 · se arrodilla ante el Buda: «él me ganó con nada» ----------
const k59 = kDe(279.03);
export const P59Arrodilla: React.FC = () => (
  <Vai cl={[mira(0, V.buda - 160, 700, 1.9), mira(150, V.buda - 150, 740, 2.3), mira(271, V.buda - 170, 760, 2.5)]}
    medio={<>
      <Buda miradas={[{ f: 0, v: { x: -0.9, y: 0.2 } }]} caras={[{ f: 0, v: "neutral" }, { f: 200, v: "feliz" }]} />
      <A look={AMRA_SIN_JOYAS} seed={12} ruta={[{ f: 0, x: V.buda - 300, y: VP }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: undefined }, { f: 24, v: 30 }]}
        poses={[{ f: 0, v: { cabeza: 26 } }, { f: 24, v: { tronco: 26, pI: 100, rI: 150, pD: 96, rD: 150, hD: 40, cD: 80, hI: 30, cI: 70, cabeza: 14 } }]}
        caras={[{ f: 0, v: "triste" }, { f: 150, v: "determinado" }]} habla={[[k59(279.4), k59(286.57)], [k59(286.71), k59(287.85)]]} />
    </>} />
);
// ---------- 60 · la mujer más deseada de la India se hizo monja ----------
export const P60Monja: React.FC = () => (
  <Vai cl={[mira(0, 4600, 600, 2.0), mira(118, 4600, 600, 2.2)]}
    medio={<A look={AMRAPALI_MONJA} seed={12} ruta={[{ f: 0, x: 4600, y: VP }]} giros={[{ f: 0, v: 0 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 30, cD: 110, hI: 30, cI: 110 } }]} />}
    hud={<Pildora texto="AMRAPALI · NUN" x={960} y={980} desde={10} color="#ffe2a6" />} />
);
// ---------- 61 · regala su jardín a los monjes; poemas que todavía se leen ----------
export const P61Poemas: React.FC = () => {
  const f = useF();
  return (
    <Vai cl={[mira(0, V.jardin - 100, 520, 1.1), mira(266, V.jardin + 100, 560, 1.3)]}
      medio={<>
        {[0, 1, 2].map((k) => <A key={k} look={MONJE(k)} seed={90 + k} ruta={[{ f: 0, x: V.jardin - 600 + k * 170, y: VP }, { f: 200, x: V.jardin - 260 + k * 170, y: VP }]} caras={[{ f: 0, v: "feliz" }]} />)}
        <A look={AMRAPALI_MONJA} seed={12} ruta={[{ f: 0, x: V.jardin + 240, y: VP }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { ...LOTO, hD: 40, cD: 120, cabeza: 18 } }]} caras={[{ f: 0, v: "feliz" }]} />
      </>}
      hud={f > 110 ? <Frase texto="her poems are still read today" desde={120} tam={60} y={960} color="#ffe2a6" /> : null} />
  );
};
// ---------- 62 · el farol titila otra vez → Leo, luz blanca, el tel tibio en la mano ----------
export const P62Vuelta: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, L.farol, 660, 3.4), mira(36, L.farol, 660, 3.4), mira(40, L.leo + 40, 650, 2.2), mira(229, L.leo + 50, 645, 2.45)]} sp={{ luzFarol: f < 36 && f % 9 < 3 ? 0.4 : 1.2 }}
      tenzo={{ poses: doblando(0, 230, 40) }} mara={{ opacidad: () => 0.85 }} leo={{ luz: rimTel, caras: [{ f: 0, v: "duda" }] }} hud={<Hud />} />
  );
};
// ---------- 63 · «okay… but he was a monk. I'm not a monk» ----------
const k63 = kDe(308.63);
export const P63NoMonje: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 20, 650, 2.4), mira(171, L.leo + 20, 645, 2.6)]} tenzo={{ no: true }} mara={{ opacidad: () => 0.85, caras: [{ f: 0, v: "feliz" }] }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }, { f: k63(312.9), v: { ...CEL_SENT, cabeza: 0, hI: 60, cI: 70 } }], miradas: [{ f: 0, v: MIRA_TENZO }],
      caras: [{ f: 0, v: "duda" }, { f: k63(312.9), v: "triste" }], habla: [[0, k63(310.41)], [k63(310.47), k63(314.17)]] }} hud={<Hud />} />
);
// ---------- 64 · el viejo por fin lo mira: ojos chiquitos y buenos ----------
export const P64Mira: React.FC = () => (
  <Lav cl={[mira(0, 1710, 640, 2.6), mira(156, 1715, 635, 3.0)]} leo={{ no: true }} toalla={0.8}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 20, v: { ...DOBLA_A, cabeza: 0 } }], miradas: [{ f: 0, v: { x: -0.3, y: 0.6 } }, { f: 24, v: { x: -0.9, y: 0 } }], caras: [{ f: 0, v: "neutral" }, { f: 60, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 65 · «neither was he at first. Do you know what he knew that you don't?» · Leo espera ----------
const k65 = kDe(319.59);
export const P65Sabia: React.FC = () => (
  <Lav cl={[mira(0, 1450, 600, 1.5), mira(160, 1450, 600, 1.65)]} toalla={0.8} mara={{ opacidad: () => 0.85 }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }], miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }] }}
    tenzo={{ poses: [{ f: 0, v: { ...DOBLA_A, cabeza: 0 } }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], habla: [[0, k65(321.39)], [k65(321.41), k65(323.63)]], caras: [{ f: 0, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 66 · DESIRE IS LOUD. IT IS NOT STRONG. ----------
export const P66Fuerte: React.FC = () => <Fondo><Frase texto="DESIRE IS LOUD." desde={2} tam={110} y={440} /><Frase texto="IT IS NOT STRONG." desde={44} tam={110} y={600} color={ACENTO} /></Fondo>;
// ---------- 67 · levanta el farol: «a fire made of paper» ----------
const tenzoFarol = (o: Partial<ActorProps> = {}) => ({ poses: [{ f: 0, v: DOBLA_A }, { f: 24, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }], enManoD: (f: number) => (f >= 22 ? <FarolMano luz={1.3} /> : null), miradas: [{ f: 0, v: { x: -0.9, y: -0.1 } }], ...o });
const k67 = kDe(327.95);
export const P67Papel: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 1680, 640, 2.3), mira(118, 1680, 630, 2.5)]} leo={{ no: true }} toalla={0.8} sp={{ farol: f < 22 }}
      tenzo={tenzoFarol({ habla: [[k67(329.99), k67(331.87)]], caras: [{ f: 0, v: "feliz" }] })} hud={<Hud />} />
  );
};
// ---------- 68 · «you think you must feed it or it will eat you… just watch it» ----------
const k68 = kDe(331.93);
export const P68Mirar: React.FC = () => (
  <Lav cl={[mira(0, 1700, 640, 2.6), mira(166, 1700, 635, 2.9)]} leo={{ no: true }} toalla={0.8} sp={{ farol: false }}
    tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }], enManoD: <FarolMano luz={1.3} />, habla: [[0, k68(334.41)], [k68(334.6), 167]], caras: [{ f: 0, v: "neutral" }, { f: 90, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 69 · detrás de Leo la sombra ya no sonríe: «don't listen to him. He's old» ----------
const k69 = kDe(337.5);
export const P69SinSonrisa: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 60, 590, 1.9), mira(150, L.leo - 90, 570, 2.1), mira(293, L.leo - 90, 565, 2.2)]} tenzo={{ no: true }}
    mara={{ opacidad: () => 0.95, caras: [{ f: 0, v: "neutral" }, { f: k69(340), v: "enojo" }], habla: [[k69(341.3), k69(347.1)]], ruta: [{ f: 0, x: L.leo - 170, y: LP - 10 }, { f: 120, x: L.leo - 120, y: LP - 10 }],
      poses: [{ f: 0, v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }, { f: 120, v: { hD: 100, cD: 40, hI: 60, cI: 50, tronco: 24, cabeza: 24 } }] }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 6 } }], miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }] }}
    hud={<><Hud /><ManoMara texto="don't listen to him" x={240} y={250} desde={k69(341.4)} tam={80} hasta={k69(344.5)} /><ManoMara texto="he's old" x={300} y={250} desde={k69(344.6)} tam={90} /></>} />
);
// ---------- 70 · «how long?» · «how long what?» · «to burn out?» ----------
const k70 = kDe(347.31);
export const P70Cuanto: React.FC = () => (
  <Lav cl={[mira(0, 1450, 600, 1.55), mira(164, 1450, 600, 1.7)]} toalla={0.8} sp={{ farol: false }} mara={{ opacidad: () => 0.8, caras: [{ f: 0, v: "enojo" }] }}
    leo={{ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }], miradas: [{ f: 0, v: MIRA_TENZO }], caras: [{ f: 0, v: "duda" }], habla: [[0, k70(348.11)], [k70(350.73), k70(352.77)]] }}
    tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }], enManoD: <FarolMano luz={1.2} />, habla: [[k70(349.39), k70(350.57)]], caras: [{ f: 0, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 71 · lo piensa, como si nadie le hubiera hecho una pregunta mejor: «less than you are afraid of» ----------
const k71 = kDe(352.81);
export const P71Menos: React.FC = () => (
  <Lav cl={[mira(0, 1700, 640, 2.6), mira(208, 1705, 635, 3.0)]} leo={{ no: true }} toalla={0.8} sp={{ farol: false }}
    tenzo={{ ...tenzoFarol(), poses: [{ f: 0, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }, { f: 30, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: -12 } }, { f: 120, v: { ...DOBLA_A, hD: 70, cD: 20, cabeza: 0 } }],
      enManoD: <FarolMano luz={1.2} />, miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: 30, v: { x: -0.3, y: -0.8 } }, { f: 120, v: { x: -0.9, y: 0 } }],
      caras: [{ f: 0, v: "neutral" }, { f: 30, v: "duda" }, { f: 125, v: "feliz" }], habla: [[k71(357.23), k71(359.77)]] }} hud={<Hud />} />
);
// ---------- 72 · la ola: sube y baja en 90 segundos; «you only have to not jump in» ----------
const k72 = kDe(359.79);
export const P72Ola: React.FC = () => {
  const f = useF();
  return <><Ola p={interpolate(f, [0, 150], [0, 1], cl)} /><Frase texto="you only have to not jump in" desde={k72(363.7)} tam={64} y={960} /><Hud /></>;
};
// ---------- 73 · el tel sigue prendido: 9h 43m; «just one more» ----------
const k73 = kDe(367.01);
export const P73Pantalla: React.FC = () => (
  <Fondo><TelGrande modo="screentime" min={583} /><Hud {...H83} /><ManoMara texto="just one more" x={240} y={300} desde={k73(372.6)} tam={84} /></Fondo>
);
// ---------- 74 · por primera vez en diez años no le contesta a la voz ----------
export const P74NoResponde: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 60, 600, 2.2), mira(117, L.leo - 60, 600, 2.4)]} tenzo={{ no: true }}
    mara={{ opacidad: () => 0.95, caras: [{ f: 0, v: "picaro" }], habla: [[0, 40]], ruta: [{ f: 0, x: L.leo - 120, y: LP - 10 }], poses: [{ f: 0, v: { hD: 100, cD: 40, hI: 60, cI: 50, tronco: 24, cabeza: 24 } }] }}
    leo={{ poses: [{ f: 0, v: CEL_SENT }, { f: 50, v: { ...CEL_SENT, cabeza: 4 } }], caras: [{ f: 0, v: "cansado" }, { f: 50, v: "determinado" }] }} hud={<Hud {...H83} />} />
);
// ---------- 75 · da vuelta el tel sobre la mesa y mira ----------
export const P75BocaAbajo: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, L.leo + 120, 680, 2.6), mira(127, L.leo + 120, 670, 2.8)]} tenzo={{ no: true }} telMesa={f >= 40 ? { bocaAbajo: true } : undefined}
      leo={{ poses: [{ f: 0, v: CEL_SENT }, { f: 30, v: { ...CEL_SENT, hD: 70, cD: 30, cabeza: 18 } }, { f: 44, v: DOBLA_A }], enManoD: (fr: number) => (fr < 40 ? <Tel /> : null), caras: [{ f: 0, v: "determinado" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.8 } }] }}
      hud={<Hud {...H83} />} />
  );
};
// ---------- 76 · la ola sube: pecho apretado, el pulgar lo quiere ----------
const leoMira = { poses: [{ f: 0, v: DOBLA_A }], enManoD: () => null, miradas: [{ f: 0, v: { x: 0.6, y: 0.8 } }] };
export const P76Sube: React.FC = () => {
  const f = useF();
  return f < 100
    ? <><Ola p={interpolate(f, [0, 100], [0, 0.33], cl)} /><Hud {...H83} /></>
    : <Lav cl={[mira(0, L.leo + 40, 660, 2.4), mira(201, L.leo + 40, 655, 2.7)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
        leo={{ ...leoMira, poses: [{ f: 0, v: { ...DOBLA_A, hD: 50, cD: 60 } }, { f: 140, v: { ...DOBLA_A, hD: 66, cD: 30 } }, { f: 170, v: { ...DOBLA_A, hD: 50, cD: 60 } }], caras: [{ f: 0, v: "miedo" }] }} hud={<Hud {...H83} />} />;
};
// ---------- 77 · treinta segundos, sesenta; la sombra se acerca: «you'll fail anyway» ----------
const k77 = kDe(389.17);
const Reloj: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ position: "absolute", right: 120, top: 120, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 110, color: BLANCO_MANO, fontVariantNumeric: "tabular-nums" }}>{Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}</div>
);
export const P77Sesenta: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, L.leo - 40, 600, 2.1), mira(197, L.leo - 60, 580, 2.4)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
      mara={{ opacidad: () => 0.97, escala: ESC * 1.25, caras: [{ f: 0, v: "enojo" }, { f: k77(393), v: "picaro" }], habla: [[k77(392.97), k77(395.69)]],
        ruta: [{ f: 0, x: L.leo - 170, y: LP - 10 }, { f: k77(392.9), x: L.leo - 90, y: LP - 10 }], poses: [{ f: 0, v: { hD: 100, cD: 40, hI: 60, cI: 50, tronco: 24, cabeza: 24 } }] }}
      leo={{ ...leoMira, caras: [{ f: 0, v: "miedo" }] }}
      hud={<><Hud {...H83} /><Reloj s={f < k77(390.2) ? 30 : 30 + Math.min(30, Math.round((f - k77(390.2)) / 2))} /><ManoMara texto="you'll fail anyway" x={240} y={250} desde={k77(393)} tam={80} /></>} />
  );
};
// ---------- 78 · noventa segundos y la ola baja; la sombra se achica como un perro aburrido ----------
export const P78Baja: React.FC = () => {
  const f = useF();
  return f < 130
    ? <><Ola p={interpolate(f, [0, 130], [0.6, 1], cl)} seg={Math.round(interpolate(f, [0, 130], [60, 90], cl))} /><Hud {...H83} /></>
    : <Lav cl={[mira(0, L.leo - 60, 620, 1.9), mira(170, L.leo - 40, 630, 1.8)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }}
        mara={{ opacidad: (fr: number) => interpolate(fr, [0, 160], [0.9, 0.55], cl), escala: ESC * 1.05, caras: [{ f: 0, v: "cansado" }], ruta: [{ f: 0, x: L.leo - 170, y: LP - 10 }, { f: 160, x: L.leo - 230, y: LP - 10 }],
          poses: [{ f: 0, v: { tronco: 4, cabeza: 30, hD: 10, cD: 10, hI: 10, cI: 10 } }] }}
        leo={{ ...leoMira, poses: [{ f: 0, v: DOBLA_A }, { f: 40, v: { ...DOBLA_A, tronco: -4, cabeza: 6 } }], caras: [{ f: 0, v: "sorpresa" }, { f: 60, v: "neutral" }] }} hud={<Hud {...H83} />} />;
};
// ---------- 79 · la secadora zumba; Leo salta ----------
export const P79Zumba: React.FC = () => (
  <Lav cl={[mira(0, L.secadoraLeo, 600, 2.0), mira(73, L.secadoraLeo + 40, 600, 2.1)]} tenzo={{ no: true }} telMesa={{ bocaAbajo: true }} mano={1.4}
    leo={{ ...leoMira, poses: [{ f: 0, v: DOBLA_A }, { f: 6, v: { ...DOBLA_A, tronco: -16, hD: 110, cD: 30, hI: 100, cI: 30, cabeza: -10 } }, { f: 30, v: DOBLA_A }], dir: [{ f: 0, v: 1 }, { f: 40, v: -1 }], caras: [{ f: 0, v: "neutral" }, { f: 5, v: "sorpresa" }] }}
    hud={<Hud {...H83} />} />
);
// ---------- 80-84 · Tenzo en la puerta con el farol hamacándose, nieve detrás ----------
const tenzoPuerta = (o: Partial<ActorProps> = {}) => ({
  ruta: [{ f: 0, x: L.puerta - 80, y: LP }], dir: [{ f: 0, v: -1 as const }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10 } }],
  enManoD: <FarolMano luz={1.3} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], ...o,
});
const leoParado = (o: Partial<ActorProps> = {}) => ({ ruta: [{ f: 0, x: L.leo + 160, y: LP }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: "parado" }], enManoD: () => null, dir: [{ f: 0, v: 1 as const }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], ...o });
export const P80Puerta: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 100, 640, 2.0), mira(70, L.leo + 130, 640, 2.1), mira(71, L.puerta - 300, 600, 1.3), mira(252, L.puerta - 160, 610, 1.6)]}
    toalla={1} sp={{ farol: false }} telMesa={{ bocaAbajo: true }}
    leo={leoParado({ caras: [{ f: 0, v: "sorpresa" }] })} tenzo={tenzoPuerta()} hud={<Hud {...H83} />} />
);
// ---------- 81 · «what's your name?» · «in my temple they called me Tenzo» ----------
const k81 = kDe(416.67);
export const P81Nombre: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 160, 660, 2.4), mira(74, L.leo + 160, 660, 2.5), mira(75, L.puerta - 80, 690, 2.4), mira(216, L.puerta - 80, 690, 2.6)]} toalla={1} sp={{ farol: false }} telMesa={{ bocaAbajo: true }}
    leo={leoParado({ caras: [{ f: 0, v: "neutral" }], habla: [[0, k81(418.97)]] })}
    tenzo={tenzoPuerta({ habla: [[k81(421.35), k81(423.27)]], caras: [{ f: 0, v: "neutral" }, { f: k81(421.3), v: "feliz" }], poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10, cabeza: 0 } }, { f: 90, v: { ...FAROL, hI: 10, cI: 10, cabeza: -10 } }, { f: k81(421.2), v: { ...FAROL, hI: 10, cI: 10 } }] })}
    hud={<><Hud {...H83} /><Pildora texto="TENZO · THE TEMPLE COOK" x={960} y={980} desde={k81(421.6)} color="#ffe2a6" /></>} />
);
// ---------- 82 · «the cook» — sonríe — «I made the rice» ----------
const k82 = kDe(423.91);
export const P82Arroz: React.FC = () => (
  <Lav cl={[mira(0, L.puerta - 80, 690, 2.6), mira(132, L.puerta - 80, 690, 2.85)]} toalla={1} sp={{ farol: false }} leo={{ no: true }}
    tenzo={tenzoPuerta({ habla: [[k82(424.3), k82(425.4)], [k82(426.91), k82(428.21)]], caras: [{ f: 0, v: "neutral" }, { f: k82(425.5), v: "risa" }, { f: k82(426.9), v: "feliz" }] })} hud={<Hud {...H83} />} />
);
// ---------- 83 · «will you be here tomorrow?» · «every night, three o'clock. Bring the phone… a prince» ----------
const k83 = kDe(428.33);
export const P83Manana: React.FC = () => (
  <Lav cl={[mira(0, L.leo + 160, 660, 2.4), mira(42, L.leo + 160, 660, 2.45), mira(43, L.puerta - 300, 620, 1.6), mira(299, L.puerta - 260, 630, 1.85)]} toalla={1} sp={{ farol: false }} telMesa={{ bocaAbajo: true }}
    leo={leoParado({ ruta: [{ f: 0, x: L.leo + 160, y: LP }, { f: 120, x: L.leo + 160, y: LP }, { f: 260, x: L.puerta - 520, y: LP }], caras: [{ f: 0, v: "duda" }, { f: 140, v: "neutral" }], habla: [[0, k83(429.75)]] })}
    tenzo={tenzoPuerta({ habla: [[k83(429.4), k83(432.17)], [k83(432.3), k83(435.15)], [k83(435.2), k83(438.3)]], poses: [{ f: 0, v: { ...FAROL, hI: 10, cI: 10 } }, { f: k83(435.2), v: { ...FAROL, hI: 60, cI: 50 } }] })}
    hud={<Hud {...H83} />} />
);
// ---------- 84 · la puerta se cierra, la campanita, pasa el tren ----------
export const P84Cierra: React.FC = () => (
  <Lav cl={[mira(0, L.puerta - 500, 520, 1.1), mira(112, L.puerta - 560, 520, 1.15)]} toalla={1} sp={{ farol: false, tren: 20 }} telMesa={{ bocaAbajo: true }}
    leo={leoParado({ ruta: [{ f: 0, x: L.puerta - 520, y: LP }], caras: [{ f: 0, v: "neutral" }] })} tenzo={{ no: true }} hud={<Hud {...H83} />} />
);
// ---------- 85 · DAY 1 · screen time congelado; la sombra, bajito: «tomorrow.» ----------
const k85 = kDe(442.09);
export const P85Dia1: React.FC = () => (
  <Lav cl={[mira(0, L.puerta - 560, 620, 1.6), mira(271, L.puerta - 580, 640, 2.1)]} toalla={1} sp={{ farol: false }} tenzo={{ no: true }}
    leo={leoParado({ ruta: [{ f: 0, x: L.puerta - 520, y: LP }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] })}
    mara={{ ruta: [{ f: 0, x: L.puerta - 650, y: LP - 10 }], escala: ESC * 0.8, opacidad: (fr: number) => interpolate(fr, [k85(447), k85(449)], [0, 0.85], cl), caras: [{ f: 0, v: "picaro" }], habla: [[k85(450.03), k85(450.85)]] }}
    hud={<><HudCongelado /><Pildora texto="DAY 1 · SCREEN TIME FROZEN" x={960} y={980} desde={6} color="#c9ced6" /><ManoMara texto="tomorrow." x={300} y={300} desde={k85(450.03)} tam={86} /></>} />
);
const HudCongelado: React.FC = () => <Hud m={583} est="congelado" />;
// ---------- 86 · CTA: «what is your shadow whispering to you tonight?» + suscribirse ----------
const k86 = kDe(451.17);
export const P86Cta: React.FC = () => {
  const f = useF();
  const o = interpolate(f, [k86(453.6), k86(454.2)], [0, 1], cl);
  return (
    <>
      <Lav cl={[mira(0, L.farol, 640, 1.4), mira(283, L.farol, 640, 1.6)]} toalla={1} leo={{ no: true }} tenzo={{ no: true }} sp={{ luzFarol: 1.3 }} />
      <AbsoluteFill style={{ background: "#0b0c0f", opacity: 0.55 }} />
      <Frase texto="What is your shadow whispering to you tonight?" desde={4} tam={72} y={420} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 300, opacity: o }}>
        <div style={{ padding: "22px 56px", borderRadius: 999, background: ACENTO, color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 56, letterSpacing: 4, transform: `scale(${1 + 0.04 * Math.sin(f / 8)})` }}>SUBSCRIBE · DAY 2 TOMORROW</div>
      </AbsoluteFill>
    </>
  );
};
