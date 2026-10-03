// filtro.mjs <img...> — 1er filtro GRATIS con agnes-3.0-flash: identidad, vestuario, gente de más, luz. Imprime sólo lo marcado.
import fs from "fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const KS = env.AGNES_KEYS.split(",").map(s => s.trim()).filter(Boolean); let k = 0;
const uri = f => "data:image/png;base64," + fs.readFileSync(f).toString("base64");
const FACE = "public/ref_tdcrola_face.png";
const Q = 'Image 1 is a reference face. Image 2 is a video frame. Answer ONLY JSON: {"presenter_visible":bool,"same_person":bool,"navy_work_shirt_sleeves_rolled":bool,"people_count":int,"bright_enough":bool,"weird":"short note on anything broken or odd (extra limbs, melted objects, text) or empty"}. people_count = persons physically present in the scene (not pictures).';
async function ask(f) {
  for (let t = 0; t < 4; t++) try {
    const j = await (await fetch("https://apihub.agnes-ai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(60000), headers: { Authorization: "Bearer " + KS[k++ % KS.length], "Content-Type": "application/json" },
      body: JSON.stringify({ model: "agnes-3.0-flash", messages: [{ role: "user", content: [{ type: "text", text: Q }, { type: "image_url", image_url: { url: uri(FACE) } }, { type: "image_url", image_url: { url: uri(f) } }] }] }) })).json();
    return JSON.parse(j.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);
  } catch { await new Promise(r => setTimeout(r, 3000)); }
  return null;
}
const files = process.argv.slice(2); const res = {};
await Promise.all(files.map(async (f, i) => { await new Promise(r => setTimeout(r, i * 300)); res[f] = await ask(f); }));
let n = 0;
for (const f of files) { const v = res[f]; const nb = /\/(H1|PB|PC|PE|PD)[a-z]\//.test(f.replaceAll(String.fromCharCode(92), "/")) ? 2 : 1;
  const bad = !v ? ["sin respuesta"] : [v.presenter_visible && !v.same_person && "OTRA CARA", v.presenter_visible && !v.navy_work_shirt_sleeves_rolled && "vestuario", v.people_count > nb && `gente ${v.people_count}`, !v.bright_enough && "oscura", v.weird && !/^(none|no|n\/a|)$/i.test(v.weird.trim()) && v.weird].filter(Boolean);
  if (bad.length) { n++; console.log("⚠", f.replaceAll(String.fromCharCode(92), "/").split("/").slice(-3).join("/"), "·", bad.join(" · ")); } }
console.log(`filtro: ${n}/${files.length} marcadas`);
