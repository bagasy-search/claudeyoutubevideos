// rocenas · EL MUNDO: la cocina de la abuela Rosa en CORTE (casa de muñecas: sin pared de adelante ni techo), de noche.
// Azulejos azules y blancos, estufa negra esmaltada con sus hornallas de gas, la alacena de madera, la ventana con cortina
// de encaje y la radio de baquelita. EN EL CENTRO: la mesita con mantel, el plato de Rosa y, enfrente, la silla vacía de
// Antonio con su chaleco gris. Sobre la mesa, el RECETARIO GIGANTE: pasa una hoja por cena y cada cena sale de su página
// y vuela al plato. Las monedas de lo que cuesta se apilan al lado. UNA escena y UNA cámara para todo el video.
// Render SÓLO en el farm (acá sólo stills).
import React, { useMemo, useState } from "react";
import { delayRender, continueRender } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { manoCam } from "../kits/camara/CamaraMano";
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
export const TY = 0.76;
export const PT = {
  plato: [-0.3, TY + 0.01, 0.14] as V,      // el plato de Rosa
  plato2: [-0.3, TY + 0.01, -0.5] as V,     // el de Antonio (sólo la noche de marzo)
  libro: [0.42, TY + 0.01, -0.12] as V,     // el lomo del recetario gigante
  pagina: [0.6, TY + 0.06, -0.12] as V,     // de donde sale cada cena
  monedas: [-0.66, TY + 0.01, 0.2] as V,
  silla: [-0.3, 0.75, -0.95] as V,          // la silla de Antonio
  estufa: [-1.7, 0.95, -2.12] as V,
  olla: [-1.48, 0.97, -2.12] as V,
  sarten: [-1.92, 0.97, -2.0] as V,
  alacena: [-2.82, 1.25, -0.6] as V,
  ventana: [1.5, 1.6, -2.48] as V,
  radio: [1.95, 1.07, -2.32] as V,
  mesa: [0, TY, -0.2] as V,
};

// ---------------- CÁMARA (keyframes globales: minuto 1 + resto) ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([1.6, 1.7, 2.6]), l: v3([0, 0.8, -0.4]), fov: 40, t };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k), t };
};
// cámara a mano virtual (vara 23-oct): balanceo lento sobre la cámara 3D, también en project() para que los anclajes sigan pegados
const aim = (cam: THREE.PerspectiveCamera, k: { p: THREE.Vector3; l: THREE.Vector3; t?: number }) => {
  cam.position.copy(k.p); cam.up.set(0, 1, 0); cam.lookAt(k.l);
  if (k.t !== undefined) { const m = manoCam(k.t); const D = Math.PI / 180; cam.rotateY(m.pan * D); cam.rotateX(m.tilt * D); cam.rotateZ(m.roll * D); }
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number; t?: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); aim(cam, cm); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
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
  aim(cm, k); cm.fov = k.fov; cm.near = 0.02; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas procedurales ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, col: (i: number) => string, r = 2) => { for (let i = 0; i < n; i++) { g.fillStyle = col(i); g.fillRect(rnd(i, 11) * w, rnd(i, 12) * h, r * (0.5 + rnd(i, 13)), r * (0.5 + rnd(i, 14))); } };
const useTx = () => useMemo(() => ({
  // azulejo azul y blanco: flor de cuatro pétalos y esquinas, con su junta gris y algún azulejo despostillado
  azulejo: mk(512, 512, (g) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = c * 128, y = r * 128, i = r * 4 + c;
      g.fillStyle = `rgb(${238 - rnd(i, 1) * 10},${236 - rnd(i, 2) * 10},${228 - rnd(i, 3) * 12})`; g.fillRect(x, y, 128, 128);
      g.save(); g.translate(x + 64, y + 64); g.fillStyle = "#1f4f9a";
      for (let p = 0; p < 4; p++) { g.rotate(Math.PI / 2); g.beginPath(); g.ellipse(0, -26, 13, 24, 0, 0, 6.3); g.fill(); }
      g.fillStyle = "#e9e4d6"; g.beginPath(); g.arc(0, 0, 9, 0, 6.3); g.fill(); g.fillStyle = "#c9a23a"; g.beginPath(); g.arc(0, 0, 5, 0, 6.3); g.fill();
      g.strokeStyle = "#2f63b0"; g.lineWidth = 5; for (let p = 0; p < 4; p++) { g.rotate(Math.PI / 2); g.beginPath(); g.arc(-64, -64, 30, 0, Math.PI / 2); g.stroke(); }
      g.restore();
      if (rnd(i, 9) > 0.86) { g.fillStyle = "rgba(140,120,90,.55)"; g.beginPath(); g.arc(x + 118, y + 10, 9, 0, 6.3); g.fill(); }
    }
    g.strokeStyle = "rgba(150,150,140,.9)"; g.lineWidth = 4; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 128, 0); g.lineTo(k * 128, 512); g.stroke(); g.beginPath(); g.moveTo(0, k * 128); g.lineTo(512, k * 128); g.stroke(); }
    noise(g, 512, 512, 1600, (i) => `rgba(80,70,50,${0.03 + rnd(i, 1) * 0.05})`, 2);
  }, [7, 2.2]),
  revoque: mk(512, 512, (g) => {
    g.fillStyle = "#e9dcc2"; g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 4000, (i) => `rgba(${150 + rnd(i, 1) * 60},${130 + rnd(i, 2) * 50},${100},${0.06 + rnd(i, 3) * 0.08})`, 3);
    for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(120,95,60,${0.03 + rnd(i, 4) * 0.04})`; g.beginPath(); g.arc(rnd(i, 5) * 512, rnd(i, 6) * 512, 40 + rnd(i, 7) * 90, 0, 6.3); g.fill(); }
  }, [3, 1]),
  piso: mk(512, 512, (g) => {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const i = r * 8 + c, b = (r + c) % 2 ? [178, 92, 58] : [226, 210, 180]; const v = 0.92 + rnd(i, 1) * 0.1; g.fillStyle = `rgb(${b[0] * v},${b[1] * v},${b[2] * v})`; g.fillRect(c * 64, r * 64, 64, 64); }
    g.strokeStyle = "rgba(70,50,35,.5)"; g.lineWidth = 2; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 512); g.stroke(); g.beginPath(); g.moveTo(0, k * 64); g.lineTo(512, k * 64); g.stroke(); }
    noise(g, 512, 512, 3000, (i) => `rgba(60,40,25,${0.05 + rnd(i, 2) * 0.06})`, 2);
  }, [6, 5]),
  madera: mk(256, 512, (g) => {
    g.fillStyle = "#5a3a22"; g.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 70; k++) { g.strokeStyle = `rgba(${30 + rnd(k, 1) * 30},${18 + rnd(k, 2) * 15},8,${0.2 + rnd(k, 3) * 0.3})`; g.lineWidth = 1 + rnd(k, 4) * 2.5; g.beginPath(); const x = rnd(k, 5) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 10 * rnd(k, 6), 170, x - 12 * rnd(k, 7), 340, x + 6, 512); g.stroke(); }
    noise(g, 256, 512, 600, (i) => `rgba(255,220,170,${0.04 + rnd(i, 1) * 0.05})`, 2);
  }),
  // mantel blanco con puntilla bordada en el borde
  mantel: mk(1024, 768, (g) => {
    g.fillStyle = "#f1ebde"; g.fillRect(0, 0, 1024, 768);
    noise(g, 1024, 768, 4000, (i) => `rgba(150,130,100,${0.04 + rnd(i, 1) * 0.05})`, 2);
    g.strokeStyle = "rgba(170,150,120,.5)"; g.lineWidth = 3;
    for (const [x0, y0, x1, y1] of [[30, 30, 994, 30], [30, 738, 994, 738]]) for (let k = 0; k < 40; k++) { const x = x0 + (x1 - x0) * k / 40; g.beginPath(); g.arc(x + 12, y0, 11, 0, 6.3); g.stroke(); }
    for (const x0 of [30, 994]) for (let k = 0; k < 30; k++) { g.beginPath(); g.arc(x0, 30 + k * 24.5, 11, 0, 6.3); g.stroke(); }
    g.strokeStyle = "rgba(60,90,150,.35)"; g.setLineDash([6, 6]); g.strokeRect(60, 60, 904, 648); g.setLineDash([]);
  }),
  // encaje de la cortina (con agujeritos)
  encaje: mk(256, 256, (g) => {
    g.fillStyle = "rgba(250,246,236,.92)"; g.fillRect(0, 0, 256, 256);
    g.globalCompositeOperation = "destination-out";
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.beginPath(); g.arc(16 + c * 32 + (r % 2) * 16, 16 + r * 32, 7 + 3 * Math.sin(r + c), 0, 6.3); g.fill(); }
    g.globalCompositeOperation = "source-over";
  }, [3, 3]),
  noche: mk(256, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#0b1430"); gr.addColorStop(1, "#24304e"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + rnd(i, 1) * 0.5})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 160, 1.5, 1.5); } }),
  diario: mk(512, 512, (g) => { g.fillStyle = "#d9d2c0"; g.fillRect(0, 0, 512, 512); g.fillStyle = "rgba(40,40,40,.55)"; for (let r = 0; r < 40; r++) for (let c = 0; c < 4; c++) g.fillRect(14 + c * 125, 20 + r * 12, 100 * (0.6 + rnd(r * 4 + c, 1) * 0.4), 5); g.fillStyle = "rgba(20,20,20,.8)"; g.fillRect(14, 4, 300, 14); }),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  steam: mk(128, 128, (g) => { for (let k = 0; k < 7; k++) { const gr = g.createRadialGradient(40 + rnd(k, 1) * 48, 40 + rnd(k, 2) * 48, 0, 64, 64, 60); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } }),
  lana: mk(256, 256, (g) => { g.fillStyle = "#77736c"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(40,38,35,.35)"; g.lineWidth = 3; for (let y = 0; y < 256; y += 8) for (let x = 0; x < 256; x += 12) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y + 6); g.lineTo(x + 12, y); g.stroke(); } }, [3, 3]),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; cast?: boolean; e?: string; ei?: number }> = ({ p, s, c, r = 0.9, m = 0, map, rad = 0.02, rot, cast = true, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Lathe: React.FC<{ prof: [number, number][]; p: V; c: string; r?: number; map?: Tx; rot?: V; s?: number; m?: number; inner?: string; seg?: number }> = ({ prof, p, c, r = 0.75, map, rot, s = 1, m = 0, inner, seg = 40 }) => {
  const geo = useMemo(() => new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), seg), [JSON.stringify(prof), seg]);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} side={inner ? THREE.FrontSide : THREE.DoubleSide} /></mesh>
      {inner && <mesh geometry={geo}><meshStandardMaterial color={inner} roughness={0.35} metalness={m} side={THREE.BackSide} /></mesh>}
    </group>
  );
};
const OLLA: [number, number][] = [[0, 0], [0.13, 0.005], [0.2, 0.06], [0.23, 0.16], [0.21, 0.26], [0.15, 0.31], [0.14, 0.34], [0.165, 0.36], [0.16, 0.37]];
const OLLA_AL: [number, number][] = [[0, 0], [0.17, 0], [0.18, 0.01], [0.18, 0.24], [0.19, 0.25]];
const PLATO: [number, number][] = [[0, 0], [0.07, 0], [0.085, 0.01], [0.1, 0.015], [0.14, 0.03], [0.155, 0.043], [0.16, 0.047], [0.153, 0.049]];
const BOWL: [number, number][] = [[0, 0], [0.05, 0], [0.06, 0.008], [0.1, 0.03], [0.125, 0.07], [0.13, 0.085], [0.124, 0.087]];
const SARTEN: [number, number][] = [[0, 0], [0.13, 0], [0.16, 0.025], [0.17, 0.045], [0.175, 0.05]];
const CAZ: [number, number][] = [[0, 0], [0.09, 0], [0.12, 0.02], [0.13, 0.05], [0.135, 0.055]];
const VASO: [number, number][] = [[0, 0], [0.03, 0], [0.034, 0.11], [0.036, 0.115]];

// superficie de líquido (sopa, caldo, salsa): disco con ondita lenta
const Liquid: React.FC<{ r: number; t: number; c: string; gloss?: number }> = ({ r, t, c, gloss = 1 }) => {
  const geo = useMemo(() => new THREE.CircleGeometry(r, 48), [r]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), d = Math.hypot(x, y) / r; pos.setZ(i, 0.006 * r * Math.sin(x * 20 / r + t * 0.9) * Math.sin(y * 17 / r - t * 0.7) * (1 - d * d)); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshPhysicalMaterial color={c} roughness={0.25} clearcoat={gloss} clearcoatRoughness={0.15} /></mesh>;
};

// vapor que sube (sprites deterministas)
const Steam: React.FC<{ p: V; t: number; amt: number; tex: THREE.Texture; spread?: number; h?: number; n?: number; size?: number }> = ({ p, t, amt, tex, spread = 0.2, h = 0.7, n = 12, size = 0.25 }) => {
  if (amt <= 0.01) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => {
        const life = 3.2 + rnd(i, 1) * 1.6, ph = ((t + rnd(i, 2) * life) % life) / life;
        const y = ph * h, x = (rnd(i, 3) - 0.5) * spread + Math.sin(t * 0.9 + i) * 0.04 * ph, z = (rnd(i, 4) - 0.5) * spread;
        const s = size * (0.5 + ph * 1.4);
        return <sprite key={i} position={[x, y, z]} scale={[s, s, 1]}><spriteMaterial map={tex} color="#fff6ea" transparent opacity={amt * 0.3 * Math.sin(ph * Math.PI)} depthWrite={false} /></sprite>;
      })}
    </group>
  );
};

// llama de gas azul de una hornalla
const Gas: React.FC<{ p: V; t: number; amt: number }> = ({ p, t, amt }) => amt <= 0.01 ? null : (
  <group position={p}>
    {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * 6.283, fl = 0.8 + 0.2 * Math.sin(t * 17 + i * 2.1); return (
      <mesh key={i} position={[Math.cos(a) * 0.055, 0.012 * fl * amt, Math.sin(a) * 0.055]} rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}>
        <coneGeometry args={[0.007, 0.022 * fl * amt, 6, 1, true]} /><meshBasicMaterial color={i % 3 ? "#2f6cdf" : "#7fb0ff"} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>); })}
  </group>
);

// ---------------- la cena del plato: forma + colores por cena ----------------
export type Dish = { k: "plato" | "bowl" | "sarten" | "tabla" | "cazuela"; c: string; g?: string; liq?: boolean; n?: number };
const DishMesh: React.FC<{ d: Dish; t: number; tx: ReturnType<typeof useTx> }> = ({ d, t, tx }) => {
  const g = d.g ?? "#f0e4c4", n = d.n ?? 3;
  const bits = (rr: number, y: number, col: string, m = 12, sz = 0.012) => Array.from({ length: m }, (_, i) => { const a = rnd(i, 51) * 6.283, dd = Math.sqrt(rnd(i, 52)) * rr; return <mesh key={"b" + i + col} position={[Math.cos(a) * dd, y, Math.sin(a) * dd]} rotation={[0, a, 0]}><boxGeometry args={[sz, sz * 0.5, sz]} /><meshStandardMaterial color={col} roughness={0.7} /></mesh>; });
  if (d.k === "bowl") return <group>
    <Lathe prof={BOWL} p={[0, 0, 0]} c="#f4efe6" r={0.3} inner="#efe9de" />
    <group position={[0, 0.07, 0]}><Liquid r={0.112} t={t} c={d.c} /></group>
    {bits(0.08, 0.075, g, 14, 0.014)}
  </group>;
  if (d.k === "sarten") return <group>
    <Lathe prof={SARTEN} p={[0, 0, 0]} c="#1c1a19" r={0.45} m={0.5} inner="#242120" />
    <mesh position={[0.3, 0.04, 0]} rotation={[0, 0, Math.PI / 2 - 0.1]}><cylinderGeometry args={[0.012, 0.014, 0.24, 8]} /><meshStandardMaterial color="#1c1a19" roughness={0.5} metalness={0.5} /></mesh>
    <group position={[0, 0.03, 0]}>{d.liq ? <Liquid r={0.15} t={t} c={d.c} /> : <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.15, 40]} /><meshStandardMaterial color={d.c} roughness={0.6} /></mesh>}</group>
    {Array.from({ length: n }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.4) * 0.07, 0.04, Math.sin(i * 2.4) * 0.07]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.035, 16, 10]} /><meshPhysicalMaterial color={g} roughness={0.35} clearcoat={0.6} /></mesh>)}
  </group>;
  if (d.k === "cazuela") return <group>
    <Lathe prof={CAZ} p={[0, 0, 0]} c="#9a4a26" r={0.55} inner="#7a3418" />
    <group position={[0, 0.045, 0]}><Liquid r={0.12} t={t} c={d.c} /></group>
    {Array.from({ length: n }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.6) * 0.05, 0.05, Math.sin(i * 2.6) * 0.05]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.03, 16, 10]} /><meshPhysicalMaterial color={g} roughness={0.3} clearcoat={0.7} /></mesh>)}
  </group>;
  if (d.k === "tabla") return <group>
    <Box p={[0, 0.012, 0]} s={[0.34, 0.024, 0.22]} c="#8a5a32" map={tx.madera} r={0.8} rad={0.008} />
    {Array.from({ length: n }, (_, i) => <group key={i} position={[-0.08 + i * 0.16 / Math.max(1, n - 1), 0, 0]} rotation={[0, (i - 0.5) * 0.2, 0]}>
      <Box p={[0, 0.04, 0]} s={[0.13, 0.028, 0.15]} c="#c9934e" r={0.95} rad={0.014} />
      <mesh position={[0, 0.0545, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.11, 0.13]} /><meshPhysicalMaterial color={d.c} roughness={0.35} clearcoat={0.7} transparent opacity={0.88} /></mesh>
    </group>)}
    {bits(0.1, 0.058, g, 18, 0.012)}
  </group>;
  // plato llano con su montoncito (o piezas)
  return <group>
    <Lathe prof={PLATO} p={[0, 0, 0]} c="#f4efe6" r={0.3} inner="#efe9de" />
    {Array.from({ length: n }, (_, i) => <mesh key={i} position={[n === 1 ? 0 : Math.cos(i * 2.1) * 0.05, 0.035 + (n > 3 ? i * 0.006 : 0), n === 1 ? 0 : Math.sin(i * 2.1) * 0.05]} scale={[1, n > 3 ? 0.18 : 0.42, 1]} castShadow><sphereGeometry args={[n === 1 ? 0.085 : 0.055, 20, 12]} /><meshPhysicalMaterial color={d.c} roughness={0.5} clearcoat={0.4} /></mesh>)}
    {bits(0.07, 0.06, g, 14, 0.011)}
  </group>;
};

// ---------------- recetario gigante (páginas a mano en canvas) ----------------
export type Page = { l: string[]; r: string[] };
const useRecetario = (pages: Page[], ready: boolean) => useMemo(() => {
  if (!ready) return [] as THREE.Texture[];
  return pages.flatMap((pg) => [pg.l, pg.r].map((lines, side) => {
    const cv = document.createElement("canvas"); cv.width = 768; cv.height = 1024; const g = cv.getContext("2d")!;
    const gr = g.createLinearGradient(side ? 0 : 768, 0, side ? 768 : 0, 0); gr.addColorStop(0, "#d9c7a0"); gr.addColorStop(0.12, "#efe3c6"); gr.addColorStop(1, "#ead9b4"); g.fillStyle = gr; g.fillRect(0, 0, 768, 1024);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,90,50,${0.04 + rnd(i, 1) * 0.06})`; g.fillRect(rnd(i, 2) * 768, rnd(i, 3) * 1024, 2, 2); }
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(140,95,40,${0.05 + rnd(i, 4) * 0.05})`; g.beginPath(); g.arc(rnd(i, 5) * 768, rnd(i, 6) * 1024, 20 + rnd(i, 7) * 60, 0, 6.3); g.fill(); }
    g.strokeStyle = "rgba(60,90,150,.22)"; g.lineWidth = 2; for (let y = 150; y < 1000; y += 62) { g.beginPath(); g.moveTo(40, y); g.lineTo(728, y); g.stroke(); }
    g.strokeStyle = "rgba(190,60,60,.3)"; g.beginPath(); g.moveTo(side ? 90 : 678, 0); g.lineTo(side ? 90 : 678, 1024); g.stroke();
    let y = 120;
    lines.forEach((ln, k) => {
      const big = ln.startsWith("# "), huge = ln.startsWith("## ");
      const fs = huge ? 200 : big ? 88 : 62;
      y += huge ? 170 : big ? 84 : 66;
      g.fillStyle = huge ? "#8a2a2a" : "#2a2a4a";
      g.font = `700 ${fs}px ${HAND}`;
      g.save(); g.translate(side ? 120 : 64, y); g.rotate(-0.012 + rnd(k, side + 3) * 0.01);
      g.fillText(huge ? ln.slice(3) : big ? ln.slice(2) : ln, 0, 0); g.restore();
      if (huge) y += 20;
    });
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t;
  }));
}, [ready, JSON.stringify(pages)]);
const Leaf: React.FC<{ ang: number; w: number; d: number; front?: Tx; back?: Tx }> = ({ ang, w, d, front, back }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(w, d, 28, 1), [w, d]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = 28, curl = Math.sin(ang) * 1.6;
  let x = 0, yy = 0; const xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= N; k++) { xs.push(x); ys.push(yy); const s = k / N; const phi = ang + curl * s * (1 - s * 0.4); x += Math.cos(phi) * w / N; yy += Math.sin(phi) * w / N; }
  for (let i = 0; i < pos.count; i++) { const k = i % (N + 1), row = Math.floor(i / (N + 1)); pos.setXYZ(i, xs[k], ys[k], row === 0 ? -d / 2 : d / 2); }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return (
    <group>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.FrontSide} color="#e0d6c2" roughness={0.95} map={back} /></mesh>
      <mesh geometry={geo} castShadow><meshStandardMaterial side={THREE.BackSide} color="#e0d6c2" roughness={0.95} map={front} /></mesh>
    </group>
  );
};
const BW = 0.34, BD = 0.46, TH = 0.06;
const Recetario: React.FC<{ p: V; rotY?: number; open: number; flip: number; tex: THREE.Texture[]; cover: string }> = ({ p, rotY = 0, open, flip, tex, cover }) => {
  const fi = Math.floor(flip), fr = flip - fi;
  const L = tex[Math.min(tex.length - 2, fi * 2)], R = tex[Math.min(tex.length - 1, fi * 2 + 1)];
  const nextL = tex[Math.min(tex.length - 2, fi * 2 + 2)], nextR = tex[Math.min(tex.length - 1, fi * 2 + 3)];
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Box p={[BW / 2, TH / 2, 0]} s={[BW, TH, BD]} c="#e8dcbc" r={1} rad={0.004} />
      <Box p={[BW / 2, 0.004, 0]} s={[BW + 0.016, 0.008, BD + 0.016]} c={cover} r={0.9} rad={0.004} />
      <mesh position={[BW / 2, TH + 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial map={fr > 0 && fi * 2 + 3 < tex.length ? nextR : R} roughness={0.95} color="#e0d6c2" /></mesh>
      <group position={[0, TH, 0]} rotation={[0, 0, Math.PI * open]}>
        <Box p={[BW / 2, 0.005, 0]} s={[BW + 0.016, 0.01, BD + 0.016]} c={cover} r={0.9} rad={0.004} />
        {/* cinta y etiqueta de la tapa */}
        <mesh position={[BW / 2, 0.0106, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.62, BD * 0.2]} /><meshStandardMaterial color="#efe3c6" roughness={0.9} /></mesh>
        <mesh position={[BW / 2, -0.001, 0]} rotation={[Math.PI / 2, 0, Math.PI]}><planeGeometry args={[BW * 0.97, BD * 0.97]} /><meshStandardMaterial map={L} roughness={0.95} color="#e0d6c2" side={THREE.DoubleSide} /></mesh>
      </group>
      {fr > 0.001 && open > 0.98 && <group position={[0, TH + 0.002, 0]}><Leaf ang={Math.PI * ease(fr)} w={BW * 0.97} d={BD * 0.97} front={R} back={nextL} /></group>}
      {/* cinta roja de marcador */}
      <mesh position={[0.005, TH + 0.003, BD * 0.3]} rotation={[-Math.PI / 2, 0, 0.1]}><planeGeometry args={[0.012, 0.3]} /><meshStandardMaterial color="#a8242c" roughness={0.7} side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

// ---------------- props del mundo ----------------
export type WorldProps = {
  t: number;
  two?: number;           // 1 = la mesa puesta para dos (la noche de marzo)
  dish?: Dish;            // la cena que está en el plato
  dishIn?: number;        // 0..1 la cena sale de la página y vuela al plato
  dishSteam?: number;
  coins?: number;         // monedas apiladas (de a 10 centavos)
  book?: { open: number; flip: number; pages: Page[]; cover?: string };
  gas?: number[];         // llama de cada hornalla (4)
  ollaSteam?: number;
  lamp?: number;          // lámpara de la mesa (0 apagada .. 1)
  radio?: number;         // la radio encendida
  dusk?: number;          // 0 noche · 1 atardecer (luz por la ventana)
  alacena?: number;       // 0..1 se abre la puerta de la alacena
  hueso?: number;         // 0..1 el hueso envuelto en diario sobre la mesa
  cardigan?: number;      // el chaleco de Antonio en la silla (1 siempre)
  candle?: number;        // vela del final
  top?: number;
};

export const World: React.FC<WorldProps> = (pr) => {
  const { t, two = 0, dish, dishIn = 1, dishSteam = 0.5, coins = 0, gas = [0, 0, 0, 0], ollaSteam = 0.4, lamp = 1, radio = 1, dusk = 0, alacena = 0, hueso = 0, cardigan = 1, candle = 0 } = pr;
  const tx = useTx();
  const [fontOk, setFontOk] = useState(false);
  useMemo(() => { const h = delayRender("letra a mano"); handReady().then(() => { setFontOk(true); requestAnimationFrame(() => continueRender(h)); }).catch(() => { setFontOk(true); continueRender(h); }); }, []);
  const pages = pr.book?.pages ?? [{ l: [""], r: [""] }];
  const bookTex = useRecetario(pages, fontOk);
  const sky = new THREE.Color("#0d1630").lerp(new THREE.Color("#f0a868"), dusk);
  // la cena vuela de la página al plato con un arco
  const dp = v3(PT.pagina).lerp(v3(PT.plato), ease(dishIn)); dp.y += Math.sin(Math.PI * cl(dishIn)) * 0.32;
  const ds = 0.25 + 0.75 * ease(Math.min(1, dishIn * 1.6));

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35} threshold={0.9} exposure={1.0 + 0.1 * dusk} env={0.16 + 0.18 * dusk} />
      <color attach="background" args={["#120c0a"]} />
      <hemisphereLight args={[new THREE.Color("#ffd9b0").lerp(new THREE.Color("#3a4a72"), 1 - dusk).getHex(), 0x2a1a10, 0.35 + 0.25 * dusk]} />
      {/* luna (o sol de la tarde) entrando por la ventana */}
      <directionalLight position={[2.4, 3.2, -6]} intensity={0.55 + 1.8 * dusk} color={dusk > 0.5 ? "#ffc58a" : "#9fb6ff"} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luz de relleno desde donde estaría la pared de adelante (cálida, suave) */}
      <pointLight position={[0.6, 2.4, 2.6]} intensity={2.4} distance={10} decay={1.6} color="#ffd2a0" />
      <pointLight position={[-1.6, 2.2, 1.2]} intensity={1.1} distance={6} decay={1.6} color="#ffd8b0" />
      {/* la lámpara colgada sobre la mesa */}
      <pointLight position={[0, 1.75, -0.2]} intensity={(2.6 + 0.3 * Math.sin(t * 0.4)) * lamp} distance={5} decay={1.4} color="#ffb766" castShadow shadow-bias={-0.0004} shadow-normalBias={0.03} />

      {/* ===== piso y paredes (fondo e izquierda; adelante y techo cortados) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.25]} receiveShadow><planeGeometry args={[6.2, 4.6]} /><meshStandardMaterial map={tx.piso} roughness={0.8} /></mesh>
      {/* corte del piso (canto de la casa de muñecas) */}
      <Box p={[0, -0.093, -0.25]} s={[6.3, 0.18, 4.7]} c="#3a2618" map={tx.madera} r={0.9} rad={0.01} />
      {/* pared del fondo: azulejo abajo, revoque arriba, con el hueco de la ventana */}
      <Box p={[-1.5, 0.7, -2.55]} s={[3.2, 1.4, 0.1]} c="#ffffff" map={tx.azulejo} r={0.35} rad={0.01} />
      <Box p={[1.6, 0.55, -2.55]} s={[3.0, 1.1, 0.1]} c="#ffffff" map={tx.azulejo} r={0.35} rad={0.01} />
      <Box p={[-1.5, 2.1, -2.55]} s={[3.2, 1.4, 0.1]} c="#efe3cc" map={tx.revoque} r={1} rad={0.01} />
      <Box p={[0.6, 2.45, -2.55]} s={[1.0, 0.7, 0.1]} c="#efe3cc" map={tx.revoque} r={1} rad={0.01} />
      <Box p={[2.55, 2.0, -2.55]} s={[1.1, 1.8, 0.1]} c="#efe3cc" map={tx.revoque} r={1} rad={0.01} />
      <Box p={[1.55, 2.6, -2.55]} s={[0.9, 0.4, 0.1]} c="#efe3cc" map={tx.revoque} r={1} rad={0.01} />
      {/* ventana: marco, noche afuera con luna, cortina de encaje */}
      <mesh position={[1.55, 1.75, -2.62]}><planeGeometry args={[0.95, 1.0]} /><meshBasicMaterial map={tx.noche} color={sky} toneMapped={false} /></mesh>
      <sprite position={[1.8, 2.05, -2.6]} scale={[0.22, 0.22, 1]}><spriteMaterial map={tx.dot} color="#fff4d6" transparent opacity={0.9 * (1 - dusk)} toneMapped={false} /></sprite>
      {[[1.1, 1.75, 0.06, 1.0], [2.0, 1.75, 0.06, 1.0], [1.55, 2.27, 0.96, 0.06], [1.55, 1.23, 1.0, 0.06], [1.55, 1.75, 0.03, 1.0]].map(([x, y, w, h], i) => <Box key={"vm" + i} p={[x, y, -2.53]} s={[w, h, 0.07]} c="#e8e2d6" r={0.6} rad={0.008} />)}
      <Box p={[1.55, 1.18, -2.45]} s={[1.1, 0.05, 0.22]} c="#e8e2d6" r={0.6} rad={0.01} />
      {[-1, 1].map((sg) => <mesh key={"cort" + sg} position={[1.55 + sg * 0.3, 1.78, -2.47]} rotation={[0, sg * 0.04 * Math.sin(t * 0.5), 0]}><planeGeometry args={[0.42, 1.05, 12, 1]} /><meshStandardMaterial map={tx.encaje} transparent alphaTest={0.2} side={THREE.DoubleSide} roughness={0.9} color="#fffaf0" /></mesh>)}
      {/* la radio de baquelita sobre el alféizar */}
      <group position={PT.radio}>
        <Box p={[0, 0.09, 0]} s={[0.3, 0.18, 0.13]} c="#5a2e14" r={0.25} rad={0.03} />
        <mesh position={[-0.06, 0.1, 0.067]}><circleGeometry args={[0.05, 24]} /><meshBasicMaterial color={new THREE.Color("#3a2a1a").lerp(new THREE.Color("#ffcf7a"), radio)} toneMapped={false} /></mesh>
        {[0, 1, 2, 3].map((k) => <Box key={k} p={[0.07, 0.05 + k * 0.03, 0.066]} s={[0.1, 0.01, 0.004]} c="#2a160a" rad={0.002} />)}
      </group>
      {/* pared izquierda */}
      <Box p={[-3.05, 0.7, -0.25]} s={[0.1, 1.4, 4.6]} c="#ffffff" map={tx.azulejo} r={0.35} rad={0.01} />
      <Box p={[-3.05, 2.1, -0.25]} s={[0.1, 1.4, 4.6]} c="#efe3cc" map={tx.revoque} r={1} rad={0.01} />
      {/* repisa con platos y el reloj de pared */}
      <Box p={[0.2, 1.75, -2.43]} s={[1.0, 0.04, 0.18]} c="#5a3a22" map={tx.madera} r={0.9} />
      {[0, 1, 2, 3].map((k) => <mesh key={"rp" + k} position={[-0.15 + k * 0.23, 1.88, -2.46]} rotation={[0.25, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.012, 32]} /><meshStandardMaterial color={k % 2 ? "#f4efe6" : "#d7e2f0"} roughness={0.3} /></mesh>)}
      <group position={[-0.6, 2.35, -2.49]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.04, 40]} /><meshStandardMaterial color="#5a3a22" roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.14, 40]} /><meshStandardMaterial color="#f3ead6" roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.025]} rotation={[0, 0, -t * 0.01]}><planeGeometry args={[0.012, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 0, 0.026]} rotation={[0, 0, -0.9]}><planeGeometry args={[0.016, 0.13]} /><meshStandardMaterial color="#222" /></mesh>
      </group>
      {/* la foto de Antonio en su marco (de espaldas, con su gorra) */}
      <group position={[-3.0, 1.75, 0.6]} rotation={[0, Math.PI / 2, 0]}>
        <Box p={[0, 0, 0]} s={[0.3, 0.38, 0.02]} c="#3a2414" r={0.5} rad={0.006} />
        <mesh position={[0, 0, 0.012]}><planeGeometry args={[0.24, 0.31]} /><meshStandardMaterial color="#b8a27a" roughness={0.8} /></mesh>
        <mesh position={[0, -0.04, 0.013]}><circleGeometry args={[0.06, 20]} /><meshStandardMaterial color="#6a5638" roughness={0.9} /></mesh>
      </group>

      {/* ===== la ESTUFA negra esmaltada con sus 4 hornallas ===== */}
      <group position={[-1.7, 0, -2.15]}>
        <Box p={[0, 0.45, 0]} s={[0.95, 0.9, 0.66]} c="#141313" r={0.2} m={0.2} rad={0.04} />
        <Box p={[0, 0.36, 0.335]} s={[0.7, 0.42, 0.02]} c="#1d1c1c" r={0.15} m={0.3} rad={0.01} />
        <mesh position={[0, 0.6, 0.36]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.6, 10]} /><meshStandardMaterial color="#c9c9c9" metalness={0.9} roughness={0.2} /></mesh>
        {[-0.3, -0.15, 0.15, 0.3].map((x, i) => <mesh key={"pr" + i} position={[x, 0.8, 0.345]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.03, 16]} /><meshStandardMaterial color="#e8e4dc" roughness={0.3} /></mesh>)}
        <Box p={[0, 0.91, 0]} s={[0.95, 0.02, 0.66]} c="#0f0f0f" r={0.3} m={0.3} rad={0.005} />
        {[[-0.22, -0.13], [0.22, -0.13], [-0.22, 0.15], [0.22, 0.15]].map(([x, z], i) => <group key={"h" + i} position={[x, 0.93, z]}>
          {[0, 1, 2, 3].map((k) => <mesh key={k} rotation={[0, k * Math.PI / 4, 0]} position={[0, 0.012, 0]}><boxGeometry args={[0.24, 0.015, 0.015]} /><meshStandardMaterial color="#2a2827" roughness={0.6} metalness={0.4} /></mesh>)}
          <mesh><cylinderGeometry args={[0.06, 0.06, 0.012, 24]} /><meshStandardMaterial color="#3a3836" metalness={0.5} roughness={0.5} /></mesh>
          <Gas p={[0, 0.008, 0]} t={t + i} amt={gas[i] ?? 0} />
        </group>)}
        {/* la olla de barro en la hornalla de atrás (el caldo) y la ollita de aluminio abollada */}
        <Lathe prof={OLLA} p={[0.22, 0.95, -0.13]} c="#9a4a26" r={0.75} s={0.8} />
        <Lathe prof={OLLA_AL} p={[-0.22, 0.95, -0.13]} c="#b9bcbf" r={0.35} m={0.7} s={0.75} inner="#8c8f92" />
        <Steam p={[0.22, 1.25, -0.13]} t={t} amt={ollaSteam} tex={tx.steam} spread={0.15} h={0.8} n={10} size={0.24} />
        <Lathe prof={SARTEN} p={[-0.22, 0.95, 0.15]} c="#1c1a19" r={0.45} m={0.5} inner="#242120" />
      </group>
      {/* mesada con la tabla y el pan duro, al lado de la estufa */}
      <Box p={[-0.5, 0.45, -2.2]} s={[1.3, 0.9, 0.6]} c="#e9e3d6" r={0.6} rad={0.02} />
      <Box p={[-0.5, 0.915, -2.2]} s={[1.34, 0.03, 0.64]} c="#5a3a22" map={tx.madera} r={0.7} rad={0.008} />
      <Box p={[-0.35, 0.945, -2.15]} s={[0.36, 0.025, 0.24]} c="#9a6a3a" map={tx.madera} r={0.8} rad={0.008} />
      <mesh position={[-0.35, 0.99, -2.15]} rotation={[0, 0.4, Math.PI / 2]} scale={[1, 1, 0.8]} castShadow><capsuleGeometry args={[0.05, 0.18, 6, 12]} /><meshStandardMaterial color="#b98a4a" roughness={0.9} /></mesh>
      {Array.from({ length: 4 }, (_, i) => <mesh key={"aj" + i} position={[-0.75 + i * 0.04, 0.95, -2.05]} scale={[1, 0.8, 1.2]}><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial color="#f1e8d8" roughness={0.7} /></mesh>)}
      {[0, 1].map((k) => <Lathe key={"fr" + k} prof={VASO} p={[-0.95 + k * 0.1, 0.93, -2.35]} c={k ? "#c27a3a" : "#8a9a5a"} r={0.15} s={1.4} />)}

      {/* ===== la ALACENA de madera (pared izquierda) con la puerta que se abre ===== */}
      <pointLight position={[-2.1, 1.6, -0.35]} intensity={0.25 + 1.1 * alacena} distance={2.6} decay={2} color="#ffd9a0" />
      <group position={[-2.82, 0, -0.6]}>
        <Box p={[-0.19, 1.0, 0]} s={[0.04, 2.0, 1.0]} c="#5a3c22" map={tx.madera} r={0.85} />
        {[-0.49, 0.49].map((z) => <Box key={"lc" + z} p={[0, 1.0, z]} s={[0.42, 2.0, 0.02]} c="#6b4a2c" map={tx.madera} r={0.85} />)}
        {[0.01, 1.99].map((y) => <Box key={"tb" + y} p={[0, y, 0]} s={[0.42, 0.02, 1.0]} c="#6b4a2c" map={tx.madera} r={0.85} />)}
        <pointLight position={[0.12, 1.3, 0]} intensity={0.5 * alacena} distance={0.9} decay={2} color="#ffd9a0" />
        {[0.55, 1.0, 1.45].map((y) => <Box key={y} p={[0.1, y, 0]} s={[0.36, 0.025, 0.92]} c="#7a5634" map={tx.madera} r={0.85} rad={0.005} />)}
        {/* lo que hay: pan duro, ajos, un huevo, frascos, una lata */}
        <mesh position={[0.15, 1.06, -0.2]} rotation={[0, 0.3, Math.PI / 2]} castShadow><capsuleGeometry args={[0.045, 0.15, 6, 10]} /><meshStandardMaterial color="#b98a4a" roughness={0.9} /></mesh>
        {[0, 1, 2].map((k) => <mesh key={"ja" + k} position={[0.15, 1.03, 0.08 + k * 0.035]} scale={[1, 0.8, 1.2]}><sphereGeometry args={[0.017, 10, 8]} /><meshStandardMaterial color="#f1e8d8" roughness={0.7} /></mesh>)}
        <mesh position={[0.15, 1.045, 0.28]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.028, 14, 10]} /><meshStandardMaterial color="#c99a68" roughness={0.6} /></mesh>
        {[0, 1, 2, 3].map((k) => <Lathe key={"fa" + k} prof={VASO} p={[0.14, 1.475, -0.33 + k * 0.2]} c={["#d8c27a", "#a8642a", "#e8e0c8", "#6a7a3a"][k]} r={0.2} s={1.5} />)}
        <mesh position={[0.15, 0.64, 0.2]}><cylinderGeometry args={[0.06, 0.06, 0.14, 20]} /><meshStandardMaterial color="#9a2a2a" metalness={0.5} roughness={0.4} /></mesh>
        {/* puertas (bisagra al costado) */}
        {[-1, 1].map((sg) => <group key={"pu" + sg} position={[0.215, 1.0, sg * 0.5]} rotation={[0, -sg * alacena * 1.7, 0]}>
          <Box p={[0, 0, -sg * 0.245]} s={[0.025, 1.9, 0.48]} c="#6b4a2c" map={tx.madera} r={0.85} rad={0.008} />
          <mesh position={[0.016, 0.0, -sg * 0.42]}><sphereGeometry args={[0.016, 10, 8]} /><meshStandardMaterial color="#c9a23a" metalness={0.8} roughness={0.3} /></mesh>
        </group>)}
      </group>

      {/* ===== LA MESITA ===== */}
      <group>
        <Box p={[PT.mesa[0], TY - 0.025, PT.mesa[2]]} s={[1.5, 0.05, 0.95]} c="#5a3a22" map={tx.madera} r={0.8} />
        {[[-0.68, -0.4], [0.68, -0.4], [-0.68, 0.4], [0.68, 0.4]].map(([x, z]) => <Box key={x + "" + z} p={[x, (TY - 0.05) / 2, PT.mesa[2] + z]} s={[0.06, TY - 0.05, 0.06]} c="#4a2e1a" map={tx.madera} />)}
        <mesh position={[0, TY + 0.002, PT.mesa[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.42, 0.88]} /><meshStandardMaterial map={tx.mantel} roughness={0.95} /></mesh>
        {/* sillas: la de Rosa (adelante) y la de Antonio (enfrente, con su chaleco gris) */}
        {[[0.35, 0], [-0.95, Math.PI]].map(([z, ry], i) => <group key={"si" + i} position={[-0.3, 0, z as number]} rotation={[0, ry as number, 0]}>
          <Box p={[0, 0.46, 0]} s={[0.44, 0.04, 0.42]} c="#6b4a2c" map={tx.madera} r={0.8} />
          {[[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]].map(([x, zz]) => <Box key={x + "" + zz} p={[x, 0.23, zz]} s={[0.035, 0.46, 0.035]} c="#4a2e1a" map={tx.madera} />)}
          {[-0.19, 0.19].map((x) => <Box key={"re" + x} p={[x, 0.75, 0.19]} s={[0.035, 0.6, 0.035]} c="#4a2e1a" map={tx.madera} />)}
          {[0.68, 0.88, 1.02].map((y) => <Box key={"tr" + y} p={[0, y, 0.19]} s={[0.4, 0.05, 0.025]} c="#5a3a22" map={tx.madera} />)}
          {i === 1 && cardigan > 0.01 && <group position={[0, 0.84, 0.14]}>
            <mesh position={[0, 0, 0]} scale={[1, 1, 0.25]}><boxGeometry args={[0.46, 0.34, 0.12]} /><meshStandardMaterial map={tx.lana} color="#8a857c" roughness={1} /></mesh>
            {[-1, 1].map((sg) => <mesh key={sg} position={[sg * 0.2, -0.22, 0.02]} rotation={[0, 0, sg * 0.08]}><cylinderGeometry args={[0.045, 0.05, 0.42, 10]} /><meshStandardMaterial map={tx.lana} color="#8a857c" roughness={1} /></mesh>)}
            {[0, 1, 2].map((k) => <mesh key={"bt" + k} position={[0.02, 0.1 - k * 0.1, 0.035]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#3a2a1a" /></mesh>)}
          </group>}
        </group>)}
        {/* el plato de Rosa: servilleta de tela, cuchara, vaso */}
        <mesh position={[PT.plato[0] - 0.24, TY + 0.004, PT.plato[2]]} rotation={[-Math.PI / 2, 0, 0.1]}><planeGeometry args={[0.12, 0.26]} /><meshStandardMaterial color="#d7e2f0" roughness={0.9} /></mesh>
        <mesh position={[PT.plato[0] + 0.22, TY + 0.008, PT.plato[2] + 0.02]} rotation={[-Math.PI / 2, 0, 0.05]}><planeGeometry args={[0.025, 0.2]} /><meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} /></mesh>
        <Lathe prof={VASO} p={[PT.plato[0] + 0.15, TY, PT.plato[2] - 0.2]} c="#e8f0f2" r={0.05} />
        {/* plato vacío de Rosa debajo de la cena */}
        {!dish && <Lathe prof={PLATO} p={PT.plato} c="#f4efe6" r={0.3} inner="#efe9de" />}
        {/* la mesa puesta para dos (la noche de marzo) */}
        {two > 0.01 && <group scale={Math.min(1, two)}>
          <Lathe prof={PLATO} p={PT.plato2} c="#f4efe6" r={0.3} inner="#efe9de" />
          <mesh position={[PT.plato2[0] + 0.24, TY + 0.004, PT.plato2[2]]} rotation={[-Math.PI / 2, 0, 0.1]}><planeGeometry args={[0.12, 0.26]} /><meshStandardMaterial color="#d7e2f0" roughness={0.9} /></mesh>
          <Lathe prof={VASO} p={[PT.plato2[0] - 0.15, TY, PT.plato2[2] + 0.2]} c="#e8f0f2" r={0.05} />
        </group>}
        {/* la cena que sale de la página y aterriza en el plato */}
        {dish && <group position={[dp.x, dp.y, dp.z]} scale={ds}><DishMesh d={dish} t={t} tx={tx} /></group>}
        {dish && <Steam p={[dp.x, dp.y + 0.06, dp.z]} t={t} amt={dishSteam * cl(dishIn * 2 - 1)} tex={tx.steam} spread={0.12} h={0.55} n={10} size={0.16} />}
        {/* monedas: lo que cuesta, de a 10 centavos */}
        {Array.from({ length: Math.ceil(coins) }, (_, i) => { const k = Math.min(1, coins - i); const col = i % 4 === 3 ? "#c9a23a" : "#b8b8b4"; return (
          <mesh key={"mo" + i} position={[PT.monedas[0] + (i >= 5 ? 0.06 : 0), TY + 0.006 + (i % 5) * 0.009 + (1 - k) * 0.25, PT.monedas[2] + (i >= 5 ? -0.03 : 0)]} rotation={[0, i, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.008, 28]} /><meshStandardMaterial color={col} metalness={0.85} roughness={0.3} transparent opacity={k} /></mesh>); })}
        {/* el hueso envuelto en papel de diario (la número uno) */}
        {hueso > 0.01 && <group position={[0.05, TY + 0.01, 0.12]} scale={Math.min(1, hueso * 1.3)}>
          <mesh rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[0.42, 0.32]} /><meshStandardMaterial map={tx.diario} roughness={1} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.035, 0]} rotation={[0, 0.3, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.2, 14]} /><meshStandardMaterial color="#efe2c6" roughness={0.6} /></mesh>
          {[-1, 1].map((sg) => <mesh key={sg} position={[Math.cos(0.3) * sg * 0.1, 0.035, -Math.sin(0.3) * sg * 0.1]}><sphereGeometry args={[0.045, 14, 10]} /><meshStandardMaterial color="#e8d6b4" roughness={0.6} /></mesh>)}
        </group>}
        {/* vela del final */}
        {candle > 0.01 && <group position={[-0.05, TY, -0.35]}>
          <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.022, 0.022, 0.14, 16]} /><meshStandardMaterial color="#f3ead6" roughness={0.6} /></mesh>
          <sprite position={[0, 0.16, 0]} scale={[0.07 * candle, 0.1 * candle, 1]}><spriteMaterial map={tx.dot} color="#ffbf5a" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></sprite>
          <pointLight position={[0, 0.2, 0]} intensity={0.8 * candle * (0.9 + 0.1 * Math.sin(t * 9))} distance={2} decay={2} color="#ffb050" />
        </group>}
      </group>

      {/* el recetario gigante */}
      {bookTex.length >= 2 && <Recetario p={PT.libro} rotY={0} open={pr.book?.open ?? 0} flip={pr.book?.flip ?? 0} tex={bookTex} cover={pr.book?.cover ?? "#2f4f7a"} />}

      {/* la lámpara colgada sobre la mesa */}
      <group visible={(pr.top ?? 0) < 0.5} position={[0, 1.8, -0.2]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.005, 0.005, 1.0, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <Lathe prof={[[0.02, 0.12], [0.06, 0.1], [0.16, 0.0], [0.17, -0.01]]} p={[0, 0, 0]} c="#2f5f4a" r={0.4} m={0.2} />
        <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.04, 12, 10]} /><meshBasicMaterial color={new THREE.Color("#3a2a1a").lerp(new THREE.Color("#ffd9a0"), lamp)} toneMapped={false} /></mesh>
      </group>
    </ThreeCanvas>
  );
};
