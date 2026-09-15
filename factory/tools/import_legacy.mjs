// import_legacy.mjs — trae un video armado con el pipeline VIEJO a la fábrica, sin copiar bytes pesados:
// JSONs de _v3/ al layout de la fábrica y el wav máster por HARDLINK (mismo disco, 0 bytes extra).
// Marca como `done` las fases cuyos productos ya existen, así se puede correr desde 60_build (p.ej. en DRY).
//
//   node factory/tools/import_legacy.mjs <slug> --canal <estilo> --guion <txt> --voz <id> [--face <png>] --cta-ancla "<frase>" --cta-head "<texto>" [--wav <ruta>]
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/env.mjs";
import { slugPaths } from "../lib/paths.mjs";
import { State } from "../lib/state.mjs";
import { validateSpec } from "../lib/spec.mjs";

const args = process.argv.slice(2);
const slug = args[0];
const flag = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
if (!slug) { console.error("uso: ver cabecera"); process.exit(1); }
const P = slugPaths(slug);
const spec = {
  slug, canal: flag("--canal"), modo: flag("--face") ? "avatar" : "narrador", idioma: flag("--idioma") || "es", guion: flag("--guion"),
  voz: { id: flag("--voz") }, cta: { head: flag("--cta-head"), ancla: flag("--cta-ancla") },
  ...(flag("--face") ? { avatar: { face: flag("--face") } } : {}),
};
const errs = validateSpec(spec);
if (errs.length) { console.error("spec inválido:\n  - " + errs.join("\n  - ")); process.exit(1); }
fs.mkdirSync(path.join(ROOT, "factory", "specs"), { recursive: true });
const specFile = path.join(ROOT, "factory", "specs", `${slug}.json`);
if (!fs.existsSync(specFile)) fs.writeFileSync(specFile, JSON.stringify(spec, null, 2) + "\n");

fs.mkdirSync(path.dirname(P.mom), { recursive: true });
const copiados = [];
for (const [src, dst] of [["mom", P.mom], ["plan", P.plan], ["ventanas", P.ventanas], ["frases", P.frases], ["secciones", path.join(path.dirname(P.mom), "secciones.json")]]) {
  const f = path.join(ROOT, "_v3", `${slug}_${src}.json`);
  if (fs.existsSync(f)) { fs.copyFileSync(f, dst); copiados.push(src); }
}
const wav = flag("--wav") || `D:/rtmp/${slug}_audio/${slug}.wav`;
fs.mkdirSync(path.dirname(P.wav), { recursive: true });
if (!fs.existsSync(P.wav)) { try { fs.linkSync(wav, P.wav); } catch { fs.copyFileSync(wav, P.wav); } }
const st = new State(slug);
const legado = { status: "done", inputsHash: "legacy-import", medido: { importado: true } };
if (fs.existsSync(P.wav)) st.set("10_voice", legado);
if (fs.existsSync(P.mom)) { st.set("00_preflight", legado); st.set("20_asr", legado); }
if (fs.existsSync(P.plan)) { st.set("30_direct", legado); st.set("40_images", legado); st.set("50_agnes", legado); }
if (fs.existsSync(P.ventanas)) st.set("55_avatar", legado);
console.log(`importado ${slug}: ${copiados.join(", ")} · wav ${fs.existsSync(P.wav) ? "enlazado" : "FALTA"} · spec ${specFile}`);
console.log(`siguiente (sin tocar src/): FACTORY_DRY=1 node factory/run.mjs run ${slug} --only 60_build`);
