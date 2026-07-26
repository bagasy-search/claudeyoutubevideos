// detect_scenes.mjs — DETECTOR DE FORMAS NARRATIVAS.
//
//   node scripts/detect_scenes.mjs <slug> [--top N] [--json]
//
// Por qué existe: los componentes salen genéricos porque UN agente tiene que cubrir ~250 momentos,
// y repartido así nadie profundiza. Un editor de After Effects le dedica una hora a 5 segundos.
// Este script hace lo que el creador tuvo que hacer a mano: recorre la locución y marca los
// momentos que TIENEN FORMA — los que piden una escena diseñada, no una foto con un cartel.
//
// NO diseña ni escribe componentes: marca DÓNDE vale la pena gastar un subagente y POR QUÉ.
// La salida es el insumo del fan-out: un subagente por momento, cada uno con su ventana al ms.
//
// La vara de calidad es FedOilCarousel (src/FedererKit.tsx): gira libre y aterriza en la tarjeta
// que el avatar nombra, con push-in y micro-handheld. Ese es el nivel, no un cartel con texto.

import { readFileSync, existsSync } from "fs";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/detect_scenes.mjs <slug> [--top N] [--json]"); process.exit(2); }
const asJson = process.argv.includes("--json");
const TOP = +((process.argv.find((a) => a.startsWith("--top")) || "").split("=")[1] || process.argv[process.argv.indexOf("--top") + 1]) || 12;

// ── captions ─────────────────────────────────────────────────────────────────────────────────
const cp = [`public/captions_${slug}.json`, `captions_${slug}.json`].find((p) => existsSync(p));
if (!cp) { console.error(`✗ no encontré public/captions_${slug}.json — transcribí primero`); process.exit(1); }
const caps = JSON.parse(readFileSync(cp, "utf8").replace(/^﻿/, ""));
if (!Array.isArray(caps) || !caps.length) { console.error("✗ captions vacías"); process.exit(1); }

// palabra suelta → frases (corte por puntuación o por hueco largo)
const frases = [];
let cur = null;
for (const c of caps) {
  const w = (c.text || "").trim();
  if (!w) continue;
  if (!cur) cur = { ms: c.startMs, fin: c.endMs, w: [] };
  cur.w.push(w);
  cur.fin = c.endMs;
  if (/[.?!…]$/.test(w) || (cur.w.length > 4 && c.endMs - cur.ms > 9000)) { frases.push(cur); cur = null; }
}
if (cur) frases.push(cur);
const texto = (f) => f.w.join(" ");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// ── TAXONOMÍA: qué forma tiene la frase → qué tratamiento visual pide ────────────────────────
// `peso` = cuánto rinde visualmente (para rankear cuando hay más candidatos que presupuesto).
const NUMERO = "(\\d{1,4}|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|veinte|treinta|cuarenta|cincuenta|cien|mil)";
const FORMAS = [
  { id: "cantidad", peso: 9,
    re: new RegExp(`\\b${NUMERO}\\s+(pacientes|personas|mujeres|hombres|voluntarios|casos|adultos|participantes|sujetos)\\b`, "i"),
    trata: "Grilla de entidades sobre fondo claro: N figuras con sombra que ENTRAN UNA POR UNA al ritmo de la locución. Cada una su capa. Al nombrar un subconjunto, ese grupo se separa/resalta." },
  { id: "grupos", peso: 10,
    re: /\b(dos|tres|cuatro)\s+grupos?\b|\bgrupo\s+(1|2|3|uno|dos|tres|a|b)\b|\bse (dividieron|dividio|separaron)\b/i,
    trata: "Los elementos ya en pantalla SE SEPARAN espacialmente en los grupos que nombra. Sobre cada grupo entra su identificador (PNG sin fondo del producto/sustancia) en otra capa." },
  { id: "estudio", peso: 10,
    re: /\b(estudio|ensayo|investigacion|publicad|revista|journal|universidad|instituto)\b.{0,60}\b(19|20)\d\d\b|\b(19|20)\d\d\b.{0,40}\b(estudio|ensayo|revista)\b|\bet al\b/i,
    trata: "Documento tipo publicación que ENTRA deslizándose (bordes gastados/papel). Al mencionar el dato, se RESALTA esa línea con marcador amarillo animado, sincronizado a la palabra." },
  { id: "enumeracion", peso: 9,
    re: new RegExp(`\\b${NUMERO}\\s+(aceites|alimentos|remedios|platos|plantas|hierbas|trucos|metodos|formas|razones|senales|sintomas|claves|pasos|errores)\\b`, "i"),
    trata: "Carrusel/anillo que gira y ATERRIZA en el ítem que se nombra (ver FedOilCarousel). Cada ítem su tarjeta; el foco sigue a la locución." },
  { id: "comparacion", peso: 8,
    re: /\b(a diferencia de|en cambio|mientras que|frente a|contra|versus|vs\.?|mejor que|peor que|en vez de)\b/i,
    trata: "Split A|B con entrada escalonada. Cada lado su capa y su color; el lado que se nombra se agranda/ilumina." },
  { id: "mito", peso: 8,
    re: /\b(mito|falso|mentira|no es cierto|te enganaron|nadie te (dice|cuenta)|creias que|se cree que)\b/i,
    trata: "La afirmación falsa aparece y se TACHA con trazo animado; debajo entra la correcta. Dos capas, tiempos distintos." },
  // OJO: "después/luego/entonces" son MULETILLAS de narración, no procesos. Pidiendo una sola,
  // se llevaba 15 de 21 candidatos con frases como "Después, más azúcar por encima" (2,7s).
  // Ahora exige DOS marcadores de paso distintos en la misma frase: ahí sí hay secuencia real.
  { id: "proceso", peso: 6, minSeg: 5,
    re: /\b(primero|despues|luego|entonces|entretanto|por ultimo|finalmente|paso \d|el siguiente paso|hasta que|y ahi)\b[\s\S]{0,140}\b(primero|despues|luego|entonces|por ultimo|finalmente|paso \d|hasta que|y ahi)\b/i,
    trata: "Progresión de pasos: el paso activo se ilumina y los anteriores quedan atenuados, avanzando con la narración." },
  { id: "antes_despues", peso: 8,
    re: /\b(antes|solia|hace \d+ anos)\b.{0,80}\b(ahora|hoy|actualmente)\b|\b(ahora|hoy)\b.{0,80}\b(antes|solia)\b/i,
    trata: "Wipe/cortina entre dos estados sobre el MISMO encuadre. La transición va anclada a la palabra bisagra." },
  { id: "cifra_shock", peso: 9,
    re: /\b\d{1,3}\s*(%|por ciento)\b|\b(\d{1,3}[.,]\d+|\d{2,})\s*(veces|millones|mil)\b/i,
    trata: "La cifra ENTRA grande con conteo animado y el resto de la pantalla se atenúa. Un solo dato, dominante." },
  { id: "anatomia", peso: 6,
    re: /\b(piel|barrera|celulas|colageno|arterias|circulacion|higado|rinones|intestino|estrato corneo|ceramidas)\b/i,
    trata: "Diagrama por CAPAS que se construye mientras se explica (cada capa entra cuando se la nombra). No una foto de stock." },
];

// ── barrido ──────────────────────────────────────────────────────────────────────────────────
const momentos = [];
// Piso de duración: diseñar una escena por capas para 2 segundos no rinde — no se llega a leer
// y el subagente sale más caro que el momento. Se descartan los fragmentos cortos.
const MIN_SEG = +(process.env.MIN_SEG || 4);
for (const f of frases) {
  const t = texto(f), n = norm(t);
  const dur = (f.fin - f.ms) / 1000;
  if (n.split(" ").length < 6 || dur < MIN_SEG) continue;
  const hits = FORMAS.filter((F) => F.re.test(n) && dur >= (F.minSeg || 0));
  if (!hits.length) continue;
  const mejor = hits.sort((a, b) => b.peso - a.peso)[0];
  // combinar formas suma: "20 pacientes en 2 grupos" es mejor escena que cualquiera sola
  const bonus = Math.min(3, hits.length - 1) * 2;
  momentos.push({
    ms: f.ms, fin: f.fin, seg: +(f.ms / 1000).toFixed(1), dur: +((f.fin - f.ms) / 1000).toFixed(1),
    tc: `${String(Math.floor(f.ms / 60000)).padStart(2, "0")}:${String(Math.floor((f.ms % 60000) / 1000)).padStart(2, "0")}`,
    forma: mejor.id, formas: hits.map((h) => h.id), score: mejor.peso + bonus,
    frase: t, trata: mejor.trata,
  });
}

// ── ranking + reparto ────────────────────────────────────────────────────────────────────────
// No alcanza con los mejores: si caen todos en el primer tercio queda el mismo video de siempre.
// Se reparte por TRAMOS (el mismo criterio que el gate) y recién dentro de cada tramo se rankea.
const finVideo = frases[frases.length - 1].fin || 1;
const NB = 5;
const porTramo = Array.from({ length: NB }, () => []);
momentos.forEach((m) => porTramo[Math.min(NB - 1, Math.floor((m.ms / finVideo) * NB))].push(m));
porTramo.forEach((t) => t.sort((a, b) => b.score - a.score));
const cupo = Math.max(1, Math.floor(TOP / NB));
const elegidos = [];
porTramo.forEach((t) => elegidos.push(...t.slice(0, cupo)));            // piso parejo por tramo
const resto = momentos.filter((m) => !elegidos.includes(m)).sort((a, b) => b.score - a.score);
elegidos.push(...resto.slice(0, Math.max(0, TOP - elegidos.length)));   // el sobrante, por mérito
elegidos.sort((a, b) => a.ms - b.ms);

if (asJson) { console.log(JSON.stringify({ slug, total_candidatos: momentos.length, elegidos }, null, 2)); process.exit(0); }

console.log(`── ESCENAS · ${slug} · ${(finVideo / 60000).toFixed(1)} min · ${momentos.length} candidatos → ${elegidos.length} elegidos ──\n`);
const cuenta = {};
momentos.forEach((m) => (cuenta[m.forma] = (cuenta[m.forma] || 0) + 1));
console.log("  formas encontradas: " + Object.entries(cuenta).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(" · "));
console.log("  reparto por tramo : " + porTramo.map((t) => t.length).join(" · ") + "  (candidatos)\n");
for (const m of elegidos) {
  console.log(`  [${m.tc}] ${m.forma.toUpperCase()}  (score ${m.score}, ${m.dur}s)${m.formas.length > 1 ? "  +" + m.formas.filter((x) => x !== m.forma).join(",") : ""}`);
  console.log(`     "${m.frase.slice(0, 116)}${m.frase.length > 116 ? "…" : ""}"`);
  console.log(`     → ${m.trata}\n`);
}
console.log(`Un subagente por momento, con su ventana en ms. Vara: FedOilCarousel en src/FedererKit.tsx.`);
