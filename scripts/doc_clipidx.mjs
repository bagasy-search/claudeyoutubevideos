// doc_clipidx.mjs — índice CLIP de cuadros de video + fotos para buscar el plano LITERAL de cada frase.
// Uso: node scripts/doc_clipidx.mjs <raiz>   (raiz tiene p360/<k>/*.mp4 y fotos/<k>/*.jpg)
//   → saca 1 cuadro cada PASO s (224 px) a <raiz>/frames/<k>/<vid>/, embebe y guarda <raiz>/idx/<k>__<vid>.json
//   Rutas "p" RELATIVAS a <raiz> (se juntan índices del farm y locales). Incremental: lo ya indexado no se repite. CLIP_DEVICE=dml cuelga en esta laptop; default CPU q8 (~40 img/s).
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { AutoProcessor, CLIPVisionModelWithProjection, RawImage } from "@huggingface/transformers";

const R = process.argv[2];
const PASO = +(process.env.PASO || 3);
const MODEL = process.env.CLIP_MODEL || "Xenova/clip-vit-base-patch32";
const DEV = process.env.CLIP_DEVICE || "cpu";
fs.mkdirSync(path.join(R, "idx"), { recursive: true });
const rel = (p) => path.relative(R, p).split(path.sep).join("/");

const proc = await AutoProcessor.from_pretrained(MODEL);
const vis = await CLIPVisionModelWithProjection.from_pretrained(MODEL, DEV === "cpu" ? { dtype: "q8" } : { device: DEV, dtype: "fp32" });

async function embed(files) {
  const out = [];
  for (let i = 0; i < files.length; i += 32) {
    const ims = await Promise.all(files.slice(i, i + 32).map((f) => RawImage.read(f)));
    const { image_embeds } = await vis(await proc(ims));
    const [n, d] = image_embeds.dims, a = image_embeds.data;
    for (let j = 0; j < n; j++) {
      const v = Array.from(a.slice(j * d, (j + 1) * d)); const m = Math.hypot(...v);
      out.push(v.map((x) => +(x / m).toFixed(4)));
    }
  }
  return out;
}

const jobs = [];
for (const k of fs.existsSync(path.join(R, "p360")) ? fs.readdirSync(path.join(R, "p360")) : [])
  for (const f of fs.readdirSync(path.join(R, "p360", k)).filter((f) => f.endsWith(".mp4"))) jobs.push({ k, f, tipo: "v" });
for (const k of fs.existsSync(path.join(R, "fotos")) ? fs.readdirSync(path.join(R, "fotos")).filter((d) => !d.startsWith("_")) : [])
  jobs.push({ k, f: null, tipo: "f" });

for (const j of jobs) {
  const id = j.tipo === "v" ? j.f.replace(".mp4", "") : "fotos";
  const dst = path.join(R, "idx", `${j.k}__${id}.json`);
  let files;
  if (j.tipo === "v") {
    const fd = path.join(R, "frames", j.k, id);
    if (fs.existsSync(dst)) continue;
    fs.mkdirSync(fd, { recursive: true });
    try {
      execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(R, "p360", j.k, j.f), "-vf", `fps=1/${PASO},scale=224:224:force_original_aspect_ratio=increase,crop=224:224`, "-q:v", "4", path.join(fd, "%05d.jpg")]);
    } catch (e) { console.log("X ffmpeg", j.f); continue; }
    files = fs.readdirSync(fd).filter((f) => f.endsWith(".jpg")).sort().map((f) => path.join(fd, f));
  } else {
    const fd = path.join(R, "fotos", j.k);
    const prev = fs.existsSync(dst) ? JSON.parse(fs.readFileSync(dst, "utf8")) : { items: [] };
    const ya = new Set(prev.items.map((x) => path.join(R, x.p)));
    files = fs.readdirSync(fd).filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => path.join(fd, f)).filter((f) => !ya.has(f));
    if (!files.length) continue;
    const E = await embed(files);
    prev.items.push(...files.map((p, i) => ({ p: rel(p), e: E[i] })));
    fs.writeFileSync(dst, JSON.stringify(prev));
    console.log("fotos", j.k, prev.items.length);
    continue;
  }
  const E = await embed(files);
  fs.writeFileSync(dst, JSON.stringify({ k: j.k, vid: id, paso: PASO, items: files.map((p, i) => ({ p: rel(p), t: i * PASO, e: E[i] })) }));
  console.log(j.k, id, files.length);
}
console.log("FIN");
