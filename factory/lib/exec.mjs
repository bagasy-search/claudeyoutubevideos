// exec.mjs — ÚNICO wrapper de procesos de la fábrica.
//
// Por qué existe (medido, sep-2026):
//   · ffmpeg escribe signalstats/volumedetect/loudnorm a STDERR: leer sólo stdout dio luma=0 "en verde"
//     (fcstaza9, fcstobillo).
//   · un `fetch`/proceso sin timeout colgó un juez de visión 30 min (fcsricino).
//   · `farm.mjs` y otros salían con código 0 sin haber hecho el trabajo: el que llama tiene que poder
//     exigir una marca POSITIVA en la salida (`expect`), no confiar en el exit code.
import { spawn } from "node:child_process";

export class ExecError extends Error {
  constructor(msg, res) { super(msg); this.name = "ExecError"; Object.assign(this, res); }
}

const tail = (s, n = 1500) => (s.length > n ? "…" + s.slice(-n) : s);

/**
 * run(cmd, args, opts) → { code, stdout, stderr, out (stdout+stderr), ms }
 * opts: timeoutMs (OBLIGATORIO), cwd, env, input, allowFail, expect (RegExp que TIENE que aparecer
 *       en stdout+stderr), onLine (streaming de líneas), shell.
 */
export function run(cmd, args = [], opts = {}) {
  const { timeoutMs, cwd, env, input, allowFail = false, expect, onLine, shell = false } = opts;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Error(`run(${cmd}): timeoutMs es obligatorio`);
  const t0 = Date.now();
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, env: env ? { ...process.env, ...env } : process.env, shell, windowsHide: true });
    let stdout = "", stderr = "", killed = false, buf = "";
    const line = (chunk) => {
      if (!onLine) return;
      buf += chunk;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) { onLine(buf.slice(0, i).replace(/\r$/, "")); buf = buf.slice(i + 1); }
    };
    p.stdout.on("data", (d) => { const s = d.toString(); stdout += s; line(s); });
    p.stderr.on("data", (d) => { const s = d.toString(); stderr += s; line(s); });
    const timer = setTimeout(() => { killed = true; p.kill("SIGKILL"); }, timeoutMs);
    p.on("error", (e) => { clearTimeout(timer); reject(new ExecError(`no pude lanzar ${cmd}: ${e.message}`, { code: -1, stdout, stderr, out: stdout + stderr, ms: Date.now() - t0 })); });
    p.on("close", (code) => {
      clearTimeout(timer);
      if (onLine && buf) onLine(buf);
      const res = { code, stdout, stderr, out: stdout + stderr, ms: Date.now() - t0 };
      if (killed) return reject(new ExecError(`TIMEOUT ${Math.round(timeoutMs / 1000)} s: ${cmd} ${args.join(" ").slice(0, 200)}\n${tail(res.out)}`, { ...res, timedOut: true }));
      if (code !== 0 && !allowFail) return reject(new ExecError(`exit ${code}: ${cmd} ${args.join(" ").slice(0, 200)}\n${tail(res.out)}`, res));
      if (expect && !expect.test(res.out)) return reject(new ExecError(`exit ${code} pero SIN la marca esperada ${expect}: ${cmd}\n${tail(res.out)}`, res));
      resolve(res);
    });
    if (input != null) p.stdin.end(input); else p.stdin.end();
  });
}

/** Duración en segundos (ffprobe). Tira si no es un número > 0. */
export async function durSec(file, { timeoutMs = 60_000 } = {}) {
  const r = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { timeoutMs });
  const d = Number(r.stdout.replace(/\r/g, "").trim());
  if (!(d > 0)) throw new Error(`durSec(${file}): ffprobe devolvió "${r.stdout.trim()}"`);
  return d;
}

/** Cuadros reales de video (cuenta paquetes). Tira si da 0. */
export async function frameCount(file, { timeoutMs = 120_000 } = {}) {
  const r = await run("ffprobe", ["-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", file], { timeoutMs });
  const n = parseInt(r.stdout.replace(/\r/g, "").trim(), 10);
  if (!(n > 0)) throw new Error(`frameCount(${file}): 0 cuadros`);
  return n;
}

/** Luma media (YAVG) de un archivo: LEE STDERR, que es donde ffmpeg escribe signalstats. */
export async function lumaMedia(file, { timeoutMs = 300_000, fps = 1 } = {}) {
  const r = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-vf", `fps=${fps},scale=160:-2,signalstats,metadata=print:key=lavfi.signalstats.YAVG`, "-an", "-f", "null", "-"], { timeoutMs });
  const vals = [...r.out.matchAll(/lavfi\.signalstats\.YAVG=([\d.]+)/g)].map((m) => Number(m[1]));
  if (!vals.length) throw new Error(`lumaMedia(${file}): ffmpeg no imprimió YAVG (¿leyendo el stream equivocado?)`);
  return { media: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length, min: Math.min(...vals) };
}
