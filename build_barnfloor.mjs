// build_barnfloor.mjs — "Stop Paying to Fix Barn Floor Cracks — Do It the Cheap Amish Way"
// Canal Claudio Yoder (@claudioyoder-amish · INGLÉS · modo avatar · amish-doc).
// Avatar de 10:01 EN BUCLE (horneado en barnfloor_opt.mp4 con el master de audio de 20:38)
// + clips agnes + foto de respaldo agnes por clip (tapa la cola del momento)
// + 13 fotos hero gpt-image-2 (ref del avatar) + kit premium THEME_EARTH (labels EN).
// CTA = The Plain Almanac (sin precio ni link en voz).
// Salida: beatsheet/barnfloor.json + src/VideoEdit/avatar_barnfloor.gen.ts
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "barnfloor";
const TOTAL = 1237.8;        // master = 1237.67s · opt.mp4 video = 1240.08s
const CLIP_LOOP = 601.13;    // costura del bucle de avatar (y otra en 1202.26)
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^\uFEFF/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = [];
for (const c of caps) for (const w of norm(c.text).split(" ").filter(Boolean)) Wc.push({ n: w, ms: c.startMs });
const at = (phrase, maxTok = 8) => {
  const t = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok);
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};

// ── Momentos del DIRECTOR ────────────────────────────────────────────────────────────────────
const mom = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
const dur = (p) => { try { return +execFileSync(FF, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", p]).toString().trim(); } catch { return 0; } };

// ⚠ EL LIPSYNC SÓLO ES EXACTO EN LOS PRIMEROS 601,13s. Después el avatar es un bucle
// sobre el master de Fish y la boca NO coincide con lo que se oye. Por eso:
//  · AVATAR_IDX  → momentos ENTEROS a cámara, todos dentro del tramo sincronizado (idx ≤ 112).
//  · AV_SHORT    → después de la costura, sólo respiros CORTOS (≤3s) en aperturas de sección,
//                  donde un plano breve del presentador lee como corte de montaje y no como
//                  un doblaje desincronizado.
const AVATAR_IDX = new Set([
  0, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 17, 18, 19, 20, 23, 24, 26, 27, 28, 29, 30,
  34, 35, 37, 38, 39, 41, 42, 44, 47, 49, 51, 53, 54, 55, 56, 59, 61, 62, 64, 65,
  68, 70, 74, 77, 78, 79, 80, 83, 85, 86, 87, 88, 89, 91, 92, 93, 94, 96, 97, 99,
  102, 103, 105, 107, 111, 112,
]);
const AV_SHORT = [
  [609.30, 612.10], [657.84, 660.40], [700.02, 702.40], [717.54, 720.10],
  [767.70, 770.00], [798.00, 800.40], [828.06, 830.40], [868.64, 871.20],
  [923.18, 925.70], [970.78, 973.20], [1001.20, 1003.80], [1032.82, 1035.20],
  [1062.90, 1065.30], [1104.70, 1107.20], [1127.54, 1130.00], [1162.98, 1165.40],
  [1181.02, 1183.40], [1209.66, 1212.00],
];  // el cierre (1235.84+) lo sostiene la FOTO hero: la frase firma no puede ir desincronizada

const rawBeats = [];
const avatarSpans = [];
let nClip = 0, nPhoto = 0, nHero = 0; const missing = [];
for (let i = 0; i < mom.length; i++) {
  const m = mom[i];
  const start = m.start, slot = m.dur;

  if (m.k === "hero") {
    const p = `img/${SLUG}/bfp_${m.n}.jpg`;
    if (!fs.existsSync("public/" + p)) { missing.push(p); continue; }
    rawBeats.push({ id: `${SLUG}_h${i}`, start, kind: "raw", src: p, hue: "amber", darken: 0, dur: slot });
    nHero++;
    continue;
  }
  if (AVATAR_IDX.has(m.idx)) { avatarSpans.push([start, +(start + slot).toFixed(2)]); continue; }

  const vid = `broll/bf_${m.n}.mp4`;
  const img = `img/${SLUG}/bf_${m.n}.jpg`;
  const hasVid = fs.existsSync("public/" + vid);
  const hasImg = fs.existsSync("public/" + img);
  if (!hasVid && !hasImg) { missing.push(vid); continue; }

  if (hasVid) {
    const real = Math.max(1.2, dur("public/" + vid) - 0.08);
    const cov = +Math.min(slot, real).toFixed(2);
    rawBeats.push({ id: `${SLUG}_${i}`, start, kind: "raw", src: vid, hue: "amber", darken: 0, dur: cov, noSplit: true });
    nClip++;
    const tail = +(slot - cov).toFixed(2);
    if (tail >= 1.0 && hasImg) {
      rawBeats.push({ id: `${SLUG}_${i}t`, start: +(start + cov).toFixed(2), kind: "raw", src: img, hue: "amber", darken: 0, dur: tail });
      nPhoto++;
    }
  } else {
    rawBeats.push({ id: `${SLUG}_${i}`, start, kind: "raw", src: img, hue: "amber", darken: 0, dur: slot });
    nPhoto++;
  }
}
// ── respiros CORTOS de avatar en el tramo del bucle: se los recorta al b-roll ────────────────
{
  const kept = []; let cutShort = 0;
  for (const b of rawBeats) {
    const end = +(b.start + b.dur).toFixed(2);
    const w = AV_SHORT.find(([s, e]) => b.start < e && end > s);
    if (!w) { kept.push(b); continue; }
    if (b.start < w[0] && w[0] - b.start >= 1.2) { b.dur = +(w[0] - b.start).toFixed(2); kept.push(b); }
    else if (end > w[1] && end - w[1] >= 1.2) { b.dur = +(end - w[1]).toFixed(2); b.start = w[1]; kept.push(b); }
    else cutShort++;
  }
  rawBeats.length = 0; rawBeats.push(...kept);
  avatarSpans.push(...AV_SHORT);
  console.log(`respiros de avatar en el bucle: ${AV_SHORT.length} · beats cedidos ${cutShort}`);
}
console.log(`b-roll: clips ${nClip} · fotos ${nPhoto} · hero ${nHero} · avatar ${avatarSpans.length} tramos · faltantes ${missing.length}`);
if (missing.length) console.log("  faltan:", missing.slice(0, 10).join(" "), missing.length > 10 ? `… +${missing.length - 10}` : "");

// ── COMPONENTES (kit premium THEME_EARTH, labels en INGLÉS) ──────────────────────────────────
const PREMIUM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_comps.json`, "utf8").replace(/^\uFEFF/, ""));
const textOf = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => textOf(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => textOf(x, out));
  return out;
};
const readSecs = (props) => {
  const strs = textOf(props).filter((s) => s.length > 1 && !s.includes("/") && !s.endsWith(".jpg") && !s.endsWith(".png"));
  const chars = strs.reduce((a, s) => a + s.length * (s.length < 26 ? 0.75 : 1), 0);
  return { chars: Math.round(chars), min: +(0.8 + chars / 14 + 1.0).toFixed(2) };
};

const compBeats = [];
let missAnchor = 0; const placed = [];
for (const p of PREMIUM) {
  const s = at(p.at, p.maxTok);
  if (s == null) { console.warn("⚠ anchor missing:", p.at.slice(0, 55)); missAnchor++; continue; }
  const { chars, min } = readSecs(p.props);
  placed.push({ ...p, start: +s.toFixed(2), need: min, chars });
}
placed.sort((a, b) => a.start - b.start);
let debt = 0; const over = [];
for (let i = 0; i < placed.length; i++) {
  const p = placed[i];
  const room = (placed[i + 1] ? placed[i + 1].start - 0.4 : TOTAL) - p.start;
  const d = +Math.min(Math.max(p.need, 4.0), Math.max(room, 4.0)).toFixed(2);
  if (d + 0.01 < p.need) { debt += +(p.need - d).toFixed(2); over.push(`${p.comp}@${Math.round(p.start)}s -${(p.need - d).toFixed(1)}s`); }
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(p.start)}`, start: p.start, dur: d, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
}
if (debt > 0) console.log(`⚠ DEUDA DE LECTURA: ${debt.toFixed(1)}s · ${over.join(" · ")}`);
else console.log("lectura: deuda 0 (todo componente dura lo que se tarda en leerlo)");
console.log(`componentes: ${compBeats.length}/${PREMIUM.length} (${new Set(compBeats.map((b) => b.comp)).size} tipos) · anchors perdidos ${missAnchor}`);

// ── COBERTURA: el avatar es el FONDO. Base full; el contenido cubre SOLO su span real ────────
const spans = rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => spans.some(([s, e]) => s <= t && e > t);
const STEP = 0.1;
const windows = []; let cur = null;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const mode = covered(t) ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: t, mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: "full" });

let holes = 0;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const w = [...windows].reverse().find((x) => x.start <= t);
  if (w.mode !== "full" && !covered(t)) holes++;
}
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`ventanas ${windows.length} · avatar full ${avSecs.toFixed(0)}s (${(avSecs / TOTAL * 100).toFixed(1)}%) · HUECOS ${holes}`);

for (const s of [CLIP_LOOP, 1202.26]) {
  const hit = rawBeats.some((b) => Math.abs(b.start - s) < 0.2) || avatarSpans.some(([a, b]) => Math.abs(a - s) < 0.2 || Math.abs(b - s) < 0.2);
  console.log(`costura ${s}s → ${hit ? "CUBIERTA" : "⚠ DESCUBIERTA"}`);
}

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ slug: SLUG, total: TOTAL, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// generado por build_${SLUG}.mjs\nexport const TOTAL_BARNFLOOR = ${TOTAL};\nexport const AVATAR_WINDOWS = ${JSON.stringify(windows)} as const;\n`);
console.log(`→ beatsheet/${SLUG}.json (${beats.length} beats) · src/VideoEdit/avatar_${SLUG}.gen.ts`);
