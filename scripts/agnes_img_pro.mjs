// agnes_img_pro.mjs — IMÁGENES GRATIS NIVEL "CUADRO DE VIDEO REAL" con agnes, de punta a punta (9-oct-2026).
//
//   node scripts/agnes_img_pro.mjs <lista.json> <outDir> [--rondas 3] [--sin-json] [--sin-pp] [--conc 9] [--work <dir>]
//   outDir recibe SÓLO las aprobadas (<name>.png); rondas, crudas y rechazadas van a --work (default <outDir>/_agnes_pro).
//   lista = [{ name, prompt, ref? }]   (prompt CORTO: la escena de ese segundo; ref = recorte de la CARA del presentador)
//
// Cadena (cada paso es su propio script, se puede correr suelto):
//   1. agnes_json_prompt.mjs  prompt corto → JSON hiperdetallado (gente contada, cuerpos AFUERA de los objetos)
//   2. agnes_img.mjs          agnes-image-2.5-flash (gratis) con el JSON como prompt
//   3. agnes_img_gate.mjs     juez de visión agnes-3.0 en DOS modos (todo junto + uno por chequeo); rechaza si
//                             CUALQUIERA marca algo. Medido 9-oct sobre 74 fotos etiquetadas a ojo: cada modo solo
//                             cazaba 7-8 de 11 defectos, combinados 10 de 11. Un falso rechazo cuesta una
//                             regeneración gratis de ~20 s; un defecto que pasa termina en el video.
//   4. rechazadas → se regeneran (agnes da otra imagen en cada llamada) hasta --rondas veces; las que nunca pasan
//      quedan en <outDir>/_sin_aprobar.json para revisar a ojo o mandar a gpt-image como excepción.
//   5. posproceso de "cámara común" (ffmpeg): color apenas lavado, ruido de sensor, algo de blandura → saca el
//      brillo pulido de IA. El original queda en <outDir>/_raw/.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [LIST, OUT] = args.filter((a, i) => !a.startsWith("--") && !(args[i - 1] || "").startsWith("--"));
if (!LIST || !OUT) { console.error("uso: node scripts/agnes_img_pro.mjs <lista.json> <outDir> [--rondas 3] [--sin-json] [--sin-pp] [--conc 9] [--work <dir>]"); process.exit(2); }
const RONDAS = Number(opt("--rondas", 3));
const CONC = opt("--conc", "9");
const WORK = opt("--work", path.join(OUT, "_agnes_pro"));
const RAW = path.join(WORK, "_raw"), REJ = path.join(WORK, "_rechazadas");
for (const d of [OUT, WORK, RAW, REJ]) fs.mkdirSync(d, { recursive: true });

const ENV = { ...process.env, AGNES_IMG_MODEL: process.env.AGNES_IMG_MODEL || "agnes-image-2.5-flash", AGNES_IDENT: process.env.AGNES_IDENT ?? " " };
const node = (script, a) => {
  const r = spawnSync(process.execPath, [path.join(HERE, script), ...a], { env: ENV, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const txt = (r.stdout || "") + (r.stderr || "");
  for (const l of txt.split(/\r?\n/)) if (/MEDIDO|✗|fallid/i.test(l)) console.log("   " + l.trim());
  return { code: r.status, txt };
};
const t0 = Date.now();
const min = () => ((Date.now() - t0) / 60000).toFixed(1) + " min";

// 1. JSON
let items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
if (!args.includes("--sin-json")) {
  const J = path.join(WORK, "_json.json");
  console.log(`1. expandiendo ${items.length} prompts a JSON …`);
  node("agnes_json_prompt.mjs", [LIST, J, "--conc", "8"]);
  const hechos = new Map(JSON.parse(fs.readFileSync(J, "utf8")).map((x) => [x.name, x]));
  const faltan = items.filter((x) => !hechos.has(x.name));
  if (faltan.length) console.log(`   ⚠️ ${faltan.length} sin JSON (van con el prompt corto): ${faltan.map((x) => x.name).slice(0, 8).join(", ")}`);
  items = items.map((x) => hechos.get(x.name) || x);
}

// 2-4. generar → juzgar → regenerar
const final = (n) => path.join(OUT, n + ".png");
const aprobadas = new Set(items.filter((x) => fs.existsSync(final(x.name)) && fs.existsSync(path.join(RAW, x.name + ".png"))).map((x) => x.name));
let pend = items.filter((x) => !aprobadas.has(x.name));
const historia = {};
for (let ronda = 1; ronda <= RONDAS && pend.length; ronda++) {
  const W = path.join(WORK, `_ronda${ronda}`);
  fs.rmSync(W, { recursive: true, force: true }); fs.mkdirSync(W, { recursive: true });
  const L = path.join(W, "_lista.json");
  fs.writeFileSync(L, JSON.stringify(pend, null, 1));
  console.log(`2. ronda ${ronda}: generando ${pend.length} … (${min()})`);
  node("agnes_img.mjs", [L, W, "--conc", CONC]);
  console.log(`3. ronda ${ronda}: juez en dos modos …`);
  node("agnes_img_gate.mjs", [L, W, "--out", path.join(W, "_g1.json"), "--conc", "10"]);
  node("agnes_img_gate.mjs", [L, W, "--out", path.join(W, "_g2.json"), "--conc", "6", "--foco"]);
  const g1 = JSON.parse(fs.readFileSync(path.join(W, "_g1.json"), "utf8"));
  const g2 = JSON.parse(fs.readFileSync(path.join(W, "_g2.json"), "utf8"));
  const siguen = [];
  for (const it of pend) {
    const f = path.join(W, it.name + ".png");
    if (!fs.existsSync(f)) { siguen.push(it); continue; }                       // agnes no la generó: otra vuelta
    const a = g1[it.name], b = g2[it.name];
    const fallas = [...new Set([...(a ? (a.ok ? [] : a.fallas) : ["sin_juez"]), ...(b ? (b.ok ? [] : b.fallas) : ["sin_juez"])])];
    if (a?.ok && b?.ok) { fs.copyFileSync(f, path.join(RAW, it.name + ".png")); aprobadas.add(it.name); }
    else {
      fs.copyFileSync(f, path.join(REJ, `${it.name}__r${ronda}.png`));
      (historia[it.name] ||= []).push({ ronda, fallas, motivo: [a?.motivo, b?.motivo].filter(Boolean).join(" | ").slice(0, 300) });
      siguen.push(it);
    }
  }
  console.log(`   ronda ${ronda}: ${pend.length - siguen.length} aprobadas · ${siguen.length} van de nuevo`);
  pend = siguen;
}
fs.writeFileSync(path.join(WORK, "_sin_aprobar.json"), JSON.stringify(pend.map((x) => ({ name: x.name, historia: historia[x.name] || [] })), null, 1));
fs.writeFileSync(path.join(WORK, "_rechazos.json"), JSON.stringify(historia, null, 1));

// 5. posproceso de cámara común
const PP = "scale=1280:720:flags=bicubic,eq=saturation=0.88:contrast=0.95:gamma=1.02,gblur=sigma=0.6,unsharp=3:3:0.4,noise=alls=8:allf=t";
let pp = 0;
for (const n of aprobadas) {
  const src = path.join(RAW, n + ".png");
  if (args.includes("--sin-pp")) { fs.copyFileSync(src, final(n)); continue; }
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-vf", PP, final(n)]);
  if (r.status === 0) pp++; else fs.copyFileSync(src, final(n));
}
console.log(`MEDIDO: ${items.length} pedidas · ${aprobadas.size} aprobadas (${pp} con posproceso) · ${pend.length} sin aprobar tras ${RONDAS} rondas → ${WORK}/_sin_aprobar.json · ${min()}`);
process.exit(pend.length ? 1 : 0);
