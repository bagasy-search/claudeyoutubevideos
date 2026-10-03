// media.mjs <cmd> — b-roll del formato NARRADOR. Corre desde la raíz del worktree; SLUG = carpeta de este archivo.
//   plan      → revisa duraciones por visual (usa tramos.json) y escribe vlog/SLUG/media.json
//   gptitems  → vlog/SLUG/_gpt_items.json para scripts/gptimg.mjs (G, P y A, y los W que fallaron)
//   pexels    → baja foto REAL de Pexels por cada W, filtrada con visión gratis (agnes-3.0-flash); los que no pasan → fallback gpt
//   agneslist → vlog/SLUG/_agnes_list.json para scripts/agnes_i2v.mjs (los A)
//   finalize  → convierte todo a jpg 1920x1080 en public/SLUG/img
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
const SLUG = path.basename(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")));
const V = `vlog/${SLUG}/`, IMG = `public/${SLUG}/img/`, RAW = `out/${SLUG}_imgs/`;
const J = (f, d) => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : d;
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const B = J(V + "beats.json", []); const TR = Object.fromEntries(J(V + "tramos.json", []).map(t => [t.beat, t]));
const NAME = (b, i) => `${b.id}_${i}`;
const PRES = "The presenter is a man of about 45 with black curly hair with volume and a short salt-and-pepper beard (exactly the face of the last input image), olive skin, wearing a navy-blue button-up work shirt with the sleeves rolled up, worn and marked with grease and dust, hands with grime. ";
const FRAME = "Candid photo taken on a modern smartphone, casual slightly imperfect framing with something cut by the edge of the frame, the only light is what the place really has, arriving from off frame, true-to-life colors, sharp focus, deep depth of field with the whole room in focus, the background cluttered with ordinary everyday objects that stay readable, nothing blurred out, realistic candid everyday snapshot, no filter, no ai look, mild sensor noise, no text, no letters, no labels, no signs";
const cmd = process.argv[2];
const vis = () => B.flatMap(b => b.visuals.map((v, i) => ({ ...v, name: NAME(b, i), beat: b.id, i, n: b.visuals.length })));

if (cmd === "plan") {
  let bad = 0; const out = [];
  for (const b of B) { const t = TR[b.id]; if (!t) continue; const d = t.len / b.visuals.length;
    const kinds = b.visuals.map(v => v.k); const maxA = kinds.includes("A") ? 4.0 : 7.5;
    const m = b.start ?? 0; const early = t.start < 60;
    if (d > maxA || d < 1.3 || (early && d > 3.2)) { bad++; console.log(`⚠ ${b.id} ${t.len.toFixed(1)}s / ${b.visuals.length} visuales = ${d.toFixed(1)}s ${early ? "(minuto 1)" : ""} → ${d > maxA || (early && d > 3.2) ? "agregá visuales" : "sacá visuales"} · ${b.text.slice(0, 50)}`); }
    out.push({ beat: b.id, dur: t.len, n: b.visuals.length }); }
  console.log(`beats ${B.length} · visuales ${vis().length} · con problema ${bad}`); fs.writeFileSync(V + "media.json", JSON.stringify(out)); process.exit(0);
}
if (cmd === "gptitems") {
  const done = J(V + "_pexels.json", {}); const items = [];
  for (const v of vis()) {
    if (v.k === "W" && done[v.name] === "ok") continue;
    if (fs.existsSync(RAW + v.name + ".png") || fs.existsSync(IMG + v.name + ".jpg")) continue;
    if (v.k === "P") items.push({ name: v.name, prompt: PRES + v.v + ". " + FRAME + ".", ref: `public/ref_${SLUG}_face.png` });
    else items.push({ name: v.name, prompt: v.v + ". " + FRAME + "." });
  }
  fs.writeFileSync(V + "_gpt_items.json", JSON.stringify(items, null, 1)); console.log("gpt items", items.length); process.exit(0);
}
if (cmd === "pexels") {
  const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean); const AK = (env.AGNES_KEYS || "").split(",").map(s => s.trim()).filter(Boolean);
  fs.mkdirSync(IMG, { recursive: true }); const state = J(V + "_pexels.json", {}); let kk = 0, ak = 0;
  const judge = async (url, q) => { for (let t = 0; t < 3; t++) try {
    const img = Buffer.from(await (await fetch(url)).arrayBuffer()).toString("base64");
    const r = await (await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(60000), headers: { Authorization: "Bearer " + AK[ak++ % AK.length], "Content-Type": "application/json" },
      body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: `Wanted: a realistic documentary-style photo that shows EXACTLY this: "${q}". Answer ONLY JSON {"score":0-10,"watermark_or_text":bool,"posed_stock_models":bool,"clean_studio_or_render":bool}. score = how precisely this exact object/scene is shown (10 = exactly it, 7 = clearly the right thing, 5 = loosely related, 0 = unrelated). Generic stock photos, posed models, studio shots, flat backgrounds or a different object score at most 4.` }, { type: "image_url", image_url: { url: "data:image/jpeg;base64," + img } }] }] }) })).json();
    return JSON.parse(r.choices[0].message.content.match(/\{[\s\S]*\}/)[0]); } catch { await new Promise(r => setTimeout(r, 2500)); } return null; };
  const list = vis().filter(v => v.k === "W" && state[v.name] !== "ok" && !fs.existsSync(IMG + v.name + ".jpg"));
  const used = new Set(Object.values(J(V + "_pexels_ids.json", {}))); const ids = J(V + "_pexels_ids.json", {});
  for (const v of list) {
    let hit = null;
    try { const s = await (await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(v.v)}&orientation=landscape&per_page=15`, { headers: { Authorization: KEYS[kk++ % KEYS.length] } })).json();
      for (const p of (s.photos || [])) { if (used.has(p.id) || p.width < 1600) continue; const j = await judge(p.src.medium, v.v);
        if (j && j.score >= 8 && !j.watermark_or_text && !j.posed_stock_models && !j.clean_studio_or_render) { hit = p; break; } } } catch (e) { console.log("pexels err", e.message.slice(0, 80)); }
    if (hit) { const buf = Buffer.from(await (await fetch(hit.src.large2x)).arrayBuffer()); const tmp = RAW + v.name + "_w.jpg"; fs.mkdirSync(RAW, { recursive: true }); fs.writeFileSync(tmp, buf);
      execFileSync("ffmpeg", ["-v", "error", "-y", "-i", tmp, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "2", IMG + v.name + ".jpg"]); used.add(hit.id); ids[v.name] = hit.id; state[v.name] = "ok"; console.log("✓ real", v.name, v.v.slice(0, 40)); }
    else { state[v.name] = "miss"; console.log("✗ sin foto real →gpt", v.name, v.v.slice(0, 40)); }
    fs.writeFileSync(V + "_pexels.json", JSON.stringify(state)); fs.writeFileSync(V + "_pexels_ids.json", JSON.stringify(ids));
  }
  console.log("reales", Object.values(state).filter(x => x === "ok").length, "/", vis().filter(v => v.k === "W").length); process.exit(0);
}
if (cmd === "agneslist") {
  const L = vis().filter(v => v.k === "A").map(v => ({ nombre: v.name, motion: v.motion || "the scene stays almost still, a slight natural movement of the objects", change: "", ...(/\b(he|his|man|presenter|Claudio)\b/i.test(v.v) ? { pres: true } : {}) }));
  fs.writeFileSync(V + "_agnes_list.json", JSON.stringify(L, null, 1)); console.log("clips agnes", L.length); process.exit(0);
}
if (cmd === "finalize") {
  fs.mkdirSync(IMG, { recursive: true }); let n = 0;
  for (const f of fs.existsSync(RAW) ? fs.readdirSync(RAW).filter(f => /\.png$/.test(f)) : []) { const dst = IMG + f.replace(/\.png$/, ".jpg");
    if (fs.existsSync(dst)) continue; execFileSync("ffmpeg", ["-v", "error", "-y", "-i", RAW + f, "-vf", "scale=1920:1080:flags=lanczos", "-q:v", "2", dst]); n++; }
  console.log("convertidas", n, "· total jpg", fs.readdirSync(IMG).filter(f => /\.jpg$/.test(f)).length); process.exit(0);
}
console.error("cmd?"); process.exit(1);
