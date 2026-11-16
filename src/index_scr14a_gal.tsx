// galería para stills.yml (EVALUADOR): cada componente/overlay de scr14a 100 cuadros; el still sale en el cuadro 70 de cada uno
import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, registerRoot, staticFile } from "remotion";
import { CompC14p } from "./gary11/C14p";
import * as O from "./gary11/O14p";
const C = ["jobs", "nope", "steps", "step:4", "prize", "parts", "receipt", "tools", "vapor", "fill", "stat:mercaptan", "cuts", "three", "auger", "gravity", "angle", "finder", "slope", "air3", "airflow", "slider",
  "warp", "season", "pressure", "bucket", "subq", "jobs:go", "wall:34", "climb", "stat:btu", "btu", "zones", "boil", "jobs:done", "battery", "burnback", "guards", "slope:back", "deadend", "hours", "night", "co",
  "stat:cdc", "mistakes", "mist:3", "stat:nfpa", "clear", "asked", "ask:2", "bag", "hopper", "cost", "pie", "recap", "rc:7", "next", "ask:cta"];
const BG = "scr14a/g/g0050.png";
const OV: [string, React.ReactNode][] = [
  ["name", <O.StampPlate text="THE SCRAP WORKSHOP" sub="BUILT FROM SCRAP · WITH THE NUMBERS" dur={160} />], ["tape", <O.StepRule n={4} dur={160} />], ["sheet", <O.PlateWipe dur={140} src="scr14a/g/g0980.png" />],
  ["door", <O.WeldFrame src="scr14a/g/g1350.png" seed={3} label="¼ IN PLATE · 3 TACKS" dur={160} />],
  ["datatag", <O.ShipTag big="≈ 7 LB" label="ONE FULL HOPPER" src="MY SHOP SCALE" dur={160} />], ["safe", <O.Hazard text="FILL THE TANK WITH WATER BEFORE YOU CUT" dur={160} />]];
const N = C.length + OV.length;
const Gal: React.FC = () => <AbsoluteFill style={{ background: "#000" }}>
  {C.map((c, i) => <Sequence key={c} from={i * 100} durationInFrames={100}><CompC14p s={{ comp: c, m: [6, 14, 22, 30, 38, 46, 52, 56, 60, 64] }} dur={80} /></Sequence>)}
  {OV.map(([k, el], j) => <Sequence key={k} from={(C.length + j) * 100} durationInFrames={100}><AbsoluteFill><Img src={staticFile(BG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>{el}</Sequence>)}
</AbsoluteFill>;
registerRoot(() => <Composition id="Gal" component={Gal} durationInFrames={N * 100} fps={30} width={1920} height={1080} />);
