// regen.mjs — regenera clips puntuales en paralelo: node vlog/tfbpiso/regen.mjs S1:s1_01 S9:s9_08 …
import fs from "node:fs"; import { spawn } from "node:child_process";
const V = "vlog/tfbpiso/", env = { ...process.env, VLOG_SLOTS_DIR: "D:/Proyectos/video2-wt/tfbpiso/vlog/tfbpiso/_slots", VLOG_MAX: "60", VLOG_RETRY_MS: "60000", VLOG_MAX_TRIES: "100000" };
const by = {}; for (const a of process.argv.slice(2)) { const [s, id] = a.split(":"); (by[s] ||= []).push(id); }
await Promise.all(Object.entries(by).map(([s, ids]) => new Promise(r => { const o = fs.openSync(V + `clips_${s}.log`, "a");
  spawn(process.execPath, ["scripts/agnes_vlog.mjs", V + `plan_${s}.json`, "clips", ...ids], { env, stdio: ["ignore", o, o], windowsHide: true }).on("exit", r); })));
console.log(new Date().toISOString().slice(11, 19), "regen terminado", process.argv.slice(2).join(" "));
