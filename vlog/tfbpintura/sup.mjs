// sup.mjs — supervisor de clips: cada 60 s lanza los clips cuyas anclas YA existen (sin esperar a que terminen
// todas las rondas del Batch), con tope de clips en vuelo (cola de agnes compartida con otros agentes).
// node vlog/tfbpintura/sup.mjs [MAXF=10]  · log en vlog/tfbpintura/sup.log · estado en vlog/tfbpintura/sup_state.json
// Pausa: crear vlog/tfbpintura/sup.pause  ·  Excluir ids: vlog/tfbpintura/sup_hold.txt (uno por línea)
import fs from "fs"; import { spawn } from "child_process";
const V = "vlog/tfbpintura/", MAXF = +(process.argv[2] || 10), GROUP = 3;
const SF = V + "sup_state.json", st = fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, "utf8")) : { launched: {} };
const log = (...a) => fs.appendFileSync(V + "sup.log", new Date().toISOString().slice(11, 19) + " " + a.join(" ") + "\n");
const running = new Map(); // pid -> {ids}
const J = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
function tick() {
  if (fs.existsSync(V + "sup.pause")) return;
  const hold = new Set(fs.existsSync(V + "sup_hold.txt") ? fs.readFileSync(V + "sup_hold.txt", "utf8").split(/\s+/).filter(Boolean) : []);
  let inflight = [...running.values()].reduce((s, r) => s + r.ids.length, 0);
  const plans = fs.readdirSync(V).filter(f => /^plan_\w+\.json$/.test(f)).sort();
  let pending = 0;
  for (const pf of plans) {
    const P = JSON.parse(fs.readFileSync(V + pf, "utf8")), ANC = P.dir + "anc/", CL = P.dir + "clips/";
    const done = { ...J(CL + "state.json"), ...J(CL + "state_det.json") };
    const ready = P.clips.filter(c => !done[c.id] && !st.launched[c.id] && !hold.has(c.id) && (c.audio || c.line || c.secs) &&
      (c.detail ? fs.existsSync(ANC + `D_${c.id}_1.png`) && fs.existsSync(ANC + `D_${c.id}_2.png`) : fs.existsSync(ANC + c.a + ".png") && fs.existsSync(ANC + c.b + ".png")));
    pending += P.clips.filter(c => !done[c.id]).length;
    while (ready.length && inflight < MAXF) {
      const ids = ready.splice(0, Math.min(GROUP, MAXF - inflight)).map(c => c.id);
      const out = fs.openSync(V + `clips_${pf.slice(5, -5)}.log`, "a");
      const ch = spawn(process.execPath, ["scripts/agnes_vlog.mjs", V + pf, "clips", ...ids], { stdio: ["ignore", out, out], windowsHide: true });
      running.set(ch.pid, { ids }); inflight += ids.length; ids.forEach(i => st.launched[i] = Date.now());
      log("lanzo", pf, ids.join(" "), "pid", ch.pid, "· en vuelo", inflight);
      ch.on("exit", code => { running.delete(ch.pid); log("terminó pid", ch.pid, ids.join(" "), "code", code);
        // si no quedó archivo, se puede volver a lanzar
        const d = { ...J(P.dir + "clips/state.json"), ...J(P.dir + "clips/state_det.json") };
        ids.forEach(i => { if (!d[i]) { st.fails = st.fails || {}; st.fails[i] = (st.fails[i] || 0) + 1; if (st.fails[i] < 3) { delete st.launched[i]; log("⚠ sin clip", i, "→ se relanza"); } else log("⛔ sin clip 3 veces", i, "→ queda afuera"); } }); fs.writeFileSync(SF, JSON.stringify(st)); });
    }
  }
  fs.writeFileSync(SF, JSON.stringify(st));
  if (!pending && !running.size) { log("TODO LISTO"); process.exit(0); }
}
// adoptar procesos `clips` que ya corren (de un sup anterior): cuentan en vuelo y se vigilan por PID
import { execSync } from "child_process";
try {
  const ps = execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object Name -eq 'node.exe' | ForEach-Object { [string]$_.ProcessId + ' ' + $_.CommandLine } | Out-String -Width 8000"`, { encoding: "utf8", windowsHide: true });
  for (const ln of ps.split(/\r?\n/)) { const m = ln.match(/^(\d+) .*agnes_vlog\.mjs (vlog\/tfbpintura\/plan_\w+\.json) clips (.+)$/); if (!m) continue;
    const ids = m[3].trim().split(/\s+/), P = JSON.parse(fs.readFileSync(m[2], "utf8")); running.set(+m[1], { ids, P, adopt: true }); ids.forEach(i => st.launched[i] = Date.now()); }
} catch (e) { log("no pude listar procesos", e.message); }
setInterval(() => { for (const [pid, r] of running) { if (!r.adopt) continue; try { process.kill(pid, 0); } catch { running.delete(pid); log("terminó (adoptado) pid", pid, r.ids.join(" "));
  const d = { ...J(r.P.dir + "clips/state.json"), ...J(r.P.dir + "clips/state_det.json") }; r.ids.forEach(i => { if (!d[i]) delete st.launched[i]; }); } } }, 30000);
log("sup arranca MAXF", MAXF, "· adoptados", [...running.values()].reduce((s, r) => s + r.ids.length, 0));
tick(); setInterval(tick, 60000);
