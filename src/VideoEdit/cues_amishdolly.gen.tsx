// cues_amishdolly.gen.tsx — GENERADO por beatsheet.mjs desde amishdolly.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/amishdolly.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { StatBig } from "./scenes/StatBig";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { BarCompare } from "./scenes/BarCompare";
import { Checklist } from "./scenes/Checklist";
import { CalloutMark } from "./scenes/CalloutMark";
import { MistakeCard } from "./scenes/MistakeCard";
import { NextVideoEndcard } from "./scenes/NextVideoEndcard";
import { KeyPhrase } from "./scenes/KeyPhrase";

const G = COLORS.good, B = COLORS.cold;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "ad_h_dolly", start: 1.8, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_dolly.png" darken={0} /> },
  { key: "ad_h_freezer", start: 4.4, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_freezer.png" darken={0} /> },
  { key: "ad_h_impact", start: 6.8, dur: 4.4, kind: "impact", el: (d) => <ImpactReveal durationInFrames={d} image="img/amishdolly/ad_h_freezer.png" impact="Two fingers." setup="Four hundred pounds." impactAccent="good" hitAt={2} boom={0} darken={0.42} /> },
  { key: "ad_h_casters", start: 11.2, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_casters.png" darken={0} /> },
  { key: "ad_h_key1", start: 13.6, dur: 3.4, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="One man. Alone." src="img/amishdolly/ad_h_key1.png" accent="good" fontSize={104} /> },
  { key: "ad_h_barrel", start: 17, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_barrel.png" darken={0} /> },
  { key: "ad_h_anvil", start: 19.6, dur: 2.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_anvil.png" darken={0} /> },
  { key: "ad_h_key2", start: 22, dur: 3.6, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="A board and four wheels." src="img/amishdolly/ad_h_key2.png" accent="cold" fontSize={88} /> },
  { key: "ad_h_child", start: 25.6, dur: 3.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_child.png" darken={0} /> },
  { key: "ad_h_engineer", start: 28.6, dur: 3.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_engineer.png" darken={0} /> },
  { key: "ad_h_impact2", start: 31.8, dur: 4.2, kind: "impact", el: (d) => <ImpactReveal durationInFrames={d} image="img/amishdolly/ad_h_dolly.png" impact="But it does." setup="It shouldn't work that well." impactAccent="good" hitAt={2.1} boom={0} darken={0.42} /> },
  { key: "ad_h_notch", start: 36, dur: 3.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_notch.png" darken={0} /> },
  { key: "ad_h_key3", start: 38.6, dur: 3.4, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Genius. And it's homemade." src="img/amishdolly/ad_h_key3.png" accent="good" fontSize={92} /> },
  { key: "ad_h_stack", start: 42, dur: 2.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/ad_h_stack.png" darken={0} /> },
  { key: "s_16", start: 62.7, dur: 6.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_16.png" darken={0} /> },
  { key: "s_18", start: 68.76, dur: 7.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_18.jpg" darken={0} /> },
  { key: "cmp_wanted", start: 75.96, dur: 8.02, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="It only ever wanted to roll" items={["Four grown men couldn't budge the stove","The old man slid a board under it","A ten-year-old pushed it across the barn","You were trying to carry it — it wanted to roll"]} accent={G} /> },
  { key: "cmp_load", start: 83.98, dur: 7.76, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={400} suffix=" lb" label="a loaded chest freezer rolling under one hand, two fingers — like it's an empty box" eyebrow="One man moves" accent="good" hue="amber" /> },
  { key: "cmp_shouldnt", start: 91.74, dur: 12.26, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="That should not work" image="img/amishdolly/cmp_shouldnt_bg.png" eyebrow="The engineer's reaction" caption="a real engineer stood there shaking his head — a board and four wheels moving what four men couldn't" accent="good" hue="amber" /> },
  { key: "s_33", start: 160.94, dur: 4.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_33.png" darken={0} /> },
  { key: "s_34", start: 165.32, dur: 5.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_34.png" darken={0} /> },
  { key: "s_35", start: 170.22, dur: 5.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_35.png" darken={0} /> },
  { key: "cmp_madeof", start: 175.48, dur: 13.62, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} image="img/amishdolly/cmp_madeof_bg.png" title="The whole genius invention" chips={["one thick board","four swivel wheels","sixteen bolts","a hand-notch"]} hue="amber" /> },
  { key: "s_39", start: 189.1, dur: 6.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_39.png" darken={0} /> },
  { key: "s_40", start: 195.54, dur: 7.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_40.png" darken={0} /> },
  { key: "s_41", start: 202.26, dur: 7.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_41.png" darken={0} /> },
  { key: "cmp_dragroll", start: 209.54, dur: 9.9, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Drag vs. Roll" image="img/amishdolly/cmp_dragroll_bg.png" eyebrow="The one question" caption="sliding, you fight the whole weight pressed flat on the floor; rolling, you only ever fight the little wheel" accent="good" hue="amber" /> },
  { key: "s_44", start: 219.44, dur: 5.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_44.png" darken={0} /> },
  { key: "s_45", start: 224.42, dur: 5.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_45.png" darken={0} /> },
  { key: "cmp_dragbars", start: 229.86, dur: 9.74, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Drag it flat","value":300,"display":"you can't budge it"},{"label":"Roll it on casters","value":6,"display":"two fingers","winner":true}]} eyebrow="Slide it vs roll it" title="Force to move 400 lb" unit=" lb" accent="good" hue="amber" /> },
  { key: "s_48", start: 239.6, dur: 7.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_48.png" darken={0} /> },
  { key: "s_49", start: 246.84, dur: 6.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_49.png" darken={0} /> },
  { key: "s_50", start: 252.7, dur: 6.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_50.mp4" darken={0} clipDur={11.52} /> },
  { key: "s_51", start: 258.44, dur: 7.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_51.png" darken={0} /> },
  { key: "cmp_neverdrag", start: 265.64, dur: 12.48, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="A wheel never drags" items={["A flat load grabs the floor across its whole face","A wheel touches one tiny spot","It rolls that spot on and picks up a fresh one","So you fight the wheel — not the weight"]} accent={B} /> },
  { key: "s_54", start: 278.12, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_54.png" darken={0} /> },
  { key: "s_55", start: 282.52, dur: 7.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_55.png" darken={0} /> },
  { key: "s_56", start: 289.88, dur: 7.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_56.png" darken={0} /> },
  { key: "cmp_100x", start: 296.76, dur: 9.44, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={100} suffix="× easier" label="on good casters and a smooth floor, rolling beats dragging by about a hundred to one — not twice, a hundred times" eyebrow="Roll vs drag" accent="good" hue="cold" /> },
  { key: "s_60", start: 306.2, dur: 6.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_60.png" darken={0} /> },
  { key: "cmp_suitcase", start: 312.62, dur: 6.52, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="You already know this" image="img/amishdolly/cmp_suitcase_bg.png" eyebrow="Everyday proof" caption="the same packed suitcase — add two little wheels and a child tows it, humming. Nothing changed but where the weight meets the ground" accent="good" hue="amber" /> },
  { key: "s_63", start: 319.14, dur: 5.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_63.png" darken={0} /> },
  { key: "s_64", start: 324.32, dur: 5.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_64.png" darken={0} /> },
  { key: "s_65", start: 329.78, dur: 6.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_65.png" darken={0} /> },
  { key: "s_66", start: 335.68, dur: 7.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_66.png" darken={0} /> },
  { key: "cmp_floorchips", start: 342.7, dur: 6.16, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} image="img/amishdolly/cmp_floorchips_bg.png" title="Where it rolls like a dream" chips={["concrete","wood floor","tile","smooth barn floor"]} hue="amber" /> },
  { key: "s_69", start: 348.86, dur: 6.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_69.mp4" darken={0} clipDur={6.2} /> },
  { key: "s_70", start: 354.96, dur: 5.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_70.png" darken={0} /> },
  { key: "s_71", start: 360.44, dur: 7.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_71.png" darken={0} /> },
  { key: "cmp_rough", start: 367.3, dur: 6.78, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="!" title="Size up the wheels" desc="On soft dirt, thick gravel or deep grass small wheels sink in and it fights you. A big wheel rolls over the bump a little one falls into — go bigger for rough ground." eyebrow="On rough ground" image="img/amishdolly/cmp_rough_bg.png" /> },
  { key: "s_74", start: 374.08, dur: 6.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_74.png" darken={0} /> },
  { key: "s_75", start: 379.62, dur: 7.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_75.png" darken={0} /> },
  { key: "s_76", start: 386.86, dur: 5.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_76.png" darken={0} /> },
  { key: "s_77", start: 391.84, dur: 11.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_77.png" darken={0} /> },
  { key: "cmp_fourswivel", start: 402.76, dur: 7.32, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="All four swivel — not two" image="img/amishdolly/cmp_fourswivel_bg.png" eyebrow="The old-timer's choice" caption="two fixed wheels only go straight; four swivel casters turn a quarter-ton in place with your pinky" accent="good" hue="amber" /> },
  { key: "s_80", start: 410.08, dur: 8.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_80.png" darken={0} /> },
  { key: "s_82", start: 417.74, dur: 4.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_82.png" darken={0} /> },
  { key: "s_83", start: 421.32, dur: 5.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_83.mp4" darken={0} clipDur={9.72} /> },
  { key: "cmp_swivelwhy", start: 426.38, dur: 6.66, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Why all-swivel wins" items={["Turn it in place, any direction","No steering, no fighting","Back it neatly into a corner","Spin a quarter-ton with one finger"]} accent={G} /> },
  { key: "s_86", start: 433.04, dur: 6.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_86.png" darken={0} /> },
  { key: "s_88", start: 439.16, dur: 7.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_88.png" darken={0} /> },
  { key: "s_90", start: 446.58, dur: 5.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_90.png" darken={0} /> },
  { key: "cmp_rating", start: 451.98, dur: 9.08, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Read the stamped number" image="img/amishdolly/cmp_rating_bg.png" eyebrow="Every caster has one" caption="the load rating is printed right on the wheel — and the math almost everyone does is the math that gets them hurt" accent="good" hue="amber" /> },
  { key: "s_93", start: 461.06, dur: 4.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_93.png" darken={0} /> },
  { key: "s_94", start: 464.9, dur: 3.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_94.mp4" darken={0} clipDur={5.44} /> },
  { key: "cmp_divide", start: 467.42, dur: 12.28, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="÷4" title="Don't divide by four" desc="A load never sits evenly on all four wheels. Cross a threshold or a pebble and for one second three come up light and one carries almost everything. That's the second it lets go." eyebrow="The mistake that snaps" image="img/amishdolly/cmp_divide_bg.png" /> },
  { key: "s_98", start: 479.7, dur: 5.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_98.png" darken={0} /> },
  { key: "s_99", start: 484.22, dur: 4.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_99.png" darken={0} /> },
  { key: "cmp_third", start: 488.08, dur: 6.52, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="⅓ of the whole load — each" image="img/amishdolly/cmp_third_bg.png" eyebrow="The rule that keeps you safe" caption="size every single wheel to hold at least a third of the total, not a quarter. Overbuild it. Wheels are cheap; your feet are not" accent="good" hue="cold" /> },
  { key: "s_101", start: 494.6, dur: 8.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_101.png" darken={0} /> },
  { key: "s_103", start: 502.22, dur: 9.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_103.png" darken={0} /> },
  { key: "cmp_low", start: 511.04, dur: 8.26, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Low & centered" image="img/amishdolly/cmp_low_bg.png" eyebrow="The invisible genius" caption="the lower the deck rides, the less a tall load wants to tip — keep the weight low and centered and it rolls all day without a wobble" accent="good" hue="amber" /> },
  { key: "s_107", start: 519.3, dur: 5.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_107.mp4" darken={0} clipDur={24.11} /> },
  { key: "cmp_deckbars", start: 524.24, dur: 6.42, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Low deck","value":3,"display":"stable, won't tip","winner":true},{"label":"Tall base","value":1,"display":"tips on a turn"}]} eyebrow="Low wins" title="Deck height" accent="good" hue="amber" /> },
  { key: "s_110", start: 530.66, dur: 5.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_110.png" darken={0} /> },
  { key: "s_111", start: 535.5, dur: 4.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_111.png" darken={0} /> },
  { key: "s_112", start: 539.48, dur: 4.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_112.png" darken={0} /> },
  { key: "cmp_notch", start: 543.74, dur: 10.28, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="The notch" image="img/amishdolly/cmp_notch_bg.png" eyebrow="You can't see why till you use it" caption="a hand-hold cut in the front edge — to hook your fingers or a strap, nudge it to start, ease it down off a threshold nice and slow" accent="good" hue="amber" /> },
  { key: "s_115", start: 554.02, dur: 6.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_115.png" darken={0} /> },
  { key: "cmp_invention", start: 559.76, dur: 7.12, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="The whole invention" items={[{"text":"A low, thick hardwood slab","state":"done"},{"text":"Four swivel wheels — each a third of the load","state":"done"},{"text":"Bolted through with washers and lock nuts","state":"done"},{"text":"A notch in the front to grab","state":"done"}]} eyebrow="That's it — that's the genius" accent="good" hue="good" image="img/amishdolly/cmp_invention_bg.png" /> },
  { key: "s_119", start: 566.88, dur: 7.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_119.png" darken={0} /> },
  { key: "s_121", start: 573.7, dur: 4.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_121.png" darken={0} /> },
  { key: "s_122", start: 577.6, dur: 6.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_122.png" darken={0} /> },
  { key: "cmp_moves", start: 583.32, dur: 11.46, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="What one man rolls, alone" items={["A full chest freezer, out to clean behind it","A brimming rain barrel to the garden","The cast anvil, the wood cookstove","Feed sacks, firewood, the whole workbench"]} accent={B} /> },
  { key: "s_125", start: 594.78, dur: 4.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_125.png" darken={0} /> },
  { key: "s_126", start: 598.66, dur: 6.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_126.png" darken={0} /> },
  { key: "cmp_barrel", start: 604.4, dur: 11.44, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={450} suffix=" lb" label="a full fifty-five gallon rain barrel — rolled from the downspout to the garden instead of bucketed" eyebrow="The rain barrel" accent="good" hue="cold" /> },
  { key: "s_131", start: 615.84, dur: 4.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_131.png" darken={0} /> },
  { key: "s_132", start: 619.74, dur: 3.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_132.png" darken={0} /> },
  { key: "cmp_gift", start: 622.32, dur: 3.68, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Years back for your back" image="img/amishdolly/cmp_gift_bg.png" eyebrow="It's not the wheels" caption="the jobs you used to dread or wait on your sons for — now you roll it over, do it, roll it back, and nothing hurts at the end of the day" accent="good" hue="amber" /> },
  { key: "cmp_oneidea", start: 673.52, dur: 13.72, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="One idea, a hundred uses" items={["Move heavy loads with two fingers","Keep food cold with no icebox","Heat a whole room on one fire","Pull water uphill with no power"]} accent={G} /> },
  { key: "cmp_deck", start: 687.24, dur: 10.04, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Build the deck" items={[{"text":"Hardwood — oak, maple, ash if you have it","state":"done"},{"text":"Or two layers of ¾-inch plywood, glued & screwed","state":"done"},{"text":"About 16 × 24 in — size it to your load","state":"done"},{"text":"Round the corners, cut the front notch","state":"done"}]} eyebrow="A Saturday morning" accent="good" hue="good" image="img/amishdolly/cmp_deck_bg.png" /> },
  { key: "s_150", start: 697.28, dur: 3.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_150.png" darken={0} /> },
  { key: "s_151", start: 700.14, dur: 8.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_151.mp4" darken={0} clipDur={9.01} /> },
  { key: "cmp_seal", start: 708.6, dur: 9.1, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Boiled linseed oil" image="img/amishdolly/cmp_seal_bg.png" eyebrow="If it lives in the barn" caption="wipe it on, let it dry, wipe it again — bare wood drinks the damp, swells and rots; sealed wood shrugs it off" accent="good" hue="amber" /> },
  { key: "s_155", start: 717.7, dur: 4.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_155.mp4" darken={0} clipDur={17.64} /> },
  { key: "s_156", start: 722.06, dur: 5.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_156.png" darken={0} /> },
  { key: "s_157", start: 727.16, dur: 7.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_157.png" darken={0} /> },
  { key: "cmp_pickcasters", start: 734.06, dur: 7.64, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} image="img/amishdolly/cmp_pickcasters_bg.png" title="Pick your casters" chips={["swivel","rubber tread","⅓-load rated","smooth-rolling"]} hue="amber" /> },
  { key: "s_161", start: 741.7, dur: 5.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_161.mp4" darken={0} clipDur={9.24} /> },
  { key: "s_162", start: 746.66, dur: 5.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_162.png" darken={0} /> },
  { key: "s_163", start: 752.04, dur: 5.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_163.png" darken={0} /> },
  { key: "cmp_bolt", start: 756.64, dur: 6.86, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="!" title="Bolt them — never wood screws" desc="Run a bolt through the deck with a washer and a lock nut on the back side. Wood screws back out under a shaking load, especially in end-grain. A through-bolt with a lock nut never comes loose. Don't cheap out on the bolts." eyebrow="Your whole safety, in four bolts" image="img/amishdolly/cmp_bolt_bg.png" /> },
  { key: "s_166", start: 763.5, dur: 5.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_166.mp4" darken={0} clipDur={15.76} /> },
  { key: "s_167", start: 768.24, dur: 4.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_167.png" darken={0} /> },
  { key: "s_168", start: 772.52, dur: 5.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_168.mp4" darken={0} clipDur={21.32} /> },
  { key: "s_170", start: 777.96, dur: 7.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_170.png" darken={0} /> },
  { key: "cmp_grip", start: 785.16, dur: 8.1, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="A no-slip top" image="img/amishdolly/cmp_grip_bg.png" eyebrow="A nice touch" caption="a couple of wood cleats or a strip of no-slip rubber mat keeps the load from walking off the deck when you stop quick" accent="good" hue="cold" /> },
  { key: "s_173", start: 793.26, dur: 4.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_173.png" darken={0} /> },
  { key: "s_174", start: 797.2, dur: 7.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_174.png" darken={0} /> },
  { key: "s_175", start: 804.34, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_175.mp4" darken={0} clipDur={14.9} /> },
  { key: "cmp_versions", start: 808.74, dur: 7.46, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="A version for every job" items={[{"text":"Brake casters — flip a lever, it stays put","state":"done"},{"text":"Bigger & longer — six wheels for grain bins & lumber","state":"done"},{"text":"Two fixed wheels so a long one tracks straight","state":"done"},{"text":"A lip or cradle for barrels and pipe","state":"done"}]} eyebrow="Once you've built one" accent="good" hue="good" image="img/amishdolly/cmp_versions_bg.png" /> },
  { key: "s_177", start: 816.2, dur: 7.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_177.png" darken={0} /> },
  { key: "s_179", start: 823.2, dur: 4.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_179.png" darken={0} /> },
  { key: "s_180", start: 827.48, dur: 6.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_180.png" darken={0} /> },
  { key: "cmp_straighttight", start: 833.06, dur: 7.62, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"All four swivel","value":3,"display":"tight spaces, spins in place","winner":true},{"label":"2 fixed + 2 swivel","value":2,"display":"long loads, tracks straight"}]} eyebrow="Match it to the job" title="Which caster layout" accent="good" hue="amber" /> },
  { key: "s_182", start: 840.68, dur: 7.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_182.png" darken={0} /> },
  { key: "s_183", start: 848.08, dur: 5.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_183.png" darken={0} /> },
  { key: "s_184", start: 853.32, dur: 6.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_184.png" darken={0} /> },
  { key: "cmp_lip", start: 859.16, dur: 8.22, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} image="img/amishdolly/cmp_lip_bg.png" title="Add a lip for round loads" chips={["barrels","a stack of pipe","milk cans","kegs"]} hue="amber" /> },
  { key: "s_186", start: 867.38, dur: 3.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_186.png" darken={0} /> },
  { key: "s_187", start: 869.96, dur: 6.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_187.mp4" darken={0} clipDur={16.28} /> },
  { key: "s_188", start: 875.56, dur: 4.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_188.png" darken={0} /> },
  { key: "cmp_20yr", start: 880.02, dur: 7.98, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={20} suffix=" years" label="follow these five and this cart serves you faithfully for twenty years and never once hurts you" eyebrow="Built to last" accent="good" hue="cold" /> },
  { key: "cmp_fiverules", start: 888, dur: 9.92, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="The five safety rules" items={[{"text":"Never go over the wheels' rating","state":"done"},{"text":"Load & unload on flat, level ground only","state":"done"},{"text":"Steel-toe boots — fingers & toes clear","state":"done"},{"text":"Don't ride it — it has no brakes","state":"done"},{"text":"Tall loads: low, centered, strapped, slow turns","state":"done"}]} eyebrow="Keep them and it serves 20 years" accent="good" hue="good" image="img/amishdolly/cmp_fiverules_bg.png" /> },
  { key: "s_192", start: 897.92, dur: 8.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_192.png" darken={0} /> },
  { key: "cmp_slope", start: 905.8, dur: 9.76, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Never on a slope" image="img/amishdolly/cmp_slope_bg.png" eyebrow="The big one — the runaway" caption="a loaded cart on any grade wants to get away — it'll go through a wall or over a person. Flat ground only; chock a wheel when it's parked" accent="danger" hue="red" /> },
  { key: "s_196", start: 915.56, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_196.png" darken={0} /> },
  { key: "s_197", start: 919.74, dur: 6.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_197.png" darken={0} /> },
  { key: "s_198", start: 925.28, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_198.png" darken={0} /> },
  { key: "s_199", start: 929.68, dur: 6.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/amishdolly/s_199.mp4" darken={0} clipDur={6.48} /> },
  { key: "cmp_pinch", start: 935.42, dur: 11.74, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Casters pinch" image="img/amishdolly/cmp_pinch_bg.png" eyebrow="Fingers & toes" caption="keep your fingers out from under the load and off the floor when you set it down, and wear real boots — a caster will take a fingertip" accent="danger" hue="red" /> },
  { key: "cmp_ride", start: 947.16, dur: 6.46, kind: "mistake", el: (d) => <MistakeCard durationInFrames={d} number="✗" title="Don't ride it" desc="No brakes, and it'll dump you on your head. Don't ride it, and don't let the little ones ride it — however much the grandkids beg." eyebrow="It is not a scooter" image="img/amishdolly/cmp_ride_bg.png" /> },
  { key: "s_206", start: 953.62, dur: 4.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_206.png" darken={0} /> },
  { key: "cmp_payoff", start: 957.9, dur: 8.88, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="The real payoff" items={["Heavy work you used to dread or put off","Now one man, two fingers, done","Nothing hurts at the end of the day","Years given back to your back"]} accent={G} /> },
  { key: "cmp_tall", start: 966.78, dur: 9.38, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Low · centered · slow" image="img/amishdolly/cmp_tall_bg.png" eyebrow="So a tall load won't tip" caption="a tall, top-heavy load on a low cart tips when you turn quick — strap it, keep it low and centered, and take your turns slow and wide" accent="good" hue="amber" /> },
  { key: "s_211", start: 976.16, dur: 5.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_211.png" darken={0} /> },
  { key: "cmp_recap", start: 981.32, dur: 6.82, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="The whole genius, again" items={[{"text":"A thick low slab + four swivel wheels","state":"done"},{"text":"Each wheel a third of the load, bolted","state":"done"},{"text":"A notch to grab, sealed against damp","state":"done"},{"text":"Flat ground, real boots, never ride it","state":"done"}]} eyebrow="Go build one this weekend" accent="good" hue="good" image="img/amishdolly/cmp_recap_bg.png" /> },
  { key: "s_214", start: 988.14, dur: 7.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/amishdolly/s_214.png" darken={0} /> },
  { key: "cmp_next", start: 995.42, dur: 10.58, kind: "nextvideo", el: (d) => <NextVideoEndcard durationInFrames={d} title="Water uphill — all day, no pump, no power" kicker="Next time" sub="How the old-timers pushed a low creek up to the house with nothing but the water itself. People don't believe it till they see it run." /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":6.8,"role":"popUp","vol":0.32},{"at":13.6,"role":"popUp","vol":0.32},{"at":22,"role":"popUp","vol":0.32},{"at":31.8,"role":"popUp","vol":0.32},{"at":38.6,"role":"popUp","vol":0.32},{"at":75.96,"role":"popUp","vol":0.32},{"at":83.98,"role":"popUp","vol":0.32},{"at":91.74,"role":"popUp","vol":0.32},{"at":175.48,"role":"popUp","vol":0.32},{"at":209.54,"role":"popUp","vol":0.32},{"at":229.86,"role":"popUp","vol":0.32},{"at":265.64,"role":"popUp","vol":0.32},{"at":296.76,"role":"popUp","vol":0.32},{"at":312.62,"role":"popUp","vol":0.32},{"at":342.7,"role":"popUp","vol":0.32},{"at":367.3,"role":"popUp","vol":0.32},{"at":402.76,"role":"popUp","vol":0.32},{"at":426.38,"role":"popUp","vol":0.32},{"at":451.98,"role":"popUp","vol":0.32},{"at":467.42,"role":"popUp","vol":0.32},{"at":488.08,"role":"popUp","vol":0.32},{"at":511.04,"role":"popUp","vol":0.32},{"at":524.24,"role":"popUp","vol":0.32},{"at":543.74,"role":"popUp","vol":0.32},{"at":559.76,"role":"popUp","vol":0.32},{"at":583.32,"role":"popUp","vol":0.32},{"at":604.4,"role":"popUp","vol":0.32},{"at":622.32,"role":"popUp","vol":0.32},{"at":673.52,"role":"popUp","vol":0.32},{"at":687.24,"role":"popUp","vol":0.32},{"at":708.6,"role":"popUp","vol":0.32},{"at":734.06,"role":"popUp","vol":0.32},{"at":756.64,"role":"popUp","vol":0.32},{"at":785.16,"role":"popUp","vol":0.32},{"at":808.74,"role":"popUp","vol":0.32},{"at":833.06,"role":"popUp","vol":0.32},{"at":859.16,"role":"popUp","vol":0.32},{"at":880.02,"role":"popUp","vol":0.32},{"at":888,"role":"popUp","vol":0.32},{"at":905.8,"role":"popUp","vol":0.32},{"at":935.42,"role":"popUp","vol":0.32},{"at":947.16,"role":"popUp","vol":0.32},{"at":957.9,"role":"popUp","vol":0.32},{"at":966.78,"role":"popUp","vol":0.32},{"at":981.32,"role":"popUp","vol":0.32},{"at":995.42,"role":"popUp","vol":0.32}];
