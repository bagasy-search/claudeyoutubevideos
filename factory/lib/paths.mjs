// paths.mjs — TODA ruta de un slug sale de acá. Nada de rutas armadas a mano en las fases.
//
// Aislamiento: cada slug escribe SÓLO en
//   public/img/<slug>, public/broll/<slug>, public/<slug>.m4a, public/captions_<slug>.json, public/<slug>_meta.json
//   src/<slug>/, src/index_<slug>.tsx
//   <work>/<slug>/  (D: por defecto: C: vive lleno)
//   factory/_state/<slug>/
// (medido: otra sesión borró imágenes y QR de farinon/facrema81 con C: al 100 %).
import path from "node:path";
import { ROOT, env } from "./env.mjs";

export const WORK_ROOT = () => env("FACTORY_WORK") || "D:/rtmp/factory";
export const STATE_ROOT = () => env("FACTORY_STATE") || path.join(ROOT, "factory", "_state");

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{1,40}$/;
export function assertSlug(slug) {
  if (!SLUG_RE.test(slug || "")) throw new Error(`slug inválido "${slug}" (a-z0-9_- , 2-41)`);
  return slug;
}

export function slugPaths(slug, { root = ROOT, work = WORK_ROOT(), state = STATE_ROOT() } = {}) {
  assertSlug(slug);
  const W = path.join(work, slug);
  const cap = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
  return {
    slug, root, comp: cap,
    spec: path.join(root, "factory", "specs", `${slug}.json`),
    state: path.join(state, slug),
    work: W,
    // guion / voz / asr
    guion: path.join(W, "guion.txt"),
    fishDir: path.join(W, "fish"),
    fishMaster: path.join(W, "fish", "master.wav"),
    wav: path.join(W, "audio", `${slug}.wav`),
    wav16k: path.join(W, "audio", `${slug}_16k.wav`),
    m4a: path.join(root, "public", `${slug}.m4a`),
    captions: path.join(root, "public", `captions_${slug}.json`),
    // plan
    frases: path.join(W, "plan", "frases.json"),
    mom: path.join(W, "plan", "mom.json"),
    dirDir: path.join(W, "plan", "direccion"),
    plan: path.join(W, "plan", "plan.json"),
    ventanas: path.join(W, "plan", "ventanas.json"),
    // imágenes / clips
    imgDir: path.join(root, "public", "img", slug),
    brollDir: path.join(root, "public", "broll", slug),
    pngDir: path.join(W, "png"),
    listas: path.join(W, "listas"),
    faceRef: path.join(root, "public", `ref_${slug}_face.png`),
    // avatar
    avatarDir: path.join(W, "avatar"),
    // build
    srcDir: path.join(root, "src", slug),
    entry: path.join(root, "src", `index_${slug}.tsx`),
    assetsList: path.join(root, `_${slug}_assets.txt`),
    renderRef: `${slug}-render`,
    // render / entrega
    rawMp4: path.join(W, "render", `${slug}.mp4`),
    finalMp4: path.join(env("FACTORY_FINALS") || "D:/videosdeclaude", `${slug}.mp4`),
    meta: path.join(root, "public", `${slug}_meta.json`),
    gatesMd: path.join(W, "GATES.md"),
    rel: (abs) => path.relative(path.join(root, "public"), abs).split(path.sep).join("/"),
  };
}

/** ¿`p` queda adentro de alguna de las raíces permitidas del slug? (para borrar/escribir). */
export function insideSlug(slug, p) {
  const P = slugPaths(slug);
  const norm = (x) => path.resolve(x).toLowerCase() + path.sep;
  const target = path.resolve(p).toLowerCase();
  const roots = [P.work, P.imgDir, P.brollDir, P.srcDir, P.state].map(norm);
  const files = [P.m4a, P.captions, P.meta, P.entry, P.assetsList, P.faceRef].map((x) => path.resolve(x).toLowerCase());
  return roots.some((r) => (target + path.sep).startsWith(r)) || files.includes(target);
}
