// Pruebas del kit ahnight (stills): una composición por componente con props reales de ejemplo.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { TalkBars, Recap, NightClock, YouThem, Counter, StudyCard, Callout, SleepBars, SentinelRing, MoonTally, Words, PlaceStamp, Embers, ClockBug } from "./Kit";
import { Globe3D } from "./Globe3D";
import { AbsoluteFill } from "remotion";
import { Media } from "../yc/Media";

const B = "ah/test/hunter_a.jpg";
const On: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill><Media src={B} kb="in" />{children}</AbsoluteFill>;
const tests: { id: string; dur: number; el: React.FC }[] = [
  { id: "T-Clock", dur: 150, el: () => <NightClock time="6:48 PM" title="THE SUN IS GONE" prev="5:30 PM" bed={B} n={1} /> },
  { id: "T-Clock3", dur: 150, el: () => <NightClock time="3:14 AM" title="THE HOUR OF THE HYENA" prev="1:00 AM" bed="ah/test/elder_b.jpg" n={7} /> },
  { id: "T-YouThem", dur: 120, el: () => <YouThem you={{ src: "ah/test/boy_b.jpg", tag: "YOU · 2026", line: "Scrolling until 1 AM" }} them={{ src: "ah/test/elder_b.jpg", tag: "THEM · 38,000 BC", line: "Listening until the fire dies" }} /> },
  { id: "T-Counter", dur: 120, el: () => <Counter to={220} suffix=" h" label="HOURS OF NIGHTS RECORDED" sub="HADZA · TANZANIA · 2017" bed={B} /> },
  { id: "T-Study", dur: 180, el: () => <StudyCard quote="At night, the talk turned to stories." stat="81% OF FIRELIGHT TALK" source="WIESSNER · PNAS · 2014" bed="ah/test/elder_b.jpg" /> },
  { id: "T-Callout", dur: 90, el: () => <On><Callout x={640} y={300} label="HEALED SCAR" sub="HUNTING WASN'T SAFE" /></On> },
  { id: "T-Sleep", dur: 150, el: () => <SleepBars title="WHEN DO YOU FALL ASLEEP?" rows={[{ label: "YOU", from: 23.5, to: 7, you: true, note: "screens off at 11:30 PM" }, { label: "THEM", from: 22.1, to: 5.9, note: "~3.3 h after sunset" }]} marks={[{ at: 18.8, label: "SUNSET" }, { at: 6.3, label: "SUNRISE" }]} source="YETISH ET AL. · CURRENT BIOLOGY · 2015" /> },
  { id: "T-Sentinel", dur: 240, el: () => <SentinelRing n={12} title="SOMEONE IS ALWAYS AWAKE" stat="18 MINUTES" statSub="ALL ASLEEP AT ONCE, IN 220 HOURS" source="SAMSON ET AL. · PROC. R. SOC. B · 2017" /> },
  { id: "T-Moon", dur: 150, el: () => <MoonTally title="THE FIRST CALENDAR?" caption="Notches that may count the Moon" bed="ah/test/hunter_b.jpg" source="LEBOMBO BONE · ~43,000 YEARS · DEBATED" /> },
  { id: "T-Words", dur: 90, el: () => <Words text="WHAT DID THEY DO ALL NIGHT?" keys={["NIGHT"]} bed={B} /> },
  { id: "T-Place", dur: 90, el: () => <On><PlaceStamp place="ARDÈCHE VALLEY, FRANCE" when="38,000 BC · 6:48 PM" /><ClockBug time="9:30 PM" label="STORY TIME" /></On> },
  { id: "T-Embers", dur: 60, el: () => <On><Embers /></On> },
  { id: "T-Talk", dur: 150, el: () => <TalkBars title="WHAT DID THEY TALK ABOUT?" day={[{ label: "ECONOMIC MATTERS", pct: 31 }, { label: "COMPLAINTS & GOSSIP", pct: 34 }, { label: "JOKES", pct: 16 }, { label: "STORIES", pct: 6, hot: true }, { label: "OTHER", pct: 13 }]} night={[{ label: "STORIES", pct: 81, hot: true }, { label: "OTHER", pct: 19 }]} source="WIESSNER · PNAS · 2014" /> },
  { id: "T-Recap", dur: 150, el: () => <On><Recap title="ALL NIGHT, THEY..." items={["ATE", "FED THE FIRE", "MADE CLOTHES", "SLEPT ~7 HOURS", "TOLD STORIES"]} t0={0} t1={15} t2={30} t3={45} t4={60} /></On> },
  { id: "T-Globe", dur: 300, el: () => <Globe3D sub="38,000 BC" /> },
];
const Root: React.FC = () => <>{tests.map((t) => <Composition key={t.id} id={t.id} component={t.el} durationInFrames={t.dur} fps={30} width={1920} height={1080} />)}</>;
registerRoot(Root);
