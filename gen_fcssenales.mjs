// gen_fcssenales.mjs — beatsheet/fcssenales.json · Canal "Federer Consejos Salud"
// "MANCHAS Sin Razón: Tu Cuerpo Te Grita Algo Grave". Kit CLÍNICO _fed6.
//
// ⛔ PARTICULARIDAD DE ESTE VIDEO: AVATAR PARCIAL.
//    El creador grabó sólo 0..900.245s. De ahí en adelante la voz es Fish y los LABIOS NO
//    SINCRONIZAN → en la ZONA FISH el avatar no puede quedar a la vista: cada momento se
//    cubre al 100% (el clip de agnes dura ~5s; la cola del momento la tapa su foto de respaldo).
//    En la ZONA AVATAR sí se deja respirar al avatar en los huecos (~15% de pantalla).
import fs from "fs";
import { spawnSync } from "child_process";
import { CMP2 } from "./_cmp2_fcssenales.mjs";
import { CMP3 } from "./_cmp3_fcssenales.mjs";

const SLUG = "fcssenales";
const VIDEO_END = 3152.2;        // master = 3152.106s
const AVATAR_END = 900.245;      // costura: fin del avatar real
const HERO_CAP = 3.6;

const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};
const has = (p) => fs.existsSync("public/" + p);

// ── captions (anclaje por frase) ──────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
// ⛔ filtrar tokens VACÍOS: Whisper emite "%" como token propio y norm() lo deja en "".
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const findMs = (phrase, after = 0) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 7);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {   // ⛔ <= : con < se pierde el ULTIMO componente
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

// ── momentos del DIRECTOR ─────────────────────────────────────────────────────
const MOM = JSON.parse(fs.readFileSync(`_${SLUG}_moments.json`, "utf8"));
const DIR = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));
const kindOf = new Map(DIR.map((d) => [d.name, d.mediakind]));

const N = MOM.length;
const start = MOM.map((m) => m.ms);
const nextStart = (i) => (i + 1 < N ? start[i + 1] : VIDEO_END);
const DARK = new Set(JSON.parse(fs.existsSync(`_${SLUG}_dark.json`) ? fs.readFileSync(`_${SLUG}_dark.json`, "utf8") : "[]"));

// ── capa de contenido: clip real, foto, o foto de respaldo del clip ───────────
const beats = [], BROLL = [], COVER = [];
let nClip = 0, nFoto = 0, nBk = 0, nCola = 0, nVacio = 0;

for (let i = 0; i < N; i++) {
  const m = MOM[i];
  const st = start[i];
  const slot = +(nextStart(i) - st).toFixed(2);
  const esVideo = kindOf.get(m.n) === "video";
  const clip = `broll/${SLUG}_${m.n}.mp4`;
  const foto = `img/${SLUG}_${m.n}.png`;
  const bk = `img/${SLUG}_${m.n}_bk.png`;

  if (esVideo && has(clip) && !DARK.has(m.n)) {
    const real = probeDur("public/" + clip) || 5.0;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.1)).toFixed(2);
    beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, key: "s", kind: "raw", src: clip });
    BROLL.push({ name: m.n, src: clip, start: +st.toFixed(2), dur: slot, cov, query: m.text.slice(0, 70) });
    COVER.push({ start: +st.toFixed(2), cov, kind: "video", src: clip });
    nClip++;
    // COLA: lo que el clip no llena. En ZONA FISH es obligatorio (el avatar no puede verse).
    const resto = +(slot - cov).toFixed(2);
    if (resto > 0.25 && (st >= AVATAR_END || resto < 1.6)) {
      const src = has(bk) ? bk : has(foto) ? foto : null;
      if (src) {
        const ts = +(st + cov).toFixed(2);
        // en la ZONA FISH la cola tiene que tapar TODO lo que le queda al momento (el avatar no
        // puede asomar); en la zona avatar se topa cortita porque ahí el avatar SÍ puede respirar.
        const tcov = +Math.min(resto, st >= AVATAR_END ? 11 : HERO_CAP + 2).toFixed(2);
        beats.push({ id: m.n + "_t", start: ts, dur: resto, key: "s", kind: "raw", src, cov: tcov });
        COVER.push({ start: ts, cov: tcov, kind: "photo", src });
        nCola++;
      }
    }
  } else {
    const src = has(foto) ? foto : has(bk) ? bk : null;
    if (!src) { nVacio++; continue; }   // sin asset: en zona avatar el avatar cubre (a propósito)
    if (!has(foto)) nBk++; else nFoto++;
    let cov = st >= AVATAR_END ? Math.min(slot, 11) : Math.min(slot, HERO_CAP);
    if (st < AVATAR_END && slot - cov > 0.05 && slot - cov < 1.6) cov = slot;   // sin micro-huecos
    // ⛔ ZONA FISH: los labios NO sincronizan, el avatar no puede asomar. Si lo que queda del
    // slot es un resto chico, la foto lo estira; si es grande, igual se topa en 11s (plano muerto).
    if (st >= AVATAR_END && slot - cov > 0.05 && slot - cov < 3) cov = slot;
    cov = +cov.toFixed(2);
    beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, key: "s", kind: "raw", src, cov });
    COVER.push({ start: +st.toFixed(2), cov, kind: "photo", src });
  }
}

// ── COMPONENTES premium, anclados a la FRASE real ────────────────────────────
const G = (n) => {
  const a = `img/${SLUG}_${n}.png`, b = `img/${SLUG}_${n}_bk.png`;
  return has(a) ? a : has(b) ? b : a;
};
const OVERLAY_K = new Set(["lowerthird", "frasecinetica"]);
const capOfDur = { avatarpizarra: 9, mitoverdad: 6, bars: 6.5, splitlist: 9, checklist: 9, lowerthird: 6,
  frasecinetica: 5.5, nametag: 6, process: 9, callout: 6, diagram: 10, errorstinger: 2.4, guardaesto: 8,
  freezezoom: 4.5, pizarraexplica: 8.5, relojnoche: 11, whynight: 10, pricewar: 8, ingredientduo: 6.5,
  hourdial: 6, guidecta: 9, headline: 5, quote: 8, rule: 5, chips: 7, ingredients: 9, annotated: 7, stat: 6,
  ring3d: 7, triptych: 10, depthphoto: 7, glasstest: 9, skinlayers: 11, bodymap: 12, plateorder: 11, beforeafter: 8 };
const TODOS = [...CMP2(G), ...CMP3(G)];
const missing = [], cmpBeats = [];
for (let k = 0; k < TODOS.length; k++) {
  const spec = TODOS[k];
  const ms = findMs(spec.phrase, 0);
  if (ms == null) { missing.push(spec.phrase); continue; }
  const { phrase, ...rest } = spec;
  cmpBeats.push({ id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest });
}

// post-pass pizarra (items al ms) + mitoverdad flip
const KIT_CLIPS = [];
for (const b of cmpBeats) {
  if (b.kind === "avatarpizarra") {
    let last = 0;
    b.items = (b.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, b.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - b.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...r } = it; return { ...r, at: atF };
    });
    if (last > 420 || last === 0) { b.items = b.items.map((it, i) => ({ ...it, at: i * 90 })); last = (b.items.length - 1) * 90; }
    b.dur = +(last / 30 + 4.2).toFixed(2);
    KIT_CLIPS.push({ name: b.id, start: +b.start.toFixed(2), dur: +(b.dur + 0.4).toFixed(2) });
  }
  if (b.kind === "mitoverdad" && b.flipPhrase) {
    const ms = findMs(b.flipPhrase, b.start - 1);
    const lastSafe = Math.round(b.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - b.start) * 30) : Math.round(b.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(b.dur * 30 * 0.42);
    b.flipAt = f; delete b.flipPhrase;
  }
}
cmpBeats.sort((a, b) => a.start - b.start);

// ⛔ COLISIONES: `compDur` recorta un componente hasta donde arranca el SIGUIENTE. En el primer
// render eso dejó al anillo 3D, al tríptico, al mapa del cuerpo y al orden del plato en 2 s
// (empezaban y desaparecían). Las escenas grandes mandan: el componente chico que caiga adentro
// de su ventana mínima se descarta.
{
  const PREMIUM = new Set(["ring3d", "triptych", "depthphoto", "glasstest", "skinlayers", "bodymap",
    "plateorder", "beforeafter", "avatarpizarra", "guidecta", "pizarraexplica", "process"]);
  const MIN = { ring3d: 6.5, triptych: 9, depthphoto: 6.5, glasstest: 8.5, skinlayers: 10.5, bodymap: 11,
    plateorder: 10.5, beforeafter: 7.5, avatarpizarra: 6, guidecta: 8.5, pizarraexplica: 8, process: 8 };
  const drop = new Set();
  for (let i = 0; i < cmpBeats.length; i++) {
    const b = cmpBeats[i];
    if (!PREMIUM.has(b.kind) || drop.has(i)) continue;
    const need = Math.min(MIN[b.kind] ?? 6, capOfDur[b.kind] ?? 6);
    for (let j = i + 1; j < cmpBeats.length; j++) {
      const o = cmpBeats[j];
      if (o.start >= b.start + need) break;
      if (OVERLAY_K.has(o.kind)) continue;          // los overlay van ENCIMA, no molestan
      if (PREMIUM.has(o.kind) && (MIN[o.kind] ?? 6) > need) { drop.add(i); break; }
      drop.add(j);
    }
  }
  if (drop.size) {
    const fuera = [...drop].map((i) => `${cmpBeats[i].kind}@${cmpBeats[i].start}`);
    console.log(`⚠ ${drop.size} componentes descartados por chocar con una escena premium: ${fuera.slice(0, 10).join(" ")}`);
    for (let i = cmpBeats.length - 1; i >= 0; i--) if (drop.has(i)) cmpBeats.splice(i, 1);
  }
}
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const U = SLUG.toUpperCase();
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; cov: number; query: string }[] = ${JSON.stringify(BROLL)};\n` +
  `export const ${U}_COVER: { start: number; cov: number; kind: string; src: string }[] = ${JSON.stringify(COVER)};\n` +
  `export const AVATAR_END = ${AVATAR_END};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA ────────────────────────────────────────────────────────────────────────
const kinds = {}; cmpBeats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const need = new Set(); ALL.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (b.cover) need.add(b.cover); if (b.qr) need.add(b.qr); if (b.leftImage) need.add(b.leftImage); if (b.rightImage) need.add(b.rightImage); if (b.leftImg) need.add(b.leftImg); if (b.rightImg) need.add(b.rightImg); (b.items || []).forEach((s) => s && s.image && need.add(s.image)); });
const miss = [...need].filter((p) => !has(p));
const cov = COVER.filter((c) => c.start + c.cov > AVATAR_END).map((c) => [Math.max(c.start, AVATAR_END), c.start + c.cov]).sort((a, b) => a[0] - b[0]);
let libre = 0, t = AVATAR_END;
for (const [s, e] of cov) { if (s > t) libre += s - t; t = Math.max(t, e); }
if (t < VIDEO_END) libre += VIDEO_END - t;

console.log(`momentos ${N} · clips ${nClip} · fotos ${nFoto} · respaldos ${nBk} · colas ${nCola} · sin asset ${nVacio}`);
console.log(`componentes ${cmpBeats.length} de ${TODOS.length} · kinds ${Object.keys(kinds).length}: ${Object.entries(kinds).map(([k, v]) => k + "×" + v).join(" ")}`);
console.log(`ZONA FISH sin cubrir por b-roll/fotos: ${libre.toFixed(1)}s (lo tapan los componentes)`);

// ── ⛔ COMPUERTA ANTI-HUECO: simula el MISMO buildWindows del Main ────────────
{
  const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
  const NOCAP = new Set(["avatarpizarra"]);
  const capOf = (k) => capOfDur[k] ?? 6;
  const compDur = (b) => {
    if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
    const nx = cmpBeats.filter((x) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a, c) => a.start - c.start)[0];
    const room = nx ? nx.start - b.start - 0.1 : b.dur;
    return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
  };
  // ⛔ MISMA lógica que el Main: unión de coberturas (ver el comentario allá).
  const ivs = [];
  for (const c of COVER) ivs.push({ a: c.start, b: +(c.start + c.cov).toFixed(2), solo: c.kind === "video" && c.start + c.cov < AVATAR_END });
  for (const b of cmpBeats) { if (OVERLAY.has(b.kind)) continue; ivs.push({ a: b.start, b: +(b.start + compDur(b)).toFixed(2), solo: false }); }
  ivs.sort((x, y) => x.a - y.a);
  const merged = [];
  for (const iv of ivs) {
    const last = merged[merged.length - 1];
    if (last && iv.a <= last.b + 0.02) { last.b = Math.max(last.b, iv.b); last.solo = last.solo && iv.solo && iv.a >= last.a - 0.02; }
    else merged.push({ ...iv });
  }
  const win = [{ start: 0, mode: "full" }];
  let flip = false;
  for (const m of merged) {
    const puedeSplit = m.solo && m.b < AVATAR_END;
    win.push({ start: m.a, mode: puedeSplit && flip ? "halfR" : "hidden" });
    if (puedeSplit) flip = !flip;
    win.push({ start: m.b, mode: "full" });
  }
  const post = win.filter((w) => w.start < 1.4 || w.start >= 7.0);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  const res = win.filter((w) => w.start < 7.0).pop();
  post.push({ start: 7.0, mode: res && res.start >= 1.4 ? "hidden" : (res?.mode ?? "full") });
  post.sort((a, b) => a.start - b.start);
  const W = []; for (const x of post) if (!W.length || W[W.length - 1].mode !== x.mode) W.push(x);

  const cubre = (t) => COVER.some((c) => t >= c.start - 0.02 && t < c.start + c.cov)
    || cmpBeats.some((b) => !OVERLAY.has(b.kind) && t >= b.start && t < b.start + compDur(b));
  const modo = (t) => { let m = "full"; for (const w of W) { if (w.start <= t) m = w.mode; else break; } return m; };
  const huecos = [];
  for (let t = 0.2; t < VIDEO_END; t += 0.2) {
    if (t < 7.0) continue;
    if (modo(t) !== "full" && !cubre(t)) {
      const u = huecos[huecos.length - 1];
      if (u && t - u[1] < 0.35) u[1] = t; else huecos.push([t, t]);
    }
  }
  // cuánto se ve el avatar (meta ~15% en zona avatar, ~0% en zona Fish)
  let avFull = 0, avFullFish = 0;
  for (let t = 0.2; t < VIDEO_END; t += 0.2) {
    if (modo(t) === "full" && !cubre(t)) { avFull += 0.2; if (t >= AVATAR_END) avFullFish += 0.2; }
  }
  const grandes = huecos.filter((h) => h[1] - h[0] >= 0.3);
  const totalH = huecos.reduce((a, h) => a + (h[1] - h[0] + 0.2), 0);
  console.log(`ANTI-HUECO: ${huecos.length} huecos (${grandes.length} de >=0.3s) · ${totalH.toFixed(1)}s totales`);
  for (const h of grandes.slice(0, 10)) console.log(`   ${h[0].toFixed(2)}s .. ${h[1].toFixed(2)}s`);
  console.log(`AVATAR a la vista: ${(avFull / VIDEO_END * 100).toFixed(1)}% del video · en ZONA FISH ${avFullFish.toFixed(0)}s (tiene que ser ~0)`);
  fs.writeFileSync(`_${SLUG}_huecos.json`, JSON.stringify(huecos.map((h) => [+h[0].toFixed(2), +(h[1] + 0.2).toFixed(2)])));
}

console.log(`assets: ${need.size} · FALTAN ${miss.length}${miss.length ? " → " + miss.slice(0, 8).join(" ") : ""}`);
if (missing.length) console.log(`⚠ COMPONENTES SIN ANCLA (${missing.length}): ${missing.join(" | ")}`);
