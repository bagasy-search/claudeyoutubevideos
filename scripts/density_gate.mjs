// density_gate.mjs — COMPUERTA DE DENSIDAD. Cuenta los visuales reales del build contra la duración y
// BLOQUEA (exit 1) si el video está pelado. Es el equivalente al gate de caracteres del guion: no le
// PIDE densidad al agente, se la IMPONE — no puede rendear un video estático de avatar + 3 carteles.
//
//   node scripts/density_gate.mjs <slug> [total_frames]
//   → exit 0 = suficiente, podés rendear. exit 1 = pelado, generá más ANTES de rendear.
//
// Umbrales legacy compatibles con Visual V3. Este gate evita un video pelado, pero no puede
// contradecir al Golden Master pidiendo cortes o componentes de relleno.
import { readFileSync, existsSync, readdirSync } from "fs";
import { execSync } from "node:child_process";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/density_gate.mjs <slug> [total_frames]"); process.exit(2); }

const VIS_EVERY_S = +(process.env.VIS_EVERY_S || 8);    // ≈7.5 momentos/min; Visual V3 acepta 6.5-10.5
const CLIP_EVERY_S = +(process.env.CLIP_EVERY_S || 40); // el stock limpio complementa avatar y componentes
const FPS = 30;

// 1) ubicar el build
const candidates = [
  `src/VideoEdit/Main_${slug}.tsx`,
  `src/VideoEdit/Main_${slug}_redo.tsx`,
  // los kits por canal viven fuera de VideoEdit (valeria, _fed6, peroxide...)
  `src/valeria/Main_${slug}.tsx`,
  `src/_fed6/Main_${slug}.tsx`,
  // ⛔ los Main de _fed6 viven UN NIVEL MAS ADENTRO (src/_fed6/VideoEdit/). Sin esta linea el
  // gate abortaba con "no encontré el build" para TODA la familia _fed6 (estoalos70, taza9pm,
  // collagen3, cuellopavo...) — o sea que nunca llegó a medir nada en esos videos.
  `src/_fed6/VideoEdit/Main_${slug}.tsx`,
  `src/peroxide/Main_${slug}.tsx`,
];
const build = candidates.find((p) => existsSync(p)) || readdirSync("src/VideoEdit").filter((f) => f.includes(slug) && /^Main_.*\.tsx$/.test(f)).map((f) => `src/VideoEdit/${f}`)[0];
if (!build || !existsSync(build)) { console.error(`✗ no encontré el build Main_${slug}.tsx — ¿ya lo armaste?`); process.exit(1); }
// Hay DOS estilos de build y el gate tiene que ver los dos:
//   · viejo: todo en Main_<slug>.tsx, cada asset envuelto en <RawShot src="img/...">
//   · nuevo: Main_ solo mapea CUES y el contenido real vive en cues_<slug>.gen.tsx
//            (esos builds embeben además un ASSET_MANIFEST en comentario, para este gate)
// Leyendo solo el Main_, en los builds del estilo viejo contaba CERO y no medía nada.
const cuesCand = [
  `src/VideoEdit/cues_${slug}.gen.tsx`,
  `src/VideoEdit/cues_${slug}.gen.ts`,
  `src/valeria/cues_${slug}.gen.ts`,
  `src/_fed6/cues_${slug}.gen.ts`,
  // ⛔ el kit _fed6 no usa `cues_*.gen.ts`: su fuente de verdad data-driven es
  // `src/_fed6/VideoEdit/<slug>_beats.ts` (exporta <SLUG>_BEATS y <SLUG>_BROLL, que es
  // justo lo que el bloque data-driven de más abajo sabe leer). Sin esta ruta el gate caía
  // al conteo por JSX y veía los ~13 casos del switch en vez de los usos REALES de componente.
  `src/_fed6/VideoEdit/${slug}_beats.ts`,
  `src/peroxide/cues_${slug}.gen.ts`,
];
const cuesPath = cuesCand.find((p) => existsSync(p)) || cuesCand[0];
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
// Las rutas de b-roll tienen DOS estilos válidos desde Capa 2 (subcarpeta broll/<slug>/x.mp4 y
// prefijo broll/<slug>_x.mp4) y algunos builds las arman dinámicamente. El regex viejo sólo veía
// el prefijo → un video con 54 clips en disco se contaba como 0 y el gate pedía b-roll que YA estaba.
const imgs = uniq(/["'`]\/?(?:public\/)?img\/(?:[a-z0-9_\-]+\/)*([a-z0-9_\-]+)\.(?:png|jpg|jpeg|webp)/gi);
const clipsFuente = uniq(/["'`]\/?(?:public\/)?(?:broll|vid|real)\/(?:[a-z0-9_\-]+\/)*([a-z0-9_\-]+)\.(?:mp4|webm|mov|jpg|png)/gi);
const clipsDisco = (() => {
  const s = new Set();
  for (const d of [`public/broll/${slug}`, `public/broll/shots_${slug}`]) {
    try { for (const f of readdirSync(d)) if (/\.(mp4|webm|mov)$/i.test(f)) s.add(f); } catch {}
  }
  try { for (const f of readdirSync("public/broll")) if (f.startsWith(slug) && /\.(mp4|webm|mov)$/i.test(f)) s.add(f); } catch {}
  return [...s];
})();
const clips = clipsDisco.length > clipsFuente.length ? clipsDisco : clipsFuente;
// Componentes del kit instanciados. GENÉRICO (antes la lista era casi toda de Federer → los otros
// nichos contaban 0 y el gate los dejaba pasar peladísimos). Ahora: todo <Componente> del JSX menos
// los primitivos de Remotion y los estructurales (fondo/marco/avatar, que no son "componentes").
const FRAMEWORK = new Set(["Sequence","AbsoluteFill","Video","OffthreadVideo","Img","Audio","Series","Loop","Freeze","TransitionSeries","AnimatePresence","Fragment","Composition","Still","Suspense"]);
const ESTRUCTURA = new Set(["AvatarLayer","AvatarWindow","TechBackground","CinematicWrap","HalfLeft","AvatarScrimText","GrainOverlay","MotesLayer","ParallaxLayer"]);
// TOMAS PLANAS: poner una imagen/clip en pantalla NO es "usar el kit". Medición sobre 97 videos
// (jul 2026): RawShot solo era el 84% de TODOS los usos de componentes — el gate lo contaba como
// componente y por eso daba por buena una sucesión de fotos. Ahora se cuentan APARTE: suman a la
// DENSIDAD (siguen siendo un visual), pero no a la VARIEDAD.
const TOMAS = new Set((process.env.TOMAS_PLANAS || "RawShot,HalfShot,ReframedVideo,PhotoScene,FedFullShot")
  .split(",").map((s) => s.trim()).filter(Boolean));
const jsxAll = [...src.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1])
  .filter((n) => !FRAMEWORK.has(n) && !ESTRUCTURA.has(n));
const shotAll = jsxAll.filter((n) => TOMAS.has(n));
const compAll = jsxAll.filter((n) => !TOMAS.has(n));
// ── DATA-DRIVEN por CUES (mismo punto ciego que ya se arregló para .bagasy/timeline_<slug>.json)
// Un build cuyo Main mapea `cues_<slug>.gen.tsx` instancia cada componente UNA vez dentro de un
// switch: el regex de JSX ve 8 casos y no las 139 instancias reales, así que la densidad daba ~0 y
// el gate bloqueaba un video lleno. Si el cues trae beats con "kind", ESA es la fuente de verdad.
let dd = null;
if (hayCues) {
  try {
    const cs = readFileSync(cuesPath, "utf8");
    const arr = (re) => { const m = cs.match(re); return m ? JSON.parse(m[1]) : null; };
    let bts = arr(/CP_BEATS[^=]*=\s*(\[[\s\S]*?\]);/) || arr(/[A-Z_]+_BEATS[^=]*=\s*(\[[\s\S]*?\]);/);
    let brl = arr(/CP_BROLL[^=]*=\s*(\[[\s\S]*?\]);/) || arr(/[A-Z_]+_BROLL[^=]*=\s*(\[[\s\S]*?\]);/);
    // Variante de UN SOLO array: `export const BEATS: Cue[] = [...]` con componentes y b-roll
    // mezclados y separados por `kind` (kits por canal: valeria, _fed6...). Sin esto el gate
    // cae al conteo por JSX y ve los casos del switch, no los usos reales.
    if (!bts) {
      const todo = arr(/(?:^|[^A-Z_])BEATS\s*:?[^=]*=\s*(\[[\s\S]*?\]);/m);
      if (todo && todo.some((b) => b && b.kind)) {
        const OVER = new Set(["talk", "lowerthird"]);
        bts = todo.filter((b) => b.kind !== "full").map((b) => (OVER.has(b.kind) ? {...b, overlay: true} : b));
        brl = todo.filter((b) => b.kind === "full");
      }
    }
    if (bts && bts.length && bts.some((b) => b && b.kind)) {
      // ⛔ Los beats `raw` NO son componentes: son la toma plana. Contándolos, un video de 341
      // fotos + 55 componentes reportaba 396 usos y 14.5/min (y listaba "raw" como si fuera un
      // kind del kit), o sea el gate se auto-aprobaba justo en lo que vino a medir.
      const comps = bts.filter((b) => b.kind !== "raw");
      // "sin NADA del kit encima": tapa tanto el overlay como el componente a PANTALLA COMPLETA
      // (si un componente full ocupa ese tramo, el b-roll de abajo ni se ve — no es crudo).
      const ov = comps.length ? comps : bts.filter((b) => b.overlay);
      const tapado = (v) => ov.some((o) => o.start < v.start + v.dur && v.start < o.start + o.dur);
      dd = {
        compUses: comps.length,
        compDistinct: [...new Set(comps.map((b) => b.kind))],
        // "crudo" = visual sin NADA del kit encima; los componentes a pantalla completa no son crudos
        momentos: (brl || []).length,
        crudos: (brl || []).filter((v) => !tapado(v)).length,
        imgs: [...new Set((brl || []).filter((b) => !b.video).map((b) => b.src))],
        clips: [...new Set((brl || []).filter((b) => b.video).map((b) => b.src))],
      };
    }
  } catch {}
}
const shotUses = dd ? 0 : shotAll.length;              // tomas planas (RawShot y compañía)
const compUses = dd ? dd.compUses : compAll.length;    // cada USO de componente real
const compDistinct = dd ? dd.compDistinct : [...new Set(compAll)];   // VARIEDAD
// Mínimo de componentes DISTINTOS. Subido de 6 → 12 cuando se llenaron los kits en kits.json
// (casero 38 · fauna 28 · federer 11-20): con esa biblioteca, 12 es un piso razonable — los videos
// BUENOS llegan solos a 20-32 (termitas 32, wasp 22, federer romero 20). Los truchos usan 3.
const MIN_COMP = +(process.env.MIN_COMPONENTES || 8);
// El mínimo global no alcanza: un video de 25 min lo cumple con UN componente nuevo cada 2 minutos
// y después son 10 min seguidos de fotos. Por eso también se exige variedad POR BLOQUE.
const MIN_COMP_BLOQUE = +(process.env.MIN_COMP_BLOQUE || 5);
const BLOQUE_S = +(process.env.BLOQUE_S || 300);       // bloques de 5 min
// % MÁXIMO de momentos "crudos" (material en pantalla sin NADA del kit encima).
// Calibración jul 2026 sobre videos reales: 25 Platos = 86%, sellador/techo7/dulcesv3 ≈ 85-90%.
// 78% obliga a ~+40% de componentes (alcanzable). Bajalo a 70 cuando el flujo lo aguante.
const MAX_RAWSHOT_PCT = +(process.env.MAX_RAWSHOT_PCT || 78);
// ── PISO DE DENSIDAD: usos de componente POR MINUTO ───────────────────────────────────────────
// Por qué existe: los topes de arriba miran PROPORCIONES, y una proporción se cumple igual de bien
// con mucho material que con poco. Un video de 34 min pasó con 74% de crudo (legal, bajo el 78) y
// aun así se veía pobre, porque tenía 5.3 usos/min: el mismo kit estirado sobre el doble de metraje.
// La proporción estaba bien y la densidad partida al medio, y ninguna compuerta se quejó.
//
// Calibración jul 2026 sobre los 15 videos terminados con reporte (usos ÷ minutos):
//   15.8 · 13.1 │ 5.5 · 5.3 · 4.6 · 4.5 · 3.8 · 3.1 · 2.5 · 2.4 · 2.4 · 2.3 · 1.8 · 1.3 · 0.0
//   mediana 3.8. Los DOS de arriba son los únicos que el creador marcó como "de pura calidad".
// CORRECCIÓN (importante): esos 13,2 y 5,3 estaban MAL MEDIDOS. Los props de este kit se pasan por
// spread (`<FedStat {...P[21]} />`) y el contenido vive en un array aparte, así que hubo que
// resolverlo para saber qué lleva datos encima y qué no. Resultado sobre el video de máxima calidad:
//   · 244 usos con spread = 11,6/min
//   · de esos, FedFullShot: 68 usos, 0 con contenido → es una TOMA a pantalla completa, no un
//     componente. Ya está movido al set TOMAS de arriba.
//   · componentes REALES: 176 usos = 8,4/min
// O sea que un piso de 9 le exigía MÁS que al video que el creador llamó "de pura calidad". El piso
// va en 7: ~17% por debajo de esa referencia, y bien por encima del 5,3 del video que no le gustó.
// Golden Master: los componentes premium ocupan 20-35% de ~7.5 momentos/min. Exigir 7/min
// convertía cada explicación en una tarjeta y fue la causa directa de los videos ruidosos.
const MIN_COMP_MIN = +(process.env.MIN_COMP_MIN || 1.5);

// La DENSIDAD no cambia: las tomas planas siguen contando como visual (esto NO toca VIS_EVERY_S).
const visuals = imgs.length + clips.length + compUses + shotUses;
// MOMENTOS visuales, en los dos estilos de build sin contar doble:
//   · estilo viejo → cada asset va dentro de un <RawShot> (482 imgs = 482 RawShot)
//   · estilo nuevo → los assets son rutas sueltas y no hay wrapper
const momentos = dd ? dd.momentos : Math.max(shotUses, imgs.length + clips.length);
const rawPct = dd
  ? (dd.momentos ? Math.round((100 * dd.crudos) / dd.momentos) : 0)
  : ((momentos + compUses) ? Math.round((100 * momentos) / (momentos + compUses)) : 0);
// ── LA BATA EN PANTALLA ───────────────────────────────────────────────────────────────────────
// Hasta jul 2026 esta compuerta trataba el avatar como si no existiera: AvatarLayer/AvatarWindow
// están en ESTRUCTURA (no cuentan como componente) y los mínimos se medían contra la duración
// TOTAL. O sea que cada segundo de bata a pantalla completa le empeoraba al agente los dos números
// que sí se le exigen — pedía un visual cada 5s y 7 comp/min sobre tiempo en el que, a propósito,
// no hay nada más que la cara. El sistema converge al gate, así que el gate escondía al presentador.
// Medición sobre 56 videos: mediana 11,2% de avatar full (mínimo 0%, máximo 62,7%).
// Arreglo: los mínimos se miden contra el tiempo VISIBLE (total − avatar full). Sostener la cara
// deja de costar densidad, y la densidad pasa a medir lo que quiere medir — qué tan trabajada está
// la pista visual cuando la hay, no cuánta pista visual hay.
const avatarWins = (() => {
  for (const p of [`src/VideoEdit/avatar_${slug}.gen.ts`, `src/_fed6/VideoEdit/avatar_${slug}.gen.ts`]) {
    if (!existsSync(p)) continue;
    const w = [...readFileSync(p, "utf8").matchAll(/"start":\s*([\d.]+),\s*"mode":\s*"(\w+)"/g)]
      .map((m) => ({ t: +m[1], mode: m[2] })).sort((a, b) => a.t - b.t);
    if (w.length >= 2) return w;
  }
  return null; // video faceless: no hay bata que medir, las comprobaciones de avatar se saltean
})();
const tramosFull = [];
if (avatarWins) {
  for (let i = 0; i < avatarWins.length; i++) {
    if (avatarWins[i].mode !== "full") continue;
    const fin = i + 1 < avatarWins.length ? avatarWins[i + 1].t : seconds;
    if (fin > avatarWins[i].t) tramosFull.push(fin - avatarWins[i].t);
  }
}
const avatarFullS = Math.round(tramosFull.reduce((a, b) => a + b, 0));
const avatarPct = seconds ? Math.round((100 * avatarFullS) / seconds) : 0;
// Piso: por debajo de esto el canal pierde la cara que lo identifica. Techo: por arriba deja de ser
// un documental y se vuelve una cabeza parlante — el creador pidió explícitamente NO llegar a eso.
// Un regreso a la cara de 2s es un parpadeo, no presencia. Medido: los videos con más avatar tienen
// tramos de mediana 6-13s; los que "no se siente la bata" cortan de vuelta cada 2,5s.
const medTramoFull = tramosFull.length
  ? [...tramosFull].sort((a, b) => a - b)[Math.floor(tramosFull.length / 2)] : 0;

const compPorMin = seconds ? +(compUses / (seconds / 60)).toFixed(1) : 0;
const needVisuals = Math.floor(seconds / VIS_EVERY_S);
const needClips = Math.floor(seconds / CLIP_EVERY_S);

// ── COMPONENTES PROPIOS DE ESTE VIDEO (medición, NO una regla más) ────────────────────────────
// El video que el creador marcó como "de pura calidad" trajo 11 componentes diseñados a medida
// (un subagente Opus por cada uno). El que no le gustó trajo 0 y sólo colocó los que ya existían,
// con el modo subagentes activado igual en los dos. Ese número es el que separa un video del otro,
// así que se MIDE y se muestra. A propósito no bloquea: forzar "creá N componentes" produciría
// componentes de relleno hechos para pasar el gate, que es peor que no tenerlos.
const propios = (() => {
  try {
    const base = process.env.WORKTREE_BASE || "wt-base";
    const q = (c) => execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    // cambiados respecto de la base (incluye el working tree) + los todavía sin trackear
    const tocados = [
      ...q(`git diff --name-only ${base} -- "*.tsx"`).split("\n"),
      ...q(`git ls-files --others --exclude-standard -- "*.tsx"`).split("\n"),
    ].filter(Boolean);
    if (!tocados.length) return null;
    const defs = new Set();
    for (const f of tocados) {
      if (!existsSync(f)) continue;
      for (const m of readFileSync(f, "utf8").matchAll(/export const ([A-Z]\w*)\s*:\s*React\.FC/g)) defs.add(m[1]);
    }
    // sólo cuentan los que además SE USAN en el build
    // "Usado" hay que buscarlo en el BUILD REAL, no solo en `src` de arriba. En los kits con
    // manifiesto (_fed6), `src/VideoEdit/Main_<slug>.tsx` es una LISTA para contar visuales y el
    // build que se rendea vive en `src/_fed6/VideoEdit/`. Mirando solo el manifiesto, un componente
    // hecho a medida y usado de verdad no aparecía: el Botox Verde tenía CUATRO (FocusCardsVdj,
    // HeadlineVdj, CalloutVdj, BoardVdj) y esto reportaba 1. Ese número se usa para juzgar calidad,
    // así que medirlo mal manda a corregir lo que no estaba roto.
    const otros = ["src/_fed6/VideoEdit", "src/VideoEdit"]
      .filter((d) => existsSync(d))
      .flatMap((d) => readdirSync(d).map((f) => `${d}/${f}`))
      .filter((f) => f.includes(slug) && /^Main_/.test(f.split("/").pop()) && f !== build);
    const usadoAparte = new Set();
    for (const f of otros) {
      try { for (const m of readFileSync(f, "utf8").matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) usadoAparte.add(m[1]); } catch { /* ignorar */ }
    }
    return [...defs].filter((n) => compDistinct.includes(n) || usadoAparte.has(n));
  } catch { return null; } // sin git utilizable no invento un 0
})();

// ── VARIEDAD POR TRAMO ────────────────────────────────────────────────────────────────────────
// El promedio del video ENGAÑA: se cumple el mínimo global metiendo todo al principio y después
// van 10 minutos de fotos seguidas. Hay TRES estilos de build y hay que medir en los tres:
//   · cues_<slug>.gen.tsx  → `start:` en segundos           (tiempo real)
//   · BEATS (FedererFluid) → `startSec:` en segundos        (tiempo real)
//   · Main_ manifiesto     → lista plana de tags, SIN tiempo (se usa la POSICIÓN en la secuencia)
// Con tiempo real el fallo BLOQUEA. Sin tiempo sólo AVISA: la posición es un proxy razonable
// (el orden de los tags suele ser el del video) pero no está verificado, y un gate que bloquea
// por una suposición hace que lo terminen apagando.
const NB = 5;                                   // el video se parte en 5 tramos iguales
let tramos = null, tramoReal = false;
{
  const fuentes = [
    { f: `src/VideoEdit/cues_${slug}.gen.tsx`, re: /start:\s*([\d.]+)/g },
    { f: build, re: /startSec:\s*([\d.]+)/g },
  ];
  for (const { f, re } of fuentes) {
    if (!existsSync(f)) continue;
    const cs = readFileSync(f, "utf8");
    const marcas = [...cs.matchAll(re)].map((m) => ({ i: m.index, t: +m[1] }));
    if (marcas.length < NB) continue;
    const fin = Math.max(seconds, ...marcas.map((x) => x.t)) || seconds;
    tramos = Array.from({ length: NB }, () => new Set());
    let k = 0;
    for (const m of cs.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
      const n = m[1];
      if (FRAMEWORK.has(n) || ESTRUCTURA.has(n) || TOMAS.has(n)) continue;
      while (k + 1 < marcas.length && marcas[k + 1].i < m.index) k++;
      while (k > 0 && marcas[k].i > m.index) k--;
      tramos[Math.min(NB - 1, Math.floor((marcas[k].t / fin) * NB))].add(n);
    }
    tramoReal = true;
    break;
  }
  if (!tramos) {                                 // sin tiempos: reparto por POSICIÓN en la secuencia
    const orden = [...src.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1])
      .filter((n) => !FRAMEWORK.has(n) && !ESTRUCTURA.has(n));
    if (orden.length >= NB * 4) {
      tramos = Array.from({ length: NB }, () => new Set());
      orden.forEach((n, idx) => {
        if (TOMAS.has(n)) return;
        tramos[Math.min(NB - 1, Math.floor((idx / orden.length) * NB))].add(n);
      });
    }
  }
}

console.log(`── DENSIDAD · ${slug} · ${seconds}s (${(seconds / 60).toFixed(1)} min) ──`);
console.log(`  imágenes IA distintas : ${imgs.length}`);
console.log(`  clips de stock/b-roll : ${clips.length}`);
console.log(`  usos de componentes   : ${compUses}   → ${compPorMin}/min (mínimo: ${MIN_COMP_MIN}/min)`);
console.log(`  momentos CRUDOS       : ${momentos}   → ${rawPct}% de la pantalla sin nada del kit encima (máximo: ${MAX_RAWSHOT_PCT}%)`);
console.log(`  componentes DISTINTOS : ${compDistinct.length}   (mínimo exigido: ${MIN_COMP})${compDistinct.length ? "  → " + compDistinct.slice(0, 12).join(", ") : ""}`);
if (propios !== null) {
  console.log(`  componentes PROPIOS   : ${propios.length}   (diseñados para ESTE video${propios.length ? ": " + propios.join(", ") : " — ninguno, sólo reusaste el kit"})`);
}
if (tramos) {
  console.log(`  variedad por tramo    : ${tramos.map((b) => b.size).join(" · ")}   (mínimo ${MIN_COMP_BLOQUE} por tramo${tramoReal ? "" : ", medido por POSICIÓN — sin tiempos en el build"})`);
}
console.log(`  TOTAL visuales        : ${visuals}   (mínimo exigido: ${needVisuals})`);
console.log(`  clips de stock        : ${clips.length}   (mínimo exigido: ${needClips})`);
if (avatarWins) {
  console.log(`  BATA a pantalla llena : ${avatarPct}%  (${avatarFullS}s de ${seconds}s, ${tramosFull.length} vueltas de mediana ${medTramoFull.toFixed(1)}s)   solo medición, sin umbral`);
}

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
const clipsAll = [...src.matchAll(/["'`]\/?(?:public\/)?(?:broll|vid|real)\/([a-z0-9_\-]+)\.(?:mp4|webm|mov)/gi)].map((m) => m[1]);
const rep = Object.entries(clipsAll.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {})).filter(([, n]) => n > 1);
if (rep.length) console.log(`  ⚠ clips REPETIDOS      : ${rep.length} (${rep.slice(0, 6).map(([c, n]) => `${c}×${n}`).join(", ")}) — bajá más en vez de reciclar`);

if (compDistinct.length < MIN_COMP) fallos.push(`KIT SIN USAR: solo ${compDistinct.length} componente(s) distinto(s) (${compDistinct.join(", ") || "ninguno"}), necesitás ≥${MIN_COMP}. Un fondo + un marco + el avatar NO es un kit: así el video se ve trucho y plano. ABRÍ el kit del NICHO (los archivos reales que nombra el router/la memoria del canal) y usá sus componentes — PROHIBIDO improvisar uno propio si el nicho ya tiene.`);
if (visuals < needVisuals) fallos.push(`FALTAN VISUALES: tenés ${visuals}, necesitás ≥${needVisuals} (1 cada ${VIS_EVERY_S}s). Generá más imágenes IA y sumá más componentes/tomas — un video no puede ser avatar hablando con 3 carteles.`);
// ── MONOTONÍA: demasiada toma plana ───────────────────────────────────────────────────────────
if (rawPct > MAX_RAWSHOT_PCT) {
  const sug = sugerirComponentes(compDistinct);
  fallos.push(`DEMASIADA TOMA CRUDA: ${rawPct}% de los ${momentos} momentos visuales no tienen NADA del kit encima (máximo ${MAX_RAWSHOT_PCT}%). Así el video es una sucesión de fotos, no una edición. Reemplazá tomas planas por componentes REALES del kit del nicho${sug ? ` — sin usar todavía tenés: ${sug}` : ""}.`);
}
// ── DENSIDAD POR MINUTO: el kit estirado sobre demasiado metraje ──────────────────────────────
// Distinto de "DEMASIADA TOMA CRUDA": aquel mide la PROPORCIÓN, éste mide la CANTIDAD por minuto.
// Se puede fallar éste con proporción perfecta (poco de todo) y fallar aquél con densidad alta.
if (compPorMin < MIN_COMP_MIN) {
  const faltan = Math.ceil((MIN_COMP_MIN - compPorMin) * (seconds / 60));
  const sug = sugerirComponentes(compDistinct);
  const pista = propios !== null && propios.length === 0
    ? " Dato medido, por si sirve: este video no trajo NINGÚN componente propio. El que el creador marcó como de máxima calidad trajo 11, diseñados de a uno."
    : "";
  fallos.push(`EXPLICACIÓN VISUAL INSUFICIENTE: ${compUses} usos de componente en ${(seconds / 60).toFixed(1)} min = ${compPorMin}/min (piso ${MIN_COMP_MIN}/min). Faltan ~${faltan} afirmaciones importantes convertidas en mecanismos, comparaciones, mediciones o pasos visuales. No repitas componentes ni agregues tarjetas decorativas para cumplir; elegí claims reales del guion y diseñá la explicación adecuada${sug ? `. Familias disponibles: ${sug}` : ""}.${pista}`);
}
// ── VARIEDAD POR TRAMO: que no haya un tercio del video en fotos seguidas ─────────────────────
if (tramos) {
  const pobres = tramos.map((b, i) => ({ i, n: b.size })).filter((x) => x.n < MIN_COMP_BLOQUE);
  if (pobres.length) {
    const min = (i) => Math.round((i * seconds) / (NB * 60));
    const det = pobres.map((x) => `${min(x.i)}-${min(x.i + 1)}min (${x.n} distintos)`).join(", ");
    const msg = `TRAMOS PELADOS: ${pobres.length} de ${NB} tramos con menos de ${MIN_COMP_BLOQUE} componentes distintos → ${det}. El promedio del video engaña: ahí el espectador ve tomas seguidas sin nada encima. Meté componentes en ESOS minutos, no al principio.`;
    if (tramoReal) fallos.push(msg);
    else console.log(`\n  ⚠ ${msg}\n    (medido por POSICIÓN en la secuencia porque el build no tiene tiempos — no bloquea, pero miralo)`);
  }
}
if (clips.length < needClips) fallos.push(`FALTA B-ROLL REAL: tenés ${clips.length} clips de stock, necesitás ≥${needClips}. Corré el match_v3 / clips-first para bajar clips reales — hoy lo estás salteando.`);

// ── AIRE: cuántos planos son largos ───────────────────────────────────────────────────────────
// La densidad mide CUÁNTO hay en pantalla; esto mide si el video RESPIRA. Son cosas distintas y un
// video puede aprobar densidad y aun así sentirse picado. Medido el 2026-07-27 sobre 4 videos:
//   Cardiólogo 43% de planos ≥5s (p75 7,2s) · Urólogo 38% (5,3s) · GUANTE 36% (5,8s)
//   Botox 15% (p75 4,2s = igual a la mediana) ← este es el que el creador sintió peor
// El Botox salió con una regla de prosa mal escrita ("~1 de cada 5 planos ≥5s" = 20%): el sistema
// convergió al número nombrado y lo perforó. Por eso el número vive acá también y no solo en el
// prompt. AVISA, no bloquea: forzar planos largos produciría tomas estiradas de relleno.
{
  const bt = ["src/_fed6/VideoEdit", "src/VideoEdit"]
    .filter((d) => existsSync(d))
    .flatMap((d) => readdirSync(d).map((f) => `${d}/${f}`))
    .find((f) => f.includes(slug) && /beats[^/]*\.(ts|tsx)$/.test(f));
  if (bt) {
    const durs = [...readFileSync(bt, "utf8").matchAll(/"dur":\s*([\d.]+)/g)].map((m) => +m[1]).sort((a, b) => a - b);
    if (durs.length >= 20) {
      const p = (q) => durs[Math.floor(durs.length * q)];
      const largos = Math.round((100 * durs.filter((x) => x >= 5).length) / durs.length);
      console.log(`  AIRE (planos largos)  : ${largos}% de los ${durs.length} planos duran ≥5s · mediana ${p(0.5).toFixed(1)}s · p75 ${p(0.75).toFixed(1)}s   (referencia: 36-43% y p75 ≥5s)`);
      if (largos < 28 || p(0.75) < 4.8) {
        console.log(`
⚠️  VIDEO PICADO: solo ${largos}% de planos ≥5s (los que salieron bien tienen 36-43%) y p75 de ${p(0.75).toFixed(1)}s.`);
        console.log(`   Con el p75 pegado a la mediana no hay planos largos: son todos parecidos y el video no respira.`);
        console.log(`   No cortes por cumplir densidad — si una toma pide durar, que dure.`);
      }
    }
  }
}

if (fallos.length) {
  console.log(`\n⛔ DENSIDAD INSUFICIENTE — NO RENDEES TODAVÍA:`);
  fallos.forEach((f) => console.log("  · " + f));
  console.log(`\nGenerá los assets que faltan (fan-out: clips-first + match_v3 + imágenes en lote) y volvé a correr este gate. Recién con exit 0 rendeás.`);
  process.exit(1);
}
console.log(`\n✅ densidad OK — podés rendear.`);
process.exit(0);
