// gen_grcoffee.mjs — beatsheet/taza9pm.json (Canal "Golden Remedies" (EN) · I RUBBED COFFEE ON MY FACE FOR 7 DAYS).
// Material = clips agnes texto-a-video (GRATIS) + imágenes agnes + gpt-image-2 low SOLO las fotos HERO
// con la cara del Dr. Clon de gen_fcscanela (incluye el fix anti-hueco: cada contenido cubre su `cov` real).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "grcoffee";
const VIDEO_END = 1643.32;         // = largo real del master.wav de Fish
const AVATAR_CYCLE = 331.6;        // el avatar cubre 5:31.6 de 27:23 -> BUCLE, cortes en multiplos

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
const CMP = [
  // ── EL SUJETO ────────────────────────────────────────────────────────────────
  { phrase: "one of the most common active", kind: "stat", eyebrow: "On the label of the jar you already own",
    value: "1", prefix: "#", label: "Caffeine is one of the most common active ingredients in eye creams" },
  { phrase: "sitting high up in that list", kind: "freezezoom", image: I("fz_label"), x: 0.5, y: 0.52, zoom: 2.1,
    tone: "teal", label: "It is already in the jar you own" },
  { phrase: "where do they get that caffeine", kind: "callout", figure: "→", eyebrow: "Green coffee extract · coffee seed extract",
    caption: "The prettier name for the same bean you ground up this morning", medico: true },
  { phrase: "women have been taking the wet spent", kind: "headline",
    tokens: [{ t: "Not" }, { t: "a" }, { t: "trend." }, { t: "A", hl: true }, { t: "normal", hl: true }, { t: "Tuesday.", hl: true }],
    eyebrow: "Where coffee actually grows" },
  { phrase: "seven mornings coffee on my face", kind: "rule", number: "01", title: "THE EXPERIMENT · SEVEN DAYS" },

  // ── MECANISMO ────────────────────────────────────────────────────────────────
  { phrase: "there are four separate things", kind: "chips", title: "Four things are happening at once",
    chips: ["Caffeine narrows the vessels", "Antioxidants defend the skin", "Coffee oil slows water loss", "Five still, warm minutes"] },
  { phrase: "the first one is the caffeine", kind: "avatarpizarra", items: [
    { card: "1 · Caffeine narrows the tiny vessels", sub: "a vasoconstrictor — it works on contact", atPhrase: "narrows the tiny blood vessels" },
    { card: "2 · Under the eye the skin is half a millimetre", sub: "the thinnest skin on your whole body", atPhrase: "where your skin is thinnest" },
    { card: "3 · So the dark is BLOOD showing through", sub: "not a stain, not a shadow — ink through tracing paper", atPhrase: "like ink through a sheet" },
  ] },
  { phrase: "about two millimeters thick", kind: "bars", title: "How thick is the skin, really", unit: "mm", bars: [
    { label: "Most of your face", value: 100, note: "about 2 mm" },
    { label: "Under your eye", value: 25, tone: "danger", winner: true, note: "closer to half a millimetre" },
  ] },
  { phrase: "like ink through a sheet", kind: "blurexplainer", image: I("044"), side: "right",
    eyebrow: "Why the dark circle is dark", title: "You are not looking at a stain",
    body: "You are looking at the blood in the vessels underneath, showing through skin thin enough to see through." },
  { phrase: "largest sources of polyphenols", kind: "stat", eyebrow: "Chlorogenic acid survives in the spent grounds",
    value: "More", suffix: " than fruit", label: "Coffee is one of the largest sources of polyphenols in the western diet" },
  { phrase: "the darker the roast", kind: "ingredientduo", leftImg: I("duo_dark"), rightImg: I("duo_light") },
  { phrase: "a medium roast or a lighter one", kind: "bars", title: "What the roasting drum destroys", unit: "%", bars: [
    { label: "Light / medium roast", value: 100, winner: true, note: "keeps considerably more chlorogenic acid" },
    { label: "Dark oily roast", value: 35, tone: "danger", note: "most of it burnt off in the drum" },
    { label: "Caffeine, either roast", value: 100, note: "heat stable — survives untouched" },
  ] },
  { phrase: "for anybody over about", kind: "callout", figure: "55+", eyebrow: "Why the coffee oil matters most now",
    caption: "Half of what we call new wrinkles is a real line sitting in dry skin — and the dry part you can fix today", medico: true },
  { phrase: "five minutes a day", kind: "hourdial", hour: 7, big: "5", unit: "MIN", tone: "gold",
    label: "Warm, still, and gentle with your own face" },

  // ── POR QUE NADIE TE LO DICE ─────────────────────────────────────────────────
  { phrase: "you cannot patent a coffee ground", kind: "headline",
    tokens: [{ t: "Nobody" }, { t: "buys" }, { t: "advertising" }, { t: "for", hl: true }, { t: "your", hl: true }, { t: "trash.", hl: true }],
    eyebrow: "It was never buried — it was never funded" },
  { phrase: "milliliter jar of eye cream", kind: "pricewar", leftImage: I("pw_grounds"), rightImage: I("pw_cream"),
    leftPrice: "$0", rightPrice: "$80", leftLabel: "What you tip into the bin", rightLabel: "Three teaspoons in a glass jar",
    strike: "/ jar", verdict: "SAME ACTIVE INGREDIENT", subtitle: "You already make 15 grams of it every morning" },
  { phrase: "grams of spent grounds every", kind: "callout", figure: "15–20g", eyebrow: "Every single time you brew a pot",
    caption: "Every day. Forever. And you carry it to the bin.", medico: true },
  { phrase: "apricot pits", kind: "chips", title: "Why skin doctors warned you off scrubs",
    chips: ["Apricot pits", "Walnut shells", "Anything with a hard broken edge", "And coffee grounds got swept in with them"] },

  // ── LOS SIETE DIAS ───────────────────────────────────────────────────────────
  { phrase: "the seven days", kind: "rule", number: "02", title: "SEVEN MORNINGS, ONE WINDOW" },
  { phrase: "day two is where", kind: "stat", eyebrow: "Day 2 — the first thing I could see",
    value: "2", label: "The puffiness was down. Noticeably down. That small reward is what carries you to day seven." },
  { phrase: "day three i got greedy", kind: "errorstinger", number: "01", title: "I got greedy on day three",
    tone: "warn", eyebrow: "The mistake" },
  { phrase: "day four i did not do it", kind: "callout", figure: "0", eyebrow: "Day 4 — I did not do it at all",
    caption: "Cheeks stinging, two thin red lines. And I learned more that day than the other six put together.", medico: true },
  { phrase: "day five i went back", kind: "stat", eyebrow: "Day 5 — and I went back gentle",
    value: "5", label: "Not the puffiness this time. Texture. Smoother under my fingers, less like paper." },
  { phrase: "day six is the day somebody", kind: "callout", figure: "“", eyebrow: "Day 6 — my sister, who never says it",
    caption: "Have you changed something? You look less tired.", medico: true },
  { phrase: "my mother never threw coffee grounds out", kind: "blurexplainer", image: I("155"), side: "left",
    eyebrow: "She never called it face care", title: "The roses drank coffee before she did",
    body: "She gardened bare-handed her whole life, and I remember her hands being soft. I always assumed that was luck." },
  { phrase: "the puffiness was down", kind: "chips", title: "Day 7 — the honest result",
    chips: ["Puffiness down", "Under the eyes lighter", "Redness calmed right down", "The lines exactly where I left them"] },

  // ── EL MEDICO ────────────────────────────────────────────────────────────────
  { phrase: "the appointment", kind: "rule", number: "03", title: "THE APPOINTMENT" },
  { phrase: "that will be the caffeine", kind: "quote",
    text: "That will be the caffeine. It is a vasoconstrictor — it is what is in the products anyway.",
    author: "The dermatologist, mid-appointment" },
  { phrase: "he gave me three warnings", kind: "process", title: "His three warnings", steps: [
    { title: "The eye itself", desc: "The orbital bone is the boundary. Nothing above it — it migrates into the eye overnight." },
    { title: "Frequency", desc: "Two or three times a week. Skin needs to be left alone to repair." },
    { title: "And do not scrub", desc: "The one that turned out to be the whole ending of this video." },
  ] },

  // ── LIMITES HONESTOS ─────────────────────────────────────────────────────────
  { phrase: "now honest limits", kind: "checklist", title: "Before the good part — the honest limits", items: [
    { text: "It will NOT remove a wrinkle. Nothing on the surface does", state: "danger" },
    { text: "It will not undo sun damage or lift age spots", state: "danger" },
    { text: "The de-puffing is TEMPORARY — hours, not days", state: "warn" },
    { text: "It is not sunscreen. The sun is still the one thing that matters", state: "warn" },
  ] },
  { phrase: "more than one kind of dark circle", kind: "splitlist", title: "Three different dark circles — only one answers to coffee", items: [
    "BLUE or PURPLE, worse when tired — vascular. This is the one caffeine helps.",
    "BROWN and flat — pigment, from genes or sun. Coffee does very little.",
    "A HOLLOW under the bone — that is a shadow. No cream casts light into it.",
  ] },
  { phrase: "if your circles are brown", kind: "callout", figure: "≠", eyebrow: "Brown is pigment, not blood",
    caption: "Genetic or sun. Coffee grounds will do very little for it — and you deserve to know before you spend a month hoping.", medico: true },
  { phrase: "look in the mirror with a lamp", kind: "blurexplainer", image: I("217"), side: "right",
    eyebrow: "The 10-second test you can do tonight", title: "Hold a lamp below your face",
    body: "If the darkness fills in and vanishes, it was never a stain. It was a shadow — and no kitchen remedy casts light into a hollow." },
  { phrase: "the timeline as i actually experienced it", kind: "process", title: "What changes, and when", steps: [
    { title: "Day 2–3", desc: "The puffiness. The fast one — and the reason you keep going." },
    { title: "Week 2", desc: "Texture. Smoother under your fingertips, before it is visible." },
    { title: "Week 4–6", desc: "Tone. The evenness other people notice before you do." },
    { title: "Week 6, nothing?", desc: "Then it is not for your skin. Stop — there is no shame in it." },
  ] },
  { phrase: "one single thing for aging skin", kind: "stat", eyebrow: "If you only ever do one thing",
    value: "SUN", label: "This is the pleasant thing you do on top of the boring thing that actually matters" },

  // ── LAS MEZCLAS ──────────────────────────────────────────────────────────────
  { phrase: "plain water first", kind: "benefitlock", index: 0, cards: [
    { img: I("mix_water"), label: "Water — the purest version, and it falls off", num: "01" },
    { img: I("mix_yogurt"), label: "Yogurt — it holds, and brings lactic acid", num: "02" },
    { img: I("mix_honey"), label: "Honey — a humectant, for properly dry skin", num: "03" },
  ] },
  { phrase: "then i tried it with plain yogurt", kind: "benefitlock", index: 1, cards: [
    { img: I("mix_water"), label: "Water — the purest version, and it falls off", num: "01" },
    { img: I("mix_yogurt"), label: "Yogurt — it holds, and brings lactic acid", num: "02" },
    { img: I("mix_honey"), label: "Honey — a humectant, for properly dry skin", num: "03" },
  ] },
  { phrase: "third honey", kind: "benefitlock", index: 2, cards: [
    { img: I("mix_water"), label: "Water — the purest version, and it falls off", num: "01" },
    { img: I("mix_yogurt"), label: "Yogurt — it holds, and brings lactic acid", num: "02" },
    { img: I("mix_honey"), label: "Honey — a humectant, for properly dry skin", num: "03" },
  ] },
  { phrase: "what i settled on", kind: "ingredients", title: "The one I still do", items: [
    { name: "Used coffee grounds", amount: "1 tablespoon · brewed and COOLED", image: I("pw_grounds") },
    { name: "Plain full-fat yogurt", amount: "1 tablespoon", image: I("mix_yogurt") },
    { name: "Press, wait, rinse", amount: "4–5 min · 2–3 mornings a week", image: I("mix_water") },
  ] },
  { phrase: "the back of your hands", kind: "chips", title: "Where else it is worth doing",
    chips: ["Backs of the hands — where I saw it first", "Neck and chest, gently", "Elbows and knees, a bit firmer", "Never above the orbital bone"] },
  { phrase: "everybody asks about cellulite", kind: "callout", figure: "!", eyebrow: "The one everybody asks about",
    caption: "Coffee is in every cellulite cream for the same vasoconstriction — a few hours of tightening, sold as a cure", medico: true },
  { phrase: "cellulite is a structural thing", kind: "bars", title: "What it actually reaches", unit: "", bars: [
    { label: "The look of the surface", value: 70, note: "for a few hours — same as under your eye" },
    { label: "The fibrous bands underneath", value: 0, tone: "danger", note: "nothing you rub on the outside reaches this" },
  ] },

  // ── SEGURIDAD ────────────────────────────────────────────────────────────────
  { phrase: "patch test first", kind: "checklist", title: "Read this bit before you try it", items: [
    { text: "Patch test inside your elbow and leave it a DAY", state: "done" },
    { text: "Rosacea, eczema, broken or angry skin — not for you right now", state: "danger" },
    { text: "The orbital bone is as close to the eye as you EVER go", state: "danger" },
    { text: "On a prescription retinoid or acid? Ask whoever prescribed it first", state: "warn" },
    { text: "Never rinse grounds down the sink — they set like concrete in the trap", state: "warn" },
  ] },

  // ── EL ERROR · el payoff ─────────────────────────────────────────────────────
  { phrase: "and now the mistake", kind: "rule", number: "04", title: "THE MISTAKE" },
  { phrase: "tells you to scrub", kind: "errorstinger", number: "02",
    title: "Scrubbing it in circles", tone: "warn", eyebrow: "What everyone tells you" },
  { phrase: "that instruction is everywhere", kind: "mitoverdad",
    myth: "Massage it in circles for two minutes, really work it in",
    truth: "It is a MASK, not a scrub. Press it on and leave it alone",
    flipPhrase: "it is not a scrub it is a mask" },
  { phrase: "not a little round bead", kind: "blurexplainer", image: I("290"), side: "left",
    eyebrow: "Under any magnification", title: "A coffee ground is a shard",
    body: "Irregular, hard-edged, broken — like tiny gravel. Dragged across your face for two minutes it does not exfoliate, it tears." },
  { phrase: "torn open in", kind: "callout", figure: "120s", eyebrow: "A barrier you spent a week helping",
    caption: "And a damaged barrier loses water faster — so the thing you did to look less tired makes you look drier by the weekend", medico: true },
  { phrase: "they get in through contact time", kind: "bars", title: "What actually delivers the caffeine", unit: "", bars: [
    { label: "Contact time — pressed on, left alone", value: 100, winner: true, note: "this is the whole mechanism" },
    { label: "Friction — scrubbing in circles", value: 0, tone: "danger", note: "not one bit more. All of the damage, none of the benefit." },
  ] },
  { phrase: "press wait rinse", kind: "frasecinetica", words: ["Press.", "Wait.", "Rinse."], tone: "teal" },
  { phrase: "fresh dry grounds are harder", kind: "chips", title: "Used, not fresh — and this is why",
    chips: ["Brewing SOFTENS the grounds", "It pulls the harshest of it out", "Cooling makes them safe to leave on", "Dry from the bag: harder, sharper, more acidic"] },
  { phrase: "the waste is the ingredient", kind: "avatarkeyword", items: [
    { card: "The waste is the ingredient", sub: "the thing you were about to throw away is the thing that works" },
  ] },

  // ── CIERRE ───────────────────────────────────────────────────────────────────
  { phrase: "the used grounds you have been throwing out", kind: "guardaesto", title: "The whole thing, in three lines",
    tag: "Golden Remedies", prompt: "Save this", items: [
      "1 · USED grounds, brewed and cooled — never fresh dry ones out of the bag.",
      "2 · A spoon of plain full-fat yogurt. Press it on with an open palm.",
      "3 · Leave it 4–5 minutes. Rinse with your bare hand. Two or three mornings a week.",
    ] },
  { phrase: "written all of it out in the description", kind: "lowerthird",
    title: "The exact amounts are in the DESCRIPTION", kicker: "Free, right below this video",
    desc: "How much, what to mix it into, how long, and how many days a week.", tone: "teal" },
  { phrase: "nothing in my kitchen is rubbish", kind: "nametag", name: "Golden Remedies",
    role: "The remedies nobody could sell you — every week", image: I("endcard") },
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
