import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HkIslandHop, HkThermalCount, HkFenceSplit, HkRunoff } from "./HkMaui";
const D = 180;
const ITEMS = [
  <HkIslandHop stops={[{ island: "Molokai", year: "1867", note: "8 deer, a gift to the king" }, { island: "Lanai", year: "1920", note: "moved for hunting" }, { island: "Maui", year: "1959", note: "brought in for sport" }, { island: "Big Island", year: "2009", note: "snuck over", alert: true }]} />,
  <HkThermalCount />,
  <HkFenceSplit />,
  <HkRunoff />,
];
export const MAUI_TEST_FRAMES = ITEMS.length * D;
export const HkMauiTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
