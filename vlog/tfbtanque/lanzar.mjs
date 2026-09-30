// lanzador de la tanda final: todas las escenas + regeneraciones EN PARALELO, con env propio (sin ventanas)
import { spawn } from "node:child_process"; import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/tfbtanque/"; process.chdir(R);
const env = { ...process.env, VLOG_MAX: "60", VLOG_RATE_WAIT: "60" };
const jobs = [["S7"], ["S0"], ["S2"], ["S4"], ["S5"], ["S6b"], ["S7B"], ["S8"], ["S9"], ["S10"], ["S11"], ["S11B"], ["S13"],
  ["S1", "S1_01"], ["S3", "S3_04b", "S3_06b", "S3_12"], ["S4", "S4_09"], ["S10", "S10_01", "S12_13a"], ["S12", "S12_01", "S12_06"]];
const log = fs.openSync(R + "out/logs/lanzar.log", "a"); let vivos = 0;
const run = (i) => { const [s, ...ids] = jobs[i]; const o = fs.openSync(R + `out/logs/fin_${s}${ids.length ? "_r" : ""}.log`, "a");
  const p = spawn(process.execPath, ["scripts/agnes_vlog.mjs", `vlog/tfbtanque/plans/${s}.json`, "clips", ...ids], { env, stdio: ["ignore", o, o], windowsHide: true });
  vivos++; fs.writeSync(log, `${new Date().toISOString()} start ${s} ${ids.join(" ")} pid ${p.pid}\n`);
  p.on("exit", (c) => { vivos--; fs.writeSync(log, `${new Date().toISOString()} exit ${s} ${c}\n`); if (!vivos) { fs.writeSync(log, "LANZAR_FIN\n"); process.exit(0); } }); };
// S7 primero (retoma S7_03), el resto escalonado 5 s; las regeneraciones de la misma escena corren después de su escena base
const base = jobs.map((_, i) => i).filter(i => jobs[i].length === 1), regen = jobs.map((_, i) => i).filter(i => jobs[i].length > 1);
base.forEach((i, k) => setTimeout(() => run(i), k * 5000));
regen.forEach((i, k) => setTimeout(() => run(i), 90000 + k * 5000));
