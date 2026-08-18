// beatsheet.mjs — UNA sola fuente de verdad por video (nicho doc-broll).
//
// El problema que resuelve: hoy el prompts.json (qué imágenes generar) y los cues
// (cómo se cablean en Main) se escriben por separado → se desincronizan, hay que
// tipear cada nombre dos veces y wirear 150 cues a mano. Eso es de donde sale el
// caos y el gasto de tokens. Acá un único beatsheet/<video>.json describe CADA beat
// (timing + componente + props + el prompt para generar su asset), y este script
// DERIVA automáticamente:
//   1) public/img/prompts_<video>.json   (imágenes + láminas/diagramas a generar)
//   2) public/vid/clips_<video>.json     (clips img2video a generar)
//   3) src/VideoEdit/cues_<video>.gen.tsx (export CUES + REFRAME, listo para importar)
//
// Flujo optimizado (1 pasada):
//   node beatsheet.mjs beatsheet/termitas.json
//   node gen_deapi.mjs public/img/prompts_termitas.json    # genera TODO el lote
//   node gen_video.mjs public/vid/clips_termitas.json      # genera TODOS los clips
//   # en Main_<video>.tsx:  import { CUES, REFRAME } from "./cues_<video>.gen";
//   TMP=C:\rtmp TEMP=C:\rtmp npx remotion render <Comp> out/x.mp4 --concurrency=16
//
// ── Esquema beatsheet/<video>.json ───────────────────────────────────────────
// {
//   "video": "termitas",
//   "avatar": "termitas_opt.mp4",
//   "beats": [
//     // foto/clip crudo full-bleed (RawShot). gen.type "image" o "clip".
//     { "id":"m01","start":0.4,"dur":3.2,"kind":"raw","src":"vid/caja_polvo.mp4",
//       "hue":"amber","kicker":"El polvo de la caja",
//       "gen":{"type":"clip","image":"caja_polvo","prompt":"...","frames":90} },
//     { "id":"m03","start":6.0,"dur":2.4,"kind":"raw","src":"img/ferreteria.png",
//       "hue":"amber","kicker":"~1000 pesos",
//       "gen":{"type":"image","name":"ferreteria","prompt":"Realistic handheld..."} },
//
//     // ★ DIAGRAM BOARD (AvatarPresentation) — el mejor componente, usalo MUCHO.
//     // avatar chico arriba-derecha + láminas gpt-image-2 grandes que explican.
//     { "id":"d1","start":120,"dur":9,"kind":"diagram","eyebrow":"Cómo actúa el bórax",
//       "hue":"amber","accent":"accent",
//       "slides":[
//         {"image":"img/diag_borax_1.png","title":"La obrera come madera",
//          "gen":{"type":"image","name":"diag_borax_1","prompt":"clean explanatory diagram, flat vector, labels in Spanish, ..."}},
//         {"image":"img/diag_borax_2.png","title":"Lleva el bórax al nido",
//          "gen":{"type":"image","name":"diag_borax_2","prompt":"clean explanatory diagram ..."}}
//       ] },
//
//     // cita cinética sobre imagen (KineticQuote). *palabra* = resaltada.
//     { "id":"q1","start":47,"dur":3,"kind":"quote","image":"img/borax.png",
//       "eyebrow":"Lo que tengo en la caja","text":"No es un *veneno*",
//       "accent":"danger","hue":"cold","fontSize":104 },
//
//     // chips sobre imagen (ChipsCluster)
//     { "id":"c1","start":69,"dur":3,"kind":"chips","bg":"image","image":"img/termita.png",
//       "title":"Mata una sola cosa","chips":["lo que MUERDE","la madera"],"hue":"red" },
//
//     // lista lado-a-lado (SplitList). palette = token de color: A|G|D|B.
//     { "id":"s1","start":135,"dur":3.5,"kind":"splitlist","title":"Te venden la madera así",
//       "items":["Sin tratar","Sin protección","Lista para que la coman"],"palette":"D","cross":true },
//
//     // split avatar+contenido: agregá "reframe": true a CUALQUIER beat con
//     // componente que viva en la mitad libre → genera la ventana REFRAME (avatar
//     // se achica a la derecha). (raw es full-bleed: NO le pongas reframe.)
//     { "id":"sp1","start":200,"dur":8,"kind":"splitlist","reframe":true, "...":"..." },
//
//     // avatar hablando a pantalla completa: no emite cue (es documentación).
//     { "id":"talk1","start":80,"dur":10,"kind":"talk" }
//   ]
// }
import fs from "fs";
import path from "path";
import { probeMedia } from "./match_v3/lib.mjs";

const bsArg = process.argv[2];
if (!bsArg) {
  console.error("Uso: node beatsheet.mjs beatsheet/<video>.json");
  process.exit(1);
}
if (!fs.existsSync(bsArg)) {
  console.error("No existe el beatsheet:", bsArg);
  process.exit(1);
}
const bs = JSON.parse(fs.readFileSync(bsArg, "utf8"));
const VIDEO = bs.video || path.basename(bsArg).replace(/\.json$/, "");
const AVATAR = bs.avatar || "avatar.mp4";
let beats = bs.beats || [];

// ── DURACIÓN REAL de cada clip (ffprobe, cache por mtime) ────────────────────
// Alimenta el anti-congelado de Media: si el beat en el timeline es más largo que
// el archivo, el playbackRate se adapta o se loopea — nunca más un frame clavado.
const PROBE_CACHE = path.join("public", "broll", "_probe_cache.json");
let _probeCache = {};
try { _probeCache = JSON.parse(fs.readFileSync(PROBE_CACHE, "utf8")); } catch {}
let _probeDirty = false;
const clipDurOf = (rel) => {
  if (!/\.(mp4|webm|mov)$/i.test(rel || "")) return null;
  const abs = path.join("public", rel);
  if (!fs.existsSync(abs)) return null;
  const key = `${rel}:${Math.round(fs.statSync(abs).mtimeMs)}`;
  if (_probeCache[key] != null) return _probeCache[key];
  const m = probeMedia(abs);
  const d = m ? +m.duration.toFixed(2) : null;
  _probeCache[key] = d; _probeDirty = true;
  return d;
};

// ── GRADE de normalización por clip (lo escribe scripts/probe_grade.mjs) ─────
// {"<asset sin ext>": "brightness(1.03) saturate(0.97)"} — corrige el salto de
// exposición/saturación entre fuentes; NO es un look (regla: colores naturales).
let gradeMap = {};
try { gradeMap = JSON.parse(fs.readFileSync(path.join("public", "broll", `_grade_${VIDEO}.json`), "utf8")); } catch {}
const gradeOf = (rel) => gradeMap[path.basename(rel || "").replace(/\.[^.]+$/, "")] || null;

// ── AUTOSPLIT de pacing (opt-in con "maxRawDur" en el beatsheet) ──────────────
// Un plano raw más largo que maxRawDur se parte en tomas A/B/C del MISMO asset con
// Ken-Burns distinto (kbPhase) → el corte "respira" sin cambiar el footage. Fix del
// patrón medido en ventilador.mp4: planos de 24-41s clavados matando la retención.
const MAX_RAW = +bs.maxRawDur || 0;
if (MAX_RAW > 0) {
  const out = [];
  let nsplit = 0;
  for (const b of beats) {
    if (b.kind !== "raw" || !b.dur || b.dur <= MAX_RAW * 1.25 || b.noSplit) { out.push(b); continue; }
    const parts = Math.min(5, Math.ceil(b.dur / MAX_RAW));
    const step = +(b.dur / parts).toFixed(2);
    for (let p = 0; p < parts; p++) {
      out.push({
        ...b,
        id: `${b.id}_${"abc"[p]}`,
        start: +(b.start + p * step).toFixed(2),
        dur: p === parts - 1 ? +(b.dur - step * (parts - 1)).toFixed(2) : step,
        kbPhase: p + 1,
        ...(p > 0 ? { trans: 0, kicker: undefined } : {}),
      });
    }
    nsplit++;
  }
  if (nsplit) console.log(`✂ autosplit: ${nsplit} planos raw > ${MAX_RAW}s partidos en tomas A/B (kbPhase)`);
  beats = out;
}

// ── 1+2) extraer assets a generar (dedup por nombre) ─────────────────────────
const images = new Map(); // name -> {name,prompt,width?,height?}
const clips = new Map(); // name -> {name,image,prompt,frames?}
const addImage = (g) => {
  if (!g || g.type !== "image" || !g.name || images.has(g.name)) return;
  const o = { name: g.name, prompt: g.prompt };
  if (g.width) o.width = g.width;
  if (g.height) o.height = g.height;
  images.set(g.name, o);
};
const addClip = (g) => {
  if (!g || g.type !== "clip" || !g.image || clips.has(g.image)) return;
  const o = { name: g.image, image: g.image, prompt: g.prompt };
  if (g.frames) o.frames = g.frames;
  clips.set(g.image, o);
};
for (const b of beats) {
  addImage(b.gen);
  addImage(b.genL); // regrow: imagen izquierda (basura)
  addImage(b.genR); // regrow: imagen derecha (cosecha)
  addClip(b.gen);
  for (const s of b.slides || []) addImage(s.gen);
}

// ── validaciones suaves (avisos, no frenan) ──────────────────────────────────
const warnings = [];
// solapamiento de ventanas de cue
const cueBeats = beats.filter((b) => b.kind && b.kind !== "talk");
// floats son overlay INTENCIONAL sobre el avatar full → no cuentan como solape
const sorted = [...cueBeats].filter((b) => b.kind !== "float" && !b.overlay).sort((a, b) => a.start - b.start);
for (let i = 1; i < sorted.length; i++) {
  const prevEnd = sorted[i - 1].start + sorted[i - 1].dur;
  // hasta 0.35s de solape es INTENCIONAL (overlap anti-flash del build) → no avisar
  if (sorted[i].start < prevEnd - 0.35) {
    warnings.push(
      `solapan: ${sorted[i - 1].id} (${sorted[i - 1].start}–${prevEnd.toFixed(1)}) y ${sorted[i].id} (desde ${sorted[i].start})`
    );
  }
}
// ── GATE DE PACING (dato medido: en ventilador.mp4 los cortes/min cayeron de 15 a 4
// en la 2ª mitad y hubo planos de 30-41s → retención muerta). Aviso duro acá; el fix
// automático es "maxRawDur" (autosplit) o partir el beat en el build.
{
  const rawBeats = beats.filter((b) => b.kind === "raw" && b.dur);
  const longs = rawBeats.filter((b) => b.dur > 12);
  if (longs.length) warnings.push(`PACING: ${longs.length} planos raw >12s (${longs.slice(0, 6).map((b) => `${b.id}:${b.dur}s`).join(", ")}${longs.length > 6 ? "…" : ""}) → poné "maxRawDur": 8 en el beatsheet o partilos`);
  if (rawBeats.length) {
    const avg = rawBeats.reduce((a, b) => a + b.dur, 0) / rawBeats.length;
    if (avg > 7) warnings.push(`PACING: plano raw medio ${avg.toFixed(1)}s (regla del nicho ~4.5-5s)`);
  }
}

// assets referenciados que no se generan ni existen en disco
const exists = (rel) => fs.existsSync(path.join("public", rel));
const refs = [];
for (const b of beats) {
  if (b.src) refs.push(b.src);
  if (b.image && b.kind !== "diagram") refs.push(b.image);
  if (b.leftImage) refs.push(b.leftImage);
  if (b.rightImage) refs.push(b.rightImage);
  for (const s of b.slides || []) if (s.image) refs.push(s.image);
  if (b.worldImage) refs.push(b.worldImage);
  if (b.mapImage) refs.push(b.mapImage);
  for (const wp of b.waypoints || []) if (wp.image) refs.push(wp.image);
  for (const s of b.steps || []) if (s.image) refs.push(s.image);     // ProcessSteps (rompió un render)
  for (const e of b.events || []) if (e.image) refs.push(e.image);    // SagaTimeline
  for (const c of b.cards || []) if (c.src) refs.push(c.src);          // teasecards
  for (const im of b.images || []) refs.push(typeof im === "string" ? im : im.src); // infzoom
}
const willGen = new Set([
  ...[...images.keys()].map((n) => `img/${n}.png`),
  ...[...clips.keys()].map((n) => `vid/${n}.mp4`),
]);
for (const r of [...new Set(refs)]) {
  if (!willGen.has(r) && !exists(r)) warnings.push(`asset sin generar ni en disco: ${r}`);
}

// ── 3) emitir cues_<video>.gen.tsx ───────────────────────────────────────────
const j = (v) => JSON.stringify(v); // string/num/array/obj -> literal JS válido en JSX

// ── KIT genérico (src/VideoEdit/kit/) — kind → Componente. Props se pasan por spread+as any ──
const KIT = {
  titlecard: "TitleCardKit", lowerthird: "LowerThirdKit", chaptermarker: "ChapterMarkerKit",
  bigstat: "BigStatKit", statgrid: "StatGridKit", bulletlist: "BulletListKit",
  numberedsteps: "NumberedStepsKit", timeline: "TimelineKit", comparetwo: "CompareTwoKit",
  barchart: "BarChartKit", rankingbars: "RankingBarsKit", donutstat: "DonutStatKit",
  partsdiagram: "PartsDiagramKit", crosssection: "CrossSectionKit", flowarrows: "FlowArrowsKit",
  cyclediagram: "CycleDiagramKit", mappin: "MapPinKit", annotatedphoto: "AnnotatedPhotoKit",
  polaroidstack: "PolaroidStackKit", quotecard: "QuoteCardKit", equation: "EquationKit",
  ingredientscard: "IngredientsCardKit", costtally: "CostTallyKit", gaugemeter: "GaugeMeterKit",
  stampreveal: "StampRevealKit", labelcallout: "LabelCalloutKit", splitpanel: "SplitPanelKit",
  processgrid: "ProcessGridKit", closingcard: "ClosingCardKit",
  // ── bespoke peróxido ──
  pxbottle: "PxBottleReveal", pxsoil: "PxSoilBreath", pxseed: "PxSeedAwaken", pxrescue: "PxRootRescue",
  pxmildew: "PxMildewRetreat", pxsun: "PxSunLupa", pxdose: "PxDoseScale", pxfizz: "PxFizzTest",
  pxamber: "PxAmberDecay", pxgnats: "PxGnatsLift", pxwater: "PxWaterRevive", pxcost: "PxCostCart",
  pxforge: "PxMoleculeForge", pxdrown: "PxDrownedPlant", pxmyth: "PxMythStamp", pxseven: "PxSevenSeal",
};
const KIT_SYS = new Set(["id", "start", "dur", "kind", "overlay", "gen", "anec", "darken", "reframe", "t", "src", "focus", "trans", "grade", "kbPhase", "noSplit", "sfx"]);
const cleanSlides = (slides) =>
  (slides || []).map((s) => {
    const o = {};
    if (s.image) o.image = s.image;
    if (s.title) o.title = s.title;
    if (s.note) o.note = s.note;
    return o;
  });

function renderEl(b) {
  switch (b.kind) {
    case "city3d": return `<City3D${b.tOffset != null ? ` tOffset={${b.tOffset}}` : ``} />`;
    case "globe3d": return `<Globe3D${b.tOffset != null ? ` tOffset={${b.tOffset}}` : ``} />`;
    case "oner3d": return `<Oner3D${b.tOffset != null ? ` tOffset={${b.tOffset}}` : ``} />`;
    case "number3d":
      return `<Number3D num=${j(String(b.num ?? "01"))} country=${j(String(b.country ?? ""))}${b.accent ? ` accent=${j(b.accent)}` : ``}${b.tOffset != null ? ` tOffset={${b.tOffset}}` : ``} />`;
    case "raw": {
      const cd = clipDurOf(b.src);
      const gr = b.grade ?? gradeOf(b.src);
      return (
        `<RawShot durationInFrames={d} src=${j(b.src)}` +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.darken != null ? ` darken={${b.darken}}` : ``) +
        (b.blur != null ? ` blur={${b.blur}}` : ``) +
        (b.zoom != null ? ` zoom={${j(b.zoom)}}` : ``) +
        (b.fit ? ` fit=${j(b.fit)}` : ``) +
        (cd != null ? ` clipDur={${cd}}` : ``) +
        (b.focus ? ` focus=${j(b.focus)}` : ``) +
        (b.trans ? ` trans={${b.trans === true ? 9 : b.trans}}` : ``) +
        (gr ? ` grade=${j(gr)}` : ``) +
        (b.kbPhase != null ? ` kbPhase={${b.kbPhase}}` : ``) +
        ` />`
      );
    }
    case "scrolldoc":
      // LIENZO UNIFICADO que scrollea sin cortes (ScrollDoc): cada placa = clip/foto +
      // texto que se tipea sincronizado. Reemplaza tandas de comps sueltos que hacían "fin".
      return `<ScrollDoc durationInFrames={d} panels={${j(b.panels || [])}} />`;
    case "avpizarra":
      // PIZARRA SOBRE EL AVATAR VIVO: zoom+dim+blur del clip del avatar + PNG recortado
      // (transparente) entrando con animación + título/cuerpo + flecha. clip recortado
      // por split_avatar_diagrams → OffthreadVideo desde frame 0 (no negro en el farm).
      return (
        `<AvatarPizarra durationInFrames={d}` +
        ` clip=${j(`avatar_clips/${b.id}.mp4`)}` +
        ` items={${j(b.items || [])}}` +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "diagram": {
      // DIAGRAMA ESTÁTICO (regla dura del nicho): DiagramBoard = lámina quieta +
      // avatar PiP esquina, hard-cut entre páginas, SIN zoom/Ken-Burns. Calmo y pro.
      const pages = (b.slides || []).map((s) => ({ image: s.image, eyebrow: s.title || s.eyebrow || b.eyebrow }));
      // clip CORTO del avatar (recortado a esta ventana por split_avatar_diagrams.mjs)
      // → DiagramBoard lo reproduce desde frame 0, sin deep-seek (no sale negro en el farm).
      return (
        `<DiagramBoard durationInFrames={d}` +
        ` clip=${j(`avatar_clips/${b.id}.mp4`)}` +
        ` pages={${j(pages)}} />`
      );
    }
    case "layered":
      // REVELADO POR CAPAS con zoom (LayeredReveal): imagen principal + sub-revelados
      // escalonados (cada uno con su atFrame LOCAL, ya calculado en build_madera).
      return (
        `<LayeredReveal durationInFrames={d} main={${j(b.main || {})}}` +
        (b.subs ? ` subs={${j(b.subs)}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "quote":
      return (
        `<KineticQuote durationInFrames={d}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` words={parseQuote(${j(b.text || "")})}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        ` />`
      );
    case "chips":
      return (
        `<ChipsCluster durationInFrames={d}` +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` chips={${j(b.chips || [])}}` +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "splitlist": {
      const pal = { A: "A", G: "G", D: "D", B: "B" }[b.palette] || "A";
      return (
        `<SplitList durationInFrames={d}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` items={${j(b.items || [])}}` +
        ` accent={${pal}}` +
        (b.cross ? ` cross` : ``) +
        ` />`
      );
    }
    case "struckcards":
      return (
        `<StruckCards durationInFrames={d} items={${j(b.items || [])}} />`
      );
    case "radsky":
      return (
        `<ColdRadiationSky durationInFrames={d}` +
        (b.airTemp ? ` airTemp=${j(b.airTemp)}` : ``) +
        ` />`
      );
    case "coldcal":
      return `<ColdCalendar durationInFrames={d} />`;
    case "heatslow":
      return `<HeatSlowDiagram durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + ` />`;
    case "doorcold":
      return `<DoorColdFalls durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + ` />`;
    case "revealcards":
      return (
        `<RevealCards durationInFrames={d} items={${j(b.items || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.numbered === false ? ` numbered={false}` : ``) +
        ` />`
      );
    case "winterbank":
      return `<WinterBank durationInFrames={d} />`;
    case "frostwipe":
      return `<FrostWipe durationInFrames={d} />`;
    case "lowerthird":
      return (
        `<CinematicLowerThird durationInFrames={d} image=${j(b.image)}` +
        (b.place ? ` place=${j(b.place)}` : ``) +
        (b.date ? ` date=${j(b.date)}` : ``) +
        ` />`
      );
    case "mapzoom":
      return (
        `<VintageMapZoom durationInFrames={d} image=${j(b.image)}` +
        (b.pinX != null ? ` pinX={${b.pinX}}` : ``) +
        (b.pinY != null ? ` pinY={${b.pinY}}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.zoom != null ? ` zoom={${b.zoom}}` : ``) +
        ` />`
      );
    case "cutaway":
      return (
        `<CutawayCallout durationInFrames={d}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "rollnum":
      return (
        `<Odometer durationInFrames={d} value={${b.value}}` +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "splitba":
      return (
        `<SplitBeforeAfter durationInFrames={d} beforeImg=${j(b.beforeImg)} afterImg=${j(b.afterImg)}` +
        (b.beforeLabel ? ` beforeLabel=${j(b.beforeLabel)}` : ``) +
        (b.afterLabel ? ` afterLabel=${j(b.afterLabel)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "saltplunge":
      return (
        `<SaltPlunge durationInFrames={d}` +
        (b.from != null ? ` from={${b.from}}` : ``) +
        (b.to != null ? ` to={${b.to}}` : ``) +
        ` />`
      );
    case "redacted":
      return (
        `<RedactedReveal durationInFrames={d} image=${j(b.image)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.redacted ? ` redacted=${j(b.redacted)}` : ``) +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        ` />`
      );
    case "impstamp":
      return (
        `<ImpossibleStamp durationInFrames={d} image=${j(b.image)}` +
        (b.word ? ` word=${j(b.word)}` : ``) +
        ` />`
      );
    case "blurexplainer":
      return (
        `<BlurExplainer durationInFrames={d} clip=${j(b.clip)} image=${j(b.image)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.body ? ` body=${j(b.body)}` : ``) +
        (b.side ? ` side=${j(b.side)}` : ``) +
        ` />`
      );
    case "ingredients":
      return (
        `<IngredientEquation durationInFrames={d} items={${j(b.items || [])}}` +
        (b.resultLabel ? ` resultLabel=${j(b.resultLabel)}` : ``) +
        ` />`
      );
    case "spooncream":
      return (
        `<SpoonInCream durationInFrames={d} image=${j(b.image)}` +
        (b.temp ? ` temp=${j(b.temp)}` : ``) +
        (b.headline ? ` headline=${j(b.headline)}` : ``) +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        ` />`
      );
    case "stat":
      return (
        `<StatBig durationInFrames={d} value={${b.value}}` +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.decimals != null ? ` decimals={${b.decimals}}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "impact":
      return (
        `<ImpactReveal durationInFrames={d} image=${j(b.image)} impact=${j(b.impact)}` +
        (b.setup ? ` setup=${j(b.setup)}` : ``) +
        (b.impactAccent ? ` impactAccent=${j(b.impactAccent)}` : ``) +
        (b.hitAt != null ? ` hitAt={${b.hitAt}}` : ``) +
        (b.boom != null ? ` boom={${b.boom}}` : ``) +
        (b.darken != null ? ` darken={${b.darken}}` : ``) +
        ` />`
      );
    case "floatcards":
      return (
        `<FloatCards durationInFrames={d} cards={${j(b.cards || [])}} />`
      );
    case "kineticline":
      return (
        `<KineticLine durationInFrames={d} words={${j(b.words || [])}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "blurreveal":
      return (
        `<BlurReveal durationInFrames={d} title=${j(b.title)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "hugel":
      return (
        `<HugelDiagram durationInFrames={d}` +
        (b.mode ? ` mode=${j(b.mode)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "olla":
      return (
        `<OllaDiagram durationInFrames={d}` +
        (b.mode ? ` mode=${j(b.mode)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "perox":
      return (
        `<PeroxidoDiagram durationInFrames={d}` +
        (b.mode ? ` mode=${j(b.mode)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "gridreveal":
      return (
        `<GridReveal durationInFrames={d} tiles={${j(b.tiles || [])}}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.subtitle ? ` subtitle=${j(b.subtitle)}` : ``) +
        ` />`
      );
    case "growthtimeline":
      return (
        `<GrowthTimeline durationInFrames={d} stages={${j(b.stages || [])}}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.image ? ` bg=${j(b.image)}` : ``) +
        ` />`
      );
    case "numcard":
      return (
        `<NumberCard durationInFrames={d} number=${j(b.number)} name=${j(b.name)}` +
        (b.image ? ` bg=${j(b.image)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.total ? ` total=${j(b.total)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "lielist":
      return (
        `<LieList durationInFrames={d} title=${j(b.title)} items={${j(b.items || [])}}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "regrow":
      return (
        `<RegrowSplit durationInFrames={d} leftImage=${j(b.leftImage)} rightImage=${j(b.rightImage)}` +
        (b.number ? ` number=${j(b.number)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.leftLabel ? ` leftLabel=${j(b.leftLabel)}` : ``) +
        (b.rightLabel ? ` rightLabel=${j(b.rightLabel)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "journey":
      return (
        `<JourneyCanvas durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.worldImage ? ` worldImage=${j(b.worldImage)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.dark ? ` dark` : ``) +
        ` waypoints={${j(b.waypoints || [])}} />`
      );
    case "float":
      return (
        `<FloatingInsert durationInFrames={d} src=${j(b.src)}` +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "headline":
      return (
        `<KineticHeadline durationInFrames={d} tokens={${j(b.tokens || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.size ? ` size={${b.size}}` : ``) +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "aged":
      return (
        `<AgedDoc durationInFrames={d} heading=${j(b.heading || "")} lines={${j(b.lines || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "vs":
      return (
        `<VsCard durationInFrames={d} left={${j(b.left || {})}} right={${j(b.right || {})}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "bars":
      return (
        `<BarCompare durationInFrames={d} bars={${j(b.bars || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.orientation ? ` orientation=${j(b.orientation)}` : ``) +
        (b.unit ? ` unit=${j(b.unit)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "cross":
      return (
        `<CrossSection durationInFrames={d} layers={${j(b.layers || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.marker !== undefined ? ` marker={${j(b.marker)}}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "process":
      return (
        `<ProcessSteps durationInFrames={d} steps={${j(b.steps || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "waterlens":
      return (
        `<WaterLensLight durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.flameLabel ? ` flameLabel=${j(b.flameLabel)}` : ``) +
        (b.lensLabel ? ` lensLabel=${j(b.lensLabel)}` : ``) +
        (b.poolLabel ? ` poolLabel=${j(b.poolLabel)}` : ``) +
        ` />`
      );
    case "rampump":
      return (
        `<RamPumpCycle durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.driveTag ? ` driveTag={${j(b.driveTag)}}` : ``) +
        (b.wasteTag ? ` wasteTag={${j(b.wasteTag)}}` : ``) +
        (b.airTag ? ` airTag={${j(b.airTag)}}` : ``) +
        (b.tankTag ? ` tankTag={${j(b.tankTag)}}` : ``) +
        (b.ratioTag ? ` ratioTag=${j(b.ratioTag)}` : ``) +
        ` />`
      );
    case "earthtube":
      return (
        `<EarthTubeDiagram durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.intake ? ` intake={${j(b.intake)}}` : ``) +
        (b.soil ? ` soil={${j(b.soil)}}` : ``) +
        (b.out ? ` out={${j(b.out)}}` : ``) +
        (b.depthTag ? ` depthTag=${j(b.depthTag)}` : ``) +
        (b.lengthTag ? ` lengthTag=${j(b.lengthTag)}` : ``) +
        (b.drainTag ? ` drainTag=${j(b.drainTag)}` : ``) +
        ` />`
      );
    case "curediagram":
      return (
        `<CureDiagram durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.saltTag ? ` saltTag=${j(b.saltTag)}` : ``) +
        (b.waterTag ? ` waterTag=${j(b.waterTag)}` : ``) +
        (b.keepTag ? ` keepTag=${j(b.keepTag)}` : ``) +
        ` />`
      );
    case "windmill":
      return (
        `<WindmillDiagram durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.wind ? ` wind={${j(b.wind)}}` : ``) +
        (b.pump ? ` pump={${j(b.pump)}}` : ``) +
        (b.tank ? ` tank={${j(b.tank)}}` : ``) +
        (b.out ? ` out={${j(b.out)}}` : ``) +
        (b.partsTag ? ` partsTag=${j(b.partsTag)}` : ``) +
        ` />`
      );
    case "massheater":
      return (
        `<MassHeaterDiagram durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.mode ? ` mode=${j(b.mode)}` : ``) +
        (b.fire ? ` fire={${j(b.fire)}}` : ``) +
        (b.mass ? ` mass={${j(b.mass)}}` : ``) +
        (b.out ? ` out={${j(b.out)}}` : ``) +
        (b.coolTag ? ` coolTag=${j(b.coolTag)}` : ``) +
        (b.effTag ? ` effTag=${j(b.effTag)}` : ``) +
        ` />`
      );
    case "zeerpot":
      return (
        `<ZeerPotDiagram durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.inner ? ` inner={${j(b.inner)}}` : ``) +
        (b.sand ? ` sand={${j(b.sand)}}` : ``) +
        (b.outer ? ` outer={${j(b.outer)}}` : ``) +
        (b.dropTag ? ` dropTag=${j(b.dropTag)}` : ``) +
        (b.gapTag ? ` gapTag=${j(b.gapTag)}` : ``) +
        ` />`
      );
    case "checklist":
      return (
        `<Checklist durationInFrames={d} title=${j(b.title || "")} items={${j(b.items || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "rule":
      return (
        `<RuleNumberScene durationInFrames={d} number=${j(b.number || "01")} title=${j(b.title || "")}` +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "annotated":
      return (
        `<AnnotatedImage durationInFrames={d} image=${j(b.image)} annotations={${j(b.annotations || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "breaking":
      return (
        `<BreakingReveal durationInFrames={d} headline=${j(b.headline || "")}` +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.number ? ` number=${j(b.number)}` : ``) +
        (b.badge ? ` badge=${j(b.badge)}` : ``) +
        (b.ticker ? ` ticker=${j(b.ticker)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "presenter":
      return (
        `<PresenterTag durationInFrames={d} name=${j(b.name || "")}` +
        (b.subtitle ? ` subtitle=${j(b.subtitle)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "ticker":
      return (
        `<NewsTicker durationInFrames={d} items={${j(b.items || [])}}` +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.speed ? ` speed={${Number(b.speed)}}` : ``) +
        ` />`
      );
    case "verified":
      return (
        `<VerifiedStamp durationInFrames={d}` +
        (b.text ? ` text=${j(b.text)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.angle != null ? ` angle={${Number(b.angle)}}` : ``) +
        ` />`
      );
    case "steptrack":
      return (
        `<StepTracker durationInFrames={d} step={${Number(b.step || 1)}}` +
        (b.total != null ? ` total={${Number(b.total)}}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "statslam":
      return (
        `<StatSlam durationInFrames={d} figure=${j(b.figure || "")}` +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "alertwipe":
      return (
        `<AlertWipe durationInFrames={d}` +
        (b.text ? ` text=${j(b.text)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "callout":
      return (
        `<CalloutMark durationInFrames={d} figure=${j(b.figure || "")}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "infzoom":
      return (
        `<InfiniteZoom durationInFrames={d} images={${j(b.images || [])}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "teasecards":
      return (
        `<FoodTeaseCards durationInFrames={d} cards={${j(b.cards || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "half":
      return (
        `<HalfShot durationInFrames={d} src=${j(b.src)}` +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "top7":
      return (
        `<Top7Ladder durationInFrames={d} rank={${b.rank}}` +
        (b.total != null ? ` total={${b.total}}` : ``) +
        ` items={${j(b.items || [])}}` +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        ` />`
      );
    case "riskclock":
      return (
        `<RiskClock durationInFrames={d} steps={${j(b.steps || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "moat":
      return (
        `<TickLineMoat durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "sizescale":
      return (
        `<SizeScale durationInFrames={d} items={${j(b.items || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "loctag":
      return (
        `<LocationTag durationInFrames={d} mapImage=${j(b.mapImage)} pinX={${b.pinX}} pinY={${b.pinY}} place=${j(b.place)}` +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        ` />`
      );
    case "chapter":
      return (
        `<ChapterTag durationInFrames={d} title=${j(b.title)}` +
        (b.num ? ` num=${j(b.num)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "nametag":
      return (
        `<NameTag durationInFrames={d} name=${j(b.name)}` +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "phrasetag":
      return (
        `<PhraseTag durationInFrames={d} text=${j(b.text)}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.pos ? ` pos=${j(b.pos)}` : ``) +
        ` />`
      );
    case "metertag":
      return (
        `<MeterTag durationInFrames={d} label=${j(b.label)}` +
        (b.fromPct != null ? ` fromPct={${b.fromPct}}` : ``) +
        (b.toPct != null ? ` toPct={${b.toPct}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.corner ? ` corner=${j(b.corner)}` : ``) +
        ` />`
      );
    case "foundertree":
      return (
        `<FounderTree durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "timeline":
      return (
        `<SagaTimeline durationInFrames={d} events={${j(b.events || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        ` />`
      );
    case "stattag":
      return (
        `<StatTag durationInFrames={d}` +
        (b.value != null ? ` value={${b.value}}` : ``) +
        (b.text ? ` text=${j(b.text)}` : ``) +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.corner ? ` corner=${j(b.corner)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "spreadmap":
      return (
        `<SpreadMap durationInFrames={d} mapImage=${j(b.mapImage)}` +
        (b.origin ? ` origin={${j(b.origin)}}` : ``) +
        (b.yearFrom != null ? ` yearFrom={${b.yearFrom}}` : ``) +
        (b.yearTo != null ? ` yearTo={${b.yearTo}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "costtally":
      return (
        `<CostTally durationInFrames={d} left={${j(b.left)}} right={${j(b.right)}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "scent":
      return (
        `<ScentConfuse durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.hue ? ` hue=${j(b.hue)}` : ``) +
        ` />`
      );
    case "depthtext":
      return (
        `<DepthText durationInFrames={d} back=${j(b.back)} fore=${j(b.fore)} title=${j(b.title || "")}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        ` />`
      );
    // ── componentes a medida del canal "Ben retirado" (look ALARMA) ──
    case "estateletter":
      return (
        `<EstateRecoveryLetter durationInFrames={d} amount=${j(b.amount)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.hitAt != null ? ` hitAt={${b.hitAt}}` : ``) +
        ` />`
      );
    case "twomoments":
      return (
        `<TwoMomentsSplit durationInFrames={d}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.leftLabel ? ` leftLabel=${j(b.leftLabel)}` : ``) +
        (b.leftSub ? ` leftSub=${j(b.leftSub)}` : ``) +
        (b.rightLabel ? ` rightLabel=${j(b.rightLabel)}` : ``) +
        (b.rightSub ? ` rightSub=${j(b.rightSub)}` : ``) +
        ` />`
      );
    case "mistake":
      return (
        `<MistakeCard durationInFrames={d} number=${j(b.number)} title=${j(b.title)}` +
        (b.desc ? ` desc=${j(b.desc)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "goldvault":
      return (
        `<GoldVault durationInFrames={d}` +
        (b.state ? ` state=${j(b.state)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        ` />`
      );
    case "lookback":
      return (
        `<LookbackTimeline durationInFrames={d}` +
        (b.years != null ? ` years={${b.years}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.flags ? ` flags={${j(b.flags)}}` : ``) +
        ` />`
      );
    case "tool":
      return (
        `<ProtectionTool durationInFrames={d} nameEs=${j(b.nameEs)} how=${j(b.how)}` +
        (b.number ? ` number=${j(b.number)}` : ``) +
        (b.nameEn ? ` nameEn=${j(b.nameEn)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        ` />`
      );
    case "deed":
      return (
        `<DeedStamp durationInFrames={d}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.stampText ? ` stampText=${j(b.stampText)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.hitAt != null ? ` hitAt={${b.hitAt}}` : ``) +
        ` />`
      );
    case "odometer":
      return (
        `<CostOdometer durationInFrames={d} to={${b.to}}` +
        (b.prefix ? ` prefix=${j(b.prefix)}` : ``) +
        (b.suffix ? ` suffix=${j(b.suffix)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.repeat ? ` repeat=${j(b.repeat)}` : ``) +
        ` />`
      );
    case "signature":
      return (
        `<SignaturePhrase durationInFrames={d} lines={${j(b.lines || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "vsmed":
      return (
        `<MedicareVsMedicaid durationInFrames={d} leftTitle=${j(b.leftTitle)} leftItems={${j(b.leftItems || [])}} rightTitle=${j(b.rightTitle)} rightItems={${j(b.rightItems || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "action":
      return (
        `<ActionStepCard durationInFrames={d} step=${j(b.step)} question=${j(b.question)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "keyphrase":
      return (
        `<KineticText durationInFrames={d} text=${j(b.text || "")}` +
        (b.src ? ` src=${j(b.src)}` : ``) +
        (b.blur === false ? ` blur={false}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        (b.position ? ` position=${j(b.position)}` : ``) +
        (b.times ? ` times={${j(b.times)}}` : ``) +
        ` />`
      );
    case "statpills":
      return (
        `<StatPills durationInFrames={d} pills={${j(b.pills || [])}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.slider === false ? ` slider={false}` : ``) +
        ` />`
      );
    case "floatprop":
      return (
        `<FloatingProp durationInFrames={d} src=${j(b.src)}` +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.caption ? ` caption=${j(b.caption)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.scale != null ? ` scale={${b.scale}}` : ``) +
        ` />`
      );
    case "diorama":
      return (
        `<PngDiorama durationInFrames={d} src=${j(b.src)}` +
        (b.text ? ` text=${j(b.text)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.tint ? ` tint=${j(b.tint)}` : ``) +
        ` />`
      );
    case "nextvideo":
      return (
        `<NextVideoEndcard durationInFrames={d} title=${j(b.title)}` +
        (b.kicker ? ` kicker=${j(b.kicker)}` : ``) +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        ` />`
      );
    // ── SET PIECES de imagen/clip (escenas completas) ──
    case "expeditionmap":
      return (
        `<ExpeditionMap durationInFrames={d} mapImage=${j(b.mapImage)}` +
        (b.route ? ` route={${j(b.route)}}` : ``) +
        (b.pins ? ` pins={${j(b.pins)}}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "scalecolossus":
      return (
        `<ScaleColossus durationInFrames={d} image=${j(b.image)} meters={${b.meters}}` +
        (b.unit ? ` unit=${j(b.unit)}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "evidenceboard":
      return (
        `<EvidenceBoard durationInFrames={d} items={${j(b.items || [])}}` +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "loupe":
      return (
        `<LoupeInspect durationInFrames={d} image=${j(b.image)} focusX={${b.focusX}} focusY={${b.focusY}}` +
        (b.zoom != null ? ` zoom={${b.zoom}}` : ``) +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "thennow":
      return (
        `<ThenNow durationInFrames={d} before={${j(b.before)}} after={${j(b.after)}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "ghost":
      return (
        `<GhostReconstruction durationInFrames={d} real=${j(b.real)} ghost=${j(b.ghost)}` +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    // ── FICHAS EXPLICATIVAS (clip de fondo blur+oscurece → contenido) ──
    case "focuscard":
      return (
        `<FocusCard durationInFrames={d} bg=${j(b.bg)} image=${j(b.image)} title=${j(b.title)} desc=${j(b.desc)}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.imageSide ? ` imageSide=${j(b.imageSide)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "termcard":
      return (
        `<TermCard durationInFrames={d} bg=${j(b.bg)} term=${j(b.term)} definition=${j(b.definition)}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "splitexplain":
      return (
        `<SplitExplain durationInFrames={d} bg=${j(b.bg)} image=${j(b.image)} title=${j(b.title)} points={${j(b.points || [])}}` +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    // ── CAPA DOCUMENTAL (overlays sobre los clips) ──
    case "doclabel":
      return (
        `<DocLabel durationInFrames={d} label=${j(b.label || "")}` +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.corner ? ` corner=${j(b.corner)}` : ``) +
        ` />`
      );
    case "placetag":
      return (
        `<PlaceTag durationInFrames={d} place=${j(b.place || "")}` +
        (b.sub ? ` sub=${j(b.sub)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "datestamp":
      return (
        `<DateStamp durationInFrames={d} value=${j(b.value)}` +
        (b.label ? ` label=${j(b.label)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        (b.corner ? ` corner=${j(b.corner)}` : ``) +
        ` />`
      );
    case "countrail":
      return (
        `<CountRail durationInFrames={d} rank={${b.rank}}` +
        (b.total != null ? ` total={${b.total}}` : ``) +
        ` name=${j(b.name || "")}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "originpips":
      return (
        `<OriginPips durationInFrames={d} items={${j(b.items || [])}}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "sourcechip":
      return (
        `<SourceChip durationInFrames={d} text=${j(b.text || "")}` +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    case "sonarhud":
      return (
        `<SonarHUD durationInFrames={d} depth=${j(b.depth || "")}` +
        (b.coords ? ` coords=${j(b.coords)}` : ``) +
        (b.accent ? ` accent=${j(b.accent)}` : ``) +
        ` />`
      );
    // ── OVERLAYS A MEDIDA óxido (OxCards): sobre el clip vivo + blur ──
    case "oxstat":
      return (`<OxStatPop durationInFrames={d} value={${b.value}} label=${j(b.label || "")}` + (b.prefix ? ` prefix=${j(b.prefix)}` : ``) + (b.suffix ? ` suffix=${j(b.suffix)}` : ``) + (b.glyph ? ` glyph=${j(b.glyph)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxmethod":
      return (`<OxMethodCard durationInFrames={d} num=${j(b.num || "")} title=${j(b.title || "")} chips={${j(b.chips || [])}}` + (b.cost ? ` cost=${j(b.cost)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxrule":
      return (`<OxRuleStrip durationInFrames={d} text=${j(b.text || "")}` + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxclamp":
      return (`<OxClampWarning durationInFrames={d}` + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxtag":
      return (`<OxMaterialTag durationInFrames={d} name=${j(b.name || "")} what=${j(b.what || "")}` + (b.price ? ` price=${j(b.price)}` : ``) + (b.side ? ` side=${j(b.side)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxbefore":
      return (`<OxBeforeAfter durationInFrames={d} before=${j(b.before)} after=${j(b.after)}` + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxside":
      return (`<OxSidePanel durationInFrames={d} image=${j(b.image)} title=${j(b.title || "")} lines={${j(b.lines || [])}}` + (b.side ? ` side=${j(b.side)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxstack":
      return (`<OxPhotoStack durationInFrames={d} images={${j(b.images || [])}} captions={${j(b.captions || [])}}` + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxspec":
      return (`<OxSpecSheet durationInFrames={d} image=${j(b.image)} title=${j(b.title || "")} rows={${j(b.rows || [])}}` + (b.kicker ? ` kicker=${j(b.kicker)}` : ``) + (b.side ? ` side=${j(b.side)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxnote":
      return (`<OxAnnotatedPhoto durationInFrames={d} image=${j(b.image)} notes={${j(b.notes || [])}}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "oxquote":
      return (`<OxQuoteSplit durationInFrames={d} quote=${j(b.quote || "")} image=${j(b.image)}` + (b.attribution ? ` attribution=${j(b.attribution)}` : ``) + (b.side ? ` side=${j(b.side)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "manualcard":
      return (`<ManualCard durationInFrames={d} image=${j(b.image || "real/manual_cover.png")}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.desc ? ` desc=${j(b.desc)}` : ``) + (b.chip ? ` chip=${j(b.chip)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    // ── OVERLAYS A MEDIDA "madera" (MaderaCards): sobre el clip vivo + blur ──
    case "mdgauge":
      return (`<MdMoistureGauge durationInFrames={d}` + (b.value != null ? ` value={${b.value}}` : ``) + (b.danger != null ? ` danger={${b.danger}}` : ``) + (b.label ? ` label=${j(b.label)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdlife":
      return (`<MdLifespanBar durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.low ? ` low={${j(b.low)}}` : ``) + (b.high ? ` high={${j(b.high)}}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdrecipe":
      return (`<MdRecipeCard durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.items ? ` items={${j(b.items)}}` : ``) + (b.note ? ` note=${j(b.note)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdpost":
      return (`<MdPostGroundLine durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdchar":
      return (`<MdCharReveal durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.chips ? ` chips={${j(b.chips)}}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdrecap":
      return (`<MdMethodRecap durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.methods ? ` methods={${j(b.methods)}}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdname":
      return (`<MdNameTag durationInFrames={d}` + (b.name ? ` name=${j(b.name)}` : ``) + (b.role ? ` role=${j(b.role)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdnext":
      return (`<MdNextCard durationInFrames={d}` + (b.kicker ? ` kicker=${j(b.kicker)}` : ``) + (b.title ? ` title=${j(b.title)}` : ``) + (b.image ? ` image=${j(b.image)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    // ── SET DE PULIDO cine "madera" (MaderaPolish): overlays HERMOSOS a medida ──
    case "mdtwoplanks":
      return (`<MdTwoPlanks durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.buried ? ` buried=${j(b.buried)}` : ``) + (b.note ? ` note=${j(b.note)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdsealtrap":
      return (`<MdSealTrap durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdrotinside":
      return (`<MdRotFromInside durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdrulestamp":
      return (`<MdRuleStamp durationInFrames={d}` + (b.text ? ` text=${j(b.text)}` : ``) + (b.num ? ` num=${j(b.num)}` : ``) + (b.label ? ` label=${j(b.label)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdfungus":
      return (`<MdFungusNeeds durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdslider":
      return (`<MdBeforeAfterSlider durationInFrames={d}` + (b.beforeImg ? ` beforeImg=${j(b.beforeImg)}` : ``) + (b.afterImg ? ` afterImg=${j(b.afterImg)}` : ``) + (b.beforeLabel ? ` beforeLabel=${j(b.beforeLabel)}` : ``) + (b.afterLabel ? ` afterLabel=${j(b.afterLabel)}` : ``) + (b.beforeYears ? ` beforeYears=${j(b.beforeYears)}` : ``) + (b.afterYears ? ` afterYears=${j(b.afterYears)}` : ``) + (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdkicker":
      return (`<MdChapterKicker durationInFrames={d}` + (b.num ? ` num=${j(b.num)}` : ``) + (b.title ? ` title=${j(b.title)}` : ``) + (b.kicker ? ` kicker=${j(b.kicker)}` : ``) + (b.glyph ? ` glyph=${j(b.glyph)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdendcard":
      return (`<MdEndcardManual durationInFrames={d}` + (b.manualImg ? ` manualImg=${j(b.manualImg)}` : ``) + (b.nextImg ? ` nextImg=${j(b.nextImg)}` : ``) + (b.manualTitle ? ` manualTitle=${j(b.manualTitle)}` : ``) + (b.nextKicker ? ` nextKicker=${j(b.nextKicker)}` : ``) + (b.nextTitle ? ` nextTitle=${j(b.nextTitle)}` : ``) + (b.motto ? ` motto=${j(b.motto)}` : ``) + (b.cta ? ` cta=${j(b.cta)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "mdtrans":
      return (`<MdTransition durationInFrames={d}` + (b.variant ? ` variant=${j(b.variant)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    // ── SET DE PULIDO cine "cemento" (CementoPolish): heroes propios del cemento/cal ──
    case "cmrecipe":
      return (`<CmRecipe durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.note ? ` note=${j(b.note)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "cmyears":
      return (`<CmYears durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.low ? ` low={${j(b.low)}}` : ``) + (b.high ? ` high={${j(b.high)}}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "cmselfheal":
      return (`<CmSelfHeal durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "cmcure":
      return (`<CmCure durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "cmerror":
      return (`<CmError durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "cmname":
      return (`<CmNameTag durationInFrames={d}` + (b.name ? ` name=${j(b.name)}` : ``) + (b.role ? ` role=${j(b.role)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    // ── SET DE PULIDO cine "salitre" (SalitrePolish): heroes propios de la humedad ascendente/salitre ──
    case "slcapillary":
      return (`<SlCapillary durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "slsalt":
      return (`<SlSalt durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "slseal":
      return (`<SlSeal durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "slbarrier":
      return (`<SlBarrier durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "sllime":
      return (`<SlLime durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "sltwowalls":
      return (`<SlTwoWalls durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.buried ? ` buried=${j(b.buried)}` : ``) + (b.note ? ` note=${j(b.note)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "slname":
      return (`<SlNameTag durationInFrames={d}` + (b.name ? ` name=${j(b.name)}` : ``) + (b.role ? ` role=${j(b.role)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    // ── SET DE PULIDO cine "acauto" (AcautoPolish): heroes propios del aire de auto/recarga ──
    case "acgauge":
      return (`<AcGauge durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "acports":
      return (`<AcPorts durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "acoverfill":
      return (`<AcOverfill durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "acsteps":
      return (`<AcSteps durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "accircuit":
      return (`<AcCircuit durationInFrames={d}` + (b.title ? ` title=${j(b.title)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    case "acname":
      return (`<AcNameTag durationInFrames={d}` + (b.name ? ` name=${j(b.name)}` : ``) + (b.role ? ` role=${j(b.role)}` : ``) + (b.accent ? ` accent=${j(b.accent)}` : ``) + ` />`);
    // ── SET DE PULIDO "ventilador" (VentiladorKit): 22 heroes del ventilador+botellas ──
    case "eyebrowkicker": case "frictioncard": case "secretsealcard": case "promisechecklist":
    case "fanfailproof": case "evaporationphysics": case "fanbottleassembly": case "wrongvsrightplacement":
    case "bottlesizegauge": case "saltphysicsdiagram": case "stepbystepbuild": case "driptraycallout":
    case "rotationcyclediagram": case "oldtimersstamp": case "mythbustercard": case "distancelimitwarning":
    case "threelegsdiagram": case "nightdaycycle": case "costvscard": case "recapnumberedlist":
    case "manualctacard": case "nextvideoteaser": {
      const VT_MAP = { eyebrowkicker: "EyebrowKicker", frictioncard: "FrictionCard", secretsealcard: "SecretSealCard", promisechecklist: "PromiseChecklist", fanfailproof: "FanFailProof", evaporationphysics: "EvaporationPhysics", fanbottleassembly: "FanBottleAssembly", wrongvsrightplacement: "WrongVsRightPlacement", bottlesizegauge: "BottleSizeGauge", saltphysicsdiagram: "SaltPhysicsDiagram", stepbystepbuild: "StepByStepBuild", driptraycallout: "DripTrayCallout", rotationcyclediagram: "RotationCycleDiagram", oldtimersstamp: "OldTimersStamp", mythbustercard: "MythBusterCard", distancelimitwarning: "DistanceLimitWarning", threelegsdiagram: "ThreeLegsDiagram", nightdaycycle: "NightDayCycle", costvscard: "CostVsCard", recapnumberedlist: "RecapNumberedList", manualctacard: "ManualCTACard", nextvideoteaser: "NextVideoTeaser" };
      const Comp = VT_MAP[b.kind];
      const rest = {}; for (const k of Object.keys(b)) if (!KIT_SYS.has(k)) rest[k] = b[k];
      delete rest.kind;
      return `<${Comp} {...({ durationInFrames: d, ...${j(rest)} } as any)} />`;
    }
    // ── BESPOKE "dulces" (canal Abuela Rosa) — cocina de la abuela, cálido ──
    case "fichadulce":
      return (
        `<FichaDulce durationInFrames={d} image=${j(b.image)} title=${j(b.title || "")}` +
        (b.notes ? ` notes={${j(b.notes)}}` : ``) +
        (b.bg ? ` bg=${j(b.bg)}` : ``) +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "antesahora":
      return (
        `<AntesAhora durationInFrames={d} beforeImage=${j(b.beforeImage)} afterImage=${j(b.afterImage)}` +
        (b.beforeLabel ? ` beforeLabel=${j(b.beforeLabel)}` : ``) +
        (b.afterLabel ? ` afterLabel=${j(b.afterLabel)}` : ``) +
        ` />`
      );
    case "citaabuela":
      return (
        `<CitaAbuela durationInFrames={d} text=${j(b.text || "")}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.words ? ` words={${j(b.words)}}` : ``) +
        (b.fontSize ? ` fontSize={${b.fontSize}}` : ``) +
        ` />`
      );
    case "ingredientesflotan":
      return (
        `<IngredientesFlotan durationInFrames={d} items={${j(b.items || [])}}` +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.atsec ? ` ats={${j(b.atsec)}}` : ``) +
        ` />`
      );
    case "topdulce":
      return (
        `<TopDulce durationInFrames={d} index={${b.index}} title=${j(b.title || "")}` +
        (b.total != null ? ` total={${b.total}}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.nameAt != null ? ` nameAt={${b.nameAt}}` : ``) +
        ` />`
      );
    case "numerodulce":
      return (
        `<NumeroDulce durationInFrames={d} number=${j(b.number)} name=${j(b.name || "")}` +
        (b.total ? ` total=${j(b.total)}` : ``) +
        (b.image ? ` image=${j(b.image)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    case "dishgrid":
      return (
        `<DishGrid durationInFrames={d} images={${j(b.images || [])}}` +
        (b.cols != null ? ` cols={${b.cols}}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.eyebrow ? ` eyebrow=${j(b.eyebrow)}` : ``) +
        ` />`
      );
    // ── KIT PREMIUM (src/VideoEdit/kit/premium/) — catálogo themeable genérico.
    // beat: { kind:"premium", comp:"VsDuel", theme:"earth", zone:"topLeft", overlay:true, ...props }
    // `comp` = nombre EXACTO exportado por kit/premium/index.ts (VsDuel, BigStatReveal,
    // NumberedSteps, ChecklistReveal, FlowSteps, MythTruth, CtaCard, etc). `zone` posiciona
    // el componente (full-bleed por diseño) dentro de una caja recortada en zona segura vía
    // PremiumOverlay (topLeft|left|top|full) para que el b-roll siga viéndose alrededor y
    // no tape el avatar PiP abajo-derecha. Todas las demás props pasan tal cual al componente.
    // ── componentes a medida del video "cultivos de septiembre" (full-screen) ──
    case "showcase":
      return `<CropShowcase durationInFrames={d} focus={${b.focus | 0}} number={${j(String(b.number ?? ""))}} name={${j(b.name || "")}} description={${j(b.description || "")}} tip={${j(b.tip || "")}} images={${j(b.images || [])}} months={${j(b.months || [])}}${b.assemble === false ? " assemble={false}" : ""}${b.accent ? ` accent={${j(b.accent)}}` : ""}${b.pastel ? ` pastel={${j(b.pastel)}}` : ""} />`;
    case "seasondial": return `<SeasonDial durationInFrames={d} />`;
    case "starchsugar": return `<StarchToSugar durationInFrames={d} />`;
    case "vernalize": return `<VernalizationClock durationInFrames={d} />`;
    case "soilfridge": return `<SoilFridge durationInFrames={d} />`;
    // ── componentes FIRMA del canal Agua Oxigenada (full-bleed, escena propia) ──
    // src/peroxide/PeroxideHero.tsx + PeroxideKit.tsx. Son escenas completas (rojo/negro/
    // blanco, THEME_PEROXIDE), NO overlays: durante ellas el avatar va HIDDEN. Todas las
    // props (eyebrow/phrase/number/title/…) pasan tal cual; texto en INGLÉS desde el build.
    case "glitch":
      // TRANSICIÓN GLITCH SUAVE (overlay ~0.4s) entre bloques/secciones + tras el 1er clip.
      return `<GlitchCut durationInFrames={d} />`;
    case "typebeside":
      // TARJETA QUE TIPEA AL LADO DEL AVATAR (avatar VISIBLE): tips/notas sin oscurecer todo.
      return (
        `<TypeCardBeside durationInFrames={d}` +
        (b.side ? ` side=${j(b.side)}` : ``) +
        (b.title ? ` title=${j(b.title)}` : ``) +
        (b.lines ? ` lines={${j(b.lines)}}` : ``) +
        ` />`
      );
    case "pxfan": case "pxchap": case "pxtoggle": case "pxhero": case "pxfoam": case "pxpour": {
      const PXC = { pxfan: "LightTrailCards", pxchap: "ChapterTrailCard", pxtoggle: "NodeRingToggle", pxhero: "BottleHero", pxfoam: "FoamClean", pxpour: "GluGluPour" };
      const rest = {}; for (const k of Object.keys(b)) if (!KIT_SYS.has(k) && k !== "comp" && k !== "zone" && k !== "theme") rest[k] = b[k];
      delete rest.kind;
      return `<${PXC[b.kind]} durationInFrames={d} {...(${j(rest)} as any)} />`;
    }
    case "premium": {
      const rest = {}; for (const k of Object.keys(b)) if (!KIT_SYS.has(k) && k !== "comp" && k !== "zone" && k !== "theme") rest[k] = b[k];
      const themeConst = `THEME_${(b.theme || "earth").toUpperCase()}`;
      const zoneAttr = b.zone ? ` zone=${j(b.zone)}` : "";
      return (
        `<PremiumOverlay durationInFrames={d}${zoneAttr} theme={${themeConst}}>` +
        `<${b.comp} durationInFrames={d} theme={${themeConst}} {...(${j(rest)} as any)} />` +
        `</PremiumOverlay>`
      );
    }
    default: {
      if (KIT[b.kind]) {
        const rest = {}; for (const k of Object.keys(b)) if (!KIT_SYS.has(k)) rest[k] = b[k];
        delete rest.kind;
        return `<${KIT[b.kind]} {...({ durationInFrames: d, ...${j(rest)} } as any)} />`;
      }
      return null; // talk
    }
  }
}

const cueLines = [];
const overlayLines = [];
const reframe = [];
for (const b of beats) {
  if (b.reframe && b.kind !== "talk") reframe.push({ start: b.start, end: b.start + b.dur });
  const el = renderEl(b);
  if (!el) continue;
  const line = `  { key: ${j(b.id)}, start: ${b.start}, dur: ${b.dur}, kind: ${j(b.kind)}, el: (d) => ${el} },`;
  (b.overlay ? overlayLines : cueLines).push(line);
}

// imports + consts de paleta CONDICIONALES: solo lo que los kinds presentes usan
// (así no quedan unused-vars / unused-imports → tsc con noUnusedLocals limpio).
const kinds = new Set(cueBeats.map((b) => b.kind));
const usedPal = new Set();
for (const b of beats) {
  if (b.kind === "splitlist") usedPal.add({ A: "A", G: "G", D: "D", B: "B" }[b.palette] || "A");
}
const palTok = { A: "COLORS.accent", G: "COLORS.good", D: "COLORS.danger", B: "COLORS.cold" };
const themeImports = [];
if (usedPal.size) themeImports.push("COLORS");
const imports = [`import { ReactNode } from "react";`];
if (themeImports.length) imports.push(`import { ${themeImports.join(", ")} } from "./theme";`);
if (kinds.has("raw")) imports.push(`import { RawShot } from "./scenes/RawShot";`);
for (const k of kinds) if (KIT[k]) imports.push(`import { ${KIT[k]} } from "./kit/${KIT[k]}";`);
if (kinds.has("quote")) imports.push(`import { KineticQuote, parseQuote } from "./scenes/KineticQuote";`);
if (kinds.has("breaking")) imports.push(`import { BreakingReveal } from "./scenes/BreakingReveal";`);
if (kinds.has("presenter")) imports.push(`import { PresenterTag } from "./scenes/PresenterTag";`);
if (kinds.has("ticker")) imports.push(`import { NewsTicker } from "./scenes/NewsTicker";`);
if (kinds.has("verified")) imports.push(`import { VerifiedStamp } from "./scenes/VerifiedStamp";`);
if (kinds.has("steptrack")) imports.push(`import { StepTracker } from "./scenes/StepTracker";`);
if (kinds.has("statslam")) imports.push(`import { StatSlam } from "./scenes/StatSlam";`);
if (kinds.has("alertwipe")) imports.push(`import { AlertWipe } from "./scenes/AlertWipe";`);
if (kinds.has("layered")) imports.push(`import { LayeredReveal } from "./scenes/LayeredReveal";`);
if (kinds.has("scrolldoc")) imports.push(`import { ScrollDoc } from "./scenes/ScrollDoc";`);
if (kinds.has("avpizarra")) imports.push(`import { AvatarPizarra } from "./scenes/AvatarPizarra";`);
if (kinds.has("chips")) imports.push(`import { ChipsCluster } from "./scenes/ReframeContent";`);
if (kinds.has("splitlist")) imports.push(`import { SplitList } from "./scenes/SplitList";`);
if (kinds.has("city3d") || kinds.has("globe3d") || kinds.has("number3d") || kinds.has("oner3d")) imports.push(`import { City3D, Globe3D, Number3D, Oner3D } from "./three/Scene3D";`);
if (kinds.has("struckcards")) imports.push(`import { StruckCards } from "./scenes/StruckCards";`);
if (kinds.has("radsky")) imports.push(`import { ColdRadiationSky } from "./scenes/ColdRadiationSky";`);
if (kinds.has("coldcal")) imports.push(`import { ColdCalendar } from "./scenes/ColdCalendar";`);
if (kinds.has("cutaway")) imports.push(`import { CutawayCallout } from "./scenes/CutawayCallout";`);
if (kinds.has("mapzoom")) imports.push(`import { VintageMapZoom } from "./scenes/VintageMapZoom";`);
if (kinds.has("lowerthird")) imports.push(`import { CinematicLowerThird } from "./scenes/CinematicLowerThird";`);
if (kinds.has("revealcards")) imports.push(`import { RevealCards } from "./scenes/RevealCards";`);
if (kinds.has("winterbank")) imports.push(`import { WinterBank } from "./scenes/WinterBank";`);
if (kinds.has("doorcold")) imports.push(`import { DoorColdFalls } from "./scenes/DoorColdFalls";`);
if (kinds.has("heatslow")) imports.push(`import { HeatSlowDiagram } from "./scenes/HeatSlowDiagram";`);
if (kinds.has("frostwipe")) imports.push(`import { FrostWipe } from "./scenes/FrostWipe";`);
if (kinds.has("rollnum")) imports.push(`import { Odometer } from "./scenes/Odometer";`);
if (kinds.has("splitba")) imports.push(`import { SplitBeforeAfter } from "./scenes/SplitBeforeAfter";`);
if (kinds.has("showcase")) imports.push(`import { CropShowcase } from "./scenes/CropShowcase";`);
if (kinds.has("seasondial")) imports.push(`import { SeasonDial } from "./scenes/CropMechanisms";`);
if (kinds.has("starchsugar")) imports.push(`import { StarchToSugar } from "./scenes/CropMechanisms";`);
if (kinds.has("vernalize")) imports.push(`import { VernalizationClock } from "./scenes/CropMechanisms";`);
if (kinds.has("soilfridge")) imports.push(`import { SoilFridge } from "./scenes/CropMechanisms";`);
if (kinds.has("saltplunge")) imports.push(`import { SaltPlunge } from "./scenes/SaltPlunge";`);
if (kinds.has("redacted")) imports.push(`import { RedactedReveal } from "./scenes/RedactedReveal";`);
if (kinds.has("impstamp")) imports.push(`import { ImpossibleStamp } from "./scenes/ImpossibleStamp";`);
if (kinds.has("blurexplainer")) imports.push(`import { BlurExplainer } from "./scenes/BlurExplainer";`);
if (kinds.has("ingredients")) imports.push(`import { IngredientEquation } from "./scenes/IngredientEquation";`);
if (kinds.has("diagram")) imports.push(`import { DiagramBoard } from "./scenes/DiagramBoard";`);
if (kinds.has("stat")) imports.push(`import { StatBig } from "./scenes/StatBig";`);
if (kinds.has("impact")) imports.push(`import { ImpactReveal } from "./scenes/ImpactReveal";`);
if (kinds.has("journey")) imports.push(`import { JourneyCanvas } from "./scenes/JourneyCanvas";`);
if (kinds.has("loctag")) imports.push(`import { LocationTag } from "./scenes/LocationTag";`);
if (kinds.has("stattag")) imports.push(`import { StatTag } from "./scenes/StatTag";`);
if (kinds.has("chapter")) imports.push(`import { ChapterTag } from "./scenes/ChapterTag";`);
if (kinds.has("nametag")) imports.push(`import { NameTag } from "./scenes/NameTag";`);
if (kinds.has("phrasetag")) imports.push(`import { PhraseTag } from "./scenes/PhraseTag";`);
if (kinds.has("timeline")) imports.push(`import { SagaTimeline } from "./scenes/SagaTimeline";`);
if (kinds.has("metertag")) imports.push(`import { MeterTag } from "./scenes/MeterTag";`);
if (kinds.has("foundertree")) imports.push(`import { FounderTree } from "./scenes/FounderTree";`);
if (kinds.has("float")) imports.push(`import { FloatingInsert } from "./scenes/FloatingInsert";`);
if (kinds.has("headline")) imports.push(`import { KineticHeadline } from "./scenes/KineticHeadline";`);
if (kinds.has("aged")) imports.push(`import { AgedDoc } from "./scenes/AgedDoc";`);
if (kinds.has("bars")) imports.push(`import { BarCompare } from "./scenes/BarCompare";`);
if (kinds.has("vs")) imports.push(`import { VsCard } from "./scenes/VsCard";`);
if (kinds.has("cross")) imports.push(`import { CrossSection } from "./scenes/CrossSection";`);
if (kinds.has("process")) imports.push(`import { ProcessSteps } from "./scenes/ProcessSteps";`);
if (kinds.has("checklist")) imports.push(`import { Checklist } from "./scenes/Checklist";`);
if (kinds.has("earthtube")) imports.push(`import { EarthTubeDiagram } from "./scenes/EarthTubeDiagram";`);
if (kinds.has("zeerpot")) imports.push(`import { ZeerPotDiagram } from "./scenes/ZeerPotDiagram";`);
if (kinds.has("massheater")) imports.push(`import { MassHeaterDiagram } from "./scenes/MassHeaterDiagram";`);
if (kinds.has("windmill")) imports.push(`import { WindmillDiagram } from "./scenes/WindmillDiagram";`);
if (kinds.has("curediagram")) imports.push(`import { CureDiagram } from "./scenes/CureDiagram";`);
if (kinds.has("rampump")) imports.push(`import { RamPumpCycle } from "./scenes/RamPumpCycle";`);
if (kinds.has("waterlens")) imports.push(`import { WaterLensLight } from "./scenes/WaterLensLight";`);
if (kinds.has("rule")) imports.push(`import { RuleNumberScene } from "./scenes/RuleNumberScene";`);
if (kinds.has("annotated")) imports.push(`import { AnnotatedImage } from "./scenes/AnnotatedImage";`);
if (kinds.has("callout")) imports.push(`import { CalloutMark } from "./scenes/CalloutMark";`);
if (kinds.has("infzoom")) imports.push(`import { InfiniteZoom } from "./scenes/InfiniteZoom";`);
if (kinds.has("teasecards")) imports.push(`import { FoodTeaseCards } from "./scenes/FoodTeaseCards";`);
if (kinds.has("top7")) imports.push(`import { Top7Ladder } from "./scenes/Top7Ladder";`);
if (kinds.has("half")) imports.push(`import { HalfShot } from "./scenes/HalfShot";`);
if (kinds.has("riskclock")) imports.push(`import { RiskClock } from "./scenes/RiskClock";`);
if (kinds.has("moat")) imports.push(`import { TickLineMoat } from "./scenes/TickLineMoat";`);
if (kinds.has("sizescale")) imports.push(`import { SizeScale } from "./scenes/SizeScale";`);
if (kinds.has("spreadmap")) imports.push(`import { SpreadMap } from "./scenes/SpreadMap";`);
if (kinds.has("costtally")) imports.push(`import { CostTally } from "./scenes/CostTally";`);
if (kinds.has("scent")) imports.push(`import { ScentConfuse } from "./scenes/ScentConfuse";`);
if (kinds.has("depthtext")) imports.push(`import { DepthText } from "./scenes/DepthText";`);
// ── kinds a medida del canal "Ben retirado" ──
if (kinds.has("estateletter")) imports.push(`import { EstateRecoveryLetter } from "./scenes/EstateRecoveryLetter";`);
if (kinds.has("twomoments")) imports.push(`import { TwoMomentsSplit } from "./scenes/TwoMomentsSplit";`);
if (kinds.has("mistake")) imports.push(`import { MistakeCard } from "./scenes/MistakeCard";`);
if (kinds.has("goldvault")) imports.push(`import { GoldVault } from "./scenes/GoldVault";`);
if (kinds.has("lookback")) imports.push(`import { LookbackTimeline } from "./scenes/LookbackTimeline";`);
if (kinds.has("tool")) imports.push(`import { ProtectionTool } from "./scenes/ProtectionTool";`);
if (kinds.has("deed")) imports.push(`import { DeedStamp } from "./scenes/DeedStamp";`);
if (kinds.has("odometer")) imports.push(`import { CostOdometer } from "./scenes/CostOdometer";`);
if (kinds.has("signature")) imports.push(`import { SignaturePhrase } from "./scenes/SignaturePhrase";`);
if (kinds.has("vsmed")) imports.push(`import { MedicareVsMedicaid } from "./scenes/MedicareVsMedicaid";`);
if (kinds.has("action")) imports.push(`import { ActionStepCard } from "./scenes/ActionStepCard";`);
if (kinds.has("nextvideo")) imports.push(`import { NextVideoEndcard } from "./scenes/NextVideoEndcard";`);
if (kinds.has("keyphrase")) imports.push(`import { KineticText } from "./scenes/KineticText";`);
if (kinds.has("spooncream")) imports.push(`import { SpoonInCream } from "./scenes/SpoonInCream";`);
if (kinds.has("statpills")) imports.push(`import { StatPills } from "./scenes/StatPills";`);
if (kinds.has("floatprop")) imports.push(`import { FloatingProp } from "./scenes/FloatingProp";`);
if (kinds.has("diorama")) imports.push(`import { PngDiorama } from "./scenes/PngDiorama";`);
if (kinds.has("regrow")) imports.push(`import { RegrowSplit } from "./scenes/RegrowSplit";`);
if (kinds.has("lielist")) imports.push(`import { LieList } from "./scenes/LieList";`);
if (kinds.has("numcard")) imports.push(`import { NumberCard } from "./scenes/NumberCard";`);
if (kinds.has("gridreveal")) imports.push(`import { GridReveal } from "./scenes/GridReveal";`);
if (kinds.has("growthtimeline")) imports.push(`import { GrowthTimeline } from "./scenes/GrowthTimeline";`);
if (kinds.has("kineticline")) imports.push(`import { KineticLine } from "./scenes/KineticLine";`);
if (kinds.has("blurreveal")) imports.push(`import { BlurReveal } from "./scenes/BlurReveal";`);
if (kinds.has("hugel")) imports.push(`import { HugelDiagram } from "./scenes/HugelDiagram";`);
if (kinds.has("olla")) imports.push(`import { OllaDiagram } from "./scenes/OllaDiagram";`);
if (kinds.has("perox")) imports.push(`import { PeroxidoDiagram } from "./scenes/PeroxidoDiagram";`);
if (kinds.has("floatcards")) imports.push(`import { FloatCards } from "./scenes/FloatCards";`);
// ── set pieces de imagen/clip ──
if (kinds.has("expeditionmap")) imports.push(`import { ExpeditionMap } from "./setpieces/ExpeditionMap";`);
if (kinds.has("scalecolossus")) imports.push(`import { ScaleColossus } from "./setpieces/ScaleColossus";`);
if (kinds.has("evidenceboard")) imports.push(`import { EvidenceBoard } from "./setpieces/EvidenceBoard";`);
if (kinds.has("loupe")) imports.push(`import { LoupeInspect } from "./setpieces/LoupeInspect";`);
if (kinds.has("thennow")) imports.push(`import { ThenNow } from "./setpieces/ThenNow";`);
if (kinds.has("ghost")) imports.push(`import { GhostReconstruction } from "./setpieces/GhostReconstruction";`);
if (kinds.has("focuscard")) imports.push(`import { FocusCard } from "./setpieces/FocusCard";`);
if (kinds.has("termcard")) imports.push(`import { TermCard } from "./setpieces/TermCard";`);
if (kinds.has("splitexplain")) imports.push(`import { SplitExplain } from "./setpieces/SplitExplain";`);
// ── capa documental (overlays) ──
if (kinds.has("doclabel")) imports.push(`import { DocLabel } from "./overlays/DocLabel";`);
if (kinds.has("placetag")) imports.push(`import { PlaceTag } from "./overlays/PlaceTag";`);
if (kinds.has("datestamp")) imports.push(`import { DateStamp } from "./overlays/DateStamp";`);
if (kinds.has("countrail")) imports.push(`import { CountRail } from "./overlays/CountRail";`);
if (kinds.has("originpips")) imports.push(`import { OriginPips } from "./overlays/OriginPips";`);
if (kinds.has("sourcechip")) imports.push(`import { SourceChip } from "./overlays/SourceChip";`);
if (kinds.has("sonarhud")) imports.push(`import { SonarHUD } from "./overlays/SonarHUD";`);
{ const oxMap = { oxstat: "OxStatPop", oxmethod: "OxMethodCard", oxrule: "OxRuleStrip", oxclamp: "OxClampWarning", oxtag: "OxMaterialTag", oxbefore: "OxBeforeAfter", oxside: "OxSidePanel", oxstack: "OxPhotoStack", oxspec: "OxSpecSheet", oxnote: "OxAnnotatedPhoto", oxquote: "OxQuoteSplit" };
  const oxUsed = Object.entries(oxMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (oxUsed.length) imports.push(`import { ${oxUsed.join(", ")} } from "./overlays/OxCards";`); }
if (kinds.has("manualcard")) imports.push(`import { ManualCard } from "./overlays/ManualCard";`);
{ const mdMap = { mdgauge: "MdMoistureGauge", mdlife: "MdLifespanBar", mdrecipe: "MdRecipeCard", mdpost: "MdPostGroundLine", mdchar: "MdCharReveal", mdrecap: "MdMethodRecap", mdname: "MdNameTag", mdnext: "MdNextCard" };
  const mdUsed = Object.entries(mdMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (mdUsed.length) imports.push(`import { ${mdUsed.join(", ")} } from "./overlays/MaderaCards";`); }
{ const mpMap = { mdtwoplanks: "MdTwoPlanks", mdsealtrap: "MdSealTrap", mdrotinside: "MdRotFromInside", mdrulestamp: "MdRuleStamp", mdfungus: "MdFungusNeeds", mdslider: "MdBeforeAfterSlider", mdkicker: "MdChapterKicker", mdendcard: "MdEndcardManual", mdtrans: "MdTransition" };
  const mpUsed = Object.entries(mpMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (mpUsed.length) imports.push(`import { ${mpUsed.join(", ")} } from "./overlays/MaderaPolish";`); }
{ const cmMap = { cmrecipe: "CmRecipe", cmyears: "CmYears", cmselfheal: "CmSelfHeal", cmcure: "CmCure", cmerror: "CmError", cmname: "CmNameTag" };
  const cmUsed = Object.entries(cmMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (cmUsed.length) imports.push(`import { ${cmUsed.join(", ")} } from "./overlays/CementoPolish";`); }
{ const slMap = { slcapillary: "SlCapillary", slsalt: "SlSalt", slseal: "SlSeal", slbarrier: "SlBarrier", sllime: "SlLime", sltwowalls: "SlTwoWalls", slname: "SlNameTag" };
  const slUsed = Object.entries(slMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (slUsed.length) imports.push(`import { ${slUsed.join(", ")} } from "./overlays/SalitrePolish";`); }
{ const acMap = { acgauge: "AcGauge", acports: "AcPorts", acoverfill: "AcOverfill", acsteps: "AcSteps", accircuit: "AcCircuit", acname: "AcNameTag" };
  const acUsed = Object.entries(acMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (acUsed.length) imports.push(`import { ${acUsed.join(", ")} } from "./overlays/AcautoPolish";`); }
{ const vtMap = { eyebrowkicker: "EyebrowKicker", frictioncard: "FrictionCard", secretsealcard: "SecretSealCard", promisechecklist: "PromiseChecklist", fanfailproof: "FanFailProof", evaporationphysics: "EvaporationPhysics", fanbottleassembly: "FanBottleAssembly", wrongvsrightplacement: "WrongVsRightPlacement", bottlesizegauge: "BottleSizeGauge", saltphysicsdiagram: "SaltPhysicsDiagram", stepbystepbuild: "StepByStepBuild", driptraycallout: "DripTrayCallout", rotationcyclediagram: "RotationCycleDiagram", oldtimersstamp: "OldTimersStamp", mythbustercard: "MythBusterCard", distancelimitwarning: "DistanceLimitWarning", threelegsdiagram: "ThreeLegsDiagram", nightdaycycle: "NightDayCycle", costvscard: "CostVsCard", recapnumberedlist: "RecapNumberedList", manualctacard: "ManualCTACard", nextvideoteaser: "NextVideoTeaser" };
  const vtUsed = Object.entries(vtMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (vtUsed.length) imports.push(`import { ${vtUsed.join(", ")} } from "./overlays/VentiladorKit";`); }
{ const duMap = { fichadulce: "FichaDulce", antesahora: "AntesAhora", citaabuela: "CitaAbuela", ingredientesflotan: "IngredientesFlotan", topdulce: "TopDulce", numerodulce: "NumeroDulce" };
  const duUsed = Object.entries(duMap).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (duUsed.length) imports.push(`import { ${duUsed.join(", ")} } from "./components/DulcesCards";`); }
if (kinds.has("dishgrid")) imports.push(`import { DishGrid } from "./components/DishGrid";`);
// ── COMPONENTES FIRMA "Agua Oxigenada" (src/peroxide/) — full-bleed, escena propia ──
{
  const PX_HERO = { pxfan: "LightTrailCards", pxchap: "ChapterTrailCard", pxtoggle: "NodeRingToggle", pxhero: "BottleHero", glitch: "GlitchCut", typebeside: "TypeCardBeside" };
  const PX_KIT = { pxfoam: "FoamClean", pxpour: "GluGluPour" };
  const heroUsed = Object.entries(PX_HERO).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  const kitUsed = Object.entries(PX_KIT).filter(([k]) => kinds.has(k)).map(([, v]) => v);
  if (heroUsed.length) imports.push(`import { ${heroUsed.join(", ")} } from "../peroxide/PeroxideHero";`);
  if (kitUsed.length) imports.push(`import { ${kitUsed.join(", ")} } from "../peroxide/PeroxideKit";`);
}
// ── KIT PREMIUM (themeable) — componentes usados vía kind:"premium" + comp:"X" ──
if (kinds.has("premium")) {
  imports.push(`import { PremiumOverlay } from "./scenes/PremiumOverlay";`);
  const premiumBeats = beats.filter((b) => b.kind === "premium");
  const compsUsed = [...new Set(premiumBeats.map((b) => b.comp).filter(Boolean))];
  const themesUsed = [...new Set(premiumBeats.map((b) => `THEME_${(b.theme || "earth").toUpperCase()}`))];
  if (compsUsed.length) imports.push(`import { ${[...compsUsed, ...themesUsed].join(", ")} } from "./kit/premium";`);
  else if (themesUsed.length) imports.push(`import { ${themesUsed.join(", ")} } from "./kit/premium";`);
}
const palLine = usedPal.size
  ? `\nconst ${[...usedPal].map((t) => `${t} = ${palTok[t]}`).join(", ")};\n`
  : "";

// ── AUDIO: cama de música con ducking (Whisper) + riel de SFX ────────────────
// bs.music = { "src": "music/bed_x.mp3", "base"?: 0.13, "duck"?: 0.05 }
// La actividad de voz sale de public/captions_<slug>.json (o bs.captions): palabras
// con ms exactos → intervalos de habla mergeados (gap ≤ 350ms) → AudioBed duckea ahí.
let audioBedLit = "null";
if (bs.music?.src) {
  // Los timestamps de palabra de Whisper NO tienen pausas (estira los bordes) → la
  // actividad de voz se mide del AUDIO REAL del avatar con silencedetect (ffmpeg
  // completo). Silencios ≥0.35s a -32dB = respiraciones/pausas donde la música asoma.
  let spans = [];
  const avatarPath = path.join("public", bs.musicVoice || AVATAR);
  const winget = path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WinGet", "Links", "ffmpeg.exe");
  const FFULL = process.env.FFMPEG || (fs.existsSync(winget) ? winget : "ffmpeg");
  if (fs.existsSync(avatarPath)) {
    const { spawnSync } = await import("child_process");
    const r = spawnSync(FFULL, ["-hide_banner", "-i", avatarPath, "-af", "silencedetect=noise=-32dB:d=0.35", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 24, timeout: 300000 });
    const txt = (r.stderr || "") + (r.stdout || "");
    const sil = [];
    const reS = /silence_start: ([\d.]+)/g, reE = /silence_end: ([\d.]+)/g;
    let m; const starts = [], ends = [];
    while ((m = reS.exec(txt))) starts.push(+m[1]);
    while ((m = reE.exec(txt))) ends.push(+m[1]);
    for (let i = 0; i < starts.length; i++) sil.push([starts[i], ends[i] ?? Infinity]);
    const durM = txt.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
    const aDur = durM ? +durM[1] * 3600 + +durM[2] * 60 + +durM[3] : 0;
    // complemento: voz = todo lo que no es silencio
    let t = 0;
    for (const [a, b] of sil) { if (a - t > 0.1) spans.push([+t.toFixed(2), +a.toFixed(2)]); t = Math.min(b, aDur || b); }
    if (aDur && aDur - t > 0.1) spans.push([+t.toFixed(2), +aDur.toFixed(2)]);
    if (!spans.length) warnings.push(`music: silencedetect no devolvió nada sobre ${avatarPath} → ducking constante`);
  } else {
    warnings.push(`music: no encontré ${avatarPath} → AudioBed sin ducking (base fijo)`);
  }
  const totalSec = bs.total || (beats.length ? Math.max(...beats.map((b) => (b.start || 0) + (b.dur || 0))) : 60);
  audioBedLit = j({ src: bs.music.src, activity: spans, base: bs.music.base ?? 0.13, duck: bs.music.duck ?? 0.05, totalSec: +(+totalSec).toFixed(2), loop: bs.music.loop !== false });
}
// SFX automáticos (desactivar con "sfx": false): pop suave cuando entra un componente
// gráfico, transición suave en los cambios de sección (beats con trans). Cap 1/2s.
const sfxCues = [];
if (bs.sfx !== false) {
  const OVERLAY_ROLE = { raw: null, talk: null };
  let lastAt = -99;
  for (const b of [...beats].sort((a, c) => (a.start || 0) - (c.start || 0))) {
    if (b.sfx === false) continue;
    let role = typeof b.sfx === "string" ? b.sfx : null;
    if (!role) {
      if (b.kind === "raw" && b.trans) role = "transition";
      else if (b.kind !== "raw" && b.kind !== "talk" && OVERLAY_ROLE[b.kind] !== null) role = "popUp";
    }
    if (!role) continue;
    if (b.start - lastAt < 2) continue;
    lastAt = b.start;
    sfxCues.push({ at: +(+b.start).toFixed(2), role, vol: role === "transition" ? 0.3 : 0.32 });
  }
}

const header = `// cues_${VIDEO}.gen.tsx — GENERADO por beatsheet.mjs desde ${path.basename(bsArg)}.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs ${bsArg}
${imports.join("\n")}
${palLine}
export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cueLines.join("\n")}
];

export const REFRAME: { start: number; end: number }[] = ${j(reframe)};

export const OVERLAYS: Cue[] = [
${overlayLines.join("\n")}
];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = ${audioBedLit};

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = ${j(sfxCues)};
`;

const outTsx = path.join("src", "VideoEdit", `cues_${VIDEO}.gen.tsx`);
fs.writeFileSync(outTsx, header);

const imgList = [...images.values()];
const clipList = [...clips.values()];
const promptsPath = path.join("public", "img", `prompts_${VIDEO}.json`);
const clipsPath = path.join("public", "vid", `clips_${VIDEO}.json`);
fs.writeFileSync(promptsPath, JSON.stringify(imgList, null, 2));
fs.writeFileSync(clipsPath, JSON.stringify(clipList, null, 2));

if (_probeDirty) { try { fs.mkdirSync(path.dirname(PROBE_CACHE), { recursive: true }); fs.writeFileSync(PROBE_CACHE, JSON.stringify(_probeCache, null, 1)); } catch {} }

// ── resumen ──────────────────────────────────────────────────────────────────
console.log(`=== beatsheet ${VIDEO} ===`);
if (bs.music?.src) console.log(`música: ${bs.music.src} (ducking silencedetect del avatar) · sfx auto: ${sfxCues.length}`);
console.log(`beats: ${beats.length}  ·  cues: ${cueLines.length}  ·  reframe: ${reframe.length}`);
console.log(`imágenes a generar: ${imgList.length}  ·  clips: ${clipList.length}`);
console.log(`→ ${outTsx}`);
console.log(`→ ${promptsPath}`);
console.log(`→ ${clipsPath}`);
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} avisos:`);
  for (const w of warnings) console.log(`  · ${w}`);
} else {
  console.log(`sin avisos (timing sin solapes, assets consistentes).`);
}
