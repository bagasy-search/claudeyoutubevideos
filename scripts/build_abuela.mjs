// build_abuela.mjs — VIDEO CON AVATAR (Abuela Rosa). Reusa el footage del proyecto comidas
// (clips cc_, stock cs_, fotos verificadas) y lo ancla a los tiempos REALES del avatar
// (_v3/abuela_meal_times.json, de la transcripción). El avatar habla a cámara (full) en
// hook/intro/CTA/mitad/#1-puchero/cierre; durante las comidas va en PiP de esquina o hidden
// (b-roll a pantalla completa), alternando para variar el layout. Audio = public/abuela.wav.
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

const FPS = 25;
const M = JSON.parse(fs.readFileSync("_v3/abuela_meal_times.json", "utf8"));   // {25:268.5,...,1:2006.5}
const S = JSON.parse(fs.readFileSync("_v3/abuela_sections.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("_v3/sheets/manifest.json", "utf8"));
const verdicts = JSON.parse(fs.readFileSync("_v3/comidas_photo_verdicts.json", "utf8"));
const drop = new Set((() => { try { return JSON.parse(fs.readFileSync("_v3/comidas_clip_drop.json", "utf8")).descartar || []; } catch { return []; } })());

const END = S.end || 2309.9;
const OPEN = 6;                    // abuela abre FULL 6s; después el hook va con imágenes generadas + teasers (PiP)
const HOOK_END = (S.selfIntro || 143.5); // fin del hook denso (arranca la auto-presentación)
const MID = S.midpoint || 1195.8;  // re-hook de la mitad
const PUCHERO = M[1];              // #1: avatar full (remate emotivo) → cierre
const AV_FULL = [[MID, M[12]], [PUCHERO, END]]; // full en la mitad y del puchero al final

// ── pools ──
// ★ El número del COUNTDOWN (25→1) NO es el índice d01..d25. El countdown va en el orden
// del GUION (Sopa de pan=25, ..., Puchero=1). Mapa explícito countdown# → nombre de plato:
const dishSlugs = Object.keys(manifest).filter((k) => /^d\d\d_/.test(k)).sort();
const NAME_OF = { 25: "sopapan", 24: "fideosmanteca", 23: "arrozhuevo", 22: "polenta", 21: "zapallo", 20: "pangrasa", 19: "bunuelos", 18: "zapallitos", 17: "tortasfritas", 16: "fideosguisados", 15: "croquetas", 14: "papamanteca", 13: "ensladalentejas", 12: "sopaverdura", 11: "maicena", 10: "budinpan", 9: "arrozguisado", 8: "tortillapapa", 7: "locro", 6: "matecocido", 5: "pastelpapa", 4: "albondigas", 3: "guisoarroz", 2: "lentejas", 1: "puchero" };
const nameOfMeal = NAME_OF;
const slugOf = {}; for (let n = 1; n <= 25; n++) slugOf[n] = dishSlugs.find((s) => s.endsWith("_" + NAME_OF[n])) || dishSlugs[n - 1];
const clipPool = {};
for (let n = 1; n <= 25; n++) { const nm = nameOfMeal[n]; const f = []; for (let k = 1; k <= 10; k++) { const rel = `broll/cc_${nm}_${k}.mp4`; if (has(rel) && !drop.has(`${nm}_${k}`)) f.push(rel); } clipPool[n] = f; }
const stockPool = fs.readdirSync(R + "broll").filter((f) => /^cs_.*\.mp4$/.test(f) && f !== "cs_wood_fire.mp4").map((f) => "broll/" + f);
const verifiedFiles = (slug) => (verdicts[slug] || []).map((i) => manifest[slug]?.[i]).filter((f) => f && has(f));
const photoPool = {}; for (let n = 1; n <= 25; n++) photoPool[n] = verifiedFiles(slugOf[n]);
const eSlugs = ["e_viejo_come", "e_abuela_cocina", "e_manos_viejas", "e_cocina_vieja"];
const emoPhotos = []; { const L = eSlugs.map(verifiedFiles); let i = 0, add = true; while (add) { add = false; for (const l of L) if (l[i]) { emoPhotos.push(l[i]); add = true; } i++; } }

const used = new Set();
const take = (pool, key, cursors) => { if (!pool || !pool.length) return null; const start = cursors[key] || 0; for (let k = 0; k < pool.length; k++) { const idx = (start + k) % pool.length; const f = pool[idx]; if (!used.has(f)) { cursors[key] = idx + 1; used.add(f); return f; } } const idx = start % pool.length; cursors[key] = idx + 1; return pool[idx]; };
const cur = {};
const pickExact = (n) => take(clipPool[n], "c" + n, cur) || take(photoPool[n], "p" + n, cur) || take(stockPool, "stock", cur) || emoPhotos[0];
const mealBeat = {};
const pickDish = (n) => { const idx = (mealBeat[n] = (mealBeat[n] || 0) + 1); return (idx % 4 === 0 ? take(stockPool, "stock", cur) : null) || pickExact(n); };

// ── layout del avatar por comida: alternar PiP-esquina (quieto) y hidden (comida full) ──
const MEAL_MODE = {}; // n -> "cornerTR"|"cornerBL"|"hidden"
{ const cyc = ["cornerTR", "hidden", "cornerBL", "cornerTR", "hidden", "cornerBL", "hidden"]; let i = 0; for (let n = 25; n >= 2; n--) MEAL_MODE[n] = cyc[i++ % cyc.length]; }

// ── b-roll de las comidas (countdown region: OPEN..PUCHERO), cortes ~4.5s ──
const order = []; for (let n = 25; n >= 1; n--) order.push([n, M[n]]);   // [n, start] asc en tiempo
const raw = []; let bi = 0;
const push = (src, start, dur, mode) => {
  if (!src) return;
  const isClip = /\.(mp4|webm|mov)$/i.test(src);
  const beat = { id: `b${raw.length}`, kind: "raw", src, start: +start.toFixed(2), dur: +Math.max(0.5, dur).toFixed(2), hue: "amber" };
  if (isClip) { if (isVertical(src)) beat.fit = "blur"; beat.zoom = [1.02, 1.05]; }
  else { const io = bi % 2 === 0 ? [1.05, 1.15] : [1.15, 1.05]; beat.zoom = io; beat.kbPhase = bi % 4; }
  if (mode === "hidden") beat.avhide = true; else if (mode) beat.avpos = mode;
  bi++; raw.push(beat);
};
for (let i = 0; i < order.length; i++) {
  const [n, s] = order[i];
  if (n === 1) break;                                  // #1 puchero = avatar full, sin b-roll
  const e = order[i + 1] ? order[i + 1][1] : PUCHERO;  // hasta el próximo plato
  // saltar el tramo full de la mitad (el avatar tapa)
  const segs = [];
  if (MID > s && MID < e) { segs.push([s, MID]); segs.push([M[12], e]); } else segs.push([s, e]);
  const mode = MEAL_MODE[n];
  for (const [a, b] of segs) {
    const span = b - a; if (span < 0.6) continue;
    const k = Math.max(1, Math.round(span / 4.5));
    for (let j = 0; j < k; j++) push(pickDish(n), a + (span * j) / k, span / k, mode);
  }
}

// ── HOOK DENSO (6..HOOK_END): imágenes vintage + generadas + emocionales + teasers, cortes
// ~2.6s, abuela en PiP (a veces hidden). Ilustra lo que va contando (su madre, la familia,
// la alacena, comer solo). Después la auto-presentación/CTA con cutaways puntuales. ──
const vintage = fs.readdirSync(R + "real").filter((f) => /^vh_/.test(f) && /\.(jpg|jpeg|png|webp)$/i.test(f)).map((f) => "real/" + f);
const genImgs = fs.existsSync(R + "img") ? fs.readdirSync(R + "img").filter((f) => /^ab_/.test(f) && /\.png$/i.test(f)).map((f) => "img/" + f) : [];
const teaserImgs = []; for (let n = 25; n >= 1; n--) { if (clipPool[n][0]) teaserImgs.push(clipPool[n][0]); }
// imágenes generadas con la cara de la abuela, ancladas a su `at` (momento donde lo dice)
const genAt = (() => { try { return JSON.parse(fs.readFileSync(R + "img/prompts_abuela_ref.json", "utf8")).map((p) => ({ src: "img/" + p.name + ".png", at: p.at })).filter((g) => fs.existsSync(R + g.src)); } catch { return []; } })();
const genUsed = new Set();
const fillerPool = [...emoPhotos, ...teaserImgs, ...vintage]; // relleno on-brand entre las generadas
{
  let t = OPEN, fi = 0, cyc = 0;
  while (t < HOOK_END - 0.3) {
    const dur = Math.min(2.6, HOOK_END - t);
    // ¿hay una imagen generada cuyo `at` cae en esta ranura? → va esa (con la abuela en PiP)
    const g = genAt.find((x) => !genUsed.has(x.src) && x.at >= t - 1.4 && x.at < t + dur);
    if (g) { genUsed.add(g.src); push(g.src, t, dur, "cornerTR"); }
    else push(fillerPool[fi++ % fillerPool.length], t, dur, (cyc % 3 === 2) ? "hidden" : "cornerTR");
    cyc++; t += dur;
  }
  // intro (auto-presentación) + CTA: las generadas con at>=HOOK_END en su momento + cutaways vintage
  const introGen = genAt.filter((x) => x.at >= HOOK_END);
  for (const g of introGen) push(g.src, g.at, 3.6, "hidden");
  const cutaways = [...vintage].filter(Boolean); let ci = 0;
  for (let tt = HOOK_END + 8; tt < M[25] - 8; tt += 20) { if (!introGen.some((x) => Math.abs(x.at - tt) < 4)) push(cutaways[ci++ % cutaways.length], tt, 3.2, "hidden"); }
}

// ── overlays: grilla al arrancar el countdown + contador por comida ──
const overlays = [];
const gridImgs = []; for (let n = 1; n <= 25; n++) { const p = photoPool[n]; if (p && p.length) gridImgs.push(p[p.length > 1 ? 1 : 0]); }
overlays.push({ id: "dishgrid", kind: "dishgrid", images: gridImgs.slice(0, 25), cols: 5, eyebrow: "de antes", title: "25 comidas", start: +(M[25] - 5.5).toFixed(2), dur: 5.2, overlay: true });
const mealTitle = { 25: "Sopa de pan", 24: "Fideos con manteca", 23: "Arroz con huevo", 22: "Polenta", 21: "Zapallo", 20: "Pan con grasa", 19: "Buñuelos de acelga", 18: "Revuelto de zapallitos", 17: "Tortas fritas", 16: "Fideos guisados", 15: "Croquetas", 14: "Papa con manteca", 13: "Ensalada de lentejas", 12: "Sopa de verduras", 11: "Postre de maicena", 10: "Budín de pan", 9: "Arroz guisado", 8: "Tortilla de papas", 7: "Locro", 6: "Mate cocido", 5: "Pastel de papa", 4: "Albóndigas", 3: "Guiso de arroz", 2: "Guiso de lentejas", 1: "Puchero" };
for (let n = 25; n >= 1; n--) { const img = photoPool[n][0] || emoPhotos[0]; overlays.push({ id: `top_${n}`, kind: "topdulce", index: n, total: 25, title: mealTitle[n], image: img, start: +Math.max(0, M[n] - 0.6).toFixed(2), dur: 3.6, overlay: true }); }

// ── COMPONENTES autorados por los agentes (ingredientesflotan/citaabuela/teasecards/…) ──
const mealAt = (t) => { let best = 0, bt = -1; for (let n = 1; n <= 25; n++) { if (M[n] <= t + 0.3 && M[n] > bt) { bt = M[n]; best = n; } } return best; };
const comps = [];
for (const f of fs.readdirSync("_v3").filter((x) => /^abuela_comp_[A-F]\.json$/.test(x))) {
  try { for (const c of JSON.parse(fs.readFileSync("_v3/" + f, "utf8"))) comps.push(c); } catch { /* skip */ }
}
const CO_OK = new Set(["ingredientesflotan", "fichadulce", "citaabuela", "teasecards", "keyphrase", "antesahora", "numerodulce"]);
for (const c of comps) {
  if (!CO_OK.has(c.kind)) { c._drop = true; continue; }  // lowerthird u otros que no encajan → fuera
  c.overlay = true;
  if (!c.id) c.id = `${c.kind}_${Math.round(c.start)}`;
  // sanitizar comillas dobles (rompen el JSX en modo atributo text="...")
  const clean = (s) => typeof s === "string" ? s.replace(/["“”]/g, "") : s;
  c.text = clean(c.text); c.title = clean(c.title); c.eyebrow = clean(c.eyebrow); c.name = clean(c.name); c.role = clean(c.role);
  if (Array.isArray(c.items)) c.items = c.items.map(clean);
  if (Array.isArray(c.words)) c.words = c.words.map((w) => ({ ...w, t: clean(w.t) }));
  if (Array.isArray(c.cards)) c.cards = c.cards.map((x, i) => {
    const o = typeof x === "string" ? { label: clean(x) } : { ...x, label: clean(x.label) };
    if (!o.src) { const mm = String(o.label || "").match(/\bN\.?º?\s*(\d+)/); const n = mm ? +mm[1] : 0; o.src = (photoPool[n] && photoPool[n][0]) || gridImgs[i % gridImgs.length] || emoPhotos[i % emoPhotos.length]; }
    return o;
  });
  if ((c.kind === "ingredientesflotan" || c.kind === "fichadulce" || c.kind === "citaabuela") && !c.image) {
    const n = mealAt(c.start); const p = (photoPool[n] && photoPool[n][0]) || (clipPool[n] && clipPool[n][0]) || emoPhotos[Math.round(c.start) % emoPhotos.length]; if (p) c.image = p;
  }
  if (c.kind === "citaabuela" && c.text && !c.words) {
    const ws = c.text.split(/\s+/); const per = (c.dur || 4.5) / ws.length;
    c.words = ws.map((t, i) => ({ t, at: +(i * per).toFixed(2) }));
  }
}

const all = [...raw, ...overlays.filter((o) => o.start + (o.dur || 4) <= END), ...comps.filter((c) => !c._drop && c.start + (c.dur || 4) <= END)];
const seen = new Set(); const out = [];
for (const b of all.sort((a, z) => a.start - z.start)) { let id = b.id, k = 1; while (seen.has(id)) id = `${b.id}_${k++}`; seen.add(id); out.push({ ...b, id }); }
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/abuela.json", JSON.stringify({ video: "abuela", avatar: "abuela_opt.mp4", clipsfirst: true, beats: out }, null, 1));

// ── avatar windows (patrón build_estufa) ──
const TOTAL = +END.toFixed(2); // SEGUNDOS (Main multiplica ×fps, como techocalor)
const POS = ["cornerTR", "cornerBL", "cornerTL", "cornerBR"];
const inAvF = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const pip = [], hide = [];
for (const b of raw) {
  if (inAvF(b.start)) continue;
  const end = +(b.start + b.dur).toFixed(2);
  if (b.avhide) hide.push([b.start, end]); else pip.push([b.start, end, b.avpos || "cornerTR"]);
}
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (inAvF(t)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); if (p) return p[2];
  if (hide.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "hidden";
  return "full";
};
const pts = [...new Set([0, OPEN, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...hide.flat(), END])].sort((a, b) => a - b);
let windows0 = []; let cm = null;
for (const t of pts) { if (t >= END - 1e-6) break; const m = modeAt(t); if (m !== cm) { windows0.push({ start: +t.toFixed(2), mode: m }); cm = m; } }
windows0.push({ start: END, mode: "hidden" });
// fusionar blips: ventanas < 0.6s (ruido de redondeo entre beats) se absorben en la previa;
// colapsar modos iguales consecutivos → evita el parpadeo full↔PiP de 0.01s
const MINW = 0.6; const windows = [];
for (let i = 0; i < windows0.length; i++) {
  const w = windows0[i]; const nx = windows0[i + 1];
  const dur = nx ? nx.start - w.start : 999;
  if (windows.length && (dur < MINW || windows[windows.length - 1].mode === w.mode)) continue; // saltar: la previa se extiende
  windows.push(w);
}
if (windows[windows.length - 1].mode !== "hidden") windows.push({ start: END, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_abuela.gen.ts",
  `// avatar_abuela.gen.ts — GENERADO por build_abuela.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_ABUELA = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 1)};
`);

const nCc = raw.filter((b) => /broll\/cc_/.test(b.src)).length;
const nCs = raw.filter((b) => /broll\/cs_/.test(b.src)).length;
const nPh = raw.length - nCc - nCs;
console.log("=== build_abuela (AVATAR) ===");
console.log(`b-roll beats: ${raw.length} (cc_ ${nCc} + cs_ ${nCs} + fotos ${nPh}) · overlays: ${overlays.length}`);
console.log(`avatar windows: ${windows.length} · full-open hasta ${OPEN.toFixed(0)}s · PiP: ${pip.length} · hidden: ${hide.length}`);
console.log(`TOTAL: ${TOTAL} frames @ ${FPS}fps (${(END).toFixed(0)}s) → beatsheet/abuela.json + avatar_abuela.gen.ts`);
