import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HkBallotMap, HkCollarTrack, HkFladry } from "./HkWolf";
const D = 180;
const ITEMS = [<HkBallotMap />, <HkCollarTrack />, <HkFladry />];
export const WOLF_TEST_FRAMES = ITEMS.length * D;
export const HkWolfTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
