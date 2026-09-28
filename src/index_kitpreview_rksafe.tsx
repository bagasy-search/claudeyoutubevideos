// index_kitpreview_rksafe.tsx — VISTA PREVIA del kit `rksafe` para verificar componentes con stills
// ANTES del farm (entrada, medio, salida). No es un video: una composición por componente.
//   npx remotion still src/index_kitpreview_rksafe.tsx <Id> out.png --frame=<n>
import "./index.css";
import React from "react";
import { Composition, registerRoot } from "remotion";
import { LearnButtonWipe } from "./rksafe/LearnButtonWipe";
import { RemoteTally } from "./rksafe/RemoteTally";
import { LastDoorCutaway } from "./rksafe/LastDoorCutaway";
import { RollingCodeWaves } from "./rksafe/RollingCodeWaves";
import { DipSwitchReveal } from "./rksafe/DipSwitchReveal";
import { HomeLinkClear } from "./rksafe/HomeLinkClear";
import { VideoRefCard } from "./rksafe/VideoRefCard";
import { ProcessChips } from "./rksafe/ProcessChips";
import { ScrewHero } from "./rksafe/ScrewHero";
import { RayCta } from "./rksafe/RayCta";
import { RayTrans } from "./rksafe/RayTrans";
import { Foto } from "./rksafe/RayStage";

const S = 30;
const C = (id: string, dur: number, el: (d: number) => React.ReactNode) => (
  <Composition key={id} id={id} component={() => <>{el(dur * S)}</>} durationInFrames={dur * S} fps={S} width={1920} height={1080} />
);
const SL = [{ text: "Remote" }, { text: "Remote" }, { text: "Keypad" }, { text: "Car" }, { text: "???" }];

const Root: React.FC = () => (
  <>
    {C("LbwList", 7, (d) => <LearnButtonWipe durationInFrames={d} mode="list" kicker="THE MOTOR REMEMBERS" title="Every remote, ever" slots={SL} />)}
    {C("LbwFind", 8, (d) => <LearnButtonWipe durationInFrames={d} mode="find" kicker="FIX 2 · FREE" title="Find the learn button" slots={SL} />)}
    {C("LbwWipe", 10, (d) => <LearnButtonWipe durationInFrames={d} mode="wipe" kicker="HOLD ~6 SECONDS" title="The list is gone" slots={SL} />)}
    {C("Tally", 8, (d) => <RemoteTally durationInFrames={d} kicker="WHO'S ON IT" final="?" items={[{ text: "Family before" }, { text: "Dog walker" }, { text: "Contractor" }, { text: "Neighbor" }, { text: "Old car" }]} />)}
    {C("DoorUnlocked", 7, (d) => <LastDoorCutaway durationInFrames={d} stage="unlocked" />)}
    {C("DoorScrews", 8, (d) => <LastDoorCutaway durationInFrames={d} stage="screws" kicker="LONG SCREWS" title="Into the stud" />)}
    {C("DoorBolt", 8, (d) => <LastDoorCutaway durationInFrames={d} stage="deadbolt" kicker="FIX 6" title="Want the bolt" />)}
    {C("CodeFixed", 8, (d) => <RollingCodeWaves durationInFrames={d} mode="fixed" kicker="FIXED CODE" verdict="Same every time. Repeatable." />)}
    {C("CodeBoth", 9, (d) => <RollingCodeWaves durationInFrames={d} mode="both" kicker="NEWER OPENERS" verdict="Yesterday's click is worthless." />)}
    {C("Dip", 8, (d) => <DipSwitchReveal durationInFrames={d} />)}
    {C("HomeRisk", 8, (d) => <HomeLinkClear durationInFrames={d} mode="risk" />)}
    {C("HomeClear", 9, (d) => <HomeLinkClear durationInFrames={d} mode="clear" kicker="BEFORE YOU SELL IT" title="Clear the buttons" />)}
    {C("RefCard", 6, (d) => <VideoRefCard durationInFrames={d} kicker="WATCH NEXT" sub="Same idea" />)}
    {C("Chips7", 6, (d) => <ProcessChips durationInFrames={d} kicker="SEVEN FIXES" title="Cheapest first" steps={["Count", "Erase", "Keypad", "Car", "Screws", "Deadbolt", "Opener"].map((t) => ({ title: t }))} />)}
    {C("Screw", 6, (d) => <ScrewHero durationInFrames={d} kicker="THE THREE DOLLAR PART" title="$3" sub="Three-inch screws, into the stud." pieces={[{ kind: "bolt", x: 20, scale: 0.86, rot: -14 }, { kind: "stubby", x: 39, scale: 0.9, rot: 8 }, { kind: "wood", x: 58, scale: 1.05, rot: -6, hero: true }, { kind: "nail", x: 79, scale: 0.82, rot: 18 }]} />)}
    {C("Cta", 14, (d) => <RayCta durationInFrames={d} eyebrow="THE THOUSAND DOLLAR AFTERNOON" title="Three guides, one afternoon" sub="The door, the late-night call, fixes that cost nothing. $27 · 30-day refund." domain="raykessler.vercel.app" qr="img/rkremote_qr.png" showQr />)}
  </>
);
registerRoot(Root);
