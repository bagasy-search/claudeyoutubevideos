// tz02 · planos 1-42 (0 → 198 s): el cuadro 0, día 2 en el lavadero, la mandarina, «one night», el palacio de Siddhartha, la entrega del tel.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Pildora } from "../anikit/pantalla";
import { ALDEANA, ALDEANO, ASITA, ESC, FAROL, LEO, MARA, REY, SIDDHARTHA, TENZO, VIEJO } from "../tenzo/elenco";
import { ManoMara, Rotulo } from "../tenzo/hud";
import { BolsoRopa, FarolMano, Mandarina, Tel } from "../tenzo/utileria";
import { TelGrande } from "../tenzo/graficos";
import { Escena } from "../anikit/escena";
import { Broadway } from "../tenzo/sets/broadway";
import { PAL } from "../tenzo/elenco";
import { CEL_SENT, DOBLA_A, kDe, Lav, LAV_PUNTOS, LP, rimOro, SENTADO } from "../tz01/base";
import { Fondo, fade } from "../tz01/planos1";
import { A, Bebe, Hud2, K, Kap, KP, PRINCESA } from "./base";

const L = LAV_PUNTOS;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const MIRA_T = { x: 0.9, y: 0 }, MIRA_L = { x: -0.9, y: 0 };
const PELA = { ...DOBLA_A, hD: 50, cD: 110, hI: 45, cI: 100, cabeza: 18 }; // pela la mandarina frente al pecho
const OFRECE = { ...SENTADO, hD: 85, cD: 5, hI: 20, cI: 40, tronco: 4, cabeza: 2 }; // tiende la mano abierta
const AFERRA = { ...CEL_SENT, hD: 40, cD: 130, hI: 40, cI: 120, cabeza: 4, tronco: -6 }; // abraza el tel contra el pecho
const tenzoPela = (o = {}) => ({ poses: [{ f: 0, v: PELA }], enManoD: (fr: number) => <Mandarina pelada={Math.min(1, 0.3 + fr / 400)} s={1.2} />, caras: [{ f: 0, v: "feliz" }], ...o });
const leoSent = (o = {}) => ({ poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }], miradas: [{ f: 0, v: MIRA_T }], caras: [{ f: 0, v: "neutral" }], ...o });

// ---------- 1 · CUADRO 0 = la miniatura sin texto: Tenzo tiende la mano, Leo aferrado al tel, Mara detrás ----------
export const Q01Mini: React.FC = () => (
  <Lav cl={[mira(0, 1420, 600, 1.75), mira(105, 1425, 600, 1.82)]} toalla={-1} sp={{ farol: false }}
    tenzo={{ ruta: [{ f: 0, x: 1230, y: LP }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 82, cD: 4, hI: 30, cI: 40, tronco: 6 } }],
      enManoI: <FarolMano luz={1.4} />, caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.8, y: 0.1 } }] }}
    leo={{ ruta: [{ f: 0, x: 1600, y: LP }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "miedo" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
    mara={{ ruta: [{ f: 0, x: 1760, y: LP - 10 }], escala: ESC * 1.6, giros: [{ f: 0, v: 0 }], poses: [{ f: 0, v: { tronco: 0, cabeza: 8, hD: 105, cD: 55, hI: -105, cI: -55 } }], caras: [{ f: 0, v: "risa" }], opacidad: () => 0.96 }} />
);
// ---------- 2 · un príncipe que vivió adentro de un palacio de placer ----------
export const Q02Palacio: React.FC = () => (
  <Kap cl={[mira(0, 1500, 420, 0.6), mira(108, 2000, 470, 0.72)]} sp={{ flores: 0.6 }}
    medio={<A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: 1700, y: KP }, { f: 108, x: 2050, y: KP }]} caras={[{ f: 0, v: "neutral" }]} />} />
);
// ---------- 3 · hoy ese palacio cabe en tu bolsillo ----------
export const Q03Bolsillo: React.FC = () => <Fondo><TelGrande modo="feed" vel={10} /><Hud2 /></Fondo>;
// ---------- 4 · día dos, tres de la mañana, el tren ----------
export const Q04Dia2: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 500, 300, 0.75), mira(167, 560, 420, 0.85)]} setProps={{ tren: 10, nieve: true }}
    hud={<><Hud2 /><Rotulo texto="DAY 2 · 3:00 AM · BROADWAY & LAWRENCE" desde={8} /></>} />
);
// ---------- 5 · Leo entra con el bolso y el tel en la mano, como le pidió el viejo ----------
export const Q05Entra: React.FC = () => (
  <Lav cl={[mira(0, 1900, 560, 1.0), mira(229, 1500, 600, 1.25)]} toalla={-1} sp={{ tren: 30 }}
    tenzo={tenzoPela({ caras: [{ f: 0, v: "neutral" }, { f: 150, v: "feliz" }] })}
    leo={{ ruta: [{ f: 0, x: 2500, y: LP }, { f: 170, x: L.leo, y: LP }], dir: [{ f: 0, v: -1 }, { f: 175, v: 1 }], asiento: [{ f: 0, v: undefined }, { f: 185, v: 66 }],
      poses: [{ f: 0, v: { hD: 30, cD: 110, hI: 10, cI: 10 } }, { f: 185, v: { ...CEL_SENT, cabeza: 0 } }], enManoI: (f: number) => (f < 180 ? <BolsoRopa /> : null), caras: [{ f: 0, v: "cansado" }] }} hud={<Hud2 />} />
);
// ---------- 6 · Tenzo ya está: mismo rincón, misma túnica, el farol en la mesa ----------
export const Q06YaEsta: React.FC = () => (
  <Lav cl={[mira(0, 1600, 660, 2.6), mira(90, 1680, 650, 2.4, { curva: "inout" }), mira(225, 1660, 640, 2.2)]} leo={{ no: true }} toalla={-1} sp={{ luzFarol: 1.3 }}
    tenzo={tenzoPela({ enManoD: <Mandarina s={1.2} />, poses: [{ f: 0, v: DOBLA_A }] })} hud={<Hud2 />} />
);
// ---------- 7 · hoy no dobla toallas: pela una mandarina, despacio, en una sola espiral ----------
export const Q07Mandarina: React.FC = () => (
  <Lav cl={[mira(0, 1700, 690, 3.2), mira(227, 1700, 690, 3.5)]} leo={{ no: true }} toalla={-1} tenzo={tenzoPela({ enManoD: (fr: number) => <Mandarina pelada={fr / 230} s={1.2} /> })} hud={<Hud2 />} />
);
// ---------- 8 · «you came» · «you said bring the phone» ----------
const k08 = kDe(38.5);
export const Q08Viniste: React.FC = () => (
  <Lav cl={[mira(0, 1450, 600, 1.5), mira(100, 1450, 600, 1.6)]} toalla={-1}
    tenzo={tenzoPela({ habla: [[0, k08(39.2)]], miradas: [{ f: 0, v: MIRA_L }] })} leo={leoSent({ habla: [[k08(40.04), k08(41.16)]] })} hud={<Hud2 />} />
);
// ---------- 9 · Tenzo tiende la mano. Abierta. Paciente ----------
export const Q09Mano: React.FC = () => (
  <Lav cl={[mira(0, 1620, 640, 2.3), mira(99, 1600, 640, 2.6)]} leo={{ no: true }} toalla={-1}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 18, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }] }} hud={<Hud2 />} />
);
// ---------- 10 · Leo se ríe: «no way» · «one night» ----------
const k10 = kDe(45.18);
export const Q10NoWay: React.FC = () => (
  <Lav cl={[mira(0, 1450, 610, 1.6), mira(96, 1450, 610, 1.7)]} toalla={-1}
    tenzo={{ poses: [{ f: 0, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[k10(47.38), k10(47.9)]] }}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "risa" }], habla: [[0, k10(46.38)], [k10(46.42), k10(46.92)]] })} hud={<Hud2 />} />
);
// ---------- 11 · «I need it. For work. For… everything» ----------
export const Q11Necesito: React.FC = () => (
  <Lav cl={[mira(0, L.leo, 650, 2.4), mira(94, L.leo, 645, 2.6)]} tenzo={{ no: true }} toalla={-1}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "duda" }, { f: 50, v: "triste" }], habla: [[0, 70]] })} hud={<Hud2 />} />
);
// ---------- 12 · «one night. Tomorrow at three I give it back… a prince who had never seen a phone» ----------
const k12 = kDe(51.56);
export const Q12UnaNoche: React.FC = () => (
  <Lav cl={[mira(0, 1700, 650, 2.4), mira(252, 1705, 640, 2.8)]} leo={{ no: true }} toalla={-1}
    tenzo={{ poses: [{ f: 0, v: OFRECE }, { f: k12(55.5), v: { ...OFRECE, hD: 60, cD: 40 } }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k12(53.74)], [k12(53.8), k12(55.9)], [k12(56), k12(59.9)]] }} hud={<Hud2 />} />
);
// ---------- 13 · detrás de Leo algo se estira, bosteza y sonríe ----------
export const Q13Estira: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 60, 600, 2.0), mira(138, L.leo - 90, 560, 2.2)]} tenzo={{ no: true }} toalla={-1}
    mara={{ opacidad: fade(0, 40, 0.96), poses: [{ f: 0, v: { tronco: 10, cabeza: 20, hD: 10, cD: 10, hI: 10, cI: 10 } }, { f: 40, v: { tronco: -8, cabeza: -14, hD: 170, cD: 20, hI: -170, cI: -20 } }, { f: 90, v: { hD: 70, cD: 80, hI: 30, cI: 60, tronco: 16, cabeza: 18 } }],
      caras: [{ f: 0, v: "cansado" }, { f: 40, v: "sorpresa" }, { f: 90, v: "picaro" }] }}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "duda" }] })} hud={<Hud2 />} />
);
// ---------- 14 · «don't give it to him… you hate being alone with yourself» ----------
const k14 = kDe(64.6);
export const Q14NoSelo: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 80, 560, 2.2), mira(140, L.leo - 90, 545, 2.4)]} tenzo={{ no: true }} toalla={-1}
    mara={{ opacidad: () => 0.96, ruta: [{ f: 0, x: L.leo - 130, y: LP - 10 }], poses: [{ f: 0, v: { hD: 100, cD: 40, hI: 60, cI: 50, tronco: 24, cabeza: 24 } }], caras: [{ f: 0, v: "picaro" }], habla: [[0, k14(65.46)], [k14(65.76), k14(69.2)]] }}
    leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "miedo" }] })}
    hud={<><Hud2 /><ManoMara texto="don't give it to him" x={240} y={250} desde={2} hasta={k14(65.7)} tam={80} /><ManoMara texto="you hate being alone" x={240} y={250} desde={k14(67.3)} tam={80} /></>} />
);
// ---------- 15 · el farol titila y el lavadero desaparece ----------
export const Q15Titila: React.FC = () => {
  const f = useF();
  return (
    <>
      <Lav cl={[mira(0, L.farol, 660, 2.8), mira(97, L.farol, 660, 3.6)]} leo={{ no: true }} toalla={-1} sp={{ luzFarol: f % 9 < 3 ? 0.4 : 1.4 + f / 60 }} tenzo={tenzoPela()} hud={<Hud2 />} />
      <AbsoluteFill style={{ background: "#fff2d0", opacity: interpolate(f, [60, 97], [0, 1], cl) }} />
    </>
  );
};
// ---------- 16 · Kapilavastu, al pie del Himalaya ----------
export const Q16Kapila: React.FC = () => (
  <Kap cl={[mira(0, 1800, 300, 0.55), mira(147, 1200, 420, 0.7)]} sp={{ flores: 0.4 }}
    hud={<Rotulo texto="KAPILAVASTU · FOOT OF THE HIMALAYAS · 2,500 YEARS AGO" desde={8} />} />
);
// rey en el trono (sala) y el bebé
const Rey: React.FC<{ o?: object }> = ({ o = {} }) => <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono, y: KP }]} asiento={[{ f: 0, v: 56 }]} poses={[{ f: 0, v: SENTADO }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} {...o} />;
// ---------- 17 · un rey llamado Suddhodana acaba de tener un hijo ----------
export const Q17Rey: React.FC = () => (
  <Kap cl={[mira(0, -600, 560, 1.1), mira(93, -620, 580, 1.25)]}
    medio={<><Bebe /><Rey /></>} hud={<Pildora texto="KING SUDDHODANA" x={960} y={980} desde={10} color="#ffe2a6" />} />
);
// ---------- 18 · un bebé hermoso. Le dicen Siddhartha ----------
export const Q18Bebe: React.FC = () => (
  <Kap cl={[mira(0, K.cuna, 720, 2.6), mira(84, K.cuna, 720, 3.0)]} medio={<Bebe />} hud={<Pildora texto="SIDDHARTHA" x={960} y={980} desde={44} color="#ffe2a6" />} />
);
// ---------- 19 · al séptimo día un viejo sabio mira al bebé… y se pone a llorar ----------
export const Q19Asita: React.FC = () => (
  <Kap cl={[mira(0, -1100, 560, 1.2), mira(120, -980, 600, 1.6, { curva: "inout" }), mira(212, -960, 620, 2.1)]}
    medio={<><Bebe /><A look={ASITA} seed={32} ruta={[{ f: 0, x: -1500, y: KP }, { f: 110, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]}
      poses={[{ f: 0, v: "parado" }, { f: 115, v: { tronco: 22, cabeza: 18, hD: 40, cD: 40, hI: 30, cI: 30 } }, { f: 170, v: "manosCara" }]} caras={[{ f: 0, v: "feliz" }, { f: 140, v: "triste" }]} /></>} />
);
// ---------- 20 · «why are you crying? is something wrong with my son?» ----------
const k20 = kDe(90.56);
export const Q20PorQue: React.FC = () => (
  <Kap cl={[mira(0, -650, 600, 1.4), mira(140, -650, 600, 1.5)]}
    medio={<><Bebe /><A look={ASITA} seed={32} ruta={[{ f: 0, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: "manosCara" }]} caras={[{ f: 0, v: "triste" }]} />
      <A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 60, y: KP }, { f: 40, x: K.trono - 230, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "miedo" }]} habla={[[0, k20(91.68)], [k20(92.98), k20(94.96)]]} poses={[{ f: 0, v: { hD: 60, cD: 40, hI: 50, cI: 40 } }]} /></>} />
);
// ---------- 21 · «nothing is wrong… one of two things: a king of the whole world, or a holy man» ----------
const k21 = kDe(95.22);
export const Q21DosCosas: React.FC = () => {
  const f = useF();
  return (
    <Kap cl={[mira(0, K.cuna - 190, 640, 2.2), mira(268, K.cuna - 190, 640, 2.5)]}
      medio={<><Bebe /><A look={ASITA} seed={32} ruta={[{ f: 0, x: K.cuna - 190, y: KP }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 40, cD: 30, hI: 20, cI: 20 } }, { f: k21(98.5), v: { hD: 120, cD: 20, hI: 20, cI: 20 } }, { f: k21(101.5), v: { hD: 20, cD: 20, hI: 120, cI: 20 } }]}
        caras={[{ f: 0, v: "triste" }, { f: 40, v: "neutral" }]} habla={[[k21(95.3), k21(96.4)], [k21(97.6), k21(103.6)]]} /></>}
      hud={<>{f > k21(99) && <Pildora texto="A KING OF THE WHOLE WORLD" x={560} y={200} desde={k21(99.2)} color="#ffe2a6" />}{f > k21(101.6) && <Pildora texto="OR A HOLY MAN" x={1360} y={200} desde={k21(101.8)} color="#ffe2a6" />}</>} />
  );
};
// ---------- 22 · «if he ever sees the suffering of this world, he will walk away from your throne» ----------
export const Q22Sufrimiento: React.FC = () => (
  <Kap cl={[mira(0, K.trono - 230, 620, 2.4), mira(143, K.trono - 230, 615, 2.7)]}
    medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 230, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "miedo" }]} miradas={[{ f: 0, v: { x: -0.9, y: 0.1 } }]} poses={[{ f: 0, v: { hD: 30, cD: 60, hI: 30, cI: 60 } }]} />} />
);
// ---------- 23 · el rey decide: su hijo nunca verá sufrimiento ----------
export const Q23Decision: React.FC = () => (
  <Kap cl={[mira(0, K.trono, 600, 1.6), mira(141, K.trono, 600, 1.9)]}
    medio={<A look={REY} seed={31} ruta={[{ f: 0, x: K.trono - 180, y: KP }, { f: 60, x: K.trono - 40, y: KP }]} dir={[{ f: 0, v: 1 }, { f: 64, v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: 64, v: "determinado" }]} poses={[{ f: 0, v: "parado" }, { f: 64, v: "brazosCruzados" }]} />}
    hud={<Pildora texto="NEVER. SEE. SUFFERING." x={960} y={980} desde={k23(110.9)} color="#ffe2a6" />} />
);
const k23 = kDe(108.96);
// ---------- 24 · tres palacios: verano, invierno, lluvias ----------
export const Q24TresPalacios: React.FC = () => {
  const f = useF();
  const k = kDe(113.67);
  const t = f < k(115.7) ? "ONE FOR THE SUMMER" : f < k(117.3) ? "ONE FOR THE WINTER" : "ONE FOR THE RAINY SEASON";
  return <Kap cl={[mira(0, -400, 420, 0.65), mira(80, 300, 420, 0.65, { curva: "inout" }), mira(160, 1300, 420, 0.65, { curva: "inout" })]} sp={{ flores: 0.3 }} hud={<Pildora texto={t} x={960} y={980} desde={4} color="#ffe2a6" />} />;
};
// ---------- 25 · músicos día y noche; flores; los jardineros sacan cada flor muerta antes del alba ----------
const k25 = kDe(119.01);
export const Q25Musicos: React.FC = () => (
  <Kap cl={[mira(0, K.musicos, 600, 1.4), mira(110, K.musicos + 200, 600, 1.4), mira(140, K.flores, 640, 1.8, { curva: "inout" }), mira(212, K.flores, 640, 2.0)]} sp={{ flores: 0.8 }}
    medio={<>
      {[0, 1, 2].map((q) => <A key={q} look={q === 1 ? ALDEANA : ALDEANO} seed={40 + q} ruta={[{ f: 0, x: K.musicos - 150 + q * 150, y: KP }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: { tronco: 4, pI: 70, rI: 150, pD: 100, rD: 160, hD: 60, cD: (q * 40 + 60) % 140, hI: 50, cI: 90 } }, { f: 15, v: { tronco: 4, pI: 70, rI: 150, pD: 100, rD: 160, hD: 70, cD: 40, hI: 60, cI: 70 } }]} caras={[{ f: 0, v: "feliz" }]} />)}
      <A look={ALDEANO} seed={44} ruta={[{ f: 0, x: K.flores - 60, y: KP }]} poses={[{ f: 0, v: { tronco: 40, cabeza: 20, hD: 80, cD: 60, hI: 20, cI: 30 } }, { f: k25(123.5), v: { tronco: 20, cabeza: 10, hD: 140, cD: 40, hI: 20, cI: 30 } }]} caras={[{ f: 0, v: "neutral" }]} />
    </>} />
);
// ---------- 26 · ni sirvientes viejos ni enfermos ----------
export const Q26SinViejos: React.FC = () => (
  <Kap cl={[mira(0, 1000, 600, 1.4), mira(79, 1080, 600, 1.5)]} sp={{ flores: 0.5 }}
    medio={<>{[0, 1, 2].map((q) => <A key={q} look={q === 1 ? ALDEANA : ALDEANO} seed={50 + q} ruta={[{ f: 0, x: 860 + q * 160, y: KP }]} caras={[{ f: 0, v: "feliz" }]} />)}</>}
    hud={<Pildora texto="NO OLD SERVANTS · NO SICK SERVANTS" x={960} y={980} desde={6} color="#ffe2a6" />} />
);
// ---------- 27 · si alguien envejecía o enfermaba, desaparecía del palacio de noche ----------
export const Q27Noche: React.FC = () => (
  <Kap cl={[mira(0, 2700, 560, 1.0), mira(158, 2950, 580, 1.15)]} sp={{ noche: true, portonAbierto: 1 }}
    medio={<>
      <A look={VIEJO} seed={53} ruta={[{ f: 0, x: 2500, y: KP }, { f: 158, x: 3150, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { tronco: 20, cabeza: 22, hD: 10, cD: 10, hI: 10, cI: 10 } }]} caras={[{ f: 0, v: "triste" }]} />
      <A look={ALDEANO} seed={54} ruta={[{ f: 0, x: 2350, y: KP }, { f: 158, x: 3000, y: KP, curva: "lineal" }]} poses={[{ f: 0, v: { hD: 60, cD: 20 } }]} caras={[{ f: 0, v: "neutral" }]} />
    </>} />
);
// ---------- 28 · Siddhartha crece entre caras jóvenes, música y jardines perfectos ----------
export const Q28Crece: React.FC = () => (
  <Kap cl={[mira(0, K.estanque - 300, 560, 1.1), mira(150, K.estanque, 580, 1.35)]} sp={{ flores: 0.8 }}
    medio={<>
      {[0, 1, 2, 3].map((q) => <A key={q} look={q % 2 ? ALDEANA : ALDEANO} seed={60 + q} ruta={[{ f: 0, x: K.estanque - 500 + q * 300 + (q > 1 ? 300 : 0), y: KP }]} caras={[{ f: 0, v: "feliz" }]} dir={[{ f: 0, v: q > 1 ? -1 : 1 }]} />)}
      <A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.estanque - 100, y: KP }, { f: 150, x: K.estanque + 50, y: KP }]} caras={[{ f: 0, v: "feliz" }]} />
    </>} />
);
// ---------- 29 · se casa con una princesa; tiene todo lo que un hombre puede querer ----------
export const Q29Princesa: React.FC = () => (
  <Kap cl={[mira(0, K.trono + 100, 600, 1.6), mira(110, K.trono + 100, 600, 1.8)]} sp={{ flores: 1 }}
    medio={<><A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.trono + 30, y: KP }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 40, cD: 30 } }]} />
      <A look={PRINCESA} seed={33} ruta={[{ f: 0, x: K.trono + 190, y: KP }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }]} poses={[{ f: 0, v: { hD: 40, cD: 30 } }]} /></>} />
);
// ---------- 30 · y se aburría. Hondo, raro. Y no sabía por qué ----------
export const Q30Aburrido: React.FC = () => (
  <Kap cl={[mira(0, K.trono, 640, 1.8), mira(150, K.trono, 650, 2.6)]}
    medio={<A look={SIDDHARTHA} seed={30} ruta={[{ f: 0, x: K.trono, y: KP }]} asiento={[{ f: 0, v: 56 }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { ...SENTADO, hD: 140, cD: 140, cabeza: 14 } }]} caras={[{ f: 0, v: "cansado" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.4 } }]} />} />
);
// ---------- 31 · en el lavadero, Leo está muy callado ----------
export const Q31Callado: React.FC = () => (
  <Lav cl={[mira(0, 1450, 600, 1.4), mira(88, 1450, 600, 1.5)]} toalla={-1} tenzo={tenzoPela()} leo={leoSent({ poses: [{ f: 0, v: AFERRA }], caras: [{ f: 0, v: "duda" }] })} hud={<Hud2 />} />
);
// ---------- 32 · «the palace… it's the feed» ----------
const k32 = kDe(150.67);
export const Q32Feed: React.FC = () => (
  <Lav cl={[mira(0, L.leo, 650, 2.4), mira(88, L.leo, 645, 2.6)]} tenzo={{ no: true }} toalla={-1}
    leo={leoSent({ poses: [{ f: 0, v: CEL_SENT }, { f: 40, v: { ...CEL_SENT, cabeza: 0 } }], caras: [{ f: 0, v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 40, v: MIRA_T }], habla: [[0, k32(151.4)], [k32(152.3), k32(153.59)]] })} hud={<Hud2 />} />
);
// ---------- 33 · Tenzo sonríe y se come un gajo ----------
export const Q33Gajo: React.FC = () => (
  <Lav cl={[mira(0, 1700, 650, 2.6), mira(113, 1700, 645, 2.8)]} leo={{ no: true }} toalla={-1}
    tenzo={tenzoPela({ poses: [{ f: 0, v: PELA }, { f: 40, v: { ...PELA, hD: 30, cD: 150, cabeza: 0 } }, { f: 70, v: PELA }], habla: [[46, 80]] })} hud={<Hud2 />} />
);
// ---------- 34-35 · «the algorithm… young faces, perfect bodies… when something sad shows up, I scroll» ----------
export const Q34Algoritmo: React.FC = () => <Fondo><TelGrande modo="feed" vel={20} /><Hud2 /></Fondo>;
export const Q35Scroll: React.FC = () => <Fondo><TelGrande modo="feed" vel={34} pulgar /><Hud2 /></Fondo>;
// ---------- 36 · «hmm. And are you happy, in your palace?» ----------
const k36 = kDe(170.33);
export const Q36Feliz: React.FC = () => (
  <Lav cl={[mira(0, 1700, 650, 2.4), mira(124, 1705, 640, 2.8)]} leo={{ no: true }} toalla={-1}
    tenzo={tenzoPela({ miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k36(171)], [k36(172.21), k36(174.47)]] })} hud={<Hud2 />} />
);
// ---------- 37 · Leo no contesta ----------
export const Q37NoContesta: React.FC = () => (
  <Lav cl={[mira(0, L.leo, 650, 2.6), mira(48, L.leo, 650, 2.7)]} tenzo={{ no: true }} toalla={-1} leo={leoSent({ poses: [{ f: 0, v: CEL_SENT }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], caras: [{ f: 0, v: "triste" }] })} hud={<Hud2 />} />
);
// ---------- 38 · el contador sigue: 9h 12m ayer · 6 h ya hoy ----------
export const Q38Contador: React.FC = () => {
  const f = useF();
  const k = kDe(176.09);
  return <Fondo>{f < k(181.85) ? <TelGrande modo="screentime" min={552} sub="YESTERDAY" desde={k(179.2)} /> : <TelGrande modo="screentime" min={300} minHasta={360} desde={k(181.85)} />}<Hud2 /></Fondo>;
};
// ---------- 39 · «one night» — y Leo, muy despacio, le pone el tel en la mano ----------
const k39 = kDe(183.87);
export const Q39Entrega: React.FC = () => (
  <Lav cl={[mira(0, 1450, 620, 1.6), mira(100, 1450, 640, 2.0), mira(183, 1440, 650, 2.3)]} toalla={-1}
    tenzo={{ poses: [{ f: 0, v: OFRECE }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: MIRA_L }], habla: [[0, k39(184.6)]], enManoD: (fr: number) => (fr >= k39(188.6) ? <Tel s={1.1} /> : null) }}
    leo={leoSent({ ruta: [{ f: 0, x: L.leo, y: LP }, { f: k39(186.5), x: L.leo + 110, y: LP }], poses: [{ f: 0, v: AFERRA }, { f: k39(186.5), v: { ...SENTADO, hD: 80, cD: 10, tronco: 14, cabeza: 6 } }, { f: k39(189.3), v: { ...SENTADO, hD: 30, cD: 20, tronco: 4 } }],
      enManoD: (fr: number) => (fr < k39(188.6) ? <Tel /> : null), caras: [{ f: 0, v: "miedo" }, { f: k39(187), v: "triste" }] })} hud={<Hud2 />} />
);
// ---------- 40 · la pantalla se apaga ----------
export const Q40Negro: React.FC = () => <Fondo><TelGrande modo="apagado" /><Hud2 /></Fondo>;
// ---------- 41 · detrás del hombro de Leo, la sombra sisea ----------
export const Q41Sisea: React.FC = () => (
  <Lav cl={[mira(0, L.leo - 80, 560, 2.3), mira(92, L.leo - 70, 560, 2.5)]} tenzo={{ no: true }} toalla={-1}
    mara={{ opacidad: () => 0.97, ruta: [{ f: 0, x: L.leo - 130, y: LP - 10 }], poses: [{ f: 0, v: { hD: 140, cD: 60, hI: 120, cI: 60, tronco: 24, cabeza: 24 } }], caras: [{ f: 0, v: "enojo" }], habla: [[8, 70]] }}
    leo={leoSent({ poses: [{ f: 0, v: { ...SENTADO, hD: 30, cD: 20 } }], enManoD: () => null, caras: [{ f: 0, v: "neutral" }] })}
    hud={<><Hud2 /><ManoMara texto="sssss" x={300} y={260} desde={8} tam={90} /></>} />
);
// ---------- 42 · DAY 2 · SCREEN TIME… ZERO ----------
export const Q42Cero: React.FC = () => <Fondo><TelGrande modo="screentime" min={0} desde={30} /><Hud2 m={0} est="congelado" /><Rotulo texto="DAY 2 · SCREEN TIME… ZERO" desde={4} /></Fondo>;

export { TENZO, LEO, MARA, FAROL, rimOro };
