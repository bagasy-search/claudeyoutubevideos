// dense_prep_rosemaryhair.mjs — cama densa de b-roll STOCK (Pexels) para "Rosemary for HAIR".
// Camina las captions cada ~BASE_GAP s y elige una query ON-TOPIC segun las palabras del tramo
// (keyword->query; rule 8: query con los sustantivos de la frase). Escribe:
//   public/broll/shots_denseH.json   [{name, query, type:"video", orientation:"landscape"}]  (fetch)
//   src/_fed6/VideoEdit/rosemaryhair_broll.ts  (HAIR_BROLL, track contiguo)
import fs from "fs";
const BASE_GAP = +(process.env.GAP || 7.2);
const caps = JSON.parse(fs.readFileSync("public/captions_rosemaryhair.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = caps.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const VEND = (CW[CW.length - 1]?.s || 1050) + 2;

// ── keyword -> query concreta (footage real de Pexels) ─────────────────────────
const RULES = [
  [/\b(rosemary|herb|sprig|spice|weed|plant|mediterranean)\b/, ["fresh rosemary sprigs macro close up", "rosemary herb bunch on wooden table", "rosemary plant growing in garden", "dried rosemary leaves close up"]],
  [/\b(oil|carrier|jojoba|olive|infuse|infusion|steep|drops|essential)\b/, ["herbal oil infusion in glass jar", "pouring essential oil into bottle", "oil dropper glass bottle close up"]],
  [/\b(boil|boiling|heat|kettle|bubble|cook|hot|warmth)\b/, "kettle boiling water steam kitchen"],
  [/\b(scalp|part|parting|hairline|crown|roots?|follicles?|skin)\b/, ["close up parting hair to show scalp", "extreme close up hair roots scalp", "woman parting hair with fingers", "top of head hair thinning scalp", "close up scalp hair follicles macro"]],
  [/\b(massage|fingertips|circles|rub|rubbed|rubbing|pads)\b/, ["woman massaging her scalp with fingers", "head massage fingertips close up", "person applying oil massaging scalp"]],
  [/\b(thin|thinner|thinning|wisps?|wispy|see|bald|balding|loss|losing|shed|shedding|drain|clumps)\b/, ["thinning hair close up on scalp", "hair fall in hairbrush close up", "loose hair strands on hand"]],
  [/\b(brush|brushing|strand|strands|ponytail|lengths?|ends|comb|combs)\b/, ["woman brushing long hair slow", "hair strands falling slow motion", "combing through hair close up"]],
  [/\b(serum|serums|bottle|bottles?|shelf|aisle|pharmacy|product|label|thickening|spray|sprays)\b/, "hair care serum bottles on shelf"],
  [/\b(minoxidil|drug|trial|study|studies|lab|research|published|science|scientists?)\b/, "scientist in laboratory research microscope"],
  [/\b(dht|hormone|enzyme|testosterone|reductase|molecule|compound|carnosic|rosmarinic|antioxidant)\b/, "abstract molecule science animation dark"],
  [/\b(blood|vessel|vessels|capillary|oxygen|nutrients|circulation|supply|flow)\b/, "blood cells flowing through vessel microscope"],
  [/\b(mirror|photo|photos|picture|recognize|light)\b/, "mature woman looking in mirror concerned"],
  [/\b(night|sleep|sleeping|bed|pillow|drift|overnight|nightly)\b/, "woman sleeping peacefully in bed at night"],
  [/\b(morning|coffee|wash|washing|shower|rinse|rushing)\b/, "woman morning bathroom routine mirror"],
  [/\b(doctor|federer|honest|physician|clinic|patient)\b/, "doctor talking with patient in clinic"],
  [/\b(inflammation|red|angry|tight|flaky|irritated|itch|itched)\b/, "close up irritated scalp skin"],
  [/\b(baby|fuzz|new|grow|grows|growing|growth|thick|thicker|healthy|shiny)\b/, "close up of healthy shiny hair"],
  [/\b(water|glass|drink|thirsty|hydrate)\b/, "pouring glass of clear water"],
  [/\b(money|dollars?|price|cheap|coffee|expensive|400|80|shelf)\b/, "hand holding cash money close up"],
  [/\b(woman|women|she|her|temple|temples|patient|50|60|age|aging|older)\b/, "mature woman portrait soft window light"],
];
// rotacion de respaldo (siempre on-topic)
const POOL = [
  "fresh rosemary sprigs macro close up",
  "close up thinning hair on scalp",
  "mature woman brushing her hair",
  "woman touching her thinning hair",
  "rosemary essential oil glass bottle",
  "close up healthy hair strands",
  "mature woman portrait window light",
  "hand parting hair to reveal scalp",
  "woman applying oil to her hair",
  "fresh rosemary plant growing in garden",
];

const pick = (win, i) => {
  for (const [re, q] of RULES) if (re.test(win)) return Array.isArray(q) ? q[i % q.length] : q;
  return POOL[i % POOL.length];
};

// caminar cada BASE_GAP, tomando ventana de contexto (~4s) para keywords
const kept = [];
let cursor = 3.0, last = "";
for (let i = 0; i < CW.length; i++) {
  if (CW[i].s < cursor) continue;
  const t = CW[i].s;
  // ventana de contexto: palabras entre t y t+4s
  let win = "";
  for (let j = i; j < CW.length && CW[j].s < t + 4; j++) win += " " + CW[j].t;
  let q = pick(win, kept.length);
  if (q === last) q = pick(win, kept.length + 3); // evitar 2 iguales seguidas
  last = q;
  kept.push({ name: `d${String(kept.length).padStart(3, "0")}`, t: +t.toFixed(2), query: q });
  cursor = t + BASE_GAP;
}

const shots = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape" }));
fs.writeFileSync("public/broll/shots_denseH.json", JSON.stringify(shots, null, 1));

const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/rosemaryhair/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryhair_broll.ts",
  `// AUTO-GENERADO por scripts/dense_prep_rosemaryhair.mjs — b-roll denso STOCK (footage real).\n` +
  `export const HAIR_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);

const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
const qc = {}; kept.forEach((k) => qc[k.query] = (qc[k.query] || 0) + 1);
console.log(`dense HAIR: ${kept.length} clips · sep media ${avg.toFixed(2)}s · queries distintas ${Object.keys(qc).length}`);
console.log("top queries:", Object.entries(qc).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([q, n]) => `${n}×${q.slice(0, 22)}`).join(" | "));
