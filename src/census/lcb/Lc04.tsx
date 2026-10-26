// The Last Census · Ep.4 «Could 10 People Grow Enough Food to Survive Year One?» (lc04). 6:23,4 de voz + 1,5 s de tarjeta.
// Montaje de planos (lc04a 0:00-3:25 · lc04b 3:25-6:25) + HUD fijo en cuadros GLOBALES + la mezcla (voz + foley + cama).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM } from "../../anikit/montaje";
import { MarcaCorto, Pildora } from "../../anikit/pantalla";
import { Poblacion, Segundo } from "../hud";
import { T } from "./comun_ep";
import { BarraKcal } from "./hud_lcb";
import { PLANOS_A } from "./lc04a";
import { PLANOS_B } from "./lc04b";

export const LC04_DUR = T(384.9);

const todos = (): PlanoM[] => {
  const lista = [...PLANOS_A, ...PLANOS_B];
  return lista.map(([s, el, trans], i) => ({ dur: (i + 1 < lista.length ? T(lista[i + 1][0]) : LC04_DUR) - T(s), el, trans }));
};

// HUD fijo (cuadros globales)
const DIA = [{ f: 0, v: 201 }, { f: T(69.1), v: 240, d: 12 }, { f: T(169.8), v: 250, d: 12 }, { f: T(197.3), v: 250 }, { f: T(200.4), v: 256, d: T(3.1) }, { f: T(279.3), v: 320, d: 12 }, { f: T(335.0), v: 321 }, { f: T(339.6), v: 330, d: T(4.6) }];
const KCAL = [{ f: 0, v: 7000000 }, { f: T(13.6), v: 0, d: T(2.6) }, { f: T(111.8), v: 7000000, d: T(4.9) }, { f: T(120.1), v: 0, d: 24 }, { f: T(204.8), v: 1500000, d: T(20) }, { f: T(279.3), v: 5600000, d: T(12) }, { f: T(298.0), v: 6900000, d: T(3.6) }, { f: T(321.4), v: 4300000, d: T(3.4) }, { f: T(345.6), v: 6100000, d: T(1.6) }];
const VERANO = [{ f: 0, v: 115 }, { f: T(169.8), v: 105, d: 10 }, { f: T(204.8), v: 80, d: 10 }, { f: T(236.9), v: 50, d: 10 }, { f: T(279.3), v: 30, d: 10 }, { f: T(301.6), v: 17, d: 10 }];
const HudLc04: React.FC = () => (
  <>
    <Poblacion claves={10} desde={-30} hasta={T(380.0)} />
    <Segundo claves={DIA} prefijo="DAY " icono="dia" desde={T(23.0)} hasta={T(352.4)} />
    <BarraKcal claves={KCAL} meta={7000000} rotulo="KCAL IN THE GROUND" desde={-30} hasta={T(352.4)} />
    <Segundo claves={VERANO} prefijo="DAYS LEFT IN SUMMER " icono="temp" y={296} desde={T(84.4)} hasta={T(352.4)} color="#ffb04a" />
    <Segundo claves={102} prefijo="LILY " sufijo=" °F" icono="temp" y={196} desde={T(360.8)} hasta={T(372.1)} color="#e23a2e" />
    <Pildora texto="Subscribe · the census continues" x={960} y={980} desde={T(64.4)} hasta={T(68.8)} color="#ffcf6e" tam={34} />
    <MarcaCorto />
  </>
);

export const Lc04: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={todos()} />
    <HudLc04 />
    {audio && <Audio src={staticFile("census/lc04_mezcla.wav")} />}
  </AbsoluteFill>
);
