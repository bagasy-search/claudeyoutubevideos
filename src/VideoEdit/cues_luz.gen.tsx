// cues_luz.gen.tsx — GENERADO por beatsheet.mjs desde luz.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/luz.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { SplitList } from "./scenes/SplitList";
import { StatBig } from "./scenes/StatBig";
import { ImpactReveal } from "./scenes/ImpactReveal";
import { StatTag } from "./scenes/StatTag";
import { PhraseTag } from "./scenes/PhraseTag";
import { BarCompare } from "./scenes/BarCompare";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { WaterLensLight } from "./scenes/WaterLensLight";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { NextVideoEndcard } from "./scenes/NextVideoEndcard";
import { DocLabel } from "./overlays/DocLabel";
import { DateStamp } from "./overlays/DateStamp";

const G = COLORS.good;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "lz_candle_dark", start: 2.2, dur: 6.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_candle_dark.mp4" darken={0} /> },
  { key: "lz_candle_table", start: 8.2, dur: 8.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_candle_table.mp4" darken={0} /> },
  { key: "lz_weak_flame", start: 16.2, dur: 4.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_weak_flame.mp4" darken={0} /> },
  { key: "lz_fine_print", start: 20.4, dur: 8.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_fine_print.mp4" darken={0} /> },
  { key: "lz_jar_water", start: 28.8, dur: 8.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_jar_water.mp4" darken={0} /> },
  { key: "cmp_hook", start: 36.8, dur: 8, kind: "impact", el: (d) => <ImpactReveal durationInFrames={d} image="img/cmp_hook_bg.png" impact="Bright enough to thread a needle." setup="One candle. One jar of water." impactAccent="amber" hitAt={1.6} boom={0} darken={0.4} /> },
  { key: "lz_light_pool", start: 44.8, dur: 8.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_light_pool.mp4" darken={0} /> },
  { key: "lz_thread_needle", start: 53.1, dur: 4.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_thread_needle.mp4" darken={0} /> },
  { key: "lz_handwork", start: 57.3, dur: 9.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_handwork.png" darken={0} /> },
  { key: "lz_lacemaker_old", start: 66.1, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lacemaker_old.mp4" darken={0} /> },
  { key: "lz_lightbulb", start: 74, dur: 4.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lightbulb.mp4" darken={0} /> },
  { key: "lz_old_home_night", start: 78.2, dur: 13.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_old_home_night.mp4" darken={0} /> },
  { key: "lz_great_grandpa", start: 115.6, dur: 5.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_great_grandpa.mp4" darken={0} /> },
  { key: "lz_cool_pipe", start: 120.3, dur: 4.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_cool_pipe.mp4" darken={0} /> },
  { key: "lz_lamp_glow", start: 124.6, dur: 4.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lamp_glow.mp4" darken={0} /> },
  { key: "lz_switch_wall", start: 128.4, dur: 14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_switch_wall.mp4" darken={0} /> },
  { key: "lz_room_lit", start: 141.9, dur: 12.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_room_lit.mp4" darken={0} /> },
  { key: "lz_candle_macro2", start: 153.8, dur: 8.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_candle_macro2.png" darken={0} /> },
  { key: "lz_lots_light", start: 161.8, dur: 9.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lots_light.mp4" darken={0} /> },
  { key: "cmp_thieves", start: 170.4, dur: 8, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Three thieves of light" items={[{"text":"Spreading — light fans out in a sphere","state":"done"},{"text":"Dark walls — they swallow it","state":"done"},{"text":"Not concentrated where you work","state":"done"}]} eyebrow="Why one candle seems dim" accent="danger" hue="amber" image="img/cmp_thieves_bg.png" /> },
  { key: "lz_ripples", start: 178.4, dur: 12.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_ripples.mp4" darken={0} /> },
  { key: "lz_far_dim", start: 190.6, dur: 12.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_far_dim.mp4" darken={0} /> },
  { key: "lz_ceiling_waste", start: 202.3, dur: 8.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_ceiling_waste.mp4" darken={0} /> },
  { key: "lz_dark_wall", start: 210.7, dur: 8.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_dark_wall.mp4" darken={0} /> },
  { key: "lz_soot_wall", start: 218.8, dur: 8.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_soot_wall.mp4" darken={0} /> },
  { key: "cmp_lens", start: 227, dur: 13, kind: "waterlens", el: (d) => <WaterLensLight durationInFrames={d} eyebrow="The masterpiece" title="A globe of water is a lens" flameLabel="One small flame" lensLabel="Globe of water = a lens" poolLabel="Bright pool of light" /> },
  { key: "cmp_art", start: 240, dur: 19.6, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Gather the light"},{"title":"Reflect it forward"},{"title":"Concentrate it on the work"}]} eyebrow="Not more fire" title="The whole art" accent="good" hue="amber" /> },
  { key: "lz_round_globe", start: 259.6, dur: 13.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_round_globe.mp4" darken={0} /> },
  { key: "lz_lens_spectacles", start: 272.9, dur: 13.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lens_spectacles.mp4" darken={0} /> },
  { key: "lz_refraction", start: 285.6, dur: 11.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_refraction.mp4" darken={0} /> },
  { key: "cmp_bright", start: 296.8, dur: 8.3, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Bare candle","value":1,"display":"dim","tone":"danger"},{"label":"Through the water lens","value":9,"display":"bright","winner":true}]} eyebrow="Bare vs through the lens" title="Same flame, on your work" unit="light" accent="good" hue="amber" /> },
  { key: "lz_lace_europe", start: 305.1, dur: 8.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lace_europe.mp4" darken={0} /> },
  { key: "cmp_lacemaker", start: 313.5, dur: 8.2, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="1 candle · 4 workers" image="img/cmp_lacemaker_bg.png" eyebrow="The lacemaker's lamp" caption="water globes around one flame let four women do the finest needlework at night" accent="good" hue="amber" /> },
  { key: "lz_condensing_globe", start: 321.7, dur: 16.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_condensing_globe.mp4" darken={0} /> },
  { key: "lz_women_sewing", start: 337.9, dur: 8.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_women_sewing.mp4" darken={0} /> },
  { key: "lz_watchmaker", start: 346, dur: 13.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_watchmaker.mp4" darken={0} /> },
  { key: "lz_jar_cheap", start: 359.4, dur: 16.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_jar_cheap.mp4" darken={0} /> },
  { key: "lz_grandma_window", start: 412.1, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_grandma_window.mp4" darken={0} /> },
  { key: "lz_needle_night", start: 420, dur: 4.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_needle_night.mp4" darken={0} /> },
  { key: "lz_white_cottage_in", start: 423.7, dur: 12.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_white_cottage_in.mp4" darken={0} /> },
  { key: "lz_mother_daughter", start: 435.8, dur: 9.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_mother_daughter.mp4" darken={0} /> },
  { key: "lz_bulb_on", start: 444.8, dur: 13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_bulb_on.mp4" darken={0} /> },
  { key: "cmp_invsq", start: 457.3, dur: 12, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={4} suffix="×" label="dimmer at double the distance — light falls off with the square" eyebrow="The law" accent="danger" hue="cold" /> },
  { key: "lz_double_distance", start: 469.3, dur: 12.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_double_distance.mp4" darken={0} /> },
  { key: "lz_candle_book", start: 481.4, dur: 13.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_candle_book.mp4" darken={0} /> },
  { key: "lz_spread_thin", start: 494.2, dur: 12.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_spread_thin.mp4" darken={0} /> },
  { key: "lz_reflector_back", start: 505.9, dur: 12.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_reflector_back.mp4" darken={0} /> },
  { key: "lz_white_bounce", start: 518.2, dur: 20.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_white_bounce.mp4" darken={0} /> },
  { key: "lz_light_backward", start: 537.9, dur: 17.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_light_backward.png" darken={0} /> },
  { key: "cmp_reflector", start: 555, dur: 8.8, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="≈ 2×" image="img/cmp_reflector_bg.png" eyebrow="The reflector" caption="a shiny curved surface behind the flame turns the wasted backward light forward" accent="good" hue="amber" /> },
  { key: "lz_mirror_behind", start: 563.8, dur: 12.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_mirror_behind.mp4" darken={0} /> },
  { key: "lz_old_lantern", start: 575.7, dur: 12.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_old_lantern.mp4" darken={0} /> },
  { key: "lz_double_light", start: 588.1, dur: 16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_double_light.png" darken={0} /> },
  { key: "cmp_whitewash", start: 603.6, dur: 9.1, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Whitewash the walls" items={[{"text":"White reflects most of the light","state":"done"},{"text":"Dark walls eat it","state":"done"},{"text":"Lime + water, brushed on","state":"done"},{"text":"Makes every candle worth 2–3","state":"done"}]} eyebrow="Free light" accent="good" hue="amber" image="img/cmp_whitewash_bg.png" /> },
  { key: "lz_whitewash_wall", start: 612.7, dur: 12.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_whitewash_wall.mp4" darken={0} /> },
  { key: "lz_lime_brush", start: 624.8, dur: 13.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_lime_brush.mp4" darken={0} /> },
  { key: "lz_white_room_glow", start: 637.4, dur: 13.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_white_room_glow.mp4" darken={0} /> },
  { key: "lz_dark_swallow", start: 650.1, dur: 13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_dark_swallow.mp4" darken={0} /> },
  { key: "lz_old_dairy", start: 662.6, dur: 17.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_old_dairy.mp4" darken={0} /> },
  { key: "cmp_lamp", start: 679.8, dur: 20.5, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="The safe little flame" items={[{"text":"A jar, some olive oil, a wick","state":"done"},{"text":"Cheap, clean, barely any soot","state":"done"},{"text":"Won't flash or spread fire if spilled","state":"done"},{"text":"Trim the wick small & steady","state":"done"}]} eyebrow="Olive oil lamp" accent="good" hue="amber" image="img/cmp_lamp_bg.png" /> },
  { key: "lz_oil_lamp", start: 700.3, dur: 17.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_oil_lamp.mp4" darken={0} /> },
  { key: "lz_olive_oil", start: 717.3, dur: 16.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_olive_oil.mp4" darken={0} /> },
  { key: "cmp_setup", start: 733.7, dur: 19.2, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/cmp_setup_bg.png" annotations={[{"kind":"circle","x":0.3,"y":0.55,"w":0.13,"label":"Reflector behind","color":"cold"},{"kind":"circle","x":0.5,"y":0.55,"w":0.1,"label":"One flame","color":"amber"},{"kind":"arrow","x":0.7,"y":0.5,"fromX":0.88,"fromY":0.2,"label":"Water globe in front","color":"cold"}]} eyebrow="Put the three together" hue="amber" /> },
  { key: "lz_setup_all", start: 752.9, dur: 12.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_setup_all.mp4" darken={0} /> },
  { key: "lz_bright_work", start: 764.9, dur: 16.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_bright_work.mp4" darken={0} /> },
  { key: "lz_fine_work_hist", start: 780.5, dur: 17.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_fine_work_hist.mp4" darken={0} /> },
  { key: "lz_jam_jar_lamp", start: 797.3, dur: 16.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_jam_jar_lamp.png" darken={0} /> },
  { key: "lz_wick_float", start: 813.4, dur: 16.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_wick_float.mp4" darken={0} /> },
  { key: "lz_trim_wick", start: 829.7, dur: 17.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_trim_wick.mp4" darken={0} /> },
  { key: "lz_round_bottle", start: 846.6, dur: 12.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_round_bottle.mp4" darken={0} /> },
  { key: "lz_clear_water", start: 859, dur: 16.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_clear_water.mp4" darken={0} /> },
  { key: "lz_spoon_reflector", start: 875.4, dur: 21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_spoon_reflector.mp4" darken={0} /> },
  { key: "lz_limewash_again", start: 895.9, dur: 20.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_limewash_again.mp4" darken={0} /> },
  { key: "lz_white_dry", start: 916.2, dur: 16.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_white_dry.png" darken={0} /> },
  { key: "lz_white_workshop", start: 932.1, dur: 13.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_white_workshop.mp4" darken={0} /> },
  { key: "lz_pale_walls", start: 944.9, dur: 17.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_pale_walls.mp4" darken={0} /> },
  { key: "lz_dark_vs_white", start: 961.5, dur: 17, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_dark_vs_white.mp4" darken={0} /> },
  { key: "cmp_cost", start: 978, dur: 16.4, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Grid + bulbs","value":80,"display":"$/month forever","tone":"danger"},{"label":"Lamp + jar + lime","value":1,"display":"a few $ once","winner":true}]} eyebrow="Old way vs modern" title="What light costs" unit="cost" accent="good" hue="amber" /> },
  { key: "lz_jar_tin_lime", start: 994.4, dur: 12.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_jar_tin_lime.mp4" darken={0} /> },
  { key: "lz_blackout_lamp", start: 1006.6, dur: 13.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_blackout_lamp.mp4" darken={0} /> },
  { key: "lz_grid_bill", start: 1019.3, dur: 8.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_grid_bill.mp4" darken={0} /> },
  { key: "lz_dead_flashlight", start: 1027.6, dur: 8.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_dead_flashlight.mp4" darken={0} /> },
  { key: "cmp_mistakes", start: 1035.4, dur: 20.8, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Two mistakes" items={[{"text":"Dark, cluttered surroundings — give light something white to bounce off","state":"done"},{"text":"A flat jar — the globe must be ROUND to focus","state":"done"}]} eyebrow="Then it just works" accent="danger" hue="amber" image="img/cmp_mistakes_bg.png" /> },
  { key: "lz_dark_clutter", start: 1056.2, dur: 16.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_dark_clutter.mp4" darken={0} /> },
  { key: "lz_white_behind", start: 1071.9, dur: 16.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_white_behind.mp4" darken={0} /> },
  { key: "lz_flat_jar_bad", start: 1088.2, dur: 11.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_flat_jar_bad.mp4" darken={0} /> },
  { key: "lz_round_focus", start: 1099.6, dur: 9.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_round_focus.png" darken={0} /> },
  { key: "lz_slide_focus", start: 1108.2, dur: 30, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_slide_focus.mp4" darken={0} /> },
  { key: "cmp_lesson", start: 1137.7, dur: 17, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="The same lesson" items={["The buried cooling pipe","The pump that climbs the hill","The candle through a globe of water"]} accent={G} /> },
  { key: "lz_three_methods", start: 1186.9, dur: 16.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_three_methods.mp4" darken={0} /> },
  { key: "lz_make_own", start: 1203.2, dur: 8.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_make_own.mp4" darken={0} /> },
  { key: "cmp_tonight", start: 1211.4, dur: 7.5, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Light one candle"},{"title":"Set a jar of water in front"},{"title":"Slide it until the print snaps clear"}]} eyebrow="Try it" title="Tonight, in 10 minutes" accent="good" hue="amber" /> },
  { key: "lz_turn_off", start: 1218.9, dur: 8.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_turn_off.mp4" darken={0} /> },
  { key: "lz_light_one", start: 1226.6, dur: 8.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_light_one.mp4" darken={0} /> },
  { key: "lz_jar_book", start: 1234.7, dur: 13.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/lz_jar_book.mp4" darken={0} /> },
  { key: "lz_print_jumps", start: 1247.4, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_print_jumps.png" darken={0} /> },
  { key: "lz_foil_behind", start: 1255.3, dur: 8.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_foil_behind.png" darken={0} /> },
  { key: "lz_paint_white", start: 1263.3, dur: 8.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_paint_white.png" darken={0} /> },
  { key: "cmp_next", start: 1290, dur: 8.8, kind: "nextvideo", el: (d) => <NextVideoEndcard durationInFrames={d} title="Keep food cold with no refrigerator" kicker="Next time" sub="Milk, meat, butter — with the ground, some clay, and how water behaves when the air is dry." /> },
  { key: "lz_milk_butter", start: 1298.8, dur: 4.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_milk_butter.png" darken={0} /> },
  { key: "lz_clay_pot", start: 1303.2, dur: 12.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/lz_clay_pot.png" darken={0} /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [
  { key: "ov_57", start: 57, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} value={1} suffix=" candle" label="+ a jar of water" corner="TR" accent="amber" /> },
  { key: "ovp_82", start: 82, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="How the old folks lit their homes" accent="amber" pos="bottom" /> },
  { key: "ovy_67", start: 67, dur: 3.6, kind: "datestamp", el: (d) => <DateStamp durationInFrames={d} value="200 yrs" label="ago — then forgotten" accent="amber" corner="TR" /> },
  { key: "ovp_170", start: 170, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="It's not the flame — it's wasted light" accent="amber" pos="bottom" /> },
  { key: "ovd_180", start: 180, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="Thief #1" sub="spreading" accent="amber" corner="BL" /> },
  { key: "ovd_211", start: 211, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="Thief #2" sub="dark walls" accent="amber" corner="BL" /> },
  { key: "ovd_228", start: 228, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="Thief #3" sub="not concentrated" accent="amber" corner="BL" /> },
  { key: "ovp_247", start: 247, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="Gather · reflect · concentrate" accent="cold" pos="bottom" /> },
  { key: "ovd_260", start: 260, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="The water lens" sub="a real magnifying lens" accent="amber" corner="BL" /> },
  { key: "ov_323", start: 323, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} text="1 : 4" label="one candle, four workers" corner="TR" accent="cold" /> },
  { key: "ovp_316", start: 316, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="The lacemaker's lamp" accent="amber" pos="top" /> },
  { key: "ov_469", start: 469, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} text="½ → ¼" label="double the distance" corner="TR" accent="cold" /> },
  { key: "ov_485", start: 485, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} text="×3 → 1/9" label="triple it" corner="TL" accent="cold" /> },
  { key: "ovd_540", start: 540, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="The reflector" sub="shiny, curved, behind" accent="amber" corner="BL" /> },
  { key: "ov_588", start: 588, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} value={2} suffix="×" label="useful light" corner="TR" accent="amber" /> },
  { key: "ovd_620", start: 620, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="Whitewash" sub="white walls = free light" accent="amber" corner="BL" /> },
  { key: "ovp_683", start: 683, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="A bag of lime is a lighting upgrade" accent="amber" pos="bottom" /> },
  { key: "ovd_704", start: 704, dur: 3.4, kind: "doclabel", el: (d) => <DocLabel durationInFrames={d} label="Olive oil lamp" sub="safe · clean · cheap" accent="amber" corner="BL" /> },
  { key: "ovp_745", start: 745, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="Won't spread fire if spilled" accent="cold" pos="bottom" /> },
  { key: "ov_1002", start: 1002, dur: 3.6, kind: "stattag", el: (d) => <StatTag durationInFrames={d} text="a few $" label="once, then pennies/night" corner="TR" accent="cold" /> },
  { key: "ovp_1035", start: 1035, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="We traded a skill for a bill" accent="danger" pos="bottom" /> },
  { key: "ovp_1099", start: 1099, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="The globe must be ROUND" accent="danger" pos="bottom" /> },
  { key: "ovp_1211", start: 1211, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="Push back the dark with your own hands" accent="amber" pos="bottom" /> },
  { key: "ovp_1247", start: 1247, dur: 3.4, kind: "phrasetag", el: (d) => <PhraseTag durationInFrames={d} text="Watch the print snap clear" accent="cold" pos="bottom" /> },
];
