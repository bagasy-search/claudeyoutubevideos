// gen_vlhdvm2isyur.mjs — arma el beatsheet del video (canal Federer Archivos · aceite de romero).
//   entrada : public/captions_vlhdvm2isyur.json          (Whisper large-v3, Modal)
//             public/comp_plan_vlhdvm2isyur.json         (componentes del kit, DIRECTOR)
//   salida  : src/_fed6/VideoEdit/federer_vlhdvm2isyur_beats.ts   (FEDZ_BEATS)
//             src/_fed6/VideoEdit/federer_vlhdvm2isyur_hooks.ts   (TALKSZ)
// Anclaje al ms EXACTO de la palabra de Whisper, con degradación 6→5→4→3 palabras.
import fs from "fs";

const SLUG = "vlhdvm2isyur";
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs ?? x.start ?? 0) / 1000 }));
const VEND = (CW[CW.length - 1]?.s || 1340) + 2;

const tryRun = (words, after) => {
  for (let i = 0; i < CW.length - words.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < words.length; j++) if (CW[i + j].t !== words[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  for (const n of [6, 5, 4, 3]) {
    if (p.length < n) continue;
    for (let off = 0; off + n <= Math.min(p.length, n + 3); off++) {
      const hit = tryRun(p.slice(off, off + n), after);
      if (hit != null) return hit;
    }
  }
  return null;
};

// Whisper escribe los números con DÍGITOS ("En 1370", "Hugo tiene 63 años") y el guion los tiene
// en letras, así que esas anclas nunca matchean. Se reescriben a un tramo sin números.
const FIXES = {
  "En mil trescientos setenta aparece la fórmula más famosa": "aparece la fórmula más famosa de todas",
  "Hugo tiene sesenta y tres años y es relojero": "años y es relojero. Tiene un local chiquito",
  "En dos mil dieciséis, un investigador japonés, Koyama": "un investigador japonés, Koyama publicó un trabajo",
  "nueve hombres, veinticuatro semanas": "publicó un trabajo chiquito. Nueve hombres",
  "La reina tenía setenta y dos años": "y la historia dice que se la frotaba",
  "que se usó durante mil quinientos años": "ya lo tenía anotado para el cuero cabelludo",
};

const miss = [];
const at = (phrase, after = 0) => {
  const t = findMs(FIXES[phrase] || phrase, after);
  if (t == null) miss.push(phrase);
  return t;
};

// ── SECCIONES: cada una abre con un beat `talk` (avatar FULL ~2.6s) ───────────────
const SECTIONS = [
  ["hook",      "Hay una ramita verde que probablemente tenés en la cocina"],
  ["sujeto",    "El romero no es un condimento que alguien decidió"],
  ["story",     "Dejame contarte de Hugo"],
  ["enemigo",   "Ahora pensá el negocio desde el otro lado del mostrador"],
  ["principio", "Un pelo que se cae no es un pelo que murió"],
  ["porque",    "Porque el aceite de romero tiene dos compuestos"],
  ["seguridad", "El aceite esencial de romero NO se usa puro"],
  ["rutina",    "Tres noches por semana. Martes, jueves y sábado"],
  ["masaje",    "un investigador japonés, Koyama publicó un trabajo"],
  ["senal",     "Pero hay una señal temprana"],
  ["error",     "Esa piel brilla por un motivo"],
  ["honesto",   "Hay casos en los que nada de esto es tu respuesta"],
  ["recap",     "Entonces, resumiendo, esta semana"],
  ["cierre",    "Y quedate atento al próximo"],
];

// Los DIAGRAMAS y el LOOPLOCK vienen dentro de comp_plan_<slug>.json (los ancló el DIRECTOR).
const beats = [];
let id = 0;
const push = (key, kind, start, dur, extra = {}) =>
  beats.push({ id: `${key}_${id++}_0`, start: +start.toFixed(2), dur: +dur.toFixed(2), key, kind, ...extra });

// secciones + talks
const talks = [];
const secT = [];
for (const [key, phrase] of SECTIONS) {
  const t = at(phrase);
  if (t == null) continue;
  secT.push({ key, t });
  const d = key === "hook" ? 2.2 : 2.8;
  beats.push({ id: `${key}_${id++}_0`, start: +t.toFixed(2), dur: d, key, kind: "talk" });
  talks.push({ start: +t.toFixed(2), dur: d });
}

// componentes del DIRECTOR (incluye los diagram y el looplock). Se juntan varios planes:
// el original + las pasadas extra que pidió density_gate.
let comps = [];
for (const f of [`public/comp_plan_${SLUG}.json`, `public/comp_plan2_${SLUG}.json`, `public/comp_plan3_${SLUG}.json`, `public/comp_plan4_${SLUG}.json`, `public/comp_plan5_${SLUG}.json`]) {
  try { comps = comps.concat(JSON.parse(fs.readFileSync(f, "utf8"))); } catch { /* plan opcional */ }
}
// dedupe por ancla: dos planes distintos pueden haber elegido la misma frase → se pisarían en pantalla
const vistas = new Set();
comps = comps.filter((c) => { const k = norm(c.at); if (vistas.has(k)) return false; vistas.add(k); return true; });

// ── NORMALIZADOR DE PROPS ────────────────────────────────────────────────────────
// `stat` NO lee big/unit: BigStatReveal usa value(number)/prefix/suffix/support/eyebrow
// (FedererComponents.tsx:58). Un stat con {big,unit} sale con el NÚMERO VACÍO en pantalla.
// Traducimos big → value + suffix, unit → eyebrow. Idem `callout`, que lee figure/caption.
// `rule` → ChapterTitle, que trae un DEFAULT de plantilla en `sub`
// ("y cómo esquivarlo en 30 segundos") que renderFedererComp nunca pisa: imprimiría texto
// inventado en pantalla. Se convierte a `headline`, que sí lee lo que le mandamos.
const ruleToHeadline = (p) => {
  const ws = String(p.title || "").split(/\s+/).filter(Boolean);
  return {
    tokens: ws.map((t, i) => (i === ws.length - 1 ? { t, hl: true } : { t })),
    eyebrow: p.sub || p.eyebrow || undefined,
  };
};

const fixProps = (kind, p) => {
  if (kind === "stat" && p.value === undefined && p.big !== undefined) {
    const m = String(p.big).match(/^\s*(-?[\d.]+)(.*)$/);
    if (m) { p.value = Number(m[1]); p.suffix = (m[2] || "") + (p.suffix || ""); }
    else { p.value = 0; p.suffix = String(p.big); }
    if (!p.eyebrow && p.unit) p.eyebrow = p.unit;
  }
  if (kind === "callout") {
    if (!p.figure && p.title) p.figure = p.title;
    if (!p.caption && p.text) p.caption = p.text;
  }
  // ── LARGO DE TEXTO: BoardCard no reflowea. Un `title` largo se ENCABALGA con el primer
  // ítem y queda ilegible (visto en la cuadrícula: "El borde: 1,5 a 2 cm de transición"
  // pisado por "Se ve rarísimo"). Se recorta en palabra, sin cortar al medio.
  const corta = (s, n) => {
    s = String(s || "").trim();
    if (s.length <= n) return s;
    const c = s.slice(0, n);
    const i = c.lastIndexOf(" ");
    return (i > n * 0.6 ? c.slice(0, i) : c).replace(/[,;:.\s]+$/, "");
  };
  if (kind === "board" || kind === "chips" || kind === "checklist" || kind === "guardaesto" || kind === "splitlist") {
    if (p.title) p.title = corta(p.title, 30);
    if (p.eyebrow) p.eyebrow = corta(p.eyebrow, 38);
    if (Array.isArray(p.items)) p.items = p.items.map((it) =>
      typeof it === "string" ? corta(it, 62)
        : { ...it, ...(it.title ? { title: corta(it.title, 26) } : {}), ...(it.sub ? { sub: corta(it.sub, 46) } : {}), ...(it.text ? { text: corta(it.text, 62) } : {}) });
    if (Array.isArray(p.chips)) p.chips = p.chips.map((c) => corta(c, 42));
  }
  if (kind === "lowerthird") { if (p.title) p.title = corta(p.title, 44); if (p.desc) p.desc = corta(p.desc, 96); }
  if (kind === "stat" && p.label) p.label = corta(p.label, 104);
  return p;
};

const colocados = [];   // [start, kind] — para no encimar dos componentes que TAPAN pantalla
const TAPA = (k) => !["lowerthird", "frasecinetica", "callout", "annotated", "rule"].includes(k);
let choques = 0;
for (const c of comps) {
  const t = at(c.at);
  if (t == null) continue;
  let { at: _a, kind, dur = 6, ...props } = c;
  if (kind === "rule") { props = ruleToHeadline(props); kind = "headline"; }
  // un diagram sin su lámina en disco mata el chunk con 404
  if (kind === "diagram") {
    const img = (props.slides || [])[0]?.image;
    if (!img || !fs.existsSync(`public/${img}`)) { console.warn("  ⚠ falta lámina", img); continue; }
  }
  // dos componentes que tapan pantalla a menos de 2s = uno no se ve. El segundo se descarta.
  if (TAPA(kind) && colocados.some(([s, k]) => TAPA(k) && Math.abs(s - t) < 2)) { choques++; continue; }
  colocados.push([t, kind]);
  push("porque", kind, t, dur, fixProps(kind, props));
}
if (choques) console.log(`  (${choques} componentes descartados por encimarse con otro que tapa pantalla)`);

// FOCUSCARDS — el recap numerado de 5 pasos, cada tarjeta se enfoca al decir su número
{
  const t0 = at("Entonces, resumiendo, esta semana");
  const steps = [
    ["Uno. Mapeá tu cabeza con una linterna",        "img/rec_vlh_rc1.jpg",    "Mapeá la franja afinada"],
    ["Dos. Prepará la mezcla diluida",               "img/rec_vlh_rc2.jpg",      "Diluida, nunca pura"],
    ["Tres. Prueba en el pliegue del codo",          "img/rec_vlh_rc3.jpg",          "24 h antes de la cabeza"],
    ["cuatro minutos de masaje moviendo el cuero",               "img/rec_vlh_rc4.jpg",        "4 minutos, con reloj"],
    ["Cinco. La foto. Hoy, con la luz de la ventana","img/rec_vlh_rc5.jpg",          "Hoy y en 3 meses"],
  ];
  if (t0 != null) {
    const items = [];
    let cur = t0;
    for (const [phrase, image, label] of steps) {
      const t = at(phrase, cur);
      if (t == null) continue;
      cur = t;
      if (!fs.existsSync(`public/${image}`)) { console.warn("  ⚠ falta img focuscard", image); continue; }
      items.push({ image, label, at: Math.round((t - t0) * 30) });
    }
    if (items.length >= 3) {
      const dur = Math.min(46, (cur - t0) + 7);
      push("recap", "focuscards", t0, dur, { items, title: "Los 5 pasos" });
    }
  }
}

beats.sort((a, b) => a.start - b.start);
talks.sort((a, b) => a.start - b.start);

fs.writeFileSync(
  `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por scripts/gen_${SLUG}.mjs — beats (diagramas gpt-image-2 + componentes del kit).\n` +
    `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`
);
fs.writeFileSync(
  `src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por scripts/gen_${SLUG}.mjs — rangos talk (avatar FULL).\n` +
    `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`
);

// ── COMPONENT_MANIFEST para density_gate ─────────────────────────────────────────
// El gate cuenta tags JSX literales (`<Nombre`) dentro del Main. Este build es DATA-DRIVEN:
// el Main mapea FEDZ_BEATS y despacha en renderComp(), así que los ~120 componentes que
// SÍ se renderizan son invisibles para el gate. Ése es justo el caso que el gate contempla
// con un manifiesto embebido en comentario. Lo escribimos con el nombre REAL del componente
// que va a montar cada beat, uno por uso, y lo inyectamos en el Main.
const JSX_DE = {
  stat: "BigStatReveal", headline: "HookCaption", quote: "PullQuote", chips: "SplitPanel",
  checklist: "ChecklistReveal", process: "NumberedSteps", diagram: "DiagramBoard",
  nametag: "DocNameCard", board: "BoardCard", bars: "BarCompare", callout: "CutawayCallouts",
  mitoverdad: "MitoVerdad", avatarkeyword: "AvatarKeyword", errorstinger: "ErrorStinger",
  lowerthird: "LowerThird", frasecinetica: "FraseCinetica", looplock: "LoopLockVlh",
  focuscards: "FocusCardsVlh", guardaesto: "GuardaEsto", freezezoom: "FreezeZoom",
  avatarpizarra: "AvatarPizarra", raw: "RawShot",
};
const manifiesto = beats
  .filter((b) => b.kind !== "talk")
  .map((b) => `  ${b.start}s <${JSX_DE[b.kind] || b.kind} />`)
  .join("\n");
const MAIN = `src/_fed6/VideoEdit/Main_${SLUG}.tsx`;
let mainSrc = fs.readFileSync(MAIN, "utf8").replace(/\/\* COMPONENT_MANIFEST[\s\S]*?\*\/\n?/g, "");
mainSrc = mainSrc.replace(
  /(^import[\s\S]*?\n)(?=\n\/\/ ──)/m,
  `$1\n/* COMPONENT_MANIFEST — usos REALES que monta renderComp() desde FEDZ_BEATS (build data-driven).\n${manifiesto}\n*/\n`
);
fs.writeFileSync(MAIN, mainSrc);
console.log(`manifiesto: ${beats.filter((b) => b.kind !== "talk").length} usos inyectados en ${MAIN}`);

const byKind = {};
for (const b of beats) byKind[b.kind] = (byKind[b.kind] || 0) + 1;
console.log(`beats ${beats.length} · talks ${talks.length} · fin narración ${VEND.toFixed(1)}s`);
console.log("por kind:", JSON.stringify(byKind));
console.log("secciones ancladas:", secT.map((s) => `${s.key}@${s.t.toFixed(0)}s`).join(" "));
if (miss.length) { console.log(`\n⚠ NO ANCLADAS (${miss.length}):`); miss.forEach((m) => console.log("   ·", m)); }
