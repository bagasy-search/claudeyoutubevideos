// montaje.mjs (famarioneta) — SPEC + momentos al ms + assets en disco → cues Remotion + Main + index + lista de assets.
// Compuertas que FALLAN (exit 1) y dicen cuánto midieron: apertura con avatar, cobertura 100 %, hits dentro de su
// componente, assets existentes, fps 30/1, 16:9, ningún clip de agnes más largo que su archivo ni repetido,
// tiempo de lectura, <Video> legacy, nombres de tipo/instrucción del director impresos en tarjetas.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { SPEC } from "./spec.mjs";

const SLUG = "famarioneta", FPS = 30;
const J = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const existe = (rel) => fs.existsSync(path.join("public", rel));
const cacheDur = {};
const durDe = (rel) => cacheDur[rel] ??= (() => { try { return parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" })) || 0; } catch { return 0; } })();
const probe = (rel, e) => { try { return execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", `stream=${e}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim(); } catch { return ""; } };
const F = (s) => Math.round(s * FPS);
const fail = []; const warn = [];

const M = J(`_v3/${SLUG}_moments.json`);
const WM = J(`_v3/${SLUG}_wordms.json`);
const AVW = J(`_v3/${SLUG}_avwin.json`);
const STOCK = fs.existsSync(`_v3/${SLUG}_stock_pick.json`) ? J(`_v3/${SLUG}_stock_pick.json`) : {};
const WAV_S = durDe(`${SLUG}.m4a`) || durDe(`${SLUG}.wav`);
let TOTAL_FRAMES = Math.ceil(WAV_S * FPS);
const TOT = TOTAL_FRAMES / FPS;
const idx = Object.fromEntries(M.map((m, i) => [m.name, i]));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ\s]/g, " ").split(/\s+/).filter(Boolean);
// índice de palabra de cada momento (mismo tokenizado que moments.mjs)
{ let c = 0; for (const m of M) { m.i0 = c; c += m.txt.split(/\s+/).map((w) => norm(w).join("")).filter(Boolean).length; } }
const endOf = (i) => (i + 1 < M.length ? M[i + 1].t : TOT);

// ── hits: frases del guion → segundos relativos al inicio del componente
const hitsDe = (entry, start, dur, i0, i1) => {
  if (!entry.at) return undefined;
  const from = entry.atFrom ? M[idx[entry.atFrom]].i0 : M[i0].i0;
  const toI = entry.atTo ? idx[entry.atTo] : i1;
  const to = toI + 1 < M.length ? M[toI + 1].i0 + 2 : WM.length;
  let cur = from;
  return entry.at.map((ph) => {
    const toks = norm(ph);
    for (let k = cur; k < Math.min(to, WM.length); k++) {
      if (toks.every((t, j) => WM[k + j]?.w === t)) { cur = k + 1; const h = +(WM[k].ms / 1000 - start).toFixed(2); if (h < -0.05 || h > dur - 0.25) fail.push(`hit "${ph}" cae fuera de su componente (${h}s de ${dur.toFixed(2)}s @${start.toFixed(1)})`); return Math.max(0, h); }
    }
    fail.push(`hit "${ph}" NO encontrado en las palabras de su tramo (@${start.toFixed(1)})`);
    return 0;
  });
};

// ── asset de un momento
const imgDe = (name) => (existe(`img/${SLUG}/${name}.jpg`) ? `img/${SLUG}/${name}.jpg` : null);
const agnesDe = (name) => (existe(`broll/${SLUG}/${name}.mp4`) ? `broll/${SLUG}/${name}.mp4` : null);
const stockDe = (name) => (STOCK[name] && existe(`broll/${SLUG}/stock/${name}.mp4`) ? `broll/${SLUG}/stock/${name}.mp4` : null);
const bedCache = {};
const frameBed = (clipRel, name) => {
  const out = `img/${SLUG}/bed_${name}.jpg`;
  if (!existe(out)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.min(2.5, durDe(clipRel) * 0.4)), "-i", path.join("public", clipRel), "-frames:v", "1", "-q:v", "3", path.join("public", out)]);
  return out;
};
const bedDe = (name) => {
  if (bedCache[name]) return bedCache[name];
  const i = imgDe(name); if (i) return (bedCache[name] = i);
  const s = stockDe(name); if (s) return (bedCache[name] = frameBed(s, name));
  if (name === "antes") return `img/${SLUG}/antes.jpg`;
  return null;
};

// ── ventanas de avatar = capa base intocable
const avatar = AVW.map((w) => ({ tipo: "avatar", start: w.start, end: w.end, src: `broll/${SLUG}/av/w${String(w.k).padStart(3, "0")}.mp4`, seed: F(w.start) }));
const enAvatar = (s) => avatar.find((w) => s >= w.start - 0.05 && s < w.end - 0.05);
const proxAvatar = (s) => { const w = avatar.find((x) => x.start > s + 0.05); return w ? w.start : TOT; };

const base = [...avatar];
const overlays = [];
const piso = (props, full) => Math.min(12, (full ? 2.8 : 2.0) + 0.28 * Math.max(0, JSON.stringify(props).replace(/"[a-zA-Z]+":/g, "").replace(/img\/[^"]+/g, "").split(/\s+/).length - 3));
let prevLam = null, prevBed = null;

for (let i = 0; i < M.length; i++) {
  const m = M[i], s = SPEC[m.name];
  if (!s) continue;
  if (s.ov) {
    const span = s.ov.span || 1;
    const st = m.t, en = Math.max(endOf(Math.min(M.length - 1, i + span - 1)), st + piso(s.ov.props, false));
    const d = Math.min(en, proxAvatar(st) > st + 1 && s.t !== "A" ? Math.max(proxAvatar(st), st + 2.5) : en) - st;
    overlays.push({ c: s.ov.c, start: st, dur: Math.max(2, d), props: { ...s.ov.props, ov: true, ...(s.ov.at ? { hits: hitsDe(s.ov, st, Math.max(2, d), i, i + span - 1) } : {}) } });
  }
  if (s.t === "A") continue;
  if (enAvatar(m.t + 0.1)) { warn.push(`${m.name} (${s.t}) cae dentro de una ventana de avatar`); continue; }
  const span = s.span || 1;
  const st = m.t;
  let en = Math.min(endOf(i + span - 1), proxAvatar(st));
  if (s.t === "L") {
    base.push({ tipo: "lamina", start: st, end: en, src: `img/${SLUG}/lamina.jpg`, zoom: s.z, desde: prevLam || s.z });
    prevLam = s.z; continue;
  }
  if (s.t === "C") {
    const bedName = s.bedFrom || [...M.slice(0, i)].reverse().map((x) => x.name).find((n) => SPEC[n] && SPEC[n].t !== "A" && SPEC[n].t !== "C" && SPEC[n].t !== "L" && bedDe(n));
    let bed = bedName ? bedDe(bedName) : prevBed;
    if (!bed) bed = `img/${SLUG}/antes.jpg`;
    const d = en - st;
    if (d < piso(s.props, true) - 0.05) warn.push(`${m.name} ${s.c}: ${d.toFixed(1)}s < piso de lectura ${piso(s.props, true).toFixed(1)}s`);
    const props = { ...s.props, bed, ...(s.at ? { hits: hitsDe(s, st, d, i, i + span - 1) } : {}) };
    base.push({ tipo: "comp", c: s.c, start: st, end: en, props, name: m.name });
    i += span - 1; continue;
  }
  let src = null, kind = null;
  if (s.t === "S") { src = stockDe(m.name); kind = "stock"; }
  if (!src) { const a = agnesDe(m.name); if (a) { src = a; kind = "agnes"; } }
  const img = imgDe(m.name);
  if (!src && img) { src = img; kind = "foto"; }
  if (!src) { fail.push(`${m.name} (${s.t}) sin asset`); continue; }
  prevBed = bedDe(m.name) || prevBed;
  base.push({ tipo: kind, start: st, end: en, src, img, name: m.name });
}

base.sort((a, b) => a.start - b.start);
// ── contigüidad por frame + reparto de planos: agnes nunca más largo que su clip; planos >7 s en dos cortes
let TOTAL_CUT = 0;
const cues = [];
const rows = base.map((b) => ({ ...b, f0: F(b.start), f1: F(b.end) }));
rows[0].f0 = 0;
if (rows[0].tipo !== "avatar") fail.push("el video NO abre con el avatar");
for (let k = 0; k < rows.length; k++) {
  const sig = k + 1 < rows.length ? rows[k + 1].f0 : TOTAL_FRAMES;
  if (rows[k].tipo === "avatar") {
    const clipF = Math.floor((durDe(rows[k].src) || (process.argv.includes("--dry") ? rows[k].end - rows[k].start : 0)) * FPS);
    if (sig - rows[k].f0 > clipF + 2) {
      // hueco tras la ventana: lo cubre el plano siguiente arrancando antes (nunca estirar el avatar)
      if (k + 1 < rows.length && rows[k + 1].tipo !== "avatar") { rows[k].f1 = Math.min(rows[k].f0 + clipF, sig); rows[k + 1].f0 = rows[k].f1; }
      else if (k === rows.length - 1 && sig - rows[k].f0 - clipF <= 8) { rows[k].f1 = rows[k].f0 + clipF; TOTAL_CUT = rows[k].f1; warn.push(`el video termina ${sig - rows[k].f1} cuadros antes (silencio final) para no congelar el avatar`); } else { rows[k].f1 = rows[k].f0 + clipF; warn.push(`avatar ${rows[k].src} deja ${((sig - rows[k].f1) / FPS).toFixed(2)} s sin cubrir`); }
    } else rows[k].f1 = sig;
  } else rows[k].f1 = sig;
}
if (TOTAL_CUT) TOTAL_FRAMES = TOTAL_CUT;
const agnesUsos = {};
for (const r of rows) {
  const dur = (r.f1 - r.f0) / FPS;
  if (r.f1 <= r.f0) continue;
  const push = (f0, f1, el, extra = {}) => cues.push({ key: `${r.tipo}_${f0}`, f0, f1, el, ...extra });
  if (r.tipo === "avatar") push(r.f0, r.f1, `<AvatarClip src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src, avatar: true });
  else if (r.tipo === "lamina") push(r.f0, r.f1, `<Lamina src=${JSON.stringify(r.src)} zoom=${JSON.stringify(r.zoom)} desde=${JSON.stringify(r.desde)} />`, { lamina: true });
  else if (r.tipo === "comp") push(r.f0, r.f1, `<${r.c} durationInFrames={d} {...(${JSON.stringify(r.props)} as any)} />`, { comp: r.c, full: true });
  else if (r.tipo === "stock") {
    const cd = durDe(r.src);
    if (false) {
      const cut = r.f0 + Math.round((r.f1 - r.f0) * (0.45 + 0.1 * ((r.f0 % 7) / 7)));
      push(r.f0, cut, `<Clip src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src, real: true });
      const off = Math.min(cd - (r.f1 - cut) / FPS - 0.1, (cut - r.f0) / FPS + 0.5);
      push(cut, r.f1, `<Clip src=${JSON.stringify(r.src)} seed={${cut}} startFrom={${off.toFixed(2)}} />`, { src: r.src, real: true });
    } else {
      if (dur > cd - 0.05) fail.push(`stock ${r.src} (${cd.toFixed(1)}s) más corto que su plano ${dur.toFixed(1)}s`);
      push(r.f0, r.f1, `<Clip src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src, real: true });
    }
  } else if (r.tipo === "agnes") {
    agnesUsos[r.src] = (agnesUsos[r.src] || 0) + 1;
    const cf = Math.floor(durDe(r.src) * FPS) - 1;
    if (r.f1 - r.f0 <= cf) push(r.f0, r.f1, `<Clip src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src, agnes: true });
    else {
      push(r.f0, r.f0 + cf, `<Clip src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src, agnes: true });
      if (r.img) push(r.f0 + cf, r.f1, `<Foto src=${JSON.stringify(r.img)} seed={${r.f0 + cf}} punch />`, { src: r.img });
      else fail.push(`agnes ${r.src} más corto que su plano y sin foto`);
    }
  } else {
    if (dur > 7.2) {
      const cut = r.f0 + Math.round((r.f1 - r.f0) * 0.52);
      push(r.f0, cut, `<Foto src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src });
      push(cut, r.f1, `<Foto src=${JSON.stringify(r.src)} seed={${cut}} punch />`, { src: r.src });
    } else push(r.f0, r.f1, `<Foto src=${JSON.stringify(r.src)} seed={${r.f0}} />`, { src: r.src });
  }
}
for (const [s, n] of Object.entries(agnesUsos)) if (n > 1) fail.push(`clip agnes repetido: ${s} ×${n}`);

// ── COMPUERTAS de timeline
const cov = new Uint8Array(TOTAL_FRAMES);
for (const c of cues) for (let x = c.f0; x < Math.min(TOTAL_FRAMES, c.f1); x++) cov[x] = 1;
const sinPlano = cov.length - cov.reduce((a, b) => a + b, 0);
if (sinPlano) fail.push(`${sinPlano} frames SIN plano`);
const first = cues[0];
if (!first?.avatar || first.f1 < F(3)) fail.push("apertura: el primer plano tiene que ser el avatar ≥3 s");
const sum = (fn) => cues.filter(fn).reduce((a, c) => a + c.f1 - c.f0, 0) / FPS;
const avS = sum((c) => c.avatar), realS = sum((c) => c.real), compS = sum((c) => c.full), lamS = sum((c) => c.lamina);
const durs = cues.map((c) => (c.f1 - c.f0) / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
// fps + aspecto de todo asset
const assets = new Set([`${SLUG}.m4a`]);
const scan = (v) => { if (typeof v === "string") { if (/^(img|broll)\//.test(v)) assets.add(v); return; } if (Array.isArray(v)) v.forEach(scan); else if (v && typeof v === "object") Object.values(v).forEach(scan); };
for (const c of cues) { if (c.src) assets.add(c.src); }
for (const r of rows) { if (r.props) scan(r.props); if (r.src) assets.add(r.src); }
for (const o of overlays) scan(o.props);
const faltan = [...assets].filter((a) => !existe(a));
if (faltan.length) fail.push(`${faltan.length} assets faltan: ${faltan.slice(0, 8).join(", ")}`);
const vids = [...assets].filter((a) => a.endsWith(".mp4") && existe(a));
const malFps = vids.filter((v) => probe(v, "r_frame_rate") !== "30/1");
if (malFps.length) fail.push(`${malFps.length} videos no son 30/1: ${malFps.slice(0, 5).join(", ")}`);
const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/.test(a) && existe(a) && !/qr_|portada/.test(a));
const malAsp = imgs.filter((r) => { const [w, h] = probe(r, "width,height").split(",").map(Number); return !(w && h) || Math.abs(w / h - 16 / 9) > 0.08; });
if (malAsp.length) fail.push(`${malAsp.length} imágenes no 16:9: ${malAsp.slice(0, 5).join(", ")}`);
// textos prohibidos en tarjetas (nombre de tipo, instrucción del director)
const txt = JSON.stringify([...rows.filter((r) => r.props).map((r) => r.props), ...overlays.map((o) => o.props)]);
for (const [bad, fl] of [["Fm[A-Z]", ""], ["span", "i"], ["prompt", "i"], ["TODO", ""], ["gratis", "i"], ["sin costo", "i"], ["regalo", "i"], ["\$", ""]]) { const mm = txt.replace(/"(c|bed|left|right|cover|qr|src|image)":"[^"]*"/g, "").match(new RegExp(`"[^"]*${bad}[^"]*"`, fl)); if (mm) fail.push(`texto prohibido en tarjeta: ${mm[0]}`); }

const compsUsados = new Set([...cues.filter((c) => c.comp).map((c) => c.comp), ...overlays.map((o) => o.c)]);
const nComps = cues.filter((c) => c.comp).length + overlays.length;
console.log(`MEDIDO: ${cues.length} planos base · ${overlays.length} overlays · ${TOTAL_FRAMES} frames (${(TOT / 60).toFixed(2)} min) · cobertura ${(100 * (1 - sinPlano / TOTAL_FRAMES)).toFixed(1)} %`);
console.log(`visible: avatar ${(100 * avS / TOT).toFixed(1)} % · REAL stock ${(100 * realS / TOT).toFixed(1)} % · componentes full ${(100 * compS / TOT).toFixed(1)} % · lámina ${lamS.toFixed(1)} s`);
console.log(`componentes ${nComps} · tipos ${compsUsados.size} · pacing mediana ${q(0.5).toFixed(2)} p75 ${q(0.75).toFixed(2)} ≥5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)} % max ${durs.at(-1).toFixed(1)}`);
console.log(`assets ${assets.size} · videos 30/1 medidos ${vids.length} · imágenes 16:9 medidas ${imgs.length}`);
if (warn.length) { console.log(`⚠️ ${warn.length} avisos:`); warn.slice(0, 25).forEach((w) => console.log("   " + w)); }
if (fail.length) { console.error(`⛔ ${fail.length} FALLAS:`); fail.slice(0, 40).forEach((f) => console.error("   " + f)); process.exitCode = 1; }
if (process.argv.includes("--dry")) process.exit(process.exitCode || 0);

// ── emitir
const KIT = [...compsUsados].sort();
const line = (c, d) => `  { key: ${JSON.stringify(c.key)}, from: ${c.f0}, dur: ${c.f1 - c.f0}, el: (d) => ${c.el} },`;
fs.writeFileSync(`src/${SLUG}/cues.gen.tsx`,
`// cues.gen.tsx — GENERADO por work/${SLUG}/montaje.mjs. NO editar a mano.
import React from "react";
import { AvatarClip, Clip, Foto, Lamina } from "./Piezas";
import { ${KIT.join(", ")} } from "./Kit";

export type Cue = { key: string; from: number; dur: number; el: (d: number) => React.ReactNode };
export const CUES: Cue[] = [
${cues.map((c) => line(c)).join("\n")}
];
export const OVERLAYS: Cue[] = [
${overlays.map((o) => { const f0 = F(o.start), f1 = f0 + F(o.dur); return `  { key: "ov_${f0}_${o.c}", from: ${f0}, dur: ${Math.min(f1, TOTAL_FRAMES) - f0}, el: (d) => <${o.c} durationInFrames={d} {...(${JSON.stringify(o.props)} as any)} /> },`; }).join("\n")}
];
`);
fs.writeFileSync(`src/${SLUG}/Main.tsx`,
`// Main.tsx — GENERADO por work/${SLUG}/montaje.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES, OVERLAYS } from "./cues.gen";

export const TOTAL_FRAMES_FAMARIONETA = ${TOTAL_FRAMES};
export const MainFamarioneta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F4EEDD" }}>
    {CUES.map((c) => (
      <Sequence key={c.key} from={c.from} durationInFrames={Math.max(1, c.dur)} premountFor={15}>
        {c.el(Math.max(1, c.dur))}
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={o.from} durationInFrames={Math.max(1, o.dur)} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, o.dur))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile("${SLUG}.m4a")} />
  </AbsoluteFill>
);
`);
fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFamarioneta, TOTAL_FRAMES_FAMARIONETA } from "./${SLUG}/Main";

const RootFamarioneta: React.FC = () => (
  <Composition id="Famarioneta" component={MainFamarioneta} durationInFrames={TOTAL_FRAMES_FAMARIONETA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFamarioneta);
`);
// cues para agnes_qc (repetición) + lista de assets (+ sfx usados por el kit)
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(cues.filter((c) => c.src).map((c) => ({ key: c.key, src: c.src, start: c.f0 / FPS, dur: (c.f1 - c.f0) / FPS })), null, 1));
const kitSrc = fs.readFileSync(`src/${SLUG}/Kit.tsx`, "utf8");
const sfx = new Set([...kitSrc.matchAll(/"([a-z_0-9]+\.mp3)"/g)].map((m) => `sfx/${m[1]}`));
const lista = [...assets, ...sfx].filter((a) => existe(a)).sort();
const sfxFaltan = [...sfx].filter((a) => !existe(a));
if (sfxFaltan.length) { console.error("⛔ sfx faltan:", sfxFaltan); process.exitCode = 1; }
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");
console.log(`emitido: cues ${cues.length} · overlays ${overlays.length} · lista ${lista.length} (sfx ${sfx.size})`);
