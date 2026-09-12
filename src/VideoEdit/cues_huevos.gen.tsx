// cues_huevos.gen.tsx — GENERADO por beatsheet.mjs desde huevos.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/huevos.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { TimelineKit } from "./kit/TimelineKit";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { StatTag } from "./scenes/StatTag";
import { PhraseTag } from "./scenes/PhraseTag";
import { SagaTimeline } from "./scenes/SagaTimeline";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { CalloutMark } from "./scenes/CalloutMark";
import { NextVideoEndcard } from "./scenes/NextVideoEndcard";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hu_crock_eggs", start: 7.39, dur: 5.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_crock_eggs.png" darken={0} /> },
  { key: "hu_no_fridge_a", start: 11.91, dur: 6.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_no_fridge.png" darken={0} kbPhase={1} /> },
  { key: "hu_no_fridge_b", start: 18.7, dur: 6.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_no_fridge.png" darken={0} kbPhase={2} /> },
  { key: "cmp_hook", start: 25, dur: 9.56, kind: "impact", el: (d) => <ImpactReveal durationInFrames={d} image="img/cmp_hook_bg.png" impact="Fresh as the day it was laid. No fridge." setup="A year old." impactAccent="cold" hitAt={1.2} boom={0} darken={0.42} /> },
  { key: "hu_lime_bag", start: 34.56, dur: 4.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_lime_bag.png" darken={0} /> },
  { key: "hu_egg_counter_a", start: 95.96, dur: 6.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_counter.png" darken={0} kbPhase={1} /> },
  { key: "hu_egg_counter_b", start: 102.48, dur: 6.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_counter.png" darken={0} kbPhase={2} /> },
  { key: "hu_egg_counter_c", start: 109, dur: 6.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_counter.png" darken={0} kbPhase={3} /> },
  { key: "hu_egg_counter_undefined", start: 115.52, dur: 6.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_counter.png" darken={0} kbPhase={4} /> },
  { key: "hu_egg_counter_undefined", start: 122.04, dur: 6.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_counter.png" darken={0} kbPhase={5} /> },
  { key: "hu_shell_close", start: 128.06, dur: 7.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_shell_close.png" darken={0} /> },
  { key: "hu_pores_a", start: 135.32, dur: 7.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pores.png" darken={0} kbPhase={1} /> },
  { key: "hu_pores_b", start: 143.05, dur: 7.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pores.png" darken={0} kbPhase={2} /> },
  { key: "hu_pores_c", start: 150.78, dur: 7.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pores.png" darken={0} kbPhase={3} /> },
  { key: "hu_pores_undefined", start: 158.51, dur: 7.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pores.png" darken={0} kbPhase={4} /> },
  { key: "hu_pores_undefined", start: 166.24, dur: 7.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pores.png" darken={0} kbPhase={5} /> },
  { key: "hu_air_cell", start: 173.48, dur: 8.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_air_cell.png" darken={0} /> },
  { key: "cmp_secret", start: 181.06, dur: 47.97, kind: "impact", el: (d) => <ImpactReveal durationInFrames={d} image="img/cmp_secret_bg.png" impact="Seal the pores of the shell." setup="The whole secret:" impactAccent="cold" hitAt={1.2} boom={0} darken={0.42} /> },
  { key: "hu_hen_lay_a", start: 229.03, dur: 7.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/hu_hen_lay.mp4" darken={0} clipDur={6} kbPhase={1} /> },
  { key: "hu_hen_lay_b", start: 236.17, dur: 7.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/hu_hen_lay.mp4" darken={0} clipDur={6} kbPhase={2} /> },
  { key: "hu_egg_wash_a", start: 242.82, dur: 9.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_wash.png" darken={0} kbPhase={1} /> },
  { key: "hu_egg_wash_b", start: 251.98, dur: 9.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_wash.png" darken={0} kbPhase={2} /> },
  { key: "hu_egg_wash_c", start: 261.14, dur: 9.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_wash.png" darken={0} kbPhase={3} /> },
  { key: "hu_egg_wash_undefined", start: 270.3, dur: 9.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_wash.png" darken={0} kbPhase={4} /> },
  { key: "hu_egg_wash_undefined", start: 279.46, dur: 9.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_egg_wash.png" darken={0} kbPhase={5} /> },
  { key: "hu_euro_market", start: 288.11, dur: 3.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_euro_market.png" darken={0} /> },
  { key: "cmp_europe", start: 290.77, dur: 40.52, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="ILLEGAL" image="img/cmp_europe_bg.png" eyebrow="In Europe" caption="it is against the law to WASH an egg — they keep them on the shelf, unrefrigerated. Only here do we wash off the seal and then must chill them." accent="danger" hue="amber" /> },
  { key: "hu_unwashed_a", start: 331.29, dur: 6.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_unwashed.png" darken={0} kbPhase={1} /> },
  { key: "hu_unwashed_b", start: 337.32, dur: 6.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_unwashed.png" darken={0} kbPhase={2} /> },
  { key: "hu_unwashed_c", start: 343.35, dur: 6.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_unwashed.png" darken={0} kbPhase={3} /> },
  { key: "cmp_materials", start: 348.88, dur: 47.4, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="The whole method" items={[{"text":"Fresh UNWASHED eggs","state":"done"},{"text":"Pickling lime (1 oz per quart, by weight)","state":"done"},{"text":"A crock or glass jar of water","state":"done"},{"text":"Cover them · cool, dark spot","state":"done"}]} eyebrow="~$2 · keeps a year" accent="good" hue="cold" image="img/cmp_materials_bg.png" /> },
  { key: "hu_jar_crock", start: 396.28, dur: 8.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/hu_jar_crock.mp4" darken={0} clipDur={6} /> },
  { key: "hu_pickling_lime_a", start: 404.68, dur: 14.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pickling_lime.png" darken={0} kbPhase={1} /> },
  { key: "hu_pickling_lime_b", start: 419.38, dur: 14.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pickling_lime.png" darken={0} kbPhase={2} /> },
  { key: "hu_pickling_lime_c", start: 434.08, dur: 14.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pickling_lime.png" darken={0} kbPhase={3} /> },
  { key: "hu_pickling_lime_undefined", start: 448.78, dur: 14.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pickling_lime.png" darken={0} kbPhase={4} /> },
  { key: "hu_pickling_lime_undefined", start: 463.48, dur: 14.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pickling_lime.png" darken={0} kbPhase={5} /> },
  { key: "hu_scale_a", start: 477.66, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scale.png" darken={0} kbPhase={1} /> },
  { key: "hu_scale_b", start: 483.95, dur: 6.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scale.png" darken={0} kbPhase={2} /> },
  { key: "hu_limewater_a", start: 489.74, dur: 5.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_limewater.png" darken={0} kbPhase={1} /> },
  { key: "hu_limewater_b", start: 495.71, dur: 5.97, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_limewater.png" darken={0} kbPhase={2} /> },
  { key: "hu_lower_eggs", start: 501.18, dur: 5.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/hu_lower_eggs.mp4" darken={0} clipDur={6.01} /> },
  { key: "hu_submerged_a", start: 505.92, dur: 6.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_submerged.png" darken={0} kbPhase={1} /> },
  { key: "hu_submerged_b", start: 512.42, dur: 6.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_submerged.png" darken={0} kbPhase={2} /> },
  { key: "hu_pantry", start: 518.43, dur: 9.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pantry.png" darken={0} /> },
  { key: "hu_gather_eggs_a", start: 526.96, dur: 5.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_gather_eggs.png" darken={0} kbPhase={1} /> },
  { key: "hu_gather_eggs_b", start: 532.82, dur: 5.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_gather_eggs.png" darken={0} kbPhase={2} /> },
  { key: "hu_gather_eggs_c", start: 538.68, dur: 5.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_gather_eggs.png" darken={0} kbPhase={3} /> },
  { key: "hu_bucket_eggs_a", start: 544.03, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_bucket_eggs.png" darken={0} kbPhase={1} /> },
  { key: "hu_bucket_eggs_b", start: 550.61, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_bucket_eggs.png" darken={0} kbPhase={2} /> },
  { key: "hu_bucket_eggs_c", start: 557.19, dur: 6.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_bucket_eggs.png" darken={0} kbPhase={3} /> },
  { key: "hu_duck_eggs_a", start: 563.26, dur: 9.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_duck_eggs.png" darken={0} kbPhase={1} /> },
  { key: "hu_duck_eggs_b", start: 573.14, dur: 9.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_duck_eggs.png" darken={0} kbPhase={2} /> },
  { key: "hu_duck_eggs_c", start: 583.02, dur: 9.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_duck_eggs.png" darken={0} kbPhase={3} /> },
  { key: "hu_duck_eggs_undefined", start: 592.9, dur: 9.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_duck_eggs.png" darken={0} kbPhase={4} /> },
  { key: "hu_duck_eggs_undefined", start: 602.78, dur: 9.87, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_duck_eggs.png" darken={0} kbPhase={5} /> },
  { key: "cmp_history", start: 612.15, dur: 55.92, kind: "timeline", el: (d) => <SagaTimeline durationInFrames={d} events={[{"year":"1800s","label":"waterglass on farms & ships","accent":"amber"},{"year":"1940s","label":"wartime kitchens everywhere","accent":"amber"},{"year":"Now","label":"the fridge made folks forget","accent":"danger"}]} eyebrow="It is not new" title="Proven for centuries" /> },
  { key: "hu_old_crock", start: 668.07, dur: 5.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_old_crock.png" darken={0} /> },
  { key: "hu_ship", start: 672.99, dur: 5.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_ship.png" darken={0} /> },
  { key: "hu_wagon", start: 678.19, dur: 8.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_wagon.png" darken={0} /> },
  { key: "hu_war_kitchen_a", start: 686.26, dur: 13.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_war_kitchen.png" darken={0} kbPhase={1} /> },
  { key: "hu_war_kitchen_b", start: 699.47, dur: 13.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_war_kitchen.png" darken={0} kbPhase={2} /> },
  { key: "hu_war_kitchen_c", start: 712.68, dur: 13.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_war_kitchen.png" darken={0} kbPhase={3} /> },
  { key: "hu_war_kitchen_undefined", start: 725.89, dur: 13.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_war_kitchen.png" darken={0} kbPhase={4} /> },
  { key: "hu_war_kitchen_undefined", start: 739.1, dur: 13.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_war_kitchen.png" darken={0} kbPhase={5} /> },
  { key: "hu_cake_a", start: 751.8, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cake.png" darken={0} kbPhase={1} /> },
  { key: "hu_cake_b", start: 758.38, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cake.png" darken={0} kbPhase={2} /> },
  { key: "hu_cake_c", start: 764.96, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cake.png" darken={0} kbPhase={3} /> },
  { key: "hu_cake_undefined", start: 771.54, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cake.png" darken={0} kbPhase={4} /> },
  { key: "hu_cake_undefined", start: 778.12, dur: 6.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cake.png" darken={0} kbPhase={5} /> },
  { key: "hu_grease_a", start: 784.2, dur: 5.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_grease.png" darken={0} kbPhase={1} /> },
  { key: "hu_grease_b", start: 789.78, dur: 5.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_grease.png" darken={0} kbPhase={2} /> },
  { key: "hu_grease_c", start: 795.36, dur: 5.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_grease.png" darken={0} kbPhase={3} /> },
  { key: "hu_pack_sand_a", start: 800.44, dur: 9.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pack_sand.png" darken={0} kbPhase={1} /> },
  { key: "hu_pack_sand_b", start: 810.29, dur: 9.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pack_sand.png" darken={0} kbPhase={2} /> },
  { key: "hu_pack_sand_c", start: 820.14, dur: 9.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pack_sand.png" darken={0} kbPhase={3} /> },
  { key: "hu_pack_sand_undefined", start: 829.99, dur: 9.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pack_sand.png" darken={0} kbPhase={4} /> },
  { key: "hu_pack_sand_undefined", start: 839.84, dur: 9.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_pack_sand.png" darken={0} kbPhase={5} /> },
  { key: "hu_float_test_a", start: 849.2, dur: 7.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_float_test.png" darken={0} kbPhase={1} /> },
  { key: "hu_float_test_b", start: 856.8, dur: 7.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_float_test.png" darken={0} kbPhase={2} /> },
  { key: "hu_float_test_c", start: 864.4, dur: 7.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_float_test.png" darken={0} kbPhase={3} /> },
  { key: "hu_float_test_undefined", start: 872, dur: 7.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_float_test.png" darken={0} kbPhase={4} /> },
  { key: "hu_float_test_undefined", start: 879.6, dur: 7.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_float_test.png" darken={0} kbPhase={5} /> },
  { key: "hu_scramble_a", start: 886.72, dur: 8.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scramble.png" darken={0} kbPhase={1} /> },
  { key: "hu_scramble_b", start: 895.37, dur: 8.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scramble.png" darken={0} kbPhase={2} /> },
  { key: "hu_scramble_c", start: 904.02, dur: 8.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scramble.png" darken={0} kbPhase={3} /> },
  { key: "hu_scramble_undefined", start: 912.67, dur: 8.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scramble.png" darken={0} kbPhase={4} /> },
  { key: "hu_scramble_undefined", start: 921.32, dur: 8.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_scramble.png" darken={0} kbPhase={5} /> },
  { key: "cmp_mistakes", start: 929.45, dur: 22.11, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="The 4 mistakes" items={[{"text":"Never use washed / store eggs","state":"done"},{"text":"Only whole, sound, clean eggs","state":"done"},{"text":"Keep them under the water, cool","state":"done"},{"text":"No rusting metal · mark the date","state":"done"}]} eyebrow="…and every one is easy to avoid" accent="danger" hue="amber" image="img/cmp_mistakes_bg.png" /> },
  { key: "hu_carton", start: 951.56, dur: 9.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_carton.png" darken={0} /> },
  { key: "hu_cracked_a", start: 960.51, dur: 5.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cracked.png" darken={0} kbPhase={1} /> },
  { key: "hu_cracked_b", start: 965.85, dur: 5.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cracked.png" darken={0} kbPhase={2} /> },
  { key: "hu_cracked_c", start: 971.19, dur: 5.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_cracked.png" darken={0} kbPhase={3} /> },
  { key: "cmp_cost", start: 976.03, dur: 60.97, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Store, twice a week","value":100,"display":"$100s/yr","sub":"+ empty shelves when it's bad","tone":"danger"},{"label":"A crock + lime","value":2,"display":"~$2","sub":"keeps a year, no power","winner":true}]} eyebrow="Store vs. the crock" title="A year of eggs" unit="USD" accent="good" hue="amber" /> },
  { key: "cmp_recap", start: 1141.9, dur: 39.65, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Get fresh unwashed eggs"},{"title":"1 oz lime per quart of water"},{"title":"Submerge · cover · cool & dark"}]} eyebrow="Start one crock" title="This week" accent="good" hue="cold" /> },
  { key: "hu_farm_market_a", start: 1181.55, dur: 16.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_farm_market.png" darken={0} kbPhase={1} /> },
  { key: "hu_farm_market_b", start: 1198.27, dur: 16.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_farm_market.png" darken={0} kbPhase={2} /> },
  { key: "hu_farm_market_c", start: 1214.99, dur: 16.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_farm_market.png" darken={0} kbPhase={3} /> },
  { key: "hu_farm_market_undefined", start: 1231.71, dur: 16.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_farm_market.png" darken={0} kbPhase={4} /> },
  { key: "hu_farm_market_undefined", start: 1248.43, dur: 16.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/hu_farm_market.png" darken={0} kbPhase={5} /> },
  { key: "cmp_next", start: 1264.65, dur: 57.98, kind: "nextvideo", el: (d) => <NextVideoEndcard durationInFrames={d} title="Keep butter sweet for a year — no icebox" kicker="Next time" sub="Buried in nothing but a crock of cold water and one thing drawn up from the well." /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [
  { key: "ovp_12", start: 11.91, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="A year of eggs · no fridge" accent="amber" pos="top" /> },
  { key: "ovp_135", start: 135.32, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="7,000 pores in every shell" accent="cold" pos="bottom" /> },
  { key: "ovp_272", start: 272, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="Washed = you must keep buying" accent="danger" pos="bottom" /> },
  { key: "ovx_291", start: 290.77, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} text="ILLEGAL" label="to wash eggs in Europe" corner="TR" accent="amber" /> },
  { key: "ov_478", start: 477.66, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} value={1} suffix=" oz" label="lime per quart (by weight)" corner="TL" accent="cold" /> },
  { key: "ovg_594", start: 593.62, dur: 4.2, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="📌 Free guide — pinned in the comments" accent="amber" pos="bottom" /> },
  { key: "ovp_865", start: 864.56, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="Floats = bad · sinks = good" accent="cold" pos="bottom" /> },
  { key: "ovg_825", start: 824.71, dur: 4.2, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="📌 All the methods — free guide (comments)" accent="amber" pos="bottom" /> },
  { key: "ovp_1113", start: 1113.25, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="The crock makes you free" accent="cold" pos="bottom" /> },
  { key: "ovg_1288", start: 1287.97, dur: 4.2, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="📌 Free guide + 90 old skills — in the comments" accent="amber" pos="bottom" /> },
];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":11.91,"role":"popUp","vol":0.32},{"at":25,"role":"popUp","vol":0.32},{"at":135.32,"role":"popUp","vol":0.32},{"at":181.06,"role":"popUp","vol":0.32},{"at":272,"role":"popUp","vol":0.32},{"at":290.77,"role":"popUp","vol":0.32},{"at":348.88,"role":"popUp","vol":0.32},{"at":477.66,"role":"popUp","vol":0.32},{"at":593.62,"role":"popUp","vol":0.32},{"at":612.15,"role":"popUp","vol":0.32},{"at":824.71,"role":"popUp","vol":0.32},{"at":864.56,"role":"popUp","vol":0.32},{"at":929.45,"role":"popUp","vol":0.32},{"at":976.03,"role":"popUp","vol":0.32},{"at":1113.25,"role":"popUp","vol":0.32},{"at":1141.9,"role":"popUp","vol":0.32},{"at":1264.65,"role":"popUp","vol":0.32},{"at":1287.97,"role":"popUp","vol":0.32}];
