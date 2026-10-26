// lcf2510b · EL MUNDO de Loretta con LA SARTÉN CHICA (vara gary01): una sola escena three.js y UNA cámara por toma.
//  · la MESA PARA UNO con el mantel del sótano de la iglesia, la silla vacía de Harold, la vela, el plato bueno y el libro en la página REAL.
//  · encima, la SARTÉN DE 8 PULGADAS gigante (la de June, hierro con mango de metal) sobre su hornalla: adentro cambia la cena
//    (1 hamburger steak · 2 cutlet · 3 papas · 4 pescado · 5 sloppy joe · 6 huevos en tomate · 7 muslos con hongos · 8 frittata ·
//    9 hash · 10 arroz frito · 0 vacía), con chisporroteo, vapor, la tapa de vidrio, el desglasado y el agua caliente que la deja limpia.
//  · al lado puede aparecer la sartén GRANDE con la manteca quemada (el error); al fondo la cocina blanca: el horno es el PORTAL.
// Cada toma = sceneOf(nombre, u). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
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
type Tx = THREE.Texture | undefined;


// ---------------- puntos fijos ----------------
const TOP = 0.76;                                 // tablero
const PAN: V3 = [-0.04, TOP + 0.002, -0.06];      // centro de la hornalla (base)
const PS = 1.7;                                   // la sartén "gigante"
const HB = 0.026, PB = 0.004, PD = 0.042, PR0 = 0.083, PR1 = 0.105; // hornalla, fondo, alto, radio abajo/arriba (sartén de 8")
const STOVE = { x: 1.6, z: -1.12, w: 0.78, h: 0.92, d: 0.62 };
const DOOR = { y0: 0.14, h: 0.44, w: 0.5, z: STOVE.z + STOVE.d / 2 + 0.01 };
const PLATE: V3 = [-0.47, TOP + 0.004, 0.24];
const BOOK: V3 = [0.44, TOP + 0.003, 0.22];
const CHAIR: V3 = [0.95, 0, -0.06];
const CANDLE: V3 = [-0.5, TOP, -0.22];
const BIG: V3 = [0.5, TOP + 0.002, -0.16];
const pw = (x: number, y: number, z: number): V3 => [PAN[0] + x * PS, PAN[1] + (HB + y) * PS, PAN[2] + z * PS];
export const PT = {
  pan: pw(0, PB + 0.012, 0),
  rim: pw(PR1 * 0.7, PD, PR1 * 0.7),
  handle: pw(PR1 + 0.1, PD * 0.8, 0),
  food: (dx = 0, dz = 0) => pw(dx, PB + 0.014, dz),
  big: [BIG[0], BIG[1] + 0.03, BIG[2]] as V3,
  oven: [STOVE.x, DOOR.y0 + DOOR.h / 2, DOOR.z] as V3,
  chair: [CHAIR[0], 0.95, CHAIR[2]] as V3,
  cross: [-0.4, TOP + 0.002, 0.33] as V3,
  candle: [CANDLE[0], TOP + 0.2, CANDLE[2]] as V3,
  plate: PLATE,
  book: BOOK,
  bag: [0.42, TOP + 0.02, 0.2] as V3,
};

// ---------------- la escena de cada toma ----------------
export type Scene = {
  cam: { p: V3; l: V3; fov: number };
  k?: number;              // qué cena hay en la sartén (0 = vacía)
  sizzle?: number;         // chisporroteo (gotitas que saltan)
  steam?: number;          // vapor
  lid?: number;            // tapa de vidrio: 1 puesta, 0 afuera (en el medio, bajando/subiendo)
  heat?: number;           // la resistencia de la hornalla al rojo (0-1)
  stir?: number;           // cuchara de madera revolviendo (0 quieta al costado)
  fond?: number;           // pedacitos dorados pegados al fondo (0-1)
  deglaze?: number;        // el caldo que entra y levanta el fondo (0-1)
  water?: number;          // agua caliente con una pasada de papel (0-1)
  clean?: number;          // la sartén queda limpia y brillante (0-1)
  egg?: number;            // los huevos (cena 6; la 3 y la 9 con huevo arriba)
  flip?: number;           // vuelta y vuelta (0-1)
  extra?: number;          // el agregado de la cena (cebolla, arvejas, pan tostándose, crema, salsa del hash)
  big?: number;            // la sartén GRANDE al lado (0-1)
  burnt?: number;          // la manteca quemándose negra en la grande (0-1)
  door?: number;           // puerta del horno (0-1)
  inOven?: number;         // la sartén en el horno (1) / en la mesa (0)
  bag?: number;            // bolsa del freezer con el sloppy joe chato (0-1)
  page?: string;           // página real del libro abierto ("087")
  plate?: number;          // la cena servida en el plato bueno (0-1)
  plateK?: number;
  dusk?: number;           // 0 tarde clara · 1 las 5 de la tarde de invierno (la vela manda)
};

const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur); return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: lerp(f0, f1, k) };
};
const add = (q: V3, d: V3): V3 => [q[0] + d[0], q[1] + d[1], q[2] + d[2]];

// variante "|n": la misma escena con otra cámara (gira alrededor de lo que mira)
export const sceneOf = (full: string, u: number): Scene => {
  const [name, vs] = full.split("|"), v = parseInt(vs ?? "") || 0;
  const sc = sceneBase(name, u);
  if (!v) return sc;
  const ang = (v % 2 ? 1 : -1) * 0.34 * Math.ceil(v / 2), { p, l } = sc.cam, dx = p[0] - l[0], dz = p[2] - l[2];
  return { ...sc, cam: { p: [l[0] + dx * Math.cos(ang) - dz * Math.sin(ang), p[1] + 0.025 * v, l[2] + dx * Math.sin(ang) + dz * Math.cos(ang)], l, fov: sc.cam.fov * 0.95 } };
};
// lo propio de cada cena mientras se cocina
const cooking = (k: number): Partial<Scene> => ({ k, sizzle: [1, 2, 3, 4, 5, 9, 10].includes(k) ? 0.7 : 0.25, steam: 0.6, egg: [3, 6, 9].includes(k) ? 1 : 0, extra: 1 });
const sceneBase = (name: string, u: number): Scene => {
  const [kind, arg = "", arg2 = ""] = name.split(":");
  const P = PT.pan, k = parseInt(arg) || 0;
  const near = (d: V3, d1: V3, f0 = 36, f1 = 32, dur = 9, l0: V3 = [0, -0.01, 0], l1: V3 = [0, -0.012, 0]) => drift(add(P, d), add(P, d1), add(P, l0), add(P, l1), f0, f1, u, dur);
  if (kind === "wide") {
    if (arg === "night") return { k: 1, steam: 0.4, dusk: 1, plate: 1, plateK: 1, cam: drift([-1.15, 1.32, 1.35], [-0.85, 1.22, 1.1], [0.15, 0.82, -0.25], [0.2, 0.82, -0.3], 42, 38, u, 10) };
    if (arg === "empty") return { k: 0, clean: 1, cam: drift([1.1, 1.35, 1.2], [0.85, 1.25, 1.0], [-0.1, 0.8, -0.2], [-0.12, 0.8, -0.22], 42, 39, u, 10) };
    return { ...cooking(k || 1), heat: 0.6, cam: drift([-1.25, 1.38, 1.45], [-0.95, 1.26, 1.2], [0.3, 0.7, -0.45], [0.32, 0.72, -0.5], 44, 40, u, 10) };
  }
  // la cena en la sartén: 3/4 adelante, cenital, rasante y macro
  if (kind === "pan") return { ...cooking(k), heat: 0.7, cam: near([0.36, 0.4, 0.56], [0.25, 0.31, 0.42]) };
  if (kind === "top") return { ...cooking(k), heat: 0.7, cam: near([0.0, 0.78, 0.16], [0.0, 0.64, 0.1], 40, 36, 10) };
  if (kind === "low") return { ...cooking(k), heat: 0.7, cam: drift(add(P, [-0.44, 0.2, 0.36]), add(P, [0.3, 0.18, 0.4]), add(P, [-0.04, -0.02, 0]), add(P, [0.06, -0.02, 0]), 32, 30, u, 10) };
  if (kind === "macro") return { ...cooking(k), heat: 0.7, cam: near([0.16, 0.27, 0.3], [0.11, 0.21, 0.22], 30, 27, 9, [0.02, -0.005, 0.01], [0.015, -0.008, 0.01]) };
  if (kind === "sizzle") return { ...cooking(k), sizzle: 1.4, steam: 0.9, heat: 1, cam: near([-0.24, 0.24, 0.32], [-0.17, 0.2, 0.24], 32, 28) };
  // la tapa de vidrio baja (o sube con la nube de vapor)
  if (kind === "lid") { const off = arg2 === "off"; const l = off ? 1 - ease((u - 1) / 2) : ease((u - 0.8) / 2.2); return { ...cooking(k), sizzle: 0.2, lid: l, steam: off ? 1.4 : 0.8, heat: 0.4, cam: near([0.3, 0.3, 0.5], [0.22, 0.25, 0.4]) }; }
  if (kind === "flip") return { ...cooking(k), flip: ease((u - 1.2) / 1.1), cam: near([0.26, 0.22, 0.38], [0.2, 0.19, 0.3], 32, 30) };
  if (kind === "stir") return { ...cooking(k), stir: 1, cam: near([0.3, 0.34, 0.46], [0.22, 0.28, 0.36]) };
  // calentar la sartén primero: la resistencia se pone roja y el aire tiembla
  if (kind === "heat") return { k: 0, heat: ease(u / 5), steam: 0.15 * ease(u / 5), cam: near([0.3, 0.2, 0.45], [0.2, 0.16, 0.33], 34, 30, 10, [0, -0.04, 0], [0, -0.04, 0]) };
  // el desglasado: el fondo dorado se levanta con el caldo (la salsa sale de lo que quedó pegado)
  if (kind === "fond") return { k: 0, fond: 1, heat: 0.6, sizzle: 0.3, cam: near([0.0, 0.5, 0.26], [0.0, 0.42, 0.2], 34, 30) };
  if (kind === "deglaze") return { k: 0, fond: 1 - ease((u - 1.5) / 4), deglaze: ease((u - 0.6) / 2.5), heat: 0.6, steam: 1, sizzle: 0.5 * (1 - ease((u - 2) / 3)), cam: near([0.24, 0.36, 0.4], [0.16, 0.3, 0.3]) };
  // agua caliente, una pasada, limpia
  if (kind === "wipe") return { k: 0, water: 1 - ease((u - 4) / 2), clean: ease((u - 3.5) / 3), steam: 0.4 * (1 - ease((u - 4) / 2)), cam: near([-0.2, 0.42, 0.4], [-0.12, 0.34, 0.3]) };
  if (kind === "clean") return { k: 0, clean: 1, cam: near([0.3, 0.5, 0.45], [0.22, 0.42, 0.36], 36, 33, 10) };
  // el error: la sartén grande, la manteca desparramada que se quema negra
  if (kind === "big") return { k: k || 4, big: 1, burnt: ease((u - 0.8) / 5), heat: 0.8, sizzle: 0.4, cam: drift(add(P, [0.2, 0.55, 0.85]), add(P, [0.28, 0.46, 0.72]), add(P, [0.3, 0, -0.06]), add(P, [0.32, 0, -0.07]), 40, 37, u, 10) };
  if (kind === "handle") return { k: 8, cam: drift(add(PT.handle, [0.1, 0.12, 0.24]), add(PT.handle, [0.05, 0.09, 0.18]), PT.handle, add(PT.handle, [-0.03, 0, 0]), 32, 28, u, 9) };
  if (kind === "oven") {
    const op = arg === "out";
    const door = op ? 1 : ease((u - 0.5) / 1.8);
    return { k: 8, door, inOven: op ? 0 : 1, steam: 0.4 + 0.6 * door, dusk: 0.4,
      cam: op ? drift([STOVE.x + 0.1, 0.9, DOOR.z + 1.0], [STOVE.x + 0.03, 0.66, DOOR.z + 0.62], [STOVE.x, 0.38, DOOR.z - 0.2], [STOVE.x, 0.36, DOOR.z - 0.25], 40, 36, u, 9)
        : drift([STOVE.x + 0.12, 1.0, DOOR.z + 1.35], [STOVE.x + 0.05, 0.72, DOOR.z + 0.8], [STOVE.x, 0.36, DOOR.z - 0.1], [STOVE.x, 0.3, DOOR.z - 0.25], 42, 36, u, 7) };
  }
  if (kind === "chair") return { k: 1, steam: 0.3, dusk: 1, cam: drift([0.35, 1.05, 0.75], [0.45, 1.0, 0.6], [CHAIR[0], 0.82, CHAIR[2]], [CHAIR[0], 0.84, CHAIR[2]], 38, 34, u, 10) };
  if (kind === "cloth") return { k: 6, egg: 1, steam: 0.4, cam: drift(add(PT.cross, [0.12, 0.32, 0.34]), add(PT.cross, [0.06, 0.24, 0.24]), PT.cross, add(PT.cross, [0, 0, -0.02]), 34, 30, u, 10) };
  if (kind === "book") return { k: 0, clean: 1, page: arg || "087", cam: drift(add(BOOK, [0.0, 0.5, 0.26]), add(BOOK, [0.0, 0.4, 0.17]), add(BOOK, [0, 0, -0.01]), add(BOOK, [0, 0, -0.005]), 36, 32, u, 10) };
  if (kind === "bag") return { k: 5, bag: ease((u - 0.2) / 2), cam: drift(add(PT.bag, [0.05, 0.42, 0.3]), add(PT.bag, [0.02, 0.33, 0.21]), PT.bag, PT.bag, 36, 33, u, 9) };
  if (kind === "plate") return { k: 0, clean: 1, plate: 1, plateK: k || 1, egg: 1, extra: 1, dusk: 0.6, cam: drift(add(PLATE, [0.25, 0.3, 0.36]), add(PLATE, [0.15, 0.22, 0.26]), add(PLATE, [0, 0.02, 0]), add(PLATE, [0, 0.02, 0]), 36, 32, u, 10) };
  if (kind === "candle") return { k: 0, clean: 1, plate: 1, plateK: k || 10, egg: 1, extra: 1, dusk: 1, cam: drift(add(PLATE, [0.42, 0.34, 0.42]), add(PLATE, [0.3, 0.27, 0.32]), add(PLATE, [-0.02, 0.03, -0.2]), add(PLATE, [-0.02, 0.03, -0.22]), 40, 36, u, 10) };
  return { ...cooking(1), cam: drift([1.2, 1.4, 1.35], [0.9, 1.28, 1.1], [-0.05, 0.82, -0.2], [-0.08, 0.82, -0.25], 42, 38, u, 10) };
};

// cámara a mano virtual (vara 23-oct): balanceo lento sobre la cámara 3D, el mismo en el render y en project() para que las etiquetas sigan clavadas
const RAD = Math.PI / 180;
const mano = (cam: THREE.PerspectiveCamera, t?: number) => {
  if (t === undefined) return;
  const m = manoCam(t, 1, 3); cam.rotateY(m.pan * RAD); cam.rotateX(m.tilt * RAD); cam.rotateZ(m.roll * RAD);
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
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useLorTex = () => useMemo(() => ({
  lino: mk(256, 256, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = (r + c) % 2 ? "#e9e1cf" : "#9c3a32"; g.fillRect(c * 64, r * 64, 64, 64); }
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(80,60,40,${0.06 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 256, rnd(i, 4) * 256, 3, 3); }
  }, [10, 10]),
  wall: mk(256, 256, (g) => {
    g.fillStyle = "#ddd2bc"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(160,140,110,${0.05 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 2 + rnd(i, 5) * 6, 0, 6.3); g.fill(); }
  }, [4, 2]),
  gingham: mk(128, 128, (g) => {
    g.fillStyle = "#fbf3d2"; g.fillRect(0, 0, 128, 128);
    g.fillStyle = "rgba(232,190,40,.55)"; for (let k = 0; k < 8; k++) { g.fillRect(k * 16, 0, 8, 128); g.fillRect(0, k * 16, 128, 8); }
  }, [3, 5]),
  // el mantel del sótano de la iglesia: blanco gastado, puntilla y la crucecita roja bordada en la esquina de adelante
  cloth: mk(1024, 680, (g) => {
    g.fillStyle = "#f3efe4"; g.fillRect(0, 0, 1024, 680);
    for (let y = 0; y < 680; y += 3) { g.fillStyle = `rgba(190,180,160,${0.08 + 0.04 * rnd(y, 1)})`; g.fillRect(0, y, 1024, 1); }
    for (let x = 0; x < 1024; x += 3) { g.fillStyle = "rgba(190,180,160,.05)"; g.fillRect(x, 0, 1, 680); }
    g.fillStyle = "rgba(170,130,80,.10)"; g.beginPath(); g.arc(700, 520, 24, 0, 6.3); g.fill();
    g.strokeStyle = "rgba(170,160,140,.6)"; g.lineWidth = 3; g.strokeRect(14, 14, 996, 652);
    for (let x = 20; x < 1010; x += 16) { g.beginPath(); g.arc(x, 14, 6, 0, Math.PI); g.stroke(); g.beginPath(); g.arc(x, 666, 6, Math.PI, 0); g.stroke(); }
    const cx = 210, cy = 560, u = 7;
    const st = (i: number, j: number) => { g.strokeStyle = "#a3171c"; g.lineWidth = 2.2; const x = cx + i * u, y = cy + j * u; g.beginPath(); g.moveTo(x, y); g.lineTo(x + u, y + u); g.moveTo(x + u, y); g.lineTo(x, y + u); g.stroke(); };
    for (let j = -6; j <= 7; j++) st(0, j);
    for (let i = -4; i <= 4; i++) if (i) st(i, -2);
  }),
  // costras: gratinado, papa con surcos, migas, pan de maíz
  crust: mk(256, 256, (g) => {
    g.fillStyle = "#d9973c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 260; i++) { const r = 2 + rnd(i, 1) * 9; g.fillStyle = rnd(i, 2) > 0.55 ? `rgba(122,58,14,${0.35 + 0.4 * rnd(i, 3)})` : `rgba(245,200,110,${0.35 + 0.4 * rnd(i, 3)})`; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, r, r * (0.6 + rnd(i, 6) * 0.6), rnd(i, 7) * 3, 0, 6.3); g.fill(); }
  }),
  crumbs: mk(256, 256, (g) => {
    g.fillStyle = "#e3c27a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 700; i++) { const r = 1 + rnd(i, 1) * 4; g.fillStyle = rnd(i, 2) > 0.5 ? `rgba(160,98,30,${0.5 * rnd(i, 3) + 0.3})` : `rgba(250,226,160,${0.6})`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, r, r); }
  }),
  potato: mk(256, 256, (g) => {
    g.fillStyle = "#f2dfae"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 16; k++) { const y = k * 16; g.fillStyle = "rgba(196,128,44,.75)"; g.fillRect(0, y, 256, 4); g.fillStyle = "rgba(255,246,214,.6)"; g.fillRect(0, y + 7, 256, 3); }
  }),
  egg: mk(256, 256, (g) => {
    g.fillStyle = "#f1cf5c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { g.fillStyle = rnd(i, 1) > 0.5 ? "rgba(214,110,120,.9)" : "rgba(80,140,60,.85)"; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 6 + rnd(i, 4) * 8, 5 + rnd(i, 5) * 6); }
    for (let i = 0; i < 90; i++) { g.fillStyle = "rgba(200,140,40,.35)"; g.beginPath(); g.arc(rnd(i, 6) * 256, rnd(i, 7) * 256, 3 + rnd(i, 8) * 6, 0, 6.3); g.fill(); }
  }),
  ziti: mk(256, 256, (g) => {
    g.fillStyle = "#a8321c"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(250,240,215,${0.6 + 0.3 * rnd(i, 1)})`; g.beginPath(); g.ellipse(rnd(i, 2) * 256, rnd(i, 3) * 256, 10 + rnd(i, 4) * 16, 7 + rnd(i, 5) * 10, rnd(i, 6) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(150,80,20,.6)"; g.beginPath(); g.arc(rnd(i, 7) * 256, rnd(i, 8) * 256, 3 + rnd(i, 9) * 5, 0, 6.3); g.fill(); }
  }),
  // el metal oscuro del molde viejo, con el uso
  tin: mk(512, 512, (g) => {
    g.fillStyle = "#3a3a3c"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1600; i++) { const v = 40 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v + 10},${v},${v - 6},.35)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2 + rnd(i, 4) * 6, 1 + rnd(i, 5) * 2); }
    for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(90,52,20,${0.15 + 0.2 * rnd(i, 6)})`; g.beginPath(); g.arc(rnd(i, 7) * 512, rnd(i, 8) * 512, 6 + rnd(i, 9) * 18, 0, 6.3); g.fill(); }
  }),
  // etiqueta de cinta con marcador para la bolsa del freezer
  tape: mk(512, 128, (g) => {
    g.fillStyle = "#f1ecdc"; g.fillRect(0, 0, 512, 128);
    g.fillStyle = "#1e2a6a"; g.font = "bold 58px 'Comic Sans MS', cursive"; g.fillText("SLOPPY JOE", 18, 72); g.font = "bold 40px 'Comic Sans MS', cursive"; g.fillText("10/26", 340, 110);
  }),
}), []);

// texturas propias de la sartén: hierro curado, arroz, salsa de tomate, carne picada
const usePanTex = () => useMemo(() => ({
  iron: mk(512, 512, (g) => {
    g.fillStyle = "#232220"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2200; i++) { const v = 26 + rnd(i, 1) * 30; g.fillStyle = `rgba(${v + 8},${v + 2},${v - 4},.4)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 1 + rnd(i, 4) * 4, 1 + rnd(i, 5) * 2); }
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(70,40,18,${0.12 + 0.15 * rnd(i, 6)})`; g.beginPath(); g.arc(rnd(i, 7) * 512, rnd(i, 8) * 512, 10 + rnd(i, 9) * 30, 0, 6.3); g.fill(); }
  }),
  rice: mk(256, 256, (g) => {
    g.fillStyle = "#e9dcbc"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { g.fillStyle = rnd(i, 1) > 0.15 ? "rgba(252,248,236,.9)" : "rgba(200,150,70,.8)"; g.save(); g.translate(rnd(i, 2) * 256, rnd(i, 3) * 256); g.rotate(rnd(i, 4) * 3); g.fillRect(-4, -1.5, 8, 3); g.restore(); }
  }),
  tomato: mk(256, 256, (g) => {
    g.fillStyle = "#a82a16"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 160; i++) { g.fillStyle = rnd(i, 1) > 0.5 ? "rgba(220,80,40,.55)" : "rgba(90,20,10,.4)"; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 2 + rnd(i, 4) * 7, 0, 6.3); g.fill(); }
    for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(60,110,40,.7)"; g.fillRect(rnd(i, 5) * 256, rnd(i, 6) * 256, 3, 2); }
  }),
  mince: mk(256, 256, (g) => {
    g.fillStyle = "#6a2a16"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 700; i++) { const r = 2 + rnd(i, 1) * 5; g.fillStyle = rnd(i, 2) > 0.5 ? "rgba(140,60,30,.7)" : "rgba(50,18,8,.7)"; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, r, 0, 6.3); g.fill(); }
  }),
}), []);
const useTX = () => { const a = useLorTex(), b = usePanTex(); return useMemo(() => ({ ...a, ...b }), [a, b]); };
type TX = ReturnType<typeof useTX>;

// ---------------- páginas REALES del libro (public/lcf2510b/book_p###.jpg) ----------------
export const PAGES = ["003", "004", "032", "068", "069", "085", "087", "088", "089", "091", "092", "094", "095", "114", "153", "162", "163"];
const usePages = () => {
  const [h] = useState(() => delayRender("páginas del libro"));
  return useMemo(() => {
    let n = PAGES.length;
    const done = () => { n -= 1; if (n === 0) continueRender(h); };
    const L = new THREE.TextureLoader();
    return Object.fromEntries(PAGES.map((pg) => {
      const tx = L.load(staticFile(`lcf2510b/book_p${pg}.jpg`), done, undefined, done);
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return [pg, tx];
    })) as Record<string, THREE.Texture>;
  }, [h]);
};

// ---------------- geometrías ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.6, m = 0, e, ei = 0, cast = true, map, rad = 0.015, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}>
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} />
  </mesh>
);
const Pts: React.FC<{ pts: number[]; col: string; size: number; o: number; map?: Tx; add?: boolean }> = ({ pts, col, size, o, map, add: ad }) => {
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return <points geometry={geo} frustumCulled={false}><pointsMaterial color={col} size={size} transparent opacity={o} depthWrite={false} map={map} alphaMap={map} sizeAttenuation blending={ad ? THREE.AdditiveBlending : THREE.NormalBlending} /></points>;
};
const DOME = (() => {
  const g = new THREE.SphereGeometry(1, 36, 14, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setY(i, y + 0.12 * y * Math.sin(x * 19 + z * 7) * Math.cos(z * 15 - x * 4)); }
  g.computeVertexNormals(); return g;
})();

// ---------------- la sartén de 8" (perfil macizo: afuera → borde → adentro) ----------------
const PAN_GEO = new THREE.LatheGeometry([[0, 0], [PR0, 0], [PR0 + 0.006, 0.004], [PR1, PD], [PR1 + 0.004, PD + 0.002], [PR1 - 0.004, PD + 0.002], [PR0 - 0.002, PB + 0.004], [PR0 - 0.008, PB], [0, PB]].map(([x, y]) => new THREE.Vector2(x, y)), 72);
const BIG_GEO = new THREE.LatheGeometry([[0, 0], [0.13, 0], [0.136, 0.004], [0.152, 0.05], [0.156, 0.052], [0.148, 0.052], [0.128, PB + 0.004], [0.122, PB], [0, PB]].map(([x, y]) => new THREE.Vector2(x, y)), 72);
const disc = (r: number, h: number) => new THREE.CylinderGeometry(r, r, h, 48);
// tira de cebolla: un arco finito
const ONION = new THREE.TorusGeometry(0.014, 0.0018, 6, 18, Math.PI * 0.9);
const Spatter: React.FC<{ t: number; n: number; r: number; o: number; fl: THREE.Texture; y0?: number }> = ({ t, n, r, o, fl, y0 = PB + 0.01 }) => {
  const pts: number[] = [];
  for (let i = 0; i < n; i++) { const ph = (t * (1.6 + rnd(i, 1) * 2.4) + rnd(i, 2)) % 1, a = rnd(i, 3) * 6.28, rr = r * Math.sqrt(rnd(i, 4)); pts.push(Math.cos(a) * rr * (1 + ph * 0.3), y0 + Math.sin(ph * Math.PI) * (0.012 + rnd(i, 5) * 0.03), Math.sin(a) * rr * (1 + ph * 0.3)); }
  return <Pts pts={pts} col="#fff1c8" size={0.0035} o={o} map={fl} add />;
};
const Steam: React.FC<{ t: number; st: number; r: number; fl: THREE.Texture; y0?: number }> = ({ t, st, r, fl, y0 = PB + 0.02 }) => {
  const pts: number[] = [];
  for (let i = 0; i < 70; i++) { const ph = (t * (0.14 + rnd(i, 1) * 0.12) + rnd(i, 2)) % 1, a = rnd(i, 3) * 6.28, rr = r * Math.sqrt(rnd(i, 4)); pts.push(Math.cos(a) * rr * (1 + ph), y0 + ph * 0.2, Math.sin(a) * rr * (1 + ph) + Math.sin(t * 0.7 + i) * 0.01 * ph); }
  return <Pts pts={pts} col="#f6f3ee" size={0.07} o={0.05 * st} map={fl} />;
};
const Egg: React.FC<{ p: V3; e: number; s?: number }> = ({ p, e, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <mesh scale={[1, 0.18, 0.86]}><sphereGeometry args={[0.024, 28, 12]} /><meshStandardMaterial color={e > 0.5 ? "#fbf8f1" : "#e8ecea"} roughness={0.25} transparent opacity={0.55 + 0.45 * e} /></mesh>
    <mesh position={[0.002, 0.004, 0]} scale={[1, 0.62, 1]}><sphereGeometry args={[0.0095, 20, 12]} /><meshStandardMaterial color={e > 0.7 ? "#f0a21c" : "#f4b52a"} roughness={0.12} /></mesh>
  </group>
);

// ---------------- UNA cena en la sartén (base en y=0, sobre el fondo) ----------------
const Food: React.FC<{ k: number; t: number; sc: Scene; tx: TX; plate?: boolean }> = ({ k, t, sc, tx, plate }) => {
  const e = sc.egg ?? 0, x = sc.extra ?? 0, fp = sc.flip ?? 0;
  const flipRot = Math.sin(fp * Math.PI) * 0.9, flipY = Math.sin(fp * Math.PI) * 0.03;
  const sauce = (c: string, r = 0.084, h = 0.006, map?: THREE.Texture, rough = 0.18) => !plate || r < 0.07
    ? <mesh geometry={disc(r, h)} position={[0, h / 2, 0]} receiveShadow><meshStandardMaterial color={c} map={map} roughness={rough} /></mesh>
    : <mesh geometry={disc(0.07, h)} position={[0, h / 2, 0]} receiveShadow><meshStandardMaterial color={c} map={map} roughness={rough} /></mesh>;
  if (k === 1) return ( // hamburger steak con la marca del pulgar y cebolla en salsa
    <group>
      {sauce("#6e4020", 0.084, 0.006, undefined, 0.12)}
      <group position={[0, 0.006 + flipY, 0]} rotation={[flipRot, 0, 0]}>
        <mesh geometry={disc(0.042, 0.013)} position={[0, 0.0065, 0]} castShadow><meshStandardMaterial color="#5a2c18" map={tx.crust} roughness={0.55} /></mesh>
        <mesh position={[0, 0.0132, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.009, 24]} /><meshStandardMaterial color="#3a1a0c" roughness={0.6} /></mesh>
      </group>
      {x > 0.5 && Array.from({ length: 16 }, (_, i) => <mesh key={i} geometry={ONION} position={[Math.cos(i * 2.4) * (0.048 + rnd(i, 1) * 0.026), 0.008, Math.sin(i * 2.4) * (0.048 + rnd(i, 1) * 0.026)]} rotation={[-Math.PI / 2, 0, rnd(i, 2) * 6]}><meshStandardMaterial color="#c08a44" roughness={0.3} /></mesh>)}
    </group>
  );
  if (k === 2) return ( // el cutlet finito empanado
    <group position={[0, 0.004 + flipY, 0]} rotation={[flipRot, 0.3, 0]}>
      <mesh scale={[0.06, 0.007, 0.038]} castShadow><sphereGeometry args={[1, 32, 12]} /><meshStandardMaterial color="#c88a36" map={tx.crumbs} roughness={0.65} /></mesh>
      {!plate && <mesh geometry={disc(0.084, 0.002)} position={[0, -0.003, 0]}><meshStandardMaterial color="#d9b04a" roughness={0.05} transparent opacity={0.35} /></mesh>}
    </group>
  );
  if (k === 3) return ( // papas fritas con cebolla, huevo frito arriba
    <group>
      {Array.from({ length: 30 }, (_, i) => { const a = i * 2.39996, r = 0.075 * Math.sqrt((i + 0.5) / 30); return <mesh key={i} geometry={disc(0.014 + rnd(i, 1) * 0.004, 0.005)} position={[Math.cos(a) * r, 0.003 + rnd(i, 2) * 0.006, Math.sin(a) * r]} rotation={[(rnd(i, 3) - 0.5) * 0.5, 0, (rnd(i, 4) - 0.5) * 0.5]} castShadow><meshStandardMaterial color={rnd(i, 5) > 0.5 ? "#d99a3a" : "#e8b85a"} map={tx.crust} roughness={0.45} /></mesh>; })}
      {Array.from({ length: 14 }, (_, i) => <mesh key={"o" + i} position={[(rnd(i, 6) - 0.5) * 0.13, 0.01, (rnd(i, 7) - 0.5) * 0.13]}><boxGeometry args={[0.008, 0.002, 0.004]} /><meshStandardMaterial color="#a8682a" roughness={0.4} /></mesh>)}
      {e > 0.01 && <Egg p={[0.006, 0.014, 0]} e={e} s={1.15} />}
    </group>
  );
  if (k === 4) return ( // filete de pescado en manteca con limón (y las arvejas en la misma manteca)
    <group>
      {!plate && <mesh geometry={disc(0.07, 0.003)} position={[0, 0.0015, 0]}><meshStandardMaterial color="#f0c24a" roughness={0.04} transparent opacity={0.7} /></mesh>}
      <group position={[0, 0.005 + flipY, 0]} rotation={[flipRot, -0.4, 0]}>
        <mesh scale={[0.062, 0.009, 0.028]} castShadow><sphereGeometry args={[1, 32, 12]} /><meshStandardMaterial color="#e9cf98" map={tx.crumbs} roughness={0.5} /></mesh>
      </group>
      {x > 0.5 && Array.from({ length: 26 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = 0.05 + rnd(i, 2) * 0.026; return <mesh key={i} position={[Math.cos(a) * r, 0.004, Math.sin(a) * r]}><sphereGeometry args={[0.0034, 10, 8]} /><meshStandardMaterial color="#6aa63a" roughness={0.25} /></mesh>; })}
      {!plate && <mesh position={[0.06, 0.008, -0.03]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1]}><sphereGeometry args={[0.016, 20, 12, 0, Math.PI]} /><meshStandardMaterial color="#f2d23a" roughness={0.35} side={THREE.DoubleSide} /></mesh>}
    </group>
  );
  if (k === 5) return ( // sloppy joe: la carne con salsa y los panes tostándose al costado
    <group>
      <mesh geometry={disc(plate ? 0.04 : 0.07, 0.012)} position={[plate ? 0.02 : 0, 0.006, 0]} castShadow><meshStandardMaterial color="#8a2a16" map={tx.mince} roughness={0.25} /></mesh>
      {x > 0.5 && [-1, 1].map((s) => <mesh key={s} geometry={DOME} position={plate ? [s * 0.045 - 0.02, 0.004, 0] : [s * 0.035, 0.016, 0.06]} scale={[0.03, plate ? 0.016 : 0.012, 0.03]} rotation={plate ? [0, 0, 0] : [Math.PI, 0, 0]} castShadow><meshStandardMaterial color={plate ? "#d9a050" : "#c88a3a"} map={tx.crust} roughness={0.6} /></mesh>)}
    </group>
  );
  if (k === 6) return ( // huevos en salsa de tomate, en dos nidos
    <group>
      {sauce("#a82a16", 0.084, 0.01, tx.tomato, 0.22)}
      {[-1, 1].map((s) => <Egg key={s} p={[s * 0.032, 0.011, s * 0.01]} e={e} />)}
    </group>
  );
  if (k === 7) return ( // muslos con hongos y la salsa con crema
    <group>
      {sauce(x > 0.5 ? "#d4b892" : "#8a5a32", 0.084, 0.007, undefined, 0.15)}
      {[-1, 1].map((s) => <mesh key={s} geometry={DOME} position={[s * 0.03, 0.006, -s * 0.012]} scale={[0.034, 0.014, 0.026]} rotation={[0, s * 0.6, 0]} castShadow><meshStandardMaterial color="#9a5a2a" map={tx.crust} roughness={0.4} /></mesh>)}
      {Array.from({ length: 12 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = 0.04 + rnd(i, 2) * 0.034; return <mesh key={i} position={[Math.cos(a) * r, 0.008, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, a]}><circleGeometry args={[0.008, 16, 0, Math.PI]} /><meshStandardMaterial color="#7a5636" roughness={0.4} side={THREE.DoubleSide} /></mesh>; })}
    </group>
  );
  if (k === 8) return ( // la frittata inflada y dorada
    <group>
      <mesh geometry={disc(plate ? 0.06 : 0.084, 0.018)} position={[0, 0.009, 0]} castShadow><meshStandardMaterial color="#e9b844" map={tx.egg} roughness={0.5} /></mesh>
      <mesh geometry={DOME} position={[0, 0.018, 0]} scale={[plate ? 0.058 : 0.082, 0.006, plate ? 0.058 : 0.082]}><meshStandardMaterial color="#d9a13a" map={tx.egg} roughness={0.45} /></mesh>
    </group>
  );
  if (k === 9) return ( // el hash de carne asada y papas, crocante, con huevo arriba y la salsa
    <group>
      <mesh geometry={disc(plate ? 0.065 : 0.08, 0.01)} position={[0, 0.005, 0]}><meshStandardMaterial color="#5e3418" map={tx.mince} roughness={0.6} /></mesh>
      {Array.from({ length: 36 }, (_, i) => { const a = i * 2.39996, r = 0.07 * Math.sqrt((i + 0.5) / 36); return <mesh key={i} position={[Math.cos(a) * r, 0.012, Math.sin(a) * r]} rotation={[rnd(i, 1), rnd(i, 2), 0]} castShadow><boxGeometry args={[0.011, 0.008, 0.01]} /><meshStandardMaterial color={i % 3 ? "#7a3e1c" : "#d9a04a"} map={tx.crust} roughness={0.55} /></mesh>; })}
      {x > 0.5 && <mesh geometry={disc(0.03, 0.002)} position={[-0.03, 0.017, 0.02]}><meshStandardMaterial color="#6a3a18" roughness={0.08} /></mesh>}
      {e > 0.01 && <Egg p={[0.01, 0.018, -0.006]} e={e} s={1.1} />}
    </group>
  );
  if (k === 10) return ( // el arroz frito: granos sueltos, arvejas, zanahoria y huevo
    <group>
      <mesh geometry={disc(plate ? 0.06 : 0.08, 0.012)} position={[0, 0.006, 0]}><meshStandardMaterial color="#eadcbc" map={tx.rice} roughness={0.55} /></mesh>
      {Array.from({ length: 34 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = 0.065 * Math.sqrt(rnd(i, 2)), c = i % 3 === 0 ? "#e8792a" : i % 3 === 1 ? "#6aa63a" : "#f2c84a"; return <mesh key={i} position={[Math.cos(a) * r, 0.013, Math.sin(a) * r]}>{i % 3 === 0 ? <boxGeometry args={[0.005, 0.005, 0.005]} /> : <sphereGeometry args={[0.0032, 10, 8]} />}<meshStandardMaterial color={c} roughness={0.35} /></mesh>; })}
    </group>
  );
  return null;
};

// ---------------- LA SARTÉN sobre su hornalla ----------------
const Skillet: React.FC<{ t: number; sc: Scene; tx: TX; fl: THREE.Texture; p?: V3; s?: number }> = ({ t, sc, tx, fl, p = PAN, s = PS }) => {
  const heat = sc.heat ?? 0, lid = sc.lid ?? 0, st = sc.steam ?? 0, sz = sc.sizzle ?? 0, clean = sc.clean ?? 0, fond = sc.fond ?? 0, dg = sc.deglaze ?? 0, wt = sc.water ?? 0, stir = sc.stir ?? 0;
  const k = sc.k ?? 0, inOven = p !== PAN;
  const shimmer = heat > 0.4 && k === 0 ? 0.002 * Math.sin(t * 9) : 0;
  return (
    <group position={p} scale={[s, s, s]}>
      {/* hornalla eléctrica de un fuego: la resistencia se pone al rojo */}
      {!inOven && <>
        <mesh position={[0, HB / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.125, 0.13, HB, 48]} /><meshStandardMaterial color="#1b1b1c" roughness={0.45} metalness={0.4} /></mesh>
        {[0.04, 0.06, 0.08].map((r) => <mesh key={r} position={[0, HB + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r - 0.004, r, 48]} /><meshStandardMaterial color="#2a2a2a" emissive="#ff3a10" emissiveIntensity={1.6 * heat} roughness={0.5} toneMapped={heat < 0.1} /></mesh>)}
        <mesh position={[0.11, HB * 0.6, 0.06]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.012, 20]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.25} /></mesh>
        {heat > 0.05 && <pointLight position={[0, HB, 0.14]} intensity={0.25 * heat} distance={0.5} color="#ff5a20" />}
      </>}
      <group position={[0, inOven ? 0 : HB + shimmer, 0]}>
        {/* la sartén de hierro, con el mango de metal (va al horno) */}
        <mesh geometry={PAN_GEO} castShadow receiveShadow><meshStandardMaterial map={tx.iron} color="#3a3836" roughness={0.42 - 0.18 * clean} metalness={0.55} envMapIntensity={0.6 + 0.6 * clean} /></mesh>
        <group position={[PR1 + 0.002, PD - 0.006, 0]} rotation={[0, 0, 0.18]}>
          <Box p={[0.07, 0, 0]} s={[0.14, 0.01, 0.026]} c="#2c2b29" m={0.6} r={0.4} rad={0.004} />
          <mesh position={[0.128, 0.0052, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.006, 20]} /><meshBasicMaterial color="#0a0a0a" /></mesh>
        </group>
        <mesh position={[-PR1 - 0.012, PD - 0.004, 0]} rotation={[0, 0, -0.25]}><boxGeometry args={[0.022, 0.006, 0.03]} /><meshStandardMaterial color="#2c2b29" metalness={0.6} roughness={0.4} /></mesh>
        {/* el fondo: los pedacitos dorados pegados (la salsa) */}
        {fond > 0.01 && Array.from({ length: 60 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = PR0 * 0.92 * Math.sqrt(rnd(i, 2)); return <mesh key={"f" + i} position={[Math.cos(a) * r, PB + 0.0006, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.002 + rnd(i, 3) * 0.004, 8]} /><meshStandardMaterial color={i % 2 ? "#6a3410" : "#8a4a1a"} roughness={0.6} transparent opacity={fond} /></mesh>; })}
        {/* el caldo que levanta el fondo y se vuelve salsa */}
        {dg > 0.01 && <mesh geometry={disc(PR0 + 0.006 * dg, 0.002 + 0.008 * dg)} position={[0, PB + 0.001 + 0.004 * dg, 0]}><meshStandardMaterial color={lerp(0, 1, dg) > 0.6 ? "#7a4a22" : "#a87a4a"} roughness={0.08} transparent opacity={0.5 + 0.4 * dg} /></mesh>}
        {/* agua caliente: una pasada y queda limpia */}
        {wt > 0.01 && <>
          <mesh geometry={disc(PR0 + 0.004, 0.006)} position={[0, PB + 0.003, 0]}><meshPhysicalMaterial color="#b9cdd6" roughness={0.03} transparent opacity={0.35 * wt} depthWrite={false} /></mesh>
          <Pts pts={Array.from({ length: 120 }, (_, i) => [Math.cos(rnd(i, 1) * 6.28) * PR0 * Math.sqrt(rnd(i, 2)), PB + 0.007 + rnd(i, 3) * 0.002, Math.sin(rnd(i, 1) * 6.28) * PR0 * Math.sqrt(rnd(i, 2))]).flat()} col="#ffffff" size={0.004} o={0.6 * wt} map={fl} />
        </>}
        {/* la cena */}
        {k > 0 && <group position={[0, PB, 0]}><Food k={k} t={t} sc={sc} tx={tx} /></group>}
        {/* cuchara de madera: revuelve o descansa apoyada en el borde */}
        {(stir > 0 || k === 9) && (() => { const a = stir > 0 ? t * 2.2 : 0.6, r = stir > 0 ? 0.04 : 0; return (
          <group position={[Math.cos(a) * r + (stir > 0 ? 0 : 0.16), stir > 0 ? PB + 0.012 : PD + 0.004, Math.sin(a) * r + (stir > 0 ? 0 : 0.08)]} rotation={[0, stir > 0 ? -a : -0.5, stir > 0 ? 1.0 : 0.05]}>
            <mesh position={[0, 0.0, 0]} scale={[0.02, 0.004, 0.014]}><sphereGeometry args={[1, 20, 10]} /><meshStandardMaterial color="#c49a64" roughness={0.7} /></mesh>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.004, 0.005, 0.18, 12]} /><meshStandardMaterial color="#c49a64" roughness={0.7} /></mesh>
          </group>); })()}
        {/* la tapa de vidrio */}
        {lid > 0.01 && <group position={[0, PD + 0.002 + (1 - lid) * 0.16, (1 - lid) * 0.05]} rotation={[(1 - lid) * -0.5, 0, 0]}>
          <mesh geometry={DOME} scale={[PR1 + 0.002, 0.04, PR1 + 0.002]}><meshPhysicalMaterial color="#e4eef2" roughness={0.04} metalness={0} transparent opacity={0.22} depthWrite={false} side={THREE.DoubleSide} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[PR1 + 0.002, 0.0026, 8, 72]} /><meshStandardMaterial color="#cfd4d8" metalness={1} roughness={0.2} /></mesh>
          <mesh position={[0, 0.043, 0]}><cylinderGeometry args={[0.012, 0.01, 0.012, 20]} /><meshStandardMaterial color="#222" roughness={0.5} /></mesh>
          {/* gotitas de condensación */}
          {lid > 0.6 && <Pts pts={Array.from({ length: 80 }, (_, i) => { const a = rnd(i, 1) * 6.28, q = 0.2 + rnd(i, 2) * 0.75; return [Math.cos(a) * (PR1 - 0.004) * Math.sqrt(1 - q * q), 0.04 * q, Math.sin(a) * (PR1 - 0.004) * Math.sqrt(1 - q * q)]; }).flat()} col="#ffffff" size={0.003} o={0.5} map={fl} />}
        </group>}
        {sz > 0.02 && lid < 0.9 && <Spatter t={t} n={Math.round(60 * sz)} r={PR0 * 0.9} o={Math.min(1, 0.7 * sz)} fl={fl} />}
        {st > 0.02 && <Steam t={t} st={st * (lid > 0.9 ? 0.3 : 1)} r={PR0 * 0.7} fl={fl} y0={PB + 0.02 + (lid > 0.9 ? PD : 0)} />}
      </group>
    </group>
  );
};

// la sartén GRANDE de 12": la manteca desparramada se quema negra y humea (el error)
const BigPan: React.FC<{ t: number; sc: Scene; fl: THREE.Texture }> = ({ t, sc, fl }) => {
  const b = sc.burnt ?? 0, s = PS * 0.95;
  const smoke: number[] = [];
  if (b > 0.3) for (let i = 0; i < 80; i++) { const ph = (t * (0.18 + rnd(i, 1) * 0.1) + rnd(i, 2)) % 1, a = rnd(i, 3) * 6.28, r = 0.12 * Math.sqrt(rnd(i, 4)); smoke.push(Math.cos(a) * r * (1 + ph), 0.02 + ph * 0.25, Math.sin(a) * r * (1 + ph)); }
  return (
    <group position={BIG} scale={[s, s, s]}>
      <mesh geometry={BIG_GEO} castShadow receiveShadow><meshStandardMaterial color="#4a4846" roughness={0.38} metalness={0.7} /></mesh>
      <group position={[0.152, 0.044, 0]} rotation={[0, 0, 0.16]}><Box p={[0.09, 0, 0]} s={[0.18, 0.012, 0.03]} c="#1a1a1a" r={0.6} rad={0.005} /></group>
      <mesh geometry={disc(0.12, 0.0012)} position={[0, PB + 0.0008, 0]}><meshStandardMaterial color={b > 0.55 ? "#2a1608" : "#e9b64a"} roughness={0.1} transparent opacity={0.65} /></mesh>
      {Array.from({ length: 50 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = 0.115 * Math.sqrt(rnd(i, 2)); return <mesh key={i} position={[Math.cos(a) * r, PB + 0.0015, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.004 + rnd(i, 3) * 0.007, 10]} /><meshStandardMaterial color="#120a04" roughness={0.8} transparent opacity={cl((b - rnd(i, 4) * 0.6) * 2)} /></mesh>; })}
      <group position={[0.02, PB, -0.02]} scale={[0.85, 0.85, 0.85]}><mesh scale={[0.062, 0.009, 0.028]} rotation={[0, -0.4, 0]}><sphereGeometry args={[1, 32, 12]} /><meshStandardMaterial color={b > 0.7 ? "#6a4a2a" : "#e9cf98"} roughness={0.5} /></mesh></group>
      {smoke.length > 0 && <Pts pts={smoke} col="#5a5550" size={0.09} o={0.07 * b} map={fl} />}
    </group>
  );
};

// mantel con caída de verdad
const clothGeo = (w: number, d: number, drop: number) => {
  const g = new THREE.PlaneGeometry(w + 2 * drop, d + 2 * drop, 90, 60);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const ox = Math.max(0, Math.abs(x) - w / 2), oy = Math.max(0, Math.abs(y) - d / 2), o = Math.max(ox, oy);
    if (o <= 0) continue;
    const fold = 0.012 * Math.min(1, o / 0.08) * Math.sin((ox > oy ? y : x) * 46 + (ox > oy ? 1 : 2));
    p.setX(i, ox > 0 ? Math.sign(x) * (w / 2 + 0.006 + (ox >= oy ? fold : 0)) : x);
    p.setY(i, oy > 0 ? Math.sign(y) * (d / 2 + 0.006 + (oy > ox ? fold : 0)) : y);
    p.setZ(i, -o + 0.002);
  }
  g.computeVertexNormals(); return g;
};
const CLOTH = clothGeo(1.3, 0.86, 0.26);

// el libro abierto en la página real
const Book: React.FC<{ page: THREE.Texture }> = ({ page }) => {
  const BW = 0.15, BD = 0.2;
  return (
    <group position={BOOK} rotation={[0, -0.12, 0]}>
      <Box p={[-BW / 2, 0.006, 0]} s={[BW, 0.012, BD]} c="#f4efe2" r={0.8} rad={0.002} />
      <Box p={[BW / 2, 0.006, 0]} s={[BW, 0.012, BD]} c="#f4efe2" r={0.8} rad={0.002} />
      <Box p={[0, 0.002, 0]} s={[BW * 2 + 0.01, 0.004, BD + 0.008]} c="#4b2a6a" r={0.5} rad={0.0015} />
      <mesh position={[BW / 2, 0.0126, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshBasicMaterial map={page} color="#e9e4d9" toneMapped={false} /></mesh>
      <mesh position={[-BW / 2, 0.0126, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial color="#f1ece0" roughness={0.85} /></mesh>
    </group>
  );
};

// la cocina blanca de los 50: la puerta del horno baja sobre su bisagra; adentro, el resplandor y otro molde
const Stove: React.FC<{ t: number; sc: Scene; tx: TX; fl: THREE.Texture }> = ({ t, sc, tx, fl }) => {
  const door = sc.door ?? 0, { x, z, w, h, d } = STOVE;
  const heat: number[] = [];
  if (door > 0.05) for (let i = 0; i < 160; i++) { const ph = (t * (0.25 + rnd(i, 1) * 0.2) + rnd(i, 2)) % 1; heat.push(x + (rnd(i, 3) - 0.5) * 0.4, DOOR.y0 + DOOR.h * 0.8 + ph * 0.5, DOOR.z + 0.04 + ph * 0.25); }
  return (
    <group>
      {/* cuerpo armado alrededor del HUECO del horno (así la puerta abierta deja ver adentro) */}
      <Box p={[x, DOOR.y0 / 2, z]} s={[w, DOOR.y0, d]} c="#f4f2ec" r={0.18} rad={0.02} />
      <Box p={[x, (DOOR.y0 + DOOR.h + h) / 2, z]} s={[w, h - DOOR.y0 - DOOR.h, d]} c="#f4f2ec" r={0.18} rad={0.02} />
      {[-1, 1].map((sx) => <Box key={sx} p={[x + sx * (w + DOOR.w) / 4, DOOR.y0 + DOOR.h / 2, z]} s={[(w - DOOR.w) / 2, DOOR.h, d]} c="#f4f2ec" r={0.18} rad={0.01} />)}
      <mesh position={[x, DOOR.y0 + DOOR.h / 2, z - 0.02]}><boxGeometry args={[DOOR.w, DOOR.h, d - 0.04]} /><meshStandardMaterial color="#2a1c14" roughness={0.7} side={THREE.BackSide} emissive="#ff6a1a" emissiveIntensity={0.12 * door} /></mesh>
      <Box p={[x, h + 0.16, z - d / 2 + 0.03]} s={[w, 0.32, 0.05]} c="#f4f2ec" r={0.2} rad={0.02} />
      {[-0.2, 0.2].map((dx) => [-0.12, 0.1].map((dz) => <mesh key={dx + "" + dz} position={[x + dx, h + 0.006, z + dz]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.075, 32]} /><meshStandardMaterial color="#1c1c1c" roughness={0.5} /></mesh>))}
      {[-0.25, -0.12, 0.12, 0.25].map((dx) => <mesh key={dx} position={[x + dx, h - 0.06, z + d / 2 + 0.012]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.02, 20]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.2} /></mesh>)}
      {/* cavidad del horno, encendida */}
      {door > 0.02 && <>
        <pointLight position={[x, DOOR.y0 + DOOR.h / 2, DOOR.z + 0.05]} intensity={0.9 * door} distance={1.6} decay={1.6} color="#ff9a4a" />
        <mesh position={[x, DOOR.y0 + DOOR.h - 0.04, DOOR.z - 0.15]}><boxGeometry args={[DOOR.w - 0.06, 0.008, 0.008]} /><meshBasicMaterial color="#ff5a1a" toneMapped={false} /></mesh>
        <mesh position={[x, DOOR.y0 + 0.03, DOOR.z - 0.15]}><boxGeometry args={[DOOR.w - 0.06, 0.008, 0.008]} /><meshBasicMaterial color="#ff5a1a" toneMapped={false} /></mesh>
      </>}
      {(sc.inOven ?? 0) > 0.5 && <Skillet t={t} sc={sc} tx={tx} fl={fl} p={[x, DOOR.y0 + 0.1, DOOR.z - 0.24]} s={1.15} />}
      {/* la puerta, bisagra abajo */}
      <group position={[x, DOOR.y0, DOOR.z]} rotation={[door * 1.45, 0, 0]}>
        <Box p={[0, DOOR.h / 2, 0.012]} s={[DOOR.w, DOOR.h, 0.024]} c="#f6f4ee" r={0.15} rad={0.01} />
        <mesh position={[0, DOOR.h * 0.58, 0.0245]}><planeGeometry args={[DOOR.w * 0.62, DOOR.h * 0.36]} /><meshStandardMaterial color="#1a1410" roughness={0.1} metalness={0.3} emissive="#ff7a2a" emissiveIntensity={0.08} /></mesh>
        <mesh position={[0, DOOR.h - 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.011, 0.011, DOOR.w * 0.8, 16]} /><meshStandardMaterial color="#e8ecf0" metalness={1} roughness={0.12} /></mesh>
      </group>
      {heat.length > 0 && <Pts pts={heat} col="#fff2e0" size={0.12} o={0.06 * door} map={fl} />}
    </group>
  );
};

// la silla de Harold
const Chair: React.FC = () => (
  <group position={CHAIR} rotation={[0, -Math.PI / 2, 0]}>
    <Box p={[0, 0.46, 0]} s={[0.42, 0.04, 0.4]} c="#7a5236" r={0.55} rad={0.01} />
    {[[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]].map(([a, b], i) => <Box key={i} p={[a, 0.23, b]} s={[0.035, 0.46, 0.035]} c="#6a4630" r={0.6} rad={0.008} />)}
    {[-0.18, 0.18].map((a, i) => <Box key={"p" + i} p={[a, 0.72, 0.18]} s={[0.035, 0.52, 0.035]} c="#6a4630" r={0.6} rad={0.008} />)}
    {[0.62, 0.78, 0.94].map((y, i) => <Box key={"s" + i} p={[0, y, 0.18]} s={[0.38, 0.05, 0.025]} c="#7a5236" r={0.55} rad={0.008} />)}
  </group>
);

export const LorettaWorld: React.FC<{ t: number; sc: Scene }> = ({ t, sc }) => {
  const tx = useTX(), ft = useTextures(), pg = usePages(), fl = ft.flake;
  const dusk = sc.dusk ?? 0;
  const flick = 1 + 0.08 * Math.sin(t * 13) * Math.sin(t * 7.3);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam k={sc.cam} t={t} />
      <Post bloom={0.32 + 0.25 * dusk} threshold={0.86} exposure={lerp(0.84, 0.74, dusk)} env={lerp(0.3, 0.14, dusk)} />
      <color attach="background" args={[dusk > 0.5 ? "#1a1612" : "#2a2420"]} />
      <fog attach="fog" args={[dusk > 0.5 ? "#1a1410" : "#3a3028", 3.2, 9]} />
      <hemisphereLight args={["#fff2dc", "#5a4632", lerp(0.32, 0.14, dusk)]} />
      {/* luz de ventana desde la izquierda */}
      <directionalLight position={[-2.2, 2.6, 0.8]} intensity={lerp(1.7, 0.45, dusk)} color={dusk > 0.5 ? "#9fb0d8" : "#ffe6c0"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-left={-1.4} shadow-camera-right={1.4} shadow-camera-top={1.4} shadow-camera-bottom={-1.4} />
      <pointLight position={[0.2, 2.1, 0.2]} intensity={lerp(0.7, 1.1, dusk)} distance={4} decay={1.5} color="#ffd9a8" />
      {/* la vela */}
      <pointLight position={[CANDLE[0], TOP + 0.2, CANDLE[2]]} intensity={(0.25 + 0.9 * dusk) * flick} distance={1.6} decay={1.8} color="#ffb060" />
      {/* piso, paredes, ventana con cortinas, la cruz */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 8]} /><meshStandardMaterial map={tx.lino} roughness={0.7} /></mesh>
      <mesh position={[0, 1.4, -1.45]} receiveShadow><planeGeometry args={[8, 2.8]} /><meshStandardMaterial map={tx.wall} roughness={0.9} /></mesh>
      <mesh position={[-2.2, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[6, 2.8]} /><meshStandardMaterial map={tx.wall} roughness={0.9} /></mesh>
      <mesh position={[2.2, 1.4, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[6, 2.8]} /><meshStandardMaterial map={tx.wall} roughness={0.9} /></mesh>
      <mesh position={[-0.85, 1.45, -1.44]}><planeGeometry args={[0.8, 0.9]} /><meshBasicMaterial color={dusk > 0.5 ? "#3a4a6a" : "#fff3d8"} toneMapped={false} /></mesh>
      {[-1.3, -0.4].map((xx) => <mesh key={xx} position={[xx, 1.45, -1.42]}><planeGeometry args={[0.24, 1.05]} /><meshStandardMaterial map={tx.gingham} roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
      <Box p={[0.1, 1.7, -1.43]} s={[0.025, 0.26, 0.02]} c="#5a3a22" r={0.5} rad={0.004} />
      <Box p={[0.1, 1.76, -1.43]} s={[0.13, 0.025, 0.02]} c="#5a3a22" r={0.5} rad={0.004} />
      {/* la mesa para uno con el mantel de la iglesia */}
      <Box p={[0, TOP - 0.025, 0]} s={[1.3, 0.04, 0.86]} c="#8a6444" r={0.6} rad={0.01} />
      {[[-0.6, -0.38], [0.6, -0.38], [-0.6, 0.38], [0.6, 0.38]].map(([a, b], i) => <Box key={i} p={[a, (TOP - 0.05) / 2, b]} s={[0.05, TOP - 0.05, 0.05]} c="#6a4a30" r={0.6} rad={0.01} />)}
      <mesh geometry={CLOTH} position={[0, TOP - 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow><meshStandardMaterial map={tx.cloth} roughness={0.92} side={THREE.DoubleSide} /></mesh>
      <Chair />
      {/* la vela */}
      <group position={CANDLE}>
        <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.045, 0.05, 0.01, 24]} /><meshStandardMaterial color="#c9b47a" metalness={0.9} roughness={0.3} /></mesh>
        <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.017, 0.017, 0.16, 20]} /><meshStandardMaterial color="#f4ecd8" roughness={0.6} /></mesh>
        <mesh position={[0, 0.19, 0]} scale={[0.6 * flick, 1.4 * flick, 0.6 * flick]}><sphereGeometry args={[0.012, 14, 10]} /><meshBasicMaterial color="#ffcf6a" toneMapped={false} /></mesh>
      </group>
      {/* el plato bueno (con dos cenas cuando corresponde) y el tenedor */}
      <group position={PLATE}>
        <mesh receiveShadow castShadow><cylinderGeometry args={[0.13, 0.1, 0.012, 48]} /><meshStandardMaterial color="#f6f3ec" roughness={0.15} /></mesh>
        <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.105, 0.115, 64]} /><meshStandardMaterial color="#5f8a6a" roughness={0.3} /></mesh>
        <Box p={[0.17, 0.002, 0]} s={[0.016, 0.004, 0.19]} c="#d9dde2" m={1} r={0.2} rad={0.002} />
        {(sc.plate ?? 0) > 0.5 && <group position={[0, 0.008, 0]} scale={[0.9, 0.9, 0.9]}><Food k={sc.plateK ?? sc.k ?? 1} t={t} sc={{ ...sc, sizzle: 0 }} tx={tx} plate /></group>}
      </group>
      {sc.page && <Book page={pg[sc.page] ?? pg["041"]} />}
      {/* la bolsa del freezer con las cenas acostadas, nombre y fecha en marcador */}
      {(sc.bag ?? 0) > 0.01 && <group position={PT.bag} scale={[1, 1, 1]}>
        <mesh position={[0, 0.012, 0]}><boxGeometry args={[0.27, 0.024, 0.28]} /><meshPhysicalMaterial color="#e8f0f4" roughness={0.15} transparent opacity={0.28} depthWrite={false} /></mesh>
        <mesh position={[0, 0.026, -0.13]}><boxGeometry args={[0.27, 0.004, 0.012]} /><meshStandardMaterial color="#2a6ad8" roughness={0.4} /></mesh>
        {Array.from({ length: 2 }, (_, i) => <mesh key={i} position={[(i - 0.5) * 0.12, 0.029, 0.02]} visible={i < Math.ceil(2 * (sc.bag ?? 0))}><cylinderGeometry args={[0.05, 0.05, 0.008, 32]} /><meshStandardMaterial color='#8a2a16' map={tx.mince} roughness={0.3} /></mesh>)}
        <mesh position={[0, 0.0255, -0.085]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.04]} /><meshStandardMaterial map={tx.tape} roughness={0.8} /></mesh>
      </group>}
      <Stove t={t} sc={sc} tx={tx} fl={fl} />
      {(sc.inOven ?? 0) < 0.5 && <Skillet t={t} sc={sc} tx={tx} fl={fl} />}
      {(sc.big ?? 0) > 0.01 && <BigPan t={t} sc={sc} fl={fl} />}
    </ThreeCanvas>
  );
};
