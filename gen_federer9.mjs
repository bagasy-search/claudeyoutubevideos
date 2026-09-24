// gen_federer9.mjs — beatsheet/federer9.json (Canal "Federer Building" · Dr. Federer · 10 COSAS QUE BAJAN LA TESTOSTERONA).
// Avatar federer9_opt.mp4 (~23min, voseo argentino). Anclaje por FRASE a captions_federer9.json.
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
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("fe9_dormitorio_noche", { at: "tu dormitorio", kicker: "Tu cuarto, tu sillón, esa copa…" }),
    r("fe9_copa_vino_noche", { at: "esa copa que parece inofensiva" }),
  ]},
  { key: "diez_cosas", phrase: "10 cosas cotidianas", beats: [
    ak([{ word: "10 COSAS COTIDIANAS", sub: "por separado no parecen nada; juntas te bajan la testosterona", tone: "warn", atPhrase: "diez cosas cotidianas" }], {}),
  ]},
  { key: "mas_peligrosa", phrase: "la más peligrosa no es", beats: [
    fc([{ t: "No" }, { t: "es" }, { t: "el" }, { t: "plástico" }, { t: "ni" }, { t: "la" }, { t: "edad", hl: true }], { tone: "warn", at: "ni siquiera es la edad" }),
    r("fe9_apnea_dormido", { at: "a pocos centímetros de tu almohada", kicker: "Está al lado de tu almohada" }),
  ]},
  { key: "error_teaser", phrase: "voy a mostrarte el error", beats: [
    c("talk", {}),
  ]},
  // ░░ MECANISMO ░░
  { key: "senal_tanque", phrase: "no es un tanque", beats: [
    dg("dg_fe9_senal_no_tanque", "La testosterona es una señal que cambia"),
  ]},
  { key: "no_cansancio", phrase: "tampoco todo cansancio", beats: [
    c("checklist", { title: "No todo cansancio es testosterona baja", items: [
      { text: "Dormir mal o depresión", state: "warn" },
      { text: "Apnea del sueño", state: "warn" },
      { text: "Diabetes, anemia o tiroides", state: "warn" } ] }),
  ]},
  { key: "enemigo_real", phrase: "el enemigo real", beats: [
    fc([{ t: "El" }, { t: "enemigo:" }, { t: "taparlo" }, { t: "con" }, { t: "una" }, { t: "cápsula", hl: true }], { tone: "warn", at: "taparlo con una cápsula" }),
  ]},
  // ░░ 1 — DORMIR POCO ░░
  { key: "cosa1", phrase: "la primera cosa", beats: [
    es("01", "Dormir poco, repetido", { tone: "warn", w: 3.2 }),
    r("fe9_hombre_desvelado", { at: "cinco o seis horas", hold: true }),
  ]},
  { key: "ligada_sueno", phrase: "mientras duermes", beats: [
    dg("dg_fe9_sueno_hormona", "Gran parte se produce mientras dormís"),
  ]},
  { key: "estudio_sueno", phrase: "un experimento pequeño", beats: [
    c("bars", { title: "Dormir <5 h por una semana", unit: "%", bars: [
      { label: "Testosterona diurna", value: 100, tone: "teal", note: "normal" },
      { label: "Tras la semana corta", value: 87, tone: "danger", note: "−10 a 15%" } ], at: "diez al quince por ciento" }),
  ]},
  { key: "telefono", phrase: "a 20 centímetros", beats: [
    r("fe9_telefono_cama", { at: "el teléfono" }),
    ak([{ word: "PANTALLAS FUERA 1 H ANTES", sub: "teléfono lejos + ventana de 7 a 9 horas", tone: "teal", atPhrase: "una hora fija para apagar pantallas" }], {}),
  ]},
  // ░░ 2 — APNEA ░░
  { key: "cosa2", phrase: "aparece la segunda cosa", beats: [
    es("02", "Roncar con pausas (apnea)", { tone: "warn", w: 3.2 }),
    r("fe9_ronquido_pareja", { at: "roncar con pausas respiratorias", hold: true }),
  ]},
  { key: "apnea_mec", phrase: "la vía respiratoria se cierre", beats: [
    dg("dg_fe9_apnea", "Ronca, cae el oxígeno, te despierta sin notarlo"),
  ]},
  { key: "apnea_senales", phrase: "si roncas fuerte", beats: [
    c("checklist", { title: "Señales de apnea", items: [
      { text: "Roncás fuerte o te ven dejar de respirar", state: "warn" },
      { text: "Dolor de cabeza al despertar", state: "warn" },
      { text: "Sueño de día / te dormís frente a la tele", state: "warn" } ] }),
  ]},
  { key: "apnea_pregunta", phrase: "de 30 segundos", beats: [
    c("callout", { image: "img/fe9_ronquido_pareja.png", figure: "«¿Ronco o dejo de respirar?»", caption: "Preguntale a quien duerme al lado: sabe algo que tu reloj no." }),
  ]},
  // ░░ 3 — GRASA ABDOMINAL ░░
  { key: "cosa3", phrase: "la tercera cosa", beats: [
    es("03", "Grasa abdominal", { tone: "warn", w: 3.2 }),
    r("fe9_panza_perfil", { at: "ganar grasa abdominal", hold: true }),
  ]},
  { key: "red_no_interruptor", phrase: "no un interruptor", beats: [
    dg("dg_fe9_panza_red", "Es una red: SHBG, insulina, inflamación, apnea"),
  ]},
  { key: "perder_peso", phrase: "5 y un 10", beats: [
    c("stat", { big: "5–10%", label: "Bajar ese peso, si sobra, ya ayuda mucho", tone: "teal" }),
  ]},
  { key: "medir_cintura", phrase: "mide la cintura", beats: [
    r("fe9_medir_cintura", { at: "con una cinta" }),
    c("annotated", { image: "img/fe9_medir_cintura.png", eyebrow: "Cómo medirte", caption: "La dirección importa más que un día suelto", annotations: [
      { label: "Siempre en el mismo punto", x: 45, y: 55 },
      { label: "Cada 2 a 4 semanas", x: 60, y: 30 } ], at: "cada dos o cuatro semanas" }),
  ]},
  // ░░ 4 — SEDENTARISMO ░░
  { key: "cosa4", phrase: "la cuarta cosa", beats: [
    es("04", "Vivir sentado", { tone: "warn", w: 3.2 }),
    r("fe9_sentado_escritorio", { at: "casi todo el día sentado", hold: true }),
  ]},
  { key: "ejercicio_magico", phrase: "el ejercicio mágico", beats: [
    c("talk", {}),
  ]},
  { key: "fuerza_semana", phrase: "dos o tres sesiones semanales", beats: [
    dg("dg_fe9_fuerza_semana", "Fuerza 2-3 veces por semana + movimiento diario"),
    r("fe9_sentadilla_fuerza", { at: "los grandes grupos musculares" }),
  ]},
  // ░░ 5 — COMER MUY POCO ░░
  { key: "cosa5", phrase: "aparece la quinta cosa", beats: [
    es("05", "Comer muy poco, mucho tiempo", { tone: "warn", w: 3.2 }),
    r("fe9_plato_vacio_dieta", { at: "una dieta extrema", hold: true }),
  ]},
  { key: "baja_energia", phrase: "baja disponibilidad energética", beats: [
    ak([{ word: "BAJA DISPONIBILIDAD ENERGÉTICA", sub: "faltan calorías: cae fuerza, sueño y libido", tone: "warn", atPhrase: "baja disponibilidad energética" }], {}),
  ]},
  { key: "grasa_no_enemiga", phrase: "la grasa alimentaria en enemiga", beats: [
    r("fe9_comida_real", { at: "proteínas suficientes", hold: true }),
    c("splitlist", { title: "Un patrón que puedas sostener", items: ["Proteína + frutas, verduras y legumbres", "Grasas reales: oliva, frutos secos, huevos, pescado"] }),
  ]},
  { key: "suplementos", phrase: "tomar megadosis", beats: [
    r("fe9_suplementos_frascos", { at: "sin saber si existe esa deficiencia" }),
    lt("Más no es mejor", { kicker: "Suplementos", desc: "Corregir una deficiencia real sirve. Megadosis a ciegas, no. Si prometen multiplicarla sin medir, crece la cuenta del vendedor.", tone: "warn", at: "más no significa mejor" }),
  ]},
  // ░░ 6 — SOBREENTRENAR ░░
  { key: "cosa6", phrase: "la sexta cosa", beats: [
    es("06", "Entrenar sin recuperar nunca", { tone: "warn", w: 3.2 }),
    r("fe9_hombre_agotado_gym", { at: "no recuperarte jamás", hold: true }),
  ]},
  { key: "falta_recuperacion", phrase: "falta recuperación", beats: [
    fc([{ t: "No" }, { t: "falta" }, { t: "agresividad." }, { t: "Falta" }, { t: "recuperación", hl: true }], { tone: "teal", at: "falta recuperación" }),
  ]},
  { key: "senales_sobre", phrase: "vigila señales concretas", beats: [
    c("checklist", { title: "Señales de sobreentrenamiento", items: [
      { text: "Tu fuerza baja varias semanas", state: "warn" },
      { text: "Pulso en reposo más alto, sin motivación", state: "warn" },
      { text: "Lesiones repetidas, peor sueño", state: "warn" } ] }),
  ]},
  // ░░ 7 — ALCOHOL ░░
  { key: "cosa7", phrase: "la séptima cosa", beats: [
    es("07", "Alcohol frecuente", { tone: "warn", w: 3.2 }),
    r("fe9_alcohol_noche", { at: "el alcohol frecuente", hold: true }),
    c("bars", { title: "No es lo mismo el patrón", unit: "", bars: [
      { label: "Una copa ocasional", value: 30, tone: "teal", note: "bajo impacto" },
      { label: "Cada noche / atracón", value: 100, tone: "danger", note: "ataca varias piezas" } ], at: "una copa ocasional" }),
  ]},
  { key: "cadena", phrase: "piensa en la cadena", beats: [
    dg("dg_fe9_cadena_alcohol", "Bebo para dormir → sueño roto → menos energía → más cintura"),
  ]},
  { key: "prueba_alcohol", phrase: "una prueba de dos o cuatro semanas", beats: [
    lt("Probá 2-4 semanas sin alcohol", { kicker: "Un experimento, no un detox", desc: "Observá sueño, energía, presión, rendimiento y cintura. Si te cuesta parar, es ayuda, no vergüenza.", tone: "teal", at: "no lo llames desintoxicación" }),
  ]},
  // ░░ 8 — ESTRÉS ░░
  { key: "cosa8", phrase: "la octava cosa", beats: [
    es("08", "Estrés crónico y turnos", { tone: "warn", w: 3.2 }),
    r("fe9_estres_hombre", { at: "el acelerador mental pisado", hold: true }),
  ]},
  { key: "turnos", phrase: "los turnos nocturnos", beats: [
    r("fe9_turno_noche", { at: "si trabajas de noche" }),
  ]},
  { key: "respiracion", phrase: "10 minutos diarios", beats: [
    r("fe9_respiracion_calma", { at: "una caminata sin teléfono" }),
    lt("La salud mental es parte del cuerpo", { kicker: "Si no disfrutás nada hace semanas", desc: "Ansiedad intensa o pensamientos oscuros no se arreglan «subiendo la testosterona». Buscá ayuda profesional.", tone: "warn", at: "busca ayuda profesional" }),
  ]},
  // ░░ 9 — MEDICAMENTOS ░░
  { key: "cosa9", phrase: "la novena cosa", beats: [
    es("09", "Medicamentos sin revisar", { tone: "warn", w: 3.2 }),
    r("fe9_botiquin_medicamentos", { at: "dentro del botiquín", hold: true }),
  ]},
  { key: "instruccion_firme", phrase: "la instrucción aquí es firme", beats: [
    lt("Nunca los suspendas por tu cuenta", { kicker: "Firme", desc: "No cortes un corticoide de golpe ni abandones un tratamiento psiquiátrico solo. Llevá la lista completa al médico.", tone: "warn", at: "no suspendas un medicamento" }),
    r("fe9_lista_medico", { at: "lleva una lista completa" }),
  ]},
  { key: "trampa_anabolicos", phrase: "esteroides anabólicos", beats: [
    ak([{ word: "LOS ANABÓLICOS APAGAN LH Y FSH", sub: "el cuerpo baja su propia producción; puede caer la fertilidad", tone: "warn", atPhrase: "reduce las señales llamadas" }], {}),
  ]},
  { key: "fertilidad", phrase: "quieres tener hijos", beats: [
    lt("La testosterona externa NO es fertilidad", { kicker: "Importante si querés hijos", desc: "Puede suprimir el recuento de espermatozoides. Si ya los usás, decíselo al médico, sin vergüenza.", tone: "warn", at: "no es un suplemento de fertilidad" }),
  ]},
  // ░░ 10 — PLÁSTICOS ░░
  { key: "cosa10", phrase: "la décima cosa", beats: [
    es("10", "Calor en plásticos", { tone: "warn", w: 3.2 }),
    r("fe9_recipiente_plastico_micro", { at: "exponer comida caliente", hold: true }),
  ]},
  { key: "precauciones", phrase: "precauciones simples", beats: [
    c("checklist", { title: "Precauciones simples (sin paranoia)", items: [
      { text: "No calientes en recipientes dañados o no aptos", state: "warn" },
      { text: "Nada de líquidos hirviendo en descartables", state: "done" },
      { text: "Para caliente: vidrio o acero", state: "done" } ] }),
    r("fe9_vidrio_acero", { at: "vidrio o acero" }),
  ]},
  { key: "mito_soja", phrase: "la soja en cantidades", beats: [
    mv("La soja te baja la testosterona", "En cantidades normales NO feminiza ni la destruye", { flipPhrase: "no ha demostrado feminizar" }),
  ]},
  // ░░ DIAGNÓSTICO ░░
  { key: "tramo_incomodo", phrase: "el tramo incómodo", beats: [
    c("talk", {}),
  ]},
  { key: "cuando_consultar", phrase: "señales que justifican una consulta", beats: [
    dg("dg_fe9_cuando_medico", "Cuándo sí conviene consultar y estudiarlo"),
  ]},
  { key: "gran_error", phrase: "el gran error del principio", beats: [
    fc([{ t: "Medir" }, { t: "una" }, { t: "vez" }, { t: "y" }, { t: "tratar" }, { t: "sin" }, { t: "confirmar", hl: true }], { tone: "warn", at: "medir la testosterona una sola vez" }),
  ]},
  { key: "dos_mananas", phrase: "dos muestras tomadas en mañanas", beats: [
    dg("dg_fe9_dos_mananas", "Confirmá en 2 mañanas diferentes antes de tratar"),
  ]},
  { key: "hipogonadismo", phrase: "hipogonadismo funcional", beats: [
    ak([{ word: "HIPOGONADISMO FUNCIONAL", sub: "cuando algo reversible frena el eje, sin falla del testículo", tone: "teal", atPhrase: "hipogonadismo funcional" }], {}),
    r("fe9_analisis_sangre", { at: "LH, FSH, prolactina" }),
  ]},
  // ░░ RECAP + CTA ░░
  { key: "recap", phrase: "recapitulemos de una", beats: [
    c("talk", {}),
    dg("dg_fe9_recap", "Para usar desde esta noche"),
  ]},
  { key: "recap_pasos", phrase: "una ventana de 7", beats: [
    c("process", { title: "Los primeros 3 arreglos", eyebrow: "Desde esta noche", steps: [
      { title: "Dormí 7-9 h", desc: "teléfono fuera del alcance", image: "img/fe9_reloj_cinco_horas.png" },
      { title: "Revisá apnea", desc: "si roncás con pausas o te dormís de día", image: "img/fe9_apnea_dormido.png" },
      { title: "Bajá la cintura", desc: "de a poco, medí cada 2-4 semanas", image: "img/fe9_medir_cintura.png" } ] }),
  ]},
  { key: "cta_coment", phrase: "cuéntame en los comentarios", beats: [
    lt("¿Cuál de las 10 te sorprendió? ¿Cuántas horas dormís?", { kicker: "Contame abajo", desc: "Y compartilo con ese amigo que compra cada potenciador pero se acuesta a las dos.", tone: "teal", at: "cuál de estas diez cosas" }),
  ]},
  { key: "suscribe", phrase: "suscríbete a federer building", beats: [
    c("chips", { bg: "image", image: "img/fe9_hombre_descansado.png", imageDarken: 0.6, title: "Cuidémonos juntos", chips: ["Suscribite a Federer Building", "Arreglá primero lo grande", "Confirmá los números"] }),
  ]},
  { key: "cierre", phrase: "no seas terco con los ronquidos", beats: [
    c("nametag", { name: "Dr. Federer", role: "Salud y vitalidad real, con evidencia", image: "img/fe9_consulta_medico.png" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer9.json", "utf8"));
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
    beat.clip = `avatar_clips/federer9/${beat.id}.mp4`;
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
    beat.eyebrow = /^cosa\d+$/.test(k) ? "Cosa" : "Dato";
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer9.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/federer9_beats.ts",
  `// AUTO-GENERADO por gen_federer9.mjs — beats (imágenes fe8_*.png / dg_fe8_*.png).\n` +
  `export const FED9_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer9_hooks.ts",
  `// AUTO-GENERADO por gen_federer9.mjs — rangos talk.\n` +
  `export const TALKS9: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer9.json", JSON.stringify({ video: "federer9", avatar: "federer9_opt.mp4", theme: "medico", beats }, null, 1));

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
