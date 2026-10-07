// prueba local de OpThermo
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OpThermo } from "./OpThermo";
const D = 180;
const ITEMS = [<OpThermo from={28} to={-15} label="last January" sub="12 hens · no heat lamp" />];
export const WINTER_TEST_FRAMES = ITEMS.length * D;
export const OpWinterTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
