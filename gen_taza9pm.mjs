// gen_taza9pm.mjs — beatsheet/taza9pm.json (Canal "Federer - Más Salud, Más Vida" · LA TAZA DE LAS 9 PM).
// Material = clips agnes texto-a-video (GRATIS) + imágenes agnes + gpt-image-2 low SOLO las fotos HERO
// con la cara del Dr. Clon de gen_fcscanela (incluye el fix anti-hueco: cada contenido cubre su `cov` real).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "taza9pm";
const VIDEO_END = 1398;            // = largo real del master.wav (captions terminan 1397.7s)
const AVATAR_CYCLE = 152.033;      // el avatar es un BUCLE de 152s → los cortes caen en múltiplos

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
  beat.src = b.mediakind === "image" ? `img/${SLUG}_${b.name}.png` : `broll/${SLUG}_${b.name}.mp4`;
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
    COVER.push({ start: +st.toFixed(2), cov: +Math.min(slot, HERO_CAP).toFixed(2), kind: "photo", src: `img/${SLUG}_${b.name}.png` });
  }
}

// ── COMPONENTES — la VARA: se busca el componente-ESCENA del kit, no la tarjeta plana ──
const I = (n) => `img/${SLUG}_${n}.png`;
const CMP = [
  // HOOK · la hora manda (dial cinemático, no un cartel)
  { phrase: "es la hora", kind: "hourdial", hour: 21, big: "9", unit: "PM", label: "No es la flor. Es la hora.", tone: "gold" },
  // HOOK · el despertar de las 3 (mismo dial, otra hora → rima visual)
  { phrase: "las 3 de la manana", kind: "hourdial", hour: 3, big: "3", unit: "AM", label: "Y así, todas las noches", tone: "teal" },
  // QUÉ LLEVA · las dos flores como escena con capas (no lower-third)
  { phrase: "y lleva flor de tila", kind: "ingredientduo", leftImg: I("duo_manzanilla"), rightImg: I("duo_tila") },
  // ENEMIGO · el precio, cara a cara
  { phrase: "cuestan 300 400 500 pesos", kind: "pricewar", leftImage: I("pw_flores"), rightImage: I("pw_caja"),
    leftPrice: "$20", rightPrice: "$500", leftLabel: "Manzanilla y tila del mercado", rightLabel: "\"Té detox\" de la farmacia",
    strike: "/ caja", verdict: "Y EL CARO ES UN LAXANTE", subtitle: "Lo mismo de dormir, dos precios" },
  // ENEMIGO · qué trae de verdad la cajita
  { phrase: "llevan zen", kind: "checklist", title: "Lo que dice la letra chiquita", items: [
    { text: "Hoja de SEN — laxante estimulante, de los fuertes", state: "danger" },
    { text: "Cáscara sagrada — otro laxante", state: "danger" },
    { text: "Lo que sale no son toxinas: es agua, potasio y magnesio", state: "warn" },
    { text: "A los meses el intestino ya no trabaja solo", state: "warn" },
  ] },
  // ENEMIGO · el zoom al panel de ingredientes
  { phrase: "en la etiqueta en letra chiquita", kind: "freezezoom", image: I("fz_etiqueta"), x: 0.5, y: 0.55, zoom: 2.1, tone: "warn", label: "Ahí está, en letra de 6 puntos" },
  // ENEMIGO · la lista médica (dato duro con figura grande)
  { phrase: "existe una lista medica", kind: "callout", figure: "65+", eyebrow: "Criterios de Beers · AGS", caption: "Benzodiacepinas y fármacos Z: pensarlos dos veces después de los 65 — caídas, fractura de cadera, memoria", medico: true },
  // ENEMIGO · la advertencia dura (se dice derecho, se ve derecho)
  { phrase: "no la suspendas", kind: "checklist", title: "Esto va en serio", items: [
    { text: "NO suspendas por tu cuenta una pastilla recetada", state: "danger" },
    { text: "Cortarla de golpe puede dar temblor, ansiedad fuerte y hasta convulsiones", state: "danger" },
    { text: "Se baja despacio, con calendario y con TU médico", state: "done" },
  ] },
  // Injerto 1 de guía
  { phrase: "por cierto rapidito", kind: "lowerthird", title: "Las medidas exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cuántas flores, cuánta agua, a qué temperatura — todo ahí abajo.", tone: "teal" },
  // CIENCIA · el estudio de 2013
  { phrase: "en 2013 una investigadora", kind: "callout", figure: "2013", eyebrow: "Science · Universidad de Rochester", caption: "Maiken Nedergaard descubrió que el cerebro tiene su propio sistema de lavado y que se prende de noche", medico: true },
  // CIENCIA · EL MECANISMO → pizarra (regla 9: mecanismo = pizarra, 2-3 por video)
  { phrase: "si tiene un sistema de limpieza", kind: "avatarpizarra", items: [
    { card: "1 · El cuerpo tiene cañería. El cerebro no.", sub: "el sistema linfático lava todos los tejidos… menos ése", atPhrase: "menos el cerebro" },
    { card: "2 · De noche, las células se encogen", sub: "y se abren espacios entre ellas que de día no existen", atPhrase: "las celulas del cerebro se encogen" },
    { card: "3 · Entra líquido y arrastra la basura del día", sub: "sistema glinfático: solo funciona en SUEÑO PROFUNDO", atPhrase: "entra liquido a presion y lava" },
  ] },
  // CIENCIA · el número
  { phrase: "se agrandan alrededor de un 60", kind: "bars", title: "El espacio por donde entra el lavado", unit: "%", bars: [
    { label: "Despierto", value: 100, tone: "danger", note: "el canal casi cerrado" },
    { label: "En sueño profundo", value: 160, winner: true, note: "≈ +60%" },
  ] },
  // CIENCIA · el reencuadre honesto (mito que se derriba)
  { phrase: "tu no te desintoxicas con una infusion", kind: "mitoverdad",
    myth: "El té te desintoxica mientras duermes",
    truth: "Te desintoxica el SUEÑO PROFUNDO. El té solo te ayuda a llegar hasta ahí.",
    flipPhrase: "te desintoxicas con sueno profundo" },
  // CIENCIA · el estudio de la temperatura
  { phrase: "hay un estudio precioso de 1999", kind: "callout", figure: "1999", eyebrow: "Nature · grupo suizo (Kräuchi)", caption: "Lo que mejor predice que te duermas no es el cansancio: es que las manos y los pies se calienten y el centro se enfríe", medico: true },
  // CIENCIA · MECANISMO 2 → segunda pizarra (la hora)
  { phrase: "fue la diferencia", kind: "avatarpizarra", items: [
    { card: "1 · Para dormirte, tu centro se enfría", sub: "medio grado, un poquito más — ése es el interruptor", atPhrase: "y el centro del cuerpo" },
    { card: "2 · Y se enfría tirando calor por manos y pies", sub: "por eso el calcetín funciona: el pie caliente es un radiador", atPhrase: "por eso funciona el calcetin" },
    { card: "3 · La taza tibia empuja esa bajada… pero tarda 2½ h", sub: "por eso a las 9 y no a las 11", atPhrase: "ese proceso tarda" },
  ] },
  // CIENCIA · el calcetín (escena con capas, no checklist)
  { phrase: "pies calientes sueno mas rapido", kind: "blurexplainer", clip: `broll/${SLUG}_213.mp4`, image: I("be_calcetin"),
    eyebrow: "Medido en Nature", title: "El calcetín no es cuento de abuela", body: "Pie caliente = radiador abierto. El centro baja, y ahí llega el sueño.", side: "left" },
  // BENEFICIOS · overview con el clímax en el 3
  { phrase: "ahora si los 5 beneficios", kind: "splitlist", title: "Una taza a las 9, cinco cosas", items: [
    "1 · Te duermes más rápido — la bajada de temperatura",
    "2 · Dejas de despertarte a las 3 — líquido y azúcar",
    "3 · El cerebro se lava — el sistema glinfático ★",
    "4 · El hígado hace su turno de noche",
    "5 · Te levantas sin la cruda de la pastilla",
  ] },
  // BENEFICIOS 1-2-3 · escena cinemática que ATERRIZA en el que nombra (no tarjetas sueltas)
  { phrase: "beneficio numero 1", kind: "benefitlock", index: 0, cards: [
    { img: I("bl_1"), label: "Te duermes más rápido", num: "01" },
    { img: I("bl_2"), label: "Dejas de despertarte a las 3", num: "02" },
    { img: I("bl_3"), label: "El cerebro se lava", num: "03" },
  ] },
  { phrase: "beneficio numero 2", kind: "benefitlock", index: 1, cards: [
    { img: I("bl_1"), label: "Te duermes más rápido", num: "01" },
    { img: I("bl_2"), label: "Dejas de despertarte a las 3", num: "02" },
    { img: I("bl_3"), label: "El cerebro se lava", num: "03" },
  ] },
  // BENEFICIO 2 · por qué te despierta el azúcar (va ANTES del nº3 en el transcript: 12:58 < 13:21)
  { phrase: "el segundo motivo es el azucar", kind: "process", title: "Por qué te despierta la cucharadita", steps: [
    { title: "Sube", desc: "el azúcar de la noche sube rápido" },
    { title: "Cae de madrugada", desc: "y cae por debajo de donde empezó" },
    { title: "El cuerpo te rescata", desc: "manda cortisol y adrenalina… y eso te DESPIERTA" },
  ] },
  { phrase: "beneficio numero 3", kind: "benefitlock", index: 2, cards: [
    { img: I("bl_1"), label: "Te duermes más rápido", num: "01" },
    { img: I("bl_2"), label: "Dejas de despertarte a las 3", num: "02" },
    { img: I("bl_3"), label: "El cerebro se lava", num: "03" },
  ] },
  // Injerto 2 de guía
  { phrase: "las cantidades exactas por escrito", kind: "lowerthird", title: "La hoja para pegar en la cocina", kicker: "Con letra grande", desc: "Cantidades exactas y la guía completa, en la descripción.", tone: "teal" },
  // RECETA · los 3 detalles
  { phrase: "tres detalles que parecen tonterias", kind: "process", title: "Los 3 detalles que casi nadie hace", steps: [
    { title: "1 · En FLOR, no en bolsita", desc: "en la bolsita queda el polvo; los aceites que sirven ya se fueron" },
    { title: "2 · TAPADA con un platito", desc: "el vapor es el remedio: si no la tapas, se va por la ventana" },
    { title: "3 · Cáscara de limón", desc: "la parte amarilla — y además hace que te la tomes todas las noches" },
  ] },
  // LÍMITES · la banda de honestidad
  { phrase: "ahora los limites", kind: "checklist", title: "Con honestidad — léelo", items: [
    { text: "Alérgico a margaritas / girasol / ambrosía: prueba poquito la primera vez", state: "warn" },
    { text: "Anticoagulantes (warfarina y similares): pregúntale a tu médico ANTES", state: "danger" },
    { text: "Líquidos limitados por corazón o riñón: no aplica tal cual — consúltalo", state: "warn" },
    { text: "¿Roncas y dejas de respirar? Eso es apnea: NO se arregla con manzanilla → médico", state: "danger" },
  ] },
  // ERROR 1
  { phrase: "el primero tomarsela en la cama", kind: "errorstinger", number: "01", title: "Tomársela ya en la cama", tone: "warn", eyebrow: "Error" },
  // ERROR 2
  { phrase: "hermano del primero", kind: "errorstinger", number: "02", title: "Endulzarla \"con tantita miel\"", tone: "warn", eyebrow: "Error" },
  // ERROR · el remate
  { phrase: "fue la cucharadita", kind: "frasecinetica", words: ["No", "te", "pasó", "nada.", "Fue", "la", "cucharadita."], tone: "warn" },
  // CIERRE · el recap para guardar
  { phrase: "te resumo en 3 pasos", kind: "guardaesto", title: "Los 3 pasos", tag: "Dr. Federer", prompt: "Guarda esto", items: [
    "1 · LA HORA — 9 de la noche, o 2½ h antes de la cama. Y ahí se cierra la cocina.",
    "2 · LA TAZA — manzanilla y tila en flor, tapada con un platito, cáscara de limón, CERO azúcar.",
    "3 · LA TEMPERATURA — tibia, de un jalón. Y los pies calientes en la cama.",
  ] },
  // CIERRE · marca
  { phrase: "nos vemos en", kind: "nametag", name: "Dr. Federer", role: "Más salud, más vida — cada semana, sencillo y de verdad", image: I("endcard") },
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
