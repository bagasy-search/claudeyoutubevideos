// 55_avatar — InfiniteTalk por RunPod PÚBLICO (nunca Vast), SÓLO las ventanas visibles.
// Regla del creador: UN /run con todo el visible; si el mp4 vuelve más corto que el audio (cap ~600 s),
// recién ahí un 2º /run SÓLO con la cola, cortando en un borde de ventana. Sin pad que corra el lipsync.
// Inputs servidos desde el bucket público de Supabase (subirlos a GitHub rebotó con 403) y borrados al final.
// Los job ids se persisten: un corte NO vuelve a pagar un job.
import fs from "node:fs";
import path from "node:path";
import { run, durSec, durVideoSec } from "../lib/exec.mjs";
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
      // ⛔ Un estado DESCONOCIDO también es terminal. Con sólo la lista de arriba, un job que ya no
      //    existe (404 al retomar uno viejo) no cortaba nunca: 600 vueltas × 30 s = 5 horas poleando a un
      //    muerto, con la fase en `running` y nadie mirándola. Medido el 18-sep-2026 en fboxidoropa.
      if (!["IN_QUEUE", "IN_PROGRESS", "RUNNING"].includes(st.status)) break;
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
  deps: ["20_asr", "30_direct"],   // arranca apenas hay tiempos reales + qué momentos son avatar (en paralelo con imágenes/agnes)
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
    const TOL_CORTE_SEC = 2 / 30 + 0.02;   // lo que tolera el cortador de ventanas (abajo)
    const MAX_PAD_SEC = 0.5;               // por encima de esto NO se clona: se pide la cola de verdad
    // Se rellena ante CUALQUIER faltante, no sólo cuando supera la tolerancia del cortador: con
    // 0,077 s de menos (bajo los 0,087 del cortador) la última ventana se iba de rango igual por el
    // redondeo a cuadros, y la fase moría con `ventanasMalCortadas: 1` (medido en cmeamazon).
    // Clonar 2 cuadros al final no tiene costo ni efecto visible; quedarse corto sí.
    const EPS_PAD_SEC = 0.01;
    const face = path.join(A, "face.jpg");
    await run("ffmpeg", ["-v", "error", "-y", "-i", spec.avatar.face, "-q:v", "2", "-frames:v", "1", "-update", "1", face], { timeoutMs: 60_000 });
    const prompt = spec.avatar.prompt || style.avatarPrompt || "A person speaks naturally to the camera, natural head movement, realistic lighting";
    const jobsFile = path.join(A, "jobs.json");
    const reelMp4 = path.join(A, "reel.mp4");
    // ⛔⛔ CADUCIDAD POR AUDIO (18-sep-2026). Los pedazos del avatar se reusaban con un
    //    `existsSync` pelado: preguntaban si el archivo ESTÁ, no si es del audio de AHORA. Al cambiar
    //    la voz del canal (Fish → ElevenLabs) la fase reusó `parte1.mp4` de la corrida anterior y siguió
    //    adelante: un avatar lipsincado contra OTRA locución. Si no fuera porque el reel quedó corto y
    //    la compuerta de duración lo frenaó, se entregaba un video con la boca fuera de sincro y ninguna
    //    compuerta mirando eso. El `inputsHash` de la fase SÍ ve el wav — pero eso decide si la fase
    //    corre, no si lo que hay en disco sirve. Regla: un pedazo MÁS VIEJO que el audio no existe.
    const mtime = (f) => { try { return fs.statSync(f).mtimeMs; } catch { return 0; } };
    const audioMs = mtime(P.wav);
    // Al caducar un pedazo hay que caducar TAMBIÉN su job en `jobs.json`: si no, la fase "retoma" el job
    // de la corrida vieja y vuelve a bajar el avatar del audio anterior (o se come un 404, que fue lo que
    // pasó). El id viejo no sirve para nada una vez que el audio cambió.
    // El discriminador es la FECHA DEL JOB contra la del audio, no si el mp4 está en disco. Retomar un
    // job es legítimo cuando se cortó la corrida y el job sigue vivo en RunPod — eso hay que conservarlo.
    // Lo que no sirve NUNCA es un job LANZADO ANTES del audio actual: o devuelve el avatar de la voz
    // vieja, o ya caducó y da 404 (medido: reanudó el job de Fish y se comió el 404 dos veces).
    const jobsFilePre = path.join(A, "jobs.json");
    try {
      if (fs.existsSync(jobsFilePre)) {
        const j = JSON.parse(fs.readFileSync(jobsFilePre, "utf8"));
        const viejos = Object.keys(j).filter((k) => !(j[k]?.ts >= audioMs));
        if (viejos.length) {
          for (const k of viejos) delete j[k];
          fs.writeFileSync(jobsFilePre, JSON.stringify(j, null, 1));
          log(`  olvido ${viejos.length} job(s) de RunPod anteriores al audio: ${viejos.join(", ")}`);
        }
      }
    } catch { /* jobs.json ilegible: que lo rehaga */ }
    const sirve = (f) => {
      const t = mtime(f); if (!t) return false; if (t >= audioMs) return true;
      const b = path.basename(f, ".mp4");
      log(`  ${path.basename(f)} es anterior al audio: lo rehago`);
      fs.rmSync(f, { force: true });
      return false;
    };
    let costo = 0, jobs = 0;
    if (!sirve(reelMp4) || Math.abs((await durSec(reelMp4)) - reelSec) > 1.5) {
      await withLease("runpod", slug, 1, async () => {
        const p1 = path.join(A, "parte1.mp4");
        let p1Nueva = false;
        if (!sirve(p1)) { const r = await runpodJob({ slug, parte: "parte1", face, audio: reelWav, prompt, jobsFile, outMp4: p1, log }); costo += r.costo || 0; p1Nueva = true; }
        jobs++;
        const d1 = await durSec(p1);
        if (d1 >= reelSec - MAX_PAD_SEC) { fs.copyFileSync(p1, reelMp4); return; }
        const corte = Math.max(...W.map((w) => w.reel_off).filter((o) => o <= d1 - 0.3));
        if (!(corte > 0)) throw new Error(`el job 1 volvió con ${d1.toFixed(1)} s y no hay borde de ventana antes: revisar`);
        log(`job 1 volvió corto (${d1.toFixed(1)} s de ${reelSec.toFixed(1)} s, cap RunPod) → 2º job SÓLO con la cola desde ${corte} s`);
        const cola = path.join(A, "cola.wav"), p1t = path.join(A, "parte1_trim.mp4"), p2 = path.join(A, "parte2.mp4");
        // La cola se corta en el borde de ventana que cae dentro de lo que devolvió la parte 1. Si la
        // parte 1 se rehizo, ese borde cambia y una parte 2 vieja empalmaría en el lugar equivocado.
        if (p1Nueva && fs.existsSync(p2)) { log("  parte1 es nueva: la cola vieja ya no empalma, rehago parte2"); fs.rmSync(p2, { force: true }); }
        await run("ffmpeg", ["-v", "error", "-y", "-ss", String(corte), "-i", reelWav, "-c:a", "pcm_s16le", cola], { timeoutMs: 120_000 });
        await run("ffmpeg", ["-v", "error", "-y", "-i", p1, "-t", String(corte), "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-an", p1t], { timeoutMs: 1_800_000 });
        if (!sirve(p2)) { const r = await runpodJob({ slug, parte: "parte2", face, audio: cola, prompt, jobsFile, outMp4: p2, log }); costo += r.costo || 0; }
        jobs++;
        await run("ffmpeg", ["-v", "error", "-y", "-i", p1t, "-i", p2, "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", reelMp4], { timeoutMs: 1_800_000 });
      }, { log });
    }
    // ⛔ BANDA MUERTA (medida en cmealter): el disparador del 2º /run y el gate del reel toleraban
    // 1,5 s, pero el cortador de ventanas sólo 0,087 s. Un faltante entre esos dos números pasaba los
    // dos chequeos del reel y DESPUÉS rompía la última ventana, con la rama de la cola inalcanzable.
    // Ahora: > MAX_PAD_SEC pide la cola de verdad (arriba); entre la tolerancia del cortador y ese
    // umbral se clona el último cuadro, que sólo congela el final de la ÚLTIMA ventana y no corre el
    // lipsync de nada (tpad agrega, no desplaza).
    {
      // El sync gate saca el audio DEL PROPIO reel, asi que el reel tiene que conservarlo. Si una
      // corrida anterior lo dejo mudo (el tpad llevaba -an), se rehace desde parte1 en vez de quedar
      // en un ciclo que no cierra: ya padeado no vuelve a entrar acá, y mudo revienta el gate.
      const tieneAudio = async (f) => {
        const r = await run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", f],
          { timeoutMs: 60_000, allowFail: true });
        return /\d/.test(r.out || "");
      };
      const p1 = path.join(A, "parte1.mp4");
      if (fs.existsSync(reelMp4) && !(await tieneAudio(reelMp4)) && fs.existsSync(p1)) {
        log("el reel quedó sin pista de audio (corrida anterior): lo rehago desde parte1");
        fs.copyFileSync(p1, reelMp4);
      }
      // El contenedor miente cuando el video termina antes que el audio: lo que hay que cubrir es el
      // FLUJO DE VIDEO, porque es de ahí que se recorta cada ventana (ver durVideoSec en exec.mjs).
      const d = Math.min(await durSec(reelMp4), await durVideoSec(reelMp4));
      const falta = reelSec - d;
      // Simétrico al relleno: si el reel quedó MÁS LARGO que las ventanas (pasa cuando se recompone el
      // plan y el span total baja unos segundos), el sobrante está en la COLA, después de la última
      // ventana. Recortarlo es gratis y correcto — verificado en cme150 y cmealter: con el audio nuevo
      // el reel viejo daba correlación 1,000 y desfase 0,00 s, o sea que todo lo anterior seguía en su
      // lugar. Antes, esto obligaba a un /run nuevo de RunPod (US$0,25) por dos segundos de cola.
      if (falta < -EPS_PAD_SEC) {
        const rec = path.join(A, "reel_rec.mp4");
        log(`reel ${(-falta).toFixed(2)} s más largo que las ventanas: recorto la cola`);
        await run("ffmpeg", ["-v", "error", "-y", "-i", reelMp4, "-t", reelSec.toFixed(3),
          "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-c:a", "copy", rec], { timeoutMs: 1_800_000 });
        if (!(await tieneAudio(rec))) throw new Error("el recorte dejó el reel sin audio");
        fs.renameSync(rec, reelMp4);
      }
      if (falta > EPS_PAD_SEC && falta <= MAX_PAD_SEC) {
        const pad = path.join(A, "reel_pad.mp4");
        log(`reel ${falta.toFixed(3)} s corto (bajo el umbral de cola): clono el último cuadro ${Math.round(falta * 30)} cuadros`);
        await run("ffmpeg", ["-v", "error", "-y", "-i", reelMp4, "-vf", `tpad=stop_mode=clone:stop_duration=${(falta + 0.04).toFixed(3)}`,
          "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-c:a", "copy", pad], { timeoutMs: 1_800_000 });
        if (!(await tieneAudio(pad))) throw new Error("el clonado dejó el reel sin audio: el sync gate lo saca de acá");
        fs.renameSync(pad, reelMp4);
      }
    }
    const dReel = Math.min(await durSec(reelMp4), await durVideoSec(reelMp4));
    assertMeasured("reelFaltanteSec", +Math.max(0, reelSec - dReel).toFixed(3), { max: TOL_CORTE_SEC, allowZero: true, log });
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
    // El costo sale del SELLO de jobs.json, no del acumulador de esta corrida: al reanudar (reel ya
    // en disco, o parte1 reusada) no se llama a RunPod y `costo` queda en 0, con lo que el estado de
    // la fase decia que el avatar habia salido gratis y cualquier suma aguas abajo lo perdia.
    let costoSellado = costo;
    try {
      const js = JSON.parse(fs.readFileSync(jobsFile, "utf8"));
      const suma = Object.values(js).reduce((a, j) => a + (Number(j?.costo) || 0), 0);
      if (suma > costoSellado) costoSellado = +suma.toFixed(4);
    } catch { /* sin sello: queda el acumulador */ }
    return { ventanas: W.length, visiblesSec: +reelSec.toFixed(2), visiblesPct: +((100 * reelSec) / TOT).toFixed(1), jobs, costoUsd: costoSellado, syncCorr: corr, syncLagMs: Math.round(lag * 1000) };
  },
};
