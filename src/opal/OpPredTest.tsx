// prueba local de OpSuspects / OpWire3D
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OpSuspects, OpWire3D } from "./OpSuspects";
const D = 150;
const C = [{ who: "Raccoon", clue: "head & crop eaten, by the wire" }, { who: "Opossum", clue: "one bird, eaten from behind" }, { who: "Skunk", clue: "eggs opened at one end" }, { who: "Fox", clue: "one hen gone, feather trail" }, { who: "Hawk", clue: "circle of plucked feathers" }, { who: "Mink", clue: "many killed, bite at the neck" }];
const ITEMS = [<OpSuspects cards={C} culprit={5} every={6} strikeAt={60} />, <OpWire3D />];
export const PRED_TEST_FRAMES = ITEMS.length * D;
export const OpPredTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
