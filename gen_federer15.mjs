// gen_federer15.mjs — beatsheet federer15 (Federer Archivos · PROTEÍNA/MÚSCULO · sarcopenia +60).
// Avatar federer15_opt.mp4 (~21.9min). MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer15.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer15.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe15_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe15_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  { key: "tamano", phrase: "el problema del tamaño", beats: [ c("talk", {}),
    dg("dg_fe15_molecula", "El colágeno de la crema tiene moléculas grandes: no cruzan tu piel, se quedan arriba y se van con el lavado") ]},
  { key: "invitado", phrase: "que nunca cruzó la puerta", beats: [
    ak([{ word: "LE PAGASTE A UN INVITADO QUE NO ENTRÓ", sub: "hidrata un rato en la superficie, pero nunca llega donde vive la arruga", tone: "warn", atPhrase: "por el desagüe" }], {}) ]},
  { key: "hidratar", phrase: "hidratar no es rejuvenecer", beats: [
    mv("Si la crema me deja suave, me está rejuveneciendo", "Hidratar es pintar una pared húmeda: se ve mejor un rato; NO arregla la pared", { flipPhrase: "pintar una pared" }) ]},
  { key: "negocio", phrase: "el negocio está en que vuelvas", beats: [
    ak([{ word: "EL NEGOCIO ESTÁ EN QUE VUELVAS", sub: "una crema que te curara para siempre no te la volverían a vender — sin conspiración, es negocio de repetición", tone: "warn", atPhrase: "cada temporada" }], {}) ]},
  { key: "ingredientes", phrase: "solo hay un puñadito", beats: [
    c("bars", { w: 2.8, title: "De 100 ingredientes que te venden…", unit: "", bars: [
      { label: "Los que de verdad hacen algo", value: 4, tone: "teal", note: "poquísimos" },
      { label: "Relleno, perfume y promesas", value: 96, tone: "danger", note: "pagas la cajita" } ], at: "el resto casi todo es relleno" }) ]},
  { key: "adentro", phrase: "de ADENTRO hacia afuera", beats: [ c("talk", {}),
    dg("dg_fe15_jardin", "La piel se rejuvenece de adentro: buena circulación, defensa antioxidante y que tu propia piel trabaje") ]},
  { key: "antiox", phrase: "cargado de antioxidantes", beats: [
    ak([{ word: "ROMERO = ANTIOXIDANTES + CIRCULACIÓN", sub: "escudos contra el sol y el tiempo, y despierta el riego de sangre a tu piel", tone: "teal", atPhrase: "de los más estudiados" }], {}) ]},
  { key: "jardin", phrase: "como en un jardín", beats: [
    dg("dg_fe15_circulacion", "Tu piel es un jardín: firme y luminosa solo si le llega buena sangre que la nutre y fabrica su colágeno") ]},
  // honesty
  { key: "honesto", phrase: "el romero no es un milagro", beats: [ c("talk", {}),
    c("checklist", { w: 2.2, title: "El romero, con honestidad", tone: "teal", items: [
      { text: "SÍ: luminosidad, textura, firmeza poco a poco, sin químicos", state: "done" },
      { text: "NO: lo que hace un procedimiento médico", state: "warn" },
      { text: "Mancha que cambia, crece o sangra → dermatólogo", state: "warn" } ], at: "cuidarte con cabeza" }) ]},
  // receta
  { key: "receta", phrase: "un aceite de romero casero", beats: [ c("talk", {}),
    r("fe15_romero_frasco", { at: "dos cosas", hold: true }),
    c("bars", { w: 2.2, title: "Lo que gastas al año (aprox.)", unit: "", bars: [
      { label: "Cremas de marca", value: 100, tone: "danger", note: "una fortuna" },
      { label: "Romero + aceite", value: 4, tone: "teal", note: "unas monedas" } ], at: "unas monedas" }) ]},
  { key: "dos_formas", phrase: "La paciente", beats: [
    c("process", { w: 2.8, title: "Aceite de romero — 2 formas", eyebrow: "Elige la tuya", steps: [
      { title: "Paciente", desc: "romero en aceite, frasco oscuro, 15 días", image: "img/fe15_romero_frasco.png" },
      { title: "Rápida", desc: "baño maría, tibio, NUNCA hervir", image: "img/fe15_bano_maria.png" },
      { title: "Cuela y guarda", desc: "color verdoso, a un frasquito", image: "img/fe15_aceite_verde.png" } ], at: "baño maría" }) ]},
  { key: "usa", phrase: "cómo lo usas", beats: [
    r("fe15_masaje_facial", { at: "hacia arriba", hold: true }),
    c("annotated", { w: 1.6, image: "img/fe15_masaje_facial.png", eyebrow: "De noche", caption: "Gotitas, masaje suave hacia arriba: reparte el aceite y activa la circulación", annotations: [
      { label: "Cara", x: 38, y: 40 }, { label: "Cuello y manos", x: 64, y: 62 } ], at: "poco producto" }) ]},
  // usos extra
  { key: "guante", phrase: "el guante de romero", beats: [
    ak([{ word: "GUANTE DE ROMERO (MANOS)", sub: "aceite tibio + guantes de algodón para dormir: amanecen suaves y más parejas", tone: "teal", atPhrase: "guantes de algodón" }], {}) ]},
  { key: "tonico", phrase: "un tónico", beats: [
    c("callout", { w: 1.6, image: "img/fe15_tonico_spray.png", figure: "«Agua termal casera»", caption: "Refresca, cierra poros e ilumina, antes de tu protector solar. Por centavos.", at: "por centavos" }) ]},
  // error
  { key: "error", phrase: "te prometí un error", beats: [ c("talk", {}),
    es("!", "Saltar de frasco en frasco", { tone: "warn", w: 3.2, eyebrow: "El error" }) ]},
  { key: "semilla", phrase: "plantar una semilla", beats: [
    ak([{ word: "LA PIEL RESPONDE A LA CONSTANCIA, NO A LA NOVEDAD", sub: "cambiar de crema cada dos semanas es desenterrar la semilla para ver si creció", tone: "warn", atPhrase: "nunca va a crecer" }], {}) ]},
  { key: "mezclar", phrase: "mezclar demasiadas cosas", beats: [
    c("splitlist", { w: 2.0, title: "Menos es más", items: ["❌ Cinco productos encima: satura e irrita", "✅ Piel limpia + tu aceite de romero + constancia"], tone: "teal", at: "la sencillez" }) ]},
  // CTA 1
  { key: "injerto1", phrase: "reuní todo lo que sé", beats: [
    lt("Todo esto, ordenado para tu piel", { kicker: "Lo reuní para ti", desc: "Las recetas, cantidades y tiempos, y muchos remedios de cocina, en una guía con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  // Elena vuelve
  { key: "elena_vuelve", phrase: "Te acuerdas de Elena", beats: [ c("talk", {}),
    r("fe15_elena_consultorio", { at: "medio incrédula", hold: true }) ]},
  { key: "elena_cambio", phrase: "entró con una sonrisa", beats: [
    c("process", { w: 2.8, title: "El cambio de Elena", eyebrow: "Una sola cosa, constante", steps: [
      { title: "Antes", desc: "20 años de cremas caras, cara igual", image: "img/fe15_cremas_caras.png" },
      { title: "Semanas", desc: "piel luminosa, descansada", image: "img/fe15_elena_feliz.png" },
      { title: "Lo mejor", desc: "dejó de sentirse engañada", image: "img/fe15_cajon_cerrado.png" } ], at: "más luminosa" }) ]},
  { key: "sentido", phrase: "el sentido común", beats: [
    lt("«Me devolvió el sentido común»", { kicker: "Elena, 64", desc: "Me ahorré un dineral, y tengo la piel tranquila y la conciencia tranquila.", tone: "teal", at: "la conciencia tranquila" }) ]},
  // secretos
  { key: "s1", phrase: "el protector solar de día", beats: [
    es("01", "Protector solar cada mañana", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    r("fe15_protector_solar", { at: "lo más importante", hold: true }) ]},
  { key: "s1_sol", phrase: "viene del sol", beats: [
    c("stat", { big: "80%", label: "del envejecimiento de tu piel viene del sol — el protector es tu mejor 'antiarrugas'", tone: "warn", at: "aunque solo salgas" }),
    c("bars", { w: 2.4, title: "A 10 años, ¿qué te conviene?", unit: "", bars: [
      { label: "Romero + protector solar, constante", value: 90, tone: "teal", note: "piel mejor" },
      { label: "Cremas caras, sin protegerte del sol", value: 30, tone: "danger", note: "el sol gana" } ], at: "se vería muchísimo mejor" }) ]},
  { key: "s2", phrase: "exfolia suave", beats: [
    es("02", "Exfolia suave (azúcar y miel)", { tone: "teal", w: 3.0, eyebrow: "Secreto" }) ]},
  { key: "s3", phrase: "la constancia con cariño", beats: [
    es("03", "Constancia con cariño", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    ak([{ word: "UN RITUAL PARA TI, CADA NOCHE", sub: "Elena no transformó su piel en un día — se dedicó unos minutos cada noche. Está a tu alcance.", tone: "teal", atPhrase: "al alcance tuyo" }], {}) ]},
  // CTA 2
  { key: "injerto2", phrase: "un método completo", beats: [
    fz("fe15_libro_guia", { at: "para verte más joven", kicker: "Método completo · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: dejar de gastar en frascos", { kicker: "Para siempre", desc: "No es un gasto en una crema más: es dejar de comprar frascos que no cumplen. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "para siempre" }) ]},
  // cierre
  { key: "despedida", phrase: "hagamos algo juntas", beats: [ c("talk", {}) ]},
  { key: "control", phrase: "tú tienes el control", beats: [
    fc([{ t: "Tú" }, { t: "tienes" }, { t: "el" }, { t: "CONTROL", hl: true }], { tone: "teal", at: "tú tienes el control" }) ]},
  { key: "cta_coment", phrase: "suscríbete a este canal", beats: [
    lt("¿Cuánto gastaste en cremas que no cumplieron? Cuéntame", { kicker: "Déjame un me gusta", desc: "Suscríbete y compártelo con esa amiga que se sigue gastando una fortuna en cremas. Puede que le regales la verdad.", tone: "teal", at: "compártelo con esa amiga" }) ]},
  { key: "cierre", phrase: "nos vemos muy pronto", beats: [
    c("nametag", { name: "Dr. Federer", role: "Cierra el cajón de las cremas, y ve por tu romero", image: "img/fe15_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer15_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer15.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer15.json", "utf8"));
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
  const ms = findMs(sec.phrase, cursorSec + (sec.min1 ? 0.05 : 1));
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + (sec.min1 ? 1.2 : 5);
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer15/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer15.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer15_beats.ts", `export const FED15_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer15_hooks.ts", `export const TALKS15: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer15.json", JSON.stringify({ video: "federer15", avatar: "federer15_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
