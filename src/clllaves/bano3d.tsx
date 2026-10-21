// clllaves · EL MUNDO: un baño de hotel en corte de casa de muñecas (frente abierto), flotando sobre un bloque de suelo
// cortado como una maqueta: debajo del piso se ven las capas (tierra, grava, arcilla, la PIEDRA CALIZA con el agua
// subterránea) y la cañería abierta por la mitad que sube del agua al lavamanos. Al lado, un tramo del pasillo del hotel
// con el carrito de limpieza y LA GUÍA arriba. UNA escena y UNA cámara: de la llave al sarro, al subsuelo, al aireador,
// al carrito con la guía y de vuelta. Eventos clavados a la voz (segundos globales). Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
export const C1 = 80.0; // arranque del CTA1 (la cámara sale de la llave hacia el carrito)
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- puntos del mundo ----------------
export const FB: V3 = [0, 0.875, -1.43]; // base de la llave (donde el metal toca la loza)
export const PT = {
  base: FB,
  joint: [0.03, 0.878, -1.405] as V3,           // la junta metal/loza (anillo de sarro)
  spout: [0, 0.99, -1.33] as V3,
  aer: [0, 0.962, -1.258] as V3,                 // boca del aireador
  mirror: [0.16, 1.55, -1.53] as V3,
  jet: [0.06, 0.86, -1.18] as V3,
  lime: [-0.6, -3.0, 1.62] as V3,                // la caliza en el corte
  water: [-1.0, -3.62, 1.62] as V3,              // agua subterránea
  pipe: [-1.6, -2.0, 1.72] as V3,
  book: [3.3, 0.965, 0.3] as V3,
  cart: [3.3, 0.6, 0.3] as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const c = C1;
export const KEYS: Key[] = [
  // B · el chorro torcido salpicando (desde el portal del avatar)
  { t: 3.4, p: [0.46, 1.2, -0.66], l: [0.02, 0.95, -1.3], fov: 37 },
  { t: 6.6, p: [0.33, 1.13, -0.84], l: [0.02, 0.93, -1.32], fov: 34 },
  // D · "mira la base de la llave": baja a la costra
  { t: 8.8, p: [0.3, 1.1, -0.9], l: [0, 0.93, -1.36], fov: 34 },
  { t: 10.6, p: [0.13, 0.94, -1.2], l: [0, 0.888, -1.42], fov: 30 },
  { t: 11.3, p: [0.1, 0.92, -1.27], l: [0, 0.886, -1.43], fov: 30 },
  // I · "eso no es mugre, es piedra": macro que orbita la costra
  { t: 28.2, p: [0.13, 0.935, -1.27], l: [0, 0.89, -1.43], fov: 30 },
  { t: 31.0, p: [0.025, 0.928, -1.245], l: [0, 0.89, -1.43], fov: 28 },
  { t: 33.7, p: [-0.11, 0.925, -1.28], l: [0, 0.89, -1.43], fov: 26 },
  // O · "sin rayar nada, en 10 minutos": la costra se disuelve, órbita de la llave limpia
  { t: 56.1, p: [0.34, 1.08, -0.94], l: [0, 0.95, -1.38], fov: 32 },
  { t: 59.7, p: [-0.3, 1.06, -0.97], l: [0, 0.95, -1.38], fov: 32 },
  // Q · "dónde se esconde la piedra": la cámara sale del baño y se ve la maqueta entera con el subsuelo
  { t: 62.3, p: [0.3, 1.12, -0.85], l: [0, 0.95, -1.35], fov: 34 },
  { t: 63.4, p: [0.6, 1.35, 0.6], l: [0.1, 0.85, -1.2], fov: 38 },
  { t: 64.6, p: [1.6, 1.6, 11.8], l: [1.3, -0.95, 0], fov: 42, arc: 0.3 },
  { t: 66.7, p: [1.15, 1.35, 11.0], l: [1.15, -0.95, 0], fov: 42 },
  // "la que le tuerce el chorro": se zambulle hasta el aireador, mirando para arriba
  { t: 67.95, p: [0.07, 0.855, -1.17], l: [0, 0.965, -1.258], fov: 36 },
  { t: 68.7, p: [0.065, 0.86, -1.175], l: [0, 0.965, -1.258], fov: 34 },
  // CTA1 · de la llave al carrito del pasillo con la guía
  { t: c, p: [0.32, 1.12, -0.86], l: [0, 0.94, -1.35], fov: 34 },
  { t: c + 0.4, p: [0.36, 1.14, -0.8], l: [0, 0.94, -1.35], fov: 35 },
  { t: c + 2.4, p: [2.95, 1.75, 2.5], l: [3.3, 0.95, 0.3], fov: 38, arc: 0.15 },
  { t: c + 4.2, p: [3.3, 1.52, 1.08], l: [3.3, 0.97, 0.3], fov: 34 },
  // "página 18": la tapa se abre (el avatar en videollamada a la izquierda: el libro corrido a la derecha)
  { t: c + 6.3, p: [3.34, 1.46, 0.78], l: [3.17, 0.965, 0.3], fov: 34 },
  { t: c + 11.8, p: [3.34, 1.43, 0.72], l: [3.19, 0.965, 0.3], fov: 33 },
  // cantidades: baja sobre la página
  { t: c + 12.4, p: [3.3, 1.39, 0.62], l: [3.3, 0.965, 0.33], fov: 32 },
  { t: c + 15.4, p: [3.3, 1.37, 0.6], l: [3.3, 0.965, 0.34], fov: 32 },
  // "el link está en la primera línea": se aleja un poco
  { t: c + 16.2, p: [3.3, 1.62, 1.22], l: [3.3, 1.0, 0.3], fov: 38 },
  { t: c + 18.66, p: [3.25, 1.64, 1.3], l: [3.3, 1.0, 0.3], fov: 38 },
  // "Ahora sí, vamos a la llave": vuelve volando a la llave
  { t: c + 20.4, p: [0.33, 1.11, -0.88], l: [0, 0.93, -1.35], fov: 34, arc: 0.12 },
  { t: c + 21.5, p: [0.3, 1.1, -0.9], l: [0, 0.93, -1.35], fov: 34 },
  // ======================= EL RESTO (100,8 → 912) =======================
  // "viene de abajo de la tierra": sale de la llave al frente de la maqueta y BAJA por el caño abierto hasta la napa en la caliza
  { t: 107.9, p: [0.3, 1.1, -0.9], l: [0, 0.92, -1.36], fov: 34 },
  { t: 109.6, p: [0.2, 0.2, 3.6], l: [-0.3, -0.9, 1.6], fov: 40, arc: 0.1 },
  { t: 112.0, p: [-1.0, -2.3, 3.3], l: [-1.55, -2.9, 1.6], fov: 40 },
  { t: 114.6, p: [-0.9, -3.25, 3.0], l: [-0.9, -3.62, 1.62], fov: 38 },
  // "200 gramos de piedra": sube con los minerales por el caño
  { t: 126.4, p: [-0.9, -3.0, 3.4], l: [-1.6, -3.3, 1.6], fov: 40 },
  { t: 132.5, p: [-0.2, -0.9, 3.6], l: [-0.6, -1.3, 1.6], fov: 40 },
  // "la gota que queda": el agua corre, se cierra, queda la gota en la base y en la boquita
  { t: 143.4, p: [0.32, 1.28, -0.7], l: [0, 0.8, -1.15], fov: 36 },
  { t: 146.6, p: [0.28, 1.2, -0.8], l: [0, 0.82, -1.2], fov: 35 },
  { t: 148.4, p: [0.12, 0.94, -1.22], l: [0, 0.885, -1.42], fov: 30 },
  { t: 150.4, p: [0.11, 0.935, -1.19], l: [0, 0.915, -1.32], fov: 32 },
  { t: 152.5, p: [0.16, 0.98, -1.08], l: [0, 0.89, -1.27], fov: 34 },
  // "una capa finita, mañana otra": la costra crece por capas → "si la cortara por la mitad": la tajada con los estratos
  { t: 161.8, p: [0.13, 0.935, -1.27], l: [0, 0.89, -1.43], fov: 30 },
  { t: 167.6, p: [-0.06, 0.93, -1.26], l: [0, 0.89, -1.43], fov: 30 },
  { t: 168.8, p: [0.0, 0.99, -1.13], l: [0, 0.962, -1.37], fov: 34 },
  { t: 173.7, p: [0.05, 0.985, -1.15], l: [0, 0.96, -1.38], fov: 33 },
  // "una rejilla que se llama aireador": debajo de la boquita, el aireador se desarma en el aire
  { t: 179.4, p: [0.16, 0.93, -1.1], l: [0, 0.95, -1.26], fov: 34 },
  { t: 183.0, p: [0.13, 0.9, -1.12], l: [0, 0.93, -1.258], fov: 34 },
  { t: 188.6, p: [0.11, 0.9, -1.13], l: [0, 0.925, -1.258], fov: 33 },
  // "por eso el chorro sale torcido"
  { t: 193.2, p: [0.36, 1.12, -0.8], l: [0.02, 0.9, -1.28], fov: 36 },
  { t: 199.0, p: [0.3, 1.05, -0.85], l: [0.02, 0.88, -1.28], fov: 34 },
  // la prueba de la gota de vinagre
  { t: 226.5, p: [0.12, 0.95, -1.24], l: [0, 0.89, -1.43], fov: 30 },
  { t: 232.0, p: [0.07, 0.93, -1.25], l: [0, 0.888, -1.43], fov: 28 },
  // "mire de qué es": al muestrario de acabados (mesada de mármol a la izquierda)
  { t: 264.2, p: [0.3, 1.12, -0.85], l: [0, 0.93, -1.35], fov: 34 },
  { t: 266.5, p: [-1.0, 1.35, 0.2], l: [-1.25, 0.95, -1.35], fov: 38, arc: 0.06 },
  { t: 268.9, p: [-1.1, 1.3, 0.0], l: [-1.25, 0.95, -1.35], fov: 36 },
  { t: 274.6, p: [-1.72, 1.12, -0.82], l: [-1.64, 0.97, -1.35], fov: 32 },
  { t: 281.5, p: [-0.8, 1.12, -0.82], l: [-0.86, 0.97, -1.35], fov: 32 },
  { t: 288.0, p: [-1.25, 1.3, -0.3], l: [-1.25, 0.95, -1.35], fov: 36 },
  // "le deja una mancha opaca": el mármol comido
  { t: 309.2, p: [-0.93, 1.06, -0.95], l: [-1.02, 0.86, -1.18], fov: 32 },
  { t: 313.5, p: [-0.92, 1.0, -1.0], l: [-1.02, 0.86, -1.18], fov: 30 },
  // PASO 1 · la boquita
  { t: 330.5, p: [0.4, 1.15, -0.75], l: [0, 0.97, -1.3], fov: 36 },
  { t: 337.0, p: [0.18, 1.0, -1.05], l: [0, 0.96, -1.27], fov: 34 },
  // la bolsita colgando, una hora
  { t: 362.5, p: [0.3, 1.05, -0.95], l: [0, 0.94, -1.27], fov: 34 },
  { t: 367.1, p: [0.22, 1.02, -1.0], l: [0, 0.94, -1.27], fov: 33 },
  // el chorro derecho
  { t: 384.0, p: [0.3, 1.0, -0.95], l: [0, 0.9, -1.28], fov: 34 },
  { t: 387.4, p: [0.26, 0.98, -0.98], l: [0, 0.9, -1.28], fov: 33 },
  // PASO 2 · la base
  { t: 413.0, p: [0.35, 1.15, -0.8], l: [0, 0.93, -1.35], fov: 36 },
  { t: 421.3, p: [0.13, 0.94, -1.22], l: [0, 0.888, -1.42], fov: 30 },
  // la venda de papel con vinagre
  { t: 432.0, p: [0.14, 0.95, -1.2], l: [0, 0.89, -1.42], fov: 30 },
  { t: 436.0, p: [-0.1, 0.95, -1.22], l: [0, 0.89, -1.42], fov: 30 },
  // "blanda, como tiza mojada"
  { t: 445.2, p: [0.1, 0.93, -1.27], l: [0, 0.886, -1.43], fov: 28 },
  { t: 450.0, p: [0.06, 0.925, -1.28], l: [0, 0.886, -1.43], fov: 27 },
  // el palillo por la junta
  { t: 465.0, p: [0.11, 0.92, -1.3], l: [0, 0.882, -1.43], fov: 27 },
  { t: 470.6, p: [-0.06, 0.92, -1.31], l: [0, 0.882, -1.43], fov: 27 },
  // SEQUE: el paño hasta que brille
  { t: 481.0, p: [0.3, 1.08, -0.95], l: [0, 0.95, -1.38], fov: 33 },
  { t: 486.8, p: [-0.25, 1.06, -0.98], l: [0, 0.95, -1.38], fov: 33 },
  // PASO 3 · la costra de años
  { t: 492.1, p: [0.3, 1.1, -0.9], l: [0, 0.92, -1.38], fov: 34 },
  { t: 498.0, p: [0.12, 0.95, -1.24], l: [0, 0.89, -1.43], fov: 30 },
  // CTA2 · vuela a la guía, se abre en la pág. 28 (baño ambiente por ambiente)
  { t: 531.0, p: [0.3, 1.1, -0.9], l: [0, 0.93, -1.36], fov: 34 },
  { t: 533.2, p: [2.6, 1.9, 2.6], l: [3.3, 0.95, 0.3], fov: 40, arc: 0.15 },
  { t: 536.4, p: [3.55, 1.52, 1.0], l: [3.25, 0.97, 0.3], fov: 36 },
  { t: 541.6, p: [3.2, 1.55, 0.9], l: [3.15, 0.965, 0.3], fov: 36 },
  { t: 547.0, p: [3.12, 1.5, 0.82], l: [3.15, 0.965, 0.3], fov: 35 },
  { t: 553.3, p: [3.3, 1.66, 1.1], l: [3.2, 0.97, 0.3], fov: 38 },
  // "miles de rayitas": macro del cromo rayado
  { t: 594.0, p: [0.1, 0.97, -1.3], l: [0, 0.95, -1.43], fov: 28 },
  { t: 600.4, p: [-0.06, 0.96, -1.32], l: [0, 0.95, -1.43], fov: 26 },
  // "le pone amarillas las gomitas"
  { t: 626.5, p: [0.12, 0.94, -1.25], l: [0, 0.89, -1.43], fov: 30 },
  { t: 632.8, p: [0.0, 0.935, -1.24], l: [0, 0.89, -1.43], fov: 29 },
  // error 5 · el mármol: la venda gotea sobre la mesada
  { t: 697.0, p: [-1.0, 1.25, -0.6], l: [-1.25, 0.92, -1.35], fov: 34 },
  { t: 702.9, p: [-1.45, 1.15, -0.85], l: [-1.4, 0.9, -1.35], fov: 32 },
  // "el metal de adentro, corroído"
  { t: 724.7, p: [0.13, 0.95, -1.25], l: [0, 0.9, -1.43], fov: 30 },
  { t: 731.0, p: [-0.1, 0.95, -1.26], l: [0, 0.9, -1.43], fov: 30 },
  // PARA QUE NO VUELVA
  { t: 763.0, p: [0.45, 1.2, -0.7], l: [0, 0.95, -1.33], fov: 36 },
  { t: 769.7, p: [0.3, 1.1, -0.85], l: [0, 0.94, -1.33], fov: 34 },
  // diez segundos de paño
  { t: 774.6, p: [-0.3, 1.1, -0.9], l: [0, 0.95, -1.38], fov: 34 },
  { t: 780.0, p: [0.25, 1.08, -0.95], l: [0, 0.95, -1.38], fov: 34 },
  // la cera: el agua resbala en gotas
  { t: 815.0, p: [0.18, 1.02, -1.15], l: [0, 0.98, -1.4], fov: 30 },
  { t: 821.6, p: [0.12, 1.0, -1.2], l: [0, 0.97, -1.38], fov: 29 },
  // la bolsita cada tres meses
  { t: 826.8, p: [-0.25, 1.05, -0.98], l: [0, 0.94, -1.27], fov: 34 },
  { t: 831.0, p: [-0.2, 1.03, -1.0], l: [0, 0.94, -1.27], fov: 33 },
  // EL REPASO: se aleja hasta la maqueta entera y la recorre
  { t: 845.0, p: [0.6, 1.4, 0.8], l: [0.1, 0.9, -1.2], fov: 38 },
  { t: 850.0, p: [1.5, 1.9, 9.5], l: [1.3, -0.6, 0], fov: 42, arc: 0.3 },
  { t: 854.8, p: [2.2, 1.6, 9.0], l: [1.4, -0.7, 0], fov: 42 },
  { t: 860.0, p: [2.3, 1.55, 8.9], l: [1.4, -0.7, 0], fov: 42 },
  { t: 872.3, p: [0.3, 1.7, 9.6], l: [1.1, -0.7, 0], fov: 42 },
  // CIERRE: la guía otra vez en la pág. 18 → vuelve a la llave con el chorro derecho
  { t: 895.2, p: [2.8, 1.8, 2.4], l: [3.3, 0.95, 0.3], fov: 38 },
  { t: 897.5, p: [3.25, 1.52, 0.88], l: [3.15, 0.965, 0.3], fov: 35 },
  { t: 902.5, p: [3.25, 1.48, 0.82], l: [3.15, 0.965, 0.3], fov: 34 },
  { t: 905.5, p: [0.4, 1.15, -0.8], l: [0, 0.93, -1.33], fov: 35, arc: 0.12 },
  { t: 912.5, p: [0.32, 1.1, -0.88], l: [0, 0.92, -1.33], fov: 34 },
];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- páginas REALES de la guía (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  const o = useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia");
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (t) => { flip.image = t.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
  return o;
};

// ---------------- texturas propias del baño ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useBathTex = () => useMemo(() => ({
  // azulejo de subte blanco con junta gris
  subway: mk(512, 512, (g) => {
    g.fillStyle = "#a9aaa6"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 16; r++) for (let c2 = -1; c2 < 5; c2++) {
      const x = c2 * 128 + (r % 2) * 64, y = r * 32, v = 236 + rnd(r * 9 + c2, 2) * 14;
      const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, `rgb(${v},${v},${v - 3})`); gr.addColorStop(1, `rgb(${v - 14},${v - 14},${v - 16})`);
      g.fillStyle = gr; g.fillRect(x + 3, y + 3, 122, 26);
    }
  }, [9, 7]),
  // piso de mosaico octogonal blanco con puntito negro (como la tapa de la guía)
  floor: mk(256, 256, (g) => {
    g.fillStyle = "#1c1d20"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) {
      const cx = c2 * 64 + 32, cy = r * 64 + 32, R = 30, k = R * 0.42;
      g.fillStyle = "#ecebe6"; g.beginPath();
      g.moveTo(cx - k, cy - R); g.lineTo(cx + k, cy - R); g.lineTo(cx + R, cy - k); g.lineTo(cx + R, cy + k); g.lineTo(cx + k, cy + R); g.lineTo(cx - k, cy + R); g.lineTo(cx - R, cy + k); g.lineTo(cx - R, cy - k); g.closePath(); g.fill();
    }
  }, [10, 7]),
  carpet: mk(256, 256, (g) => {
    g.fillStyle = "#6b2230"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#c9a35a"; g.lineWidth = 3;
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(k * 64 + 32, 8); g.lineTo(k * 64 + 56, 32); g.lineTo(k * 64 + 32, 56); g.lineTo(k * 64 + 8, 32); g.closePath(); g.stroke(); }
    for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(0,0,0,${0.08 * rnd(i, 3)})`; g.fillRect(rnd(i, 1) * 256, rnd(i, 2) * 256, 2, 2); }
  }, [4, 3]),
  paper: mk(256, 256, (g) => {
    g.fillStyle = "#e9dcc0"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(150,120,70,.16)"; g.fillRect(x, 0, 12, 256); }
  }, [4, 2]),
  // el CORTE del suelo: capas apiladas (proporciones reales del bloque de 7 x 4,6)
  strata: mk(1400, 920, (g) => {
    const band = (y0: number, y1: number, a: string, b: string) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, 1400, y1 - y0); };
    const Y = (u: number) => u * 200; // 200 px por metro, arriba = -0,2 m
    band(Y(0), Y(0.7), "#5b4331", "#4a3526");     // tierra
    band(Y(0.7), Y(1.4), "#7f7668", "#6c6457");   // grava
    band(Y(1.4), Y(2.2), "#9c6c49", "#8a5c3c");   // arcilla
    band(Y(2.2), Y(4.6), "#ddd2b5", "#cbbf9f");   // caliza
    // raíces y piedritas
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(30,20,12,${0.25 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 1400, rnd(i, 3) * Y(0.7), 3, 2); }
    for (let i = 0; i < 520; i++) { const v = 90 + rnd(i, 4) * 80; g.fillStyle = `rgb(${v},${v - 6},${v - 14})`; g.beginPath(); g.ellipse(rnd(i, 5) * 1400, Y(0.7) + rnd(i, 6) * Y(0.7), 3 + rnd(i, 7) * 7, 2 + rnd(i, 8) * 5, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(80,45,25,${0.2 + 0.2 * rnd(i, 3)})`; g.lineWidth = 2; g.beginPath(); const y = Y(1.4) + rnd(i, 1) * Y(0.8); g.moveTo(0, y); g.bezierCurveTo(400, y + 6 * rnd(i, 2), 900, y - 5, 1400, y + 3); g.stroke(); }
    // caliza: estratos finos + conchitas fósiles
    for (let i = 0; i < 46; i++) { g.strokeStyle = `rgba(150,130,95,${0.2 + 0.3 * rnd(i, 2)})`; g.lineWidth = 1 + rnd(i, 3) * 3; g.beginPath(); const y = Y(2.25) + i * 10.4; g.moveTo(0, y); g.bezierCurveTo(350, y + 8 * rnd(i, 4) - 4, 1000, y + 7 * rnd(i, 5) - 3, 1400, y); g.stroke(); }
    for (let i = 0; i < 70; i++) { const x = rnd(i, 6) * 1400, y = Y(2.3) + rnd(i, 7) * Y(2.2); g.strokeStyle = "rgba(120,100,70,.55)"; g.lineWidth = 2; g.beginPath(); for (let a = 0; a < 9; a++) g.arc(x, y, 2 + a * 0.9, a * 0.7, a * 0.7 + 0.7); g.stroke(); }
    // napa de agua dentro de la caliza (huecos llenos de agua)
    const wy = Y(3.25);
    const gw = g.createLinearGradient(0, wy, 0, wy + Y(0.45)); gw.addColorStop(0, "rgba(70,140,190,.0)"); gw.addColorStop(0.25, "rgba(70,140,190,.85)"); gw.addColorStop(0.75, "rgba(55,120,175,.9)"); gw.addColorStop(1, "rgba(55,120,175,0)");
    g.fillStyle = gw; g.fillRect(0, wy, 1400, Y(0.45));
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(230,225,205,${0.6 + 0.3 * rnd(i, 1)})`; g.beginPath(); g.ellipse(rnd(i, 2) * 1400, wy + Y(0.06) + rnd(i, 3) * Y(0.33), 8 + rnd(i, 4) * 26, 4 + rnd(i, 5) * 9, 0, 0, 6.3); g.fill(); }
  }),
  sky: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0d1117"); gr.addColorStop(0.45, "#2a3442"); gr.addColorStop(0.55, "#323d4c"); gr.addColorStop(1, "#0b0e12"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
  // mármol blanco con vetas grises (la mesada del muestrario)
  marble: mk(512, 512, (g) => {
    g.fillStyle = "#efede8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(110,110,115,${0.08 + 0.2 * rnd(i, 1)})`; g.lineWidth = 0.8 + rnd(i, 2) * 2.4; g.beginPath(); let x = rnd(i, 3) * 512, y = 0; g.moveTo(x, y); while (y < 512) { x += (rnd(i * 7 + y, 4) - 0.45) * 40; y += 18 + rnd(i + y, 5) * 20; g.lineTo(x, y); } g.stroke(); }
  }, [2, 1]),
  // la TAJADA de la costra: estratos finos, de abajo (viejo, amarillento) a arriba (nuevo, blanco) — una raya por semana
  slice: mk(512, 192, (g) => {
    for (let i = 0; i < 24; i++) { const y = 192 - (i + 1) * 8, k = i / 23, v = 200 + k * 50;
      g.fillStyle = `rgb(${v},${v - 10 + k * 8},${v - 40 + k * 30})`; g.fillRect(0, y, 512, 8);
      g.fillStyle = `rgba(120,100,60,${0.35 - k * 0.2})`; g.fillRect(0, y, 512, 1.4);
      for (let j = 0; j < 30; j++) { g.fillStyle = `rgba(255,255,250,${0.25 * rnd(i * 31 + j, 2)})`; g.fillRect(rnd(i * 31 + j, 3) * 512, y + rnd(j, i) * 7, 6 + rnd(j, 4) * 20, 1.5); } }
  }),
  // la boca del aireador vista de abajo: rejilla con agujeritos, la mayoría tapados de sarro
  aer: mk(256, 256, (g) => {
    g.fillStyle = "#9aa1a6"; g.fillRect(0, 0, 256, 256);
    let k = 0;
    for (let y = -6; y <= 6; y++) for (let x = -7; x <= 7; x++) {
      const px = 128 + (x + (y % 2 ? 0.5 : 0)) * 16, py = 128 + y * 14; if (Math.hypot(px - 128, py - 128) > 104) continue; k++;
      const plug = rnd(k, 3) < 0.72;
      g.fillStyle = plug ? `rgb(${226 + rnd(k, 4) * 20},${220 + rnd(k, 4) * 18},${200 + rnd(k, 5) * 16})` : "#121417";
      g.beginPath(); g.arc(px, py, plug ? 6.5 + rnd(k, 6) * 3 : 4.5, 0, 6.3); g.fill();
    }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(240,236,220,${0.5 * rnd(i, 7)})`; g.beginPath(); g.arc(128 + (rnd(i, 8) - 0.5) * 200, 128 + (rnd(i, 9) - 0.5) * 200, 6 + rnd(i, 1) * 12, 0, 6.3); g.fill(); }
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const CHROME = { color: "#eef1f3", metalness: 1, roughness: 0.1 };
const Chrome: React.FC<{ dull?: number }> = ({ dull = 0 }) => <meshStandardMaterial color={new THREE.Color("#eef1f3").lerp(new THREE.Color("#b9b6aa"), dull)} metalness={CHROME.metalness} roughness={CHROME.roughness + dull * 0.35} />;

// LA LLAVE: monocomando cromado con pico curvo y aireador; dull = cromo opaco/rayado por la costra
const Faucet: React.FC<{ dull: number; aerCrust: number; aerTex: THREE.Texture }> = ({ dull, aerCrust, aerTex }) => {
  const spout = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v3([0, 0.115, 0.0]), v3([0, 0.15, 0.05]), v3([0, 0.148, 0.12]), v3([0, 0.112, 0.172])]), 40, 0.0125, 16, false), []);
  return (
    <group position={FB}>
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow><cylinderGeometry args={[0.031, 0.036, 0.016, 40]} /><Chrome dull={dull} /></mesh>
      <mesh position={[0, 0.085, 0]} castShadow><cylinderGeometry args={[0.025, 0.027, 0.15, 40]} /><Chrome dull={dull * 0.6} /></mesh>
      <mesh position={[0, 0.162, 0]} castShadow><sphereGeometry args={[0.026, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Chrome dull={dull * 0.4} /></mesh>
      {/* palanca */}
      <group position={[0, 0.178, 0]} rotation={[-0.42, 0, 0]}>
        <mesh position={[0, 0.012, -0.045]} castShadow geometry={rbox(0.016, 0.012, 0.1, 0.005)}><Chrome dull={dull * 0.3} /></mesh>
      </group>
      <mesh geometry={spout} castShadow><Chrome dull={dull * 0.5} /></mesh>
      {/* aireador */}
      <mesh position={[0, 0.1, 0.172]}><cylinderGeometry args={[0.0138, 0.0138, 0.02, 32]} /><Chrome dull={dull * 0.8} /></mesh>
      <mesh position={[0, 0.0898, 0.172]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.0118, 40]} /><meshStandardMaterial map={aerTex} roughness={0.6} metalness={0.4} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#7b8288"), 1 - aerCrust)} /></mesh>
      {/* sarro en el borde del aireador */}
      {aerCrust > 0.02 && Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2 + rnd(i, 2) * 0.2;
        return <mesh key={i} position={[Math.cos(a) * 0.0135, 0.0905 + rnd(i, 3) * 0.004, 0.172 + Math.sin(a) * 0.0135]} scale={aerCrust * (0.6 + rnd(i, 4) * 0.7)}><dodecahedronGeometry args={[0.0016, 0]} /><meshStandardMaterial color={["#f1ede0", "#e6dcc2", "#fbf9f2"][i % 3]} roughness={0.95} /></mesh>; })}
    </group>
  );
};

// LA COSTRA: piedra mineral, no espuma. Tres anillos deformados y aplastados (estratos: abajo el viejo amarillento,
// arriba el nuevo blanco) con color por vértice + escamas planas. k = cuánto hay; dis = cuánto se disolvió (burbujas de vinagre)
const crustGeo = (R: number, r: number, seed: number, flat: number) => {
  const g = new THREE.TorusGeometry(R, r, 14, 120);
  const pos = g.attributes.position as THREE.BufferAttribute, col: number[] = [];
  const cA = new THREE.Color("#f6f3ea"), cB = new THREE.Color("#d9ccaa"), cC = new THREE.Color("#b8a77e");
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const ang = Math.atan2(y, x);
    const n = Math.sin(ang * 7 + seed) * 0.35 + Math.sin(ang * 19 + seed * 2) * 0.22 + Math.sin(ang * 43 + seed * 3) * 0.12 + (rnd(i, seed) - 0.5) * 0.5;
    const rr = Math.hypot(x, y), k = 1 + n * 0.28 * (r / R) * 6;
    // aplasta el tubo contra la loza (z del toro = altura) y deforma el borde
    pos.setXYZ(i, x / rr * (R + (rr - R) * k), y / rr * (R + (rr - R) * k), Math.max(-r * 0.15, z * flat * (1 + n * 0.6)));
    const m = rnd(i, seed + 7);
    const c = cA.clone().lerp(cB, cl(0.3 + n * 0.8)).lerp(cC, m < 0.12 ? 0.6 : 0);
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};
const Crust: React.FC<{ k: number; dis: number; t: number; yellow: number; wet?: number }> = ({ k, dis, t, yellow, wet = 0 }) => {
  const rk = k > 1 ? 1 + 0.3 * (k - 1) : 1;
  const rings = useMemo(() => [crustGeo(0.04, 0.0105, 1, 0.55), crustGeo(0.037, 0.0082, 2, 0.6), crustGeo(0.0345, 0.006, 3, 0.7)], []);
  const chips = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ a: rnd(i, 1) * Math.PI * 2, rr: 0.036 + rnd(i, 2) * 0.02, s: 0.002 + rnd(i, 3) * 0.003, rot: rnd(i, 4) * 6, d: rnd(i, 5), y: rnd(i, 6) * 0.006 })), []);
  const tints = ["#c9b27c", "#e3d8bc", "#ffffff"].map((c, i) => new THREE.Color("#ffffff").lerp(new THREE.Color(c), i === 0 ? 0.55 + 0.45 * yellow : i === 1 ? 0.5 + 0.3 * yellow : 0).lerp(new THREE.Color("#b9b4a8"), wet * 0.45));
  return (
    <group position={FB}>
      {rings.map((g, i) => { const gone = cl((dis - i * 0.22) / 0.45), sc = k * (1 - gone);
        if (sc < 0.02) return null;
        return <mesh key={i} geometry={g} position={[0, 0.0015 + i * 0.0042 * sc, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[rk, rk, sc * (1 - 0.2 * wet)]} castShadow receiveShadow>
          <meshStandardMaterial vertexColors color={tints[i]} roughness={0.98 - wet * 0.55} metalness={0} flatShading={!wet} /></mesh>; })}
      {chips.map((c, i) => { const gone = cl((dis - c.d * 0.6) / 0.3), sc = c.s * k * (1 - gone);
        if (sc < 0.0003) return null;
        return <mesh key={"c" + i} position={[Math.cos(c.a) * c.rr, 0.002 + c.y * k, Math.sin(c.a) * c.rr]} rotation={[c.rot * 0.2, c.rot, c.rot * 0.15]} scale={[sc * 1.6, sc * 0.45, sc]} castShadow>
          <dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={["#f1ece0", "#ddd0b0", "#fbfaf6"][i % 3]} roughness={0.97} flatShading /></mesh>; })}
      {dis > 0.01 && dis < 0.98 && Array.from({ length: 40 }, (_, i) => {
        const ph = (t * (0.6 + rnd(i, 2) * 0.6) + rnd(i, 3)) % 1, a = rnd(i, 4) * Math.PI * 2, rr = 0.036 + rnd(i, 5) * 0.012;
        return <mesh key={"b" + i} position={[Math.cos(a) * rr, 0.004 + ph * 0.03, Math.sin(a) * rr]}><sphereGeometry args={[0.0012 + rnd(i, 6) * 0.0016, 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.55 * (1 - ph)} roughness={0.05} metalness={0} /></mesh>;
      })}
    </group>
  );
};

// EL AGUA: chorro recto (llave sana) o dos chorros torcidos que salpican (aireador tapado)
const Water: React.FC<{ t: number; on: number; crooked: number; spot: number }> = ({ t, on, crooked, spot }) => {
  const A = v3(PT.aer);
  const jets = useMemo(() => [0, 1].map((j) => (w: number) => new THREE.CatmullRomCurve3([
    A.clone(), A.clone().add(v3(j ? [-0.018 - 0.004 * w, -0.05, -0.012] : [0.022 + 0.005 * w, -0.045, 0.02])),
    A.clone().add(v3(j ? [-0.05 - 0.01 * w, -0.13, -0.05] : [0.075 + 0.012 * w, -0.11, 0.07])),
    A.clone().add(v3(j ? [-0.07, -0.205, -0.07] : [0.13, -0.17, 0.12])),
  ])), []);
  if (on <= 0.01) return null;
  const wob = Math.sin(t * 23) * 0.5 + Math.sin(t * 37) * 0.5;
  const mat = <meshPhysicalMaterial color="#d6ecff" transparent opacity={0.62 * on} roughness={0.03} metalness={0} transmission={0} clearcoat={1} emissive="#9fd2ff" emissiveIntensity={0.12} />;
  return (
    <group>
      {crooked < 0.5 ? (
        <mesh position={[A.x, A.y - 0.1, A.z]}><cylinderGeometry args={[0.0085, 0.0095, 0.2, 20, 1, true]} />{mat}</mesh>
      ) : jets.map((mkc, j) => <mesh key={j} geometry={new THREE.TubeGeometry(mkc(wob), 24, j ? 0.0042 : 0.0055, 10, false)}>{mat}</mesh>)}
      {/* salpicadura: gotas que saltan del borde y del espejo */}
      {crooked >= 0.5 && Array.from({ length: 46 }, (_, i) => {
        const life = 0.45 + rnd(i, 1) * 0.4, ph = ((t + rnd(i, 2) * 3) % life) / life;
        const src = i % 2 ? [0.13, 0.79, -1.14] : [-0.07, 0.76, -1.33];
        const vx = (rnd(i, 3) - 0.3) * 0.5, vy = 0.5 + rnd(i, 4) * 0.6, vz = (rnd(i, 5) - 0.2) * 0.4;
        const tt = ph * life;
        return <mesh key={i} position={[src[0] + vx * tt, src[1] + vy * tt - 4.9 * tt * tt, src[2] + vz * tt]}><sphereGeometry args={[0.0018 + rnd(i, 6) * 0.0022, 8, 6]} />{mat}</mesh>;
      })}
      {/* manchitas en el espejo */}
      {spot > 0.01 && Array.from({ length: 34 }, (_, i) => <mesh key={"s" + i} position={[-0.2 + rnd(i, 7) * 0.5, 1.3 + rnd(i, 8) * 0.35, -1.535]} scale={spot}><circleGeometry args={[0.004 + rnd(i, 9) * 0.006, 10]} /><meshPhysicalMaterial color="#e8f4ff" transparent opacity={0.5} roughness={0.02} clearcoat={1} /></mesh>)}
    </group>
  );
};

// lavamanos de pedestal (torno): pedestal + palangana con borde y desagüe, más la repisa donde va la llave
const Sink: React.FC = () => {
  const ped = useMemo(() => new THREE.LatheGeometry([[0.11, 0], [0.12, 0.02], [0.085, 0.08], [0.07, 0.3], [0.075, 0.55], [0.1, 0.66], [0.001, 0.66]].map(([x, y]) => new THREE.Vector2(x, y)), 48), []);
  const bowl = useMemo(() => new THREE.LatheGeometry([[0.02, 0.745], [0.12, 0.66], [0.22, 0.7], [0.285, 0.79], [0.3, 0.86], [0.29, 0.875], [0.27, 0.872], [0.245, 0.83], [0.19, 0.775], [0.1, 0.758], [0.02, 0.755]].map(([x, y]) => new THREE.Vector2(x, y)), 64), []);
  return (
    <group position={[0, 0, -1.12]}>
      <mesh geometry={ped} castShadow receiveShadow><meshPhysicalMaterial color="#f5f4f0" roughness={0.18} clearcoat={0.8} clearcoatRoughness={0.1} /></mesh>
      <mesh geometry={bowl} scale={[1.2, 1, 0.85]} castShadow receiveShadow><meshPhysicalMaterial color="#f7f6f2" roughness={0.16} clearcoat={0.9} clearcoatRoughness={0.08} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.762, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.018, 32]} /><meshStandardMaterial color="#cfd4d7" metalness={1} roughness={0.2} /></mesh>
      {/* repisa trasera (ahí se para la llave) */}
      <mesh position={[0, 0.862, -0.31]} castShadow receiveShadow geometry={rbox(0.62, 0.026, 0.15, 0.012)}><meshPhysicalMaterial color="#f7f6f2" roughness={0.16} clearcoat={0.9} /></mesh>
    </group>
  );
};

// inodoro simple (taza de torno + tanque)
const Toilet: React.FC = () => {
  const bowl = useMemo(() => new THREE.LatheGeometry([[0.1, 0], [0.13, 0.05], [0.12, 0.2], [0.18, 0.36], [0.2, 0.4], [0.001, 0.4]].map(([x, y]) => new THREE.Vector2(x, y)), 40), []);
  return (
    <group position={[1.3, 0, -1.2]}>
      <mesh geometry={bowl} scale={[1, 1, 1.25]} position={[0, 0, 0.12]} castShadow receiveShadow><meshPhysicalMaterial color="#f5f4f0" roughness={0.2} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0.405, 0.12]} scale={[1, 1, 1.25]}><cylinderGeometry args={[0.205, 0.205, 0.02, 40]} /><meshPhysicalMaterial color="#f8f7f3" roughness={0.2} clearcoat={0.8} /></mesh>
      <Box p={[0, 0.62, -0.24]} s={[0.42, 0.42, 0.17]} c="#f5f4f0" r={0.2} rad={0.03} />
      <mesh position={[0.15, 0.78, -0.15]}><cylinderGeometry args={[0.012, 0.012, 0.01, 16]} /><meshStandardMaterial {...CHROME} /></mesh>
    </group>
  );
};

// carrito de limpieza del hotel (estante, toallas, rociadores, balde)
const Cart: React.FC = () => (
  <group position={[3.3, 0, 0.3]}>
    {[0.08, 0.48, 0.9].map((y) => <Box key={y} p={[0, y, 0]} s={[0.9, 0.035, 0.52]} c="#3b4148" r={0.5} m={0.3} rad={0.01} />)}
    {[[-0.43, -0.24], [0.43, -0.24], [-0.43, 0.24], [0.43, 0.24]].map(([x, z], i) => <mesh key={i} position={[x, 0.48, z]}><cylinderGeometry args={[0.012, 0.012, 0.86, 8]} /><meshStandardMaterial {...CHROME} roughness={0.2} /></mesh>)}
    {[[-0.43, -0.24], [0.43, -0.24], [-0.43, 0.24], [0.43, 0.24]].map(([x, z], i) => <mesh key={"w" + i} position={[x, 0.035, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.025, 16]} /><meshStandardMaterial color="#141414" roughness={0.6} /></mesh>)}
    {/* toallas dobladas */}
    {[0, 1, 2, 3].map((k) => <Box key={k} p={[-0.22, 0.53 + k * 0.05, 0]} s={[0.3, 0.045, 0.24]} c="#f4f2ec" r={0.98} rad={0.02} />)}
    {[0, 1, 2].map((k) => <Box key={"b" + k} p={[0.2, 0.13 + k * 0.05, 0.02]} s={[0.32, 0.045, 0.26]} c="#f2efe7" r={0.98} rad={0.02} />)}
    {/* rociadores */}
    {[0.12, 0.27].map((x, i) => <group key={x} position={[x, 0.5, -0.08 + i * 0.12]}>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.035, 0.038, 0.18, 20]} /><meshPhysicalMaterial color={i ? "#cfe8f0" : "#f0f0ea"} roughness={0.1} transparent opacity={0.85} clearcoat={1} /></mesh>
      <Box p={[0, 0.21, 0.01]} s={[0.04, 0.06, 0.07]} c={i ? "#2d6fb3" : "#e8e8e2"} r={0.4} rad={0.008} />
    </group>)}
    {/* trapo amarillo colgado */}
    <Box p={[0.46, 0.75, 0.05]} s={[0.012, 0.22, 0.16]} c="#e8c33a" r={0.95} rad={0.004} />
  </group>
);

const PAPER = "#cfc9be";
const Leaf: React.FC<{ ang: number; w: number; d: number; front?: THREE.Texture; back?: THREE.Texture; y: number }> = ({ ang, w, d, front, back, y }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};

// LA GUÍA (proporción real de la página 1700x2200); hijos = coordenadas de la página derecha (x a lo ancho, z de arriba a abajo)
export const BW = 0.3, BD = BW * 2200 / 1700;
export const Book: React.FC<{ p: V3; rotY?: number; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[]; children?: React.ReactNode }> = ({ p, rotY = 0, open, cover, inside, right, spine, flips = [], children }) => {
  const w = BW, d = BD, th = 0.03;
  const ang = Math.PI * ease(open);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#d8d0bf" roughness={0.95} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[w / 2 + 0.0025, 0.009 + i * (th / 8), 0]}><boxGeometry args={[0.001, 0.0012, d - 0.01]} /><meshBasicMaterial color="#bfb39a" /></mesh>)}
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Leaf ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} y={0.001} /></group>)}
      <group position={[0.004, 0.0065 + th, 0]}>{children}</group>
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.4} metalness={0.03} color="#e2ddd4" /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};
// marcador fosforito que se PINTA sobre un renglón de la página (coordenadas normalizadas de la página real)
export const Marker: React.FC<{ t: number; at: number; out?: number; box: [number, number, number, number]; col?: string }> = ({ t, at, out = 1e9, box, col = "#ffd60a" }) => {
  const a = ease((t - at) / 0.4), o = 1 - win(t, out, out + 0.3);
  if (a <= 0.01 || o <= 0.01) return null;
  const pw = BW - 0.01, pd = BD - 0.012;
  const [x0, y0, x1, y1] = box, ww = (x1 - x0) * pw * a, hh = (y1 - y0) * pd;
  return <mesh position={[(x0 - 0.5) * pw + ww / 2, 0.0009, (y0 - 0.5) * pd + hh / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ww, hh]} /><meshBasicMaterial color={col} transparent opacity={0.55 * o} depthWrite={false} /></mesh>;
};
export const pagePt = (u: number, v: number): V3 => [PT.book[0] + 0.004 + (u - 0.5) * (BW - 0.01), PT.book[1] + 0.037, PT.book[2] + (v - 0.5) * (BD - 0.012)];

// el camino del agua: de la napa en la caliza, por el caño, sube al lavamanos y sale por la llave
const PATH = (() => {
  const pts: V3[] = [[-2.2, -3.62, 1.72], [-1.6, -3.62, 1.72], [-1.6, -1.25, 1.72], [-0.05, -1.25, 1.72], [-0.05, -1.25, -1.3], [-0.05, 0.2, -1.3], [0, 0.85, -1.43]];
  const cp = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++) cp.add(new THREE.LineCurve3(v3(pts[i]), v3(pts[i + 1])));
  return cp;
})();
// caño abierto por la mitad (se ve el sarro por dentro, en capas como anillos de árbol)
const OpenPipe: React.FC<{ a: V3; b: V3; r?: number }> = ({ a, b, r = 0.12 }) => {
  const A = v3(a), B = v3(b), len = A.distanceTo(B), mid = A.clone().lerp(B, 0.5);
  const dir = B.clone().sub(A).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  // media caña que mira hacia el frente (+z): la mitad de atrás
  return (
    <group position={mid} quaternion={q}>
      <mesh><cylinderGeometry args={[r, r, len, 40, 1, true, Math.PI * 0.5, Math.PI]} /><meshStandardMaterial color="#8d8f8c" metalness={0.75} roughness={0.38} side={THREE.DoubleSide} /></mesh>
      {[0.88, 0.78, 0.68].map((f, i) => <mesh key={i}><cylinderGeometry args={[r * f, r * f, len - 0.002, 40, 1, true, Math.PI * 0.5, Math.PI]} /><meshStandardMaterial color={["#d7c79e", "#e6dcc1", "#f3eee0"][i]} roughness={0.97} side={THREE.DoubleSide} /></mesh>)}
    </group>
  );
};

// ======================= PIEZAS DEL RESTO =======================
// la napa: trocitos de caliza que se disuelven en el agua (como el azúcar en el café)
const Dissolve: React.FC<{ t: number; on: number }> = ({ t, on }) => on < 0.01 ? null : (
  <group>{Array.from({ length: 34 }, (_, i) => {
    const ph = ((t * 0.22 + rnd(i, 1)) % 1), x = -2.0 + rnd(i, 2) * 3.0, y = -3.62 + (rnd(i, 3) - 0.5) * 0.36, sc = (1 - ph) * (0.03 + rnd(i, 4) * 0.035) * on;
    return <mesh key={i} position={[x + ph * 0.25, y + ph * 0.05, 1.64]} rotation={[rnd(i, 5) * 3, ph * 2, rnd(i, 6) * 3]} scale={sc}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#f2ead6" roughness={0.9} flatShading transparent opacity={0.4 + 0.6 * (1 - ph)} /></mesh>;
  })}</group>
);
// gotas: la que queda en la base, la que cuelga de la boquita y las salpicadas sobre la repisa; ev = cuánto se evaporó
const Drops: React.FC<{ on: number; ev: number }> = ({ on, ev }) => {
  if (on < 0.01) return null;
  const mat = <meshPhysicalMaterial color="#e6f4ff" transparent opacity={0.75 * on} roughness={0.02} clearcoat={1} metalness={0} />;
  const sc = on * (1 - 0.85 * ev);
  return (
    <group>
      <mesh position={[0.012, 0.879, -1.396]} scale={[0.011 * sc, 0.006 * sc, 0.009 * sc]}><sphereGeometry args={[1, 24, 16]} />{mat}</mesh>
      <mesh position={[0, 0.9535, -1.258]} scale={[0.005 * sc, 0.0068 * sc, 0.005 * sc]}><sphereGeometry args={[1, 20, 14]} />{mat}</mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.12 + rnd(i, 1) * 0.26, 0.8765, -1.44 + rnd(i, 2) * 0.08]} scale={[0.004 * sc * (0.6 + rnd(i, 3)), 0.0016 * sc, 0.004 * sc * (0.6 + rnd(i, 3))]}><sphereGeometry args={[1, 14, 10]} />{mat}</mesh>)}
      {/* el anillito blanco que deja la gota al secarse */}
      {ev > 0.05 && <mesh position={[0.012, 0.8758, -1.396]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.0085, 0.0105, 32]} /><meshStandardMaterial color="#f5f1e6" transparent opacity={ev} roughness={0.9} /></mesh>}
    </group>
  );
};
// la tajada de la costra cortada por la mitad, flotando sobre la base: se ven las capas, una por semana
const CrustSlice: React.FC<{ k: number; tex: THREE.Texture; t: number }> = ({ k, tex, t }) => k < 0.01 ? null : (
  <group position={[0, 0.962 - (1 - k) * 0.05, -1.37]} rotation={[0.05, -0.35 + Math.sin(t * 0.4) * 0.12, 0]} scale={k}>
    <mesh castShadow><boxGeometry args={[0.11, 0.04, 0.02]} /><meshStandardMaterial attach="material-0" color="#e8dfc6" roughness={0.95} /><meshStandardMaterial attach="material-1" color="#e8dfc6" roughness={0.95} /><meshStandardMaterial attach="material-2" color="#fbf9f3" roughness={0.95} /><meshStandardMaterial attach="material-3" color="#cdbf98" roughness={0.95} /><meshStandardMaterial attach="material-4" map={tex} roughness={0.9} /><meshStandardMaterial attach="material-5" map={tex} roughness={0.9} /></mesh>
  </group>
);
// el aireador DESARMADO en el aire: carcasa, dos rejillas y la gomita bajan separándose (ex 0→1)
const AerExplode: React.FC<{ ex: number; tex: THREE.Texture }> = ({ ex, tex }) => {
  if (ex < 0.01) return null;
  const A = PT.aer;
  const parts = [
    <mesh key="h"><cylinderGeometry args={[0.0142, 0.0142, 0.012, 32, 1, true]} /><meshStandardMaterial color="#d9dde0" metalness={1} roughness={0.15} side={THREE.DoubleSide} /></mesh>,
    <mesh key="s1" rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.0122, 40]} /><meshStandardMaterial map={tex} roughness={0.6} metalness={0.4} side={THREE.DoubleSide} /></mesh>,
    <mesh key="s2" rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.0122, 40]} /><meshStandardMaterial map={tex} roughness={0.6} metalness={0.4} side={THREE.DoubleSide} color="#d8d2c0" /></mesh>,
    <mesh key="g" rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.0118, 0.0016, 10, 40]} /><meshStandardMaterial color="#2a2a2a" roughness={0.7} /></mesh>,
  ];
  return <group position={[A[0], A[1] - 0.004, A[2]]}>{parts.map((p, i) => <group key={i} position={[0, -ex * (0.012 + i * 0.013), 0]} rotation={[0.35 * ex, i * 0.4 * ex, 0]}>{p}</group>)}</group>;
};
// gota de vinagre que cae sobre la costra y la hace burbujear como un refresco
const VinegarDrop: React.FC<{ t: number; at: number; on: number }> = ({ t, at, on }) => {
  if (on < 0.01) return null;
  const fall = cl((t - at) / 0.5), y = 0.96 - fall * fall * 0.075, hit = t > at + 0.5;
  return (
    <group>
      {!hit && <mesh position={[0.03, y, -1.4]} scale={[0.0045, 0.006, 0.0045]}><sphereGeometry args={[1, 18, 12]} /><meshPhysicalMaterial color="#f6f2e2" transparent opacity={0.8} roughness={0.02} clearcoat={1} /></mesh>}
      {hit && Array.from({ length: 60 }, (_, i) => {
        const ph = ((t - at) * (0.8 + rnd(i, 2) * 0.9) + rnd(i, 3)) % 1, a = rnd(i, 4) * Math.PI * 2, rr = 0.004 + rnd(i, 5) * 0.012;
        return <mesh key={i} position={[0.03 + Math.cos(a) * rr * 0.6, 0.889 + ph * 0.014, -1.4 + Math.sin(a) * rr * 0.6]}><sphereGeometry args={[0.0007 + rnd(i, 6) * 0.0011, 8, 6]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7 * (1 - ph) * on} roughness={0.02} clearcoat={1} /></mesh>;
      })}
      {hit && <mesh position={[0.03, 0.8885, -1.4]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.011 * cl((t - at - 0.5) / 0.6), 28]} /><meshPhysicalMaterial color="#f8f4e8" transparent opacity={0.55} roughness={0.05} clearcoat={1} /></mesh>}
    </group>
  );
};
// llavecita del muestrario (mismo modelo, otro acabado)
const MiniFaucet: React.FC<{ p: V3; col: string; met: number; rough: number }> = ({ p, col, met, rough }) => {
  const spout = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v3([0, 0.115, 0.0]), v3([0, 0.15, 0.05]), v3([0, 0.148, 0.12]), v3([0, 0.112, 0.172])]), 40, 0.0125, 16, false), []);
  const m = <meshStandardMaterial color={col} metalness={met} roughness={rough} />;
  return (
    <group position={p}>
      <mesh position={[0, 0.008, 0]} castShadow><cylinderGeometry args={[0.031, 0.036, 0.016, 40]} />{m}</mesh>
      <mesh position={[0, 0.085, 0]} castShadow><cylinderGeometry args={[0.025, 0.027, 0.15, 40]} />{m}</mesh>
      <mesh position={[0, 0.162, 0]} castShadow><sphereGeometry args={[0.026, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />{m}</mesh>
      <group position={[0, 0.178, 0]} rotation={[-0.42, 0, 0]}><mesh position={[0, 0.012, -0.045]} castShadow geometry={rbox(0.016, 0.012, 0.1, 0.005)}>{m}</mesh></group>
      <mesh geometry={spout} castShadow>{m}</mesh>
      <mesh position={[0, 0.1, 0.172]}><cylinderGeometry args={[0.0138, 0.0138, 0.02, 32]} />{m}</mesh>
    </group>
  );
};
export const MUES = [-1.25, 0, -1.4] as V3; // muestrario: mesada de mármol con 4 acabados (cromo, dorado, negro mate, cepillado)
export const MUES_X = [-0.39, -0.13, 0.13, 0.39];
const Muestrario: React.FC<{ tex: THREE.Texture; etch: number; drip: number; t: number; towel: number }> = ({ tex, etch, drip, t, towel }) => (
  <group position={MUES}>
    <Box p={[0, 0.42, 0.02]} s={[1.1, 0.84, 0.42]} c="#6b4a33" r={0.6} rad={0.015} />
    <mesh position={[0, 0.858, 0.02]} castShadow receiveShadow geometry={rbox(1.14, 0.036, 0.46, 0.008)}><meshPhysicalMaterial map={tex} roughness={0.2} clearcoat={0.7} clearcoatRoughness={0.15} /></mesh>
    {[["#eef1f3", 1, 0.1], ["#e2b866", 1, 0.2], ["#26272a", 0.4, 0.6], ["#c3c6c8", 1, 0.38]].map(([c2, met, ro], i) => <MiniFaucet key={i} p={[MUES_X[i], 0.876, -0.05]} col={c2 as string} met={met as number} rough={ro as number} />)}
    {/* la mancha opaca que deja el vinagre en el mármol */}
    {etch > 0.01 && <mesh position={[0.23, 0.8768, 0.22]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.045, 40]} /><meshStandardMaterial color="#e7e3d8" roughness={1} transparent opacity={0.9 * etch} /></mesh>}
    {/* la venda que gotea sobre el mármol */}
    {drip > 0.01 && <group position={[MUES_X[0], 0.876, -0.05]}>
      <mesh position={[0, 0.018, 0]}><cylinderGeometry args={[0.046, 0.05, 0.034, 28, 1, true]} /><meshStandardMaterial color="#efe8da" roughness={0.75} transparent opacity={0.95 * drip} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 6 }, (_, i) => { const ph = ((t * 0.9 + rnd(i, 1)) % 1); return <mesh key={i} position={[Math.cos(i) * 0.05, 0.004 - ph * 0.002, Math.sin(i) * 0.05 + 0.02]} scale={[0.004, 0.003 + ph * 0.002, 0.004]}><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color="#f3eedc" transparent opacity={0.7 * drip} roughness={0.02} clearcoat={1} /></mesh>; })}
    </group>}
    {/* el trapo seco que protege el mármol */}
    {towel > 0.01 && <mesh position={[MUES_X[0], 0.879, -0.05]} rotation={[-Math.PI / 2, 0, 0]} scale={towel}><ringGeometry args={[0.05, 0.11, 40]} /><meshStandardMaterial color="#d9cfb8" roughness={1} side={THREE.DoubleSide} /></mesh>}
  </group>
);
// la bolsita de vinagre amarrada con la liga, colgando del pico
const Bag: React.FC<{ on: number; t: number }> = ({ on, t }) => {
  if (on < 0.01) return null;
  const A = PT.aer, sw = Math.sin(t * 1.7) * 0.06;
  return (
    <group position={[A[0], A[1] + 0.012, A[2]]} rotation={[sw, 0, sw * 0.5]} scale={on}>
      <mesh position={[0, -0.03, 0]} scale={[0.036, 0.05, 0.034]}><sphereGeometry args={[1, 32, 20]} /><meshPhysicalMaterial color="#f2f5f7" transparent opacity={0.28} roughness={0.15} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, -0.046, 0]} scale={[0.033, 0.032, 0.031]}><sphereGeometry args={[1, 32, 20, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58]} /><meshPhysicalMaterial color="#f3ead2" transparent opacity={0.5} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
      <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.0152, 0.0022, 10, 32]} /><meshStandardMaterial color="#c8282b" roughness={0.6} /></mesh>
      <mesh position={[0, 0.02, 0]} scale={[0.018, 0.012, 0.018]}><coneGeometry args={[1, 1, 16, 1, true]} /><meshPhysicalMaterial color="#f2f5f7" transparent opacity={0.3} roughness={0.2} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {Array.from({ length: 16 }, (_, i) => { const ph = ((t * 0.5 + rnd(i, 1)) % 1); return <mesh key={i} position={[(rnd(i, 2) - 0.5) * 0.02, -0.06 + ph * 0.05, (rnd(i, 3) - 0.5) * 0.02]}><sphereGeometry args={[0.0011, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6 * (1 - ph)} /></mesh>; })}
    </group>
  );
};
// la venda de toallas de papel empapadas alrededor de la base (arrugada); p = dónde
const Wrap: React.FC<{ on: number; p?: V3 }> = ({ on, p = FB }) => {
  const geo = useMemo(() => { const g = new THREE.CylinderGeometry(0.047, 0.052, 0.036, 48, 6, true); const ps = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < ps.count; i++) { const x = ps.getX(i), y = ps.getY(i), z = ps.getZ(i), a = Math.atan2(z, x), k = 1 + 0.07 * Math.sin(a * 13 + y * 90) + 0.04 * Math.sin(a * 31); ps.setXYZ(i, x * k, y, z * k); }
    g.computeVertexNormals(); return g; }, []);
  if (on < 0.01) return null;
  return <mesh geometry={geo} position={[p[0], p[1] + 0.018, p[2]]} scale={[1, on, 1]} castShadow><meshPhysicalMaterial color="#efe9de" roughness={0.55} clearcoat={0.4} transparent opacity={0.96} side={THREE.DoubleSide} /></mesh>;
};
// el palillo de madera recorriendo la junta y la línea de pasta blanca que va sacando (k 0→1)
const Pick: React.FC<{ k: number; on: number }> = ({ k, on }) => {
  if (on < 0.01) return null;
  const a0 = Math.PI * 0.12, a = a0 + (Math.PI * 0.76) * k, R = 0.037;
  const x = FB[0] + Math.cos(a) * R, z = FB[2] + Math.sin(a) * R;
  return (
    <group>
      <group position={[x, 0.884, z]} rotation={[0, -a + Math.PI / 2, 0]}><mesh rotation={[0.9, 0, 0]} position={[0, 0.03, 0.03]}><cylinderGeometry args={[0.0012, 0.0019, 0.09, 10]} /><meshStandardMaterial color="#d9b47a" roughness={0.8} /></mesh></group>
      {k > 0.01 && <mesh position={[FB[0], 0.8775, FB[2]]} rotation={[Math.PI / 2, 0, a0]}><torusGeometry args={[R + 0.003, 0.0018, 8, 64, (Math.PI * 0.76) * k]} /><meshStandardMaterial color="#f6f3ea" roughness={0.9} /></mesh>}
    </group>
  );
};
// el paño amarillo que sube y baja por la llave
const Cloth: React.FC<{ on: number; t: number }> = ({ on, t }) => {
  if (on < 0.01) return null;
  const y = 0.93 + Math.sin(t * 5) * 0.035, r = Math.sin(t * 2.6) * 0.5;
  return <group position={[FB[0], y, FB[2]]} rotation={[0, r, 0]} scale={on}><mesh position={[0, 0, 0.034]} rotation={[0.1, 0, 0]} geometry={rbox(0.09, 0.07, 0.012, 0.005)}><meshStandardMaterial color="#e9c43b" roughness={1} /></mesh></group>;
};
// la cera: el agua forma gotas redondas sobre el cromo y resbala
const Beads: React.FC<{ on: number; t: number }> = ({ on, t }) => on < 0.01 ? null : (
  <group>{Array.from({ length: 26 }, (_, i) => {
    const a = (rnd(i, 1) - 0.5) * 2.2, hy = 0.9 + rnd(i, 2) * 0.13, slide = cl((t - 817.5 - rnd(i, 3) * 2.5) / 1.4) * 0.03;
    return <mesh key={i} position={[FB[0] + Math.sin(a) * 0.0262, hy - slide, FB[2] + Math.cos(a) * 0.0262]} scale={on * (0.0018 + rnd(i, 4) * 0.0016)}><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.85} roughness={0.01} clearcoat={1} /></mesh>;
  })}</group>
);
// el cromo gastado: manchas verdes de bronce y picaduras en la base
const Corrosion: React.FC<{ on: number }> = ({ on }) => on < 0.01 ? null : (
  <group position={FB}>{Array.from({ length: 40 }, (_, i) => { const a = rnd(i, 1) * Math.PI * 2, h = rnd(i, 2) * 0.05;
    return <mesh key={i} position={[Math.cos(a) * (h < 0.016 ? 0.034 : 0.0265), 0.004 + h, Math.sin(a) * (h < 0.016 ? 0.034 : 0.0265)]} scale={on * (0.002 + rnd(i, 3) * 0.004)} rotation={[rnd(i, 4) * 3, a, 0]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={i % 3 ? "#3f8a6c" : "#2d3a2f"} roughness={0.95} /></mesh>; })}</group>
);

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const bt = useBathTex();
  const pg = useImgTex(["p001", "p017", "p018", "p027", "p028"]);
  const R = t >= 100.8, B = (a: number, b: number) => t >= a && t < b;
  // estado de la llave: sucia hasta "en 10 minutos" (56,1: se disuelve), limpia en la promesa, sucia otra vez (tapado por el clip de la mesa)
  // RESTO: costra hasta el palillo (465-470); el aireador se limpia con el cepillo (380); después limpia salvo las demostraciones
  const dis = t > 56 && t < 60.5 ? win(t, 56.4, 59.2) : 0;
  let crustK = !R ? 1 : t < 465 ? 1 : t < 470.6 ? 1 - 0.85 * win(t, 465.5, 470.3) : 0;
  if (B(161.8, 168.6)) crustK = Math.min(1, 0.08 + Math.floor((t - 161.8) / 0.75) * 0.11 + 0.11 * win(t % 0.75, 0, 0.3)); // capa por capa
  if (B(492.1, 498.5)) crustK = 1.65;          // costra de años, de un dedo de alto
  if (B(626, 633)) crustK = 0.75;              // la gomita amarilla (cloro)
  if (B(724, 731.5)) crustK = 0.25;            // corroída: poca piedra, metal verde
  const wet = B(445.2, 470.6) ? 1 : 0;          // blanda, como tiza mojada
  let dull = !R ? 0.55 * (1 - dis) : t < 481 ? 0.55 : t < 486.8 ? 0.55 * (1 - win(t, 481.3, 485.5)) : 0;
  if (B(594, 600.6)) dull = 1;                 // el cromo rayado por la fibra verde
  if (B(724, 731.5)) dull = 0.85;
  const yellow = (t > 26 && t < 34) || B(626, 633) ? 1 : 0.4;
  const aerCrust = !R ? 1 - dis : t < 380 ? 1 : 0;
  // el agua: corre torcida en el gancho (y en la vista del aireador), recta cuando la llave queda limpia
  const waterOn = !R ? (t < 6.8 ? 1 : 0) + (t > 57.4 && t < 60.5 ? win(t, 57.4, 57.8) : 0) + (t > 62 && t < 80.3 ? 1 : 0) + (t > 99 ? 1 : 0)
    : (B(100.8, 107.9) ? 1 : 0) + (B(143.4, 147.6) ? 1 : 0) + (B(193.2, 199.2) ? 1 : 0) + (B(384, 387.6) ? 1 : 0) + (B(763, 769.9) ? 1 : 0) + (t > 904 ? 1 : 0);
  const crooked = !R ? (t > 57 && t < 60.5 ? 0 : 1) : t < 380 ? 1 : 0;
  const spot = t < 7 ? win(t, 5.4, 6.2) : 0;
  // la guía: CTA1 (pág. 17-18) → se cierra → CTA2 abre en la 27-28 → se cierra → el cierre vuelve a la 18
  const open = win(t, C1 + 6.4, C1 + 7.3) * (1 - win(t, 120, 121.5)) + win(t, 539.2, 540.6) * (1 - win(t, 556, 557.5)) + win(t, 896.6, 898.0);
  const p28 = t > 300 && t < 700;
  const flowOn = win(t, 63.6, 64.6) * (1 - win(t, 79.5, 80.5)) + (B(107.9, 121) ? win(t, 109.4, 110.4) : 0) + (B(126.4, 133) ? 1 : 0);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.25} threshold={0.95} exposure={0.82} env={0.32} />
      <color attach="background" args={["#141a23"]} />
      <mesh><sphereGeometry args={[60, 32, 16]} /><meshBasicMaterial map={bt.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xdfe8f5, 0x2a2622, 0.45]} />
      <directionalLight position={[4, 9, 7]} intensity={1.5} color="#fff3e2" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003} />
      {/* luz del baño: aplique arriba del espejo + luz de la ventana */}
      <pointLight position={[0, 2.25, -1.25]} intensity={2.2} distance={5} color="#ffe6c4" castShadow />
      <spotLight position={[-1.8, 1.8, -0.3]} angle={0.9} penumbra={0.9} intensity={5} distance={6} color="#eef4ff" target-position={[0.2, 0.9, -1.2]} />
      
      {/* luz rasante para la costra (sólo cuando la cámara está encima) */}
      <spotLight position={[0.25, 0.95, -1.2]} angle={0.5} penumbra={1} intensity={1.2} distance={0.6} color="#fff6e8" target-position={FB} />

      {/* ===== BLOQUE DE SUELO CORTADO (maqueta): capas a la vista en el frente ===== */}
      <mesh position={[1.3, -2.5, -0.1]} receiveShadow geometry={rbox(7, 4.6, 3.4, 0.02)}><meshStandardMaterial map={bt.strata} roughness={0.95} /></mesh>
      {/* losa del piso */}
      <Box p={[1.3, -0.1, -0.1]} s={[7.02, 0.2, 3.42]} c="#9a9894" r={0.9} map={tx.concrete} rad={0.01} />
      {/* agua que corre en la napa + minerales que viajan por el caño hasta la llave */}
      {flowOn > 0.01 && Array.from({ length: 70 }, (_, i) => {
        const u = (i / 70 + t * 0.045) % 1; const q = PATH.getPointAt(u);
        const front = q.z > 1.5 ? 1 : 0;
        return front ? <mesh key={i} position={[q.x, q.y + Math.sin(i * 3.1) * 0.03, 1.73]}><sphereGeometry args={[0.022, 10, 8]} /><meshStandardMaterial color="#fffaf0" emissive="#ffffff" emissiveIntensity={0.35 * flowOn} roughness={0.6} /></mesh> : null;
      })}
      {flowOn > 0.01 && Array.from({ length: 40 }, (_, i) => {
        const x = -2.2 + ((i * 0.37 + t * 0.35) % 7), y = -3.62 + (rnd(i, 3) - 0.5) * 0.4;
        return <mesh key={"w" + i} position={[x, y, 1.615]}><circleGeometry args={[0.025 + rnd(i, 4) * 0.025, 12]} /><meshBasicMaterial color="#9fd8ff" transparent opacity={0.55 * flowOn} toneMapped={false} /></mesh>;
      })}
      <OpenPipe a={[-1.6, -3.7, 1.6]} b={[-1.6, -1.25, 1.6]} />
      <OpenPipe a={[-1.72, -1.25, 1.6]} b={[0.1, -1.25, 1.6]} />

      {/* ===== EL BAÑO (frente abierto en z = 1.6) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[4, 3.2]} /><meshStandardMaterial map={bt.floor} roughness={0.35} /></mesh>
      <Box p={[0, 1.3, -1.65]} s={[4.1, 2.6, 0.1]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[-2.05, 1.3, 0]} s={[0.1, 2.6, 3.2]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      {/* pared derecha con puerta al pasillo */}
      <Box p={[2.05, 1.3, -1.0]} s={[0.1, 2.6, 1.2]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[2.05, 1.3, 1.3]} s={[0.1, 2.6, 0.6]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[2.05, 2.3, 0.3]} s={[0.1, 0.6, 1.4]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      {/* espejo con marco + aplique */}
      <Box p={[0, 1.66, -1.585]} s={[0.78, 0.86, 0.025]} c="#c9cdd0" m={0.8} r={0.3} rad={0.008} />
      <mesh position={[0, 1.66, -1.57]}><planeGeometry args={[0.74, 0.82]} /><meshStandardMaterial color="#e9eef2" metalness={1} roughness={0.035} /></mesh>
      <Box p={[0, 2.15, -1.55]} s={[0.5, 0.05, 0.08]} c="#fff6e2" e="#ffe2b0" ei={1.4} r={0.3} />
      {/* ventana esmerilada en la pared izquierda */}
      <mesh position={[-1.995, 1.75, -0.3]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.7, 0.6]} /><meshStandardMaterial color="#f4f8ff" emissive="#eaf2ff" emissiveIntensity={0.9} roughness={0.9} /></mesh>
      <Box p={[-1.99, 1.75, -0.3]} s={[0.04, 0.66, 0.76]} c="#f2f2ee" r={0.5} rad={0.006} />
      {/* toallero con toalla */}
      <mesh position={[-1.97, 1.15, 0.7]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.6, 12]} /><meshStandardMaterial {...CHROME} /></mesh>
      <Box p={[-1.95, 0.95, 0.7]} s={[0.04, 0.42, 0.42]} c="#f4f2ec" r={0.98} rad={0.015} />
      <Sink />
      <Toilet />
      <Faucet dull={dull} aerCrust={aerCrust} aerTex={bt.aer} />
      <Crust k={crustK} dis={dis} t={t} yellow={yellow} wet={wet} />
      <Water t={t} on={Math.min(1, waterOn)} crooked={crooked} spot={spot} />
      {/* jabonera y vaso en la repisa */}
      <mesh position={[0.2, 0.885, -1.43]}><cylinderGeometry args={[0.03, 0.026, 0.02, 24]} /><meshPhysicalMaterial color="#e7e2d6" roughness={0.2} clearcoat={1} /></mesh>
      <Box p={[0.2, 0.9, -1.43]} s={[0.05, 0.016, 0.032]} c="#efe0c8" r={0.6} rad={0.008} />

      {/* ===== piezas del resto ===== */}
      <Dissolve t={t} on={B(107.9, 121) ? win(t, 111.5, 112.5) : 0} />
      <Drops on={B(147.6, 157.5) ? win(t, 147.6, 148.2) : 0} ev={win(t, 154.5, 157)} />
      <CrustSlice k={B(168.3, 174) ? ease((t - 168.4) / 0.9) : 0} tex={bt.slice} t={t} />
      <AerExplode ex={B(179.4, 189) ? win(t, 181.2, 184.2) : 0} tex={bt.aer} />
      <VinegarDrop t={t} at={227.2} on={B(226.5, 232.3) ? 1 : 0} />
      <Muestrario tex={bt.marble} etch={B(309, 314) ? win(t, 309.6, 310.6) : 0} drip={B(696.8, 703.2) ? 1 : 0} t={t} towel={0} />
      <Bag on={B(362.5, 367.3) || B(826.8, 831.2) ? 1 : 0} t={t} />
      <Wrap on={B(432, 436.3) ? ease((t - 432.1) / 1.2) : 0} />
      <Pick k={B(465, 470.8) ? win(t, 465.4, 470.2) : 0} on={B(465, 470.8) ? 1 : 0} />
      <Cloth on={B(481, 486.9) || B(774.6, 780.2) ? 1 : 0} t={t} />
      <Beads on={B(815, 821.8) ? win(t, 816.6, 817.4) : 0} t={t} />
      <Corrosion on={B(724, 731.5) ? 1 : 0} />
      {/* ===== EL PASILLO del hotel (a la derecha) con el carrito y LA GUÍA ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.4, 0.002, -0.1]} receiveShadow><planeGeometry args={[2.7, 3.4]} /><meshStandardMaterial map={bt.carpet} roughness={0.95} /></mesh>
      <Box p={[3.4, 1.3, -1.65]} s={[2.7, 2.6, 0.1]} c="#e9dcc0" r={0.9} map={bt.paper} rad={0.01} />
      <Box p={[3.4, 0.5, -1.59]} s={[2.7, 1.0, 0.03]} c="#5a3a26" r={0.6} rad={0.006} />
      <Box p={[4.2, 1.05, -1.585]} s={[0.9, 2.1, 0.05]} c="#6b432b" r={0.55} rad={0.01} />
      <Box p={[4.2, 1.75, -1.555]} s={[0.22, 0.09, 0.01]} c="#c9a35a" m={0.8} r={0.3} rad={0.003} />
      <pointLight position={[3.2, 2.1, -1.2]} intensity={2.6} distance={4} color="#ffd6a0" />
      <Box p={[3.2, 2.0, -1.58]} s={[0.16, 0.22, 0.06]} c="#fff0d0" e="#ffcf8a" ei={1.2} r={0.4} />
      <Cart />
      <spotLight position={[3.3, 2.2, 0.9]} angle={0.5} penumbra={0.8} intensity={6} distance={4} color="#fff2dc" target-position={PT.book} />
      <Book p={PT.book} open={open} cover={pg.p001} inside={p28 ? pg.p027_r : pg.p017_r} right={p28 ? pg.p028 : pg.p018} spine="#5b3920">
        <Marker t={t} at={C1 + 8.58} out={C1 + 15.6} box={[0.065, 0.342, 0.8, 0.38]} />
        <Marker t={t} at={C1 + 11.88} out={C1 + 15.6} box={[0.312, 0.47, 0.86, 0.493]} />
        <Marker t={t} at={C1 + 12.86} out={C1 + 15.6} box={[0.312, 0.497, 0.6, 0.519]} />
        <Marker t={t} at={C1 + 14.64} out={C1 + 15.8} box={[0.07, 0.82, 0.49, 0.9]} col="#9fd0ff" />
        {/* CTA2 · pág. 28: "la regadera tapada…" y "con el tiempo de espera de cada uno" */}
        <Marker t={t} at={542.0} out={553} box={[0.09, 0.148, 0.41, 0.186]} />
        <Marker t={t} at={550.6} out={553} box={[0.09, 0.19, 0.41, 0.235]} col="#ff9f43" />
        <Marker t={t} at={550.9} out={553} box={[0.53, 0.26, 0.74, 0.302]} col="#ff9f43" />
        {/* cierre · pág. 18 otra vez */}
        <Marker t={t} at={899.6} box={[0.065, 0.342, 0.8, 0.38]} />
        <Marker t={t} at={900.6} box={[0.312, 0.47, 0.86, 0.519]} />
      </Book>
    </ThreeCanvas>
  );
};
