// galería para stills.yml (EVALUADOR): cada componente/overlay de gary14a 100 cuadros; el still sale en el cuadro 70 de cada uno
import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, registerRoot, staticFile } from "remotion";
import { CompC14a } from "./gary11/C14a";
import * as O from "./gary11/O14a";
const C = ["ring", "carousel", "round:3", "win:6:gen", "final", "map:orrville", "map:wooster", "exhaust", "stat:cdc", "twenty", "hose:watts", "hose:half", "sticker", "fridgehours", "drain750", "fridgelist",
  "napkin:6", "cans3", "datetape", "refill3", "sunarc", "lock32", "furnaceparts", "sine", "backfeedline", "sequence", "heatjob", "decibels", "hourbook", "storeband", "shelf:gen", "shelf:station",
  "pump", "bucket", "plantbucket:1", "cycles", "letters", "schedule", "counter", "checklist:5", "q:4", "fuse", "surge", "prize", "cart:1000:2", "cart:2500", "recap:6"];
const BG = "gary14a/g/g2720.png", AV = "gary14a/g/g0850.png";
const OV: [string, React.ReactNode][] = [
  ["patch", <O.Patch text="GARY" sub="ELECTRICIAN · 40 YEARS · OHIO" dur={160} />], ["fuses", <O.FuseStrip n={4} dur={160} />], ["conduit", <O.Conduit dur={140} />],
  ["door", <O.PanelDoor src="gary14a/g/g3000.png" seed={3} label="WHAT I'D BUY · $1,000 / $2,500" dur={160} />], ["clip", <O.Clipboard src="gary14a/g/g3970.png" note="Mrs. Dale · Wooster, 2019" seed={5} dur={160} />],
  ["datatag", <O.DataTag big="4 HOURS" label="A CLOSED FRIDGE KEEPS FOOD COLD" src="USDA · FOODSAFETY.GOV" dur={160} />], ["safe", <O.SafeWay text="20 FT OUT · EXHAUST AWAY" dur={160} />], ["midcta", <O.MidCta dur={160} />]];
const N = C.length + OV.length;
const Gal: React.FC = () => <AbsoluteFill style={{ background: "#000" }}>
  {C.map((c, i) => <Sequence key={c} from={i * 100} durationInFrames={100}><CompC14a s={{ comp: c, m: [6, 14, 22, 30, 38, 46, 52, 56, 60, 64] }} dur={80} /></Sequence>)}
  {OV.map(([k, el], j) => <Sequence key={k} from={(C.length + j) * 100} durationInFrames={100}><AbsoluteFill><Img src={staticFile(k === "door" || k === "clip" ? AV : BG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>{el}</Sequence>)}
</AbsoluteFill>;
registerRoot(() => <Composition id="Gal" component={Gal} durationInFrames={N * 100} fps={30} width={1920} height={1080} />);
