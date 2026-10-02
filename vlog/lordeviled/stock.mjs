// STOCK REAL (Pexels) para las tomas con consulta (dir_q.mjs): busca 8 candidatos, arma una hoja numerada, la juzga con visión
// (agnes, gratis), baja el elegido y lo conforma (1920x1080, 30/1 CFR, sin audio, -bf 0, ≤9 s) en public/broll/lordeviled_st/<nombre>.mp4.
//   node vlog/lordeviled/stock.mjs [nombre …]      (sin nombres = todas las que tengan consulta y no tengan stock todavía)
// Compuertas: el juez rechaza texto/logos/marca de agua, caras posando a cámara, looks de cine y tomas que no muestran la escena;
// luma del arranque (YAVG mínimo de los primeros 0,7 s ≥ 40) sobre el clip final; imprime cuántos midió.
import fs from "node:fs"; import path from "node:path"; import { execFileSync, spawnSync } from "node:child_process";
import { Q } from "./dir_q.mjs";
const R = "D:/Proyectos/video2-wt/lordeviled/";
const env = {}; for (const l of fs.readFileSync(R + ".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const PEX = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const AG = (env.AGNES_KEYS || "").split(/[\s,;]+/).filter(Boolean);
const OTHER = new Set((env.AGNES_KEYS_OTRA_PC || "").split(/[\s,;]+/).filter(Boolean));
const KS = AG.filter((k) => !OTHER.has(k));
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const MODEL = process.env.STOCK_JUDGE || "agnes-2.5-flash";
const OUT = R + "public/broll/lordeviled_st/", SH = R + "_v3/stock/";
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(SH, { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_shots.json", "utf8"));
const scene = {}; for (const s of shots) if (s.prompt && !scene[s.name]) scene[s.name] = s.prompt.split(" One ordinary frame")[0].slice(0, 330);
const want = (process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(Q)).filter((n) => Q[n] && scene[n] && !fs.existsSync(OUT + n + ".mp4"));
const exCnt = new Set(shots.map((s) => s.name));
console.log("stock a buscar:", want.length, "· claves pexels", PEX.length, "· claves agnes", KS.length, "· modelo", MODEL);
let ki = 0, pk = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SYS = `You pick stock footage for a warm homemade-cooking YouTube channel (an 81-year-old Iowa grandmother). You see a numbered contact sheet (8 thumbnails, numbers in the corner, row by row 1-4 top, 5-8 bottom) and the SCENE the narration needs. Choose the ONE thumbnail that most literally shows that scene. Reject (answer 0) if none clearly shows it, or if the best one has any of: visible text/logos/watermark, a person posing and looking at the camera, a young influencer or studio-cinematic look, a dark moody or neon grade, a modern luxury kitchen, or the wrong food/action. Prefer ordinary home or church-kitchen realism, warm daylight, hands doing the action. Answer ONLY JSON: {"pick": <0-8>, "why": "<8 words>"}`;
async function judge(name, sheet) {
  for (let a = 1; a <= 4; a++) {
    try {
      const b64 = fs.readFileSync(sheet).toString("base64");
      const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(90000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(ki++) % KS.length]}` },
        body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "system", content: SYS }, { role: "user", content: [{ type: "text", text: `SCENE: ${scene[name]}\nSEARCH QUERY: ${Q[name]}` }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}`, detail: "low" } }] }] }) });
      if (!r.ok) { await sleep(900 * a); continue; }
      const j = await r.json(); const c = j.choices?.[0]?.message?.content || "";
      const v = JSON.parse((c.match(/\{[\s\S]*\}/) || ["{}"])[0]); return { pick: +v.pick || 0, why: v.why || "" };
    } catch { await sleep(900 * a); }
  }
  return { pick: -1, why: "juez sin respuesta" };
}
const luma = (f) => { const r = spawnSync("ffmpeg", ["-v", "info", "-t", "0.7", "-i", f, "-an", "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], { encoding: "utf8", windowsHide: true });
  const v = [...(r.stderr || "").matchAll(/YAVG=([0-9.]+)/g)].map((m) => +m[1]); return v.length ? Math.min(...v) : -1; };
async function one(name) {
  const key = PEX[(pk++) % PEX.length];
  const u = new URL("https://api.pexels.com/videos/search"); u.searchParams.set("query", Q[name]); u.searchParams.set("orientation", "landscape"); u.searchParams.set("size", "medium"); u.searchParams.set("per_page", "15");
  let j; try { const r = await fetch(u, { headers: { Authorization: key }, signal: AbortSignal.timeout(30000) }); if (!r.ok) return { name, st: "pexels " + r.status }; j = await r.json(); } catch (e) { return { name, st: "pexels err" }; }
  const cands = [];
  for (const v of j.videos || []) {
    const f = (v.video_files || []).filter((x) => /mp4/i.test(x.file_type || "mp4") && (x.width || 0) >= (x.height || 0) && (x.width || 0) >= 960).sort((a, b) => Math.abs((a.width || 0) - 1920) - Math.abs((b.width || 0) - 1920))[0];
    if (!f || !v.image || (v.duration || 0) < 4) continue;
    try { const im = await fetch(v.image, { signal: AbortSignal.timeout(30000) }); if (!im.ok) continue; const th = `${SH}${name}_${cands.length + 1}.jpg`; fs.writeFileSync(th, Buffer.from(await im.arrayBuffer())); cands.push({ n: cands.length + 1, link: f.link, th, dur: v.duration, id: v.id }); } catch {}
    if (cands.length === 8) break;
  }
  if (cands.length < 2) return { name, st: "pocos candidatos " + cands.length };
  const inputs = cands.flatMap((c) => ["-i", c.th]);
  const fl = cands.map((c, i) => `[${i}:v]scale=480:270:force_original_aspect_ratio=increase,crop=480:270,setsar=1,drawbox=x=0:y=0:w=46:h=44:color=black@0.8:t=fill,drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='${c.n}':x=12:y=4:fontsize=36:fontcolor=yellow[t${i}]`).join(";") + ";" + cands.map((_, i) => `[t${i}]`).join("") + `concat=n=${cands.length}:v=1:a=0[c];[c]tile=4x2:padding=4:color=white[o]`;
  const sheet = `${SH}${name}_sheet.jpg`;
  const ff = spawnSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", fl, "-map", "[o]", "-q:v", "4", sheet], { encoding: "utf8", windowsHide: true });
  if (!fs.existsSync(sheet)) return { name, st: "hoja falló " + (ff.stderr || "").slice(0, 80) };
  const v = await judge(name, sheet);
  if (v.pick < 1 || v.pick > cands.length) return { name, st: "juez: ninguno (" + v.why + ")" };
  const c = cands[v.pick - 1], raw = `${SH}${name}_raw.mp4`;
  try { const r = await fetch(c.link, { signal: AbortSignal.timeout(180000) }); if (!r.ok) return { name, st: "descarga " + r.status }; fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer())); } catch (e) { return { name, st: "descarga err" }; }
  const dst = OUT + name + ".mp4", tmp = SH + name + "_c.mp4";
  for (const ss of [0.5, 1.2]) {
    spawnSync("ffmpeg", ["-y", "-v", "error", "-ss", String(ss), "-i", raw, "-t", "9", "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "21", "-preset", "veryfast", "-bf", "0", "-g", "60", "-r", "30", tmp], { windowsHide: true });
    const y = luma(tmp); if (y >= 40) { fs.copyFileSync(tmp, dst); return { name, st: "OK #" + v.pick + " " + v.why + " luma " + y.toFixed(0) }; }
  }
  return { name, st: "luma de arranque baja" };
}
let i = 0, ok = 0; const res = [];
async function worker() { while (i < want.length) { const n = want[i++]; const r = await one(n); res.push(r); if (r.st.startsWith("OK")) ok++; console.log(`[${res.length}/${want.length}] ${r.name}: ${r.st}`); } }
await Promise.all(Array.from({ length: 5 }, worker));
console.log(`stock: ${ok}/${want.length} elegidos · medidos ${res.length}`);
fs.writeFileSync(SH + "_resultado.json", JSON.stringify(res, null, 1));
