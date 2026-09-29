// Avatar InfiniteTalk por el endpoint PÚBLICO de RunPod — UN solo /run con TODAS las ventanas visibles (reel continuo).
//   node vlog/olcabin/avatar_run.mjs build   → arma _v3/olcabin_avwin.json + out/avatar/reel.wav (spans del máster, sin huecos)
//   node vlog/olcabin/avatar_run.mjs run     → sube ref+reel a raw público (rama propia), /run con executionTimeout alto,
//                                             polea, guarda status_final.json apenas COMPLETED, baja el mp4 (lanzalo DESACOPLADO)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olcabin/";
const OUT = R + "out/avatar/";
fs.mkdirSync(OUT, { recursive: true });
// la key NO va en el código (push protection de GitHub): sale del env o del .env del worktree
const envKey = () => { try { const m = fs.readFileSync(R + ".env", "utf8").match(/^RUNPOD_(?:API_)?KEY\s*=\s*(\S+)/m); return m && m[1].replace(/^["']|["']$/g, ""); } catch { return null; } };
const KEY = process.env.RUNPOD_KEY || envKey();
const sh = (c, a, o = {}) => execFileSync(c, a, { encoding: "utf8", windowsHide: true, ...o });
const log = (...a) => { const l = new Date().toISOString().slice(11, 19) + " " + a.join(" "); console.log(l); fs.appendFileSync(OUT + "run.log", l + "\n"); };
const fase = process.argv[2];

if (fase === "build") {
  const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olcabin_shots.json", "utf8"));
  // vl = repuesto: si agnes no llega, el avatar cubre ese tramo
  // los vl de los pies (c_*) sin clip agnes caen al avatar SÓLO hasta el corte al detalle de manos v2.0 (misma regla
  // que gen_timeline: palabra más cercana al 45 % del tramo) → el reel no pasa el cap de ~600 s de RunPod
  const W = JSON.parse(fs.readFileSync(R + "_v3/olcabin_wordms.json", "utf8"));
  const PUB = R + "public/", hasH = (n) => fs.existsSync(PUB + `broll/olcabin/h_${n}.mp4`) || fs.existsSync(PUB + `img/olcabin/h_${n}.jpg`);
  const EXTRA = new Set([6, 8, 9, 13, 16, 19, 21, 30, 31, 32, 34]); // párrafos enteros de respaldo (1 solo /run)
  const av = shots.filter((s) => s.kind === "av" || s.kind === "vl" || EXTRA.has(s.p)).map((s) => {
    if (s.kind === "av" || /^m\d/.test(s.name) || !hasH(s.name) || s.dur <= 4) return { s: s.start, e: s.end };
    const tgt = s.start + s.dur * 0.45; let cut = null;
    for (const x of W) if (x.s > s.start + 1.8 && x.s < s.end - 2.2 && (cut == null || Math.abs(x.s - tgt) < Math.abs(cut - tgt))) cut = x.s - 0.04;
    return { s: s.start, e: cut ?? s.end };
  });

  const win = [];
  for (const w of av) { const L = win[win.length - 1]; if (L && Math.abs(L.e - w.s) < 0.05) L.e = w.e; else win.push({ ...w }); }
  // margen: 0,12 s a cada lado (el corte de vuelta usa el offset exacto; el margen evita arrancar en la 1ª sílaba)
  let off = 0; const parts = [];
  for (const w of win) { w.ms = Math.max(0, w.s - 0.12); w.me = w.e + 0.12; w.off = off; off += w.me - w.ms; parts.push(w); }
  // fusionar solapes de margen
  const list = OUT + "concat.txt"; let txt = "";
  parts.forEach((w, i) => { const f = OUT + `p${String(i).padStart(3, "0")}.wav`; sh("ffmpeg", ["-v", "error", "-y", "-ss", w.ms.toFixed(3), "-to", w.me.toFixed(3), "-i", R + "public/olcabin.wav", "-ac", "1", "-ar", "44100", f]); txt += `file '${f}'\n`; });
  fs.writeFileSync(list, txt);
  sh("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "pcm_s16le", OUT + "reel.wav"]);
  const d = +sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", OUT + "reel.wav"]).trim();
  fs.writeFileSync(R + "_v3/olcabin_avwin.json", JSON.stringify({ reel: d, win: parts }, null, 1));
  console.log(`ventanas ${parts.length} · reel ${d.toFixed(1)} s (cap medido ~600 s) · suma teórica ${off.toFixed(1)}`);
  process.exit(0);
}

if (fase === "run") {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const user = sh("gh", ["api", "user", "-q", ".login"]).trim();
  const tok = sh("gh", ["auth", "token"]).trim();
  const repo = "rp-it-test", br = "olcabin-" + Date.now().toString(36);
  const W = OUT + "_push/";
  fs.rmSync(W, { recursive: true, force: true }); fs.mkdirSync(W, { recursive: true });
  fs.copyFileSync(R + "public/ref_olcabin.png", W + "face.png");
  fs.copyFileSync(OUT + "reel.wav", W + "audio.wav");
  try { sh("gh", ["repo", "view", `${user}/${repo}`]); } catch { sh("gh", ["repo", "create", repo, "--public"]); }
  const g = (...a) => sh("git", ["-C", W, ...a]);
  g("init", "-q"); g("add", "face.png", "audio.wav"); g("-c", "user.email=noreply@local", "-c", "user.name=rp", "commit", "-qm", "olcabin avatar inputs");
  g("branch", "-M", br); g("push", "-qf", `https://x-access-token:${tok}@github.com/${user}/${repo}.git`, `${br}:${br}`);
  const img = `https://raw.githubusercontent.com/${user}/${repo}/${br}/face.png`, aud = `https://raw.githubusercontent.com/${user}/${repo}/${br}/audio.wav`;
  for (const u of [img, aud]) { for (let t = 0; t < 20; t++) { const r = await fetch(u, { method: "HEAD" }); if (r.ok) break; await sleep(5000); } }
  log("inputs públicos", img, aud);
  const body = { input: { prompt: "A 78-year-old camp cook with a white beard talking warmly to his grandson behind the camera in his log cabin cook shack, natural small head movements, blinking, expressive old face, background stays still", image: img, audio: aud, size: "720p", enable_safety_checker: false }, policy: { executionTimeout: 7200000 } };
  const j = await (await fetch("https://api.runpod.ai/v2/infinitetalk/run", { method: "POST", headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
  log("RUN", JSON.stringify(j)); if (!j.id) process.exit(1);
  fs.writeFileSync(OUT + "job.json", JSON.stringify({ id: j.id, br, img, aud, t: Date.now() }));
  for (;;) {
    await sleep(60000);
    let st; try { st = await (await fetch("https://api.runpod.ai/v2/infinitetalk/status/" + j.id, { headers: { Authorization: "Bearer " + KEY }, signal: AbortSignal.timeout(30000) })).json(); } catch (e) { log("poll err", e.message); continue; }
    log("status", st.status, st.executionTime || "");
    if (st.status === "COMPLETED") {
      fs.writeFileSync(OUT + "status_final.json", JSON.stringify(st, null, 1));
      const url = st.output?.result || st.output?.video || st.output?.url;
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer()); fs.writeFileSync(OUT + "reel.mp4", buf);
      const d = sh("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=width,height,r_frame_rate", "-of", "csv=p=0", OUT + "reel.mp4"]);
      log("LISTO reel.mp4", d.replace(/\s+/g, " "), "costo", st.output?.cost);
      break;
    }
    if (st.status === "FAILED" || st.status === "CANCELLED") { log("FALLÓ", JSON.stringify(st).slice(0, 400)); break; }
  }
}
