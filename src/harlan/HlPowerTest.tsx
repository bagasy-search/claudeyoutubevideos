import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HlPowerTree, HlDamageScale, HlServiceDrop } from "./HlPower";
const D = 240;
const ITEMS = [
  <HlPowerTree />,
  <HlDamageScale items={[{ label: "nothing broken", time: "soon", w: 0.15 }, { label: "limb on the line", time: "1-2 hours", w: 0.25 }, { label: "wire down", time: "a few hours", w: 0.4 }, { label: "broken pole", time: "most of a day", w: 0.65 }, { label: "many poles down", time: "days", w: 1 }]} />,
  <HlServiceDrop />,
];
export const POWER_TEST_FRAMES = ITEMS.length * D;
export const HlPowerTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
