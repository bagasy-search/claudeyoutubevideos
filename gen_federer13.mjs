// gen_federer13.mjs — beatsheet federer13 (Federer Archivos · PROTEÍNA/MÚSCULO · sarcopenia +60).
// Avatar federer13_opt.mp4 (~21.9min). MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer13.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer13.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe13_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe13_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  { key: "coladores", phrase: "del tamaño de tu puño", beats: [ c("talk", {}),
    dg("dg_fe13_coladores", "Dos coladores del tamaño de tu puño filtran TODA tu sangre, día y noche, sin descanso") ]},
  { key: "menos_finos", phrase: "menos finos", beats: [
    dg("dg_fe13_desgaste", "Con los años, la presión y el azúcar castigan esos filtros delicados y se cansan") ]},
  { key: "no_duelen", phrase: "los riñones no duelen", beats: [
    ak([{ word: "LOS RIÑONES NO DUELEN", sub: "pueden trabajar a la mitad y tú sentirte 'normal' — por eso es la asesina silenciosa", tone: "warn", atPhrase: "trabajando a la mitad" }], {}) ]},
  { key: "asesina", phrase: "la asesina silenciosa", beats: [
    c("stat", { big: "50%", label: "de función pueden perder tus riñones SIN avisar con dolor", tone: "warn", at: "ya perdiste mucho camino" }),
    c("bars", { w: 2.4, title: "El riñón no avisa con dolor", unit: "", bars: [
      { label: "Función que puede perderse en silencio", value: 50, tone: "danger", note: "sin síntomas claros" },
      { label: "Cuando por fin da la cara", value: 20, tone: "danger", note: "ya perdiste camino" } ], at: "trabajando a la mitad" }) ]},
  { key: "senales", phrase: "señales sutiles", beats: [
    c("checklist", { w: 1.6, title: "Cómo tus riñones piden ayuda", tone: "warn", items: [
      { text: "Cansancio que no se va con el descanso", state: "warn" },
      { text: "Hinchazón en pies, tobillos y cara", state: "warn" },
      { text: "Espuma en la orina", state: "warn" },
      { text: "Picazón en la piel, mal sabor de boca", state: "warn" } ], at: "achacamos a la edad" }) ]},
  { key: "espuma_mec", phrase: "escapando proteínas", beats: [
    dg("dg_fe13_espuma", "La espuma en la orina = proteínas que se escapan por el filtro roto") ]},
  // stakes: diálisis
  { key: "camino", phrase: "el camino que hay al final", beats: [ c("talk", {}),
    r("fe13_dialisis", { at: "conectarse a una máquina", hold: true }) ]},
  { key: "dialisis", phrase: "La diálisis", beats: [
    ak([{ word: "MUCHOS CASOS SE PODÍAN EVITAR", sub: "con cosas simples, a tiempo — esa es la noticia hermosa: si tus riñones aún funcionan, estás a tiempo", tone: "teal", atPhrase: "estás a tiempo" }], {}) ]},
  // miedos
  { key: "miedos", phrase: "voy a hinchar", beats: [
    mv("Si tomo mucha agua, me voy a hinchar", "Al revés: cuando NO tomas agua, tu cuerpo la retiene y te hinchas MÁS", { flipPhrase: "es al revés" }) ]},
  // safety
  { key: "safety", phrase: "enfermedad renal", beats: [
    lt("¿Ya tienes enfermedad renal o diálisis? Habla con tu médico", { kicker: "Importante", desc: "Si tienes dieta baja en potasio o líquidos limitados, algunas de estas bebidas podrían NO convenirte. En tu caso, manda tu médico.", tone: "warn", at: "lo que manda es tu médico" }) ]},
  // 7 bebidas
  { key: "b1", phrase: "el agua pura", beats: [
    es("01", "Agua pura, a sorbos", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_agua_sorbos", { at: "a sorbos", hold: true }),
    c("annotated", { w: 1.4, image: "img/fe13_agua_sorbos.png", eyebrow: "La reina de las bebidas", caption: "Arrastra la basura y evita las piedras — la clave es el CÓMO", annotations: [
      { label: "A sorbos", x: 40, y: 40 }, { label: "Todo el día", x: 64, y: 62 } ], at: "arrastrar la basura" }) ]},
  { key: "b1_como", phrase: "no es tomarte dos litros", beats: [
    c("splitlist", { w: 1.6, title: "El agua, bien tomada", items: ["❌ Dos litros de golpe → contraproducente", "✅ A sorbos todo el día → un río tranquilo para el riñón"], tone: "teal", at: "un río tranquilo" }) ]},
  { key: "b2", phrase: "agua tibia con limón", beats: [
    es("02", "Agua tibia con limón (en ayunas)", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_limon_agua", { at: "el jugo de medio limón", hold: true }) ]},
  { key: "b2_mec", phrase: "tiene citrato", beats: [
    dg("dg_fe13_citrato", "El citrato del limón es un guardaespaldas: evita que se formen piedras en el riñón") ]},
  { key: "b3", phrase: "la infusión de perejil", beats: [
    es("03", "Infusión de perejil", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_perejil_infusion", { at: "diuréticos naturales más suaves", hold: true }) ]},
  { key: "b4", phrase: "el agua de jamaica", beats: [
    es("04", "Agua de jamaica (SIN azúcar)", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_jamaica", { at: "flor roja", hold: true }),
    c("callout", { w: 1.6, image: "img/fe13_jamaica.png", figure: "«Sin azúcar»", caption: "Antioxidantes y una mano a la presión. Con azúcar, hace más mal que bien.", at: "sin azúcar" }) ]},
  { key: "b5", phrase: "el agua de jengibre", beats: [
    es("05", "Agua de jengibre", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_jengibre", { at: "antiinflamatorio de la naturaleza", hold: true }) ]},
  { key: "b6", phrase: "el jugo de arándano", beats: [
    es("06", "Arándano diluido, sin azúcar", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_arandano", { at: "vías urinarias", hold: true }) ]},
  { key: "b7", phrase: "cola de caballo", beats: [
    es("07", "Cola de caballo o té verde", { tone: "teal", w: 3.0, eyebrow: "Bebida" }),
    r("fe13_cola_caballo", { at: "con moderación", hold: true }) ]},
  { key: "reparto", phrase: "no soltar nunca el agua", beats: [
    c("process", { w: 2.4, title: "Tus bebidas en el día", eyebrow: "Sin enredarte", steps: [
      { title: "Al despertar", desc: "agua tibia con limón", image: "img/fe13_limon_agua.png" },
      { title: "Media mañana", desc: "infusión de perejil o jengibre", image: "img/fe13_perejil_infusion.png" },
      { title: "Tarde", desc: "jamaica sin azúcar; agua a sorbos siempre", image: "img/fe13_jamaica.png" } ], at: "no soltar nunca el agua" }) ]},
  // error
  { key: "error", phrase: "contarte el error", beats: [ c("talk", {}),
    es("!", "Los refrescos", { tone: "warn", w: 3.2, eyebrow: "El error" }) ]},
  { key: "refresco", phrase: "las gaseosas", beats: [
    r("fe13_refresco", { at: "una montaña de azúcar", hold: true }),
    c("bars", { w: 2.8, title: "Lo que castiga a tus riñones", unit: "", bars: [
      { label: "Refresco de cola (azúcar + fosfatos)", value: 100, tone: "danger", note: "arena al motor" },
      { label: "Agua con limón", value: 8, tone: "teal", note: "el cambio de oro" } ], at: "fosforo anadido" }) ]},
  { key: "sal", phrase: "el exceso de sal", beats: [
    c("bars", { w: 2.4, title: "Sal escondida (mg sodio, aprox.)", unit: "mg", bars: [
      { label: "Sopa de sobre / cubito", value: 1200, tone: "danger" },
      { label: "Embutidos", value: 900, tone: "danger" },
      { label: "Comida casera", value: 250, tone: "teal", note: "así sí" } ], at: "trabajar el triple" }) ]},
  { key: "analgesicos", phrase: "pastillas para el dolor", beats: [
    ak([{ word: "OJO CON LOS ANTIINFLAMATORIOS", sub: "tomados a diario y por tu cuenta, son duros con el riñón — habla con tu médico", tone: "warn", atPhrase: "duras con el riñón" }], {}) ]},
  // CTA 1
  { key: "injerto1", phrase: "lo que se sobre", beats: [
    lt("Todo esto, ordenado para tu edad", { kicker: "Lo reuní para ti", desc: "Tus riñones, tu presión, tu hígado y tu energía, en una guía sencilla con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  // Remedios vuelve
  { key: "remedios_vuelve", phrase: "acuerdas de Doña Remedios", beats: [ c("talk", {}),
    r("fe13_remedios_consultorio", { at: "la señora dulce", hold: true }) ]},
  { key: "remedios_cambio", phrase: "con color en la cara", beats: [
    c("process", { w: 2.2, title: "El cambio de Doña Remedios", eyebrow: "Soltó el refresco, sumó las bebidas", steps: [
      { title: "Antes", desc: "cansada, pies hinchados, espuma", image: "img/fe13_remedios_consultorio.png" },
      { title: "Semanas", desc: "menos hinchazón, más energía", image: "img/fe13_remedios_feliz.png" },
      { title: "Clave", desc: "y su médico le revisó los riñones", image: "img/fe13_analisis.png" } ], at: "ya casi no se me hinchan" }) ]},
  { key: "gracias", phrase: "gracias por no decirme", beats: [
    lt("«Gracias por decirme que todavía podía hacer algo»", { kicker: "Doña Remedios", desc: "Ya casi no se me hinchan los pies, me levanto con energía, y la espumita casi ni la veo.", tone: "teal", at: "todavía podía hacer algo" }) ]},
  // consejos
  { key: "c1", phrase: "se vuelve floja", beats: [
    es("01", "No esperes la sed", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    r("fe13_vaso_agua", { at: "ten tu vaso cerca", hold: true }) ]},
  { key: "c2", phrase: "una o dos veces al año", beats: [
    es("02", "Un análisis 1-2 veces al año", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    ak([{ word: "EL RIÑÓN NO AVISA — EL ANÁLISIS SÍ", sub: "barato, rápido, casi no duele, y te quita el pendiente", tone: "teal", atPhrase: "el único que le puede tomar el pulso" }], {}) ]},
  { key: "amigos", phrase: "dos grandes amigos", beats: [
    ak([{ word: "PRESIÓN Y AZÚCAR: LOS 2 LADRONES", sub: "controlarlos hace más por tus riñones que cualquier tecito", tone: "warn", atPhrase: "más riñones dañan" }], {}),
    c("splitlist", { w: 2.0, title: "Los 2 mejores amigos de tus riñones", items: ["Presión controlada → menos castigo al filtro", "Azúcar controlada → filtros que duran"], tone: "teal", at: "presión y azúcar en su lugar" }) ]},
  { key: "c3", phrase: "la constancia", beats: [
    es("03", "La constancia", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    c("process", { w: 1.4, title: "Tus llaves para el riñón", eyebrow: "Diario y simple", steps: [
      { title: "Bebe", desc: "agua a sorbos + tus infusiones", image: "img/fe13_agua_sorbos.png" },
      { title: "Suelta", desc: "el refresco y la sal de más", image: "img/fe13_refresco.png" },
      { title: "Controla", desc: "presión y azúcar, con tu médico", image: "img/fe13_limon_agua.png" } ], at: "no falló ni un día" }) ]},
  // CTA 2
  { key: "injerto2", phrase: "un plan completo", beats: [
    fz("fe13_libro_guia", { at: "tres guías que se acompañan", kicker: "Las 3 guías · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "no es un gasto", beats: [
    lt("La mejor inversión: tu tranquilidad", { kicker: "Cuida tu planta de limpieza", desc: "No es un gasto: es no terminar en ese camino difícil. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "es tu tranquilidad" }) ]},
  // cierre
  { key: "despedida", phrase: "sírvete un vaso de agua", beats: [ c("talk", {}) ]},
  { key: "no_resignes", phrase: "nunca te resignes", beats: [
    fc([{ t: "Empieza" }, { t: "hoy." }, { t: "Con" }, { t: "un" }, { t: "VASO", hl: true }, { t: "de" }, { t: "agua" }], { tone: "teal", at: "empieza hoy" }) ]},
  { key: "cta_coment", phrase: "suscríbete a este canal", beats: [
    lt("¿Siempre cansado e hinchado? Cuéntame abajo", { kicker: "Déjame un me gusta", desc: "Suscríbete y compártelo con quien cree que 'es la edad'. Puede que le abras los ojos a tiempo.", tone: "teal", at: "compártelo con esa persona" }) ]},
  { key: "cierre", phrase: "por ese vaso de agua", beats: [
    c("nametag", { name: "Dr. Federer", role: "Ahora mismo: ve por ese vaso de agua", image: "img/fe13_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer13_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer13.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer13.json", "utf8"));
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer13/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer13.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer13_beats.ts", `export const FED13_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer13_hooks.ts", `export const TALKS13: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer13.json", JSON.stringify({ video: "federer13", avatar: "federer13_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
