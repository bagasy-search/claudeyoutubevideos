// cksalads · bloque 2 (Church Basement Macaroni, p.24) generado por mkblock.py. Tiempos de secs.json. Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, CtaCard, ArchiveCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
export const Block2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(742.73, 750.87)}><FewCard a={742.73} d={8.14} k="n_irene_cooler" txt="Irene's cooler, full of ice" t={743.93} /></Sequence>
    <Sequence {...seg(750.87, 761.77)}><FewCard a={750.87} d={10.9} k="n_macaroni_long_table" txt="down the basement stairs, like a baby" t={753.87} /></Sequence>
    <Sequence {...seg(762.07, 792.7)}><PageCard a={762.07} d={30.63} k="page24" page={24} rows={[700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042]} amountsT={769.5} tab="PAGE 24" cam={[{ t: 762.07, s: 1.0, x: 960, y: 540 }, { t: 765.5, s: 1.6, x: 760, y: 552 }, { t: 792.7, s: 1.6, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(792.97, 818.4)}><StepRow a={792.97} d={25.43} steps={[{ k: "n_elbow_boiling", t: 793.97, lab: "one minute past tender" }, { k: "n_macaroni_dressing_whisk", t: 806.9, lab: "whisk the dressing" }]} /></Sequence>
    <Sequence {...seg(818.7, 827.4)}><TrickCard a={818.7} d={8.7} k="n_macaroni_jar_centered" circ={819.4} txt="Save a third of the dressing for the last minute." timer={821.4} ring="1/3" /></Sequence>
    <Sequence {...seg(827.4, 837.8)}><FewCard a={827.4} d={10.4} k="n_macaroni_saved_dressing" txt="the second batch makes it creamy again" t={829.4} /></Sequence>
    <Sequence {...seg(838.1, 855.73)}><DoDontCard a={838.1} d={17.63} bad="n_macaroni_dry" good="n_macaroni_creamy" badT={838.9} goodT={844.73} badTxt="DRY BY SERVING" goodTxt="KEEP SOME BACK" /></Sequence>
    <AvOverlay from={736.73} to={862.93} />
    <Sequence {...seg(736.73, 742.73)}><NumberCard a={736.73} d={6.0} n="2" name="Church Basement Macaroni" k="n_macaroni_hero_close" /></Sequence>
    <Sequence {...seg(855.83, 862.93)}><ArchiveCard a={855.83} d={7.1} src="arch_eat_360" cap="1954 film: a plate of food on the table" /></Sequence>
  </AbsoluteFill>
);
