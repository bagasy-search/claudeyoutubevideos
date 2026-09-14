// build_mdheater.mjs — "Your Water Heater Isn't Dying — It's Full of This ($1,800 Saved)"
// Canal Mike Dalton (EN). AVATAR POR VENTANAS (AvatarForever): el avatar NO es piso continuo;
// son clips (MdhAvatar) por corte, y el b-roll cubre el 100% del resto.
//   node build_mdheater.mjs
// Lee _v3/mdheater_plan.json (DIRECTOR), _v3/mdheater_luma.json, _v3/mdheater_avatar_clips.json.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "mdheater", COMP = "MdHeater", FPS = 30;
const NL = String.fromCharCode(10);
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";

const PLAN = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
const LUMA = JSON.parse(fs.readFileSync(`_v3/${SLUG}_luma.json`, "utf8"));
const AVCLIPS = fs.existsSync(`_v3/${SLUG}_avatar_clips.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_avatar_clips.json`, "utf8")) : [];
const MOM = PLAN.momentos, TOTAL_S = PLAN.dur;
const LUMA_MIN_BED = 105;

const rnd = (s) => { let h = Math.imul(Math.round(s) ^ 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
const nm = (i) => `${SLUG}_${String(i).padStart(3, "0")}`;
const jprops = (p) => JSON.stringify({ ...(p || {}), sfx: false });   // ⛔ sfx off: el Sfx no maneja faltantes (404 mata chunk)
const F = (s) => Math.round(s * FPS);

const framesCache = {};
const clipFrames = (src) => {
  if (framesCache[src] !== undefined) return framesCache[src];
  try {
    const o = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-count_packets",
      "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", `public/${src}`], { encoding: "utf8" });
    framesCache[src] = parseInt(String(o).match(/\d+/)?.[0] || "0", 10);
  } catch { framesCache[src] = 0; }
  return framesCache[src] > 1 ? framesCache[src] : 0;
};

// ── TIEMPO DE LECTURA ──
const OV_SET = new Set(["HookCaption", "PullQuote", "HighlightSweep"]);
const contarPalabras = (v) => typeof v === "string" ? v.trim().split(/\s+/).filter(Boolean).length
  : typeof v === "number" ? 1 : Array.isArray(v) ? v.reduce((a, x) => a + contarPalabras(x), 0)
  : v && typeof v === "object" ? Object.values(v).reduce((a, x) => a + contarPalabras(x), 0) : 0;
const pisoLectura = (c, props) => {
  const w = contarPalabras(props);
  const base = OV_SET.has(c) ? 2.0 : 2.8;
  const techo = c === "ChapterTrailCard" ? 9.5 : 13;
  return Math.min(techo, base + 0.28 * Math.max(0, w - 3));
};

// ── AVATAR: spans cubiertos por los clips del talking-head ──
// avclips: [{start, src, frames}] (frames REALES conformados a 30fps). Si falta el archivo, usa la
// duracion nominal de la ventana (para poder correr el build antes del ingest, con aviso).
const AVWIN = JSON.parse(fs.readFileSync(`_v3/${SLUG}_avatar_windows.json`, "utf8"));
const avatarCues = [];
const avatarSpans = [];  // [f0,f1]
if (AVCLIPS.length) {
  for (const a of AVCLIPS) {
    const f0 = F(a.start);
    const fr = a.frames || clipFrames(a.src);
    let d = Math.max(F(1.0), fr || F(2));
    if (a.start === 0) d = Math.max(d, F(3));   // apertura: piso 3s (regla 1.bis; el ultimo frame se sostiene ~0,1s)
    avatarCues.push({ key: `av_${f0}`, f0, d, el: `(d) => <MdhAvatar durationInFrames={d} src=${JSON.stringify(a.src)} seed={${f0}} />`, avatar: true });
    avatarSpans.push([f0, f0 + d]);
  }
} else {
  // sin ingest todavia: usa las ventanas nominales para calcular cobertura (los cues se rellenan al reingestar)
  for (const [s, e] of AVWIN) avatarSpans.push([F(s), F(e)]);
}
avatarSpans.sort((a, b) => a[0] - b[0]);
const inAvatar = (f) => avatarSpans.some(([a, b]) => f >= a && f < b);

// ── 1. PLANOS (solo momentos NO-avatar) ──
const FRAC = 0.35;
const planos = [];
for (const m of MOM) {
  if (m.tipo === "avatar") continue;
  let n = 1;
  if (m.dur > 12.5) n = 3; else if (m.dur > 9) n = 2;
  else if (m.dur > 5.8 && rnd(m.i * 2654435761) < FRAC) n = 2;
  if (m.tipo === "componente") n = 1;
  for (let k = 0; k < n; k++) planos.push({ m, k, n, t_in: m.start + (m.dur * k) / n, dur: m.dur / n });
}

// ── 2. ALINEACION DE FRAMES ──
for (let i = 0; i < planos.length; i++) {
  const f0 = F(planos[i].t_in);
  let durPlano = planos[i].dur;
  const cm = planos[i].m.tipo === "componente" ? planos[i].m : null;
  if (cm) {
    durPlano = Math.max(durPlano, pisoLectura(cm.comp, cm.props));
    durPlano = Math.min(durPlano, cm.comp === "ChapterTrailCard" ? 9.5 : 13);
  }
  let f1 = F(planos[i].t_in + durPlano);
  const sig = planos[i + 1];
  if (cm) {
    const sigComp = planos.slice(i + 1).find((q) => q.m.tipo === "componente" && !OV_SET.has(q.m.comp));
    if (sigComp) f1 = Math.min(f1, F(sigComp.t_in));
    f1 = Math.min(f1, F(TOTAL_S));
  } else if (sig && Math.abs(F(sig.t_in) - f1) <= 1) f1 = F(sig.t_in);
  if (!sig) f1 = F(TOTAL_S);
  planos[i].f0 = f0;
  planos[i].f1 = Math.max(f0 + 1, f1);
}

// ── 3. CUES b-roll ──
const cues = [], overlays = [], faltan = [], assets = new Set();
const OVERLAY = new Set(["HookCaption", "PullQuote", "HighlightSweep"]);
const compsUsados = new Set();
let sinClip = 0, conClip = 0, ultimoClip = null;
const bedsOscuras = [];
const tieneImg = (n) => fs.existsSync(`public/img/${n}.jpg`);
const tieneClip = (n) => fs.existsSync(`public/broll/${SLUG}/${n}.mp4`);

for (const p of planos) {
  const { m, k } = p;
  const d = p.f1 - p.f0;
  const seed = p.f0;
  const name = nm(m.i);
  const msIn = Math.round(m.start * 1000);

  if (m.tipo === "componente") {
    const c = m.comp;
    // pisar defaults en español del kit que se ven en pantalla (source de BigStatReveal = "Fuente: ENARGAS…")
    const props = c === "BigStatReveal" ? { source: "", ...(m.props || {}) } : (m.props || {});
    compsUsados.add(c);
    if (OVERLAY.has(c)) {
      overlays.push({ key: `ov_${msIn}`, f0: p.f0, d, el: `(d) => <${c} durationInFrames={d} theme={THEME_PEROXIDE} {...(${jprops(props)} as any)} />` });
      continue;
    }
    // cama de foto: la mas CLARA del entorno (±8 momentos). Vale para TODO componente full-screen
    // (un componente NO tiene imagen propia -> hay que tomar la del vecino, o el bed apunta a nada).
    let mejor = tieneImg(name) ? name : null, mejorL = tieneImg(name) ? (LUMA[name] ?? 0) : -1;
    for (let q = Math.max(0, m.i - 8); q <= m.i + 8; q++) {
      const cand = nm(q), l = LUMA[cand];
      if (l !== undefined && l > mejorL && tieneImg(cand)) { mejor = cand; mejorL = l; }
    }
    if (!mejor) mejor = name;
    if (c === "ChapterTrailCard") {
      if (mejorL < LUMA_MIN_BED) bedsOscuras.push(`${c}@${p.f0} luma ${mejorL}`);
      const bedFile = `img/${mejor}_blur.jpg`;
      assets.add(bedFile); assets.add(`img/${mejor}.jpg`);
      cues.push({ key: `c_${msIn}`, f0: p.f0, d, el: `(d) => <ChapterTrailCard durationInFrames={d} bed=${JSON.stringify(bedFile)} {...(${jprops(props)} as any)} />` });
    } else {
      const bed = `img/${mejor}.jpg`;
      if (tieneImg(mejor)) { assets.add(bed); assets.add(bed.replace(/\.jpg$/, "_blur.jpg")); }
      cues.push({ key: `c_${msIn}`, f0: p.f0, d, el: `(d) => <MdhBed durationInFrames={d} src=${JSON.stringify(bed)} seed={${seed}}><${c} durationInFrames={d} theme={THEME_PEROXIDE} {...(${jprops(props)} as any)} /></MdhBed>` });
    }
    for (const v of JSON.stringify(props).match(/img\/[A-Za-z0-9_.-]+\.jpg/g) || []) { assets.add(v); assets.add(v.replace(/\.jpg$/, "_blur.jpg")); }
    continue;
  }

  // b-roll: clip de agnes si existe y no es el mismo que el anterior; si no, la foto (animada por KenBurns)
  const clipSrc = `broll/${SLUG}/${name}.mp4`;
  if (clipSrc !== ultimoClip && tieneClip(name)) {
    ultimoClip = clipSrc;
    cues.push({ key: `${m.i}_${k}`, f0: p.f0, d, el: `(d) => <MdhClip durationInFrames={d} src=${JSON.stringify(clipSrc)} seed={${seed}} frames={${clipFrames(clipSrc)}} />` });
    assets.add(clipSrc); conClip++;
  } else if (tieneImg(name)) {
    cues.push({ key: `${m.i}_${k}`, f0: p.f0, d, el: `(d) => <MdhFoto durationInFrames={d} src=${JSON.stringify(`img/${name}.jpg`)} seed={${seed}} />` });
    assets.add(`img/${name}.jpg`); assets.add(`img/${name}_blur.jpg`); sinClip++;
  } else { faltan.push(name); continue; }
}

// ── 4. RESOLVER SOLAPES con las ventanas de avatar (el avatar manda) ──
const broll = [];
for (const c of cues) {
  let f0 = c.f0, f1 = c.f0 + c.d;
  // recortar el cue para que NO pise ningun span de avatar
  for (const [a, b] of avatarSpans) {
    if (f1 <= a || f0 >= b) continue;          // sin overlap
    if (f0 >= a && f1 <= b) { f0 = f1 = 0; break; }  // totalmente dentro -> se descarta
    if (f0 < a && f1 > b) { f1 = a; }           // el avatar parte el cue -> me quedo con la parte de antes
    else if (f0 < a) f1 = a;                    // overlap por el final
    else if (f1 > b) f0 = b;                    // overlap por el inicio
  }
  if (f1 - f0 >= 2) { c.f0 = f0; c.d = f1 - f0; broll.push(c); }
}
for (const o of overlays) { /* overlays van ENCIMA, no compiten; no se recortan */ }

// ── 5. contigüidad del b-roll: cada cue se estira hasta el proximo (b-roll o avatar), sin pisar avatar ──
const todos = [...broll, ...avatarCues].sort((a, b) => a.f0 - b.f0);
for (let i = 0; i < broll.length; i++) {
  const c = broll[i];
  const sig = todos.find((q) => q.f0 > c.f0);
  let limite = sig ? sig.f0 : F(TOTAL_S);
  // no pisar el proximo span de avatar
  for (const [a] of avatarSpans) if (a > c.f0 && a < limite) limite = Math.min(limite, a);
  if (limite - c.f0 > c.d && limite - c.f0 <= c.d + F(4.5)) c.d = limite - c.f0;  // estira hasta 4,5s
  else if (limite > c.f0 + c.d && Math.abs(limite - (c.f0 + c.d)) <= 1) c.d = limite - c.f0;  // pega frontera de 1 frame
}

const cuesFinal = [...broll, ...avatarCues].sort((a, b) => a.f0 - b.f0).filter((c) => c.d > 0);
// snap de fronteras de 1 frame: si el proximo cue arranca 1 frame despues del fin de este, pegalo
for (let i = 0; i < cuesFinal.length - 1; i++) {
  const fin = cuesFinal[i].f0 + cuesFinal[i].d;
  if (cuesFinal[i + 1].f0 - fin === 1) cuesFinal[i].d += 1;
}
for (const c of avatarCues) assets.add(c.el.match(/src="([^"]+)"/)[1]);

// ── 6. COMPUERTAS ──
const fallas = [];
const cubierto = new Array(F(TOTAL_S) + 2).fill(false);
for (const c of cuesFinal) for (let f = c.f0; f < Math.min(c.f0 + c.d, cubierto.length); f++) cubierto[f] = true;
const cobTotal = (100 * cubierto.filter(Boolean).length) / cubierto.length;
console.log(`cobertura total (b-roll + avatar): ${cobTotal.toFixed(1)}%  [vara >=95%]`);
if (cobTotal < 95) fallas.push(`cobertura ${cobTotal.toFixed(1)}% < 95%`);

let huecos = [], run = 0;
for (let f = 0; f < cubierto.length; f++) { if (!cubierto[f]) run++; else { if (run > F(6)) huecos.push([(f - run) / FPS, run / FPS]); run = 0; } }
console.log(`huecos >6s sin cobertura: ${huecos.length}` + (huecos.length ? ` -> ${huecos.map(([a, b]) => `${a.toFixed(0)}s(${b.toFixed(1)}s)`).join(" ")}` : ""));
if (huecos.filter(([, b]) => b > 10).length) fallas.push(`${huecos.filter(([, b]) => b > 10).length} huecos >10s`);

// apertura: el primer cue tiene que ser el AVATAR, hasta >=3s
const primero = cuesFinal[0];
const aperturaAvatarOK = primero && primero.avatar && (primero.f0 === 0) && (primero.d >= F(3) - 1);
console.log(`apertura: primer cue ${primero?.avatar ? "AVATAR" : "b-roll"} en f${primero?.f0}, dura ${(primero?.d / FPS).toFixed(2)}s  [vara: avatar, >=3s]`);
if (!aperturaAvatarOK) fallas.push(`la apertura no es el avatar >=3s`);

// fronteras de 1 frame
let gaps = 0;
const ord = [...cuesFinal].sort((a, b) => a.f0 - b.f0);
for (let i = 0; i < ord.length - 1; i++) if (ord[i + 1].f0 - (ord[i].f0 + ord[i].d) === 1) gaps++;
console.log(`fronteras con hueco de 1 frame: ${gaps}  [vara 0]`);
if (gaps) fallas.push(`${gaps} huecos de 1 frame`);

// pacing (solo b-roll; el avatar no cuenta para el metronomo)
const ds = broll.map((c) => c.d / FPS).sort((a, b) => a - b);
const q = (p) => ds[Math.floor(ds.length * p)] || 0;
console.log(`pacing b-roll: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · >=5s ${Math.round(100 * ds.filter((x) => x >= 5).length / ds.length)}% · max ${(ds[ds.length - 1] || 0).toFixed(1)}s  [mediana 3,5-4,5 · p75 >5 · ~40%]`);

// Ken Burns reparto
let out = 0, racha = 0, mejorR = 0, prev = null;
for (const c of broll) { const acerca = rnd(c.f0 * 2654435761) < 0.5; if (!acerca) out++; if (acerca === prev) { racha++; mejorR = Math.max(mejorR, racha); } else racha = 1; prev = acerca; }
const pOut = (100 * out) / (broll.length || 1);
console.log(`Ken Burns: ${pOut.toFixed(0)}% aleja · racha máxima ${mejorR}  [vara 35-65% · racha <=14]`);
if (pOut < 35 || pOut > 65) fallas.push(`reparto de zoom ${pOut.toFixed(0)}% fuera de 35-65%`);

console.log(`camas de ChapterTrailCard bajo luma ${LUMA_MIN_BED}: ${bedsOscuras.length}` + (bedsOscuras.length ? ` -> ${bedsOscuras.join(", ")}` : ""));
if (bedsOscuras.length) fallas.push(`${bedsOscuras.length} chapter cards con cama oscura`);
console.log(`componentes DISTINTOS: ${compsUsados.size} (${[...compsUsados].sort().join(", ")})  [vara >=6]`);
if (compsUsados.size < 6) fallas.push(`sólo ${compsUsados.size} componentes distintos`);
console.log(`ventanas de avatar montadas: ${avatarCues.length} / ${AVWIN.length}` + (AVCLIPS.length ? "" : "  ⚠️ SIN INGEST (avatar_clips.json falta)"));
if (!AVCLIPS.length) fallas.push("faltan los clips del avatar (avatar_clips.json) - corré el ingest");
if (faltan.length) { console.log(`⛔ FALTAN ${faltan.length} assets b-roll: ${[...new Set(faltan)].slice(0, 12).join(", ")}`); }

// ── 7. SALIDA (cues + Main + index) ──
const TOTAL_FRAMES = F(TOTAL_S);
const PX_HERO = ["ChapterTrailCard", "BottleHero", "NodeRingToggle"];
const PX_KIT = ["FoamClean", "GluGluPour"];
const usados = [...compsUsados];
const pxHero = usados.filter((c) => PX_HERO.includes(c));
const pxKit = usados.filter((c) => PX_KIT.includes(c));
const premium = usados.filter((c) => !PX_HERO.includes(c) && !PX_KIT.includes(c));

const imports = [
  `import { ReactNode } from "react";`,
  `import { MdhFoto, MdhClip, MdhBed, MdhAvatar } from "../mdheater/Piezas";`,
  ...(pxHero.length ? [`import { ${pxHero.sort().join(", ")} } from "../peroxide/PeroxideHero";`] : []),
  ...(pxKit.length ? [`import { ${pxKit.sort().join(", ")} } from "../peroxide/PeroxideKit";`] : []),
  ...(premium.length ? [`import { ${premium.sort().join(", ")}, THEME_PEROXIDE } from "./kit/premium";`] : []),
].filter(Boolean);

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
${imports.join("\n")}

export type Cue = { key: string; from: number; dur: number; el: (d: number) => ReactNode };

export const OVERLAYS: Cue[] = [
${overlays.map((c) => `  { key: ${JSON.stringify(c.key)}, from: ${c.f0}, dur: ${c.d}, el: ${c.el} },`).join(NL)}
];

export const CUES: Cue[] = [
${cuesFinal.map((c) => `  { key: ${JSON.stringify(c.key)}, from: ${c.f0}, dur: ${c.d}, el: ${c.el} },`).join(NL)}
];
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, `// Main_${SLUG}.tsx — GENERADO. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_FRAMES};

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* AVATAR POR VENTANAS: los clips de talking-head van como CUES (MdhAvatar), no como piso. El
        b-roll cubre el resto. Un solo <Audio> con el master. */}
    <Audio src={staticFile("${SLUG}.m4a")} />
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={cue.from} durationInFrames={Math.max(1, cue.dur)}>
        {cue.el(Math.max(1, cue.dur))}
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={Math.max(1, o.dur)}>
        {o.el(Math.max(1, o.dur))}
      </Sequence>
    ))}
  </AbsoluteFill>
);
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${COMP}, TOTAL_FRAMES_${SLUG.toUpperCase()} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${SLUG.toUpperCase()}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── 8. ASSETS ──
assets.add(`${SLUG}.m4a`);
const walk = (d, pre) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const r = pre + e.name; e.isDirectory() ? walk(`${d}/${e.name}`, r + "/") : assets.add(r); } };
if (fs.existsSync("public/sfx")) walk("public/sfx", "sfx/");
for (const f of fs.readdirSync("public/img")) if (f.startsWith(`${SLUG}_`) && f.endsWith(".jpg")) assets.add(`img/${f}`);
for (const f of (fs.existsSync(`public/broll/${SLUG}`) ? fs.readdirSync(`public/broll/${SLUG}`) : [])) if (f.endsWith(".mp4")) assets.add(`broll/${SLUG}/${f}`);
const lista = [...assets].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");

// plan enriquecido para las compuertas del repo (beats/overlays)
{
  const normP = (m) => (m.comp === "BigStatReveal" ? { source: "", ...m.props, sfx: false } : { ...m.props, sfx: false });
  const beats = MOM.filter((m) => m.tipo === "componente" && !OVERLAY.has(m.comp)).map((m) => ({ tipo: "componente", componente: m.comp, props: normP(m), ms_in: Math.round(m.start * 1000), ms_out: Math.round((m.start + m.dur) * 1000) }));
  const ovs = MOM.filter((m) => m.tipo === "componente" && OVERLAY.has(m.comp)).map((m) => ({ tipo: "componente", componente: m.comp, props: normP(m), ms_in: Math.round(m.start * 1000) }));
  const base = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^\uFEFF/, ""));
  base.beats = beats; base.overlays = ovs; base.totalMs = Math.round(TOTAL_S * 1000);
  fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(base, null, 1));
  console.log(`plan enriquecido: beats ${beats.length} · overlays ${ovs.length}`);
}

// ── COMPUERTA DE IMPORTS (contra disco, imprime cuánto midió) ──
{
  const path = await import("path");
  let medidos = 0, rotos = 0;
  for (const f of [`src/VideoEdit/cues_${SLUG}.gen.tsx`, `src/VideoEdit/Main_${SLUG}.tsx`, `src/index_${SLUG}.tsx`, `src/${SLUG}/Piezas.tsx`]) {
    if (!fs.existsSync(f)) { console.log(`IMPORTS: no existe ${f}`); rotos++; continue; }
    for (const mm of fs.readFileSync(f, "utf8").match(/from "(\.[^"]+)"/g) || []) {
      const rel = mm.match(/"(.+)"/)[1]; const r = path.default.join(path.default.dirname(f), rel); medidos++;
      if (![".tsx", ".ts", ".jsx", ".js"].some((e) => fs.existsSync(r + e)) && !fs.existsSync(r)) { console.log(`IMPORTS roto en ${f} -> ${rel}`); rotos++; }
    }
  }
  console.log(`imports relativos medidos: ${medidos} · rotos: ${rotos}`);
  if (!medidos || rotos) fallas.push(`imports: medidos ${medidos} rotos ${rotos}`);
}

console.log(`\ncues ${cuesFinal.length} (clip ${conClip} · foto ${sinClip} · componentes ${cuesFinal.length - conClip - sinClip - avatarCues.length} · avatar ${avatarCues.length})`);
console.log(`assets -> _${SLUG}_assets.txt (${lista.length}) · TOTAL ${TOTAL_S.toFixed(2)}s = ${TOTAL_FRAMES} frames`);
if (fallas.length) { console.log(`\n⛔ ${fallas.length} FALLAS:`); fallas.forEach((f) => console.log("   · " + f)); process.exit(1); }
console.log("\n✓ todas las compuertas del build en verde.");
