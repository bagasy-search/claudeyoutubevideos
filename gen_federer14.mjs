// gen_federer14.mjs — beatsheet federer14 (Federer Archivos · PROTEÍNA/MÚSCULO · sarcopenia +60).
// Avatar federer14_opt.mp4 (~21.9min). MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer14.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer14.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe14_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe14_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  { key: "mentira", phrase: "la mentira más cara", beats: [ c("talk", {}),
    mv("A mi edad, esto es lo que hay", "Eso es la mentira más cara que te vendieron — tu piel NO es una sentencia", { flipPhrase: "se pueden mejorar" }) ]},
  { key: "romero_es", phrase: "está en el romero", beats: [
    ak([{ word: "LA RESPUESTA ESTÁ EN EL ROMERO", sub: "esa hierba que usas para el pollo hace mucho más de lo que imaginas", tone: "teal", atPhrase: "todo lo que puede hacer" }], {}) ]},
  { key: "estudiada", phrase: "más estudiadas del mundo", beats: [ c("talk", {}),
    dg("dg_fe14_antiox", "El romero está cargado de antioxidantes: escudos que defienden tu piel del sol, la contaminación y el tiempo") ]},
  { key: "oxido", phrase: "carcome un fierro", beats: [
    ak([{ word: "ANTIOXIDANTES = FRENAN EL 'ÓXIDO' DE TU PIEL", sub: "el ácido rosmarínico del romero es de los mejores que da la naturaleza", tone: "teal", atPhrase: "uno de los mejores" }], {}) ]},
  { key: "jardin", phrase: "como en un jardín", beats: [
    dg("dg_fe14_jardin", "Tu piel es un jardín: solo está firme y luminosa si le llega buena circulación con oxígeno y alimento") ]},
  { key: "circulacion", phrase: "la llave del agua", beats: [
    ak([{ word: "EL ROMERO DESPIERTA LA CIRCULACIÓN", sub: "le vuelve a abrir la llave del riego a tu piel", tone: "teal", atPhrase: "abrirle de nuevo la llave" }], {}) ]},
  { key: "varices", phrase: "esas venitas hinchadas", beats: [
    r("fe14_varices_piernas", { at: "esa pesadez en las piernas", hold: true }) ]},
  { key: "friegas", phrase: "friegas de alcohol de romero", beats: [
    r("fe14_masaje_piernas", { at: "No era una ocurrencia", hold: true }) ]},
  { key: "dolores", phrase: "efecto antiinflamatorio", beats: [
    r("fe14_masaje_hombro", { at: "afloja, desinflama", hold: true }) ]},
  { key: "tres_chips", phrase: "por qué me apasiona", beats: [
    c("chips", { title: "Una planta, tres frentes", chips: ["Arrugas (piel)", "Várices (piernas)", "Dolores (músculos)"], tone: "teal", at: "una sola planta" }) ]},
  { key: "colageno", phrase: "se llama colágeno", beats: [
    dg("dg_fe14_colageno", "El colágeno es el andamiaje de tu piel; con los años se fabrica menos y el colchón se hunde: eso es la arruga"),
    c("bars", { w: 2.2, title: "Colágeno de tu piel con los años", unit: "", bars: [
      { label: "A los 25", value: 100, tone: "teal", note: "colchón firme" },
      { label: "A los 60", value: 45, tone: "danger", note: "se hunde = arrugas" } ], at: "el colchón se hunde" }) ]},
  { key: "colchon", phrase: "buena circulación que la lleve", beats: [
    ak([{ word: "COLÁGENO NECESITA CIRCULACIÓN", sub: "sin buena sangre, no le llega el material a la fábrica — por eso el romero trabaja en la raíz", tone: "teal", atPhrase: "arreglar los cimientos" }], {}) ]},
  { key: "mito_crema", phrase: "las cremas más caras", beats: [
    mv("La crema más cara tiene más colágeno y por eso funciona", "El colágeno de una crema es tan grande que casi no entra: se queda arriba", { flipPhrase: "se queda arriba" }) ]},
  // honesty
  { key: "honesto", phrase: "no es magia", beats: [ c("talk", {}),
    c("checklist", { w: 2.2, title: "Seamos claros: el romero SÍ y NO", tone: "teal", items: [
      { text: "SÍ: previene, ilumina, firma poco a poco, alivia", state: "done" },
      { text: "NO: borra de golpe una arruga profunda o una várice grande", state: "warn" },
      { text: "Várice caliente o hinchada de golpe → a tu médico", state: "warn" } ], at: "cuidarte con cabeza" }) ]},
  // receta
  { key: "receta", phrase: "un aceite de romero casero", beats: [ c("talk", {}),
    r("fe14_romero_frasco", { at: "dos cosas nada más", hold: true }),
    c("annotated", { w: 1.6, image: "img/fe14_masaje_facial.png", eyebrow: "Aplícalo así, de noche", caption: "Gotitas y masaje suave hacia arriba: reparte el aceite y activa la circulación", annotations: [
      { label: "Hacia arriba", x: 40, y: 40 }, { label: "En círculos", x: 62, y: 60 } ], at: "yemas de los dedos" }) ]},
  { key: "dos_formas", phrase: "la de las abuelas", beats: [
    c("process", { w: 2.2, title: "Aceite de romero — 2 formas", eyebrow: "Elige la tuya", steps: [
      { title: "Paciente", desc: "romero en aceite, frasco oscuro, 15 días", image: "img/fe14_romero_frasco.png" },
      { title: "Rápida", desc: "baño maría, tibio, 30-40 min, NUNCA hervir", image: "img/fe14_bano_maria.png" },
      { title: "Cuela y guarda", desc: "color verdoso, aroma rico, a un frasquito", image: "img/fe14_aceite_verde.png" } ], at: "baño maría" }) ]},
  { key: "usos", phrase: "cómo lo usas", beats: [
    c("process", { w: 2.0, title: "Un frasco, varios usos", eyebrow: "De noche", steps: [
      { title: "Cara y cuello", desc: "gotitas, masaje hacia arriba, en círculos", image: "img/fe14_masaje_facial.png" },
      { title: "Piernas", desc: "del tobillo a la rodilla, ayuda a subir la sangre", image: "img/fe14_masaje_piernas.png" },
      { title: "Dolores", desc: "masaje tibio en la zona, afloja", image: "img/fe14_masaje_hombro.png" } ], at: "siempre hacia arriba" }) ]},
  { key: "guante", phrase: "el guante de romero", beats: [
    ak([{ word: "EL GUANTE DE ROMERO (MANOS)", sub: "aceite tibio + guantes de algodón para dormir: amanecen suaves y más parejas", tone: "teal", atPhrase: "duermes con ellos" }], {}) ]},
  { key: "tonico", phrase: "como tónico", beats: [
    r("fe14_tonico_spray", { at: "un frasquito con atomizador", hold: true }),
    c("callout", { w: 1.6, image: "img/fe14_tonico_spray.png", figure: "«Agua termal casera»", caption: "Refresca, cierra los poros e ilumina — por centavos.", at: "por centavos" }) ]},
  { key: "cabello", phrase: "el cabello", beats: [
    r("fe14_cuero_cabelludo", { at: "más fuerte", hold: true }) ]},
  // error
  { key: "error", phrase: "te hablé de un error", beats: [ c("talk", {}),
    es("!", "El fuego, la prisa con el fuego", { tone: "warn", w: 3.2, eyebrow: "El error" }) ]},
  { key: "hervir", phrase: "cuando el aceite hierve", beats: [
    ak([{ word: "SI HIERVE, MATA LOS ANTIOXIDANTES", sub: "el calor fuerte destruye lo bueno del romero: tibio, NUNCA hirviendo", tone: "warn", atPhrase: "pierde todas sus vitaminas" }], {}) ]},
  { key: "regar", phrase: "usarlo una sola vez", beats: [
    mv("Una aplicación y espero milagros mañana", "Es como regar una planta: el riego constante, noche tras noche, es el que la pone hermosa", { flipPhrase: "el riego constante" }) ]},
  { key: "industria", phrase: "nombres en francés", beats: [
    ak([{ word: "LA RESPUESTA CRECÍA EN UNA MACETA", sub: "la industria se hizo millonaria vendiéndote frascos con nombres elegantes", tone: "teal", atPhrase: "una maceta" }], {}),
    c("bars", { w: 2.2, title: "Lo que cuesta cuidar tu piel (al año, aprox.)", unit: "", bars: [
      { label: "Cremas de marca", value: 100, tone: "danger", note: "una fortuna" },
      { label: "Ramitas de romero + aceite", value: 4, tone: "teal", note: "unas monedas" } ], at: "una maceta" }) ]},
  // CTA 1
  { key: "injerto1", phrase: "reuní todo lo que sé", beats: [
    lt("Todo esto, ordenado para tu piel", { kicker: "Lo reuní para ti", desc: "Las recetas, las cantidades y los tiempos, y muchos otros remedios de cocina, en una guía con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  // Rosa vuelve
  { key: "rosa_vuelve", phrase: "Te acuerdas de Rosa", beats: [ c("talk", {}),
    r("fe14_rosa_consultorio", { at: "medio incrédula", hold: true }) ]},
  { key: "rosa_cambio", phrase: "entró distinta", beats: [
    c("process", { w: 2.2, title: "El cambio de Rosa", eyebrow: "Constancia, cada noche", steps: [
      { title: "Antes", desc: "3 cremas caras, mirada triste", image: "img/fe14_cremas_caras.png" },
      { title: "Semanas", desc: "piel con brillo, piernas menos pesadas", image: "img/fe14_rosa_feliz.png" },
      { title: "El premio", desc: "«me miro al espejo y me gusto»", image: "img/fe14_espejo_feliz.png" } ], at: "con un brillo que antes" }) ]},
  { key: "rosa_frase", phrase: "me veo viva", beats: [
    lt("«No sé si me quité arrugas, pero me veo viva»", { kicker: "Rosa, 68", desc: "Mi piel se siente firme, mis piernas ya no me pesan, y me miro al espejo y me gusto.", tone: "teal", at: "me miro al espejo" }) ]},
  // secretos
  { key: "s1", phrase: "exfolia suave", beats: [
    es("01", "Exfolia suave (azúcar y miel)", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    r("fe14_exfoliar", { at: "recibir el romero", hold: true }) ]},
  { key: "s2", phrase: "por dentro también", beats: [
    c("splitlist", { w: 2.0, title: "Belleza de adentro y de afuera", items: ["Por fuera: tu aceite de romero, cada noche", "Por dentro: agua, fruta y verdura de colores; buen sueño"], tone: "teal", at: "el doble" }) ]},
  { key: "s3", phrase: "la constancia y el cariño", beats: [
    es("03", "Constancia y cariño", { tone: "teal", w: 3.0, eyebrow: "Secreto" }),
    ak([{ word: "UN RITUAL PARA TI, CADA NOCHE", sub: "Rosa no rejuveneció en un día — se dedicó unos minutos a sí misma. Está a tu alcance.", tone: "teal", atPhrase: "al alcance tuyo" }], {}) ]},
  // CTA 2
  { key: "injerto2", phrase: "un método completo", beats: [
    fz("fe14_libro_guia", { at: "reuní todo para ti", kicker: "Método completo · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: cuidarte para siempre", { kicker: "Sin depender de la farmacia", desc: "No es un gasto en un frasco: es aprender a cuidarte sola, sin vaciar tu bolsillo. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "para siempre" }) ]},
  // cierre
  { key: "despedida", phrase: "hagamos algo juntas", beats: [ c("talk", {}) ]},
  { key: "merezco", phrase: "me lo merezco", beats: [
    fc([{ t: "Me" }, { t: "estoy" }, { t: "cuidando." }, { t: "Me" }, { t: "lo" }, { t: "MEREZCO", hl: true }], { tone: "teal", at: "me lo merezco" }) ]},
  { key: "cta_coment", phrase: "suscríbete a este canal", beats: [
    lt("¿Cuánto gastaste en cremas que no cumplieron? Cuéntame", { kicker: "Déjame un me gusta", desc: "Suscríbete y compártelo con esa amiga o hermana que se gasta una fortuna en cremas y ya se resignó. Puede que le regales algo hermoso.", tone: "teal", at: "compártelo con esa amiga" }) ]},
  { key: "cierre", phrase: "nos vemos muy pronto", beats: [
    c("nametag", { name: "Dr. Federer", role: "Esta noche: una ramita de romero y unos minutos para ti", image: "img/fe14_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer14_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer14.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer14.json", "utf8"));
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer14/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer14.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer14_beats.ts", `export const FED14_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer14_hooks.ts", `export const TALKS14: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer14.json", JSON.stringify({ video: "federer14", avatar: "federer14_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
