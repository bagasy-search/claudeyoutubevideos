// gen_federer17.mjs — beatsheet federer17 (Federer Archivos · ROMERO NOCTURNO · piel +60).
// "El Truco Nocturno del ROMERO": la piel se repara DE NOCHE; el romero de noche potencia
// ese "taller nocturno". Personaje Doña Herminia (79) vs contraste Doña Ligia (64).
// Avatar federer17_opt.mp4. MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer17.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
// hero→imagen shock, bignum→stat, diagram→dg; los "broll" del director → min1_broll (b-roll denso).
// Resto (65s→fin) = secciones ancladas VERBATIM al transcript, eje NOCHE (intro Herminia/rodilla/79,
// por qué la noche/taller, antiox/circulación, honestidad, contraste Ligia, receta+ritual, sol 80%,
// piernas/pelo, primera noche paso a paso, 3 secretos, CTAs drfederer.com, cierre nametag).
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer17.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe17_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe17_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones ancladas VERBATIM al transcript ───────────
const REST = [
  // ── INTRO: Doña Herminia, la rodilla, el 79 ──
  { key: "llegue", phrase: "me lo enseñó una paciente", beats: [ c("talk", {}) ]},
  { key: "rodilla", phrase: "un dolor en la rodilla", beats: [
    ak([{ word: "VINO POR LA RODILLA, NO POR LA PIEL", sub: "pero el médico no pudo dejar de mirarle la cara", tone: "teal", atPhrase: "quedarme observándola" }], {}) ]},
  { key: "piel_cuadra", phrase: "una piel que no cuadraba", beats: [
    r("fe17_herminia_piel", { kicker: "Doña Herminia — una piel que no cuadraba con sus años", hold: true }),
    c("annotated", { w: 1.6, image: "img/fe17_herminia_piel.png", eyebrow: "Lo que el doctor vio", caption: "El cuello firme; las manchas de las manos, desdibujadas; una luz de descanso en la cara", annotations: [
      { label: "Cuello firme", x: 52, y: 60 }, { label: "Manchas desdibujadas", x: 34, y: 74 } ], at: "el cuello firme" }) ]},
  { key: "calcule", phrase: "le calculé unos 65", beats: [
    c("stat", { big: "¿65?", label: "lo que el médico le calculó por su piel", tone: "teal" }) ]},
  { key: "setentainueve", phrase: "tengo 79 años", beats: [
    c("stat", { big: "79", label: "años — y de crema cara, ni una", tone: "warn" }) ]},
  { key: "crema_ni_una", phrase: "de crema cara", beats: [
    fc([{ t: "De" }, { t: "crema" }, { t: "cara," }, { t: "NI" }, { t: "UNA", hl: true }], { tone: "warn", at: "ni una" }) ]},
  { key: "cuido_noche", phrase: "la cuido de noche", beats: [
    ak([{ word: "YO A MI PIEL LA CUIDO DE NOCHE", sub: "«mientras duermo» — y esa frase se le quedó grabada al doctor", tone: "teal", atPhrase: "mientras duermo" }], {}) ]},
  { key: "cuenteme", phrase: "cuénteme eso de la noche", beats: [
    fc([{ t: "Cuénteme" }, { t: "eso" }, { t: "de" }, { t: "la" }, { t: "NOCHE", hl: true }], { tone: "teal", at: "de la noche" }) ]},
  // ── POR QUÉ LA NOCHE ──
  { key: "porque", phrase: "explicarte por qué funciona", beats: [ c("talk", {}),
    fc([{ t: "NO" }, { t: "es" }, { t: "cuento" }, { t: "—" }, { t: "es" }, { t: "CIENCIA", hl: true }], { tone: "teal", at: "pura ciencia" }) ]},
  { key: "guerra", phrase: "tu piel está en guerra", beats: [ c("talk", {}),
    mv("De noche tu piel no hace nada — solo descansas", "De DÍA tu piel se defiende (sol, polvo, roce); de NOCHE deja el escudo y se repara", { flipPhrase: "de noche cambia todo" }) ]},
  { key: "taller", phrase: "pequeño taller nocturno", beats: [ c("talk", {}),
    dg("dg_fe17_taller_noche", "El taller nocturno de la piel: de noche fabrica colágeno nuevo, renueva células y limpia el daño del día, sobre todo en las primeras horas de sueño profundo") ]},
  { key: "gratis", phrase: "ese taller trabaja gratis", beats: [
    ak([{ word: "EL TALLER ABRE GRATIS, CADA NOCHE", sub: "no cierra por vieja: trabaja tengas 60, 70 u 80", tone: "teal", atPhrase: "tengas la edad que tengas" }], {}) ]},
  { key: "doble", phrase: "rinde el doble", beats: [
    c("bars", { w: 2.4, title: "¿Y si le das el mejor material justo cuando trabaja?", unit: "", bars: [
      { label: "La piel sola, de noche", value: 50, tone: "teal", note: "repara" },
      { label: "La piel + romero, de noche", value: 100, tone: "teal", note: "rinde el doble" } ], at: "el mejor material para trabajar" }) ]},
  // ── QUÉ TIENE EL ROMERO ──
  { key: "fe", phrase: "para que le tengas fe", beats: [ c("talk", {}),
    dg("dg_fe17_antiox", "Antioxidantes = pequeños escudos que frenan el óxido de la piel (radicales libres); el romero es uno de los mejores antioxidantes naturales, y de noche cae cuando la piel limpia el daño del día") ]},
  { key: "oxido", phrase: "el óxido que se le va", beats: [
    ak([{ word: "UN ESCUDO GRATIS, JUSTO DE NOCHE", sub: "le das el trapito para limpiar justo cuando la piel se puso a limpiar", tone: "teal", atPhrase: "justo de noche" }], {}) ]},
  { key: "circulacion", phrase: "despierta la circulación", beats: [ c("talk", {}),
    dg("dg_fe17_circulacion", "La piel es un jardín: solo está firme y luminosa si le llega buena sangre por las raíces; el romero despierta el riego que nutre y ayuda a fabricar su propio colágeno") ]},
  { key: "jardin", phrase: "como en un jardín", beats: [
    ak([{ word: "ABRIÓ EL RIEGO JUSTO ANTES DEL TALLER", sub: "sangre, oxígeno y alimento a la fábrica, justo cuando la fábrica abría", tone: "teal", atPhrase: "su propio colágeno" }], {}) ]},
  { key: "amanezco", phrase: "su masajito de romero", beats: [
    fc([{ t: "«Amanezco" }, { t: "con" }, { t: "la" }, { t: "cara" }, { t: "DESPIERTA»", hl: true }], { tone: "teal", at: "amanezco con la cara despierta" }) ]},
  { key: "manchas", phrase: "Las manchas de la edad", beats: [ c("talk", {}),
    c("splitlist", { w: 2.0, title: "Por qué las manchas se atienden DE NOCHE", items: ["De día el sol manda la orden de fabricar más mancha", "De noche, sin sol, la piel renueva las capas de arriba y estrena piel nueva más pareja"], tone: "teal", at: "estrenar piel nueva más pareja" }) ]},
  // ── HONESTIDAD ──
  { key: "honesto", phrase: "quiero ser honesto contigo", beats: [ c("talk", {}),
    es("!", "El romero AYUDA, no hace magia", { tone: "teal", w: 3.0, eyebrow: "Con honestidad" }),
    c("checklist", { w: 2.6, title: "El romero, con honestidad", tone: "teal", items: [
      { text: "SÍ: luminosidad, textura y arruguitas finas, poco a poco y sin químicos", state: "done" },
      { text: "NO: borrar arrugas profundas de un día para otro", state: "warn" },
      { text: "Mancha que cambia, crece, pica o sangra → al dermatólogo, sin demora", state: "warn" } ], at: "con un dermatólogo" }) ]},
  // ── CONTRASTE DOÑA LIGIA ──
  { key: "ligia", phrase: "su piel se veía más cansada", beats: [
    r("fe17_ligia_cansada", { kicker: "Doña Ligia, 64 — tele hasta tarde, cara sucia, cremas caras", hold: true }),
    c("bars", { w: 2.4, title: "64 vs 79 años — ¿qué explica la diferencia?", unit: "", bars: [
      { label: "Doña Herminia (79): noche limpia + romero, duerme sus horas", value: 92, tone: "teal", note: "le dio la noche" },
      { label: "Doña Ligia (64): tele, cara sucia, cremas caras", value: 30, tone: "danger", note: "le tapó el taller" } ], at: "le tapaba el taller" }) ]},
  { key: "nogenetica", phrase: "No es la genética", beats: [ c("talk", {}),
    ak([{ word: "NO ES GENÉTICA NI DINERO — ES LA NOCHE", sub: "es lo que haces, o lo que dejas de hacer, cuando apagas la luz", tone: "teal", atPhrase: "cuando apagas la luz" }], {}) ]},
  { key: "nunca_tarde", phrase: "demasiado tarde para empezar", beats: [
    fc([{ t: "Nunca" }, { t: "es" }, { t: "demasiado" }, { t: "TARDE", hl: true }], { tone: "teal", at: "no cierra por vieja" }) ]},
  { key: "segundo", phrase: "El segundo mejor momento", beats: [
    ak([{ word: "EL SEGUNDO MEJOR MOMENTO ES ESTA NOCHE", sub: "no borrarás lo de atrás, pero cambias por completo lo que viene", tone: "teal", atPhrase: "es esta misma noche" }], {}) ]},
  // ── RECETA + RITUAL ──
  { key: "tesoro", phrase: "lo que ella llamaba su tesoro", beats: [ c("talk", {}),
    r("fe17_aceite_verde", { at: "el aceite de romero", kicker: "Su tesoro: el aceite de romero", hold: true }) ]},
  { key: "receta", phrase: "unas ramitas de romero", beats: [
    c("process", { w: 2.6, title: "Su aceite de romero", eyebrow: "2 formas", steps: [
      { title: "Paciente", desc: "romero en un frasco de vidrio, cubierto de aceite, lugar oscuro, 15 días", image: "img/fe17_romero_frasco.png" },
      { title: "Rápida", desc: "a baño maría, tibio, NUNCA hervir, 30-40 min", image: "img/fe17_bano_maria.png" },
      { title: "Cuela y guarda", desc: "color verdoso, a un frasquito oscuro", image: "img/fe17_aceite_verde.png" } ], at: "a baño María" }) ]},
  { key: "ritual", phrase: "este es el ritual", beats: [ c("talk", {}),
    c("annotated", { w: 1.8, image: "img/fe17_masaje_facial.png", eyebrow: "El ritual de la noche", caption: "Cara limpia, 3-4 gotitas tibias, masaje SIEMPRE hacia arriba, con las yemas", annotations: [
      { label: "Frente y cachetes hacia arriba", x: 42, y: 38 }, { label: "Sin estirar la piel", x: 60, y: 58 } ], at: "con las yemas de los dedos" }) ]},
  { key: "cuello", phrase: "el cuello es de lo que", beats: [
    r("fe17_masaje_cuello", { at: "el dorso de las manos", kicker: "El cuello y las manos, de abajo hacia arriba — «las manos no mienten»", hold: true }) ]},
  { key: "encaja", phrase: "despierta la circulación justo antes de", beats: [
    ak([{ word: "EL MASAJE ABRE EL RIEGO ANTES DEL TALLER", sub: "por eso lo hacía de noche y no de día: le abría la fábrica justo cuando iba a trabajar", tone: "teal", atPhrase: "abra el taller nocturno" }], {}) ]},
  { key: "secreto_aplic", phrase: "todo el secreto de la aplicación", beats: [
    c("checklist", { w: 2.4, title: "Toda la aplicación, en 4 pasos", tone: "teal", items: [
      { text: "Cara limpia con agua tibia", state: "done" },
      { text: "3-4 gotitas de aceite de romero", state: "done" },
      { text: "Masaje hacia arriba: cara, cuello y manos", state: "done" },
      { text: "A dormir — simple como respirar", state: "done" } ], at: "simple como respirar" }) ]},
  // ── DÍA: TÓNICO + SOL ──
  { key: "tonico", phrase: "un tónico de agua de Romero", beats: [
    r("fe17_tonico_spray", { at: "le cerraba los poros", kicker: "De día: tónico de agua de romero, fresquito y ligero", hold: true }) ]},
  { key: "sol", phrase: "se protegía del sol", beats: [
    r("fe17_sombrero_sol", { at: "Un sombrero, la sombra", kicker: "De día: sombrero, sombra, sombrilla", hold: true }),
    c("bars", { w: 2.6, title: "¿De dónde vienen las arrugas y las manchas?", unit: "", bars: [
      { label: "El sol (lo que ella evitaba, gratis)", value: 80, tone: "danger", note: "80%" },
      { label: "Todo lo demás (tiempo, genética…)", value: 20, tone: "teal", note: "20%" } ], at: "vienen del sol" }) ]},
  { key: "trato", phrase: "la noche para reparar", beats: [
    c("splitlist", { w: 2.0, title: "El trato justo", items: ["La NOCHE para reparar: romero, cara limpia y sueño", "El DÍA para proteger: sombra y sol cuidado"], tone: "teal", at: "el día para proteger" }) ]},
  { key: "comida", phrase: "comía sencillo y de la tierra", beats: [
    c("splitlist", { w: 2.0, title: "Belleza de adentro y de afuera", items: ["Fruta y verdura de colores, agua: antioxidantes por dentro", "Dormir sus horas: de noche la cara se plancha sola"], tone: "teal", at: "la cara se plancha sola" }) ]},
  { key: "resumen", phrase: "ningún secreto de laboratorio", beats: [
    c("chips", { title: "El método de Doña Herminia", chips: ["Romero de noche", "Sol cuidado de día", "Comida simple", "Buen sueño", "Constancia"], tone: "teal", at: "constancia y cariño" }) ]},
  // ── PIERNAS Y PELO ──
  { key: "piernas_pelo", phrase: "para las piernas y para el", beats: [
    c("process", { w: 2.4, title: "El mismo romero, tres regalos", eyebrow: "Por la circulación", steps: [
      { title: "Cara", desc: "luminosa y firme", image: "img/fe17_masaje_facial.png" },
      { title: "Piernas", desc: "menos pesadas, de abajo hacia arriba", image: "img/fe17_masaje_piernas.png" },
      { title: "Cabello", desc: "más sangre a la raíz: se cae menos", image: "img/fe17_cuero_cabelludo.png" } ], at: "activa el riego" }) ]},
  // ── PRIMERA NOCHE PASO A PASO ──
  { key: "primera_noche", phrase: "armar tu primera noche", beats: [ c("talk", {}),
    c("process", { w: 2.6, title: "Tu primera noche, como Doña Herminia", eyebrow: "Paso a paso", steps: [
      { title: "Lava", desc: "solo agua tibia, suave, sin tallar fuerte", image: "img/fe17_lavar_cara.png" },
      { title: "Romero", desc: "3-4 gotitas, masaje hacia arriba: cara, cuello, manos", image: "img/fe17_masaje_facial.png" },
      { title: "Duerme", desc: "apaga la tele y el teléfono, dale la noche entera", image: "img/fe17_dormir.png" } ], at: "lávate la cara solo con agua" }) ]},
  // ── CTA 1 + reflexión ──
  { key: "injerto1", phrase: "reuní todo lo que sé", beats: [ c("talk", {}),
    lt("Las recetas de las abuelas, ordenadas para ti", { kicker: "Lo reuní para ti", desc: "Un método completo, con las cantidades y los tiempos, en una guía con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  { key: "regalo_noche", phrase: "la noche es un regalo", beats: [
    lt("«La noche es un regalo — y lo tiran durmiéndose tarde»", { kicker: "Doña Herminia, 79", desc: "Acostarse temprano, cara limpia y su romero: el mejor tratamiento de belleza no cuesta ni un centavo.", tone: "teal", at: "no cuesta ni un centavo" }) ]},
  { key: "invisible", phrase: "empieza a sentirse invisible", beats: [
    ak([{ word: "NO TE ACUESTES DERROTADA — ACUÉSTATE CUIDÁNDOTE", sub: "esos cinco minutos son para recordarte que todavía te importas", tone: "teal", atPhrase: "acuéstate cuidándote" }], {}) ]},
  // ── 3 SECRETOS ──
  { key: "s1", phrase: "duerme bien y temprano", beats: [
    es("01", "Duerme bien y temprano", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    r("fe17_dormir", { at: "apaga las pantallas", kicker: "«El sueño es el sérum que nadie te vende»", hold: true }) ]},
  { key: "s2", phrase: "las manos y el cuello", beats: [
    es("02", "Manos y cuello, siempre juntos", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    c("callout", { w: 1.8, image: "img/fe17_manos_guante.png", figure: "«Las manos no mienten»", caption: "Aceite tibio de romero + guantes de algodón para dormir: amanecen suaves.", at: "unos guantes de algodón" }) ]},
  { key: "s3", phrase: "la constancia sin buscar el milagro", beats: [
    es("03", "Constancia, sin buscar el milagro", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    ak([{ word: "COMO QUIEN SE LAVA LOS DIENTES", sub: "no por el resultado de mañana, sino como un cuidado de por vida — por eso funcionó", tone: "teal", atPhrase: "un cuidado de por vida" }], {}) ]},
  // ── CTA 2 + cierre ──
  { key: "injerto2", phrase: "un método completo", beats: [
    fz("fe17_libro_guia", { at: "las recetas de las abuelas", kicker: "Método completo · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: cuidarte para siempre, como Doña Herminia", { kicker: "Sin depender de la farmacia", desc: "No es un gasto en un frasco: es aprender a cuidarte. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "para siempre" }) ]},
  { key: "espejo", phrase: "que te regales cinco minutos", beats: [ c("talk", {}),
    fc([{ t: "Búscate" }, { t: "la" }, { t: "LUZ,", hl: true }, { t: "no" }, { t: "los" }, { t: "defectos" }], { tone: "teal", at: "búscate la luz" }) ]},
  { key: "cierre", phrase: "cuídate tus noches", beats: [
    c("nametag", { name: "Dr. Federer", role: "La cara limpia, tu romero, unos minutos para ti, y a dormir tranquila", image: "img/fe17_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer17_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer17.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer17.json", "utf8"));
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer17/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer17.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer17_beats.ts", `export const FED17_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer17_hooks.ts", `export const TALKS17: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer17.json", JSON.stringify({ video: "federer17", avatar: "federer17_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
