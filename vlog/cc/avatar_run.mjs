// Avatar CLAUDIO COCINA — InfiniteTalk RunPod público, UN /run (≤240 s: más degrada el reel) con todos los tramos av de segs.json.
//   SLUG=x node vlog/cc/avatar_run.mjs build → out/<slug>_avatar/reel.wav + _v3/<slug>_avwin.json (offsets para recortar de vuelta)
//   SLUG=x node vlog/cc/avatar_run.mjs run   → sube ref (public/ref_<slug>.png) + reel a raw público, /run, polea, baja reel.mp4
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { R, SLUG, V3 } from "../claudio/env.mjs";
const TAG = process.env.AVTAG || "", AVK = process.env.AVK || "av"; const OUT = R + `out/${SLUG}_avatar${TAG}/`; fs.mkdirSync(OUT, { recursive: true });
const envKey = () => { try { const m = fs.readFileSync(R + ".env", "utf8").match(/^RUNPOD_(?:API_)?KEY\s*=\s*(\S+)/m); return m && m[1].replace(/^["']|["']$/g, ""); } catch { return null; } };
const KEY = process.env.RUNPOD_KEY || envKey();
const sh = (c, a, o = {}) => execFileSync(c, a, { encoding: "utf8", windowsHide: true, ...o });
const log = (...a) => { const l = new Date().toISOString().slice(11, 19) + " " + a.join(" "); console.log(l); fs.appendFileSync(OUT + "run.log", l + "\n"); };
const fase = process.argv[2];
if (fase === "build") {
  const segs = JSON.parse(fs.readFileSync(R + `vlog/${SLUG}/segs.json`, "utf8")).filter((s) => s.kind === AVK);
  const win = [];
  for (const w of segs) { const L = win[win.length - 1]; if (L && Math.abs(L.e - w.s) < 0.05) L.e = w.e; else win.push({ s: w.s, e: w.e }); }
  let off = 0, txt = "";
  win.forEach((w, i) => { w.ms = Math.max(0, w.s - 0.12); w.me = w.e + 0.12; w.off = off; off += w.me - w.ms;
    const f = OUT + `p${String(i).padStart(3, "0")}.wav`; sh("ffmpeg", ["-v", "error", "-y", "-ss", w.ms.toFixed(3), "-to", w.me.toFixed(3), "-i", R + `public/${SLUG}.wav`, "-ac", "1", "-ar", "44100", f]); txt += `file '${f}'\n`; });
  fs.writeFileSync(OUT + "concat.txt", txt);
  sh("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", OUT + "concat.txt", "-c:a", "pcm_s16le", OUT + "reel.wav"]);
  const d = +sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", OUT + "reel.wav"]).trim();
  if (d > 240) { console.error(`reel ${d.toFixed(1)} s > 240 s: InfiniteTalk degrada`); process.exit(1); }
  fs.writeFileSync(V3 + `avwin${TAG}.json`, JSON.stringify({ reel: d, win }, null, 1));
  console.log(`ventanas ${win.length} · reel ${d.toFixed(1)} s`);
  process.exit(0);
}
if (fase === "run" || fase === "poll") {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // poll = retoma el job.json ya lanzado (el proceso murió poleando) sin pagar otro /run
  let j;
  if (fase === "poll") j = JSON.parse(fs.readFileSync(OUT + "job.json", "utf8"));
  else {
  if (fs.existsSync(OUT + "job.json")) { console.error("ya hay job.json: un solo /run por video (para retomar: poll)"); process.exit(1); }
  const user = sh("gh", ["api", "user", "-q", ".login"]).trim(), tok = sh("gh", ["auth", "token"]).trim();
  const repo = "rp-it-test", br = SLUG + "-" + Date.now().toString(36), W = OUT + "_push/";
  fs.rmSync(W, { recursive: true, force: true }); fs.mkdirSync(W, { recursive: true });
  fs.copyFileSync(R + `public/ref_${SLUG}.png`, W + "face.png"); fs.copyFileSync(OUT + "reel.wav", W + "audio.wav");
  const g = (...a) => sh("git", ["-C", W, ...a]);
  g("init", "-q"); g("add", "face.png", "audio.wav"); g("-c", "user.email=noreply@local", "-c", "user.name=rp", "commit", "-qm", SLUG + " avatar inputs");
  g("branch", "-M", br); g("push", "-qf", `https://x-access-token:${tok}@github.com/${user}/${repo}.git`, `${br}:${br}`);
  const img = `https://raw.githubusercontent.com/${user}/${repo}/${br}/face.png`, aud = `https://raw.githubusercontent.com/${user}/${repo}/${br}/audio.wav`;
  for (const u of [img, aud]) for (let t = 0; t < 20; t++) { if ((await fetch(u, { method: "HEAD" })).ok) break; await sleep(5000); }
  log("inputs públicos", img, aud);
  const body = { input: { prompt: "A Latin American cook about 50 with curly gray-streaked hair and a short graying beard, in a sky-blue shirt with rolled sleeves and a stained white apron, a checkered towel on his right shoulder, standing at the stove of a small Mexican fonda kitchen and talking warmly and directly to the camera, natural small head movements, blinking, expressive face, background stays still", image: img, audio: aud, size: "720p", enable_safety_checker: false }, policy: { executionTimeout: 7200000 } };
  j = await (await fetch("https://api.runpod.ai/v2/infinitetalk/run", { method: "POST", headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
  log("RUN", JSON.stringify(j)); if (!j.id) process.exit(1);
  fs.writeFileSync(OUT + "job.json", JSON.stringify({ id: j.id, br, img, aud, t: Date.now() }));
  }
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
