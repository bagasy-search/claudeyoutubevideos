// STOCK REAL (Pexels) para las tomas `st` del director: busca, descarga candidatos, los juzga con visión barata (gpt-4o-mini, 1 cuadro medio)
// y deja el mejor a 30/1 CFR 1920x1080 sin audio en public/broll/olsup_st30/<name>.mp4. Registra autor/licencia en _v3/olsup_stock.json.
//   node vlog/olsup/stock.mjs [--only=name1,name2] [--redo]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olsup/", OUT = R + "public/broll/olsup_st30/", TMP = R + "out/stock_tmp/";
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
const env = {}; for (const l of fs.readFileSync(R + ".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const PK = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OK = env.OPENAI_API_KEY;
const arg = (k) => (process.argv.find((a) => a.startsWith("--" + k + "=")) || "").split("=")[1];
const RELAX = process.argv.includes("--relax");
const only = arg("only") ? new Set(arg("only").split(",")) : null, redo = process.argv.includes("--redo");
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olsup_shots.json", "utf8"));
const REG = fs.existsSync(R + "_v3/olsup_stock.json") ? JSON.parse(fs.readFileSync(R + "_v3/olsup_stock.json", "utf8")) : {};
const used = new Set(Object.values(REG).map((v) => v.id));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ki = 0;
const pex = async (q) => {
  for (let t = 0; t < 6; t++) {
    const key = PK[ki++ % PK.length];
    const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape&size=medium`, { headers: { Authorization: key } });
    if (r.status === 429) { await sleep(4000); continue; }
    if (!r.ok) throw new Error("pexels " + r.status);
    return (await r.json()).videos || [];
  }
  return [];
};
const ff = (a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { windowsHide: true });
const judge = async (jpg, q) => {
  const b64 = fs.readFileSync(jpg).toString("base64");
  const body = { model: "gpt-4o-mini", max_tokens: 120, response_format: { type: "json_object" }, messages: [{ role: "user", content: [
    { type: "text", text: `Stock video frame. Wanted content: "${q}". Reply JSON {"match":0-10 (does the frame show what was wanted, literally),"modern":0-10 (10 = clearly a modern kitchen/objects like quartz counters, plastic, electric appliances, bright white studio look; 0 = rustic/old-fashioned),"people":true/false (a visible face),"note":"5 words"}.` },
    { type: "image_url", image_url: { url: "data:image/jpeg;base64," + b64, detail: "low" } }] }] };
  for (let t = 0; t < 4; t++) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + OK, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.status === 429) { await sleep(5000); continue; }
    const j = await r.json(); try { return JSON.parse(j.choices[0].message.content); } catch { return { match: 0, modern: 10 }; }
  }
  return { match: 0, modern: 10 };
};
const need = shots.filter((s) => s.kind === "st" && (!only || only.has(s.name)) && (redo || !REG[s.name]));
console.log("st por resolver:", need.length);
let done = 0, miss = [];
const pool = async (s) => {
  const dur = s.dur;
  const qq = RELAX ? s.q.replace(/(in|on|of|with|and|the|a|into|over|at|for|from)/g, " ").split(/\s+/).filter(Boolean).slice(0, 3).join(" ") : s.q;
  const vids = await pex(qq);
  const cands = vids.filter((v) => !used.has(v.id) && v.duration >= Math.min(dur + 0.3, 6)).slice(0, 6);
  let best = null;
  for (const v of cands) {
    const files = v.video_files.filter((f) => f.file_type === "video/mp4" && f.width >= 1280).sort((a, b) => Math.abs(a.width - 1920) - Math.abs(b.width - 1920));
    if (!files.length) continue;
    const jpg = TMP + s.name + "_" + v.id + ".jpg";
    try {
      if (!fs.existsSync(jpg)) fs.writeFileSync(jpg, Buffer.from(await (await fetch(v.image)).arrayBuffer()));
      const j = await judge(jpg, s.q);
      const score = j.match * 2 - j.modern * 0.8 - (j.people ? 1 : 0);
      if (j.match >= (RELAX ? 5 : 6) && j.modern <= (RELAX ? 7 : 6) && (!best || score > best.score)) best = { v, f: files[0], score, j };
    } catch (e) { console.log("  cand fail", s.name, v.id, String(e.message).slice(0, 80)); }
  }
  if (!best) { miss.push(s.name); console.log("✗", s.name, "|", s.q); return; }
  const dst = OUT + s.name + ".mp4";
  best.tmp = TMP + s.name + "_" + best.v.id + ".mp4"; fs.writeFileSync(best.tmp, Buffer.from(await (await fetch(best.f.link)).arrayBuffer()));
  ff(["-i", best.tmp, "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p", "-r", "30", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-t", "16", dst]);
  used.add(best.v.id);
  REG[s.name] = { id: best.v.id, url: best.v.url, author: best.v.user?.name, q: s.q, score: best.score, j: best.j, dur: best.v.duration };
  fs.writeFileSync(R + "_v3/olsup_stock.json", JSON.stringify(REG, null, 1));
  console.log("✓", s.name, "|", best.j.note, "| match", best.j.match, "modern", best.j.modern, "| pexels", best.v.id);
};
// 4 en paralelo
let idx = 0;
await Promise.all(Array.from({ length: 4 }, async () => { while (idx < need.length) { const s = need[idx++]; try { await pool(s); } catch (e) { console.log("ERR", s.name, String(e.message).slice(0, 100)); miss.push(s.name); } done++; } }));
fs.writeFileSync(R + "_v3/olsup_stock_missing.json", JSON.stringify(miss, null, 1));
console.log("resueltos", need.length - miss.length, "de", need.length, "· faltan", miss.length, miss.join(" "));
