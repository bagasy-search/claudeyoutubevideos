// Pruebas de Set2 (stills): una composición por componente con props de ejemplo.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { HourDial, RockList, ClayBind, GapLine } from "./Set2";
const B = "ah/test/full_elder.jpg";
const tests: { id: string; dur: number; el: React.FC }[] = [
  { id: "T-Dial", dur: 150, el: () => <HourDial value={10} prev={6} title="THE POISON WAKES UP" bed={B} pulse /> },
  { id: "T-DialR", dur: 150, el: () => <HourDial value={0} prev={0} title="THE BITE" bed="ah/test/full_boy.jpg" side="right" /> },
  { id: "T-List", dur: 200, el: () => <RockList title="HER LIST" items={[{ text: "THAT ROOT · TWO DAYS SICK", mark: "dead" }, { text: "BITTER LEAF · FOR THE GUT", mark: "maybe" }, { text: "BOILED ROOTS · SAFE", mark: "safe" }]} bed={B} /> },
  { id: "T-Clay", dur: 240, el: () => <ClayBind title="CLAY GRABS THE POISON" sub="like iron filings to a magnet" bed={B} /> },
  { id: "T-Gap", dur: 200, el: () => <GapLine a="THE BITE" b="SICK" hours={10} note="So what do you blame?" bed={B} /> },
];
const Root: React.FC = () => <>{tests.map((t) => <Composition key={t.id} id={t.id} component={t.el} durationInFrames={t.dur} fps={30} width={1920} height={1080} />)}</>;
registerRoot(Root);
