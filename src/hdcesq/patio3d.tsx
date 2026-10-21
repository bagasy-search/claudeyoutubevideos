// hdcesq · EL MUNDO: el patio de Claudio (piso de barro, muro encalado con bugambilia, rosal, romero, la mesa de macetear
// con la guía, la repisa con 10 frascos de esquejes, la ventana de la cocina con EL VASO) y, detrás del muro, el río con el sauce.
// La maceta del frente está EN CORTE: la tierra a la vista y la raíz que crece en timelapse (el portal del video es la tierra).
// UNA escena y UNA cámara; eventos clavados a la voz (segundos globales). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { P } from "./lib";
import { KEYS2, T } from "./plan";
import { Stations } from "./rest3d";

export const FPS = 30, W = 1920, H = 1080;
export const C1 = 68.3; // la guía (cta1): sale del avatar a la mesa
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo ----------------
export const ROSAL: V = [-1.4, 0, -1.6];
export const POT: V = [0.35, 0, 0.25];          // maceta en corte (cara cortada mirando a +z)
export const BENCH: V = [1.6, 0, -2.3];
export const BOOK: V = [1.35, 0.935, -2.2];
export const VASO: V = [-3.0, 1.06, -2.93];
export const WILLOW: V = [3.6, 0, -11.5];
export const ROMERO: V = [3.4, 0, -1.0];
export const PT = {
  rose: [-1.32, 1.28, -1.42] as V,            // la rosa que corta la vecina
  vaso: [VASO[0], VASO[1] + 0.07, VASO[2]] as V,
  vasoTop: [VASO[0], VASO[1] + 0.34, VASO[2]] as V,
  base: [VASO[0], VASO[1] + 0.02, VASO[2]] as V,
  soil: [POT[0], 0.42, POT[2] - 0.05] as V,
  roots: [POT[0], 0.2, POT[2] + 0.01] as V,
  canela: [2.3, 1.0, -2.35] as V, miel: [2.62, 1.02, -2.15] as V, sabila: [1.98, 0.97, -2.02] as V,
  willow: [WILLOW[0], 3.2, WILLOW[2]] as V,
  buga: [2.9, 2.0, -3.1] as V, rosal: [-1.4, 1.1, -1.6] as V, romero: [3.4, 0.95, -1.0] as V,
  shelf: [1.7, 1.42, -3.0] as V,
};
export const JAR = (i: number): V => [0.62 + i * 0.24, 1.36, -3.0];
export const ROT7 = [0, 1, 3, 4, 6, 7, 9]; // los 7 de 10 que se pudren

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
const c = C1;
export const KEYS: Key[] = [
  // A→ "Estás en el patio de tu vecina": del portal del avatar al rosal
  { t: 3.0, p: [0.2, 1.65, 2.2], l: [-1.4, 1.0, -1.6], fov: 40 },
  { t: 5.3, p: [-0.75, 1.35, 0.15], l: [-1.32, 1.2, -1.42], fov: 33 },
  // "Llegas a tu casa… un vaso con agua en la ventana de la cocina"
  { t: 7.5, p: [-0.9, 1.5, 0.4], l: [-2.6, 1.2, -2.6], fov: 38 },
  { t: 9.6, p: [-2.25, 1.4, -1.55], l: [-3.0, 1.2, -2.93], fov: 34, arc: 0.15 },
  { t: 12.6, p: [-2.62, 1.3, -2.3], l: [-3.0, 1.22, -2.93], fov: 32 },
  // timelapse: la cámara casi quieta (los días pasan con la luz)
  { t: 16.9, p: [-2.58, 1.28, -2.24], l: [-3.0, 1.22, -2.93], fov: 31 },
  // 24,6 · después de la toma real: el vaso podrido
  { t: 24.6, p: [-2.6, 1.24, -2.36], l: [-3.0, 1.17, -2.93], fov: 31 },
  { t: 30.85, p: [-2.72, 1.2, -2.5], l: [-3.0, 1.15, -2.93], fov: 30 },
  // "se muere de HONGO": adentro del vaso, en la base del tallo
  { t: 34.95, p: [-2.86, 1.14, -2.7], l: [-3.0, 1.09, -2.93], fov: 26 },
  { t: 36.9, p: [-2.9, 1.13, -2.76], l: [-3.0, 1.088, -2.93], fov: 24 },
  // "¿qué le echas a una rama…?": vuela a la maceta en corte y mira la tierra desde arriba
  { t: 38.15, p: [0.36, 0.95, 0.42], l: [0.35, 0.38, 0.12], fov: 34, arc: 0.25 },
  // (portal: la tierra) "…eche raíz": de frente a la cara cortada, las raíces crecen
  { t: 38.3, p: [0.38, 0.3, 1.05], l: [0.35, 0.22, 0.25], fov: 30 },
  { t: 40.4, p: [0.37, 0.28, 0.85], l: [0.35, 0.21, 0.25], fov: 30 },
  // "tres cosas que ya tienes en la cocina": sube a la mesa de macetear
  { t: 41.1, p: [2.05, 1.5, -0.95], l: [2.2, 0.98, -2.25], fov: 36, arc: 0.2 },
  { t: 43.6, p: [2.1, 1.42, -1.2], l: [2.25, 0.98, -2.25], fov: 34 },
  // "y una que está en la orilla del río": grúa por encima del muro hasta el sauce
  { t: 45.3, p: [2.4, 3.9, -2.4], l: [3.6, 2.0, -11.5], fov: 38 },
  { t: 47.9, p: [2.6, 3.7, -3.6], l: [3.6, 2.0, -11.5], fov: 36 },
  // 52,0 · rosas, bugambilias, romero: el patio entero
  { t: 52.0, p: [0.6, 2.4, 4.4], l: [0.5, 1.0, -1.6], fov: 44 },
  { t: 54.6, p: [0.9, 2.2, 3.6], l: [0.6, 1.0, -1.7], fov: 42 },
  // "el error que mata 7 de cada 10": la repisa de los 10 frascos
  { t: 55.6, p: [1.75, 1.55, -1.45], l: [1.7, 1.36, -3.0], fov: 38, arc: 0.1 },
  { t: 59.6, p: [1.72, 1.5, -1.65], l: [1.7, 1.36, -3.0], fov: 36 },
  // "Soy Claudio, 30 años de jardinero": vuelo de dron sobre el patio
  { t: 60.2, p: [-3.6, 4.8, 5.2], l: [0, 0.6, -1.5], fov: 46 },
  { t: 62.8, p: [2.6, 3.6, 4.6], l: [0.2, 0.7, -1.6], fov: 44 },
  // CTA1 · la mesa con la guía (sale del avatar)
  { t: c, p: [2.1, 1.65, -0.9], l: [1.35, 0.94, -2.2], fov: 40 },
  { t: 74.0, p: [1.62, 1.5, -1.55], l: [1.35, 0.94, -2.2], fov: 35 },
  { t: 77.9, p: [1.42, 1.45, -1.85], l: [1.36, 0.94, -2.21], fov: 32 },
  // (avatar) → el libro abierto en la página 13
  { t: 81.9, p: [1.36, 1.5, -1.98], l: [1.36, 0.94, -2.21], fov: 34 },
  { t: 85.5, p: [1.43, 1.36, -2.03], l: [1.43, 0.94, -2.22], fov: 32 },
  // ramitas / agua / horas: baja sobre la mitad de la página
  { t: 87.8, p: [1.356, 1.31, -2.1], l: [1.356, 0.975, -2.192], fov: 40 },
  { t: 91.3, p: [1.358, 1.3, -2.1], l: [1.356, 0.975, -2.193], fov: 40 },
  // la 15: la hoja pasa, la cámara sube un poco
  { t: 92.3, p: [1.356, 1.36, -2.08], l: [1.356, 0.975, -2.2], fov: 40 },
  { t: 95.5, p: [1.358, 1.31, -2.1], l: [1.356, 0.975, -2.196], fov: 40 },
  // "vamos al rosal" (después del avatar)
  { t: 100.6, p: [1.8, 1.7, -0.6], l: [-1.0, 1.0, -1.6], fov: 40 },
  { t: 101.4, p: [-0.4, 1.4, 0.6], l: [-1.4, 1.05, -1.6], fov: 36 },
];
// minutos 2-16: las poses de las tomas del mundo (plan.ts)
KEYS.push(...(KEYS2 as Key[]).filter((k) => k.t > 101.4));
KEYS.sort((a, b) => a.t - b.t);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  // respiración de cámara en mano (muy suave) para que nunca quede congelada
  p.x += Math.sin(t * 0.7) * 0.004; p.y += Math.sin(t * 0.53 + 1) * 0.003;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
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
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- páginas REALES de la guía (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader();
    const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia");
    let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (tt) => { flip.image = tt.image; flip.needsUpdate = true; if (--n === 0) { bump((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};

// ---------------- texturas procedurales del patio ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const usePatioTex = () => useMemo(() => ({
  // piso de barro cocido (baldosas de 30 cm, cada una de otro tono, junta de cemento)
  tile: mk(512, 512, (g) => {
    g.fillStyle = "#9a8f80"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) {
      const i = r * 4 + q, b = rnd(i, 1);
      g.fillStyle = `rgb(${168 + b * 30},${92 + b * 22},${62 + b * 14})`; g.fillRect(q * 128 + 4, r * 128 + 4, 120, 120);
      for (let k = 0; k < 60; k++) { g.fillStyle = `rgba(${rnd(i * 60 + k, 2) > 0.5 ? "90,40,20" : "230,180,140"},${0.08 + rnd(i * 60 + k, 3) * 0.1})`; g.beginPath(); g.arc(q * 128 + 4 + rnd(i * 60 + k, 4) * 120, r * 128 + 4 + rnd(i * 60 + k, 5) * 120, 1 + rnd(i * 60 + k, 6) * 4, 0, 6.3); g.fill(); }
    }
  }, [12, 12]),
  // muro encalado con manchas de humedad
  wall: mk(512, 256, (g) => {
    g.fillStyle = "#ece4d4"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${150 + rnd(i, 1) * 60},${140 + rnd(i, 1) * 50},${120 + rnd(i, 1) * 40},${0.05 + 0.08 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 512, rnd(i, 4) * 256, 4 + rnd(i, 5) * 22, 0, 6.3); g.fill(); }
    const gr = g.createLinearGradient(0, 200, 0, 256); gr.addColorStop(0, "rgba(120,100,70,0)"); gr.addColorStop(1, "rgba(110,90,60,.35)"); g.fillStyle = gr; g.fillRect(0, 200, 512, 56);
  }, [4, 1]),
  // la tierra en corte: capa de arriba más húmeda, piedritas, perlita, raicillas viejas
  soil: mk(512, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#2a1a10"); gr.addColorStop(0.18, "#3d2818"); gr.addColorStop(0.7, "#4a3220"); gr.addColorStop(1, "#5a3e28");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { const v = rnd(i, 1); g.fillStyle = v < 0.04 ? "rgba(240,236,226,.9)" : v < 0.12 ? `rgba(140,120,100,${0.5 + 0.4 * rnd(i, 7)})` : `rgba(${20 + v * 40},${12 + v * 25},${6 + v * 12},.55)`; g.beginPath(); g.arc(rnd(i, 2) * 512, rnd(i, 3) * 512, v < 0.12 ? 0.8 + rnd(i, 4) * 2 : 0.6 + rnd(i, 5) * 1.6, 0, 6.3); g.fill(); }
  }),
  // muro de ladrillo de la casa vecina / fondo
  brick: mk(256, 256, (g) => {
    g.fillStyle = "#b9b0a2"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) for (let q = 0; q < 5; q++) { const o = (r % 2) * 26, i = r * 5 + q; g.fillStyle = `rgb(${150 + rnd(i, 1) * 40},${78 + rnd(i, 2) * 20},${52 + rnd(i, 3) * 14})`; g.fillRect(q * 52 + o - 52 + 2, r * 32 + 2, 48, 28); g.fillRect(q * 52 + o + 2, r * 32 + 2, 48, 28); }
  }, [6, 2]),
  wood: mk(256, 256, (g) => {
    g.fillStyle = "#8a6440"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(50,30,15,${0.1 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2.5; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(90, y + 4 * rnd(k, 3), 170, y - 4, 256, y + 2); g.stroke(); }
    for (let k = 0; k < 4; k++) { g.fillStyle = "rgba(30,18,8,.6)"; g.fillRect(0, k * 64, 256, 2); }
  }, [2, 1]),
  glow: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Tube: React.FC<{ pts: V[]; r: number; col: string; grow?: number; e?: string; ei?: number; seg?: number }> = ({ pts, r, col, grow = 1, e, ei = 0, seg = 40 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(v3)), seg, r, 6, false), [pts.map((q) => q.join()).join("|"), r, seg]);
  const n = geo.index ? geo.index.count : 0;
  geo.setDrawRange(0, Math.floor((n * cl(grow)) / 36) * 36);
  if (grow <= 0.001) return null;
  return <mesh geometry={geo} castShadow><meshStandardMaterial color={col} roughness={0.7} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};
// hoja: elipsoide aplastado
const Leaf: React.FC<{ p: V; rot: V; s?: number; col: string }> = ({ p, rot, s = 1, col }) => (
  <mesh position={p} rotation={rot} scale={[0.045 * s, 0.006 * s, 0.022 * s]} castShadow><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>
);
// rosa: copa de pétalos en capas
const Rose: React.FC<{ p: V; s?: number; col?: string; petals?: number }> = ({ p, s = 1, col = "#e8578f", petals = 1 }) => (
  <group position={p} scale={s}>
    {Array.from({ length: 12 }, (_, i) => {
      const ring = i < 5 ? 0 : i < 9 ? 1 : 2, a = (i * 2.4) % (Math.PI * 2), rr = [0.012, 0.022, 0.03][ring];
      if (i / 12 > petals) return null;
      return <mesh key={i} position={[Math.cos(a) * rr, 0.012 - ring * 0.006, Math.sin(a) * rr]} rotation={[Math.sin(a) * (0.4 + ring * 0.35), a, Math.cos(a) * (0.4 + ring * 0.35)]} scale={[0.022, 0.026, 0.008]}>
        <sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={new THREE.Color(col).multiplyScalar(1 - ring * 0.12)} roughness={0.55} />
      </mesh>;
    })}
  </group>
);
// maceta de barro cocido
const Pot: React.FC<{ p: V; r: number; h: number; cut?: boolean; soilMap?: Tx }> = ({ p, r, h, cut, soilMap }) => (
  <group position={p}>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[r, r * 0.78, h, 40, 1, !!cut, cut ? Math.PI / 2 : 0, cut ? Math.PI : Math.PI * 2]} /><meshStandardMaterial color="#b4643c" roughness={0.85} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, h - 0.01, 0]} rotation={[-Math.PI / 2, 0, cut ? 0 : 0]}><torusGeometry args={[r + 0.012, 0.022, 10, 48, cut ? Math.PI : Math.PI * 2]} /><meshStandardMaterial color="#a85a35" roughness={0.85} /></mesh>
    {/* tierra arriba */}
    <mesh position={[0, h - 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>{cut ? <circleGeometry args={[r - 0.01, 40, 0, Math.PI]} /> : <circleGeometry args={[r - 0.01, 40]} />}<meshStandardMaterial color="#3a2616" roughness={1} map={soilMap} /></mesh>
    {/* la cara cortada: tierra en corte (trapecio) */}
    {cut && <mesh position={[0, 0, 0]}>
      <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-r * 0.78 + 0.01, 0.01); s.lineTo(r * 0.78 - 0.01, 0.01); s.lineTo(r - 0.012, h - 0.04); s.lineTo(-r + 0.012, h - 0.04); s.closePath(); return s; })()]} />
      <meshStandardMaterial map={soilMap} roughness={1} color="#d8c8b8" />
    </mesh>}
    {cut && <>
      {/* canto de barro de la pared cortada (se ve el grosor) */}
      {[-1, 1].map((sx) => <mesh key={sx} position={[sx * (r * 0.89), h / 2, 0]} rotation={[0, 0, sx * -0.25]}><boxGeometry args={[0.024, h, 0.004]} /><meshStandardMaterial color="#c97a50" roughness={0.9} /></mesh>)}
    </>}
  </group>
);

// raíces deterministas (coordenadas de la maceta en corte, delante de la cara cortada)
const ROOTS: V[][] = Array.from({ length: 16 }, (_, i) => {
  const pts: V[] = []; let x = (rnd(i, 1) - 0.5) * 0.02, y = 0.24, z = 0.006 + rnd(i, 9) * 0.01;
  const dir = (rnd(i, 2) - 0.5) * 2.2, len = 0.12 + rnd(i, 3) * 0.12;
  for (let k = 0; k < 9; k++) { pts.push([x, y, z]); x += dir * 0.012 * (1 - k / 14) + (rnd(i * 9 + k, 4) - 0.5) * 0.01; y -= len / 9 * (0.7 + 0.5 * rnd(i * 9 + k, 5)); }
  return pts;
});
const HAIRS: { root: number; at: number; pts: V[] }[] = Array.from({ length: 40 }, (_, i) => {
  const ri = i % 16, k = 2 + Math.floor(rnd(i, 1) * 6), b = ROOTS[ri][k], d = rnd(i, 2) > 0.5 ? 1 : -1;
  return { root: ri, at: k / 9, pts: [b, [b[0] + d * 0.012, b[1] - 0.008, b[2]], [b[0] + d * 0.026, b[1] - 0.012 - rnd(i, 3) * 0.01, b[2]]] };
});
// hifas del hongo en la base del tallo (adentro del vaso)
const HYPHAE: V[][] = Array.from({ length: 90 }, (_, i) => {
  const a = rnd(i, 1) * Math.PI * 2, y0 = 0.005 + rnd(i, 2) * 0.045, L = 0.012 + rnd(i, 3) * 0.03;
  return [0, 0.35, 0.7, 1].map((k) => [Math.cos(a + k * (rnd(i, 4) - 0.5)) * (0.0035 + L * k), y0 + (rnd(i, 5) - 0.5) * 0.012 * k, Math.sin(a + k * (rnd(i, 4) - 0.5)) * (0.0035 + L * k)] as V);
});

// LA GUÍA: libro de tapa dura (proporción carta), tapa con bisagra, hoja que pasa con curva
const PAPER = "#b3ada3";
const Sheet: React.FC<{ ang: number; w: number; d: number; front?: Tx; back?: Tx }> = ({ ang, w, d, front, back }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, 0.001, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color={PAPER} roughness={0.92} map={back} envMapIntensity={0.2} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color={PAPER} roughness={0.92} map={front} envMapIntensity={0.2} /></mesh>
    </group>
  );
};
export const BW = 0.3, BD = 0.388;
export const pageAt = (u: number, v: number): V => [BOOK[0] + 0.004 + (u - 0.5) * (BW - 0.01), BOOK[1] + 0.046, BOOK[2] + (v - 0.5) * (BD - 0.012)];
const Book: React.FC<{ p: V; open: number; cover: THREE.Texture; inside: THREE.Texture; right: THREE.Texture; spine: string; flips?: { k: number; tex: [THREE.Texture, THREE.Texture] }[] }> = ({ p, open, cover, inside, right, spine, flips = [] }) => {
  const w = BW, d = BD, th = 0.034;
  const ang = Math.PI * ease(open);
  return (
    <group position={p}>
      <Box p={[0, 0.003, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.55} rad={0.003} />
      <mesh position={[0.004, 0.006 + th / 2, 0]} castShadow receiveShadow><boxGeometry args={[w - 0.004, th, d - 0.006]} /><meshStandardMaterial color="#c4bcab" roughness={0.95} /></mesh>
      <mesh position={[0.004, 0.0065 + th, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w - 0.01, d - 0.012]} /><meshStandardMaterial map={right} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
      <Box p={[-w / 2 - 0.004, 0.006 + th / 2, 0]} s={[0.012, th + 0.014, d + 0.012]} c={spine} r={0.5} rad={0.005} />
      {flips.filter((f) => f.k > 0.001 && f.k < 0.999).map((f, i) => <group key={i} position={[-w / 2 + 0.006, 0.007 + th + i * 0.0008, 0]}><Sheet ang={Math.PI * ease(f.k)} w={w - 0.012} d={d - 0.014} front={f.tex[0]} back={f.tex[1]} /></group>)}
      <group position={[-w / 2, 0.006 + th + 0.004, 0]} rotation={[0, 0, ang]}>
        <group position={[w / 2 + 0.006, 0, 0]}>
          <Box p={[0, 0, 0]} s={[w + 0.012, 0.006, d + 0.012]} c={spine} r={0.45} rad={0.003} />
          <mesh position={[0, 0.0032, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w + 0.008, d + 0.008]} /><meshStandardMaterial map={cover} roughness={0.38} metalness={0.05} /></mesh>
          <mesh position={[0, -0.0032, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[w - 0.006, d - 0.01]} /><meshStandardMaterial map={inside} color={PAPER} roughness={0.92} envMapIntensity={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
};

// el esqueje del vaso: tallo que se dobla, hojas que se caen, base que se pudre
const Cutting: React.FC<{ t: number; bend: number; rot: number; petals: number; wilt: number }> = ({ t, bend, rot, petals, wilt }) => {
  const pts: V[] = Array.from({ length: 7 }, (_, k) => { const s = k / 6; return [Math.sin(s * s * 1.6) * 0.03 * bend + s * 0.008, 0.008 + s * 0.31 - s * s * 0.06 * bend, Math.sin(s * 3) * 0.004] as V; });
  const top = pts[6];
  const green = new THREE.Color("#4f7a2e").lerp(new THREE.Color("#6b5a2a"), wilt);
  const leafC = "#" + new THREE.Color("#3f7a32").lerp(new THREE.Color("#7a6a30"), wilt).getHexString();
  return (
    <group>
      <Tube pts={pts} r={0.0042} col={"#" + green.getHexString()} seg={30} />
      {/* base podrida: manguito negro brillante que sube con los días */}
      {rot > 0.01 && <mesh position={[0.0005, 0.008 + 0.02 * rot, 0]}><cylinderGeometry args={[0.0058, 0.0064, 0.045 * rot, 12]} /><meshStandardMaterial color="#120c08" roughness={0.25} metalness={0.1} /></mesh>}
      {[[0.55, 0.8], [0.7, -1.2], [0.84, 2.4]].map(([s, a], i) => { const q = pts[Math.round(s * 6)]; return <Leaf key={i} p={[q[0] + Math.cos(a) * 0.02, q[1] - 0.012 * wilt, q[2] + Math.sin(a) * 0.02]} rot={[0, -a, -0.35 - wilt * 0.55]} s={0.75 - 0.12 * wilt} col={leafC} />; })}
      {petals > 0.02 && <Rose p={[top[0], top[1] + 0.012, top[2]]} s={1.05 - 0.15 * (1 - petals)} petals={petals} col="#e86a9a" />}
      {/* pétalos que cayeron al alféizar */}
      {petals < 0.98 && Array.from({ length: 5 }, (_, i) => {
        const fall = cl((1 - petals) * 1.3 - i * 0.06), y = lerp(top[1] + 0.01, -0.058 + i * 0.0005, ease(fall));
        return <mesh key={i} position={[top[0] + 0.03 + i * 0.016 * fall, y, 0.045 + (rnd(i, 2) - 0.5) * 0.05 * fall]} rotation={[-Math.PI / 2 + (1 - fall) * 1.2, rnd(i, 3) * 6, 0]} scale={[0.02, 0.016, 0.003]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={new THREE.Color("#e86a9a").lerp(new THREE.Color("#8a4a3a"), fall * 0.6)} roughness={0.6} /></mesh>;
      })}
      {t < 0 && null}
    </group>
  );
};

// follaje instanciado: miles de hojas/brácteas en una sola malla
type It = { p: V; r: V; s: V; c: string };
const Inst: React.FC<{ items: It[]; geo: THREE.BufferGeometry; mat: THREE.Material; shadow?: boolean }> = ({ items, geo, mat, shadow = true }) => {
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geo, mat, items.length); const o = new THREE.Object3D(); const col = new THREE.Color();
    items.forEach((it, i) => { o.position.set(...it.p); o.rotation.set(...it.r); o.scale.set(...it.s); o.updateMatrix(); m.setMatrixAt(i, o.matrix); m.setColorAt(i, col.set(it.c)); });
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.castShadow = shadow; m.receiveShadow = true; return m;
  }, [items, geo, mat]);
  return <primitive object={mesh} />;
};
const SPH = new THREE.SphereGeometry(1, 8, 6);
// hoja con punta (forma de hoja de rosal/bugambilia), plana con un poco de curva
const LEAFG = (() => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(0.5, 0.42, 1, 0); sh.quadraticCurveTo(0.5, -0.42, 0, 0); const g = new THREE.ShapeGeometry(sh, 6); const pos = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, -Math.abs(y) * 0.5 + x * (1 - x) * 0.15); } g.computeVertexNormals(); return g; })();
const leafMat = new THREE.MeshStandardMaterial({ roughness: 0.55, side: THREE.DoubleSide });
const bractMat = new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide });

// el sauce: tiras colgantes de hojitas (textura con transparencia) + copa
const useStrandTex = () => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = 64; cv.height = 512; const g = cv.getContext("2d")!;
  g.strokeStyle = "#5d6a2a"; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 0); g.bezierCurveTo(30, 170, 35, 340, 32, 512); g.stroke();
  for (let k = 0; k < 70; k++) { const y = 6 + k * 7.2, sd = k % 2 ? 1 : -1, l = 14 + rnd(k, 1) * 10;
    g.fillStyle = `rgb(${110 + rnd(k, 2) * 40},${150 + rnd(k, 3) * 40},${60 + rnd(k, 4) * 30})`; g.save(); g.translate(32, y); g.rotate(sd * (0.5 + rnd(k, 5) * 0.3) + Math.PI / 2);
    g.beginPath(); g.ellipse(l / 2, 0, l / 2, 3.2, 0, 0, 6.3); g.fill(); g.restore(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);
const Willow: React.FC<{ p: V }> = ({ p }) => {
  const tex = useStrandTex();
  const strands = useMemo(() => Array.from({ length: 340 }, (_, i) => { const a = rnd(i, 1) * Math.PI * 2, r = 0.3 + Math.sqrt(rnd(i, 2)) * 2.8; return { x: Math.cos(a) * r, z: Math.sin(a) * r, y: 5.0 + rnd(i, 3) * 0.9 - r * r * 0.12, L: 2.4 + rnd(i, 4) * 2.4, ry: rnd(i, 5) * 3.14, c: rnd(i, 6) }; }), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.4, transparent: false, side: THREE.DoubleSide, roughness: 0.8 }), [tex]);
  return (
    <group position={p}>
      <mesh position={[0, 1.7, 0]} rotation={[0, 0, 0.08]} castShadow><cylinderGeometry args={[0.22, 0.4, 3.6, 12]} /><meshStandardMaterial color="#5a4a38" roughness={1} /></mesh>
      {[[-0.8, 3.8, 0.3], [0.9, 4.0, -0.2], [0.1, 4.4, 0.6]].map((q, i) => <mesh key={i} position={q as V} rotation={[0.3 * i, 0, (i - 1) * 0.7]}><cylinderGeometry args={[0.07, 0.14, 1.8, 8]} /><meshStandardMaterial color="#5a4a38" roughness={1} /></mesh>)}
      {[[0, 5.3, 0, 2.0], [-1.2, 4.9, 0.6, 1.5], [1.3, 5.0, -0.4, 1.6], [0.3, 4.8, 1.4, 1.4]].map(([x, y, z, r], i) => <mesh key={"c" + i} position={[x, y, z]} scale={[r, r * 0.5, r]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#7f9a3c" roughness={0.9} /></mesh>)}
      {strands.map((s, i) => <mesh key={i} position={[s.x, s.y - s.L / 2, s.z]} rotation={[0, s.ry, 0]} castShadow material={mat}><planeGeometry args={[0.16, s.L]} /></mesh>)}
    </group>
  );
};

// bugambilia trepando el muro: tronco retorcido + racimos de brácteas fucsia pegados al muro
const Bugambilia: React.FC<{ x0: number; x1: number; z: number }> = ({ x0, x1, z }) => {
  const items = useMemo(() => {
    const out: It[] = [], lv: It[] = [];
    for (let c = 0; c < 38; c++) {
      const cx = lerp(x0, x1, rnd(c, 1)), cy = 1.0 + rnd(c, 2) * 1.6 + Math.sin(cx * 2) * 0.12, cz = z + 0.16 + rnd(c, 3) * 0.12, R = 0.16 + rnd(c, 4) * 0.12;
      for (let k = 0; k < 110; k++) { const i = c * 110 + k, a = rnd(i, 5) * 6.28, b = rnd(i, 6) * 6.28, rr = R * Math.cbrt(rnd(i, 7));
        const p: V = [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8, cz + Math.sin(b) * rr * 0.4];
        if (rnd(i, 8) < 0.3) lv.push({ p, r: [rnd(i, 9) * 6, rnd(i, 10) * 6, rnd(i, 11) * 6], s: [0.06, 0.06, 0.06], c: rnd(i, 12) > 0.5 ? "#3f6e2a" : "#4f7f33" });
        else out.push({ p, r: [rnd(i, 9) * 6, rnd(i, 10) * 6, rnd(i, 11) * 6], s: [0.042, 0.042, 0.042], c: "#" + new THREE.Color("#c21a72").lerp(new THREE.Color("#f25cb2"), rnd(i, 13)).getHexString() }); }
    }
    return { out, lv };
  }, [x0, x1, z]);
  return (
    <group>
      <Tube pts={[[x0 + 0.4, 0, z + 0.06], [x0 + 0.5, 0.8, z + 0.08], [x0 + 0.3, 1.5, z + 0.07], [x0 + 1.0, 2.1, z + 0.08], [x1 - 0.2, 2.5, z + 0.07]]} r={0.035} col="#6a5440" />
      <Inst items={items.out} geo={LEAFG} mat={bractMat} />
      <Inst items={items.lv} geo={LEAFG} mat={leafMat} />
    </group>
  );
};

// romero en maceta: ramitas verticales grisáceas con florcitas lilas
const Romero: React.FC<{ p: V }> = ({ p }) => (
  <group position={p}>
    <Pot p={[0, 0, 0]} r={0.26} h={0.42} />
    {Array.from({ length: 140 }, (_, i) => { const a = rnd(i, 1) * 6.28, r = Math.sqrt(rnd(i, 2)) * 0.22, L = 0.3 + rnd(i, 3) * 0.45;
      return <group key={i} position={[Math.cos(a) * r, 0.4 + L / 2, Math.sin(a) * r]} rotation={[(rnd(i, 4) - 0.5) * 0.5, 0, (rnd(i, 5) - 0.5) * 0.5]}>
        <mesh><cylinderGeometry args={[0.006, 0.01, L, 5]} /><meshStandardMaterial color={new THREE.Color("#4d6b4a").lerp(new THREE.Color("#7a9474"), rnd(i, 6))} roughness={0.8} /></mesh>
        {rnd(i, 7) > 0.6 && <mesh position={[0, L / 2, 0]}><sphereGeometry args={[0.014, 6, 5]} /><meshStandardMaterial color="#a99be0" roughness={0.6} /></mesh>}
      </group>; })}
  </group>
);

// el rosal: tallos con espinas, follaje denso instanciado y siete rosas
const Rosal: React.FC<{ p: V; t: number }> = ({ p }) => {
  const d = useMemo(() => {
    const stems = Array.from({ length: 13 }, (_, i) => { const a = (i / 13) * 6.28 + rnd(i, 1) * 0.5, r = 0.12 + rnd(i, 2) * 0.2, L = 0.55 + rnd(i, 3) * 0.6;
      return [[Math.cos(a) * 0.04, 0.48, Math.sin(a) * 0.04], [Math.cos(a) * r * 0.5, 0.48 + L * 0.45, Math.sin(a) * r * 0.5], [Math.cos(a) * r, 0.48 + L, Math.sin(a) * r]] as V[]; });
    const lv: It[] = [];
    stems.forEach((s, i) => { for (let k = 0; k < 26; k++) { const j = i * 26 + k, u = 0.25 + rnd(j, 1) * 0.72, q = s[1], q2 = s[2], q0 = s[0];
      const x = u < 0.5 ? lerp(q0[0], q[0], u * 2) : lerp(q[0], q2[0], (u - 0.5) * 2), y = u < 0.5 ? lerp(q0[1], q[1], u * 2) : lerp(q[1], q2[1], (u - 0.5) * 2), z = u < 0.5 ? lerp(q0[2], q[2], u * 2) : lerp(q[2], q2[2], (u - 0.5) * 2);
      const a = rnd(j, 2) * 6.28, o = 0.02 + rnd(j, 3) * 0.06;
      lv.push({ p: [x + Math.cos(a) * o, y + (rnd(j, 4) - 0.5) * 0.04, z + Math.sin(a) * o], r: [-0.4 + rnd(j, 5) * 0.8, -a, -0.3 - rnd(j, 6) * 0.5], s: [0.055 + rnd(j, 7) * 0.02, 0.055, 0.055], c: rnd(j, 8) > 0.5 ? "#2f5e26" : "#3c7330" }); } });
    return { stems, lv };
  }, []);
  return (
    <group position={p}>
      <Pot p={[0, 0, 0]} r={0.34} h={0.52} />
      {d.stems.map((s, i) => <Tube key={i} pts={s} r={0.007} col="#4a6a2a" seg={16} />)}
      <Inst items={d.lv} geo={LEAFG} mat={leafMat} />
      {d.stems.map((s, i) => i % 2 === 0 ? <Rose key={"r" + i} p={[s[2][0], s[2][1] + 0.02, s[2][2]]} s={1.6} col={["#e84a7f", "#f06b9a", "#d93a6e"][i % 3]} /> : null)}
    </group>
  );
};

// ===================================================================================================
// geranio en maceta: bola de hojas + racimos de flores
const Geranio: React.FC<{ p: V; s?: number; col?: string; seed?: number }> = ({ p, s: sc = 1, col = "#d8232f", seed = 1 }) => {
  const d = useMemo(() => {
    const lv: It[] = [], fl: It[] = [];
    for (let i = 0; i < 70; i++) { const j = seed * 100 + i, a = rnd(j, 1) * 6.28, r = Math.sqrt(rnd(j, 2)) * 0.2; lv.push({ p: [Math.cos(a) * r, 0.36 + rnd(j, 3) * 0.16, Math.sin(a) * r], r: [-1.2 + rnd(j, 4) * 0.6, a, 0], s: [0.06, 0.05, 0.05], c: rnd(j, 5) > 0.5 ? "#3d6e2c" : "#4c7f36" }); }
    for (let c = 0; c < 6; c++) { const j = seed * 100 + c, a = rnd(j, 6) * 6.28, r = 0.08 + rnd(j, 7) * 0.12;
      for (let k = 0; k < 16; k++) { const q = j * 16 + k; fl.push({ p: [Math.cos(a) * r + (rnd(q, 8) - 0.5) * 0.05, 0.56 + rnd(j, 9) * 0.08 + (rnd(q, 10) - 0.5) * 0.04, Math.sin(a) * r + (rnd(q, 11) - 0.5) * 0.05], r: [0, 0, 0], s: [0.013, 0.013, 0.013], c: col }); } }
    return { lv, fl };
  }, [seed, col]);
  return <group position={p} scale={sc}><Pot p={[0, 0, 0]} r={0.2} h={0.32} /><Inst items={d.lv} geo={LEAFG} mat={leafMat} /><Inst items={d.fl} geo={SPH} mat={bractMat} /></group>;
};
// sábila en maceta: roseta de hojas carnosas
const Aloe: React.FC<{ p: V; s?: number }> = ({ p, s: sc = 1 }) => (
  <group position={p} scale={sc}>
    <Pot p={[0, 0, 0]} r={0.2} h={0.3} />
    {Array.from({ length: 16 }, (_, i) => { const a = i * 2.4, tilt = 0.25 + (i % 4) * 0.18, L = 0.32 + (i % 3) * 0.08;
      return <group key={i} position={[0, 0.3, 0]} rotation={[0, a, 0]}><mesh position={[Math.sin(tilt) * L / 2, Math.cos(tilt) * L / 2, 0]} rotation={[0, 0, -tilt]} scale={[0.035, L / 2, 0.016]} castShadow><coneGeometry args={[1, 2, 8]} /><meshStandardMaterial color={i % 2 ? "#6f9a58" : "#5f8a4c"} roughness={0.45} /></mesh></group>; })}
  </group>
);
const Cactus: React.FC<{ p: V }> = ({ p }) => (
  <group position={p}>
    <Pot p={[0, 0, 0]} r={0.16} h={0.26} />
    <mesh position={[0, 0.55, 0]} castShadow><capsuleGeometry args={[0.07, 0.5, 6, 12]} /><meshStandardMaterial color="#4f7a3e" roughness={0.6} /></mesh>
    <mesh position={[0.1, 0.62, 0]} rotation={[0, 0, -0.5]} castShadow><capsuleGeometry args={[0.045, 0.18, 6, 10]} /><meshStandardMaterial color="#4f7a3e" roughness={0.6} /></mesh>
  </group>
);
// regadera de lámina verde
const Regadera: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.14, 0]} castShadow><cylinderGeometry args={[0.11, 0.13, 0.28, 24]} /><meshStandardMaterial color="#3f7a5a" metalness={0.6} roughness={0.35} /></mesh>
    <Tube pts={[[0.1, 0.06, 0], [0.22, 0.18, 0], [0.34, 0.3, 0]]} r={0.016} col="#3f7a5a" seg={10} />
    <mesh position={[0.35, 0.31, 0]} rotation={[0, 0, -0.8]}><cylinderGeometry args={[0.035, 0.02, 0.05, 14]} /><meshStandardMaterial color="#2f5a42" metalness={0.6} roughness={0.4} /></mesh>
    <mesh position={[-0.02, 0.3, 0]}><torusGeometry args={[0.09, 0.012, 8, 20, Math.PI]} /><meshStandardMaterial color="#2f5a42" metalness={0.6} roughness={0.4} /></mesh>
  </group>
);
// helecho colgado de la pared
const Helecho: React.FC<{ p: V }> = ({ p }) => {
  const fr = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ a: i * 2.4, droop: 0.4 + rnd(i, 1) * 0.9, L: 0.25 + rnd(i, 2) * 0.2 })), []);
  return (
    <group position={p}>
      <Tube pts={[[0, 0.55, -0.12], [0, 0.6, 0], [0, 0.18, 0]]} r={0.004} col="#333" seg={8} />
      <Pot p={[0, 0, 0]} r={0.14} h={0.18} />
      {fr.map((f, i) => <group key={i} position={[0, 0.17, 0]} rotation={[0, f.a, 0]}><mesh geometry={LEAFG} position={[0, -f.L * f.droop * 0.3, 0]} rotation={[0, 0, -f.droop]} scale={[f.L, 0.06 / 0.42 * 0.5, 0.06]}><meshStandardMaterial color={i % 2 ? "#5e9a3a" : "#4d8a30"} side={THREE.DoubleSide} roughness={0.6} /></mesh></group>)}
    </group>
  );
};
// casas del barrio que asoman por encima de las bardas (block, techo plano, tinaco) y árboles
const VEC: number[][] = [[-9.5, -1, 0], [-10, 5.5, 1], [-8.5, -8.5, 2], [9.5, 1.5, 3], [10, -8, 4], [0, -21, 5], [-6, -21, 6], [7, -20, 7]];
const Vecinos: React.FC<{ wall?: Tx }> = ({ wall }) => (
  <group>
    {VEC.map(([x, z, i]) => {
      const h = 3.2 + (i % 3) * 1.1, tint = ["#e8d7bd", "#d9c3a0", "#c9d6cf", "#e2c8b6", "#d6cdb8", "#efe0c8", "#cdbfa8", "#d8d0c0"][i];
      return <group key={i} position={[x, 0, z]}>
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow><boxGeometry args={[5, h, 5]} /><meshStandardMaterial color={tint} map={wall} roughness={0.95} /></mesh>
        <mesh position={[0, h + 0.15, 0]}><boxGeometry args={[5.2, 0.3, 5.2]} /><meshStandardMaterial color="#8a7a6a" roughness={1} /></mesh>
        <mesh position={[1.2 - (i % 2) * 2.4, h + 0.75, 1]} castShadow><cylinderGeometry args={[0.45, 0.5, 0.9, 18]} /><meshStandardMaterial color={i % 2 ? "#1d1f22" : "#2d4f7a"} roughness={0.6} /></mesh>
      </group>;
    })}
    {[[-7, -5], [8, 6], [6.5, -15], [-12, -14], [13, -2]].map(([x, z], i) => <group key={"tr" + i} position={[x, 0, z]}>
      <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.15, 0.22, 3.2, 8]} /><meshStandardMaterial color="#5a4a38" /></mesh>
      <mesh position={[0, 4.0, 0]} scale={[1.9, 1.6, 1.9]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={["#4f6e2e", "#5d7f34", "#46652a"][i % 3]} roughness={1} /></mesh>
    </group>)}
  </group>
);
// cielo: domo con degradé y nubes suaves
const SkyDome: React.FC<{ sun: number }> = ({ sun }) => {
  const tex = useMemo(() => { const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 512; const g = cv.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#4f8fd0"); gr.addColorStop(0.42, "#9cc6ec"); gr.addColorStop(0.5, "#e8eef0"); gr.addColorStop(1, "#c9c2b0"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 40; i++) { const x = rnd(i, 1) * 1024, y = 60 + rnd(i, 2) * 160, r = 30 + rnd(i, 3) * 70; const cg = g.createRadialGradient(x, y, 0, x, y, r * 1.8); cg.addColorStop(0, "rgba(255,255,255,.5)"); cg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = cg; g.beginPath(); g.ellipse(x, y, r * 1.8, r * 0.6, 0, 0, 6.3); g.fill(); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  return <mesh><sphereGeometry args={[150, 48, 24]} /><meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} color={new THREE.Color("#ffffff").multiplyScalar(0.25 + 0.75 * sun)} toneMapped={false} /></mesh>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = usePatioTex();
  const pg = useImgTex(["p001", "p012", "p013", "p014", "p015", "p016", "p017", "p030"]);
  // timelapse de los días en el vaso (12,7-16,9 y 20,4-24,7): la luz late día/noche
  const tl = (t > 12.6 && t < 16.95) || (t > 20.4 && t < 24.7);
  const dayPh = tl ? 0.5 + 0.5 * Math.cos(((t - 12.6) / 1.35) * Math.PI * 2) : 1;
  const sun = 0.25 + 0.75 * dayPh;
  // estados del esqueje del vaso
  const petals = 1 - win(t, 13.75, 14.35);
  const bend = win(t, 15.8, 16.55);
  const rot = win(t, 17.5, 21.0);
  const wilt = win(t, 15.6, 21.5) * 0.85;
  const murk = win(t, 17.0, 21.0);
  const fungus = win(t, 35.1, 36.9);
  // la raíz en la maceta en corte (timelapse "eche raíz")
  const rootK = t < 38.2 ? 0 : win(t, 38.4, 40.3);
  // cosas de la cocina que aparecen en la mesa
  const pop = (a: number) => Math.min(1.12, Math.max(0, 1 - Math.exp(-Math.max(0, t - a) * 7) * Math.cos(Math.max(0, t - a) * 12)));
  const kCan = pop(41.36), kMiel = pop(41.9), kSab = pop(42.45);
  // los 10 frascos: 7 se pudren
  const rot7 = t < 200 ? win(t, 56.7, 57.9) : win(t, T.diez + 0.6, T.diez + 1.8);
  const rotSet = t < 200 ? ROT7 : [2, 5, 8]; // en el resto: de 10 bien hechos se pierden 3
  // la guía: se abre (tapado por el avatar) y pasa a la 15
  const open = win(t, 79.5, 80.6);
  const flip15 = cl((t - 91.55) / 0.6);
  const flip30 = t > 600 ? cl((t - T.pag30 + 0.3) / 0.6) : 0;
  const skyC = new THREE.Color("#0c1526").lerp(new THREE.Color("#a9cbe8"), sun);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35} threshold={0.92} exposure={0.85 + 0.25 * sun} env={0.25 + 0.2 * sun} />
      <color attach="background" args={[skyC.getHex()]} />
      <fogExp2 attach="fog" args={[skyC.getHex(), 0.018]} />
      <hemisphereLight args={[new THREE.Color("#cfe2ff").multiplyScalar(0.4 + 0.6 * sun).getHex(), 0x5a4632, 0.55 + 0.4 * sun]} />
      <directionalLight position={tl ? [Math.cos(((t - 12.6) / 1.35) * Math.PI) * 14, 16 * (0.3 + 0.7 * dayPh), 10] : [8, 15, 9]} intensity={0.4 + 2.4 * sun} color="#ffe2b8" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} />

      {/* piso de barro y muro encalado (con la ventana de la cocina a la izquierda) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 12]} /><meshStandardMaterial color="#d8b49a" roughness={0.9} map={tx.tile} /></mesh>
      <Box p={[0.4, 1.25, -3.3]} s={[10, 2.5, 0.22]} c="#f3ece0" r={0.95} map={tx.wall} rad={0.02} />
      <Box p={[0.4, 2.55, -3.3]} s={[10.1, 0.1, 0.3]} c="#b86a42" r={0.8} />
      <Box p={[-4.7, 1.25, -0.4]} s={[0.22, 2.5, 6]} c="#f0e8db" r={0.95} map={tx.wall} />
      {/* ventana de la cocina con su alféizar de azulejo blanco */}
      <group position={[-3.0, 0, -3.18]}>
        <Box p={[0, 1.6, 0.02]} s={[1.0, 1.0, 0.06]} c="#2c4a5c" r={0.3} m={0.2} />
        <mesh position={[0, 1.6, 0.06]}><planeGeometry args={[0.9, 0.9]} /><meshStandardMaterial color="#9fc4d8" roughness={0.1} metalness={0.4} emissive="#4a6a7a" emissiveIntensity={0.15} /></mesh>
        <Box p={[0, 1.6, 0.07]} s={[0.04, 0.92, 0.03]} c="#f1ece4" r={0.6} />
        <Box p={[0, 1.6, 0.07]} s={[0.92, 0.04, 0.03]} c="#f1ece4" r={0.6} />
        <Box p={[0, 1.04, 0.18]} s={[1.2, 0.05, 0.32]} c="#f4f2ee" r={0.3} rad={0.01} />
      </group>
      {/* EL VASO con el esqueje */}
      <group position={VASO}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.042, 0.036, 0.12, 28, 1, true]} /><meshPhysicalMaterial color="#e8f4ff" roughness={0.05} transmission={0} transparent opacity={0.22} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.036, 28]} /><meshStandardMaterial color="#dfe9ef" transparent opacity={0.4} /></mesh>
        <mesh position={[0, 0.042, 0]}><cylinderGeometry args={[0.039, 0.035, 0.08, 28]} /><meshStandardMaterial color={new THREE.Color("#cfe6f5").lerp(new THREE.Color("#8a7228"), murk)} transparent opacity={0.28 + 0.6 * murk} roughness={0.1} depthWrite={false} /></mesh>
        <Cutting t={t} bend={bend} rot={rot} petals={petals} wilt={wilt} />
        {/* hifas del hongo alrededor de la base */}
        {fungus > 0.01 && HYPHAE.map((h, i) => <Tube key={i} pts={h} r={0.0007} col="#e6e2d6" grow={cl(fungus * 1.4 - (i % 7) * 0.05)} e="#cfc8b0" ei={0.25} seg={12} />)}
        {fungus > 0.01 && Array.from({ length: 14 }, (_, i) => <mesh key={"f" + i} position={[(rnd(i, 1) - 0.5) * 0.014, 0.008 + rnd(i, 2) * 0.045, (rnd(i, 3) - 0.5) * 0.014]} scale={0.006 + 0.008 * rnd(i, 4) * fungus}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#efeadf" transparent opacity={0.5 * fungus} roughness={1} depthWrite={false} /></mesh>)}
      </group>

      {/* la bugambilia sobre el muro, el rosal, el romero */}
      <Bugambilia x0={3.05} x1={5.1} z={-3.2} />
      <Rosal p={ROSAL} t={t} />
      <Romero p={ROMERO} />

      {/* LA MESA DE MACETEAR + repisa con los 10 frascos */}
      <group>
        <Box p={[BENCH[0], 0.88, BENCH[2]]} s={[2.4, 0.06, 0.8]} c="#9a7048" r={0.8} map={tx.wood} rad={0.01} />
        {[[-1.1, -0.32], [1.1, -0.32], [-1.1, 0.32], [1.1, 0.32]].map(([x, z], i) => <Box key={i} p={[BENCH[0] + x, 0.43, BENCH[2] + z]} s={[0.07, 0.86, 0.07]} c="#6e4c2e" />)}
        <Box p={[BENCH[0], 0.25, BENCH[2]]} s={[2.25, 0.03, 0.7]} c="#8a6440" map={tx.wood} />
        {/* bolsas de tierra y macetitas abajo */}
        <Box p={[BENCH[0] - 0.6, 0.42, BENCH[2]]} s={[0.5, 0.3, 0.35]} c="#5b4a36" r={0.95} rad={0.06} />
        {[0, 1, 2].map((i) => <Pot key={i} p={[BENCH[0] + 0.2 + i * 0.28, 0.28, BENCH[2] + 0.05]} r={0.09} h={0.12} />)}
        {/* repisa */}
        <Box p={[1.75, 1.3, -3.08]} s={[2.7, 0.04, 0.26]} c="#8a6440" map={tx.wood} rad={0.008} />
        {Array.from({ length: 10 }, (_, i) => {
          const j = JAR(i), bad = rotSet.includes(i), k = bad ? rot7 : 0;
          const stem = "#" + new THREE.Color("#4f7a2e").lerp(new THREE.Color("#140d08"), k).getHexString();
          const lc = "#" + new THREE.Color("#3f7a32").lerp(new THREE.Color("#5a4a26"), k).getHexString();
          return <group key={i} position={j}>
            <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.045, 0.045, 0.14, 20, 1, true]} /><meshStandardMaterial color="#e8f4ff" transparent opacity={0.22} roughness={0.05} side={THREE.DoubleSide} /></mesh>
            <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.042, 0.042, 0.09, 20]} /><meshStandardMaterial color={new THREE.Color("#cfe6f5").lerp(new THREE.Color("#6d6a32"), k)} transparent opacity={0.3 + 0.4 * k} depthWrite={false} /></mesh>
            <Tube pts={[[0, 0.01, 0], [0.004, 0.14, 0], [0.01 + 0.03 * k, 0.26 - 0.05 * k, 0]]} r={0.004} col={stem} seg={10} />
            {[0, 1].map((q) => <Leaf key={q} p={[q ? 0.02 : -0.02, 0.22 - 0.04 * k, 0.005]} rot={[0, q * 3.1, -0.5 - k * 0.9]} s={0.9} col={lc} />)}
            {!bad && Array.from({ length: 5 }, (_, q) => <Tube key={"r" + q} pts={[[0, 0.03, 0], [Math.cos(q * 1.3) * 0.014, 0.018, Math.sin(q * 1.3) * 0.014], [Math.cos(q * 1.3) * 0.03, 0.008, Math.sin(q * 1.3) * 0.03]]} r={0.0012} col="#f4f0e2" e="#fff6e0" ei={0.2} seg={6} grow={t > 55 ? 1 : 0.6} />)}
          </group>;
        })}
        {/* canela, miel y sábila (aparecen con la voz) */}
        {kCan > 0.01 && <group position={PT.canela} scale={kCan}>
          <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.05, 0.05, 0.12, 20, 1, true]} /><meshStandardMaterial color="#eef6ff" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
          {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.02, 0.07, Math.sin(i) * 0.02]} rotation={[0.1 * Math.sin(i), 0, 0.12 * Math.cos(i)]}><cylinderGeometry args={[0.009, 0.009, 0.2, 8]} /><meshStandardMaterial color="#8a4a22" roughness={0.9} /></mesh>)}
        </group>}
        {kMiel > 0.01 && <group position={PT.miel} scale={kMiel}>
          <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.12, 24]} /><meshPhysicalMaterial color="#e8a020" roughness={0.15} transparent opacity={0.88} emissive="#c87810" emissiveIntensity={0.25} /></mesh>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.052, 0.052, 0.025, 24]} /><meshStandardMaterial color="#c8b07a" roughness={0.6} /></mesh>
        </group>}
        {kSab > 0.01 && <group position={PT.sabila} scale={kSab} rotation={[0, 0.6, 0]}>
          <mesh position={[0, 0.012, 0]} scale={[0.1, 0.01, 0.022]} castShadow><sphereGeometry args={[1, 16, 8]} /><meshStandardMaterial color="#6e9a52" roughness={0.45} /></mesh>
          <mesh position={[0.045, 0.014, 0]} scale={[0.025, 0.008, 0.016]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#dfe8c8" roughness={0.3} /></mesh>
        </group>}
        {/* LA GUÍA */}
        <Book p={BOOK} open={open} cover={pg.p001} inside={pg.p012_r} right={flip30 > 0 ? pg.p030 : flip15 > 0 ? pg.p015 : pg.p013} spine="#3f8a52"
          flips={flip30 > 0 ? [{ k: flip30, tex: [pg.p015, pg.p017] }] : [{ k: flip15, tex: [pg.p013, pg.p014] }]} />
      </group>

      {/* LA MACETA EN CORTE con el esqueje y la raíz que crece */}
      <group>
        <Pot p={POT} r={0.32} h={0.45} cut soilMap={tx.soil} />
        <group position={POT}>
          <Tube pts={[[0, 0.24, 0.0], [0.004, 0.45, 0.0], [0.01, 0.66, 0.0]]} r={0.006} col="#5a7a32" seg={12} />
          {[0, 1, 2].map((q) => <Leaf key={q} p={[q === 1 ? -0.03 : 0.03, 0.56 + q * 0.04, 0.0]} rot={[0, q * 2.2, -0.4]} s={1.4} col="#3f8a3a" />)}
          {ROOTS.map((r, i) => <Tube key={i} pts={r} r={0.0026 - (i % 3) * 0.0004} col="#f3ecd8" grow={cl(rootK * 1.25 - (i % 5) * 0.06)} e="#fff3d6" ei={0.35} seg={36} />)}
          {HAIRS.map((h, i) => <Tube key={"h" + i} pts={h.pts} r={0.0008} col="#f6f2e6" grow={cl((rootK - h.at) * 3)} e="#fff3d6" ei={0.3} seg={6} />)}
          {rootK > 0.02 && rootK < 1 && <pointLight position={[0, 0.2, 0.12]} intensity={0.25} distance={0.6} color="#fff0d0" />}
        </group>
      </group>

      {/* más vida en el patio: geranios, sábila, cactus, helechos, regadera; el barrio detrás */}
      <Geranio p={[-4.25, 0, -2.75]} seed={1} />
      <Geranio p={[-4.25, 0, -1.9]} seed={2} col="#e8457a" s={0.9} />
      <Geranio p={[-4.25, 0, 0.2]} seed={3} col="#f2f2f2" s={0.85} />
      <Aloe p={[-2.4, 0, -2.85]} />
      <Cactus p={[-0.3, 0, -2.95]} />
      <Aloe p={[4.5, 0, -0.2]} s={1.2} />
      <Geranio p={[4.4, 0, 1.1]} seed={4} s={1.1} />
      <Helecho p={[-1.6, 1.7, -3.08]} />
      <Helecho p={[0.6, 1.9, -3.08]} />
      <Helecho p={[-4.48, 1.85, -1.1]} />
      <Regadera p={[0.85, 0, -1.6]} ry={0.6} />
      <Vecinos wall={tx.wall} />
      <SkyDome sun={sun} />
      {/* detrás del muro: el río y el sauce */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, -9]}><planeGeometry args={[40, 8]} /><meshStandardMaterial color="#6f8a4a" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, -14]}><planeGeometry args={[60, 5]} /><meshStandardMaterial color="#5a6a5a" roughness={0.15} metalness={0.4} /></mesh>
      <Willow p={WILLOW} />
      {[-6, -2, 8, 12].map((x, i) => <mesh key={i} position={[x, 2.2, -12 - i]} scale={[1.6, 2.6, 1.6]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#5f7a3a" roughness={1} /></mesh>)}
      <mesh position={[10.5, 1.4, -5.5]}><boxGeometry args={[3, 2.8, 3]} /><meshStandardMaterial color="#c9b49a" map={tx.brick} roughness={1} /></mesh>
      <Stations t={t} />
    </ThreeCanvas>
  );
};
