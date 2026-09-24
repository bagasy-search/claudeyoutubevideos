// build_aceite.mjs — DOCUMENTAL "ACEITE PENETRANTE PARA MADERA 100 AÑOS" (Constructor Libre).
// Don Ernesto (carpintero 74) salva su galpón podrido con el aceite del secreto de su padre.
// La madera no se pudre por vieja: por agua/hongos/insectos. Protección NO encima (película que
// se pela) sino ADENTRO (aceite penetrante: motor usado enterrado / linaza noble para todo).
// IMAGE-FIRST: 180 momentos → tomas ≤3s (pace_aceite) imágenes on-topic MODAL en public/img/ace_s_*.png,
// anclado al ms de captions_aceite.json. 35 componentes KIT PREMIUM (THEME_EARTH). Avatar full↔hidden.
// Salida: beatsheet/aceite.json → node beatsheet.mjs beatsheet/aceite.json
import fs from "fs";

const SLUG = "aceite";
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

// HÍBRIDO: la toma BASE de un momento con clip bueno → beat de VIDEO (broll/*.mp4) SIN noSplit
// → la dur contigua lo capa a ≤3s (cortes rápidos = dinámico); las tomas _b/_c del momento y todo
// lo demás → imagen ≤3s. Regla nueva: clips ≤3s + avatar full en huecos sin clip.
const goodset = fs.existsSync(`_v3/${SLUG}_clip_goodset.json`) ? new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_clip_goodset.json`, "utf8"))) : new Set();
const base = (n) => n.replace(/_[bc]$/, "");
const srcBeats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const rawBeats = [];
let nClip = 0;
for (const b of srcBeats) {
  const t = atc(b.phrase);
  if (t == null) continue;
  const isClipBase = goodset.has(b.name) && b.name === base(b.name); // toma base del momento con clip
  if (isClipBase) { rawBeats.push({ id: b.name, start: +t.toFixed(2), kind: "raw", src: `broll/${b.name}.mp4`, hue: "amber", darken: 0 }); nClip++; }
  else rawBeats.push({ id: b.name, start: +t.toFixed(2), kind: "raw", src: `img/${b.name}.png`, hue: "amber", darken: 0 });
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2);
}
const clipRanges = rawBeats.filter((b) => /\.mp4$/.test(b.src)).map((b) => [b.start, b.start + b.dur]);
console.log(`b-roll híbrido: ${nClip} clips de video (≤3s) + ${rawBeats.length - nClip} tomas imagen`);

const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// los 4 pasos de aplicación (revelado progresivo)
const PASOS = [
  { title: "Madera bien seca", sub: "sobre húmeda sellás el agua adentro — el error #1" },
  { title: "Limpia y sin capa gris", sub: "sacá la fibra muerta o el aceite no penetra" },
  { title: "Aceite generoso, saturando", sub: "2-3 manos en el sentido de la veta, hasta que no absorba" },
  { title: "Sacá el excedente", sub: "a los 10-15 min pasá un trapo; después, secar" },
];

const PREMIUM = [
  // ══ BigStatReveal (6) — zone "topLeft" ══
  P("BigStatReveal", "hace unos años conoci a un hombre don ernesto 74 años carpintero", 5.8, "topLeft", {
    eyebrow: "El carpintero de la historia", value: 74, prefix: "", suffix: " años", support: "Don Ernesto — 40 años de oficio, un galpón que él mismo levantó tabla por tabla",
  }, 8),
  P("BigStatReveal", "hay iglesias de madera en noruega que tienen 800 años y estan intactas", 5.8, "topLeft", {
    eyebrow: "La madera no muere por vieja", value: 800, prefix: "", suffix: " años", support: "iglesias de madera en Noruega, intactas — la edad no pudre la madera",
  }, 8),
  P("BigStatReveal", "un liquido que cuesta casi cero que hace que la madera dure cien años", 5.6, "topLeft", {
    eyebrow: "El secreto que salvó el galpón", value: 100, prefix: "", suffix: " años", support: "un líquido que cuesta casi nada y hace durar la madera un siglo",
  }, 8),
  P("BigStatReveal", "un poste bien empapado en aceite de motor usado te puede durar 50", 5.8, "topLeft", {
    eyebrow: "Un poste enterrado, con aceite de motor", value: 100, prefix: "", suffix: " años", support: "gratis, porque es un desecho — por eso ningún corralón te lo recomienda",
  }, 8),
  P("BigStatReveal", "es un mantenimiento de diez minutos cada tanto contra el infierno", 5.6, "topLeft", {
    eyebrow: "El mantenimiento del aceite", value: 10, prefix: "", suffix: " min", support: "una manito cada tanto, sin lijar — contra el infierno de lijar y repintar cada 2 años",
  }, 8),
  P("BigStatReveal", "son cuarenta soluciones como esta cosas que los viejos sabian", 5.8, "topLeft", {
    eyebrow: "Manual de reparaciones caseras", value: 40, prefix: "", suffix: "", support: "arreglos como este, con medidas y pasos, para cuando los necesites",
  }, 8),

  // ══ VsDuel (2) — zone "left" ══
  P("VsDuel", "los viejos hacian exactamente lo contrario no tapaban la madera la alimentaban", 6.2, "left", {
    eyebrow: "Dos filosofías opuestas", title: "Tapar vs. alimentar",
    left: { label: "Sellador (película)", sub: "capa de plástico arriba; se agrieta y atrapa el agua", good: false },
    right: { label: "Aceite (penetrante)", sub: "se mete adentro, flexible, no se pela", good: true },
  }, 8),
  P("VsDuel", "hay una version que todo el mundo conoce y usa y hay una version mejor", 6.2, "left", {
    eyebrow: "El líquido: dos versiones", title: "Motor usado vs. linaza noble",
    left: { label: "Aceite de motor usado", sub: "gratis e imbatible, pero sucio/tóxico — solo enterrado", good: false },
    right: { label: "Mezcla de linaza", sub: "no tóxica, huele bien, protege igual — para todo", good: true },
  }, 8),

  // ══ MythTruth (4) — zone "topLeft" ══
  P("MythTruth", "la madera no se pudre porque sea vieja grabate eso", 6.0, "topLeft", {
    myth: "La madera se pudre porque es vieja / por el paso del tiempo",
    truth: "La edad no la pudre: la pudren el agua, los hongos y los insectos",
  }, 8),
  P("MythTruth", "esto no tiene arreglo toda esta madera esta para tirar", 6.0, "topLeft", {
    myth: "Esta madera ya no tiene arreglo, hay que demoler y hacer todo nuevo",
    truth: "Con un tarro de aceite y una tarde, esa madera queda más sana que la nueva",
  }, 8),
  P("MythTruth", "el problema es que esa pelicula es una trampa porque el sol la", 6.0, "topLeft", {
    myth: "El sellador de película pone una capa impermeable que protege",
    truth: "Se agrieta, el agua entra y queda atrapada abajo — pudre más rápido",
  }, 8),
  P("MythTruth", "la madera tiene que estar seca seca de verdad este es", 6.0, "topLeft", {
    myth: "Apurar y aplicar el aceite sobre madera húmeda o recién lavada",
    truth: "Sobre húmeda sellás el agua adentro y la condenás: seca, siempre",
  }, 8),

  // ══ HighlightSweep (5) — zone "top" ══
  P("HighlightSweep", "de esas tres la madre de todas es el agua porque el agua es la que", 5.6, "top", {
    pre: "De los tres enemigos, la madre de todas es", highlight: "el agua", post: " — es la que llama a los hongos y los insectos.", note: "sacá el agua y la madera es casi eterna",
  }, 8),
  P("HighlightSweep", "la madera es como una esponja llena de tubitos", 5.6, "top", {
    pre: "La madera es", highlight: "una esponja llena de tubitos", post: " que antes llevaban la savia; el agua entra por ahí.", note: "por eso hay que taparlos",
  }, 8),
  P("HighlightSweep", "la proteccion de la madera no se pone encima se mete adentro", 5.6, "top", {
    pre: "La protección de la madera", highlight: "no se pone encima, se mete adentro", post: ".", note: "el corazón de todo",
  }, 8),
  P("HighlightSweep", "porque el aceite de motor usado es aceite espeso pesado que penetra profundo", 5.8, "top", {
    pre: "El aceite de motor usado penetra profundo y", highlight: "repele el agua como pocas cosas", post: " — y es gratis.", note: "solo para lo enterrado",
  }, 8),
  P("HighlightSweep", "como quemar la madera hace que dure 80 años sin pudrirse sin pintura", 5.8, "top", {
    pre: "En el próximo video:", highlight: "quemar la madera para que dure 80 años", post: ", sin pintura ni un solo químico.", note: "shou sugi ban — no te lo pierdas",
  }, 8),

  // ══ ChecklistReveal (4) — zone "topLeft" ══
  P("ChecklistReveal", "que la pudre tres cosas y solo tres el agua los hongos y los insectos", 7.2, "topLeft", {
    title: "Lo único que pudre la madera",
    items: ["El agua (la madre de todas)", "Los hongos", "Los insectos / termitas"],
    stamp: "SACÁ ESAS 3 = MADERA ETERNA",
  }, 8),
  P("ChecklistReveal", "la mezcla magica la que quiero que te grabes lleva tres cosas", 7.2, "topLeft", {
    title: "La mezcla noble (la fórmula)",
    items: ["Aceite de linaza (el alma, penetra y alimenta)", "Un solvente (aguarrás/trementina, lleva el aceite al fondo)", "Un refuerzo (brea de pino o cera de abeja)"],
    stamp: "PROPORCIONES EN LA DESCRIPCIÓN",
  }, 8),
  P("ChecklistReveal", "ahora dejame mostrarte todo lo que podes salvar con esto porque no es solo para postes", 7.4, "topLeft", {
    title: "Todo lo que podés salvar",
    items: ["Postes y bases enterradas (motor usado)", "Deck, galería y pérgola (linaza)", "Muebles de interior y exterior (linaza + cera)", "Mangos de herramientas (hacha, pala, martillo)"],
    stamp: "MISMO PRINCIPIO",
  }, 8),
  P("ChecklistReveal", "madera oxido humedad goteras plagas caños hasta cosas del auto", 7.2, "topLeft", {
    title: "Lo que cubre el manual completo",
    items: ["Madera", "Óxido", "Humedad y goteras", "Plagas", "Caños", "Hasta cosas del auto"],
    stamp: "40 ARREGLOS",
  }, 8),

  // ══ NumberedSteps (5): 4 pasos progresivos + recap — zone "left" ══
  P("NumberedSteps", "paso numero uno y es el que nadie respeta la madera tiene que estar seca", 6.6, "left", {
    eyebrow: "Paso 1 de 4", title: "Cómo aplicarlo (lo que casi nadie hace)", steps: PASOS.slice(0, 1),
  }, 8),
  P("NumberedSteps", "paso numero dos la madera tiene que estar limpia y si esta vieja y gris", 6.6, "left", {
    eyebrow: "Paso 2 de 4", title: "Cómo aplicarlo (lo que casi nadie hace)", steps: PASOS.slice(0, 2),
  }, 8),
  P("NumberedSteps", "paso numero tres aplicas el aceite generoso con pincel con trapo", 6.6, "left", {
    eyebrow: "Paso 3 de 4", title: "Cómo aplicarlo (lo que casi nadie hace)", steps: PASOS.slice(0, 3),
  }, 8),
  P("NumberedSteps", "paso numero cuatro esperas un rato diez quince minutos", 6.6, "left", {
    eyebrow: "Paso 4 de 4", title: "Cómo aplicarlo (lo que casi nadie hace)", steps: PASOS.slice(0, 4),
  }, 8),
  P("NumberedSteps", "resumiendo para que te lleves lo importante la madera no se pudre por vieja", 7.2, "left", {
    eyebrow: "Para llevarte lo importante", title: "El resumen",
    steps: [
      { title: "No se pudre por vieja, se pudre por el agua" },
      { title: "La protección se mete adentro, no encima" },
      { title: "El error que mata: aplicarla húmeda" },
      { title: "El mejor protector es el más barato: aceite" },
    ],
  }, 8),

  // ══ PullQuote (3) — zone "topLeft" ══
  P("PullQuote", "esta madera la levanto mi viejo con las manos la humedad no me la va a ganar", 6.0, "topLeft", {
    quote: "Esta madera la levantó mi viejo con las manos. La humedad no me la va a ganar a mí.",
  }, 8),
  P("PullQuote", "por eso te digo los viejos no eran atrasados eran mas inteligentes que nosotros", 5.8, "topLeft", {
    quote: "Los viejos no eran atrasados. Eran más inteligentes que nosotros.",
  }, 8),
  P("PullQuote", "no dejes que nadie te haga tirar lo que todavia tiene vida", 5.8, "topLeft", {
    quote: "No dejes que nadie te haga tirar lo que todavía tiene vida.",
  }, 8),

  // ══ BeforeAfter (3) — zone "top" ══
  P("BeforeAfter", "podrido negro deshecho por dentro aunque por fuera parecia sano", 6.2, "top", {
    eyebrow: "El engaño de la humedad", beforeLabel: "Por fuera: sano", afterLabel: "Por dentro: podrido y negro", caption: "trabaja callada, adentro, donde no la ves",
  }, 8),
  P("BeforeAfter", "esa capa rigida de plastico se empieza a grietar se cuartea se pela", 6.2, "top", {
    eyebrow: "El sellador de película, afuera", beforeLabel: "Recién puesto", afterLabel: "Agrietado, atrapa el agua", caption: "el sol lo castiga y la madera se mueve",
  }, 8),
  P("BeforeAfter", "ese deck que se te estaba poniendo gris y aspero vuelve a la vida con color", 6.2, "top", {
    eyebrow: "El deck con la mezcla de linaza", beforeLabel: "Gris y áspero", afterLabel: "Con color, repele el agua", caption: "el agua hace perlitas arriba de la madera",
  }, 8),

  // ══ CtaCard (3, Manual, sin precio) — zone "topLeft" ══
  P("CtaCard", "es uno de los 40 reglos que junte a lo largo de los años", 7.0, "topLeft", {
    eyebrow: "40 arreglos y secretos de los viejos", title: "Manual del Constructor Libre",
    bullet: "madera, óxido, humedad, plagas, caños — con medidas exactas", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
  P("CtaCard", "lo tengo reunido junto con otras decenas de reglos en el manual de reparaciones caseras", 7.0, "topLeft", {
    eyebrow: "Cuesta menos que una visita al corralón", title: "Manual de Reparaciones Caseras",
    bullet: "40 soluciones caseras, con medidas y pasos, para cuando las necesites", price: 0, cta: "LINK ARRIBA DE TODO",
  }, 8),
  P("CtaCard", "arriba de todo esta el enlace al manual y justo abajo te deje la formula", 7.0, "topLeft", {
    eyebrow: "Empezá por el enlace de arriba", title: "Manual del Constructor Libre",
    bullet: "los 40 arreglos completos + la fórmula de hoy, numerada", price: 0, cta: "LINK EN LA DESCRIPCIÓN",
  }, 8),
];

// ── ensamblar ──
const beats = [...rawBeats];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  beats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
beats.sort((a, b) => a.start - b.start);
{
  const used = new Map();
  for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); }
  const dups = [...used.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ ASSETS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── AVATAR WINDOWS full↔hidden (sin PiP) — MÁS avatar en huecos SIN clip ──
// PERIOD más corto = avatar full más seguido; se evita tapar componentes Y clips, así el avatar
// full cae en los tramos de IMAGEN (sin clip bueno) → "más avatar hablando cuando no hay clip".
const HOOK_END = 9, PERIOD = 34, SLOT = 7, SEARCH = 24;
const comps = [
  ...beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 3)]),
  ...clipRanges, // no poner al avatar encima de un clip (los clips ya son dinámicos)
];
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
// ★ MÁS AVATAR: los momentos "photo" (Don Ernesto/carácter, no filmables y que la IA genera mal)
// muestran el AVATAR hablando a pantalla completa en vez de una imagen — "avatar cuando no hay clip".
// Excepción: los momentos del MANUAL/CTA (llevan componente CtaCard) NO se fuerzan a full.
const photoMoments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_clipbeats.json`, "utf8")).filter((b) => b.src === "photo");
for (const b of photoMoments) {
  const s = atc(b.phrase); if (s == null) continue;
  const isManual = /manual|reparaciones|descripci|enlace|link|arriba de todo/i.test(b.phrase);
  if (isManual) continue;
  const e = snapWord(s + 6);
  if (!overlapsComp(s, e)) fulls.push([+s.toFixed(2), e]);
}
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 4 && e - s <= 9 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
const csw = snapWord(TOTAL - 8);
if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s > cursor + 0.2) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cursor = e;
}
if (cursor < TOTAL - 0.1) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

console.log(`beats totales ${beats.length} (raw ${rawBeats.length}/${srcBeats.length}) · premium ${nOv} · dur ${(TOTAL/60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
