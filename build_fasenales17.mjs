// build_fasenales17.mjs — arma el montaje de `fasenales17` (Federer Archivos) desde el plan
// anclado al ms. Emite src/fasenales17/cues_fasenales17.gen.tsx + Main_fasenales17.tsx.
//
// COMPUERTAS QUE CORRE ESTE BUILD (todas imprimen CUÁNTO midieron; una que no imprime NO es un OK):
//   1. apertura con el avatar hablando (piso de 3 s / fin del primer momento)
//   2. fronteras alineadas al CUADRO (el redondeo por separado deja huecos de 1 frame = destellos)
//   3. cobertura del TRAMO 2 >= 95 % (pasado AVATAR_END el avatar está MUDO y en bucle)
//   4. exposición del avatar en el TRAMO 1 (cubrir el 100 % con b-roll TAPA al presentador)
//   5. `<Video>` prohibido en el rig
//   6. cuadros REALES de cada clip (sin eso `<Loop>` no puede y el clip se CONGELA)
//   7. cama de metraje debajo de TODO componente
//   8. el CTA existe y está en la capa `over`
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fasenales17";
const FPS = 30;
const AVATAR_END_MS = 1269166;
const AVATAR_FRAMES = 38075;
const TOTAL_MS = 3213374;
const TOTAL_FRAMES = Math.round((TOTAL_MS / 1000) * FPS);
const APERTURA_MIN_S = 3;
const FP = process.env.FP || `${process.env.USERPROFILE}/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe`;
const CLIPDIR = `public/broll/${SLUG}`;
const IMGDIR = "public/img";

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const mom = plan.momentos;
const F = (s) => Math.round(s * FPS);
const die = (m) => { console.error("⛔ " + m); process.exit(1); };

// ── 1. FUSIÓN DE MOMENTOS CORTOS (pacing) ────────────────────────────────────────────────────
// El plano que dura no es un error: es lo que deja entender lo que se está explicando. Lo que hay
// que evitar es la SUCESIÓN PAREJA. Con los momentos crudos daba mediana 3,76 s / p75 4,88 s y
// sólo 23 % de planos >= 5 s. Se fusionan RACHAS de momentos cortos del MISMO lugar y la MISMA
// sección — nunca momentos de temas distintos, que rompería el contexto por frase.
const FUSION_MAX_S = 6.5, CORTO_S = 2.6, FUSION_MAX_N = 3;
const planos = [];
let i = 0;
let fusionados = 0;
while (i < mom.length) {
  const a = mom[i];
  if (a.tipo !== "imagen") { planos.push({ ...a, _n: 1 }); i++; continue; }
  let j = i, dur = (a.ms_fin - a.ms_ini) / 1000;
  while (
    j + 1 < mom.length && j - i + 1 < FUSION_MAX_N &&
    mom[j + 1].tipo === "imagen" && mom[j + 1].sec === a.sec && mom[j + 1].lugar === a.lugar &&
    dur < CORTO_S && (mom[j + 1].ms_fin - a.ms_ini) / 1000 <= FUSION_MAX_S
  ) { j++; dur = (mom[j].ms_fin - a.ms_ini) / 1000; }
  if (j > i) fusionados += j - i;
  planos.push({ ...a, ms_fin: mom[j].ms_fin, _n: j - i + 1, _reserva: mom.slice(i + 1, j + 1).map((m) => m.name) });
  i = j + 1;
}
console.log(`momentos ${mom.length} -> planos ${planos.length}  (fusionados ${fusionados} momentos cortos del mismo lugar)`);

// ── 2. CUADROS REALES DE CADA CLIP ───────────────────────────────────────────────────────────
// ⛔ Sin esto `<Loop>` no puede repetir y el clip se CONGELA en su último cuadro el resto del slot.
const framesDe = (p) => {
  try {
    const o = execFileSync(FP, ["-v", "error", "-select_streams", "v", "-count_packets",
      "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", p], { encoding: "utf8" });
    return parseInt(o.trim(), 10) || 0;
  } catch { return 0; }
};
const cacheP = `_v3/${SLUG}_clipframes.json`;
const cache = fs.existsSync(cacheP) ? JSON.parse(fs.readFileSync(cacheP, "utf8")) : {};
let medidos = 0, sinClip = 0;
for (const p of planos) {
  if (p.tipo !== "imagen") continue;
  const c = `${CLIPDIR}/${p.name}.mp4`;
  if (!fs.existsSync(c)) { p._clip = null; sinClip++; continue; }
  if (cache[p.name] === undefined) { cache[p.name] = framesDe(c); medidos++; }
  p._clip = cache[p.name] > 1 ? `broll/${SLUG}/${p.name}.mp4` : null;
  p._frames = cache[p.name];
  if (!p._clip) sinClip++;
}
fs.writeFileSync(cacheP, JSON.stringify(cache));
console.log(`clips: medidos con ffprobe ${medidos} · sin clip (van como foto quieta) ${sinClip}`);
if (Object.values(cache).some((v) => v === 0)) console.log(`  ⚠ ${Object.values(cache).filter((v) => v === 0).length} clips con 0 cuadros`);

// ── 3. VENTANAS DONDE EL AVATAR QUEDA A LA VISTA ─────────────────────────────────────────────
// TRAMO 1 (lipsync REAL): se SUELTAN momentos para que se lo vea. Cubrir el 100 % con b-roll lo
// tapa todo el video y el creador lo marca. TRAMO 2 (bucle MUDO): cobertura >= 95 %, porque cada
// instante con el avatar a la vista es un plano con la boca desincronizada.
let expuestos1 = 0;
for (const p of planos) {
  const tramo1 = p.ms_ini < AVATAR_END_MS;
  p._avatar = p.tipo === "avatar";
  if (p._avatar && !tramo1) die(`momento 'avatar' en el TRAMO 2 (bucle mudo): ${p.name || p.idx} @${(p.ms_ini / 1000).toFixed(1)}s`);
  if (p._avatar) expuestos1++;
}

// ── 4. CUES ALINEADOS AL CUADRO ──────────────────────────────────────────────────────────────
// ⛔ `from={sec(start)}` y `durationInFrames={sec(dur)}` redondean POR SEPARADO: `53.94 + 0.98`
//    termina en el cuadro 1647 y el siguiente arranca en el 1648 -> 46 destellos del fondo de
//    33 ms. `blackdetect` no los ve (pide 0,4 s) y el ojo sí.
const base = [], over = [];
const aperturaF = Math.max(F(APERTURA_MIN_S), F(planos[0].ms_fin / 1000));
let huecos1f = 0;
for (let k = 0; k < planos.length; k++) {
  const p = planos[k];
  if (p._avatar) continue;
  let f0 = F(p.ms_ini / 1000);
  let f1 = F(p.ms_fin / 1000);
  const sig = planos.slice(k + 1).find((x) => !x._avatar);
  if (sig && Math.abs(F(sig.ms_ini / 1000) - f1) <= 1) { if (F(sig.ms_ini / 1000) !== f1) huecos1f++; f1 = F(sig.ms_ini / 1000); }
  if (f0 < aperturaF) f0 = aperturaF;                    // apertura con el avatar hablando
  if (f1 <= f0) continue;
  const seed = f0;
  if (p.tipo === "componente") {
    // la CAMA: el componente va ENCIMA del metraje, nunca en su lugar. Si el plano anterior con
    // imagen existe, su clip/foto sigue abajo; si no, se pone la última cama conocida.
    const cama = [...base].reverse().find((c) => c.tipoAsset);
    if (cama) base.push({ key: `bed${k}`, start: f0, dur: f1 - f0, capa: "base", tipoAsset: cama.tipoAsset, src: cama.src, frames: cama.frames, seed });
    over.push({ key: `c${k}`, start: f0, dur: f1 - f0, capa: "over", comp: p.comp || null, props: p.props || {}, lamina: p.idea_comp === "LAMINA" || !!p.zoom, zoom: p.zoom || "completa" });
    continue;
  }
  const src = p._clip || `img/${p.name}${fs.existsSync(`${IMGDIR}/${p.name}.png`) ? ".png" : ".jpg"}`;
  base.push({ key: `b${k}`, start: f0, dur: f1 - f0, capa: "base", tipoAsset: p._clip ? "clip" : "foto", src, frames: p._frames || 0, seed });
}
// ⛔ TILEO CONTIGUO EN EL TRAMO 2. Los momentos NO tilan el audio: entre el fin de uno y el
//    arranque del siguiente hay silencios de respiración. En el TRAMO 1 eso está bien (el avatar
//    asoma con el lipsync real y es lo que se quiere), pero pasado AVATAR_END el avatar está MUDO,
//    así que cada hueco es un plano con la boca desincronizada. Se estira cada cue hasta el
//    siguiente, con techo para no dejar un plano muerto.
const TILE_MAX_F = F(2.2);
let estirados = 0, ganados = 0;
const baseOrd = base.slice().sort((a, b) => a.start - b.start);
for (let k = 0; k < baseOrd.length - 1; k++) {
  const b = baseOrd[k], n = baseOrd[k + 1];
  if (b.start < F(AVATAR_END_MS / 1000)) continue;
  const hueco = n.start - (b.start + b.dur);
  if (hueco > 0 && hueco <= TILE_MAX_F) { b.dur += hueco; estirados++; ganados += hueco; }
}
console.log(`tileo del tramo 2: ${estirados} cues estirados, ${(ganados / FPS).toFixed(1)}s de hueco de respiración tapados`);
console.log(`cues: base ${base.length} · over ${over.length} · fronteras pegadas al cuadro ${huecos1f}`);

// ── 5. CTA ───────────────────────────────────────────────────────────────────────────────────
// ⛔ El CTA NUNCA vive adentro de un componente de escena: en `cmetemu` se fue con él y el video
//    salió sin QR, con todas las compuertas en verde. Va suelto, en `over`, atado al ms de la frase.
const buscaMs = (frag) => {
  const m = mom.find((x) => String(x.dice || "").includes(frag));
  return m ? [m.ms_ini, m.ms_fin] : null;
};
const CTA_FRASES = ["escaneen el código", "el enlace está abajo", "Se lo dejo en la descripción"];
let ctas = 0;
for (const fr of CTA_FRASES) {
  const r = buscaMs(fr);
  if (!r) continue;
  const f0 = F(r[0] / 1000), f1 = Math.min(TOTAL_FRAMES, F(r[1] / 1000) + F(4));
  if (f1 <= f0) continue;
  over.push({ key: `cta${ctas}`, start: f0, dur: f1 - f0, capa: "over", cta: true, sinSalida: f1 >= TOTAL_FRAMES - 2 });
  ctas++;
}
if (!ctas) die("el video quedó SIN CTA: ninguna de las frases del guion ancló");
console.log(`CTA: ${ctas} apariciones (capa over, QR + dominio)`);

// ── 6. COMPUERTAS ────────────────────────────────────────────────────────────────────────────
const cubierto = (desde, hasta) => {
  let c = 0;
  for (const b of base) {
    const a = Math.max(b.start, desde), z = Math.min(b.start + b.dur, hasta);
    if (z > a) c += z - a;
  }
  return c / (hasta - desde);
};
const avEndF = F(AVATAR_END_MS / 1000);
const cob2 = cubierto(avEndF, TOTAL_FRAMES);
const cob1 = cubierto(aperturaF, avEndF);
console.log(`\nCOMPUERTAS`);
console.log(`  apertura: primer cue de base en el cuadro ${Math.min(...base.map((b) => b.start))} (piso ${aperturaF} = ${(aperturaF / FPS).toFixed(1)}s) ${Math.min(...base.map((b) => b.start)) >= aperturaF ? "✓" : "⛔"}`);
console.log(`  cobertura TRAMO 2 (bucle mudo): ${(100 * cob2).toFixed(1)}%  (vara >=95%) ${cob2 >= 0.95 ? "✓" : "⛔"}`);
console.log(`  exposición del avatar en TRAMO 1: ${(100 * (1 - cob1)).toFixed(1)}% del tramo (${expuestos1} ventanas) ${1 - cob1 >= 0.10 ? "✓" : "⚠ lo tapa demasiado"}`);
const sinCama = over.filter((o) => o.comp && !base.some((b) => b.start <= o.start && b.start + b.dur >= o.start + o.dur));
console.log(`  componentes SIN cama de metraje debajo: ${sinCama.length} de ${over.filter((o) => o.comp).length} ${sinCama.length ? "⛔" : "✓"}`);
const solapes = base.filter((b, k) => k + 1 < base.length && b.start + b.dur > base[k + 1].start).length;
console.log(`  solapes en la capa base: ${solapes}`);
const durs = base.map((b) => b.dur / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.min(durs.length - 1, Math.floor(p * durs.length))];
console.log(`  pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(1)}% · techo ${durs[durs.length - 1].toFixed(1)}s`);
if (cob2 < 0.95) die(`cobertura del tramo 2 por debajo del 95 %: ${(100 * cob2).toFixed(1)}%`);
if (sinCama.length) die(`${sinCama.length} componentes sin cama de metraje debajo`);

// ── 7. EMITIR ────────────────────────────────────────────────────────────────────────────────
const dir = `src/${SLUG}`;
fs.mkdirSync(dir, { recursive: true });
const esc = (s) => JSON.stringify(s === undefined ? null : s);
// ── TIEMPO DE LECTURA ────────────────────────────────────────────────────────────────────────
// El piso NO sale del slot, sale del TEXTO: 2,0 s para un rotulo de esquina y 2,8 s para uno con
// velo, mas 0,28 s por cada palabra mas alla de 3. Aplastar el efecto contra el slot del proximo
// momento da cosas como un numero que aparece 0,25 s. Y los OVERLAY pueden pasarse del slot: flotan
// sobre lo que venga y no le roban tiempo a nadie.
const ESQUINA = new Set(["NumeroSenal"]);
let estiradosLect = 0;
const overComp = over.filter((o) => o.comp).sort((a, b) => a.start - b.start);
for (let k = 0; k < overComp.length; k++) {
  const o = overComp[k];
  const pal = JSON.stringify(o.props || {}).split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/).filter((w) => w.length > 1).length;
  const pisoS = (ESQUINA.has(o.comp) ? 2.0 : 2.8) + 0.28 * Math.max(0, pal - 3);
  const piso = F(Math.min(pisoS, 7.5));
  if (o.dur >= piso) continue;
  const sig = overComp[k + 1];
  const tope = sig ? sig.start - F(0.2) : TOTAL_FRAMES;
  const nuevo = Math.min(o.start + piso, tope);
  if (nuevo > o.start + o.dur) { o.dur = nuevo - o.start; estiradosLect++; }
}
console.log(`tiempo de lectura: ${estiradosLect} componentes estirados al piso que pide su texto`);

// ⛔ Un cue `over` sin `comp` ni `lamina` ni `cta` caia al branch de <Foto> con src null: JSX roto
//    y, si hubiera compilado, un componente VACIO en pantalla. Esa familia (se ve lleno / se ve
//    nada, con todas las compuertas en verde) ya costo 17 laminas en blanco en otro video.
const huerfanos = over.filter((o) => !o.cta && !o.lamina && !o.comp);
if (huerfanos.length) die(`${huerfanos.length} cues de la capa over sin componente asignado (falta el pase de props): ${huerfanos.slice(0,4).map((o)=>o.key).join(", ")}`);
console.log(`  cues over sin componente asignado: 0 ✓`);
const cueEl = (c) => {
  if (c.cta) return `<Cta qr="img/${SLUG}_qr.png" dominio="drfederer.com" sinSalida={${!!c.sinSalida}} />`;
  if (c.lamina) return `<Lamina src="img/${SLUG}_lamina.png" zoom=${esc(c.zoom)} />`;
  if (c.comp) return `<${c.comp} {...(${JSON.stringify(c.props)} as any)} />`;
  if (c.tipoAsset === "clip") return `<Clip src=${esc(c.src)} seed={${c.seed}} frames={${c.frames}} />`;
  return `<Foto src=${esc(c.src)} seed={${c.seed}} />`;
};
const todos = [...base, ...over];
const cues = `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, Lamina, Cta, NumeroSenal, ListaNumerada, DosLados, Plazo, DatoGrande, Checklist } from "./Piezas";

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (f: number) => React.ReactNode };

export const CUES_${SLUG.toUpperCase()}: Cue[] = [
${todos.map((c) => `  { key: ${esc(c.key)}, start: ${c.start}, dur: ${c.dur}, capa: ${esc(c.capa)}, el: () => (${cueEl(c)}) },`).join("\n")}
];
`;
fs.writeFileSync(`${dir}/cues_${SLUG}.gen.tsx`, cues);

const main = `// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_${SLUG.toUpperCase()} } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_FRAMES};
const AVATAR_FRAMES = ${AVATAR_FRAMES};

/** El avatar es el PISO garantizado del video: base FULL, y el b-roll se apoya encima. El creador
 *  grabó ${(AVATAR_END_MS / 60000).toFixed(0)} de los ${(TOTAL_MS / 60000).toFixed(0)} minutos, así que a partir de ahí corre EN BUCLE y MUDO.
 *  ⛔ \`OffthreadVideo\`, NUNCA \`<Video>\`: al renderizar, \`<Video>\` busca POR TIEMPO y devuelve
 *     cuadros equivocados de forma IRREGULAR — es la causa #1 del "se ve todo lageado".
 *  ⛔ Y NUNCA estático: un avatar full quieto se lee como una videollamada. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#14170F", overflow: "hidden" }}>
      <Loop durationInFrames={AVATAR_FRAMES}>
        <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Loop>
    </AbsoluteFill>
  );
};

export const Main${SLUG[0].toUpperCase()}${SLUG.slice(1)}: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#14170F" }}>
      <AvatarPiso />
      {CUES_${SLUG.toUpperCase()}.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_${SLUG.toUpperCase()}.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${SLUG}.m4a")} />
    </AbsoluteFill>
  );
};
`;
fs.writeFileSync(`${dir}/Main_${SLUG}.tsx`, main);

// ⛔ COMPUERTA: ningún `<Video>` en el rig. Se filtran los COMENTARIOS antes de buscar, o el propio
//    comentario de advertencia dispara un falso positivo (ya pasó).
for (const f of [`${dir}/Piezas.tsx`, `${dir}/Main_${SLUG}.tsx`, `${dir}/cues_${SLUG}.gen.tsx`]) {
  const src = fs.readFileSync(f, "utf8").split("\n")
    .filter((L) => { const s = L.trim(); return !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*"); }).join("\n");
  if (src.includes("<Video ") || src.includes("<Video>")) die(`<Video> en ${f} — usar OffthreadVideo`);
}
console.log(`  <Video> en el rig: 0 ✓`);

// ── 8. LISTA DE ASSETS (con los hermanos _blur) ──────────────────────────────────────────────
const assets = new Set([`${SLUG}_opt.mp4`, `${SLUG}.m4a`]);
for (const c of base) if (c.src) assets.add(c.src);
assets.add(`img/${SLUG}_lamina.png`);
assets.add(`img/${SLUG}_qr.png`);
for (const a of [...assets]) if (a.startsWith("img/")) assets.add(a.replace(/\.(png|jpe?g)$/i, "_blur.jpg"));
const faltan = [...assets].filter((a) => !fs.existsSync(path.join("public", a)));
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].sort().join("\n") + "\n");
console.log(`\nassets: ${assets.size} (con los _blur) · faltan en disco: ${faltan.length}`);
for (const f of faltan.slice(0, 10)) console.log(`   falta: ${f}`);
console.log(`TOTAL_FRAMES = ${TOTAL_FRAMES}  (${(TOTAL_FRAMES / FPS / 60).toFixed(1)} min)`);
