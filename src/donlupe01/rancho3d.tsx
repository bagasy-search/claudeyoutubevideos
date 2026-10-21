// donlupe01 · EL MUNDO: la cocina de afuera del rancho de Don Lupe en Michoacán (la misma de su foto de presentador):
// techo de lámina sobre horcones, pared encalada de ladrillo y adobe, fogón de adobe con la olla negra y la VAPORERA,
// leña apilada y pencas de maguey recargadas. En el centro la MESA de tablones con la barbacoa sobre una penca asada
// (se deshebra sola con el tenedor), el jarrito de consomé, las tortillas y SIETE JARRITOS, uno por secreto.
// Afuera: patio de tierra con magueyes, el limonero, el corral, y detrás del corral EL HOYO de barbacoa
// (piedras al rojo, olla del consomé, parrilla, pencas; la lámina con tierra se levanta y sale el vapor).
// UNA escena y UNA cámara para todo el video; eventos clavados a la voz. Render SÓLO en el farm (acá sólo stills).
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

// ---------------- puntos del mundo ----------------
export const TY = 0.78; // alto de la mesa
export const JARS: V[] = Array.from({ length: 7 }, (_, i) => [-0.78 + i * 0.26, TY, 0.3] as V); // siete jarritos al frente de la mesa
export const PT = {
  carne: [0.05, TY + 0.1, -0.12] as V,     // la barbacoa sobre la penca
  consome: [0.62, TY + 0.06, -0.05] as V,
  olla: [1.35, 1.0, -2.1] as V,            // olla negra del fogón (la de la foto)
  vaporera: [0.45, 1.25, -2.1] as V,       // vaporera de aluminio en la otra hornilla
  fire: [1.35, 0.3, -1.68] as V,
  pencas: [-2.55, 1.0, -2.0] as V,
  hoyo: [6.4, 0, -1.6] as V,               // el hoyo, detrás del corral
  corral: [9.5, 0.8, 0.5] as V,
  jars: JARS,
};

// ---------------- CÁMARA (keyframes globales; minuto 1 + resto) ----------------
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
  p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008; // cámara en mano, nunca quieta
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
  // ladrillo viejo encalado (la cal se cayó a pedazos y se ve el ladrillo y el adobe)
  muro: mk(1024, 512, (g) => {
    g.fillStyle = "#b3aa9c"; g.fillRect(0, 0, 1024, 512); // mezcla
    const brick = (r: number, c: number, i: number, col: (i: number) => string) => { g.fillStyle = col(i); g.fillRect(c * 96 + (r % 2) * 48 + 3, r * 32 + 3, 90, 26); };
    for (let r = 0; r < 16; r++) for (let c = -1; c < 11; c++) { const i = r * 13 + c + 30; brick(r, c, i, (i) => { const b = 172 + rnd(i, 1) * 34; return `rgb(${b},${b * 0.95},${b * 0.86})`; }); }
    // donde se cayó la cal: manchones irregulares (blob ruidoso), ladrillo apagado
    for (let k = 0; k < 4; k++) {
      const cx = rnd(k, 41) * 1024, cy = 120 + rnd(k, 42) * 360, rr = 40 + rnd(k, 43) * 60;
      g.save(); g.beginPath();
      for (let j = 0; j <= 28; j++) { const a = (j / 28) * 6.283, q = rr * (0.55 + 0.6 * rnd(k * 31 + j, 44)); g.lineTo(cx + Math.cos(a) * q * 1.6, cy + Math.sin(a) * q * 0.8); }
      g.closePath(); g.clip(); g.globalAlpha = 0.6;
      g.fillStyle = "#857a70"; g.fillRect(0, 0, 1024, 512);
      for (let r = 0; r < 16; r++) for (let c = -1; c < 11; c++) brick(r, c, r * 13 + c, (i) => `rgb(${128 + rnd(i, 5) * 22},${104 + rnd(i, 6) * 14},${94 + rnd(i, 7) * 10})`);
      g.globalAlpha = 1; g.restore();
    }
    noise(g, 1024, 512, 7000, (i) => `rgba(${90 + rnd(i, 1) * 50},${80 + rnd(i, 2) * 30},60,${0.05 + rnd(i, 3) * 0.1})`, 2);
    for (let k = 0; k < 30; k++) { g.strokeStyle = `rgba(110,95,80,${0.08 + rnd(k, 8) * 0.1})`; g.lineWidth = 1; g.beginPath(); let x = rnd(k, 9) * 1024, y = rnd(k, 10) * 512; g.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (rnd(k * 7 + j, 11) - 0.5) * 30; y += 8 + rnd(k * 7 + j, 12) * 14; g.lineTo(x, y); } g.stroke(); } // grietas
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(30,22,14,.28)"); gr.addColorStop(0.3, "rgba(30,22,14,0)"); gr.addColorStop(0.82, "rgba(90,70,48,0)"); gr.addColorStop(1, "rgba(90,70,48,.4)"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
  }, [1.3, 1.2]),
  enjarre: mk(512, 512, (g) => {
    g.fillStyle = "#a89a88"; g.fillRect(0, 0, 512, 512);
    for (let k = 0; k < 70; k++) { const cx = rnd(k, 1) * 512, cy = rnd(k, 2) * 512, gr = g.createRadialGradient(cx, cy, 0, cx, cy, 30 + rnd(k, 3) * 80); const d = rnd(k, 4) > 0.5; gr.addColorStop(0, d ? "rgba(70,58,46,.22)" : "rgba(220,210,196,.2)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
    noise(g, 512, 512, 4000, (i) => `rgba(${80 + rnd(i, 1) * 60},${70 + rnd(i, 2) * 40},55,${0.08 + rnd(i, 3) * 0.1})`, 2);
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(20,14,10,.35)"); gr.addColorStop(0.25, "rgba(20,14,10,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); // tizne arriba
  }, [1.5, 1]),
  adobe: mk(512, 512, (g) => {
    g.fillStyle = "#8a6a4a"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 6; r++) for (let c = -1; c < 4; c++) { const i = r * 7 + c + 10, x = c * 140 + (r % 2) * 70 + 4, y = r * 86 + 5; const b = 150 + rnd(i, 1) * 30; g.fillStyle = `rgb(${b},${b * 0.76},${b * 0.54})`; g.beginPath(); g.roundRect(x, y, 128, 74, 10); g.fill(); }
    noise(g, 512, 512, 2600, (i) => `rgba(${70 + rnd(i, 1) * 60},${50 + rnd(i, 2) * 30},30,${0.18 + rnd(i, 3) * 0.2})`, 2);
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(15,8,4,.45)"); gr.addColorStop(0.5, "rgba(15,8,4,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  }, [1.4, 0.8]),
  tierra: mk(512, 512, (g) => {
    g.fillStyle = "#9a7d5c"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 6000, (i) => `rgba(${120 + rnd(i, 1) * 70},${95 + rnd(i, 2) * 45},${65 + rnd(i, 3) * 30},.35)`, 3);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(60,44,28,${0.06 + rnd(i, 5) * 0.08})`; g.beginPath(); g.ellipse(rnd(i, 6) * 512, rnd(i, 7) * 512, 30 + rnd(i, 8) * 60, 14 + rnd(i, 9) * 30, rnd(i, 10) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${90 + rnd(i, 4) * 40},${110 + rnd(i, 5) * 30},50,${0.2 + rnd(i, 6) * 0.25})`; g.fillRect(rnd(i, 7) * 512, rnd(i, 8) * 512, 2, 6); } // zacatito
  }, [14, 14]),
  // lámina acanalada, oxidada a manchas (techo)
  lamina: mk(512, 512, (g) => {
    for (let x = 0; x < 512; x++) { const s = 0.5 + 0.5 * Math.sin((x / 512) * 6.283 * 16); const b = 110 + s * 70; g.fillStyle = `rgb(${b},${b},${b * 0.98})`; g.fillRect(x, 0, 1, 512); }
    for (let k = 0; k < 40; k++) { const gr = g.createRadialGradient(rnd(k, 1) * 512, rnd(k, 2) * 512, 0, rnd(k, 1) * 512, rnd(k, 2) * 512, 20 + rnd(k, 3) * 70); gr.addColorStop(0, `rgba(${120 + rnd(k, 4) * 40},${60 + rnd(k, 5) * 20},20,.55)`); gr.addColorStop(1, "rgba(120,60,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
    noise(g, 512, 512, 2000, (i) => `rgba(40,30,20,${0.05 + rnd(i, 1) * 0.08})`, 2);
  }, [3, 2]),
  madera: mk(256, 512, (g) => {
    g.fillStyle = "#7a5838"; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 70; k++) { g.strokeStyle = `rgba(${40 + rnd(k, 1) * 30},${25 + rnd(k, 2) * 15},10,${0.2 + rnd(k, 3) * 0.3})`; g.lineWidth = 1 + rnd(k, 4) * 2.5; g.beginPath(); const x = rnd(k, 5) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 10 * rnd(k, 6), 170, x - 12 * rnd(k, 7), 340, x + 6, 512); g.stroke(); }
    noise(g, 256, 512, 700, (i) => `rgba(255,225,180,${0.04 + rnd(i, 1) * 0.05})`, 2);
  }),
  // tablones gruesos de la mesa, gastados y manchados de grasa
  tablon: mk(1024, 512, (g) => {
    for (let r = 0; r < 4; r++) { const b = 120 + rnd(r, 1) * 30; g.fillStyle = `rgb(${b + 15},${b - 15},${b - 50})`; g.fillRect(0, r * 128, 1024, 126); g.fillStyle = "rgba(20,12,6,.7)"; g.fillRect(0, r * 128 + 125, 1024, 4); }
    for (let k = 0; k < 120; k++) { g.strokeStyle = `rgba(${50 + rnd(k, 1) * 30},${30 + rnd(k, 2) * 15},10,${0.15 + rnd(k, 3) * 0.25})`; g.lineWidth = 1 + rnd(k, 4) * 2; g.beginPath(); const y = rnd(k, 5) * 512; g.moveTo(0, y); g.bezierCurveTo(300, y + 8 * rnd(k, 6), 700, y - 8 * rnd(k, 7), 1024, y + 3); g.stroke(); }
    for (let k = 0; k < 12; k++) { g.fillStyle = `rgba(40,20,8,${0.08 + rnd(k, 8) * 0.1})`; g.beginPath(); g.ellipse(rnd(k, 9) * 1024, rnd(k, 10) * 512, 20 + rnd(k, 11) * 50, 12 + rnd(k, 12) * 30, 0, 0, 6.3); g.fill(); }
  }),
  barro: mk(512, 256, (g) => {
    g.fillStyle = "#a3502a"; g.fillRect(0, 0, 512, 256);
    noise(g, 512, 256, 1800, (i) => `rgba(${60 + rnd(i, 1) * 50},${25 + rnd(i, 2) * 15},10,${0.15 + rnd(i, 3) * 0.15})`, 2);
    for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(40,15,5,${0.08 + rnd(k, 4) * 0.1})`; g.fillRect(0, 30 + k * 38 + rnd(k, 5) * 10, 512, 3); }
  }),
  // penca: verde azulado con fibras a lo largo y la orilla más clara
  penca: mk(256, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, "#9fb07a"); gr.addColorStop(0.12, "#6f8a52"); gr.addColorStop(0.5, "#5d7a48"); gr.addColorStop(0.88, "#6f8a52"); gr.addColorStop(1, "#9fb07a");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 90; k++) { g.strokeStyle = `rgba(${40 + rnd(k, 1) * 40},${70 + rnd(k, 2) * 40},40,${0.12 + rnd(k, 3) * 0.15})`; g.lineWidth = 1; const x = rnd(k, 4) * 256; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (rnd(k, 5) - 0.5) * 10, 512); g.stroke(); }
    noise(g, 256, 512, 900, (i) => `rgba(220,230,200,${0.05 + rnd(i, 1) * 0.08})`, 2); // pruina
  }),
  // penca ASADA: verde oliva oscuro, ampollada, con quemaditos negros
  pencaAsada: mk(256, 512, (g) => {
    g.fillStyle = "#4a5a2c"; g.fillRect(0, 0, 256, 512);
    const gr0 = g.createLinearGradient(0, 0, 256, 0); gr0.addColorStop(0, "#6a7a3a"); gr0.addColorStop(0.5, "#4a5a2a"); gr0.addColorStop(1, "#6a7a3a"); g.fillStyle = gr0; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 120; k++) { g.strokeStyle = `rgba(${30 + rnd(k, 1) * 30},${40 + rnd(k, 2) * 30},15,${0.15 + rnd(k, 3) * 0.2})`; g.lineWidth = 1; const x = rnd(k, 4) * 256; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (rnd(k, 5) - 0.5) * 8, 512); g.stroke(); }
    for (let k = 0; k < 40; k++) { const cx = rnd(k, 6) * 256, cy = rnd(k, 7) * 512, gr = g.createRadialGradient(cx, cy, 0, cx, cy, 10 + rnd(k, 8) * 28); gr.addColorStop(0, `rgba(20,16,8,${0.35 + rnd(k, 9) * 0.3})`); gr.addColorStop(1, "rgba(20,16,8,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 512); } // tizne suave
    noise(g, 256, 512, 500, (i) => `rgba(200,210,140,${0.1 + rnd(i, 1) * 0.15})`, 2); // ampollitas
  }),
  // la carne en adobo: rojo ladrillo oscuro con fibras
  carne: mk(512, 512, (g) => {
    g.fillStyle = "#5a1e0e"; g.fillRect(0, 0, 512, 512);
    for (let k = 0; k < 50; k++) { g.fillStyle = `rgba(20,8,4,${0.15 + rnd(k, 20) * 0.25})`; g.beginPath(); g.ellipse(rnd(k, 21) * 512, rnd(k, 22) * 512, 10 + rnd(k, 23) * 30, 6 + rnd(k, 24) * 14, rnd(k, 25) * 3, 0, 6.3); g.fill(); }
    for (let k = 0; k < 520; k++) { g.strokeStyle = k % 3 ? `rgba(${120 + rnd(k, 1) * 70},${40 + rnd(k, 2) * 25},${18},${0.3 + rnd(k, 3) * 0.35})` : `rgba(25,8,4,${0.12 + rnd(k, 3) * 0.14})`; g.lineWidth = 1 + rnd(k, 4) * 2.5; const y = rnd(k, 5) * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 10 * rnd(k, 6), 340, y - 10, 512, y + 4); g.stroke(); }
    for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(230,190,140,${0.12 + rnd(k, 7) * 0.12})`; g.beginPath(); g.ellipse(rnd(k, 8) * 512, rnd(k, 9) * 512, 8 + rnd(k, 10) * 20, 3 + rnd(k, 11) * 6, 0, 0, 6.3); g.fill(); } // vetas de grasa
  }),
  piedra: mk(512, 512, (g) => {
    g.fillStyle = "#4a443e"; g.fillRect(0, 0, 512, 512);
    for (let k = 0; k < 70; k++) { const b = 70 + rnd(k, 1) * 60; g.fillStyle = `rgb(${b},${b * 0.95},${b * 0.88})`; g.beginPath(); g.ellipse(rnd(k, 2) * 512, rnd(k, 3) * 512, 20 + rnd(k, 4) * 40, 14 + rnd(k, 5) * 26, rnd(k, 6) * 3, 0, 6.3); g.fill(); g.strokeStyle = "rgba(20,16,12,.6)"; g.lineWidth = 3; g.stroke(); }
  }, [3, 2]),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  steam: mk(128, 128, (g) => { for (let k = 0; k < 7; k++) { const gr = g.createRadialGradient(40 + rnd(k, 1) * 48, 40 + rnd(k, 2) * 48, 0, 64, 64, 60); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } }),
  // cerro del fondo: pasto seco y encinos
  cerro: mk(1024, 256, (g) => {
    g.fillStyle = "#8a8a5a"; g.fillRect(0, 0, 1024, 256);
    noise(g, 1024, 256, 3000, (i) => `rgba(${70 + rnd(i, 1) * 50},${80 + rnd(i, 2) * 40},${40},${0.3})`, 4);
    for (let k = 0; k < 220; k++) { g.fillStyle = `rgba(${40 + rnd(k, 3) * 20},${60 + rnd(k, 4) * 30},30,.8)`; g.beginPath(); g.arc(rnd(k, 5) * 1024, 40 + rnd(k, 6) * 216, 4 + rnd(k, 7) * 7, 0, 6.3); g.fill(); }
  }, [4, 1]),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; map?: Tx; rot?: V; s?: number; m?: number; inner?: string; seg?: number; e?: string; ei?: number }> = ({ prof, p, c, r = 0.75, map, rot, s = 1, m = 0, inner, seg = 40, e, ei = 0 }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(new THREE.SplineCurve(prof.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(prof.length * 6), seg), [JSON.stringify(prof), seg]);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} side={inner ? THREE.FrontSide : THREE.DoubleSide} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
      {inner && <mesh geometry={geo}><meshStandardMaterial color={inner} roughness={0.5} side={THREE.BackSide} /></mesh>}
    </group>
  );
};
const OLLA: [number, number][] = [[0, 0], [0.13, 0.005], [0.2, 0.06], [0.23, 0.16], [0.21, 0.26], [0.15, 0.31], [0.14, 0.34], [0.165, 0.36], [0.16, 0.37]];
const JARRO: [number, number][] = [[0, 0], [0.04, 0], [0.058, 0.03], [0.066, 0.075], [0.056, 0.115], [0.052, 0.13], [0.06, 0.145], [0.058, 0.15]];
const VAPORERA: [number, number][] = [[0, 0], [0.2, 0], [0.21, 0.01], [0.21, 0.5], [0.22, 0.51], [0.215, 0.52]];

const Steam: React.FC<{ p: V; t: number; amt: number; tex: THREE.Texture; spread?: number; h?: number; n?: number; size?: number; col?: string }> = ({ p, t, amt, tex, spread = 0.25, h = 0.9, n = 16, size = 0.35, col = "#fff6ea" }) => {
  if (amt <= 0.01) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => {
        const life = 3.2 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const y = ph * h, x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.05 * ph, z = (rnd(i, 4) - 0.5) * spread;
        const s = size * (0.5 + ph * 1.4);
        return <sprite key={i} position={[x, y, z]} scale={[s, s, 1]}><spriteMaterial map={tex} color={col} transparent opacity={Math.min(1, amt) * 0.32 * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>;
      })}
    </group>
  );
};
const Fire: React.FC<{ p: V; t: number; amt: number; dot: THREE.Texture; logs?: boolean; w?: number }> = ({ p, t, amt, dot, logs = true, w = 1 }) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 13.1) * Math.sin(t * 7.7 + 1) + 0.08 * Math.sin(t * 23);
  return (
    <group position={p} scale={[w, 1, w]}>
      {logs && [-0.12, 0, 0.12].map((x, i) => <mesh key={i} position={[x, 0.04, (i - 1) * 0.03]} rotation={[0, 0, Math.PI / 2 + (i - 1) * 0.25]} castShadow><cylinderGeometry args={[0.035, 0.04, 0.5, 8]} /><meshStandardMaterial color="#3a2414" roughness={1} emissive="#ff4a10" emissiveIntensity={0.25 * amt} /></mesh>)}
      {amt > 0.02 && Array.from({ length: 9 }, (_, i) => {
        const ph = t * (2.2 + rnd(i, 1)) + rnd(i, 2) * 6, hh = (0.16 + 0.14 * rnd(i, 3)) * (0.75 + 0.25 * Math.sin(ph * 3)) * amt;
        return <mesh key={i} position={[(rnd(i, 4) - 0.5) * 0.3, 0.06 + hh / 2, (rnd(i, 5) - 0.5) * 0.12]} rotation={[0, 0, Math.sin(ph) * 0.15]}>
          <coneGeometry args={[0.05 + 0.03 * rnd(i, 6), hh, 10, 1, true]} /><meshBasicMaterial color={new THREE.Color("#ff5a10").lerp(new THREE.Color("#ffd27a"), rnd(i, 7))} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>;
      })}
      {amt > 0.02 && <sprite position={[0, 0.16, 0.05]} scale={[0.9 * fl, 0.7 * fl, 1]}><spriteMaterial map={dot} color="#ff8a2a" transparent opacity={0.55 * amt} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
      {amt > 0.02 && Array.from({ length: 10 }, (_, i) => { const life = 1.4 + rnd(i, 8), ph = ((t + rnd(i, 9) * life) % life) / life; return <mesh key={"s" + i} position={[(rnd(i, 10) - 0.5) * 0.25 + Math.sin(t * 3 + i) * 0.03, 0.15 + ph * 0.7, (rnd(i, 11) - 0.5) * 0.1]}><sphereGeometry args={[0.006, 4, 3]} /><meshBasicMaterial color="#ffb050" transparent opacity={(1 - ph) * amt} toneMapped={false} /></mesh>; })}
      <pointLight position={[0, 0.45, 0.15]} intensity={3.2 * fl * amt} distance={4} decay={1.8} color="#ff8a3a" />
    </group>
  );
};

// hoja de maguey: contorno de hoja ancha que se afila, con espinas en la orilla y la punta; extruida fina y curvada hacia atrás
const pencaGeo = (L: number, Wd: number, curl: number) => {
  const sh = new THREE.Shape(); const N = 24;
  const half = (u: number) => Wd * 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.08)), 0.7) * (1 - 0.75 * u);
  sh.moveTo(-half(0), 0);
  for (let k = 0; k <= N; k++) { const u = k / N; const tooth = 0; sh.lineTo(-half(u) - tooth, u * L); }
  sh.lineTo(0, L * 1.04);
  for (let k = N; k >= 0; k--) { const u = k / N; const tooth = 0; sh.lineTo(half(u) + tooth, u * L); }
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 2, curveSegments: 4 });
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i), x = pos.getX(i), u = y / L; pos.setZ(i, pos.getZ(i) + curl * u * u * L + x * x * 1.8); } // se dobla hacia atrás y forma canal
  pos.needsUpdate = true; g.computeVertexNormals();
  // UV a lo largo de la hoja
  const uv = g.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, Math.min(0.96, Math.max(0.04, (pos.getX(i) / Wd) + 0.5)), pos.getY(i) / L);
  return g;
};
const Penca: React.FC<{ p: V; rot?: V; L?: number; Wd?: number; curl?: number; tx: { penca: THREE.Texture; pencaAsada: THREE.Texture }; asada?: number; glow?: number }> = ({ p, rot, L = 1.1, Wd = 0.24, curl = 0.25, tx, asada = 0, glow = 0 }) => {
  const geo = useMemo(() => pencaGeo(L, Wd, curl), [L, Wd, curl]);
  return <mesh position={p} rotation={rot} geometry={geo} castShadow receiveShadow>
    <meshPhysicalMaterial map={asada > 0.5 ? tx.pencaAsada : tx.penca} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#c8c09a"), asada > 0.5 ? 0 : asada)} roughness={0.55 - 0.25 * asada} clearcoat={0.3 + 0.6 * asada} clearcoatRoughness={0.3} emissive="#ff6a20" emissiveIntensity={glow} />
  </mesh>;
};
// maguey entero: roseta de pencas que suben
const Maguey: React.FC<{ p: V; s?: number; seed?: number; tx: { penca: THREE.Texture; pencaAsada: THREE.Texture } }> = ({ p, s = 1, seed = 0, tx }) => (
  <group position={p} scale={s}>
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2 + rnd(i, seed + 1) * 0.3, ring = i % 3, tilt = 0.35 + ring * 0.32 + rnd(i, seed + 2) * 0.12;
      return <group key={i} rotation={[0, a, 0]}><Penca p={[0, 0.02, 0.05]} rot={[-tilt, 0, 0]} L={0.9 - ring * 0.15 + rnd(i, seed + 3) * 0.2} Wd={0.2} curl={-0.15} tx={tx} /></group>;
    })}
  </group>
);
const Limonero: React.FC<{ p: V; t: number }> = ({ p, t }) => (
  <group position={p}>
    <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.07, 0.11, 1.6, 8]} /><meshStandardMaterial color="#5a4330" roughness={1} /></mesh>
    {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.5, 1.8 + rnd(i, 2) * 0.9 + Math.sin(t * 0.8 + i) * 0.01, (rnd(i, 3) - 0.5) * 1.3]} castShadow><sphereGeometry args={[0.38 + rnd(i, 4) * 0.25, 18, 14]} /><meshStandardMaterial color={new THREE.Color("#4f7a2a").lerp(new THREE.Color("#8aa83f"), rnd(i, 5))} roughness={0.9} /></mesh>)}
    {Array.from({ length: 22 }, (_, i) => <mesh key={"l" + i} position={[(rnd(i, 6) - 0.5) * 1.7, 1.6 + rnd(i, 7) * 1.1, (rnd(i, 8) - 0.5) * 1.5]}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={rnd(i, 9) > 0.4 ? "#c9cf3a" : "#e2d64a"} roughness={0.5} /></mesh>)}
  </group>
);

// LA BARBACOA: tres trozos grandes de carne en adobo (masa irregular con "corteza") cubiertos de hebras finas;
// desh 0..1 = los trozos se abren y las hebras se desparraman sobre la penca, el hueso sale limpio. dry 0..1 = la carne "mala": gris y tiesa.
const lumpGeo = (seed: number) => {
  const g = new THREE.SphereGeometry(1, 40, 28); const p = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 1 + 0.16 * Math.sin(v.x * 5 + seed) * Math.sin(v.y * 4 + seed * 2) + 0.1 * Math.sin(v.z * 9 + seed * 3) + 0.05 * Math.sin((v.x + v.y) * 17 + seed);
    v.multiplyScalar(n); if (v.y < -0.25) v.y = -0.25 + (v.y + 0.25) * 0.2; // base plana sobre la penca
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
};
const Barbacoa: React.FC<{ p: V; t: number; desh: number; dry?: number; tx: { carne: THREE.Texture }; s?: number }> = ({ p, t, desh, dry = 0, tx, s = 1 }) => {
  const lumps = useMemo(() => [0, 1, 2].map((k) => lumpGeo(k * 2.3 + 1)), []);
  // hebras: nacen SOBRE la superficie de los trozos (casquete de arriba) y al deshebrar resbalan hacia la penca
  const shreds = useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const a = rnd(i, 71) * Math.PI * 2, r = 0.03 + Math.sqrt(rnd(i, 72)) * 0.08;
    const top = 0.1 * Math.sqrt(Math.max(0, 1 - (r / 0.13) ** 2));
    const len = 0.05 + rnd(i, 74) * 0.06, bend = (rnd(i, 75) - 0.5) * 0.03;
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-len / 2, 0, 0), new THREE.Vector3(-len / 6, 0.004, bend), new THREE.Vector3(len / 6, 0.002, -bend * 0.6), new THREE.Vector3(len / 2, -0.004, bend * 0.4)]), 10, 0.0026 + rnd(i, 76) * 0.0018, 5, false);
    return { a, r, y: 0.012 + top, geo, rot: rnd(i, 77) * Math.PI, fall: 0.5 + rnd(i, 78) * 0.8, inner: rnd(i, 79) > 0.65 };
  }), []);
  const dk = new THREE.Color("#ffffff").lerp(new THREE.Color("#9a8c84"), dry);
  const inC = new THREE.Color("#5e2414").lerp(new THREE.Color("#6e625a"), dry), outC = new THREE.Color("#3e1a0e").lerp(new THREE.Color("#5a4e46"), dry);
  const LP: [number, number, number, number, number, number][] = [[-0.03, 0.05, -0.01, 0.09, 0.075, 0.075], [0.075, 0.045, 0.035, 0.07, 0.062, 0.06], [-0.1, 0.04, 0.055, 0.06, 0.052, 0.055]];
  return (
    <group position={p} scale={s}>
      {LP.map(([x, y, z, sx, sy, sz], k) => { const o = sm(desh * 1.3 - k * 0.1); const dx = Math.cos(k * 2.1), dz = Math.sin(k * 2.1);
        return <mesh key={k} geometry={lumps[k]} position={[x + dx * 0.07 * o, y - 0.012 * o, z + dz * 0.05 * o]} scale={[sx * (1 + 0.25 * o), sy * (1 - 0.35 * o), sz * (1 + 0.2 * o)]} rotation={[0, k * 1.3 + 0.2 * o, 0.1 * o]} castShadow receiveShadow>
          <meshPhysicalMaterial map={tx.carne} color={dk} roughness={0.5 + 0.4 * dry} clearcoat={0.55 * (1 - dry)} clearcoatRoughness={0.35} />
        </mesh>; })}
      {shreds.map((h, i) => {
        const k = sm(desh * h.fall), out = h.r + k * (0.04 + 0.1 * rnd(i, 80)), yy = h.y * (1 - 0.85 * k) + 0.005;
        return <mesh key={i} geometry={h.geo} position={[Math.cos(h.a) * out, yy, Math.sin(h.a) * out * 0.8]} rotation={[0, h.rot, -0.25 * (1 - k) * Math.sign(Math.cos(h.a))]} castShadow>
          <meshPhysicalMaterial color={h.inner ? inC : outC} roughness={0.55 + 0.35 * dry} clearcoat={0.35 * (1 - dry)} clearcoatRoughness={0.4} />
        </mesh>;
      })}
      {/* juguito: brillos chiquitos de grasa */}
      {dry < 0.5 && Array.from({ length: 14 }, (_, i) => <mesh key={"g" + i} position={[(rnd(i, 81) - 0.5) * 0.2, 0.09 - desh * 0.06 + rnd(i, 84) * 0.03, (rnd(i, 82) - 0.5) * 0.14]}><sphereGeometry args={[0.0035 + rnd(i, 83) * 0.003, 6, 5]} /><meshPhysicalMaterial color="#c8742a" roughness={0.05} clearcoat={1} /></mesh>)}
      {/* el hueso que sale limpio */}
      <group position={[0.02 + desh * 0.2, 0.035 + desh * 0.03, -0.02]} rotation={[0, 0.5, Math.PI / 2 - 0.1]} scale={0.6 + 0.4 * sm(desh * 2)} visible={false}>
        <mesh castShadow><cylinderGeometry args={[0.016, 0.014, 0.24, 10]} /><meshStandardMaterial color="#e9dcc2" roughness={0.6} /></mesh>
        {[-0.13, 0.13].map((y) => <mesh key={y} position={[0, y, 0]} castShadow><sphereGeometry args={[0.026, 12, 10]} /><meshStandardMaterial color="#e2d2b2" roughness={0.6} /></mesh>)}
      </group>
    </group>
  );
};
// tenedor de dos picos (de trinche): fork 0..1 = baja, entra y jala hacia afuera
const Trinche: React.FC<{ p: V; fork: number; t: number }> = ({ p, fork, t }) => {
  const dn = sm(fork * 2), pull = sm(fork * 2 - 1);
  return <group position={[p[0] + 0.05 + pull * 0.16, p[1] + 0.32 - dn * 0.2 + pull * 0.04, p[2] + 0.02]} rotation={[0, 0.3, -0.5 - pull * 0.35]}>
    <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.22, 10]} /><meshStandardMaterial color="#3a2414" roughness={0.7} /></mesh>
    {[-0.012, 0.012].map((x) => <mesh key={x} position={[x, -0.01, 0]} castShadow><cylinderGeometry args={[0.0035, 0.002, 0.18, 6]} /><meshStandardMaterial color="#c9c9c9" metalness={0.85} roughness={0.25} /></mesh>)}
    <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.034, 0.02, 0.008]} /><meshStandardMaterial color="#bbb" metalness={0.85} roughness={0.3} /></mesh>
  </group>;
};

export type WorldProps = {
  t: number;
  night?: number;        // 0 día · 1 noche
  dawn?: number;         // 0..1 madrugada (azul)
  fire?: number;         // fogón
  desh?: number;         // la barbacoa de la mesa se deshebra
  fork?: number;         // el trinche baja y jala
  meatSteam?: number;    // vapor de la carne
  jarOn?: number[];      // 0..1 por jarrito (se encienden, uno por secreto)
  jarSteam?: number[];
  hoyo?: number;         // 0 tapado · 1 la lámina se levanta y sale el vapor
  brasas?: number;       // 0..1 piedras al rojo / leña ardiendo en el hoyo (antes de bajar la carne)
  hoyoSteam?: number;
  vapor?: number;        // vapor que escapa de la vaporera
  pencaFire?: number;    // 0..1 una penca sobre la lumbre del patio (se asa)
  dry?: number;          // la carne de la mesa es la "mala" (hervida, gris)
  top?: number;          // vista cenital: se esconde el techo
  roofOff?: number;      // 0..1 el techo se vuelve transparente (tomas desde arriba)
  dof?: number;          // apertura de la profundidad de campo (0 = todo nítido); enfoca al punto que mira la cámara
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, night = 0, dawn = 0, fire = 1, desh = 0, fork = 0, meatSteam = 1, jarOn = [], jarSteam = [], hoyo = 0, brasas = 0, hoyoSteam = 0, vapor = 0.6, pencaFire = 0, dry = 0, top = 0, roofOff = 0, dof = 0.0012 } = pr;
  const ck = camAt(t), focus = ck.p.distanceTo(ck.l);
  const tx = useTx();
  const dark = Math.max(night, dawn);
  const sky = new THREE.Color("#cfd9e0").lerp(new THREE.Color("#6f86b0"), dawn).lerp(new THREE.Color("#0a1022"), night);
  const sunI = 2.4 * (1 - dark);
  const H = PT.hoyo;
  // piso con el agujero del hoyo
  const groundGeo = useMemo(() => {
    const sh = new THREE.Shape(); sh.moveTo(-60, -60); sh.lineTo(60, -60); sh.lineTo(60, 60); sh.lineTo(-60, 60); sh.closePath();
    const hole = new THREE.Path(); hole.absarc(H[0], H[2], 0.55, 0, Math.PI * 2, true); sh.holes.push(hole);
    const g = new THREE.ShapeGeometry(sh, 48); const uv = g.attributes.uv as THREE.BufferAttribute; const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 8, pos.getY(i) / 8);
    return g;
  }, []);
  const roofOp = 1 - Math.max(top, roofOff);
  const lift = sm(hoyo * 1.6), slide = sm(hoyo * 1.6 - 0.6);
  return (
    <ThreeCanvas width={W} height={H_PX} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.5 + 0.3 * dark} threshold={0.86 - 0.1 * dark} exposure={1.0 + 0.1 * dawn - 0.12 * night} env={0.24 * (1 - dark) + 0.05} focus={focus} aperture={dof} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 14, 60]} />
      <hemisphereLight args={[new THREE.Color("#e6ecf2").lerp(new THREE.Color("#33456e"), dark).getHex(), 0x3a2a1a, 0.6 - 0.1 * dawn - 0.35 * night]} />
      {/* luz de mañana nublada, de lado (como la foto de Lupe) */}
      <directionalLight position={[9, 8, 5]} intensity={sunI} color="#fff1dc" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-14} shadow-camera-right={16} shadow-camera-top={10} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {night > 0.01 && <directionalLight position={[10, 9, 6]} intensity={1.4 * night} color="#9fb6ff" />}
      {dawn > 0.01 && <directionalLight position={[-6, 5, 8]} intensity={1.9 * dawn} color="#b4c6ff" />}
      {/* foco pelón colgado de la viga */}
      <pointLight position={[0.1, 2.25, -0.4]} intensity={1.2 + 2.6 * dark} distance={6} decay={1.5} color="#ffc27a" />
      <mesh position={[0.1, 2.28, -0.4]}><sphereGeometry args={[0.045, 12, 10]} /><meshBasicMaterial color={new THREE.Color("#7a6a50").lerp(new THREE.Color("#fff0c8"), 0.3 + 0.7 * dark)} toneMapped={false} /></mesh>
      <mesh position={[0.1, 2.5, -0.4]}><cylinderGeometry args={[0.004, 0.004, 0.42, 4]} /><meshStandardMaterial color="#111" /></mesh>

      {/* ===== piso de tierra (con el agujero del hoyo) ===== */}
      <mesh geometry={groundGeo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial map={tx.tierra} color="#cfc4b4" roughness={1} /></mesh>
      {/* cerros del fondo */}
      {[[-30, -55, 26, 9], [10, -60, 34, 12], [45, -50, 24, 8], [70, -20, 22, 7]].map(([x, z, r, h], i) => <mesh key={i} position={[x, -1, z]} scale={[r, h, r * 0.6]}><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={tx.cerro} color={new THREE.Color("#c9c6a0").lerp(new THREE.Color("#33405a"), dark * 0.8)} roughness={1} /></mesh>)}

      {/* ===== la cocina de afuera ===== */}
      {/* pared del fondo: ladrillo encalado + la parte de adobe */}
      <Box p={[-0.6, 1.3, -2.75]} s={[5.4, 2.6, 0.3]} c="#ffffff" map={tx.muro} r={1} rad={0.03} />
      <Box p={[-3.2, 1.3, -1.2]} s={[0.3, 2.6, 3.4]} c="#ffffff" map={tx.muro} r={1} rad={0.03} />
      <Box p={[2.75, 0.95, -2.75]} s={[1.7, 1.9, 0.3]} c="#d9b48c" map={tx.adobe} r={1} rad={0.05} />
      {/* horcones y vigas */}
      {[[-3.0, 1.6], [2.9, 1.6], [2.9, -2.5], [-0.2, 1.6]].map(([x, z], i) => <mesh key={i} position={[x, 1.25, z]} castShadow><cylinderGeometry args={[0.07, 0.085, 2.5, 9]} /><meshStandardMaterial map={tx.madera} color="#a08060" roughness={1} /></mesh>)}
      <Box p={[0, 2.5, 1.6]} s={[6.2, 0.14, 0.14]} c="#8a6a48" map={tx.madera} r={1} />
      <Box p={[2.9, 2.55, -0.45]} s={[0.14, 0.14, 4.4]} c="#8a6a48" map={tx.madera} r={1} />
      {[-2.2, -0.9, 0.4, 1.7].map((x) => <Box key={x} p={[x, 2.62, -0.5]} s={[0.1, 0.1, 4.6]} c="#7a5a3a" map={tx.madera} r={1} />)}
      {/* techo de lámina (inclinado hacia adelante) */}
      {roofOp > 0.02 && <mesh position={[0, 2.72, -0.5]} rotation={[-Math.PI / 2 + 0.08, 0, 0]} castShadow={roofOp > 0.9} receiveShadow>
        <planeGeometry args={[6.6, 5.0]} /><meshStandardMaterial map={tx.lamina} color="#d8d8d4" metalness={0.55} roughness={0.55} side={THREE.DoubleSide} transparent={roofOp < 1} opacity={roofOp} depthWrite={roofOp > 0.9} />
      </mesh>}

      {/* FOGÓN de adobe (como el de la foto): olla negra a la derecha, vaporera a la izquierda */}
      <group position={[0.9, 0, -2.15]}>
        <Box p={[0, 0.45, 0]} s={[1.9, 0.9, 0.85]} c="#ffffff" map={tx.enjarre} r={1} rad={0.07} />
        <mesh position={[0.45, 0.3, 0.428]}><planeGeometry args={[0.55, 0.36]} /><meshStandardMaterial color="#120806" roughness={1} emissive="#ff4a10" emissiveIntensity={0.25 * fire} /></mesh>
        <mesh position={[-0.45, 0.3, 0.428]}><planeGeometry args={[0.5, 0.34]} /><meshStandardMaterial color="#120806" roughness={1} emissive="#ff4a10" emissiveIntensity={0.18 * fire} /></mesh>
      </group>
      <Lathe prof={OLLA} p={[PT.olla[0], 0.9, PT.olla[2]]} c="#1d1a18" r={0.45} m={0.1} s={1.05} />
      <Steam p={[PT.olla[0], 1.28, PT.olla[2]]} t={t} amt={0.5 * fire} tex={tx.steam} spread={0.2} h={1.1} n={10} size={0.32} />
      {/* vaporera de aluminio con tapa */}
      <group position={[PT.vaporera[0], 0.9, PT.vaporera[2]]}>
        <Lathe prof={VAPORERA} p={[0, 0, 0]} c="#c4c7c9" r={0.32} m={0.75} inner="#7a7d80" />
        <mesh position={[0, 0.535, 0]} castShadow><sphereGeometry args={[0.222, 32, 10, 0, Math.PI * 2, 0, Math.PI / 5]} /><meshStandardMaterial color="#c9ccce" metalness={0.75} roughness={0.3} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.025, 0.03, 0.04, 12]} /><meshStandardMaterial color="#222" roughness={0.6} /></mesh>
        <Steam p={[0, 0.55, 0]} t={t} amt={vapor} tex={tx.steam} spread={0.38} h={1.2} n={14} size={0.3} />
      </group>
      <Fire p={[PT.fire[0], 0.12, PT.fire[2]]} t={t} amt={fire} dot={tx.dot} w={0.8} />
      <Fire p={[PT.vaporera[0], 0.12, PT.fire[2]]} t={t + 3} amt={fire * 0.8} dot={tx.dot} w={0.7} />
      {/* jarritos sobre el fogón */}
      {[[1.7, 0], [1.85, 0.1]].map(([dx, dz], i) => <Lathe key={i} prof={JARRO} p={[1.72 + dx * 0.08, 0.9, -2.35 + dz]} c="#8a3f20" map={tx.barro} s={1.1} />)}
      {/* leña apilada (cabos de frente) */}
      {Array.from({ length: 36 }, (_, i) => { const r = Math.floor(i / 9), c = i % 9; return <mesh key={i} position={[-2.78 + c * 0.1 + (r % 2) * 0.05, 0.06 + r * 0.1, -2.2 + rnd(i, 3) * 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.048, 0.052, 0.8, 7]} /><meshStandardMaterial color={["#8a6a48", "#7a5a3a", "#9a7a52"][i % 3]} roughness={1} /></mesh>; })}
      {/* pencas de maguey recargadas en la pared (las de la foto) */}
      {Array.from({ length: 7 }, (_, i) => <Penca key={i} p={[-2.95 + i * 0.07, 0.02, -1.7 + i * 0.22]} rot={[0.05, 0.6 + i * 0.12, 0.28 + rnd(i, 5) * 0.08]} L={1.45 + rnd(i, 6) * 0.3} Wd={0.28} curl={0.12} tx={tx} />)}
      {/* bancas */}
      <Box p={[-1.6, 0.42, -1.6]} s={[1.4, 0.07, 0.34]} c="#8a6a48" map={tx.madera} />
      {[-2.15, -1.05].map((x) => <Box key={x} p={[x, 0.2, -1.6]} s={[0.08, 0.4, 0.28]} c="#6a4a2a" map={tx.madera} />)}

      {/* ===== LA MESA de tablones ===== */}
      <group>
        <Box p={[0, TY - 0.04, 0]} s={[2.2, 0.08, 1.0]} c="#ffffff" map={tx.tablon} r={0.85} rad={0.02} />
        {[[-1.0, -0.42], [1.0, -0.42], [-1.0, 0.42], [1.0, 0.42]].map(([x, z]) => <Box key={x + "" + z} p={[x, (TY - 0.08) / 2, z]} s={[0.09, TY - 0.08, 0.09]} c="#6a4a2a" map={tx.madera} />)}
        {/* la penca asada como plato, con la barbacoa encima */}
        <Penca p={[-0.32, TY + 0.005, -0.14]} rot={[-Math.PI / 2, 0, -Math.PI / 2 + 0.08]} L={0.78} Wd={0.36} curl={0.03} tx={tx} asada={1} />
        <Barbacoa p={PT.carne} t={t} desh={desh} dry={dry} tx={tx} />
        <Trinche p={PT.carne} fork={fork} t={t} />
        <Steam p={[PT.carne[0], TY + 0.15, PT.carne[2]]} t={t} amt={meatSteam * (1 - dry)} tex={tx.steam} spread={0.25} h={0.8} n={14} size={0.22} />
        {/* jarrito de consomé (rojo, con grasita) */}
        <Lathe prof={JARRO} p={PT.consome} c="#8a3f20" map={tx.barro} s={1.2} inner="#3a1408" />
        <mesh position={[PT.consome[0], PT.consome[1] + 0.135 * 1.2 - 0.012, PT.consome[2]]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.055 * 1.2, 24]} /><meshPhysicalMaterial color={new THREE.Color("#8a2a10").lerp(new THREE.Color("#b8a888"), dry)} roughness={0.15} clearcoat={1} /></mesh>
        <Steam p={[PT.consome[0], PT.consome[1] + 0.17, PT.consome[2]]} t={t} amt={0.6 * (1 - dry)} tex={tx.steam} spread={0.08} h={0.5} n={8} size={0.12} />
        {/* tortillero de tela y las tortillas */}
        <group position={[0.75, TY, -0.32]}>
          <mesh castShadow><cylinderGeometry args={[0.13, 0.12, 0.06, 28]} /><meshStandardMaterial color="#e9dcc4" roughness={0.9} /></mesh>
          {[0, 1, 2].map((k) => <mesh key={k} position={[0, 0.035 + k * 0.006, 0]} rotation={[0, k, 0]}><cylinderGeometry args={[0.105, 0.105, 0.005, 24]} /><meshStandardMaterial color="#e2c98e" roughness={0.85} /></mesh>)}
          <mesh position={[0.06, 0.06, 0.06]} rotation={[0.3, 0.4, 0.2]}><boxGeometry args={[0.22, 0.01, 0.2]} /><meshStandardMaterial color="#d23a3a" roughness={0.95} /></mesh>
        </group>
        {/* molcajete con salsa */}
        <group position={[-0.78, TY, -0.3]}>
          <Lathe prof={[[0, 0], [0.07, 0], [0.09, 0.03], [0.11, 0.08], [0.115, 0.1], [0.105, 0.105]]} p={[0, 0, 0]} c="#3a3836" r={0.95} />
          <mesh position={[0, 0.088, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.095, 24]} /><meshPhysicalMaterial color="#9a2410" roughness={0.3} clearcoat={0.8} /></mesh>
        </group>
        {/* LOS SIETE JARRITOS */}
        {JARS.map((q, i) => {
          const on = jarOn[i] ?? 0, sh = Math.min(1, on * 1.6);
          if (sh <= 0.01) return null;
          return <group key={i} position={[q[0], q[1] + (1 - sm(sh)) * 0.12, q[2]]} userData={{ noAO: true }} scale={0.85 + 0.15 * sh}>
            <Lathe prof={JARRO} p={[0, 0, 0]} c="#8a3f20" map={tx.barro} s={0.85} e="#ff6a20" ei={0.07 * on} seg={64} />
            <mesh position={[0, 0.121, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.049, 48]} /><meshPhysicalMaterial color="#5a2a10" roughness={0.15} clearcoat={1} /></mesh>
            {false && on > 0.02 && <sprite position={[0, 0.07, 0.06]} scale={[0.3, 0.3, 1]}><spriteMaterial map={tx.dot} color="#ffb766" transparent opacity={0.22 * on} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>}
            <Steam p={[0, 0.13, 0]} t={t + i} amt={jarSteam[i] ?? 0} tex={tx.steam} spread={0.05} h={0.4} n={6} size={0.09} />
          </group>;
        })}
      </group>

      {/* ===== el patio ===== */}
      <Limonero p={[4.4, 0, -3.6]} t={t} />
      <Maguey p={[-4.6, 0, 2.6]} s={1.3} seed={1} tx={tx} />
      <Maguey p={[4.2, 0, 2.9]} s={1.1} seed={2} tx={tx} />
      <Maguey p={[8.0, 0, -4.2]} s={1.5} seed={3} tx={tx} />
      <Maguey p={[4.9, 0, -0.2]} s={0.9} seed={4} tx={tx} />
      <Maguey p={[11.5, 0, -5.5]} s={1.6} seed={5} tx={tx} />
      {/* lumbre del patio para asar la penca */}
      <group position={[3.6, 0, 1.1]}>
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 6.283; return <mesh key={i} position={[Math.cos(a) * 0.32, 0.06, Math.sin(a) * 0.32]} castShadow><dodecahedronGeometry args={[0.09 + rnd(i, 3) * 0.03, 0]} /><meshStandardMaterial map={tx.piedra} color="#cfc8be" roughness={1} /></mesh>; })}
        <Fire p={[0, 0.02, 0]} t={t + 7} amt={0.6 + 0.6 * pencaFire} dot={tx.dot} w={0.9} />
        {pencaFire > 0.01 && <Penca p={[-0.45, 0.42, 0]} rot={[0, 0, -Math.PI / 2 + 0.15]} L={0.95} Wd={0.26} curl={0.05 + 0.25 * pencaFire} tx={tx} asada={pencaFire} glow={0.25 * pencaFire} />}
      </group>
      {/* el corral: postes y travesaños */}
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[8.2, 0.65, -4 + i * 1.05]} castShadow><cylinderGeometry args={[0.06, 0.075, 1.3, 7]} /><meshStandardMaterial map={tx.madera} color="#9a8060" roughness={1} /></mesh>)}
      {[0.45, 0.95].map((y) => <mesh key={y} position={[8.2, y, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 8.4, 6]} /><meshStandardMaterial map={tx.madera} color="#8a7050" roughness={1} /></mesh>)}

      {/* ===== EL HOYO ===== */}
      <group position={[H[0], 0, H[2]]}>
        {/* bordo de tierra alrededor */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}><torusGeometry args={[0.72, 0.16, 12, 40]} /><meshStandardMaterial map={tx.tierra} color="#b89a74" roughness={1} /></mesh>
        {/* paredes del pozo forradas de piedra */}
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.55, 0.5, 1.0, 40, 1, true]} /><meshStandardMaterial map={tx.piedra} color="#8a7a6a" roughness={1} side={THREE.BackSide} emissive="#ff3a08" emissiveIntensity={0.25 * brasas} /></mesh>
        {/* fondo: piedras al rojo */}
        {Array.from({ length: 22 }, (_, i) => { const a = rnd(i, 91) * 6.283, d = Math.sqrt(rnd(i, 92)) * 0.42; return <mesh key={i} position={[Math.cos(a) * d, -0.95, Math.sin(a) * d]}><dodecahedronGeometry args={[0.07 + rnd(i, 93) * 0.04, 0]} /><meshStandardMaterial color="#3a2a22" roughness={0.9} emissive="#ff3a08" emissiveIntensity={0.3 + 1.8 * brasas * (0.6 + 0.4 * Math.sin(t * 3 + i))} /></mesh>; })}
        <pointLight position={[0, -0.6, 0]} intensity={(0.4 + 4 * brasas) * (0.9 + 0.1 * Math.sin(t * 9))} distance={2.5} decay={1.5} color="#ff6a20" />
        {/* olla del consomé + parrilla + pencas con la carne */}
        <Lathe prof={OLLA} p={[0, -0.92, 0]} c="#6a3a22" map={tx.barro} s={0.85} />
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.1, 0.46, 24, 1]} /><meshStandardMaterial color="#2a2624" metalness={0.6} roughness={0.5} wireframe /></mesh>
        {Array.from({ length: 6 }, (_, i) => <Penca key={i} p={[0, -0.52, 0]} rot={[-Math.PI / 2 + 0.6, (i / 6) * Math.PI * 2, 0]} L={0.55} Wd={0.22} curl={0.3} tx={tx} asada={1} />)}
        {/* LA LÁMINA con tierra y el costal: se levanta y se hace a un lado */}
        <group position={[slide * 1.0, 0.07 + lift * 0.55 - slide * 0.5, slide * 0.3]} rotation={[0, 0, -lift * 0.6 + slide * 0.55]}>
          <mesh castShadow receiveShadow><boxGeometry args={[1.4, 0.025, 1.3]} /><meshStandardMaterial map={tx.lamina} color="#b8b4ac" metalness={0.5} roughness={0.6} /></mesh>
          <mesh position={[0, 0.05, 0]} castShadow scale={[1, 0.18, 0.95]}><sphereGeometry args={[0.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={tx.tierra} color="#a58a66" roughness={1} /></mesh>
          <mesh position={[0.2, 0.12, 0.1]} rotation={[-Math.PI / 2, 0, 0.4]}><planeGeometry args={[0.7, 0.5]} /><meshStandardMaterial color="#8a7a5a" roughness={1} side={THREE.DoubleSide} /></mesh>
        </group>
        {/* el vapor que sale cuando se destapa (columna blanca) */}
        <Steam p={[0, 0.0, 0]} t={t} amt={hoyoSteam * 2.2} tex={tx.steam} spread={0.8} h={3.2} n={34} size={0.9} />
        {/* humo de la leña antes de bajar la carne */}
        <Steam p={[0, 0.0, 0]} t={t} amt={brasas * 1.2} tex={tx.steam} spread={0.6} h={2.6} n={18} size={0.7} col="#c9bfb4" />
        {brasas > 0.02 && <Fire p={[0, -0.1, 0]} t={t + 11} amt={brasas * 1.2} dot={tx.dot} w={1.4} />}
      </group>
      {/* pala clavada junto al hoyo */}
      <group position={[H[0] - 0.95, 0, H[2] - 0.5]} rotation={[0.15, 0.4, 0.12]}>
        <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.02, 0.022, 1.1, 8]} /><meshStandardMaterial map={tx.madera} color="#b09070" /></mesh>
        <mesh position={[0, 0.06, 0]} castShadow><boxGeometry args={[0.22, 0.28, 0.01]} /><meshStandardMaterial color="#6a6a68" metalness={0.6} roughness={0.5} /></mesh>
      </group>
    </ThreeCanvas>
  );
};
const H_PX = H;
