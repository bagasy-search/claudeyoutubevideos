// quality_report.mjs — FOTO DE CALIDAD del video terminado, en números comparables.
//
//   node scripts/quality_report.mjs <slug> [--json]
//
// Por qué existe: el AUDITOR es un chequeo que hace el agente mirando frames, y su veredicto no
// queda en ningún lado. Resultado: no había forma de saber si un video salió mejor o peor que el
// anterior, ni si un cambio en el pipeline mejoró algo. Para el análisis de jul 2026 hubo que
// reconstruir esto a mano desde los .gen.tsx de 97 videos.
//
// Esto NO bloquea nada (para eso está density_gate). Solo mide y devuelve JSON, para guardarlo en
// video_jobs.quality_report y poder mirar la tendencia por canal.
import { readFileSync, existsSync, readdirSync } from "fs";
import { execFileSync } from "node:child_process";

const slug = process.argv[2];
const asJson = process.argv.includes("--json");
if (!slug) { console.error("Uso: node scripts/quality_report.mjs <slug> [--json]"); process.exit(2); }

const FPS = 30;
const R = { slug };
const num = (x, d = 1) => (Number.isFinite(x) ? +x.toFixed(d) : null);

// ── fuentes ───────────────────────────────────────────────────────────────────────────────────
const mainPath = [`src/VideoEdit/Main_${slug}.tsx`, `src/VideoEdit/Main_${slug}_redo.tsx`]
  .find((p) => existsSync(p))
  || (readdirSync("src/VideoEdit").filter((f) => f.includes(slug) && /^Main_.*\.tsx$/.test(f)).map((f) => `src/VideoEdit/${f}`)[0]);
const cuesPath = `src/VideoEdit/cues_${slug}.gen.tsx`;
const hayCues = existsSync(cuesPath);
const sinComentarios = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
const src = [
  mainPath && existsSync(mainPath) ? (hayCues ? sinComentarios(readFileSync(mainPath, "utf8")) : readFileSync(mainPath, "utf8")) : "",
  hayCues ? readFileSync(cuesPath, "utf8") : "",
].join("\n");
if (!src.trim()) { console.error(`✗ no encontré el build de ${slug}`); process.exit(1); }

// ── PACING: duración de cada toma ─────────────────────────────────────────────────────────────
const cues = hayCues
  ? [...readFileSync(cuesPath, "utf8").matchAll(/start:\s*([\d.]+),\s*dur:\s*([\d.]+)/g)].map((m) => ({ s: +m[1], d: +m[2] }))
  : [];
if (cues.length) {
  const d = cues.map((c) => c.d).sort((a, b) => a - b);
  const p = (q) => d[Math.floor(d.length * q)];
  R.tomas = d.length;
  R.dur_p50 = num(p(0.5), 2);
  R.dur_p90 = num(p(0.9), 2);
  R.dur_max = num(d[d.length - 1], 2);
  R.pct_mayor_3s = Math.round((100 * d.filter((x) => x > 3.001).length) / d.length);
  const fin = Math.max(...cues.map((c) => c.s + c.d));
  R.duracion_s = num(fin, 0);
  // cobertura: cuánto del video tiene ALGO en pantalla (sin huecos)
  const iv = cues.map((c) => [c.s, c.s + c.d]).sort((a, b) => a[0] - b[0]);
  let cov = 0, end = 0;
  for (const [a, b] of iv) { const st = Math.max(a, end); if (b > st) { cov += b - st; end = b; } }
  R.cobertura_pct = Math.round((100 * cov) / fin);
  R.tomas_por_min = num(d.length / (fin / 60));
}
if (!R.duracion_s) {
  // OJO: hay constantes en FRAMES (TOTAL_FRAMES_X = 45720) y en SEGUNDOS (TOTAL_X = 2068.12).
  // Tomarlas por igual daba videos de "762 min". Se decide por el nombre y por la magnitud.
  const m = src.match(/(TOTAL_[A-Z0-9_]*)\s*=\s*([\d.]+)\s*;/);
  if (m) {
    const esFrames = /FRAME/.test(m[1]) || +m[2] > 5000;
    const seg = esFrames ? +m[2] / FPS : +m[2];
    if (seg > 60 && seg < 4 * 3600) R.duracion_s = num(seg, 0);
  }
}

// ── VARIEDAD: componentes vs material crudo ───────────────────────────────────────────────────
const FRAMEWORK = new Set(["Sequence","AbsoluteFill","Video","OffthreadVideo","Img","Audio","Series","Loop","Freeze","TransitionSeries","AnimatePresence","Fragment","Composition","Still","Suspense"]);
const ESTRUCTURA = new Set(["AvatarLayer","AvatarWindow","TechBackground","CinematicWrap","HalfLeft","AvatarScrimText","GrainOverlay","MotesLayer","ParallaxLayer"]);
const TOMAS = new Set(["RawShot","HalfShot","ReframedVideo","PhotoScene"]);
const jsx = [...src.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1]).filter((n) => !FRAMEWORK.has(n) && !ESTRUCTURA.has(n));
const comps = jsx.filter((n) => !TOMAS.has(n));
const shots = jsx.filter((n) => TOMAS.has(n)).length;
const uniqRe = (re) => new Set([...src.matchAll(re)].map((m) => m[1])).size;
R.imagenes = uniqRe(/["'`]\/?(?:public\/)?img\/([a-z0-9_\-]+)\.(?:png|jpg|jpeg|webp)/gi);
R.clips_reales = uniqRe(/["'`]\/?(?:public\/)?(?:broll|vid|real)\/([a-z0-9_\-]+)\.(?:mp4|webm|mov)/gi);
R.componentes_usos = comps.length;
R.componentes_distintos = new Set(comps).size;
const momentos = Math.max(shots, R.imagenes + R.clips_reales);
R.momentos_crudos_pct = momentos + comps.length ? Math.round((100 * momentos) / (momentos + comps.length)) : null;
R.top_componentes = Object.entries(comps.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {}))
  .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`);

// variedad por bloque de 5 min
if (hayCues && R.duracion_s > 300) {
  const cs = readFileSync(cuesPath, "utf8");
  const starts = [...cs.matchAll(/start:\s*([\d.]+)/g)].map((m) => ({ i: m.index, t: +m[1] }));
  const nb = Math.ceil(R.duracion_s / 300);
  const b = Array.from({ length: nb }, () => new Set());
  let k = 0;
  for (const m of cs.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
    const n = m[1];
    if (FRAMEWORK.has(n) || ESTRUCTURA.has(n) || TOMAS.has(n)) continue;
    while (k + 1 < starts.length && starts[k + 1].i < m.index) k++;
    while (k > 0 && starts[k].i > m.index) k--;
    b[Math.min(nb - 1, Math.floor(starts[k].t / 300))].add(n);
  }
  R.variedad_por_bloque = b.map((x) => x.size);
  R.bloque_mas_pobre = Math.min(...R.variedad_por_bloque);
}

// ── APERTURA: la regla dura es avatar full ≥2s y nada antes ───────────────────────────────────
const avPath = `src/VideoEdit/avatar_${slug}.gen.ts`;
if (existsSync(avPath)) {
  try {
    const a = readFileSync(avPath, "utf8");
    const w = [...a.matchAll(/"start":\s*([\d.]+),\s*"mode":\s*"(\w+)"/g)].map((m) => ({ s: +m[1], m: m[2] }));
    if (w.length) {
      const dur = (w[1]?.s ?? 999) - w[0].s;
      R.abre_avatar_full = w[0].m === "full" && w[0].s < 0.5 && dur >= 2;
      R.apertura_s = num(dur);
      R.ventanas_avatar = w.length;
      R.pip = w.some((x) => /pip|corner/i.test(x.m));   // la regla prohíbe PiP en esquina
    }
  } catch {}
}

// ── audio vs video: que no corte la última frase ──────────────────────────────────────────────
for (const w of [`public/${slug}.wav`, `public/${slug}_16k.wav`]) {
  if (!existsSync(w)) continue;
  try {
    const d = parseFloat(execFileSync("ffprobe", ["-v","error","-show_entries","format=duration","-of","default=nk=1:nw=1", w], { encoding: "utf8" }).trim());
    if (d) { R.audio_s = num(d, 0); R.corta_frase = R.duracion_s ? R.duracion_s < d - 0.5 : null; }
  } catch {}
  break;
}

// ── nota final: una sola cifra para mirar la tendencia ────────────────────────────────────────
// No es ciencia; es un semáforo comparable entre videos del mismo canal.
const clamp = (x) => Math.max(0, Math.min(100, x));
const puntos = [];
if (R.pct_mayor_3s != null) puntos.push(clamp(100 - R.pct_mayor_3s));                      // pacing
if (R.momentos_crudos_pct != null) puntos.push(clamp(160 - 1.6 * R.momentos_crudos_pct));  // variedad
if (R.componentes_distintos != null) puntos.push(clamp(R.componentes_distintos * 5));
if (R.cobertura_pct != null) puntos.push(clamp(R.cobertura_pct));
if (R.abre_avatar_full != null) puntos.push(R.abre_avatar_full ? 100 : 0);
// con menos de 3 señales la nota no dice nada (builds viejos sin cues, sin avatar.gen, etc.)
R.nota = puntos.length >= 3 ? Math.round(puntos.reduce((a, b) => a + b, 0) / puntos.length) : null;
R.senales = puntos.length;
R.medido_en = new Date().toISOString();

if (asJson) { console.log(JSON.stringify(R)); process.exit(0); }
console.log(`── CALIDAD · ${slug} · ${R.duracion_s ? (R.duracion_s / 60).toFixed(1) + " min" : "?"} ──`);
for (const [k, v] of Object.entries(R)) if (k !== "slug" && k !== "medido_en") console.log(`  ${k.padEnd(22)} ${Array.isArray(v) ? v.join(" · ") : v}`);
