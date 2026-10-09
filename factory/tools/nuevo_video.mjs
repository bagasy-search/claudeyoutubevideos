// nuevo_video.mjs — un video NUEVO con sólo canal + título: arma el spec y Qwen escribe el guion.
//   node factory/tools/nuevo_video.mjs --canal harlan-lineman --titulo "…" [--tema "…"] [--min 3] [--slug x]
// Plantilla: el spec más reciente de ese canal (misma voz, avatar, CTA y efectos). Imprime `SLUG=<slug>`.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "../lib/env.mjs";
import { validateSpec } from "../lib/spec.mjs";

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : d; };
const canal = opt("canal"), titulo = opt("titulo");
if (!canal || !titulo) { console.log('uso: nuevo_video.mjs --canal <estilo> --titulo "…" [--tema "…"] [--min 3] [--slug x]'); process.exit(2); }
const SP = path.join(ROOT, "factory", "specs");
const fecha = (f) => Number(spawnSync("git", ["log", "-1", "--format=%ct", "--", f], { cwd: ROOT, encoding: "utf8" }).stdout.trim()) || fs.statSync(f).mtimeMs / 1000;
// Plantilla = spec real del canal más reciente (no las pruebas con avatar fijo).
const cands = fs.readdirSync(SP).map((f) => path.join(SP, f)).filter((f) => f.endsWith(".json"))
  .map((f) => ({ f, s: JSON.parse(fs.readFileSync(f, "utf8")) }))
  .filter(({ s }) => s.canal === canal && !s.overrides?.avatarFijo)
  .sort((x, y) => fecha(y.f) - fecha(x.f));
if (!cands.length) { console.error(`no hay ningún spec del canal "${canal}" para usar de plantilla (factory/specs)`); process.exit(1); }
const base = cands[0].s;
const pref = (canal.match(/[a-z]+/g) || ["v"]).map((w) => w[0]).join("").slice(0, 3);
const slug = opt("slug") || `${pref}${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${Math.random().toString(36).slice(2, 5)}`;
const overrides = { ...(base.overrides || {}) };
delete overrides.avatarFijo; delete overrides.apertura;
const spec = { ...base, slug, titulo, guion: `guiones/GUION_${slug}.txt`, overrides };
delete spec.bagasy;   // la tarjeta de Bagasy es de OTRO video
const errs = validateSpec(spec);
if (errs.length) { console.error("spec inválido:\n  " + errs.join("\n  ")); process.exit(1); }
fs.writeFileSync(path.join(SP, `${slug}.json`), JSON.stringify(spec, null, 2) + "\n");
console.log(`spec ${slug} (plantilla ${path.basename(cands[0].f)})`);
const seg = Math.round(Number(opt("min", 3)) * 60);
const r = spawnSync(process.execPath, [path.join(ROOT, "factory", "tools", "llm.mjs"), "guion", slug, "--tema", opt("tema", titulo), "--seg", String(seg)], { cwd: ROOT, stdio: "inherit", env: process.env });
if (r.status !== 0) process.exit(r.status || 1);
console.log(`SLUG=${slug}`);
