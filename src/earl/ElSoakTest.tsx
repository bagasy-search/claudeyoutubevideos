import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ElSoakSwell, ElPanDuel, ElColdChain, ElCurlRule } from "./ElSoak";
const D = 180;
const ITEMS = [
  <ElCurlRule />,
  <ElSoakSwell />,
  <ElPanDuel />,
  <ElColdChain stops={[{ label: "net comes up", sub: "dump on the table", icon: "net" }, { label: "pick fast", sub: "sorting table", icon: "table" }, { label: "ice · brine · freezer", sub: "right on the boat", icon: "ice" }, { label: "home, heads on", sub: "packed in ice", icon: "home" }]} />,
];
export const SOAK_TEST_FRAMES = ITEMS.length * D;
export const ElSoakTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
