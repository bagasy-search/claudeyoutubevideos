// wade02 · EL MUNDO: la misma casa en CORTE de Tennessee, pero la protagonista es la PARED DERECHA del sótano.
// En el canto del corte (z = +3) se ve el bloque por dentro: los canalitos (poros) por donde el agua de la tierra sube sola
// como un ascensor; al llegar a la cara del sótano el agua se evapora y la SAL queda (la costra blanca con su línea de marea).
// Efectos por tramo (fxAt): pintura nueva → ampolla → revienta y se pela; mapa de la franja; flechas ARRIBA / DE COSTADO;
// papel aluminio abajo y arriba; vinagre que disuelve la sal; canaleta, caño, prolongación, pendiente y mulch afuera;
// sellador que reviste los canales (más angostos, sube menos agua); time-lapse de una temporada con la marea que baja.
// UNA cámara para todo el video (keyframes anclados a la voz). Render SÓLO en el farm (acá sólo stills).
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
const XI = 3.997;                // cara interior de la pared derecha (la de la franja)
const BAND = 0.95;               // la franja de sal: unos tres pies desde el piso

// ---------------- puntos para portales y rótulos ----------------
export const PT = {
  wallLow: [3.99, -2.1, -0.4] as V3,
  tide: [3.99, FL + BAND, -0.4] as V3,
  blister: [3.99, -2.1, 0.6] as V3,
  cut: [4.1, -1.95, 3.0] as V3,
  cutTop: [4.1, FL + BAND, 3.0] as V3,
  cutIn: [4.0, -1.9, 3.0] as V3,
  foilLo: [3.99, -2.05, -0.6] as V3,
  foilHi: [3.99, -0.85, -0.6] as V3,
  side: [3.99, -0.9, 1.2] as V3,
  soil: [5.4, -1.0, 3.0] as V3,
  gutter: [4.72, 2.72, 1.2] as V3,
  spoutOut: [4.95, 0.12, 2.35] as V3,
  extEnd: [6.75, 0.06, 2.35] as V3,
  grade: [5.6, 0.0, 2.2] as V3,
  mulch: [4.75, 0.15, 1.2] as V3,
  window: [-0.5, -0.55, -2.95] as V3,
};

// ---------------- CÁMARA: tramos 3D con keyframes [t, pos, look, fov] (tiempos = segundos de la voz) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const KEYS: Key[] = [
  // M1 · 4,4-8,0 · "two coats, looked brand new… Now it's October": la pared pintada, la cámara baja hacia el piso
  { t: 4.4, p: [0.8, -1.3, 3.2], l: [4.0, -1.6, -0.4], fov: 42 },
  { t: 6.8, p: [2.2, -1.75, 1.3], l: [4.0, -2.0, 0.5], fov: 38 },
  { t: 8.0, p: [2.6, -1.9, 1.2], l: [4.0, -2.05, 0.6], fov: 36 },
  // M2 · 22,4-26,2 · "Fuzzy, chalky, climbing up the block like frost": macro de los cristales
  { t: 22.4, p: [3.55, -2.08, 0.05], l: [4.0, -2.25, -0.3], fov: 36 },
  { t: 26.2, p: [3.68, -2.0, -0.2], l: [4.0, -1.98, -0.55], fov: 30 },
  // M3 · 37,8-41,9 · "the wall telling you exactly where the water is coming from": la franja es un mapa
  { t: 37.8, p: [1.2, -1.1, 6.0], l: [3.8, -1.8, 0.0], fov: 44 },
  { t: 41.9, p: [3.0, -1.4, 6.6], l: [4.1, -1.8, 1.5], fov: 40 },
  // M4 · 48,5-51,6 · "rising up from the floor, or pushing in from the dirt outside": flechas
  { t: 48.5, p: [2.0, -0.9, 9.0], l: [4.0, -1.5, 0.5], fov: 42 },
  { t: 51.6, p: [3.6, -1.0, 8.6], l: [4.3, -1.5, 0.8], fov: 42 },
  // wick0 · 123,7-129,5 · "here's what's going on. Concrete…": del corte entero al canto de la pared
  { t: 123.65, p: [3.0, -1.2, 8.0], l: [4.1, -1.8, 2.0], fov: 40 },
  { t: 129.55, p: [4.1, -1.95, 3.8], l: [4.1, -1.95, 3.0], fov: 40 },
  // wick1 · 141,7-147,7 · "water climbs up those channels all by itself": la cámara acompaña el ascensor
  { t: 141.7, p: [4.1, -2.12, 3.7], l: [4.1, -2.12, 3.0], fov: 40 },
  { t: 147.7, p: [4.1, -1.72, 3.85], l: [4.1, -1.72, 3.0], fov: 40 },
  // wick2 · 158,6-162,0 · "Earl called it a wick"
  { t: 158.6, p: [4.1, -1.75, 3.9], l: [4.1, -1.8, 3.0], fov: 40 },
  { t: 162.0, p: [3.4, -1.2, 6.5], l: [4.1, -1.8, 2.0], fov: 40 },
  // salt0 · 184,4-187,0 · "here's where the white crust comes from": al borde interior del canto
  { t: 184.4, p: [4.0, -1.6, 5.0], l: [4.1, -1.75, 3.0], fov: 38 },
  { t: 186.95, p: [3.82, -1.85, 3.75], l: [4.0, -1.9, 3.0], fov: 34 },
  // salt1 · 194,5-200,2 · "the water dries out into the air" → salt2 · 200,2-203,7 · "the salt can't dry out. It stays behind"
  { t: 194.5, p: [3.75, -1.85, 3.6], l: [3.98, -1.9, 3.0], fov: 34 },
  { t: 200.2, p: [3.2, -1.8, 2.2], l: [4.0, -1.95, 1.6], fov: 38 },
  { t: 203.75, p: [3.6, -2.1, 1.7], l: [4.0, -2.2, 1.4], fov: 32 },
  // tide · 240,2-249,7 · "like a ring in a bathtub… the tide mark": travelling a lo largo de la línea
  { t: 240.15, p: [2.0, -1.4, 2.8], l: [4.0, -1.5, 1.6], fov: 40 },
  { t: 249.7, p: [2.2, -1.4, -1.8], l: [4.0, -1.5, -2.6], fov: 40 },
  // side · 264,2-269,4 · "water pushing in sideways from the dirt outside"
  { t: 264.2, p: [3.8, -0.7, 8.5], l: [4.6, -1.1, 1.5], fov: 40 },
  { t: 269.4, p: [4.5, -0.9, 6.0], l: [4.4, -1.0, 2.0], fov: 38 },
  // foil · 309,4-317,7 · "peel it off and look… the room side of the foil"
  { t: 309.35, p: [3.2, -1.9, 0.0], l: [4.0, -2.0, -0.6], fov: 34 },
  { t: 317.7, p: [3.3, -1.95, -0.2], l: [4.0, -2.05, -0.6], fov: 30 },
  // foil2 · 327,9-332,6 · "do the foil twice, once down low… and once up high"
  { t: 327.9, p: [2.6, -1.5, 0.2], l: [4.0, -1.5, -0.6], fov: 40 },
  { t: 332.6, p: [2.0, -1.4, 0.2], l: [4.0, -1.45, -0.6], fov: 46 },
  // vinegar · 431,1-435,0 · "a mild acid… breaks up the last of the salt"
  { t: 431.1, p: [3.4, -1.95, 0.4], l: [4.0, -2.1, -0.1], fov: 36 },
  { t: 435.0, p: [3.55, -2.05, 0.25], l: [4.0, -2.15, -0.05], fov: 32 },
  // fill · 472,0-480,6 · "with no air moving, vinegar does the job": la pared limpia
  { t: 472.0, p: [1.4, -1.2, 3.4], l: [4.0, -1.8, -0.6], fov: 42 },
  { t: 480.6, p: [0.6, -1.1, 1.8], l: [4.0, -1.8, -1.4], fov: 42 },
  // roof · 502,0-512,6 · "the salt is still riding up… cut down how much water gets to that wall… most of the time, the"
  { t: 502.0, p: [4.1, -1.8, 4.6], l: [4.1, -1.9, 3.0], fov: 38 },
  { t: 507.0, p: [5.5, -0.6, 9.0], l: [4.6, -0.8, 2.0], fov: 40 },
  { t: 512.65, p: [8.5, 2.4, 8.5], l: [4.7, 1.6, 1.4], fov: 42 },
  // roof2 · 523,2-526,7 · "a basement leak is a roof leak that took the long way down": de la canaleta a la pared
  { t: 523.2, p: [7.8, 3.2, 6.6], l: [4.7, 2.4, 1.4], fov: 40 },
  { t: 526.7, p: [7.6, 0.4, 7.2], l: [4.8, -0.6, 2.4], fov: 40, arc: 0.2 },
  // slope · 565,4-578,5 · "the ground should slope away… 6 inches over the first 10 feet"
  { t: 565.4, p: [8.2, 0.8, 7.4], l: [5.4, 0.0, 2.3], fov: 40 },
  { t: 570.5, p: [8.4, 0.5, 7.0], l: [5.6, -0.1, 1.8], fov: 38 },
  { t: 578.5, p: [7.0, 0.35, 5.6], l: [5.0, 0.0, 1.4], fov: 38 },
  // mulch · 606,9-610,2 · "That mulch is a sponge sitting against your wall"
  { t: 606.9, p: [6.6, 0.7, 4.4], l: [4.7, 0.0, 1.4], fov: 38 },
  { t: 610.25, p: [6.0, 0.45, 3.9], l: [4.6, -0.1, 1.4], fov: 34 },
  // paint0 · 654,6-664,5 · "a skin on the surface… it pushes… the salt starts to dry out behind the paint" (en el canto)
  { t: 654.6, p: [4.0, -1.75, 4.3], l: [4.05, -1.85, 3.0], fov: 36 },
  { t: 664.5, p: [3.9, -1.95, 3.75], l: [4.0, -2.0, 3.0], fov: 34 },
  // paint1 · 672,2-682,1 · "That's the bubble you popped… the peeling… You just trapped it"
  { t: 672.2, p: [3.0, -1.85, 1.6], l: [4.0, -2.05, 0.6], fov: 36 },
  { t: 682.1, p: [2.8, -1.8, 1.9], l: [4.0, -2.0, 0.4], fov: 40 },
  // seal0 · 709,5-715,5 · "It doesn't sit on top like paint. It soaks down into those tiny little channels"
  { t: 709.45, p: [3.0, -1.8, 1.8], l: [4.0, -2.0, 0.8], fov: 38 },
  { t: 715.5, p: [4.0, -1.95, 3.8], l: [4.1, -1.95, 3.0], fov: 38 },
  // seal1 · 720,9-732,2 · "it makes the channels narrower. Less water climbs… inside the wall, not on top of it"
  { t: 720.9, p: [4.1, -1.95, 3.75], l: [4.1, -1.95, 3.0], fov: 40 },
  { t: 732.2, p: [3.8, -1.3, 6.2], l: [4.1, -1.8, 2.0], fov: 40 },
  // time · 833,3-846,8 · "give it time… a whole season": time-lapse, la marea baja
  { t: 833.25, p: [1.6, -1.2, 3.8], l: [4.0, -1.9, 0.0], fov: 42 },
  { t: 846.8, p: [1.2, -1.15, 2.6], l: [4.0, -1.9, -1.0], fov: 42 },
  // recap · 859,3-864,6 · "A band low on the wall… Patches up high"
  { t: 859.3, p: [1.0, -0.9, 6.4], l: [3.9, -1.6, 0.2], fov: 44 },
  { t: 864.6, p: [3.6, -0.7, 8.6], l: [4.4, -1.2, 1.0], fov: 42 },
  // recap2 · 876,0-879,2 · "go outside and fix where the water's coming from"
  { t: 876.0, p: [8.6, 2.4, 8.6], l: [4.8, 0.8, 1.6], fov: 42 },
  { t: 879.2, p: [8.0, 0.6, 7.6], l: [5.2, -0.1, 2.0], fov: 40 },
  // end · 902,9-905,3 · "Your wall is a wick"
  { t: 902.85, p: [4.1, -1.75, 4.0], l: [4.1, -1.8, 3.0], fov: 40 },
  { t: 905.3, p: [4.0, -1.4, 5.2], l: [4.1, -1.7, 3.0], fov: 40 },
  // fill final · 936,5-938,6
  { t: 936.45, p: [2.4, -0.6, 10.5], l: [3.4, -1.3, 1.0], fov: 40 },
  { t: 938.6, p: [1.0, 1.0, 14.0], l: [3.0, -0.8, 0.5], fov: 40 },
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
  paint: number; gloss: number; blister: number; pop: number; peel: number; push: number;
  salt: number; cryst: number; bandH: number; mapGlow: number; tideGlow: number; saltEdge: number; evap: number;
  pores: number; pglow: number; rise: number; flow: number; seal: number;
  arrUp: number; arrSide: number; seepSide: number; sidePatch: number;
  foil: number; foilFront: number; foilHi: number; spray: number;
  soilWet: number; seep: number; gutter: number; spout: number; ext: number; slope: number; dimSlope: number; mulch: number; mulchWet: number;
  lapse: number; rot: number; hygro: number;
};
const Z: FX = { paint: 0, gloss: 0, blister: 0, pop: 0, peel: 0, push: 0,
  salt: 1, cryst: 1, bandH: 1, mapGlow: 0, tideGlow: 0, saltEdge: 1, evap: 0,
  pores: 1, pglow: 0, rise: 1, flow: 0.6, seal: 0,
  arrUp: 0, arrSide: 0, seepSide: 0, sidePatch: 0.25,
  foil: 0, foilFront: 0, foilHi: 0, spray: 0,
  soilWet: 0.6, seep: 0, gutter: 0, spout: 0, ext: 0, slope: 0, dimSlope: 0, mulch: 0, mulchWet: 0,
  lapse: 0, rot: 0, hygro: 68 };
export const fxAt = (t: number): FX => {
  const f: FX = { ...Z };
  if (t < 12) { f.paint = 1; f.gloss = 1 - 0.7 * win(t, 6.9, 7.9); f.salt = 0; f.cryst = 0; f.saltEdge = 0; f.blister = 0.6 * win(t, 7.0, 7.9); f.rise = 0.6; f.sidePatch = 0; }
  else if (t < 30) { f.salt = lerp(0.3, 1, win(t, 22.5, 25.5)); f.cryst = lerp(0.25, 1, win(t, 22.6, 25.4)); f.bandH = lerp(0.55, 1, win(t, 22.8, 25.2)); }
  else if (t < 45) { f.mapGlow = win(t, 38.2, 39.0) * (1 - win(t, 41.3, 41.8)); f.flow = 1; }
  else if (t < 60) { f.arrUp = win(t, 48.4, 49.0); f.arrSide = win(t, 49.5, 50.2); f.seepSide = win(t, 49.6, 50.6); f.flow = 1; }
  else if (t < 135) { f.pores = win(t, 124.2, 126.0); f.rise = 0; f.flow = 0; f.pglow = win(t, 127.6, 129.0); f.saltEdge = 0; }
  else if (t < 150) { f.rise = lerp(0, 1, win(t, 142.4, 147.4)); f.flow = win(t, 142.2, 142.8); f.saltEdge = 0; }
  else if (t < 170) { f.flow = 1; f.soilWet = 0.8; }
  else if (t < 190) { f.flow = 1; f.saltEdge = win(t, 185.4, 186.9); }
  else if (t < 200.2) { f.flow = 1; f.evap = win(t, 196.5, 197.5); f.salt = lerp(0.3, 0.7, win(t, 197, 200)); f.cryst = f.salt; }
  else if (t < 210) { f.flow = 0.8; f.evap = 0.6; f.salt = lerp(0.7, 1, win(t, 200.5, 203)); f.cryst = lerp(0.4, 1, win(t, 200.6, 203.5)); }
  else if (t < 255) { f.tideGlow = win(t, 245.6, 246.6); }
  else if (t < 275) { f.arrSide = win(t, 264.6, 265.2); f.seepSide = win(t, 264.5, 265.6); f.sidePatch = lerp(0.25, 1, win(t, 265.5, 267.5)); f.soilWet = 0.9; }
  else if (t < 320) { f.foil = 1; f.foilFront = win(t, 312.6, 314.8); }
  else if (t < 340) { f.foil = 1; f.foilHi = win(t, 330.4, 331.4); }
  else if (t < 440) { f.spray = win(t, 431.2, 431.6) * (1 - win(t, 433.8, 434.2)); f.salt = lerp(0.6, 0.15, win(t, 432.5, 434.9)); f.cryst = f.salt; }
  else if (t < 490) { f.salt = 0.08; f.cryst = 0.05; f.sidePatch = 0; }
  else if (t < 515) { f.flow = 1; f.soilWet = 1; f.seep = win(t, 503.0, 504.2); f.salt = 0.3; f.cryst = 0.2; }
  else if (t < 540) { f.gutter = win(t, 523.4, 524.0); f.spout = win(t, 524.4, 525.0); f.seep = win(t, 525.0, 526.0); f.soilWet = 0.9; }
  else if (t < 590) { f.ext = 1; f.spout = 1; f.slope = win(t, 571.0, 573.5); f.dimSlope = win(t, 573.5, 574.2) * (1 - win(t, 578.0, 578.4)); f.soilWet = lerp(0.8, 0.3, win(t, 573, 577)); }
  else if (t < 620) { f.ext = 1; f.slope = 1; f.mulch = 1; f.mulchWet = win(t, 607.2, 608.5); f.seep = win(t, 607.5, 608.8); }
  else if (t < 670) { f.paint = 1; f.gloss = 0.3; f.flow = 1; f.push = win(t, 659.0, 660.0); f.blister = lerp(0, 0.75, win(t, 659.5, 664.0)); f.salt = 0.5 * win(t, 661.5, 664.0); f.cryst = 0; f.saltEdge = win(t, 661.5, 664.0); }
  else if (t < 690) { f.paint = 1; f.gloss = 0.3; f.blister = 1; f.pop = win(t, 672.6, 672.9); f.peel = win(t, 674.4, 676.5); f.salt = 0.7; f.cryst = 0.5; }
  else if (t < 718) { f.seal = win(t, 711.5, 715.0); f.flow = 1; f.salt = 0.15; f.cryst = 0.1; }
  else if (t < 740) { f.seal = 1; f.rise = lerp(1, 0.45, win(t, 721.5, 724.0)); f.flow = lerp(1, 0.35, win(t, 721.5, 724.0)); f.salt = lerp(0.6, 0.25, win(t, 724, 727)); f.cryst = f.salt; f.evap = win(t, 727, 729) * 0.7; }
  else if (t < 850) { f.seal = 1; f.rise = 0.45; f.lapse = cl((t - 834) / 12.5); f.bandH = lerp(1, 0.4, win(t, 834, 846)); f.salt = lerp(1, 0.35, win(t, 834, 846)); f.cryst = f.salt; f.sidePatch = 0; }
  else if (t < 870) { f.mapGlow = win(t, 859.5, 860.3) * (1 - win(t, 862.4, 862.8)); f.arrUp = win(t, 859.6, 860.2); f.arrSide = win(t, 862.5, 863.2); f.seepSide = win(t, 862.5, 863.6); f.sidePatch = 1; f.flow = 1; }
  else if (t < 890) { f.ext = 1; f.slope = 1; f.spout = 1; f.soilWet = 0.3; }
  else if (t < 920) { f.flow = 1; f.pglow = win(t, 903.0, 904.0); }
  else { f.flow = 0.6; }
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
  // la franja de sal: costra blanca peluda, densa abajo, borde de arriba irregular con la línea de marea marrón-amarilla
  band: mk(2048, 320, (g) => {
    g.clearRect(0, 0, 2048, 320);
    const top = (x: number) => 26 + Math.sin(x * 0.011) * 9 + Math.sin(x * 0.037 + 1) * 5 + rnd(Math.floor(x / 6), 4) * 6;
    g.beginPath(); g.moveTo(0, 320); for (let x = 0; x <= 2048; x += 6) g.lineTo(x, top(x)); g.lineTo(2048, 320); g.closePath();
    const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, "rgba(238,236,226,.35)"); gr.addColorStop(0.35, "rgba(242,241,233,.7)"); gr.addColorStop(1, "rgba(247,246,240,.95)");
    g.fillStyle = gr; g.fill();
    for (let i = 0; i < 9000; i++) { const x = rnd(i, 1) * 2048, y = top(x) + Math.pow(rnd(i, 2), 0.8) * (320 - top(x)); g.fillStyle = `rgba(255,255,250,${0.15 + rnd(i, 3) * 0.5})`; g.fillRect(x, y, 1 + rnd(i, 5) * 2, 1 + rnd(i, 6) * 3); }
    for (let i = 0; i < 400; i++) { const x = rnd(i, 7) * 2048, y = top(x) + rnd(i, 8) * 280, r = 6 + rnd(i, 9) * 22; const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, "rgba(255,255,252,.35)"); q.addColorStop(1, "rgba(255,255,252,0)"); g.fillStyle = q; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    g.lineWidth = 7; g.strokeStyle = "rgba(150,112,58,.85)"; g.beginPath(); for (let x = 0; x <= 2048; x += 6) { const y = top(x) - 2; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.lineWidth = 3; g.strokeStyle = "rgba(196,160,92,.7)"; g.beginPath(); for (let x = 0; x <= 2048; x += 6) { const y = top(x) + 5; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }),
  // mancha suelta (agua que entra de costado): aro de sal alrededor de una mancha húmeda
  patch: mk(256, 256, (g) => {
    g.clearRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) { const a = rnd(i, 1) * 6.283, r = 70 + (rnd(i, 2) - 0.5) * 40 + Math.sin(a * 5) * 10; g.fillStyle = `rgba(250,250,244,${0.2 + rnd(i, 3) * 0.5})`; g.fillRect(128 + Math.cos(a) * r, 128 + Math.sin(a) * r * 0.8, 2, 2); }
  }),
  // pedacitos de mulch
  chips: mk(256, 256, (g) => {
    g.fillStyle = "#4a2f1c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = rnd(i, 1); g.save(); g.translate(rnd(i, 2) * 256, rnd(i, 3) * 256); g.rotate(rnd(i, 4) * 6.28); g.fillStyle = `rgb(${90 + v * 70},${55 + v * 40},${30 + v * 20})`; g.fillRect(-6, -2, 12 + v * 8, 4); g.restore(); }
  }, [3, 3]),
}), []);

// ---------------- POROS del bloque (canto del corte de la pared derecha): canales finitos que suben ----------------
const PW = 0.2, PH = 2.5, PY0 = -2.5;                 // el canto: 0,2 m de espesor, de -2,5 a 0
const NCH = 15;
const chX = (c: number, y: number) => {               // x (0..PW) del canal c a la altura y (m desde abajo)
  const x0 = (c + 0.5) / NCH * PW;
  return x0 + Math.sin(y * (7 + rnd(c, 1) * 6) + rnd(c, 2) * 6) * 0.004 + Math.sin(y * (23 + rnd(c, 3) * 9) + rnd(c, 4) * 6) * 0.0018;
};
const poreTex = (kind: "dry" | "water" | "seal" | "glow") => {
  const cv = document.createElement("canvas"); cv.width = 160; cv.height = 2000; const g = cv.getContext("2d")!;
  g.clearRect(0, 0, 160, 2000);
  if (kind === "dry") for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(70,68,64,${0.25 + rnd(i, 1) * 0.45})`; g.beginPath(); g.arc(rnd(i, 2) * 160, rnd(i, 3) * 2000, 0.8 + rnd(i, 4) * 2.2, 0, 6.3); g.fill(); }
  const style = { dry: ["rgba(62,60,56,.75)", 2.2, 0], water: ["rgba(120,205,255,1)", 2.6, 10], seal: ["rgba(214,160,64,.95)", 6.5, 0], glow: ["rgba(140,230,255,1)", 3, 14] }[kind];
  g.strokeStyle = style[0] as string; g.lineWidth = style[1] as number; g.shadowColor = style[0] as string; g.shadowBlur = style[2] as number;
  for (let c = 0; c < NCH; c++) { g.beginPath(); for (let py = 0; py <= 2000; py += 8) { const y = (2000 - py) / 2000 * PH; const x = chX(c, y) / PW * 160; py ? g.lineTo(x, py) : g.moveTo(x, py); } g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const usePores = () => useMemo(() => ({ dry: poreTex("dry"), water: poreTex("water"), seal: poreTex("seal"), glow: poreTex("glow") }), []);

// flecha 3D que crece desde la base (asta + punta), luminosa
const Arrow3: React.FC<{ p: V3; dir: "up" | "left"; len: number; k: number; col: string }> = ({ p, dir, len, k, col }) => {
  if (k < 0.01) return null;
  const L = len * k, rot: V3 = dir === "up" ? [0, 0, 0] : [0, 0, Math.PI / 2];
  return (
    <group position={p} rotation={rot}>
      <mesh position={[0, L * 0.4, 0]}><cylinderGeometry args={[0.06, 0.06, L * 0.8, 16]} /><meshBasicMaterial color={col} toneMapped={false} transparent opacity={0.92} /></mesh>
      <mesh position={[0, L * 0.8 + 0.12, 0]}><coneGeometry args={[0.16, 0.26, 20]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
    </group>
  );
};
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
const BlockWall: React.FC<{ p: V3; s: V3; axis: "x" | "z"; tx: ReturnType<typeof useBasementTex>; wet?: number; eff?: number }> = ({ p, s, axis, tx, wet = 0.35, eff = 0.85 }) => {
  const inner = axis === "z" ? [0, 0, s[2] / 2 + 0.003] : [-s[0] / 2 - 0.003, 0, 0];
  const len = axis === "z" ? s[0] : s[2];
  const rotI: V3 = axis === "z" ? [0, 0, 0] : [0, -Math.PI / 2, 0];
  return (
    <group position={p}>
      <mesh castShadow receiveShadow><boxGeometry args={[s[0] - (axis === "x" ? 0.006 : 0), s[1], s[2] - (axis === "z" ? 0.006 : 0)]} /><meshStandardMaterial color="#8c8d8a" roughness={0.95} /></mesh>
      <mesh position={inner as V3} rotation={rotI} receiveShadow><planeGeometry args={[len, s[1]]} /><meshStandardMaterial map={tx.block} roughness={0.92} /></mesh>
      <mesh position={[inner[0] * 1.002 + (axis === "x" ? -0.001 : 0), 0, inner[2] * 1.002 + (axis === "z" ? 0.001 : 0)]} rotation={rotI}><planeGeometry args={[len, s[1]]} /><meshStandardMaterial map={tx.wet} transparent opacity={wet} depthWrite={false} roughness={0.4} /></mesh>
      <mesh position={[inner[0] * 1.004 + (axis === "x" ? -0.002 : 0), 0, inner[2] * 1.004 + (axis === "z" ? 0.002 : 0)]} rotation={rotI}><planeGeometry args={[len, s[1]]} /><meshStandardMaterial map={tx.efflo} transparent opacity={eff} depthWrite={false} roughness={1} /></mesh>
    </group>
  );
};
// canto del corte (z=+3): bloque con huecos
const CutFace: React.FC<{ x: number; w: number; y0: number; y1: number; solid?: boolean }> = ({ x, w, y0, y1, solid }) => (
  <group position={[x, (y0 + y1) / 2, 3.002]}>
    <mesh><planeGeometry args={[w, y1 - y0]} /><meshStandardMaterial color="#cfccc4" roughness={1} /></mesh>
    {!solid && Array.from({ length: Math.floor((y1 - y0) / 0.2) }, (_, i) => <mesh key={i} position={[0, -(y1 - y0) / 2 + 0.1 + i * 0.2, 0.001]}><planeGeometry args={[w * 0.45, 0.13]} /><meshStandardMaterial color="#5d5b57" roughness={1} /></mesh>)}
  </group>
);

// ---------------- LA ESCENA ----------------
export const WallWorld: React.FC<{ t: number; fx?: Partial<FX> }> = ({ t, fx: over }) => {
  const f = { ...fxAt(t), ...(over ?? {}) };
  const tx = useBasementTex();
  const kt = useTextures();
  const pt = usePores();
  const hyg = useHygro(f.hygro);
  const fl = Math.round(t * FPS);
  // time-lapse de una temporada: la luz de la ventana se prende y se apaga
  const lc = f.lapse > 0.001 && f.lapse < 0.999 ? 0.5 + 0.5 * Math.sin(f.lapse * Math.PI * 2 * 6 - Math.PI / 2) : 1;
  const day = 0.55 + 0.45 * lc;
  const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();

  // ---- el agua en los poros: alto que llegó (desde el pie del canto) ----
  const wH = Math.max(0.001, (FL + BAND - PY0) * f.rise);
  pt.water.repeat.set(1, wH / PH); pt.water.offset.set(0, 0);
  // ascensor: gotitas brillantes que suben por los canales
  const nE = 300, eP = new Float32Array(nE * 3);
  for (let i = 0; i < nE; i++) {
    const c = i % NCH, u = (rnd(i, 1) + t * 0.07 * (0.75 + rnd(i, 2) * 0.5)) % 1, y = u * wH;
    eP.set([4.0 + chX(c, y), PY0 + y, 3.013], i * 3);
  }
  // la sal que queda en la cara interior: cristalitos (agujas) que crecen
  const nX = 4200;
  const xMesh = useMemo(() => new THREE.InstancedMesh(new THREE.ConeGeometry(0.0022, 1, 5), new THREE.MeshStandardMaterial({ color: "#f7f6f0", roughness: 0.55, emissive: "#ffffff", emissiveIntensity: 0.06 }), nX), []);
  const rotX = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
  for (let i = 0; i < nX; i++) {
    const z = i < nX * 0.75 ? -0.8 + rnd(i, 1) * 2.7 : -2.9 + rnd(i, 1) * 5.8;
    const y = FL + 0.01 + Math.pow(rnd(i, 2), 1.5) * BAND * f.bandH * 0.97;
    const g0 = cl((f.cryst - rnd(i, 5) * 0.75) * 4), len = (0.004 + rnd(i, 3) * 0.011) * g0;
    const jq = new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd(i, 6) - 0.5) * 0.5, (rnd(i, 7) - 0.5) * 0.5, 0));
    q.copy(rotX).multiply(jq); sc.set(g0 < 0.01 ? 0 : 1, Math.max(0.0001, len), g0 < 0.01 ? 0 : 1);
    mm.compose(new THREE.Vector3(XI - 0.004 - len / 2, y, z), q, sc); xMesh.setMatrixAt(i, mm);
  }
  xMesh.instanceMatrix.needsUpdate = true;
  // evaporación: el agua sale de la cara al aire (la sal se queda)
  const nV = 360, vP = new Float32Array(nV * 3);
  for (let i = 0; i < nV; i++) { const u = (rnd(i, 1) + t * (0.18 + rnd(i, 2) * 0.12)) % 1; vP.set([XI - 0.01 - u * 0.7, FL + 0.05 + rnd(i, 3) * BAND * 0.95 + u * 0.35, i % 3 === 0 ? 2.2 + rnd(i, 4) * 0.8 : 0.6 + rnd(i, 4) * 1.8], i * 3); }
  // agua que entra de costado desde la tierra (en el canto) y atraviesa la pared alta
  const nS2 = 260, s2 = new Float32Array(nS2 * 3);
  for (let i = 0; i < nS2; i++) { const u = (rnd(i, 1) + t * (0.3 + rnd(i, 2) * 0.15)) % 1; s2.set([lerp(5.7, 3.98, u), -0.9 + (rnd(i, 3) - 0.5) * 0.35 + Math.sin(u * 9 + i) * 0.03, 3.012], i * 3); }
  // vinagre pulverizado hacia la pared
  const nSp = 320, spP = new Float32Array(nSp * 3);
  for (let i = 0; i < nSp; i++) { const u = (rnd(i, 1) + t * 1.4) % 1; spP.set([lerp(3.35, XI - 0.01, u), lerp(-1.85, -2.25 + rnd(i, 2) * 0.45, u), lerp(0.35, -0.15 + rnd(i, 3) * 0.55, u)], i * 3); }
  // gotas de la ampolla reventada
  const nB = 70, bP = new Float32Array(nB * 3);
  for (let i = 0; i < nB; i++) { const u = (rnd(i, 1) + t * 0.5) % 1; bP.set([XI - 0.008, PT.blister[1] - 0.04 - u * (PT.blister[1] - FL - 0.05), PT.blister[2] + (rnd(i, 2) - 0.5) * 0.06], i * 3); }
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
  // gotitas en el papel aluminio de abajo (lado del cuarto)
  const foilDrops = (y0: number, k: number) => Array.from({ length: 40 }, (_, i) => i < 40 * k ? (
    <mesh key={i} position={[XI - 0.012, y0 - 0.14 + rnd(i, 1) * 0.28, -0.75 + rnd(i, 2) * 0.3]} scale={[0.4, 1.2, 1]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#e8f6ff" roughness={0.02} metalness={0.1} emissive="#bfe6ff" emissiveIntensity={0.35} transparent opacity={0.85} /></mesh>
  ) : null);
  const Foil: React.FC<{ y: number }> = ({ y }) => <>
    <mesh position={[XI - 0.008, y, -0.6]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.3, 0.3, 8, 8]} /><meshStandardMaterial color="#eef1f4" metalness={0.45} roughness={0.32} emissive="#9aa4ad" emissiveIntensity={0.25} /></mesh>
    {[[y + 0.15, -0.6, 0.3, 0.04], [y - 0.15, -0.6, 0.3, 0.04], [y, -0.45, 0.04, 0.3], [y, -0.75, 0.04, 0.3]].map(([yy, z, w, h], i) => <mesh key={i} position={[XI - 0.01, yy, z]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial color="#9aa0a7" roughness={0.6} metalness={0.3} /></mesh>)}
  </>;
  const paintMat = <meshStandardMaterial color="#f3f1ea" roughness={lerp(0.62, 0.16, f.gloss)} metalness={0} transparent={f.paint < 0.99} opacity={f.paint} />;
  const blShow = f.blister > 0.01 && f.pop < 0.5;

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
      <BlockWall p={[0, -1.25, -3.1]} s={[8.4, 2.5, 0.2]} axis="z" tx={tx} eff={0.18} />
      <BlockWall p={[4.1, -1.25, 0]} s={[0.2, 2.5, 6.0]} axis="x" tx={tx} wet={0.3} eff={0.12} />
      <group rotation={[0, Math.PI, 0]}><BlockWall p={[4.1, -1.25, 0]} s={[0.2, 2.5, 6.0]} axis="x" tx={tx} wet={0.4} eff={0.18} /></group>
      <CutFace x={4.1} w={0.2} y0={-2.5} y1={0} solid />
      <CutFace x={-4.1} w={0.2} y0={-2.5} y1={0} />
      {/* ===== LA PARED DERECHA: franja de sal, marea, mapa, mancha alta ===== */}
      <mesh position={[XI - 0.003, FL + (BAND * f.bandH) / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[5.9, BAND * f.bandH]} />
        <meshStandardMaterial map={tx.band} transparent opacity={f.salt} depthWrite={false} roughness={1} /></mesh>
      {f.mapGlow > 0.01 && <mesh position={[XI - 0.004, FL + (BAND * f.bandH) / 2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[5.9, BAND * f.bandH]} />
        <meshBasicMaterial map={tx.band} color="#ffcf5a" transparent opacity={0.6 * f.mapGlow} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
      {f.tideGlow > 0.01 && <mesh position={[XI - 0.005, FL + BAND * f.bandH - 0.035, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[5.9 * f.tideGlow, 0.022]} />
        <meshBasicMaterial color="#ffc14d" transparent opacity={0.95} toneMapped={false} /></mesh>}
      <primitive object={xMesh} />
      {f.sidePatch > 0.01 && <>
        <mesh position={[XI - 0.004, PT.side[1], PT.side[2]]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.95, 0.75]} /><meshStandardMaterial map={tx.wet} transparent opacity={0.9 * f.sidePatch} depthWrite={false} roughness={0.3} /></mesh>
        <mesh position={[XI - 0.005, PT.side[1], PT.side[2]]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.95, 0.75]} /><meshStandardMaterial map={tx.patch} transparent opacity={0.8 * f.sidePatch} depthWrite={false} roughness={1} /></mesh>
      </>}
      {/* ===== la pintura (piel) y la ampolla ===== */}
      {f.paint > 0.01 && <mesh position={[XI - 0.007, -1.2, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[5.98, 2.4]} />{paintMat}</mesh>}
      {blShow && <mesh position={[XI - 0.007, PT.blister[1], PT.blister[2]]} scale={[0.45 * f.blister, 0.8 * f.blister, f.blister]}><sphereGeometry args={[0.1, 28, 20]} />{paintMat}</mesh>}
      {f.pop > 0.5 && <>
        <mesh position={[XI - 0.009, PT.blister[1], PT.blister[2]]} rotation={[0, -Math.PI / 2, 0]} scale={[1 + 0.6 * f.peel, 0.8 + 0.5 * f.peel, 1]}><circleGeometry args={[0.1, 28]} /><meshStandardMaterial map={tx.band} color="#f2f1ea" roughness={1} /></mesh>
        <mesh position={[XI - 0.01, PT.blister[1], PT.blister[2]]} rotation={[0, -Math.PI / 2, 0]} scale={[1 + 0.6 * f.peel, 0.8 + 0.5 * f.peel, 1]}><ringGeometry args={[0.095, 0.115, 28]} /><meshStandardMaterial color="#f3f1ea" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        <Pts pts={bP} color="#bfe6ff" size={0.02} opacity={0.9 * (1 - f.peel * 0.6)} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[XI - 0.25, FL + 0.005, PT.blister[2]]} scale={[1, 0.6, 1]}><circleGeometry args={[0.22 * f.pop, 28]} /><meshStandardMaterial color="#3a4c58" roughness={0.03} metalness={0.3} transparent opacity={0.7} /></mesh>
      </>}
      {f.peel > 0.01 && Array.from({ length: 16 }, (_, i) => { const k = cl(f.peel * 1.6 - rnd(i, 1) * 0.6); const y = lerp(PT.blister[1] + (rnd(i, 2) - 0.5) * 0.25, FL + 0.01, k * k);
        return <mesh key={i} position={[XI - 0.02 - k * 0.2 * rnd(i, 3), y, PT.blister[2] + (rnd(i, 4) - 0.5) * 0.35]} rotation={[k * 3 * rnd(i, 5), k * 4, k * 2]}><planeGeometry args={[0.03 + rnd(i, 6) * 0.03, 0.02 + rnd(i, 7) * 0.03]} /><meshStandardMaterial color="#f3f1ea" side={THREE.DoubleSide} roughness={0.7} /></mesh>; })}
      {/* ===== el CANTO de la pared derecha: los poros, el agua que sube, la sal en el borde, la pintura, el sellador ===== */}
      <mesh position={[4.1, PY0 + PH / 2, 3.004]}><planeGeometry args={[PW, PH]} /><meshBasicMaterial map={pt.dry} transparent opacity={f.pores} depthWrite={false} /></mesh>
      {f.seal > 0.01 && <mesh position={[4.1, PY0 + PH / 2, 3.005]}><planeGeometry args={[PW, PH]} /><meshBasicMaterial map={pt.seal} transparent opacity={f.seal} depthWrite={false} toneMapped={false} /></mesh>}
      {f.rise > 0.005 && <mesh position={[4.1, PY0 + wH / 2, 3.006]}><planeGeometry args={[PW, wH]} /><meshBasicMaterial map={pt.water} transparent opacity={0.95 * (1 - 0.45 * f.seal)} depthWrite={false} toneMapped={false} /></mesh>}
      {f.pglow > 0.01 && <mesh position={[4.1, PY0 + PH / 2, 3.0065]}><planeGeometry args={[PW, PH]} /><meshBasicMaterial map={pt.glow} transparent opacity={0.8 * f.pglow} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
      <Pts pts={eP} color="#e6f7ff" size={0.012} opacity={f.flow * (f.rise > 0.02 ? 1 : 0)} />
      {f.saltEdge * f.salt > 0.01 && <mesh position={[4.006, FL + (BAND * f.bandH) / 2, 3.008]}><planeGeometry args={[0.012, BAND * f.bandH]} /><meshBasicMaterial color="#f6f5ee" transparent opacity={f.saltEdge * Math.max(0.4, f.salt)} toneMapped={false} /></mesh>}
      {f.paint > 0.01 && <mesh position={[3.996, -1.2, 3.009]}><planeGeometry args={[0.006, 2.4]} /><meshBasicMaterial color="#ffffff" transparent opacity={f.paint} toneMapped={false} /></mesh>}
      {f.paint > 0.01 && f.blister > 0.01 && <mesh position={[3.997, -2.0, 3.0095]} scale={[0.55, 1, 1]}><circleGeometry args={[0.07 * f.blister, 28, Math.PI / 2, Math.PI]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>}
      {f.push > 0.01 && <mesh position={[4.0, FL + BAND / 2, 3.0085]}><planeGeometry args={[0.03, BAND]} /><meshBasicMaterial color="#5fc0ff" transparent opacity={f.push * (0.45 + 0.25 * Math.sin(t * 6))} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>}
      <Pts pts={vP} color="#cfeaff" size={0.03} opacity={0.75 * f.evap} />
      {/* ===== flechas: ARRIBA desde el piso / DE COSTADO desde la tierra ===== */}
      <Arrow3 p={[3.86, FL + 0.05, -0.4]} dir="up" len={1.0} k={f.arrUp} col="#5fc0ff" />
      <Arrow3 p={[5.7, -0.9, 3.06]} dir="left" len={1.55} k={f.arrSide} col="#ff9a3c" />
      <Pts pts={s2} color="#7cc4ff" size={0.05} opacity={0.9 * f.seepSide} />
      {/* ===== papel aluminio abajo y arriba ===== */}
      {f.foil > 0.01 && <><Foil y={PT.foilLo[1]} />{foilDrops(PT.foilLo[1], f.foilFront)}</>}
      {f.foilHi > 0.01 && <group scale={[1, f.foilHi, 1]} position={[0, PT.foilHi[1] * (1 - f.foilHi), 0]}><Foil y={PT.foilHi[1]} /></group>}
      {/* ===== vinagre ===== */}
      {f.spray > 0.01 && <>
        <Pts pts={spP} color="#e8f6ff" size={0.012} opacity={0.8 * f.spray} />
        <mesh position={[XI - 0.006, -2.05, 0.12]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial map={tx.wet} transparent opacity={0.6 * f.spray} depthWrite={false} roughness={0.2} /></mesh>
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
      {/* ===== afuera: mulch contra la pared, cota de la pendiente ===== */}
      {f.mulch > 0.01 && <group>
        <mesh position={[4.75, 0.24, 1.2]} rotation={[0, 0, 0.06]} receiveShadow castShadow><boxGeometry args={[1.05, 0.22, 3.2]} /><meshStandardMaterial map={tx.chips} roughness={1} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#4a5a6a"), 0.55 * f.mulchWet)} /></mesh>
        {[[4.55, 0.3, 0.1], [4.7, 0.34, 1.3], [4.6, 0.28, 2.4]].map(([x, r, z], i) => <mesh key={i} position={[x, r * 0.8, z]} castShadow><sphereGeometry args={[r, 16, 12]} /><meshStandardMaterial color={["#3f6b2a", "#4b7a30", "#376026"][i]} roughness={1} /></mesh>)}
        {f.mulchWet > 0.01 && <mesh position={[4.75, -0.35, 3.008]}><planeGeometry args={[1.4, 0.9]} /><meshBasicMaterial map={tx.glow} color="#5fb0ff" transparent opacity={0.45 * f.mulchWet} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
      </group>}
      {f.dimSlope > 0.01 && <>
        <mesh position={[4.2 + 1.5 * f.dimSlope, 0.17, 2.6]}><boxGeometry args={[3.0 * f.dimSlope, 0.012, 0.012]} /><meshBasicMaterial color="#ffd166" toneMapped={false} /></mesh>
        <mesh position={[7.2, 0.085, 2.6]}><boxGeometry args={[0.012, 0.17 * f.dimSlope, 0.012]} /><meshBasicMaterial color="#ffd166" toneMapped={false} /></mesh>
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
      <primitive object={new THREE.Object3D()} />
      {void fl}
    </ThreeCanvas>
  );
};
