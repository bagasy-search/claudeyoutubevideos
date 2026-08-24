// _mk_agnes_fcssenales.mjs — junta los batches del DIRECTOR y emite:
//   _agnes_vid_fcssenales.json   (clips  -> public/broll/fcssenales_<n>.mp4)
//   _agnes_img_fcssenales.json   (fotos  -> public/img/fcssenales_<n>.png)
//   _hero_fcssenales.json        (fotos del PRESENTADOR -> gpt-image-2 low con ref_fcssenales.png)
//   _v3/fcssenales_beats.json    (entrada de gen_fcssenales.mjs)
// Estilo POSITIVO y CORTO (los negativos se DIBUJAN) + distancia de plano fija.
import fs from "node:fs";

const SLUG = "fcssenales";
const STYLE =
  "photorealistic, the subject fills the frame, even soft natural light, muted natural colours, " +
  "ordinary and plain, unstyled, the surroundings are bare. no text";
// identidad del presentador — se le pasa la ref del avatar aparte (gpt-image-2 /edits)
const HERO_STYLE =
  "casual photo taken with a phone, natural imperfections, nothing polished, no AI look, " +
  "low saturation, soft muted colours, natural hands. no text";

const moments = JSON.parse(fs.readFileSync(`_${SLUG}_moments.json`, "utf8"));
const byName = new Map(moments.map((m) => [m.n, m]));

const dir = [];
for (const f of fs.readdirSync(".").filter((x) => new RegExp(`^_dir_${SLUG}_\\d+\\.json$`).test(x)).sort()) {
  dir.push(...JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, "")));
}
const seen = new Set();
const clean = [];
for (const d of dir) {
  if (!byName.has(d.n)) { console.log(`⚠ momento inexistente: ${d.n}`); continue; }
  if (seen.has(d.n)) { console.log(`⚠ duplicado: ${d.n}`); continue; }
  seen.add(d.n); clean.push(d);
}
clean.sort((a, b) => a.n.localeCompare(b.n));

const vids = [], imgs = [], bks = [], heroes = [], beats = [];
for (const d of clean) {
  const m = byName.get(d.n);
  const nombre = `${SLUG}_${d.n}`;
  if (d.k === "v") {
    vids.push({ nombre, prompt_mov: `${d.d}. ${STYLE}` });
    // foto de RESPALDO del mismo momento: cubre la cola del clip y lo reemplaza si no llegó
    bks.push({ name: `${nombre}_bk`, prompt: `${d.d}. ${STYLE}` });
  } else if (d.k === "h") {
    heroes.push({ name: nombre, prompt: `${d.d}. ${HERO_STYLE}` });
  } else {
    imgs.push({ name: nombre, prompt: `${d.d}. ${STYLE}` });
  }
  beats.push({ name: d.n, anchor: m.anchor, desc: d.d, mediakind: d.k === "v" ? "video" : "image" });
}

fs.writeFileSync(`_agnes_vid_${SLUG}.json`, JSON.stringify(vids, null, 1));
fs.writeFileSync(`_agnes_img_${SLUG}.json`, JSON.stringify(imgs, null, 1));
fs.writeFileSync(`_agnes_bk_${SLUG}.json`, JSON.stringify(bks, null, 1));
fs.writeFileSync(`_hero_${SLUG}.json`, JSON.stringify(heroes, null, 1));
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(beats, null, 1));

const falt = moments.filter((m) => !seen.has(m.n)).map((m) => m.n);
console.log(`autorados ${clean.length}/${moments.length} · clips ${vids.length} · fotos ${imgs.length} · bk ${bks.length} · hero ${heroes.length}`);
if (falt.length) console.log(`FALTAN ${falt.length}: ${falt[0]} .. ${falt[falt.length - 1]}`);
