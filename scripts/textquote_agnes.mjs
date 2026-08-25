// textquote_agnes.mjs — 2ª opinión sobre "texto quemado": en vez de preguntar SI hay texto
// inventado (el modelo dice que sí ante cualquier etiqueta borrosa), le pide que lo TRANSCRIBA.
// Si no puede citar palabras reales, no hay texto legible: es falso positivo y el clip se salva.
//
//   node scripts/textquote_agnes.mjs <frames.jpg...>
import fs from "node:fs";
import path from "node:path";

const FRAMES = process.argv.slice(2);
const env = {};
for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KS = (env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const URL_ = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const MODEL = process.env.AGNES_VISION_MODEL || "agnes-2.5-flash";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uri = (f) => `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;

const PROMPT = `Look at this frame and TRANSCRIBE any text you can actually read in it.
Reply ONLY JSON: {"readable_text":["<exact words you can read>"],"any_readable":true|false,"where":"<short>"}
Only include text you can genuinely read letter by letter. If a label, dial or box is blurry, smeared or unreadable, do NOT guess and do NOT include it. If nothing is readable, return an empty list and any_readable false.`;

const free = KS.map(() => 0);
const pick = async () => {
  for (;;) {
    const now = Date.now(); let b = -1, bt = Infinity;
    for (let i = 0; i < KS.length; i++) if (free[i] < bt) { bt = free[i]; b = i; }
    if (bt <= now) return b;
    await sleep(Math.min(1500, bt - now));
  }
};

const out = [];
for (const f of FRAMES) {
  let got = null;
  for (let a = 0; a < 10 && !got; a++) {
    const ki = await pick();
    try {
      const r = await fetch(URL_, {
        method: "POST",
        headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "user", content: [
          { type: "text", text: PROMPT }, { type: "image_url", image_url: { url: uri(f) } }] }] }),
      });
      if (r.status === 429) { free[ki] = Date.now() + 20_000; continue; }
      if (!r.ok) { await sleep(1000 * (a + 1)); continue; }
      const d = await r.json();
      const m = (d.choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
      if (m) got = JSON.parse(m[0]);
    } catch { await sleep(1000); }
  }
  const words = (got?.readable_text || []).filter((w) => String(w).trim().length > 2);
  out.push({ frame: path.basename(f), any: !!got?.any_readable && words.length > 0, words });
  console.log(`${path.basename(f).padEnd(34)} ${words.length ? "TEXTO: " + words.join(" | ").slice(0, 90) : "(nada legible)"}`);
}
fs.writeFileSync("_v3/_textquote.json", JSON.stringify(out, null, 1));
console.log(`\ncon texto legible: ${out.filter((o) => o.any).length}/${out.length}`);
