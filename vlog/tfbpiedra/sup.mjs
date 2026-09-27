// tfbpiedra — supervisor de clips: cada 60 s lanza los clips cuyas anclas ya existen (a y b), con un tope de clips
// EN VUELO propios (la cola de agnes es compartida con otros 5 agentes). Un proceso del runner por tanda.
// SIEMPRE con run_in_background del Bash tool (nunca nohup/detached).
// node vlog/tfbpiedra/sup.mjs [MAX=10] [planes separados por coma (default: todos menos SETS)]
import fs from "node:fs";
import { spawn } from "node:child_process";
const R = "D:/Proyectos/video2-wt/tfbpiedra/", V = R + "vlog/tfbpiedra/";
const MAX = +(process.argv[2] || 10);
const PL = (process.argv[3] ? process.argv[3].split(",") : fs.readdirSync(V).filter(f => /^plan_.*\.json$/.test(f) && f !== "plan_SETS.json").map(f => f.slice(5, -5)));
const LF = V + "launched.json"; const L = fs.existsSync(LF) ? JSON.parse(fs.readFileSync(LF, "utf8")) : {};
const J = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
const log = (...a) => fs.appendFileSync(V + "sup.log", new Date().toISOString().slice(11, 19) + " " + a.join(" ") + "\n");
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
for (;;) {
  let enVuelo = 0, hechos = 0, total = 0; const listos = [], ocupado = new Set();
  const HOLD = new Set(J(V + "hold.json").list || []); // "plan:clip" retenidos (anclas a rehacer)
  for (const id of PL) {
    const P = JSON.parse(fs.readFileSync(V + `plan_${id}.json`, "utf8")), CL = P.dir + "/clips/", ANC = P.dir + "/anc/";
    const st = { ...J(CL + "state.json"), ...J(CL + "state_det.json") };
    for (const c of P.clips) {
      total++; const k = id + ":" + c.id;
      if (st[c.id]) { hechos++; continue; }
      if (HOLD.has(k)) continue;
      if (L[k] && L[k].pid && alive(L[k].pid)) { enVuelo++; ocupado.add(id); continue; }
      if (L[k] && L[k].pid && !alive(L[k].pid)) { L[k].fails = (L[k].fails || 0) + 1; delete L[k].pid; }
      if (L[k] && (L[k].fails || 0) >= 4) continue;
      const ok = [c.a, c.b].every(n => fs.existsSync(ANC + n + ".png")) && (!c.audio || fs.existsSync(c.audio));
      if (ok) listos.push([id, c.id]);
    }
  }
  // un solo proceso del runner por plan a la vez (state.json se reescribe entero: dos procesos del mismo plan se pisan)
  const cupo = Math.max(0, MAX - enVuelo), lanzar = listos.filter(([p]) => !ocupado.has(p)).slice(0, cupo);
  const porPlan = {}; for (const [p, c] of lanzar) (porPlan[p] ||= []).push(c);
  for (const [p, ids] of Object.entries(porPlan)) {
    const out = fs.openSync(V + `clips_${p}.log`, "a");
    const ch = spawn(process.execPath, ["scripts/agnes_vlog.mjs", `vlog/tfbpiedra/plan_${p}.json`, "clips", ...ids], { cwd: R, windowsHide: true, stdio: ["ignore", out, out] }); // hijo ADJUNTO (sin detached): muere con el supervisor, sin consolas huérfanas
    for (const c of ids) L[p + ":" + c] = { ...(L[p + ":" + c] || {}), pid: ch.pid, t: Date.now() };
    log("lanzo", p, ids.join(" "), "pid", ch.pid);
  }
  fs.writeFileSync(LF, JSON.stringify(L, null, 1));
  log(`hechos ${hechos}/${total} · en vuelo ${enVuelo + lanzar.length} · listos sin lanzar ${listos.length - lanzar.length}`);
  if (hechos === total) { log("TODOS LOS CLIPS"); break; }
  await new Promise(r => setTimeout(r, 60000));
}
