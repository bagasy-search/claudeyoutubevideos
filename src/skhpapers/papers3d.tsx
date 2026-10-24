// skhpapers (copiado de ssimple6) · EL MUNDO: la casa de la madre en Osaka, en corte (sin la pared del frente). Seis tatamis, shoji al fondo,
// tokonoma con el pergamino (ensō) y un ikebana, la mesita del TELÉFONO negro de disco con su zabuton (donde todo empezó en 1976),
// el escritorio bajo de caligrafía, la chabudai con el juego de té (las tazas buenas: blancas con raya azul), la tansu con la foto,
// la lámpara de papel, el engawa abierto a un jardincito del tamaño de una sábana (farol de piedra, arce rojo, cerco de bambú).
// Sobre los shoji, un riel con los 9 EMA (las 9 frases). Noche → día (de la llamada a la mañana de los 101).
// UNA escena y UNA cámara (KEYS en tl.ts). Render SÓLO en el farm (acá sólo stills).
import React, { useMemo } from "react";
import { staticFile, delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../cme3d01/fx3d";
import { P } from "./lib";
import { KEYS, ST } from "./tl";
import { PILES, FOLDER, ENVELOPE, KIRI, DRUM, BASKET } from "./piles";
export { PILES, FOLDER, ENVELOPE, KIRI, DRUM, BASKET };

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
export const EMA_X = (i: number) => -2.6 + i * 0.33;   // i = 0..10 (las 11 reglas)
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
  ema: Array.from({ length: 11 }, (_, i) => mk(256, 200, (g) => {
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
  emaB: ["NO STORY|FIRST", "DECIDE AT|THE DOOR", "MANUALS|GO", "SHORT LIFE|RECEIPTS", "ONE CARD|PER PERSON", "ONE BLUE|FOLDER", "CHOOSE|TEN", "GIVE IT|BACK NOW", "YOUR OWN|DIARIES", "ONE SHELF|ONE DATE", "OPEN THIS|FIRST"].map((txt, i) => mk(256, 200, (g) => {
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
    {steam > 0.01 && glow && Array.from({ length: 5 }, (_, i) => { const ph = (t * 0.35 + i / 5) % 1; return <sprite key={i} position={[Math.sin(ph * 6 + i) * 0.015, 0.07 + ph * 0.18, 0]} scale={[0.05 + ph * 0.06, 0.05 + ph * 0.06, 1]}><spriteMaterial map={glow} color="#ffffff" transparent opacity={steam * 0.22 * Math.sin(Math.PI * ph)} depthWrite={false} /></sprite>; })}
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

// la foto de la madre (misma de ssimple6): el render espera a que cargue
const useMother = () => useMemo(() => {
  const h = delayRender("foto madre"); const tx = new THREE.TextureLoader().load(staticFile(P + "img_mother1976.jpg"), () => continueRender(h), undefined, () => continueRender(h));
  tx.colorSpace = THREE.SRGBColorSpace; return tx;
}, []);
// ===================================================================================================
// skhpapers · LA CASA DE PAPEL: 11 pilas de papel repartidas por la casa (una por regla). Cada regla que se cumple
// achica SU pila hasta que desaparece: al final la casa queda liviana. Tansu con los cajones llenos, el sobre marrón,
// la carpeta azul en el escritorio, la caja kiri con 10 cartas, el tambor de hierro del jardín y la canasta del genkan.
const PCOL = ["#f3eee2", "#e9dfc6", "#efe9db", "#e2d4b4", "#f6f3ea", "#d9c9a3"];
const Pile: React.FC<{ p: V; n: number; kind: string; k: number; idx: number; hi: number; tt: ReturnType<typeof useOsakaTex> }> = ({ p, n, kind, k, idx, hi, tt }) => {
  const m = Math.ceil(n * k - 0.001); if (m <= 0) return null;
  const top = n * k - (m - 1); // la hoja de arriba se va levantando y desaparece
  const em = hi * 0.25;
  return <group position={p}>
    {Array.from({ length: m }, (_, i) => {
      const lift = i === m - 1 ? (1 - top) : 0;
      const rot = (rnd(i, idx + 3) - 0.5) * 0.5, dx = (rnd(i, idx + 7) - 0.5) * 0.04, dz = (rnd(i, idx + 9) - 0.5) * 0.04;
      if (kind === "box") return <group key={i} position={[dx * 3, 0.09 + i * 0.17 + lift * 0.4, dz * 3]} rotation={[0, rot, 0]} scale={1 - lift}>
        <Box p={[0, 0, 0]} s={[0.36, 0.16, 0.24]} c={i % 2 ? "#b58d5c" : "#c49a66"} r={0.9} rad={0.006} e="#ffb257" ei={em} />
        <Box p={[0, 0.06, 0]} s={[0.33, 0.06, 0.21]} c="#efe6d2" r={1} rad={0.004} />
        <Box p={[0, 0.0, 0.121]} s={[0.12, 0.05, 0.002]} c="#f6f0e2" r={1} rad={0.001} />
      </group>;
      const h = kind === "books" ? 0.03 : kind === "news" ? 0.022 : 0.016;
      const sz: [number, number] = kind === "news" ? [0.4, 0.29] : kind === "cards" ? [0.16, 0.11] : kind === "books" ? [0.22, 0.29] : [0.3, 0.22];
      const col = kind === "books" ? ["#7a3b2a", "#2b3f63", "#3b5a3a", "#8a6a2a", "#5a4a6a", "#a8a092"][i % 6] : PCOL[(i + idx) % 6];
      return <group key={i} position={[dx, h / 2 + i * h + lift * 0.35, dz]} rotation={[0, rot, lift * 0.6]} scale={1 - lift * 0.9}>
        <Box p={[0, 0, 0]} s={[sz[0], h * 0.96, sz[1]]} c={col} r={0.95} rad={0.002} e="#ffb257" ei={em} map={kind === "news" ? tt.wrapP : undefined} />
        {kind === "cards" && i % 4 === 3 && <Box p={[0, h / 2, 0]} s={[0.006, 0.004, sz[1] + 0.01]} c="#c8321e" r={0.6} rad={0.001} />}
      </group>;
    })}
    {kind === "news" && m > 3 && <Box p={[0, (m * 0.022) / 2, 0]} s={[0.006, m * 0.022 + 0.004, 0.3]} c="#d8d2c4" r={0.6} rad={0.001} />}
    {hi > 0.02 && <pointLight position={[0, 0.5, 0.2]} intensity={hi * 0.6} distance={1.2} color="#ffb257" />}
  </group>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const tt = useOsakaTex();
  const MOTHER = useMother();
  const s = ST(t);
  const day = s.day;
  const sky = new THREE.Color("#2a2438").lerp(new THREE.Color("#cfd9df"), day);
  const shojiCol = new THREE.Color("#c27a48").lerp(new THREE.Color("#f2e2c4"), day);
  const flick = 0.75 + 0.25 * Math.sin(t * 17) * Math.sin(t * 7.3);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.6} threshold={0.86} exposure={lerp(0.95, 0.88, day) * (1 - 0.3 * s.shade)} env={lerp(0.1, 0.3, day)} />
      <color attach="background" args={[sky.getStyle()]} />
      <fogExp2 attach="fog" args={[sky.getStyle(), 0.035]} />
      <hemisphereLight args={[new THREE.Color("#8a6f8e").lerp(new THREE.Color("#fff3e0"), day), new THREE.Color("#2a2018").lerp(new THREE.Color("#8a7458"), day), lerp(0.3, 0.75, day)]} />
      <directionalLight position={[9, lerp(4, 7, day), 4]} intensity={lerp(0.9, 1.9, day)} color={new THREE.Color("#ff9a5a").lerp(new THREE.Color("#ffe2b8"), day).getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[0.35, 1.62, 0.05]} intensity={s.lamp * 4.5} distance={6} decay={1.6} color="#ffbe78" castShadow />
      <pointLight position={[-1.75, 0.95, -0.85]} intensity={0.5} distance={2.2} color="#ffc98a" />
      <pointLight position={[0, 1.8, 2.6]} intensity={lerp(0.4, 0.5, day)} distance={9} color={new THREE.Color("#e0b08e").lerp(new THREE.Color("#fff0dc"), day).getStyle()} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color={new THREE.Color("#5a524a").lerp(new THREE.Color("#a8a49a"), day)} roughness={1} /></mesh>

      {/* ===== LA CASA ===== */}
      <Box p={[0, 0.03, -0.15]} s={[5.6, 0.06, 4.2]} c="#6b4a2e" map={tt.wood} r={0.7} rad={0.01} />
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => {
        const x0 = Math.max(-2.7, -2.7 - (r % 2 ? 0.9 : 0) + c * 1.8), x1 = Math.min(2.7, -2.7 - (r % 2 ? 0.9 : 0) + (c + 1) * 1.8);
        if (x1 - x0 < 0.2) return null;
        return <Box key={r + "-" + c} p={[(x0 + x1) / 2, 0.08, -1.7 + r * 0.9]} s={[0.9, 0.05, x1 - x0 - 0.004]} c="#d9cfa6" map={tt.tatami} r={0.9} rad={0.008} rot={[0, Math.PI / 2, 0]} />;
      }))}
      {[-2.25, -1.3, -0.35, 0.6].map((x, i) => <group key={i} position={[x, 1.03, -2.2]}>
        <mesh><planeGeometry args={[0.94, 1.9]} /><meshStandardMaterial map={tt.shoji} color="#ffffff" emissive={shojiCol} emissiveMap={tt.shoji} emissiveIntensity={lerp(0.22, 0.32, day) * (1 - 0.8 * s.shade)} roughness={0.9} /></mesh>
      </group>)}
      <Box p={[-0.8, 2.02, -2.2]} s={[3.9, 0.08, 0.1]} c="#5a3d26" r={0.75} rad={0.01} />
      <Box p={[-0.8, 0.09, -2.2]} s={[3.9, 0.04, 0.1]} c="#5a3d26" r={0.75} rad={0.01} />
      <Box p={[-0.8, 2.28, -2.25]} s={[3.9, 0.44, 0.08]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
      <group position={[1.85, 0, -2.4]}>
        <Box p={[0, 1.25, -0.2]} s={[1.3, 2.5, 0.06]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
        <Box p={[0, 0.13, 0]} s={[1.3, 0.1, 0.42]} c="#4a2f1e" r={0.35} rad={0.01} />
        <Cyl p={[-0.68, 1.25, 0.2]} r={0.05} h={2.5} c="#7a5a3a" rough={0.6} />
        <mesh position={[0, 1.35, -0.16]}><planeGeometry args={[0.42, 1.05]} /><meshStandardMaterial map={tt.scroll} roughness={0.9} /></mesh>
        <Cyl p={[0, 0.81, -0.14]} r={0.012} h={0.5} c="#2a1f17" rot={[0, 0, Math.PI / 2]} />
        <Cyl p={[0.38, 0.26, 0.05]} r={0.07} r2={0.09} h={0.16} c="#3b4a5a" rough={0.3} />
        {[0, 1, 2].map((i) => <Cyl key={i} p={[0.38 + (i - 1) * 0.08, 0.52 + i * 0.05, 0.05]} r={0.006} h={0.45 + i * 0.1} c="#3d2a1a" rot={[0, 0, (i - 1) * 0.35]} />)}
        {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.3 + i * 0.06, 0.72 + rnd(i, 2) * 0.15, 0.05]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#e8b4b8" roughness={0.7} /></mesh>)}
        <Box p={[0, 2.5, 0.0]} s={[1.3, 0.08, 0.46]} c="#5a3d26" r={0.75} rad={0.01} />
      </group>
      <Box p={[2.65, 1.25, -1.95]} s={[0.1, 2.5, 0.6]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
      {[-1.35, -0.4, 0.55, 1.5].map((z, i) => <mesh key={i} position={[-2.78, 1.03, z]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.94, 1.9]} /><meshStandardMaterial map={tt.fusuma} roughness={0.85} /></mesh>)}
      <Box p={[-2.8, 2.02, 0.1]} s={[0.1, 0.08, 4.0]} c="#5a3d26" r={0.75} rad={0.01} />
      <Box p={[-2.82, 2.28, 0.1]} s={[0.08, 0.44, 4.0]} c="#cdb898" map={tt.clay} r={0.95} rad={0.005} />
      <Box p={[0, 2.5, -1.0]} s={[5.8, 0.05, 2.6]} c="#8a6a48" map={tt.wood} r={0.8} rad={0.01} />
      {[-2, -1, 0, 1, 2].map((x) => <Box key={x} p={[x, 2.42, -0.2]} s={[0.08, 0.1, 4.2]} c="#4a3220" r={0.8} rad={0.01} />)}
      {[[-2.8, -2.2], [2.7, -2.2], [2.7, 1.9]].map(([x, z], i) => <Box key={i} p={[x, 1.25, z]} s={[0.12, 2.5, 0.12]} c="#5a3d26" r={0.75} rad={0.012} />)}

      {/* ===== los 11 EMA (una regla cada uno): se dan vuelta con la regla nueva ===== */}
      {Array.from({ length: 11 }, (_, i) => {
        const k = s.ema[i]; if (k <= 0.01) return null;
        const sw = Math.sin(t * 1.6 + i) * 0.05 * (1 - Math.min(1, (t - s.emaAt[i]) / 4)) + (1 - ease(k)) * 0.8;
        const flip = s.emaF[i], hi = s.emaHi[i];
        return <group key={i} position={[EMA_X(i), 1.98, -2.1]} rotation={[sw * 0.6, flip * Math.PI, sw]}>
          <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.003, 0.003, 0.14, 4]} /><meshStandardMaterial color="#b8321e" /></mesh>
          <group position={[0, -0.26 + (1 - ease(k)) * 0.3, 0.01]} scale={0.92 + hi * 0.25}>
            <mesh castShadow><planeGeometry args={[0.3, 0.234]} /><meshStandardMaterial map={tt.ema[i]} transparent alphaTest={0.4} roughness={0.8} emissive="#ffb257" emissiveIntensity={hi * 0.12} side={THREE.FrontSide} /></mesh>
            <mesh rotation={[0, Math.PI, 0]}><planeGeometry args={[0.3, 0.234]} /><meshStandardMaterial map={tt.emaB[i]} transparent alphaTest={0.4} roughness={0.8} emissive="#ffb257" emissiveIntensity={hi * 0.12} /></mesh>
          </group>
          {hi > 0.02 && <pointLight position={[0, -0.26, 0.3]} intensity={hi * 0.5} distance={0.9} color="#ffb257" />}
        </group>;
      })}

      {/* ===== las 11 PILAS de papel ===== */}
      {PILES.map((pl, i) => <Pile key={i} p={pl.p} n={pl.n} kind={pl.kind} k={s.piles[i]} idx={i} hi={s.pileHi[i]} tt={tt} />)}

      {/* ===== rincón del teléfono (decorado) ===== */}
      <group>
        <Box p={[PHONE[0], 0.2, PHONE[2]]} s={[0.46, 0.04, 0.4]} c="#3b2618" r={0.35} rad={0.01} />
        {[[-0.19, -0.15], [0.19, -0.15], [-0.19, 0.15], [0.19, 0.15]].map(([x, z], i) => <Box key={i} p={[PHONE[0] + x, 0.13, PHONE[2] + z]} s={[0.04, 0.12, 0.04]} c="#3b2618" r={0.4} rad={0.008} />)}
        <Box p={[PHONE[0], 0.3, PHONE[2]]} s={[0.36, 0.006, 0.3]} c="#efe6d2" map={tt.washi} r={1} rad={0.002} />
        <Phone t={t} ring={0} lift={0} />
        <Box p={[PHONE[0] + 0.15, 0.315, PHONE[2] + 0.1]} s={[0.07, 0.012, 0.1]} c="#8a2a1e" r={0.8} rad={0.004} rot={[0, 0.3, 0]} />
        <Zabuton p={[PHONE[0] + 0.48, 0.1, PHONE[2] + 0.05]} tex={tt.zabuR} rot={0.2} />
      </group>

      {/* ===== ESCRITORIO con la CARPETA AZUL y el sobre "OPEN THIS FIRST" ===== */}
      <group position={[DESK[0], 0, DESK[2]]}>
        <Box p={[0, 0.27, 0]} s={[0.9, 0.04, 0.42]} c="#3b2618" r={0.3} rad={0.01} />
        {[[-0.4, -0.17], [0.4, -0.17], [-0.4, 0.17], [0.4, 0.17]].map(([x, z], i) => <Box key={i} p={[x, 0.15, z]} s={[0.04, 0.24, 0.04]} c="#3b2618" r={0.4} rad={0.008} />)}
        <Box p={[0.3, 0.3, -0.05]} s={[0.12, 0.02, 0.18]} c="#151515" r={0.3} rad={0.01} />
        <Cyl p={[0.22, 0.3, 0.13]} r={0.006} h={0.2} c="#a77f3c" rot={[Math.PI / 2, 0, 0.35]} />
      </group>
      {s.folder > 0.01 && <group position={[FOLDER[0], FOLDER[1] + (1 - ease(s.folder)) * 0.5 + s.folderHi * 0.03, FOLDER[2]]} rotation={[0, 0.12, s.folderHi * 0.05]}>
        <Box p={[0, 0.006, 0]} s={[0.24, 0.012, 0.31]} c="#2457c5" r={0.35} m={0.05} rad={0.004} e="#3a7bff" ei={s.folderHi * 0.35} />
        <Box p={[0, 0.0125, -0.1]} s={[0.2, 0.002, 0.05]} c="#f6f0e2" r={1} rad={0.001} />
        {s.openFirst > 0.01 && <group position={[0.01, 0.016 + (1 - ease(s.openFirst)) * 0.3, 0.02]} rotation={[0, -0.18, 0]}>
          <Box p={[0, 0.002, 0]} s={[0.2, 0.004, 0.13]} c="#f4ecdb" r={1} rad={0.002} e="#ffd28a" ei={s.openFirstHi * 0.4} />
          <Box p={[0, 0.0045, 0]} s={[0.15, 0.001, 0.02]} c="#1b1712" r={1} rad={0.0005} />
        </group>}
        {s.folderHi > 0.02 && <pointLight position={[0, 0.35, 0.1]} intensity={s.folderHi * 0.8} distance={1.2} color="#9fc0ff" />}
      </group>}
      <Zabuton p={[DESK[0], 0.1, DESK[2] + 0.5]} tex={tt.zabu} />

      {/* ===== CHABUDAI con el té, y la CAJA KIRI con las 10 cartas ===== */}
      <group position={[TABLE[0], 0, TABLE[2]]}>
        <Cyl p={[0, 0.31, 0]} r={0.58} h={0.04} c="#5a3820" rough={0.35} seg={48} map={tt.wood} />
        {[0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2 + 0.6; return <Box key={i} p={[Math.cos(a) * 0.4, 0.15, Math.sin(a) * 0.4]} s={[0.05, 0.28, 0.05]} c="#3b2618" r={0.4} rad={0.01} />; })}
        <Teapot p={[-0.25, 0.33, -0.2]} />
        <Cup p={[-0.05, 0.33, -0.3]} tex={tt.cup} steam={s.steam} t={t} glow={tt.glow} />
        {s.guests > 0.4 && <><Cup p={[-0.38, 0.33, 0.1]} tex={tt.cup} /><Cup p={[-0.3, 0.33, 0.3]} tex={tt.cup} /></>}
      </group>
      {s.kiri > 0.01 && <group position={[KIRI[0], KIRI[1] + (1 - ease(s.kiri)) * 0.4, KIRI[2]]} rotation={[0, -0.3, 0]} scale={0.7 + 0.3 * ease(s.kiri)}>
        <Box p={[0, 0.045, 0]} s={[0.34, 0.09, 0.24]} c="#e4d2ae" map={tt.wood} r={0.8} rad={0.006} e="#ffb257" ei={s.kiriHi * 0.2} />
        {Array.from({ length: 10 }, (_, i) => <Box key={i} p={[-0.13 + i * 0.029, 0.1, 0]} s={[0.006, 0.07, 0.17]} c={PCOL[i % 6]} r={1} rad={0.001} rot={[0, 0, (rnd(i, 2) - 0.5) * 0.15]} />)}
        <group position={[0.0, 0.1 + 0.18 * s.kiriLid, -0.2 * s.kiriLid]} rotation={[-1.2 * s.kiriLid, 0, 0]}>
          <Box p={[0, 0, 0.12]} s={[0.35, 0.014, 0.25]} c="#e9d9b8" map={tt.wood} r={0.8} rad={0.004} />
        </group>
        {s.kiriHi > 0.02 && <pointLight position={[0, 0.4, 0.2]} intensity={s.kiriHi * 0.7} distance={1.2} color="#ffb257" />}
      </group>}
      {[[0.35, 0.75, 0], [1.1, 0.05, 1.57], [-0.4, 0.05, 1.57], [0.35, -0.65, 0]].map(([x, z, r], i) => <Zabuton key={i} p={[x, 0.1, z]} tex={i % 2 ? tt.zabuR : tt.zabu} rot={r} k={i === 0 ? 1 : s.guests * 3 - (i - 1)} />)}
      <group position={[0.35, 1.85, 0.05]}>
        <Cyl p={[0, 0.35, 0]} r={0.004} h={0.5} c="#111" />
        <mesh scale={[1, 1.15, 1]}><sphereGeometry args={[0.2, 28, 20]} /><meshStandardMaterial color="#fff4e0" emissive="#ffcf8a" emissiveIntensity={0.5 + s.lamp * 1.4} roughness={0.9} toneMapped={false} /></mesh>
        {[-0.12, -0.04, 0.04, 0.12].map((y) => <mesh key={y} position={[0, y * 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[Math.sqrt(0.04 - y * y) * 1.0, 0.002, 4, 32]} /><meshStandardMaterial color="#7a5a3a" /></mesh>)}
      </group>

      {/* ===== TANSU de la madre: 4 cajones que se abren llenos de papel + el SOBRE MARRÓN ===== */}
      <group position={[-2.5, 0, 0.55]}>
        <Box p={[0, 0.48, 0]} s={[0.42, 0.96, 0.9]} c="#6a3f22" map={tt.wood} r={0.5} rad={0.012} />
        {[0.14, 0.36, 0.58, 0.8].map((y, j) => {
          const o = ease(Math.min(1, s.drawer * 1.6 - j * 0.2)) * 0.26;
          const full = 1 - s.drawerEmpty;
          return <group key={y} position={[o, y, 0]}>
            <Box p={[0.215, 0, 0]} s={[0.01, 0.2, 0.84]} c="#5a341c" r={0.45} rad={0.004} />
            <Box p={[0.225, 0, 0]} s={[0.012, 0.03, 0.14]} c="#1b1b1b" m={0.7} r={0.4} rad={0.004} />
            {o > 0.02 && <>
              <Box p={[0.08, -0.05, 0]} s={[0.26, 0.1, 0.8]} c="#4a2c18" r={0.6} rad={0.004} />
              {full > 0.02 && Array.from({ length: 5 }, (_, q) => <Box key={q} p={[0.08 + (rnd(q, j) - 0.5) * 0.04, q * 0.012 * full, -0.3 + q * 0.15]} s={[0.22, 0.012 + 0.05 * full, 0.13]} c={PCOL[(q + j) % 6]} r={1} rad={0.002} rot={[0, (rnd(q, j + 4) - 0.5) * 0.4, 0]} />)}
            </>}
          </group>;
        })}
        <group position={[0, 1.06, 0]} rotation={[0, Math.PI / 2 - 0.2, 0]}>
          <Box p={[0, 0, 0]} s={[0.2, 0.25, 0.02]} c="#2a1f17" r={0.4} rad={0.005} rot={[-0.12, 0, 0]} />
          <mesh position={[0, 0.002, 0.012]} rotation={[-0.12, 0, 0]}><planeGeometry args={[0.16, 0.21]} /><meshStandardMaterial map={MOTHER} roughness={0.35} emissive="#ffffff" emissiveMap={MOTHER} emissiveIntensity={0.15} /></mesh>
        </group>
      </group>
      {s.env > 0.01 && <group position={[ENVELOPE[0] + 0.12 * s.envOpen, ENVELOPE[1] + (1 - ease(s.env)) * -0.35 + 0.18 * s.envOpen + Math.sin(t * 1.3) * 0.006 * s.envHi, ENVELOPE[2]]} rotation={[0, 0.5, 0.15 * s.envOpen]}>
        <Box p={[0, 0.003, 0]} s={[0.22, 0.006, 0.15]} c="#9a6a3a" r={0.9} rad={0.002} e="#ffb257" ei={s.envHi * 0.3} />
        {s.envOpen > 0.01 && <group position={[0, 0.006 + 0.1 * s.envOpen, -0.02]} rotation={[-1.1 * s.envOpen, 0, 0]}>
          <Box p={[0, 0, 0]} s={[0.19, 0.002, 0.24]} c="#f6f0e2" r={1} rad={0.001} />
          {Array.from({ length: 11 }, (_, i) => <Box key={i} p={[-0.04, 0.0015, -0.1 + i * 0.019]} s={[0.12 * (0.6 + 0.4 * rnd(i, 5)), 0.0005, 0.004]} c="#1b1712" r={1} rad={0.0002} />)}
        </group>}
        {s.envHi > 0.02 && <pointLight position={[0, 0.3, 0.15]} intensity={s.envHi * 0.8} distance={1.2} color="#ffb257" />}
      </group>}

      {/* ===== ENGAWA, jardín, la CANASTA del correo y el TAMBOR de hierro ===== */}
      <Box p={[3.15, 0.25, -0.15]} s={[0.8, 0.06, 4.1]} c="#8a6a48" map={tt.wood} r={0.6} rad={0.01} />
      {[-1.9, -0.6, 0.7, 1.85].map((z) => <Box key={z} p={[3.5, 0.12, z]} s={[0.06, 0.24, 0.06]} c="#4a3220" rad={0.008} />)}
      <group position={BASKET}>
        <Cyl p={[0, 0.06, 0]} r={0.13} r2={0.11} h={0.12} c="#a5814a" rough={0.95} seg={16} />
        {[0, 1, 2].map((i) => <Box key={i} p={[(i - 1) * 0.03, 0.1 + i * 0.01, 0]} s={[0.17, 0.004, 0.11]} c={PCOL[i + 1]} r={1} rad={0.001} rot={[0.3 * (i - 1), (i - 1) * 0.3, 0.2]} />)}
        <Box p={[0.26, 0.11, 0.0]} s={[0.17, 0.22, 0.11]} c="#b8946a" r={1} rad={0.004} />
      </group>
      <Box p={[4.6, 0.02, -0.4]} s={[2.2, 0.04, 2.6]} c="#3f5a2f" r={1} rad={0.01} />
      {[[3.9, -1.5], [4.4, 0.6], [3.8, 0.9], [5.2, -1.6], [4.9, -0.6]].map(([x, z], i) => <mesh key={i} position={[x, 0.06, z]} scale={[1, 0.55, 1]} castShadow><dodecahedronGeometry args={[0.12 + rnd(i, 3) * 0.1, 0]} /><meshStandardMaterial color="#77756c" roughness={1} flatShading /></mesh>)}
      <Lantern p={[4.3, 0, -1.1]} on={1 - day * 0.85} />
      <Maple p={[5.0, 0, 0.2]} t={t} />
      <group position={DRUM}>
        <Cyl p={[0, 0.3, 0]} r={0.2} h={0.6} c="#6a3a24" rough={0.9} m={0.3} seg={20} />
        <Cyl p={[0, 0.6, 0]} r={0.205} h={0.02} c="#4a2a18" rough={0.8} m={0.4} seg={20} />
        {s.fire > 0.01 && <>
          <pointLight position={[0, 0.85, 0]} intensity={s.fire * 2.2 * flick} distance={2.5} color="#ff8a3a" />
          {Array.from({ length: 7 }, (_, i) => { const ph = (t * 0.9 + i / 7) % 1; return <sprite key={i} position={[Math.sin(i * 2 + t) * 0.05, 0.62 + ph * 0.35, Math.cos(i * 3) * 0.05]} scale={[0.22 - ph * 0.12, 0.26 - ph * 0.1, 1]}><spriteMaterial map={tt.glow} color={ph < 0.5 ? "#ffb04a" : "#ff5a1a"} transparent opacity={s.fire * (1 - ph) * 0.9} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>; })}
          {Array.from({ length: 5 }, (_, i) => { const ph = (t * 0.25 + i / 5) % 1; return <sprite key={"sm" + i} position={[Math.sin(ph * 5 + i) * 0.1, 1.0 + ph * 0.9, 0]} scale={[0.25 + ph * 0.4, 0.25 + ph * 0.4, 1]}><spriteMaterial map={tt.glow} color="#8a8478" transparent opacity={s.fire * 0.18 * Math.sin(Math.PI * ph)} depthWrite={false} /></sprite>; })}
        </>}
      </group>
      {Array.from({ length: 22 }, (_, i) => <Cyl key={i} p={[5.9, 0.75, -1.9 + i * 0.12]} r={0.035} h={1.5} c={i % 3 ? "#a8954f" : "#8f7d3e"} rough={0.6} seg={10} />)}
      {[0.5, 1.2].map((y) => <Cyl key={y} p={[5.85, y, -0.6]} r={0.02} h={2.7} c="#5a4a28" rot={[Math.PI / 2, 0, 0]} />)}

      <group position={[-2.74, 1.5, -1.0]} rotation={[0, Math.PI / 2, 0]}>
        <Cyl p={[0, 0, -0.01]} r={0.17} h={0.03} c="#4a3220" rough={0.5} rot={[Math.PI / 2, 0, 0]} />
        <mesh position={[0, 0, 0.007]}><circleGeometry args={[0.15, 40]} /><meshStandardMaterial map={tt.clockFace} roughness={0.7} /></mesh>
        {(() => { const min = (t / 60) % 60, hr = 5 + min / 60; const am = (min / 60) * Math.PI * 2, ah = (hr / 12) * Math.PI * 2;
          return <><mesh position={[Math.sin(am) * 0.05, Math.cos(am) * 0.05, 0.012]} rotation={[0, 0, -am]}><boxGeometry args={[0.007, 0.11, 0.003]} /><meshStandardMaterial color="#1b1712" /></mesh>
            <mesh position={[Math.sin(ah) * 0.035, Math.cos(ah) * 0.035, 0.014]} rotation={[0, 0, -ah]}><boxGeometry args={[0.011, 0.075, 0.003]} /><meshStandardMaterial color="#1b1712" /></mesh>
            <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.009, 12]} /><meshStandardMaterial color="#c8321e" /></mesh></>; })()}
      </group>
    </ThreeCanvas>
  );
};
