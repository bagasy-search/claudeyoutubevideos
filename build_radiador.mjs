// build_radiador.mjs — "El radiador solar casero de $30 que calienta la casa en invierno sin 1 watt".
// Constructor Libre · Claudio Mendoza. Colector solar de aire pasivo (termosifón).
// Assets: presentador IA (Claudio ref) + fotos Pexels reales + clips stock + 45 componentes theme-earth.
// Fuente por momento en _v3/radiador_author.json: presenter/photo -> real/<asset>.png · stock -> broll/<asset>.mp4
//   · avatar (o asset faltante) -> SIN raw beat, el avatar cubre a pantalla completa.
import fs from "fs";
const SLUG = "radiador";
const AVATAR = `${SLUG}_opt.mp4`;
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 8) => { const t = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok); for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; } return null; };
const atc = (p, m) => { const v = at(p, m); if (v == null) console.warn("⚠ anchor missing:", p.slice(0, 55)); return v; };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);

const author = JSON.parse(fs.readFileSync(`_v3/${SLUG}_author.json`, "utf8").replace(/^﻿/, ""));
const exists = (p) => fs.existsSync(`public/${p}`);

// ── Raw beats: cada momento no-avatar con asset EN DISCO. Faltantes -> avatar full. ──
const rawBeats = [];
const avatarMoments = []; // frases donde el avatar va full (avatar src o asset faltante)
let nClip = 0, nImg = 0, nFallback = 0;
for (const m of author) {
  const t = atc(m.phrase); if (t == null) continue;
  if (m.src === "avatar") { avatarMoments.push(m.phrase); continue; }
  const clip = m.asset && exists(`broll/${m.asset}.mp4`);
  const img = m.asset && exists(`real/${m.asset}.png`);
  if (m.src === "stock" && clip) { rawBeats.push({ id: m.asset, start: +t.toFixed(2), kind: "raw", src: `broll/${m.asset}.mp4`, hue: "amber", darken: 0 }); nClip++; }
  else if (img) { rawBeats.push({ id: m.asset, start: +t.toFixed(2), kind: "raw", src: `real/${m.asset}.png`, hue: "amber", darken: 0 }); nImg++; }
  else if (clip) { rawBeats.push({ id: m.asset, start: +t.toFixed(2), kind: "raw", src: `broll/${m.asset}.mp4`, hue: "amber", darken: 0 }); nClip++; }
  else { avatarMoments.push(m.phrase); nFallback++; } // sin asset -> avatar full (nada de 404)
}
rawBeats.sort((x, y) => x.start - y.start);
for (let i = 0; i < rawBeats.length; i++) { const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL; rawBeats[i].dur = +Math.max(0.8, next - rawBeats[i].start + 0.3).toFixed(2); }
const clipRanges = rawBeats.filter((b) => /\.mp4$/.test(b.src)).map((b) => [b.start, b.start + b.dur]);
console.log(`b-roll: ${nClip} clips + ${nImg} imágenes reales · ${nFallback} sin asset -> avatar · avatar-moments ${avatarMoments.length}`);

// ── Componentes premium del plan del DIRECTOR ──
const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });
const _plan = JSON.parse(fs.readFileSync(`_v3_${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const _DUR = { BigStatReveal: 5.4, VsDuel: 6.2, MythTruth: 6.0, HighlightSweep: 5.6, PullQuote: 5.8, NumberedSteps: 6.2, ChecklistReveal: 7.0, BeforeAfter: 6.0, FloatingCutout: 5.6, CutawayCallouts: 6.8, BulletCascade: 5.8, CtaCard: 6.8 };
const PREMIUM = _plan.componentes.map((c) => P(c.comp, c.at, c.dur || _DUR[c.comp] || 5.6, c.zone || "topLeft", c.props || {}, 8));

const beats = [...rawBeats];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) { const s = atc(p.at, p.maxTok); if (s == null) continue; beats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props }); nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1; }
beats.sort((a, b) => a.start - b.start);
{ const used = new Map(); for (const b of beats) { if (b.kind !== "raw") continue; used.set(b.id, (used.get(b.id) || 0) + 1); } const dups = [...used.entries()].filter(([, c]) => c > 1); if (dups.length) { console.error("✖ REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); } }
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, maxRawDur: 6, beats }, null, 1));

// ── Ventanas del avatar (full ↔ hidden). Hook + avatar-moments + periódico + cierre. ──
const HOOK_END = 9, PERIOD = 20, SLOT = 4, SEARCH = 15;
const comps = [...beats.filter((b) => b.kind === "premium").map((b) => [b.start, b.start + (b.dur || 3)]), ...clipRanges];
const overlapsComp = (a, b) => comps.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const fulls = [[0, snapWord(HOOK_END)]];
for (const ph of avatarMoments) { const s = atc(ph); if (s == null) continue; if (/manual|reparaciones|colecci|descripci|enlace|link|me gusta|suscribite|campanita|comentarios/i.test(ph)) continue; const e = snapWord(s + 4.2); if (!overlapsComp(s, e)) fulls.push([+s.toFixed(2), e]); }
for (let target = HOOK_END + PERIOD; target < TOTAL - 12; target += PERIOD) { for (let t = target; t < target + SEARCH; t += 0.5) { const s = snapWord(t), e = snapWord(s + SLOT); if (e - s >= 3 && e - s <= 6 && !overlapsComp(s, e)) { fulls.push([s, e]); break; } } }
const csw = snapWord(TOTAL - 8); if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
fulls.sort((a, b) => a[0] - b[0]);
const windows = []; let cursor = 0;
for (const [s, e] of fulls) { if (s > cursor + 0.2) windows.push({ start: +cursor.toFixed(2), mode: "hidden" }); windows.push({ start: +s.toFixed(2), mode: "full" }); cursor = Math.max(cursor, e); }
if (cursor < TOTAL - 0.1) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avPct = Math.round(windows.filter((w) => w.mode === "full").length);
console.log(`beats ${beats.length} (raw ${rawBeats.length}) · premium ${nOv} · tipos ${Object.keys(compCount).length} · ${(TOTAL / 60).toFixed(1)}min · ventanas full ${avPct}`);
console.log(JSON.stringify(compCount));
