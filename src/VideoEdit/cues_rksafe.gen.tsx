// cues_rksafe.gen.tsx — GENERADO por build_rksafe.mjs. NO editar a mano.
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
import { RouteFlow } from "../rksafe/RouteFlow";
import { SplitVs } from "../rksafe/SplitVs";
import { WorstSpots } from "../rksafe/WorstSpots";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
  { key: "clip_42880", start: 42.86666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_27.mp4" /> },
  { key: "clip_49200", start: 49.2, dur: 6, el: (d) => <Clip src="broll/rksafe_h_22.mp4" /> },
  { key: "clip_91280", start: 91.26666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_01.mp4" /> },
  { key: "componente_134400", start: 134.4, dur: 11, el: (d) => <RouteFlow durationInFrames={d} {...({"bed":"img/rksafe_m_13.jpg"} as any)} /> },
  { key: "clip_148720", start: 148.73333333333332, dur: 6, el: (d) => <Clip src="broll/rksafe_h_32.mp4" /> },
  { key: "componente_194560", start: 194.56666666666666, dur: 11, el: (d) => <PullQuote durationInFrames={d} {...({"quote":"“But the safe was hidden.” It was — right where everyone hides one.","attrib":"— Ray","bed":"img/rksafe_m_02.jpg"} as any)} /> },
  { key: "imagen_269280", start: 269.26666666666665, dur: 6, el: (d) => <Foto src="img/rksafe_m_22.jpg" seed={8078} /> },
  { key: "componente_290320", start: 290.3333333333333, dur: 11, el: (d) => <WorstSpots durationInFrames={d} {...({"bed":"img/rksafe_m_01.jpg"} as any)} /> },
  { key: "clip_321680", start: 321.6666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_02.mp4" /> },
  { key: "clip_341920", start: 341.93333333333334, dur: 6, el: (d) => <Clip src="broll/rksafe_h_03.mp4" /> },
  { key: "clip_376880", start: 376.8666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_04.mp4" /> },
  { key: "clip_421040", start: 421.03333333333336, dur: 6, el: (d) => <Clip src="broll/rksafe_h_05.mp4" /> },
  { key: "clip_456960", start: 456.96666666666664, dur: 6, el: (d) => <Clip src="broll/rksafe_h_06.mp4" /> },
  { key: "componente_489360", start: 489.3666666666667, dur: 6.866666666666666, el: (d) => <MythTruth durationInFrames={d} {...({"kicker":"THE RULE","myth":"A known trick","truth":"If he saw the movie, it isn't a hiding spot","bed":"img/rksafe_m_07.jpg"} as any)} /> },
  { key: "clip_496240", start: 496.23333333333335, dur: 6, el: (d) => <Clip src="broll/rksafe_h_07.mp4" /> },
  { key: "clip_549200", start: 549.2, dur: 6, el: (d) => <Clip src="broll/rksafe_h_08.mp4" /> },
  { key: "imagen_560080", start: 560.0666666666667, dur: 6, el: (d) => <Foto src="img/rksafe_m_24.jpg" seed={16802} /> },
  { key: "clip_595920", start: 595.9333333333333, dur: 6, el: (d) => <Clip src="broll/rksafe_h_09.mp4" /> },
  { key: "imagen_607680", start: 607.6666666666666, dur: 6, el: (d) => <Foto src="img/rksafe_m_21.jpg" seed={18230} /> },
  { key: "clip_640000", start: 640, dur: 6, el: (d) => <Clip src="broll/rksafe_h_10.mp4" /> },
  { key: "componente_673440", start: 673.4333333333333, dur: 4.8, el: (d) => <BigStat durationInFrames={d} {...({"value":"90","unit":"seconds","caption":"Two guys and a hand truck.","tone":"danger","bed":"img/rksafe_m_05.jpg"} as any)} /> },
  { key: "clip_678240", start: 678.2333333333333, dur: 6, el: (d) => <Clip src="broll/rksafe_h_26.mp4" /> },
  { key: "imagen_708990", start: 709, dur: 6, el: (d) => <Foto src="img/rksafe_m_03.jpg" seed={21270} /> },
  { key: "clip_721470", start: 721.4666666666667, dur: 3.7, el: (d) => <Clip src="broll/rksafe_h_11.mp4" /> },
  { key: "componente_725150", start: 725.1666666666666, dur: 2.8, el: (d) => <ProcessChips durationInFrames={d} {...({"bed":"img/rksafe_m_04.jpg"} as any)} /> },
  { key: "clip_727950", start: 727.9666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_25.mp4" /> },
  { key: "componente_741310", start: 741.3, dur: 11, el: (d) => <SplitVs durationInFrames={d} {...({"leftLabel":"On a shelf","leftValue":"$2,000","rightLabel":"Bolted down","rightValue":"$300","verdict":"Bolted beats the price tag, every day.","bed":"img/rksafe_m_14.jpg"} as any)} /> },
  { key: "imagen_762350", start: 762.3666666666667, dur: 4.066666666666666, el: (d) => <Foto src="img/rksafe_h_30.jpg" seed={22871} /> },
  { key: "imagen_766430", start: 766.4333333333333, dur: 4.066666666666666, el: (d) => <Foto src="img/rksafe_m_23.jpg" seed={22993} /> },
  { key: "imagen_770510", start: 770.5, dur: 6, el: (d) => <Foto src="img/rksafe_m_17.jpg" seed={23115} /> },
  { key: "clip_784990", start: 785, dur: 4.066666666666666, el: (d) => <Clip src="broll/rksafe_h_12.mp4" /> },
  { key: "imagen_789070", start: 789.0666666666667, dur: 6, el: (d) => <Foto src="img/rksafe_m_08.jpg" seed={23672} /> },
  { key: "clip_796030", start: 796.0333333333333, dur: 4.966666666666667, el: (d) => <Clip src="broll/rksafe_h_23.mp4" /> },
  { key: "clip_800990", start: 801, dur: 2.966666666666667, el: (d) => <Clip src="broll/rksafe_h_13.mp4" /> },
  { key: "imagen_803950", start: 803.9666666666667, dur: 3.2666666666666666, el: (d) => <Foto src="img/rksafe_m_19.jpg" seed={24119} /> },
  { key: "clip_807230", start: 807.2333333333333, dur: 6, el: (d) => <Clip src="broll/rksafe_h_14.mp4" /> },
  { key: "componente_829390", start: 829.4, dur: 8.4, el: (d) => <CrossSection durationInFrames={d} {...({"bed":"img/rksafe_m_09.jpg"} as any)} /> },
  { key: "imagen_837790", start: 837.8, dur: 6, el: (d) => <Foto src="img/rksafe_m_20.jpg" seed={25134} /> },
  { key: "clip_905710", start: 905.7, dur: 6, el: (d) => <Clip src="broll/rksafe_h_15.mp4" /> },
  { key: "clip_924201", start: 924.2, dur: 6, el: (d) => <Clip src="broll/rksafe_h_16.mp4" /> },
  { key: "imagen_934030", start: 934.0333333333333, dur: 6, el: (d) => <Foto src="img/rksafe_m_06.jpg" seed={28021} /> },
  { key: "clip_963950", start: 963.9666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_28.mp4" /> },
  { key: "imagen_1022030", start: 1022.0333333333333, dur: 6, el: (d) => <Foto src="img/rksafe_m_10.jpg" seed={30661} /> },
  { key: "clip_1028590", start: 1028.6, dur: 6, el: (d) => <Clip src="broll/rksafe_h_17.mp4" /> },
  { key: "clip_1040670", start: 1040.6666666666667, dur: 5.533333333333333, el: (d) => <Clip src="broll/rksafe_h_31.mp4" /> },
  { key: "imagen_1046190", start: 1046.2, dur: 6, el: (d) => <Foto src="img/rksafe_m_11.jpg" seed={31386} /> },
  { key: "clip_1061710", start: 1061.7, dur: 4.966666666666667, el: (d) => <Clip src="broll/rksafe_h_18.mp4" /> },
  { key: "componente_1066670", start: 1066.6666666666667, dur: 11, el: (d) => <RayChecklist durationInFrames={d} {...({"bed":"img/rksafe_m_18.jpg"} as any)} /> },
  { key: "clip_1102830", start: 1102.8333333333333, dur: 6, el: (d) => <Clip src="broll/rksafe_h_19.mp4" /> },
  { key: "componente_1121310", start: 1121.3, dur: 11, el: (d) => <CheckCard durationInFrames={d} {...({"bed":"img/rksafe_m_12.jpg"} as any)} /> },
  { key: "clip_1168030", start: 1168.0333333333333, dur: 6, el: (d) => <Clip src="broll/rksafe_h_24.mp4" /> },
  { key: "clip_1199150", start: 1199.1666666666667, dur: 6, el: (d) => <Clip src="broll/rksafe_h_20.mp4" /> },
  { key: "imagen_1213950", start: 1213.9666666666667, dur: 6, el: (d) => <Foto src="img/rksafe_h_33.jpg" seed={36419} /> },
  { key: "clip_1249230", start: 1249.2333333333333, dur: 6, el: (d) => <Clip src="broll/rksafe_h_34.mp4" /> },
  { key: "clip_1302910", start: 1302.9, dur: 6, el: (d) => <Clip src="broll/rksafe_h_21.mp4" /> },
];

export const OVERLAYS: Cue[] = [
  { key: "ov_26400", start: 26.4, dur: 5.5, el: (d) => <StatBug durationInFrames={d} {...({"value":"4,000","caption":"mornings after","series":"The Four Thousand Doors"} as any)} /> },
  { key: "ov_273200", start: 273.2, dur: 4, el: (d) => <Label durationInFrames={d} {...({"text":"The clock is his enemy","tone":"brass"} as any)} /> },
  { key: "ov_1265070", start: 1265.0666666666666, dur: 9, el: (d) => <RayCta durationInFrames={d} {...({} as any)} /> },
];
