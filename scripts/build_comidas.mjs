// build_comidas.mjs — arma beatsheet/comidas.json para "25 Comidas Olvidadas".
// Nicho de footage ESCASO → clip-forward por CONSTRUCCIÓN: cada beat con clip propio lo
// usa; los demás ROTAN por el pool ON-TOPIC de su comida (clips limpios de esa comida +
// fotos nostálgicas limpias), eligiendo el MENOS usado (variedad sin off-topic ni repetir).
// Overlays: topcomida (N.º N · de 25 · <comida>) al inicio de cada comida.
import fs from "fs";
import { execFileSync } from "child_process";

const R = "public/";
const has = (rel) => fs.existsSync(R + rel);
const FFPROBE = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const _res = {};
function needsBlurFill(rel) {
  if (!/\.(mp4|webm|mov)$/i.test(rel)) return false;
  if (!(rel in _res)) {
    try {
      const out = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", R + rel], { encoding: "utf8" }).trim();
      const [w, h] = out.split(",").map(Number); _res[rel] = w && h ? { w, h } : null;
    } catch { _res[rel] = null; }
  }
  const r = _res[rel];
  return r ? (r.h > r.w || r.w < 1280) : false;
}

const beats = JSON.parse(fs.readFileSync("_v3/comidas_authored.json", "utf8"));       // name, ms, dur, src, desc, shot
const mealStarts = JSON.parse(fs.readFileSync("_v3/comidas_meal_starts.json", "utf8")); // {n:{title,ms}}
const clean = new Set(JSON.parse(fs.readFileSync("_v3/comidas_clean.json", "utf8")));   // nombres de clips LIMPIOS
// fotos LIMPIAS (nostálgicas nost_ + vintage vin_, de sus verdicts de verificación)
const okPhotos = new Set();
if (fs.existsSync("_v3/nost_verdicts.json")) { const v = JSON.parse(fs.readFileSync("_v3/nost_verdicts.json", "utf8")); for (const k in v) if (v[k].ok) okPhotos.add(k); }
if (fs.existsSync("_v3/photo_verify")) for (const f of fs.readdirSync("_v3/photo_verify").filter((x) => /verdicts_\d+\.json/.test(x))) { const v = JSON.parse(fs.readFileSync("_v3/photo_verify/" + f, "utf8")); for (const k in v) if (v[k].ok) okPhotos.add(k); }
const PHOTOS_ALL = [...okPhotos].filter((k) => has("real/" + k)).map((k) => "real/" + k);

// ── comida de cada beat (por ms: la comida cuyo start es el último ≤ ms del beat) ──
const mealOf = (ms) => {
  let cur = 0;
  for (let n = 1; n <= 25; n++) { const s = mealStarts[n]; if (s && s.ms != null && s.ms <= ms + 300) cur = n; }
  return cur; // 0 = intro
};
// pool de clips limpios por comida (los beats con clip propio y limpio)
const clipOf = (name) => (clean.has(name) && has("broll/" + name + ".mp4")) ? "broll/" + name + ".mp4" : null;
const mealClips = {}; // n -> [broll/...]
for (const b of beats) { const c = clipOf(b.name); if (c) { const n = mealOf(b.ms); (mealClips[n] = mealClips[n] || []).push(c); } }

const useCount = {};
const pickLeast = (pool) => {
  if (!pool || !pool.length) return null;
  let best = null, bn = Infinity;
  for (const a of pool) { const c = useCount[a] || 0; if (c < bn) { bn = c; best = a; } }
  if (best) useCount[best] = (useCount[best] || 0) + 1;
  return best;
};

// ── capa RAW contigua (dur = hueco hasta el próximo beat) ──
const AUDIO_END = 1019;
const SAFE = [1.04, 1.06];
const raw = [];

// ── PRIMER MINUTO DENSO (hand-authored) — lo más importante para retención.
// Antes: 12 fotos fijas de 5s = ESTÁTICO. Ahora: cortes ~2-2.5s anclados a la
// narración, con CLIPS reales en las palabras de comida (olla/papa/pan/lentejas)
// y la GRILLA de comidas a los 47.9s ("te voy a contar 25 comidas de antes").
const INTRO_END = 58; // s
const ph = (i) => PHOTOS_ALL[i % PHOTOS_ALL.length];
// P: clips → si existe; fotos → solo si está VERIFICADA limpia (okPhotos), si no null→fallback
const P = (rel) => {
  if (/\.(mp4|webm|mov)$/i.test(rel)) return has(rel) ? rel : null;
  const base = rel.replace(/^real\//, "");
  return okPhotos.has(base) && has(rel) ? rel : null;
};
const INTRO = [
  [0.16, P("real/nost_cocina_vieja_2.jpg") || ph(0)],
  [2.4,  P("real/nost_manos_viejas_1.jpg") || ph(1)],
  [4.0,  P("real/vin_cocina_1.jpg") || ph(2)],
  [5.6,  P("broll/co_68.mp4")],                 // "hoy vengo con la olla"
  [8.5,  P("real/nost_persona_sola_1.jpg") || ph(3)],
  [11.1, P("real/vin_solo_3.jpg") || ph(4)],
  [13.7, P("broll/co_76.mp4")],                 // "encender el fuego para uno"
  [15.9, P("real/nost_persona_sola_3.jpg") || ph(5)],
  [17.8, P("real/vin_abuela_1.jpg") || ph(6)],  // "esto es para vos"
  [20.5, P("real/nost_mesa_humilde_1.jpg") || ph(7)],
  [22.6, P("real/vin_guiso_2.jpg") || ph(8)],   // "se comía rico"
  [24.9, P("broll/co_73.mp4")],                 // "se comía caliente"
  [26.7, P("broll/co_36.mp4")],                 // "con una papa"
  [28.1, P("broll/co_20.mp4")],                 // "un poco de pan duro"
  [29.4, P("broll/co_22.mp4")],                 // "un puñado de lentejas"
  [32.0, P("broll/co_23.mp4")],                 // "mi madre te hacía un plato"
  [35.3, P("real/vin_familia_2.jpg") || ph(9)], // "el estómago y el alma"
  [38.3, P("real/nost_manos_viejas_3.jpg") || ph(10)], // "estas manos"
  [40.6, P("real/vin_abuela_2.jpg") || ph(11)],
  [43.3, P("broll/co_53.mp4")],                 // "la comida más humilde"
  [45.0, P("real/nost_persona_sola_1.jpg") || ph(12)], // "más se extraña"
  [47.9, P("broll/co_89.mp4")],                 // "25 comidas" (b-roll bajo la grilla)
  [52.4, P("broll/co_105.mp4")],                // "baratas, fáciles"
  [55.5, P("real/vin_cocina_2.jpg") || ph(13)],
].filter(([, s]) => s);
for (let i = 0; i < INTRO.length; i++) {
  const [t, src] = INTRO[i];
  const nxt = i + 1 < INTRO.length ? INTRO[i + 1][0] : INTRO_END;
  const beat = { id: "intro_" + i, kind: "raw", src, start: +t.toFixed(2), dur: +Math.max(0.5, nxt - t).toFixed(2), hue: "amber" };
  if (/\.(mp4|webm|mov)$/i.test(src)) { if (needsBlurFill(src)) beat.fit = "blur"; else beat.zoom = SAFE; }
  raw.push(beat);
}

// resto del video (>= INTRO_END): build normal (clip propio o pool on-topic de la comida)
const sorted = [...beats].filter((b) => b.ms / 1000 >= INTRO_END).sort((a, z) => a.ms - z.ms);
for (let i = 0; i < sorted.length; i++) {
  const b = sorted[i];
  const start = +(b.ms / 1000).toFixed(2);
  const nxt = i + 1 < sorted.length ? sorted[i + 1].ms / 1000 : AUDIO_END;
  const dur = +Math.max(0.5, nxt - b.ms / 1000).toFixed(2);
  const n = mealOf(b.ms);
  let src;
  const own = clipOf(b.name);
  if (own) src = own;
  else {
    const pool = [...(mealClips[n] || []), ...PHOTOS_ALL];
    src = pickLeast(pool) || PHOTOS_ALL[0] || (mealClips[n] && mealClips[n][0]);
  }
  const isClip = /\.(mp4|webm|mov)$/i.test(src);
  const beat = { id: b.name, kind: "raw", src, start, dur, hue: "amber" };
  if (isClip) { if (needsBlurFill(src)) beat.fit = "blur"; else beat.zoom = SAFE; }
  raw.push(beat);
}

// ── overlays: topcomida al inicio de cada comida (reusa el componente topdulce) ──
const overlays = [];
const bgForMeal = (n) => (mealClips[n] && mealClips[n][0]) || PHOTOS_ALL[0];

// ★ GRILLA de las 25 comidas — HOOK dinámico. Entra a los 47.9s cuando la abuela
// dice "te voy a contar 25 comidas de antes": 25 celdas de comida/cocina que
// aparecen una a una. Cierra el primer minuto con energía en vez de una foto fija.
{
  const foodPhotos = PHOTOS_ALL.filter((p) => /(cocina|guiso|olla|pan|mesa|manos|mercado|invierno|estufa)/i.test(p));
  const gridImgs = [...new Set([...foodPhotos, ...PHOTOS_ALL])].slice(0, 25);
  overlays.push({ id: "dishgrid", kind: "dishgrid", images: gridImgs, cols: 5, eyebrow: "de antes", title: "25 comidas", start: 47.9, dur: 9.6, overlay: true });
}
for (let n = 1; n <= 25; n++) {
  const s = mealStarts[n]; if (!s || s.ms == null) continue;
  overlays.push({
    id: `top_${n}`, kind: "topdulce", index: n, total: 25,
    title: s.title, image: bgForMeal(n), start: +Math.max(0, s.ms / 1000 - 1.0).toFixed(2), dur: 4, overlay: true,
  });
}

const all = [...raw, ...overlays.filter((o) => o.start + (o.dur || 4) <= AUDIO_END)];
const seen = new Set(); const out = [];
for (const b of all.sort((a, z) => a.start - z.start)) { let id = b.id, k = 1; while (seen.has(id)) id = `${b.id}_${k++}`; seen.add(id); out.push({ ...b, id }); }
fs.writeFileSync("beatsheet/comidas.json", JSON.stringify({ video: "comidas", beats: out }, null, 1));

const nClip = raw.filter((b) => /\.(mp4|webm|mov)$/i.test(b.src)).length;
const uniq = new Set(raw.map((b) => b.src)).size;
console.log("=== build_comidas ===");
console.log(`beats raw: ${raw.length} (clip: ${nClip}, foto: ${raw.length - nClip}) · assets únicos: ${uniq} · ratio ${(raw.length / uniq).toFixed(2)}`);
console.log(`clips limpios: ${clean.size} · fotos nostálgicas: ${PHOTOS_ALL.length} · overlays: ${overlays.length}`);
console.log("→ beatsheet/comidas.json");
