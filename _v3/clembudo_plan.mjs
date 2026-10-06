// clembudo_plan.mjs — arma `_v3/clembudo_plan.json` (los beats) anclando CADA plano al ms REAL
// de Whisper, nunca por matemática.
//
//   node _v3/clembudo_plan.mjs
//
// ⛔ REGLAS QUE IMPONE (cada una costó un render en algún video):
//  · El asset se indexa por el ÍNDICE DEL MOMENTO, nunca por un contador corrido: en `cmetemu` un
//    contador que avanzaba desfasó todo y 22 de 52 planos mostraban el objeto del acto VECINO.
//  · El video ABRE con el avatar full, con piso de 3 s (regla 1.bis, cross-nicho).
//  · El avatar es el FONDO GARANTIZADO: cada contenido cubre SÓLO su duración real; apenas termina,
//    vuelve el avatar. Así no queda fondo muerto (regla ANTI-HUECO).
//  · Los clips van con su duración REAL sondeada (5,04 s), no con un `contigDur` inventado.
//  · Pacing VARIADO: mediana 3,5-4,5 s y ~40 % de planos ≥5 s. El enemigo es la sucesión PAREJA.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SLUG = "clembudo";
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe".replace("ffmpeg", "ffprobe");

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const imgs = JSON.parse(fs.readFileSync(`_v3/${SLUG}_imgs_ALL.json`, "utf8").replace(/^﻿/, ""));
const movs = JSON.parse(fs.readFileSync(`_v3/${SLUG}_movimientos.json`, "utf8").replace(/^﻿/, ""));

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const wordsN = caps.map((w) => norm(w.text)).filter(Boolean);
const startsN = caps.map((w) => w.startMs);

// ── `at(frase)`: ventana deslizante con PUNTAJE, no prefijo exacto ──────────────────────────
// ⛔ El prefijo exacto de 8 tokens perdía el 21 % de los planos, y no por un bug: el avatar dice
// lo MISMO que el guion pero no idéntico (Whisper además escribe "250" donde el guion dice
// "doscientos cincuenta", y se come muletillas). Un solo token distinto tiraba el plano entero.
// Acá se puntúa la ventana por tokens en común y se exige un piso, así una diferencia de palabra
// no descarta el anclaje pero un match casual tampoco pasa.
const PISO = 0.62;
const at = (frase) => {
  const toks = norm(frase).split(" ").filter(Boolean).slice(0, 12);
  if (toks.length < 3) return null;
  const set = new Set(toks);
  const n = Math.min(toks.length, 10);
  let mejor = -1, mejorI = -1;
  for (let i = 0; i + n <= wordsN.length; i++) {
    let hits = 0, orden = 0;
    for (let j = 0; j < n; j++) {
      if (set.has(wordsN[i + j])) hits++;
      if (wordsN[i + j] === toks[j]) orden++;       // premia que además esté EN ORDEN
    }
    const score = (hits / n) * 0.6 + (orden / n) * 0.4;
    if (score > mejor) { mejor = score; mejorI = i; }
  }
  return mejor >= PISO ? startsN[mejorI] : null;
};

const durClip = (p) => {
  try { return Math.round(parseFloat(execFileSync(FF, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).toString()) * 1000); }
  catch { return null; }
};

// ── 1) anclar cada plano ────────────────────────────────────────────────────────────────────
let anclados = 0, perdidos = [];
const planos = [];
for (const it of imgs) {
  const ms = at(it.dice || "");
  if (ms == null) { perdidos.push(it.name); continue; }
  const mp4 = `public/broll/${SLUG}/${it.name}.mp4`;
  const png = `public/img/${SLUG}/${it.name}.png`;
  const tieneClip = fs.existsSync(mp4);
  if (!tieneClip && !fs.existsSync(png)) { perdidos.push(it.name + " (sin asset)"); continue; }
  planos.push({ name: it.name, ms, clip: tieneClip, durReal: tieneClip ? durClip(mp4) : null });
  anclados++;
}
// ⛔ COMPUERTA DEL MATCHER: un ancla DIFUSA que cae en la frase equivocada es PEOR que no anclar
// (es el defecto de `cmetemu`: cada plano mostraba el objeto del acto vecino y nada lo avisaba).
// Los planos fueron escritos EN ORDEN del guion, así que sus anclas tienen que subir en el tiempo.
// Cada inversión es un ancla sospechosa. Se mide y se informa; no se acepta en silencio.
const ordenEscritura = [...planos].sort((a, b) => a.name.localeCompare(b.name));
let inversiones = 0;
for (let i = 1; i < ordenEscritura.length; i++) if (ordenEscritura[i].ms < ordenEscritura[i - 1].ms - 1500) inversiones++;
planos.sort((a, b) => a.ms - b.ms);
console.log(`MEDIDO: ${imgs.length} planos escritos · ${anclados} anclados al ms · ${perdidos.length} sin ancla`);
console.log(`  anclas FUERA DE ORDEN (sospechosas de matchear la frase equivocada): ${inversiones}/${ordenEscritura.length}` + (inversiones > ordenEscritura.length * 0.05 ? "  ⛔ demasiadas" : "  ✅"));
if (perdidos.length) console.log("  sin ancla:", perdidos.slice(0, 12).join(", "), perdidos.length > 12 ? `… +${perdidos.length - 12}` : "");

// ── 2) rangos de los MOVIMIENTOS (mandan sobre todo lo que caiga adentro) ────────────────────
const rangos = Object.entries(movs).map(([comp, m]) => ({ comp, in: Math.round(m.desde_s * 1000), out: Math.round(m.hasta_s * 1000) }))
  .sort((a, b) => a.in - b.in);
const dentroDeMov = (ms) => rangos.find((r) => ms >= r.in && ms < r.out);

// ── 3) beats ────────────────────────────────────────────────────────────────────────────────
const TOTAL_MS = caps[caps.length - 1].endMs;
const APERTURA_MS = 3000;           // regla 1.bis: piso de 3 s de avatar full al abrir
const TECHO_MS = 12000;             // techo de plano (salvo texto que se esté leyendo)
const beats = [];

for (const r of rangos) beats.push({ tipo: "movimiento", componente: r.comp, ms_in: r.in, ms_out: r.out });

const libres = planos.filter((p) => !dentroDeMov(p.ms) && p.ms >= APERTURA_MS);
for (let i = 0; i < libres.length; i++) {
  const p = libres[i];
  const sig = libres[i + 1];
  const mov = rangos.find((r) => r.in > p.ms);
  // el slot termina en el próximo plano, o al empezar un movimiento, o al final
  let slot = Math.min(sig ? sig.ms : TOTAL_MS, mov ? mov.in : TOTAL_MS) - p.ms;
  // ⛔ PISO DE PLANO LEGIBLE: por debajo de ~1,6 s el ojo no llega a leer el plano y se lee como
  // parpadeo. Si el hueco es más chico, el plano NO entra y el anterior se queda con el aire.
  if (slot < 1600) continue;
  // COBERTURA REAL: un clip cubre lo que dura de verdad, no el slot entero.
  // Lo que sobra NO se estira: vuelve el avatar (fondo garantizado) y no queda fondo muerto.
  // ⛔ PACING VARIADO, NO METRÓNOMO. Sin esto, los 59 clips caen TODOS en 4,94 s (su duración real
  // menos el margen) y la mediana y el p75 dan el mismo número: la "sucesión pareja" que el creador
  // describió como "cambia una por segundo, cansa". Un clip no tiene obligación de reproducirse
  // entero. Se sortea determinísticamente (por el ms del plano, puro, sin Math.random: el farm
  // rinde en chunks paralelos) cuáles se cortan cortos, y las FOTOS se quedan con el extremo largo.
  const h = (p.ms * 2654435761) % 1000 / 1000;
  const cov = p.clip
    ? (h < 0.38
        ? Math.min(slot, 2400 + Math.round(h * 2600), TECHO_MS)   // corte corto: 2,4-3,4 s
        : Math.min(slot, (p.durReal || 5040) - 100, TECHO_MS))    // clip entero
    : Math.min(slot, 2600 + Math.round(h * 7000), TECHO_MS);      // foto: 2,6-9,6 s
  beats.push(p.clip
    ? { tipo: "clip", clip: `${SLUG}/${p.name}`, startFrom: 0, ms_in: p.ms, ms_out: p.ms + cov, noSplit: true }
    : { tipo: "foto", img: `${SLUG}/${p.name}`, ms_in: p.ms, ms_out: p.ms + cov });
}

// ── 4) avatar = TODO lo que quedó descubierto (incluida la apertura) ─────────────────────────
beats.sort((a, b) => a.ms_in - b.ms_in);
const cubierto = beats.filter((b) => b.tipo !== "avatar").map((b) => [b.ms_in, b.ms_out]).sort((a, b) => a[0] - b[0]);
const huecos = [];
let cur = 0;
for (const [a, z] of cubierto) { if (a > cur) huecos.push([cur, a]); cur = Math.max(cur, z); }
if (cur < TOTAL_MS) huecos.push([cur, TOTAL_MS]);
for (const [a, z] of huecos) if (z - a >= 200) beats.push({ tipo: "avatar", ms_in: a, ms_out: z });
beats.sort((a, b) => a.ms_in - b.ms_in);

// ── 5) COMPUERTAS (que impriman CUÁNTO midieron: una que da 0 sin mirar es un OK falso) ──────
const vis = beats.filter((b) => b.tipo !== "avatar");
// ⛔ el pacing se mide sobre PLANOS, no sobre movimientos: una suite de 59 s metida en la misma
// muestra corre el p90 a 58 s y hace parecer variado lo que no lo es. Se miden por separado.
const planosVis = vis.filter((b) => b.tipo !== "movimiento");
const durs = planosVis.map((b) => (b.ms_out - b.ms_in) / 1000).sort((a, b) => a - b);
const pct = (q) => durs[Math.floor(durs.length * q)];
const cov = beats.reduce((s, b) => s + (b.ms_out - b.ms_in), 0) / TOTAL_MS;
const avatarMs = beats.filter((b) => b.tipo === "avatar").reduce((s, b) => s + b.ms_out - b.ms_in, 0);
console.log(`\nBEATS: ${beats.length} (${vis.length} visuales + ${beats.length - vis.length} de avatar)`);
console.log(`  por tipo: ` + JSON.stringify(vis.reduce((a, b) => ((a[b.tipo] = (a[b.tipo] || 0) + 1), a), {})));
console.log(`  duración de PLANO (sin movimientos, n=${durs.length}): mín ${durs[0].toFixed(2)}s · mediana ${pct(0.5).toFixed(2)}s · p75 ${pct(0.75).toFixed(2)}s · p90 ${pct(0.9).toFixed(2)}s · máx ${durs[durs.length-1].toFixed(2)}s`);
console.log(`  ≥4,5s ${(100*durs.filter((d)=>d>=4.5).length/durs.length).toFixed(0)}% · ≥5s ${(100*durs.filter((d)=>d>=5).length/durs.length).toFixed(0)}%  (objetivo: mediana 3,5-4,5 · p75 >5 · ~40% ≥5s)`);
console.log(`  cobertura de la línea de tiempo: ${(cov * 100).toFixed(1)}%  (tiene que dar 100%)`);
console.log(`  avatar visible: ${(100 * avatarMs / TOTAL_MS).toFixed(0)}% del metraje`);
const solapes = beats.filter((b, i) => i && b.ms_in < beats[i - 1].ms_out - 1);
console.log(`  solapes: ${solapes.length}` + (solapes.length ? ` ⛔ ${solapes.slice(0, 3).map((b) => b.ms_in).join(",")}` : " ✅"));
const primero = beats[0];
console.log(`  PRIMER BEAT: ${primero.tipo} @${primero.ms_in}ms → ${primero.tipo === "avatar" && primero.ms_out >= APERTURA_MS ? "✅ abre con el avatar ≥3s" : "⛔ NO abre con el avatar"}`);

fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ beats, totalMs: TOTAL_MS, overlays: [] }, null, 1));
console.log(`\n-> _v3/${SLUG}_plan.json`);
