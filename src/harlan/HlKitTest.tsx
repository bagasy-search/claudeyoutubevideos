import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HlIceLoad, HlWarmRoom, HlBackfeed, HlRestoreOrder, HlCoinCup } from "./HlKit";
const D = 180;
const ITEMS = [<HlIceLoad />, <HlWarmRoom />, <HlBackfeed />, <HlRestoreOrder />, <HlCoinCup />];
export const HL_TEST_FRAMES = ITEMS.length * D;
export const HlKitTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
