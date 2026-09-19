// rksmart_av_job.mjs — el avatar de rksmart: InfiniteTalk por el endpoint PÚBLICO de RunPod.
//   node _v3/rksmart_av_job.mjs
//
// ⛔⛔ RUNPOD SIEMPRE, NUNCA VAST (regla del creador). UN solo /run con TODAS las ventanas visibles
//    y `policy.executionTimeout` alto. Sólo si el mp4 vuelve más corto que el audio (cap ~600 s)
//    va un 2º /run con la cola, cortada en un BORDE DE VENTANA.
// ⛔⛔ EL HEADER MIENTE: la duración real es la del ÚLTIMO FRAME DE VIDEO, no `format=duration`.
//    Medido en fapiel60: header 134,16 s y los frames terminaban en 51,04 s.
// ⛔ El job id se persiste: un corte NO vuelve a pagar. Y un job ANTERIOR al audio actual no sirve
//    (avatar lipsincado contra otra locución) → se olvida.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { supaCreds } from "../scripts/supa_creds.mjs";

const A = "_v3/rksmart/av";
const JOBS = `${A}/jobs.json`;
const KEY = (fs.readFileSync(".env", "utf8").match(/^RUNPOD_API_KEY\s*=\s*(.*)$/m) || [])[1]?.trim();
if (!KEY) throw new Error("falta RUNPOD_API_KEY en .env");
const H = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const dur = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).match(/[\d.]+/)[0];
/** El ÚLTIMO FRAME REAL de video. Ésta es la verdad; el header miente. */
const ultimoFrame = (f) => {
  const o = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "frame=best_effort_timestamp_time", "-of", "csv=p=0", f], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const ls = o.trim().split("\n").filter(Boolean);
  return +(ls.at(-1) || "0").replace(/,/g, "");
};

async function hostear(nombre, local, ct) {
  const { U, K } = supaCreds();
  const obj = `tmp_avatar/rksmart_${nombre}`;
  const r = await fetch(`${U}/storage/v1/object/thumbnails/${obj}`, {
    method: "POST", headers: { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": ct, "x-upsert": "true" },
    body: fs.readFileSync(local), signal: AbortSignal.timeout(900_000),
  });
  if (!r.ok) throw new Error(`subida ${nombre}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const url = `${U}/storage/v1/object/public/thumbnails/${obj}`;
  const h = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(60_000) });
  if (h.status !== 200) throw new Error(`${nombre} no quedó público (${h.status})`);
  console.log(`  hosteado ${nombre} · ${h.headers.get("content-length")} B`);
  return { url, borrar: () => fetch(`${U}/storage/v1/object/thumbnails/${obj}`, { method: "DELETE", headers: { apikey: K, Authorization: `Bearer ${K}` } }).catch(() => {}) };
}

async function job(parte, faceLocal, audioLocal, outMp4) {
  const jobs = fs.existsSync(JOBS) ? JSON.parse(fs.readFileSync(JOBS, "utf8")) : {};
  const audioMs = fs.statSync("public/rksmart.wav").mtimeMs;
  if (jobs[parte] && !(jobs[parte].ts >= audioMs)) { console.log(`  olvido el job ${parte}: es anterior al audio actual`); delete jobs[parte]; }
  let borrar = [];
  if (!jobs[parte]?.id) {
    const f = await hostear(`face_${parte}.jpg`, faceLocal, "image/jpeg");
    const a = await hostear(`audio_${parte}.wav`, audioLocal, "audio/wav");
    borrar = [f, a];
    const body = {
      input: {
        prompt: "A calm older man speaks naturally to the camera in his locksmith workshop, small natural head movements, steady realistic daylight",
        image: f.url, audio: a.url, size: "480p",
      },
      policy: { executionTimeout: 7_200_000 },
    };
    const r = await fetch("https://api.runpod.ai/v2/infinitetalk/run", { method: "POST", headers: H, body: JSON.stringify(body), signal: AbortSignal.timeout(120_000) });
    const t = await r.text();
    if (!r.ok) { for (const b of borrar) await b.borrar(); throw new Error(`RunPod /run ${r.status}: ${t.slice(0, 300)}`); }
    jobs[parte] = { id: JSON.parse(t).id, ts: Date.now() };
    fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
    console.log(`  RunPod ${parte}: JOB ${jobs[parte].id}`);
  } else console.log(`  RunPod ${parte}: retomo JOB ${jobs[parte].id} (no se vuelve a pagar)`);

  let st;
  try {
    for (let k = 0; k < 700; k++) {
      await sleep(k ? 30_000 : 8_000);
      try { st = await (await fetch(`https://api.runpod.ai/v2/infinitetalk/status/${jobs[parte].id}`, { headers: H, signal: AbortSignal.timeout(60_000) })).json(); }
      catch (e) { console.log(`  poll: ${e.message}`); continue; }
      if (k % 6 === 0) console.log(`  [${new Date().toISOString().slice(11, 19)}] ${parte}: ${st.status}`);
      if (!["IN_QUEUE", "IN_PROGRESS", "RUNNING"].includes(st.status)) break;   // desconocido = terminal
    }
  } finally { for (const b of borrar) await b.borrar(); }
  if (st?.status !== "COMPLETED") {
    delete jobs[parte]; fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
    throw new Error(`RunPod ${parte}: ${st?.status} ${JSON.stringify(st?.error || "").slice(0, 300)}`);
  }
  const mp4 = await fetch(st.output.result, { signal: AbortSignal.timeout(3_600_000) });
  fs.writeFileSync(outMp4, Buffer.from(await mp4.arrayBuffer()));
  jobs[parte].costo = st.output?.cost ?? 0.25; jobs[parte].hecho = true;
  fs.writeFileSync(JOBS, JSON.stringify(jobs, null, 1));
}

const reelWav = `${A}/reel.wav`, reelSec = dur(reelWav);
const face = `${A}/face_ref.jpg`;
console.log(`REEL ${reelSec.toFixed(2)} s · referencia ${face} (plano MEDIO 16:9 — un crop apretado sale GIGANTE)`);

const p1 = `${A}/parte1.mp4`;
if (!fs.existsSync(p1) || fs.statSync(p1).mtimeMs < fs.statSync("public/rksmart.wav").mtimeMs) await job("parte1", face, reelWav, p1);
const d1h = dur(p1), d1 = ultimoFrame(p1);
console.log(`parte1: header ${d1h.toFixed(2)} s · ÚLTIMO FRAME REAL ${d1.toFixed(2)} s · pedido ${reelSec.toFixed(2)} s`);

const W = JSON.parse(fs.readFileSync("_v3/rksmart_windows.json", "utf8"));
const reel = `${A}/reel.mp4`;
if (d1 >= reelSec - 0.5) {
  fs.copyFileSync(p1, reel);
} else {
  const corte = Math.max(...W.map((w) => w.reel_off).filter((o) => o <= d1 - 0.3));
  if (!(corte > 0)) throw new Error(`parte1 volvió con ${d1.toFixed(1)} s y no hay borde de ventana antes`);
  console.log(`parte1 corta (cap de RunPod) → 2º /run SÓLO con la cola desde ${corte.toFixed(2)} s`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(corte), "-i", reelWav, "-c:a", "pcm_s16le", `${A}/cola.wav`]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", p1, "-t", String(corte), "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-an", `${A}/parte1_trim.mp4`]);
  const p2 = `${A}/parte2.mp4`;
  if (!fs.existsSync(p2)) await job("parte2", face, `${A}/cola.wav`, p2);
  const d2 = ultimoFrame(p2), d2p = dur(`${A}/cola.wav`);
  console.log(`parte2: ÚLTIMO FRAME REAL ${d2.toFixed(2)} s · pedido ${d2p.toFixed(2)} s`);
  if (d2 < d2p - 0.5) throw new Error(`⛔ la COLA también volvió truncada (${d2.toFixed(1)}/${d2p.toFixed(1)}) — hay que pedir otra cola`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", `${A}/parte1_trim.mp4`, "-i", p2, "-filter_complex",
    "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", reel]);
}

const dr = ultimoFrame(reel);
console.log(`REEL final: último frame real ${dr.toFixed(2)} s · faltante ${(reelSec - dr).toFixed(3)} s`);
if (reelSec - dr > 2 / 30 + 0.02 && reelSec - dr <= 0.6) {
  console.log("  faltante bajo el umbral de cola: clono el último cuadro");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", reel, "-vf", `tpad=stop_mode=clone:stop_duration=${(reelSec - dr + 0.05).toFixed(3)}`,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-an", `${A}/reel_pad.mp4`]);
  fs.renameSync(`${A}/reel_pad.mp4`, reel);
}
const costo = Object.values(JSON.parse(fs.readFileSync(JOBS, "utf8"))).reduce((a, j) => a + (+j.costo || 0), 0);
console.log(`MEDIDO: reel ${ultimoFrame(reel).toFixed(2)} s de ${reelSec.toFixed(2)} s pedidos · jobs ${Object.keys(JSON.parse(fs.readFileSync(JOBS, "utf8"))).length} · costo US$${costo.toFixed(2)}`);
