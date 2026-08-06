// build_oxigenada.mjs — "25 Usos del Agua Oxigenada que los Amish Guardaron 60 Años"
// Canal Levi Lapp Jardín (ES). STOCK-FIRST (Pexels) + IA solo para el presentador Levi
// (img/oxigenada_s_*.png) + AVATAR full en tramos retóricos + kit premium THEME_EARTH.
// NO vende producto → CTA = suscripción (sin precio ni link en voz). Música aparte en el Main.
// Salida: beatsheet/oxigenada.json + avatar_oxigenada.gen.ts → node beatsheet.mjs beatsheet/oxigenada.json
import fs from "fs";

const SLUG = "oxigenada";
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
const AV_DUR = 1384.05; // duración exacta del avatar (ffprobe) — el TOTAL no la supera (evita cola negra)
const TOTAL = Math.min(+((Wc[Wc.length - 1].e) / 1000 + 0.6).toFixed(2), AV_DUR);

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
  P("HighlightSweep", "la mitad de lo que plantaste este año", 5.0, "top", {
    pre: "La mitad de lo que plantaste este año", highlight: "ya está condenado", post: ".", note: "y todavía no lo sabes — hay un hongo trepando por el tallo",
  }, 8),
  P("DuelColumns", "un frasco para el hongo y otro", 6.0, "left", {
    title: "Lo que te vende el vivero", leftName: "25 frascos distintos", rightName: "1 botella de $1",
    rows: [{ attr: "Uno para el hongo", leftWins: false }, { attr: "Uno para la raíz", leftWins: false }, { attr: "Uno para las semillas", leftWins: false }, { attr: "Todos hacen lo mismo", leftWins: false }],
  }, 8),
  P("BigStatReveal", "hay una botella marrón que cuesta un dólar", 5.0, "topLeft", {
    eyebrow: "En el último estante de la farmacia", value: 1, suffix: " dólar", support: "hace el trabajo de los 25 frascos juntos — y nadie te lo dijo en 60 años",
  }, 9),
  P("HighlightSweep", "suena demasiado bueno para ser verdad", 4.6, "top", {
    pre: "Ya sé, suena imposible,", highlight: "demasiado bueno para ser verdad", post: ".", note: "quédate 3 minutos y mirá",
  }, 8),

  // ── QUÉ ES / MECANISMO ──
  P("HighlightSweep", "le sobra un oxígeno y ese oxígeno de más", 5.0, "top", {
    pre: "Agua oxigenada es agua a la que", highlight: "le sobra un oxígeno", post: ".", note: "ese átomo suelto es todo el secreto",
  }, 9),
  P("MythTruth", "no deja veneno", 5.2, "topLeft", {
    myth: "Todo lo que mata un hongo deja veneno en la tierra",
    truth: "El agua oxigenada, cuando termina, se vuelve agua: cero residuo, no envenena la cosecha",
  }, 5),
  P("PullQuote", "no le sirve a nadie que viva de venderte cosas", 5.0, "topLeft", {
    quote: "Un frasco de un dólar que te dura un año no le sirve a nadie que viva de venderte cosas.",
  }, 9),

  // ── SEGURIDAD (crítico) ──
  P("ChecklistReveal", "una versión industrial del 35 por ciento", 6.0, "topLeft", {
    title: "Usá SOLO la del 3 %", items: ["3 % — la de la farmacia, 10 volúmenes", "NUNCA la industrial del 35 % (quema)", "Si la etiqueta no dice 3 %, no es"],
    stamp: "SOLO 3 %",
  }, 8),

  // ── USOS: dosis + variedad (uno cada ~2-3 usos) ──
  P("NumberedSteps", "una cucharada por litro de agua cada tres", 6.0, "left", {
    eyebrow: "Contra el mal de los almácigos", title: "Damping-off · la dosis", steps: [
      { title: "1 cucharada por litro de agua", sub: "en cuanto siembras el almácigo" },
      { title: "Riega cada 3 o 4 días", sub: "mantiene la superficie limpia de hongo" },
      { title: "El plantín se hace fuerte", sub: "no vuelves a perder una bandeja" },
    ],
  }, 8),
  P("BeforeAfter", "ya estaban para el compost", 5.5, "top", {
    eyebrow: "Raíz podrida", beforeLabel: "Antes · para el compost", afterLabel: "Después · recuperada", caption: "cortás lo podrido y riegas con 1 cucharada por litro: el oxígeno le devuelve el aire a la raíz",
  }, 6),
  P("HighlightSweep", "media cucharada por litro", 4.6, "top", {
    pre: "Oxigenar el riego de macetas:", highlight: "media cucharada por litro", post: ".", note: "una vez por semana, y salen pelos nuevos",
  }, 5),
  P("ChecklistReveal", "cinco o seis gotas", 5.5, "topLeft", {
    title: "Enraizar gajos sin que se pudran", items: ["5 o 6 gotas por vaso de agua", "Cambia el agua cada 2 días", "El tallo no se pudre y salen raíces"],
    stamp: "GAJOS",
  }, 5),
  P("MythTruth", "nunca a pleno sole", 5.2, "topLeft", {
    myth: "Rociar el fungicida a cualquier hora",
    truth: "El agua oxigenada contra el oídio va temprano o al atardecer — nunca a pleno sol",
  }, 5),
  P("ChecklistReveal", "sin diluir y moja la hoja de la tijera", 5.5, "topLeft", {
    title: "Desinfectar las tijeras de podar", items: ["Un frasco al lado, SIN diluir", "Moja la hoja al cambiar de planta", "10 segundos: no repartes la enfermedad"],
    stamp: "ENTRE PLANTA Y PLANTA",
  }, 8),
  P("HighlightSweep", "una parte por cuatro de agua", 4.6, "top", {
    pre: "Mosquitos del sustrato:", highlight: "1 parte por 4 de agua", post: ".", note: "hace espuma, es el oxígeno matando las larvas",
  }, 6),

  // ── USOS 11–24: una tarjeta de DOSIS/ACCIÓN real por uso (variedad por tramo) ──
  P("HighlightSweep", "remuévela y déjala orear", 4.6, "top", {
    pre: "Desinfectar la tierra reusada:", highlight: "1 cucharada por litro", post: ".", note: "rociá, remové y dejá orear",
  }, 5),
  P("ChecklistReveal", "prepara un rociador agua oxigenada una parte por dos", 5.5, "topLeft", {
    title: "Babosas y caracoles", items: ["1 parte de oxigenada por 2 de agua", "Rociá al atardecer, cuando salen", "Repetí después de cada lluvia"],
    stamp: "AL ATARDECER",
  }, 9),
  P("BigStatReveal", "dos cucharadas por litro sobre las colonias", 4.6, "topLeft", {
    eyebrow: "Contra los pulgones", value: 2, suffix: " cucharadas/L", support: "un rociado suave desarma la colonia — sin matar mariquitas ni abejas",
  }, 7),
  P("BeforeAfter", "lavar la melaza pegajosa y esa fumajina", 5.2, "top", {
    eyebrow: "Fumagina negra", beforeLabel: "Hoja tapada", afterLabel: "Hoja limpia", caption: "un paño con 1 cucharada por litro y la hoja vuelve a respirar",
  }, 7),
  P("HighlightSweep", "media taza por cada balde grande", 4.6, "top", {
    pre: "Agua del barril de lluvia:", highlight: "media taza por balde", post: ".", note: "clara y sin larvas varios días",
  }, 6),
  P("MythTruth", "destapa ese barrito verde", 5.2, "topLeft", {
    myth: "Los goteros tapados no tienen arreglo casero",
    truth: "Pasar agua con oxigenada por el sistema oxida y despega el barro verde: riego parejo otra vez",
  }, 5),
  P("BeforeAfter", "rescatar la planta que ahogaste", 5.2, "top", {
    eyebrow: "Sobre-regada", beforeLabel: "Ahogada, hojas amarillas", afterLabel: "Se repone", caption: "dejá de regar unos días y dale UN riego con 1 cucharada por litro",
  }, 6),
  P("NumberedSteps", "pincela el corte con agua oxigenada, sin diluir", 6.0, "left", {
    eyebrow: "Heridas de poda", title: "Al cortar una rama gruesa", steps: [
      { title: "Pincelá el corte SIN diluir", sub: "apenas terminás de podar" },
      { title: "Desinfecta la herida fresca", sub: "antes de que entre el hongo" },
    ],
  }, 7),
  P("ChecklistReveal", "diez minutos y después secar bien a la sombra", 5.5, "topLeft", {
    title: "Bulbos antes de guardar", items: ["Remojo: 1 cucharada por litro, 10 min", "Secar bien a la sombra", "Un bulbo podrido ya no pudre a los demás"],
    stamp: "GUARDAR SANO",
  }, 8),
  P("HighlightSweep", "unas diez gotas de agua oxigenada en el agua del florero", 4.6, "top", {
    pre: "Flores cortadas:", highlight: "10 gotas en el florero", post: ".", note: "el agua no se pudre y duran más",
  }, 9),
  P("ChecklistReveal", "un rociado de agua oxigenada sin diluir y un paño", 5.5, "topLeft", {
    title: "La mesada y las bandejas del galpón", items: ["Rociado SIN diluir + un paño", "Mata las esporas de la temporada pasada", "Empezar limpio es media huerta sana"],
    stamp: "CADA PRIMAVERA",
  }, 9),
  P("HighlightSweep", "regar la base con agua oxigenada diluida", 4.6, "top", {
    pre: "Pie negro (pudrición del tallo):", highlight: "1 cucharada por litro en la base", post: ".", note: "cuanto antes lo agarres, más chance de salvarla",
  }, 7),
  P("BigStatReveal", "un riego generoso con agua oxigenada diluida", 4.6, "topLeft", {
    eyebrow: "Suelo compactado del bancal", value: 1, suffix: " cucharada/L", support: "un riego generoso le mete aire a la tierra muerta — sin reemplazar la horquilla",
  }, 7),

  // ── LÍMITES HONESTOS ──
  P("ChecklistReveal", "no es un fertilizante, no alimenta la planta", 6.0, "topLeft", {
    title: "Lo que el agua oxigenada NO hace", items: ["No es fertilizante: no alimenta", "No resucita una planta ya muerta", "No dura: se vuelve agua, hay que repetir"],
    stamp: "SIN MENTIRAS",
  }, 8),

  // ── EL ERROR (loop grande) ──
  P("MythTruth", "no sabe cuál es el hongo malo", 5.6, "topLeft", {
    myth: "Si funciona tan bien, úsala todos los días en toda la huerta",
    truth: "El oxígeno no distingue: mata el hongo malo Y el bueno, y te deja la tierra estéril",
  }, 8),
  P("FlowSteps", "micorrisas que se abrazan a la raíz", 6.5, "full", {
    title: "Por qué el uso diario arruina la tierra", nodes: [
      { label: "Tierra viva", sub: "micorrizas que alimentan la raíz gratis" },
      { label: "Riego diario", sub: "el oxígeno mata también a los hongos buenos" },
      { label: "Tierra estéril", sub: "muerta, y dependiente de que le pongas todo" },
    ],
  }, 7),
  P("HighlightSweep", "usar de rutina lo que es una medicina", 5.0, "top", {
    pre: "El error es", highlight: "usar de rutina una medicina", post: ".", note: "es un remedio para un problema puntual, no una comida diaria",
  }, 8),

  // ── RECAP ──
  P("NumberedSteps", "este fin de semana tres cosas", 6.5, "left", {
    eyebrow: "Este fin de semana", title: "Empieza con tres cosas", steps: [
      { title: "Semillas en remojo 20 min antes de sembrar" },
      { title: "Al primer hongo: rociador, 4 cucharadas por litro" },
      { title: "Planta marchita en tierra mojada: no riegues, dale oxígeno" },
    ],
  }, 7),

  // ── CIERRE / CTA (suscripción, sin precio) ──
  P("CtaCard", "veinticinco trabajos que el vivero te quiere cobrar", 6.0, "topLeft", {
    eyebrow: "La huerta del abuelo, en una guía", title: "El Almanaque Amish del Huerto",
    bullet: "los secretos de $1 para sembrar, curar y defender tu huerta sin comprar nada — link en la descripción", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
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
