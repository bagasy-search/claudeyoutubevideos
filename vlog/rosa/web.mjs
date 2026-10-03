// web.mjs <slug> — FOTOS REALES de la web (Pexels) para los planos kind=web: busca 12, arma hoja numerada de 8, la juzga con visión
// (agnes-2.5-flash, gratis), baja la elegida y la conforma a 1920x1080 en D:/rtmp/<slug>/web/w_<i>.jpg.
// Los que no encuentran nada se degradan a kind=gpt en prompts.json (queda registrado en web/_result.json).
import fs from "node:fs"; import { spawnSync } from "node:child_process";
const slug = process.argv[2];
const R = `D:/rtmp/${slug}/`, OUT = R + "web/", SH = R + "web/_sheets/";
fs.mkdirSync(SH, { recursive: true });
const REPO = "C:/Users/bauti/Downloads/video2/";
const env = {}; for (const l of fs.readFileSync(REPO + ".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const PEX = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const OTHER = new Set((env.AGNES_KEYS_OTRA_PC || "").split(/[\s,;]+/).filter(Boolean));
const KS = (env.AGNES_KEYS || "").split(/[\s,;]+/).filter(Boolean).filter((k) => !OTHER.has(k));
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const prompts = JSON.parse(fs.readFileSync(R + "prompts.json", "utf8"));
const want = prompts.filter((p) => p.kind === "web" && !fs.existsSync(OUT + `w_${p.i}.jpg`));
console.log("web a buscar:", want.length, "· pexels", PEX.length, "· claves agnes", KS.length);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ki = 0, pk = 0;
const SYS = `You pick a REAL photograph for a warm Latin-American home-cooking YouTube channel narrated by a grandmother. You see a numbered contact sheet (8 thumbnails, number at the top-left corner, rows of 4) and the NARRATION line plus the SEARCH QUERY. Choose the single thumbnail that best SHOWS what the narration talks about (the food, the pot, the ingredient, the kitchen detail). REJECT any with visible text/logos/watermarks, restaurants or luxury design kitchens, people posing at the camera, plated gourmet food, or anything that does not show the subject. Answer ONLY JSON: {"pick": N or 0 if none is good, "why": "<8 words"}.`;
async function judge(p, sheet) {
  for (let a = 1; a <= 4; a++) {
    try {
      const b64 = fs.readFileSync(sheet).toString("base64");
      const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(90000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(ki++) % KS.length]}` },
        body: JSON.stringify({ model: "agnes-2.5-flash", temperature: 0, messages: [{ role: "system", content: SYS }, { role: "user", content: [{ type: "text", text: `NARRATION: ${p.text}\nSEARCH QUERY: ${p.query}` }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}` } }] }] }) });
      if (!r.ok) { await sleep(900 * a); continue; }
      const j = await r.json(); const c = j.choices?.[0]?.message?.content || "";
      const v = JSON.parse((c.match(/\{[\s\S]*\}/) || ["{}"])[0]); return { pick: +v.pick || 0, why: v.why || "" };
    } catch { await sleep(900 * a); }
  }
  return { pick: -1, why: "juez sin respuesta" };
}
async function one(p) {
  const key = PEX[(pk++) % PEX.length];
  const u = new URL("https://api.pexels.com/v1/search"); u.searchParams.set("query", p.query); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "14");
  let j; try { const r = await fetch(u, { headers: { Authorization: key }, signal: AbortSignal.timeout(30000) }); if (!r.ok) return { i: p.i, st: "pexels " + r.status }; j = await r.json(); } catch { return { i: p.i, st: "pexels err" }; }
  const cands = [];
  for (const ph of j.photos || []) {
    if (cands.length === 8) break;
    try { const im = await fetch(ph.src.medium, { signal: AbortSignal.timeout(30000) }); if (!im.ok) continue; const th = `${SH}${p.i}_${cands.length + 1}.jpg`; fs.writeFileSync(th, Buffer.from(await im.arrayBuffer())); cands.push({ n: cands.length + 1, link: ph.src.large2x || ph.src.large, th }); } catch {}
  }
  if (cands.length < 2) return { i: p.i, st: "pocos candidatos " + cands.length };
  const inputs = cands.flatMap((c) => ["-i", c.th]);
  const fl = cands.map((c, i) => `[${i}:v]scale=480:300:force_original_aspect_ratio=increase,crop=480:300,setsar=1,drawbox=x=0:y=0:w=46:h=44:color=black@0.8:t=fill,drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='${c.n}':x=12:y=4:fontsize=36:fontcolor=white[v${i}]`).join(";")
    + ";" + cands.map((_, i) => `[v${i}]`).join("") + `xstack=inputs=${cands.length}:layout=` + cands.map((_, i) => `${(i % 4) * 480}_${Math.floor(i / 4) * 300}`).join("|") + "[o]";
  const sheet = `${SH}${p.i}_sheet.jpg`;
  spawnSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", fl, "-map", "[o]", "-q:v", "4", sheet], { encoding: "utf8", windowsHide: true });
  if (!fs.existsSync(sheet)) return { i: p.i, st: "hoja falló" };
  const v = await judge(p, sheet);
  if (v.pick < 1 || v.pick > cands.length) return { i: p.i, st: "juez: ninguno (" + v.why + ")" };
  const c = cands[v.pick - 1];
  try {
    const r = await fetch(c.link, { signal: AbortSignal.timeout(60000) }); if (!r.ok) return { i: p.i, st: "descarga " + r.status };
    const raw = `${SH}${p.i}_raw.jpg`; fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
    const o = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", OUT + `w_${p.i}.jpg`], { encoding: "utf8", windowsHide: true });
    if (!fs.existsSync(OUT + `w_${p.i}.jpg`)) return { i: p.i, st: "conformar falló" };
  } catch { return { i: p.i, st: "descarga err" }; }
  return { i: p.i, st: "OK #" + v.pick + " " + v.why };
}
let n = 0, ok = 0; const res = [];
async function worker() { while (n < want.length) { const p = want[n++]; const r = await one(p); res.push(r); if (r.st.startsWith("OK")) ok++; if (res.length % 10 === 0) console.log(`[${res.length}/${want.length}] ok ${ok}`); } }
await Promise.all(Array.from({ length: 5 }, worker));
// los que fallaron se degradan a gpt
const failed = new Set(res.filter((r) => !r.st.startsWith("OK")).map((r) => r.i));
for (const p of prompts) if (p.kind === "web" && !fs.existsSync(OUT + `w_${p.i}.jpg`)) {
  p.kind = "gpt";
  const sc = p.query.replace(/^/, "");
  p.prompt = `Candid phone snapshot of ${sc}, seen from the side with steam visible, in a small old kitchen.` + (await import("./lib.mjs")).TAIL;
}
fs.writeFileSync(R + "prompts.json", JSON.stringify(prompts, null, 1));
fs.writeFileSync(OUT + "_result.json", JSON.stringify(res, null, 1));
console.log(`web: ${ok}/${want.length} elegidas · degradadas a gpt: ${failed.size}`);
