// gen_federer12.mjs — beatsheet federer12 (Federer Archivos · PROTEÍNA/MÚSCULO · sarcopenia +60).
// Avatar federer12_opt.mp4 (~21.9min). MINUTO 1 IMPLACABLE = ingesta del plan del DIRECTOR
// (public/broll/min1_plan_federer12.json): cada beat <2s, avatarfull→talk, scrim→frasecinetica,
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
const MIN1 = JSON.parse(fs.readFileSync("public/broll/min1_plan_federer12.json", "utf8"));
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
  else if (b.kind === "hero") { const nm = `fe12_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) + HERO_STYLE }); beat = r(nm, { hold: false }); }
  else if (b.kind === "bignum") { beat = c("stat", { big: String(b.content), label: "", tone: "warn" }); }
  else if (b.kind === "diagram") { const nm = `dg_fe12_min1_${hi++}`; heroPrompts.push({ name: nm, prompt: String(b.content) }); beat = dg(nm, ""); }
  else continue;
  min1Sections.push({ key: `m1_${mi++}`, phrase: b.at, beats: [beat], min1: true });
}
min1Sections[0].start = 0.4; // ancla dura del primer beat

// ── RESTO DEL VIDEO (65s → fin): secciones normales del guion ───────────
const REST = [
  { key: "quebro", phrase: "se le quebró la voz", beats: [ c("talk", {}) ]},
  { key: "dignidad", phrase: "perder su dignidad", beats: [
    ak([{ word: "NO ERA VANIDAD. ERA SU DIGNIDAD", sub: "para un hombre así, no poder levantarse solo es empezar a sentirse una carga", tone: "warn", atPhrase: "ser una carga" }], {}) ]},
  { key: "no_edad", phrase: "no es simplemente", beats: [ c("talk", {}),
    mv("Esta debilidad es solo 'la edad'", "Tiene nombre, se puede frenar y muchas veces REVERTIR, incluso a los 90", { flipPhrase: "se puede revertir" }) ]},
  { key: "sarcopenia", phrase: "se llama sarcopenia", beats: [
    ak([{ word: "SARCOPENIA", sub: "la pérdida de músculo con la edad — el ladrón silencioso de tu independencia", tone: "warn", atPhrase: "la pérdida de músculo" }], {}) ]},
  { key: "porcentaje", phrase: "masa muscular", beats: [
    c("stat", { big: "3–5%", label: "de tu músculo puedes perder por década después de los 60 si no haces nada", tone: "warn", at: "no haces nada para evitarlo" }) ]},
  { key: "banco", phrase: "una cuenta de banco", beats: [
    dg("dg_fe12_banco", "Tus músculos son una cuenta: de joven depositas más de lo que retiras; con los años, al revés") ]},
  { key: "tres_cosas", phrase: "tres cosas al mismo tiempo", beats: [ c("talk", {}) ]},
  { key: "sordo", phrase: "un poco sordo", beats: [
    dg("dg_fe12_resistencia", "Tu cuerpo se vuelve 'sordo' a la proteína: necesita más materia prima para el mismo músculo") ]},
  { key: "comes_menos", phrase: "comes menos proteína", beats: [
    c("splitlist", { title: "Comes menos proteína sin notarlo", items: ["Más pan, más sopa, más café con galletas", "Menos carne, huevo, lo que construye músculo"], tone: "warn", at: "van quedando de lado" }) ]},
  { key: "te_mueves", phrase: "te mueves menos", beats: [
    ak([{ word: "LO QUE NO SE USA, SE PIERDE", sub: "el músculo es un inquilino exigente: si no le pides fuerza, se va", tone: "warn", atPhrase: "deja de gastar energía" }], {}) ]},
  { key: "tres_influir", phrase: "en las TRES puedes influir", beats: [
    c("chips", { title: "No es 'la edad', es fisiología", chips: ["Cuerpo sordo a la proteína", "Comes poca proteína", "Te mueves poco"], tone: "teal", at: "desde tu cocina" }) ]},
  // stakes: caída → cadera → hospital
  { key: "seguro_vida", phrase: "son tu seguro de vida", beats: [ c("talk", {}),
    ak([{ word: "TUS MÚSCULOS SON TU SEGURO DE VIDA", sub: "no es vanidad: unas piernas fuertes te salvan de la caída", tone: "warn", atPhrase: "tus músculos son tu seguro" }], {}) ]},
  { key: "caida", phrase: "por qué se cae la gente", beats: [
    dg("dg_fe12_caida", "Piernas sin músculo no reaccionan a tiempo → caída → cadera rota → hospital → más pérdida") ]},
  { key: "cadera", phrase: "una cadera rota", beats: [
    r("fe12_cadera_hospital", { at: "significa hospital", hold: true }) ]},
  { key: "pozo", phrase: "semanas en cama", beats: [
    c("bars", { w: 2.0, title: "Músculo que se pierde en cama (aprox.)", unit: "", bars: [
      { label: "1 semana en cama +70 años", value: 100, tone: "danger", note: "mucho, muy rápido" },
      { label: "Recuperarlo después", value: 40, tone: "teal", note: "cuesta el triple" } ], at: "pierdes todavía más músculo" }) ]},
  { key: "marta", phrase: "Doña Marta", beats: [
    r("fe12_marta_consultorio", { at: "muerta de miedo", kicker: "Doña Marta, 74 — su hermana se cayó", hold: true }) ]},
  { key: "marta_hoy", phrase: "sin agarrarse del pasamanos", beats: [
    r("fe12_marta_escaleras", { at: "sube y baja las escaleras", hold: true }) ]},
  // safety
  { key: "urgencia", phrase: "una urgencia", beats: [
    c("checklist", { title: "Esto NO es sarcopenia — es urgencia, ve ya al médico", tone: "warn", items: [
      { text: "Debilidad fuerte en UN solo lado", state: "warn" },
      { text: "Se te cae algo de la mano sin razón", state: "warn" },
      { text: "Dificultad para hablar", state: "warn" } ], at: "tienes que ir al médico" }) ]},
  // reveal
  { key: "recete_alfredo", phrase: "lo que le receté", beats: [ c("talk", {}),
    r("fe12_alfredo_incredulo", { at: "me está tomando el pelo", kicker: "Tan simple que no lo creyó" }) ]},
  { key: "ladrillos", phrase: "los ladrillos", beats: [
    dg("dg_fe12_ladrillos", "La proteína son los ladrillos: sin ellos, aunque hagas ejercicio, tu cuerpo no construye nada") ]},
  { key: "lenteja", phrase: "la humilde lenteja", beats: [
    es("01", "Lenteja — la carne de los pobres", { tone: "teal", w: 3.0, eyebrow: "Campeona" }),
    r("fe12_lentejas_plato", { at: "compite con la carne", hold: true }),
    c("bars", { w: 2.2, title: "Proteína (g por porción, aprox.)", unit: "g", bars: [
      { label: "Sardinas (lata)", value: 22, tone: "teal", note: "+ vitamina D" },
      { label: "Lentejas cocidas", value: 18, tone: "teal", note: "por centavos" },
      { label: "Huevo (1)", value: 6, tone: "teal" } ], at: "compite con la carne" }) ]},
  { key: "lenteja_arroz", phrase: "Lenteja con arroz", beats: [
    dg("dg_fe12_completa", "Lenteja + arroz = proteína COMPLETA, tan buena como un bistec, por centavos") ]},
  { key: "huevo", phrase: "el huevo", beats: [
    es("02", "Huevo — la proteína más perfecta", { tone: "teal", w: 3.0, eyebrow: "Campeona" }),
    r("fe12_huevos", { at: "oro puro para tus músculos", hold: true }) ]},
  { key: "sardina", phrase: "el pescado barato", beats: [
    es("03", "Sardina — ladrillos + vitamina D", { tone: "teal", w: 3.0, eyebrow: "Campeona" }),
    r("fe12_sardinas_lata", { at: "vienen en lata", hold: true }),
    c("callout", { image: "img/fe12_sardinas_lata.png", figure: "«Doble regalo»", caption: "Proteína de primera + vitamina D + omega 3, en una lata baratísima.", at: "vitamina D y omega tres" }) ]},
  { key: "vitd", phrase: "el capataz de la obra", beats: [
    dg("dg_fe12_vitd", "La vitamina D es el capataz: sin ella, aunque tengas los ladrillos, los albañiles no trabajan") ]},
  { key: "cuando", phrase: "El CUÁNDO", beats: [ c("talk", {}),
    ak([{ word: "NO ES SOLO QUÉ — ES CUÁNDO", sub: "casi ningún médico se toma el tiempo de explicarte esto", tone: "teal", atPhrase: "casi ningún médico" }], {}) ]},
  { key: "vaso", phrase: "un vaso de agua", beats: [
    dg("dg_fe12_reparto", "Toda la proteína de golpe en la cena se desperdicia; repartida en el día, tu cuerpo la aprovecha"),
    c("splitlist", { w: 1.6, title: "El secreto está en el CUÁNDO", items: ["❌ Toda la proteína de golpe en la cena → se desperdicia", "✅ Repartida en las 3 comidas → tu cuerpo la aprovecha"], tone: "teal", at: "la mayor parte se desperdicia" }) ]},
  { key: "desayuno", phrase: "un desayuno con proteína", beats: [
    r("fe12_desayuno_proteina", { at: "despierta a tus músculos", hold: true }),
    c("annotated", { image: "img/fe12_desayuno_proteina.png", eyebrow: "El desayuno que despierta el músculo", caption: "Empieza el día con proteína, no solo café y pan", annotations: [
      { label: "Huevo", x: 34, y: 46 }, { label: "Algo de fruta", x: 66, y: 58 } ], at: "señal que despierta" }) ]},
  { key: "dia_plan", phrase: "un día común de tu vida", beats: [
    c("process", { w: 1.6, title: "Tu día con proteína repartida", eyebrow: "Sin gastar más", steps: [
      { title: "Desayuno", desc: "un huevo o frijol, despierta el músculo", image: "img/fe12_huevos.png" },
      { title: "Comida", desc: "lentejas con arroz, o pollo, o pescado", image: "img/fe12_lentejas_plato.png" },
      { title: "Cena", desc: "ligera, pero con su proteína", image: "img/fe12_sardinas_lata.png" } ], at: "acomodar la proteína a lo largo" }) ]},
  { key: "movimiento", phrase: "no te asustes", beats: [
    ak([{ word: "LEVÁNTATE DE LA SILLA 10 VECES", sub: "no es gimnasio: el músculo solo escucha la proteína si lo usas", tone: "teal", atPhrase: "levantarte y sentarte" }], {}) ]},
  { key: "batidos", phrase: "batidos de proteína carísimos", beats: [
    mv("Necesito batidos caros de gimnasio", "Un huevo, lentejas y una lata de sardinas le ganan a la mayoría de esos polvos", { flipPhrase: "por una fracción del precio" }) ]},
  // error
  { key: "error", phrase: "un error carísimo", beats: [ c("talk", {}),
    es("!", "«Ya es demasiado tarde»", { tone: "warn", w: 3.2, eyebrow: "El error" }) ]},
  { key: "noventa", phrase: "dejaron el bastón", beats: [
    c("stat", { big: "90+", label: "personas de más de 90 ganaron fuerza y dejaron el bastón en semanas", tone: "teal", at: "ganaron fuerza" }),
    c("bars", { w: 2.0, title: "Nunca es tarde — fuerza en semanas", unit: "", bars: [
      { label: "Si te resignas ('ya para qué')", value: 15, tone: "danger", note: "sigues perdiendo" },
      { label: "Si empiezas hoy, a cualquier edad", value: 90, tone: "teal", note: "el cuerpo responde" } ], at: "empezaron a comer bien" }) ]},
  { key: "rendicion", phrase: "por la rendición", beats: [
    fc([{ t: "Nunca" }, { t: "es" }, { t: "demasiado" }, { t: "TARDE", hl: true }], { tone: "teal", at: "nunca es demasiado tarde" }) ]},
  // CTA 1
  { key: "injerto1", phrase: "mantener tu cuerpo fuerte", beats: [
    lt("Todo esto, ordenado para tu edad", { kicker: "Lo reuní para ti", desc: "Qué comer, cuánto y en qué momento, y los movimientos que hacen la diferencia — en una guía sencilla con letra grande. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }) ]},
  // Alfredo vuelve
  { key: "alfredo_vuelve", phrase: "le expliqué exactamente", beats: [ c("talk", {}),
    r("fe12_alfredo_plan", { at: "su lenteja con arroz", hold: true }) ]},
  { key: "alfredo_silla", phrase: "de su sillón", beats: [
    c("process", { w: 1.6, title: "El cambio de Don Alfredo", eyebrow: "10 veces cada mañana", steps: [
      { title: "Semana 1", desc: "le costaba pararse 3 veces", image: "img/fe12_alfredo_incredulo.png" },
      { title: "Semana 6", desc: "se levanta sin pensarlo", image: "img/fe12_alfredo_plan.png" },
      { title: "El premio", desc: "cargó a su nieto hasta el techo", image: "img/fe12_alfredo_nieto.png" } ], at: "seis semanas" }) ]},
  { key: "nieto", phrase: "cargué a mi nieto", beats: [
    lt("«Cargué a mi nieto y lo levanté, como cuando era joven»", { kicker: "Don Alfredo", desc: "Y me levanto de mi sillón sin pensarlo. Ni me acuerdo de que no podía.", tone: "teal", at: "sin pensarlo" }) ]},
  // consejos
  { key: "sueno", phrase: "cuida el sueño", beats: [
    es("01", "Cuida el sueño", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    r("fe12_dormir", { at: "reconstrucción", hold: true }) ]},
  { key: "sol", phrase: "al sol de la mañana", beats: [
    es("02", "Sol suave de la mañana (vitamina D)", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    r("fe12_sol_manana", { at: "fabricar esa vitamina D", hold: true }) ]},
  { key: "constancia", phrase: "la constancia", beats: [
    es("03", "La constancia", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    ak([{ word: "NO FALLÓ NI UNA MAÑANA", sub: "Don Alfredo no ganó fuerza en un día — la ganó por constancia. Está a tu alcance.", tone: "teal", atPhrase: "está al alcance tuyo" }], {}),
    c("process", { w: 1.4, title: "Tus 3 llaves para no perder fuerza", eyebrow: "Simple y diario", steps: [
      { title: "Proteína", desc: "repartida, empezando por el desayuno", image: "img/fe12_huevos.png" },
      { title: "Movimiento", desc: "levántate de la silla, camina", image: "img/fe12_desayuno_proteina.png" },
      { title: "Descanso y sol", desc: "duerme bien, vitamina D", image: "img/fe12_dormir.png" } ], at: "cariño diario" }) ]},
  // CTA 2
  { key: "injerto2", phrase: "un plan entero", beats: [
    fz("fe12_libro_guia", { at: "tres guías que se acompañan", kicker: "Las 3 guías · enlace arriba en la descripción", link: "drfederer.com" }) ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: tu independencia", { kicker: "Para no depender de nadie", desc: "No es una inversión en un producto: es poder levantarte solo, cargar a tus nietos, tu libertad. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "en tu libertad" }) ]},
  // cierre
  { key: "despedida", phrase: "Antes de despedirme", beats: [ c("talk", {}) ]},
  { key: "primer_ladrillo", phrase: "el primer ladrillo", beats: [
    fc([{ t: "Empieza" }, { t: "mañana." }, { t: "En" }, { t: "el" }, { t: "DESAYUNO", hl: true }], { tone: "teal", at: "empieza mañana" }) ]},
  { key: "cta_coment", phrase: "suscríbete a este canal", beats: [
    lt("¿Te cuesta levantarte de la silla? Cuéntame abajo", { kicker: "Déjame un me gusta", desc: "Suscríbete y compártelo con alguien que anda perdiendo fuerza y ya se resignó a 'la edad'. Puede que le devuelvas su independencia.", tone: "teal", at: "compártelo con esa persona" }) ]},
  { key: "cierre", phrase: "en el desayuno", beats: [
    c("nametag", { name: "Dr. Federer", role: "Mañana, en el desayuno, ya sabes lo que tienes que hacer", image: "img/fe12_federer_cocina.png" }) ]},
];

const SECTIONS = [...min1Sections, ...REST];

// escribir insumos para imágenes + b-roll del minuto 1
fs.writeFileSync("public/img/prompts_federer12_min1.json", JSON.stringify(heroPrompts, null, 1));
fs.writeFileSync("public/broll/min1_broll_federer12.json", JSON.stringify(min1Broll, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer12.json", "utf8"));
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
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/federer12/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer12.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN (excepto minuto 1: dejamos beats cortos <2s)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/federer12_beats.ts", `export const FED12_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer12_hooks.ts", `export const TALKS12: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer12.json", JSON.stringify({ video: "federer12", avatar: "federer12_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const min1beats = beats.filter(b => b.start < 65).length;
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 20));
console.log(`beats: ${beats.length} · minuto1: ${min1beats} beats · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts: ${heroPrompts.length} · min1Broll: ${min1Broll.length}`);
