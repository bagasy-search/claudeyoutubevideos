// Banco de prueba de los componentes de huevo (render de control en el farm antes del video: mide el costo de los 3D).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LorEgg3D } from "./LorEgg3D";
import { LorDevilTray3D } from "./LorDevilTray3D";
import { LorYolkCrossSection } from "./LorYolkCrossSection";
import { LorEggTimer } from "./LorEggTimer";
import { LorSieve } from "./LorSieve";
import { LorTwoHourClock } from "./LorTwoHourClock";
import { LorEggCarton } from "./LorEggCarton";
import { LorSchedule } from "./LorSchedule";
import { LorMeasure } from "./LorCards";

const items: [number, React.ReactNode][] = [
  [150, <LorEgg3D mode="halve" cutAt={36} title="Thirteen minutes" sub="lid on, heat off" />],
  [150, <LorEgg3D mode="compare" cutAt={34} labelA="20 minutes, rolling boil" labelB="13 minutes, lid on" />],
  [220, <LorDevilTray3D count={24} label="halves" title="One dozen eggs" sub="twenty-four halves" />],
  [150, <LorYolkCrossSection stage="overcooked" title="The gray-green ring" sub="harmless, but you can taste it" callouts={[{ at: 40, text: "iron from the yolk", x: 0.2, y: 0.42 }, { at: 56, text: "sulfur from the white", x: 0.8, y: 0.42 }, { at: 76, text: "= overcooked", x: 0.5, y: 0.9, color: "#C8323A" }]} />],
  [180, <LorEggTimer steps={[{ kind: "pot", minutes: 13, label: "Lid on. Heat off.", sub: "large eggs" }, { kind: "ice", minutes: 15, label: "Into the ice water", sub: "stops the cooking" }]} stepFrames={90} />],
  [150, <LorSieve title="Sieve it, don't mash it" smooth="smooth as sand" lumpy="a fork leaves lumps" note="mayonnaise comes last" />],
  [140, <LorTwoHourClock title="Two hours, no more" hotNote="over 90°F: one hour" coldNote="fridge: 40°F or colder" />],
  [150, <LorEggCarton title="A little bed for every egg" note="they can't slide" />],
  [160, <LorSchedule title="Mrs. Halvorsen's schedule" days={[{ day: "Thursday", sub: "2 days before", items: ["boil 13 minutes", "ice bath 15", "chill in the shell"] }, { day: "Friday", sub: "night before", items: ["peel and cut", "sieve the yolks", "whites and filling apart"] }, { day: "Saturday", sub: "supper day", items: ["fill the whites", "paprika", "keep them cold"], mark: true }]} />],
  [120, <LorMeasure title="One dozen eggs" items={[{ amt: "½ cup", what: "mayonnaise" }, { amt: "2 tsp", what: "yellow mustard" }, { amt: "1 Tbsp", what: "pickle juice" }]} />],
];
export const EGG_KIT_TEST_FRAMES = items.reduce((a, [d]) => a + d, 0);
export const LorEggKitTest: React.FC = () => {
  let t = 0;
  return <AbsoluteFill style={{ backgroundColor: "#E9DCC0" }}>{items.map(([d, el], i) => { const from = t; t += d; return <Sequence key={i} from={from} durationInFrames={d}>{el}</Sequence>; })}</AbsoluteFill>;
};
