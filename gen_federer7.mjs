// gen_federer7.mjs — beatsheet/federer7.json (Canal "Federer Archivos" · Video 7 · KIWI ANTES DE DORMIR).
// Avatar federer7_opt.mp4 (~15.3min, español México/LATAM). Anclaje por FRASE a captions_federer7.json.
// Look CLÍNICO teal. Imágenes gpt-image-2 (.png): fe7_*.png + dg_fe7_*.png. Kit premium COMPLETO.
// Estructura: HOOK (fruta misteriosa) → historia del estudio de Taiwán 2011 → mecanismo
// (serotonina/melatonina) → la industria → 5 BENEFICIOS → escudo de honestidad → 3 ERRORES →
// PROTOCOLO de 5 pasos (con Federer en su cocina) → lado humano → repaso → CTA comentarios + guía.
// Salida a src/_fed6/VideoEdit/ (árbol autocontenido del kit). Diagramas SIN eyebrow.
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
  // ░░ HOOK — la fruta misteriosa ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r("fe7_kiwi_partido", { at: "de un verde esmeralda", kicker: "Verde esmeralda por dentro" }),
    mv("Una fruta no puede hacer lo que una pastilla", "Un estudio real dice lo contrario", { flipPhrase: "empieza a repararse" }),
  ]},
  { key: "promesa", phrase: "quedate conmigo hasta el final", beats: [
    c("talk", {}),
    r("fe7_kiwi_heladera", { at: "ya tienes en tu refrigerador", kicker: "Quizá ya está en tu heladera" }),
  ]},
  { key: "no_moda", phrase: "no es una moda de internet", beats: [
    mv("Es otro batido milagroso de internet", "Es una fruta de unos pesos con ciencia detrás", { flipPhrase: "unos cuantos pesos" }),
    r("fe7_mercado_kiwi", { at: "en el mercado de tu colonia" }),
  ]},
  // ░░ HISTORIA — Taiwán 2011 ░░
  { key: "historia_intro", phrase: "te quiero contar una historia", beats: [
    c("talk", {}),
  ]},
  { key: "taiwan", phrase: "en Taiwan un equipo", beats: [
    r("fe7_taiwan_hospital", { at: "un equipo de medicos", kicker: "Universidad Fu-Zhen, Taiwán", hold: true }),
    r("fe7_mayor_desvelado", { at: "un sueno ligero" }),
  ]},
  { key: "costumbre", phrase: "Comian kiwi casi todas las noches", beats: [
    ap([
      { image: "img/fe7_kiwi_cuchara.png", sub: "kiwi casi todas las noches, después de cenar", atPhrase: "despues de la cena" },
      { card: "No como remedio", sub: "solo por costumbre: la fruta era barata y abundante", atPhrase: "simplemente por costumbre" },
    ], {}),
  ]},
  { key: "prueba", phrase: "decidieron ponerlo a prueba", beats: [
    r("fe7_estudio_paper", { at: "con metodo cientifico" }),
    c("bars", { title: "El experimento", unit: "", bars: [
      { label: "24 adultos con problemas de sueño", value: 100, winner: true },
      { label: "2 kiwis · 1 hora antes de dormir", value: 100, tone: "teal" } ] }),
  ]},
  { key: "publica", phrase: "El estudio se publico", beats: [
    c("nametag", { name: "Asia Pacific Journal of Clinical Nutrition", role: "Estudio publicado · año 2011 · Taiwán", image: "img/fe7_estudio_paper.png" }),
  ]},
  { key: "resultados", phrase: "dejo a mas de uno", beats: [
    es("01", "Lo que midieron", { tone: "teal", w: 2.6 }),
    c("bars", { title: "Resultados del estudio (2011)", unit: "", bars: [
      { label: "Tardaban menos en dormirse", value: 65, tone: "teal", note: "−35%" },
      { label: "Sueño más eficiente", value: 78, tone: "teal", note: "+5%" },
      { label: "Más tiempo dormido", value: 100, winner: true, note: "≈ +1 hora" } ] }),
    fz("fe7_kiwi_partido", { x: 0.5, y: 0.5, label: "Casi una hora más de sueño", zoom: 1.6, tone: "teal", at: "casi una hora completa" }),
  ]},
  { key: "registrado", phrase: "es historia registrada", beats: [
    c("callout", { image: "img/fe7_estudio_paper.png", figure: "Con nombre y fecha", caption: "No es un cuento de sobremesa: podés buscarlo y comprobarlo." }),
  ]},
  // ░░ MECANISMO ░░
  { key: "porque", phrase: "por que una fruta tan sencilla", beats: [
    c("talk", {}),
  ]},
  { key: "serotonina", phrase: "una cantidad importante de serotonina", beats: [
    ak([{ word: "SEROTONINA", sub: "la hormona de la calma y el buen ánimo", tone: "teal", atPhrase: "la hormona de la calma" }], {}),
    c("annotated", { image: "img/fe7_kiwi_partido.png", eyebrow: "Por dentro del kiwi", caption: "Todo lo que trae, natural", annotations: [
      { label: "Serotonina natural", x: 35, y: 40 },
      { label: "Fibra + compuestos → melatonina", x: 66, y: 62 } ] }),
    dg("dg_fe7_kiwi_melatonina", "Kiwi → serotonina y melatonina"),
  ]},
  { key: "melatonina_propia", phrase: "producir su propia melatonina", beats: [
    r("fe7_melatonina_frasco", { at: "una pastilla de melatonina sintetica" }),
    c("bars", { title: "Melatonina: pastilla vs. kiwi", unit: "", bars: [
      { label: "Pastilla sintética · dosis externa", value: 55, tone: "danger", note: "dependencia" },
      { label: "Kiwi · el cuerpo la produce", value: 100, winner: true, note: "sin dependencia" } ] }),
  ]},
  { key: "regula_reloj", phrase: "regular su propio reloj biologico", beats: [
    dg("dg_fe7_natural_vs_sintetica", "Tu cuerpo aprende a regularse solo"),
  ]},
  { key: "vitc", phrase: "con mas vitamina C que existen", beats: [
    r("fe7_kiwi_partido", { at: "mas incluso que la naranja" }),
    c("bars", { title: "Vitamina C (gramo por gramo)", unit: "", bars: [
      { label: "Naranja", value: 60, tone: "teal" },
      { label: "Kiwi", value: 100, winner: true } ] }),
    c("splitlist", { title: "Tres aliados del descanso", items: ["Vitamina C — relaja el sistema nervioso", "Potasio — afloja los músculos", "Folato — sueño más estable"] }),
  ]},
  { key: "repara", phrase: "dormir no es solamente cerrar los ojos", beats: [
    fc([{ t: "Dormir" }, { t: "es" }, { t: "cuando" }, { t: "tu" }, { t: "cuerpo" }, { t: "se" }, { t: "repara", hl: true }], { tone: "teal", at: "hace absolutamente todo el trabajo" }),
  ]},
  // ░░ LA INDUSTRIA (enemigo / honestidad) ░░
  { key: "industria", phrase: "esto es lo que la industria", beats: [
    c("talk", {}),
    r("fe7_pastillas_farmacia", { at: "mas de dos mil millones", kicker: "Somníferos: +2.000 millones al año" }),
  ]},
  { key: "patente", phrase: "Lo que no genera una patente", beats: [
    fc([{ t: "Lo" }, { t: "que" }, { t: "no" }, { t: "da" }, { t: "patente" }, { t: "no" }, { t: "se" }, { t: "promociona", hl: true }], { tone: "warn", at: "no se promociona" }),
    r("fe7_mercado_kiwi", { at: "de 5 o 6 pesos" }),
  ]},
  // ░░ 5 BENEFICIOS ░░
  { key: "ben_intro", phrase: "los beneficios que vas a obtener", beats: [
    c("talk", {}),
    c("chips", { bg: "image", image: "img/fe7_kiwi_cuchara.png", imageDarken: 0.6, title: "No es solo dormir mejor", chips: ["Son 5 beneficios encadenados", "El número 3 sorprende a todos", "Quedate hasta ahí"] }),
  ]},
  { key: "ben1", phrase: "El primer beneficio", beats: [
    es("01", "Te dormís más rápido", { tone: "teal", w: 3.4 }),
    r("fe7_mayor_desvelado", { at: "dando vueltas en la cama" }),
    c("bars", { title: "Tiempo en quedarte dormido", unit: "min", bars: [
      { label: "Antes", value: 100, tone: "danger", note: "≈ 60 min" },
      { label: "Con el kiwi", value: 28, winner: true, note: "15–20 min" } ] }),
  ]},
  { key: "ben2", phrase: "El segundo beneficio", beats: [
    es("02", "Sueño más profundo", { tone: "teal", w: 3.4 }),
    dg("dg_fe7_fases_sueno", "Más tiempo en las fases profundas"),
    r("fe7_mayor_descansado", { at: "tu cuerpo repara tejido muscular" }),
  ]},
  { key: "ben3", phrase: "El tercer beneficio", beats: [
    es("03", "Energía a la mañana siguiente", { tone: "teal", w: 3.6 }),
    r("fe7_mayor_cansado_manana", { at: "arrastrando los pies" }),
    ak([{ word: "SIN NIEBLA MENTAL", sub: "te levantás con la mente despejada y las piernas ligeras", tone: "teal", atPhrase: "sin esa niebla mental" }], {}),
    r("fe7_mayor_descansado", { at: "vas a notar la diferencia" }),
  ]},
  { key: "ben4", phrase: "El cuarto beneficio", beats: [
    es("04", "Mejor digestión", { tone: "teal", w: 3.4 }),
    ak([{ word: "ACTINIDINA", sub: "una enzima del kiwi que digiere mejor las proteínas de la cena", tone: "teal", atPhrase: "se llama actinidina" }], {}),
    dg("dg_fe7_actinidina", "Actinidina → digiere las proteínas"),
  ]},
  { key: "ben5", phrase: "el quinto beneficio", beats: [
    es("05", "El efecto acumulativo", { tone: "teal", w: 3.4 }),
    r("fe7_calendario_21", { at: "mas constante seas" }),
    fc([{ t: "Tu" }, { t: "reloj" }, { t: "biológico" }, { t: "aprende" }, { t: "a" }, { t: "regularse", hl: true }, { t: "solo", hl: true }], { tone: "teal", at: "aprendio a regularse solo" }),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesto", phrase: "tengo que ser honesto contigo", beats: [
    c("talk", {}),
    lt("Esto no es un milagro instantáneo", { kicker: "Voy a ser honesto", desc: "Los resultados aparecen a la semana de hacerlo constante.", tone: "warn", at: "Este no es un jarabe magico" }),
  ]},
  { key: "cuidado", phrase: "un trastorno de sueno severo", beats: [
    c("checklist", { title: "Antes de empezar, ojo", items: [
      { text: "Apnea o insomnio crónico: seguí con tu especialista", state: "warn" },
      { text: "Anticoagulantes: consultá a tu médico antes", state: "warn" },
      { text: "Esto acompaña un tratamiento, nunca lo reemplaza", state: "warn" } ] }),
  ]},
  // ░░ 3 ERRORES ░░
  { key: "err_intro", phrase: "vamos al error que arruina", beats: [
    c("talk", {}),
  ]},
  { key: "err1", phrase: "comer el kiwi en el momento equivocado", beats: [
    es("01", "El momento equivocado", { tone: "warn", w: 3.4 }),
    r("fe7_kiwi_entero", { at: "de su ensalada del mediodia" }),
    dg("dg_fe7_ventana_tiempo", "La ventana correcta: 45–60 min antes"),
  ]},
  { key: "err2", phrase: "elegir el kiwi verde sin madurar", beats: [
    es("02", "El kiwi sin madurar", { tone: "warn", w: 3.4 }),
    c("bars", { title: "¿Está en su punto?", unit: "", bars: [
      { label: "Verde, duro, ácido", value: 40, tone: "danger", note: "no sirve todavía" },
      { label: "Cede al dedo, dulce, aromático", value: 100, winner: true } ] }),
    r("fe7_kiwi_maduro_punto", { at: "cede un poco a la presion" }),
  ]},
  { key: "err3", phrase: "es comerlo solo aislado", beats: [
    es("03", "Comerlo sin rutina", { tone: "warn", w: 3.4 }),
    r("fe7_celular_apagado_cama", { at: "una pequena rutina nocturna" }),
  ]},
  // ░░ PROTOCOLO (5 pasos, con Federer en su cocina) ░░
  { key: "protocolo", phrase: "el protocolo exacto que yo mismo", beats: [
    c("talk", {}),
  ]},
  { key: "paso1", phrase: "Primer paso una hora antes", beats: [
    es("01", "Dos kiwis maduros", { tone: "teal", w: 3.4 }),
    r("fe7_fed_corta_kiwi", { at: "corta dos kiwis maduros" }),
    r("fe7_fed_cuchara_kiwi", { at: "con una cucharita" }),
  ]},
  { key: "paso2", phrase: "puedes machacar esos dos kiwis", beats: [
    es("02", "Medio plátano maduro", { tone: "teal", w: 3.4 }),
    r("fe7_fed_machaca_platano", { at: "junto con medio platano" }),
    ak([{ word: "TRIPTÓFANO", sub: "el plátano suma potasio y triptófano → serotonina y melatonina", tone: "teal", atPhrase: "ese aminoacido que tu cuerpo" }], {}),
  ]},
  { key: "paso3", phrase: "un vaso pequeno de agua tibia", beats: [
    es("03", "Agua tibia + nuez moscada", { tone: "teal", w: 3.4 }),
    r("fe7_fed_agua_tibia", { at: "nunca fria" }),
    c("splitlist", { title: "El agua, dos detalles", items: ["Tibia, nunca fría (evita el choque digestivo)", "Una pizca de nuez moscada relaja el sistema nervioso"] }),
    r("fe7_fed_nuez_moscada", { at: "una pizca de nuez moscada" }),
  ]},
  { key: "paso4", phrase: "evita las pantallas el celular", beats: [
    es("04", "Apagá las pantallas", { tone: "teal", w: 3.4 }),
    r("fe7_celular_apagado_cama", { at: "esa hora completa en penumbra" }),
  ]},
  { key: "paso5", phrase: "haz no todas las noches", beats: [
    es("05", "Constancia: 21 días", { tone: "teal", w: 3.4 }),
    r("fe7_calendario_21", { at: "durante al menos 21 dias", hold: true }),
    c("process", { title: "El ritual del kiwi", eyebrow: "Cada noche, 1 hora antes", steps: [
      { title: "Comé", desc: "2 kiwis maduros con cucharita", image: "img/fe7_fed_cuchara_kiwi.png" },
      { title: "Sumá", desc: "medio plátano + agua tibia con nuez moscada", image: "img/fe7_fed_machaca_platano.png" },
      { title: "Apagá", desc: "pantallas y luces, penumbra 1 hora", image: "img/fe7_celular_apagado_cama.png" } ] }),
  ]},
  { key: "libro", phrase: "te puede costar menos de 20 pesos", beats: [
    r("fe7_libro_ritual", { at: "menos de 20 pesos diarios", hold: true }),
    c("bars", { title: "Lo que cuesta cada noche", unit: "pesos", bars: [
      { label: "Pastillas / melatonina de marca (mes)", value: 100, tone: "danger", note: "300–400" },
      { label: "El ritual del kiwi (día)", value: 12, winner: true, note: "< 20" } ] }),
    lt("Más recetas para dormir en mi guía", { kicker: "Si querés profundizar", desc: "Guía completa de la salud +60 — enlace en la descripción.", tone: "teal", at: "no hay quien gane dinero" }),
  ]},
  // ░░ LADO HUMANO ░░
  { key: "humano", phrase: "el lado humano de todo esto", beats: [
    c("talk", {}),
    r("fe7_paciente_ojeras", { at: "con ojeras marcadas", kicker: "Llegaban agotados a la consulta", hold: true }),
  ]},
  { key: "vuelven", phrase: "por fin dormian del tiron", beats: [
    r("fe7_abuelo_nietos", { at: "para sus hijos o sus nietos", hold: true }),
    fc([{ t: "Es" }, { t: "devolverle" }, { t: "a" }, { t: "alguien" }, { t: "la" }, { t: "energía", hl: true }, { t: "para" }, { t: "vivir", hl: true }], { tone: "teal", at: "la energia para vivir" }),
  ]},
  // ░░ REPASO ░░
  { key: "repaso", phrase: "hagamos un repaso rapido", beats: [
    c("talk", {}),
    ge("El ritual del kiwi (guardá esto)", [
      { text: "2 kiwis maduros, 1 hora antes de dormir", image: "img/fe7_kiwi_cuchara.png" },
      { text: "Sumá ½ plátano + agua tibia con nuez moscada", image: "img/fe7_kiwi_platano.png" },
      { text: "Apagá pantallas, dejá que la oscuridad ayude", image: "img/fe7_celular_apagado_cama.png" },
      { text: "Constancia: al menos 21 días", image: "img/fe7_calendario_21.png" },
      { text: "Anticoagulantes o trastorno del sueño: consultá", image: "img/fe7_paciente_ojeras.png" },
    ], { at: "Come dos kiwis maduros" }),
  ]},
  // ░░ CTA + GUÍA ░░
  { key: "cta", phrase: "cuentame en los comentarios", beats: [
    lt("Contame: ¿de qué parte nos ves y cuánto dormís?", { kicker: "En los comentarios", desc: "México o Latinoamérica, y cuántas horas dormís por noche.", tone: "teal", at: "cuantas horas duermes" }),
  ]},
  { key: "comparte", phrase: "compartela con alguien que amas", beats: [
    c("chips", { bg: "image", image: "img/fe7_abuelo_nietos.png", imageDarken: 0.62, title: "Compartilo con quien amás", chips: ["Con tu mamá, tu papá", "Con quien toma pastillas para dormir", "Puede cambiarle las noches"] }),
  ]},
  { key: "teaser", phrase: "La proxima vez te voy a platicar", beats: [
    c("talk", {}),
    lt("La próxima: una especia de tu alacena y el corazón", { kicker: "Próximo video", desc: "Un cardiólogo europeo empezó a recetarla. No te lo pierdas.", tone: "teal", at: "un frasco de especias" }),
  ]},
  { key: "cierre", phrase: "cuidense mucho duerman con calma", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, salud real para después de los 60", image: "img/fe7_federer_pizarra.png" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer7.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 920) + 2;

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
    beat.clip = `avatar_clips/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  // eyebrow del ErrorStinger según la sección (no todo es "ERROR")
  if (beat.kind === "errorstinger") {
    const k = beat.key || "";
    beat.eyebrow = /^ben[1-5]$/.test(k) ? "Beneficio"
      : /^paso[1-5]$/.test(k) ? "Paso"
      : /^err[1-3]$/.test(k) ? "Error"
      : k === "resultados" ? "El estudio"
      : "Dato";
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer7.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/federer7_beats.ts",
  `// AUTO-GENERADO por gen_federer7.mjs — beats (imágenes fe7_*.png / dg_fe7_*.png).\n` +
  `export const FED7_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer7_hooks.ts",
  `// AUTO-GENERADO por gen_federer7.mjs — rangos talk.\n` +
  `export const TALKS7: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer7.json", JSON.stringify({ video: "federer7", avatar: "federer7_opt.mp4", theme: "medico", beats }, null, 1));

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
