import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ElPriceChain, ElHeadsOff, ElBagReader } from "./ElDock";
const D = 300;
const ITEMS = [
  <ElPriceChain stops={[{ label: "the dock", price: "$5" }, { label: "heads off", price: "$7.50" }, { label: "plant + freezer", price: "$9" }, { label: "trucks", price: "$10.50" }, { label: "wholesaler", price: "$12" }, { label: "the store", price: "$16" }]} />,
  <ElHeadsOff />,
  <ElBagReader lines={[{ k: "Product of USA", v: "country of origin" }, { k: "Wild caught", v: "or farm raised" }, { k: "Ingredients: shrimp, salt", v: "one ingredient" }, { k: "16/20 per lb", v: "the count" }]} />,
];
export const DOCK_TEST_FRAMES = ITEMS.length * D;
export const ElDockTest: React.FC = () => <AbsoluteFill style={{ background: "#132842" }}>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
