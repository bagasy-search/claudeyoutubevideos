// gh.mjs — GitHub CLI con backoff y sin mentir.
//
// Medido: el 403 "secondary rate limit" hizo que farm.mjs dijera "falló" con renders SANOS en
// fa70estudios, tcfiltro, fcscanas y fcspellizco; un `_dispatch.sh` clonado reintentó 12×5 min.
// Reglas: (1) 403/429/5xx/secondary → backoff exponencial con tope, (2) nunca más de 1 llamada cada
// MIN_GAP_MS por proceso, (3) "falló por rate limit" NO es "falló el render": quien llama verifica el
// estado REAL (asset del release, conclusión del run) después.
import { run } from "./exec.mjs";

const MIN_GAP_MS = Number(process.env.FACTORY_GH_GAP_MS || 1500);
let last = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const esRateLimit = (txt) => /secondary rate limit|rate limit exceeded|HTTP 403|HTTP 429|abuse detection|HTTP 50[234]|was submitted too quickly|timeout awaiting/i.test(txt || "");

export async function gh(args, { timeoutMs = 10 * 60_000, retries = 7, baseMs = 30_000, maxMs = 8 * 60_000, log = console.log, runner = run, allowFail = false } = {}) {
  let intento = 0;
  for (;;) {
    const gap = last + MIN_GAP_MS - Date.now();
    if (gap > 0) await sleep(gap);
    last = Date.now();
    try {
      return await runner("gh", args, { timeoutMs });
    } catch (e) {
      const txt = e.out || e.message;
      if (!esRateLimit(txt) || intento >= retries) {
        if (allowFail) return { code: e.code ?? 1, stdout: e.stdout || "", stderr: e.stderr || e.message, out: txt, failed: true };
        throw e;
      }
      const espera = Math.min(maxMs, baseMs * 2 ** intento) * (0.8 + Math.random() * 0.4);
      intento++;
      log(`gh ${args.slice(0, 3).join(" ")}: rate limit (${(txt.match(/HTTP \d{3}|secondary rate limit|rate limit/i) || ["?"])[0]}) → reintento ${intento}/${retries} en ${Math.round(espera / 1000)} s`);
      await sleep(espera);
    }
  }
}

export async function ghJson(args, o) {
  const r = await gh(args, o);
  return JSON.parse(r.stdout);
}

/**
 * Asset de release por la URL PÚBLICA (HEAD, sin tocar la API de GitHub → no gasta el límite secundario que
 * trabó a 5 sesiones el 15-sep). Repo público. → { existe, size }
 */
export async function releaseAssetPublic(repo, tag, name, { fetchImpl = fetch } = {}) {
  try {
    const r = await fetchImpl(`https://github.com/${repo}/releases/download/${tag}/${name}`, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(60_000) });
    return { existe: r.ok, size: Number(r.headers.get("content-length") || 0), status: r.status };
  } catch (e) { return { existe: false, size: 0, error: e.message }; }
}

/** Estado REAL de un asset de release: { existe, size } — es la verdad, no el exit code del upload. */
export async function releaseAsset(repo, tag, name, o = {}) {
  const r = await gh(["release", "view", tag, "-R", repo, "--json", "assets"], { ...o, allowFail: true });
  if (r.failed) return { existe: false, size: 0, error: r.out.slice(0, 200) };
  const a = (JSON.parse(r.stdout).assets || []).find((x) => x.name === name);
  return { existe: !!a, size: a?.size || 0 };
}

/**
 * Espera un run SIN quemar la API (9-oct-2026, plan de escalar a 50 videos/día).
 *
 * ⛔ `gh run watch` consulta cada 3 s: con varios renders en paralelo dispara el 403 de límite SECUNDARIO
 *    (que `gh api rate_limit` NO muestra) y el que espera se muere diciendo "falló" con el render sano.
 *    El cuelgue NO se detecta preguntando seguido: lo corta GitHub solo (`timeout-minutes` de cada job en
 *    render.yml → el run termina en failure y acá se ve en el próximo poll).
 * Reglas: (1) 1 llamada liviana (`runs/<id>`) cada pollMs; (2) la lista de jobs (paginada, cara) sólo
 *    cada jobsEveryMs y al terminar; (3) un 403/429 NO es "falló el render": se avisa y se sigue esperando;
 *    (4) avisa si GitHub no asigna runners o si un job pasa su timeout sin que lo corten.
 */
export async function waitRun(repo, runId, { pollMs = 5 * 60_000, firstMs = 90_000, jobsEveryMs = 20 * 60_000, maxMs = 5 * 3600_000, jobTimeoutMin = 25, log = console.log, ...o } = {}) {
  const t0 = Date.now();
  let ultJobs = 0, sinRespuesta = 0;
  const jobsDe = async () => {
    const r = await gh(["api", "--paginate", `repos/${repo}/actions/runs/${runId}/jobs?per_page=100`, "--jq", '.jobs[] | [.name, .status, (.conclusion // ""), (.started_at // "")] | @tsv'], { ...o, retries: 2, allowFail: true });
    if (r.failed) return null;
    return r.stdout.split(/\r?\n/).filter(Boolean).map((l) => { const [name, status, conclusion, started] = l.split("\t"); return { name, status, conclusion, started }; });
  };
  await sleep(Math.min(firstMs, pollMs));
  for (;;) {
    const r = await gh(["api", `repos/${repo}/actions/runs/${runId}`, "--jq", "[.status, (.conclusion // \"\")] | @tsv"], { ...o, retries: 2, allowFail: true });
    if (r.failed) {
      sinRespuesta++;
      log(`run ${runId}: no pude consultar (${(r.out.match(/HTTP \d{3}|secondary rate limit|rate limit/i) || ["error"])[0]}) — el render SIGUE, vuelvo a mirar en ${Math.round(pollMs / 60000)} min`);
      if (Date.now() - t0 > maxMs) throw new Error(`run ${runId}: sin respuesta de GitHub y pasaron ${Math.round(maxMs / 60000)} min`);
      await sleep(pollMs);
      continue;
    }
    sinRespuesta = 0;
    const [status, conclusion] = r.stdout.trim().split("\t");
    const terminado = status === "completed";
    if (terminado || Date.now() - ultJobs > jobsEveryMs) {
      ultJobs = Date.now();
      const jobs = await jobsDe();
      if (jobs) {
        const ok = jobs.filter((x) => x.conclusion === "success").length;
        const bad = jobs.filter((x) => ["failure", "cancelled", "timed_out"].includes(x.conclusion)).length;
        const corriendo = jobs.filter((x) => x.status === "in_progress");
        const enCola = jobs.filter((x) => x.status === "queued" || x.status === "waiting").length;
        log(`run ${runId}: ${status}${conclusion ? "/" + conclusion : ""} · ok ${ok} · fallidos ${bad} · corriendo ${corriendo.length} · en cola ${enCola} · total ${jobs.length}`);
        const min = (iso) => (Date.now() - Date.parse(iso)) / 60000;
        const pasados = corriendo.filter((x) => /chunk|render/i.test(x.name) && x.started && min(x.started) > jobTimeoutMin + 10);
        if (pasados.length) log(`  ⚠️ ${pasados.length} tramo(s) corriendo hace más de ${jobTimeoutMin + 10} min (${pasados.slice(0, 5).map((x) => x.name).join(", ")}): GitHub debería haberlos cortado — revisar el timeout-minutes del workflow`);
        if (!terminado && enCola && !corriendo.length && !ok && (Date.now() - t0) > 20 * 60_000) log(`  ⚠️ hace ${Math.round((Date.now() - t0) / 60000)} min que GitHub no le da runners a ningún job (¿cola llena o Actions bloqueado por billing?)`);
        if (terminado) return { conclusion, jobsOk: ok, jobsBad: bad, jobsTotal: jobs.length, ok: conclusion === "success" && bad === 0 && ok > 0 };
      } else if (terminado) {
        // ⛔ sin la lista de jobs no se puede confirmar que no haya chunks caídos: "success" del run alcanza
        log(`run ${runId}: ${status}/${conclusion} (no pude bajar la lista de jobs)`);
        return { conclusion, jobsOk: null, jobsBad: null, jobsTotal: null, ok: conclusion === "success" };
      }
    } else {
      log(`run ${runId}: ${status} · ${Math.round((Date.now() - t0) / 60000)} min`);
    }
    if (Date.now() - t0 > maxMs) throw new Error(`run ${runId} no terminó en ${Math.round(maxMs / 60000)} min`);
    await sleep(pollMs);
  }
}
