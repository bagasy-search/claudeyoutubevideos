// build_comidas_v3.mjs — HÍBRIDO clip-forward. Cada beat prefiere un CLIP real de su comida;
// si no hay, un clip de STOCK de movimiento genérico; si no, una foto verificada con Ken Burns.
// Intro densa con stock de movimiento + emocionales + clips. Cero repetición dentro de cada pool.
import fs from "fs";
import { execFileSync } from "child_process";

const R = "public/";
const has = (rel) => fs.existsSync(R + rel);
const FFPROBE = "node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe";
const _res = {};
function isVertical(rel) {
  if (!/\.(mp4|webm|mov)$/i.test(rel)) return false;
  if (!(rel in _res)) { try { const o = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", R + rel], { encoding: "utf8" }).trim(); const [w, h] = o.split(",").map(Number); _res[rel] = w && h ? { w, h } : null; } catch { _res[rel] = null; } }
  const r = _res[rel]; return r ? r.h > r.w : false;
}

const beats = JSON.parse(fs.readFileSync("_v3/comidas_authored.json", "utf8"));
const mealStarts = JSON.parse(fs.readFileSync("_v3/comidas_meal_starts.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("_v3/sheets/manifest.json", "utf8"));
const verdicts = JSON.parse(fs.readFileSync("_v3/comidas_photo_verdicts.json", "utf8"));
const drop = new Set((() => { try { return JSON.parse(fs.readFileSync("_v3/comidas_clip_drop.json", "utf8")).descartar || []; } catch { return []; } })());

const AUDIO_END = 1019;
const INTRO_END = mealStarts[1].ms / 1000 - 2;

// ── pools ────────────────────────────────────────────────────────────────────
const dishSlugs = Object.keys(manifest).filter((k) => /^d\d\d_/.test(k)).sort();
const nameOfMeal = {}; dishSlugs.forEach((s, i) => (nameOfMeal[i + 1] = s.replace(/^d\d\d_/, ""))); // 1 -> "sopapan"

// CLIPS reales por comida: broll/cc_<name>_N.mp4 en disco, menos los descartados
const clipPool = {};
for (let n = 1; n <= 25; n++) {
  const nm = nameOfMeal[n];
  const found = [];
  for (let k = 1; k <= 10; k++) { const rel = `broll/cc_${nm}_${k}.mp4`; const tag = `${nm}_${k}`; if (has(rel) && !drop.has(tag)) found.push(rel); }
  clipPool[n] = found;
}
// STOCK de movimiento genérico (cs_), menos descartados
const stockPool = fs.readdirSync(R + "broll").filter((f) => /^cs_.*\.mp4$/.test(f) && !drop.has(f.replace(/\.mp4$/, "").replace(/^cs_/, "cs_")) && f !== "cs_wood_fire.mp4").map((f) => "broll/" + f);
// FOTOS verificadas por comida
const verifiedFiles = (slug) => (verdicts[slug] || []).map((i) => manifest[slug]?.[i]).filter((f) => f && has(f));
const photoPool = {}; for (let n = 1; n <= 25; n++) photoPool[n] = verifiedFiles(dishSlugs[n - 1]);
const eSlugs = ["e_viejo_come", "e_abuela_cocina", "e_manos_viejas", "e_cocina_vieja"];
const emoPhotos = []; { const L = eSlugs.map(verifiedFiles); let i = 0, add = true; while (add) { add = false; for (const l of L) if (l[i]) { emoPhotos.push(l[i]); add = true; } i++; } }

const used = new Set();
const take = (pool, key, cursors) => {
  if (!pool || !pool.length) return null;
  const start = cursors[key] || 0;
  for (let k = 0; k < pool.length; k++) { const idx = (start + k) % pool.length; const f = pool[idx]; if (!used.has(f)) { cursors[key] = idx + 1; used.add(f); return f; } }
  const idx = start % pool.length; cursors[key] = idx + 1; return pool[idx]; // reuse espaciado
};
const cur = {};

const mealOf = (ms) => { let c = 0; for (let n = 1; n <= 25; n++) { const s = mealStarts[n]; if (s && s.ms != null && s.ms <= ms + 300) c = n; } return c; };

const raw = [];
let bi = 0;
const push = (src, start, dur) => {
  if (!src) return;
  const isClip = /\.(mp4|webm|mov)$/i.test(src);
  const beat = { id: `b${raw.length}`, kind: "raw", src, start: +start.toFixed(2), dur: +Math.max(0.5, dur).toFixed(2), hue: "amber" };
  if (isClip) { if (isVertical(src)) beat.fit = "blur"; beat.zoom = [1.02, 1.05]; }        // clip: casi sin Ken Burns
  else { const io = bi % 2 === 0 ? [1.05, 1.15] : [1.15, 1.05]; beat.zoom = io; beat.kbPhase = bi % 4; } // foto: Ken Burns variado
  bi++; raw.push(beat);
};

// asset EXACTO de la comida N: clip real → foto verificada (nunca stock genérico salvo que falte todo)
const pickExact = (n) => take(clipPool[n], "c" + n, cur) || take(photoPool[n], "p" + n, cur) || take(stockPool, "stock", cur) || emoPhotos[0];
// por beat: cada 4º = acento de STOCK en movimiento; el resto = exacto de la comida
const mealBeat = {};
const pickDish = (n) => { const idx = (mealBeat[n] = (mealBeat[n] || 0) + 1); return (idx % 4 === 0 ? take(stockPool, "stock", cur) : null) || pickExact(n); };

// ── INTRO 0..INTRO_END: densa ~2.6s. Patrón: stock-movimiento, emocional, teaser-de-plato ──
const introClips = [...stockPool]; // movimiento genérico
const teaser = []; for (let n = 1; n <= 25; n++) { if (clipPool[n][0]) teaser.push(clipPool[n][0]); else if (photoPool[n][2]) teaser.push(photoPool[n][2]); }
const introSeq = []; { let si = 0, ei = 0, ti = 0; const mx = 40; for (let i = 0; i < mx; i++) { if (introClips[si]) introSeq.push(introClips[si++]); if (emoPhotos[ei]) introSeq.push(emoPhotos[ei++]); if (teaser[ti]) introSeq.push(teaser[ti++]); } }

const introBeats = beats.filter((b) => b.ms / 1000 < INTRO_END).sort((a, z) => a.ms - z.ms);
for (let i = 0; i < introBeats.length; i++) {
  const b = introBeats[i]; const s = b.ms / 1000;
  const e = i + 1 < introBeats.length ? introBeats[i + 1].ms / 1000 : INTRO_END;
  const span = e - s; const k = Math.max(1, Math.round(span / 2.6));
  for (let j = 0; j < k; j++) push(take(introSeq, "intro", cur), s + (span * j) / k, span / k);
}

// ── CUERPO: cada beat un asset de su comida (clip→stock→foto). Split si > 6s ──
const body = beats.filter((b) => b.ms / 1000 >= INTRO_END).sort((a, z) => a.ms - z.ms);
for (let i = 0; i < body.length; i++) {
  const b = body[i]; const s = b.ms / 1000;
  const e = i + 1 < body.length ? body[i + 1].ms / 1000 : AUDIO_END;
  const span = e - s; const n = mealOf(b.ms); const k = span > 6 ? 2 : 1;
  for (let j = 0; j < k; j++) push(pickDish(n), s + (span * j) / k, span / k);
}

// ── overlays: grilla + contador ──
const overlays = [];
const gridImgs = []; for (let n = 1; n <= 25; n++) { const p = photoPool[n]; if (p && p.length) gridImgs.push(p[p.length > 1 ? 1 : 0]); }
overlays.push({ id: "dishgrid", kind: "dishgrid", images: gridImgs.slice(0, 25), cols: 5, eyebrow: "de antes", title: "25 comidas", start: 47.9, dur: 9.6, overlay: true });
for (let n = 1; n <= 25; n++) { const s = mealStarts[n]; if (!s || s.ms == null) continue; const img = photoPool[n][0] || emoPhotos[0]; overlays.push({ id: `top_${n}`, kind: "topdulce", index: n, total: 25, title: s.title, image: img, start: +Math.max(0, s.ms / 1000 - 1.0).toFixed(2), dur: 4, overlay: true }); }

const all = [...raw, ...overlays.filter((o) => o.start + (o.dur || 4) <= AUDIO_END)];
const seen = new Set(); const out = [];
for (const b of all.sort((a, z) => a.start - z.start)) { let id = b.id, k = 1; while (seen.has(id)) id = `${b.id}_${k++}`; seen.add(id); out.push({ ...b, id }); }
fs.writeFileSync("beatsheet/comidas.json", JSON.stringify({ video: "comidas", beats: out }, null, 1));

const nClip = raw.filter((b) => /\.(mp4|webm|mov)$/i.test(b.src)).length;
const nCc = raw.filter((b) => /broll\/cc_/.test(b.src)).length;
const nCs = raw.filter((b) => /broll\/cs_/.test(b.src)).length;
console.log("=== build_comidas_v3 (híbrido) ===");
console.log(`beats: ${raw.length} · CLIPS: ${nClip} (${nCc} comida real + ${nCs} stock) · fotos: ${raw.length - nClip}`);
console.log(`clips comida disponibles: ${Object.values(clipPool).reduce((a, p) => a + p.length, 0)} en ${Object.values(clipPool).filter((p) => p.length).length} comidas · stock: ${stockPool.length} · descartados: ${drop.size}`);
console.log(`intro: ${raw.filter((b) => b.start < INTRO_END).length} cortes · → beatsheet/comidas.json`);
