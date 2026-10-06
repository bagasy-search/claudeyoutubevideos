// Mapea timestamps (segundos) del auditor → scene del timeline + asset actual + narración.
// uso: node scripts/testo6_locate.mjs 877 889 1009 ...
import fs from "node:fs";
const T = JSON.parse(fs.readFileSync("src/VideoEdit/timeline_testo6.json", "utf8"));
const fps = T.fps || 30;
const ts = process.argv.slice(2).map(Number).filter(n => !Number.isNaN(n));
for (const t of ts) {
  const f = t * fps;
  const sc = T.scenes.find(s => f >= s.from && f < s.from + s.duration);
  if (!sc) { console.log(`t=${t}s → (sin scene)`); continue; }
  const L = sc.layers[0] || {};
  const asset = L.src || L.image || (L.cards ? `cards[${L.cards.length}]` : "(none)");
  console.log(`t=${t}s → ${sc.id} [${sc.from/fps}-${((sc.from+sc.duration)/fps).toFixed(0)}s] type=${L.type} vis=${sc.visual_type}`);
  console.log(`   asset: ${asset}`);
  console.log(`   narr : ${(sc.narration||"").slice(0,140)}`);
}
