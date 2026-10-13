// mecnafta · escenas héroe, tiempos del plan (segundos de la voz 943,5 s). Cada héroe quedó en su hueco entre ventanas AV;
// los beats están corridos respecto de su palabra ancla (desfase = a - ancla): ver BITACORA (R4).
import React from "react";
import { Notebook, EightThieves, DoorLabel, FilterLight, HandHeat, TrunkWeight, PumpClick, PageSixteen } from "./Heroes";
const fr = (s: number) => Math.round(s * 30);
export const HEROES: Record<string, { a: number; d: number; el: () => React.ReactElement }> = {
  HERO_EIGHT: { a: 29.35, d: 14.5, el: () => <EightThieves a={29.35} d={fr(14.5)} bed="n_sedan_entrada" hidden={42.0}
    cards={[{ k: "l_uno_medidor_2", t: 34 }, { k: "n_filtro_sucio", t: 35 }, { k: "n_sensor_maf", t: 36 }, { k: "n_freno_disco", t: 37 }, { k: "n_caja_herramientas", t: 38 }, { k: "l_seis_pie", t: 39 }, { k: "n_luces_tablero", t: 40 }, { k: "n_pantalla_bomba", t: 41 }]} /> },
  HERO_NOTEBOOK: { a: 155.33, d: 19.6, el: () => <Notebook a={155.33} d={fr(19.6)} bed="n_libreta_azul" divide={170.75} chip={158.25} chipTxt="KM POR LITRO" /> },
  HERO_PAGE: { a: 182.2, d: 18.9, el: () => <PageSixteen a={182.2} d={fr(18.9)} k="page16" chip={199.6} checks={[]} /> },
  HERO_DOOR: { a: 234.41, d: 18.9, el: () => <DoorLabel a={234.41} d={fr(18.9)} label="n_etiqueta_puerta" side="l_uno_costado" gauge="l_uno_medidor" strike={241.44} chip={240.0} /> },
  HERO_FILTER: { a: 292.23, d: 13.7, el: () => <FilterLight a={292.23} d={fr(13.7)} dirty="n_filtro_sucio" clean="n_filtro_nuevo" tick={303.19} strike={294.29} /> },
  HERO_HAND: { a: 417.21, d: 12, el: () => <HandHeat a={417.21} d={fr(12)} k="l_cuatro_mano" warmAt={422.57} chip={425.2} warmX={420} warmY={520} /> },
  HERO_TRUNK: { a: 496.39, d: 15.6, el: () => <TrunkWeight a={496.39} d={fr(15.6)} k="n_baul_cemento" chip={504.2}
    marks={[{ x: 560, y: 330, w: 300, h: 240, t: 500.1 }, { x: 880, y: 300, w: 300, h: 240, t: 501.9 }]} /> },
  HERO_PUMP: { a: 680.0, d: 18, el: () => <PumpClick a={680.0} d={fr(18)} k="l_ocho_pistola" drip="n_goteo_pistola" click={682.0} strike={685.2} note={696.0} /> },
};
