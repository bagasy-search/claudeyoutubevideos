// build_dulcesv2.mjs — arma beatsheet/dulcesv3.json (dulces v2: clips pegados a
// cada frase). Reusa TODO de v1. Salida → beatsheet/dulcesv3.json, que luego
// procesa beatsheet.mjs para emitir cues_dulcesv2.gen.tsx.
//
// Resolución de asset por beat (252) del match_dulcesv3.json:
//   1) broll/<name>.mp4 en disco (los ~115 matcheados) → ese clip, full-bleed,
//      con SAFE_CROP (zoom ~1.08) anti-marca de agua.
//   2) beat de dulce (dNN) sin clip → clip v1 del MISMO dulce (broll/dNN_*.mp4)
//      rotando (mantiene contexto + movimiento). Si no hay, foto real del dulce.
//   3) intro/cierre/extras sin clip → clip amb v1 o foto vintage rotando.
// Encima: componentes bespoke (topdulce/fichadulce/citaabuela/ingredientesflotan/
// antesahora/numerodulce/teasecards) portados de v1, re-anclados al ms real de v2.
import fs from "fs";
import { execFileSync } from "child_process";

const R = "public/";
const has = (rel) => fs.existsSync(R + rel);

// ── ffprobe: resolución de cada clip (BUG 2: verticales/baja-res → blur-fill) ──
// Los clips verticales (h>w) o de ancho < 1280 se estiraban a full-width con
// objectFit:cover + SAFE_CROP zoom → pixelado. Detectamos su tamaño nativo acá
// y marcamos fit:"blur" (fondo blureado + clip real contain) en el beat.
const FFPROBE = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const _resCache = {};
function clipRes(rel) {
  if (rel in _resCache) return _resCache[rel];
  let r = null;
  try {
    const out = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0",
      "-show_entries", "stream=width,height", "-of", "csv=p=0", R + rel], { encoding: "utf8" }).trim();
    const [w, h] = out.split(",").map(Number);
    if (w && h) r = { w, h };
  } catch { r = null; }
  _resCache[rel] = r;
  return r;
}
// ¿este clip necesita blur-fill? vertical (h>w) o ancho nativo < 1280.
function needsBlurFill(rel) {
  if (!/\.(mp4|webm|mov)$/i.test(rel)) return false; // solo clips; fotos van aparte
  const r = clipRes(rel);
  if (!r) return false; // si no se pudo medir, no arriesgamos (se trata como full-res)
  return r.h > r.w || r.w < 1280;
}
const match = JSON.parse(fs.readFileSync("public/broll/match_dulcesv3.json", "utf8"));
const matchedArr = JSON.parse(fs.readFileSync("public/broll/clips_dulcesv3_matched.json", "utf8"));
const v1 = JSON.parse(fs.readFileSync("beatsheet/dulces.json", "utf8"));

// ── títulos + cards por dulce (de v1) ────────────────────────────────────────
const TITLES = {}, CARD = {}, PHOTO = {};
for (const b of v1.beats) if (b.kind === "topdulce") { TITLES[b.index] = b.title; }
// foto real principal por dulce (basename en public/real/)
const DPHOTO = {
  1: "alfajores_maicena_1.jpg", 2: "dulce_de_leche_1.jpg", 3: "arroz_con_leche_1.jpg",
  4: "mazamorra_1.jpg", 5: "bocaditos_coco_1.jpg", 6: "turron_quaker_1.jpg",
  7: "mantecol_1.jpg", 8: "cascaritas_naranja_1.jpg", 9: "colacion_1.jpg",
  10: "alfeniques_2.jpg", 11: "dulce_membrillo_1.jpg", 12: "arrope_1.jpg",
  13: "melcocha_1.jpg", 14: "caramelos_leche_1.jpg", 15: "ambrosia_1.jpg",
  16: "bombones_caseros_1.jpg", 17: "chupetines_1.jpg", 18: "frutas_abrillantadas_1.jpg",
  19: "conitos_ddl_1.jpg", 20: "quesillo_arrope_1.jpg",
};
// fotos alternativas (para rotar) por dulce
const DPHOTOS = {
  1: ["alfajores_maicena_1.jpg", "alfajores_maicena_3.jpg", "card_d01.jpg"],
  2: ["dulce_de_leche_1.jpg", "dulce_de_leche_2.jpg", "card_d02.jpg"],
  3: ["arroz_con_leche_1.jpg", "arroz_con_leche_3.jpg", "card_d03.jpg"],
  4: ["mazamorra_1.jpg", "mazamorra_2.jpg", "card_d04.jpg"],
  5: ["bocaditos_coco_1.jpg", "bocaditos_coco_2.jpg", "card_d05.jpg"],
  6: ["turron_quaker_1.jpg", "turron_quaker_2.jpg", "card_d06.jpg"],
  7: ["mantecol_1.jpg", "mantecol_2.jpg", "card_d07.jpg"],
  8: ["cascaritas_naranja_1.jpg", "card_d08.jpg"],
  9: ["colacion_1.jpg", "colacion_2.jpg", "card_d09.jpg"],
  10: ["alfeniques_1.jpg", "alfeniques_2.jpg", "card_d10.jpg"],
  11: ["dulce_membrillo_1.jpg", "dulce_membrillo_2.jpg", "dulce_membrillo_3.jpg", "card_d11.jpg"],
  12: ["arrope_1.jpg", "arrope_2.jpg", "card_d12.jpg"],
  13: ["melcocha_1.jpg", "melcocha_2.jpg", "card_d13.jpg"],
  14: ["caramelos_leche_1.jpg", "caramelos_leche_2.jpg", "card_d14.jpg"],
  15: ["ambrosia_1.jpg", "ambrosia_2.jpg", "card_d15.jpg"],
  16: ["bombones_caseros_1.jpg", "bombones_caseros_2.jpg", "card_d16.jpg"],
  17: ["chupetines_1.jpg", "chupetines_2.jpg", "card_d17.jpg"],
  18: ["frutas_abrillantadas_1.jpg", "frutas_abrillantadas_2.jpg", "card_d18.jpg"],
  19: ["conitos_ddl_1.jpg", "conitos_ddl_2.jpg", "card_d19.jpg"],
  20: ["quesillo_arrope_1.jpg", "quesillo_arrope_2.jpg", "card_d20.jpg"],
};
// clips v1 por dulce (broll/*.mp4 en disco) — rotamos para beats sin clip propio
const DCLIPS = {};
{
  let cur = null;
  for (const b of v1.beats) {
    if (b.kind === "topdulce") { cur = b.index; DCLIPS[cur] = []; }
    for (const s of [b.src, b.bg, b.image]) {
      const mm = (s || "").match(/^broll\/(d\d\d_[a-z0-9_]+)\.mp4$/);
      if (mm && cur != null) { const rel = "broll/" + mm[1] + ".mp4"; if (has(rel) && !DCLIPS[cur].includes(rel)) DCLIPS[cur].push(rel); }
    }
  }
}
// ambiente/vintage para intro/cierre/extras sin clip
const AMB_CLIPS = ["broll/amb_abuela_cocina1.mp4", "broll/amb_abuela_cocina2.mp4", "broll/amb_almibar.mp4",
  "broll/amb_azucar_caramelo1.mp4", "broll/amb_cuchara_madera.mp4", "broll/amb_cocina_vieja1.mp4",
  "broll/amb_manos_viejas1.mp4", "broll/amb_manos_viejas2.mp4", "broll/intro_caramelo.mp4",
  "broll/amb_campo_fruta.mp4"].filter(has);
const VINTAGE = ["vintage_cocina1_1.jpg", "vintage_cocina2_1.jpg", "vintage_abuela_1.jpg",
  "vintage_familia1_1.jpg", "vintage_manos_1.jpg", "vintage_cocina1_3.jpg", "vintage_abuela_2.jpg",
  "vintage_familia1_2.jpg", "vintage_manos_2.jpg", "vintage_cocina2_2.jpg"].filter((f) => has("real/" + f));

// ── beats crudos (raw) anclados al ms de cada frase ──────────────────────────
// SAFE_CROP anti-marca. BUG 2: bajado de 1.08-1.11 a 1.04-1.06 para empujar
// logos de esquina SIN magnificar tanto (menos pixelado). Solo para clips
// full-res horizontales; a los verticales/blur-fill NO se les mete zoom extra.
const SAFE = [1.04, 1.06];
const beats = [];

// ── POOL ON-TOPIC por dulce (variedad sin off-topic) ─────────────────────────
// Para cada dulce combinamos TODOS sus assets on-topic: clips reales matcheados
// (broll/sNN_*.mp4 en disco) + clips v1 del dulce + fotos del dulce. Los beats sin
// clip propio rotan por el MENOS usado de ese pool → sin repetir un mismo clip 10×.
// ★ CLEAN PASS (auditor round 2): los clips v1 (matcher VIEJO sin verificador) traían texto
// quemado de canales de recetas. Un verificador Haiku los revisó 1×1 → SOLO los LIMPIOS
// (_v3_v1clean.json, 50/76) vuelven al pool. Fallback = clips reales verif + v1 LIMPIOS +
// fotos limpias del dulce. Así queda limpio Y variado.
const V1CLEAN = new Set(JSON.parse(fs.readFileSync("_v3_v1clean.json", "utf8")));
const dPool = {};
for (let n = 1; n <= 20; n++) {
  const pad = "s" + String(n).padStart(2, "0") + "_";
  const real = match.filter((b) => b.name.startsWith(pad) && has("broll/" + b.name + ".mp4")).map((b) => "broll/" + b.name + ".mp4");
  const v1c = (DCLIPS[n] || []).filter((c) => V1CLEAN.has(c) && has(c));
  const phs = (DPHOTOS[n] || [DPHOTO[n]]).map((p) => "real/" + p).filter(has);
  dPool[n] = [...new Set([...real, ...v1c, ...phs])];
}
const AMB_POOL = [...AMB_CLIPS, ...VINTAGE.map((v) => "real/" + v)];
const useCount = {};
function pickLeast(pool) {
  let best = null, bn = Infinity;
  for (const a of pool) { const c = useCount[a] || 0; if (c < bn) { bn = c; best = a; } }
  if (best) useCount[best] = (useCount[best] || 0) + 1;
  return best;
}

// BUG 1 (huecos en blanco): la capa RAW es b-roll de FONDO y debe ser CONTINUA.
// Antes dur = min(gap, 7) → beats cortos dejaban 291s de fondo ámbar visible entre
// frases muy espaciadas. Ahora dur = hueco EXACTO hasta el START del próximo beat
// de b-roll (contiguo, sin tope). Los OVERLAYS (topdulce/quote/…) van encima y no
// cuentan como b-roll. Último beat estira hasta fin de audio.
const AUDIO_END = 1604;
function durFor(i) {
  const cur = match[i].ms / 1000;
  const nxt = i + 1 < match.length ? match[i + 1].ms / 1000 : AUDIO_END;
  const gap = nxt - cur;
  // contiguo: sin techo. Piso mínimo por si dos frases caen en el mismo ms.
  const d = Math.max(0.5, gap);
  return +d.toFixed(2);
}

for (let i = 0; i < match.length; i++) {
  const b = match[i];
  const start = +(b.ms / 1000).toFixed(2);
  const dur = durFor(i);
  const dm = b.name.match(/^s(\d+)_/);
  const dnum = dm ? parseInt(dm[1], 10) : null;
  let src, isClip = false;

  if (has("broll/" + b.name + ".mp4")) {
    // 1) clip matcheado propio de esta frase (verificado limpio o recuperado)
    src = "broll/" + b.name + ".mp4"; isClip = true; useCount[src] = (useCount[src] || 0) + 1;
  } else if (dnum != null && dPool[dnum] && dPool[dnum].length) {
    // 2) dulce sin clip → MENOS usado del pool on-topic del dulce (clip real + v1 + foto)
    src = pickLeast(dPool[dnum]); isClip = /\.(mp4|webm|mov)$/i.test(src);
  } else {
    // 3) intro/cierre/extras sin clip → menos usado de amb-clip + vintage (on-theme)
    src = pickLeast(AMB_POOL) || ("real/" + VINTAGE[0]); isClip = /\.(mp4|webm|mov)$/i.test(src);
  }

  const beat = { id: b.name, kind: "raw", src, start, dur, hue: "amber" };
  if (isClip) {
    // BUG 2: si el clip es vertical o de baja resolución → blur-fill (contain
    // sobre copia blureada) y SIN zoom SAFE_CROP (no magnificar → no pixelar).
    // Solo a clips full-res horizontales les damos el SAFE_CROP (ahora suave).
    if (needsBlurFill(src)) beat.fit = "blur";
    else beat.zoom = SAFE;
  }
  beats.push(beat);
}

// ── componentes bespoke (portados de v1, re-anclados al ms de v2) ────────────
// buscamos el ms de la PRIMERA frase de cada dulce en v2 → ahí va topdulce.
const firstMs = {};
for (const b of match) { const m = b.name.match(/^s(\d+)_/); if (m) { const n = +m[1]; if (firstMs[n] == null) firstMs[n] = b.ms; } }

// mejor imagen de fondo por dulce para las cards (preferimos el clip matcheado #1)
const bgFor = (n) => {
  const first = match.find((b) => b.name.startsWith("s" + String(n).padStart(2, "0") + "_") && has("broll/" + b.name + ".mp4"));
  if (first) return "broll/" + first.name + ".mp4";
  return (DCLIPS[n] && DCLIPS[n][0]) || "real/" + DPHOTO[n];
};

const overlays = [];
// index de beats bespoke de v1 por dulce (para reusar notes/quotes/etc.)
const v1byDulce = {};
{
  let cur = null;
  for (const b of v1.beats) {
    if (b.kind === "topdulce") cur = b.index;
    if (cur != null && ["fichadulce", "citaabuela", "ingredientesflotan", "antesahora"].includes(b.kind)) {
      (v1byDulce[cur] = v1byDulce[cur] || []).push(b);
    }
  }
}

for (let n = 1; n <= 20; n++) {
  if (firstMs[n] == null) continue;
  const t0 = firstMs[n] / 1000;
  // TOPDULCE: al inicio del dulce (cuando se dice el ordinal)
  overlays.push({
    id: `top_v2_${n}`, kind: "topdulce", index: n, total: 20,
    title: TITLES[n], image: bgFor(n), start: +Math.max(0, t0 - 1.2).toFixed(2), dur: 4, overlay: true,
  });
  // reusar la 1ª card bespoke de ese dulce (ficha/cita/ingr/antes) unos segundos después
  const specials = v1byDulce[n] || [];
  let off = 6; // segundos tras el topdulce
  for (const sp of specials.slice(0, 2)) {
    const start = +(t0 + off).toFixed(2);
    const o = { ...sp, id: `${sp.kind}_v2_${n}_${off}`, start, overlay: true };
    // re-apuntar el bg/imagen al clip matcheado del dulce si aplica
    if (o.bg && /^broll\//.test(o.bg)) o.bg = bgFor(n);
    overlays.push(o);
    off += (sp.dur || 5) + 8;
  }
}

// numerodulce + teasecards del intro (de v1, mismo ms aprox del arranque)
const introNums = v1.beats.filter((b) => b.kind === "numerodulce" || b.kind === "teasecards");
for (const b of introNums) {
  overlays.push({ ...b, id: `${b.kind}_v2_${b.id}`, overlay: true });
}

// cierre: una citaabuela final si existe en v1
const cierreMs = match.find((b) => b.name.startsWith("cierre"))?.ms;
const v1cierreCita = v1.beats.filter((b) => b.kind === "citaabuela").slice(-1)[0];
if (cierreMs != null && v1cierreCita) {
  overlays.push({ ...v1cierreCita, id: "cita_v2_cierre", start: +(cierreMs / 1000 + 40).toFixed(2), overlay: true });
}

// ── merge + orden + resolver solapes de la capa RAW (overlays van aparte) ────
const all = [...beats, ...overlays.filter((o) => o.start + (o.dur || 4) <= AUDIO_END)];
// dedup ids
const seen = new Set();
const out = [];
for (const b of all.sort((a, z) => a.start - z.start)) {
  let id = b.id, k = 1;
  while (seen.has(id)) id = `${b.id}_${k++}`;
  seen.add(id); out.push({ ...b, id });
}

const bs = { video: "dulcesv3", beats: out };
fs.writeFileSync("beatsheet/dulcesv3.json", JSON.stringify(bs, null, 1));

// resumen
const nRaw = beats.length;
const nClip = beats.filter((b) => b.zoom).length;
const nPhoto = beats.filter((b) => !b.zoom && b.kind === "raw").length;
const nMatched = beats.filter((b) => has("broll/" + b.id + ".mp4")).length;
console.log("=== build_dulcesv3 ===");
console.log(`beats raw: ${nRaw}  (clip: ${nClip}, foto: ${nPhoto})`);
console.log(`  · de los clips, matcheados a la frase (broll/<name>.mp4): ${nMatched}`);
console.log(`  · clips fallback v1 (dulce/amb): ${nClip - nMatched}`);
console.log(`overlays bespoke: ${overlays.length}`);
console.log(`total beats en beatsheet: ${out.length}`);
console.log("→ beatsheet/dulcesv3.json");
