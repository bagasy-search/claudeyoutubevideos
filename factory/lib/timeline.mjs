// timeline.mjs — MEDICIÓN de una línea de tiempo ya armada (cues base + ventanas de avatar).
// La usan el build (compuerta) y factory/tools/medir_timeline.mjs (auditar videos ya entregados).
//
// ⛔⛔ Lo que ninguna compuerta vieja miraba: "avatar VISIBLE tapado". En tcbriquetas un plano se
// estiraba hasta 4 s encima de la ventana de avatar ya empezada → 92 de 177 s de lipsync pagado quedaron
// debajo de b-roll, con todas las compuertas en verde (project_video_fcscolageno: el anti-hueco no lo ve).
export function medirTimeline({ base, ventanas, total, fps = 30, bordeF = 12, paso = 1 }) {
  if (!(total > 0)) throw new Error("medirTimeline: total=0");
  const cubre = new Uint8Array(total);
  for (const c of base) for (let f = Math.max(0, c.start); f < Math.min(total, c.start + c.dur); f++) cubre[f] = 1;
  const enVent = new Uint8Array(total);
  const interior = new Uint8Array(total);            // ventana sin sus `bordeF` cuadros de cada lado (J/L-cuts legítimos)
  for (const w of ventanas) {
    const a = Math.max(0, w.from), z = Math.min(total, w.from + w.dur);
    for (let f = a; f < z; f++) enVent[f] = 1;
    for (let f = a + bordeF; f < z - bordeF; f++) interior[f] = 1;
  }
  let ventF = 0, tapadoF = 0, tapadoInteriorF = 0, placaF = 0, cubiertoF = 0, avatarVistoF = 0;
  for (let f = 0; f < total; f += paso) {
    if (cubre[f]) cubiertoF++;
    if (enVent[f]) { ventF++; if (cubre[f]) tapadoF++; else avatarVistoF++; }
    if (interior[f] && cubre[f]) tapadoInteriorF++;
    if (!cubre[f] && !enVent[f]) placaF++;
  }
  // tapado por ventana (para decir DÓNDE)
  const peores = ventanas.map((w) => {
    let n = 0;
    for (let f = Math.max(0, w.from + bordeF); f < Math.min(total, w.from + w.dur - bordeF); f++) if (cubre[f]) n++;
    return { k: w.k, desdeSec: +(w.from / fps).toFixed(2), durSec: +(w.dur / fps).toFixed(2), tapadoSec: +(n / fps).toFixed(2) };
  }).filter((x) => x.tapadoSec > 0).sort((a, b) => b.tapadoSec - a.tapadoSec);
  const orden = [...base].sort((a, b) => a.start - b.start);
  let destellos = 0, repes = 0;
  for (let k = 1; k < orden.length; k++) {
    const g = orden[k].start - (orden[k - 1].start + orden[k - 1].dur);
    if (g > 0 && g <= 5 && !enVent[orden[k].start - 1]) destellos++;
    if (orden[k].src && orden[k].src === orden[k - 1].src) repes++;
  }
  const S = (n) => +((n * paso) / fps).toFixed(2);
  return {
    totalSec: +(total / fps).toFixed(2), cues: base.length, ventanas: ventanas.length,
    ventanaSec: S(ventF), avatarVistoSec: S(avatarVistoF), avatarTapadoSec: S(tapadoF), avatarTapadoInteriorSec: S(tapadoInteriorF),
    avatarTapadoPct: ventF ? +((100 * tapadoInteriorF) / ventF).toFixed(1) : 0,
    placaVistaSec: S(placaF), coberturaPct: +((100 * (cubiertoF + avatarVistoF)) / Math.ceil(total / paso)).toFixed(1),
    destellos, repesConsecutivos: repes, peoresVentanas: peores.slice(0, 8),
  };
}

/** Lee un build ya generado (formato tcfiltro/tcestufa/tcbriquetas): cues_<slug>.gen.tsx + Main_<slug>.tsx. */
export function parseBuildGenerado(genTsx, mainTsx) {
  const base = [];
  for (const m of genTsx.matchAll(/\{\s*key:\s*"([^"]+)",\s*start:\s*(\d+),\s*dur:\s*(\d+),\s*capa:\s*"(base|over)"[^\n]*?src="([^"]*)"/g)) {
    if (m[4] === "base") base.push({ key: m[1], start: +m[2], dur: +m[3], src: m[5] });
  }
  // cues base sin src (p.ej. componentes) también tapan
  for (const m of genTsx.matchAll(/\{\s*key:\s*"([^"]+)",\s*start:\s*(\d+),\s*dur:\s*(\d+),\s*capa:\s*"base"(?![^\n]*src=")/g)) base.push({ key: m[1], start: +m[2], dur: +m[3], src: null });
  const vm = mainTsx.match(/const VENTANAS = (\[[\s\S]*?\]);/);
  const ventanas = vm ? JSON.parse(vm[1]) : [];
  const tm = mainTsx.match(/TOTAL_FRAMES_\w+ = (\d+)/);
  return { base, ventanas, total: tm ? +tm[1] : 0 };
}
