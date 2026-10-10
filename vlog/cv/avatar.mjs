// Avatar InfiniteTalk (RunPod endpoint PÚBLICO) del Vaquero — UN solo /run con TODAS las ventanas visibles (reel ≤ 240 s: más degrada).
// Ventanas = segmentos hablados de vlog/<slug>/avatar.json {"ids":[...]} en tiempo del MÁSTER (public/<slug>.wav), contiguos se funden.
//   SLUG=x node vlog/cv/avatar.mjs build   → vlog/<slug>/avatar/reel.wav + avwin.json
//   SLUG=x node vlog/cv/avatar.mjs poll    → retoma el job de job.json (si se cortó el poleo)
//   SLUG=x node vlog/cv/avatar.mjs run     → sube ref+reel a raw público, /run, polea, baja reel.mp4 (lanzalo DESACOPLADO)
// Ref = public/ref_cv_A3.png (Claudio de la cintura para arriba en la mesa del rancho, sin comida delante).
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const S = process.env.SLUG, R = `D:/Proyectos/video2-wt/${process.env.WT || S}/`, D = R + `vlog/${S}/`, OUT = D + "avatar/";
fs.mkdirSync(OUT, { recursive: true });
const envKey = () => { try { const m = fs.readFileSync(R + ".env", "utf8").match(/^RUNPOD_API_KEY\s*=\s*(\S+)/m); return m && m[1].replace(/^["']|["']$/g, ""); } catch { return null; } };
const KEY = process.env.RUNPOD_KEY || envKey();
const sh = (c, a) => execFileSync(c, a, { encoding: "utf8", windowsHide: true });
const log = (...a) => { const l = new Date().toISOString().slice(11, 19) + " " + a.join(" "); console.log(l); fs.appendFileSync(OUT + "run.log", l + "\n"); };
const fase = process.argv[2], MAXREEL = 240;

if (fase === "build") {
  const segs = JSON.parse(fs.readFileSync(D + "segs.json", "utf8")), ids = new Set(JSON.parse(fs.readFileSync(D + "avatar.json", "utf8")).ids);
  const win = [];
  segs.forEach((s, i) => { if (!ids.has(s.id)) return; const e = i + 1 < segs.length ? segs[i + 1].s : s.s + s.d;
    const L = win[win.length - 1]; if (L && Math.abs(L.e - s.s) < 0.05) { L.e = e; L.ids.push(s.id); } else win.push({ s: s.s, e, ids: [s.id] }); });
  let off = 0, txt = "";
  win.forEach((w, i) => { w.ms = Math.max(0, w.s - 0.12); w.me = w.e + 0.12; w.off = off; off += w.me - w.ms;
    const f = OUT + `p${String(i).padStart(3, "0")}.wav`; sh("ffmpeg", ["-v", "error", "-y", "-ss", w.ms.toFixed(3), "-to", w.me.toFixed(3), "-i", R + `public/${S}.wav`, "-ac", "1", "-ar", "44100", f]); txt += `file '${f}'\n`; });
  fs.writeFileSync(OUT + "concat.txt", txt);
  sh("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", OUT + "concat.txt", "-c:a", "pcm_s16le", OUT + "reel.wav"]);
  const d = +sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", OUT + "reel.wav"]).trim();
  fs.writeFileSync(OUT + "avwin.json", JSON.stringify({ reel: d, win }, null, 1));
  console.log(`MEDIDO avatar build: ${win.length} ventanas · reel ${d.toFixed(1)} s (tope ${MAXREEL}) · ${ids.size} segmentos`);
  if (d > MAXREEL) { console.log("⛔ reel > 240 s: degrada, sacá segmentos"); process.exit(2); }
  process.exit(0);
}

if (fase === "run" || fase === "poll") {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let j; if (fase === "poll") j = JSON.parse(fs.readFileSync(OUT + "job.json", "utf8")); else { // poll = retomar el job ya pagado (job.json), sin /run nuevo
  const user = sh("gh", ["api", "user", "-q", ".login"]).trim(), tok = sh("gh", ["auth", "token"]).trim();
  const repo = "rp-it-test", br = S + "-" + Date.now().toString(36), W = OUT + "_push/";
  fs.rmSync(W, { recursive: true, force: true }); fs.mkdirSync(W, { recursive: true });
  fs.copyFileSync(R + "public/ref_cv_A3.png", W + "face.png"); fs.copyFileSync(OUT + "reel.wav", W + "audio.wav");
  const g = (...a) => sh("git", ["-C", W, ...a]);
  g("init", "-q"); g("add", "face.png", "audio.wav"); g("-c", "user.email=noreply@local", "-c", "user.name=rp", "commit", "-qm", S + " avatar inputs");
  g("branch", "-M", br); g("push", "-qf", `https://x-access-token:${tok}@github.com/${user}/${repo}.git`, `${br}:${br}`);
  const img = `https://raw.githubusercontent.com/${user}/${repo}/${br}/face.png`, aud = `https://raw.githubusercontent.com/${user}/${repo}/${br}/audio.wav`;
  for (const u of [img, aud]) for (let t = 0; t < 20; t++) { const r = await fetch(u, { method: "HEAD" }); if (r.ok) break; await sleep(5000); }
  log("inputs públicos", img, aud);
  const body = { input: { prompt: "A weathered ranch cook in a straw cowboy hat talking warmly and plainly to a friend behind the camera in his ranch kitchen, natural small head movements, blinking, relaxed hands on the table, background stays still", image: img, audio: aud, size: "720p", enable_safety_checker: false }, policy: { executionTimeout: 7200000 } };
  j = await (await fetch("https://api.runpod.ai/v2/infinitetalk/run", { method: "POST", headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
  log("RUN", JSON.stringify(j)); if (!j.id) process.exit(1);
  fs.writeFileSync(OUT + "job.json", JSON.stringify({ id: j.id, br, img, aud, t: Date.now() })); }
  for (;;) {
    await sleep(60000);
    let st; try { st = await (await fetch("https://api.runpod.ai/v2/infinitetalk/status/" + j.id, { headers: { Authorization: "Bearer " + KEY }, signal: AbortSignal.timeout(30000) })).json(); } catch (e) { log("poll err", e.message); continue; }
    log("status", st.status, st.executionTime || "");
    if (st.status === "COMPLETED") {
      fs.writeFileSync(OUT + "status_final.json", JSON.stringify(st, null, 1));
      const url = st.output?.result || st.output?.video || st.output?.url;
      fs.writeFileSync(OUT + "reel.mp4", Buffer.from(await (await fetch(url)).arrayBuffer()));
      log("LISTO reel.mp4", sh("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=width,height", "-of", "csv=p=0", OUT + "reel.mp4"]).replace(/\s+/g, " "), "costo", st.output?.cost);
      break;
    }
    if (st.status === "FAILED" || st.status === "CANCELLED") { log("FALLÓ", JSON.stringify(st).slice(0, 400)); break; }
  }
}
