// build_broll_darkspots.mjs — cama densa de b-roll (Pexels) para darkspots (bearberry/arbutin · age spots).
// Camina el tiempo cada STEP s, toma una frase real de 4 palabras limpias de captions como ancla,
// y le asigna una query ON-TOPIC según la SECCIÓN activa. Salta la ventana full-screen lámina/CTA (dinámica).
import fs from "fs";

const caps = JSON.parse(fs.readFileSync("public/captions_darkspots.json", "utf8").replace(/^﻿/, ""));
const W = (caps.words || caps).map((x) => ({ w: x.text, s: (x.startMs || 0) / 1000 }));
const beats = JSON.parse(fs.readFileSync("beatsheet/darkspots.json", "utf8")).beats;
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
  spots: ["age spots on face close up", "sun spots on skin macro", "older woman examining her skin in mirror", "age spots back of hand close up", "hyperpigmentation on cheek close up", "senior woman looking at her face", "freckled mature skin macro"],
  skin: ["mature woman touching her face", "close up of aging skin texture", "older woman cheek skin macro", "woman looking at her face in the mirror", "wrinkled skin close up"],
  bearberry: ["dried green herbal leaves close up", "loose dried herbs on a wooden table", "herbal leaf tea steeping in a cup", "dried tea leaves macro", "brewing herbal tea close up", "pouring hot water over herbs in a cup"],
  night: ["woman sleeping peacefully at night", "dark bedroom moonlight window", "night skincare bathroom mirror", "cream jar on a nightstand", "quiet bedroom at night"],
  sun: ["bright sunlight through a window", "sunlight on skin close up", "woman walking outside on a sunny day", "sun shining on a face"],
  cream: ["expensive serum bottles on a shelf", "woman applying face serum", "cosmetic serum dropper bottle close up", "luxury skincare products on a pharmacy shelf", "face cream jar macro"],
  lemon: ["squeezing lemon juice by hand", "cut lemon on a cutting board", "fresh lemons close up", "rubbing lemon on skin"],
  doctor: ["older woman thoughtful by a window", "senior woman at a doctor office", "grandmother at a family wedding", "elderly woman hands folded in lap", "doctor talking with an older patient"],
  sunscreen: ["applying sunscreen to the face", "sunscreen bottle in hand", "woman putting on spf lotion", "sunscreen on the back of a hand"],
  safety: ["dermatologist examining a patient skin", "dab of cream on inner wrist", "older woman applying cream gently", "close up of skin on a face"],
  close: ["older woman with clear smooth skin smiling", "calm senior woman in warm morning light", "happy mature woman by a window", "healthy glowing older skin", "serene older woman smiling"],
};

const KEYMAP = [
  [/^(reveal$|arbutin|tyros|brake|how|nodrink|apply$)/, "bearberry"],
  [/^(hook|hooksw|hookleaf|honesty|lookhand|cannothide|reserved|stubborn)/, "spots"],
  [/^(whatspot|melano|stuck|slowbelt|pileup|rehook)/, "skin"],
  [/^(everybody|lemon|lemonmyth)/, "lemon"],
  [/^(polishing|mopping|anger|buying)/, "cream"],
  [/^(patient|danger)/, "doctor"],
  [/^(whynight|trigger|daynight)/, "night"],
  [/^(applynight|rhythm)/, "sunscreen"],
  [/^(safety|patchtest)/, "safety"],
  [/^(close)/, "close"],
];
const poolForKey = (key) => { for (const [re, p] of KEYMAP) if (re.test(key)) return p; return "spots"; };
const activeKey = (t) => { let k = beats[0].key; for (const b of beats) if (b.start <= t + 0.01) k = b.key; else break; return k; };

// ventana full-screen a saltar (lámina → guía + QR) — DINÁMICA desde los beats
const LAMKEYS = new Set(["lamina", "lam_brew", "lam_jobs", "lam_time", "lam_blur", "screenshot", "reveal_guide", "reveal_name", "descfree", "reveal_qr"]);
const lamBeats = beats.filter((b) => LAMKEYS.has(b.key));
const SKIP = lamBeats.length ? [[Math.min(...lamBeats.map((b) => b.start)) - 1, Math.max(...lamBeats.map((b) => b.start + b.dur)) + 1]] : [];
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
fs.writeFileSync("public/broll/dense_darkspots.json", JSON.stringify(cues, null, 1));
console.log(`dense cues: ${cues.length} · SKIP ${JSON.stringify(SKIP)} · primeras:`, cues.slice(0, 5).map((c) => c.query).join(" | "));
