// Banco de prueba del kit Ole* (grupo C). Cada ítem = [duración en cuadros, elemento].
import React from "react";
import { OleBookPage, ruleKey, ruleMark, METODO_SPOTS, FRIJOLES_SPOTS } from "./OleBookPage";
import { OleCTA } from "./OleCTA";
import { OleCookhouse, OleCampMap } from "./OleCookhouse";
import { OleNameTag, OleNote, OleArrow, OleComments, OleSubscribe, OleAsk, OleStamp, OleCounter } from "./OleOverlays";

const BED = "ref_olbeans.png";

export const ITEMS_C: [number, React.ReactNode][] = [
  // 0 — pág. 7: página entera → regla 2 → regla 3 → regla 4 (con subrayado de cada título)
  [300, <OleBookPage key="bp1" sub="Page 7 · Ole's Camp Bean Method"
    keys={[[0, 0.5, 0.5, 1], [1.5, METODO_SPOTS.title.x, METODO_SPOTS.title.y, 2.1], ruleKey(2, 3.5), ruleKey(3, 6), ruleKey(4, 8.2)]}
    marks={[ruleMark(2, 4.6), ruleMark(3, 7.1), ruleMark(4, 9.2)]} />],
  // 1 — pág. 7 sobre metraje, sin rótulo: regla 8
  [150, <OleBookPage key="bp2" bed={BED} label="" keys={[[0, 0.5, 0.5, 1], ruleKey(8, 1.2)]} marks={[ruleMark(8, 2.4)]} />],
  // 2 — pág. 12 (frijoles): foto → método → truco de Ole
  [240, <OleBookPage key="bp3" src="img/ole/pagina_frijoles.png" sub="Page 12 · Ole's Camp Pot Beans"
    keys={[[0, 0.5, 0.5, 1], [1.2, FRIJOLES_SPOTS.method.x, FRIJOLES_SPOTS.method.y, 2.1], [4.2, FRIJOLES_SPOTS.trick.x, FRIJOLES_SPOTS.trick.y, 2.0]]}
    marks={[{ t: 5.2, x0: 0.095, y0: 0.739, x1: 0.475, y1: 0.738 }]} />],
  // 3 — CTA grande sobre madera
  [450, <OleCTA key="cta1" />],
  // 4 — CTA grande sobre metraje
  [180, <OleCTA key="cta2" bed={BED} point="Scan for the whole book" kicker="" />],
  // 5 — CTA compacto (overlay) sobre metraje
  [180, <OleCTA key="cta3" compact bed={BED} />],
  // 6 — comedor
  [300, <OleCookhouse key="ck1" stove="Ole's stove" />],
  // 7 — mapa del campamento
  [300, <OleCampMap key="map1" />],
  // 8+ — overlays sobre metraje
  [120, <OleNameTag key="nt1" bed={BED} />],
  [120, <OleNameTag key="nt2" bed={BED} side="right" name="Northern Minnesota" sub="Winter logging camps, 1950s" kicker="WHERE THIS COMES FROM" />],
  [150, <OleNote key="nn1" bed={BED} lines={["No soaking.", "Salt at the start.", "Then a whisper."]} x={0.74} y={0.42} />],
  [120, <OleArrow key="ar1" bed={BED} x={0.83} y={0.74} r={170} text="cast iron, lid cracked" />],
  [120, <OleArrow key="ar2" bed={BED} x={0.34} y={0.9} tx={0.16} ty={0.62} ring={false} text="enamel cup" />],
  [180, <OleComments key="cm1" bed={BED} />],
  [150, <OleSubscribe key="sb1" bed={BED} />],
  [120, <OleAsk key="as1" bed={BED} />],
  [90, <OleStamp key="st1" bed={BED} text="MYTH" sub="SALT MAKES BEANS TOUGH" />],
  [90, <OleStamp key="st2" bed={BED} text="TRUE" x={0.7} y={0.35} rot={7} />],
  [90, <OleStamp key="st3" bed={BED} text="CAMP RULE" sub="NO. 3 · COOK AT A WHISPER" size={120} />],
  [150, <OleCounter key="co1" bed={BED} mode="timer" />],
  [120, <OleCounter key="co2" bed={BED} mode="number" to={40} label="MEN, TWICE A DAY" />],
];
