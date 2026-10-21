// tialicha01 · EL MUNDO: la casa de adobe de la Tía Licha EN CORTE (sin pared de adelante), de NOCHE: a la izquierda la COCINA
// (fogón con comal y brasas, manojos de hierbas secas colgando de la viga, repisa con frascos de manzanilla y avena, mesita con
// mantel de cuadros, vela y jarrito humeando, reloj de péndulo, DIEZ JARRITOS numerados en sus clavos); en el medio la pared
// con la puerta de cortina; a la derecha la RECÁMARA (cama de latón con colcha tejida, buró con despertador en las 3:00 y el
// vaso de agua, la Virgen, petate, ventana con la luna). Afuera: patio con naranjo, nopalera, macetas de geranio, cerros y estrellas.
// `hora`: 1 = las tres de la mañana · 0 = el atardecer ("la cena a las 7"). UNA escena y UNA cámara para todo el video.
// Helpers (cámara, Lathe, vapor, fuego, libro) heredados del kit de rancho; el mundo es nuevo. Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { HAND, handReady } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
type V = [number, number, number];

// ---------------- CÁMARA (keyframes globales; las del resto del video se agregan en KEYS_REST) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); }; // suma (minuto 1 + resto)
export const dropKeys = (a: number, b: number) => { KEYS = KEYS.filter((x) => x.t < a || x.t > b); }; // saca llaves de un tramo (el resto pisa al minuto 1)
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([2, 1.6, 3]), l: v3([0, 0.8, 0]), fov: 40 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  // respiración de cámara en mano, muy suave (nunca quieta)
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
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

// ---------------- texturas procedurales de rancho ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: (i: number) => string, r = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = col(i); g.fillRect(rnd(i, 11) * w, rnd(i, 12) * h, r * (0.5 + rnd(i, 13)), r * (0.5 + rnd(i, 14))); } };
const useRancho = () => useMemo(() => ({
  // adobe: bloques grandes de barro con paja, junta de lodo más oscura, irregular
  adobe: mk(512, 512, (g) => {
    g.fillStyle = "#8a6646"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 6; r++) for (let c = -1; c < 4; c++) {
      const i = r * 7 + c + 10, off = (r % 2) * 70, x = c * 140 + off + 4 + rnd(i, 2) * 4, y = r * 86 + 5 + rnd(i, 3) * 3;
      const b = 150 + rnd(i, 1) * 30;
      g.fillStyle = `rgb(${b},${b * 0.74},${b * 0.5})`;
      g.beginPath(); g.roundRect(x, y, 128 + rnd(i, 4) * 6, 74 + rnd(i, 5) * 4, 10); g.fill();
    }
    noise(g, 512, 512, 2600, (i) => `rgba(${70 + rnd(i, 1) * 60},${50 + rnd(i, 2) * 30},${30},${0.18 + rnd(i, 3) * 0.2})`, 2);
    // pajitas
    g.strokeStyle = "rgba(220,190,120,.35)"; g.lineWidth = 1.2;
    for (let i = 0; i < 260; i++) { const x = rnd(i, 21) * 512, y = rnd(i, 22) * 512, a = rnd(i, 23) * 6.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); g.stroke(); }
    // hollín arriba
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(20,12,6,.35)"); gr.addColorStop(0.35, "rgba(20,12,6,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  }, [3, 1.4]),
  // piso de tierra apisonada
  tierra: mk(512, 512, (g) => {
    g.fillStyle = "#6e5238"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 5000, (i) => `rgba(${90 + rnd(i, 1) * 70},${65 + rnd(i, 2) * 40},${40 + rnd(i, 3) * 25},.35)`, 3);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(40,28,18,${0.08 + rnd(i, 5) * 0.1})`; g.beginPath(); g.ellipse(rnd(i, 6) * 512, rnd(i, 7) * 512, 30 + rnd(i, 8) * 60, 14 + rnd(i, 9) * 30, rnd(i, 10) * 3, 0, 6.3); g.fill(); }
  }, [6, 6]),
  patio: mk(512, 512, (g) => {
    g.fillStyle = "#8c6e4c"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 5000, (i) => `rgba(${120 + rnd(i, 1) * 70},${95 + rnd(i, 2) * 40},${60 + rnd(i, 3) * 30},.35)`, 3);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(80,110,40,${0.15 + rnd(i, 4) * 0.2})`; g.fillRect(rnd(i, 5) * 512, rnd(i, 6) * 512, 3, 7); }
  }, [12, 12]),
  madera: mk(256, 512, (g) => {
    g.fillStyle = "#6b4529"; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 70; k++) { g.strokeStyle = `rgba(${35 + rnd(k, 1) * 30},${20 + rnd(k, 2) * 15},8,${0.2 + rnd(k, 3) * 0.3})`; g.lineWidth = 1 + rnd(k, 4) * 2.5; g.beginPath(); const x = rnd(k, 5) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 10 * rnd(k, 6), 170, x - 12 * rnd(k, 7), 340, x + 6, 512); g.stroke(); }
    noise(g, 256, 512, 600, (i) => `rgba(255,220,170,${0.04 + rnd(i, 1) * 0.05})`, 2);
  }),
  // mantel blanco de manta con bordado de flores en la orilla (tipo servilleta michoacana)
  mantel: mk(1024, 512, (g) => {
    g.fillStyle = "#efe7d8"; g.fillRect(0, 0, 1024, 512);
    noise(g, 1024, 512, 4000, (i) => `rgba(150,130,100,${0.05 + rnd(i, 1) * 0.06})`, 2);
    const flor = (x: number, y: number, s: number, c1: string, c2: string) => {
      for (let p = 0; p < 6; p++) { const a = (p / 6) * 6.283; g.fillStyle = c1; g.beginPath(); g.ellipse(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.42, s * 0.22, a, 0, 6.3); g.fill(); }
      g.fillStyle = c2; g.beginPath(); g.arc(x, y, s * 0.25, 0, 6.3); g.fill();
    };
    const cols = [["#c7243a", "#f2c14e"], ["#2a62b8", "#f6e7c8"], ["#e0761a", "#7a1f2b"], ["#7d3c98", "#f2c14e"], ["#2f8a4a", "#c7243a"]];
    for (const yy of [34, 478]) for (let k = 0; k < 22; k++) {
      const x = 24 + k * 47; const [a, b] = cols[k % 5]; flor(x, yy, 18, a, b);
      g.strokeStyle = "#2f8a4a"; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 14, yy); g.quadraticCurveTo(x + 24, yy + (yy < 100 ? 16 : -16), x + 33, yy); g.stroke();
    }
    g.strokeStyle = "#c7243a"; g.lineWidth = 4; g.setLineDash([8, 6]); g.strokeRect(8, 8, 1008, 496); g.setLineDash([]);
  }),
  // superficie del mole: casi negro, brillante, con vetas rojizas
  mole: mk(1024, 1024, (g) => {
    const gr = g.createRadialGradient(512, 512, 40, 512, 512, 520); gr.addColorStop(0, "#3a140a"); gr.addColorStop(1, "#1e0904"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 420; i++) { g.fillStyle = `rgba(${90 + rnd(i, 1) * 60},${25 + rnd(i, 2) * 15},${8},${0.08 + rnd(i, 3) * 0.12})`; g.beginPath(); g.ellipse(rnd(i, 4) * 1024, rnd(i, 5) * 1024, 6 + rnd(i, 6) * 40, 3 + rnd(i, 7) * 14, rnd(i, 8) * 3, 0, 6.3); g.fill(); }
    // vetas de la pala
    g.strokeStyle = "rgba(110,35,12,.35)"; g.lineWidth = 6;
    for (let k = 0; k < 10; k++) { g.beginPath(); const r = 120 + k * 36; g.arc(512, 512, r, rnd(k, 1) * 6, rnd(k, 1) * 6 + 1.6 + rnd(k, 2)); g.stroke(); }
  }),
  barro: mk(512, 256, (g) => {
    g.fillStyle = "#a3502a"; g.fillRect(0, 0, 512, 256);
    noise(g, 512, 256, 1800, (i) => `rgba(${60 + rnd(i, 1) * 50},${25 + rnd(i, 2) * 15},${10},${0.15 + rnd(i, 3) * 0.15})`, 2);
    for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(40,15,5,${0.08 + rnd(k, 4) * 0.1})`; g.fillRect(0, 30 + k * 38 + rnd(k, 5) * 10, 512, 3); }
  }),
  // papel picado: banderitas con calado
  picado: [0, 1, 2, 3, 4].map((ci) => mk(256, 320, (g) => {
    const c = ["#e83a62", "#f2a31b", "#2fb3a3", "#7b4bd1", "#3c8be6"][ci];
    g.clearRect(0, 0, 256, 320); g.fillStyle = c; g.fillRect(0, 0, 256, 300);
    for (let k = 0; k < 12; k++) { g.beginPath(); g.moveTo(k * 21.3, 300); g.lineTo(k * 21.3 + 10.6, 320); g.lineTo(k * 21.3 + 21.3, 300); g.fill(); }
    g.globalCompositeOperation = "destination-out";
    // flor central + rombos + puntos (calado)
    for (let p = 0; p < 8; p++) { const a = (p / 8) * 6.283; g.beginPath(); g.ellipse(128 + Math.cos(a) * 40, 150 + Math.sin(a) * 40, 22, 10, a, 0, 6.3); g.fill(); }
    g.beginPath(); g.arc(128, 150, 14, 0, 6.3); g.fill();
    for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(22 + k * 42, 40); g.lineTo(32 + k * 42, 26); g.lineTo(42 + k * 42, 40); g.lineTo(32 + k * 42, 54); g.closePath(); g.fill(); }
    for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(32 + k * 40, 262, 7, 0, 6.3); g.fill(); }
    g.globalCompositeOperation = "source-over";
  })),
  dot: mk(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  }),
  // nube de vapor (más suave y grande que el dot)
  steam: mk(128, 128, (g) => {
    for (let k = 0; k < 7; k++) { const gr = g.createRadialGradient(40 + rnd(k, 1) * 48, 40 + rnd(k, 2) * 48, 0, 64, 64, 60); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
// vasija por torno (perfil [radio, alto]) — ollas, jarros, cazuelas, platos
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; map?: Tx; rot?: V; s?: number; m?: number; inner?: string; seg?: number }> = ({ prof, p, c, r = 0.75, map, rot, s = 1, m = 0, inner, seg = 40 }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), seg), [JSON.stringify(prof), seg]);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} side={inner ? THREE.FrontSide : THREE.DoubleSide} /></mesh>
      {inner && <mesh geometry={geo}><meshStandardMaterial color={inner} roughness={0.35} side={THREE.BackSide} /></mesh>}
    </group>
  );
};
const OLLA: [number, number][] = [[0, 0], [0.13, 0.005], [0.2, 0.06], [0.23, 0.16], [0.21, 0.26], [0.15, 0.31], [0.14, 0.34], [0.165, 0.36], [0.16, 0.37]];
const JARRO: [number, number][] = [[0, 0], [0.05, 0], [0.075, 0.04], [0.085, 0.1], [0.07, 0.15], [0.065, 0.18], [0.075, 0.2], [0.072, 0.205]];
const CAZUELA: [number, number][] = [[0, 0], [0.18, 0.005], [0.3, 0.04], [0.36, 0.11], [0.38, 0.17], [0.395, 0.185], [0.385, 0.19]];
const PLATO: [number, number][] = [[0, 0], [0.07, 0], [0.085, 0.012], [0.1, 0.018], [0.135, 0.032], [0.15, 0.045], [0.155, 0.05], [0.148, 0.052]];
const PELTRE: [number, number][] = [[0, 0], [0.16, 0.004], [0.2, 0.03], [0.22, 0.09], [0.225, 0.11], [0.235, 0.115]];

// superficie de mole con ojitos de grasa: disco con burbujeo lento (determinista) y material brillante
const MoleSurface: React.FC<{ r: number; t: number; map: Tx; ojitos: number; bub?: number; dark?: number; raw?: number }> = ({ r, t, map, ojitos, bub = 1, dark = 0, raw = 0 }) => {
  const geo = useMemo(() => new THREE.CircleGeometry(r, 72, 0, Math.PI * 2), [r]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), d = Math.hypot(x, y) / r;
    let z = 0;
    for (let k = 0; k < 4; k++) { const cx = (rnd(k, 31) - 0.5) * r * 1.2, cy = (rnd(k, 32) - 0.5) * r * 1.2, ph = ((t * 0.35 + rnd(k, 33)) % 1); const dd = Math.hypot(x - cx, y - cy) / (r * 0.18); z += bub * 0.012 * r * Math.sin(ph * Math.PI) * Math.exp(-dd * dd); }
    z += 0.004 * r * Math.sin(x * 22 / r + t * 0.8) * Math.sin(y * 19 / r - t * 0.6);
    pos.setZ(i, z * (1 - d * d));
  }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geo} receiveShadow><meshPhysicalMaterial color={new THREE.Color("#ffffff").lerp(new THREE.Color("#5a3a30"), dark)} map={map} roughness={0.32 + 0.5 * raw} clearcoat={1 - 0.8 * raw} clearcoatRoughness={0.18} emissive="#8a2410" emissiveIntensity={0.55 * raw} /></mesh>
      {/* ojitos de grasa roja: charquitos brillantes que aparecen con el "frito" */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = rnd(i, 41) * 6.283, d = Math.sqrt(rnd(i, 42)) * r * 0.8, s = r * (0.012 + rnd(i, 43) * 0.03) * ojitos;
        if (s < 0.002) return null;
        return <mesh key={i} position={[Math.cos(a) * d, Math.sin(a) * d, 0.004 * r + 0.0015]}><circleGeometry args={[s, 20]} /><meshPhysicalMaterial color="#6e2408" emissive="#3a0c02" emissiveIntensity={0.25} roughness={0.05} clearcoat={1} clearcoatRoughness={0.03} transparent opacity={0.7} /></mesh>;
      })}
    </group>
  );
};

// vapor que sube (sprites deterministas)
const Steam: React.FC<{ p: V; t: number; amt: number; tex: THREE.Texture; spread?: number; h?: number; n?: number; size?: number }> = ({ p, t, amt, tex, spread = 0.25, h = 0.9, n = 16, size = 0.35 }) => {
  if (amt <= 0.01) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => {
        const life = 3.2 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const y = ph * h, x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.05 * ph, z = (rnd(i, 4) - 0.5) * spread;
        const s = size * (0.5 + ph * 1.4);
        return <sprite key={i} position={[x, y, z]} scale={[s, s, 1]}><spriteMaterial map={tex} color="#fff6ea" transparent opacity={amt * 0.32 * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>;
      })}
    </group>
  );
};

// fuego de leña: lenguas de llama (conos aditivos) que titilan + brasas + luz que tiembla
const Fire: React.FC<{ p: V; t: number; amt: number; dot: THREE.Texture }> = ({ p, t, amt, dot }) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 13.1) * Math.sin(t * 7.7 + 1) + 0.08 * Math.sin(t * 23);
  return (
    <group position={p}>
      {/* leños */}
      {[-0.12, 0, 0.12].map((x, i) => <mesh key={i} position={[x, 0.04, (i - 1) * 0.03]} rotation={[0, 0, Math.PI / 2 + (i - 1) * 0.25]} castShadow><cylinderGeometry args={[0.035, 0.04, 0.5, 8]} /><meshStandardMaterial color="#3a2414" roughness={1} emissive="#ff4a10" emissiveIntensity={0.25 * amt} /></mesh>)}
      {amt > 0.02 && Array.from({ length: 9 }, (_, i) => {
        const ph = t * (2.2 + rnd(i, 1)) + rnd(i, 2) * 6, hh = (0.16 + 0.14 * rnd(i, 3)) * (0.75 + 0.25 * Math.sin(ph * 3)) * amt;
        return <mesh key={i} position={[(rnd(i, 4) - 0.5) * 0.3, 0.06 + hh / 2, (rnd(i, 5) - 0.5) * 0.12]} rotation={[0, 0, Math.sin(ph) * 0.15]}>
          <coneGeometry args={[0.05 + 0.03 * rnd(i, 6), hh, 10, 1, true]} /><meshBasicMaterial color={new THREE.Color("#ff5a10").lerp(new THREE.Color("#ffd27a"), rnd(i, 7))} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>;
      })}
      {amt > 0.02 && <sprite position={[0, 0.16, 0.05]} scale={[0.9 * fl, 0.7 * fl, 1]}><spriteMaterial map={dot} color="#ff8a2a" transparent opacity={0.55 * amt} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
      {/* chispitas que suben */}
      {amt > 0.02 && Array.from({ length: 10 }, (_, i) => { const life = 1.4 + rnd(i, 8), ph = ((t + rnd(i, 9) * life) % life) / life; return <mesh key={"s" + i} position={[(rnd(i, 10) - 0.5) * 0.25 + Math.sin(t * 3 + i) * 0.03, 0.15 + ph * 0.7, (rnd(i, 11) - 0.5) * 0.1]}><sphereGeometry args={[0.006, 4, 3]} /><meshBasicMaterial color="#ffb050" transparent opacity={(1 - ph) * amt} toneMapped={false} /></mesh>; })}
      <pointLight position={[0, 0.3, 0.35]} intensity={6.5 * fl * amt} distance={5.5} decay={1.6} color="#ff8a3a" castShadow={false} />
    </group>
  );
};

// cuerda con papel picado (catenaria), las banderitas se mecen
const Picado: React.FC<{ a: V; b: V; n: number; t: number; tex: THREE.Texture[]; sc?: number }> = ({ a, b, n, t, tex, sc = 1 }) => {
  const A = v3(a), B = v3(b);
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const k = (i + 0.5) / n, q = A.clone().lerp(B, k); q.y -= Math.sin(k * Math.PI) * 0.22 * sc;
        const sw = Math.sin(t * 1.6 + i * 0.9) * 0.18;
        return <group key={i} position={[q.x, q.y, q.z]} rotation={[sw, Math.atan2(B.x - A.x, B.z - A.z) + Math.PI / 2, 0]}>
          <mesh position={[0, -0.13 * sc, 0]}><planeGeometry args={[0.2 * sc, 0.25 * sc]} /><meshStandardMaterial map={tex[i % tex.length]} transparent alphaTest={0.4} side={THREE.DoubleSide} roughness={0.8} /></mesh>
        </group>;
      })}
    </group>
  );
};

// foquitos de fiesta en catenaria
const Foquitos: React.FC<{ a: V; b: V; n: number; on: number; dot: THREE.Texture }> = ({ a, b, n, on, dot }) => {
  const A = v3(a), B = v3(b);
  return <group>{Array.from({ length: n }, (_, i) => {
    const k = (i + 0.5) / n, q = A.clone().lerp(B, k); q.y -= Math.sin(k * Math.PI) * 0.35;
    return <group key={i} position={[q.x, q.y, q.z]}>
      <mesh><sphereGeometry args={[0.035, 8, 6]} /><meshBasicMaterial color={new THREE.Color("#3a3226").lerp(new THREE.Color("#ffd99a"), on)} toneMapped={false} /></mesh>
      {on > 0.05 && <sprite scale={[0.32, 0.32, 1]}><spriteMaterial map={dot} color="#ffc070" transparent opacity={0.6 * on} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
    </group>;
  })}</group>;
};

// limonero: tronco + copa de esferas + limones
const Limonero: React.FC<{ p: V; t: number }> = ({ p, t }) => (
  <group position={p}>
    <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.07, 0.11, 1.6, 8]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>
    {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.5, 1.8 + rnd(i, 2) * 0.9 + Math.sin(t * 0.8 + i) * 0.01, (rnd(i, 3) - 0.5) * 1.3]} castShadow><sphereGeometry args={[0.38 + rnd(i, 4) * 0.25, 18, 14]} /><meshStandardMaterial color={new THREE.Color("#3f6b25").lerp(new THREE.Color("#6f9a35"), rnd(i, 5))} roughness={0.9} /></mesh>)}
    {Array.from({ length: 22 }, (_, i) => <mesh key={"l" + i} position={[(rnd(i, 6) - 0.5) * 1.7, 1.6 + rnd(i, 7) * 1.1, (rnd(i, 8) - 0.5) * 1.5]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={rnd(i, 9) > 0.4 ? "#9cc43a" : "#d9cf3a"} roughness={0.5} /></mesh>)}
  </group>
);

// recetario de la abuela: libro de pasta de tela gastada; open 0..1; las páginas son canvas con letra a mano
const useRecetario = (pages: { l: string[]; r: string[] }[], ready: boolean) => useMemo(() => {
  if (!ready) return [] as THREE.Texture[];
  return pages.flatMap((pg) => [pg.l, pg.r].map((lines, side) => {
    const cv = document.createElement("canvas"); cv.width = 768; cv.height = 1024; const g = cv.getContext("2d")!;
    const gr = g.createLinearGradient(side ? 0 : 768, 0, side ? 768 : 0, 0); gr.addColorStop(0, "#d9c39a"); gr.addColorStop(0.12, "#ecdcb6"); gr.addColorStop(1, "#e6d2a8"); g.fillStyle = gr; g.fillRect(0, 0, 768, 1024);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,90,50,${0.04 + rnd(i, 1) * 0.07})`; g.fillRect(rnd(i, 2) * 768, rnd(i, 3) * 1024, 2, 2); }
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(140,95,40,${0.06 + rnd(i, 4) * 0.06})`; g.beginPath(); g.arc(rnd(i, 5) * 768, rnd(i, 6) * 1024, 20 + rnd(i, 7) * 60, 0, 6.3); g.fill(); } // manchitas de grasa/tiempo
    g.strokeStyle = "rgba(90,110,150,.22)"; g.lineWidth = 2; for (let y = 140; y < 1000; y += 58) { g.beginPath(); g.moveTo(40, y); g.lineTo(728, y); g.stroke(); }
    g.fillStyle = "#3b2414";
    lines.forEach((ln, k) => {
      const big = ln.startsWith("# ");
      g.font = big ? `700 74px ${HAND}` : `500 50px ${HAND}`;
      g.save(); g.translate(60, (big ? 110 : 130) + k * 58 + (big ? 0 : 20)); g.rotate(-0.012 + rnd(k, side + 3) * 0.01);
      g.fillText(big ? ln.slice(2) : ln, 0, 0); g.restore();
    });
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
  }));
}, [ready, JSON.stringify(pages)]);

// hoja curvada que pasa (la "panza" de la página)
const Leaf: React.FC<{ ang: number; w: number; d: number; front?: Tx; back?: Tx; y: number }> = ({ ang, w, d, front, back, y }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color="#d8cfbd" roughness={0.95} map={back} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color="#d8cfbd" roughness={0.95} map={front} /></mesh>
    </group>
  );
};
export const Recetario: React.FC<{ p: V; rotY?: number; open: number; flip: number; tex: THREE.Texture[]; coverCol?: string; label?: THREE.Texture }> = ({ p, rotY = 0, open, flip, tex, coverCol = "#5b2a22", label }) => {
  const BW = 0.24, BD = 0.32, TH = 0.035;
  // tex = [p0L, p0R, p1L, p1R, ...]; flip = número de hojas pasadas (con decimales mientras pasa)
  const fi = Math.floor(flip), fr = flip - fi;
  const L = tex[Math.min(tex.length - 2, fi * 2)] , R = tex[Math.min(tex.length - 1, fi * 2 + 1)];
  const nextL = tex[Math.min(tex.length - 2, fi * 2 + 2)], nextR = tex[Math.min(tex.length - 1, fi * 2 + 3)];
  const cover = new THREE.Color(coverCol);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      {/* bloque de hojas (lado derecho) */}
      <Box p={[BW / 2, TH / 2, 0]} s={[BW, TH, BD]} c="#e3d3ae" r={1} rad={0.004} />
      <Box p={[BW / 2, 0.003, 0]} s={[BW + 0.012, 0.006, BD + 0.012]} c={cover.getStyle()} r={0.95} rad={0.003} />
      {/* página derecha visible */}
      <mesh position={[BW / 2, TH + 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial map={fr > 0 && fi * 2 + 3 < tex.length ? nextR : R} roughness={0.95} color="#d8cfbd" /></mesh>
      {/* tapa con bisagra en el lomo: se abre hacia la izquierda y queda con la página izquierda arriba */}
      <group position={[0, TH, 0]} rotation={[0, 0, Math.PI * open]}>
        <Box p={[BW / 2, 0.004, 0]} s={[BW + 0.012, 0.008, BD + 0.012]} c={cover.getStyle()} r={0.9} rad={0.003} />
        {/* bordado/etiqueta en la tapa */}
        {label ? <mesh position={[BW / 2, 0.0086, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}><planeGeometry args={[BD * 0.92, BW * 0.92]} /><meshStandardMaterial map={label} roughness={0.8} /></mesh>
          : <mesh position={[BW / 2, 0.0085, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.6, BD * 0.22]} /><meshStandardMaterial color="#e6d2a8" roughness={0.9} /></mesh>}
        <mesh position={[BW / 2, -0.001, 0]} rotation={[Math.PI / 2, 0, Math.PI]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial map={L} roughness={0.95} color="#d8cfbd" side={THREE.DoubleSide} /></mesh>
      </group>
      {/* la hoja que pasa */}
      {fr > 0.001 && open > 0.98 && <group position={[0, TH + 0.002, 0]}><Leaf ang={Math.PI * ease(fr)} w={BW * 0.97} d={BD * 0.97} front={R} back={nextL} y={0} /></group>}
    </group>
  );
};

// =====================================================================================================================
// ---------------- LA CASA DE LICHA ----------------
// =====================================================================================================================
// planta: cocina x -4.2..0.4 · pared con puerta en x 0.4 (hueco z -0.65..0.35) · recámara x 0.4..4.6 · fondo z -3.1 · frente abierto
export const PART_X = 0.4, DOOR_Z = -0.15;
export const JARS: V[] = Array.from({ length: 10 }, (_, i) => [-3.55 + i * 0.36, 2.12, -2.86] as V); // los diez jarritos colgados
export const PT = {
  fogon: [-2.75, 0.95, -2.55] as V,
  fire: [-2.75, 0.12, -2.08] as V,
  mesa: [-1.35, 0.76, -0.55] as V,       // mesita de la cocina (sobre el mantel)
  reloj: [-4.02, 1.95, -1.0] as V,        // reloj de péndulo en la pared izquierda
  hierbas: [-2.4, 2.45, -2.4] as V,
  repisa: [-1.0, 1.5, -2.82] as V,
  puerta: [PART_X, 1.0, DOOR_Z] as V,
  cama: [2.55, 0.62, -1.55] as V,
  almohada: [2.55, 0.78, -2.4] as V,
  buro: [3.75, 0.62, -2.62] as V,
  vaso: [3.62, 0.66, -2.55] as V,
  virgen: [2.55, 2.05, -2.92] as V,
  ventana: [4.6, 1.8, -0.9] as V,
  luna: [16, 9, -14] as V,
  naranjo: [6.6, 0, -2.2] as V,
};
// caminito de luz: del fogón a la mesa, por la puerta, hasta la cama
const PATH: V[] = [[-2.75, 0.03, -1.9], [-1.9, 0.03, -1.1], [-1.35, 0.03, 0.05], [-0.4, 0.03, 0.15], [PART_X, 0.03, DOOR_Z], [1.3, 0.03, 0.2], [2.0, 0.03, -0.3], [2.55, 0.66, -0.6], [2.55, 0.8, -1.6]];
const pathAt = (k: number) => { const n = PATH.length - 1, x = Math.min(n - 1e-6, Math.max(0, k * n)), i = Math.floor(x), f = x - i; return v3(PATH[i]).lerp(v3(PATH[i + 1]), f); };

const useCasa = () => useMemo(() => ({
  // mantel de cuadros rojo y blanco (manta)
  cuadros: mk(256, 256, (g) => {
    g.fillStyle = "#f1e9da"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 8; k++) { g.fillStyle = "rgba(178,34,42,.55)"; g.fillRect(k * 32, 0, 16, 256); g.fillRect(0, k * 32, 256, 16); }
    noise(g, 256, 256, 900, (i) => `rgba(120,90,60,${0.05 + rnd(i, 1) * 0.06})`, 2);
  }, [3, 2]),
  // colcha tejida de gancho: cuadros de colores con flor
  colcha: mk(512, 512, (g) => {
    const C = ["#7b4bd1", "#c7243a", "#f2a31b", "#2f8a4a", "#2a62b8", "#e0761a"];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const x = c * 64, y = r * 64, i = r * 8 + c;
      g.fillStyle = "#efe4cf"; g.fillRect(x, y, 64, 64);
      g.fillStyle = C[i % 6]; g.fillRect(x + 6, y + 6, 52, 52);
      g.fillStyle = C[(i + 2) % 6]; g.fillRect(x + 16, y + 16, 32, 32);
      g.fillStyle = "#efe4cf"; g.beginPath(); g.arc(x + 32, y + 32, 8, 0, 6.3); g.fill();
      g.strokeStyle = "rgba(40,20,10,.25)"; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, 62, 62);
    }
    noise(g, 512, 512, 3000, (i) => `rgba(255,255,255,${0.04 + rnd(i, 1) * 0.06})`, 2);
  }, [1.5, 1.5]),
  // piso de ladrillo de barro (recámara)
  ladrillo: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++) { const i = r * 5 + c, b = 150 + rnd(i, 1) * 35; g.fillStyle = `rgb(${b},${b * 0.55},${b * 0.38})`; g.fillRect(c * 128 + (r % 2) * 64 - 64, r * 64, 126, 62); }
    noise(g, 512, 512, 2500, (i) => `rgba(60,25,10,${0.08 + rnd(i, 1) * 0.12})`, 2);
  }, [3, 3]),
  // petate: tejido de palma
  petate: mk(256, 256, (g) => {
    g.fillStyle = "#c9a76a"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) { g.fillStyle = (r + c) % 2 ? "rgba(120,85,40,.35)" : "rgba(255,240,200,.2)"; g.fillRect(c * 16, r * 16, 16, 16); g.strokeStyle = "rgba(80,55,25,.4)"; g.lineWidth = 1; g.strokeRect(c * 16, r * 16, 16, 16); }
  }, [2, 3]),
  // cortina de manta con franja bordada
  cortina: mk(256, 512, (g) => {
    g.fillStyle = "#e9dcc2"; g.fillRect(0, 0, 256, 512);
    for (let x = 0; x < 256; x += 22) { g.fillStyle = "rgba(120,90,50,.12)"; g.fillRect(x, 0, 8, 512); }
    for (const y of [40, 470]) for (let k = 0; k < 8; k++) { g.fillStyle = ["#7b4bd1", "#c7243a", "#2f8a4a"][k % 3]; g.beginPath(); g.arc(16 + k * 32, y, 9, 0, 6.3); g.fill(); }
  }),
  // estampa de la Virgen: resplandor dorado y manto (forma sencilla, sin rostro detallado)
  virgen: mk(256, 384, (g) => {
    g.fillStyle = "#f6e3b0"; g.fillRect(0, 0, 256, 384);
    for (let k = 0; k < 44; k++) { const a = (k / 44) * 6.283; g.strokeStyle = "rgba(230,160,40,.9)"; g.lineWidth = 4; g.beginPath(); g.moveTo(128 + Math.cos(a) * 60, 196 + Math.sin(a) * 120); g.lineTo(128 + Math.cos(a) * 100, 196 + Math.sin(a) * 160); g.stroke(); }
    g.fillStyle = "#e9a02a"; g.beginPath(); g.ellipse(128, 196, 64, 128, 0, 0, 6.3); g.fill();
    g.fillStyle = "#c86a4a"; g.beginPath(); g.ellipse(128, 210, 34, 100, 0, 0, 6.3); g.fill();
    g.fillStyle = "#2f6f6a"; g.beginPath(); g.moveTo(128, 90); g.bezierCurveTo(70, 110, 72, 300, 100, 316); g.lineTo(156, 316); g.bezierCurveTo(184, 300, 186, 110, 128, 90); g.fill();
    g.fillStyle = "#c86a4a"; g.beginPath(); g.ellipse(128, 215, 16, 86, 0, 0, 6.3); g.fill();
    for (let i = 0; i < 16; i++) { g.fillStyle = "#f6e3b0"; g.beginPath(); g.arc(98 + rnd(i, 1) * 60, 120 + rnd(i, 2) * 180, 2.5, 0, 6.3); g.fill(); }
    g.fillStyle = "#b98a64"; g.beginPath(); g.arc(128, 104, 14, 0, 6.3); g.fill();
    g.fillStyle = "#7a2a2a"; g.beginPath(); g.ellipse(128, 336, 50, 12, 0, 0, 6.3); g.fill();
  }),
  // carátula (3:00) del reloj de péndulo y del despertador
  carat: mk(256, 256, (g) => {
    g.fillStyle = "#f3e6c8"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
    g.fillStyle = "#3b2414"; g.font = "700 34px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) { const a = (i / 12) * 6.283; g.fillText(String(i), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
    g.strokeStyle = "#3b2414"; g.lineCap = "round"; g.lineWidth = 10; g.beginPath(); g.moveTo(128, 128); g.lineTo(186, 128); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 44); g.stroke();
    g.fillStyle = "#7a1f2b"; g.beginPath(); g.arc(128, 128, 9, 0, 6.3); g.fill();
  }, [1, 1]),
  frasco: ["MANZANILLA", "AVENA", "CANELA", "AZAHAR"].map((nm, i) => mk(256, 128, (g) => {
    g.fillStyle = ["#f6efd8", "#efe4cf", "#f3e6c8", "#f6efd8"][i]; g.fillRect(0, 0, 256, 128); g.strokeStyle = "#7a1f2b"; g.lineWidth = 6; g.strokeRect(8, 8, 240, 112);
    g.fillStyle = "#3b2414"; g.font = `700 ${nm.length > 7 ? 34 : 44}px Georgia, serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(nm, 128, 66);
  }, [1, 1])),
  stars: (() => { const a: number[] = []; for (let i = 0; i < 420; i++) { const th = rnd(i, 1) * 3.1 - 1.55, ph = 0.12 + rnd(i, 2) * 1.2, R = 120; a.push(Math.sin(th) * Math.cos(ph) * R, Math.sin(ph) * R, -Math.cos(th) * Math.cos(ph) * R); } return new Float32Array(a); })(),
}), []);

// manojo de hierba seca colgado (cabeza abajo)
const Manojo: React.FC<{ p: V; c: string; s?: number; t: number; i: number }> = ({ p, c, s = 1, t, i }) => (
  <group position={p} rotation={[0, 0, Math.sin(t * 0.6 + i) * 0.03]} scale={s}>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.004, 0.004, 0.14, 4]} /><meshStandardMaterial color="#c9b48a" /></mesh>
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.025, 0.02, 0.05, 8]} /><meshStandardMaterial color="#b8975a" roughness={1} /></mesh>
    {Array.from({ length: 9 }, (_, k) => <mesh key={k} position={[(rnd(k + i * 9, 1) - 0.5) * 0.08, -0.22 - rnd(k, 2) * 0.06, (rnd(k + i * 9, 3) - 0.5) * 0.08]} rotation={[(rnd(k, 4) - 0.5) * 0.4, 0, (rnd(k, 5) - 0.5) * 0.4]} castShadow>
      <coneGeometry args={[0.05 + rnd(k, 6) * 0.03, 0.38, 6]} /><meshStandardMaterial color={new THREE.Color(c).lerp(new THREE.Color("#8a7a4a"), rnd(k + i, 7) * 0.5)} roughness={1} flatShading /></mesh>)}
  </group>
);

// naranjo del patio
const Naranjo: React.FC<{ p: V; t: number }> = ({ p, t }) => (
  <group position={p}>
    <mesh position={[0, 0.9, 0]} castShadow><cylinderGeometry args={[0.08, 0.13, 1.8, 8]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.8, 2.0 + rnd(i, 2) * 1.0 + Math.sin(t * 0.7 + i) * 0.01, (rnd(i, 3) - 0.5) * 1.5]} castShadow><sphereGeometry args={[0.42 + rnd(i, 4) * 0.25, 18, 14]} /><meshStandardMaterial color={new THREE.Color("#2f5a1e").lerp(new THREE.Color("#5f8a2e"), rnd(i, 5))} roughness={0.9} /></mesh>)}
    {Array.from({ length: 26 }, (_, i) => <mesh key={"n" + i} position={[(rnd(i, 6) - 0.5) * 2.0, 1.8 + rnd(i, 7) * 1.2, (rnd(i, 8) - 0.5) * 1.7]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color={rnd(i, 9) > 0.3 ? "#f08a1c" : "#e6b02a"} roughness={0.45} /></mesh>)}
  </group>
);
// nopal: pencas que salen unas de otras
const Nopal: React.FC<{ p: V; s?: number; seed?: number }> = ({ p, s = 1, seed = 0 }) => {
  const Q: [number, number, number, number][] = [[0, 0.3, 0, 0], [0.18, 0.72, 0.02, 0.45], [-0.2, 0.68, -0.02, -0.5], [0.3, 1.08, 0, 0.2], [-0.05, 1.05, 0.03, -0.1]];
  return <group position={p} scale={s} rotation={[0, seed, 0]}>{Q.map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={[0, rnd(i + seed * 7, 1) * 0.8, r]} scale={[1, 1.35, 0.22]} castShadow><sphereGeometry args={[0.2, 16, 12]} /><meshStandardMaterial color={i % 2 ? "#5f8a3a" : "#4f7a30"} roughness={0.75} /></mesh>)}</group>;
};
// maceta de barro con geranios
const Geranio: React.FC<{ p: V; c: string; i: number }> = ({ p, c, i }) => (
  <group position={p}>
    <Lathe prof={[[0, 0], [0.12, 0], [0.17, 0.24], [0.19, 0.26]]} p={[0, 0, 0]} c="#b0562c" r={0.85} />
    {Array.from({ length: 8 }, (_, k) => <mesh key={k} position={[(rnd(k + i * 8, 1) - 0.5) * 0.3, 0.32 + rnd(k, 2) * 0.12, (rnd(k + i * 8, 3) - 0.5) * 0.3]}><sphereGeometry args={[0.08, 10, 8]} /><meshStandardMaterial color="#3f6b25" roughness={0.9} /></mesh>)}
    {Array.from({ length: 5 }, (_, k) => <mesh key={"f" + k} position={[(rnd(k + i * 5, 4) - 0.5) * 0.26, 0.46 + rnd(k, 5) * 0.08, (rnd(k + i * 5, 6) - 0.5) * 0.26]}><sphereGeometry args={[0.055, 10, 8]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>)}
  </group>
);

type TxR = ReturnType<typeof useRancho>;
// reloj de péndulo: el péndulo marca un segundo por lado (tic · tac)
const RelojPendulo: React.FC<{ t: number; tx: TxR; carat: THREE.Texture; glow: number }> = ({ t, tx, carat, glow }) => {
  const sw = Math.sin(t * Math.PI) * 0.28;
  return (
    <group position={PT.reloj} rotation={[0, Math.PI / 2, 0]}>
      <Box p={[0, -0.35, 0.06]} s={[0.42, 1.25, 0.14]} c="#5a3420" map={tx.madera} r={0.6} rad={0.03} />
      <mesh position={[0, 0.06, 0.135]}><circleGeometry args={[0.16, 40]} /><meshStandardMaterial map={carat} roughness={0.5} emissive="#ffe2a8" emissiveIntensity={0.25 * glow} /></mesh>
      <mesh position={[0, 0.06, 0.137]}><ringGeometry args={[0.16, 0.18, 40]} /><meshStandardMaterial color="#c9a24a" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, -0.55, 0.134]}><planeGeometry args={[0.3, 0.7]} /><meshStandardMaterial color="#1a0f08" roughness={0.9} /></mesh>
      <group position={[0, -0.18, 0.15]} rotation={[0, 0, sw]}>
        <mesh position={[0, -0.28, 0]}><boxGeometry args={[0.012, 0.56, 0.006]} /><meshStandardMaterial color="#c9a24a" metalness={0.85} roughness={0.25} /></mesh>
        <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.012, 32]} /><meshStandardMaterial color="#d8b25a" metalness={0.9} roughness={0.2} emissive="#ffcf7a" emissiveIntensity={0.15 * glow} /></mesh>
      </group>
      <mesh position={[0, 0.36, 0.06]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.28, 0.16, 4]} /><meshStandardMaterial color="#4f2e1c" map={tx.madera} roughness={0.7} /></mesh>
    </group>
  );
};

// despertador de campanitas (3:00)
const Despertador: React.FC<{ p: V; carat: THREE.Texture; ring: number; t: number }> = ({ p, carat, ring, t }) => {
  const sh = ring > 0.01 ? Math.sin(t * 60) * 0.06 * ring : 0;
  return (
    <group position={p} rotation={[0, -0.45 + sh, sh]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.05, 32]} /><meshStandardMaterial color="#b8322a" metalness={0.5} roughness={0.35} /></mesh>
      <mesh position={[0, 0.09, 0.026]}><circleGeometry args={[0.064, 32]} /><meshStandardMaterial map={carat} roughness={0.4} emissive="#d8f0c0" emissiveIntensity={0.35} /></mesh>
      {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.05, 0.17, 0]}><sphereGeometry args={[0.032, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#d9c7a0" metalness={0.85} roughness={0.25} side={THREE.DoubleSide} /></mesh>)}
      {[-1, 1].map((sg) => <mesh key={"p" + sg} position={[sg * 0.045, 0.025, 0]}><cylinderGeometry args={[0.006, 0.006, 0.05, 6]} /><meshStandardMaterial color="#d9c7a0" metalness={0.8} /></mesh>)}
    </group>
  );
};

// cama de latón con colcha tejida
const Cama: React.FC<{ cx: ReturnType<typeof useCasa>; hundida: number }> = ({ cx, hundida }) => {
  const [x, , z] = PT.cama, L = 2.0, Wd = 1.45;
  const brass = () => <meshStandardMaterial color="#d6b25e" metalness={0.9} roughness={0.22} />;
  return (
    <group position={[x, 0, z]}>
      {[-1, 1].map((end) => { const zz = end * L / 2, hh = end < 0 ? 1.35 : 0.95; return <group key={end} position={[0, 0, zz]}>
        {[-1, 1].map((sg) => <mesh key={sg} position={[sg * Wd / 2, hh / 2, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, hh, 12]} />{brass()}</mesh>)}
        {[-1, 1].map((sg) => <mesh key={"b" + sg} position={[sg * Wd / 2, hh + 0.03, 0]}><sphereGeometry args={[0.04, 14, 10]} />{brass()}</mesh>)}
        <mesh position={[0, hh - 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, Wd, 10]} />{brass()}</mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.014, 0.014, Wd, 10]} />{brass()}</mesh>
        {Array.from({ length: 7 }, (_, k) => <mesh key={"v" + k} position={[-Wd / 2 + (k + 1) * Wd / 8, 0.5 + (hh - 0.55) / 2, 0]}><cylinderGeometry args={[0.009, 0.009, hh - 0.55, 8]} />{brass()}</mesh>)}
      </group>; })}
      <Box p={[0, 0.5, 0]} s={[Wd - 0.06, 0.2, L - 0.06]} c="#efe7d6" r={1} rad={0.06} />
      <mesh position={[0, 0.606, 0.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow><planeGeometry args={[Wd + 0.1, L - 0.4]} /><meshStandardMaterial map={cx.colcha} roughness={0.95} /></mesh>
      {[-1, 1].map((sg) => <mesh key={sg} position={[sg * (Wd / 2 + 0.05), 0.43, 0.15]} rotation={[0, sg * Math.PI / 2, 0]}><planeGeometry args={[L - 0.4, 0.36]} /><meshStandardMaterial map={cx.colcha} roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
      <mesh position={[0, 0.43, L / 2 - 0.15]}><planeGeometry args={[Wd + 0.1, 0.36]} /><meshStandardMaterial map={cx.colcha} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <Box p={[0, 0.625, -0.6]} s={[Wd - 0.04, 0.05, 0.25]} c="#f6f1e6" r={1} rad={0.02} />
      {[-0.33, 0.33].map((xx) => <mesh key={xx} position={[xx, 0.69, -0.83]} scale={[0.3, 0.09, 0.18]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#f8f3ea" roughness={0.95} /></mesh>)}
      {hundida > 0.01 && <mesh position={[0.2, 0.64, -0.05]} scale={[0.26, 0.1 * hundida, 0.75]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial map={cx.colcha} roughness={0.95} /></mesh>}
    </group>
  );
};

// jarrito colgado con su clavo; `on` lo enciende
const Jarrito: React.FC<{ p: V; on: number; tx: TxR; i: number; t: number }> = ({ p, on, tx, i, t }) => (
  <group position={p}>
    <mesh position={[0, 0.2, 0.02]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.08, 5]} /><meshStandardMaterial color="#222" metalness={0.6} /></mesh>
    {on > 0.01 && <mesh position={[0, 0.12, 0.0]}><circleGeometry args={[0.19, 40]} /><meshBasicMaterial color="#ffcf7a" transparent opacity={0.6 * on} toneMapped={false} /></mesh>}
    <group rotation={[0, 0, Math.sin(t * 0.8 + i) * 0.02]}>
      <Lathe prof={JARRO} p={[0, 0, 0.06]} c={["#a3502a", "#8a3f20", "#c2552d"][i % 3]} map={tx.barro} s={1.25} />
      <mesh position={[0.1, 0.13, 0.06]}><torusGeometry args={[0.04, 0.011, 8, 16, Math.PI]} /><meshStandardMaterial color="#8a3f20" map={tx.barro} roughness={0.7} /></mesh>
    </group>
  </group>
);

export type WorldProps = {
  t: number;
  hora?: number;            // 1 = las 3 a.m. · 0 = atardecer
  fire?: number;            // brasas del fogón
  vela?: number;            // vela de la mesita
  velaLuz?: number;         // cuánto alumbra la vela (1 = como en el minuto 1; de cerca quema el mantel)
  lamp?: number;            // lamparita del buró
  steam?: number;           // vapor del jarrito de la mesita
  jarOn?: number[];         // 0..1 por jarrito (los diez)
  path?: number;            // 0..1 caminito de luz cocina → cama
  cena?: { pan?: number; recal?: number; vaso?: number };
  ring?: number;            // el despertador tiembla
  relojGlow?: number;       // carátula del reloj de péndulo
  hundida?: number;         // alguien acostada (bulto bajo la colcha)
  roof?: number;            // techo completo (tomas abiertas desde afuera)
  cortina?: number;         // 0 cerrada .. 1 recogida
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, hora = 1, fire = 0.45, vela = 1, velaLuz = 1, lamp = 0, steam = 1, jarOn = [], path = 0, cena = {}, ring = 0, relojGlow = 0, hundida = 0, roof = 0, cortina = 0.75 } = pr;
  const tx = useRancho();
  const cx = useCasa();
  const n = hora, d = 1 - hora;
  const sky = new THREE.Color("#e48a5c").lerp(new THREE.Color("#0b1328"), n);
  const Y = 0.76;
  const pan = Math.min(1.08, cena.pan ?? 0), recal = Math.min(1.08, cena.recal ?? 0), vaso = cena.vaso ?? 0;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.6 + 0.3 * n} threshold={0.8 - 0.08 * n} exposure={1.05 + 0.15 * n} env={0.06 + 0.18 * d} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 16, 70]} />
      <hemisphereLight args={[new THREE.Color("#ffc89a").lerp(new THREE.Color("#3a4f86"), n).getHex(), 0x24160c, 0.45 + 0.2 * d + 0.5 * n]} />
      <directionalLight position={[10, 7, 4]} intensity={1.6 * n + 2.2 * d} color={new THREE.Color("#ffb070").lerp(new THREE.Color("#9fb6ff"), n).getHex()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-9} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-6} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* rayo de luna por la ventana de la recámara */}
      <spotLight position={[6.2, 2.6, -0.9]} target-position={[2.4, 0.6, -1.2]} angle={0.45} penumbra={0.7} intensity={34 * n} distance={11} decay={1.3} color="#a9c0ff" />
      {/* vela de la mesita y lamparita del buró */}
      <pointLight position={[PT.mesa[0] + 0.18, Y + 0.32, PT.mesa[2] + 0.05]} intensity={(3.2 + 0.3 * Math.sin(t * 9) * Math.sin(t * 5.3)) * vela * velaLuz} distance={5} decay={1.5} color="#ffb15a" castShadow shadow-bias={-0.0005} />
      {/* rebote azul de la luna dentro del cuarto (de noche no queda negro) */}
      <pointLight position={[2.9, 2.5, -1.0]} intensity={2.2 * n} distance={7} decay={1.4} color="#8fa6e0" />
      <pointLight position={[3.9, 1.25, -2.5]} intensity={(2.4 + 1.2 * n) * lamp} distance={4} decay={1.6} color="#ffcf8a" />

      {/* ===== pisos ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.9, 0.001, -0.6]} receiveShadow><planeGeometry args={[4.6, 5.0]} /><meshStandardMaterial map={tx.tierra} color="#d9c2a2" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.002, -0.6]} receiveShadow><planeGeometry args={[4.2, 5.0]} /><meshStandardMaterial map={cx.ladrillo} roughness={0.9} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow><planeGeometry args={[160, 160]} /><meshStandardMaterial map={tx.patio} color="#e2c9a0" roughness={1} /></mesh>

      {/* ===== paredes de adobe ===== */}
      <Box p={[0.2, 1.6, -3.1]} s={[9.1, 3.2, 0.32]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[-4.2, 1.6, -0.6]} s={[0.32, 3.2, 5.3]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      {/* derecha, con el hueco de la ventana (z -1.45..-0.35, y 1.3..2.3) */}
      <Box p={[4.6, 1.6, -2.3]} s={[0.32, 3.2, 1.7]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[4.6, 1.6, 0.8]} s={[0.32, 3.2, 2.3]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[4.6, 0.65, -0.9]} s={[0.32, 1.3, 1.1]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[4.6, 2.75, -0.9]} s={[0.32, 0.9, 1.1]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[4.45, 1.8, -0.9]} s={[0.04, 1.0, 0.04]} c="#4f2e1c" map={tx.madera} />
      <Box p={[4.45, 1.8, -0.9]} s={[0.04, 0.04, 1.1]} c="#4f2e1c" map={tx.madera} />
      {/* pared de en medio con la puerta (hueco z -0.65..0.35, alto 2.05) */}
      <Box p={[PART_X, 1.6, -1.875]} s={[0.26, 3.2, 2.45]} c="#e3c7a2" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[PART_X, 1.6, 1.12]} s={[0.26, 3.2, 1.55]} c="#e3c7a2" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[PART_X, 2.62, DOOR_Z]} s={[0.26, 1.16, 1.0]} c="#e3c7a2" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[PART_X, 2.08, DOOR_Z]} s={[0.3, 0.1, 1.1]} c="#4f2e1c" map={tx.madera} />
      {/* cortina de manta recogida hacia un lado */}
      <mesh position={[PART_X + 0.16, 1.05, DOOR_Z + 0.5 - (0.05 + 0.45 * (1 - cortina))]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.1 + 0.9 * (1 - cortina), 1.98]} /><meshStandardMaterial map={cx.cortina} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[PART_X + 0.16, 1.05, DOOR_Z + 0.44]}><cylinderGeometry args={[0.05 + 0.04 * cortina, 0.08 + 0.05 * cortina, 1.98, 10]} /><meshStandardMaterial map={cx.cortina} roughness={0.95} /></mesh>
      <mesh position={[PART_X + 0.16, 2.04, DOOR_Z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 1.05, 6]} /><meshStandardMaterial color="#3a2a1e" /></mesh>

      {/* ===== techo: vigas y carrizo; el corte con teja sólo en tomas abiertas ===== */}
      {[-3.6, -2.5, -1.4, -0.3, 1.0, 2.1, 3.2, 4.2].map((x) => <Box key={x} p={[x, 3.12, -0.6]} s={[0.15, 0.15, 5.2]} c="#4f321d" map={tx.madera} r={0.95} />)}
      <Box p={[0.2, 3.27, -1.55]} s={[9.1, 0.07, 3.2]} c="#c9a878" map={tx.madera} r={1} rad={0.01} />
      {roof > 0.01 && <group>
        <Box p={[0.2, 3.27, 0.9]} s={[9.1, 0.07, 1.9]} c="#a8875a" r={1} rad={0.01} />
        <mesh position={[0.2, 3.5, -0.6]}><boxGeometry args={[9.6, 0.36, 5.6]} /><meshStandardMaterial color="#8a4a2a" roughness={0.9} /></mesh>
        {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-4.4 + i * 0.32, 3.7, 2.0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.3, 12, 1, true, 0, Math.PI]} /><meshStandardMaterial color="#b0562c" roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
      </group>}

      {/* ===================== LA COCINA ===================== */}
      <group position={[PT.fogon[0], 0, -2.55]}>
        <Box p={[0, 0.45, 0]} s={[1.6, 0.9, 0.9]} c="#d9b48c" map={tx.adobe} r={1} rad={0.08} />
        <mesh position={[0, 0.3, 0.452]}><planeGeometry args={[0.65, 0.4]} /><meshStandardMaterial color="#120806" roughness={1} emissive="#ff4a10" emissiveIntensity={0.3 * fire} /></mesh>
        <mesh position={[-0.2, 0.93, 0.05]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.4, 0.025, 48]} /><meshStandardMaterial color="#1a1716" roughness={0.55} metalness={0.4} /></mesh>
        <Lathe prof={OLLA} p={[0.48, 0.9, -0.05]} c="#3a2a22" r={0.6} s={0.75} />
        <Steam p={[0.48, 1.18, -0.05]} t={t} amt={0.4 * fire} tex={tx.steam} spread={0.15} h={0.9} n={8} size={0.3} />
      </group>
      <Fire p={PT.fire} t={t} amt={fire} dot={tx.dot} />
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-3.85 + (i % 3) * 0.12, 0.06 + Math.floor(i / 3) * 0.11, -2.55]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.055, 0.06, 0.7, 7]} /><meshStandardMaterial color={["#5a3b22", "#6b4a2c", "#4a301b"][i % 3]} roughness={1} /></mesh>)}
      {/* viga de las hierbas secas */}
      <Box p={[-2.3, 2.62, -2.45]} s={[2.6, 0.1, 0.1]} c="#4f321d" map={tx.madera} />
      {Array.from({ length: 8 }, (_, i) => <Manojo key={i} i={i} t={t} p={[-3.4 + i * 0.32, 2.56, -2.45 + (i % 2) * 0.05]} c={["#8a9a4a", "#6f8a3a", "#a39a5a", "#7a8a4a"][i % 4]} s={0.9 + rnd(i, 3) * 0.3} />)}
      {/* los DIEZ jarritos */}
      {JARS.map((p, i) => <Jarrito key={i} p={p} i={i} t={t} on={jarOn[i] ?? 0} tx={tx} />)}
      {/* repisa con frascos */}
      <Box p={PT.repisa} s={[1.5, 0.05, 0.3]} c="#5a3a22" map={tx.madera} r={0.9} />
      {cx.frasco.map((lab, i) => <group key={i} position={[PT.repisa[0] - 0.55 + i * 0.37, PT.repisa[1] + 0.025, PT.repisa[2]]}>
        <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.068, 0.068, 0.17, 20]} /><meshStandardMaterial color={["#d9c25a", "#e6d6a8", "#8a4a22", "#f3efe0"][i]} roughness={1} /></mesh>
        <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.075, 0.075, 0.24, 24]} /><meshPhysicalMaterial color="#ffffff" roughness={0.08} transparent opacity={0.28} /></mesh>
        <mesh position={[0, 0.26, 0]}><cylinderGeometry args={[0.078, 0.078, 0.03, 20]} /><meshStandardMaterial color="#c9a24a" metalness={0.7} roughness={0.35} /></mesh>
        <mesh position={[0, 0.12, 0.078]}><planeGeometry args={[0.12, 0.06]} /><meshStandardMaterial map={lab} roughness={0.9} /></mesh>
      </group>)}
      {/* la mesita: mantel de cuadros, vela, jarrito humeando y lo que se cenó */}
      <group position={[PT.mesa[0], 0, PT.mesa[2]]}>
        <Box p={[0, Y - 0.03, 0]} s={[1.2, 0.05, 0.8]} c="#6b4529" map={tx.madera} r={0.85} />
        {[[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]].map(([x, z]) => <Box key={x + "" + z} p={[x, (Y - 0.05) / 2, z]} s={[0.06, Y - 0.05, 0.06]} c="#5a3a22" map={tx.madera} />)}
        <mesh position={[0, Y + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.1, 0.72]} /><meshStandardMaterial map={cx.cuadros} roughness={0.95} /></mesh>
        <mesh position={[0, Y - 0.1, 0.362]} receiveShadow><planeGeometry args={[1.1, 0.2]} /><meshStandardMaterial map={cx.cuadros} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        <group position={[0.18, Y, 0.05]}>
          <Lathe prof={PLATO} p={[0, 0, 0]} c="#a3502a" map={tx.barro} s={0.5} />
          <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.025, 0.027, 0.17, 16]} /><meshStandardMaterial color="#f3ead6" roughness={0.6} /></mesh>
          {vela > 0.02 && <mesh position={[0, 0.21 + 0.003 * Math.sin(t * 11), 0]} scale={[1, 1.6 + 0.2 * Math.sin(t * 7), 1]}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} transparent opacity={vela} /></mesh>}
          {vela > 0.02 && <sprite position={[0, 0.22, 0]} scale={[0.25, 0.3, 1]}><spriteMaterial map={tx.dot} color="#ffb050" transparent opacity={0.5 * vela} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
        </group>
        <Lathe prof={JARRO} p={[-0.25, Y, -0.12]} c="#a3502a" map={tx.barro} s={1.2} />
        <Steam p={[-0.25, Y + 0.24, -0.12]} t={t} amt={steam} tex={tx.steam} spread={0.06} h={0.55} n={9} size={0.14} />
        {pan > 0.01 && <group position={[0.4, Y + 0.25 * (1 - Math.min(1, pan)), 0.14]} scale={pan}>
          <Lathe prof={PLATO} p={[0, 0, 0]} c="#a3502a" map={tx.barro} s={0.8} />
          <mesh position={[0, 0.03, 0]} scale={[1, 0.6, 1]} castShadow><sphereGeometry args={[0.075, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e2a85a" roughness={0.7} /></mesh>
          <mesh position={[0, 0.034, 0]} scale={[1, 0.62, 1]}><sphereGeometry args={[0.074, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.4]} /><meshStandardMaterial color="#f2b8c8" roughness={0.9} /></mesh>
        </group>}
        {pan > 0.01 && <group position={[0.42, Y + 0.25 * (1 - Math.min(1, pan)), -0.16]} scale={pan}>
          <Lathe prof={JARRO} p={[0, 0, 0]} c="#7a3a1f" map={tx.barro} s={1.0} />
          <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.065, 24]} /><meshPhysicalMaterial color="#1a0c06" roughness={0.1} clearcoat={1} /></mesh>
        </group>}
        {recal > 0.01 && <group position={[-0.05, Y + 0.25 * (1 - Math.min(1, recal)), 0.2]} scale={recal}>
          <Lathe prof={PLATO} p={[0, 0, 0]} c="#a3502a" map={tx.barro} s={1.1} />
          <mesh position={[-0.03, 0.04, 0]} scale={[1.3, 0.4, 1]}><sphereGeometry args={[0.07, 16, 10]} /><meshPhysicalMaterial color="#8a1e0e" roughness={0.3} clearcoat={0.8} /></mesh>
          <mesh position={[0.06, 0.035, 0.03]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.05, 14, 10]} /><meshStandardMaterial color="#5a3a22" roughness={0.6} /></mesh>
          <Steam p={[0, 0.06, 0]} t={t + 3} amt={0.8 * recal} tex={tx.steam} spread={0.08} h={0.4} n={7} size={0.12} />
        </group>}
      </group>

      {/* ===================== LA RECÁMARA ===================== */}
      <Cama cx={cx} hundida={hundida} />
      <mesh position={[2.55, 0.006, 0.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.0, 1.4]} /><meshStandardMaterial map={cx.petate} roughness={1} /></mesh>
      {/* buró con lamparita, despertador y el vaso de agua */}
      <group position={[PT.buro[0], 0, PT.buro[2]]}>
        <Box p={[0, 0.3, 0]} s={[0.5, 0.6, 0.42]} c="#5a3a22" map={tx.madera} r={0.85} />
        <Box p={[0, 0.45, 0.212]} s={[0.4, 0.14, 0.01]} c="#4a2e1a" map={tx.madera} r={0.85} />
        <mesh position={[0.0, 0.45, 0.222]}><sphereGeometry args={[0.014, 8, 6]} /><meshStandardMaterial color="#c9a24a" metalness={0.8} /></mesh>
        <group position={[0.15, 0.6, -0.08]}>
          <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.02, 0.05, 0.2, 12]} /><meshStandardMaterial color="#c9a24a" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.07, 0.12, 0.16, 20, 1, true]} /><meshStandardMaterial color="#f3e6c8" roughness={0.9} side={THREE.DoubleSide} emissive="#ffcf8a" emissiveIntensity={1.4 * lamp} /></mesh>
        </group>
      </group>
      <Despertador p={[PT.buro[0] - 0.13, 0.6, PT.buro[2] + 0.08]} carat={cx.carat} ring={ring} t={t} />
      <group position={[PT.buro[0] + 0.05, 0.6, PT.buro[2] + 0.12]} scale={[1 + 0.6 * vaso, 1 + 1.4 * vaso, 1 + 0.6 * vaso]}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.035, 0.03, 0.12, 20, 1, true]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.4} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.052, 0]}><cylinderGeometry args={[0.032, 0.028, 0.1, 20]} /><meshPhysicalMaterial color="#bfe0ff" roughness={0.05} transparent opacity={0.55} /></mesh>
      </group>
      {/* la Virgen sobre la cama, con su veladora */}
      <group position={PT.virgen}>
        <Box p={[0, 0, 0]} s={[0.46, 0.66, 0.04]} c="#3a2414" map={tx.madera} r={0.7} />
        <mesh position={[0, 0, 0.022]}><planeGeometry args={[0.4, 0.6]} /><meshStandardMaterial map={cx.virgen} roughness={0.8} /></mesh>
        <Box p={[0, -0.42, 0.06]} s={[0.36, 0.03, 0.14]} c="#4f2e1c" map={tx.madera} />
        <mesh position={[0, -0.35, 0.08]}><cylinderGeometry args={[0.03, 0.03, 0.1, 14]} /><meshStandardMaterial color="#c7243a" transparent opacity={0.85} emissive="#ff6a3a" emissiveIntensity={0.9} /></mesh>
        <pointLight position={[0, -0.25, 0.2]} intensity={1.8} distance={3.2} decay={1.8} color="#ff9a5a" />
      </group>
      {/* baúl al pie de la cama */}
      <Box p={[2.55, 0.22, 0.8]} s={[0.9, 0.44, 0.42]} c="#6b3a22" map={tx.madera} r={0.7} rad={0.05} />

      {/* ===== caminito de luz (cocina → cama) ===== */}
      {path > 0.01 && Array.from({ length: 46 }, (_, i) => { const k = i / 45; if (k > path) return null; const q = pathAt(k); const fade = Math.min(1, (path - k) * 8 + 0.15);
        return <group key={"pa" + i} position={[q.x, q.y + 0.02, q.z]}>
          <mesh><sphereGeometry args={[0.028, 10, 8]} /><meshBasicMaterial color="#ffd38a" toneMapped={false} transparent opacity={Math.min(1, fade)} /></mesh>
          <sprite scale={[0.3, 0.3, 1]}><spriteMaterial map={tx.dot} color="#ffb860" transparent opacity={0.55 * Math.min(1, fade)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>
        </group>; })}

      <RelojPendulo t={t} tx={tx} carat={cx.carat} glow={relojGlow} />

      {/* ===================== AFUERA ===================== */}
      <Naranjo p={PT.naranjo} t={t} />
      <Nopal p={[6.0, 0, 1.4]} s={1.2} seed={1} /><Nopal p={[7.0, 0, 0.6]} s={0.9} seed={2} /><Nopal p={[-5.4, 0, 0.9]} s={1.1} seed={3} />
      {([[5.2, 1.6, "#e0304a"], [5.5, 2.0, "#f06aa0"], [-4.9, 1.7, "#e0304a"], [4.9, 2.2, "#c7243a"]] as [number, number, string][]).map(([x, z, c], i) => <Geranio key={i} p={[x, 0, z]} c={c} i={i} />)}
      {Array.from({ length: 36 }, (_, i) => <mesh key={"cv" + i} position={[-8 + i * 0.5, 0.55, -6]} castShadow><cylinderGeometry args={[0.025, 0.03, 1.1 + rnd(i, 1) * 0.3, 5]} /><meshStandardMaterial color="#6b5236" roughness={1} /></mesh>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={"m" + i} position={[-30 + i * 13, 0, -34 - rnd(i, 3) * 8]}><coneGeometry args={[10 + rnd(i, 1) * 6, 6 + rnd(i, 2) * 5, 7]} /><meshStandardMaterial color={new THREE.Color("#5a6a40").lerp(sky, 0.55).getHex()} roughness={1} flatShading /></mesh>)}
      {n > 0.02 && <><mesh position={PT.luna}><sphereGeometry args={[1.1, 32, 24]} /><meshBasicMaterial color="#f4f1e2" toneMapped={false} transparent opacity={n} /></mesh>
        <sprite position={PT.luna} scale={[7, 7, 1]}><spriteMaterial map={tx.dot} color="#b8c8ff" transparent opacity={0.45 * n} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[cx.stars, 3]} /></bufferGeometry><pointsMaterial color="#ffffff" size={0.5} sizeAttenuation transparent opacity={0.9 * n} toneMapped={false} /></points></>}
      {d > 0.02 && <><mesh position={[-40, 6, -50]}><sphereGeometry args={[3, 32, 24]} /><meshBasicMaterial color="#ffd08a" toneMapped={false} transparent opacity={d} /></mesh>
        <sprite position={[-40, 6, -50]} scale={[40, 40, 1]}><spriteMaterial map={tx.dot} color="#ff9a5a" transparent opacity={0.5 * d} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite></>}
    </ThreeCanvas>
  );
};
