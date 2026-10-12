// cksalads · bloque 3 (Seven-Layer, p.25) generado por mkblock.py. Tiempos de secs.json. Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, CtaCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
export const Block3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(617.4, 626.9)}><FewCard a={617.4} d={9.5} k="n_seven_bernice_bowl" txt="Bernice, in a clear glass bowl" t={618.9} /></Sequence>
    <Sequence {...seg(626.9, 636.0)}><FewCard a={626.9} d={9.1} k="n_seven_finished_glass" txt="so the whole church could see the stripes" t={628.9} /></Sequence>
    <Sequence {...seg(636.3, 666.55)}><PageCard a={636.3} d={30.25} k="page25" page={25} rows={[700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042]} amountsT={639.6} tab="PAGE 25" cam={[{ t: 636.3, s: 1.0, x: 960, y: 540 }, { t: 639.6, s: 1.6, x: 760, y: 552 }, { t: 666.17, s: 1.62, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(666.53, 690.63)}><StepRow a={666.53} d={24.1} steps={[{ k: "n_lettuce_layer", t: 666.73, lab: "lettuce on the bottom" }, { k: "n_mayo_frosting", t: 681.93, lab: "frost it to the glass" }]} /></Sequence>
    <Sequence {...seg(690.9, 700.17)}><TrickCard a={690.9} d={9.27} k="n_side_glass_layers" circ={692.57} txt="Frost the mayonnaise all the way to the glass." timer={694.57} ring="SEAL" /></Sequence>
    <Sequence {...seg(700.17, 710.15)}><FewCard a={700.17} d={9.98} k="n_bacon_crumbled" txt="the bacon goes on at the table" t={702.17} /></Sequence>
    <Sequence {...seg(710.13, 723.43)}><DoDontCard a={710.13} d={13.3} bad="n_wilted_wet_lettuce" good="n_crisp_dry_lettuce" badT={710.73} goodT={715.73} badTxt="WILTED" goodTxt="DRY THEM WELL" /></Sequence>
    <Sequence {...seg(723.63, 736.43)}><FewCard a={723.63} d={12.8} k="n_seven_pint_jars" txt="For one or two: two pint jars" t={725.23} /></Sequence>
    <AvOverlay from={611.4} to={736.43} />
    <Sequence {...seg(611.4, 617.4)}><NumberCard a={611.4} d={6.0} n="3" name="Seven-Layer Salad" k="n_seven_hero_close" /></Sequence>
  </AbsoluteFill>
);
