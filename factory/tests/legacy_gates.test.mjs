// CONTROL POSITIVO de compuertas COMPARTIDAS (scripts/) arregladas en D2: con un video trampa tienen que
// cazar el defecto, y sin nada que medir tienen que salir con 2 (nunca "verde sin mirar").
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { run } from "../lib/exec.mjs";
import { ROOT } from "../lib/env.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "factory-lg-"));
const node = (args) => run(process.execPath, args, { cwd: ROOT, timeoutMs: 120_000, allowFail: true });
const ff = (args) => run("ffmpeg", ["-v", "error", "-y", ...args], { timeoutMs: 120_000 });

test("audit_frames: un video con 3 s NEGROS se caza (antes daba ✅ leyendo stdout)", async () => {
  const d = tmp(), f = path.join(d, "trampa.mp4");
  await ff(["-f", "lavfi", "-i", "color=c=gray:s=320x180:d=2:r=30", "-f", "lavfi", "-i", "color=c=black:s=320x180:d=3:r=30", "-f", "lavfi", "-i", "color=c=gray:s=320x180:d=2:r=30",
    "-filter_complex", "[0:v][1:v][2:v]concat=n=3:v=1:a=0[v]", "-map", "[v]", "-pix_fmt", "yuv420p", f]);
  const r = await node(["scripts/audit_frames.mjs", f]);
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /MUERTOS \(>1\.5s\): 1/);
});

test("audit_frames: un video sano pasa y dice cuánto midió", async () => {
  const d = tmp(), f = path.join(d, "sano.mp4");
  await ff(["-f", "lavfi", "-i", "testsrc=s=320x180:d=4:r=30", "-pix_fmt", "yuv420p", f]);
  const r = await node(["scripts/audit_frames.mjs", f]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /midió [34]\.\d s decodificados/);
});

test("audit_frames: un archivo que no es video NO da verde", async () => {
  const d = tmp(), f = path.join(d, "roto.mp4");
  fs.writeFileSync(f, "esto no es un mp4");
  const r = await node(["scripts/audit_frames.mjs", f]);
  assert.equal(r.code, 2, r.out);
});

test("check_timestamps: archivo sin cuadros → 2 (antes '✓ timestamps perfectos')", async () => {
  const d = tmp(), f = path.join(d, "solo_audio.mp4");
  await ff(["-f", "lavfi", "-i", "sine=d=2", "-c:a", "aac", f]);
  const r = await node(["scripts/check_timestamps.mjs", f]);
  assert.notEqual(r.code, 0, r.out);
});

test("dark_gate: carpeta sin stills → 2; still negro → 1", async () => {
  const vacia = tmp();
  fs.writeFileSync(path.join(vacia, "clip.mp4"), "x");
  assert.equal((await node(["scripts/dark_gate.mjs", vacia])).code, 2);
  const d = tmp();
  await ff(["-f", "lavfi", "-i", "color=c=black:s=64x36", "-frames:v", "1", path.join(d, "negro.jpg")]);
  await ff(["-f", "lavfi", "-i", "color=c=gray:s=64x36", "-frames:v", "1", path.join(d, "gris.jpg")]);
  assert.equal((await node(["scripts/dark_gate.mjs", d])).code, 1);
});

test("check_arbol_git: sin entry o con entry inexistente → 2 (antes miraba fedguante)", async () => {
  assert.equal((await node(["scripts/check_arbol_git.mjs"])).code, 2);
  assert.equal((await node(["scripts/check_arbol_git.mjs", "src/index_no_existe_xyz.tsx"])).code, 2);
});
