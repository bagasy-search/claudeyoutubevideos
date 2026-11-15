// galería para stills.yml (ronda 3): las escenas C que quedan + los overlays en uso + cada plano G/Y con leyenda tal como sale en el video.
// 100 cuadros por ítem; el still sale en el cuadro 70 de cada uno (from=70, to=70+(N-1)*100, count=N).
import React from "react";
import { AbsoluteFill, Composition, Img, Sequence, registerRoot, staticFile } from "remotion";
import { CompC14c } from "./gary11/C14c";
import * as O from "./gary11/O14c";
import { ShotBody } from "./gary11/Main14c";
import { SHOTS } from "./gary11/cues.gen";
const C = ["draft", "shutoff", "hoseleak", "window10", "neighbor", "sidecheck", "flue", "inout", "towers", "damper", "suspect:1", "suspect:3", "protect", "alarm4", "recap:out"];
const BG = "gary14c/g/g1650.png", AV = "gary14c/g/g0050.png";
const OV: [string, string, React.ReactNode][] = [
  ["name", AV, <O.Dymo text="GARY" sub="ELECTRICIAN · 40 YEARS · OHIO" dur={160} />], ["conduit", BG, <O.GarageDoor dur={140} />],
  ["door", AV, <O.WindowSplit src="gary14c/g/g1801.png" seed={3} label="LABELED FOR INDOOR USE · WINDOW CRACKED" dur={160} />],
  ["datatag", "gary14c/g/g2060.png", <O.WarnLabel big="$20–40" label="A BASIC BATTERY CO DETECTOR" src="STORE SHELF PRICE" dur={160} />],
  ["safe", "gary14c/g/g1910.png", <O.ExitSign text="DAMPER OPEN TILL THE ASHES ARE COLD" dur={160} />], ["midcta", "gary14c/g/g2070.png", <O.CabinetPeek dur={160} />]];
const CAP = (SHOTS as any[]).filter((s) => s.cap && s.k !== "A" && s.k !== "C");
const N = C.length + OV.length + CAP.length;
const Gal: React.FC = () => <AbsoluteFill style={{ background: "#000" }}>
  {C.map((c, i) => <Sequence key={c} from={i * 100} durationInFrames={100}><CompC14c s={{ comp: c, m: [6, 14, 22, 30, 38, 46, 52, 56, 60, 64] }} dur={80} /></Sequence>)}
  {OV.map(([k, bg, el], j) => <Sequence key={k} from={(C.length + j) * 100} durationInFrames={100}><AbsoluteFill><Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>{el}</Sequence>)}
  {CAP.map((s, j) => <Sequence key={"g" + s.id} from={(C.length + OV.length + j) * 100} durationInFrames={100}><ShotBody s={s} dur={100} /></Sequence>)}
</AbsoluteFill>;
registerRoot(() => <Composition id="Gal" component={Gal} durationInFrames={N * 100} fps={30} width={1920} height={1080} />);
