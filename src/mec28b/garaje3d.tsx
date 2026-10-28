// mec28 · EL MUNDO: el garaje de Claudio con la luz del tubo y la del portón abierto. A la izquierda el auto plateado viejo con el capó
// abierto (el motor, la batería, la caja de fusibles del motor y el turbo). A la derecha el banco de trabajo con la PIEZA del video:
//   mec28a → la caja de fusibles gigante con su tapa-mapa, la pinza, el fusible que se saca, la lámpara de prueba, el tester, la radio y el relé;
//   mec28b → el tablero del auto montado en el banco (relojes, la flechita del surtidor, los testigos, la pantallita) y el volante;
//   mec28c → el turbo en corte sobre un soporte (el caracol frío del aire, el caliente de los gases, el eje con su aceite).
// Atrás el panel de herramientas con el reloj, el carro rojo, el estante con aceites y adelante el banquito con el Manual del Mecánico.
// UNA escena y UNA cámara (KEYS en tl.ts). Luces SIEMPRE montadas (sólo cambia la intensidad). Render SÓLO en el farm.
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();
type V = [number, number, number];
const SLUG = P.replace("/", "");
const MODE = SLUG === "mec28b" ? "dash" : SLUG === "mec28c" ? "turbo" : "fuse";
const PAGE = SLUG === "mec28b" ? "m1_p035" : SLUG === "mec28c" ? "m1_p032" : "m1_p023";

// ---------------- medidas ----------------
export const CAR: V = [-1.3, 0, -0.8];          // centro del auto (mira a +z; el frente en z 1,2)
export const BAY: V = [-1.3, 0.78, 0.6];        // el vano del motor
export const EFUSE: V = [-0.78, 0.86, 0.38];    // caja de fusibles del motor
export const TURBO_CAR: V = [-1.72, 0.84, 0.32];
export const BENCH: V = [1.6, 0.9, -0.95];      // tapa del banco (alto 0,9)
export const PROP: V = [1.55, 0.94, -1.05];     // la pieza del video sobre el banco
export const BOOK: V = [0.35, 0.52, 0.95];
export const CLOCK: V = [2.75, 1.95, -1.42];

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.008; p.y += Math.sin(t * 0.71 + 1) * 0.006;
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

// ---------------- texturas ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
// íconos blancos sobre transparente (los dibujitos de la tapa y los testigos del tablero)
const ICON: Record<string, (g: CanvasRenderingContext2D, s: number) => void> = {
  radio: (g, s) => { g.strokeRect(s * 0.15, s * 0.3, s * 0.7, s * 0.42); g.beginPath(); g.arc(s * 0.36, s * 0.51, s * 0.1, 0, 6.3); g.stroke(); g.fillRect(s * 0.55, s * 0.42, s * 0.22, s * 0.05); g.fillRect(s * 0.55, s * 0.54, s * 0.22, s * 0.05); },
  bulb: (g, s) => { g.beginPath(); g.arc(s * 0.5, s * 0.4, s * 0.2, 0.7, Math.PI - 0.7, true); g.lineTo(s * 0.42, s * 0.7); g.lineTo(s * 0.58, s * 0.7); g.closePath(); g.stroke(); g.fillRect(s * 0.42, s * 0.74, s * 0.16, s * 0.06); },
  wiper: (g, s) => { g.beginPath(); g.arc(s * 0.5, s * 0.75, s * 0.38, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.beginPath(); g.moveTo(s * 0.5, s * 0.75); g.lineTo(s * 0.3, s * 0.4); g.stroke(); },
  horn: (g, s) => { g.beginPath(); g.moveTo(s * 0.2, s * 0.42); g.lineTo(s * 0.4, s * 0.42); g.lineTo(s * 0.75, s * 0.22); g.lineTo(s * 0.75, s * 0.78); g.lineTo(s * 0.4, s * 0.58); g.lineTo(s * 0.2, s * 0.58); g.closePath(); g.stroke(); },
  socket: (g, s) => { g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.28, 0, 6.3); g.stroke(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.08, 0, 6.3); g.fill(); },
  fan: (g, s) => { for (let k = 0; k < 3; k++) { const a = k * 2.09; g.beginPath(); g.ellipse(s * 0.5 + Math.cos(a) * s * 0.16, s * 0.5 + Math.sin(a) * s * 0.16, s * 0.16, s * 0.07, a, 0, 6.3); g.fill(); } },
  window: (g, s) => { g.strokeRect(s * 0.2, s * 0.25, s * 0.6, s * 0.5); g.beginPath(); g.moveTo(s * 0.5, s * 0.32); g.lineTo(s * 0.5, s * 0.68); g.moveTo(s * 0.4, s * 0.45); g.lineTo(s * 0.5, s * 0.32); g.lineTo(s * 0.6, s * 0.45); g.stroke(); },
  defrost: (g, s) => { g.strokeRect(s * 0.18, s * 0.3, s * 0.64, s * 0.4); for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(s * (0.32 + k * 0.18), s * 0.38); g.bezierCurveTo(s * (0.26 + k * 0.18), s * 0.48, s * (0.38 + k * 0.18), s * 0.52, s * (0.32 + k * 0.18), s * 0.62); g.stroke(); } },
  pump: (g, s) => { g.strokeRect(s * 0.25, s * 0.25, s * 0.32, s * 0.55); g.fillRect(s * 0.3, s * 0.3, s * 0.22, s * 0.14); g.beginPath(); g.moveTo(s * 0.57, s * 0.35); g.lineTo(s * 0.72, s * 0.42); g.lineTo(s * 0.72, s * 0.7); g.stroke(); },
  oil: (g, s) => { g.beginPath(); g.moveTo(s * 0.15, s * 0.5); g.lineTo(s * 0.3, s * 0.42); g.lineTo(s * 0.62, s * 0.42); g.lineTo(s * 0.85, s * 0.3); g.lineTo(s * 0.62, s * 0.66); g.lineTo(s * 0.3, s * 0.66); g.closePath(); g.stroke(); g.beginPath(); g.arc(s * 0.86, s * 0.48, s * 0.04, 0, 6.3); g.fill(); },
  battery: (g, s) => { g.strokeRect(s * 0.18, s * 0.32, s * 0.64, s * 0.4); g.fillRect(s * 0.28, s * 0.24, s * 0.1, s * 0.08); g.fillRect(s * 0.62, s * 0.24, s * 0.1, s * 0.08); g.fillRect(s * 0.27, s * 0.5, s * 0.12, s * 0.04); g.fillRect(s * 0.61, s * 0.5, s * 0.12, s * 0.04); g.fillRect(s * 0.65, s * 0.46, s * 0.04, s * 0.12); },
  tire: (g, s) => { g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.3, Math.PI * 0.75, Math.PI * 2.25); g.stroke(); g.fillRect(s * 0.47, s * 0.32, s * 0.06, s * 0.22); g.fillRect(s * 0.47, s * 0.6, s * 0.06, s * 0.06); },
  snow: (g, s) => { for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; g.beginPath(); g.moveTo(s * 0.5 - Math.cos(a) * s * 0.32, s * 0.5 - Math.sin(a) * s * 0.32); g.lineTo(s * 0.5 + Math.cos(a) * s * 0.32, s * 0.5 + Math.sin(a) * s * 0.32); g.stroke(); } },
  leaf: (g, s) => { g.beginPath(); g.moveTo(s * 0.25, s * 0.75); g.bezierCurveTo(s * 0.2, s * 0.3, s * 0.6, s * 0.2, s * 0.8, s * 0.22); g.bezierCurveTo(s * 0.78, s * 0.55, s * 0.55, s * 0.78, s * 0.25, s * 0.75); g.fill(); },
  cruise: (g, s) => { g.beginPath(); g.arc(s * 0.5, s * 0.58, s * 0.3, Math.PI, 0); g.stroke(); g.beginPath(); g.moveTo(s * 0.5, s * 0.58); g.lineTo(s * 0.68, s * 0.38); g.stroke(); },
  hazard: (g, s) => { g.beginPath(); g.moveTo(s * 0.5, s * 0.18); g.lineTo(s * 0.85, s * 0.78); g.lineTo(s * 0.15, s * 0.78); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(s * 0.5, s * 0.38); g.lineTo(s * 0.68, s * 0.68); g.lineTo(s * 0.32, s * 0.68); g.closePath(); g.stroke(); },
  engine: (g, s) => { g.strokeRect(s * 0.22, s * 0.35, s * 0.5, s * 0.32); g.fillRect(s * 0.34, s * 0.27, s * 0.22, s * 0.06); g.fillRect(s * 0.72, s * 0.42, s * 0.1, s * 0.16); g.fillRect(s * 0.12, s * 0.45, s * 0.1, s * 0.1); },
  temp: (g, s) => { g.fillRect(s * 0.46, s * 0.18, s * 0.08, s * 0.44); g.beginPath(); g.arc(s * 0.5, s * 0.68, s * 0.1, 0, 6.3); g.fill(); g.fillRect(s * 0.56, s * 0.28, s * 0.12, s * 0.04); g.fillRect(s * 0.56, s * 0.4, s * 0.12, s * 0.04); },
  brake: (g, s) => { g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.24, 0, 6.3); g.stroke(); g.fillRect(s * 0.47, s * 0.36, s * 0.06, s * 0.16); g.fillRect(s * 0.47, s * 0.56, s * 0.06, s * 0.06); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, 2.4, 3.9); g.stroke(); g.beginPath(); g.arc(s * 0.5, s * 0.5, s * 0.36, -0.75, 0.75); g.stroke(); },
};
const iconTex = (name: string) => mk(128, 128, (g) => { g.clearRect(0, 0, 128, 128); g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round"; ICON[name](g, 128); });

const useTex = () => useMemo(() => ({
  concrete: mk(512, 512, (g) => {
    g.fillStyle = "#8d8a84"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(${rnd(i, 1) > 0.5 ? "40,38,36" : "190,186,178"},${0.08 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 512, 2, 2); }
    for (let i = 0; i < 9; i++) { const gr = g.createRadialGradient(rnd(i, 5) * 512, rnd(i, 6) * 512, 2, rnd(i, 5) * 512, rnd(i, 6) * 512, 30 + 50 * rnd(i, 7)); gr.addColorStop(0, "rgba(28,24,20,0.45)"); gr.addColorStop(1, "rgba(28,24,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
    g.strokeStyle = "rgba(50,48,44,0.35)"; g.lineWidth = 2; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(k * 128, 0); g.lineTo(k * 128, 512); g.stroke(); }
  }, [4, 4]),
  block: mk(512, 256, (g) => {
    g.fillStyle = "#cfcbc2"; g.fillRect(0, 0, 512, 256);
    g.strokeStyle = "#b3aea3"; g.lineWidth = 4;
    for (let r = 0; r < 4; r++) { g.beginPath(); g.moveTo(0, r * 64); g.lineTo(512, r * 64); g.stroke(); for (let c = 0; c < 5; c++) { const x = c * 128 + (r % 2) * 64; g.beginPath(); g.moveTo(x, r * 64); g.lineTo(x, r * 64 + 64); g.stroke(); } }
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(90,86,80,${0.07 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 512, rnd(i, 4) * 256, 2, 2); }
  }, [4, 2]),
  peg: mk(256, 256, (g) => {
    g.fillStyle = "#b08a5c"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#4a3824"; for (let x = 8; x < 256; x += 16) for (let y = 8; y < 256; y += 16) { g.beginPath(); g.arc(x, y, 2.6, 0, 6.3); g.fill(); }
  }, [3, 2]),
  wood: mk(256, 64, (g) => {
    g.fillStyle = "#8a6440"; g.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(50,30,14,${0.15 + 0.2 * rnd(i, 1)})`; g.lineWidth = 1 + rnd(i, 2) * 2; g.beginPath(); const y = rnd(i, 3) * 64; g.moveTo(0, y); g.bezierCurveTo(80, y + 6 * (rnd(i, 4) - 0.5), 170, y - 6 * (rnd(i, 5) - 0.5), 256, y); g.stroke(); }
    for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(30,24,20,0.25)"; g.beginPath(); g.ellipse(rnd(i, 6) * 256, rnd(i, 7) * 64, 10 + 10 * rnd(i, 8), 4, 0, 0, 6.3); g.fill(); }
  }, [3, 1]),
  // la tapa de la caja vista del lado de adentro: el mapa (cada casillero = un fusible, con su dibujito y sus amperes)
  lid: mk(512, 340, (g) => {
    g.fillStyle = "#1d1f22"; g.fillRect(0, 0, 512, 340);
    const ic = ["radio", "socket", "bulb", "wiper", "horn", "window", "defrost", "fan", "radio", "bulb", "socket", "horn", "wiper", "window", "fan", "bulb", "defrost", "socket", "bulb", "horn", "fan", "window", "radio", "wiper"];
    const amp = [15, 15, 10, 20, 10, 25, 30, 20, 7.5, 10, 15, 10, 20, 25, 15, 5, 30, 15, 10, 10, 20, 25, 7.5, 20];
    g.textAlign = "center";
    for (let i = 0; i < 24; i++) {
      const c = i % 6, r = Math.floor(i / 6), x = 22 + c * 80, y = 18 + r * 80;
      g.strokeStyle = "#d8d8d8"; g.lineWidth = 2; g.strokeRect(x, y, 70, 70);
      g.save(); g.translate(x + 10, y + 6); g.strokeStyle = "#e8e8e8"; g.fillStyle = "#e8e8e8"; g.lineWidth = 3.4; g.lineCap = "round"; ICON[ic[i]](g, 46); g.restore();
      g.fillStyle = "#f2f2f2"; g.font = "bold 15px sans-serif"; g.fillText(String(amp[i]).replace(".", ","), x + 35, y + 64);
      g.fillStyle = "#9a9a9a"; g.font = "bold 11px sans-serif"; g.fillText(String(i + 1), x + 60, y + 14);
    }
  }),
  // la cara del tablero: velocímetro, cuentavueltas y el medidor de nafta con el surtidor y su flechita
  dial: mk(1024, 448, (g) => {
    g.fillStyle = "#101214"; g.fillRect(0, 0, 1024, 448);
    const ring = (cx: number, cy: number, r: number, n: number, lab: (k: number) => string) => {
      g.strokeStyle = "#3a3f44"; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, r + 10, 0, 6.3); g.stroke();
      for (let k = 0; k <= n; k++) { const a = Math.PI * 0.75 + (k / n) * Math.PI * 1.5; g.strokeStyle = "#e8eef2"; g.lineWidth = k % 2 ? 2 : 5; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.stroke();
        if (k % 2 === 0) { g.fillStyle = "#e8eef2"; g.font = "bold 22px sans-serif"; g.textAlign = "center"; g.fillText(lab(k), cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7 + 8); } }
    };
    ring(250, 224, 170, 12, (k) => String(k * 20));
    ring(774, 224, 170, 8, (k) => String(k));
    // el medidor de combustible chiquito en el medio: E · F, el surtidor y la flechita
    g.strokeStyle = "#e8eef2"; g.lineWidth = 4; g.beginPath(); g.arc(512, 300, 70, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
    g.fillStyle = "#e8eef2"; g.font = "bold 22px sans-serif"; g.textAlign = "center"; g.fillText("E", 456, 280); g.fillText("F", 568, 280);
    g.save(); g.translate(486, 300); g.strokeStyle = "#e8eef2"; g.fillStyle = "#e8eef2"; g.lineWidth = 3.5; ICON.pump(g, 40); g.restore();
    g.beginPath(); g.moveTo(534, 318); g.lineTo(548, 310); g.lineTo(534, 302); g.closePath(); g.fill();
  }),
  // el tester: la pantallita con 12,6 V
  meter: mk(256, 128, (g) => { g.fillStyle = "#9fb59a"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1a2418"; g.font = "bold 78px monospace"; g.textAlign = "right"; g.fillText("12.6", 200, 95); g.font = "bold 34px monospace"; g.fillText("V", 240, 95); }),
  meter0: mk(256, 128, (g) => { g.fillStyle = "#9fb59a"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1a2418"; g.font = "bold 78px monospace"; g.textAlign = "right"; g.fillText("0.00", 200, 95); g.font = "bold 34px monospace"; g.fillText("Ω", 240, 95); }),
  radioOn: mk(256, 64, (g) => { g.fillStyle = "#0a2a1a"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#7dffb0"; g.font = "bold 40px monospace"; g.textAlign = "center"; g.fillText("FM 98.5", 128, 46); }),
  trip: mk(256, 128, (g) => { g.fillStyle = "#0b1016"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#9fd8ff"; g.font = "bold 26px sans-serif"; g.textAlign = "center"; g.fillText("PARCIAL", 128, 44); g.font = "bold 46px monospace"; g.fillText("0.0 km", 128, 100); }),
  range: mk(256, 128, (g) => { g.fillStyle = "#0b1016"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#9fd8ff"; g.font = "bold 26px sans-serif"; g.textAlign = "center"; g.fillText("AUTONOMÍA", 128, 44); g.font = "bold 46px monospace"; g.fillText("420 km", 128, 100); }),
  cold: mk(256, 128, (g) => { g.fillStyle = "#0b1016"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#9fd8ff"; g.font = "bold 60px monospace"; g.textAlign = "center"; g.fillText("2 °C", 150, 88); g.save(); g.translate(14, 30); g.strokeStyle = "#9fd8ff"; g.lineWidth = 5; ICON.snow(g, 70); g.restore(); }),
  icons: Object.fromEntries(Object.keys(ICON).map((k) => [k, iconTex(k)])) as Record<string, THREE.Texture>,
}), []);
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas libro"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};

// ---------------- piezas ----------------
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: THREE.Texture; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; r2?: number; h: number; c: string; rough?: number; m?: number; rot?: V; seg?: number; e?: string; ei?: number; op?: number; open?: boolean }> = ({ p, r, r2, h, c, rough = 0.8, m = 0, rot, seg = 32, e, ei = 0, op, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);
const Seg: React.FC<{ a: V; b: V; r: number; c: string; r2?: number; e?: string; ei?: number; rough?: number; m?: number }> = ({ a, b, r, c, r2, e, ei = 0, rough = 0.6, m = 0 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), d = B.clone().sub(A), len = d.length();
  if (len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r2 ?? r, r, len, 10]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>;
};
// partículas que viajan de "from" a "to" (el aire, los gases, el humo, el aceite)
const Flow: React.FC<{ k: number; t: number; col: string; from: V; to: V; n?: number; spread?: number; size?: number; speed?: number; add?: boolean }> = ({ k, t, col, from, to, n = 40, spread = 0.05, size = 0.006, speed = 0.6, add }) => (
  <>{Array.from({ length: n }, (_, i) => {
    const ph = (t * speed * (0.7 + 0.6 * rnd(i, 1)) + rnd(i, 2)) % 1;
    const x = lerp(from[0], to[0], ph) + (rnd(i, 3) - 0.5) * spread * (0.5 + ph), y = lerp(from[1], to[1], ph) + (rnd(i, 4) - 0.5) * spread * (0.5 + ph), z = lerp(from[2], to[2], ph) + (rnd(i, 5) - 0.5) * spread;
    return <mesh key={i} position={[x, y, z]} visible={k > 0.01}><sphereGeometry args={[size * (0.6 + rnd(i, 6) * 0.8) * (add ? 1 + ph : 1), 6, 6]} /><meshBasicMaterial color={col} transparent opacity={k * Math.sin(Math.PI * ph) * 0.85} toneMapped={false} depthWrite={false} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} /></mesh>;
  })}</>
);
// el fusible de cuchilla: plástico de color transparente, las dos patitas de metal y el puentecito en U adentro (roto si broken)
const FCOL: Record<number, string> = { 5: "#d9b98a", 7.5: "#8a5a32", 10: "#e0312a", 15: "#2f6fe0", 20: "#f2c624", 25: "#e8e8e8", 30: "#35b04a" };
const Fuse: React.FC<{ p: V; amp: number; s?: number; broken?: number; glow?: number; rot?: V }> = ({ p, amp, s = 1, broken = 0, glow = 0, rot }) => {
  const c = FCOL[amp] ?? "#2f6fe0";
  return <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0.02, 0]} s={[0.05, 0.05, 0.016]} c={c} r={0.25} op={0.72} rad={0.004} e={c} ei={0.12 + 0.6 * glow} cast={false} />
    <Box p={[0, 0.05, 0]} s={[0.054, 0.012, 0.018]} c={c} r={0.3} rad={0.003} e={c} ei={0.1 + 0.4 * glow} />
    {[-0.015, 0.015].map((x) => <Box key={x} p={[x, -0.02, 0]} s={[0.009, 0.05, 0.004]} c="#d6d8da" m={0.9} r={0.25} rad={0.001} />)}
    {/* el puentecito: dos patas y el arco de arriba; si está quemado le falta el medio y queda el puntito negro */}
    <Box p={[-0.009, 0.022, 0]} s={[0.003, 0.03, 0.003]} c="#e8e2d0" m={0.8} r={0.3} rad={0.001} />
    <Box p={[0.009, 0.022, 0]} s={[0.003, 0.03, 0.003]} c="#e8e2d0" m={0.8} r={0.3} rad={0.001} />
    <Box p={[-0.005 - 0.002 * broken, 0.037, 0]} s={[0.009 - 0.004 * broken, 0.003, 0.003]} c="#e8e2d0" m={0.8} r={0.3} rad={0.001} />
    <Box p={[0.005 + 0.002 * broken, 0.037, 0]} s={[0.009 - 0.004 * broken, 0.003, 0.003]} c="#e8e2d0" m={0.8} r={0.3} rad={0.001} />
    <mesh position={[0, 0.037, 0.002]} visible={broken > 0.02}><sphereGeometry args={[0.004, 8, 6]} /><meshStandardMaterial color="#1a1410" emissive="#ff5a2a" emissiveIntensity={1.2 * broken * glow} /></mesh>
  </group>;
};

// ===================== LA PIEZA DE CADA VIDEO =====================
const FuseRig: React.FC<{ t: number; s: (k: string) => number; tx: ReturnType<typeof useTex> }> = ({ t, s, tx }) => {
  const AMPS = [15, 15, 10, 20, 10, 25, 30, 20, 7.5, 10, 15, 10, 20, 25, 15, 5, 30, 15, 10, 10, 20, 25, 7.5, 20];
  const out = s("fuseOut"), blown = s("blown"), lid = s("lid"), puller = s("puller"), wrong = s("wrong"), colors = s("colors"), heat = s("heat");
  const lamp = s("lamp"), meter = s("meter"), radio = s("radio"), relay = s("relay"), click = s("click"), box = s("boxHi"), newF = s("newFuse");
  const B = 0; // casillero del fusible de la radio (n.º 1, 15 A)
  const cell = (i: number): V => [-0.25 + (i % 6) * 0.1, 0.3 - Math.floor(i / 6) * 0.1, 0.02];
  const hop = out * (1 - newF);
  return <group position={PROP}>
    {/* LA CAJA DE FUSIBLES GIGANTE (parada, inclinada hacia atrás para que se vea la cara) */}
    <group position={[0, 0.02, 0]} rotation={[-0.28, 0, 0]}>
      <Box p={[0, 0.17, -0.03]} s={[0.66, 0.48, 0.06]} c="#18191b" r={0.55} rad={0.02} e="#ffd84a" ei={0.06 * box} />
      <Box p={[0, 0.17, 0.0]} s={[0.62, 0.44, 0.012]} c="#26282b" r={0.6} rad={0.006} />
      {AMPS.map((a, i) => { const q = cell(i); const me = i === B;
        const lift = me ? hop : 0;
        return <group key={i}>
          <Box p={[q[0], q[1] - 0.005, 0.012]} s={[0.07, 0.07, 0.01]} c="#121314" r={0.6} rad={0.004} />
          <group visible={!me || out < 0.98 || newF > 0.02}>
            <Fuse p={[q[0], q[1] - 0.03 + lift * 0.2, 0.026 + lift * 0.12]} amp={me && wrong > 0.5 ? 30 : a} s={1.15} glow={colors * (a === 10 || a === 15 || a === 20 ? 1 : 0.2) + (me ? 0.8 * s("hiFuse") : 0)} broken={me ? blown * (1 - newF) : 0} />
          </group>
        </group>; })}
      {/* el relé cuadrado de la bocina (se levanta y hace clic) y el del ventilador */}
      {[0, 1].map((k) => <group key={"r" + k} position={[0.42, 0.28 - k * 0.16, 0.02 + (k === 0 ? 0.06 * relay : 0)]}>
        <Box p={[0, 0, 0.03]} s={[0.1, 0.1, 0.08]} c={k ? "#3a5e9a" : "#232528"} r={0.45} rad={0.008} e="#ffd84a" ei={k === 0 ? 0.5 * relay : 0} />
        <mesh position={[0, 0, 0.072]} visible={k === 0 && click > 0.01}><ringGeometry args={[0.07 + 0.05 * ((t * 2) % 1), 0.078 + 0.05 * ((t * 2) % 1), 32]} /><meshBasicMaterial color="#ffd84a" transparent opacity={click * (1 - ((t * 2) % 1))} toneMapped={false} /></mesh>
      </group>)}
      {/* la pinza blanca de plástico enganchada en la esquina (sale a buscar el fusible) */}
      <group position={[lerp(-0.3, cell(B)[0] + 0.02, puller), lerp(-0.08, cell(B)[1] + 0.08 + hop * 0.2, puller), 0.05 + 0.1 * puller + hop * 0.12]} rotation={[0, 0, lerp(0.4, 0, puller)]}>
        <Box p={[-0.012, 0.05, 0]} s={[0.012, 0.12, 0.012]} c="#f4f2ec" r={0.5} rad={0.004} e="#ffffff" ei={0.15 * puller} />
        <Box p={[0.012, 0.05, 0]} s={[0.012, 0.12, 0.012]} c="#f4f2ec" r={0.5} rad={0.004} />
        <Box p={[0, 0.115, 0]} s={[0.036, 0.014, 0.014]} c="#f4f2ec" r={0.5} rad={0.004} />
      </group>
    </group>
    {/* LA TAPA dada vuelta: el mapa (apoyada a la izquierda) */}
    <group position={[-0.62, 0.0, 0.05]} rotation={[-0.42 + 0.1 * lid, 0.32 - 0.12 * lid, 0]}>
      <Box p={[0, 0.2, -0.012]} s={[0.5, 0.36, 0.02]} c="#202224" r={0.5} rad={0.01} />
      <mesh position={[0, 0.2, 0.0]}><planeGeometry args={[0.46, 0.305]} /><meshStandardMaterial map={tx.lid} roughness={0.6} emissive="#ffffff" emissiveMap={tx.lid} emissiveIntensity={0.05 + 0.35 * lid} /></mesh>
      <mesh position={[-0.205, 0.33, 0.002]} visible={s("lidHi") > 0.01}><ringGeometry args={[0.03, 0.037, 32]} /><meshBasicMaterial color="#ffd84a" transparent opacity={s("lidHi")} toneMapped={false} /></mesh>
    </group>
    {/* LA RADIO del auto en el banco, cableada a la caja (se apaga / se prende) */}
    <group position={[0.62, 0.04, 0.1]} rotation={[0, -0.35, 0]}>
      <Box p={[0, 0.05, 0]} s={[0.3, 0.1, 0.16]} c="#1b1c1e" r={0.4} m={0.2} rad={0.012} />
      <mesh position={[0, 0.06, 0.081]}><planeGeometry args={[0.16, 0.04]} /><meshStandardMaterial map={tx.radioOn} color={mix("#0a0c0b", "#ffffff", radio)} emissive="#7dffb0" emissiveMap={tx.radioOn} emissiveIntensity={1.1 * radio} toneMapped={false} /></mesh>
      {[-0.11, 0.11].map((x) => <Cyl key={x} p={[x, 0.05, 0.085]} r={0.018} h={0.014} c="#3a3c40" m={0.5} rough={0.35} rot={[Math.PI / 2, 0, 0]} />)}
    </group>
    {/* el cable de la radio que va por adentro del tablero (se calienta con el fusible gordo) */}
    {[[0.3, 0.16, 0.02], [0.42, 0.06, 0.12], [0.5, 0.05, 0.12]].map((q, i, arr) => i ? <Seg key={i} a={arr[i - 1] as V} b={q as V} r={0.008 + 0.004 * heat} c={mix("#c22a22", "#ff7a2a", heat)} e="#ff5a1a" ei={1.6 * heat} /> : null)}
    <Flow k={heat} t={t} col="#7a7470" from={[0.44, 0.08, 0.12]} to={[0.4, 0.5, 0.05]} n={26} spread={0.08} size={0.012} speed={0.4} />
    {/* LA LÁMPARA DE PRUEBA: mango transparente, la lamparita, la punta y el cable con la pinza cocodrilo a masa */}
    <group position={[lerp(0.2, cell(B)[0] + 0.0, lamp), lerp(-0.04, 0.22, lamp), lerp(0.28, 0.12, lamp)]} rotation={[lerp(Math.PI / 2, 0.9, lamp), 0, lerp(-0.4, 0.2, lamp)]}>
      <Cyl p={[0, 0.06, 0]} r={0.018} h={0.12} c="#e8f2ff" rough={0.1} op={0.45} />
      <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.011, 12, 10]} /><meshStandardMaterial color="#fff2c0" emissive="#ffd84a" emissiveIntensity={2.4 * s("lampOn")} toneMapped={false} /></mesh>
      <Seg a={[0, -0.0, 0]} b={[0, -0.09, 0]} r={0.004} c="#c8ccd0" m={0.9} rough={0.25} />
      <Seg a={[0, 0.12, 0]} b={[0.15, 0.06, -0.08]} r={0.004} c="#2a2a2a" />
    </group>
    <pointLight position={[cell(B)[0], 0.3, 0.2]} intensity={0.9 * s("lampOn")} distance={0.6} color="#ffd27a" />
    {/* EL TESTER amarillo con sus dos puntas */}
    <group position={[0.95, 0.0, 0.05]} rotation={[-0.5, -0.5, 0]}>
      <Box p={[0, 0.12, 0]} s={[0.16, 0.26, 0.05]} c="#e8b820" r={0.6} rad={0.02} e="#ffd84a" ei={0.1 * meter} />
      <mesh position={[0, 0.18, 0.026]}><planeGeometry args={[0.12, 0.06]} /><meshStandardMaterial map={s("ohm") > 0.5 ? tx.meter0 : tx.meter} emissive="#ffffff" emissiveMap={s("ohm") > 0.5 ? tx.meter0 : tx.meter} emissiveIntensity={0.15 + 0.5 * meter} /></mesh>
      <Cyl p={[0, 0.07, 0.03]} r={0.035} h={0.012} c="#222" rough={0.4} rot={[Math.PI / 2, 0, 0]} />
      <Seg a={[-0.04, 0.0, 0.02]} b={[-0.2, -0.04, 0.12]} r={0.004} c="#d22a22" />
      <Seg a={[0.04, 0.0, 0.02]} b={[0.12, -0.05, 0.16]} r={0.004} c="#1a1a1a" />
      <mesh position={[0, 0.3, 0.03]} visible={meter > 0.01}><ringGeometry args={[0.05 + 0.06 * ((t * 1.5) % 1), 0.058 + 0.06 * ((t * 1.5) % 1), 32]} /><meshBasicMaterial color="#ffd84a" transparent opacity={meter * (1 - ((t * 1.5) % 1))} toneMapped={false} /></mesh>
    </group>
    {/* el paquete surtido de fusibles y la bolsita de la guantera */}
    <group position={[-0.18, 0.0, 0.32]} rotation={[0, 0.2, 0]}>
      <Box p={[0, 0.015, 0]} s={[0.24, 0.03, 0.14]} c="#d8e6f0" r={0.2} op={0.55} rad={0.008} />
      {[5, 7.5, 10, 15, 20, 25, 30].map((a, i) => <Fuse key={i} p={[-0.09 + i * 0.03, 0.02, 0]} amp={a} s={0.5} rot={[-Math.PI / 2, 0, 0]} glow={0.3 * s("pack")} />)}
    </group>
  </group>;
};

const DashRig: React.FC<{ t: number; s: (k: string) => number; tx: ReturnType<typeof useTex> }> = ({ t, s, tx }) => {
  const ign = s("ign"), sweep = s("sweep"), arrow = s("arrow"), dim = s("dim"), comp = s("comp"), trip = s("trip"), cold = s("cold");
  const blink = (Math.sin(t * Math.PI * 3) > 0 ? 1 : 0.15);
  // los testigos: [ícono, color, estado que lo prende]
  const LAMPS: [string, string, string][] = [["oil", "#ff3b30", "oil"], ["battery", "#ff3b30", "batt"], ["brake", "#ff3b30", "brakeL"], ["temp", "#ff3b30", "tempL"], ["engine", "#ffb020", "check"], ["tire", "#ffb020", "tpms"], ["snow", "#ffb020", "ice"], ["leaf", "#3ddc6a", "eco"], ["cruise", "#3ddc6a", "cruise"], ["hazard", "#ff3b30", "hazard"]];
  const allOn = s("allOn");
  const needle = (k: number) => Math.PI * 0.75 + k * Math.PI * 1.5;
  const spd = sweep > 0.02 ? Math.sin(Math.PI * cl(sweep)) : 0;
  const disp = cold > 0.5 ? tx.cold : trip > 0.5 ? tx.trip : tx.range;
  const bright = 0.35 + 0.65 * (1 - 0.6 * dim + 0.6 * dim * (0.5 + 0.5 * Math.sin(t * 1.4)));
  return <group position={PROP}>
    <group position={[0, 0.06, 0]} rotation={[-0.22, 0, 0]}>
      {/* la visera y el cuerpo del tablero */}
      <Box p={[0, 0.24, -0.05]} s={[1.0, 0.46, 0.12]} c="#1c1d1f" r={0.7} rad={0.04} />
      <Box p={[0, 0.48, 0.0]} s={[1.02, 0.05, 0.2]} c="#232427" r={0.75} rad={0.02} />
      <mesh position={[0, 0.24, 0.012]}><planeGeometry args={[0.92, 0.4]} /><meshStandardMaterial map={tx.dial} emissive="#ffffff" emissiveMap={tx.dial} emissiveIntensity={(0.08 + 0.55 * ign) * bright} roughness={0.5} /></mesh>
      {/* agujas: velocímetro, cuentavueltas, combustible */}
      {[[-0.225, 0.24, 0.155, spd * 0.6], [0.245, 0.24, 0.155, spd * 0.9 + 0.1 * ign * (1 - spd)]].map(([x, y, r, k], i) => (
        <group key={i} position={[x, y, 0.02]} rotation={[0, 0, -needle(k) + Math.PI / 2 - Math.PI / 2]}>
          <mesh position={[r * 0.4, 0, 0]} rotation={[0, 0, 0]}><boxGeometry args={[r * 0.85, 0.008, 0.004]} /><meshStandardMaterial color="#ff4a2a" emissive="#ff4a2a" emissiveIntensity={0.4 + 0.8 * ign} toneMapped={false} /></mesh>
        </group>))}
      <group position={[0, 0.22 - 0.135, 0.02]} rotation={[0, 0, Math.PI - (0.15 + 0.55 * ign) * Math.PI * 0.7 - Math.PI * 0.15]}>
        <mesh position={[0.03, 0, 0]}><boxGeometry args={[0.06, 0.006, 0.004]} /><meshStandardMaterial color="#ff4a2a" emissive="#ff4a2a" emissiveIntensity={0.4 + 0.8 * ign} toneMapped={false} /></mesh>
      </group>
      {/* el anillo que marca la flechita del surtidor */}
      <mesh position={[0.045, 0.098, 0.022]} visible={arrow > 0.01}><ringGeometry args={[0.03, 0.037, 32]} /><meshBasicMaterial color="#ff3b30" transparent opacity={arrow} toneMapped={false} /></mesh>
      {/* la fila de testigos abajo */}
      {LAMPS.map(([ic, col, key], i) => { const on = cl(Math.max(allOn, s(key)) * (key === "hazard" ? blink : 1)); return (
        <mesh key={i} position={[-0.36 + i * 0.08, 0.075, 0.021]}><planeGeometry args={[0.05, 0.05]} /><meshStandardMaterial map={tx.icons[ic]} alphaMap={tx.icons[ic]} transparent color={mix("#2a2c2e", col, on)} emissive={col} emissiveIntensity={1.6 * on} toneMapped={false} /></mesh>); })}
      {/* la pantallita de la computadora de a bordo */}
      <mesh position={[0, 0.3, 0.02]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={disp} emissive="#ffffff" emissiveMap={disp} emissiveIntensity={(0.1 + 0.9 * Math.max(comp, trip, cold)) * ign} toneMapped={false} /></mesh>
      {/* el botoncito del parcial y la ruedita de la luz */}
      <Cyl p={[0.42, 0.06, 0.03]} r={0.012} h={0.04 - 0.015 * s("tripPush")} c="#3a3c40" rough={0.4} rot={[Math.PI / 2, 0, 0]} e="#9fd8ff" ei={0.8 * trip} />
      <Cyl p={[-0.47, 0.12, 0.02]} r={0.02} h={0.012} c="#2c2e31" rough={0.4} rot={[0, 0, t * 0.8 * dim]} e="#9fd8ff" ei={0.8 * dim} />
    </group>
    {/* el volante delante, con los botones del limitador */}
    <group position={[0, 0.2, 0.32]} rotation={[-0.5, 0, 0]}>
      <mesh><torusGeometry args={[0.19, 0.018, 12, 48]} /><meshStandardMaterial color="#232426" roughness={0.6} /></mesh>
      {[0, 2.1, 4.2].map((a) => <Seg key={a} a={[0, 0, 0]} b={[Math.cos(a + 1.57) * 0.18, Math.sin(a + 1.57) * 0.18, 0]} r={0.012} c="#2a2b2d" />)}
      <Cyl p={[0, 0, 0.01]} r={0.06} h={0.04} c="#26272a" rough={0.5} rot={[Math.PI / 2, 0, 0]} />
      <Box p={[-0.11, 0.0, 0.02]} s={[0.045, 0.03, 0.012]} c="#3a3c40" rad={0.004} e="#3ddc6a" ei={0.9 * s("cruise")} />
    </group>
    {/* la consola con el botón de balizas y el modo eco */}
    <group position={[0.62, 0.0, 0.12]} rotation={[0, -0.4, 0]}>
      <Box p={[0, 0.08, 0]} s={[0.22, 0.16, 0.1]} c="#1e1f21" r={0.6} rad={0.012} />
      <Box p={[-0.04, 0.11, 0.052]} s={[0.05, 0.04, 0.012]} c="#c22a22" rad={0.004} e="#ff3b30" ei={1.2 * s("hazard") * blink} />
      <Box p={[0.05, 0.11, 0.052]} s={[0.05, 0.04, 0.012]} c="#2c2e31" rad={0.004} e="#3ddc6a" ei={1.2 * s("eco")} />
      <mesh position={[0.05, 0.11, 0.06]}><planeGeometry args={[0.03, 0.03]} /><meshBasicMaterial map={tx.icons.leaf} alphaMap={tx.icons.leaf} transparent color="#e8f2e8" toneMapped={false} /></mesh>
      <mesh position={[-0.04, 0.11, 0.06]}><planeGeometry args={[0.03, 0.03]} /><meshBasicMaterial map={tx.icons.hazard} alphaMap={tx.icons.hazard} transparent color="#ffffff" toneMapped={false} /></mesh>
    </group>
    {/* el calibrador de presión apoyado (lápiz) */}
    <group position={[-0.55, 0.012, 0.25]} rotation={[0, 0.6, Math.PI / 2]} visible={s("gauge") > 0.01}>
      <Cyl p={[0, 0, 0]} r={0.012} h={0.16} c="#c8ccd0" m={0.85} rough={0.25} e="#9fd8ff" ei={0.4 * s("gauge")} />
      <Cyl p={[0, 0.1, 0]} r={0.008} h={0.05} c="#f2f2f2" rough={0.4} />
    </group>
    <pointLight position={[0, 0.4, 0.5]} intensity={0.5 * ign} distance={1.2} color="#9fd8ff" />
  </group>;
};

const TurboRig: React.FC<{ t: number; s: (k: string) => number }> = ({ t, s }) => {
  const spin = s("spin"), hot = s("hot"), oil = s("oil"), sludge = s("sludge"), air = s("air"), gas = s("gas"), smoke = s("smoke"), whistle = s("whistle"), filter = s("filter"), lug = s("lug"), cool = s("cool");
  const glow = hot * (1 - 0.7 * cool);
  const shake = 0.004 * lug * Math.sin(t * 40);
  const ang = t * (1.2 + 0.6 * spin);
  return <group position={[PROP[0], PROP[1] + 0.02 + shake, PROP[2]]}>
    {/* el soporte */}
    <Box p={[0, 0.02, 0]} s={[0.5, 0.04, 0.26]} c="#3a3c40" m={0.6} r={0.4} rad={0.01} />
    <Box p={[0, 0.1, 0]} s={[0.06, 0.14, 0.06]} c="#3a3c40" m={0.6} r={0.4} rad={0.01} />
    <group position={[0, 0.27, 0]}>
      {/* el caracol del AIRE frío (izquierda, aluminio) con la boca que mira a cámara */}
      <group position={[-0.17, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><torusGeometry args={[0.1, 0.045, 18, 48, Math.PI * 1.75]} /><meshStandardMaterial color="#b8bcc0" metalness={0.85} roughness={0.32} emissive="#9fd8ff" emissiveIntensity={0.25 * air} /></mesh>
        <Cyl p={[0, 0, 0.0]} r={0.075} h={0.09} c="#aeb2b6" m={0.85} rough={0.3} rot={[Math.PI / 2, 0, 0]} />
      </group>
      {/* la boca de entrada con la turbina de aspas a la vista */}
      <group position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cyl p={[0, 0, 0]} r={0.062} h={0.06} c="#9da2a6" m={0.85} rough={0.3} open />
        <group rotation={[0, ang, 0]}>{Array.from({ length: 9 }, (_, i) => <mesh key={i} rotation={[0, (i / 9) * Math.PI * 2, 0.5]} position={[0, 0.005, 0]}><boxGeometry args={[0.05, 0.004, 0.022]} /><meshStandardMaterial color="#d8dcdf" metalness={0.9} roughness={0.2} /></mesh>)}</group>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} visible={spin > 0.02}><circleGeometry args={[0.058, 32]} /><meshBasicMaterial color="#e8eef2" transparent opacity={0.35 * spin} depthWrite={false} /></mesh>
      </group>
      {/* el cuerpo central con el eje y el caño del aceite que baja de arriba */}
      <Cyl p={[0, 0, 0]} r={0.055} h={0.12} c="#5a5e62" m={0.7} rough={0.4} rot={[0, 0, Math.PI / 2]} e="#ffb020" ei={0.25 * oil} />
      <Seg a={[0, 0.05, 0]} b={[0, 0.2, -0.02]} r={0.01} c="#8a6a3a" m={0.6} rough={0.35} e="#ffb020" ei={0.5 * oil} />
      <Flow k={oil * (1 - sludge)} t={t} col="#ffb84a" from={[0, 0.2, -0.02]} to={[0, 0.0, 0]} n={18} spread={0.008} size={0.005} speed={1.0} add />
      <Flow k={sludge} t={t * 0.3} col="#2a1e12" from={[0, 0.2, -0.02]} to={[0, 0.03, 0]} n={10} spread={0.006} size={0.008} speed={0.4} />
      {/* el caracol de los GASES (derecha, hierro) que se pone al rojo */}
      <group position={[0.17, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh><torusGeometry args={[0.095, 0.045, 18, 48, Math.PI * 1.75]} /><meshStandardMaterial color={mix("#4a4440", "#8a3a1a", glow)} metalness={0.5} roughness={0.55} emissive="#ff4a10" emissiveIntensity={2.2 * glow} /></mesh>
        <Cyl p={[0, 0, 0]} r={0.07} h={0.09} c={mix("#4a4440", "#8a3a1a", glow)} m={0.5} rough={0.55} rot={[Math.PI / 2, 0, 0]} e="#ff4a10" ei={1.6 * glow} />
      </group>
      <Cyl p={[0.25, -0.03, 0]} r={0.045} h={0.08} c="#4a4440" m={0.5} rough={0.6} rot={[0, 0, Math.PI / 2]} e="#ff4a10" ei={1.2 * glow} />
      <pointLight position={[0.2, 0.05, 0.15]} intensity={1.6 * glow} distance={0.8} color="#ff6a2a" />
      {/* el aire frío que entra (celeste) y los gases que salen (naranja) */}
      <Flow k={air} t={t} col="#9fd8ff" from={[-0.55, 0.0, 0.05]} to={[-0.26, 0, 0]} n={30} spread={0.08} size={0.007} speed={0.9} />
      <Flow k={gas} t={t} col="#ff8a3d" from={[0.28, -0.03, 0]} to={[0.6, 0.02, 0.05]} n={30} spread={0.08} size={0.008} speed={0.9} add />
      <Flow k={smoke} t={t * 0.5} col="#8aa0c8" from={[0.3, -0.03, 0]} to={[0.75, 0.25, 0.1]} n={40} spread={0.2} size={0.022} speed={0.4} />
      {/* el silbido: anillos que salen de la boca */}
      {[0, 1, 2].map((k) => { const ph = (t * 1.2 + k / 3) % 1; return <mesh key={k} position={[-0.3 - ph * 0.15, 0, 0]} rotation={[0, Math.PI / 2, 0]} visible={whistle > 0.01}><ringGeometry args={[0.07 + ph * 0.1, 0.076 + ph * 0.1, 40]} /><meshBasicMaterial color="#ffd84a" transparent opacity={whistle * (1 - ph)} toneMapped={false} side={THREE.DoubleSide} /></mesh>; })}
    </group>
    {/* el filtro de aire sucio apoyado al lado */}
    <group position={[-0.5, 0.03, 0.15]} rotation={[0, 0.4, 0]} visible={filter > 0.01}>
      <Box p={[0, 0, 0]} s={[0.26, 0.04, 0.18]} c={mix("#f2ead2", "#6a6050", 0.75)} r={1} rad={0.008} e="#ff4a3d" ei={0.25 * filter} />
      {Array.from({ length: 10 }, (_, i) => <Box key={i} p={[-0.11 + i * 0.025, 0.022, 0]} s={[0.01, 0.01, 0.17]} c="#5a5244" r={1} rad={0.003} />)}
    </group>
    {/* la varilla del aceite */}
    <group position={[0.42, 0.04, 0.16]} rotation={[0, -0.5, Math.PI / 2 - 0.1]} visible={s("dip") > 0.01}>
      <Cyl p={[0, 0, 0]} r={0.004} h={0.4} c="#c8ccd0" m={0.85} rough={0.25} />
      <Cyl p={[0, -0.15, 0]} r={0.0045} h={0.06} c={sludge > 0.5 ? "#2a1e12" : "#d8a03a"} rough={0.2} e="#ffb020" ei={0.4 * s("dip")} />
      <Cyl p={[0, 0.21, 0]} r={0.016} h={0.025} c="#ffb020" rough={0.4} />
    </group>
  </group>;
};

// ===================== EL GARAJE =====================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTex();
  const pg = useImgTex(["m1_p001", PAGE]);
  const S = ST(t); const s = (k: string) => S(k);
  const hood = 1 - 0.85 * s("hoodClosed");
  const doorK = 0.85 + 0.15 * (1 - s("night"));
  const night = s("night");
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35} threshold={0.95} exposure={1.05} env={0.45} />
      <color attach="background" args={[mix("#cfd8de", "#1a2230", night)]} />
      <fog attach="fog" args={[mix("#cfd3d6", "#1a2230", night), 12, 34]} />
      <hemisphereLight args={["#eef2f6", "#5a5048", 0.8 - 0.35 * night]} />
      {/* el tubo del techo (siempre) y la luz del portón (baja de noche) */}
      <pointLight position={[0.6, 2.75, -0.4]} intensity={2.4} distance={8} color="#f2f6ff" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0006} />
      <pointLight position={[-1.3, 2.6, 0.9]} intensity={1.3} distance={6} color="#f2f6ff" />
      <directionalLight position={[-6, 3.2, 1.5]} intensity={(1.8 * doorK) * (1 - 0.8 * night)} color={mix("#fff4e2", "#9fb4d8", night)} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={4} shadow-camera-bottom={-2} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[1.6, 1.6, 0.2]} intensity={0.8} distance={3} color="#fff4e4" />
      <pointLight position={[BOOK[0], 1.3, BOOK[2] + 0.4]} intensity={0.7 * s("book")} distance={2.2} color="#fff4e6" />

      {/* piso de cemento con manchas de aceite, paredes de bloque, el techo y el tubo */}
      <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 9]} /><meshStandardMaterial map={tx.concrete} roughness={0.92} /></mesh>
      <Box p={[0.4, 1.5, -3.3]} s={[9, 3, 0.2]} c="#d3cfc6" map={tx.block} r={0.95} rad={0.01} />
      <Box p={[4.4, 1.5, -0.6]} s={[0.2, 3, 5.6]} c="#d3cfc6" map={tx.block} r={0.95} rad={0.01} />
      <Box p={[-3.8, 2.6, -0.6]} s={[0.2, 0.8, 5.6]} c="#d3cfc6" map={tx.block} r={0.95} rad={0.01} />
      <Box p={[0.4, 3.02, -0.6]} s={[9, 0.06, 5.6]} c="#e2e0da" r={0.95} rad={0.01} cast={false} />
      <Box p={[0.6, 2.88, -0.4]} s={[1.3, 0.05, 0.1]} c="#f8fbff" e="#f2f6ff" ei={1.6} rad={0.02} cast={false} />
      <Box p={[-1.3, 2.88, 0.9]} s={[1.3, 0.05, 0.1]} c="#f8fbff" e="#f2f6ff" ei={1.6} rad={0.02} cast={false} />
      {/* el portón enrollado arriba y la calle con luz (o la noche con el farol de la casa) */}
      <Box p={[-3.8, 2.15, -0.6]} s={[0.3, 0.2, 5.4]} c="#7a7e82" m={0.5} r={0.45} rad={0.05} />
      <mesh position={[-3.95, 1.05, -0.6]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[5.4, 2.1]} /><meshBasicMaterial color={mix("#f6f1e6", "#18243a", night)} toneMapped={false} /></mesh>
      <mesh position={[-3.93, 1.9, 0.6]} visible={night > 0.01}><sphereGeometry args={[0.06, 12, 10]} /><meshBasicMaterial color="#ffd27a" transparent opacity={night} toneMapped={false} /></mesh>
      <pointLight position={[-3.6, 1.9, 0.6]} intensity={1.4 * night} distance={4} color="#ffc070" />

      {/* ===== EL AUTO PLATEADO con el capó abierto ===== */}
      <group position={CAR}>
        <Box p={[0, 0.55, 0]} s={[1.7, 0.55, 4.0]} c="#b8bcc0" m={0.55} r={0.32} rad={0.16} />
        <Box p={[0, 1.02, -0.45]} s={[1.5, 0.48, 1.9]} c="#b8bcc0" m={0.55} r={0.32} rad={0.18} />
        {/* vidrios */}
        <mesh position={[0, 1.03, 0.52]} rotation={[-0.75, 0, 0]}><planeGeometry args={[1.36, 0.62]} /><meshStandardMaterial color="#2a3640" roughness={0.08} metalness={0.4} /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.751, 1.05, -0.45]} rotation={[0, sd * Math.PI / 2, 0]}><planeGeometry args={[1.7, 0.36]} /><meshStandardMaterial color="#2a3640" roughness={0.08} metalness={0.4} /></mesh>)}
        {/* ruedas */}
        {[[-0.86, 1.25], [0.86, 1.25], [-0.86, -1.3], [0.86, -1.3]].map(([x, z], i) => <group key={i} position={[x, 0.32, z]}>
          <Cyl p={[0, 0, 0]} r={0.32} h={0.22} c="#1a1a1a" rough={0.85} rot={[0, 0, Math.PI / 2]} />
          <Cyl p={[x > 0 ? 0.112 : -0.112, 0, 0]} r={0.2} h={0.01} c="#c8ccd0" m={0.85} rough={0.3} rot={[0, 0, Math.PI / 2]} />
        </group>)}
        {/* trompa: parrilla y faros */}
        <Box p={[0, 0.55, 2.0]} s={[1.2, 0.18, 0.04]} c="#1d1e20" r={0.5} rad={0.02} />
        {[-0.62, 0.62].map((x) => <Box key={x} p={[x, 0.62, 1.98]} s={[0.36, 0.14, 0.06]} c="#e8eef2" r={0.1} rad={0.03} e="#ffffff" ei={0.2} />)}
        {/* el VANO del motor (se ve con el capó abierto) */}
        <Box p={[0, 0.8, 1.45]} s={[1.5, 0.04, 1.05]} c="#1a1b1d" r={0.8} rad={0.01} cast={false} />
      </group>
      {/* el motor, la batería, la caja de fusibles del motor, el turbo y la varilla */}
      <Box p={[BAY[0], BAY[1] + 0.12, BAY[2] - 0.05]} s={[0.7, 0.26, 0.5]} c="#3a3c40" m={0.55} r={0.45} rad={0.04} />
      <Box p={[BAY[0], BAY[1] + 0.27, BAY[2] - 0.05]} s={[0.55, 0.06, 0.2]} c="#2a2b2e" m={0.4} r={0.5} rad={0.02} />
      <Cyl p={[BAY[0] + 0.12, BAY[1] + 0.33, BAY[2] - 0.08]} r={0.035} h={0.03} c="#ffb020" rough={0.4} e="#ffb020" ei={0.6 * s("cap")} />
      <Cyl p={[BAY[0] - 0.18, BAY[1] + 0.32, BAY[2] + 0.12]} r={0.012} h={0.05} c="#ffd84a" rough={0.4} e="#ffd84a" ei={0.6 * s("dipCar")} />
      <Box p={[-0.8, 0.95, 0.85]} s={[0.24, 0.2, 0.17]} c="#1d1e20" r={0.5} rad={0.015} />
      <Box p={[-0.86, 1.06, 0.85]} s={[0.04, 0.02, 0.04]} c="#d22a22" r={0.4} rad={0.005} />
      <Box p={[-0.74, 1.06, 0.85]} s={[0.04, 0.02, 0.04]} c="#222" r={0.4} rad={0.005} />
      <group position={EFUSE}>
        <Box p={[0, 0.06, 0]} s={[0.2, 0.12, 0.28]} c="#141516" r={0.55} rad={0.015} e="#ffd84a" ei={0.3 * s("efuse")} />
        <Box p={[0, 0.13 + 0.25 * s("efuseOpen"), 0.04 * s("efuseOpen")]} rot={[0.9 * s("efuseOpen"), 0, 0]} s={[0.2, 0.025, 0.28]} c="#1a1b1d" r={0.5} rad={0.01} />
        {s("efuseOpen") > 0.01 && [0, 1, 2, 3, 4, 5].map((i) => <Box key={i} p={[-0.05 + (i % 2) * 0.1, 0.125, -0.08 + Math.floor(i / 2) * 0.08]} s={[0.06, 0.02, 0.05]} c={["#f2c624", "#35b04a", "#e0312a", "#2f6fe0", "#e8e8e8", "#3a5e9a"][i]} r={0.4} rad={0.005} />)}
      </group>
      <group position={TURBO_CAR}>
        <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.07, 0.035, 14, 36, Math.PI * 1.75]} /><meshStandardMaterial color="#b8bcc0" metalness={0.85} roughness={0.32} emissive="#ffd84a" emissiveIntensity={0.4 * s("turboCar")} /></mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><torusGeometry args={[0.065, 0.034, 14, 36, Math.PI * 1.75]} /><meshStandardMaterial color={mix("#4a4440", "#8a3a1a", s("hotCar"))} metalness={0.5} roughness={0.55} emissive="#ff4a10" emissiveIntensity={1.6 * s("hotCar")} /></mesh>
        <Seg a={[-0.06, 0.03, 0]} b={[-0.06, 0.25, -0.3]} r={0.03} c="#1d1e20" rough={0.5} />
      </group>
      {/* el capó abierto (bisagra atrás del vano) */}
      <group position={[CAR[0], 0.84, CAR[2] + 0.9]} rotation={[-1.15 * hood, 0, 0]}>
        <Box p={[0, 0, 0.55]} s={[1.6, 0.04, 1.1]} c="#b8bcc0" m={0.55} r={0.32} rad={0.03} />
      </group>
      <Seg a={[CAR[0] + 0.7, 0.84, CAR[2] + 2.0]} b={[CAR[0] + 0.7, 0.84 + 1.0 * hood, CAR[2] + 1.35]} r={0.006} c="#c8ccd0" m={0.8} />
      {/* el trapo rojo sobre el guardabarros */}
      <Box p={[CAR[0] + 0.86, 0.84, CAR[2] + 1.6]} s={[0.12, 0.03, 0.22]} c="#c62828" r={1} rad={0.015} rot={[0, 0.3, 0.15]} />

      {/* ===== EL BANCO DE TRABAJO y el panel de herramientas ===== */}
      <Box p={[BENCH[0], BENCH[1] - 0.03, BENCH[2]]} s={[2.4, 0.06, 0.85]} c="#8a6440" map={tx.wood} r={0.7} rad={0.01} />
      {[[-1.1, -0.36], [1.1, -0.36], [-1.1, 0.36], [1.1, 0.36]].map(([x, z], i) => <Box key={i} p={[BENCH[0] + x, 0.43, BENCH[2] + z]} s={[0.07, 0.86, 0.07]} c="#5a4430" r={0.7} rad={0.008} />)}
      <Box p={[BENCH[0], 0.2, BENCH[2]]} s={[2.25, 0.03, 0.75]} c="#6a5038" r={0.8} rad={0.008} />
      <Box p={[BENCH[0], 1.65, -1.45]} s={[2.4, 1.3, 0.03]} c="#b08a5c" map={tx.peg} r={0.85} rad={0.006} />
      {/* llaves colgadas en el panel */}
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[BENCH[0] - 1.0 + i * 0.12, 1.95 - (i % 3) * 0.02, -1.42]}>
        <Box p={[0, -0.12, 0]} s={[0.022, 0.26 - (i % 4) * 0.03, 0.008]} c="#c8ccd0" m={0.9} r={0.25} rad={0.004} />
        <mesh position={[0, 0.02, 0]}><torusGeometry args={[0.022, 0.007, 8, 20]} /><meshStandardMaterial color="#c8ccd0" metalness={0.9} roughness={0.25} /></mesh>
      </group>)}
      {Array.from({ length: 6 }, (_, i) => <group key={"d" + i} position={[BENCH[0] + 0.25 + i * 0.1, 1.45, -1.42]}>
        <Cyl p={[0, 0.05, 0]} r={0.016} h={0.1} c={["#d22a22", "#f2c624", "#d22a22", "#2f6fe0", "#d22a22", "#f2c624"][i]} rough={0.4} />
        <Cyl p={[0, -0.07, 0]} r={0.004} h={0.14} c="#c8ccd0" m={0.9} rough={0.25} />
      </group>)}
      {/* el reloj del taller */}
      <group position={CLOCK}>
        <Cyl p={[0, 0, 0]} r={0.16} h={0.03} c="#f4f2ec" rough={0.5} rot={[Math.PI / 2, 0, 0]} e="#fff6dc" ei={0.2 * s("clock")} />
        <mesh position={[0, 0, 0.017]}><torusGeometry args={[0.16, 0.012, 8, 40]} /><meshStandardMaterial color="#2a2b2e" /></mesh>
        <Box p={[0, 0.04, 0.02]} s={[0.012, 0.09, 0.004]} c="#1a1a1a" rot={[0, 0, -t * 0.02]} rad={0.002} />
        <Box p={[0, 0.06, 0.022]} s={[0.006, 0.12, 0.004]} c="#d22a22" rot={[0, 0, -t * 0.4]} rad={0.002} />
      </group>
      {/* el carro rojo de herramientas y el estante con los aceites */}
      <group position={[3.55, 0, -1.2]}>
        <Box p={[0, 0.55, 0]} s={[0.7, 1.1, 0.5]} c="#b8231c" m={0.4} r={0.35} rad={0.03} />
        {Array.from({ length: 6 }, (_, i) => <Box key={i} p={[0, 0.2 + i * 0.15, 0.255]} s={[0.6, 0.012, 0.01]} c="#d8dcdf" m={0.85} r={0.25} rad={0.003} />)}
      </group>
      <group position={[-0.2, 0, -3.1]}>
        {[0.6, 1.2, 1.8].map((y) => <Box key={y} p={[0, y, 0]} s={[2.2, 0.04, 0.4]} c="#6a5038" r={0.8} rad={0.008} />)}
        {Array.from({ length: 14 }, (_, i) => { const y = [0.6, 1.2, 1.8][i % 3] + 0.13, x = -0.95 + (i * 0.14) % 1.9; return <Box key={i} p={[x, y, 0]} s={[0.1, 0.22, 0.08]} c={["#2f6fe0", "#f2c624", "#1d1e20", "#d22a22", "#35b04a"][i % 5]} r={0.45} rad={0.015} />; })}
      </group>

      {/* ===== LA PIEZA DEL VIDEO ===== */}
      {MODE === "fuse" && <FuseRig t={t} s={s} tx={tx} />}
      {MODE === "dash" && <DashRig t={t} s={s} tx={tx} />}
      {MODE === "turbo" && <TurboRig t={t} s={s} />}

      {/* el banquito con el MANUAL DEL MECÁNICO: se abre en la página del video */}
      <Cyl p={[BOOK[0], 0.24, BOOK[2]]} r={0.26} h={0.04} c="#8a6440" rough={0.7} />
      {[0, 1, 2].map((k) => { const a = k * 2.09; return <Seg key={k} a={[BOOK[0] + Math.cos(a) * 0.18, 0.22, BOOK[2] + Math.sin(a) * 0.18]} b={[BOOK[0] + Math.cos(a) * 0.24, 0, BOOK[2] + Math.sin(a) * 0.24]} r={0.018} c="#5a4430" />; })}
      {s("book") > 0.01 && pg.m1_p001 && <Book p={[BOOK[0] - 0.12, 0.27 + (1 - ease(s("book"))) * 0.5, BOOK[2]]} rotY={0.1} open={s("open")} cover={pg.m1_p001} inside={pg[PAGE + "_r"]} right={pg[PAGE]} spine="#c62828" />}
    </ThreeCanvas>
  );
};
