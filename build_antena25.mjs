// build_antena25.mjs — DOCUMENTAL "ANTENA AMISH DE $25 QUE SACA ENERGÍA DEL AIRE" (Constructor Libre).
// Presentador constructor mexicano: una antena casera (alambre alto + varilla a tierra + diodo) COSECHA
// energía real pero pequeña del aire (carga atmosférica ~100 V/m + ondas de AM) y de la tierra. Honesto:
// microwatts, es respaldo (LED/radio/carga lenta), NO reemplaza paneles. STOCK (Pexels) + imágenes
// gpt-image-2 + AVATAR full en los tramos retóricos + kit premium THEME_EARTH.
// Salida: beatsheet/antena25.json → node beatsheet.mjs beatsheet/antena25.json
import fs from "fs";

const SLUG = "antena25";
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
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

// ── momentos (178) con src (stock|photo|avatar) + phrase ──
const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const exists = (p) => fs.existsSync("public/" + p);
// resuelve el asset foto elegido para un momento (img/tunel55_s_XX.<ext>)
const photoAsset = (name) => {
  for (const ext of ["jpg", "png", "jpeg", "webp"]) if (exists(`img/${SLUG}_${name}.${ext}`)) return `img/${SLUG}_${name}.${ext}`;
  return null;
};

const rawBeats = [];
const avatarMoments = []; // spans [start,end] que cubre el avatar full
for (let i = 0; i < moments.length; i++) {
  const m = moments[i];
  const t = atc(m.phrase);
  if (t == null) continue;
  const startNext = i + 1 < moments.length ? (at(moments[i + 1].phrase) ?? (m.ms + (m.dur || 6) * 1000) / 1000) : TOTAL;
  const clip = `broll/${SLUG}_${m.name}.mp4`;
  const photo = photoAsset(m.name);
  const span = +(startNext - t).toFixed(2); // largo del PROPIO momento
  if (m.src === "avatar") {
    // momento retórico/personal/cierre → presentador FULL (aunque tenga imagen generada)
    avatarMoments.push([+t.toFixed(2), +(startNext).toFixed(2)]);
    continue;
  }
  if (m.src === "stock" && exists(clip)) {
    rawBeats.push({ id: `${SLUG}_${m.name}`, start: +t.toFixed(2), kind: "raw", src: clip, hue: "amber", darken: 0, noSplit: true, _span: span });
  } else if (photo) {
    // foto web real (momento photo original, o stock re-ruteado a foto tras el audit)
    rawBeats.push({ id: `${SLUG}_${m.name}`, start: +t.toFixed(2), kind: "raw", src: photo, hue: "amber", darken: 0, _span: span });
  } else {
    // sin asset (avatar retórico, o sin foto limpia) → lo cubre el avatar full
    avatarMoments.push([+t.toFixed(2), +(startNext).toFixed(2)]);
  }
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  const gapToNext = next - rawBeats[i].start;
  // dura su PROPIO momento (con un pelín de aire), sin estirarse sobre los tramos de avatar; techo 9s
  rawBeats[i].dur = +Math.max(0.8, Math.min(rawBeats[i]._span + 0.3, gapToNext + 0.3, 9)).toFixed(2);
  delete rawBeats[i]._span;
}
const nClip = rawBeats.filter((b) => b.src.endsWith(".mp4")).length;
console.log(`b-roll: ${nClip} clips stock + ${rawBeats.length - nClip} fotos web · avatar cubre ${avatarMoments.length} momentos`);

const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// ── COMPONENTES (kit premium THEME_EARTH), anclados al TEXTO REAL de las captions ──
const CAPAS = [
  { title: "1 · El aire estático", sub: "alambre alto + tierra: la carga que ya hay en el aire" },
  { title: "2 · Las ondas de radio", sub: "un diodo rectifica la señal de AM en corriente usable" },
  { title: "3 · La batería de tierra", sub: "dos metales en barro húmedo, como una pila" },
];

const PASOS = [
  { title: "1 · Alambre bien alto", sub: "aislado en las puntas, sin tocar ramas ni paredes mojadas" },
  { title: "2 · Varilla HONDA en tierra húmeda", sub: "esto es lo que más importa; si el suelo es seco, riégala" },
  { title: "3 · Diodo rectificador", sub: "para que la corriente camine para un solo lado" },
  { title: "4 · Capacitor o pila", sub: "el tanque donde el goteo se junta en vez de escaparse" },
  { title: "5 · Descargador a tierra", sub: "seguridad: desconecta y aterriza antes de una tormenta" },
];

const PREMIUM = [
  // ── HOOK / SUJETO ──
  P("BigStatReveal", "100 voltios por metro lo llaman el campo", 4.5, "topLeft", {
    eyebrow: "La carga que ya hay en el aire", value: 100, suffix: " V/m", source: "", support: "cien voltios por cada metro que subes — sobre tu patio, ahora mismo",
  }, 8),
  P("FramedPhoto", "y quien descubrio que el cielo esta cargado", 5.5, "full", {
    image: `img/${SLUG}_s_13.png`, caption: "Franklin · 1752", sub: "su cometa probó que el cielo carga la misma electricidad que corre por un cable", kenburns: true,
  }, 8),
  P("HighlightSweep", "franklin te bajo el rayo kelvin te midio", 5.0, "top", {
    pre: "Franklin te bajó el rayo,", highlight: "Kelvin te midió la brisa", post: ".", note: "y entre los dos te dejaron servido el truco",
  }, 8),

  // ── MARCO HONESTO ──
  P("MythTruth", "lo que te voy a ensenar no prende", 5.5, "topLeft", {
    myth: "Un solo alambre prende toda tu casa",
    truth: "Cosecha un goteo: mantiene un LED, un radio, carga lento el teléfono — nunca tu refri",
  }, 8),

  // ── EL PRINCIPIO (mecanismo) ──
  P("MythTruth", "y no la antena es apenas una de", 5.5, "topLeft", {
    myth: "La energía baja del cielo por la antena",
    truth: "La antena es media mano: el circuito se cierra por la TIERRA, la varilla en el suelo húmedo",
  }, 8),

  // ── LAS 3 CAPAS (mecanismo) ──
  P("NumberedSteps", "va la primera forma la mas vieja y", 6.5, "left", {
    eyebrow: "Cómo se cosecha la energía", title: "Las tres capas", steps: CAPAS,
  }, 8),
  P("HighlightSweep", "y aqui hazme un favor hazlo con el", 5.0, "top", {
    pre: "Con el multímetro en la mano,", highlight: "ver el número subir solo", post: " te cambia la cabeza.", note: "sin pilas, sin enchufe: tu aire y tu alambre hablando",
  }, 8),

  // ── EL ERROR (la tierra) ──
  P("MythTruth", "punto la regla de oro es fea pero", 5.5, "topLeft", {
    myth: "El secreto es la antena: más alta, mejor cable",
    truth: "El secreto es la TIERRA: varilla honda en barro. Tierra seca = cero corriente",
  }, 8),

  // ── SEGURIDAD (rayo) ──
  P("ChecklistReveal", "toda antena de este tipo lleva obligatorio un", 6.5, "topLeft", {
    title: "Seguridad: en tormenta es un pararrayos",
    items: ["Una descarga puede entrar un rayo a la casa", "Instala un descargador / interruptor a tierra", "Si ves tormenta: desconecta y aterriza, sin excepción"],
    stamp: "OBLIGATORIO",
  }, 8),

  // ── MATERIALES / COSTO ──
  P("BigStatReveal", "un par de capacitores todo junto si compras", 4.5, "topLeft", {
    eyebrow: "Todo el material, una sola vez", value: 25, prefix: "$", suffix: "", source: "", support: "alambre, varilla, un puñado de diodos y un capacitor — y te sobra para hacer dos",
  }, 8),
  P("DuelColumns", "a la compania de luz no le sirves", 6.0, "left", {
    title: "El respaldo: ¿producto o algo tuyo?", leftName: "Panel solar + batería", rightName: "La antena de $25",
    rows: [{ attr: "Se paga...", leftWins: false }, { attr: "Miles de dólares", leftWins: false }, { attr: "Depende del sol", leftWins: false }, { attr: "Sigue de noche y en apagón", leftWins: false }],
  }, 8),

  // ── LÍMITES HONESTOS ──
  P("BigStatReveal", "un foco led de esos chiquitos de los", 5.0, "topLeft", {
    eyebrow: "La escala honesta: es un goteo", value: 1, suffix: " W", source: "", support: "un foco pide ~1 watt = 1000 mW; la antena da microwatts. Sirve como respaldo, no como fuente",
  }, 8),
  P("ChecklistReveal", "lo primero es la luz porque a oscuras", 6.5, "topLeft", {
    title: "Qué sí mantiene, por orden",
    items: ["La luz — a oscuras no haces nada", "El teléfono — tu contacto con el mundo", "El radio — saber qué pasa afuera"],
    stamp: "TU PISO EN UN APAGÓN",
  }, 8),

  // ── RECAP 5 PASOS ──
  P("NumberedSteps", "uno consigue el alambre y cuelgalo lo mas", 7.0, "left", {
    eyebrow: "El plan del fin de semana", title: "Los 5 pasos", steps: PASOS,
  }, 8),

  // ── MITO / FRASE-ANCLA ──
  P("HighlightSweep", "tu no la inventas la cosechas como quien", 5.0, "top", {
    pre: "No creas energía de la nada:", highlight: "la cosechas", post: ", como un balde bajo una gotera.", note: "ya está en el aire; tú solo la juntas",
  }, 8),
  P("PullQuote", "si tuviera que dejarte una sola frase clavada", 5.5, "topLeft", {
    quote: "La energía está en la tierra, no en el cielo.",
  }, 8),

  // ── DENSIDAD: componentes de relleno anclados (tramos 2-5) ──
  P("ChecklistReveal", "lo que quieras de repente no tienes como", 6.5, "topLeft", {
    title: "Lo que muere en un apagón largo",
    items: ["El teléfono, sin saber de tu familia", "La linterna, a la segunda noche", "El radio de emergencia, que también come pilas"],
    stamp: "3 DÍAS SIN LUZ",
  }, 8),
  P("PullQuote", "y las pilas se acaban cuando mas las", 5.0, "topLeft", {
    quote: "Las pilas se acaban justo cuando más las necesitas.",
  }, 8),
  P("ChecklistReveal", "segunda guerra mundial soldados metidos en una trinchera", 6.5, "topLeft", {
    title: "Radio de trinchera · sin una sola pila",
    items: ["Una hoja de afeitar oxidada", "Un alfiler y un lápiz de grafito", "Un alambre a la cerca, de antena"],
    stamp: "2ª GUERRA MUNDIAL",
  }, 8),
  P("BigStatReveal", "la bateria de tierra clavas dos varillas de", 5.0, "topLeft", {
    eyebrow: "Batería de tierra: dos metales en barro", value: 1, suffix: " V/par", source: "", support: "medio voltio a un voltio por par — el telégrafo del 1800 corría así, sin central eléctrica",
  }, 8),
  P("PullQuote", "antes de que existieran las pilas buenas corrian", 5.0, "topLeft", {
    quote: "La tierra misma era la pila.",
  }, 8),
  P("HighlightSweep", "ese es el nivel de terco y de", 5.0, "top", {
    pre: "No es magia pareja:", highlight: "es cosecha", post: ", y depende de tu terreno.", note: "cerca de la torre, o el suelo más húmedo",
  }, 8),
  P("MythTruth", "y mira la ironia mas grande de todas", 5.5, "topLeft", {
    myth: "La tienda esconde la solución",
    truth: "La bolsita de diodos está en el pasillo, por centavos — confían en que no sepas usarla",
  }, 8),
  P("HighlightSweep", "es la lucecita del pasillo que no depende", 5.0, "top", {
    pre: "No te da lujo, te da un piso:", highlight: "la lucecita que no se rinde", post: ".", note: "sigue viva cuando el pueblo entero está a oscuras",
  }, 8),
  P("MythTruth", "ahora dejame desmentir un mito antes de cerrar", 5.5, "topLeft", {
    myth: "Esto viola la física: energía infinita y gratis",
    truth: "No: cosechas energía que YA está en el aire. Es plomería eléctrica — por eso funciona",
  }, 8),

  P("HighlightSweep", "porque llego el cable llego el medidor de", 5.0, "top", {
    pre: "Llegó el medidor de la luz —", highlight: "y lo enterraron", post: ".", note: "no murió por falso: murió por cómodo, y de paso te cobran cada mes",
  }, 8),
  P("PullQuote", "es tu terreno tu aire y tu alambre", 5.0, "topLeft", {
    quote: "Ves esa aguja moverse sola, sin pilas, y entiendes que era verdad.",
  }, 8),
  P("HighlightSweep", "los ingenieros lo llaman cosechar energia de radiofrecuencia", 5.0, "top", {
    pre: "Los ingenieros lo llaman", highlight: "cosechar radiofrecuencia", post: ".", note: "relojes y sensores comerciales funcionan así hoy",
  }, 8),
  P("MythTruth", "cuando el panel solar de tu vecino no vale", 5.5, "topLeft", {
    myth: "Si no hay sol, no hay energía",
    truth: "La batería de tierra jala de noche y bajo la lluvia — justo cuando el panel no vale nada",
  }, 8),
  P("PullQuote", "eso es esto no es sexy no prende", 5.0, "topLeft", {
    quote: "No es sexy. Pero es lo único de la casa que no se rinde.",
  }, 8),

  // ── CIERRE / CTA ──
  P("CtaCard", "te dejo el link a la guia en", 5.5, "topLeft", {
    eyebrow: "El paso a paso con las medidas exactas", title: "Manual de Reparaciones Caseras",
    bullet: "Materiales, calibres y cantidades para armar tu propio respaldo — sin adivinar", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
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

// ── COBERTURA SIN HUECOS: extender cada raw beat para tapar slivers <1.2s hasta el próximo beat/comp;
//    lo que quede descubierto ≥1.2s lo cubre el AVATAR full (nunca fondo vacío) ──
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
  if (nc - end > 0 && nc - end < 1.2) b.dur = +(nc - b.start).toFixed(2); // cerrá el sliver
}
// recomputar cobertura y marcar avatar full en lo descubierto
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
