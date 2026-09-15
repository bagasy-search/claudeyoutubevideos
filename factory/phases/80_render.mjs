// 80_render — commit == disco (índice PROPIO, nunca el índice compartido del repo) → push de la ref →
// farm (FARM_NOWAIT, exige la marca WAIT_RUN) → espera espaciada → descarga y verificación de duración.
//
// ⛔ Repo compartido por muchas sesiones: el HEAD y el índice son de OTRO video. Se arma el árbol con
//    GIT_INDEX_FILE en <work>/render/index (no toca nada de nadie) sobre la base de render.
import fs from "node:fs";
import path from "node:path";
import { run, durSec } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { gh, waitRun, releaseAsset, esRateLimit } from "../lib/gh.mjs";
import { withLease } from "../lib/lease.mjs";
import { importTree } from "../lib/imports.mjs";
import { ROOT, env } from "../lib/env.mjs";
import { sleep } from "../lib/phase.mjs";

export const REPO = () => env("BAGASY_REPO") || "bagasy-search/claudeyoutubevideos";

export async function commitRender({ slug, files, base, ref, work, mensaje, runner = run }) {
  fs.mkdirSync(work, { recursive: true });
  const idx = path.join(work, "index");
  const e = { GIT_INDEX_FILE: idx };
  const g = (args, o = {}) => runner("git", args, { cwd: ROOT, env: e, timeoutMs: 5 * 60_000, ...o });
  await g(["read-tree", base]);
  for (const f of files) {
    const h = (await g(["hash-object", "-w", f])).stdout.trim();
    await g(["update-index", "--add", "--cacheinfo", `100644,${h},${f}`]);
  }
  const tree = (await g(["write-tree"])).stdout.trim();
  const commit = (await g(["commit-tree", tree, "-p", base, "-m", mensaje])).stdout.trim();
  await g(["update-ref", `refs/heads/${ref}`, commit]);
  // verificación: cada archivo del commit tiene el MISMO blob que el disco
  const malos = [];
  for (const f of files) {
    const enCommit = (await g(["rev-parse", `${commit}:${f}`], { allowFail: true })).stdout.trim();
    const enDisco = (await g(["hash-object", f])).stdout.trim();
    if (enCommit !== enDisco) malos.push(f);
  }
  return { commit, tree, malos };
}

export default {
  id: "80_render",
  deps: ["70_gates"],
  inputs: ({ P, state }) => [P.entry, P.srcDir, P.assetsList, state.get("70_gates")?.ts || ""],
  async run({ slug, P, state, log }) {
    const repo = REPO();
    const base = env("FACTORY_RENDER_BASE") || "molino-v1";
    const chunks = Number(env("FACTORY_FARM_CHUNKS") || 30);
    const tree = importTree(P.entry, { root: ROOT });
    assertMeasured("archivosCommit", tree.archivos.length, { min: 3, log });

    const c = await commitRender({ slug, files: tree.archivos, base, ref: P.renderRef, work: path.join(P.work, "render"), mensaje: `${slug}: render de la fábrica` });
    assertMeasured("commitDistintoDelDisco", c.malos.length, { max: 0, allowZero: true, log });
    for (let i = 0; ; i++) {
      try { await run("git", ["push", "-f", "origin", `refs/heads/${P.renderRef}:refs/heads/${P.renderRef}`], { cwd: ROOT, timeoutMs: 10 * 60_000 }); break; }
      catch (e) { if (i >= 4 || !esRateLimit(e.out) && !/timed out|Could not resolve|early EOF|RPC failed/i.test(e.out || "")) throw e; log(`push reintento ${i + 1}`); await sleep(60_000 * 2 ** i); }
    }
    log(`ref ${P.renderRef} = ${c.commit} (${tree.archivos.length} archivos, base ${base})`);

    const total = Number(fs.readFileSync(path.join(P.srcDir, `Main_${slug}.tsx`), "utf8").match(/TOTAL_FRAMES_\w+ = (\d+)/)[1]);
    assertMeasured("totalFrames", total, { min: 300, log });

    const prev = state.get("80_render");
    let runId = prev?.status !== "done" && prev?.runId ? prev.runId : null;
    const res = await withLease("farm_slots", slug, chunks, async () => {
      if (!runId) {
        for (let i = 0; ; i++) {
          try {
            const reuse = i > 0 && (await releaseAsset(repo, `assets-${slug}`, `assets-${slug}.tar`)).existe;
            const r = await run("node", ["scripts/farm.mjs", slug, P.comp, String(total), String(chunks), `@${path.basename(P.assetsList)}`], {
              cwd: ROOT, timeoutMs: 3 * 3600_000, expect: /WAIT_RUN:\s*\d+/,
              env: { ENTRY: `src/index_${slug}.tsx`, FARM_REF: P.renderRef, AUDIO_FILE: `${slug}.m4a`, TAR_DIR: env("FACTORY_TAR_DIR") || "D:/", FARM_NOWAIT: "1", ...(reuse ? { REUSE_ASSETS: "1" } : {}) },
              onLine: (l) => /PRE-VUELO|✗|⛔|WAIT_RUN|release|chunks|agnes QC/i.test(l) && log(l.slice(0, 180)),
            });
            runId = r.out.match(/WAIT_RUN:\s*(\d+)/)[1];
            break;
          } catch (e) {
            if (i >= 3 || !esRateLimit(e.out || e.message)) throw e;
            log(`farm: rate limit de GitHub (el render NO falló) → reintento ${i + 1}/3 en 5 min`);
            await sleep(5 * 60_000);
          }
        }
        state.set("80_render", { status: "running", runId });
      }
      log(`run ${runId}: esperando (poll cada 5 min)`);
      return waitRun(repo, runId, { log });
    }, { log });
    if (!res.ok) throw new Error(`run ${runId}: ${res.conclusion} · jobs ok ${res.jobsOk} · fallidos ${res.jobsBad} de ${res.jobsTotal}`);

    const dir = path.dirname(P.rawMp4);
    fs.mkdirSync(dir, { recursive: true });
    await gh(["run", "download", String(runId), "-R", repo, "-n", `final-${slug}`, "-D", dir], { log, timeoutMs: 60 * 60_000 });
    const d = await durSec(P.rawMp4);
    const esperado = total / 30;
    assertMeasured("renderDesvioPct", +(Math.abs(d - esperado) / esperado * 100).toFixed(3), { max: 0.6, allowZero: true, log });   // el farm estira ~0,2 %
    return { runId, commit: c.commit, archivos: tree.archivos.length, chunks, jobsOk: res.jobsOk, durSec: +d.toFixed(2), totalFrames: total };
  },
};
