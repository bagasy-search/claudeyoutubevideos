// keikoes01 · EL MUNDO: la cocina chiquita de madera de Keiko en Kioto, en CORTE (sin la pared de adelante), y la calle de
// afuera (callejón de machiya al atardecer). Mesada con pileta, una hornalla con la olla, la arrocera; a la derecha la ALACENA
// de madera con puertas de vidrio acanalado que se abren: QUINCE FRASCOS (uno por truco) con etiqueta en kanji; la heladera
// chiquita, la mesita baja con el té y el cuaderno, el noren índigo en la puerta. UNA escena y UNA cámara para todo el video.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { delayRender, continueRender, staticFile } from "remotion";
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

// ---------------- medidas de la casa ----------------
export const CT = 0.86;                 // alto de la mesada
const XL = -2.2, XR = 2.2, ZB = -1.8;   // pared izquierda (ventana), derecha (heladera y noren), fondo
const SHELF_Y = [1.12, 1.5, 1.88];      // estantes de la alacena (vidrio)
const AX0 = 0.78, AX1 = 2.12, AZ = -1.56; // alacena: de x 0,78 a 2,12, frente en z -1,33
// QUINCE FRASCOS: 5 por estante, de arriba a abajo (1-5 arriba, 6-10 medio, 11-15 abajo)
export const JARS: V[] = Array.from({ length: 15 }, (_, i) => [AX0 + 0.16 + (i % 5) * 0.255, SHELF_Y[2 - Math.floor(i / 5)] + 0.005, AZ + 0.02] as V);
export const PT = {
  ventana: [XL, 1.45, -0.55] as V,
  calle: [-5.2, 1.4, -0.4] as V,
  olla: [-0.32, CT + 0.14, -1.5] as V,
  hornalla: [-0.32, CT + 0.02, -1.5] as V,
  bolsas: [-0.92, CT + 0.12, -1.42] as V,
  pileta: [-1.5, CT, -1.5] as V,
  arrocera: [0.32, CT + 0.12, -1.5] as V,
  alacena: [1.45, 1.5, -1.4] as V,
  heladera: [1.88, 0.75, 0.25] as V,
  mesita: [-1.15, 0.36, 0.75] as V,
  cuaderno: [-1.0, 0.37, 0.72] as V,
  te: [-1.42, 0.37, 0.62] as V,
  noren: [2.17, 1.4, 1.25] as V,
  jars: JARS,
};

// ---------------- CÁMARA (keyframes globales; minuto 1 + resto se suman) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([1.2, 1.6, 3]), l: v3([0, 1.0, -1]), fov: 42 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  p.x += Math.sin(t * 0.53) * 0.01; p.y += Math.sin(t * 0.71 + 1) * 0.007; // cámara en mano, apenas
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

// ---------------- texturas procedurales de la casa de Kioto ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: (i: number) => string, r = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = col(i); g.fillRect(rnd(i, 11) * w, rnd(i, 12) * h, r * (0.5 + rnd(i, 13)), r * (0.5 + rnd(i, 14))); } };
const grain = (g: CanvasRenderingContext2D, w: number, h: number, base: [number, number, number], n = 60, vertical = true) => {
  g.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`; g.fillRect(0, 0, w, h);
  for (let k = 0; k < n; k++) {
    g.strokeStyle = `rgba(${base[0] * 0.45},${base[1] * 0.4},${base[2] * 0.3},${0.12 + rnd(k, 3) * 0.22})`; g.lineWidth = 0.8 + rnd(k, 4) * 2.2; g.beginPath();
    if (vertical) { const x = rnd(k, 5) * w; g.moveTo(x, 0); g.bezierCurveTo(x + 8 * rnd(k, 6), h * 0.33, x - 10 * rnd(k, 7), h * 0.66, x + 5, h); }
    else { const y = rnd(k, 5) * h; g.moveTo(0, y); g.bezierCurveTo(w * 0.33, y + 6 * rnd(k, 6), w * 0.66, y - 6 * rnd(k, 7), w, y + 3); }
    g.stroke();
  }
  noise(g, w, h, 500, (i) => `rgba(255,235,200,${0.03 + rnd(i, 1) * 0.04})`, 2);
};
const useKioto = () => useMemo(() => ({
  // piso de tablas oscuras, gastadas, con brillo de cera
  piso: mk(512, 512, (g) => {
    for (let r = 0; r < 6; r++) {
      const b = 92 + rnd(r, 1) * 22;
      g.fillStyle = `rgb(${b},${b * 0.66},${b * 0.42})`; g.fillRect(0, r * 86, 512, 86);
      for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(30,16,8,${0.12 + rnd(r * 20 + k, 2) * 0.18})`; g.lineWidth = 1 + rnd(k, 3) * 2; g.beginPath(); const y = r * 86 + 5 + k * 6; g.moveTo(0, y); g.bezierCurveTo(170, y + 4 * rnd(r, k), 340, y - 3, 512, y + 2); g.stroke(); }
      g.fillStyle = "rgba(15,8,4,.6)"; g.fillRect(0, r * 86, 512, 2.5);
      const cut = 120 + rnd(r, 9) * 280; g.fillRect(cut, r * 86, 2, 86);
    }
    noise(g, 512, 512, 900, (i) => `rgba(255,230,190,${0.03 + rnd(i, 2) * 0.05})`, 2);
  }, [4, 4]),
  hinoki: mk(256, 512, (g) => grain(g, 256, 512, [222, 186, 138], 70)),
  nogal: mk(256, 512, (g) => grain(g, 256, 512, [128, 82, 46], 70)),
  oscura: mk(256, 512, (g) => grain(g, 256, 512, [70, 44, 26], 60)),
  // revoque de cal crema con manchas suaves
  cal: mk(512, 512, (g) => {
    g.fillStyle = "#e9e0cc"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${170 + rnd(i, 1) * 40},${150 + rnd(i, 2) * 30},${110},${0.04 + rnd(i, 3) * 0.05})`; g.beginPath(); g.ellipse(rnd(i, 4) * 512, rnd(i, 5) * 512, 30 + rnd(i, 6) * 90, 20 + rnd(i, 7) * 60, rnd(i, 8) * 3, 0, 6.3); g.fill(); }
    noise(g, 512, 512, 3000, (i) => `rgba(120,100,70,${0.04 + rnd(i, 1) * 0.05})`, 1.5);
  }, [2, 1.5]),
  // azulejo blanco cuadrado con junta gris
  azulejo: mk(256, 256, (g) => {
    g.fillStyle = "#9a9790"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = 236 + rnd(r * 4 + c, 1) * 12; g.fillStyle = `rgb(${v},${v},${v - 4})`; g.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(c * 64 + 6, r * 64 + 6, 20, 4); }
  }, [6, 2]),
  // vidrio acanalado (estrías verticales)
  acanalado: mk(256, 256, (g) => {
    for (let x = 0; x < 256; x += 8) { const gr = g.createLinearGradient(x, 0, x + 8, 0); gr.addColorStop(0, "rgba(255,255,255,.55)"); gr.addColorStop(0.5, "rgba(210,225,230,.25)"); gr.addColorStop(1, "rgba(150,170,180,.5)"); g.fillStyle = gr; g.fillRect(x, 0, 8, 256); }
  }, [4, 1]),
  // tela índigo del noren con círculos blancos (patrón same-komon simplificado)
  noren: mk(512, 512, (g) => {
    g.fillStyle = "#1f2f52"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 2500, (i) => `rgba(10,20,40,${0.15 + rnd(i, 1) * 0.15})`, 2);
    g.strokeStyle = "rgba(236,232,220,.9)"; g.lineWidth = 6;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.beginPath(); g.arc(64 + c * 128, 64 + r * 128 + (c % 2) * 64, 38, 0, 6.3); g.stroke(); }
  }),
  // piedra del callejón
  piedra: mk(512, 512, (g) => {
    g.fillStyle = "#5d5a55"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) { const v = 95 + rnd(r * 6 + c, 1) * 40; g.fillStyle = `rgb(${v},${v - 3},${v - 8})`; g.beginPath(); g.roundRect(c * 86 + (r % 2) * 40 - 40 + 3, r * 64 + 3, 82, 58, 10); g.fill(); }
    noise(g, 512, 512, 4000, (i) => `rgba(30,30,30,${0.1 + rnd(i, 1) * 0.15})`, 2);
  }, [6, 6]),
  // celosía de madera (kōshi) de la casa de enfrente
  koshi: mk(512, 512, (g) => {
    g.fillStyle = "#1a120c"; g.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 22) { g.fillStyle = "#6b4426"; g.fillRect(x, 0, 14, 512); g.fillStyle = "rgba(255,210,150,.12)"; g.fillRect(x, 0, 3, 512); }
    for (let y = 60; y < 512; y += 150) { g.fillStyle = "#5a371e"; g.fillRect(0, y, 512, 12); }
  }, [3, 1]),
  teja: mk(256, 256, (g) => {
    g.fillStyle = "#3b3f44"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) { const gr = g.createLinearGradient(x, 0, x + 32, 0); gr.addColorStop(0, "#2a2d31"); gr.addColorStop(0.5, "#5b6066"); gr.addColorStop(1, "#2a2d31"); g.fillStyle = gr; g.fillRect(x, 0, 32, 256); }
  }, [8, 1]),
  cielo: (() => { const t0 = mk(16, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#1e2448"); gr.addColorStop(0.32, "#4a4a7a"); gr.addColorStop(0.46, "#c77a6a"); gr.addColorStop(0.5, "#f2a65e"); gr.addColorStop(0.56, "#3a2a2a"); gr.addColorStop(1, "#1a1414"); g.fillStyle = gr; g.fillRect(0, 0, 16, 512); }); t0.wrapS = t0.wrapT = THREE.ClampToEdgeWrapping; return t0; })(),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  steam: mk(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 62); gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(0.5, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }),
  // papel de la bolsa de arroz del súper (kraft con franja)
  kraft: mk(256, 256, (g) => {
    g.fillStyle = "#c9a774"; g.fillRect(0, 0, 256, 256); noise(g, 256, 256, 1500, (i) => `rgba(110,80,40,${0.08 + rnd(i, 1) * 0.1})`, 2);
    g.fillStyle = "#c23b2e"; g.fillRect(0, 90, 256, 46); g.fillStyle = "#f4ecdc"; g.font = "900 34px Georgia"; g.fillText("ARROZ 5 kg", 34, 126);
  }),
}), []);

// etiquetas de los frascos (PNG hechos con kanji reales) — se esperan con delayRender
const LABELS = ["kome", "togarashi", "miso", "ume", "konbu", "shiitake", "gohan", "tsuke", "shoga", "negi", "daikon", "shoyu", "goma", "katsuo", "furi"];
const useLabels = () => {
  const [tex, setTex] = useState<THREE.Texture[] | null>(null);
  useMemo(() => {
    const h = delayRender("etiquetas kanji");
    const ld = new THREE.TextureLoader();
    Promise.all(LABELS.map((k) => new Promise<THREE.Texture>((res, rej) => ld.load(staticFile(`keikoes01/label_${k}.png`), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }, undefined, rej))))
      .then((ts) => { setTex(ts); requestAnimationFrame(() => continueRender(h)); })
      .catch(() => { setTex([]); continueRender(h); });
  }, []);
  return tex;
};

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; map?: Tx; rot?: V; s?: number | V; m?: number; inner?: string; seg?: number; op?: number }> = ({ prof, p, c, r = 0.75, map, rot, s = 1, m = 0, inner, seg = 40, op = 1 }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), seg), [JSON.stringify(prof), seg]);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow={op > 0.9} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} side={inner ? THREE.FrontSide : THREE.DoubleSide} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
      {inner && <mesh geometry={geo}><meshStandardMaterial color={inner} roughness={0.4} side={THREE.BackSide} /></mesh>}
    </group>
  );
};
const FRASCO: [number, number][] = [[0, 0], [0.055, 0], [0.062, 0.008], [0.064, 0.15], [0.058, 0.17], [0.046, 0.18], [0.046, 0.2]];
const POTE: [number, number][] = [[0, 0], [0.06, 0], [0.072, 0.02], [0.078, 0.09], [0.07, 0.13], [0.074, 0.14]];
const BOTELLA: [number, number][] = [[0, 0], [0.04, 0], [0.042, 0.13], [0.03, 0.17], [0.015, 0.2], [0.015, 0.23]];
const OLLA: [number, number][] = [[0, 0], [0.13, 0.004], [0.16, 0.03], [0.17, 0.12], [0.165, 0.15], [0.175, 0.155]];
const TAZA: [number, number][] = [[0, 0], [0.025, 0], [0.03, 0.01], [0.04, 0.06], [0.042, 0.07]];

const Steam: React.FC<{ p: V; t: number; amt: number; tex: THREE.Texture; spread?: number; h?: number; n?: number; size?: number }> = ({ p, t, amt, tex, spread = 0.2, h = 0.8, n = 14, size = 0.3 }) => {
  if (amt <= 0.01) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => {
        const life = 3 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const y = ph * h, x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.05 * ph, z = (rnd(i, 4) - 0.5) * spread;
        const s = size * (0.5 + ph * 1.4);
        return <sprite key={i} position={[x, y, z]} scale={[s, s, 1]} userData={{ noAO: true }}><spriteMaterial map={tex} color="#fff6ea" transparent opacity={amt * 0.3 * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>;
      })}
    </group>
  );
};

// contenido de cada frasco (cosa REAL de la despensa japonesa) — i = número de truco - 1
const Contenido: React.FC<{ i: number }> = ({ i }) => {
  const fill = (c: string, h = 0.12, r = 0.057, rough = 0.9) => <mesh position={[0, 0.01 + h / 2, 0]}><cylinderGeometry args={[r, r, h, 24]} /><meshStandardMaterial color={c} roughness={rough} /></mesh>;
  const bolitas = (n: number, c: string, rr: number, h = 0.12, rough = 0.5, sc: V = [1, 1, 1]) => Array.from({ length: n }, (_, k) => <mesh key={k} position={[(rnd(k + i * 31, 1) - 0.5) * 0.08, 0.02 + rnd(k + i * 31, 2) * h, (rnd(k + i * 31, 3) - 0.5) * 0.08]} rotation={[rnd(k, 4) * 3, rnd(k, 5) * 3, 0]} scale={sc}><sphereGeometry args={[rr, 10, 8]} /><meshStandardMaterial color={c} roughness={rough} /></mesh>);
  switch (i) {
    case 0: return <>{fill("#ece6d6", 0.105, 0.05, 0.95)}{Array.from({ length: 60 }, (_, k) => { const a = rnd(k, 8) * 6.28, rr = Math.sqrt(rnd(k, 9)) * 0.046; return <mesh key={k} position={[Math.cos(a) * rr, 0.116 + rnd(k, 10) * 0.006, Math.sin(a) * rr]} rotation={[rnd(k, 4) * 3, rnd(k, 5) * 3, 0]} scale={[1, 0.6, 1.8]}><sphereGeometry args={[0.0045, 8, 6]} /><meshStandardMaterial color="#f7f3ea" roughness={0.7} /></mesh>; })}{[[-0.03, 0.128, 0.0, 0.4, 0.3], [0.025, 0.13, -0.02, -0.3, 2.1]].map(([x, y, z, ry, rz], k) => <group key={k} position={[x, y, z]} rotation={[0.2, ry, 1.3 + rz * 0.2]}><mesh scale={[1, 1, 3.4]}><sphereGeometry args={[0.011, 12, 8]} /><meshStandardMaterial color="#c0261a" roughness={0.4} /></mesh><mesh position={[0, 0, 0.04]}><cylinderGeometry args={[0.004, 0.004, 0.012, 6]} /><meshStandardMaterial color="#4f6a2a" roughness={0.7} /></mesh></group>)}<mesh position={[0.034, 0.078, 0.034]} rotation={[Math.PI / 2 - 0.35, 0, 0.5]} scale={[1, 1, 3.2]}><sphereGeometry args={[0.0105, 12, 8]} /><meshStandardMaterial color="#c0261a" roughness={0.4} /></mesh></>; // arroz + 2-3 chiles secos (asoman arriba y contra el vidrio)
    case 1: return <>{bolitas(22, "#9e160d", 0.011, 0.12, 0.35, [1, 1, 2.6])}</>;                        // chiles secos (togarashi)
    case 2: return fill("#8a5a2c", 0.1, 0.06, 0.6);                                                  // miso
    case 3: return <>{bolitas(12, "#a8232f", 0.024, 0.12, 0.35)}</>;                                 // umeboshi
    case 4: return <>{Array.from({ length: 5 }, (_, k) => <mesh key={k} position={[(k - 2) * 0.016, 0.09, 0]} rotation={[0, 0, (k - 2) * 0.05]}><boxGeometry args={[0.008, 0.16, 0.07]} /><meshStandardMaterial color="#2b3324" roughness={0.7} /></mesh>)}</>; // kombu
    case 5: return <>{bolitas(9, "#6b4528", 0.026, 0.12, 0.8, [1, 0.45, 1])}</>;                     // shiitake secos
    case 6: return <>{[0, 1, 2, 3, 4].map((k) => <group key={k} position={[(rnd(k, 7) - 0.5) * 0.006, 0.022 + k * 0.027, 0]} rotation={[0, k * 0.5, 0]}><mesh scale={[1, 0.3, 1]}><sphereGeometry args={[0.045, 20, 12]} /><meshStandardMaterial color="#f5f2ea" roughness={0.75} /></mesh><mesh scale={[1.04, 0.33, 1.04]}><sphereGeometry args={[0.045, 20, 12]} /><meshStandardMaterial color="#e8f2f6" roughness={0.15} transparent opacity={0.35} /></mesh></group>)}</>; // arroz cocido en porciones planas envueltas en film (truco 7)
    case 7: return <>{bolitas(16, "#e5c96a", 0.02, 0.12, 0.5, [1, 0.5, 1.4])}</>;                    // encurtidos (nabo amarillo)
    case 8: return <>{bolitas(5, "#d6b27a", 0.025, 0.1, 0.8, [1.5, 0.8, 1])}</>;                     // jengibre
    case 9: return <>{bolitas(40, "#6fae4a", 0.008, 0.12, 0.6, [1, 0.4, 1])}</>;                     // verdeo picado
    case 10: return <>{Array.from({ length: 2 }, (_, k) => <mesh key={k} position={[(k - 0.5) * 0.04, 0.1, 0]}><cylinderGeometry args={[0.018, 0.016, 0.17, 12]} /><meshStandardMaterial color="#f1ede2" roughness={0.6} /></mesh>)}</>; // nabo daikon
    case 11: return fill("#2a120a", 0.12, 0.05, 0.15);                                               // salsa de soja
    case 12: return fill("#e3d0a2", 0.1, 0.057, 0.95);                                                // sésamo
    case 13: return fill("#c99a62", 0.12, 0.057, 0.95);                                               // escamas de bonito
    default: return <>{fill("#4b5a2a", 0.09, 0.057, 0.9)}{bolitas(30, "#e8d7a0", 0.006, 0.1, 0.8)}</>; // furikake
  }
};

const Jar: React.FC<{ i: number; p: V; glow: number; label?: THREE.Texture; t: number }> = ({ i, p, glow, label, t }) => {
  const kind = [11].includes(i) ? "bot" : [2].includes(i) ? "pote" : "frasco";
  const lift = 0.035 * Math.min(1, glow), rot = glow * 0.25 * Math.sin(t * 1.4 + i);
  return (
    <group position={[p[0], p[1] + lift, p[2]]} rotation={[0, rot, 0]}>
      {kind === "pote"
        ? <><Lathe prof={POTE} p={[0, 0, 0]} c="#7a4a2a" r={0.35} s={1.05} inner="#3a2414" /><mesh position={[0, 0.152, 0]}><cylinderGeometry args={[0.08, 0.08, 0.018, 28]} /><meshStandardMaterial color="#a77a48" roughness={0.6} /></mesh><Contenido i={i} /></>
        : kind === "bot"
          ? <><Lathe prof={BOTELLA} p={[0, 0, 0]} c={i === 11 ? "#1a0d08" : "#efe2bc"} r={0.06} op={0.55} /><Contenido i={i} /><mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.018, 0.018, 0.025, 12]} /><meshStandardMaterial color={i === 11 ? "#b52f3a" : "#e0a93f"} roughness={0.4} /></mesh></>
          : <><Contenido i={i} /><Lathe prof={FRASCO} p={[0, 0, 0]} c="#dff1f0" r={0.04} op={0.28} /><mesh position={[0, 0.205, 0]}><cylinderGeometry args={[0.05, 0.05, 0.022, 24]} /><meshStandardMaterial color={i % 3 === 0 ? "#d2a874" : "#c9c4b8"} roughness={0.5} metalness={i % 3 === 0 ? 0 : 0.6} /></mesh></>}
      {label && <mesh position={[0, kind === "bot" ? 0.08 : 0.085, kind === "pote" ? 0.077 : 0.066]}><planeGeometry args={[0.06, 0.09]} /><meshStandardMaterial map={label} roughness={0.9} /></mesh>}
      {glow > 0.01 && <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.075, 0.09, 40]} /><meshBasicMaterial color="#ffc864" transparent opacity={0.55 * Math.min(1, glow)} /></mesh>}
      {glow > 0.01 && <pointLight position={[0.05, 0.16, 0.3]} intensity={0.09 * Math.min(1, glow)} distance={0.45} decay={2} color="#ffd59a" />}
    </group>
  );
};

// la llama azul de la hornalla
const Flame: React.FC<{ p: V; t: number; amt: number }> = ({ p, t, amt }) => amt <= 0.01 ? null : (
  <group position={p}>
    {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, hh = (0.035 + 0.012 * Math.sin(t * 11 + i * 2.1)) * amt; return (
      <mesh key={i} position={[Math.cos(a) * 0.075, hh / 2, Math.sin(a) * 0.075]} userData={{ noAO: true }}><coneGeometry args={[0.012, hh, 6]} /><meshBasicMaterial color="#3f6fd0" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>); })}
    <pointLight position={[0, 0.06, 0]} intensity={0.25 * amt} distance={0.8} color="#ffb36a" />
  </group>
);

// farolito de papel del callejón
const Farol: React.FC<{ p: V; on: number; dot: THREE.Texture }> = ({ p, on, dot }) => (
  <group position={p}>
    <mesh><cylinderGeometry args={[0.16, 0.16, 0.42, 20]} /><meshStandardMaterial color="#f2e2c0" emissive="#ffb35a" emissiveIntensity={1.6 * on} roughness={0.8} /></mesh>
    {[-0.2, 0.2].map((y) => <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.13, 0.13, 0.04, 16]} /><meshStandardMaterial color="#1a1310" /></mesh>)}
    {on > 0.01 && <sprite scale={[1.4, 1.4, 1]} userData={{ noAO: true }}><spriteMaterial map={dot} color="#ffb35a" transparent opacity={0.35 * on} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>}
    {on > 0.01 && <pointLight intensity={1.4 * on} distance={4} color="#ffb35a" />}
  </group>
);

// ---------------- props del mundo que cambian con el video ----------------
export type WorldProps = {
  t: number;
  dusk?: number;          // 0 día · 1 atardecer en el callejón (faroles)
  lamp?: number;          // lámpara colgante de la cocina
  doors?: number;         // 0..1 puertas de vidrio de la alacena abiertas
  jarGlow?: number[];     // 0..1 por frasco (1..15)
  bags?: number;          // 0..1 las bolsas abiertas del súper al lado del fuego (el error)
  heat?: number;          // 0..1 la hornalla prendida y el calor
  winOpen?: number;       // 0..1 la ventana corrediza abierta (la cámara entra por ahí)
  steam?: number;
  dimShelf?: number;      // 0..1 la mitad de la comida "se echa a perder" (frascos 8-15 se apagan grises)
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, dusk = 0, lamp = 0.6, doors = 0, jarGlow = [], bags = 0, heat = 0.7, winOpen = 0, steam = 1, dimShelf = 0 } = pr;
  const tx = useKioto();
  const labels = useLabels();
  const sky = new THREE.Color("#cfe0ea").lerp(new THREE.Color("#3a3e5c"), dusk);
  const sunI = 2.2 * (1 - 0.75 * dusk);
  const slide = 0.52 * winOpen;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.5 + 0.3 * dusk} threshold={0.86 - 0.08 * dusk} exposure={1.0 - 0.08 * dusk} env={0.24 * (1 - dusk) + 0.06} />
      <color attach="background" args={[sky.getHex()]} />
      <fog attach="fog" args={[sky.getHex(), 16, 70]} />
      <hemisphereLight args={[new THREE.Color("#fff2dc").lerp(new THREE.Color("#5a6390"), dusk).getHex(), 0x3a2a1c, 0.55 - 0.25 * dusk]} />
      {/* luz de la ventana (izquierda): día blanco frío que entra en diagonal */}
      <directionalLight position={[-7, 5.5, 1.5]} intensity={sunI} color={new THREE.Color("#fff4e2").lerp(new THREE.Color("#ffae6a"), dusk).getHex()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* lámpara colgante con plato esmaltado sobre la mesada */}
      <pointLight position={[0.1, 2.0, -0.6]} intensity={0.8 + 2.2 * lamp} distance={5.5} decay={1.6} color="#ffd29a" castShadow shadow-bias={-0.0004} />
      <group position={[0.1, 2.12, -0.6]}>
        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.004, 0.004, 0.6, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <Lathe prof={[[0.02, 0.08], [0.06, 0.06], [0.18, -0.02], [0.2, -0.04]]} p={[0, 0, 0]} c="#2f4a3a" r={0.35} m={0.2} inner="#f3efe4" />
        <mesh position={[0, -0.02, 0]}><sphereGeometry args={[0.045, 14, 10]} /><meshBasicMaterial color="#ffe0a8" toneMapped={false} /></mesh>
      </group>

      {/* ===== piso y techo ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[XR - XL, 3.9]} /><meshStandardMaterial map={tx.piso} color="#e8d2b4" roughness={0.55} /></mesh>
      {[-1.6, -0.6, 0.4].map((z) => <Box key={z} p={[0, 2.5, z]} s={[XR - XL, 0.14, 0.12]} c="#5a3a22" map={tx.oscura} r={0.9} />)}
      <Box p={[0, 2.6, -1.0]} s={[XR - XL + 0.1, 0.05, 1.8]} c="#b48a5a" map={tx.hinoki} r={0.9} rad={0.01} />

      {/* ===== pared del FONDO: azulejo detrás de la mesada, revoque de cal arriba, postes de madera ===== */}
      <Box p={[-0.8, 1.22, ZB]} s={[2.8, 0.72, 0.05]} c="#ffffff" map={tx.azulejo} r={0.25} rad={0.005} />
      <Box p={[0, 2.0, ZB - 0.02]} s={[XR - XL, 1.0, 0.06]} c="#ffffff" map={tx.cal} r={1} rad={0.005} />
      <Box p={[-0.8, 0.45, ZB - 0.02]} s={[2.8, 0.9, 0.05]} c="#ffffff" map={tx.cal} r={1} rad={0.005} />
      {[XL + 0.06, 0.66, XR - 0.06].map((x) => <Box key={x} p={[x, 1.25, ZB + 0.02]} s={[0.12, 2.5, 0.12]} c="#6b4426" map={tx.nogal} r={0.85} />)}
      <Box p={[0, 1.6, ZB + 0.03]} s={[XR - XL, 0.08, 0.06]} c="#6b4426" map={tx.nogal} r={0.85} />

      {/* ===== pared IZQUIERDA con la ventana de vidrio acanalado (la cámara entra por acá) ===== */}
      <Box p={[XL, 0.5, 0]} s={[0.12, 1.0, 3.9]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      <Box p={[XL, 2.2, 0]} s={[0.12, 0.6, 3.9]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      <Box p={[XL, 1.45, -1.4]} s={[0.12, 0.9, 0.9]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      <Box p={[XL, 1.45, 0.95]} s={[0.12, 0.9, 1.9]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      {/* marco y dos hojas corredizas */}
      <Box p={[XL + 0.02, 1.0, -0.55]} s={[0.16, 0.06, 1.25]} c="#6b4426" map={tx.nogal} />
      <Box p={[XL + 0.02, 1.9, -0.55]} s={[0.16, 0.06, 1.25]} c="#6b4426" map={tx.nogal} />
      {[0, 1].map((k) => (
        <group key={k} position={[XL + 0.01 + k * 0.03, 1.45, -0.86 + k * 0.62 + (k === 0 ? -slide : slide)]}>
          <Box p={[0, 0, 0]} s={[0.03, 0.86, 0.04]} c="#5a371e" map={tx.oscura} rad={0.005} />
          <Box p={[0, 0, 0.58]} s={[0.03, 0.86, 0.04]} c="#5a371e" map={tx.oscura} rad={0.005} />
          <mesh position={[0, 0, 0.29]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.58, 0.84]} /><meshStandardMaterial map={tx.acanalado} color="#eef6f7" transparent opacity={0.55} roughness={0.2} emissive="#fff2dc" emissiveIntensity={0.18 * (1 - dusk)} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        </group>
      ))}
      {/* repisita de la ventana con un potus */}
      <Box p={[XL + 0.13, 1.0, -0.55]} s={[0.16, 0.03, 1.1]} c="#7a4b2a" map={tx.nogal} />
      <group position={[XL + 0.14, 1.02, -0.2]}>
        <Lathe prof={[[0, 0], [0.05, 0], [0.06, 0.09], [0.065, 0.1]]} p={[0, 0, 0]} c="#c9b89a" r={0.6} />
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.1, 0.12 + rnd(i, 2) * 0.08, (rnd(i, 3) - 0.5) * 0.12 - i * 0.012]} rotation={[rnd(i, 4), rnd(i, 5) * 3, 0.6]} scale={[1, 0.25, 1.6]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color="#4f7a3a" roughness={0.6} /></mesh>)}
      </group>

      {/* ===== pared DERECHA: puerta con NOREN índigo ===== */}
      <Box p={[XR, 1.25, -0.6]} s={[0.12, 2.5, 2.4]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      <Box p={[XR, 2.2, 1.35]} s={[0.12, 0.6, 1.1]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      {[0.8, 1.9].map((z) => <Box key={z} p={[XR - 0.02, 1.25, z]} s={[0.14, 2.5, 0.1]} c="#6b4426" map={tx.nogal} />)}
      {[0, 1, 2].map((k) => <mesh key={k} position={[PT.noren[0] - 0.08, 1.62, 0.98 + k * 0.33]} rotation={[0, -Math.PI / 2, 0.03 * Math.sin(t * 0.8 + k)]}><planeGeometry args={[0.31, 0.62]} /><meshStandardMaterial map={tx.noren} roughness={0.95} side={THREE.DoubleSide} /></mesh>)}

      {/* ===== MESADA del fondo: pileta, bolsas del súper, hornalla con olla, arrocera ===== */}
      <Box p={[-0.8, CT / 2, -1.5]} s={[2.75, CT, 0.58]} c="#a07444" map={tx.nogal} r={0.8} />
      {[-1.95, -1.25, -0.55, 0.15].map((x) => <Box key={x} p={[x + 0.33, 0.45, -1.205]} s={[0.62, 0.7, 0.02]} c="#b88a58" map={tx.hinoki} r={0.8} />)}
      {[-1.95, -1.25, -0.55, 0.15].map((x) => <Box key={"h" + x} p={[x + 0.33, 0.72, -1.19]} s={[0.12, 0.02, 0.02]} c="#2a2a2a" m={0.7} r={0.3} />)}
      <Box p={[-0.8, CT + 0.015, -1.5]} s={[2.78, 0.03, 0.62]} c="#3b3936" r={0.4} m={0.1} />
      {/* pileta de acero y canilla */}
      <mesh position={[PT.pileta[0], CT + 0.02, PT.pileta[2]]}><boxGeometry args={[0.5, 0.012, 0.38]} /><meshStandardMaterial color="#c9ccce" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[PT.pileta[0], CT + 0.025, PT.pileta[2]]}><boxGeometry args={[0.44, 0.012, 0.32]} /><meshStandardMaterial color="#5a5d60" metalness={0.8} roughness={0.35} /></mesh>
      <group position={[PT.pileta[0], CT + 0.03, -1.74]}>
        <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.012, 0.012, 0.28, 10]} /><meshStandardMaterial color="#d0d3d6" metalness={0.9} roughness={0.2} /></mesh>
        <mesh position={[0, 0.27, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.17, 10]} /><meshStandardMaterial color="#d0d3d6" metalness={0.9} roughness={0.2} /></mesh>
      </group>
      {/* tabla con un nabo daikon */}
      <Box p={[-1.0, CT + 0.04, -1.42]} s={[0.36, 0.025, 0.24]} c="#d9b88a" map={tx.hinoki} r={0.7} />
      {/* LAS BOLSAS DEL SÚPER abiertas al lado del fuego (el error del gancho) */}
      {bags > 0.01 && <group position={PT.bolsas} scale={bags}>
        {/* bolsa de papel de arroz, abierta y doblada hacia afuera */}
        <group position={[0, -0.12, 0]} rotation={[0, 0.35, 0]}>
          {[[0, 0.15, 0.06, 0.2, 0.3, 0.006], [0, 0.15, -0.06, 0.2, 0.3, 0.006], [0.1, 0.15, 0, 0.006, 0.3, 0.12], [-0.1, 0.15, 0, 0.006, 0.3, 0.12], [0, 0.003, 0, 0.2, 0.006, 0.12]].map((b, i) =>
            <mesh key={i} position={[b[0], b[1], b[2]]} castShadow receiveShadow><boxGeometry args={[b[3], b[4], b[5]]} /><meshStandardMaterial map={tx.kraft} color="#f0dcb8" roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
          {[[0, 0.31, 0.075, 0.6], [0, 0.31, -0.075, -0.6]].map((b, i) => <mesh key={"r" + i} position={[b[0], b[1], b[2]]} rotation={[b[3], 0, 0]}><boxGeometry args={[0.2, 0.05, 0.005]} /><meshStandardMaterial map={tx.kraft} color="#e8d2aa" roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
          <mesh position={[0, 0.24, 0]}><boxGeometry args={[0.19, 0.012, 0.11]} /><meshStandardMaterial color="#f4f1e8" roughness={0.8} /></mesh>
        </group>
        {/* granos de arroz volcados sobre la mesada */}
        {Array.from({ length: 70 }, (_, i) => <mesh key={"g" + i} position={[0.06 + rnd(i, 21) * 0.22, -0.115, 0.05 + rnd(i, 22) * 0.12]} rotation={[Math.PI / 2, 0, rnd(i, 23) * 6]} scale={[1, 2.2, 1]}><sphereGeometry args={[0.0045, 6, 4]} /><meshStandardMaterial color="#f6f2e6" roughness={0.6} /></mesh>)}
        {/* pote de miso destapado, con la tapa apoyada */}
        <group position={[0.3, -0.12, -0.02]}>
          <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.07, 0.062, 0.09, 28]} /><meshStandardMaterial color="#f1ece2" roughness={0.45} /></mesh>
          <mesh position={[0, 0.091, 0]}><cylinderGeometry args={[0.064, 0.064, 0.004, 28]} /><meshStandardMaterial color="#7a4a24" roughness={0.75} /></mesh>
          <mesh position={[0.1, 0.05, 0.03]} rotation={[0.1, 0, 1.35]}><cylinderGeometry args={[0.073, 0.073, 0.012, 28]} /><meshStandardMaterial color="#c23b2e" roughness={0.45} /></mesh>
        </group>
        {/* botella de soja sin tapa */}
        <Lathe prof={[[0, 0], [0.045, 0], [0.047, 0.2], [0.03, 0.25], [0.016, 0.28], [0.016, 0.31]]} p={[0.42, -0.12, -0.1]} c="#140a06" r={0.12} op={0.85} />
        {/* sobre de algas abierto */}
        <mesh position={[-0.2, -0.05, 0.08]} rotation={[0.1, -0.4, 0.15]} castShadow><boxGeometry args={[0.16, 0.15, 0.02]} /><meshStandardMaterial color="#c9d6c2" roughness={0.35} metalness={0.3} /></mesh>
        <mesh position={[-0.2, 0.03, 0.08]} rotation={[0.1, -0.4, 0.15]}><boxGeometry args={[0.14, 0.04, 0.012]} /><meshStandardMaterial color="#1f2a1a" roughness={0.7} /></mesh>
      </group>}
      {/* hornalla de una boca con la olla */}
      <group position={PT.hornalla}>
        <Box p={[0, 0, 0]} s={[0.46, 0.06, 0.4]} c="#2a2a2c" r={0.35} m={0.6} rad={0.01} />
        <mesh position={[0, 0.035, 0]}><torusGeometry args={[0.1, 0.012, 8, 30]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} /></mesh>
        {[0, 1, 2, 3].map((k) => <mesh key={k} position={[Math.cos(k * 1.571) * 0.11, 0.05, Math.sin(k * 1.571) * 0.11]}><boxGeometry args={[0.02, 0.02, 0.08]} /><meshStandardMaterial color="#111" /></mesh>)}
      </group>
      <Flame p={[PT.hornalla[0], PT.hornalla[1] + 0.04, PT.hornalla[2]]} t={t} amt={heat} />
      <Lathe prof={OLLA} p={[PT.olla[0], PT.hornalla[1] + 0.065, PT.olla[2]]} c="#c9c6c0" r={0.25} m={0.85} inner="#7c7a76" />
      <mesh position={[PT.olla[0], PT.hornalla[1] + 0.225, PT.olla[2]]}><cylinderGeometry args={[0.172, 0.172, 0.012, 32]} /><meshStandardMaterial color="#d6d3cd" metalness={0.85} roughness={0.22} /></mesh>
      <mesh position={[PT.olla[0], PT.hornalla[1] + 0.25, PT.olla[2]]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <Steam p={[PT.olla[0], PT.hornalla[1] + 0.24, PT.olla[2]]} t={t} amt={steam * heat} tex={tx.steam} spread={0.18} h={0.9} n={14} size={0.32} />
      {/* arrocera blanca */}
      <group position={[PT.arrocera[0], CT + 0.03, PT.arrocera[2]]}>
        <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.15, 0.16, 0.2, 32]} /><meshStandardMaterial color="#f2f0ea" roughness={0.35} /></mesh>
        <mesh position={[0, 0.215, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.15, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f7f5f0" roughness={0.3} /></mesh>
        <mesh position={[0, 0.08, 0.152]}><boxGeometry args={[0.08, 0.05, 0.01]} /><meshStandardMaterial color="#9fb8a8" emissive="#5aff9a" emissiveIntensity={0.2} /></mesh>
      </group>

      {/* ===== LA ALACENA de madera (todana): cajones abajo, estantes con QUINCE FRASCOS detrás de vidrio acanalado ===== */}
      <group>
        <Box p={[(AX0 + AX1) / 2, 0.42, AZ]} s={[AX1 - AX0, 0.84, 0.48]} c="#b07a48" map={tx.hinoki} r={0.75} />
        {[0, 1, 2].map((k) => <Box key={k} p={[AX0 + 0.23 + k * 0.45, 0.62, AZ + 0.245]} s={[0.42, 0.22, 0.02]} c="#c08a55" map={tx.hinoki} r={0.7} />)}
        {[0, 1, 2].map((k) => <Box key={"t" + k} p={[AX0 + 0.23 + k * 0.45, 0.62, AZ + 0.262]} s={[0.1, 0.018, 0.02]} c="#2a2a2a" m={0.7} r={0.35} />)}
        {[0, 1].map((k) => <Box key={"b" + k} p={[AX0 + 0.34 + k * 0.67, 0.27, AZ + 0.245]} s={[0.64, 0.4, 0.02]} c="#c08a55" map={tx.hinoki} r={0.7} />)}
        <Box p={[(AX0 + AX1) / 2, 0.86, AZ + 0.02]} s={[AX1 - AX0 + 0.04, 0.04, 0.54]} c="#8a5a32" map={tx.nogal} r={0.6} />
        {/* cuerpo alto */}
        <Box p={[(AX0 + AX1) / 2, 2.22, AZ - 0.04]} s={[AX1 - AX0 + 0.04, 0.06, 0.42]} c="#8a5a32" map={tx.nogal} />
        <Box p={[AX0, 1.55, AZ - 0.04]} s={[0.04, 1.36, 0.42]} c="#9a6a3c" map={tx.hinoki} />
        <Box p={[AX1, 1.55, AZ - 0.04]} s={[0.04, 1.36, 0.42]} c="#9a6a3c" map={tx.hinoki} />
        <Box p={[(AX0 + AX1) / 2, 1.55, AZ - 0.24]} s={[AX1 - AX0, 1.36, 0.02]} c="#d8b585" map={tx.hinoki} r={0.85} />
        {SHELF_Y.map((y) => <Box key={y} p={[(AX0 + AX1) / 2, y - 0.012, AZ - 0.04]} s={[AX1 - AX0 - 0.04, 0.025, 0.38]} c="#c99a62" map={tx.hinoki} r={0.7} rad={0.005} />)}
        {/* dos puertas de vidrio acanalado que se corren hacia los costados */}
        {[0, 1].map((k) => {
          const w = (AX1 - AX0) / 2, x = AX0 + w / 2 + k * w + (k === 0 ? -1 : 1) * doors * (w * 0.92);
          return <group key={k} position={[x, 1.55, AZ + 0.19 + k * 0.025]} scale={[1, 1.36 / 1.26, 1]}>
            <Box p={[0, 0.61, 0]} s={[w, 0.05, 0.03]} c="#6b4426" map={tx.nogal} rad={0.005} />
            <Box p={[0, -0.61, 0]} s={[w, 0.05, 0.03]} c="#6b4426" map={tx.nogal} rad={0.005} />
            {[-1, 1].map((sg) => <Box key={sg} p={[sg * (w / 2 - 0.02), 0, 0]} s={[0.04, 1.26, 0.03]} c="#6b4426" map={tx.nogal} rad={0.005} />)}
            {[-0.2, 0.2].map((y) => <Box key={y} p={[0, y, 0]} s={[w, 0.025, 0.025]} c="#6b4426" map={tx.nogal} rad={0.004} />)}
            <mesh><planeGeometry args={[w - 0.06, 1.18]} /><meshStandardMaterial map={tx.acanalado} color="#e8f2f2" transparent opacity={0.42} roughness={0.15} side={THREE.DoubleSide} depthWrite={false} /></mesh>
          </group>;
        })}
        {/* los quince frascos */}
        {JARS.map((p, i) => <Jar key={i} i={i} p={p} t={t} glow={Math.max(0, (jarGlow[i] ?? 0) - (i >= 7 ? dimShelf : 0))} label={labels?.[i]} />)}
        {/* "se echan a perder": los de abajo se ponen grises (velo) */}
        {dimShelf > 0.01 && <mesh position={[(AX0 + AX1) / 2, (SHELF_Y[0] + SHELF_Y[1]) / 2 - 0.05, AZ + 0.13]}><planeGeometry args={[AX1 - AX0 - 0.05, 0.72]} /><meshBasicMaterial color="#3b3f2c" transparent opacity={0.55 * dimShelf} depthWrite={false} /></mesh>}
      </group>

      {/* ===== HELADERA chiquita, a la derecha ===== */}
      <group position={[PT.heladera[0], 0, PT.heladera[2]]}>
        <Box p={[0, 0.75, 0]} s={[0.56, 1.5, 0.6]} c="#eceae4" r={0.3} rad={0.05} />
        <mesh position={[-0.282, 1.02, 0]}><boxGeometry args={[0.01, 0.01, 0.56]} /><meshStandardMaterial color="#b9b6ae" /></mesh>
        <Box p={[-0.3, 1.25, 0.18]} s={[0.025, 0.3, 0.03]} c="#c9c6be" m={0.6} r={0.3} />
        <Box p={[-0.3, 0.7, 0.18]} s={[0.025, 0.3, 0.03]} c="#c9c6be" m={0.6} r={0.3} />
        {/* imanes y un papelito */}
        <mesh position={[-0.285, 1.3, -0.12]} rotation={[0, -Math.PI / 2, 0.06]}><planeGeometry args={[0.12, 0.16]} /><meshStandardMaterial color="#f7f1e0" roughness={1} /></mesh>
        <mesh position={[-0.29, 1.37, -0.12]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#b52f3a" /></mesh>
      </group>

      {/* ===== MESITA BAJA (chabudai) con el té y el cuaderno, almohadón ===== */}
      <group position={[PT.mesita[0], 0, PT.mesita[2]]}>
        <mesh position={[0, 0.34, 0]} castShadow receiveShadow><cylinderGeometry args={[0.45, 0.45, 0.035, 48]} /><meshStandardMaterial map={tx.nogal} color="#a8784a" roughness={0.55} /></mesh>
        {[0, 1, 2, 3].map((k) => <Box key={k} p={[Math.cos(k * 1.571 + 0.785) * 0.3, 0.16, Math.sin(k * 1.571 + 0.785) * 0.3]} s={[0.05, 0.32, 0.05]} c="#6b4426" map={tx.nogal} />)}
        <Box p={[0.05, 0.05, 0.62]} s={[0.5, 0.08, 0.5]} c="#7a2e36" r={0.95} rad={0.04} />
      </group>
      <Lathe prof={TAZA} p={PT.te} c="#5f7a5a" r={0.4} inner="#7a8a3a" s={1.3} />
      <Steam p={[PT.te[0], PT.te[1] + 0.09, PT.te[2]]} t={t} amt={0.6} tex={tx.steam} spread={0.04} h={0.4} n={6} size={0.12} />
      <group position={PT.cuaderno} rotation={[0, 0.35, 0]}>
        <Box p={[0, 0.012, 0]} s={[0.22, 0.022, 0.3]} c="#2c3e64" r={0.9} rad={0.006} />
        <Box p={[0.004, 0.026, 0]} s={[0.205, 0.006, 0.285]} c="#efe5cf" r={1} rad={0.002} />
      </group>

      {/* ===== AFUERA: el callejón de Kioto (pared exterior de la casa, casa de enfrente con celosía, faroles) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, -0.01, 0]} receiveShadow><planeGeometry args={[7, 60]} /><meshStandardMaterial map={tx.piedra} color="#d8d2c8" roughness={0.85} /></mesh>
      {/* tablas de madera quemada en el zócalo exterior + alero de tejas */}
      <Box p={[XL - 0.08, 0.5, 0]} s={[0.04, 1.0, 3.9]} c="#ffffff" map={tx.koshi} r={0.85} rad={0.005} e="#ff9a4a" ei={0.08 * dusk} />
      <mesh userData={{ noAO: true }}><sphereGeometry args={[120, 32, 16]} /><meshBasicMaterial map={tx.cielo} side={THREE.BackSide} fog={false} toneMapped={false} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#9aa7c8"), 1 - dusk).getHex()} /></mesh>
      <mesh position={[XL - 0.45, 2.55, 0]} rotation={[0, 0, 0.42]}><boxGeometry args={[1.0, 0.06, 4.4]} /><meshStandardMaterial map={tx.teja} roughness={0.6} metalness={0.2} /></mesh>
      {/* casa de enfrente */}
      <Box p={[-8.2, 1.6, 0]} s={[0.4, 3.2, 12]} c="#ffffff" map={tx.cal} r={1} rad={0.01} />
      <Box p={[-7.98, 1.0, 0]} s={[0.06, 1.9, 9]} c="#ffffff" map={tx.koshi} r={0.9} rad={0.005} e="#ff9a4a" ei={0.12 * dusk} />
      <mesh position={[-7.6, 3.3, 0]} rotation={[0, 0, -0.42]}><boxGeometry args={[1.1, 0.06, 12.4]} /><meshStandardMaterial map={tx.teja} roughness={0.6} metalness={0.2} /></mesh>
      {[-3.2, 2.6].map((z) => <Farol key={z} p={[-7.7, 2.05, z]} on={0.25 + 0.75 * dusk} dot={tx.dot} />)}
      <Farol p={[XL - 0.35, 2.15, 1.6]} on={0.2 + 0.8 * dusk} dot={tx.dot} />
      {/* las casas vecinas del callejón (machiya en fila) con su celosía, alero y farol */}
      {[-13.5, -9.5, -5.5, 5.5, 9.5, 13.5].map((z, i) => (
        <group key={"v" + z}>
          <Box p={[XL - 0.3, 1.5, z]} s={[1.0, 3.0, 3.8]} c="#ffffff" map={tx.cal} r={1} rad={0.01} cast={false} />
          <Box p={[XL - 0.82, 0.95, z]} s={[0.05, 1.8, 3.4]} c="#ffffff" map={tx.koshi} r={0.85} rad={0.005} e="#ff9a4a" ei={0.18 * dusk * (i % 2 ? 1 : 0.4)} cast={false} />
          <mesh position={[XL - 1.0, 2.15, z]} rotation={[0, 0, 0.42]}><boxGeometry args={[0.9, 0.06, 3.9]} /><meshStandardMaterial map={tx.teja} roughness={0.6} metalness={0.2} /></mesh>
          <mesh position={[XL - 0.75, 3.05, z]} rotation={[0, 0, 0.42]}><boxGeometry args={[1.2, 0.06, 3.9]} /><meshStandardMaterial map={tx.teja} roughness={0.6} metalness={0.2} /></mesh>
          {i % 2 === 0 && <Farol p={[XL - 0.95, 1.85, z + 1.5]} on={0.2 + 0.8 * dusk} dot={tx.dot} />}
        </group>))}
      {[-12, -6, 6, 12].map((z) => <Box key={"o" + z} p={[-8.2, 1.6, z + (z > 0 ? 6 : -6)]} s={[0.4, 3.2, 12]} c="#ffffff" map={tx.cal} r={1} rad={0.01} cast={false} />)}
      {/* montañas de Higashiyama al fondo */}
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-30 - i * 4, 0, -24 + i * 12]}><coneGeometry args={[12 + rnd(i, 1) * 6, 8 + rnd(i, 2) * 5, 7]} /><meshStandardMaterial color={new THREE.Color("#4e6a52").lerp(sky, 0.5)} roughness={1} flatShading /></mesh>)}
    </ThreeCanvas>
  );
};
