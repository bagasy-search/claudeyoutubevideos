// prueba local de OpTally (pizarra de errores + resumen)
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OpTally } from "./OpTally";
const D = 150;
const ROWS = [{ n: 9, title: "the wrong roost", lost: 1 }, { n: 8, title: "too many treats", lost: 1 }, { n: 7, title: "no oyster shell", lost: 2 }, { n: 6, title: "too many roosters", lost: 2 }, { n: 5, title: "a wet coop", lost: 4 }, { n: 4, title: "shut up too tight", lost: 3 }, { n: 3, title: "chicken wire", lost: 7 }, { n: 2, title: "the heat lamp", lost: 9 }, { n: 1, title: "no quarantine", lost: 11 }];
const ITEMS = [<OpTally n={2} title="the heat lamp" lost={9} fix="no lamp, a dry coop" cost="$0" total={20} />, <OpTally rows={ROWS} />];
export const NINE_TEST_FRAMES = ITEMS.length * D;
export const OpNineTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
