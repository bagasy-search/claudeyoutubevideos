// Juez de stock: cada hoja 4x2 de candidatos Pexels → agnes-3.0-flash elige los tiles que MUESTRAN el concepto
// (real, limpio, sin marca de agua, sin texto grande, sin cara hablando a cámara). Salida _v3/opalpred_stock_judge.json
// node vlog/opalpred/stock_judge.mjs D:/rtmp/hz_stock_cand
import fs from "node:fs";
const DIR = process.argv[2];
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]));
const KS = (env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const idx = JSON.parse(fs.readFileSync(DIR + "/_candidates.json", "utf8"));
const MODEL = process.env.JUDGE_MODEL || "agnes-3.0-flash";
let ki = 0; const out = {};
const SYS = `You judge stock video thumbnails for a documentary about an old woman keeping backyard chickens on a small Indiana farm. You get a 4x2 grid (tiles numbered 0-7, left to right, top row first; fewer tiles if the grid is incomplete) and a CONCEPT. Return ONLY JSON {"good":[tile numbers that clearly SHOW the concept as real footage],"best":<the single best tile or -1>,"why":"<10 words>"}. Reject a tile if: it does not show the concept, it has a watermark or big overlaid text, it is a person talking to the camera, it looks like CGI or a cartoon, or it is modern/luxury in a way that clashes with a small old Midwestern farm.`;
async function judge(name, it, a = 1) {
  const sheet = `${DIR}/${name}_sheet.jpg`;
  if (!fs.existsSync(sheet)) return { good: [], best: -1, why: "sin hoja" };
  try {
    const r = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(90000), headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[ki++ % KS.length]}` },
      body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "system", content: SYS }, { role: "user", content: [{ type: "text", text: `CONCEPT: ${it.concept} (search: ${it.query}). Tiles in this grid: ${it.candidates.length}.` }, { type: "image_url", image_url: { url: "data:image/jpeg;base64," + fs.readFileSync(sheet).toString("base64") } }] }] }) });
    if (!r.ok) { if (a < 4) { await new Promise((s) => setTimeout(s, 3000 * a)); return judge(name, it, a + 1); } return { good: [], best: -1, why: "http " + r.status }; }
    const c = (await r.json()).choices?.[0]?.message?.content || "";
    return JSON.parse((c.match(/\{[\s\S]*\}/) || ["{}"])[0]);
  } catch (e) { if (a < 4) return judge(name, it, a + 1); return { good: [], best: -1, why: e.message.slice(0, 60) }; }
}
const names = Object.keys(idx); let done = 0;
await Promise.all(Array.from({ length: 8 }, async () => { while (names.length) { const n = names.shift(); out[n] = await judge(n, idx[n]); if (++done % 10 === 0) console.log("juzgadas", done); } }));
fs.writeFileSync("_v3/opalpred_stock_judge.json", JSON.stringify(out, null, 1));
const tot = Object.values(out).reduce((s, v) => s + (v.good?.length || 0), 0);
console.log("hojas", Object.keys(out).length, "· tiles buenos", tot, "· sin ninguno:", Object.entries(out).filter(([, v]) => !v.good?.length).map(([k]) => k).join(" "));
