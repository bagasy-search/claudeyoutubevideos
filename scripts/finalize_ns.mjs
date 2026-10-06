// finalize_ns.mjs — combina los veredictos (audit 1 de 73 + re-audit 2 de 44), PODA NS_BROLL
// a solo on-topic (dur contigua al próximo on-topic), y arma @_nightserum_assets.txt desde el beatsheet.
import fs from "fs";
const SHEET = "D:/rtmp/tmp/claude/C--Users-bauti-Downloads/796d3c21-c458-46e9-b909-92cdb29dd9fe/scratchpad/ns_sheet";
const v1 = JSON.parse(fs.readFileSync(`${SHEET}/verdicts.json`, "utf8"));
let v2 = [];
try { v2 = JSON.parse(fs.readFileSync(`${SHEET}/verdicts2.json`, "utf8")); } catch {}
const ok = {};
for (const v of v1) ok[v.name] = v.ok;         // base: audit 1
for (const v of v2) ok[v.name] = v.ok;         // override: re-audit 2 (más nuevo)

const src = fs.readFileSync("src/_fed6/VideoEdit/nightserum_broll.ts", "utf8");
const arr = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1));
const keep = arr.filter((b) => ok[b.name] && fs.existsSync(`public/${b.src}`));
const caps = JSON.parse(fs.readFileSync("public/captions_nightserum.json", "utf8").replace(/^﻿/, ""));
const CW = caps.words || caps;
const VEND = ((CW[CW.length - 1].endMs || CW[CW.length - 1].startMs) / 1000) + 2;
for (let i = 0; i < keep.length; i++) keep[i].dur = +(((i + 1 < keep.length ? keep[i + 1].start : VEND) - keep[i].start)).toFixed(2);
fs.writeFileSync("src/_fed6/VideoEdit/nightserum_broll.ts",
  `// AUTO-GENERADO + PODADO on-topic (finalize_ns) — b-roll Pexels verificado por visión.\n` +
  `export const NS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(keep)};\n`);

// ── asset list desde el beatsheet ──
const bs = JSON.parse(fs.readFileSync("beatsheet/nightserum.json", "utf8"));
const assets = new Set();
const addImg = (p) => { if (!p) return; assets.add(p); const blur = p.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg"); if (fs.existsSync(`public/${blur}`)) assets.add(blur); };
for (const b of bs.beats) {
  if (b.src && /^(img|vid)\//.test(b.src)) addImg(b.src);
  if (b.image) addImg(b.image);
  if (b.cover) addImg(b.cover);
  if (b.qr) assets.add(b.qr);
  for (const s of (b.steps || [])) if (s.image) addImg(s.image);
}
for (const b of keep) assets.add(b.src);
const list = [...assets].sort();
fs.writeFileSync("_nightserum_assets.txt", list.join("\n") + "\n");
console.log(`NS_BROLL: ${arr.length} → ${keep.length} on-topic clips`);
console.log(`asset list: ${list.length} entries → _nightserum_assets.txt`);
