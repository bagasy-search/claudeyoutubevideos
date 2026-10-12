// cksalads · bloque 5 (Frog Eye, p.26) generado por mkblock.py. Tiempos de secs.json. Loretta por AvOverlay en las piezas de avwin.json.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { fr } from "./Base";
import { NumberCard, PageCard, StepRow, TrickCard, DoDontCard, FewCard, MinChip, CtaCard } from "./Blocks";
import { AvOverlay } from "./AvOverlay";

const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
export const Block5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <Sequence {...seg(339.77, 348.67)}><FewCard a={339.77} d={8.9} k="n_frog_envelope_real" txt="my mother's, on the back of an envelope" t={341.67} /></Sequence>
    <Sequence {...seg(348.67, 355.3)}><FewCard a={348.67} d={6.63} k="n_frog_potluck_table" txt="every potluck when I was a girl" t={350.5} /></Sequence>
    <Sequence {...seg(355.43, 380.4)}><PageCard a={355.43} d={24.97} k="page26" page={26} rows={[700, 738, 776, 814, 852, 890, 928, 966, 1004, 1042]} amountsT={360.43} tab="PAGE 26" cam={[{ t: 355.43, s: 1.0, x: 960, y: 540 }, { t: 359.43, s: 1.6, x: 760, y: 552 }, { t: 380.4, s: 1.62, x: 760, y: 552 }]} /></Sequence>
    <Sequence {...seg(380.4, 390.9)}><FewCard a={380.4} d={10.5} k="n_acini_pasta_pot" txt="cook the pasta until tender" t={382.4} /></Sequence>
    <Sequence {...seg(390.9, 425.4)}><StepRow a={390.9} d={34.5} steps={[{ k: "n_custard_pan", t: 391.1, lab: "whisk, then bubbles" }, { k: "n_fruit_drained", t: 413.67, lab: "fold in the fruit" }]} /></Sequence>
    <Sequence {...seg(425.4, 433.9)}><TrickCard a={425.4} d={8.5} k="n_frog_overnight_bowl_v2" circ={427.1} txt="Cook the little custard, let the pasta sit in it overnight." timer={428.1} ring="OVERNIGHT" /></Sequence>
    <Sequence {...seg(433.9, 444.15)}><FewCard a={433.9} d={10.25} k="n_frog_overnight_bowl_v2" txt="let it soak until morning" t={434.9} /></Sequence>
    <Sequence {...seg(444.13, 457.17)}><DoDontCard a={444.13} d={13.04} bad="n_frog_bland_pasta" good="n_custard_first_glossy" badT={444.23} goodT={448.63} badTxt="BLAND PASTA" goodTxt="CUSTARD FIRST" /></Sequence>
    <Sequence {...seg(457.37, 468.63)}><FewCard a={457.37} d={11.26} k="n_frog_small_bowl_v2" txt="For one or two: halve it" t={458.47} /></Sequence>
    <AvOverlay from={334.0} to={468.63} />
    <Sequence {...seg(334.0, 339.77)}><NumberCard a={334.0} d={5.77} n="5" name="Frog Eye Salad" k="n_frog_hero_close" /></Sequence>
  </AbsoluteFill>
);
