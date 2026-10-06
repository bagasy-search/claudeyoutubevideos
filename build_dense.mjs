// build_dense.mjs — build SIN REUSO (estilo barcos): coloca los clips densos (1 por mini-frase,
// de <slug>_cues.json) uno por corte, e inserta los COMPONENTES (rule/scalecolossus/stat/headline/
// timeline + overlays) en sus momentos, recortando los clips que pisan. Las secciones se ubican
// anclando frases en el timing. Config por video en build_<slug>_cfg.mjs (DATA, anchors, headline...).
//   node build_dense.mjs <slug>
import fs from "fs";
const slug = process.argv[2];
if (!slug) { console.error("Uso: node build_dense.mjs <slug>"); process.exit(1); }
const cfg = (await import(`./build_${slug}_cfg.mjs`)).default;
const TM = JSON.parse(fs.readFileSync(`public/${slug}_timing.json`, "utf8"));
const CUES = JSON.parse(fs.readFileSync(`src/VideoEdit/${slug}_cues.json`, "utf8"));
const END = TM[TM.length - 1].start + 6;

// ── anclar frase en el timing (igual que gen) ──
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
let full = ""; const pos2t = [];
for (let i = 0; i < TM.length; i++) { const seg = norm(TM[i].text) + " "; if (seg.length <= 1) continue; const t0 = TM[i].start, t1 = i + 1 < TM.length ? TM[i + 1].start : t0 + seg.length / 14; for (let k = 0; k < seg.length; k++) pos2t.push(t0 + (t1 - t0) * (k / seg.length)); full += seg; }
let _cur = 0;
const at = (first) => { const q = norm(first); const idx = full.indexOf(q, _cur); if (idx < 0) return null; _cur = idx + q.length; return +pos2t[idx].toFixed(2); };
// búsqueda INDEPENDIENTE (no avanza _cur) para componentes EXTRA anclados en cualquier orden
const atFree = (first) => { const q = norm(first); const idx = full.indexOf(q); return idx < 0 ? null : +pos2t[idx].toFixed(2); };

const B = [], I = []; let _n = 0;
const nid = (p) => p + String(++_n).padStart(3, "0");
const seenI = new Set();
const spImg = (name, query, concept) => { if (!seenI.has(name)) { seenI.add(name); I.push({ name, query: Array.isArray(query) ? query : [query], concept }); } return "real/" + name + ".jpg"; };
const C = (start, dur, o) => B.push({ id: nid(o.kind), start: +start.toFixed(2), dur: +dur.toFixed(2), ...o });
const ov = (start, dur, o) => B.push({ id: nid("o"), start: +start.toFixed(2), dur: +dur.toFixed(2), overlay: true, ...o });
const tk = (arr) => arr.map((x) => (Array.isArray(x) ? { t: x[0], [x[1]]: true } : { t: x }));

// ── tiempos de sección (anclados en orden) ──
const headT = at(cfg.headlineAt);
const secT = cfg.DATA.map((d) => at(d.at));
const clT = at(cfg.cierreAt), tlT = at(cfg.timelineAt), proxT = at(cfg.proximoAt);

// ── COMPONENTES (cues full-screen) + sus intervalos bloqueados ──
const comps = [];
const hue4 = (t) => { let h = "cold"; for (let i = 0; i < secT.length; i++) if (secT[i] != null && t >= secT[i]) h = cfg.DATA[i].hue; if (clT != null && t >= clT) h = "amber"; return h; };
// headline
comps.push({ start: headT, dur: 6.0, kind: "headline", tokens: tk(cfg.headline.tokens), bg: "image", image: spImg(cfg.headline.img, cfg.headline.q, cfg.headline.q), hue: cfg.headline.hue, size: cfg.headline.size || 84 });
// por sección: rule + scalecolossus + stat
for (let di = 0; di < cfg.DATA.length; di++) {
  const d = cfg.DATA[di], s = secT[di]; if (s == null) continue;
  const next = di + 1 < cfg.DATA.length ? secT[di + 1] : clT;
  comps.push({ start: s, dur: 4.2, kind: "rule", number: d.n, title: d.name, label: d.loc, hue: d.hue });
  ov(s + 4.2, 6.0, { kind: "doclabel", label: d.name, sub: d.loc, accent: d.hue });
  ov(s + 4.2, (next || s + 30) - s - 4.4, { kind: "countrail", total: 7, rank: +d.n, name: d.name, accent: d.hue });
  const third = s + (next - s) / 3, twoThird = s + 2 * (next - s) / 3;
  comps.push({ start: third, dur: 6.0, kind: "scalecolossus", image: spImg(d.img, d.imgq, d.imgc), meters: d.m, unit: d.unit, eyebrow: d.name, label: d.scl, accent: d.hue });
  ov(third + 0.2, 5.0, { kind: "datestamp", value: d.age, label: d.name, accent: d.hue });
  comps.push({ start: twoThird, dur: 5.2, kind: "stat", ...d.stat, accent: di < 4 ? "accent" : "danger", hue: d.hue });
}
// cierre: timeline + teaser headline
if (tlT != null) comps.push({ start: tlT, dur: 8.5, kind: "timeline", eyebrow: cfg.timeline.eyebrow, title: cfg.timeline.title, events: cfg.timeline.events });
if (proxT != null) comps.push({ start: proxT, dur: 6.0, kind: "headline", tokens: tk(cfg.teaser.tokens), bg: "image", image: spImg(cfg.teaser.img, cfg.teaser.q, cfg.teaser.q), hue: cfg.teaser.hue, size: cfg.teaser.size || 84 });
// ── COMPONENTES ESTRUCTURADOS EXTRA (variedad: journey/bars/cross/annotated/aged/checklist/
//    callout), anclados a frases puntuales del guion. Data en cfg.EXTRA. Le dan al video el
//    salto de "5 componentes repetidos" a un kit rico, con sentido en cada momento. ──
const overlapsComp = (s, d) => comps.some((c) => !c.overlay && s < c.start + c.dur && s + d > c.start);
for (const e of cfg.EXTRA || []) {
  const t0 = atFree(e.at); if (t0 == null) { console.log(`⚠ EXTRA sin anclar: "${e.at}" (${e.kind})`); continue; }
  const { at: _a, dur = 5.5, ...rest } = e;
  let s = t0;
  if (overlapsComp(s, dur)) {
    // pisa un componente de sección → mover JUSTO después del que pisa; si no entra, justo antes; si no, skip
    const hit = comps.filter((c) => !c.overlay && s < c.start + c.dur && s + dur > c.start);
    const after = Math.max(...hit.map((c) => c.start + c.dur)) + 0.3;
    const before = Math.min(...hit.map((c) => c.start)) - dur - 0.3;
    if (!overlapsComp(after, dur)) s = after;
    else if (before > 1 && before > t0 - 14 && !overlapsComp(before, dur)) s = before;
    else { console.log(`⚠ EXTRA ${e.kind} "${e.at}" sin gap libre → skip`); continue; }
  }
  comps.push({ start: s, dur, ...rest });
}
comps.sort((a, b) => a.start - b.start);

// ── COLD-OPEN curado: flash de los clips MÁS DRAMÁTICOS en los primeros COLD s (retención). ──
//   La narración-gancho del inicio es general/teaser ("puertas que no fueron hechas para abrirse…
//   la última podría guardar el mayor tesoro") → mostrar ahí el clímax (oro, ejército, bóveda) calza.
const COLD = +(process.env.COLD_OPEN ?? 13);
const coldCuts = [];
try {
  const MATCH = JSON.parse(fs.readFileSync(`public/broll/match_${slug}.json`, "utf8"));
  const txt = (m) => ((m.concept || "") + " " + (Array.isArray(m.query) ? m.query.join(" ") : "")).toLowerCase();
  const DRAMA = /(gold|treasure|tomb|terracotta|army|sphinx|vault|serpent|snake|skull|mummy|jewel|crown|temple|mercury|ruin|sealed|cave|monument|pyramid|carved|statue|idol|chamber|excavat)/;
  const KEY = /(gold|treasure|terracotta|army|vault|serpent|jewel|crown|mummy|idol)/; // clímax real (oro/ejército/bóveda)
  const dramatic = MATCH.filter((m) => fs.existsSync("public/broll/" + m.name + ".mp4") && DRAMA.test(txt(m)));
  dramatic.sort((a, b) => (KEY.test(txt(b)) ? 1 : 0) - (KEY.test(txt(a)) ? 1 : 0));
  const pick = [];
  for (const m of dramatic) { if (!pick.includes(m.name)) pick.push(m.name); if (pick.length >= 8) break; }
  if (COLD > 0 && pick.length >= 4) {
    const per = COLD / pick.length;
    for (let k = 0; k < pick.length; k++) coldCuts.push({ start: +(k * per).toFixed(2), dur: +per.toFixed(2), name: pick[k] });
    console.log(`cold-open: ${pick.length} clips dramáticos en ${COLD}s → ${pick.join(", ")}`);
  }
} catch { /* sin match list → sin cold-open */ }

// ── DISEÑO DE SONIDO documental: riser+boom en cada apertura de sección/headline, boom en cada número ──
const sfx = [];
for (const c of comps) {
  if (c.kind === "rule" || c.kind === "headline") { sfx.push({ t: +(c.start - 1.2).toFixed(2), src: "sfx/cp_riser.wav", g: 0.5 }); sfx.push({ t: +c.start.toFixed(2), src: "sfx/cp_boom.wav", g: 0.55 }); }
  else if (c.kind === "stat") sfx.push({ t: +c.start.toFixed(2), src: "sfx/cp_boom.wav", g: 0.4 });
  else if (["scalecolossus", "timeline", "journey", "bars", "cross", "annotated", "aged", "checklist", "callout"].includes(c.kind)) sfx.push({ t: +(c.start - 0.4).toFixed(2), src: "sfx/cp_whoosh.wav", g: 0.45 });
}
// cold-open: whoosh de apertura + boom seco y bajo en cada corte del flash de clímax
if (coldCuts.length) { sfx.push({ t: 0.05, src: "sfx/cp_whoosh.wav", g: 0.4 }); for (const cc of coldCuts) sfx.push({ t: +cc.start.toFixed(2), src: "sfx/cp_boom.wav", g: 0.28 }); }
sfx.sort((a, b) => a.t - b.t);
fs.writeFileSync(`src/VideoEdit/sfx_${slug}.json`, JSON.stringify(sfx, null, 1));
const blocked = comps.map((c) => [c.start, c.start + c.dur]);
if (coldCuts.length) blocked.push([0, COLD]); // el cold-open ocupa [0,COLD] → el loop denso no pisa
const inBlocked = (a, b) => blocked.some(([s, e]) => a < e && b > s);
const trimToFree = (a, b) => { for (const [s, e] of blocked) { if (a < e && b > s) { if (a < s) b = Math.min(b, s); else return null; } } return b > a + 0.3 ? [a, b] : null; };

// ── CLIPS DENSOS (1 por cue, SIN reuso). Cada clip disponible se extiende hasta el SIGUIENTE
//    disponible → rellena huecos (frases sin visual) sin repetir ni dejar negros. Recorta componentes. ──
const hasClip = (n) => fs.existsSync("public/broll/" + n + ".mp4");
const avail = CUES.filter((c) => hasClip(c.name)).sort((a, b) => a.start - b.start);
const missing = CUES.length - avail.length;
let placed = 0, segs = 0;
// ── DINAMISMO PAREJO (lección barcos): ningún clip se sostiene > MAXHOLD. Si un hueco (ventanas
//    sin clip) obliga a estirar, se CORTA en trozos alternando clips vecinos (leve reuso > toma estática). ──
const MAXHOLD = +(process.env.MAX_HOLD || 7);
// ── anti-LOOP: nunca repetir el mismo clip dentro de una ventana. Al rellenar un
//    hueco largo, en vez de alternar SOLO los vecinos inmediatos (que hacía que 2-3
//    clips se repitieran visiblemente), se toma el clip disponible MÁS CERCANO que
//    NO se haya usado en los últimos RECENT trozos → variedad real, sin loops. ──
const RECENT = +(process.env.NO_REPEAT || 6);
const recentUsed = [];
const pickDistinct = (i) => {
  // candidatos ordenados por cercanía al hueco (i), saltando los usados recién
  const order = avail.map((c, j) => [j, Math.abs(j - i)]).sort((x, y) => x[1] - y[1]);
  for (const [j] of order) if (!recentUsed.includes(avail[j].name)) { recentUsed.push(avail[j].name); if (recentUsed.length > RECENT) recentUsed.shift(); return avail[j].name; }
  return avail[Math.min(avail.length - 1, Math.max(0, i))].name; // fallback (pool chico)
};
const emitRaw = (a, b, i) => {
  const span = +(b - a).toFixed(2);
  if (span <= 0.1) return;
  const n = Math.max(1, Math.ceil(span / MAXHOLD));
  const piece = span / n;
  for (let k = 0; k < n; k++) {
    // el 1er trozo usa el clip propio del cue (i); los siguientes, clips DISTINTOS del pool
    const src = k === 0 ? avail[Math.min(avail.length - 1, Math.max(0, i))].name : pickDistinct(i + k);
    if (k === 0 && !recentUsed.includes(src)) { recentUsed.push(src); if (recentUsed.length > RECENT) recentUsed.shift(); }
    B.push({ id: nid("c"), start: +(a + k * piece).toFixed(2), dur: +piece.toFixed(2), kind: "raw", src: "broll/" + src + ".mp4", hue: hue4(a) });
    segs++;
  }
};
for (let i = 0; i < avail.length; i++) {
  const c = avail[i];
  const spanEnd = i + 1 < avail.length ? avail[i + 1].start : END;
  // emitir el clip en los sub-intervalos de [c.start, spanEnd] que NO pisan componentes
  let a = c.start;
  for (const [bs, be] of [...blocked, [END + 1, END + 2]].sort((x, y) => x[0] - y[0])) {
    if (be <= a || bs >= spanEnd) continue;
    if (bs > a) emitRaw(a, Math.min(bs, spanEnd), i);
    a = Math.max(a, be);
    if (a >= spanEnd) break;
  }
  if (a < spanEnd) emitRaw(a, spanEnd, i);
  placed++;
}
for (const c of comps) C(c.start, c.dur, c);
// cold-open: cortes rápidos del flash de clímax encima de [0,COLD]
for (const cc of coldCuts) B.push({ id: nid("c"), start: cc.start, dur: cc.dur, kind: "raw", src: "broll/" + cc.name + ".mp4", hue: "cold" });

B.sort((x, y) => x.start - y.start);
// ── PASE FINAL ANTI-LOOP: recorre los beats en orden; si un clip crudo queda
//    VISUALMENTE pegado a otra aparición del MISMO clip (mismo src, sin componente
//    full-screen entre medio), reemplaza el segundo por el clip disponible más
//    cercano que no se usó en los últimos DEDUP beats. Mata el "clip que reinicia". ──
{
  const DEDUP = +(process.env.NO_REPEAT || 6);
  const pool = avail.map((c) => "broll/" + c.name + ".mp4");
  const recent = [];
  let dedup = 0;
  for (const b of B) {
    if (b.overlay) continue;
    if (b.kind !== "raw") { recent.length = 0; continue; } // componente full-screen corta la continuidad
    if (recent.includes(b.src)) {
      // buscar el más cercano en el pool que NO esté en recent
      let best = null, bestD = Infinity;
      const cur = pool.indexOf(b.src);
      for (let j = 0; j < pool.length; j++) if (!recent.includes(pool[j])) { const d = Math.abs(j - (cur < 0 ? 0 : cur)); if (d < bestD) { bestD = d; best = pool[j]; } }
      if (best) { b.src = best; dedup++; }
    }
    recent.push(b.src); if (recent.length > DEDUP) recent.shift();
  }
  if (dedup) console.log(`anti-loop: ${dedup} clips re-asignados (adyacencias iguales eliminadas)`);
}
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${slug}.json`, JSON.stringify({ video: slug, clipsfirst: true, beats: B }, null, 1));
fs.writeFileSync(`public/real/bing_${slug}.json`, JSON.stringify(I, null, 1));
const raws = B.filter((b) => b.kind === "raw").length;
console.log(`beats: ${B.length} · clips REALES únicos: ${placed} (${missing} ventanas sin clip → absorbidas, 0 negros) · segmentos: ${segs} · comp: ${comps.length} · dur ${(END / 60).toFixed(1)}min`);
