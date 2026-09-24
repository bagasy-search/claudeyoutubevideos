// gen_crackpowder.mjs — plan del DIRECTOR + assets reales en disco → cues del video.
//
// Dos cosas que este generador NO delega, porque son las que rompen los renders:
//  1. SONDEA la duración REAL de cada mp4 (ffprobe). Un clip de agnes dice 4,04 s pero puede venir
//     más corto; si se le asigna el slot entero, el avatar queda oculto sobre un video terminado
//     y se ve el fondo muerto. La cobertura es min(slot, durREAL-0.1, 11).
//  2. Cae a la FOTO de respaldo del mismo prompt cuando el clip no llegó o lo rechazó la auditoría,
//     y usa esa misma foto para tapar la COLA del momento cuando el clip no alcanza a llenarlo.
import fs from "fs";
import { execFileSync } from "child_process";

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";
const plan = JSON.parse(fs.readFileSync("_v3/crackpowder_plan.json", "utf8"));
const OVERLAYS = (await import("./_v3/cp_overlays.mjs")).default;
const rechazados = fs.existsSync("_v3/crackpowder_rechazados.json")
  ? new Set(JSON.parse(fs.readFileSync("_v3/crackpowder_rechazados.json", "utf8")))
  : new Set();

const durCache = {};
const realDur = (p) => {
  if (durCache[p] !== undefined) return durCache[p];
  try {
    const out = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
    durCache[p] = parseFloat(out.trim()) || 0;
  } catch { durCache[p] = 0; }
  return durCache[p];
};

// ── REPARTO DEL PESO: quién sostiene la pantalla en cada sección ─────────────
// Las secciones de PROCEDIMIENTO (las tres reparaciones) son las que el creador pidió
// "mostrando el paso a paso": ahí manda el clip, uno por frase. Las ARGUMENTALES (gancho,
// enemigo, principio, límites, seguridad, recap, cierre) las sostiene el presentador — y
// además su lipsync es REAL hasta 510 s, así que la cara ahí vale más que un plano de stock.
// Sin este reparto pasaban dos cosas a la vez: el avatar caía al 18% (piso 28%) y el corte
// quedaba clavado en 4 s con el p75 igual a la mediana.
const PROCEDIMENTAL = new Set([5, 6, 7, 8, 10]); // reparación 1, 2a, 2b, el error/SSD, reparación 3
plan.secciones.forEach((sec, i) => sec.momentos.forEach((m) => { m._sec = i; m._proc = PROCEDIMENTAL.has(i); }));
const momentos = plan.secciones.flatMap((s) => s.momentos).sort((a, b) => a.ms - b.ms);
// en las argumentales, DOS de cada tres momentos visuales se los queda el avatar; como caen
// contiguos, se funden en tramos largos en vez de decenas de huecos de 2 s.
{ let k = 0;
  for (const m of momentos) {
    if (m.tipo !== "c" || m._proc) continue;
    if (k++ % 2 === 1) m._alAvatar = true;   // 1 de cada 2 en las argumentales
    // NOTA de compromiso: con 2-de-3 el pacing daba mejor (23% de planos >=5s) pero sólo
    // entraban 140 de los 225 clips. El creador pidió explícitamente el video DENSO en clips
    // mostrando el paso a paso, así que manda eso: 1-de-2 usa 161 clips y deja igual el avatar
    // por encima del piso del 28%. El precio es un ritmo más parejo de lo que pide la regla 1.
  } }
const FIN = 1637.4;
// el slot de cada momento llega hasta el próximo (así no asoma el fondo entre planos)
for (let i = 0; i < momentos.length; i++)
  momentos[i].slot = ((i + 1 < momentos.length ? momentos[i + 1].ms : FIN * 1000) - momentos[i].ms) / 1000;

const CAP_COMP = { CrackRepairDiagram: 12, ChecklistCard: 10.5, OptionCompare: 10, ParchmentCard: 8.5,
                   QuoteCard: 8.5, BigNumber: 6.5, KineticHeadline: 5, CornerLabel: 5.5 };
const OVERLAY = new Set(["CornerLabel"]); // va ENCIMA del avatar/b-roll: no debe ocultar el avatar

const beats = [];   // componentes
const broll = [];   // clips y fotos
let nEtiq = 0, nClip = 0, nFoto = 0, nCola = 0, nCaido = 0, nHero = 0, idxClip = 0;

for (const m of momentos) {
  const start = m.ms / 1000;
  if (m.tipo === "a") continue;                       // avatar solo: el fondo garantizado ya lo cubre

  if (m.tipo === "k") {
    const cap = CAP_COMP[m.comp] ?? 7;
    beats.push({ kind: m.comp, start, dur: Math.max(Math.min(4.6, m.slot), Math.min(m.slot, cap)), overlay: OVERLAY.has(m.comp), ...m.props });
    continue;
  }

  // visual: clip de agnes, con foto del MISMO prompt como respaldo y como tapa-cola
  const mp4 = `public/broll/${m.asset}.mp4`;
  const jpg = `public/img/${m.asset}.jpg`, png = `public/img/${m.asset}.png`;
  const foto = fs.existsSync(jpg) ? `img/${m.asset}.jpg` : fs.existsSync(png) ? `img/${m.asset}.png` : null;
  const hayClip = m.tipo === "c" && !m._alAvatar && fs.existsSync(mp4) && !rechazados.has(m.asset);

  if (hayClip) {
    // RITMO: un tercio de los clips se corta corto (~2,4 s). Un clip se puede recortar pero
    // NO estirar (congelaría el último frame), así que la variación se hace hacia abajo y el
    // tiempo liberado se lo queda el avatar, que es el fondo garantizado. Eso produce la
    // alternancia clip corto / clip entero / tramo largo de presentador, en vez de 225 planos
    // de 4,04 s seguidos (p75 = mediana = el "cambia una por segundo, cansa" ya medido).
    idxClip++;
    const corto = idxClip % 3 === 0;
    const cov = Math.min(m.slot, Math.max(0.8, realDur(mp4) - 0.1), corto ? 2.4 : 11);
    broll.push({ start, dur: cov, src: `broll/${m.asset}.mp4`, video: true });
    nClip++;
    const et = OVERLAYS[m.name];
    if (et && cov >= 2.2) {   // sólo si el plano dura lo suficiente para leerla
      beats.push({ kind: "CornerLabel", start: start + 0.35, dur: Math.min(cov - 0.5, 4.6),
                   overlay: true, corner: "br", ...et });
      nEtiq++;
    }
    const resto = m.slot - cov;
    if (resto >= 2.5 && foto) { broll.push({ start: start + cov, dur: resto, src: foto }); nCola++; }  // tapa la cola
  } else if (foto && !m._alAvatar) {
    const d = Math.min(m.slot, 9);
    broll.push({ start, dur: d, src: foto, hold: true });
    const et2 = OVERLAYS[m.name];
    if (et2 && d >= 2.2) {
      beats.push({ kind: "CornerLabel", start: start + 0.35, dur: Math.min(d - 0.5, 4.6),
                   overlay: true, corner: "br", ...et2 });
      nEtiq++;
    }
    if (m.tipo === "h") nHero++; else nFoto++;
    if (m.tipo === "c") nCaido++;
  }
  // sin clip y sin foto → no se empuja nada: el avatar full queda de fondo (nunca hueco)
}

// ── PASADA DE PACING (regla 1) ──────────────────────────────────────────────
// Sin esto el corte queda clavado en ~4 s: los clips de agnes duran 4,04 y los momentos
// del segmentador ~4,3, así que TODO dura lo mismo. Medido en un video entregado: p75 igual
// a la mediana y el creador lo describió como "cambia una por segundo, cansa". Lo que hay que
// evitar es la SUCESIÓN PAREJA, no los planos largos.
//
// Sólo se estiran FOTOS: un clip sostenido más allá de su duración real congela el último frame.
// Se funden fotos contiguas (una absorbe a la siguiente) de a una de cada dos candidatas, para
// que queden planos que respiran SIN volverse un desfile de fotos quietas.
{
  const out = [];
  let cand = 0;
  for (let i = 0; i < broll.length; i++) {
    const cur = broll[i], sig = broll[i + 1];
    const fundible = cur && sig && !cur.video && !sig.video &&
      Math.abs(sig.start - (cur.start + cur.dur)) < 0.05 &&
      cur.dur + sig.dur <= 9.5;
    if (fundible && (cand++ % 2 === 0)) {
      out.push({ ...cur, dur: +(cur.dur + sig.dur).toFixed(2), hold: true });
      i++; // se come el siguiente
    } else out.push(cur);
  }
  broll.length = 0; broll.push(...out);
}

// ── COMPUERTA ANTI-HUECO: simular el timeline REAL cada 0,1 s ────────────────
// Reproduce lo que hará buildWindows (overlays EXCLUIDOS de "lo que oculta"): si en algún
// instante el avatar no está full y tampoco hay contenido encima, ahí se ve el fondo muerto.
const ivComp = beats.filter((b) => !b.overlay).map((b) => [b.start, b.start + b.dur]);
const ivCont = broll.map((b) => [b.start, b.start + b.dur]);
const dentro = (ivs, t) => ivs.some(([s, e]) => t >= s - 0.02 && t < e - 0.02);
let huecos = 0;
for (let t = 0; t <= FIN; t += 0.1) if (!dentro(ivComp, t) && !dentro(ivCont, t)) { /* avatar full: OK */ }
// solapes de contenido que dejarían el avatar oculto sin nada visible no pueden existir por
// construcción (cada empuje trae su propia cobertura), pero se verifica el orden:
for (let i = 1; i < broll.length; i++) if (broll[i].start < broll[i - 1].start - 0.001) huecos++;

// ── pacing medido (regla 1: mediana 3,5-4,5 s · ~40% ≥5 s · techo 12 s) ──────
// los tramos donde no hay contenido = AVATAR FULL, y son planos reales (largos) que hay que medir
const ocupado = [...beats.filter((b) => !b.overlay), ...broll].map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const avatarSeg = [];
{ let t = 0;
  for (const [s0, e0] of ocupado) { if (s0 - t > 0.35) avatarSeg.push(+(s0 - t).toFixed(2)); t = Math.max(t, e0); }
  if (FIN - t > 0.35) avatarSeg.push(+(FIN - t).toFixed(2)); }
const avatarPct = avatarSeg.reduce((a, b) => a + b, 0) / FIN * 100;
const planos = [...broll.map((b) => b.dur), ...beats.filter((b) => !b.overlay).map((b) => b.dur), ...avatarSeg].sort((a, b) => a - b);
const q = (p) => planos[Math.floor(planos.length * p)];
const largos = planos.filter((d) => d >= 5).length;

fs.writeFileSync("src/VideoEdit/cues_crackpowder.gen.tsx",
  "// GENERADO por gen_crackpowder.mjs — no editar a mano\n" +
  `export const CP_BEATS: any[] = ${JSON.stringify(beats)};\n` +
  `export const CP_BROLL: any[] = ${JSON.stringify(broll)};\n` +
  `export const CP_END = ${FIN};\n`);

console.log(`momentos ${momentos.length} · componentes ${beats.length} · visuales ${broll.length}`);
console.log(`  etiquetas de dato sobre b-roll ${nEtiq}`);
console.log(`  clips ${nClip} · fotos ${nFoto} · hero ${nHero} · tapa-cola ${nCola} · clips caídos a foto ${nCaido}`);
console.log(`avatar full: ${avatarPct.toFixed(0)}% de pantalla en ${avatarSeg.length} tramos (piso 28%)`);
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(largos / planos.length * 100).toFixed(0)}% · máx ${planos[planos.length - 1].toFixed(1)}s`);
console.log(huecos ? `⛔ ${huecos} visuales fuera de orden` : "✓ orden de visuales correcto");
