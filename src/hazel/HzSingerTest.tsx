import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HzSerialPlate, HzMachineShelf, HzDecalWipe } from "./HzSinger";
const D = 180;
const ITEMS = [
  <HzSerialPlate />,
  <HzMachineShelf items={[{ name: "cabinet machine", price: "$40-150" }, { name: "Featherweight 221", price: "$300-600", small: true }, { name: "pale green 221K", price: "$1,000+", small: true, color: "#bfd3c0", hi: true }, { name: "222K free arm", price: "more", small: true, freearm: true }, { name: "Singer 301", price: "$150-300", color: "#c9b48e" }]} />,
  <HzDecalWipe />,
];
export const SINGER_TEST_FRAMES = ITEMS.length * D;
export const HzSingerTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
