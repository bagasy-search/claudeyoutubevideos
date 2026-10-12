// cksalads · bloque 7 (Copper Pennies, p. 27) v2 tras cp4. Tiempos de secs.json.
// Regla: ninguna foto mas de 10 s; ninguna imagen repetida; Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, ArchiveCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
const ROWS = [700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042];
export const Block7: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(63.1, 69.03)}><NumberCard a={63.1} d={5.93} n="7" name="Copper Pennies" k="n_copper_hero_close" /></Sequence>
    <Sequence {...seg(69.03, 80.33)}><FewCard a={69.03} d={11.3} k="n_irene_crock_table" txt="Irene's crock, every year" t={70.7} /></Sequence>
    <Sequence {...seg(80.33, 90.03)}><FewCard a={80.33} d={9.7} k="n_church_table_supper" txt="the same bowl, every supper" t={82.33} /></Sequence>
    <Sequence {...seg(90.13, 107.43)}><PageCard a={90.13} d={17.3} k="page27" page={27} rows={ROWS} amountsT={95.13} tab="PAGE 27"
      cam={[{ t: 90.13, s: 1.3, x: 960, y: 540 }, { t: 94.13, s: 2.0, x: 760, y: 552 }, { t: 107.43, s: 2.08, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(107.43, 115.13)}><ArchiveCard a={107.43} d={7.7} src="arch_beets_460" cap="1942 film: trimming beets by hand on the line" /></Sequence>
    <Sequence {...seg(115.13, 121.9)}><ArchiveCard a={115.13} d={6.77} src="arch_beets_280" cap="1942 film: a worker cuts beets on a board" /></Sequence>
    <Sequence {...seg(121.87, 149.73)}><StepRow a={121.87} d={27.86} steps={[
      { k: "n_pot_carrots_boiling", t: 121.87, lab: "5 to 6 minutes" }, { k: "n_carrots_draining", t: 133.4, lab: "rinse cold" }, { k: "n_dressing_pan", t: 142.07, lab: "hot dressing" }]} /></Sequence>
    <Sequence {...seg(150.03, 158.3)}><TrickCard a={150.03} d={8.27} k="n_carrots_lifted_early" circ={150.53} txt="Undercook them by a minute." timer={151.53} ring="-1 MIN" /></Sequence>
    <Sequence {...seg(158.3, 170.83)}><FewCard a={158.3} d={12.53} k="n_carrots_into_pan" txt="they finish in the hot dressing" t={159.23} /></Sequence>
    <Sequence {...seg(171.03, 182.1)}><DoDontCard a={171.03} d={11.07} bad="n_carrots_mush" good="n_copper_small_jar" badT={172.93} goodT={177.8} badTxt="MUSH" goodTxt="CRISP-TENDER" /></Sequence>
    <Sequence {...seg(182.43, 192.13)}><FewCard a={182.43} d={9.7} k="n_two_jars_fridge" txt="For one or two: make it all" t={184.73} /></Sequence>
    <AvOverlay from={63.1} to={192.13} />
    <Sequence {...seg(153.97, 156.97)}><MinChip txt="-1 MIN" /></Sequence>
  </AbsoluteFill>
);
