// c23 v2 · datos del minuto 1: planos (cámara + transición de salida), los 23 puntos sobre la casa y los SFX.
// Compartido por V2.tsx y la mezcla del farm (mix_v2.py).
export type Out = { type: "zoom" | "pull" | "whip"; d: number; fx?: number; fy?: number; vx?: number; vy?: number };
export type Shot = { id: string; img?: string; vid?: string; rate?: number; t0: number; t1: number; kb: number[]; keys?: number[][]; out: Out; z?: number };

export const SHOTS: Shot[] = [
  { id: "claudio_a", img: "claudio_a", t0: 0, t1: 1.3, kb: [1.12, 0.32, 0.42, 1.2, 0.3, 0.38], out: { type: "whip", d: 0.45, vy: -1 } },
  { id: "gota", img: "gota", vid: "gota", rate: 0.74, t0: 1.3, t1: 5.1, kb: [1.25, 0.5, 0.33, 1.45, 0.5, 0.55], out: { type: "whip", d: 0.5, vy: 1 } },
  { id: "cano", img: "cano", vid: "cano", rate: 0.8, t0: 5.1, t1: 8.95, kb: [1.15, 0.55, 0.45, 1.4, 0.54, 0.55], out: { type: "zoom", d: 0.35, fx: 0.55, fy: 0.8 } },
  { id: "hormigas", img: "hormigas", vid: "hormigas", rate: 1, t0: 8.95, t1: 10.1, kb: [1.1, 0.45, 0.5, 1.3, 0.42, 0.48], out: { type: "zoom", d: 0.25, fx: 0.3, fy: 0.4 } },
  { id: "moho", img: "moho", t0: 10.1, t1: 10.6, kb: [1.15, 0.45, 0.3, 1.3, 0.45, 0.25], out: { type: "whip", d: 0.25, vx: 1 } },
  { id: "oxido", img: "oxido", t0: 10.6, t1: 11.38, kb: [1.1, 0.48, 0.5, 1.35, 0.48, 0.5], out: { type: "zoom", d: 0.3, fx: 0.48, fy: 0.5 } },
  { id: "grieta", img: "grieta", t0: 11.38, t1: 13.45, kb: [1.05, 0.4, 0.5, 1.15, 0.45, 0.5], out: { type: "pull", d: 0.6 } },
  { id: "baratos", img: "baratos", t0: 13.45, t1: 20.1, kb: [1.15, 0.45, 0.4, 1.25, 0.55, 0.45], out: { type: "pull", d: 0.6 } },
  { id: "casa", img: "casa", t0: 20.1, t1: 27.65, kb: [1, 0.5, 0.5, 1, 0.5, 0.5],
    keys: [[20.1, 1.0, 0.5, 0.5], [22.8, 1.03, 0.5, 0.48], [25.4, 1.14, 0.58, 0.48], [26.15, 1.7, 0.45, 0.3], [26.95, 1.7, 0.82, 0.58], [27.65, 2.1, 0.83, 0.6]],
    out: { type: "zoom", d: 0.5, fx: 0.83, fy: 0.6 } },
  { id: "garaje", img: "garaje", t0: 27.65, t1: 31.2, kb: [1.05, 0.5, 0.55, 1.2, 0.47, 0.4], out: { type: "whip", d: 0.4, vx: -1 } },
  { id: "telefono", img: "telefono", t0: 31.2, t1: 36.1, kb: [1.1, 0.5, 0.55, 1.35, 0.52, 0.6], out: { type: "whip", d: 0.45, vx: 1 } },
  { id: "claudio_b2", img: "claudio_b2", t0: 36.1, t1: 44.6, kb: [1.05, 0.5, 0.42, 1.18, 0.5, 0.36], out: { type: "whip", d: 0.5, vy: 1 } },
  { id: "banco1", img: "banco", t0: 44.6, t1: 52.9, kb: [1, 0.5, 0.5, 1, 0.5, 0.5],
    keys: [[44.6, 1.0, 0.5, 0.5], [47.0, 1.22, 0.5, 0.5], [49.3, 1.04, 0.5, 0.5], [52.9, 1.2, 0.56, 0.5]],
    out: { type: "zoom", d: 0.45, fx: 0.62, fy: 0.5 } },
  { id: "albanil", img: "albanil", vid: "albanil", rate: 1, t0: 52.9, t1: 55.5, kb: [1.05, 0.5, 0.5, 1.2, 0.55, 0.5], out: { type: "whip", d: 0.35, vx: 1 } },
  { id: "plomero", img: "plomero", vid: "plomero", rate: 1, t0: 55.5, t1: 57.3, kb: [1.05, 0.4, 0.5, 1.2, 0.4, 0.5], out: { type: "whip", d: 0.35, vx: 1 } },
  { id: "taller", img: "taller", t0: 57.3, t1: 58.2, kb: [1.1, 0.5, 0.5, 1.2, 0.5, 0.5], out: { type: "pull", d: 0.5 } },
  { id: "banco2", img: "banco", t0: 58.2, t1: 62.75, kb: [1, 0.5, 0.5, 1, 0.5, 0.5],
    keys: [[58.2, 1.0, 0.5, 0.5], [60.2, 1.3, 0.62, 0.4], [62.75, 1.55, 0.62, 0.66]],
    out: { type: "pull", d: 0.3 } },
];

// los 23 arreglos sobre la foto de la casa (coordenadas 0-1 de la imagen)
export const PTS23: [number, number][] = [
  [0.3, 0.22], [0.38, 0.2], [0.49, 0.27], [0.58, 0.22], [0.66, 0.24], [0.25, 0.35], [0.45, 0.38], [0.7, 0.4],
  [0.23, 0.54], [0.47, 0.55], [0.6, 0.55], [0.35, 0.62], [0.53, 0.66],
  [0.83, 0.61], [0.9, 0.5], [0.78, 0.75],
  [0.15, 0.5], [0.3, 0.77], [0.2, 0.75], [0.4, 0.78], [0.6, 0.82], [0.88, 0.83], [0.5, 0.1],
];

// [t, archivo, volumen, duración] — bajos, la voz manda (duck 0,5 sobre palabras)
export type Ev = [number, string, number, number];
export const SFX2: Ev[] = [
  [1.1, "wh5", 0.14, 1.0], [2.05, "tk1", 0.1, 0.3], [2.98, "pop2", 0.1, 0.4],
  [4.85, "wh6", 0.14, 1.0], [6.5, "tk1", 0.1, 0.3], [7.46, "pop3", 0.1, 0.4],
  [8.8, "sw2", 0.12, 0.6], [9.95, "sw3", 0.12, 0.5], [10.48, "sw4", 0.12, 0.5], [11.25, "sw1", 0.12, 0.5], [12.55, "wind1", 0.08, 1.2],
  [13.15, "wh8", 0.14, 1.3], [16.2, "pop4", 0.12, 0.4], [17.56, "pop5", 0.12, 0.4], [18.7, "pop4", 0.12, 0.4],
  [19.8, "wh2", 0.12, 1.0], ...Array.from({ length: 23 }, (_, n): Ev => [20.68 + n * 0.06, "ck6", 0.05, 0.25]),
  [25.9, "sw5", 0.1, 0.6], [26.7, "sw6", 0.1, 0.6], [27.4, "wh3", 0.14, 1.0], [28.2, "ck3", 0.1, 0.4],
  [30.95, "sw7", 0.1, 0.6], [31.36, "pop1", 0.1, 0.4], [32.75, "rs1", 0.08, 2.6], [35.4, "st1", 0.1, 0.5],
  [35.85, "sw8", 0.1, 0.6], [44.35, "wh7", 0.12, 1.0], [47.2, "sp1", 0.08, 1.0], [49.3, "pp2", 0.14, 0.7],
  ...[50.0, 50.5, 51.0, 51.5, 52.0].map((t): Ev => [t, "pp3", 0.1, 0.5]),
  [52.65, "wh9", 0.12, 1.0], [55.3, "sw2", 0.1, 0.5], [57.1, "sw3", 0.1, 0.5], [57.95, "wh4", 0.12, 1.0], [60.3, "dg1", 0.08, 0.8],
];
