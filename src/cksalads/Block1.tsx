// cksalads · bloque 1 (Strawberry Pretzel, p.21) generado por mkblock.py. Tiempos de secs.json. Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, CtaCard, ArchiveCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
export const Block1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(897.23, 933.07)}><PageCard a={897.23} d={35.84} k="page21" page={21} rows={[700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042]} amountsT={901.73} tab="PAGE 21" cam={[{ t: 897.23, s: 1.0, x: 960, y: 540 }, { t: 900.73, s: 1.6, x: 760, y: 552 }, { t: 933.07, s: 1.6, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(933.33, 951.73)}><StepRow a={933.33} d={18.4} steps={[{ k: "n_pretzel_crush", t: 934.03, lab: "two cups of crushed pretzels" }, { k: "n_pretzel_cream_spread", t: 942.03, lab: "seal the cream to the sides" }]} /></Sequence>
    <Sequence {...seg(972.03, 990.9)}><TrickCard a={972.03} d={18.87} k="n_pretzel_cream_spread" circ={974.03} txt="Seal the cream right to the sides of the pan." timer={977.83} ring="SEAL" mx={1270} my={300} mw={470} mh={520} /></Sequence>
    <Sequence {...seg(990.9, 1011.93)}><DoDontCard a={990.9} d={21.03} bad="n_pretzel_soggy" good="n_pretzel_crisp" badT={991.5} goodT={998.5} badTxt="SOGGY CRUST" goodTxt="CHILL THE GELATIN" /></Sequence>
    <AvOverlay from={863.23} to={1023.53} />
    <Sequence {...seg(863.23, 869.13)}><NumberCard a={863.23} d={5.9} n="1" name="Strawberry Pretzel Salad" k="n_pretzel_hero_close_v2" /></Sequence>
    <Sequence {...seg(869.13, 879.17)}><ArchiveCard a={869.13} d={10.04} src="arch_thanks_330" cap="1951 film: a woman serves a family dinner" /></Sequence>
    <Sequence {...seg(879.17, 896.93)}><FewCard a={879.17} d={17.76} k="n_pretzel_squares" txt="gone before the coffee was poured" t={882.17} /></Sequence>
    <Sequence {...seg(951.73, 971.67)}><FewCard a={951.73} d={19.94} k="n_pretzel_gelatin_pour" txt="wait for the gelatin to thicken" t={953.73} /></Sequence>
    <Sequence {...seg(1012.03, 1023.53)}><FewCard a={1012.03} d={11.5} k="n_pretzel_8x8" txt="For one or two: an eight by eight" t={1013.33} /></Sequence>
  </AbsoluteFill>
);
