// gen_federer8.mjs — beatsheet/federer8.json (Canal "Federer Building" · Dr. Federer · 7 EJERCICIOS TESTOSTERONA +40).
// Avatar federer8_opt.mp4 (~23min, voseo argentino). Anclaje por FRASE a captions_federer8.json.
// Look CLÍNICO teal. Imágenes gpt-image-2 (.png): fe8_*.png + dg_fe8_*.png. Kit premium COMPLETO.
// Estructura: HOOK (síntomas) → historia de Ricardo → MECANISMO (señal→fábrica, círculo panza) →
// 7 EJERCICIOS numerados (de suave a potente) → injertos de venta a la guía → auto-diagnóstico (2 grupos)
// → 3 advertencias + escudo de honestidad → cierre + CTA comentarios/guía. Diagramas SIN eyebrow.
// Salida a src/_fed6/VideoEdit/ (árbol autocontenido del kit).
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o }); // SIN eyebrow
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const SECTIONS = [
  // ░░ HOOK — los síntomas ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("fe8_cansado_desayuno", { at: "ya estás cansado", kicker: "Cansado antes de empezar el día" }),
    r("fe8_brazo_tiembla", { at: "te tiembla el brazo" }),
  ]},
  { key: "ganas", phrase: "algo que casi nadie dice", beats: [
    r("fe8_sillon_apatia", { at: "las ganas de todo", kicker: "Como si te bajaran el volumen por dentro" }),
  ]},
  { key: "no_edad", phrase: "no es solo la edad", beats: [
    fc([{ t: "No" }, { t: "es" }, { t: "solo" }, { t: "la" }, { t: "edad", hl: true }], { tone: "warn", at: "no es solo la edad" }),
  ]},
  { key: "promesa", phrase: "7 movimientos simples", beats: [
    ak([{ word: "TU PROPIA TESTOSTERONA", sub: "la que tenías a los treinta y fuiste perdiendo", tone: "teal", atPhrase: "producir tu propia testosterona" }], {}),
  ]},
  { key: "bronca", phrase: "te quiero contar una cosa", beats: [
    c("talk", {}),
  ]},
  // ░░ HISTORIA — Ricardo ░░
  { key: "ricardo", phrase: "se llama ricardo", beats: [
    c("nametag", { name: "Ricardo, 54 años", role: "Taxista hace media vida · paciente y amigo", image: "img/fe8_ricardo_taxi.png" }),
  ]},
  { key: "consultorio", phrase: "entró al consultorio", beats: [
    r("fe8_ricardo_consultorio", { at: "se sentó distinto", hold: true }),
    r("fe8_ricardo_manos", { at: "se miró las manos" }),
  ]},
  { key: "quiebre", phrase: "se le llenaron los ojos", beats: [
    r("fe8_ricardo_ojos", { at: "se me quebró ahí sentado", hold: true }),
  ]},
  { key: "colega", phrase: "es la edad", beats: [
    mv("«Es la edad, hacete la idea»", "Tiene explicación — y algo que podés hacer vos", { flipPhrase: "algo que podés hacer" }),
  ]},
  { key: "mano", phrase: "le agarré la mano", beats: [
    r("fe8_medico_mano", { at: "se la apreté fuerte" }),
    c("talk", {}),
  ]},
  // ░░ MECANISMO ░░
  { key: "mecanismo_intro", phrase: "la clave de todo el video", beats: [
    c("talk", {}),
  ]},
  { key: "administrador", phrase: "como un administrador", beats: [
    dg("dg_fe8_administrador", "Sin uso, el cuerpo apaga la producción"),
    r("fe8_sentado_escritorio", { at: "te la pasás sentado" }),
  ]},
  { key: "senal_bars", phrase: "no necesita fuerza", beats: [
    c("bars", { title: "La señal que lee tu cuerpo", unit: "", bars: [
      { label: "Sentado todo el día", value: 32, tone: "danger", note: "produce menos" },
      { label: "Músculo grande trabajando", value: 100, winner: true, note: "produce más" } ] }),
  ]},
  { key: "hormona_fuerza", phrase: "la hormona de la fuerza", beats: [
    ak([{ word: "HORMONA DE LA FUERZA", sub: "si no la usás, tu cuerpo la baja para no gastar", tone: "teal", atPhrase: "la hormona de la fuerza" }], {}),
  ]},
  { key: "musculo_grande", phrase: "músculo grande esos son", beats: [
    ap([
      { image: "img/dg_fe8_musculos_grandes.png", sub: "piernas, glúteos y espalda: los tres motores grandes", atPhrase: "los tres motores grandes" },
      { card: "Señal a la fábrica", sub: "el esfuerzo real prende la producción de tu hormona", atPhrase: "prende la fábrica" },
    ], {}),
  ]},
  { key: "senal", phrase: "no hay magia", beats: [
    fc([{ t: "Es" }, { t: "una" }, { t: "señal", hl: true }], { tone: "teal", at: "es una señal" }),
    dg("dg_fe8_senal_fabrica", "Músculo grande → señal → produce testosterona"),
  ]},
  { key: "panza", phrase: "la grasa de la panza", beats: [
    dg("dg_fe8_circulo_panza", "Más panza, menos testosterona — un círculo"),
  ]},
  { key: "honesto1", phrase: "no te vengo a vender humo", beats: [
    lt("Esto acompaña y empuja — no es un milagro", { kicker: "Voy a ser honesto", desc: "Ayuda a tu cuerpo a producir lo suyo. No le rinde igual a todos ni de un día para el otro.", tone: "warn", at: "no es una cura mágica" }),
  ]},
  { key: "alerta1", phrase: "si vos tenés los síntomas muy marcados", beats: [
    c("checklist", { title: "Cuándo ir al médico sí o sí", items: [
      { text: "Cansancio extremo que no cede", state: "warn" },
      { text: "Bajón de ánimo profundo o cero deseo por meses", state: "warn" },
      { text: "Pedí que te midan la testosterona en sangre", state: "warn" } ] }),
  ]},
  { key: "vamos_siete", phrase: "vamos a los siete", beats: [
    c("talk", {}),
    dg("dg_fe8_7ejercicios", "Los 7 ejercicios, de suave a potente"),
  ]},
  // ░░ EJERCICIO 1 — sentadilla ░░
  { key: "ej1", phrase: "ejercicio número uno", beats: [
    es("01", "La sentadilla a la silla", { tone: "teal", w: 3.2 }),
    r("fe8_e1_silla_inicio", { at: "parado delante de una silla" }),
    r("fe8_e1_silla_baja", { at: "tocás apenas la silla" }),
  ]},
  { key: "ej1_caso", phrase: "cómo sabés si este es tu caso", beats: [
    ak([{ word: "¿ES TU CASO?", sub: "si te cuesta pararte de una silla sin usar las manos", tone: "teal", atPhrase: "sin ayudarte con las manos" }], {}),
    c("stat", { big: "2 × 10", label: "Dos series de diez, sin apuro", tone: "teal" }),
  ]},
  { key: "ej1_error", phrase: "un error clásico", beats: [
    c("annotated", { image: "img/fe8_e1_silla_baja.png", eyebrow: "Sentadilla a la silla", caption: "Los 3 puntos que no podés fallar", annotations: [
      { label: "Rodilla hacia la punta del pie", x: 42, y: 68 },
      { label: "Pecho arriba, mirada al frente", x: 55, y: 24 },
      { label: "Cola atrás, empujá con los talones", x: 60, y: 86 } ] }),
  ]},
  // ░░ EJERCICIO 2 — bisagra ░░
  { key: "ej2", phrase: "ejercicio número dos", beats: [
    es("02", "La bisagra de cadera", { tone: "teal", w: 3.2 }),
    r("fe8_e2_bisagra", { at: "empujás la cola bien para atrás", hold: true }),
  ]},
  { key: "ej2_espalda", phrase: "la espalda queda derecha", beats: [
    ak([{ word: "ESPALDA COMO UNA TABLA", sub: "nunca curvada — así blindás la columna", tone: "teal", atPhrase: "como una tabla" }], {}),
  ]},
  // ░░ EJERCICIO 3 — zancada ░░
  { key: "ej3", phrase: "ejercicio número tres", beats: [
    es("03", "La zancada", { tone: "teal", w: 3.2 }),
    r("fe8_e3_zancada", { at: "un paso largo para adelante" }),
    r("fe8_e3_mano_pared", { at: "apoyá una mano en la pared" }),
  ]},
  { key: "ej3_dosxuno", phrase: "ganás fuerza y ganás estabilidad", beats: [
    c("splitlist", { title: "Dos por uno", items: ["Fuerza — una pierna a la vez", "Equilibrio — lo que evita las caídas"] }),
  ]},
  // ░░ EJERCICIO 4 — empuje ░░
  { key: "ej4", phrase: "ejercicio número cuatro", beats: [
    es("04", "El empuje (flexión)", { tone: "teal", w: 3.2 }),
    r("fe8_e4_flexion_pared", { at: "contra la pared" }),
    r("fe8_e4_flexion_mesada", { at: "la mesada de la cocina" }),
  ]},
  // ░░ INJERTO VENTA #1 (mitad) ░░
  { key: "venta1", phrase: "la rutina completa de las cuatro semanas", beats: [
    fz("dg_fe8_libro_rutina", { x: 0.5, y: 0.5, label: "La rutina de 4 semanas, día por día", zoom: 1.5, tone: "teal", at: "la dejé ordenadita en mi guía" }),
    lt("Rutina completa en la descripción", { kicker: "archivos-federer.vercel.app", desc: "Repeticiones exactas, orden y descansos, día por día. Primer enlace abajo.", tone: "teal", at: "en la descripción" }),
  ]},
  // ░░ EJERCICIO 5 — remo ░░
  { key: "ej5", phrase: "ejercicio número cinco", beats: [
    es("05", "El remo (el tirón)", { tone: "teal", w: 3.2 }),
    r("fe8_e5_remo_botellas", { at: "tirás el peso hacia tus costillas" }),
    r("fe8_e5_banda", { at: "una banda elástica" }),
  ]},
  { key: "ej5_postura", phrase: "te ves como una letra", beats: [
    r("fe8_e5_postura_c", { at: "todo cerrado para adelante" }),
    c("annotated", { image: "img/fe8_e5_postura_c.png", eyebrow: "La postura en «C»", caption: "Lo que el remo te corrige", annotations: [
      { label: "Cabeza adelantada", x: 63, y: 26 },
      { label: "Hombros caídos hacia adelante", x: 46, y: 46 } ], at: "hombros caídos" }),
  ]},
  // ░░ EJERCICIO 6 — puente ░░
  { key: "ej6", phrase: "ejercicio número 6", beats: [
    es("06", "El puente de glúteos", { tone: "teal", w: 3.2 }),
    r("fe8_e6_puente", { at: "levantás la cadera", hold: true }),
    c("annotated", { image: "img/fe8_e6_puente.png", eyebrow: "El puente de glúteos", caption: "Apretá arriba y bajá con control", annotations: [
      { label: "Línea recta hombro-rodilla", x: 50, y: 40 },
      { label: "Apretá la cola 2 segundos arriba", x: 40, y: 70 } ], at: "apretando bien fuerte" }),
  ]},
  { key: "ej6_dormido", phrase: "están literalmente dormidos", beats: [
    fc([{ t: "El" }, { t: "músculo" }, { t: "más" }, { t: "grande" }, { t: "está" }, { t: "dormido", hl: true }], { tone: "teal", at: "están literalmente dormidos" }),
  ]},
  // ░░ EJERCICIO 7 — piques ░░
  { key: "ej7", phrase: "llegamos al número 7", beats: [
    c("talk", {}),
    es("07", "Los piques (intervalos)", { tone: "teal", w: 3.6 }),
    c("bars", { title: "El pique, por intervalo", unit: "seg", bars: [
      { label: "Fuerte · rodillas bien altas", value: 100, winner: true, note: "20 s" },
      { label: "Suave · caminás y recuperás", value: 100, tone: "teal", note: "40 s" } ], at: "20 segundos" }),
  ]},
  { key: "ej7_como", phrase: "marchás en el lugar", beats: [
    r("fe8_e7_marcha", { at: "levantando bien alto las rodillas" }),
    c("process", { title: "El pique, en casa", eyebrow: "Repetí 4 rondas", steps: [
      { title: "20 s fuerte", desc: "marcha rápida, rodillas altas", image: "img/fe8_e7_marcha.png" },
      { title: "40 s suave", desc: "caminás y recuperás el aire", image: "img/fe8_e7_caminata.png" },
      { title: "× 4", desc: "cuatro minutos y terminás agitado", image: "img/fe8_e7_caminata.png" } ] }),
  ]},
  { key: "ej7_hormona", phrase: "responde con hormona", beats: [
    fc([{ t: "Responde" }, { t: "con" }, { t: "TU" }, { t: "hormona", hl: true }], { tone: "teal", at: "con tu hormona" }),
  ]},
  { key: "ej7_carrera", phrase: "le gané una carrera a mi hijo", beats: [
    c("callout", { image: "img/fe8_ricardo_carrera.png", figure: "«Le gané»", caption: "Ricardo volvió a ganarle una carrera a su hijo hasta la esquina." }),
    r("fe8_ricardo_pelota_hijo", { at: "se rió como un pibe" }),
  ]},
  // ░░ AUTO-DIAGNÓSTICO ░░
  { key: "test", phrase: "dos grupos", beats: [
    dg("dg_fe8_dos_grupos", "¿Cuál de los dos grupos sos?"),
  ]},
  { key: "grupo1", phrase: "grupo 1", beats: [
    r("fe8_cordones", { at: "atarte los cordones" }),
    r("fe8_escalera", { at: "subiendo un piso por escalera" }),
    ak([{ word: "EMPEZÁ POR EL 1 Y EL 2", sub: "tres días por semana, dos semanas, sin héroes", tone: "teal", atPhrase: "la sentadilla en la silla" }], {}),
  ]},
  { key: "grupo2", phrase: "grupo 2", beats: [
    r("fe8_e7_caminata", { at: "caminás seguido" }),
    ak([{ word: "SUMÁ UNO POR SEMANA", sub: "armá la rutina de los siete, de a poco", tone: "teal", atPhrase: "sumando un ejercicio nuevo" }], {}),
  ]},
  { key: "sueno", phrase: "por el sueño", beats: [
    dg("dg_fe8_sueno_hormona", "Dormís mejor → la testosterona sube sola"),
    r("fe8_sueno_profundo", { at: "en las horas de sueño profundo" }),
  ]},
  { key: "sistema", phrase: "todo se conecta", beats: [
    dg("dg_fe8_sistema", "Movimiento → músculo → sueño → hormona"),
  ]},
  // ░░ ADVERTENCIAS + CIERRE ░░
  { key: "tres_cosas", phrase: "cosas rápidas pero", beats: [
    c("talk", {}),
    c("checklist", { title: "Las 3 claves para que funcione", items: [
      { text: "Constancia: poquito, pero todos los días", state: "done" },
      { text: "Comé de verdad (proteína) y dormí en serio", state: "done" },
      { text: "No reemplaza al médico — consultá si persiste", state: "warn" } ] }),
  ]},
  { key: "constancia", phrase: "la constancia le gana", beats: [
    dg("dg_fe8_constancia", "10 min todos los días > 2 horas un domingo"),
    r("fe8_calendario", { at: "poquito y seguido" }),
  ]},
  { key: "comida", phrase: "comé de verdad y dormí", beats: [
    dg("dg_fe8_tres_pilares", "Ejercicio + comida + sueño: los tres juntos"),
    r("fe8_comida_real", { at: "proteína de verdad, comida real" }),
    c("callout", { image: "img/fe8_comida_real.png", figure: "Sin ladrillos no hay pared", caption: "El ejercicio abre la puerta; la comida y el sueño construyen." , at: "sin darle ni un ladrillo" }),
  ]},
  { key: "honesto2", phrase: "esto acompaña", beats: [
    lt("No reemplaza a tu médico", { kicker: "Lo más importante", desc: "Si tras unas semanas de constancia sigue igual, sacá turno y pedí que te revisen.", tone: "warn", at: "sacá el turno" }),
  ]},
  { key: "ricardo_hoy", phrase: "ricardo hoy juega a la pelota", beats: [
    r("fe8_ricardo_pelota_hijo", { at: "volvió a ser él", hold: true }),
  ]},
  { key: "primer_paso", phrase: "buscás la silla más cercana", beats: [
    r("fe8_silla_diez", { at: "hacés diez", kicker: "El primer paso: 10 sentadillas" }),
  ]},
  // ░░ CTA ░░
  { key: "cta_intro", phrase: "media batalla ganada", beats: [
    c("talk", {}),
  ]},
  { key: "venta2", phrase: "te dejé mi guía completa", beats: [
    lt("Mi guía completa — enlace abajo", { kicker: "archivos-federer.vercel.app", desc: "Rutina de 4 semanas día por día + un capítulo de señales de alerta.", tone: "teal", at: "un capítulo entero" }),
  ]},
  { key: "cta_coment", phrase: "contame acá abajo", beats: [
    lt("¿Por cuál de los 7 vas a empezar?", { kicker: "Escribímelo en los comentarios", desc: "¿El 1, la sentadilla en la silla? ¿O directo al 7, los piques? Los leo todos.", tone: "teal", at: "en los comentarios" }),
  ]},
  { key: "suscribe", phrase: "suscríbete al canal", beats: [
    c("chips", { bg: "image", image: "img/fe8_silla_diez.png", imageDarken: 0.6, title: "Cuidémonos juntos", chips: ["Suscribite al canal", "Semana a semana", "No te resignes al asiento"] }),
  ]},
  { key: "cierre", phrase: "nos vemos en el próximo", beats: [
    c("nametag", { name: "Dr. Federer", role: "Fuerza y vitalidad real, después de los 40", image: "img/fe8_silla_diez.png" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer8.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1380) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
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
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO (avatarpizarra/keyword + mitoverdad) ───────
const KIT_CLIPS = [];
for (const beat of beats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const GAP = 90;
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    const hold = beat.kind === "avatarpizarra" ? 4.2 : 2.8;
    beat.dur = +(last / 30 + hold).toFixed(2);
    beat.clip = `avatar_clips/federer8/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.kind === "errorstinger") {
    const k = beat.key || "";
    beat.eyebrow = /^ej[1-7]$/.test(k) ? "Ejercicio" : "Dato";
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer8.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer8_beats.ts",
  `// AUTO-GENERADO por gen_federer8.mjs — beats (imágenes fe8_*.png / dg_fe8_*.png).\n` +
  `export const FED8_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer8_hooks.ts",
  `// AUTO-GENERADO por gen_federer8.mjs — rangos talk.\n` +
  `export const TALKS8: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer8.json", JSON.stringify({ video: "federer8", avatar: "federer8_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
console.log("MISS:", miss.join(" "));
