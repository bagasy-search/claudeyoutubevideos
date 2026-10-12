// cksalads · bloque 4 (Green Pistachio Fluff, p.23) generado por mkblock.py. Tiempos de secs.json. Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, CtaCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
export const Block4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(474.57, 483.27)}><FewCard a={474.57} d={8.7} k="n_pistachio_grandma_bowl" txt="Harold's mother's salad" t={476.27} /></Sequence>
    <Sequence {...seg(483.27, 492.17)}><FewCard a={483.27} d={8.9} k="n_pineapple_can_open" txt="stir that pudding right into the juice" t={485.27} /></Sequence>
    <Sequence {...seg(492.17, 513.47)}><PageCard a={492.17} d={21.3} k="page23" page={23} rows={[700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042]} amountsT={496.87} tab="PAGE 23" cam={[{ t: 492.17, s: 1.0, x: 960, y: 540 }, { t: 494.87, s: 1.6, x: 760, y: 552 }, { t: 513.47, s: 1.6, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(513.47, 524.05)}><FewCard a={513.47} d={10.58} k="n_pudding_mix_juice" txt="stir the mix into the juice first" t={515.47} /></Sequence>
    <Sequence {...seg(524.03, 547.6)}><StepRow a={524.03} d={23.57} steps={[{ k: "n_pistachio_folded_topping", t: 524.23, lab: "fold, don't stir hard" }, { k: "n_pistachio_nuts_cherries", t: 537.73, lab: "nuts the day you serve" }]} /></Sequence>
    <Sequence {...seg(547.57, 561.8)}><TrickCard a={547.57} d={14.23} k="n_pineapple_pour" circ={548.97} txt="Do not drain the pineapple." timer={551.27} ring="JUICE" /></Sequence>
    <Sequence {...seg(562.07, 576.97)}><DoDontCard a={562.07} d={14.9} bad="n_pistachio_gritty" good="n_pistachio_smooth" badT={562.57} goodT={567.57} badTxt="GRITTY" goodTxt="STIR IT FIRST" /></Sequence>
    <Sequence {...seg(576.97, 588.83)}><FewCard a={576.97} d={11.86} k="n_pistachio_small_glass" txt="For one or two: halve it" t={578.47} /></Sequence>
    <AvOverlay from={468.63} to={611.4} />
    <Sequence {...seg(468.63, 474.57)}><NumberCard a={468.63} d={5.94} n="4" name="Green Pistachio Fluff" k="n_pistachio_hero_close" /></Sequence>
    <Sequence {...seg(592.17, 597.07)}><FewCard a={592.17} d={4.9} k="n_fluff_church_table" txt="at the church table, every supper" t={593.07} /></Sequence>
    <Sequence {...seg(597.07, 603.07)}><FewCard a={597.07} d={6.0} k="n_pineapple_can_open" txt="the can, a whole supper of it" t={598.07} /></Sequence>
    <Sequence {...seg(603.07, 611.4)}><CtaCard a={603.07} d={8.33} /></Sequence>
  </AbsoluteFill>
);
