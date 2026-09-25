// agnes-studio — UI local para generar videos con agnes-video-2.5 (y 2.5-flash, GRATIS en promo).
//
//   npm run agnes            → abre http://localhost:5178
//   PORT=6000 npm run agnes  → otro puerto
//
// Sin dependencias: node:http + fetch. Las claves salen de AGNES_KEYS en .env (NUNCA en el repo,
// que es PÚBLICO). Las referencias (fotos/audios/video) se suben al bucket público de Supabase
// (`thumbnails/tmp_agnes/`) porque la API de agnes sólo acepta URLs públicas, y se borran cuando
// el job termina. Los mp4 quedan en out/agnes-studio/ (ignorado por git) y el historial en jobs.json.
//
// Comportamiento de la API medido el 25-sep-2026:
//  · POST /v1/videos {model, mode: text|keyframe|reference, prompt, seconds "4".."12", size, aspect_ratio}
//  · GET  /agnesapi?video_id=…&model_name=… → {status queued|pending|in_progress|completed|failed, progress 0-100, url}
//  · "video_queue_full" es GLOBAL del free tier (no de la clave): se reintenta solo, no es un fallo.
//  · agnes-video-2.5 (pro) cobra; con las claves free devuelve "insufficient_user_quota".
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "out", "agnes-studio");
const JOBS_FILE = path.join(OUT, "jobs.json");
const PORT = Number(process.env.PORT || 5178);
fs.mkdirSync(OUT, { recursive: true });

// ---------- env ----------
const env = {};
for (const f of [".env", ".env.local"]) {
  try {
    for (const l of fs.readFileSync(path.join(ROOT, f), "utf8").split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Z_0-9]+)\s*=\s*(.*)$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
}
const E = (k) => process.env[k] || env[k] || "";
const KEYS = (E("AGNES_KEYS") || E("AGNES_API_KEY")).split(",").map((s) => s.trim()).filter(Boolean);
const BASE = E("AGNES_BASE_URL") || "https://apihub.agnes-ai.com/v1";
const API_ROOT = BASE.replace(/\/v1\/?$/, "");
const SUPA_URL = (E("NEXT_PUBLIC_SUPABASE_URL") || E("SUPABASE_URL")).replace(/\/$/, "");
const SUPA_KEY = E("SUPABASE_SERVICE_ROLE_KEY");
if (!KEYS.length) { console.error("⛔ faltan AGNES_KEYS en .env"); process.exit(1); }

const COOLDOWN = 62_000;      // 1 envío/min por clave
const QUEUE_RETRY = 8_000;    // cola global llena → reintentar pronto con la próxima clave
const POLL_MS = 3_000;       // vuelta del motor (envíos)
const STATUS_EVERY = 8_000;  // cada cuánto se consulta el estado de CADA job (agnes da 429 si te pasás)
const MAX_WAIT = 30 * 60_000;
const log = (...a) => console.log(new Date().toLocaleTimeString(), ...a);

// ---------- estado ----------
let jobs = [];
try { jobs = JSON.parse(fs.readFileSync(JOBS_FILE, "utf8")); } catch {}
// un job que quedó "enviando" al cortar el server vuelve a la cola
for (const j of jobs) if (j.status === "submitting") j.status = "waiting";
const save = () => fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 1));
const keyFree = KEYS.map(() => 0);
const keyTag = (i) => `#${i + 1}`;
const pickKey = () => {
  const now = Date.now();
  let best = -1, t = Infinity;
  for (let i = 0; i < KEYS.length; i++) if (keyFree[i] < t) { t = keyFree[i]; best = i; }
  return t <= now ? best : -1;
};

// ---------- Supabase (hosting de referencias) ----------
const MIME = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".m4a": "audio/mp4", ".ogg": "audio/ogg",
  ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
};
async function hostear(buf, name, ct) {
  if (!SUPA_URL || !SUPA_KEY) throw new Error("no hay credenciales de Supabase en .env.local: pegá una URL pública en vez de subir el archivo");
  const ext = path.extname(name).toLowerCase() || "";
  const obj = `tmp_agnes/${Date.now()}_${crypto.randomBytes(4).toString("hex")}${ext}`;
  const r = await fetch(`${SUPA_URL}/storage/v1/object/thumbnails/${obj}`, {
    method: "POST", body: buf, signal: AbortSignal.timeout(600_000),
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": ct || MIME[ext] || "application/octet-stream", "x-upsert": "true" },
  });
  if (!r.ok) throw new Error(`subida a Supabase: ${r.status} ${(await r.text()).slice(0, 160)}`);
  return { url: `${SUPA_URL}/storage/v1/object/public/thumbnails/${obj}`, obj };
}
async function borrarHosteados(job) {
  // una tanda (cantidad > 1) comparte las mismas referencias: sólo se borra lo que ningún job vivo usa
  const vivos = new Set(jobs.filter((x) => x !== job && x.status !== "completed").flatMap((x) => x.hosted || []));
  for (const obj of job.hosted || []) {
    if (vivos.has(obj)) continue;
    await fetch(`${SUPA_URL}/storage/v1/object/thumbnails/${obj}`, {
      method: "DELETE", headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    }).catch(() => {});
  }
  job.hosted = [];
}

// ---------- body de agnes ----------
function buildBody(p) {
  const b = { model: p.model, mode: p.mode, prompt: p.prompt, seconds: String(p.seconds), size: p.size, aspect_ratio: p.aspect_ratio };
  if (p.seed !== "" && p.seed != null && !Number.isNaN(Number(p.seed))) b.seed = Number(p.seed);
  if (p.mode === "keyframe") {
    if (p.first_frame) b.first_frame = p.first_frame;
    if (p.last_frame) b.last_frame = p.last_frame;
  }
  if (p.mode === "reference") {
    if (p.images?.length) b.images = p.images;
    if (p.audios?.length) b.audios = p.audios;
    if (p.video?.url) b.videos = [{ url: p.video.url, start_seconds: Number(p.video.start_seconds || 0), require_audio: !!p.video.require_audio }];
  }
  return b;
}
function validar(p) {
  if (!p.prompt?.trim()) return "falta el prompt";
  const s = Number(p.seconds);
  if (!(s >= 4 && s <= 12)) return "la duración va de 4 a 12 s";
  if (p.mode === "keyframe" && !p.first_frame && !p.last_frame) return "modo keyframe: poné al menos el primer o el último cuadro";
  if (p.mode === "reference") {
    const n = (p.images?.length || 0) + (p.audios?.length || 0) + (p.video?.url ? 1 : 0);
    if (!n) return "modo referencia: adjuntá al menos una imagen, audio o video";
    if ((p.images?.length || 0) > 8) return "máximo 8 imágenes de referencia";
    if ((p.audios?.length || 0) > 3) return "máximo 3 audios de referencia";
    if (n > 12) return "máximo 12 referencias en total";
  }
  if (!["text", "keyframe", "reference"].includes(p.mode)) return "modo inválido";
  return null;
}

// ---------- motor: envío con rotación de claves + polling ----------
async function trySubmit(job) {
  const ki = pickKey();
  if (ki < 0) return;
  job.status = "submitting";
  job.attempts = (job.attempts || 0) + 1;
  try {
    const r = await fetch(`${BASE}/videos`, {
      method: "POST", signal: AbortSignal.timeout(90_000),
      headers: { Authorization: `Bearer ${KEYS[ki]}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildBody(job.params)),
    });
    const j = await r.json().catch(() => ({}));
    const vid = j.video_id || j.id;
    if (vid) {
      keyFree[ki] = Date.now() + COOLDOWN;
      Object.assign(job, { status: j.status || "queued", video_id: vid, key: ki, progress: j.progress ?? 0, submitted_at: Date.now(), note: "" });
      log(`→ ${job.id} enviado con clave ${keyTag(ki)} (${vid})`);
      return save();
    }
    const code = j.code || j.error?.code || "";
    const msg = j.message || j.error?.message || JSON.stringify(j).slice(0, 200);
    if (/queue_full|queue is full/i.test(code + msg)) {
      keyFree[ki] = Date.now() + QUEUE_RETRY;
      Object.assign(job, { status: "waiting", note: `cola de agnes llena, reintentando (intento ${job.attempts})` });
    } else if (/rate.?limit|too many/i.test(code + msg)) {
      keyFree[ki] = Date.now() + COOLDOWN;
      Object.assign(job, { status: "waiting", note: `clave ${keyTag(ki)} en su minuto de espera, pruebo otra` });
    } else if (/insufficient_user_quota|quota/i.test(code + msg)) {
      // la clave no tiene saldo para este modelo: probamos las demás antes de rendirnos
      job.noQuota = [...new Set([...(job.noQuota || []), ki])];
      keyFree[ki] = Date.now() + COOLDOWN;
      if (job.noQuota.length >= KEYS.length) fail(job, `ninguna clave tiene saldo para ${job.params.model} (usá agnes-video-2.5-flash, que es gratis)`);
      else Object.assign(job, { status: "waiting", note: `clave ${keyTag(ki)} sin saldo para ${job.params.model}, pruebo otra` });
    } else {
      fail(job, `agnes rechazó el pedido: ${code ? code + " · " : ""}${msg}`);
    }
  } catch (e) {
    Object.assign(job, { status: "waiting", note: `error de red (${String(e.message).slice(0, 80)}), reintentando` });
    if (job.attempts > 400) fail(job, "demasiados intentos sin poder enviar");
  }
  save();
}
function fail(job, why) {
  Object.assign(job, { status: "failed", error: why, note: "", finished_at: Date.now() });
  log(`✗ ${job.id}: ${why}`);
  // las referencias NO se borran al fallar: "Reintentar" las necesita. Se borran al quitar el job.
}

async function poll(job) {
  if (Date.now() < (job.nextPoll || 0)) return;
  job.nextPoll = Date.now() + STATUS_EVERY;
  try {
    const q = `video_id=${encodeURIComponent(job.video_id)}&model_name=${encodeURIComponent(job.params.model)}`;
    // las consultas de estado también tienen límite por clave (429): se reparten entre todas
    const ki = Math.floor(Math.random() * KEYS.length);
    const r = await fetch(`${API_ROOT}/agnesapi?${q}`, {
      headers: { Authorization: `Bearer ${KEYS[ki]}` }, signal: AbortSignal.timeout(45_000),
    });
    const s = await r.json().catch(() => ({}));
    // sin `status` = respuesta de error de la API (429, 5xx…): transitorio, NO es que el video falló
    if (!s.status) {
      if (r.status === 429 || /too many/i.test(JSON.stringify(s))) job.nextPoll = Date.now() + STATUS_EVERY * 2;
      return;
    }
    // agnes manda `progress` y a veces `internal_progress` más fino: se muestra el mayor
    const pr = Math.max(Number(s.progress) || 0, Number(s.internal_progress) || 0);
    if (pr > (job.progress || 0)) job.progress = pr;
    job.status = s.status;
    if (s.started_at && !job.started_at) job.started_at = s.started_at * 1000;
    if (s.url) {
      job.remote_url = s.url;
      job.status = "downloading";
      save();
      const v = await fetch(s.url, { signal: AbortSignal.timeout(300_000) });
      if (!v.ok) throw new Error(`descarga ${v.status}`);
      const file = `${job.id}.mp4`;
      fs.writeFileSync(path.join(OUT, file), Buffer.from(await v.arrayBuffer()));
      Object.assign(job, { status: "completed", progress: 100, file, finished_at: Date.now(), note: "" });
      log(`✓ ${job.id} listo → out/agnes-studio/${file}`);
      await borrarHosteados(job);
    } else if (s.status === "failed") {
      const e = s.error;
      fail(job, `agnes: ${typeof e === "string" ? e : e?.message || JSON.stringify(e || "falló sin decir por qué")}`);
    } else if (Date.now() - job.submitted_at > MAX_WAIT) {
      fail(job, "timeout: agnes no lo terminó en 30 min");
    }
  } catch { /* transitorio: próxima vuelta */ }
  save();
}

let busy = false;
setInterval(async () => {
  if (busy) return;
  busy = true;
  try {
    for (const j of jobs.filter((x) => x.status === "waiting")) await trySubmit(j);
    // cualquier estado no terminal de agnes (queued, pending, in_progress, …) se sigue consultando
    await Promise.all(jobs.filter((x) => x.video_id && !["waiting", "submitting", "completed", "failed"].includes(x.status)).map(poll));
  } finally { busy = false; }
}, POLL_MS);

// ---------- http ----------
const send = (res, code, obj, type = "application/json") => {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(type === "application/json" ? JSON.stringify(obj) : obj);
};
const readBody = (req, limit = 120 * 1024 * 1024) => new Promise((ok, ko) => {
  const chunks = []; let n = 0;
  req.on("data", (c) => { n += c.length; if (n > limit) { ko(new Error("archivo demasiado grande")); req.destroy(); } else chunks.push(c); });
  req.on("end", () => ok(Buffer.concat(chunks)));
  req.on("error", ko);
});
const publicJob = (j) => {
  const { hosted, noQuota, ...rest } = j;
  return { ...rest, key: j.key != null ? keyTag(j.key) : null };
};

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  try {
    if (req.method === "GET" && u.pathname === "/") {
      return send(res, 200, fs.readFileSync(path.join(HERE, "index.html")), "text/html; charset=utf-8");
    }
    if (req.method === "GET" && u.pathname === "/api/info") {
      return send(res, 200, { keys: KEYS.length, supabase: !!(SUPA_URL && SUPA_KEY), out: path.relative(ROOT, OUT) });
    }
    if (req.method === "GET" && u.pathname === "/api/jobs") {
      return send(res, 200, jobs.slice().reverse().map(publicJob));
    }
    if (req.method === "POST" && u.pathname === "/api/upload") {
      const name = decodeURIComponent(u.searchParams.get("name") || "file");
      const buf = await readBody(req);
      const h = await hostear(buf, name, req.headers["content-type"]);
      return send(res, 200, h);
    }
    if (req.method === "POST" && u.pathname === "/api/jobs") {
      const p = JSON.parse((await readBody(req, 1e6)).toString("utf8"));
      const err = validar(p);
      if (err) return send(res, 400, { error: err });
      const job = {
        id: `ag_${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}_${crypto.randomBytes(2).toString("hex")}`,
        params: { ...p, hosted: undefined }, hosted: p.hosted || [],
        status: "waiting", progress: 0, created_at: Date.now(), attempts: 0, note: "en cola local",
      };
      jobs.push(job); save();
      log(`+ ${job.id} ${p.model} ${p.mode} ${p.seconds}s ${p.size} ${p.aspect_ratio}`);
      return send(res, 200, publicJob(job));
    }
    let m;
    if (req.method === "POST" && (m = u.pathname.match(/^\/api\/jobs\/([\w-]+)\/(retry|cancel)$/))) {
      const job = jobs.find((x) => x.id === m[1]);
      if (!job) return send(res, 404, { error: "no existe" });
      if (m[2] === "retry") Object.assign(job, { status: "waiting", error: null, video_id: null, progress: 0, attempts: 0, noQuota: [], note: "reintento manual" });
      else if (["waiting", "submitting"].includes(job.status)) { fail(job, "cancelado"); }
      else return send(res, 400, { error: "ya se envió a agnes: no se puede cancelar allá, sólo dejar de mirarlo (borralo)" });
      save();
      return send(res, 200, publicJob(job));
    }
    if (req.method === "DELETE" && (m = u.pathname.match(/^\/api\/jobs\/([\w-]+)$/))) {
      const i = jobs.findIndex((x) => x.id === m[1]);
      if (i < 0) return send(res, 404, { error: "no existe" });
      const [job] = jobs.splice(i, 1);
      await borrarHosteados(job);
      if (u.searchParams.get("file") === "1" && job.file) fs.rmSync(path.join(OUT, job.file), { force: true });
      save();
      return send(res, 200, { ok: true });
    }
    if (req.method === "GET" && (m = u.pathname.match(/^\/videos\/([\w-]+\.mp4)$/))) {
      const f = path.join(OUT, m[1]);
      if (!fs.existsSync(f)) return send(res, 404, { error: "no está" });
      const size = fs.statSync(f).size;
      const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
      if (range) {
        const a = range[1] ? +range[1] : 0, z = range[2] ? +range[2] : size - 1;
        res.writeHead(206, { "Content-Type": "video/mp4", "Content-Range": `bytes ${a}-${z}/${size}`, "Accept-Ranges": "bytes", "Content-Length": z - a + 1 });
        return fs.createReadStream(f, { start: a, end: z }).pipe(res);
      }
      res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": size, "Accept-Ranges": "bytes" });
      return fs.createReadStream(f).pipe(res);
    }
    send(res, 404, { error: "ruta desconocida" });
  } catch (e) {
    send(res, 500, { error: String(e.message || e) });
  }
});
server.listen(PORT, () => {
  log(`agnes-studio → http://localhost:${PORT}  ·  ${KEYS.length} claves  ·  Supabase ${SUPA_URL && SUPA_KEY ? "OK" : "NO (sólo URLs)"}`);
  // link para el celular (misma red wifi que la PC)
  const lan = Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => i.address);
  for (const ip of lan) log(`📱 desde el celu (mismo wifi): http://${ip}:${PORT}`);
});
