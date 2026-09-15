// gen_nightwater60.mjs — build · Canal "Dr. Federer — The Nightly Remedy" (EN)
// "After 60: If Your Legs Swell or Feel Cold, It's Not Age — A Doctor Explains"
// Arquitectura: <Audio> máster Fish (voz del canal) + avatar InfiniteTalk/RunPod SOLO en las ventanas
// visibles (reel recortado con trimBefore) + base de fotos/clips anclada al ms + componentes _fed6.
// ⛔ el avatar sólo puede verse DENTRO de su ventana (fuera de ella no hay lipsync generado).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "nightwater60";
const FPS = 30;
const F = (s) => Math.round(s * FPS);
const has = (p) => fs.existsSync("public/" + p);
const FP = "ffprobe";
const probe = (p, what) => spawnSync(FP, ["-v", "error", ...what, "-of", "csv=p=0", p], { encoding: "utf8" }).stdout.trim();
const WAV_S = parseFloat(probe(`public/nw/${SLUG}.wav`, ["-show_entries", "format=duration"]));
const VIDEO_END = +(WAV_S + 0.4).toFixed(3);

const SCRIPT = fs.readFileSync(`_v3/${SLUG}_script.txt`, "utf8");
const WMS = JSON.parse(fs.readFileSync(`_v3/${SLUG}_wordms.json`, "utf8"));
const WIN = JSON.parse(fs.readFileSync("_v3/nw/nw_windows.json", "utf8")).windows;
const SPECS = [JSON.parse(fs.readFileSync("_v3/nw/spec_t1.json", "utf8")), JSON.parse(fs.readFileSync("_v3/nw/spec_t2.json", "utf8"))];

// ── frase → ms (ubicada en el GUION, que no tiene sorpresas; el ms sale del mapa palabra↔ASR) ──
const charToMs = (c) => { let lo = 0, hi = WMS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (WMS[m].c <= c) lo = m; else hi = m - 1; } return WMS[lo].s; };
const miss = [];
const msOf = (p, fromChar = 0) => {
  let i = SCRIPT.indexOf(p, fromChar);
  if (i < 0) i = SCRIPT.indexOf(p);
  if (i < 0) { miss.push(p); return null; }
  return { ms: charToMs(i), c: i };
};

// ── apertura: el avatar habla solo hasta el fin de la 1ª oración (piso 3 s) ──
const APERTURA = Math.max(3, charToMs(SCRIPT.indexOf("It's the clock.")) - 0.1);

// ── momentos (fotos/clips) ────────────────────────────────────────────────
const assetOf = (n) => {
  if (has(`nw/broll/${n}.mp4`)) return { kind: "clip", src: `nw/broll/${n}.mp4` };
  if (has(`nw/img/${n}.jpg`)) return { kind: "foto", src: `nw/img/${n}.jpg` };
  return null;
};
const moments = [];
for (const S of SPECS) {
  let cur = 0;
  for (const m of [...S.moments, ...(S.diagrams || []), ...(S.extras || []).map((e) => ({ ...e, extra: true }))]) {
    if (m.extra) cur = 0;
    const r = msOf(m.p, cur); if (!r) continue; cur = r.c;
    const a = assetOf(m.n); if (!a) { miss.push(`(sin asset) ${m.n}`); continue; }
    moments.push({ n: m.n, p: m.p, t: Math.max(APERTURA, r.ms), ...a });
  }
}
moments.sort((a, b) => a.t - b.t);

const inWin = (t) => WIN.find((w) => t >= w.start && t < w.end - 0.05);

// ── base: cada momento dura hasta el próximo; dentro de una ventana se acorta y vuelve el avatar ──
const CAP_OUT = 9.5, CAP_IN = [3.4, 4.6, 3.8, 5.2, 4.2];
const cues = [];
for (let i = 0; i < moments.length; i++) {
  const m = moments[i], next = i + 1 < moments.length ? moments[i + 1].t : VIDEO_END;
  const w = inWin(m.t);
  let end = w ? Math.min(next, m.t + CAP_IN[i % CAP_IN.length], w.end) : Math.min(next, m.t + CAP_OUT);
  if (!w) { const nw = WIN.find((x) => x.start > m.t && x.start < end); if (nw) end = Math.max(m.t + 2.2, Math.min(end, nw.start)); }
  if (end - m.t < 1.2) end = Math.min(next, m.t + 1.2);
  cues.push({ ...m, start: m.t, end });
}
// huecos: avatar si hay ventana; si no, estirar el plano anterior o repetir el siguiente
const base = [];
let t = 0;
const pushAvatarOrStretch = (a, b) => {
  let x = a;
  while (x < b - 1e-3) {
    const w = inWin(x);
    if (w) {
      const e = Math.min(b, w.end);
      // out_start = dónde cayó REALMENTE la ventana en el mp4 de RunPod (medido por correlación:
      // RunPod recorta ~99 ms cada pocas ventanas → sin esto los labios quedan hasta 0,3 s corridos)
      base.push({ kind: "avatar", start: x, end: e, trim: F((w.out_start ?? w.reel_start) + (x - w.start)) });
      x = e; continue;
    }
    const nw = WIN.find((q) => q.start > x && q.start < b);
    const e = nw ? nw.start : b;
    const prev = base[base.length - 1];
    if (prev && prev.kind !== "avatar") prev.end = e;
    else {
      const nx = cues.find((c) => c.start >= e - 0.01) || cues[cues.length - 1];
      base.push({ ...nx, start: x, end: e, n: nx.n + "_pre" });
    }
    x = e;
  }
};
for (const c of cues) {
  if (c.start > t + 0.02) pushAvatarOrStretch(t, c.start);
  base.push({ ...c, start: Math.max(c.start, t) });
  t = Math.max(t, c.end);
}
if (t < VIDEO_END) pushAvatarOrStretch(t, VIDEO_END);

// fusionar consecutivos del mismo asset y alinear al frame (fronteras exactas, sin huecos de 1 frame)
const fused = [];
for (const b of base) {
  const u = fused[fused.length - 1];
  if (u && u.kind !== "avatar" && u.src === b.src && Math.abs(u.end - b.start) < 0.05) { u.end = b.end; continue; }
  if (u && u.kind === "avatar" && b.kind === "avatar" && Math.abs(u.end - b.start) < 0.05 && Math.abs((u.trim + F(u.end - u.start)) - b.trim) <= 1) { u.end = b.end; continue; }
  fused.push({ ...b });
}
for (let i = 0; i < fused.length; i++) {
  fused[i].f0 = F(fused[i].start);
  fused[i].f1 = i + 1 < fused.length ? F(fused[i + 1].start) : F(VIDEO_END);
}
// ── partir planos largos: la 2ª parte muestra el MISMO momento en la otra forma (clip↔foto) o un
//    vecino cercano; nunca dos veces seguidas el mismo archivo. Ritmo variado, no metrónomo.
const LONG = F(7.5), PART = [5.4, 4.1, 6.3, 3.6, 5.0, 4.6];
const altOf = (b) => {
  if (b.kind === "clip" && has(`nw/img/${b.n}.jpg`)) return { kind: "foto", src: `nw/img/${b.n}.jpg`, n: b.n };
  if (b.kind === "foto" && has(`nw/broll/${b.n}.mp4`)) return { kind: "clip", src: `nw/broll/${b.n}.mp4`, n: b.n };
  return null;
};
const neighbor = (t, avoid) => {
  const c = moments.filter((m) => !avoid.includes(m.src)).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
  return c ? { kind: c.kind, src: c.src, n: c.n } : null;
};
const split = [];
let pk = 0;
for (const b of fused.filter((x) => x.f1 > x.f0)) {
  const dur = b.f1 - b.f0;
  if (b.kind === "avatar" || dur <= LONG) { split.push(b); continue; }
  let f = b.f0, form = { kind: b.kind, src: b.src, n: b.n }, used = [b.src];
  while (f < b.f1) {
    let len = F(PART[pk++ % PART.length]);
    if (b.f1 - f < len + F(2.2)) len = b.f1 - f;
    split.push({ ...b, ...form, f0: f, f1: f + len });
    f += len;
    const prevSrc = form.src;
    const alt = altOf(form);
    form = alt && alt.src !== prevSrc ? alt : (neighbor((f / FPS), [prevSrc, ...used.slice(-2)]) || form);
    used.push(form.src);
  }
}
// anti-repetición: dos cues seguidos con el mismo archivo → el 2º pasa a la otra forma o a un vecino
for (let i = 1; i < split.length; i++) {
  const a = split[i - 1], b = split[i];
  if (a.kind === "avatar" || b.kind === "avatar" || a.src !== b.src) continue;
  const nx = split[i + 1];
  const alt = altOf(b);
  const rep = alt && (!nx || alt.src !== nx.src) ? alt : neighbor(b.f0 / FPS, [a.src, nx?.src].filter(Boolean));
  if (rep) Object.assign(b, rep);
}
const BASE = split.map((b) => {
  const o = { kind: b.kind, from: b.f0, dur: b.f1 - b.f0, seed: b.f0 };
  if (b.kind === "avatar") o.trim = b.trim; else { o.src = b.src; o.n = b.n; }
  if (b.kind === "clip") o.frames = parseInt(probe("public/" + b.src, ["-count_packets", "-select_streams", "v", "-show_entries", "stream=nb_read_packets"])) || 0;
  return o;
});
{ let rep = 0; for (let i = 1; i < BASE.length; i++) if (BASE[i].src && BASE[i].src === BASE[i - 1].src) rep++; console.log(`  pares consecutivos con el mismo archivo: ${rep}`); }

// ── componentes ─────────────────────────────────────────────────────────────
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const CAP = { datoimpacto: 6.5, mitoverdad: 8, checklist: 11, lowerthird: 6, frasecinetica: 5, errorstinger: 3.2, freezezoom: 9, lineatiempo: 11, laminacta: 30 };
const COMPS = [];
for (const S of SPECS) {
  let cur = 0;
  for (const c of S.comps) {
    if (c.kind === "guidecta") continue; // se reemplaza por laminacta (la lámina SIGUE visible)
    const r = msOf(c.p, cur); if (!r) continue; cur = r.c;
    const { p, ...rest } = c;
    COMPS.push({ ...rest, t: r.ms, c: r.c });
  }
}
// CTA sobre la lámina: desde "everything on this page" hasta el fin de "while the page is still up."
{
  const a = msOf("everything on this page, I pulled straight out");
  const endC = SCRIPT.indexOf("while the page is still up.") + "while the page is still up.".length;
  const endMs = WMS.filter((w) => w.c < endC).slice(-1)[0].e + 0.8;
  COMPS.push({ kind: "laminacta", t: a.ms, fixedEnd: endMs, image: "nw/img/nw_lamina.jpg", cover: "nw/img/nw_cover.jpg", qr: "nw/img/nw_qr.png", domain: "docfederer.com" });
}
COMPS.sort((a, b) => a.t - b.t);
for (let i = 0; i < COMPS.length; i++) {
  const c = COMPS[i];
  if (c.kind === "mitoverdad" && c.flipPhrase) {
    const r = msOf(c.flipPhrase, c.c || 0); c.flipAt = r ? Math.max(8, F(r.ms - c.t)) : undefined; delete c.flipPhrase;
  }
  const nextFull = COMPS.slice(i + 1).find((x) => !OVERLAY.has(x.kind));
  let d = c.fixedEnd ? c.fixedEnd - c.t : CAP[c.kind] || 6;
  if (!OVERLAY.has(c.kind) && nextFull) d = Math.min(d, nextFull.t - c.t - 0.05);
  // piso de LECTURA por texto: 2,0 s overlay / 2,8 s full + 0,28 s por palabra más allá de 3
  const txt = [c.title, c.myth, c.truth, c.label, c.desc, ...(c.items || []).map((x) => x.text), ...(c.words || []).map((x) => x.t)].filter(Boolean).join(" ");
  const nw = txt.split(/\s+/).filter(Boolean).length;
  const piso = (OVERLAY.has(c.kind) ? 2.0 : 2.8) + 0.28 * Math.max(0, nw - 3);
  if (d < Math.min(piso, CAP[c.kind] || 6)) d = OVERLAY.has(c.kind) ? Math.min(piso, CAP[c.kind] || 6) : d;
  c.from = F(c.t); c.dur = Math.max(F(1.2), F(d)); delete c.c; delete c.fixedEnd;
  // MitoRevelado recorta flipAt al 75 % de la duración: si la frase del giro cae tarde, la VERDAD
  // se ve < 2 s. El giro va al 42 % para que la verdad quede ~4,5 s en pantalla (tiempo de lectura).
  if (c.kind === "mitoverdad") c.flipAt = Math.min(c.flipAt ?? Infinity, Math.round(c.dur * 0.42));
}

// ── COMPUERTAS ──────────────────────────────────────────────────────────────
let fail = 0;
const say = (ok, msg) => { console.log(`${ok ? "✓" : "✗"} ${msg}`); if (!ok) fail++; };
console.log(`midió: ${moments.length} momentos con asset · ${BASE.length} cues base · ${COMPS.length} componentes · ${WIN.length} ventanas · audio ${WAV_S.toFixed(2)}s`);
if (miss.length) console.log(`  sin anclar/sin asset (${miss.length}): ${miss.slice(0, 30).join(" | ")}`);
const first = BASE.find((b) => b.kind !== "avatar");
say(BASE[0].kind === "avatar" && first.from >= F(APERTURA), `apertura: avatar hasta ${(first.from / FPS).toFixed(2)}s (piso ${APERTURA.toFixed(2)}s)`);
let gaps = 0, over = 0;
for (let i = 1; i < BASE.length; i++) { const e = BASE[i - 1].from + BASE[i - 1].dur; if (BASE[i].from > e) gaps++; if (BASE[i].from < e) over++; }
const endF = BASE[BASE.length - 1].from + BASE[BASE.length - 1].dur;
say(gaps === 0 && over === 0 && BASE[0].from === 0 && endF === F(VIDEO_END), `base contigua frame a frame: huecos ${gaps} · solapes ${over} · fin ${endF}/${F(VIDEO_END)}`);
const avBad = BASE.filter((b) => b.kind === "avatar").filter((b) => {
  const s = b.from / FPS, e = (b.from + b.dur) / FPS;
  return !WIN.some((w) => s >= w.start - 0.05 && e <= w.end + 0.05);
});
say(avBad.length === 0, `avatar SÓLO dentro de ventanas con lipsync: ${avBad.length} cues fuera`);
const nonAv = BASE.filter((b) => b.kind !== "avatar");
const outs = nonAv.map((b) => { let x = (b.seed | 0) ^ 0; return b; });
// replica de kenBurns().acerca (Piezas.tsx)
const hash = (n) => { let x = (n | 0) ^ 0x9e3779b9; x = Math.imul(x ^ (x >>> 16), 0x85ebca6b); x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
const rnd = (seed, salt) => hash(Math.imul(seed + 1, 2654435761) ^ Math.imul(salt + 7, 40503));
const dirs = outs.map((b) => rnd(b.seed, 2) < 0.5);
const pctOut = 100 * dirs.filter((d) => !d).length / dirs.length;
let run = 1, maxRun = 1; for (let i = 1; i < dirs.length; i++) { run = dirs[i] === dirs[i - 1] ? run + 1 : 1; maxRun = Math.max(maxRun, run); }
say(pctOut >= 35 && pctOut <= 65 && maxRun <= 14, `Ken-Burns al azar: ${pctOut.toFixed(0)}% zoom OUT de ${dirs.length} planos · racha máx ${maxRun}`);
// pacing sobre lo VISIBLE: se descuenta lo que tapan los componentes a pantalla completa
const fullIv = COMPS.filter((c) => !OVERLAY.has(c.kind)).map((c) => [c.from, c.from + c.dur]);
const visOf = (b) => { let v = 0; for (let f = b.from; f < b.from + b.dur; f += 3) if (!fullIv.some(([s, e]) => f >= s && f < e)) v += 3; return Math.min(v, b.dur); };
const vis = nonAv.map((b) => ({ b, v: visOf(b) / FPS })).filter((x) => x.v >= 1.0);
const durs = vis.map((x) => x.v).sort((a, b) => a - b); const q = (p) => durs[Math.floor(durs.length * p)] || 0;
const phraseAt = (sec) => { const i = WMS.findIndex((w) => w.s >= sec); return i < 0 ? "" : WMS.slice(i, i + 9).map((w) => w.w).join(" "); };
vis.sort((a, b) => b.v - a.v).slice(0, 12).forEach((x) => console.log(`  largo ${x.v.toFixed(1)}s @${(x.b.from / FPS).toFixed(1)} ${x.b.n} · "${phraseAt(x.b.from / FPS)}"`));
say(q(0.5) >= 3.0 && q(0.5) <= 5.0, `pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}% · máx ${durs[durs.length - 1].toFixed(1)}s`);
const avF = BASE.filter((b) => b.kind === "avatar").reduce((s, b) => s + b.dur, 0);
console.log(`  avatar en la base: ${(avF / FPS).toFixed(0)}s (${(100 * avF / F(VIDEO_END)).toFixed(1)}%) · clips ${BASE.filter((b) => b.kind === "clip").length} · fotos ${BASE.filter((b) => b.kind === "foto").length}`);
const clips0 = BASE.filter((b) => b.kind === "clip" && !b.frames);
say(clips0.length === 0, `clips con frames medidos: ${BASE.filter((b) => b.kind === "clip").length - clips0.length}/${BASE.filter((b) => b.kind === "clip").length}`);
const kinds = {}; COMPS.forEach((c) => (kinds[c.kind] = (kinds[c.kind] || 0) + 1));
say(Object.keys(kinds).length >= 6, `componentes distintos: ${Object.keys(kinds).length} → ${Object.entries(kinds).map(([k, v]) => k + "×" + v).join(", ")}`);
const vidTags = fs.readdirSync("src/nightwater60").map((f) => fs.readFileSync("src/nightwater60/" + f, "utf8").split("\n").filter((l) => !/^\s*(\/\/|\*)/.test(l)).join("\n")).join("\n");
say(!/<Video[\s>]/.test(vidTags), "ningún <Video> en src/nightwater60 (OffthreadVideo)");

// ── assets ──────────────────────────────────────────────────────────────────
const need = new Set([`nw/${SLUG}.m4a`, `nw/${SLUG}_avatar.mp4`]);
const hurga = (v) => { if (typeof v === "string") { if (/^(img|broll|med|nw)\//.test(v)) need.add(v); return; } if (Array.isArray(v)) v.forEach(hurga); else if (v && typeof v === "object") Object.values(v).forEach(hurga); };
[...BASE, ...COMPS].forEach(hurga);
const assets = new Set();
for (const p of need) { assets.add(p); if (/\.(jpe?g|png)$/i.test(p)) { const b = p.replace(/\.(jpe?g|png)$/i, "_blur.jpg"); if (has(b)) assets.add(b); } }
const faltan = [...assets].filter((p) => !has(p));
say(faltan.length === 0, `assets ${assets.size} en disco · faltan ${faltan.length}${faltan.length ? " → " + faltan.slice(0, 8).join(" ") : ""}`);
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].sort().join("\n") + "\n");

fs.writeFileSync(`src/${SLUG}/cues.gen.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const TOTAL_FRAMES = ${F(VIDEO_END)};\n` +
  `export const BASE: any[] = ${JSON.stringify(BASE)};\n` +
  `export const COMPS: any[] = ${JSON.stringify(COMPS)};\n`);
console.log(fail ? `\n✗ ${fail} compuerta(s) en rojo` : "\n✓ todas las compuertas en verde");
process.exit(fail ? 1 : 0);
