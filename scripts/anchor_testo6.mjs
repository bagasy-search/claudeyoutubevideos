// Ancla el plan (_v3/testo6_plan.json) a las captions Whisper (public/captions_testo6.json),
// resuelve assets y emite src/VideoEdit/timeline_testo6.json + _v3/testo6_assets.json.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from "node:fs";
import {execSync} from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "testo6";
const FPS = 30;
const AVATAR_MP4 = process.argv[2] || `${SLUG}_opt.mp4`;          // relativo a public/
const CAPS = process.argv[3] || path.join("public", `captions_${SLUG}.json`);
const PLAN = process.argv[4] || path.join("_v3", `${SLUG}_plan.json`);
const MIN_DUR = 24;                                               // 0.8s piso por escena

const norm = (v) => (String(v || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().match(/[a-z0-9]+/g) || []);

const plan = JSON.parse(readFileSync(PLAN, "utf8").replace(/^﻿/, ""));
const caps = JSON.parse(readFileSync(CAPS, "utf8").replace(/^﻿/, ""));
const capW = caps.map((c) => ({w: norm(c.text)[0] || "", ms: c.startMs ?? c.start ?? 0, end: c.endMs ?? c.end ?? 0}))
  .filter((c) => c.w);

// duracion total (frames) del avatar
let audioFrames;
try {
  const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "public/${AVATAR_MP4}"`, {encoding: "utf8"}).trim());
  audioFrames = Math.round(dur * FPS);
} catch {
  audioFrames = Math.ceil((capW.at(-1).end / 1000) * FPS) + 30;
}
console.error(`audioFrames=${audioFrames} (${(audioFrames / FPS).toFixed(1)}s), captions=${capW.length} palabras`);

const moments = plan.sections.flatMap((s) => s.moments.map((m) => ({...m, section_title: s.title})));

// ── Anclaje robusto: narration_match es un substring LITERAL del guion (garantia del plan).
//    1) localizamos su indice EXACTO en el stream de tokens del guion (monotono).
//    2) ese indice -> prior en el stream de captions (misma secuencia de palabras).
//    3) refinamiento LOCAL alrededor del prior por mayor solape (corrige ritmo no uniforme).
const narrTokens = norm(readFileSync(path.join("public", "guiones", `${SLUG}.txt`), "utf8"));
let narrCursor = 0;
const findNarr = (mt) => {
  for (let i = narrCursor; i + mt.length <= narrTokens.length; i++) {
    let ok = true;
    for (let j = 0; j < mt.length; j++) if (narrTokens[i + j] !== mt[j]) { ok = false; break; }
    if (ok) { narrCursor = i + 1; return i; }
  }
  return narrCursor;
};
const WIN = 90;
const anchorFrame = (tokens) => {
  const ni = findNarr(tokens);
  const prior = Math.round((ni / Math.max(1, narrTokens.length)) * capW.length);
  const target = new Set(tokens);
  const N = tokens.length;
  const lo = Math.max(0, prior - WIN), hi = Math.min(capW.length - 1, prior + WIN);
  let best = null;
  for (let i = lo; i <= hi; i++) {
    let hit = 0;
    for (let j = i; j < Math.min(i + N, capW.length); j++) if (target.has(capW[j].w)) hit++;
    if (!best || hit > best.hit || (hit === best.hit && Math.abs(i - prior) < Math.abs(best.i - prior))) best = {i, hit};
  }
  if (!best) best = {i: Math.min(prior, capW.length - 1), hit: 0};
  return {frame: Math.round((capW[best.i].ms / 1000) * FPS), hit: best.hit, n: N};
};

const KEYMAP = {FedChapter: "chapter", FedStat: "stat", FedQuote: "quote", FedMolecule: "mechanism", FedStep: "step", FedChecklist: "checklist", FedLowerThird: "lower", FedCta: "cta", FedHero: "hero"};

const stockManifest = [];   // {file, query}
const presManifest = [];    // {file, action, location, framing, props}
let stockN = 0, presN = 0;
let weakAnchors = 0;

const scenes = [];
for (const m of moments) {
  const tokens = norm(m.narration_match);
  const {frame, hit, n} = anchorFrame(tokens);
  if (hit < Math.ceil(n * 0.4)) weakAnchors++;
  let layer;
  if (m.type === "avatar") {
    layer = {type: "avatar", src: AVATAR_MP4};
  } else if (m.type === "clean_stock") {
    stockN++;
    const file = `broll/${SLUG}_stock_${String(stockN).padStart(3, "0")}.mp4`;
    stockManifest.push({file, query: m.asset_query});
    layer = {type: "video", src: file, asset_id: `${SLUG}:${m.id}:clean_stock`, transition_variant: m.transition};
  } else if (m.type === "presenter_action") {
    presN++;
    const file = `img/${SLUG}_presenter_${String(presN).padStart(3, "0")}.png`;
    const a = m.presenter_action || {};
    presManifest.push({file, action: m.action || a.action, location: m.location || a.location, framing: m.framing || a.framing, props: a.props || []});
    layer = {type: "image", src: file, asset_id: `${SLUG}:${m.id}:presenter`, transition_variant: m.transition};
  } else { // hero_component
    const key = KEYMAP[m.component_family] || "hero";
    layer = {
      type: "component", render_component: key, family: key, transition_variant: m.transition,
      kicker: "", title: m.on_screen_copy, sub: m.editorial_sub,
      ...(m.items ? {items: m.items} : {}),
      ...(m.nodes ? {nodes: m.nodes} : {}),
      ...(m.value ? {value: m.value} : {}),
      ...(m.suffix ? {suffix: m.suffix} : {}),
      ...(m.step ? {step: m.step, total: m.total} : {}),
      ...(m.attributed ? {attributed: true, author: m.author, role: m.role} : {}),
    };
    if (key === "lower") { layer.author = m.author || "Dr. Federer"; layer.role = m.editorial_sub; }
  }
  scenes.push({
    id: m.id, section_id: m.section_id, from: frame, duration: 0,
    narration: m.narration_match, transition: m.transition,
    visual_type: m.visual_type, overlay_policy: m.overlay_policy, layers: [layer],
  });
}

// Imagen on-topic para cada componente: el presentador de SU seccion (evita el default skincare de FED_ASSETS).
const presBySection = {};
for (const sc of scenes) if (sc.layers[0].type === "image") (presBySection[sc.section_id] ||= []).push(sc.layers[0].src);
const allPres = scenes.filter((s) => s.layers[0].type === "image").map((s) => s.layers[0].src);
const compCursor = {};
for (const sc of scenes) {
  if (sc.layers[0].type !== "component") continue;
  const pool = (presBySection[sc.section_id] && presBySection[sc.section_id].length) ? presBySection[sc.section_id] : allPres;
  if (pool.length) { const k = compCursor[sc.section_id] || 0; compCursor[sc.section_id] = k + 1; sc.layers[0].image = pool[k % pool.length]; }
}

// Monotonia + duraciones (from = max(anterior+MIN, propio); duration = siguiente - from)
scenes.sort((a, b) => a.from - b.from);
for (let i = 1; i < scenes.length; i++) if (scenes[i].from < scenes[i - 1].from + MIN_DUR) scenes[i].from = scenes[i - 1].from + MIN_DUR;
for (let i = 0; i < scenes.length; i++) {
  const next = i + 1 < scenes.length ? scenes[i + 1].from : audioFrames;
  scenes[i].duration = Math.max(MIN_DUR, next - scenes[i].from);
}
// primera escena arranca en 0
if (scenes.length) { scenes[0].duration += scenes[0].from; scenes[0].from = 0; }
const lastEnd = scenes.at(-1).from + scenes.at(-1).duration;
if (lastEnd < audioFrames) scenes.at(-1).duration += audioFrames - lastEnd;

// Split anti plano-muerto: escena > MAXSCENE se parte en chunks; los extras son avatar_full (sin asset nuevo).
const MAXSCENE = 13 * FPS;
const split = [];
for (const sc of scenes) {
  if (sc.duration <= MAXSCENE) { split.push(sc); continue; }
  const nParts = Math.ceil(sc.duration / (9 * FPS));
  const base = Math.floor(sc.duration / nParts);
  for (let k = 0; k < nParts; k++) {
    const from = sc.from + k * base;
    const dur = k === nParts - 1 ? sc.duration - base * (nParts - 1) : base;
    if (k === 0) split.push({...sc, duration: dur});
    else split.push({id: `${sc.id}-x${k}`, section_id: sc.section_id, from, duration: dur, narration: sc.narration, transition: "none", visual_type: "avatar_full", overlay_policy: "none", layers: [{type: "avatar", src: AVATAR_MP4}]});
  }
}
scenes.length = 0; scenes.push(...split);

const duration_in_frames = scenes.at(-1).from + scenes.at(-1).duration;

const timeline = {
  version: 3, slug: SLUG, kit: "federer-fluid", premium_director_enabled: true,
  composition_id: `Bagasy-${SLUG}`, fps: FPS, width: 1920, height: 1080,
  duration_in_frames, audio_src: AVATAR_MP4, captions_src: `captions_${SLUG}.json`,
  scenes,
  metrics: {scenes: scenes.length, weak_anchors: weakAnchors, stock: stockManifest.length, presenter: presManifest.length,
    components: scenes.filter((s) => s.layers[0].type === "component").length,
    avatar: scenes.filter((s) => s.layers[0].type === "avatar").length},
};

mkdirSync(path.join(ROOT, "src", "VideoEdit"), {recursive: true});
writeFileSync(path.join(ROOT, "src", "VideoEdit", `timeline_${SLUG}.json`), JSON.stringify(timeline, null, 1), "utf8");
mkdirSync(path.join(ROOT, "_v3"), {recursive: true});
writeFileSync(path.join(ROOT, "_v3", `${SLUG}_assets.json`), JSON.stringify({stock: stockManifest, presenter: presManifest}, null, 1), "utf8");

// duraciones para chequeo de pacing
const durs = scenes.map((s) => s.duration / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(p * (durs.length - 1))];
console.log(JSON.stringify({
  scenes: scenes.length, duration_s: +(duration_in_frames / FPS).toFixed(1),
  weak_anchors: weakAnchors, stock: stockManifest.length, presenter: presManifest.length,
  components: timeline.metrics.components, avatar: timeline.metrics.avatar,
  pacing: {median_s: +q(0.5).toFixed(2), p75_s: +q(0.75).toFixed(2), p90_s: +q(0.9).toFixed(2), ge5s_ratio: +(durs.filter((d) => d >= 5).length / durs.length).toFixed(2), max_s: +durs.at(-1).toFixed(1)},
}, null, 1));
