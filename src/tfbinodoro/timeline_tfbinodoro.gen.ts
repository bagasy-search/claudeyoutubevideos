// STUB de prueba (lo pisa vlog/tfbinodoro/mktimeline.mjs)
export const TOTAL_FRAMES_TFBINODORO = 900;
export const AUDIO = "sfx/_silence.mp3";
export const LAM_SRC = "img/tfbinodoro/manualconstructorlibre.png";
export const QR_SRC = "img/tfbinodoro/qr_tfbinodoro.png";
export const COVER_SRC = "img/tfbinodoro/portada-coleccion.jpg";
export type Foot = { src?: string; img?: string; startFrom?: number; rate?: number };
export type Cue = { kind: "vid" | "lam"; src?: string; img?: string; from: number; dur: number; startFrom?: number; rate?: number;
  push?: { from: number; to: number; s0: number; s1: number; ox?: number; oy?: number }; punches?: { at: number; dur: number; s: number; ox?: number; oy?: number }[];
  shakes?: number[]; whipIn?: number; whipOut?: number; whipDir?: 1 | -1 };
export type Fx = { kind: string; from: number; dur: number; foot?: Foot; p?: Record<string, unknown> };
export const LAM_KEYS: [number, number, number, number][] = [[0, 0.5, 0.5, 1], [3, 0.3, 0.4, 1.8]];
const A = "img/tfbinodoro/test/h02_mitades.jpg", B = "img/tfbinodoro/test/h03_tomas_camara.jpg";
export const TL: Cue[] = [
  { kind: "vid", img: A, from: 0, dur: 150, shakes: [5] },
  { kind: "vid", img: B, from: 150, dur: 150, whipIn: 8 },
  { kind: "vid", img: A, from: 300, dur: 150 },
  { kind: "vid", img: B, from: 450, dur: 150 },
  { kind: "lam", from: 600, dur: 150 },
  { kind: "vid", img: A, from: 750, dur: 150 },
];
export const FX: Fx[] = [
  { kind: "zoom", from: 0, dur: 150, foot: { img: A }, p: { target: [{ f: 0, x: 0.52, y: 0.55 }], hideBase: true } },
  { kind: "step", from: 150, dur: 150, p: { n: 2, total: 5, label: "VINAGRE CALIENTE" } },
  { kind: "words", from: 150, dur: 150, p: { words: [{ t: "SIN" }, { t: "CAMBIAR", hl: true }, { t: "EL" }, { t: "INODORO", hl: true }] } },
  { kind: "xray", from: 300, dur: 150, foot: { img: A }, p: { crustFrom: 5, crustTo: 60, crustMax: 0.6, flushAt: 60, flushWeak: true, jetsBlocked: [1, 2, 4, 6], focus: "sifon", focusAt: 50, labels: { sifon: "EL SIFÓN" }, title: "Corte del inodoro" } },
  { kind: "jets", from: 450, dur: 80, foot: { img: B }, p: { blocked: [1, 2, 5, 6, 7, 10, 11, 13], clearAt: 50 } },
  { kind: "warn", from: 530, dur: 70, p: { mode: "never", items: [{ icon: "acido", label: "ÁCIDO" }, { icon: "cloro", label: "CLORO" }] } },
  { kind: "qr", from: 750, dur: 150, p: { line1: "LA COLECCIÓN", line2: "Escanea con tu teléfono" } },
  { kind: "stroke", from: 750, dur: 150, p: { kind: "arrow", a: { x: 0.2, y: 0.3 }, b: { x: 0.45, y: 0.55 }, label: "mira esto", labelAt: { x: 0.2, y: 0.24 } } },
  { kind: "warn", from: 300, dur: 100, p: { items: [{ icon: "guantes", label: "GUANTES" }, { icon: "lentes", label: "LENTES" }, { icon: "mascara", label: "MÁSCARA" }] } },
];
