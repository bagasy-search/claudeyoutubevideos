// build_broll_handsage.mjs — cama densa de b-roll (Pexels) para handsage.
// Camina el tiempo cada STEP s, toma una frase real de 4 palabras limpias de captions como ancla,
// y le asigna una query ON-TOPIC según la SECCIÓN activa. Salta la ventana full-screen lámina/CTA.
import fs from "fs";

const caps = JSON.parse(fs.readFileSync("public/captions_handsage.json", "utf8").replace(/^﻿/, ""));
const W = (caps.words || caps).map((x) => ({ w: x.text, s: (x.startMs || 0) / 1000 }));
const beats = JSON.parse(fs.readFileSync("beatsheet/handsage.json", "utf8")).beats;
const VEND = W[W.length - 1].s;

const clean = (w) => /^[a-zA-Z]+$/.test((w || "").trim());
const phraseAt = (t) => {
  let i = W.findIndex((x) => x.s >= t);
  if (i < 0) return null;
  for (; i < W.length - 4; i++) {
    const run = [W[i], W[i + 1], W[i + 2], W[i + 3]];
    if (run.every((x) => clean(x.w))) return { at: run.map((x) => x.w.trim()).join(" "), t: run[0].s };
  }
  return null;
};

const POOLS = {
  hands: ["age spots back of hand close up", "senior woman hands wrinkles", "elderly hands close up skin", "liver spots on hand macro", "older woman looking at her hands", "wrinkled hands of elderly person", "back of aging hand close up"],
  licorice: ["dried licorice root close up", "licorice root sticks macro", "dried herbal roots wooden table", "herbal root tea in a cup", "loose dried herbs and roots", "brewing herbal tea close up"],
  mix: ["aloe vera gel clear bowl", "mixing herbal paste in a bowl", "spoon stirring cream in a bowl", "hands mixing natural skincare", "aloe vera gel spoon macro"],
  night: ["woman sleeping peacefully at night", "dark bedroom moonlight window", "night skincare bathroom mirror", "hand cream jar on a nightstand", "quiet bedroom at night"],
  sun: ["bright sunlight through a window", "hands on steering wheel sunlight", "gardening hands in the sun", "senior couple walking on a sunny day", "sunlight on skin close up"],
  cream: ["expensive face cream jars on a shelf", "woman applying hand cream", "cosmetic serum dropper bottle", "skincare products on a pharmacy shelf", "luxury cream jar close up"],
  lemon: ["squeezing lemon juice by hand", "cut lemon on a cutting board", "fresh lemons close up", "hand rubbing lemon on skin"],
  doctor: ["senior woman at a doctor office", "grandmother holding grandchild hand", "older woman thoughtful by a window", "elderly woman hands folded in lap", "doctor talking with older patient"],
  sunscreen: ["applying sunscreen to the hands", "sunscreen bottle in hand", "woman putting on spf lotion", "sunscreen on the back of a hand"],
  safety: ["dermatologist examining a patient hand", "dab of cream on inner wrist", "older woman applying cream gently", "close up of skin on a hand"],
  clock: ["calendar pages turning", "clock hands moving close up", "sunrise over a calm horizon", "changing seasons time lapse"],
  close: ["older woman with smooth hands smiling", "healthy hands in morning light", "calm senior woman by a window", "happy grandmother hands", "older hands in warm light"],
};

const KEYMAP = [
  [/^(hook|pricewar|reveal$|threejobs|glabridin|tyros|serums|notstop|liquir|onethree)/, "licorice"],
  [/^(honesty|lookhand|cannothide|handsfirst|r_thin|whatspot|melano|stuck|pileup|refuse|reserved|stubborn|calm)/, "hands"],
  [/^(r_sun|r_care)/, "sun"],
  [/^(everybody|lemon|lemonmyth|m1|mistakes)/, "lemon"],
  [/^(polishing|mopping|whynobody|patent|m2)/, "cream"],
  [/^(patient|danger)/, "doctor"],
  [/^(whynight|trigger|daynight|rhythm)/, "night"],
  [/^(m3)/, "clock"],
  [/^(how)/, "mix"],
  [/^(applynight)/, "sunscreen"],
  [/^(safety|patchtest)/, "safety"],
  [/^(close)/, "close"],
];
const poolForKey = (key) => { for (const [re, p] of KEYMAP) if (re.test(key)) return p; return "hands"; };
const activeKey = (t) => { let k = beats[0].key; for (const b of beats) if (b.start <= t + 0.01) k = b.key; else break; return k; };

// ventana full-screen a saltar (lámina → guía + QR)
const SKIP = [[831, 1003]];
const skip = (t) => SKIP.some(([a, b]) => t >= a && t <= b);

const STEP = 7;
const cues = [];
const lastByPool = {};
for (let t = 5; t < VEND - 5; t += STEP) {
  if (skip(t)) continue;
  const ph = phraseAt(t);
  if (!ph) continue;
  const pool = POOLS[poolForKey(activeKey(ph.t))];
  let idx = (lastByPool[pool[0]] ?? -1) + 1; if (idx >= pool.length) idx = 0;
  lastByPool[pool[0]] = idx;
  cues.push({ at: ph.at, query: pool[idx] });
}
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/dense_handsage.json", JSON.stringify(cues, null, 1));
console.log(`dense cues: ${cues.length} · primeras:`, cues.slice(0, 5).map((c) => c.query).join(" | "));
