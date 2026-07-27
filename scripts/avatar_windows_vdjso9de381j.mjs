// avatar_windows_vdjso9de381j.mjs — espejo EXACTO de buildWindows() de Main_vdjso9de381j.tsx.
// Emite _avatar_windows_vdjso9de381j.json (lo consume gate_shim → density_gate mide la bata).
// Si tocás buildWindows en el Main, tocá esto también o el gate mide otra cosa que la que se rendea.
import fs from "fs";

const SLUG = "vdjso9de381j";
const BEATS = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
const BROLL = JSON.parse(fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));
const TALKSZ = JSON.parse(fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));

const COMP2 = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "process", "ingredients", "annotated", "diagram", "rule", "nametag", "blurexplainer", "pizarra", "bars", "callout", "board"]);
const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "focuscards"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword", "focuscards"]);
const isComp = (k) => COMP2.has(k) || NEWFULL.has(k) || OVERLAY.has(k);
const HERO_CAP = 3.6;
const capOf = (k) =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2.4 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = BEATS.filter((b) => isComp(b.kind));
const rawTop = BEATS.filter((b) => b.kind === "raw" && /^(img|vid|broll)\//.test(b.src || ""));
const VIDEO_END = Math.max(...BEATS.map((b) => b.start + b.dur), BROLL.length ? BROLL[BROLL.length - 1].start + BROLL[BROLL.length - 1].dur : 0) + 1.2;

const compDur = (b) => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a, c) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  const want = Math.max(2, Math.min(b.dur, capOf(b.kind), room));
  return next && next.start - (b.start + want) < 1.2 ? Math.max(want, next.start - b.start - 0.1) : want;
};

function buildWindows() {
  const pts = [];
  const content = [...BROLL.map((b) => ({ start: b.start })), ...rawTop.map((b) => ({ start: b.start }))].sort((a, b) => a.start - b.start);
  for (const b of content) pts.push({ start: b.start, mode: "hidden", pr: 0 });
  for (const b of compBeats) { const d = compDur(b); pts.push({ start: b.start, mode: "hidden", pr: 3 }); pts.push({ start: b.start + d, mode: "hidden", pr: 1 }); }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);
  const w = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s) => TALKSZ.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) { const mode = p.pr < 3 && talkAt(p.start) ? "full" : p.mode; if (mode !== last) { w.push({ start: p.start, mode }); last = mode; } }
  for (const t of TALKSZ) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "hidden" }); }
  w.sort((a, b) => a.start - b.start);
  const coll = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }
  const HOOK_FULL = 2.4, HOOK_END = 8.0;
  const post = coll.filter((wn) => wn.start < HOOK_FULL || wn.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: HOOK_FULL, mode: "hidden" });
  const resume = coll.filter((wn) => wn.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= HOOK_FULL ? "hidden" : (resume?.mode ?? "hidden") });
  post.sort((a, b) => a.start - b.start);
  const out = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  const cov = [];
  for (const b of BROLL) cov.push([b.start, b.start + b.dur + 0.2]);
  for (const b of rawTop) cov.push([b.start, b.start + Math.min(b.dur, HERO_CAP) + 0.2]);
  for (const b of compBeats) if (!OVERLAY.has(b.kind)) cov.push([b.start, b.start + compDur(b) + 0.2]);
  cov.sort((a, c) => a[0] - c[0]);
  const merged = [];
  for (const [s, e] of cov) { const l = merged[merged.length - 1]; if (l && s <= l[1] + 1.3) l[1] = Math.max(l[1], e); else merged.push([s, e]); }
  const gaps = [];
  let prev = 0;
  for (const [s, e] of merged) { if (s - prev > 1.3) gaps.push([prev, s]); prev = Math.max(prev, e); }
  if (VIDEO_END - prev > 1.3) gaps.push([prev, VIDEO_END]);
  const modeAt = (t) => { let m = out[0].mode; for (const wd of out) { if (wd.start <= t + 1e-6) m = wd.mode; else break; } return m; };
  const inGap = (t) => t >= HOOK_END && gaps.some(([s, e]) => t >= Math.max(s, HOOK_END) - 1e-6 && t < e - 1e-6);
  const bounds = new Set(out.map((wd) => wd.start));
  for (const [s, e] of gaps) { if (e <= HOOK_END) continue; bounds.add(+Math.max(s, HOOK_END).toFixed(2)); bounds.add(+e.toFixed(2)); }
  const sb = [...bounds].sort((a, b) => a - b);
  const out2 = [];
  for (const t of sb) { const mode = inGap(t) ? "full" : modeAt(t); if (!out2.length || out2[out2.length - 1].mode !== mode) out2.push({ start: t, mode }); }
  // ── PRESENCIA: un regreso a la cara de 2s es un corte más, no presencia. Los tramos FULL cortos
  // se estiran hasta 4.4s, pero SOLO comiéndose el hueco siguiente (nunca encadenando pases: eso
  // se tragaba el video entero y dejaba 69% de bata).
  const MINFULL = 4.4;
  const finOf = (arr, i) => (i + 1 < arr.length ? arr[i + 1].start : VIDEO_END);
  const ext = [];
  for (let i = 0; i < out2.length; i++) {
    const wnd = out2[i];
    ext.push(wnd);
    if (wnd.mode !== "full") continue;
    const d = finOf(out2, i) - wnd.start;
    if (d >= MINFULL || i + 1 >= out2.length) continue;
    const nextEnd = finOf(out2, i + 1);
    const target = Math.min(wnd.start + MINFULL, nextEnd - 0.6);
    if (target > out2[i + 1].start + 0.2) { ext.push({ start: +target.toFixed(2), mode: out2[i + 1].mode }); i++; }
  }
  const fin2 = [];
  for (const x of ext) { if (!fin2.length || fin2[fin2.length - 1].mode !== x.mode) fin2.push(x); }
  return fin2;
}

const W = buildWindows();
fs.writeFileSync(`_avatar_windows_${SLUG}.json`, JSON.stringify(W, null, 1));
const tramos = [];
for (let i = 0; i < W.length; i++) { if (W[i].mode !== "full") continue; const fin = i + 1 < W.length ? W[i + 1].start : VIDEO_END; if (fin > W[i].start) tramos.push(fin - W[i].start); }
const tot = tramos.reduce((a, b) => a + b, 0);
const med = tramos.length ? [...tramos].sort((a, b) => a - b)[Math.floor(tramos.length / 2)] : 0;
console.log(`ventanas: ${W.length} · avatar FULL ${tot.toFixed(0)}s = ${((tot / VIDEO_END) * 100).toFixed(0)}% · ${tramos.length} tramos · mediana ${med.toFixed(1)}s`);
console.log(`VIDEO_END ${VIDEO_END.toFixed(1)}s = ${Math.round(VIDEO_END * 30)} frames`);
