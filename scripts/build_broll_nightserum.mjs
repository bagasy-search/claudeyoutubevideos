// build_broll_nightserum.mjs — arma la CAMA DENSA de b-roll (Pexels) del video nightserum.
// Camina el tiempo cada ~STEP s, toma una FRASE REAL de 4 palabras limpias de los captions
// como ancla, y le asigna una query ON-TOPIC según la SECCIÓN activa (mapa key→pool).
// Salta la ventana full-screen de la lámina/CTA. Escribe public/broll/dense_nightserum.json.
import fs from "fs";

const caps = JSON.parse(fs.readFileSync("public/captions_nightserum.json", "utf8").replace(/^﻿/, ""));
const W = (caps.words || caps).map((x) => ({ w: x.text, s: (x.startMs || 0) / 1000 }));
const beats = JSON.parse(fs.readFileSync("beatsheet/nightserum.json", "utf8")).beats;
const VEND = W[W.length - 1].s;

const clean = (w) => /^[a-zA-Z]+$/.test((w || "").trim());
// frase real de 4 palabras limpias que empieza en/ tras t
const phraseAt = (t) => {
  let i = W.findIndex((x) => x.s >= t);
  if (i < 0) return null;
  for (; i < W.length - 4; i++) {
    const run = [W[i], W[i + 1], W[i + 2], W[i + 3]];
    if (run.every((x) => clean(x.w))) return { at: run.map((x) => x.w.trim()).join(" "), t: run[0].s };
  }
  return null;
};

// mapa SECCIÓN(key) → pool de queries on-topic (Pexels)
const POOLS = {
  intro: ["aloe vera plant windowsill", "fresh rosemary sprigs wooden board", "aloe vera leaf close up", "rosemary herb bunch kitchen"],
  pain: ["crepey skin back of hand close up", "senior woman hand wrinkles", "older woman neck skin close up", "mature woman decolletage skin", "older woman looking at her hands"],
  raisin: ["green grape and raisin macro", "plump grapes on the vine", "wrinkled raisins close up", "single grape water drops macro"],
  patient: ["older woman talking to doctor office", "senior woman thoughtful at home", "grandmother holding grandchild hands"],
  creamfail: ["woman applying face cream fingertips", "expensive cosmetic cream jars shelf", "laser skin treatment clinic", "luxury face cream jar close up"],
  reveal: ["aloe vera leaf and rosemary flat lay", "aloe plant and rosemary on counter", "hand holding aloe leaf and herbs"],
  aloe: ["aloe vera leaf cut clear gel", "aloe vera gel dripping macro", "scooping aloe vera gel spoon", "clear gel texture close up", "water drop absorbing into skin macro"],
  rosemary: ["rosemary infused oil glass bottle", "pouring oil into a small bottle", "rosemary sprigs in olive oil", "dropper bottle of facial oil"],
  night: ["full moon over a bedroom window", "woman sleeping peacefully at night", "dark bedroom nightstand with bottle", "night skincare routine bathroom mirror"],
  villain: ["expensive skincare products on store shelf", "hand dropping coins into a savings jar", "luxury cream jar with gold lid"],
  mistakes: ["thick cream smeared on skin", "woman scrubbing her face exfoliating", "hand rubbing lotion into skin", "greasy cream on the back of hand"],
  routine: ["cutting an aloe leaf on a kitchen board", "applying oil to the back of the hand", "warming herbs in oil on the stove", "soft cloth and dropper bottle on nightstand", "straining herbs from oil into a jar"],
  safety: ["dab of cream on inner wrist patch test", "rosemary sprig close up", "older woman applying serum gently", "aloe leaf on a bathroom counter"],
  close: ["older woman with smooth skin smiling by window", "aloe leaf and rosemary on a kitchen counter", "healthy mature skin close up", "calm older woman morning light"],
};
// key(prefijo) → pool
const KEYMAP = [
  [/^hook/, "intro"],
  [/^(inventory|hand|crepey_term|reframe_mv)/, "pain"],
  [/^(grape|iron|night_teaser)/, "raisin"],
  [/^(ruth|paper)/, "patient"],
  [/^(whyfail|roof|shelf)/, "creamfail"],
  [/^(reveal|openloop|promise_desc|intro)/, "reveal"],
  [/^(aloe_reveal|aloe_water|factories|aloe_two)/, "aloe"],
  [/^(second_q|evaporates|rosemary_reveal|bodyguard|pair)/, "rosemary"],
  [/^(whynight|day_defense)/, "night"],
  [/^(whynone|patent)/, "villain"],
  [/^(mistakes|m2_order|m3_repetition)/, "mistakes"],
  [/^(recipe|damp|oil_heat|floodsealsleep)/, "routine"],
  [/^(safety|sunscreen)/, "safety"],
  [/^(recap|start|expect|consistency|close)/, "close"],
];
const poolForKey = (key) => { for (const [re, p] of KEYMAP) if (re.test(key)) return p; return "reveal"; };
const activeKey = (t) => { let k = beats[0].key; for (const b of beats) if (b.start <= t + 0.01) k = b.key; else break; return k; };

// ventana full-screen a saltar (lámina → guía → truco reservado)
const SKIP = [[1195, 1385]];
const skip = (t) => SKIP.some(([a, b]) => t >= a && t <= b);

const STEP = 19;
const cues = [];
const lastByPool = {};
for (let t = 6; t < VEND - 6; t += STEP) {
  if (skip(t)) continue;
  const ph = phraseAt(t);
  if (!ph) continue;
  const pool = POOLS[poolForKey(activeKey(ph.t))];
  // elegir query evitando repetir la última del pool
  let idx = (lastByPool[pool[0]] ?? -1) + 1; if (idx >= pool.length) idx = 0;
  lastByPool[pool[0]] = idx;
  cues.push({ at: ph.at, query: pool[idx] });
}
fs.writeFileSync("public/broll/dense_nightserum.json", JSON.stringify(cues, null, 1));
console.log(`dense cues: ${cues.length} · primeras:`, cues.slice(0, 5).map((c) => c.query).join(" | "));
