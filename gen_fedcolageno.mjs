// gen_fedcolageno.mjs — beatsheet/fedcolageno.json (Canal "Federer - Más Salud, Más Vida" · EL ALIMENTO DE $1 QUE DISPARA TU COLÁGENO).
// Material = clips agnes texto-a-video (GRATIS) + imágenes agnes + gpt-image-2 low SOLO las fotos HERO
// con la cara del Dr. Clon de gen_fcscanela (incluye el fix anti-hueco: cada contenido cubre su `cov` real).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "fedcolageno";
const VIDEO_END = 1844.73;         // = largo real del master.wav (captions terminan 1844.1s)
const AVATAR_CYCLE = 1e9;          // NO hay bucle: el avatar es continuo y re-alineado al master → 0 costuras

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
const BL = [
  { img: I("bl_1"), label: "La firmeza de la cara", num: "01" },
  { img: I("bl_2"), label: "El dorso de las manos", num: "02" },
  { img: I("bl_3"), label: "Las articulaciones", num: "03" },
  { img: I("bl_4"), label: "El pelo y las uñas", num: "04" },
  { img: I("bl_5"), label: "Capilares e intestino", num: "05" },
];
const CMP = [
  // HOOK · el precio, cara a cara (componente-ESCENA, no tabla plana)
  { phrase: "de la crema de 400 pesos", kind: "pricewar", leftImage: I("pw_grenetina"), rightImage: I("pw_crema"),
    leftPrice: "$20", rightPrice: "$400", leftLabel: "Grenetina sin sabor del súper", rightLabel: "Crema \"con colágeno\"",
    strike: "/ frasco", verdict: "Y LA CARA NO PUEDE ENTRAR", subtitle: "El mismo colágeno, dos precios" },
  // HOOK · presentación
  { phrase: "soy el dr federer", kind: "lowerthird", title: "Dr. Federer", kicker: "Más salud, más vida", desc: "Piel madura, sin frasquitos caros.", tone: "teal" },
  // PELLIZCO · el mecanismo de la piel → PIZARRA 1 (regla 9: mecanismo = pizarra)
  { phrase: "tu piel no es una hoja de papel", kind: "avatarpizarra", items: [
    { card: "1 · Arriba: la epidermis", sub: "células muertas compactadas — su único trabajo es NO dejar entrar", atPhrase: "arriba esta la epidermis" },
    { card: "2 · Abajo: la dermis", sub: "ahí vive la red de colágeno, tejida como el resorte de un colchón", atPhrase: "y abajo en el segundo piso" },
    { card: "3 · Si el resorte se adelgaza, la piel de arriba SOBRA", sub: "y la piel que sobra se dobla — eso son las arrugas", atPhrase: "cuando esa red se adelgaza" },
  ] },
  // PELLIZCO · el reencuadre
  { phrase: "son las arrugas no son la piel", kind: "mitoverdad",
    myth: "Las arrugas son la piel dañada",
    truth: "Es la piel SOBRANDO, porque el colchón de abajo perdió relleno",
    flipPhrase: "es la piel sobrando" },
  // DALTON · el dato duro
  { phrase: "en dermatologia hay una regla", kind: "callout", figure: "500", eyebrow: "Experimental Dermatology · 2000 · Bos y Meinardi",
    caption: "La regla de los 500 dalton: para atravesar la piel sana, una molécula tiene que pesar menos de eso", medico: true },
  // DALTON · el número que derriba la crema
  { phrase: "300 mil dalton", kind: "bars", title: "Cuánto pesa, y cuánto puede pasar", unit: "dalton", bars: [
    { label: "Límite para atravesar la piel", value: 500, tone: "done", note: "500" },
    { label: "Nicotina (el parche sí pasa)", value: 160, tone: "done", note: "160" },
    { label: "Una molécula de colágeno", value: 300000, tone: "danger", winner: false, note: "300.000 — 600 veces el límite" },
  ] },
  // DALTON · el remate
  { phrase: "es que no cabe", kind: "frasecinetica", words: ["No", "es", "que", "no", "quiera.", "Es", "que", "no", "cabe."], tone: "warn" },
  // DALTON · la letra chiquita
  { phrase: "y atras en letras chiquitas", kind: "freezezoom", image: I("fz_etiqueta"), x: 0.5, y: 0.62, zoom: 2.1, tone: "warn", label: "Adelante: COLÁGENO. Atrás: hidratante." },
  // ENEMIGO · el bote caro es gelatina
  { phrase: "y vendida veinte veces mas cara", kind: "pricewar", leftImage: I("pw_sobre"), rightImage: I("pw_bote"),
    leftPrice: "$20", rightPrice: "$1.000", leftLabel: "Un sobre de grenetina", rightLabel: "Colágeno hidrolizado de farmacia",
    strike: "/ mes", verdict: "MISMO ANIMAL, MISMO ORIGEN", subtitle: "Piel de res y huesos, hervidos" },
  // GRENETINA · el mecanismo del material → PIZARRA 2
  { phrase: "una de cada tres cuentitas", kind: "avatarpizarra", items: [
    { card: "1 · El colágeno es un collar de cuentitas", sub: "y una de cada tres es la MISMA: la glicina", atPhrase: "es la misma se llama glicina" },
    { card: "2 · La grenetina es ese mismo collar, roto", sub: "un tercio de la grenetina es glicina pura", atPhrase: "como un tercio de la grenetina" },
    { card: "3 · Tu fibroblasto rearma TU collar", sub: "con tu diseño — por eso no importa que llegue en pedazos", atPhrase: "agarran esas cuentitas y arman tu collar" },
  ] },
  // Injerto 1 de guía (~30%)
  { phrase: "nadie se queja de que el ladrillo llegue suelto", kind: "lowerthird", title: "Las medidas exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cuánta grenetina, cuánta vitamina C y a qué hora — todo ahí abajo.", tone: "teal" },
  // TRENZA · el remate
  { phrase: "los ladrillos solos no hacen la pared", kind: "frasecinetica", words: ["Los", "ladrillos", "solos", "no", "hacen", "la", "pared."], tone: "warn" },
  // TRENZA · EL MECANISMO CLAVE → PIZARRA 3
  { phrase: "tres de esas cadenas se tienen que trenzar", kind: "avatarpizarra", items: [
    { card: "1 · La cadena nace floja", sub: "un hilo suelto, blandito, inútil", atPhrase: "esa cadena nace floja" },
    { card: "2 · Tres cadenas se trenzan como una cuerda", sub: "esa trenza es toda la fuerza del colágeno", atPhrase: "como una cuerda como una trenza de tres" },
    { card: "3 · La trenza se cierra con vitamina C", sub: "sin ella las enzimas no trabajan y la cadena se tira", atPhrase: "y ese ayudante es la vitamina c" },
  ] },
  // TRENZA · los dos ingredientes como escena con capas
  { phrase: "es un cofactor es una pieza de la maquina", kind: "ingredientduo", leftImg: I("duo_grenetina"), rightImg: I("duo_limon") },
  // ESCORBUTO · el ancla histórica
  { phrase: "en 1747 un medico escoces", kind: "callout", figure: "1747", eyebrow: "James Lind · Marina Británica",
    caption: "El primer ensayo clínico de la historia: 12 marineros, 6 tratamientos. Los de los cítricos se pusieron de pie en 6 días", medico: true },
  // ESCORBUTO · el experimento paso a paso
  { phrase: "agarro 12 marineros enfermos", kind: "process", title: "El experimento de Lind", steps: [
    { title: "12 enfermos", desc: "los separó en parejas, cada una con un tratamiento distinto" },
    { title: "Sidra, vinagre, agua de mar…", desc: "y a una sola pareja, naranjas y limones" },
    { title: "6 días", desc: "los de los cítricos ya estaban de pie. No era una infección: era colágeno sin trenzar" },
  ] },
  // SHAW · el estudio
  { phrase: "ano 2017 revista american", kind: "callout", figure: "2017", eyebrow: "American Journal of Clinical Nutrition · Shaw y Baar",
    caption: "15 g de gelatina con vitamina C, una hora antes de moverse: el marcador de colágeno nuevo se duplicó", medico: true },
  // SHAW · el número
  { phrase: "ese marcador de colageno nuevo se duplico", kind: "bars", title: "Señal de colágeno nuevo en sangre (PINP)", unit: "%", bars: [
    { label: "Placebo", value: 100, tone: "danger", note: "referencia" },
    { label: "Gelatina + vitamina C", value: 200, winner: true, note: "el doble" },
  ] },
  // SHAW · el escudo de honestidad
  { phrase: "y ahora quiero ser muy honesto contigo", kind: "checklist", title: "Qué prueba y qué NO prueba ese estudio", items: [
    { text: "Se hizo en hombres jóvenes y sanos, no en piel de +60", state: "warn" },
    { text: "Midió tendones y ligamentos, no arrugas de la cara", state: "warn" },
    { text: "Midió una señal en sangre, no una foto de antes y después", state: "warn" },
    { text: "Sí prueba el MECANISMO: aminoácidos + vitamina C disparan la fabricación", state: "done" },
  ] },
  // PROKSCH · el estudio de piel, con su conflicto de interés dicho
  { phrase: "hay uno de 2014", kind: "callout", figure: "2014", eyebrow: "Skin Pharmacology and Physiology",
    caption: "Mujeres de 35 a 55, 8 semanas: la elasticidad medida con aparato mejoró. Ojo: lo financió una empresa que vende colágeno", medico: true },
  // EDAD · el dato que da esperanza
  { phrase: "vas perdiendo alrededor de un 1", kind: "callout", figure: "1%", eyebrow: "Pérdida de colágeno por año, desde los 25",
    caption: "Pero el fibroblasto no se murió: sigue vivo a los 70 y a los 80. Está lento y le llega poco material", medico: true },
  // BENEFICIOS · overview con el clímax en el 3
  { phrase: "te voy a dar 5", kind: "splitlist", title: "Un sobre de $20, cinco cosas", items: [
    "1 · La firmeza de la cara — el óvalo y las mejillas",
    "2 · El dorso de las manos — lo que más delata la edad",
    "3 · Las articulaciones — la evidencia más directa ★",
    "4 · El pelo y las uñas — lo primero que se nota",
    "5 · Capilares e intestino — lo que no se ve en el espejo",
  ] },
  // BENEFICIOS 1-5 · escena cinemática que ATERRIZA en el que nombra
  { phrase: "el numero 1 es el mas obvio", kind: "benefitlock", index: 0, cards: BL },
  { phrase: "el numero 2 son las manos", kind: "benefitlock", index: 1, cards: BL },
  { phrase: "las articulaciones y aqui es donde", kind: "benefitlock", index: 2, cards: BL },
  { phrase: "el numero 4 es el pelo y las unas", kind: "benefitlock", index: 3, cards: BL },
  { phrase: "y el numero 5 es el que a mi", kind: "benefitlock", index: 4, cards: BL },
  // Injerto 2 de guía (~65%)
  { phrase: "te las deje todas escritas en la guia", kind: "lowerthird", title: "La hoja para pegar en la cocina", kicker: "Con letra grande", desc: "Cantidades por peso, horarios y la lista de frutas — en la descripción.", tone: "teal" },
  // RECETA · los 4 pasos
  { phrase: "porque son cuatro pasos", kind: "process", title: "Los 4 pasos, y los 4 importan", steps: [
    { title: "1 · Grenetina SIN sabor", desc: "la cajita blanca, sin azúcar ni color ni saborizante" },
    { title: "2 · Una cucharada sopera", desc: "≈10 g en medio vaso de agua tibia — tibia, no hirviendo" },
    { title: "3 · Vitamina C EN LA MISMA TOMA", desc: "medio limón exprimido, una guayaba o media naranja. Junto, no después" },
    { title: "4 · Todos los días", desc: "la constancia le gana al horario perfecto" },
  ] },
  // RECETA · el paso que casi todos se saltan
  { phrase: "sin ese paso 3 los pasos 1 y 2 hacen la mitad", kind: "frasecinetica", words: ["Sin", "cemento,", "los", "ladrillos", "se", "mojan."], tone: "warn" },
  // RECETA · la hora (dial cinemático)
  { phrase: "uno en la noche antes de dormir", kind: "hourdial", hour: 22, big: "10", unit: "PM", label: "De noche el cuerpo repara", tone: "teal" },
  // LÍMITES · la banda de honestidad
  { phrase: "ahora los limites", kind: "checklist", title: "Con honestidad — léelo", items: [
    { text: "Enfermedad renal o proteína controlada: pregúntale a TU médico antes de empezar", state: "danger" },
    { text: "Alergia a la res o al pescado: la grenetina sale de ahí — lee la cajita", state: "danger" },
    { text: "Si tomas medicamento, sepáralo dos horas", state: "warn" },
    { text: "Vegetariano o vegano: no es para ti (es de origen animal)", state: "warn" },
    { text: "Tarda de 8 a 12 semanas. No dos. La gente abandona en la tres", state: "done" },
  ] },
  // LÍMITES · el remate
  { phrase: "8 a 12 semanas no 2", kind: "frasecinetica", words: ["Ocho", "a", "doce", "semanas.", "No", "dos."], tone: "teal" },
  // ERROR · el stinger
  { phrase: "y ahora si el error", kind: "errorstinger", number: "01", title: "Tomarlo con azúcar", tone: "warn", eyebrow: "El error" },
  // ERROR · el gasto de doña Amparo
  { phrase: "como 1200 pesos al mes", kind: "bars", title: "Lo que gastaba al mes", unit: "pesos", bars: [
    { label: "Tres botes de farmacia", value: 1200, tone: "danger", note: "$1.200 — de su pensión" },
    { label: "Grenetina + limón", value: 80, winner: true, note: "$80" },
  ] },
  // ERROR · el mecanismo de la glicación
  { phrase: "es un proceso que se llama glicacion", kind: "process", title: "Qué le hace el azúcar a tu colágeno", steps: [
    { title: "Se pega", desc: "el azúcar alta en sangre se adhiere a las proteínas quietas: colágeno y elastina" },
    { title: "Lo endurece", desc: "la fibra deja de ser un resorte y se vuelve un alambre viejo, rígido y amarillento" },
    { title: "Ya no se recicla", desc: "se llaman AGE — productos finales de glicación avanzada. AGE quiere decir edad" },
  ] },
  // ERROR · el remate
  { phrase: "y ese es el error queridos amigos", kind: "frasecinetica", words: ["Con", "una", "mano", "ladrillos.", "Con", "la", "otra,", "azúcar."], tone: "warn" },
  // SOL · el mito final
  { phrase: "y por que no se parecen en nada", kind: "mitoverdad",
    myth: "La piel envejece por los años",
    truth: "Envejece por el SOL acumulado. Misma edad, mismos genes, distinta piel",
    flipPhrase: "la diferencia entera es el sol" },
  // SOL · qué hacer
  { phrase: "entonces un sombrero", kind: "checklist", title: "Lo que evita que te lo tumben", items: [
    { text: "Sombrero de ala ancha, todos los días", state: "done" },
    { text: "Manga larga cuando el sol pega fuerte", state: "done" },
    { text: "Protector solar en cara, cuello Y MANOS — aunque esté nublado", state: "done" },
  ] },
  // RECAP · para guardar
  { phrase: "vamos a recapitular", kind: "guardaesto", title: "Los 3 pasos", tag: "Dr. Federer", prompt: "Guarda esto", items: [
    "1 · UNA CUCHARADA de grenetina sin sabor en medio vaso de agua tibia, todos los días, de preferencia en la noche.",
    "2 · VITAMINA C en la misma toma — medio limón, una guayaba o media naranja. Siempre juntos.",
    "3 · CERO AZÚCAR en esa toma. Y sombra en la cara durante el día.",
  ] },
  // Injerto 3 de guía
  { phrase: "y una lista de las frutas de temporada del mercado", kind: "lowerthird", title: "La guía completa está en la DESCRIPCIÓN", kicker: "Ahí abajo, la primera", desc: "Cantidades por peso, anticoagulantes y las frutas ordenadas por vitamina C real.", tone: "teal" },
  // CIERRE · marca
  { phrase: "un fuerte abrazo", kind: "nametag", name: "Dr. Federer", role: "Más salud, más vida — cada semana, sencillo y de verdad", image: I("endcard") },
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
