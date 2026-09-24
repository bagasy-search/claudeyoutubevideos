// gen_vl12pbyufw1o.mjs — beatsheet "Piel Radiante 50+ · sábila/aloe vera" (Canal Federer Consejos).
// Avatar vl12pbyufw1o_opt.mp4 (~19.4min). Anclaje por FRASE a captions_vl12pbyufw1o.json.
// Look CLÍNICO teal. Imágenes gpt-image-2: p_vl12pbyufw1o_*.png + dg_vl12pbyufw1o_*.png. Kit _fed6.
import fs from "fs";
const SLUG = "vl12pbyufw1o";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ HOOK ░░ (avatar full arranca; luego hero de la planta olvidada)
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r(P("sabila_maceta_ventana"), { at: "una maceta", kicker: "La tienes y no lo sabes" }),
    r(P("gel_sabila_penca"), { at: "un gel transparente" }),
  ]},
  { key: "helo", phrase: "cambio la piel de muchas", beats: [
    fc([{ t: "Una" }, { t: "piel" }, { t: "de" }, { t: "20", hl: true }, { t: "años" }, { t: "más" }, { t: "joven", hl: true }], { tone: "teal", at: "20 años mas joven" }),
    r(P("mujer_mayor_piel_radiante"), { at: "20 años mas joven" }),
  ]},
  // ░░ ANCLA HISTÓRICA · EGIPTO ░░
  { key: "egipto", phrase: "los antiguos egipcios", beats: [
    r(P("papiro_ebers"), { at: "la planta de la inmortalidad", kicker: "Papiro Ebers · 1550 a.C." }),
    ak([{ word: "3500 AÑOS", sub: "escrito en el papiro más viejo de la medicina", tone: "teal", atPhrase: "3500 años" }], {}),
  ]},
  { key: "cleopatra", phrase: "dicen que cleopatra", beats: [
    r(P("cleopatra_ritual"), { at: "cleopatra", kicker: "Cleopatra · Egipto", hold: true }),
    r(P("cleopatra_bano_leche"), { at: "miel y con leche" }),
    r(P("nefertiti_busto"), { at: "nefertiti" }),
  ]},
  // ░░ DIOSCÓRIDES + ALEJANDRO / SOCOTRA ░░
  { key: "dioscorides", phrase: "un medico briego llamado", beats: [
    r(P("dioscorides_libro"), { at: "escribio con lujo de detalle", kicker: "Dioscórides · s. I" }),
  ]},
  { key: "socotra", phrase: "cuentan que a alejandro", beats: [
    r(P("alejandro_socotra"), { at: "la isla de socotra", kicker: "Isla de Socotra" }),
    fc([{ t: "Reyes" }, { t: "y" }, { t: "reinas" }, { t: "movían" }, { t: "imperios", hl: true }, { t: "por" }, { t: "esta" }, { t: "planta", hl: true }], { tone: "teal", at: "movian imperios" }),
    r(P("sabila_maceta_ventana"), { at: "muriendose de aburrida" }),
  ]},
  // ░░ PRESENTACIÓN CASERA ░░
  { key: "presenta", phrase: "soy el dr", beats: [
    c("nametag", { name: "Dr. Federer", role: "Remedios de siempre para después de los 60", image: `img/${P("federer_consultorio")}.png` }),
    r(P("federer_cocina_sabila"), { at: "los remedios de siempre" }),
  ]},
  { key: "promesa", phrase: "hoy te voy a enseñar", beats: [
    c("chips", { bg: "image", image: `img/${P("federer_muestra_gel")}.png`, imageDarken: 0.58, title: "Tu mejor aliada contra la edad", chips: ["Arrugas y líneas finas", "Manchas oscuras", "Piel apagada y seca"] }),
    ak([{ word: "EL BENEFICIO 3", sub: "borra algo que a los 60 creías sin remedio", tone: "warn", atPhrase: "el beneficio numero 3" }], {}),
  ]},
  { key: "antes_error", phrase: "hay un error que casi todos", beats: [
    lt("Cuidado con UN error al usarla", { kicker: "Quédate hasta el final", desc: "En vez de rejuvenecer, mancha e irrita. Al final te lo explico.", tone: "warn", at: "un error que casi todos" }),
  ]},
  // ░░ REVELACIÓN: SÁBILA ░░
  { key: "revela", phrase: "la planta de la que te hablo", beats: [
    c("talk", {}),
    r(P("sabila_planta_detalle"), { at: "la sabila el aloe vera" }),
    ak([{ word: "SÁBILA", sub: "aloe vera · la que tienes de adorno", tone: "teal", atPhrase: "la sabila el aloe vera" }], {}),
  ]},
  // ░░ ENEMIGO · INDUSTRIA / COLÁGENO ░░
  { key: "enemigo", phrase: "cremas antiarrugas", beats: [
    r(P("cremas_caras_estante"), { at: "cremas antiarrugas", kicker: "$600 · $800 · $1000" }),
    mv("La crema de colágeno te rejuvenece", "Sus moléculas son enormes: no entran a tu piel", { flipPhrase: "para atravesar tu piel" }),
  ]},
  { key: "desague", phrase: "se va por el desague", beats: [
    fc([{ t: "Pagaste" }, { t: "$1000" }, { t: "por" }, { t: "algo" }, { t: "que" }, { t: "ni", }, { t: "entró", hl: true }], { tone: "warn", at: "ni siquiera entro" }),
  ]},
  { key: "libre", phrase: "porque una maceta de sabila", beats: [
    mv("Necesitas comprar cremas para siempre", "Una planta te dura toda la vida (y da hijitos)", { flipPhrase: "la planta te dura toda" }),
    r(P("sabila_hijitos_maceta"), { at: "hijitos que puedes regalar" }),
  ]},
  // ░░ CIENCIA · MUCOPOLISACÁRIDOS ░░
  { key: "ciencia", phrase: "el gel transparente de la sabila", beats: [
    c("talk", {}),
    dg(D("mucopolisacaridos"), "Esponjas que atrapan agua"),
    r(P("gel_aplica_piel"), { at: "sientes la piel fresca" }),
  ]},
  // ░░ COLÁGENO = COLCHÓN ░░
  { key: "colchon", phrase: "imagina que tu piel es un colchon", beats: [
    dg(D("colageno_colchon"), "Colágeno = resortes del colchón"),
  ]},
  { key: "unporciento", phrase: "a partir de los 25 años", beats: [
    c("bars", { title: "Colágeno que te queda", unit: "%", bars: [
      { label: "A los 25 (colchón nuevo)", value: 100, winner: true, note: "resortes firmes" },
      { label: "A los 60 (−1% por año)", value: 65, tone: "danger", note: "más de un tercio menos" } ] }),
    fc([{ t: "Las" }, { t: "arrugas" }, { t: "son" }, { t: "resortes", hl: true }, { t: "gastados", hl: true }], { tone: "teal", at: "los resortes que se te fueron" }),
  ]},
  // ░░ FIBROBLASTOS ░░
  { key: "fibroblastos", phrase: "el gel de la sabila contiene un compuesto", beats: [
    ak([{ word: "ACEMANANO", sub: "despierta a los fibroblastos de tu piel", tone: "teal", atPhrase: "un compuesto llamado" }], {}),
    dg(D("fibroblastos"), "Fibroblastos = fábricas de colágeno"),
  ]},
  { key: "reconstruye", phrase: "una crema disimula", beats: [
    mv("Ponerte colágeno por fuera", "Mandar la señal para que TÚ lo fabriques", { flipPhrase: "la sabila reconstruye" }),
  ]},
  // ░░ INJERTO GUÍA #1 (suave, ~30%) ░░
  { key: "guia1", phrase: "todas esas cantidades exactas", beats: [
    r("fe7_libro_ritual", { at: "anotadas y medidas en mi guia", hold: true }),
    lt("Las cantidades exactas están en mi guía", { kicker: "Si querés ir a fondo", desc: "Pero sigamos, que falta lo mejor. El enlace, al final.", tone: "teal", at: "no te adelanto nada todavia" }),
  ]},
  // ░░ VITAMINA C Y E · RADICALES LIBRES ░░
  { key: "vitaminas", phrase: "la sabila trae vitamina c", beats: [
    dg(D("radicales_libres"), "Antioxidantes vs radicales libres"),
    r(P("piel_oxidacion_macro"), { at: "como si oxida un fierro" }),
  ]},
  // ░░ LOS 4 BENEFICIOS ░░
  { key: "benef1", phrase: "beneficio numero uno", beats: [
    es("01", "Hidratación profunda y duradera", { w: 3.4 }),
    r(P("piel_hidratada_mujer"), { at: "la humedad dentro de la piel" }),
    lt("Cara suave y tersa al despertar", { kicker: "Beneficio 1", desc: "Adiós a la piel de papel. En una semana.", tone: "teal", at: "en una semana nada mas" }),
  ]},
  { key: "benef2", phrase: "beneficio numero dos", beats: [
    es("02", "Estímulo del colágeno · arrugas finas", { w: 3.6 }),
    r(P("arruga_ojos_macro"), { at: "las lineas finas alrededor" }),
    ak([{ word: "3 A 4 SEMANAS", sub: "constancia: los fibroblastos vuelven a trabajar", tone: "teal", atPhrase: "entre 3 y 4 semanas" }], {}),
  ]},
  { key: "rosa", phrase: "doña rosa maria", beats: [
    c("quote", { image: `img/${P("paciente_rosa_maria")}.png`, text: "“Por primera vez en años amanecí *sin sentir la cara tirante.*”" }),
    r(P("nietos_abuela")   , { at: "sus nietos le preguntaron" }),
  ]},
  { key: "benef3", phrase: "el beneficio numero 3", beats: [
    es("03", "Aclara las manchas oscuras", { w: 3.8 }),
    r(P("manchas_mejillas_mujer"), { at: "esas manchas oscuras" }),
    ak([{ word: "ALOESINA", sub: "frena la tirosinasa, la enzima que oscurece", tone: "teal", atPhrase: "un compuesto llamado" }], {}),
    dg(D("aloesina_tirosinasa"), "Aloesina bloquea la tirosinasa"),
    r(P("manchas_dorso_manos"), { at: "empieza a difuminarse" }),
  ]},
  { key: "benef4", phrase: "beneficio numero 4", beats: [
    es("04", "Calma irritación y rojez", { w: 3.6 }),
    r(P("rosacea_mejilla_calma"), { at: "la piel sensible rojiza" }),
    lt("Un bálsamo para piel sensible", { kicker: "Beneficio 4", desc: "Baja inflamación, calma el ardor, desvanece la rojez.", tone: "teal", at: "es un balsamo" }),
  ]},
  // ░░ MITO: GEL DE BOTELLA ░░
  { key: "mito_botella", phrase: "el gel de sabila en el supermercado", beats: [
    r(P("gel_botella_super"), { at: "en botella", kicker: "El del super" }),
    mv("El gel azul de botella sirve igual", "10% de sábila + alcohol que te reseca", { flipPhrase: "un 10 por ciento" }),
    fc([{ t: "El" }, { t: "poder" }, { t: "está" }, { t: "en" }, { t: "el" }, { t: "gel" }, { t: "fresco", hl: true }], { tone: "teal", at: "el gel fresco vivo" }),
  ]},
  // ░░ PACIENTE CARMEN ░░
  { key: "carmen", phrase: "doña carmen", beats: [
    c("quote", { image: `img/${P("paciente_carmen")}.png`, text: "Doña Carmen, 67. Dos meses de constancia y *volvió a mirarse al espejo sin agachar la cabeza.*" }),
  ]},
  // ░░ HONESTIDAD ░░
  { key: "honesto", phrase: "una pausa honesta contigo", beats: [
    c("talk", {}),
    c("checklist", { title: "Sé honesto contigo", items: [
      { text: "No es magia: pide paciencia y constancia", state: "warn" },
      { text: "No borra una arruga profunda de un plumazo", state: "warn" },
      { text: "Complementa tu cuidado; NO reemplaza al médico", state: "done" } ] }),
  ]},
  { key: "alarma", phrase: "si tienes una mancha que cambio", beats: [
    lt("¿Mancha que cambia, crece o sangra? Al médico", { kicker: "Sin falta", desc: "Eso no se trata con sábila: lo ve un doctor en persona.", tone: "warn", at: "que te sangra o que te pica" }),
  ]},
  // ░░ INJERTO GUÍA #2 (~60%, antes de la receta) ░░
  { key: "guia2", phrase: "otras recetas caseras para la piel", beats: [
    c("chips", { bg: "image", image: "img/fe7_libro_ritual.png", imageDarken: 0.6, title: "La Guía Completa de la Salud +60", chips: ["+150 remedios y recetas", "Cantidades exactas paso a paso", "archivos-federer.vercel.app"] }),
    lt("Pero de eso te hablo al final", { kicker: "Con calma", desc: "Ahora vamos a lo bueno: la receta. Sigamos.", tone: "teal", at: "sigamos" }),
  ]},
  // ░░ RECETA · INTRO ░░
  { key: "receta_intro", phrase: "como preparar tu propio gel", beats: [
    c("talk", {}),
    r(P("federer_cocina_sabila"), { at: "en tu cocina con cosas" }),
  ]},
  // ░░ PASO 1 · CORTE ░░
  { key: "paso1", phrase: "primero el corte", beats: [
    r(P("penca_corte_gruesa"), { at: "cortas una penca gruesa" }),
    c("process", { title: "Preparar el gel", eyebrow: "En tu cocina · ingredientes económicos", steps: [
      { title: "Corta la penca", desc: "una de abajo, la más madura", image: `img/${P("penca_corte_gruesa")}.png` },
      { title: "Drena el amarillo", desc: "de cabeza, 20 minutos", image: `img/${P("penca_cabeza_vaso")}.png` },
      { title: "Solo el gel", desc: "quita la cáscara verde", image: `img/${P("filete_transparente")}.png` } ] }),
  ]},
  // ░░ EL ERROR · ALOÍNA ░░
  { key: "error", phrase: "aqui queridos amigos viene el error", beats: [
    es("!", "El error que arruina todo", { tone: "warn", w: 3.6 }),
    r(P("aloina_amarilla"), { at: "escurre un liquido amarillo", kicker: "Aloína = irrita y mancha" }),
    dg(D("error_aloina"), "Drena la aloína amarilla"),
    r(P("penca_cabeza_vaso"), { at: "parar la penca de cabeza" }),
  ]},
  // ░░ PASO 2 · CÁSCARA ░░
  { key: "paso2", phrase: "con un cuchillo le quitas la cascara", beats: [
    r(P("filete_transparente"), { at: "el gel puro y cristalino", kicker: "El oro: gel cristalino" }),
  ]},
  // ░░ PASO 3 · MEZCLA ░░
  { key: "paso3", phrase: "machacas o licuas ese gel", beats: [
    r(P("mezcla_miel_vite"), { at: "dos ingredientes economicos" }),
    ak([{ word: "MIEL + VITAMINA E", sub: "humectante + antioxidante extra", tone: "teal", atPhrase: "una cucharadita de miel" }], {}),
  ]},
  // ░░ PASO 4 · BAÑO MARÍA ░░
  { key: "paso4", phrase: "lo puedes entibiar suavemente", beats: [
    r(P("federer_bano_maria"), { at: "a baño maria", kicker: "Baño María suave · sin hervir" }),
    r(P("frasco_refri"), { at: "en el refrigerador" }),
  ]},
  // ░░ USO · NOCHE + PROTECTOR ░░
  { key: "uso", phrase: "cada noche la cara bien limpia", beats: [
    r(P("aplica_noche_cara"), { at: "una capa fina de tu gel" }),
    r(P("protector_solar_dia"), { at: "siempre protector solar" }),
    fc([{ t: "Constancia" }, { t: "de" }, { t: "noche" }, { t: "y" }, { t: "protector" }, { t: "de" }, { t: "día", hl: true }], { tone: "teal", at: "la formula completa" }),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch + bono) ░░
  { key: "guia3", phrase: "se llama la guia completa de la salud", beats: [
    c("chips", { bg: "image", image: "img/fe7_libro_ritual.png", imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["+150 remedios · $27", "BONUS: hoja de señales de alerta", "archivos-federer.vercel.app"] }),
    lt("El enlace está en la descripción", { kicker: "La guía completa", desc: "archivos-federer.vercel.app — complementa a tu médico.", tone: "teal", at: "archivos federer" }),
    r(P("hoja_alerta_espejo"), { at: "una hoja de señales de alerta" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "un repaso rapido", beats: [
    c("talk", {}),
    ge("La receta en 5 pasos (guardá esto)", [
      { text: "1 · Corta la penca de abajo, la más madura", image: `img/${P("penca_corte_gruesa")}.png` },
      { text: "2 · De cabeza 20 min: drena la aloína amarilla", image: `img/${P("penca_cabeza_vaso")}.png` },
      { text: "3 · Quita la cáscara: solo el gel transparente", image: `img/${P("filete_transparente")}.png` },
      { text: "4 · Mezcla: miel + una cápsula de vitamina E", image: `img/${P("mezcla_miel_vite")}.png` },
      { text: "5 · Cada noche; protector solar de día", image: `img/${P("aplica_noche_cara")}.png` },
    ], { at: "para que no se te olvide" }),
  ]},
  // ░░ CTA COMENTARIOS + COMPARTIR ░░
  { key: "cta_com", phrase: "cuentame en los comentarios", beats: [
    lt("¿Desde qué parte nos ves? ¿Tienes sábila en casa?", { kicker: "Contame abajo", desc: "Los leo todos, uno por uno.", tone: "teal", at: "de que parte de mexico" }),
  ]},
  { key: "cta_comparte", phrase: "comparte este video con esa persona", beats: [
    r(P("comparte_mujer_celular"), { at: "esa persona que amas" }),
    c("chips", { bg: "image", image: `img/${P("comparte_mujer_celular")}.png`, imageDarken: 0.6, title: "Compartilo con quien amás", chips: ["Su mamá, su esposa, una amiga", "Le cambias la piel y le alegras la vida"] }),
  ]},
  // ░░ TEASER + CIERRE ░░
  { key: "teaser", phrase: "en el proximo video", beats: [
    lt("Próximo video: la raíz que revive tu cabello", { kicker: "No te lo pierdas", desc: "Común, de mercado, frena la caída incluso después de los 60.", tone: "teal", at: "devuelve el brio al cabello" }),
  ]},
  { key: "close", phrase: "cuidate mucho quierete", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, remedios de siempre para después de los 60", image: `img/${P("federer_despide")}.png` }),
  ]},
];

// ── ANCLAJE POR FRASE ─────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || Object.values(CAPS)).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1164) + 2;

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

// ── POST-PASS MILIMÉTRICO ───────
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
  if (beat.at) delete beat.at;
}
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — beats (imágenes p_${SLUG}_*.png / dg_${SLUG}_*.png).\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — rangos talk.\n` +
  `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats }, null, 1));

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
if (miss.length) console.log("faltan:", miss.slice(0, 50).join(" "));
