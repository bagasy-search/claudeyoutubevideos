// Juez de stock (agnes-3.0-flash, gratis): 1er filtro del pool de Pexels. Guarda veredicto por id (reanudable).
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const KS = env.AGNES_KEYS.split(",").map(s => s.trim()).filter(Boolean); let k = 0;
const OUT = "D:/rtmp/olstove_src/pex/";
const pool = JSON.parse(fs.readFileSync(OUT + "pool.json", "utf8"));
const J = fs.existsSync(OUT + "juez.json") ? JSON.parse(fs.readFileSync(OUT + "juez.json", "utf8")) : {};
const Qs = `This frame is candidate b-roll for a video about heating a log cabin kitchen with an old cast iron wood stove (top-down fire, dry firewood, damper, chimney, safety). Search query: "%Q%". Answer ONLY JSON: {"ontopic": true|false (does the frame really show what the query says, no unrelated scene), "modern": true|false (obviously modern gadgets, gas or electric stoves, LED, 4K TV, neon), "text": true|false (readable text/logos/watermarks), "rustic": 1-10 (warm, real, authentic look, not glossy stock), "people": true|false (a face clearly visible)}`;
const ids = Object.keys(pool).filter(id => !J[id]);
let i = 0;
async function worker() {
  while (i < ids.length) {
    const id = ids[i++]; const v = pool[id]; const pf = OUT + `posters/${id}.jpg`;
    if (!fs.existsSync(pf)) continue;
    for (let t = 0; t < 3; t++) {
      try {
        const r = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + KS[k++ % KS.length], "Content-Type": "application/json" }, signal: AbortSignal.timeout(60000),
          body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: Qs.replace("%Q%", v.q) }, { type: "image_url", image_url: { url: "data:image/jpeg;base64," + fs.readFileSync(pf).toString("base64") } }] }] }) });
        const j = await r.json(); const s = j.choices?.[0]?.message?.content || "";
        const m = s.match(/\{[\s\S]*\}/); if (!m) throw new Error(s.slice(0, 80));
        J[id] = JSON.parse(m[0]); break;
      } catch (e) { await new Promise(s => setTimeout(s, 3000 * (t + 1))); }
    }
    if (i % 25 === 0) { fs.writeFileSync(OUT + "juez.json", JSON.stringify(J, null, 1)); console.log(i, "/", ids.length); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
fs.writeFileSync(OUT + "juez.json", JSON.stringify(J, null, 1));
const ok = Object.entries(J).filter(([, j]) => j.ontopic && !j.modern && !j.text && j.rustic >= 5);
console.log("juzgados", Object.keys(J).length, "· pasan", ok.length);
