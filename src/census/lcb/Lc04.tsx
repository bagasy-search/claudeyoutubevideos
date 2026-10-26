// The Last Census · Ep.4 «Could 10 People Grow Enough Food to Survive Year One?» (lc04). 6:23,4 de voz + 1,5 s de tarjeta.
// Montaje de planos (lc04a 0:00-3:25 · lc04b 3:25-6:25) + HUD fijo en cuadros GLOBALES + la mezcla (voz + foley + cama).
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Montaje, PlanoM } from "../../anikit/montaje";
import { MarcaCorto, Pildora } from "../../anikit/pantalla";
import { setMotionBlur } from "../../anikit/camara";
// el motion blur de cámara (hasta 60 px) dejaba ilegibles inicios y medios de escena: apagado en toda la serie lcb
setMotionBlur(false);
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
// HUD coherente con la NARRACIÓN de punta a punta (cuadros GLOBALES; misma curva out-cubic que los contadores de escena):
// DAY: 201 llegada · 240 fines de mayo (E17, sincronizado con su contador 69.5-71.5) · 250 plantar (E37 170.0-171.8) ·
// 256 tras 6 días de pala (E44 197.3-200.4) · avanza parejo el verano · 320 mediados de agosto (E61, 279.5-281.2) ·
// 333 = 29 de agosto (E66 «AUGUST 29», 13 días después) · 334→343 los 9 días de cavar (E75).
// DAYS LEFT IN SUMMER = 355 − DAY en todo momento (día 240 ↔ 115 pintado en la puerta) y cae a 0 con la helada (E69 «Frost.»).
// KCAL IN THE GROUND: 0 hasta que crece lo plantado (nada de 632,439 / 875,000 / 7M falsos), sube monótono hasta 6,895,000
// junto con la barra de E65 (298.2-300.8) y baja SÓLO con la helada a 6.1M (E73, junto con GARDEN ALIVE 1→0.5); nunca 4.3M.
const DIA = [{ f: 0, v: 201 }, { f: T(69.5), v: 240, d: T(71.5) - T(69.5) }, { f: T(170.0), v: 250, d: T(171.8) - T(170.0) }, { f: T(197.3), v: 256, d: T(200.4) - T(197.3) }, { f: T(214.0), v: 264, d: T(2.5) }, { f: T(231.0), v: 278, d: T(2.5) }, { f: T(241.0), v: 288, d: T(2.5) }, { f: T(262.0), v: 293, d: T(2.5) }, { f: T(275.0), v: 296, d: T(2.0) }, { f: T(279.5), v: 320, d: T(281.2) - T(279.5) }, { f: T(301.9), v: 333, d: T(1.2) }, { f: T(335.0), v: 343, d: T(4.8) }];
const KCAL = [{ f: 0, v: 0 }, { f: T(214.0), v: 150000, d: T(4) }, { f: T(236.9), v: 900000, d: T(5) }, { f: T(262.0), v: 2400000, d: T(5) }, { f: T(279.5), v: 3600000, d: T(5) }, { f: T(290.0), v: 5040000, d: T(6) }, { f: T(298.2), v: 6895000, d: T(300.8) - T(298.2) }, { f: T(321.8), v: 6100000, d: T(2.2) }];
const VERANO = [...DIA.filter((c) => c.f <= T(301.9)).map((c) => ({ ...c, v: 355 - c.v })), { f: T(313.8), v: 0, d: 14 }];
const HudLc04: React.FC = () => (
  <>
    <Poblacion claves={10} desde={-30} hasta={T(380.0)} />
    <Segundo claves={DIA} prefijo="DAY " icono="dia" desde={T(23.0)} hasta={T(352.4)} />
    <BarraKcal claves={KCAL} meta={7000000} rotulo="KCAL IN THE GROUND" desde={-30} hasta={T(352.4)} />
    <Segundo claves={VERANO} prefijo="DAYS LEFT IN SUMMER " icono="temp" y={296} desde={T(84.4)} hasta={T(352.4)} color="#ffb04a" />
    <Segundo claves={102} prefijo="LILY " sufijo=" °F" icono="temp" y={196} desde={T(360.8)} hasta={T(372.1)} color="#e23a2e" />
    <Pildora texto="Subscribe · the census continues" x={960} y={990} desde={T(376.6)} hasta={T(380.4)} color="#ffcf6e" tam={34} />
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
