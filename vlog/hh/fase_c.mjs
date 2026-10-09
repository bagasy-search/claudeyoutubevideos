// Fase C de un video: espera out/voz_<slug>.done → tl.py (tomas al ms) → reel del avatar (build) → /run de RunPod (con reintentos que reanudan el MISMO job).
//   node vlog/hh/fase_c.mjs <slug>      (lanzar con bg.mjs)
import fs from "node:fs"; import { spawnSync } from "node:child_process";
const S = process.argv[2]; const R = "D:/Proyectos/video2-wt/lhh/"; process.chdir(R);
const PY = "C:/Users/bauti/AppData/Local/Programs/Python/Python311/python.exe";
const run = (c, a) => { console.log(new Date().toISOString(), "▶", c, a.join(" ")); const r = spawnSync(c, a, { stdio: "inherit", windowsHide: true, env: { ...process.env, SLUG: S, PYTHONUTF8: "1" } }); if (r.status) { console.log("✗ exit", r.status); process.exit(1); } };
while (!fs.existsSync(`out/voz_${S}.done`)) await new Promise((r) => setTimeout(r, 30000));
run(PY, ["vlog/hh/tl.py", S]);
run("node", ["vlog/hh/av.mjs", S, "vlog/loretta/avatar_run.mjs", "build"]);
run("node", ["vlog/hh/retry.mjs", "30", "node", "vlog/hh/av.mjs", S, "vlog/loretta/avatar_run.mjs", "run"]);
console.log("FASE C OK", S);
