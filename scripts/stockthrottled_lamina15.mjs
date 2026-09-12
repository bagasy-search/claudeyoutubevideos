// stockthrottled_lamina15.mjs — descarga de stock CON FRENO.
//
// Por qué existe: `stockfallback.mjs` dispara las búsquedas sin pausa y Pexels
// devuelve **429 a partir de la 4ª llamada seguida**, aunque el header diga que
// quedan 10.000+ requests en la cuota horaria (hay un límite de RÁFAGA aparte).
// `acquireStock` se come el error con `.catch(() => null)` y el resultado se
// reporta como "sin stock en NINGUNA fuente" — que es exactamente la conclusión
// falsa de "el nicho es escaso" contra la que avisa la memoria del canal.
// Medido acá: 226 de 271 beats "sin stock" eran 429, no ausencia de material.
//
//   node scripts/stockthrottled_lamina15.mjs <needstock.json> [gapMs=1500]
import fs from "node:fs";
import { acquireStock } from "./stock_lib.mjs";

const [listArg, gapArg = "1500"] = process.argv.slice(2);
const GAP = +gapArg;
const OUT = "public/broll";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const all = JSON.parse(fs.readFileSync(listArg, "utf8").replace(/^﻿/, ""));
const pending = all.filter((b) => !fs.existsSync(`${OUT}/${b.name}.mp4`));
console.log(`${all.length} pedidos · ${all.length - pending.length} ya en disco · ${pending.length} a bajar (pausa ${GAP}ms)`);

let ok = 0, fail = 0;
const failed = [];
for (let i = 0; i < pending.length; i++) {
  const b = pending[i];
  let got = null;
  // hasta 3 intentos: el 429 se cura esperando, no cambiando la query
  for (let attempt = 1; attempt <= 3 && !got; attempt++) {
    got = await acquireStock(b, OUT).catch(() => null);
    if (!got) {
      const back = GAP * attempt * 3;
      if (attempt < 3) await sleep(back);
    }
  }
  if (got) { ok++; } else { fail++; failed.push({ name: b.name, concept: b.concept }); }
  if ((i + 1) % 20 === 0 || i === pending.length - 1) {
    console.log(`  ${i + 1}/${pending.length} · ok ${ok} · sin stock ${fail}`);
  }
  await sleep(GAP);
}
fs.writeFileSync("_v3/lamina15_stock_failed.json", JSON.stringify(failed, null, 1), "utf8");
console.log(`\n=== ok ${ok} · sin stock ${fail} → _v3/lamina15_stock_failed.json ===`);
