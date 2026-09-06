// gen_tswcement_plan.mjs — DIRECTOR → `_v3/tswcement_plan.json` (beats base + overlays).
//
//   node gen_tswcement_plan.mjs
//
// ⛔ REGLAS QUE YA COSTARON RENDERS:
//  · Cada beat se estira hasta el `ms_in` del SIGUIENTE → cobertura 100% POR CONSTRUCCIÓN,
//    no por suerte. Sin avatar no hay fondo garantizado y el build aborta bajo 98%.
//  · Los COMPONENTES van en `overlays[]`, NUNCA como beat base: son paneles laterales y no
//    dibujan fondo completo (mina de `dale1`: 13 s de pantalla negra).
//  · Los componentes se anclan POR FRASE (se busca el texto en `dice`), nunca por índice a mano:
//    cualquier cambio en el esqueleto corre los índices y el componente cae en otro lado.
//  · El piso de un componente sale del TEXTO (tiempo de lectura), no del slot vecino.
//  · `clipslow` cubre los momentos largos: un clip de 5,1 s a 0,5x cubre 10 s. Evita el metrónomo.
import fs from "node:fs";
import path from "node:path";

const SLUG = "tswcement", PREFIX = "tsc";
const BROLL = `broll/${SLUG}`;
const CLIP_S = 5.1;            // duración nominal del clip i2v de agnes
const RATE_MIN = 0.45;         // más lento que esto se lee como cámara lenta, no como plano vivo

const skel = JSON.parse(fs.readFileSync(`_v3/${SLUG}_skel.json`, "utf8"));
const dir = JSON.parse(fs.readFileSync(`_v3/${SLUG}_dir.json`, "utf8"));
const TOTAL_MS = skel[skel.length - 1].ms_out;
const byI = new Map(dir.map((d) => [d.i, d]));
const name = (i) => `${PREFIX}_${String(i).padStart(4, "0")}`;
const existe = (rel) => fs.existsSync(path.join("public", rel));

// ── BEATS BASE ─────────────────────────────────────────────────────────────────────────────────
const beats = [];
let nClip = 0, nSlow = 0, nFoto = 0;
for (let k = 0; k < skel.length; k++) {
  const m = skel[k];
  const ms_in = m.ms_in;
  const ms_out = k + 1 < skel.length ? skel[k + 1].ms_in : TOTAL_MS;   // ⛔ estirar hasta el siguiente
  const n = name(m.i);
  const clipRel = `${BROLL}/${n}.mp4`;
  const dur = (ms_out - ms_in) / 1000;
  if (existe(clipRel)) {
    if (dur > CLIP_S + 0.25) {
      const rate = Math.max(RATE_MIN, +(CLIP_S / dur).toFixed(3));
      beats.push({ i: m.i, tipo: "clipslow", clip: `${SLUG}/${n}`, rate, ms_in, ms_out });
      nSlow++;
    } else {
      beats.push({ i: m.i, tipo: "clip", clip: `${SLUG}/${n}`, ms_in, ms_out });
      nClip++;
    }
  } else {
    beats.push({ i: m.i, tipo: "imagen", imagen: n, ms_in, ms_out });
    nFoto++;
  }
}

// ── OVERLAYS: anclados POR FRASE ───────────────────────────────────────────────────────────────
/** tiempo de lectura: 2,8 s + 0,28 s por palabra más allá de 3, tope 13 s */
const lectura = (txt) => {
  const w = String(txt).trim().split(/\s+/).filter(Boolean).length;
  return Math.min(13, 2.8 + Math.max(0, w - 3) * 0.28);
};
/** busca el PRIMER momento cuyo `dice` contiene la frase (normalizada) */
const anclar = (frase) => {
  const nz = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const f = nz(frase);
  const m = skel.find((x) => nz(x.dice).includes(f));
  if (!m) { console.error(`⛔ ANCLA NO ENCONTRADA: "${frase}" — el componente caería en cualquier lado.`); process.exit(1); }
  return m;
};
/** cierra el overlay en la frontera de beat >= (inicio + segundos de lectura) */
const hasta = (ms_in, segs) => {
  const objetivo = ms_in + segs * 1000;
  for (const m of skel) if (m.ms_in >= objetivo) return m.ms_in;
  return TOTAL_MS;
};
// ⛔ SIN CAMA DE FOTO: `Panel` no la lleva a propósito. Una imagen quieta encima de un clip vivo
// congela media pantalla los 8-13 s del panel, que es el defecto que el creador marca siempre.
// El contraste del texto lo da el degradado del borde izquierdo, y el plano de abajo sigue corriendo.

const overlays = [];
const poner = (frase, componente, props, textoParaLectura) => {
  const m = anclar(frase);
  const segs = lectura(textoParaLectura);
  const ms_in = m.ms_in;
  const ms_out = hasta(ms_in, segs);
  overlays.push({ componente, ms_in, ms_out, props });
  console.log(`  ${componente.padEnd(11)} i=${String(m.i).padStart(3)} · ${(ms_in / 1000).toFixed(1)}s → ${(ms_out / 1000).toFixed(1)}s (${((ms_out - ms_in) / 1000).toFixed(1)}s, lectura ${segs.toFixed(1)}s)`);
};

console.log("overlays anclados por frase:");

// 1) LA LISTA DE MATERIALES — el único momento donde el espectador quiere ANOTAR algo
poner("Alright, the list", "ScrapParts", {
  kicker: "THE BUILD LIST",
  freeTitle: "SCROUNGE IT",
  buyTitle: "BUY IT",
  free: ["Two plastic buckets", "Quarter inch steel plate", "Half a coffee can", "A short greased pipe", "Dry sand, by the door"],
  buy: ["Refractory castable", "Cast iron burner ring", "Needle valve", "Fuel hose + clamps", "Stove pipe", "CO detector"],
}, "Two plastic buckets Quarter inch steel plate Half a coffee can A short greased pipe Dry sand by the door Refractory castable Cast iron burner ring Needle valve Fuel hose and clamps Stove pipe CO detector");

// 2) LEER LA LLAMA — el único diagnóstico del aparato; se usa parado frente al fuego
poner("Here is how you read the flame", "ScrapFlame", {
  kicker: "READ THE FLAME",
  goodLabel: "BLUE", goodVerdict: "Burning clean",
  good: ["Enough air for the fuel", "Heat into the shop", "Almost nothing up the pipe"],
  badLabel: "ORANGE", badVerdict: "Starved of air",
  bad: ["Soot in the chimney", "Carbon monoxide", "Turn the drip DOWN, not up"],
}, "Blue Burning clean Enough air for the fuel Heat into the shop Almost nothing up the pipe Orange Starved of air Soot in the chimney Carbon monoxide Turn the drip down not up");

// 3) LAS CUATRO REGLAS — el bloque que no se negocia
poner("Four rules. All four of them", "ScrapRules", {
  kicker: "FOUR RULES. ALL FOUR.",
  items: [
    { n: "1", t: "CO detector on the wall", d: "Twenty dollars. And crack a window." },
    { n: "2", t: "Never gasoline", d: "It does not burn. It detonates." },
    { n: "3", t: "Never water on an oil fire", d: "Dry sand, and a class ABC extinguisher." },
    { n: "4", t: "Three feet of nothing", d: "Non combustible floor. Bottles off to the side." },
  ],
}, "CO detector on the wall Twenty dollars And crack a window Never gasoline It does not burn It detonates Never water on an oil fire Dry sand and a class ABC extinguisher Three feet of nothing Non combustible floor Bottles off to the side");

// 4) CTA — ⛔ este canal NO tiene embudo ni guía ni landing: suscribirse + el próximo video.
poner("That is what I am building next", "ScrapCta", {
  kicker: "THE SCRAP WORKSHOP",
  title: "Water into a burning oil stove.",
  sub: "On purpose. It does not blow up — it burns hotter and the oil goes further. That one is next.",
  next: "SUBSCRIBE",
}, "Water into a burning oil stove On purpose It does not blow up it burns hotter and the oil goes further That one is next Subscribe");

// ── COMPUERTA: los overlays no se pisan entre sí ────────────────────────────────────────────────
overlays.sort((a, b) => a.ms_in - b.ms_in);
for (let k = 1; k < overlays.length; k++) {
  if (overlays[k].ms_in < overlays[k - 1].ms_out) {
    console.error(`⛔ overlays superpuestos: ${overlays[k - 1].componente} termina en ${overlays[k - 1].ms_out} y ${overlays[k].componente} arranca en ${overlays[k].ms_in}`);
    process.exit(1);
  }
}

// ── COMPUERTA: cobertura por construcción ──────────────────────────────────────────────────────
for (let k = 1; k < beats.length; k++) {
  if (beats[k].ms_in !== beats[k - 1].ms_out) {
    console.error(`⛔ hueco/solape entre el beat ${k - 1} y el ${k}: ${beats[k - 1].ms_out} vs ${beats[k].ms_in}`);
    process.exit(1);
  }
}
const cob = beats.reduce((s, b) => s + (b.ms_out - b.ms_in), 0);

fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ totalMs: TOTAL_MS, beats, overlays }, null, 1));
console.log(`\nbeats ${beats.length} — clip ${nClip} · clipslow ${nSlow} · foto ${nFoto} (animados ${(100 * (nClip + nSlow) / beats.length).toFixed(0)}%)`);
console.log(`cobertura base ${(100 * cob / TOTAL_MS).toFixed(2)}% · overlays ${overlays.length}`);
console.log(`→ _v3/${SLUG}_plan.json`);
