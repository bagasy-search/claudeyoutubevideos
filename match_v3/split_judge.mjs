// match_v3/split_judge.mjs — parte el _manifest.json en batches para N agentes-juez
// en paralelo. GENÉRICO (reemplaza el _v3_split_judge.mjs raíz hardcodeado a dulcesv3).
//
// Usa el MANIFEST como fuente de verdad (no un glob de PNGs): solo se le muestran al
// juez los mosaicos de candidatos VIGENTES (los PNG huérfanos de corridas viejas que
// queden en el dir no contaminan).
//
// Uso: node match_v3/split_judge.mjs <mosaicsDir> [batchSize=8] [outDir=<mosaicsDir>/_judge]
import fs from "fs";
import path from "path";

const [dirArg, sizeArg, outArgP] = process.argv.slice(2);
if (!dirArg) { console.error("Uso: node split_judge.mjs <mosaicsDir> [batchSize=8] [outDir]"); process.exit(1); }
const SIZE = +(sizeArg || 8);
const OUT = outArgP || path.join(dirArg, "_judge");
// slug derivado del nombre del dir (_v3_<slug>_mosaics) → picks NAMESPACEADO por slug, así dos
// agentes-juez en paralelo no se pisan el picks.json. Si el dir no matchea, cae al nombre viejo.
const slug = (path.basename(dirArg).match(/^_v3_(.+)_mosaics$/) || [])[1] || "";
const picksOut = slug ? `_v3_${slug}_picks.json` : `${OUT.replace(/\\/g, "/")}/picks.json`;
const manifest = JSON.parse(fs.readFileSync(path.join(dirArg, "_manifest.json"), "utf8").replace(/^﻿/, ""));
fs.mkdirSync(OUT, { recursive: true });

const names = Object.keys(manifest).filter((n) => (manifest[n].candidates || []).length);
let nb = 0;
for (let i = 0; i < names.length; i += SIZE) {
  nb++;
  const batch = {};
  for (const n of names.slice(i, i + SIZE)) {
    const e = manifest[n];
    batch[n] = {
      phrase: e.phrase, desc: e.desc, shot: e.shot, scarce: !!e.scarce,
      candidates: (e.candidates || []).map((c) => ({
        id: c.id, title: c.title, channel: c.channel, cols: c.cols, rows: c.rows,
        duration: c.duration, frags: c.frags.map((f) => path.join(dirArg, f)),
      })),
    };
  }
  fs.writeFileSync(path.join(OUT, `batch_${String(nb).padStart(2, "0")}.json`), JSON.stringify(batch, null, 1));
}
console.log(`${names.length} beats con candidatos → ${nb} batches de ≤${SIZE} en ${OUT}/`);
console.log(`Lanzar 1 agente-juez por batch (prompt §2 de match_v3/PROMPTS.md) → cada uno escribe picks_NN.json`);
console.log(`Unir: node -e "const fs=require('fs');const o={};for(const f of fs.readdirSync('${OUT.replace(/\\/g, "/")}').filter(f=>f.startsWith('picks_')))Object.assign(o,JSON.parse(fs.readFileSync('${OUT.replace(/\\/g, "/")}/'+f,'utf8')));fs.writeFileSync('${picksOut}',JSON.stringify(o,null,1))"`);
