// tfbpiedra — control de calidad por plan: cuando TODOS los clips de un plan existen → `check`; los ⛔ (palabras, labios,
// cara/luz, salto de pose) se regeneran hasta 2 veces (`clips <id>`: el runner guarda la MEJOR versión); con el plan
// limpio (o sin más intentos) → `armar`. Deja el estado en qc.json. SIEMPRE con run_in_background (hijos adjuntos).
// node vlog/tfbpiedra/qc.mjs [planes separados por coma]
import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/tfbpiedra/", V = R + "vlog/tfbpiedra/";
const PL = process.argv[2] ? process.argv[2].split(",") : ["S2a", "S2b", "S3a", "S3b", "S3c", "S4", "S5a", "S5b", "S6a", "S6b", "S7", "S8a", "S8b", "T"];
const QF = V + "qc.json", Q = fs.existsSync(QF) ? JSON.parse(fs.readFileSync(QF, "utf8")) : {};
const J = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {};
const log = (...a) => fs.appendFileSync(V + "qc.log", new Date().toISOString().slice(11, 19) + " " + a.join(" ") + "\n");
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const run = (args, logf) => spawnSync(process.execPath, ["scripts/agnes_vlog.mjs", ...args], { cwd: R, windowsHide: true, encoding: "utf8", maxBuffer: 1 << 26 }).stdout + "";
for (;;) {
  let pend = 0;
  for (const id of PL) {
    const q = Q[id] ||= { state: "esperando", regen: {} };
    if (q.state === "armado" || q.state === "armar falló") continue; pend++;
    const P = J(V + `plan_${id}.json`), CL = P.dir + "/clips/", st = { ...J(CL + "state.json"), ...J(CL + "state_det.json") };
    if (P.clips.some(c => !st[c.id])) continue;                                    // faltan clips
    if (q.pid && alive(q.pid)) continue;                                            // regeneraciones en curso
    const out = run([`vlog/tfbpiedra/plan_${id}.json`, "check", ...(q.rechecked ? [] : ["--recheck"])]); q.rechecked = true;
    if (/ASR sin saldo|whisper timeout/.test(out)) log(id, "⚠️ ASR no midió algún clip: decide por labios"); fs.writeFileSync(V + `check_${id}.log`, out);
    // regenerar SÓLO lo que se ve/oye mal de verdad: labios de otra frase (corr<0,8), otra cara, o salto de pose.
    // Palabras: si los labios dan corr ≥0,9 el clip dice el tramo (el ASR se equivoca: "he sofragua"); "luz oscura" = falso positivo frecuente → a ojo.
    const malos = out.split(/\r?\n/).map(l => { const m = l.match(/^\S+ (\S+?)(?: \(detalle\))? \[[^\]]+\]/); if (!m) return null;
      const lab = l.match(/labios (✓|⛔) corr ([\d.-]+)/), corr = lab ? +lab[2] : null;
      // "cara NO ES" del juez de visión = falsos positivos frecuentes (medido: s4_02 era él) → sólo se anota para mirarlo a ojo
      if (/NO ES/.test(l)) log(id, "mirar a ojo (visión dice otra cara):", m[1]);
      // salto de pose en un DETALLE en el último 40 %: no se regenera (suele repetirse) → se usa hasta antes del salto, en cámara lenta
      const sj = l.match(/⛔ SALTO de pose en ([\d.]+)s/), det = /\(detalle\)/.test(l);
      if (sj && det) { const tl = P.clips.find(c => c.id === m[1]), len = tl.audio ? Math.max(4, +(tl.len || 0)) : 4; const t = +sj[1];
        const OF = P.dir + "/overrides.json", O = J(OF); if (t >= 3) { O[m[1]] = { ...(O[m[1]] || {}), trimTo: +(t - 0.15).toFixed(2) }; fs.writeFileSync(OF, JSON.stringify(O, null, 1)); log(id, m[1], "salto en", t, "→ trimTo", (t - 0.15).toFixed(2)); return null; } }
      const bad = (lab && lab[1] === "⛔") || (l.includes("⛔ SALTO") && !det) || (sj && det) || (/de más:|falta:/.test(l) && corr != null && corr < 0.9 && /⛔ REGENERAR/.test(l));
      return bad ? m[1] : null; }).filter(Boolean).filter(c => (q.regen[c] || 0) < 2);
    if (id === "T") { q.state = "revisado"; log("T check (se arma en mktimeline)", malos.join(" ")); if (!malos.length) { q.state = "armado"; } }
    const MAX = +(fs.existsSync(V + "max.txt") ? fs.readFileSync(V + "max.txt", "utf8").trim() : 3) || 3;
    const vuelo = new Set([...Object.values(J(V + "launched.json")).map(x => x.pid), ...Object.values(Q).map(x => x.pid)].filter(p => p && alive(p))).size;
    if (malos.length && vuelo >= MAX) { log(id, `espero cupo (${vuelo}/${MAX} en vuelo) para regenerar`, malos.join(" ")); continue; }
    if (malos.length) {
      malos.forEach(c => q.regen[c] = (q.regen[c] || 0) + 1);
      const o = fs.openSync(V + `clips_${id}.log`, "a");
      const ch = spawn(process.execPath, ["scripts/agnes_vlog.mjs", `vlog/tfbpiedra/plan_${id}.json`, "clips", ...malos], { cwd: R, windowsHide: true, stdio: ["ignore", o, o] });
      q.pid = ch.pid; q.state = "regenerando"; log(id, "regenero", malos.join(" "));
    } else if (id !== "T") {
      const a = run([`vlog/tfbpiedra/plan_${id}.json`, "armar"]); fs.writeFileSync(V + `armar_${id}.log`, a);
      q.state = /OK .*✓/.test(a) ? "armado" : "armar falló"; log(id, q.state, (a.match(/OK [^\n]*/) || [a.slice(-200)])[0]);
    }
    fs.writeFileSync(QF, JSON.stringify(Q, null, 1));
  }
  if (!pend) { log("TODO ARMADO"); break; }
  if (process.env.ONCE) break; // una pasada (a mano, sin loop de fondo)
  await new Promise(r => setTimeout(r, 120000));
}
