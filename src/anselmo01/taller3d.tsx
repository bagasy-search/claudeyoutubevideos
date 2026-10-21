// anselmo01 · EL MUNDO: el tallercito de adobe de Don Anselmo en Michoacán, en CORTE (sin la pared de adelante).
// Pared del fondo de adobe con serruchos, formones y cepillos colgados; banco de carpintero largo; puerta grande abierta
// a la derecha (patio con techo de teja y una pared de cal rosa). EN LA PARED DEL FONDO (derecha): LA MESA PLEGABLE de tarima,
// que se va ARMANDO a lo largo del video (listón con bisagra de dientes + palo de escoba, cubierta de 7 tablas, ménsula que
// gira, tarabilla) y que se abre y se cierra. En el piso: LA TARIMA que se desarma en tablas que vuelan a la pared.
// UNA escena y UNA cámara para todo el video; los eventos se clavan a la voz desde Min1/Rest. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export type V = [number, number, number];

// ---------------- medidas reales de la mesa (metros) ----------------
export const MESA = { x: 1.55, wallZ: -2.84, hingeY: 0.75, w: 0.8, d: 0.6, th: 0.017, latchY: 0.75 + 0.6 + 0.04 };
const WZ = MESA.wallZ;
// ---------------- puntos del mundo ----------------
export const PT = {
  mesa: [MESA.x, MESA.hingeY + 0.02, WZ + 0.3] as V,          // centro de la cubierta abierta
  mesaCerrada: [MESA.x, MESA.hingeY + 0.32, WZ + 0.06] as V,   // centro de la cubierta levantada contra la pared
  bisagraL: [MESA.x - 0.3, MESA.hingeY, WZ + 0.05] as V,
  bisagraR: [MESA.x + 0.3, MESA.hingeY, WZ + 0.05] as V,
  tarabilla: [MESA.x, MESA.latchY, WZ + 0.04] as V,
  mensula: [MESA.x, MESA.hingeY - 0.25, WZ + 0.2] as V,
  tarima: [-0.6, 0.12, 0.7] as V,
  banco: [-1.6, 0.86, -1.6] as V,
  sello: [-0.6 + 0.62, 0.07, 0.7] as V,                         // costado del patín con el sello HT
  herram: [-1.4, 1.75, -2.9] as V,
  puerta: [3.9, 1.3, -0.6] as V,
  patio: [7.5, 1.0, 0.5] as V,
  pila: [5.0, 0.6, -0.8] as V,
};

// ---------------- CÁMARA (keyframes globales; Min1 y Rest suman los suyos) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([2, 1.6, 3]), l: v3([0, 0.8, 0]), fov: 40 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  p.x += Math.sin(t * 0.53) * 0.01; p.y += Math.sin(t * 0.71 + 1) * 0.007; // cámara en mano, nunca quieta
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.02; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas procedurales ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: (i: number) => string, r = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = col(i); g.fillRect(rnd(i, 11) * w, rnd(i, 12) * h, r * (0.5 + rnd(i, 13)), r * (0.5 + rnd(i, 14))); } };
// veta de madera: base + líneas onduladas + nudos. seed cambia cada tabla
const veta = (g: CanvasRenderingContext2D, w: number, h: number, base: string, line: (k: number) => string, seed: number, knots = 2) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  const gb = g.createLinearGradient(0, 0, 0, h); gb.addColorStop(0, "rgba(255,240,220,.10)"); gb.addColorStop(0.5, "rgba(0,0,0,0)"); gb.addColorStop(1, "rgba(60,35,15,.12)"); g.fillStyle = gb; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 22; k++) {
    g.strokeStyle = line(k + seed * 50); g.lineWidth = 1.5 + rnd(k, seed + 4) * 3.5; g.beginPath();
    const y = rnd(k, seed + 5) * h; g.moveTo(0, y);
    g.bezierCurveTo(w * 0.33, y + (rnd(k, seed + 6) - 0.5) * 18, w * 0.66, y + (rnd(k, seed + 7) - 0.5) * 18, w, y + (rnd(k, seed + 8) - 0.5) * 10); g.stroke();
  }
  for (let n = 0; n < knots; n++) {
    const x = rnd(n, seed + 9) * w, y = rnd(n, seed + 10) * h;
    for (let r = 14; r > 2; r -= 3) { g.strokeStyle = `rgba(50,30,15,${0.25 + (14 - r) * 0.03})`; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y, r * 2.2, r * 0.8, 0, 0, 6.3); g.stroke(); }
    g.fillStyle = "rgba(45,25,12,.7)"; g.beginPath(); g.ellipse(x, y, 4, 2, 0, 0, 6.3); g.fill();
  }
};
const useTaller = () => useMemo(() => ({
  // adobe ENJARRADO (barro con paja) gastado: manchas suaves de baja frecuencia, paja, grietas finas y, donde se cayó el enjarre, los bloques
  adobe: mk(1024, 1024, (g) => {
    g.fillStyle = "#b8916a"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 260; i++) { const x = rnd(i, 1) * 1024, y = rnd(i, 2) * 1024, r = 40 + rnd(i, 3) * 180, d = rnd(i, 4) > 0.5;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, d ? `rgba(90,60,35,${0.05 + rnd(i, 5) * 0.07})` : `rgba(235,210,175,${0.05 + rnd(i, 5) * 0.08})`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 16000; i++) { const v = rnd(i, 6); g.fillStyle = v > 0.5 ? `rgba(255,235,200,${0.08 + rnd(i, 7) * 0.12})` : `rgba(60,40,22,${0.08 + rnd(i, 7) * 0.14})`; g.beginPath(); g.arc(rnd(i, 8) * 1024, rnd(i, 9) * 1024, 0.5 + rnd(i, 10) * 1.1, 0, 6.3); g.fill(); }
    g.lineWidth = 1.3;
    for (let i = 0; i < 900; i++) { const x = rnd(i, 21) * 1024, y = rnd(i, 22) * 1024, a = rnd(i, 23) * 6.3, l = 6 + rnd(i, 24) * 14; g.strokeStyle = `rgba(${215 + rnd(i, 25) * 30},${185 + rnd(i, 26) * 30},${110},${0.25 + rnd(i, 27) * 0.3})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    for (let k = 0; k < 9; k++) { let x = rnd(k, 41) * 1024, y = rnd(k, 42) * 1024; g.strokeStyle = "rgba(55,35,20,.45)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y);
      for (let j = 0; j < 14; j++) { x += (rnd(k * 20 + j, 43) - 0.5) * 40; y += 8 + rnd(k * 20 + j, 44) * 22; g.lineTo(x, y); } g.stroke(); }
  }, [2.4, 1]),
  tierra: mk(1024, 1024, (g) => {
    g.fillStyle = "#9c7b58"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 200; i++) { const x = rnd(i, 1) * 1024, y = rnd(i, 2) * 1024, r = 60 + rnd(i, 3) * 200; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rnd(i, 4) > 0.5 ? "rgba(70,48,28,.10)" : "rgba(220,190,150,.10)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 20000; i++) { g.fillStyle = rnd(i, 5) > 0.5 ? `rgba(60,42,25,${0.1 + rnd(i, 6) * 0.15})` : `rgba(230,205,165,${0.08 + rnd(i, 6) * 0.12})`; g.beginPath(); g.arc(rnd(i, 7) * 1024, rnd(i, 8) * 1024, 0.6 + rnd(i, 9) * 0.6, 0, 6.3); g.fill(); }
    for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(${235},${205 + rnd(i, 5) * 25},${150 + rnd(i, 6) * 40},${0.35 + rnd(i, 7) * 0.35})`; g.lineWidth = 1.6; g.beginPath(); const x = rnd(i, 8) * 1024, y = rnd(i, 9) * 1024; g.arc(x, y, 3 + rnd(i, 10) * 5, rnd(i, 11) * 6, rnd(i, 11) * 6 + 3.5); g.stroke(); }
  }, [4, 3]),
  // patio de tierra apisonada: manchas suaves + piedritas chicas sueltas (nada de "lunares")
  patio: mk(1024, 1024, (g) => {
    g.fillStyle = "#a38463"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 220; i++) { const x = rnd(i, 1) * 1024, y = rnd(i, 2) * 1024, r = 50 + rnd(i, 3) * 220; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rnd(i, 4) > 0.5 ? "rgba(80,58,36,.10)" : "rgba(225,200,160,.11)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 26000; i++) { g.fillStyle = rnd(i, 5) > 0.5 ? `rgba(70,50,30,${0.08 + rnd(i, 6) * 0.14})` : `rgba(235,212,175,${0.07 + rnd(i, 6) * 0.12})`; g.beginPath(); g.arc(rnd(i, 7) * 1024, rnd(i, 8) * 1024, 0.6 + rnd(i, 9) * 0.7, 0, 6.3); g.fill(); }
    for (let i = 0; i < 700; i++) { const x = rnd(i, 11) * 1024, y = rnd(i, 12) * 1024, r = 1.5 + rnd(i, 13) ** 3 * 7, b = 140 + rnd(i, 14) * 70;
      g.fillStyle = "rgba(40,28,16,.35)"; g.beginPath(); g.ellipse(x + 1, y + 1.2, r, r * 0.75, rnd(i, 15) * 3, 0, 6.3); g.fill();
      g.fillStyle = `rgb(${b},${b * 0.9},${b * 0.78})`; g.beginPath(); g.ellipse(x, y, r, r * 0.75, rnd(i, 15) * 3, 0, 6.3); g.fill(); }
  }, [30, 30]),
  banco: mk(256, 512, (g) => veta(g, 256, 512, "#8a6444", (k) => `rgba(${30 + rnd(k, 1) * 25},${18 + rnd(k, 2) * 12},8,${0.25 + rnd(k, 3) * 0.3})`, 3, 1)),
  cal: mk(256, 256, (g) => { g.fillStyle = "#e9b8b0"; g.fillRect(0, 0, 256, 256); noise(g, 256, 256, 1500, (i) => `rgba(${200 + rnd(i, 1) * 40},${150 + rnd(i, 2) * 40},${140 + rnd(i, 3) * 30},.35)`, 3); }, [4, 2]),
  teja: mk(256, 256, (g) => {
    g.fillStyle = "#7a3a20"; g.fillRect(0, 0, 256, 256);
    for (let c = 0; c < 8; c++) { const gr = g.createLinearGradient(c * 32, 0, c * 32 + 32, 0); gr.addColorStop(0, "#6a2c16"); gr.addColorStop(0.5, `rgb(${170 + rnd(c, 1) * 30},${80 + rnd(c, 2) * 20},${45})`); gr.addColorStop(1, "#5a2410"); g.fillStyle = gr; g.fillRect(c * 32, 0, 32, 256); }
    for (let r = 0; r < 4; r++) { g.fillStyle = "rgba(30,10,5,.45)"; g.fillRect(0, r * 64 + 60, 256, 4); }
  }, [6, 2]),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  // tablas de tarima: 7 vetas distintas, grises/gastadas → con aceite color miel (se mezcla por material)
  tablas: Array.from({ length: 9 }, (_, s) => mk(512, 128, (g) => {
    veta(g, 512, 128, ["#c2ab8e", "#b8a084", "#cbb699", "#b09a80", "#c6ae90", "#bba487", "#c0a98b", "#ad9478", "#bfa88c"][s], (k) => `rgba(${90 + rnd(k, 1) * 40},${70 + rnd(k, 2) * 25},${45},${0.07 + rnd(k, 3) * 0.12})`, s + 11, 1 + (s % 3));
    if (s === 2) for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(40,30,25,${0.12 + rnd(i, 3) * 0.1})`; g.beginPath(); g.ellipse(120 + rnd(i, 4) * 280, 30 + rnd(i, 5) * 70, 40 + rnd(i, 6) * 60, 14 + rnd(i, 7) * 20, 0, 0, 6.3); g.fill(); } // mancha
  })),
  // sello IPPC del patín: espiga + MX + HT
  sello: mk(512, 256, (g) => {
    g.fillStyle = "#b39a7c"; g.fillRect(0, 0, 512, 256);
    noise(g, 512, 256, 1500, (i) => `rgba(90,70,45,${0.12 + rnd(i, 1) * 0.12})`, 2);
    g.strokeStyle = "#2a1a10"; g.lineWidth = 7; g.strokeRect(30, 26, 452, 204); g.beginPath(); g.moveTo(170, 26); g.lineTo(170, 230); g.stroke();
    g.fillStyle = "#2a1a10"; g.strokeStyle = "#2a1a10"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(100, 210); g.lineTo(100, 60); g.stroke();
    for (let k = 0; k < 5; k++) for (const sg of [-1, 1]) { g.beginPath(); g.ellipse(100 + sg * 20, 70 + k * 28, 18, 8, sg * -0.6, 0, 6.3); g.fill(); }
    g.font = "900 76px Arial"; g.textAlign = "left"; g.fillText("MX-049", 200, 110); g.font = "900 96px Arial"; g.fillText("HT", 200, 205);
    g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(0,0,0,${rnd(i, 7) * 0.5})`; g.fillRect(rnd(i, 8) * 512, rnd(i, 9) * 256, 6, 3); } // quemado imperfecto
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number; o?: number; bump?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0, o = 1, bump = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} bumpMap={bump ? map : undefined} bumpScale={bump} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o < 1} opacity={o} /></mesh>
);
// color de una tabla de tarima según el aceite: gris lavado → miel
const woodCol = (oil: number) => new THREE.Color("#d6cdc2").lerp(new THREE.Color("#d29a5c"), oil).getStyle();

// serrucho colgado (hoja con dientes + mango)
const Serrucho: React.FC<{ p: V; s?: number; rz?: number }> = ({ p, s = 1, rz = 0 }) => {
  const geo = useMemo(() => {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.55, 0.03);
    for (let k = 0; k < 40; k++) { const x = 0.55 - (k + 0.5) * (0.55 / 40); sh.lineTo(x + 0.006, -0.11 + k * 0.0012 - 0.008); sh.lineTo(x, -0.11 + k * 0.0012); }
    sh.lineTo(0, -0.16); sh.closePath(); return new THREE.ExtrudeGeometry(sh, { depth: 0.002, bevelEnabled: false });
  }, []);
  return (
    <group position={p} rotation={[0, 0, -Math.PI / 2 + rz]} scale={s}>
      <mesh geometry={geo} castShadow><meshStandardMaterial color="#9a9a96" metalness={0.75} roughness={0.38} /></mesh>
      <Box p={[-0.06, -0.08, 0.01]} s={[0.13, 0.17, 0.03]} c="#6b3e22" r={0.6} rad={0.02} />
    </group>
  );
};
const Formon: React.FC<{ p: V }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.014, 0.017, 0.12, 10]} /><meshStandardMaterial color="#7a4a2a" roughness={0.6} /></mesh>
    <Box p={[0, -0.04, 0]} s={[0.022, 0.13, 0.005]} c="#8e8f8c" m={0.8} r={0.35} rad={0.002} />
  </group>
);
const Cepillo: React.FC<{ p: V; rot?: V }> = ({ p, rot }) => (
  <group position={p} rotation={rot}>
    <Box p={[0, 0, 0]} s={[0.26, 0.06, 0.07]} c="#7a5030" r={0.55} rad={0.012} />
    <mesh position={[0.06, 0.06, 0]} rotation={[0, 0, 0.6]} castShadow><cylinderGeometry args={[0.02, 0.025, 0.08, 10]} /><meshStandardMaterial color="#5a3820" roughness={0.6} /></mesh>
    <Box p={[-0.04, 0.045, 0]} s={[0.04, 0.05, 0.05]} c="#4a2e18" r={0.6} rad={0.01} />
    <Box p={[0.0, 0.035, 0]} s={[0.012, 0.06, 0.05]} c="#999" m={0.8} r={0.3} rad={0.002} rot={[0, 0, -0.7]} />
  </group>
);

// LA TARIMA (1,20 × 1,00): 7 tablas arriba + 3 patines; explode 0..1 la desarma (las tablas se levantan y vuelan hacia `dest`)
const Tarima: React.FC<{ p: V; tx: ReturnType<typeof useTaller>; explode: number; nails: number; t: number; dest: V; oil: number; selloGlow: number }> = ({ p, tx, explode, nails, t, dest, oil, selloGlow }) => {
  const L = 1.2, WD = 1.0;
  return (
    <group position={p}>
      {/* patines (largueros gruesos) — se quedan */}
      {[-0.44, 0, 0.44].map((z, i) => <Box key={"pt" + i} p={[0, -0.045, z]} s={[L, 0.09, 0.07]} c="#a78f74" map={tx.tablas[7]} r={0.95} rad={0.008} />)}
      {/* sello HT quemado en el costado del patín del frente */}
      <mesh position={[0.32, -0.045, 0.476]}><planeGeometry args={[0.18, 0.08]} /><meshStandardMaterial map={tx.sello} roughness={0.95} emissive="#ffb257" emissiveIntensity={0.35 * selloGlow} /></mesh>
      {/* 7 tablas de arriba (a lo ancho) */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = -L / 2 + 0.085 + i * (L - 0.17) / 6;
        const a = cl(explode * 1.6 - i * 0.09), k = ease(a);
        // vuelo: se levanta, gira y viaja a la pila junto a la pared
        const tgt = [dest[0] - p[0] + (i - 3) * 0.003, dest[1] - p[1] + i * 0.019, dest[2] - p[2]];
        const lift = Math.sin(Math.PI * k) * (0.6 + 0.08 * i);
        const pos: V = [lerp(x, tgt[0], k), lerp(0.009, tgt[1], k) + lift, lerp(0, tgt[2], k)];
        const fade = 1 - sm((k - 0.82) / 0.18);
        if (fade <= 0.01) return null;
        return <mesh key={"tb" + i} position={pos} rotation={[lerp(0, Math.PI / 2, k), lerp(Math.PI / 2, 0, k), Math.sin(Math.PI * k) * 0.5 * (i % 2 ? 1 : -1)]} castShadow receiveShadow geometry={rbox(WD, 0.019, 0.095, 0.004)}>
          <meshStandardMaterial map={tx.tablas[i]} color={woodCol(oil)} roughness={0.85 - 0.35 * oil} transparent={fade < 1} opacity={fade} />
        </mesh>;
      })}
      {/* clavos de espiral: cuando se cortan, caen al piso con un brillo */}
      {nails > 0.01 && Array.from({ length: 21 }, (_, i) => {
        const x = -L / 2 + 0.085 + Math.floor(i / 3) * (L - 0.17) / 6, z = [-0.44, 0, 0.44][i % 3];
        const ph = cl(nails * 1.5 - rnd(i, 7) * 0.5), y = 0.03 - ph * ph * 0.5 + Math.sin(ph * Math.PI) * 0.15;
        return <group key={"cl" + i} position={[x + ph * (rnd(i, 8) - 0.5) * 0.3, Math.max(-0.085, y), z + ph * (rnd(i, 9) - 0.5) * 0.3]} rotation={[ph * 4 * rnd(i, 10), 0, ph * 3]}>
          <mesh castShadow><cylinderGeometry args={[0.0035, 0.0035, 0.06, 6]} /><meshStandardMaterial color="#6a5a4a" metalness={0.7} roughness={0.45} /></mesh>
          <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.008, 0.008, 0.002, 10]} /><meshStandardMaterial color="#6a5a4a" metalness={0.7} roughness={0.45} /></mesh>
        </group>;
      })}
    </group>
  );
};

// LA MESA PLEGABLE de pared. open: 0 = levantada contra la pared, 1 = abierta horizontal. arm: 0 = ménsula pegada a la pared, 1 = abierta.
// build: 0..5 (1 listón de pared, 2 cubierta, 3 bisagras+palo de escoba, 4 ménsula, 5 tarabilla). dowel: 0..1 el palo entra. latch: 0 trabada, 1 suelta
export type MesaP = { open: number; arm: number; build: number; dowel: number; latch: number; oil: number; glowHinge?: number; plates?: number; xray?: number };
const Mesa: React.FC<MesaP & { tx: ReturnType<typeof useTaller> }> = ({ open, arm, build, dowel, latch, oil, glowHinge = 0, plates = 0, xray = 0, tx }) => {
  const { x, hingeY, w, d, th } = MESA;
  const b = (k: number) => cl(build - (k - 1));         // aparición de cada etapa
  const drop = (k: number) => (1 - ease(b(k))) * 0.5;    // entra bajando desde arriba
  const wc = woodCol(oil);
  const ang = -Math.PI / 2 * (1 - ease(open));         // 0 = horizontal; -90° = levantada
  const KN = [-0.3, 0.3];                               // las dos bisagras (centro de cada una)
  const op = 1 - 0.6 * xray;
  return (
    <group position={[x, 0, WZ]}>
      {/* listón de pared (del patín): 80 × 7 × 5 cm, con los dientes de la pared en cada bisagra */}
      {b(1) > 0.01 && <group position={[0, hingeY - 0.045 + drop(1), 0.03]}>
        <Box p={[0, 0, 0]} s={[w, 0.07, 0.05]} c={wc} map={tx.tablas[8]} r={0.8 - 0.3 * oil} rad={0.006} o={op} />
        {KN.map((kx) => [-1, 1].map((sg) => <Box key={kx + "" + sg} p={[kx + sg * 0.07, 0.045, 0.03]} s={[0.07, 0.05, 0.05]} c={wc} map={tx.tablas[7]} r={0.8} rad={0.008} e="#ffb257" ei={0.6 * glowHinge} o={op} />))}
      </group>}
      {/* la cubierta gira sobre el eje de las bisagras */}
      <group position={[0, hingeY, 0.085]} rotation={[ang, 0, 0]}>
        {b(2) > 0.01 && <group position={[0, drop(2) * 2, 0]}>
          {/* 7 tablas de 9 cm pegadas canto con canto, 80 × 60 */}
          {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.0085 + th / 2, 0.005 + (i + 0.5) * (d / 7)]} castShadow receiveShadow geometry={rbox(w, th, d / 7 - 0.0015, 0.002)}>
            <meshStandardMaterial map={tx.tablas[i]} color={wc} roughness={0.85 - 0.4 * oil} transparent={xray > 0} opacity={op} />
          </mesh>)}
          {/* travesaño de atrás con el diente de la mesa (centro de cada bisagra) */}
          {KN.map((kx) => <Box key={"kt" + kx} p={[kx, 0, 0.0]} s={[0.07, 0.05, 0.05]} c={wc} map={tx.tablas[7]} r={0.8} rad={0.008} e="#ffb257" ei={0.6 * glowHinge} o={op} />)}
          {/* platos sobre la mesa abierta */}
          {plates > 0.01 && [[-0.2, 0.16], [0.2, 0.16], [-0.2, 0.44], [0.2, 0.44]].map(([px, pz], i) => <group key={"pl" + i} position={[px, 0.0265 + 0.012, pz]} scale={Math.min(1, plates * 1.3 - i * 0.08)}>
            <mesh castShadow><cylinderGeometry args={[0.11, 0.08, 0.02, 32]} /><meshStandardMaterial color="#a3502a" roughness={0.6} /></mesh>
            <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.08, 0.08, 0.004, 28]} /><meshStandardMaterial color={["#d98a4a", "#7a3a18", "#e6cf92", "#c2552d"][i]} roughness={0.85} /></mesh>
          </group>)}
        </group>}
        {/* el palo de escoba que atraviesa los 3 dientes de cada bisagra */}
        {b(3) > 0.01 && KN.map((kx) => <mesh key={"pe" + kx} position={[kx + (1 - ease(dowel)) * 0.32 * (kx < 0 ? -1 : 1), 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.215, 18]} /><meshStandardMaterial color="#d8b47a" roughness={0.5} emissive="#ffd27a" emissiveIntensity={0.5 * glowHinge} />
        </mesh>)}
      </group>
      {/* ménsula: triángulo que gira sobre su tabla parada (eje vertical en x=0, pegado a la pared) */}
      {b(4) > 0.01 && <group position={[0, drop(4), 0.035]} rotation={[0, -Math.PI / 2 * (1 - ease(arm)), 0]}>
        <Box p={[0, hingeY - 0.235, 0]} s={[0.045, 0.45, 0.019]} c={wc} map={tx.tablas[5]} r={0.8} rad={0.004} o={op} />
        <Box p={[0, hingeY - 0.025, 0.2]} s={[0.045, 0.019, 0.4]} c={wc} map={tx.tablas[6]} r={0.8} rad={0.004} o={op} />
        <Box p={[0, hingeY - 0.205, 0.17]} s={[0.04, 0.019, 0.46]} c={wc} map={tx.tablas[4]} r={0.8} rad={0.004} rot={[Math.atan2(0.36, 0.34), 0, 0]} o={op} />
        {/* tacos con los tarugos-pivote */}
        {[hingeY - 0.03, hingeY - 0.45].map((yy) => <Box key={yy} p={[0, yy, -0.02]} s={[0.07, 0.05, 0.03]} c="#7a5030" r={0.8} rad={0.006} />)}
      </group>}
      {/* tarabilla: tablita de 10 cm que gira en un tarugo arriba de la mesa */}
      {b(5) > 0.01 && <group position={[0, MESA.latchY + drop(5), 0.11]} rotation={[0, 0, (1 - ease(latch)) * Math.PI / 2]}>
        <Box p={[0, 0, 0]} s={[0.1, 0.025, 0.018]} c={wc} map={tx.tablas[3]} r={0.7} rad={0.005} />
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.012]}><cylinderGeometry args={[0.007, 0.007, 0.03, 10]} /><meshStandardMaterial color="#d8b47a" roughness={0.5} /></mesh>
      </group>}
    </group>
  );
};

// ---------------- props del mundo que cambian con el video ----------------
export type WorldProps = {
  t: number;
  explode?: number; nails?: number; selloGlow?: number; // la tarima del piso
  mesa?: Partial<MesaP>;
  dusk?: number;           // 0 mañana · 1 atardecer
  top?: number;            // vista cenital: se esconde la viga del frente
};
export const World: React.FC<WorldProps> = (pr) => {
  const { t, explode = 0, nails = 0, selloGlow = 0, dusk = 0 } = pr;
  const m: MesaP = { open: 0, arm: 0, build: 5, dowel: 1, latch: 0, oil: 1, ...pr.mesa };
  const tx = useTaller();
  const sky = new THREE.Color("#f6d9a8").lerp(new THREE.Color("#e8915a"), dusk);
  const dest: V = PT.mesaCerrada; // las tablas vuelan a la pared y SE VUELVEN la cubierta de la mesa
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35} threshold={0.9} exposure={1.05} env={0.3} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 10, 42]} />
      <hemisphereLight args={[0xdfe8ff, 0x4a3524, 0.75]} />
      {/* sol de media mañana entrando por la puerta (derecha) */}
      <directionalLight position={[12, 8, 4]} intensity={2.7} color={new THREE.Color("#ffd9a0").lerp(new THREE.Color("#ff9a5a"), dusk).getHex()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={14} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* foco colgado sobre el banco */}
      <pointLight position={[-0.4, 2.5, -1.2]} intensity={2.2} distance={6} decay={1.5} color="#ffcf8a" castShadow shadow-bias={-0.0004} />
      {/* luz de relleno sobre la pared de la mesa */}
      <pointLight position={[MESA.x + 0.3, 1.9, -1.3]} intensity={1.4} distance={4} decay={1.6} color="#ffe2b8" />

      {/* piso de tierra con viruta + patio empedrado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 6.2]} /><meshStandardMaterial map={tx.tierra} color="#f0e2cc" roughness={1} bumpMap={tx.tierra} bumpScale={2} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial map={tx.patio} color="#e8d8c0" roughness={1} bumpMap={tx.patio} bumpScale={1.5} /></mesh>

      {/* paredes de adobe: fondo e izquierda; derecha con la puerta grande */}
      <Box p={[0, 1.6, -3.1]} s={[8, 3.2, 0.32]} c="#f2e6d6" map={tx.adobe} r={1} rad={0.04} bump={3} />
      <Box p={[-4, 1.6, 0]} s={[0.32, 3.2, 6.5]} c="#f2e6d6" map={tx.adobe} r={1} rad={0.04} bump={3} />
      <Box p={[4, 1.6, -2.45]} s={[0.32, 3.2, 1.5]} c="#f2e6d6" map={tx.adobe} r={1} rad={0.04} bump={3} />
      <Box p={[4, 1.6, 2.2]} s={[0.32, 3.2, 2.1]} c="#f2e6d6" map={tx.adobe} r={1} rad={0.04} bump={3} />
      <Box p={[4, 2.85, -0.2]} s={[0.32, 0.7, 2.6]} c="#f2e6d6" map={tx.adobe} r={1} rad={0.04} bump={3} />
      {/* marco y hoja abierta de la puerta de madera */}
      {[-1.5, 1.1].map((z) => <Box key={z} p={[4.0, 1.25, z]} s={[0.36, 2.5, 0.1]} c="#5a3a22" map={tx.banco} r={0.9} />)}
      <Box p={[4.55, 1.25, 1.55]} s={[1.0, 2.4, 0.06]} c="#6b4a2c" map={tx.banco} r={0.9} rot={[0, -1.25, 0]} />
      {/* vigas del techo (sólo atrás: la cámara entra por adelante) */}
      {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((x) => <Box key={x} p={[x, 3.15, -0.9]} s={[0.16, 0.16, 4.6]} c="#4f321d" map={tx.banco} r={0.95} />)}
      <Box p={[0, 3.3, -2.0]} s={[8.2, 0.08, 2.4]} c="#a8875a" r={1} rad={0.01} />

      {/* herramientas colgadas en la pared del fondo (izquierda) */}
      <Box p={[-1.6, 1.42, -2.86]} s={[2.6, 0.05, 0.28]} c="#5a3a22" map={tx.banco} r={0.9} />
      <Serrucho p={[-2.7, 2.3, -2.92]} s={1.05} />
      <Serrucho p={[-2.25, 2.25, -2.92]} s={0.9} rz={0.05} />
      <Serrucho p={[-1.85, 2.35, -2.92]} s={1.15} rz={-0.04} />
      {Array.from({ length: 6 }, (_, i) => <Formon key={i} p={[-1.35 + i * 0.09, 1.95, -2.9]} />)}
      <Cepillo p={[-0.55, 1.48, -2.8]} />
      <Cepillo p={[-2.2, 1.48, -2.78]} rot={[0, 0.2, 0]} />
      {/* escuadra y berbiquí */}
      <group position={[-0.3, 2.15, -2.92]}><Box p={[0, 0, 0]} s={[0.04, 0.32, 0.01]} c="#5a3820" r={0.6} rad={0.004} /><Box p={[0.1, -0.14, 0]} s={[0.24, 0.035, 0.004]} c="#aaa" m={0.8} r={0.3} rad={0.002} /></group>
      {Array.from({ length: 7 }, (_, i) => <mesh key={"cv" + i} position={[-3.1 + i * 0.25, 2.62, -2.92]}><cylinderGeometry args={[0.008, 0.008, 0.06, 5]} /><meshStandardMaterial color="#333" metalness={0.6} /></mesh>)}

      {/* BANCO de carpintero largo con prensa de tornillo de madera, viruta y tablas */}
      <group position={[-1.6, 0, -1.6]}>
        <Box p={[0, 0.84, 0]} s={[2.4, 0.08, 0.7]} c="#e6cdb0" map={tx.banco} r={0.85} />
        {[[-1.05, -0.28], [1.05, -0.28], [-1.05, 0.28], [1.05, 0.28]].map(([x, z]) => <Box key={x + "" + z} p={[x, 0.4, z]} s={[0.1, 0.8, 0.1]} c="#cfb090" map={tx.banco} />)}
        <Box p={[0, 0.25, 0]} s={[2.1, 0.06, 0.5]} c="#cfb090" map={tx.banco} />
        <Box p={[-1.25, 0.8, 0.3]} s={[0.12, 0.2, 0.18]} c="#cfb090" map={tx.banco} />
        <mesh position={[-1.38, 0.8, 0.3]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.3, 12]} /><meshStandardMaterial color="#7a5030" roughness={0.6} /></mesh>
        <Cepillo p={[0.3, 0.92, 0.05]} rot={[0, 0.4, 0]} />
        {/* mazo */}
        <group position={[0.75, 0.93, -0.1]} rotation={[0, 0.9, 0]}><Box p={[0, 0, 0]} s={[0.16, 0.09, 0.09]} c="#6a4024" r={0.7} rad={0.015} /><mesh position={[0.15, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.26, 8]} /><meshStandardMaterial color="#7a5030" /></mesh></group>
        {/* rulos de viruta sobre el banco */}
        {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.6 + rnd(i, 1) * 1.3, 0.895, -0.25 + rnd(i, 2) * 0.5]} rotation={[Math.PI / 2, 0, rnd(i, 3) * 6]}><torusGeometry args={[0.02 + rnd(i, 4) * 0.015, 0.004, 4, 12, 4]} /><meshStandardMaterial color="#e8c79a" roughness={0.9} /></mesh>)}
      </group>

      {/* LA TARIMA en el piso */}
      <Tarima p={PT.tarima} tx={tx} explode={explode} nails={nails} t={t} dest={dest} oil={m.oil * cl(explode * 1.2 - 0.2)} selloGlow={selloGlow} />

      {/* LA MESA plegable en la pared del fondo */}
      <Mesa {...m} tx={tx} />

      {/* la pila de tarimas que junta, acostadas una sobre otra en el patio, junto a la puerta */}
      {[0, 1, 2, 3].map((i) => <group key={"pila" + i} position={[5.0 + (rnd(i, 4) - 0.5) * 0.08, 0.07 + i * 0.13, -0.8 + (rnd(i, 5) - 0.5) * 0.1]} rotation={[-Math.PI / 2, 0, (rnd(i, 3) - 0.5) * 0.12]}>
        {Array.from({ length: 7 }, (_, k) => <Box key={k} p={[-0.51 + k * 0.17, 0, 0.055]} s={[0.095, 1.0, 0.019]} c={["#b9a690", "#a8957e", "#c4b39c", "#9c8a72"][(i + k) % 4]} map={tx.tablas[(i + k) % 7]} r={0.95} rad={0.004} />)}
        {[-0.44, 0, 0.44].map((y) => <Box key={y} p={[0, y, 0]} s={[1.2, 0.07, 0.09]} c="#a08a70" map={tx.tablas[7]} r={0.95} rad={0.006} />)}
        {[-0.5, 0, 0.5].map((x) => <Box key={"b" + x} p={[x, 0, -0.055]} s={[0.12, 1.0, 0.019]} c="#9c8a72" map={tx.tablas[(i + 3) % 7]} r={0.95} rad={0.004} />)}
      </group>)}
      {/* EL PATIO: techo de teja del corredor, pared de cal rosa, maceta con geranio, cielo */}
      <group>
        <Box p={[7.2, 2.7, 0]} s={[5.5, 0.08, 6]} c="#8a3a1f" map={tx.teja} r={0.8} rot={[0, 0, -0.18]} />
        {[[5.0, -2.6], [5.0, 2.6], [9.5, -2.6], [9.5, 2.6]].map(([x, z]) => <Box key={x + "" + z} p={[x, 1.25, z]} s={[0.16, 2.5, 0.16]} c="#cfb090" map={tx.banco} />)}
        <Box p={[11.5, 1.4, 0]} s={[0.3, 2.8, 9]} c="#e9b8b0" map={tx.cal} r={1} />
        <group position={[6.2, 0, -1.8]}>
          <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.2, 0.15, 0.4, 16]} /><meshStandardMaterial color="#b0552d" roughness={0.8} /></mesh>
          {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.4, 0.5 + rnd(i, 2) * 0.25, (rnd(i, 3) - 0.5) * 0.4]}><sphereGeometry args={[0.08, 10, 8]} /><meshStandardMaterial color={i % 3 ? "#3f6b25" : "#e8344a"} roughness={0.8} /></mesh>)}
        </group>
        {Array.from({ length: 5 }, (_, i) => <mesh key={"m" + i} position={[30 + i * 6, 0, -20 + i * 9]}><coneGeometry args={[9 + rnd(i, 1) * 5, 7 + rnd(i, 2) * 4, 7]} /><meshStandardMaterial color={new THREE.Color("#6f7a4a").lerp(sky, 0.45)} roughness={1} flatShading /></mesh>)}
      </group>
    </ThreeCanvas>
  );
};
