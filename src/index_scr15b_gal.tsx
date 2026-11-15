// galería para stills.yml (EVALUADOR): cada componente/overlay de scr15b 100 cuadros; el still sale en el cuadro 70 de cada uno
import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, registerRoot, staticFile } from "remotion";
import { CompC15b } from "./gary11/C15b";
import * as O from "./gary11/O15b";
const C = ["pieces", "carousel", "part:1", "part:7", "history", "wick", "stat:paraffin", "stat:cdc", "energy", "measure", "tubes", "stubs", "grease", "bath", "nowater", "pours", "stove", "where",
  "boiltimer", "lidwind", "menu", "damper", "tenmin", "lineup", "subq", "mistakes", "mist:2", "asked", "ask:3", "memory", "canpack", "kitmath", "days", "recap", "rc:6", "rc:bonus", "next"];
const BG = "scr15b/g/g0150.png";
const OV: [string, React.ReactNode][] = [
  ["name", <O.CanLabel text="THE SCRAP WORKSHOP" sub="BUILT FROM SCRAP · WITH THE NUMBERS" dur={160} />], ["tape", <O.PartStrip n={4} dur={160} />], ["sheet", <O.CardFlap dur={140} src="scr15b/g/g0910.png" />],
  ["door", <O.TapedCard src="scr15b/g/g2060.png" seed={3} label="SQUARE DOOR · 3 IN × 3 IN" dur={160} />],
  ["datatag", <O.TapeData big="~150 g" label="WAX IN ONE TUNA CAN" src="MY KITCHEN SCALE" dur={160} />], ["safe", <O.Enamel text="NEVER WATER ON A WAX FIRE" dur={160} />]];
const N = C.length + OV.length;
const Gal: React.FC = () => <AbsoluteFill style={{ background: "#000" }}>
  {C.map((c, i) => <Sequence key={c} from={i * 100} durationInFrames={100}><CompC15b s={{ comp: c, m: [6, 14, 22, 30, 38, 46, 52, 56, 60, 64] }} dur={80} /></Sequence>)}
  {OV.map(([k, el], j) => <Sequence key={k} from={(C.length + j) * 100} durationInFrames={100}><AbsoluteFill><Img src={staticFile(BG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>{el}</Sequence>)}
</AbsoluteFill>;
registerRoot(() => <Composition id="Gal" component={Gal} durationInFrames={N * 100} fps={30} width={1920} height={1080} />);
