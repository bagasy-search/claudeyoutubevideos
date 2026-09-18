// 80_render — commit == disco (índice PROPIO, nunca el índice compartido del repo) → push de la ref →
// farm (FARM_NOWAIT, exige la marca WAIT_RUN) → espera espaciada → descarga y verificación de duración.
//
// ⛔ Repo compartido por muchas sesiones: el HEAD y el índice son de OTRO video. Se arma el árbol con
//    GIT_INDEX_FILE en <work>/render/index (no toca nada de nadie) sobre la base de render.
import fs from "node:fs";
import path from "node:path";
import { run, durSec } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { gh, waitRun, releaseAssetPublic, esRateLimit } from "../lib/gh.mjs";
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

/**
 * Worktree MÍNIMO por video, parado (detached) en el commit de render. farm.mjs exige HEAD == ref del render
 * (pre-vuelo) y lee src/, public/ y _v3/ relativos al cwd; el repo compartido está en la rama de OTRO video.
 *   · `worktree add --no-checkout` + checkout SÓLO de los archivos del árbol de imports → pesa KB, índice propio.
 *   · public/ y _v3/ son JUNCTIONS al repo real. ⛔⛔ Este worktree NUNCA se borra con rmdir /s ni `worktree remove`
 *     (así se perdió el public/ real: project_canal_the_free_builder). Se reutiliza moviendo HEAD.
 */
export async function prepararWorktree({ slug, commit, files, wt, assetsList, runner = run }) {
  const g = (args, cwd = ROOT) => runner("git", args, { cwd, timeoutMs: 5 * 60_000 });
  if (!fs.existsSync(path.join(wt, ".git"))) {
    fs.mkdirSync(path.dirname(wt), { recursive: true });
    await g(["worktree", "add", "--no-checkout", "--detach", wt, commit]);
  } else {
    await g(["checkout", "--detach", commit], wt);
  }
  await g(["checkout", commit, "--", ...files], wt);
  for (const d of ["public", "_v3"]) {
    const link = path.join(wt, d);
    if (fs.existsSync(link)) {
      const st = fs.lstatSync(link);
      if (!st.isSymbolicLink()) throw new Error(`${link} existe y NO es junction: no lo toco (revisar a mano)`);
      continue;
    }
    await runner("cmd", ["/c", "mklink", "/J", link.replace(/\//g, "\\"), path.join(ROOT, d).replace(/\//g, "\\")], { timeoutMs: 30_000 });
  }
  fs.copyFileSync(assetsList, path.join(wt, path.basename(assetsList)));
  const head = (await g(["rev-parse", "HEAD"], wt)).stdout.trim();
  if (head !== commit) throw new Error(`worktree ${wt}: HEAD ${head.slice(0, 7)} ≠ commit ${commit.slice(0, 7)}`);
  return { wt, head };
}

/**
 * Quita los junctions `public/` y `_v3/` del worktree de render. ⛔⛔ VITAL: mientras existen, ese
 * worktree es una BOMBA — cualquier limpieza recursiva de afuera (`worktree remove`, un `rm -rf`, otra
 * sesion ordenando D:/rtmp) sigue el enlace y borra el `public/` REAL del repo. Paso DOS veces el
 * 17-sep-2026 con 5 videos en vuelo: se llevo 2.638 archivos y casi todas las imagenes y clips.
 * El enlace solo hace falta mientras se arma el tarball, asi que se desarma apenas el farm despacha.
 * Borrar un symlink/junction NO toca el destino.
 */
async function desarmarJunctions(wt, log) {
  for (const d of ["public", "_v3"]) {
    const link = path.join(wt, d);
    try {
      if (!fs.existsSync(link)) continue;
      if (!fs.lstatSync(link).isSymbolicLink()) { log(`⚠️ ${link} no es junction: lo dejo`); continue; }
      fs.unlinkSync(link);
      log(`junction desarmado: ${d}`);
    } catch (e) { log(`⚠️ no pude desarmar ${d}: ${e.message}`); }
  }
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

    const wt = path.join(P.work, "render", "wt");
    await prepararWorktree({ slug, commit: c.commit, files: tree.archivos, wt, assetsList: P.assetsList });
    log(`worktree de render ${wt} en ${c.commit.slice(0, 7)} (public/ y _v3/ por junction; nunca se borra)`);

    const prev = state.get("80_render");
    let runId = prev?.status !== "done" && prev?.runId ? prev.runId : null;
    // ⛔ (15-sep-2026) otra sesión canceló el render de tcestufa al relanzar el suyo: una corrida CANCELADA se
    // re-despacha sola (hasta 2 veces) reusando el tar ya subido del MISMO commit.
    let reusarAssets = env("FACTORY_REUSE_ASSETS") === "1";
    let res;
    for (let intento = 0; ; intento++) {
    res = await withLease("farm_slots", slug, chunks, async () => {
      if (!runId) {
        for (let i = 0; ; i++) {
          try {
            const reuse = (reusarAssets || i > 0) && (await releaseAssetPublic(repo, `assets-${slug}`, `assets-${slug}.tar`)).existe;
            const r = await run("node", [path.join(ROOT, "scripts", "farm.mjs"), slug, P.comp, String(total), String(chunks), `@${path.basename(P.assetsList)}`], {
              cwd: wt, timeoutMs: 3 * 3600_000, expect: /WAIT_RUN:\s*\d+/,
              env: { ENTRY: `src/index_${slug}.tsx`, FARM_REF: P.renderRef, AUDIO_FILE: `${slug}.m4a`, TAR_DIR: env("FACTORY_TAR_DIR") || "D:/", FARM_NOWAIT: "1", ARBOL_SRC: tree.archivos.join(","), ...(reuse ? { REUSE_ASSETS: "1" } : {}) },
              onLine: (l) => /PRE-VUELO|✗|⛔|WAIT_RUN|release|chunks|agnes QC/i.test(l) && log(l.slice(0, 180)),
            });
            runId = r.out.match(/WAIT_RUN:\s*(\d+)/)[1];
            await desarmarJunctions(wt, log);   // el tar ya esta armado: el enlace no tiene que sobrevivir
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
      if (res.ok || res.conclusion !== "cancelled" || intento >= 2) break;
      log(`run ${runId} CANCELADO desde afuera (otra sesión o a mano) · jobs ok ${res.jobsOk}/${res.jobsTotal} → re-despacho ${intento + 1}/2 reusando assets`);
      runId = null; reusarAssets = true;
      state.set("80_render", { status: "running", runId: null, cancelados: intento + 1 });
    }
    if (!res.ok) throw new Error(`run ${runId}: ${res.conclusion} · jobs ok ${res.jobsOk} · fallidos ${res.jobsBad} de ${res.jobsTotal}`);

    const dir = path.dirname(P.rawMp4);
    fs.mkdirSync(dir, { recursive: true });
    // No re-bajar 600 MB que ya estan en disco. El artefacto del farm tarda ~1 h con esta conexion y
    // la descarga puede cortarse justo al final; si el mp4 ya esta y dura lo que tiene que durar, se
    // usa. Medido el 17-sep: cmealter y cmeamazon tenian su mp4 completo y la fase murio igual
    // reintentando la descarga durante 3.592 s.
    const esperado = total / 30;
    // ⛔⛔ (18-sep-2026) Este guard comparaba SÓLO la duración — y un re-render del MISMO guion dura
    //    exactamente lo mismo. Resultado: se arreglaron 4 tarjetas negras, se re-rendeó (runId nuevo,
    //    32/32 jobs) y la entrega volvió a validar el MP4 VIEJO, sin los arreglos. Es la misma familia
    //    que el PNG sellado por prompt: una caché indexada por algo que no captura el cambio.
    //    Ahora el mp4 en disco se sella con el RUN que lo produjo; si el run es otro, se baja de nuevo.
    const sello = `${P.rawMp4}.runid`;
    const selloPrev = fs.existsSync(sello) ? fs.readFileSync(sello, "utf8").trim() : "";
    let listo = false;
    if (fs.existsSync(P.rawMp4)) {
      try {
        const dPrev = await durSec(P.rawMp4);
        const duraBien = Math.abs(dPrev - esperado) / esperado * 100 <= 0.6;
        const mismoRun = selloPrev === String(runId);
        listo = duraBien && mismoRun;
        log(listo ? `mp4 ya en disco del run ${runId} (${dPrev.toFixed(1)} s): no lo vuelvo a bajar`
          : !duraBien ? `mp4 en disco dura ${dPrev.toFixed(1)} s y se esperaban ${esperado.toFixed(1)}: lo bajo de nuevo`
            : `mp4 en disco es del run ${selloPrev || "desconocido"} y este es el ${runId}: lo bajo de nuevo`);
      } catch { /* ilegible: se baja */ }
    }
    if (!listo) {
      if (fs.existsSync(P.rawMp4)) fs.rmSync(P.rawMp4);   // `gh run download` no pisa un archivo existente
      await gh(["run", "download", String(runId), "-R", repo, "-n", `final-${slug}`, "-D", dir], { log, timeoutMs: 60 * 60_000 });
      fs.writeFileSync(sello, String(runId));
    }
    const d = await durSec(P.rawMp4);
    assertMeasured("renderDesvioPct", +(Math.abs(d - esperado) / esperado * 100).toFixed(3), { max: 0.6, allowZero: true, log });   // el farm estira ~0,2 %
    return { runId, commit: c.commit, archivos: tree.archivos.length, chunks, jobsOk: res.jobsOk, durSec: +d.toFixed(2), totalFrames: total };
  },
};
