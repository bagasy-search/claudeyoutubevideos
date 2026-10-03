// prueba local de componentes nuevos de Earl
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ElMercuryLadder } from "./ElMercury";
const D = 150;
const ITEMS = [<ElMercuryLadder fish={[{ name: "shrimp", len: 0.02, drops: 1 }, { name: "flounder", len: 0.2, drops: 1 }, { name: "Spanish mackerel", len: 0.35, drops: 2 }, { name: "king mackerel", len: 0.6, drops: 5 }, { name: "shark", len: 0.85, drops: 6 }]} every={18} flagFrom={3} />];
export const NIGHT_TEST_FRAMES = ITEMS.length * D;
export const ElNightTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
