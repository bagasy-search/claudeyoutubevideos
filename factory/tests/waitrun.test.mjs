// waitRun: un 403 NO corta la espera, la lista de jobs se pide poco, y "success" con un chunk caído NO es ok.
import test from "node:test";
import assert from "node:assert/strict";
import { waitRun } from "../lib/gh.mjs";

function fakeGh(guion) {
  const calls = [];
  let paso = guion[0];
  const runner = async (cmd, args) => {
    const url = args.find((a) => a.startsWith("repos/"));
    calls.push(url);
    // la lista de jobs responde según el ÚLTIMO estado del run que se consultó
    if (!url.includes("/jobs")) paso = guion[Math.min(calls.filter((u) => !u.includes("/jobs")).length - 1, guion.length - 1)];
    const r = url.includes("/jobs") ? paso.jobs : paso.run;
    if (r === 403) { const e = new Error("HTTP 403: You have exceeded a secondary rate limit"); e.out = e.message; throw e; }
    return { code: 0, stdout: r, stderr: "", out: r };
  };
  return { runner, calls };
}
const J = (rows) => rows.map((r) => r.join("\t")).join("\n") + "\n";
const opts = (runner) => ({ runner, pollMs: 5, firstMs: 0, jobsEveryMs: 0, baseMs: 1, maxMs: 5_000, log: () => {} });

test("403 en el medio: sigue esperando y termina ok", async () => {
  const { runner, calls } = fakeGh([
    { run: 403, jobs: J([["render (0)", "in_progress", "", new Date().toISOString()]]) },
    { run: "in_progress\t\n", jobs: J([["render (0)", "in_progress", "", new Date().toISOString()]]) },
    { run: "completed\tsuccess\n", jobs: J([["prepare", "completed", "success", ""], ["render (0)", "completed", "success", ""], ["stitch", "completed", "success", ""]]) },
  ]);
  const r = await waitRun("o/r", 1, opts(runner));
  assert.equal(r.ok, true);
  assert.equal(r.jobsOk, 3);
  assert.ok(calls.length < 12, `demasiadas llamadas: ${calls.length}`);
});

test("run success con un chunk caído NO es ok", async () => {
  const { runner } = fakeGh([{ run: "completed\tsuccess\n", jobs: J([["render (0)", "completed", "success", ""], ["render (1)", "completed", "failure", ""]]) }]);
  const r = await waitRun("o/r", 2, opts(runner));
  assert.equal(r.ok, false);
  assert.equal(r.jobsBad, 1);
});

test("timed_out del run (cuelgue cortado por GitHub) vuelve como fallo", async () => {
  const { runner } = fakeGh([{ run: "completed\tfailure\n", jobs: J([["render (0)", "completed", "timed_out", ""]]) }]);
  const r = await waitRun("o/r", 3, opts(runner));
  assert.equal(r.ok, false);
  assert.equal(r.conclusion, "failure");
});
