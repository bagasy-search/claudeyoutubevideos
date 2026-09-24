// gen_federer19.mjs — beatsheet federer19 (Federer Archivos · ROMERO "bótox natural" · FIRMEZA/LIFTING del óvalo +60).
// Avatar federer19_opt.mp4. MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer19.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
// hero→imagen shock, bignum→stat, diagram→dg; los "broll" del director → min1_broll (b-roll denso).
// Resto (~67s→fin) = secciones normales del guion (óvalo que cae: colágeno+gravedad+circulación,
// romero+masaje ascendente, contraste honesto bótox/rellenos, escudo de honestidad, Doña Yolanda 66
// con pánico a las agujas, receta del aceite, técnica del masaje ascendente, secretos, CTAs drfederer.com).
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _e, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

// ── MINUTO 1: ingesta del plan del DIRECTOR ─────────────────────────────
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer19.json", "utf8"));
const min1Broll = [];              // {at, query} → b-roll denso del minuto 1
const heroPrompts = [];            // imágenes shock a generar
const min1Sections = [];
let hi = 0, mi = 0;
const HERO_STYLE = " Foto/plano realista, cine documental, colores algo apagados, luz de interior tenue, SIN texto, sin apariencia de IA. 16:9.";
for (const b of MIN1) {
  if (b.kind === "broll") { min1Broll.push({ at: b.at, query: b.content }); continue; }
  let beat;
  if (b.kind === "avatarfull") beat = c("talk", {});
  else if (b.kind === "scrim") { const ws = String(b.content).trim().split(/\s+/); beat = fc(ws.map((w, i) => ({ t: w, hl: i === ws.length - 1 })), { tone: "warn" }); }
  else if (b.kind === "hero") { const nm = `fe19_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe19_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  // ── el romero + masaje = "bótox natural" ──────────────────────────────
  { key: "reina", phrase: "combinada con una técnica", beats: [ c("talk", {}),
    ak([{ word: "ROMERO + MASAJE ASCENDENTE", sub: "la plantita de tu cocina y un movimiento de abajo hacia arriba: eso es «el bótox natural», sin agujas", tone: "teal", atPhrase: "un movimiento muy específico" }], {}) ]},
  // ── Doña Yolanda: pánico a las agujas ─────────────────────────────────
  { key: "yolanda_intro", phrase: "muerta de miedo", beats: [ c("talk", {}),
    r("fe19_yolanda_ovalo", { at: "meses después volvió", kicker: "Yolanda, 66 — llegó muerta de miedo a las agujas", hold: true }) ]},
  { key: "panico", phrase: "pánico a las agujas", beats: [
    ak([{ word: "PÁNICO A LAS AGUJAS", sub: "«me desmayo… y los rellenos me dan miedo de quedar con la cara rara, tiesa, que no soy yo»", tone: "warn", atPhrase: "quedar con la cara rara" }], {}) ]},
  { key: "espejo_mama", phrase: "veo a mi mamá", beats: [
    r("fe19_aguja_no", { at: "sin que nadie la pinche", kicker: "«Me veo al espejo y veo a mi mamá cuando estaba grande»", hold: true }) ]},
  // ── POR QUÉ SE CAE EL ÓVALO (mecanismo) ───────────────────────────────
  { key: "porque_cae", phrase: "por qué se cae el óvalo", beats: [ c("talk", {}),
    dg("dg_fe19_ovalo", "El óvalo facial se cae: la piel es una hamaca sostenida por colágeno y elastina; con los años se fabrica MENOS colágeno y la gravedad jala — flechas ASCENDENTES muestran el lifting que devuelve la firmeza", { at: "la base de todo" }) ]},
  { key: "dos_causas", phrase: "cuando eres joven", beats: [
    c("bars", { w: 2.4, title: "¿Por qué se cae el óvalo? Dos causas (no la genética)", unit: "", bars: [
      { label: "Menos COLÁGENO cada año tras los 50: la hamaca cede", value: 90, tone: "danger", note: "estructura" },
      { label: "Menos CIRCULACIÓN: piel desnutrida, gris, floja", value: 80, tone: "danger", note: "riego lento" } ], at: "la sangre llega peor" }) ]},
  { key: "terreno_seco", phrase: "un terreno al que no le llega agua", beats: [
    dg("dg_fe19_circulacion", "La circulación de la cara con los años: el riego se pone lento y la piel queda como terreno seco, desnutrida; el romero despierta la sangre y le lleva oxígeno y alimento a la mandíbula y el cuello", { at: "se queda desnutrida" }) ]},
  // ── el romero: antioxidantes + circulación ────────────────────────────
  { key: "plantita", phrase: "entra nuestra plantita", beats: [ c("talk", {}),
    r("fe19_romero_frasco", { at: "estimulantes de la circulación", kicker: "El romero: de los mejores estimulantes de la circulación", hold: true }) ]},
  { key: "antiox", phrase: "defienden tu piel", beats: [
    dg("dg_fe19_antiox", "Los antioxidantes del romero (ácido rosmarínico) son escudos que defienden la piel del sol, la contaminación y el óxido de los radicales libres que la carcome por dentro") ]},
  { key: "despierta", phrase: "el romero despierta la circulación", beats: [
    ak([{ word: "LE ABRE LA LLAVE DEL AGUA A LA PIEL", sub: "lleva sangre, oxígeno y alimento a la piel floja de la mandíbula y del cuello", tone: "teal" }], {}) ]},
  // ── ESCUDO DE HONESTIDAD + contraste ──────────────────────────────────
  { key: "escudo", phrase: "el escudo de honestidad", beats: [ c("talk", {}),
    c("checklist", { w: 2.6, title: "El romero, con honestidad", tone: "teal", items: [
      { text: "NO es bótox: no paraliza el músculo ni borra de golpe una arruga profunda", state: "warn" },
      { text: "NO hace lo que el bisturí de un cirujano", state: "warn" },
      { text: "SÍ da firmeza, luminosidad y mejor riego — de a poco y con constancia", state: "done" } ], at: "el romero no es botox" }) ]},
  { key: "temporal", phrase: "no hace lo mismo que el botox", beats: [
    mv("El romero hace lo mismo que el bótox, de un día para otro", "El bótox se paga y se va cada pocos meses; el romero es lento y natural, pero de verdad y baratísimo", { flipPhrase: "hay que pagarlo de nuevo" }) ]},
  { key: "no_miente", phrase: "si alguien te promete", beats: [
    fc([{ t: "Si" }, { t: "promete" }, { t: "10" }, { t: "años…" }, { t: "te" }, { t: "MIENTE", hl: true }], { tone: "warn" }) ]},
  { key: "porque_sirve", phrase: "más firme más luminosa", beats: [ c("talk", {}) ]},
  { key: "cimientos", phrase: "pintar una pared por encima", beats: [
    c("bars", { w: 2.4, title: "¿Tapar o construir?", unit: "", bars: [
      { label: "Crema cara: pinta la pared por encima", value: 30, tone: "danger", note: "por fuera" },
      { label: "Romero + masaje: trabaja los cimientos (circulación, colágeno)", value: 85, tone: "teal", note: "desde adentro" } ], at: "trabajar en los cimientos" }) ]},
  { key: "baratisimo", phrase: "es lento", beats: [
    ak([{ word: "LENTO, NATURAL Y BARATÍSIMO — PERO DE VERDAD", sub: "y no te cuesta una fortuna ni te pincha nadie", tone: "teal", atPhrase: "la mitad del secreto" }], {}) ]},
  // ── RECETA del aceite de romero ───────────────────────────────────────
  { key: "aceite_intro", phrase: "el aceite de romero que es la base", beats: [ c("talk", {}),
    r("fe19_romero_frasco", { at: "unas ramitas de romero", kicker: "La base: dos cosas, romero y un buen aceite", hold: true }) ]},
  { key: "receta", phrase: "el de almendras dulces", beats: [
    c("process", { w: 2.6, title: "Tu aceite de romero", eyebrow: "2 formas", steps: [
      { title: "Paciente", desc: "romero en frasco de vidrio, cubierto de aceite, 15 días en oscuro", image: "img/fe19_romero_frasco.png" },
      { title: "Rápida", desc: "baño maría, tibio, que NUNCA hierva", image: "img/fe19_bano_maria.png" },
      { title: "Cuela y guarda", desc: "color verdoso, a un frasquito: dura semanas", image: "img/fe19_aceite_verde.png" } ], at: "la primera es la paciente" }) ]},
  { key: "bano_maria", phrase: "la manera rápida", beats: [
    r("fe19_bano_maria", { at: "nunca hierva", kicker: "Baño maría · a fuego bajito · que NUNCA hierva", hold: true }) ]},
  { key: "aceite_listo", phrase: "guardadito en un frasquito", beats: [
    r("fe19_aceite_verde", { at: "la técnica del masaje ascendente", kicker: "Aceite de romero listo · color verdoso · dura semanas", hold: true }) ]},
  // ── TÉCNICA del masaje ascendente ─────────────────────────────────────
  { key: "masaje_intro", phrase: "como el gimnasio de tu cara", beats: [ c("talk", {}),
    ak([{ word: "EL MASAJE ASCENDENTE = EL GIMNASIO DE TU CARA", sub: "el aceite nutre, pero el masaje es el que LEVANTA", tone: "teal", atPhrase: "la regla de oro" }], {}) ]},
  { key: "regla_oro", phrase: "siempre hacia arriba", beats: [
    fc([{ t: "Siempre" }, { t: "hacia" }, { t: "ARRIBA", hl: true }], { tone: "teal" }) ]},
  { key: "tecnica", phrase: "hacia arriba y hacia afuera", beats: [
    c("process", { w: 2.6, title: "El masaje ascendente, paso a paso", eyebrow: "De abajo hacia arriba", steps: [
      { title: "Mandíbula", desc: "del centro de la barbilla, subiendo hasta la oreja · 10-15 veces", image: "img/fe19_masaje_mandibula.png" },
      { title: "Cuello", desc: "palma abierta, del pecho hacia la barbilla, alternando", image: "img/fe19_masaje_cuello.png" },
      { title: "Mejillas", desc: "de la nariz hacia la sien, levantando el pómulo", image: "img/fe19_masaje_mejilla.png" } ], at: "empiezas en el centro" }) ]},
  { key: "annot_mand", phrase: "empiezas en el centro", beats: [
    c("annotated", { w: 1.8, image: "img/fe19_masaje_mandibula.png", eyebrow: "Mandíbula y papada", caption: "Del centro de la barbilla hacia la oreja — SIEMPRE hacia arriba", annotations: [
      { label: "Hacia arriba", x: 42, y: 44 }, { label: "Hasta la oreja", x: 70, y: 40 } ], at: "hasta la oreja" }) ]},
  { key: "annot_cuello", phrase: "para el cuello", beats: [
    c("annotated", { w: 1.8, image: "img/fe19_masaje_cuello.png", eyebrow: "Cuello", caption: "Palma abierta, del pecho hacia la barbilla — nunca hacia abajo", annotations: [
      { label: "Del pecho…", x: 40, y: 70 }, { label: "…a la barbilla", x: 52, y: 34 } ], at: "con la palma de la mano" }) ]},
  { key: "annot_mejilla", phrase: "para las mejillas", beats: [
    c("annotated", { w: 1.8, image: "img/fe19_masaje_mejilla.png", eyebrow: "Mejillas", caption: "De la nariz hacia la sien, levantando el pómulo", annotations: [
      { label: "Nariz →", x: 44, y: 52 }, { label: "→ Sien", x: 72, y: 34 } ], at: "levantando el pómulo" }) ]},
  { key: "golpecitos", phrase: "golpecitos suaves", beats: [
    c("callout", { w: 1.8, image: "img/fe19_masaje_mejilla.png", figure: "«Tap, tap, tap»", caption: "Golpecitos suaves por mandíbula y mejillas: despiertan la circulación al máximo, dejan la piel sonrosada.", at: "despierta la circulación al máximo" }) ]},
  { key: "los_dos", phrase: "levanta y tonifica", beats: [
    ak([{ word: "NUTRE + LEVANTA: LOS DOS DE LA MANO", sub: "el romero nutre y desinflama; el masaje levanta y tonifica. Juntos son «el bótox natural».", tone: "teal" }], {}) ]},
  // ── EL ERROR (los tres) ───────────────────────────────────────────────
  { key: "error_intro", phrase: "el error mi amiga", beats: [ c("talk", {}),
    es("!", "El ERROR: masajear hacia ABAJO", { tone: "warn", w: 3.0, eyebrow: "El error que lo arruina" }) ]},
  { key: "error_dir", phrase: "estás empujando", beats: [
    fc([{ t: "Hacia" }, { t: "ARRIBA", hl: true }, { t: "siempre" }], { tone: "teal", at: "hacia arriba siempre hacia arriba" }) ]},
  { key: "error_fuerza", phrase: "la fuerza", beats: [
    es("2", "La FUERZA: no jales, la aflojas más", { tone: "warn", w: 2.6, eyebrow: "Segundo error" }) ]},
  { key: "error_prisa", phrase: "hacerlo dos noches", beats: [
    es("3", "La PRISA: es como el gimnasio, no dos noches", { tone: "warn", w: 2.6, eyebrow: "Tercer error" }) ]},
  { key: "constancia", phrase: "la constancia mi amiga", beats: [
    ak([{ word: "LA CONSTANCIA HACE EL MILAGRO QUE NO ES MILAGRO", sub: "Yolanda notó la diferencia al mes y medio; a los tres meses, se notó de verdad", tone: "teal", atPhrase: "muchísimos otros remedios" }], {}) ]},
  // ── CTA 1 (injerto a la guía) ─────────────────────────────────────────
  { key: "cta1", phrase: "no te voy a hablar de precios", beats: [
    lt("Reuní todo: el aceite y el masaje ilustrado, paso a paso", { kicker: "Lo reuní para ti", desc: "El método completo para levantar tu piel de forma natural, con el masaje dibujado paso a paso. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  // ── Yolanda vuelve ────────────────────────────────────────────────────
  { key: "yolanda_vuelve", phrase: "se llevó mi receta", beats: [ c("talk", {}),
    r("fe19_yolanda_feliz", { at: "entró distinta", kicker: "Yolanda, tres meses después: el óvalo despierto", hold: true }) ]},
  { key: "yolanda_firme", phrase: "el contorno más definido", beats: [
    lt("«Doctor, no me tuve que aguantar ninguna aguja»", { kicker: "Yolanda — recuperó su reflejo", desc: "«Y esta cara sigue siendo la mía, nomás que la mía de hace unos años. Fui con el romero de la cocina.»", tone: "teal", at: "ninguna aguja" }) ]},
  // ── SECRETOS extra ────────────────────────────────────────────────────
  { key: "secreto1", phrase: "antes del masaje", beats: [ c("talk", {}),
    es("01", "Un paño tibio antes del masaje", { tone: "teal", w: 2.8, eyebrow: "Secreto" }) ]},
  { key: "secreto2", phrase: "la cabeza agachada", beats: [
    es("02", "La postura: barbilla en alto, cuello largo", { tone: "teal", w: 2.8, eyebrow: "Secreto" }) ]},
  { key: "secreto3", phrase: "tu huevito", beats: [
    c("splitlist", { w: 2.2, title: "Firmeza de adentro hacia afuera", items: ["Proteína (huevo, pollo, pescado, frijoles) + agua: material para el colágeno", "Dormir bien: de noche, mientras duermes, la piel se repara y fabrica colágeno"], tone: "teal", at: "duerme tus horas" }) ]},
  // ── HONESTIDAD MÉDICA ─────────────────────────────────────────────────
  { key: "medico", phrase: "no reemplaza a tu médico", beats: [ c("talk", {}),
    c("checklist", { w: 2.6, title: "El romero cuida la belleza — esto va al médico", tone: "teal", items: [
      { text: "Una bolita o un ganglio que crece → a tu médico, sin tardar", state: "warn" },
      { text: "Una mancha que cambia, crece, sangra o pica y no cura → dermatólogo", state: "warn" },
      { text: "El romero es para firmeza y luminosidad; para lo demás, están los doctores", state: "done" } ], at: "un ganglio que crece" }) ]},
  { key: "industria", phrase: "no es caro", beats: [
    c("bars", { w: 2.4, title: "¿Dónde estaba la respuesta?", unit: "", bars: [
      { label: "La industria: agujas y frasquitos con nombre en francés", value: 25, tone: "danger", note: "millonaria" },
      { label: "Una maceta en tu cocina: romero + tus propias manos", value: 90, tone: "teal", note: "gratis" } ], at: "vendiéndote agujas" }) ]},
  // ── CTA 2 ─────────────────────────────────────────────────────────────
  { key: "cta2", phrase: "un metodo completo", beats: [
    fz("fe19_libro_guia", { at: "el masaje ilustrado", kicker: "Método completo · masaje ilustrado paso a paso · enlace en la descripción", link: "drfederer.com" }) ]},
  { key: "cta2b", phrase: "no dejes pasar más tiempo", beats: [
    lt("No es un gasto en un frasco: es aprender a cuidarte para siempre", { kicker: "Sin depender del cirujano", desc: "El enlace está arriba de todo, en la descripción, justo debajo del video.", link: "drfederer.com", tone: "teal", at: "cuidarte para siempre" }) ]},
  // ── CIERRE ────────────────────────────────────────────────────────────
  { key: "espejo", phrase: "me lo merezco", beats: [
    lt("«Me estoy cuidando, y me lo merezco»", { kicker: "Esta noche, frente al espejo", desc: "Que veas cómo tus propias manos levantan esa piel. Cuidarte no es vanidad: es quererte.", tone: "teal", at: "se llama seguridad" }) ]},
  { key: "no_resignes", phrase: "no te resignes", beats: [
    fc([{ t: "No" }, { t: "te" }, { t: "RESIGNES", hl: true }], { tone: "teal", at: "empieza hoy" }) ]},
  { key: "cierre_cta", phrase: "déjame un me gusta", beats: [
    lt("Si te ayudó: dale me gusta, suscríbete y compártelo", { kicker: "Compártelo con esa amiga", desc: "Esa que anda con la papada triste, o pensando en meterse agujas por miedo a verse mayor.", tone: "teal", at: "compártelo con esa amiga" }) ]},
  { key: "cierre", phrase: "yo soy el doctor federer", beats: [
    c("nametag", { name: "Dr. Federer", role: "Cuídate ese óvalo hermoso. Y esta noche… hacia arriba, siempre hacia arriba.", image: "img/fe19_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer19_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer19.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer19.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; } if (ok) return CW[i].s; }
  return null;
};
const pinPhrase = (b) => b.at || null;
const VIDEO_END = (CW[CW.length - 1]?.s || 1300) + 2;

let cursorSec = 0; const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  let ms = findMs(sec.phrase, cursorSec + (sec.min1 ? 0.05 : 1));
  if (sec.min1 && ms != null && ms > 68) ms = null; // match fuera del minuto 1 = falso (director paraphraseó)
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + (sec.min1 ? 1.5 : 5);
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; const ph = pinPhrase(b); if (!ph) return null; const ms = findMs(ph, start + 0.4); return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null; });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) { const a = fixed[f], b = fixed[f + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2); let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`; const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); }
    beats.push(beat);
  });
}

// POST-PASS keyword + mitoverdad
const KIT_CLIPS = [];
for (const beat of beats) {
  if (beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => { let atF = 0; if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); } last = Math.max(last, atF); const { atPhrase, ...rest } = it; return { ...rest, at: atF }; });
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * 90 })); last = (beat.items.length - 1) * 90; }
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer19/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer19.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer19_beats.ts", `export const FED19_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer19_hooks.ts", `export const TALKS19: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer19.json", JSON.stringify({ video: "federer19", avatar: "federer19_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
