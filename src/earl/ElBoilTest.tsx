import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ElBoilClock, ElFlavorInside, ElPeel3 } from "./ElBoil";
const D = 220;
const ITEMS = [
  <ElBoilClock steps={[{ label: "potatoes", time: "15 min", color: "#C9A26B" }, { label: "sausage + corn", time: "5-7 min", color: "#E8C547" }, { label: "shrimp", time: "2-3 min", color: "#F08A5D" }]} />,
  <ElFlavorInside />,
  <ElPeel3 />,
];
export const BOIL_TEST_FRAMES = ITEMS.length * D;
export const ElBoilTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
