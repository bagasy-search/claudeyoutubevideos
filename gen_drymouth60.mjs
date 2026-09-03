// gen_drymouth60.mjs — beatsheet · Canal "Dr. Federer — The Nightly Remedy" (EN)
// "If You Wake Up With a DRY MOUTH After 60, Your Body Is Warning You (It's Not Age)". Kit _fed6.
// Clon de gen_naillines.mjs (avatar parcial + <Audio> master + AvatarLayerLoopFcs).
// AVATAR PARCIAL: creador grabó 0..733.73s de un master de 1007.55s.
//   ZONA AVATAR (<733.73): lipsync REAL. ZONA FISH (>=733.73): avatar bucle mudo → 100% cubierto.
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "drymouth60";
const AVATAR_END = 733.73;
const VIDEO_END = 1007.55;
const HERO_CAP = 3.8;
const CLIP_CAP = 5.1;
const capFish = (i) => [6.0, 7.6, 5.6, 8.2, 6.2, 7.2][i % 6];
const capAvatar = (i) => [3.4, 3.8, 5.6, 3.4, 6.4, 4.0, 3.5, 5.2][i % 8];

const FP = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe";
const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};
const has = (p) => fs.existsSync("public/" + p);
const photo = (n) => (has(`img/${n}.png`) ? `img/${n}.png` : has(`img/${n}.jpg`) ? `img/${n}.jpg` : null);
const clipOf = (n) => (has(`broll/${SLUG}/${n}.mp4`) ? `broll/${SLUG}/${n}.mp4` : null);

const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^\uFEFF/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
const FULLW = CAPS.map((x) => norm(x.text)[0] || "");
const FULLMS = CAPS.map((x) => (x.startMs || 0) / 1000);
const findMs = (phrase, after = 0) => {
  const q = norm(phrase || "");
  if (q.length < 2) return null;
  for (let k = Math.min(q.length, 7); k >= 2; k--) {
    const sub = q.slice(0, k);
    let firstGlobal = -1;
    for (let i = 0; i <= FULLW.length - k; i++) {
      let ok = true; for (let j = 0; j < k; j++) if (FULLW[i + j] !== sub[j]) { ok = false; break; }
      if (!ok) continue;
      if (firstGlobal < 0) firstGlobal = i;
      if (FULLMS[i] >= after) return FULLMS[i];
    }
    if (firstGlobal >= 0) return FULLMS[firstGlobal];
  }
  return null;
};

const M = (p, t, n) => ({ p, t, n });
const MOMENTS = [
  // ── ZONA AVATAR (<733.73) ─────────────────────────────────────────────────
  // hook / cold open
  M("dry mouth you wake up with", "clip", "dm_hero_wake_dry"),
  M("the tongue stuck to the roof", "photo", "dm_ins_drylips_macro"),
  M("reach for the glass of water on the nightstand", "photo", "dm_ins_water_nightstand"),
  M("That is not old age", "photo", "dm_ins_empty_glass_2am"),
  M("quiet it down in about a week", "clip", "dm_hero_explain"),
  M("things you already have in your kitchen", "photo", "dm_ins_bakingsoda_jar"),
  // oil light metaphor
  M("the little oil light comes on in the car", "photo", "dm_ins_car_oil_light"),
  M("smart enough to tell you before", "photo", "dm_ins_bedroom_night"),
  M("That dry mouth is the light", "clip", "dm_hero_leanin"),
  // saliva / night guard
  M("what actually happens in your mouth while you sleep", "photo", "dm_ins_sleep_mouthopen"),
  M("washing the surfaces of your teeth", "photo", "dm_ins_teeth_enamel"),
  M("carrying calcium and phosphate", "photo", "dm_ins_teeth_enamel"),
  M("keeping the bacteria in check", "photo", "dm_ins_gumline"),
  M("Your mouth has a night guard", "clip", "dm_hero_explain"),
  M("saliva production drops way way down", "photo", "dm_ins_sleep_mouthopen"),
  M("the guard completely off duty", "photo", "dm_ins_gumline"),
  M("the real damage happens", "photo", "dm_ins_bedroom_night"),
  M("this channel is called what it's called", "clip", "dm_hero_leanin"),
  M("before your head hits the pillow", "photo", "dm_ins_side_sleeping"),
  // why yours is drier / not age
  M("why is yours drier than it should be", "clip", "dm_hero_explain"),
  M("getting older Your glands slow down", "photo", "dm_ins_water_nightstand"),
  M("it doesn't fix it", "photo", "dm_ins_empty_glass_2am"),
  M("things nobody's checking", "clip", "dm_hero_leanin"),
  M("Six of them actually", "photo", "dm_ins_pill_bottles"),
  M("about 80 of the work", "photo", "dm_ins_medicine_cabinet"),
  M("the one you'd never suspect", "clip", "dm_hero_medicine_cabinet"),
  // Walter intro
  M("Let me tell you about a patient", "clip", "dm_hero_desk_consult"),
  M("Spent 30 years fixing furnaces", "photo", "dm_ins_walter_hands"),
  M("my mouth is like sandpaper", "photo", "dm_ins_drylips_macro"),
  M("my breath in the morning could strip paint", "photo", "dm_ins_bad_breath_morning"),
  M("two crumble right at the gum line", "photo", "dm_ins_gumline"),
  M("Teeth get brittle Same story", "photo", "dm_ins_teeth_enamel"),
  M("you just live with it", "clip", "dm_hero_desk_consult"),
  M("Walter did not have to live with it", "clip", "dm_hero_leanin"),
  // reason 1: meds
  M("medications your medicine cabinet", "clip", "dm_hero_medicine_cabinet"),
  M("over 400 common medications", "photo", "dm_ins_pill_bottles"),
  M("the water pills the diuretics", "photo", "dm_ins_diuretic"),
  M("pull fluid out of you", "photo", "dm_ins_pill_bottles"),
  M("Allergy pills antihistamines", "photo", "dm_ins_nightstand_pills"),
  M("taking four five six things at once", "clip", "dm_hero_hold_pills"),
  M("the tap goes to a trickle", "photo", "dm_ins_water_nightstand"),
  M("I am not telling you to stop a single medication", "clip", "dm_hero_leanin"),
  M("almost nobody connects the dots", "clip", "dm_hero_explain"),
  M("a specific trick with the timing of these pills", "photo", "dm_ins_pill_bottles"),
  // reason 2: mouth breathing
  M("breathing through your mouth at night", "photo", "dm_ins_sleep_mouthopen"),
  M("If your nose is blocked", "photo", "dm_ins_saline_bottle"),
  M("a mouth hanging open for eight hours", "photo", "dm_ins_bedroom_night"),
  M("leaving a slice of bread out on the counter", "photo", "dm_ins_bread_drying"),
  M("often travels with snoring", "photo", "dm_ins_sleep_mouthopen"),
  M("two lights on the dashboard", "photo", "dm_ins_car_oil_light"),
  // reason 3: dry air
  M("the air itself Your bedroom", "photo", "dm_ins_bedroom_night"),
  M("a ceiling fan running all night", "clip", "dm_ins_ceiling_fan"),
  M("pull the moisture out of the room", "photo", "dm_ins_ac_vent"),
  M("the vent that's blowing desert air", "clip", "dm_ins_ac_vent"),
  // reason 4: mouthwash
  M("the alcohol mouthwash", "photo", "dm_ins_mouthwash_bottle"),
  M("you swish the strong minty stuff", "photo", "dm_ins_mouthwash_pour"),
  M("alcohol is a drying agent", "photo", "dm_ins_drylips_macro"),
  M("feeding the exact thing you're trying to fight", "photo", "dm_ins_mouthwash_pour"),
  M("when we get to the fix", "clip", "dm_hero_leanin"),
  // reason 5: evening
  M("Your evening What you eat and drink at night", "photo", "dm_ins_wine_night"),
  M("The glass of wine", "photo", "dm_ins_wine_night"),
  M("The evening coffee or the after dinner tea", "photo", "dm_ins_coffee_evening"),
  M("The salty dinner", "photo", "dm_ins_salty_dinner"),
  M("turn your saliva off for the night", "photo", "dm_ins_bedroom_night"),
  // reason 6: warning
  M("the warning inside the warning", "clip", "dm_hero_leanin"),
  M("before a bigger diagnosis", "photo", "dm_ins_a1c_form"),
  M("High blood sugar diabetes", "photo", "dm_ins_glucometer"),
  M("dry mouth is often the earliest symptom", "photo", "dm_ins_drylips_macro"),
  M("dries out the mouth And the eyes together", "photo", "dm_ins_dry_eyes"),
  M("your mouth is still bone dry", "photo", "dm_ins_empty_glass_2am"),
  M("the one called the A1C", "clip", "dm_hero_notepad_a1c"),
  M("a review of every single medication", "photo", "dm_ins_pill_bottles"),
  M("reading your own dashboard", "photo", "dm_ins_car_oil_light"),
  // protocol intro
  M("what you actually do about it tonight", "clip", "dm_hero_explain"),
  M("I want to show you not just tell you", "clip", "dm_hero_leanin"),
  M("pay very close attention to this next part", "clip", "dm_hero_leanin"),
  M("the most important minute of the whole video", "photo", "dm_ins_bedroom_night"),
  M("walk you through it first in my own hands", "clip", "dm_hero_explain"),
  M("protect the mouth before you sleep", "photo", "dm_ins_teeth_enamel"),
  M("Set the guard up before you go off duty", "photo", "dm_ins_side_sleeping"),
  // step 1
  M("Step one is the two hour rule", "clip", "dm_hero_push_drinks"),
  M("No more coffee no more tea no alcohol", "photo", "dm_ins_coffee_evening"),
  M("go easy on the salt at dinner", "photo", "dm_ins_salty_dinner"),
  M("half the battle", "photo", "dm_ins_bedroom_night"),
  // step 2
  M("fix that cruel little mouthwash trap", "photo", "dm_ins_mouthwash_bottle"),
  M("throw out the alcohol mouthwash", "photo", "dm_ins_mouthwash_pour"),
  M("half a teaspoon of baking soda", "clip", "dm_hero_mix_bakingsoda"),
  M("into a cup of warm water", "photo", "dm_ins_warm_water_cup"),
  M("Stir it till it's gone", "clip", "dm_hero_stir_cup"),
  M("swish that for about 30 seconds", "clip", "dm_hero_swish"),
  M("It neutralizes the acid", "photo", "dm_ins_bakingsoda_spoon"),
  M("helps with the morning breath far better", "photo", "dm_ins_bad_breath_morning"),
  M("Cost pennies You already own it", "photo", "dm_ins_bakingsoda_jar"),
  // step 3
  M("This is the one that actually turns the tap back up", "clip", "dm_hero_hold_xylitol"),
  M("Comes from birch and other plants", "photo", "dm_ins_xylitol_spoon"),
  M("little lozenges of it or the granules", "photo", "dm_ins_xylitol_dish"),
  M("gently stimulates your glands to make more saliva", "photo", "dm_ins_teeth_enamel"),
  M("starves the specific bacteria that cause cavities", "photo", "dm_ins_gumline"),
  M("you let one lozenge dissolve", "photo", "dm_ins_xylitol_dish"),
  M("the bad bacteria a little hungrier", "photo", "dm_ins_teeth_enamel"),
  M("connects back to Walter's teeth", "photo", "dm_ins_gumline"),
  M("where the enamel's thinnest", "photo", "dm_ins_teeth_enamel"),
  M("protecting the teeth You've got left", "clip", "dm_hero_leanin"),
  // step 4
  M("Step four the nose", "clip", "dm_hero_saline"),
  M("a little saline rinse before bed", "photo", "dm_ins_saline_bottle"),
  M("breathe through your nose instead of your mouth", "photo", "dm_ins_sleep_mouthopen"),
  M("sleep on your side not flat on your back", "photo", "dm_ins_side_sleeping"),
  M("hold themselves on their side", "photo", "dm_ins_bedroom_night"),
  M("let the nose Do the breathing", "clip", "dm_hero_saline"),
  // step 5
  M("Step five the room", "clip", "dm_hero_humidifier"),
  M("humidification Fire for the bedroom", "photo", "dm_ins_humidifier"),
  M("Put it on the dresser", "photo", "dm_ins_bedroom_night"),
  M("a wide bowl of water sitting near the heat vent", "clip", "dm_hero_bowl_vent"),
  M("putting moisture back into the air", "photo", "dm_ins_ac_vent"),

  // ── ZONA FISH (>=733.73) — 100% cubierto ──────────────────────────────────
  // step 6
  M("step six the last one a dab of coconut oil", "clip", "dm_hero_coconut"),
  M("Run it over your lips", "photo", "dm_ins_drylips_macro"),
  M("a thin bit inside the cheeks", "photo", "dm_ins_coconut_jar"),
  M("It coats and protects the tissue", "photo", "dm_ins_coconut_jar"),
  M("a quick 60 seconds of oil pulling", "photo", "dm_ins_toothbrush_sink"),
  M("coats everything protects everything", "photo", "dm_ins_bedroom_night"),
  // LÁMINA reveal (conversion peak) — freezezoom comps + supporting
  M("this is the page I really want you to have", "photo", "dm_lamina_protocol"),
  M("laid out with the exact amounts and the exact timing", "photo", "dm_lamina_protocol"),
  M("The two hour rule The half teaspoon", "photo", "dm_lamina_protocol"),
  M("The one xylitol lozenge", "photo", "dm_lamina_protocol"),
  M("The nose The side sleeping", "photo", "dm_lamina_protocol"),
  M("the warning line", "photo", "dm_lamina_protocol"),
  M("ask for the A1C and the medication review", "photo", "dm_lamina_protocol"),
  M("the whole protocol on one page", "photo", "dm_lamina_protocol"),
  // guide reveal
  M("one page literally one page out of the complete guide", "clip", "dm_hero_hold_guide"),
  M("Every one of these warning signs your body sends at night", "photo", "dm_ins_guide_in_hands"),
  M("with the amounts the way I'd explain it to you", "photo", "dm_ins_guide_in_hands"),
  M("If you want the whole guide it's completely free", "photo", "dm_ins_guide_in_hands"),
  M("The link is right down in the description", "photo", "dm_lamina_protocol"),
  M("scan the little code on your screen", "clip", "dm_ins_phone_scan"),
  M("with your phone camera", "photo", "dm_ins_phone_scan"),
  M("stick it on the bathroom mirror", "clip", "dm_hero_mirror_page"),
  // description trick (2nd strategy)
  M("the piece I couldn't fit on the page", "clip", "dm_hero_leanin"),
  M("your dry mouth is coming mostly from your medications", "photo", "dm_ins_pill_bottles"),
  M("the timing of when you take those pills", "photo", "dm_ins_nightstand_pills"),
  M("without ever stopping or changing the medication", "clip", "dm_hero_hold_pills"),
  M("I wrote the whole thing out word for word", "photo", "dm_ins_a1c_form"),
  M("I left it in the description right under the link", "photo", "dm_ins_phone_scan"),
  M("if you're on several pills", "photo", "dm_ins_pill_bottles"),
  // Walter ending
  M("Walter took the page Same six things", "clip", "dm_hero_desk_consult"),
  M("Threw out the mouthwash", "photo", "dm_ins_mouthwash_bottle"),
  M("Did the baking soda the xylitol lozenge", "photo", "dm_ins_bakingsoda_jar"),
  M("Put a bowl of water by the vent", "photo", "dm_ins_bowl_vent"),
  M("First thing that came back was the sleep", "photo", "dm_ins_bedroom_night"),
  M("stopped waking up at two in the morning", "photo", "dm_ins_empty_glass_2am"),
  M("that unbroken sleep", "photo", "dm_ins_bedroom_night"),
  M("taste like a penny anymore", "photo", "dm_ins_drylips_macro"),
  M("the paint stripping breath", "photo", "dm_ins_bad_breath_morning"),
  M("she stopped noticing it", "photo", "dm_ins_walter_hands"),
  M("made the hair on my arms stand up", "clip", "dm_hero_desk_consult"),
  M("we ran the A1C", "clip", "dm_hero_notepad_a1c"),
  M("his blood sugar was creeping", "photo", "dm_ins_glucometer"),
  M("the pre diabetes range", "photo", "dm_ins_a1c_form"),
  M("nobody would have caught it", "photo", "dm_ins_glucometer"),
  M("the first light on the dashboard", "photo", "dm_ins_car_oil_light"),
  M("saved him from a diagnosis", "clip", "dm_hero_leanin"),
  M("a body that was smart enough to flash a light", "photo", "dm_ins_car_oil_light"),
  // close
  M("two crumbling teeth and a diagnosis", "photo", "dm_ins_gumline"),
  M("You woke up dry this morning", "clip", "dm_hero_wake_dry"),
  M("Do the two hour rule tonight Do the baking soda", "clip", "dm_hero_mix_bakingsoda"),
  M("feel the difference this week", "photo", "dm_ins_bedroom_night"),
  M("Grab the guide from the description or Scan the code", "clip", "dm_ins_phone_scan"),
  M("Read the medication timing part", "photo", "dm_ins_pill_bottles"),
  M("come back tomorrow night", "photo", "dm_ins_bedroom_night"),
  M("wake up between three and four in the morning", "photo", "dm_ins_empty_glass_2am"),
  M("Take care of yourself tonight", "clip", "dm_hero_explain"),

  // ── RELLENO on-topic (densidad; frases reales, assets DISTINTOS) ────────────
  M("that thick sour taste", "photo", "dm_ins_drylips_macro"),
  M("one of the most underrated fluids", "photo", "dm_ins_teeth_enamel"),
  M("keeping the yeast in check", "photo", "dm_ins_gumline"),
  M("every night and that's when the real damage", "photo", "dm_ins_gumline"),
  M("the answer you've probably been given is the wrong one", "photo", "dm_ins_water_nightstand"),
  M("the ones for an overactive bladder", "photo", "dm_ins_nightstand_pills"),
  M("Is there a swap", "photo", "dm_ins_pill_bottles"),
  M("a deviated septum you've had for 40 years", "photo", "dm_ins_saline_bottle"),
  M("bone dry by morning", "photo", "dm_ins_bread_drying"),
  M("drinking gallons of water", "photo", "dm_ins_water_nightstand"),
  M("got morning breath", "photo", "dm_ins_bad_breath_morning"),
  M("and then it's worse", "photo", "dm_ins_mouthwash_bottle"),
  M("Salt pulls water toward it", "photo", "dm_ins_salty_dinner"),
  M("the worst possible timing", "photo", "dm_ins_coffee_evening"),
  M("Thyroid problems", "photo", "dm_ins_glucometer"),
  M("dry gritty eyes", "photo", "dm_ins_dry_eyes"),
  M("Say those words A1C", "photo", "dm_ins_a1c_form"),
  M("almost no saliva We can't change that", "photo", "dm_ins_sleep_mouthopen"),
  M("It does the opposite of alcohol", "photo", "dm_ins_bakingsoda_spoon"),
  M("because it's fixing the cause", "photo", "dm_ins_warm_water_cup"),
  M("They can't feed on it", "photo", "dm_ins_gumline"),
  M("clears the runway", "photo", "dm_ins_saline_bottle"),
  M("On your back the mouth falls open", "photo", "dm_ins_sleep_mouthopen"),
  M("does a surprising amount", "photo", "dm_ins_bowl_vent"),
  // fish relleno
  M("print this page", "photo", "dm_ins_bathroom_mirror_page"),
  M("a conversation to have with your own doctor", "photo", "dm_ins_a1c_form"),
  M("the single highest value thing", "photo", "dm_ins_pill_bottles"),
  M("He was skeptical", "photo", "dm_ins_walter_hands"),
  M("he refused to buy a humidifier", "photo", "dm_ins_humidifier"),
  M("a man of 74", "photo", "dm_ins_walter_hands"),
  M("the range where you can still turn it around", "photo", "dm_ins_glucometer"),
  M("months before anything else would have shown up", "photo", "dm_ins_a1c_form"),
  M("It costs you almost nothing", "photo", "dm_ins_bakingsoda_jar"),

  // ── RELLENO 4: assets DISTINTOS nuevos (densidad ≥126) ─────────────────────
  M("thinking you're resting", "clip", "dm_stk_bedroom_dark"),
  M("drinking gallons of water", "clip", "dm_stk_water_pour"),
  M("six seven eight hours", "clip", "dm_stk_clock_night"),
  M("most of them happen at night", "clip", "dm_stk_person_sleeping"),
  M("caffeine drying", "clip", "dm_stk_coffee_steam"),
  M("The glass of wine alcohol", "clip", "dm_stk_wine_pour"),
  M("turning your saliva tap down", "clip", "dm_stk_pills_bottle"),
  M("buy a bigger water bottle", "clip", "dm_stk_glass_water"),
  M("salt water through the nose", "clip", "dm_stk_nasal_spray"),
  M("he refused to buy a humidifier", "clip", "dm_stk_humidifier_mist"),
  M("keeping the soft tissue from drying out", "photo", "dm_ins_tongue_dry"),
  M("Drink more water And you nod", "photo", "dm_ins_water_pour"),
  M("back to sleep", "photo", "dm_ins_clock_3am"),
  M("some of the pain medications", "photo", "dm_ins_pill_palm"),
  M("blood pressure pills", "photo", "dm_ins_bp_cuff"),
  M("the salty snack in front of the TV", "photo", "dm_ins_wine_pour"),
  M("the after dinner tea", "photo", "dm_ins_tea_evening"),
  M("Salt pulls water toward it", "photo", "dm_ins_salt_shaker"),
  M("the range where you can still turn it around", "photo", "dm_ins_humidifier_mist"),
  M("a blood sugar test the one called", "photo", "dm_ins_glucose_test"),
  M("plain baking soda from the cupboard", "photo", "dm_hero_show_bakingsoda"),
  M("So come with me", "photo", "dm_hero_kitchen_talk"),
  M("I keep waking up", "photo", "dm_hero_wake_dry"),
  M("I have to be honest with you", "photo", "dm_hero_explain"),
  M("So listen close", "photo", "dm_hero_leanin"),
  M("most likely to be taking", "photo", "dm_hero_medicine_cabinet"),
  M("You stack them and the tap", "photo", "dm_hero_hold_pills"),
  M("go easy on the salt at dinner", "photo", "dm_hero_push_drinks"),
  M("and you swish that for about 30 seconds and spit", "photo", "dm_hero_mix_bakingsoda"),
  M("let it melt", "photo", "dm_hero_hold_xylitol"),
  M("so you can breathe through your nose", "photo", "dm_hero_saline"),
  M("the stronger version of this", "photo", "dm_hero_coconut"),
  M("you have to know exactly how to ask", "photo", "dm_hero_notepad_a1c"),
  M("the way I'd explain it to you", "photo", "dm_hero_hold_guide"),
  M("Grab it print this page", "photo", "dm_hero_mirror_page"),
  M("the next thing I want to show you", "photo", "dm_hero_point_screen"),
  M("a little wetter", "photo", "dm_ins_lozenge_macro"),
  M("that's been building up", "photo", "dm_ins_bs_water_mix"),
  M("the lips a little cracked", "photo", "dm_ins_dry_throat"),
];

const C = (p, kind, o = {}) => ({ p, kind, ...o });
const COMPS = [
  // === primer minuto (zona avatar) ===
  C("That is not old age", "frasecinetica", { words: [{ t: "NOT" }, { t: "AGE." }, { t: "A" }, { t: "WARNING.", hl: true }], perWord: 11, tone: "teal" }),
  C("getting older Your glands slow down", "mitoverdad", { myth: "It's just age — drink more water", truth: "It's usually your meds, your breathing and your room — and it's fixable", image: "img/dm_ins_water_nightstand.jpg", flipPhrase: "that's not the real reason" }),
  C("the one you'd never suspect", "errorstinger", { number: "1", title: "THE CAUSE HIDING IN YOUR CABINET", eyebrow: "revealed in a minute", tone: "warn" }),
  C("Your mouth has a night guard", "freezezoom", { image: "img/dm_diagram_nightguard.jpg", x: 0.5, y: 0.5, zoom: 1.05, label: "Your mouth's night guard" }),
  C("saliva production drops way way down", "freezezoom", { image: "img/dm_diagram_nightguard.jpg", x: 0.72, y: 0.5, zoom: 1.6, label: "Guard off while you sleep" }),
  C("So let's Do the six reasons", "checklist", { title: "Six night-time causes", eyebrow: "NOT AGE", tone: "warn", items: [
    { text: "Your medications — over 400 dry the mouth.", state: "warn" },
    { text: "Mouth-breathing at night (often with snoring).", state: "warn" },
    { text: "Dry bedroom air — heating, AC, a fan.", state: "warn" },
    { text: "Alcohol mouthwash — it dries you more.", state: "warn" },
    { text: "Evening coffee, wine and salt.", state: "warn" },
    { text: "A warning sign of something bigger.", state: "warn" } ] }),
  C("about 80 of the work", "datoimpacto", { figure: "80%", eyebrow: "ONE CAUSE DOES MOST OF IT", label: "in most people over 60, medications are the biggest driver", image: "img/dm_ins_pill_bottles.jpg", tone: "gold" }),
  C("over 400 common medications", "datoimpacto", { figure: "400+", eyebrow: "COMMON MEDS THAT DRY THE MOUTH", label: "blood-pressure, water pills, allergy, antidepressants, bladder", image: "img/dm_ins_pill_bottles.jpg", tone: "teal" }),

  // === reason 4: mouthwash irony ===
  C("the alcohol mouthwash", "mitoverdad", { myth: "Mouthwash fixes dry-mouth breath", truth: "Alcohol mouthwash DRIES you more — swap it for a baking-soda rinse", image: "img/dm_ins_mouthwash_bottle.jpg", flipPhrase: "alcohol is a drying agent" }),

  // === reason 6 warning: A1C ===
  C("the one called the A1C", "datoimpacto", { figure: "A1C", eyebrow: "THE TEST TO ASK FOR", label: "still dry after 2-3 weeks? ask for an A1c and a medication review", image: "img/dm_ins_a1c_form.jpg", tone: "teal" }),

  // === step 1 hour rule ===
  C("Step one is the two hour rule", "hourdial", { hour: 2, big: "2 HRS", unit: "BEFORE BED", label: "no coffee, no tea, no alcohol, easy on the salt", tone: "gold" }),

  // === honest cautions (before the protocol) ===
  C("I am not telling you to stop a single medication", "checklist", { title: "Please — before you change anything", eyebrow: "HONEST", tone: "warn", items: [
    { text: "Never stop a medication on your own.", state: "warn" },
    { text: "Ask your doctor about a gentler swap or the timing.", state: "done" },
    { text: "Still dry after 2-3 weeks? A1c + a full medication review.", state: "warn" } ] }),

  // === $0 fix ===
  C("It costs you almost nothing", "datoimpacto", { figure: "~$0", eyebrow: "THE WHOLE PROTOCOL", label: "baking soda, xylitol, coconut oil, a bowl of water — things you own", image: "img/dm_ins_bakingsoda_jar.jpg", tone: "gold" }),

  // === LÁMINA (protocol) — freezezoom, el pico de conversión ===
  C("this is the page I really want you to have", "freezezoom", { image: "img/dm_lamina_protocol.jpg", x: 0.5, y: 0.5, zoom: 1.05, label: "The Nightly Dry-Mouth Protocol" }),
  C("The two hour rule The half teaspoon", "freezezoom", { image: "img/dm_lamina_protocol.jpg", x: 0.28, y: 0.4, zoom: 1.7, label: "Two-hour rule + baking soda" }),
  C("The one xylitol lozenge", "freezezoom", { image: "img/dm_lamina_protocol.jpg", x: 0.28, y: 0.58, zoom: 1.7, label: "One xylitol lozenge" }),
  C("The nose The side sleeping", "freezezoom", { image: "img/dm_lamina_protocol.jpg", x: 0.28, y: 0.72, zoom: 1.7, label: "Nose + side sleeping" }),
  C("ask for the A1C and the medication review", "freezezoom", { image: "img/dm_lamina_protocol.jpg", x: 0.5, y: 0.9, zoom: 1.8, label: "Still dry? Ask for this" }),

  // === reveal guía + QR ===
  C("one page literally one page out of the complete guide", "guidecta", { cover: "img/drymouth60_libro.jpg", qr: "med/drymouth60_qr.png", domain: "docfederer.com", kicker: "The complete guide", title: "Complete Health After 60", desc: "The full night-time protocol, the exact amounts, and every warning sign — in plain words.", scanTitle: "Get the free guide", scanSub: "scan the code or tap the description" }),
  C("The link is right down in the description", "lowerthird", { title: "Full guide + exact amounts in the description", kicker: "free", desc: "The Nightly Dry-Mouth Protocol", tone: "teal" }),

  // === Walter timeline ===
  C("First thing that came back was the sleep", "lineatiempo", { title: "What happened for Walter", tone: "teal", marks: [
    { label: "Nights 4-5", sub: "He stopped waking at 2am to sip water" },
    { label: "2 weeks", sub: "The metallic taste and morning breath were gone" },
    { label: "3 weeks", sub: "An A1c caught pre-diabetes — early enough to reverse" } ] }),

  // === tease descripción (2da estrategia) ===
  C("I left it in the description right under the link", "lowerthird", { title: "The medication-timing trick → in the description", kicker: "for anyone on several pills", desc: "exactly what to ask your doctor — I wrote it out below", tone: "teal" }),

  // === cierre ===
  C("a warning not a punishment", "frasecinetica", { words: [{ t: "NOT" }, { t: "A" }, { t: "PUNISHMENT." }, { t: "A" }, { t: "MESSAGE.", hl: true }], perWord: 11, tone: "teal" }),

  // === refuerzos (densidad + valor) ===
  C("half a teaspoon of baking soda", "lowerthird", { title: "Baking-soda rinse: ½ tsp in 1 cup warm water", kicker: "swish 30 seconds, then spit", desc: "no alcohol — it neutralizes the acid instead of drying you", tone: "teal" }),
  C("This is the one that actually turns the tap back up", "lowerthird", { title: "One xylitol lozenge at bedtime", kicker: "let it dissolve — don't chew", desc: "it draws out saliva and starves the cavity bacteria", tone: "teal" }),
  C("the vent that's blowing desert air", "lowerthird", { title: "Dry bedroom air pulls the moisture out of you", kicker: "heating, AC, a fan", desc: "a humidifier or a bowl of water by the vent", tone: "warn" }),
  C("stick it on the bathroom mirror", "lowerthird", { title: "Print the page — stick it on the mirror", kicker: "so you actually do it tonight", desc: "the whole protocol on one page", tone: "teal" }),
  C("Say those words A1C", "frasecinetica", { words: [{ t: "ASK" }, { t: "FOR:" }, { t: "A1C" }, { t: "+" }, { t: "MED", }, { t: "REVIEW.", hl: true }], perWord: 10, tone: "teal" }),
];

// ── construir beats/BROLL/COVER (idéntico a gen_naillines) ────────────────────
let after = 0;
for (const m of MOMENTS) { const ms = findMs(m.p, Math.max(0, after - 8)); m.ms = ms; if (ms != null) after = ms; }
const missM = MOMENTS.filter((m) => m.ms == null).map((m) => m.p);
const MM = MOMENTS.filter((m) => m.ms != null).sort((a, b) => a.ms - b.ms);
const N = MM.length;
const nextStart = (i) => (i + 1 < N ? MM[i + 1].ms : VIDEO_END);

const beats = [], BROLL = [], COVER = [];
let nClip = 0, nFoto = 0, nCola = 0, nAvatar = 0, part = 0, apart = 0;
const DEF = "dm_ins_bedroom_night";
const bedNear = (i) => { for (let d = 1; d <= 12; d++) for (const j of [i - d, i + d]) { if (j >= 0 && j < N) { const p = photo(MM[j].n); if (p) return p; } } return photo(DEF); };
const bedPool = (i, own) => {
  if (MM[i].n === "dm_lamina_protocol" || MM[i].n === "dm_diagram_nightguard") return [own];
  const arr = own ? [own] : [];
  for (let d = 1; d <= 12 && arr.length < 5; d++) for (const j of [i - d, i + d]) {
    if (j >= 0 && j < N) { const p = photo(MM[j].n); if (p && !arr.includes(p)) arr.push(p); }
  }
  return arr.length ? arr : [own || photo(DEF)];
};

for (let i = 0; i < N; i++) {
  const m = MM[i], st = m.ms, slot = +(nextStart(i) - st).toFixed(2);
  if (slot <= 0.2) continue;
  const zonaFish = st >= AVATAR_END;
  const clip = m.t === "clip" ? clipOf(m.n) : null;

  if (clip) {
    const real = probeDur("public/" + clip) || CLIP_CAP;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.1)).toFixed(2);
    beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, cov, key: "s", kind: "raw", src: clip });
    BROLL.push({ name: m.n, src: clip, start: +st.toFixed(2), dur: slot, cov, query: m.p });
    COVER.push({ start: +st.toFixed(2), cov, kind: "video", src: clip });
    nClip++;
    let resto = +(slot - cov).toFixed(2), t = +(st + cov).toFixed(2);
    const poolC = bedPool(i, photo(m.n)); let kc = 0;
    while (resto > 0.25 && (zonaFish || resto < 1.8)) {
      const src = poolC[kc % poolC.length]; if (!src) break;
      const trozo = +Math.min(resto, zonaFish ? capFish(part) : HERO_CAP).toFixed(2);
      beats.push({ id: `${m.n}_t${part}`, start: t, dur: trozo, cov: trozo, key: "s", kind: "raw", src });
      COVER.push({ start: t, cov: trozo, kind: "photo", src });
      t = +(t + trozo).toFixed(2); resto = +(resto - trozo).toFixed(2); nCola++; part++; kc++;
      if (!zonaFish) break;
    }
    continue;
  }

  const own = photo(m.n) || bedNear(i);
  if (!own) { if (!zonaFish) nAvatar++; continue; }
  nFoto++;
  const poolP = bedPool(i, own); let kp = 0;
  let t = +st.toFixed(2), resto = slot;
  while (resto > 0.25) {
    const src = poolP[kp % poolP.length];
    const trozo = +Math.min(resto, zonaFish ? capFish(part) : capAvatar(apart++)).toFixed(2);
    beats.push({ id: kp ? `${m.n}_p${part}` : m.n, start: t, dur: trozo, cov: trozo, key: "s", kind: "raw", src });
    COVER.push({ start: t, cov: trozo, kind: "photo", src });
    t = +(t + trozo).toFixed(2); resto = +(resto - trozo).toFixed(2);
    if (!zonaFish) break;
    part++; kp++;
  }
}

{
  const raws = beats.filter((b) => b.kind === "raw").sort((a, b) => a.start - b.start);
  const fus = [];
  for (const b of raws) {
    const u = fus[fus.length - 1];
    if (u && u.src === b.src && Math.abs(u.start + u.dur - b.start) < 0.12) {
      u.dur = +(b.start + b.dur - u.start).toFixed(2); u.cov = +(b.start + (b.cov ?? b.dur) - u.start).toFixed(2); continue;
    }
    fus.push({ ...b });
  }
  beats.length = 0; beats.push(...fus);
  const covVid = COVER.filter((c) => c.kind === "video");
  COVER.length = 0;
  COVER.push(...covVid, ...fus.filter((b) => /^img\//.test(b.src)).map((b) => ({ start: b.start, cov: b.cov ?? b.dur, kind: "photo", src: b.src })));
  COVER.sort((a, b) => a.start - b.start);
}

const capDur = { datoimpacto: 6.5, mitoverdad: 7, checklist: 9, lowerthird: 6, frasecinetica: 5.5, errorstinger: 2.6,
  hourdial: 6.5, lineatiempo: 11, freezezoom: 5, guidecta: 11 };
const missC = [], cmp = [];
let ca = 0;
for (let k = 0; k < COMPS.length; k++) {
  const spec = COMPS[k]; const ms = findMs(spec.p, Math.max(0, ca - 12));
  if (ms == null) { missC.push(spec.p); continue; }
  ca = ms; const { p, ...rest } = spec;
  cmp.push({ id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capDur[spec.kind] || 6, key: "s", ...rest });
}
for (const b of cmp) {
  if (b.kind === "mitoverdad" && b.flipPhrase) {
    const ms = findMs(b.flipPhrase, b.start - 1); const lastSafe = Math.round(b.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - b.start) * 30) : Math.round(b.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(b.dur * 30 * 0.42);
    b.flipAt = f; delete b.flipPhrase;
  }
}
cmp.sort((a, b) => a.start - b.start);

const ALL = [...beats, ...cmp].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const U = SLUG.toUpperCase();
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; cov: number; query: string }[] = ${JSON.stringify(BROLL)};\n` +
  `export const ${U}_COVER: { start: number; cov: number; kind: string; src: string }[] = ${JSON.stringify(COVER)};\n` +
  `export const AVATAR_END = ${AVATAR_END};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

const need = new Set(); const RUTA = /^(img|broll|med)\//;
const hurga = (v) => { if (typeof v === "string") { if (RUTA.test(v)) need.add(v); return; } if (Array.isArray(v)) v.forEach(hurga); else if (v && typeof v === "object") Object.values(v).forEach(hurga); };
ALL.forEach(hurga);
const assets = new Set();
for (const p of need) { assets.add(p); if (/\.(jpe?g|png)$/i.test(p) && !/_blur/.test(p)) { const b = p.replace(/\.(jpe?g|png)$/i, "_blur.jpg"); if (has(b)) assets.add(b); } }
const NL = String.fromCharCode(10);
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].sort().join(NL) + NL);
const miss = [...need].filter((p) => !has(p));

const kinds = {}; cmp.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const cov = COVER.filter((c) => c.start + c.cov > AVATAR_END).map((c) => [Math.max(c.start, AVATAR_END), c.start + c.cov]).sort((a, b) => a[0] - b[0]);
let libre = 0, tt = AVATAR_END;
for (const [s, e] of cov) { if (s > tt) libre += s - tt; tt = Math.max(tt, e); }
if (tt < VIDEO_END) libre += VIDEO_END - tt;
const durs = beats.map((b) => b.cov || b.dur).sort((a, b) => a - b); const q = (p) => durs[Math.floor(durs.length * p)] || 0;
console.log(`beats ${ALL.length} (clips ${nClip} · colas ${nCola} · fotos ${nFoto} · comp ${cmp.length})`);
console.log(`componentes: ${Object.keys(kinds).length} kinds → ${Object.entries(kinds).map(([k, v]) => k + "×" + v).join(", ")}`);
console.log(`PACING: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}%`);
console.log(`ZONA FISH sin cubrir: ${libre.toFixed(1)}s de ${(VIDEO_END - AVATAR_END).toFixed(0)}s (${(100 * libre / (VIDEO_END - AVATAR_END)).toFixed(1)}%)`);
console.log(`assets ${need.size} · FALTAN ${miss.length}${miss.length ? " → " + miss.slice(0, 8).join(" ") : ""}`);
if (missM.length) console.log(`\nMOMENTOS no anclados (${missM.length}): ${missM.slice(0, 40).map((s) => '"' + s.slice(0, 34) + '"').join(", ")}`);
if (missC.length) console.log(`COMPONENTES no anclados (${missC.length}): ${missC.map((s) => '"' + s.slice(0, 34) + '"').join(", ")}`);
