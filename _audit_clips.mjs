// _audit_clips.mjs — filtro OBJETIVO y barato sobre los clips de agnes, ANTES de la auditoría por visión.
// Detecta los dos defectos que se pueden medir sin mirar:
//   1) CONGELADO — el clip no se mueve (agnes a veces devuelve un Ken-Burns o una foto quieta)
//   2) CORTO/ROTO — duración < 2s o ffprobe falla
// Los que fallan se degradan a FOTO (red de seguridad documentada: clip -> auditoría -> foto del fallado).
// Salida: _v3/fedcolageno_asimage.json (lista de `name` que el gen convierte a mediakind image).
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const SLUG = "fedcolageno";
const DIR = "public/broll";
const beats = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const vids = beats.filter((b) => b.engine === "agnes_video");

const run = (args) => spawnSync("ffmpeg", args, { encoding: "utf8", maxBuffer: 1 << 26 });
const bad = [];
const missing = [];
let ok = 0, frozen = 0, short = 0;

for (const b of vids) {
  const p = `${DIR}/${SLUG}_${b.name}.mp4`;
  if (!fs.existsSync(p)) { missing.push(b.name); continue; }
  const pr = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((pr.stdout || "").trim());
  if (!isFinite(d) || d < 2) { bad.push(b.name); short++; continue; }
  // freezedetect: n=0.001 (umbral de diferencia muy chico) durante 2.5s seguidos = clip quieto
  const r = run(["-v", "info", "-i", p, "-vf", "freezedetect=n=-58dB:d=2.5", "-map", "0:v:0", "-f", "null", "-"]);
  const log = (r.stderr || "");
  const freezes = [...log.matchAll(/freeze_duration:\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
  const totalFreeze = freezes.reduce((a, x) => a + x, 0);
  if (totalFreeze > d * 0.75) { bad.push(b.name); frozen++; continue; }
  ok++;
}
fs.writeFileSync(`_v3/${SLUG}_asimage.json`, JSON.stringify(bad, null, 1));
console.log(`clips analizados ${vids.length} · OK ${ok} · congelados ${frozen} · cortos/rotos ${short} · faltantes ${missing.length}`);
console.log(`-> _v3/${SLUG}_asimage.json con ${bad.length} degradados a foto`);
if (missing.length) fs.writeFileSync(`_v3/${SLUG}_missing.json`, JSON.stringify(missing, null, 1));
