// doc_cliprank.mjs — para cada concepto (conceptos.tsv) elige los mejores cuadros/fotos del índice de doc_clipidx.
// Uso: node scripts/doc_cliprank.mjs <raiz> [topN=6]
//   lee <raiz>/conceptos.tsv (desde, hasta, clave, tipo, concepto EN) y <raiz>/idx/*.json
//   escribe <raiz>/rank.json: [{fila, clave, concepto, cands:[{p, vid, t, s}]}] sin repetir toma (±12 s del mismo video).
import fs from "fs";
import path from "path";
import { AutoTokenizer, CLIPTextModelWithProjection } from "@huggingface/transformers";

const R = process.argv[2], TOP = +(process.argv[3] || 6);
const MODEL = process.env.CLIP_MODEL || "Xenova/clip-vit-base-patch32";
const tok = await AutoTokenizer.from_pretrained(MODEL);
const txt = await CLIPTextModelWithProjection.from_pretrained(MODEL, { dtype: "q8" });
async function temb(arr) {
  const { text_embeds } = await txt(tok(arr, { padding: true, truncation: true }));
  const [n, d] = text_embeds.dims, a = text_embeds.data, out = [];
  for (let j = 0; j < n; j++) { const v = Array.from(a.slice(j * d, (j + 1) * d)); const m = Math.hypot(...v); out.push(v.map((x) => x / m)); }
  return out;
}
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

const NEG = ["a photo of text, a title card with words", "a news presenter in a television studio", "a person talking to the camera in an interview",
  "a logo on a plain background", "a computer generated 3D animation", "a blurry dark frame", "a map with labels", "a crowd of tourists taking selfies"];
const filas = fs.readFileSync(path.join(R, "conceptos.tsv"), "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("#"))
  .map((l, i) => { const [desde, hasta, clave, tipo, concepto] = l.split("\t"); return { fila: i, desde: +desde, hasta: +hasta, clave, tipo, concepto }; })
  .filter((f) => f.tipo === "R" || f.tipo === "F");

const items = [];
for (const f of fs.readdirSync(path.join(R, "idx"))) {
  const J = JSON.parse(fs.readFileSync(path.join(R, "idx", f), "utf8"));
  const k = f.split("__")[0], vid = f.split("__")[1].replace(".json", "");
  for (const it of J.items) items.push({ k, vid, p: it.p, t: it.t ?? null, e: it.e });
}
const NE = await temb(NEG);
for (const it of items) it.neg = Math.max(...NE.map((n) => dot(n, it.e)));
const CE = await temb(filas.map((f) => "a photo of " + f.concepto));

// qmap.json opcional {desde: [línea de doc_commonsq]}: la foto PUNTUAL del lugar exacto suma (gana a la toma genérica)
const QM = fs.existsSync(path.join(R, "qmap.json")) ? JSON.parse(fs.readFileSync(path.join(R, "qmap.json"), "utf8")) : {};
const BONO = +(process.env.Q_BONO || 0.08);
const GEMELO = 0.95;   // coseno imagen-imagen: por encima es la MISMA foto/toma (otro archivo) → no se repite
const usados = [];
const choque = (it) => usados.some((u) => u.p === it.p || dot(u.e, it.e) > GEMELO || (u.t !== null && u.vid === it.vid && u.k === it.k && Math.abs(u.t - it.t) < 12));
const out = [];
for (const [i, f] of filas.entries()) {
  const pool = items.filter((it) => f.clave === "-" || it.k === f.clave);
  const qs = (QM[f.desde] || []).map((q) => `q${String(q).padStart(2, "0")}_`);
  const sc = pool.map((it) => { const c = dot(CE[i], it.e), b = qs.some((q) => path.basename(it.p).startsWith(q)) ? BONO : 0; return { it, s: c + b - 0.6 * Math.max(0, it.neg - c + 0.02) }; }).sort((a, b) => b.s - a.s);
  const cands = [];
  for (const { it, s } of sc) {
    if (cands.length >= TOP) break;
    if (choque(it) || cands.some((c) => dot(c.e, it.e) > GEMELO || c.vid === it.vid && c.k === it.k && Math.abs((c.t ?? -99) - (it.t ?? 99)) < 12)) continue;
    cands.push({ p: it.p, k: it.k, vid: it.vid, t: it.t, s: +s.toFixed(4), e: it.e });
  }
  if (cands[0]) usados.push(cands[0]);
  out.push({ ...f, cands: cands.map(({ e, ...c }) => c) });
}
fs.writeFileSync(path.join(R, "rank.json"), JSON.stringify(out, null, 1));
console.log("filas", out.length, "· items", items.length);
