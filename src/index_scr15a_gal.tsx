// galería para stills.yml (EVALUADOR): cada componente/overlay de scr15a 100 cuadros; el still sale en el cuadro 70 de cada uno
import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, registerRoot, staticFile } from "remotion";
import { CompC15a } from "./gary11/C15a";
import * as O from "./gary11/O15a";
const C = ["parts", "carousel", "step:1", "step:8", "stat:paraffin", "stat:nfpa", "math", "four", "plume", "gap", "rule", "pot", "lineup", "therm:150", "subq", "heatmath", "cooldown", "mass", "flow", "room",
  "hundred", "mistakes", "mist:3", "asked", "ask:1", "versus", "memory", "recap", "rc:6", "rc:bonus", "next"];
const BG = "scr15a/g/g0450.png";
const OV: [string, React.ReactNode][] = [
  ["name", <O.SteelTag text="THE SCRAP WORKSHOP" sub="BUILT FROM SCRAP · WITH THE NUMBERS" dur={160} />], ["tape", <O.StepTape n={5} dur={160} />], ["sheet", <O.IronSheet dur={140} src="scr15a/g/g0530.png" />],
  ["door", <O.MagnetBoard src="scr15a/g/g0630.png" seed={3} label="CAR DRUM vs TRUCK DRUM" dur={160} />],
  ["datatag", <O.Slate big="~150 W" label="FOUR TEA LIGHTS, BURNING" src="ENGINEERING TOOLBOX" dur={160} />], ["safe", <O.Hazard text="A CO ALARM IN THE ROOM" dur={160} />]];
const N = C.length + OV.length;
const Gal: React.FC = () => <AbsoluteFill style={{ background: "#000" }}>
  {C.map((c, i) => <Sequence key={c} from={i * 100} durationInFrames={100}><CompC15a s={{ comp: c, m: [6, 14, 22, 30, 38, 46, 52, 56, 60, 64] }} dur={80} /></Sequence>)}
  {OV.map(([k, el], j) => <Sequence key={k} from={(C.length + j) * 100} durationInFrames={100}><AbsoluteFill><Img src={staticFile(BG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>{el}</Sequence>)}
</AbsoluteFill>;
registerRoot(() => <Composition id="Gal" component={Gal} durationInFrames={N * 100} fps={30} width={1920} height={1080} />);
