import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HzBoxOpen, HzGoldStamps, HzCameoLight } from "./HzJewel";
const D = 240;
const ITEMS = [
  <HzBoxOpen items={[{ label: "walnut box", price: "$50-200" }, { label: "mourning brooch (jet)", price: "$100s" }, { label: "shell cameo, 14K", price: "$100-300" }, { label: "pocket watch, GF", price: "~$100" }, { label: "old mine diamond ring", price: "~$1,000+", hi: true }]} />,
  <HzGoldStamps rows={[{ stamp: "14K", means: "solid gold", gold: 0.58, tag: "also 585 · 417 · 750" }, { stamp: "GF", means: "gold filled", gold: 0.05, tag: "a thin layer bonded on" }, { stamp: "GP", means: "gold plated", gold: 0.005, tag: "almost no gold" }, { stamp: "—", means: "no stamp?", gold: 0, tag: "old pieces: have it tested" }]} />,
  <HzCameoLight />,
];
export const JEWEL_TEST_FRAMES = ITEMS.length * D;
export const HzJewelTest: React.FC = () => <AbsoluteFill style={{ background: "#3b2a1c" }}>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
