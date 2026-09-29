import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OleFourQuestions, OleBuyChecklist, OleSeasoningSteps, OleChipMap, OleTempLadder, OleLeadCard, OleCostTier, OleLesson } from "./OlePotCards";
const items: [number, React.ReactNode][] = [
  [180, <OleFourQuestions kicker="FOUR QUESTIONS" items={[{ glyph: "heat", label: "Does it hold heat?" }, { glyph: "spread", label: "Does it spread it?" }, { glyph: "fix", label: "Can I fix it?" }, { glyph: "lid", label: "Does the lid fit?" }]} />],
  [180, <OleBuyChecklist title="At the flea market" rows={[{ label: "Spin it on the counter", sub: "rocks? put it back", verdict: "no" }, { label: "Knuckle on the rim", sub: "clear ring = sound", verdict: "ok" }, { label: "Surface rust", sub: "comes right off", verdict: "ok" }, { label: "A crack", sub: "never fixable", verdict: "no" }]} />],
  [180, <OleSeasoningSteps steps={[{ label: "Warm the pan", sub: "so the pores open" }, { label: "One drop of oil", sub: "wipe it off like a mistake" }, { label: "Bake it upside down", sub: "1 hour, foil below" }, { label: "Let it cool inside" }, { label: "Repeat 3 to 5 times" }]} dial={{ to: 450, label: "450 to 500°F" }} />],
  [180, <OleChipMap title="enamel stockpot" okLabel="outside: fine" noLabel="inside: retire it" chips={[{ x: 200, y: 330, where: "outside" }, { x: 640, y: 470, where: "inside" }]} />],
  [200, <OleTempLadder kicker="NONSTICK COATING" rungs={[{ at: 350, label: "Normal cooking", tone: "cool" }, { at: 500, label: "The maker's limit", tone: "warn" }, { at: 660, label: "It really breaks down", tone: "hot" }]} source="SOURCE: MAKER'S OWN SAFETY GUIDANCE" focusAt={620} />],
  [180, <OleLeadCard tag="FDA ADVICE" title="Pottery of unknown origin" bullets={["Handmade or crude-looking", "Flea market or street stall", "Bright orange, red or yellow", "Acidic food pulls out more"]} source="SOURCE: U.S. FDA, LEAD-GLAZED TRADITIONAL POTTERY" />],
  [90, <AbsoluteFill style={{ background: "#5a3f27" }}><OleCostTier tier={2} caption="not a price" x={0.5} y={0.5} /></AbsoluteFill>],
  [180, <AbsoluteFill style={{ background: "#5a3f27" }}><OleLesson kicker="WHAT FORTY YEARS TAUGHT ME" text="Buy it once. Take care of it." /></AbsoluteFill>],
];
export const CARDS_KIT_FRAMES = items.reduce((a, [d]) => a + d, 0);
export const CARD_STARTS = items.reduce<number[]>((a, [d], i) => (a.push(i ? a[i - 1] + items[i - 1][0] : 0), a), []);
export const OleCardsKitTest: React.FC = () => <AbsoluteFill>{items.map(([d, el], i) => <Sequence key={i} from={CARD_STARTS[i]} durationInFrames={d}>{el}</Sequence>)}</AbsoluteFill>;
