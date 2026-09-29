// paralelo.mjs — TODOS los clips que faltan a la vez (un agnes_vlog por escena; adentro van en paralelo con 3 s de
// escalonado) + las regeneraciones pedidas. Reintento ante rate limit: AGNES_RETRY_MS (60 s). Sin ventanas.
// Lanzar oculto:  Start-Process cmd.exe -ArgumentList '/d','/c','node vlog/tfbcola/paralelo.mjs > out/paralelo_run.log 2>&1' -WindowStyle Hidden
import fs from "node:fs"; import { spawn } from "node:child_process";
const V = "D:/Proyectos/video2-wt/tfbcola/vlog/tfbcola/";
const REGEN = { S2: ["b019"], S4: ["b037"], S5: ["b058"] };
const jobs = [];
for (const f of fs.readdirSync(V).filter(f => /^S\d+[a-z]*\.json$/.test(f))) {
  const S = f.slice(0, -5), P = JSON.parse(fs.readFileSync(V + f, "utf8")), sf = P.dir + "clips/state.json";
  const st = fs.existsSync(sf) ? JSON.parse(fs.readFileSync(sf, "utf8")) : {};
  const ids = P.clips.filter(c => !c.detail && !st[c.id]).map(c => c.id);
  if (ids.length) jobs.push([S, ids, "faltan"]);
  if (REGEN[S]) jobs.push([S, REGEN[S], "regen"]);
}
const log = m => fs.appendFileSync("out/paralelo.log", new Date().toISOString().slice(11, 19) + " " + m + "\n");
log(`lanzo ${jobs.reduce((a, j) => a + j[1].length, 0)} clips en ${jobs.length} procesos`);
await Promise.all(jobs.map(([S, ids, tag], i) => new Promise(res => {
  setTimeout(() => {
    const out = fs.openSync(`out/par_${S}_${tag}.log`, "a");
    const p = spawn(process.execPath, ["scripts/agnes_vlog.mjs", V + S + ".json", "clips", ...ids], { stdio: ["ignore", out, out], windowsHide: true, env: { ...process.env, AGNES_RETRY_MS: "60000" } });
    log(`${S} ${tag}: ${ids.join(" ")} (pid ${p.pid})`); p.on("exit", c => { log(`${S} ${tag} terminó (${c})`); res(); });
  }, i * 20000);
})));
log("PARALELO TERMINADO");
