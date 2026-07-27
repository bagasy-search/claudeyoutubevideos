// gen_v3iuzgxce9vg.mjs — beatsheet del video "cómo beber agua para no levantarte de noche".
// Toma el MAPA DE DIRECCIÓN (_beatmap_v3iuzgxce9vg.json, secciones con beats que traen su frase
// verbatim en `at`) + los captions de Whisper large-v3, y ancla TODO al ms exacto de la palabra.
//
// Emite:
//   src/_fed6/VideoEdit/federer_v3iuzgxce9vg_beats.ts   → FEDZ_BEATS
//   src/_fed6/VideoEdit/federer_v3iuzgxce9vg_hooks.ts   → TALKSZ (ventanas de avatar FULL)
//   _imgs_v3iuzgxce9vg.json                             → nombres de imagen a generar
//   _manifest_v3iuzgxce9vg.txt                          → manifiesto de componentes (density_gate)
import fs from "fs";

const SLUG = "v3iuzgxce9vg";
const FPS = 30;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const VIDEO_END = (CW[CW.length - 1]?.s || 1415) + 2;

// Anclaje: primeras 6 palabras de la frase, match de secuencia exacto a partir de `after`.
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {       // <= : sin el off-by-one que dejaba la última frase sin anclar
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

// Tope de permanencia por kind (el Main vuelve a topar por espacio disponible).
const CAP = { raw: 3.6, headline: 5, quote: 7, rule: 5, lowerthird: 5.5, frasecinetica: 5,
  stat: 6, bars: 8, callout: 6, splitlist: 8, checklist: 9, process: 10, chips: 7, ingredients: 8,
  annotated: 7, freezezoom: 4.5, blurexplainer: 7, diagram: 9, board: 10, pizarra: 10,
  avatarkeyword: 7, nametag: 5, looplock: 5, errorstinger: 2.6, mitoverdad: 6, guardaesto: 8,
  focuscards: 14, whiteboard: 16 };
const MIN_COMP = 4.2, MIN_RAW = 2.0;

// kind → componente REAL que se instancia (para el manifiesto que lee density_gate)
const COMPNAME = { headline: "HookCaption", stat: "BigStatReveal", quote: "PullQuote",
  chips: "SplitPanel", splitlist: "BulletCascade", checklist: "ChecklistReveal",
  process: "NumberedSteps", ingredients: "FlowSteps", annotated: "CutawayCallouts",
  diagram: "DiagramBoard", rule: "ChapterTitle", nametag: "DocNameCard",
  blurexplainer: "BlurExplainer", pizarra: "Pizarra", bars: "BarCompare",
  callout: "CalloutMark", board: "PizarraExplica", lowerthird: "LowerThird",
  mitoverdad: "MitoVerdad", frasecinetica: "FraseCinetica", errorstinger: "ErrorStinger",
  guardaesto: "GuardaEsto", freezezoom: "FreezeZoom", focuscards: "FocusCardsUro",
  looplock: "LoopLockUro", avatarkeyword: "AvatarKeyword", whiteboard: "FedWhiteboardUro" };

const IMG = (n) => `img/fe_${SLUG}_${String(n).replace(/[^a-z0-9_]/gi, "_").toLowerCase()}.jpg`;
const imgNames = new Set();
const regImg = (n) => { if (!n) return null; const p = IMG(n); imgNames.add(p); return p; };

// b-roll ya anclado (lo usamos para darle fondo a los componentes que necesitan un clip)
let BROLL = [];
try {
  const bs = fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8");
  BROLL = JSON.parse(bs.slice(bs.indexOf("= [") + 2, bs.lastIndexOf("]") + 1));
} catch { console.warn("(sin track de b-roll todavía)"); }

// ── 1) leer el mapa de dirección y aplanar ────────────────────────────────────────────────────
const MAP = JSON.parse(fs.readFileSync(`_beatmap_${SLUG}.json`, "utf8"));
const missing = [];
// El anclaje avanza con un CURSOR monotónico (para que una frase repetida caiga en su ocurrencia
// correcta). Pero el mapa viene de DOS olas de dirección que recorren el video entero cada una,
// así que cada ola necesita SU PROPIO cursor: con uno solo, la ola 2 arranca "en el pasado" y no
// ancla nada. (Esto tiró 40+ frases no ancladas en la primera corrida.)
const cursors = {};
const flat = [];

for (const sec of MAP) {
  const wave = sec.wave || 1;
  let cursor = cursors[wave] ?? 0;
  let sStart = sec.phrase ? findMs(sec.phrase, Math.max(0, cursor - 0.5)) : null;
  if (sStart == null) { missing.push(`SECCIÓN ${sec.key}: "${sec.phrase}"`); sStart = cursor + 4; }
  cursor = sStart;
  let firstOfSection = true;
  for (const b of sec.beats || []) {
    let t = b.at ? findMs(b.at, Math.max(0, cursor - 0.5)) : null;
    if (t == null) { missing.push(`${sec.key}/${b.kind}: "${b.at}"`); t = null; }
    // el avatar vuelve a pantalla completa al arrancar cada sección
    flat.push({ ...b, key: sec.key, _t: t, _first: firstOfSection });
    firstOfSection = false;
    if (t != null) cursor = t;
  }
  cursors[wave] = cursor;
}

// interpolar los que no ancló (reparto uniforme entre el anclado anterior y el siguiente)
for (let i = 0; i < flat.length; i++) {
  if (flat[i]._t != null) continue;
  let a = i - 1; while (a >= 0 && flat[a]._t == null) a--;
  let z = i + 1; while (z < flat.length && flat[z]._t == null) z++;
  const t0 = a >= 0 ? flat[a]._t : 0;
  const t1 = z < flat.length ? flat[z]._t : VIDEO_END;
  flat[i]._t = t0 + ((t1 - t0) * (i - a)) / (z - a);
}
flat.sort((x, y) => x._t - y._t);

// separación mínima: ningún beat pisa al anterior
const SEP = 1.6;
for (let i = 1; i < flat.length; i++) if (flat[i]._t < flat[i - 1]._t + SEP) flat[i]._t = flat[i - 1]._t + SEP;

// ── 2) construir los beats finales ────────────────────────────────────────────────────────────
const beats = [];
flat.forEach((b, i) => {
  const start = +b._t.toFixed(2);
  const nxt = i + 1 < flat.length ? flat[i + 1]._t : VIDEO_END;
  const cap = CAP[b.kind] ?? 6;
  const floor = b.kind === "raw" ? MIN_RAW : MIN_COMP;
  const dur = +Math.max(floor, Math.min(cap, nxt - start)).toFixed(2);
  const o = { id: `${b.key}_${i}`, start, dur, key: b.key, kind: b.kind };
  if (b._first) o.sectionStart = true;
  // MitoVerdad se da vuelta al 42% de su duración (clamp para que se lean las dos caras)
  if (b.kind === "mitoverdad") o.flipAt = Math.max(10, Math.min(Math.round(dur * FPS) - 26, Math.round(dur * FPS * 0.42)));

  // resolver los campos de imagen (nombre → ruta bajo public/)
  const put = (k, v) => { if (v !== undefined) o[k] = v; };
  if (b.kind === "raw") { o.src = regImg(b.image); put("kicker", b.kicker); }
  else {
    for (const [k, v] of Object.entries(b)) {
      if (["kind", "at", "image", "key", "_t", "items", "steps", "slides", "bars", "annotations", "tokens", "chips", "words"].includes(k)) continue;
      o[k] = v;
    }
    if (b.image) o.image = regImg(b.image);
    // BlurExplainer necesita DOS medios: `clip` (fondo que se desenfoca) e `image` (el inset).
    // Los directores sólo dan `image`; sin `clip`, Media hace staticFile(undefined) y MATA el chunk
    // ("undefined was passed to staticFile()" — tiró 5 de 20 chunks en la 1ª corrida).
    // Se lo damos con el b-roll REAL que cubre ese instante; si no hay, la misma imagen de fondo.
    if (b.kind === "blurexplainer" && !b.clip) {
      const bajo = BROLL.find((c) => c.start <= start && start < c.start + c.dur);
      o.clip = bajo ? bajo.src : o.image;
    }
    if (b.tokens) o.tokens = b.tokens;
    if (b.chips) o.chips = b.chips;
    if (b.words) o.words = b.words;
    if (b.bars) o.bars = b.bars;
    if (b.annotations) o.annotations = b.annotations;
    if (b.steps) o.steps = b.steps.map((s) => ({ ...s, image: s.image ? regImg(s.image) : undefined }));
    if (b.slides) o.slides = b.slides.map((s) => ({ ...s, image: s.image ? regImg(s.image) : undefined }));
    if (b.items) {
      if (b.kind === "focuscards") {
        // el `at` de cada tarjeta va en FRAMES relativos, anclado al ms donde se dice ESE número
        o.items = b.items.map((it, k) => {
          const ms = it.atPhrase ? findMs(it.atPhrase, start - 0.3) : null;
          const rel = ms != null ? Math.max(0, Math.round((ms - start) * FPS)) : Math.round((k * 2.2) * FPS);
          if (it.atPhrase && ms == null) missing.push(`focuscard "${it.atPhrase}"`);
          return { image: regImg(it.image), label: it.label, at: rel };
        });
        // la tarjeta necesita respirar después del último número
        const last = Math.max(...o.items.map((x) => x.at)) / FPS;
        o.dur = +Math.min(CAP.focuscards, Math.max(o.dur, last + 3.2)).toFixed(2);
      } else if (b.kind === "avatarkeyword") {
        o.items = b.items.map((it, k) => ({ ...it, at: typeof it.at === "number" ? it.at : k * 60, image: it.image ? regImg(it.image) : undefined }));
      } else if (typeof b.items[0] === "object") {
        o.items = b.items.map((it) => (it.image ? { ...it, image: regImg(it.image) } : it));
      } else o.items = b.items;
    }
  }
  beats.push(o);
});

// ── 2b) proteger las ESCENAS FULL largas (focuscards / pizarra) ───────────────────────────────
// El recap con FocusCards enfoca una tarjeta por número a lo largo de ~12s. Si otro componente
// arranca adentro de esa ventana, se dibuja ENCIMA (los comps se pintan en orden de start) y el
// mecanismo de enfoque se pierde. Lo mismo con la pizarra. Se sacan los invasores.
const PROTEGE = new Set(["focuscards", "whiteboard"]);
const zonas = beats.filter((b) => PROTEGE.has(b.kind)).map((b) => [b.start, b.start + b.dur]);
const invadidos = beats.filter((b) => !PROTEGE.has(b.kind) && b.kind !== "raw" &&
  zonas.some(([s, e]) => b.start > s + 0.05 && b.start < e - 0.05));
for (const b of invadidos) beats.splice(beats.indexOf(b), 1);
if (invadidos.length) console.log(`escenas protegidas: saqué ${invadidos.length} componentes que pisaban un focuscards/pizarra`);

// ── 3) TALKSZ: el avatar VUELVE full cada ~40s y en los remates ───────────────────────────────
// Sin esto el avatar queda escondido casi todo el video (el b-roll cubre el ~90%).
const TALK_EVERY = 38, TALK_DUR = 4.2;
const talks = [];
let tnext = 12;
for (const b of beats) {
  if (b.start < tnext) continue;
  // engancharlo al arranque de un beat para que el corte caiga en una frase, no en el medio
  talks.push({ start: +b.start.toFixed(2), dur: TALK_DUR });
  tnext = b.start + TALK_EVERY;
}

// ── 4) escribir ───────────────────────────────────────────────────────────────────────────────
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano (se regenera).\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats, null, 0)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — ventanas donde el avatar vuelve a pantalla completa.\n` +
  `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);

const imgs = [...imgNames].sort();
fs.writeFileSync(`_imgs_${SLUG}.json`, JSON.stringify(imgs, null, 1));

// manifiesto para density_gate (un renglón por instancia REAL que se va a renderizar)
const man = [];
for (const b of beats) man.push(b.kind === "raw" ? "<RawShot />" : `<${COMPNAME[b.kind] || "LowerThird"} />`);
fs.writeFileSync(`_manifest_${SLUG}.txt`, man.join("\n"));

// ── 5) reporte ────────────────────────────────────────────────────────────────────────────────
const kinds = {};
for (const b of beats) kinds[b.kind] = (kinds[b.kind] || 0) + 1;
const comps = beats.filter((b) => b.kind !== "raw").length;
const raws = beats.length - comps;
const mins = VIDEO_END / 60;
if (missing.length) { console.log(`⚠ frases NO ancladas (${missing.length}):`); for (const m of missing.slice(0, 25)) console.log("   ·", m); }
console.log(`\nbeats: ${beats.length} · componentes: ${comps} (${(comps / mins).toFixed(1)}/min) · raw: ${raws}`);
console.log(`kinds distintos: ${Object.keys(kinds).length} →`, JSON.stringify(kinds));
console.log(`imágenes a generar: ${imgs.length}`);
console.log(`TALKSZ (avatar full): ${talks.length} ventanas`);
console.log(`VIDEO_END: ${VIDEO_END.toFixed(1)}s · TOTAL_FRAMES: ${Math.round(VIDEO_END * FPS)}`);
