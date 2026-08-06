// build_platano.mjs — "¿Sabías que ESTE Ingrediente Común hace crecer tus Plantas el DOBLE?"
// Canal Levi Lapp Jardín (ES). El ingrediente = LA CÁSCARA DE PLÁTANO (potasio).
// STOCK-FIRST (Pexels) + IA solo para el presentador Levi + AVATAR full en tramos retóricos
// + kit premium THEME_EARTH. NO vende producto → CTA = suscripción (sin precio ni link en voz).
// Salida: beatsheet/platano.json + avatar_platano.gen.ts → node beatsheet.mjs beatsheet/platano.json
import fs from "fs";

const SLUG = "platano";
const AVATAR = `${SLUG}_opt.mp4`;
const OPEN = 2.0;

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
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.2).toFixed(2);

// ── momentos (stock|photo) con phrase ──
const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const exists = (p) => fs.existsSync("public/" + p);
const photoAsset = (name) => {
  for (const ext of ["jpg", "png", "jpeg", "webp"]) if (exists(`img/${SLUG}_${name}.${ext}`)) return `img/${SLUG}_${name}.${ext}`;
  return null;
};

const rawBeats = [];
for (let i = 0; i < moments.length; i++) {
  const m = moments[i];
  const t = m.ms != null ? m.ms / 1000 : at(m.phrase);
  if (t == null) continue;
  const startNext = i + 1 < moments.length ? (moments[i + 1].ms != null ? moments[i + 1].ms / 1000 : (at(moments[i + 1].phrase) ?? t + 6)) : TOTAL;
  const clip = `broll/${SLUG}_${m.name}.mp4`;
  const photo = photoAsset(m.name);
  const span = +(startNext - t).toFixed(2);
  if (m.src === "stock" && exists(clip)) {
    rawBeats.push({ id: `${SLUG}_${m.name}`, start: +t.toFixed(2), kind: "raw", src: clip, hue: "amber", darken: 0, noSplit: true, _span: span });
  } else if (photo) {
    rawBeats.push({ id: `${SLUG}_${m.name}`, start: +t.toFixed(2), kind: "raw", src: photo, hue: "amber", darken: 0, _span: span });
  } else if (exists(clip)) {
    rawBeats.push({ id: `${SLUG}_${m.name}`, start: +t.toFixed(2), kind: "raw", src: clip, hue: "amber", darken: 0, noSplit: true, _span: span });
  }
  // sin asset → lo cubre el avatar full (no push)
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
  P("HighlightSweep", "no esta en el vivero esta en tu frutero", 5.0, "top", {
    pre: "El mejor fertilizante para floración no está en el vivero —", highlight: "está en tu frutero", post: ".", note: "y probablemente lo tiraste hoy con el desayuno",
  }, 9),
  P("BigStatReveal", "florezcan y den fruto casi el doble", 4.5, "topLeft", {
    eyebrow: "Con el ingrediente correcto", value: 2, suffix: "×", support: "casi el doble de flores y de fruto — gratis, sin un solo químico",
  }, 8),

  // ── CONTEXTO ABUELO ──
  P("PullQuote", "todo lo que sale de la tierra vuelve a la tierra", 5.5, "topLeft", {
    quote: "Acá nada se tira. Todo lo que sale de la tierra, vuelve a la tierra.",
  }, 9),

  // ── REVELACIÓN ──
  P("HighlightSweep", "ese es el ingrediente la cascara de platano", 5.0, "top", {
    pre: "El ingrediente secreto del abuelo es", highlight: "la cáscara de plátano", post: ".", note: "esa que te comés la fruta y tirás sin mirar",
  }, 9),

  // ── CIENCIA N-P-K (diagrama) ──
  P("FramedPhoto", "nitrogeno fosforo y potasio", 6.0, "full", {
    image: `img/${SLUG}_dg_npk.png`, caption: "Nitrógeno · Fósforo · Potasio", sub: "el N da hojas; el fósforo, raíces y flores; el potasio convierte la flor en fruto", kenburns: true,
  }, 8),
  P("HighlightSweep", "potasio muchisimo potasio", 4.5, "top", {
    pre: "¿Qué es lo que más tiene esa cáscara?", highlight: "potasio, muchísimo", post: ".", note: "una de las fuentes naturales de potasio más ricas que tenés en casa",
  }, 6),
  P("MythTruth", "apenas tres o cuatro tomates tristes", 5.5, "topLeft", {
    myth: "Planta enorme y muy verde = buena cosecha",
    truth: "Si le sobra nitrógeno y le falta potasio: mucha hoja y apenas 3 tomates tristes",
  }, 8),

  // ── ANTI-VIVERO + STAT ──
  P("DuelColumns", "aqui es donde entra el negocio", 6.0, "left", {
    title: "El mismo fertilizante de floración", leftName: "Frasco del vivero", rightName: "Cáscara de plátano",
    rows: [{ attr: "Cuesta dinero", leftWins: false }, { attr: "Sales químicas", leftWins: false }, { attr: "Potasio natural", leftWins: false }, { attr: "Ya lo tirás a la basura", leftWins: false }],
  }, 8),
  P("BigStatReveal", "de su peso en potasio y minerales", 5.0, "topLeft", {
    eyebrow: "Una cáscara bien seca", value: 40, suffix: " %", support: "de su peso en potasio y minerales aprovechables — kilos de fertilizante que tirás al año",
  }, 8),
  P("PullQuote", "el que sabe no compra lo que la tierra regala", 5.0, "topLeft", {
    quote: "El que sabe, no compra lo que la tierra regala.",
  }, 9),

  // ── MÉTODO 1: PICADA ──
  P("NumberedSteps", "la cascara picada y enterrada", 6.5, "left", {
    eyebrow: "Método 1 · la más simple", title: "Cáscara picada y enterrada", steps: [
      { title: "Cortala en trocitos pequeños", sub: "cuanto más chiquitos, más rápido se deshace" },
      { title: "Enterrala a unos 5 cm", sub: "alrededor de la planta, sin tocar el tallo" },
      { title: "Nunca entera", sub: "entera tarda meses; picada, semanas" },
    ],
  }, 8),

  // ── MÉTODO 2: TÉ ──
  P("NumberedSteps", "el famoso te de cascara de platano", 6.5, "left", {
    eyebrow: "Método 2 · el empujón rápido", title: "El té de cáscara de plátano", steps: [
      { title: "2 o 3 cáscaras en 1 litro de agua", sub: "en un frasco de vidrio" },
      { title: "Dejá reposar 2 o 3 días", sub: "el agua suelta el potasio" },
      { title: "Colá y regá en la base", sub: "las cáscaras van al compost" },
    ],
  }, 9),
  P("ChecklistReveal", "una parte de te por cinco partes de agua", 6.0, "topLeft", {
    title: "El té va DILUIDO (o empachás la raíz)",
    items: ["1 parte de té por 5 de agua limpia", "Regá en la base, no en las hojas", "1 vez por semana, nunca a diario"],
    stamp: "DILUÍ SIEMPRE",
  }, 8),

  // ── MÉTODO 3: POLVO ──
  P("NumberedSteps", "la cascara seca y molida el polvo de platano", 6.5, "left", {
    eyebrow: "Método 3 · el más potente", title: "El polvo de plátano", steps: [
      { title: "Secala al sol o al horno", sub: "hasta que quede negra y crujiente" },
      { title: "Molela a polvo", sub: "con un molinillo, la licuadora o a mano" },
      { title: "1 cucharada + regar", sub: "un banquete que dura semanas; se guarda meses" },
    ],
  }, 9),

  // ── QUÉ PLANTAS ──
  P("ChecklistReveal", "las que dan flor y fruto", 6.0, "topLeft", {
    title: "Las que AMAN el potasio",
    items: ["Tomates, pimientos y berenjenas", "Rosales y plantas con flor", "Frutales, cítricos y la vid"],
    stamp: "AMAN LA CÁSCARA",
  }, 8),

  // ── HONESTIDAD: EL DOBLE ──
  P("BeforeAfter", "cuatro tomates y ahora te da ocho o diez", 6.0, "top", {
    eyebrow: "Qué significa \"casi el doble\"", beforeLabel: "Antes · 4 tomates", afterLabel: "Después · 8 a 10 tomates", caption: "eso es el doble, y es completamente real — llega con constancia, no con prisa",
  }, 8),

  // ── REFUERZO MÉTODOS / PLANTAS / RUTINA / TRUCOS (densidad + variedad por tramo) ──
  P("HighlightSweep", "casi todos meten la pata", 5.0, "top", {
    pre: "Casi todos", highlight: "meten la pata", post: " con esto.", note: "entierran la cáscara entera — y no funciona",
  }, 8),
  P("MythTruth", "mas no siempre es mejor", 5.5, "topLeft", {
    myth: "Más cáscara y más té = crece más rápido",
    truth: "El potasio en exceso bloquea el calcio — 1 vez por semana, diluido, alcanza",
  }, 8),
  P("BigStatReveal", "una cucharada de ese polvo", 4.5, "topLeft", {
    eyebrow: "El polvo seco de plátano", value: 1, suffix: " cucharada", support: "espolvoreada y regada = un banquete de potasio que dura semanas; se guarda meses en un frasco",
  }, 8),
  P("DuelColumns", "donde no vas a notar tanta diferencia", 6.0, "left", {
    title: "¿A qué plantas darle?", leftName: "Flor y fruto", rightName: "Solo hoja",
    rows: [{ attr: "Tomate, pimiento, rosal", leftWins: true }, { attr: "Frutales, cítricos y vid", leftWins: true }, { attr: "Lechuga y espinaca (quieren N)", leftWins: false }],
  }, 8),
  P("ChecklistReveal", "en vez de tirar las cascaras guardalas", 6.0, "topLeft", {
    title: "Tu rutina semanal, sin complicarte",
    items: ["Guardá las cáscaras: picá, secá y armá el té", "1 té diluido por semana + 1 puñado de polvo al mes", "En cada siembra, un trocito en el fondo del hoyo"],
    stamp: "LA RUTINA",
  }, 9),
  P("HighlightSweep", "llega con constancia no con prisa", 5.0, "top", {
    pre: "El resultado", highlight: "llega con constancia", post: ", no con prisa.", note: "el que quiere magia en 3 días, que compre el frasco caro",
  }, 8),
  P("PullQuote", "una huerta sana de verdad ano tras ano", 5.0, "topLeft", {
    quote: "El que quiere una huerta sana de verdad, año tras año, le da a la tierra lo que la tierra pide.",
  }, 9),
  P("HighlightSweep", "es floja en nitrogeno", 5.0, "top", {
    pre: "Genial para flor y fruto, pero", highlight: "floja en nitrógeno", post: ".", note: "sumale compost, café o estiércol para las hojas",
  }, 6),
  P("NumberedSteps", "pasa la parte de adentro de la cascara", 6.5, "left", {
    eyebrow: "Dos trucos extra del abuelo", title: "Para exprimir cada cáscara", steps: [
      { title: "Frotá la cara interna en las hojas", sub: "las plantas de hoja grande quedan limpias y brillantes" },
      { title: "Un trocito en el fondo del hoyo", sub: "al sembrar: una reserva de potasio desde el día uno" },
    ],
  }, 9),
  P("BigStatReveal", "he visto huertas triplicar su cosecha", 5.0, "topLeft", {
    eyebrow: "Con puras cáscaras y paciencia", value: 3, suffix: "×", support: "he visto huertas triplicar su cosecha — sin gastar un solo peso",
  }, 8),

  // ── ERRORES ──
  P("MythTruth", "enterrar la cascara entera y cruda", 5.5, "topLeft", {
    myth: "Enterrar la cáscara entera y cruda al pie",
    truth: "Tarda meses e invita hormigas, babosas y roedores — va PICADA, o seca y molida",
  }, 8),
  P("ChecklistReveal", "el error que arruina todo", 6.0, "topLeft", {
    title: "Los 3 errores que lo arruinan",
    items: ["Enterrarla entera y cruda", "Pasarte de cantidad (bloquea el calcio)", "Creer que reemplaza al nitrógeno"],
    stamp: "EVITÁ ESTO",
  }, 8),

  // ── RESULTADOS ──
  P("FlowSteps", "en unas dos o tres semanas vas a empezar a notarlo", 7.0, "full", {
    title: "Qué vas a ver, semana a semana", nodes: [
      { label: "Semana 1", sub: "un verde más intenso y sano" },
      { label: "Semana 2-3", sub: "más capullos y más flores" },
      { label: "Semana 4+", sub: "más fruto, más grande y dulce" },
    ],
  }, 9),

  // ── CIERRE ──
  P("PullQuote", "la tierra siempre paga a quien la escucha", 5.5, "topLeft", {
    quote: "La tierra siempre paga a quien la escucha.",
  }, 8),
  P("CtaCard", "si todavia no estas suscrito a este canal", 6.0, "topLeft", {
    eyebrow: "La huerta del abuelo, en una guía", title: "El Almanaque Amish del Huerto",
    bullet: "90 secretos para regar, abonar y defender tu huerta sin comprar nada — link en la descripción", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 9),
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
