// galería para stills.yml: cada componente/overlay de gary14c 100 cuadros; el still sale en el cuadro 70 de cada uno
import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, registerRoot, staticFile } from "remotion";
import { CompC14c } from "./gary11/C14c";
import * as O from "./gary11/O14c";
const C = ["sleep", "tenlist", "promise", "cdc:400", "cdc:er", "cdc:hosp", "cdc:months", "nosense", "blood", "mistake:1", "postmark:wooster", "hundreds", "leaks", "draft", "draft:garage", "yard20",
  "chainprice", "tarp", "shutoff", "hosewall", "hoseleak", "sealedbox", "climb", "window10", "neighbor", "sidecheck", "cord", "postmark:loudonville", "coals", "oven", "rooms", "rank12",
  "flue", "inout", "postmark:shreve", "ventmap", "label", "heaterrules", "nosleep", "towers", "damper", "perfloor", "twotypes", "place:hall", "mixes", "place:15", "place:no",
  "mistake:10", "postmark:mounteaton", "age14", "sensor", "signs", "suspect:1", "suspect:4", "firstmin", "dispatch", "emergency", "risk", "counter", "q:1", "propane", "protect", "chirp", "alarm4",
  "ppm", "q:7", "daynight", "ctaq", "cta", "check:0", "check:2", "datecalc", "floorplan", "promise:garage", "recap:1", "recap:7", "recap:out", "next"];
const BG = "gary14c/g/g1650.png", AV = "gary14c/g/g0050.png";
const OV: [string, React.ReactNode][] = [
  ["name", <O.Dymo text="GARY" sub="ELECTRICIAN · 40 YEARS · OHIO" dur={160} />], ["fuses", <O.DetectorRow n={4} dur={160} />], ["conduit", <O.GarageDoor dur={140} />],
  ["door", <O.WindowSplit src="gary14c/g/g0480.png" seed={3} label="STEP ONE · BEFORE DARK · A STAKE AT 20 FT" dur={160} />], ["clip", <O.Slide src="gary14c/g/g0340.png" note="Wooster · Feb 2011 · the fire captain" seed={5} dur={160} />],
  ["datatag", <O.WarnLabel big="$20–40" label="A BASIC BATTERY CO DETECTOR" src="SHELF PRICE WHERE GARY SHOPS" dur={160} />], ["safe", <O.ExitSign text="GENERATOR OUTSIDE · 20 FT" dur={160} />], ["midcta", <O.CabinetPeek dur={160} />]];
const N = C.length + OV.length;
const Gal: React.FC = () => <AbsoluteFill style={{ background: "#000" }}>
  {C.map((c, i) => <Sequence key={c} from={i * 100} durationInFrames={100}><CompC14c s={{ comp: c, m: [6, 14, 22, 30, 38, 46, 52, 56, 60, 64] }} dur={80} /></Sequence>)}
  {OV.map(([k, el], j) => <Sequence key={k} from={(C.length + j) * 100} durationInFrames={100}><AbsoluteFill><Img src={staticFile(k === "door" || k === "clip" ? AV : BG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>{el}</Sequence>)}
</AbsoluteFill>;
registerRoot(() => <Composition id="Gal" component={Gal} durationInFrames={N * 100} fps={30} width={1920} height={1080} />);
