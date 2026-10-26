// tz05 · «The Elephant That Never Left Its Rope» (Tenzo Films, sesión tz-c). Voz 440,0 s + 8 s de tarjeta final.
// Plan: D:/rtmp/tz05_PLAN_MxM.md. Cada plano = la frase de ESE segundo; los tramos van en segundos ABSOLUTOS de la voz.
// Chicago = mundo de tz-a (elenco/hud/utilería/sets); la parábola del circo está en parabola05.tsx.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Montaje } from "../../anikit/montaje";
import { F_HUD, RelojDia } from "../../anikit/pantalla";
import { PALETAS } from "../../anikit/paletas";
import { ACENTO, ESC, LEO, MARA, TENZO } from "../elenco";
import { HudTenzo, MarcaTenzo, hm } from "../hud";
import { ManoLeo, ManoMara } from "./chicago";
import { FarolMano, Tel, TelMesa } from "../utileria";
import { Circo, CIRCO_PISO, CIRCO_PUNTOS } from "../sets/circo";
import { Elefanta, Estaca, Soga, tobillo } from "../sets/elefanta";
import { Actor } from "../../anikit/actor";
import {
  Burbuja, CabeceraChat, ConCara, CajaEscribir, CTO, EnCalle, EnColectivo, EnCuarto, EnLavadero, Hora, LAV, Negro, PantallaTel, Pulgar, Recuerdo,
  RIM_FRIO, RostroLuz, SENTADO, SENTADO_TEL, TarjetaFinal, Torres, cosiendo, TENZO_MESA,
} from "./chicago";
import { PARABOLA05 } from "./parabola05";
import { partir, planosDe, TramoS } from "./tramos";
import { Inserto } from "../../anikit/inserto";
import { PAL } from "../elenco";
import { Abrigo, Aguja, CAM, EdificioVidrio } from "./chicago";

const FPS = 30;
const fr = (t: number) => Math.round(t * FPS);
// pares de segundos absolutos → tramos de habla en cuadros locales del plano que empieza en t0
const hab = (t0: number, p: [number, number][]): [number, number][] => p.map(([a, b]) => [fr(a - t0), fr(b - t0)]);
const loc = (t0: number, t: number) => fr(t - t0);
const P = LAV.P;
const PC = CTO.P;

// ---------- CUADRO 0 = la miniatura sin texto (noche de circo: Mara gigante sostiene la soga atada al tobillo de Leo) ----------
const Cuadro0: React.FC = () => {
  const f = useF();
  const PI = CIRCO_PISO, EX = CIRCO_PUNTOS.elefanta;
  const tob = tobillo(EX, PI, 1, 1);
  const LX = 1880, MX = 1620;
  const ank = { x: LX + 118, y: PI - 14 };
  const mano = { x: MX + 200, y: PI - 820 };
  return (
    <Escena Set={Circo} pal={PALETAS.parabola} setProps={{ variante: "noche" }} seed={70} mano={1.4}
      claves={[mira(0, 2120, 520, 0.9), mira(16, 2120, 520, 0.9), mira(128, 2060, 560, 0.97, { curva: "inout" })]}
      medio={<>
        <Elefanta x={EX} y={PI} f={f} balanceo={3} oreja={0.5} luz="#9fb4ff" />
        <Soga a={tob} b={{ x: CIRCO_PUNTOS.estaca, y: PI + 10 }} tension={0.4} />
        <Estaca x={CIRCO_PUNTOS.estaca} y={PI + 10} />
        <Actor look={MARA} escala={ESC * 2.3} seed={5} ruta={[{ f: 0, x: MX, y: PI - 30 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "feliz" }]} opacidad={() => 0.95}
          poses={[{ f: 0, v: { hD: 75, cD: 40, hI: 40, cI: 70, cabeza: 14 } }]} />
        <Soga a={ank} b={mano} tension={0.08 + 0.03 * Math.sin(f / 14)} color="#d9b47a" grosor={5} />
        <Actor look={TENZO} escala={ESC * 0.9} seed={2} luz={{ lado: 1, color: "#ffc46a", fuerza: 0.9 }} ruta={[{ f: 0, x: 1500, y: PI }]} dir={[{ f: 0, v: 1 }]}
          poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 25, cI: 80 } }]} caras={[{ f: 0, v: "feliz" }]} enManoD={<FarolMano />} />
        <Actor look={LEO} escala={ESC * 1.35} seed={1} luz={{ lado: 1, color: ACENTO, fuerza: 0.7 }} ruta={[{ f: 0, x: LX, y: PI }]} dir={[{ f: 0, v: 1 }]}
          asiento={[{ f: 0, v: 10 }]} poses={[{ f: 0, v: { tronco: 6, pI: 70, rI: 150, pD: 60, rD: 140, hD: 30, cD: 125, cabeza: 22, hI: 40, cI: 120 } }]}
          caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.6 } }]} enManoD={<Tel />} />
      </>} />
  );
};

// ---------- HUD global (SCREEN TIME + DAY) — fuera de las parábolas ----------
const MIN: { f: number; v: number; d?: number }[] = [
  { f: 0, v: 0 }, { f: fr(18.6), v: 180, d: fr(7) }, { f: fr(28.4), v: 280, d: 50 },
  { f: fr(355.6), v: 91, d: 50 }, { f: fr(361.2), v: 72, d: 40 }, { f: fr(370.0), v: 58, d: 40 },
];
const diaEn = (f: number) => (f < fr(354.8) ? 10 : f < fr(360.6) ? 11 : f < fr(369.3) ? 12 : 13);
const estadoEn = (f: number) => (f >= fr(18.2) && f < fr(31) ? "sube" : f >= fr(371.5) ? "congelado" : "normal") as "sube" | "congelado" | "normal";
const HudGlobal: React.FC = () => {
  const f = useCurrentFrame();
  if (f < fr(4.5) || (f >= fr(106) && f < fr(200.2)) || f >= fr(431.7)) return null;
  const tramo1 = f < fr(106);
  return <HudTenzo min={MIN} dia={diaEn(f)} estado={estadoEn} desde={tramo1 ? fr(4.5) : fr(200.2)} hasta={tramo1 ? fr(106) : fr(431.7)} sinMarca />;
};

// ---------- los planos de Chicago ----------
const T = (): TramoS[] => [
  // ACTO 1 · gancho
  { t0: 0, t1: 4.3, el: <Cuadro0 /> },
  ...partir(4.3, 7.1, (cam) => (
    <EnCuarto cam={cam}
      leo={{ poses: [{ f: 0, v: SENTADO }, { f: 18, v: { ...SENTADO, hI: 160, cI: 20, hD: 165, cD: 15, tronco: -8, cabeza: -10 } }, { f: 62, v: SENTADO }], caras: [{ f: 0, v: "feliz" }] }} />
  ), [[4.3, [mira(0, CTO.colchon + 40, PC - 270, 2.0), mira(48, CTO.colchon + 40, PC - 275, 2.1)]], [5.9, CAM.camaPP(1.2)]], { tipo: "fundido", d: 10 }),
  { t0: 7.1, t1: 11.8, el: (
    <EnCuarto cam={[mira(0, CTO.colchon + 40, PC - 270, 1.9), mira(141, CTO.bolso - 140, PC - 285, 1.8, { curva: "inout" })]}
      leo={{ ruta: [{ f: 0, x: CTO.colchon, y: PC }, { f: 30, x: CTO.colchon, y: PC }, { f: 100, x: CTO.bolso - 160, y: PC }], asiento: [{ f: 0, v: CTO.COLCHON_ALTO }, { f: 26, v: undefined }], caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: SENTADO }, { f: 26, v: "parado" }] }}
      mara={(f) => ({ ruta: [{ f: 0, x: CTO.bolso + 220, y: PC - 60 }], escala: ESC * 1.35, opacidad: () => interpolate(f, [60, 130], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), dir: [{ f: 0, v: -1 }] })} />
  ) },
  { t0: 11.8, t1: 13.2, el: <Inserto objeto="celular" look={LEO} pal={PAL} acento={ACENTO} accion="sostener" caras={[{ f: 0, v: "neutral" }, { f: 16, v: "sorpresa" }]} /> },
  { t0: 13.2, t1: 15.1, el: <PantallaTel zoom0={0.95} zoom1={1.05} dur={57}><RostroLuz /></PantallaTel> },
  { t0: 15.1, t1: 18.1, el: (
    <AbsoluteFill>
      <PantallaTel zoom0={1.05} zoom1={1.12} dur={90} mano={<Pulgar toca={40} y={520} />}><RostroLuz /></PantallaTel>
      <ManoMara texto="just one." x={1330} y={300} desde={10} />
    </AbsoluteFill>
  ) },
  { t0: 18.1, t1: 25.8, trans: { tipo: "fundido", d: 8 }, el: <Timelapse /> },
  ...partir(25.8, 30.5, (cam) => (
    <EnCuarto dia cam={cam}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }, { f: 70, v: { ...SENTADO_TEL, cabeza: 30, tronco: 10 } }], caras: [{ f: 0, v: "triste" }, { f: 90, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel /> }} />
  ), [[25.8, [mira(0, CTO.colchon + 30, PC - 270, 2.1), mira(141, CTO.colchon + 30, PC - 275, 2.5, { curva: "inout" })]], [28.2, CAM.camaPP(2.3)]]),
  { t0: 30.5, t1: 35.2, el: (
    <EnCuarto dia cam={[mira(0, CTO.colchon - 40, PC - 300, 1.35, { rot: -2 }), mira(141, CTO.colchon - 100, PC - 420, 1.2, { rot: -3, curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={(f) => ({ escala: ESC * interpolate(f, [0, 120], [1.0, 2.1], { extrapolateRight: "clamp" }), ruta: [{ f: 0, x: CTO.colchon - 220, y: PC - 20 }], poses: [{ f: 0, v: { hD: 80, cD: 50, hI: 70, cI: 60, cabeza: 16 } }] })} />
  ) },
  ...partir(35.2, 40.2, (cam) => (
    <EnCuarto dia cam={cam}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={{ escala: ESC * 2.1, ruta: [{ f: 0, x: CTO.colchon - 220, y: PC - 20 }], poses: [{ f: 0, v: { hD: 80, cD: 50, hI: 70, cI: 60, cabeza: 16 } }], habla: hab(35.2, [[35.2, 40.2]]) }}
      hud={<>
        <ManoMara texto="you see?" x={1180} y={230} desde={0} />
        <ManoMara texto="ten days." x={1240} y={340} desde={loc(35.2, 35.9)} />
        <ManoMara texto="nothing changed." x={1180} y={450} desde={loc(35.2, 37.0)} />
        <ManoMara texto="you are the same as always." x={1040} y={560} desde={loc(35.2, 38.4)} />
      </>} />
  ), [[35.2, [mira(0, 1000, 420, 1.15), mira(150, 990, 430, 1.22)]], [37.8, CAM.camaPP(2.4)]]),
  { t0: 40.2, t1: 41.6, el: <EnCuarto dia cam={[mira(0, (CTO.colchon + CTO.bolso) / 2, PC - 230, 1.55), mira(42, (CTO.colchon + CTO.bolso) / 2 + 20, PC - 230, 1.62)]} leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "cansado" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel /> }} /> },
  { t0: 41.6, t1: 47.2, el: (
    <PantallaTel zoom0={1} zoom1={1.1} dur={170} luz={0.6}>
      <CabeceraChat nombre="Maya" />
      <Burbuja texto="Same time tomorrow?" y={180} desde={loc(41.6, 43.8)} />
      <CajaEscribir />
    </PantallaTel>
  ) },
  { t0: 47.2, t1: 51.0, el: (
    <EnCuarto dia cam={[mira(0, CTO.colchon + 30, PC - 270, 2.2), mira(114, CTO.colchon + 30, PC - 270, 2.4)]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }, { f: 40, v: { ...SENTADO, hD: 20, cD: 60, cabeza: -6 } }], caras: [{ f: 0, v: "triste" }], giros: [{ f: 0, v: 0 }, { f: 40, v: -0.8 }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }, { f: 40, v: { x: -0.9, y: 0.2 } }], enManoD: <Tel /> }} />
  ) },

  // ACTO 2 · Spin City, 3 a. m.
  { t0: 51.0, t1: 53.9, trans: { tipo: "fundido", d: 14 }, el: (
    <EnCalle tren={10} cam={[mira(0, 1720, 680, 1.9), mira(87, 1080, 680, 2.0)]}
      leo={{ ruta: [{ f: 0, x: 1800, y: 900 }, { f: 87, x: 1000, y: 900, curva: "lineal" }], caras: [{ f: 0, v: "triste" }] }}
      hud={<RelojDia min={180} x={1640} y={150} />} />
  ) },
  // 53,9-69,5 · entra, se sienta lejos; Tenzo cose un botón (aguja visible); el farol; el tren barre las máquinas
  ...partir(53.9, 69.5, (cam) => (
    <EnLavadero tren={loc(53.9, 65.6)} cam={cam}
      leo={{ ruta: [{ f: 0, x: 500, y: P }, { f: 100, x: LAV.leo, y: P }], asiento: [{ f: 0, v: undefined }, { f: 108, v: 66 }], poses: [{ f: 0, v: "parado" }, { f: 108, v: SENTADO }, { f: 160, v: { ...SENTADO, cabeza: 24 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 120, v: { x: 0.2, y: 0.9 } }] }}
      tenzo={{ poses: cosiendo(0, 470, 12), caras: [{ f: 0, v: "neutral" }, { f: loc(53.9, 62), v: "feliz" }], enManoD: <Aguja />, miradas: [{ f: 0, v: { x: -0.2, y: 0.6 } }] }} />
  ), [
    [53.9, [mira(0, 900, 600, 1.05), mira(100, 1120, 620, 1.25, { curva: "inout" })]],
    [57.5, CAM.leo(4, 2.0)],
    [61.4, CAM.mesa(2.4)],
    [63.8, CAM.tenzo(2, 2.0)],
    [65.9, [mira(0, 1450, 560, 1.0), mira(108, 1450, 560, 1.06)]],
  ]),
  // 69,5-84,2 · Leo habla: campo, contracampo (Tenzo escucha cosiendo), los dos, y cerca de nuevo
  ...partir(69.5, 84.2, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ poses: cosiendo(0, 441, 14), enManoD: <Aguja />, caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.6 } }, { f: loc(69.5, 74.9), v: { x: -0.9, y: 0 } }] }}
      leo={{ caras: [{ f: 0, v: "triste" }, { f: loc(69.5, 74.9), v: "duda" }, { f: loc(69.5, 79), v: "feliz" }, { f: loc(69.5, 80.6), v: "triste" }],
        habla: hab(69.5, [[72.2, 73.5], [73.6, 74.7], [74.9, 82.0], [82.2, 83.7]]),
        poses: [{ f: 0, v: SENTADO }, { f: loc(69.5, 73.6), v: { ...SENTADO, hD: 70, cD: 80 } }, { f: loc(69.5, 76), v: { ...SENTADO, hD: 85, cD: 60 } }, { f: loc(69.5, 80.6), v: { ...SENTADO, hD: 50, cD: 120, cabeza: 10 } }, { f: loc(69.5, 82.2), v: { ...SENTADO, hD: 55, cD: 105, cabeza: 16 } }],
        miradas: [{ f: 0, v: { x: 0.2, y: 0.8 } }, { f: loc(69.5, 72.2), v: { x: 0.8, y: 0 } }, { f: loc(69.5, 80.6), v: { x: 0.4, y: 0.6 } }] }}
      hud={<ManoLeo texto="it's not working." x={960} y={900} centro desde={loc(69.5, 72.3)} hasta={loc(69.5, 74.8)} />} />
  ), [
    [69.5, CAM.leo(5.4, 1.9)],
    [74.9, CAM.tenzo(2.6)],
    [77.5, CAM.hombroLeo(3.1)],
    [80.6, CAM.leo(3.6, 2.5)],
  ]),
  { t0: 84.2, t1: 90.2, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 30, P - 270, 2.2), mira(180, LAV.leo + 30, P - 275, 2.4)]}
      leo={{ caras: [{ f: 0, v: "risa" }, { f: 40, v: "triste" }], habla: hab(84.2, [[84.3, 85.2], [86.7, 88.0], [88.0, 90.2]]), poses: [{ f: 0, v: { ...SENTADO, cabeza: -6 } }, { f: 50, v: { ...SENTADO, ...{ hI: 40, cI: 140, hD: 45, cD: 140, cabeza: 8 } } }] }}
      hud={<ManoLeo texto="maybe I'm just built like this." x={960} y={900} centro desde={loc(84.2, 88.0)} />} />
  ) },
  { t0: 90.2, t1: 91.9, el: <Inserto objeto="aguja" look={TENZO} pal={PAL} acento={ACENTO} accion="sostener" caras={[{ f: 0, v: "neutral" }, { f: 30, v: "feliz" }]} esquina="der" hasta={51} /> },
  { t0: 91.9, t1: 93.5, el: (
    <EnLavadero cam={[mira(0, LAV.tenzo - 60, P - 260, 2.0), mira(48, LAV.tenzo - 70, P - 260, 2.1)]}
      tenzo={{ poses: [{ f: 0, v: { hD: 80, cD: 120, hI: 32, cI: 92 } }, { f: 40, v: { hD: 82, cD: 130, hI: 32, cI: 92 } }, { f: 60, v: TENZO_MESA }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 70, v: { x: -0.9, y: 0 } }] }} />
  ) },
  ...partir(93.5, 102.6, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(93.5, [[93.5, 99.6], [99.6, 102.0]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], poses: [{ f: 0, v: TENZO_MESA }, { f: 60, v: { hD: 50, cD: 60, hI: 32, cI: 92 } }, { f: 150, v: { hD: 70, cD: 40, hI: 32, cI: 92, cabeza: -6 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: 120, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: -0.1 } }], poses: [{ f: 0, v: SENTADO }, { f: 100, v: { ...SENTADO, tronco: 10, cabeza: 6 } }] }} />
  ), [
    [93.5, CAM.hombroLeo(3.5)],
    [97.0, CAM.leo(2.6)],
    [99.6, [mira(0, 1450, 600, 1.3), mira(90, LAV.farol, P - 210, 1.9, { curva: "inout" })]],
  ]),
  { t0: 102.6, t1: 106.0, el: <LlamaCrece /> },
  ...PARABOLA05,

  // ACTO 4 · la vuelta
  { t0: 200.2, t1: 204.1, trans: { tipo: "luz", d: 20, color: "#ffcf84" }, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 30, P - 290, 2.4), mira(117, LAV.leo + 60, P - 250, 1.5, { curva: "inout" })]}
      leo={{ caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.9 } }, { f: 50, v: { x: 0.9, y: -0.1 } }], poses: [{ f: 0, v: { ...SENTADO, cabeza: 22 } }, { f: 50, v: SENTADO }] }} />
  ) },
  ...partir(204.1, 211.8, (cam) => (
    <EnLavadero cam={cam}
      leo={{ caras: [{ f: 0, v: "triste" }], habla: hab(204.1, [[204.1, 206.3], [206.3, 211.3]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: loc(204.1, 207.3), v: { x: 0.3, y: 0.8 } }],
        poses: [{ f: 0, v: SENTADO }, { f: loc(204.1, 206.3), v: { ...SENTADO, hD: 60, cD: 110, cabeza: 14 } }] }}
      hud={<ManoLeo texto="14." x={1420} y={300} centro desde={loc(204.1, 204.4)} hasta={loc(204.1, 206.2)} tam={80} />} />
  ), [[204.1, [mira(0, LAV.leo + 30, P - 285, 2.2), mira(231, LAV.leo + 30, P - 285, 2.4)]], [208.0, CAM.hombroLeo(3.8)]]),
  // 211,8-225,3 · «at fourteen it really was, you were a baby elephant»: Leo de 14 en la cama con el primer teléfono, y la cría tirando
  { t0: 211.8, t1: 216.0, el: (
    <EnLavadero cam={CAM.tenzo(4.2)}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: [[0, 126]], miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], poses: [{ f: 0, v: TENZO_MESA }, { f: 20, v: { hD: 30, cD: 30, hI: 32, cI: 92, cabeza: 8 } }, { f: 40, v: TENZO_MESA }] }} />
  ) },
  ...partir(216.0, 220.6, (cam) => (
    <EnCuarto cam={cam} leo={{ look: { ...LEO, alto: 0.72 }, poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "feliz" }, { f: 70, v: "sorpresa" }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 1 } }}
      hud={<div style={{ position: "absolute", left: 80, bottom: 90, fontFamily: F_HUD, fontWeight: 600, fontSize: 56, color: "#e8e4dc", background: "rgba(12,10,10,0.7)", padding: "6px 24px", borderRadius: 14 }}>AGE 14 · FIRST PHONE</div>} />
  ), [[216.0, CAM.cama(2.3, 2.1)], [218.3, CAM.camaPP(2.3)]], { tipo: "fundido", d: 10 }),
  { t0: 220.6, t1: 225.3, trans: { tipo: "fundido", d: 10 }, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 60, P - 200, 1.9), mira(141, LAV.leo + 40, P - 160, 2.3, { curva: "inout" })]}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: 60, v: "triste" }], poses: [{ f: 0, v: SENTADO_TEL }, { f: 50, v: { ...SENTADO_TEL, cabeza: 30, tronco: 14 } }], enManoD: <Tel />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: 50, v: { x: 0.1, y: 1 } }] }}
      frente={<SogaTel />} />
  ) },
  { t0: 225.3, t1: 229.4, el: <Inserto objeto="abrigo" look={TENZO} pal={PAL} acento={ACENTO} accion="mostrar" caras={[{ f: 0, v: "neutral" }, { f: 45, v: "feliz" }]} esquina="der" habla={hab(225.3, [[226.8, 229.4]])} /> },
  // 229,4-242,3 · Tenzo: «so this morning you did not pull… you remembered the old pain» — campo, Leo escucha, los dos, cerca
  ...partir(229.4, 242.3, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "neutral" }, { f: loc(229.4, 236), v: "triste" }, { f: loc(229.4, 240.7), v: "feliz" }], habla: hab(229.4, [[229.4, 232.6], [232.6, 240.7], [240.7, 241.9]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }],
        poses: [{ f: 0, v: TENZO_MESA }, { f: loc(229.4, 233), v: { hD: 40, cD: 40, hI: -20, cI: 30, tronco: 18 } }, { f: loc(229.4, 236), v: TENZO_MESA }, { f: loc(229.4, 238), v: { hD: 70, cD: 30, hI: 32, cI: 92, cabeza: 8 } }, { f: loc(229.4, 240.7), v: { hD: 60, cD: 120, hI: 32, cI: 92 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: loc(229.4, 235), v: "triste" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: loc(229.4, 235), v: { x: 0.2, y: 0.9 } }], poses: [{ f: 0, v: SENTADO }, { f: loc(229.4, 235), v: { ...SENTADO, cabeza: 22, tronco: 10 } }] }} />
  ), [
    [229.4, CAM.tenzo(3.2)],
    [232.6, CAM.dos(2.8, 1.5)],
    [235.4, CAM.leo(3.0)],
    [238.4, CAM.tenzo(3.9, 2.5)],
  ]),
  { t0: 242.3, t1: 247.1, el: (
    <EnLavadero cam={[mira(0, LAV.leo - 80, P - 380, 1.15, { rot: -2 }), mira(144, LAV.leo - 90, P - 420, 1.25, { rot: -3 })]}
      leo={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      mara={(f) => ({ escala: ESC * 1.6, ruta: [{ f: 0, x: LAV.leo - 200, y: P - 40 }], caras: [{ f: 0, v: "enojo" }], poses: [{ f: 0, v: { hD: 60 + 20 * Math.sin(f / 9), cD: 60, hI: 40 + 20 * Math.cos(f / 11), cI: 70, cabeza: 14 + 6 * Math.sin(f / 13) } }] })} />
  ) },
  { t0: 247.1, t1: 253.4, el: (
    <EnLavadero cam={[mira(0, LAV.leo - 100, P - 420, 1.2), mira(189, LAV.leo - 100, P - 430, 1.27)]}
      leo={{ caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.2, y: 0.9 } }] }}
      mara={{ escala: ESC * 1.6, ruta: [{ f: 0, x: LAV.leo - 200, y: P - 40 }], caras: [{ f: 0, v: "feliz" }], habla: hab(247.1, [[247.1, 251.4], [252.2, 253.4]]), poses: [{ f: 0, v: { hD: 80, cD: 50, hI: 40, cI: 70, cabeza: 14 } }] }}
      hud={<>
        <ManoMara texto="he's lying." x={1220} y={250} desde={0} />
        <ManoMara texto="you are weak." x={1180} y={360} desde={loc(247.1, 248.2)} />
        <ManoMara texto="you failed today." x={1140} y={470} desde={loc(247.1, 250.5)} />
        <ManoMara texto="look at the counter." x={1100} y={580} desde={loc(247.1, 252.2)} />
      </>} />
  ) },
  { t0: 253.4, t1: 257.4, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 40, P - 270, 2.1), mira(120, LAV.leo + 40, P - 270, 2.25)]}
      leo={{ caras: [{ f: 0, v: "triste" }], habla: hab(253.4, [[253.4, 255.8], [255.8, 256.5]]), poses: [{ f: 0, v: SENTADO_TEL }], enManoD: <Tel />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }} />
  ) },
  // 257,4-273,4 · la cuenta: Tenzo lo dice, el comparador ocupa la pantalla, Leo cae en la cuenta
  ...partir(257.4, 273.4, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(257.4, [[260.5, 264.1], [264.0, 265.0], [265.1, 269.5], [270.9, 272.6]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }],
        poses: [{ f: 0, v: TENZO_MESA }, { f: loc(257.4, 269.6), v: { hD: 40, cD: 90, hI: 40, cI: 90, tronco: -4, cabeza: 6 } }, { f: loc(257.4, 270.6), v: TENZO_MESA }] }}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: loc(257.4, 268.5), v: "sorpresa" }, { f: loc(257.4, 270.5), v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], poses: [{ f: 0, v: SENTADO }, { f: loc(257.4, 268.5), v: { ...SENTADO, tronco: -6, cabeza: -8 } }] }}
      hud={<LaCuenta />} />
  ), [
    [257.4, CAM.hombroLeo(3.1)],
    [260.5, CAM.dos(8, 1.5)],
    [268.5, CAM.leo(2.4, 2.4)],
    [270.9, CAM.mesa(2.5)],
  ]),
  { t0: 273.4, t1: 278.7, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 40, P - 280, 2.4), mira(159, LAV.leo + 40, P - 285, 2.55)]}
      leo={{ caras: [{ f: 0, v: "sorpresa" }, { f: loc(273.4, 275.1), v: "neutral" }], habla: hab(273.4, [[273.4, 274.9]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }} />
  ) },
  // 278,7-289,1 · «doesn't become free by being angry… pulls one more time» — Tenzo, Leo escucha, la última puntada
  ...partir(278.7, 289.1, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(278.7, [[278.7, 283.0], [283.1, 288.9]]), poses: cosiendo(0, 312, 14), enManoD: <Aguja />, miradas: [{ f: 0, v: { x: -0.9, y: 0 } }, { f: loc(278.7, 288.6), v: { x: -0.2, y: 0.6 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: loc(278.7, 284), v: "neutral" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }], poses: [{ f: 0, v: SENTADO }, { f: loc(278.7, 284), v: { ...SENTADO, tronco: 10 } }] }} />
  ), [
    [278.7, CAM.dos(4.3)],
    [283.0, CAM.leo(3.0, 2.0)],
    [286.0, CAM.hombroLeo(1.6)],
    [287.6, CAM.mesa(1.5)],
  ]),
  { t0: 289.1, t1: 291.2, el: <Inserto objeto="aguja" look={TENZO} pal={PAL} acento={ACENTO} accion="tocar" caras={[{ f: 0, v: "neutral" }, { f: 40, v: "feliz" }]} esquina="der" toques={[18, 36]} /> },
  ...partir(291.2, 301.2, (cam) => (
    <EnLavadero cam={cam}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], habla: hab(291.2, [[291.2, 293.3], [292.9, 297.8], [297.8, 301.2]]), miradas: [{ f: 0, v: { x: -0.9, y: 0 } }], poses: [{ f: 0, v: TENZO_MESA }, { f: 70, v: { hD: 30, cD: 30, hI: 32, cI: 92 } }, { f: 140, v: TENZO_MESA }, { f: 200, v: { hD: 80, cD: 60, hI: 32, cI: 92, cabeza: -4 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }, { f: 150, v: "neutral" }, { f: 220, v: "sorpresa" }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 200, v: { x: -0.6, y: -0.4 } }] }}
      hud={<Rayitas desde={20} />} />
  ), [
    [291.2, CAM.dos(3.3, 1.5)],
    [294.5, CAM.tenzo(3.3, 2.7)],
    [297.8, CAM.leo(3.4, 2.3)],
  ]),
  // 301,2-314,1 · el tren pasa, las luces titilan; Leo se da vuelta y mira la sombra: enorme, pero finita como humo
  ...partir(301.2, 314.1, (cam) => (
    <EnLavadero tren={15} cam={cam}
      leo={{ caras: [{ f: 0, v: "neutral" }, { f: 140, v: "sorpresa" }, { f: 260, v: "neutral" }], dir: [{ f: 0, v: 1 }, { f: 130, v: -1 }], miradas: [{ f: 0, v: { x: 0.9, y: 0 } }, { f: 130, v: { x: 0.6, y: -0.6 } }] }}
      mara={(f) => ({ escala: ESC * 1.6, ruta: [{ f: 0, x: LAV.leo - 200, y: P - 40 }], caras: [{ f: 0, v: "feliz" }, { f: 200, v: "miedo" }], opacidad: () => interpolate(f, [200, 330], [0.92, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), ajuste: (p) => ({ ...p, cabeza: (p.cabeza ?? 0) + 4 * Math.sin(f / 7) }) })} />
  ), [
    [301.2, [mira(0, 1350, 560, 1.1), mira(120, 1300, 560, 1.2, { curva: "inout" })]],
    [305.2, CAM.leo(3.0, 2.2)],
    [308.2, CAM.mara(5.9)],
  ]),
  ...partir(314.1, 318.3, (cam) => (
    <EnLavadero cam={cam}
      leo={{ caras: [{ f: 0, v: "triste" }], habla: hab(314.1, [[314.1, 315.8], [315.8, 318.3]]), miradas: [{ f: 0, v: { x: 0.9, y: 0 } }] }}
      mara={{ escala: ESC * 1.5, opacidad: () => 0.4, ruta: [{ f: 0, x: LAV.leo - 200, y: P - 40 }], caras: [{ f: 0, v: "neutral" }] }} />
  ), [[314.1, CAM.leo(2.0, 2.5)], [316.1, CAM.hombroLeo(2.2)]]),
  { t0: 318.3, t1: 325.0, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 50, P - 230, 1.8), mira(201, LAV.leo + 50, P - 230, 1.95)]}
      leo={{ caras: [{ f: 0, v: "duda" }], poses: [{ f: 0, v: SENTADO }, { f: 90, v: SENTADO_TEL }], enManoD: (f) => (f > 90 ? <Tel /> : null), miradas: [{ f: 90, v: { x: 0.3, y: 0.8 } }] }}
      mara={{ escala: ESC * 1.5, opacidad: () => 0.4, ruta: [{ f: 0, x: LAV.leo - 200, y: P - 40 }], caras: [{ f: 0, v: "neutral" }] }}
      hud={<ManoLeo texto="what would the elephant do?" x={960} y={900} centro desde={10} hasta={150} />} />
  ) },
  { t0: 325.0, t1: 334.0, el: (
    <PantallaTel zoom0={1} zoom1={1.12} dur={270} luz={0.6}>
      <CabeceraChat nombre="Maya" />
      <Burbuja texto="Same time tomorrow?" y={180} desde={-100} />
      <CajaEscribir texto="Sorry. Bad day. Same time tomorrow?" desde={10} vel={6} />
      <Burbuja texto="Sorry. Bad day. Same time tomorrow?" yo y={330} desde={loc(325.0, 332.8)} />
    </PantallaTel>
  ) },
  { t0: 334.0, t1: 336.6, el: <Inserto objeto="celular" look={LEO} pal={PAL} acento={ACENTO} accion="girar" caras={[{ f: 0, v: "duda" }, { f: 40, v: "miedo" }]} /> },
  { t0: 336.6, t1: 339.8, el: (
    <EnLavadero tel={{ bocaAbajo: true }} cam={[mira(0, LAV.leo + 40, P - 250, 2.0), mira(96, LAV.leo + 40, P - 255, 2.15)]}
      leo={{ caras: [{ f: 0, v: "miedo" }], poses: [{ f: 0, v: SENTADO }, { f: 8, v: { ...SENTADO, hD: 40, cD: 130, hI: 25, cI: 50 } }] }} />
  ) },
  { t0: 339.8, t1: 343.2, el: (
    <ConCara caras={[{ f: 0, v: "miedo" }, { f: 62, v: "sorpresa" }]}><EnLavadero tel={{ bocaAbajo: true }} cam={[mira(0, LAV.mesa + 240, P - 170, 2.3), mira(102, LAV.mesa + 240, P - 170, 2.55, { curva: "inout" })]}
      medio={null}
      hud={<RelojCorre />} /></ConCara>
  ) },
  { t0: 343.2, t1: 345.4, el: <Inserto objeto="abrigo" look={TENZO} pal={PAL} acento={ACENTO} accion="girar" caras={[{ f: 0, v: "feliz" }]} esquina="der" /> },
  { t0: 345.4, t1: 347.6, el: (
    <EnLavadero tel={{ bocaAbajo: true }} abrigo={null} cam={CAM.leo(2.2, 2.5)}
      tenzo={{ caras: [{ f: 0, v: "feliz" }], poses: cosiendo(0, 66, 18), miradas: [{ f: 0, v: { x: -0.3, y: 0.8 } }] }}
      leo={{ caras: [{ f: 0, v: "duda" }], miradas: [{ f: 0, v: { x: 0.7, y: 0.5 } }, { f: 6, v: { x: 0.9, y: 0 } }] }}
      medio={<DobladoAbrigo />} />
  ) },
  { t0: 347.6, t1: 352.6, el: (
    <PantallaTel zoom0={1.02} zoom1={1.1} dur={150} luz={0.8}>
      <CabeceraChat nombre="Maya" />
      <Burbuja texto="Sorry. Bad day. Same time tomorrow?" yo y={150} desde={-100} />
      <Burbuja texto="Everyone has bad days." y={330} desde={loc(347.6, 349.3)} />
      <Burbuja texto="7:40. I'll save you a seat." y={440} desde={loc(347.6, 351.1)} />
    </PantallaTel>
  ) },
  { t0: 352.6, t1: 354.8, el: (
    <EnLavadero cam={[mira(0, LAV.leo + 40, P - 270, 2.2), mira(66, LAV.leo + 40, P - 270, 2.3)]}
      leo={{ caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: SENTADO_TEL }], enManoD: <Tel />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }}
      hud={<ManoLeo texto="green scarf." x={1380} y={420} desde={2} />} />
  ) },
  { t0: 354.8, t1: 360.6, trans: { tipo: "fundido", d: 12 }, el: (
    <EnCalle dia cam={[mira(0, 2300, 640, 1.35), mira(174, 3550, 640, 1.35)]}
      leo={{ look: LEO, ruta: [{ f: 0, x: 2200, y: 900 }, { f: 174, x: 3650, y: 900, curva: "lineal" }], correr: 0.4, caras: [{ f: 0, v: "feliz" }] }} />
  ) },
  { t0: 360.6, t1: 369.3, el: (
    <EnColectivo cam={[mira(0, 1440, 560, 1.5), mira(261, 1440, 560, 1.7, { curva: "inout" })]}
      maya={{ habla: [[30, 240]], caras: [{ f: 0, v: "feliz" }] }} leo={{ caras: [{ f: 0, v: "feliz" }] }} />
  ) },
  { t0: 369.3, t1: 379.7, el: (
    <EnCuarto lampara cam={[mira(0, CTO.silla - 40, PC - 300, 1.7), mira(150, CTO.silla - 20, PC - 300, 1.9, { curva: "inout" }), mira(160, CTO.silla + 40, PC - 230, 2.6), mira(306, CTO.silla + 40, PC - 230, 2.8)]}
      leo={{ ruta: [{ f: 0, x: CTO.silla - 90, y: PC }], asiento: [{ f: 0, v: 66 }], poses: cosiendo(0, 306, 10).map((k) => ({ f: k.f, v: { ...SENTADO, hD: k.v.hD + 10, cD: k.v.cD - 20, cabeza: 18 } })), caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.6, y: 0.7 } }] }} />
  ) },
  { t0: 379.7, t1: 385.7, el: <Dibujo /> },
  { t0: 385.7, t1: 388.1, el: (
    <EnCuarto lampara cam={[mira(0, CTO.colchon + 250, PC - 400, 1.7), mira(72, CTO.colchon + 250, PC - 410, 1.8)]}
      leo={{ ruta: [{ f: 0, x: CTO.colchon + 200, y: PC }], asiento: [{ f: 0, v: undefined }], poses: [{ f: 0, v: { hD: 150, cD: 20, cabeza: -14 } }, { f: 40, v: { hD: 160, cD: 10, cabeza: -14 } }], caras: [{ f: 0, v: "feliz" }], dir: [{ f: 0, v: 1 }] }}
      medio={<DibujoPegado x={PIN.x} y={PIN.y} />} />
  ) },

  // ACTO 5 · gancho a tz07
  { t0: 388.1, t1: 396.6, el: (
    <EnCuarto momento="lluvia" cam={[mira(0, CTO.colchon + 60, PC - 260, 1.6), mira(255, CTO.colchon + 40, PC - 270, 2.2, { curva: "inout" })]}
      leo={{ asiento: [{ f: 0, v: CTO.COLCHON_ALTO }], poses: [{ f: 0, v: SENTADO }, { f: 60, v: SENTADO_TEL }], caras: [{ f: 0, v: "neutral" }, { f: 120, v: "sorpresa" }], enManoD: (f) => (f > 60 ? <Tel /> : null), miradas: [{ f: 0, v: { x: -0.6, y: 0.6 } }, { f: 60, v: { x: 0.3, y: 0.8 } }] }}
      medio={<DibujoPegado x={PIN.x} y={PIN.y} />}
      hud={<RelojDia min={23 * 60} x={1640} y={150} />} />
  ) },
  { t0: 396.6, t1: 401.6, el: <PostTyler t0={396.6} dur={150} /> },
  { t0: 401.6, t1: 405.6, el: (
    <EnCuarto momento="lluvia" cam={[mira(0, CTO.colchon + 25, PC - 275, 2.5), mira(120, CTO.colchon + 25, PC - 280, 2.75)]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }, { f: 60, v: { ...SENTADO_TEL, cabeza: 22 } }], caras: [{ f: 0, v: "neutral" }, { f: 50, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.7 } }], enManoD: <Tel />, luz: { lado: 1, color: ACENTO, fuerza: 1 } }} />
  ) },
  { t0: 405.6, t1: 411.5, el: <PostTyler t0={405.6} dur={177} /> },
  { t0: 411.5, t1: 416.0, el: (
    <EnCuarto momento="lluvia" cam={[mira(0, CTO.colchon - 120, PC - 250, 2.3), mira(60, CTO.colchon - 120, PC - 250, 2.4), mira(66, CTO.colchon + 40, PC - 160, 1.5), mira(135, CTO.colchon + 60, PC - 200, 1.6)]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }, { f: 70, v: { ...SENTADO, hD: 20, cD: 40, cabeza: 26 } }], caras: [{ f: 0, v: "triste" }], miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }, { f: 66, v: { x: 0, y: 1 } }], enManoD: (f) => (f < 70 ? <Tel /> : null) }}
      medio={<><DibujoPegado x={PIN.x} y={PIN.y} /><TelDespues desde={70} /></>} />
  ) },
  ...partir(416.0, 419.0, (cam) => (
    <EnCuarto momento="lluvia" cam={cam}
      leo={{ poses: [{ f: 0, v: { ...SENTADO, hD: 20, cD: 40, cabeza: 10 } }], caras: [{ f: 0, v: "triste" }], giros: [{ f: 0, v: 0 }, { f: 30, v: 0.7 }], miradas: [{ f: 0, v: { x: 0.9, y: 0.2 } }] }} medio={<DibujoPegado x={PIN.x} y={PIN.y} />} />
  ), [[416.0, [mira(0, CTO.colchon + 120, PC - 300, 1.9), mira(45, CTO.colchon + 120, PC - 300, 2.0)]], [417.5, [mira(0, (CTO.colchon + CTO.bolso) / 2, PC - 250, 1.15), mira(90, (CTO.colchon + CTO.bolso) / 2 + 60, PC - 250, 1.22)]]]),
  { t0: 419.0, t1: 426.5, el: <SogaNueva /> },
  { t0: 426.5, t1: 431.7, el: (
    <EnCuarto momento="lluvia" cam={[mira(0, CTO.colchon - 40, PC - 260, 1.6), mira(156, CTO.colchon - 60, PC - 320, 1.15, { curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={{ escala: ESC * 1.9, ruta: [{ f: 0, x: CTO.colchon - 240, y: PC - 20 }], poses: [{ f: 0, v: { hD: 70, cD: 30, hI: 50, cI: 60, cabeza: 12 } }] }}
      medio={<><Soga a={{ x: CTO.colchon + 105, y: PC - 12 }} b={{ x: CTO.colchon - 100, y: PC - 650 }} tension={0.06} color={ACENTO} grosor={8} /><DibujoPegado x={PIN.x} y={PIN.y} /></>}
      hud={<ManoLeo texto="what's your rope?" x={960} y={920} centro desde={15} />} />
  ) },
  { t0: 431.7, t1: 440.0, trans: { tipo: "fundido", d: 16 }, el: <FarolSeApaga /> },
];

// ---------- planos especiales ----------
// «One minute. Two minutes.»: 3:12 → 3:13 → 3:14 AM
const RelojCorre: React.FC = () => { const f = useF(); return <RelojDia min={192 + (f > 27 ? 1 : 0) + (f > 54 ? 1 : 0)} x={1640} y={150} />; };
// 18,1-25,8 · timelapse en el cuarto: de 6:00 a 9:00, Leo inmóvil con el teléfono, la luz pasa de azul a gris de día
const Timelapse: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [0, 231], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <EnCuarto dia={u > 0.5} tren={90} cam={[mira(0, CTO.colchon + 40, PC - 250, 1.45), mira(231, CTO.colchon + 40, PC - 260, 1.75, { curva: "inout" })]}
        leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "neutral" }], enManoD: <Tel />, miradas: [{ f: 0, v: { x: 0.3, y: 0.8 } }] }} />
      <RelojDia min={360 + Math.floor(u * 180)} x={1640} y={150} />
    </AbsoluteFill>
  );
};

// 102,6-106,0 · el farol titila y la llama crece hasta llenar el cuadro (entra la parábola con «luz»)
export const LlamaCrece: React.FC = () => {
  const f = useF();
  return (
    <EnLavadero luzFarol={1 + 0.25 * Math.sin(f / 3)} cam={[mira(0, LAV.farol, P - 200, 1.9), mira(102, LAV.farol, P - 195, 4.5, { curva: "in" })]}
      tenzo={{ caras: [{ f: 0, v: "feliz" }] }} />
  );
};

// 257,4-273,4 · la cuenta: el día 1 (9h 42m, fantasma gris) contra el día 10 (4h 40m): es la MITAD
const LaCuenta: React.FC = () => {
  const f = useF();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const a = interpolate(f, [loc(257.4, 260.5), loc(257.4, 261.2), loc(257.4, 268.0), loc(257.4, 268.5)], [0, 1, 1, 0], cl);
  const b = interpolate(f, [loc(257.4, 265.1), loc(257.4, 266.3)], [0, 1], cl);
  if (a <= 0) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(6,6,8,${0.55 * a})` }}>
      <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${0.94 + 0.06 * a})`, width: 1320, padding: "46px 60px", borderRadius: 26, background: "rgba(14,14,18,0.92)", border: "2px solid rgba(244,239,228,0.18)", opacity: a, fontFamily: F_HUD }}>
        {[["DAY 1", 582, "#8d8a84"], ["DAY 10 · worst day", 280, "#f4efe6"]].map(([d, m, c], i) => (
          <div key={i} style={{ marginBottom: 34, opacity: i === 1 ? b : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 58, fontWeight: 600, color: c as string, marginBottom: 14 }}><span>{d}</span><span>{hm(m as number)}</span></div>
            <div style={{ height: 64, width: 1200 * ((m as number) / 582) * (i === 1 ? b : 1), background: c as string, borderRadius: 10, opacity: i === 0 ? 0.6 : 0.95 }} />
          </div>
        ))}
        <div style={{ fontSize: 92, fontWeight: 600, color: ACENTO, opacity: b, textAlign: "center", letterSpacing: 6 }}>HALF</div>
      </div>
    </AbsoluteFill>
  );
};

// 289,1-291,2 · inserto cálido: la estaca de la parábola se mueve un centímetro en el barro
const EstacaSeMueve: React.FC = () => {
  const f = useF();
  const PI = CIRCO_PISO;
  const tob = tobillo(CIRCO_PUNTOS.elefanta, PI, 1, 1);
  const inc = interpolate(f, [20, 30], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Circo} pal={PALETAS.parabola} seed={77} mano={1}
      claves={[mira(0, CIRCO_PUNTOS.elefanta - 80, PI - 330, 0.95), mira(63, CIRCO_PUNTOS.elefanta - 100, PI - 300, 1.05)]}
      medio={<><Elefanta x={CIRCO_PUNTOS.elefanta + (f > 18 ? Math.min(12, (f - 18) * 1.2) : 0)} y={PI} f={f} balanceo={2} /><Soga a={{ x: tob.x + (f > 18 ? Math.min(12, (f - 18) * 1.2) : 0), y: tob.y }} b={{ x: CIRCO_PUNTOS.estaca, y: PI + 10 }} tension={f > 18 ? 0.95 : 0.3} grosor={10} /><Estaca x={CIRCO_PUNTOS.estaca} y={PI + 10} inclina={inc} />
        {f > 22 && [0, 1].map((k) => <circle key={k} cx={CIRCO_PUNTOS.estaca - 10 + k * 24} cy={PI + 4 - (f - 22) * 0.6} r={6 + (f - 22) * 0.4} fill="#c9a87a" opacity={Math.max(0, 0.5 - (f - 22) * 0.015)} />)}</>} />
  );
};

// el teléfono queda prendido sobre el colchón desde el cuadro `desde`
const TelDespues: React.FC<{ desde: number }> = ({ desde }) => (useF() >= desde ? <TelMesa x={CTO.colchon + 160} y={PC - CTO.COLCHON_ALTO + 4} /> : null);

// 220,6 · la soga ámbar finita que va del teléfono de Leo a su tobillo (la soga de los 14), se dibuja de arriba abajo
const SogaTel: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [20, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = { x: LAV.leo + 52, y: P - 236 }, b = { x: LAV.leo + 70, y: P - 14 };
  return <><Soga a={a} b={{ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }} tension={0.15} color={ACENTO} grosor={4} />{u >= 1 && <ellipse cx={b.x} cy={b.y} rx={16} ry={7} fill="none" stroke={ACENTO} strokeWidth={4} />}</>;
};

// diez rayitas en el papel de Leo (los diez tirones) que se iluminan una por una
const Rayitas: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF();
  return (
    <div style={{ position: "absolute", left: 80, bottom: 150, display: "flex", gap: 18 }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const o = interpolate(f, [desde + i * 9, desde + i * 9 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ width: 9, height: 70, borderRadius: 5, background: "#f4efe6", opacity: 0.15 + 0.85 * o, boxShadow: o > 0.5 ? "0 0 14px rgba(255,255,255,0.5)" : undefined }} />;
      })}
    </div>
  );
};

// Tenzo dobla el abrigo esquina con esquina
const DobladoAbrigo: React.FC = () => {
  const f = useF();
  return <Abrigo x={LAV.mesa + 90} y={P - 150} doblez={interpolate(f, [10, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
};

// el dibujo de Leo: un elefante grande que se va de la carpa arrastrando la estaca (línea blanca a mano que se dibuja)
export const DibujoSVG: React.FC<{ u: number; s?: number }> = ({ u, s = 1 }) => {
  // cada trazo aparece en orden (lápiz grueso oscuro) y después se rellena de gris claro: que se lea ELEFANTE de lejos
  const t = (i: number, n = 6) => Math.max(0, Math.min(1, u * n - i));
  const tr = (i: number) => ({ fill: "none", stroke: "#2a2a30", strokeWidth: 7 / Math.max(0.5, s), strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - t(i) });
  const relleno = Math.max(0, Math.min(1, u * 3 - 1));
  return (
    <g>
      <rect x={-260} y={-190} width={520} height={380} fill="#f1ece0" />
      {/* carpa chica atrás a la izquierda (se dibuja al final: primero tiene que leerse ELEFANTE) */}
      <path {...tr(4)} d="M-245,120 L-185,10 L-125,120 Z M-185,10 L-185,-20 L-160,-12 L-185,-4" />
      <path {...tr(3)} d="M-255,124 Q0,116 255,124" />
      {/* relleno del elefante */}
      <g opacity={relleno * 0.9}>
        <ellipse cx={30} cy={30} rx={130} ry={78} fill="#b9b6b0" />
        <circle cx={160} cy={-20} r={62} fill="#b9b6b0" />
        <path d="M200,10 Q232,60 214,110 Q208,124 196,118 Q206,70 178,28 Z" fill="#b9b6b0" />
        {[-70, -20, 60, 110].map((x) => <rect key={x} x={x} y={70} width={36} height={52} rx={10} fill="#b9b6b0" />)}
        <path d="M120,-50 Q70,-60 70,0 Q72,40 122,30 Z" fill="#a6a39c" />
      </g>
      {/* contorno: cuerpo, cabeza, oreja, trompa, patas, cola, ojo, colmillo */}
      <ellipse {...tr(0)} cx={30} cy={30} rx={130} ry={78} />
      <circle {...tr(1)} cx={160} cy={-20} r={62} />
      <path {...tr(1)} d="M120,-50 Q70,-60 70,0 Q72,40 122,30" />
      <path {...tr(2)} d="M200,10 Q232,60 214,110 Q208,124 196,118 Q206,70 178,28" />
      <path {...tr(2)} d="M188,22 q22,10 30,-4" stroke="#f4efe4" />
      <path {...tr(3)} d="M-70,92 v30 h36 v-30 M-20,100 v22 h36 v-22 M60,100 v22 h36 v-22 M110,92 v30 h36 v-30" />
      <path {...tr(3)} d="M-98,20 q-24,10 -30,40" />
      <circle cx={176} cy={-34} r={7} fill="#2a2a30" opacity={t(2)} />
      {/* la soga suelta del tobillo y la estaca arrancada que arrastra */}
      <path {...tr(5)} stroke={ACENTO} d="M-52,118 Q-100,140 -150,132" />
      <path {...tr(5)} d="M-150,132 l-6,-34 l16,-2 l6,34 Z M-170,140 l-20,2 M-176,148 l-24,1" />
    </g>
  );
};
const Dibujo: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [0, 120], [0.12, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#2a2c31" }}>
      <svg width={1920} height={1080}><g transform={`translate(960,540) scale(${1.9 + f * 0.001})`}><DibujoSVG u={u} /></g></svg>
    </AbsoluteFill>
  );
};
export const PIN = { x: CTO.colchon + 300, y: CTO.P - 520 };
export const DibujoPegado: React.FC<{ x: number; y: number }> = ({ x, y }) => <g transform={`translate(${x},${y}) scale(0.32)`}><DibujoSVG u={1} s={0.32} /></g>;

// 396,6-411,5 · el reel de Tyler: delante de un auto negro nuevo, llaves en la mano, departamento de vidrio
export const TYLER = { estilo: "frijol" as const, piel: "#efcfa8", camisa: "#3a5a8a", pantalon: "#2a2a30", zapatos: "#f2f0ea", accesorios: [{ t: "pelo" as const, forma: "corto" as const, color: "#6a4a2a" }] };
const PostTyler: React.FC<{ t0?: number; dur?: number }> = ({ t0 = 396.6, dur = 447 }) => {
  const f = useF();
  return (
    <PantallaTel zoom0={0.98} zoom1={1.1} dur={dur} luz={0.8}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#a9c4e0, #e9eef2 60%, #9aa0a8)" }} />
      <svg width={440} height={900} style={{ position: "absolute", inset: 0 }}>
        <EdificioVidrio />
        <g transform="translate(220,640)">
          <path d="M-200,40 Q-196,-20 -140,-30 L-80,-80 Q0,-100 80,-80 L150,-30 Q200,-20 204,40 Z" fill="#0f1014" />
          <path d="M-70,-72 L-30,-86 L60,-86 L110,-36 L-110,-36 Z" fill="#3a4a5a" opacity={0.9} />
          <path d="M-180,-6 L190,-6" stroke="#e8eef4" strokeWidth={3} opacity={0.5 + 0.4 * Math.sin(f / 8)} />
          <circle cx={-120} cy={42} r={30} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={6} /><circle cx={130} cy={42} r={30} fill="#1a1a1e" stroke="#6a6a72" strokeWidth={6} />
        </g>
        <Actor look={TYLER} escala={1.15} seed={31} ruta={[{ f: 0, x: 150, y: 780 }]} dir={[{ f: 0, v: 1 }]} caras={[{ f: 0, v: "risa" }]}
          poses={[{ f: 0, v: { hD: 120, cD: 30 } }, { f: 30, v: { hD: 130, cD: 20 } }, { f: 60, v: { hD: 120, cD: 30 } }]} habla={[[10, 200]]}
          enManoD={<g><circle cx={0} cy={0} r={8} fill="#c9ccd2" /><rect x={6} y={-3} width={22} height={6} rx={3} fill="#c9ccd2" /></g>} />
      </svg>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 40, fontFamily: F_HUD, fontSize: 28, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.7)", opacity: interpolate(f, [loc(t0, 408.3), loc(t0, 408.3) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        @tyler · Twenty-five and already made it. Grateful.
      </div>
      <div style={{ position: "absolute", left: 22, top: 22, fontFamily: F_HUD, fontSize: 24, color: "#fff", opacity: 0.9 }}>▶ Reels</div>
    </PantallaTel>
  );
};

// 419,0-426,5 · Mara sonríe y de su mano sale una soga ámbar NUEVA, más gruesa, hacia el tobillo de Leo
const SogaNueva: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [30, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = { x: CTO.colchon - 100, y: PC - 650 };
  const b = { x: CTO.colchon + 105, y: PC - 12 };
  return (
    <EnCuarto momento="lluvia" cam={[mira(0, CTO.colchon - 60, PC - 300, 1.05, { rot: -2 }), mira(225, CTO.colchon - 60, PC - 330, 1.15, { rot: -3, curva: "inout" })]}
      leo={{ poses: [{ f: 0, v: SENTADO_TEL }], caras: [{ f: 0, v: "triste" }], enManoD: <Tel /> }}
      mara={{ escala: ESC * 1.9, ruta: [{ f: 0, x: CTO.colchon - 240, y: PC - 20 }], caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: { hD: 70, cD: 30, hI: 50, cI: 60, cabeza: 12 } }] }}
      medio={<><Soga a={a} b={{ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }} tension={0.06} color={ACENTO} grosor={8} /><DibujoPegado x={PIN.x} y={PIN.y} /></>} />
  );
};

// 431,7-440,0 · el lavadero vacío, el farol en la mesa que se apaga suave
export const FarolSeApaga: React.FC = () => {
  const f = useF();
  const luz = interpolate(f, [150, 230], [1, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <EnLavadero luzFarol={luz} leo={null} abrigo={1} cam={[mira(0, LAV.tenzo - 60, P - 290, 2.0), mira(249, LAV.farol + 20, P - 320, 2.5, { curva: "inout" })]}
        tenzo={{ caras: [{ f: 0, v: "feliz" }], poses: [{ f: 0, v: TENZO_MESA }, { f: 110, v: { hD: 125, cD: 30, hI: 32, cI: 92, cabeza: -8 } }, { f: 200, v: { hD: 60, cD: 80, hI: 32, cI: 92, cabeza: 6 } }], miradas: [{ f: 0, v: { x: -0.8, y: 0 } }, { f: 100, v: { x: -0.4, y: -0.6 } }] }} />
      <Negro desde={236} d={13} />
    </AbsoluteFill>
  );
};

export const TZ05_DUR = fr(440.0) + 240;
const PLANOS = planosDe(T());

export const Tz05: React.FC<{ audio?: string }> = ({ audio = "tz05.wav" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[...PLANOS, { dur: 240, el: <TarjetaFinal proximo="The Man Who Couldn't Stop Comparing" frase="Put the phone face down. See you tomorrow night, at the laundromat." />, trans: { tipo: "fundido", d: 12 } }]} />
    <HudGlobal />
    <MarcaFuera />
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
// la marca «Tenzo Films» todo el video salvo la tarjeta final (que la trae)
const MarcaFuera: React.FC = () => (useCurrentFrame() < fr(440) ? <MarcaTenzo /> : null);
