// elenaes01 · EL MUNDO de Elena (copia ES del mundo de elena01 + escenas propias: tapa abombada con gas, frasco volteado con moho,
//   el frasco malo en la despensa, termómetro en °C) (vara gary01): una sola escena three.js y UNA cámara por toma.
//  · el SÓTANO-DESPENSA infinito: dos estanterías de madera que no terminan nunca, miles de frascos (duraznos, tomate,
//    chauchas, pepinos, mermelada, puré de manzana), lamparitas colgando cada 2,4 m, polvo en la luz, la niebla al fondo.
//  · la MESA de trabajo (z = +8): la olla de baño María esmaltada EN CORTE (rejilla, 7 frascos, el agua 1-2" sobre las tapas,
//    el hervor, el termómetro de aguja) y el FRASCO de cuarto EN CORTE gigante (espacio libre, burbujas, el aire que se va
//    bajo la tapa, la tapa que el vacío chupa → "pop", y el MAPA DE CALOR con las esporas que sobreviven a 212 °F).
// Cada toma = sceneOf(nombre, u). Render SÓLO en el farm (acá sólo stills).
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
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

// ---------------- puntos fijos ----------------
const TOP = 0.9;                                  // tablero de la mesa
const CAN: V3 = [-0.32, TOP, 8.0];                // centro de la base de la olla
const JAR: V3 = [0.3, TOP, 7.92];                 // base del frasco héroe (x2,4 de escala: es la "maqueta")
const JS = 2.4;                                   // escala del frasco héroe
const CAN_R = 0.21, CAN_H = 0.27;
// frasco de cuarto (m): radio 0,045, alto 0,175
const JR = 0.045, JH = 0.175, NECK = 0.152, HEAD_Y = JH - 0.0127;   // 1/2" de espacio libre
export const PT = {
  lid: [JAR[0], JAR[1] + JH * JS + 0.01, JAR[2]] as V3,
  head: [JAR[0] + 0.037 * JS, JAR[1] + HEAD_Y * JS, JAR[2]] as V3,
  rim: [JAR[0] + 0.037 * JS, JAR[1] + JH * JS, JAR[2]] as V3,
  jarMid: [JAR[0], JAR[1] + 0.08 * JS, JAR[2]] as V3,
  jarBot: [JAR[0], JAR[1] + 0.01, JAR[2]] as V3,
  canWater: [CAN[0] + CAN_R, CAN[1] + CAN_H - 0.035, CAN[2]] as V3,
  canLids: [CAN[0], CAN[1] + 0.19, CAN[2]] as V3,
  thermo: [CAN[0] - CAN_R - 0.05, CAN[1] + CAN_H + 0.07, CAN[2] + 0.02] as V3,
  canTop: [CAN[0], CAN[1] + CAN_H + 0.05, CAN[2]] as V3,
};

// ---------------- la escena de cada toma ----------------
export type Scene = {
  cam: { p: V3; l: V3; fov: number };
  where: "aisle" | "bench";
  // despensa
  lit?: number;            // frascos encendidos (cuenta hasta 500)
  night?: number;          // 0 día de verano · 1 la tormenta de hielo (sin luz: sólo el farol)
  // frasco héroe
  fill?: number;           // nivel del contenido (fracción de NECK) · 1 = 1/2" de espacio libre
  over?: number;           // rebalse (0-1)
  bubbles?: number;        // burbujas atrapadas que suben
  air?: number;            // el aire que sale bajo la tapa (hervor)
  vac?: number;            // la tapa chupada hacia abajo (0-1) · el "pop"
  tight?: number;          // aro apretado de más: la tapa se abomba
  heat?: number;           // 0 = sin mapa · >0 avance del calor (0-1)
  kill?: number;           // temperatura máxima del mapa: 212 (baño María) o 240 (presión)
  acid?: number;           // jugo de limón cayendo al fondo (0-1)
  kind?: "peach" | "tomato" | "bean";
  bulge?: number;          // tapa ABOMBADA por el gas (0-1)
  gas?: number;            // burbujas de gas que suben solas + espuma bajo la tapa
  rot?: number;            // bichos (puntitos verdes) que se multiplican, sin mapa de calor
  inv?: number;            // frasco volteado boca abajo (0-1, el giro)
  mold?: number;           // moho blanco que crece bajo el sello
  bad?: number;            // despensa: el frasco malo entre los buenos (brillo rojo)
  // olla
  water?: number;          // nivel del agua (m sobre la base)
  boil?: number;           // 0 quieta · 1 hervor que no se baja revolviendo
  temp?: number;           // termómetro (°F)
  jarsIn?: number;         // frascos bajados a la rejilla (0-7)
  crack?: number;          // frasco frío que se parte (0-1)
  lidOff?: number;         // tapa de la olla afuera
  steam?: number;
};

const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur); return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: lerp(f0, f1, k) };
};
const up = (q: V3, dy: number): V3 => [q[0], q[1] + dy, q[2]];
const J = (dx: number, dy: number, dz: number): V3 => [JAR[0] + dx, JAR[1] + dy, JAR[2] + dz];
export const BADP: V3 = [-0.8, 0.866 + 0.08, -3.0];
const C = (dx: number, dy: number, dz: number): V3 => [CAN[0] + dx, CAN[1] + dy, CAN[2] + dz];

// variante "|n": la misma escena con otra cámara (gira alrededor de lo que mira; en el pasillo, otro tramo)
export const sceneOf = (full: string, u: number): Scene => {
  const [name, vs] = full.split("|"), v = parseInt(vs ?? "") || 0;
  const sc = sceneBase(name, u);
  if (!v) return sc;
  if (sc.where === "aisle") { const dz = -((v * 4.3) % 16); return { ...sc, cam: { ...sc.cam, p: [sc.cam.p[0], sc.cam.p[1], sc.cam.p[2] + dz], l: [sc.cam.l[0], sc.cam.l[1], sc.cam.l[2] + dz] } }; }
  const ang = (v % 2 ? 1 : -1) * 0.38 * Math.ceil(v / 2), { p, l } = sc.cam, dx = p[0] - l[0], dz = p[2] - l[2];
  return { ...sc, cam: { p: [l[0] + dx * Math.cos(ang) - dz * Math.sin(ang), p[1] + 0.03 * v, l[2] + dx * Math.sin(ang) + dz * Math.cos(ang)], l, fov: sc.cam.fov * 0.94 } };
};
const sceneBase = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const jarCam = (near = 1) => drift(J(0.08, 0.3, -0.62 * near), J(0.02, 0.24, -0.5 * near), J(0, 0.2, 0), J(0, 0.22, 0), 36, 33, u);
  if (kind === "aisle") {
    if (arg === "count") return { where: "aisle", lit: Math.round(500 * ease((u - 0.6) / 5.5)), cam: drift([0, 1.35, 1.6], [0, 2.9, 3.4], [0, 1.2, -6], [0, 0.9, -10], 46, 52, u, 8) };
    if (arg === "night") return { where: "aisle", night: 1, cam: drift([0.15, 1.3, -1.0], [0.1, 1.25, -4.5], [-0.4, 1.1, -6], [-0.5, 1.0, -9.5], 44, 40, u, 11) };
    if (arg === "bad") return { where: "aisle", bad: cl((u - 1.2) / 1.5), cam: drift([0.35, 1.05, 0.6], [-0.2, 0.92, -2.15], BADP, BADP, 46, 30, u, 6) };
    if (arg === "low") return { where: "aisle", cam: drift([0.55, 0.42, -2.0], [0.5, 0.5, -6.0], [-0.9, 0.5, -3.6], [-0.9, 0.55, -7.6], 40, 38, u, 10) };
    // vuelo entre las estanterías (variantes por número para no repetir el mismo tramo)
    const n = parseInt(arg) || 0, z0 = -((n * 3.7) % 18), y = 0.85 + ((n * 0.37) % 0.9), sx = n % 2 ? 1 : -1;
    return { where: "aisle", cam: drift([0.1 * sx, y + 0.1, z0 + 1.2], [-0.05 * sx, y, z0 - 4.2], [0.35 * sx, y - 0.1, z0 - 6], [0.1 * sx, y - 0.15, z0 - 10], 44, 42, u, 10) };
  }
  if (kind === "jar") {
    const kd: Scene["kind"] = arg.endsWith("T") ? "tomato" : "peach", a = arg.replace(/T$/, "");
    const B: Scene = { where: "bench", cam: jarCam(), fill: 1, kind: kd };
    if (a === "fill") return { ...B, fill: lerp(0.15, 1, ease((u - 0.3) / 2.6)), cam: drift(J(0.16, 0.42, -0.55), J(0.06, 0.36, -0.38), J(0, 0.33, 0), J(0, 0.35, 0), 34, 30, u) };
    if (a === "over") return { ...B, fill: lerp(1, 1.12, ease((u - 0.4) / 1.6)), over: ease((u - 1.6) / 2), cam: drift(J(0.1, 0.48, -0.42), J(0.04, 0.44, -0.34), J(0, 0.39, 0), J(0, 0.4, 0), 32, 28, u) };
    if (a === "bubbles") return { ...B, bubbles: 1, cam: drift(J(-0.14, 0.27, -0.72), J(-0.06, 0.23, -0.58), J(0, 0.2, 0), J(0, 0.22, 0), 34, 31, u) };
    if (a === "air") return { ...B, air: 1, heat: 0, cam: drift(J(0.1, 0.5, -0.45), J(0.05, 0.44, -0.36), J(0, 0.39, 0), J(0, 0.4, 0), 33, 30, u) };
    if (a === "pop") return { ...B, vac: ease((u - 2.0) / 0.25), cam: drift(J(0.05, 0.55, -0.38), J(0.02, 0.5, -0.3), J(0, 0.41, 0), J(0, 0.42, 0), 32, 29, u) };
    if (a === "tight") return { ...B, tight: ease((u - 1.0) / 2.5), air: 0.25, cam: drift(J(0.12, 0.5, -0.42), J(0.06, 0.46, -0.34), J(0, 0.4, 0), J(0, 0.41, 0), 33, 30, u) };
    if (a === "water") return { ...B, heat: cl(u / 7), kill: 212, cam: drift(J(0.22, 0.3, -1.0), J(0.08, 0.27, -0.84), J(0, 0.21, 0), J(0, 0.22, 0), 36, 33, u) };
    if (a === "press") return { ...B, heat: cl(u / 6), kill: 240, cam: drift(J(-0.22, 0.3, -1.0), J(-0.08, 0.27, -0.84), J(0, 0.21, 0), J(0, 0.22, 0), 36, 33, u) };
    if (a === "acid") return { ...B, kind: "tomato", fill: lerp(0.05, 1, ease((u - 2.2) / 3.0)), acid: cl(u / 2.0), cam: drift(J(0.1, 0.32, -0.55), J(0.04, 0.28, -0.44), J(0, 0.18, 0), J(0, 0.22, 0), 34, 31, u) };
    if (a === "lid") return { ...B, vac: 1, cam: drift(J(0.05, 0.75, -0.22), J(0.02, 0.62, -0.14), J(0, 0.42, 0), J(0, 0.42, 0), 30, 27, u) };
    if (a === "bulge") return { ...B, kind: "bean", bulge: ease((u - 0.8) / 3.2), gas: cl((u - 0.3) / 1.5), rot: cl((u - 1.5) / 5), cam: drift(J(0.12, 0.5, -0.5), J(0.05, 0.47, -0.38), J(0, 0.36, 0), J(0, 0.41, 0), 34, 30, u, 8) };
    if (a === "rot") return { ...B, kind: "bean", bulge: 1, gas: 1, rot: 0.4 + 0.6 * cl(u / 5), cam: drift(J(-0.2, 0.3, -0.82), J(-0.08, 0.26, -0.6), J(0, 0.2, 0), J(0, 0.24, 0), 36, 32, u, 9) };
    if (a === "inv") return { ...B, kind: "peach", inv: ease((u - 0.5) / 1.4), mold: cl((u - 3.0) / 4.5), cam: drift(J(0.3, 0.42, -1.25), J(0.14, 0.34, -0.98), J(0, 0.2, 0), J(0, 0.19, 0), 38, 34, u, 9) };
    if (a === "wide") return { ...B, cam: drift(J(0.4, 0.55, -1.25), J(0.25, 0.5, -1.05), J(-0.3, 0.25, 0.05), J(-0.25, 0.25, 0.05), 38, 36, u) };
    return B;
  }
  // olla
  const Bc: Scene = { where: "bench", water: 0.215, boil: 0, temp: 140, jarsIn: 7, cam: drift(C(0.25, 0.55, -0.9), C(0.12, 0.48, -0.72), C(0, 0.15, 0), C(0, 0.16, 0), 36, 33, u) };
  if (arg === "load") return { ...Bc, jarsIn: Math.min(7, Math.floor(u / 0.55)), water: lerp(0.12, 0.235, ease((u - 3.8) / 2.2)), temp: 140, cam: drift(C(0.2, 0.62, -0.78), C(0.1, 0.55, -0.66), C(0, 0.13, 0), C(0, 0.15, 0), 36, 33, u) };
  if (arg === "boil") return { ...Bc, water: 0.235, boil: ease((u - 0.8) / 2.2), temp: lerp(180, 212, ease((u - 0.3) / 2.6)), steam: ease((u - 1.5) / 2), cam: drift(C(-0.22, 0.34, -0.78), C(-0.14, 0.3, -0.64), C(-0.05, 0.15, 0), C(-0.05, 0.16, 0), 36, 33, u) };
  if (arg === "alt") return { ...Bc, water: 0.235, boil: 1, temp: lerp(212, 197.6, ease((u - 1.0) / 2.2)), steam: 1, cam: drift(C(-0.42, 0.42, -0.55), C(-0.32, 0.4, -0.44), up(PT.thermo, -0.02), up(PT.thermo, -0.02), 32, 27, u) };
  if (arg === "crack") return { ...Bc, jarsIn: 7, water: 0.235, boil: 0.5, temp: 190, crack: ease((u - 1.6) / 1.4), cam: drift(C(0.12, 0.34, -0.62), C(0.06, 0.3, -0.52), C(0.06, 0.06, 0), C(0.06, 0.06, 0), 34, 30, u) };
  if (arg === "wait") return { ...Bc, water: 0.235, boil: 1 - ease((u - 0.3) / 3), temp: lerp(212, 200, ease(u / 8)), lidOff: 1, steam: 1 - 0.6 * ease(u / 6), cam: drift(C(0.05, 0.75, -0.55), C(0.03, 0.7, -0.42), C(0, 0.2, 0), C(0, 0.2, 0), 34, 31, u) };
  if (arg === "cold") return { ...Bc, jarsIn: 0, water: 0.16, temp: lerp(70, 140, ease((u - 0.5) / 3)), cam: drift(C(0.25, 0.6, -0.8), C(0.14, 0.52, -0.66), C(0, 0.12, 0), C(0, 0.13, 0), 36, 33, u) };
  return Bc;
};

export const project = (c: { p: V3; l: V3; fov: number }, q: V3) => {
  const cam = new THREE.PerspectiveCamera(c.fov, W / H, 0.01, 200); cam.position.copy(v3(c.p)); cam.lookAt(v3(c.l)); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = v3(q).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (name: string, u: number, q: V3) => project(sceneOf(name, u).cam, q);
export const camSpeed = (name: string, u: number) => {
  const a = sceneOf(name, u).cam, b = sceneOf(name, u + 1 / 30).cam;
  const dp = v3(a.p).distanceTo(v3(b.p)) * 60 + v3(a.l).distanceTo(v3(b.l)) * 25;
  return { bx: Math.min(10, dp * 0.18), by: Math.min(6, dp * 0.08) };
};
const Cam: React.FC<{ k: { p: V3; l: V3; fov: number }; t: number }> = ({ k, t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.set(k.p[0] + Math.sin(t * 0.7) * 0.002, k.p[1] + Math.sin(t * 0.93 + 1) * 0.0018, k.p[2]);
  c.up.set(0, 1, 0); c.lookAt(v3(k.l)); c.fov = k.fov; c.near = 0.01; c.far = 200; c.updateProjectionMatrix();
  return null;
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useElenaTex = () => useMemo(() => ({
  // esmalte azul-negro moteado de blanco de la olla vieja (con la saltadura)
  enamel: mk(1024, 256, (g) => {
    g.fillStyle = "#141b2a"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(235,238,245,${0.25 + rnd(i, 1) * 0.6})`; g.beginPath(); g.arc(rnd(i, 2) * 1024, rnd(i, 3) * 256, 0.4 + rnd(i, 4) * 1.1, 0, 6.3); g.fill(); }
    g.fillStyle = "#2a2622"; g.beginPath(); g.ellipse(300, 40, 14, 9, 0.4, 0, 6.3); g.fill();
  }),
  // cinta de papel con la letra de Elena
  label: mk(256, 128, (g) => {
    g.fillStyle = "#e9dcb8"; g.fillRect(0, 0, 256, 128);
    g.fillStyle = "rgba(120,90,40,.15)"; for (let i = 0; i < 60; i++) g.fillRect(rnd(i, 1) * 256, rnd(i, 2) * 128, 3, 3);
    g.fillStyle = "#2b2a3a"; g.font = "italic 600 46px Georgia"; g.fillText("Duraznos", 14, 62); g.font = "italic 500 34px Georgia"; g.fillText("ago '26", 60, 106);
  }),
  // tablones viejos de la pared del sótano
  wall: mk(512, 512, (g) => {
    for (let c = 0; c < 6; c++) {
      const b = 70 + rnd(c, 1) * 30; g.fillStyle = `rgb(${b + 26},${b + 6},${b - 14})`; g.fillRect(c * 86, 0, 86, 512);
      for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(30,18,8,${0.1 + rnd(c, k) * 0.15})`; g.lineWidth = 1 + rnd(c, k + 2) * 2; g.beginPath(); const x = c * 86 + 6 + k * 5.6; g.moveTo(x, 0); g.bezierCurveTo(x + 4, 170, x - 3, 340, x + 2, 512); g.stroke(); }
      g.fillStyle = "rgba(10,6,3,.7)"; g.fillRect(c * 86, 0, 3, 512);
    }
  }, [3, 2]),
}), []);

// ---------------- geometrías ----------------
// frasco de cuarto (perfil real: cuerpo, hombro, cuello con rosca, boca)
const jarPts = (r: number) => [[0, 0.002], [r - 0.006, 0], [r, 0.006], [r, 0.128], [r - 0.004, 0.142], [0.037, 0.152], [0.036, 0.155], [0.037, 0.159], [0.036, 0.162], [0.037, 0.166], [0.0355, 0.172], [0.033, 0.175]].map(([x, y]) => new THREE.Vector2(x, y));
// corte de maqueta: falta la cuarta parte que mira a la cámara (-z = phi π)
const CUT0 = Math.PI * 1.25, CUTL = Math.PI * 1.5;
const GLASS_FULL = new THREE.LatheGeometry(jarPts(JR), 40);
const GLASS_CUT = new THREE.LatheGeometry(jarPts(JR), 64, CUT0, CUTL);   // abierto hacia la cámara (-z)
const contentGeo = (h: number, cut: boolean) => {
  const r = JR - 0.003, pts: THREE.Vector2[] = [];
  const prof = (y: number) => (y < 0.128 ? r : y < 0.152 ? lerp(r, 0.034, (y - 0.128) / 0.024) : 0.034);
  for (let i = 0; i <= 18; i++) { const y = 0.004 + (h - 0.004) * (i / 18); pts.push(new THREE.Vector2(prof(y), y)); }
  pts.unshift(new THREE.Vector2(0, 0.004)); pts.push(new THREE.Vector2(0, h));
  return cut ? new THREE.LatheGeometry(pts, 48, CUT0, CUTL) : new THREE.LatheGeometry(pts, 24);
};
const SEC_CAP = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(1, 0); s.lineTo(1, 1); s.lineTo(0, 1); s.closePath(); return new THREE.ShapeGeometry(s); })();
// tapa plana (disco con el compuesto rojo) + aro con rosca
const LID = new THREE.CylinderGeometry(0.0345, 0.0345, 0.0016, 48);
const DOME_R = Math.sin(Math.PI * 0.22), DOME_H = 1 - Math.cos(Math.PI * 0.22);
const LID_DOME = (() => { const g = new THREE.SphereGeometry(1, 48, 12, 0, Math.PI * 2, 0, Math.PI * 0.22); g.translate(0, -Math.cos(Math.PI * 0.22), 0); return g; })();
const RING = new THREE.CylinderGeometry(0.0375, 0.0378, 0.012, 48, 1, true);
const RING_TOP = new THREE.RingGeometry(0.029, 0.0377, 48);
// olla esmaltada en corte
const canPts = [[0, 0], [CAN_R - 0.03, 0], [CAN_R - 0.005, 0.012], [CAN_R, 0.04], [CAN_R, CAN_H - 0.01], [CAN_R + 0.012, CAN_H]].map(([x, y]) => new THREE.Vector2(x, y));
const POT_CUT = new THREE.LatheGeometry(canPts, 72, CUT0, CUTL);
const waterGeo = (h: number) => new THREE.CylinderGeometry(CAN_R - 0.004, CAN_R - 0.008, h, 64, 1, false, CUT0, CUTL);

// ---------------- piezas ----------------
const Mat = {
  glass: (o = 0.2) => <meshPhysicalMaterial color="#dfeee8" roughness={0.06} metalness={0} transparent opacity={o} clearcoat={1} clearcoatRoughness={0.05} side={THREE.DoubleSide} depthWrite={false} envMapIntensity={1.6} />,
};
const FRUIT: Record<string, string> = { peach: "#e8892a", tomato: "#c0301c", bean: "#6f8f2e" };

// mapa de calor del contenido: borde caliente → centro frío; las esporas mueren donde la temperatura pasa la que las mata
const heatShader = (heat: number, kill: number, h: number) => ({
  uniforms: { k: { value: heat }, kill: { value: kill }, hh: { value: h } },
  vertexShader: "varying vec3 vp; void main(){ vp = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
  fragmentShader: `uniform float k; uniform float kill; uniform float hh; varying vec3 vp;
    vec3 ramp(float x){ x = clamp(x,0.,1.); return x<.33? mix(vec3(.05,.16,.85), vec3(.0,.7,.95), x/.33) : x<.66? mix(vec3(.0,.7,.95), vec3(1.,.78,.05), (x-.33)/.33) : mix(vec3(1.,.78,.05), vec3(.95,.1,.04), (x-.66)/.34); }
    void main(){ float r = abs(vp.x)/0.04; float y = vp.y/hh + 0.5;
      float edge = clamp(max(r, max(1.-y*2.2, (y-0.8)*3.)), 0., 1.);
      float f = clamp(k*1.7 - (1.-edge)*1.05, 0., 1.);
      float T = 70. + (kill-70.) * f;
      vec3 c = ramp((T-70.)/(240.-70.));
      float iso = smoothstep(0.9,1.,fract((T-70.)/17.)) * 0.18;
      gl_FragColor = vec4(c*(0.9-iso), 0.92); }`,
});

const HeroJar: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useElenaTex(), fl = useTextures().flake;
  const fill = sc.fill ?? 1, h = Math.min(0.178, HEAD_Y * fill);
  const cont = useMemo(() => contentGeo(Math.max(0.01, h), true), [h]);
  const heatOn = (sc.heat ?? 0) > 0;
  const sh = useMemo(() => heatShader(sc.heat ?? 0, sc.kill ?? 212, Math.max(0.01, h)), [sc.heat, sc.kill, h]);
  const plane = useMemo(() => new THREE.PlaneGeometry(0.08, Math.max(0.01, h), 1, 1), [h]);
  const col = FRUIT[sc.kind ?? "peach"];
  // tapa: plana → chupada (cóncava) → abombada (aro apretado de más)
  const vac = sc.vac ?? 0, tight = sc.tight ?? 0;
  const bulge = sc.bulge ?? 0, gas = sc.gas ?? 0, rotA = sc.rot ?? 0, inv = sc.inv ?? 0, mold = sc.mold ?? 0;
  const dome0 = 0.0012 * (1 - vac) - 0.0035 * vac + 0.006 * tight + 0.011 * bulge * (1 + 0.04 * Math.sin(t * 2.2)), dome = Math.abs(dome0) < 0.0003 ? 0.0003 : dome0;
  // trozos de fruta (mitades de durazno / tomates enteros pelados), apilados y apretados
  const chunks = useMemo(() => Array.from({ length: 22 }, (_, i) => {
    const lay = Math.floor(i / 4), a = (i % 4) * 1.57 + lay * 0.8 + rnd(i, 1) * 0.5, rr = 0.018 + rnd(i, 2) * 0.01;
    return { p: [Math.cos(a) * rr, 0.016 + lay * 0.024 + rnd(i, 3) * 0.006, Math.sin(a) * rr] as V3, s: 0.017 + rnd(i, 4) * 0.004, ry: rnd(i, 5) * 6 };
  }), []);
  // burbujas atrapadas entre la fruta: suben por la pared
  const bub: number[] = [];
  if ((sc.bubbles ?? 0) > 0 && !(sc.gas ?? 0)) for (let i = 0; i < 70; i++) { const ph = (t * (0.25 + rnd(i, 1) * 0.35) + rnd(i, 2)) % 1, a = Math.PI * (0.8 + rnd(i, 3) * 1.4); bub.push(Math.cos(a) * 0.039, 0.01 + ph * (h - 0.012), Math.sin(a) * 0.039); }
  // el aire del espacio libre: tiembla, sale bajo el borde de la tapa y sube
  const air: number[] = []; const airAmt = sc.air ?? 0;
  for (let i = 0; i < 60; i++) {
    const ph = (t * (0.3 + rnd(i, 1) * 0.5) + rnd(i, 2)) % 1, a = rnd(i, 3) * 6.28;
    const out = airAmt > 0 && i < 60 * airAmt;
    if (out) { const r = ph < 0.4 ? 0.02 + ph * 0.04 : 0.036 + (ph - 0.4) * 0.03; air.push(Math.cos(a) * r, ph < 0.4 ? h + 0.004 + rnd(i, 4) * (NECK + 0.02 - h) : 0.176 + (ph - 0.4) * 0.09, Math.sin(a) * r); }
    else if (vac < 0.5) air.push(Math.cos(a) * 0.028 * rnd(i, 5) + Math.sin(t * 9 + i) * 0.001, h + 0.003 + rnd(i, 6) * Math.max(0.002, 0.172 - h), Math.sin(a) * 0.028 * rnd(i, 7));
  }
  // esporas de botulismo (puntitos verdes) dentro: a 212 °F sobreviven, a 240 °F se apagan
  const spores: { p: V3; o: number }[] = [];
  // sin mapa: los bichos se multiplican y el gas empuja la tapa
  if (!heatOn && rotA > 0) for (let i = 0; i < 90; i++) { const born = rnd(i, 9) * 0.95; if (rotA < born) continue; spores.push({ p: [(rnd(i, 1) - 0.5) * 0.066 + Math.sin(t * 0.6 + i) * 0.0015, 0.012 + rnd(i, 4) * (h - 0.02), -0.006 - rnd(i, 6) * 0.01], o: cl((rotA - born) / 0.08) }); }
  if (heatOn) for (let i = 0; i < 26; i++) {
    const x = (rnd(i, 1) - 0.5) * 0.06;
    const die = (sc.kill ?? 212) >= 240 ? 1 - cl(((sc.heat ?? 0) - 0.45 - rnd(i, 3) * 0.4) / 0.12) : 1;
    spores.push({ p: [x + Math.sin(t * 0.7 + i) * 0.0015, 0.02 + rnd(i, 4) * (h - 0.035), -0.003], o: die });
  }
  // gas: burbujas que suben SOLAS + espuma apretada bajo la tapa
  const gasP: number[] = [], foam: number[] = [];
  if (gas > 0) {
    for (let i = 0; i < 120; i++) { const ph = (t * (0.45 + rnd(i, 1) * 0.6) + rnd(i, 2)) % 1, a = rnd(i, 3) * 6.28, r = rnd(i, 4) * 0.036; if (rnd(i, 5) < gas) gasP.push(Math.cos(a) * r + Math.sin(t * 3 + i) * 0.0012, 0.01 + ph * (h - 0.012), Math.sin(a) * r); }
    for (let i = 0; i < 260; i++) { const a = rnd(i, 7) * 6.28, r = Math.sqrt(rnd(i, 8)) * 0.034; if (rnd(i, 9) < gas) foam.push(Math.cos(a) * r, h - 0.002 + rnd(i, 10) * 0.007 + 0.0008 * Math.sin(t * 4 + i), Math.sin(a) * r); }
  }
  // moho: pelusa blanca que crece en la superficie, bajo el sello
  const fuzz: number[] = [];
  if (mold > 0) for (let i = 0; i < 420; i++) { if (rnd(i, 11) > mold) continue; const a = rnd(i, 12) * 6.28, r = Math.sqrt(rnd(i, 13)) * 0.033, k = rnd(i, 14); fuzz.push(Math.cos(a) * r, h + 0.001 + k * 0.012 * mold, Math.sin(a) * r); }
  const over = sc.over ?? 0, acid = sc.acid ?? 0;
  return (
    <group position={[JAR[0], JAR[1] + (inv > 0 ? 0.178 * JS * inv : 0), JAR[2]]} rotation={[0, 0, Math.PI * inv]} scale={[JS, JS, JS]}>
      {/* vidrio en corte + el filo de vidrio verdoso donde está cortado */}
      <mesh geometry={heatOn ? GLASS_FULL : GLASS_CUT} renderOrder={3}>{Mat.glass(heatOn ? 0.14 : 0.24)}</mesh>
      {!heatOn && <mesh geometry={GLASS_CUT} scale={[0.985, 1, 0.985]} renderOrder={3}><meshStandardMaterial color="#9fc9b4" roughness={0.1} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} /></mesh>}
      {/* contenido: almíbar/jugo con la fruta, o el mapa de calor */}
      {heatOn ? (
        <mesh geometry={plane} position={[0, Math.max(0.01, h) / 2, 0]}><shaderMaterial args={[sh]} side={THREE.DoubleSide} transparent toneMapped={false} /></mesh>
      ) : (
        <>
          <mesh geometry={cont} renderOrder={1}><meshPhysicalMaterial color={sc.kind === "tomato" ? "#b8361c" : sc.kind === "bean" ? "#c9cfa6" : "#f2a43a"} roughness={0.12} transparent opacity={sc.kind === "bean" ? 0.5 : 0.6} side={THREE.DoubleSide} emissive={sc.kind === "tomato" ? "#3a0a02" : sc.kind === "bean" ? "#1e2410" : "#5a2c04"} emissiveIntensity={0.35} depthWrite={false} /></mesh>
          {chunks.filter((c) => c.p[1] < h - 0.008).map((c, i) => (
            <mesh key={i} position={c.p} rotation={[0.5, c.ry, 0.3]} scale={sc.kind === "bean" ? [c.s * 0.32, c.s * 2.6, c.s * 0.32] : [c.s, c.s * (sc.kind === "tomato" ? 0.85 : 0.55), c.s]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color={col} roughness={0.28} emissive={col} emissiveIntensity={0.22} /></mesh>
          ))}
        </>
      )}
      {spores.map((s, i) => s.o > 0.02 && <mesh key={"sp" + i} position={s.p} scale={[1 + 0.15 * Math.sin(t * 5 + i), 1, 1]}><sphereGeometry args={[0.0011, 10, 8]} /><meshBasicMaterial color="#b6ffb0" transparent opacity={s.o} toneMapped={false} /></mesh>)}
      {spores.map((s, i) => s.o > 0.02 && <mesh key={"sh" + i} position={s.p}><sphereGeometry args={[0.0024, 10, 8]} /><meshBasicMaterial color="#2aff4a" transparent opacity={0.28 * s.o} toneMapped={false} depthWrite={false} /></mesh>)}
      {/* jugo de limón cayendo al fondo */}
      {acid > 0 && acid < 1 && <mesh position={[0, 0.17 - acid * 0.15, 0]}><cylinderGeometry args={[0.0022, 0.0022, 0.06, 10]} /><meshPhysicalMaterial color="#f7ec8a" transparent opacity={0.8} roughness={0.05} /></mesh>}
      {acid > 0.6 && <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.04, 0.04, 0.006 * Math.min(1, (acid - 0.6) / 0.4), 32]} /><meshPhysicalMaterial color="#f2e27a" transparent opacity={0.7} roughness={0.05} emissive="#6a5a10" emissiveIntensity={0.3} /></mesh>}
      {bub.length > 0 && <Pts pts={bub} col="#ffffff" size={0.004 * JS} o={0.85} map={fl} />}
      {gasP.length > 0 && <Pts pts={gasP} col="#f4fff0" size={0.0032 * JS} o={0.9} map={fl} />}
      {foam.length > 0 && <Pts pts={foam} col="#f6f3e6" size={0.0055 * JS} o={0.8} map={fl} />}
      {fuzz.length > 0 && <Pts pts={fuzz} col="#f2f4ee" size={0.0062 * JS} o={0.75} map={fl} />}
      {air.length > 0 && <Pts pts={air} col="#cfe8ff" size={0.0035 * JS} o={0.9} map={fl} />}
      {/* el rebalse: el almíbar por el borde, chorrea por afuera */}
      {over > 0.01 && <mesh position={[0.036, 0.175 - 0.06 * over, -0.012]}><cylinderGeometry args={[0.0028, 0.0018, 0.12 * over, 10]} /><meshPhysicalMaterial color="#f0a43a" transparent opacity={0.75} roughness={0.05} /></mesh>}
      {/* tapa + compuesto rojo + aro */}
      <group position={[0, 0.1768, 0]}>
        <mesh geometry={LID_DOME} scale={[0.0345 / DOME_R, dome / DOME_H, 0.0345 / DOME_R]} position={[0, 0.0008, 0]} castShadow>
          <meshStandardMaterial color="#c9ccd1" roughness={0.28} metalness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.0004, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.0318, 0.0342, 48]} /><meshStandardMaterial color="#b4271d" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        {/* la etiqueta de cinta con su letra */}
        <mesh position={[0, 0.0018 + Math.max(0, dome), 0]} rotation={[-Math.PI / 2, 0, Math.PI + 0.1]}><planeGeometry args={[0.04, 0.02]} /><meshStandardMaterial map={tx.label} roughness={0.8} /></mesh>
      </group>
      {sc.tight === undefined || sc.tight < 0.99 ? (
        <group position={[0, 0.171, 0]}>
          <mesh geometry={RING}><meshStandardMaterial color="#b9a46a" roughness={0.3} metalness={0.95} side={THREE.DoubleSide} /></mesh>
          <mesh geometry={RING_TOP} position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><meshStandardMaterial color="#c9b47a" roughness={0.3} metalness={0.95} side={THREE.DoubleSide} /></mesh>
        </group>
      ) : null}
    </group>
  );
};

const Pts: React.FC<{ pts: number[]; col: string; size: number; o: number; map?: THREE.Texture; add?: boolean }> = ({ pts, col, size, o, map, add }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color={col} size={size} transparent opacity={o} depthWrite={false} map={map} alphaMap={map} sizeAttenuation blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} /></points>;
};

// frasco chico (los de la olla y los de la despensa sueltos)
const SmallJar: React.FC<{ p: V3; col: string; cracked?: number; ry?: number }> = ({ p, col, cracked = 0, ry = 0 }) => {
  const cont = useMemo(() => contentGeo(0.15, false), []);
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <mesh geometry={GLASS_FULL} renderOrder={3}>{Mat.glass(0.22)}</mesh>
      <mesh geometry={cont} position={[0, cracked * -0.0, 0]}><meshStandardMaterial color={col} roughness={0.3} emissive={col} emissiveIntensity={0.12} /></mesh>
      <mesh geometry={LID} position={[0, 0.1765, 0]}><meshStandardMaterial color="#c9ccd1" roughness={0.3} metalness={0.9} /></mesh>
      <mesh geometry={RING} position={[0, 0.171, 0]}><meshStandardMaterial color="#b9a46a" roughness={0.3} metalness={0.95} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

const Canner: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useElenaTex(), fl = useTextures().flake;
  const wl = sc.water ?? 0.2, boil = sc.boil ?? 0, crack = sc.crack ?? 0;
  const wg = useMemo(() => waterGeo(wl - 0.012), [wl]);
  // 7 frascos de cuarto en la rejilla: 1 al centro + 6 alrededor
  const spots: V3[] = [[0, 0, 0], ...Array.from({ length: 6 }, (_, i) => [Math.cos(i * 1.047 + 0.5) * 0.118, 0, Math.sin(i * 1.047 + 0.5) * 0.118] as V3)];
  const n = sc.jarsIn ?? 7;
  // burbujas del hervor: del fondo y de las paredes, cada vez más y más grandes
  const bub: number[] = [];
  const N = Math.round(40 + 360 * boil);
  for (let i = 0; i < N; i++) { const ph = (t * (0.6 + rnd(i, 1) * 0.9) * (0.5 + boil) + rnd(i, 2)) % 1, a = Math.PI * (0.65 + rnd(i, 3) * 1.7), r = rnd(i, 4) * (CAN_R - 0.02); bub.push(Math.cos(a) * r + Math.sin(ph * 8 + i) * 0.004, 0.02 + ph * (wl - 0.03), Math.sin(a) * r); }
  const steam: number[] = [];
  const st = sc.steam ?? 0;
  if (st > 0.02) for (let i = 0; i < 220; i++) { const ph = (t * (0.18 + rnd(i, 1) * 0.12) + rnd(i, 2)) % 1; steam.push((rnd(i, 3) - 0.5) * CAN_R * 1.6 * (1 + ph), CAN_H + 0.02 + ph * 0.5, (rnd(i, 4) - 0.5) * CAN_R * 1.2 * (1 + ph)); }
  // el frasco frío que se parte: el fondo se suelta y los duraznos flotan
  const cr = spots[1];
  return (
    <group position={CAN}>
      <mesh geometry={POT_CUT} castShadow receiveShadow><meshStandardMaterial map={tx.enamel} roughness={0.22} metalness={0.05} side={THREE.DoubleSide} /></mesh>
      {/* hornalla: anillo de llama azul */}
      <mesh position={[0, -0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.07, 0.13, 48]} /><meshBasicMaterial color="#3a7bff" transparent opacity={0.35 + 0.4 * boil + 0.08 * Math.sin(t * 17)} toneMapped={false} /></mesh>
      {/* rejilla */}
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[CAN_R - 0.03, 0.003, 8, 64]} /><meshStandardMaterial color="#9aa1a8" metalness={1} roughness={0.3} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, i * 0.785]}><boxGeometry args={[(CAN_R - 0.03) * 2, 0.004, 0.004]} /><meshStandardMaterial color="#9aa1a8" metalness={1} roughness={0.3} /></mesh>)}
      {/* agua en corte, se ve el nivel 1-2" sobre las tapas */}
      <mesh geometry={wg} position={[0, 0.006 + (wl - 0.012) / 2, 0]} renderOrder={2}><meshPhysicalMaterial color="#9cc6d8" roughness={0.04} transparent opacity={0.32} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, wl, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}><circleGeometry args={[CAN_R - 0.005, 64, Math.PI * 0.75, CUTL]} /><meshPhysicalMaterial color="#cfe6ee" roughness={0.02} transparent opacity={0.35 + 0.1 * boil} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {spots.slice(0, n).map((q, i) => (i === 1 && crack > 0 ? null : <SmallJar key={i} p={[q[0], 0.022, q[2]]} col={i % 2 ? "#e8892a" : "#ef9a34"} ry={i} />))}
      {crack > 0 && (
        <group position={[cr[0], 0.022, cr[2]]}>
          <group position={[0, 0.012 * crack, 0]} rotation={[0.06 * crack, 0, 0.05 * crack]}><mesh geometry={GLASS_FULL}>{Mat.glass(0.25)}</mesh></group>
          {/* grietas que suben desde el fondo */}
          {Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (0.8 + i * 0.22); return <mesh key={i} position={[Math.cos(a) * (JR + 0.0006), 0.018 * Math.min(1, crack * 2), Math.sin(a) * (JR + 0.0006)]} rotation={[0, -a, 0.3 * (rnd(i, 1) - 0.5)]}><planeGeometry args={[0.0012, 0.036 * Math.min(1, crack * 2)]} /><meshBasicMaterial color="#ffffff" toneMapped={false} side={THREE.DoubleSide} /></mesh>; })}
          {/* las mitades de durazno se escapan y flotan */}
          {Array.from({ length: 5 }, (_, i) => { const k = cl((crack - 0.25) / 0.75), a = i * 1.26; return <mesh key={"f" + i} position={[Math.cos(a) * (0.02 + 0.06 * k), 0.02 + k * (0.08 + 0.03 * i) + 0.004 * Math.sin(t * 3 + i), Math.sin(a) * (0.02 + 0.06 * k) - 0.03 * k]} rotation={[t * 0.3 + i, i, 0]} scale={[0.018, 0.01, 0.018]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#e8892a" roughness={0.35} /></mesh>; })}
          {/* nube de almíbar */}
          <Pts pts={Array.from({ length: 150 }, (_, i) => { const k = cl((crack - 0.1) / 0.9); return [(rnd(i, 1) - 0.5) * 0.12 * k, 0.005 + rnd(i, 2) * 0.1 * k, (rnd(i, 3) - 0.5) * 0.12 * k]; }).flat()} col="#f3b04a" size={0.012} o={0.35 * crack} map={fl} />
        </group>
      )}
      {bub.length > 0 && <Pts pts={bub} col="#ffffff" size={0.006 + 0.006 * boil} o={0.7} map={fl} />}
      {steam.length > 0 && <Pts pts={steam} col="#f2f2f2" size={0.14} o={0.05 * st} map={fl} />}
      {/* tapa de la olla (afuera cuando lidOff) */}
      {/* termómetro de aguja enganchado al borde */}
      <Thermometer t={t} temp={sc.temp ?? 140} p={[-CAN_R - 0.05, CAN_H + 0.07, 0.02]} />
    </group>
  );
};

// termómetro de dial: esfera blanca, aguja roja, vástago metido en el agua
const Thermometer: React.FC<{ t: number; temp: number; p: V3 }> = ({ temp, p }) => {
  const face = useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512; const g = cv.getContext("2d")!;
    g.fillStyle = "#f6f2e8"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill();
    g.strokeStyle = "#1c1c1c"; g.fillStyle = "#1c1c1c"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let TC = 20; TC <= 125; TC += 5) {
      const T = TC * 1.8 + 32, a = (-135 + ((T - 60) / 200) * 270) * Math.PI / 180, big = TC % 20 === 0;
      g.lineWidth = big ? 6 : 3; g.beginPath(); g.moveTo(256 + Math.sin(a) * 230, 256 - Math.cos(a) * 230); g.lineTo(256 + Math.sin(a) * (big ? 190 : 208), 256 - Math.cos(a) * (big ? 190 : 208)); g.stroke();
      if (big) { g.font = "bold 44px Arial"; g.fillText(String(TC), 256 + Math.sin(a) * 150, 256 - Math.cos(a) * 150); }
    }
    // la franja de "boil" y la zona de presión
    const arc = (T0: number, T1: number, c: string) => { g.strokeStyle = c; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 238, (-225 + ((T0 - 60) / 200) * 270) * Math.PI / 180, (-225 + ((T1 - 60) / 200) * 270) * Math.PI / 180); g.stroke(); };
    arc(199.4, 212, "#e8a020"); arc(235.4, 249.8, "#c0261c");
    g.font = "bold 34px Arial"; g.fillText("°C", 256, 360);
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return tx;
  }, []);
  const a = (-135 + ((Math.max(60, Math.min(260, temp)) - 60) / 200) * 270) * Math.PI / 180;
  return (
    <group position={p} rotation={[0, 0.25, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.016, 48]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.2} /></mesh>
      <mesh position={[0, 0, -0.0085]} rotation={[0, Math.PI, 0]}><circleGeometry args={[0.045, 48]} /><meshStandardMaterial map={face} roughness={0.5} /></mesh>
      <mesh position={[0, 0, -0.0095]} rotation={[0, 0, a]}><boxGeometry args={[0.0022, 0.04, 0.001]} /><meshStandardMaterial color="#c0201a" roughness={0.4} emissive="#600" emissiveIntensity={0.4} /></mesh>
      <mesh position={[0.003 * 0, 0, -0.0098]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.002, 16]} /><meshStandardMaterial color="#222" /></mesh>
      {/* vástago */}
      <mesh position={[0.03, -0.09, 0.0]} rotation={[0, 0, -0.32]}><cylinderGeometry args={[0.0025, 0.0025, 0.16, 12]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.2} /></mesh>
    </group>
  );
};

// ---------------- la DESPENSA infinita (instanciada) ----------------
const UNIT = 1.2, UNITS = 34, SHELVES = 6, PER = 11;
const JAR_COLS = ["#e8892a", "#c0301c", "#5d7a2a", "#7d8a3a", "#6a1a3a", "#d9c07a", "#e8892a", "#b8361c", "#f0b24a"];
const useAisle = () => useMemo(() => {
  const jars: { p: V3; c: string; s: number; ry: number }[] = [];
  const boards: { p: V3; s: V3 }[] = [], posts: { p: V3 }[] = [];
  for (const side of [-1, 1]) for (let u = 0; u < UNITS; u++) {
    const z = -u * UNIT, x = side * 0.95;
    posts.push({ p: [x, 1.1, z + UNIT / 2] });
    for (let s = 0; s < SHELVES; s++) {
      const y = 0.12 + s * 0.36;
      boards.push({ p: [x, y, z], s: [0.36, 0.025, UNIT] });
      const color = JAR_COLS[Math.floor(rnd(u * 7 + s, side + 3) * JAR_COLS.length)];
      for (let j = 0; j < PER; j++) {
        if (rnd(u * 97 + s * 13 + j, side + 5) < 0.04) continue;
        const sc = rnd(u, s) < 0.5 ? 1 : 0.78;
        jars.push({ p: [x - side * 0.08 + (rnd(j, u) - 0.5) * 0.02, y + 0.013, z - UNIT / 2 + 0.06 + j * (UNIT - 0.1) / (PER - 1)], c: rnd(u * 5 + s * 3 + j, 2) < 0.12 ? JAR_COLS[(j + s) % JAR_COLS.length] : color, s: sc, ry: rnd(j, s) * 6 });
        // segunda fila atrás
        jars.push({ p: [x + side * 0.06, y + 0.013, z - UNIT / 2 + 0.11 + j * (UNIT - 0.1) / (PER - 1)], c: color, s: sc, ry: rnd(s, j) * 6 });
      }
    }
  }
  // orden de encendido para el "500": del frente hacia el fondo, alternando lados
  const order = jars.map((j, i) => ({ i, k: -j.p[2] * 10 + j.p[1] * 0.5 + (j.p[0] > 0 ? 0.3 : 0) + (Math.abs(j.p[0]) > 0.94 ? 0 : 50) })).sort((a, b) => a.k - b.k).map((x) => x.i);
  return { jars, boards, posts, order };
}, []);

const Inst: React.FC<{ geo: THREE.BufferGeometry; n: number; set: (m: THREE.Matrix4, c: THREE.Color, i: number) => void; mat: React.ReactNode; cast?: boolean }> = ({ geo, n, set, mat, cast }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const im = ref.current!; const m = new THREE.Matrix4(), c = new THREE.Color();
    for (let i = 0; i < n; i++) { set(m, c, i); im.setMatrixAt(i, m); im.setColorAt(i, c); }
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
  }, [n, set]);
  return <instancedMesh ref={ref} args={[geo, undefined, n]} castShadow={cast} receiveShadow frustumCulled={false}>{mat}</instancedMesh>;
};

const Aisle: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const A = useAisle(), tx = useTextures(), et = useElenaTex();
  const cont = useMemo(() => contentGeo(0.15, false), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const setJar = useMemo(() => (m: THREE.Matrix4, c: THREE.Color, i: number) => { const j = A.jars[i]; q.setFromEuler(new THREE.Euler(0, j.ry, 0)); m.compose(v3(j.p), q, new THREE.Vector3(j.s, j.s, j.s)); c.set(j.c); }, [A, q]);
  const setGlass = useMemo(() => (m: THREE.Matrix4, c: THREE.Color, i: number) => { const j = A.jars[i]; m.compose(v3(j.p), q.identity(), new THREE.Vector3(j.s, j.s, j.s)); c.set("#ffffff"); }, [A, q]);
  const setLid = useMemo(() => (m: THREE.Matrix4, c: THREE.Color, i: number) => { const j = A.jars[i]; m.compose(v3([j.p[0], j.p[1] + 0.1765 * j.s, j.p[2]]), q.identity(), new THREE.Vector3(j.s, j.s, j.s)); c.set("#c9ccd1"); }, [A, q]);
  const BOARD = useMemo(() => rbox(1, 1, 1, 0.08), []);
  const setBoard = useMemo(() => (m: THREE.Matrix4, c: THREE.Color, i: number) => { const b = A.boards[i]; m.compose(v3(b.p), q.identity(), v3(b.s)); c.setHSL(0.07, 0.42, 0.26 + rnd(i, 1) * 0.08); }, [A, q]);
  const setPost = useMemo(() => (m: THREE.Matrix4, c: THREE.Color, i: number) => { m.compose(v3(A.posts[i].p), q.identity(), new THREE.Vector3(0.05, 2.2, 0.05)); c.setHSL(0.07, 0.4, 0.2); }, [A, q]);
  const night = sc.night ?? 0, lit = sc.lit ?? 0;
  const camZ = sc.cam.p[2];
  // lamparitas colgando cada 2,4 m (las 4 más cercanas a la cámara alumbran de verdad)
  const bulbs = Array.from({ length: 16 }, (_, i) => -i * 2.4 + 0.6);
  const near = bulbs.filter((z) => z < camZ + 2.5).slice(0, 4);
  // polvo en la luz
  const dust: number[] = [];
  for (let i = 0; i < 700; i++) { const ph = (t * 0.02 * (0.5 + rnd(i, 1)) + rnd(i, 2)) % 1; dust.push((rnd(i, 3) - 0.5) * 1.5, 0.3 + ((rnd(i, 4) + ph) % 1) * 2.0, camZ - 0.5 - rnd(i, 5) * 9); }
  // halo de los frascos encendidos (el "500")
  const glow: number[] = [];
  for (let k = 0; k < Math.min(lit, A.order.length); k++) { const j = A.jars[A.order[k]]; glow.push(j.p[0], j.p[1] + 0.08 * j.s, j.p[2]); }
  const lantern: V3 = [camZ > -2 ? 0.35 : 0.35, 1.05, camZ - 1.4];
  return (
    <group>
      <fog attach="fog" args={[night ? "#05040a" : "#1a120b", 2.5, night ? 9 : 17]} />
      <hemisphereLight args={["#f1dcc0", "#3a2a1a", night ? 0.03 : 0.32]} />
      {!night && near.map((z, i) => <pointLight key={i} position={[0, 2.25, z]} intensity={2.4} distance={6} decay={1.6} color="#ffc98a" castShadow={i === 0} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0004} />)}
      {!!night && <pointLight position={lantern} intensity={1.6 + 0.12 * Math.sin(t * 11) * Math.sin(t * 7)} distance={4.5} decay={1.7} color="#ff9a4a" castShadow shadow-bias={-0.0004} />}
      {!!night && <mesh position={lantern}><sphereGeometry args={[0.03, 16, 12]} /><meshBasicMaterial color="#ffd38a" toneMapped={false} /></mesh>}
      {/* piso de tablas, techo de vigas, pared del fondo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -18]} receiveShadow><planeGeometry args={[3, 44]} /><meshStandardMaterial map={tx.planks} roughness={0.85} color="#8a7058" /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.4, -18]}><planeGeometry args={[3, 44]} /><meshStandardMaterial map={et.wall} roughness={0.9} color="#5a4636" /></mesh>
      {[-1.18, 1.18].map((x) => <mesh key={x} position={[x, 1.2, -18]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}><planeGeometry args={[44, 2.4]} /><meshStandardMaterial map={et.wall} roughness={0.9} color="#6a5442" /></mesh>)}
      {bulbs.map((z, i) => (
        <group key={i} position={[0, 2.25, z]}>
          <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.003, 0.003, 0.16, 6]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh><sphereGeometry args={[0.035, 16, 12]} /><meshBasicMaterial color={night ? "#2a2622" : "#ffdca0"} toneMapped={false} /></mesh>
        </group>
      ))}
      <Inst geo={BOARD} n={A.boards.length} set={setBoard} mat={<meshStandardMaterial map={tx.planks} roughness={0.8} />} cast />
      <Inst geo={BOARD} n={A.posts.length} set={setPost} mat={<meshStandardMaterial roughness={0.8} />} />
      <Inst geo={cont} n={A.jars.length} set={setJar} mat={<meshStandardMaterial roughness={0.32} emissive="#3a1a04" emissiveIntensity={0.15} />} cast />
      <Inst geo={GLASS_FULL} n={A.jars.length} set={setGlass} mat={<meshPhysicalMaterial color="#e6f2ec" roughness={0.06} transparent opacity={0.2} clearcoat={1} depthWrite={false} envMapIntensity={1.8} />} />
      <Inst geo={LID} n={A.jars.length} set={setLid} mat={<meshStandardMaterial roughness={0.3} metalness={0.9} />} />
      {(sc.bad ?? 0) > 0 && <BadJar t={t} k={sc.bad ?? 0} />}
      {glow.length > 0 && <Pts pts={glow} col="#ffcf7a" size={0.16} o={0.55} map={tx.flake} add />}
      {!night && <Pts pts={dust} col="#ffe7c2" size={0.012} o={0.5} map={tx.flake} />}
    </group>
  );
};

// el frasco malo de la despensa: tapa abombada, salmuera turbia y un brillo rojo que late (lo que hay que tirar)
const BadJar: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  const fl = useTextures().flake;
  const cont = useMemo(() => contentGeo(0.15, false), []);
  const p: V3 = [BADP[0], BADP[1] - 0.08, BADP[2]];
  const halo: number[] = []; for (let i = 0; i < 40; i++) { const a = rnd(i, 1) * 6.28, r = 0.05 + rnd(i, 2) * 0.06; halo.push(p[0] + Math.cos(a) * r * 0.6, p[1] + 0.09 + (rnd(i, 3) - 0.5) * 0.16, p[2] + Math.sin(a) * r); }
  const beat = 0.6 + 0.4 * Math.sin(t * 5.2);
  return (
    <group>
      <group position={p}>
        <mesh geometry={GLASS_FULL} renderOrder={3}>{Mat.glass(0.26)}</mesh>
        <mesh geometry={cont}><meshStandardMaterial color="#a9b27a" roughness={0.4} transparent opacity={0.92} emissive="#2a3010" emissiveIntensity={0.2} /></mesh>
        <mesh geometry={LID_DOME} scale={[0.0345 / DOME_R, (0.0012 + 0.012 * k) / DOME_H, 0.0345 / DOME_R]} position={[0, 0.1773, 0]}><meshStandardMaterial color="#c9ccd1" roughness={0.28} metalness={0.9} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={RING} position={[0, 0.171, 0]}><meshStandardMaterial color="#b9a46a" roughness={0.3} metalness={0.95} side={THREE.DoubleSide} /></mesh>
        <pointLight position={[0, 0.1, -0.12]} intensity={0.9 * k * beat} distance={0.7} decay={2} color="#ff3a22" />
      </group>
      <Pts pts={halo} col="#ff4a2a" size={0.07} o={0.32 * k * beat} map={fl} add />
    </group>
  );
};

// ---------------- la MESA de trabajo ----------------
const Bench: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useTextures(), et = useElenaTex();
  const motes: number[] = [];
  for (let i = 0; i < 380; i++) { const ph = (t * 0.015 * (0.5 + rnd(i, 1)) + rnd(i, 2)) % 1; const k = rnd(i, 3); motes.push(-1.2 + k * 1.4 + (rnd(i, 4) - 0.5) * 0.3, 2.2 - k * 1.25 + ((ph - 0.5) * 0.2), 8.0 + (rnd(i, 5) - 0.5) * 0.9); }
  return (
    <group>
      <fog attach="fog" args={["#120c08", 3, 9]} />
      <hemisphereLight args={["#f3e6d2", "#4a3626", 0.3]} />
      {/* luz de ventana desde la izquierda, con el polvo en el haz */}
      <directionalLight position={[-2.4, 3.2, 6.6]} intensity={2.1} color="#ffe2b8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={1.5} shadow-camera-bottom={-1.5} />
      <pointLight position={[0.9, 1.6, 7.3]} intensity={0.5} distance={4} color="#ffcf9a" />
      <Pts pts={motes} col="#fff0d2" size={0.008} o={0.55} map={tx.flake} />
      {/* mesa de pino gastada + pared de tablones + la ventana (brillo) */}
      <mesh position={[0, TOP - 0.025, 8.0]} castShadow receiveShadow geometry={rbox(2.4, 0.05, 1.0, 0.012)}><meshStandardMaterial map={tx.planks} color="#b89a78" roughness={0.75} /></mesh>
      <mesh position={[0, 1.4, 8.75]}><planeGeometry args={[4, 2.8]} /><meshStandardMaterial map={et.wall} roughness={0.9} color="#8a6e56" side={THREE.DoubleSide} /></mesh>
      <mesh position={[-1.6, 1.55, 8.7]}><planeGeometry args={[0.8, 1.0]} /><meshBasicMaterial color="#fff1d6" toneMapped={false} side={THREE.DoubleSide} /></mesh>
      {/* repasador doblado + frascos vacíos al fondo + embudo */}
      <mesh position={[0.78, TOP + 0.01, 8.05]} geometry={rbox(0.36, 0.02, 0.26, 0.008)} castShadow><meshStandardMaterial color="#e8e2d4" roughness={0.95} /></mesh>
      {[[-0.95, 8.35], [-0.84, 8.42], [0.82, 8.42], [0.94, 8.36]].map(([x, z], i) => <SmallJar key={i} p={[x, TOP, z]} col={i < 2 ? "#e8892a" : "#c0301c"} ry={i} />)}
      <Canner t={t} sc={sc} />
      <HeroJar t={t} sc={sc} />
    </group>
  );
};

export const PantryWorld: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => (
  <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <Cam k={sc.cam} t={t} />
    <Post bloom={sc.where === "aisle" ? 0.55 : 0.28} threshold={0.88} exposure={sc.night ? 0.95 : 0.9} env={sc.where === "aisle" ? 0.12 : 0.22} />
    <color attach="background" args={[sc.night ? "#05040a" : "#140d08"]} />
    {sc.where === "aisle" ? <Aisle t={t} sc={sc} /> : <Bench t={t} sc={sc} />}
  </ThreeCanvas>
);
