// reikohands / toallahands · EL MUNDO de las manos (vara gary01): una sola escena three.js y UNA cámara por toma.
//  · el CUARTO DE TATAMI de Reiko junto al shoji: la mesa baja oscura con la bandeja de cuidado (toalla doblada, frasco de crema,
//    tarai de madera con el termómetro flotante, guantes de algodón, guante de goma amarillo, tubo de protector, gotero de aceite, té).
//  · en el centro, la MANO DE MADERA articulada (maniquí de dibujo): se pone el guante de algodón, el de goma encima, la perla de crema,
//    los 5 puntitos de protector, la oshibori tibia enrollada, los guantes de noche.
//  · el LABORATORIO: el corte de la piel del dorso en capas (grasa · dermis con colágeno · epidermis · la capa córnea en LADRILLOS
//    con su "cemento" · la PELÍCULA DE GRASA = la cera del auto). El agua caliente la derrite y el agua de adentro se escapa;
//    la crema la sella; el sol mete rayos y manchas; la toalla frotada levanta los ladrillos; palma (gruesa) vs dorso (fina).
//  · la UÑA en macro: la cutícula = el sello / la puertita; cortada se raja.
// Cada toma = sceneOf(nombre, u). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { manoCam } from "../kits/camara/CamaraMano";
import { Post, useTextures, rbox } from "../kits/yanqui3d/fx3d";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const mix = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const add = (q: V3, d: V3): V3 => [q[0] + d[0], q[1] + d[1], q[2] + d[2]];

// ---------------- puntos fijos ----------------
const TOP = 0.34;                                  // la mesa baja (chabudai)
const HS = 1.9;                                    // la mano de madera, más grande que una real
const HAND: V3 = [0.02, TOP + 0.004, 0.06];        // base de los dedos de la mano (palma abajo, dedos hacia -z)
const BASIN: V3 = [-0.42, TOP, -0.14], BR = 0.135, BH = 0.075;
const JAR: V3 = [0.33, TOP, 0.2];
const TOWEL: V3 = [0.36, TOP, -0.15];
const GLOVES: V3 = [-0.36, TOP, 0.24];
const TUBE: V3 = [0.47, TOP, 0.02];
const DROP: V3 = [0.2, TOP, 0.29];
const CUP: V3 = [-0.22, TOP, -0.3];
const SK: V3 = [6, 0.9, 0];                        // el laboratorio de la piel (lejos del cuarto)
const NL: V3 = [-6, 0.9, 0];                       // la uña en macro
const LAMP: V3 = [0.95, 0, -0.55];
export const PT = {
  hand: add(HAND, [0, 0.07, 0.1]) as V3,
  back: add(HAND, [0, 0.075, 0.12]) as V3,
  knuckle: add(HAND, [-0.03, 0.07, 0.0]) as V3,
  tip: add(HAND, [-0.03, 0.04, -0.2]) as V3,
  basin: add(BASIN, [0, BH, 0]) as V3,
  thermo: add(BASIN, [0.03, BH + 0.02, 0.02]) as V3,
  jar: add(JAR, [0, 0.06, 0]) as V3,
  towel: add(TOWEL, [0, 0.04, 0]) as V3,
  gloves: add(GLOVES, [0, 0.02, 0]) as V3,
  tube: add(TUBE, [0, 0.02, 0]) as V3,
  cup: add(CUP, [0, 0.08, 0]) as V3,
  sk: SK,
  oil: add(SK, [0, 0.62, 0.25]) as V3,          // la película de grasa (borde de adelante)
  corneum: add(SK, [0, 0.57, 0.25]) as V3,
  epi: add(SK, [0, 0.46, 0.25]) as V3,
  dermis: add(SK, [0, 0.28, 0.25]) as V3,
  palmBlk: add(SK, [-0.62, 0.7, 0.25]) as V3,
  backBlk: add(SK, [0.62, 0.55, 0.25]) as V3,
  cuticle: add(NL, [0, 0.16, 0.05]) as V3,
  nail: add(NL, [0, 0.17, -0.08]) as V3,
};

// ---------------- la escena de cada toma ----------------
export type Scene = {
  cam: { p: V3; l: V3; fov: number };
  night?: number;      // 0 día de shoji · 1 noche con la lámpara de papel
  glove?: number;      // 0 sin · 1 algodón · 2 algodón + goma
  gloveK?: number;     // cuánto entró el guante (0-1, de la muñeca a la punta)
  cream?: number;      // brillo de crema sobre el dorso (0-1)
  creamK?: number;     // hasta dónde llegó la crema: 0 dorso → 1 dedos
  pearl?: number;      // la perla de crema arriba del dorso (0-1)
  dots?: number;       // los 5 puntitos de protector (0-1 aparecen)
  spread?: number;     // los puntitos se extienden (0-1)
  wrap?: number;       // oshibori enrollada en la mano (0-1)
  steam?: number;      // vapor (oshibori / agua caliente / té)
  sun?: number;        // rayo de sol del shoji sobre el dorso
  hot?: number;        // agua del tarai: 0 tibia · 1 caliente (termómetro, vapor)
  temp?: number;       // nivel del termómetro (0-1)
  ripple?: number;     // ondas en el agua
  timer?: number;      // el anillo del minuto (0-1)
  flip?: number;       // la mano se da vuelta (0 dorso · 1 palma)
  curl?: number;       // dedos que se doblan
  pat?: number;        // la toalla baja y palmea el dorso
  // laboratorio de la piel
  lab?: number;
  oil?: number;        // película de grasa (0-1 grosor)
  melt?: number;       // el calor la derrite: gotitas que se escurren (0-1)
  water?: number;      // agua adentro de la piel (0-1)
  escape?: number;     // el agua que se va al aire (0-1)
  creamL?: number;     // capa de crema sellando (0-1)
  cotton?: number;     // capa de algodón
  rubber?: number;     // capa de goma
  sweat?: number;      // sudor atrapado bajo la goma (0-1)
  uv?: number;         // rayos de sol
  spots?: number;      // manchas que aparecen
  rub?: number;        // toalla que frota y levanta ladrillos
  rows?: number;       // filas de ladrillos (córnea)
  two?: number;        // palma vs dorso lado a lado
  balm?: number;       // bálsamo grueso de noche
  // uña
  nailM?: number;
  cut?: number;        // cutícula cortada (rajada)
  push?: number;       // la toalla empuja la cutícula
  odrop?: number;      // gota de aceite que cae y brilla
  file?: number;       // la lima pasa en una dirección
};

const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur); return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: lerp(f0, f1, k) };
};

// variante "|n": la misma escena con otra cámara (gira alrededor de lo que mira)
export const sceneOf = (full: string, u: number): Scene => {
  const [name, vs] = full.split("|"), v = parseInt(vs ?? "") || 0;
  const sc = sceneBase(name, u);
  if (!v) return sc;
  const ang = (v % 2 ? 1 : -1) * 0.3 * Math.ceil(v / 2), { p, l } = sc.cam, dx = p[0] - l[0], dz = p[2] - l[2];
  return { ...sc, cam: { p: [l[0] + dx * Math.cos(ang) - dz * Math.sin(ang), p[1] + 0.02 * v, l[2] + dx * Math.sin(ang) + dz * Math.cos(ang)], l, fov: sc.cam.fov * 0.95 } };
};
const handCam = (u: number, near = 1, side = 0) => drift(add(PT.hand, [0.18 * near + side, 0.26 * near, 0.42 * near]), add(PT.hand, [0.1 * near + side, 0.2 * near, 0.32 * near]), PT.hand, add(PT.hand, [0, -0.01, -0.02]), 34, 31, u);
const labCam = (u: number, near = 1) => drift(add(SK, [0.55 * near, 0.95 * near, 1.75 * near]), add(SK, [0.35 * near, 0.85 * near, 1.4 * near]), add(SK, [0, 0.45, 0]), add(SK, [0, 0.47, 0]), 36, 33, u, 10);
const labMacro = (u: number) => drift(add(SK, [0.25, 0.85, 0.9]), add(SK, [0.15, 0.78, 0.72]), add(SK, [0, 0.58, 0.1]), add(SK, [0, 0.58, 0.05]), 32, 30, u, 10);
const L0 = { lab: 1, oil: 1, water: 0.85, rows: 3 };
const sceneBase = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  if (kind === "wide") {
    if (arg === "night") return { night: 1, glove: 1, gloveK: 1, cam: drift([-0.9, 0.95, 1.25], [-0.7, 0.85, 1.05], [0.1, TOP, -0.05], [0.12, TOP, -0.08], 42, 38, u, 10) };
    return { sun: 0.6, steam: 0.3, cam: drift([-1.05, 1.05, 1.35], [-0.8, 0.92, 1.12], [0.12, TOP, -0.08], [0.14, TOP, -0.1], 44, 40, u, 10) };
  }
  if (kind === "table") return { sun: 0.4, cam: drift(add(HAND, [0.05, 1.05, 0.55]), add(HAND, [0.02, 0.9, 0.42]), add(HAND, [0, 0, -0.05]), add(HAND, [0, 0, -0.07]), 40, 37, u, 10) };
  if (kind === "hand") {
    if (arg === "palm") return { flip: ease((u - 0.6) / 1.6), cam: handCam(u, 0.9) };
    if (arg === "curl") return { curl: 0.5 + 0.5 * Math.sin(u * 1.6), cam: handCam(u, 0.85, -0.05) };
    if (arg === "sun") return { sun: 1, cam: handCam(u, 0.9, 0.08) };
    if (arg === "night") return { night: 1, cam: handCam(u, 1.0) };
    return { sun: 0.3, cam: handCam(u) };
  }
  if (kind === "basin") {
    const hot = arg === "hot" ? 1 : 0;
    const temp = arg === "hot" ? lerp(0.45, 0.95, ease((u - 0.5) / 3)) : arg === "warm" ? lerp(0.95, 0.5, ease((u - 0.5) / 3)) : 0.5;
    return { hot, temp, ripple: 1, steam: hot, cam: drift(add(BASIN, [0.2, 0.36, 0.42]), add(BASIN, [0.12, 0.28, 0.32]), add(BASIN, [0.02, BH, 0]), add(BASIN, [0.03, BH, 0.01]), 36, 32, u, 9) };
  }
  if (kind === "gloves") {
    if (arg === "night") return { night: 1, glove: 1, gloveK: 1, cream: 1, cam: handCam(u, 0.95) };
    if (arg === "double") return { glove: 2, gloveK: ease((u - 0.3) / 2.6), cam: handCam(u, 0.95, 0.05) };
    if (arg === "pair") return { cam: drift(add(GLOVES, [0.1, 0.3, 0.32]), add(GLOVES, [0.06, 0.24, 0.24]), GLOVES, add(GLOVES, [0, 0, -0.01]), 34, 31, u, 9) };
    return { glove: 1, gloveK: ease((u - 0.3) / 2.6), cam: handCam(u, 0.95, -0.04) };
  }
  if (kind === "towel") return { pat: u, cam: handCam(u, 0.95, 0.06) };
  if (kind === "timer") return { timer: cl((u - 0.3) / 6.5), cream: ease((u - 3) / 3) * 0.8, creamK: 0.3, cam: drift(add(HAND, [0.3, 0.42, 0.62]), add(HAND, [0.2, 0.36, 0.5]), add(HAND, [0, 0.1, 0]), add(HAND, [0, 0.1, -0.02]), 38, 35, u, 9) };
  if (kind === "cream") {
    if (arg === "jar") return { pearl: 0, cam: drift(add(JAR, [0.12, 0.2, 0.26]), add(JAR, [0.08, 0.16, 0.18]), add(JAR, [0, 0.04, 0]), add(JAR, [0, 0.045, 0]), 32, 30, u, 9) };
    if (arg === "press") return { cream: ease((u - 0.2) / 2), creamK: ease((u - 1.5) / 5), cam: handCam(u, 0.75, 0.04) };
    if (arg === "knuckles") return { cream: 1, creamK: 1, curl: 0.25, cam: drift(add(PT.knuckle, [0.12, 0.12, 0.2]), add(PT.knuckle, [0.08, 0.09, 0.14]), PT.knuckle, add(PT.knuckle, [0, 0, -0.02]), 30, 28, u, 9) };
    return { pearl: ease((u - 0.3) / 1.2), cam: handCam(u, 0.8) };
  }
  if (kind === "sun") return { sun: 1, dots: ease((u - 0.4) / 2.4), spread: ease((u - 4) / 3), cam: handCam(u, 0.85, -0.06) };
  if (kind === "wrap") return { wrap: ease((u - 0.2) / 1.6), steam: 1, cam: handCam(u, 1.05, 0.04) };
  if (kind === "tea") return { steam: 1, cam: drift(add(CUP, [0.16, 0.18, 0.3]), add(CUP, [0.1, 0.14, 0.22]), add(CUP, [0, 0.06, 0]), add(CUP, [0, 0.07, 0]), 34, 31, u, 9) };
  // ---- laboratorio de la piel ----
  if (kind === "skin") {
    if (arg === "hot") return { ...L0, oil: 1 - ease((u - 0.5) / 4), melt: ease((u - 0.5) / 4), water: lerp(0.85, 0.25, ease((u - 2.5) / 5)), escape: cl((u - 2) / 6), steam: 0.8, cam: labCam(u, 0.9) };
    if (arg === "warm") return { ...L0, ripple: 1, cam: labCam(u, 0.95) };
    if (arg === "dry") return { ...L0, oil: 0.15, water: 0.2, escape: 0.6, cam: labMacro(u) };
    if (arg === "cream") return { ...L0, oil: 0.3, water: lerp(0.4, 0.9, ease((u - 1) / 4)), creamL: ease((u - 0.4) / 2.2), cam: labCam(u, 0.85) };
    if (arg === "minute") return { ...L0, oil: 0.4, water: lerp(0.9, 0.3, cl(u / 9)), escape: cl(u / 9), cam: labMacro(u) };
    if (arg === "sun") return { ...L0, uv: 1, spots: ease((u - 2) / 5), cam: labCam(u, 0.9) };
    if (arg === "block") return { ...L0, uv: 0.15, creamL: ease((u - 0.4) / 2) * 0.9, cam: labCam(u, 0.92) };
    if (arg === "rub") return { ...L0, rub: 1, cam: labMacro(u) };
    if (arg === "soap") return { ...L0, oil: 1 - ease((u - 0.6) / 3.5), melt: ease((u - 0.6) / 3.5) * 0.7, water: lerp(0.85, 0.45, ease((u - 2) / 4)), escape: cl((u - 2) / 6) * 0.6, cam: labCam(u, 0.88) };
    if (arg === "cotton") return { ...L0, cotton: ease((u - 0.3) / 1.8), rubber: ease((u - 2.2) / 1.6), cam: labCam(u, 0.85) };
    if (arg === "sweat") return { ...L0, rubber: 1, sweat: ease((u - 0.5) / 5), cam: labCam(u, 0.85) };
    if (arg === "balm") return { ...L0, balm: ease((u - 0.3) / 2), cotton: ease((u - 2.5) / 1.6), water: lerp(0.5, 1, ease((u - 2) / 5)), night: 0.6, cam: labCam(u, 0.9) };
    if (arg === "thin") return { ...L0, two: 1, cam: drift(add(SK, [0.0, 1.15, 2.4]), add(SK, [0.0, 1.0, 2.05]), add(SK, [0, 0.5, 0]), add(SK, [0, 0.5, 0]), 38, 36, u, 10) };
    if (arg === "macro") return { ...L0, cam: labMacro(u) };
    return { ...L0, cam: labCam(u) };
  }
  // ---- la uña ----
  if (kind === "nail") {
    const c = (d: V3, dl: V3 = [0, 0, 0]) => drift(add(PT.cuticle, d), add(PT.cuticle, [d[0] * 0.75, d[1] * 0.8, d[2] * 0.75]), add(PT.cuticle, dl), add(PT.cuticle, add(dl, [0, 0, -0.01])), 32, 29, u, 9);
    if (arg === "cut") return { nailM: 1, cut: ease((u - 1) / 2), cam: c([0.2, 0.28, 0.5]) };
    if (arg === "push") return { nailM: 1, push: ease((u - 0.4) / 3), cam: c([-0.25, 0.3, 0.5]) };
    if (arg === "oil") return { nailM: 1, odrop: cl((u - 0.3) / 3), cam: c([0.15, 0.35, 0.45]) };
    if (arg === "file") return { nailM: 1, file: u, cam: c([0.3, 0.22, -0.2], [0, 0, -0.12]) };
    return { nailM: 1, cam: c([0.22, 0.3, 0.55]) };
  }
  return { cam: handCam(u) };
};

// cámara a mano virtual (vara 23-oct): el balanceo va en la cámara 3D, el mismo en el render y en project() (las etiquetas quedan clavadas)
const RAD = Math.PI / 180;
const mano = (cam: THREE.PerspectiveCamera, t?: number) => {
  if (t === undefined) return;
  const m = manoCam(t, 1, 5); cam.rotateY(m.pan * RAD); cam.rotateX(m.tilt * RAD); cam.rotateZ(m.roll * RAD);
};
export const project = (c: { p: V3; l: V3; fov: number }, q: V3, t?: number) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.01, 200); cam.position.copy(v3(c.p)); cam.lookAt(v3(c.l)); mano(cam, t); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (name: string, u: number, q: V3, t?: number) => project(sceneOf(name, u).cam, q, t);
export const camSpeed = (name: string, u: number) => {
  const a = sceneOf(name, u).cam, b = sceneOf(name, u + 1 / 30).cam;
  const dp = v3(a.p).distanceTo(v3(b.p)) * 60 + v3(a.l).distanceTo(v3(b.l)) * 25;
  return { bx: Math.min(10, dp * 0.18), by: Math.min(6, dp * 0.08) };
};
const Cam: React.FC<{ k: { p: V3; l: V3; fov: number }; t: number }> = ({ k, t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.set(k.p[0], k.p[1], k.p[2]);
  c.up.set(0, 1, 0); c.lookAt(v3(k.l)); mano(c, t); c.fov = k.fov; c.near = 0.01; c.far = 60; c.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
type Tx = THREE.Texture | undefined;
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useRkTex = () => useMemo(() => ({
  // tatami: paja tejida verde-dorada con el borde de tela oscura (heri)
  tatami: mk(512, 512, (g) => {
    g.fillStyle = "#b9ae74"; g.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 4) { g.fillStyle = `rgba(${120 + 40 * rnd(x, 1)},${110 + 30 * rnd(x, 2)},60,.35)`; g.fillRect(x, 0, 2, 512); }
    for (let y = 0; y < 512; y += 22) { g.fillStyle = "rgba(90,80,40,.18)"; g.fillRect(0, y, 512, 1); }
    g.fillStyle = "#2c2b26"; g.fillRect(0, 0, 512, 14); g.fillRect(0, 498, 512, 14);
  }, [3, 3]),
  // madera oscura de la mesa baja
  wood: mk(512, 256, (g) => {
    g.fillStyle = "#3b2418"; g.fillRect(0, 0, 512, 256);
    for (let k = 0; k < 60; k++) { g.strokeStyle = `rgba(${90 + 40 * rnd(k, 1)},${50 + 20 * rnd(k, 2)},30,${0.15 + 0.2 * rnd(k, 3)})`; g.lineWidth = 1 + 2 * rnd(k, 4); g.beginPath(); const y = rnd(k, 5) * 256; g.moveTo(0, y); g.bezierCurveTo(170, y + 8 * rnd(k, 6) - 4, 340, y - 6, 512, y + 3); g.stroke(); }
  }, [2, 1]),
  // haya clara de la mano de madera
  beech: mk(256, 256, (g) => {
    g.fillStyle = "#d9b48a"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(150,100,55,${0.08 + 0.14 * rnd(k, 3)})`; g.lineWidth = 1 + 1.5 * rnd(k, 4); g.beginPath(); const x = rnd(k, 5) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 6, 90, x - 5, 170, x + 3, 256); g.stroke(); }
  }, [1, 2]),
  // tejido de algodón (punto)
  knit: mk(128, 128, (g) => {
    g.fillStyle = "#f4f2ec"; g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 8) for (let x = 0; x < 128; x += 8) { g.fillStyle = `rgba(180,175,165,${0.25 + 0.15 * rnd(x + y * 9, 1)})`; g.beginPath(); g.ellipse(x + 4, y + 4, 2.6, 3.6, 0.4, 0, 6.3); g.fill(); }
  }, [6, 6]),
  // toalla de rizo
  terry: mk(128, 128, (g) => {
    g.fillStyle = "#f6f4ef"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(200,195,185,${0.3 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 128, rnd(i, 3) * 128, 1 + rnd(i, 4) * 1.6, 0, 6.3); g.fill(); }
    g.fillStyle = "rgba(170,190,205,.5)"; g.fillRect(0, 100, 128, 6);
  }, [3, 3]),
  // papel del shoji con su reja
  shoji: mk(512, 512, (g) => {
    g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(220,210,190,${0.12 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 6, 1); }
    g.fillStyle = "#6b4a2e"; for (let k = 0; k <= 4; k++) g.fillRect(k * 126, 0, 8, 512); for (let k = 0; k <= 6; k++) g.fillRect(0, k * 84, 512, 7);
  }),
  // piel: dermis con colágeno, epidermis, ladrillos
  dermis: mk(256, 256, (g) => {
    g.fillStyle = "#d8968a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(250,215,200,${0.18 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 2 + rnd(i, 4) * 5, 0, 6.3); g.fill(); }
  }, [2, 1]),
  epi: mk(256, 64, (g) => {
    g.fillStyle = "#efc6ae"; g.fillRect(0, 0, 256, 64);
    for (let x = 0; x < 256; x += 14) for (let y = 0; y < 64; y += 12) { g.strokeStyle = "rgba(190,130,110,.35)"; g.beginPath(); g.ellipse(x + 7 + (y % 24 ? 7 : 0), y + 6, 6, 5, 0, 0, 6.3); g.stroke(); }
  }, [3, 1]),
  fat: mk(256, 128, (g) => {
    g.fillStyle = "#f0d49a"; g.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 60; i++) { g.strokeStyle = "rgba(200,160,80,.5)"; g.lineWidth = 2; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 128, 8 + rnd(i, 4) * 10, 0, 6.3); g.stroke(); }
  }, [2, 1]),
}), []);

// ---------------- geometrías ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, cast = true, map, rad = 0.012, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} />
  </mesh>
);
const Pts: React.FC<{ pts: number[]; col: string; size: number; o: number; map?: Tx; add?: boolean }> = ({ pts, col, size, o, map, add: ad }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color={col} size={size} transparent opacity={o} depthWrite={false} map={map} alphaMap={map} sizeAttenuation blending={ad ? THREE.AdditiveBlending : THREE.NormalBlending} /></points>;
};
// vapor que sube y se abre desde un punto
const Steam: React.FC<{ at: V3; t: number; amt: number; fl: THREE.Texture; spread?: number; n?: number; h?: number; size?: number }> = ({ at, t, amt, fl, spread = 0.06, n = 60, h = 0.28, size = 0.05 }) => {
  if (amt < 0.02) return null;
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const ph = (t * 0.22 + rnd(i, 1)) % 1;
    pts.push(at[0] + (rnd(i, 2) - 0.5) * spread * (1 + ph * 2) + Math.sin(t * 0.8 + i) * 0.01 * ph, at[1] + ph * h, at[2] + (rnd(i, 3) - 0.5) * spread * (1 + ph * 2));
  }
  return <Pts pts={pts} col="#ffffff" size={size} o={0.22 * amt} map={fl} />;
};
const capCache = new Map<string, THREE.BufferGeometry>();
const cap = (r: number, len: number) => {
  const k = r.toFixed(4) + "|" + len.toFixed(4); let g = capCache.get(k);
  if (!g) { g = new THREE.CapsuleGeometry(r, Math.max(0.0005, len - 2 * r), 6, 16); g.rotateX(Math.PI / 2); capCache.set(k, g); }
  return g;
};

// ---------------- la MANO de madera articulada (escala real ×HS; palma abajo, dedos hacia -z, mano derecha: pulgar a la izquierda) ----------------
type HandLook = { mat: "wood" | "cotton" | "rubber"; k: number };
const FING = [ // x base, largo, radio, abertura
  { x: -0.031, len: 0.086, r: 0.0088, sp: 0.06 },
  { x: -0.010, len: 0.096, r: 0.0092, sp: 0.0 },
  { x: 0.011, len: 0.09, r: 0.0088, sp: -0.05 },
  { x: 0.031, len: 0.07, r: 0.0078, sp: -0.12 },
];
const Finger: React.FC<{ len: number; r: number; curl: number; mats: THREE.Material[]; vis: number[] }> = ({ len, r, curl, mats, vis }) => {
  const L = [len * 0.45, len * 0.31, len * 0.24];
  const seg = (i: number): React.ReactNode => i > 2 ? null : (
    <group rotation={[-curl * (i === 0 ? 0.5 : 0.9), 0, 0]}>
      {mats.map((m, j) => <mesh key={j} position={[0, 0, -L[i] / 2]} geometry={cap(r * (1 + 0.16 * j) * (1 - i * 0.06), L[i])} material={m} castShadow receiveShadow visible={vis[j] > i / 3 - 0.01} />)}
      <mesh position={[0, 0, 0]} material={mats[0]} castShadow><sphereGeometry args={[r * 1.02, 14, 10]} /></mesh>
      <group position={[0, 0, -L[i]]}>{seg(i + 1)}</group>
    </group>
  );
  return <>{seg(0)}</>;
};
const useHandMats = (tx: ReturnType<typeof useRkTex>) => useMemo(() => ({
  wood: new THREE.MeshStandardMaterial({ color: "#e2bd92", map: tx.beech, roughness: 0.5 }),
  cotton: new THREE.MeshStandardMaterial({ color: "#f6f4ee", map: tx.knit, roughness: 1 }),
  rubber: new THREE.MeshPhysicalMaterial({ color: "#e9c23e", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15 }),
  cream: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.0, depthWrite: false }),
}), [tx]);
const WoodHand: React.FC<{ t: number; sc: Scene; tx: ReturnType<typeof useRkTex>; fl: THREE.Texture }> = ({ t, sc, tx, fl }) => {
  const M = useHandMats(tx);
  const glove = sc.glove ?? 0, gk = sc.gloveK ?? 0;
  const curl = 0.12 + (sc.curl ?? 0) * 0.9;
  const cream = sc.cream ?? 0, ck = sc.creamK ?? 0;
  M.cream.opacity = 0.5 * cream;
  // capas: madera siempre; algodón y goma de la muñeca hacia los dedos (gk)
  const mats: THREE.Material[] = [M.wood, ...(glove >= 1 ? [M.cotton] : []), ...(glove >= 2 ? [M.rubber] : [])];
  const vis = [1, glove >= 1 ? (glove >= 2 ? 1 : gk) : 0, glove >= 2 ? gk : 0];
  const palmMats = mats.map((m, j) => ({ m, s: 1 + 0.12 * j, v: j === 0 || vis[j] > 0.05 }));
  const fingerCream = cream > 0.02 ? [M.cream] : [];
  const flip = sc.flip ?? 0;
  const pat = sc.pat;
  const patY = pat === undefined ? 1 : Math.abs(Math.sin(pat * 2.6));
  const wrap = sc.wrap ?? 0;
  return (
    <group position={HAND} scale={[HS, HS, HS]}>
      <group position={[0, 0.016, 0.05]} rotation={[0, 0, flip * Math.PI]}>
        <group position={[0, -0.016, -0.05]}>
          {/* palma y muñeca */}
          {palmMats.map(({ m, s, v }, j) => v && <mesh key={j} position={[0, 0.016, 0.048]} scale={[s, s * 1.05, s]} geometry={rbox(0.088, 0.03, 0.098, 0.013)} material={m} castShadow receiveShadow />)}
          {palmMats.map(({ m, s, v }, j) => v && <mesh key={"w" + j} position={[0, 0.016, 0.19]} rotation={[Math.PI / 2, 0, 0]} scale={[s * 1.25, s, s * 0.7]} castShadow material={m}><cylinderGeometry args={[0.021, 0.015, 0.2, 24]} /></mesh>)}
          {/* crema sobre el dorso: avanza del dorso a los nudillos (creamK) */}
          {cream > 0.02 && <mesh position={[0, 0.0322, 0.07 - 0.035 * ck]} rotation={[-Math.PI / 2, 0, 0]} material={M.cream}><planeGeometry args={[0.084, 0.06 + 0.04 * ck]} /></mesh>}
          {/* dedos */}
          {FING.map((f, i) => (
            <group key={i} position={[f.x, 0.015, 0.0]} rotation={[0, f.sp, 0]}>
              <Finger len={f.len} r={f.r} curl={curl} mats={[...mats, ...(ck > 0.5 ? fingerCream : [])]} vis={[...vis, ...(ck > 0.5 ? [1] : [])]} />
            </group>
          ))}
          {/* pulgar */}
          <group position={[-0.044, 0.012, 0.072]} rotation={[0.1, 0.75, 0.25]}>
            <Finger len={0.072} r={0.0098} curl={curl * 0.6} mats={mats} vis={vis} />
          </group>
          {/* la perla de crema */}
          {(sc.pearl ?? 0) > 0.01 && <mesh position={[0, 0.038 + 0.03 * (1 - (sc.pearl ?? 0)), 0.06]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.0075 * (sc.pearl ?? 0), 24, 16]} /><meshPhysicalMaterial color="#fffdf8" roughness={0.15} clearcoat={1} /></mesh>}
          {/* los 5 puntitos de protector, después se extienden */}
          {(sc.dots ?? 0) > 0.01 && [[-0.024, 0.04], [0.0, 0.03], [0.024, 0.042], [-0.012, 0.07], [0.014, 0.075]].map(([x, z], i) => {
            const on = cl((sc.dots ?? 0) * 5 - i), sp = sc.spread ?? 0;
            return on > 0 && <mesh key={i} position={[x * (1 - 0.3 * sp), 0.0325, z]} scale={[1 + 3 * sp, 0.6 * (1 - 0.8 * sp), 1 + 3 * sp]}><sphereGeometry args={[0.0045 * on, 16, 10]} /><meshPhysicalMaterial color="#fbfbf6" roughness={0.3} clearcoat={0.6} transparent opacity={1 - 0.5 * sp} /></mesh>;
          })}
        </group>
      </group>
      {/* la toalla que baja y palmea el dorso */}
      {pat !== undefined && <mesh position={[0, 0.045 + 0.03 * patY, 0.06]} castShadow geometry={rbox(0.12, 0.014, 0.1, 0.006)}><meshStandardMaterial map={tx.terry} roughness={1} /></mesh>}
      {/* la oshibori enrollada alrededor de la mano */}
      {wrap > 0.01 && <mesh position={[0, 0.02, 0.05]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.062, 0.062, 0.13 * wrap, 40, 1, true]} /><meshStandardMaterial map={tx.terry} roughness={1} side={THREE.DoubleSide} />
      </mesh>}
      <Steam at={[0, 0.07, 0.05]} t={t} amt={wrap} fl={fl} spread={0.05} h={0.12} size={0.018} />
    </group>
  );
};

// ---------------- el tarai de madera con el termómetro flotante ----------------
const BASIN_GEO = new THREE.LatheGeometry([[0, 0], [BR - 0.012, 0], [BR, 0.01], [BR + 0.008, BH], [BR - 0.002, BH], [BR - 0.01, 0.012], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y)), 48);
const Basin: React.FC<{ t: number; sc: Scene; tx: ReturnType<typeof useRkTex>; fl: THREE.Texture }> = ({ t, sc, tx, fl }) => {
  const temp = sc.temp ?? 0.5, hot = sc.hot ?? 0;
  const col = temp > 0.75 ? "#e23a2a" : temp > 0.6 ? "#f08a2a" : "#2fa7d8";
  const rip = sc.ripple ?? 0.3;
  return (
    <group position={BASIN}>
      <mesh geometry={BASIN_GEO} castShadow receiveShadow><meshStandardMaterial map={tx.beech} color="#d6aa76" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      {[0.018, BH - 0.012].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[BR + 0.002 + y * 0.1, 0.0035, 8, 64]} /><meshStandardMaterial color="#b0703c" metalness={0.8} roughness={0.35} /></mesh>)}
      {/* agua */}
      <mesh position={[0, BH - 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[BR - 0.004, 48]} /><meshPhysicalMaterial color={hot > 0.5 ? "#9cc6cc" : "#a6d6e0"} roughness={0.04} metalness={0} transparent opacity={0.72} clearcoat={1} /></mesh>
      {[0, 1, 2].map((i) => { const ph = (t * 0.45 + i / 3) % 1; return <mesh key={i} position={[-0.03, BH - 0.013, 0.02]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.01 + ph * 0.1, 0.0125 + ph * 0.1, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.28 * (1 - ph) * rip} depthWrite={false} /></mesh>; })}
      {/* el termómetro flotante de vidrio: la columna sube con la temperatura */}
      <group position={[0.03, BH - 0.008, 0.02]} rotation={[-Math.PI / 2 + 0.08, 0, 0.5]}>
        <mesh><capsuleGeometry args={[0.009, 0.15, 8, 16]} /><meshPhysicalMaterial color="#ffffff" roughness={0.02} transmission={0.85} thickness={0.01} transparent opacity={0.45} /></mesh>
        <mesh position={[0, -0.075, 0]}><sphereGeometry args={[0.008, 16, 12]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3} roughness={0.3} /></mesh>
        <mesh position={[0, -0.075 + 0.075 * temp, 0]}><cylinderGeometry args={[0.0028, 0.0028, 0.15 * temp, 10]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.35} /></mesh>
        {/* franja verde = 36-38 °C */}
        <mesh position={[0.0, -0.075 + 0.15 * 0.5, 0.0092]}><planeGeometry args={[0.012, 0.012]} /><meshBasicMaterial color="#3fcf6a" transparent opacity={0.8} /></mesh>
      </group>
      <Steam at={[0, BH, 0]} t={t} amt={sc.steam ?? 0} fl={fl} spread={0.12} h={0.3} size={0.06} n={90} />
    </group>
  );
};

// ---------------- el laboratorio: el corte de la piel en capas ----------------
const FIB = (() => Array.from({ length: 12 }, (_, i) => {
  const y = 0.16 + 0.22 * rnd(i, 1), z = -0.2 + 0.4 * rnd(i, 2), ph = rnd(i, 3) * 6;
  const pts = Array.from({ length: 24 }, (_, k) => new THREE.Vector3(-0.48 + k * 0.042, y + 0.025 * Math.sin(k * 0.9 + ph), z + 0.03 * Math.cos(k * 0.7 + ph)));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.009, 8, false);
}))();
const Skin: React.FC<{ t: number; sc: Scene; tx: ReturnType<typeof useRkTex>; fl: THREE.Texture; p: V3; rows: number; epiH?: number; showFx?: boolean }> = ({ t, sc, tx, fl, p, rows, epiH = 0.1, showFx = true }) => {
  const X = 1.0, Z = 0.5, Y0 = 0.42, BRH = 0.024;
  const yC = Y0 + epiH;                         // arranca la capa córnea
  const yTop = yC + rows * BRH;                 // arriba de los ladrillos
  const oil = sc.oil ?? 0, melt = sc.melt ?? 0, water = sc.water ?? 0, esc = sc.escape ?? 0;
  const rub = sc.rub ?? 0, spots = sc.spots ?? 0, uv = sc.uv ?? 0;
  const bricks: React.ReactNode[] = [];
  const NX = 10, NZ = 5, bw = X / NX, bz = Z / NZ;
  for (let r = 0; r < rows; r++) for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) {
    const top = r === rows - 1, id = r * 97 + i * 11 + j;
    const lift = top && rub > 0 ? rub * (0.012 + 0.02 * rnd(id, 1)) * (0.5 + 0.5 * Math.sin(t * 9 + id)) : 0;
    const tilt = top && rub > 0 ? rub * 0.35 * (rnd(id, 2) - 0.5) : 0;
    const off = (r % 2) * bw * 0.5;
    const x = -X / 2 + bw * 0.5 + i * bw + off; if (x > X / 2 - bw * 0.3) continue;
    bricks.push(<mesh key={id} position={[x, yC + BRH * (r + 0.5) + lift, -Z / 2 + bz * (j + 0.5)]} rotation={[tilt, 0, tilt * 0.6]} geometry={rbox(bw * 0.9, BRH * 0.78, bz * 0.9, 0.006)} castShadow receiveShadow>
      <meshStandardMaterial color={rnd(id, 3) > 0.5 ? "#f6e2c6" : "#e9cfae"} roughness={0.5} />
    </mesh>);
  }
  // agua adentro (gotitas azules); las que se escapan suben y se van
  const N = 46, drops: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const inside = i < N * water;
    const goes = i >= N * water && i < N * Math.min(1, water + esc * 0.8);
    if (!inside && !goes) continue;
    const bx = (rnd(i, 4) - 0.5) * X * 0.92, bzz = (rnd(i, 5) - 0.5) * Z * 0.9, by = Y0 + 0.01 + rnd(i, 6) * (yTop - Y0 - 0.02);
    const ph = goes ? ((t * 0.35 + rnd(i, 7)) % 1) : 0;
    const y = goes ? yTop + 0.02 + ph * 0.55 : by + 0.004 * Math.sin(t * 2 + i);
    bricks.push(<mesh key={"d" + i} position={[bx + (goes ? 0.05 * Math.sin(t + i) * ph : 0), y, bzz]}><sphereGeometry args={[0.013 * (goes ? 1 - 0.6 * ph : 1), 14, 10]} /><meshPhysicalMaterial color="#4fb3ff" emissive="#1c6ad8" emissiveIntensity={0.35} roughness={0.05} clearcoat={1} transparent opacity={goes ? 0.85 * (1 - ph) : 0.9} /></mesh>);
  }
  // gotitas de grasa que se escurren por el borde cuando el calor la derrite
  const oilDrops: React.ReactNode[] = [];
  if (melt > 0.02) for (let i = 0; i < 14; i++) {
    const ph = (t * 0.25 + rnd(i, 8)) % 1, x = (rnd(i, 9) - 0.5) * X * 0.9;
    oilDrops.push(<mesh key={"o" + i} position={[x, yTop - ph * 0.5, Z / 2 + 0.012]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.011 * melt, 12, 10]} /><meshPhysicalMaterial color="#e9b23a" roughness={0.05} clearcoat={1} transparent opacity={0.9 * (1 - ph)} /></mesh>);
  }
  return (
    <group position={p}>
      {/* grasa de abajo, dermis con colágeno, epidermis */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow geometry={rbox(X, 0.14, Z, 0.01)}><meshStandardMaterial map={tx.fat} roughness={0.7} /></mesh>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow geometry={rbox(X, 0.28, Z, 0.01)}><meshStandardMaterial map={tx.dermis} roughness={0.65} /></mesh>
      {FIB.map((g, i) => <mesh key={i} geometry={g} position={[0, 0, 0.0]}><meshStandardMaterial color="#fbe8d6" roughness={0.45} /></mesh>)}
      <mesh position={[0.18, 0.2, Z / 2 - 0.06]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.022, 0.022, X * 0.98, 16]} /><meshStandardMaterial color="#b83a3a" roughness={0.4} /></mesh>
      <mesh position={[0, Y0 + epiH / 2, 0]} castShadow receiveShadow geometry={rbox(X, epiH, Z, 0.008)}><meshStandardMaterial map={tx.epi} roughness={0.6} /></mesh>
      {/* el "cemento" dorado entre los ladrillos + los ladrillos de la capa córnea */}
      <mesh position={[0, yC + rows * BRH / 2, 0]} geometry={rbox(X * 0.9, rows * BRH * 0.94, Z * 0.86, 0.004)}><meshStandardMaterial color="#d9a447" roughness={0.35} emissive="#7a4a10" emissiveIntensity={0.15} /></mesh>
      {bricks}
      {/* manchas del sol: melanina que aparece en la epidermis (cara de adelante del corte) */}
      {spots > 0.01 && [[-0.3, 0.2], [0.05, 0.6], [0.32, 0.35]].map(([x, k], i) => <mesh key={"s" + i} position={[x, Y0 + epiH * 0.45, Z / 2 + 0.002]} scale={[1.4, 0.55, 0.3]}><sphereGeometry args={[0.05 * cl(spots * 1.6 - k * 0.6), 20, 12]} /><meshStandardMaterial color="#6a3a1c" roughness={0.6} /></mesh>)}
      {/* la PELÍCULA DE GRASA = la cera del auto */}
      {oil > 0.02 && <mesh position={[0, yTop + 0.006 * oil, 0]} geometry={rbox(X * 0.99, 0.012 * oil + 0.001, Z * 0.99, 0.004)}><meshPhysicalMaterial color="#f2c14e" roughness={0.04} clearcoat={1} transparent opacity={0.35 + 0.4 * oil} /></mesh>}
      {oilDrops}
      {/* crema que sella */}
      {(sc.creamL ?? 0) > 0.02 && <mesh position={[0, yTop + 0.014 + 0.012 * (sc.creamL ?? 0), 0]} geometry={rbox(X * (0.4 + 0.6 * (sc.creamL ?? 0)), 0.024 * (sc.creamL ?? 0) + 0.002, Z * 0.98, 0.01)}><meshPhysicalMaterial color="#fffaf2" roughness={0.12} clearcoat={1} transparent opacity={0.9} /></mesh>}
      {/* bálsamo grueso de la noche */}
      {(sc.balm ?? 0) > 0.02 && <mesh position={[0, yTop + 0.03 * (sc.balm ?? 0), 0]} geometry={rbox(X * 0.99, 0.055 * (sc.balm ?? 0) + 0.002, Z * 0.99, 0.02)}><meshPhysicalMaterial color="#f5e7b8" roughness={0.1} clearcoat={1} transparent opacity={0.78} /></mesh>}
      {/* el algodón y la goma encima */}
      {(sc.cotton ?? 0) > 0.02 && <mesh position={[0, yTop + 0.09 + 0.25 * (1 - (sc.cotton ?? 0)), 0]} geometry={rbox(X * 1.02, 0.04, Z * 1.02, 0.015)} castShadow><meshStandardMaterial map={tx.knit} roughness={1} /></mesh>}
      {(sc.rubber ?? 0) > 0.02 && <mesh position={[0, yTop + 0.15 + 0.25 * (1 - (sc.rubber ?? 0)), 0]} geometry={rbox(X * 1.04, 0.03, Z * 1.04, 0.012)} castShadow><meshPhysicalMaterial color="#e9c23e" roughness={0.2} clearcoat={1} /></mesh>}
      {/* sudor atrapado bajo la goma */}
      {(sc.sweat ?? 0) > 0.02 && Array.from({ length: 26 }, (_, i) => i < 26 * (sc.sweat ?? 0) && <mesh key={"sw" + i} position={[(rnd(i, 11) - 0.5) * X * 0.9, yTop + 0.04 + 0.03 * rnd(i, 12), (rnd(i, 13) - 0.5) * Z * 0.85]}><sphereGeometry args={[0.016, 14, 10]} /><meshPhysicalMaterial color="#9fd6ff" roughness={0.03} clearcoat={1} transparent opacity={0.75} /></mesh>)}
      {/* rayos del sol */}
      {showFx && uv > 0.02 && Array.from({ length: 9 }, (_, i) => { const ph = (t * 0.6 + i / 9) % 1, x = -0.45 + i * 0.11; const y = yTop + 0.9 - ph * 0.9;
        return <mesh key={"uv" + i} position={[x + 0.2 * (1 - ph), y, 0.05]} rotation={[0, 0, 0.22]}><cylinderGeometry args={[0.005, 0.005, 0.22, 6]} /><meshBasicMaterial color="#ffd36a" transparent opacity={0.85 * uv * (1 - ph * 0.6)} toneMapped={false} /></mesh>; })}
      {/* la toalla que frota */}
      {rub > 0.02 && <mesh position={[0.25 * Math.sin(t * 5), yTop + 0.04, 0]} castShadow geometry={rbox(0.5, 0.05, Z * 1.1, 0.02)}><meshStandardMaterial map={tx.terry} roughness={1} /></mesh>}
      <Steam at={[0, yTop + 0.03, 0]} t={t} amt={(sc.steam ?? 0) * (sc.lab ?? 0)} fl={fl} spread={0.6} h={0.7} size={0.12} n={70} />
    </group>
  );
};

// ---------------- la uña en macro ----------------
const NailMacro: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const cut = sc.cut ?? 0, push = sc.push ?? 0, od = sc.odrop ?? 0;
  const skin = "#e7b59a";
  const fy = (sc.file ?? -1) >= 0 ? (Math.floor((sc.file ?? 0) * 0.9) % 2 === 0 ? ((sc.file ?? 0) * 0.9) % 1 : 1.1) : -1;
  return (
    <group position={NL}>
      {/* el dedo: cápsula gorda de piel, acostado, la punta hacia -z */}
      <mesh position={[0, 0.08, 0.05]} geometry={cap(0.095, 0.62)} castShadow receiveShadow><meshPhysicalMaterial color={skin} roughness={0.55} sheen={0.6} sheenColor="#ffd8c8" /></mesh>
      {/* la uña: casquete curvo rosado, brillante */}
      <mesh position={[0, 0.158, -0.13]} scale={[0.074, 0.022, 0.125]}><sphereGeometry args={[1, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f4c9bd" roughness={0.12 - 0.08 * od} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
      <mesh position={[0, 0.16, -0.245]} scale={[0.07, 0.012, 0.025]}><sphereGeometry args={[1, 32, 12]} /><meshPhysicalMaterial color="#fbf1ea" roughness={0.2} clearcoat={1} /></mesh>
      {/* la cutícula: el sello que abraza la base de la uña (arcos; cortada = arcos rotos que se levantan) */}
      <group position={[0, 0.165, -0.13 + 0.012 * push]} scale={[1.02, 1, 1.68]}>
        {Array.from({ length: 7 }, (_, i) => {
          const th = -Math.PI * 0.92 + i * Math.PI * 0.12, broke = cut > 0.05 && rnd(i, 3) > 0.4;
          return <group key={i} rotation={[0, th, 0]} position={[0, broke ? 0.01 * cut * rnd(i, 4) : 0, 0]}>
            <mesh rotation={[-Math.PI / 2 + (broke ? 0.6 * cut * (rnd(i, 5) - 0.3) : 0), 0, 0]}>
              <torusGeometry args={[0.075, 0.008 * (1 - 0.35 * push), 10, 20, Math.PI * (broke ? 0.11 * (1 - 0.4 * cut) : 0.122)]} />
              <meshPhysicalMaterial color={broke ? "#d98b78" : "#f0cbbb"} roughness={broke ? 0.85 : 0.45} />
            </mesh>
          </group>;
        })}
      </group>
      {/* rajitas rojas cuando se corta */}
      {cut > 0.3 && [[-0.05, -0.04], [0.02, -0.005], [0.058, -0.05]].map(([x, z], i) => <mesh key={"cr" + i} position={[x, 0.18, z]} rotation={[-Math.PI / 2, 0, 0.6 * i]}><planeGeometry args={[0.004, 0.03 * cut]} /><meshBasicMaterial color="#b0302a" /></mesh>)}
      {/* la gota de aceite que cae y se extiende */}
      {od > 0.01 && od < 0.55 && <mesh position={[0, 0.5 - 0.31 * (od / 0.55), 0.01]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.014, 18, 14]} /><meshPhysicalMaterial color="#e8b437" roughness={0.02} clearcoat={1} transmission={0.4} /></mesh>}
      {od >= 0.55 && <mesh position={[0, 0.181, 0.005]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.012 + 0.05 * (od - 0.55) / 0.45, 32]} /><meshPhysicalMaterial color="#f0c04a" roughness={0.02} clearcoat={1} transparent opacity={0.6} /></mesh>}
      {/* la lima de vidrio: pasa en UNA dirección por el borde */}
      {fy >= 0 && fy <= 1 && <mesh position={[lerp(-0.18, 0.18, fy), 0.17, -0.205]} rotation={[0, 0, 0.0]}><boxGeometry args={[0.24, 0.006, 0.028]} /><meshPhysicalMaterial color="#cfe8ff" roughness={0.15} transmission={0.6} transparent opacity={0.8} /></mesh>}
    </group>
  );
};

// ---------------- el anillo del minuto ----------------
const MinuteRing: React.FC<{ k: number }> = ({ k }) => (
  <group position={add(HAND, [0, 0.22, 0.02])} rotation={[-0.6, 0, 0]}>
    <mesh><torusGeometry args={[0.1, 0.006, 10, 96]} /><meshStandardMaterial color="#3b3530" roughness={0.6} transparent opacity={0.6} /></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.1, 0.0085, 12, 96, Math.PI * 2 * Math.max(0.001, k)]} /><meshBasicMaterial color={k > 0.85 ? "#ff6a4a" : "#ffb257"} toneMapped={false} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i / 12 * 6.283) * 0.118, Math.sin(i / 12 * 6.283) * 0.118, 0]}><sphereGeometry args={[0.003, 8, 6]} /><meshBasicMaterial color="#f4efe6" toneMapped={false} /></mesh>)}
  </group>
);

// ---------------- el mundo ----------------
export const HandsWorld: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useRkTex(), ft = useTextures(), fl = ft.flake;
  const night = sc.night ?? 0, lab = sc.lab ?? 0, nail = sc.nailM ?? 0;
  const dark = lab > 0.5 || nail > 0.5;
  const sun = sc.sun ?? 0;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam k={sc.cam} t={t} />
      <Post bloom={dark ? 0.35 : 0.28 + 0.2 * night} threshold={0.86} exposure={dark ? 0.95 : lerp(0.9, 0.72, night)} env={dark ? 0.35 : lerp(0.32, 0.12, night)} />
      <color attach="background" args={[dark ? "#141a22" : night > 0.5 ? "#15120e" : "#2a2620"]} />
      <fog attach="fog" args={[dark ? "#141a22" : night > 0.5 ? "#15120e" : "#3a332a", 3.5, 10]} />
      <hemisphereLight args={["#fff4e2", "#4a4030", lerp(0.4, 0.12, night)]} />
      {/* luz del shoji desde la izquierda (de día) */}
      <directionalLight position={[-2.2, 1.9, -1.2]} intensity={lerp(1.6 + 0.8 * sun, 0.2, night)} color="#fff1dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-left={-1.2} shadow-camera-right={1.2} shadow-camera-top={1.2} shadow-camera-bottom={-1.2} />
      {/* la lámpara de papel (andon) de noche */}
      <pointLight position={[LAMP[0], 0.42, LAMP[2]]} intensity={0.2 + 1.6 * night} distance={3} decay={1.6} color="#ffbe78" castShadow={night > 0.5} />
      {/* luz del laboratorio y de la uña */}
      <directionalLight position={[SK[0] - 1.2, 2.6, 2.2]} intensity={1.7} color="#fff4ea" castShadow shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={1.5} shadow-camera-bottom={-1.5} target-position={SK} />
      <pointLight position={[SK[0] + 1.2, 1.5, 1.5]} intensity={0.8} distance={5} color="#9fc4ff" />
      <pointLight position={[NL[0] + 0.4, 0.9, 0.8]} intensity={1.3} distance={3} color="#fff2e6" />
      <pointLight position={[NL[0] - 0.6, 0.6, -0.5]} intensity={0.6} distance={3} color="#a8c8ff" />
      {/* ---- el cuarto de tatami ---- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[5, 5]} /><meshStandardMaterial map={tx.tatami} roughness={0.85} /></mesh>
      <mesh position={[0, 1.3, -1.3]} receiveShadow><planeGeometry args={[5, 2.6]} /><meshStandardMaterial color="#e8dfcc" roughness={0.95} /></mesh>
      <mesh position={[1.9, 1.3, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[5, 2.6]} /><meshStandardMaterial color="#e3d9c4" roughness={0.95} /></mesh>
      {/* el shoji iluminado */}
      {[[-1.85, 1.0, -0.1, Math.PI / 2], [-0.55, 1.0, -1.28, 0]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={[0, r, 0]}><planeGeometry args={[2.2, 1.9]} /><meshStandardMaterial map={tx.shoji} emissive="#fff3dc" emissiveIntensity={lerp(0.9 + 0.5 * sun, 0.05, night)} emissiveMap={tx.shoji} roughness={1} /></mesh>)}
      {/* el rayo de sol sobre la mano */}
      {sun > 0.05 && night < 0.5 && <mesh position={[-0.9, 0.75, 0.0]} rotation={[0, 0, -0.62]}><cylinderGeometry args={[0.07, 0.2, 2.0, 20, 1, true]} /><meshBasicMaterial color="#fff0c8" transparent opacity={0.07 * sun} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} /></mesh>}
      {/* la mesa baja */}
      <Box p={[0, TOP - 0.02, 0]} s={[1.25, 0.04, 0.8]} c="#4a2c1c" map={tx.wood} r={0.38} rad={0.012} />
      {[[-0.56, -0.34], [0.56, -0.34], [-0.56, 0.34], [0.56, 0.34]].map(([a, b], i) => <Box key={i} p={[a, (TOP - 0.04) / 2, b]} s={[0.06, TOP - 0.04, 0.06]} c="#3a2216" map={tx.wood} r={0.5} rad={0.01} />)}
      {/* la bandeja laqueada bajo la mano */}
      <Box p={[0.03, TOP + 0.003, 0.02]} s={[0.62, 0.008, 0.42]} c="#1a1210" r={0.18} rad={0.004} />
      <Box p={[0.03, TOP + 0.009, 0.02]} s={[0.6, 0.004, 0.4]} c="#6e1a14" r={0.25} rad={0.002} />
      {/* toalla doblada, frasco de crema, guantes, tubo, gotero, té */}
      <Box p={add(TOWEL, [0, 0.03, 0])} s={[0.2, 0.05, 0.13]} c="#f6f4ef" map={tx.terry} r={1} rad={0.02} />
      <group position={JAR}>
        <mesh position={[0, 0.025, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.05, 32]} /><meshPhysicalMaterial color="#f7f5f0" roughness={0.15} clearcoat={1} /></mesh>
        <mesh position={[0, 0.054, 0]}><cylinderGeometry args={[0.032, 0.032, 0.006, 32]} /><meshStandardMaterial color="#f2ece0" roughness={0.6} /></mesh>
        <mesh position={[0.07, 0.006, 0.02]} rotation={[0.1, 0, 0]}><cylinderGeometry args={[0.037, 0.037, 0.012, 32]} /><meshStandardMaterial color="#c9c0b0" metalness={0.6} roughness={0.3} /></mesh>
      </group>
      <group position={GLOVES}>
        {[0, 1].map((k) => <group key={k} position={[k * 0.06, 0.006 + k * 0.01, -k * 0.02]} rotation={[0, 0.3 - k * 0.5, 0]}>
          <mesh castShadow geometry={rbox(0.09, 0.012, 0.13, 0.006)}><meshStandardMaterial map={tx.knit} roughness={1} /></mesh>
          {[-0.03, -0.01, 0.01, 0.03].map((x, i) => <mesh key={i} position={[x, 0.0, -0.085 - 0.006 * (i % 2)]} geometry={cap(0.009, 0.06)}><meshStandardMaterial map={tx.knit} roughness={1} /></mesh>)}
        </group>)}
        <group position={[0.15, 0.008, 0.04]} rotation={[0, -0.4, 0]}>
          <mesh castShadow geometry={rbox(0.1, 0.014, 0.15, 0.007)}><meshPhysicalMaterial color="#e9c23e" roughness={0.22} clearcoat={1} /></mesh>
          {[-0.032, -0.011, 0.011, 0.032].map((x, i) => <mesh key={i} position={[x, 0.0, -0.1]} geometry={cap(0.0105, 0.07)}><meshPhysicalMaterial color="#e9c23e" roughness={0.22} clearcoat={1} /></mesh>)}
        </group>
      </group>
      <group position={TUBE} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.016, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.016, 0.02, 0.12, 24]} /><meshStandardMaterial color="#f4f7fa" roughness={0.35} /></mesh>
        <mesh position={[-0.068, 0.016, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.02, 18]} /><meshStandardMaterial color="#5aa0c8" roughness={0.4} /></mesh>
      </group>
      <group position={DROP}>
        <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.06, 24]} /><meshPhysicalMaterial color="#c48a2a" roughness={0.05} transmission={0.5} transparent opacity={0.85} /></mesh>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.009, 0.012, 0.025, 16]} /><meshStandardMaterial color="#1c1c1c" roughness={0.5} /></mesh>
      </group>
      <group position={CUP}>
        <mesh position={[0, 0.035, 0]} castShadow><cylinderGeometry args={[0.04, 0.032, 0.07, 32, 1, true]} /><meshStandardMaterial color="#5a6a5a" roughness={0.75} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.038, 32]} /><meshStandardMaterial color="#9aa850" roughness={0.1} /></mesh>
        <Steam at={[0, 0.06, 0]} t={t} amt={(sc.steam ?? 0) * 0.8} fl={fl} spread={0.03} h={0.2} size={0.03} n={40} />
      </group>
      {/* la lámpara de papel */}
      <group position={LAMP}>
        <Box p={[0, 0.22, 0]} s={[0.22, 0.4, 0.22]} c="#f6e6c8" e="#ffc888" ei={0.15 + 1.6 * night} r={1} rad={0.01} />
      </group>
      <Basin t={t} sc={sc} tx={tx} fl={fl} />
      <WoodHand t={t} sc={sc} tx={tx} fl={fl} />
      {(sc.timer ?? 0) > 0 && <MinuteRing k={sc.timer ?? 0} />}
      {/* ---- el laboratorio de la piel ---- */}
      {lab > 0.5 && <>
        <mesh position={[SK[0], SK[1] - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[2.2, 64]} /><meshStandardMaterial color="#1e2632" roughness={0.6} /></mesh>
        {(sc.two ?? 0) > 0.5 ? <>
          <Skin t={t} sc={sc} tx={tx} fl={fl} p={[SK[0] - 0.62, SK[1], 0]} rows={8} epiH={0.14} showFx={false} />
          <Skin t={t} sc={sc} tx={tx} fl={fl} p={[SK[0] + 0.62, SK[1], 0]} rows={2} epiH={0.07} showFx={false} />
        </> : <Skin t={t} sc={sc} tx={tx} fl={fl} p={SK} rows={sc.rows ?? 3} />}
      </>}
      {/* ---- la uña en macro ---- */}
      {nail > 0.5 && <>
        <mesh position={[NL[0], NL[1] - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[1.6, 64]} /><meshStandardMaterial color="#20262e" roughness={0.6} /></mesh>
        <NailMacro t={t} sc={sc} />
      </>}
    </ThreeCanvas>
  );
};
