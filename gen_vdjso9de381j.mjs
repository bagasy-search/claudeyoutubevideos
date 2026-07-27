// gen_vdjso9de381j.mjs — arma el track del video "El OTRO Botox Verde" (canal Federer Archivos, kit _fed6).
// Entrada: _dir_0..6_vdjso9de381j.json (los 7 directores) + public/captions_vdjso9de381j.json
// Salida: src/_fed6/VideoEdit/federer_vdjso9de381j_{beats,hooks,broll}.ts + public/broll/_fetch_vdjso9de381j.json
import fs from "fs";

const SLUG = "vdjso9de381j";
const FPS = 30;

// ── captions ─────────────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const VIDEO_END = (CW[CW.length - 1]?.s || 1650) + 1.5;

// busca la frase; devuelve el ms del PRIMER match >= after (o el más cercano si no hay)
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  const tryLen = [p.length, 5, 4, 3, 2].filter((n) => n >= 2 && n <= p.length);
  for (const n of [...new Set(tryLen)]) {
    const q = p.slice(0, n);
    let best = null;
    for (let i = 0; i <= CW.length - q.length; i++) {
      let ok = true;
      for (let j = 0; j < q.length; j++) if (CW[i + j].t !== q[j]) { ok = false; break; }
      if (!ok) continue;
      if (CW[i].s >= after) return CW[i].s;
      best = best ?? CW[i].s;
    }
    if (best != null && n === p.length) { /* existe pero antes del cursor → seguimos afinando */ }
  }
  return null;
};

// ── juntar los 7 directores ──────────────────────────────────────────────────
const RANGES = [[0, 240], [240, 480], [480, 720], [720, 960], [960, 1200], [1200, 1420], [1420, 1e9], [0, 550], [550, 1100], [1100, 1e9]];
let raw = [];
for (let i = 0; i < 10; i++) {
  const f = `_dir_${i}_${SLUG}.json`;
  if (!fs.existsSync(f)) { console.log(`⚠ falta ${f}`); continue; }
  let txt = fs.readFileSync(f, "utf8").trim();
  txt = txt.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  let arr;
  try { arr = JSON.parse(txt); } catch (e) { console.log(`⚠ ${f} JSON inválido: ${e.message}`); continue; }
  arr.forEach((m) => raw.push({ ...m, _wave: i, _lo: RANGES[i][0], _hi: RANGES[i][1] }));
  console.log(`  dir ${i}: ${arr.length} momentos`);
}
console.log(`total dirigido: ${raw.length}`);

// ── anclar: cursor POR OLA (cada director recorre su propio tramo) ───────────
let unanchored = 0;
const byWave = {};
raw.forEach((m) => (byWave[m._wave] ??= []).push(m));
const moments = [];
// ⚠ Se cortó del avatar un tramo duplicado de ~56s (falso arranque de HeyGen), así que TODO lo
// que estaba después de 0:56 se corrió hacia atrás. Los rangos que se les dieron a los directores
// son del audio SIN cortar → hay que tolerar ese corrimiento o no ancla NADA (349/418 perdidas).
const SHIFT = +(process.env.CUT_SHIFT || 60);
for (const w of Object.keys(byWave).sort((a, b) => a - b)) {
  let cursor = Math.max(0, RANGES[w][0] - SHIFT);
  for (const m of byWave[w]) {
    let s = findMs(m.at, cursor);
    if (s == null || s < Math.max(0, RANGES[w][0] - SHIFT - 5) || s > Math.min(RANGES[w][1] + 25, VIDEO_END)) { s = null; unanchored++; }
    m.start = s != null ? s : cursor + 3.6;
    if (s != null) cursor = s;
    else cursor = m.start;
    moments.push(m);
  }
}
moments.sort((a, b) => a.start - b.start);
console.log(`sin anclar: ${unanchored}/${raw.length}`);

// dedupe de arranques idénticos / demasiado juntos (< 0.9s)
const clean = [];
for (const m of moments) {
  const last = clean[clean.length - 1];
  if (last && m.start - last.start < 2.0) continue;
  clean.push(m);
}

// duración = min(pedida, hasta el próximo) con piso
for (let i = 0; i < clean.length; i++) {
  const next = i + 1 < clean.length ? clean[i + 1].start : VIDEO_END;
  const room = +(next - clean[i].start).toFixed(2);
  const want = Math.max(1.6, +(clean[i].dur || 3.8));
  clean[i].dur = +Math.min(want, room).toFixed(2);
  clean[i].start = +clean[i].start.toFixed(2);
}

// ── separar b-roll de beats ──────────────────────────────────────────────────
const OVERLAYK = new Set(["lowerthird", "frasecinetica"]);
const brollList = [];
const beats = [];
let bi = 0, id = 0;
for (const m of clean) {
  if (m.kind === "broll") {
    const q = String(m.query || "").trim().split(/\s+/).slice(0, 3).join(" ");
    const name = `bd_${SLUG}_${String(bi).padStart(3, "0")}`;
    brollList.push({ name, src: `broll/${SLUG}/${name}.mp4`, start: m.start, dur: Math.min(m.dur, 6), query: q || "elderly hands home" });
    bi++;
    continue;
  }
  const b = { id: `m${String(id++).padStart(3, "0")}`, key: `w${m._wave}`, start: m.start, dur: m.dur, kind: m.kind };
  for (const k of Object.keys(m)) {
    if (["at", "dur", "kind", "start", "_wave", "_lo", "_hi", "query"].includes(k)) continue;
    b[k] = m[k];
  }
  if (m.kind === "raw" && !b.src) continue;
  beats.push(b);
}

// ── post-pass milimétrico ────────────────────────────────────────────────────
const KIT_CLIPS = [];
for (const b of beats) {
  // avatarkeyword / avatarpizarra → at por item (frames rel), clip propio del avatar
  if (b.kind === "avatarkeyword" || b.kind === "avatarpizarra") {
    let last = 0;
    b.items = (b.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, b.start - 1.5); if (ms != null && ms >= b.start - 1.5) atF = Math.max(0, Math.round((ms - b.start) * FPS)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    if (!b.items.length) { b.kind = "talk"; continue; }
    if (last > 300) { b.items = b.items.map((it, i) => ({ ...it, at: i * 90 })); last = (b.items.length - 1) * 90; }
    const hold = b.kind === "avatarpizarra" ? 4.2 : 2.8;
    b.dur = +(last / FPS + hold).toFixed(2);
    b.clip = `avatar_clips/${SLUG}/${b.id}.mp4`;
    KIT_CLIPS.push({ name: b.id, start: +b.start.toFixed(2), dur: +(b.dur + 0.4).toFixed(2) });
  }
  // focuscards → enfoque por número, monotónico
  if (b.kind === "focuscards") {
    const n = (b.items || []).length;
    if (!n) { b.kind = "talk"; continue; }
    const at = b.items.map((it) => { if (it.atPhrase) { const ms = findMs(it.atPhrase, b.start - 1); if (ms != null) return Math.max(0, Math.round((ms - b.start) * FPS)); } return null; });
    for (let i = 0; i < n; i++) {
      if (at[i] == null) {
        const prev = i > 0 ? at[i - 1] : 0;
        let nj = i + 1; while (nj < n && at[nj] == null) nj++;
        at[i] = nj < n && at[nj] != null ? Math.round(prev + (at[nj] - prev) / (nj - i + 1)) : prev + 90;
      }
      if (i > 0 && at[i] <= at[i - 1]) at[i] = at[i - 1] + 45;
    }
    b.items = b.items.map((it, i) => { const { atPhrase, ...rest } = it; return { ...rest, at: at[i] }; });
    b.dur = +(at[n - 1] / FPS + 3.4).toFixed(2);
  }
  // mitoverdad → flipAt en frames
  if (b.kind === "mitoverdad") {
    const ms = b.flipPhrase ? findMs(b.flipPhrase, b.start - 1) : null;
    const lastSafe = Math.round(b.dur * FPS) - 26;
    let f = ms != null ? Math.round((ms - b.start) * FPS) : Math.round(b.dur * FPS * 0.42);
    if (!(f > 8 && f < lastSafe)) f = Math.round(b.dur * FPS * 0.42);
    b.flipAt = f; delete b.flipPhrase;
  }
  // frasecinetica → ats nulos (reparto automático del componente)
  if (b.kind === "frasecinetica" && !b.perWord) b.perWord = 10;
  // ⚠ freezezoom usa x/y en 0..1 (annotated los usa en 0..100)
  if (b.kind === "freezezoom") {
    if (b.x == null) b.x = 0.5; if (b.y == null) b.y = 0.5;
    if (b.x > 1) b.x = +(b.x / 100).toFixed(3);
    if (b.y > 1) b.y = +(b.y / 100).toFixed(3);
    if (!b.zoom) b.zoom = 1.6;
  }
  // board / checklist: items SIEMPRE objetos
  if (b.kind === "board" && Array.isArray(b.items)) b.items = b.items.map((it) => (typeof it === "string" ? { title: it } : it));
  if (b.kind === "checklist" && Array.isArray(b.items)) b.items = b.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
  if (b.kind === "headline" && Array.isArray(b.tokens)) b.tokens = b.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
}

// ── SANEO de rutas de medios: sólo rutas reales (los directores a veces escriben descripciones)
const OKPATH = /^(img|broll|med|real)\//;
const imgsOnDisk = fs.existsSync("public/img") ? new Set(fs.readdirSync("public/img").map((f) => "img/" + f.replace(/\.(png|jpg|jpeg|webp)$/i, ""))) : new Set();
const pickNear = (t) => {
  const cands = [...imgsOnDisk].filter((p) => p.startsWith(`img/p_${SLUG}_`));
  return cands.length ? cands[Math.floor((t / VIDEO_END) * cands.length) % cands.length] : null;
};
const fixPath = (v, t) => {
  if (typeof v !== "string" || !OKPATH.test(v)) return pickNear(t);
  const base = v.replace(/\.(png|jpg|jpeg|webp|mp4)$/i, "");
  if (imgsOnDisk.size && base.startsWith("img/") && !imgsOnDisk.has(base)) return pickNear(t);
  return base;
};
let fixed = 0;
for (const b of beats) {
  if (b.kind === "raw") { const f = fixPath(b.src, b.start); if (f !== b.src) fixed++; b.src = f; if (!b.src) { b.kind = "talk"; delete b.src; } }
  if (b.image != null) { const f = fixPath(b.image, b.start); if (f !== b.image) fixed++; b.image = f; if (!b.image) delete b.image; }
  if (Array.isArray(b.slides)) b.slides = b.slides.map((s) => ({ ...s, image: fixPath(s.image, b.start) })).filter((s) => s.image);
  if (Array.isArray(b.items)) b.items = b.items.map((it) => (it && typeof it === "object" && it.image ? { ...it, image: fixPath(it.image, b.start) } : it));
  // blurexplainer necesita clip además de image
  if (b.kind === "blurexplainer" && !b.clip) {
    const bb = brollList.filter((x) => x.start <= b.start).pop();
    if (bb) b.clip = bb.src; else b.kind = "raw";
  }
}
console.log(`rutas corregidas: ${fixed}`);

// ── piso de duración para componentes ────────────────────────────────────────
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "ingredients", "pizarra", "blurexplainer", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom"]);
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextC = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const cap = nextC - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(4.2, cap)).toFixed(2);
}

// ── PROTEGER escenas largas (focuscards / pizarra): sacar invasores ──────────
const PROT = beats.filter((b) => b.kind === "focuscards" || b.kind === "avatarpizarra");
const keep = beats.filter((b) => !PROT.some((p) => b !== p && b.start > p.start + 0.2 && b.start < p.start + p.dur - 0.2));
const dropped = beats.length - keep.length;
const BEATS = keep;
const BROLL = brollList.filter((x) => !PROT.some((p) => x.start > p.start + 0.2 && x.start < p.start + p.dur - 0.2));
console.log(`invasores sacados de escenas protegidas: ${dropped} beats + ${brollList.length - BROLL.length} clips`);

// ── salidas ──────────────────────────────────────────────────────────────────
fs.mkdirSync("public/avatar_clips", { recursive: true });
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));
const talks = BEATS.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs\nexport const FEDZ_BEATS: any[] = ${JSON.stringify(BEATS)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs\nexport const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs\nexport const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(BROLL)};\n`);
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/broll/_fetch_${SLUG}.json`, JSON.stringify(BROLL.map((b) => ({ name: b.name, query: b.query })), null, 1));
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: BEATS }, null, 1));

// ── QA ───────────────────────────────────────────────────────────────────────
const all = [...BEATS.map((b) => ({ s: b.start, d: b.dur })), ...BROLL.map((b) => ({ s: b.start, d: b.dur }))].sort((a, b) => a.s - b.s);
const gaps = [];
for (let i = 1; i < all.length; i++) { const g = all[i].s - (all[i - 1].s + all[i - 1].d); if (g > 1.2) gaps.push([+all[i - 1].s.toFixed(1), +all[i].s.toFixed(1)]); }
const spans = []; for (let i = 1; i < all.length; i++) spans.push(all[i].s - all[i - 1].s);
spans.sort((a, b) => a - b);
const med = spans[Math.floor(spans.length / 2)], p90 = spans[Math.floor(spans.length * 0.9)];
const long = spans.filter((x) => x >= 5).length;
const kinds = {}; BEATS.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log(`\n── cues: ${BEATS.length} beats + ${BROLL.length} clips = ${all.length}`);
console.log(`   mediana ${med.toFixed(2)}s · p90 ${p90.toFixed(2)}s · ≥5s ${((long / spans.length) * 100).toFixed(0)}%`);
console.log(`   talk: ${talks.length} tramos = ${talks.reduce((a, t) => a + t.dur, 0).toFixed(0)}s (${((talks.reduce((a, t) => a + t.dur, 0) / VIDEO_END) * 100).toFixed(0)}% del video)`);
console.log(`   kinds:`, Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(" "));
if (gaps.length) console.log(`   ⚠ huecos >1.2s: ${gaps.length}`, gaps.slice(0, 8));
console.log(`   VIDEO_END ${VIDEO_END.toFixed(1)}s → ${Math.round(VIDEO_END * FPS)} frames`);
