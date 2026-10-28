// cer30 · EL MUNDO de los videos largos de Claudio: una maqueta en corte de casa de muñecas por video (scene). Tanda 28: vaso, ventana, portón (al final).
// papeles = la casa de cerpapeles (garaje, cocina, sala, estudio, dormitorio, placard) · joyas = cocina, baño, dormitorio
// grande (cómoda con joyero, mesita con platito, cama con valija debajo, ropero con abrigos y la lata arriba) y el cuarto de
// costura (caja de costura = donde las guarda el cerrajero, caja atornillada detrás del baúl) · llave = de día, la entrada
// vista desde la vereda (felpudo, maceta, piedra falsa, farol, buzón, marco), el garaje con el auto, el pasillo con el gancho
// de llaves, el patio de atrás, la caja con combinación en la pared del costado y la casa del vecino (= la copia anónima).
// Todo lo que se mueve sale del estado st (lo arma el motor desde plan.json). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export type V3 = [number, number, number];
export type Scene = "papeles" | "joyas" | "llave" | "vaso" | "ventana" | "porton";

// ---------------- puntos del mundo por escena ----------------
export const PTS: Record<Scene, Record<string, V3>> = {
  papeles: {
    glove: [-7.05, 0.78, -0.35], freezer: [-4.3, 1.6, -1.55], mail: [-0.2, 0.78, -1.7], desk: [2.97, 0.62, -1.5], pad: [2.2, 0.79, -1.72],
    cabinet: [3.95, 1.13, -1.6], box: [6.35, 0.18, -1.9], manuals: [9.28, 1.7, -1.8], safe: [9.2, 0.2, -2.05], center: [0.6, 0.8, -0.8],
  },
  joyas: {
    cookie: [-4.6, 1.02, -1.95], bath: [-1.75, 0.9, -1.85], tank: [-0.95, 0.7, -2.0], dish: [0.6, 0.6, -1.86], bed: [2.0, 0.55, -1.2],
    suitcase: [2.0, 0.14, -0.35], jbox: [3.75, 1.02, -1.95], drawer2: [3.75, 0.5, -1.7], coats: [5.35, 1.35, -1.85], shoes: [5.35, 1.92, -1.9],
    wtop: [5.35, 2.18, -1.95], sewing: [7.25, 1.27, -2.0], safe: [8.55, 0.2, -2.05], center: [1.8, 0.8, -0.8],
  },
  llave: {
    garage: [-8.0, 1.3, -1.9], car: [-6.4, 0.8, -0.3], mat: [-2.2, 0.04, -0.3], frame: [-2.2, 2.12, -0.95], lamp: [-1.25, 1.85, -0.9],
    pot: [-1.3, 0.3, -0.45], rock: [-3.5, 0.08, 0.5], mail: [-0.2, 1.0, 1.55], hooks: [1.55, 1.4, -2.15], window: [2.6, 1.25, -0.6],
    backmat: [4.6, 0.04, -0.3], keybox: [6.7, 0.95, -0.95], neighbor: [9.6, 1.0, -0.95], center: [0.5, 0.8, -0.6],
  },
  vaso: {
    door: [-2.95, 1.0, -2.1], knob: [-2.6, 1.0, -2.06], glass: [-2.6, 1.08, -2.04], tray: [-2.6, 0.03, -1.85], wedge: [-2.95, 0.03, -1.95],
    key: [-2.6, 1.22, -2.06], hook: [-1.75, 1.55, -2.16], bells: [-2.6, 0.82, -2.03], tape: [-2.52, 0.25, -2.1], lamp: [-4.5, 1.2, -1.95],
    frontdoor: [0.4, 1.0, -2.12], chain: [0.75, 1.55, -2.08], timer: [1.65, 0.8, -1.95], phone: [3.05, 0.62, -1.92], bed: [4.4, 0.5, -1.2],
    window: [5.7, 1.4, -2.15], car: [8.6, 0.8, -0.5], center: [0.5, 0.8, -0.8],
  },
  ventana: {
    latch: [-3.2, 1.4, -2.1], pane: [-2.7, 1.4, -2.1], track: [-3.3, 0.86, -2.1], stick: [-3.7, 0.86, -2.1], screw: [-2.7, 2.0, -2.1],
    lock: [-2.1, 2.0, -2.1], film: [-3.2, 1.4, -2.08], louvre: [1.2, 1.9, -2.12], window2: [4.4, 1.4, -2.12], grille: [7.6, 1.5, -0.95],
    roses: [7.6, 0.3, -0.6], saw: [9.7, 0.6, -0.3], center: [1.5, 0.8, -0.8],
  },
  porton: {
    door: [-4.5, 1.1, -2.1], windows: [-4.5, 2.0, -2.08], rail: [-4.5, 2.35, -1.0], cord: [-4.5, 1.8, -1.6], hanger: [-4.5, 2.2, -2.0],
    tie: [-4.5, 2.3, -1.6], clamp: [-2.85, 2.0, -2.0], car: [-4.5, 0.8, -0.5], remote: [-4.5, 1.15, -0.45], tools: [-6.9, 0.8, -1.95],
    ladder: [-6.9, 0.15, -0.9], bolt: [-1.6, 1.1, -2.1], keypad: [4.7, 1.2, -0.95], sensor: [6.3, 2.4, -0.95], front: [6.3, 1.1, -0.97],
    center: [-1.5, 0.8, -0.8],
  },
};
// los escondites que mira el ladrón, en el orden de su recorrido (heatall / trail)
export const SPOTS: Record<Scene, string[]> = {
  papeles: ["desk", "cabinet", "box", "freezer", "glove"],
  joyas: ["jbox", "drawer2", "coats", "bed", "bath"],
  llave: ["mat", "pot", "frame", "hooks", "car"],
  vaso: ["door", "key", "frontdoor", "window"],
  ventana: ["latch", "louvre", "window2", "grille"],
  porton: ["hanger", "cord", "remote", "bolt"],
};
const GOODS: Record<Scene, string[]> = { papeles: ["manuals", "safe"], joyas: ["sewing", "safe", "jbox"], llave: ["neighbor", "keybox"],
  vaso: ["glass", "wedge", "chain", "phone"], ventana: ["stick", "roses", "lock", "screw"], porton: ["tie", "clamp", "bolt", "sensor"] };

// ---------------- poses de cámara ----------------
export type Pose = { p: V3; l: V3; fov: number };
const over = (x: number, y = 4.6, z = 2.9, fov = 50): Pose => ({ p: [x, y, z], l: [x, 0.3, -1.6], fov });
const near = (q: V3, dx = 0.55, dy = 0.75, dz = 2.0, fov = 36): Pose => ({ p: [q[0] + dx, q[1] + dy, q[2] + dz], l: q, fov });
export const posesOf = (sc: Scene): Record<string, Pose> => {
  const P = PTS[sc], o: Record<string, Pose> = {};
  for (const k of Object.keys(P)) o[k] = near(P[k]);
  if (sc === "papeles") Object.assign(o, {
    desk: { p: [3.6, 1.45, 0.25], l: [2.85, 0.7, -1.55], fov: 36 }, cabinet: { p: [4.7, 1.75, 0.7], l: [3.95, 1.05, -1.6], fov: 36 },
    box: { p: [5.9, 1.35, 0.9], l: [6.35, 0.3, -1.8], fov: 38 }, freezer: { p: [-2.7, 2.3, 1.5], l: [-3.9, 1.15, -1.8], fov: 40 },
    glove: { p: [-5.15, 1.95, 1.0], l: [-7.0, 0.8, -0.25], fov: 40 }, mail: { p: [0.6, 1.5, 0.6], l: [-0.2, 0.78, -1.7], fov: 36 },
    manuals: { p: [9.1, 2.05, 0.9], l: [9.22, 1.35, -1.9], fov: 42 }, safe: { p: [8.6, 1.0, 0.4], l: [9.2, 0.3, -2.0], fov: 36 },
    pad: { p: [2.7, 1.55, -0.6], l: [2.2, 0.79, -1.72], fov: 32 }, over0: over(0), over2: over(2.5), over4: over(4.5), overG: over(-3.5), wide: over(0.5, 7.5, 7.0, 50),
  });
  if (sc === "joyas") Object.assign(o, {
    dresser: { p: [4.3, 1.55, 0.6], l: [3.7, 0.8, -1.8], fov: 38 }, dish: { p: [1.35, 1.7, -0.35], l: [0.58, 0.82, -1.9], fov: 34 },
    bed: { p: [3.4, 2.0, 1.6], l: [2.0, 0.4, -1.0], fov: 42 }, wardrobe: { p: [5.9, 1.9, 0.9], l: [5.35, 1.4, -1.8], fov: 40 },
    bath: { p: [-1.0, 1.7, 0.9], l: [-1.5, 0.95, -1.9], fov: 40 }, cookie: { p: [-4.0, 1.7, 0.6], l: [-4.6, 1.0, -1.9], fov: 38 },
    sewing: { p: [7.7, 1.8, 0.3], l: [7.25, 1.2, -2.0], fov: 36 }, safe: { p: [8.0, 1.0, 0.4], l: [8.55, 0.3, -2.0], fov: 36 },
    overB: over(2.4), over0: over(-2.0), wide: over(1.8, 7.5, 7.0, 50),
  });
  if (sc === "llave") Object.assign(o, {
    thumb: { p: [-17.62, 0.86, 0.5], l: [-17.86, 0.58, 0.02], fov: 34 }, entry: over(-1.6, 3.4, 4.6, 50), mat: { p: [-1.7, 1.2, 1.4], l: [-2.2, 0.1, -0.4], fov: 38 }, pot: { p: [-0.7, 1.2, 1.2], l: [-1.4, 0.3, -0.5], fov: 38 },
    frame: { p: [-1.6, 2.2, 1.4], l: [-2.2, 1.8, -1.0], fov: 38 }, hooks: { p: [1.9, 1.6, 0.6], l: [1.55, 1.3, -2.1], fov: 38 },
    back: { p: [5.2, 1.7, 1.8], l: [4.5, 0.7, -0.9], fov: 42 }, car: { p: [-3.7, 2.3, 3.3], l: [-6.6, 0.8, -0.6], fov: 44 },
    keybox: { p: [7.2, 1.3, 1.0], l: [6.7, 0.9, -0.95], fov: 34 }, neighbor: { p: [10.2, 1.7, 2.4], l: [9.6, 1.0, -0.9], fov: 40 },
    wide: over(0.5, 7.0, 8.0, 50),
  });
  if (sc === "vaso") Object.assign(o, {
    knob: { p: [-2.0, 1.32, -0.95], l: [-2.62, 1.02, -2.06], fov: 34 }, glass: { p: [-2.0, 1.3, -1.05], l: [-2.62, 1.06, -2.04], fov: 32 },
    tray: { p: [-2.1, 0.9, -0.7], l: [-2.6, 0.2, -1.9], fov: 34 }, wedge: { p: [-2.5, 0.7, -0.9], l: [-2.95, 0.05, -2.0], fov: 32 },
    door: { p: [-2.2, 1.6, 0.6], l: [-2.95, 0.95, -2.1], fov: 40 }, chain: { p: [1.1, 1.75, -0.9], l: [0.7, 1.5, -2.1], fov: 32 },
    frontdoor: { p: [0.9, 1.5, 0.5], l: [0.4, 1.0, -2.1], fov: 40 }, phone: { p: [3.5, 1.2, -0.9], l: [3.05, 0.62, -1.92], fov: 32 },
    bed: { p: [5.3, 2.1, 1.4], l: [4.2, 0.5, -1.2], fov: 42 }, car: { p: [8.0, 2.0, 3.2], l: [8.6, 0.8, -0.5], fov: 42 },
    kitchen: over(-3.6, 3.8, 2.6, 46), hall: over(0.4, 3.6, 2.6, 46), bedroom: over(4.3, 3.8, 2.8, 46), wide: over(1.0, 7.5, 8.0, 50),
  });
  if (sc === "ventana") Object.assign(o, {
    latch: { p: [-2.9, 1.6, -1.0], l: [-3.2, 1.38, -2.1], fov: 30 }, track: { p: [-3.0, 1.45, -1.0], l: [-3.35, 0.86, -2.1], fov: 32 },
    stick: { p: [-3.4, 1.45, -1.0], l: [-3.7, 0.86, -2.1], fov: 32 }, pane: { p: [-2.6, 1.7, 0.2], l: [-3.2, 1.3, -2.1], fov: 40 },
    screw: { p: [-2.4, 1.8, -1.0], l: [-2.6, 2.0, -2.1], fov: 30 }, lock: { p: [-1.9, 1.8, -1.0], l: [-2.1, 2.0, -2.1], fov: 30 },
    louvre: { p: [1.5, 1.7, -0.6], l: [1.2, 1.85, -2.1], fov: 36 }, window2: { p: [4.8, 1.6, 0.2], l: [4.4, 1.3, -2.1], fov: 40 },
    grille: { p: [8.0, 1.7, 1.6], l: [7.6, 1.4, -0.95], fov: 38 }, roses: { p: [8.1, 1.2, 1.4], l: [7.6, 0.35, -0.6], fov: 38 },
    saw: { p: [10.1, 1.5, 1.4], l: [9.7, 0.55, -0.3], fov: 36 },
    living: over(-3.2, 3.8, 2.6, 46), patio: over(8.4, 3.6, 3.6, 46), wide: over(1.8, 7.5, 8.5, 50),
  });
  if (sc === "porton") Object.assign(o, {
    door: { p: [-4.0, 1.7, 1.9], l: [-4.5, 1.2, -2.1], fov: 46 }, windows: { p: [-4.2, 2.0, -0.6], l: [-4.5, 2.0, -2.1], fov: 34 },
    hanger: { p: [-3.8, 1.9, -0.7], l: [-4.5, 2.05, -2.0], fov: 34 }, cord: { p: [-3.7, 1.7, -0.3], l: [-4.5, 1.9, -1.6], fov: 34 },
    tie: { p: [-4.0, 2.05, -0.8], l: [-4.5, 2.3, -1.6], fov: 26 }, clamp: { p: [-2.4, 2.0, -1.0], l: [-2.85, 1.95, -2.0], fov: 30 },
    remote: { p: [-3.4, 1.7, 0.9], l: [-4.5, 1.1, -0.45], fov: 34 }, tools: { p: [-6.1, 1.4, -0.3], l: [-6.9, 0.9, -1.95], fov: 36 },
    ladder: { p: [-6.2, 1.5, 0.8], l: [-6.9, 0.15, -0.9], fov: 38 }, bolt: { p: [-1.2, 1.4, -1.0], l: [-1.6, 1.1, -2.1], fov: 32 },
    keypad: { p: [5.0, 1.4, 0.2], l: [4.7, 1.2, -0.95], fov: 30 }, sensor: { p: [6.6, 1.6, 2.6], l: [6.3, 1.9, -0.95], fov: 42 },
    front: { p: [6.6, 1.8, 3.6], l: [6.3, 1.1, -0.97], fov: 44 }, garage: over(-4.2, 4.0, 3.4, 48), wide: over(0.5, 7.5, 8.5, 50),
  });
  return o;
};
// la toma de un gráfico (fondo de cartel): vista general de la maqueta
export const WIDE = "wide";

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[], center: V3) => {
  const camAt = (t: number) => {
    if (!KEYS.length) return { p: v3([0, 4, 6]), l: v3([0, 0.5, -1]), fov: 45 };
    let lo = 0, hi = KEYS.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (KEYS[m].t <= t) lo = m; else hi = m - 1; }
    const a = KEYS[lo], b = KEYS[Math.min(lo + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p));
    p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
  };
  const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const c = new THREE.PerspectiveCamera(cm.fov, W / H, 0.05, 200); c.position.copy(cm.p); c.lookAt(cm.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = q.clone().project(c); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, front: v.z < 1 };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const a = screenOf(t - 1 / FPS, center), b = screenOf(t, center);
    return { bx: Math.abs(b.x - a.x) * 0.06, by: Math.abs(b.y - a.y) * 0.06 };
  };
  return { camAt, screenOf, camSpeed };
};
export type Cam = ReturnType<typeof makeCam>;

const CamSet: React.FC<{ t: number; camAt: Cam["camAt"] }> = ({ t, camAt }) => {
  const { camera } = useThree();
  const c = camAt(t), pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(c.p); pc.lookAt(c.l); pc.fov = c.fov; pc.near = 0.05; pc.far = 80; pc.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
type Tx = THREE.Texture;
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w * 2; cv.height = h * 2; const g2 = cv.getContext("2d")!; g2.scale(2, 2); draw(g2);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 16; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t;
};
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const label = (txt: string, bg: string, fg: string, w = 512, h = 160, size = 78) => mk(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${0.05 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * w, rnd(i, 4) * h, 3, 3); }
  g.fillStyle = fg; g.font = `900 ${size}px Montserrat, Arial Black, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 4);
});
const useCasaTex = () => { const base = useTextures(); return useMemo(() => ({
  ...base,
  plaster: mk(256, 256, (g) => { g.fillStyle = "#cfc6b6"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 180 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [3, 1]),
  grass: mk(256, 256, (g) => { g.fillStyle = "#24331f"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 5000; i++) { g.strokeStyle = `rgba(${40 + rnd(i, 1) * 40},${70 + rnd(i, 2) * 50},${30 + rnd(i, 3) * 20},.45)`; g.lineWidth = 0.6; const x = rnd(i, 4) * 256, y = rnd(i, 5) * 256, l = 2 + rnd(i, 6) * 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd(i, 7) - 0.5) * 2, y - l); g.stroke(); } }, [10, 4]),
  soil: mk(256, 256, (g) => { const cs = ["#6a4a30", "#7a5838", "#8a6a48", "#9a8468"]; for (let r = 0; r < 4; r++) { g.fillStyle = cs[r]; g.fillRect(0, r * 64, 256, 64); } for (let i = 0; i < 700; i++) { g.fillStyle = i % 3 ? `rgba(40,26,14,${0.35 * rnd(i, 2)})` : `rgba(190,150,100,${0.5 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 0, 6.3); g.fill(); } }, [6, 1]),
  folderBlue: label("IMPORTANTE", "#2c5fb3", "#f2f2f2", 512, 160, 70),
  manuals: label("MANUALES", "#6f6a5e", "#f1ead7", 512, 200, 84),
  mailTop: mk(256, 160, (g) => { g.fillStyle = "#f1ece0"; g.fillRect(0, 0, 256, 160); g.fillStyle = "#b9b2a2"; for (let k = 0; k < 6; k++) g.fillRect(24, 30 + k * 18, 140 - k * 8, 6); g.fillStyle = "#2c5fb3"; g.fillRect(186, 20, 46, 32); }),
  pad: mk(128, 160, (g) => { g.fillStyle = "#d8b24a"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#f6f0de"; g.fillRect(10, 10, 108, 140); g.fillStyle = "#555"; for (let k = 0; k < 7; k++) g.fillRect(18, 24 + k * 17, 60 + rnd(k, 3) * 30, 4); }),
  quilt: mk(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = ["#b8574a", "#e5d6b8", "#6d8a9e", "#d9a441"][(x + y * 3) % 4]; g.fillRect(x * 32, y * 32, 32, 32); } g.strokeStyle = "rgba(0,0,0,.18)"; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, 256); g.moveTo(0, i * 32); g.lineTo(256, i * 32); g.stroke(); } }),
  bathTile: mk(256, 256, (g) => { g.fillStyle = "#dfe8ea"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#a9b8bc"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, 256); g.moveTo(0, i * 32); g.lineTo(256, i * 32); g.stroke(); } }, [3, 2]),
  sky: mk(64, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#8fbbe8"); gr.addColorStop(1, "#e9f0f3"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); }),
  ivy: mk(256, 256, (g) => { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${30 + rnd(i, 1) * 40},${90 + rnd(i, 2) * 70},${30 + rnd(i, 3) * 30},.85)`; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, 6, 4, rnd(i, 6) * 3, 0, 6.3); g.fill(); } }),
  sewTin: label("COSTURA", "#2f6b8f", "#f4ecd8", 512, 160, 70),
}), [base]); };
type TX = ReturnType<typeof useCasaTex>;

// ---------------- piezas comunes ----------------
// v2: material físico; la madera y lo pintado (rugosidad 0,45-0,75, no metal) llevan laca suave (clearcoat) para que brille el borde
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; cc?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, cc }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshPhysicalMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} clearcoat={cc ?? (m < 0.3 && r >= 0.45 && r <= 0.75 ? 0.45 : 0)} clearcoatRoughness={0.28} /></mesh>
);
// vidrio de verdad: casi transparente, refleja el entorno (sin transmisión, que es cara en el farm)
const Glass: React.FC<{ p: V3; s: [number, number]; rot?: V3; tint?: string; op?: number }> = ({ p, s, rot, tint = "#cfe6f5", op = 0.1 }) => (
  <mesh position={p} rotation={rot}><planeGeometry args={s} /><meshPhysicalMaterial color={tint} transparent opacity={op} roughness={0.04} metalness={0} clearcoat={0.6} clearcoatRoughness={0.05} envMapIntensity={0.55} side={THREE.DoubleSide} depthWrite={false} /></mesh>
);
// la noche detrás de un vidrio: barrio en silueta, luna y ventanas cálidas (nunca un azul plano)
const NightView: React.FC<{ p: V3; s: [number, number]; tex: TX; u?: number }> = ({ p, s, tex, u = 0 }) => {
  const m = useMemo(() => { const t = tex.night.clone(); t.needsUpdate = true; t.repeat.set(Math.max(0.35, s[0] / 2.2), Math.max(0.5, s[1] / 1.1)); t.offset.set(u, 0.05); return t; }, [tex, s, u]);
  return <mesh position={p}><planeGeometry args={s} /><meshBasicMaterial map={m} toneMapped={false} /></mesh>;
};
// cortina de tela con pliegues (sheen = brillo de tela)
const Curtain: React.FC<{ p: V3; w: number; h: number; tex: TX }> = ({ p, w, h, tex }) => (
  <mesh position={p} castShadow><boxGeometry args={[w, h, 0.03, 1, 1, 1]} /><meshPhysicalMaterial map={tex.curtain} roughness={0.9} sheen={1} sheenColor="#fff0dc" sheenRoughness={0.5} /></mesh>
);
// cuadro con marco dorado o de madera, colgado de la pared del fondo
const Art: React.FC<{ p: V3; n: number; tex: TX; w?: number; h?: number; gold?: boolean }> = ({ p, n, tex, w = 0.34, h = 0.42, gold }) => (
  <group position={p}>
    <Box p={[0, 0, 0]} s={[w + 0.06, h + 0.06, 0.035]} c={gold ? "#b8913f" : "#5a381f"} m={gold ? 0.85 : 0} r={gold ? 0.3 : 0.55} rad={0.012} />
    <mesh position={[0, 0, 0.019]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex.art[n % 4]} roughness={0.75} /></mesh>
    <Glass p={[0, 0, 0.022]} s={[w, h]} op={0.08} />
  </group>
);
// llave de luz y enchufe (lo que hace que una pared parezca de una casa)
const Switch: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}><Box p={[0, 0, 0]} s={[0.08, 0.12, 0.012]} c="#f4f1ea" r={0.35} rad={0.006} /><Box p={[0, 0, 0.009]} s={[0.022, 0.04, 0.01]} c="#e8e4da" r={0.3} rad={0.004} /></group>
);
// arbusto / planta de maceta: 60 hojas planas orientadas al azar (no una esfera verde)
const Shrub: React.FC<{ p: V3; r?: number; h?: number; tex: TX; seed?: number; flowers?: string; k?: number }> = ({ p, r = 0.28, h = 0.4, tex, seed = 1, flowers, k = 1 }) => (
  <group position={p} scale={k}>
    {Array.from({ length: 110 }, (_, i) => { const a = rnd(i, seed) * 6.28, rr = r * Math.sqrt(rnd(i, seed + 1)), y = h * (0.2 + 0.8 * rnd(i, seed + 2));
      return <mesh key={i} position={[Math.cos(a) * rr, y, Math.sin(a) * rr]} rotation={[rnd(i, seed + 3) * 3, a, rnd(i, seed + 4) * 3]} scale={[1, 0.12, 0.48]} castShadow>
        <sphereGeometry args={[0.05, 8, 6]} /><meshPhysicalMaterial color={["#2f5a28", "#3d6b33", "#4a7a3a", "#28502a"][i % 4]} roughness={0.55} clearcoat={0.3} clearcoatRoughness={0.4} sheen={0.4} sheenColor="#bfe0a0" /></mesh>; })}
    {Array.from({ length: 5 }, (_, i) => <mesh key={"s" + i} position={[(rnd(i, seed + 6) - 0.5) * r * 0.6, h * 0.3, (rnd(i, seed + 7) - 0.5) * r * 0.6]} rotation={[(rnd(i, seed + 8) - 0.5) * 0.5, 0, (rnd(i, seed + 9) - 0.5) * 0.5]}><cylinderGeometry args={[0.006, 0.01, h * 0.6, 5]} /><meshStandardMaterial color="#4a3a22" roughness={0.9} /></mesh>)}
    {flowers && Array.from({ length: 8 }, (_, i) => { const a = rnd(i, seed + 10) * 6.28, rr = r * 0.85;
      return <group key={"f" + i} position={[Math.cos(a) * rr, h * (0.6 + 0.4 * rnd(i, seed + 11)), Math.sin(a) * rr]}>
        {[0, 1, 2, 3, 4].map((q) => <mesh key={q} position={[Math.cos(q * 1.26) * 0.018, 0, Math.sin(q * 1.26) * 0.018]} scale={[1, 0.7, 1]}><sphereGeometry args={[0.024, 10, 8]} /><meshPhysicalMaterial color={flowers} roughness={0.45} sheen={0.8} sheenColor="#ffd0d8" /></mesh>)}
        <mesh position={[0, 0.012, 0]}><sphereGeometry args={[0.02, 10, 8]} /><meshPhysicalMaterial color={flowers} roughness={0.5} /></mesh>
      </group>; })}
  </group>
);
// polvo flotando en la luz de una lámpara (aditivo, muy suave)
const Dust: React.FC<{ p: V3; t: number; n?: number; r?: number }> = ({ p, t, n = 16, r = 0.7 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => {
    const y = ((rnd(i, 1) + t * 0.02 * (0.5 + rnd(i, 2))) % 1) * 1.2 - 0.3;
    return <mesh key={i} position={[(rnd(i, 3) - 0.5) * r * 2 + Math.sin(t * 0.3 + i) * 0.03, y, (rnd(i, 4) - 0.5) * r]}><sphereGeometry args={[0.0025 + 0.0015 * rnd(i, 5), 6, 4]} /><meshBasicMaterial color="#ffe6b8" transparent opacity={0.12 + 0.1 * rnd(i, 6)} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>;
  })}</group>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rough?: number; m?: number; rot?: V3; r2?: number }> = ({ p, r, h, c, rough = 0.7, m = 0, rot, r2 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, 28]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} /></mesh>
);
const Plane: React.FC<{ p: V3; s: [number, number]; map: Tx; rot?: V3 }> = ({ p, s, map, rot }) => (
  <mesh position={p} rotation={rot}><planeGeometry args={s} /><meshStandardMaterial map={map} roughness={0.8} /></mesh>
);

// halo pulsante = "el ladrón lo piensa" (rojo) o "aquí no mira" (verde)
// v2: cerca de la cámara (primer plano) el halo baja hasta ~25 %, para no lavar la pieza que se está mostrando
const Heat: React.FC<{ p: V3; on: number; t: number; col?: string; r?: number; cd?: number }> = ({ p, on: on0, t, col = "#ff3a2a", r = 0.42, cd = 9 }) => {
  // de cerca el resplandor lava el plano: sólo queda el aro del piso, tenue; columna y luz desde ~3,5 m
  const far = cl((cd - 2.2) / 2.5), on = on0 * (0.15 + 0.85 * far), vol = on0 * far * far;
  if (on < 0.01) return null;
  const pul = 0.8 + 0.2 * Math.sin(t * 6);
  return (
    <group position={[p[0], 0.012, p[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.82, r, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * on} toneMapped={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r * 0.82, 48]} /><meshBasicMaterial color={col} transparent opacity={0.18 * on * pul} toneMapped={false} /></mesh>
      <mesh position={[0, (p[1] + 0.5) / 2, 0]}><cylinderGeometry args={[r * 0.3, r * 0.6, p[1] + 0.5, 32, 1, true]} /><meshBasicMaterial color={col} transparent opacity={0.06 * vol * pul} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, p[1] + 0.2, 0.25]} color={col} intensity={0.9 * vol * pul} distance={1.0} />
    </group>
  );
};

// recorrido del ladrón: puntos rojos en el piso, pasando por los escondites en orden
const Trail: React.FC<{ k: number; path: V3[] }> = ({ k, path }) => {
  if (k < 0.005 || path.length < 2) return null;
  const pts: V3[] = [];
  for (let i = 0; i < path.length - 1; i++) { const a = path[i], b = path[i + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[2] - a[2]) / 0.22); for (let j = 0; j < n; j++) pts.push([lerp(a[0], b[0], j / n), 0.02, lerp(a[2], b[2], j / n)]); }
  const shown = Math.floor(pts.length * k);
  return <>{pts.slice(0, shown).map((q, i) => <mesh key={i} position={q} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.045, 12]} /><meshBasicMaterial color="#ff5040" toneMapped={false} transparent opacity={0.85} /></mesh>)}</>;
};

// v2: piso barnizado; pared con empapelado arriba, lambrín abajo, moldura, zócalo y cornisa (salvo azulejo o garaje = pared lisa)
const Room: React.FC<{ x0: number; x1: number; floor: string; tex: TX; planks?: Tx; wall?: Tx; wallC?: string; plain?: boolean }> = ({ x0, x1, floor, tex, planks, wall, wallC = "#cfc6b6", plain }) => {
  const w = x1 - x0, cx = (x0 + x1) / 2, fancy = !wall && !plain;
  const wp = useMemo(() => { const t = tex.wallpaper.clone(); t.needsUpdate = true; t.repeat.set(w / 1.6, 1.4); return t; }, [tex, w]);
  const ws = useMemo(() => { const t = tex.wainscot.clone(); t.needsUpdate = true; t.repeat.set(w / 1.4, 1); return t; }, [tex, w]);
  return (
    <group>
      <mesh position={[cx, 0, -1.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.3]} /><meshPhysicalMaterial color={planks ? floor : floor === "#b8b0a2" ? "#ffffff" : floor} map={planks ?? (floor === "#b8b0a2" ? tex.tile : undefined)} roughness={planks ? 0.42 : 0.5} clearcoat={planks ? 0.7 : 0.2} clearcoatRoughness={0.18} /></mesh>
      {fancy ? <>
        <Box p={[cx, 1.75, -2.25]} s={[w, 1.7, 0.1]} c={wallC} map={wp} r={0.88} rad={0.01} cc={0} />
        <Box p={[cx, 0.45, -2.24]} s={[w, 0.9, 0.12]} c="#efe8da" map={ws} r={0.5} rad={0.01} cc={0.5} />
        <Box p={[cx, 0.91, -2.17]} s={[w, 0.05, 0.05]} c="#f3ede1" r={0.45} rad={0.012} cc={0.5} />
        <Box p={[cx, 0.06, -2.17]} s={[w, 0.12, 0.04]} c="#f3ede1" r={0.45} rad={0.01} cc={0.5} />
        <Box p={[cx, 2.56, -2.16]} s={[w, 0.08, 0.08]} c="#d8ccb6" r={0.7} rad={0.02} cc={0} />
      </> : <>
        <Box p={[cx, 1.3, -2.25]} s={[w, 2.6, 0.1]} c={wallC} map={wall ?? tex.plaster} r={wall ? 0.25 : 0.95} rad={0.01} cc={wall ? 0.6 : 0} />
        {!wall && <Box p={[cx, 0.06, -2.18]} s={[w, 0.12, 0.03]} c="#8e8a82" r={0.8} rad={0.01} />}
      </>}
      <Box p={[x1, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" map={tex.plaster} r={0.95} rad={0.01} />
      <Box p={[x1, 1.41, -1.1]} s={[0.14, 0.03, 2.3]} c="#b9a98f" r={0.7} rad={0.01} cc={0} />
    </group>
  );
};
const Ground: React.FC<{ tex: TX; w?: number; cx?: number }> = ({ tex, w = 26, cx = 0.5 }) => (
  <>
    <mesh position={[cx, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 7]} /><meshStandardMaterial map={tex.grass} roughness={1} /></mesh>
    <Box p={[cx, -0.64, 0]} s={[w, 1.2, 7]} c="#3a2a1c" map={tex.soil} r={1} rad={0.01} cast={false} />
  </>
);
const Car: React.FC<{ x: number; glove: number }> = ({ x, glove }) => (
  <group position={[x, 0, -0.5]}>
    <Box p={[0, 0.48, 0]} s={[1.8, 0.6, 3.6]} c="#5d6b78" r={0.35} m={0.55} rad={0.18} />
    <Box p={[0, 0.98, -0.15]} s={[1.6, 0.5, 1.9]} c="#4a5662" r={0.3} m={0.4} rad={0.2} />
    <Box p={[0, 0.98, 0.83]} s={[1.5, 0.42, 0.06]} c="#1c2630" r={0.05} m={0.2} rad={0.02} />
    {[[-0.85, 1.25], [0.85, 1.25], [-0.85, -1.25], [0.85, -1.25]].map(([a, z], i) => <mesh key={i} position={[a, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 24]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>)}
    <group position={[0.15, 0.78, 0.15]} rotation={[-1.1 * glove, 0, 0]}><Box p={[0, -0.06, 0.06]} s={[0.42, 0.12, 0.02]} c="#2d343b" r={0.6} /></group>
    {glove > 0.05 && <Box p={[0.15, 0.74, 0.12]} s={[0.3, 0.02, 0.2]} c="#efe8d6" r={0.9} />}
  </group>
);
const Trunk: React.FC<{ x: number; k: number }> = ({ x, k }) => (
  <group position={[x, 0, -2.0]}>
    <Box p={[0, 0.2, -0.05]} s={[0.46, 0.36, 0.36]} c="#3a3f44" r={0.35} m={0.7} />
    {[-0.17, 0.17].map((a, i) => <mesh key={i} position={[a, 0.025, 0.12]}><cylinderGeometry args={[0.02, 0.02, 0.03, 12]} /><meshStandardMaterial color="#c9c9c9" metalness={1} roughness={0.3} /></mesh>)}
    <Box p={[0.55 * k, 0.24, 0.42]} s={[0.9, 0.46, 0.44]} c="#5b3b22" r={0.7} rad={0.04} />
  </group>
);

// ======================= ESCENA · PAPELES (la casa de cerpapeles) =======================
const Papeles: React.FC<{ tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number> }> = ({ tex, tx, a }) => (
  <>
    <Ground tex={tex} />
    <Room x0={-9} x1={-5.5} floor="#55585b" tex={tex} /><Room x0={-5.5} x1={-2} floor="#b8b0a2" tex={tex} />
    <Room x0={-2} x1={1.5} floor="#9a7b5a" tex={tex} planks={tx.planks} /><Room x0={1.5} x1={4.5} floor="#9a7b5a" tex={tex} planks={tx.planks} />
    <Room x0={4.5} x1={8.5} floor="#8e7a63" tex={tex} planks={tx.planks} /><Room x0={8.5} x1={10} floor="#9a7b5a" tex={tex} planks={tx.planks} />
    <Box p={[-9, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
    <Box p={[-1.95, 1.0, -0.6]} s={[0.12, 2.0, 0.9]} c="#5b3b22" r={0.6} />
    <Box p={[0.6, 0.35, -1.7]} s={[1.6, 0.7, 0.7]} c="#4f5d6e" r={0.95} rad={0.12} />
    <Box p={[-0.2, 0.38, -1.7]} s={[0.5, 0.76, 0.4]} c="#6b4426" />
    <Plane p={[-0.2, 0.79, -1.7]} s={[0.32, 0.2]} map={tex.mailTop} rot={[-Math.PI / 2, 0, 0.15]} />
    <Box p={[-3.1, 0.45, -1.95]} s={[1.8, 0.9, 0.6]} c="#7c6a55" r={0.7} /><Box p={[-3.1, 0.92, -1.95]} s={[1.84, 0.05, 0.64]} c="#d9d4ca" r={0.4} />
    <Box p={[-3.1, 1.85, -2.05]} s={[1.8, 0.6, 0.36]} c="#6d5c48" r={0.7} />
    <Box p={[-2.5, 1.05, -2.0]} s={[0.32, 0.2, 0.2]} c="#a33a2c" r={0.5} rad={0.04} />
    {/* heladera con congelador */}
    <group position={[-4.3, 0, -1.95]}>
      <Box p={[0, 0.9, 0]} s={[0.78, 1.8, 0.7]} c="#8f979e" r={0.35} m={0.55} rad={0.05} />
      <group position={[-0.39, 1.6, 0.36]} rotation={[0, -1.6 * (a.freezer ?? 0), 0]}><Box p={[0.39, 0, 0.02]} s={[0.78, 0.4, 0.05]} c="#98a0a7" r={0.35} m={0.55} /></group>
      {(a.freezer ?? 0) > 0.05 && <Box p={[0, 1.6, 0.05]} s={[0.66, 0.32, 0.5]} c="#b8dcf0" r={0.6} e="#9ad4ff" ei={0.6 * (a.freezer ?? 0)} />}
    </group>
    <Car x={-7.2} glove={a.glove ?? 0} />
    {/* escritorio con el primer cajón */}
    <group position={[2.55, 0, -1.85]}>
      <Box p={[0, 0.74, 0]} s={[1.4, 0.05, 0.7]} c="#6b4426" r={0.6} />
      <Box p={[-0.62, 0.36, 0]} s={[0.06, 0.72, 0.66]} c="#5a381f" /><Box p={[0.42, 0.36, 0]} s={[0.5, 0.72, 0.66]} c="#5a381f" />
      <group position={[0.42, 0.62, 0.05 + 0.32 * (a.drawer ?? 0)]}>
        <Box p={[0, 0, 0]} s={[0.46, 0.14, 0.6]} c="#6e4628" /><Box p={[0, 0.02, 0.31]} s={[0.12, 0.025, 0.02]} c="#c9b07a" m={0.8} r={0.3} />
        <Plane p={[0, 0.075, 0]} s={[0.36, 0.26]} map={tex.folderBlue} rot={[-Math.PI / 2, 0, 0]} />
      </group>
      <Box p={[-0.35, 0.79, 0.05]} s={[0.3, 0.06, 0.22]} c="#ece6d8" r={0.95} />
      <Plane p={[-0.35, 0.785, 0.13]} s={[0.1, 0.13]} map={tex.pad} rot={[-Math.PI / 2, 0, 0.2]} />
    </group>
    {/* archivador con llavecita */}
    <group position={[3.95, 0, -1.95]}>
      <Box p={[0, 0.66, 0]} s={[0.5, 1.32, 0.62]} c="#7d858c" r={0.4} m={0.6} />
      {[0, 1, 2, 3].map((k) => <group key={k} position={[0, 0.2 + k * 0.31, 0.31 + (k === 3 ? 0.12 * (a.pry ?? 0) : 0)]}><Box p={[0, 0, 0]} s={[0.46, 0.28, 0.02]} c="#8c949b" r={0.35} m={0.6} /></group>)}
    </group>
    {/* ropero con la caja contra el fuego */}
    <group position={[6.35, 0, -2.0]}>
      <Box p={[0, 1.05, -0.05]} s={[1.3, 2.1, 0.56]} c="#7a5634" r={0.7} /><Box p={[0, 1.05, 0.2]} s={[1.18, 1.98, 0.06]} c="#3a2a1d" r={0.9} />
      <group position={[-0.62, 1.05, 0.26]} rotation={[0, -1.9 * (a.wardrobe ?? 0), 0]}><Box p={[0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
      <group position={[0.62, 1.05, 0.26]} rotation={[0, 1.9 * (a.wardrobe ?? 0), 0]}><Box p={[-0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
      {[-0.4, -0.2, 0.05, 0.3].map((x, i) => <Box key={i} p={[x, 1.45, 0.12]} s={[0.16, 0.8, 0.3]} c={["#4b5a73", "#7b2f2f", "#c8c1b0", "#2f4a3a"][i]} r={0.95} />)}
      <group position={[0, 0.17 + 0.9 * (a.lift ?? 0), 0.1 + 0.6 * (a.lift ?? 0)]}><Box p={[0, 0, 0]} s={[0.44, 0.3, 0.34]} c="#6f767c" r={0.45} m={0.5} rad={0.03} /></group>
    </group>
    <Box p={[7.75, 0.28, -0.9]} s={[1.3, 0.4, 2.0]} c="#d9d2c4" r={0.95} rad={0.08} />
    {/* placard con MANUALES y la caja atornillada detrás del baúl */}
    <group position={[9.2, 0, -2.0]}>
      <Box p={[0, 1.15, -0.05]} s={[1.1, 2.3, 0.5]} c="#bfb39c" r={0.85} />
      {[0.8, 1.5].map((y, i) => <Box key={i} p={[0, y, 0.05]} s={[1.02, 0.03, 0.42]} c="#d8cdb6" r={0.8} />)}
      {[-0.36, -0.26, -0.17].map((x, i) => <Box key={i} p={[x, 1.68, 0.05]} s={[0.08, 0.34, 0.3]} c={["#8a6b4a", "#5f6e57", "#7a7466"][i]} />)}
      <group position={[0.08, 1.7, 0.05]}><Box p={[0, 0, 0]} s={[0.2, 0.38, 0.32]} c="#6f6a5e" /><Plane p={[0, 0, 0.165]} s={[0.18, 0.08]} map={tex.manuals} /></group>
    </group>
    <Trunk x={9.2} k={a.trunk ?? 0} />
  </>
);

// ======================= ESCENA · JOYAS =======================
const Joyas: React.FC<{ tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number> }> = ({ tex, tx, a }) => {
  const dr = a.drawer2 ?? 0, jb = a.jbox ?? 0, mt = a.mattress ?? 0, sc = a.suitcase ?? 0, mi = a.mirror ?? 0, wd = a.wardrobe ?? 0;
  return (
    <>
      <Ground tex={tex} />
      <Room x0={-6} x1={-2.6} floor="#b8b0a2" tex={tex} />
      <Room x0={-2.6} x1={-0.3} floor="#cdd6d8" tex={tex} wall={tex.bathTile} wallC="#dfe8ea" />
      <Room x0={-0.3} x1={6.3} floor="#9a7b5a" tex={tex} planks={tx.planks} wallC="#d8c8b4" />
      <Room x0={6.3} x1={9.6} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[-6, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      {/* COCINA: mesada, alacena, lata de galletas y tarro de azúcar */}
      <Box p={[-4.3, 0.45, -1.95]} s={[2.4, 0.9, 0.6]} c="#7c6a55" r={0.7} /><Box p={[-4.3, 0.92, -1.95]} s={[2.44, 0.05, 0.64]} c="#d9d4ca" r={0.4} />
      <Box p={[-4.3, 1.85, -2.05]} s={[2.4, 0.6, 0.36]} c="#6d5c48" r={0.7} />
      <Cyl p={[-4.6, 1.02, -1.95]} r={0.13} h={0.14} c="#2f5f9e" m={0.6} rough={0.35} />
      <Cyl p={[-4.15, 1.06, -2.0]} r={0.08} h={0.22} c="#e8eef0" rough={0.15} />
      <Box p={[-3.5, 1.05, -2.0]} s={[0.32, 0.2, 0.2]} c="#a33a2c" r={0.5} rad={0.04} />
      {/* BAÑO: lavabo con botiquín de espejo (se abre) e inodoro con tanque */}
      <Box p={[-1.75, 0.42, -1.95]} s={[0.7, 0.84, 0.5]} c="#efefea" r={0.3} />
      <Cyl p={[-1.75, 0.86, -1.9]} r={0.2} h={0.06} c="#fafafa" rough={0.2} />
      <Box p={[-1.75, 1.6, -2.18]} s={[0.62, 0.62, 0.12]} c="#d7dcde" r={0.3} />
      <group position={[-2.06, 1.6, -2.1]} rotation={[0, -1.7 * mi, 0]}><Box p={[0.31, 0, 0.02]} s={[0.6, 0.6, 0.03]} c="#bfe0ee" r={0.05} m={0.9} /></group>
      {mi > 0.05 && [-0.15, 0, 0.15].map((x, i) => <Cyl key={i} p={[-1.75 + x, 1.5, -2.14]} r={0.04} h={0.12} c={["#e07b39", "#f2f2f2", "#7fb6d9"][i]} />)}
      <Box p={[-0.95, 0.22, -1.8]} s={[0.4, 0.44, 0.55]} c="#f4f4f0" r={0.3} rad={0.1} />
      <Box p={[-0.95, 0.72, -2.08]} s={[0.46, 0.5, 0.2]} c="#f4f4f0" r={0.3} rad={0.05} />
      {/* DORMITORIO: mesita con platito, cama con colchón y valija, cómoda con joyero, ropero */}
      <Box p={[0.55, 0.28, -1.95]} s={[0.5, 0.56, 0.44]} c="#6b4426" />
      <Cyl p={[0.6, 0.575, -1.86]} r={0.12} h={0.02} c="#e9d9c7" rough={0.3} />
      {[[0.56, -1.84], [0.65, -1.89]].map(([x, z], i) => <mesh key={i} position={[x, 0.6, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.007, 8, 20]} /><meshStandardMaterial color="#ffd27a" metalness={1} roughness={0.2} /></mesh>)}
      <Cyl p={[0.38, 0.68, -2.12]} r={0.06} h={0.22} c="#d9c39a" r2={0.09} />
      <group position={[2.0, 0, -1.2]}>
        <Box p={[0, 0.22, 0]} s={[1.6, 0.26, 2.0]} c="#5a381f" r={0.7} />
        <Box p={[0, 0.7, -1.0]} s={[1.7, 1.0, 0.08]} c="#5a381f" r={0.7} />
        <group position={[0, 0.4, -0.9]} rotation={[0.55 * mt, 0, 0]}>
          <Box p={[0, 0.07, 0.9]} s={[1.5, 0.18, 1.85]} c="#f1ede4" r={0.95} rad={0.06} />
          <Plane p={[0, 0.165, 1.0]} s={[1.46, 1.5]} map={tex.quilt} rot={[-Math.PI / 2, 0, 0]} />
        </group>
        <Box p={[-0.4, 0.62, -0.75]} s={[0.5, 0.12, 0.3]} c="#f6f3ec" r={0.95} rad={0.05} /><Box p={[0.4, 0.62, -0.75]} s={[0.5, 0.12, 0.3]} c="#f6f3ec" r={0.95} rad={0.05} />
        <Box p={[0.1, 0.14, 0.85 + 0.9 * sc]} s={[0.7, 0.2, 0.5]} c="#7a4b2a" r={0.6} rad={0.03} />
      </group>
      <group position={[3.75, 0, -1.98]}>
        <Box p={[0, 0.45, 0]} s={[1.2, 0.9, 0.5]} c="#7a5634" r={0.65} />
        {[0.2, 0.48, 0.74].map((y, k) => <group key={k} position={[0, y, 0.26 + (k === 1 ? 0.34 * dr : 0)]}>
          <Box p={[0, 0, -0.17 * (k === 1 ? 1 : 0)]} s={[1.1, 0.22, k === 1 ? 0.42 : 0.04]} c="#86603b" r={0.6} />
          {k === 1 && dr > 0.05 && [-0.3, -0.05, 0.2, 0.4].map((x, i) => <Box key={i} p={[x, 0.08, -0.15]} s={[0.18, 0.06, 0.25]} c={["#f0e6e6", "#c9d6e8", "#e8d9c0", "#ddd"][i]} r={0.95} rad={0.03} />)}
          <Box p={[0, 0.02, 0.03]} s={[0.16, 0.025, 0.02]} c="#c9b07a" m={0.8} r={0.3} />
        </group>)}
        <Box p={[0, 1.5, -0.2]} s={[0.8, 1.0, 0.04]} c="#bcd3dd" m={0.9} r={0.05} />
        {/* el joyero: tapa que se abre + brillo dorado */}
        <group position={[0.1, 0.97, 0.05]}>
          <Box p={[0, 0, 0]} s={[0.34, 0.14, 0.22]} c="#8a2f3f" r={0.5} rad={0.02} />
          <group position={[0, 0.07, -0.11]} rotation={[-1.4 * jb, 0, 0]}><Box p={[0, 0.02, 0.11]} s={[0.35, 0.04, 0.23]} c="#9a3747" r={0.5} rad={0.015} /></group>
          {jb > 0.05 && <Box p={[0, 0.06, 0]} s={[0.28, 0.02, 0.16]} c="#ffd27a" e="#ffb94a" ei={0.8 * jb} m={1} r={0.2} />}
        </group>
      </group>
      <group position={[5.35, 0, -2.0]}>
        <Box p={[0, 1.05, -0.05]} s={[1.3, 2.1, 0.56]} c="#7a5634" r={0.7} /><Box p={[0, 1.05, 0.2]} s={[1.18, 1.98, 0.06]} c="#3a2a1d" r={0.9} />
        <group position={[-0.62, 1.05, 0.26]} rotation={[0, -1.9 * wd, 0]}><Box p={[0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
        <group position={[0.62, 1.05, 0.26]} rotation={[0, 1.9 * wd, 0]}><Box p={[-0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
        {[-0.4, -0.15, 0.1, 0.35].map((x, i) => <Box key={i} p={[x, 1.2, 0.12]} s={[0.2, 1.0, 0.32]} c={["#2f3b4f", "#6e2a2a", "#3b4a3a", "#141414"][i]} r={0.95} />)}
        {[-0.3, 0.05, 0.38].map((x, i) => <Box key={i} p={[x, 1.92, 0.1]} s={[0.3, 0.16, 0.3]} c={["#c9b38f", "#b5a07d", "#d8c7a6"][i]} r={0.9} />)}
        <Cyl p={[0.2, 2.18, -0.05]} r={0.12} h={0.12} c="#7d8b95" m={0.6} rough={0.4} />
      </group>
      {/* CUARTO DE COSTURA: mesa con máquina, estante con la caja de costura, placard con caja atornillada */}
      <Box p={[7.1, 0.38, -1.75]} s={[1.2, 0.05, 0.6]} c="#6b4426" r={0.6} />
      {[-0.55, 0.55].map((x, i) => <Box key={i} p={[7.1 + x, 0.18, -1.75]} s={[0.05, 0.36, 0.55]} c="#5a381f" />)}
      <Box p={[6.9, 0.55, -1.8]} s={[0.45, 0.3, 0.22]} c="#e6e1d2" r={0.4} rad={0.04} />
      <Box p={[7.25, 1.12, -2.08]} s={[1.0, 0.04, 0.3]} c="#d8cdb6" r={0.8} />
      <group position={[7.25, 1.22, -2.05]}>
        <Cyl p={[0, 0, 0]} r={0.16} h={0.16} c="#2f6b8f" m={0.6} rough={0.35} />
        <Plane p={[0, 0, 0.162]} s={[0.22, 0.07]} map={tex.sewTin} />
      </group>
      <Cyl p={[7.6, 1.2, -2.05]} r={0.05} h={0.14} c="#e9eef0" rough={0.1} />
      <Trunk x={8.55} k={a.trunk ?? 0} />
    </>
  );
};

// ======================= ESCENA · LLAVE (de día) =======================
// v2 premium: texturas de la fachada (tejas, ladrillo del zócalo, felpudo de coco)
const useLlaveTex = () => useMemo(() => ({
  tiles: mk(256, 256, (g) => { for (let r = 0; r < 8; r++) for (let k = 0; k < 9; k++) { const v = rnd(r * 9 + k, 4); g.fillStyle = `rgb(${150 + v * 30},${70 + v * 18},${48 + v * 10})`; g.fillRect(k * 32 - (r % 2) * 16, r * 32, 31, 30); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(k * 32 - (r % 2) * 16, r * 32 + 24, 31, 6); } }, [6, 2]),
  brick: mk(256, 128, (g) => { g.fillStyle = "#8f8576"; g.fillRect(0, 0, 256, 128); for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { const v = rnd(r * 5 + k, 7); g.fillStyle = `rgb(${120 + v * 30},${108 + v * 26},${92 + v * 20})`; g.fillRect(k * 56 - (r % 2) * 28 + 2, r * 32 + 2, 52, 28); } }, [8, 1]),
  coir: mk(256, 160, (g) => { g.fillStyle = "#8a6236"; g.fillRect(0, 0, 256, 160); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${90 + rnd(i, 1) * 80},${60 + rnd(i, 2) * 50},${25 + rnd(i, 3) * 25},.7)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 160, 1, 3); } g.strokeStyle = "#4a3018"; g.lineWidth = 10; g.strokeRect(8, 8, 240, 144); }),
}), []);
// enredadera de verdad: hojas sueltas que trepan por la pared (más tupida abajo)
const Ivy: React.FC<{ p: V3; w: number; h: number; seed?: number }> = ({ p, w, h, seed = 3 }) => (
  <group position={p}>
    {Array.from({ length: 6 }, (_, i) => <mesh key={"t" + i} position={[(rnd(i, seed + 20) - 0.5) * w * 0.8, h * 0.45, 0.01]} rotation={[0, 0, (rnd(i, seed + 21) - 0.5) * 0.4]}><cylinderGeometry args={[0.006, 0.012, h * 0.9, 5]} /><meshStandardMaterial color="#5a4630" roughness={0.9} /></mesh>)}
    {Array.from({ length: 320 }, (_, i) => { const y = h * Math.pow(rnd(i, seed), 1.35), sp = 1 - 0.45 * (y / h), x = (rnd(i, seed + 1) - 0.5) * w * sp;
      return <mesh key={i} position={[x, y, 0.025 + 0.04 * rnd(i, seed + 2)]} rotation={[(rnd(i, seed + 3) - 0.5) * 0.8, (rnd(i, seed + 4) - 0.5) * 0.8, rnd(i, seed + 5) * 6.28]} scale={[1, 0.85, 0.16]} castShadow>
        <sphereGeometry args={[0.042 + 0.018 * rnd(i, seed + 6), 8, 6]} /><meshPhysicalMaterial color={["#2f5a28", "#3d6b33", "#4f8040", "#28502a", "#5d8a45"][i % 5]} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.35} sheen={0.4} sheenColor="#cfe8a8" /></mesh>; })}
  </group>
);
// ventana de fachada: marco, travesaños, alféizar, postigos, cortina adentro y vidrio que refleja
const FacadeWin: React.FC<{ p: V3; w?: number; h?: number; tex: TX; shutter?: string }> = ({ p, w = 1.0, h = 0.95, tex, shutter = "#3f5e4a" }) => (
  <group position={p}>
    <Box p={[0, 0, -0.03]} s={[w, h, 0.02]} c="#3a3a36" r={0.9} cc={0} />
    <Curtain p={[-w * 0.3, 0, -0.015]} w={w * 0.32} h={h * 0.95} tex={tex} />
    <Glass p={[0, 0, 0.0]} s={[w, h]} op={0.16} />
    {[[0, h / 2 + 0.04, w + 0.16, 0.08], [0, -h / 2 - 0.03, w + 0.16, 0.06]].map(([x, y, bw, bh], i) => <Box key={i} p={[x, y, 0.02]} s={[bw, bh, 0.08]} c="#f3ede1" r={0.45} rad={0.012} />)}
    {[-1, 1].map((k) => <Box key={k} p={[k * (w / 2 + 0.04), 0, 0.02]} s={[0.08, h + 0.12, 0.08]} c="#f3ede1" r={0.45} rad={0.012} />)}
    <Box p={[0, 0, 0.01]} s={[0.035, h, 0.04]} c="#f3ede1" r={0.45} rad={0.006} /><Box p={[0, 0, 0.01]} s={[w, 0.035, 0.04]} c="#f3ede1" r={0.45} rad={0.006} />
    <Box p={[0, -h / 2 - 0.08, 0.07]} s={[w + 0.28, 0.05, 0.18]} c="#e9e2d4" r={0.5} rad={0.01} />
    {[-1, 1].map((k) => <group key={"p" + k} position={[k * (w / 2 + 0.28), 0, 0.03]}>
      <Box p={[0, 0, 0]} s={[0.4, h + 0.1, 0.04]} c={shutter} r={0.5} rad={0.01} />
      {Array.from({ length: 9 }, (_, j) => <Box key={j} p={[0, -h / 2 + 0.1 + j * (h - 0.1) / 8.5, 0.025]} s={[0.32, 0.025, 0.02]} c={shutter} r={0.45} rot={[0.5, 0, 0]} rad={0.004} />)}
    </group>)}
    {/* jardinera con flores bajo la ventana */}
    <Box p={[0, -h / 2 - 0.2, 0.14]} s={[w * 0.9, 0.16, 0.18]} c="#7a4a2a" r={0.6} rad={0.015} />
    <Shrub p={[0, -h / 2 - 0.16, 0.14]} r={w * 0.38} h={0.16} tex={tex} seed={11} flowers="#e3566a" k={1} />
  </group>
);
// alero de tejas con canaleta (la casa ya no termina en un cono)
const Eave: React.FC<{ x: number; w: number; y: number; tiles: Tx }> = ({ x, w, y, tiles }) => (
  <group position={[x, y, -0.78]}>
    <Box p={[0, 0.18, -0.15]} s={[w + 0.3, 0.07, 1.0]} c="#b0644a" map={tiles} r={0.75} rot={[0.42, 0, 0]} rad={0.01} cc={0} />
    <Box p={[0, -0.03, 0.3]} s={[w + 0.3, 0.14, 0.05]} c="#f3ede1" r={0.5} rad={0.01} />
    <mesh position={[0, -0.07, 0.36]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.045, 0.045, w + 0.3, 16, 1, true, 0, Math.PI]} /><meshStandardMaterial color="#d8d8d4" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} /></mesh>
  </group>
);
// árbol de fondo: tronco y copa de hojas (nada de esferas lisas)
const Tree: React.FC<{ p: V3; k?: number; seed?: number; tex: TX }> = ({ p, k = 1, seed = 2, tex }) => (
  <group position={p} scale={k}>
    <Cyl p={[0, 0.7, 0]} r={0.07} r2={0.11} h={1.4} c="#5a4230" rough={0.95} />
    <Shrub p={[0, 1.0, 0]} r={0.3} h={0.5} tex={tex} seed={seed} k={2.6} />
    <Shrub p={[0.35, 1.55, 0.1]} r={0.25} h={0.4} tex={tex} seed={seed + 3} k={2.2} />
    <Shrub p={[-0.35, 1.45, -0.1]} r={0.25} h={0.4} tex={tex} seed={seed + 5} k={2.2} />
  </group>
);
// auto con carrocería, vidrios, ópticas, llantas y manijas
const Car2: React.FC<{ x: number; glove: number }> = ({ x, glove }) => {
  const body = "#5f7686", dark = "#151c22";
  return (
    <group position={[x, 0, -0.5]}>
      <Box p={[0, 0.52, 0]} s={[1.78, 0.5, 3.9]} c={body} r={0.22} m={0.55} rad={0.17} cc={1} />
      <Box p={[0, 0.98, -0.22]} s={[1.52, 0.46, 1.95]} c={body} r={0.22} m={0.55} rad={0.17} cc={1} />
      <Box p={[0, 0.98, 0.8]} s={[1.38, 0.46, 0.03]} c={dark} r={0.04} m={0.3} rot={[-0.55, 0, 0]} rad={0.01} cc={1} />
      <Box p={[0, 0.98, -1.23]} s={[1.38, 0.42, 0.03]} c={dark} r={0.04} m={0.3} rot={[0.55, 0, 0]} rad={0.01} cc={1} />
      {[-1, 1].map((k) => <group key={k}>
        <Box p={[k * 0.765, 1.0, -0.22]} s={[0.02, 0.32, 1.7]} c={dark} r={0.04} m={0.3} rad={0.005} cc={1} />
        <Box p={[k * 0.775, 1.0, -0.22]} s={[0.02, 0.34, 0.07]} c={body} r={0.22} m={0.55} rad={0.005} />
        <Box p={[k * 0.6, 0.6, 1.94]} s={[0.36, 0.12, 0.03]} c="#f4f1e6" e="#fff6d8" ei={0.4} r={0.1} rad={0.02} />
        <Box p={[k * 0.62, 0.64, -1.94]} s={[0.32, 0.12, 0.03]} c="#8e1218" e="#ff2a2a" ei={0.35} r={0.15} rad={0.02} />
        <Box p={[k * 0.9, 0.62, 0.55]} s={[0.006, 0.42, 0.01]} c={dark} r={0.5} /><Box p={[k * 0.9, 0.62, -0.55]} s={[0.006, 0.42, 0.01]} c={dark} r={0.5} />
        <Box p={[k * 0.9, 0.7, 0.3]} s={[0.02, 0.03, 0.12]} c="#c9ccd0" m={1} r={0.25} rad={0.008} /><Box p={[k * 0.9, 0.7, -0.8]} s={[0.02, 0.03, 0.12]} c="#c9ccd0" m={1} r={0.25} rad={0.008} />
        <Box p={[k * 0.88, 0.95, 0.62]} s={[0.12, 0.08, 0.06]} c={body} r={0.22} m={0.55} rad={0.02} />
      </group>)}
      <Box p={[0, 0.48, 1.95]} s={[0.7, 0.16, 0.03]} c="#1b1d20" m={0.6} r={0.35} rad={0.02} />
      {[1.97, -1.97].map((z, i) => <group key={i}><Box p={[0, 0.3, z]} s={[1.82, 0.14, 0.08]} c="#2a2d31" r={0.5} rad={0.04} /><Box p={[0, 0.42, z + (i ? -0.02 : 0.02)]} s={[0.4, 0.1, 0.01]} c="#eeeeea" r={0.6} rad={0.004} /></group>)}
      {[[-0.85, 1.25], [0.85, 1.25], [-0.85, -1.25], [0.85, -1.25]].map(([a, z], i) => <group key={i} position={[a, 0.32, z]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 32]} /><meshStandardMaterial color="#111" roughness={0.85} /></mesh>
        <mesh position={[Math.sign(a) * 0.112, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.2, 0.2, 0.01, 28]} /><meshStandardMaterial color="#c4c8cc" metalness={1} roughness={0.22} /></mesh>
        {[0, 1, 2, 3, 4].map((q) => <Box key={q} p={[Math.sign(a) * 0.118, 0, 0]} s={[0.01, 0.34, 0.035]} c="#9aa0a6" m={1} r={0.3} rot={[q * 0.628, 0, 0]} rad={0.003} />)}
      </group>)}
      <group position={[0.15, 0.78, 0.15]} rotation={[-1.1 * glove, 0, 0]}><Box p={[0, -0.06, 0.06]} s={[0.42, 0.12, 0.02]} c="#2d343b" r={0.6} /></group>
      {glove > 0.05 && <Box p={[0.15, 0.74, 0.12]} s={[0.3, 0.02, 0.2]} c="#efe8d6" r={0.9} />}
    </group>
  );
};
const Llave: React.FC<{ tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number> }> = ({ tex, tx, a }) => {
  const mat = a.mat ?? 0, pot = a.pot ?? 0, rock = a.rock ?? 0, fr = a.frame ?? 0, ml = a.mail ?? 0, fish = a.fish ?? 0, kb = a.keybox ?? 0;
  const lt = useLlaveTex();
  const LlaveM = ({ p, rot = [0, 0, 0] as V3, c = "#d9b45a" }: { p: V3; rot?: V3; c?: string }) => (
    <group position={p} rotation={rot}><mesh><torusGeometry args={[0.035, 0.012, 10, 24]} /><meshStandardMaterial color={c} metalness={1} roughness={0.22} /></mesh><Box p={[0.08, 0, 0]} s={[0.1, 0.018, 0.01]} c={c} m={1} r={0.22} rad={0.003} />
      {[0.06, 0.09, 0.115].map((x, i) => <Box key={i} p={[x, -0.014, 0]} s={[0.012, 0.012 + 0.006 * (i % 2), 0.01]} c={c} m={1} r={0.22} rad={0.002} />)}</group>
  );
  // zócalo de ladrillo cortado donde va la puerta (gap = centro de la puerta)
  const Wall = ({ x, w, h = 2.8, c = "#e3d8c4", gap }: { x: number; w: number; h?: number; c?: string; gap?: number }) => {
    const x0 = x - w / 2, x1 = x + w / 2, segs = gap === undefined ? [[x0, x1]] : [[x0, gap - 0.56], [gap + 0.56, x1]];
    return <>
      <Box p={[x, h / 2, -1.05]} s={[w, h, 0.14]} c={c} map={tex.plaster} r={0.92} rad={0.01} cc={0} />
      {segs.map(([a0, a1], i) => <group key={i}><Box p={[(a0 + a1) / 2, 0.2, -0.96]} s={[a1 - a0, 0.4, 0.05]} c="#a49a8a" map={lt.brick} r={0.9} rad={0.008} cc={0} />
        <Box p={[(a0 + a1) / 2, 0.42, -0.94]} s={[a1 - a0, 0.04, 0.06]} c="#ece5d6" r={0.5} rad={0.008} /></group>)}
    </>;
  };
  return (
    <>
      {/* fondo de día: cielo con degradé, árboles y cerco vivo detrás de las casas */}
      <mesh position={[1, 4, -9]}><planeGeometry args={[60, 14]} /><meshBasicMaterial map={tex.sky} fog={false} /></mesh>
      {[-11, -7.5, -3.2, 0.2, 4.2, 8, 11.5].map((x, i) => <Tree key={i} p={[x, 0, -4.2 - (i % 2) * 0.8]} k={1.5 + 0.3 * (i % 3)} seed={i * 3 + 1} tex={tex} />)}
      <Ground tex={tex} w={30} cx={1.0} />
      {/* vereda de baldosas con cordón */}
      <Box p={[1.0, 0.01, 2.6]} s={[30, 0.04, 1.6]} c="#b4b0a6" r={0.9} rad={0.01} cast={false} />
      {Array.from({ length: 30 }, (_, i) => <Box key={"b" + i} p={[-14 + i, 0.036, 2.6]} s={[0.012, 0.005, 1.6]} c="#8f8b82" r={1} cast={false} rad={0.001} />)}
      <Box p={[1.0, 0.06, 3.42]} s={[30, 0.12, 0.08]} c="#9c988e" r={0.9} rad={0.02} />
      {/* camino de lajas hasta la puerta */}
      {[0.35, 0.85, 1.35].map((z, i) => <Box key={"l" + i} p={[-2.2 + (i % 2) * 0.08, 0.012, z]} s={[0.7, 0.03, 0.38]} c="#b9b1a3" r={0.85} rad={0.04} />)}
      {/* CUADRO 0 (miniatura): rincón de dormitorio de noche, aparte (x -18), con la llave del auto y su botón rojo de alarma en la mesita */}
      <group position={[-18, 0, 0]}>
        <Box p={[0, 1.4, -0.5]} s={[3.2, 2.8, 0.1]} c="#d9cdb4" map={tex.wallpaper} r={0.9} rad={0.005} cc={0} />
        <Box p={[-1.55, 1.4, 0.6]} s={[0.1, 2.8, 2.3]} c="#cdbfa4" map={tex.wallpaper} r={0.9} rad={0.005} cc={0} />
        <Box p={[0, 0.0, 0.6]} s={[3.2, 0.04, 2.3]} c="#8a5a36" map={tx.planks} r={0.6} cast={false} rad={0.005} />
        <Box p={[0, 0.06, -0.44]} s={[3.2, 0.12, 0.03]} c="#f1ebe0" r={0.5} rad={0.006} />
        {/* ventana con la noche y el auto afuera con las balizas prendidas (brillo fijo, sin parpadeo) */}
        <Box p={[0.75, 1.45, -0.44]} s={[0.95, 0.95, 0.04]} c="#f1ebe0" r={0.5} rad={0.01} />
        <NightView p={[0.75, 1.45, -0.415]} s={[0.82, 0.82]} tex={tex} u={0.3} />
        <Glass p={[0.75, 1.45, -0.405]} s={[0.82, 0.82]} />
        {[0.58, 0.92].map((x, i) => <mesh key={i} position={[x, 1.2, -0.41]}><circleGeometry args={[0.022, 20]} /><meshBasicMaterial color="#ffa23a" toneMapped={false} /></mesh>)}
        <Nightstand p={[0, 0, 0]} /><Lamp p={[-0.17, 0.55, -0.09]} on={1} />
        <pointLight position={[0.1, 0.95, 0.35]} intensity={0.7} distance={2.4} decay={2} color="#ffc98a" />
        {/* cama: borde del colchón y la almohada */}
        <Box p={[1.35, 0.42, 0.55]} s={[1.6, 0.36, 1.9]} c="#efe7d8" map={tex.quilt} r={0.95} rad={0.06} />
        <Box p={[0.95, 0.68, -0.05]} s={[0.62, 0.14, 0.38]} c="#f6f1e8" r={0.95} rad={0.06} />
        <group position={[0.08, 0.552, 0.08]} scale={1.9}><KeyFob p={[0, 0, 0]} /></group>
      </group>
      {/* GARAJE con el auto y la llave colgada al lado del portón */}
      <Room x0={-9.2} x1={-4.6} floor="#6a6c6e" tex={tex} />
      <Box p={[-9.2, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" map={tex.plaster} r={0.95} rad={0.01} />
      <Car2 x={-6.6} glove={a.glove ?? 0} />
      <Box p={[-8.3, 0.5, -2.05]} s={[1.0, 1.0, 0.3]} c="#7a5634" r={0.6} rad={0.02} />
      {[0.25, 0.55, 0.85].map((y, i) => <Box key={"e" + i} p={[-8.3, y, -1.95]} s={[0.96, 0.03, 0.12]} c="#6b4a2c" r={0.6} rad={0.005} />)}
      <Box p={[-8.0, 1.3, -2.18]} s={[0.04, 0.08, 0.04]} c="#555" m={0.8} /><LlaveM p={[-8.0, 1.2, -2.17]} rot={[0, 0, -1.4]} />
      {/* FRENTE de la casa: pared, zócalo de ladrillo, puerta de paneles, farol, ventana con postigos y enredadera */}
      <Wall x={-1.6} w={6.0} gap={-2.2} />
      <Eave x={-1.6} w={6.0} y={2.8} tiles={lt.tiles} />
      <group position={[0, 0, 1.18]}><BackDoor x={-2.65} c="#6b3e22" /></group>
      {fr > 0.05 && <LlaveM p={[-2.2, 2.11, -0.93]} />}
      <group position={[-1.38, 1.85, -0.9]}>
        <Box p={[0, 0.18, 0]} s={[0.16, 0.04, 0.16]} c="#1e1e1e" m={0.7} r={0.35} rad={0.01} />
        <Box p={[0, -0.18, 0]} s={[0.14, 0.04, 0.14]} c="#1e1e1e" m={0.7} r={0.35} rad={0.01} />
        <Box p={[0, 0, 0]} s={[0.1, 0.3, 0.1]} c="#fff2cc" e="#ffd98a" ei={0.7} r={0.2} rad={0.01} />
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <Box key={k} p={[i * 0.065, 0, j * 0.065]} s={[0.015, 0.34, 0.015]} c="#1e1e1e" m={0.7} r={0.35} />)}
        <pointLight position={[0, 0, 0.2]} intensity={0.5} distance={1.6} color="#ffd98a" />
      </group>
      <FacadeWin p={[0.15, 1.5, -0.97]} tex={tex} />
      <Ivy p={[-3.75, 0.42, -0.97]} w={1.1} h={2.2} />
      {/* escalones, felpudo de coco (se levanta la esquina) y la llave */}
      <Box p={[-2.2, 0.06, -0.55]} s={[1.6, 0.12, 0.9]} c="#c9c2b6" r={0.75} rad={0.02} />
      <Box p={[-2.2, 0.15, -0.8]} s={[1.3, 0.06, 0.4]} c="#d3ccc0" r={0.75} rad={0.015} />
      <group position={[-2.2, 0.13, -0.3]}>
        <group position={[-0.42, 0, 0]} rotation={[0, 0, -0.9 * mat]}><Box p={[0.42, 0.014, 0]} s={[0.84, 0.028, 0.5]} c="#b08655" map={lt.coir} r={1} rad={0.008} cc={0} /></group>
        <LlaveM p={[0.1, 0.02, 0.05]} rot={[-Math.PI / 2, 0, 0.3]} />
      </group>
      {/* maceta de barro con planta de verdad (se inclina) y piedra falsa en el cantero */}
      <group position={[-1.3, 0.12, -0.45]} rotation={[0, 0, -0.5 * pot]}>
        <Cyl p={[0, 0.15, 0]} r={0.19} r2={0.14} h={0.3} c="#b5583a" rough={0.8} />
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.195, 0.025, 10, 32]} /><meshStandardMaterial color="#a94f33" roughness={0.8} /></mesh>
        <Cyl p={[0, 0.29, 0]} r={0.17} h={0.02} c="#3b2a1c" rough={1} />
        <Shrub p={[0, 0.28, 0]} r={0.22} h={0.38} tex={tex} seed={7} flowers="#f2c14e" k={1} />
      </group>
      {pot > 0.05 && <LlaveM p={[-1.3, 0.13, -0.45]} rot={[-Math.PI / 2, 0, 1]} />}
      <Box p={[-3.5, 0.03, 0.45]} s={[1.6, 0.06, 0.8]} c="#a07a55" map={tex.soil} r={1} />
      {[[-3.9, 0.15], [-3.05, 0.2], [-4.15, 0.7]].map(([x, z], i) => <Shrub key={"s" + i} p={[x, 0.05, z]} r={0.2} h={0.3} tex={tex} seed={i * 5 + 2} flowers={i === 1 ? "#d45a8a" : undefined} />)}
      {[[-3.9, 0.55], [-3.7, 0.75], [-3.25, 0.45], [-3.05, 0.7], [-3.45, 0.8]].map(([x, z], i) => <mesh key={i} position={[x, 0.09, z]} castShadow><dodecahedronGeometry args={[0.08 + 0.02 * (i % 2), 1]} /><meshStandardMaterial color="#7e7a72" roughness={1} /></mesh>)}
      <mesh position={[-3.5, 0.09 + 0.25 * rock, 0.5]} castShadow><dodecahedronGeometry args={[0.09, 1]} /><meshStandardMaterial color="#b8b4ab" roughness={0.45} /></mesh>
      {/* reja de hierro con puntas + buzón de la entrada */}
      {Array.from({ length: 12 }, (_, i) => <group key={i}><Box p={[-4.4 + i * 0.36, 0.5, 1.75]} s={[0.035, 1.0, 0.035]} c="#1f1f1f" m={0.7} r={0.35} rad={0.006} />
        <mesh position={[-4.4 + i * 0.36, 1.04, 1.75]}><coneGeometry args={[0.03, 0.08, 8]} /><meshStandardMaterial color="#1f1f1f" metalness={0.7} roughness={0.35} /></mesh></group>)}
      {[0.95, 0.12].map((y, i) => <Box key={"r" + i} p={[-2.4, y, 1.75]} s={[4.4, 0.04, 0.04]} c="#1f1f1f" m={0.7} r={0.35} rad={0.006} />)}
      <Cyl p={[-0.2, 0.45, 1.6]} r={0.03} h={0.9} c="#2a2a2a" m={0.7} rough={0.4} />
      <group position={[-0.2, 1.0, 1.6]}><Box p={[0, 0, 0]} s={[0.36, 0.26, 0.24]} c="#2f5d3a" m={0.4} r={0.4} rad={0.05} cc={0.8} />
        <Box p={[0, 0.04, 0.125]} s={[0.2, 0.03, 0.01]} c="#d9b45a" m={1} r={0.25} />
        <group position={[0, 0.13, 0.12]} rotation={[-1.2 * ml, 0, 0]}><Box p={[0, 0, 0.0]} s={[0.36, 0.03, 0.24]} c="#2f5d3a" m={0.4} r={0.4} rad={0.01} cc={0.8} /></group></group>
      {/* PASILLO (en corte): gancho de llaves en la pared del fondo, ventana al frente */}
      <Room x0={1.4} x1={3.6} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[1.55, 1.4, -2.17]} s={[0.6, 0.3, 0.04]} c="#7a5634" r={0.5} rad={0.02} />
      {[-0.2, -0.07, 0.07, 0.2].map((x, i) => <Box key={"g" + i} p={[1.55 + x, 1.36, -2.13]} s={[0.012, 0.012, 0.05]} c={Brass} m={1} r={0.3} />)}
      {[-0.2, -0.07, 0.07, 0.2].map((x, i) => <LlaveM key={i} p={[1.55 + x, 1.3 - (i === 1 ? 0.25 * fish : 0), -2.13 + (i === 1 ? 1.2 * fish : 0)]} rot={[0, 0, -1.4]} c={["#d9b45a", "#c0c0c0", "#d9b45a", "#b87333"][i]} />)}
      <Switch p={[2.2, 1.1, -2.19]} />
      <Box p={[2.6, 0.4, -0.0]} s={[2.2, 0.8, 0.1]} c="#e3d8c4" map={tex.plaster} r={0.95} />
      <group position={[2.6, 1.25, 0.0]}>
        <Glass p={[0, 0, 0]} s={[1.0, 0.9]} op={0.12} />
        {[[0, 0.47, 1.1, 0.06], [0, -0.47, 1.1, 0.06]].map(([x, y, w, h], i) => <Box key={i} p={[x, y, 0]} s={[w, h, 0.07]} c="#f3ede1" r={0.45} rad={0.01} />)}
        {[-0.52, 0.52, 0].map((x, i) => <Box key={"v" + i} p={[x, 0, 0]} s={[i === 2 ? 0.035 : 0.06, 0.9, 0.07]} c="#f3ede1" r={0.45} rad={0.01} />)}
      </group>
      {/* PATIO de atrás: puerta con vidrios y felpudo */}
      <Wall x={5.0} w={2.6} c="#d9cdb6" gap={4.6} />
      <Eave x={5.0} w={2.6} y={2.8} tiles={lt.tiles} />
      <group position={[0, 0, 1.18]}><BackDoor x={4.15} c="#5f7a88" panes /></group>
      <Box p={[4.6, 0.02, -0.3]} s={[0.8, 0.028, 0.45]} c="#b08655" map={lt.coir} r={1} rad={0.008} cc={0} />
      <Shrub p={[5.75, 0.0, -0.75]} r={0.3} h={0.55} tex={tex} seed={19} flowers="#ffffff" />
      {/* pared del costado con la CAJA CON COMBINACIÓN (detrás de un muro bajo) */}
      <Box p={[6.7, 1.0, -1.02]} s={[1.6, 2.0, 0.12]} c="#cdbfa6" map={tex.plaster} r={0.95} />
      <group position={[6.7, 0.95, -0.93]}>
        <Box p={[0, 0, 0]} s={[0.2, 0.26, 0.1]} c="#1e1f22" m={0.6} r={0.3} rad={0.02} cc={0.8} />
        <group position={[0, -0.13, 0.05]} rotation={[-1.3 * kb, 0, 0]}><Box p={[0, 0.0, 0.0]} s={[0.2, 0.04, 0.02]} c="#2b2d31" m={0.6} r={0.3} /></group>
        {[-0.06, -0.02, 0.02, 0.06].map((x, i) => <Box key={i} p={[x, 0.05, 0.055]} s={[0.03, 0.05, 0.01]} c="#c9ccd0" m={0.9} r={0.2} />)}
      </group>
      <Box p={[6.7, 0.35, -0.4]} s={[1.8, 0.7, 0.15]} c="#a69a86" map={lt.brick} r={0.9} rad={0.01} cc={0} />
      <Box p={[6.7, 0.72, -0.4]} s={[1.9, 0.05, 0.22]} c="#d8d0c2" r={0.7} rad={0.01} />
      {/* la casa del VECINO (la copia anónima) */}
      <Wall x={9.6} w={2.6} h={2.6} c="#c9d8c2" gap={9.6} />
      <Eave x={9.6} w={2.6} y={2.6} tiles={lt.tiles} />
      <group position={[0, 0, 1.18]}><BackDoor x={9.15} c="#2f4a6b" /></group>
      <Shrub p={[8.6, 0.0, -0.7]} r={0.3} h={0.5} tex={tex} seed={23} />
      <Shrub p={[10.6, 0.0, -0.7]} r={0.3} h={0.5} tex={tex} seed={29} flowers="#e3566a" />
    </>
  );
};

// ======================= piezas de la tanda 28 (vaso / ventana / portón) =======================
type SP = { tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number>; t: number };
const Brass = "#c9a14a";
// puerta en la pared del fondo, bisagra a la izquierda; open 0..1 abre hacia la sala
// veta de madera para puertas (casi blanca con vetas: se multiplica por el color propio de cada puerta)
let woodTex: THREE.Texture | null = null;
const woodGrain = () => woodTex ?? (woodTex = mk(256, 512, (g) => {
  g.fillStyle = "#f4efe8"; g.fillRect(0, 0, 256, 512);
  for (let k = 0; k < 70; k++) { const x0 = rnd(k, 1) * 256, a = 0.04 + rnd(k, 2) * 0.08; g.strokeStyle = `rgba(70,40,18,${a})`; g.lineWidth = 0.6 + rnd(k, 3) * 2.2;
    g.beginPath(); g.moveTo(x0, 0); for (let y = 0; y <= 512; y += 32) g.lineTo(x0 + Math.sin(y * 0.012 + k) * (3 + rnd(k, 4) * 6), y); g.stroke(); }
  for (let k = 0; k < 4; k++) { const cx = 30 + rnd(k, 7) * 196, cy = 40 + rnd(k, 8) * 430; g.strokeStyle = "rgba(80,45,20,.07)"; g.lineWidth = 1;
    for (let r = 3; r < 16; r += 3) { g.beginPath(); g.ellipse(cx, cy, r * 0.6, r * 2.2, 0, 0, Math.PI * 2); g.stroke(); } }
}));
// llave de auto con control: cuerpo negro, dos botones grises, botón rojo de alarma que brilla, hoja de metal y argolla
const KeyFob: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p} rotation={[0, 0.5, 0]}>
    <Box p={[0, 0.011, 0]} s={[0.05, 0.02, 0.095]} c="#16171a" r={0.35} rad={0.009} cc={0.8} />
    {[-0.022, 0.0].map((z, i) => <Box key={i} p={[0, 0.0225, z]} s={[0.028, 0.004, 0.016]} c="#3a3d42" r={0.5} rad={0.002} />)}
    <Box p={[0, 0.0225, 0.025]} s={[0.03, 0.005, 0.02]} c="#d81f1f" e="#ff2a2a" ei={0.9} r={0.35} rad={0.003} />
    <Box p={[0, 0.011, -0.088]} s={[0.014, 0.004, 0.085]} c="#c9ccd1" m={1} r={0.25} rad={0.001} />
    <mesh position={[0, 0.006, 0.062]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.016, 0.0025, 8, 28]} /><meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.25} /></mesh>
  </group>
);
const BackDoor: React.FC<{ x: number; open?: number; c?: string; panes?: boolean; children?: React.ReactNode; tex?: TX }> = ({ x, open = 0, c = "#7a4a26", panes, children, tex }) => (
  <>
    {/* v2: marco (jambas + dintel) en la pared, y detrás del hueco la noche si la puerta tiene vidrios */}
    <Box p={[x + 0.45, 2.06, -2.16]} s={[1.08, 0.09, 0.07]} c="#f3ede1" r={0.45} rad={0.012} />
    {[-0.04, 0.94].map((d, i) => <Box key={i} p={[x + d, 1.0, -2.16]} s={[0.08, 2.04, 0.07]} c="#f3ede1" r={0.45} rad={0.012} />)}
    <group position={[x, 0, -2.15]} rotation={[0, -1.1 * open, 0]}>
      <Box p={[0.45, 1.0, 0]} s={[0.9, 2.0, 0.06]} c={c} r={0.5} cc={0.55} map={woodGrain()} />
      {/* paneles en relieve */}
      {(panes ? [[0.45, 0.6, 0.7, 0.75]] : [[0.25, 1.45, 0.3, 0.75], [0.65, 1.45, 0.3, 0.75], [0.25, 0.5, 0.3, 0.75], [0.65, 0.5, 0.3, 0.75]]).map(([px, py, pw, ph], i) =>
        <group key={i}><Box p={[px, py, 0.034]} s={[pw - 0.02, ph - 0.02, 0.014]} c={c} r={0.5} rad={0.025} cc={0.6} map={woodGrain()} />
          {/* moldura perimetral que hace sombra: el panel se lee hundido */}
          {[[0, ph / 2, pw + 0.03, 0.028], [0, -ph / 2, pw + 0.03, 0.028]].map(([dx, dy, mw, mh], j) => <Box key={j} p={[px + dx, py + dy, 0.044]} s={[mw, mh, 0.024]} c={c} r={0.42} rad={0.009} cc={0.7} />)}
          {[[-pw / 2, 0], [pw / 2, 0]].map(([dx, dy], j) => <Box key={"v" + j} p={[px + dx, py + dy, 0.044]} s={[0.028, ph + 0.03, 0.024]} c={c} r={0.42} rad={0.009} cc={0.7} />)}</group>)}
      {panes && <>
        {tex && <NightView p={[0.45, 1.55, 0.034]} s={[0.74, 0.62]} tex={tex} u={x * 0.07} />}
        {[0, 1].map((r) => [0, 1].map((k) => <Glass key={`${r}${k}`} p={[0.27 + k * 0.36, 1.4 + r * 0.3, 0.038]} s={[0.3, 0.26]} />))}
        <Box p={[0.45, 1.55, 0.036]} s={[0.04, 0.62, 0.02]} c={c} r={0.5} cc={0.5} /><Box p={[0.45, 1.55, 0.036]} s={[0.72, 0.04, 0.02]} c={c} r={0.5} cc={0.5} />
        <Box p={[0.45, 1.86, 0.036]} s={[0.76, 0.04, 0.02]} c={c} r={0.5} cc={0.5} /><Box p={[0.45, 1.24, 0.036]} s={[0.76, 0.04, 0.02]} c={c} r={0.5} cc={0.5} />
      </>}
      {/* bisagras, roseta y perilla de bronce */}
      {[0.35, 1.0, 1.65].map((y, i) => <Box key={i} p={[0.02, y, 0.035]} s={[0.03, 0.09, 0.01]} c={Brass} m={1} r={0.3} rad={0.004} />)}
      <mesh position={[0.8, 1.0, 0.036]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.012, 24]} /><meshStandardMaterial color={Brass} metalness={1} roughness={0.22} /></mesh>
      <mesh position={[0.8, 1.0, 0.055]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.014, 0.04, 16]} /><meshStandardMaterial color={Brass} metalness={1} roughness={0.22} /></mesh>
      <mesh position={[0.8, 1.0, 0.085]}><sphereGeometry args={[0.042, 24, 18]} /><meshStandardMaterial color={Brass} metalness={1} roughness={0.16} /></mesh>
      <Box p={[0.8, 0.88, 0.04]} s={[0.035, 0.06, 0.01]} c={Brass} m={1} r={0.28} rad={0.005} />
      {children}
    </group>
  </>
);
const Lamp: React.FC<{ p: V3; on?: number }> = ({ p, on = 1 }) => (
  <group position={p}>
    {/* pie de cerámica torneado, varilla de bronce y pantalla de tela que deja ver la trama */}
    <Cyl p={[0, 0.012, 0]} r={0.07} h={0.024} c="#2f4a5e" rough={0.25} />
    <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.065, 28, 20]} /><meshPhysicalMaterial color="#2f4a5e" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
    <Cyl p={[0, 0.2, 0]} r={0.008} h={0.14} c={Brass} m={1} rough={0.25} />
    <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.09, 0.16, 0.2, 32, 1, true]} /><meshStandardMaterial color="#eedcb2" emissive="#ffc27a" emissiveIntensity={0.1 * on} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {[0.24, 0.44].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[i ? 0.09 : 0.16, 0.004, 6, 40]} /><meshStandardMaterial color="#c9a866" roughness={0.6} /></mesh>)}
    <pointLight position={[0, 0.3, 0]} intensity={0.6 * on} distance={2.6} decay={2} color="#ffc777" />
  </group>
);
const Photo: React.FC<{ p: V3; c: string }> = ({ p, c }) => <group position={p}><Box p={[0, 0, 0]} s={[0.26, 0.32, 0.03]} c="#5a381f" /><Box p={[0, 0, 0.017]} s={[0.2, 0.26, 0.005]} c={c} r={0.9} /></group>;
// celular de verdad: cuerpo con borde metálico, vidrio negro brillante y pantalla de bloqueo que se enciende suave
let phoneTex: THREE.Texture | null = null;
const PhoneM: React.FC<{ p: V3; on?: number }> = ({ p, on = 0 }) => {
  const t = useMemo(() => phoneTex ?? (phoneTex = mk(128, 256, (g) => { const gr = g.createLinearGradient(0, 0, 128, 256); gr.addColorStop(0, "#1d3b6e"); gr.addColorStop(1, "#5a2f6e"); g.fillStyle = gr; g.fillRect(0, 0, 128, 256);
    g.fillStyle = "#f4f4f8"; g.font = "600 44px Montserrat, Arial, sans-serif"; g.textAlign = "center"; g.fillText("6:42", 64, 78); g.font = "500 13px Montserrat, Arial"; g.fillText("martes 28", 64, 100);
    g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(14, 150, 100, 30); g.fillRect(14, 186, 100, 30); g.fillStyle = "#fff"; g.fillRect(48, 240, 32, 4); })), []);
  return (
    <group position={p}>
      <Box p={[0, 0, 0]} s={[0.078, 0.009, 0.158]} c="#9aa0a8" m={1} r={0.25} rad={0.004} />
      <mesh position={[0, 0.0048, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.072, 0.152]} /><meshPhysicalMaterial color={new THREE.Color("#0b0c0f").lerp(new THREE.Color("#ffffff"), Math.min(1, on))} map={t} emissive="#ffffff" emissiveMap={t} emissiveIntensity={0.55 * on} roughness={0.08} clearcoat={1} clearcoatRoughness={0.04} /></mesh>
    </group>
  );
};
const Nightstand: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Box p={[0, 0.3, 0]} s={[0.5, 0.42, 0.42]} c="#6b4426" r={0.5} cc={0.6} map={woodGrain()} />
    <Box p={[0, 0.53, 0.01]} s={[0.54, 0.04, 0.46]} c="#7a5030" r={0.45} cc={0.7} rad={0.012} map={woodGrain()} />
    {[0.39, 0.2].map((y, i) => <group key={i}><Box p={[0, y, 0.212]} s={[0.44, 0.16, 0.012]} c="#76492a" r={0.48} cc={0.6} rad={0.01} />
      <mesh position={[0, y, 0.228]}><sphereGeometry args={[0.016, 14, 10]} /><meshStandardMaterial color={Brass} metalness={1} roughness={0.25} /></mesh></group>)}
    {[[-0.21, -0.17], [0.21, -0.17], [-0.21, 0.17], [0.21, 0.17]].map(([x, z], i) => <Box key={"l" + i} p={[x, 0.045, z]} s={[0.04, 0.09, 0.04]} c="#5a381f" r={0.5} rad={0.01} />)}
  </group>
);
const Armchair: React.FC<{ p: V3; c?: string }> = ({ p, c = "#5c6b55" }) => (
  <group position={p}>
    {[[-0.22, -0.3], [0.22, -0.3], [-0.22, 0.3], [0.22, 0.3]].map(([z, x], i) => <Cyl key={i} p={[x, 0.05, z]} r={0.025} r2={0.018} h={0.1} c="#3a2414" rough={0.45} />)}
    <Box p={[0, 0.2, 0]} s={[0.86, 0.2, 0.74]} c={c} r={0.9} rad={0.06} cc={0} />
    <Box p={[0, 0.36, 0.04]} s={[0.62, 0.14, 0.62]} c={c} r={0.88} rad={0.06} cc={0} />
    {[-0.37, 0.37].map((x, i) => <Box key={i} p={[x, 0.42, 0.0]} s={[0.14, 0.34, 0.74]} c={c} r={0.9} rad={0.06} cc={0} />)}
    <Box p={[0, 0.66, -0.31]} s={[0.86, 0.66, 0.14]} c={c} r={0.9} rad={0.07} cc={0} />
    {[-0.18, 0.18].map((x) => [0.58, 0.78].map((y) => <mesh key={`${x}${y}`} position={[x, y, -0.235]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#3f4a3a" roughness={0.9} /></mesh>))}
    <Box p={[0.12, 0.55, -0.16]} s={[0.36, 0.3, 0.1]} c="#d9b77a" r={0.95} rad={0.05} rot={[-0.25, 0.2, 0]} cc={0} />
  </group>
);
const Kitchen: React.FC<{ x: number }> = ({ x }) => (
  <>
    {/* bajo mesada: 4 puertas con tirador de bronce, zócalo y mesada de granito con canto */}
    <Box p={[x, 0.06, -1.92]} s={[2.0, 0.12, 0.54]} c="#3d3228" r={0.8} />
    <Box p={[x, 0.5, -1.95]} s={[2.0, 0.78, 0.58]} c="#7f9580" r={0.55} cc={0.5} />
    {[-0.75, -0.25, 0.25, 0.75].map((dx, i) => <group key={i}><Box p={[x + dx, 0.5, -1.655]} s={[0.47, 0.72, 0.02]} c="#8aa18b" r={0.5} cc={0.55} rad={0.012} />
      <Box p={[x + dx, 0.5, -1.643]} s={[0.37, 0.6, 0.006]} c="#7b917c" r={0.55} rad={0.008} />
      <Box p={[x + dx + (i % 2 ? -0.17 : 0.17), 0.72, -1.635]} s={[0.018, 0.12, 0.018]} c={Brass} m={1} r={0.25} rad={0.006} /></group>)}
    <Box p={[x, 0.92, -1.95]} s={[2.06, 0.045, 0.64]} c="#3b3936" r={0.22} cc={0.9} rad={0.01} />
    {/* bacha de acero y canilla */}
    <Box p={[x + 0.4, 0.935, -1.95]} s={[0.56, 0.012, 0.4]} c="#c9ced2" m={1} r={0.22} rad={0.02} />
    <Box p={[x + 0.4, 0.94, -1.95]} s={[0.48, 0.006, 0.32]} c="#8c9196" m={1} r={0.3} rad={0.02} />
    <Cyl p={[x + 0.4, 1.06, -2.16]} r={0.016} h={0.24} c="#d6dadd" m={1} rough={0.15} />
    <Cyl p={[x + 0.4, 1.17, -2.07]} r={0.013} h={0.18} c="#d6dadd" m={1} rough={0.15} rot={[Math.PI / 2, 0, 0]} />
    {/* azulejos entre mesada y alacena */}
    {Array.from({ length: 18 }, (_, i) => <Box key={"az" + i} p={[x - 0.945 + (i % 9) * 0.236, 1.1 + Math.floor(i / 9) * 0.2, -2.185]} s={[0.228, 0.19, 0.01]} c={i % 2 ? "#e9eef0" : "#dfe8ec"} r={0.18} cc={0.9} rad={0.004} />)}
    {/* alacena con 3 puertas y tiradores */}
    <Box p={[x, 1.85, -2.05]} s={[2.0, 0.6, 0.36]} c="#7f9580" r={0.55} cc={0.5} />
    {[-0.66, 0, 0.66].map((dx, i) => <group key={"al" + i}><Box p={[x + dx, 1.85, -1.865]} s={[0.63, 0.55, 0.02]} c="#8aa18b" r={0.5} cc={0.55} rad={0.012} />
      <Box p={[x + dx + 0.26, 1.64, -1.85]} s={[0.018, 0.1, 0.018]} c={Brass} m={1} r={0.25} rad={0.006} /></group>)}
    {/* platos apoyados, frasco y tabla de picar */}
    {[0, 1, 2].map((i) => <Cyl key={i} p={[x - 0.5 + i * 0.12, 1.02, -1.95]} r={0.11} h={0.012} c="#efece4" rough={0.3} rot={[Math.PI / 2 - 0.25, 0, 0]} />)}
    <Cyl p={[x - 0.15, 1.0, -2.05]} r={0.05} h={0.14} c="#c7a35a" rough={0.3} />
    <Box p={[x - 0.8, 0.955, -1.9]} s={[0.36, 0.02, 0.24]} c="#a8774a" r={0.6} rad={0.01} rot={[0, 0.2, 0]} />
  </>
);

// ---- VASO: de noche, la cocina con la puerta de atrás, el pasillo con la puerta de entrada, el dormitorio y la calle ----
const Vaso: React.FC<SP> = ({ tex, tx, a, t }) => {
  const g = (k: string) => a[k] ?? 0;
  const gin = g("glassin"), fall = ease(g("fall")), wd = g("wedge"), ky = ease(g("key")), bl = g("bells"), ch = g("chain"), tp = g("tape");
  const dr = g("door"), tm = g("timer"), pn = g("panic"), ph = g("phone"), tr = g("tray"), knob = g("knob");
  const glassOn = gin > 0.03 || fall > 0;
  const gx = -2.6, gy = 1.08 - 1.04 * fall * fall, gz = -2.04 + 0.2 * fall;
  const flash = Math.min(1, pn * 3) * Math.pow(0.5 + 0.5 * Math.sin(t * 7), 2); // balizas suaves, nunca estrobo
  return (
    <>
      <Ground tex={tex} w={28} cx={1.5} />
      <Room x0={-6.5} x1={-1.4} floor="#b8b0a2" tex={tex} wallC="#d9cfb8" />
      <Room x0={-1.4} x1={2.2} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Room x0={2.2} x1={6.6} floor="#9a7b5a" tex={tex} planks={tx.planks} wallC="#cdbfae" />
      <Box p={[-6.5, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      {/* COCINA: mesada con la lámpara amarilla, la puerta de atrás con vidrios */}
      <Kitchen x={-5.0} /><Lamp p={[-4.4, 0.95, -1.95]} />
      <Box p={[-2.9, 2.08, -2.13]} s={[1.1, 0.08, 0.1]} c="#f2ece0" r={0.7} />
      <BackDoor x={-3.4} open={0.35 * dr} panes tex={tex}>
        <group position={[0.8, 1.0, 0.07]} rotation={[0, 0, -1.2 * knob]}><Box p={[0, 0, 0.03]} s={[0.012, 0.07, 0.012]} c="#8a6a2a" m={1} r={0.3} /></group>
        {ky < 0.98 && <group position={[0.8, 1.22, 0.07]} rotation={[0, 0, -0.4]}><mesh><torusGeometry args={[0.03, 0.01, 8, 18]} /><meshStandardMaterial color="#d9b45a" metalness={1} roughness={0.25} /></mesh></group>}
        {tp > 0.03 && <Box p={[0.88, 0.25, 0.04]} s={[0.16 * tp, 0.045, 0.006]} c="#e6d7b0" r={0.95} rad={0.004} />}
        {bl > 0.03 && <group position={[0.8, 0.95, 0.1]} rotation={[0, 0, bl * 0.5 * Math.sin(t * 15)]}>
          <Box p={[0, -0.07, 0]} s={[0.006, 0.14, 0.006]} c="#6b4a2a" />
          {[-0.03, 0, 0.03].map((d, i) => <mesh key={i} position={[d, -0.16 - Math.abs(d), 0]}><sphereGeometry args={[0.022, 12, 10]} /><meshStandardMaterial color="#e0b850" metalness={1} roughness={0.2} /></mesh>)}
        </group>}
      </BackDoor>
      {/* la llave pasa de la cerradura al gancho lejos del vidrio */}
      <Box p={[-1.75, 1.55, -2.17]} s={[0.22, 0.12, 0.03]} c="#7a5634" />
      {ky > 0.02 && <group position={[lerp(-2.6, -1.75, ky), lerp(1.22, 1.48, ky) + Math.sin(Math.PI * ky) * 0.15, -2.06]} rotation={[0, 0, -1.4]}>
        <mesh><torusGeometry args={[0.03, 0.01, 8, 18]} /><meshStandardMaterial color="#d9b45a" metalness={1} roughness={0.25} /></mesh>
        <Box p={[0.07, 0, 0]} s={[0.09, 0.016, 0.01]} c="#d9b45a" m={1} r={0.25} rad={0.003} /></group>}
      {/* el vaso de lado sobre la perilla; cuando cae, se rompe en la bandeja */}
      {glassOn && fall < 0.92 && <group position={[gx, gy, gz]} rotation={[fall * 2.4, 0, Math.PI / 2]}>
        <mesh castShadow><cylinderGeometry args={[0.045, 0.038, 0.13, 40, 1, true]} /><meshPhysicalMaterial color="#eef8ff" transparent opacity={0.32} roughness={0.02} metalness={0.05} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={2.5} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh position={[0, -0.065, 0]}><cylinderGeometry args={[0.038, 0.038, 0.012, 40]} /><meshPhysicalMaterial color="#e4f3ff" transparent opacity={0.55} roughness={0.02} clearcoat={1} envMapIntensity={2.5} /></mesh>
        <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.045, 0.0025, 8, 40]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0.02} clearcoat={1} envMapIntensity={3} /></mesh>
      </group>}
      {(tr > 0.03 || fall > 0) && <Box p={[-2.6, 0.015, -1.85]} s={[0.5, 0.025, 0.36]} c="#9aa0a6" m={0.85} r={0.3} rad={0.008} />}
      {fall >= 0.92 && Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-2.6 + (rnd(i, 1) - 0.5) * 0.36, 0.035, -1.85 + (rnd(i, 2) - 0.5) * 0.26]} rotation={[rnd(i, 3) * 3, rnd(i, 4) * 3, 0]}><tetrahedronGeometry args={[0.02 + 0.015 * rnd(i, 5), 0]} /><meshStandardMaterial color="#e6f6ff" transparent opacity={0.65} roughness={0.05} /></mesh>)}
      {/* la cuña de goma entra por debajo de la puerta */}
      {wd > 0.02 && <mesh position={[-2.95, 0.03, lerp(-1.4, -2.0, ease(wd))]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.001, 0.06, 0.22, 3]} /><meshStandardMaterial color="#1a1a1a" roughness={0.9} /></mesh>}
      {/* PASILLO: puerta de entrada con la cadena, fotos, mesita con la lámpara del timer */}
      <BackDoor x={-0.05} c="#5e3a20" />
      {ch > 0.03 && Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.55 + i * 0.05 * ch, 1.55 - Math.sin((i / 6) * Math.PI) * 0.05, -2.08]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}><torusGeometry args={[0.018, 0.005, 6, 12]} /><meshStandardMaterial color="#c9ccd0" metalness={1} roughness={0.3} /></mesh>)}
      {ch > 0.03 && <Box p={[0.88, 1.55, -2.13]} s={[0.05, 0.16, 0.02]} c="#c9ccd0" m={1} r={0.3} />}
      <Art p={[-0.9, 1.6, -2.18]} n={3} tex={tex} w={0.22} h={0.28} /><Art p={[-0.55, 1.78, -2.18]} n={0} tex={tex} w={0.2} h={0.25} gold />
      <Art p={[1.6, 1.65, -2.18]} n={1} tex={tex} w={0.44} h={0.34} gold /><Switch p={[1.05, 1.2, -2.17]} />
      <Art p={[3.9, 1.7, -2.18]} n={2} tex={tex} w={0.5} h={0.38} /><Switch p={[2.55, 1.2, -2.17]} /><Switch p={[-1.75, 1.2, -2.17]} />
      <Art p={[-5.6, 1.85, -2.18]} n={0} tex={tex} w={0.3} h={0.24} />
      {/* alfombra del pasillo */}
      <mesh position={[0.4, 0.004, -1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.0, 1.6]} /><meshPhysicalMaterial map={tx.rug} roughness={0.95} sheen={0.6} sheenColor="#ffd9b8" /></mesh>
      <Dust p={[-4.4, 1.0, -1.8]} t={t} /><Dust p={[2.9, 0.7, -1.85]} t={t} n={30} />
      <Box p={[1.65, 0.35, -1.95]} s={[0.5, 0.7, 0.4]} c="#6b4426" /><Lamp p={[1.65, 0.7, -1.95]} on={Math.max(0.15, tm)} />
      {tm > 0.03 && <Box p={[1.3, 0.3, -2.17]} s={[0.1, 0.12, 0.05]} c="#f2f2ee" r={0.4} rad={0.01} />}
      {/* DORMITORIO: mesita con lámpara, teléfono cargando y silbato; la cama con el acolchado; la ventana */}
      <Nightstand p={[3.05, 0, -1.95]} /><Lamp p={[2.88, 0.55, -2.04]} />
      <PhoneM p={[3.17, 0.558, -1.86]} on={ph} />
      <mesh position={[3.17, 0.554, -2.02]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0022, 0.0022, 0.17, 10]} /><meshStandardMaterial color="#1c1d20" roughness={0.5} /></mesh>
      <group position={[4.4, 0, -1.2]}>
        <Box p={[0, 0.22, 0]} s={[1.6, 0.26, 2.0]} c="#5a381f" r={0.7} /><Box p={[0, 0.7, -1.0]} s={[1.7, 1.0, 0.08]} c="#5a381f" r={0.7} />
        <Box p={[0, 0.42, 0.05]} s={[1.5, 0.18, 1.85]} c="#f1ede4" r={0.95} rad={0.06} />
        <Plane p={[0, 0.515, 0.15]} s={[1.46, 1.5]} map={tex.quilt} rot={[-Math.PI / 2, 0, 0]} />
        <Box p={[-0.4, 0.58, -0.75]} s={[0.5, 0.12, 0.3]} c="#f6f3ec" r={0.95} rad={0.05} /><Box p={[0.4, 0.58, -0.75]} s={[0.5, 0.12, 0.3]} c="#f6f3ec" r={0.95} rad={0.05} />
      </group>
      {/* ventana del dormitorio: la noche del barrio detrás de un vidrio que refleja, marco, alféizar y cortinas */}
      <NightView p={[5.7, 1.45, -2.192]} s={[0.9, 0.9]} tex={tex} u={0.3} />
      <Box p={[5.7, 1.92, -2.16]} s={[1.04, 0.06, 0.07]} c="#f3ede1" r={0.45} /><Box p={[5.7, 0.98, -2.12]} s={[1.14, 0.05, 0.16]} c="#f3ede1" r={0.45} />
      {[5.23, 6.17].map((x, i) => <Box key={i} p={[x, 1.45, -2.16]} s={[0.06, 0.94, 0.07]} c="#f3ede1" r={0.45} />)}
      <Box p={[5.7, 1.45, -2.17]} s={[0.03, 0.9, 0.04]} c="#f3ede1" r={0.45} /><Glass p={[5.7, 1.45, -2.15]} s={[0.9, 0.9]} />
      <Curtain p={[5.08, 1.42, -2.1]} w={0.32} h={1.3} tex={tex} /><Curtain p={[6.32, 1.42, -2.1]} w={0.32} h={1.3} tex={tex} />
      <Box p={[5.7, 2.1, -2.1]} s={[1.6, 0.03, 0.03]} c={Brass} m={1} r={0.3} />
      {/* la CALLE: el auto que toca bocina cuando aprietas el botón de pánico */}
      <Car x={8.6} glove={0} />
      {[-0.6, 0.6].map((d, i) => <Box key={i} p={[8.6 + d, 0.55, 1.33]} s={[0.3, 0.14, 0.04]} c="#fff3c4" e="#ffd27a" ei={2.4 * flash} r={0.2} />)}
      <pointLight position={[8.6, 0.8, 1.9]} intensity={2.2 * flash} distance={4} color="#ffd27a" />
    </>
  );
};

// ---- VENTANA: de noche, la sala con la corrediza de aluminio, el baño con la celosía, el dormitorio y el patio ----
// marco de aluminio de la hoja corrediza: 4 perfiles con brillo de metal (antes una placa opaca)
const AluFrame: React.FC<{ w: number }> = ({ w }) => (<>
  {[0.54, -0.54].map((y, i) => <Box key={i} p={[0, y, 0]} s={[w, 0.04, 0.035]} c="#dfe4e8" m={0.85} r={0.28} rad={0.006} />)}
  {[w / 2 - 0.02, -w / 2 + 0.02].map((x, i) => <Box key={"v" + i} p={[x, 0, 0]} s={[0.04, 1.12, 0.035]} c="#dfe4e8" m={0.85} r={0.28} rad={0.006} />)}
</>);
const SlideWin: React.FC<{ x: number; w?: number; a: Record<string, number>; t: number; sfx?: string; tex: TX }> = ({ x, w = 2.0, a, t, sfx = "", tex }) => {
  const g = (k: string) => a[k + sfx] ?? 0;
  const st = g("stick"), vent = g("vent"), lt = g("latch"), pn = g("pane"), sc = g("screw"), lk = g("lock"), fm = g("film");
  const hw = w / 2, pw = hw + 0.04;
  const stop = st > 0.5 ? (vent > 0.5 ? 0.25 : 0.05) : 0.85 * hw;
  const off = Math.min(stop, pn * 0.85 * hw) + (vent > 0.5 ? 0.25 * vent : 0);
  const drop = ease(Math.min(1, st * 1.6));
  return (
    <group position={[x, 0, 0]}>
      <NightView p={[0, 1.4, -2.192]} s={[w, 1.2]} tex={tex} u={x * 0.05} />
      {[[0, 2.03, w + 0.12, 0.06], [0, 0.77, w + 0.12, 0.06]].map(([x, y, ww, hh], i) => <Box key={i} p={[x, y, -2.16]} s={[ww, hh, 0.05]} c="#e9ecef" m={0.8} r={0.3} rad={0.008} />)}
      {[-w / 2 - 0.03, w / 2 + 0.03].map((x, i) => <Box key={"j" + i} p={[x, 1.4, -2.16]} s={[0.06, 1.32, 0.05]} c="#e9ecef" m={0.8} r={0.3} rad={0.008} />)}
      <Box p={[0, 0.84, -2.1]} s={[w + 0.1, 0.04, 0.1]} c="#d7dbdf" m={0.7} r={0.3} />
      <Box p={[0, 2.02, -2.1]} s={[w + 0.1, 0.04, 0.1]} c="#d7dbdf" m={0.7} r={0.3} />
      <group position={[-hw / 2, 1.43, -2.12]}><AluFrame w={pw} /><Glass p={[0, 0, 0.0]} s={[pw - 0.08, 1.04]} /></group>
      <group position={[hw / 2 - off, 1.43, -2.08]}>
        <AluFrame w={pw} /><Glass p={[0, 0, 0.0]} s={[pw - 0.08, 1.04]} />
        {fm > 0.03 && <Box p={[0, 0, 0.024]} s={[(pw - 0.08) * Math.min(1, fm * 1.3), 1.04, 0.004]} c="#bfe6ff" e="#9fdcff" ei={0.35 * fm} r={0.05} />}
        <group position={[-pw / 2 + 0.03, 0, 0.03]} rotation={[0, 0, 0.9 * lt]}><Box p={[0, 0.03, 0]} s={[0.025, 0.08, 0.02]} c="#9aa0a6" m={0.9} r={0.3} /></group>
      </group>
      {lt > 0.03 && <group position={[hw / 2 - off - pw / 2 + 0.03, 1.4, -2.02 + 0.25 * (1 - lt)]} rotation={[-Math.PI / 2, 0, 0]}>
        <Cyl p={[0, 0.0, 0]} r={0.006} h={0.3} c="#c9ccd0" m={1} rough={0.3} /><Cyl p={[0, -0.22, 0]} r={0.022} h={0.16} c="#e0b012" rough={0.5} /></group>}
      {/* palo de escoba de madera en el riel: siempre montado (visible on/off, sin recompilar shaders = sin tirones) */}
      <mesh visible={st > 0.02} position={[-hw / 2 - 0.02, lerp(1.6, 0.9, drop), -2.1]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.024, 0.024, hw - 0.06, 24]} /><meshPhysicalMaterial color="#b98048" map={woodGrain()} roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.25} /></mesh>
      <mesh visible={vent > 0.02} position={[-hw / 2 + 0.15, 0.9, -2.07]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.024, 0.024, hw - 0.32, 24]} /><meshPhysicalMaterial color="#b98048" map={woodGrain()} roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.25} /></mesh>
      {sc > 0.03 && <group position={[hw / 2 + 0.05, 2.02, -2.06]} scale={Math.min(1, sc * 1.5)}><Cyl p={[0, 0, 0]} r={0.02} h={0.02} c="#d0d4d8" m={1} rough={0.25} rot={[Math.PI / 2, 0, 0]} /></group>}
      {lk > 0.03 && <Box p={[hw / 2 + 0.25, 1.98, -2.06]} s={[0.12, 0.06, 0.05 * Math.min(1, lk * 1.4)]} c="#5f656b" m={0.5} r={0.4} rad={0.01} />}
      <Curtain p={[-hw - 0.25, 1.38, -2.06]} w={0.36} h={1.55} tex={tex} /><Curtain p={[hw + 0.25, 1.38, -2.06]} w={0.3} h={1.55} tex={tex} />
      <Box p={[0, 2.2, -2.06]} s={[w + 0.9, 0.03, 0.03]} c={Brass} m={1} r={0.3} />
    </group>
  );
};
const Ventana: React.FC<SP> = ({ tex, tx, a, t }) => {
  const g = (k: string) => a[k] ?? 0;
  const sl = g("slats"), si = g("silicone"), rs = g("roses"), gv = g("gravel"), gr = g("grille"), sw = g("saw");
  return (
    <>
      <Ground tex={tex} w={30} cx={2.0} />
      <Room x0={-6.5} x1={0} floor="#9a7b5a" tex={tex} planks={tx.planks} wallC="#d8c8b4" />
      <Room x0={0} x1={2.4} floor="#cdd6d8" tex={tex} wall={tex.bathTile} wallC="#dfe8ea" />
      <Room x0={2.4} x1={5.8} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[-6.5, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      {/* SALA: la corrediza grande, sillón, mesa ratona, planta, lámpara */}
      <SlideWin x={-3.2} a={a} t={t} tex={tex} />
      <Armchair p={[-5.5, 0, -1.3]} />
      <group position={[-3.4, 0, -0.9]}>
        <Box p={[0, 0.3, 0]} s={[1.0, 0.045, 0.55]} c="#6b4426" r={0.42} cc={0.8} rad={0.015} />
        {[[-0.44, -0.22], [0.44, -0.22], [-0.44, 0.22], [0.44, 0.22]].map(([x, z], i) => <Cyl key={i} p={[x, 0.14, z]} r={0.022} r2={0.016} h={0.28} c="#5a381f" rough={0.45} />)}
        <Box p={[-0.2, 0.335, 0.05]} s={[0.26, 0.03, 0.2]} c="#7b2f2f" r={0.7} rad={0.006} rot={[0, 0.3, 0]} />
        <Cyl p={[0.25, 0.36, -0.05]} r={0.04} h={0.08} c="#efe8da" rough={0.25} />
      </group><Lamp p={[-1.0, 0, -1.9]} />
      <Box p={[-1.0, 0.22, -1.9]} s={[0.4, 0.44, 0.35]} c="#6b4426" />
      <group position={[-0.5, 0, -1.3]}><Cyl p={[0, 0.17, 0]} r={0.18} r2={0.14} h={0.34} c="#b5583a" rough={0.6} /><Shrub p={[0, 0.3, 0]} r={0.3} h={0.6} tex={tex} seed={3} /></group>
      <Art p={[-5.0, 1.75, -2.18]} n={0} tex={tex} w={0.5} h={0.38} gold /><Switch p={[-6.1, 1.2, -2.17]} /><Art p={[3.6, 1.8, -2.18]} n={2} tex={tex} w={0.3} h={0.4} />
      <mesh position={[-3.6, 0.004, -1.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.2, 1.4]} /><meshPhysicalMaterial map={tx.rug} roughness={0.95} sheen={0.6} sheenColor="#ffd9b8" /></mesh>
      <Dust p={[-1.0, 0.8, -1.7]} t={t} />
      {/* BAÑO: lavabo y la celosía alta con tiras de vidrio */}
      <Box p={[0.6, 0.42, -1.95]} s={[0.6, 0.84, 0.45]} c="#efefea" r={0.3} />
      <group position={[1.2, 1.9, -2.14]}>
        <NightView p={[0, 0, -0.04]} s={[0.84, 0.66]} tex={tex} u={0.6} />
        <Box p={[0, 0, -0.01]} s={[0.9, 0.72, 0.03]} c="#e9ecef" m={0.6} r={0.35} />
        {[0, 1, 2, 3, 4].map((k) => <group key={k} position={[0, -0.26 + k * 0.13, 0.02 + (k === 2 ? 0.45 * sl : 0)]} rotation={[-0.5 - (k === 2 ? 0.6 * sl : 0), 0, 0]}>
          <mesh><planeGeometry args={[0.78, 0.12]} /><meshPhysicalMaterial color="#e8f4ff" transparent opacity={0.4} roughness={0.15} clearcoat={1} envMapIntensity={2} side={THREE.DoubleSide} depthWrite={false} /></mesh></group>)}
        {si > 0.03 && [0, 1, 2, 3, 4].map((k) => [-0.39, 0.39].map((xx, j) => <Box key={`${k}${j}`} p={[xx, -0.26 + k * 0.13, 0.03]} s={[0.03, 0.05 * Math.min(1, si * 1.5), 0.02]} c="#f7f7f2" r={0.3} />))}
      </group>
      {/* DORMITORIO: cama y la otra corrediza */}
      <group position={[3.5, 0, -1.2]}>
        <Box p={[0, 0.22, 0]} s={[1.4, 0.26, 2.0]} c="#5a381f" r={0.7} /><Box p={[0, 0.42, 0.05]} s={[1.3, 0.18, 1.85]} c="#f1ede4" r={0.95} rad={0.06} />
        <Plane p={[0, 0.515, 0.15]} s={[1.26, 1.5]} map={tex.quilt} rot={[-Math.PI / 2, 0, 0]} />
      </group>
      <SlideWin x={4.6} w={1.4} a={a} t={t} sfx="2" tex={tex} />
      {/* PATIO: pared de afuera con la ventana con reja, rosales y grava abajo, la mesa con el serrucho y la escoba */}
      <Box p={[8.2, 1.4, -1.05]} s={[4.8, 2.8, 0.14]} c="#e3d8c4" map={tex.plaster} r={0.95} rad={0.01} />
      {/* ventana del lavadero detrás de la reja: marco blanco, parteluz, cortinas a los lados y la luz cálida de adentro */}
      <mesh position={[7.6, 1.5, -0.975]}><planeGeometry args={[1.0, 0.9]} /><meshBasicMaterial color="#3a2c1c" /></mesh>
      <mesh position={[7.6, 1.5, -0.972]}><planeGeometry args={[0.66, 0.84]} /><meshBasicMaterial color="#ffd49a" toneMapped={false} transparent opacity={0.88} /></mesh>
      {/* adentro: estante con frascos en silueta, para que se lea un cuarto y no un panel */}
      <Box p={[7.6, 1.28, -0.97]} s={[0.66, 0.02, 0.005]} c="#6b4a2c" r={0.8} />
      {[7.42, 7.52, 7.66, 7.78].map((x, i) => <Box key={"fj" + i} p={[x, 1.34 + (i % 2) * 0.01, -0.969]} s={[0.05, 0.1 + (i % 2) * 0.03, 0.004]} c="#8a6a48" r={0.8} rad={0.004} />)}
      {/* farol de pared y caño de lluvia: la fachada no queda lisa */}
      <Box p={[8.55, 1.95, -0.95]} s={[0.1, 0.16, 0.08]} c="#1f2226" m={0.6} r={0.4} rad={0.01} />
      <Box p={[8.55, 1.93, -0.9]} s={[0.07, 0.1, 0.02]} c="#ffe2a8" e="#ffcf7a" ei={1.2} r={0.3} rad={0.006} />
      <pointLight position={[8.55, 1.85, -0.7]} intensity={0.5} distance={2.2} decay={2} color="#ffd59a" />
      <Box p={[6.75, 1.4, -0.94]} s={[0.07, 2.8, 0.07]} c="#b8b2a6" m={0.3} r={0.5} rad={0.03} />
      {[7.17, 8.03].map((x, i) => <Box key={"cu" + i} p={[x, 1.5, -0.968]} s={[0.2, 0.86, 0.01]} c="#cdb48e" map={tex.curtain} r={0.95} rad={0.004} />)}
      {[[7.6, 1.98, 1.12, 0.06], [7.6, 1.02, 1.12, 0.06]].map(([x, y, w2, h2], i) => <Box key={"fr" + i} p={[x, y, -0.955]} s={[w2, h2, 0.05]} c="#eeeae2" r={0.5} rad={0.008} />)}
      {[7.07, 8.13, 7.6].map((x, i) => <Box key={"fv" + i} p={[x, 1.5, -0.955]} s={[i === 2 ? 0.03 : 0.06, 0.9, 0.05]} c="#eeeae2" r={0.5} rad={0.008} />)}
      <Box p={[7.6, 0.98, -0.9]} s={[1.24, 0.04, 0.14]} c="#e2dccf" r={0.6} rad={0.01} />
      <Glass p={[7.6, 1.5, -0.96]} s={[1.0, 0.9]} op={0.3} />
      {Array.from({ length: 6 }, (_, i) => <Box key={i} p={[7.15 + i * 0.18, 1.5, -0.93]} s={[0.025, 0.95, 0.025]} c="#1c1c1c" m={0.7} r={0.4} />)}
      {[1.08, 1.92].map((y, i) => <Box key={i} p={[7.6, y, -0.93]} s={[1.05, 0.03, 0.03]} c="#1c1c1c" m={0.7} r={0.4} />)}
      {[[7.1, 1.05], [8.1, 1.05], [7.1, 1.95], [8.1, 1.95]].map(([x, y], i) => <mesh key={i} position={[x, y, -0.9]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.02, 12]} /><meshStandardMaterial color={gr > 0.3 ? "#e8eaec" : "#7d6a50"} metalness={0.9} roughness={0.3} emissive={gr > 0.3 ? "#bfe6ff" : "#000"} emissiveIntensity={0.4 * gr} /></mesh>)}
      <Box p={[7.6, 0.04, -0.62]} s={[2.2, 0.08, 0.6]} c="#a07a55" map={tex.soil} r={1} /><Box p={[7.6, 0.06, -0.31]} s={[2.24, 0.12, 0.06]} c="#b9ada0" r={0.8} rad={0.01} />
      {rs > 0.02 && [6.9, 7.45, 8.0, 8.4].map((x, i) => <Shrub key={i} p={[x, 0.08, -0.62]} r={0.26} h={0.62} tex={tex} seed={11 + i} flowers="#b81e34" k={0.3 + 0.7 * ease(Math.min(1, rs * 1.3 - i * 0.08))} />)}
      {gv > 0.02 && Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[6.6 + rnd(i, 1) * 2.0, 0.02, -0.25 + rnd(i, 2) * 0.25 * Math.min(1, gv * 1.5)]}><dodecahedronGeometry args={[0.025, 0]} /><meshStandardMaterial color="#9a958c" roughness={1} /></mesh>)}
      <group position={[9.7, 0, -0.3]}>
        <Box p={[0, 0.45, 0]} s={[1.0, 0.05, 0.6]} c="#8b7355" r={0.9} />
        {[[-0.45, -0.25], [0.45, -0.25], [-0.45, 0.25], [0.45, 0.25]].map(([x, z], i) => <Box key={i} p={[x, 0.22, z]} s={[0.05, 0.44, 0.05]} c="#6e5a40" />)}
        <group position={[0.1 + 0.06 * Math.sin(t * 9) * sw, 0.49, 0.05]}><Box p={[0, 0, 0]} s={[0.45, 0.01, 0.1]} c="#c9ccd0" m={0.9} r={0.3} /><Box p={[0.26, 0.01, 0]} s={[0.1, 0.03, 0.08]} c="#8a3a22" /></group>
        <Box p={[-0.2, 0.5, -0.1]} s={[0.7, 0.03, 0.03]} c="#d9c8a0" rot={[0, 0.3, 0]} />
      </group>
    </>
  );
};

// ---- PORTÓN: de noche, el garaje con el portón seccional y el abridor, la puerta a la casa, la cocina y el frente ----
const Porton: React.FC<SP> = ({ tex, tx, a, t }) => {
  const g = (k: string) => a[k] ?? 0;
  const dr = ease(g("door")), cd = g("cord"), hg = g("hanger"), ti = g("tie"), cl = g("clamp"), fr = g("frost"), tl = g("tools"), ld = g("ladder");
  const bo = g("bolt"), kp = g("keypad"), sn = g("sensor"), lf = ease(g("lift")), gl = g("glove"), tube = 1 - 0.85 * g("dark");
  return (
    <>
      <Ground tex={tex} w={30} cx={1.0} />
      <Box p={[1.0, 0.01, 1.6]} s={[30, 0.03, 1.2]} c="#8e8a82" r={0.95} rad={0.01} cast={false} />
      <Room x0={-7.5} x1={-0.5} floor="#6a6c6e" tex={tex} wallC="#c9c3b6" />
      <Room x0={-0.5} x1={3.0} floor="#b8b0a2" tex={tex} />
      <Box p={[-7.5, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      {/* tubo fluorescente */}
      <Box p={[-4.5, 2.55, -1.2]} s={[1.4, 0.05, 0.08]} c="#f4f8ff" e="#e8f2ff" ei={1.4 * tube} r={0.3} />
      <pointLight position={[-4.5, 2.4, -0.8]} intensity={3.2 * tube} distance={6} color="#eaf2ff" />
      {/* el PORTÓN seccional: sube girando sobre su borde de arriba hacia adentro */}
      <Box p={[-4.5, 1.1, -2.2]} s={[3.3, 2.2, 0.02]} c="#0b0f18" r={1} />
      {[-6.18, -2.82].map((x, i) => <Box key={i} p={[x, 1.12, -2.08]} s={[0.06, 2.25, 0.08]} c="#9aa0a6" m={0.8} r={0.35} />)}
      <group position={[-4.5, 2.24, -2.12]} rotation={[-1.32 * dr, 0, 0]}>
        {[0, 1, 2, 3].map((k) => <Box key={k} p={[0, -0.275 - k * 0.55, 0]} s={[3.2, 0.53, 0.05]} c="#eceae4" r={0.5} rad={0.01} />)}
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => <Box key={i} p={[x, -0.275, 0.03]} s={[0.55, 0.26, 0.01]} c={fr > 0.3 ? "#eef3f6" : "#1d2a3c"} e={fr > 0.3 ? "#dde8ee" : "#000"} ei={0.3 * fr} m={0.3} r={0.1} />)}
      </group>
      {/* el abridor: riel, carro, cordón rojo con manija; el precinto blanco; el alambre que entra por arriba */}
      <Box p={[-4.5, 2.4, -0.95]} s={[0.06, 0.05, 2.3]} c="#7d838a" m={0.7} r={0.35} />
      <Box p={[-4.5, 2.35, 0.3]} s={[0.4, 0.22, 0.45]} c="#d8dade" r={0.5} rad={0.03} />
      <Box p={[-4.5, 2.33, -1.6]} s={[0.12, 0.08, 0.18]} c="#5f656b" m={0.6} r={0.4} />
      <group position={[-4.5, 2.29, -1.6]} rotation={[-0.9 * cd, 0, 0]}>
        <Box p={[0, -0.25, 0]} s={[0.012, 0.5, 0.012]} c="#c62828" />
        <Box p={[0, -0.53, 0]} s={[0.06, 0.09, 0.03]} c="#d32f2f" r={0.5} rad={0.01} />
      </group>
      {ti > 0.03 && <mesh position={[-4.5, 2.33, -1.5]} rotation={[0, 0, 0]} scale={Math.min(1, ti * 1.4)}><torusGeometry args={[0.05, 0.006, 6, 18]} /><meshStandardMaterial color="#f7f7f2" roughness={0.5} /></mesh>}
      {hg > 0.03 && <group position={[-4.5, 2.24, -2.08]} rotation={[0.55 * Math.min(1, hg * 1.4), 0, 0]}>
        <Box p={[0, -0.32 * Math.min(1, hg * 1.2), 0]} s={[0.008, 0.64 * Math.min(1, hg * 1.2), 0.008]} c="#c9ccd0" m={1} r={0.3} /></group>}
      {cl > 0.03 && <group position={[-2.82, 2.0, -1.98]} scale={Math.min(1, cl * 1.4)}><Box p={[0, 0, 0]} s={[0.05, 0.16, 0.12]} c="#c62828" m={0.4} r={0.4} /><Cyl p={[0.06, 0, 0]} r={0.012} h={0.14} c="#c9ccd0" m={1} rough={0.3} rot={[0, 0, Math.PI / 2]} /></group>}
      <Car x={-4.5} glove={gl} />
      <Box p={[-4.62, 1.17, -0.45]} s={[0.12, 0.04, 0.07]} c="#2d2f33" r={0.5} rad={0.01} />
      {/* herramientas: de los ganchos al gabinete con candado; la escalera acostada con cadena */}
      <group position={[-6.9, 0, -1.95]}>
        <Box p={[0, 0.7, 0]} s={[0.6, 1.4, 0.45]} c="#6f767c" m={0.5} r={0.45} />
        <group position={[-0.3, 0.7, 0.23]} rotation={[0, -1.6 * (1 - tl), 0]}><Box p={[0.3, 0, 0]} s={[0.6, 1.36, 0.03]} c="#7d858c" m={0.5} r={0.4} /></group>
        {tl > 0.6 && <Box p={[0.25, 0.75, 0.27]} s={[0.06, 0.08, 0.04]} c="#c9a14a" m={1} r={0.3} />}
      </group>
      {tl < 0.6 && [[-6.5, 1.75, "#5f656b", 0.8], [-6.25, 1.7, "#8a5a2a", 0.4], [-6.05, 1.72, "#c62828", 0.35]].map(([x, y, c, h], i) => <Box key={i} p={[x as number, y as number, -2.15]} s={[0.05, h as number, 0.04]} c={c as string} m={0.5} r={0.4} />)}
      <group position={[-6.9, 0.06, -0.9]}>
        <Box p={[0, 0, 0]} s={[0.4, 0.05, 1.8]} c="#c0c5ca" m={0.8} r={0.3} />
        {ld > 0.03 && Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.22 + (i % 2) * 0.02, 0.05 + i * 0.05 * ld, -0.8]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}><torusGeometry args={[0.022, 0.006, 6, 12]} /><meshStandardMaterial color="#c9ccd0" metalness={1} roughness={0.3} /></mesh>)}
      </group>
      {/* la puerta del garaje a la casa, con el cerrojo */}
      <BackDoor x={-2.05} c="#8a5a33">
        <Box p={[0.78, 1.25, 0.05]} s={[0.14, 0.05, 0.03]} c="#9aa0a6" m={0.9} r={0.3} />
        <Box p={[0.82 + 0.12 * bo, 1.25, 0.07]} s={[0.12, 0.025, 0.025]} c="#d0d4d8" m={1} r={0.25} />
      </BackDoor>
      {/* COCINA */}
      <Kitchen x={1.4} /><Lamp p={[2.2, 0.95, -1.95]} />
      {/* FRENTE: pared, portón visto de afuera, teclado y luz con sensor */}
      <Box p={[6.5, 1.4, -1.05]} s={[6.6, 2.8, 0.14]} c="#e3d8c4" map={tex.plaster} r={0.95} rad={0.01} />
      <Box p={[6.3, 1.1, -0.99]} s={[2.7, 2.2, 0.02]} c="#0b0f18" r={1} />
      <group position={[6.3, 2.2, -0.96]} rotation={[-1.2 * lf, 0, 0]}>
        {[0, 1, 2, 3].map((k) => <Box key={k} p={[0, -0.275 - k * 0.55, 0]} s={[2.6, 0.53, 0.04]} c="#eceae4" r={0.5} rad={0.01} />)}
      </group>
      <group position={[4.7, 1.2, -0.95]}>
        <Box p={[0, 0, 0]} s={[0.12, 0.16, 0.03]} c="#2b2d31" r={0.4} rad={0.01} />
        {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-0.035 + (i % 3) * 0.035, 0.04 - Math.floor(i / 3) * 0.035, 0.018]} s={[0.025, 0.025, 0.006]} c={[1, 4, 6, 8].includes(i) && kp > 0.1 ? "#f2e6b8" : "#8d9196"} e={[1, 4, 6, 8].includes(i) ? "#ffd27a" : "#000"} ei={0.7 * kp} m={0.6} r={0.3} />)}
      </group>
      <group position={[6.3, 2.45, -0.95]}>
        <Box p={[0, 0, 0]} s={[0.3, 0.12, 0.14]} c="#2a2a2a" m={0.5} r={0.4} />
        <Box p={[0, -0.04, 0.06]} s={[0.24, 0.06, 0.04]} c="#fffbe8" e="#ffffff" ei={2.5 * sn} r={0.2} />
        <spotLight position={[0, -0.05, 0.2]} angle={0.7} penumbra={0.5} intensity={9 * sn} distance={7} color="#fffaf0" />
      </group>
      <Box p={[8.9, 1.0, -0.97]} s={[0.9, 2.0, 0.06]} c="#5e3a20" r={0.55} />
      <mesh position={[6.5, 3.1, -1.05]} rotation={[0, Math.PI / 4, 0]} scale={[1.8, 1, 0.5]}><coneGeometry args={[2.6, 0.9, 4]} /><meshStandardMaterial color="#9a5a42" roughness={0.8} /></mesh>
    </>
  );
};

export type WorldState = { lamps: number; anim: Record<string, number>; heat: Record<string, number>; good: Record<string, number>; trail: number; hot: string };

export const World: React.FC<{ t: number; cam: Cam; st: WorldState; scene: Scene }> = ({ t, cam, st, scene }) => {
  const tx = useTextures(), tex = useCasaTex();
  const P = PTS[scene], day = scene === "llave";
  const path = useMemo(() => SPOTS[scene].map((k) => [P[k][0], 0.02, Math.max(-1.2, P[k][2] + 0.5)] as V3), [scene, P]);
  const bg = day ? "#a9c6de" : "#0e1626", cp = cam.camAt(t).p;
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true }} camera={{ fov: 38, position: [0, 3, 8] }}>
      <CamSet t={t} camAt={cam.camAt} />
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 14, 42]} />
      {day ? <>
        <ambientLight intensity={0.45} color="#fff6e6" />
        <hemisphereLight args={["#cfe3ff", "#4a5a3a", 0.6]} />
        <directionalLight position={[-5, 9, 7]} intensity={2.1} color="#fff1d6" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={9} shadow-camera-bottom={-9} />
      </> : <>
        <pointLight position={[0.5, 2.2, 3.0]} intensity={4} distance={7} color="#b9c8ff" />
        <ambientLight intensity={0.22} color="#7d8fb8" />
        <directionalLight position={[-6, 9, 6]} intensity={0.55} color="#9fb6ff" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />
        {[-4.2, -1.4, 1.5, 4.2, 7.4].map((x, i) => <pointLight key={i} position={[x, 2.2, -1.2]} intensity={2.4 * st.lamps} distance={4.5} color="#ffcf8f" castShadow={i === 2} />)}
      </>}
      {scene === "papeles" && <Papeles tex={tex} tx={tx} a={st.anim} />}
      {scene === "joyas" && <Joyas tex={tex} tx={tx} a={st.anim} />}
      {scene === "llave" && <Llave tex={tex} tx={tx} a={st.anim} />}
      {scene === "vaso" && <Vaso tex={tex} tx={tx} a={st.anim} t={t} />}
      {scene === "ventana" && <Ventana tex={tex} tx={tx} a={st.anim} t={t} />}
      {scene === "porton" && <Porton tex={tex} tx={tx} a={st.anim} t={t} />}
      <Trail k={st.trail} path={path} />
      {Object.entries(st.heat).map(([k, v]) => P[k] ? <Heat key={"h" + k} p={P[k]} on={v} t={t} col={st.hot} cd={cp.distanceTo(v3(P[k]))} /> : null)}
      {st.hot !== "#ffffff" && Object.entries(st.good).map(([k, v]) => P[k] && GOODS[scene] ? <Heat key={"g" + k} p={P[k]} on={v} t={t} col="#3fe08a" r={0.5} cd={cp.distanceTo(v3(P[k]))} /> : null)}
      <Post bloom={day ? 0.35 : 0.42} threshold={day ? 0.97 : 0.95} exposure={day ? 1.0 : 1.02} env={day ? 0.55 : 0.45} />
    </ThreeCanvas>
  );
};
