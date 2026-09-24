// agnes_vlog.mjs — "VLOG CONTINUO": el presentador HACIENDO algo en su set, hablando con SU voz, en tomas
// continuas sin cortes. Validado 23-sep-2026 (1:02 Federer mascarilla de arroz; tfbgrietas 151 clips: v1 18:34 → v2 17:29,9 con el armado nuevo).
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
//   node scripts/agnes_vlog.mjs <plan.json> check    → por clip, SÓLO sobre lo que se muestra (el largo real del tramo):
//        whisper-1 vs texto (lo que balbucea en la cola silenciosa no cuenta) + ⛔ LABIOS: correlación de envolvente audio
//        propio del clip vs tramo ≥ 0,8 y |lag| ≤ 0,1 s (en tfbgrietas v1 11 clips movían la boca con OTRA frase; sobre T
//        entero falla por el balbuceo; planos `detail` excluidos) + saltos de POSE dentro del clip (media móvil de 12
//        cuadros, ⛔ ≥ 7,5) + costuras cortada/entera + visión. Guarda HISTORIAL por clip (clips/check_hist.json, con el
//        puntaje de labios adentro) y deja en state.json la MEJOR versión por puntaje, no la última.
//   node scripts/agnes_vlog.mjs <plan.json> armar    → receta tfbgrietas v2 (el creador vio la v1: "lagazos de voces,
//        cortes malos"): voz = MÁSTER continuo (tramos tal cual, NUNCA el relleno a segundo entero); cada clip a 1x cortado
//        al largo REAL de su tramo; sólo si esa costura salta (> max(entera+4, 12)/255) se ACELERA la cola silenciosa
//        (tope 2,5x → ≤2,7x con el redondeo) en vez de cortar; costura ≥ 15/255 o entrando/saliendo de un `detail` = CORTE
//        LIMPIO (fundido entre poses distintas = cara fantasma), fundido 0,1 s sólo entre poses casi iguales; `overrides`
//        por clip (mode/maxSpeed/cut/fade/trimTo/coverFrom, ver § armar). Salida 30 fps CFR 1920x1080 bt709 con audio +
//        audio_<out>.wav + timeline_<out>.json (start = voz, vstart = video de cada clip). Lee state.json + state_det.json.
//   (clips/check aceptan ids: `clips c4 c7` regenera sólo esos, con sufijo r; `check --recheck` re-mide todo;
//    check/armar `--out=<dir>` escriben todo ahí y sólo LEEN la carpeta del plan; `--overrides=<json>` o plan.overrides
//    o <dir>/overrides.json)
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
// · clip con `audio` → PARA GENERAR se rellena con silencio hasta segundo ENTERO (agnes pide segundos enteros 4-12) y va
//   como audios[]. Ese relleno NUNCA se oye ni se ve: `armar` corta el clip al largo real del tramo. Al final del prompt va
//   SIEMPRE "When the reference audio ends he stops talking and keeps the mouth closed" (sin eso `mode:"reference"`
//   inventa palabras en el silencio del relleno).
// · clip con `detail:true` (plano detalle keyframe d1→d2, en clips/state_det.json): sin labios, corte limpio a los dos lados.
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

// ---------- medidas compartidas por check y armar (portadas de tfbgrietas _v3/v2: vend.py, seams.py, sync.py, jumps2.py) ----------
// `--out=<dir>`: check/armar escriben TODO (historial, state, intermedios, mp4, wav, timeline) en esa carpeta y sólo LEEN
// la del plan (para probar/rearmar sin tocar el worktree de otro).
const WORK = FL.out ? String(FL.out).replace(/\\/g, "/").replace(/\/?$/, "/") : CL;
if (FL.out) fs.mkdirSync(WORK, { recursive: true });
const J = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
const stateDet = () => J(CL + "state_det.json");        // planos `detail` (keyframe d1→d2) van aparte
const ffo = (...a) => execFileSync("ffmpeg", ["-v", "error", ...a], { maxBuffer: 1 << 28 });
function pcm(f, T) { // mono 16 kHz float; con T: rellena/corta a T (como load() de sync.py)
  const a = ["-i", f, "-vn", "-ac", "1", "-ar", "16000"]; if (T) a.push("-af", `apad=whole_dur=${T}`, "-t", String(T));
  const b = ffo(...a, "-f", "s16le", "-"), x = new Float32Array(b.length >> 1);
  for (let i = 0; i < x.length; i++) x[i] = b.readInt16LE(2 * i) / 32768;
  return x;
}
const r3 = v => Math.round(v * 1000) / 1000, r2 = v => Math.round(v * 100) / 100, r1 = v => Math.round(v * 10) / 10;
// fin REAL de la voz en el tramo (−38 dB bajo el pico, ventanas de 10 ms) y largo del tramo sin relleno
const _vf = {};
function vozFin(f) {
  if (_vf[f]) return _vf[f];
  const x = pcm(f), n = Math.floor(x.length / 160), e = new Float64Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let j = i * 160; j < i * 160 + 160; j++) s += x[j] * x[j]; e[i] = 20 * Math.log10(Math.sqrt(s / 160) + 1e-7); }
  const th = Math.max(...e) - 38; let a = 0, b = n - 1; while (a < n && e[a] <= th) a++; while (b > 0 && e[b] <= th) b--;
  return (_vf[f] = { len: r3(x.length / 16000), vs: r2(a * 0.01), ve: r2((b + 1) * 0.01) });
}
// compuerta de LABIOS: correlación de la envolvente (log RMS 10 ms) del audio PROPIO del clip vs el tramo, sólo sobre
// los primeros L s (lo que se muestra), mejor lag en ±3 s. Pasa con corr ≥ 0,8 y |lag| ≤ 0,1 s.
function envol(x) { const n = Math.floor(x.length / 160), e = new Float64Array(n);
  for (let i = 0; i < n; i++) { let s = 0; for (let j = i * 160; j < i * 160 + 160; j++) s += x[j] * x[j]; e[i] = Math.log10(Math.sqrt(s / 160 + 1e-9) + 1e-4); } return e; }
function pearson(a, ao, b, bo, m) { let sa = 0, sb = 0; for (let i = 0; i < m; i++) { sa += a[ao + i]; sb += b[bo + i]; }
  const ma = sa / m, mb = sb / m; let num = 0, da = 0, db = 0;
  for (let i = 0; i < m; i++) { const u = a[ao + i] - ma, v = b[bo + i] - mb; num += u * v; da += u * u; db += v * v; }
  return da && db ? num / Math.sqrt(da * db) : 0; }
const LAB_CORR = 0.8, LAB_LAG = 0.1;
function labios(clip, tramoWav, L) {
  const a = envol(pcm(clip, L)), b = envol(pcm(tramoWav, L)), n = Math.min(a.length, b.length);
  let best = [-2, 0];
  for (let lag = -300; lag <= 300; lag++) { const m = n - Math.abs(lag); if (m < 100) continue;
    const c = lag >= 0 ? pearson(a, lag, b, 0, m) : pearson(a, 0, b, -lag, m); if (c > best[0]) best = [c, lag]; }
  const corr = r3(best[0]), lag = r2(best[1] * 0.01);
  return { corr, lag, c0: r3(pearson(a, 0, b, 0, n)), ok: corr >= LAB_CORR && Math.abs(lag) <= LAB_LAG };
}
// cuadro gris 160x90 en t (seek de entrada, como seams.py) y diferencia media 0-255
function gris(f, t) { try { const b = ffo("-ss", Math.max(0, t).toFixed(3), "-i", f, "-frames:v", "1", "-vf", "scale=160:90,format=gray", "-f", "rawvideo", "-"); return b.length === 14400 ? b : null; } catch { return null; } }
const difG = (a, b) => { if (!a || !b) return null; let d = 0; for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]); return r1(d / a.length); };
// costuras de cada clip con el siguiente: `trunc` = cortado al largo del tramo (L−0,034) · `orig` = entero (T−0,08)
function costuras(C, dirClips) {
  const cf = WORK + "_costuras.json", cache = J(cf);
  const R = C.map((c, i) => { const n = C[i + 1], f = dirClips + c.file, L = c.len;
    const k = `${c.file}|${n ? n.file : "-"}|${L}|${c.T}`; if (cache[k]) return cache[k];
    const nx = n ? gris(dirClips + n.file, 0) : null, eL = gris(f, L - 0.034), eT = gris(f, c.T - 0.08);
    return (cache[k] = { trunc: difG(eL, nx), orig: difG(eT, nx), tail_motion: difG(eL, eT) }); });
  fs.writeFileSync(cf, JSON.stringify(cache, null, 0)); return R;
}
// saltos de POSE dentro del clip (jumps2.py): dif. cuadro a cuadro 160x90 a 30 fps (24→30 duplica cuadros: por eso media
// móvil de 12), sólo sobre la parte que se muestra, sin 6 cuadros de cada borde. ⛔ pico ≥ 7,5 (umbral del auditor v2).
const SALTO = 7.5;
function saltos(f, L) {
  const b = ffo("-t", L.toFixed(3), "-i", f, "-vf", "fps=30,scale=160:90,format=gray", "-f", "rawvideo", "-"), N = Math.floor(b.length / 14400);
  if (N < 24) return null;
  const d = new Float64Array(N - 1);
  for (let k = 1; k < N; k++) { let s = 0; const o = k * 14400; for (let i = 0; i < 14400; i++) s += Math.abs(b[o + i] - b[o - 14400 + i]); d[k - 1] = s / 14400; }
  const r = Array.from(d, (_, i) => { let s = 0; for (let j = i - 6; j <= i + 5; j++) if (j >= 0 && j < d.length) s += d[j]; return s / 12; }); // np.convolve 'same'
  const seg = r.slice(6, r.length - 6); if (seg.length < 10) return null;
  let im = 0; seg.forEach((v, i) => { if (v > seg[im]) im = i; });
  const med = [...seg].sort((x, y) => x - y)[seg.length >> 1];
  return { t: r2((6 + im) / 30), peak: r1(seg[im]), base: r1(med), ratio: r1(seg[im] / Math.max(med, 0.5)) };
}
function overrides() { // {id:{mode:"acc"|"trunc", maxSpeed, cut, fade, trimTo, coverFrom}} — FL.overrides > plan.overrides > <dir>/overrides.json
  if (FL.overrides) return J(String(FL.overrides));
  if (typeof P.overrides === "string") return J(P.overrides);
  return P.overrides || J(DIR + "overrides.json");
}

// ---------- check ----------
// Puntaje por versión (menor = mejor): palabras de más + faltantes + repetidas; +50 cara/luz mal; +50 LABIOS mal
// (corr < 0,8 o |lag| > 0,1 s); +100 sin transcripción. Whisper y labios se miden SÓLO sobre lo que se muestra (el largo
// del tramo; `own` = T entero): lo que agnes balbucea en la cola silenciosa no se ve ni se oye, no marca REGENERAR.
// Planos `detail`: sin whisper ni labios (suena el tramo del máster), sí saltos y costura.
// El historial (clips/check_hist.json) junta TODAS las versiones medidas de cada clip y state.json queda con la MEJOR.
if (fase === "check") {
  const stM = state(), stD = stateDet(), st = { ...stM, ...stD }, O = overrides();
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const HF = WORK + "check_hist.json", hist = fs.existsSync(HF) ? J(HF) : J(CL + "check_hist.json");
  const C = P.clips.filter(c => st[c.id]).map(c => ({ ...c, ...st[c.id] }));
  for (const c of C) c.len = c.own || !c.audio ? c.T : vozFin(c.audio).len;
  const SE_ = costuras(C, CL);
  const falta = P.clips.filter(c => !st[c.id]).map(c => c.id); if (falta.length) log("FALTAN", falta.join(" "));
  let nLab = 0, nSal = 0;
  for (const [i, c] of C.entries()) {
    const f = CL + c.file, win = c.len;
    let h = !FL.recheck && hist[c.id]?.[c.file];
    if (h && h.win !== win) h = null; // medido con la ventana vieja (T entero) → re-medir
    if (!h) {
      h = { win };
      if (c.detail) { h.score = 0; h.verd = "detalle"; h.line = "plano detalle (sin whisper/labios)"; }
      else {
        const wav = WORK + c.id + "_chk.wav"; ff("-i", f, "-vn", "-ac", "1", "-ar", "16000", "-t", win.toFixed(3), wav);
        const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", P.lang || "es"); fd.append("response_format", "text");
        fd.append("file", new Blob([fs.readFileSync(wav)], { type: "audio/wav" }), "a.wav");
        let txt = "(timeout)";
        for (let t = 0; t < 3 && txt === "(timeout)"; t++) try { txt = await (await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd, signal: AbortSignal.timeout(45000) })).text(); } catch (e) { log("whisper timeout, reintento", c.id); }
        const esperadoTxt = c.text || c.line || "";
        const NUM = /^(\d+|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|veinte|treinta|cuarenta|cincuenta|cien)$/;
        const wa = norm(esperadoTxt).split(" ").filter(w => w && !NUM.test(w)), b = norm(txt).split(" ").filter(w => w && !NUM.test(w));
        const a = new Set(wa), extra = b.filter(w => !a.has(w)), faltan = [...a].filter(w => !b.includes(w));
        const rep = b.length - wa.length;
        const mid = WORK + c.id + "_mid.jpg"; ff("-ss", (win / 2).toFixed(2), "-i", f, "-frames:v", "1", "-vf", "scale=768:-2", mid);
        const v = await vision(mid, P.face);
        const vis = !v ? " · visión: sin respuesta" : ` · cara ${v.same_person ? "✓" : "⛔ NO ES"} (${v.confidence}) · luz ${v.bright ? "✓" : "⛔ oscura"}${v.issues && !/^none/i.test(v.issues) ? " · " + v.issues : ""}`;
        const malVis = v && (!v.same_person || !v.bright);
        const lb = c.audio && !c.own ? labios(f, c.audio, win) : null; h.labios = lb;
        const malLab = lb && !lb.ok;
        h.score = extra.length + faltan.length + Math.max(0, rep) + (malVis ? 50 : 0) + (malLab ? 50 : 0) + (txt === "(timeout)" ? 100 : 0);
        h.verd = extra.length + faltan.length > 2 || rep > 2 || txt === "(timeout)" || malVis || malLab ? "⛔ REGENERAR" : rep > 0 ? "⚠️ revisar" : "ok";
        h.line = `dice: "${txt.trim()}"` + (extra.length ? ` · de más: ${extra.join(" ")}` : "") + (faltan.length ? ` · falta: ${faltan.join(" ")}` : "") + (rep > 0 ? ` · ${rep} palabra(s) de más (¿repitió?)` : "") + vis
          + (lb ? ` · labios ${lb.ok ? "✓" : "⛔"} corr ${lb.corr} lag ${lb.lag}s` : "");
      }
    }
    // saltos sólo sobre lo que se VE: trimTo/coverFrom del override recortan la parte mostrada (barato: se re-mide si cambia)
    const o = O[c.id] || {}, swin = Math.min(win, o.trimTo ?? Infinity, o.coverFrom ?? Infinity);
    if (h.swin !== swin) { h.swin = swin; h.salto = saltos(f, swin); }
    (hist[c.id] ||= {})[c.file] = h; fs.writeFileSync(HF, JSON.stringify(hist, null, 1));
    if (h.labios && !h.labios.ok) nLab++;
    const sj = h.salto, s = SE_[i];
    const sal = !sj ? "" : sj.peak >= SALTO ? (nSal++, ` · ⛔ SALTO de pose en ${sj.t}s${swin < win ? ` (mirando ${swin}s por override)` : ""} (pico ${sj.peak}, base ${sj.base}): regenerar suele repetirlo → tapalo con un detalle (override coverFrom)`) : sj.peak >= 6 && sj.ratio >= 3 ? ` · ⚠️ ráfaga en ${sj.t}s (pico ${sj.peak}, ×${sj.ratio})` : "";
    const cos = C[i + 1] && s.trunc != null ? ` · costura al siguiente ${s.trunc}/255 cortado${s.orig != null ? `, ${s.orig} entero` : ""}` : "";
    const vers = Object.keys(hist[c.id] || {}).length;
    log(`${c.id}${c.detail ? " (detalle)" : ""} [${c.file}] ${h.verd} (puntaje ${h.score}${vers > 1 ? `, ${vers} versiones` : ""}) · ${h.line}` + sal + cos);
  }
  // quedarse con la MEJOR versión existente de cada clip (state.json o state_det.json según dónde esté)
  let cM = 0, cD = 0;
  for (const [cid, vers] of Object.entries(hist)) {
    const tgt = stD[cid] ? stD : stM[cid] ? stM : null; if (!tgt) continue;
    const best = Object.entries(vers).filter(([fn]) => fs.existsSync(CL + fn)).sort((x, y) => x[1].score - y[1].score)[0];
    const cur = vers[tgt[cid].file];
    if (best && best[0] !== tgt[cid].file && (!cur || best[1].score < cur.score)) { log(`↩ ${cid}: me quedo con ${best[0]} (puntaje ${best[1].score}) en vez de ${tgt[cid].file} (${cur ? cur.score : "sin medir"})`); tgt[cid].file = best[0]; tgt === stD ? cD++ : cM++; }
  }
  if (cM) fs.writeFileSync(WORK + "state.json", JSON.stringify(stM, null, 1));
  if (cD) fs.writeFileSync(WORK + "state_det.json", JSON.stringify(stD, null, 1));
  if ((cM || cD) && FL.out) log(`(--out: la mejor versión quedó en ${WORK}state*.json; el state del plan NO se tocó)`);
  log(`labios mal: ${nLab} · saltos de pose ⛔: ${nSal}. ⛔ REGENERAR = cambió palabras o labios de otra frase → \`clips <id>\` y volvé a \`check\` (queda la MEJOR versión, no la última). Costura ≥15 → armar corta limpio; >30 → mirá esos 2 cuadros.`);
}

// ---------- armar ----------
// La voz es el MÁSTER continuo: los tramos se concatenan tal cual, SIN el relleno a segundo entero con el que se generó el
// clip (en tfbgrietas v1 ese relleno eran 74 s de silencio = pausa antinatural cada ~7 s + balbuceo). Cada clip hablado va a
// 1x y se corta al largo REAL de su tramo. Sólo si esa costura cortada SALTA (dif. > max(entera + 4, 12)/255) y el siguiente
// no es detalle, la cola silenciosa (fin de voz → T) se ACELERA (tope 2,5x; con el redondeo a cuadros queda ≤2,7x) en vez
// de cortar, agregando sólo la pausa mínima. Costura ≥15/255, o entrando/saliendo de un `detail` → CORTE LIMPIO (fundido
// entre poses distintas = cara fantasma); fundido 0,1 s sólo entre poses casi iguales. `own` (personaje con su línea) = T
// entero con su audio. Fronteras acumuladas en cuadros (sin deriva). Salida 30 fps CFR 1920x1080 bt709 + audio_<x>.wav +
// timeline_<x>.json (inicio de cada clip: start = voz, vstart = video).
// overrides {id:{…}}: mode "acc"|"trunc" (forzar) · maxSpeed (tope de aceleración) · cut/fade (costura con el ANTERIOR) ·
//   trimTo s (usa sólo los primeros s del clip, estirados en cámara lenta) · coverFrom s (el clip se corta en s y el
//   SIGUIENTE —un detalle— arranca antes, en cámara lenta, tapando p. ej. un giro brusco).
if (fase === "armar") {
  const st = { ...state(), ...stateDet() }, O = overrides(), FPS = 30, X = 0.1, MAXS = 2.5, CUT = 15;
  const C = P.clips.map(c => ({ ...c, ...st[c.id] }));
  const miss = C.filter(c => !c.file).map(c => c.id); if (miss.length) throw new Error("faltan clips: " + miss.join(" "));
  const base = path.basename(P.out).replace(/\.[^.]+$/, ""), OUT = FL.out ? WORK + path.basename(P.out) : P.out, OD = path.dirname(OUT).replace(/\\/g, "/") + "/";
  const TMP = WORK + "_armar/"; fs.mkdirSync(TMP, { recursive: true });
  for (const c of C) { if (c.own || !c.audio) { c.own = true; c.len = c.T; c.ve = c.T; } else { const v = vozFin(c.audio); c.len = v.len; c.ve = Math.min(v.ve + 0.04, v.len); } }
  const S = costuras(C, CL);
  for (const [i, c] of C.entries()) {
    const o = O[c.id] || {}, s = S[i];
    if (c.own) { c.mode = "own"; c.d = c.T; continue; }
    let mode = o.mode || "trunc";
    if (!o.mode && !c.detail && s.trunc != null && s.orig != null && s.trunc > Math.max(s.orig + 4, 12) && !(C[i + 1] || {}).detail) mode = "acc";
    c.mode = mode;
    if (mode === "acc") { const W = Math.max(c.len - c.ve, (c.T - c.ve) / (o.maxSpeed || MAXS)); c.d = c.ve + W; } else c.d = c.len;
  }
  C.forEach((c, i) => { const n = C[i + 1]; if (!n) return; const s = S[i]; const eff = c.mode === "acc" ? s.orig : s.trunc;
    c.cutNext = !!((O[n.id] || {}).cut || c.detail || n.detail || eff == null || eff >= CUT); if ((O[n.id] || {}).fade) c.cutNext = false; });
  C.forEach(c => c.vd = c.d);
  C.forEach((c, i) => { const o = O[c.id] || {}; if (o.coverFrom != null && C[i + 1] && C[i + 1].detail) { C[i + 1].vd += c.d - o.coverFrom; c.vd = o.coverFrom; c.cutNext = true; } });
  let cum = 0, cv = 0; const Bf = [0], Bv = [0]; for (const c of C) { cum += c.d; Bf.push(Math.round(cum * FPS)); cv += c.vd; Bv.push(Math.round(cv * FPS)); }
  C.forEach((c, i) => { c.nf = Bv[i + 1] - Bv[i]; c.start = Bf[i] / FPS; c.adur = (Bf[i + 1] - Bf[i]) / FPS; c.src = (O[c.id] || {}).trimTo ?? c.T;
    c.slow = (c.vd > c.d + 0.01 || c.src < c.vd) ? +(Math.min(c.src, c.vd) / c.vd).toFixed(3) : undefined; });
  // audio: tramo tal cual (+ la pausa mínima si acc); own = su audio a T
  const parts = C.map((c, i) => { const o = TMP + `aud${i}.wav`, D = c.d.toFixed(4);
    ff("-i", c.own ? CL + c.file : c.audio, "-vn", "-af", `apad=whole_dur=${D}`, "-t", D, "-ac", "1", "-ar", "48000", o); return o; });
  fs.writeFileSync(TMP + "aud.txt", parts.map(p => `file '${path.basename(p)}'\n`).join(""));
  const AUD = OD + `audio_${base}.wav`; ff("-f", "concat", "-safe", "0", "-i", TMP + "aud.txt", "-c", "copy", AUD);
  // video
  const ins = [], fl = [];
  C.forEach((c, i) => {
    const xn = i < C.length - 1 ? (c.cutNext ? 1 : Math.round(X * FPS)) : 0; c.xn = xn; ins.push("-i", CL + c.file);
    // tpad clona el último cuadro (clips que vienen justo en T o más cortos que lo pedido)
    const post = `fps=${FPS},scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=2,trim=end_frame=${c.nf + xn},setpts=PTS-STARTPTS[v${i}]`;
    if (c.mode === "acc") {
      const a = Math.round(c.ve * FPS), tailF = c.nf - a, sp = (c.T - a / FPS) / (tailF / FPS);
      fl.push(`[${i}:v]split[a${i}][b${i}]`, `[a${i}]trim=0:${(a / FPS).toFixed(4)},setpts=PTS-STARTPTS[p${i}]`,
        `[b${i}]trim=${(a / FPS).toFixed(4)}:${c.T},setpts=(PTS-STARTPTS)/${sp.toFixed(4)}[q${i}]`, `[p${i}][q${i}]concat=n=2:v=1:a=0,${post}`);
      c.speed = +sp.toFixed(3);
    } else if (c.slow) fl.push(`[${i}:v]trim=0:${c.src},setpts=(PTS-STARTPTS)/${c.slow},${post}`);
    else fl.push(`[${i}:v]${post}`);
  });
  // corte limpio = xfade de 1 cuadro (sin fundido visible); fundido = 3 cuadros (0,1 s)
  let prev = "v0";
  for (let i = 1; i < C.length; i++) { const x = C[i - 1].xn; fl.push(`[${prev}][v${i}]xfade=transition=fade:duration=${(x / FPS).toFixed(4)}:offset=${(Bv[i] / FPS).toFixed(4)}[x${i}]`); prev = `x${i}`; }
  fs.writeFileSync(TMP + "graph.txt", fl.join(";\n"));
  ff(...ins, "-i", AUD, "-/filter_complex", TMP + "graph.txt", "-map", `[${prev}]`, "-map", `${C.length}:a`, "-r", String(FPS), "-fps_mode", "cfr",
    "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-bsf:v", "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0", // sin esto quedan "unknown"
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT);
  const tl = C.map((c, i) => ({ id: c.id, file: c.file, start: +c.start.toFixed(4), T: c.T, dur: +c.adur.toFixed(4), vstart: +(Bv[i] / FPS).toFixed(4), vdur: +(c.nf / FPS).toFixed(4), mode: c.mode, speed: c.speed, slow: c.slow, cut: c.cutNext || undefined, detail: c.detail || undefined, text: c.text }));
  fs.writeFileSync(OD + `timeline_${base}.json`, JSON.stringify(tl, null, 1));
  const nfr = +execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", OUT]).toString().trim();
  const pad = C.filter(c => !c.own).reduce((a, c) => a + (c.d - c.len), 0);
  log(`OK ${OUT} ${dur(OUT).toFixed(2)}s · cuadros ${nfr}/${Bv.at(-1)}${nfr !== Bv.at(-1) ? " ⛔ NO COINCIDEN" : " ✓"} · audio ${dur(AUD).toFixed(2)}s · cortes limpios ${C.filter(c => c.cutNext).length}/${C.length - 1}`
    + ` · acc ${C.filter(c => c.mode === "acc").map(c => c.id + "@" + c.speed).join(" ") || "-"} · silencio agregado ${pad.toFixed(2)}s — hoja de contactos antes de usarlo`);
}
