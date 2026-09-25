// supervisor en Node (sin bash de Git: su fork falla cuando corre oculto/programado). Mismo flujo que sup.sh:
// lanza faltantes, check por escena, regen 1 vez los rojos medidos, armar escena completa sin rojos, foley gate.
// Arranca con la tarea programada `falaurel_sup` (wscript oculto). log: vlog/falaurel/loop.log
import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
const W = "D:/Proyectos/video2-wt/falaurel", V = "vlog/falaurel";
process.chdir(W);
const env = { ...process.env, VLOG_SLOTS_DIR: "D:/rtmp/vlog_slots", VLOG_MAX: "12", PYTHONUTF8: "1" };
const SC = "S1 S2 S3 S4 S5 S6 S7 S8 S9 S10 S11 S12 S13".split(" ");
const hm = () => new Date().toISOString().slice(11, 16);
const L = m => fs.appendFileSync(`${V}/loop.log`, `${hm()} ${m}\n`);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const J = f => JSON.parse(fs.readFileSync(f, "utf8"));
const st = s => { const f = `${V}/${s}/clips/state.json`; return fs.existsSync(f) ? J(f) : {}; };
const running = new Map(); // clipId -> child
function launch(s, ids) {
  const out = fs.openSync(`${V}/clips_${s}.log`, "a");
  const ch = spawn("node", ["scripts/agnes_vlog.mjs", `${V}/plan_${s}.json`, "clips", ...ids], { env, stdio: ["ignore", out, out], windowsHide: true });
  ids.forEach(id => running.set(id, ch));
  ch.on("exit", code => { ids.forEach(id => running.delete(id)); if (code) L(`clips ${s} salió con ${code} (${ids.join(" ")})`); });
}
function faltan(s) {
  const r = spawnSync("python", [`${V}/ready.py`, s], { env, encoding: "utf8" });
  return (r.stdout || "").trim().split(/\s+/).filter(Boolean).filter(id => !running.has(id));
}
const regen = new Set(fs.existsSync(`${V}/regen.txt`) ? fs.readFileSync(`${V}/regen.txt`, "utf8").split(/\s+/).filter(Boolean) : []);
for (const ev of ["uncaughtException", "unhandledRejection"]) process.on(ev, e => { L("SUP " + ev + ": " + String((e && e.stack) || e).slice(0, 400).replace(/\s+/g, " ")); });
process.on("exit", c => L("SUP exit " + c));
L(`SUP(node) arranca pid ${process.pid}`);
for (;;) { try {
  // faltantes (también relanza los que murieron por red: ready.py = sin state y no corriendo)
  for (const s of [...SC, "T"]) { const ids = faltan(s); if (ids.length) { L(`lanzo ${s}:${ids.join(" ")}`); launch(s, ids); } }
  for (const s of SC) {
    const chk = spawnSync("node", ["scripts/agnes_vlog.mjs", `${V}/plan_${s}.json`, "check"], { env, encoding: "utf8", windowsHide: true, timeout: 20 * 60e3 });
    const txt = (chk.stdout || "") + (chk.stderr || ""); fs.writeFileSync(`${V}/check_${s}.log`, txt);
    const rojos = txt.split("\n").filter(l => l.includes("REGENERAR"));
    for (const l of rojos) {
      if (l.includes('"(timeout)"')) continue;
      const id = l.trim().split(/\s+/)[1];
      if (id && !regen.has(id) && !running.has(id)) { regen.add(id); fs.appendFileSync(`${V}/regen.txt`, id + "\n"); L(`regen ${s} ${id}`); launch(s, [id]); }
    }
    const p = J(`${V}/plan_${s}.json`), S = st(s), full = p.clips.every(c => c.id in S);
    const armado = fs.existsSync(`${V}/${s}/vlog_${s}.mp4`);
    if (full && !rojos.length && !armado) {
      const a = spawnSync("node", ["scripts/agnes_vlog.mjs", `${V}/plan_${s}.json`, "armar"], { env, encoding: "utf8", windowsHide: true });
      fs.writeFileSync(`${V}/armar_${s}.log`, (a.stdout || "") + (a.stderr || "")); L(a.status === 0 ? `armado ${s}` : `ERROR armar ${s}`);
    } else if (full && rojos.length && !armado) L(`${s} completa pero con ${rojos.length} rojo(s): ${rojos.map(l => l.trim().split(/\s+/)[1]).join(" ")}`);
  }
  try {
    const g = spawnSync("python", ["prep_gate.py"], { cwd: `${V}/foley`, env, encoding: "utf8" });
    if (Number((g.stdout || "0").trim().split(/\s+/)[0]) >= 4) {
      spawnSync("python", ["mask_faces.py", "jobs_gate.json", "masked_gate"], { cwd: `${V}/foley`, env });
      const m = spawnSync("modal", ["run", "modal_mmaudio.py", "--jobs", "masked_gate/jobs_masked.json", "--outdir", "out_gate"], { cwd: `${V}/foley`, env, encoding: "utf8", windowsHide: true });
      fs.appendFileSync(`${V}/foley/run_gate.log`, (m.stdout || "") + (m.stderr || ""));
    }
  } catch (e) { L("foley gate error " + e.message); }
  let t = 0, n = 0; for (const s of [...SC, "T"]) { n += J(`${V}/plan_${s}.json`).clips.length; t += Object.keys(st(s)).length; }
  const arm = SC.filter(s => fs.existsSync(`${V}/${s}/vlog_${s}.mp4`)).length;
  L(`${t} ${n} · en vuelo ${running.size} · armadas ${arm}/13`);
  if (arm >= 13 && !running.size) { L("SUP fin: 13/13 armadas"); break; }
  } catch (e) { L("SUP error vuelta: " + String((e && e.stack) || e).slice(0, 300).replace(/\s+/g, " ")); }
  await sleep(300e3);
}
