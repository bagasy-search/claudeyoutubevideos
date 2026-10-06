// fetch_parallel.mjs — baja los clips en PARALELO por los PROXIES (receta Deno, SIN cookies).
// ★ Las cookies ROMPEN la descarga (negocian SABR/DRM → "Requested format not available").
//   La receta que funciona = proxy + DENO (resuelve el JS n-challenge), SIN cookies.
// N workers, cada uno = 1 proxy (YTPROXY) + una tanda DISJUNTA de tomas, SIN cookies. Deno en PATH.
//
//   node fetch_parallel.mjs [clips_<slug>_matched.json] [outDir=public/broll] [workers]
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";

const listArg = process.argv[2] || "public/broll/clips_artefactos_matched.json";
const outDir = process.argv[3] || "public/broll";
const cookieDir = process.env.COOKIE_DIR || "cookies";
const proxies = (() => { try { return fs.readFileSync(path.join(cookieDir, "proxies.txt"), "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); } catch { return []; } })();
if (!proxies.length) { console.error("⚠ sin proxies en", path.join(cookieDir, "proxies.txt")); process.exit(1); }
const N = Math.max(1, Math.min(+(process.argv[4] || process.env.FETCH_WORKERS || proxies.length), proxies.length));

// Deno en PATH (resuelve el challenge; se instala en ~/.deno/bin)
const denoBin = path.join(os.homedir(), ".deno", "bin");
const PATHV = process.env.PATH.includes(denoBin) ? process.env.PATH : `${process.env.PATH}:${denoBin}`;

const clips = JSON.parse(fs.readFileSync(listArg, "utf8"));
const pending = clips.filter((c) => !fs.existsSync(path.join(outDir, `${c.name}.mp4`)));
console.log(`fetch paralelo (proxy+Deno, SIN cookies): ${pending.length}/${clips.length} pendientes · ${N} workers · ${proxies.length} proxies`);
if (!pending.length) { console.log("✓ todo ya bajado"); process.exit(0); }

const slices = Array.from({ length: N }, () => []);
pending.forEach((c, i) => slices[i % N].push(c));

const tmp = fs.mkdtempSync(path.join(process.cwd(), "_fetchpw_"));
function runWorker(k) {
  return new Promise((resolve) => {
    const wdir = path.join(tmp, `w${k}`); fs.mkdirSync(wdir, { recursive: true }); // COOKIE_DIR VACÍO → fetch_clips no usa cookies
    const sliceFile = path.join(tmp, `slice${k}.json`); fs.writeFileSync(sliceFile, JSON.stringify(slices[k]));
    const env = { ...process.env, PATH: PATHV, COOKIE_DIR: wdir, YTPROXY: proxies[k % proxies.length], FETCH_SLEEP_MIN: process.env.FETCH_SLEEP_MIN || "0.5", FETCH_SLEEP_MAX: process.env.FETCH_SLEEP_MAX || "2" };
    console.log(`  ▶ worker ${k}: ${slices[k].length} clips · proxy ${proxies[k % proxies.length].replace(/\/\/[^@]*@/, "//***@")} · sin cookies`);
    const p = spawn("node", ["fetch_clips.mjs", sliceFile, outDir], { env, stdio: ["ignore", "pipe", "pipe"] });
    let ok = 0, fail = 0, buf = "";
    const onData = (d) => { buf += d; let nl; while ((nl = buf.indexOf("\n")) >= 0) { const line = buf.slice(0, nl); buf = buf.slice(nl + 1); if (line.includes("✓ broll/")) ok++; else if (line.includes("✗ ERROR")) fail++; } };
    p.stdout.on("data", onData); p.stderr.on("data", onData);
    p.on("close", () => { console.log(`  ✓ worker ${k}: ${ok} ok · ${fail} fallidos`); resolve({ k, ok, fail }); });
  });
}

const res = await Promise.all(Array.from({ length: N }, (_, k) => runWorker(k)));
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
const have = clips.filter((c) => fs.existsSync(path.join(outDir, `${c.name}.mp4`))).length;
console.log(`\n✅ fetch paralelo listo → ${have}/${clips.length} clips en disco (${res.reduce((s, r) => s + r.fail, 0)} fallidos, reintentables re-corriendo)`);
