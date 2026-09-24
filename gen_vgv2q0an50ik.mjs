// gen_vgv2q0an50ik.mjs — beatsheet del video "El único superalimento que revierte la pérdida
// muscular después de los 60" (Canal Federer Consejos Salud). Avatar vgv2q0an50ik_opt.mp4 (~22.9min).
// Anclaje por FRASE a captions_vgv2q0an50ik.json. Look CLÍNICO teal. Imágenes gpt-image-2:
// p_vgv2q0an50ik_*.png + dg_vgv2q0an50ik_*.png. Kit _fed6 COMPLETO. 3 injertos de venta de la guía.
import fs from "fs";
const SLUG = "vgv2q0an50ik";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
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

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ HOOK — Don Ernesto ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r(P("abuelo_nieta"), { at: "poder cargar a su nieta", kicker: "Ya no podía cargarla" }),
    r(P("frasco_no_abre"), { at: "frascos que cuestan" }),
    r(P("escalon_alto"), { at: "un escalon que de repente" }),
  ]},
  // ░░ SARCOPENIA ░░
  { key: "sarcopenia", phrase: "se llama sarcopenia", beats: [
    dg(D("sarcopenia"), "Pérdida de músculo por década"),
    ak([{ word: "SARCOPENIA", sub: "sarco = carne · penia = pérdida", tone: "warn", atPhrase: "se llama sarcopenia" }], {}),
  ]},
  // ░░ STAKES — qué está en juego ░░
  { key: "stakes", phrase: "el musculo de tus piernas", beats: [
    r(P("abuelo_silla"), { at: "te levanta del sillon" }),
    c("splitlist", { title: "El músculo después de los 60 no es vanidad", items: ["Es levantarte del sillón solo", "Es abrir un frasco, cargar a un nieto", "Es libertad, no estética"], palette: "G" }),
    fc([{ t: "No" }, { t: "es" }, { t: "vanidad" }, { t: "es" }, { t: "libertad", hl: true }], { tone: "teal", at: "es libertad" }),
  ]},
  // ░░ LA PREGUNTA — las claras ░░
  { key: "pregunta", phrase: "comieras claras de huevo", beats: [
    r(P("separar_yema"), { at: "la dejaras de lado", kicker: "Lo que te dijeron que tiraras" }),
    ak([{ word: "LA YEMA", sub: "la parte que millones tiraron a la basura", tone: "warn", atPhrase: "tiraras al bote de la basura" }], {}),
  ]},
  // ░░ EL SUPERALIMENTO ░░
  { key: "superalimento", phrase: "es el huevo entero", beats: [
    c("nametag", { name: "Dr. Federer", role: "Salud clara para después de los 60", image: `img/${P("federer_consultorio")}.png` }),
    r(P("huevo_yema_bowl"), { at: "el huevo completo con su yema", hold: true }),
  ]},
  // ░░ VALOR BIOLÓGICO 100 ░░
  { key: "valor", phrase: "la proteina perfecta", beats: [
    c("bars", { title: "Valor biológico de la proteína", unit: "", bars: [
      { label: "Huevo entero", value: 100, winner: true, note: "el patrón de oro · nota 10" },
      { label: "Carne de res", value: 80 },
      { label: "Frijol", value: 50, tone: "danger" } ] }),
    dg(D("valor_biologico"), "El estándar de oro"),
  ]},
  // ░░ ENEMIGO — le declararon la guerra ░░
  { key: "enemigo", phrase: "le declararon la guerra", beats: [
    c("talk", {}),
    r(P("proteina_polvo"), { at: "botes gigantes de proteina", kicker: "El negocio del miedo" }),
  ]},
  { key: "mentiras", phrase: "gigantes de proteina", beats: [
    mv("Necesitas polvos caros para tener músculo", "La proteína perfecta cuesta dos pesos", { flipPhrase: "un huevo de dos pesos" }),
    c("chips", { bg: "image", image: `img/${P("proteina_polvo")}.png`, imageDarken: 0.6, title: "Dos mentiras al mismo tiempo", chips: ["La yema te tapa las arterias (falso)", "Solo los polvos dan músculo (falso)"] }),
  ]},
  // ░░ COLESTEROL — la ciencia ░░
  { key: "colesterol", phrase: "derribar la primera", beats: [
    dg(D("colesterol_higado"), "Tu hígado se regula solo"),
    c("stat", { big: "2015", unit: "", label: "Las guías oficiales quitaron el límite estricto al colesterol de la dieta", tone: "teal" }),
  ]},
  { key: "yema_disculpa", phrase: "a esa yema le debes", beats: [
    r(P("huevo_yema_bowl"), { at: "le debes una disculpa" }),
    c("headline", { tokens: ["Comer solo la clara es", { t: "comprar un coche y tirar el motor", hl: true }] }),
  ]},
  // ░░ MECANISMO — LEUCINA (el corazón) ░░
  { key: "leucina", phrase: "se llama leucina", beats: [
    c("talk", {}),
    dg(D("leucina"), "El interruptor del músculo"),
    ak([{ word: "LEUCINA", sub: "el interruptor que enciende la fábrica de músculo", tone: "teal", atPhrase: "se llama leucina" }], {}),
  ]},
  { key: "umbral", phrase: "el umbral de la leucina", beats: [
    fc([{ t: "Debajo" }, { t: "del" }, { t: "umbral" }, { t: "la" }, { t: "fábrica" }, { t: "no" }, { t: "arranca", hl: true }], { tone: "warn", at: "el umbral de la leucina" }),
  ]},
  // ░░ ESTUDIO ILLINOIS — huevo vs clara ░░
  { key: "illinois", phrase: "universidad de illinois", beats: [
    dg(D("huevo_vs_clara"), "Huevo entero vs clara"),
    c("bars", { title: "Músculo construido con la MISMA proteína", unit: "%", bars: [
      { label: "Huevo entero (con yema)", value: 100, winner: true, note: "+40% de síntesis muscular" },
      { label: "Solo la clara", value: 60, tone: "danger" } ] }),
    ap([{ word: "+40%", sub: "más músculo, con la misma proteína — la única diferencia era la yema", tone: "teal", atPhrase: "un cuarenta por ciento mas de musculo" }], {}),
  ]},
  { key: "porque_yema", phrase: "la yema no es grasa", beats: [
    c("splitlist", { title: "La yema no es grasa inútil", items: ["Trae vitaminas y grasas buenas", "Da la señal COMPLETA para usar la proteína", "La clara sola es media orden"], palette: "T" }),
  ]},
  // ░░ RESISTENCIA ANABÓLICA ░░
  { key: "resistencia", phrase: "resistencia anabolica", beats: [
    dg(D("resistencia"), "La fábrica se pone sorda"),
    ak([{ word: "RESISTENCIA ANABÓLICA", sub: "a los 60 tu músculo necesita que le grites más fuerte", tone: "warn", atPhrase: "se llama resistencia anabolica" }], {}),
    fc([{ t: "Más" }, { t: "años" }, { t: "más" }, { t: "leucina" }, { t: "necesitas", hl: true }], { tone: "teal", at: "necesita mas leucina" }),
  ]},
  // ░░ BENEFICIO 1 (+ injerto guía #1) ░░
  { key: "beneficio1", phrase: "reconstruyes musculo", beats: [
    es("01", "Reconstruyes músculo directamente", { w: 3.4 }),
    r(P("abuelo_bolsas"), { at: "fuerza en las piernas" }),
    lt("Todo esto, junto en mi guía", { kicker: "Si querés ir más a fondo", desc: "El enlace está abajo, en la descripción.", tone: "teal", at: "recuperas fuerza en las piernas" }),
  ]},
  // ░░ BENEFICIO 2 — huesos ░░
  { key: "beneficio2", phrase: "proteges tus huesos", beats: [
    es("02", "Proteges tus huesos con el músculo", { w: 3.4 }),
    dg(D("huesos"), "Músculo + vitamina D"),
    r(P("desayuno_huevos"), { at: "la yema ademas trae vitamina d" }),
  ]},
  // ░░ BENEFICIO 3 — cerebro / colina ░░
  { key: "beneficio3", phrase: "cuida tu cerebro", beats: [
    es("03", "Cuida tu cerebro y tu memoria", { w: 3.4 }),
    dg(D("colina"), "Colina → neuronas"),
    r(P("abuelo_lee"), { at: "y la colina es materia" }),
    fc([{ t: "Fuerza" }, { t: "en" }, { t: "el" }, { t: "cuerpo" }, { t: "luz" }, { t: "en" }, { t: "la" }, { t: "mente", hl: true }], { tone: "teal", at: "luz en la mente" }),
  ]},
  // ░░ EL CÓMO — PASO 1 ░░
  { key: "como_intro", phrase: "viniste a buscar", beats: [
    c("talk", {}),
  ]},
  { key: "paso1", phrase: "apunta a comer", beats: [
    es("!", "Paso 1 · La cantidad", { tone: "teal", w: 3.0 }),
    r(P("huevo_sarten"), { at: "dos y tres huevos enteros" }),
    c("callout", { title: "2 a 3 huevos enteros en el desayuno", desc: "Con la yema, sin miedo. La mayoría desayuna pura harina y no manda ni una señal al músculo.", tone: "teal" }),
  ]},
  // ░░ PASO 2 — la compañía ░░
  { key: "paso2", phrase: "el huevo se potencia", beats: [
    r(P("frijol_queso_leche"), { at: "un poco de frijol un pedazo de queso" }),
    c("process", { title: "El plato completo", eyebrow: "Barato, del mercado", steps: [
      { title: "El huevo entero", desc: "2-3, con la yema", image: `img/${P("huevo_yema_bowl")}.png` },
      { title: "Más proteína", desc: "frijol, queso fresco o leche", image: `img/${P("frijol_queso_leche")}.png` },
      { title: "Color", desc: "jitomate, nopal, espinaca", image: `img/${P("desayuno_huevos")}.png` } ] }),
  ]},
  // ░░ NÚMERO — g por kilo ░░
  { key: "gramos", phrase: "por cada kilo de peso", beats: [
    dg(D("gramos_kilo"), "1 a 1.2 g por kilo"),
    c("bars", { title: "Ejemplo: persona de 70 kg", unit: "g", bars: [
      { label: "Desayuno · 3 huevos enteros", value: 30, winner: true },
      { label: "Comida · palma de carne/pescado", value: 35 },
      { label: "Cena · frijol con queso o leche", value: 25 } ] }),
  ]},
  // ░░ OBJECIÓN RESUELTA ░░
  { key: "objecion", phrase: "yo desayuno huevo", beats: [
    mv("Un huevo al día ya alcanza", "Necesitas 2-3 de una vez para cruzar el umbral", { flipPhrase: "para cruzar el umbral" }),
    fc([{ t: "Un" }, { t: "huevo" }, { t: "no" }, { t: "prende" }, { t: "la" }, { t: "fábrica", hl: true }], { tone: "warn", at: "un solo huevo no alcanza" }),
  ]},
  // ░░ PASO 3 — repartir (+ injerto guía #2) ░░
  { key: "paso3", phrase: "reparte la proteina", beats: [
    es("!", "Paso 3 · Repartí la proteína", { tone: "teal", w: 3.0 }),
    c("splitlist", { title: "Tres señales al día > una sola", items: ["Huevo en el desayuno (prende temprano)", "Proteína al mediodía", "Algo ligero en la cena"], palette: "T" }),
    lt("Lo tengo ordenado en mi guía", { kicker: "Para tener todo a la mano", desc: "El enlace está en la descripción.", tone: "teal", at: "tres senales al dia" }),
  ]},
  // ░░ LÍMITES HONESTOS ░░
  { key: "limites", phrase: "honesto contigo sobre los limites", beats: [
    c("talk", {}),
    c("checklist", { title: "Con toda honestidad", items: [
      { text: "El huevo no es magia sin movimiento", state: "warn" },
      { text: "La comida enciende; el músculo trabaja al usarlo", state: "done" },
      { text: "Levantarte, caminar, cargar tus bolsas", state: "done" } ] }),
  ]},
  { key: "movimiento", phrase: "pero no es magia", beats: [
    r(P("abuelo_camina_bolsas"), { at: "cargar tus propias bolsas" }),
    fc([{ t: "Una" }, { t: "sola" }, { t: "mano" }, { t: "no" }, { t: "aplaude", hl: true }], { tone: "teal", at: "una sola mano no aplaude" }),
  ]},
  { key: "limite2", phrase: "segundo limite honesto", beats: [
    lt("Si tienes una condición, habla con tu médico", { kicker: "Escudo de honestidad", desc: "Esto complementa a tu doctor, nunca lo reemplaza.", tone: "warn", at: "habla con el antes de cambiar" }),
  ]},
  // ░░ EL ERROR (pago del loop grande) ░░
  { key: "error_intro", phrase: "la parte que te prometi", beats: [
    es("!", "El error que arruina todo", { tone: "warn", w: 3.6 }),
  ]},
  { key: "error", phrase: "al umbral en ninguna", beats: [
    ak([{ word: "PROTEÍNA GOTEADA", sub: "comes de a poco y nunca cruzas el umbral en ninguna comida", tone: "warn", atPhrase: "no llegar al umbral en ninguna" }], {}),
    c("quote", { image: `img/${P("desayuno_huevos")}.png`, text: "Galleta con café. Sopa y tortilla. Pan con té. *Nunca prende la fábrica ni una sola vez.*" }),
  ]},
  { key: "fogata", phrase: "una ramita cada hora", beats: [
    fz(P("huevo_sarten"), { x: 0.5, y: 0.5, label: "Junta la leña de una vez", zoom: 1.5, tone: "warn", at: "juntar suficiente lena" }),
  ]},
  { key: "goteada", phrase: "proteina goteada", beats: [
    fc([{ t: "Deja" }, { t: "de" }, { t: "gotear" }, { t: "concéntrala", hl: true }], { tone: "teal", at: "concentrala enciende la fabrica" }),
  ]},
  // ░░ DOS ERRORES MÁS — yema + crudo ░░
  { key: "errores_mas", phrase: "dos errores mas", beats: [
    dg(D("cocido_crudo"), "Cocido vs crudo"),
    c("bars", { title: "Proteína que tu cuerpo aprovecha", unit: "%", bars: [
      { label: "Huevo cocido", value: 91, winner: true, note: "cocínalo bien, sin quemarlo" },
      { label: "Huevo crudo", value: 50, tone: "danger" } ] }),
    ak([{ word: "NUNCA TIRES LA YEMA", sub: "y cocínalo — crudo apenas aprovechas la mitad", tone: "teal", atPhrase: "el huevo cocido te entrega" }], {}),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch completo) ░░
  { key: "guia3", phrase: "la guia completa de la salud", beats: [
    r(P("federer_guia"), { at: "reunido ordenado y explicado", hold: true }),
    c("chips", { bg: "image", image: `img/${P("federer_guia")}.png`, imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["+150 remedios y planes · $27", "El umbral y cómo repartir la proteína", "archivos-federer.vercel.app"] }),
    lt("El enlace está en la descripción", { kicker: "Un regalo, no una obligación", desc: "archivos-federer.vercel.app — complementa a tu médico.", tone: "teal", at: "un regalo para quien quiera" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "hagamos juntos el recap", beats: [
    c("talk", {}),
    ge("Empieza mañana mismo", [
      { text: "Huevo entero, con su yema, sin miedo", image: `img/${P("huevo_yema_bowl")}.png` },
      { text: "Concentrá la proteína: 2-3 en el desayuno", image: `img/${P("huevo_sarten")}.png` },
      { text: "Movete: levantate, caminá, cargá tus bolsas", image: `img/${P("abuelo_camina_bolsas")}.png` },
    ], { at: "en tres pasos que puedes empezar" }),
  ]},
  { key: "resultado", phrase: "en pocas semanas vas a notar", beats: [
    r(P("abuelo_nieto_final"), { at: "como cargas a tus nietos", hold: true }),
    c("headline", { tokens: ["En pocas semanas:", { t: "te levantás, cargás, abrís ese frasco", hl: true }] }),
  ]},
  // ░░ CTA COMENTARIOS + COMPARTIR ░░
  { key: "cta_com", phrase: "quiero pedirte un favor", beats: [
    lt("¿Desde qué parte de México nos ves?", { kicker: "Contame abajo", desc: "¿Cuántas veces tiraste la yema creyendo que hacías bien? Los leo todos.", tone: "teal", at: "de que parte de mexico" }),
  ]},
  { key: "comparte", phrase: "comparte este video con alguien", beats: [
    r(P("pareja_desayuno"), { at: "con alguien que amas" }),
    c("chips", { bg: "image", image: `img/${P("pareja_desayuno")}.png`, imageDarken: 0.6, title: "Compartilo con quien amás", chips: ["Un huevo de dos pesos", "puede devolverle su fuerza"] }),
  ]},
  // ░░ TEASER + CIERRE ░░
  { key: "teaser", phrase: "quedate pendiente", beats: [
    lt("Próximo video: una raíz del mercado", { kicker: "No te lo pierdas", desc: "Una bebida caliente que ayuda a aprovechar esta proteína.", tone: "teal", at: "una sola raiz" }),
  ]},
  { key: "close", phrase: "gracias por acompanarme hasta el final", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Cada semana, salud clara para después de los 60", image: `img/${P("federer_despide")}.png` }),
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1370) + 2;

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
if (miss.length) console.log("faltan:", [...need].filter((p) => !fs.existsSync("public/" + p)).slice(0, 50).join(" "));
