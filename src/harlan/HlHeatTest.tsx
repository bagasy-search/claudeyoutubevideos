import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HlStripHeat, HlCircuitLoad, HlThreeFeet } from "./HlHeat";
const D = 180;
const ITEMS = [
  <HlStripHeat />,
  <HlCircuitLoad items={[{ label: "space heater", amps: 12.5 }, { label: "hair dryer", amps: 10 }]} />,
  <HlThreeFeet />,
];
export const HEAT_TEST_FRAMES = ITEMS.length * D;
export const HlHeatTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
