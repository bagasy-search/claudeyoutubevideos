// lety01 · EL MUNDO: la cocina de adobe de Lety (hija de Doña Chayo), en CORTE (sin pared de adelante), igual que el fondo del avatar:
// a la IZQUIERDA la puerta abierta al patio de tierra (limonero, banca), a la DERECHA el fogón de piedra con plancha y dos hornillas.
// EN EL FOGÓN: la OLLA DE PELTRE AZUL de puntitos con el arroz con leche (aguado → cremoso, quemado, humo), la CUCHARA DE PALO héroe
// con su chorro cremoso. En la MESA de trabajo: lechera, rajas de canela, piloncillo, tazón de arroz, azucarera y la OLLA EN CORTE
// (costra negra / arroz duro / leche aguada). En la pared: la REPISA de 7 VASITOS de barro, uno por secreto.
// De noche el patio es la POSADA (farolitos de papel, piñata de estrella). UNA escena y UNA cámara; todo clavado a la voz.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { handReady } from "./lib";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const smt = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
type V = [number, number, number];

// ---------------- puntos del mundo ----------------
const FOG: V = [1.1, 0, -2.5];            // base del fogón
const FOG_TOP = 0.9;
export const OLLA_S = 1.25;                // escala de la olla de peltre
export const PT = {
  olla: [FOG[0] + 0.48, FOG_TOP, FOG[2] + 0.05] as V,           // olla de peltre en la hornilla derecha
  sup: [FOG[0] + 0.48, FOG_TOP + 0.255 * OLLA_S, FOG[2] + 0.05] as V, // superficie del arroz con leche
  hornilla: [FOG[0] - 0.45, FOG_TOP, FOG[2] + 0.05] as V,
  boca: [FOG[0], 0.32, FOG[2] + 0.46] as V,                     // boca del fogón (las brasas)
  mesa: [-0.75, 0.8, -0.55] as V,
  corte: [-0.55, 0.8, -0.45] as V,                              // olla en corte sobre la mesa
  puerta: [-3.5, 1.2, -0.55] as V,
  pinata: [-8.2, 2.7, -0.7] as V,
  patio: [-7.5, 1.2, -0.5] as V,
};
export const TABLE_Y = 0.8;
export const VASOS: V[] = Array.from({ length: 7 }, (_, i) => [-2.05 + i * 0.27, 1.53, -2.84] as V); // repisa de la pared del fondo

// ---------------- CÁMARA (keyframes globales; el resto del video agrega los suyos) ----------------
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
  p.x += Math.sin(t * 0.53) * 0.008; p.y += Math.sin(t * 0.71 + 1) * 0.006; // cámara en mano, muy suave
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
const useTx = () => useMemo(() => ({
  // adobe enjarrado: revoque de barro alisado a mano, con parches donde asoma el bloque y la paja
  adobe: mk(512, 512, (g) => {
    g.fillStyle = "#9c8068"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 70; i++) { const b = 150 + rnd(i, 1) * 40; g.fillStyle = `rgba(${b},${b * 0.86},${b * 0.72},.3)`; g.beginPath(); g.ellipse(rnd(i, 2) * 512, rnd(i, 3) * 512, 30 + rnd(i, 4) * 80, 20 + rnd(i, 5) * 40, rnd(i, 6) * 3, 0, 6.3); g.fill(); }
    noise(g, 512, 512, 3000, (i) => `rgba(${80 + rnd(i, 1) * 60},${55 + rnd(i, 2) * 30},${35},${0.14 + rnd(i, 3) * 0.18})`, 2);
    g.strokeStyle = "rgba(225,195,130,.32)"; g.lineWidth = 1.2;
    for (let i = 0; i < 240; i++) { const x = rnd(i, 21) * 512, y = rnd(i, 22) * 512, a = rnd(i, 23) * 6.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); g.stroke(); }
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(30,18,8,.28)"); gr.addColorStop(0.3, "rgba(30,18,8,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  }, [6, 2.8]),
  // piedra de río del fogón, junteada con mezcla
  piedra: mk(512, 512, (g) => {
    g.fillStyle = "#6f655a"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 46; i++) {
      const x = rnd(i, 1) * 512, y = rnd(i, 2) * 512, rx = 34 + rnd(i, 3) * 40, ry = 24 + rnd(i, 4) * 26, b = 120 + rnd(i, 5) * 70;
      const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 2, x, y, rx); gr.addColorStop(0, `rgb(${b + 30},${b + 22},${b + 10})`); gr.addColorStop(1, `rgb(${b - 40},${b - 44},${b - 50})`);
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, rx, ry, rnd(i, 6) * 3, 0, 6.3); g.fill();
    }
    noise(g, 512, 512, 2500, (i) => `rgba(${40 + rnd(i, 1) * 40},${35 + rnd(i, 2) * 30},${30},.25)`, 2);
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(10,8,6,.45)"); gr.addColorStop(0.25, "rgba(10,8,6,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); // tizne
  }, [2, 1]),
  tierra: mk(512, 512, (g) => {
    g.fillStyle = "#6e5238"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 5000, (i) => `rgba(${90 + rnd(i, 1) * 70},${65 + rnd(i, 2) * 40},${40 + rnd(i, 3) * 25},.35)`, 3);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(40,28,18,${0.08 + rnd(i, 5) * 0.1})`; g.beginPath(); g.ellipse(rnd(i, 6) * 512, rnd(i, 7) * 512, 30 + rnd(i, 8) * 60, 14 + rnd(i, 9) * 30, rnd(i, 10) * 3, 0, 6.3); g.fill(); }
  }, [6, 6]),
  patio: mk(512, 512, (g) => {
    g.fillStyle = "#8c6e4c"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 5000, (i) => `rgba(${120 + rnd(i, 1) * 70},${95 + rnd(i, 2) * 40},${60 + rnd(i, 3) * 30},.35)`, 3);
    for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(80,110,40,${0.15 + rnd(i, 4) * 0.2})`; g.fillRect(rnd(i, 5) * 512, rnd(i, 6) * 512, 3, 7); }
  }, [14, 14]),
  madera: mk(256, 512, (g) => {
    g.fillStyle = "#6b4529"; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 70; k++) { g.strokeStyle = `rgba(${35 + rnd(k, 1) * 30},${20 + rnd(k, 2) * 15},8,${0.2 + rnd(k, 3) * 0.3})`; g.lineWidth = 1 + rnd(k, 4) * 2.5; g.beginPath(); const x = rnd(k, 5) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 10 * rnd(k, 6), 170, x - 12 * rnd(k, 7), 340, x + 6, 512); g.stroke(); }
    noise(g, 256, 512, 600, (i) => `rgba(255,220,170,${0.04 + rnd(i, 1) * 0.05})`, 2);
  }),
  // PELTRE azul con puntitos blancos (la olla de Lety) y un par de despostillados negros
  peltre: mk(1024, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#2a6fc0"); gr.addColorStop(1, "#174d92"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(255,255,255,${0.75 + rnd(i, 3) * 0.25})`; g.beginPath(); g.arc(rnd(i, 1) * 1024, rnd(i, 2) * 512, 2 + rnd(i, 4) * 3.2, 0, 6.3); g.fill(); }
    for (let i = 0; i < 5; i++) { g.fillStyle = "#151515"; g.beginPath(); g.ellipse(rnd(i, 7) * 1024, 380 + rnd(i, 8) * 120, 8 + rnd(i, 9) * 10, 5 + rnd(i, 10) * 6, rnd(i, 11) * 3, 0, 6.3); g.fill(); }
    g.fillStyle = "#0e2f63"; g.fillRect(0, 0, 1024, 16); // filo azul oscuro del borde
  }),
  // superficie del arroz con leche: crema con granos hinchados y vetas de nata
  crema: mk(1024, 1024, (g) => {
    const gr = g.createRadialGradient(512, 512, 30, 512, 512, 520); gr.addColorStop(0, "#fbf1dc"); gr.addColorStop(1, "#ecd9b4"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 1500; i++) { const a = rnd(i, 1) * 6.3; g.fillStyle = `rgba(255,252,240,${0.35 + rnd(i, 2) * 0.4})`; g.beginPath(); g.ellipse(rnd(i, 3) * 1024, rnd(i, 4) * 1024, 9 + rnd(i, 5) * 5, 4 + rnd(i, 6) * 2, a, 0, 6.3); g.fill(); g.strokeStyle = "rgba(190,160,110,.25)"; g.lineWidth = 1; g.stroke(); }
    g.strokeStyle = "rgba(225,200,150,.35)"; g.lineWidth = 7;
    for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(512, 512, 110 + k * 42, rnd(k, 1) * 6, rnd(k, 1) * 6 + 1.4 + rnd(k, 2)); g.stroke(); }
  }),
  // polvo de canela (encima, sólo al servir)
  canelaPolvo: mk(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { const r = Math.sqrt(rnd(i, 1)) * 230, a = rnd(i, 2) * 6.3; g.fillStyle = `rgba(${120 + rnd(i, 3) * 40},${60 + rnd(i, 4) * 20},${25},${0.5 + rnd(i, 5) * 0.4})`; g.fillRect(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 2 + rnd(i, 6) * 2, 2 + rnd(i, 7) * 2); }
  }),
  barro: mk(512, 256, (g) => {
    g.fillStyle = "#a3502a"; g.fillRect(0, 0, 512, 256);
    noise(g, 512, 256, 1800, (i) => `rgba(${60 + rnd(i, 1) * 50},${25 + rnd(i, 2) * 15},${10},${0.15 + rnd(i, 3) * 0.15})`, 2);
    for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(40,15,5,${0.08 + rnd(k, 4) * 0.1})`; g.fillRect(0, 30 + k * 38 + rnd(k, 5) * 10, 512, 3); }
    g.strokeStyle = "#f2e2c0"; g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= 512; x += 32) g.lineTo(x, 70 + (x / 32 % 2 ? 12 : 0)); g.stroke(); // grequita blanca del jarrito
  }),
  // papel de china de los farolitos
  china: ["#e83a62", "#f2a31b", "#2fb3a3", "#7b4bd1", "#3c8be6", "#f25f2b"].map((c) => mk(128, 256, (g) => {
    g.fillStyle = c; g.fillRect(0, 0, 128, 256);
    for (let y = 0; y < 256; y += 18) { g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(0, y, 128, 3); }
    g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(40, 0, 14, 256);
  })),
  dot: mk(64, 64, (g) => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  }),
  steam: mk(128, 128, (g) => {
    for (let k = 0; k < 7; k++) { const gr = g.createRadialGradient(40 + rnd(k, 1) * 48, 40 + rnd(k, 2) * 48, 0, 64, 64, 60); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
  }),
  // granitos para el estrato de "arroz duro" en la olla en corte
  arrozCorte: mk(512, 256, (g) => {
    g.fillStyle = "#e8dcc2"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 520; i++) { g.fillStyle = `rgba(255,255,250,${0.7 + rnd(i, 1) * 0.3})`; g.beginPath(); g.ellipse(rnd(i, 2) * 512, rnd(i, 3) * 256, 10, 4.5, rnd(i, 4) * 6.3, 0, 6.3); g.fill(); g.strokeStyle = "rgba(150,130,100,.45)"; g.lineWidth = 1.2; g.stroke(); }
  }, [1, 1]),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; map?: Tx; rot?: V; s?: number; m?: number; inner?: string; innerR?: number; seg?: number; phi?: [number, number]; cc?: number }> = ({ prof, p, c, r = 0.75, map, rot, s = 1, m = 0, inner, innerR = 0.35, seg = 48, phi = [0, Math.PI * 2], cc = 0 }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), seg, phi[0], phi[1]), [JSON.stringify(prof), seg, phi[0], phi[1]]);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={r} metalness={m} map={map} clearcoat={cc} clearcoatRoughness={0.15} side={inner ? THREE.FrontSide : THREE.DoubleSide} /></mesh>
      {inner && <mesh geometry={geo}><meshPhysicalMaterial color={inner} roughness={innerR} clearcoat={cc * 0.6} side={THREE.BackSide} /></mesh>}
    </group>
  );
};
// perfiles [radio, alto]
const OLLA_P: [number, number][] = [[0, 0], [0.17, 0.003], [0.205, 0.03], [0.215, 0.1], [0.215, 0.25], [0.212, 0.28], [0.228, 0.29], [0.226, 0.298]];
const VASO_P: [number, number][] = [[0, 0], [0.035, 0], [0.042, 0.01], [0.05, 0.05], [0.058, 0.1], [0.063, 0.112], [0.06, 0.115]];
const JARRO_P: [number, number][] = [[0, 0], [0.05, 0], [0.075, 0.04], [0.085, 0.1], [0.07, 0.15], [0.065, 0.18], [0.075, 0.2], [0.072, 0.205]];
const LECHERA_P: [number, number][] = [[0, 0], [0.11, 0], [0.12, 0.02], [0.12, 0.26], [0.08, 0.34], [0.05, 0.37], [0.055, 0.42], [0.06, 0.425]];
const TAZON_P: [number, number][] = [[0, 0], [0.05, 0], [0.06, 0.01], [0.11, 0.06], [0.13, 0.09], [0.128, 0.092]];
const CAZO_P: [number, number][] = [[0, 0], [0.13, 0], [0.155, 0.05], [0.16, 0.12], [0.168, 0.125]];

// vapor que sube (sprites deterministas)
const Steam: React.FC<{ p: V; t: number; amt: number; tex: THREE.Texture; spread?: number; h?: number; n?: number; size?: number; col?: string; op?: number }> = ({ p, t, amt, tex, spread = 0.25, h = 0.9, n = 16, size = 0.35, col = "#fff6ea", op = 0.32 }) => {
  if (amt <= 0.01) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => {
        const life = 3.2 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const y = ph * h, x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.05 * ph, z = (rnd(i, 4) - 0.5) * spread;
        const s = size * (0.5 + ph * 1.4);
        return <sprite key={i} position={[x, y, z]} scale={[s, s, 1]}><spriteMaterial map={tex} color={col} transparent opacity={amt * op * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>;
      })}
    </group>
  );
};

// fuego de leña bajo la plancha: lenguas aditivas + luz que tiembla
const Fire: React.FC<{ p: V; t: number; amt: number; dot: THREE.Texture; w?: number }> = ({ p, t, amt, dot, w = 0.3 }) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 13.1) * Math.sin(t * 7.7 + 1) + 0.08 * Math.sin(t * 23);
  return (
    <group position={p}>
      {[-0.1, 0, 0.1].map((x, i) => <mesh key={i} position={[x, 0.04, (i - 1) * 0.03]} rotation={[0, 0, Math.PI / 2 + (i - 1) * 0.25]} castShadow><cylinderGeometry args={[0.03, 0.035, 0.42, 8]} /><meshStandardMaterial color="#3a2414" roughness={1} emissive="#ff4a10" emissiveIntensity={0.3 * amt} /></mesh>)}
      {amt > 0.02 && Array.from({ length: 9 }, (_, i) => {
        const ph = t * (2.2 + rnd(i, 1)) + rnd(i, 2) * 6, hh = (0.12 + 0.12 * rnd(i, 3)) * (0.75 + 0.25 * Math.sin(ph * 3)) * Math.min(1.6, amt);
        return <mesh key={i} position={[(rnd(i, 4) - 0.5) * w, 0.06 + hh / 2, (rnd(i, 5) - 0.5) * 0.1]} rotation={[0, 0, Math.sin(ph) * 0.15]}>
          <coneGeometry args={[0.04 + 0.025 * rnd(i, 6), hh, 10, 1, true]} /><meshBasicMaterial color={new THREE.Color("#ff5a10").lerp(new THREE.Color(amt > 1.2 ? "#bfe0ff" : "#ffd27a"), rnd(i, 7) * (amt > 1.2 ? 0.5 : 1))} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>;
      })}
      {amt > 0.02 && <sprite position={[0, 0.14, 0.05]} scale={[0.75 * fl, 0.55 * fl, 1]}><spriteMaterial map={dot} color="#ff8a2a" transparent opacity={0.5 * Math.min(1.3, amt)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
      {amt > 0.02 && Array.from({ length: 10 }, (_, i) => { const life = 1.4 + rnd(i, 8), ph = ((t + rnd(i, 9) * life) % life) / life; return <mesh key={"s" + i} position={[(rnd(i, 10) - 0.5) * 0.22 + Math.sin(t * 3 + i) * 0.03, 0.12 + ph * 0.35, 0.08 + (rnd(i, 11) - 0.5) * 0.08]}><sphereGeometry args={[0.005, 4, 3]} /><meshBasicMaterial color="#ffb050" transparent opacity={(1 - ph) * Math.min(1, amt)} toneMapped={false} /></mesh>; })}
      <pointLight position={[0, 0.25, 0.35]} intensity={4.5 * fl * amt} distance={4.5} decay={1.6} color="#ff8a3a" castShadow={false} />
    </group>
  );
};

// superficie del arroz con leche: aguado (gris translúcido, granos sueltos que flotan) → cremoso (nata brillante, granos hundidos)
const ArrozSup: React.FC<{ r: number; t: number; tx: ReturnType<typeof useTx>; cream: number; burnt: number; canela: number; grains: number; dip?: number; agua?: number; te?: number; nata?: number; trail?: number; raja?: number; boil?: number }> = ({ r, t, tx, cream, burnt, canela, grains, dip = 0, agua = 0, te = 0, nata = 0, trail = 0, raja = 1, boil = 0 }) => {
  const geo = useMemo(() => new THREE.CircleGeometry(r, 80), [r]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), d = Math.hypot(x, y) / r;
    let z = 0.0035 * r * Math.sin(x * 20 / r + t * (0.4 + 1.2 * (1 - cream))) * Math.sin(y * 17 / r - t * 0.5);
    // burbujas lentas de hervor bajito
    for (let k = 0; k < 3 + Math.round(9 * boil); k++) { const cx = (rnd(k, 31) - 0.5) * r, cy = (rnd(k, 32) - 0.5) * r, ph = ((t * 0.3 + rnd(k, 33)) % 1); const dd = Math.hypot(x - cx, y - cy) / (r * 0.16); z += (0.012 + 0.02 * boil) * r * Math.sin(ph * Math.PI) * Math.exp(-dd * dd); }
    // el hueco donde estuvo la cuchara (se cierra despacio = cremoso)
    if (dip > 0.01) { const dd = Math.hypot(x - r * 0.1, y) / (r * 0.28); z -= dip * 0.06 * r * Math.exp(-dd * dd); }
    // caminito de la cuchara (se cierra solo)
    if (trail > 0.01) { const dd = Math.abs(y + 0.05 * r) / (r * 0.07); if (Math.abs(x) < r * 0.75) z -= trail * 0.05 * r * Math.exp(-dd * dd); }
    // nata: arrugas
    if (nata > 0.01) z += nata * 0.006 * r * (Math.sin(x * 61 / r + Math.sin(y * 23 / r) * 2) + Math.sin(y * 47 / r));
    pos.setZ(i, z * (1 - d * d));
  }
  pos.needsUpdate = true; geo.computeVertexNormals();
  const col = new THREE.Color("#d9dde0").lerp(new THREE.Color("#ffffff"), cream).lerp(new THREE.Color("#8a6a4a"), burnt * 0.5).lerp(new THREE.Color("#bcd6e0"), agua).lerp(new THREE.Color("#c7883a"), te * 0.85).lerp(new THREE.Color("#f2dca0"), nata * 0.9);
  const liq = Math.max(agua, te);
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geo} receiveShadow><meshPhysicalMaterial color={col} map={cream > 0.15 && liq < 0.5 ? tx.crema : undefined} roughness={nata > 0.3 ? 0.7 : (0.42 - 0.22 * cream) * (1 - 0.8 * liq)} clearcoat={0.3 + 0.7 * Math.max(cream, liq)} clearcoatRoughness={0.12} transparent={cream < 0.4 || liq > 0.05} opacity={liq > 0.05 ? 0.78 : 0.82 + 0.18 * cream} sheen={0.6 * cream * (1 - liq)} sheenColor="#fff4dc" /></mesh>
      {/* granos sueltos (aguado) que flotan y giran */}
      {grains > 0.01 && Array.from({ length: 70 }, (_, i) => {
        const a = rnd(i, 41) * 6.283 + t * 0.05 * (rnd(i, 44) - 0.5), d = Math.sqrt(rnd(i, 42)) * r * 0.9;
        return <mesh key={i} position={[Math.cos(a) * d, Math.sin(a) * d, 0.006 * r + Math.sin(t * 1.3 + i) * 0.002]} rotation={[0, 0, a + t * 0.2]} scale={[1, 0.42, 0.42]}>
          <sphereGeometry args={[0.012 * grains, 8, 6]} /><meshStandardMaterial color="#f7f3ea" roughness={0.5} transparent opacity={grains} /></mesh>;
      })}
      {/* polvo de canela */}
      {canela > 0.01 && <mesh position={[0, 0, 0.004 * r + 0.003]}><circleGeometry args={[r * 0.7, 40]} /><meshStandardMaterial map={tx.canelaPolvo} transparent opacity={canela} depthWrite={false} roughness={0.9} /></mesh>}
      {/* espuma del hervor: anillo de burbujitas en la orilla */}
      {boil > 0.05 && Array.from({ length: 80 }, (_, i) => { const a = rnd(i, 71) * 6.283, d = r * (0.72 + 0.26 * rnd(i, 72)), ph = ((t * (1.5 + rnd(i, 73)) + rnd(i, 74)) % 1); return <mesh key={"b" + i} position={[Math.cos(a) * d, Math.sin(a) * d, 0.01 * r]} scale={boil * (0.4 + Math.sin(ph * Math.PI))}><sphereGeometry args={[0.012 + 0.01 * rnd(i, 75), 8, 6]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.4} transparent opacity={0.9} /></mesh>; })}
      {/* raja de canela flotando */}
      {raja > 0.01 && <mesh position={[-r * 0.35, r * 0.2, 0.008 * r]} rotation={[0, Math.PI / 2, 0.5]}><cylinderGeometry args={[0.012, 0.012, r * 0.85, 10, 1, true]} /><meshStandardMaterial color="#8a4a22" roughness={0.85} side={THREE.DoubleSide} transparent={raja < 1} opacity={raja} /></mesh>}
    </group>
  );
};

// cuchara de palo héroe: mango largo gastado + cuenco; capa de crema encima y un CHORRO que cae despacio a la olla
const Cuchara: React.FC<{ base: V; lift: number; t: number; drip: number; slow: number; supY: number }> = ({ base, lift, t, drip, slow, supY }) => {
  const y = base[1] + 0.02 + lift * 0.2, tilt = -0.55 + 0.25 * lift;
  const tipY = y - 0.03;
  const len = Math.max(0, tipY - supY);
  const wob = Math.sin(t * 2.1) * 0.003 * (1 - slow);
  // gota que baja por el chorro (lenta = cremoso)
  const gph = ((t * (0.25 + 0.5 * (1 - slow))) % 1);
  return (
    <group>
      <group position={[base[0] + 0.02, y, base[2]]} rotation={[0, 0.35, tilt]}>
        <mesh position={[0.2, 0.17, 0]} rotation={[0, 0, -0.9]} castShadow><cylinderGeometry args={[0.012, 0.016, 0.5, 14]} /><meshStandardMaterial color="#b9844e" roughness={0.65} /></mesh>
        <mesh position={[0.035, 0.03, 0]} rotation={[0, 0, -0.9]} castShadow><cylinderGeometry args={[0.016, 0.03, 0.06, 14]} /><meshStandardMaterial color="#b0794a" roughness={0.65} /></mesh>
        <mesh position={[0, 0, 0]} scale={[1.35, 0.42, 0.85]} castShadow><sphereGeometry args={[0.055, 28, 16, 0, Math.PI * 2, 0, Math.PI / 1.7]} /><meshStandardMaterial color="#b0794a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
        {/* crema que cubre el cuenco */}
        <mesh position={[0, -0.004, 0]} scale={[1.42, 0.5, 0.9]}><sphereGeometry args={[0.055, 24, 14, 0, Math.PI * 2, Math.PI / 2.3, Math.PI / 2]} /><meshPhysicalMaterial color="#fff6e2" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} sheen={0.7} sheenColor="#fff2d0" /></mesh>
      </group>
      {drip > 0.01 && len > 0.01 && <group position={[base[0] + wob, supY + len / 2, base[2]]}>
        <mesh><cylinderGeometry args={[0.0035 + 0.003 * slow, 0.006 + 0.004 * slow, len * drip, 16]} /><meshPhysicalMaterial color="#fff6e2" roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} sheen={0.6} sheenColor="#fff2d0" /></mesh>
        <mesh position={[0, len / 2 - len * gph, 0]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.008 + 0.003 * slow, 14, 10]} /><meshPhysicalMaterial color="#fff6e2" roughness={0.2} clearcoat={1} /></mesh>
      </group>}
      {/* el chorro se "dobla" sobre la superficie: rizo de crema */}
      {drip > 0.3 && <mesh position={[base[0] + 0.02, supY + 0.008, base[2]]} rotation={[-Math.PI / 2, 0, t * 0.3]}><torusGeometry args={[0.018, 0.005 + 0.003 * slow, 10, 24, Math.PI * 1.6 * drip]} /><meshPhysicalMaterial color="#fff6e2" roughness={0.25} clearcoat={1} /></mesh>}
    </group>
  );
};

// la OLLA EN CORTE: media olla de peltre con los estratos del desastre (costra negra / arroz duro / leche aguada con granos)
const Corte: React.FC<{ p: V; on: number; t: number; tx: ReturnType<typeof useTx>; glow: number[] }> = ({ p, on, t, tx, glow }) => {
  const s = 0.95 * Math.min(1.05, on);
  const inR = (y: number) => { // radio interior del perfil a la altura y
    for (let i = 1; i < OLLA_P.length; i++) { const [r1, y1] = OLLA_P[i], [r0, y0] = OLLA_P[i - 1]; if (y <= y1) return (r0 + (r1 - r0) * ((y - y0) / Math.max(1e-4, y1 - y0))) - 0.006; }
    return OLLA_P[OLLA_P.length - 1][0] - 0.006;
  };
  const band = (y0: number, y1: number) => {
    const sh = new THREE.Shape(); const N = 10;
    sh.moveTo(-inR(y0), y0); for (let k = 0; k <= N; k++) { const y = y0 + (y1 - y0) * (k / N); sh.lineTo(inR(y), y); }
    for (let k = N; k >= 0; k--) { const y = y0 + (y1 - y0) * (k / N); sh.lineTo(-inR(y), y); }
    return new THREE.ShapeGeometry(sh);
  };
  const g = useMemo(() => ({ costra: band(0.004, 0.032), duro: band(0.032, 0.12), agua: band(0.12, 0.25) }), []);
  if (on <= 0.01) return null;
  const L = [
    { geo: g.costra, c: "#140a05", e: "#ff3a0a", ei: 0.25 * glow[0] + 0.05 * Math.sin(t * 6) * glow[0], map: undefined, op: 1, r: 0.9 },
    { geo: g.duro, c: "#d9c49a", e: "#ffb84a", ei: 0.25 * glow[1], map: tx.arrozCorte, op: 1, r: 0.8 },
    { geo: g.agua, c: "#a9c4d6", e: "#6fb6ff", ei: 0.3 * glow[2], map: undefined, op: 0.6, r: 0.15 },
  ];
  return (
    <group position={p} rotation={[0, Math.PI / 2, 0]} scale={s}>
      <Lathe prof={OLLA_P} p={[0, 0, 0]} c="#ffffff" map={tx.peltre} r={0.3} cc={0.8} inner="#f2f2ee" innerR={0.25} phi={[0, Math.PI]} />
      {/* canto del corte (el espesor del peltre, oscuro) */}
      {L.map((l, i) => <mesh key={i} geometry={l.geo} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><meshPhysicalMaterial color={l.c} map={l.map} emissive={l.e} emissiveIntensity={l.ei} roughness={l.r} transparent={l.op < 1} opacity={l.op} side={THREE.DoubleSide} clearcoat={i === 2 ? 1 : 0} /></mesh>)}
      {/* granos sueltos dentro de la leche aguada (se ven por el corte) */}
      {Array.from({ length: 26 }, (_, i) => { const y = 0.13 + rnd(i, 61) * 0.11, rr = inR(y) * 0.85; return <mesh key={i} position={[0.004, y + Math.sin(t * 1.2 + i) * 0.004, (rnd(i, 62) * 2 - 1) * rr]} rotation={[t * 0.3 + i, 0, rnd(i, 63) * 3]} scale={[0.42, 1, 0.42]}><sphereGeometry args={[0.011, 8, 6]} /><meshStandardMaterial color="#fbf8f0" roughness={0.5} /></mesh>; })}
      {/* superficie aguada arriba */}
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[inR(0.25), 40, Math.PI / 2, Math.PI]} /><meshPhysicalMaterial color="#d6dde2" roughness={0.1} clearcoat={1} transparent opacity={0.8} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

// farolito de papel de china (posada): cilindro plisado que brilla por dentro
const Farol: React.FC<{ p: V; tex: THREE.Texture; on: number; t: number; i: number }> = ({ p, tex, on, t, i }) => (
  <group position={p} rotation={[Math.sin(t * 1.4 + i) * 0.08, 0, Math.sin(t * 1.1 + i * 2) * 0.08]}>
    <mesh position={[0, -0.16, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.12, 18, 14]} /><meshStandardMaterial map={tex} color="#ffffff" emissive="#ffb060" emissiveMap={tex} emissiveIntensity={2.6 * on + 0.05} roughness={0.9} toneMapped={false} /></mesh>
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 12]} /><meshStandardMaterial color="#2a2520" /></mesh>
    <mesh position={[0, -0.31, 0]}><cylinderGeometry args={[0.04, 0.04, 0.02, 12]} /><meshStandardMaterial color="#2a2520" /></mesh>
  </group>
);

// piñata de estrella de 7 picos (cono por pico + tiritas)
const Pinata: React.FC<{ p: V; t: number }> = ({ p, t }) => {
  const cols = ["#e83a62", "#f2a31b", "#2fb3a3", "#7b4bd1", "#3c8be6", "#f25f2b", "#d6c22a"];
  return (
    <group position={p} rotation={[Math.sin(t * 0.9) * 0.1, t * 0.25, Math.sin(t * 0.7) * 0.06]}>
      <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.006, 0.006, 1.6, 4]} /><meshStandardMaterial color="#cbb58a" /></mesh>
      <mesh castShadow><sphereGeometry args={[0.24, 24, 18]} /><meshStandardMaterial color="#f0d2a0" roughness={0.9} /></mesh>
      {cols.map((c, i) => { const a = (i / 7) * Math.PI * 2; return <group key={i} rotation={[0, 0, a]}><mesh position={[0, 0.42, 0]} castShadow><coneGeometry args={[0.09, 0.42, 14]} /><meshStandardMaterial color={c} roughness={0.8} /></mesh>
        {[0, 1, 2].map((k) => <mesh key={k} position={[(k - 1) * 0.02, 0.64 + 0.1, 0]} rotation={[0, 0, Math.sin(t * 2 + i + k) * 0.2]}><planeGeometry args={[0.012, 0.22]} /><meshStandardMaterial color={cols[(i + k + 2) % 7]} side={THREE.DoubleSide} /></mesh>)}</group>; })}
    </group>
  );
};

// limonero: tronco + copa de esferas + limones
const Limonero: React.FC<{ p: V; t: number }> = ({ p, t }) => (
  <group position={p}>
    <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.07, 0.11, 1.6, 8]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.5, 1.8 + rnd(i, 2) * 0.9 + Math.sin(t * 0.8 + i) * 0.01, (rnd(i, 3) - 0.5) * 1.3]} castShadow><sphereGeometry args={[0.38 + rnd(i, 4) * 0.25, 18, 14]} /><meshStandardMaterial color={new THREE.Color("#3f6b25").lerp(new THREE.Color("#6f9a35"), rnd(i, 5))} roughness={0.9} /></mesh>)}
    {Array.from({ length: 20 }, (_, i) => <mesh key={"l" + i} position={[(rnd(i, 6) - 0.5) * 1.7, 1.6 + rnd(i, 7) * 1.1, (rnd(i, 8) - 0.5) * 1.5]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={rnd(i, 9) > 0.4 ? "#9cc43a" : "#d9cf3a"} roughness={0.5} /></mesh>)}
  </group>
);

// ---------------- props del mundo que cambian con el video ----------------
export type Drop = { arroz?: number; leche?: number; azucar?: number; canela?: number; sal?: number }; // 0 nada · 0..1 cayendo · ≥1 ya adentro
export type WorldProps = {
  t: number;
  night?: number;        // 0 día · 1 noche (patio de posada)
  fire?: number;         // fuego bajo la olla (1 normal · 0.35 bajito · 1.8 alto)
  cream?: number;        // 0 aguado .. 1 cremoso
  burnt?: number;        // 0..1 quemado (humo negro y nata café)
  smoke?: number;        // humo negro de la olla
  steam?: number;        // vapor de la olla
  grains?: number;       // granos sueltos flotando (aguado)
  canelaPolvo?: number;  // polvo de canela arriba
  spoon?: { lift: number; drip: number; slow: number }; // cuchara héroe
  dip?: number;          // hueco que deja la cuchara
  drop?: Drop;           // ingredientes cayendo a la olla
  corte?: number;        // 0..1 aparece la olla en corte en la mesa
  corteGlow?: number[];  // brillo de cada estrato [costra, duro, aguado]
  vasos?: number[];      // 0..1 cada vasito de la repisa se llena y se enciende
  posada?: number;       // farolitos encendidos
  lidOff?: number;       // 1 = sin tapa (la tapa queda recargada)
  agua?: number;         // 0..1 la olla tiene agua (arroz cociéndose en agua)
  te?: number;           // 0..1 el agua se vuelve té de canela (ámbar)
  nata?: number;         // 0..1 capa de nata arrugada arriba
  hervor?: number;       // 0..1 la leche hierve y SUBE (espuma hasta el borde)
  trail?: number;        // 0..1 caminito de la cuchara que se cierra
  raja?: number;         // 0..1 la raja de canela en la olla (0 = ya la sacaste)
  stir?: number;         // ángulo de la cuchara que raspa el fondo (undefined = no está)
  tapa?: number;         // 0 recargada en la pared · 1 puesta en la olla
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, night = 0, fire = 1, cream = 1, burnt = 0, smoke = 0, steam = 1, grains = 0, canelaPolvo = 0, spoon, dip = 0, drop = {}, corte = 0, corteGlow = [0, 0, 0], vasos = [], posada = 0, agua = 0, te = 0, nata = 0, hervor = 0, trail = 0, raja = 1, stir, tapa = 0 } = pr;
  const tx = useTx();
  const [, setOk] = useState(false);
  useMemo(() => { const h = delayRender("letra a mano"); handReady().then(() => { setOk(true); requestAnimationFrame(() => continueRender(h)); }).catch(() => { setOk(true); continueRender(h); }); }, []);
  const skyDay = new THREE.Color("#f3d2a0"), skyNight = new THREE.Color("#0b1330");
  const sky = skyDay.clone().lerp(skyNight, night);
  const sunI = 2.4 * (1 - night);
  const O = PT.olla, rS = 0.212 * OLLA_S, supY = PT.sup[1];

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.5 + 0.35 * night} threshold={0.86 - 0.12 * night} exposure={1.0 - 0.1 * night} env={0.24 * (1 - night) + 0.05} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 10, 42]} />
      <hemisphereLight args={[new THREE.Color("#fff0dc").lerp(new THREE.Color("#2c3d6e"), night).getHex(), 0x3a2e24, 0.6 - 0.2 * night]} />
      {/* sol de la tarde entrando por la puerta y el lado abierto (izquierda) */}
      <directionalLight position={[-11, 7, 4]} intensity={sunI} color="#ffe2bd" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-14} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <directionalLight position={[6, 5, 8]} intensity={0.55 * (1 - night) + 0.25} color="#ffe2c0" />
      {night > 0.01 && <directionalLight position={[-8, 9, 6]} intensity={2.4 * night} color="#9fb6ff" />}
      {/* foco de la cocina */}
      <pointLight position={[0.2, 2.4, -0.6]} intensity={1.4 + 1.8 * night} distance={6} decay={1.5} color="#ffc27a" castShadow shadow-bias={-0.0004} />

      {/* ===== piso ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.2]} receiveShadow><planeGeometry args={[7, 6.2]} /><meshStandardMaterial map={tx.tierra} color="#d9c2a2" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow><planeGeometry args={[120, 120]} /><meshStandardMaterial map={tx.patio} color="#e2c9a0" roughness={1} /></mesh>

      {/* ===== paredes de adobe: fondo, derecha y la izquierda con la PUERTA al patio ===== */}
      <Box p={[0, 1.6, -3.1]} s={[7.3, 3.2, 0.3]} c="#e6dccf" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[3.5, 1.6, -0.2]} s={[0.3, 3.2, 6.1]} c="#e6dccf" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[-3.5, 1.6, -2.15]} s={[0.3, 3.2, 1.9]} c="#e6dccf" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[-3.5, 1.6, 1.6]} s={[0.3, 3.2, 2.5]} c="#e6dccf" map={tx.adobe} r={1} rad={0.04} />
      <Box p={[-3.5, 2.7, -0.55]} s={[0.3, 1.0, 1.4]} c="#e6dccf" map={tx.adobe} r={1} rad={0.04} />
      {/* marco y hoja de la puerta abierta hacia afuera */}
      <Box p={[-3.5, 2.2, -0.55]} s={[0.36, 0.12, 1.46]} c="#5a3a22" map={tx.madera} r={0.95} />
      {[-1.24, 0.14].map((z) => <Box key={z} p={[-3.5, 1.1, z]} s={[0.36, 2.2, 0.1]} c="#5a3a22" map={tx.madera} r={0.95} />)}
      <group position={[-3.62, 0, -1.22]} rotation={[0, 0.95, 0]}><Box p={[0, 1.08, 0.6]} s={[0.06, 2.1, 1.2]} c="#2f6a8a" map={tx.madera} r={0.85} /></group>
      {/* vigas del techo */}
      {[-2.8, -1.6, -0.4, 0.8, 2.0, 3.2].map((x) => <Box key={x} p={[x, 3.15, -1.0]} s={[0.15, 0.15, 4.6]} c="#4f321d" map={tx.madera} r={0.95} />)}
      <Box p={[0, 3.3, -2.0]} s={[7.4, 0.08, 2.4]} c="#a8875a" r={1} rad={0.01} />

      {/* ===== FOGÓN de piedra con plancha y dos hornillas (pared del fondo, a la derecha) ===== */}
      <group position={FOG}>
        <Box p={[0, FOG_TOP / 2 - 0.02, 0]} s={[1.9, FOG_TOP - 0.04, 0.9]} c="#d8cfc4" map={tx.piedra} r={1} rad={0.06} />
        {/* plancha de fierro */}
        <Box p={[0, FOG_TOP - 0.012, 0.03]} s={[1.75, 0.03, 0.78]} c="#1c1a19" r={0.55} m={0.5} rad={0.01} />
        {[-0.45, 0.48].map((x) => <mesh key={x} position={[x, FOG_TOP + 0.005, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.15, 0.2, 40]} /><meshStandardMaterial color="#2a2422" roughness={0.6} metalness={0.5} emissive="#ff4a10" emissiveIntensity={0.25 * fire} /></mesh>)}
        {/* boca con brasas */}
        <mesh position={[0, 0.3, 0.452]}><planeGeometry args={[0.7, 0.36]} /><meshStandardMaterial color="#120806" roughness={1} emissive="#ff4a10" emissiveIntensity={0.22 * fire} /></mesh>
        {/* chimenea de adobe */}
        <Box p={[-0.8, 2.1, -0.3]} s={[0.36, 2.4, 0.3]} c="#e6dccf" map={tx.adobe} r={1} rad={0.04} />
        {/* jarro de café en la otra hornilla */}
        <Lathe prof={JARRO_P} p={[-0.45, FOG_TOP, 0.05]} c="#f0d0b8" map={tx.barro} r={0.7} s={1.6} />
      </group>
      <Fire p={[FOG[0] + 0.48, 0.12, FOG[2] + 0.28]} t={t} amt={fire} dot={tx.dot} />
      <Fire p={[FOG[0] - 0.4, 0.12, FOG[2] + 0.28]} t={t + 3} amt={0.6} dot={tx.dot} w={0.22} />
      {/* leña junto al fogón */}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[2.6 + (i % 3) * 0.12, 0.06 + Math.floor(i / 3) * 0.11, -2.5]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.055, 0.06, 0.7, 7]} /><meshStandardMaterial color={["#5a3b22", "#6b4a2c", "#4a301b"][i % 3]} roughness={1} /></mesh>)}

      {/* ===== LA OLLA DE PELTRE con el arroz con leche ===== */}
      <group position={O}>
        <Lathe prof={OLLA_P} p={[0, 0, 0]} c="#ffffff" map={tx.peltre} r={0.28} cc={0.9} s={OLLA_S} inner="#f4f3ee" innerR={0.22} />
        {/* asas */}
        {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.29 * OLLA_S, 0.27 * OLLA_S, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.035, 0.009, 8, 16, Math.PI]} /><meshStandardMaterial color="#174d92" roughness={0.3} metalness={0.2} /></mesh>)}
      </group>
      <group position={[O[0], supY - 0.07 * (1 - hervor) * Math.max(agua, te) + 0.055 * hervor, O[2]]}><ArrozSup r={rS * (1 + 0.04 * hervor)} t={t} tx={tx} cream={cream} burnt={burnt} canela={canelaPolvo} grains={grains} dip={dip} agua={agua} te={te} nata={nata} trail={trail} raja={raja} boil={hervor} /></group>
      {/* la tapa, recargada en la pared del fogón (sin tapa, siempre) */}
      <group position={[FOG[0] + 0.95 + (O[0] - FOG[0] - 0.95) * smt(tapa), FOG_TOP + 0.18 + (supY + 0.08 - FOG_TOP - 0.18) * smt(tapa) + 0.25 * Math.sin(Math.PI * Math.min(1, tapa)), FOG[2] - 0.32 + (O[2] - FOG[2] + 0.32) * smt(tapa)]} rotation={[-1.25 * (1 - smt(tapa)), 0, 0.1 * (1 - tapa)]}>
        <mesh><cylinderGeometry args={[0.29, 0.29, 0.012, 40]} /><meshPhysicalMaterial color="#ffffff" map={tx.peltre} roughness={0.3} clearcoat={0.9} /></mesh>
        <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.03, 12, 8]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
      </group>
      <Steam p={[O[0], supY + 0.02, O[2]]} t={t} amt={steam * (1 - smoke)} tex={tx.steam} spread={0.25} h={0.9} n={14} size={0.22} />
      <Steam p={[O[0], supY + 0.02, O[2]]} t={t * 1.3} amt={smoke} tex={tx.steam} spread={0.32} h={1.5} n={20} size={0.5} col="#2a221c" op={0.9} />
      {stir !== undefined && <group position={[O[0], supY - 0.02, O[2]]} rotation={[0, stir, 0]}>
        <group position={[rS * 0.55, 0, 0]} rotation={[0, 0, -0.42]}>
          <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.012, 0.016, 0.7, 12]} /><meshStandardMaterial color="#b9844e" roughness={0.65} /></mesh>
        </group>
        {/* ondita en la superficie detrás de la cuchara */}
        <mesh position={[rS * 0.55, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.045, 24, 1, 0, Math.PI]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} transparent opacity={0.7} /></mesh>
      </group>}
      {drop.sal !== undefined && drop.sal > 0 && drop.sal < 1 && Array.from({ length: 30 }, (_, i) => { const ph = cl(drop.sal! * 1.3 - rnd(i, 91) * 0.3); return ph > 0 && ph < 1 && <mesh key={"sa" + i} position={[O[0] + 0.05 + (rnd(i, 92) - 0.5) * 0.03, supY + 0.4 - ph * 0.4, O[2] + (rnd(i, 93) - 0.5) * 0.03]}><boxGeometry args={[0.007, 0.007, 0.007]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} /></mesh>; })}
      {spoon && <Cuchara base={[O[0], supY, O[2]]} lift={spoon.lift} t={t} drip={spoon.drip} slow={spoon.slow} supY={supY} />}

      {/* ingredientes que caen a la olla */}
      {drop.arroz !== undefined && drop.arroz > 0 && drop.arroz < 1.2 && Array.from({ length: 90 }, (_, i) => {
        const k = cl(drop.arroz! * 1.25 - rnd(i, 71) * 0.25), y = supY + 0.75 * (1 - k * k);
        return k < 1 && <mesh key={"a" + i} position={[O[0] + (rnd(i, 72) - 0.5) * 0.12 * (0.4 + k), y, O[2] + (rnd(i, 73) - 0.5) * 0.12 * (0.4 + k)]} rotation={[rnd(i, 74) * 3, rnd(i, 75) * 3, 0]} scale={[0.42, 1, 0.42]}><sphereGeometry args={[0.009, 6, 5]} /><meshStandardMaterial color="#f8f5ee" roughness={0.5} /></mesh>;
      })}
      {drop.leche !== undefined && drop.leche > 0 && drop.leche < 1.2 && <group>
        <group position={[O[0] - 0.2, supY + 0.46, O[2]]} rotation={[0, 0, -1.1 * win(drop.leche, 0, 0.25)]}><Lathe prof={LECHERA_P} p={[0, -0.2, 0]} c="#c9cdd0" r={0.35} m={0.7} s={0.7} /></group>
        {drop.leche > 0.2 && drop.leche < 1 && <mesh position={[O[0] - 0.07, supY + 0.17, O[2]]} rotation={[0, 0, 0.12]}><cylinderGeometry args={[0.005, 0.009, 0.34, 12]} /><meshPhysicalMaterial color="#ffffff" roughness={0.15} clearcoat={1} /></mesh>}
      </group>}
      {drop.azucar !== undefined && drop.azucar > 0 && drop.azucar < 1.2 && Array.from({ length: 80 }, (_, i) => {
        const life = 0.7, ph = ((t * 1.3 + rnd(i, 81) * life) % life) / life;
        return drop.azucar! < 1 && <mesh key={"z" + i} position={[O[0] + 0.06 + (rnd(i, 82) - 0.5) * 0.05, supY + 0.6 - ph * 0.6, O[2] + (rnd(i, 83) - 0.5) * 0.05]}><boxGeometry args={[0.006, 0.006, 0.006]} /><meshStandardMaterial color="#fffaf0" emissive="#ffffff" emissiveIntensity={0.2} /></mesh>;
      })}
      {drop.canela !== undefined && drop.canela > 0 && drop.canela < 1 && <mesh position={[O[0] - 0.04, supY + 0.7 * (1 - drop.canela * drop.canela) + 0.01, O[2] + 0.03]} rotation={[0.4, drop.canela * 5, 1.2 + drop.canela * 3]}><cylinderGeometry args={[0.014, 0.014, 0.16, 10, 1, true]} /><meshStandardMaterial color="#8a4a22" roughness={0.85} side={THREE.DoubleSide} /></mesh>}

      {/* ===== MESA DE TRABAJO con los ingredientes ===== */}
      <group position={[PT.mesa[0], 0, PT.mesa[2]]}>
        <Box p={[0, TABLE_Y - 0.03, 0]} s={[1.9, 0.06, 1.0]} c="#7a5032" map={tx.madera} r={0.85} />
        {[[-0.88, -0.43], [0.88, -0.43], [-0.88, 0.43], [0.88, 0.43]].map(([x, z]) => <Box key={x + "" + z} p={[x, (TABLE_Y - 0.06) / 2, z]} s={[0.07, TABLE_Y - 0.06, 0.07]} c="#5a3a22" map={tx.madera} />)}
        {/* lechera de peltre/aluminio */}
        <Lathe prof={LECHERA_P} p={[0.62, TABLE_Y, -0.28]} c="#c9cdd0" r={0.35} m={0.7} />
        {/* rajas de canela amarradas */}
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.25 + (i % 3) * 0.028, TABLE_Y + 0.016 + Math.floor(i / 3) * 0.026, -0.05]} rotation={[0, 0.3, Math.PI / 2]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.24, 10, 1, true]} /><meshStandardMaterial color={i % 2 ? "#8a4a22" : "#7a3e1c"} roughness={0.85} side={THREE.DoubleSide} /></mesh>)}
        <mesh position={[0.28, TABLE_Y + 0.03, -0.05]} rotation={[0, 0.3, 0]}><torusGeometry args={[0.05, 0.004, 6, 20]} /><meshStandardMaterial color="#d8c08a" /></mesh>
        {corte < 0.01 && <>{/* conos de piloncillo */}
        {[0, 1].map((i) => <mesh key={"p" + i} position={[0.05 + i * 0.12, TABLE_Y + 0.06, 0.25]} rotation={[0, 0, i ? 0 : 1.57]} castShadow><coneGeometry args={[0.05, 0.12, 16]} /><meshStandardMaterial color="#6a3510" roughness={0.6} /></mesh>)}
        {/* tazón de arroz crudo */}
        <Lathe prof={TAZON_P} p={[-0.3, TABLE_Y, 0.22]} c="#f0d0b8" map={tx.barro} inner="#7a3a1c" />
        <mesh position={[-0.3, TABLE_Y + 0.075, 0.22]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.11, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f4efe2" roughness={0.8} /></mesh>
        {/* azucarera y cazo */}
        <Lathe prof={JARRO_P} p={[-0.62, TABLE_Y, -0.25]} c="#e8e2d4" r={0.3} cc={0.6} s={0.9} />
        <Lathe prof={CAZO_P} p={[-0.65, TABLE_Y, 0.2]} c="#ffffff" map={tx.peltre} r={0.3} cc={0.6} s={0.7} inner="#f0efea" /></>}
      </group>
      <Corte p={PT.corte} on={corte} t={t} tx={tx} glow={corteGlow} />

      {/* ===== REPISA con los 7 vasitos de barro ===== */}
      <Box p={[-1.24, 1.47, -2.83]} s={[2.1, 0.05, 0.3]} c="#5a3a22" map={tx.madera} r={0.9} />
      {[-2.1, -0.4].map((x) => <Box key={x} p={[x, 1.38, -2.9]} s={[0.05, 0.16, 0.14]} c="#4f321d" map={tx.madera} />)}
      {VASOS.map((v, i) => {
        const on = vasos[i] ?? 0;
        return <group key={i} position={[v[0], 1.5, v[2]]}>
          <Lathe prof={VASO_P} p={[0, 0, 0]} c="#ffe2cc" map={tx.barro} r={0.55} cc={0.4} s={1.2} inner="#fff2da" />
          {on > 0.01 && <mesh position={[0, 0.115 * 1.2 * (0.3 + 0.62 * Math.min(1, on)), 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.058 * 1.2 * (0.8 + 0.2 * Math.min(1, on)), 28]} /><meshPhysicalMaterial color="#fff2da" map={tx.crema} roughness={0.25} clearcoat={1} /></mesh>}
          {on > 0.9 && <mesh position={[0, 0.142, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.04, 20]} /><meshStandardMaterial map={tx.canelaPolvo} transparent depthWrite={false} /></mesh>}
          {on > 0.01 && <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.08, 0.1, 40]} /><meshBasicMaterial color="#ffcf7a" transparent opacity={0.85 * Math.min(1, on)} toneMapped={false} /></mesh>}
        </group>;
      })}
      {/* jarros colgados y cucharas de palo en la pared (como en el fondo del avatar) */}
      {Array.from({ length: 6 }, (_, i) => <group key={i} position={[0.15 + i * 0.3, 2.3 + (i % 2) * 0.06, -2.9]} rotation={[0.15, 0, 0]}><Lathe prof={JARRO_P} p={[0, -0.2, 0]} c={["#f0d0b8", "#d8b49a", "#ffdcc4"][i % 3]} map={tx.barro} s={1.1} /></group>)}
      {Array.from({ length: 4 }, (_, i) => <mesh key={"cu" + i} position={[2.95, 1.6 + i * 0.02, -2.92 + 0.0]} rotation={[0, 0, 0.1 * (i - 1.5)]}><cylinderGeometry args={[0.012, 0.014, 0.55, 8]} /><meshStandardMaterial color="#9a6a3a" roughness={0.8} /></mesh>)}

      {/* ===== EL PATIO (afuera de la puerta): limonero, banca, cerca; de noche, la POSADA ===== */}
      <Limonero p={[-6.2, 0, -2.6]} t={t} />
      <group position={[-5.0, 0, 1.0]} rotation={[0, 0.4, 0]}>
        <Box p={[0, 0.45, 0]} s={[1.5, 0.06, 0.36]} c="#6b4529" map={tx.madera} />
        {[-0.6, 0.6].map((x) => <Box key={x} p={[x, 0.21, 0]} s={[0.08, 0.42, 0.3]} c="#4f321d" map={tx.madera} />)}
      </group>
      {Array.from({ length: 36 }, (_, i) => <mesh key={"v" + i} position={[-4.4 - i * 0.32, 0.55, -4.6]} castShadow><cylinderGeometry args={[0.025, 0.03, 1.1 + rnd(i, 1) * 0.3, 5]} /><meshStandardMaterial color="#6b5236" roughness={1} /></mesh>)}
      {/* farolitos de papel en cuerdas cruzadas */}
      {[[[-4.0, 2.75, -2.6], [-11.5, 2.9, 1.6]], [[-4.0, 2.75, 1.4], [-11.5, 2.9, -2.8]], [[-4.0, 2.85, -0.6], [-12, 3.0, -0.4]]].map(([a, b], j) => {
        const A = v3(a), B = v3(b); const n = 9;
        return <group key={"cu" + j}>{Array.from({ length: n }, (_, i) => { const k = (i + 0.5) / n, q = A.clone().lerp(B, k); q.y -= Math.sin(k * Math.PI) * 0.3; return <Farol key={i} p={[q.x, q.y, q.z]} tex={tx.china[(i + j * 2) % 6]} on={posada * (i % 2 || j ? 1 : 0.85)} t={t} i={i + j * 9} />; })}</group>;
      })}
      {posada > 0.05 && [[-6, 2.5, -0.6], [-9, 2.6, -0.5]].map((q, i) => <pointLight key={"pl" + i} position={q as V} intensity={6 * posada} distance={9} decay={1.5} color="#ffb070" />)}
      <Pinata p={PT.pinata} t={t} />
      {/* mesita de la posada con el ponche */}
      <group position={[-8.2, 0, 1.3]}>
        <Box p={[0, 0.74, 0]} s={[1.6, 0.05, 0.7]} c="#f0e8da" r={0.95} rad={0.01} />
        {[[-0.7, -0.28], [0.7, -0.28], [-0.7, 0.28], [0.7, 0.28]].map(([x, z]) => <Box key={x + "" + z} p={[x, 0.36, z]} s={[0.04, 0.72, 0.04]} c="#8a8a88" m={0.4} r={0.5} />)}
        <Lathe prof={[[0, 0], [0.2, 0], [0.24, 0.1], [0.25, 0.3], [0.26, 0.31]]} p={[-0.4, 0.765, 0]} c="#8a3f20" map={tx.barro} inner="#5a2a10" />
        <Steam p={[-0.4, 1.05, 0]} t={t} amt={0.35} tex={tx.steam} spread={0.25} h={0.9} n={10} size={0.3} />
        {Array.from({ length: 8 }, (_, i) => <Lathe key={i} prof={VASO_P} p={[0.05 + (i % 4) * 0.16, 0.765, (i < 4 ? -0.14 : 0.14)]} c="#f0d0b8" map={tx.barro} s={1.1} />)}
      </group>
      {/* casitas vecinas y cerros */}
      {[[-15, -6], [-17, 4], [-10, -9]].map(([x, z], i) => <Box key={i} p={[x, 1.3, z]} s={[4, 2.6, 3]} c="#d8bf98" map={tx.adobe} r={1} />)}
      {Array.from({ length: 5 }, (_, i) => <mesh key={"m" + i} position={[-30 - i * 6, 0, -20 + i * 9]}><coneGeometry args={[9 + rnd(i, 1) * 5, 7 + rnd(i, 2) * 4, 7]} /><meshStandardMaterial color={new THREE.Color("#6f7a4a").lerp(sky, 0.45)} roughness={1} flatShading /></mesh>)}
    </ThreeCanvas>
  );
};
