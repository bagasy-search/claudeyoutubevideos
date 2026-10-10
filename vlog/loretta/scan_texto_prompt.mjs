// 9-oct: agnes-image a veces ESCRIBE el sufijo del prompt ("Nobody is in the frame and no hands…") sobre libros/papeles.
// Escanea las fotos de los slugs cuyo prompt tiene un soporte con texto (libro, página, nota, carta, tarjeta…): el modelo de
// visión transcribe lo legible y se marcan las que copiaron palabras del prompt. → D:/rtmp/lnet46/scan_texto.json
//   node vlog/loretta/scan_texto_prompt.mjs slug1 slug2 ...
import fs from "node:fs"; import path from "node:path"; import os from "node:os"; import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/lnet46/";
const env = {}; for (const l of fs.readFileSync(R + ".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const KEYS = env.AGNES_KEYS.split(",").map((s) => s.trim()).filter(Boolean); let ki = 0;
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "") + "/chat/completions";
const SOPORTE = /\b(book|bible|page|pages|note|notes|letter|card|cards|paper|papers|calendar|sign|label|envelope|newspaper|recipe|notebook|journal|list|tag|bulletin|hymnal|program|ledger|receipt|chart|diary|postcard|guestbook|sheet)\b/i;
const MALAS = /\b(nobody|frame|hands|no writing|logos?|labels|plain objects|resting where|just before|after)\b/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const small = (f) => { const o = path.join(os.tmpdir(), "scan_" + path.basename(path.dirname(f)) + "_" + path.basename(f, path.extname(f)) + ".jpg"); if (!fs.existsSync(o)) execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f, "-vf", "scale='min(1024,iw)':-2", "-q:v", "4", o], { windowsHide: true }); return o; };
async function leer(f) {
  for (let t = 0; t < 40; t++) {
    try {
      const r = await fetch(API, { method: "POST", signal: AbortSignal.timeout(90000), headers: { Authorization: "Bearer " + KEYS[ki++ % KEYS.length], "Content-Type": "application/json" },
        body: JSON.stringify({ model: "agnes-3.0-flash", temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: 'Transcribe every READABLE word printed or written in this photo (on paper, books, signs, labels). Ignore unreadable scribbles. Reply ONLY JSON: {"words": "<the words, or empty>"}' }, { type: "image_url", image_url: { url: "data:image/jpeg;base64," + fs.readFileSync(small(f)).toString("base64") } }] }] }) });
      const txt = await r.text(); if (!r.ok) throw new Error(r.status + " " + txt.slice(0, 80));
      const m = (JSON.parse(txt).choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]).words || "" : "";
    } catch (e) { await sleep(/^429/.test(e.message) ? 8000 + Math.random() * 15000 : 3000); }
  }
  return "?";
}
const out = fs.existsSync("D:/rtmp/lnet46/scan_texto.json") ? JSON.parse(fs.readFileSync("D:/rtmp/lnet46/scan_texto.json", "utf8")) : {};
const cola = [];
for (const S of process.argv.slice(2)) {
  const n = JSON.parse(fs.readFileSync(R + `_v3/${S}_need.json`, "utf8"));
  const items = [...n.imgs, ...n.stock, ...n.clips.map((c) => ({ ...c, name: "K" + c.name }))];
  for (const it of items) {
    if (!SOPORTE.test(it.prompt || "")) continue;
    const f = ["jpg", "png"].map((e) => R + `public/img/${S}/${it.name}.${e}`).find((p) => fs.existsSync(p));
    if (f && !out[`${S}/${it.name}`]) cola.push({ S, name: it.name, f });
  }
}
console.log("a leer:", cola.length);
await Promise.all(Array.from({ length: 6 }, async () => { while (cola.length) { const it = cola.shift(); const w = await leer(it.f); out[`${it.S}/${it.name}`] = { words: w, mala: MALAS.test(w) }; if (MALAS.test(w)) console.log("✗", it.S, it.name, "→", w.slice(0, 120)); } }));
fs.writeFileSync("D:/rtmp/lnet46/scan_texto.json", JSON.stringify(out, null, 1));
const malas = Object.entries(out).filter(([, v]) => v.mala);
console.log(`MEDIDO: ${Object.keys(out).length} leídas · ${malas.length} con texto del prompt: ${malas.map(([k]) => k).join(" ")}`);
