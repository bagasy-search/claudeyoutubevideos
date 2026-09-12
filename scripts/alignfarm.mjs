// alignfarm.mjs — ORQUESTADOR del forced-alignment (Whisper/stable-ts) GRATIS en
// GitHub Actions. Hace todo el ciclo desde tu máquina (o desde donde corra Claude),
// sin necesitar GPU local:
//   1) empaqueta public/<slug>_16k.wav + transcript_<slug>.txt
//   2) los sube como RELEASE asset  align-<slug>
//   3) dispara el workflow align.yml (forced alignment en CPU)
//   4) espera a que termine y DESCARGA captions_<slug>_aligned.json a public/
//
// Requisitos (una vez):
//   - repo PÚBLICO con este proyecto (.github/workflows/align.yml incluido)
//   - GitHub CLI `gh` instalado y autenticado (gh auth login)
//   - estar parado en la raíz del repo
//   - public/<slug>_16k.wav ya generado (wav 16kHz mono) + transcript_<slug>.txt (guion exacto)
//
// Uso:
//   node scripts/alignfarm.mjs <slug> [modelo=medium]
//   ej:  node scripts/alignfarm.mjs estiercol medium
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";

const [slug, model = "medium"] = process.argv.slice(2);
if (!slug) {
  console.error("Uso: node scripts/alignfarm.mjs <slug> [modelo]");
  process.exit(1);
}
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

const wav = `public/${slug}_16k.wav`;
const txt = `transcript_${slug}.txt`;
if (!fs.existsSync(wav)) {
  console.error(`falta ${wav} (16kHz mono). Generalo: npx remotion ffmpeg -y -i <src> -ar 16000 -ac 1 ${wav}`);
  process.exit(1);
}
if (!fs.existsSync(txt)) {
  console.error(`falta ${txt} (el guion exacto)`);
  process.exit(1);
}

// 1) tarball con el audio + el guion (rutas relativas, el workflow las extrae igual en la raíz)
const tar = `align-${slug}.tar`;
execFileSync("tar", ["-cf", tar, wav, txt], { stdio: "inherit" });

// 2) subir como release asset (reemplaza si ya existe)
const relTag = `align-${slug}`;
try {
  out(`gh release view ${relTag}`);
  sh(`gh release delete ${relTag} --yes --cleanup-tag`);
} catch { /* no existe */ }
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "audio+guion para forced alignment"`);
fs.rmSync(tar);

// 3) disparar el workflow
console.log("disparando align.yml ...");
sh(`gh workflow run align.yml${process.env.FARM_REF ? ` --ref ${process.env.FARM_REF}` : ""} -f slug=${slug} -f model=${model}`);

// 4) esperar y descargar el resultado
console.log("esperando que aparezca la corrida ...");
execSync("sleep 8 2>/dev/null || ping -n 9 127.0.0.1 >NUL", { stdio: "ignore", shell: true });
const runId = out(`gh run list --workflow=align.yml --limit 1 --json databaseId --jq ".[0].databaseId"`);
console.log("corrida:", runId, "— siguiendo (CPU, puede tardar mas que con GPU local)...");
try {
  sh(`gh run watch ${runId} --exit-status`);
} catch {
  console.error("la corrida fallo; revisá: gh run view " + runId);
  process.exit(1);
}
sh(`gh run download ${runId} -n aligned-${slug} -D public`);
console.log(`\n✅ listo → public/captions_${slug}_aligned.json`);
