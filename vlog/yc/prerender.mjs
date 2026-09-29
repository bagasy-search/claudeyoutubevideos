// prerender.mjs — renderiza LOCAL con GPU (angle) las escenas 3D pesadas del plan (D:/rtmp/__SLUG__/prerender_jobs.json)
// como clips 1920x1080 30/1 sin audio; plan.mjs después las usa como "Prerendered". Uso: node vlog/__SLUG__/prerender.mjs [--force]
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const R = "D:/rtmp/__SLUG__/";
const PUB = "C:/Users/bauti/Downloads/video2/public/";
const jobs = JSON.parse(fs.readFileSync(R + "prerender_jobs.json", "utf8"));
const force = process.argv.includes("--force");
const bundle = R + "bundle_main";
for (const j of jobs) {
  const out = PUB + j.file;
  if (fs.existsSync(out) && !force) { console.log("ya está", j.file); continue; }
  const pf = R + "pre_props.json";
  fs.writeFileSync(pf, JSON.stringify({ comp: j.comp, props: j.props, lens: j.lens, dur: j.dur }));
  const t0 = Date.now();
  const r = spawnSync("npx", ["remotion", "render", bundle, "YcCard", out, `--props=${pf}`, "--gl=angle", "--concurrency=6", "--crf=16", "--muted"], { encoding: "utf8", shell: true });
  if (r.status !== 0 || !fs.existsSync(out)) { console.log("FALLO", j.file, (r.stderr || r.stdout).slice(-600)); process.exit(1); }
  const pr = spawnSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", out], { encoding: "utf8" });
  const n = parseInt(pr.stdout);
  console.log(`ok ${j.file} · ${n}/${j.dur} cuadros · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  if (n !== j.dur) { console.log("⛔ cuadros distintos"); process.exit(1); }
}
