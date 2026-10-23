// clducha · TODO lo que cambia en el mundo, en segundos globales (= tiempo de la voz).
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const e = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export type Mark = { at: number; out: number; box: [number, number, number, number]; col?: string };
export type St = {
  night: boolean; black: number; sil: number; bleach: number; grey: number; wipeX: number; paste: number; pasteGrey: number; seal: number; water: number; bowl: number;
  cityCrust: number; cbleach: number; roots: number; rootGlow: number; dis: number; cloroRain: number; oxBubbles: number; cityPaste: number; drop: number; dropSink: number; sealCity: number;
  bookOpen: number; p53: boolean; marks: Mark[];
};
export const stateAt = (t: number): St => {
  if (t >= 107.9) return restState(t);
  const night = t < 15.95;
  // la junta se va poniendo negra (timelapse) mientras baja la linterna; "otra vez" = el blanco del cloro se va
  const black = t < 8.6 ? 1 : t < 15.95 ? 0.35 + 0.65 * e(t, 8.8, 11.8) : 1;
  const bleach = t >= 15.95 && t < 24 ? 1 - e(t, 21.1, 23.2) : 0;
  // la costra de la ciudad: el cloro la blanquea ARRIBA (las raíces siguen negras)
  const cloroRain = (t >= 33.6 && t < 37.2 ? e(t, 33.7, 34.1) : 0) + (t >= 67.6 && t < 73.8 ? e(t, 67.8, 68.2) : 0);
  const cbleach = t >= 33.6 && t < 37.2 ? e(t, 34.4, 35.8) : t >= 67.6 && t < 73.8 ? e(t, 68.6, 70.6) : 0;
  const rootGlow = (t >= 35.4 && t < 37.2 ? e(t, 35.5, 36.0) : 0) + (t >= 58.8 && t < 62.3 ? e(t, 59.2, 60.0) : 0) + (t >= 71.8 && t < 73.8 ? e(t, 71.9, 72.4) : 0);
  return {
    night, black, sil: black * 0.6, bleach, grey: 0, wipeX: -10, paste: 0, pasteGrey: 0, seal: 0, water: 0, bowl: 0,
    cityCrust: 1, cbleach, roots: 1, rootGlow, dis: 0, cloroRain, oxBubbles: 0, cityPaste: 0, drop: 0, dropSink: 0, sealCity: 0,
    bookOpen: e(t, 90.6, 92.4), p53: false,
    marks: [
      { at: 96.1, out: 106.3, box: [0.07, 0.482, 0.93, 0.523], col: "#ff8c1a" },
      { at: 99.74, out: 106.3, box: [0.07, 0.529, 0.5, 0.548], col: "#ff8c1a" },
      { at: 100.92, out: 106.3, box: [0.07, 0.812, 0.49, 0.895], col: "#2f8cff" },
    ],
  };
};

// ===== EL RESTO (107,9 s en adelante): cada cambio con la frase que lo dice =====
const on = (t: number, a: number, b: number, f = 0.4) => e(t, a, a + f) * (1 - e(t, b - f, b));
const restState = (t: number): St => {
  // la pared: gris opaca (jabón) · pasta (pasos 3-5) · la PASADA DE PLATA (538-541,6) · limpia desde 547 · sellada
  const grey = on(t, 216.5, 232) + 0.6 * on(t, 747.6, 754.4);
  const black = t < 547 ? (t >= 216.5 && t < 232 ? 0.2 : 1) : 0;
  const paste = t >= 455.7 && t < 537.4 ? e(t, 455.9, 458.7) * (1 - e(t, 535.6, 537.3)) : 0;
  const wipeX = t >= 538.2 && t < 547 ? -1.0 + 1.6 * e(t, 538.3, 541.6) : -10;
  return {
    night: false, black, sil: 0.6, bleach: 0, grey, wipeX, paste, pasteGrey: e(t, 505.5, 509.5), seal: e(t, 783.5, 788),
    water: on(t, 140.1, 143.7) + on(t, 594.1, 597.3), bowl: t >= 312 && t < 721 ? e(t, 312.2, 313.2) : 0,
    // la junta en corte: cloro (183-204) · moho vivo · pasta + oxígeno que baja (400-512) · el alambre se come la capa (671-686) · limpia y sellada (760+)
    cityCrust: t >= 760 ? 0 : t >= 671 && t < 686.5 ? 1 - 0.85 * e(t, 671.3, 672.6) : 1,
    cbleach: t >= 183 && t < 205 ? e(t, 184.5, 187.5) * (1 - e(t, 202.0, 204.5)) : 0,
    roots: t >= 760 ? 0 : 1,
    rootGlow: on(t, 155.2, 159.2, 0.8) + on(t, 170.0, 176.7, 0.8) + on(t, 197.0, 204.7, 0.8),
    dis: t >= 488 && t < 655 ? e(t, 490, 512) : 0,
    cloroRain: on(t, 183.3, 191.6),
    oxBubbles: on(t, 413.5, 424.6) + on(t, 488.6, 505.6),
    cityPaste: on(t, 399.8, 430) + (t >= 488 && t < 513 ? e(t, 488.2, 488.8) * (1 - e(t, 511.0, 512.5)) : 0),
    drop: on(t, 249.6, 257.4, 0.6) + on(t, 764.8, 771.5, 0.6) + on(t, 796.8, 800.3, 0.6),
    dropSink: t < 300 ? e(t, 253.2, 256) : e(t, 766, 768.5),
    sealCity: t >= 784 ? e(t, 784.2, 787) : 0,
    bookOpen: 1, p53: t >= 874.17,
    marks: [
      { at: 868.6, out: 874.0, box: [0.07, 0.482, 0.93, 0.523], col: "#ff8c1a" },
      { at: 871.2, out: 874.0, box: [0.07, 0.812, 0.49, 0.895], col: "#2f8cff" },
    ],
  };
};
