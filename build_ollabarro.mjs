// build_ollabarro.mjs — "Este TRUCO Amish de 5 dólares te hará tener la Mejor Huerta del Vecindario"
// Canal Levi Lapp Jardín (ES). STOCK-FIRST (Pexels) + IA solo para el presentador Levi
// + AVATAR full en tramos retóricos + kit premium THEME_EARTH. Truco = olla de barro enterrada.
// NO vende producto directo en voz → CTA = guía + suscripción (sin precio ni link en voz).
// Salida: beatsheet/ollabarro.json + avatar_ollabarro.gen.ts → node beatsheet.mjs beatsheet/ollabarro.json
import fs from "fs";

const SLUG = "ollabarro";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase.slice(0, 55)); return v; };
const AV_DUR = 1344.0; // duración exacta del avatar (ffprobe) — el TOTAL no la supera (evita cola negra)
const TOTAL = Math.min(+((Wc[Wc.length - 1].e) / 1000 + 0.6).toFixed(2), AV_DUR);

// ── momentos (stock|photo) con phrase ──
const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const exists = (p) => fs.existsSync("public/" + p);
const photoAsset = (name) => {
  for (const ext of ["jpg", "png", "jpeg", "webp"]) if (exists(`img/${SLUG}_${name}.${ext}`)) return `img/${SLUG}_${name}.${ext}`;
  return null;
};

// ── POOL de assets reales (clips broll + fotos img), con tokens de tema ──
// No hay clip único por cada uno de los 190 beats (Pexels tiene b-roll de huerta
// limitado + dedup). Como un editor real, distribuimos un POOL de assets tópicos
// por los beats: cada beat toma su asset propio si existe, si no el del pool con
// más solape de sustantivos, penalizando el reuso reciente (nunca dos seguidos).
const poolMeta = (() => { try { return JSON.parse(fs.readFileSync(`_v3/${SLUG}_pool.json`, "utf8")); } catch { return []; } })();
const topicByBase = {};
for (const p of poolMeta) topicByBase[p.name.replace(new RegExp(`^${SLUG}_`), "")] = p.query || "";
for (const m of moments) if (m.query) topicByBase[m.name] = topicByBase[m.name] || m.query;
const STOP = new Set("garden gardens plant plants water soil hands close shot person people the and with into over near around a of in on for una un el la los las de del al con y en".split(" "));
const toks = (s) => norm(s || "").split(" ").filter((w) => w.length > 2 && !STOP.has(w));
const ASSETS = [];
for (const f of fs.readdirSync("public/broll")) {
  const mm = f.match(new RegExp(`^${SLUG}_(.+)\\.mp4$`));
  if (mm) ASSETS.push({ src: `broll/${f}`, base: mm[1], isVid: true, tk: toks(topicByBase[mm[1]] || mm[1]) });
}
for (const f of fs.readdirSync("public/img")) {
  const mm = f.match(new RegExp(`^${SLUG}_(.+)\\.(jpg|jpeg|png|webp)$`, "i"));
  if (mm) ASSETS.push({ src: `img/${f}`, base: mm[1], isVid: false, tk: toks(topicByBase[mm[1]] || mm[1]) });
}
console.log(`pool de assets reales: ${ASSETS.filter(a => a.isVid).length} clips + ${ASSETS.filter(a => !a.isVid).length} fotos`);

const recent = [];
const pickAsset = (beat) => {
  const bt = toks(beat.query || beat.phrase);
  let best = null, bs = 0.5; // umbral mínimo de relevancia
  for (const a of ASSETS) {
    if (!a.tk.length) continue;
    let ov = 0; for (const t of a.tk) if (bt.includes(t)) ov++;
    if (a.base === beat.name) ov += 6; // asset propio del beat → gana
    if (ov <= 0) continue;
    let score = ov + (a.isVid ? 0.4 : 0);
    const ri = recent.indexOf(a.src); if (ri >= 0) score -= (6 - ri) * 1.5; // penaliza reuso reciente
    if (score > bs) { bs = score; best = a; }
  }
  if (best) { recent.push(best.src); if (recent.length > 6) recent.shift(); }
  return best;
};

const rawBeats = [];
for (let i = 0; i < moments.length; i++) {
  const m = moments[i];
  if (m.personal) continue; // lo cubre el avatar full
  const t = m.ms != null ? m.ms / 1000 : at(m.phrase);
  if (t == null) continue;
  const startNext = i + 1 < moments.length ? (moments[i + 1].ms != null ? moments[i + 1].ms / 1000 : (at(moments[i + 1].phrase) ?? t + 6)) : TOTAL;
  const span = +(startNext - t).toFixed(2);
  const a = pickAsset(m);
  if (!a) continue; // sin match tópico → avatar
  rawBeats.push({ id: `${SLUG}_${m.name}`, start: +t.toFixed(2), kind: "raw", src: a.src, hue: "amber", darken: 0, ...(a.isVid ? { noSplit: true } : {}), _span: span });
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  const gapToNext = next - rawBeats[i].start;
  rawBeats[i].dur = +Math.max(0.8, Math.min(rawBeats[i]._span + 0.3, gapToNext + 0.3, 9)).toFixed(2);
  delete rawBeats[i]._span;
}
const nClip = rawBeats.filter((b) => b.src.endsWith(".mp4")).length;
console.log(`b-roll: ${nClip} clips stock + ${rawBeats.length - nClip} fotos IA · ${moments.length} momentos`);

const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// ── COMPONENTES (kit premium THEME_EARTH), anclados al TEXTO REAL de las captions ──
const PREMIUM = [
  // ── HOOK ──
  P("HighlightSweep", "tu vecino tiene la huerta", 5.0, "top", {
    pre: "Del otro lado del cerco,", highlight: "tu vecino casi no riega", post: ".", note: "y tiene la huerta más verde de la cuadra",
  }, 5),
  P("BigStatReveal", "cuesta menos de cinco dolares", 5.0, "topLeft", {
    eyebrow: "El secreto entero", value: 5, suffix: " dólares", support: "una sola cosa que enterrás una vez, y tu huerta se riega prácticamente sola",
  }, 5),
  P("HighlightSweep", "el unico error que casi todos cometen", 4.8, "top", {
    pre: "Hay", highlight: "un solo error", post: " que arruina todo.", note: "tan tonto que la gente cree que es un cuento — te lo muestro al final",
  }, 7),

  // ── QUIÉN / ORIGEN ──
  P("PullQuote", "el que aprende a regar con una olla de", 5.6, "topLeft", {
    quote: "El que aprende a regar con una olla de barro, nunca más en su vida le tiene miedo a una sequía.",
  }, 9),

  // ── PROBLEMA: la manguera desperdicia ──
  P("MythTruth", "la forma mas desperdiciadora que existe", 5.6, "topLeft", {
    myth: "Regar más seguido con la manguera = plantas mejor regadas",
    truth: "Casi toda esa agua se evapora, escurre al costado o se hunde: a la planta le llega una migaja",
  }, 6),
  P("BigStatReveal", "un 70 por ciento menos de agua", 5.0, "topLeft", {
    eyebrow: "La olla enterrada usa hasta", value: 70, suffix: " % menos agua", support: "cero evaporación, cero escurrimiento — la planta toma directo de la raíz, bajo tierra",
  }, 7),
  P("DuelColumns", "una pequena fortuna en cuotas", 6.0, "left", {
    title: "Lo mismo, dos precios", leftName: "Riego por goteo del vivero", rightName: "Una olla de barro",
    rows: [{ attr: "Bomba y mangueras que se tapan", leftWins: false }, { attr: "Programador con pilas", leftWins: false }, { attr: "Piezas que se rompen", leftWins: false }, { attr: "Cuesta $5 y no se rompe", leftWins: false }],
  }, 5),

  // ── MECANISMO (por qué funciona) ──
  P("FlowSteps", "el barro crudo es poroso", 6.5, "full", {
    title: "Por qué riega solo", nodes: [
      { label: "Barro poroso", sub: "millones de poros microscópicos en la pared" },
      { label: "La tierra decide", sub: "solo sale agua cuando el suelo de afuera está seco" },
      { label: "Raíces a la fuente", sub: "se enroscan al barro y toman directo, sin desperdicio" },
    ],
  }, 5),
  P("MythTruth", "el agua solo sale cuando la tierra", 5.6, "topLeft", {
    myth: "El agua se escapa de la olla todo el tiempo",
    truth: "Solo sale cuando la tierra alrededor está seca; si está húmeda, se queda quieta adentro",
  }, 8),

  // ── HISTORIA / ANTIGÜEDAD ──
  P("BigStatReveal", "tiene por lo menos 2000 anos", 5.0, "topLeft", {
    eyebrow: "Esto no es una moda: tiene", value: 2000, suffix: " años", support: "de la China antigua al desierto de África — regaban así donde no llovía nunca",
  }, 6),
  P("BeforeAfter", "las plantas de todos los vecinos se doblaban", 5.4, "top", {
    eyebrow: "El verano seco de la abuela", beforeLabel: "Vecinos · hojas caídas", afterLabel: "La abuela · tomates firmes", caption: "los mismos días de sol, una sola diferencia enterrada al lado de la planta",
  }, 7),

  // ── CÓMO HACERLO ──
  P("NumberedSteps", "cabas un pozo al lado", 6.5, "left", {
    eyebrow: "Armar el tuyo", title: "Cuatro pasos y listo", steps: [
      { title: "Tapá el agujero del fondo", sub: "corcho, barro o cemento — que no pierda" },
      { title: "Enterrala hasta el cuello", sub: "afuera solo la boca y la tapa" },
      { title: "Llenala y tapala", sub: "una vez por semana, 30 segundos" },
      { title: "Plantá en círculo alrededor", sub: "a un palmo, para que las raíces la encuentren" },
    ],
  }, 5),
  P("ChecklistReveal", "el tomate la primera de todas", 5.8, "topLeft", {
    title: "Las que más agradecen la olla", items: ["Tomate, pimiento y berenjena", "Zapallo, zapallito y pepino", "Melón, sandía y lechuga"],
    stamp: "RAÍZ QUE BUSCA A LOS COSTADOS",
  }, 6),
  P("HighlightSweep", "un circulo del ancho de tus dos brazos", 4.8, "top", {
    pre: "Una olla chica riega", highlight: "el ancho de tus dos brazos", post: ".", note: "huerta grande: varias medianas, una cada medio metro",
  }, 8),

  // ── EL ERROR (pago del loop) ──
  P("MythTruth", "una olla esmaltada no es mas que un balde", 6.0, "topLeft", {
    myth: "Cualquier maceta de barro linda sirve",
    truth: "La esmaltada o pintada sella los poros: es un balde de plástico disfrazado de barro, no entrega ni una gota",
  }, 9),
  P("ChecklistReveal", "las otras tres reglas chiquitas que importan", 6.0, "topLeft", {
    title: "Las otras tres reglas", items: ["Tapala siempre (evita evaporación y mosquitos)", "Si hiela, vaciala en invierno o se raja", "Revisá que las raíces no tapen la boca"],
    stamp: "PARA QUE DURE AÑOS",
  }, 7),

  // ── LA CUENTA / RECAP ──
  P("NumberedSteps", "hagamos juntos la cuenta de lo que ganas", 6.5, "left", {
    eyebrow: "Lo que ganás", title: "La cuenta final", steps: [
      { title: "Regás 1 vez por semana", sub: "en vez de todos los días atado a la manguera" },
      { title: "Hasta 70 % menos agua", sub: "se nota en la boleta y en el tanque" },
      { title: "Dura años, no se rompe", sub: "una maceta rajada gratis alcanza" },
    ],
  }, 8),

  // ── TRAMO 9-13min: mecanismo profundo + antigüedad (más densidad) ──
  P("HighlightSweep", "cero evaporacion cero escurrimiento", 4.8, "top", {
    pre: "Bajo tierra, en la raíz:", highlight: "cero evaporación", post: ".", note: "el sol no la seca y no se escurre a los costados",
  }, 4),
  P("PullQuote", "la planta come de la despensa", 5.2, "topLeft", {
    quote: "La planta come de la despensa cuando tiene hambre, no cuando a vos se te ocurre pasar con el balde.",
  }, 5),
  P("PullQuote", "copio como la naturaleza guarda", 5.4, "topLeft", {
    quote: "Mi abuelo no inventó nada: copió cómo la naturaleza guarda y entrega el agua, y lo metió en una olla.",
  }, 5),

  // ── TRAMO 13-18min: cómo hacerlo + qué plantar + tamaño ──
  P("HighlightSweep", "tenes dos caminos segun lo que", 4.8, "top", {
    pre: "Para armarla,", highlight: "dos caminos", post: ".", note: "una maceta de terracota con tapa, o dos pegadas boca con boca",
  }, 6),
  P("DuelColumns", "el segundo camino el clasico", 6.0, "left", {
    title: "Cómo armar tu olla", leftName: "1 maceta + tapa", rightName: "2 macetas pegadas",
    rows: [{ attr: "Tapás el agujero del fondo", leftWins: true }, { attr: "Fácil para empezar", leftWins: true }, { attr: "Vasija cerrada que dura años", leftWins: false }],
  }, 5),
  P("BigStatReveal", "volver a tapar 30 segundos", 4.8, "topLeft", {
    eyebrow: "Tu único trabajo del verano", value: 30, suffix: " segundos", support: "una vez por semana: levantás la tapa, llenás la olla, tapás. El resto lo hace la tierra",
  }, 5),
  P("BeforeAfter", "vas a ver la diferencia con tus propios", 5.2, "top", {
    eyebrow: "Poné la olla con los tomates", beforeLabel: "Hoy · plantas con sed", afterLabel: "En 2 semanas · verdes y firmes", caption: "la diferencia se ve con tus propios ojos en un par de semanas",
  }, 7),

  // ── TRAMO 18-22min: el error + reglas + la cuenta + filosofía ──
  P("HighlightSweep", "barro crudo opaco aspero", 4.6, "top", {
    pre: "Tiene que ser", highlight: "barro crudo, opaco, áspero", post: ".", note: "sin esmalte, sin pintura, sin brillo — o no transpira",
  }, 4),
  P("BeforeAfter", "moja el barro con un poco de agua", 5.4, "top", {
    eyebrow: "La prueba del abuelo", beforeLabel: "Barro poroso · chupa el agua", afterLabel: "Esmaltado · el agua resbala", caption: "mojalo antes de comprarlo: el bueno se oscurece y traga; el malo queda brillando",
  }, 7),
  P("BigStatReveal", "la vas a notar en la boleta", 4.8, "topLeft", {
    eyebrow: "Con el agua a fin de mes", value: 70, suffix: " % menos", support: "se nota en la boleta si la pagás, y te dura mucho más si sale de un pozo o un tanque",
  }, 7),
  P("PullQuote", "el agua se le da despacio abajo", 5.4, "topLeft", {
    quote: "El agua no se le da a la tierra a los manotazos: se le da despacio, abajo, en la raíz — con paciencia rinde el triple.",
  }, 7),
  P("HighlightSweep", "dejar de ser esclavo de la manguera", 4.8, "top", {
    pre: "Es lo que necesitás para", highlight: "dejar de ser esclavo de la manguera", post: ".", note: "y poder irte un fin de semana sin volver a una huerta muerta",
  }, 7),

  // ── CIERRE / CTA (guía + suscripción, sin precio en voz) ──
  P("CtaCard", "contame una cosa en los comentarios", 6.0, "topLeft", {
    eyebrow: "La huerta del abuelo, en una guía", title: "El Almanaque Amish del Huerto",
    bullet: "los trucos de $5 para regar, curar y defender tu huerta sin comprar nada — link en la descripción", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 6),
];

const compBeats = [];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
const compSpans = compBeats.map((b) => [b.start, +(b.start + (b.dur || 3)).toFixed(2)]);
const inComp = (t) => compSpans.some(([s, e]) => s <= t && e > t);

// ── COBERTURA SIN HUECOS: cerrar slivers <1.2s; lo descubierto ≥1.2s lo cubre el AVATAR full ──
rawBeats.sort((a, b) => a.start - b.start);
const nextCover = (t) => {
  let best = TOTAL;
  for (const b of rawBeats) if (b.start > t + 0.01 && b.start < best) best = b.start;
  for (const [s] of compSpans) if (s > t + 0.01 && s < best) best = s;
  return best;
};
for (const b of rawBeats) {
  const end = +(b.start + b.dur).toFixed(2);
  const nc = nextCover(b.start);
  if (nc - end > 0 && nc - end < 1.2) b.dur = +(nc - b.start).toFixed(2);
}
const rawSpans = rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => rawSpans.some(([s, e]) => s <= t && e > t) || inComp(t);
const STEP = 0.1;
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL - 0.001; t = +(t + STEP).toFixed(2)) {
  const mode = covered(t) ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: +t.toFixed(2), mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: covered(0) ? "hidden" : "full" });
windows.push({ start: +TOTAL.toFixed(2), mode: "hidden" });

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const fullCount = windows.filter((w) => w.mode === "full").length;
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`beats totales ${beats.length} (raw ${rawBeats.length}) · premium ${nOv} · avatar full x${fullCount} (${avSecs.toFixed(0)}s / ${(TOTAL).toFixed(0)}s) · dur ${(TOTAL / 60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
