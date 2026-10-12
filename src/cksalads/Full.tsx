// cksalads · el video entero (Claude, 12-oct-2026). Orden fijo por tiempos absolutos de secs.json.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Bed } from "./Base";
import { fr } from "./Base";
import { Min1 } from "./Min1";
import { Block7 } from "./Block7";
import { Block6 } from "./Block6";
import { Block5 } from "./Block5";
import { Block4 } from "./Block4";
import { Block3 } from "./Block3";
import { Block2 } from "./Block2";
import { Block1 } from "./Block1";
import { CtaCard, FewCard } from "./Blocks";
import { RecapCard } from "./Closing";
import { AvOverlay } from "./AvOverlay";

export const TOTAL_S = 1090;
const seg = (a: number, b: number) => ({ from: fr(a), durationInFrames: fr(b) - fr(a) });
export const Full: React.FC = () => {
  const f = useCurrentFrame();
  return (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Bed k="n_table_seven_bowls" f={f} T={1090 * 30} dim={0.7} />
    <Min1 />
    <AvOverlay from={0.0} to={61.9} />
    <Block7 />
    <Block6 />
    <Sequence {...seg(314.23, 333.9)}><CtaCard a={314.23} d={19.67} /></Sequence>
    <Block5 />
    <Block4 />
    <Block3 />
    <Block2 />
    <Block1 />
    <Sequence {...seg(1023.53, 1062.37)}><RecapCard a={1023.53} d={38.84} /></Sequence>
    <AvOverlay from={1062.37} to={1085.83} />
    <Sequence from={fr(1067.9)} durationInFrames={fr(2.7)}><FewCard a={1067.9} d={2.7} k="n_church_table_supper" txt="God bless you, honey" t={1068.2} /></Sequence>
    <Sequence from={fr(1077.35)} durationInFrames={fr(2.7)}><FewCard a={1077.35} d={2.7} k="n_fluff_church_table" txt="may the pastor finally get a plate" t={1077.6} /></Sequence>

  </AbsoluteFill>
  );
};
