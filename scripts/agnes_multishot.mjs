// agnes_multishot.mjs — VARIOS CLIPS POR PEDIDO de agnes-video-2.5-flash (medido 12-oct-2026).
//
//   node scripts/agnes_multishot.mjs <lista.json> <slug> [imgDir=public/img/<slug>] [outDir=public/broll/<slug>]
//   lista = [{ nombre, motion, cu? }]   (misma lista que agnes_i2v; los planos con presentador `pres` se saltean)
//
// Por qué: agnes no acepta lotes (n=1, sin /batches, campos extra = 400), y lo escaso es el LUGAR EN LA COLA.
// Un pedido de 12 s en modo `reference` con 5 fotos (máximo de flash) y un prompt de "montage of N shots joined
// by hard cuts" devuelve tomas en 1280x720, cada una igual a su foto, con cortes secos. Acá se agrupan los planos
// de a AG_SHOTS (def 5), se detectan los cortes y se corta cada toma.
//
// PRIMEROS PLANOS (AG_CU=1, def): por cada foto se pide además un primer plano de un detalle de la misma escena
// (campo `cu` de la lista, ej. "the hem of the white curtain fluttering"; si falta, uno genérico) → 10 tomas por
// pedido = hasta 10 clips (<nombre>.mp4 + <nombre>_cu.mp4). Prueba 12-oct: 9 de 10 (un primer plano se fusionó con
// su toma general). Por eso las tomas generales se reconocen por PARECIDO con su foto, no por posición: si falta un
// corte, sólo se pierde ese primer plano. AG_CU=0 → 5 tomas de ~2,4 s.
//
// AG_SECS (def 12) = duración del pedido. Medido 13-oct con la clave Starter (cupo en SEGUNDOS): 6 s → 5 tomas y
// 4 s → 4 tomas, cortes limpios (~1 s por toma) = 2-2,4× más tomas por segundo de cupo. Con Starter usar
// AG_CU=0 AG_SECS=6 AG_SHOTS=5 (o AG_SECS=4 AG_SHOTS=4).
//
// Ralentí: de cada toma se usa el tramo central de AG_USE s (def 1,0) y se estira AG_SLOW veces (def 3 → 3 s en
// pantalla, 0,33×) con cuadros interpolados (minterpolate) → 1920x1080 30/1 CFR sin audio.
//
// Cuidado con la cuenta: 12-oct agnes restringió 28 de 46 claves ("unusual activity") por reintentar cada 0,5 s.
// Este script reintenta la cola llena cada AGNES_QUEUE_REST_MS (def 20 s) y saca del juego la clave que dé 403.
//
// AG_RAW=<mp4> procesa un video ya generado (sin pedir nada a agnes) con la lista dada, en el mismo orden.
//
// ⛔ Después de generar SIEMPRE: `node scripts/agnes_qc.mjs <slug> --fix` (mismo registro que agnes_i2v).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";

process.env.AGNES_QUEUE_REST_MS ??= "20000";
// ⭐ 15-oct-2026 (tope de 2 h por video). Medido en 12 h: las claves GRATIS dieron 916 "cola llena" y 4 envíos (cvbutter15
//    lleva 7 h esperando clips con ellas); las STARTER responden en 5-35 min (mediana 21). Por eso, por defecto:
//    · claves = AGNES_STARTER_KEY_* del .env (las gratis sólo con AG_FREE=1)
//    · AG_CU=0 AG_SECS=6 AG_SHOTS=5 (lo aprobado 13-oct) y AG_PAR=8 = TODOS los pedidos del video en vuelo a la vez
//    · AG_MAX_MIN (def 50): pasado el plazo sale con lo hecho y lista lo que falta → esos planos van con FOTO (RELOJ_2H)
if (process.env.AG_FREE !== "1" && !process.env.AGNES_KEYS) {
  const envTxt = fs.readFileSync("C:/Users/bauti/Downloads/video2/.env", "utf8");
  const st = envTxt.split(/\r?\n/).filter((l) => /^AGNES_STARTER_KEY_\d+\s*=/.test(l)).map((l) => l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")).filter(Boolean);
  if (st.length) { process.env.AGNES_KEYS = st.join(","); process.env.AGNES_KEYS_OTRA_PC = ""; }
}
process.env.AG_CU ??= "0"; process.env.AG_SECS ??= "6"; process.env.AG_SHOTS ??= "5"; process.env.AG_PAR ??= "8";
const MAX_MS = Number(process.env.AG_MAX_MIN || 50) * 60e3, T0 = Date.now();
process.env.AGNES_SPACING_MS ??= "3000";
const { agnesSubmit, agnesWait, agnesDownload, KEYS } = await import("../factory/lib/agnes_pool.mjs");

const [LIST, SLUG, IMGDIR0, OUT0] = process.argv.slice(2);
if (!LIST || !SLUG) { console.error("uso: node scripts/agnes_multishot.mjs <lista.json> <slug> [imgDir] [outDir]"); process.exit(1); }
const IMGDIR = IMGDIR0 || `public/img/${SLUG}`;
const OUT = OUT0 || `public/broll/${SLUG}`;
const N = Math.min(5, Number(process.env.AG_SHOTS || 5));          // flash: máximo 5 imágenes por pedido
const CU = process.env.AG_CU !== "0";
const SECS = Number(process.env.AG_SECS || 12), USE = Number(process.env.AG_USE || 1.0), SLOW = Number(process.env.AG_SLOW || 3);
const PAR = Number(process.env.AG_PAR || 4);                        // pedidos en vuelo a la vez
const RAW = process.env.AG_RAW;

// claves restringidas ("unusual activity") fuera del juego: las del registro de agnes_pool + las que aparezcan
const hk = (k) => crypto.createHash("sha1").update(k).digest("hex").slice(0, 10);
const LOG = (fs.existsSync("D:/") ? "D:/rtmp/agnes_pool" : path.join(process.env.TEMP || "/tmp", "agnes_pool")) + "/log.jsonl";
const quitar = (pred) => { for (let i = KEYS.length - 1; i >= 0; i--) if (pred(KEYS[i])) KEYS.splice(i, 1); };
const restringidas = () => { try { return new Set(fs.readFileSync(LOG, "utf8").split("\n").filter((l) => l.includes("nusual activity")).map((l) => JSON.parse(l).k)); } catch { return new Set(); } };
quitar((k) => restringidas().has(hk(k)));
if (!KEYS.length && !RAW) { console.error("⛔ no quedan claves de agnes sin restringir"); process.exit(1); }

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const srcImg = (n) => [".jpg", ".png", ".webp"].map((e) => path.join(IMGDIR, n + e)).find((f) => fs.existsSync(f));
const dataURI = (f) => `data:${MIME[path.extname(f).toLowerCase()]};base64,` + fs.readFileSync(f).toString("base64");

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^\uFEFF/, ""));
fs.mkdirSync(path.join(OUT, "_raw"), { recursive: true });
const pend = items.filter((it) => {
  if (it.pres) { console.log(`  (con presentador, va por otro camino) ${it.nombre}`); return false; }
  if (!srcImg(it.nombre)) { console.log(`  (sin imagen base, salteo) ${it.nombre}`); return false; }
  return RAW || !fs.existsSync(path.join(OUT, `${it.nombre}.mp4`));
});
const lotes = []; for (let i = 0; i < pend.length; i += N) lotes.push(pend.slice(i, i + N));
const porPedido = CU ? 2 : 1;
console.log(`agnes multishot · ${N} fotos${CU ? " × (general + primer plano)" : ""} por pedido de ${SECS} s · uso ${USE} s ×${SLOW} = ${(USE * SLOW).toFixed(1)} s en pantalla · ${KEYS.length} claves`);
console.log(`total ${items.length} · a generar ${pend.length} fotos → hasta ${pend.length * porPedido} clips en ${lotes.length} pedidos\n`);

const REG = `_v3/${SLUG}_agnes_clips.json`;
const reg = fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, "utf8")) : {};
const guardarReg = () => { fs.mkdirSync(path.dirname(REG), { recursive: true }); fs.writeFileSync(REG, JSON.stringify(reg, null, 1)); };

const NUM = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];
const limpio = (s) => String(s).replace(/\.\s*$/, "");
const tomas = (lote) => lote.flatMap((it, i) => [
  { it, cu: false, txt: `exactly <Picture ${i + 1}>; ${limpio(it.motion)}` },
  ...(CU ? [{ it, cu: true, txt: `close-up of ${it.cu ? limpio(it.cu) : "the most important detail of the scene"} from <Picture ${i + 1}>, ${it.cu ? "a tiny slow movement" : limpio(it.motion)}` }] : []),
]);
const prompt = (ts) => {
  const d = SECS / ts.length, f = (x) => x.toFixed(1);
  return `A montage of ${NUM[ts.length - 1]} separate static shots joined by hard cuts, each shot lasts exactly ${f(d)} seconds, fixed camera in every shot, only one small simple motion per shot, no transitions, nobody new appears, no people talking, no music. ` +
    (CU ? "Odd shots reproduce their picture exactly (same framing, same objects, same light); even shots are a tight close-up of a detail of that same scene with the same light. " : "Each shot reproduces its picture exactly (same framing, same objects, same light). ") +
    ts.map((t, k) => `Shot ${k + 1} (${f(k * d)}-${f((k + 1) * d)} s): ${t.txt}.`).join(" Hard cut. ");
};

// --- cortes y reconocimiento de tomas --------------------------------------------------------------
const durDe = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim();
const segmentos = (raw) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", raw, "-vf", "select='gt(scene,0.25)',showinfo", "-f", "null", "-"], { encoding: "utf8" });
  const t = [...String(r.stderr).matchAll(/pts_time:([\d.]+)/g)].map((m) => +m[1]);
  const b = [0, ...t, durDe(raw)];
  return b.slice(0, -1).map((a, i) => ({ a, b: b[i + 1] })).filter((s) => s.b - s.a > 0.3);
};
// huella 32x18 en grises → correlación de Pearson (la toma general es casi idéntica a su foto: ~0,8-0,95)
const huella = (args) => { const buf = execFileSync("ffmpeg", ["-v", "error", ...args, "-vf", "scale=32:18,format=gray", "-frames:v", "1", "-f", "rawvideo", "-"]); return [...buf]; };
const corr = (x, y) => { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n;
  let sxy = 0, sx = 0, sy = 0; for (let i = 0; i < n; i++) { const dx = x[i] - mx, dy = y[i] - my; sxy += dx * dy; sx += dx * dx; sy += dy * dy; } return sxy / Math.sqrt(sx * sy || 1); };
const UMBRAL = Number(process.env.AG_SIM || 0.7);
// devuelve [{ it, cu, a, b, sim }] en orden; tomas generales = la mejor coincidencia (≥ UMBRAL) con su foto, en orden
const asignar = (raw, lote) => {
  const segs = segmentos(raw);
  const fotos = lote.map((it) => huella(["-i", srcImg(it.nombre)]));
  const sim = segs.map((s) => { const h = huella(["-ss", (s.a + Math.min(0.3, (s.b - s.a) / 3)).toFixed(3), "-i", raw]); return fotos.map((f) => corr(h, f)); });
  const out = []; let desde = 0;
  lote.forEach((it, i) => {
    let best = -1;
    for (let j = desde; j < segs.length; j++) if (sim[j][i] >= UMBRAL && (best < 0 || sim[j][i] > sim[best][i])) best = j;
    if (best < 0) { console.log(`  ⚠ no encontré la toma general de ${it.nombre} (mejor parecido ${Math.max(...sim.map((s) => s[i])).toFixed(2)})`); return; }
    out.push({ it, cu: false, ...segs[best], sim: +sim[best][i].toFixed(2) });
    const sig = segs[best + 1];
    // primer plano = el segmento siguiente si NO es la toma general de la próxima foto
    if (CU && sig && !(i + 1 < lote.length && sim[best + 1][i + 1] >= UMBRAL)) out.push({ it, cu: true, ...sig, sim: +sim[best + 1][i].toFixed(2) });
    else if (CU) { out.at(-1).alInicio = true; console.log(`  ⚠ ${it.nombre}: el primer plano no salió (se fusionó con otra toma) → la general se toma del inicio del tramo`); }
    desde = best + 1;
  });
  return { tomas: out, nsegs: segs.length };
};
const cortarToma = (raw, a, b, dst, alInicio = false) => {
  const mid = (a + b) / 2, len = Math.min(USE, b - a - 0.2), s = alInicio ? a + 0.1 : Math.max(a + 0.1, mid - len / 2);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.toFixed(3), "-t", len.toFixed(3), "-i", raw, "-vf",
    `minterpolate=fps=${30 * SLOW}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=${SLOW}*PTS,fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1`,
    "-an", "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", dst]);
};

// 15-oct (reloj 2 h + escalar): la cámara lenta (minterpolate, ~34 s de CPU por toma) se hace en el FARM (.github/workflows/slowmo.yml)
// con el MISMO filtro; la laptop sólo detecta las tomas. SLOWMO_FARM=0 → todo local como antes. Lo que el farm no devuelva se corta en local.
const FARM = process.env.SLOWMO_FARM !== "0", REPO_GH = "bagasy-search/claudeyoutubevideos";
const tramo = (a, b, alInicio) => { const mid = (a + b) / 2, len = Math.min(USE, b - a - 0.2); return { s: alInicio ? a + 0.1 : Math.max(a + 0.1, mid - len / 2), len }; };
async function cortarEnFarm(url, ts) {
  const id = `${SLUG}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, hechos = new Set();
  const cuts = ts.map((t) => { const { s, len } = tramo(t.a, t.b, t.alInicio); return { n: t.it.nombre + (t.cu ? "_cu" : ""), s: +s.toFixed(3), len: +len.toFixed(3) }; });
  try {
    execFileSync("gh", ["workflow", "run", "slowmo.yml", "-R", REPO_GH, "--ref", "main", "-f", "job=" + JSON.stringify({ id, slug: SLUG, url, slow: SLOW, cuts })], { stdio: "pipe" });
    const T = Date.now();
    while (Date.now() - T < 10 * 60e3 && hechos.size < cuts.length) {
      await new Promise((r) => setTimeout(r, 20e3));
      let names = [];
      try { names = JSON.parse(execFileSync("gh", ["release", "view", `slowmo-${SLUG}`, "-R", REPO_GH, "--json", "assets", "-q", "[.assets[].name]"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })); } catch {}
      for (const c of cuts) {
        const a = `${id}__${c.n}.mp4`;
        if (hechos.has(c.n) || !names.includes(a)) continue;
        try { execFileSync("gh", ["release", "download", `slowmo-${SLUG}`, "-R", REPO_GH, "-p", a, "-O", path.join(OUT, `${c.n}.mp4`), "--clobber"], { stdio: "pipe" });
              if (fs.statSync(path.join(OUT, `${c.n}.mp4`)).size > 10_000) hechos.add(c.n); } catch {}
      }
    }
  } catch (e) { console.log(`  ⚠ farm slowmo: ${String(e.message).slice(0, 120)} → corto en local`); }
  console.log(`  ⚡ farm: ${hechos.size}/${cuts.length} tomas en cámara lenta`);
  return hechos;
}

let ok = 0, fail = 0;
const procesar = async (raw, lote, url) => {
  const { tomas: ts, nsegs } = asignar(raw, lote);
  console.log(`  ${path.basename(raw)}: ${nsegs} tomas detectadas → ${ts.length} clips`);
  const delFarm = FARM && url && ts.length ? await cortarEnFarm(url, ts) : new Set();
  for (const t of ts) {
    const nombre = t.it.nombre + (t.cu ? "_cu" : ""), dst = path.join(OUT, `${nombre}.mp4`);
    try { if (!delFarm.has(nombre)) cortarToma(raw, t.a, t.b, dst, t.alInicio); } catch (e) { fail++; console.log(`  ✗ corte ${nombre}: ${String(e.message).slice(0, 100)}`); continue; }
    reg[nombre] = { raw, desde: +t.a.toFixed(3), hasta: +t.b.toFixed(3), parecido: t.sim, primerPlano: t.cu,
      fps: 24, slow: SLOW, use: USE, multishot: true, pres: false, gente: !!t.it.gente, person: !!(t.it.person || t.it.gente),
      motion: t.cu ? (t.it.cu || "detalle") : t.it.motion, at: new Date().toISOString() };
    ok++; console.log(`  ✓ ${nombre}${t.cu ? "" : ` (parecido ${t.sim})`}`);
  }
  guardarReg();
};

if (RAW) { await procesar(RAW, pend.slice(0, N)); console.log(`\n=== LISTO · ok ${ok} · fail ${fail} ===`); process.exit(0); }

const cola = [...lotes];
async function trabajador() {
  for (let lote; (lote = cola.shift()); ) {
    if (Date.now() - T0 > MAX_MS) { cola.unshift(lote); break; }
    const tag = `${SLUG} ms[${lote.map((x) => x.nombre).join(",")}]`;
    const body = { model: "agnes-video-2.5-flash", size: "720P", aspect_ratio: "16:9", seconds: String(SECS), mode: "reference",
      images: lote.map((it) => dataURI(srcImg(it.nombre))), prompt: prompt(tomas(lote)) };
    let vid, key;
    try { ({ vid, key } = await agnesSubmit(body, { tag })); }
    catch (e) {
      if (/unusual activity/i.test(e.message)) { quitar((k) => restringidas().has(hk(k))); console.log(`  ⚠ clave restringida, quedan ${KEYS.length}`); if (KEYS.length) { cola.push(lote); continue; } }
      fail += lote.length; console.log(`  ✗ ${tag}: ${String(e.message).slice(0, 140)}`); continue;
    }
    console.log(`  → aceptado ${vid} (${lote.length} fotos)`);
    const w = await agnesWait(vid, key, { model: "agnes-video-2.5-flash", maxMs: Math.max(60e3, MAX_MS - (Date.now() - T0)) });
    const raw = path.join(OUT, "_raw", `ms_${vid.slice(-10)}.mp4`);
    if (w.error || !(await agnesDownload(w.url, raw))) { fail += lote.length; console.log(`  ✗ ${vid}: ${w.error || "descarga"}`); continue; }
    await procesar(raw, lote, w.url);
  }
}
const plazo = new Promise((r) => setTimeout(r, MAX_MS + 30e3).unref?.());
await Promise.race([Promise.all(Array.from({ length: Math.min(PAR, lotes.length) }, (_, i) => new Promise((r) => setTimeout(r, i * 5000)).then(trabajador))), plazo]);
if (Date.now() - T0 > MAX_MS) {
  const sinClip = pend.filter((it) => !fs.existsSync(path.join(OUT, it.nombre + ".mp4"))).map((it) => it.nombre);
  fs.writeFileSync(path.join(OUT, "_sin_clip.json"), JSON.stringify(sinClip, null, 1));
  console.log(`
⏱ PLAZO de ${MAX_MS / 60e3} min cumplido: ${sinClip.length} planos sin clip → van con FOTO (lista en ${path.join(OUT, "_sin_clip.json")})`);
  fail += sinClip.length;
}
console.log(`\n=== LISTO · ok ${ok} · fail ${fail} ===`);
console.log(`siguiente paso OBLIGATORIO: node scripts/agnes_qc.mjs ${SLUG} --fix`);
process.exit(fail ? 1 : 0);
