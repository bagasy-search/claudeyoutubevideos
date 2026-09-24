// gen_grbanana.mjs — beatsheet/taza9pm.json (Canal "Golden Remedies" (EN) · I RUBBED COFFEE ON MY FACE FOR 7 DAYS).
// Material = clips agnes texto-a-video (GRATIS) + imágenes agnes + gpt-image-2 low SOLO las fotos HERO
// con la cara del Dr. Clon de gen_fcscanela (incluye el fix anti-hueco: cada contenido cubre su `cov` real).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "grbanana";
const VIDEO_END = 1688.90;       // master Fish (grbanana.wav) — el avatar es PARCIAL y va en bucle
const AVATAR_CYCLE = 909.73;      // la creadora grabo 15:09.7 de 28:08 -> BUCLE, cortes en multiplos

const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};

// ── captions (anclaje por frase) ───────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 7);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const findAll = (phrase, minWords = 3) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 7);
  const out = []; if (p.length < minWords) return out;
  for (let i = 0; i < CW.length - p.length; i++) {
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) out.push(CW[i].s);
  }
  return out;
};

// ── momentos autorados ─────────────────────────────────────────────────────────
const SRC = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));
// clips que agnes no pudo rendear tras varias pasadas -> se degradan a FOTO (red de seguridad
// documentada: clip -> auditoria -> foto SOLO de los fallados). Sin esto el beat queda sin asset.
const AS_IMAGE = fs.existsSync(`_v3/${SLUG}_asimage.json`)
  ? new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_asimage.json`, "utf8"))) : new Set();
for (const b of SRC) if (AS_IMAGE.has(b.name)) b.mediakind = "image";
const N = SRC.length;
const AVG_GAP = VIDEO_END / N;
const WINDOW = 45;
const cand = SRC.map((b) => findAll(b.anchor));
const hard = new Array(N).fill(null);
const unanchored = [];
let lastMs = 0, lastI = -1;
for (let i = 0; i < N; i++) {
  const expected = lastMs + AVG_GAP * (i - lastI);
  const opts = cand[i].filter((s) => s > lastMs + 0.05);
  let best = null, bestD = Infinity;
  for (const s of opts) { const d = Math.abs(s - expected); if (d < bestD) { bestD = d; best = s; } }
  if (best != null && bestD <= WINDOW) { hard[i] = best; lastMs = best; lastI = i; }
  else unanchored.push(SRC[i].name);
}
const start = new Array(N);
for (let i = 0; i < N; i++) {
  if (hard[i] != null) { start[i] = hard[i]; continue; }
  let a = i - 1; while (a >= 0 && hard[a] == null) a--;
  let c = i + 1; while (c < N && hard[c] == null) c++;
  const sA = a >= 0 ? hard[a] : 0;
  const sC = c < N && hard[c] != null ? hard[c] : VIDEO_END;
  const iA = a >= 0 ? a : -1;
  const iC = c < N && hard[c] != null ? c : N;
  start[i] = +(sA + (sC - sA) * ((i - iA) / (iC - iA))).toFixed(3);
}
const MINGAP = 0.5;
for (let i = 1; i < N; i++) if (start[i] < start[i - 1] + MINGAP) start[i] = +(start[i - 1] + MINGAP).toFixed(3);

// ── ADELGAZADO POR PACING (regla 1: ritmo VARIADO, no metrónomo) ────────────────
// Escribí 437 momentos: da mediana 2.9s y solo 11% de planos ≥5s = "cambia uno por segundo, cansa".
// Se quita iterativamente el momento con el hueco MÁS CHICO (nunca uno con ancla dura si hay
// alternativa) hasta llegar a mediana 3.5-4.5 y ~40% de planos ≥5s. Quitar los apretados ALARGA
// a los vecinos → sube la mediana Y la varianza, que es justo lo que se busca.
let idx = SRC.map((_, i) => i);
const statsOf = (ix) => {
  const d = ix.map((v, k) => (k + 1 < ix.length ? start[ix[k + 1]] : VIDEO_END) - start[v]).sort((a, b) => a - b);
  return { med: d[Math.floor(d.length / 2)], p75: d[Math.floor(d.length * 0.75)], pct5: d.filter((x) => x >= 5).length / d.length };
};
let guard = 0;
while (guard++ < 400) {
  const s = statsOf(idx);
  if (s.med >= 3.6 && s.pct5 >= 0.36) break;
  let worst = -1, worstGap = Infinity;
  for (let k = 1; k < idx.length - 1; k++) {
    const gap = start[idx[k + 1]] - start[idx[k]];
    // prefiere tirar los interpolados; y NUNCA las fotos HERO del presentador (son la IDENTIDAD
    // del canal, la compuerta pide ≥8 y salían perdiendo por estar en tramos densos).
    // ⚠ se mira `engine`, NO `mediakind`: un clip DEGRADADO a foto también tiene mediakind
    // "image", y protegerlo cambiaría la selección → se moverían TODOS los tiempos del video.
    // Sólo son intocables las fotos HERO originales (gpt-image con la cara del Dr.).
    const penal = (hard[idx[k]] != null ? 0.45 : 0) + (SRC[idx[k]].engine === "gpt" ? 99 : 0);
    if (gap + penal < worstGap) { worstGap = gap + penal; worst = k; }
  }
  if (worst < 0) break;
  idx.splice(worst, 1);
}
const KEPT = idx;

// ── COSTURAS DEL BUCLE: correr el beat más cercano para que caiga JUSTO en el corte ──
// El avatar es un loop de 152.03s. En cada múltiplo hay un corte duro. Si en ese instante hay
// contenido a pantalla completa, el corte no se ve. Se empuja el beat más cercano (±2.6s) al seam.
const SEAMS = [];
for (let k = 1; k * AVATAR_CYCLE < VIDEO_END; k++) SEAMS.push(+(k * AVATAR_CYCLE - 0.25).toFixed(2));
for (const seam of SEAMS) {
  let best = -1, bd = Infinity;
  for (const i of KEPT) { const d = Math.abs(start[i] - seam); if (d < bd) { bd = d; best = i; } }
  if (best >= 0 && bd <= 2.6) { start[best] = seam; continue; }
  // Nadie cerca: en vez de arrastrar un beat lejos de SU frase, RE-INSERTO uno de los momentos
  // que el adelgazado descartó — su prompt ya fue escrito para ese tramo del guion, así que
  // sigue siendo coherente, y encima recupera densidad justo donde hacía falta.
  const dropped = SRC.map((_, i) => i).filter((i) => !KEPT.includes(i));
  let cand2 = -1, cd = Infinity;
  for (const i of dropped) { const d = Math.abs(start[i] - seam); if (d < cd) { cd = d; cand2 = i; } }
  if (cand2 >= 0) { start[cand2] = seam; KEPT.push(cand2); }
}
KEPT.sort((a, b) => start[a] - start[b]);

// ── beats raw ───────────────────────────────────────────────────────────────────
const beats = [];
for (let j = 0; j < KEPT.length; j++) {
  const i = KEPT[j];
  const b = SRC[i];
  const st = start[i];
  const nx = j + 1 < KEPT.length ? start[KEPT[j + 1]] : VIDEO_END;
  const dur = +Math.max(0.6, nx - st).toFixed(2);
  const beat = { id: b.name, start: +st.toFixed(2), dur, key: "s", kind: "raw" };
  beat.src = b.mediakind === "image" ? `img/${SLUG}_${b.name}.jpg` : `broll/${SLUG}_${b.name}.mp4`;
  beats.push(beat);
}
const contentStarts = beats.map((b) => b.start).sort((a, b) => a - b);
const nextContentStart = (s) => { for (const x of contentStarts) if (x > s + 0.05) return x; return VIDEO_END; };
const HERO_CAP = 4.2;

const BROLL = [], COVER = [];
for (const i of KEPT) {
  const b = SRC[i];
  const st = start[i];
  const slot = nextContentStart(st) - st;
  if (b.mediakind === "video") {
    const real = probeDur(`public/broll/${SLUG}_${b.name}.mp4`) || 3;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.08)).toFixed(2);
    BROLL.push({ name: b.name, src: `broll/${SLUG}_${b.name}.mp4`, start: +st.toFixed(2), dur: +Math.max(0.8, slot).toFixed(2), cov, query: b.desc || "" });
    COVER.push({ start: +st.toFixed(2), cov, kind: "video", src: `broll/${SLUG}_${b.name}.mp4` });
  } else {
    COVER.push({ start: +st.toFixed(2), cov: +Math.min(slot, HERO_CAP).toFixed(2), kind: "photo", src: `img/${SLUG}_${b.name}.jpg` });
  }
}

// ── COSTURAS QUE QUEDARON DESCUBIERTAS · tapon con la FOTO del beat vecino ─────
// El empuje de +-2.6s no alcanza cuando el beat mas cercano esta a 2.8-4.1s, y como aca NO se
// descarto ningun momento (los 339 entraron) tampoco habia uno para reinsertar. Sin esto quedan
// ~6.7s de avatar sobre el corte del bucle: justo lo que la costura existe para esconder.
// Se mete la FOTO de respaldo del beat mas cercano: misma frase, asset DISTINTO (no repite el
// clip de al lado) y como kind "photo" el Main la manda a pantalla completa y tapa el salto.
{
  const covered = (t) => COVER.some((c) => t >= c.start - 0.15 && t < c.start + c.cov - 0.15);
  for (const seam of SEAMS) {
    if (covered(seam)) continue;
    let best = null, bd = Infinity;
    for (const i2 of KEPT) { const d = Math.abs(start[i2] - seam); if (d < bd) { bd = d; best = i2; } }
    if (best == null) continue;
    const st = +(seam - 0.5).toFixed(2);
    const nxt = contentStarts.find((x) => x > st + 0.05) ?? VIDEO_END;
    const cov = +Math.max(1.2, Math.min(2.6, nxt - st - 0.1)).toFixed(2);
    const src = `img/${SLUG}_${SRC[best].name}.jpg`;
    beats.push({ id: `seam_${SRC[best].name}`, start: st, dur: cov, key: "s", kind: "raw", src });
    COVER.push({ start: st, cov, kind: "photo", src });
    console.log(`  costura ${seam}s tapada con ${src} (${st}s +${cov}s)`);
  }
  beats.sort((a, b) => a.start - b.start);
  COVER.sort((a, b) => a.start - b.start);
}

// ── COMPONENTES — la VARA: se busca el componente-ESCENA del kit, no la tarjeta plana ──
const I = (n) => `img/${SLUG}_${n}.jpg`;
// ⚠ ORDEN CRONOLOGICO OBLIGATORIO: el generador busca cada `phrase` con un cursor que solo
// avanza (findMs(spec.phrase, cmpCursor)). Un componente fuera de orden NO ancla y se pierde.
// ⛔ NO se usa `board`: deja el avatar VISIBLE al costado y este avatar es un BUCLE — pasada la
//    costura mostraria la cara fuera de sincro. Tampoco `diagram` (diagramFor es por concepto y
//    devuelve el diagrama de otro video si el concepto no matchea).
// ⚠ ORDEN CRONOLOGICO OBLIGATORIO: el generador busca cada `phrase` con un cursor que solo
// avanza (findMs(spec.phrase, cmpCursor)). Un componente fuera de orden NO ancla y se pierde.
// ⛔ NO se usa `board`: deja el avatar VISIBLE al costado y este avatar es un BUCLE — pasada la
//    costura mostraria la cara fuera de sincro. Tampoco `diagram` (diagramFor es por concepto y
//    devuelve el diagrama de otro video si el concepto no matchea).
// ⚠ ORDEN CRONOLOGICO OBLIGATORIO: el generador busca cada `phrase` con un cursor que solo
// avanza (findMs(spec.phrase, cmpCursor)). Un componente fuera de orden NO ancla y se pierde.
// ⛔ NO se usa `board`: deja el avatar VISIBLE al costado y este avatar es un BUCLE — pasada la
//    costura mostraria la cara fuera de sincro. Tampoco `diagram` (diagramFor es por concepto y
//    devuelve el diagrama de otro video si el concepto no matchea).
// ⚠ ORDEN CRONOLOGICO OBLIGATORIO: el generador busca cada `phrase` con un cursor que solo
// avanza (findMs(spec.phrase, cmpCursor)). Un componente fuera de orden NO ancla y se pierde.
// ⛔ NO se usa `board`: deja el avatar VISIBLE al costado y este avatar es un BUCLE — pasada la
//    costura mostraria la cara fuera de sincro. Tampoco `diagram` (diagramFor es por concepto y
//    devuelve el diagrama de otro video si el concepto no matchea).
// ⚠ ORDEN CRONOLOGICO OBLIGATORIO: el generador busca cada `phrase` con un cursor que solo
// avanza (findMs(spec.phrase, cmpCursor)). Un componente fuera de orden NO ancla y se pierde.
// ⛔ NO se usa `board`: deja el avatar VISIBLE al costado y este avatar es un BUCLE — pasada la
//    costura mostraria la cara fuera de sincro. Tampoco `diagram` (diagramFor es por concepto y
//    devuelve el diagrama de otro video si el concepto no matchea).
const CMP = [
  // ── HOOK ─────────────────────────────────────────────────────────────────────
  { phrase: "holds somewhere between 80 and 560", kind: "bars", title: "The same fruit. Two different plants.", unit: "mg / 100g", bars: [
    { label: "The peel you throw away", value: 100, winner: true, note: "80 to 560 mg" },
    { label: "The fruit you eat", value: 3, note: "2.5 to 10 mg" },
  ] },
  { phrase: "We eat the ten", kind: "callout", figure: "100x", eyebrow: "Peel against fruit",
    caption: "We eat the small half and compost the large one, and then we go and buy it back in a jar", medico: true },
  { phrase: "A banana peel will not remove", kind: "mitoverdad", mythLabel: "WHAT YOU ARE TOLD", truthLabel: "WHAT ACTUALLY HAPPENS",
    myth: "Banana peel erases wrinkles",
    truth: "It cannot. A line that folds from underneath is not reached from the surface",
    flipPhrase: "Nothing you rub on the outside" },
  { phrase: "The first is that this peel has a clock", kind: "hourdial", hour: 9, big: "4", unit: "MIN", tone: "gold",
    label: "From the moment you tear it open" },
  { phrase: "The second thing is that on night three", kind: "errorstinger", number: "01",
    title: "Night three. I let it dry all the way.", tone: "warn", eyebrow: "The mistake I am going to walk you through" },

  // ── QUE ES ───────────────────────────────────────────────────────────────────
  { phrase: "Because I did not know either", kind: "rule", number: "01", title: "WHAT IS ACTUALLY IN THE SKIN" },
  { phrase: "A banana peel is about a third", kind: "stat", eyebrow: "Of every banana you have ever bought",
    value: 33, suffix: "%", label: "A third of the weight goes straight into the bin" },
  { phrase: "near 40 million tons of this particular", kind: "callout", figure: "40M", eyebrow: "Tonnes of banana peel a year",
    caption: "Almost all of it goes into the ground, and none of it has ever been asked what it can do" },
  { phrase: "the peel is not the poor relation", kind: "freezezoom", image: I("h_058"), x: 0.5, y: 0.5, zoom: 2.0,
    tone: "teal", label: "The rich half was the half we threw out" },
  { phrase: "runs several times higher in the skin", kind: "bars", title: "Protective antioxidant compounds", unit: "x", bars: [
    { label: "In the skin", value: 100, winner: true, note: "four to five times higher" },
    { label: "In the fruit", value: 22, note: "the part we actually eat" },
  ] },
  { phrase: "There is potassium in it", kind: "ingredients", title: "What is in that skin", items: [
    { name: "Potassium", amount: "more than the flesh, gram for gram", image: I("h_059") },
    { name: "Silicon", amount: "the mineral used in the scaffolding under the skin", image: I("h_061") },
    { name: "Carotenoids", amount: "lutein among them - the yellow itself", image: I("h_063") },
  ] },
  { phrase: "There is pectin", kind: "chips", title: "And three more nobody mentions", eyebrow: "Still in the skin", image: I("h_065"),
    chips: ["Pectin - a soluble fibre that dries to a film", "Natural waxes on the inner face", "Enzymes - the reason it goes brown"] },
  { phrase: "the most interesting part of plant", kind: "avatarkeyword", items: [
    { card: "The rubbish is the rich part", sub: "chemically, the skin is the most interesting thing on the plant" },
  ] },

  // ── POR QUE NADIE ────────────────────────────────────────────────────────────
  { phrase: "Partly because of a joke", kind: "rule", number: "02", title: "WHY NOBODY TALKS ABOUT IT" },
  { phrase: "a slick of black grease", kind: "blurexplainer", clip: "broll/grbanana_079.mp4", image: I("h_078"), side: "right",
    eyebrow: "Eighteen eighties, on the pavement", title: "It was a genuine public menace",
    body: "Two days on a hot pavement and a peel stops being a peel. Cities wrote ordinances about it and paid men to sweep them up." },
  { phrase: "Once a thing becomes the punchline", kind: "quote",
    text: "Nobody researches the punchline. Nobody puts the punchline in a jar and sells it to you for eighty pounds.",
    author: "Why the banana peel was never studied" },
  { phrase: "You cannot sell a banana peel", kind: "pricewar", leftImage: I("h_093"), rightImage: I("h_019"),
    leftPrice: "0", rightPrice: "80", leftLabel: "Already in your fruit bowl", rightLabel: "Three teaspoons in a glass jar",
    strike: "/ jar", verdict: "NOBODY MAKES A PENNY FROM THE FIRST ONE", subtitle: "Fourteen nights of this cost me nothing at all" },

  // ── MECANISMO ────────────────────────────────────────────────────────────────
  { phrase: "Because there are three separate things", kind: "rule", number: "03", title: "THREE THINGS AT ONCE" },
  { phrase: "The first thing is a film", kind: "avatarpizarra", items: [
    { card: "1 - The inside of the skin is wet", sub: "pectin and natural sugars, sitting in that water", atPhrase: "full of pectin and natural sugars" },
    { card: "2 - As it dries, it contracts", sub: "it shrinks, very slightly, like the skin on custard", atPhrase: "And as it dries it contracts" },
    { card: "3 - So your face feels lifted", sub: "and none of that has touched the line underneath", atPhrase: "your face feels tighter" },
  ] },
  { phrase: "that is what everybody means", kind: "mitoverdad", mythLabel: "WHAT YOU ARE TOLD", truthLabel: "WHAT ACTUALLY HAPPENS",
    myth: "Tight means it is working",
    truth: "Tight means a film of fruit sugar is shrinking on top of you",
    flipPhrase: "It will be gone the moment you wash" },
  { phrase: "the same trick as the peel off masks", kind: "chips", title: "The same trick, older than all of us", eyebrow: "Where you have met it before", image: I("h_120"),
    chips: ["Peel off masks", "Egg white", "Gelatin", "A tight face feels like a young face"] },
  { phrase: "On thin skin it is the danger", kind: "errorstinger", number: "02",
    title: "The tightening is not just useless", tone: "warn", eyebrow: "Hold on to this for night three" },
  { phrase: "The second thing is the one that actually matters", kind: "avatarpizarra", items: [
    { card: "1 - The compounds are water soluble", sub: "they sit in the wet layer that touches your face", atPhrase: "and they are water soluble" },
    { card: "2 - Skin is a barrier, and should be", sub: "most of it stays on the top. That is not a failure.", atPhrase: "Most of it stays on top" },
    { card: "3 - The top is where the damage starts", sub: "the redness, the roughness, the dull grey look", atPhrase: "But the top is where the damage starts" },
  ] },
  { phrase: "for two weeks is not nothing", kind: "stat", eyebrow: "Ten minutes, every other night",
    value: 14, suffix: " nights", label: "Slow, boring, and it does not feel like anything at all" },
  { phrase: "The third thing is water", kind: "avatarpizarra", items: [
    { card: "1 - The inside of the peel is mostly water", sub: "you are giving your face a short drink", atPhrase: "you are giving your face a short drink" },
    { card: "2 - Evaporating water takes yours with it", sub: "which is how a hydrating thing leaves you drier", atPhrase: "It takes some of yours with it" },
    { card: "3 - So it needs a lid on top", sub: "the plainest, cheapest thing in the cupboard, on damp skin", atPhrase: "So it needs a lid on top" },
  ] },
  { phrase: "the plainest cheapest most boring thing", kind: "ingredientduo", leftImg: I("h_143"), rightImg: I("h_146") },

  // ── LAS REGLAS · NOCHES 1 Y 2 ────────────────────────────────────────────────
  { phrase: "The rules I set myself", kind: "rule", number: "04", title: "FOURTEEN NIGHTS" },
  { phrase: "Two test areas", kind: "splitlist", title: "Two test areas, and one of them had no hope in it", items: [
    "My face - photographed at the kitchen window at seven every morning, same light, same angle",
    "The backs of my hands - where I had honestly stopped looking, so I could not fool myself",
  ] },
  { phrase: "I felt ridiculous", kind: "callout", figure: "1", eyebrow: "Night one",
    caption: "Standing in my own kitchen at half past nine rubbing a piece of fruit rubbish on my face" },
  { phrase: "Genuinely nothing", kind: "callout", figure: "0", eyebrow: "Night two",
    caption: "Most of a fortnight is nothing. If somebody saw a change on day two, they are describing the film" },

  // ── EL ERROR ─────────────────────────────────────────────────────────────────
  { phrase: "and every single one of them said the same", kind: "rule", number: "05", title: "NIGHT THREE" },
  { phrase: "Leave it on until it dries completely", kind: "mitoverdad", mythLabel: "WHAT YOU ARE TOLD", truthLabel: "WHAT ACTUALLY HAPPENS",
    myth: "Leave it on until it dries completely, then rinse",
    truth: "Take it off while it is still wet. The drying is the part that hurt me.",
    flipPhrase: "I stopped letting it dry" },
  { phrase: "And it took nearly 25 minutes", kind: "hourdial", hour: 10, big: "25", unit: "MIN", tone: "warn",
    label: "By the end my face felt like a drum" },
  { phrase: "Dried banana sugar does not simply rinse", kind: "process", eyebrow: "What actually happens at the sink", title: "Why the drying is the trap", steps: [
    { title: "It goes tacky", body: "the film sets and stops being liquid" },
    { title: "Then it goes gluey", body: "and plain water will not lift it" },
    { title: "So you rub", body: "hardest exactly where the film is thinnest - under the eye" },
  ] },
  { phrase: "which is the thinnest skin on the entire", kind: "bars", title: "How thick is the skin, really", unit: "mm", bars: [
    { label: "Most of your face", value: 100, note: "about 2 mm" },
    { label: "Under your eye", value: 25, tone: "danger", note: "a fraction of it, and almost no oil glands" },
  ] },
  { phrase: "was pink and thin and crumpled", kind: "errorstinger", number: "03",
    title: "Four minutes of rubbing, two days of damage", tone: "danger", eyebrow: "Night four" },
  { phrase: "It was simply hot and wet", kind: "callout", figure: "!", eyebrow: "It was not an allergy",
    caption: "No swelling, no itching - just skin dragged about while it was hot and wet, which is the fastest way to age a face overnight", medico: true },

  // ── LAS MANOS · EL METODO CORREGIDO ──────────────────────────────────────────
  { phrase: "On my hands", kind: "rule", number: "06", title: "THE HANDS" },
  { phrase: "After six nights the right hand looked different", kind: "ingredientduo", leftImg: I("h_221"), rightImg: I("h_226") },
  { phrase: "Not gone", kind: "frasecinetica", words: ["Not gone.", "Softer."], tone: "teal" },
  { phrase: "And I changed absolutely everything", kind: "process", eyebrow: "Night seven onwards", title: "What I changed", steps: [
    { title: "Seven or eight minutes", body: "and off while it is still visibly wet" },
    { title: "Cool water, nine seconds", body: "the film never sets, so nothing has to be dragged" },
    { title: "On the bone, never the hollow", body: "the ridge you can feel with a fingertip, and no further in" },
    { title: "Pressed, never rubbed", body: "nothing a dermatologist would call friction" },
  ] },

  // ── SEMANA DOS ───────────────────────────────────────────────────────────────
  { phrase: "Night 11 is when my sister came round", kind: "quote",
    text: "Your face is not shiny and it is not dull. What have you changed?",
    author: "My sister, who is two years older and has never been kind about my face" },
  { phrase: "It looked more even", kind: "avatarkeyword", items: [
    { card: "Even", sub: "the word I had been failing to find for eleven days" },
  ] },
  { phrase: "20 minutes instead of two hours", kind: "bars", title: "How long the morning puffiness lasted", unit: "min", bars: [
    { label: "Before", value: 100, note: "about two hours, every morning of my life" },
    { label: "Second week", value: 17, winner: true, note: "twenty minutes, consistently" },
  ] },
  { phrase: "They are not a transformation", kind: "checklist", eyebrow: "The honest limits", title: "What fourteen nights did NOT do", items: [
    { text: "The lines from my nose to my mouth are exactly where they were", state: "danger" },
    { text: "The vertical one between my eyebrows is exactly where it was", state: "danger" },
    { text: "Nothing pressed onto the surface reaches a fold made of forty years", state: "danger" },
    { text: "And no, it is not a substitute for sun protection", state: "warn" },
  ] },
  { phrase: "What changed was the surface", kind: "splitlist", title: "The honest list", items: [
    "Texture and evenness - not shiny, not dull",
    "The dullness and the papery look on the backs of my hands",
    "Two hours of morning puffiness down to about twenty minutes",
  ] },

  // ── EL MEDICO ────────────────────────────────────────────────────────────────
  { phrase: "I have a dermatologist I have seen for years", kind: "rule", number: "07", title: "THE APPOINTMENT" },
  { phrase: "the peel off sensation is the oldest", kind: "quote",
    text: "The tightening is a film. The peel off sensation is the oldest and most profitable illusion in the business.",
    author: "The dermatologist, mid-appointment" },
  { phrase: "because the injury was mechanical", kind: "callout", figure: "=", eyebrow: "Strawberry, egg white, gelatin",
    caption: "Any of them would have given me the same night four. The injury was mechanical - it was never the banana", medico: true },
  { phrase: "Then he gave me three warnings", kind: "process", eyebrow: "What the doctor said", title: "His three warnings", steps: [
    { title: "Latex cross reaction", body: "banana sits on that list with avocado, chestnut and kiwi" },
    { title: "The skin is the sprayed part", body: "wash it, warm water, both sides, before it touches you" },
    { title: "On the bone, never the hollow", body: "orbital skin is a fraction of the thickness and has almost no oil glands" },
  ] },
  { phrase: "Inside of the forearm a small patch", kind: "checklist", eyebrow: "Safety", title: "Read this bit before you try it", items: [
    { text: "Patch test on the inside of your forearm and leave it a full DAY", state: "done" },
    { text: "Ever reacted to latex gloves or party balloons? This one is not for you", state: "danger" },
    { text: "Wash the banana - warm water, both sides - before anything touches your face", state: "done" },
    { text: "The bone under your eye is as close as you EVER go", state: "danger" },
    { text: "Broken, angry or eczema skin - not right now", state: "warn" },
  ] },
  { phrase: "That is where the fungicide sits", kind: "blurexplainer", clip: "broll/grbanana_313.mp4", image: I("h_312"), side: "left",
    eyebrow: "The part I had never thought about", title: "The peel is the sprayed half",
    body: "The fruit inside is protected - that is what a peel is for. I had been pressing the sprayed side of a supermarket banana against my face without running it under a tap." },

  // ── EL PAYOFF · EL RELOJ ─────────────────────────────────────────────────────
  { phrase: "Because I promised you a clock", kind: "rule", number: "08", title: "THE CLOCK" },
  { phrase: "Yes that dopamine", kind: "callout", figure: "100x", eyebrow: "Dopamine, in the skin of a banana",
    caption: "Not there to make anything happy - plants have no interest in your mood. It is there because it is a very powerful antioxidant", medico: true },
  { phrase: "80 to 560 milligrams", kind: "bars", title: "Dopamine, milligrams per hundred grams", unit: "mg", bars: [
    { label: "The peel", value: 100, winner: true, note: "80 to 560" },
    { label: "The fruit", value: 2, note: "2.5 to 10" },
  ] },
  { phrase: "what happens to a banana peel when you tear it open", kind: "avatarpizarra", items: [
    { card: "1 - You tear it, and the tissue opens", sub: "an enzyme inside meets the air for the first time", atPhrase: "the moment you break that tissue" },
    { card: "2 - It converts the compounds to pigment", sub: "that is what the brown actually is", atPhrase: "an enzyme inside it meets the air" },
    { card: "3 - So the browning is the spending", sub: "watch the torn edge go grey and tan while you finish your tea", atPhrase: "Watch the torn edge" },
  ] },
  { phrase: "The browning is the peel spending", kind: "frasecinetica", words: ["The brown", "is the receipt."], tone: "gold" },
  { phrase: "Almost everybody will tell you to use an overripe", kind: "mitoverdad", mythLabel: "WHAT YOU ARE TOLD", truthLabel: "WHAT ACTUALLY HAPPENS",
    myth: "Use the brownest, ripest, most speckled banana you can find",
    truth: "A peel that has gone brown has already spent it. Yellow, with a few freckles.",
    flipPhrase: "What you want is a peel that is still yellow" },
  { phrase: "with a few freckles", kind: "ingredientduo", leftImg: I("h_357"), rightImg: I("h_355") },
  { phrase: "That is the whole difference", kind: "guardaesto", title: "The whole thing, in four lines",
    tag: "Golden Remedies", prompt: "Save this", items: [
      "1 - Ripe, not brown. Yellow with a few freckles. Wash it first.",
      "2 - Tear it and use it within a few minutes. Fresh piece, never the one that has been lying there.",
      "3 - Press it on. Never rub. On the bone under the eye, never in the hollow.",
      "4 - Seven or eight minutes, off while still wet, then a plain lid on damp skin. Every other night.",
    ] },

  // ── CIERRE ───────────────────────────────────────────────────────────────────
  { phrase: "in the description just underneath this video", kind: "lowerthird",
    title: "The exact method is in the DESCRIPTION", kicker: "GOLDEN REMEDIES", tag: "GOLDEN REMEDIES",
    desc: "Ripeness, how big a piece, how many minutes, which side, what goes over it and how many nights a week - with the patch test at the top.", tone: "teal" },
  { phrase: "I want to talk about the papery brown skins", kind: "chips", title: "Next time - the papery brown skins on an onion", eyebrow: "Coming next", image: I("h_381"),
    chips: ["The bit that falls off on the board", "Many times more of it in the paper than in the whole onion", "And it is sold in capsules in every health shop"] },
  { phrase: "Nothing in my kitchen is rubbish", kind: "nametag", name: "Golden Remedies",
    role: "The remedies nobody could sell you - every week", image: I("hero_01") },
];

const capOfDur = { avatarpizarra: 8, avatarkeyword: 8, mitoverdad: 6.5, bars: 6.5, splitlist: 8.5, checklist: 9, lowerthird: 6,
  frasecinetica: 5.5, nametag: 6, process: 9, chips: 6, hourdial: 5, pricewar: 8, ingredientduo: 7, benefitlock: 7.5,
  freezezoom: 4.5, callout: 6.5, blurexplainer: 7, errorstinger: 2.4, guardaesto: 9 };

const missingAnchors = [];
const cmpBeats = [];
let cmpCursor = 0;
for (let k = 0; k < CMP.length; k++) {
  const spec = CMP[k];
  const ms = findMs(spec.phrase, cmpCursor);
  if (ms == null) { missingAnchors.push(spec.phrase); continue; }
  cmpCursor = ms;
  const { phrase, ...rest } = spec;
  cmpBeats.push({ id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest });
}

// ── post-pass pizarras + flip del mito ─────────────────────────────────────────
const KIT_CLIPS = [];
for (const beat of cmpBeats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...restI } = it; return { ...restI, at: atF };
    });
    const GAP = 90;
    if (last > 330 || last === 0) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    beat.dur = +(last / 30 + 4.2).toFixed(2);
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
}
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

// ── COSTURAS DEL BUCLE DEL AVATAR ───────────────────────────────────────────────
// El avatar es un loop de 152.03s: cada múltiplo es un corte duro. Se los tapa exigiendo
// que en ese instante haya CONTENIDO cubriendo (nunca avatar full). El Main lo consume.
const seamUncovered = SEAMS.filter((s) => !COVER.some((c) => s >= c.start - 0.15 && s < c.start + c.cov - 0.15)
                                       && !cmpBeats.some((c) => s >= c.start && s < c.start + c.dur));

const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const U = SLUG.toUpperCase();
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; cov: number; query: string }[] = ${JSON.stringify(BROLL)};\n` +
  `export const ${U}_COVER: { start: number; cov: number; kind: string; src: string }[] = ${JSON.stringify(COVER)};\n` +
  `export const ${U}_SEAMS: number[] = ${JSON.stringify(SEAMS)};\n` +
  `export const ${U}_TALKS: { start: number; dur: number }[] = [];\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA + PACING ─────────────────────────────────────────────────────────────────
const durs = beats.map((b) => b.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
const pct5 = Math.round(durs.filter((d) => d >= 5).length / durs.length * 100);
const distinct = new Set(cmpBeats.map((b) => b.kind));
const need = new Set();
ALL.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (b.leftImg) need.add(b.leftImg); if (b.rightImg) need.add(b.rightImg); if (b.leftImage) need.add(b.leftImage); if (b.rightImage) need.add(b.rightImage); if (b.clip) need.add(b.clip); (b.cards || []).forEach((c) => c.img && need.add(c.img)); });
BROLL.forEach((b) => need.add(b.src));
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
fs.writeFileSync(`_${SLUG}_need.json`, JSON.stringify([...need].sort(), null, 1));
console.log(`beats ${ALL.length} (raw ${beats.length} · comp ${cmpBeats.length}) · broll ${BROLL.length} · fin ${Math.max(...ALL.map(b=>b.start+b.dur)).toFixed(0)}s / audio ${VIDEO_END}s`);
console.log(`PACING raw → mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · ${pct5}% de planos ≥5s (objetivo: mediana 3.5-4.5 · p75 >5 · 36-43% ≥5s)`);
console.log(`componentes: ${cmpBeats.length} · kinds distintos ${distinct.size} [${[...distinct].join(", ")}] · pizarras ${KIT_CLIPS.length}`);
console.log(`sin anclar (interpolados): ${unanchored.length}`);
if (missingAnchors.length) console.log(`⚠ COMPONENTES SIN ANCLA:`, missingAnchors);
console.log(`costuras del bucle del avatar: ${SEAMS.length} · DESCUBIERTAS: ${seamUncovered.length}${seamUncovered.length ? " → " + seamUncovered.join(", ") : " ✓"}`);
console.log(`assets referenciados ${need.size} · faltan en public/: ${miss.length}`);
