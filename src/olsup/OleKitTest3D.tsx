import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OleCookhouse3D, CookhouseDish } from "./OleCookhouse3D";
import { OleBeanhole3D, beanholeFrames } from "./OleBeanhole3D";
import { OleStove3D } from "./OleStove3D";

const KINDS = ["stew", "pie", "bread", "beans", "soup", "fried", "pancakes", "pudding", "roast", "hash", "cookies"] as const;
export const TEST_DISHES: CookhouseDish[] = Array.from({ length: 30 }, (_, i) => ({ n: i + 1, kind: KINDS[i % KINDS.length], at: 1.2 + i * 1.6 }));
const SERVED = (ns: number[]): CookhouseDish[] => ns.map((n) => ({ n, kind: KINDS[(n - 1) % KINDS.length], at: 0 }));
const ALL11 = SERVED([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
const items: [number, React.ReactNode][] = [
  [1500, <OleCookhouse3D dishes={TEST_DISHES} />],
  [240, <OleCookhouse3D intro focusN={1} dishes={[...SERVED([1, 2, 3, 4]), { n: 5, kind: "stew", at: 3 }]} />],
  [240, <OleCookhouse3D focusN={13} camTo={22} dishes={SERVED([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])} />],
  ...KINDS.map((_, k) => [30, <OleCookhouse3D focusN={k + 1} dishes={ALL11} />] as [number, React.ReactNode]),
  [beanholeFrames(80), <OleBeanhole3D />],
  [beanholeFrames(80, 4), <OleBeanhole3D startStep={4} />],
  [180, <OleStove3D />],
  [90, <OleCookhouse3D intro focusN={7} signs={[{ text: "Supper at 5", where: "end" }]} dishes={SERVED([5, 6, 7, 8])} />],
];
export const KIT3D_FRAMES = items.reduce((a, [d]) => a + d, 0);
export const OleKitTest3D: React.FC = () => {
  let t = 0;
  return <AbsoluteFill style={{ backgroundColor: "#140b06" }}>{items.map(([d, el], i) => { const from = t; t += d; return <Sequence key={i} from={from} durationInFrames={d}>{el}</Sequence>; })}</AbsoluteFill>;
};
