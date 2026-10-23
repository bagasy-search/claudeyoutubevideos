// lcf02 · EL MUNDO de Loretta (vara gary01): una sola escena three.js y UNA cámara por toma.
//  · la MESA PARA UNO con el mantel del sótano de la iglesia (la crucecita en punto cruz), la silla vacía de Harold, la vela,
//    el plato bueno y el libro abierto en la página REAL.
//  · encima, el MOLDE GIGANTE de su madre (oscuro, doblado en una esquina): cada uno de los 12 huecos es una cena
//    (1 pastelitos de carne · 2 pastel de papa · 3 pot pie en biscuit · 4 mac & cheese · 5 tater tot · 6 huevo · 7 atún ·
//    8 morrón parado · 9 ziti · 10 chili en pan de maíz · 11 tarta de zapallo · 12 VACÍO = "¿qué va en los otros dos?").
//  · al fondo la cocina blanca de los 50: la puerta del horno es el PORTAL (el molde sale burbujeando de ahí).
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
const TIN: V3 = [-0.04, TOP + 0.002, -0.06];      // centro del molde (base)
const TS = 1.7;                                   // el molde "gigante"
const PITCH = 0.088, CD = 0.03, CR0 = 0.026, CR1 = 0.035;   // hueco real: paso, hondo, radio abajo/arriba
const STOVE = { x: 1.6, z: -1.12, w: 0.78, h: 0.92, d: 0.62 };
const DOOR = { y0: 0.14, h: 0.44, w: 0.5, z: STOVE.z + STOVE.d / 2 + 0.01 };
const PLATE: V3 = [-0.47, TOP + 0.004, 0.24];
const BOOK: V3 = [0.44, TOP + 0.003, 0.22];
const CHAIR: V3 = [0.95, 0, -0.06];
const CANDLE: V3 = [-0.5, TOP, -0.22];
// hueco i (1..12): 4 columnas × 3 filas, la fila 3 es la de adelante
const cupLocal = (i: number): V3 => { const r = Math.floor((i - 1) / 4), c = (i - 1) % 4; return [(c - 1.5) * PITCH, 0, (r - 1) * PITCH]; };
export const cupW = (i: number, dy = 0): V3 => { const q = cupLocal(i); return [TIN[0] + q[0] * TS, TIN[1] + (CD + dy) * TS, TIN[2] + q[2] * TS]; };
export const PT = {
  cup: cupW,
  tinTop: [TIN[0], TIN[1] + CD * TS, TIN[2]] as V3,
  tinEdge: [TIN[0] + 0.19 * TS, TIN[1] + CD * TS, TIN[2] + 0.14 * TS] as V3,
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
  cups?: number[];         // qué cena hay en cada hueco (0 = vacío); índice 0 = hueco 1
  steam?: number;          // vapor que sale de los huecos
  bubble?: number;         // queso hirviendo en los bordes
  hi?: number;             // hueco resaltado (anillo de luz)
  grease?: number;         // manteca: brillo que barre la superficie plana (0-1)
  greased?: number;        // brillo de manteca ya puesta (0-1)
  fill?: number;           // nivel del hueco de demostración (fracción de hondo) · 0.75 = tres cuartos
  fillCup?: number;
  over?: number;           // rebalse: el queso que se sale y se pega en la parte plana (0-1)
  burnt?: number;          // costra vieja pegada en las esquinas (0-1)
  paste?: number;          // pasta de bicarbonato en las esquinas (0-1)
  soak?: number;           // agua caliente con jabón dentro del molde (0-1)
  lift?: number;           // la cena del hueco liftCup sale entera (0-1)
  liftCup?: number;
  door?: number;           // puerta del horno (0-1)
  inOven?: number;         // el molde todavía en el horno (1) / ya en la mesa (0)
  bag?: number;            // bolsa del freezer con las cenas acostadas (0-1)
  page?: string;           // página real del libro abierto ("041")
  plate?: number;          // dos cenas en el plato bueno (0-1)
  dusk?: number;           // 0 tarde clara · 1 las 5 de la tarde de invierno (la vela manda)
  rise?: number;           // el contenido de los huecos sube al hornear (0-1)
};

const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur); return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: lerp(f0, f1, k) };
};
const add = (q: V3, d: V3): V3 => [q[0] + d[0], q[1] + d[1], q[2] + d[2]];
const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
const NONE = Array(12).fill(0);
const only = (k: number, n = 12) => Array.from({ length: 12 }, (_, i) => (i < n ? k : 0));

// variante "|n": la misma escena con otra cámara (gira alrededor de lo que mira)
export const sceneOf = (full: string, u: number): Scene => {
  const [name, vs] = full.split("|"), v = parseInt(vs ?? "") || 0;
  const sc = sceneBase(name, u);
  if (!v) return sc;
  const ang = (v % 2 ? 1 : -1) * 0.34 * Math.ceil(v / 2), { p, l } = sc.cam, dx = p[0] - l[0], dz = p[2] - l[2];
  return { ...sc, cam: { p: [l[0] + dx * Math.cos(ang) - dz * Math.sin(ang), p[1] + 0.025 * v, l[2] + dx * Math.sin(ang) + dz * Math.cos(ang)], l, fov: sc.cam.fov * 0.95 } };
};
const sceneBase = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const T = PT.tinTop;
  // una cena sola en su hueco: cámara macro que se acerca
  const cupCam = (i: number, near = 1) => { const c = cupW(i); return drift(add(c, [0.06, 0.3 * near, 0.38 * near]), add(c, [0.03, 0.23 * near, 0.28 * near]), add(c, [0, 0.0, 0]), add(c, [0, 0.005, 0]), 34, 30, u); };
  if (kind === "wide") {
    // la mesa para uno: el molde, la silla de Harold, la vela, el horno al fondo
    if (arg === "night") return { cups: ALL, dusk: 1, steam: 0.5, cam: drift([-1.15, 1.32, 1.35], [-0.85, 1.22, 1.1], [0.15, 0.82, -0.25], [0.2, 0.82, -0.3], 42, 38, u, 10) };
    if (arg === "empty") return { cups: NONE, cam: drift([1.1, 1.35, 1.2], [0.85, 1.25, 1.0], [-0.1, 0.8, -0.2], [-0.12, 0.8, -0.22], 42, 39, u, 10) };
    return { cups: ALL, steam: 0.6, bubble: 0.6, cam: drift([-1.25, 1.38, 1.45], [-0.95, 1.26, 1.2], [0.3, 0.7, -0.45], [0.32, 0.72, -0.5], 44, 40, u, 10) };
  }
  if (kind === "tin") {
    // el molde visto desde arriba-adelante; "upto5" llena de a uno; "empty" sin nada; "cool" reposando
    const n = arg.startsWith("upto") ? parseInt(arg.slice(4)) : 0;
    const cups = arg === "empty" ? NONE : n ? ALL.map((k, i) => (i < n ? k : 0)) : arg === "ziti" ? only(9) : arg === "meat" ? only(1) : ALL;
    const steam = arg === "cool" ? 1 - ease(u / 8) : 0.7;
    if (arg === "top") return { cups, steam, bubble: 0.8, cam: drift(add(T, [0.0, 0.85, 0.2]), add(T, [0.0, 0.72, 0.12]), T, T, 40, 36, u, 10) };
    return { cups, steam, bubble: 0.8, cam: drift(add(T, [0.4, 0.42, 0.62]), add(T, [0.28, 0.34, 0.48]), add(T, [0, -0.02, 0]), add(T, [-0.02, -0.02, 0]), 38, 34, u, 10) };
  }
  if (kind === "row") {
    // dolly bajo por la fila de adelante: las cenas pasan una por una
    return { cups: ALL, steam: 0.6, bubble: 0.7, cam: drift(add(cupW(9), [-0.32, 0.09, 0.3]), add(cupW(12), [0.12, 0.08, 0.3]), add(cupW(9), [0.06, 0, 0]), add(cupW(12), [0.12, 0, 0]), 32, 30, u, 10) };
  }
  if (kind === "cup") {
    const i = parseInt(arg) || 1;
    // hueco 12 = el vacío ("¿qué va en los otros dos?"); el 11 también vacío para el final
    return { cups: ALL, steam: 0.7, bubble: 0.8, hi: i, cam: cupCam(i) };
  }
  if (kind === "oven") {
    // el portal: la puerta se abre, el resplandor y el vapor, la cámara entra al molde
    const op = arg === "out";
    const door = op ? 1 : ease((u - 0.5) / 1.8);
    return { cups: ALL, door, inOven: op ? 0 : 1, steam: 0.4 + 0.6 * door, bubble: 1, dusk: 0.4,
      cam: op ? drift([STOVE.x + 0.1, 0.9, DOOR.z + 1.0], [STOVE.x + 0.03, 0.66, DOOR.z + 0.62], [STOVE.x, 0.38, DOOR.z - 0.2], [STOVE.x, 0.36, DOOR.z - 0.25], 40, 36, u, 9)
        : drift([STOVE.x + 0.12, 1.0, DOOR.z + 1.35], [STOVE.x + 0.05, 0.72, DOOR.z + 0.8], [STOVE.x, 0.36, DOOR.z - 0.1], [STOVE.x, 0.3, DOOR.z - 0.25], 42, 36, u, 7) };
  }
  if (kind === "chair") return { cups: ALL, dusk: 1, cam: drift([0.35, 1.05, 0.75], [0.45, 1.0, 0.6], [CHAIR[0], 0.82, CHAIR[2]], [CHAIR[0], 0.84, CHAIR[2]], 38, 34, u, 10) };
  if (kind === "cloth") return { cups: ALL, cam: drift(add(PT.cross, [0.12, 0.32, 0.34]), add(PT.cross, [0.06, 0.24, 0.24]), PT.cross, add(PT.cross, [0, 0, -0.02]), 34, 30, u, 10) };
  if (kind === "book") return { cups: ALL, page: arg || "041", cam: drift(add(BOOK, [0.0, 0.5, 0.26]), add(BOOK, [0.0, 0.4, 0.17]), add(BOOK, [0, 0, -0.01]), add(BOOK, [0, 0, -0.005]), 36, 32, u, 10) };
  if (kind === "grease") {
    // la manteca: el brillo barre los huecos Y la parte plana de arriba ("todos se olvidan de arriba")
    return { cups: NONE, grease: ease((u - 0.4) / 4.5), cam: drift(add(T, [-0.28, 0.32, 0.4]), add(T, [-0.12, 0.26, 0.3]), add(T, [-0.05, -0.02, 0]), add(T, [0.03, -0.02, 0]), 36, 33, u, 9) };
  }
  if (kind === "fill") {
    const full = arg === "full";
    return { cups: NONE, greased: 1, fillCup: 6, fill: lerp(0.1, full ? 1.0 : 0.75, ease((u - 0.3) / 2.6)), cam: cupCam(6, 0.8) };
  }
  if (kind === "over") {
    // el error del 9: lleno hasta arriba + arriba sin manteca + caliente → el queso se sale y se pega como cemento
    return { cups: only(9), fill: 1.0, fillCup: 0, rise: 1, over: ease((u - 0.6) / 4), bubble: 1, steam: 1, cam: drift(add(T, [0.3, 0.3, 0.45]), add(T, [0.18, 0.24, 0.34]), add(T, [0.03, -0.02, 0.03]), add(T, [0.02, -0.02, 0.02]), 36, 32, u, 9) };
  }
  if (kind === "rest") {
    // reposa diez minutos, el vapor baja, y sale ENTERA
    return { cups: only(+arg || 4), steam: 1 - ease(u / 6), lift: ease((u - 4) / 2.5), liftCup: 7, cam: cupCam(7, 1.1) };
  }
  if (kind === "lift") return { cups: ALL, lift: ease((u - 0.8) / 2.6), liftCup: parseInt(arg) || 1, steam: 0.6, cam: cupCam(parseInt(arg) || 1, 1.2) };
  if (kind === "soak") return { cups: NONE, soak: ease((u - 0.3) / 3), greased: 0.4, cam: drift(add(T, [0.25, 0.36, 0.42]), add(T, [0.15, 0.3, 0.32]), T, T, 36, 33, u, 9) };
  if (kind === "paste") return { cups: NONE, burnt: 1 - ease((u - 4.5) / 2), paste: ease((u - 0.8) / 2.5) * (1 - ease((u - 4.5) / 2)), cam: cupCam(5, 0.7) };
  if (kind === "mess") return { cups: NONE, burnt: 1, cam: drift(add(T, [-0.25, 0.3, 0.42]), add(T, [-0.15, 0.25, 0.32]), T, T, 36, 33, u, 9) };
  if (kind === "bag") return { cups: NONE, bag: ease((u - 0.2) / 2), cam: drift(add(PT.bag, [0.05, 0.42, 0.3]), add(PT.bag, [0.02, 0.33, 0.21]), PT.bag, PT.bag, 36, 33, u, 9) };
  if (kind === "plate") return { cups: ALL, plate: 1, dusk: 1, cam: drift(add(PLATE, [0.25, 0.3, 0.36]), add(PLATE, [0.15, 0.22, 0.26]), add(PLATE, [0, 0.02, 0]), add(PLATE, [0, 0.02, 0]), 36, 32, u, 10) };
  return { cups: ALL, cam: drift([1.2, 1.4, 1.35], [0.9, 1.28, 1.1], [-0.05, 0.82, -0.2], [-0.08, 0.82, -0.25], 42, 38, u, 10) };
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
    g.fillStyle = "#1e2a6a"; g.font = "bold 58px 'Comic Sans MS', cursive"; g.fillText("MEATLOAF", 24, 72); g.font = "bold 40px 'Comic Sans MS', cursive"; g.fillText("10/26", 340, 110);
  }),
}), []);

// ---------------- páginas REALES del libro (public/lcf02/book_p###.jpg) ----------------
const PAGES = ["001", "041", "046", "048", "070", "163", "023", "027", "026", "022", "028", "113", "040", "051"];
const usePages = () => {
  const [h] = useState(() => delayRender("páginas del libro"));
  return useMemo(() => {
    let n = PAGES.length;
    const done = () => { n -= 1; if (n === 0) continueRender(h); };
    const L = new THREE.TextureLoader();
    return Object.fromEntries(PAGES.map((pg) => {
      const tx = L.load(staticFile(`lcf02/book_p${pg}.jpg`), done, undefined, done);
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
// la plancha del molde: rectángulo con 12 agujeros
const TRAY = (() => {
  const w = 0.37, d = 0.28, s = new THREE.Shape();
  s.moveTo(-w / 2, -d / 2); s.lineTo(w / 2, -d / 2); s.lineTo(w / 2, d / 2); s.lineTo(-w / 2, d / 2); s.closePath();
  for (let i = 1; i <= 12; i++) { const q = cupLocal(i), hp = new THREE.Path(); hp.absarc(q[0], -q[2], CR1, 0, Math.PI * 2, true); s.holes.push(hp); }
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.003, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.0012, bevelSegments: 2, curveSegments: 40 });
  g.rotateX(-Math.PI / 2); return g;
})();
const CUP = new THREE.LatheGeometry([[0, 0], [CR0 - 0.003, 0], [CR0, 0.003], [CR1, CD]].map(([x, y]) => new THREE.Vector2(x, y)), 40);
// relleno: tronco de cono que sigue la pared del hueco hasta la altura h
const rAt = (y: number) => lerp(CR0, CR1, cl(y / CD)) - 0.0012;
const bodyGeo = (h: number) => new THREE.CylinderGeometry(rAt(h), rAt(0.002), Math.max(0.001, h - 0.002), 32);
const DOME = (() => {
  const g = new THREE.SphereGeometry(1, 36, 14, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setY(i, y + 0.12 * y * Math.sin(x * 19 + z * 7) * Math.cos(z * 15 - x * 4)); }
  g.computeVertexNormals(); return g;
})();
// pirotín de papel plisado
const LINER = (() => {
  const g = new THREE.CylinderGeometry(CR1 + 0.0012, CR0 + 0.0008, CD + 0.004, 72, 1, true);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 + 0.035 * Math.sin(a * 36); p.setX(i, x * k); p.setZ(i, z * k); }
  g.computeVertexNormals(); g.translate(0, (CD + 0.004) / 2, 0); return g;
})();
// medio morrón parado: casco abierto hacia arriba con 3 lóbulos
const PEPPER = (() => {
  const g = new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 + 0.08 * Math.cos(a * 3); p.setX(i, x * k); p.setZ(i, z * k); }
  g.computeVertexNormals(); return g;
})();
const RIM = (r: number, lift: number, waves: number) => {
  const g = new THREE.TorusGeometry(r, 0.0045, 10, 64);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), a = Math.atan2(y, x); p.setZ(i, p.getZ(i) + lift * Math.max(0, Math.sin(a * waves))); }
  g.computeVertexNormals(); g.rotateX(-Math.PI / 2); return g;
};
const BISCUIT_RIM = RIM(CR1 - 0.002, 0.006, 5);
const PIE_RIM = RIM(CR1 - 0.002, 0.003, 14);

// ---------------- UNA cena en su hueco (coordenadas reales del hueco: base en y=0, boca en y=CD) ----------------
const Supper: React.FC<{ k: number; t: number; seed: number; rise: number; bubble: number; level?: number; tx: ReturnType<typeof useLorTex> }> = ({ k, t, seed, rise, bubble, level, tx }) => {
  const h = (level ?? (k === 5 || k === 3 ? 0.92 : 0.84)) * CD + rise * 0.006;
  const body = useMemo(() => bodyGeo(Math.min(CD + 0.006, h)), [h]);
  const R = rAt(h);
  const domeH = ({ 1: 0.008, 2: 0.012, 4: 0.008, 6: 0.016, 7: 0.006, 9: 0.006, 10: 0.016, 11: 0.002 } as Record<number, number>)[k] ?? 0.006;
  const B = ({ 1: "#6a3a22", 2: "#5c3420", 3: "#e9dcb8", 4: "#e7b03c", 5: "#5c3420", 6: "#f1cf5c", 7: "#e7d3a0", 8: "#5c3420", 9: "#a8321c", 10: "#e2b04e", 11: "#c46a1e" } as Record<number, string>)[k] ?? "#999";
  const top = ({ 1: "#7a1a0c", 2: "#f1dcab", 4: "#e3a83e", 6: "#f1cf5c", 7: "#e8c27a", 9: "#c0482a", 10: "#e2ae4a", 11: "#c26418" } as Record<number, string>)[k] ?? B;
  const map = ({ 2: tx.potato, 4: tx.crust, 6: tx.egg, 7: tx.crumbs, 9: tx.ziti, 10: tx.crumbs } as Record<number, THREE.Texture>)[k];
  const liner = k === 1 || k === 10;
  const bub = bubble > 0.01 && [4, 7, 9, 3].includes(k);
  return (
    <group>
      {liner && <mesh geometry={LINER}><meshStandardMaterial color="#efe9dc" roughness={0.9} side={THREE.DoubleSide} /></mesh>}
      {k !== 8 && <mesh geometry={body} position={[0, 0.002 + (Math.min(CD + 0.006, h) - 0.002) / 2, 0]} castShadow><meshStandardMaterial color={B} roughness={0.55} /></mesh>}
      {k !== 8 && k !== 3 && k !== 5 && (
        <mesh geometry={DOME} position={[0, h, 0]} scale={[R, domeH, R]} castShadow>
          <meshStandardMaterial color={top} map={map} roughness={k === 1 ? 0.18 : k === 11 ? 0.25 : 0.55} emissive={k === 1 ? "#2a0602" : "#000"} emissiveIntensity={0.3} />
        </mesh>
      )}
      {/* 3 · biscuit que sube por las paredes como un bol, relleno cremoso con arvejas */}
      {k === 3 && <>
        <mesh geometry={BISCUIT_RIM} position={[0, CD + 0.002, 0]} castShadow><meshStandardMaterial color="#d9a14e" map={tx.crust} roughness={0.6} /></mesh>
        <mesh position={[0, h - 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R - 0.002, 32]} /><meshStandardMaterial color="#efe2bd" roughness={0.3} /></mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.1 + seed) * 0.016 * rnd(i, 2), h, Math.sin(i * 2.1 + seed) * 0.016 * rnd(i, 3)]}><sphereGeometry args={[0.0028, 10, 8]} /><meshStandardMaterial color={i % 3 ? "#5f9a3a" : "#e07a2a"} roughness={0.4} /></mesh>)}
      </>}
      {/* 5 · tres tater tots PARADOS como soldaditos + queso */}
      {k === 5 && <>
        <mesh position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[R, 32]} /><meshStandardMaterial color="#6a4024" roughness={0.6} /></mesh>
        {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.09 + 0.4) * 0.012, h + 0.006, Math.sin(i * 2.09 + 0.4) * 0.012]} castShadow><cylinderGeometry args={[0.0075, 0.0078, 0.02, 14]} /><meshStandardMaterial color="#c98a34" map={tx.crust} roughness={0.55} /></mesh>)}
        {Array.from({ length: 6 }, (_, i) => <mesh key={"q" + i} position={[(rnd(i, 4) - 0.5) * 0.03, h + 0.001, (rnd(i, 5) - 0.5) * 0.03]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.004, 10, 6]} /><meshStandardMaterial color="#f2b62e" roughness={0.3} /></mesh>)}
      </>}
      {/* 8 · medio morrón parado en el hueco, relleno de carne y arroz con queso arriba */}
      {k === 8 && <group position={[0, 0.026, 0]}>
        <mesh geometry={PEPPER} scale={[0.031, 0.034, 0.031]} castShadow><meshStandardMaterial color="#c0221a" roughness={0.22} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.029, 32]} /><meshStandardMaterial color="#6a4024" roughness={0.6} /></mesh>
        <mesh geometry={DOME} position={[0, 0.002, 0]} scale={[0.024, 0.008, 0.024]}><meshStandardMaterial color="#e9b23a" map={tx.crust} roughness={0.45} /></mesh>
        <mesh position={[0.004, 0.006, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.002, 0.003, 0.01, 8]} /><meshStandardMaterial color="#3f6a24" roughness={0.6} /></mesh>
      </group>}
      {/* 9 · tubitos de ziti asomando */}
      {k === 9 && Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(rnd(i + seed, 1) - 0.5) * 0.034, h + 0.003, (rnd(i + seed, 2) - 0.5) * 0.034]} rotation={[Math.PI / 2, 0, rnd(i, 3) * 3]}><cylinderGeometry args={[0.0034, 0.0034, 0.016, 10, 1, true]} /><meshStandardMaterial color="#d2622c" roughness={0.45} side={THREE.DoubleSide} /></mesh>)}
      {/* 10 · grieta del pan de maíz con el chili adentro */}
      {k === 10 && <mesh position={[0, h + domeH * 0.82, 0]} rotation={[-Math.PI / 2, 0, 0.6]}><planeGeometry args={[0.03, 0.006]} /><meshStandardMaterial color="#6a1a0a" roughness={0.3} /></mesh>}
      {/* 11 · borde de masa de la tartita de zapallo */}
      {k === 11 && <mesh geometry={PIE_RIM} position={[0, CD + 0.001, 0]}><meshStandardMaterial color="#d9a35a" map={tx.crust} roughness={0.6} /></mesh>}
      {/* burbujas de queso en los bordes */}
      {bub && Array.from({ length: 10 }, (_, i) => {
        const kk = Math.max(0, Math.sin(t * (1.6 + rnd(i + seed, 4) * 2) + rnd(i + seed, 3) * 6.28)), a = rnd(i + seed, 1) * 6.28;
        return <mesh key={"b" + i} position={[Math.cos(a) * (R - 0.003), h + 0.002, Math.sin(a) * (R - 0.003)]} scale={[kk * bubble, kk * 0.7 * bubble, kk * bubble]}><sphereGeometry args={[0.0028, 10, 8]} /><meshStandardMaterial color="#f0b04a" roughness={0.08} /></mesh>;
      })}
    </group>
  );
};

// ---------------- EL MOLDE ----------------
const Tin: React.FC<{ t: number; sc: Scene; tx: ReturnType<typeof useLorTex>; fl: THREE.Texture; p?: V3; s?: number }> = ({ t, sc, tx, fl, p = TIN, s = TS }) => {
  const cups = sc.cups ?? ALL, grease = sc.grease ?? 0, greased = Math.max(sc.greased ?? 0, grease > 0 ? 0 : 0), over = sc.over ?? 0, burnt = sc.burnt ?? 0, paste = sc.paste ?? 0, soak = sc.soak ?? 0;
  const lift = sc.lift ?? 0, liftCup = sc.liftCup ?? 0, rise = sc.rise ?? 0.6, bubble = sc.bubble ?? 0;
  // vapor que sale de los huecos llenos
  const steam: number[] = [], st = sc.steam ?? 0;
  if (st > 0.02) cups.forEach((k, i) => { if (!k) return; const q = cupLocal(i + 1); for (let j = 0; j < 14; j++) { const n = i * 14 + j, ph = (t * (0.16 + rnd(n, 1) * 0.12) + rnd(n, 2)) % 1; steam.push(q[0] + (rnd(n, 3) - 0.5) * 0.04 * (1 + ph * 2), CD + 0.01 + ph * 0.16, q[2] + (rnd(n, 4) - 0.5) * 0.04 * (1 + ph * 2)); } });
  // espuma del agua con jabón
  const foam: number[] = [];
  if (soak > 0.05) for (let i = 0; i < 320; i++) foam.push((rnd(i, 1) - 0.5) * 0.34, CD + 0.002 + soak * 0.004 + rnd(i, 2) * 0.004, (rnd(i, 3) - 0.5) * 0.25);
  // el barrido de manteca: x de -0.2 a 0.2
  const gx = lerp(-0.22, 0.22, grease);
  const sheen = grease > 0 ? 1 : greased;
  return (
    <group position={p} scale={[s, s, s]}>
      {/* plancha con el borde enrollado; la esquina de adelante a la derecha DOBLADA (el molde de su madre) */}
      <group position={[0, CD, 0]} rotation={[0, 0, 0]}>
        <mesh geometry={TRAY} castShadow receiveShadow><meshStandardMaterial map={tx.tin} color="#9a9894" roughness={0.42 - 0.1 * sheen} metalness={0.75} /></mesh>
      </group>
      {[[-0.186, 0, 0, 0.28], [0.186, 0, 0, 0.28]].map(([x], i) => <mesh key={"rx" + i} position={[x, CD + 0.002, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.28, 10]} /><meshStandardMaterial color="#55534f" roughness={0.35} metalness={0.8} /></mesh>)}
      {[-0.141, 0.141].map((z, i) => <mesh key={"rz" + i} position={[0, CD + 0.002, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.375, 10]} /><meshStandardMaterial color="#55534f" roughness={0.35} metalness={0.8} /></mesh>)}
      {Array.from({ length: 12 }, (_, j) => {
        const i = j + 1, q = cupLocal(i), k = cups[j];
        const isFill = sc.fillCup === i, isLift = liftCup === i;
        const ly = isLift ? lift * 0.07 : 0;
        return (
          <group key={i} position={q}>
            <mesh geometry={CUP} castShadow><meshStandardMaterial map={tx.tin} color="#3a3836" roughness={0.55} metalness={0.25} side={THREE.FrontSide} /></mesh>
            <mesh geometry={CUP} receiveShadow><meshStandardMaterial map={tx.tin} color={sheen > 0.01 && (grease === 0 || q[0] < gx) ? "#6f6c66" : "#5a5854"} roughness={sheen > 0.01 && (grease === 0 || q[0] < gx) ? 0.26 : 0.45} metalness={0.55} envMapIntensity={0.4} side={THREE.BackSide} /></mesh>
            {/* manteca: brillo cremoso donde ya pasó el pincel */}
            {k > 0 && <group position={[0, ly, 0]} rotation={[isLift ? lift * 0.25 : 0, 0, isLift ? lift * 0.12 : 0]}><Supper k={k} t={t} seed={i * 7} rise={rise} bubble={bubble} level={isFill ? sc.fill : undefined} tx={tx} /></group>}
            {/* hueco de demostración vacío que se va llenando de masa */}
            {k === 0 && isFill && <mesh geometry={bodyGeo(Math.max(0.003, (sc.fill ?? 0) * CD))} position={[0, 0.002 + (Math.max(0.003, (sc.fill ?? 0) * CD) - 0.002) / 2, 0]}><meshStandardMaterial color="#e7b03c" roughness={0.5} /></mesh>}
            {/* costra vieja en las esquinas → pasta blanca de bicarbonato */}
            {burnt > 0.01 && Array.from({ length: 6 }, (_, b) => { const a = b * 1.05 + i; return <mesh key={"bt" + b} position={[Math.cos(a) * (CR0 + 0.002), 0.004 + rnd(b, i) * 0.01, Math.sin(a) * (CR0 + 0.002)]} scale={[1.6, 0.22, 1.2]}><sphereGeometry args={[0.007 + rnd(b, i + 3) * 0.005, 10, 8]} /><meshStandardMaterial color={paste > 0.5 ? "#f4f2ea" : "#3b1c09"} roughness={0.95} transparent opacity={burnt} /></mesh>; })}
            {/* el queso viejo soldado al borde y a la parte plana: un arco de costra marrón alrededor del hueco */}
            {burnt > 0.01 && Array.from({ length: 8 }, (_, b) => { const a0 = rnd(i, 9) * 6.28, a = a0 + b * (0.28 + rnd(b, i + 11) * 0.12), r = CR1 + 0.004 + rnd(b, i + 13) * 0.006, z = 0.006 + rnd(b, i + 17) * 0.007; return <mesh key={"bc" + b} position={[Math.cos(a) * r, CD + 0.002, Math.sin(a) * r]} scale={[1.4, 0.28, 1]} rotation={[0, -a, 0]}><sphereGeometry args={[z, 12, 8]} /><meshStandardMaterial color={paste > 0.5 ? "#efece2" : b % 3 ? "#3e1e0a" : "#6b3a16"} roughness={0.85} transparent opacity={burnt} /></mesh>; })}
            {/* el queso rebalsado que se suelda a la parte plana */}
            {over > 0.01 && k > 0 && Array.from({ length: 4 }, (_, b) => { const a = b * 1.57 + rnd(i, b) * 0.8; return <mesh key={"ov" + b} position={[Math.cos(a) * (CR1 + 0.006 * over), CD + 0.0035, Math.sin(a) * (CR1 + 0.006 * over)]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.004 + 0.007 * over * rnd(b, i), 12, 8]} /><meshStandardMaterial color={over > 0.6 ? "#6a3410" : "#e9a83a"} roughness={0.5} /></mesh>; })}
          </group>
        );
      })}
      {/* el pincel de manteca que barre (un brillo que viaja) */}
      {grease > 0.01 && grease < 0.99 && <mesh position={[gx, CD + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.28]} /><meshBasicMaterial color="#fff4cc" transparent opacity={0.5} toneMapped={false} depthWrite={false} /></mesh>}
      {(grease > 0 || greased > 0) && <mesh position={[(gx - 0.185) / 2 + (grease > 0 ? 0 : 0.185), CD + 0.0045, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[grease > 0 ? gx + 0.185 : 0.37, 0.28]} /><meshStandardMaterial color="#f6e7b0" transparent opacity={0.06} roughness={0.2} depthWrite={false} /></mesh>}
      {/* agua caliente con jabón */}
      {soak > 0.01 && <>
        <mesh position={[0, CD + 0.001 + soak * 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.27]} /><meshPhysicalMaterial color="#a9c6d2" roughness={0.03} transparent opacity={0.28 * soak} depthWrite={false} /></mesh>
        <Pts pts={foam} col="#ffffff" size={0.006} o={0.8 * soak} map={fl} />
      </>}
      {steam.length > 0 && <Pts pts={steam} col="#f6f3ee" size={0.09} o={0.035 * st} map={fl} />}
      {sc.hi && <mesh position={[cupLocal(sc.hi)[0], CD + 0.004, cupLocal(sc.hi)[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[CR1 + 0.004, CR1 + 0.007, 48]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.55 + 0.25 * Math.sin(t * 4)} toneMapped={false} /></mesh>}
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
const Stove: React.FC<{ t: number; sc: Scene; tx: ReturnType<typeof useLorTex>; fl: THREE.Texture }> = ({ t, sc, tx, fl }) => {
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
      {(sc.inOven ?? 0) > 0.5 && <Tin t={t} sc={{ ...sc, hi: undefined }} tx={tx} fl={fl} p={[x, DOOR.y0 + 0.14, DOOR.z - 0.26]} s={1.05} />}
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
  const tx = useLorTex(), ft = useTextures(), pg = usePages(), fl = ft.flake;
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
        {(sc.plate ?? 0) > 0.5 && [-1, 1].map((sx) => <group key={sx} position={[sx * 0.042, 0.006 - 0.004 * 1.7, 0]} scale={[1.7, 1.7, 1.7]}><Supper k={sx < 0 ? 1 : 4} t={t} seed={sx + 3} rise={0.6} bubble={0} tx={tx} /></group>)}
      </group>
      {sc.page && <Book page={pg[sc.page] ?? pg["041"]} />}
      {/* la bolsa del freezer con las cenas acostadas, nombre y fecha en marcador */}
      {(sc.bag ?? 0) > 0.01 && <group position={PT.bag} scale={[1, 1, 1]}>
        <mesh position={[0, 0.012, 0]}><boxGeometry args={[0.27, 0.024, 0.28]} /><meshPhysicalMaterial color="#e8f0f4" roughness={0.15} transparent opacity={0.28} depthWrite={false} /></mesh>
        <mesh position={[0, 0.026, -0.13]}><boxGeometry args={[0.27, 0.004, 0.012]} /><meshStandardMaterial color="#2a6ad8" roughness={0.4} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <group key={i} position={[(i % 3 - 1) * 0.08, 0.004, (Math.floor(i / 3) - 0.5) * 0.09 + 0.02]} scale={[1.1, 0.9, 1.1]} visible={i < Math.ceil(6 * (sc.bag ?? 0))}><Supper k={1} t={t} seed={i} rise={0.4} bubble={0} tx={tx} /></group>)}
        <mesh position={[0, 0.0255, -0.085]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.04]} /><meshStandardMaterial map={tx.tape} roughness={0.8} /></mesh>
      </group>}
      <Stove t={t} sc={sc} tx={tx} fl={fl} />
      {(sc.inOven ?? 0) < 0.5 && <Tin t={t} sc={sc} tx={tx} fl={fl} />}
    </ThreeCanvas>
  );
};
