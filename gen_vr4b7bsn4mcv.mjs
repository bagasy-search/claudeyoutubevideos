// gen_vr4b7bsn4mcv.mjs — beatsheet "Truco NOCTURNO del ROMERO" (Canal Federer Consejos Salud).
// Avatar vr4b7bsn4mcv_opt.mp4 (~23.6min). Anclaje por FRASE a captions_vr4b7bsn4mcv.json.
// Look CLÍNICO teal. Imágenes gpt-image-2: p_vr4b7bsn4mcv_*.png + dg_vr4b7bsn4mcv_*.png.
// Kit _fed6 COMPLETO. 3 injertos de venta del Método Piel Joven. Emite *_beats.ts + *_hooks.ts.
import fs from "fs";
const SLUG = "vr4b7bsn4mcv";

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
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const P = (n) => `p_${SLUG}_${n}`;
const D = (n) => `dg_${SLUG}_${n}`;

const SECTIONS = [
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r(P("romero_macro"), { at: "una hojita verde que crece", kicker: "Crece gratis en tu patio" }),
    r(P("mujer_espejo_noche"), { at: "borrar las manchas de" }),
  ]},
  { key: "momento", phrase: "el momento en que te lo", beats: [
    r(P("romero_pollo"), { at: "el mismo romero que le echas" }),
    fc([{ t: "El" }, { t: "momento" }, { t: "importa" }, { t: "más" }, { t: "que" }, { t: "el" }, { t: "romero", hl: true }], { tone: "teal", at: "importa mas que el romero" }),
  ]},
  { key: "truco", phrase: "por eso lo llaman el truco", beats: [
    ak([{ word: "EL TRUCO NOCTURNO", sub: "de día casi no sirve", tone: "teal", atPhrase: "por eso lo llaman el truco" }], {}),
  ]},
  { key: "roadmap", phrase: "quedate conmigo hasta el final", beats: [
    c("chips", { bg: "image", image: `img/${P("aceite_verde_frasco")}.png`, imageDarken: 0.6, title: "Lo que vas a llevarte", chips: ["Cómo se prepara (paso a paso)", "Los 5 beneficios reales", "El ERROR que arruina todo"] }),
  ]},
  { key: "mito_tease", phrase: "desmentir un mito que seguramente", beats: [
    r(P("limon_cara"), { at: "un mito que seguramente" }),
  ]},
  // ░░ HISTORIA / ANCLAS HISTÓRICAS ░░
  { key: "egipto", phrase: "tumbas del antiguo egipto", beats: [
    c("talk", {}),
    r(P("egipto_tumba"), { at: "ramitas de romero colocadas", kicker: "Egipto lo usaba para preservar", hold: true }),
  ]},
  { key: "dioscorides", phrase: "un medico griego llamado", beats: [
    r(P("dioscorides"), { at: "libros de medicina de la humanidad", hold: true }),
    c("quote", { image: `img/${P("dioscorides")}.png`, text: "Una planta *que despierta, que aclara, que devuelve la vida.*" }),
  ]},
  { key: "ladrones", phrase: "el vinagre de los cuatro ladrones", beats: [
    r(P("vinagre_ladrones"), { at: "el vinagre de los cuatro", kicker: "El ingrediente principal: romero", hold: true }),
    ak([{ word: "EL ROMERO", sub: "protegía la piel y el cuerpo", tone: "teal", atPhrase: "cual era el ingrediente principal" }], {}),
  ]},
  { key: "mediterraneo", phrase: "en los pueblos del mediterraneo", beats: [
    r(P("abuela_mediterraneo"), { at: "con aceite de" }),
    fc([{ t: "A" }, { t: "los" }, { t: "80" }, { t: "una" }, { t: "piel" }, { t: "que" }, { t: "muchas" }, { t: "envidiarían", hl: true }], { tone: "teal", at: "que muchas de" }),
  ]},
  // ░░ ENEMIGO ░░
  { key: "enemigo_q", phrase: "por que nadie te lo vende", beats: [
    r(P("crema_cara_farmacia"), { at: "un frasquito de crema" }),
    mv("La crema TAPA la mancha cada mes", "El romero la TRABAJA desde tu cocina", { flipPhrase: "vive de que vuelvas cada mes" }),
  ]},
  { key: "enemigo", phrase: "la industria cosmetica no vive", beats: [
    ak([{ word: "TE VENDEN DE A POCO", sub: "esperanza en frascos carísimos", tone: "warn", atPhrase: "por eso te venden esperanza" }], {}),
    r(P("federer_prepara"), { at: "hacer tu propio aceite de" }),
  ]},
  // ░░ MECANISMO ░░
  { key: "meca_intro", phrase: "por que el romero funciona", beats: [
    c("talk", {}),
    r(P("rostro_mancha_mejilla"), { at: "unas células que fabrican el color" }),
  ]},
  { key: "tirosinasa", phrase: "una enzima que se llama", beats: [
    dg(D("tirosinasa"), "La fábrica del pigmento"),
    ak([{ word: "TIROSINASA", sub: "la fábrica del color de tu piel", tone: "teal", atPhrase: "imaginatela como una imprenta" }], {}),
  ]},
  { key: "melasma", phrase: "asi nace la mancha", beats: [
    c("annotated", { eyebrow: "Dónde aparece el melasma", caption: "La sombra café que siempre se asoma", image: `img/${P("rostro_mancha_mejilla")}.png`, annotations: [
      { label: "Mejillas", x: 40, y: 45 }, { label: "Labio de arriba", x: 55, y: 62 }, { label: "Frente", x: 50, y: 22 } ] }),
  ]},
  { key: "compuestos", phrase: "unos compuestos con nombres raros", beats: [
    dg(D("compuestos"), "Lo que trae el romero"),
    ak([{ word: "LE PONEN FRENO", sub: "calman la fábrica de la mancha", tone: "teal", atPhrase: "le ponen freno a esa" }], {}),
  ]},
  // ░░ POR QUÉ DE NOCHE (mecanismo nocturno) ░░
  { key: "noche", phrase: "es justo de noche cuando tu piel", beats: [
    dg(D("noche"), "Por qué de noche"),
    c("bars", { title: "Reparación de la piel", unit: "×", bars: [
      { label: "De día (a la defensiva)", value: 1 },
      { label: "De noche (reparando)", value: 2, winner: true, note: "el doble de velocidad" } ] }),
    c("callout", { image: `img/${P("mujer_espejo_noche")}.png`, figure: "Absorbe mejor de noche", caption: "Sus puertas quedan más abiertas mientras duermes." }),
  ]},
  { key: "momento2", phrase: "el momento importa mas que", beats: [
    fc([{ t: "De" }, { t: "noche" }, { t: "trabaja" }, { t: "contigo" }, { t: "8" }, { t: "horas", hl: true }], { tone: "teal", at: "durante 8 horas seguidas" }),
  ]},
  // ░░ INJERTO GUÍA #1 (~30%) ░░
  { key: "guia1", phrase: "las cantidades exactas y las proporciones", beats: [
    r(P("federer_guia_mano"), { at: "en mi guía el método", hold: true }),
    lt("Todo esto, medido en mi Método Piel Joven", { kicker: "Si querés ir más a fondo", desc: "El enlace está abajo, en la descripción.", tone: "teal", at: "con el enlace" }),
  ]},
  // ░░ BENEFICIOS ░░
  { key: "ben_intro", phrase: "vamos a los beneficios concretos", beats: [
    c("talk", {}),
    ak([{ word: "AGUANTÁ HASTA EL 3", sub: "la mayoría ni se lo imagina", tone: "warn", atPhrase: "aguantes hasta el" }], {}),
    c("splitlist", { title: "Los 5 beneficios del truco nocturno", items: ["Aclara manchas y melasma", "Repara el daño del día", "Reafirma (colágeno)", "Calma la inflamación", "Piel más luminosa"], palette: "G" }),
  ]},
  { key: "ben1", phrase: "beneficio numero 1 aclara", beats: [
    es("01", "Aclara las manchas y el melasma", { w: 3.6 }),
    r(P("rostro_mancha_mejilla"), { at: "empieza a perder fuerza" }),
    r(P("mujer_luminosa_manana"), { at: "ya no la ves como antes" }),
    lt("“Su nieta le preguntó si se había hecho algo”", { kicker: "Una paciente, 2 meses", desc: "Valió más que cualquier crema cara.", tone: "teal", at: "me dijo que despues de dos meses" }),
  ]},
  { key: "ben2", phrase: "beneficio numero 2 repara", beats: [
    es("02", "Repara el daño del día mientras duermes", { w: 3.8 }),
    dg(D("antioxidante"), "Antioxidante nocturno"),
    r(P("mujer_espejo_noche"), { at: "esos compuestos salen a" }),
    fc([{ t: "Antioxidante" }, { t: "de" }, { t: "los" }, { t: "más" }, { t: "potentes", hl: true }], { tone: "teal", at: "antioxidantes naturales mas" }),
  ]},
  { key: "ben3", phrase: "beneficio numero 3 y aqui", beats: [
    es("03", "Además de aclarar, REAFIRMA", { w: 3.8 }),
    r(P("federer_muestra_frasco"), { at: "también reafirma" }),
  ]},
  // (la PIZARRA FedWhiteboard cubre el mecanismo del colágeno ~561-604, hardcodeada en el Main)
  { key: "ben4", phrase: "una piel inflamada irritada", beats: [
    es("04", "Calma la inflamación y la rojez", { w: 3.8 }),
    r(P("rostro_mancha_mejilla"), { at: "calma la piel sensible" }),
    fc([{ t: "Calmar" }, { t: "también" }, { t: "aclara", hl: true }], { tone: "teal", at: "calmar tambien aclara" }),
  ]},
  { key: "ben5", phrase: "beneficio numero 5 mejora", beats: [
    es("05", "Mejora la circulación: piel luminosa", { w: 3.8 }),
    r(P("golpecitos_cara"), { at: "ese masajito suave" }),
    r(P("mujer_luminosa_manana"), { at: "mas luminosa por las mañanas" }),
  ]},
  // ░░ MITO DEL LIMÓN ░░
  { key: "mito_limon", phrase: "para las manchas hay que ponerse", beats: [
    mv("El limón aclara las manchas", "El limón + sol QUEMA y las empeora", { flipPhrase: "el jugo de limon con el sol" }),
    c("callout", { image: `img/${P("quemadura_limon")}.png`, figure: "FOTOTÓXICO", caption: "Con el sol, el limón quema y mancha más.", at: "quema la piel y dispara" }),
    ak([{ word: "FOTOTÓXICO", sub: "olvidate del limón en la cara", tone: "warn", atPhrase: "olvidate del limon en la" }], {}),
  ]},
  // ░░ INJERTO GUÍA #2 (~60%) ░░
  { key: "guia2", phrase: "mas recetas nocturnas para las manos", beats: [
    c("chips", { bg: "image", image: `img/${P("libro_receta")}.png`, imageDarken: 0.55, title: "El Método Piel Joven", chips: ["Cantidades exactas de todo", "Recetas para manos, cuello y escote", "metodo-piel-joven.vercel.app"] }),
  ]},
  // ░░ EL ERROR ░░
  { key: "error", phrase: "aqui viene el error que te prometi", beats: [
    es("!", "El error que arruina el 90%", { tone: "warn", w: 3.6 }),
    c("bars", { title: "Por qué “a mí no me funcionó”", unit: "%", bars: [
      { label: "Bien hecho (de noche, diluido)", value: 100, winner: true, note: "funciona" },
      { label: "Mal hecho (puro / de día / con limón)", value: 10, tone: "danger" } ] }),
  ]},
  { key: "error1", phrase: "es agarrar aceite esencial de romero", beats: [
    ak([{ word: "NUNCA PURO", sub: "el esencial concentrado te quema", tone: "warn", atPhrase: "ponertelo puro directo en la" }], {}),
    r(P("frasco_oscuro"), { at: "va diluido en otro" }),
  ]},
  { key: "error2", phrase: "es hervir el romero a fuego", beats: [
    dg(D("bano_maria"), "El calor correcto"),
    r(P("bano_maria"), { at: "a baño maría" }),
  ]},
  { key: "error3", phrase: "salir de dia sin proteccion", beats: [
    r(P("protector_solar"), { at: "sin protección solar" }),
    dg(D("ritual"), "La regla de oro"),
  ]},
  { key: "regla_oro", phrase: "romero de noche protector solar de dia", beats: [
    fc([{ t: "Romero" }, { t: "de" }, { t: "noche" }, { t: "protector" }, { t: "de" }, { t: "día", hl: true }], { tone: "teal", at: "los dos juntos siempre" }),
  ]},
  // ░░ LA RECETA ░░
  { key: "receta_intro", phrase: "ahora si la receta", beats: [
    c("talk", {}),
  ]},
  { key: "ingredientes", phrase: "vas a necesitar romero de preferencia", beats: [
    r(P("romero_fresco_lavado"), { at: "bien lavado y muy bien seco" }),
    c("splitlist", { title: "Aceite base (elegí uno)", items: ["Oliva extra virgen", "Almendras dulces", "Jojoba (el rey para la cara)"], palette: "G", at: "un aceite base suave" }),
    r(P("aceites_base"), { at: "aceite de oliva extravirgen" }),
    c("process", { title: "Preparalo en casa", eyebrow: "Baño María · 30-40 min", steps: [
      { title: "Romero + aceite", desc: "en un frasco de vidrio limpio", image: `img/${P("aceite_verde_frasco")}.png` },
      { title: "Baño María", desc: "fuego muy bajo, sin hervir", image: `img/${P("bano_maria")}.png` },
      { title: "Colar y guardar", desc: "en vidrio oscuro + vitamina E", image: `img/${P("colar_aceite")}.png` } ] }),
  ]},
  { key: "bano_maria", phrase: "ahora a bano maria", beats: [
    r(P("bano_maria"), { at: "calienta a fuego muy bajo", hold: true }),
    fc([{ t: "Calor" }, { t: "suave" }, { t: "los" }, { t: "saca" }, { t: "calor" }, { t: "fuerte" }, { t: "los" }, { t: "mata", hl: true }], { tone: "teal", at: "empieza a oler a bosque" }),
  ]},
  { key: "colar", phrase: "apaga el fuego deja que se entibie", beats: [
    r(P("colar_aceite"), { at: "cuela el aceite con una tela" }),
  ]},
  { key: "guardar", phrase: "guardalo en un frasco de vidrio", beats: [
    r(P("frasco_oscuro"), { at: "frasco de vidrio oscuro" }),
    r(P("vitamina_e"), { at: "unas gotitas de vitamina" }),
  ]},
  { key: "plus", phrase: "puedes infusionar el romero junto", beats: [
    r(P("te_verde_seco"), { at: "un poquito de té verde" }),
  ]},
  { key: "como_usa", phrase: "como se usa muy facil", beats: [
    c("talk", {}),
    r(P("aplicar_noche"), { at: "dos o tres gotitas" }),
  ]},
  { key: "golpecitos", phrase: "pequenos golpecitos suaves sobre la mancha", beats: [
    r(P("golpecitos_cara"), { at: "golpecitos suaves sobre la mancha" }),
    lt("Golpecitos suaves, siempre hacia arriba", { kicker: "Con cariño", desc: "La piel de la cara es fina: yema, no uña.", tone: "teal", at: "se trata con la yema" }),
  ]},
  { key: "ritual", phrase: "ese es el ritual completo", beats: [
    r(P("protector_solar"), { at: "y encima tu protector solar" }),
    ge("El ritual, todas las noches", [
      { text: "Cara limpia y seca", image: `img/${P("lavar_cara_manana")}.png` },
      { text: "Romero: golpecitos suaves", image: `img/${P("aplicar_noche")}.png` },
      { text: "En la mañana: lavar + protector solar", image: `img/${P("protector_solar")}.png` },
    ], { at: "todas las noches todos los" }),
  ]},
  // ░░ HONESTIDAD ░░
  { key: "honesto", phrase: "dejame ser honesto contigo", beats: [
    c("talk", {}),
    c("checklist", { title: "Sé honesto contigo", items: [
      { text: "No es magia de una noche", state: "warn" },
      { text: "Cambios reales: entre 6 y 8 semanas", state: "done" },
      { text: "La piel se renueva a su ritmo", state: "done" } ] }),
  ]},
  { key: "semanas", phrase: "empezar a notar cambios entre las", beats: [
    c("stat", { eyebrow: "Con constancia, todas las noches", value: 8, prefix: "6–", suffix: " semanas", label: "para ver cambios reales · la paciencia es el secreto" }),
  ]},
  { key: "embarazo", phrase: "si estas embarazada o dando pecho", beats: [
    lt("Embarazo / lactancia: consultá antes", { kicker: "Cuidado", desc: "Nada de aceite esencial. Y siempre una prueba en el brazo.", tone: "warn", at: "consulta a tu medico antes" }),
  ]},
  { key: "dermatologo", phrase: "si tu mancha cambia de forma", beats: [
    r(P("rostro_mancha_mejilla"), { at: "si tu mancha cambia de" }),
    lt("Cambia, crece, sangra o pica: al dermatólogo", { kicker: "Esto ya no es romero", desc: "El remedio acompaña al médico, no lo reemplaza.", tone: "warn", at: "eso ya no es cosa de" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "dejame recapitularte todo", beats: [
    c("talk", {}),
    ge("El truco nocturno (guardá esto)", [
      { text: "Frena la fábrica del pigmento", image: `img/${D("tirosinasa")}.png` },
      { text: "De noche la piel se repara al doble", image: `img/${P("mujer_espejo_noche")}.png` },
      { text: "Aclara Y reafirma (colágeno)", image: `img/${P("mujer_luminosa_manana")}.png` },
      { text: "Nada de limón ni esencial puro", image: `img/${P("quemadura_limon")}.png` },
      { text: "Baño María, fuego bajo", image: `img/${P("bano_maria")}.png` },
      { text: "Romero de noche, protector de día", image: `img/${P("protector_solar")}.png` },
      { text: "Paciencia: 6 a 8 semanas", image: `img/${D("semanas")}.png` },
    ], { at: "para que no se te olvide" }),
  ]},
  // ░░ CTA COMENTARIOS + COMPARTIR ░░
  { key: "cta_com", phrase: "cuentame aqui abajo en los comentarios", beats: [
    lt("¿Desde qué parte de México o LATAM me ves?", { kicker: "Contame abajo", desc: "Los leo todos, uno por uno.", tone: "teal", at: "de america latina me estas" }),
  ]},
  { key: "comparte", phrase: "comparte este video con ella", beats: [
    r(P("pareja_mayor_celular"), { at: "con alguien que amas" }),
    c("chips", { bg: "image", image: `img/${P("pareja_mayor_celular")}.png`, imageDarken: 0.6, title: "Compartilo con quien amás", chips: ["Puede devolverle la confianza", "y la sonrisa"] }),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch completo) ░░
  { key: "guia3", phrase: "ahi abajo te dejo mi metodo", beats: [
    r(P("libro_receta"), { at: "todo el sistema", hold: true }),
    c("chips", { bg: "image", image: `img/${P("libro_receta")}.png`, imageDarken: 0.55, title: "El Método Piel Joven — $17", chips: ["Manchas · arrugas · manos · cuello", "Planes de 21 días + garantía 7 días", "metodo-piel-joven.vercel.app"] }),
  ]},
  { key: "guia3b", phrase: "un solo pago sin", beats: [
    lt("Un solo pago · 7 días de garantía", { kicker: "Sin letra chica", desc: "metodo-piel-joven.vercel.app — complementa a tu médico.", tone: "teal", at: "garantia completa" }),
  ]},
  // ░░ TEASER + CIERRE ░░
  { key: "teaser", phrase: "en el proximo video te voy", beats: [
    r(P("dorso_manos_manchas"), { at: "en el dorso de las manos" }),
    lt("Próximo video: las manchas del dorso de las manos", { kicker: "No te lo pierdas", desc: "Un ingrediente blanco y humilde de tu cocina.", tone: "teal", at: "blanco y humilde" }),
  ]},
  { key: "close", phrase: "cuidate mucho cuida esa", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, salud clara para tu piel", image: `img/${P("federer_despide")}.png` }),
  ]},
];

// ── ANCLAJE POR FRASE ─────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1418) + 2;

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
  if (beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const GAP = 90;
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    beat.dur = +(last / 30 + 2.8).toFixed(2);
    beat.clip = `avatar_clips/${SLUG}/${beat.id}.mp4`;
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

// ── PISO DE DURACIÓN de componentes ──
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
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", clipsfirst: true, beats }, null, 1));

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
if (miss.length) console.log("faltan:", miss.slice(0, 40).join(" "));
