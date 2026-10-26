// tz01 · planos 1-28 (0 → 112,4 s): el cuadro 0, el cuarto de Leo, Mara, la caminata, el Spin City, Tenzo.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Pildora, RelojDia } from "../anikit/pantalla";
import { ACENTO, ESC, FAROL, LEO_CAPUCHA, MARA, PAL, PAL_DIA, TENZO } from "../tenzo/elenco";
import { HudTenzo, ManoMara, Rotulo } from "../tenzo/hud";
import { BolsoRopa, FarolMano, Tel } from "../tenzo/utileria";
import { BarraDia, TelGrande } from "../tenzo/graficos";
import { Broadway, BWY_PISO, BWY_PUNTOS } from "../tenzo/sets/broadway";
import { CTO_PUNTOS, COLCHON_ALTO } from "../tenzo/sets/cuarto";
import { CAMA, CEL_SENT, CP, Cto, DOBLA_A, doblando, kDe, Lav, LAV_PUNTOS, LP, rimFrio, rimOro } from "./base";

const BP = BWY_PISO;
const L = LAV_PUNTOS;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const fade = (a: number, b: number, o = 0.96) => (f: number) => interpolate(f, [a, b], [0, o], cl);
// Mara de frente, encima de Leo, con los brazos abiertos sobre él
export const maraCuarto = (escala: number, x: number, extra: Record<string, unknown> = {}) => (
  <Actor look={MARA} escala={escala} seed={5} ruta={[{ f: 0, x, y: CP }]} dir={[{ f: 0, v: 1 }]} giros={[{ f: 0, v: 0 }]}
    poses={[{ f: 0, v: { tronco: 0, cabeza: 8, hD: 105, cD: 55, hI: -105, cI: -55 } }]} caras={[{ f: 0, v: "risa" }]} opacidad={() => 0.96} {...extra} />
);
const LX = CTO_PUNTOS.colchon - 120; // x de Leo en la cama
export const Hud = ({ m = 582, d = 0, est = "normal", dia = 1 }: { m?: number; d?: number; est?: "sube" | "normal" | "congelado"; dia?: number }) => <HudTenzo min={m} dia={dia} estado={est} desde={d} />;
export const Fondo: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, #23272f, #0c0d10)" }}>{children}</AbsoluteFill>;

// ---------- 1 · CUADRO 0 = la miniatura sin texto ----------
export const P01Mini: React.FC = () => (
  <Cto cl={[mira(0, 705, 590, 1.42), mira(60, 712, 590, 1.47)]} sp={{ luzPuerta: 1 }}
    detras={maraCuarto(ESC * 1.65, CTO_PUNTOS.colchon - 130)}
    medio={<Actor look={TENZO} escala={ESC} seed={2} luz={rimOro} ruta={[{ f: 0, x: CTO_PUNTOS.puerta, y: CP }]} dir={[{ f: 0, v: 1 }]}
      poses={[{ f: 0, v: FAROL }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.6, y: 0.2 } }]} enManoD={<FarolMano />} />} />
);
// ---------- 2 · la mano vacía ----------
export const P02Mano: React.FC = () => (
  <Cto cl={[mira(0, LX + 40, 760, 2.4), mira(66, LX + 50, 760, 2.7)]}
    leo={{ poses: [{ f: 0, v: { ...CAMA, hI: 6, cI: 4 } }], enManoD: <Tel s={1.3} />, caras: [{ f: 0, v: "cansado" }] }} />
);
// ---------- 3 · Uptown, Chicago ----------
export const P03Uptown: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 2500, 120, 0.72), mira(120, 2500, 470, 0.82)]} setProps={{ tren: 20, nieve: true }}
    hud={<Rotulo texto="LEO MARSH · 24 · UPTOWN, CHICAGO" desde={12} />} />
);
// ---------- 4-6 · el celular: 3 AM, 9h 42m, la barra del día ----------
export const P04Tres: React.FC = () => <Fondo><TelGrande modo="hora" texto="3:00" sub="AM" /></Fondo>;
export const P05Pantalla: React.FC = () => <Fondo><TelGrande modo="screentime" min={0} minHasta={582} /><Hud d={50} /></Fondo>;
export const P06Dia: React.FC = () => <><BarraDia horas={9.7} rotulo="ONE DAY · 24 HOURS" /><Hud /></>;
// ---------- 7 · no se acuerda de ninguna ----------
export const P07Vacio: React.FC = () => (
  <Cto cl={[mira(0, LX + 30, 640, 3.0), mira(60, LX + 30, 640, 3.25)]} leo={{ caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.9 } }] }} hud={<Hud />} />
);
// ---------- 8 · el pulgar ----------
export const P08Pulgar: React.FC = () => <Fondo><TelGrande modo="feed" vel={18} pulgar /><Hud /></Fondo>;
// ---------- 9 · la pantalla brilla ----------
export const P09Brillo: React.FC = () => {
  const f = useF();
  const a = Math.round(64 + 40 * Math.sin(f / 5)).toString(16).padStart(2, "0");
  return (
    <>
      <Cto cl={[mira(0, LX + 40, 650, 3.2), mira(46, LX + 40, 650, 3.8)]} leo={{ caras: [{ f: 0, v: "cansado" }] }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 70%, ${ACENTO}${a}, transparent 55%)` }} />
      <Hud />
    </>
  );
};
// ---------- 10 · algo sonríe detrás del hombro ----------
export const P10Sombra: React.FC = () => (
  <Cto cl={[mira(0, LX + 20, 620, 2.8), mira(80, LX - 20, 560, 1.6, { curva: "inout" })]}
    detras={maraCuarto(ESC * 1.65, CTO_PUNTOS.colchon - 130, { opacidad: fade(10, 60), caras: [{ f: 0, v: "neutral" }, { f: 66, v: "picaro" }] })} hud={<Hud />} />
);
// ---------- 11 · «just one more» ----------
export const P11UnaMas: React.FC = () => (
  <Cto cl={[mira(0, LX - 40, 420, 2.0), mira(40, LX - 30, 430, 2.15)]}
    detras={maraCuarto(ESC * 1.65, CTO_PUNTOS.colchon - 130, { caras: [{ f: 0, v: "picaro" }], habla: [[2, 34]] })}
    hud={<><Hud /><ManoMara texto="just one more" x={240} y={300} desde={2} tam={84} /></>} />
);
// ---------- 12-13 · el recuerdo: Leo de 14 con su primer tel, Mara chiquita en el hombro ----------
const Catorce: React.FC<{ c: ReturnType<typeof mira>[]; habla?: [number, number][] }> = ({ c, habla }) => (
  <>
    <Cto cl={c} pal={PAL_DIA} sp={{ nieve: false }}
      leo={{ escala: ESC * 0.82, ruta: [{ f: 0, x: LX, y: CP }], caras: [{ f: 0, v: "feliz" }], enManoD: <Tel s={1.0} /> }}
      medio={<Actor look={MARA} escala={ESC * 0.42} seed={5} ruta={[{ f: 0, x: LX - 40, y: CP - 170 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 90, tronco: 20, cabeza: 16 } }]} caras={[{ f: 0, v: "picaro" }]} habla={habla} />} />
    <AbsoluteFill style={{ background: "#b9bec6", opacity: 0.18 }} />
  </>
);
export const P12Catorce: React.FC = () => <><Catorce c={[mira(0, LX, 600, 1.7), mira(90, LX, 600, 1.85)]} /><Rotulo texto="AGE 14" desde={4} /></>;
export const P13NoGrita: React.FC = () => <Catorce c={[mira(0, LX - 20, 640, 2.6), mira(90, LX - 20, 630, 2.9)]} habla={[[10, 80]]} />;
// ---------- 14 · «you deserve it» · «nobody will know» ----------
export const P14Merece: React.FC = () => (
  <Cto cl={[mira(0, LX - 60, 520, 1.6), mira(98, LX - 60, 520, 1.75)]}
    detras={maraCuarto(ESC * 1.85, CTO_PUNTOS.colchon - 130, { caras: [{ f: 0, v: "picaro" }], habla: [[0, 30], [36, 96]], poses: [{ f: 0, v: { tronco: 20, cabeza: 20, hD: 80, cD: 70, hI: -80, cI: -70 } }] })}
    hud={<><Hud /><ManoMara texto="just one more" x={260} y={250} desde={0} /><ManoMara texto="you deserve it" x={1220} y={200} desde={36} /><ManoMara texto="nobody will know" x={1160} y={880} desde={66} /></>} />
);
// ---------- 15 · 3:20, el cuarto queda muy callado ----------
export const P15Silencio: React.FC = () => (
  <Cto cl={[mira(0, 1100, 560, 1.1), mira(123, 1050, 560, 1.18)]}
    leo={{ asiento: [{ f: 0, v: COLCHON_ALTO }, { f: 92, v: undefined }], ruta: [{ f: 0, x: LX, y: CP }, { f: 96, x: LX + 30, y: CP }],
      poses: [{ f: 0, v: CAMA }, { f: 40, v: { ...CAMA, cabeza: -4, tronco: -6 } }, { f: 96, v: "parado" }], caras: [{ f: 0, v: "cansado" }, { f: 40, v: "duda" }], miradas: [{ f: 40, v: { x: -0.6, y: -0.1 } }] }}
    hud={<><Hud /><RelojDia min={200} x={1640} y={56} desde={6} /></>} />
);
// ---------- 16 · cuatro cuadras por Wilson, con el bolso ----------
export const P16Wilson: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, 1150, 600, 1.15), mira(117, 1650, 600, 1.15)]} setProps={{ nieve: true }}
    medio={<Actor look={LEO_CAPUCHA} escala={ESC} seed={1} luz={rimFrio} ruta={[{ f: 0, x: 1000, y: BP }, { f: 117, x: 1800, y: BP, curva: "lineal" }]}
      caras={[{ f: 0, v: "cansado" }]} enManoI={<BolsoRopa />} poses={[{ f: 0, v: { hI: 10, cI: 10, cabeza: 10 } }]} />}
    hud={<><Hud /><Pildora texto="WILSON AVE · 4 BLOCKS" x={960} y={980} desde={10} color="#c9ced6" /></>} />
);
// ---------- 17 · el único lugar de Uptown que nunca cierra ----------
export const P17NuncaCierra: React.FC = () => (
  <Escena Set={Broadway} pal={PAL} claves={[mira(0, BWY_PUNTOS.lavadero + 200, 540, 1.0), mira(97, BWY_PUNTOS.lavadero + 220, 560, 1.15)]} setProps={{ nieve: true }}
    medio={<Actor look={LEO_CAPUCHA} escala={ESC} seed={1} luz={rimFrio} ruta={[{ f: 0, x: BWY_PUNTOS.puertaLav + 520, y: BP }, { f: 90, x: BWY_PUNTOS.puertaLav + 40, y: BP }]}
      caras={[{ f: 0, v: "cansado" }]} enManoD={<BolsoRopa />} />}
    hud={<Hud />} />
);
// ---------- 18 · SPIN CITY ----------
export const P18Cartel: React.FC = () => <Lav cl={[mira(0, 690, -50, 2.4), mira(36, 690, -50, 2.6)]} leo={{ no: true }} tenzo={{ no: true }} hud={<Hud />} />;
// ---------- 19 · 24 horas, 40 máquinas, una expendedora rota y el tren ----------
export const P19Cuarenta: React.FC = () => (
  <Lav cl={[mira(0, 300, 520, 0.95), mira(110, 1450, 520, 0.95), mira(150, 2380, 560, 1.4), mira(185, 3300, 430, 1.05)]} leo={{ no: true }} tenzo={{ no: true }} sp={{ tren: 190, farol: false }} toalla={-1}
    hud={<><Hud />
      <Pildora texto="24 HOURS" x={960} y={980} desde={2} hasta={40} color="#c9ced6" />
      <Pildora texto="40 WASHING MACHINES" x={960} y={980} desde={44} hasta={128} color="#c9ced6" />
      <Pildora texto="1 BROKEN VENDING MACHINE" x={960} y={980} desde={132} hasta={180} color="#c9ced6" />
      <Pildora texto="THE TRAIN · EVERY 11 MINUTES" x={960} y={980} desde={184} color="#c9ced6" />
    </>} />
);
// ---------- 20 · esta noche no está solo ----------
export const P20NoSolo: React.FC = () => (
  <Lav cl={[mira(0, L.puerta - 200, 600, 1.3), mira(55, L.puerta - 320, 600, 1.4)]} tenzo={{ no: true }} sp={{ farol: false }} toalla={-1}
    leo={{ look: LEO_CAPUCHA, asiento: undefined, ruta: [{ f: 0, x: L.puerta + 80, y: LP }, { f: 36, x: L.puerta - 300, y: LP, curva: "out" }], dir: [{ f: 0, v: -1 }],
      poses: [{ f: 0, v: "parado" }], caras: [{ f: 0, v: "cansado" }, { f: 38, v: "sorpresa" }], miradas: [{ f: 38, v: { x: -0.9, y: 0 } }], enManoD: <BolsoRopa /> }}
    hud={<Hud />} />
);
// ---------- 21 · el tubo que titila → el viejo de túnica gris, cejas blancas ----------
export const P21Rincon: React.FC = () => (
  <Lav cl={[mira(0, 1300, -110, 1.8), mira(70, 1700, 520, 1.5, { curva: "inout" }), mira(150, 1730, 470, 3.0), mira(247, 1730, 480, 3.2)]} leo={{ no: true }} sp={{ farol: false }}
    tenzo={{ poses: doblando(0, 250, 40), caras: [{ f: 0, v: "neutral" }] }} toalla={(f) => Math.min(1, f / 247) * 0.4} hud={<Hud />} />
);
// ---------- 22 · las cuentas de madera → el farol con el loto ----------
export const P22Farol: React.FC = () => (
  <Lav cl={[mira(0, 1720, 610, 3.2), mira(80, 1700, 620, 3.0), mira(150, L.farol, 660, 2.6, { curva: "inout" }), mira(258, L.farol, 660, 2.9)]} leo={{ no: true }} sp={{ luzFarol: 1.4 }}
    tenzo={{ poses: doblando(0, 260, 40) }} toalla={0.45} hud={<Hud />} />
);
// ---------- 23 · dobla una toalla, puntas con puntas ----------
export const P23Toalla: React.FC = () => (
  <Lav cl={[mira(0, 1640, 700, 2.4), mira(238, 1660, 700, 2.7)]} leo={{ no: true }}
    tenzo={{ poses: doblando(0, 240, 60), caras: [{ f: 0, v: "feliz" }] }} toalla={(f) => interpolate(f, [0, 238], [0.1, 1], cl)} hud={<Hud />} />
);
// ---------- 24 · se sienta, saca el tel; «you look hungry» ----------
const k24 = kDe(83.08);
export const P24Sienta: React.FC = () => (
  <Lav cl={[mira(0, 1500, 600, 1.15), mira(140, 1450, 610, 1.35), mira(265, 1460, 600, 1.45)]} toalla={0.2}
    leo={{ ruta: [{ f: 0, x: 2100, y: LP }, { f: 52, x: L.leo, y: LP }], dir: [{ f: 0, v: -1 }, { f: 56, v: 1 }], asiento: [{ f: 0, v: undefined }, { f: 64, v: 66 }],
      poses: [{ f: 0, v: "parado" }, { f: 64, v: { tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92 } }, { f: 100, v: CEL_SENT }], enManoD: (f: number) => (f > 96 ? <Tel /> : null), enManoI: (f: number) => (f < 60 ? <BolsoRopa /> : null), caras: [{ f: 0, v: "cansado" }] }}
    mara={{ opacidad: fade(130, 180, 0.9) }}
    tenzo={{ poses: doblando(0, 266, 40), habla: [[k24(89.9), k24(91.8)]], caras: [{ f: 0, v: "neutral" }] }} hud={<Hud />} />
);
// ---------- 25 · «I just ate» ----------
export const P25Comi: React.FC = () => (
  <Lav cl={[mira(0, L.leo, 560, 2.5), mira(70, L.leo, 560, 2.7)]} tenzo={{ no: true }} mara={{ opacidad: () => 0.9 }}
    leo={{ caras: [{ f: 0, v: "risa" }], habla: [[6, 60]], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }] }} hud={<Hud />} />
);
// ---------- 26 · «not that kind of hunger» ----------
const k26 = kDe(94.28);
export const P26Hambre: React.FC = () => (
  <Lav cl={[mira(0, 1680, 610, 2.4), mira(137, 1700, 600, 2.7)]} leo={{ no: true }} toalla={0.3}
    tenzo={{ poses: [{ f: 0, v: DOBLA_A }, { f: 20, v: { ...DOBLA_A, hD: 70, cD: 20 } }, { f: 50, v: DOBLA_A }, { f: 80, v: { ...DOBLA_A, hD: 70, cD: 20 } }], habla: [[k26(97.2), k26(98.8)]], caras: [{ f: 0, v: "neutral" }, { f: 80, v: "feliz" }] }} hud={<Hud />} />
);
// ---------- 27 · se le va la risa; quiere irse ----------
export const P27Deja: React.FC = () => (
  <Lav cl={[mira(0, L.leo, 560, 2.4), mira(122, L.leo + 80, 600, 1.7)]} tenzo={{ poses: doblando(0, 130, 40) }} mara={{ opacidad: () => 0.9 }}
    leo={{ caras: [{ f: 0, v: "risa" }, { f: 14, v: "neutral" }, { f: 50, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 50, v: { x: -0.8, y: 0 } }],
      poses: [{ f: 0, v: { ...CEL_SENT, cabeza: 0 } }, { f: 50, v: { ...CEL_SENT, tronco: -14, cabeza: -6 } }, { f: 90, v: { ...CEL_SENT, cabeza: 6 } }] }} hud={<Hud />} />
);
// ---------- 28 · la secadora: 38 minutos; Tenzo ya empezó a contar ----------
const k28 = kDe(102.96);
export const P28Secadora: React.FC = () => {
  const f = useF();
  return (
    <Lav cl={[mira(0, 1060, 610, 2.8), mira(80, 1060, 610, 3.0), mira(110, 1450, 600, 1.35, { curva: "inout" }), mira(282, 1440, 600, 1.45)]} toalla={0.35}
      tenzo={{ poses: doblando(0, 282, 44), habla: [[k28(106), k28(112.3)]], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.5, y: 0.3 } }] }} mara={{ opacidad: () => 0.9 }}
      hud={<><Hud />{f < 105 && <div style={{ position: "absolute", left: 960 - 170, top: 380, width: 340, height: 150, borderRadius: 24, background: "#0f1115", border: "6px solid #4a505a", color: ACENTO, fontFamily: "monospace", fontSize: 110, textAlign: "center", lineHeight: "150px", textShadow: `0 0 20px ${ACENTO}` }}>38:00</div>}</>} />
  );
};
