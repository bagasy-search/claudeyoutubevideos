// Fase E de un video: avatar listo → post del avatar (dur mp4 vs wav + lag) → espera assets (out/assets_<slug>.done) → tl --final →
// mezcla (sin música) → m4a → entry → commit en lhh-render + rama congelada <slug>-render → farm (NOWAIT) → esperar_run → encode
// final EN EL FARM (rama encode-<slug>) → release <slug>/<slug>.mp4 (HTTP 200). node vlog/hh/fase_e.mjs <slug>
import fs from "node:fs"; import { spawnSync, execFileSync } from "node:child_process";
const S = process.argv[2]; const R = "D:/Proyectos/video2-wt/lhh/"; process.chdir(R);
const PY = "C:/Users/bauti/AppData/Local/Programs/Python/Python311/python.exe"; const REPO = "bagasy-search/claudeyoutubevideos";
const env = { ...process.env, SLUG: S, PYTHONUTF8: "1" };
const log = (...a) => console.log(new Date().toISOString(), `[${S}]`, ...a);
const run = (c, a, ok = [0]) => { log("▶", c, a.join(" ")); const r = spawnSync(c, a, { stdio: "inherit", windowsHide: true, env }); if (!ok.includes(r.status)) { log("✗ exit", r.status); process.exit(1); } return r.status; };
const out = (c, a) => execFileSync(c, a, { encoding: "utf8", windowsHide: true, env }).trim();
const wait = async (f, s = 60) => { while (!fs.existsSync(f)) await new Promise((r) => setTimeout(r, s * 1000)); };
const retry = async (fn, n = 20) => { for (let t = 1; ; t++) { try { return fn(); } catch (e) { if (t >= n) throw e; log("reintento", t, String(e.message).slice(0, 120)); await new Promise((r) => setTimeout(r, 60000)); } } };

await wait(`out/${S}_avatar/status_final.json`);
if (!fs.existsSync(`public/avatar_clips/${S}/reel30.mp4`)) {
  const st = run(PY, ["vlog/loretta/avatar_post.py"], [0, 2]);
  if (st === 2) { log("⛔ el mp4 del avatar volvió MÁS CORTO que el audio: falta la cola → revisar a mano"); process.exit(2); }
}
await wait(`out/assets_${S}.done`);
run(PY, ["vlog/hh/tl.py", S, "--final"]);
run(PY, ["vlog/loretta/mix.py"]);
run("ffmpeg", ["-v", "error", "-y", "-i", `public/${S}.wav`, "-c:a", "aac", "-b:a", "128k", `public/${S}.m4a`]);
run("node", ["vlog/hh/av.mjs", S, "vlog/loretta/mk_entry.mjs"]);
run(PY, ["vlog/hh/meta.py", S]);
// commit (con lock: 10 cadenas comparten el worktree)
const lock = "out/.gitlock";
for (;;) { try { fs.mkdirSync(lock); break; } catch { await new Promise((r) => setTimeout(r, 3000)); } }
try {
  run("git", ["add", `src/${S}/timeline.gen.ts`, `src/index_${S}.tsx`, `tsconfig.${S}.json`]);
  spawnSync("git", ["commit", "-qm", `${S}: timeline final con avatar\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`], { windowsHide: true });
  await retry(() => out("git", ["push", "-q", "origin", "HEAD:refs/heads/lhh-render"]));
  await retry(() => out("git", ["push", "-q", "-f", "origin", `HEAD:refs/heads/${S}-render`]));
} finally { fs.rmdirSync(lock); }
const F = fs.readFileSync(`src/${S}/timeline.gen.ts`, "utf8").match(/TOTAL_FRAMES = (\d+)/)[1];
const ID = S[0].toUpperCase() + S.slice(1);
let runId = null;
// las subidas de tarball al farm van DE A UNA (10 a la vez cortan la red por TLS timeout)
const ulock = "out/.farmlock";
for (;;) { try { fs.mkdirSync(ulock); break; } catch { await new Promise((r) => setTimeout(r, 15000)); } }
process.on("exit", () => { try { fs.rmdirSync(ulock); } catch {} });
for (let t = 1; t <= 6 && !runId; t++) {
  const r = spawnSync("node", ["scripts/farm.mjs", S, ID, F, "60", `@_${S}_assets.txt`], { encoding: "utf8", windowsHide: true, env: { ...env, ENTRY: `src/index_${S}.tsx`, FARM_REF: `${S}-render`, STITCH_RAW: "1", AUDIO_FILE: `${S}.wav`, FARM_NOWAIT: "1", ASSETS_COMPARTIDOS: "sfx" } });
  process.stdout.write(r.stdout || ""); process.stdout.write(r.stderr || "");
  runId = (r.stdout || "").match(/WAIT_RUN: (\d+)/)?.[1];
  if (!runId) { log("farm sin run id, reintento", t); await new Promise((res) => setTimeout(res, 120000)); }
}
try { fs.rmdirSync(ulock); } catch {}
if (!runId) { log("⛔ farm no arrancó"); process.exit(1); }
fs.writeFileSync(`out/farm_${S}.run`, runId);
for (let t = 1; t <= 3; t++) { const r = spawnSync("node", ["scripts/esperar_run.mjs", runId], { stdio: "inherit", windowsHide: true }); if (r.status === 0) break; if (t === 3) { log("⛔ render falló", runId); process.exit(1); } }
log("FARM OK", runId);
run("bash", ["vlog/hh/encode.sh", S, runId]);
// esperar el encode-<slug> y el asset del release
await new Promise((r) => setTimeout(r, 30000));
const encId = await retry(() => out("gh", ["run", "list", "-R", REPO, "--workflow", "encode.yml", "-b", `encode-${S}`, "--limit", "1", "--json", "databaseId", "--jq", ".[0].databaseId"]));
log("encode run", encId);
spawnSync("node", ["scripts/esperar_run.mjs", encId], { stdio: "inherit", windowsHide: true });
const t0 = Date.now() - 4 * 3600e3;
const asset = await retry(() => JSON.parse(out("gh", ["api", `repos/${REPO}/releases/tags/${S}`])).assets.find((x) => x.name === `${S}.mp4`));
log("release", asset ? `${(asset.size / 1048576).toFixed(0)} MB · ${asset.updated_at}` : "SIN ASSET");
if (asset && asset.size > 1e8) fs.writeFileSync(`out/render_${S}.done`, String(encId));
