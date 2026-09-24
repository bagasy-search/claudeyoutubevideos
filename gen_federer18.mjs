// gen_federer18.mjs — beatsheet federer18 (Federer Archivos · ACEITE DE ROMERO DE $1 · el COSTO).
// Avatar federer18_opt.mp4 (~30min). MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer18.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
// hero→imagen shock, bignum→stat, diagram→dg; los "broll" del director → min1_broll (b-roll denso).
// Resto (65s→fin) = secciones del guion: Doña Consuelo (6 frasquitos, "una fortuna"), la CUENTA
// ($120.000 en cremas vs centavos del aceite), por qué las cremas caras no cumplen (moléculas
// grandes/relleno/negocio de repetición), el romero barato SÍ (antioxidantes+circulación),
// ESCUDO DE HONESTIDAD (no milagro, no conspiración, mancha→dermatólogo), la RECETA exacta
// (maceración 15 días o baño maría), cómo usarlo, usos extra (tónico/guantes), el error de
// saltar de frasco en frasco, 2 injertos de venta drfederer.com, cierre nametag Dr. Federer.
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer18.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe18_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe18_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  // ── Doña Consuelo: la costurera y sus seis frasquitos ──────────────────
  { key: "consuelo_intro", phrase: "se llamaba Consuelo", beats: [ c("talk", {}),
    r("fe18_consuelo_cose", { at: "costurera toda la vida", kicker: "Doña Consuelo, 67 — costurera toda la vida", hold: true }) ]},
  { key: "frasquitos", phrase: "seis frasquitos", beats: [
    r("fe18_cremas_caras", { at: "abrió su bolso", kicker: "Seis frascos, uno por uno, sobre el escritorio", hold: true }),
    c("chips", { w: 1.6, title: "Lo que traía en el bolso", chips: ["La de día", "La de noche", "Contorno de ojos", "Sérum «milagroso»", "Mascarilla", "…ni me acuerdo"], tone: "teal", at: "en fila sobre mi escritorio" }) ]},
  { key: "gasto", phrase: "cuánto cree usted que", beats: [ c("talk", {}),
    c("stat", { w: 1.6, big: "UNA FORTUNA", label: "20 años de cremas — y el monedero vacío", tone: "warn", at: "una fortuna doctor" }) ]},
  // ── La CUENTA que duele: $120.000 vs unas monedas ─────────────────────
  { key: "cuenta", phrase: "hagamos juntas la cuenta", beats: [ c("talk", {}),
    c("bars", { w: 2.6, title: "La cuenta que duele: 20 años de cremas", unit: "", bars: [
      { label: "Cremas: ~$500/mes → $6.000/año → 20 años", value: 100, tone: "danger", note: "$120.000" },
      { label: "Aceite de romero casero (unas monedas)", value: 1, tone: "teal", note: "~$1" } ], at: "Léelo despacio ese número" }) ]},
  { key: "recibiste", phrase: "qué recibiste a cambio", beats: [
    ak([{ word: "$120.000 POR LA MISMA CARA", sub: "y una gaveta llena de frascos a medio usar — no cambió nada", tone: "warn", atPhrase: "una gaveta llena" }], {}) ]},
  // ── Por qué las cremas caras NO cumplen (3 razones) ───────────────────
  { key: "pregunta", phrase: "está la pregunta incómoda", beats: [ c("talk", {}) ]},
  { key: "tamano", phrase: "La primera razón es el tamaño", beats: [ c("talk", {}),
    dg("dg_fe18_molecula", "El colágeno de la crema tiene moléculas ENORMES: la piel es una muralla, se quedan arriba, en la superficie", { at: "esas moléculas son grandes" }),
    mv("El colágeno de la crema te llega a la arruga", "Sus moléculas son enormes: se quedan en la superficie y se van con el agua por el desagüe", { at: "te hidrata un ratito", flipPhrase: "se va por el desagüe" }) ]},
  { key: "segunda", phrase: "La segunda razón", beats: [
    c("splitlist", { w: 2.2, title: "Hidratar no es rejuvenecer", items: ["HIDRATAR: agua y aceites, se ve fresca un rato — como pintar la pared con humedad", "REJUVENECER: nutrir y defender desde adentro — la pared por dentro cambia de verdad"], tone: "teal", at: "pintar una pared con humedad" }) ]},
  { key: "tercera", phrase: "Y la tercera razón", beats: [ c("talk", {}),
    ak([{ word: "NO ES CONSPIRACIÓN, ES UN NEGOCIO DE REPETICIÓN", sub: "una crema que te resolviera el problema para siempre… no te la volverían a vender", tone: "warn", atPhrase: "no te la volverían" }], {}) ]},
  { key: "clienta", phrase: "la clienta perfecta", beats: [
    fc([{ t: "LA" }, { t: "QUE" }, { t: "SIEMPRE" }, { t: "VUELVE", hl: true }], { tone: "warn", at: "que siempre vuelve" }) ]},
  // ── Lo que SÍ funciona: de adentro hacia afuera ───────────────────────
  { key: "idea", phrase: "que lo cambia todo", beats: [ c("talk", {}),
    mv("La piel se rejuvenece de afuera hacia adentro", "Se rejuvenece de ADENTRO hacia afuera: buena sangre, defensa y su propio colágeno", { at: "La piel firme", flipPhrase: "de adentro hacia afuera" }) ]},
  { key: "antiox", phrase: "cargado de antioxidantes", beats: [ c("talk", {}),
    dg("dg_fe18_antiox", "El romero está cargado de antioxidantes: pequeños escudos que frenan el «óxido» de la piel — sol, contaminación, humo, tiempo", { at: "pequeños escudos" }) ]},
  { key: "oxido", phrase: "es como el óxido", beats: [
    ak([{ word: "LA MISMA DEFENSA, MIL VECES MENOS", sub: "lo que un frasco caro cobra como «sérum antioxidante avanzado», el romero te lo da por centavos", tone: "teal", atPhrase: "pagas mil veces menos" }], {}) ]},
  { key: "circulacion", phrase: "despertar la circulación", beats: [ c("talk", {}),
    dg("dg_fe18_circulacion", "Tu piel es como un jardín: el romero con un masajito despierta el riego de sangre, la nutre y ayuda a que fabrique su propio colágeno", { at: "como en un jardín" }) ]},
  { key: "puro", phrase: "No estás pagando más poder", beats: [ c("talk", {}),
    c("bars", { w: 2.6, title: "El frasco caro: ¿qué estás pagando en realidad?", unit: "", bars: [
      { label: "Envase, perfume, marca, actriz, caja, intermediarios", value: 95, tone: "danger", note: "el disfraz" },
      { label: "El ingrediente que de verdad sirve", value: 5, tone: "teal", note: "la sustancia" } ], at: "el envase precioso" }),
    fc([{ t: "PAGAS" }, { t: "EL" }, { t: "DISFRAZ", hl: true }], { tone: "warn", at: "Estás pagando la sustancia" }) ]},
  // ── ESCUDO DE HONESTIDAD: no milagro, mancha → dermatólogo ─────────────
  { key: "milagro", phrase: "no es un milagro", beats: [ c("talk", {}),
    es("!", "El romero NO es un milagro — es cuidado honesto", { tone: "teal", w: 3.0, eyebrow: "Con la verdad" }),
    c("checklist", { w: 2.6, title: "El romero, con honestidad", tone: "teal", items: [
      { text: "SÍ: luminosidad, textura y firmeza poco a poco, sin químicos", state: "done" },
      { text: "NO: borrar una arruga profunda ni lo que hace un procedimiento médico", state: "warn" },
      { text: "Mancha que cambia de color, crece, pica raro o sangra → dermatólogo, sin demorar", state: "warn" } ], at: "una mancha en la piel" }) ]},
  // ── La RECETA exacta del aceite de un dólar ───────────────────────────
  { key: "receta", phrase: "hacer un aceite de romero casero", beats: [ c("talk", {}),
    c("process", { w: 2.8, title: "Tu aceite de romero de un dólar", eyebrow: "2 formas", steps: [
      { title: "1 · Paciente", desc: "Ramitas en frasco de vidrio, cubiertas de aceite (oliva). Lugar oscuro, 15 días. Cuela.", image: "img/fe18_romero_frasco.png" },
      { title: "2 · Rápida", desc: "Baño maría, fuego muy bajo 30–40 min. Se entibia y pone verdoso — NUNCA hervir.", image: "img/fe18_bano_maria.png" },
      { title: "3 · Guarda", desc: "Color verdoso, aroma a romero. Cuela y guarda en frasquito bien cerrado.", image: "img/fe18_aceite_verde.png" } ], at: "se hace a baño maria" }) ]},
  { key: "usar", phrase: "Masajeas con las yemas", beats: [
    r("fe18_masaje_facial", { at: "por la noche siempre", kicker: "De noche, sobre la cara limpia: unas gotitas", hold: true }),
    c("annotated", { w: 1.8, image: "img/fe18_masaje_facial.png", eyebrow: "El masaje ES medio secreto", caption: "Yemas, suave, siempre hacia arriba; cuello de abajo hacia arriba y dorso de las manos", annotations: [
      { label: "Hacia arriba", x: 42, y: 38 }, { label: "Cuello y manos", x: 64, y: 64 } ], at: "siempre hacia arriba" }) ]},
  { key: "usos_extra", phrase: "Dos usos extra", beats: [
    c("callout", { w: 1.8, image: "img/fe18_manos_guante.png", figure: "«El guante de romero»", caption: "Aceite tibio en las manos + guantes de algodón para dormir: amanecen suaves y parejitas.", at: "guantes de algodón" }) ]},
  { key: "tonico", phrase: "un tónico refrescante", beats: [
    c("callout", { w: 1.8, image: "img/fe18_tonico_spray.png", figure: "«Agua termal casera»", caption: "Romero hervido, colado, en atomizador en el refri: refresca, cierra poros e ilumina — por centavos.", at: "de esos de rociar" }) ]},
  // ── El ERROR: saltar de frasco en frasco ──────────────────────────────
  { key: "error", phrase: "El error es este", beats: [ c("talk", {}),
    mv("Si no funciona en dos semanas, pruebo otro frasco", "La piel no responde a la novedad, responde a la CONSTANCIA — como una semilla que no debes desenterrar", { at: "de frasco en frasco", flipPhrase: "responde a la constancia" }) ]},
  // ── Injerto de venta 1 ────────────────────────────────────────────────
  { key: "injerto1", phrase: "reuní todo lo que sé", beats: [
    lt("Todo el método, ordenado para ti", { kicker: "Me cansé de ver mujeres gastando su pensión", desc: "Las recetas con las cantidades exactas y los tiempos, en una guía con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  // ── Cómo terminó Doña Consuelo ────────────────────────────────────────
  { key: "gaveta", phrase: "los guardó en una gaveta", beats: [
    r("fe18_cajon_cerrado", { at: "por si acaso", kicker: "Sus seis frascos caros: guardados «por si acaso»", hold: true }) ]},
  { key: "consuelo_final", phrase: "volvió al consultorio", beats: [
    r("fe18_consuelo_piel", { at: "una sonrisa distinta", kicker: "A las pocas semanas: una sonrisa distinta", hold: true }),
    lt("«Dejé de sentirme una tonta… me ahorré un dineral»", { kicker: "Doña Consuelo, semanas después", desc: "Piel más luminosa y descansada, la conciencia tranquila — y empezó a guardar para llevar a su nieta a conocer el mar.", tone: "teal", at: "me ahorré un dineral" }) ]},
  // ── Secretos extra (gratis) ───────────────────────────────────────────
  { key: "sol", phrase: "el protector solar de día", beats: [
    es("01", "El sol: 80% del envejecimiento de tu piel", { tone: "teal", w: 2.4, eyebrow: "Secreto" }),
    c("bars", { w: 2.6, title: "¿De dónde vienen las arrugas, en verdad?", unit: "", bars: [
      { label: "El sol (protector barato lo frena, gratis casi)", value: 80, tone: "danger", note: "80%" },
      { label: "Todo lo demás (tiempo, genética…)", value: 20, tone: "teal", note: "20%" } ], at: "viene del sol" }) ]},
  { key: "exfolia", phrase: "Exfolia suave", beats: [
    c("checklist", { w: 2.4, title: "Exfoliar: barato y suave", tone: "teal", items: [
      { text: "Solo 1 o 2 veces por semana, no más", state: "done" },
      { text: "Azúcar + una cucharadita de miel, en círculos suaves", state: "done" },
      { text: "Enjuaga con agua tibia: piel lista para recibir tu aceite", state: "done" } ], at: "azúcar y una cucharadita" }) ]},
  { key: "constancia3", phrase: "la llave de todo", beats: [
    fc([{ t: "LA" }, { t: "CONSTANCIA" }, { t: "CON" }, { t: "CARIÑO", hl: true }], { tone: "teal", at: "al alcance tuyo" }) ]},
  // ── Injerto de venta 2 + cierre ───────────────────────────────────────
  { key: "injerto2", phrase: "método completo para cuidar tu", beats: [
    fz("fe18_libro_guia", { at: "en la trampa de los frascos", kicker: "Método completo · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: dejar de gastar en frascos para siempre", { kicker: "Sin apuros, con calma", desc: "No es un gasto en un frasco más: es aprender a cuidarte sola. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "frascos para siempre" }) ]},
  { key: "cierre", phrase: "el enlace de las guías", beats: [
    c("nametag", { name: "Dr. Federer", role: "Del lado de tu piel y de tu bolsillo — ve por tu romero", image: "img/fe18_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer18_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer18.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer18.json", "utf8"));
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer18/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer18.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer18_beats.ts", `export const FED18_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer18_hooks.ts", `export const TALKS18: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer18.json", JSON.stringify({ video: "federer18", avatar: "federer18_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
