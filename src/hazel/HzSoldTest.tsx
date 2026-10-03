import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HzCabinetScale, HzBottomMark, HzListedVsSold } from "./HzSold";
const D = 180;
const ITEMS = [
  <HzCabinetScale left={[{ label: "Hummels", price: "$10-50" }, { label: "Waterford", price: "$20-60" }, { label: "bone china", price: "$50-150" }, { label: "Beanie Babies", price: "$1-5" }]} right={{ label: "mid-century dresser + 2 tables", price: "more than all of it" }} />,
  <HzBottomMark mark="GOEBEL" sub="W. Germany" marks={[{ name: "crown mark", years: "before 1950", good: true }, { name: "full bee", years: "1950s", good: true }, { name: "later marks", years: "1960s on", good: false }]} />,
  <HzListedVsSold item="Princess Diana bear" listed="$10,000" sold="$5" note="look at SOLD listings" />,
];
export const SOLD_TEST_FRAMES = ITEMS.length * D;
export const HzSoldTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
