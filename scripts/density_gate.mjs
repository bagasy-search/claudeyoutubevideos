// density_gate.mjs — COMPUERTA DE DENSIDAD. Cuenta los visuales reales del build contra la duración y
// BLOQUEA (exit 1) si el video está pelado. Es el equivalente al gate de caracteres del guion: no le
// PIDE densidad al agente, se la IMPONE — no puede rendear un video estático de avatar + 3 carteles.
//
//   node scripts/density_gate.mjs <slug> [total_frames]
//   → exit 0 = suficiente, podés rendear. exit 1 = pelado, generá más ANTES de rendear.
//
// Umbrales (calibrables por env): 1 visual cada VIS_EVERY_S seg · 1 clip de stock cada CLIP_EVERY_S seg.
import { readFileSync, existsSync, readdirSync } from "fs";
import { execSync } from "node:child_process";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/density_gate.mjs <slug> [total_frames]"); process.exit(2); }

const VIS_EVERY_S = +(process.env.VIS_EVERY_S || 5);    // 1 momento visual cada 5s (≈12/min)
const CLIP_EVERY_S = +(process.env.CLIP_EVERY_S || 30); // 1 clip de STOCK real cada 30s
const FPS = 30;

// 1) ubicar el build
const candidates = [
  `src/VideoEdit/Main_${slug}.tsx`,
  `src/VideoEdit/Main_${slug}_redo.tsx`,
];
const build = candidates.find((p) => existsSync(p)) || readdirSync("src/VideoEdit").filter((f) => f.includes(slug) && /^Main_.*\.tsx$/.test(f)).map((f) => `src/VideoEdit/${f}`)[0];
if (!build || !existsSync(build)) { console.error(`✗ no encontré el build Main_${slug}.tsx — ¿ya lo armaste?`); process.exit(1); }
// Hay DOS estilos de build y el gate tiene que ver los dos:
//   · viejo: todo en Main_<slug>.tsx, cada asset envuelto en <RawShot src="img/...">
//   · nuevo: Main_ solo mapea CUES y el contenido real vive en cues_<slug>.gen.tsx
//            (esos builds embeben además un ASSET_MANIFEST en comentario, para este gate)
// Leyendo solo el Main_, en los builds del estilo viejo contaba CERO y no medía nada.
const cuesPath = `src/VideoEdit/cues_${slug}.gen.tsx`;
const hayCues = existsSync(cuesPath);
// Si hay cues, ESA es la fuente de verdad y hay que sacar los comentarios del Main_: el
// ASSET_MANIFEST/COMPONENT_MANIFEST que embebe el build repetiría todo y contaría doble.
// Sin cues, el manifiesto en comentario es el ÚNICO registro → se conserva.
const sinComentarios = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "");
const src = [
  hayCues ? sinComentarios(readFileSync(build, "utf8")) : readFileSync(build, "utf8"),
  hayCues ? readFileSync(cuesPath, "utf8") : "",
].join("\n");

// 2) duración
// Se intentaba UN solo patrón (TOTAL_FRAMES = <número literal>) y fallaba en casi todos los builds
// reales — `Math.round(TOTAL_X * 30)`, constantes en segundos, etc. Había que pasar los frames a
// mano, y un gate incómodo es un gate que se saltea. Ahora cae en cascada hasta que alguno da.
let totalFrames = +(process.argv[3] || 0);
if (!totalFrames) { const m = src.match(/TOTAL_FRAMES[_A-Z0-9]*\s*=\s*(\d+)/) || src.match(/durationInFrames\s*[=:]\s*(\d+)\s*[;,)]/); if (m) totalFrames = +m[1]; }
// constante en SEGUNDOS (ej. `export const TOTAL_VKI4LQTCBOY0 = 2068.12` en avatar_<slug>.gen.ts)
if (!totalFrames) {
  for (const p of [`src/VideoEdit/avatar_${slug}.gen.ts`, cuesPath, build]) {
    if (!existsSync(p)) continue;
    const m = readFileSync(p, "utf8").match(/TOTAL_[A-Z0-9_]*\s*=\s*([\d.]+)\s*;/);
    if (m && +m[1] > 60) { totalFrames = Math.round(+m[1] * FPS); break; }
  }
}
// último recurso: el final del último cue (start + dur)
if (!totalFrames && hayCues) {
  const cs = readFileSync(cuesPath, "utf8");
  let fin = 0;
  for (const m of cs.matchAll(/start:\s*([\d.]+),\s*dur:\s*([\d.]+)/g)) fin = Math.max(fin, +m[1] + +m[2]);
  if (fin > 60) totalFrames = Math.round(fin * FPS);
}
if (!totalFrames) { console.error("✗ no pude leer la duración (total_frames). Pasala como 2º argumento."); process.exit(1); }
const seconds = Math.round(totalFrames / FPS);

// 3) contar visuales DISTINTOS
const uniq = (re) => [...new Set([...src.matchAll(re)].map((m) => m[1]))];
const imgs = uniq(/["'`]\/?(?:public\/)?img\/([a-z0-9_\-]+)\.(?:png|jpg|jpeg|webp)/gi);
const clips = uniq(/["'`]\/?(?:public\/)?(?:broll|vid|real)\/(?:[a-z0-9_\-]+\/)?([a-z0-9_\-]+)\.(?:mp4|webm|mov|jpg|png)/gi);
// Componentes del kit instanciados. GENÉRICO (antes la lista era casi toda de Federer → los otros
// nichos contaban 0 y el gate los dejaba pasar peladísimos). Ahora: todo <Componente> del JSX menos
// los primitivos de Remotion y los estructurales (fondo/marco/avatar, que no son "componentes").
const FRAMEWORK = new Set(["Sequence","AbsoluteFill","Video","OffthreadVideo","Img","Audio","Series","Loop","Freeze","TransitionSeries","AnimatePresence","Fragment","Composition","Still","Suspense"]);
const ESTRUCTURA = new Set(["AvatarLayer","AvatarWindow","TechBackground","CinematicWrap","HalfLeft","AvatarScrimText","GrainOverlay","MotesLayer","ParallaxLayer"]);
// TOMAS PLANAS: poner una imagen/clip en pantalla NO es "usar el kit". Medición sobre 97 videos
// (jul 2026): RawShot solo era el 84% de TODOS los usos de componentes — el gate lo contaba como
// componente y por eso daba por buena una sucesión de fotos. Ahora se cuentan APARTE: suman a la
// DENSIDAD (siguen siendo un visual), pero no a la VARIEDAD.
const TOMAS = new Set((process.env.TOMAS_PLANAS || "RawShot,HalfShot,ReframedVideo,PhotoScene")
  .split(",").map((s) => s.trim()).filter(Boolean));
const jsxAll = [...src.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1])
  .filter((n) => !FRAMEWORK.has(n) && !ESTRUCTURA.has(n));
const shotAll = jsxAll.filter((n) => TOMAS.has(n));
const compAll = jsxAll.filter((n) => !TOMAS.has(n));
const shotUses = shotAll.length;                       // tomas planas (RawShot y compañía)
const compUses = compAll.length;                       // cada USO de componente real
const compDistinct = [...new Set(compAll)];            // VARIEDAD
// Mínimo de componentes DISTINTOS. Subido de 6 → 12 cuando se llenaron los kits en kits.json
// (casero 38 · fauna 28 · federer 11-20): con esa biblioteca, 12 es un piso razonable — los videos
// BUENOS llegan solos a 20-32 (termitas 32, wasp 22, federer romero 20). Los truchos usan 3.
const MIN_COMP = +(process.env.MIN_COMPONENTES || 12);
// El mínimo global no alcanza: un video de 25 min lo cumple con UN componente nuevo cada 2 minutos
// y después son 10 min seguidos de fotos. Por eso también se exige variedad POR BLOQUE.
const MIN_COMP_BLOQUE = +(process.env.MIN_COMP_BLOQUE || 5);
const BLOQUE_S = +(process.env.BLOQUE_S || 300);       // bloques de 5 min
// % MÁXIMO de momentos "crudos" (material en pantalla sin NADA del kit encima).
// Calibración jul 2026 sobre videos reales: 25 Platos = 86%, sellador/techo7/dulcesv3 ≈ 85-90%.
// 78% obliga a ~+40% de componentes (alcanzable). Bajalo a 70 cuando el flujo lo aguante.
const MAX_RAWSHOT_PCT = +(process.env.MAX_RAWSHOT_PCT || 78);

// La DENSIDAD no cambia: las tomas planas siguen contando como visual (esto NO toca VIS_EVERY_S).
const visuals = imgs.length + clips.length + compUses + shotUses;
// MOMENTOS visuales, en los dos estilos de build sin contar doble:
//   · estilo viejo → cada asset va dentro de un <RawShot> (482 imgs = 482 RawShot)
//   · estilo nuevo → los assets son rutas sueltas y no hay wrapper
const momentos = Math.max(shotUses, imgs.length + clips.length);
const rawPct = (momentos + compUses) ? Math.round((100 * momentos) / (momentos + compUses)) : 0;
const needVisuals = Math.floor(seconds / VIS_EVERY_S);
const needClips = Math.floor(seconds / CLIP_EVERY_S);

// ── VARIEDAD POR BLOQUE ───────────────────────────────────────────────────────────────────────
// El Main_ solo mapea los cues; los componentes CON SU TIEMPO viven en cues_<slug>.gen.tsx.
// Para cada componente busco el `start:` inmediatamente anterior → lo ubico en su bloque de 5 min.
let bloques = null;
const cuesFile = `src/VideoEdit/cues_${slug}.gen.tsx`;
if (existsSync(cuesFile) && seconds > BLOQUE_S) {
  const cs = readFileSync(cuesFile, "utf8");
  const starts = [...cs.matchAll(/start:\s*([\d.]+)/g)].map((m) => ({ i: m.index, t: +m[1] }));
  if (starts.length) {
    const nb = Math.ceil(seconds / BLOQUE_S);
    bloques = Array.from({ length: nb }, () => new Set());
    let k = 0;
    for (const m of cs.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
      const name = m[1];
      if (FRAMEWORK.has(name) || ESTRUCTURA.has(name) || TOMAS.has(name)) continue;
      while (k + 1 < starts.length && starts[k + 1].i < m.index) k++;
      while (k > 0 && starts[k].i > m.index) k--;
      const b = Math.min(nb - 1, Math.floor(starts[k].t / BLOQUE_S));
      bloques[b].add(name);
    }
  }
}

console.log(`── DENSIDAD · ${slug} · ${seconds}s (${(seconds / 60).toFixed(1)} min) ──`);
console.log(`  imágenes IA distintas : ${imgs.length}`);
console.log(`  clips de stock/b-roll : ${clips.length}`);
console.log(`  usos de componentes   : ${compUses}`);
console.log(`  momentos CRUDOS       : ${momentos}   → ${rawPct}% de la pantalla sin nada del kit encima (máximo: ${MAX_RAWSHOT_PCT}%)`);
console.log(`  componentes DISTINTOS : ${compDistinct.length}   (mínimo exigido: ${MIN_COMP})${compDistinct.length ? "  → " + compDistinct.slice(0, 12).join(", ") : ""}`);
if (bloques) {
  console.log(`  variedad por bloque   : ${bloques.map((b) => b.size).join(" · ")}   (mínimo ${MIN_COMP_BLOQUE} por bloque de ${BLOQUE_S / 60} min)`);
}
console.log(`  TOTAL visuales        : ${visuals}   (mínimo exigido: ${needVisuals})`);
console.log(`  clips de stock        : ${clips.length}   (mínimo exigido: ${needClips})`);

// Cuando el gate te frena por monotonía, no sirve decir "usá más componentes": te dice CUÁLES.
// Sale del kit del nicho en disco menos los que este build ya usa (medido: 30% no se usó nunca).
function sugerirComponentes(usados) {
  const yaEsta = new Set(usados);
  const dirs = ["src/VideoEdit/scenes", "src/VideoEdit/kit", "src/VideoEdit/kit/premium"];
  const libres = [];
  for (const d of dirs) {
    try {
      for (const f of readdirSync(d)) {
        if (!/\.tsx$/.test(f)) continue;
        const n = f.replace(/\.tsx$/, "");
        if (!yaEsta.has(n) && !TOMAS.has(n) && !ESTRUCTURA.has(n)) libres.push(n);
      }
    } catch {}
  }
  return libres.slice(0, 10).join(", ");
}

const fallos = [];
// ── CORTE DE ORACIÓN: la duración NUNCA puede ser menor que el audio del avatar ────────────────
// Si el total sale sólo de los beats y el avatar sigue hablando, el video corta la última frase.
let wavSec = 0;
for (const w of [`public/${slug}.wav`, `public/${slug}_16k.wav`]) {
  if (!existsSync(w)) continue;
  try { wavSec = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${w}"`, { encoding: "utf8" }).trim()) || 0; } catch {}
  if (wavSec) break;
}
if (wavSec) {
  const falta = +(wavSec - seconds).toFixed(1);
  console.log(`  audio del avatar      : ${wavSec.toFixed(1)}s   (video: ${seconds}s)`);
  if (falta > 0.5) fallos.push(`CORTA LA ÚLTIMA FRASE: el video dura ${seconds}s pero el audio del avatar dura ${wavSec.toFixed(1)}s → faltan ${falta}s. La duración tiene que ser max(fin de beats, largo del wav), nunca menor.`);
}

// ── ASSETS REPETIDOS (aviso, no bloqueo: repetir un plano se nota) ─────────────────────────────
const clipsAll = [...src.matchAll(/["'`]\/?(?:public\/)?(?:broll|vid|real)\/(?:[a-z0-9_\-]+\/)?([a-z0-9_\-]+)\.(?:mp4|webm|mov)/gi)].map((m) => m[1]);
const rep = Object.entries(clipsAll.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {})).filter(([, n]) => n > 1);
if (rep.length) console.log(`  ⚠ clips REPETIDOS      : ${rep.length} (${rep.slice(0, 6).map(([c, n]) => `${c}×${n}`).join(", ")}) — bajá más en vez de reciclar`);

if (compDistinct.length < MIN_COMP) fallos.push(`KIT SIN USAR: solo ${compDistinct.length} componente(s) distinto(s) (${compDistinct.join(", ") || "ninguno"}), necesitás ≥${MIN_COMP}. Un fondo + un marco + el avatar NO es un kit: así el video se ve trucho y plano. ABRÍ el kit del NICHO (los archivos reales que nombra el router/la memoria del canal) y usá sus componentes — PROHIBIDO improvisar uno propio si el nicho ya tiene.`);
if (visuals < needVisuals) fallos.push(`FALTAN VISUALES: tenés ${visuals}, necesitás ≥${needVisuals} (1 cada ${VIS_EVERY_S}s). Generá más imágenes IA y sumá más componentes/tomas — un video no puede ser avatar hablando con 3 carteles.`);
// ── MONOTONÍA: demasiada toma plana ───────────────────────────────────────────────────────────
if (rawPct > MAX_RAWSHOT_PCT) {
  const sug = sugerirComponentes(compDistinct);
  fallos.push(`DEMASIADA TOMA CRUDA: ${rawPct}% de los ${momentos} momentos visuales no tienen NADA del kit encima (máximo ${MAX_RAWSHOT_PCT}%). Así el video es una sucesión de fotos, no una edición. Reemplazá tomas planas por componentes REALES del kit del nicho${sug ? ` — sin usar todavía tenés: ${sug}` : ""}.`);
}
// ── VARIEDAD POR BLOQUE: que no haya 5 min seguidos de fotos ──────────────────────────────────
if (bloques) {
  const pobres = bloques.map((b, i) => ({ i, n: b.size }))
    .filter((x) => x.n < MIN_COMP_BLOQUE)
    // el último bloque puede ser un resto corto: solo cuenta si tiene ≥60s de video
    .filter((x) => (x.i + 1) * BLOQUE_S - seconds < BLOQUE_S - 60);
  if (pobres.length) {
    const det = pobres.map((x) => `${Math.floor((x.i * BLOQUE_S) / 60)}-${Math.floor(Math.min(seconds, (x.i + 1) * BLOQUE_S) / 60)}min (${x.n})`).join(", ");
    fallos.push(`TRAMOS PELADOS: ${pobres.length} bloque(s) con menos de ${MIN_COMP_BLOQUE} componentes distintos → ${det}. El promedio del video engaña: ahí el espectador ve fotos seguidas. Meté componentes en ESOS minutos, no al principio.`);
  }
}
if (clips.length < needClips) fallos.push(`FALTA B-ROLL REAL: tenés ${clips.length} clips de stock, necesitás ≥${needClips}. Corré el match_v3 / clips-first para bajar clips reales — hoy lo estás salteando.`);

if (fallos.length) {
  console.log(`\n⛔ DENSIDAD INSUFICIENTE — NO RENDEES TODAVÍA:`);
  fallos.forEach((f) => console.log("  · " + f));
  console.log(`\nGenerá los assets que faltan (fan-out: clips-first + match_v3 + imágenes en lote) y volvé a correr este gate. Recién con exit 0 rendeás.`);
  process.exit(1);
}
console.log(`\n✅ densidad OK — podés rendear.`);
process.exit(0);
