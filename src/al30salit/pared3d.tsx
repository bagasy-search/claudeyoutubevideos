// al30 · EL MUNDO: una pared de ladrillo de casa vieja en corte de maqueta (extremo izquierdo cortado, bloque de suelo
// abierto). Adentro, la sala: la pared pintada con LA MANCHA que sube del zócalo (altura = ev.wet, en metros), el salitre,
// las ampollas, el zócalo de cerámica o de madera, el picado hasta el ladrillo y el revoque nuevo en dos capas, la prueba del
// aluminio, la bolsa, el cuadro de prueba y el rodillo. Con rayos X el revoque se vuelve vidrio y se ve el agua subiendo por
// los canalitos del ladrillo (y el caño que pierde, en el video del salitre). Afuera: la jardinera más alta que el piso, la
// canaleta que larga al pie del muro, la pendiente del patio, la zanja de grava, el medidor de agua y la fila de inyecciones.
// Sobre la mesa, EL MANUAL con sus páginas reales. UNA escena, UNA cámara (cam.json) con balanceo de mano; eventos en ev.json.
// Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { P } from "./lib";
import { manoCam } from "../kits/camara/CamaraMano";
import CAM from "./cam.json";
import EV from "./ev.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// la pared: x de -2 a 2, cara de adentro en z=-0.15, cara de afuera en z=+0.15; piso de adentro y=0
const WX0 = -2, WX1 = 2, ZI = -0.15, ZO = 0.15, WH = 2.6;
// ---------------- puntos del mundo ----------------
export const PT = {
  wall: [0, 0.9, ZI] as V3,
  base: [0, 0.08, ZI] as V3,
  stain: [-0.4, 0.75, ZI] as V3,
  salt: [0.5, 0.12, ZI] as V3,
  blister: [-0.9, 0.45, ZI] as V3,
  zocalo: [0.9, 0.08, ZI] as V3,
  pick: [-0.6, 0.5, ZI] as V3,
  foil: [0.95, 0.45, ZI] as V3,
  test: [-1.35, 1.05, ZI] as V3,
  inject: [0.2, 0.15, ZI] as V3,
  cut: [WX0, 0.3, 0] as V3,
  dpc: [WX0, -0.02, 0] as V3,
  found: [WX0, -0.45, 0] as V3,
  pipe: [0.6, 0.5, 0] as V3,
  soil: [0, 0.14, 0.55] as V3,
  spout: [1.25, 0.25, 0.3] as V3,
  slope: [0, 0.02, 1.6] as V3,
  trench: [-0.3, -0.1, 0.32] as V3,
  meter: [-1.4, 0.0, 1.9] as V3,
  book: [1.55, 0.735, -1.75] as V3,
};

// ---------------- CÁMARA (llaves de cam.json; balanceo de mano encima) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = (CAM as { keys: Key[] }).keys;
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
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t), m = manoCam(t, 1, 7);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l);
  cm.rotateY((m.pan * Math.PI) / 180); cm.rotateX((m.tilt * Math.PI) / 180); cm.rotateZ((m.roll * Math.PI) / 180);
  cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- eventos (rangos en segundos globales) ----------------
type Ev = Record<string, [number, number][]>;
const E = EV as unknown as Ev & { wet: [number, number][]; soil: [number, number][]; pages: { a: number; b: number; pg: string }[]; marks: { at: number; out: number; box: [number, number, number, number]; col?: string }[] };
const onR = (t: number, k: string, fi = 0.5, fo = 0.5) => { for (const [a, b] of E[k] || []) if (t >= a - fi && t < b + fo) return win(t, a - fi, a) * (1 - win(t, b, b + fo)); return 0; };
const since = (t: number, k: string) => { for (const [a, b] of E[k] || []) if (t >= a && t < b) return t - a; return -1; };
const kf = (t: number, pts: [number, number][], d = 0) => {
  if (!pts || !pts.length) return d; if (t <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], sm((t - pts[i][0]) / Math.max(0.01, pts[i + 1][0] - pts[i][0])));
  return pts[pts.length - 1][1];
};

// ---------------- páginas REALES del manual ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas manual"); let n = ids.length;
    for (const id of ids) {
      const tx = L.load(staticFile(P + id + ".jpg"), () => { if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx;
    }
    return r;
  }, [ids.join("|")]);
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const brickDraw = (g: CanvasRenderingContext2D, wet = 0) => {
  g.fillStyle = wet ? "#5e5a55" : "#b9b2a6"; g.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 16; r++) for (let c = -1; c < 5; c++) {
    const x = c * 128 + (r % 2) * 64, y = r * 32, v = rnd(r * 9 + c, 2);
    const R = 150 + v * 40 - wet * 50, G = 74 + v * 22 - wet * 25, B = 48 + v * 14 - wet * 12;
    g.fillStyle = `rgb(${R},${G},${B})`; g.fillRect(x + 3, y + 3, 122, 26);
    for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(40,15,5,${0.18 * rnd(k, r + c)})`; g.fillRect(x + 3 + rnd(k, 4) * 118, y + 3 + rnd(k, 5) * 22, 3, 3); }
  }
};
const useTex = () => useMemo(() => ({
  brick: mk(512, 512, (g) => brickDraw(g), [5, 6]),
  brickCut: mk(512, 512, (g) => brickDraw(g), [1.2, 6]),
  brickWet: mk(512, 512, (g) => brickDraw(g, 1), [5, 6]),
  plaster: mk(512, 512, (g) => {
    g.fillStyle = "#ebe5d8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { const v = 215 + rnd(i, 1) * 30; g.fillStyle = `rgba(${v},${v - 4},${v - 14},.5)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [4, 3]),
  render: mk(512, 512, (g) => {
    g.fillStyle = "#9b9a96"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) { const v = 120 + rnd(i, 1) * 70; g.fillStyle = `rgba(${v},${v},${v - 4},.55)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [3, 2]),
  // la mancha: marrón con borde de arriba ondulado y línea de marea más oscura
  stain: mk(1024, 512, (g) => {
    const top = (x: number) => 40 + 22 * Math.sin(x * 0.018) + 14 * Math.sin(x * 0.051 + 1.3) + 8 * Math.sin(x * 0.13 + 2);
    g.beginPath(); g.moveTo(0, 512); for (let x = 0; x <= 1024; x += 4) g.lineTo(x, top(x)); g.lineTo(1024, 512); g.closePath();
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(118,92,58,.55)"); gr.addColorStop(0.35, "rgba(108,86,56,.5)"); gr.addColorStop(1, "rgba(80,66,46,.72)");
    g.fillStyle = gr; g.fill();
    g.lineWidth = 9; g.strokeStyle = "rgba(92,64,34,.6)"; g.beginPath(); for (let x = 0; x <= 1024; x += 4) (x ? g.lineTo(x, top(x) + 3) : g.moveTo(x, top(x) + 3)); g.stroke();
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(70,52,30,${0.15 * rnd(i, 7)})`; g.beginPath(); g.arc(rnd(i, 1) * 1024, 80 + rnd(i, 2) * 430, 4 + rnd(i, 3) * 18, 0, 6.3); g.fill(); }
  }),
  salt: mk(1024, 128, (g) => {
    for (let i = 0; i < 2200; i++) { const y = 128 - Math.pow(rnd(i, 2), 1.8) * 128; g.fillStyle = `rgba(250,250,246,${0.35 + 0.5 * rnd(i, 3)})`; g.beginPath(); g.arc(rnd(i, 1) * 1024, y, 1 + rnd(i, 4) * 3.5, 0, 6.3); g.fill(); }
  }),
  floor: mk(256, 256, (g) => {
    g.fillStyle = "#3a332c"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) { const v = rnd(r * 4 + c2, 3), w = (r + c2) % 2; g.fillStyle = w ? `rgb(${168 + v * 20},${70 + v * 12},${52 + v * 8})` : `rgb(${206 + v * 18},${196 + v * 16},${176 + v * 14})`; g.fillRect(c2 * 64 + 2, r * 64 + 2, 60, 60); }
  }, [10, 6]),
  soil: mk(256, 256, (g) => {
    g.fillStyle = "#4b3626"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = 50 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v + 20},${v},${v - 18},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 3, 3); }
  }, [6, 6]),
  strata: mk(1400, 700, (g) => {
    const band = (y0: number, y1: number, a: string, b: string) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, 1400, y1 - y0); };
    band(0, 140, "#5b4331", "#4a3526"); band(140, 700, "#8a5d3e", "#5e3f29");
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(30,20,12,${0.25 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 1400, rnd(i, 3) * 700, 3, 2); }
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(70,40,22,${0.2 + 0.2 * rnd(i, 3)})`; g.lineWidth = 2; g.beginPath(); const y = 160 + rnd(i, 1) * 520; g.moveTo(0, y); g.bezierCurveTo(400, y + 6 * rnd(i, 2), 900, y - 5, 1400, y + 3); g.stroke(); }
  }),
  sky: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0e131a"); gr.addColorStop(0.45, "#2b3542"); gr.addColorStop(0.55, "#333d4a"); gr.addColorStop(1, "#0c0f13"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
  wood: mk(256, 64, (g) => { g.fillStyle = "#8a5a36"; g.fillRect(0, 0, 256, 64); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(60,30,12,${0.15 + 0.2 * rnd(i, 2)})`; g.beginPath(); const y = rnd(i, 1) * 64; g.moveTo(0, y); g.bezierCurveTo(90, y + 3, 170, y - 3, 256, y + 1); g.stroke(); } }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const CHROME = { color: "#d9dcdf", metalness: 1, roughness: 0.25 };
// plano pegado a la cara de adentro de la pared (x0..x1, y0..y1), apenas delante
const Face: React.FC<{ x0: number; x1: number; y0: number; y1: number; dz?: number; children: React.ReactNode }> = ({ x0, x1, y0, y1, dz = 0.002, children }) => (
  <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, ZI - dz]} rotation={[0, Math.PI, 0]} scale={[x1 - x0, Math.max(0.001, y1 - y0), 1]}><planeGeometry args={[1, 1]} />{children}</mesh>
);
const Pipe: React.FC<{ a: V3; b: V3; r?: number; c?: string; m?: number }> = ({ a, b, r = 0.04, c = "#bfc3c6", m = 0.6 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), len = A.distanceTo(B);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, len, 20]} /><meshStandardMaterial color={c} roughness={0.45} metalness={m} /></mesh>;
};
const Drops: React.FC<{ t: number; on: number; from: V3; to: V3; n?: number; col?: string; sp?: number; r?: number }> = ({ t, on, from, to, n = 24, col = "#8fd0ff", sp = 0.9, r = 0.018 }) => {
  if (on < 0.01) return null;
  return <>{Array.from({ length: n }, (_, i) => { const u = (t * sp + i / n) % 1; return <mesh key={i} position={[lerp(from[0], to[0], u) + (rnd(i, 1) - 0.5) * 0.05, lerp(from[1], to[1], u), lerp(from[2], to[2], u) + (rnd(i, 2) - 0.5) * 0.05]}><sphereGeometry args={[r, 8, 6]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.35} transparent opacity={0.85 * on} /></mesh>; })}</>;
};
const Plant: React.FC<{ p: V3; s?: number; i: number }> = ({ p, s = 1, i }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.012, 0.016, 0.24, 6]} /><meshStandardMaterial color="#4c6a2e" /></mesh>
    {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[(rnd(i, k) - 0.5) * 0.18, 0.2 + rnd(k, i) * 0.16, (rnd(k + 3, i) - 0.5) * 0.18]}><sphereGeometry args={[0.07 + rnd(i + k, 2) * 0.04, 10, 8]} /><meshStandardMaterial color={k % 2 ? "#3f7a34" : "#5a9a3e"} roughness={0.8} /></mesh>)}
  </group>
);

const PAPER = "#cfc9be";
export const BW = 0.3, BD = BW * 1605 / 1240;
export const Book: React.FC<{ p: V3; open: number; cover: THREE.Texture; right: THREE.Texture; children?: React.ReactNode }> = ({ p, open, cover, right, children }) => {
  const w = BW, d = BD, th = 0.03, ang = Math.PI * ease(open);
  return (
    <group position={p}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c="#22303d" r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#d8d0bf" roughness={0.95} /></mesh>
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color="#ffffff" roughness={0.92} envMapIntensity={0.2} /></mesh>
      <group position={[0.004, 0.0065 + th, 0]}>{children}</group>
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c="#22303d" r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.4} color="#ffffff" /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial color={PAPER} roughness={0.92} /></mesh>
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
  return <mesh position={[(x0 - 0.5) * pw + ww / 2, 0.0009, (y0 - 0.5) * pd + hh / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[ww, hh]} /><meshBasicMaterial color={col} transparent opacity={0.5 * o} depthWrite={false} /></mesh>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const bt = useTex();
  const tx = useTextures();
  const pg = useImgTex(["al001", "al011"]);
  const xr = onR(t, "xray", 0.6, 0.6);
  const wet = kf(t, E.wet, 0.8);                 // altura de la mancha (m)
  const soil = kf(t, E.soil, 0.15);              // nivel de la tierra de afuera respecto del piso de adentro (m)
  const salt = onR(t, "salt", 0.6, 0.6), blister = onR(t, "blister", 0.6, 0.6), peel = onR(t, "peel", 0.5, 0.5);
  const zoc = onR(t, "zoc", 0.5, 0.5), zocw = onR(t, "zocwood", 0.5, 0.5);
  const pick = onR(t, "pick", 0.8, 0.6), brush = onR(t, "brush", 0.3, 0.3);
  const ren1 = onR(t, "render1", 0.8, 0.6), ren2 = onR(t, "render2", 0.8, 0.6);
  const foil = onR(t, "foil", 0.5, 0.5), foilwet = onR(t, "foilwet", 0.4, 0.4), bag = onR(t, "bag", 0.5, 0.5);
  const testsq = onR(t, "test", 0.6, 0.6), paint = onR(t, "paint", 0.4, 0.4), tape = onR(t, "tape", 0.3, 0.3);
  const rain = onR(t, "rain", 0.4, 0.6), spoutfix = onR(t, "spoutfix", 0.6, 0.6), slope = onR(t, "slope", 0.4, 0.4), away = onR(t, "away", 0.4, 0.4);
  const plants = 1 - onR(t, "noplants", 0.8, 0.8), gravel = onR(t, "gravel", 0.8, 0.8), dpc = onR(t, "dpc", 0.5, 0.5);
  const drill = onR(t, "drill", 0.4, 0.4), injS = since(t, "inject"), inj = onR(t, "inject", 0.3, 0.6), injDone = onR(t, "injdone", 0.5, 0.5);
  const leak = onR(t, "leak", 0.5, 0.5), meter = onR(t, "meter", 0.4, 0.4), lime = onR(t, "lime", 0.5, 0.5), mold = onR(t, "mold", 0.5, 0.5);
  const pgNow = E.pages.find((x) => t >= x.a - 1 && t < x.b + 1);
  const open = pgNow ? win(t, pgNow.a, pgNow.a + 0.9) * (1 - win(t, pgNow.b, pgNow.b + 0.9)) : 0;
  const right = pg[pgNow?.pg ?? "al011"], cover = pg["al001"];
  const wallOp = 1 - 0.78 * xr;
  const PX0 = -1.55, PX1 = 0.35, pickTop = Math.min(1.45, wet + 0.3);
  const holes = Array.from({ length: 33 }, (_, i) => WX0 + 0.2 + i * 0.11);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.22} threshold={0.95} exposure={0.88} env={0.34} />
      <color attach="background" args={["#141a23"]} />
      <mesh><sphereGeometry args={[60, 32, 16]} /><meshBasicMaterial map={bt.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xdfe8f5, 0x2a2622, 0.55]} />
      <directionalLight position={[3, 8, 6]} intensity={1.5} color="#fff3e2" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003} />
      <pointLight position={[0.2, 2.3, -1.6]} intensity={2.6} distance={6} color="#ffe6c4" castShadow />
      <spotLight position={[-1.2, 1.6, -2.4]} angle={0.8} penumbra={0.9} intensity={4.5} distance={6} color="#f2f5ff" target-position={[0, 0.5, ZI]} />
      <spotLight position={[1.5, 2.2, 2.6]} angle={0.8} penumbra={0.9} intensity={3.5} distance={6} color="#fff0dc" target-position={[0, 0.1, 0.6]} />

      {/* ===== bloque de suelo cortado (maqueta) + cimiento ===== */}
      <mesh position={[0.15, -0.8, 0]} receiveShadow geometry={rbox(4.7, 1.6, 6.2, 0.02)}><meshStandardMaterial map={bt.strata} roughness={0.95} /></mesh>
      <Box p={[0, -0.5, 0]} s={[4.02, 0.4, 0.5]} c="#8e8b85" map={tx.concrete} r={0.95} rad={0.01} />
      {/* la capa aisladora (rota en dos lugares) */}
      <Box p={[-1.1, -0.02, 0]} s={[1.75, 0.03, 0.31]} c={dpc > 0.01 ? "#1d1d1d" : "#3b3a38"} e="#ffd60a" ei={0.5 * dpc} r={0.6} rad={0.005} />
      <Box p={[1.2, -0.02, 0]} s={[1.5, 0.03, 0.31]} c={dpc > 0.01 ? "#1d1d1d" : "#3b3a38"} e="#ffd60a" ei={0.5 * dpc} r={0.6} rad={0.005} />

      {/* ===== LA PARED ===== */}
      {/* núcleo de ladrillo (se ve en el corte y con rayos X) */}
      <mesh position={[0, WH / 2 - 0.02, 0]} castShadow receiveShadow><boxGeometry args={[WX1 - WX0, WH + 0.04, ZO - ZI - 0.04]} /><meshStandardMaterial map={bt.brickCut} roughness={0.9} transparent={xr > 0.01} opacity={1 - 0.55 * xr} /></mesh>
      {/* corte: la parte mojada del ladrillo se ve oscura hasta la altura de la mancha */}
      <mesh position={[WX0 - 0.003, wet / 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[ZO - ZI, Math.max(0.01, wet + 0.05), 1]}><planeGeometry args={[1, 1]} /><meshStandardMaterial map={bt.brickWet} transparent opacity={0.85} roughness={0.9} /></mesh>
      {/* revoque + pintura de la cara de adentro */}
      <Face x0={WX0} x1={WX1} y0={0} y1={WH} dz={0.012}><meshStandardMaterial map={bt.plaster} color="#f1ece2" roughness={0.9} transparent={xr > 0.01} opacity={wallOp} depthWrite={xr < 0.3} /></Face>
      {/* cara de afuera (revoque gris) */}
      <mesh position={[0, WH / 2, ZO + 0.012]} receiveShadow><planeGeometry args={[WX1 - WX0, WH]} /><meshStandardMaterial map={bt.render} color="#c9c4b8" roughness={0.95} transparent={xr > 0.01} opacity={wallOp} /></mesh>
      {/* LA MANCHA */}
      <Face x0={WX0} x1={WX1} y0={0} y1={wet + 0.06} dz={0.014}><meshStandardMaterial map={bt.stain} transparent opacity={(1 - 0.5 * ren2) * wallOp} depthWrite={false} roughness={0.9} /></Face>
      {/* salitre */}
      {salt > 0.01 && <Face x0={WX0} x1={WX1} y0={0} y1={0.32} dz={0.016}><meshStandardMaterial map={bt.salt} transparent opacity={salt} depthWrite={false} roughness={1} /></Face>}
      {/* moho (puntitos negros, para comparar con la condensación) */}
      {mold > 0.01 && Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[1.4 + rnd(i, 1) * 0.5, 2.05 + rnd(i, 2) * 0.5, ZI - 0.018]}><circleGeometry args={[0.006 + rnd(i, 3) * 0.012, 8]} /><meshBasicMaterial color="#1b1d18" transparent opacity={0.8 * mold} /></mesh>)}
      {/* ampollas y pintura colgando */}
      {blister > 0.01 && Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[WX0 + 0.25 + rnd(i, 1) * 3.4, 0.12 + rnd(i, 2) * Math.max(0.1, wet - 0.12), ZI - 0.016]} scale={[1, 1, 0.45]}><sphereGeometry args={[(0.02 + rnd(i, 3) * 0.035) * blister, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#efe9de" roughness={0.6} /></mesh>)}
      {peel > 0.01 && Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-1.1 + rnd(i, 4) * 1.6, 0.2 + rnd(i, 5) * 0.4, ZI - 0.03 - 0.02 * peel]} rotation={[0.5 * peel + rnd(i, 6) * 0.4, 0.3 * rnd(i, 7), rnd(i, 8)]}><planeGeometry args={[0.08 + rnd(i, 9) * 0.06, 0.12 * peel]} /><meshStandardMaterial color="#f3eee6" roughness={0.7} side={THREE.DoubleSide} /></mesh>)}
      {/* picado: el revoque sale hasta el ladrillo, 30 cm por encima de la mancha */}
      {pick > 0.01 && <Face x0={PX0} x1={PX1} y0={0} y1={pickTop * pick} dz={0.02}><meshStandardMaterial map={bt.brick} roughness={0.95} /></Face>}
      {pick > 0.01 && <mesh position={[(PX0 + PX1) / 2, pickTop * pick, ZI - 0.022]}><boxGeometry args={[PX1 - PX0, 0.012, 0.01]} /><meshStandardMaterial color="#ffd60a" emissive="#ffd60a" emissiveIntensity={0.6 * pick} /></mesh>}
      {brush > 0.01 && <group position={[lerp(PX0 + 0.2, PX1 - 0.2, 0.5 + 0.5 * Math.sin(t * 5)), 0.2, ZI - 0.06]}><Box p={[0, 0, 0]} s={[0.22, 0.05, 0.06]} c="#8a5a36" rad={0.01} /><Box p={[0, -0.035, 0.0]} s={[0.2, 0.02, 0.05]} c="#777" m={0.8} rad={0.004} /></group>}
      {/* revoque nuevo en dos capas (gris tirado; gris claro alisado) — con cal, más blanco */}
      {ren1 > 0.01 && <Face x0={PX0} x1={PX1} y0={0} y1={pickTop * ren1} dz={0.024}><meshStandardMaterial map={bt.render} color={lime > 0.5 ? "#e6e2d6" : "#b0aea8"} roughness={1} /></Face>}
      {ren2 > 0.01 && <Face x0={PX0} x1={PX1} y0={0} y1={pickTop} dz={0.026}><meshStandardMaterial color={lime > 0.5 ? "#f0ece2" : "#cfccc4"} roughness={0.85} transparent opacity={ren2} /></Face>}
      {/* zócalo de cerámica pegado con cemento / zócalo de madera separado */}
      {zoc > 0.01 && <Box p={[0, 0.075, ZI - 0.03]} s={[WX1 - WX0, 0.15, 0.02]} c="#b45a3c" r={0.25} rad={0.004} op={zoc} />}
      {zocw > 0.01 && <mesh position={[0, 0.06, ZI - 0.04]}><boxGeometry args={[WX1 - WX0, 0.12, 0.018]} /><meshStandardMaterial map={bt.wood} roughness={0.7} transparent opacity={zocw} /></mesh>}
      {/* prueba del aluminio / la bolsa de plástico */}
      {foil > 0.01 && <group position={PT.foil}>
        <mesh position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.3 * foil, 0.3]} /><meshStandardMaterial {...CHROME} roughness={0.35} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0, -0.033]} rotation={[0, Math.PI, 0]}><ringGeometry args={[0.19, 0.205, 4, 1, Math.PI / 4]} /><meshStandardMaterial color="#c9b98a" side={THREE.DoubleSide} /></mesh>
        {foilwet > 0.01 && Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.26, (rnd(i, 2) - 0.5) * 0.26, -0.037]}><sphereGeometry args={[0.006 + rnd(i, 3) * 0.006, 8, 6]} /><meshPhysicalMaterial color="#cfefff" transparent opacity={0.9 * foilwet} roughness={0} /></mesh>)}
      </group>}
      {bag > 0.01 && <group position={[0.95, 0.35, ZI]}><mesh position={[0, 0, -0.04]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.32, 0.32]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.3 * bag} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.28, (rnd(i, 2) - 0.5) * 0.28, -0.045]}><sphereGeometry args={[0.005, 6, 5]} /><meshPhysicalMaterial color="#e8f6ff" transparent opacity={0.8 * bag * onR(t, "bagwet", 0.3, 0.3)} /></mesh>)}</group>}
      {/* el cuadro de prueba de 50 x 50 (pintado) + la cinta */}
      {testsq > 0.01 && <Face x0={PT.test[0] - 0.25} x1={PT.test[0] + 0.25} y0={PT.test[1] - 0.25} y1={PT.test[1] + 0.25} dz={0.03}><meshStandardMaterial color="#f7f3ea" roughness={0.6} transparent opacity={testsq} /></Face>}
      {tape > 0.01 && <mesh position={[PT.test[0], PT.test[1] + 0.05 * tape, ZI - 0.034]} rotation={[0, Math.PI, 0.1]}><planeGeometry args={[0.2, 0.05]} /><meshStandardMaterial color="#d9c27a" roughness={0.5} side={THREE.DoubleSide} transparent opacity={tape} /></mesh>}
      {/* rodillo de pintura */}
      {paint > 0.01 && <group position={[0.9, 0.7 + 0.35 * Math.sin(t * 2.2), ZI - 0.08]}>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 0.24, 18]} /><meshStandardMaterial color="#f4f1e8" roughness={0.9} /></mesh>
        <Pipe a={[0.13, 0, 0]} b={[0.13, -0.35, -0.08]} r={0.008} c="#666" /></group>}
      {/* rayos X: el agua sube por los canalitos del ladrillo desde el cimiento hasta la mancha */}
      {xr > 0.02 && Array.from({ length: 140 }, (_, i) => {
        const u = (t * (0.08 + rnd(i, 4) * 0.06) + rnd(i, 5)) % 1, top = Math.max(0.08, wet - 0.04);
        const y = -0.35 + u * (top + 0.35), x = WX0 + 0.1 + rnd(i, 1) * 3.8, z = (rnd(i, 2) - 0.5) * 0.22;
        return <mesh key={i} position={[x + 0.01 * Math.sin(t * 3 + i), y, z]}><sphereGeometry args={[0.011, 8, 6]} /><meshStandardMaterial color="#59b8ff" emissive="#2b8fe0" emissiveIntensity={0.9} transparent opacity={xr * (1 - 0.6 * u)} /></mesh>;
      })}
      {/* el caño que pierde dentro de la pared (video del salitre) */}
      {(leak > 0.01) && <>
        <Pipe a={[WX0 + 0.2, 0.5, 0]} b={[1.8, 0.5, 0]} r={0.025} c="#9a9c98" />
        <Drops t={t} on={leak} from={[0.6, 0.5, 0]} to={[0.6, -0.3, 0]} n={20} sp={0.8} r={0.012} />
        <mesh position={[0.6, 0.5, 0]}><sphereGeometry args={[0.07, 16, 12]} /><meshBasicMaterial color="#59b8ff" transparent opacity={0.25 * leak} depthWrite={false} toneMapped={false} /></mesh>
      </>}
      {/* la fila de inyecciones a 15 cm: agujeros cada 11 cm, taladro, crema que llena */}
      {(drill + inj + injDone) > 0.01 && holes.map((x, i) => {
        const filled = injDone > 0.5 || (injS >= 0 && injS * 2.2 > i);
        return <mesh key={i} position={[x, 0.15, ZI - 0.004]} rotation={[0, Math.PI, 0]}><circleGeometry args={[0.012, 12]} /><meshStandardMaterial color={filled ? "#f4f1e6" : "#2b2622"} emissive={filled ? "#9fe0ff" : "#000"} emissiveIntensity={filled ? 0.25 : 0} /></mesh>;
      })}
      {(inj + injDone) > 0.01 && <mesh position={[0, 0.15, 0]}><boxGeometry args={[WX1 - WX0 - 0.2, 0.045, ZO - ZI - 0.06]} /><meshStandardMaterial color="#9fe0ff" emissive="#59b8ff" emissiveIntensity={0.7} transparent opacity={0.45 * Math.max(injDone, xr * inj)} depthWrite={false} /></mesh>}
      {drill > 0.01 && <group position={[lerp(WX0 + 0.3, WX1 - 0.3, (since(t, "drill") >= 0 ? since(t, "drill") : 0) * 0.08 % 1), 0.15, ZI - 0.22]}>
        <Box p={[0, 0.05, -0.05]} s={[0.08, 0.16, 0.22]} c="#1f6fb2" rad={0.02} />
        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.18, 8]} /><meshStandardMaterial {...CHROME} /></mesh>
      </group>}

      {/* ===== LA SALA (adentro) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -1.6]} receiveShadow><planeGeometry args={[WX1 - WX0, 2.9]} /><meshStandardMaterial map={bt.floor} roughness={0.45} /></mesh>
      {/* ventana en la pared */}
      <Box p={[-0.8, 1.75, ZI - 0.02]} s={[0.8, 0.7, 0.04]} c="#e8e2d4" r={0.6} rad={0.01} />
      <mesh position={[-0.8, 1.75, ZI - 0.045]}><planeGeometry args={[0.7, 0.6]} /><meshPhysicalMaterial color="#bcd6ea" roughness={0.05} metalness={0.1} emissive="#9fc3e0" emissiveIntensity={0.35} /></mesh>
      {/* sofá viejo + mesita con el manual */}
      <group position={[-1.1, 0, -1.4]}>
        <Box p={[0, 0.22, 0]} s={[1.3, 0.3, 0.6]} c="#6b5a48" r={0.95} rad={0.06} />
        <Box p={[0, 0.5, 0.26]} s={[1.3, 0.45, 0.14]} c="#6b5a48" r={0.95} rad={0.06} />
      </group>
      <group position={[1.55, 0, -1.75]}>
        <Box p={[0, 0.7, 0]} s={[0.8, 0.04, 0.55]} c="#7b5234" r={0.7} map={tx.planks} rad={0.01} />
        {[[-0.35, -0.22], [0.35, -0.22], [-0.35, 0.22], [0.35, 0.22]].map(([x, z], i) => <Box key={i} p={[x, 0.35, z]} s={[0.04, 0.7, 0.04]} c="#5a3a22" rad={0.01} />)}
      </group>
      <spotLight position={[1.6, 2.0, -2.4]} angle={0.5} penumbra={0.8} intensity={5} distance={4} color="#fff2dc" target-position={PT.book} />
      <Book p={PT.book} open={open} cover={cover} right={right}>
        {E.marks.map((m, i) => <Marker key={i} t={t} at={m.at} out={m.out} box={m.box} col={m.col} />)}
      </Book>

      {/* ===== AFUERA: jardinera más alta que el piso, canaleta, patio con pendiente, zanja de grava, medidor ===== */}
      {/* la tierra pegada a la pared (sube o baja con ev.soil) */}
      <mesh position={[0, soil / 2 - 0.02, 0.15 + 0.55]} receiveShadow><boxGeometry args={[WX1 - WX0, Math.max(0.02, soil + 0.04), 1.1]} /><meshStandardMaterial map={bt.soil} roughness={1} /></mesh>
      {plants > 0.01 && [-1.5, -0.9, -0.2, 0.5, 1.1].map((x, i) => <Plant key={i} p={[x, soil, 0.45 + rnd(i, 3) * 0.3]} s={0.9 * plants + 0.01} i={i} />)}
      {/* la zanja de grava pegada al muro */}
      {gravel > 0.01 && <>
        <mesh position={[0, -0.22 + 0.2 * gravel, 0.32]}><boxGeometry args={[WX1 - WX0, 0.42 * gravel + 0.01, 0.3]} /><meshStandardMaterial color="#6e6a63" roughness={1} /></mesh>
        {Array.from({ length: 120 }, (_, i) => <mesh key={i} position={[WX0 + rnd(i, 1) * 4, -0.02 + 0.03 * rnd(i, 4), 0.18 + rnd(i, 2) * 0.27]} scale={gravel}><dodecahedronGeometry args={[0.025 + rnd(i, 3) * 0.02, 0]} /><meshStandardMaterial color={`hsl(30,6%,${45 + rnd(i, 5) * 25}%)`} roughness={0.9} flatShading /></mesh>)}
      </>}
      {/* el patio de cemento más allá, con la pendiente hacia la casa (o hacia afuera) */}
      <mesh position={[0, -0.01, 2.2]} rotation={[-Math.PI / 2 + 0.03 * (1 - away) - 0.03 * away, 0, 0]} receiveShadow><planeGeometry args={[WX1 - WX0, 2.1]} /><meshStandardMaterial map={tx.concrete} color="#a3a09a" roughness={0.9} /></mesh>
      {Array.from({ length: 30 }, (_, i) => { const on = Math.max(slope, away); if (on < 0.01) return null; const u = (t * 0.35 + i / 30) % 1, dir = away > slope ? 1 : -1; const z = dir > 0 ? 1.3 + u * 1.8 : 3.1 - u * 1.9; return <mesh key={i} position={[WX0 + 0.3 + rnd(i, 1) * 3.4, 0.02, z]}><sphereGeometry args={[0.022, 8, 6]} /><meshStandardMaterial color="#8fd0ff" emissive="#3b8fbf" emissiveIntensity={0.5} transparent opacity={on} /></mesh>; })}
      {/* la canaleta: bajada por la cara de afuera; larga al pie del muro, o con el codo y el caño lejos */}
      <Pipe a={[1.25, WH, ZO + 0.08]} b={[1.25, 0.35, ZO + 0.08]} r={0.04} c="#8c8f91" />
      <Box p={[0, WH + 0.04, ZO + 0.12]} s={[WX1 - WX0, 0.1, 0.14]} c="#8c8f91" m={0.6} r={0.4} rad={0.01} />
      {spoutfix > 0.01 && <><Pipe a={[1.25, 0.35, ZO + 0.08]} b={[1.25, 0.25, ZO + 0.2]} r={0.04} c="#8c8f91" /><Pipe a={[1.25, 0.25, ZO + 0.2]} b={[1.25, 0.12, ZO + 0.2 + 1.9 * spoutfix]} r={0.04} c="#8c8f91" /></>}
      <Drops t={t} on={rain * (1 - spoutfix)} from={[1.25, 0.35, ZO + 0.1]} to={[1.25, soil, ZO + 0.15]} n={26} sp={1.6} />
      <Drops t={t} on={rain * spoutfix} from={[1.25, 0.12, ZO + 2.1]} to={[1.25, -0.02, ZO + 2.3]} n={20} sp={1.6} />
      {rain > 0.01 && Array.from({ length: 70 }, (_, i) => { const u = (t * 1.3 + i / 70) % 1; return <mesh key={i} position={[WX0 + rnd(i, 1) * 4, 3.2 - u * 3.2, 0.5 + rnd(i, 2) * 2.5]}><cylinderGeometry args={[0.003, 0.003, 0.09, 4]} /><meshBasicMaterial color="#cfe6ff" transparent opacity={0.45 * rain} /></mesh>; })}
      {/* la mancha de barro al pie (cuando la canaleta larga ahí) */}
      {rain > 0.01 && spoutfix < 0.5 && <mesh position={[1.25, soil + 0.004, 0.45]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.35, 28]} /><meshStandardMaterial color="#2f2016" roughness={0.25} transparent opacity={0.7 * rain} /></mesh>}
      {/* medidor de agua (caja en la vereda) con la aguja que gira */}
      <group position={PT.meter}>
        <Box p={[0, -0.02, 0]} s={[0.36, 0.06, 0.26]} c="#4a4a48" r={0.7} rad={0.01} />
        {meter > 0.01 && <><mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.08, 30]} /><meshStandardMaterial color="#f2f2ee" /></mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, -t * 2.5 * meter]}><planeGeometry args={[0.012, 0.13]} /><meshBasicMaterial color="#e53935" /></mesh></>}
      </group>
    </ThreeCanvas>
  );
};
