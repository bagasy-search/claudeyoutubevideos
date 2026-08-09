// needstock_lamina15.mjs — del plan a la lista de descarga de stock.
// Todo momento `clip` o `photo` pide material real. Los `imagen` van a gpt-image-2.
// ⚠️ public/broll/ es COMPARTIDA entre videos y el fetch SALTEA los que ya existen:
//    si nombro el archivo `s_045.mp4` me como el `s_045.mp4` de otro video.
//    Por eso TODO va prefijado `lamina15_`.
import fs from "node:fs";

const SLUG = "lamina15";
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));

const need = [];
const imgs = [];
for (const m of plan) {
  const name = `${SLUG}_${m.name}`;
  const dur = Math.max(2, Math.min(12, Number(m.seg) || 4));
  const q = (m.queries || []).filter(Boolean);
  if (m.tipo === "imagen") {
    imgs.push({ name, prompt: m.prompt || q[0], phrase: m.dice, query: q });
    continue;
  }
  // clip / photo / componente → todos quieren un plano real detrás
  //
  // ⛔ ERROR QUE COSTÓ LA PRIMERA TANDA ENTERA (225 clips, ~100% off-topic):
  // acá iba `concept: m.muestra`, o sea una FRASE LARGA EN ESPAÑOL. Pero
  // `stock_lib.acquireStock` busca en este orden: stockQuery(concept) → concept →
  // query → queries, y `stockQuery` se queda con 4 palabras sueltas del concept.
  // De "componente vs: 'lámina + aire' contra 'lámina sola'" sacaba 4 palabras en
  // español y se las mandaba a Pexels, que indexa en INGLÉS: devolvió pérgolas,
  // trompetistas, la marquesina del teatro de Chicago y un cuaderno rosa.
  // El `concept` TIENE que ser la query corta en INGLÉS (queries[1] por el brief).
  const en = q[1] || q[0];
  const es = q[0];
  need.push({
    name,
    concept: en,
    query: [en, es].filter(Boolean),
    queries: [en, es].filter(Boolean),
    dur,
    why: m.porque || "",
    kind: m.tipo,
  });
}

fs.writeFileSync(`_v3/${SLUG}_needstock.json`, JSON.stringify(need, null, 1), "utf8");
fs.writeFileSync(`_v3/${SLUG}_imgprompts.json`, JSON.stringify(imgs, null, 1), "utf8");
console.log(`stock: ${need.length}  ·  imágenes IA: ${imgs.length}`);
console.log(`→ _v3/${SLUG}_needstock.json`);
console.log(`→ _v3/${SLUG}_imgprompts.json`);
