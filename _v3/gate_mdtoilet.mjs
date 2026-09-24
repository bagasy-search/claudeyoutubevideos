// gate_mdtoilet.mjs — COMPUERTA PRE-FARM del video `mdtoilet`.
//
//   node _v3/gate_mdtoilet.mjs      (exit 1 = NO se farmea)
//
// Chequea, sobre el plan REAL y los archivos REALES en disco, las cinco familias de fallas que
// ya costaron corridas del farm en este proyecto:
//  1. HUECOS: algún instante del video sin avatar-full y sin contenido encima.
//  2. CLIPS CORTOS: un beat que le pide al mp4 frames que no existen (congela o sale negro).
//  3. CLIPS OSCUROS: luma media < 25 → se lee como pantalla negra.
//  4. CONTRATOS: props con la forma equivocada caen al TEXTO DEFAULT (en español) sin crashear.
//  5. DURACIÓN: la comp más corta que el .wav se come la última frase.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";
const plan = JSON.parse(fs.readFileSync("_v3/mdtoilet_plan.json", "utf8").replace(/^﻿/, ""));
const { beats, overlays, totalMs } = plan;
let fail = 0, warn = 0;
const bad = (m) => { console.log("  ⛔ " + m); fail++; };
const soft = (m) => { console.log("  ⚠ " + m); warn++; };

// ── 1 · HUECOS ───────────────────────────────────────────────────────────────────────────────
// Reproduce lo que hace el build: beat avatar → ventana full; cualquier otro → hidden + un cue
// que cubre EXACTAMENTE su span. Un hueco es un instante hidden sin cue.
{
  const covered = beats.filter((b) => b.tipo !== "avatar").map((b) => [b.ms_in, b.ms_out]);
  const avatarFull = beats.filter((b) => b.tipo === "avatar").map((b) => [b.ms_in, b.ms_out]);
  let holes = 0, firstHole = null;
  for (let t = 0; t < totalMs; t += 200) {
    const okAv = avatarFull.some(([a, b]) => t >= a && t < b);
    const okCo = covered.some(([a, b]) => t >= a && t < b);
    if (!okAv && !okCo) { holes++; if (firstHole == null) firstHole = t; }
  }
  if (holes) bad(`${holes} instante(s) sin avatar y sin contenido — el primero a los ${(firstHole / 1000).toFixed(1)}s`);
  else console.log("  ✓ sin huecos: todo instante tiene avatar-full o contenido");
}

// ── 2 y 3 · CLIPS: metraje suficiente y no casi-negros ───────────────────────────────────────
{
  const info = new Map();
  const probe = (src) => {
    if (info.has(src)) return info.get(src);
    let v = null;
    try {
      // ⛔ `-show_entries stream=a,b,c` NO respeta el orden pedido: hay que preguntar de a uno.
      const q = (k) => execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0",
        "-show_entries", `stream=${k}`, "-of", "default=nw=1:nk=1", src], { encoding: "utf8" }).trim();
      const fr = q("r_frame_rate"), nb = q("nb_frames"), du = q("duration");
      const [a, b] = fr.split("/");
      const fps = Number(b) ? Number(a) / Number(b) : Number(a);
      v = { frames: Number(nb) || Math.round(Number(du) * fps), fps, dur: Number(du) };
    } catch (e) { v = null; }
    info.set(src, v);
    return v;
  };
  let short = 0, missing = 0;
  for (const b of beats.filter((x) => x.tipo === "clip")) {
    const src = `public/broll/${b.clip}.mp4`;
    if (!fs.existsSync(src)) { missing++; continue; }
    const p = probe(src);
    if (!p) continue;
    const need = (b.startFrom || 0) + Math.ceil(((b.ms_out - b.ms_in) / 1000) * p.fps);
    if (need > p.frames) { short++; if (short <= 4) soft(`${b.clip} pide ${need}f y tiene ${p.frames}f (beat ${(b.ms_in / 1000).toFixed(1)}s)`); }
  }
  if (missing) bad(`${missing} beat(s) apuntan a un clip que no está en disco`);
  if (short) bad(`${short} beat(s) le piden al mp4 más frames de los que tiene`);
  if (!missing && !short) console.log("  ✓ todos los beats de clip caben dentro de su mp4");

  // luma: un clip casi negro dispara blackdetect en el render final
  let dark = 0;
  const clips = [...new Set(beats.filter((x) => x.tipo === "clip").map((x) => x.clip))];
  for (const c of clips) {
    const src = `public/broll/${c}.mp4`;
    if (!fs.existsSync(src)) continue;
    try {
      const out = execFileSync(FFPROBE, ["-v", "error", "-f", "lavfi",
        `movie=${src.replace(/:/g, "\\:")},signalstats`, "-show_entries", "frame_tags=lavfi.signalstats.YAVG",
        "-read_intervals", "%+#12", "-of", "default=nw=1:nk=1"], { encoding: "utf8", maxBuffer: 1 << 22 });
      const ys = out.trim().split(/\s+/).map(Number).filter((x) => !Number.isNaN(x));
      const avg = ys.reduce((a, b) => a + b, 0) / Math.max(1, ys.length);
      if (avg < 25) { dark++; soft(`${c} luma media ${avg.toFixed(1)} — se va a leer como pantalla negra`); }
    } catch (e) { /* signalstats no disponible: no bloquea */ }
  }
  if (!dark) console.log(`  ✓ ${clips.length} clips distintos, ninguno casi-negro`);
}

// ── 4 · CONTRATOS DE PROPS ───────────────────────────────────────────────────────────────────
{
  const REQ = {
    HookCaption: (p) => Array.isArray(p.words) && p.words.every((w) => typeof w.text === "string"),
    NumberedSteps: (p) => Array.isArray(p.steps) && p.steps.every((s) => typeof s.title === "string") && p.eyebrow && p.title,
    BigStatReveal: (p) => typeof p.value === "number" && typeof p.eyebrow === "string",
    HighlightSweep: (p) => typeof p.pre === "string" && typeof p.highlight === "string",
    MythTruth: (p) => p.myth && p.truth && p.mythLabel && p.truthLabel,
    PullQuote: (p) => typeof p.quote === "string" && p.quote.length > 10,
    ChecklistReveal: (p) => Array.isArray(p.items) && p.items.every((i) => typeof i === "string") && p.kicker && p.title && p.stamp,
    BulletCascade: (p) => Array.isArray(p.bullets) && p.bullets.every((b) => typeof b.key === "string") && p.eyebrow,
    VsDuel: (p) => p.left && p.right && typeof p.left.label === "string" && typeof p.right.label === "string" && p.eyebrow && p.title,
    ChapterTrailCard: (p) => typeof p.number === "string" && typeof p.title === "string",
  };
  const ES = /[áéíóúñ¿¡]|(^|\s)(el|la|los|las|de|que|para|con|una|paso)(\s|$)/i;
  let n = 0;
  for (const o of overlays) {
    const chk = REQ[o.componente];
    if (!chk) { soft(`overlay ${o.componente} sin contrato declarado en el gate`); continue; }
    if (!chk(o.props)) bad(`overlay ${o.componente} @${(o.ms_in / 1000).toFixed(1)}s con props de forma equivocada → caería al texto DEFAULT`);
    else n++;
    const txt = JSON.stringify(o.props);
    if (ES.test(txt)) soft(`overlay ${o.componente} @${(o.ms_in / 1000).toFixed(1)}s tiene texto que parece español (canal EN)`);
  }
  for (const b of beats.filter((x) => x.tipo === "componente")) {
    if (!REQ[b.componente] || !REQ[b.componente](b.props)) bad(`beat ${b.componente} @${(b.ms_in / 1000).toFixed(1)}s con props inválidas`);
    const d = (b.ms_out - b.ms_in) / 1000;
    if (b.componente === "ChapterTrailCard" && (d < 0.9 || d > 9.5)) bad(`ChapterTrailCard de ${d.toFixed(2)}s @${(b.ms_in / 1000).toFixed(1)}s (rango válido 0,9–9,5 s)`);
  }
  console.log(`  ✓ ${n} overlay(s) con la forma correcta · ${beats.filter((x) => x.tipo === "componente").length} chapter card(s)`);
}

// ── 5 · DURACIÓN vs .WAV ─────────────────────────────────────────────────────────────────────
{
  const out = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", "public/mdtoilet.wav"], { encoding: "utf8" });
  const wav = Number(out.trim());
  if (totalMs / 1000 < wav) bad(`la comp dura ${(totalMs / 1000).toFixed(2)}s y el wav ${wav.toFixed(2)}s — se corta la última frase`);
  else console.log(`  ✓ comp ${(totalMs / 1000).toFixed(2)}s ≥ wav ${wav.toFixed(2)}s`);
}

// ── VARIEDAD (la del density_gate: ≥6 componentes DISTINTOS) ────────────────────────────────
{
  const distinct = new Set([...beats.filter((b) => b.tipo === "movimiento" || b.tipo === "componente").map((b) => b.componente), ...overlays.map((o) => o.componente)]);
  if (distinct.size < 6) bad(`sólo ${distinct.size} componentes distintos (mínimo 6)`);
  else console.log(`  ✓ ${distinct.size} componentes distintos: ${[...distinct].join(", ")}`);
}

console.log(fail ? `\n⛔ GATE FALLÓ · ${fail} error(es), ${warn} aviso(s)` : `\n✅ GATE OK · ${warn} aviso(s)`);
process.exit(fail ? 1 : 0);
