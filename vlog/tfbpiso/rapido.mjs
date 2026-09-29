// rapido.mjs — lanza TODOS los clips faltantes (+ regeneraciones) en paralelo: un proceso agnes_vlog por escena,
// semáforo VLOG_MAX=60, reintento 60 s. Espera a que terminen todos. Uso: node vlog/tfbpiso/rapido.mjs [ids extra…]
import fs from "node:fs"; import { spawn } from "node:child_process";
const V = "vlog/tfbpiso/", REG = { S1: ["s1_01", "s1_03"], S9B: ["s9b_02"] };
const env = { ...process.env, VLOG_SLOTS_DIR: "D:/Proyectos/video2-wt/tfbpiso/vlog/tfbpiso/_slots", VLOG_MAX: "60", VLOG_RETRY_MS: "60000", VLOG_MAX_TRIES: "100000" };
const J = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
const procs = [];
for (const s of ["S1", "S2", "S3", "S3B", "S4", "S6", "S7", "S8", "S9", "S9B", "S10"]) {
  const p = J(V + `plan_${s}.json`), st = { ...J(p.dir + "/clips/state.json"), ...J(p.dir + "/clips/state_det.json") };
  const hist = J(p.dir + "/clips/check_hist.json");
  const ids = [...p.clips.filter(c => !st[c.id]).map(c => c.id), ...(REG[s] || []).filter(r => Object.keys(hist[r] || {}).length < 2)];
  if (!ids.length) continue;
  console.log(new Date().toISOString().slice(11, 19), s, ids.length, ids.join(" "));
  const out = fs.openSync(V + `clips_${s}.log`, "a");
  procs.push(new Promise(r => spawn(process.execPath, ["scripts/agnes_vlog.mjs", V + `plan_${s}.json`, "clips", ...ids], { env, stdio: ["ignore", out, out], windowsHide: true }).on("exit", r)));
}
await Promise.all(procs);
console.log(new Date().toISOString().slice(11, 19), "rapido terminado");
