// 55_avatar — InfiniteTalk por RunPod PÚBLICO (nunca Vast), SÓLO las ventanas visibles.
// Regla del creador: UN /run con todo el visible; si el mp4 vuelve más corto que el audio (cap ~600 s),
// recién ahí un 2º /run SÓLO con la cola, cortando en un borde de ventana. Sin pad que corra el lipsync.
// Inputs servidos desde el bucket público de Supabase (subirlos a GitHub rebotó con 403) y borrados al final.
// Los job ids se persisten: un corte NO vuelve a pagar un job.
import fs from "node:fs";
import path from "node:path";
import { run, durSec } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { withLease } from "../lib/lease.mjs";
import { BlockedError, esSinCredito } from "../lib/budget.mjs";
import { sleep, pool } from "../lib/phase.mjs";
import { ROOT, env } from "../lib/env.mjs";

export function ventanas(mom, plan, totalSec, { padSec = 0.4, fusionarSec = 0.2, aperturaMinS = 3 } = {}) {
  const av = new Set(plan.filter((p) => p.tipo === "avatar").map((p) => p.name));
  const W = [];
  for (const m of mom) {
    if (!av.has(m.name)) continue;
    const a = Math.max(0, m.start - padSec), z = Math.min(totalSec, m.end + padSec);
    if (W.length && a <= W[W.length - 1].end + fusionarSec) { W[W.length - 1].end = z; W[W.length - 1].n.push(m.name); }
    else W.push({ start: a, end: z, n: [m.name] });
  }
  // apertura: el video abre con el avatar hablando, piso de 3 s (regla de todos los canales; tcbriquetas)
  if (W.length && W[0].n[0] === "p000") { W[0].start = 0; W[0].end = Math.min(totalSec, Math.max(W[0].end, aperturaMinS)); }
  return W.map((w, k) => ({ k, ...w }));
}

async function supaCredsDyn() {
  const mod = await import("file:///" + path.join(ROOT, "scripts", "supa_creds.mjs").replace(/\\/g, "/"));
  return mod.supaCreds();
}

async function hostear(slug, files, log) {
  const { U, K } = await supaCredsDyn();
  const urls = {};
  for (const [nombre, local, ct] of files) {
    const obj = `tmp_avatar/${slug}_${nombre}`;
    const r = await fetch(`${U}/storage/v1/object/thumbnails/${obj}`, { method: "POST", headers: { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": ct, "x-upsert": "true" }, body: fs.readFileSync(local), signal: AbortSignal.timeout(600_000) });
    if (!r.ok) throw new Error(`subida ${nombre}: ${r.status} ${(await r.text()).slice(0, 200)}`);
    urls[nombre] = `${U}/storage/v1/object/public/thumbnails/${obj}`;
    const h = await fetch(urls[nombre], { method: "HEAD", signal: AbortSignal.timeout(30_000) });
    if (h.status !== 200) throw new Error(`${nombre} no quedó público (${h.status})`);
    log(`hosteado ${nombre} (${h.headers.get("content-length")} B)`);
  }
  return { urls, borrar: async () => { for (const [nombre] of files) await fetch(`${U}/storage/v1/object/thumbnails/tmp_avatar/${slug}_${nombre}`, { method: "DELETE", headers: { apikey: K, Authorization: `Bearer ${K}` } }).catch(() => {}); } };
}

async function runpodJob({ slug, parte, face, audio, prompt, jobsFile, outMp4, log }) {
  const jobs = fs.existsSync(jobsFile) ? JSON.parse(fs.readFileSync(jobsFile, "utf8")) : {};
  const H = { Authorization: `Bearer ${env("RUNPOD_API_KEY", { required: true })}`, "Content-Type": "application/json" };
  let host = null;
  if (!jobs[parte]?.id) {
    host = await hostear(slug, [[`face_${parte}.jpg`, face, "image/jpeg"], [`audio_${parte}.wav`, audio, "audio/wav"]], log);
    const body = { input: { prompt, image: host.urls[`face_${parte}.jpg`], audio: host.urls[`audio_${parte}.wav`], size: "480p" }, policy: { executionTimeout: 7_200_000 } };
    const r = await fetch("https://api.runpod.ai/v2/infinitetalk/run", { method: "POST", headers: H, body: JSON.stringify(body), signal: AbortSignal.timeout(60_000) });
    const t = await r.text();
    if (!r.ok) { await host.borrar(); if (esSinCredito(t) || r.status === 402) throw new BlockedError("RunPod sin saldo", t.slice(0, 200)); throw new Error(`RunPod /run ${r.status}: ${t.slice(0, 200)}`); }
    const j = JSON.parse(t);
    jobs[parte] = { id: j.id, ts: Date.now() };
    fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 1));
    log(`RunPod ${parte}: JOB ${j.id}`);
  } else log(`RunPod ${parte}: retomando JOB ${jobs[parte].id} (no se vuelve a pagar)`);
  let st;
  try {
    for (let k = 0; k < 600; k++) {
      await sleep(k ? 30_000 : 5_000);
      try { st = await (await fetch(`https://api.runpod.ai/v2/infinitetalk/status/${jobs[parte].id}`, { headers: H, signal: AbortSignal.timeout(45_000) })).json(); }
      catch (e) { log(`poll: ${e.message}`); continue; }
      if (k % 10 === 0) log(`RunPod ${parte}: ${st.status}`);
      if (["COMPLETED", "FAILED", "CANCELLED", "TIMED_OUT"].includes(st.status)) break;
    }
  } finally { if (host) await host.borrar(); }
  if (st?.status !== "COMPLETED") { delete jobs[parte]; fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 1)); throw new Error(`RunPod ${parte}: ${st?.status} ${JSON.stringify(st?.error || "").slice(0, 200)}`); }
  const mp4 = await fetch(st.output.result, { signal: AbortSignal.timeout(1_800_000) });
  fs.writeFileSync(outMp4, Buffer.from(await mp4.arrayBuffer()));
  jobs[parte].costo = st.output?.cost; jobs[parte].hecho = true;
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 1));
  return { costo: st.output?.cost };
}

export default {
  id: "55_avatar",
  deps: ["30_direct"],
  applies: ({ spec }) => spec.modo === "avatar",
  inputs: ({ P, spec, style }) => [P.mom, P.plan, P.wav, spec.avatar, style.ventanas],
  async run({ slug, spec, style, P, log }) {
    const A = P.avatarDir;
    fs.mkdirSync(A, { recursive: true });
    const mom = JSON.parse(fs.readFileSync(P.mom, "utf8"));
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8"));
    const TOT = await durSec(P.wav);
    const W = ventanas(mom, plan, TOT, style.ventanas);
    assertMeasured("ventanas", W.length, { min: 1, log });

    // 1. audio de cada ventana → reel.wav (UN job)
    let off = 0;
    const lst = [];
    for (const w of W) {
      const f = path.join(A, `w${String(w.k).padStart(3, "0")}.wav`);
      await run("ffmpeg", ["-v", "error", "-y", "-ss", w.start.toFixed(3), "-t", (w.end - w.start).toFixed(3), "-i", P.wav, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", f], { timeoutMs: 120_000 });
      const real = await durSec(f);
      w.end = +(w.start + real).toFixed(3); w.start = +w.start.toFixed(3);
      w.reel_off = +off.toFixed(3); off += real;
      lst.push(`file '${f.replace(/\\/g, "/")}'`);
    }
    fs.writeFileSync(path.join(A, "cat.txt"), lst.join("\n"));
    const reelWav = path.join(A, "reel.wav");
    await run("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(A, "cat.txt"), "-c:a", "pcm_s16le", reelWav], { timeoutMs: 600_000 });
    fs.writeFileSync(P.ventanas, JSON.stringify(W.map(({ k, start, end, reel_off, n }) => ({ k, start, end, reel_off, n })), null, 1));
    const reelSec = await durSec(reelWav);
    log(`ventanas ${W.length} · visibles ${reelSec.toFixed(1)} s de ${TOT.toFixed(1)} s (${((100 * reelSec) / TOT).toFixed(1)} %)`);

    // 2. RunPod: un job; cola sólo si vuelve corto
    const face = path.join(A, "face.jpg");
    await run("ffmpeg", ["-v", "error", "-y", "-i", spec.avatar.face, "-q:v", "2", "-frames:v", "1", "-update", "1", face], { timeoutMs: 60_000 });
    const prompt = spec.avatar.prompt || style.avatarPrompt || "A person speaks naturally to the camera, natural head movement, realistic lighting";
    const jobsFile = path.join(A, "jobs.json");
    const reelMp4 = path.join(A, "reel.mp4");
    let costo = 0, jobs = 0;
    if (!fs.existsSync(reelMp4) || Math.abs((await durSec(reelMp4)) - reelSec) > 1.5) {
      await withLease("runpod", slug, 1, async () => {
        const p1 = path.join(A, "parte1.mp4");
        if (!fs.existsSync(p1)) { const r = await runpodJob({ slug, parte: "parte1", face, audio: reelWav, prompt, jobsFile, outMp4: p1, log }); costo += r.costo || 0; }
        jobs++;
        const d1 = await durSec(p1);
        if (d1 >= reelSec - 1.5) { fs.copyFileSync(p1, reelMp4); return; }
        const corte = Math.max(...W.map((w) => w.reel_off).filter((o) => o <= d1 - 0.3));
        if (!(corte > 0)) throw new Error(`el job 1 volvió con ${d1.toFixed(1)} s y no hay borde de ventana antes: revisar`);
        log(`job 1 volvió corto (${d1.toFixed(1)} s de ${reelSec.toFixed(1)} s, cap RunPod) → 2º job SÓLO con la cola desde ${corte} s`);
        const cola = path.join(A, "cola.wav"), p1t = path.join(A, "parte1_trim.mp4"), p2 = path.join(A, "parte2.mp4");
        await run("ffmpeg", ["-v", "error", "-y", "-ss", String(corte), "-i", reelWav, "-c:a", "pcm_s16le", cola], { timeoutMs: 120_000 });
        await run("ffmpeg", ["-v", "error", "-y", "-i", p1, "-t", String(corte), "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-an", p1t], { timeoutMs: 1_800_000 });
        if (!fs.existsSync(p2)) { const r = await runpodJob({ slug, parte: "parte2", face, audio: cola, prompt, jobsFile, outMp4: p2, log }); costo += r.costo || 0; }
        jobs++;
        await run("ffmpeg", ["-v", "error", "-y", "-i", p1t, "-i", p2, "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", reelMp4], { timeoutMs: 1_800_000 });
      }, { log });
    }
    const dReel = await durSec(reelMp4);
    assertMeasured("reelDesvioSec", +Math.abs(dReel - reelSec).toFixed(2), { max: 1.5, allowZero: true, log });

    // 3. sincro (sobre el reel CRUDO vs su wav, antes de montar)
    const sync = await run("node", ["scripts/avatar_sync_gate.mjs", reelMp4, reelWav], { cwd: ROOT, timeoutMs: 15 * 60_000, allowFail: true });
    const corr = Number((sync.out.match(/correlación máx:\s*(-?[\d.]+)/) || [])[1]);
    const lag = Number((sync.out.match(/desfase:\s*(-?[\d.]+)s/) || [])[1]);
    assertMeasured("syncCorrelacion", corr, { min: 0.35, log });
    assertMeasured("syncDesfaseMs", Math.round(Math.abs(lag) * 1000), { max: 40, allowZero: true, log });

    // 4. un clip por ventana, 1920x1080 30/1, sin audio; cada uno dura lo que su ventana (±2 cuadros)
    fs.mkdirSync(P.brollDir, { recursive: true });
    const malos = [];
    await pool(W, 3, async (w) => {
      const d = w.end - w.start;
      const dst = path.join(P.brollDir, `av_w${String(w.k).padStart(3, "0")}.mp4`);
      await run("ffmpeg", ["-v", "error", "-y", "-ss", w.reel_off.toFixed(3), "-i", reelMp4, "-t", d.toFixed(3), "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1",
        "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", dst], { timeoutMs: 600_000 });
      const real = await durSec(dst);
      if (Math.abs(real - d) > 2 / 30 + 0.02) malos.push(`w${w.k}: ${real.toFixed(3)} vs ${d.toFixed(3)}`);
    });
    assertMeasured("ventanasMalCortadas", malos.length, { max: 0, allowZero: true, log });
    return { ventanas: W.length, visiblesSec: +reelSec.toFixed(2), visiblesPct: +((100 * reelSec) / TOT).toFixed(1), jobs, costoUsd: costo, syncCorr: corr, syncLagMs: Math.round(lag * 1000) };
  },
};
