// Pruebas de los cimientos (A2–A6, B1, B4). Correr: node --test factory/tests
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { run, lumaMedia, ExecError } from "../lib/exec.mjs";
import { assertMeasured, assertNoProblems, GateError, GateReport } from "../lib/gate.mjs";
import { State, hashInputs } from "../lib/state.mjs";
import { tryAcquire, usage } from "../lib/lease.mjs";
import { gh, esRateLimit } from "../lib/gh.mjs";
import { validateSpec } from "../lib/spec.mjs";
import { insideSlug, slugPaths } from "../lib/paths.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "factory-test-"));
const hasFfmpeg = (() => { try { return !!fs.statSync; } catch { return false; } })();
const silent = () => {};

// ---------- A2 exec ----------
test("exec: exit≠0 tira con la cola del log", async () => {
  await assert.rejects(run("node", ["-e", "console.error('boom'); process.exit(3)"], { timeoutMs: 20_000 }), (e) => e instanceof ExecError && e.code === 3 && /boom/.test(e.message));
});
test("exec: timeout mata el proceso colgado", async () => {
  await assert.rejects(run("node", ["-e", "setTimeout(()=>{}, 60000)"], { timeoutMs: 800 }), (e) => e.timedOut === true);
});
test("exec: exit 0 SIN la marca esperada es fallo (el caso farm.mjs)", async () => {
  await assert.rejects(run("node", ["-e", "console.log('nada que ver')"], { timeoutMs: 20_000, expect: /✅ listo/ }), /SIN la marca/);
});
test("exec: timeoutMs es obligatorio", () => {
  assert.throws(() => run("node", ["-v"], {}), /timeoutMs es obligatorio/);
});
test("exec: la luma se lee de STDERR (el bug de luma=0 en verde)", { skip: !hasFfmpeg }, async () => {
  const d = tmp();
  const gris = path.join(d, "gris.mp4");
  const negro = path.join(d, "negro.mp4");
  await run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x808080:s=320x180:d=2:r=30", "-pix_fmt", "yuv420p", gris], { timeoutMs: 60_000 });
  await run("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "color=c=black:s=320x180:d=2:r=30", "-pix_fmt", "yuv420p", negro], { timeoutMs: 60_000 });
  const g = await lumaMedia(gris);
  const n = await lumaMedia(negro);
  assert.ok(g.n >= 2, "midió cuadros");
  assert.ok(g.media > 100, `gris debe dar luma alta, dio ${g.media}`);
  assert.ok(n.media < 25, `negro debe dar luma baja, dio ${n.media}`);
});

// ---------- A3 gate ----------
test("gate: 0 sin allowZero tira", () => assert.throws(() => assertMeasured("x", 0, { log: silent }), GateError));
test("gate: NaN / undefined / lista vacía tiran", () => {
  for (const v of [NaN, undefined, null, []]) assert.throws(() => assertMeasured("x", v, { log: silent }), GateError);
});
test("gate: fuera de rango tira, adentro pasa", () => {
  assert.throws(() => assertMeasured("cob", 60, { min: 90, log: silent }), /fuera de rango/);
  assert.equal(assertMeasured("cob", 95, { min: 90, total: 100, log: silent }).ok, true);
});
test("gate: 0 con allowZero pasa (p.ej. destellos=0)", () => assert.equal(assertMeasured("destellos", 0, { allowZero: true, max: 0, log: silent }).ok, true));
test("gate: '0 problemas' sin inspeccionar nada es fallo", () => {
  assert.throws(() => assertNoProblems("assets", [], 0, { log: silent }), /inspeccionó 0/);
  assert.equal(assertNoProblems("assets", [], 12, { log: silent }).ok, true);
});
test("gate: total vacío tira", () => assert.throws(() => assertMeasured("x", 5, { total: 0, log: silent }), /total/));
test("gate report: markdown y ok global", () => {
  const r = new GateReport();
  r.check("a", () => assertMeasured("a", 5, { log: silent }));
  r.check("b", () => assertMeasured("b", 0, { log: silent }));
  assert.equal(r.ok, false);
  assert.match(r.markdown(), /NO PASA/);
});

// ---------- A4 state ----------
test("state: done + mismo hash = fresco; cambia input = rehacer", () => {
  const d = tmp();
  const f = path.join(d, "in.txt"); fs.writeFileSync(f, "uno");
  const s = new State("prueba", { dir: path.join(d, "st") });
  const h1 = hashInputs([f, { x: 1 }]);
  s.set("10_voice", { status: "done", inputsHash: h1, medido: { durSec: 12 } });
  assert.equal(s.isFresh("10_voice", h1), true);
  fs.writeFileSync(f, "dos");
  assert.equal(s.isFresh("10_voice", hashInputs([f, { x: 1 }])), false);
  s.set("20_asr", { status: "failed", inputsHash: "z" });
  assert.equal(s.isFresh("20_asr", "z"), false);
  assert.equal(s.all().length, 2);
});

// ---------- B1 lease ----------
test("lease: nunca supera la capacidad; vencido se libera solo", async () => {
  const dir = tmp();
  const a = await tryAcquire("agnes", "slugA", 2, { dir, capacidad: 3, ttlMs: 60_000 });
  assert.ok(a);
  const b = await tryAcquire("agnes", "slugB", 2, { dir, capacidad: 3, ttlMs: 60_000 });
  assert.equal(b, null, "no debe dar 4/3");
  a.release();
  const c = await tryAcquire("agnes", "slugB", 2, { dir, capacidad: 3, ttlMs: 150 });
  assert.ok(c);
  c.release();
  // lease "muerto" escrito a mano, vencido
  fs.writeFileSync(path.join(dir, "agnes", "muerto.json"), JSON.stringify({ holder: "muerto", units: 3, expiresAt: Date.now() - 1 }));
  const e = await tryAcquire("agnes", "slugC", 3, { dir, capacidad: 3 });
  assert.ok(e, "el vencido no debe bloquear");
  e.release();
  assert.equal(usage("agnes", { dir }).usado, 0);
});
test("lease: 10 pedidos concurrentes respetan el cupo", async () => {
  const dir = tmp();
  const res = await Promise.all(Array.from({ length: 10 }, (_, i) => tryAcquire("runpod", `s${i}`, 1, { dir, capacidad: 4, ttlMs: 60_000 })));
  const got = res.filter(Boolean);
  assert.equal(got.length, 4);
  got.forEach((l) => l.release());
});

// ---------- B4 gh ----------
test("gh: 403 secundario → reintenta y luego sale bien", async () => {
  let n = 0;
  const runner = async () => { n++; if (n < 3) { const e = new Error("HTTP 403: You have exceeded a secondary rate limit"); e.out = e.message; throw e; } return { code: 0, stdout: "ok", stderr: "", out: "ok" }; };
  const r = await gh(["release", "view", "x"], { runner, baseMs: 5, maxMs: 10, log: silent });
  assert.equal(r.stdout, "ok");
  assert.equal(n, 3);
});
test("gh: error que NO es rate limit no se reintenta", async () => {
  let n = 0;
  const runner = async () => { n++; const e = new Error("release not found"); e.out = e.message; throw e; };
  await assert.rejects(gh(["release", "view", "x"], { runner, baseMs: 5, log: silent }), /not found/);
  assert.equal(n, 1);
});
test("gh: detector de rate limit", () => {
  assert.ok(esRateLimit("HTTP 403: secondary rate limit"));
  assert.ok(!esRateLimit("HTTP 404: Not Found"));
});

// ---------- A5 spec / A6 paths ----------
test("spec: campos faltantes, enums y typos se reportan", () => {
  const errs = validateSpec({ slug: "Mal Slug", canal: "x", modo: "avatr", idioma: "es", guion: "g.txt", voz: { id: "v" }, cta: { head: "h", ancla: "a" }, colr: 1 });
  assert.ok(errs.some((e) => /slug inválido/.test(e)));
  assert.ok(errs.some((e) => /modo/.test(e)));
  assert.ok(errs.some((e) => /colr: campo desconocido/.test(e)));
});
test("spec: modo avatar exige avatar.face", () => {
  const errs = validateSpec({ slug: "ok1", canal: "x", modo: "avatar", idioma: "es", guion: "g.txt", voz: { id: "v" }, cta: { head: "h", ancla: "a" } });
  assert.ok(errs.some((e) => /avatar\.face/.test(e)));
});
test("paths: aislamiento por slug", () => {
  const P = slugPaths("tcprueba");
  assert.ok(insideSlug("tcprueba", path.join(P.imgDir, "p001.jpg")));
  assert.ok(!insideSlug("tcprueba", path.join(P.root, "public", "img", "otroslug", "p001.jpg")));
  assert.ok(!insideSlug("tcprueba", path.join(P.root, "public", "img", "tcprueba2", "x.jpg")), "prefijo parecido no cuenta");
});

// ── CANDADO POR SLUG (ítem B6) ───────────────────────────────────────────────────────────────────
test("candado: un segundo orquestador VIVO sobre el mismo slug es rechazado, y el huérfano se pisa", async () => {
  const { tomarCandado } = await import("../lib/candado.mjs");
  const fs = await import("node:fs"); const os = await import("node:os"); const path = await import("node:path");
  const { slugPaths } = await import("../lib/paths.mjs");
  const slug = "zzcandado";
  const f = path.join(slugPaths(slug).state, "orquestador.json");
  fs.mkdirSync(path.dirname(f), { recursive: true });
  // otro proceso VIVO (uso mi propio PID con otro número de proceso imposible de distinguir: uso el PID real)
  fs.writeFileSync(f, JSON.stringify({ pid: process.pid + 0, host: os.hostname(), desde: "x", slug }));
  // mismo PID = soy yo mismo reanudando: NO debe rechazar
  assert.doesNotThrow(() => tomarCandado(slug, { log: () => {} }));
  // un PID que NO existe = candado huérfano: se pisa sin quejarse
  fs.writeFileSync(f, JSON.stringify({ pid: 999999, host: os.hostname(), desde: "x", slug }));
  let dijo = "";
  assert.doesNotThrow(() => tomarCandado(slug, { log: (m) => { dijo += m; } }));
  assert.match(dijo, /huérfano/);
  fs.rmSync(path.dirname(f), { recursive: true, force: true });
});

// ── BORRADO QUE NO ATRAVIESA ENLACES ─────────────────────────────────────────────────────────────
test("borrarSeguro: se NIEGA si hay un junction adentro, y el destino real sobrevive", async () => {
  const { borrarSeguro, enlacesDentro } = await import("../lib/borrar.mjs");
  const fs = await import("node:fs"); const os = await import("node:os"); const path = await import("node:path");
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "junc-"));
  const real = path.join(base, "tesoro"); fs.mkdirSync(real);
  fs.writeFileSync(path.join(real, "claves.env"), "OPENAI_API_KEY=no-me-borres");
  const wt = path.join(base, "wt"); fs.mkdirSync(wt);
  let hayJunction = true;
  try { fs.symlinkSync(real, path.join(wt, "public"), "junction"); } catch { hayJunction = false; }
  if (hayJunction) {
    assert.equal(enlacesDentro(wt).length, 1);
    let dijo = "";
    assert.equal(borrarSeguro(wt, { log: (m) => { dijo += m; } }), false, "no puede borrar un árbol con enlaces");
    assert.match(dijo, /ATRAVIESA/);
    assert.ok(fs.existsSync(path.join(real, "claves.env")), "el destino real tiene que sobrevivir");
    fs.rmdirSync(path.join(wt, "public"));   // así se desarma: rmdir sobre el enlace
  }
  // sin enlaces, borra normal
  assert.equal(borrarSeguro(wt, { log: () => {} }), true);
  assert.ok(!fs.existsSync(wt));
  fs.rmSync(base, { recursive: true, force: true });
});
