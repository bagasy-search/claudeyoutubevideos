// gen_grcoffee.mjs — beatsheet/taza9pm.json (Canal "Golden Remedies" (EN) · I RUBBED COFFEE ON MY FACE FOR 7 DAYS).
// Material = clips agnes texto-a-video (GRATIS) + imágenes agnes + gpt-image-2 low SOLO las fotos HERO
// con la cara del Dr. Clon de gen_fcscanela (incluye el fix anti-hueco: cada contenido cubre su `cov` real).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "grvaseline";
const VIDEO_END = 2261.87;        // = largo real del master (Fish + fish_breathe)
const AVATAR_CYCLE = 630.60;      // el avatar cubre 10:30.6 de 37:41 -> BUCLE, costuras en multiplos

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
    const penal = (hard[idx[k]] != null ? 0.45 : 0) + (SRC[idx[k]].engine === "gptimage_ref" ? 99 : 0);
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
  // ⚠ ORDEN CRONOLOGICO OBLIGATORIO: findMs(spec.phrase, cmpCursor) solo avanza.
  // ⛔ eyebrow SIEMPRE explicito en INGLES: el kit los trae por defecto en ESPANOL y salieron
  //    en pantalla en grcoffee ("Paso a paso", "En resumen", "Como darte cuenta").
  // ⛔ nada de `board` ni `diagram`: el avatar es un BUCLE y pasada la costura mostraria la cara
  //    fuera de sincro; `diagramFor` devuelve el diagrama de otro video si el concepto no matchea.
  // ⛔ `stat`/`hourdial` llevan value NUMERICO (BigStatReveal con texto rinde "000").

  // ── EL SUJETO ────────────────────────────────────────────────────────────────
    { phrase: "the other one costs about", kind: "bars", title: "How long one purchase actually lasts", unit: "weeks", bars: [
    { label: "The tub, about $4", value: 104, winner: true, note: "two years" },
    { label: "The jar, about $80", value: 11, tone: "danger", note: "eleven weeks" },
  ] },
  { phrase: "no vitamins in it no actives", kind: "checklist", eyebrow: "What is actually in the tub", title: "One ingredient. That is the list.", items: [
    { text: "No vitamins", state: "danger" },
    { text: "No actives", state: "danger" },
    { text: "No botanicals — nothing your skin can eat", state: "danger" },
    { text: "No preservative, no fragrance, no emulsifier to react to", state: "ok" },
  ] },
{ phrase: "it is a lid", kind: "headline",
    tokens: [{ t: "It" }, { t: "is" }, { t: "not" }, { t: "a" }, { t: "moisturiser." }, { t: "It", hl: true }, { t: "is", hl: true }, { t: "a", hl: true }, { t: "LID.", hl: true }],
    eyebrow: "One ingredient. That is the entire product." },
  { phrase: "in 1859 a young chemist", kind: "rule", number: "01", title: "WHERE IT CAME FROM" },
  { phrase: "they rubbed it on their cuts", kind: "callout", figure: "→", eyebrow: "Rod wax, scraped off the drilling rods",
    caption: "The oil men cursed it — then rubbed it on their cuts and burns, and those closed up faster", medico: true },
    { phrase: "he patented it in", kind: "frasecinetica", perWord: 11, tone: "teal",
    words: [{ t: "Patented" }, { t: "in" }, { t: "1872." }, { t: "The" }, { t: "patent" }, { t: "ran" }, { t: "out", hl: true }, { t: "a", hl: true }, { t: "century", hl: true }, { t: "ago.", hl: true }] },
{ phrase: "he lived to", kind: "stat", eyebrow: "Robert Chesebrough, who ate a spoonful a day",
    value: 96, label: "He toured the country burning his own arm to sell it. He lived to ninety six." },
  { phrase: "it was in every medicine cabinet", kind: "chips", title: "What this was, for a hundred years", eyebrow: "Before it became a dirty word",
    image: I("036"), chips: ["Every medicine cabinet in the west", "Two world wars, in soldiers' kits", "On every burns ward", "Your grandmother's hands and your knee"] },

  // ── MECANISMO ────────────────────────────────────────────────────────────────
  { phrase: "there are four things happening", kind: "chips", title: "Four things are happening at once", eyebrow: "The mechanism",
    image: I("lam_seal_closed"), chips: ["It seals — 98% of the water stays in", "The water held in is YOUR OWN", "It protects the repair hours", "Nothing in it to react to"] },
  { phrase: "the first thing is the seal", kind: "avatarpizarra", items: [
    { card: "1 · Your skin is leaking, right now", sub: "transepidermal water loss — the tax you pay for having a surface", atPhrase: "your skin is leaking right now" },
    { card: "2 · After the menopause it leaks faster", sub: "the fats between the cells thin out with the years", atPhrase: "the mortar between the cells" },
    { card: "3 · A lid stops about 98% of it", sub: "oils get you twenty. A rich cream, similar.", atPhrase: "the leaking stops not slows" },
  ] },
  { phrase: "transepidermal water loss", kind: "freezezoom", image: I("lam_seal_leak"), x: 0.5, y: 0.5, zoom: 1.9,
    tone: "teal", label: "Water walking out of your skin, all day and all night" },
    { phrase: "so a woman of 57", kind: "stat", eyebrow: "Why it changes after the menopause",
    value: 57, label: "The same face leaks more water every hour at 57 than it did at 35 — the fats between the cells thin out." },
{ phrase: "oils get you", kind: "bars", title: "How much of the water actually stays in", unit: "%", bars: [
    { label: "Petroleum jelly", value: 98, winner: true, note: "a near total seal" },
    { label: "Oils", value: 25, note: "twenty, maybe thirty percent" },
    { label: "A good rich cream", value: 28, note: "about the same" },
  ] },
  { phrase: "it lets gas through", kind: "blurexplainer", clip: "broll/grvaseline_058.mp4", image: I("lam_seal_closed"), side: "right",
    eyebrow: "No, it does not suffocate your skin", title: "It is not cling film",
    body: "Your skin takes its oxygen from your blood, not through the surface. The layer lets gas through and holds water back. That is the whole trick." },
  { phrase: "the water is coming out of you", kind: "callout", figure: "0", eyebrow: "There is no water in the tub at all",
    caption: "The water held under there is your own, rising up from the living layers underneath", medico: true },
  { phrase: "and those flat dead cells at the surface", kind: "annotated", eyebrow: "What is actually happening up there",
    caption: "The dead cells at the surface drink the trapped water and swell", image: I("lam_layers_stack"),
    annotations: [{ label: "The seal on top", x: 50, y: 20 }, { label: "Water held against the skin", x: 50, y: 55 }, { label: "A fine line in plumped skin is shallower", x: 50, y: 82 }] },
    { phrase: "your skin does its rebuilding at night", kind: "frasecinetica", perWord: 10, tone: "teal",
    words: [{ t: "Your" }, { t: "skin" }, { t: "rebuilds" }, { t: "at" }, { t: "night." }, { t: "And", hl: true }, { t: "that", hl: true }, { t: "is", hl: true }, { t: "when", hl: true }, { t: "it", hl: true }, { t: "leaks", hl: true }, { t: "most.", hl: true }] },
{ phrase: "it climbs through the evening", kind: "freezezoom", image: I("lam_night_curve"), x: 0.68, y: 0.45, zoom: 1.7,
    tone: "gold", label: "Water loss peaks in the small hours — that is why this is a night thing" },
  { phrase: "at around two or three in the morning", kind: "hourdial", hour: 3, big: "3", unit: "AM", tone: "gold",
    label: "Your face is losing more water than at any other point in the day" },
  { phrase: "and do you know what they mix them into", kind: "freezezoom", image: I("lam_patch_grid"), x: 0.5, y: 0.42, zoom: 1.8,
    tone: "teal", label: "The allergy test itself is carried in petroleum jelly" },
  { phrase: "that is how close to inert this is", kind: "headline",
    tokens: [{ t: "When" }, { t: "the" }, { t: "point" }, { t: "is" }, { t: "to" }, { t: "make" }, { t: "skin" }, { t: "REACT," }, { t: "this", hl: true }, { t: "is", hl: true }, { t: "what", hl: true }, { t: "must", hl: true }, { t: "not.", hl: true }],
    eyebrow: "One ingredient · no preservative · no fragrance · no emulsifier" },

  // ── POR QUE NADIE TE LO DICE ─────────────────────────────────────────────────
    { phrase: "every bottle in my bathroom has a preservative", kind: "chips", title: "What every other bottle brings with it", eyebrow: "Three things your face can object to",
    image: I("087"), chips: ["A preservative", "A fragrance", "An emulsifier to hold oil and water", "Any of them, at 57, on a Tuesday"] },
{ phrase: "nobody can own it", kind: "headline",
    tokens: [{ t: "There" }, { t: "is" }, { t: "no" }, { t: "margin" }, { t: "in", hl: true }, { t: "the", hl: true }, { t: "bottom", hl: true }, { t: "shelf.", hl: true }],
    eyebrow: "The patent ran out over a century ago" },
    { phrase: "it sits on the bottom shelf of the chemist", kind: "callout", figure: "$", eyebrow: "Between the cotton wool and the plasters",
    caption: "Nobody spends money teaching you about the bottom shelf, because there is no margin on the bottom shelf", medico: true },
{ phrase: "it needed an enemy", kind: "mitoverdad", eyebrow: "What you were taught",
    mito: "It is crude oil. It suffocates your skin and clogs your pores.",
    verdad: "What is sold in a chemist is refined to a pharmaceutical standard, three times over. The testing says it does not block a pore.",
    flipPhrase: "the refining is the whole story" },
  { phrase: "the molecules are simply too big", kind: "blurexplainer", clip: "broll/grvaseline_123.mp4", image: I("lam_molecule_pore"), side: "left",
    eyebrow: "Why it never sinks in", title: "It has nowhere to go",
    body: "The molecules are too big to get down into a pore in the first place. It stays on top — which, for a lid, is the entire job description." },
  { phrase: "your doctor is not hiding this from you", kind: "quote",
    text: "It is the most boring recommendation in all of dermatology. And it is also one of the best ones.",
    author: "The dermatologist, with the door shut" },
    { phrase: "it is what gets handed to the parents", kind: "chips", title: "Where your doctor already uses it", eyebrow: "Not hidden — in daily use",
    image: I("129"), chips: ["The burns ward", "After surgery", "After laser work", "Handed to the parents of a newborn with eczema"] },
{ phrase: "put it over a wound that has not been properly cleaned", kind: "checklist", eyebrow: "Why they will not say it on camera",
    title: "It seals whatever it finds", items: [
      { text: "Over clean, intact skin — it protects it", state: "ok" },
      { text: "Over a wound that is not clean — you sealed that in, warm, for eight hours", state: "danger" },
      { text: "Over a prescription retinoid — you just made a mild product a strong one", state: "danger" },
    ] },

  // ── LAS 14 NOCHES ────────────────────────────────────────────────────────────
  { phrase: "the 14 nights", kind: "rule", number: "02", title: "FOURTEEN NIGHTS, ONE MIRROR" },
    { phrase: "use an old pillowcase", kind: "errorstinger", number: "03", title: "It WILL get on the pillow",
    tone: "warn", eyebrow: "Night one, the part nobody warns you about" },
{ phrase: "night three is where i got greedy", kind: "errorstinger", number: "01", title: "I got greedy on night three",
    tone: "warn", eyebrow: "The mistake" },
  { phrase: "my left eye gummed shut", kind: "callout", figure: "4", eyebrow: "Night 4 — an hour before I could see properly",
    caption: "The lid puffy, the skin sore. Entirely my fault — and it is the instruction almost every video gives you.", medico: true },
    { phrase: "nights five six and seven i went back", kind: "process", eyebrow: "The method I went back with", title: "How it is actually done", steps: [
    { title: "A grain of rice", desc: "For BOTH eyes. Not a scoop, not a layer." },
    { title: "Warmed between two fingertips", desc: "Until it stops being a solid and turns almost to an oil." },
    { title: "Pressed along the bone", desc: "Not rubbed. And nowhere else." },
  ] },
{ phrase: "about a grain of rice", kind: "stat", eyebrow: "The amount, for BOTH eyes",
    value: 1, label: "One grain of rice. Warmed between two fingertips until it goes clear, then pressed along the bone." },
  { phrase: "night eight was the first morning", kind: "stat", eyebrow: "Night 8 — the first real change",
    value: 8, label: "Not the puffiness. The fan of fine lines at the outer corner — softer, and filled rather than papery." },
    { phrase: "they were still there", kind: "mitoverdad", eyebrow: "What I am NOT going to tell you",
    mito: "My eyes looked ten years younger.",
    verdad: "The lines were exactly where I left them. What changed was the surface — filled in, calm, and no longer struggling.",
    flipPhrase: "what had changed was the surface" },
{ phrase: "something is going on round your eyes", kind: "callout", figure: "“", eyebrow: "Night 10 — my sister, who never says it",
    caption: "What are you on? Round your eyes. Something is going on round your eyes.", medico: true },
  { phrase: "16 years", kind: "pricewar", leftImage: I("lam_dry_sealed"), rightImage: I("197"),
    leftPrice: "$4", rightPrice: "$60", leftLabel: "A tub that lasts two years", rightLabel: "A jar she has bought since 2009",
    strike: "/ jar", verdict: "SIXTEEN YEARS", subtitle: "I did the arithmetic standing at the sink and had to stop" },
  { phrase: "what had changed was the surface", kind: "chips", title: "Night 14 — the honest result", eyebrow: "Same window, same hour, same dressing gown",
    image: I("219"), chips: ["The deep crease exactly where I left it", "The fine crepey texture smoother", "The dry corner gone completely", "Skin that was not struggling"] },

  // ── EL MEDICO ────────────────────────────────────────────────────────────────
  { phrase: "now the appointment", kind: "rule", number: "03", title: "THE APPOINTMENT" },
  { phrase: "and then he gave me three warnings", kind: "process", eyebrow: "What the doctor said", title: "His three warnings", steps: [
    { title: "The boundary", desc: "The orbital bone. Not onto the soft lid, not near the lash line. Never." },
    { title: "What is underneath", desc: "It seals whatever it finds. Clean face, and it goes on last." },
    { title: "And the way you put it on", desc: "The one that turned out to be the whole ending of this video." },
  ] },
  { phrase: "the orbital bone", kind: "freezezoom", image: I("lam_orbital_rim"), x: 0.44, y: 0.46, zoom: 1.8,
    tone: "teal", label: "That hard ridge is the line. You do not cross it." },
  { phrase: "because this stuff migrates", kind: "blurexplainer", clip: "broll/grvaseline_247.mp4", image: I("lam_migration"), side: "right",
    eyebrow: "Why the boundary matters more here", title: "It travels towards the eye",
    body: "It is warm on your skin, it thins out, and it creeps — because that is downhill and because you blink. By two in the morning it was in my eye." },

  // ── LIMITES HONESTOS ─────────────────────────────────────────────────────────
  { phrase: "but before that the limits", kind: "checklist", eyebrow: "Honest limits", title: "The limits, before the good part", items: [
    { text: "It will NOT remove a wrinkle. Nothing on the surface does", state: "danger" },
    { text: "Nothing for pigment, age spots or sun damage", state: "danger" },
    { text: "The filling is WATER — temporary. By the afternoon much of it has gone", state: "warn" },
    { text: "It does not feed your skin. There is nothing in it to feed with", state: "warn" },
  ] },
  { phrase: "little white bumps around the eye", kind: "callout", figure: "!", eyebrow: "Milia — a small group of people get them",
    caption: "Harmless, annoying, and they take weeks to go. If it starts happening to you, stop.", medico: true },

  // ── QUE VA DEBAJO ────────────────────────────────────────────────────────────
  { phrase: "and it is not sunscreen", kind: "callout", figure: "SUN", eyebrow: "If you only ever do ONE thing",
    caption: "It is not this, and it is not anything else in a tub. This is the pleasant thing you do on top of the boring thing that matters.", medico: true },
  { phrase: "now what goes underneath", kind: "splitlist", title: "What goes under the lid — the four I tried",
    items: [
      "PLAIN WATER — skin still damp. Costs nothing and works better than it has any right to.",
      "GLYCERIN — a humectant. My favourite of the four, and about a dollar.",
      "PLAIN ALOE GEL — cool, some water of its own. Check it is actually aloe.",
      "THE BORING CREAM YOU OWN — this is not a replacement for it. It is a lid for it.",
    ] },
    { phrase: "the first is plain water", kind: "ingredients", title: "The free version, in three moves", items: [
    { name: "Rinse", amount: "and do not dry", image: I("310") },
    { name: "Leave it damp", amount: "cool and slightly wet", image: I("312") },
    { name: "Press the jelly over it", amount: "a film, not a layer", image: I("314") },
  ] },
{ phrase: "the second is glycerin", kind: "blurexplainer", clip: "broll/grvaseline_319.mp4", image: I("lam_layers_stack"), side: "left",
    eyebrow: "Humectant underneath, seal on top", title: "You have just built a night cream",
    body: "A humectant pulls water towards itself and holds it. Seal that in, and you have the entire architecture of every good night cream ever made — for about a dollar." },
  { phrase: "your hands overnight", kind: "callout", figure: "3", eyebrow: "The one where the result is undeniable",
    caption: "Hands, overnight, with cotton gloves over the top. Three nights and you will see it.", medico: true },
      { phrase: "your heels the same with cotton socks", kind: "chips", title: "Everywhere else it earns its place", eyebrow: "Where it stops being about your face",
    image: I("348"), chips: ["Hands, with cotton gloves — three nights", "Heels, with cotton socks", "The cracked corners of your mouth", "Cuticles and dry shins"] },
{ phrase: "it will not grow your eyelashes", kind: "mitoverdad", eyebrow: "Two places the answer is simply no",
    mito: "It grows your lashes and your eyebrows.",
    verdad: "It cannot. There is nothing in it that could. It makes the ones you already have look darker and glossier while it sits on them. That is all.",
    flipPhrase: "there is nothing in it that could" },
{ phrase: "never ever inside your nose", kind: "errorstinger", number: "02", title: "Never inside your nose",
    tone: "danger", eyebrow: "A very old piece of advice that is wrong" },
  { phrase: "please do not skip this bit", kind: "checklist", eyebrow: "Safety", title: "Before you try any of this", items: [
    { text: "Patch test inside the elbow. Leave it a day", state: "ok" },
    { text: "Never seal a wound that is not properly cleaned", state: "danger" },
    { text: "Get it out with a clean spoon — not the same finger, night after night", state: "warn" },
    { text: "Anything prescribed for your face? Ask before you seal over it", state: "warn" },
  ] },

  // ── EL ERROR · EL PAYOFF ─────────────────────────────────────────────────────
    { phrase: "and now the mistake", kind: "rule", number: "04", title: "THE MISTAKE, AND THE FIX" },
{ phrase: "put a good thick layer on", kind: "mitoverdad", eyebrow: "What everybody tells you",
    mito: "Put a good thick layer on. Slather it. More is better.",
    verdad: "A thick layer cannot seal better than a thin one. The seal is made by the first microscopically thin film that touches your skin.",
    flipPhrase: "a thick layer does not seal better" },
  { phrase: "the first microscopically thin film", kind: "blurexplainer", clip: "broll/grvaseline_402.mp4", image: I("lam_thin_vs_thick"), side: "right",
    eyebrow: "All of the risk, none of the benefit", title: "It is not a slather. It is a film.",
    body: "Everything above that first film does nothing at all — it just sits there getting warm, and creeps. The mess, the pillow, the gummed up eye: all of it comes from the part that was never working." },
    { phrase: "it is not a slather", kind: "frasecinetica", perWord: 13, tone: "warn",
    words: [{ t: "It" }, { t: "is" }, { t: "not" }, { t: "a" }, { t: "slather." }, { t: "It", hl: true }, { t: "is", hl: true }, { t: "a", hl: true }, { t: "FILM.", hl: true }] },
{ phrase: "never put a lid on an empty pot", kind: "freezezoom", image: I("lam_dry_sealed"), x: 0.5, y: 0.5, zoom: 1.75,
    tone: "gold", label: "Seal bone dry skin and you have sealed the dry IN" },
  { phrase: "the water has to be there first", kind: "headline",
    tokens: [{ t: "The" }, { t: "water" }, { t: "has" }, { t: "to" }, { t: "be" }, { t: "there", hl: true }, { t: "FIRST.", hl: true }],
    eyebrow: "That is the whole secret, and it is free" },

  // ── CIERRE ───────────────────────────────────────────────────────────────────
  { phrase: "damp skin a film not a layer", kind: "guardaesto", title: "The whole thing, in three lines",
    tag: "Golden Remedies", prompt: "Save this", items: [
      "1 · Rinse and do NOT dry. Leave the skin damp and cool.",
      "2 · A grain of rice, warmed between two fingertips until it goes clear.",
      "3 · Press it along the bone under the eye. Never above it. Every other night.",
    ] },
  { phrase: "written all of it out properly in the description", kind: "lowerthird",
    title: "The exact amounts are in the DESCRIPTION", kicker: "Free, right below this video",
    desc: "How much, what goes underneath, how long before bed, and how to take it off.", tone: "teal" },
  { phrase: "nothing in my kitchen is rubbish", kind: "nametag", name: "Golden Remedies",
    role: "The remedies nobody could sell you — every week", image: I("472") },
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
ALL.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (b.leftImg) need.add(b.leftImg); if (b.rightImg) need.add(b.rightImg); if (b.leftImage) need.add(b.leftImage); if (b.rightImage) need.add(b.rightImage); if (b.clip) need.add(b.clip); (b.cards || []).forEach((c) => c.img && need.add(c.img)); (b.items || []).forEach((i) => i && i.image && need.add(i.image)); (b.steps || []).forEach((s) => s && s.image && need.add(s.image)); });
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
