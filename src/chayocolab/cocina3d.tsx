// chayo3 · EL MUNDO: la cocina de adobe de Doña Chayo en Michoacán, en CORTE (sin la pared de adelante), y el patio de la fiesta.
// Fogón de leña con comal contra la pared del fondo, ollas de barro y peltre colgadas, repisa con jarros, ventana/lado abierto
// al patio con el limonero. EN EL CENTRO: la MESA DE FIESTA con mantel bordado, la cazuela grande de mole (con sus "ojitos" de
// grasa) y SIETE platos de barro, uno por secreto. El recetario de la abuela sobre la mesa. Afuera: el patio de la boda
// (mesas largas, papel picado, foquitos). UNA escena y UNA cámara para todo el video; eventos clavados a la voz.
// Render SÓLO en el farm (acá sólo stills).
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

// ---------------- puntos del mundo ----------------
export const TABLE_Y = 0.8;
export const PLATES: V[] = Array.from({ length: 7 }, (_, i) => [-1.17 + i * 0.39, TABLE_Y + 0.02, 0.33] as V); // fila de 7 platos al frente de la mesa
export const PT = {
  cazuela: [0, TABLE_Y + 0.16, -0.17] as V,
  comal: [-1.3, 1.02, -2.55] as V,
  fire: [-1.3, 0.42, -2.45] as V,
  libro: [0.88, TABLE_Y + 0.03, -0.3] as V,
  lado: [3.9, 1.6, -0.6] as V,          // el lado abierto al patio
  limon: [5.6, 1.6, -1.8] as V,
  patio: [9.5, 1.0, 1.0] as V,
  plates: PLATES,
};

// ---------------- CÁMARA (keyframes globales; las del resto del video se agregan en KEYS_REST) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); }; // suma (minuto 1 + resto)
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
    const gr = g.createRadialGradient(512, 512, 40, 512, 512, 520); gr.addColorStop(0, "#5a2c16"); gr.addColorStop(1, "#2e1408"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 420; i++) { g.fillStyle = `rgba(${130 + rnd(i, 1) * 50},${70 + rnd(i, 2) * 30},${35},${0.08 + rnd(i, 3) * 0.12})`; g.beginPath(); g.ellipse(rnd(i, 4) * 1024, rnd(i, 5) * 1024, 6 + rnd(i, 6) * 40, 3 + rnd(i, 7) * 14, rnd(i, 8) * 3, 0, 6.3); g.fill(); }
    // vetas de la pala
    g.strokeStyle = "rgba(150,90,50,.3)"; g.lineWidth = 6;
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
        return <mesh key={i} position={[Math.cos(a) * d, Math.sin(a) * d, 0.004 * r + 0.0015]}><circleGeometry args={[s, 20]} /><meshPhysicalMaterial color="#8a5228" emissive="#2a1206" emissiveIntensity={0.25} roughness={0.05} clearcoat={1} clearcoatRoughness={0.03} transparent opacity={0.7} /></mesh>;
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


// ---------------- ESTACIONES del resto del video (comal, sartén, charola, remojo, limonero, mercado) ----------------
const COMAL: V = [-1.3, 0.943, -2.5];
const CHAROLA: V = [-0.72, TABLE_Y, 0.02];
const REMOJO: V = [0.52, TABLE_Y, -0.55];
export const PT2 = { comal: COMAL, charola: CHAROLA, remojo: REMOJO, mercado: [6.6, 0.9, 5.4] as V, charco: [5.25, 0.02, -1.25] as V };
const FRY_COL = ["#e3c27a", "#c0874a", "#3a1a10", "#b0601c", "#d9a54a", "#d69a52"];
const cardTex = (lines: [string, number, string][], bg: string, w = 512, h = 256) => mk(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
  lines.forEach(([tx, y, f]) => { g.font = f; g.fillStyle = "#2a120c"; g.textAlign = "center"; g.fillText(tx, w / 2, y); });
});
const useGuiaTapa = (ready: boolean) => useMemo(() => {
  if (!ready) return undefined;
  return mk(768, 576, (g) => {
    const gr = g.createLinearGradient(0, 0, 768, 576); gr.addColorStop(0, "#ff7eb0"); gr.addColorStop(0.5, "#ffd36e"); gr.addColorStop(1, "#7fe3d2"); g.fillStyle = gr; g.fillRect(0, 0, 768, 576);
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,255,255,${0.12 + rnd(i, 1) * 0.15})`; g.beginPath(); g.arc(rnd(i, 2) * 768, rnd(i, 3) * 576, 20 + rnd(i, 4) * 60, 0, 6.3); g.fill(); }
    g.fillStyle = "#3a0f2a"; g.textAlign = "center";
    g.font = `700 64px ${HAND}`; g.fillText("Las 5 Ollas de", 384, 150);
    g.font = `900 112px Georgia, serif`; g.fillText("DOÑA CHAYO", 384, 280);
    g.font = `700 54px ${HAND}`; g.fillText("recetas de rancho, con sus pesos", 384, 380);
    g.fillStyle = "#c2185b"; g.beginPath(); g.roundRect(214, 430, 340, 80, 40); g.fill();
    g.fillStyle = "#fff"; g.font = `800 44px Georgia, serif`; g.fillText("LIBRO 5 DE 5", 384, 485);
  }, [1, 1]);
}, [ready]);
const precioTex = (nom: string, $: string, bg: string) => cardTex([[nom, 100, "900 78px Georgia, serif"], [$, 210, "900 96px Georgia, serif"]], bg);

type EstP = { t: number; tx: ReturnType<typeof useRancho>; chiles: number; toast: number; burnt: number; sarten: number; fry: number; charola: number; remojo: number; tapa: number; especias: number; verduras: number; aguaLimon: number; smoke: number };
const Estaciones: React.FC<EstP> = (q) => {
  const { t, tx } = q;
  const signs = useMemo(() => [precioTex("ANCHO", "$280 kg", "#f2c14e"), precioTex("MULATO", "$320 kg", "#ff9a6a"), precioTex("PASILLA", "$320 kg", "#9fe0c8")], []);
  const toldo = useMemo(() => mk(512, 128, (g) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#f6e7c8" : "#e83a62"; g.fillRect(i * 32, 0, 32, 128); } }, [3, 1]), []);
  const chileCol = new THREE.Color("#2c0805").lerp(new THREE.Color("#8a2412"), q.toast);
  const pile = q.chiles > 6;
  const SACOS: [string, number][] = [["#3a0c08", 0], ["#170605", 1], ["#241008", 2]];
  return (
    <group>
      {/* ===== CHILES abiertos en el comal ===== */}
      {q.chiles > 0.01 && Array.from({ length: pile ? 14 : Math.ceil(q.chiles) }, (_, i) => {
        const k = pile ? 1 : Math.min(1, q.chiles - i), a = (i / (pile ? 14 : 6)) * 6.283 + 0.4, d = pile ? 0.05 + rnd(i, 71) * 0.12 : 0.24;
        const isB = i === 0 && q.burnt > 0.01, c = isB ? chileCol.clone().lerp(new THREE.Color("#070403"), q.burnt) : chileCol;
        if (k <= 0.01) return null;
        return <mesh key={"ch" + i} position={[COMAL[0] + Math.cos(a) * d, COMAL[1] + 0.008 + (pile ? Math.floor(i / 5) * 0.018 : 0) + (1 - k) * 0.25, COMAL[2] + Math.sin(a) * d]} rotation={[pile ? (rnd(i, 72) - 0.5) * 0.6 : 0, a + 1.2, pile ? (rnd(i, 73) - 0.5) * 0.5 : 0]} scale={[1, 0.13 + (isB ? 0.1 * q.burnt : 0), 0.62]} castShadow>
          <sphereGeometry args={[0.075, 18, 10]} /><meshPhysicalMaterial color={c} roughness={0.38 - 0.15 * q.toast + (isB ? 0.5 * q.burnt : 0)} clearcoat={0.6} clearcoatRoughness={0.35} /></mesh>;
      })}
      {/* humo negro del chile quemado */}
      {q.burnt > 0.05 && Array.from({ length: 12 }, (_, i) => { const life = 2.2, ph = ((t + rnd(i, 81) * life) % life) / life; return <sprite key={"hb" + i} position={[COMAL[0] + 0.22 + Math.sin(t + i) * 0.05 * ph, COMAL[1] + 0.05 + ph * 0.9, COMAL[2] + 0.1]} scale={[0.15 + ph * 0.35, 0.15 + ph * 0.35, 1]}><spriteMaterial map={tx.steam} color="#1a1410" transparent opacity={q.burnt * 0.9 * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>; })}
      {/* humo de la cazuela con fuego alto */}
      {q.smoke > 0.05 && Array.from({ length: 12 }, (_, i) => { const life = 2.6, ph = ((t + rnd(i, 91) * life) % life) / life; return <sprite key={"hs" + i} position={[PT.cazuela[0] + (rnd(i, 92) - 0.5) * 0.3, TABLE_Y + 0.25 + ph * 1.0, PT.cazuela[2] + (rnd(i, 93) - 0.5) * 0.3]} scale={[0.2 + ph * 0.5, 0.2 + ph * 0.5, 1]}><spriteMaterial map={tx.steam} color="#2a221c" transparent opacity={q.smoke * 0.85 * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>; })}

      {/* ===== SARTÉN con manteca en el comal ===== */}
      {q.sarten > 0.01 && <group position={[COMAL[0], COMAL[1] + 0.005 + (1 - Math.min(1, q.sarten)) * 0.3, COMAL[2]]}>
        <Lathe prof={[[0, 0], [0.15, 0], [0.19, 0.03], [0.2, 0.055], [0.205, 0.06]]} p={[0, 0, 0]} c="#1c1a19" r={0.45} m={0.5} inner="#242120" />
        <mesh position={[0.33, 0.045, 0]} rotation={[0, 0, Math.PI / 2 - 0.1]}><cylinderGeometry args={[0.014, 0.016, 0.26, 8]} /><meshStandardMaterial color="#3a2a1e" roughness={0.8} /></mesh>
        <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.165, 40]} /><meshPhysicalMaterial color="#e8d9a8" roughness={0.12} clearcoat={1} transparent opacity={0.85} /></mesh>
        {Array.from({ length: q.fry >= 9 ? 42 : 22 }, (_, i) => {
          const kind = q.fry >= 9 ? i % 6 : Math.min(5, Math.floor(q.fry)), a = rnd(i, 101) * 6.283, d = Math.sqrt(rnd(i, 102)) * 0.13;
          const jump = kind === 0 ? Math.max(0, Math.sin(t * 9 + i * 1.7)) * 0.03 : 0;
          const puff = kind === 2 ? 1 + 0.6 * win(((t * 0.6 + rnd(i, 103)) % 1), 0.2, 0.7) : 1;
          const burnt = q.fry >= 9 && i % 3 === 0;
          const col = burnt ? new THREE.Color("#140906") : new THREE.Color(FRY_COL[kind]).lerp(new THREE.Color(q.fry >= 9 && i % 3 === 1 ? "#f3ead2" : FRY_COL[kind]), 0.6);
          const geo = kind === 0 ? <sphereGeometry args={[0.005, 6, 4]} /> : kind === 3 ? <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} /> : kind === 4 ? <boxGeometry args={[0.04, 0.004, 0.03]} /> : kind === 5 ? <boxGeometry args={[0.05, 0.012, 0.035]} /> : <sphereGeometry args={[kind === 2 ? 0.009 * puff : 0.011, 8, 6]} />;
          return <mesh key={"f" + i} position={[Math.cos(a) * d, 0.03 + jump, Math.sin(a) * d]} rotation={[0, a, 0]} scale={kind === 1 ? [1, 0.8, 1.5] : [1, 1, 1]}>{geo}<meshStandardMaterial color={col} roughness={0.5} /></mesh>;
        })}
        {Array.from({ length: 16 }, (_, i) => { const ph = ((t * 2 + rnd(i, 111)) % 1); const a = rnd(i, 112) * 6.283, d = Math.sqrt(rnd(i, 113)) * 0.15; return <mesh key={"b" + i} position={[Math.cos(a) * d, 0.026, Math.sin(a) * d]}><sphereGeometry args={[0.004 * Math.sin(ph * Math.PI) + 0.0005, 6, 4]} /><meshPhysicalMaterial color="#fff6dc" roughness={0.05} clearcoat={1} transparent opacity={0.8} /></mesh>; })}
      </group>}

      {/* ===== ESPECIAS enteras en el comal ===== */}
      {q.especias > 0.01 && <group position={[COMAL[0] - 0.05, COMAL[1] + 0.006, COMAL[2] + 0.05]} scale={Math.min(1.08, q.especias * 1.2)}>
        <mesh position={[0, 0.01, -0.12]} rotation={[Math.PI / 2, 0, 0.3]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.1, 10, 1, true]} /><meshStandardMaterial color="#8a4a22" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={"cl" + i} position={[0.08 + (i % 3) * 0.025, 0.006, -0.02 + Math.floor(i / 3) * 0.03]} rotation={[0, i, Math.PI / 2]}><cylinderGeometry args={[0.003, 0.0015, 0.022, 5]} /><meshStandardMaterial color="#3a1e10" roughness={0.9} /></mesh>)}
        {Array.from({ length: 16 }, (_, i) => <mesh key={"pi" + i} position={[-0.1 + (i % 4) * 0.022, 0.006, 0.05 + Math.floor(i / 4) * 0.02]}><sphereGeometry args={[i < 6 ? 0.007 : 0.0045, 8, 6]} /><meshStandardMaterial color={i < 6 ? "#6a3a1e" : "#1a1210"} roughness={0.7} /></mesh>)}
        {Array.from({ length: 20 }, (_, i) => <mesh key={"cm" + i} position={[0.05 + rnd(i, 121) * 0.06, 0.003, 0.07 + rnd(i, 122) * 0.05]} rotation={[0, rnd(i, 123) * 3, Math.PI / 2]}><capsuleGeometry args={[0.0015, 0.005, 2, 4]} /><meshStandardMaterial color="#8a6a3a" /></mesh>)}
      </group>}

      {/* ===== VERDURAS tatemándose en el comal ===== */}
      {q.verduras > 0.01 && <group position={[COMAL[0] + 0.02, COMAL[1], COMAL[2]]} scale={Math.min(1.06, q.verduras * 1.3)}>
        {[].map((i: number) => <mesh key={"j" + i} position={[-0.24 + i * 0.1, 0.04, -0.12]} castShadow><sphereGeometry args={[0.045, 18, 14]} /><meshPhysicalMaterial color={new THREE.Color("#c8261a").lerp(new THREE.Color("#2a0d08"), win(q.verduras, 0.5, 1) * (0.4 + 0.3 * rnd(i, 131)))} roughness={0.3} clearcoat={0.8} /></mesh>)}
        {[0, 1].map((i) => <mesh key={"v" + i} position={[-0.16 + i * 0.1, 0.025, 0.02]} castShadow><sphereGeometry args={[0.028, 16, 12]} /><meshPhysicalMaterial color={new THREE.Color("#efe4cf").lerp(new THREE.Color("#22180f"), win(q.verduras, 0.5, 1) * 0.42)} roughness={0.5} clearcoat={0.3} /></mesh>)}
        <mesh position={[0.14, 0.02, -0.05]} castShadow><sphereGeometry args={[0.05, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={new THREE.Color("#efe6d6").lerp(new THREE.Color("#3a2a1a"), win(q.verduras, 0.55, 1) * 0.38)} roughness={0.6} /></mesh>
        <mesh position={[0.15, 0.03, 0.1]} castShadow scale={[1, 0.85, 1]}><sphereGeometry args={[0.035, 14, 10]} /><meshStandardMaterial color={new THREE.Color("#f3eadb").lerp(new THREE.Color("#4a3a2a"), win(q.verduras, 0.55, 1) * 0.32)} roughness={0.7} /></mesh>
      </group>}

      {/* ===== CHAROLA de cositas fritas (altar de colores) ===== */}
      {q.charola > 0.01 && <group position={CHAROLA}>
        <Box p={[0, 0.012, 0]} s={[0.36, 0.022, 0.21]} c="#6b4529" map={tx.madera} r={0.8} rad={0.006} />
        {FRY_COL.map((c, i) => { const k = Math.min(1.1, Math.max(0, (q.charola - i) * 1.4)); if (k <= 0.01) return null; return (
          <mesh key={"pl" + i} position={[-0.12 + (i % 3) * 0.12, 0.024, -0.05 + Math.floor(i / 3) * 0.1]} scale={[k, k * 0.55, k]} castShadow><sphereGeometry args={[0.04, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={c} roughness={0.55} /></mesh>); })}
      </group>}

      {/* ===== OLLA DE REMOJO en la mesa ===== */}
      {q.remojo > 0.01 && <group position={REMOJO}>
        <Lathe prof={[[0, 0], [0.09, 0], [0.13, 0.04], [0.15, 0.1], [0.155, 0.12], [0.15, 0.125]]} p={[0, 0, 0]} c="#9a4a26" map={tx.barro} r={0.75} inner="#3a1a0c" />
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.145, 40]} /><meshPhysicalMaterial color={new THREE.Color("#c99a62").lerp(new THREE.Color("#2a0f05"), Math.min(1, q.remojo))} roughness={0.08} clearcoat={1} transparent opacity={0.9} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={"rc" + i} position={[(rnd(i, 141) - 0.5) * 0.17, 0.103, (rnd(i, 142) - 0.5) * 0.17]} rotation={[0, rnd(i, 143) * 6, 0]} scale={[1, 0.25, 0.6]}><sphereGeometry args={[0.055, 14, 8]} /><meshPhysicalMaterial color="#5a160a" roughness={0.3} clearcoat={0.8} /></mesh>)}
        <Steam p={[0, 0.11, 0]} t={t} amt={0.8 * (1 - q.tapa)} tex={tx.steam} spread={0.12} h={0.5} n={8} size={0.18} />
        {q.tapa > 0.01 && <group position={[0, 0.11 + (1 - q.tapa) * 0.3, 0]}><Lathe prof={PLATO} p={[0, 0, 0]} c="#a3502a" map={tx.barro} r={0.6} s={0.75} inner="#94461f" /></group>}
      </group>}

      {/* ===== EL AGUA al pie del limonero ===== */}
      {q.aguaLimon > 0.01 && <group position={PT2.charco}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}><circleGeometry args={[0.55 * win(q.aguaLimon, 0.15, 0.9) + 0.001, 40]} /><meshPhysicalMaterial color="#2a1408" roughness={0.15} clearcoat={1} transparent opacity={0.85} /></mesh>
        <group position={[-0.15, 0.85, 0.15]} rotation={[0, 0, -1.6 * win(q.aguaLimon, 0, 0.2) * (1 - win(q.aguaLimon, 0.85, 1))]}>
          <Lathe prof={[[0, 0], [0.09, 0], [0.13, 0.05], [0.14, 0.1], [0.135, 0.105]]} p={[0, 0, 0]} c="#9a4a26" map={tx.barro} r={0.75} inner="#3a1a0c" />
        </group>
        {q.aguaLimon > 0.15 && q.aguaLimon < 0.85 && <mesh position={[-0.05, 0.42, 0.15]}><cylinderGeometry args={[0.02, 0.045, 0.8, 10]} /><meshPhysicalMaterial color="#3a1a0a" roughness={0.1} clearcoat={1} transparent opacity={0.8} /></mesh>}
      </group>}

      {/* ===== EL MERCADO: puesto de chiles secos ===== */}
      <group position={[6.6, 0, 5.4]}>
        <Box p={[0, 0.72, 0]} s={[2.4, 0.06, 0.95]} c="#6b4529" map={tx.madera} r={0.85} />
        {[[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]].map(([x, z]) => <Box key={"mp" + x + z} p={[x, 0.36, z]} s={[0.07, 0.72, 0.07]} c="#4f321d" map={tx.madera} />)}
        {[-1.15, 1.15].map((x) => <Box key={"mt" + x} p={[x, 1.25, -0.5]} s={[0.06, 2.5, 0.06]} c="#4f321d" map={tx.madera} />)}
        <mesh position={[0, 2.35, -0.05]} rotation={[-0.35, 0, 0]}><planeGeometry args={[2.7, 1.2]} /><meshStandardMaterial map={toldo} side={THREE.DoubleSide} roughness={0.9} /></mesh>
        {SACOS.map(([c, i]) => (
          <group key={"cs" + i} position={[-0.75 + i * 0.75, 0.75, 0.02]}>
            <Lathe prof={[[0, 0], [0.24, 0], [0.3, 0.12], [0.31, 0.26], [0.36, 0.3]]} p={[0, 0, 0]} c="#c9ad7a" r={1} />
            {Array.from({ length: 30 }, (_, k) => { const a = rnd(k + i * 40, 151) * 6.283, d = Math.sqrt(rnd(k + i * 40, 152)) * 0.27, hgt = 0.27 + (0.27 - d) * 0.6; return <mesh key={k} position={[Math.cos(a) * d, hgt, Math.sin(a) * d]} rotation={[rnd(k, 153) * 3, rnd(k, 154) * 3, 0]} scale={i === 2 ? [0.6, 0.6, 2.6] : [1, 0.55, 1.8]}><sphereGeometry args={[0.04, 10, 6]} /><meshPhysicalMaterial color={c} roughness={0.4} clearcoat={0.5} /></mesh>; })}
            <mesh position={[0, 0.62, 0.05]} rotation={[-0.15, 0, 0]}><planeGeometry args={[0.46, 0.23]} /><meshStandardMaterial map={signs[i]} roughness={0.8} /></mesh>
            <mesh position={[0, 0.5, 0.05]}><cylinderGeometry args={[0.005, 0.005, 0.25, 4]} /><meshStandardMaterial color="#5a4330" /></mesh>
          </group>))}
        {[0, 1].map((r) => Array.from({ length: 12 }, (_, k) => <mesh key={"ri" + r + k} position={[-1.0 + r * 2.0, 2.0 - k * 0.09, -0.45]} rotation={[0, 0, 0.2 * Math.sin(k)]} scale={[0.5, 1.6, 0.5]}><sphereGeometry args={[0.035, 8, 6]} /><meshPhysicalMaterial color="#8a160a" roughness={0.35} clearcoat={0.6} /></mesh>))}
      </group>
    </group>
  );
};

// ---------------- props del mundo que cambian con el video ----------------
export type WorldProps = {
  t: number;
  night?: number;          // 0 día · 1 noche (luna)
  dawn?: number;           // 0..1 madrugada (azul oscuro, antes de las 5)
  fire?: number;           // intensidad del fogón
  steamCaz?: number;       // vapor de la cazuela
  steamComal?: number;     // vapor del comal (bajarlo en tomas cercanas)
  ojitos?: number;         // 0..1 tamaño de los ojitos de grasa
  plateOn?: number[];      // 0..1 por plato (brillo / servido)
  plateServed?: number[];  // 0..1 mole servido en cada plato
  plateFill?: number[];    // 0..1 plato puesto con comida (mole, arroz, tortilla) sin el "servido" del secreto
  plateSteam?: number[];   // vapor por plato
  book?: { open: number; flip: number; pages: { l: string[]; r: string[] }[] };
  sugar?: number;          // granos de azúcar cayendo a la cazuela (0..1)
  pour?: number;           // la cazuela se inclina y tira media olla (0..1)
  patioLights?: number;
  partyPeople?: number;
  top?: number;            // vista cenital: se esconden papel picado y lámpara
  // ---- estaciones del resto del video ----
  chiles?: number;         // chiles abiertos en el comal (0..6; >6 = "en montón")
  toast?: number;          // 0 crudo .. 1 tostado (rojizo claro)
  burnt?: number;          // 0..1 un chile se quema (negro + humo negro)
  sarten?: number;         // 0..1 sartén con manteca en el comal
  fry?: number;            // qué se fríe: 0 ajonjolí 1 cacahuate 2 pasas 3 plátano 4 tortilla 5 bolillo · 9 = todo junto
  charola?: number;        // montoncitos dorados en la charola (0..6)
  remojo?: number;         // 0..1 olla de remojo: el agua se oscurece
  tapa?: number;           // 0..1 platito encima de los chiles
  especias?: number;       // 0..1 especias enteras en el comal
  verduras?: number;       // 0..1 jitomate/tomate/cebolla/ajo (>0.5 se tatema)
  aguaLimon?: number;      // 0..1 el agua del remojo al pie del limonero
  guia?: number;           // 1 = el libro de la mesa es la GUÍA de Chayo
  raw?: number;            // 0..1 el mole de la cazuela todavía crudo (rojo mate)
  smoke?: number;          // humo negro de la cazuela (fuego alto)
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, night = 0, dawn = 0, fire = 1, steamCaz = 1, steamComal = 1, ojitos = 1, plateOn = [], plateServed = [], plateFill = [], plateSteam = [], sugar = 0, pour = 0, patioLights = 0, chiles = 0, toast = 0, burnt = 0, sarten = 0, fry = 0, charola = 0, remojo = 0, tapa = 0, especias = 0, verduras = 0, aguaLimon = 0, guia = 0, raw = 0, smoke = 0 } = pr;
  const tx = useRancho();
  const [fontOk, setFontOk] = useState(false);
  useMemo(() => { const h = delayRender("letra a mano"); handReady().then(() => { setFontOk(true); requestAnimationFrame(() => continueRender(h)); }).catch(() => { setFontOk(true); continueRender(h); }); }, []);
  const pages = pr.book?.pages ?? [{ l: [""], r: [""] }];
  const bookTex = useRecetario(pages, fontOk);
  const guiaTex = useGuiaTapa(fontOk);
  const dark = Math.max(night, dawn);
  const skyDay = new THREE.Color("#f3c48a"), skyNight = new THREE.Color("#0a1022"), skyDawn = new THREE.Color("#1b2742");
  const sky = skyDay.clone().lerp(skyDawn, dawn).lerp(skyNight, night);
  const sunI = 2.6 * (1 - dark);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.55 + 0.25 * dark} threshold={0.86 - 0.1 * dark} exposure={1.0 - 0.15 * dark} env={0.22 * (1 - dark) + 0.04} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 9, 40]} />
      <hemisphereLight args={[new THREE.Color("#ffd8a8").lerp(new THREE.Color("#33456e"), dark).getHex(), 0x2a1a10, 0.55 - 0.35 * dark]} />
      {/* sol de la tarde entrando por el lado abierto (derecha) */}
      <directionalLight position={[12, 7, 3]} intensity={sunI} color="#ffc98a" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={14} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luna */}
      {night > 0.01 && <directionalLight position={[10, 9, 6]} intensity={1.6 * night} color="#9fb6ff" />}
      {/* foco de la cocina (lámpara de petróleo colgada sobre la mesa) */}
      <pointLight position={[0.1, 2.35, 0.1]} intensity={1.6 + 2.2 * dark} distance={6} decay={1.5} color="#ffbe72" castShadow shadow-bias={-0.0004} />

      {/* ===== piso ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[8, 6.2]} /><meshStandardMaterial map={tx.tierra} color="#d9c2a2" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial map={tx.patio} color="#e2c9a0" roughness={1} /></mesh>

      {/* ===== paredes de adobe (fondo e izquierda; la derecha es el lado abierto con pilar de madera) ===== */}
      <Box p={[0, 1.6, -3.1]} s={[8, 3.2, 0.32]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[-4, 1.6, 0]} s={[0.32, 3.2, 6.5]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      {/* media pared derecha (atrás) + pilares y viga del lado abierto */}
      <Box p={[4, 1.6, -2.4]} s={[0.32, 3.2, 1.6]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[4, 0.45, 0.6]} s={[0.3, 0.9, 4.4]} c="#e8cfae" map={tx.adobe} r={1} rad={0.04} />
      {[-1.5, 2.8].map((z) => <Box key={z} p={[4, 1.6, z]} s={[0.18, 3.2, 0.18]} c="#6b4529" map={tx.madera} r={0.95} />)}
      <Box p={[4, 3.1, 0]} s={[0.22, 0.22, 6.5]} c="#5a3a22" map={tx.madera} r={0.95} />
      {/* vigas del techo y carrizo (sólo la parte de atrás, la cámara entra por adelante) */}
      {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((x) => <Box key={x} p={[x, 3.15, -0.6]} s={[0.16, 0.16, 5.2]} c="#4f321d" map={tx.madera} r={0.95} />)}
      <Box p={[0, 3.3, -1.8]} s={[8.2, 0.08, 2.8]} c="#a8875a" r={1} rad={0.01} />

      {/* ===== FOGÓN de adobe con comal (pared del fondo, a la izquierda) ===== */}
      <group position={[-1.3, 0, -2.55]}>
        <Box p={[0, 0.45, 0]} s={[1.9, 0.9, 0.9]} c="#d9b48c" map={tx.adobe} r={1} rad={0.08} />
        {/* boca del fogón (hueco negro con brasas) */}
        <mesh position={[0, 0.3, 0.452]}><planeGeometry args={[0.75, 0.42]} /><meshStandardMaterial color="#120806" roughness={1} emissive="#ff4a10" emissiveIntensity={0.18 * fire} /></mesh>
        {/* comal negro grande */}
        <mesh position={[0, 0.93, 0.05]} castShadow receiveShadow><cylinderGeometry args={[0.52, 0.5, 0.025, 48]} /><meshStandardMaterial color="#1a1716" roughness={0.55} metalness={0.4} /></mesh>
        {/* olla de barro tiznada en la hornilla de al lado */}
        <Lathe prof={OLLA} p={[0.68, 0.9, -0.05]} c="#6a3a22" map={tx.barro} r={0.8} s={0.9} />
        {/* humo/vapor que sube del comal */}
        <Steam p={[0, 0.95, 0.05]} t={t} amt={0.55 * fire * steamComal} tex={tx.steam} spread={0.5} h={1.6} n={12} size={0.5} />
      </group>
      <Fire p={[-1.3, 0.12, -2.08]} t={t} amt={fire} dot={tx.dot} />
      {/* leña apilada junto al fogón */}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-2.65 + (i % 3) * 0.12, 0.06 + Math.floor(i / 3) * 0.11, -2.55]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.055, 0.06, 0.7, 7]} /><meshStandardMaterial color={["#5a3b22", "#6b4a2c", "#4a301b"][i % 3]} roughness={1} /></mesh>)}

      {/* ===== ollas de peltre y barro colgadas (pared del fondo, a la derecha del fogón) ===== */}
      {[[0.5, 2.25, "#c8551f"], [1.05, 2.3, "#a3502a"], [1.6, 2.2, "#c8551f"], [2.2, 2.28, "#7a3a1f"], [2.75, 2.2, "#c8551f"]].map(([x, y, c], i) => (
        <group key={i} position={[x as number, y as number, -2.86]} rotation={[Math.PI / 2 - 0.08, 0, 0]}>
          <Lathe prof={i % 2 ? CAZUELA : PELTRE} p={[0, 0, 0]} c={c as string} r={i % 2 ? 0.75 : 0.35} m={i % 2 ? 0 : 0.15} map={i % 2 ? tx.barro : undefined} s={i % 2 ? 0.55 : 0.75} inner={i % 2 ? undefined : "#1e1a18"} />
        </group>
      ))}
      {[0.5, 1.05, 1.6, 2.2, 2.75].map((x) => <mesh key={x} position={[x, 2.48, -2.93]}><cylinderGeometry args={[0.012, 0.012, 0.08, 5]} /><meshStandardMaterial color="#222" metalness={0.6} /></mesh>)}
      {/* repisa con jarros y frascos de especias */}
      <Box p={[1.6, 1.45, -2.82]} s={[2.4, 0.06, 0.34]} c="#5a3a22" map={tx.madera} r={0.9} />
      {Array.from({ length: 9 }, (_, i) => <Lathe key={i} prof={JARRO} p={[0.6 + i * 0.25, 1.48, -2.8]} c={["#a3502a", "#8a3f20", "#c2552d"][i % 3]} map={tx.barro} s={0.9 + 0.3 * rnd(i, 3)} />)}
      {/* canasta de chiles secos en el piso, junto a la mesa */}
      <group position={[-2.6, 0, 0.8]}>
        <Lathe prof={[[0, 0], [0.28, 0], [0.34, 0.22], [0.36, 0.24]]} p={[0, 0, 0]} c="#b08a52" r={1} />
        {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.5, 0.2 + rnd(i, 2) * 0.08, (rnd(i, 3) - 0.5) * 0.5]} rotation={[rnd(i, 4) * 3, rnd(i, 5) * 3, rnd(i, 6) * 3]} scale={[1, 1, 2.2]}><sphereGeometry args={[0.035, 8, 6]} /><meshStandardMaterial color={["#3a0c08", "#5a1408", "#24100c"][i % 3]} roughness={0.45} /></mesh>)}
      </group>
      {/* molcajete en un banco */}
      <group position={[-3.3, 0, -0.9]}>
        <Box p={[0, 0.25, 0]} s={[0.5, 0.5, 0.5]} c="#5a3a22" map={tx.madera} r={0.9} />
        <Lathe prof={[[0, 0], [0.1, 0], [0.12, 0.03], [0.16, 0.1], [0.165, 0.14], [0.15, 0.15]]} p={[0, 0.5, 0]} c="#2b2a2a" r={0.95} />
      </group>

      {/* ===== LA MESA DE FIESTA en el centro ===== */}
      <group>
        <Box p={[0, TABLE_Y - 0.03, 0]} s={[2.9, 0.06, 1.25]} c="#6b4529" map={tx.madera} r={0.85} />
        {[[-1.35, -0.55], [1.35, -0.55], [-1.35, 0.55], [1.35, 0.55]].map(([x, z]) => <Box key={x + "" + z} p={[x, (TABLE_Y - 0.06) / 2, z]} s={[0.08, TABLE_Y - 0.06, 0.08]} c="#5a3a22" map={tx.madera} />)}
        {/* mantel bordado con caída */}
        <mesh position={[0, TABLE_Y + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.7, 1.1]} /><meshStandardMaterial map={tx.mantel} roughness={0.95} /></mesh>
        {[-1, 1].map((sg) => <mesh key={sg} position={[0, TABLE_Y - 0.12, sg * 0.552]} rotation={[0, sg > 0 ? 0 : Math.PI, 0]} receiveShadow><planeGeometry args={[2.7, 0.24]} /><meshStandardMaterial map={tx.mantel} roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
        {/* bancas */}
        {[-1, 1].map((sg) => <Box key={"b" + sg} p={[0, 0.42, sg * 0.95]} s={[2.6, 0.06, 0.32]} c="#5a3a22" map={tx.madera} />)}
        {[-1, 1].flatMap((sg) => [-1.1, 1.1].map((x) => <Box key={"bp" + sg + x} p={[x, 0.2, sg * 0.95]} s={[0.07, 0.4, 0.26]} c="#4f321d" map={tx.madera} />))}

        {/* LA CAZUELA de mole */}
        <group position={[PT.cazuela[0], TABLE_Y, PT.cazuela[2]]} rotation={[0, 0, -pour * 0.9]}>
          <Lathe prof={CAZUELA} p={[0, 0, 0]} c="#8a3f20" map={tx.barro} r={0.7} s={0.95} inner="#2a120c" />
          {/* asas */}
          {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.385, 0.15, 0]} rotation={[0, 0, sg * 0.3]}><torusGeometry args={[0.05, 0.016, 8, 16, Math.PI]} /><meshStandardMaterial color="#8a3f20" map={tx.barro} roughness={0.7} /></mesh>)}
          <group position={[0, 0.155, 0]}><MoleSurface r={0.345} t={t} map={tx.mole} ojitos={ojitos * (1 - raw)} raw={raw} /></group>
          {/* pala de madera recargada */}
          <mesh position={[-0.27, 0.36, -0.12]} rotation={[-0.3, 0, 0.75]} castShadow><boxGeometry args={[0.028, 0.7, 0.01]} /><meshStandardMaterial map={tx.madera} color="#c09060" roughness={0.8} /></mesh>
          {/* ajonjolí en la orilla */}
          {Array.from({ length: 18 }, (_, i) => { const a = rnd(i, 51) * 6.283, d = 0.22 + rnd(i, 52) * 0.1; return <mesh key={i} position={[Math.cos(a) * d, 0.163, Math.sin(a) * d]} rotation={[-Math.PI / 2, 0, a]}><circleGeometry args={[0.0032, 6]} /><meshStandardMaterial color="#f0dca8" /></mesh>; })}
        </group>
        {/* chorro de mole que se tira (64 s) */}
        {pour > 0.35 && <mesh position={[0.48, TABLE_Y - 0.1 + 0.05, -0.05]}><cylinderGeometry args={[0.035, 0.05, 0.55 * win(pour, 0.35, 0.6), 10]} /><meshPhysicalMaterial color="#2a0f06" roughness={0.3} clearcoat={1} /></mesh>}
        {pour > 0.01 && <group position={[0.55, 0, -0.05]}><Lathe prof={[[0, 0], [0.16, 0], [0.18, 0.3], [0.19, 0.31]]} p={[0, 0, 0]} c="#9aa0a4" r={0.4} m={0.6} inner="#2a2622" /></group>}
        <Steam p={[0, TABLE_Y + 0.2, PT.cazuela[2]]} t={t} amt={steamCaz * (1 - pour)} tex={tx.steam} spread={0.35} h={1.2} n={20} size={0.38} />
        {/* azúcar que cae a la cazuela */}
        {sugar > 0.01 && Array.from({ length: 70 }, (_, i) => { const life = 0.9, ph = ((t * 1.2 + rnd(i, 61) * life) % life) / life; return <mesh key={i} position={[0.05 + (rnd(i, 62) - 0.5) * 0.06, TABLE_Y + 0.75 - ph * 0.58, PT.cazuela[2] + (rnd(i, 63) - 0.5) * 0.06]}><boxGeometry args={[0.006, 0.006, 0.006]} /><meshStandardMaterial color="#fffaf0" emissive="#ffffff" emissiveIntensity={0.15} transparent opacity={sugar} /></mesh>; })}
        {sugar > 0.01 && <mesh position={[0.05, TABLE_Y + 0.8, PT.cazuela[2]]} rotation={[0, 0, 2.2]}><group><mesh position={[0, 0.12, 0]}><boxGeometry args={[0.02, 0.24, 0.01]} /><meshStandardMaterial color="#b9b9b9" metalness={0.7} roughness={0.3} /></mesh><mesh><sphereGeometry args={[0.04, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.25} side={THREE.DoubleSide} /></mesh></group></mesh>}

        {/* LOS SIETE PLATOS de barro */}
        {PLATES.map((pp, i) => {
          const on = plateOn[i] ?? 0, sv = plateServed[i] ?? 0, fill = plateFill[i] ?? 0;
          return <group key={i} position={pp}>
            <Lathe prof={PLATO} p={[0, 0, 0]} c="#a3502a" map={tx.barro} r={0.6} s={1.0} inner="#94461f" />
            {sv > 0.01 && <group position={[0, 0.03 + 0.006 * sv, 0]}><MoleSurface r={0.11 * (0.6 + 0.4 * sv)} t={t + i} map={tx.mole} ojitos={sv} bub={0.4} /></group>}
            {/* lo de al lado del mole: arroz rojo, una pieza y la tortilla doblada en el borde */}
            {(sv > 0.01 || fill > 0.01) && <group scale={Math.max(sv, fill)}>
              <mesh position={[0.075, 0.035, 0.05]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.055, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f6f0e2" roughness={0.95} /></mesh>
              {Array.from({ length: 10 }, (_, k) => <mesh key={k} position={[0.075 + (rnd(k + i * 13, 71) - 0.5) * 0.08, 0.05 + rnd(k, 72) * 0.012, 0.05 + (rnd(k + i * 13, 73) - 0.5) * 0.08]}><sphereGeometry args={[0.006, 6, 4]} /><meshStandardMaterial color={k % 3 ? "#e7a467" : "#6aa04a"} roughness={0.9} /></mesh>)}
              <mesh position={[-0.02, 0.05, -0.01]} rotation={[0.3, i, 0.2]} scale={[1.3, 0.7, 0.9]}><sphereGeometry args={[0.04, 14, 10]} /><meshPhysicalMaterial color="#6a3a1e" roughness={0.4} clearcoat={0.7} /></mesh>
              <mesh position={[-0.1, 0.045, 0.07]} rotation={[-1.2, 0, 0.5]}><cylinderGeometry args={[0.07, 0.07, 0.004, 24, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#e6cf92" roughness={0.9} side={THREE.DoubleSide} /></mesh>
              {fill > 0.01 && sv <= 0.01 && <group position={[0, 0.03, 0]}><MoleSurface r={0.085} t={t + i} map={tx.mole} ojitos={0.6} bub={0.2} /></group>}
            </group>}
            {/* aro de luz cálida cuando el plato "se enciende" */}
            {on > 0.01 && <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.16, 0.19, 48]} /><meshBasicMaterial color="#ffcf7a" transparent opacity={0.85 * on} toneMapped={false} /></mesh>}
            <Steam p={[0, 0.05, 0]} t={t + i * 0.7} amt={plateSteam[i] ?? 0} tex={tx.steam} spread={0.12} h={0.6} n={8} size={0.2} />
          </group>;
        })}
        {/* tortillas en servilleta bordada y jarro de agua */}
        <group position={[-1.05, TABLE_Y, -0.3]}>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[0.42, 0.42]} /><meshStandardMaterial map={tx.mantel} roughness={0.95} /></mesh>
          {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.02 + i * 0.006, 0]}><cylinderGeometry args={[0.12, 0.12, 0.005, 28]} /><meshStandardMaterial color="#e8d49c" roughness={0.9} /></mesh>)}
        </group>
        <Lathe prof={JARRO} p={[-0.62, TABLE_Y, -0.38]} c="#a3502a" map={tx.barro} s={1.4} />
      </group>

      {/* el recetario de la abuela, sobre la mesa a la derecha */}
      {bookTex.length >= 2 && <Recetario p={PT.libro} rotY={-0.12} open={pr.book?.open ?? 0} flip={pr.book?.flip ?? 0} tex={bookTex} coverCol={guia > 0.5 ? "#e8497a" : "#5b2a22"} label={guia > 0.5 ? guiaTex : undefined} />}

      <Estaciones t={t} tx={tx} chiles={chiles} toast={toast} burnt={burnt} sarten={sarten} fry={fry} charola={charola} remojo={remojo} tapa={tapa} especias={especias} verduras={verduras} aguaLimon={aguaLimon} smoke={smoke} />

      {/* lámpara de petróleo colgada */}
      <group visible={(pr.top ?? 0) < 0.5} position={[0.1, 2.45, 0.1]}>
        <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.005, 0.005, 0.8, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <Lathe prof={[[0, 0], [0.06, 0], [0.08, 0.06], [0.05, 0.2], [0.03, 0.24]]} p={[0, -0.12, 0]} c="#fff1d6" r={0.1} />
        <mesh position={[0, -0.04, 0]}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#ffd38a" toneMapped={false} /></mesh>
      </group>
      {/* papel picado de lado a lado sobre la mesa */}
      {(pr.top ?? 0) < 0.5 && <><Picado a={[-3.8, 2.8, -0.9]} b={[3.8, 2.8, -0.9]} n={26} t={t} tex={tx.picado} />
      <Picado a={[-3.8, 2.7, 0.5]} b={[3.8, 2.7, 0.5]} n={26} t={t + 2} tex={tx.picado} /></>}

      {/* ===== EL PATIO: limonero, cerca de varas, la fiesta ===== */}
      <Limonero p={[5.6, 0, -1.8]} t={t} />
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[4.6 + i * 0.35, 0.55, -4.8]} castShadow><cylinderGeometry args={[0.025, 0.03, 1.1 + rnd(i, 1) * 0.3, 5]} /><meshStandardMaterial color="#6b5236" roughness={1} /></mesh>)}
      {/* mesas largas de la boda con mantel blanco */}
      {[[9.5, -0.6], [9.5, 2.2], [13.5, -0.6], [13.5, 2.2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Box p={[0, 0.76, 0]} s={[3.2, 0.05, 0.9]} c="#f3efe6" r={0.95} rad={0.01} />
          {[-1, 1].map((sg) => <mesh key={sg} position={[0, 0.6, sg * 0.452]}><planeGeometry args={[3.2, 0.32]} /><meshStandardMaterial color="#f3efe6" side={THREE.DoubleSide} roughness={0.95} /></mesh>)}
          {Array.from({ length: 8 }, (_, k) => <Lathe key={k} prof={PLATO} p={[-1.4 + k * 0.4, 0.785, (k % 2 ? 0.22 : -0.22)]} c="#a3502a" map={tx.barro} />)}
          {/* sillas plegables */}
          {Array.from({ length: 8 }, (_, k) => <Box key={"c" + k} p={[-1.4 + k * 0.4, 0.45, (k % 2 ? 0.75 : -0.75)]} s={[0.36, 0.04, 0.36]} c="#c9c4ba" r={0.6} m={0.3} />)}
          {/* invitados (siluetas sencillas) */}
          {(pr.partyPeople ?? 0) > 0.01 && Array.from({ length: 6 }, (_, k) => <group key={"g" + k} position={[-1.2 + k * 0.48, 0, (k % 2 ? 0.78 : -0.78)]}>
            <mesh position={[0, 0.85, 0]} castShadow><capsuleGeometry args={[0.15, 0.4, 4, 10]} /><meshStandardMaterial color={["#2b4a7a", "#7a1f2b", "#e0d4c0", "#3a5a2a", "#c2552d", "#222"][(k + i) % 6]} roughness={0.9} transparent opacity={pr.partyPeople} /></mesh>
            <mesh position={[0, 1.27, 0]} castShadow><sphereGeometry args={[0.1, 14, 10]} /><meshStandardMaterial color="#8a5a3a" roughness={0.8} transparent opacity={pr.partyPeople} /></mesh>
          </group>)}
        </group>
      ))}
      {/* postes de los foquitos y papel picado del patio */}
      {[[7.2, -2.0], [16, -2.0], [7.2, 3.8], [16, 3.8]].map(([x, z]) => <mesh key={x + "" + z} position={[x, 1.6, z]} castShadow><cylinderGeometry args={[0.05, 0.06, 3.2, 6]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>)}
      <Foquitos a={[7.2, 3.1, -2.0]} b={[16, 3.1, 3.8]} n={30} on={patioLights} dot={tx.dot} />
      <Foquitos a={[7.2, 3.1, 3.8]} b={[16, 3.1, -2.0]} n={30} on={patioLights} dot={tx.dot} />
      <Picado a={[7.2, 3.0, 0.9]} b={[16, 3.0, 0.9]} n={30} t={t} tex={tx.picado} sc={1.4} />
      {/* casitas y cerros al fondo */}
      {[[18, -6], [20, 4], [11, -9]].map(([x, z], i) => <Box key={i} p={[x, 1.3, z]} s={[4, 2.6, 3]} c="#d8bf98" map={tx.adobe} r={1} />)}
      {Array.from({ length: 5 }, (_, i) => <mesh key={"m" + i} position={[30 + i * 6, 0, -20 + i * 9]}><coneGeometry args={[9 + rnd(i, 1) * 5, 7 + rnd(i, 2) * 4, 7]} /><meshStandardMaterial color={new THREE.Color("#6f7a4a").lerp(sky, 0.45)} roughness={1} flatShading /></mesh>)}
    </ThreeCanvas>
  );
};
