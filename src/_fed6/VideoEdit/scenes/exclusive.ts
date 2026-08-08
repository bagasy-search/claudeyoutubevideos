// exclusive.ts — ESCENA EXCLUSIVA: que la capa de b-roll no se dibuje cuando algo full-screen la tapa.
//
// El problema que resuelve: los Main apilan capas ADITIVAS (CAPA 1 b-roll continuo → componentes →
// pizarra → avatar full). La capa de abajo NO se entera de que la tapan, así que los clips siguen
// corriendo y CORTANDO detrás de un componente opaco: se desperdicia render, y si la capa de arriba
// deja un borde/gap se ve el cruce. Además, cuando el componente termina, el b-roll aparece en un
// punto random del clip (salto raro).
//
// Uso en el Main (CAPA 1), aditivo y opcional:
//   const COVERED = mergeWindows([...compBeats.map(b => [b.start, b.start + compDur(b)] as Win),
//                                 [WB_START, WB_START + WB_DUR],
//                                 ...avatarFullWindows]);
//   {FEDZ_BROLL.filter((b) => !isCovered(b.start, b.dur, COVERED)).map(...)}
//
// Si no se usa, no cambia nada (por eso es seguro meterlo sin tocar los videos ya hechos).

export type Win = [number, number]; // [inicioSeg, finSeg]

/** Une ventanas solapadas/contiguas para no evaluar 200 rangos sueltos. */
export const mergeWindows = (wins: Win[], gap = 0.05): Win[] => {
  const ws = wins.filter((w) => w && w.length === 2 && w[1] > w[0]).sort((a, b) => a[0] - b[0]);
  const out: Win[] = [];
  for (const w of ws) {
    const last = out[out.length - 1];
    if (last && w[0] <= last[1] + gap) last[1] = Math.max(last[1], w[1]);
    else out.push([w[0], w[1]]);
  }
  return out;
};

/**
 * ¿El beat [start, start+dur] queda COMPLETAMENTE tapado por alguna ventana?
 * Sólo se saltea si está tapado ENTERO — si asoma aunque sea un pedazo, se dibuja igual
 * (mejor gastar un poco de render que dejar un hueco negro en pantalla).
 */
export const isCovered = (start: number, dur: number, covered: Win[], tol = 0.05): boolean =>
  covered.some(([s, e]) => start >= s - tol && start + dur <= e + tol);

/** Cuántos segundos de b-roll te ahorrás (para loguear el ahorro en el build). */
export const coveredSeconds = (beats: { start: number; dur: number }[], covered: Win[]): number =>
  beats.reduce((acc, b) => acc + (isCovered(b.start, b.dur, covered) ? b.dur : 0), 0);
