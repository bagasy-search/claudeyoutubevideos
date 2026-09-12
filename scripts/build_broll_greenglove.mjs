// build_broll_greenglove.mjs — cama densa de b-roll (Pexels/cascada) para greenglove.
// Camina el tiempo cada STEP s, ancla a una frase real de 4 palabras limpias, mapea la
// SECCIÓN activa a un pool de queries ON-TOPIC (manos/manchas/romero/yogur/noche/sol/crema),
// baja un clip único por cue con acquireStock (dedup global) y escribe greenglove_broll.ts.
// Salta la ventana full-screen lámina→guía+QR [742,887].
import fs from "fs";
import { acquireStock } from "./stock_lib.mjs";

const SLUG = "greenglove";
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const W = (caps.words || caps).map((x) => ({ w: x.text, s: (x.startMs || 0) / 1000 }));
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
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
  hands: ["age spots back of hand close up", "senior woman hands wrinkles", "elderly hands close up skin", "older woman looking at her hands", "wrinkled hands of an elderly person", "back of an aging hand close up", "spotted aging hands macro"],
  rosemary: ["fresh rosemary sprigs close up", "rosemary herb plant growing", "rosemary on a wooden cutting board", "crushing rosemary mortar and pestle", "green herbs macro fresh", "bunch of fresh rosemary"],
  yogurt: ["bowl of plain white yogurt", "spoon stirring yogurt in a bowl", "mixing green paste in a bowl", "natural skincare paste in a bowl", "hands mixing herbal paste"],
  night: ["woman sleeping peacefully at night", "dark bedroom moonlight window", "soft white cotton gloves on hands", "hands with white gloves", "quiet bedroom at night"],
  sun: ["bright sunlight through a window", "sunlight on skin close up", "senior couple walking on a sunny day", "gardening hands in the sun", "warm morning light window"],
  cream: ["expensive face cream jars on a shelf", "woman applying hand cream", "cosmetic serum dropper bottle", "skincare products on a pharmacy shelf", "luxury cream jar close up"],
  skin: ["extreme close up skin texture pores", "macro of skin surface", "close up of skin on a hand", "human skin macro detail"],
  sunscreen: ["applying sunscreen to the hands", "sunscreen bottle in hand", "putting spf lotion on the hands", "sunscreen on the back of a hand"],
  safety: ["dermatologist examining a patient hand", "a dab of cream on the inner wrist", "older woman applying cream gently", "close up of skin on a hand"],
  doctor: ["older woman thoughtful by a window", "grandmother holding a grandchild hand", "elderly woman hands folded in her lap", "calm senior woman smiling"],
  close: ["older woman with smooth hands smiling", "healthy hands in morning light", "happy grandmother hands", "older hands in warm light"],
};

const KEYMAP = [
  [/^(hook1|hook_sleep|hook_honest|aged_first|humiliations|nobody)$/, "hands"],
  [/^(hands_first)$/, "sun"],
  [/^(thin|lentigo|two_problems|three_jobs|three_done|whofor|desc_tease)$/, "skin"],
  [/^(creams|roof|tap|cost)$/, "cream"],
  [/^(reveal|earn|rosmarinic|carnosic|one_plant|glove_intro|recipe|handmap|practical)$/, "rosemary"],
  [/^(yogurt)$/, "yogurt"],
  [/^(wrap|overnight)$/, "night"],
  [/^(warn_intro|warn_check)$/, "safety"],
  [/^(close_do|close)$/, "close"],
];
const poolForKey = (key) => { for (const [re, p] of KEYMAP) if (re.test(key)) return p; return "hands"; };
const activeKey = (t) => { let k = beats[0].key; for (const b of beats) if (b.start <= t + 0.01) k = b.key; else break; return k; };

const SKIP = [[742, 887]];
const skip = (t) => SKIP.some(([a, b]) => t >= a && t <= b);

const STEP = 8;
const cues = [];
const lastByPool = {};
for (let t = 4; t < VEND - 4; t += STEP) {
  if (skip(t)) continue;
  const ph = phraseAt(t);
  if (!ph) continue;
  const pool = POOLS[poolForKey(activeKey(ph.t))];
  let idx = (lastByPool[pool[0]] ?? -1) + 1; if (idx >= pool.length) idx = 0;
  lastByPool[pool[0]] = idx;
  cues.push({ at: ph.at, t: +ph.t.toFixed(2), query: pool[idx] });
}

console.log(`cues: ${cues.length} — fetching stock (cascade)…`);
fs.mkdirSync("public/broll", { recursive: true });
const out = [];
let n = 0, ok = 0;
for (const cue of cues) {
  const name = `${SLUG}_b${String(n++).padStart(3, "0")}`;
  const got = await acquireStock({ name, query: cue.query, dur: 6 }, "public/broll");
  if (got) { out.push({ name, src: `broll/${name}.mp4`, start: cue.t, dur: 6, query: cue.query }); ok++; }
  else console.warn(`  ✗ sin stock: "${cue.query}" @ ${cue.t}s`);
}
// dedup por start (por si dos cues cayeron muy juntos), ordenar
out.sort((a, b) => a.start - b.start);
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_broll.ts`,
  `export const GB_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(out)};\n`);
console.log(`\nOK ${ok}/${cues.length} clips · greenglove_broll.ts escrito (${out.length} beats)`);
