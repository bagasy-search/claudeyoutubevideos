// finalize_v2_ns.mjs — mergea la cama d (ya on-topic en NS_BROLL) + la e (on-topic por e-verdicts),
// dedup por proximidad temporal, recalcula dur contigua, escribe NS_BROLL denso.
import fs from "fs";
const ESH = "D:/rtmp/tmp/claude/C--Users-bauti-Downloads/796d3c21-c458-46e9-b909-92cdb29dd9fe/scratchpad/ns_esheet";
const eVerd = JSON.parse(fs.readFileSync(`${ESH}/verdicts.json`, "utf8"));
const eOk = new Set(eVerd.filter((v) => v.ok).map((v) => v.name));
const extra = JSON.parse(fs.readFileSync("public/broll/extra_ns.json", "utf8"));

const src = fs.readFileSync("src/_fed6/VideoEdit/nightserum_broll.ts", "utf8");
const dClips = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1)); // ya on-topic
const eClips = extra.filter((b) => eOk.has(b.name) && fs.existsSync(`public/${b.src}`)).map((b) => ({ name: b.name, src: b.src, start: b.start, query: b.query }));

let all = [...dClips.map((b) => ({ name: b.name, src: b.src, start: b.start, query: b.query })), ...eClips]
  .filter((b) => fs.existsSync(`public/${b.src}`))
  .sort((a, b) => a.start - b.start);

// dedup por proximidad (MINGAP) — evita cortes demasiado rápidos
const MINGAP = 5.5;
const kept = [];
for (const b of all) { if (!kept.length || b.start - kept[kept.length - 1].start >= MINGAP) kept.push(b); }

const caps = JSON.parse(fs.readFileSync("public/captions_nightserum.json", "utf8").replace(/^﻿/, ""));
const CW = caps.words || caps;
const VEND = ((CW[CW.length - 1].endMs || CW[CW.length - 1].startMs) / 1000) + 2;
for (let i = 0; i < kept.length; i++) kept[i].dur = +(((i + 1 < kept.length ? kept[i + 1].start : VEND) - kept[i].start)).toFixed(2);

fs.writeFileSync("src/_fed6/VideoEdit/nightserum_broll.ts",
  `// AUTO-GENERADO + MERGE d+e on-topic (finalize_v2_ns) — cama densa Pexels verificada por visión.\n` +
  `export const NS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(kept)};\n`);
console.log(`d ${dClips.length} + e ${eClips.length} = ${all.length} on-topic · dedup(${MINGAP}s) → ${kept.length} clips · sep media ${(VEND / kept.length).toFixed(1)}s`);
