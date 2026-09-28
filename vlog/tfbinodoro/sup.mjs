// supervisor de clips tfbinodoro (node, desacoplado con detach.mjs). Cada 3 min:
//  · lanza los clips cuyas 2 anclas ya existen (orden de escenas = prioridad), con tope MIO de procesos en vuelo (MY_MAX);
//    cada proceso además pide slot en el semáforo GLOBAL (D:/rtmp/vlog_slots, VLOG_MAX) que comparten los 6 videos;
//  · `check` por escena completa; regenera UNA vez los ⛔ medidos (no los "(timeout)");
//  · `armar` la escena cuando está completa y sin rojos pendientes.
// log: vlog/tfbinodoro/loop.log · parar: crear vlog/tfbinodoro/STOP
import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
const W = "D:/Proyectos/video2-wt/tfbinodoro", V = "vlog/tfbinodoro";
process.chdir(W);
const env = { ...process.env, VLOG_SLOTS_DIR: "D:/rtmp/vlog_slots", VLOG_MAX: process.env.VLOG_MAX || "12", PYTHONUTF8: "1" };
const MY_MAX = +(process.env.MY_MAX || 6);
const SC = (process.env.SCENES || "T S1 S2 S3 S4 S6 SC S5 S8 S7 S7b S9").split(" ");
const hm = () => new Date().toISOString().slice(11, 16);
const L = m => fs.appendFileSync(`${V}/loop.log`, `${hm()} ${m}\n`);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const J = f => JSON.parse(fs.readFileSync(f, "utf8"));
const plan = s => J(`${V}/plan_${s}.json`);
const st = s => { const f = `out/vlog/${s}/clips/state.json`; return fs.existsSync(f) ? J(f) : {}; };
const running = new Map();
const regen = new Set(fs.existsSync(`${V}/regen.txt`) ? fs.readFileSync(`${V}/regen.txt`, "utf8").split(/\s+/).filter(Boolean) : []);
function launch(s, id, re = false) {
  const out = fs.openSync(`${V}/clips_${s}.log`, "a");
  const ch = spawn(process.execPath, ["scripts/agnes_vlog.mjs", `${V}/plan_${s}.json`, "clips", ...(re ? [id] : [id])], { env, stdio: ["ignore", out, out], windowsHide: true });
  running.set(s + ":" + id, ch);
  ch.on("exit", code => { running.delete(s + ":" + id); if (code) L(`clips ${s} ${id} salió con ${code}`); });
}
for (const ev of ["uncaughtException", "unhandledRejection"]) process.on(ev, e => L("SUP " + ev + ": " + String((e && e.stack) || e).slice(0, 300).replace(/\s+/g, " ")));
L(`SUP arranca pid ${process.pid} · MY_MAX ${MY_MAX}`);
for (;;) {
  try {
    if (fs.existsSync(`${V}/STOP`)) { L("STOP"); break; }
    // 1) lanzar lo que está listo
    for (const s of SC) {
      const p = plan(s), S = st(s), anc = `out/vlog/${s}/anc/`;
      for (const c of p.clips) {
        if (running.size >= MY_MAX) break;
        if (S[c.id] || running.has(s + ":" + c.id)) continue;
        if (!fs.existsSync(anc + c.a + ".png") || !fs.existsSync(anc + c.b + ".png")) continue;
        if (c.audio === undefined && !c.line && !c.secs) continue;
        L(`lanzo ${s}:${c.id}`); launch(s, c.id);
      }
    }
    // 2) check / regen / armar por escena completa
    for (const s of SC) {
      if (s === "T") continue;
      const p = plan(s), S = st(s), full = p.clips.every(c => c.id in S);
      if (!full || fs.existsSync(`out/vlog/${s}/vlog_${s}.mp4`)) continue;
      if (p.clips.some(c => running.has(s + ":" + c.id))) continue;
      const chk = spawnSync(process.execPath, ["scripts/agnes_vlog.mjs", `${V}/plan_${s}.json`, "check"], { env, encoding: "utf8", windowsHide: true, timeout: 30 * 60e3 });
      const txt = (chk.stdout || "") + (chk.stderr || ""); fs.writeFileSync(`${V}/check_${s}.log`, txt);
      const rojos = txt.split("\n").map(l => l.match(/^\S+ (\S+) \[\S+\.mp4\] ⛔ REGENERAR/)).filter(m => m && !m.input.includes('"(timeout)"')).map(m => m[1]);
      const nuevos = process.env.NO_REGEN ? [] : rojos.filter(id => id && !regen.has(s + ":" + id)); // NO_REGEN=1: cupo agnes agotado, se arma con lo que hay
      for (const id of nuevos) { regen.add(s + ":" + id); fs.appendFileSync(`${V}/regen.txt`, s + ":" + id + "\n"); L(`regen ${s} ${id}`); launch(s, id, true); }
      if (!nuevos.length) {
        const a = spawnSync(process.execPath, ["scripts/agnes_vlog.mjs", `${V}/plan_${s}.json`, "armar"], { env, encoding: "utf8", windowsHide: true });
        fs.writeFileSync(`${V}/armar_${s}.log`, (a.stdout || "") + (a.stderr || "")); L(a.status === 0 ? `armado ${s} (rojos que quedan: ${rojos.join(" ") || "-"})` : `ERROR armar ${s}`);
      }
    }
    let t = 0, n = 0; for (const s of SC) { n += plan(s).clips.length; t += Object.keys(st(s)).length; }
    const arm = SC.filter(s => s !== "T" && fs.existsSync(`out/vlog/${s}/vlog_${s}.mp4`)).length;
    let slots = 0; try { slots = fs.readdirSync(env.VLOG_SLOTS_DIR).length; } catch {}
    L(`clips ${t}/${n} · en vuelo ${running.size} · slots globales ocupados ${slots} · armadas ${arm}/${SC.length - 1}`);
    if (arm >= SC.length - 1 && t >= n && !running.size) { L("SUP fin"); break; }
  } catch (e) { L("SUP error vuelta: " + String((e && e.stack) || e).slice(0, 300).replace(/\s+/g, " ")); }
  await sleep(+(process.env.SUP_SLEEP_MS || 180e3));
}
