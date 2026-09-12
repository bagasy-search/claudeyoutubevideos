// build_comidas_v2.mjs — REBUILD con footage por comida (foto-forward, cero repetición).
// Cada beat del cuerpo toma una foto ÚNICA del pool VERIFICADO de SU comida (intercalando
// cocción/emplatado). La intro (0-78s) se densifica a cortes ~2.6s desde el pool emocional.
// Ken Burns variado por beat (zoom in/out + fase). RawShot ya da movimiento+profundidad.
import fs from "fs";

const R = "public/";
const has = (rel) => fs.existsSync(R + rel);

const beats = JSON.parse(fs.readFileSync("_v3/comidas_authored.json", "utf8"));   // name, ms, dur, desc, phrase, shot
const mealStarts = JSON.parse(fs.readFileSync("_v3/comidas_meal_starts.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("_v3/sheets/manifest.json", "utf8"));  // slug -> [real/...]
const verdicts = JSON.parse(fs.readFileSync("_v3/comidas_photo_verdicts.json", "utf8")); // slug -> [idx ok]

const AUDIO_END = 1019;
const INTRO_END = mealStarts[1].ms / 1000 - 2; // ~78s (arranca comida 1 en 80s)

// ── pools verificados ──────────────────────────────────────────────────────
// slug de comida N = dNN_...   (ordeno claves d* → d01..d25 = comida 1..25)
const dishSlugs = Object.keys(manifest).filter((k) => /^d\d\d_/.test(k)).sort();
const slugOfMeal = {}; dishSlugs.forEach((s, i) => (slugOfMeal[i + 1] = s));

const verifiedFiles = (slug) => (verdicts[slug] || []).map((i) => manifest[slug]?.[i]).filter((f) => f && has(f));
// intercalar cocción (query _1_) y emplatado (query _2_) para variedad visual
const interleave = (files) => {
  const q1 = files.filter((f) => /_1_\d+\.[a-z]+$/i.test(f));
  const q2 = files.filter((f) => /_2_\d+\.[a-z]+$/i.test(f));
  const out = []; const n = Math.max(q1.length, q2.length);
  for (let i = 0; i < n; i++) { if (q1[i]) out.push(q1[i]); if (q2[i]) out.push(q2[i]); }
  return out.length ? out : files;
};
const dishPool = {}; for (let n = 1; n <= 25; n++) dishPool[n] = interleave(verifiedFiles(slugOfMeal[n]));

// pool emocional (intro + relleno): intercalar las 5 categorías
const eSlugs = ["e_viejo_come", "e_abuela_cocina", "e_manos_viejas", "e_cocina_vieja", "e_mesa_humilde"];
const eLists = eSlugs.map((s) => verifiedFiles(s));
const emoPool = []; { let added = true, i = 0; while (added) { added = false; for (const L of eLists) if (L[i]) { emoPool.push(L[i]); added = true; } i++; } }

// ── asignador sin repetir: cursor por pool; si se agota, cicla espaciado ──────
const used = new Set();
const cursor = {};
const takeFrom = (pool, key) => {
  if (!pool || !pool.length) return null;
  const start = cursor[key] || 0;
  // 1ª pasada: preferir NO usada globalmente
  for (let k = 0; k < pool.length; k++) { const idx = (start + k) % pool.length; const f = pool[idx]; if (!used.has(f)) { cursor[key] = idx + 1; used.add(f); return f; } }
  // agotadas: usar la del cursor (repetición espaciada, solo comidas con pocas fotos)
  const idx = start % pool.length; cursor[key] = idx + 1; return pool[idx];
};

const mealOf = (ms) => { let c = 0; for (let n = 1; n <= 25; n++) { const s = mealStarts[n]; if (s && s.ms != null && s.ms <= ms + 300) c = n; } return c; };

// Ken Burns variado por índice de beat
const kb = (i) => {
  const inOut = i % 2 === 0 ? [1.05, 1.15] : [1.15, 1.05];
  return { zoom: inOut, kbPhase: (i % 4) };
};

// ── construir capa contigua ──────────────────────────────────────────────────
const raw = [];
let bi = 0;
const push = (src, start, dur, mealN) => {
  if (!src) return;
  const k = kb(bi++);
  raw.push({ id: `b${raw.length}`, kind: "raw", src, start: +start.toFixed(2), dur: +Math.max(0.5, dur).toFixed(2), hue: "amber", zoom: k.zoom, kbPhase: k.kbPhase });
};

// pool de INTRO = emocional BALANCEADO (cap estufas) + MUCHOS teasers apetitosos (ratio 1:2).
// teasers SOLO de pools grandes (>=8) para no dejar sin fotos a las comidas de pool chico.
const teaserPool = [];
for (let n = 1; n <= 25; n++) { const p = dishPool[n]; if (p && p.length >= 8) { teaserPool.push(p[Math.floor(p.length / 2)]); teaserPool.push(p[p.length - 1]); } }
// emocional balanceado: round-robin por categoría, cap estufas a 6 (evita amontonar estufas)
const emoCats = [verifiedFiles("e_viejo_come"), verifiedFiles("e_abuela_cocina"), verifiedFiles("e_manos_viejas"), verifiedFiles("e_cocina_vieja").slice(0, 6)];
const emoBal = []; { let i = 0, added = true; while (added) { added = false; for (const L of emoCats) if (L[i]) { emoBal.push(L[i]); added = true; } i++; } }
// intro: patrón [emocional, teaser, teaser] → cálido pero apetitoso y variado
const introPool = []; { let ei = 0, ti = 0; while (ei < emoBal.length || ti < teaserPool.length) { if (emoBal[ei]) introPool.push(emoBal[ei++]); if (teaserPool[ti]) introPool.push(teaserPool[ti++]); if (teaserPool[ti]) introPool.push(teaserPool[ti++]); } }

// INTRO 0..INTRO_END: densificar cada beat autorado a subcortes ~2.6s con fotos emocionales + teasers
const introBeats = beats.filter((b) => b.ms / 1000 < INTRO_END).sort((a, z) => a.ms - z.ms);
for (let i = 0; i < introBeats.length; i++) {
  const b = introBeats[i];
  const s = b.ms / 1000;
  const e = i + 1 < introBeats.length ? introBeats[i + 1].ms / 1000 : INTRO_END;
  const span = e - s;
  const k = Math.max(1, Math.round(span / 2.6)); // subcortes de ~2.6s
  for (let j = 0; j < k; j++) {
    const cs = s + (span * j) / k;
    const cd = span / k;
    push(takeFrom(introPool, "intro"), cs, cd, 0);
  }
}

// CUERPO >= INTRO_END: cada beat = 1 foto única de su comida; split si > 6s
const body = beats.filter((b) => b.ms / 1000 >= INTRO_END).sort((a, z) => a.ms - z.ms);
for (let i = 0; i < body.length; i++) {
  const b = body[i];
  const s = b.ms / 1000;
  const e = i + 1 < body.length ? body[i + 1].ms / 1000 : AUDIO_END;
  const span = e - s;
  const n = mealOf(b.ms);
  const pool = (dishPool[n] && dishPool[n].length) ? dishPool[n] : emoPool;
  const k = span > 6 ? 2 : 1; // partir beats largos para no aflojar el ritmo
  for (let j = 0; j < k; j++) {
    const cs = s + (span * j) / k;
    const cd = span / k;
    push(takeFrom(pool, "m" + n), cs, cd, n);
  }
}

// ── overlays: grilla de comidas (hook ~48s) + contador por comida ────────────
const overlays = [];
// grilla: 1 foto emplatada por comida (25)
const gridImgs = [];
for (let n = 1; n <= 25; n++) { const p = dishPool[n]; if (p && p.length) gridImgs.push(p[p.length > 1 ? 1 : 0]); }
overlays.push({ id: "dishgrid", kind: "dishgrid", images: gridImgs.slice(0, 25), cols: 5, eyebrow: "de antes", title: "25 comidas", start: 47.9, dur: 9.6, overlay: true });

// contador topcomida por comida (reusa topdulce)
for (let n = 1; n <= 25; n++) {
  const s = mealStarts[n]; if (!s || s.ms == null) continue;
  const img = (dishPool[n] && dishPool[n][0]) || emoPool[0];
  overlays.push({ id: `top_${n}`, kind: "topdulce", index: n, total: 25, title: s.title, image: img, start: +Math.max(0, s.ms / 1000 - 1.0).toFixed(2), dur: 4, overlay: true });
}

const all = [...raw, ...overlays.filter((o) => o.start + (o.dur || 4) <= AUDIO_END)];
const seen = new Set(); const out = [];
for (const b of all.sort((a, z) => a.start - z.start)) { let id = b.id, k = 1; while (seen.has(id)) id = `${b.id}_${k++}`; seen.add(id); out.push({ ...b, id }); }
fs.writeFileSync("beatsheet/comidas.json", JSON.stringify({ video: "comidas", beats: out }, null, 1));

// stats
const uniqSrc = new Set(raw.map((b) => b.src));
const reused = raw.length - uniqSrc.size;
const introN = raw.filter((b) => b.start < INTRO_END).length;
const avgIntro = INTRO_END / introN;
console.log("=== build_comidas_v2 ===");
console.log(`beats: ${raw.length} · fotos únicas: ${uniqSrc.size} · reusos: ${reused} (${(reused / raw.length * 100).toFixed(0)}%)`);
console.log(`intro: ${introN} cortes en ${INTRO_END.toFixed(0)}s = ${avgIntro.toFixed(1)}s/corte`);
console.log(`pools: ${Object.values(dishPool).reduce((a, p) => a + p.length, 0)} fotos comida + ${emoPool.length} emocionales`);
console.log(`grilla: ${gridImgs.length} · overlays: ${overlays.length}`);
console.log("→ beatsheet/comidas.json");
