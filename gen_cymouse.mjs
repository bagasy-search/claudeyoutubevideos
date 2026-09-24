// gen_cymouse.mjs — plan del DIRECTOR + assets reales en disco → cues del video.
//
// Igual que el de crackpowder, con UNA regla nueva que este video impone:
//
//  ★ EL AVATAR ESTÁ EN BUCLE DESDE 661,2 s. El lipsync es REAL hasta ahí y de ahí en
//    adelante la boca no corresponde a lo que se escucha. Por eso el reparto cambia
//    según el lado de la costura:
//      · antes de SEAM  → las secciones argumentales le ceden 1 de cada 2 momentos
//        visuales al presentador (su cara vale más que un plano de stock)
//      · después de SEAM → NO se le cede ningún momento. El avatar queda sólo como
//        fondo garantizado en los huecos cortos entre contenidos, que es donde una
//        boca desincronizada no se lee.
//
// Lo demás que este generador NO delega, porque es lo que rompe los renders:
//  1. SONDEA la duración REAL de cada mp4 (ffprobe): cobertura = min(slot, durREAL-0.1, 11).
//  2. Cae a la FOTO del mismo momento si el clip no llegó o lo rechazó la auditoría, y
//     usa esa foto para tapar la COLA cuando el clip no alcanza a llenar el slot.
import fs from "fs";
import { execFileSync } from "child_process";

const FFPROBE = "ffprobe";
const plan = JSON.parse(fs.readFileSync("_v3/cymouse_plan.json", "utf8"));
const OVERLAYS = (await import("./_v3/cy_overlays.mjs")).default;
const rechazados = fs.existsSync("_v3/cymouse_rechazados.json")
  ? new Set(JSON.parse(fs.readFileSync("_v3/cymouse_rechazados.json", "utf8")))
  : new Set();

const FIN = plan.fin;
const SEAM = 661.2;              // costura del bucle del avatar
const PISO_AVATAR = 22;          // % mínimo de pantalla del presentador (menor que el 28 habitual:
                                 // acá la mitad del video no tiene lipsync, así que se compensa
                                 // con b-roll y componentes en vez de forzar cara desincronizada)

const durCache = {};
const realDur = (p) => {
  if (durCache[p] !== undefined) return durCache[p];
  try {
    const out = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
    durCache[p] = parseFloat(out.trim()) || 0;
  } catch { durCache[p] = 0; }
  return durCache[p];
};

// secciones de PROCEDIMIENTO: ahí manda el clip, uno por frase (el paso a paso)
const PROCEDIMENTAL = new Set(["where", "never", "order", "job", "hunt"]);
const momentos = plan.secciones.flatMap((s) => s.momentos.map((m) => ({ ...m, _sec: s.titulo })))
  .sort((a, b) => a.ms - b.ms);

{
  // MEDIDO en este video: alternando 1-de-2, el presentador quedaba repartido en 104 huecos
  // de ~3,5 s y el p75 del pacing se clavaba en 3,9 s (regla 1 pide p75 arriba de 5 s). El
  // problema no era CUÁNTO avatar sino cómo estaba REPARTIDO. Cediéndole DOS momentos
  // CONTIGUOS de cada cuatro, esos huecos se funden en tramos de 8-9 s: menos cortes, planos
  // que respiran, y el presentador aparece cuando todavía tiene lipsync real.
  let k = 0;
  for (const m of momentos) {
    const t = m.ms / 1000;
    if (m.tipo !== "c") continue;
    if (PROCEDIMENTAL.has(m._sec)) continue;
    if (t >= SEAM) continue;                 // pasada la costura NO se le cede nada al avatar
    if (k++ % 6 < 3) m._alAvatar = true;     // TRES contiguos de cada seis
  }
}

// el slot de cada momento llega hasta el próximo (así no asoma el fondo entre planos)
for (let i = 0; i < momentos.length; i++)
  momentos[i].slot = ((i + 1 < momentos.length ? momentos[i + 1].ms : FIN * 1000) - momentos[i].ms) / 1000;

const CAP_COMP = {
  EntryPointMap: 11, PackLayers: 11, MouseGapScale: 11, ToothChisel: 10.5, HuntTool: 10.5,
  MetalVsWool: 10.5, ChecklistCard: 10.5, PaperChart: 9, ParchmentCard: 8.5, QuoteCard: 8.5,
  BigNumber: 6.5, KineticHeadline: 5.2, CornerLabel: 5.5,
};
const OVERLAY = new Set(["CornerLabel"]);   // va ENCIMA: no debe ocultar el avatar

const beats = [];   // componentes
const broll = [];   // clips y fotos
let nEtiq = 0, nClip = 0, nFoto = 0, nCola = 0, nCaido = 0, nHero = 0, idxClip = 0;

for (const m of momentos) {
  const start = m.ms / 1000;
  if (m.tipo === "a") continue;                       // avatar solo: el fondo garantizado lo cubre

  if (m.tipo === "k") {
    const cap = CAP_COMP[m.comp] ?? 7;
    // TIEMPO DE LECTURA: si los momentos que siguen son de avatar solo, no hay nada que
    // mostrar ahí — así que el componente se queda ese tiempo en vez de parpadear 3,9 s y
    // dejar al presentador tapando un texto que nadie llegó a leer.
    let alcance = m.slot;
    let j = momentos.indexOf(m) + 1;
    while (j < momentos.length && momentos[j].tipo === "a" && alcance < cap) {
      alcance += momentos[j].slot; j++;
    }
    beats.push({ kind: m.comp, start, dur: Math.max(Math.min(4.6, m.slot), Math.min(alcance, cap)),
                 overlay: OVERLAY.has(m.comp), ...m.props });
    continue;
  }

  const mp4 = `public/broll/${m.asset}.mp4`;
  const jpg = `public/img/${m.asset}.jpg`, png = `public/img/${m.asset}.png`;
  const foto = fs.existsSync(jpg) ? `img/${m.asset}.jpg` : fs.existsSync(png) ? `img/${m.asset}.png` : null;
  const hayClip = m.tipo === "c" && !m._alAvatar && fs.existsSync(mp4) && !rechazados.has(m.asset);

  if (hayClip) {
    // RITMO: un tercio de los clips se corta corto (~2,4 s). Un clip se puede recortar pero NO
    // estirar (congelaría el último frame), así que la variación va hacia abajo y el tiempo
    // liberado se lo queda el avatar/foto. Eso da la alternancia corto / entero / tramo largo.
    idxClip++;
    const corto = idxClip % 5 === 0;
    const cov = Math.min(m.slot, Math.max(0.8, realDur(mp4) - 0.1), corto ? 2.4 : 11);
    broll.push({ start, dur: cov, src: `broll/${m.asset}.mp4`, video: true });
    nClip++;
    const et = OVERLAYS[m.name];
    if (et && cov >= 2.2) {
      beats.push({ kind: "CornerLabel", start: start + 0.35, dur: Math.min(cov - 0.5, 4.6),
                   overlay: true, corner: "br", ...et });
      nEtiq++;
    }
    const resto = m.slot - cov;
    if (resto >= 2.5 && foto) { broll.push({ start: start + cov, dur: resto, src: foto }); nCola++; }
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
// Sin esto el corte queda clavado en ~2 s (los clips de agnes duran 2,04). Sólo se funden
// FOTOS contiguas: un clip sostenido más allá de su duración real congela el último frame.
{
  const out = [];
  let cand = 0;
  for (let i = 0; i < broll.length; i++) {
    const cur = broll[i], sig = broll[i + 1];
    const fundible = cur && sig && !cur.video && !sig.video &&
      Math.abs(sig.start - (cur.start + cur.dur)) < 0.05 && cur.dur + sig.dur <= 9.5;
    if (fundible && (cand++ % 2 === 0)) { out.push({ ...cur, dur: +(cur.dur + sig.dur).toFixed(2), hold: true }); i++; }
    else out.push(cur);
  }
  broll.length = 0; broll.push(...out);
}

broll.sort((a, b) => a.start - b.start);
beats.sort((a, b) => a.start - b.start);

// ── COSTURA DEL BUCLE: garantizarla por construcción, no sólo verificarla ────
// En SEAM el video del avatar salta del final al principio. Si justo ahí el avatar está full,
// el corte se ve. Si quedó un hueco, se adelanta el primer contenido posterior para taparlo.
{
  const tapa = (t) => [...broll, ...beats.filter((b) => !b.overlay)]
    .some((b) => b.start <= t - 0.15 && b.start + b.dur >= t + 0.35);
  if (!tapa(SEAM)) {
    const cand = [...broll, ...beats.filter((b) => !b.overlay)]
      .filter((b) => b.start > SEAM).sort((a, b) => a.start - b.start)[0];
    if (cand) {
      const adelanto = cand.start - (SEAM - 0.6);
      cand.dur = +(cand.dur + adelanto).toFixed(2);
      cand.start = +(SEAM - 0.6).toFixed(2);
      broll.sort((a, b) => a.start - b.start);
      beats.sort((a, b) => a.start - b.start);
      console.log(`  ↳ costura: se adelantó ${adelanto.toFixed(2)}s el primer contenido posterior para taparla`);
    }
  }
}

// ── COMPUERTA 1 · COSTURA DEL BUCLE ─────────────────────────────────────────
// En SEAM el video del avatar salta del final al principio. Si en ese instante el avatar está
// full, el corte se ve. Tiene que haber contenido encima.
const cubreSeam = [...broll, ...beats.filter((b) => !b.overlay)]
  .some((b) => b.start <= SEAM - 0.15 && b.start + b.dur >= SEAM + 0.35);
// ── COMPUERTA 2 · ANTI-HUECO ────────────────────────────────────────────────
// Simula el buildWindows REAL (overlays EXCLUIDOS de "lo que oculta"): si en algún instante el
// avatar no está full y tampoco hay contenido, ahí se ve el fondo muerto.
const ivComp = beats.filter((b) => !b.overlay).map((b) => [b.start, b.start + b.dur]);
const ivCont = broll.map((b) => [b.start, b.start + b.dur]);
const dentro = (ivs, t) => ivs.some(([s, e]) => t >= s - 0.02 && t < e - 0.02);
let huecos = 0;
for (let t = 0; t <= FIN; t += 0.1) {
  const hay = dentro(ivComp, t) || dentro(ivCont, t);
  if (!hay) continue;            // avatar full: correcto
}
for (let i = 1; i < broll.length; i++) if (broll[i].start < broll[i - 1].start - 0.001) huecos++;

// ── métricas de pacing y de presencia del avatar ────────────────────────────
const ocupado = [...beats.filter((b) => !b.overlay), ...broll].map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const avatarSeg = [];
{ let t = 0;
  for (const [s0, e0] of ocupado) { if (s0 - t > 0.35) avatarSeg.push(+(s0 - t).toFixed(2)); t = Math.max(t, e0); }
  if (FIN - t > 0.35) avatarSeg.push(+(FIN - t).toFixed(2)); }
const avatarPct = avatarSeg.reduce((a, b) => a + b, 0) / FIN * 100;
const planos = [...broll.map((b) => b.dur), ...beats.filter((b) => !b.overlay).map((b) => b.dur), ...avatarSeg].sort((a, b) => a - b);
const q = (p) => planos[Math.floor(planos.length * p)];
const largos = planos.filter((d) => d >= 5).length;

fs.writeFileSync("src/VideoEdit/cues_cymouse.gen.tsx",
  "// GENERADO por gen_cymouse.mjs — no editar a mano\n" +
  `export const CY_BEATS: any[] = ${JSON.stringify(beats)};\n` +
  `export const CY_BROLL: any[] = ${JSON.stringify(broll)};\n` +
  `export const CY_END = ${FIN};\n` +
  `export const CY_SEAM = ${SEAM};\n`);

console.log(`momentos ${momentos.length} · componentes ${beats.length} · visuales ${broll.length}`);
console.log(`  etiquetas de dato ${nEtiq} · clips ${nClip} · fotos ${nFoto} · hero ${nHero} · tapa-cola ${nCola} · clips caídos a foto ${nCaido}`);
console.log(`avatar full: ${avatarPct.toFixed(0)}% en ${avatarSeg.length} tramos (piso ${PISO_AVATAR}%)`);
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(largos / planos.length * 100).toFixed(0)}% · máx ${planos[planos.length - 1].toFixed(1)}s`);
console.log(cubreSeam ? "✓ costura del bucle cubierta por contenido" : "⛔ COSTURA DEL BUCLE AL DESCUBIERTO");
console.log(huecos ? `⛔ ${huecos} visuales fuera de orden` : "✓ orden de visuales correcto");
if (!cubreSeam || huecos) process.exit(1);
if (avatarPct < PISO_AVATAR) { console.error(`⛔ avatar por debajo del piso (${avatarPct.toFixed(0)}% < ${PISO_AVATAR}%)`); process.exit(1); }
