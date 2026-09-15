// gen_fcspellizco_plan.mjs — DIRECTOR → _v3/fcspellizco_plan.json
//   canal Federer Consejos Salud · "Si te PELLIZCAS el Cuello y se Queda Así…" · AVATAR PROPIO (AvatarForever FP8)
//
//   node gen_fcspellizco_plan.mjs     # momentos (ya anclados al ms) + assets en disco -> plan
//   node build_fcspellizco.mjs        # plan -> cues + Main + index + avatar_fcspellizco.gen.ts + assets
//
// ⛔ AVATAR POR VENTANAS (feedback_avatar_full_cada_30s_frases_clave): el avatar NO es fondo. Se ve SÓLO en
//    los momentos de AVATAR_FRAGS (frases clave), full-frame, y AvatarForever renderiza sólo esas ventanas.
//    Regla del creador: hueco máximo ~30 s entre dos apariciones, y en las frases MÁS importantes.
//    La compuerta de 30 s la corre el build (mide sobre frames reales).
// ⛔ Un momento sin beat base = avatar a la vista. Por eso TODO momento que no es de avatar lleva beat.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino.
// ⭐ CTA: RayCta como OVERLAY con el QR REAL de drfederer.com. Sin precio.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "farinon";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8", timeout: 30000 }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
if (MOM.some((m) => m.t === undefined)) {
  console.error("⛔ los momentos todavía no tienen `t`/`dur`: falta anclar al ms con el ASR del máster");
  process.exit(1);
}
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);
const REAL = fs.existsSync(`_v3/${SLUG}_real.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_real.json`, "utf8")) : {};

import { COMPS, AVATAR_FRAGS, LAMINA_FOCOS, LAMINA_SRC } from "./_v3/farinon_director.mjs";
const LAM = new Map(Object.entries(LAMINA_FOCOS).map(([k, v]) => [+k, v]));

const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};

// ── BEATS ──────────────────────────────
// ⛔ pacing medido: con 6,5 s la mediana de planos daba 7,2 s y el p75 10,9 s (regla: 3,5-4,5 / ~40 % ≥5 s).
//    Partir desde 4,8 s: la 2ª mitad repite el MISMO asset en la otra forma (clip→foto). No mueve las ventanas del avatar.
const PARTIR_S = 4.8;
const CLIP_DIR = `broll/${SLUG}`;
const REDIBUJADO = new Set(fs.existsSync(`_v3/${SLUG}_redibujados.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_redibujados.json`, "utf8")) : []);
const GENTE = new Set(fs.existsSync(`_v3/${SLUG}_haygente.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_haygente.json`, "utf8")) : []);

const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { if (anclas.has(k)) console.error(`⛔ ancla COLISIONADA en el momento ${k}: "${c.frag}"`); compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla colisionada`); process.exit(1); }

const AVATAR_I = new Set();
const avatarChoca = [];
// ⛔ sólo un componente BASE tapa al avatar: un overlay (VetSenal, RayCta) flota ENCIMA del presentador.
// Si la frase de avatar cae en el momento de un componente base, se corre al vecino libre más cercano
// (antes y después), en vez de perder la aparición: el choque costaba 7 apariciones en este guion.
const anclasBaseComp = new Set([...compAt].filter(([, c]) => !c.overlay).map(([k]) => k));
const movidas = [];
for (const f of AVATAR_FRAGS) {
  const k = buscar(f);
  if (k < 0) { console.error(`⛔ ancla de avatar no encontrada: "${f}"`); process.exit(1); }
  if (!anclasBaseComp.has(k)) { AVATAR_I.add(k); continue; }
  const libre = [k - 1, k + 1].find((j) => j > 0 && j < MOM.length && !anclasBaseComp.has(j) && !AVATAR_I.has(j));
  if (libre === undefined) { avatarChoca.push(f); continue; }
  AVATAR_I.add(libre);
  movidas.push(`${k}→${libre}`);
}
if (movidas.length) console.log(`anclas de avatar corridas al momento vecino por chocar con un componente base: ${movidas.join(" · ")}`);

// ── RELLENO DE CONEXIÓN (regla del creador: nunca >30 s sin el presentador) ─────────────────────────
// Medido en la 1ª corrida: con 56 frases a mano quedaban 31 tramos >30 s (hasta 220 s) y el avatar al 11 %.
// Se agregan momentos de avatar dentro de cada hueco hasta que ninguno pase GAP_OBJ, eligiendo la frase que
// MÁS pide la cara (arranque de sección, pregunta, hablarle al espectador) cerca de la mitad del hueco.
// No se eligen: anclas de componente, momentos con metraje real, ni momentos que un componente base absorbe.
{
  const GAP_OBJ = 31;
  const bloqueados = new Set();
  const pisoDe = (c) => Math.min(13, 2.8 + 0.28 * Math.max(0, palabrasPre(c.props) - 3));
  function palabrasPre(p) {
    return Object.values(p).flatMap((v) => typeof v === "string" ? v.split(/\s+/)
      : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;
  }
  for (const [k, c] of compAt) {
    if (c.overlay) continue;
    bloqueados.add(k);
    const fin = MOM[k].t + Math.max(MOM[k].dur, pisoDe(c));
    for (let j = k + 1; j < MOM.length && MOM[j].t < fin; j++) bloqueados.add(j);
  }
  const puntaje = (m, j) => {
    let s = 0;
    if (j > 0 && MOM[j - 1].sec !== m.sec) s += 3;
    if (m.txt.includes("?")) s += 2;
    if (/\b(tú|te|tu|ti|contigo|fíjate|mira|escúchame|ahorita)\b/i.test(m.txt)) s += 1;
    if (m.dur >= 3 && m.dur <= 8) s += 1;
    return s;
  };
  const agregados = [];
  const imposibles = new Set();   // huecos sin candidato: se anotan y se sigue con los demás (antes cortaba TODO)
  let conReal = 0;
  for (let vuelta = 0; vuelta < 600; vuelta++) {
    const marcas = [...AVATAR_I].map((i) => ({ a: MOM[i].t, z: MOM[i].t + MOM[i].dur })).sort((x, y) => x.a - y.a);
    const huecos = [];
    let prevZ = 0;
    for (const w of marcas) { if (w.a - prevZ > GAP_OBJ) huecos.push({ a: prevZ, z: w.a }); prevZ = Math.max(prevZ, w.z); }
    if (TOTAL_S - prevZ > GAP_OBJ + 12) huecos.push({ a: prevZ, z: TOTAL_S - 12 });
    const pendientes = huecos.filter((h) => !imposibles.has(h.a.toFixed(1))).sort((x, y) => (y.z - y.a) - (x.z - x.a));
    if (!pendientes.length) break;
    const peor = pendientes[0];
    const mitad = (peor.a + peor.z) / 2;
    const base = (m, j) => m.t > peor.a + 4 && m.t + m.dur < peor.z - 4 && !AVATAR_I.has(j) && !bloqueados.has(j) && !anclas.has(j) && !LAM.has(j);
    let cands = MOM.map((m, j) => ({ m, j })).filter(({ m, j }) => base(m, j) && !REAL[String(m.i)]);
    // sin otro remedio, la CARA gana al metraje de stock: un minuto sin el presentador pierde la conexión
    if (!cands.length) { cands = MOM.map((m, j) => ({ m, j })).filter(({ m, j }) => base(m, j)); if (cands.length) conReal++; }
    if (!cands.length) { imposibles.add(peor.a.toFixed(1)); console.log(`  ⚠ hueco ${peor.a.toFixed(0)}s→${peor.z.toFixed(0)}s sin momento libre (todo bajo componentes)`); continue; }
    cands.sort((x, y) => (puntaje(y.m, y.j) - Math.abs(y.m.t - mitad) / 6) - (puntaje(x.m, x.j) - Math.abs(x.m.t - mitad) / 6));
    AVATAR_I.add(cands[0].j);
    agregados.push(cands[0].j);
  }
  console.log(`relleno de conexión: ${agregados.length} momentos de avatar agregados (${conReal} sobre metraje real) · huecos imposibles ${imposibles.size} · objetivo ≤ ${GAP_OBJ}s · total avatar ${AVATAR_I.size}`);
}
if (!AVATAR_I.has(0)) { console.error("⛔ el momento 0 no es de avatar: el video tiene que ABRIR con el presentador hablando"); process.exit(1); }
console.log(`avatar: ${AVATAR_I.size} momentos reservados · ${avatarChoca.length} anclas cedidas a un componente${avatarChoca.length ? " (" + avatarChoca.join(" | ") + ")" : ""}`);

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const cedidos = [];
const anclasBase = new Set();
const overlaysPre = [];
for (const [k, c] of compAt) {
  if (!c.overlay) { anclasBase.add(k); continue; }
  const m = MOM[k];
  const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
  overlaysPre.push({ componente: c.comp, props: c.props,
    ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
}
for (const [k, c] of [...compAt]) if (c.overlay) compAt.delete(k);
console.log(`overlays emitidos en pasada previa: ${overlaysPre.length}`);

let absorbidos = 0, reales = 0, avatarBeats = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const n3 = String(m.i).padStart(3, "0");
  const img = `img/${SLUG}_${n3}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${n3}.mp4`;
  const real = REAL[String(m.i)];

  const cBase = compAt.get(i);
  if (cBase && !cBase.overlay) {
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(cBase.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    const comidos = [];
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      if (anclasBase.has(j)) { console.error(`⛔ ${cBase.comp} (momento ${i}) absorbe el ancla del componente del momento ${j}. Movelo de frase.`); process.exit(1); }
      // ⛔ con avatar por VENTANAS, el momento de avatar CORTA al componente (antes le cedía el lugar y
      //    abría un hueco de 35-50 s sin la cara por décimas de tiempo de lectura: momentos 149·261·313·404).
      if (AVATAR_I.has(j)) { cedidos.push(`${j}(corta ${(out - MOM[j].t).toFixed(1)}s)`); out = MOM[j].t; break; }
      MOM[j].__skip = true; comidos.push(j);
    }
    const ult = comidos[comidos.length - 1];
    let colaDe = null;
    if (ult !== undefined && MOM[ult].t + MOM[ult].dur > out + 2) { colaDe = ult; MOM[ult].__skip = false; MOM[ult].__desde = out; }
    if (colaDe === null) {
      // ⛔ en fcstaza9 el componente se estiraba hasta el próximo momento NO-avatar porque el avatar era
      //    FONDO. Acá el avatar son VENTANAS: estirarse por encima de un momento de avatar lo tapaba
      //    (medido: 11 huecos >30 s con las frases de avatar ya reservadas). Corta en el próximo momento, sea cual sea.
      const sig = MOM.find((x) => x.t >= out && !x.__skip);
      if (sig) out = Math.max(out, sig.t);
    }
    // cama de foto bajo todo componente (regla 2.quater)
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: cBase.comp, props: { ...cBase.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  if (LAM.has(i)) {
    const prevK = [...LAM.keys()].filter((x) => x < i).pop();
    const from = prevK !== undefined && prevK === i - 1 ? LAM.get(prevK) : undefined;
    beats.push({ tipo: "lamina", ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + m.dur) * 1000), src: LAMINA_SRC, from, to: LAM.get(i) });
    continue;
  }
  if (AVATAR_I.has(i)) { avatarBeats++; continue; }

  const ms_in = Math.round((m.__desde ?? m.t) * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);

  // 1) METRAJE REAL primero (auditado con visión)
  if (real && existe(`broll/${real}.mp4`)) {
    const rd = durDe(`broll/${real}.mp4`);
    const usable = rd - 0.15;
    const largoR = (ms_out - ms_in) / 1000;
    reales++;
    if (largoR > PARTIR_S) {
      const corte = ms_in + Math.round((ms_out - ms_in) * 0.55);
      const dC = (corte - ms_in) / 1000;
      if (dC <= usable) beats.push({ tipo: "clip", ms_in, ms_out: corte, clip: real });
      else beats.push({ tipo: "clipslow", ms_in, ms_out: corte, rate: Math.min(1, Math.max(0.45, usable / dC)), clip: real });
      beats.push({ tipo: "imagen", ms_in: corte, ms_out, imagen: `${SLUG}_${n3}` });
      continue;
    }
    if (largoR <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: real });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / largoR)), clip: real });
    continue;
  }

  // 2) clip de agnes (salvo redibujado o con gente inventada) · 3) la foto
  const cd = (existe(clip) && !REDIBUJADO.has(m.i) && !GENTE.has(m.i)) ? durDe(clip) : 0;
  const rel = `${SLUG}/${SLUG}_${n3}`;
  const nombreImg = `${SLUG}_${n3}`;
  const largoS = (ms_out - ms_in) / 1000;

  if (largoS > PARTIR_S && cd > 0.8) {
    const corte = ms_in + Math.round((ms_out - ms_in) * 0.55);
    const durClip = (corte - ms_in) / 1000;
    const usable = cd - 0.15;
    if (durClip <= usable) beats.push({ tipo: "clip", ms_in, ms_out: corte, clip: rel });
    else beats.push({ tipo: "clipslow", ms_in, ms_out: corte, rate: Math.min(1, Math.max(0.45, usable / durClip)), clip: rel });
    const dB = (ms_out - corte) / 1000;
    const sB = Math.max(0.6, Math.min(cd * 0.55, cd - dB - 0.3));
    if (sB + dB <= cd - 0.2 && sB > 0.6 + durClip * 0.5) beats.push({ tipo: "clip", ms_in: corte, ms_out, clip: rel, startFrom: +sB.toFixed(2) });
    else beats[beats.length - 1].ms_out = ms_out;   // clip corto: el 1er tramo se estira (rate lo cubre el build)
    continue;
  }
  if (cd > 0.8) {
    const usable = cd - 0.15;
    if (largoS <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: rel });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / largoS)), clip: rel });
  } else if (largoS > 6.0) {
    const corte = ms_in + Math.round((ms_out - ms_in) * 0.5);
    beats.push({ tipo: "imagen", ms_in, ms_out: corte, imagen: nombreImg });
    beats.push({ tipo: "imagen", ms_in: corte, ms_out, imagen: nombreImg });
  } else {
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: nombreImg });
  }
}

// ── CIERRE DE HUECOS: sólo entre beats CONTIGUOS. Los huecos de avatar se respetan.
beats.sort((a, b) => a.ms_in - b.ms_in);
const huecosAvatar = [];
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : Math.round((TOTAL_S + 1.2) * 1000);
  const hueco = sig - beats[i].ms_out;
  if (hueco <= 0) { beats[i].ms_out = sig; continue; }
  if (hueco < 900) { beats[i].ms_out = sig; continue; }
  huecosAvatar.push(+(hueco / 1000).toFixed(2));
}

console.log(`anclas de AVATAR que cedieron ante un componente que las absorbió: ${cedidos.length}${cedidos.length ? " (momentos " + cedidos.join(",") + ")" : ""}`);
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysPre };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
const segAvatar = huecosAvatar.reduce((a, b) => a + b, 0);
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`metraje REAL en ${reales} beats (${(100 * reales / beats.length).toFixed(0)} % de los beats)`);
console.log(`overlays: ${overlaysPre.length} · componentes distintos: ${new Set([...beats.filter((b) => b.tipo === "componente").map((b) => b.componente), ...overlaysPre.map((o) => o.componente)]).size}`);
console.log(`AVATAR a la vista (estimado): ${huecosAvatar.length} tramos · ${segAvatar.toFixed(0)}s (${(100 * segAvatar / TOTAL_S).toFixed(0)} % del video) · momentos reservados ${avatarBeats}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
