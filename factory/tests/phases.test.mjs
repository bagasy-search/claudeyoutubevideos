// Pruebas de las piezas de las fases: momentos, bucles de TTS, compose, ventanas, imports, commit==disco.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { frases, detectarBucles, compose, secciones } from "../lib/text.mjs";
import { ventanas } from "../phases/55_avatar.mjs";
import { importTree } from "../lib/imports.mjs";
import { commitRender } from "../phases/80_render.mjs";
import { run } from "../lib/exec.mjs";
import { checkFiles } from "../tools/guard.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "factory-ph-"));

test("frases: una frase por momento, corta largas, nombres correlativos", () => {
  const g = "TÍTULO: algo\n\nEsto es una frase bastante larga que tiene más de cincuenta y cinco caracteres. Corta.\n\n" +
    "Otra frase muy muy larga, con comas, que sigue y sigue, porque hay que explicar muchas cosas, una tras otra, sin parar nunca, hasta que el lector se canse del todo y pida basta por favor.";
  const m = frases(g, { cps: 15 });
  assert.ok(m.length >= 3);
  assert.equal(m[0].name, "p000");
  assert.ok(!m.some((x) => /TÍTULO/.test(x.texto)));
  assert.ok(m.every((x, i) => x.i === i && x.dur > 0));
  assert.ok(m.every((x) => x.chars / 15 <= 9.5), "ningún momento largo sin partir");
});

test("bucles: detecta 'frase ×4' del TTS y no marca un guion sano", () => {
  const guion = "El aceite no arde, arde su vapor. Todo el aparato existe para evaporar el aceite gota a gota.";
  const sano = detectarBucles(guion, guion);
  assert.equal(sano.bucles.length, 0);
  const loop = detectarBucles(guion, guion + " arde su vapor todo el aparato existe ".repeat(4));
  assert.ok(loop.bucles.length > 0, "tiene que ver el bucle");
  assert.ok(loop.inflacionPct > 8);
});

test("compose: prompts con presentador/lugar/fórmula, y errores por reglas", () => {
  const mom = [{ i: 0, name: "p000", texto: "hola", dur: 3 }, { i: 1, name: "p001", texto: "mirá", dur: 8 }];
  const style = { presentadorToken: "CLAUDIO", presentador: "the same man", lugares: { taller: "in a workshop" }, formula: "sharp", vintage: "old" };
  const ok = compose({ mom, style, tramos: [{ n: "p000", t: "avatar" }, { n: "p001", c: 1, e: "medium", l: "taller", s: "CLAUDIO holding FILTRO", mo: "hand turns" }, { n: "p001x", c: 0, e: "close", l: "taller", s: "FILTRO on the bench", mo: "a drop falls" }], glosario: { FILTRO: "an oil filter" } });
  assert.deepEqual(ok.errores, []);
  assert.equal(ok.faltan.length, 0);
  assert.equal(ok.sinX.length, 0);
  const p = ok.plan.find((x) => x.name === "p001");
  assert.match(p.prompt, /the same man, holding an oil filter, in a workshop, sharp/);
  const mal = compose({ mom, style, tramos: [{ n: "p001", c: 1, e: "medium", l: "nope", s: "a thing", mo: "slow breathing" }] });
  assert.ok(mal.errores.some((e) => /lugar desconocido/.test(e)));
  assert.ok(mal.errores.some((e) => /no nombra a CLAUDIO/.test(e)));
  assert.ok(mal.errores.some((e) => /respirar/.test(e)));
  assert.deepEqual(mal.faltan, ["p000"]);
  assert.deepEqual(mal.sinX, ["p001"]);
});

test("secciones: por frase-ancla; ancla inexistente tira", () => {
  const mom = [{ i: 0, texto: "Hook acá" }, { i: 1, texto: "Paso uno" }, { i: 2, texto: "Paso dos" }];
  const s = secciones(mom, [["HOOK", "Hook"], ["PASOS", "Paso uno"]]);
  assert.deepEqual(s.map((x) => [x.nombre, x.desde, x.hasta]), [["HOOK", 0, 0], ["PASOS", 1, 2]]);
  assert.throws(() => secciones(mom, [["X", "no está"]]), /frase-ancla/);
});

test("ventanas: pad, fusión, apertura desde 0 con piso de 3 s", () => {
  const mom = [{ name: "p000", start: 0.2, end: 1.5 }, { name: "p001", start: 1.5, end: 6 }, { name: "p002", start: 6, end: 9 }, { name: "p003", start: 9, end: 9.3 }];
  const plan = [{ name: "p000", tipo: "avatar" }, { name: "p001", tipo: "imagen" }, { name: "p002", tipo: "avatar" }, { name: "p003", tipo: "avatar" }];
  const W = ventanas(mom, plan, 20, { padSec: 0.4, fusionarSec: 0.2 });
  assert.equal(W.length, 2);
  assert.equal(W[0].start, 0);
  assert.equal(W[0].end, 3);
  assert.deepEqual(W[1].n, ["p002", "p003"], "p003 se funde con p002");
  assert.ok(Math.abs(W[1].start - 5.6) < 1e-9);
});

test("imports: árbol relativo, detecta faltantes", () => {
  const d = tmp();
  fs.mkdirSync(path.join(d, "src", "v"), { recursive: true });
  fs.writeFileSync(path.join(d, "src", "index_v.tsx"), `import { M } from "./v/Main_v";\nimport React from "react";`);
  fs.writeFileSync(path.join(d, "src", "v", "Main_v.tsx"), `import { C } from "./cues";\nimport { P } from "./Piezas";\nexport const M = 1;`);
  fs.writeFileSync(path.join(d, "src", "v", "cues.tsx"), `import { X } from "./NoExiste";`);
  const t = importTree(path.join(d, "src", "index_v.tsx"), { root: d });
  assert.deepEqual(t.archivos, ["src/index_v.tsx", "src/v/Main_v.tsx", "src/v/cues.tsx"]);
  assert.equal(t.faltan.length, 2);
  assert.deepEqual(t.externos, ["react"]);
});

test("commitRender: commit == disco, con índice PROPIO (no toca el índice ni el HEAD del repo)", async () => {
  const d = tmp();
  const g = (a, o = {}) => run("git", a, { cwd: d, timeoutMs: 60_000, ...o });
  await g(["init", "-q", "-b", "main"]);
  await g(["config", "user.email", "t@t"]); await g(["config", "user.name", "t"]);
  fs.writeFileSync(path.join(d, "base.txt"), "base");
  await g(["add", "base.txt"]); await g(["commit", "-qm", "base"]);
  fs.mkdirSync(path.join(d, "src", "v"), { recursive: true });
  fs.writeFileSync(path.join(d, "src", "v", "Main_v.tsx"), "export const A = 1;");
  fs.writeFileSync(path.join(d, "otro.txt"), "cambio de OTRA sesión");
  await g(["add", "otro.txt"]);                            // alguien tiene algo en el índice compartido
  const headAntes = (await g(["rev-parse", "HEAD"])).stdout.trim();
  const runner = (cmd, a, o) => run(cmd, a, { ...o, cwd: d });
  const r = await commitRender({ slug: "v", files: ["src/v/Main_v.tsx"], base: "main", ref: "v-render", work: path.join(d, ".w"), mensaje: "v", runner });
  assert.deepEqual(r.malos, []);
  assert.equal((await g(["show", "v-render:src/v/Main_v.tsx"])).stdout, "export const A = 1;");
  assert.equal((await g(["rev-parse", "HEAD"])).stdout.trim(), headAntes, "HEAD intacto");
  assert.match((await g(["diff", "--cached", "--name-only"])).stdout, /otro\.txt/, "el índice compartido sigue igual");
  assert.equal((await g(["ls-tree", "-r", "--name-only", "v-render"])).stdout.trim().split("\n").sort().join(","), "base.txt,src/v/Main_v.tsx");
});

test("guard: script por slug nuevo y clave quemada se atrapan; legado permitido pasa", () => {
  const files = ["build_nuevo.mjs", "scripts/gen_agnes_i2v_nuevo.mjs", "build_viejo.mjs", "factory/phases/60_build.mjs", "scripts/x.mjs"];
  const src = { "scripts/x.mjs": "const K = 'rpa_" + "A".repeat(40) + "';" };
  const prob = checkFiles(files, { allow: new Set(["build_viejo.mjs"]), read: (f) => src[f] || "" });
  assert.ok(prob.some((p) => /build_nuevo/.test(p)));
  assert.ok(prob.some((p) => /gen_agnes_i2v_nuevo/.test(p)));
  assert.ok(!prob.some((p) => /build_viejo|60_build/.test(p)));
  assert.ok(prob.some((p) => /RunPod/.test(p)));
});
