// cues_raydoor1.gen.tsx — GENERADO por build_raydoor1.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, Label, StatBug } from "../rksafe/RayStage";
import { BigStat } from "../rksafe/BigStat";
import { CheckCard } from "../rksafe/CheckCard";
import { CrossSection } from "../rksafe/CrossSection";
import { MythTruth } from "../rksafe/MythTruth";
import { ProcessChips } from "../rksafe/ProcessChips";
import { PullQuote } from "../rksafe/PullQuote";
import { RayChecklist } from "../rksafe/RayChecklist";
import { RayCta } from "../rksafe/RayCta";
import { SplitVs } from "../rksafe/SplitVs";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
  { key: "clip_80", start: 0.06666666666666667, dur: 6.9, el: (d) => <Clip src="broll/raydoor1_h_01.mp4" /> },
  { key: "imagen_6960", start: 6.966666666666667, dur: 3.9, el: (d) => <Foto src="img/raydoor1_m_02.jpg" seed={209} /> },
  { key: "imagen_10880", start: 10.866666666666667, dur: 37, el: (d) => <Foto src="img/raydoor1_h_35.jpg" seed={326} /> },
  { key: "componente_60480", start: 60.46666666666667, dur: 11.933333333333334, el: (d) => <BigStat durationInFrames={d} {...({"value":"$1","unit":"","caption":"The whole difference between a door that holds and one that folds.","tone":"brass","bed":"img/raydoor1_m_04.jpg"} as any)} /> },
  { key: "imagen_72400", start: 72.4, dur: 16.066666666666666, el: (d) => <Foto src="img/raydoor1_m_10.jpg" seed={2172} /> },
  { key: "clip_88480", start: 88.46666666666667, dur: 8.166666666666666, el: (d) => <Clip src="broll/raydoor1_h_24.mp4" /> },
  { key: "clip_96640", start: 96.63333333333334, dur: 23.133333333333333, el: (d) => <Clip src="broll/raydoor1_h_25.mp4" /> },
  { key: "imagen_119760", start: 119.76666666666667, dur: 37, el: (d) => <Foto src="img/raydoor1_m_03.jpg" seed={3593} /> },
  { key: "componente_174880", start: 174.86666666666667, dur: 6.333333333333333, el: (d) => <MythTruth durationInFrames={d} {...({"kicker":"THE MYTH","myth":"They pick the lock","truth":"They kick it — one boot, three seconds","bed":"img/raydoor1_m_02.jpg"} as any)} /> },
  { key: "clip_181200", start: 181.2, dur: 2.8666666666666667, el: (d) => <Clip src="broll/raydoor1_h_22.mp4" /> },
  { key: "componente_184080", start: 184.06666666666666, dur: 18.166666666666668, el: (d) => <BigStat durationInFrames={d} {...({"value":"3","unit":"seconds","tone":"danger","caption":"One boot next to the knob. No tools, no skill.","bed":"img/raydoor1_m_02.jpg"} as any)} /> },
  { key: "clip_202240", start: 202.23333333333332, dur: 37, el: (d) => <Clip src="broll/raydoor1_h_20.mp4" /> },
  { key: "clip_240720", start: 240.73333333333332, dur: 23.9, el: (d) => <Clip src="broll/raydoor1_h_30.mp4" /> },
  { key: "clip_264640", start: 264.6333333333333, dur: 2, el: (d) => <Clip src="broll/raydoor1_h_02.mp4" /> },
  { key: "imagen_266640", start: 266.6333333333333, dur: 23.6, el: (d) => <Foto src="img/raydoor1_m_17.jpg" seed={7999} /> },
  { key: "clip_290240", start: 290.23333333333335, dur: 15.6, el: (d) => <Clip src="broll/raydoor1_h_03.mp4" /> },
  { key: "clip_305840", start: 305.8333333333333, dur: 2.2333333333333334, el: (d) => <Clip src="broll/raydoor1_h_04.mp4" /> },
  { key: "clip_308080", start: 308.06666666666666, dur: 5.466666666666667, el: (d) => <Clip src="broll/raydoor1_h_05.mp4" /> },
  { key: "imagen_313520", start: 313.53333333333336, dur: 3.033333333333333, el: (d) => <Foto src="img/raydoor1_m_04.jpg" seed={9406} /> },
  { key: "imagen_316560", start: 316.56666666666666, dur: 16.066666666666666, el: (d) => <Foto src="img/raydoor1_m_01.jpg" seed={9497} /> },
  { key: "clip_332640", start: 332.6333333333333, dur: 1.9333333333333333, el: (d) => <Clip src="broll/raydoor1_h_06.mp4" /> },
  { key: "componente_334560", start: 334.56666666666666, dur: 21.666666666666668, el: (d) => <CrossSection durationInFrames={d} {...({"title":"The chain that fails","caption":"weakest link","labels":[{"text":"Two short screws"},{"text":"into soft pine trim"},{"text":"never reaches the stud"}],"bed":"img/raydoor1_m_07.jpg"} as any)} /> },
  { key: "imagen_356240", start: 356.23333333333335, dur: 33.833333333333336, el: (d) => <Foto src="img/raydoor1_m_14.jpg" seed={10687} /> },
  { key: "componente_390080", start: 390.06666666666666, dur: 16.166666666666668, el: (d) => <MythTruth durationInFrames={d} {...({"kicker":"THE REAL PROBLEM","myth":"A lock problem","truth":"A screw problem","bed":"img/raydoor1_m_01.jpg"} as any)} /> },
  { key: "componente_406240", start: 406.23333333333335, dur: 28, el: (d) => <MythTruth durationInFrames={d} {...({"kicker":"THE KNOB","myth":"Button lock = security","truth":"That's privacy — the deadbolt does the work","bed":"img/raydoor1_h_15.jpg"} as any)} /> },
  { key: "imagen_445440", start: 445.43333333333334, dur: 30.166666666666668, el: (d) => <Foto src="img/raydoor1_h_34.jpg" seed={13363} /> },
  { key: "componente_475600", start: 475.6, dur: 26.733333333333334, el: (d) => <SplitVs durationInFrames={d} {...({"leftLabel":"The door","leftValue":"$2,000","rightLabel":"The frame","rightValue":"$1","leftImage":"img/raydoor1_m_10.jpg","rightImage":"img/raydoor1_m_01.jpg","verdict":"A $2,000 door on a $1 frame is a $1 door.","bed":"img/raydoor1_m_10.jpg"} as any)} /> },
  { key: "clip_502320", start: 502.3333333333333, dur: 4.4, el: (d) => <Clip src="broll/raydoor1_h_07.mp4" /> },
  { key: "componente_506720", start: 506.73333333333335, dur: 4.133333333333334, el: (d) => <SplitVs durationInFrames={d} {...({"leftLabel":"Short screw","leftValue":"3/4 in","rightLabel":"Long screw","rightValue":"3 in","leftImage":"img/raydoor1_m_04.jpg","rightImage":"img/raydoor1_m_21.jpg","verdict":"One is a joke. The other is a fence post.","bed":"img/raydoor1_m_15.jpg"} as any)} /> },
  { key: "clip_510880", start: 510.8666666666667, dur: 28.733333333333334, el: (d) => <Clip src="broll/raydoor1_h_26.mp4" /> },
  { key: "imagen_539600", start: 539.6, dur: 24.466666666666665, el: (d) => <Foto src="img/raydoor1_m_05.jpg" seed={16188} /> },
  { key: "componente_564080", start: 564.0666666666667, dur: 10.966666666666667, el: (d) => <CheckCard durationInFrames={d} {...({"kicker":"THE SHOPPING LIST","title":"The right screw","items":[{"text":"#9-#10 gauge"},{"text":"3 inches long"},{"text":"Coarse thread — NOT drywall screws"}],"bed":"img/raydoor1_m_05.jpg"} as any)} /> },
  { key: "imagen_575040", start: 575.0333333333333, dur: 20.8, el: (d) => <Foto src="img/raydoor1_h_08.jpg" seed={17251} /> },
  { key: "imagen_595840", start: 595.8333333333334, dur: 12.1, el: (d) => <Foto src="img/raydoor1_m_12.jpg" seed={17875} /> },
  { key: "imagen_607920", start: 607.9333333333333, dur: 15.833333333333334, el: (d) => <Foto src="img/raydoor1_m_07.jpg" seed={18238} /> },
  { key: "clip_623760", start: 623.7666666666667, dur: 2.8666666666666667, el: (d) => <Clip src="broll/raydoor1_h_09.mp4" /> },
  { key: "imagen_626640", start: 626.6333333333333, dur: 1.8333333333333333, el: (d) => <Foto src="img/raydoor1_m_06.jpg" seed={18799} /> },
  { key: "imagen_628480", start: 628.4666666666667, dur: 17.133333333333333, el: (d) => <Foto src="img/raydoor1_m_16.jpg" seed={18854} /> },
  { key: "componente_645600", start: 645.6, dur: 17.6, el: (d) => <ProcessChips durationInFrames={d} {...({"kicker":"THE DEMO","title":"Do it in order","steps":[{"title":"Pilot hole, straight & shallow"},{"title":"Drive the screw in slow"},{"title":"Feel it go soft to hard"},{"title":"Snug, not stripped"}],"bed":"img/raydoor1_m_06.jpg"} as any)} /> },
  { key: "clip_663200", start: 663.2, dur: 3.6, el: (d) => <Clip src="broll/raydoor1_h_32.mp4" /> },
  { key: "clip_666800", start: 666.8, dur: 17.933333333333334, el: (d) => <Clip src="broll/raydoor1_h_10.mp4" /> },
  { key: "clip_684720", start: 684.7333333333333, dur: 22.933333333333334, el: (d) => <Clip src="broll/raydoor1_h_11.mp4" /> },
  { key: "imagen_707680", start: 707.6666666666666, dur: 8.733333333333333, el: (d) => <Foto src="img/raydoor1_m_22.jpg" seed={21230} /> },
  { key: "clip_716400", start: 716.4, dur: 26.566666666666666, el: (d) => <Clip src="broll/raydoor1_h_27.mp4" /> },
  { key: "clip_742960", start: 742.9666666666667, dur: 14.166666666666666, el: (d) => <Clip src="broll/raydoor1_h_38.mp4" /> },
  { key: "clip_757120", start: 757.1333333333333, dur: 4.233333333333333, el: (d) => <Clip src="broll/raydoor1_h_12.mp4" /> },
  { key: "imagen_761360", start: 761.3666666666667, dur: 13.9, el: (d) => <Foto src="img/raydoor1_m_13.jpg" seed={22841} /> },
  { key: "clip_775280", start: 775.2666666666667, dur: 13.6, el: (d) => <Clip src="broll/raydoor1_h_23.mp4" /> },
  { key: "clip_788880", start: 788.8666666666667, dur: 7.6, el: (d) => <Clip src="broll/raydoor1_h_13.mp4" /> },
  { key: "componente_796480", start: 796.4666666666667, dur: 22.4, el: (d) => <ProcessChips durationInFrames={d} {...({"kicker":"THE HINGES","title":"One long screw per hinge","steps":[{"title":"Back out the middle hinge screw"},{"title":"Drive one 3-inch screw"},{"title":"Both sides anchored"}],"bed":"img/raydoor1_h_13.jpg"} as any)} /> },
  { key: "clip_818880", start: 818.8666666666667, dur: 18.4, el: (d) => <Clip src="broll/raydoor1_h_29.mp4" /> },
  { key: "imagen_837280", start: 837.2666666666667, dur: 8, el: (d) => <Foto src="img/raydoor1_m_25.jpg" seed={25118} /> },
  { key: "clip_845280", start: 845.2666666666667, dur: 4.333333333333333, el: (d) => <Clip src="broll/raydoor1_h_14.mp4" /> },
  { key: "imagen_849600", start: 849.6, dur: 14.233333333333333, el: (d) => <Foto src="img/raydoor1_m_09.jpg" seed={25488} /> },
  { key: "clip_863840", start: 863.8333333333334, dur: 5.3, el: (d) => <Clip src="broll/raydoor1_h_36.mp4" /> },
  { key: "clip_869120", start: 869.1333333333333, dur: 17.033333333333335, el: (d) => <Clip src="broll/raydoor1_h_15.mp4" /> },
  { key: "componente_886160", start: 886.1666666666666, dur: 6.8, el: (d) => <CheckCard durationInFrames={d} {...({"kicker":"TWO FREE CHECKS","title":"Gap & bolt","items":[{"text":"Gap tight & even, top to bottom"},{"text":"Bolt travels the full inch"},{"text":"No wiggle — seats deep in the plate"}],"bed":"img/raydoor1_m_09.jpg"} as any)} /> },
  { key: "imagen_892960", start: 892.9666666666667, dur: 30.466666666666665, el: (d) => <Foto src="img/raydoor1_m_08.jpg" seed={26789} /> },
  { key: "clip_923440", start: 923.4333333333333, dur: 21.9, el: (d) => <Clip src="broll/raydoor1_h_28.mp4" /> },
  { key: "clip_945328", start: 945.3333333333334, dur: 7.066666666666666, el: (d) => <Clip src="broll/raydoor1_h_16.mp4" /> },
  { key: "imagen_952400", start: 952.4, dur: 26.966666666666665, el: (d) => <Foto src="img/raydoor1_m_19.jpg" seed={28572} /> },
  { key: "clip_979360", start: 979.3666666666667, dur: 29.1, el: (d) => <Clip src="broll/raydoor1_h_19.mp4" /> },
  { key: "componente_1008480", start: 1008.4666666666667, dur: 28, el: (d) => <RayChecklist durationInFrames={d} {...({"kicker":"THE RECAP","title":"Four things = a door that holds","items":[{"text":"Long screws in the strike plate"},{"text":"One long screw in each hinge"},{"text":"A tight, even gap"},{"text":"Bolt goes all the way home"}],"bed":"img/raydoor1_h_11.jpg"} as any)} /> },
  { key: "clip_1058160", start: 1058.1666666666667, dur: 12.466666666666667, el: (d) => <Clip src="broll/raydoor1_h_17.mp4" /> },
  { key: "componente_1070640", start: 1070.6333333333334, dur: 28, el: (d) => <PullQuote durationInFrames={d} {...({"quote":"You don't need a bunker. You need a $1 screw.","attrib":"— Ray Kessler","bed":"img/raydoor1_h_17.jpg"} as any)} /> },
  { key: "clip_1103920", start: 1103.9333333333334, dur: 37, el: (d) => <Clip src="broll/raydoor1_h_31.mp4" /> },
  { key: "componente_1143920", start: 1143.9333333333334, dur: 28, el: (d) => <RayCta durationInFrames={d} {...({"eyebrow":"BEFORE YOU FORGET","title":"Do the whole door properly","sub":"The strike, the hinges, the gap, the bolt — the whole afternoon laid out in order, the way I'd do it at your house. It's down below if you want it.","domain":"[ walkthrough below ]","showQr":false} as any)} /> },
  { key: "clip_1195040", start: 1195.0333333333333, dur: 5.2, el: (d) => <Clip src="broll/raydoor1_h_18.mp4" /> },
  { key: "clip_1200240", start: 1200.2333333333333, dur: 11.566666666666666, el: (d) => <Clip src="broll/raydoor1_h_37.mp4" /> },
];

export const OVERLAYS: Cue[] = [
  { key: "ov_130240", start: 130.23333333333332, dur: 5, el: (d) => <StatBug durationInFrames={d} {...({"value":"$140","unit":"","caption":"on the lock. The $1 problem was the screws.","series":"The Four Thousand Doors","tone":"brass"} as any)} /> },
  { key: "ov_222160", start: 222.16666666666666, dur: 4, el: (d) => <Label durationInFrames={d} {...({"text":"All the force on one small spot","tone":"danger","pos":"bl"} as any)} /> },
  { key: "ov_943600", start: 943.6, dur: 5, el: (d) => <Label durationInFrames={d} {...({"text":"Every outside door — side · back · garage","tone":"brass","pos":"bl"} as any)} /> },
];
