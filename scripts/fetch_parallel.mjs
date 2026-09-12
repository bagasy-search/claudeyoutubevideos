// fetch_parallel.mjs — baja los clips finales EN PARALELO, 1 worker por IP.
// fetch_clips.mjs normal baja de a uno (lento para ~200 clips). Acá repartimos la
// lista en N shards y lanzamos N fetch_clips en paralelo, cada uno FIJADO a un proxy
// distinto (env YTPROXY) → sin pelearse el mismo IP → ~Nx más rápido. Saltea los que
// ya existen (fetch_clips lo hace por clip).
//
//   node scripts/fetch_parallel.mjs <clips_<slug>_matched.json> [workers=Nº_proxies]
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const rawArgs = process.argv.slice(2);
// slug del video: por --slug <x>, env SLUG, o derivado de clips_<slug>_matched.json
let slug = process.env.SLUG || "";
const si = rawArgs.indexOf("--slug");
if (si >= 0) { slug = rawArgs[si + 1] || ""; rawArgs.splice(si, 2); }
const [listArg, workersArg] = rawArgs;
const LIST = listArg || "public/broll/clips_barcos_matched.json";
if (!fs.existsSync(LIST)) { console.error("No existe:", LIST); process.exit(1); }
if (!slug) { const m = /^clips_(.+?)(?:_matched)?\.json$/i.exec(path.basename(LIST)); if (m) slug = m[1]; }
// ★ AISLAMIENTO POR VIDEO: shards y destino por slug → dos videos no se pisan (antes _fp_shardN.json y
// public/broll eran nombres FIJOS compartidos). Sin slug cae al comportamiento viejo compartido.
const OUT = slug ? path.join("public/broll", slug) : "public/broll";
if (slug) console.log(`[aislamiento] clips de este video → ${OUT}/`);

// proxies (cookies/proxies.txt) → 1 worker por IP
let proxies = [];
try { proxies = fs.readFileSync("cookies/proxies.txt", "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); } catch {}
if (!proxies.length) { console.error("Sin cookies/proxies.txt — usá fetch_clips.mjs normal"); process.exit(1); }
const N = Math.min(+(workersArg || proxies.length), proxies.length);

const clips = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
// solo lo que falta bajar (acelera el reparto; fetch_clips igual saltea existentes)
const pending = clips.filter((c) => c.name && c.url && !fs.existsSync(path.join(OUT, `${c.name}.mp4`)));
console.log(`${pending.length}/${clips.length} clips por bajar · ${N} workers (1 por IP)`);
if (!pending.length) { console.log("nada que bajar ✓"); process.exit(0); }

// shards balanceados (round-robin)
const shards = Array.from({ length: N }, () => []);
pending.forEach((c, i) => shards[i % N].push(c));
const tmp = [];
shards.forEach((s, i) => { const f = path.join("public/broll", slug ? `_fp_${slug}_shard${i}.json` : `_fp_shard${i}.json`); fs.writeFileSync(f, JSON.stringify(s)); tmp.push(f); });

const t0 = Date.now();
const run = (i) => new Promise((res) => {
  const env = { ...process.env, YTPROXY: proxies[i % proxies.length] };
  const p = spawn(process.execPath, ["fetch_clips.mjs", tmp[i], ...(slug ? ["--slug", slug] : [])], { env, stdio: ["ignore", "pipe", "pipe"] });
  let ok = 0, fail = 0;
  const tally = (b) => { const s = b.toString(); ok += (s.match(/✓ broll/g) || []).length; fail += (s.match(/^✗/gm) || []).length; };
  p.stdout.on("data", tally); p.stderr.on("data", () => {});
  p.on("close", () => { console.log(`  worker ${i} (IP ${proxies[i].replace(/:[^:@]*@/, ":***@").replace(/.*@/, "")}) listo: ${ok} ok, ${fail} fallos`); res({ ok, fail }); });
});

const results = await Promise.all(shards.map((_, i) => run(i)));
tmp.forEach((f) => { try { fs.rmSync(f); } catch {} });
const ok = results.reduce((a, r) => a + r.ok, 0), fail = results.reduce((a, r) => a + r.fail, 0);
const onDisk = clips.filter((c) => fs.existsSync(path.join(OUT, `${c.name}.mp4`))).length;
console.log(`\n=== ${ok} bajados · ${fail} fallos · ${Math.round((Date.now() - t0) / 1000)}s · ${onDisk}/${clips.length} en disco ===`);
