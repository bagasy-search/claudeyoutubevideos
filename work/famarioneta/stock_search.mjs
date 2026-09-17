// busca candidatos Pexels por momento S, baja miniaturas y arma hojas de contactos (a elegir a ojo)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SPEC } from "./spec.mjs";
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => [l.split("=")[0], l.slice(l.indexOf("=") + 1).trim()]));
const KEYS = [env.PEXELS_API_KEY, env.PEXELS_API_KEY2].filter(Boolean);
const DIR = "work/famarioneta/stock";
const OUT = `${DIR}/cands.json`;
const cands = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const used = new Set();
const S = Object.entries(SPEC).filter(([, s]) => s.t === "S").map(([k, s]) => ({ name: k, q: s.q }));
let ki = 0;
for (const it of S) {
  if (cands[it.name]?.q === it.q && cands[it.name].list.length) continue;
  let j = null;
  for (let a = 0; a < 4; a++) {
    const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(it.q)}&orientation=landscape&per_page=30`, { headers: { Authorization: KEYS[ki % KEYS.length] }, signal: AbortSignal.timeout(30000) }).catch(() => null);
    if (r && r.status === 429) { ki++; continue; }
    if (r && r.ok) { j = await r.json(); break; }
  }
  const list = (j?.videos || []).filter((v) => v.duration >= 12 && !used.has(v.id)).slice(0, 8).map((v) => {
    const f = (v.video_files || []).filter((f) => f.width >= 1280 && f.width <= 2732 && f.width > f.height).sort((a, b) => b.width - a.width)[0];
    return f ? { id: v.id, dur: v.duration, img: v.image, link: f.link, w: f.width } : null;
  }).filter(Boolean);
  list.forEach((c) => used.add(c.id));
  cands[it.name] = { q: it.q, list };
  console.log(it.name, it.q, list.length);
}
fs.writeFileSync(OUT, JSON.stringify(cands, null, 1));
// miniaturas + hojas: filas de 8 thumbs 240x135; 12 filas por hoja; etiqueta = nombre de archivo de fila (sin drawtext)
const names = Object.keys(cands).sort();
for (const n of names) for (let k = 0; k < cands[n].list.length; k++) {
  const f = `${DIR}/th_${n}_${k}.jpg`;
  if (!fs.existsSync(f)) try { execFileSync("curl", ["-sSL", "--max-time", "60", "-o", f + ".src", cands[n].list[k].img + (cands[n].list[k].img.includes("?") ? "&" : "?") + "w=320"]); execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f + ".src", "-vf", "scale=240:135:force_original_aspect_ratio=increase,crop=240:135", f]); fs.rmSync(f + ".src"); } catch { }
}
console.log("candidatos:", names.length, "momentos ·", names.reduce((a, n) => a + cands[n].list.length, 0), "clips");
