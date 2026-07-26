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
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { execFileSync } from "node:child_process";

const slug = process.argv[2];
const asJson = process.argv.includes("--json");
if (!slug) { console.error("Uso: node scripts/quality_report.mjs <slug> [--json]"); process.exit(2); }

const FPS = 30;
const R = { slug };
const num = (x, d = 1) => (Number.isFinite(x) ? +x.toFixed(d) : null);

// ── fuentes ───────────────────────────────────────────────────────────────────────────────────
// Se busca en LOS DOS namespaces. El kit federer-video vive aislado en src/_fed6/ y ahí tiene su
// propio Main; en src/VideoEdit/ queda un archivo homónimo mucho más chico. Como sólo se miraba
// src/VideoEdit/, ese kit se medía sobre el archivo equivocado y salía con 3 señales de 6.
// Ante dos candidatos gana el MÁS GRANDE: el build real siempre pesa más que el stub.
const mainPath = (() => {
  const cand = [];
  for (const dir of ["src/VideoEdit", "src/_fed6/VideoEdit"]) {
    if (!existsSync(dir)) continue;
    for (const n of [`Main_${slug}.tsx`, `Main_${slug}_redo.tsx`]) {
      const p = `${dir}/${n}`; if (existsSync(p)) cand.push(p);
    }
    try {
      for (const f of readdirSync(dir)) {
        if (f.includes(slug) && /^Main_.*\.tsx$/.test(f)) cand.push(`${dir}/${f}`);
      }
    } catch {}
  }
  if (!cand.length) return undefined;
  return [...new Set(cand)].sort((a, b) => statSync(b).size - statSync(a).size)[0];
})();
// Los builds data-driven (fed6) tienen los beats en un .ts aparte: sin él, el Main solo no alcanza.
const extraFuentes = ["src/_fed6/VideoEdit", "src/VideoEdit"].flatMap((dir) => {
  try { return readdirSync(dir).filter((f) => f.includes(slug) && /_(beats|broll|hooks)\.ts$/.test(f)).map((f) => `${dir}/${f}`); }
  catch { return []; }
});
const cuesPath = `src/VideoEdit/cues_${slug}.gen.tsx`;
const hayCues = existsSync(cuesPath);
const sinComentarios = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
const src = [
  mainPath && existsSync(mainPath) ? (hayCues ? sinComentarios(readFileSync(mainPath, "utf8")) : readFileSync(mainPath, "utf8")) : "",
  hayCues ? readFileSync(cuesPath, "utf8") : "",
  ...extraFuentes.map((p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } }),
].join("\n");
if (!src.trim()) { console.error(`✗ no encontré el build de ${slug}`); process.exit(1); }

// ── PACING: duración de cada toma ─────────────────────────────────────────────────────────────
// DOS formatos, porque hay dos estilos de build y antes sólo se leía uno:
//   · cues_<slug>.gen.tsx → objetos {start, dur} en SEGUNDOS
//   · Main_<slug>.tsx     → JSX literal <Sequence from={252} durationInFrames={90}> en FRAMES
// El segundo es el del kit fluid, justo el del video que el creador marcó como de máxima calidad.
// Como no se leía, ese video salía con 2 señales y `nota: null` — o sea, el mejor video del canal
// era el único que no se podía puntuar. Cualquier medición que no cubra el estilo bueno miente.
const FPS_Q = 30;
// Las claves pueden venir con o sin comillas: los cues las escriben sueltas (start: 12.4) y los
// beats auto-generados del kit fed6 las escriben como JSON ("start":12.4). Con el regex viejo, que
// exigía la forma sin comillas, ese kit entero quedaba sin pacing pese a tener 324 pares start/dur.
const RE_START_DUR = /["']?start["']?\s*:\s*([\d.]+)\s*,\s*["']?dur["']?\s*:\s*([\d.]+)/g;
const cues = (() => {
  // Se busca en TODAS las fuentes (cues + main + beats), no solo en el archivo de cues.
  const c0 = [...src.matchAll(RE_START_DUR)].map((m) => ({ s: +m[1], d: +m[2] }));
  if (c0.length) return c0;
  // <Sequence from={N} ... durationInFrames={M}> — el orden de los dos atributos puede venir al
  // revés, así que se buscan dentro del mismo tag en vez de asumir una secuencia fija.
  const tags = mainPath && existsSync(mainPath) ? readFileSync(mainPath, "utf8").match(/<Sequence\b[^>]*>/g) || [] : [];
  const c = [];
  for (const t of tags) {
    const f = t.match(/\bfrom=\{(-?\d+)\}/), d = t.match(/\bdurationInFrames=\{(\d+)\}/);
    if (f && d) c.push({ s: Math.max(0, +f[1]) / FPS_Q, d: +d[1] / FPS_Q });
  }
  return c;
})();
if (cues.length) {
  const d = cues.map((c) => c.d).sort((a, b) => a - b);
  const p = (q) => d[Math.floor(d.length * q)];
  R.tomas = d.length;
  R.dur_p50 = num(p(0.5), 2);
  R.dur_p90 = num(p(0.9), 2);
  R.dur_max = num(d[d.length - 1], 2);
  R.pct_mayor_3s = Math.round((100 * d.filter((x) => x > 3.001).length) / d.length);
  R.pct_mayor_5s = Math.round((100 * d.filter((x) => x > 5.001).length) / d.length); // el umbral que se exige de verdad
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
// En los builds DATA-DRIVEN (kit fed6) los componentes no son tags JSX: el Main hace un .map sobre
// los beats y cada beat declara su tipo como {"kind":"lowerthird"}. Contando solo tags, un video de
// 183 usos daba 12 — y la densidad salía 0.3/min en vez de 5.3. Los `kind` son la MISMA lista que
// los tags en el otro estilo, así que se suman al mismo conteo.
const KIND_TOMAS = new Set(["raw", "talk", "shot", "photo", "video"]); // material crudo, no componente
const kinds = [...src.matchAll(/["']kind["']\s*:\s*["']([a-z_][a-z0-9_]*)["']/gi)].map((m) => m[1].toLowerCase());
// Si el build declara `kind`, ESE es el conteo real y los tags JSX del Main NO se suman: ahí el
// Main es un switch que nombra cada componente una vez para despacharlo, no una lista de usos.
// Sumando los dos, un video de 183 usos / 21 distintos daba 195 / 33 — inflado por la tabla de
// despacho. Con kinds presentes: kinds mandan. Sin kinds (build JSX clásico): tags.
const dataDriven = kinds.length > 0;
const comps = dataDriven ? kinds.filter((k) => !KIND_TOMAS.has(k)) : jsx.filter((n) => !TOMAS.has(n));
const shots = dataDriven ? kinds.filter((k) => KIND_TOMAS.has(k)).length : jsx.filter((n) => TOMAS.has(n)).length;
const uniqRe = (re) => new Set([...src.matchAll(re)].map((m) => m[1])).size;
// OJO con estas rutas — acá se midió mal y se reportó "0 clips" en un video que tenía 54:
//   · Capa 2 aisló el b-roll por video, y hay DOS estilos válidos: subcarpeta broll/<slug>/x.mp4
//     y prefijo broll/<slug>_x.mp4. El regex viejo sólo veía el segundo (no cruzaba subcarpetas).
//   · Y varios builds arman la ruta DINÁMICAMENTE (`broll/shots_${SLUG}/${n}`), así que ningún
//     regex sobre el fuente las puede ver.
// Por eso el conteo cruza el fuente con el DISCO, que es la única fuente de verdad.
R.imagenes = uniqRe(/["'`]\/?(?:public\/)?img\/(?:[a-z0-9_\-]+\/)*([a-z0-9_\-]+)\.(?:png|jpg|jpeg|webp)/gi);
const clipsEnFuente = uniqRe(/["'`]\/?(?:public\/)?(?:broll|vid|real)\/(?:[a-z0-9_\-]+\/)*([a-z0-9_\-]+)\.(?:mp4|webm|mov)/gi);
const clipsEnDisco = (() => {
  let n = 0;
  for (const d of [`public/broll/${slug}`, `public/broll/shots_${slug}`]) {
    try { n += readdirSync(d).filter((f) => /\.(mp4|webm|mov)$/i.test(f)).length; } catch {}
  }
  try { n += readdirSync("public/broll").filter((f) => f.startsWith(slug) && /\.(mp4|webm|mov)$/i.test(f)).length; } catch {}
  return n;
})();
R.clips_reales = Math.max(clipsEnFuente, clipsEnDisco);
R.clips_fuente = clipsEnFuente;
R.clips_disco = clipsEnDisco;
R.componentes_usos = comps.length;
R.componentes_distintos = new Set(comps).size;
const momentos = Math.max(shots, R.imagenes + R.clips_reales);
R.momentos_crudos_pct = momentos + comps.length ? Math.round((100 * momentos) / (momentos + comps.length)) : null;
R.top_componentes = Object.entries(comps.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {}))
  .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`);

// ── VARIEDAD POR TRAMO (5 tramos iguales) ─────────────────────────────────────────────────────
// Mismo criterio que density_gate, y por la misma razón: el promedio del video tapa que los
// componentes estén todos al principio. Sirve en los tres estilos de build — con tiempos reales
// (cues / BEATS) o, si el build es un manifiesto plano, por POSICIÓN en la secuencia.
const NB = 5;
{
  let tr = null;
  // Tercera fuente: `from={N}` en FRAMES (kit fluid). Va con divisor porque las otras dos vienen
  // en segundos; sin esto el kit fluid caía al reparto por posición y perdía la señal de tramo.
  for (const { f, re, div } of [
    { f: cuesPath, re: /start:\s*([\d.]+)/g, div: 1 },
    { f: mainPath, re: /startSec:\s*([\d.]+)/g, div: 1 },
    { f: mainPath, re: /\bfrom=\{(\d+)\}/g, div: FPS_Q },
  ]) {
    if (!f || !existsSync(f)) continue;
    const cs = readFileSync(f, "utf8");
    const marcas = [...cs.matchAll(re)].map((m) => ({ i: m.index, t: +m[1] / div }));
    if (marcas.length < NB) continue;
    const fin = Math.max(R.duracion_s || 0, ...marcas.map((x) => x.t)) || 1;
    tr = Array.from({ length: NB }, () => new Set());
    let k = 0;
    for (const m of cs.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
      const n = m[1];
      if (FRAMEWORK.has(n) || ESTRUCTURA.has(n) || TOMAS.has(n)) continue;
      while (k + 1 < marcas.length && marcas[k + 1].i < m.index) k++;
      while (k > 0 && marcas[k].i > m.index) k--;
      tr[Math.min(NB - 1, Math.floor((marcas[k].t / fin) * NB))].add(n);
    }
    R.variedad_medida = "tiempo";
    break;
  }
  if (!tr) {
    const orden = [...src.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1]).filter((n) => !FRAMEWORK.has(n) && !ESTRUCTURA.has(n));
    if (orden.length >= NB * 4) {
      tr = Array.from({ length: NB }, () => new Set());
      orden.forEach((n, i) => { if (!TOMAS.has(n)) tr[Math.min(NB - 1, Math.floor((i / orden.length) * NB))].add(n); });
      R.variedad_medida = "posicion";
    }
  }
  if (tr) { R.variedad_por_tramo = tr.map((x) => x.size); R.tramo_mas_pobre = Math.min(...R.variedad_por_tramo); }
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
// DENSIDAD: usos de componente por minuto. Es la señal que MÁS separa un video de otro según el
// juicio del creador (el que marcó como de máxima calidad iba en 13.2/min; el que no le gustó, en
// 5.3/min) y hasta ahora no se medía. x7 pone el rango útil 0-14 sobre la escala completa.
if (R.componentes_usos != null && R.duracion_s) {
  R.comp_por_min = num(R.componentes_usos / (R.duracion_s / 60));
  puntos.push(clamp(R.comp_por_min * 7));
}
// PACING contra el umbral que el sistema REALMENTE exige (5s del density_gate), no contra los 3s
// que son aspiracionales. Medido contra 3s, el video que el creador eligió como el mejor sacaba 27
// de 100 en esta señal: estaba castigando justo lo que había que premiar. `pct_mayor_3s` se sigue
// reportando como dato, pero no puntúa.
if (R.pct_mayor_5s != null) puntos.push(clamp(100 - R.pct_mayor_5s));
if (R.momentos_crudos_pct != null) puntos.push(clamp(160 - 1.6 * R.momentos_crudos_pct));  // variedad
// Las dos de abajo estaban calibradas contra el PISO (20 componentes, 5 por tramo) y por eso daban
// 100 clavado en cualquier video decente — dos señales que no distinguían nada. Reescaladas al
// rango que ocupan los videos reales (distintos 0-32, tramo más pobre 0-17).
if (R.componentes_distintos != null) puntos.push(clamp(R.componentes_distintos * 3.2));
if (R.tramo_mas_pobre != null) puntos.push(clamp(R.tramo_mas_pobre * 6));
if (R.cobertura_pct != null) puntos.push(clamp(R.cobertura_pct));
if (R.abre_avatar_full != null) puntos.push(R.abre_avatar_full ? 100 : 0);
// con menos de 3 señales la nota no dice nada (builds viejos sin cues, sin avatar.gen, etc.)
R.nota = puntos.length >= 3 ? Math.round(puntos.reduce((a, b) => a + b, 0) / puntos.length) : null;
R.senales = puntos.length;
R.medido_en = new Date().toISOString();

if (asJson) { console.log(JSON.stringify(R)); process.exit(0); }
console.log(`── CALIDAD · ${slug} · ${R.duracion_s ? (R.duracion_s / 60).toFixed(1) + " min" : "?"} ──`);
for (const [k, v] of Object.entries(R)) if (k !== "slug" && k !== "medido_en") console.log(`  ${k.padEnd(22)} ${Array.isArray(v) ? v.join(" · ") : v}`);
