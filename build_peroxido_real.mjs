// build_peroxido_real.mjs — Levi Lapp Jardín (ES) · agua oxigenada. VERSIÓN PUROS REALES.
// 1 visual REAL por frase (clip real o imagen real del pool), anclado al ms exacto, sin repetir.
// CERO imágenes generadas. Componentes solo de código (sin fondos IA) + PeroxidoDiagram (vector).
import fs from "fs";

const TOTAL = 1081.20, SLUG = "peroxido", AVATAR = "peroxido_opt.mp4", OPEN = 2.0;
const caps = JSON.parse(fs.readFileSync("public/captions_peroxido_aligned.json", "utf8"));
const BEATS = JSON.parse(fs.readFileSync("public/_phrase_beats.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) { const t = norm(phrase).split(" "); for (let i = 0; i <= W.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; } if (ok) return W[i].ms / 1000; } throw new Error("ANCHOR: " + phrase); }
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor:", p); return null; } };

// ── clasificación frase → concepto (keyword, orden = específico primero) ──
const RULES = [
  [["semilla", "germin", "brote", "cascara dura", "remojo"], ["rx_seeds_soak", "rx_seeds_hand", "rx_sowing_seeds", "rx_sprout_timelapse", "rx_seed_tray"]],
  [["raiz podrida", "podrid", "pudric"], ["rx_root_rot", "rx_overwater_pot"]],
  [["raices", "pelitos", "raiz sana", "raices fuertes", "raices blancas"], ["rx_roots_white", "rx_transplant_seedling"]],
  [["oidio", "polvillo", "hongo", "mancha"], ["rx_powdery_mildew", "rx_leaf_spots"]],
  [["rociar", "rocia", "pulveriz", "rociador"], ["rx_spray_leaves"]],
  [["mediodia", "sol fuerte", "pleno sol", "rayo del sol", "lupa"], ["rx_hot_sun_garden"]],
  [["temprano", "manana", "atardecer", "fresca de la"], ["rx_morning_garden"]],
  [["tijera", "podar", "poda", "desinfect", "herramienta"], ["rx_pruning_shears", "rx_wipe_blade"]],
  [["maceta", "macetas"], ["rx_terracotta_pots", "rx_wash_pot"]],
  [["mosquito", "larva", "sustrato", "mosca del"], ["rx_fungus_gnats", "rx_potting_soil", "rx_water_houseplant"]],
  [["estancada", "verdin", "balde", "tacho", "arroyo", "reoxigen"], ["rx_stagnant_water", "rx_rain_barrel", "rx_fresh_stream"]],
  [["abuelo", "amoz", "amos"], ["rx_old_farmer_garden", "rx_old_hands_soil"]],
  [["vecino", "vivero", "frascos", "compr", "camioneta"], ["rx_garden_store", "rx_cart_products"]],
  [["tomate"], ["rx_tomatoes_vine", "rx_wilting_tomato"]],
  [["interior", "adentro de casa"], ["rx_houseplants_indoor"]],
  [["lechuga", "hoja tierna", "verduras de hoja"], ["rx_lettuce_bed"]],
  [["flores", "florero", "ramo"], ["rx_flowers_vase"]],
  [["bebedero", "pajaro"], ["rx_bird_bath"]],
  [["bacha", "prueba", "burbuje si", "si burbujea"], ["rx_sink_fizz"]],
  [["botella oscura", "botella marron", "protege de la luz", "se degrada"], ["rx_dark_bottle_shelf"]],
  [["alacena", "botiquin", "baño", "en casa", "en tu casa"], ["rx_pantry_shelf", "rx_dark_bottle_shelf"]],
  [["banana"], ["rx_banana_peel"]],
  [["cosech", "en el plato", "temporada"], ["rx_harvest_hands", "rx_tomatoes_vine"]],
  [["cuidate", "proximo video", "suscrib", "comentarios", "nos vemos"], ["rx_sunset_garden", "rx_harvest_hands"]],
  [["espuma", "burbuja", "oxigeno puro", "fzzz"], ["rx_fizz_bubbles"]],
  [["cucharada", "litro", "dosis", "medida", "por litro"], ["rx_measure_spoon", "rx_pour_base_plant"]],
  [["echa", "echar", "verte", "regas", "regar", "el liquido", "la mezcla", "empapa"], ["rx_pour_base_plant", "rx_watering_can"]],
  [["ahoga", "marchit", "caida", "amarilla", "encharc", "compact", "regas de mas"], ["rx_wilting_tomato", "rx_waterlogged_soil", "rx_overwater_pot"]],
  [["tierra", "suelo", "oxigenar", "respiran", "aire"], ["rx_soil_hands", "rx_waterlogged_soil"]],
  [["botella", "botellita", "oxigenada", "peroxido", "farmacia", "3", "medicina"], ["rx_bottle_hand", "rx_peroxide_garden", "rx_dark_bottle_shelf"]],
  [["huerta", "jardin", "prospera", "sana", "frondosa", "planta"], ["rx_lush_garden", "rx_soil_hands", "rx_tomatoes_vine"]],
];
const GENERAL = ["rx_lush_garden", "rx_soil_hands", "rx_bottle_hand", "rx_tomatoes_vine", "rx_pour_base_plant", "rx_old_hands_soil", "rx_peroxide_garden", "rx_watering_can"];

const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
const REAL_EXT = ["jpg", "jpeg", "png", "webp"];
const poolImgs = (concept) => {
  const out = [];
  for (const suf of ["", "_1", "_2", "_3", "_4"]) for (const e of REAL_EXT) { const p = `real/${concept}${suf}.${e}`; if (fs.existsSync(`public/${p}`)) out.push(p); }
  return out;
};
// candidatos por concepto: clip (si existe) + imágenes del pool
const candsFor = (concept) => { const c = []; if (have(concept)) c.push({ src: `broll/${concept}.mp4`, clip: true, key: concept }); for (const p of poolImgs(concept)) c.push({ src: p, clip: false, key: p }); return c; };
const classify = (text) => { const n = norm(text); for (const [kws, cons] of RULES) if (kws.some((k) => n.includes(k))) return cons; return GENERAL; };

// ── AV_FULL: avatar full en apertura + arranque de historia/cierre ──
const _a = (p) => { try { return at(p); } catch { return null; } };
const AV = [[0, OPEN]];
for (const [a, b] of [["vi a mi abuelo", "teniamos un vecino"], ["mi primera planta de tomate", "ahora si el error"], ["cuidate cuida tu huerta", TOTAL]]) {
  const s = _a(a), e = (typeof b === "number") ? b : _a(b); if (s != null && e != null) AV.push([s, e]);
}
const inFull = (t) => AV.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);

// ── asignación por frase: 1 visual real, rotando, anti-repetición ──
const usage = {}; const lastN = [];
const candCache = new Map();
const candidatesFor = (arr) => {
  const key = arr.join(",");
  if (candCache.has(key)) return candCache.get(key);
  const set = []; const seen = new Set();
  for (const con of arr) for (const c of candsFor(con)) if (!seen.has(c.key)) { seen.add(c.key); set.push(c); }
  candCache.set(key, set); return set;
};
const pick = (arr) => {
  let cands = candidatesFor(arr);
  if (!cands.length) cands = candidatesFor(GENERAL);
  if (!cands.length) return null;
  const recent = (k) => lastN.includes(k);
  let best = null, bu = Infinity;
  for (const c of cands) { const u = usage[c.key] || 0; if (!recent(c.key) && u < bu) { bu = u; best = c; } }
  if (!best) for (const c of cands) { const u = usage[c.key] || 0; if (u < bu) { bu = u; best = c; } }
  usage[best.key] = (usage[best.key] || 0) + 1; lastN.push(best.key); if (lastN.length > 6) lastN.shift();
  return best;
};

let beats = [];
for (let i = 0; i < BEATS.length; i++) {
  const b = BEATS[i]; const t = +(b.ms / 1000).toFixed(2);
  if (inFull(t)) continue; // durante avatar full no hay b-roll
  const concept = classify(b.text);
  const pk = pick(concept);
  const dur = +Math.min(b.dur + 0.3, TOTAL - t).toFixed(2);
  beats.push({ id: `p${i}_${(pk ? pk.key : "x").replace(/[^a-z0-9]/gi, "").slice(0, 14)}`, start: t, dur, kind: "raw", src: pk ? pk.src : "real/rx_lush_garden_1.jpg", darken: 0 });
}
const usedUniq = new Set(beats.map((x) => x.src)).size;
console.log(`beats por frase: ${beats.length} · visuales únicos: ${usedUniq} · clips: ${beats.filter(x => x.src.startsWith("broll/")).length} · imgs: ${beats.filter(x => x.src.startsWith("real/")).length}`);

// ── componentes SOLO de código (sin fondos IA) + molécula ──
const ck = (text) => ({ text, state: "done" });
const COMPONENTS = [
  // ── BESPOKE (piezas a medida por momento) ──
  { t: atc("un oxigeno de mas"), id: "px_forge", kind: "pxforge", dur: 8.5, title: "Un oxígeno de más" },
  { t: atc("es oxigeno puro saliendo"), id: "px_bottle", kind: "pxbottle", dur: 7.0, label: "El oxígeno de más se libera" },
  { t: atc("las raices tambien respiran"), id: "px_soil", kind: "pxsoil", dur: 8.0, title: "Las raíces respiran" },
  { t: atc("la tierra se compacta"), id: "px_drown", kind: "pxdrown", dur: 7.0, title: "No tiene sed: se ahoga" },
  { t: atc("ablanda esa cascara"), id: "px_seed", kind: "pxseed", dur: 8.0, title: "Despertar la semilla" },
  { t: atc("aparece una hojita nueva"), id: "px_rescue", kind: "pxrescue", dur: 8.0, title: "Rescatar la raíz" },
  { t: atc("frenar los hongos en las hojas"), id: "px_mildew", kind: "pxmildew", dur: 7.5, title: "El hongo retrocede" },
  { t: atc("nunca rocies con el sol pegando fuerte"), id: "px_sun", kind: "pxsun", dur: 7.0, title: "Al sol = veneno" },
  { t: atc("el problema real no esta arriba"), id: "px_gnats", kind: "pxgnats", dur: 7.5, title: "El problema está abajo" },
  { t: atc("agua de riego mas viva"), id: "px_water", kind: "pxwater", dur: 7.5, title: "Agua muerta → viva" },
  { t: atc("si le pones de mas"), id: "px_dose", kind: "pxdose", dur: 8.0, title: "La dosis justa" },
  { t: atc("echale un chorrito en la bacha"), id: "px_fizz", kind: "pxfizz", dur: 6.5, alive: true, title: "¿Todavía sirve?" },
  { t: atc("se degrada con la luz"), id: "px_amber", kind: "pxamber", dur: 6.5, title: "Por qué botella oscura" },
  { t: atc("no es un fertilizante"), id: "px_myth", kind: "pxmyth", dur: 8.0, title: "3 mitos del peróxido", myths: ["Es un fertilizante", "Sirve la industrial fuerte", "Dura para siempre"] },
  { t: atc("la diferencia nunca fue la plata"), id: "px_cost", kind: "pxcost", dur: 7.0, title: "El vecino vs el abuelo" },
  { t: atc("un repaso bien rapido"), id: "px_seven", kind: "pxseven", dur: 9.0, title: "Los 7 secretos", items: ["Oxigenar la tierra", "Despertar semillas", "Salvar la raíz podrida", "Frenar los hongos", "Desinfectar herramientas", "Larvas del sustrato", "Agua de riego viva"] },
  // ── overlays de dosis (sobre clips, densidad) ──
  { t: atc("una cucharada de agua oxigenada del 3 en un litro"), id: "cmp_d1", kind: "labelcallout", overlay: true, dur: 3.2, text: "1 cucharada · 1 litro", from: "bottom" },
  { t: atc("ni un minuto mas pone una alarma"), id: "cmp_d2", kind: "bigstat", overlay: true, dur: 3.0, value: 30, unit: " min", caption: "de remojo, ni uno más" },
  { t: atc("una cucharada y media por litro"), id: "cmp_d3", kind: "labelcallout", overlay: true, dur: 3.2, text: "1½ cda · 1 litro · empapar", from: "bottom", accent: "danger" },
  // ── código: quote del abuelo, herramientas, barras (varcheck), cierre ──
  { t: atc("esto es una medicina"), id: "cmp_quote", kind: "quotecard", dur: 5.5, quote: "Esto ES una medicina. La tierra también se enferma.", author: "El abuelo Amós" },
  { t: atc("le pasaste la enfermedad"), id: "cmp_tools", kind: "checklist", dur: 6.5, title: "Desinfectar la tijera", items: [ck("Trapito con pura"), ck("Entre planta y planta"), ck("Macetas en remojo")] },
  { t: atc("mas fuertes mas blancas mas sanas"), id: "cmp_bars_water", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 7.0, title: "Agua muerta vs agua viva", eyebrow: "Lo que cambia en la raíz", bars: [{ label: "Agua estancada del balde", value: 100, display: "Raíces débiles", tone: "danger" }, { label: "Agua reoxigenada", value: 100, display: "Raíces fuertes", winner: true }] },
  { t: atc("una botellita de dos pesos"), id: "cmp_bars_cost", kind: "bars", hue: "amber", accent: "good", unit: "", dur: 7.0, title: "Vivero vs agua oxigenada", eyebrow: "Lo que gastás", bars: [{ label: "Frascos del vivero", value: 100, display: "Una fortuna", tone: "danger" }, { label: "Una botellita", value: 4, display: "$2 · 7 usos", winner: true }] },
  { t: atc("cascara de banana"), id: "cmp_close", kind: "closingcard", dur: 5.0, heading: "Próximo: la cáscara de banana", cta: "Suscribite al canal", seal: true },
];

const avStarts = AV.map(([s]) => s);
let nComp = 0; const overlayComps = [];
for (const c of [...COMPONENTS].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
  if (c.t == null) continue;
  const { t, kind, overlay, ...rest } = c; delete rest.id;
  if (overlay) { overlayComps.push({ id: c.id, start: +t.toFixed(2), dur: c.dur || 3, kind, overlay: true, ...rest }); nComp++; continue; }
  let idx = -1; for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) idx = i; else break; }
  if (idx < 0) continue;
  const start = beats[idx].start, D = c.dur || 6;
  const ab = { id: c.id, start, dur: D, kind, ...rest };
  let rm = 1; while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05) rm++;
  beats.splice(idx, rm, ab);
  const next = beats[idx + 1], nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2); nComp++;
}
console.log(`componentes: ${nComp} (+${overlayComps.length} overlay)`);

// tiling final de duraciones
beats.sort((a, b) => a.start - b.start);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i], nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const ov = b.kind === "raw" ? Math.min(0.4, (end - b.start) * 0.25) : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}
// overlays que no pisen componentes
{
  const comps = beats.filter((b) => !b.overlay && b.kind !== "raw");
  const over = (o) => comps.some((c) => o.start < c.start + c.dur - 0.2 && o.start + o.dur > c.start + 0.2);
  const kept = overlayComps.filter((o) => !over(o)); beats.push(...kept);
  console.log(`overlays: ${kept.length}`);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

// ── avatar: cornerBR fijo, oculto en componentes ──
const CORNER = "cornerBR";
const compZones = beats.filter((b) => b.kind !== "raw").map((b) => [b.start, b.start + b.dur]);
const inComp = (t) => compZones.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw").sort((a, b) => a.start - b.start);
const pip = [];
for (let i = 0; i < _bw.length; i++) { const b = _bw[i]; if (i % 4 !== 2) continue; if (inFull(b.start) || inComp(b.start)) continue; let end = b.start + Math.min(b.dur, 5); const nc = compZones.map((z) => z[0]).filter((s) => s > b.start + 0.05).sort((a, b) => a - b)[0] ?? Infinity; const na = avStarts.filter((s) => s > b.start + 0.05).sort((a, b) => a - b)[0] ?? Infinity; end = Math.min(end, nc, na); if (end - b.start < 1.4) continue; pip.push([+(b.start + 0.12).toFixed(2), +end.toFixed(2), CORNER]); }
const modeAt = (t) => { if (t < OPEN - 1e-6) return "full"; if (AV.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, OPEN, ...AV.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_peroxido.gen.ts", `// avatar_peroxido.gen.ts — GENERADO por build_peroxido_real.mjs. NO editar.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_PEROXIDO = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
console.log(`avatar windows: ${windows.length} · PiP ${pip.length} · beats: ${beats.length}`);
