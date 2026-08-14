// gen_federer16.mjs — beatsheet federer16 (Federer Archivos · PROTEÍNA/MÚSCULO · sarcopenia +60).
// Avatar federer16_opt.mp4 (~21.9min). MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer16.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
// hero→imagen shock, bignum→stat, diagram→dg; los "broll" del director → min1_broll (b-roll denso).
// Resto (65s→fin) = secciones normales del guion (Don Alfredo, mecanismo 3 fallas, caída→cadera→hospital,
// Doña Marta, lentejas/huevo/sardina, el CUÁNDO/repartir, el error "ya es tarde", consejos, CTAs drfederer.com).
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer16.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe16_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe16_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  { key: "medicina", phrase: "era medicina y era belleza", beats: [ c("talk", {}),
    ak([{ word: "LA REINA DE LA CASA: EL ROMERO", sub: "lo que las abuelas usaban por necesidad, hoy la ciencia lo confirma", tone: "teal", atPhrase: "usaban lo que tenían" }], {}) ]},
  { key: "antiox", phrase: "cargado de antioxidantes", beats: [ c("talk", {}),
    dg("dg_fe16_antiox", "El romero está cargado de antioxidantes: escudos que defienden la piel del sol, la contaminación y el tiempo") ]},
  { key: "oxido", phrase: "por dentro", beats: [
    ak([{ word: "UN ESCUDO QUE OTRAS PAGAN CARÍSIMO", sub: "Doña Amparo se lo puso toda la vida, gratis, con romero", tone: "teal", atPhrase: "nombre de serum" }], {}) ]},
  { key: "circulacion", phrase: "despierta la circulación", beats: [
    dg("dg_fe16_circulacion", "El romero despierta el riego de sangre a la piel: la nutre y ayuda a que fabrique su propio colágeno") ]},
  { key: "jardin", phrase: "como en un jardín", beats: [
    ak([{ word: "MANTUVO EL RIEGO DESPIERTO DÉCADAS", sub: "no le puso colágeno de fuera; ayudó a que su piel lo siguiera fabricando", tone: "teal", atPhrase: "cuidar la raíz" }], {}) ]},
  // honesty + contrast
  { key: "genetica", phrase: "algo de suerte, de genética", beats: [ c("talk", {}),
    mv("Es solo cuestión de genética o de suerte", "Dos mujeres con la misma genética envejecen MUY distinto según cómo se cuidan", { flipPhrase: "según cómo se cuidan" }) ]},
  { key: "clara", phrase: "Doña Clara", beats: [
    r("fe16_clara_piel", { at: "más envejecida", kicker: "Doña Clara, 62 — gastó más, se ve mayor", hold: true }),
    c("bars", { w: 2.2, title: "62 vs 78 años — ¿qué explica la diferencia?", unit: "", bars: [
      { label: "Doña Amparo (78): sol cuidado, romero, constancia", value: 90, tone: "teal", note: "hábitos" },
      { label: "Doña Clara (62): cremas caras, sol, sin constancia", value: 35, tone: "danger", note: "no es la crema" } ], at: "no es la genética" }) ]},
  { key: "nunca_tarde", phrase: "NUNCA es demasiado tarde", beats: [
    fc([{ t: "Nunca" }, { t: "es" }, { t: "demasiado" }, { t: "TARDE", hl: true }], { tone: "teal", at: "empieces a los sesenta" }) ]},
  { key: "segundo_mejor", phrase: "El segundo mejor momento", beats: [
    ak([{ word: "EL SEGUNDO MEJOR MOMENTO ES ESTA NOCHE", sub: "no borrarás lo de atrás, pero puedes cambiar por completo lo que viene", tone: "teal", atPhrase: "lo que viene por delante" }], {}) ]},
  // rutina
  { key: "tesoro", phrase: "su tesoro", beats: [ c("talk", {}),
    r("fe16_aceite_romero", { at: "el aceite de romero", hold: true }) ]},
  { key: "receta", phrase: "unas ramitas de romero", beats: [
    c("process", { w: 2.4, title: "Su aceite de romero", eyebrow: "2 formas", steps: [
      { title: "Paciente", desc: "romero en aceite, frasco oscuro, 15 días", image: "img/fe16_romero_frasco.png" },
      { title: "Rápida", desc: "baño maría, tibio, NUNCA hervir", image: "img/fe16_bano_maria.png" },
      { title: "Cuela y guarda", desc: "color verdoso, a un frasquito", image: "img/fe16_aceite_verde.png" } ], at: "baño maría" }) ]},
  { key: "noche", phrase: "Todas las noches", beats: [
    r("fe16_masaje_facial", { at: "sin fallar", hold: true }),
    c("annotated", { w: 1.6, image: "img/fe16_masaje_facial.png", eyebrow: "Su ritual de noche", caption: "Gotitas, masaje hacia arriba; cara, cuello y manos", annotations: [
      { label: "Hacia arriba", x: 40, y: 40 }, { label: "Cuello y manos", x: 64, y: 62 } ], at: "las yemas de los dedos" }) ]},
  { key: "tonico", phrase: "un tónico de agua de romero", beats: [
    r("fe16_tonico_spray", { at: "le cerraba los poros", hold: true }) ]},
  { key: "sol", phrase: "se protegía del sol", beats: [
    ak([{ word: "SU SECRETO MÁS GRANDE Y GRATIS: EL SOL", sub: "sombrero, sombra, sombrilla — el 80% de las arrugas viene del sol", tone: "teal", atPhrase: "el gran enemigo" }], {}),
    c("bars", { w: 2.6, title: "¿De dónde vienen las arrugas, en verdad?", unit: "", bars: [
      { label: "El sol (lo que ella evitaba, gratis)", value: 80, tone: "danger", note: "80%" },
      { label: "Todo lo demás (genética, tiempo…)", value: 20, tone: "teal", note: "20%" } ], at: "el 80%" }) ]},
  { key: "comida", phrase: "comía sencillo", beats: [
    c("splitlist", { w: 2.0, title: "Belleza de adentro y de afuera", items: ["Fruta y verdura de colores, agua: antioxidantes por dentro", "Dormir bien: de noche la piel se repara sola"], tone: "teal", at: "la cara se plancha sola" }) ]},
  { key: "resumen", phrase: "ningún secreto de laboratorio", beats: [
    c("chips", { title: "El método de Doña Amparo", chips: ["Romero cada noche", "Sol cuidado", "Comida simple", "Buen sueño", "Constancia"], tone: "teal", at: "constancia y cariño" }) ]},
  { key: "piernas_pelo", phrase: "la circulación", beats: [
    c("process", { w: 2.2, title: "El mismo romero, tres regalos", eyebrow: "Por la circulación", steps: [
      { title: "Cara", desc: "luminosa y firme", image: "img/fe16_masaje_facial.png" },
      { title: "Piernas", desc: "menos pesadas, alivia várices", image: "img/fe16_masaje_piernas.png" },
      { title: "Cabello", desc: "más fuerte, se cae menos", image: "img/fe16_cuero_cabelludo.png" } ], at: "cuidándole la cara" }) ]},
  // error
  { key: "detalle", phrase: "algo que Doña Amparo hacía distinto", beats: [ c("talk", {}),
    es("!", "Constancia SIN buscar el milagro", { tone: "teal", w: 3.2, eyebrow: "El detalle" }),
    c("checklist", { w: 2.6, title: "El romero, con honestidad", tone: "teal", items: [
      { text: "SÍ: luminosidad, textura y firmeza poco a poco, sin químicos", state: "done" },
      { text: "NO: lo que hace un procedimiento médico o el bisturí", state: "warn" },
      { text: "Mancha que cambia, crece o sangra → al dermatólogo", state: "warn" } ], at: "sin buscar el milagro" }) ]},
  { key: "milagro", phrase: "esperó ver un cambio", beats: [
    ak([{ word: "COMO QUIEN SE LAVA LOS DIENTES", sub: "no para el resultado de mañana, sino como cuidado de por vida — por eso funcionó", tone: "teal", atPhrase: "cuidado de por vida" }], {}) ]},
  { key: "disfrutaba", phrase: "lo disfrutaba", beats: [
    lt("Su ritual no era obligación: era su momento de paz", { kicker: "La lección más bonita", desc: "Cinco minutos para sí misma, después de un día cuidando a otros. Y esa paz también se refleja en la piel.", tone: "teal", at: "sus cinco minutos de paz" }) ]},
  // CTA 1
  { key: "injerto1", phrase: "Reuní todo lo que", beats: [
    lt("Las recetas de las abuelas, ordenadas para ti", { kicker: "Lo reuní para ti", desc: "Un método completo, con las cantidades y los tiempos, en una guía con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  { key: "quieran", phrase: "dígales que se quieran", beats: [
    lt("«Dígales que se quieran — se les nota en la cara»", { kicker: "Doña Amparo, 78", desc: "No es el romero: es quererse lo suficiente para dedicarse unos minutos cada noche, toda la vida.", tone: "teal", at: "el cariño que una se tiene" }) ]},
  { key: "invisible", phrase: "sentirse invisible", beats: [
    ak([{ word: "ELLA NO SE CUIDABA PARA QUE LA MIRARAN", sub: "se cuidaba para mirarse ella con gusto — esa es la verdadera juventud", tone: "teal", atPhrase: "en paz consigo misma" }], {}) ]},
  // secretos
  { key: "s1", phrase: "protégete del sol", beats: [
    es("01", "Protégete del sol, como ella", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    r("fe16_sombrero_sol", { at: "el candado", hold: true }) ]},
  { key: "s2", phrase: "las manos y el cuello", beats: [
    es("02", "Manos y cuello, siempre juntos", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    c("callout", { w: 1.6, image: "img/fe16_manos_guante.png", figure: "«Las manos no mienten»", caption: "Aceite tibio + guantes de algodón para dormir: amanecen suaves.", at: "guantes de algodón" }) ]},
  { key: "s3", phrase: "la constancia con cariño", beats: [
    es("03", "Constancia con cariño", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    ak([{ word: "UNA VIDA DE QUERERSE", sub: "Doña Amparo no construyó esa piel en un día — la construyó en toda una vida. Está a tu alcance.", tone: "teal", atPhrase: "al alcance tuyo" }], {}) ]},
  // CTA 2
  { key: "injerto2", phrase: "un método completo", beats: [
    fz("fe16_libro_guia", { at: "las recetas de las abuelas", kicker: "Método completo · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: cuidarte para siempre, como Doña Amparo", { kicker: "Sin depender de la farmacia", desc: "No es un gasto en un frasco: es aprender a cuidarte sola. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "para siempre" }) ]},
  // cierre — la "primera noche paso a paso" (contenido real del avatar)
  { key: "primera_noche", phrase: "armarte tu primera noche", beats: [ c("talk", {}),
    c("process", { w: 2.4, title: "Tu primera noche, como Doña Amparo", eyebrow: "Paso a paso", steps: [
      { title: "Lava", desc: "solo agua tibia, suave, sin tallar", image: "img/fe16_lavar_cara.png" },
      { title: "Romero", desc: "3-4 gotitas tibias, masaje hacia arriba: cara, cuello, manos", image: "img/fe16_masaje_facial.png" },
      { title: "Duerme", desc: "tus horas: de noche la piel se repara sola", image: "img/fe16_dormir.png" } ], at: "paso a paso" }) ]},
  { key: "macera", phrase: "empiece a macerar", beats: [
    r("fe16_romero_frasco", { at: "las ramitas de romero en el frasco", hold: true }) ]},
  { key: "luz", phrase: "una mirada al espejo con cariño", beats: [
    fc([{ t: "Una" }, { t: "mirada" }, { t: "con" }, { t: "CARIÑO", hl: true }], { tone: "teal", at: "con cariño" }) ]},
  { key: "cierre", phrase: "Nos vemos muy pronto", beats: [
    c("nametag", { name: "Dr. Federer", role: "Unos minutos para ti, tu romero, y una mirada con cariño", image: "img/fe16_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer16_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer16.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer16.json", "utf8"));
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer16/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer16.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer16_beats.ts", `export const FED16_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer16_hooks.ts", `export const TALKS16: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer16.json", JSON.stringify({ video: "federer16", avatar: "federer16_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
