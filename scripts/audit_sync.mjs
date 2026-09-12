// audit_sync.mjs <slug> — AUDITORÍA de sincronización (regla dura del usuario):
// imprime, beat por beat, el ms de arranque + el TEXTO del caption en ese ms, para
// revisar a ojo que cada visual coincida con lo que dice el avatar. Nada al farm sin esto.
import fs from "fs";
const slug = process.argv[2];
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));
const caps = JSON.parse(fs.readFileSync(`public/captions_${slug}.json`, "utf8"));
const W = (caps.words || caps).map((x) => ({ s: (x.startMs || 0) / 1000, t: x.text }));
const textAt = (t, win = 2.6) => { const o = []; for (const w of W) { if (w.s < t - 0.1) continue; if (w.s > t + win) break; o.push(w.t); } return o.join(" ").replace(/\s+/g, " ").trim(); };
const name = (b) => {
  if (b.kind === "raw" || b.kind === "half") return (b.src || "").replace(/^(img|vid)\//, "").replace(/\.(png|mp4)$/, "");
  if (b.kind === "scrolldoc") return "SCROLLDOC[" + b.panels.map((p) => p.heading).join(",") + "]";
  if (b.kind === "avpizarra") return "PIZARRA[" + b.items.map((i) => i.title).join(",") + "]";
  if (b.kind === "headline") return "TXT:" + (b.tokens || []).map((t) => t.t).join(" ");
  if (b.kind === "quote") return "QUOTE:" + (b.text || "").slice(0, 30);
  return b.kind.toUpperCase() + (b.title ? ":" + b.title : "");
};
console.log(`\n=== AUDIT SYNC · ${slug} · ${bs.beats.length} beats ===`);
console.log(`(ms) [dur]  VISUAL  →  lo que DICE el avatar ahí\n`);
for (const b of bs.beats) {
  const mm = String(Math.floor(b.start / 60)).padStart(2, "0") + ":" + String(Math.floor(b.start % 60)).padStart(2, "0");
  const flag = b.dur < 1.2 ? " ⚠corto" : "";
  console.log(`${mm} [${b.dur.toFixed(1)}s] ${name(b).slice(0, 34).padEnd(34)} → "${textAt(b.start)}"${flag}`);
}
