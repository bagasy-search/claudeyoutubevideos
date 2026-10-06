// ttsfarm.mjs — ORQUESTADOR de la narracion con voz clonada (Chatterbox) GRATIS en
// GitHub Actions. Corre gen_tts.py en CPU para maquinas sin GPU NVIDIA:
//   1) empaqueta transcript_<slug>.txt (+ el wav de referencia de voz, si se pasa)
//   2) los sube como RELEASE asset  tts-<slug>
//   3) dispara el workflow tts.yml (Chatterbox en CPU)
//   4) espera a que termine y DESCARGA public/<slug>.wav (+ _timing.json)
//
// Requisitos (una vez):
//   - repo PÚBLICO con este proyecto (.github/workflows/tts.yml incluido)
//   - GitHub CLI `gh` instalado y autenticado (gh auth login)
//   - estar parado en la raíz del repo
//   - transcript_<slug>.txt ya escrito (el guion exacto)
//
// Uso:
//   node scripts/ttsfarm.mjs <slug> [lang=en] [ref=""] [exaggeration=0.5] [cfg=0.5]
//   ej:  node scripts/ttsfarm.mjs svalbard en "" 0.6 0.5
//   ej (con voz clonada ya guardada en public/):  node scripts/ttsfarm.mjs cronicas es ref_trevor.wav 0.7 0.5
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";

const [slug, lang = "en", ref = "", exaggeration = "0.5", cfg = "0.5"] = process.argv.slice(2);
if (!slug) {
  console.error("Uso: node scripts/ttsfarm.mjs <slug> [lang] [ref] [exaggeration] [cfg]");
  process.exit(1);
}
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

const txt = `transcript_${slug}.txt`;
if (!fs.existsSync(txt)) {
  console.error(`falta ${txt} (el guion exacto)`);
  process.exit(1);
}
const refPath = ref ? `public/${ref}` : null;
if (refPath && !fs.existsSync(refPath)) {
  console.error(`falta ${refPath} (el wav de referencia de voz)`);
  process.exit(1);
}

// 1) tarball con el guion (+ ref de voz si se paso)
const tar = `tts-${slug}.tar`;
const items = [txt, ...(refPath ? [refPath] : [])];
execFileSync("tar", ["-cf", tar, ...items], { stdio: "inherit" });

// 2) subir como release asset (reemplaza si ya existe)
const relTag = `tts-${slug}`;
try {
  out(`gh release view ${relTag}`);
  sh(`gh release delete ${relTag} --yes --cleanup-tag`);
} catch { /* no existe */ }
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "guion+ref de voz para TTS"`);
fs.rmSync(tar);

// 3) disparar el workflow
console.log("disparando tts.yml ...");
sh(`gh workflow run tts.yml${process.env.FARM_REF ? ` --ref ${process.env.FARM_REF}` : ""} -f slug=${slug} -f lang=${lang} -f ref=${ref} -f exaggeration=${exaggeration} -f cfg=${cfg}`);

// 4) esperar y descargar el resultado
console.log("esperando que aparezca la corrida ...");
execSync("sleep 8 2>/dev/null || ping -n 9 127.0.0.1 >NUL", { stdio: "ignore", shell: true });
const runId = out(`gh run list --workflow=tts.yml --limit 1 --json databaseId --jq ".[0].databaseId"`);
console.log("corrida:", runId, "— siguiendo (CPU, Chatterbox es autoregresivo: bastante mas lento que en GPU)...");
try {
  sh(`gh run watch ${runId} --exit-status`);
} catch {
  console.error("la corrida fallo; revisá: gh run view " + runId);
  process.exit(1);
}
sh(`gh run download ${runId} -n tts-out-${slug} -D public`);
console.log(`\n✅ listo → public/${slug}.wav`);
