// _np_stock_run.mjs — baja stock Pexels (2 claves), reencode CFR 30/1280x720, descarta near-black.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { pixabayVideo, usedRegistry } from "./stock_lib.mjs";

const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";
const FFP = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const OUT = "public/broll/nightprotein";
const TMP = "public/broll/_np_tmp";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

// .env
for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KEYS = [process.env.PEXELS_API_KEY, process.env.PEXELS_API_KEY2].filter(Boolean);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const used = usedRegistry();

let keyIdx = 0;
async function pexelsSearch(query) {
  // rota claves; devuelve lista de candidatos landscape ordenados por cercanía a 1920
  for (let k = 0; k < KEYS.length; k++) {
    const key = KEYS[(keyIdx + k) % KEYS.length];
    const u = new URL("https://api.pexels.com/videos/search");
    u.searchParams.set("query", query);
    u.searchParams.set("orientation", "landscape");
    u.searchParams.set("per_page", "15");
    u.searchParams.set("size", "medium");
    let r;
    try { r = await fetch(u, { headers: { Authorization: key }, signal: AbortSignal.timeout(30000) }); }
    catch { continue; }
    if (r.status === 429) { keyIdx++; await sleep(1500); continue; }
    if (!r.ok) continue;
    const vids = ((await r.json()).videos || []);
    const cands = [];
    for (const v of vids) {
      const key2 = `pexels:${v.id}`;
      if (used.has(key2)) continue;
      const files = (v.video_files || []).filter((f) => /mp4/i.test(f.file_type || "mp4") && (f.width || 0) >= (f.height || 0) && (f.width || 0) >= 960);
      files.sort((a, b) => Math.abs((a.width || 0) - 1920) - Math.abs((b.width || 0) - 1920));
      if (files[0]) cands.push({ id: v.id, key: key2, link: files[0].link, w: files[0].width, h: files[0].height, dur: v.duration });
    }
    return cands;
  }
  return [];
}

async function dl(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(120000) });
      if (!r.ok) { await sleep(700); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 30000) return false;
      fs.writeFileSync(dest, buf);
      return true;
    } catch { await sleep(900); }
  }
  return false;
}

function reencode(src, dest) {
  const r = spawnSync(FF, ["-y", "-i", src, "-vf",
    "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30",
    "-r", "30", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-an", dest], { encoding: "utf8", maxBuffer: 64e6 });
  return r.status === 0 && fs.existsSync(dest) && fs.statSync(dest).size > 20000;
}

function fpsOf(f) {
  const r = spawnSync(FFP, ["-v", "0", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", f], { encoding: "utf8" });
  return (r.stdout || "").trim();
}

function meanY(f) {
  // YAVG del primer bloque via signalstats
  const r = spawnSync(FF, ["-i", f, "-vf", "signalstats,metadata=print:file=-", "-frames:v", "20", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 32e6 });
  const txt = (r.stderr || "") + (r.stdout || "");
  const ys = [...txt.matchAll(/YAVG=([0-9.]+)/g)].map((m) => +m[1]);
  if (!ys.length) return 128;
  return ys.reduce((a, b) => a + b, 0) / ys.length;
}

const items = JSON.parse(fs.readFileSync("scripts/_np_stock_refetch2.json", "utf8").replace(/^\uFEFF/, ""));
const okMoments = [];
let ok = 0, miss = 0, dark = 0, badfps = 0;
const missList = [];

for (let i = 0; i < items.length; i++) {
  const b = items[i];
  const dest = `${OUT}/${b.n}.mp4`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000 && fpsOf(dest) === "30/1") {
    okMoments.push({ p: b.p, t: "clip", n: b.n }); ok++;
    process.stdout.write(`[${i + 1}/${items.length}] SKIP-exists ${b.n}\n`); continue;
  }
  let cands = await pexelsSearch(b.q);
  let got = false;
  const tmp = `${TMP}/${b.n}_raw.mp4`;
  for (const c of cands.slice(0, 5)) {
    if (await dl(c.link, tmp)) {
      if (reencode(tmp, dest)) {
        const y = meanY(dest);
        if (y < 25) { fs.rmSync(dest, { force: true }); dark++; process.stdout.write(`[${i + 1}] DARK ${b.n} Y=${y.toFixed(0)} (try next)\n`); continue; }
        const fps = fpsOf(dest);
        if (fps !== "30/1") { fs.rmSync(dest, { force: true }); badfps++; process.stdout.write(`[${i + 1}] BADFPS ${b.n} ${fps}\n`); continue; }
        used.add(c.key);
        okMoments.push({ p: b.p, t: "clip", n: b.n }); ok++;
        process.stdout.write(`[${i + 1}/${items.length}] OK ${b.n} ${c.w}x${c.h} Y=${y.toFixed(0)} | ${b.q.slice(0, 34)}\n`);
        got = true; break;
      }
    }
  }
  fs.rmSync(tmp, { force: true });
  if (!got) {
    // fallback pixabay
    try {
      const hit = await pixabayVideo(b.q, 5, used);
      if (hit?.link && await dl(hit.link, tmp) && reencode(tmp, dest)) {
        const y = meanY(dest);
        if (y >= 25 && fpsOf(dest) === "30/1") {
          used.add(hit.key); okMoments.push({ p: b.p, t: "clip", n: b.n }); ok++; got = true;
          process.stdout.write(`[${i + 1}] OK(pixabay) ${b.n}\n`);
        } else fs.rmSync(dest, { force: true });
      }
    } catch {}
    fs.rmSync(tmp, { force: true });
  }
  if (!got) { miss++; missList.push(b); process.stdout.write(`[${i + 1}] MISS ${b.n} | ${b.q}\n`); }
  await sleep(220);
}

try { fs.writeFileSync("public/broll/_stock_used.json", JSON.stringify([...used], null, 1)); } catch {}
fs.writeFileSync("_np_stock_refetch2_moments.json", JSON.stringify(okMoments, null, 1));
fs.writeFileSync("scripts/_np_stock_refetch2_miss.json", JSON.stringify(missList, null, 1));
console.log(`\n=== nightprotein stock: ${ok} OK · ${miss} MISS · ${dark} dark · ${badfps} badfps de ${items.length} ===`);
console.log(`moments -> _np_stock_refetch2_moments.json (${okMoments.length})`);
