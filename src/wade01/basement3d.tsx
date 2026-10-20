// wade01 · EL MUNDO: la casa de Wade en CORTE (Tennessee) con el sótano de bloques enterrado y la tierra alrededor.
// El plano de corte es z = +3: se ve el espesor de los bloques, la tierra en capas (con el agua que baja por ella),
// el sótano con el balde en el rincón más húmedo, la planta baja y el techo con la canaleta y el caño de bajada a la derecha.
// UNA cámara para todo el video: vuela de un tramo al otro (cada tramo 3D tiene sus keyframes, anclados a la voz).
// Efectos por tramo (fxAt): olor a humedad, vapor que se condensa en la pared, aire tibio que entra, capilaridad,
// moho, el balde en sus estados (taladro, malla, latas, sal, se derrite, agua abajo, tapa), canaleta que rebalsa,
// caño que vuelca al pie de la pared, agua que atraviesa el bloque, papel aluminio, time-lapse de 7 días, viga que se pudre.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- medidas (metros) ----------------
const FL = -2.4;                 // piso del sótano (cara de arriba)
export const BK: V3 = [3.55, FL, -2.55]; // balde: un pie (0,3 m) separado de las dos paredes del rincón derecho-fondo
const BR = 0.15, BH = 0.37;      // balde de 5 galones
const CANH = 0.12;               // latas de sopa

// ---------------- puntos para portales y rótulos ----------------
export const PT = {
  corner: [3.55, -2.0, -2.55] as V3,
  bucketTop: [3.55, -1.86, -2.55] as V3,
  bucketLow: [3.55, -2.3, -2.55] as V3,
  pellets: [3.55, -1.95, -2.55] as V3,
  hygro: [1.2, -1.02, -2.86] as V3,
  window: [-0.5, -0.55, -2.95] as V3,
  vent: [-3.95, -0.5, -0.4] as V3,
  door: [-3.95, -1.4, 2.0] as V3,
  wallR: [3.98, -1.6, -1.2] as V3,
  wallFoot: [3.98, -2.3, -1.0] as V3,
  soil: [6.2, -1.2, 3.0] as V3,
  gutter: [4.72, 2.72, 1.2] as V3,
  spoutOut: [4.95, 0.12, 2.35] as V3,
  extEnd: [6.75, 0.06, 2.35] as V3,
  foil: [3.97, -1.25, -0.6] as V3,
  sill: [3.9, 0.05, 0.6] as V3,
  scale: [3.55, FL + 0.03, -2.55] as V3,
  grade: [5.2, 0.0, 2.6] as V3,
};

// ---------------- CÁMARA: tramos 3D con keyframes [t, pos, look, fov] (tiempos = segundos de la voz) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const KEYS: Key[] = [
  // G1 · 5,8-10,4 · "you smell it… like an old towel": la cámara entra al sótano en corte y se mete al rincón
  { t: 5.75, p: [-0.5, 0.9, 13.5], l: [0.6, -1.0, 0], fov: 40 },
  { t: 8.4, p: [1.2, -1.3, 3.4], l: [3.3, -1.9, -2.3], fov: 38 },
  { t: 10.45, p: [1.8, -1.45, 0.5], l: [3.99, -1.55, -1.15], fov: 38 },
  // G2 · 23,9-30,9 · "That's water… coming out of the air": del rincón a todo el corte, el vapor se pega a la pared
  { t: 23.85, p: [3.2, -1.6, -1.4], l: [3.99, -1.7, -2.4], fov: 34 },
  { t: 26.4, p: [1.0, -1.2, 4.2], l: [2.2, -1.6, -2.0], fov: 40 },
  { t: 30.95, p: [-1.0, -0.6, 8.6], l: [0.8, -1.3, -1.5], fov: 42 },
  // G3 · 39,5-46,8 · "what I've been doing for forty years instead": vuelo al balde del rincón
  { t: 39.45, p: [-2.0, -0.4, 9.5], l: [0.5, -1.4, -1.5], fov: 42 },
  { t: 42.6, p: [2.3, -1.5, -0.7], l: [3.55, -2.05, -2.5], fov: 36, arc: 0.3 },
  { t: 46.85, p: [2.65, -1.75, -1.25], l: [3.55, -2.1, -2.55], fov: 34 },
  // G4 · 51,3-62,5 · "seven days… on a scale" → "a real leak": balanza; latigazo a la pared que filtra
  { t: 51.25, p: [2.9, -2.05, -1.55], l: [3.55, -2.25, -2.55], fov: 34 },
  { t: 57.9, p: [2.75, -2.15, -1.75], l: [3.55, -2.28, -2.55], fov: 31 },
  { t: 58.7, p: [3.2, -1.7, 0.6], l: [3.99, -1.9, -0.3], fov: 38, arc: 0.15 },
  { t: 62.5, p: [3.0, -1.6, 1.2], l: [3.99, -1.85, -0.4], fov: 36 },
  // G5 · 83,9-93,9 · "a basement sits in the ground… the dirt stays cool and wet": el corte entero, la tierra
  { t: 83.85, p: [2.6, -1.6, -0.9], l: [3.55, -2.0, -2.5], fov: 36 },
  { t: 87.6, p: [0.5, 1.2, 15.5], l: [0.8, -0.6, 0], fov: 40, arc: 0.6 },
  { t: 90.6, p: [3.6, -0.7, 10.2], l: [3.6, -1.5, 2.5], fov: 40 },
  { t: 93.95, p: [5.6, -1.4, 9.0], l: [4.6, -1.5, 2.0], fov: 38 },
  // G6 · 99,6-104,5 · "warm summer air… windows, dryer vent, cracks around the door"
  { t: 99.5, p: [0.8, -1.0, 6.0], l: [-0.6, -1.2, -1.5], fov: 40 },
  { t: 102.0, p: [-0.6, -1.15, 4.4], l: [-2.6, -1.0, -0.8], fov: 40 },
  { t: 104.6, p: [1.8, -1.25, 2.6], l: [3.99, -1.5, -1.2], fov: 38 },
  // G7 · 118,2-130,3 · "wicks moisture up from the ground… 70 or 80%… mold loves anything over 60"
  { t: 118.2, p: [3.6, -1.3, 5.2], l: [4.1, -2.0, 2.4], fov: 38 },
  { t: 121.0, p: [2.0, -1.5, 1.3], l: [3.99, -1.9, -1.0], fov: 38 },
  { t: 125.5, p: [2.4, -1.4, -0.2], l: [1.2, -1.05, -2.86], fov: 34 },
  { t: 127.4, p: [2.5, -1.75, -1.3], l: [3.99, -1.95, -2.5], fov: 34, arc: 0.1 },
  { t: 130.4, p: [2.8, -1.85, -1.7], l: [3.99, -2.0, -2.6], fov: 32 },
  // G9 · 185,0-189,4 · "it pulls water straight out of the air… turns into liquid": macro dentro del balde
  { t: 185.0, p: [3.2, -1.55, -1.95], l: [3.55, -1.95, -2.55], fov: 40 },
  { t: 189.45, p: [3.42, -1.68, -2.25], l: [3.55, -1.98, -2.58], fov: 44 },
  // G10 · 218,5-226,2 · "Step 1… the top bucket… turn it upside down": el balde de arriba flota y gira
  { t: 218.45, p: [2.2, -1.4, -0.2], l: [3.3, -1.8, -2.2], fov: 36 },
  { t: 226.25, p: [2.5, -1.55, -0.85], l: [3.35, -1.7, -2.25], fov: 33 },
  // G11 · 233,1-238,7 · "a strainer… don't drill the sides": vista de la base con los agujeros
  { t: 233.0, p: [2.85, -1.05, -1.65], l: [3.35, -1.62, -2.25], fov: 34 },
  { t: 238.75, p: [2.75, -1.25, -1.55], l: [3.35, -1.65, -2.25], fov: 32 },
  // G12 · 250,5-262,6 · "inside the second bucket… nest too deep… sits in its own water" (rayos X)
  { t: 250.4, p: [2.4, -1.75, -0.9], l: [3.55, -2.1, -2.55], fov: 34 },
  { t: 262.6, p: [2.75, -2.0, -1.35], l: [3.55, -2.2, -2.55], fov: 30 },
  // G13 · 271,2-277,0 · "holds the top bucket up… six inches of space"
  { t: 271.15, p: [2.75, -2.0, -1.35], l: [3.55, -2.15, -2.55], fov: 31 },
  { t: 277.05, p: [2.6, -1.85, -1.15], l: [3.55, -2.1, -2.55], fov: 33 },
  // G14 · 291,7-294,0 · "Step 5. Leave the lid off": la tapa sale volando
  { t: 291.65, p: [2.9, -1.5, -1.55], l: [3.55, -1.95, -2.55], fov: 36 },
  { t: 294.0, p: [2.7, -1.35, -1.3], l: [3.55, -1.9, -2.55], fov: 38 },
  // G15 · 299,4-307,2 · "moisture sinks and gathers in the low, still corners": vista alta, la niebla baja a los rincones
  { t: 299.4, p: [0.0, -0.45, 8.6], l: [0.4, -2.0, -1.0], fov: 44 },
  { t: 307.25, p: [1.4, -0.7, 4.6], l: [2.8, -2.3, -2.0], fov: 42 },
  // G16 · 315,8-320,0 · "a foot or so off the wall… build two or three, one per corner"
  { t: 315.8, p: [2.7, -1.0, -1.0], l: [3.7, -2.3, -2.7], fov: 34 },
  { t: 320.05, p: [0.0, -0.5, 7.4], l: [0.0, -2.1, -1.0], fov: 46 },
  // G18 · 349,1-354,6 · "Block walls, no windows open. Hygrometer on the shelf read 74%"
  { t: 349.1, p: [0.2, -0.9, 6.8], l: [0.8, -1.4, -2.0], fov: 40 },
  { t: 352.0, p: [1.15, -1.0, -2.2], l: [1.2, -1.04, -2.86], fov: 30 },
  { t: 354.65, p: [1.18, -1.02, -2.4], l: [1.2, -1.04, -2.86], fov: 28 },
  // G19 · 365,0-378,9 · time-lapse de 7 días: las bolitas brillan, se pegan, el charco crece, 74 → 52
  { t: 365.0, p: [2.85, -1.7, -1.6], l: [3.55, -2.05, -2.55], fov: 34 },
  { t: 369.6, p: [3.0, -1.6, -1.85], l: [3.55, -2.05, -2.55], fov: 32 },
  { t: 372.45, p: [2.75, -2.05, -1.5], l: [3.55, -2.2, -2.55], fov: 32 },
  { t: 376.4, p: [2.1, -1.4, -1.0], l: [2.5, -1.6, -2.6], fov: 38 },
  { t: 379.0, p: [1.4, -1.1, -2.1], l: [1.2, -1.04, -2.86], fov: 32 },
  // G21 · 438,4-444,2 · "it is not going to fix a leak… while the water is still coming through the wall"
  { t: 438.35, p: [1.8, -1.3, 2.4], l: [3.6, -2.0, -1.6], fov: 38 },
  { t: 444.2, p: [5.6, -1.2, 7.4], l: [4.2, -1.6, 0.8], fov: 38 },
  // G22 · 466,7-472,0 · el papel aluminio: gotas del lado del cuarto (aire) → el agua viene de la tierra por detrás
  { t: 466.7, p: [3.25, -1.25, 0.15], l: [3.99, -1.25, -0.6], fov: 32 },
  { t: 469.2, p: [3.3, -1.25, 0.2], l: [3.99, -1.25, -0.6], fov: 30 },
  { t: 472.05, p: [5.3, -1.1, 6.2], l: [4.2, -1.3, 1.2], fov: 36, arc: 0.2 },
  // G23 · 486,0-489,5 · "90% of the wet basements I ever fixed started at the gutters": sube a la canaleta
  { t: 486.0, p: [9.0, -0.2, 9.5], l: [4.4, 0.2, 1.5], fov: 40 },
  { t: 489.55, p: [7.4, 3.3, 5.8], l: [4.7, 2.6, 1.4], fov: 38, arc: 0.3 },
  // G24 · 495,8-499,1 · "a downspout that empties at the base of the wall does the same thing"
  { t: 495.8, p: [7.6, 0.9, 6.8], l: [4.9, -0.2, 2.4], fov: 40 },
  { t: 499.15, p: [7.0, -0.5, 7.4], l: [4.7, -1.2, 2.3], fov: 40 },
  // G26 · 519,5-523,2 · "let's put it all together": órbita al corte entero
  { t: 519.45, p: [-6.0, 2.5, 12.5], l: [0.5, -0.4, 0], fov: 40 },
  { t: 523.2, p: [6.0, 3.0, 13.0], l: [0.5, -0.4, 0], fov: 40, arc: 0.4 },
  // G27 · 527,0-534,7 · "fix the gutters and the downspouts first, and then build the bucket"
  { t: 527.0, p: [9.5, 2.6, 8.5], l: [4.8, 0.6, 1.8], fov: 40 },
  { t: 530.8, p: [8.2, 0.6, 8.0], l: [5.8, 0.0, 2.3], fov: 38 },
  { t: 534.75, p: [2.5, -1.4, 1.6], l: [3.55, -2.0, -2.5], fov: 38, arc: 0.4 },
  // G28 · 540,5-547,1 · "Water's patient… twenty years to rot a sill plate"
  { t: 540.5, p: [5.4, 0.35, 4.6], l: [4.0, 0.03, 1.4], fov: 32 },
  { t: 547.15, p: [4.85, 0.18, 3.65], l: [4.0, 0.03, 1.2], fov: 28 },
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
export const project = (c: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.02, 400); cam.position.copy(c.p); cam.lookAt(c.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  const pa = project(a, b.l), pb = project(b, b.l);
  return { bx: Math.min(12, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(8, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.02; c.far = 400; c.updateProjectionMatrix();
  return null;
};

// ---------------- EFECTOS por tramo (todo anclado a la voz) ----------------
export type FX = {
  musty: number; vapor: number; cond: number; warm: number; soilWet: number; capil: number; mold: number; seep: number;
  fog: number; gutter: number; spout: number; ext: number; foil: number; foilFront: number; foilBack: number; rot: number;
  topLift: number; topFlip: number; holes: number; screen: number; cans: number; deep: number; pellets: number; gloss: number;
  melt: number; liquid: number; xray: number; lid: number; lidFly: number; scale: number; needle: number; extra: number;
  hygro: number; days: number; hero: number; thirst: number; dimFoot: number; dim6: number; leak: number; slope: number;
};
const Z: FX = { musty: 0, vapor: 0, cond: 0.25, warm: 0, soilWet: 0.25, capil: 0, mold: 0.35, seep: 0, fog: 0, gutter: 0, spout: 0, ext: 0, foil: 0, foilFront: 0, foilBack: 0, rot: 0,
  topLift: 0, topFlip: 0, holes: 1, screen: 1, cans: 1, deep: 0, pellets: 1, gloss: 0, melt: 0, liquid: 0, xray: 0, lid: 0, lidFly: 0, scale: 0, needle: 0, extra: 0,
  hygro: 74, days: 0, hero: 0, thirst: 0, dimFoot: 0, dim6: 0, leak: 0, slope: 0 };
export const fxAt = (t: number): FX => {
  const f: FX = { ...Z };
  if (t < 12) { f.musty = win(t, 5.9, 6.8); f.cond = 0.35; f.mold = 0.55; }
  else if (t < 32) { f.musty = 0.6 * (1 - win(t, 25, 26.5)); f.vapor = win(t, 24.9, 25.6); f.cond = lerp(0.3, 1, win(t, 25.9, 30.5)); f.mold = 0.55; }
  else if (t < 48) { f.hero = win(t, 42.0, 43.4); f.vapor = 0.25; }
  else if (t < 64) {
    f.scale = 1; f.days = t < 52 ? 0 : Math.min(7, 1 + Math.floor((t - 52) / 0.75)); f.needle = win(t, 52, 57.3);
    f.liquid = 0.85 * win(t, 52, 57.3); f.gloss = win(t, 52, 55); f.melt = 0.5 * win(t, 53, 57.3); f.xray = win(t, 51.8, 52.6) * (1 - win(t, 58.4, 58.8));
    f.leak = win(t, 58.8, 59.6); f.seep = win(t, 58.8, 60); f.capil = 0.6;
  }
  else if (t < 96) { f.soilWet = lerp(0.25, 1, win(t, 90.4, 92.0)); f.seep = win(t, 90.6, 92.2); f.vapor = 0.1; f.capil = 0.3 * win(t, 92.5, 94); }
  else if (t < 110) { f.warm = win(t, 99.7, 100.4); f.vapor = 0.3; f.cond = lerp(0.25, 0.8, win(t, 102.5, 104.5)); }
  else if (t < 132) { f.soilWet = 0.8; f.capil = lerp(0.1, 1, win(t, 118.3, 121.5)); f.hygro = lerp(55, 78, win(t, 124.4, 126.4)); f.mold = lerp(0.15, 1, win(t, 127.3, 130.0)); f.cond = 0.6; }
  else if (t < 192) { f.thirst = win(t, 185.1, 185.6); f.vapor = 0.6; f.gloss = win(t, 185.6, 187.5); f.melt = win(t, 186.2, 189.3) * 0.7; f.liquid = 0.25 * win(t, 186.5, 189.4); }
  else if (t < 228) { f.topLift = win(t, 218.6, 220.5); f.topFlip = win(t, 224.1, 225.6); f.holes = 0; f.screen = 0; f.cans = 0; f.pellets = 0; f.lid = 0; }
  else if (t < 240) { f.topLift = 1; f.topFlip = 1; f.holes = win(t, 233.2, 234.6); f.screen = 0; f.cans = 0; f.pellets = 0; }
  else if (t < 264) {
    f.topLift = 1 - win(t, 250.4, 252.6); f.topFlip = 0; f.screen = 1; f.cans = 0; f.pellets = 0; f.deep = 1; f.xray = win(t, 252.4, 253.4);
    f.liquid = 0.55 * win(t, 258.6, 260.4);
  }
  else if (t < 280) { f.cans = 1; f.pellets = 0; f.xray = 1 - win(t, 276.0, 276.9); f.dim6 = win(t, 271.8, 272.5) * (1 - win(t, 276.2, 276.8)); }
  else if (t < 296) { f.lid = 1 - win(t, 292.7, 293.0); f.lidFly = win(t, 292.75, 293.9); }
  else if (t < 309) { f.fog = win(t, 299.6, 306.5); f.vapor = 0.2; }
  else if (t < 322) { f.dimFoot = win(t, 315.9, 316.6) * (1 - win(t, 317.3, 317.7)); f.extra = win(t, 317.6, 319.6); }
  else if (t < 356) { f.hygro = 74; }
  else if (t < 382) {
    const d = (t - 365) / (378.9 - 365);
    f.days = t < 365 ? 0 : Math.min(7, 1 + Math.floor(cl(d) * 7));
    f.gloss = win(t, 365.0, 366.5); f.melt = lerp(0, 0.85, win(t, 369.6, 378.5)); f.liquid = lerp(0, 0.9, win(t, 371.5, 378.5));
    f.xray = win(t, 372.5, 373.3); f.hygro = Math.round(lerp(74, 52, win(t, 365.2, 378.9)));
  }
  else if (t < 446) { f.seep = win(t, 440.6, 442.5); f.capil = 0.7; f.cond = 0.4; f.leak = win(t, 441.0, 442.0); }
  else if (t < 474) { f.foil = 1; f.foilFront = win(t, 461.4, 466.9); f.foilBack = win(t, 469.4, 470.6); f.seep = win(t, 469.6, 471.2); }
  else if (t < 500) { f.gutter = win(t, 488.6, 489.4); f.spout = win(t, 495.9, 496.6); f.seep = t > 495 ? win(t, 496.4, 498.6) : 0; f.soilWet = 0.6; }
  else if (t < 526) { f.cond = 0.3; f.hero = 1; }
  else if (t < 537) { f.ext = win(t, 527.4, 528.6); f.spout = 1; f.gutter = 0; f.soilWet = lerp(0.6, 0.15, win(t, 528.6, 531.0)); f.hero = win(t, 532.0, 533.5); }
  else { f.rot = win(t, 541.8, 546.4); f.soilWet = 0.5; f.days = 0; }
  return f;
};

// ---------------- texturas propias del sótano ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useBasementTex = () => useMemo(() => ({
  // bloques de hormigón con salitre blanco abajo y manchas húmedas
  block: mk(512, 512, (g) => {
    g.fillStyle = "#93928c"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) {
      const off = (r % 2) * 85, v = 112 + rnd(r * 3 + c, 1) * 22;
      for (const dx of [-170, 0]) { g.fillStyle = `rgb(${v},${v + 1},${v - 3})`; g.fillRect(c * 170 + off + dx + 3, r * 64 + 3, 164, 58); }
    }
    for (let i = 0; i < 2600; i++) { const v = 90 + rnd(i, 7) * 80; g.fillStyle = `rgba(${v},${v},${v},.22)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [7, 1.56]),
  // salitre + humedad (alfa): denso abajo, mechones que suben
  efflo: mk(1024, 512, (g) => {
    g.clearRect(0, 0, 1024, 512);
    const gr = g.createLinearGradient(0, 512, 0, 0); gr.addColorStop(0, "rgba(240,240,232,.7)"); gr.addColorStop(0.08, "rgba(236,236,228,.32)"); gr.addColorStop(0.22, "rgba(236,236,228,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 500; i++) { const x = rnd(i, 1) * 1024, y = 512 - Math.pow(rnd(i, 2), 1.8) * 200, r = 10 + rnd(i, 3) * 36; const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, "rgba(242,242,234,.13)"); q.addColorStop(1, "rgba(242,242,234,0)"); g.fillStyle = q; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 7000; i++) { const x = rnd(i, 7) * 1024, y = 512 - Math.pow(rnd(i, 8), 2.4) * 180; g.fillStyle = `rgba(250,250,244,${0.08 + rnd(i, 9) * 0.18})`; g.fillRect(x, y, 1, 1); }
  }, [3, 1]),
  wet: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    for (let i = 0; i < 60; i++) { const x = rnd(i, 5) * 256, y = 150 + rnd(i, 6) * 106, r = 20 + rnd(i, 7) * 60; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(25,30,32,.55)"); gr.addColorStop(1, "rgba(25,30,32,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }
    const gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, "rgba(20,26,30,.7)"); gr.addColorStop(0.5, "rgba(20,26,30,.25)"); gr.addColorStop(1, "rgba(20,26,30,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  }, [1, 1]),
  // capilaridad: frente de agua que sube desde la zapata (borde dentado)
  capil: mk(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    g.beginPath(); g.moveTo(0, 512);
    for (let x = 0; x <= 512; x += 8) g.lineTo(x, 40 + Math.sin(x * 0.05) * 18 + rnd(x, 3) * 26);
    g.lineTo(512, 512); g.closePath();
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(60,120,170,.18)"); gr.addColorStop(0.15, "rgba(45,85,120,.32)"); gr.addColorStop(1, "rgba(30,55,80,.45)");
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(160,220,255,.9)"; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= 512; x += 8) { const y = 40 + Math.sin(x * 0.05) * 18 + rnd(x, 3) * 26; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }),
  mold: mk(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    for (let i = 0; i < 520; i++) {
      const y = 512 - Math.pow(rnd(i, 1), 1.6) * 512, x = rnd(i, 2) * 512 * (0.35 + 0.65 * (512 - y) / 512) + 512 * (1 - (0.35 + 0.65 * (512 - y) / 512));
      const r = 1.5 + rnd(i, 3) * 6 * (1 - (512 - y) / 900);
      g.fillStyle = `rgba(${12 + rnd(i, 4) * 20},${16 + rnd(i, 5) * 22},${10 + rnd(i, 6) * 12},${0.5 + rnd(i, 7) * 0.45})`; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
    }
  }),
  // tierra en capas para el corte: pasto, tierra negra, arcilla, grava junto a la zapata
  strata: mk(512, 512, (g) => {
    const bands: [number, string][] = [[0, "#3b2a1c"], [22, "#5a3d27"], [110, "#7a5333"], [280, "#8a6545"], [420, "#6c6258"]];
    bands.forEach(([y, c], i) => { g.fillStyle = c; g.fillRect(0, y, 512, (bands[i + 1]?.[0] ?? 512) - y); });
    for (let i = 0; i < 2400; i++) { const y = rnd(i, 3) * 512, v = rnd(i, 4); g.fillStyle = y > 420 ? `rgba(${150 + v * 70},${145 + v * 60},${135 + v * 50},.7)` : `rgba(${20 + v * 60},${12 + v * 40},${6 + v * 20},.25)`; g.beginPath(); g.arc(rnd(i, 2) * 512, y, y > 420 ? 2 + v * 5 : 1 + v * 2, 0, 6.3); g.fill(); }
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(70,45,25,${0.2 + rnd(i, 5) * 0.25})`; g.lineWidth = 0.6 + rnd(i, 6) * 0.9; g.beginPath(); let x = rnd(i, 7) * 512, y = rnd(i, 8) * 40; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rnd(i * 9 + k, 1) - 0.5) * 40; y += 4 + rnd(i * 9 + k, 2) * 8; g.lineTo(x, y); } g.stroke(); }
  }, [3, 1]),
  grass: mk(256, 256, (g) => {
    g.fillStyle = "#4d6b2e"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${60 + v * 60},${90 + v * 70},${30 + v * 30},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1.5, 3 + v * 3); }
  }, [8, 8]),
  glow: mk(256, 256, (g) => { const gr = g.createRadialGradient(100, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }),
  bucketLabel: mk(512, 128, (g) => {
    g.fillStyle = "#f4f4f1"; g.fillRect(0, 0, 512, 128);
    g.fillStyle = "#e85a1e"; g.fillRect(0, 34, 512, 52);
    g.fillStyle = "#fff"; g.font = "900 34px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("5 GAL", 256, 62);
  }),
}), []);
// pantalla del higrómetro (dígitos)
const useHygro = (v: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 160; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#c9d3c2"; g.fillRect(0, 0, 256, 160);
  g.fillStyle = "rgba(0,0,0,.06)"; g.font = "bold 96px 'Courier New', monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("88", 112, 84);
  g.fillStyle = v >= 60 ? "#7a1d12" : "#13301d"; g.fillText(String(Math.round(v)), 112, 84);
  g.font = "bold 44px sans-serif"; g.fillText("%", 210, 96);
  g.font = "bold 22px sans-serif"; g.fillStyle = "#26302a"; g.fillText("RH", 210, 40);
  tex.needsUpdate = true;
  return tex;
};
// esfera de la balanza: aguja que gira
const useDial = (k: number) => {
  const { cv, tex } = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return { cv, tex }; }, []);
  const g = cv.getContext("2d")!;
  g.fillStyle = "#f2efe6"; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "#222"; g.lineWidth = 3;
  for (let i = 0; i <= 40; i++) { const a = -Math.PI * 0.85 + (i / 40) * Math.PI * 1.7; const r1 = i % 5 ? 104 : 92; g.beginPath(); g.moveTo(128 + Math.cos(a) * r1, 140 + Math.sin(a) * r1); g.lineTo(128 + Math.cos(a) * 114, 140 + Math.sin(a) * 114); g.stroke(); }
  const a = -Math.PI * 0.85 + (0.05 + 0.5 * k) * Math.PI * 1.7;
  g.strokeStyle = "#d22"; g.lineWidth = 6; g.beginPath(); g.moveTo(128, 140); g.lineTo(128 + Math.cos(a) * 100, 140 + Math.sin(a) * 100); g.stroke();
  g.fillStyle = "#222"; g.beginPath(); g.arc(128, 140, 10, 0, 6.3); g.fill();
  tex.needsUpdate = true;
  return tex;
};

// ---------------- partículas (punto redondo suave, nunca cuadrado) ----------------
let dotT: THREE.Texture | null = null;
const softDot = () => {
  if (dotT) return dotT;
  const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); dotT = new THREE.CanvasTexture(cv); return dotT;
};
const Pts: React.FC<{ pts: Float32Array; color: string; size: number; opacity: number; add?: boolean }> = ({ pts, color, size, opacity, add = true }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  if (opacity < 0.01) return null;
  return <points geometry={geo}><pointsMaterial map={softDot()} alphaTest={0.01} color={color} size={size} sizeAttenuation transparent opacity={opacity} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} depthWrite={false} toneMapped={false} /></points>;
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} /></mesh>
);
// pared de bloques: núcleo un pelo más fino que las caras (sin z-fighting), canto del corte con el hueco de los bloques
const BlockWall: React.FC<{ p: V3; s: V3; axis: "x" | "z"; tx: ReturnType<typeof useBasementTex>; wet?: number }> = ({ p, s, axis, tx, wet = 0.35 }) => {
  const inner = axis === "z" ? [0, 0, s[2] / 2 + 0.003] : [-s[0] / 2 - 0.003, 0, 0];
  const len = axis === "z" ? s[0] : s[2];
  const rotI: V3 = axis === "z" ? [0, 0, 0] : [0, -Math.PI / 2, 0];
  return (
    <group position={p}>
      <mesh castShadow receiveShadow><boxGeometry args={[s[0] - (axis === "x" ? 0.006 : 0), s[1], s[2] - (axis === "z" ? 0.006 : 0)]} /><meshStandardMaterial color="#8c8d8a" roughness={0.95} /></mesh>
      <mesh position={inner as V3} rotation={rotI} receiveShadow><planeGeometry args={[len, s[1]]} /><meshStandardMaterial map={tx.block} roughness={0.92} /></mesh>
      <mesh position={[inner[0] * 1.002 + (axis === "x" ? -0.001 : 0), 0, inner[2] * 1.002 + (axis === "z" ? 0.001 : 0)]} rotation={rotI}><planeGeometry args={[len, s[1]]} /><meshStandardMaterial map={tx.wet} transparent opacity={wet} depthWrite={false} roughness={0.4} /></mesh>
      <mesh position={[inner[0] * 1.004 + (axis === "x" ? -0.002 : 0), 0, inner[2] * 1.004 + (axis === "z" ? 0.002 : 0)]} rotation={rotI}><planeGeometry args={[len, s[1]]} /><meshStandardMaterial map={tx.efflo} transparent opacity={0.85} depthWrite={false} roughness={1} /></mesh>
    </group>
  );
};
// canto del corte (z=+3): bloque con huecos
const CutFace: React.FC<{ x: number; w: number; y0: number; y1: number }> = ({ x, w, y0, y1 }) => (
  <group position={[x, (y0 + y1) / 2, 3.002]}>
    <mesh><planeGeometry args={[w, y1 - y0]} /><meshStandardMaterial color="#cfccc4" roughness={1} /></mesh>
    {Array.from({ length: Math.floor((y1 - y0) / 0.2) }, (_, i) => <mesh key={i} position={[0, -(y1 - y0) / 2 + 0.1 + i * 0.2, 0.001]}><planeGeometry args={[w * 0.45, 0.13]} /><meshStandardMaterial color="#5d5b57" roughness={1} /></mesh>)}
  </group>
);

// balde de 5 galones (torno): abierto arriba, con aro de refuerzo; rayos X = semitransparente
const bucketGeo = (() => {
  let g: THREE.LatheGeometry | null = null;
  return () => {
    if (g) return g;
    const pts = [new THREE.Vector2(0.0, 0), new THREE.Vector2(BR - 0.018, 0), new THREE.Vector2(BR - 0.012, 0.004), new THREE.Vector2(BR - 0.004, BH * 0.5), new THREE.Vector2(BR, BH - 0.05),
      new THREE.Vector2(BR + 0.008, BH - 0.045), new THREE.Vector2(BR + 0.008, BH - 0.03), new THREE.Vector2(BR + 0.004, BH - 0.028), new THREE.Vector2(BR + 0.01, BH - 0.01), new THREE.Vector2(BR + 0.01, BH), new THREE.Vector2(BR - 0.004, BH)];
    g = new THREE.LatheGeometry(pts, 48); return g;
  };
})();
const Bucket: React.FC<{ p: V3; rot?: V3; xray: number; tint?: string; children?: React.ReactNode }> = ({ p, rot, xray, tint = "#f3f3ef", children }) => (
  <group position={p} rotation={rot}>
    <mesh geometry={bucketGeo()} castShadow={xray < 0.5} receiveShadow><meshStandardMaterial color={tint} roughness={0.38} side={THREE.DoubleSide} transparent={xray > 0.01} opacity={1 - 0.72 * xray} depthWrite={xray < 0.5} /></mesh>
    {/* asa de alambre */}
    <mesh position={[0, BH - 0.02, 0]} rotation={[0, 0, 0]}><torusGeometry args={[BR + 0.012, 0.0025, 6, 40, Math.PI]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} /></mesh>
    {children}
  </group>
);

// ---------------- LA ESCENA ----------------
export const BasementWorld: React.FC<{ t: number; fx?: Partial<FX> }> = ({ t, fx: over }) => {
  const f = { ...fxAt(t), ...(over ?? {}) };
  const tx = useBasementTex();
  const kt = useTextures();
  const hyg = useHygro(f.hygro);
  const dial = useDial(f.needle);
  const fl = Math.round(t * FPS);
  // ciclo del time-lapse: la ventana se prende y se apaga 7 veces
  const lapse = t > 365 && t < 379 ? 0.5 + 0.5 * Math.sin(((t - 365) / 2) * Math.PI * 2 - Math.PI / 2) : 1;
  const day = 0.55 + 0.45 * lapse;
  const xr = f.xray;

  // ---- balde: estados ----
  const flip = f.topFlip * Math.PI;
  const nestY = FL + 0.012 + (f.deep > 0.5 ? 0.03 : CANH);           // donde apoya el de arriba
  const topPos: V3 = [BK[0] - 0.25 * f.topLift, nestY + 0.6 * f.topLift + (f.topFlip > 0 ? 0.0 : 0), BK[2] + 0.35 * f.topLift];
  const showScale = f.scale > 0.5;
  const baseY = BK[1] + (showScale ? 0.055 : 0);
  // bolitas de cloruro de calcio (adentro del balde de arriba): se mojan, brillan, se encogen
  const nP = 520;
  const pel = useMemo(() => {
    const a: V3[] = [];
    for (let i = 0; i < nP; i++) { const r = Math.sqrt(rnd(i, 1)) * (BR - 0.025), th = rnd(i, 2) * 6.283; a.push([Math.cos(th) * r, 0.02 + rnd(i, 3) * 0.1, Math.sin(th) * r]); }
    return a;
  }, []);
  const pelMesh = useMemo(() => new THREE.InstancedMesh(new THREE.SphereGeometry(0.0085, 8, 6), new THREE.MeshStandardMaterial({ color: "#f6f6f2", roughness: 0.6 }), nP), []);
  const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
  const nShow = Math.round(nP * f.pellets);
  for (let i = 0; i < nP; i++) {
    const s0 = i < nShow ? (1 - f.melt * (0.5 + 0.5 * rnd(i, 5))) * (0.8 + rnd(i, 6) * 0.5) : 0;
    const [x, y, z] = pel[i];
    const sink = f.melt * 0.05 * rnd(i, 8);
    sc.set(s0, s0 * (1 - 0.3 * f.gloss), s0); mm.compose(new THREE.Vector3(x, Math.max(0.012, y * (1 - f.melt * 0.55) - sink), z), q, sc); pelMesh.setMatrixAt(i, mm);
  }
  pelMesh.instanceMatrix.needsUpdate = true;
  const pm = pelMesh.material as THREE.MeshStandardMaterial;
  pm.roughness = lerp(0.65, 0.08, f.gloss); pm.color.set(new THREE.Color("#f6f6f2").lerp(new THREE.Color("#dfeaf0"), f.gloss)); pm.metalness = 0.05 * f.gloss;

  // ---- partículas ----
  // olor a humedad: mechones verdosos lentos en el rincón
  const nM = 420, mP = new Float32Array(nM * 3);
  for (let i = 0; i < nM; i++) { const y = FL + 0.1 + ((rnd(i, 2) * 1.9 + t * (0.05 + rnd(i, 3) * 0.06)) % 1.9); mP.set([1.4 + rnd(i, 1) * 2.5 + Math.sin(t * 0.4 + i) * 0.15, y, -2.9 + rnd(i, 4) * 3.2 + Math.cos(t * 0.3 + i) * 0.12], i * 3); }
  // vapor del aire (azul): flota y, con cond, se va hacia la pared derecha y la del fondo
  const nV = 900, vP = new Float32Array(nV * 3);
  for (let i = 0; i < nV; i++) {
    const x0 = -3.8 + rnd(i, 1) * 7.6, y0 = FL + 0.1 + rnd(i, 2) * 2.2, z0 = -2.9 + rnd(i, 3) * 5.6;
    const toR = rnd(i, 4) > 0.45, stick = cl(f.cond * 1.4 - rnd(i, 5) * 0.4) * (f.vapor > 0.05 ? 1 : 0);
    const xt = toR ? 3.97 : x0, zt = toR ? z0 : -2.97;
    vP.set([lerp(x0 + Math.sin(t * 0.5 + i) * 0.1, xt, stick), y0 + Math.sin(t * 0.7 + i * 2) * 0.06, lerp(z0, zt, stick)], i * 3);
  }
  // aire tibio (ámbar) que entra por la ventana, la ventilación del secarropas y las rendijas de la puerta → se enfría en la pared
  const srcs: V3[] = [PT.window, PT.vent, PT.door];
  const nW = 600, wP = new Float32Array(nW * 3), wC = new Float32Array(nW * 3);
  for (let i = 0; i < nW; i++) {
    const s0 = srcs[i % 3], u = ((rnd(i, 1) + (t - 99.5) * (0.18 + rnd(i, 2) * 0.1)) % 1);
    const end: V3 = [3.96, FL + 0.3 + rnd(i, 3) * 1.9, -2.8 + rnd(i, 4) * 3.6];
    const sp = (rnd(i, 5) - 0.5) * 0.5;
    wP.set([lerp(s0[0], end[0], u) + Math.sin(u * 7 + i) * 0.12, lerp(s0[1], end[1], u) + Math.sin(u * 3.1) * 0.25 + sp * 0.4, lerp(s0[2], end[2], u) + sp], i * 3);
    const c = new THREE.Color("#ffad57").lerp(new THREE.Color("#7fc8ff"), sm((u - 0.65) / 0.3)); wC.set([c.r, c.g, c.b], i * 3);
  }
  // sed de la sal: el vapor del cuarto converge al balde
  const nT = 500, tP = new Float32Array(nT * 3);
  for (let i = 0; i < nT; i++) {
    const u = ((rnd(i, 1) + t * (0.25 + rnd(i, 2) * 0.2)) % 1), r = (1 - u) * (0.6 + rnd(i, 3) * 0.9), th = rnd(i, 4) * 6.283 + u * 2.4;
    tP.set([BK[0] + Math.cos(th) * r, -1.98 + (1 - u) * (rnd(i, 5) * 0.8 - 0.1), BK[2] + Math.sin(th) * r], i * 3);
  }
  // niebla que baja a los rincones bajos y quietos
  const nF = 160, fP = new Float32Array(nF * 3);
  const corners: V3[] = [[3.4, FL + 0.2, -2.6], [-3.4, FL + 0.2, -2.6], [3.4, FL + 0.2, 2.4], [-3.4, FL + 0.2, 2.2]];
  for (let i = 0; i < nF; i++) {
    const c = corners[i % 4], k = cl(f.fog * 1.25 - rnd(i, 6) * 0.25);
    const x0 = -3.6 + rnd(i, 1) * 7.2, y0 = -1.2 + rnd(i, 2) * 1.0, z0 = -2.7 + rnd(i, 3) * 5.3;
    fP.set([lerp(x0, c[0] + (rnd(i, 4) - 0.5) * 0.9, k), lerp(y0, c[1] + rnd(i, 5) * 0.35, k), lerp(z0, c[2] + (rnd(i, 7) - 0.5) * 0.9, k)], i * 3);
  }
  // agua que baja por la tierra (en el canto del corte) junto a la pared derecha y la atraviesa
  const nS = 420, sP = new Float32Array(nS * 3);
  for (let i = 0; i < nS; i++) {
    const u = ((rnd(i, 1) + t * (0.22 + rnd(i, 2) * 0.12)) % 1);
    let x: number, y: number;
    if (u < 0.62) { const k = u / 0.62; x = lerp(4.9 + (rnd(i, 3) - 0.5) * 0.5, 4.32, k * k); y = lerp(0, -1.0 - rnd(i, 4) * 1.3, k); }
    else { const k = (u - 0.62) / 0.38; x = lerp(4.32, 3.95, k); y = -1.0 - rnd(i, 4) * 1.3 + Math.sin(k * 3) * 0.03; }
    sP.set([x, y, 3.012 - (u > 0.62 ? 0 : 0)], i * 3);
  }
  // agua que atraviesa la pared en el interior (gotitas que salen del bloque)
  const nL = 160, lP = new Float32Array(nL * 3);
  for (let i = 0; i < nL; i++) { const u = ((rnd(i, 1) + t * 0.6) % 1); lP.set([3.96 - u * 0.04, -1.85 - u * 0.5 - rnd(i, 2) * 0.1, -0.35 + (rnd(i, 3) - 0.5) * 0.35], i * 3); }
  // canaleta que rebalsa + caño que vuelca + prolongación
  const nG = 260, gP = new Float32Array(nG * 3);
  for (let i = 0; i < nG; i++) { const u = ((rnd(i, 1) + t * 0.9) % 1); gP.set([4.8 + u * 0.15, 2.7 - u * u * 2.7, -2.6 + rnd(i, 2) * 5.4], i * 3); }
  const nD = 220, dP = new Float32Array(nD * 3);
  for (let i = 0; i < nD; i++) {
    const u = ((rnd(i, 1) + t * 1.1) % 1);
    if (f.ext > 0.5) dP.set([4.95 + 1.8 * f.ext + u * 0.5, 0.06 - u * 0.05, 2.35 + (rnd(i, 2) - 0.5) * 0.2 * (1 + u * 3)], i * 3);
    else dP.set([4.95 + u * 0.25, 0.12 - u * 0.1, 2.35 + (rnd(i, 2) - 0.5) * 0.15 * (1 + u * 4)], i * 3);
  }
  // gotitas condensadas en las paredes (aparecen con cond)
  const nC = 700;
  const dropMesh = useMemo(() => new THREE.InstancedMesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshStandardMaterial({ color: "#cfe9ff", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 }), nC), []);
  const nCs = Math.round(nC * cl(f.cond));
  for (let i = 0; i < nC; i++) {
    const onR = i % 2 === 0, s0 = i < nCs ? 0.5 + rnd(i, 3) * 0.9 : 0;
    const y = FL + 0.1 + Math.pow(rnd(i, 1), 1.4) * 2.2, a = rnd(i, 2);
    const pos = onR ? new THREE.Vector3(3.985, y, -2.95 + a * 5.9) : new THREE.Vector3(-3.9 + a * 7.85, y, -2.985);
    sc.set(onR ? s0 * 0.45 : s0, s0 * 1.25, onR ? s0 : s0 * 0.45); mm.compose(pos, q, sc); dropMesh.setMatrixAt(i, mm);
  }
  dropMesh.instanceMatrix.needsUpdate = true;
  // gotitas en el papel aluminio (delante = condensación; atrás = viene de la tierra)
  const foilDrops = (side: number, k: number) => Array.from({ length: 40 }, (_, i) => i < 40 * k ? (
    <mesh key={i} position={[3.97 - side * 0.006, -1.42 + rnd(i, 1) * 0.3, -0.75 + rnd(i, 2) * 0.3]} scale={[0.4, 1.2, 1]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#d8efff" roughness={0.04} metalness={0.2} transparent opacity={0.9} /></mesh>
  ) : null);

  // ---- luces ----
  const bulb = 1.0;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35} threshold={0.9} exposure={0.88} env={0.18} />
      <color attach="background" args={[new THREE.Color("#8fa3b5").lerp(new THREE.Color("#1a2230"), 1 - day).getHex()]} />
      <fogExp2 attach="fog" args={[new THREE.Color("#8fa3b5").lerp(new THREE.Color("#1a2230"), 1 - day).getHex(), 0.012]} />
      <hemisphereLight args={[0xcfdbe6, 0x3a3128, 0.3 + 0.35 * day]} />
      <directionalLight position={[9, 14, 10]} intensity={1.6 * day} color="#fff1dc" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* bombita del sótano + relleno frío del corte para que se lea */}
      <pointLight position={[0.6, -0.45, -0.3]} intensity={6 * bulb} distance={9} color="#ffd9a0" />
      <pointLight position={[2.6, -1.0, 2.2]} intensity={1.4} distance={6} color="#c8d8ea" />
      <pointLight position={[-1.5, -1.2, 3.6]} intensity={1.3} distance={7} color="#c8d8ea" />
      <mesh position={[0.6, -0.42, -0.3]}><sphereGeometry args={[0.05, 16, 12]} /><meshBasicMaterial color="#fff2cf" toneMapped={false} /></mesh>
      <mesh position={[0.6, -0.2, -0.3]}><cylinderGeometry args={[0.004, 0.004, 0.4, 4]} /><meshStandardMaterial color="#222" /></mesh>

      {/* ===== TIERRA alrededor del sótano (corte en z=3 con las capas) ===== */}
      <Box p={[17.2, -4.5, -10.5]} s={[26, 9, 27]} c="#4a3423" r={1} cast={false} rad={0.001} />
      <Box p={[-17.2, -4.5, -10.5]} s={[26, 9, 27]} c="#4a3423" r={1} cast={false} rad={0.001} />
      <Box p={[0, -4.5, -15.1]} s={[8.4, 9, 24]} c="#4a3423" r={1} cast={false} rad={0.001} />
      <Box p={[0, -5.8, 0]} s={[8.4, 6.4, 6.2]} c="#4a3423" r={1} cast={false} rad={0.001} />
      <mesh position={[17.2, -4.5, 3.004]}><planeGeometry args={[26, 9]} /><meshStandardMaterial map={tx.strata} roughness={1} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#9bb4c8"), 0.35 * f.soilWet)} /></mesh>
      <mesh position={[-17.2, -4.5, 3.004]}><planeGeometry args={[26, 9]} /><meshStandardMaterial map={tx.strata} roughness={1} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#9bb4c8"), 0.35 * f.soilWet)} /></mesh>
      <mesh position={[0, -5.8, 3.104]}><planeGeometry args={[8.4, 6.4]} /><meshStandardMaterial map={tx.strata} roughness={1} /></mesh>
      {/* humedad de la tierra en el corte: brillo azul que respira, más fuerte junto a la pared */}
      {f.soilWet > 0.3 && [1, -1].map((sd) => (
        <mesh key={sd} position={[sd * 5.6, -1.9, 3.008]}><planeGeometry args={[5.5, 4.2]} />
          <meshBasicMaterial map={tx.glow} color="#5fb0ff" transparent opacity={0.1 * f.soilWet * (0.8 + 0.2 * Math.sin(t * 2))} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      ))}
      {/* pasto */}
      {[[17.2, -10.5, 26, 27], [-17.2, -10.5, 26, 27], [0, -15.1, 8.4, 24]].map(([x, z, w, d], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.004, z]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={tx.grass} roughness={1} /></mesh>
      ))}
      {/* banda de pasto en el canto del corte */}
      <mesh position={[17.2, -0.04, 3.006]}><planeGeometry args={[26, 0.08]} /><meshStandardMaterial color="#3f5a26" roughness={1} /></mesh>
      <mesh position={[-17.2, -0.04, 3.006]}><planeGeometry args={[26, 0.08]} /><meshStandardMaterial color="#3f5a26" roughness={1} /></mesh>
      {/* pendiente del terreno junto a la pared (cuña de tierra que aleja el agua) */}
      {f.slope > 0.01 && <mesh position={[4.9, 0.08 * f.slope, 1.0]} rotation={[0, 0, -0.12 * f.slope]} receiveShadow><boxGeometry args={[1.6, 0.16, 4]} /><meshStandardMaterial map={tx.grass} roughness={1} /></mesh>}

      {/* ===== SÓTANO ===== */}
      <Box p={[0, FL - 0.1, 0]} s={[8.0, 0.2, 6.0]} c="#7d7d79" r={0.9} rad={0.005} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FL + 0.002, 0]} receiveShadow><planeGeometry args={[8.0, 6.0]} /><meshStandardMaterial map={kt.concrete} roughness={0.8} color="#d6d3ca" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.2, FL + 0.004, -1.6]}><planeGeometry args={[3.6, 2.8]} /><meshStandardMaterial map={tx.wet} transparent opacity={0.55} depthWrite={false} /></mesh>
      {/* zapatas */}
      <Box p={[0, FL - 0.28, -3.1]} s={[8.8, 0.25, 0.6]} c="#77746e" r={1} rad={0.004} />
      <Box p={[4.1, FL - 0.28, 0]} s={[0.6, 0.25, 6.4]} c="#77746e" r={1} rad={0.004} />
      <Box p={[-4.1, FL - 0.28, 0]} s={[0.6, 0.25, 6.4]} c="#77746e" r={1} rad={0.004} />
      {/* paredes de bloques */}
      <BlockWall p={[0, -1.25, -3.1]} s={[8.4, 2.5, 0.2]} axis="z" tx={tx} />
      <BlockWall p={[4.1, -1.25, 0]} s={[0.2, 2.5, 6.0]} axis="x" tx={tx} wet={0.45} />
      <group rotation={[0, Math.PI, 0]}><BlockWall p={[4.1, -1.25, 0]} s={[0.2, 2.5, 6.0]} axis="x" tx={tx} wet={0.4} /></group>
      <CutFace x={4.1} w={0.2} y0={-2.5} y1={0} />
      <CutFace x={-4.1} w={0.2} y0={-2.5} y1={0} />
      {/* capilaridad: frente húmedo que sube desde la zapata por la pared derecha */}
      <mesh position={[3.992, FL + 0.02 + 1.2 * f.capil, -0.2]} rotation={[0, -Math.PI / 2, 0]} scale={[1, Math.max(0.001, f.capil), 1]}>
        <planeGeometry args={[5.6, 2.4]} /><meshStandardMaterial map={tx.capil} transparent opacity={0.85} depthWrite={false} roughness={0.25} /></mesh>
      {/* moho en el rincón */}
      <mesh position={[3.99, -1.75, -2.2]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[1.6, 1.3]} /><meshStandardMaterial map={tx.mold} transparent opacity={f.mold} depthWrite={false} roughness={1} /></mesh>
      <mesh position={[3.1, -1.8, -2.988]}><planeGeometry args={[1.8, 1.2]} /><meshStandardMaterial map={tx.mold} transparent opacity={f.mold * 0.8} depthWrite={false} roughness={1} /></mesh>
      {/* gotitas condensadas */}
      <primitive object={dropMesh} />
      {/* agua que entra por una grieta (filtración real) */}
      {f.leak > 0.01 && <>
        <mesh position={[3.988, -1.9, -0.35]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.012, 0.55]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
        <mesh position={[3.98, FL + 0.004, -0.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[f.leak, f.leak, 1]}><circleGeometry args={[0.7, 40]} /><meshStandardMaterial color="#2d4a5e" roughness={0.03} metalness={0.3} transparent opacity={0.75} /></mesh>
        <Pts pts={lP} color="#9fd6ff" size={0.035} opacity={0.9 * f.leak} />
      </>}
      {/* vigas del techo del sótano + placa solera arriba de los bloques */}
      {Array.from({ length: 17 }, (_, i) => <Box key={i} p={[-4 + i * 0.5, -0.13, 0]} s={[0.05, 0.24, 6.1]} c="#8a6a48" r={0.9} rad={0.006} />)}
      <Box p={[0, 0.03, -3.08]} s={[8.4, 0.06, 0.16]} c="#9b7a52" r={0.9} rad={0.006} />
      <Box p={[4.08, 0.03, 0]} s={[0.16, 0.06, 6.0]} c={new THREE.Color("#9b7a52").lerp(new THREE.Color("#2b2018"), f.rot).getStyle()} r={0.95} rad={0.006} />
      <Box p={[-4.08, 0.03, 0]} s={[0.16, 0.06, 6.0]} c="#9b7a52" r={0.9} rad={0.006} />
      {/* podredumbre: hongos y manchas en la solera */}
      {f.rot > 0.05 && Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[4.0 + rnd(i, 1) * 0.05, 0.03 + (rnd(i, 2) - 0.5) * 0.05, -0.6 + rnd(i, 3) * 3.0]} scale={f.rot * (0.6 + rnd(i, 4))}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#e9e2c8" roughness={1} /></mesh>)}
      {/* ventana alta del fondo (luz del día) */}
      <group position={[-0.5, -0.55, -2.99]}>
        <mesh><planeGeometry args={[0.9, 0.4]} /><meshBasicMaterial color={new THREE.Color("#cfe3f5").lerp(new THREE.Color("#0f1520"), 1 - day)} toneMapped={false} /></mesh>
        {[[0, 0.21, 1.0, 0.05], [0, -0.21, 1.0, 0.05], [-0.47, 0, 0.05, 0.47], [0.47, 0, 0.05, 0.47], [0, 0, 0.04, 0.42]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.01]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#e9e4da" /></mesh>)}
      </group>
      <spotLight position={[-0.5, -0.5, -3.3]} target-position={[-0.2, FL, 0.4]} angle={0.5} penumbra={0.8} intensity={14 * day} distance={7} color="#dfeeff" />
      {/* ventilación del secarropas (pared izquierda) y puerta exterior con rendijas de luz */}
      <mesh position={[-3.985, -0.5, -0.4]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.1, 24]} /><meshStandardMaterial color="#b9bcc0" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[-3.975, -0.5, -0.4]} rotation={[0, Math.PI / 2, 0]}><ringGeometry args={[0.1, 0.13, 24]} /><meshStandardMaterial color="#8d9196" metalness={0.6} /></mesh>
      <group position={[-3.985, -1.4, 2.0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><planeGeometry args={[0.85, 1.95]} /><meshStandardMaterial color="#5a4632" roughness={0.8} /></mesh>
        {[[0, 0.99, 0.9, 0.025], [0.44, 0, 0.025, 1.98], [-0.44, 0, 0.025, 1.98]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.004]}><planeGeometry args={[w, h]} /><meshBasicMaterial color="#ffe2a8" toneMapped={false} /></mesh>)}
      </group>
      {/* termotanque, estante con el higrómetro, cajas de cartón, banco */}
      <mesh position={[-1.4, FL + 0.75, -2.55]} castShadow receiveShadow><cylinderGeometry args={[0.28, 0.28, 1.5, 32]} /><meshStandardMaterial color="#d7d8d4" roughness={0.45} metalness={0.15} /></mesh>
      <mesh position={[-1.4, FL + 1.6, -2.55]}><cylinderGeometry args={[0.04, 0.04, 0.3, 12]} /><meshStandardMaterial color="#b77a45" metalness={0.8} roughness={0.3} /></mesh>
      <group position={[1.2, 0, -2.82]}>
        {[-1.65, -1.12].map((y) => <Box key={y} p={[0, y, 0]} s={[1.2, 0.03, 0.32]} c="#8a6a48" rad={0.004} />)}
        {[-0.58, 0.58].map((x) => <Box key={x} p={[x, -1.75, 0]} s={[0.03, 1.3, 0.3]} c="#7b7f84" m={0.5} r={0.4} rad={0.004} />)}
        <Box p={[-0.32, -1.53, 0]} s={[0.22, 0.2, 0.2]} c="#a68a62" rad={0.01} />
        <Box p={[0.35, -1.55, 0]} s={[0.16, 0.16, 0.16]} c="#5b6d7d" rad={0.02} />
        {/* higrómetro */}
        <Box p={[0, -1.03, -0.02]} s={[0.15, 0.12, 0.035]} c="#f0efe9" r={0.4} rad={0.012} />
        <mesh position={[0, -1.025, -0.0015]}><planeGeometry args={[0.12, 0.075]} /><meshStandardMaterial map={hyg} emissive="#ffffff" emissiveMap={hyg} emissiveIntensity={0.25} roughness={0.3} /></mesh>
      </group>
      {[[2.55, FL + 0.25, -2.7, 0.55, 0.5, 0.45], [2.6, FL + 0.72, -2.68, 0.5, 0.44, 0.4], [1.95, FL + 0.2, -2.72, 0.48, 0.4, 0.4]].map(([x, y, z, w, h, d], i) => (
        <group key={i}>
          <Box p={[x, y, z]} s={[w, h, d]} c={i === 0 ? "#8e7352" : "#a08259"} r={1} rad={0.01} rot={[0, (rnd(i, 3) - 0.5) * 0.12, i === 0 ? 0.03 : 0]} />
          {i === 0 && <mesh position={[x, y - h / 2 + 0.07, z + d / 2 + 0.002]}><planeGeometry args={[w, 0.14]} /><meshStandardMaterial color="#4a3a28" transparent opacity={0.7} /></mesh>}
        </group>
      ))}
      <Box p={[-3.55, FL + 0.45, -1.0]} s={[0.7, 0.06, 1.6]} c="#8a6a48" rad={0.006} />
      {[[-3.3, -1.7], [-3.8, -1.7], [-3.3, -0.3], [-3.8, -0.3]].map(([x, z], i) => <Box key={i} p={[x, FL + 0.22, z]} s={[0.05, 0.44, 0.05]} c="#6d533a" rad={0.004} />)}

      {/* ===== EL BALDE (rincón derecho-fondo) ===== */}
      {showScale && <group position={[BK[0], FL + 0.027, BK[2]]}>
        <Box p={[0, 0, 0]} s={[0.36, 0.055, 0.42]} c="#e8e6e0" r={0.4} rad={0.02} />
        <mesh position={[0, 0.03, 0.2]} rotation={[-0.2, 0, 0]}><planeGeometry args={[0.12, 0.08]} /><meshStandardMaterial map={dial} roughness={0.3} /></mesh>
      </group>}
      <Bucket p={[BK[0], baseY, BK[2]]} xray={xr}>
        {/* latas de sopa */}
        {f.cans > 0.01 && [0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos(i * 2.094) * 0.07, (CANH / 2 + 0.004) * f.cans, Math.sin(i * 2.094) * 0.07]} scale={[1, f.cans, 1]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, CANH, 20]} /><meshStandardMaterial color="#c9ced3" metalness={0.85} roughness={0.3} /></mesh>
        ))}
        {/* agua salada abajo (sube con los días) */}
        {f.liquid > 0.01 && <mesh position={[0, (0.11 * f.liquid) / 2 + 0.006, 0]}><cylinderGeometry args={[BR - 0.016, BR - 0.017, 0.11 * f.liquid, 40]} />
          <meshStandardMaterial color="#9cc7dd" roughness={0.04} metalness={0.15} transparent opacity={0.7} /></mesh>}
      </Bucket>
      {/* el de arriba (con agujeros, malla y la sal) */}
      <Bucket p={[topPos[0], baseY + (topPos[1] - BK[1]) + (f.topFlip > 0 ? BH * f.topFlip : 0), topPos[2]]} rot={[flip, 0, 0]} xray={xr} tint="#f7f7f3">
        {/* agujeros en la base: puntitos oscuros por fuera */}
        {f.holes > 0.01 && Array.from({ length: 26 }, (_, i) => {
          if (i > 26 * f.holes) return null; const r = i < 8 ? 0.045 : i < 26 ? 0.1 : 0; const a = (i < 8 ? i / 8 : (i - 8) / 18) * 6.283 + (i < 8 ? 0 : 0.17);
          return <mesh key={i} position={[Math.cos(a) * r, -0.0015, Math.sin(a) * r]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.0075, 12]} /><meshBasicMaterial color="#202020" side={THREE.DoubleSide} /></mesh>;
        })}
        {f.screen > 0.01 && <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[BR - 0.016, 40]} /><meshStandardMaterial color="#6a6f74" roughness={0.6} metalness={0.4} transparent opacity={0.85} /></mesh>}
        <primitive object={pelMesh} />
        {/* goteo por los agujeros */}
        {f.melt > 0.05 && <Pts pts={useMemo(() => new Float32Array(90 * 3), [])} color="#bfe6ff" size={0.012} opacity={0} />}
      </Bucket>
      {/* gotas que caen de los agujeros al balde de abajo */}
      {f.melt > 0.05 && f.cans > 0.5 && (() => {
        const n = 60, a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { const u = ((rnd(i, 1) + t * 1.6) % 1), r = 0.04 + rnd(i, 2) * 0.07, th = rnd(i, 3) * 6.283; a.set([BK[0] + Math.cos(th) * r, baseY + CANH + 0.005 - u * (CANH - 0.11 * f.liquid), BK[2] + Math.sin(th) * r], i * 3); }
        return <Pts pts={a} color="#bfe6ff" size={0.014} opacity={0.9 * f.melt} />;
      })()}
      {/* tapa que sale volando */}
      {(f.lid > 0.01 || (f.lidFly > 0.01 && f.lidFly < 0.99)) && (
        <group position={[BK[0] - 0.8 * f.lidFly, nestY + BH + 0.01 + 0.9 * Math.sin(f.lidFly * Math.PI) + f.lidFly * 0.4, BK[2] + 1.4 * f.lidFly]} rotation={[f.lidFly * 5.5, f.lidFly * 2, f.lidFly * 1.2]}>
          <mesh castShadow><cylinderGeometry args={[BR + 0.014, BR + 0.014, 0.02, 40]} /><meshStandardMaterial color="#f2f2ee" roughness={0.4} /></mesh>
        </group>
      )}
      {/* baldes extra en los otros rincones */}
      {f.extra > 0.01 && [[-3.5, -2.5], [3.5, 2.3]].map(([x, z], i) => {
        const k = cl(f.extra * 2 - i);
        return k > 0.01 ? <Bucket key={i} p={[x, FL + (1 - Math.min(1, k * 1.2)) * 1.4, z]} xray={0} /> : null;
      })}
      {/* cota de "un pie" entre el balde y las paredes */}
      {f.dimFoot > 0.01 && <>
        <mesh position={[BK[0] + BR + 0.15, FL + 0.03, BK[2]]}><boxGeometry args={[0.3 * f.dimFoot, 0.008, 0.008]} /><meshBasicMaterial color="#ffd166" toneMapped={false} /></mesh>
        <mesh position={[BK[0], FL + 0.03, BK[2] - BR - 0.15]}><boxGeometry args={[0.008, 0.008, 0.3 * f.dimFoot]} /><meshBasicMaterial color="#ffd166" toneMapped={false} /></mesh>
      </>}
      {/* cota de seis pulgadas debajo del balde de arriba */}
      {f.dim6 > 0.01 && <mesh position={[BK[0] + BR + 0.04, FL + 0.012 + CANH / 2, BK[2] + 0.02]}><boxGeometry args={[0.006, CANH * f.dim6, 0.006]} /><meshBasicMaterial color="#ffd166" toneMapped={false} /></mesh>}
      {/* luz de héroe sobre el balde */}
      {f.hero > 0.01 && <spotLight position={[BK[0] - 0.6, -0.3, BK[2] + 0.8]} target-position={[BK[0], FL, BK[2]]} angle={0.35} penumbra={0.9} intensity={10 * f.hero} distance={5} color="#ffe9c2" />}
      {/* papel aluminio pegado a la pared derecha */}
      {f.foil > 0.01 && <>
        <mesh position={[3.982, -1.27, -0.6]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.3, 0.3, 8, 8]} /><meshStandardMaterial color="#d9dde2" metalness={0.9} roughness={0.28} /></mesh>
        {[[-1.12, -0.6, 0.3, 0.04], [-1.42, -0.6, 0.3, 0.04], [-1.27, -0.45, 0.04, 0.3], [-1.27, -0.75, 0.04, 0.3]].map(([y, z, w, h], i) => <mesh key={i} position={[3.979, y, z]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#9aa0a7" roughness={0.6} metalness={0.3} /></mesh>)}
        {foilDrops(1, f.foilFront)}
        {/* detrás: el bloque oscuro y mojado que se ve por transparencia en el canto */}
        {f.foilBack > 0.01 && <mesh position={[3.99, -1.27, -0.6]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.34, 0.34]} /><meshBasicMaterial color="#5fb0ff" transparent opacity={0.35 * f.foilBack} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
      </>}

      {/* ===== PLANTA BAJA (corte) ===== */}
      <Box p={[0, 0.16, 0]} s={[8.6, 0.24, 6.4]} c="#8a6a48" r={0.9} rad={0.01} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.282, 0]} receiveShadow><planeGeometry args={[8.2, 6.0]} /><meshStandardMaterial map={kt.planks} roughness={0.55} /></mesh>
      <mesh position={[0, 0.17, 3.201]}><planeGeometry args={[8.6, 0.24]} /><meshStandardMaterial color="#d9c4a2" roughness={1} /></mesh>
      <Box p={[0, 1.55, -3.1]} s={[8.6, 2.6, 0.18]} c="#e7e1d4" r={0.95} rad={0.004} />
      <Box p={[4.2, 1.55, 0]} s={[0.18, 2.6, 6.4]} c="#e7e1d4" r={0.95} rad={0.004} />
      <Box p={[-4.2, 1.55, 0]} s={[0.18, 2.6, 6.4]} c="#e7e1d4" r={0.95} rad={0.004} />
      <mesh position={[4.295, 1.55, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[6.4, 2.6]} /><meshStandardMaterial map={kt.siding} color="#c9d3d8" roughness={0.9} /></mesh>
      {/* ventana lateral + sillón + mesa */}
      <group position={[4.11, 1.55, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh><planeGeometry args={[1.2, 1.1]} /><meshBasicMaterial color="#d6e7f5" toneMapped={false} /></mesh>
        {[[0, 0.58, 1.3, 0.07], [0, -0.58, 1.3, 0.07], [-0.63, 0, 0.07, 1.2], [0.63, 0, 0.07, 1.2], [0, 0, 0.05, 1.1]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.01]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#f2efe8" /></mesh>)}
      </group>
      <Box p={[-1.5, 0.58, -2.5]} s={[2.2, 0.55, 0.85]} c="#6c7a63" r={1} rad={0.06} />
      <Box p={[-1.5, 0.95, -2.85]} s={[2.2, 0.6, 0.2]} c="#65735c" r={1} rad={0.06} />
      <Box p={[1.4, 0.65, -0.6]} s={[1.2, 0.05, 0.8]} c="#6d4c33" rad={0.01} />
      {[[0.9, -0.95], [1.9, -0.95], [0.9, -0.25], [1.9, -0.25]].map(([x, z], i) => <Box key={i} p={[x, 0.46, z]} s={[0.05, 0.36, 0.05]} c="#5b3f2b" rad={0.004} />)}
      {/* techo a dos aguas (cumbrera a lo largo de z) */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[sd * 2.3, 3.75, -0.1]} rotation={[0, 0, sd * -0.42]}>
          <Box p={[0, 0, 0]} s={[5.1, 0.16, 6.9]} c="#3b3f45" r={0.85} rad={0.01} />
        </group>
      ))}
      <mesh position={[0, 2.86, 3.25]}><planeGeometry args={[8.6, 0.06]} /><meshStandardMaterial color="#d9c4a2" /></mesh>
      {/* canaleta (derecha) + caño de bajada */}
      <group position={[4.75, 2.72, -0.1]}>
        <Box p={[0, 0, 0]} s={[0.14, 0.12, 6.9]} c="#e9ecef" r={0.4} m={0.3} rad={0.01} />
        {/* hojas que la tapan */}
        {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.1, 0.07, -3.2 + rnd(i, 2) * 6.4]} rotation={[rnd(i, 3), rnd(i, 4), 0]}><sphereGeometry args={[0.04, 6, 4]} /><meshStandardMaterial color={["#6b4a22", "#8a6a2a", "#4d3a1e"][i % 3]} roughness={1} /></mesh>)}
      </group>
      <mesh position={[4.88, 1.4, 2.35]}><boxGeometry args={[0.08, 2.65, 0.08]} /><meshStandardMaterial color="#e9ecef" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[4.92, 0.1, 2.35]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.08, 0.2, 0.08]} /><meshStandardMaterial color="#e9ecef" roughness={0.4} metalness={0.3} /></mesh>
      {/* prolongación negra del caño (4 a 6 pies) */}
      {f.ext > 0.01 && <mesh position={[4.95 + 0.9 * f.ext, 0.06, 2.35]}><boxGeometry args={[1.8 * f.ext, 0.08, 0.1]} /><meshStandardMaterial color="#1f2124" roughness={0.6} /></mesh>}
      <Pts pts={gP} color="#b7e1ff" size={0.05} opacity={0.75 * f.gutter} />
      <Pts pts={dP} color="#b7e1ff" size={0.05} opacity={0.85 * f.spout} />
      {/* charco al pie de la pared cuando vuelca ahí */}
      {f.spout > 0.01 && f.ext < 0.5 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.9, 0.012, 2.2]} scale={[f.spout, f.spout, 1]}><circleGeometry args={[0.55, 32]} /><meshStandardMaterial color="#3d5566" roughness={0.03} metalness={0.4} transparent opacity={0.7} /></mesh>}
      {/* agua por la tierra (en el canto del corte) */}
      <Pts pts={sP} color="#7cc4ff" size={0.06} opacity={0.9 * f.seep} />

      {/* ===== aire ===== */}
      <Pts pts={mP} color="#9cae86" size={0.22} opacity={0.22 * f.musty} add={false} />
      <Pts pts={vP} color="#9fd2ff" size={0.035} opacity={0.75 * f.vapor} />
      {f.warm > 0.01 && (() => { const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(wP, 3)); geo.setAttribute("color", new THREE.BufferAttribute(wC, 3));
        return <points geometry={geo}><pointsMaterial map={softDot()} vertexColors size={0.07} sizeAttenuation transparent opacity={0.85 * f.warm} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></points>; })()}
      <Pts pts={tP} color="#a8dcff" size={0.022} opacity={0.9 * f.thirst} />
      <Pts pts={fP} color="#c6d3dc" size={0.9} opacity={0.18 * f.fog} add={false} />
      <primitive object={new THREE.Object3D()} />
      {void fl}
    </ThreeCanvas>
  );
};
