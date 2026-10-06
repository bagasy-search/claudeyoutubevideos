// entrega_nube.mjs — la entrega de un video renderizado EN LA NUBE (autopilot --render-local), sin humano.
//   node factory/tools/entrega_nube.mjs <slug>
// Por qué existe: el proxy de las sesiones en la nube NO deja crear releases ("not permitted for this session
// type") ni usar GraphQL (`gh release …`). Camino medido el 05-oct con hl20ds:
//   1. re-encode con el contrato de 90_deliver (tv/bt709, GOP 2 s, sin B-frames, audio = MEZCLA máster) + check_entrega
//   2. partes de 28 MB → rama huérfana temporal `entrega-<slug>` → workflow entrega.yml (une, verifica sha256,
//      publica el release <slug>/<slug>.mp4 y BORRA la rama)
//   3. scripts/deliver_card.mjs con spec.bagasy (--no-youtube; nunca done:true)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { env, ROOT } from "../lib/env.mjs";
import { loadSpec } from "../lib/spec.mjs";
import { slugPaths } from "../lib/paths.mjs";
import { REPO } from "../phases/80_render.mjs";

const slug = process.argv[2];
if (!slug) { console.log("uso: entrega_nube.mjs <slug>"); process.exit(2); }
const spec = loadSpec(slug);
const P = slugPaths(slug);
const repo = REPO();
const die = (m) => { console.error(`⛔ entrega: ${m}`); process.exit(1); };
const sh = (cmd, args, o = {}) => {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...o });
  if (r.status !== 0 && !o.allowFail) die(`${cmd} ${args.slice(0, 3).join(" ")}: ${((r.stderr || "") + (r.stdout || "")).slice(-400)}`);
  return (r.stdout || "").trim();
};
const dur = (f) => Number(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]));
if (!spec.bagasy) die("al spec le falta el bloque bagasy ({ channelKey, cardId })");
if (!fs.existsSync(P.meta)) die(`falta ${P.meta}: node factory/tools/llm.mjs meta ${slug}`);

// 1) re-encode de entrega
const finals = env("FACTORY_FINALS") || path.join(P.work, "final");
const crudo = path.join(finals, `${slug}.mp4`);
if (!fs.existsSync(crudo)) die(`no está el render local ${crudo}`);
const mix = path.join(P.work, "audio", `${slug}_mix.wav`);
const master = fs.existsSync(mix) ? mix : P.wav;
let desdeF = 0;   // corrimiento de la apertura con miniatura (mismo criterio que 90_deliver)
try { const m = fs.readFileSync(path.join(P.srcDir, `Main_${slug}.tsx`), "utf8").match(/<Sequence from=\{(\d+)\}[^>]*>\s*<Audio /); if (m) desdeF = Number(m[1]); } catch { /* sin Main */ }
const delay = desdeF / 30;
const durEntrega = dur(P.wav) + delay;
const out = path.join(finals, `${slug}_entrega.mp4`);
console.log(`re-encode de entrega (audio ${path.basename(master)}${desdeF ? `, corrido ${delay.toFixed(3)} s` : ""})…`);
sh("ffmpeg", ["-nostdin", "-v", "error", "-y", "-i", crudo, "-i", master, "-map", "0:v:0", "-map", "1:a:0",
  "-vf", "setpts=N/30/TB,scale=in_range=full:out_range=limited:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p", "-fps_mode", "passthrough",
  "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-c:v", "libx264", "-preset", "faster", "-crf", "22", "-maxrate", "4M", "-bufsize", "8M", "-g", "60", "-keyint_min", "60", "-sc_threshold", "0", "-bf", "0", "-threads", "0",
  "-af", `${desdeF ? `adelay=${Math.round(delay * 1000)}:all=1,` : ""}${master === mix ? "aformat=channel_layouts=stereo" : "pan=stereo|c0=c0|c1=c0"}`,
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", String(durEntrega), "-movflags", "+faststart", "-f", "mp4", out + ".part"]);
fs.renameSync(out + ".part", out);
if (Math.abs(dur(out) - durEntrega) > 1) die(`la entrega dura ${dur(out)} s y se esperaban ${durEntrega.toFixed(1)}`);
sh("node", ["scripts/check_entrega.mjs", out], { stdio: "inherit" });

// 2) partes → rama temporal → entrega.yml
const size = fs.statSync(out).size;
const sha = crypto.createHash("sha256").update(fs.readFileSync(out)).digest("hex");
const rama = `entrega-${slug}`;
const tmp = path.join(finals, `_transporte_${slug}`);
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
sh("split", ["-b", "28M", "-d", "-a", "2", out, path.join(tmp, `${slug}.mp4.0`)]);
const g = (args) => sh("git", ["-C", tmp, ...args]);
g(["init", "-q", "-b", rama]); g(["add", "."]);
g(["-c", "user.name=fabrica", "-c", "user.email=fabrica@users.noreply.github.com", "commit", "-qm", `partes de ${slug}.mp4 (temporal: entrega.yml la borra)`]);
g(["push", "-q", "-f", `https://github.com/${repo}`, `${rama}:${rama}`]);
fs.rmSync(tmp, { recursive: true, force: true });
const t0 = new Date(Date.now() - 60_000).toISOString().replace(/\.\d+Z$/, "Z");
sh("gh", ["api", "-X", "POST", `repos/${repo}/actions/workflows/entrega.yml/dispatches`, "-f", "ref=main", "-f", `inputs[slug]=${slug}`, "-f", `inputs[rama]=${rama}`, "-f", `inputs[sha256]=${sha}`]);
console.log(`entrega.yml disparado (${(size / 1048576).toFixed(0)} MB, sha ${sha.slice(0, 12)}…)`);
const espera = (ms) => spawnSync("sleep", [String(ms / 1000)]);
let run = null;
for (let i = 0; i < 120 && !(run && run.status === "completed"); i++) {
  espera(30_000);
  const r = JSON.parse(sh("gh", ["api", `repos/${repo}/actions/workflows/entrega.yml/runs?per_page=5&created=%3E${t0}`], { allowFail: true }) || "{}");
  run = (r.workflow_runs || [])[0] || run;
}
if (!run || run.conclusion !== "success") die(`entrega.yml no terminó bien (${run ? `${run.status}/${run.conclusion} ${run.html_url}` : "no arrancó"})`);
const asset = (JSON.parse(sh("gh", ["api", `repos/${repo}/releases/tags/${slug}`])).assets || []).find((a) => a.name === `${slug}.mp4`);
if (!asset || asset.size !== size) die(`el release tiene ${asset?.size || 0} bytes y el archivo ${size}`);
console.log(`release ✓ ${asset.size} bytes`);

// 3) Bagasy (re-entregas: la versión sube, si no el navegador sirve la vieja de caché)
const verFile = path.join(P.work, `${slug}_entrega_version.json`);
let v = 1;
try { v = Number(JSON.parse(fs.readFileSync(verFile, "utf8")).version) + 1 || 1; } catch { /* primera */ }
fs.writeFileSync(verFile, JSON.stringify({ version: v, ts: new Date().toISOString() }));
sh("node", ["scripts/deliver_card.mjs", spec.bagasy.channelKey, spec.bagasy.cardId, slug, "--no-youtube"], { stdio: "inherit", env: { ...process.env, MP4_SUFIJO: `?v=${v}` } });
console.log(`✅ ENTREGADO: https://github.com/${repo}/releases/download/${slug}/${slug}.mp4?v=${v} · tarjeta ${spec.bagasy.cardId}`);
