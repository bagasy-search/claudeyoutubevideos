// gen_estoalos70.mjs — beatsheet/estoalos70.json (Canal "Federer - Más Salud, Más Vida" ·
// SI PUEDES HACER ESTO A LOS 70). Héroe bautizado dentro del guion: LA PRUEBA DEL PISO.
// Material = clips agnes texto-a-video (GRATIS) + imágenes agnes + gpt-image-2 low SOLO las fotos HERO
// con la cara del Dr. Clon de gen_fcscanela (incluye el fix anti-hueco: cada contenido cubre su `cov` real).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "estoalos70";
const VIDEO_END = 1388.8;          // = largo real del master.wav (captions terminan 1387.76s)
const AVATAR_CYCLE = 1e9;          // ⚠ ESTE avatar NO es un bucle: el creador grabó los 23:07.8
                                   //   completos → no hay costuras que tapar (SEAMS queda vacío).

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
const RECAP = [
  { img: I("bl_r1"), label: "Mide hoy y anota el número", num: "01" },
  { img: I("bl_r2"), label: "Tres cosas al día, 5 minutos", num: "02" },
  { img: I("bl_r3"), label: "La sentada de la silla, 3× por semana", num: "03" },
];

const CMP = [
  // ── EL SUJETO: se bautiza la prueba ──────────────────────────────────────────────────────────
  { phrase: "se llama la prueba de sentarse", kind: "lowerthird", title: "LA PRUEBA DEL PISO",
    kicker: "Sit-to-Rise Test", desc: "Sentarte en el suelo y volver a levantarte sin apoyar nada.", tone: "teal" },
  // EL ORIGEN · autoridad con nombre, lugar e institución
  { phrase: "El medico que la popularizo", kind: "callout", figure: "30", eyebrow: "CLINIMEX · Río de Janeiro",
    caption: "Claudio Gil Araújo lleva más de 30 años midiendo la aptitud física de adultos mayores",
    image: I("co_clinimex"), medico: true },
  // LA PALABRA del video, sobre el avatar
  { phrase: "Porque esa es la palabra", kind: "avatarkeyword", items: [
    { word: "AUTONOMÍA", sub: "no es \"salud\": es poder levantarte tú solo", atPhrase: "Porque esa es la palabra" },
  ] },
  // HOOK del mecanismo · el reloj de los 6 segundos (dial cinemático, no un cartel)
  { phrase: "en esos 6 segundos", kind: "hourdial", hour: 6, big: "6", unit: "SEG",
    label: "Lo que tarda tu cuerpo en contestar", tone: "gold" },
  // LAS 4 CAPACIDADES · overview
  { phrase: "Y son justo las 4 que se rompen", kind: "splitlist", title: "Las 4 que se rompen primero", items: [
    "1 · Fuerza suficiente para tu propio peso",
    "2 · Que la cadera y el tobillo doblen",
    "3 · Equilibrio sobre una base chiquita",
    "4 · Coordinar todo en el orden correcto",
  ] },
  // ── LOS NÚMEROS ──────────────────────────────────────────────────────────────────────────────
  { phrase: "Ahora los numeros", kind: "errorstinger", number: "01", title: "El estudio original", eyebrow: "EL DATO", tone: "teal" },
  { phrase: "En 2012 se publico el estudio", kind: "callout", figure: "2 002", eyebrow: "Eur. J. of Preventive Cardiology · 2012",
    caption: "Siguieron a 2.002 adultos de 51 a 80 años durante seis años, con un puntaje del 0 al 10",
    image: I("co_2012"), medico: true },
  { phrase: "Las personas que sacaron de 0 a 3", kind: "bars", title: "Riesgo de morir en esos 6 años", unit: "×", bars: [
    { label: "Puntaje 8 a 10", value: 100, winner: true, note: "la referencia" },
    { label: "Puntaje 0 a 3", value: 550, tone: "danger", note: "5 a 6 veces más" },
  ] },
  { phrase: "Y por cada punto que subias", kind: "stat", value: "21", suffix: "%",
    eyebrow: "Por cada punto de la escala", label: "menos riesgo de morir" },
  // LA HERMANA CHIQUITA · las dos pruebas, cara a cara (escena con capas, no lower-third)
  { phrase: "porque el mismo grupo hizo otra prueba", kind: "ingredientduo",
    leftImg: I("duo_piso"), rightImg: I("duo_flamenco") },
  { phrase: "Pararse en un solo pie", kind: "hourdial", hour: 10, big: "10", unit: "SEG",
    label: "El flamenco: la hermana chiquita", tone: "teal" },
  { phrase: "alrededor de un 84", kind: "stat", value: "84", suffix: "%",
    eyebrow: "Los que no aguantaron los 10 segundos", label: "más mortalidad en 7 años" },
  // EL REENCUADRE HONESTO
  { phrase: "Estas pruebas no te estan matando", kind: "frasecinetica", tone: "teal", words: [
    { t: "NO" }, { t: "TE" }, { t: "MATAN." }, { t: "TE" }, { t: "AVISAN.", hl: true },
  ] },
  // Injerto 1 de guía
  { phrase: "la tabla del 0 al 10", kind: "lowerthird", title: "La tabla del 0 al 10 está en la DESCRIPCIÓN",
    kicker: "Para imprimir", desc: "Con lo que resta cada apoyo, para que no la anotes mal.", tone: "teal" },
  // ── EL MITO: "yo camino" ─────────────────────────────────────────────────────────────────────
  { phrase: "Doctor pero yo camino", kind: "mitoverdad",
    myth: "Camino todos los días, entonces estoy bien",
    truth: "Caminar no entrena NINGUNA de las 4 cosas que necesitas para levantarte del piso",
    flipPhrase: "caminar no entrena ninguna" },
  { phrase: "Porque al caminar nunca doblas", kind: "checklist", title: "Lo que caminar NO entrena", items: [
    { text: "La rodilla nunca dobla más que un ángulo chico", state: "danger" },
    { text: "La cadera nunca baja al piso", state: "danger" },
    { text: "Nunca te paras en un solo pie de verdad", state: "danger" },
    { text: "Nunca mueves tu peso completo de abajo hacia arriba", state: "danger" },
  ] },
  // ── MECANISMO 1 → PIZARRA (regla 9: el mecanismo se DIBUJA) ──────────────────────────────────
  { phrase: "No es la fuerza es la potencia", kind: "avatarpizarra", items: [
    { card: "1 · FUERZA = poder empujar el ropero", sub: "cuánto puedes mover, sin importar cuánto tardes",
      atPhrase: "la fuerza es poder empujar el ropero" },
    { card: "2 · POTENCIA = poder empujarlo YA", sub: "la misma fuerza, pero disparada en el momento justo",
      atPhrase: "la potencia es poder empujarlo ya" },
    { card: "3 · La potencia se va 2-3 veces más rápido", sub: "por eso cargas el mercado y no te levantas del piso",
      atPhrase: "perdieron el disparo no el motor" },
  ] },
  // ── EL ENEMIGO ───────────────────────────────────────────────────────────────────────────────
  { phrase: "El enemigo es una silla", kind: "errorstinger", number: "★", title: "El enemigo es una silla",
    eyebrow: "NOSOTROS VS ELLOS", tone: "warn" },
  { phrase: "40 50 repeticiones de bajar al piso", kind: "process", title: "Lo que tu bisabuela hacía sin llamarlo ejercicio", steps: [
    { title: "Se sentaba en el suelo", desc: "a desgranar, a trabajar, a descansar" },
    { title: "Se ponía en cuclillas", desc: "a lavar, y también en el baño" },
    { title: "40 a 50 veces al día", desc: "bajar y subir, cada día de su vida" },
  ] },
  { phrase: "La silla tiene brazos", kind: "checklist", title: "Diseñado para que no bajes nunca", items: [
    { text: "La silla con brazos", state: "warn" },
    { text: "El sillón que te traga", state: "warn" },
    { text: "El excusado más alto cada año", state: "warn" },
    { text: "Y el aparato que te levanta del sillón", state: "warn" },
  ] },
  // EL PRECIO, CARA A CARA (todos los defaults en inglés del kit quedan pisados)
  { phrase: "300 400 600 pesos al mes", kind: "pricewar", leftImage: I("pw_piso"), rightImage: I("pw_frascos"),
    leftPrice: "$0", rightPrice: "$600", leftLabel: "El piso de tu casa", rightLabel: "Cápsulas \"para la movilidad\"",
    strike: "/ al mes", subtitle: "Lo mismo que prometen, dos precios", verdict: "Y EL CARO NO TE ENSEÑA LA SECUENCIA" },
  { phrase: "Eso no se toma eso se practica", kind: "frasecinetica", tone: "teal", words: [
    { t: "ESO" }, { t: "NO" }, { t: "SE" }, { t: "TOMA." }, { t: "SE" }, { t: "PRACTICA.", hl: true },
  ] },
  // Injerto 2 de guía
  { phrase: "Todo el plan de 8 semanas", kind: "lowerthird", title: "El plan de 8 semanas, en la DESCRIPCIÓN",
    kicker: "Para pegar en el refri", desc: "Repeticiones exactas y progresiones para cuando duele la rodilla.", tone: "teal" },
  // ── SEGURIDAD (se dice derecho, se ve derecho) ───────────────────────────────────────────────
  { phrase: "No hagas esta prueba si tienes", kind: "checklist", title: "No la hagas si…", items: [
    { text: "Tienes prótesis de cadera o rodilla sin visto bueno", state: "danger" },
    { text: "Tienes osteoporosis diagnosticada y severa", state: "danger" },
    { text: "Te operaron hace menos de 3 meses", state: "danger" },
    { text: "Tienes vértigo, mareos al pararte o te desmayaste", state: "danger" },
  ] },
  { phrase: "hazla sobre una alfombra", kind: "checklist", title: "Cómo hacerla segura", items: [
    { text: "Sobre alfombra o tapete, nunca sobre loseta pelada", state: "done" },
    { text: "A un brazo de una pared o un sillón firme", state: "done" },
    { text: "Descalzo o con calcetines antiderrapantes", state: "done" },
    { text: "Si te duele algo, te detienes", state: "done" },
  ] },
  // ── LA TÉCNICA + EL PUNTAJE ──────────────────────────────────────────────────────────────────
  { phrase: "Cruzas un pie por delante del otro", kind: "process", title: "La técnica, paso a paso", steps: [
    { title: "1 · Cruza los tobillos", desc: "un pie por delante del otro, como en el pasto" },
    { title: "2 · Baja despacio", desc: "controlado, hasta quedar sentado en el suelo" },
    { title: "3 · Sube sin apoyar", desc: "con los tobillos todavía cruzados" },
  ] },
  { phrase: "cada vez que te apoyas en algo", kind: "splitlist", title: "Empiezas con 10. Cada apoyo resta.", items: [
    "Una mano en el piso — menos 1",
    "El antebrazo — menos 1",
    "Una rodilla — menos 1",
    "El costado de tu propia pierna — menos 1",
    "Te agarras del sillón — menos 1",
    "Te tambaleas fuerte — menos ½",
  ] },
  { phrase: "Vamos a leer el numero", kind: "splitlist", title: "Lo que dice tu número", items: [
    "8 a 10 · Excelente. Ahora no lo pierdas",
    "6 a 7½ · Bien, pero ya te está avisando",
    "3½ a 5½ · Aquí todavía se arregla fácil",
    "0 a 3 · Empieza esta semana. Y que te revisen",
  ] },
  // LÍMITES HONESTOS
  { phrase: "Esta prueba tiene sus limites", kind: "callout", figure: "≠", eyebrow: "Con honestidad",
    caption: "El puntaje mide una capacidad, no a la persona entera. Te importa la tendencia, no la foto",
    image: I("co_limites"), medico: true },
  // ── LOS 5 PASOS (cada uno abre con su stinger numerado) ──────────────────────────────────────
  { phrase: "Cinco cosas ocho semanas", kind: "errorstinger", number: "5", title: "Cinco cosas. Ocho semanas.", eyebrow: "EL PLAN", tone: "teal" },
  { phrase: "La primera la sentada de la silla", kind: "errorstinger", number: "01", title: "La sentada de la silla", eyebrow: "PASO", tone: "teal" },
  { phrase: "La nariz tiene que ir por delante", kind: "frasecinetica", tone: "teal", words: [
    { t: "LA" }, { t: "NARIZ" }, { t: "POR" }, { t: "DELANTE" }, { t: "DE" }, { t: "LOS" }, { t: "DEDOS", hl: true },
  ] },
  // ⚠ BlurExplainer tipa `clip: string` (NO opcional) y hace Media src={clip}: sin clip de fondo
  //   revienta con "undefined was passed to staticFile()" — costó el chunk 37 de la 1ra corrida.
  { phrase: "Inclina el torso nariz adelante", kind: "blurexplainer", image: I("be_nariz"),
    clip: `broll/${SLUG}_p1_caesfrente.mp4`,
    eyebrow: "El truco que casi nadie dice", title: "Nariz por delante de los dedos",
    body: "Con la espalda de soldado el peso queda atrás y no hay fuerza que alcance.", side: "left" },
  { phrase: "La segunda y esta es la que a mi", kind: "errorstinger", number: "02", title: "La rodilla a la pared", eyebrow: "PASO", tone: "teal" },
  { phrase: "sin levantar el talon del suelo", kind: "freezezoom", image: I("fz_talon"),
    x: 0.5, y: 0.7, zoom: 2.0, tone: "teal", label: "El talón NO se despega" },
  // ── MECANISMO 2 → SEGUNDA PIZARRA (la geometría del tobillo) ─────────────────────────────────
  { phrase: "porque es pura geometria", kind: "avatarpizarra", items: [
    { card: "1 · Para subir, la rodilla pasa por delante del pie", sub: "si el peso queda atrás, no hay fuerza que alcance",
      atPhrase: "tu rodilla tiene que viajar por delante" },
    { card: "2 · Y quien la deja pasar es el TOBILLO", sub: "si no dobla, la rodilla se traba y te quedas abajo",
      atPhrase: "Si tu tobillo no dobla lo suficiente" },
    { card: "3 · El tobillo es el techo de todo", sub: "se pone rígido con los años y con no usarlo",
      atPhrase: "El tobillo es el techo de todo" },
  ] },
  { phrase: "La tercera el flamenco", kind: "errorstinger", number: "03", title: "El flamenco", eyebrow: "PASO", tone: "teal" },
  { phrase: "uno de cada cinco personas mayores", kind: "bars", title: "Los 10 segundos en un pie", unit: "%", bars: [
    { label: "Aguantan", value: 80, winner: true },
    { label: "No aguantan", value: 20, tone: "danger", note: "1 de cada 5" },
  ] },
  { phrase: "de las cinco y es la", kind: "errorstinger", number: "04", title: "Practicar la prueba misma", eyebrow: "PASO", tone: "teal" },
  { phrase: "hazlo con la menor ayuda posible", kind: "process", title: "Ir quitando el andamio", steps: [
    { title: "Hoy · las dos manos", desc: "está bien, se empieza ahí" },
    { title: "Mañana · una mano", desc: "el cuerpo ya sabe más de lo que crees" },
    { title: "La otra semana · un dedo", desc: "solo para la confianza" },
    { title: "Después · la mano en el aire", desc: "cerquita, por si acaso, pero sin tocar" },
  ] },
  { phrase: "La quinta y esta es de la cocina", kind: "errorstinger", number: "05", title: "La proteína", eyebrow: "PASO", tone: "teal" },
  { phrase: "en comida de verdad de mercado", kind: "splitlist", title: "30 gramos de proteína, del mercado", items: [
    "Dos huevos y un puño de frijoles",
    "Una taza de requesón",
    "Un vaso de leche con un huevo cocido",
    "Un cuarto de pollo",
    "Una lata de atún",
  ] },
  // LA ESPERANZA
  { phrase: "En 1990 se publico un estudio", kind: "callout", figure: "96", eyebrow: "JAMA · 1990 · ancianos frágiles",
    caption: "De 86 a 96 años triplicaron la fuerza de sus piernas en ocho semanas de ejercicio",
    image: I("co_1990"), medico: true },
  // ── EL ERROR (pago del loop grande) ──────────────────────────────────────────────────────────
  { phrase: "El primero es el andamio invisible", kind: "errorstinger", number: "01", title: "El andamio invisible", eyebrow: "EL ERROR", tone: "warn" },
  { phrase: "Lo que se apago fue el permiso", kind: "frasecinetica", tone: "warn", words: [
    { t: "NO" }, { t: "SE" }, { t: "APAGÓ" }, { t: "EL" }, { t: "MÚSCULO." }, { t: "EL" }, { t: "PERMISO.", hl: true },
  ] },
  { phrase: "Y el segundo error es de pura mecanica", kind: "errorstinger", number: "02", title: "Subes con el peso atrás", eyebrow: "EL ERROR", tone: "warn" },
  { phrase: "Con la espalda derecha la barbilla arriba", kind: "mitoverdad",
    myth: "Espalda recta y barbilla arriba, como para la foto",
    truth: "Nariz por delante de los dedos, tobillos metidos, el cuerpo compacto",
    flipPhrase: "La nariz por delante de los dedos" },
  { phrase: "El tercero es tratar esto como un examen", kind: "errorstinger", number: "03", title: "Tratarlo como examen anual", eyebrow: "EL ERROR", tone: "warn" },
  // ── RECAP · escena cinemática de 3 tarjetas (BenefitLockReveal = EXACTAMENTE 3 posiciones) ────
  { phrase: "Te lo resumo en tres cosas", kind: "errorstinger", number: "3", title: "Te lo resumo en tres cosas", eyebrow: "EL RESUMEN", tone: "teal" },
  { phrase: "Uno mide", kind: "benefitlock", index: 0, cards: RECAP },
  { phrase: "Dos tres cosas al dia", kind: "benefitlock", index: 1, cards: RECAP },
  { phrase: "Tres tres veces por semana", kind: "benefitlock", index: 2, cards: RECAP },
  { phrase: "Todo eso con la tabla del puntaje", kind: "guardaesto", title: "Guarda esto", tag: "Dr. Federer",
    prompt: "Guarda esto", items: [
    "Mide hoy y anota el número con la fecha",
    "Rodilla a la pared · flamenco · sentarte en el suelo",
    "3 veces por semana la sentada de la silla",
    "Vuelve a medirte en 8 semanas, no antes",
  ] },
  // Injerto 3 de guía
  { phrase: "Esta en la guia que te deje en la descripcion", kind: "lowerthird", title: "La guía completa está en la DESCRIPCIÓN",
    kicker: "Es tuya", desc: "Tabla de puntaje, progresiones y qué comer en cada comida.", tone: "teal" },
  // CIERRE
  { phrase: "Un fuerte abrazo cuidense mucho", kind: "nametag", name: "Dr. Federer",
    role: "Más Salud, Más Vida", image: I("ci_abrazo") },
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
