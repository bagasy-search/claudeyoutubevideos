// UN /run RunPod InfiniteTalk con el reel de ventanas visibles. Reanudable (job id persistido).
import fs from "node:fs";
import { supaCreds } from "../../scripts/supa_creds.mjs";
const dir = "_v3/famarioneta_av";
const JOBS = `${dir}/jobs.json`;
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => [l.split("=")[0], l.slice(l.indexOf("=") + 1).trim()]));
const H = { Authorization: `Bearer ${env.RUNPOD_API_KEY}`, "Content-Type": "application/json" };
const parte = process.argv[2] || "parte1";
const audio = process.argv[3] || `${dir}/reel.wav`;
const jobs = fs.existsSync(JOBS) ? JSON.parse(fs.readFileSync(JOBS, "utf8")) : {};
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const { U, K } = supaCreds();
const up = async (nombre, local, ct) => {
  const obj = `tmp_avatar/famarioneta_${nombre}`;
  const r = await fetch(`${U}/storage/v1/object/thumbnails/${obj}`, { method: "POST", headers: { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": ct, "x-upsert": "true" }, body: fs.readFileSync(local), signal: AbortSignal.timeout(600000) });
  if (!r.ok) throw new Error(`subida ${nombre}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const url = `${U}/storage/v1/object/public/thumbnails/${obj}`;
  const h = await fetch(url, { method: "HEAD" });
  if (h.status !== 200) throw new Error(`${nombre} no público ${h.status}`);
  log("hosteado", nombre, h.headers.get("content-length"));
  return url;
};
if (!jobs[parte]?.id) {
  const img = await up(`face_${parte}.png`, "public/ref_famarioneta.png", "image/png");
  const aud = await up(`audio_${parte}.wav`, audio, "audio/wav");
  const body = { input: { prompt: "A friendly doctor talks expressively to the camera, lively natural head movement, expressive hand gestures, warm facial expressions, realistic lighting, sharp focus on the face.", image: img, audio: aud, size: "720p" }, policy: { executionTimeout: 7200000 } };
  const r = await fetch("https://api.runpod.ai/v2/infinitetalk/run", { method: "POST", headers: H, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
  const t = await r.text();
  if (!r.ok) { console.error("⛔ /run", r.status, t.slice(0, 300)); process.exit(1); }
  jobs[parte] = { id: JSON.parse(t).id, ts: Date.now() };
  fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
  log("JOB", jobs[parte].id);
} else log("retomando JOB", jobs[parte].id);
let st;
for (let k = 0; k < 400; k++) {
  await new Promise((r) => setTimeout(r, k ? 60000 : 10000));
  try { st = await (await fetch(`https://api.runpod.ai/v2/infinitetalk/status/${jobs[parte].id}`, { headers: H, signal: AbortSignal.timeout(45000) })).json(); } catch (e) { log("poll", e.message); continue; }
  if (k % 5 === 0) log(st.status, st.executionTime || "");
  if (["COMPLETED", "FAILED", "CANCELLED", "TIMED_OUT"].includes(st.status)) break;
}
if (st?.status !== "COMPLETED") { console.error("⛔", st?.status, JSON.stringify(st?.error || "").slice(0, 300)); process.exit(1); }
const mp4 = await fetch(st.output.result, { signal: AbortSignal.timeout(1800000) });
fs.writeFileSync(`${dir}/${parte}_raw.mp4`, Buffer.from(await mp4.arrayBuffer()));
jobs[parte].costo = st.output?.cost; jobs[parte].hecho = true; jobs[parte].result = st.output.result;
fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
log("✓ bajado", `${dir}/${parte}_raw.mp4`, "costo", st.output?.cost);
for (const n of [`face_${parte}.png`, `audio_${parte}.wav`]) await fetch(`${U}/storage/v1/object/thumbnails/tmp_avatar/famarioneta_${n}`, { method: "DELETE", headers: { apikey: K, Authorization: `Bearer ${K}` } }).catch(() => {});
