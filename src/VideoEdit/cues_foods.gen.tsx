// cues_foods.gen.tsx — GENERADO por beatsheet.mjs desde foods.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/foods.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { BlurExplainer } from "./scenes/BlurExplainer";
import { StatBig } from "./scenes/StatBig";
import { CalloutMark } from "./scenes/CalloutMark";
import { KeyPhrase } from "./scenes/KeyPhrase";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "f_katie", start: 5.2, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_katie.png" darken={0} /> },
  { key: "f_hands", start: 8.2, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_hands.png" darken={0} /> },
  { key: "f_dress", start: 11.2, dur: 2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_dress.png" darken={0} /> },
  { key: "f_window", start: 13.2, dur: 2.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_window.png" darken={0} /> },
  { key: "f_storm", start: 15.52, dur: 2.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_storm.mp4" darken={0} clipDur={8.07} /> },
  { key: "f_iceline", start: 18.5, dur: 2.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_iceline.mp4" darken={0} clipDur={8.09} /> },
  { key: "f_darkfarm", start: 21.2, dur: 3.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_darkfarm.png" darken={0} /> },
  { key: "f_amishkit", start: 24.61, dur: 2.89, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_amishkit.png" darken={0} /> },
  { key: "f_darkhouse", start: 27.5, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_darkhouse.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_mother", start: 30.5, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_mother.png" darken={0} /> },
  { key: "f_boyfever", start: 33.5, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_boyfever.png" darken={0} /> },
  { key: "f_motherlamp", start: 36.5, dur: 1.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_motherlamp.png" darken={0} /> },
  { key: "f_driveway", start: 38, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_driveway.png" darken={0} /> },
  { key: "f_bags", start: 41, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_bags.mp4" darken={0} clipDur={8.07} /> },
  { key: "f_freezer", start: 44, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_freezer.mp4" darken={0} clipDur={8.07} /> },
  { key: "f_crying", start: 47, dur: 2.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_crying.png" darken={0} /> },
  { key: "f_spoilhands", start: 49.36, dur: 2.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_spoilhands.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_spoildetail", start: 52, dur: 2.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_spoildetail.mp4" darken={0} clipDur={5.96} /> },
  { key: "f_vintad", start: 54.45, dur: 3.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_vintad.png" darken={0} /> },
  { key: "f_poison", start: 57.5, dur: 4.5, kind: "keyphrase", el: (d) => <KeyPhrase durationInFrames={d} text="Dangerous. Poison." src="img/f_poison.png" accent="danger" fontSize={104} /> },
  { key: "f_trash", start: 62, dur: 2.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_trash.mp4" darken={0} clipDur={5.74} /> },
  { key: "f_empty", start: 64.88, dur: 2.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_empty.mp4" darken={0} clipDur={8.07} /> },
  { key: "f_porch", start: 67.36, dur: 2.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_porch.png" darken={0} /> },
  { key: "f_calmface", start: 69.84, dur: 1.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_calmface.png" darken={0} /> },
  { key: "f_cellar", start: 71.44, dur: 2.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_cellar.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_buttermilk", start: 74.4, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_buttermilk.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_broth", start: 77.4, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_broth.mp4" darken={0} clipDur={8.09} /> },
  { key: "f_loaf", start: 80.4, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_loaf.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_eggs", start: 83.4, dur: 3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_eggs.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_carry", start: 86.4, dur: 1.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_carry.png" darken={0} /> },
  { key: "f_table", start: 87.92, dur: 2.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_table.png" darken={0} /> },
  { key: "f_ellenlook", start: 90.9, dur: 2.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_ellenlook.png" darken={0} /> },
  { key: "f_issafe", start: 93.2, dur: 2.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_issafe.mp4" darken={0} clipDur={7.31} /> },
  { key: "f_childbroth", start: 112.05, dur: 2.91, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_childbroth.png" darken={0} /> },
  { key: "f_wellboy", start: 114.96, dur: 2.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/f_wellboy.png" darken={0} /> },
  { key: "f_title20", start: 139.9, dur: 7.86, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={20} suffix=" foods" label="your great-grandmother kept right out on the counter — on purpose" eyebrow="The old way" accent="good" hue="amber" /> },
  { key: "f_counter", start: 147.76, dur: 3.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_counter.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_fridgeoff", start: 151.7, dur: 3.82, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_fridgeoff.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_crocks", start: 173.36, dur: 2.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_crocks.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_stovepot", start: 175.7, dur: 2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_stovepot.mp4" darken={0} clipDur={8.09} /> },
  { key: "f_eggbowl", start: 177.7, dur: 1.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/f_eggbowl.mp4" darken={0} clipDur={8.08} /> },
  { key: "f_book", start: 179.68, dur: 15.32, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="90" image="img/f_book.png" eyebrow="Everything in one place" caption="every old method, every exact amount — The Plain Almanac. Link in the description." accent="good" hue="amber" /> },
  { key: "fo_043", start: 213.92, dur: 3.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_043.mp4" darken={0} clipDur={8.07} /> },
  { key: "fo_044", start: 217.04, dur: 5.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_044.mp4" darken={0} clipDur={8.08} /> },
  { key: "fo_045", start: 222.8, dur: 7.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_045.mp4" darken={0} clipDur={8.04} /> },
  { key: "fo_046", start: 230.16, dur: 5.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_046.mp4" darken={0} clipDur={8.07} /> },
  { key: "fo_047", start: 235.92, dur: 5.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_047.mp4" darken={0} clipDur={8.07} /> },
  { key: "fo_048", start: 241.6, dur: 7.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_048.mp4" darken={0} clipDur={8.07} /> },
  { key: "fo_049", start: 248.64, dur: 5.33, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_049.mp4" darken={0} clipDur={8.08} /> },
  { key: "fo_050", start: 253.97, dur: 7.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_050.mp4" darken={0} clipDur={8.09} /> },
  { key: "fo_051", start: 261.44, dur: 3.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_051.mp4" darken={0} clipDur={8.09} /> },
  { key: "fo_052", start: 264.48, dur: 2.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_052.mp4" darken={0} clipDur={4.5} /> },
  { key: "fo_053", start: 266.96, dur: 2.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_053.mp4" darken={0} clipDur={8.11} /> },
  { key: "fo_058", start: 283.36, dur: 4.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_058.mp4" darken={0} clipDur={8.06} /> },
  { key: "fo_059", start: 287.52, dur: 3.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_059.mp4" darken={0} clipDur={8.07} /> },
  { key: "fo_060", start: 291.04, dur: 2.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_060.mp4" darken={0} clipDur={7.05} /> },
  { key: "fo_061", start: 293.92, dur: 3.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_061.mp4" darken={0} clipDur={8.08} /> },
  { key: "fo_062", start: 297.44, dur: 6.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fo_062.mp4" darken={0} clipDur={8.11} /> },
  { key: "bm_be", start: 312, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_072.mp4" image="img/bm_inset.png" eyebrow="Buttermilk" title="Cultured on the counter" body="Fresh whole milk left out — the bacteria sour it into the best baking liquid there is." side="right" /> },
  { key: "bm_stat", start: 321, dur: 33, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={24} suffix="–48 h" label="on the counter until thick and tangy" eyebrow="No fridge" accent="good" hue="amber" /> },
  { key: "sm_be", start: 365, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_083.mp4" image="img/sm_inset.png" eyebrow="Soured milk" title="Don't pour it out" body="Tangy smell, thickened but not curdled = cultured, not spoiled. Use one cup for buttermilk." side="right" /> },
  { key: "sm_stat", start: 374, dur: 25, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1} suffix=" cup" label="soured milk = buttermilk in any recipe" eyebrow="Never waste it" accent="good" hue="amber" /> },
  { key: "bb_be", start: 405, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_097.mp4" image="img/bb_inset.png" eyebrow="Bone broth" title="The perpetual pot" body="Bones simmer on the back burner for days. A hard boil each morning resets it — it never dies." side="right" /> },
  { key: "bb_stat", start: 414, dur: 32, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={0} prefix="$" label="costs almost nothing — richer than any carton" eyebrow="The back burner" accent="good" hue="amber" /> },
  { key: "vm_be", start: 457, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_111.mp4" image="img/vm_inset.png" eyebrow="The vinegar mother" title="Scraps into endless vinegar" body="Apple scraps, water, a little raw sugar. In weeks a living mother forms — free vinegar forever." side="right" /> },
  { key: "vm_stat", start: 466, dur: 30, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1} prefix="$" label="of scraps replaces a $4–$8 bottle, forever" eyebrow="Free vinegar" accent="good" hue="amber" /> },
  { key: "wh_be", start: 507, dur: 23, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_120.mp4" image="img/wh_inset.png" eyebrow="Whey" title="Never wasted" body="The liquid that drains off dairy — tenderizes bread, enriches soup, feeds the tomatoes." side="right" /> },
  { key: "sk_be", start: 536, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_131.mp4" image="img/sk_inset.png" eyebrow="Sauerkraut" title="Safer as it sits" body="Cabbage and salt under its own brine, months in a cool corner. It gets safer, not worse." side="right" /> },
  { key: "sk_stat", start: 545, dur: 26, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={2} suffix="% salt" label="by weight of cabbage — the whole game" eyebrow="Get this right" accent="good" hue="amber" /> },
  { key: "gh_be", start: 597, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_145.mp4" image="img/gh_inset.png" eyebrow="Ghee" title="Shelf-stable 12–18 months" body="Butter with the water and milk solids cooked off. Highest smoke point of any fat, no fridge." side="right" /> },
  { key: "gh_stat", start: 606, dur: 21, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={485} suffix="°F" label="smoke point — it won't burn or turn" eyebrow="Clarified" accent="good" hue="amber" /> },
  { key: "ld_be", start: 633, dur: 30, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_154.mp4" image="img/ld_inset.png" eyebrow="Lard" title="The flakiest crust there is" body="Rendered pork fat, low and slow. Flat crystals make a pie crust flaky like nothing else." side="right" /> },
  { key: "tl_be", start: 669, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_165.mp4" image="img/tl_inset.png" eyebrow="Tallow" title="The high-heat frying fat" body="Rendered beef suet. What McDonald's fried in until 1990 — and people say it was better." side="right" /> },
  { key: "tl_stat", start: 678, dur: 22, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1990} label="the year the fries changed — and got worse" eyebrow="Not nostalgia, chemistry" accent="good" hue="amber" /> },
  { key: "cb_be", start: 706, dur: 30, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_175.mp4" image="img/cb_inset.png" eyebrow="Counter butter" title="Soft & spreadable, no cold" body="Salted butter in a covered crock. A butter bell seals the air off — spreadable straight away." side="right" /> },
  { key: "eg_be", start: 742, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_187.mp4" image="img/eg_inset.png" eyebrow="Eggs" title="The bloom" body="Hens leave a natural coating that seals the shell. Unwashed eggs keep weeks on the counter." side="right" /> },
  { key: "eg_stat", start: 751, dur: 25, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={3} suffix=" weeks" label="unwashed eggs on the counter — no fridge" eyebrow="The bloom" accent="good" hue="amber" /> },
  { key: "br_be", start: 782, dur: 13, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_195.mp4" image="img/br_inset.png" eyebrow="Bread" title="The fridge stales it faster" body="A real loaf belongs in a box or a cloth — never the cold, which dries it out fast." side="right" /> },
  { key: "oa_be", start: 801, dur: 19, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_199.mp4" image="img/oa_inset.png" eyebrow="Oats & grains" title="Soaked overnight" body="Water and a spoon of whey overnight — softer, faster to cook, easier on the stomach." side="right" /> },
  { key: "sd_be", start: 826, dur: 19, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_205.mp4" image="img/sd_inset.png" eyebrow="Sourdough starter" title="Alive on the counter" body="Flour and water gone alive, fed once a day for years. It leavened bread before packet yeast." side="right" /> },
  { key: "hn_be", start: 851, dur: 24, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_211.mp4" image="img/hn_inset.png" eyebrow="Honey" title="Never spoils" body="Sealed in a jar it outlasts you. Crystallized? Warm it gently — the cold only hardens it." side="right" /> },
  { key: "to_be", start: 881, dur: 15, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_218.mp4" image="img/to_inset.png" eyebrow="Tomatoes" title="Never refrigerate" body="The cold breaks down what makes a tomato taste like a tomato. Counter only, stem down." side="right" /> },
  { key: "po_be", start: 902, dur: 27, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_225.mp4" image="img/po_inset.png" eyebrow="Roots & alliums" title="Cool, dark, dry — not cold" body="Fridge turns a potato's starch to sugar. Cellar them; keep onions and potatoes apart." side="right" /> },
  { key: "hc_be", start: 935, dur: 16, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_232.mp4" image="img/hc_inset.png" eyebrow="Hard cheese" title="Waxed & cave-aged" body="Wax or cloth-wrapped, aged in a cool cellar for months — it gets better, not spoiled." side="right" /> },
  { key: "cm_be", start: 957, dur: 28, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_239.mp4" image="img/cm_inset.png" eyebrow="Cured meats" title="Salt & smoke" body="Hung in the smokehouse all year. Ham, bacon and dried beef keep for months — no freezer." side="right" /> },
  { key: "ap_be", start: 991, dur: 9, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="broll/fo_249.mp4" image="img/ap_inset.png" eyebrow="Apples & roots" title="The box of sand" body="Carrots and beets packed in dry sand keep firm for months. Sort out the one bad apple." side="right" /> },
  { key: "ap_stat", start: 1000, dur: 21.6, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={1} suffix=" bad apple" label="really does spoil the barrel — so you sort" eyebrow="All winter" accent="good" hue="amber" /> },
  { key: "cl_recap", start: 1021.6, dur: 8.4, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={20} suffix=" foods" label="kept right out in the open — on purpose" eyebrow="So that’s" accent="good" hue="amber" /> },
  { key: "cl_book", start: 1066.72, dur: 21.36, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="90" image="img/f_book.png" eyebrow="Every amount, written down" caption="The Plain Almanac — the first link in the description. Then the details for all 20 below it." accent="good" hue="amber" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":57.5,"role":"popUp","vol":0.32},{"at":139.9,"role":"popUp","vol":0.32},{"at":179.68,"role":"popUp","vol":0.32},{"at":312,"role":"popUp","vol":0.32},{"at":321,"role":"popUp","vol":0.32},{"at":365,"role":"popUp","vol":0.32},{"at":374,"role":"popUp","vol":0.32},{"at":405,"role":"popUp","vol":0.32},{"at":414,"role":"popUp","vol":0.32},{"at":457,"role":"popUp","vol":0.32},{"at":466,"role":"popUp","vol":0.32},{"at":507,"role":"popUp","vol":0.32},{"at":536,"role":"popUp","vol":0.32},{"at":545,"role":"popUp","vol":0.32},{"at":597,"role":"popUp","vol":0.32},{"at":606,"role":"popUp","vol":0.32},{"at":633,"role":"popUp","vol":0.32},{"at":669,"role":"popUp","vol":0.32},{"at":678,"role":"popUp","vol":0.32},{"at":706,"role":"popUp","vol":0.32},{"at":742,"role":"popUp","vol":0.32},{"at":751,"role":"popUp","vol":0.32},{"at":782,"role":"popUp","vol":0.32},{"at":801,"role":"popUp","vol":0.32},{"at":826,"role":"popUp","vol":0.32},{"at":851,"role":"popUp","vol":0.32},{"at":881,"role":"popUp","vol":0.32},{"at":902,"role":"popUp","vol":0.32},{"at":935,"role":"popUp","vol":0.32},{"at":957,"role":"popUp","vol":0.32},{"at":991,"role":"popUp","vol":0.32},{"at":1000,"role":"popUp","vol":0.32},{"at":1021.6,"role":"popUp","vol":0.32},{"at":1066.72,"role":"popUp","vol":0.32}];
