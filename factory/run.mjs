#!/usr/bin/env node
// run.mjs — LA FÁBRICA. Un solo motor para todos los videos. Plan: factory/PLAN_FABRICA.md
//
//   node factory/run.mjs run <slug> [--from <fase>] [--only <fase>]   corre/reanuda el video
//   node factory/run.mjs status [<slug>]                              estado por fase (medido)
//   node factory/run.mjs new <slug> --canal <c> --modo avatar|narrador --guion <txt> --voz <id>
//                            [--face <png>] [--idioma es] --cta-ancla "<frase>" --cta-head "<texto>"
//   node factory/run.mjs queue add <slug> | queue ls                  cola de videos
//   node factory/run.mjs worker [--n 3]                               procesa la cola en paralelo
//   node factory/run.mjs leases                                       uso de recursos compartidos
//   node factory/run.mjs gc [--apply]                                 libera derivados de videos ENTREGADOS
//   node factory/run.mjs test | guard
//
// Exit: 0 terminado · 2 espera algo creativo/humano (needs) · 3 bloqueado (plata/disco) · 1 falló
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/env.mjs";
import { State, hashInputs } from "./lib/state.mjs";
import { slugPaths, STATE_ROOT, WORK_ROOT, insideSlug } from "./lib/paths.mjs";
import { loadSpec, validateSpec } from "./lib/spec.mjs";
import { logger, NeedsError, BlockedError } from "./lib/phase.mjs";
import { usage, CAPACIDAD } from "./lib/lease.mjs";
import { run as exec } from "./lib/exec.mjs";

process.chdir(ROOT);   // los scripts compartidos (agnes_qc, farm) usan rutas relativas a video2

const PHASE_FILES = ["00_preflight", "10_voice", "15_frases", "20_asr", "30_direct", "40_images", "45_stock", "50_agnes", "55_avatar", "60_build", "70_gates", "80_render", "90_deliver"];
async function loadPhases() {
  const out = [];
  for (const f of PHASE_FILES) out.push((await import(`./phases/${f}.mjs`)).default);
  return out;
}

const args = process.argv.slice(2);
const flag = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const cmd = args[0];

async function runSlug(slug, { from, only } = {}) {
  const spec = loadSpec(slug);
  const P = slugPaths(slug);
  const state = new State(slug);
  const phases = await loadPhases();
  const ids = phases.map((p) => p.id);
  for (const x of [from, only].filter(Boolean)) if (!ids.includes(x)) throw new Error(`fase desconocida "${x}" (${ids.join(", ")})`);
  if (from) for (const p of phases.slice(ids.indexOf(from))) state.reset(p.id);
  const base = { slug, spec, style: spec.style, P, state };
  const status = new Map();
  const running = new Map();
  const t0 = Date.now();

  const done = (id) => ["done", "skipped"].includes(status.get(id));
  const terminal = (id) => ["done", "skipped", "failed", "needs", "blocked", "waiting"].includes(status.get(id));

  for (;;) {
    for (const ph of phases) {
      if (status.has(ph.id) || running.has(ph.id)) continue;
      if (only && ph.id !== only) {
        const s = state.get(ph.id);
        status.set(ph.id, s?.status === "done" ? "done" : ph.applies && !ph.applies(base) ? "skipped" : "waiting");
        continue;
      }
      const depsMal = ph.deps.filter((d) => ["failed", "needs", "blocked", "waiting"].includes(status.get(d)));
      if (depsMal.length) { status.set(ph.id, "waiting"); continue; }
      if (!ph.deps.every(done)) continue;
      const ctx = { ...base, log: logger(slug, ph.id) };
      if (ph.applies && !ph.applies(ctx)) { status.set(ph.id, "skipped"); state.set(ph.id, { status: "skipped" }); continue; }
      let h;
      try { h = hashInputs(ph.inputs(ctx)); } catch (e) { h = `err:${e.message}`; }
      // ⛔⛔ (15-sep-2026) `--from X` y los imports del legado: una fase ANTERIOR a X que ya está `done` (o importada)
      // se CONFÍA tal cual — nunca se rehace por diferencia de hash. Rehacerla re-generó la voz de tcestufa y pisó su máster.
      const prev = state.get(ph.id);
      const antesDeFrom = from && ids.indexOf(ph.id) < ids.indexOf(from);
      if (prev?.status === "done" && (antesDeFrom || prev.inputsHash === "legacy-import")) {
        status.set(ph.id, "done"); ctx.log(`✓ confiada (${antesDeFrom ? `anterior a --from ${from}` : "importada del legado"})`); continue;
      }
      if (antesDeFrom) { status.set(ph.id, "failed"); state.set(ph.id, { ...(prev || {}), status: prev?.status || "failed", error: `--from ${from} exige que ${ph.id} ya esté hecha (está ${prev?.status || "sin estado"}): no se rehace sola` }); ctx.log(`✗ --from ${from} pero ${ph.id} no está hecha: no la rehago`); continue; }
      if (state.isFresh(ph.id, h)) {
        // ⛔ El hash de INPUTS no ve el disco: si alguien borró las salidas para regenerarlas, la fase
        // se salteaba con "✓ fresca" y su compuerta —que vive DENTRO de la fase— nunca llegaba a correr
        // (medido en cmealter: 115 imágenes borradas, la fase no miró y el montaje se iba con las viejas).
        // `verify` es opcional: sin él, el comportamiento es el de antes.
        let falta = null;
        if (ph.verify) { try { falta = await ph.verify(ctx); } catch (e) { falta = e.message; } }
        if (!falta) { status.set(ph.id, "done"); ctx.log(`✓ fresca (${JSON.stringify(state.get(ph.id).medido || {}).slice(0, 140)})`); continue; }
        ctx.log(`↻ estaba done pero sus salidas no están: ${falta} — la rehago`);
      }
      ctx.log("▶ arranca");
      state.set(ph.id, { ...(state.get(ph.id) || {}), status: "running", inputsHash: h });
      const t = Date.now();
      running.set(ph.id, ph.run(ctx).then((medido) => {
        state.set(ph.id, { status: "done", inputsHash: h, medido, ms: Date.now() - t });
        status.set(ph.id, "done");
        ctx.log(`✓ hecha en ${Math.round((Date.now() - t) / 1000)} s`);
      }).catch((e) => {
        const st = e instanceof NeedsError ? "needs" : e instanceof BlockedError ? "blocked" : "failed";
        state.set(ph.id, { status: st, inputsHash: h, error: e.message, instrucciones: e.instrucciones, detalle: e.detail || e.detalle, ms: Date.now() - t, runId: state.get(ph.id)?.runId });
        status.set(ph.id, st);
        ctx.log(`${st === "needs" ? "⏸ NEEDS" : st === "blocked" ? "⛔ BLOCKED" : "✗ FAILED"}: ${e.message}`);
        if (e.instrucciones) ctx.log(`   → ${e.instrucciones}`);
        if (st === "failed" && e.stack && process.env.FACTORY_DEBUG) console.error(e.stack);
      }).finally(() => running.delete(ph.id)));
    }
    if (!running.size) break;
    await Promise.race(running.values());
  }
  const res = phases.map((p) => ({ fase: p.id, status: status.get(p.id) || "pending" }));
  console.log(`\n=== ${slug} · ${Math.round((Date.now() - t0) / 1000)} s ===`);
  for (const r of res) console.log(`  ${r.fase.padEnd(13)} ${r.status}`);
  if (res.some((r) => r.status === "failed")) return 1;
  if (res.some((r) => r.status === "blocked")) return 3;
  if (res.some((r) => r.status === "needs")) return 2;
  return res.every((r) => ["done", "skipped"].includes(r.status)) || only ? 0 : 2;
}

function printStatus(slug) {
  const slugs = slug ? [slug] : (fs.existsSync(STATE_ROOT()) ? fs.readdirSync(STATE_ROOT()) : []);
  if (!slugs.length) { console.log("sin videos en la fábrica"); return; }
  for (const s of slugs) {
    const st = new State(s).all();
    const ult = st.filter((x) => x.status !== "done" && x.status !== "skipped")[0];
    console.log(`${s}: ${st.filter((x) => x.status === "done").length}/${PHASE_FILES.length} hechas${ult ? ` · ${ult.fase} ${ult.status}${ult.error ? ": " + ult.error.slice(0, 120) : ""}` : ""}`);
    if (slug) for (const x of st) {
      console.log(`  ${String(x.fase).padEnd(13)} ${String(x.status).padEnd(8)} ${x.ms ? Math.round(x.ms / 1000) + " s" : ""} ${x.medido ? JSON.stringify(x.medido).slice(0, 220) : x.error || ""}`);
      if (x.instrucciones) console.log(`                → ${x.instrucciones}`);
    }
  }
}

// ---------- cola ----------
const QDIR = () => path.join(WORK_ROOT(), "_queue");
function qAdd(slug) {
  loadSpec(slug);
  fs.mkdirSync(QDIR(), { recursive: true });
  const f = path.join(QDIR(), `${slug}.json`);
  if (!fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify({ slug, ts: Date.now(), estado: "pendiente" }));
  console.log(`encolado ${slug}`);
}
const qList = () => (fs.existsSync(QDIR()) ? fs.readdirSync(QDIR()).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(QDIR(), f), "utf8"))).sort((a, b) => a.ts - b.ts) : []);
function qSet(slug, patch) { const f = path.join(QDIR(), `${slug}.json`); fs.writeFileSync(f, JSON.stringify({ ...JSON.parse(fs.readFileSync(f, "utf8")), ...patch })); }

async function worker(n) {
  const activos = new Map();
  const CODE = { 0: "entregado", 1: "fallado", 2: "espera", 3: "bloqueado" };
  console.log(`worker: hasta ${n} videos a la vez (los recursos los arbitran los leases)`);
  for (;;) {
    for (const it of qList()) {
      if (activos.size >= n) break;
      if (it.estado !== "pendiente" || activos.has(it.slug)) continue;
      qSet(it.slug, { estado: "corriendo", desde: Date.now() });
      activos.set(it.slug, exec(process.execPath, [path.join(ROOT, "factory", "run.mjs"), "run", it.slug], { timeoutMs: 48 * 3600_000, allowFail: true, onLine: (l) => console.log(l) })
        .then((r) => { qSet(it.slug, { estado: CODE[r.code] || "fallado", code: r.code, hasta: Date.now() }); console.log(`worker: ${it.slug} → ${CODE[r.code]}`); })
        .finally(() => activos.delete(it.slug)));
    }
    if (!activos.size && !qList().some((x) => x.estado === "pendiente")) { console.log("worker: cola vacía"); return; }
    await Promise.race([...activos.values(), new Promise((r) => setTimeout(r, 30_000))]);
  }
}

// ---------- gc: sólo derivados REGENERABLES de videos ENTREGADOS, nunca assets pagos ----------
function gc(apply) {
  const slugs = fs.existsSync(STATE_ROOT()) ? fs.readdirSync(STATE_ROOT()) : [];
  let total = 0;
  for (const slug of slugs) {
    const d = new State(slug).get("90_deliver");
    if (d?.status !== "done") continue;
    const P = slugPaths(slug);
    const borrables = [P.rawMp4, path.join(P.work, "png"), path.join(P.avatarDir, "parte1.mp4"), path.join(P.avatarDir, "parte1_trim.mp4"), path.join(P.avatarDir, "parte2.mp4"), P.wav16k];
    // I8: restos del camino VIEJO en la raíz de D: (medido 15-sep: .h264, _entrega/_farm/_vN.mp4, chunks_*, tars partidos)
    const legado = [];
    try {
      const re = new RegExp(`^(${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(\\.h264|_v\\.h264|_v\\d*\\.h264|_(entrega|farm|farm_v\\d+|final|fix|stitched|vid|v\\d+[a-z]?|pts)\\.mp4|_concat\\.txt|_fish\\.wav)$|^chunks[_-]${slug}$|^assets-${slug}\\.tar(\\.part\\d+|\\.delta\\d*)?$`);
      for (const f of fs.readdirSync("D:/")) if (re.test(f)) legado.push(path.join("D:/", f));
    } catch { /* sin D: */ }
    for (const b of [...borrables, ...legado]) {
      if (!fs.existsSync(b) || (!insideSlug(slug, b) && !legado.includes(b))) continue;
      const size = fs.statSync(b).isDirectory() ? fs.readdirSync(b).reduce((a, f) => a + fs.statSync(path.join(b, f)).size, 0) : fs.statSync(b).size;
      total += size;
      console.log(`${apply ? "borro" : "borraría"} ${(size / 1048576).toFixed(0)} MB  ${b}`);
      if (apply) fs.rmSync(b, { recursive: true, force: true });
    }
  }
  console.log(`${apply ? "liberados" : "liberables"}: ${(total / 1073741824).toFixed(2)} GB (sólo videos con 90_deliver done; nunca img/broll/avatar pagos)`);
}

function nuevo(slug) {
  const spec = {
    slug, canal: flag("--canal"), modo: flag("--modo"), idioma: flag("--idioma") || "es", guion: flag("--guion"),
    voz: { id: flag("--voz") }, cta: { head: flag("--cta-head"), ancla: flag("--cta-ancla"), ...(flag("--cta-sub") ? { sub: flag("--cta-sub") } : {}) },
    ...(flag("--face") ? { avatar: { face: flag("--face") } } : {}),
    ...(flag("--card") ? { bagasy: { channelKey: flag("--channel"), cardId: flag("--card") } } : {}),
  };
  const errs = validateSpec(spec);
  if (errs.length) { console.error("spec inválido:\n  - " + errs.join("\n  - ")); process.exit(1); }
  const f = path.join(ROOT, "factory", "specs", `${slug}.json`);
  if (fs.existsSync(f)) { console.error(`ya existe ${f}`); process.exit(1); }
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(spec, null, 2) + "\n");
  loadSpec(slug);
  console.log(`spec creado: ${f}\nsiguiente: node factory/run.mjs run ${slug}`);
}

const HELP = fs.readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1).filter((l, i, a) => a.slice(0, i + 1).every((x) => x.startsWith("//"))).map((l) => l.replace(/^\/\/ ?/, "")).join("\n");

try {
  if (!cmd || cmd === "help" || cmd === "--help") { console.log(HELP); console.log("fases: " + PHASE_FILES.join(" → ")); process.exit(0); }
  if (cmd === "run") process.exit(await runSlug(args[1], { from: flag("--from"), only: flag("--only") }));
  if (cmd === "status") { printStatus(args[1]); process.exit(0); }
  if (cmd === "reset") {
    // Rehacer UNA fase sin arrastrar las de atrás. `--only` respeta el hash (no rehace nada) y
    // `--from` resetea todo lo que viene después, que con el avatar corriendo en paralelo no sirve.
    // Antes de esto había que borrar el json de estado a mano.
    const [, slug, fase] = args;
    if (!slug || !fase) { console.error("uso: node factory/run.mjs reset <slug> <fase> - fases: " + PHASE_FILES.join(" ")); process.exit(1); }
    if (!PHASE_FILES.includes(fase)) { console.error(`fase desconocida "${fase}" - fases: ` + PHASE_FILES.join(" ")); process.exit(1); }
    const st = new State(slug);
    const prev = st.get(fase);
    if (!prev) { console.log(`${slug}/${fase} ya estaba sin estado: nada que resetear`); process.exit(0); }
    if (prev.status === "running" && !args.includes("--force")) {
      console.error(`${slug}/${fase} está RUNNING: resetearla ahora deja dos corridas pisándose. Esperá a que termine, o --force si sabés que el proceso está muerto.`);
      process.exit(1);
    }
    st.reset(fase);
    console.log(`${slug}/${fase} reseteada (estaba ${prev.status}). Se rehace en la próxima corrida: node factory/run.mjs run ${slug}`);
    process.exit(0);
  }
  if (cmd === "new") { nuevo(args[1]); process.exit(0); }
  if (cmd === "queue") { if (args[1] === "add") qAdd(args[2]); else for (const q of qList()) console.log(`${q.slug.padEnd(20)} ${q.estado}`); process.exit(0); }
  if (cmd === "worker") { await worker(Number(flag("--n") || 3)); process.exit(0); }
  if (cmd === "leases") { for (const r of Object.keys(CAPACIDAD)) { const u = usage(r); console.log(`${r.padEnd(13)} ${u.usado}/${u.capacidad} ${u.holders.join(", ")}`); } process.exit(0); }
  if (cmd === "gc") { gc(args.includes("--apply")); process.exit(0); }
  if (cmd === "test") { const r = await exec(process.execPath, ["--test", ...fs.readdirSync("factory/tests").filter((f) => f.endsWith(".test.mjs")).map((f) => `factory/tests/${f}`)],{ timeoutMs: 20 * 60_000, allowFail: true, onLine: (l) => console.log(l) }); process.exit(r.code); }
  if (cmd === "guard") { const r = await exec(process.execPath, ["factory/tools/guard.mjs"], { timeoutMs: 10 * 60_000, allowFail: true, onLine: (l) => console.log(l) }); process.exit(r.code); }
  console.error(`comando desconocido "${cmd}"\n\n${HELP}`);
  process.exit(1);
} catch (e) {
  console.error("✗ " + e.message);
  process.exit(1);
}
