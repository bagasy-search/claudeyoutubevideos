// gen_v3ffa7mrzcjw.mjs — beatsheet del video "9 señales de la piel" (Canal Federer Consejos).
// Avatar v3ffa7mrzcjw_opt.mp4 (~28.9min). Anclaje por FRASE a captions_v3ffa7mrzcjw.json.
// Look CLÍNICO teal. Imágenes gpt-image-2: p_v3ffa7mrzcjw_*.png + dg_v3ffa7mrzcjw_*.png.
// Kit _fed6 COMPLETO. 3 injertos de venta de la guía. Emite federer_v3ffa7mrzcjw_beats.ts + hooks.
import fs from "fs";
const SLUG = "v3ffa7mrzcjw";

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
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r(P("mujer_crema_hombro"), { at: "una mujer de 62 anos", kicker: "Casi no llega a tiempo" }),
    r(P("piel_macro_brazo"), { at: "casi dos anos cambiando de forma" }),
  ]},
  { key: "helo", phrase: "se me helo la sangre", beats: [
    fc([{ t: "Tu" }, { t: "piel" }, { t: "avisa" }, { t: "con" }, { t: "años", hl: true }, { t: "de" }, { t: "anticipación", hl: true }], { tone: "teal", at: "anos de anticipacion" }),
  ]},
  // ░░ PRESENTACIÓN CASERA ░░
  { key: "presenta", phrase: "soy el dr federer", beats: [
    c("nametag", { name: "Dr. Federer", role: "Salud clara para después de los 60", image: `img/${P("federer_consultorio")}.png` }),
    r(P("federer_cafe_cocina"), { at: "en la cocina de la casa" }),
  ]},
  { key: "promesa", phrase: "nueve senales que tu piel", beats: [
    c("chips", { bg: "image", image: `img/${P("autoexamen_espejo")}.png`, imageDarken: 0.6, title: "9 señales que tu piel usa para pedir ayuda", chips: ["Lunares · Llagas · Manchas", "Verrugas · Comezón · Color", "Uñas · Bultos"] }),
    ak([{ word: "LA NÚMERO 5", sub: "casi todos la confunden con algo inofensivo", tone: "warn", atPhrase: "la numero 5" }], {}),
  ]},
  // ░░ ENEMIGO ░░
  { key: "enemigo", phrase: "la industria de la belleza", beats: [
    mv("Cremas para tapar lo que la piel muestra", "Aprender a LEER tu piel es gratis", { flipPhrase: "un espejo es gratis" }),
    r(P("federer_muestra_brazo"), { at: "mirarte con atencion" }),
  ]},
  // ░░ NÚMEROS / CIENCIA ░░
  { key: "numeros", phrase: "el cancer de piel es el cancer", beats: [
    dg(D("cura_temprano"), "A tiempo se cura"),
    c("bars", { title: "Cáncer de piel detectado…", unit: "%", bars: [
      { label: "A tiempo (en la superficie)", value: 90, winner: true, note: "más de 9 de cada 10 se cura" },
      { label: "Tarde (ya se metió adentro)", value: 30, tone: "danger" } ] }),
  ]},
  { key: "tiempo", phrase: "es para darte tiempo", beats: [
    fc([{ t: "No" }, { t: "es" }, { t: "para" }, { t: "asustarte" }, { t: "es" }, { t: "para" }, { t: "darte" }, { t: "tiempo", hl: true }], { tone: "teal", at: "es para darte tiempo" }),
  ]},
  // ░░ HISTORIA HERMANA MARÍA JOSÉ ░░
  { key: "story_intro", phrase: "una historia que no es un cuento", beats: [
    c("talk", {}),
    r(P("mayo_quirofano_antiguo"), { at: "la famosa clinica mayo" }),
  ]},
  { key: "story_monja", phrase: "hermana maria jose", beats: [
    r(P("hermana_maria_jose"), { at: "hermana maria jose", kicker: "Clínica Mayo · principios del s. XX", hold: true }),
    r(P("hermana_maria_jose"), { at: "tocaba la piel de los pacientes" }),
  ]},
  { key: "story_nodulo", phrase: "cerca del ombligo", beats: [
    c("quote", { image: `img/${P("hermana_maria_jose")}.png`, text: "Un bulto duro cerca del ombligo… *un cáncer avanzado en el vientre.*" }),
    ak([{ word: "SOLO MIRABA", sub: "ojos, atención y las manos", tone: "teal", atPhrase: "solo tenia ojos" }], {}),
  ]},
  { key: "story_leccion", phrase: "revisar entero tu solo", beats: [
    c("headline", { tokens: ["La piel es el único órgano", { t: "que revisás entero", hl: true }, "vos solo, con un espejo"] }),
  ]},
  // ░░ MECANISMO ░░
  { key: "meca_intro", phrase: "por que la piel avisa antes", beats: [
    c("talk", {}),
    r(P("piel_macro_brazo"), { at: "se renueva completa" }),
  ]},
  { key: "meca_cambia", phrase: "un lunar que era plano", beats: [
    r(P("lunar_normal"), { at: "un color parejo se ensucia" }),
    r(P("lunar_asimetrico"), { at: "una costa rota" }),
    c("splitlist", { title: "El cambio es lento y silencioso", items: ["Empieza mucho antes del dolor", "La piel no duele: se VE", "El que mira, gana meses"], palette: "G" }),
  ]},
  { key: "meca_ancla", phrase: "milimetros y meses", beats: [
    fc([{ t: "Milímetros", hl: true }, { t: "y" }, { t: "meses", hl: true }], { tone: "teal", at: "milimetros y meses" }),
  ]},
  // ░░ INJERTO GUÍA #1 (suave, ~30%) ░░
  { key: "guia1", phrase: "los reuni todos en una guia", beats: [
    r(P("federer_guia_mano"), { at: "para tenerlos a la mano", hold: true }),
    lt("Todo esto, junto en mi guía", { kicker: "Si querés ir más a fondo", desc: "El enlace está abajo, en la descripción.", tone: "teal", at: "mas al ratito" }),
  ]},
  // ░░ PRE-SEÑALES ░░
  { key: "preselena", phrase: "empiezan las nueve senales", beats: [
    c("talk", {}),
  ]},
  // ░░ SEÑAL 1 · LUNAR QUE CAMBIA (ABCDE) ░░
  { key: "s1", phrase: "senal numero uno", beats: [
    es("01", "El lunar que cambia", { w: 3.6 }),
    r(P("lunar_normal"), { at: "no todos los lunares son peligrosos" }),
    ak([{ word: "REGLA ABCDE", sub: "una regla fácil para toda la vida", tone: "teal", atPhrase: "la regla del abecedario" }], {}),
    dg(D("abcde"), "Regla ABCDE"),
    r(P("lunar_asimetrico"), { at: "varios colores en el mismo lunar" }),
    fz(P("lunar_asimetrico"), { x: 0.5, y: 0.5, label: "E de Evolución = la reina", zoom: 1.6, tone: "warn", at: "la mas importante de todas" }),
  ]},
  // ░░ SEÑAL 2 · PATITO FEO ░░
  { key: "s2", phrase: "senal numero dos", beats: [
    es("02", "La regla del patito feo", { w: 3.6 }),
    dg(D("patito_feo"), "El patito feo"),
    r(P("espalda_lunares_patito"), { at: "el que no se parece a los demas" }),
    ak([{ word: "EL DIFERENTE", sub: "tu ojo detecta al que no encaja", tone: "teal", atPhrase: "este se ve raro" }], {}),
  ]},
  // ░░ SEÑAL 3 · LLAGA QUE NO CIERRA ░░
  { key: "s3", phrase: "senal numero 3", beats: [
    es("03", "La llaga que no cierra", { w: 3.6 }),
    r(P("llaga_nariz"), { at: "en la cara en la nariz" }),
    dg(D("llaga_mes"), "1 mes"),
    lt("Si no cierra en 1 mes, al médico", { kicker: "La regla de oro", desc: "Dejá las pomadas y las curitas. Mostrásela.", tone: "warn", at: "si una herida no cierra en un mes" }),
  ]},
  // ░░ SEÑAL 4 · ACANTOSIS ░░
  { key: "s4", phrase: "senal numero 4", beats: [
    es("04", "Manchas aterciopeladas en pliegues", { w: 3.8 }),
    r(P("cuello_aterciopelado"), { at: "en el cuello por la parte" }),
    ak([{ word: "ACANTOSIS", sub: "casi siempre: aviso temprano de azúcar alta", tone: "teal", atPhrase: "se llama acantosis nigricans" }], {}),
    dg(D("acantosis"), "Resistencia a la insulina"),
    lt("Si aparece de golpe, se consulta", { kicker: "Ojo", desc: "Rápido y en persona mayor delgada: alerta.", tone: "warn", at: "aparecen de golpe" }),
  ]},
  // ░░ SEÑAL 5 · LESER-TRÉLAT ░░
  { key: "s5", phrase: "senal numero 5", beats: [
    es("05", "Brote repentino de manchitas", { w: 3.8 }),
    r(P("verrugas_espalda"), { at: "muchas verrugas o manchitas" }),
    dg(D("leser_trelat"), "Signo de Leser-Trélat"),
    c("bars", { title: "¿Qué enciende la alarma?", unit: "", bars: [
      { label: "3-4 con los años", value: 25, note: "normal" },
      { label: "Muchas de golpe en meses", value: 100, tone: "danger", winner: true } ] }),
    fc([{ t: "La" }, { t: "velocidad", hl: true }, { t: "es" }, { t: "la" }, { t: "señal", hl: true }], { tone: "warn", at: "la velocidad es la senal" }),
  ]},
  // ░░ SEÑAL 6 · COMEZÓN ░░
  { key: "s6", phrase: "senal numero 6", beats: [
    es("06", "La comezón sin explicación", { w: 3.8 }),
    r(P("rasca_brazo_noche"), { at: "una comezon por todo el cuerpo" }),
    dg(D("comezon"), "Revisar por dentro"),
    ak([{ word: "SIN SARPULLIDO", sub: "por semanas y sobre todo de noche", tone: "teal", atPhrase: "en la sangre en el higado" }], {}),
    fc([{ t: "Rascarse" }, { t: "no" }, { t: "es" }, { t: "un" }, { t: "diagnóstico", hl: true }], { tone: "teal", at: "rascarse no es un diagnostico" }),
  ]},
  // ░░ SEÑAL 7 · ICTERICIA ░░
  { key: "s7", phrase: "senal numero 7", beats: [
    es("07", "El color amarillo (ictericia)", { w: 3.8 }),
    r(P("ojos_amarillos"), { at: "el blanco de los ojos" }),
    ak([{ word: "ICTERICIA", sub: "un médico jamás la ignora", tone: "warn", atPhrase: "se llama ictericia" }], {}),
    dg(D("ictericia"), "Hígado / páncreas"),
    fc([{ t: "Tu" }, { t: "color" }, { t: "te" }, { t: "avisa" }, { t: "antes" }, { t: "que" }, { t: "tu" }, { t: "dolor", hl: true }], { tone: "teal", at: "el pancreas" }),
  ]},
  // ░░ SEÑAL 8 · UÑA ░░
  { key: "s8", phrase: "senal numero 8", beats: [
    es("08", "Una rayita oscura en la uña", { w: 3.8 }),
    r(P("una_linea_oscura"), { at: "mira tus unas" }),
    dg(D("melanoniquia"), "Nueva y se ensancha"),
    ak([{ word: "10 SEGUNDOS", sub: "mirá tus uñas al cortártelas", tone: "teal", atPhrase: "10 segundos de mirada" }], {}),
  ]},
  // ░░ SEÑAL 9 · BULTITO PERLADO ░░
  { key: "s9", phrase: "senal numero 9", beats: [
    es("09", "El bultito perlado que no se va", { w: 3.8 }),
    r(P("bulto_perlado_nariz"), { at: "en la cara en la nariz en las mejillas" }),
    dg(D("basocelular"), "No se va en meses"),
    fc([{ t: "Un" }, { t: "grano" }, { t: "se" }, { t: "va" }, { t: "una" }, { t: "perla" }, { t: "se" }, { t: "revisa", hl: true }], { tone: "teal", at: "una perla que se queda meses" }),
  ]},
  // ░░ HONESTIDAD ░░
  { key: "honesto", phrase: "quiero ser completamente honesto", beats: [
    c("talk", {}),
    c("checklist", { title: "Sé honesto contigo", items: [
      { text: "Ninguna señal, sola, significa cáncer", state: "warn" },
      { text: "La mayoría de lunares y manchas son buenos", state: "done" },
      { text: "La piel avisa; el diagnóstico lo da el médico", state: "done" } ] }),
  ]},
  { key: "honesto2", phrase: "la piel te da un aviso", beats: [
    fc([{ t: "La" }, { t: "piel" }, { t: "no" }, { t: "diagnostica" }, { t: "avisa", hl: true }], { tone: "teal", at: "la piel te da un aviso" }),
  ]},
  // ░░ EL ERROR ░░
  { key: "error", phrase: "dejame decirte el error", beats: [
    es("!", "El error que arruina todo", { tone: "warn", w: 3.4 }),
    ak([{ word: "ESPERAR", sub: "“seguro no es nada”, “cuando tenga tiempo”", tone: "warn", atPhrase: "el error es esperar" }], {}),
    mv("El enemigo es el cáncer", "El enemigo es posponer y el miedo", { flipPhrase: "la costumbre de posponer" }),
    fc([{ t: "Saber" }, { t: "a" }, { t: "tiempo" }, { t: "es" }, { t: "lo" }, { t: "que" }, { t: "te" }, { t: "salva", hl: true }], { tone: "teal", at: "saber a tiempo es lo que te salva" }),
  ]},
  // ░░ INJERTO GUÍA #2 (~60%, antes de los pasos) ░░
  { key: "guia2", phrase: "mas de 150 remedios", beats: [
    c("chips", { bg: "image", image: "img/fe7_libro_ritual.png", imageDarken: 0.6, title: "La Guía Completa de la Salud +60", chips: ["+150 remedios y cuidados", "Señales de alerta para el espejo", "archivos-federer.vercel.app"] }),
    lt("Acompaña a tu médico, nunca lo reemplaza", { kicker: "Con el corazón", desc: "Es para tener todo junto y a la mano en casa.", tone: "teal", at: "nunca lo reemplaza" }),
  ]},
  // ░░ LOS 5 PASOS ░░
  { key: "pasos_intro", phrase: "que vas a hacer con todo esto", beats: [
    c("talk", {}),
  ]},
  { key: "paso1", phrase: "una vez al mes", beats: [
    r(P("autoexamen_espejo"), { at: "revisate de pies a cabeza" }),
    r(P("revisa_pie"), { at: "las plantas de los pies" }),
    c("process", { title: "El autoexamen", eyebrow: "1 vez al mes · 5 minutos", steps: [
      { title: "Buena luz", desc: "frente al espejo, sin ropa", image: `img/${P("autoexamen_espejo")}.png` },
      { title: "Todo el cuerpo", desc: "espalda, pies, uñas, cuero cabelludo", image: `img/${P("revisa_pie")}.png` },
      { title: "Compará", desc: "una foto con el teléfono", image: `img/${P("foto_celular_lunar")}.png` } ] }),
  ]},
  { key: "paso_abc", phrase: "aplicale el abecedario", beats: [
    dg(D("abcde"), "Aplicá el ABCDE"),
  ]},
  { key: "paso_patito", phrase: "busca al patito feo", beats: [
    dg(D("patito_feo"), "Buscá al patito feo"),
  ]},
  { key: "paso_foto", phrase: "sacale una foto", beats: [
    r(P("foto_celular_lunar"), { at: "sacale una foto con el telefono" }),
    lt("La foto es tu mejor amiga", { kicker: "Comparar", desc: "El cambio se ve comparando el antes y el después.", tone: "teal", at: "el cambio se ve comparando" }),
  ]},
  { key: "paso_sol", phrase: "cuidate del sol", beats: [
    r(P("sombrero_sombra"), { at: "un sombrero de ala ancha" }),
    fc([{ t: "El" }, { t: "sol" }, { t: "de" }, { t: "hoy" }, { t: "es" }, { t: "la" }, { t: "mancha" }, { t: "de" }, { t: "mañana", hl: true }], { tone: "teal", at: "la mancha de dentro de 10" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "repaso rapidito para que", beats: [
    c("talk", {}),
    ge("Las 9 señales (guardá esto)", [
      { text: "Lunar que cambia (ABCDE)", image: `img/${P("lunar_asimetrico")}.png` },
      { text: "El patito feo, el diferente", image: `img/${P("espalda_lunares_patito")}.png` },
      { text: "Llaga que no cierra en 1 mes", image: `img/${P("llaga_nariz")}.png` },
      { text: "Manchas aterciopeladas en pliegues", image: `img/${P("cuello_aterciopelado")}.png` },
      { text: "Brote repentino de manchitas", image: `img/${P("verrugas_espalda")}.png` },
      { text: "Comezón terca sin explicación", image: `img/${P("rasca_brazo_noche")}.png` },
      { text: "Color amarillo (ictericia)", image: `img/${P("ojos_amarillos")}.png` },
      { text: "Rayita oscura nueva en la uña", image: `img/${P("una_linea_oscura")}.png` },
      { text: "Bultito perlado que no se va", image: `img/${P("bulto_perlado_nariz")}.png` },
    ], { at: "para que no se te olvide" }),
  ]},
  // ░░ CIERRE EMOTIVO ░░
  { key: "cierre_monja", phrase: "esa monja enfermera", beats: [
    r(P("hermana_maria_jose"), { at: "mirar y tocar con cuidado", hold: true }),
    c("headline", { tokens: ["Tenés dos ojos, un espejo", { t: "y alguien a quien amás", hl: true }] }),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch completo + bono) ░░
  { key: "guia3", phrase: "la guia completa de la salud", beats: [
    r("fe7_libro_ritual", { at: "un cuadernito digital", hold: true }),
    c("chips", { bg: "image", image: "img/fe7_libro_ritual.png", imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["+150 remedios · $27", "BONUS: hoja de señales de alerta", "archivos-federer.vercel.app"] }),
    lt("El enlace está en la descripción", { kicker: "La guía completa", desc: "archivos-federer.vercel.app — complementa a tu médico.", tone: "teal", at: "archivos federer" }),
    r(P("hoja_alerta_espejo"), { at: "pegar en el espejo del bano" }),
  ]},
  // ░░ CTA COMENTARIOS + COMPARTIR ░░
  { key: "cta_com", phrase: "en los comentarios de que parte", beats: [
    lt("¿Desde qué parte nos ves? ¿Cuál no conocías?", { kicker: "Contame abajo", desc: "Los leo todos, uno por uno.", tone: "teal", at: "cual de estas nueve senales" }),
  ]},
  { key: "cta_comparte", phrase: "comparte este video con alguien", beats: [
    r(P("pareja_mayor_celular"), { at: "con alguien que amas" }),
    c("chips", { bg: "image", image: `img/${P("pareja_mayor_celular")}.png`, imageDarken: 0.6, title: "Compartilo con quien amás", chips: ["5 minutos frente al espejo", "pueden salvar una vida"] }),
  ]},
  // ░░ TEASER + CIERRE ░░
  { key: "teaser", phrase: "en el proximo video", beats: [
    lt("Próximo video: el desayuno que cuida tu piel", { kicker: "No te lo pierdas", desc: "Un alimento común que protege del sol desde adentro.", tone: "teal", at: "un escudo natural contra el sol" }),
  ]},
  { key: "close", phrase: "cuidate mucho mirate con carino", beats: [
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1730) + 2;

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
if (miss.length) console.log("faltan:", miss.slice(0, 40).join(" "));
