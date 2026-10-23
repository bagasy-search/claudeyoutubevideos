// alpinhum · EL MUNDO: el pasillo de Doña Elena en corte de casa de muñecas (frente abierto). La pared del fondo está
// CORTADA en su punta derecha: en el corte se ve el revoque, el ladrillo y el cimiento metido en la tierra, y el agua
// que SUBE por capilaridad como un mapa de calor; la pintura plástica es una TAPA que no la deja salir (ampollas).
// Del otro lado de la pared, el patio: la jardinera de ladrillo con la tierra más alta que el piso de adentro y la
// canaleta que descarga al pie del muro. A la izquierda del pasillo, la mesa de trabajo con EL MANUAL y las herramientas.
// UNA escena y UNA cámara. Eventos clavados a la voz (segundos globales). Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { P } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];

// ---------------- medidas de la pared ----------------
export const ZI = -1.35, ZO = -1.64, XC = 1.6; // cara de adentro, cara de afuera, punta cortada
const X0 = -3.2, WH = 2.6, FD = 0.8;             // la pared arranca en X0, alto, cimiento bajo el piso

export const PT = {
  blister: [0.2, 0.36, ZI] as V3,       // la ampolla grande (la del gancho)
  stain: [-0.4, 0.75, ZI] as V3,        // borde de arriba de la mancha
  bucket: [0.95, 0.2, -0.95] as V3,
  cut: [XC, 0.45, (ZI + ZO) / 2] as V3, // el corte del muro
  cutLow: [XC, -0.45, (ZI + ZO) / 2] as V3,
  film: [XC, 0.55, ZI] as V3,            // la pintura vista en el corte
  planter: [-0.3, 0.55, -1.95] as V3,
  pipe: [1.1, 0.7, -1.75] as V3,
  book: [-2.3, 0.8, 0.3] as V3,
  brush: [-2.62, 0.8, 0.12] as V3,
  bag: [-1.75, 0.0, 0.45] as V3,
  bottle: [-2.0, 0.8, 0.08] as V3,
};

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const B = PT.book, bk = (dx: number, dy: number, dz: number): V3 => [B[0] + dx, B[1] + dy, B[2] + dz];
export const C1 = 83.3; // arranque del vuelo a la guía
export const KEYS: Key[] = [
  // A · desde el portal del avatar: la pared recién pintada, el balde "antihumedad"
  { t: 3.4, p: [0.9, 1.35, 1.3], l: [-0.1, 0.7, -1.35], fov: 42 },
  { t: 7.2, p: [0.75, 1.0, 0.6], l: [0.2, 0.45, -1.35], fov: 38 },
  { t: 10.6, p: [0.95, 0.62, 0.05], l: [0.7, 0.25, -1.1], fov: 36 },
  // "pasa la mano por la pared abajo": baja a la ampolla
  { t: 12.0, p: [0.85, 0.6, 0.0], l: [0.6, 0.3, -1.2], fov: 36 },
  { t: 15.2, p: [0.3, 0.42, -0.85], l: [0.2, 0.36, -1.35], fov: 32 },
  { t: 16.4, p: [0.26, 0.4, -0.95], l: [0.2, 0.36, -1.35], fov: 30 },
  // E · "dos veces este año": al CORTE del muro, el agua sube como un mapa de calor y la pintura la tapa
  { t: 41.8, p: [3.7, 1.0, -0.9], l: [1.6, 0.3, -1.6], fov: 44 },
  { t: 44.6, p: [3.3, 0.7, -1.3], l: [1.6, 0.25, -1.6], fov: 42 },
  { t: 48.4, p: [3.2, 0.65, -1.4], l: [1.6, 0.25, -1.6], fov: 42 },
  // "lo que encontré del otro lado de esa pared, afuera": pasa por arriba del muro al patio
  { t: 50.2, p: [1.9, 4.2, -0.5], l: [0.0, 1.0, -3.4], fov: 44, arc: 0.1 },
  { t: 51.4, p: [0.7, 1.55, -4.1], l: [-0.1, 0.45, -1.9], fov: 40 },
  { t: 53.6, p: [0.55, 1.45, -3.9], l: [-0.1, 0.45, -1.9], fov: 38 },
  // H · cepillo, bolsa, líquido: la mesa de trabajo
  { t: 58.8, p: [-1.15, 1.55, 1.75], l: [-2.15, 0.55, 0.2], fov: 38 },
  { t: 63.6, p: [-1.4, 1.45, 1.55], l: [-2.2, 0.6, 0.25], fov: 36 },
  // CTA · la pared → vuela a la mesa, EL MANUAL se abre en la pág. 11 REAL
  { t: C1, p: [0.9, 1.3, 1.2], l: [-0.1, 0.6, -1.35], fov: 40 },
  { t: C1 + 0.4, p: [0.85, 1.32, 1.25], l: [-0.2, 0.6, -1.3], fov: 40 },
  { t: C1 + 2.6, p: bk(0.35, 1.25, 2.2), l: bk(0, 0, 0), fov: 38, arc: 0.12 },
  { t: C1 + 4.2, p: bk(0, 0.55, 0.78), l: bk(0, 0.005, 0), fov: 34 },
  // "página 11": la tapa se abre (el avatar en videollamada a la izquierda: el libro corrido a la derecha)
  { t: C1 + 6.3, p: bk(0.04, 0.495, 0.48), l: bk(-0.13, 0, 0), fov: 34 },
  { t: C1 + 8.4, p: bk(0.04, 0.47, 0.42), l: bk(-0.11, 0, 0), fov: 33 },
  // la tabla de cantidades: baja sobre la página
  { t: C1 + 9.0, p: bk(0, 0.425, 0.32), l: bk(0, 0, 0.03), fov: 32 },
  { t: C1 + 13.4, p: bk(0, 0.4, 0.33), l: bk(0, 0, 0.06), fov: 32 },
  // "si la humedad pasa por encima": baja al recuadro SI NO SALE
  { t: C1 + 14.2, p: bk(-0.04, 0.36, 0.45), l: bk(-0.06, 0, 0.12), fov: 32 },
  { t: C1 + 15.4, p: bk(-0.04, 0.35, 0.46), l: bk(-0.06, 0, 0.12), fov: 32 },
  // "el enlace": se aleja un poco
  { t: C1 + 15.9, p: bk(0, 0.655, 0.92), l: bk(0, 0.035, 0), fov: 38 },
  { t: C1 + 18.4, p: bk(-0.05, 0.67, 1.0), l: bk(0, 0.035, 0), fov: 38 },
  // "Ahora sí, vamos a la pared"
  { t: C1 + 20.0, p: [0.9, 1.3, 1.2], l: [-0.1, 0.6, -1.35], fov: 40, arc: 0.1 },
  { t: C1 + 23, p: [0.8, 1.25, 1.1], l: [-0.1, 0.6, -1.35], fov: 40 },
];
// ---------------- el RESTO del video (104 s → final): tomas con nombre; cada tramo de mundo = [a, b, desde, hasta] ----------------
export const CP: Record<string, { p: V3; l: V3; fov?: number }> = {
  wall: { p: [0.9, 1.3, 1.2], l: [-0.1, 0.6, -1.35], fov: 40 },
  wall2: { p: [0.5, 1.15, 0.9], l: [-0.6, 0.55, -1.35], fov: 40 },
  low: { p: [0.75, 0.62, 0.05], l: [0.0, 0.35, -1.35], fov: 38 },
  low2: { p: [-0.5, 0.66, -0.15], l: [-0.9, 0.42, -1.35], fov: 38 },
  knee: { p: [-0.1, 0.9, 0.7], l: [-0.5, 0.55, -1.35], fov: 46 },
  knee2: { p: [-0.6, 0.95, 0.55], l: [-0.9, 0.6, -1.35], fov: 46 },
  sec: { p: [3.3, 0.7, -1.3], l: [1.6, 0.25, -1.6], fov: 42 },
  secHi: { p: [3.7, 1.0, -0.9], l: [1.6, 0.3, -1.6], fov: 44 },
  secClose: { p: [2.45, 0.45, -1.15], l: [1.6, 0.2, -1.5], fov: 38 },
  secBase: { p: [2.6, 0.05, -1.0], l: [1.6, -0.1, -1.5], fov: 42 },
  secFace: { p: [2.3, 0.6, -0.4], l: [1.2, 0.35, -1.35], fov: 42 },
  top: { p: [1.9, 4.2, -0.5], l: [0.0, 1.0, -3.4], fov: 44 },
  both: { p: [3.4, 3.2, -1.5], l: [-0.2, 0.3, -1.5], fov: 46 },
  patio: { p: [0.7, 1.55, -4.1], l: [-0.1, 0.45, -1.9], fov: 40 },
  patio2: { p: [0.55, 1.45, -3.9], l: [-0.1, 0.45, -1.9], fov: 38 },
  patioLow: { p: [-1.0, 0.65, -3.3], l: [-0.2, 0.3, -1.8], fov: 42 },
  patioLow2: { p: [-0.6, 0.6, -3.1], l: [0.0, 0.3, -1.8], fov: 42 },
  pipe: { p: [2.1, 1.3, -3.4], l: [1.0, 0.45, -1.9], fov: 42 },
  pipe2: { p: [1.8, 1.1, -3.2], l: [0.9, 0.4, -2.0], fov: 42 },
  table: { p: [-1.15, 1.55, 1.75], l: [-2.15, 0.55, 0.2], fov: 38 },
  table2: { p: [-1.4, 1.45, 1.55], l: [-2.2, 0.6, 0.25], fov: 36 },
  floor: { p: [-0.7, 0.9, 1.6], l: [-1.6, 0.2, 0.3], fov: 40 },
  bookW: { p: bk(0, 0.655, 0.92), l: bk(0, 0.035, 0), fov: 38 },
  bookIn: { p: bk(0.04, 0.47, 0.42), l: bk(-0.11, 0, 0), fov: 33 },
  page: { p: bk(0, 0.425, 0.32), l: bk(0, 0, 0.03), fov: 32 },
  pageBox: { p: bk(0.0, 0.37, 0.4), l: bk(0, 0, 0.09), fov: 32 },
  pageBox2: { p: bk(0.02, 0.36, 0.42), l: bk(0, 0, 0.1), fov: 32 },
};
export const WSEG: [number, number, string, string][] = [];
export const wseg = (a: number, b: number, A: string, Bn: string) => {
  WSEG.push([a, b, A, Bn]);
  KEYS.push({ t: a - 0.05, ...CP[A] }, { t: a, ...CP[A] }, { t: b, ...CP[Bn] }, { t: b + 0.05, ...CP[Bn] });
  KEYS.sort((x, y) => x.t - y.t);
};
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

// ---------------- páginas REALES del manual (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  const o = useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas manual");
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + (id === "qr" ? ".png" : ".jpg")), (tt) => { flip.image = tt.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
  return o;
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useWallTex = () => useMemo(() => ({
  // baldosa colorada (terracota) del pasillo
  terra: mk(256, 256, (g) => {
    g.fillStyle = "#5a3424"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = rnd(r * 4 + c, 2);
      g.fillStyle = `rgb(${168 + v * 30},${88 + v * 18},${62 + v * 12})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60);
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(80,30,15,${0.12 * rnd(i, r * 4 + c)})`; g.fillRect(c * 64 + 2 + rnd(i, 3) * 58, r * 64 + 2 + rnd(i, 4) * 58, 3, 3); } }
  }, [8, 6]),
  // revoque pintado crema (pared de adentro), con textura leve
  cream: mk(256, 256, (g) => {
    g.fillStyle = "#ece2cc"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${v > 0.5 ? 255 : 150},${v > 0.5 ? 250 : 135},${v > 0.5 ? 240 : 110},.08)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }, [6, 3]),
  // la MANCHA de humedad: banda oscura con borde de arriba dentado, salitre blanco abajo (alfa)
  stain: mk(1024, 512, (g) => {
    const top = (x: number) => 150 + Math.sin(x * 0.013) * 30 + Math.sin(x * 0.041 + 1) * 16 + Math.sin(x * 0.11) * 7;
    for (let x = 0; x < 1024; x += 2) {
      const y0 = top(x);
      const gr = g.createLinearGradient(0, y0 - 6, 0, 512); gr.addColorStop(0, "rgba(120,92,52,0)"); gr.addColorStop(0.02, "rgba(112,84,46,.75)"); gr.addColorStop(0.05, "rgba(150,122,80,.5)"); gr.addColorStop(0.5, "rgba(118,96,62,.55)"); gr.addColorStop(1, "rgba(88,70,46,.72)");
      g.fillStyle = gr; g.fillRect(x, y0 - 6, 2, 512 - y0 + 6);
    }
    for (let i = 0; i < 9000; i++) { const y = 512 - Math.pow(rnd(i, 2), 2.2) * 90; g.fillStyle = `rgba(255,255,250,${0.25 + 0.5 * rnd(i, 3)})`; g.fillRect(rnd(i, 1) * 1024, y, 1 + rnd(i, 4) * 1.6, 1 + rnd(i, 5) * 1.6); }
  }),
  // EL CORTE del muro (ancho = espesor 0,29, alto = 2,6 + 0,8 de cimiento): revoque | ladrillo con juntas | revoque
  section: mk(290, 3400, (g) => {
    g.fillStyle = "#d9d2c3"; g.fillRect(0, 0, 290, 3400);
    // ladrillos (25 a 265 px de ancho = 24 cm), juntas cada 7,5 cm
    for (let r = 0; r < 46; r++) { const y = r * 75, v = rnd(r, 2);
      g.fillStyle = r >= 35 ? `rgb(${120 + v * 20},${118 + v * 18},${112 + v * 16})` : `rgb(${170 + v * 30},${82 + v * 20},${56 + v * 14})`;
      g.fillRect(27, y + 6, 236, 64);
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,20,10,${0.18 * rnd(i, r)})`; g.fillRect(27 + rnd(i, 3) * 230, y + 6 + rnd(i, 4) * 60, 4, 3); } }
    g.fillStyle = "#ece2cc"; g.fillRect(0, 0, 25, 2600); g.fillStyle = "#cfc8b8"; g.fillRect(265, 0, 25, 2600); // revoques
    g.fillStyle = "#8a8378"; g.fillRect(0, 2600, 290, 800); // cimiento de hormigón
    for (let i = 0; i < 900; i++) { const v = 100 + rnd(i, 1) * 70; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.fillRect(rnd(i, 2) * 290, 2600 + rnd(i, 3) * 800, 4, 4); }
  }),
  // mapa de calor del agua que sube: rojo abajo (empapado) → naranja → amarillo → nada
  heat: mk(64, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, "rgba(255,230,80,0)"); gr.addColorStop(0.08, "rgba(255,226,70,.55)"); gr.addColorStop(0.3, "rgba(255,150,40,.7)"); gr.addColorStop(0.65, "rgba(230,50,35,.78)"); gr.addColorStop(1, "rgba(150,20,40,.85)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 512);
  }),
  // el bloque de tierra cortado (frente) y la tierra mojada contra la pared
  soil: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#5b4331"); gr.addColorStop(0.5, "#4f3a2a"); gr.addColorStop(1, "#7a5a3c"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 700; i++) { const v = 70 + rnd(i, 4) * 70; g.fillStyle = `rgb(${v + 20},${v},${v - 18})`; g.beginPath(); g.ellipse(rnd(i, 5) * 1024, rnd(i, 6) * 512, 2 + rnd(i, 7) * 6, 2 + rnd(i, 8) * 4, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 50; i++) { g.strokeStyle = `rgba(40,25,12,${0.3 * rnd(i, 3)})`; g.lineWidth = 2; g.beginPath(); const x = rnd(i, 1) * 1024; g.moveTo(x, 0); g.bezierCurveTo(x + 20, 60, x - 30, 120, x + 10 * rnd(i, 2), 180); g.stroke(); }
  }),
  // revoque de afuera con moho y mancha oscura abajo
  outer: mk(512, 512, (g) => {
    g.fillStyle = "#d6cfbf"; g.fillRect(0, 0, 512, 512);
    const gr = g.createLinearGradient(0, 290, 0, 512); gr.addColorStop(0, "rgba(70,70,50,0)"); gr.addColorStop(0.35, "rgba(70,74,48,.55)"); gr.addColorStop(1, "rgba(48,60,36,.85)"); g.fillStyle = gr; g.fillRect(0, 290, 512, 222);
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(60,${90 + rnd(i, 2) * 40},50,${0.3 * rnd(i, 3)})`; g.beginPath(); g.arc(rnd(i, 1) * 512, 400 + rnd(i, 4) * 112, 2 + rnd(i, 5) * 6, 0, 6.3); g.fill(); }
  }, [3, 1]),
  brick: mk(256, 256, (g) => {
    g.fillStyle = "#b9b0a2"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) for (let c = -1; c < 4; c++) { const v = rnd(r * 5 + c, 2); g.fillStyle = `rgb(${160 + v * 35},${78 + v * 20},${55 + v * 15})`; g.fillRect(c * 64 + (r % 2) * 32 + 2, r * 32 + 2, 60, 28); }
  }, [4, 1]),
  pave: mk(256, 256, (g) => {
    g.fillStyle = "#6f6d68"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = 120 + rnd(r * 4 + c, 1) * 30; g.fillStyle = `rgb(${v},${v - 2},${v - 6})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); }
  }, [8, 4]),
  // etiqueta del balde: "ANTIHUMEDAD" (pintura plástica)
  label: mk(512, 256, (g) => {
    g.fillStyle = "#f6f7f9"; g.fillRect(0, 0, 512, 256);
    g.fillStyle = "#1f5fbf"; g.fillRect(0, 0, 512, 70); g.fillStyle = "#e23b2e"; g.fillRect(0, 196, 512, 60);
    g.fillStyle = "#ffffff"; g.font = "900 48px Arial"; g.textAlign = "center"; g.fillText("ANTIHUMEDAD", 256, 52);
    g.fillStyle = "#1d2733"; g.font = "800 40px Arial"; g.fillText("PINTURA PLÁSTICA", 256, 130); g.font = "700 30px Arial"; g.fillText("LÁTEX · 20 L", 256, 172);
  }),
  // la bolsa de cemento
  bag: mk(256, 256, (g) => {
    g.fillStyle = "#c9b48c"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#8d2b22"; g.fillRect(0, 70, 256, 80);
    g.fillStyle = "#fff"; g.font = "900 46px Arial"; g.textAlign = "center"; g.fillText("CEMENTO", 128, 126); g.fillStyle = "#3a2c1c"; g.font = "700 26px Arial"; g.fillText("50 kg", 128, 200);
  }),
  // el bidón del hidrófugo
  hidro: mk(256, 256, (g) => {
    g.fillStyle = "#f2f4f5"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#1c7a5a"; g.fillRect(0, 60, 256, 110);
    g.fillStyle = "#fff"; g.font = "900 40px Arial"; g.textAlign = "center"; g.fillText("HIDRÓFUGO", 128, 115); g.font = "700 22px Arial"; g.fillText("PARA MORTERO · 1 L", 128, 150);
  }),
  sky: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#8fa6b8"); gr.addColorStop(0.45, "#c4ccd0"); gr.addColorStop(0.55, "#b8b4a8"); gr.addColorStop(1, "#4a4038"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);

// las AMPOLLAS de la pintura: medias esferas aplastadas pegadas a la cara de adentro; k = cuánto se inflaron
const BL = Array.from({ length: 20 }, (_, i) => ({ x: -2.6 + rnd(i, 1) * 3.9, y: 0.15 + Math.pow(rnd(i, 2), 1.6) * 0.32, r: 0.016 + rnd(i, 3) * 0.03, d: rnd(i, 4) }));
const Blisters: React.FC<{ k: number; big: number; pop: number }> = ({ k, big, pop }) => (
  <group>
    {k > 0.01 && BL.map((b, i) => { const sc = b.r * cl((k - b.d * 0.5) / 0.5); if (sc < 0.002) return null;
      return <mesh key={i} position={[b.x, b.y, ZI + 0.001]} rotation={[Math.PI / 2, 0, 0]} scale={[sc, sc * 0.16, sc]}><sphereGeometry args={[1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e6dbc2" roughness={0.95} /></mesh>; })}
    {/* la grande del gancho: se infla, se rompe (pop) y queda el agujero oscuro */}
    {big > 0.01 && pop < 0.5 && <mesh position={PT.blister} rotation={[Math.PI / 2, 0, 0]} scale={[0.06 * big, 0.06 * big * 0.42, 0.06 * big]} castShadow><sphereGeometry args={[1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f1e8d3" roughness={0.45} /></mesh>}
    {pop >= 0.5 && <mesh position={[PT.blister[0], PT.blister[1], ZI + 0.002]}><circleGeometry args={[0.05, 24]} /><meshStandardMaterial color="#6b5a44" roughness={1} /></mesh>}
  </group>
);

// el agua que SUBE dentro del corte: mapa de calor hasta la altura h + gotitas que suben por el ladrillo y rebotan en la pintura
const Capillary: React.FC<{ t: number; h: number; on: number; tex: THREE.Texture; film: number }> = ({ t, h, on, tex, film }) => {
  if (on < 0.01) return null;
  const hh = h + FD; // desde el fondo del cimiento
  return (
    <group>
      <mesh position={[XC + 0.003, -FD + hh / 2, (ZI + ZO) / 2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[ZI - ZO, hh]} /><meshBasicMaterial map={tex} transparent opacity={on} depthWrite={false} toneMapped={false} /></mesh>
      {Array.from({ length: 46 }, (_, i) => {
        const ph = ((t * (0.18 + rnd(i, 1) * 0.12) + rnd(i, 2)) % 1), y = -FD + ph * hh, z = ZO + 0.03 + rnd(i, 3) * (ZI - ZO - 0.06);
        // cerca de la pintura (cara de adentro) la gotita se aprieta contra la tapa
        const zz = film > 0.5 && y > 0.05 ? Math.min(ZI - 0.004, z + (ZI - z) * sm((ph - 0.6) / 0.4)) : z;
        return <mesh key={i} position={[XC + 0.006, y, zz]}><sphereGeometry args={[0.007 + rnd(i, 4) * 0.006, 8, 6]} /><meshBasicMaterial color="#9fe0ff" transparent opacity={on * (0.9 - ph * 0.5)} toneMapped={false} /></mesh>;
      })}
      {/* la TAPA: la pintura plástica en la cara de adentro, brillante */}
      {film > 0.01 && <mesh position={[XC + 0.004, WH / 2, ZI + 0.002]}><boxGeometry args={[0.006, WH, 0.006 * film]} /><meshStandardMaterial color="#cfe3ff" emissive="#9cc4ff" emissiveIntensity={0.8 * film} roughness={0.1} /></mesh>}
    </group>
  );
};

// la jardinera de ladrillo contra la pared de afuera, con la tierra apilada más alta que el piso de adentro
const Planter: React.FC<{ glow: number; low?: number }> = ({ glow, low = 0 }) => {
  const sh = 0.5 - 0.3 * low, sd = 0.6 - 0.15 * low;
  const mound = useMemo(() => { const g = new THREE.SphereGeometry(1, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2); const ps = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < ps.count; i++) { const x = ps.getX(i), y = ps.getY(i), z = ps.getZ(i); ps.setXYZ(i, x, y * (1 + 0.15 * Math.sin(x * 9 + z * 7)), z); } g.computeVertexNormals(); return g; }, []);
  return (
    <group>
      {/* paredes de la jardinera */}
      <Box p={[-0.3, 0.25, -2.27]} s={[2.2, 0.6, 0.12]} c="#c9805a" r={0.9} rad={0.01} />
      <Box p={[-1.38, 0.25, -1.96]} s={[0.12, 0.6, 0.62]} c="#c9805a" r={0.9} rad={0.01} />
      <Box p={[0.78, 0.25, -1.96]} s={[0.12, 0.6, 0.62]} c="#c9805a" r={0.9} rad={0.01} />
      {/* la tierra: llena hasta arriba y apilada CONTRA la pared */}
      <Box p={[-0.3, 0.02 + sh / 2, -1.95 - 0.075 * low]} s={[2.05, sh, sd]} c="#3b2a1d" r={1} rad={0.01} />
      {low < 0.98 && <mesh geometry={mound} position={[-0.3, 0.5 - 0.3 * low, -1.72]} scale={[1.0, 0.14 * (1 - low) + 0.001, 0.18]} castShadow receiveShadow><meshStandardMaterial color="#35261a" roughness={1} emissive="#ff5a2a" emissiveIntensity={glow * 0.35} /></mesh>}
      {/* malvones y el aloe */}
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-1.2 + i * 0.24, 0.55 - 0.3 * low, -2.0 + rnd(i, 2) * 0.12]}>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.008, 0.01, 0.24, 6]} /><meshStandardMaterial color="#4f7a32" /></mesh>
        <mesh position={[0, 0.06, 0]} scale={[0.09, 0.05, 0.09]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#3f6b2a" roughness={0.9} /></mesh>
        {i % 3 !== 1 && <mesh position={[0, 0.26, 0]} scale={0.045}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#d8283a" roughness={0.7} /></mesh>}
      </group>)}
      {Array.from({ length: 8 }, (_, i) => <mesh key={"a" + i} position={[0.45, 0.62 - 0.3 * low, -2.0]} rotation={[0.5 * Math.cos(i), (i / 8) * Math.PI * 2, 0.6]}><coneGeometry args={[0.025, 0.32, 6]} /><meshStandardMaterial color="#5f8f6a" roughness={0.7} /></mesh>)}
    </group>
  );
};

// la canaleta que baja por la pared de afuera y DESCARGA al pie del muro (rain = agua cayendo)
const Downpipe: React.FC<{ t: number; rain: number; ext?: number }> = ({ t, rain, ext = 0 }) => { const zE = -1.74 - 0.95 * ext, zW = ext > 0.5 ? zE - 0.04 : -1.74; return (
  <group>
    {ext > 0.01 && <group><mesh position={[1.1, 0.68, -1.74]}><sphereGeometry args={[0.05, 16, 12]} /><meshStandardMaterial color="#9a9fa3" roughness={0.5} /></mesh>
      <mesh position={[1.1, 0.66, (-1.74 + zE) / 2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.045, Math.abs(zE + 1.74), 20]} /><meshStandardMaterial color="#9a9fa3" roughness={0.5} /></mesh></group>}
    <mesh position={[1.1, 1.7, -1.72]}><cylinderGeometry args={[0.045, 0.045, 1.95, 20]} /><meshStandardMaterial color="#8e9599" metalness={0.6} roughness={0.4} /></mesh>
    <Box p={[0.1, 2.66, -1.75]} s={[3.0, 0.1, 0.14]} c="#8e9599" m={0.6} r={0.4} rad={0.02} />
    {rain > 0.01 && <mesh position={[1.1, 0.66, -1.74]}><cylinderGeometry args={[0.022, 0.03, 0.12, 12, 1, true]} /><meshPhysicalMaterial color="#d6ecff" transparent opacity={0.6 * rain} roughness={0.03} clearcoat={1} /></mesh>}
    {rain > 0.01 && Array.from({ length: 40 }, (_, i) => { const ph = ((t * 2.2 + rnd(i, 1)) % 1);
      return <mesh key={i} position={[1.1 + (rnd(i, 2) - 0.5) * 0.04, 0.6 - ph * 0.6, zW + (rnd(i, 3) - 0.5) * 0.04 - (ext > 0.5 ? ph * 0.25 : 0)]}><sphereGeometry args={[0.008, 6, 5]} /><meshBasicMaterial color="#cfe9ff" transparent opacity={0.8 * rain} /></mesh>; })}
    {/* el charco al pie de la pared */}
    {rain > 0.01 && <mesh position={[1.1, -0.045, ext > 0.5 ? zE - 0.35 : -1.85]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.6, 1]}><circleGeometry args={[0.3 * rain, 32]} /><meshPhysicalMaterial color="#8fa0aa" transparent opacity={0.7} roughness={0.02} clearcoat={1} /></mesh>}
  </group>
); };

// balde de pintura con su etiqueta "ANTIHUMEDAD"
const Bucket: React.FC<{ tex: THREE.Texture }> = ({ tex }) => (
  <group position={[PT.bucket[0], 0, PT.bucket[2]]}>
    <mesh position={[0, 0.2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.16, 0.14, 0.4, 40, 1, true]} /><meshStandardMaterial map={tex} roughness={0.5} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.405, 0]} castShadow><cylinderGeometry args={[0.165, 0.165, 0.015, 40]} /><meshStandardMaterial color="#e9edf1" roughness={0.4} /></mesh>
    <mesh position={[0, 0.0, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.14, 30]} /><meshStandardMaterial color="#d8dde2" /></mesh>
    <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.16, 0.004, 6, 30, Math.PI]} /><meshStandardMaterial color="#555" metalness={0.8} /></mesh>
  </group>
);

// herramientas de la mesa: cepillo de alambre, bolsa de cemento, bidón de hidrófugo (aparecen con la voz)
const Tools: React.FC<{ br: number; bg: number; bo: number; tx: { bag: THREE.Texture; hidro: THREE.Texture } }> = ({ br, bg, bo, tx }) => (
  <group>
    {br > 0.01 && <group position={PT.brush} scale={br} rotation={[0, 0.5, 0]}>
      <Box p={[0, 0.02, 0]} s={[0.3, 0.028, 0.06]} c="#9a6a3c" r={0.7} rad={0.008} />
      {Array.from({ length: 36 }, (_, i) => <mesh key={i} position={[-0.11 + (i % 12) * 0.018, 0.0, -0.018 + Math.floor(i / 12) * 0.018]}><cylinderGeometry args={[0.003, 0.003, 0.03, 4]} /><meshStandardMaterial color="#b8bcc0" metalness={0.9} roughness={0.3} /></mesh>)}
    </group>}
    {bg > 0.01 && <group position={PT.bag} scale={bg}>
      <mesh position={[0, 0.16, 0]} castShadow geometry={rbox(0.5, 0.32, 0.16, 0.06)}><meshStandardMaterial map={tx.bag} roughness={0.95} /></mesh>
    </group>}
    {bo > 0.01 && <group position={PT.bottle} scale={bo}>
      <mesh position={[0, 0.12, 0]} castShadow geometry={rbox(0.12, 0.24, 0.08, 0.02)}><meshStandardMaterial map={tx.hidro} roughness={0.4} /></mesh>
      <mesh position={[0.02, 0.26, 0]}><cylinderGeometry args={[0.018, 0.018, 0.04, 14]} /><meshStandardMaterial color="#1c7a5a" roughness={0.4} /></mesh>
    </group>}
  </group>
);

const PAPER = "#cfc9be";
// EL MANUAL (proporción real de la página 1700x2200); hijos = coordenadas de la página derecha
export const BW = 0.3, BD = BW * 2200 / 1700;
export const Book: React.FC<{ p: V3; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; children?: React.ReactNode }> = ({ p, open, cover, inside, right, spine, children }) => {
  const w = BW, d = BD, th = 0.03;
  const ang = Math.PI * ease(open);
  return (
    <group position={p}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#d8d0bf" roughness={0.95} /></mesh>
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
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
export const Marker: React.FC<{ t: number; at: number; out?: number; box: [number, number, number, number]; col?: string }> = ({ t, at, out = 1e9, box, col = "#ffd60a" }) => {
  const a = ease((t - at) / 0.4), o = 1 - win(t, out, out + 0.3);
  if (a <= 0.01 || o <= 0.01) return null;
  const pw = BW - 0.01, pd = BD - 0.012;
  const [x0, y0, x1, y1] = box, ww = (x1 - x0) * pw * a, hh = (y1 - y0) * pd;
  return <mesh position={[(x0 - 0.5) * pw + ww / 2, 0.0009, (y0 - 0.5) * pd + hh / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ww, hh]} /><meshBasicMaterial color={col} transparent opacity={0.55 * o} depthWrite={false} /></mesh>;
};
// marcadores del resto del video (los carga Rest.tsx)
export const BOOK_MK: { at: number; out: number; box: [number, number, number, number]; col?: string }[] = [];
export const pagePt = (u: number, v: number): V3 => [PT.book[0] + 0.004 + (u - 0.5) * (BW - 0.01), PT.book[1] + 0.037, PT.book[2] + (v - 0.5) * (BD - 0.012)];

// la tarjeta del QR parada al lado del manual (sin texto de URL: sólo el código)
const QRCard: React.FC<{ k: number; tex: THREE.Texture }> = ({ k, tex }) => k < 0.01 ? null : (
  <group position={[B[0] + 0.3, B[1] + 0.0, B[2] - 0.05]} rotation={[-0.25, -0.35, 0]} scale={k}>
    <mesh position={[0, 0.1, 0]} castShadow geometry={rbox(0.17, 0.2, 0.006, 0.006)}><meshStandardMaterial color="#f7f3ea" roughness={0.8} /></mesh>
    <mesh position={[0, 0.11, 0.0035]}><planeGeometry args={[0.14, 0.14]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
  </group>
);

// ===== RESTO: piezas de la obra =====
// la banda de la reparación en la cara de adentro: ladrillo pelado (top = hasta dónde se picó) o revoque nuevo gris (wet = mojado)
const Repair: React.FC<{ top: number; mode: "pic" | "nu"; wet: number; tex: THREE.Texture }> = ({ top, mode, wet, tex }) => {
  const h = top - 0.12;
  if (h <= 0.01) return null;
  const c = new THREE.Color("#b2aea4").lerp(new THREE.Color("#7f7b73"), wet);
  return (
    <group>
      <mesh position={[(X0 + XC) / 2, 0.12 + h / 2, ZI + 0.0016]}><planeGeometry args={[XC - X0, h]} />
        {mode === "pic" ? <meshStandardMaterial map={tex} roughness={0.95} /> : <meshStandardMaterial color={c} roughness={1} />}</mesh>
      {/* borde del revoque viejo arriba de la banda */}
      <Box p={[(X0 + XC) / 2, top + 0.006, ZI + 0.008]} s={[XC - X0, 0.012, 0.016]} c={mode === "pic" ? "#d8cfbb" : "#c4bfb3"} r={0.9} rad={0.002} cast={false} />
    </group>
  );
};
// líneas de medida pegadas a la cara de adentro (la mancha llega hasta acá / +30 cm)
const HLine: React.FC<{ y: number; k: number; col: string }> = ({ y, k, col }) => k < 0.01 ? null : (
  <group>{Array.from({ length: 24 }, (_, i) => { const x = X0 + 0.1 + i * 0.2; return x > XC - 0.05 || i / 24 > k ? null :
    <mesh key={i} position={[x + 0.06, y, ZI + 0.01]}><boxGeometry args={[0.12, 0.012, 0.004]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>; })}</group>
);
// vapor que SALE por la cara de la pared (la pared respira)
const Vapor: React.FC<{ t: number; on: number; x0: number; x1: number; y1?: number }> = ({ t, on, x0, x1, y1 = 1.0 }) => on < 0.01 ? null : (
  <group>{Array.from({ length: 70 }, (_, i) => { const ph = (t * 0.32 + rnd(i, 1)) % 1;
    return <mesh key={i} position={[x0 + rnd(i, 2) * (x1 - x0), 0.12 + rnd(i, 3) * (y1 - 0.12) + ph * 0.18, ZI + 0.01 + ph * 0.32]}><sphereGeometry args={[0.01 + ph * 0.022, 8, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={on * 0.5 * (1 - ph)} depthWrite={false} toneMapped={false} /></mesh>; })}</group>
);
// la BARRERA: fila de agujeros a 15 cm, cada 11 cm, y la crema que corta el camino del agua
const Barrier: React.FC<{ hole: number; cream: number }> = ({ hole, cream }) => hole < 0.01 ? null : (
  <group>
    {Array.from({ length: 44 }, (_, i) => { const x = X0 + 0.12 + i * 0.11; if (x > XC - 0.04) return null;
      const hs = cl(hole * 1.5 - (i / 44) * 0.5), cs = cl(cream * 1.5 - (i / 44) * 0.5);
      return <group key={i} position={[x, 0.15, ZI + 0.003]}>
        {hs > 0.01 && <mesh scale={hs}><circleGeometry args={[0.013, 18]} /><meshBasicMaterial color="#24170e" /></mesh>}
        {cs > 0.01 && <mesh position={[0, 0, 0.002]} scale={cs}><circleGeometry args={[0.011, 18]} /><meshBasicMaterial color="#fbfaf4" toneMapped={false} /></mesh>}
      </group>; })}
    {/* en el corte: la franja de crema atraviesa el muro */}
    {cream > 0.01 && <mesh position={[XC + 0.005, 0.15, (ZI + ZO) / 2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[(ZI - ZO) * cream, 0.03]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>}
  </group>
);
// la regla de 1 metro parada contra el corte
const Ruler: React.FC<{ k: number }> = ({ k }) => k < 0.01 ? null : (
  <group position={[XC + 0.03, 0, ZI + 0.04]}>
    <mesh position={[0, 0.5 * k, 0]}><boxGeometry args={[0.012, k, 0.035]} /><meshStandardMaterial color="#ffd60a" emissive="#ffb000" emissiveIntensity={0.35} roughness={0.5} /></mesh>
    {Array.from({ length: 11 }, (_, i) => i / 10 > k + 0.001 ? null : <mesh key={i} position={[0.007, i / 10, 0]}><boxGeometry args={[0.004, 0.006, i % 5 === 0 ? 0.035 : 0.02]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
  </group>
);
// el nivel del piso de adentro marcado en el frente de la jardinera + la regadera
const FloorMark: React.FC<{ k: number }> = ({ k }) => k < 0.01 ? null : (
  <group>{Array.from({ length: 12 }, (_, i) => i / 12 > k ? null : <mesh key={i} position={[-1.38 + i * 0.19, 0.0, -2.36]}><boxGeometry args={[0.12, 0.012, 0.004]} /><meshBasicMaterial color="#8fd6ff" toneMapped={false} /></mesh>)}</group>
);
const Watering: React.FC<{ t: number; on: number }> = ({ t, on }) => on < 0.01 ? null : (
  <group>{Array.from({ length: 70 }, (_, i) => { const ph = (t * 1.6 + rnd(i, 1)) % 1;
    return <mesh key={i} position={[-1.2 + rnd(i, 2) * 1.8, 1.05 - ph * 0.5, -1.8 - rnd(i, 3) * 0.35]}><sphereGeometry args={[0.007, 6, 5]} /><meshBasicMaterial color="#bfe6ff" transparent opacity={0.85 * on} /></mesh>; })}</group>
);
// más herramientas de la mesa (aparecen con la voz)
const Tools2: React.FC<{ hm: number; ch: number; bu: number; tr: number; fl: number; sa: number }> = ({ hm, ch, bu, tr, fl, sa }) => (
  <group>
    {hm > 0.01 && <group position={[-1.82, 0.8, 0.44]} scale={hm} rotation={[0, -0.4, 0]}>
      <Box p={[0, 0.015, 0]} s={[0.3, 0.025, 0.03]} c="#a0703e" r={0.6} rad={0.008} />
      <Box p={[0.15, 0.03, 0]} s={[0.04, 0.05, 0.11]} c="#3d4247" m={0.8} r={0.35} rad={0.006} /></group>}
    {ch > 0.01 && <group position={[-1.84, 0.8, 0.12]} scale={ch} rotation={[0, 0.3, 0]}>
      <Box p={[0, 0.01, 0]} s={[0.24, 0.018, 0.018]} c="#6e7378" m={0.85} r={0.3} rad={0.004} /></group>}
    {tr > 0.01 && <group position={[-2.78, 0.8, 0.46]} scale={tr} rotation={[0, 0.5, 0]}>
      <mesh position={[0.06, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.08, 3]} /><meshStandardMaterial color="#9aa0a6" metalness={0.85} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <Box p={[-0.07, 0.03, 0]} s={[0.1, 0.022, 0.022]} c="#8a5a30" r={0.6} rad={0.008} /></group>}
    {fl > 0.01 && <group position={[-2.82, 0.8, 0.02]} scale={fl} rotation={[0, -0.3, 0]}>
      <Box p={[0, 0.012, 0]} s={[0.24, 0.022, 0.12]} c="#c49a62" r={0.8} rad={0.006} />
      <Box p={[0, 0.05, 0]} s={[0.12, 0.03, 0.025]} c="#9a6a3c" r={0.7} rad={0.008} /></group>}
    {bu > 0.01 && <group position={[-1.15, 0, 0.5]} scale={bu}>
      <mesh position={[0, 0.15, 0]} castShadow><cylinderGeometry args={[0.17, 0.14, 0.3, 32, 1, true]} /><meshStandardMaterial color="#1d1f22" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.14, 30]} /><meshStandardMaterial color="#1d1f22" /></mesh></group>}
    {sa > 0.01 && <mesh position={[-1.25, 0.1 * sa, 0.0]} scale={[sa, sa, sa]} castShadow><coneGeometry args={[0.24, 0.2, 32]} /><meshStandardMaterial color="#d9c59a" roughness={1} /></mesh>}
  </group>
);

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures();
  const wt = useWallTex();
  const pg = useImgTex(["p001", "p010", "p011", "qr"]);
  const Bt = (a: number, b: number) => t >= a && t < b;
  // la pared: recién pintada y lisa al principio; se infla al bajar a la ampolla; en el corte el agua sube y la empuja
  let infl = Bt(0, 9) ? 0.25 : Bt(9, 17) ? 0.25 + 0.75 * win(t, 9.5, 14) : 1;
  if (Bt(41.8, 48.6)) infl = t < 44.6 ? 0.15 + 0.85 * win(t, 42.3, 43.9) : 0.15 + 0.85 * win(t, 45.0, 46.4); // "dos veces"
  const big = Bt(0, 9) ? 0.4 : 0.4 + 0.6 * win(t, 9.5, 15.5);
  const stain = Bt(41.8, 48.6) ? win(t, 42, 43.5) : t > 9 ? 0.4 + 0.5 * win(t, 9.5, 14) : 0.15;
  let hW = Bt(41.8, 53.6) ? 0.15 + 0.75 * win(t, 42.0, 44.2) : 0.9; // altura del agua en el corte
  let capOn = Bt(41.6, 50.4) ? 1 : 0;
  let film = Bt(41.8, 50.4) ? win(t, 43.2, 43.8) : 0;
  const rain = Bt(50.0, 54.0) ? win(t, 50.6, 51.4) : 0; // + rainR (resto)
  const glow0 = Bt(51.4, 54.0) ? 0.5 + 0.5 * Math.sin(t * 5) : 0;
  const br = win(t, 59.0, 59.5), bg = win(t, 60.5, 61.0), bo = win(t, 62.1, 62.6);
  // ---- RESTO: el corte (agua que sube / la tapa / respira), la obra en la pared, el patio, la mesa ----
  const SEC = Bt(173.3, 184.3) || Bt(202.7, 232.7) || Bt(270.6, 281.5) || Bt(763.2, 776.1) || Bt(807.5, 826.5);
  if (SEC) {
    capOn = 1;
    hW = Bt(202.7, 215.6) ? 0.05 + 0.95 * win(t, 203.4, 214.8) : Bt(202.7, 232.7) ? 1.0 : Bt(807.5, 826.5) ? 0.9 - 0.75 * win(t, 819.3, 822.3) : 0.9;
    film = Bt(175.7, 184.3) ? win(t, 176.0, 176.8) : Bt(273.8, 281.5) ? win(t, 274.0, 274.8) : Bt(763.2, 776.1) ? 1 - win(t, 768.8, 769.6) : 0;
    infl = Bt(175.7, 184.3) ? 0.15 + 0.85 * win(t, 179.2, 181.5) : Bt(273.8, 281.5) ? 0.15 + 0.85 * win(t, 277.2, 278.6) : Bt(202.7, 232.7) ? 1 : 0.15;
  }
  const vent = Bt(173.3, 176.2) ? 1 - win(t, 175.8, 176.4) : Bt(270.6, 274.2) ? 1 - win(t, 273.9, 274.4) : Bt(769.3, 776.1) ? win(t, 769.5, 770.6) : Bt(667.9, 678.7) ? 1 : 0;
  const PIC = t >= 589.2 && t < 650.8, NU = t >= 650.8 && t < 742.5, FIX = t >= 589.2;
  const top = PIC ? 0.75 + 0.3 * win(t, 590.3, 593.0) : NU || t >= 742.5 ? 1.05 : 0;
  const wet = 1 - win(t, 688, 742);
  if (FIX && !SEC) { infl = 0; }
  const stainR = FIX ? 0 : stain;
  const ln30 = Bt(586.1, 596.5) ? win(t, 588.0, 589.5) : 0, lnS = Bt(586.1, 596.5) ? win(t, 586.6, 587.6) : 0;
  const above = Bt(796.4, 811.7) ? win(t, 799.0, 802.0) : 0;
  const hole = Bt(807.5, 832.3) ? win(t, 809.9, 812.6) : 0, cream = Bt(807.5, 832.3) ? win(t, 813.2, 817.0) : 0;
  const ruler = Bt(215.0, 232.7) ? win(t, 216.9, 218.4) : 0;
  const water = Bt(404.6, 415.4) ? win(t, 404.8, 405.4) * (1 - win(t, 414.6, 415.2)) : 0;
  const rainR = Bt(416.0, 426.0) ? win(t, 419.9, 420.7) : Bt(459.7, 466.4) ? win(t, 462.2, 462.9) : 0;
  const lowS = win(t, 456.4, 459.4), ext = win(t, 461.9, 463.3);
  const fmark = Bt(386.9, 399.3) ? win(t, 395.6, 396.8) : 0;
  const glowR = water > 0.01 ? water * (0.55 + 0.45 * Math.sin(t * 4)) : 0;
  const hm = win(t, 490.8, 491.3), ch = win(t, 491.8, 492.3), sa = win(t, 498.8, 499.3), bu = win(t, 504.3, 504.8), trw = win(t, 505.4, 505.9), fl = win(t, 507.0, 507.5);
  const open = win(t, C1 + 5.3, C1 + 6.3);
  const qr = win(t, C1 + 15.6, C1 + 16.2);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.22} threshold={0.95} exposure={0.85} env={0.32} />
      <color attach="background" args={["#a9b2b8"]} />
      <mesh><sphereGeometry args={[60, 32, 16]} /><meshBasicMaterial map={wt.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xe6eef5, 0x3a2e24, 0.55]} />
      <directionalLight position={[-3, 7, 6]} intensity={1.35} color="#fff1dc" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003} />
      {/* la luz que entra por la puerta del fondo del pasillo + lámpara del techo */}
      <spotLight position={[1.4, 1.6, 1.4]} angle={0.9} penumbra={0.9} intensity={4} distance={6} color="#fff4e0" target-position={[0, 0.4, -1.35]} />
      <pointLight position={[-1.0, 2.4, -0.2]} intensity={1.6} distance={5} color="#ffe2b8" />
      {/* luz fría sobre el corte del muro */}
      <spotLight position={[2.6, 1.6, -0.4]} angle={0.6} penumbra={1} intensity={3} distance={4} color="#f2f6ff" target-position={PT.cut} />
      {/* afuera: cielo nublado de lluvia */}
      <directionalLight position={[2, 5, -6]} intensity={0.7} color="#d8e2ea" />

      {/* ===== BLOQUE DE TIERRA CORTADO (debajo de todo) ===== */}
      <mesh position={[-0.85, -0.85, -1.0]} receiveShadow geometry={rbox(4.9, 1.5, 5.4, 0.01)}><meshStandardMaterial map={wt.soil} roughness={1} /></mesh>
      {/* contrapiso + baldosas del pasillo */}
      <Box p={[-0.8, -0.05, 0.12]} s={[4.8, 0.1, 2.95]} c="#8d8a84" r={0.9} map={tx.concrete} rad={0.01} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.8, 0.001, 0.12]} receiveShadow><planeGeometry args={[4.8, 2.95]} /><meshStandardMaterial map={wt.terra} roughness={0.6} /></mesh>

      {/* ===== LA PARED (cara de adentro crema, cara de afuera con moho, punta cortada) ===== */}
      <mesh position={[(X0 + XC) / 2, WH / 2, (ZI + ZO) / 2]} castShadow receiveShadow><boxGeometry args={[XC - X0, WH, ZI - ZO]} /><meshStandardMaterial color="#e9dfc8" roughness={0.9} /></mesh>
      <mesh position={[(X0 + XC) / 2, WH / 2, ZI + 0.0005]} receiveShadow><planeGeometry args={[XC - X0, WH]} /><meshStandardMaterial map={wt.cream} roughness={0.75} /></mesh>
      <mesh position={[(X0 + XC) / 2, WH / 2, ZO - 0.0005]} rotation={[0, Math.PI, 0]} receiveShadow><planeGeometry args={[XC - X0, WH]} /><meshStandardMaterial map={wt.outer} roughness={0.95} /></mesh>
      {/* cimiento bajo el piso */}
      <mesh position={[(X0 + XC) / 2, -FD / 2, (ZI + ZO) / 2]}><boxGeometry args={[XC - X0, FD, ZI - ZO + 0.02]} /><meshStandardMaterial color="#7d776d" roughness={1} /></mesh>
      {/* EL CORTE: ladrillo, revoques y cimiento */}
      <mesh position={[XC + 0.001, (WH - FD) / 2, (ZI + ZO) / 2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[ZI - ZO, WH + FD]} /><meshStandardMaterial map={wt.section} roughness={0.95} /></mesh>
      <Capillary t={t} h={hW} on={capOn} tex={wt.heat} film={film} />
      {/* la mancha de humedad y el salitre en la cara de adentro */}
      <mesh position={[(X0 + XC) / 2, 0.55, ZI + 0.0012]}><planeGeometry args={[XC - X0, 1.1]} /><meshStandardMaterial map={wt.stain} transparent opacity={stainR} depthWrite={false} roughness={0.9} /></mesh>
      <Blisters k={infl} big={FIX ? 0 : big} pop={0} />
      {(PIC || NU) && <Repair top={top} mode={PIC ? "pic" : "nu"} wet={wet} tex={wt.brick} />}
      {/* "la humedad pasa por encima": la línea de manchas justo arriba del arreglo */}
      {above > 0.01 && <mesh position={[(X0 + XC) / 2, 1.17, ZI + 0.0013]}><planeGeometry args={[XC - X0, 0.26]} /><meshStandardMaterial map={wt.stain} transparent opacity={above * 0.85} depthWrite={false} roughness={0.9} /></mesh>}
      <HLine y={0.75} k={lnS} col="#ffb257" />
      <HLine y={1.05} k={ln30} col="#7dffb8" />
      <Vapor t={t} on={vent} x0={SEC ? XC - 0.9 : -2.4} x1={SEC ? XC : 1.2} />
      <Barrier hole={hole} cream={cream} />
      <Ruler k={ruler} />
      {/* zócalo de madera oscura + cuadrito del santo */}
      <Box p={[(X0 + XC) / 2, 0.06, ZI + 0.012]} s={[XC - X0, 0.12, 0.024]} c="#4a2e1c" r={0.55} rad={0.005} />
      <Box p={[-1.3, 1.55, ZI + 0.015]} s={[0.26, 0.34, 0.025]} c="#6b4a2a" r={0.5} rad={0.006} />
      <Box p={[-1.3, 1.55, ZI + 0.03]} s={[0.2, 0.27, 0.005]} c="#c9b07a" r={0.6} e="#3a2a10" ei={0.2} rad={0.002} />
      {/* pared lateral izquierda del pasillo (con puerta) */}
      <Box p={[X0 - 0.05, WH / 2, 0.12]} s={[0.1, WH, 2.95]} c="#e9dfc8" r={0.85} map={wt.cream} rad={0.01} />
      <Bucket tex={wt.label} />

      {/* ===== EL PATIO, del otro lado de la pared ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.8, -0.05, -2.55]} receiveShadow><planeGeometry args={[4.8, 1.8]} /><meshStandardMaterial map={wt.pave} roughness={0.7} /></mesh>
      <Planter glow={Math.max(glow0, glowR)} low={lowS} />
      <Downpipe t={t} rain={Math.max(rain, rainR)} ext={ext} />
      <FloorMark k={fmark} />
      <Watering t={t} on={water} />

      {/* ===== LA MESA DE TRABAJO con EL MANUAL ===== */}
      <Box p={[-2.25, 0.77, 0.25]} s={[1.2, 0.04, 0.62]} c="#b48a5a" r={0.75} map={tx.planks} rad={0.01} />
      {[-0.5, 0.5].map((dx) => <group key={dx} position={[-2.25 + dx, 0, 0.25]}>
        {[-0.22, 0.22].map((dz) => <mesh key={dz} position={[0, 0.375, dz]} rotation={[dz > 0 ? 0.12 : -0.12, 0, 0]}><boxGeometry args={[0.05, 0.76, 0.05]} /><meshStandardMaterial color="#8a6a44" roughness={0.8} /></mesh>)}
      </group>)}
      <Tools br={br} bg={bg} bo={bo} tx={wt} />
      <Tools2 hm={hm} ch={ch} bu={bu} tr={trw} fl={fl} sa={sa} />
      <spotLight position={[-2.2, 2.2, 0.9]} angle={0.5} penumbra={0.8} intensity={6} distance={4} color="#fff2dc" target-position={PT.book} />
      <Book p={PT.book} open={open} cover={pg.p001} inside={pg.p010_r} right={pg.p011} spine="#c0392b">
        {/* el título del arreglo */}
        <Marker t={t} at={89.2} out={C1 + 13.6} box={[0.07, 0.343, 0.865, 0.368]} />
        {/* hasta dónde picar · la mezcla · secado antes de pintar */}
        <Marker t={t} at={92.2} out={C1 + 13.6} box={[0.075, 0.445, 0.6, 0.461]} />
        <Marker t={t} at={93.16} out={C1 + 13.6} box={[0.075, 0.466, 0.83, 0.482]} />
        <Marker t={t} at={94.74} out={C1 + 13.6} box={[0.075, 0.507, 0.43, 0.523]} />
        {/* SI NO SALE */}
        <Marker t={t} at={97.6} out={C1 + 15.8} box={[0.07, 0.84, 0.49, 0.91]} col="#ff9f43" />
        {BOOK_MK.map((m, i) => <Marker key={"r" + i} t={t} at={m.at} out={m.out} box={m.box} col={m.col} />)}
      </Book>
      <QRCard k={qr} tex={pg.qr} />
    </ThreeCanvas>
  );
};
