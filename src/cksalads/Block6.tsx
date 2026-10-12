// cksalads · bloque 6 (Three-Bean, p. 22). secs.json: S6_STORY 197.9-224, S6_PAGE 224-258.1, S6_STEPS 258.6-279.6, S6_TRICK 279.9-294.5, S6_MISTAKE 295-309.6, S6_FEW 309.6-322.5.
// Regla: ninguna foto mas de ~10 s; ninguna imagen repetida; Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, ArchiveCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
const ROWS = [700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042];
export const Block6: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(192.57, 198.5)}><NumberCard a={192.57} d={5.93} n="6" name="Three-Bean Salad" k="n_beans_bowl_warm" /></Sequence>
    <Sequence {...seg(198.5, 206.6)}><FewCard a={198.5} d={8.1} k="n_beans_small_jar" txt="Bernice, the day before" t={199.6} /></Sequence>
    <Sequence {...seg(206.6, 216.47)}><FewCard a={206.6} d={9.87} k="n_beans_table_church" txt="every single time" t={208.6} /></Sequence>
    <Sequence {...seg(216.47, 234.1)}><PageCard a={216.47} d={17.63} k="page22" page={22} rows={ROWS} amountsT={222.47} tab="PAGE 22"
      cam={[{ t: 216.47, s: 1.02, x: 960, y: 540 }, { t: 220.47, s: 2.0, x: 760, y: 552 }, { t: 234.1, s: 2.08, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(234.1, 242.5)}><ArchiveCard a={234.1} d={8.4} src="arch_beets_320" cap="1942 film: beets trimmed on the production line" /></Sequence>
    <Sequence {...seg(242.5, 251.9)}><FewCard a={242.5} d={9.4} k="n_beans_scale_measure" txt="a cup of sugar, a teaspoon of salt" t={243.43} /></Sequence>
    <Sequence {...seg(251.9, 272.57)}><StepRow a={251.9} d={20.67} steps={[
      { k: "n_vinegar_pan_new", t: 251.9, lab: "warm the vinegar" }, { k: "n_beans_fridge_lid", t: 263.2, lab: "chill overnight" }]} /></Sequence>
    <Sequence {...seg(272.87, 280.9)}><TrickCard a={272.87} d={8.03} k="n_beans_pour_dressing_v2" circ={273.97} txt="Pour the dressing on warm." timer={275.97} ring="WARM" /></Sequence>
    <Sequence {...seg(280.9, 286.93)}><FewCard a={280.9} d={6.03} k="n_beans_stirred_bowl" txt="warm beans drink it in" t={281.9} /></Sequence>
    <Sequence {...seg(287.2, 301.6)}><DoDontCard a={287.2} d={14.4} bad="n_beans_pink_wrong" good="n_beans_rinsed_clear" badT={287.2} goodT={287.2} badTxt="PINK EVERYTHING" goodTxt="RINSE THE KIDNEY BEANS" /></Sequence>
    <Sequence {...seg(301.6, 314.23)}><FewCard a={301.6} d={12.63} k="n_beans_two_jars_fridge" txt="For one or two: make the full amount" t={304.0} /></Sequence>
    <AvOverlay from={192.57} to={314.23} />
    <Sequence {...seg(298.5, 303.0)}><FewCard a={298.5} d={4.5} k="n_beans_overnight_jar_v2" txt="overnight, in the fridge" t={299.0} /></Sequence>
    <Sequence {...seg(275.97, 278.9)}><MinChip txt="WARM" /></Sequence>
  </AbsoluteFill>
);
