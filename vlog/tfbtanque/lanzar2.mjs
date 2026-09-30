// lanzador genérico: node lanzar2.mjs <tag> "S7:S7_03" "S6:S6_01" …  (sin ids = escena entera)
import { spawn } from "node:child_process"; import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/tfbtanque/"; process.chdir(R);
const env = { ...process.env, VLOG_MAX: "60", VLOG_RATE_WAIT: process.env.VLOG_RATE_WAIT || "120" };
const [tag, ...specs] = process.argv.slice(2); const log = fs.openSync(R + `out/logs/${tag}.log`, "a"); let vivos = 0;
specs.forEach((sp, k) => setTimeout(() => {
  const [s, ids] = sp.split(":"); const idl = ids ? ids.split(",") : [];
  const o = fs.openSync(R + `out/logs/${tag}_${s}.log`, "a");
  const p = spawn(process.execPath, ["scripts/agnes_vlog.mjs", `vlog/tfbtanque/plans/${s}.json`, "clips", ...idl], { env, stdio: ["ignore", o, o], windowsHide: true });
  vivos++; fs.writeSync(log, `${new Date().toISOString()} start ${sp} pid ${p.pid}\n`);
  p.on("exit", (c) => { vivos--; fs.writeSync(log, `${new Date().toISOString()} exit ${sp} ${c}\n`); if (!vivos) { fs.writeSync(log, "FIN\n"); process.exit(0); } });
}, k * 4000));
