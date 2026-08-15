// gen_fcscanela.mjs — beatsheet/fcscanela.json (Canal "Federer Consejos Salud" · CANELA antes de dormir).
// Material = STOCK Pexels (mediakind:video) + gpt-image-2 low SOLO presentador/diagramas/recetario (mediakind:image).
// Clon de gen_fcscoagulos, pero TODOS los beats se anclan por FRASE (cada beat trae `anchor` verbatim del
// transcript). Overlays de componentes anclados por `phrase` verbatim. Kit CLÍNICO _fed6.
import fs from "fs";

const SLUG = "fcscanela";
const VIDEO_END = 1256; // ≥ largo del wav (captions terminan ~1255s)

// ── captions (anclaje por frase) ───────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
// findAll: TODAS las posiciones (s) donde aparece la frase (para elegir la más cercana a lo esperado).
const findAll = (phrase, minWords = 3) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 7);
  const out = [];
  if (p.length < minWords) return out;
  for (let i = 0; i < CW.length - p.length; i++) {
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) out.push(CW[i].s);
  }
  return out;
};

// ── beats autorados ─────────────────────────────────────────────────────────────
const SRC = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));
const N = SRC.length;

// pass A — anclar CADA beat eligiendo, entre TODAS sus ocurrencias, la más cercana a la
// posición ESPERADA (interpolada localmente), > último ms, dentro de ventana. Evita el
// runaway del cursor cuando una frase repetida matchea lejos.
const AVG_GAP = VIDEO_END / N;      // ~6.5s
const WINDOW = 55;                  // s de tolerancia respecto de lo esperado
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
// pass B — interpolar los null entre anclas conocidas por índice.
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
// monotónico con piso de separación
const MINGAP = 0.4;
for (let i = 1; i < N; i++) if (start[i] < start[i - 1] + MINGAP) start[i] = +(start[i - 1] + MINGAP).toFixed(3);

// ── beats raw/talk ───────────────────────────────────────────────────────────────
const beats = [];
for (let i = 0; i < N; i++) {
  const b = SRC[i];
  const st = start[i];
  const nx = i + 1 < N ? start[i + 1] : VIDEO_END;
  const dur = +Math.max(0.6, nx - st).toFixed(2);
  const beat = { id: b.name, start: +st.toFixed(2), dur, key: "s" };
  if (b.mediakind === "image" || /\.png$/.test(b.asset || "")) { beat.kind = "raw"; beat.src = `img/${SLUG}_${b.name}.png`; }
  else { beat.kind = "raw"; beat.src = `broll/${SLUG}_${b.name}.mp4`; }
  beats.push(beat);
}

// ── b-roll layer (stock .mp4) — CAPA 1 ────────────────────────────────────────────
const FCS_BROLL = [];
for (let i = 0; i < N; i++) {
  const b = SRC[i];
  if (b.mediakind === "video") {
    const st = start[i];
    const nx = i + 1 < N ? start[i + 1] : VIDEO_END;
    FCS_BROLL.push({ name: b.name, src: `broll/${SLUG}_${b.name}.mp4`, start: +st.toFixed(2), dur: +Math.max(0.8, nx - st).toFixed(2), query: b.desc || "" });
  }
}

// ── OVERLAY de COMPONENTES premium (anclados a la FRASE real, verbatim del transcript) ──
const CMP = [
  // MITO — "una taza de canela es un milagro" (hook)
  { phrase: "no es un milagro", kind: "mitoverdad", myth: "Una taza de canela es un milagro que lo cura todo", truth: "No es milagro: es una ayuda real, sencilla… pero modesta", flipPhrase: "es otra cosa" },
  // ENEMIGO — frasquitos caros vs canela del mercado
  { phrase: "toda una industria", kind: "bars", title: "Lo mismo, dos precios", unit: "$", bars: [
    { label: "Frasco de \"control de azúcar\"", value: 40, tone: "danger", note: "y pagas cada mes" },
    { label: "Canela del mercado", value: 1, winner: true, note: "unos pesos" },
  ] },
  // MECANISMO — insulina llave/cerradura (cinamaldehído aceita la cerradura)
  { phrase: "aceitito a esa cerradura", kind: "avatarpizarra", items: [
    { card: "1 · La insulina = la llave", sub: "abre la puerta de tus células para que entre el azúcar", atPhrase: "la llave que abre" },
    { card: "2 · Con los años, la cerradura se endurece", sub: "la puerta ya no abre bien: el azúcar se queda en la sangre", atPhrase: "se van poniendo duras" },
    { card: "3 · La canela le echa aceite", sub: "cinamaldehído + polifenoles: la llave gira mejor, el azúcar entra", atPhrase: "aceitito a esa cerradura" },
  ] },
  // 5 BENEFICIOS — overview (clímax en el nº3)
  { phrase: "acuerdate del numero", kind: "splitlist", title: "Una taza de canela, 5 cosas", items: [
    "1 · Azúcar de la mañana — el pico de la madrugada, más suave",
    "2 · Dormir mejor — ritual tibio, sin cafeína",
    "3 · Circulación — pies y manos menos fríos en la cama",
    "4 · Antioxidante y antiinflamatorio — acompaña los achaques",
    "5 · Digestión — te vas a la cama sin la panza pesada",
  ] },
  // BENEFICIO 1 — fenómeno del amanecer (mini-mecanismo)
  { phrase: "fenomeno del amanecer", kind: "process", title: "El \"fenómeno del amanecer\"", steps: [
    { title: "De madrugada", desc: "tu cuerpo suelta hormonas para despertarte" },
    { title: "Y suben el azúcar", desc: "aunque no hayas comido nada en toda la noche" },
    { title: "La canela, en la noche", desc: "ayuda a que ese pico no sea tan bravo (SIN azúcar)" },
  ] },
  // HONESTIDAD 1 — Cassia vs Ceilán (mito de que toda la canela es igual)
  { phrase: "hay dos canelas", kind: "mitoverdad", myth: "Toda la canela es igual, da lo mismo cuál compres", truth: "Cassia (barata, con CUMARINA) ≠ Ceilán, la \"verdadera\" (casi sin cumarina)", flipPhrase: "canela de ceilan" },
  // HONESTIDAD 2 — advertencias serias (banda de honestidad)
  { phrase: "adelgazar la sangre", kind: "checklist", title: "Con honestidad — léelo", items: [
    { text: "⚠ Anticoagulantes / warfarina / aspirina diaria: avisa a tu médico ANTES", state: "danger" },
    { text: "Hígado delicado: usa SOLO canela de Ceilán y consulta", state: "warn" },
    { text: "Diabético con pastillas o insulina: puede bajar de más el azúcar — que tu médico ajuste", state: "warn" },
    { text: "Embarazo: nada de canela en cantidades grandes", state: "warn" },
  ] },
  // RECETA — paso a paso (cantidades → descripción)
  { phrase: "la regla de oro", kind: "process", title: "Cómo se prepara", steps: [
    { title: "1 · Hierve", desc: "un pedacito de canela de Ceilán en una taza de agua, fuego bajo, tapada" },
    { title: "2 · Cuela y entibia", desc: "que puedas tomarla sin quemarte" },
    { title: "3 · 30–40 min antes de dormir", desc: "y la regla de oro: SIN azúcar" },
  ] },
  // CTA guía — cantidades en la descripción (NUNCA link/precio en el video)
  { phrase: "en la descripcion", kind: "lowerthird", title: "Las cantidades exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cuánta canela, cuántos minutos, cómo distinguir la de Ceilán — todo ahí abajo.", tone: "teal" },
  // EL ERROR común
  { phrase: "el error mas comun", kind: "checklist", title: "Los errores que lo arruinan", items: [
    { text: "1 · Echarle azúcar o tomarla con pan dulce", state: "danger" },
    { text: "2 · Cassia barata a diario por años (cumarina)", state: "danger" },
    { text: "3 · Creer que el tecito lo arregla todo", state: "warn" },
    { text: "4 · Dejar tus medicinas — eso jamás", state: "danger" },
  ] },
  // RECAP 3 pasos
  { phrase: "tres pasitos", kind: "checklist", title: "Los 3 pasos (guarda esto)", items: [
    { text: "1 · Canela de Ceilán, la verdadera (clarita, se deshace en capas)", state: "done" },
    { text: "2 · Una taza en la noche, colada y SIN azúcar", state: "done" },
    { text: "3 · Si tomas medicinas, avisa a tu médico — acompaña, no reemplaza", state: "done" },
  ] },
  // Sign-off de marca → Endcard del canal
  { phrase: "nos vemos muy pronto", kind: "nametag", name: "Dr. Federer", role: "Cada semana, salud real y sencilla para después de los 60", image: `img/${SLUG}_endcard.png` },
];

const capOfDur = { avatarpizarra: 8, avatarkeyword: 8, mitoverdad: 6, bars: 6, splitlist: 8, checklist: 9, lowerthird: 6, frasecinetica: 5.5, nametag: 6, process: 9, chips: 6 };
const missingAnchors = [];
const cmpBeats = [];
let cmpCursor = 0;
for (let k = 0; k < CMP.length; k++) {
  const spec = CMP[k];
  const ms = findMs(spec.phrase, cmpCursor);
  if (ms == null) { missingAnchors.push(spec.phrase); continue; }
  cmpCursor = ms;
  const { phrase, ...rest } = spec;
  const beat = { id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest };
  cmpBeats.push(beat);
}

// ── POST-PASS avatarpizarra (items al ms del avatar) + mitoverdad flip ─────────────
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
    if (last > 300 || last === 0) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
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

// ── merge + orden + talks ──────────────────────────────────────────────────────────
const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const talks = []; // sin talks explícitos: el avatar full lo dan hook + huecos; ventanas las arma el Main

// ── emit .ts ────────────────────────────────────────────────────────────────────────
const U = SLUG.toUpperCase();
const tsBody =
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(FCS_BROLL)};\n` +
  `export const ${U}_TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`;
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, tsBody);

// ── emit beatsheet ───────────────────────────────────────────────────────────────────
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA ───────────────────────────────────────────────────────────────────────────────
const kinds = {}; ALL.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const distinctComp = new Set(cmpBeats.map((b) => b.kind));
const need = new Set();
ALL.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); });
FCS_BROLL.forEach((b) => need.add(b.src));
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
const durEnd = Math.max(...ALL.map((b) => b.start + b.dur), ...FCS_BROLL.map((b) => b.start + b.dur));
console.log(`beats: ${ALL.length} (raw ${kinds.raw || 0} · comp ${cmpBeats.length}) · broll: ${FCS_BROLL.length} · fin: ${durEnd.toFixed(0)}s (${(durEnd / 60).toFixed(1)}min) / audio ${VIDEO_END}s`);
console.log(`componentes: ${cmpBeats.length} · kinds distintos: ${distinctComp.size} [${[...distinctComp].join(", ")}] · pizarras KIT_CLIPS: ${KIT_CLIPS.length}`);
console.log(`beats sin anclar (interpolados): ${unanchored.length}${unanchored.length ? " → " + unanchored.slice(0, 20).join(" ") : ""}`);
if (missingAnchors.length) console.log(`⚠ COMPONENTES sin ancla (revisá la frase):`, missingAnchors);
console.log(`assets referenciados: ${need.size} · faltantes en public/: ${miss.length}`);
