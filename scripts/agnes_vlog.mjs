// agnes_vlog.mjs — "VLOG CONTINUO": el presentador HACIENDO algo en su set, hablando con SU voz, en tomas
// continuas sin cortes. Validado 23-sep-2026 (1:02 Federer mascarilla de arroz; 18:34 tfbgrietas, 151 clips).
// Memoria: reference_agnes_modelos_25_sep2026.md · reference_tfbgrietas_vlog_agnes_gotchas_sep2026.md ·
//          feedback_gptimage_low_batch_siempre.md (las 4 palancas) · skill agnes-broll § VLOG CONTINUO.
//
//   node scripts/agnes_vlog.mjs <plan.json>[,<plan2.json>…] anclas [--modo=batch|sync] [--size=WxH] [--prev=WxH] [--largas]
//        → gpt-image-2 LOW /edits con las 4 palancas: BATCH por RONDAS (la ronda n manda el ancla n de TODAS las
//          escenas juntas: K(n) depende de K(n-1)), salida 1088x608, cara recortada 128x192, ancla previa achicada.
//          Varios planes separados por coma = varias escenas en las MISMAS rondas (así se paga UN batch por ronda).
//          `--modo=sync` = respaldo sin Batch (el DOBLE): cola global con limitador de IMG_PER_MIN imágenes de
//          ENTRADA por minuto (medido: 5/min en /images/edits con crédito recién cargado) y WORKERS en paralelo; un ancla
//          con más refs que el límite pasa sola con la ventana vacía (antes se colgaba).
//          Si se corta mientras espera un batch, al relanzar RETOMA el batch pendiente (anc/_batch_pendiente.json del
//          1er plan) en vez de pagarlo de nuevo. Lotes de ≤70 por batch; la salida se lee stremeada por línea.
//   node scripts/agnes_vlog.mjs <plan.json> clips    → agnes-video-2.5-flash `reference`, TODOS en paralelo, ancla→ancla
//   node scripts/agnes_vlog.mjs <plan.json> check    → whisper-1 por clip vs texto + costuras + visión; guarda HISTORIAL
//        por clip (clips/check_hist.json) y deja en state.json la MEJOR versión por puntaje, no la última.
//   node scripts/agnes_vlog.mjs <plan.json> armar    → une con fundido 0,1 s (tpad clona el último cuadro si el clip
//        viene justo en T); audio = tramos (o audio propio del clip)
//   (clips/check aceptan ids: `clips c4 c7` regenera sólo esos, con sufijo r; `check --recheck` re-mide todo)
//
// 💰 COSTO DE LAS ANCLAS — medido 23-sep-2026 con el `usage` REAL (tfbgrietas S1, cadena K0→K3, prompt ~340 tok):
//    config                                                   img-entrada  salida   $/ancla
//    ANTES: sync · 1536x1024 · ancla previa 1536x864 + cara 560x690   2128       158    $0,0235
//    sync   · 1088x608 · previa 256x144 + cara 128x192                 240        96    $0,0065  (respaldo)
//    batch  · 1536x1024 · previa 256x144 + cara 128x192                240       158    $0,0042
//    batch  · 1088x608  · previa 256x144 + cara 128x192  ⭐ DEFAULT    240        96    $0,0033  (−86%)
//    batch  · 1088x608  · previa 192x108 + cara 128x192                180        96    $0,0030  (en K2 cambió el
//                                                                                      destornillador por otra herramienta)
//    Tokens de una ref de entrada: 128x192=96 · 192x108=84 · 256x144=144 · 384x216=336 · 512x288=576 · 768x432=576 ·
//    560x690=832 · 1536x864=1296 (ver tokIn). El texto del prompt (~340 tok) ya es ~25% del costo: no inflarlo.
//    1088x608 vs 1536x1024: identidad y continuidad iguales; a 720p el 1536 tiene más microdetalle (laplaciano de la
//    cara ~2×) pero en el clip agnes la diferencia a ojo es mínima → default 1088x608; `--size=1536x1024` (+$0,0009/ancla)
//    si una escena pide textura fina. Cada imagen loguea su $ real en anc/_costos.jsonl y avisa si pasa >15% de lo esperado.
//
// ⛔ CADENAS ≤ 15 ANCLAS: a 30 anclas encadenadas el set y el encuadre derivan. `anclas` ABORTA si una cadena pasa de
//    MAX_CHAIN (15) anclas desde su foto base: partila en otra escena con su propia foto base (o hacé que un ancla
//    salga de un K anterior "limpio" con `from:["K0",…]`). `--largas` lo deja pasar con aviso.
//
// plan.json:
// { "dir": "D:/…/vlog_<slug>",                     // salida (anc/, clips/)
//   "face": "…/ref_face.png",                        // RECORTE de la cara (no la foto entera: se cuelan sus objetos).
//                                                    //   Para las anclas se achica solo a 128x192 (crop 2:3 centrado);
//                                                    //   "face_crop":"w:h:x:y" para elegir el recorte. Los clips usan la original.
//   "k0_from": "…/ref_presentador_en_su_set.png",    // foto base del set (K0 se edita desde acá; va achicada)
//   "extra": { "W": "…/cara_señora.png", "COVER": "…/portada.jpg" },   // refs con nombre (anclas: caja 512 px; clips: original)
//   "anclas_size": "1088x608", "prev_box": "256x144",  // opcionales por plan (los flags --size/--prev mandan)
//   "pronoun": "he",                                 // "she" si es presentadora (frase anti-balbuceo del clip)
//   "anchors": [ { "id":"K0", "from":["k0"], "prompt":"…" }, { "id":"K1", "from":["K0"], "prompt":"…" }, { "id":"K5", "from":["K4","W","COVER"], "prompt":"…" } ],
//   "clips": [ { "id":"c1", "a":"K0", "b":"K1", "audio":"…/tramo1.wav", "text":"lo que dice", "action":"qué hace (inglés)" },
//              { "id":"c5", "a":"K4", "b":"K5", "secs":10, "line":"diálogo literal", "voice":"in Spanish with a warm Mexican accent, the lively voice of a 76-year-old grandmother", "refs":["W"], "action":"…" } ],
//   "out": "…/vlog_<slug>.mp4" }
// · clip con `audio` → se rellena con silencio hasta segundo ENTERO (el ancla final cae justo en la costura) y va como audios[].
//   Al final del prompt va SIEMPRE "When the reference audio ends he stops talking and keeps the mouth closed" (sin eso
//   `mode:"reference"` inventa palabras en el silencio del relleno; en el armado suena igual el tramo del máster).
// · clip con `line` (personaje secundario SIN audio ref) → el modelo dice el texto literal con ese acento; en el armado suena SU audio.
// · Límites 2.5-flash: 4-12 s, sólo 720P (1280x720: el ancla de 1088x608 se sube ×1,18), sin fps, cola GLOBAL
//   (`video_queue_full` con todas las claves) → reintento cada ~30 s.
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { Readable } from "node:stream";
import { execFileSync } from "node:child_process";

const [, , planArg, fase, ...rest] = process.argv;
const FL = Object.fromEntries(rest.filter(a => a.startsWith("--")).map(a => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
const soloIds = rest.filter(a => !a.startsWith("--"));
if (!planArg || !["anclas", "clips", "check", "armar"].includes(fase)) { console.error("uso: node scripts/agnes_vlog.mjs <plan.json>[,plan2…] anclas|clips|check|armar [ids…] [--modo=batch|sync] [--size=WxH] [--largas] [--recheck]"); process.exit(1); }
const PLANS = planArg.split(",").map(p => JSON.parse(fs.readFileSync(p, "utf8")));
if (PLANS.length > 1 && fase !== "anclas") { console.error("varios planes sólo en `anclas` (las rondas del Batch se comparten); clips/check/armar van de a un plan"); process.exit(1); }
const ENVF = new URL("../.env", import.meta.url);
const env = Object.fromEntries(fs.readFileSync(ENVF, "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#"))
  .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = (env.AGNES_KEYS || env.AGNES_KEY || "").split(",").map(s => s.trim()).filter(Boolean);
const B = "https://apihub.agnes-ai.com/v1", ROOT = "https://apihub.agnes-ai.com", MODEL = "agnes-video-2.5-flash";
const dirsOf = P => { const DIR = P.dir.replace(/\\/g, "/").replace(/\/?$/, "/"); return { DIR, ANC: DIR + "anc/", CL: DIR + "clips/" }; };
for (const P of PLANS) { const d = dirsOf(P); fs.mkdirSync(d.ANC, { recursive: true }); fs.mkdirSync(d.CL, { recursive: true }); }
const P = PLANS[0], { DIR, ANC, CL } = dirsOf(P);
let k = Math.floor(Math.random() * Math.max(1, KS.length)); const key = () => KS[(k++) % KS.length];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const mime = f => f.endsWith(".png") ? "image/png" : /\.(mp3)$/.test(f) ? "audio/mpeg" : /\.wav$/.test(f) ? "audio/wav" : "image/jpeg";
const uri = f => `data:${mime(f)};base64,` + fs.readFileSync(f).toString("base64");
const refPathOf = (P, n) => n === "k0" ? P.k0_from : /^K\d+$/.test(n) ? dirsOf(P).ANC + n + ".png" : (P.extra || {})[n] || n;
const refPath = n => refPathOf(P, n);
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const wh = f => execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", f]).toString().trim().split(",").map(Number);

const LIGHT = " BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still. Real skin with visible pores, fine lines and natural texture, not smooth, not plastic, not retouched.";
const IDENT = " IDENTITY: the presenter must have EXACTLY the face of the man/woman in the LAST input image (a close-up of the real face): same face shape, eyes, nose, eyebrows, hair and beard, same age — copy that face, do not let it drift, do not make them younger or more attractive. The last image is only for the face; the scene comes from the first image. Do NOT add objects that are not described.";
const LOOK = " Ultra realistic casual home video, handheld phone footage with small natural shakes, BRIGHT correctly exposed image, big soft daylight from the window, neutral white balance, no grading, no vignette, no dark moody look; real skin with visible pores and fine lines, not smooth, not plastic; natural hands; nothing polished, no music.";
const SE = "The video STARTS EXACTLY on the first reference image and ENDS EXACTLY on the second reference image: the very first frame is the first image and the very last frame is the second image — same place, same framing, same light, same objects in the same places; in between, one continuous take without cutting or changing angle. The third reference image is only the presenter's real face: keep exactly that face the whole time. ";

// ---------- anclas ----------
// Palancas (feedback_gptimage_low_batch_siempre): low + Batch + 1088x608 + refs chicas. Todo medido con `usage`.
const MODO = FL.modo || env.ANCLAS_MODO || "batch";
const SIZE0 = FL.size || env.ANCLAS_SIZE || "1088x608";            // default medido (ver cabecera)
const PREV0 = FL.prev || "256x144";                                 // ancla previa / foto base: 144 tok (medido)
const sizeOf = Pl => FL.size || Pl.anclas_size || SIZE0;            // el plan puede fijar "anclas_size" / "prev_box"
const prevOf = Pl => (FL.prev || Pl.prev_box || PREV0).split("x").map(Number);
const EXTRA_BOX = (FL.extra || "512x512").split("x").map(Number);  // lámina/cara secundaria: se ve el detalle
const MAX_CHAIN = +(FL.maxchain || 15), LOTE = 70;
// $/token: tarifa completa (sync) · Batch = la mitad. Texto $5/M, imagen-entrada $8/M, imagen-salida $30/M.
const PRICE = { txt: 5e-6, img: 8e-6, out: 30e-6 };
const OUT_TOK = { "1088x608": 96, "1536x1024": 158, "1792x1008": 138, "1024x1024": 96 };
// tokens de una imagen de ENTRADA — regla que cierra con TODO lo medido (23-sep y 5-sep): si el lado largo es < 1024 se
// agranda hasta llegar a 1024 (tope ×2) y se cuentan parches de 32 px. 128x192→96 · 170x256→176 · 256x144→144 ·
// 192x108→84 · 384x216→336 · 512x288→576 · 768x432→576 · 1024x576→576 · 560x690→832 · 1536x864→1296.
function tokIn(w, h) {
  const s = Math.max(w, h) < 1024 ? Math.min(2, 1024 / Math.max(w, h)) : 1;
  return Math.ceil(Math.round(w * s) / 32) * Math.ceil(Math.round(h * s) / 32);
}
const usd = (u, batch) => { const d = u.input_tokens_details || {}; const f = batch ? 0.5 : 1;
  return f * ((d.text_tokens || 0) * PRICE.txt + (d.image_tokens || 0) * PRICE.img + (u.output_tokens || 0) * PRICE.out); };
// lo ESPERADO con las palancas de default (1088x608, K/foto base en caja 256x144, cara 96 tok, extras como vengan) en el
// modo elegido: si el real se pasa >15% es que algo se salteó (size grande, ref sin achicar, cara entera…) → aviso.
const esperado = (it, batch) => usd({ input_tokens_details: { text_tokens: Math.ceil(it.prompt.length / 4),
  image_tokens: 96 + it.a.from.reduce((s, n) => s + (n === "k0" || /^K\d+$/.test(n) ? 144 : tokIn(...wh(small(refPathOf(it.Pl, n), EXTRA_BOX, dirsOf(it.Pl).ANC)))), 0) },
  output_tokens: OUT_TOK[SIZE0] || 96 }, batch);

// ref achicada (cacheada en anc/_ref/): cabe en la caja sin deformar
function small(f, [bw, bh], ANCd) {
  const o = ANCd + "_ref/" + path.basename(f).replace(/\.[^.]+$/, "") + `_${bw}x${bh}.png`;
  if (!fs.existsSync(o) || fs.statSync(o).mtimeMs < fs.statSync(f).mtimeMs) {
    fs.mkdirSync(ANCd + "_ref", { recursive: true });
    const [w, h] = wh(f); if (w <= bw && h <= bh) fs.copyFileSync(f, o);
    else ff("-i", f, "-vf", `scale=${bw}:${bh}:force_original_aspect_ratio=decrease:flags=lanczos`, o);
  }
  return o;
}
// cara 128x192 (96 tok): crop 2:3 centrado (o `face_crop` del plan) y escala. Si ya es 128x192 se usa tal cual.
function face128(Pl) {
  const f = Pl.face, [w, h] = wh(f); if (w === 128 && h === 192) return f;
  const o = dirsOf(Pl).ANC + "_ref/_face128.png";
  if (!fs.existsSync(o) || fs.statSync(o).mtimeMs < fs.statSync(f).mtimeMs) {
    fs.mkdirSync(path.dirname(o), { recursive: true });
    let crop = Pl.face_crop;
    if (!crop) { if (w / h > 2 / 3) { const cw = Math.round(h * 2 / 3); crop = `${cw}:${h}:${Math.round((w - cw) / 2)}:0`; }
      else { const ch = Math.round(w * 1.5); crop = `${w}:${ch}:0:${Math.round((h - ch) * 0.25)}`; } }
    ff("-i", f, "-vf", `crop=${crop},scale=128:192:flags=lanczos`, o);
    log("cara de anclas →", o, `(crop ${crop}; si corta mal la cara, poné "face_crop":"w:h:x:y" en el plan)`);
  }
  return o;
}
// salida → recorte a 16:9 (1088x608 → 1080x608; 1536x1024 → 1536x864)
function to169(raw, out) {
  const [w, h] = wh(raw); let cw = w, ch = Math.round(w * 9 / 16 / 2) * 2, x = 0, y;
  if (ch > h) { ch = h; cw = Math.round(h * 16 / 9 / 2) * 2; }
  x = Math.round((w - cw) / 2); y = Math.round((h - ch) * 0.15);
  ff("-i", raw, "-vf", `crop=${cw}:${ch}:${x}:${y}`, out);
}

// grafo de anclas de TODAS las escenas; profundidad de cadena = hops desde la foto base
function construirItems() {
  const items = [];
  PLANS.forEach((Pl, pi) => {
    const ids = new Set(Pl.anchors.map(a => a.id)), byId = Object.fromEntries(Pl.anchors.map(a => [a.id, a])), depth = {};
    const dep = id => depth[id] ??= Math.max(0, ...byId[id].from.filter(n => ids.has(n)).map(n => dep(n) + 1));
    for (const a of Pl.anchors) {
      const d = dep(a.id);
      items.push({ key: `p${pi}_${a.id}`, pi, Pl, a, depth: d, out: dirsOf(Pl).ANC + a.id + ".png", deps: a.from.filter(n => ids.has(n)).map(n => dirsOf(Pl).ANC + n + ".png") });
    }
    const largas = Pl.anchors.filter(a => depth[a.id] + 1 > MAX_CHAIN); // anclas en la cadena = hops + 1
    if (largas.length) {
      const msg = `⛔ ${Pl.dir}: cadena de ${Math.max(...largas.map(a => depth[a.id])) + 1} anclas encadenadas (> ${MAX_CHAIN}): a partir de ${largas[0].id} el set y el encuadre derivan. Partila en otra escena con su propia foto base, o sacá un ancla de un K "limpio" (from:["K0",…]).`;
      if (!FL.largas) { console.error(msg + "  (`--largas` para seguir igual)"); process.exit(3); }
      log(msg.replace("⛔", "⚠️"), "— sigo por --largas");
    }
  });
  return items;
}
function prepararItem(it) { // arma inputs chicos recién cuando sus K previos existen
  const { Pl, a } = it, ANCd = dirsOf(Pl).ANC;
  it.inputs = a.from.map(n => { const f = refPathOf(Pl, n); return small(f, n === "k0" || /^K\d+$/.test(n) ? prevOf(Pl) : EXTRA_BOX, ANCd); });
  it.size = sizeOf(Pl);
  it.inputs.push(face128(Pl));
  it.prompt = a.prompt + (a.from.includes("k0") ? "" : " Everything else identical.") + IDENT + LIGHT;
  return it;
}
let gasto = 0, nimg = 0, avisos = 0;
function guardar(it, b64, usage, batch) {
  const raw = it.out.replace(".png", "_raw.png"); fs.writeFileSync(raw, Buffer.from(b64, "base64")); to169(raw, it.out);
  const c = usd(usage || {}, batch), e = esperado(it, batch); gasto += c; nimg++;
  const d = usage?.input_tokens_details || {};
  const alto = c > e * 1.15; if (alto) avisos++;
  fs.appendFileSync(dirsOf(it.Pl).ANC + "_costos.jsonl", JSON.stringify({ t: new Date().toISOString(), id: it.a.id, modo: batch ? "batch" : "sync", size: it.size, refs: it.inputs.map(f => wh(f).join("x")), usage, usd: +c.toFixed(5), esperado: +e.toFixed(5) }) + "\n");
  log(`OK ${path.basename(path.dirname(path.dirname(it.out)))}/${it.a.id} · in txt ${d.text_tokens} img ${d.image_tokens} · out ${usage?.output_tokens} · $${c.toFixed(4)}` + (alto ? ` ⚠️ MÁS CARO de lo esperado ($${e.toFixed(4)}): ¿refs grandes, size o modo?` : "") + ` · total $${gasto.toFixed(3)}`);
}

// ---- Batch por rondas ----
const OA = "https://api.openai.com/v1", H = () => ({ Authorization: "Bearer " + env.OPENAI_API_KEY });
async function oa(p, opt = {}) { const r = await fetch(OA + p, { ...opt, headers: { ...H(), ...(opt.headers || {}) } }); const t = await r.text(); if (!r.ok) throw new Error(`${r.status} ${p} :: ${t.slice(0, 300)}`); return JSON.parse(t); }
const PEND = ANC + "_batch_pendiente.json"; // para retomar sin volver a pagar si el proceso se corta mientras espera
async function submitLote(lote) {
  const jsonl = lote.map(it => JSON.stringify({ custom_id: it.key, method: "POST", url: "/v1/images/edits",
    body: { model: "gpt-image-2", prompt: it.prompt, size: it.size, quality: "low", n: 1, images: it.inputs.map(f => ({ image_url: uri(f) })) } })).join("\n") + "\n";
  const fd = new FormData(); fd.append("purpose", "batch"); fd.append("file", new Blob([jsonl], { type: "application/jsonl" }), "anclas.jsonl");
  const file = await oa("/files", { method: "POST", body: fd });
  const b = await oa("/batches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input_file_id: file.id, endpoint: "/v1/images/edits", completion_window: "24h" }) });
  log(`batch ${b.id} · ${lote.length} anclas · JSONL ${(jsonl.length / 1048576).toFixed(1)} MB`);
  return b.id;
}
async function esperarYBajar(ids, porKey) {
  const t0 = Date.now(); let last = "";
  for (;;) {
    const bs = await Promise.all(ids.map(id => oa("/batches/" + id)));
    const s = bs.map(b => `${b.status} ${b.request_counts?.completed || 0}/${b.request_counts?.total || 0}`).join(" · ");
    if (s !== last) { log(`  ${Math.round((Date.now() - t0) / 1000)}s ·`, s); last = s; }
    const malos = bs.filter(b => ["failed", "expired", "cancelled"].includes(b.status));
    if (malos.length) throw new Error("batch " + malos.map(b => b.id + " " + b.status + " " + JSON.stringify(b.errors || {}).slice(0, 200)).join(" | "));
    if (bs.every(b => b.status === "completed")) { for (const b of bs) await bajar(b, porKey); return; }
    await sleep(20000);
  }
}
async function bajar(b, porKey) { // stremeado por línea (el JSONL con base64 revienta un string entero)
  let n = 0;
  for (const fid of [b.output_file_id, b.error_file_id].filter(Boolean)) {
    const res = await fetch(`${OA}/files/${fid}/content`, { headers: H() }); if (!res.ok) throw new Error("no pude bajar " + fid + " " + res.status);
    for await (const ln of readline.createInterface({ input: Readable.fromWeb(res.body), crlfDelay: Infinity })) {
      if (!ln.trim()) continue; n++;
      const r = JSON.parse(ln), it = porKey[r.custom_id], bd = r.response?.body, b64 = bd?.data?.[0]?.b64_json;
      if (!it) continue;
      if (b64) guardar(it, b64, bd.usage, true);
      else { it.fallas = (it.fallas || 0) + 1; log("✗", r.custom_id, JSON.stringify(bd?.error || r.error || {}).slice(0, 200)); }
    }
  }
  if (!n) throw new Error(`batch ${b.id}: 0 líneas leídas (no midió)`);
}
async function anclasBatch(items) {
  const porKey = Object.fromEntries(items.map(it => [it.key, it]));
  if (fs.existsSync(PEND)) { const pend = JSON.parse(fs.readFileSync(PEND, "utf8")); log("retomo batch pendiente", pend.join(" "));
    items.filter(it => !fs.existsSync(it.out)).forEach(prepararItem); await esperarYBajar(pend, porKey); fs.unlinkSync(PEND); }
  for (let ronda = 1; ; ronda++) {
    const pend = items.filter(it => !fs.existsSync(it.out));
    if (!pend.length) return;
    const listos = pend.filter(it => it.deps.every(f => fs.existsSync(f)));
    const muertos = listos.filter(it => (it.fallas || 0) >= 3);
    if (muertos.length) throw new Error("anclas que fallaron 3 veces: " + muertos.map(it => it.key).join(" "));
    if (!listos.length) throw new Error("anclas trabadas (dependen de refs que no existen): " + pend.map(it => it.key).join(" "));
    log(`RONDA ${ronda}: ${listos.length} anclas (${[...new Set(listos.map(it => it.a.id))].join(" ")}) de ${PLANS.length} escena(s) · faltan ${pend.length}`);
    listos.forEach(prepararItem);
    const ids = [];
    for (let i = 0; i < listos.length; i += LOTE) ids.push(await submitLote(listos.slice(i, i + LOTE)));
    fs.writeFileSync(PEND, JSON.stringify(ids));
    await esperarYBajar(ids, porKey); fs.unlinkSync(PEND);
  }
}

// ---- respaldo síncrono: cola global + limitador de imágenes de ENTRADA por minuto ----
const LIM = +(process.env.IMG_PER_MIN || env.IMG_PER_MIN || 5), used = [];
async function slot(n) { // si UNA sola ancla trae más imágenes que el límite, pasa sola con la ventana vacía (antes se colgaba)
  for (;;) { const now = Date.now(); while (used.length && now - used[0] > 61000) used.shift();
    if (used.length + n <= LIM || used.length === 0) { for (let i = 0; i < n; i++) used.push(now); return; } await sleep(1000); }
}
async function editSync(it) {
  for (let t = 0; t < 40; t++) {
    await slot(it.inputs.length);
    const fd = new FormData();
    fd.append("model", "gpt-image-2"); fd.append("quality", "low"); fd.append("size", it.size); fd.append("prompt", it.prompt);
    for (const f of it.inputs) fd.append("image[]", new Blob([fs.readFileSync(f)], { type: mime(f) }), path.basename(f));
    let j = {};
    try { j = await (await fetch(OA + "/images/edits", { method: "POST", signal: AbortSignal.timeout(300000), headers: H(), body: fd })).json(); } catch (e) { j = { error: { message: e.message } }; }
    const b = j?.data?.[0]?.b64_json;
    if (b) return guardar(it, b, j.usage, false);
    const m = j?.error?.message || JSON.stringify(j); const w = +(m.match(/try again in ([\d.]+)s/) || [])[1];
    if (/safety|moderation|invalid|billing|hard limit/i.test(m) && t >= 2) throw new Error(it.key + ": " + m.slice(0, 200));
    log("retry", it.key, m.slice(0, 110)); await sleep((w ? w * 1000 : 15000) + 1500);
  }
  throw new Error("falló " + it.key);
}
async function anclasSync(items) {
  const W = +(process.env.WORKERS || env.WORKERS || 3), enVuelo = new Set();
  await Promise.all(Array.from({ length: W }, async () => {
    for (;;) {
      const pend = items.filter(it => !fs.existsSync(it.out) && !enVuelo.has(it.key));
      if (!pend.length) return;
      const it = pend.find(it => it.deps.every(f => fs.existsSync(f)));
      if (!it) { if (!enVuelo.size) throw new Error("anclas trabadas: " + pend.map(i => i.key).join(" ")); await sleep(1000); continue; }
      enVuelo.add(it.key); try { await editSync(prepararItem(it)); } finally { enVuelo.delete(it.key); }
    }
  }));
}
if (fase === "anclas") {
  const items = construirItems(), falta = items.filter(it => !fs.existsSync(it.out));
  log(`${falta.length}/${items.length} anclas por hacer · modo ${MODO}${MODO === "sync" ? ` (el DOBLE que batch; ${LIM} img de entrada/min)` : ""} · size ${[...new Set(PLANS.map(sizeOf))].join("/")} · refs ${[...new Set(PLANS.map(Pl => prevOf(Pl).join("x")))].join("/")} + cara 128x192`);
  if (MODO === "sync") await anclasSync(items); else await anclasBatch(items);
  log(`anclas listas · ${nimg} nuevas · $${gasto.toFixed(3)} (≈$${(gasto / Math.max(1, nimg)).toFixed(4)}/img)` + (avisos ? ` · ⚠️ ${avisos} más caras de lo esperado (mirá anc/_costos.jsonl)` : "") + " → mirá la hoja: identidad igual en todas, sin objetos colados");
}

// ---------- clips ----------
function tramo(c) { // audio rellenado a segundo entero → mp3
  const T = Math.min(12, Math.max(4, Math.ceil(dur(c.audio) + 0.15)));
  const mp3 = CL + c.id + "_tramo.mp3"; ff("-i", c.audio, "-af", `apad=whole_dur=${T}`, "-t", String(T), "-ac", "1", "-ar", "44100", "-b:a", "160k", mp3);
  return { T, mp3 };
}
async function gen(id, body) {
  let vid;
  for (let t = 0; t < 200 && !vid; t++) {
    const j = await (await fetch(B + "/videos", { method: "POST", headers: { Authorization: "Bearer " + key(), "Content-Type": "application/json" }, body: JSON.stringify({ model: MODEL, size: "720P", aspect_ratio: "16:9", ...body }) })).json().catch(() => ({}));
    vid = j.video_id || j.id;
    if (!vid) { const m = JSON.stringify(j); if (!/queue|rate/i.test(m)) { log("REJECT", id, m.slice(0, 200)); return; } await sleep(25000 + Math.random() * 10000); }
  }
  if (!vid) return log("GAVE UP", id);
  log("en cola", id);
  const t0 = Date.now();
  while (Date.now() - t0 < 40 * 60e3) {
    await sleep(15000);
    const g = await (await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}&model_name=${MODEL}`, { headers: { Authorization: "Bearer " + key() } })).json().catch(() => ({}));
    if (g.status === "completed" && g.url) { fs.writeFileSync(CL + id + ".mp4", Buffer.from(await (await fetch(g.url)).arrayBuffer())); return log("OK", id, Math.round((Date.now() - t0) / 1000) + "s"); }
    if (/fail|error|cancel/i.test(g.status || "")) return log("FAIL", id, JSON.stringify(g).slice(0, 200));
  }
  log("TIMEOUT", id);
}
const state = () => fs.existsSync(CL + "state.json") ? JSON.parse(fs.readFileSync(CL + "state.json", "utf8")) : {};
const PRON = P.pronoun || "he";
const MUTE = ` When the reference audio ends ${PRON} stops talking and keeps the mouth closed.`;            // anti-balbuceo del relleno
const MUTE_LINE = " After saying that line they stop talking and keep the mouth closed.";
if (fase === "clips") {
  const sel = P.clips.filter(c => !soloIds.length || soloIds.includes(c.id));
  await Promise.all(sel.map((c, i) => sleep(i * 3000).then(async () => {
    const out = soloIds.length ? c.id + "r" + Date.now().toString(36).slice(-3) : c.id;
    const imgs = [uri(refPath(c.a)), uri(refPath(c.b)), uri(P.face), ...(c.refs || []).map(n => uri(refPath(n)))];
    let body, T;
    if (c.audio) {
      const tr = tramo(c); T = tr.T;
      body = { mode: "reference", seconds: String(T), images: imgs, audios: [uri(tr.mp3)],
        prompt: SE + "The presenter is the one speaking: the voice and every word are exactly the reference audio, lips perfectly synced; do not add, repeat or change any word — the audio is the only speech. " + c.action + LOOK + " No other voices." + MUTE };
    } else {
      T = c.secs;
      body = { mode: "reference", seconds: String(T), images: imgs,
        prompt: SE + `The person speaking is ${c.who || "the other person (last reference image is their face)"}, ${c.voice}, lips perfectly synced, saying exactly: "${c.line}" Nobody else speaks. ` + c.action + LOOK + MUTE_LINE };
    }
    await gen(out, body);
    if (fs.existsSync(CL + out + ".mp4")) { const s = state(); s[c.id] = { file: out + ".mp4", T, own: !c.audio }; fs.writeFileSync(CL + "state.json", JSON.stringify(s, null, 1)); }
  })));
  log("clips listos → corré `check`");
}


// visión GRATIS con agnes-3.0-flash (23-sep: 4/4 en identidad, 1-3 s por imagen) — identidad + luz de un cuadro
async function vision(frameJpg, facePng) {
  const q = 'Image 1 is a reference face. Image 2 is a video frame. Is the presenter (the man/woman of image 1) present in image 2 with the SAME identity (not just similar clothes)? Is the image bright daylight, not dark or moody? Answer ONLY JSON: {"same_person":true/false,"confidence":0-1,"bright":true/false,"issues":"short"}';
  for (let t = 0; t < 3; t++) try {
    const j = await (await fetch(B + "/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + key(), "Content-Type": "application/json" }, signal: AbortSignal.timeout(60000),
      body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: q }, { type: "image_url", image_url: { url: uri(facePng) } }, { type: "image_url", image_url: { url: uri(frameJpg) } }] }] }) })).json();
    return JSON.parse(j.choices[0].message.content.replace(/```json|```/g, "").trim());
  } catch (e) { await sleep(3000); }
  return null;
}

// ---------- check ----------
// Puntaje por versión (menor = mejor): palabras de más + faltantes + repetidas; +50 cara/luz mal; +100 sin transcripción.
// El historial (clips/check_hist.json) junta TODAS las versiones medidas de cada clip y state.json queda con la MEJOR
// (en tfbgrietas la última regeneración a veces era peor que la anterior y el runner se quedaba con la última).
if (fase === "check") {
  const st = state(); const fr = (f, t, o) => { ff("-ss", t.toFixed(3), "-i", f, "-frames:v", "1", "-vf", "scale=320:180,format=gray", "-f", "rawvideo", o); return fs.readFileSync(o); };
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zñ0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const HF = CL + "check_hist.json", hist = fs.existsSync(HF) ? JSON.parse(fs.readFileSync(HF, "utf8")) : {};
  let prevEnd = null;
  for (const c of P.clips) {
    const s = st[c.id]; if (!s) { log("FALTA", c.id); prevEnd = null; continue; }
    const f = CL + s.file;
    let h = !FL.recheck && hist[c.id]?.[s.file];
    if (!h) {
      const wav = CL + c.id + "_chk.wav"; ff("-i", f, "-vn", "-ac", "1", "-ar", "16000", "-t", String(s.T), wav);
      const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", P.lang || "es"); fd.append("response_format", "text");
      fd.append("file", new Blob([fs.readFileSync(wav)], { type: "audio/wav" }), "a.wav");
      let txt = "(timeout)";
      for (let t = 0; t < 3 && txt === "(timeout)"; t++) try { txt = await (await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd, signal: AbortSignal.timeout(45000) })).text(); } catch (e) { log("whisper timeout, reintento", c.id); }
      const esperadoTxt = c.text || c.line || "";
      const NUM = /^(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|veinte|treinta|cuarenta|cincuenta|cien)$/;
      const wa = norm(esperadoTxt).split(" ").filter(w => w && !NUM.test(w)), b = norm(txt).split(" ").filter(w => w && !NUM.test(w));
      const a = new Set(wa), extra = b.filter(w => !a.has(w)), falta = [...a].filter(w => !b.includes(w));
      const rep = b.length - wa.length; // palabras de más aunque existan (frases repetidas)
      const mid = CL + c.id + "_mid.jpg"; ff("-ss", (s.T / 2).toFixed(2), "-i", f, "-frames:v", "1", "-vf", "scale=768:-2", mid);
      const v = await vision(mid, P.face);
      const vis = !v ? " · visión: sin respuesta" : ` · cara ${v.same_person ? "✓" : "⛔ NO ES"} (${v.confidence}) · luz ${v.bright ? "✓" : "⛔ oscura"}${v.issues && !/^none/i.test(v.issues) ? " · " + v.issues : ""}`;
      const malVis = v && (!v.same_person || !v.bright);
      const score = extra.length + falta.length + Math.max(0, rep) + (malVis ? 50 : 0) + (txt === "(timeout)" ? 100 : 0);
      const verd = extra.length + falta.length > 2 || rep > 2 || txt === "(timeout)" || malVis ? "⛔ REGENERAR" : rep > 0 ? "⚠️ revisar" : "ok";
      h = { score, verd, line: `dice: "${txt.trim()}"` + (extra.length ? ` · de más: ${extra.join(" ")}` : "") + (falta.length ? ` · falta: ${falta.join(" ")}` : "") + (rep > 0 ? ` · ${rep} palabra(s) de más (¿repitió?)` : "") + vis };
      (hist[c.id] ||= {})[s.file] = h; fs.writeFileSync(HF, JSON.stringify(hist, null, 1));
    }
    const start = fr(f, 0, CL + "_s.raw"), end = fr(f, s.T - 0.04, CL + "_e.raw");
    let costura = ""; if (prevEnd) { let d = 0; for (let i = 0; i < start.length; i++) d += Math.abs(start[i] - prevEnd[i]); costura = ` · costura con el anterior ${(d / start.length).toFixed(1)}/255`; }
    prevEnd = end;
    const vers = Object.keys(hist[c.id] || {}).length;
    log(`${c.id} [${s.file}] ${h.verd} (puntaje ${h.score}${vers > 1 ? `, ${vers} versiones` : ""}) · ${h.line}` + costura);
  }
  // quedarse con la MEJOR versión existente de cada clip
  let cambios = 0;
  for (const [cid, vers] of Object.entries(hist)) {
    if (!st[cid]) continue;
    const best = Object.entries(vers).filter(([fn]) => fs.existsSync(CL + fn)).sort((x, y) => x[1].score - y[1].score)[0];
    const cur = vers[st[cid].file];
    if (best && best[0] !== st[cid].file && (!cur || best[1].score < cur.score)) { log(`↩ ${cid}: me quedo con ${best[0]} (puntaje ${best[1].score}) en vez de ${st[cid].file} (${cur ? cur.score : "sin medir"})`); st[cid].file = best[0]; cambios++; }
  }
  if (cambios) fs.writeFileSync(CL + "state.json", JSON.stringify(st, null, 1));
  log("⛔ = el modelo cambió palabras → `clips <id>` y volvé a `check` (queda la MEJOR versión, no la última). Costura >30 → mirá esos 2 cuadros.");
}

// ---------- armar ----------
if (fase === "armar") {
  const st = state(), X = 0.1, C = P.clips.map(c => ({ ...c, ...st[c.id] }));
  if (C.some(c => !c.file)) throw new Error("faltan clips");
  const parts = C.map((c, i) => { const o = CL + `_aud${i}.wav`; ff("-i", c.own ? CL + c.file : c.audio, "-vn", "-t", String(c.T), "-af", `apad=whole_dur=${c.T}`, "-ac", "1", "-ar", "48000", o); return o; });
  fs.writeFileSync(CL + "_aud.txt", parts.map(p => `file '${path.basename(p)}'\n`).join(""));
  ff("-f", "concat", "-safe", "0", "-i", CL + "_aud.txt", "-c", "copy", CL + "_audio_total.wav");
  const ins = [], fl = [];
  // tpad clona el último cuadro: si el clip dura EXACTAMENTE T, sin él el xfade se queda sin los 0,1 s de solape y se corre todo
  C.forEach((c, i) => { const L = c.T + (i < C.length - 1 ? X : 0); ins.push("-i", CL + c.file);
    fl.push(`[${i}:v]fps=30,scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=1,trim=duration=${L.toFixed(3)},setpts=PTS-STARTPTS[v${i}]`); });
  let prev = "v0", off = 0;
  for (let i = 1; i < C.length; i++) { off += C[i - 1].T; fl.push(`[${prev}][v${i}]xfade=transition=fade:duration=${X}:offset=${off.toFixed(3)}[x${i}]`); prev = `x${i}`; }
  ff(...ins, "-i", CL + "_audio_total.wav", "-filter_complex", fl.join(";"), "-map", `[${prev}]`, "-map", `${C.length}:a`,
    "-r", "30", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", P.out);
  log("OK", P.out, dur(P.out).toFixed(2) + "s (30 fps, 1920x1080) — hoja de contactos antes de usarlo");
}
