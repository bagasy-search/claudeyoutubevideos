// minifrases_cmeciclo.mjs — RE-CORTA el primer tramo del video en MINI-FRASES.
//
// Pedido del creador: "que el primer minuto sea mas dinamico, cada mini frase que el dice una img
// y animado, entonces parece real". Hoy ese tramo tiene planos de 8-10 s y cuatro de ellos son
// avatar solo: se lee lento y se nota armado.
//
// Corta por CLÁUSULA (comas, dos puntos, y/pero/porque) apuntando a ~3 s, y re-ancla cada trozo
// con el mapa de ms POR PALABRA que ya se calculó con la alineación global — así los cortes caen
// en el ms REAL de la locución y no en una estimación.
import fs from "node:fs";

const SLUG = "cmeciclo";
const HASTA_MS = 75_400;          // el primer tramo, hasta donde termina m010
const OBJETIVO_S = 3.0;            // duración buscada por mini-frase
const MIN_S = 1.6;                 // nada más corto que esto (parpadea)

const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
const MM = rd(`_v3/${SLUG}_moments_ms.json`);
const WM = rd(`_v3/${SLUG}_wordms.json`).palabras;

const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

// cursor global sobre las palabras del guion, para no re-buscar desde cero
let cursor = 0;
const msDe = (palabras) => {
  const objetivo = palabras.map(norm).filter(Boolean);
  for (let i = cursor; i < WM.length - objetivo.length + 1; i += 1) {
    let ok = true;
    for (let k = 0; k < objetivo.length; k += 1) if (WM[i + k].w !== objetivo[k]) { ok = false; break; }
    if (ok) { cursor = i + objetivo.length; return [WM[i].ms, WM[i + objetivo.length - 1].ms]; }
  }
  return null;
};

const viejos = MM.moments.filter((m) => m.start_ms < HASTA_MS);
const resto = MM.moments.filter((m) => m.start_ms >= HASTA_MS);

const salida = [];
let n = 0;
for (const m of viejos) {
  // partir en cláusulas; si una queda muy larga, partirla otra vez por conjunción
  let trozos = m.text.split(/(?<=[,;:.])\s+/).filter(Boolean);
  const repartidos = [];
  for (const t of trozos) {
    if (t.length > OBJETIVO_S * 16.3 * 1.9) {
      const sub = t.split(/\s+(?=(?:y|pero|porque|donde|que|cuando|hasta)\s)/i).filter(Boolean);
      repartidos.push(...(sub.length > 1 ? sub : [t]));
    } else repartidos.push(t);
  }
  // juntar los muy cortos con el siguiente
  const juntos = [];
  for (const t of repartidos) {
    const ultimo = juntos[juntos.length - 1];
    if (ultimo && (ultimo.length < OBJETIVO_S * 16.3 * 0.55 || t.length < 18)) juntos[juntos.length - 1] = `${ultimo} ${t}`;
    else juntos.push(t);
  }

  for (let i = 0; i < juntos.length; i += 1) {
    const txt = juntos[i].trim();
    const r = msDe(txt.split(/\s+/));
    if (!r) { console.error(`⛔ no ubiqué: ${txt.slice(0, 50)}`); process.exit(1); }
    n += 1;
    salida.push({
      id: `n${String(n).padStart(3, "0")}`,
      viene_de: m.id, sec: m.sec, secName: m.secName,
      text: txt, anchor: txt.split(/\s+/).slice(0, 8).join(" "),
      start_ms: r[0], end_ms: r[1],
    });
  }
}

// el fin de cada mini-frase es el arranque de la siguiente (sin huecos ni solapes)
for (let i = 0; i < salida.length; i += 1) {
  salida[i].end_ms = i + 1 < salida.length ? salida[i + 1].start_ms : (resto[0]?.start_ms ?? HASTA_MS);
}
// absorber las que quedaron por debajo del mínimo hacia atrás
const fin = [];
for (const s of salida) {
  const prev = fin[fin.length - 1];
  if (prev && (s.end_ms - s.start_ms) < MIN_S * 1000) { prev.end_ms = s.end_ms; prev.text += " " + s.text; }
  else fin.push(s);
}
fin.forEach((s, i) => { s.id = `n${String(i + 1).padStart(3, "0")}`; });

const durs = fin.map((s) => (s.end_ms - s.start_ms) / 1000).sort((a, b) => a - b);
console.log(`tramo re-cortado: ${viejos.length} planos viejos → ${fin.length} mini-frases`);
console.log(`  dur mediana ${durs[durs.length >> 1].toFixed(1)}s · min ${durs[0].toFixed(1)}s · max ${durs.at(-1).toFixed(1)}s`);
console.log(`  cubre 0s → ${(fin.at(-1).end_ms / 1000).toFixed(1)}s`);
fs.writeFileSync(`_v3/${SLUG}_minifrases.json`, JSON.stringify(fin, null, 1));
for (const s of fin) console.log(`  ${(s.start_ms / 1000).toFixed(1).padStart(5)}s [${((s.end_ms - s.start_ms) / 1000).toFixed(1)}s] ${s.id} (${s.viene_de})  ${s.text}`);
