// The Last Census · Ep.3 «How Long Could 10 People Keep a City Running?» (lc03). 6:23,4 de voz + 1,5 s de tarjeta.
// Montaje de planos (lc03a 0:00-2:46 · lc03b 2:46-6:25) + HUD fijo en cuadros GLOBALES + la mezcla (voz + foley + cama).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM } from "../../anikit/montaje";
import { MarcaCorto, Pildora } from "../../anikit/pantalla";
import { setMotionBlur } from "../../anikit/camara";
// el motion blur de cámara (hasta 60 px) dejaba ilegibles inicios y medios de escena: apagado en toda la serie lcb
setMotionBlur(false);
import { Poblacion, Segundo } from "../hud";
import { T } from "./comun_ep";
import { IconosTachados } from "./hud_lcb";
import * as a from "./lc03a";
import { PLANOS_B, SISTEMAS } from "./lc03b";

export const LC03_DUR = T(384.9);

const PLANOS_A: [number, React.ReactNode, PlanoM["trans"]?][] = [
  [0, <a.P01 />], [3.9, <a.P02 />, { tipo: "barrido", d: 6 }], [17.1, <a.P03 />],
  [22.9, <a.P04 />, { tipo: "fundido", d: 20 }], [28.4, <a.P05 />], [31.9, <a.P06 />, { tipo: "luz", d: 14 }], [36.4, <a.P07 />],
  [46.4, <a.P08 />, { tipo: "cortina", d: 16, color: "#0b0810" }], [53.5, <a.P09 />, { tipo: "fundido", d: 16 }], [59.2, <a.P10 />],
  [67.7, <a.P11 />, { tipo: "cortina", d: 14, color: "#0b0810", lado: -1 }], [84.4, <a.PRadio s0={84.4} s1={85.8} />],
  [85.8, <a.P13 />, { tipo: "luz", d: 16 }], [100.8, <a.P14 />, { tipo: "cortina", d: 14, color: "#0b0810" }], [116.3, <a.P15 />, { tipo: "luz", d: 14 }],
  [126.0, <a.PRadio s0={126.0} s1={129.8} dial={0.6} tono="calido" pob={[6, 7]} senal />], [129.8, <a.P17 />], [137.6, <a.P18 />, { tipo: "fundido", d: 10 }], [141.4, <a.P19 />, { tipo: "fundido", d: 8 }],
  [144.3, <a.PCuaderno s0={144.3} s1={148.0} escritos={[{ t: "POPULATION", g: 144.5, x: 560, y: 330, tam: 60, vel: 0.36 }, { t: "10", g: 145.6, x: 1060, y: 520, tam: 190, sub: [146.6, 147.3], color: "#c0352c", vel: 0.09 }]} mano />],
  [148.0, <a.P21 />], [152.2, <a.P22 />],
];

const todos = (): PlanoM[] => {
  const lista = [...PLANOS_A, ...PLANOS_B];
  return lista.map(([s, el, trans], i) => ({ dur: (i + 1 < lista.length ? T(lista[i + 1][0]) : LC03_DUR) - T(s), el, trans }));
};

// HUD fijo (cuadros globales)
const POP = [{ f: 0, v: 10 }, { f: T(22.9), v: 2, d: 6 }, { f: T(36.6), v: 3 }, { f: T(100.0), v: 5 }, { f: T(115.6), v: 6 }, { f: T(125.7), v: 7 }, { f: T(142.3), v: 9, d: 3 }, { f: T(143.8), v: 10, d: 3 }];
const DIA = [{ f: 0, v: 130 }, { f: T(31.9), v: 131 }, { f: T(84.4), v: 152, d: 6 }, { f: T(100.8), v: 160 }, { f: T(116.3), v: 171 }, { f: T(126.0), v: 180 }, { f: T(318.7), v: 200, d: 12 }];
const HudLc03: React.FC = () => (
  <>
    <Poblacion claves={POP} grande tam={44} x={40} y={40} desde={-30} hasta={T(3.3)} />
    <Poblacion claves={POP} desde={T(3.0)} hasta={T(381.5)} />
    <IconosTachados iconos={["agua", "luz", "gas"]} x={56} y={168} tam={128} tachaF={[-50, -50, -50]} hasta={T(3.3)} />
    <Segundo claves={DIA} prefijo="DAY " icono="dia" desde={T(23.0)} hasta={T(345.0)} />
    <Segundo claves={SISTEMAS} prefijo="SYSTEMS CHECKED " sufijo="/6" icono="radio" y={196} desde={T(152.4)} hasta={T(290.2)} color="#9bb7ff" />
    <Pildora texto="Subscribe · the census continues" x={960} y={990} desde={T(376.9)} hasta={T(380.4)} color="#ffcf6e" tam={34} />
    <MarcaCorto />
  </>
);

export const Lc03: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={todos()} />
    <HudLc03 />
    {audio && <Audio src={staticFile("census/lc03_mezcla.wav")} />}
  </AbsoluteFill>
);
