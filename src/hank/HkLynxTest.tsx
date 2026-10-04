import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HkHighlandMap, HkFourCaught, HkGoneSince } from "./HkLynx";
const D = 240;
const ITEMS = [<HkHighlandMap />, <HkFourCaught />, <HkGoneSince items={[{ name: "lynx", gone: "500-1,300 years" }, { name: "wolf", gone: "centuries" }, { name: "bear", gone: "over 1,000 years" }, { name: "beaver", gone: "centuries", back: "River Tay · nobody asked", good: false }, { name: "wildcat", gone: "almost", back: "released the legal way", good: true }]} />];
export const LYNX_TEST_FRAMES = ITEMS.length * D;
export const HkLynxTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
