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

/** Espera un run por POLL espaciado (≥ 5 min por defecto: reference_gh_actions_rate_limit_secundario). */
export async function waitRun(repo, runId, { pollMs = 5 * 60_000, maxMs = 4 * 3600_000, log = console.log, ...o } = {}) {
  const t0 = Date.now();
  for (;;) {
    const j = await ghJson(["run", "view", String(runId), "-R", repo, "--json", "status,conclusion,jobs"], o);
    const jobs = j.jobs || [];
    const ok = jobs.filter((x) => x.conclusion === "success").length;
    const bad = jobs.filter((x) => ["failure", "cancelled", "timed_out"].includes(x.conclusion)).length;
    log(`run ${runId}: ${j.status}${j.conclusion ? "/" + j.conclusion : ""} · jobs ok ${ok} · fallidos ${bad} · total ${jobs.length}`);
    if (j.status === "completed") {
      // ⛔ "cancelled" o 0 jobs NO es éxito aunque gh salga con 0
      return { conclusion: j.conclusion, jobsOk: ok, jobsBad: bad, jobsTotal: jobs.length, ok: j.conclusion === "success" && bad === 0 && ok > 0 };
    }
    if (Date.now() - t0 > maxMs) throw new Error(`run ${runId} no terminó en ${Math.round(maxMs / 60000)} min`);
    await sleep(pollMs);
  }
}
