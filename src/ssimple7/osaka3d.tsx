// ssimple7 · EL MUNDO: la casa de la madre en Osaka, en corte (sin la pared del frente). Seis tatamis, shoji al fondo,
// tokonoma con el pergamino (ensō) y un ikebana, la mesita del TELÉFONO negro de disco con su zabuton (donde todo empezó en 1976),
// el escritorio bajo de caligrafía, la chabudai con el juego de té (las tazas buenas: blancas con raya azul), la tansu con la foto,
// la lámpara de papel, el engawa abierto a un jardincito del tamaño de una sábana (farol de piedra, arce rojo, cerco de bambú).
// Sobre los shoji, un riel con los 9 EMA (las 9 frases). Noche → día (de la llamada a la mañana de los 101).
// UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../cme3d01/fx3d";
import { Book } from "../cme3d01/barrio3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- puntos del mundo (portales y rótulos HTML) ----------------
export const PHONE: V = [-2.12, 0.33, -1.3];
export const DESK: V = [-0.62, 0.3, -1.62];
export const TABLE: V = [0.35, 0.33, 0.05];
export const EMA_X = (i: number) => -2.25 + i * 0.37;   // i = 0..8
export const PT = {
  phone: [-2.12, 0.42, -1.3] as V,
  receiver: [-2.12, 0.5, -1.27] as V,
  paper: [-0.62, 0.31, -1.58] as V,
  photo: [-2.55, 1.06, 0.55] as V,
  pot: [0.2, 0.45, -0.05] as V,
  cups: [0.5, 0.4, 0.15] as V,
  ema: (i: number) => [EMA_X(i), 1.72, -2.08] as V,
  scroll: [1.85, 1.35, -2.5] as V,
  lantern: [4.3, 0.75, -1.1] as V,
  maple: [5.0, 1.6, 0.2] as V,
  shoji: [-0.8, 1.0, -2.18] as V,
  book: [0.33, 0.36, 0.08] as V,
};

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  p.x += Math.sin(t * 0.53) * 0.008; p.y += Math.sin(t * 0.71 + 1) * 0.006; // respiración de cámara en mano
  return { p, l, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
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

// ---------------- texturas propias (deterministas) ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
// pincelada con ancho variable (para el ensō y los trazos de tinta)
const brushArc = (g: CanvasRenderingContext2D, cx: number, cy: number, r: number, a0: number, a1: number, w: number, seed: number) => {
  const N = 220;
  for (let i = 0; i < N; i++) {
    const k = i / N, a = a0 + (a1 - a0) * k;
    const ww = w * (0.35 + 0.9 * Math.sin(Math.PI * Math.min(1, k * 1.15))) * (0.85 + 0.3 * rnd(i, seed));
    const rr = r + Math.sin(k * 9 + seed) * r * 0.012;
    g.fillStyle = `rgba(22,18,14,${0.75 + 0.25 * rnd(i, seed + 1)})`;
    g.beginPath(); g.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, ww * 0.5, ww * 0.32, a, 0, 6.3); g.fill();
    if (k > 0.85) for (let j = 0; j < 3; j++) { g.fillStyle = "rgba(22,18,14,.35)"; g.fillRect(cx + Math.cos(a) * (rr + (rnd(i, j) - 0.5) * ww), cy + Math.sin(a) * (rr + (rnd(i, j + 4) - 0.5) * ww), 2, 2); }
  }
};
const useOsakaTex = () => useMemo(() => ({
  // tatami: paja tejida en líneas finas + el borde (heri) de tela oscura
  tatami: mk(256, 512, (g) => {
    g.fillStyle = "#c9b77e"; g.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 3) { g.fillStyle = `rgba(${120 + rnd(y, 1) * 40},${110 + rnd(y, 2) * 30},50,${0.18 + rnd(y, 3) * 0.15})`; g.fillRect(0, y, 256, 1.4); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(90,80,40,${0.08 * rnd(i, 4)})`; g.fillRect(rnd(i, 5) * 256, rnd(i, 6) * 512, 1, 6 + rnd(i, 7) * 20); }
    g.fillStyle = "#2c2a26"; g.fillRect(0, 0, 14, 512); g.fillRect(242, 0, 14, 512);
    g.fillStyle = "rgba(200,190,150,.25)"; for (let y = 0; y < 512; y += 18) { g.fillRect(4, y, 6, 2); g.fillRect(246, y, 6, 2); }
  }),
  // papel de shoji con su retícula de madera
  shoji: mk(256, 512, (g) => {
    g.fillStyle = "#f2ece0"; g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 200; i++) { g.fillStyle = `rgba(190,175,150,${0.08 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 512, 1 + rnd(i, 4) * 3, 1 + rnd(i, 5) * 3); }
    g.fillStyle = "#6e4f33"; for (let x = 0; x <= 256; x += 64) g.fillRect(Math.min(250, x - 3), 0, 6, 512); for (let y = 0; y <= 512; y += 85) g.fillRect(0, Math.min(506, y - 3), 256, 6);
    g.fillRect(0, 0, 256, 10); g.fillRect(0, 502, 256, 10); g.fillRect(0, 0, 10, 512); g.fillRect(246, 0, 10, 512);
  }),
  // fusuma (puerta corrediza pintada: montañas y nubes en tinta muy suave)
  fusuma: mk(512, 512, (g) => {
    g.fillStyle = "#e8dcc2"; g.fillRect(0, 0, 512, 512);
    g.fillStyle = "rgba(70,80,90,.10)"; g.beginPath(); g.moveTo(0, 360); g.quadraticCurveTo(120, 200, 220, 330); g.quadraticCurveTo(320, 250, 512, 340); g.lineTo(512, 512); g.lineTo(0, 512); g.fill();
    g.fillStyle = "rgba(70,80,90,.07)"; g.beginPath(); g.moveTo(0, 410); g.quadraticCurveTo(200, 300, 360, 400); g.quadraticCurveTo(440, 360, 512, 400); g.lineTo(512, 512); g.lineTo(0, 512); g.fill();
    g.fillStyle = "rgba(217,164,65,.16)"; g.beginPath(); g.ellipse(390, 140, 60, 18, 0, 0, 6.3); g.fill(); g.beginPath(); g.ellipse(120, 110, 80, 14, 0, 0, 6.3); g.fill();
    g.fillStyle = "#3a2a1f"; g.beginPath(); g.arc(470, 260, 6, 0, 6.3); g.fill();
  }),
  // pared de arcilla (tsuchikabe)
  clay: mk(256, 256, (g) => {
    g.fillStyle = "#cdb898"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) { const v = 150 + rnd(i, 1) * 70; g.fillStyle = `rgba(${v},${v - 20},${v - 50},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }, [3, 2]),
  // madera clara (hinoki)
  wood: mk(256, 256, (g) => {
    g.fillStyle = "#b08657"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(90,55,25,${0.1 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(80, y + 4 * rnd(k, 3), 170, y - 4, 256, y + 2); g.stroke(); }
  }, [2, 1]),
  // el pergamino del tokonoma: ensō (el círculo zen) en tinta
  scroll: mk(256, 640, (g) => {
    g.fillStyle = "#4a5a52"; g.fillRect(0, 0, 256, 640);
    g.fillStyle = "#efe6d2"; g.fillRect(22, 70, 212, 470);
    brushArc(g, 128, 290, 74, -1.2, 4.6, 20, 3);
    g.fillStyle = "#b8321e"; g.fillRect(170, 470, 22, 22);
  }),
  // mantel de la mesita / la hoja de washi del escritorio
  washi: mk(256, 256, (g) => {
    g.fillStyle = "#f4ecdb"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(170,150,120,${0.15 * rnd(i, 1)})`; g.lineWidth = 0.6; g.beginPath(); const x = rnd(i, 2) * 256, y = rnd(i, 3) * 256; g.moveTo(x, y); g.lineTo(x + (rnd(i, 4) - 0.5) * 30, y + (rnd(i, 5) - 0.5) * 30); g.stroke(); }
  }),
  // EMA: tablilla de madera con número en tinta y cordón rojo
  ema: Array.from({ length: 9 }, (_, i) => mk(256, 200, (g) => {
    g.fillStyle = "#d6b98a"; g.beginPath(); g.moveTo(0, 60); g.lineTo(128, 0); g.lineTo(256, 60); g.lineTo(256, 200); g.lineTo(0, 200); g.closePath(); g.fill();
    for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(120,80,40,${0.12 + rnd(k + i * 20, 1) * 0.1})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, 70 + k * 9); g.lineTo(256, 66 + k * 9 + rnd(k, 2) * 4); g.stroke(); }
    g.fillStyle = "#7a1d12"; g.fillRect(0, 56, 256, 8);
    g.fillStyle = "#1b1712"; g.font = "700 112px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.fillText(String(i + 1), 128, 176);
  })),
  ema9b: mk(256, 200, (g) => {
    g.fillStyle = "#e8d2a6"; g.beginPath(); g.moveTo(0, 60); g.lineTo(128, 0); g.lineTo(256, 60); g.lineTo(256, 200); g.lineTo(0, 200); g.closePath(); g.fill();
    g.fillStyle = "#c8321e"; g.font = "700 52px Georgia, serif"; g.textAlign = "center"; g.fillText("2 WORDS", 128, 140);
  }),
  // dorso de los ema: la frase NUEVA que dijo en su lugar (bermellón)
  emaB: ["NOT|TONIGHT", "FORGET BY|THURSDAY", "ONE CLEAN|CORNER", "FACE, HAIR,|EYES", "SAY IT|ONCE", "ONE SMALL|KINDNESS", "ONE DRAWER|A MONTH", "A SMALL|NET", "NOW YOU|CAN GO"].map((txt, i) => mk(256, 200, (g) => {
    g.fillStyle = "#e8d2a6"; g.beginPath(); g.moveTo(0, 60); g.lineTo(128, 0); g.lineTo(256, 60); g.lineTo(256, 200); g.lineTo(0, 200); g.closePath(); g.fill();
    for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(120,80,40,${0.1 + rnd(k + i * 20, 3) * 0.08})`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, 70 + k * 9); g.lineTo(256, 66 + k * 9); g.stroke(); }
    g.fillStyle = "#7a1d12"; g.fillRect(0, 56, 256, 8);
    g.fillStyle = "#1b1712"; g.font = "700 30px Georgia, serif"; g.textAlign = "center"; g.fillText(String(i + 1), 128, 46);
    const [l1, l2] = txt.split("|"); g.fillStyle = "#c8321e"; g.font = "700 30px Georgia, serif"; g.fillText(l1, 128, 118); g.fillText(l2, 128, 160);
  })),
  clockFace: mk(256, 256, (g) => {
    g.fillStyle = "#f4ecdb"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
    g.fillStyle = "#1b1712"; g.font = "700 34px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let h = 1; h <= 12; h++) { const a = (h / 12) * Math.PI * 2 - Math.PI / 2; g.fillText(String(h), 128 + Math.cos(a) * 96, 130 + Math.sin(a) * 96); }
    for (let m = 0; m < 60; m++) { const a = (m / 60) * Math.PI * 2; g.fillRect(128 + Math.cos(a) * 116 - 1.5, 128 + Math.sin(a) * 116 - 1.5, 3, 3); }
  }),
  wrapP: mk(128, 128, (g) => {
    g.fillStyle = "#e9e1cf"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(150,130,100,${0.3 * rnd(i, 1)})`; g.lineWidth = 1; g.beginPath(); const x = rnd(i, 2) * 128, y = rnd(i, 3) * 128; g.moveTo(x, y); g.lineTo(x + (rnd(i, 4) - 0.5) * 50, y + (rnd(i, 5) - 0.5) * 50); g.stroke(); }
    g.fillStyle = "rgba(43,63,99,.5)"; g.font = "700 22px Georgia, serif"; g.fillText("新聞", 30, 70);
  }),
  // tela del zabuton (índigo con ruedas de olas seigaiha)
  zabu: mk(256, 256, (g) => {
    g.fillStyle = "#2b3f63"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(230,220,200,.35)"; g.lineWidth = 2;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) { const x = c * 32 + (r % 2) * 16, y = r * 30; for (let k = 3; k > 0; k--) { g.beginPath(); g.arc(x, y, k * 5, Math.PI, 0); g.stroke(); } }
  }, [2, 2]),
  zabuR: mk(256, 256, (g) => {
    g.fillStyle = "#8a2a1e"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "rgba(240,210,160,.35)"; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) { g.beginPath(); g.arc(c * 32 + 16, r * 32 + 16, 4, 0, 6.3); g.fill(); }
  }, [2, 2]),
  // la taza buena: blanca con una raya azul
  cup: mk(256, 64, (g) => { g.fillStyle = "#f6f3ec"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#2b4f9a"; g.fillRect(0, 14, 256, 6); }),
  // calendario de pared (3 semanas)
  futon: mk(256, 256, (g) => {
    g.fillStyle = "#e9e2d2"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(43,63,99,.55)"; g.lineWidth = 3;
    for (let y = 16; y < 256; y += 32) for (let x = 16; x < 256; x += 32) { g.beginPath(); g.arc(x + ((y / 32) % 2) * 16, y, 9, 0, 6.3); g.stroke(); }
  }, [2, 3]),
  quilt: mk(256, 256, (g) => {
    g.fillStyle = "#2b3f63"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "rgba(230,215,180,.5)"; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2) g.fillRect(c * 32 + 8, r * 32 + 8, 16, 16);
    g.strokeStyle = "rgba(200,50,30,.5)"; g.lineWidth = 2; for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
  }, [2, 2]),
  radioF: mk(256, 160, (g) => {
    g.fillStyle = "#5a3a22"; g.fillRect(0, 0, 256, 160);
    g.fillStyle = "#b8a27a"; g.fillRect(14, 14, 150, 132);
    for (let x = 18; x < 164; x += 6) { g.fillStyle = "rgba(90,70,40,.35)"; g.fillRect(x, 14, 2, 132); }
    g.fillStyle = "#e9dcb8"; g.fillRect(176, 22, 66, 40); g.fillStyle = "#1b1712"; g.font = "700 11px Georgia"; g.fillText("540  800  1200", 180, 46);
    g.fillStyle = "#2a1a10"; g.beginPath(); g.arc(194, 110, 15, 0, 6.3); g.fill(); g.beginPath(); g.arc(226, 110, 15, 0, 6.3); g.fill();
  }),
  envT: mk(256, 160, (g) => {
    g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 256, 160);
    g.strokeStyle = "rgba(150,130,100,.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(128, 80); g.lineTo(256, 0); g.stroke();
    g.fillStyle = "#1b1712"; g.font = "italic 700 22px Georgia"; g.textAlign = "center"; g.fillText("for my children,", 128, 112); g.fillText("open after", 128, 138);
  }),
  card3: mk(256, 180, (g) => {
    g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 256, 180);
    g.fillStyle = "#c8321e"; g.fillRect(0, 0, 256, 10);
    g.fillStyle = "#1b1712"; g.font = "italic 700 26px Georgia"; ["1. buy fish", "2. write to Sachiko", "3. fix the button"].forEach((l, i) => g.fillText(l, 16, 56 + i * 44));
  }),
  nbPage: mk(256, 320, (g) => {
    g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 256, 320);
    g.strokeStyle = "rgba(43,63,99,.25)"; g.lineWidth = 1; for (let y = 40; y < 320; y += 28) { g.beginPath(); g.moveTo(10, y); g.lineTo(246, y); g.stroke(); }
    g.strokeStyle = "rgba(200,50,30,.45)"; g.beginPath(); g.moveTo(150, 10); g.lineTo(150, 310); g.stroke();
    g.fillStyle = "#1b1712"; g.font = "italic 18px Georgia";
    ["the roof", "letter to Fumi", "the rent", "my son's job", "the cold"].forEach((l, i) => g.fillText(l, 14, 62 + i * 56));
    g.fillStyle = "#c8321e"; ["call landlord", "buy a stamp", "not tonight", "ask on Sunday", "not tonight"].forEach((l, i) => g.fillText(l, 156, 62 + i * 56));
  }),
  glow: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 24, r2, op, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={op !== undefined} opacity={op ?? 1} map={map} /></mesh>
);

// el teléfono negro de disco (modelo 600 de los 60-70): cuerpo con frente inclinado, disco blanco con 10 agujeros, tubo en la horquilla.
// Tiembla cuando suena; el tubo se levanta.
const Phone: React.FC<{ t: number; ring: number; lift: number }> = ({ t, ring, lift }) => {
  const sh = ring * (Math.sin(t * Math.PI * 1.25) > 0 ? 1 : 0);
  const jit = sh * 0.004 * Math.sin(t * 95);
  const bk = "#0d0d0e";
  return <group position={PHONE} rotation={[0, 0.5 + jit * 3, 0]}>
    <group position={[jit, Math.abs(jit) * 0.5, 0]}>
      {/* cuerpo: base + caparazón con el frente inclinado */}
      <Box p={[0, 0.03, 0]} s={[0.22, 0.06, 0.25]} c={bk} r={0.18} m={0.05} rad={0.014} />
      <Box p={[0, 0.075, -0.035]} s={[0.19, 0.06, 0.16]} c={bk} r={0.18} m={0.05} rad={0.02} />
      <Box p={[0, 0.07, 0.06]} s={[0.19, 0.035, 0.1]} c={bk} r={0.18} m={0.05} rad={0.014} rot={[0.5, 0, 0]} />
      {/* disco (mira hacia adelante y arriba) */}
      <group position={[0, 0.088, 0.075]} rotation={[-1.07, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.052, 0.052, 0.008, 40]} /><meshStandardMaterial color="#d9d4c6" roughness={0.35} /></mesh>
        {Array.from({ length: 10 }, (_, i) => { const a = 2.2 - i * 0.48; return <mesh key={i} position={[Math.cos(a) * 0.037, Math.sin(a) * 0.037, 0.0045]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0075, 0.0075, 0.002, 14]} /><meshBasicMaterial color="#1a1918" /></mesh>; })}
        <mesh position={[0, 0, 0.0048]}><circleGeometry args={[0.017, 24]} /><meshStandardMaterial color="#f2eee4" roughness={0.5} /></mesh>
        <Box p={[0.038, -0.028, 0.006]} s={[0.016, 0.006, 0.004]} c="#b8b2a4" m={0.7} r={0.3} rad={0.002} rot={[0, 0, 0.7]} />
      </group>
      {/* horquillas */}
      <Box p={[-0.072, 0.115, -0.04]} s={[0.022, 0.022, 0.05]} c={bk} r={0.2} rad={0.008} />
      <Box p={[0.072, 0.115, -0.04]} s={[0.022, 0.022, 0.05]} c={bk} r={0.2} rad={0.008} />
      {/* el tubo */}
      <group position={[0, 0.142 + 0.34 * ease(lift), -0.04 + 0.12 * ease(lift)]} rotation={[0.6 * ease(lift), 0.2 * ease(lift), 0.35 * ease(lift)]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.014, 0.17, 6, 14]} /><meshStandardMaterial color={bk} roughness={0.15} /></mesh>
        {[-0.098, 0.098].map((x) => <mesh key={x} position={[x, -0.016, 0]} castShadow><cylinderGeometry args={[0.03, 0.022, 0.034, 24]} /><meshStandardMaterial color={bk} roughness={0.15} /></mesh>)}
      </group>
      {/* cable rizado hacia el tubo */}
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-0.12 - i * 0.004, 0.02, 0.06 - i * 0.012]} rotation={[0, 0.3, Math.PI / 2]}><torusGeometry args={[0.007, 0.0022, 4, 10]} /><meshStandardMaterial color={bk} /></mesh>)}
    </group>
  </group>;
};

// taza buena (blanca con raya azul) y la tetera
const Cup: React.FC<{ p: V; tex: THREE.Texture; s?: number; steam?: number; t?: number; glow?: THREE.Texture; gold?: number; crack?: number }> = ({ p, tex, s = 1, steam = 0, t = 0, glow, gold = 0, crack = 0 }) => (
  <group position={p} scale={s}>
    {crack > 0.01 && [[0.0, 0.052, 0.3], [0.004, 0.036, -0.5], [0.0, 0.02, 0.4], [0.003, 0.006, -0.3]].map(([dx, y, r], i) => <mesh key={i} position={[dx, y, 0.0335 - y * 0.12]} rotation={[0, 0, r]}><boxGeometry args={[0.0028, 0.019, 0.002]} /><meshStandardMaterial color={gold > 0.01 ? "#e2b04a" : "#3a3a3a"} metalness={gold} roughness={0.25} emissive="#b8862a" emissiveIntensity={gold * 0.35} /></mesh>)}
    <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.035, 0.026, 0.06, 24, 1, true]} /><meshStandardMaterial map={tex} color="#ffffff" roughness={0.18} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.024, 0.024, 0.004, 20]} /><meshStandardMaterial color="#e9e4da" /></mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.031, 24]} /><meshStandardMaterial color="#8a9a3a" roughness={0.1} /></mesh>
    {steam > 0.01 && glow && Array.from({ length: 5 }, (_, i) => { const ph = (t * 0.35 + i / 5) % 1; return <sprite visible={false} key={i} position={[Math.sin(ph * 6 + i) * 0.015, 0.07 + ph * 0.18, 0]} scale={[0.05 + ph * 0.06, 0.05 + ph * 0.06, 1]}><spriteMaterial map={glow} color="#ffffff" transparent opacity={steam * 0.22 * Math.sin(Math.PI * ph)} depthWrite={false} /></sprite>; })}
  </group>
);
const Teapot: React.FC<{ p: V }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.06, 0]} scale={[1, 0.82, 1]} castShadow><sphereGeometry args={[0.075, 28, 20]} /><meshStandardMaterial color="#2e3a2c" roughness={0.35} metalness={0.1} /></mesh>
    <Cyl p={[0, 0.125, 0]} r={0.03} h={0.02} c="#2e3a2c" rough={0.35} />
    <mesh position={[0, 0.142, 0]}><sphereGeometry args={[0.012, 12, 10]} /><meshStandardMaterial color="#2e3a2c" /></mesh>
    <mesh position={[0.085, 0.07, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.008, 0.016, 0.07, 10]} /><meshStandardMaterial color="#2e3a2c" roughness={0.35} /></mesh>
    {/* asa de bambú */}
    <mesh position={[0, 0.13, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.065, 0.006, 6, 24, Math.PI]} /><meshStandardMaterial color="#a77f3c" roughness={0.6} /></mesh>
  </group>
);
const Zabuton: React.FC<{ p: V; tex: THREE.Texture; rot?: number; k?: number }> = ({ p, tex, rot = 0, k = 1 }) => k <= 0.01 ? null : (
  <group position={[p[0], p[1] + (1 - ease(k)) * 0.5, p[2]]} rotation={[0, rot, 0]} scale={[ease(k), 1, ease(k)]}>
    <Box p={[0, 0.035, 0]} s={[0.5, 0.07, 0.55]} c="#ffffff" map={tex} r={0.95} rad={0.03} />
  </group>
);

// arce japonés: copa de esferas rojas (low-poly suave) que se mece
const Maple: React.FC<{ p: V; t: number }> = ({ p, t }) => (
  <group position={p}>
    <Cyl p={[0, 0.6, 0]} r={0.05} r2={0.08} h={1.2} c="#4a3426" rough={0.9} rot={[0, 0, 0.1]} />
    <Cyl p={[0.18, 1.1, 0]} r={0.025} r2={0.04} h={0.6} c="#4a3426" rough={0.9} rot={[0, 0, -0.7]} />
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 1.3 + Math.sin(t * 0.8 + i) * 0.01, 1.35 + rnd(i, 2) * 0.7, (rnd(i, 3) - 0.5) * 1.0]} castShadow>
      <icosahedronGeometry args={[0.22 + rnd(i, 4) * 0.16, 1]} /><meshStandardMaterial color={["#b8442a", "#c9562f", "#9e3020", "#d46a2f"][i % 4]} roughness={0.85} flatShading /></mesh>)}
  </group>
);
// farol de piedra (tōrō)
const Lantern: React.FC<{ p: V; on: number }> = ({ p, on }) => (
  <group position={p}>
    <Cyl p={[0, 0.06, 0]} r={0.16} h={0.12} c="#8d8a80" rough={0.95} seg={8} />
    <Cyl p={[0, 0.32, 0]} r={0.06} h={0.42} c="#8d8a80" rough={0.95} seg={8} />
    <Box p={[0, 0.58, 0]} s={[0.3, 0.08, 0.3]} c="#85827a" r={0.95} rad={0.02} />
    <Box p={[0, 0.72, 0]} s={[0.22, 0.2, 0.22]} c="#8d8a80" r={0.95} rad={0.02} />
    <mesh position={[0, 0.72, 0.112]}><planeGeometry args={[0.1, 0.1]} /><meshBasicMaterial color={new THREE.Color("#2a241c").lerp(new THREE.Color("#ffcf7a"), on)} toneMapped={false} /></mesh>
    <mesh position={[0, 0.88, 0]}><coneGeometry args={[0.26, 0.14, 6]} /><meshStandardMaterial color="#7c7a72" roughness={0.95} flatShading /></mesh>
    <mesh position={[0, 0.98, 0]}><sphereGeometry args={[0.04, 10, 8]} /><meshStandardMaterial color="#7c7a72" /></mesh>
    {on > 0.02 && <pointLight position={[0, 0.72, 0.3]} intensity={on * 1.2} distance={2} color="#ffbe6a" />}
  </group>
);

// ---------------- NUEVOS de ssimple7 ----------------
// el FUTÓN junto al tansu: colchón, edredón índigo (de noche abierto, de día doblado), almohada de trigo sarraceno,
// la caja laqueada roja con el cuaderno y el lápiz, y la lámpara andon de papel
export const FUTON: V = [-1.75, 0.1, 0.85];
export const LBOX: V = [-1.12, 0.1, 0.12];
const Futon: React.FC<{ t: number; tt: Record<string, any>; nb: number; pencil: number; andon: number; blanket: number }> = ({ t, tt, nb, pencil, andon, blanket }) => {
  const k = ease(blanket);
  return <group>
    <Box p={[FUTON[0], 0.13, FUTON[2]]} s={[0.92, 0.09, 1.9]} c="#ffffff" map={tt.futon} r={0.95} rad={0.04} />
    {/* edredón: de noche cubre 2/3; de día doblado a los pies */}
    <Box p={[FUTON[0], 0.2 + (1 - k) * 0.06, FUTON[2] + 0.25 + (1 - k) * 0.5]} s={[0.96, 0.07 + (1 - k) * 0.09, 1.3 - (1 - k) * 0.85]} c="#ffffff" map={tt.quilt} r={0.95} rad={0.05} />
    <Box p={[FUTON[0], 0.21, FUTON[2] - 0.75]} s={[0.42, 0.09, 0.22]} c="#d8cdb4" r={0.95} rad={0.04} />
    {/* la caja laqueada (roja por fuera, negra por dentro) */}
    <group position={LBOX}>
      <Box p={[0, 0.04, 0]} s={[0.26, 0.08, 0.2]} c="#a3201a" r={0.18} m={0.1} rad={0.012} />
      <Box p={[0, 0.082, 0]} s={[0.23, 0.004, 0.17]} c="#14100c" r={0.2} rad={0.002} />
      {/* la tapa, apoyada al costado */}
      <Box p={[0.2, 0.012, 0.02]} s={[0.26, 0.024, 0.2]} c="#a3201a" r={0.18} m={0.1} rad={0.01} rot={[0, 0.3, 0]} />
      {/* el cuaderno: cerrado sobre la caja; abierto = dos hojas */}
      <group position={[0, 0.092, 0]}>
        <Box p={[0, 0, 0]} s={[0.12, 0.012, 0.16]} c="#c9b98e" r={0.9} rad={0.003} />
        {nb > 0.01 && <mesh position={[-0.06 * nb - 0.0, 0.007 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.12 * Math.max(0.05, nb), 0.16]} /><meshStandardMaterial map={tt.nbPage} roughness={0.95} /></mesh>}
        {nb > 0.01 && <mesh position={[0.0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.16]} /><meshStandardMaterial map={tt.nbPage} roughness={0.95} /></mesh>}
        <Cyl p={[0.01, 0.016 + 0.01 * (1 - pencil), 0.0 + 0.09 * (1 - pencil)]} r={0.004} h={0.13} c="#d9a441" rot={[Math.PI / 2, 0, 0.5]} />
      </group>
    </group>
    {/* andon (lámpara de papel de piso) */}
    <group position={[-1.05, 0.08, -0.35]}>
      {[[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]].map(([x, z], i) => <Box key={i} p={[x, 0.3, z]} s={[0.02, 0.6, 0.02]} c="#3b2618" rad={0.004} />)}
      <Box p={[0, 0.35, 0]} s={[0.19, 0.42, 0.19]} c="#fff1d6" e="#ffc06a" ei={0.15 + andon * 1.6} r={0.9} rad={0.004} />
      {andon > 0.02 && <pointLight position={[0, 0.45, 0]} intensity={andon * 2.2} distance={3} decay={1.6} color="#ffb867" />}
    </group>
  </group>;
};
// la RADIO marrón con frente de tela (arriba del tansu): el dial brilla cuando está prendida; rota = un chispazo y nada
const Radio: React.FC<{ t: number; on: number; broken: number; tex: THREE.Texture }> = ({ t, on, broken, tex }) => (
  <group position={[-2.47, 0.96, 0.92]} rotation={[0, Math.PI / 2, 0]}>
    <Box p={[0, 0.12, 0]} s={[0.4, 0.24, 0.18]} c="#5a3a22" r={0.4} rad={0.03} />
    <mesh position={[0, 0.12, 0.092]}><planeGeometry args={[0.38, 0.22]} /><meshStandardMaterial map={tex} roughness={0.7} emissive="#ffb050" emissiveIntensity={on * 0.25 * (0.9 + 0.1 * Math.sin(t * 9))} /></mesh>
    {broken > 0.02 && <mesh position={[0.1, 0.17, 0.095]}><planeGeometry args={[0.07, 0.04]} /><meshBasicMaterial color="#222" transparent opacity={0.8 * broken} /></mesh>}
    {on > 0.02 && <pointLight position={[0, 0.15, 0.3]} intensity={on * 0.5} distance={1.2} color="#ffbe6a" />}
  </group>
);
// el ESPEJO redondo del pasillo (en la pared de fusuma): el marco de madera y el reflejo pálido
const Mirror: React.FC<{ k: number }> = ({ k }) => (
  <group position={[-2.72, 1.32, 1.45]} rotation={[0, Math.PI / 2, 0]}>
    <Cyl p={[0, 0, -0.01]} r={0.24} h={0.03} c="#4a3220" rough={0.5} rot={[Math.PI / 2, 0, 0]} seg={40} />
    <mesh position={[0, 0, 0.008]}><circleGeometry args={[0.215, 48]} /><meshStandardMaterial color="#cfd8de" roughness={0.04} metalness={0.95} emissive="#e9f0f4" emissiveIntensity={0.08 + 0.18 * k} /></mesh>
  </group>
);
// el TAZÓN de fideos del viernes (en la chabudai)
const Bowl: React.FC<{ p: V; k: number; t: number; glow: THREE.Texture }> = ({ p, k, t, glow }) => k <= 0.01 ? null : (
  <group position={p} scale={0.6 + 0.4 * ease(k)}>
    <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.1, 0.055, 0.09, 32, 1, true]} /><meshStandardMaterial color="#7a1d12" roughness={0.3} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.092, 32]} /><meshStandardMaterial color="#d9b77a" roughness={0.5} /></mesh>
    {[0, 1].map((i) => <Cyl key={i} p={[0.03 * i - 0.01, 0.1, 0.0]} r={0.003} h={0.24} c="#a77f3c" rot={[0.2, 0, 1.3]} />)}
    {Array.from({ length: 5 }, (_, i) => { const ph = (t * 0.35 + i / 5) % 1; return <sprite visible={false} key={i} position={[Math.sin(ph * 6 + i) * 0.03, 0.1 + ph * 0.22, 0]} scale={[0.07 + ph * 0.08, 0.07 + ph * 0.08, 1]}><spriteMaterial map={glow} color="#ffffff" transparent opacity={ease(k) * 0.24 * Math.sin(Math.PI * ph)} depthWrite={false} /></sprite>; })}
  </group>
);

// ---------------- LA GUÍA: páginas REALES del PDF (el render espera a que carguen) ----------------
const useImgTex = (ids: string[]) => {
  const [, bump] = useState(0);
  return useMemo(() => {
    const L = new THREE.TextureLoader(); const r: Record<string, THREE.Texture> = {};
    const h = delayRender("paginas guia"); let n = ids.length;
    for (const id of ids) {
      const flip = new THREE.Texture(); flip.center.set(0.5, 0.5); flip.rotation = Math.PI; flip.colorSpace = THREE.SRGBColorSpace; flip.anisotropy = 16;
      const tx = L.load(staticFile(P + id + ".jpg"), (x) => { flip.image = x.image; flip.needsUpdate = true; if (--n === 0) { bump((k) => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); } }, undefined, () => { if (--n === 0) continueRender(h); });
      tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; r[id] = tx; r[id + "_r"] = flip;
    }
    return r;
  }, [ids.join("|")]);
};
// los 5 libritos de The Osaka Way; el 4º es The 101 Day
export const COVERS = ["cov_warm_c", "cov_walk_c", "cov_money_c", "cov_day_c", "cov_plates_c"];
const SPINE = ["#c8321e", "#3b7a57", "#d9a441", "#2b3f63", "#8a5a9e"];
export const HERO = 3;
const PW = 0.29, PD = 0.438;
const uv = (u: number, v: number): V => [-PW / 2 + u * PW, 0.0009, -PD / 2 + v * PD];
// subrayado de pincel bermellón sobre la página (u 0-1 a lo ancho, v 0-1 de arriba abajo)
const PageHi: React.FC<{ k: number; u0: number; u1: number; v: number; h: number; col?: string; op?: number }> = ({ k, u0, u1, v, h, col = "#c8321e", op = 0.38 }) => {
  if (k <= 0.01) return null;
  const w = (u1 - u0) * PW * k, c = uv(u0, v);
  return <mesh position={[c[0] + w / 2, c[1], c[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[w, h * PD]} /><meshBasicMaterial color={col} transparent opacity={op} depthWrite={false} toneMapped={false} /></mesh>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tt = useOsakaTex();
  const pg = useImgTex([...COVERS, "day_p37", "day_p38", "kak_p71", "kak_p72", "img_mother1976"]);
  const s = ST(t);
  const day = s.day;                         // 0 noche (la llamada) → 1 mañana
  const sky = new THREE.Color("#0b1222").lerp(new THREE.Color("#cfd9df"), day).lerp(new THREE.Color("#e3965a"), s.dusk * 0.7);
  const shojiCol = new THREE.Color("#3d5aa0").lerp(new THREE.Color("#f2e2c4"), day);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.6} threshold={0.86} exposure={lerp(0.95, 0.88, day) * (1 - 0.3 * s.shade)} env={lerp(0.06, 0.3, day)} />
      <color attach="background" args={[sky.getStyle()]} />
      <fogExp2 attach="fog" args={[sky.getStyle(), 0.035]} />
      <hemisphereLight args={[new THREE.Color("#5a6f9e").lerp(new THREE.Color("#fff3e0"), day), new THREE.Color("#2a2018").lerp(new THREE.Color("#8a7458"), day), lerp(0.16, 0.75, day)]} />
      {/* sol de la mañana / luna: entra por el jardín (derecha) */}
      <directionalLight position={[9, lerp(10, 7, day) - 4 * s.dusk, 4]} intensity={lerp(0.25, 1.9, day) * (1 - 0.35 * s.dusk)} color={new THREE.Color("#9fb4ff").lerp(new THREE.Color("#ffe2b8"), day).lerp(new THREE.Color("#ff9a4a"), s.dusk).getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* la lámpara de papel (cálida) y el rincón del teléfono */}
      <pointLight position={[0.35, 1.62, 0.05]} intensity={s.lamp * 4.5} distance={6} decay={1.6} color="#ffbe78" castShadow />
      <pointLight position={[-1.75, 0.95, -0.85]} intensity={0.4 + s.phoneLight * 1.6} distance={2.2} color="#ffc98a" />
      <pointLight position={[0, 1.8, 2.6]} intensity={lerp(0.35, 0.5, day)} distance={9} color={new THREE.Color("#8ea6e0").lerp(new THREE.Color("#fff0dc"), day).getStyle()} />

      {/* suelo afuera (jardín: grava + musgo) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color={new THREE.Color("#3a3a36").lerp(new THREE.Color("#a8a49a"), day)} roughness={1} /></mesh>

      {/* ===== LA CASA (frente abierto en z=+1.9) ===== */}
      {/* tarima de madera bajo los tatamis */}
      <Box p={[0, 0.03, -0.15]} s={[5.6, 0.06, 4.2]} c="#6b4a2e" map={tt.wood} r={0.7} rad={0.01} />
      {/* los TATAMIS (filas desfasadas, el patrón real de colocación) + franja de madera al frente */}
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => {
        const x0 = Math.max(-2.7, -2.7 - (r % 2 ? 0.9 : 0) + c * 1.8), x1 = Math.min(2.7, -2.7 - (r % 2 ? 0.9 : 0) + (c + 1) * 1.8);
        if (x1 - x0 < 0.2) return null;
        return <Box key={r + "-" + c} p={[(x0 + x1) / 2, 0.08, -1.7 + r * 0.9]} s={[0.9, 0.05, x1 - x0 - 0.004]} c="#d9cfa6" map={tt.tatami} r={0.9} rad={0.008} rot={[0, Math.PI / 2, 0]} />;
      }))}
      {/* pared del fondo: SHOJI (de -2.7 a 1.1) que brillan con la luz de afuera */}
      {[-2.25, -1.3, -0.35, 0.6].map((x, i) => <group key={i} position={[x, 1.03, -2.2]}>
        <mesh><planeGeometry args={[0.94, 1.9]} /><meshStandardMaterial map={tt.shoji} color="#ffffff" emissive={shojiCol} emissiveMap={tt.shoji} emissiveIntensity={lerp(0.15, 0.32, day) * (1 - 0.8 * s.shade)} roughness={0.9} /></mesh>
      </group>)}
      <Box p={[-0.8, 2.02, -2.2]} s={[3.9, 0.08, 0.1]} c="#5a3d26" r={0.75} rad={0.01} />{/* kamoi: el riel de arriba (de ahí cuelgan los ema) */}
      <Box p={[-0.8, 0.09, -2.2]} s={[3.9, 0.04, 0.1]} c="#5a3d26" r={0.75} rad={0.01} />
      <Box p={[-0.8, 2.28, -2.25]} s={[3.9, 0.44, 0.08]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
      {/* TOKONOMA (la alcoba): piso elevado, pilar de madera natural, el ensō y el ikebana */}
      <group position={[1.85, 0, -2.4]}>
        <Box p={[0, 1.25, -0.2]} s={[1.3, 2.5, 0.06]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
        <Box p={[0, 0.13, 0]} s={[1.3, 0.1, 0.42]} c="#4a2f1e" r={0.35} rad={0.01} />
        <Cyl p={[-0.68, 1.25, 0.2]} r={0.05} h={2.5} c="#7a5a3a" rough={0.6} />
        <mesh position={[0, 1.35, -0.16]}><planeGeometry args={[0.42, 1.05]} /><meshStandardMaterial map={tt.scroll} roughness={0.9} /></mesh>
        <Cyl p={[0, 0.81, -0.14]} r={0.012} h={0.5} c="#2a1f17" rot={[0, 0, Math.PI / 2]} />
        {/* ikebana: vasija + ramas */}
        <Cyl p={[0.38, 0.26, 0.05]} r={0.07} r2={0.09} h={0.16} c="#3b4a5a" rough={0.3} />
        {[0, 1, 2].map((i) => <Cyl key={i} p={[0.38 + (i - 1) * 0.08, 0.52 + i * 0.05, 0.05]} r={0.006} h={0.45 + i * 0.1} c="#3d2a1a" rot={[0, 0, (i - 1) * 0.35]} />)}
        {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.3 + i * 0.06, 0.72 + rnd(i, 2) * 0.15, 0.05]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#e8b4b8" roughness={0.7} /></mesh>)}
        <Box p={[0, 2.5, 0.0]} s={[1.3, 0.08, 0.46]} c="#5a3d26" r={0.75} rad={0.01} />
      </group>
      {/* pared derecha del fondo entre tokonoma y engawa */}
      <Box p={[2.65, 1.25, -1.95]} s={[0.1, 2.5, 0.6]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
      {/* pared izquierda: FUSUMA pintadas */}
      {[-1.35, 0.55, 1.5].map((z, i) => <mesh key={i} position={[-2.78, 1.03, z]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.94, 1.9]} /><meshStandardMaterial map={tt.fusuma} roughness={0.85} /></mesh>)}
      <Box p={[-2.8, 2.02, 0.1]} s={[0.1, 0.08, 4.0]} c="#5a3d26" r={0.75} rad={0.01} />
      <Box p={[-2.82, 2.28, 0.1]} s={[0.08, 0.44, 4.0]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
      {/* techo de madera con vigas (sólo la mitad de atrás) */}
      <Box p={[0, 2.5, -1.0]} s={[5.8, 0.05, 2.6]} c="#8a6a48" map={tt.wood} r={0.8} rad={0.01} />
      {[-2, -1, 0, 1, 2].map((x) => <Box key={x} p={[x, 2.42, -0.2]} s={[0.08, 0.1, 4.2]} c="#4a3220" r={0.8} rad={0.01} />)}
      {/* columnas de las esquinas */}
      {[[-2.8, -2.2], [2.7, -2.2], [2.7, 1.9]].map(([x, z], i) => <Box key={i} p={[x, 1.25, z]} s={[0.12, 2.5, 0.12]} c="#5a3d26" r={0.75} rad={0.012} />)}

      {/* ===== los 9 EMA colgando del kamoi (las 9 frases) ===== */}
      {Array.from({ length: 9 }, (_, i) => {
        const k = s.ema[i]; if (k <= 0.01) return null;
        const sw = Math.sin(t * 1.6 + i) * 0.05 * (1 - Math.min(1, (t - s.emaAt[i]) / 4)) + (1 - ease(k)) * 0.8;
        const flip = Math.min(1, (i === 8 ? s.ema9 : 0) + s.emaF[i]);
        const hi = s.emaHi[i];
        return <group key={i} position={[EMA_X(i), 1.98, -2.1]} rotation={[sw * 0.6, flip * Math.PI, sw]}>
          <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.003, 0.003, 0.14, 4]} /><meshStandardMaterial color="#b8321e" /></mesh>
          <group position={[0, -0.26 + (1 - ease(k)) * 0.3, 0.01]} scale={1 + hi * 0.25}>
            <mesh castShadow><planeGeometry args={[0.3, 0.234]} /><meshStandardMaterial map={tt.ema[i]} transparent alphaTest={0.4} roughness={0.8} emissive="#ffb257" emissiveIntensity={hi * 0.12} side={THREE.FrontSide} /></mesh>
            <mesh rotation={[0, Math.PI, 0]}><planeGeometry args={[0.3, 0.234]} /><meshStandardMaterial map={tt.emaB[i]} transparent alphaTest={0.4} roughness={0.8} emissive="#ffb257" emissiveIntensity={hi * 0.12} /></mesh>
          </group>
          {hi > 0.02 && <pointLight position={[0, -0.26, 0.3]} intensity={hi * 0.5} distance={0.9} color="#ffb257" />}
        </group>;
      })}

      {/* ===== EL RINCÓN DEL TELÉFONO: mesita baja + zabuton + el teléfono negro ===== */}
      <group>
        <Box p={[PHONE[0], 0.2, PHONE[2]]} s={[0.46, 0.04, 0.4]} c="#3b2618" r={0.35} rad={0.01} />
        {[[-0.19, -0.15], [0.19, -0.15], [-0.19, 0.15], [0.19, 0.15]].map(([x, z], i) => <Box key={i} p={[PHONE[0] + x, 0.13, PHONE[2] + z]} s={[0.04, 0.12, 0.04]} c="#3b2618" r={0.4} rad={0.008} />)}
        <Box p={[PHONE[0], 0.3, PHONE[2]]} s={[0.36, 0.006, 0.3]} c="#efe6d2" map={tt.washi} r={1} rad={0.002} />
        <Phone t={t} ring={s.ring} lift={s.lift} />
        {/* libretita de teléfonos */}
        <Box p={[PHONE[0] + 0.15, 0.315, PHONE[2] + 0.1]} s={[0.07, 0.012, 0.1]} c="#8a2a1e" r={0.8} rad={0.004} rot={[0, 0.3, 0]} />
        <Zabuton p={[PHONE[0] + 0.48, 0.1, PHONE[2] + 0.05]} tex={tt.zabuR} rot={0.2} />
      </group>

      {/* ===== ESCRITORIO BAJO DE CALIGRAFÍA (washi, pincel, suzuri) ===== */}
      <group position={[DESK[0], 0, DESK[2]]}>
        <Box p={[0, 0.27, 0]} s={[0.9, 0.04, 0.42]} c="#3b2618" r={0.3} rad={0.01} />
        {[[-0.4, -0.17], [0.4, -0.17], [-0.4, 0.17], [0.4, 0.17]].map(([x, z], i) => <Box key={i} p={[x, 0.15, z]} s={[0.04, 0.24, 0.04]} c="#3b2618" r={0.4} rad={0.008} />)}
        <Box p={[0, 0.293, 0.03]} s={[0.36, 0.004, 0.26]} c="#f4ecdb" map={tt.washi} r={1} rad={0.001} />
        <Box p={[0.32, 0.3, -0.05]} s={[0.12, 0.02, 0.18]} c="#151515" r={0.3} rad={0.01} />
        <Cyl p={[0.24, 0.3, 0.13]} r={0.006} h={0.2} c="#a77f3c" rot={[Math.PI / 2, 0, 0.35]} />
        <Box p={[-0.32, 0.3, 0.0]} s={[0.04, 0.02, 0.28]} c="#2a2a2a" m={0.6} r={0.3} rad={0.005} />
      </group>
      <Zabuton p={[DESK[0], 0.1, DESK[2] + 0.5]} tex={tt.zabu} />

      {/* ===== LA CHABUDAI con el té (las tazas buenas) ===== */}
      <group position={[TABLE[0], 0, TABLE[2]]}>
        <Cyl p={[0, 0.31, 0]} r={0.58} h={0.04} c="#5a3820" rough={0.35} seg={48} map={tt.wood} />
        {[0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2 + 0.6; return <Box key={i} p={[Math.cos(a) * 0.4, 0.15, Math.sin(a) * 0.4]} s={[0.05, 0.28, 0.05]} c="#3b2618" r={0.4} rad={0.01} />; })}
        {s.books < 0.5 && s.wrap < 0.5 && <>
          <Teapot p={[-0.15, 0.33, -0.1]} />
          <Cup p={[0.15, 0.33, 0.1]} tex={tt.cup} steam={s.steam} t={t} glow={tt.glow} crack={Math.min(1, s.kin)} gold={Math.max(0, s.kin - 1)} />
          <Cup p={[-0.12, 0.33, 0.22]} tex={tt.cup} steam={s.steam} t={t + 1.3} glow={tt.glow} />
          {s.guests > 0.4 && <><Cup p={[0.3, 0.33, -0.18]} tex={tt.cup} /><Cup p={[-0.32, 0.33, 0.05]} tex={tt.cup} /></>}
          <Box p={[0.05, 0.335, -0.25]} s={[0.22, 0.01, 0.08]} c="#3d5a3a" r={0.6} rad={0.004} />
        </>}
      </group>
      {/* zabutones alrededor: la gente que volvía a su mesa */}
      {[[0.35, 0.75, 0], [1.1, 0.05, 1.57], [-0.4, 0.05, 1.57], [0.35, -0.65, 0]].map(([x, z, r], i) => <Zabuton key={i} p={[x, 0.1, z]} tex={i % 2 ? tt.zabuR : tt.zabu} rot={r} k={i === 0 ? 1 : s.guests * 3 - (i - 1)} />)}
      {/* la LÁMPARA de papel sobre la mesa */}
      <group position={[0.35, 1.85, 0.05]}>
        <Cyl p={[0, 0.35, 0]} r={0.004} h={0.5} c="#111" />
        <mesh scale={[1, 1.15, 1]}><sphereGeometry args={[0.2, 28, 20]} /><meshStandardMaterial color="#fff4e0" emissive="#ffcf8a" emissiveIntensity={0.5 + s.lamp * 1.4} roughness={0.9} toneMapped={false} /></mesh>
        {[-0.12, -0.04, 0.04, 0.12].map((y) => <mesh key={y} position={[0, y * 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[Math.sqrt(0.04 - y * y) * 1.0, 0.002, 4, 32]} /><meshStandardMaterial color="#7a5a3a" /></mesh>)}
      </group>

      {/* ===== TANSU (cómoda) con la FOTO enmarcada ===== */}
      <group position={[-2.5, 0, 0.55]}>
        <Box p={[0, 0.48, 0]} s={[0.42, 0.96, 0.9]} c="#6a3f22" map={tt.wood} r={0.5} rad={0.012} />
        {[0.2, 0.48, 0.76].map((y, j) => { const dx = (j === 2 ? 0.34 * ease(Math.max(s.drawer, s.env)) : j === 1 ? 0.28 * ease(s.drawer) * 0 : 0);
          return <group key={y} position={[dx, 0, 0]}>
            <Box p={[0.215, y, 0]} s={[0.01, 0.24, 0.84]} c="#5a341c" r={0.45} rad={0.004} /><Box p={[0.225, y, 0]} s={[0.012, 0.03, 0.14]} c="#1b1b1b" m={0.7} r={0.4} rad={0.004} />
            {j === 2 && dx > 0.01 && <><Box p={[0.05, y - 0.02, 0]} s={[0.34, 0.2, 0.8]} c="#7a4a28" r={0.6} rad={0.006} />
              <Box p={[0.05, y + 0.082, 0.12]} s={[0.26, 0.004, 0.34]} c="#2b3f63" r={0.9} rad={0.002} />
              {s.env > 0.02 && <mesh position={[0.05, y + 0.088, -0.17]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[0.24, 0.15]} /><meshStandardMaterial map={tt.envT} roughness={0.9} emissive="#ffffff" emissiveMap={tt.envT} emissiveIntensity={0.15 * s.env} /></mesh>}</>}
          </group>; })}
        <group position={[0, 1.06, -0.22]} rotation={[0, Math.PI / 2 - 0.2, 0]}>
          <Box p={[0, 0, 0]} s={[0.2, 0.25, 0.02]} c="#2a1f17" r={0.4} rad={0.005} rot={[-0.12, 0, 0]} />
          <mesh position={[0, 0.002, 0.012]} rotation={[-0.12, 0, 0]}><planeGeometry args={[0.16, 0.21]} /><meshStandardMaterial map={pg.img_mother1976} roughness={0.35} emissive="#ffffff" emissiveMap={pg.img_mother1976} emissiveIntensity={0.15} /></mesh>
        </group>
      </group>

      {/* ===== ENGAWA y el JARDINCITO (del tamaño de una sábana) ===== */}
      <Box p={[3.15, 0.25, -0.15]} s={[0.8, 0.06, 4.1]} c="#8a6a48" map={tt.wood} r={0.6} rad={0.01} />
      {[-1.9, -0.6, 0.7, 1.85].map((z) => <Box key={z} p={[3.5, 0.12, z]} s={[0.06, 0.24, 0.06]} c="#4a3220" rad={0.008} />)}
      <Box p={[4.6, 0.02, -0.4]} s={[2.2, 0.04, 2.6]} c="#3f5a2f" r={1} rad={0.01} />
      {[[3.9, -1.5], [4.4, 0.6], [3.8, 0.9], [5.2, -1.6], [4.9, -0.6]].map(([x, z], i) => <mesh key={i} position={[x, 0.06, z]} scale={[1, 0.55, 1]} castShadow><dodecahedronGeometry args={[0.12 + rnd(i, 3) * 0.1, 0]} /><meshStandardMaterial color="#77756c" roughness={1} flatShading /></mesh>)}
      <Lantern p={[4.3, 0, -1.1]} on={1 - day * 0.85} />
      <Maple p={[5.0, 0, 0.2]} t={t} />
      {/* cerco de bambú */}
      {Array.from({ length: 22 }, (_, i) => <Cyl key={i} p={[5.9, 0.75, -1.9 + i * 0.12]} r={0.035} h={1.5} c={i % 3 ? "#a8954f" : "#8f7d3e"} rough={0.6} seg={10} />)}
      {[0.5, 1.2].map((y) => <Cyl key={y} p={[5.85, y, -0.6]} r={0.02} h={2.7} c="#5a4a28" rot={[Math.PI / 2, 0, 0]} />)}

      {/* ===== RELOJ de pared sobre el rincón del teléfono (domingo, 5 para las 7 → las 7: suena) ===== */}
      <group position={[-2.74, 1.5, -1.0]} rotation={[0, Math.PI / 2, 0]}>
        <Cyl p={[0, 0, -0.01]} r={0.17} h={0.03} c="#4a3220" rough={0.5} rot={[Math.PI / 2, 0, 0]} />
        <mesh position={[0, 0, 0.007]}><circleGeometry args={[0.15, 40]} /><meshStandardMaterial map={tt.clockFace} roughness={0.7} /></mesh>
        {(() => { const hr = s.hour, min = (hr % 1) * 60; const am = (min / 60) * Math.PI * 2, ah = (hr / 12) * Math.PI * 2;
          return <><mesh position={[Math.sin(am) * 0.05, Math.cos(am) * 0.05, 0.012]} rotation={[0, 0, -am]}><boxGeometry args={[0.007, 0.11, 0.003]} /><meshStandardMaterial color="#1b1712" /></mesh>
            <mesh position={[Math.sin(ah) * 0.035, Math.cos(ah) * 0.035, 0.014]} rotation={[0, 0, -ah]}><boxGeometry args={[0.011, 0.075, 0.003]} /><meshStandardMaterial color="#1b1712" /></mesh>
            <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.009, 12]} /><meshStandardMaterial color="#c8321e" /></mesh></>; })()}
      </group>

      {/* ===== la fusuma del medio se corre (puerta cerrada = pared; entreabierta = la luz del pasillo) ===== */}
      {s.door > 0.01 && <mesh position={[-2.86, 1.03, -0.4]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.94, 1.9]} /><meshBasicMaterial color="#ffd9a0" toneMapped={false} /></mesh>}
      <mesh position={[-2.76, 1.03, -0.4 + s.door * 0.92]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.94, 1.9]} /><meshStandardMaterial map={tt.fusuma} roughness={0.85} /></mesh>
      {s.door > 0.01 && <pointLight position={[-2.5, 1.1, -0.4]} intensity={s.door * 1.4} distance={2.5} color="#ffcf8a" />}

      {/* ===== las tazas buenas envueltas en papel, en su caja de kiri (30 años en el armario) ===== */}
      {s.wrap > 0.01 && <group position={[TABLE[0] + 0.05, 0.33, TABLE[2] - 0.02]} scale={0.6 + 0.4 * ease(Math.min(1, s.wrap * 1.5))}>
        <Box p={[0, 0.04, 0]} s={[0.36, 0.08, 0.36]} c="#d8c39a" map={tt.wood} r={0.8} rad={0.006} />
        {[[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]].map(([x, z], i) => <mesh key={i} position={[x, 0.09 + 0.04 * s.wrap, z]} scale={[s.wrap, s.wrap, s.wrap]} castShadow><icosahedronGeometry args={[0.065, 1]} /><meshStandardMaterial map={tt.wrapP} color="#ffffff" roughness={0.95} flatShading /></mesh>)}
      </group>}

      {/* ===== el escalón de piedra a la puerta (en el invierno de los 73: hielo) ===== */}
      <group position={[3.78, 0, 1.2]}>
        <Box p={[0, 0.07, 0]} s={[0.5, 0.14, 0.34]} c={new THREE.Color("#8d8a80").lerp(new THREE.Color("#dfe9f2"), s.ice).getStyle()} r={1 - 0.85 * s.ice} m={0.1 * s.ice} rad={0.03} />
        {s.ice > 0.02 && <mesh position={[0, 0.142, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.46, 0.3]} /><meshStandardMaterial color="#eef6ff" roughness={0.05} metalness={0.3} transparent opacity={0.55 * s.ice} /></mesh>}
      </group>

      {/* ===== el PORTÓN en el cerco (donde la gente venía con sus problemas de verdad) ===== */}
      <group position={[5.9, 0, 1.1]}>
        {[-0.38, 0.38].map((z) => <Box key={z} p={[0, 0.85, z]} s={[0.09, 1.7, 0.09]} c="#4a3220" r={0.7} rad={0.01} />)}
        <Box p={[0, 1.75, 0]} s={[0.3, 0.06, 1.05]} c="#2a1f17" r={0.6} rad={0.01} />
        <Box p={[0, 1.66, 0]} s={[0.12, 0.08, 0.92]} c="#5a3d26" r={0.7} rad={0.01} />
        {[-1, 1].map((sd) => <group key={sd} position={[0, 0, sd * 0.36]} rotation={[0, sd * 0.35, 0]}>
          {Array.from({ length: 6 }, (_, i) => <Box key={i} p={[0, 0.65, -sd * (0.03 + i * 0.06)]} s={[0.03, 1.1, 0.045]} c="#8f7d3e" r={0.6} rad={0.006} />)}
          <Box p={[0, 1.0, -sd * 0.18]} s={[0.035, 0.04, 0.36]} c="#5a4a28" rad={0.005} /><Box p={[0, 0.35, -sd * 0.18]} s={[0.035, 0.04, 0.36]} c="#5a4a28" rad={0.005} />
        </group>)}
      </group>

      {/* ===== las grullas de papel que le enseñó a la nena de al lado ===== */}
      {s.cranes > 0.01 && [[0.62, 0.0, 0.4, "#c8321e"], [0.7, 0.22, -0.6, "#d9a441"], [0.5, 0.3, 1.9, "#2b3f63"]].map(([x, z, r, c], i) => {
        const k = ease(Math.min(1, s.cranes * 3 - i)); if (k <= 0.01) return null;
        return <group key={i} position={[TABLE[0] + (x as number) - 0.35, 0.335 + (1 - k) * 0.25, TABLE[2] + (z as number)]} rotation={[0, r as number, 0]} scale={k}>
          <mesh position={[0, 0.025, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.035, 0.05, 4]} /><meshStandardMaterial color={c as string} roughness={0.8} flatShading /></mesh>
          {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.04, sd * 0.04]} rotation={[sd * 0.5, 0, 0]}><boxGeometry args={[0.07, 0.002, 0.07]} /><meshStandardMaterial color={c as string} roughness={0.8} /></mesh>)}
          <mesh position={[0.05, 0.06, 0]} rotation={[0, 0, -0.9]}><coneGeometry args={[0.006, 0.06, 4]} /><meshStandardMaterial color={c as string} /></mesh>
          <mesh position={[-0.05, 0.06, 0]} rotation={[0, 0, 0.9]}><coneGeometry args={[0.006, 0.06, 4]} /><meshStandardMaterial color={c as string} /></mesh>
        </group>;
      })}

      {/* ===== ssimple7: futón + caja laqueada + andon · radio · espejo · tazón · la tarjeta de tres ===== */}
      <Futon t={t} tt={tt} nb={s.nbOpen} pencil={s.pencil} andon={s.andon} blanket={s.blanket} />
      <Radio t={t} on={Math.min(1, s.radio)} broken={s.radioBroken} tex={tt.radioF} />
      <Mirror k={s.mirror} />
      <Bowl p={[TABLE[0] + 0.12, 0.33, TABLE[2] + 0.12]} k={Math.min(1, s.bowl)} t={t} glow={tt.glow} />
      {s.cards > 0.01 && <mesh position={[TABLE[0] - 0.2, 0.334, TABLE[2] + 0.28]} rotation={[-Math.PI / 2, 0, 0.25]} scale={ease(s.cards)}><planeGeometry args={[0.2, 0.14]} /><meshStandardMaterial map={tt.card3} roughness={0.9} /></mesh>}

      {/* ===== THE OSAKA WAY: los 5 libritos sobre la chabudai; The 101 Day avanza y se abre en la pág. 45 ===== */}
      {s.books > 0.01 && [0, 1, 2, 3, 4].map((i) => {
        const isHero = i === s.heroI;
        const fan = (i - 2) * 0.33;
        let p: V = [TABLE[0] + Math.sin(fan) * 0.38 * ease(s.row), 0.335 + (isHero ? 0 : 0.0) + (1 - ease(s.books)) * 0.7 * (1 + i * 0.15), TABLE[2] - 0.1 - Math.cos(fan) * 0.14 * ease(s.row)];
        let rot = -fan * ease(s.row) + 0.05 * (i - 2);
        if (isHero) { p = [lerp(p[0], PT.book[0], ease(s.hero)), p[1] + Math.sin(Math.PI * s.hero) * 0.12 + 0.002, lerp(p[2], PT.book[2], ease(s.hero))]; rot = lerp(rot, 0, s.hero); }
        else { p = [p[0], p[1], lerp(p[2], p[2] - 0.22, ease(s.hero))]; }
        return <Book key={i} p={p} rotY={rot} open={isHero ? s.open : 0} cover={pg[COVERS[i]]} inside={s.spread ? pg.kak_p71_r : pg.day_p37_r} right={s.spread ? pg.kak_p72 : pg.day_p38} spine={SPINE[i]}>
          {isHero && s.open > 0.9 && <PageHi k={s.spread ? s.hi[1] : s.hi[0]} u0={0.08} u1={0.8} v={0.16} h={0.05} op={0.28} />}
        </Book>;
      })}
    </ThreeCanvas>
  );
};
