// Control de render del kit del jamón en el farm: cada componente nuevo 3 s. Uso: ENTRY=src/index_lorham.tsx composición LorHamKitTest.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LorHam3D } from "./LorHam3D";
import { LorRoaster3D } from "./LorRoaster3D";
import { LorThermometer } from "./LorThermometer";

export const HAM_KIT_TEST_FRAMES = 6 * 90;
export const LorHamKitTest: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}><LorHam3D stage="score" title="Score the fat" sub="diamonds, a quarter inch deep" /></Sequence>
    <Sequence from={90} durationInFrames={90}><LorHam3D stage="juice" title="The last thing" sub="spoon the juices over the slices" /></Sequence>
    <Sequence from={180} durationInFrames={90}><LorRoaster3D stage="juice" title="One cup of juice" sub="apple, pineapple, or just water" /></Sequence>
    <Sequence from={270} durationInFrames={90}><LorRoaster3D stage="foil" title="Crimp it tight" sub="the cup of juice becomes steam" /></Sequence>
    <Sequence from={360} durationInFrames={90}><LorThermometer from={70} stops={[{ temp: 120, label: "Glaze time" }, { temp: 140, label: "Done" }]} title="Probe in the thickest part" sub="not touching the bone" /></Sequence>
    <Sequence from={450} durationInFrames={90}><LorThermometer from={120} stops={[{ temp: 140, label: "Hot, safe, juiciest" }, { temp: 160, label: "Too far" }]} title="Fully cooked ham" sub="warm it to 140°F" /></Sequence>
  </AbsoluteFill>
);
