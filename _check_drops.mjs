// _check_drops.mjs — compara el GUION con lo que realmente dice el audio (ASR) y reporta tramos OMITIDOS.
// Fish a veces se salta palabras; un salto en una advertencia de seguridad no es aceptable.
import fs from "fs";
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ")
  .replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();

const NUM = { "0": "cero", "1": "uno", "2": "dos", "3": "tres", "4": "cuatro", "5": "cinco", "6": "seis", "7": "siete", "8": "ocho", "9": "nueve", "10": "diez", "12": "doce", "15": "quince", "20": "veinte", "25": "veinticinco", "35": "treinta", "50": "cincuenta", "55": "cincuenta", "60": "sesenta", "69": "sesenta", "70": "setenta", "80": "ochenta", "160": "ciento", "400": "cuatrocientos", "500": "quinientos", "600": "seiscientos", "1747": "mil", "2014": "dos", "2017": "dos" };
const words = (t) => norm(t).split(" ").filter(Boolean).map((w) => NUM[w] || w);

const G = words(fs.readFileSync("guion_fedcolageno.txt", "utf8"));
const A = words(fs.readFileSync("transcript_fedcolageno.txt", "utf8"));
console.log(`guion ${G.length} palabras   audio ${A.length} palabras   dif ${G.length - A.length}`);

// LCS por ventana deslizante (greedy con lookahead) — suficiente para detectar huecos
let i = 0, j = 0;
const gaps = [];
const LOOK = 60;
while (i < G.length && j < A.length) {
  if (G[i] === A[j]) { i++; j++; continue; }
  // buscar la proxima coincidencia de 4 palabras seguidas
  let best = null;
  for (let di = 0; di < LOOK && !best; di++) {
    for (let dj = 0; dj < LOOK; dj++) {
      let ok = true;
      for (let k = 0; k < 4; k++) if (G[i + di + k] !== A[j + dj + k]) { ok = false; break; }
      if (ok) { best = [di, dj]; break; }
    }
  }
  if (!best) { i++; j++; continue; }
  const [di, dj] = best;
  if (di - dj >= 4) gaps.push({ at: i, omitido: G.slice(i, i + di).join(" "), sustituido: A.slice(j, j + dj).join(" ") });
  i += di; j += dj;
}
console.log(`\ntramos OMITIDOS por el audio (>=4 palabras): ${gaps.length}`);
for (const g of gaps) console.log(`  [pal ${g.at}] falta: "${g.omitido}"   |  dijo: "${g.sustituido}"`);
