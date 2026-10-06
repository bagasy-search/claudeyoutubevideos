// hojas_audit.mjs — arma contact sheets para auditar por visión.
//
//   node scripts/hojas_audit.mjs img  <lista.json> <outDir> [porHoja=20]
//   node scripts/hojas_audit.mjs clip <dirClips>   <outDir> [porHoja=6]
//
// Para CLIPS saca 3 fotogramas de cada uno (inicio/medio/fin) en una tira: así se ve
// si el movimiento es correcto o si el sujeto se deforma (el fallo típico del motor
// cuando se le pide animar algo estático).
// Escribe también <outDir>/_hojaNN.txt con los nombres en orden, para que el auditor
// pueda decir exactamente cuál falla.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const [MODO, SRC, OUT, POR = MODO === "clip" ? "6" : "20"] = process.argv.slice(2);
const por = Number(POR);
fs.mkdirSync(OUT, { recursive: true });

const esc = (p) => `"${p.split("\\").join("/")}"`;

let nombres = [], tira = null;
if (MODO === "img") {
  const items = JSON.parse(fs.readFileSync(SRC, "utf8").replace(/^﻿/, ""));
  nombres = items.map((i) => i.nombre || i.name).filter((n) => fs.existsSync(`public/img/${n}.png`));
  tira = (n) => `public/img/${n}.png`;
} else {
  nombres = fs.readdirSync(SRC).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, ""));
  // tira de 3 fotogramas por clip
  fs.mkdirSync(`${OUT}/_tiras`, { recursive: true });
  tira = (n) => {
    const dst = `${OUT}/_tiras/${n}.png`;
    if (!fs.existsSync(dst)) {
      execSync(`ffmpeg -v error -y -i ${esc(path.join(SRC, n + ".mp4"))} -vf "select='eq(n\\,3)+eq(n\\,24)+eq(n\\,45)',scale=440:248,setsar=1,format=rgb24,tile=3x1" -frames:v 1 ${esc(dst)}`);
    }
    return dst;
  };
}

const hojas = Math.ceil(nombres.length / por);
console.log(`${MODO}: ${nombres.length} elementos · ${hojas} hojas de ${por}`);
for (let h = 0; h < hojas; h++) {
  const grupo = nombres.slice(h * por, (h + 1) * por);
  fs.writeFileSync(`${OUT}/_hoja${h}.txt`, grupo.join("\n") + "\n");
  const ins = grupo.map((n) => `-i ${esc(tira(n))}`).join(" ");
  const esc2 = grupo.map((_, i) => `[${i}:v]scale=${MODO === "clip" ? "1320:248" : "470:264"},setsar=1,format=rgb24[v${i}];`).join("");
  const cad = grupo.map((_, i) => `[v${i}]`).join("");
  const cols = MODO === "clip" ? 1 : 5;
  const filas = Math.ceil(grupo.length / cols);
  execSync(`ffmpeg -v error -y ${ins} -filter_complex "${esc2}${cad}concat=n=${grupo.length}:v=1:a=0,tile=${cols}x${filas}" -frames:v 1 -q:v 4 ${esc(`${OUT}/hoja_${h}.jpg`)}`);
  process.stdout.write(`  hoja ${h + 1}/${hojas}\r`);
}
console.log(`\nlisto -> ${OUT}`);
