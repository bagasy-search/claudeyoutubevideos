// ojos · EL MUNDO: el lavabo de Reiko en Osaka, de noche. Mesada de madera clara contra pared de revoque, espejo redondo,
// la LÁMPARA de pantalla de papel (la única luz cálida), EL FRASCO ÁMBAR con gotero, la toallita doblada, la taza y los discos
// de algodón. La gota se arma en la punta del gotero y cae. Lejos, sobre negro: EL BLOQUE DE PIEL en corte
// (debajo del ojo = fina · mejilla = gruesa), el aceite que se extiende en una película y la humedad que se escapa.
// UNA escena y UNA cámara para todo el video; los eventos se clavan a la voz desde Main. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export type V = [number, number, number];

// ---------------- medidas (metros) ----------------
const TOP = 0.86;                       // mesada
const BOT = { x: 0.06, z: -0.16, R: 0.024, Hc: 0.072 }; // frasquito de 30 ml
const PIEL = [20, 1.0, 0] as V;         // escenario del bloque de piel
export const PT = {
  mesada: [0, TOP, -0.15] as V,
  frasco: [BOT.x, TOP + 0.05, BOT.z] as V,
  punta: [BOT.x, TOP + 0.21, BOT.z] as V,   // punta del gotero cuando está alzado
  lampara: [-0.42, TOP + 0.2, -0.3] as V,
  espejo: [0.05, 1.5, -0.47] as V,
  toalla: [0.34, TOP + 0.03, -0.2] as V,
  taza: [-0.2, TOP + 0.04, -0.12] as V,
  algodon: [0.22, TOP + 0.01, -0.02] as V,
  piel: PIEL,
  pielFina: [PIEL[0] - 0.36, PIEL[1] + 0.06, PIEL[2]] as V,
  pielGruesa: [PIEL[0] + 0.36, PIEL[1] + 0.2, PIEL[2]] as V,
};

// ---------------- CÁMARA (keyframes globales) + mano virtual ----------------
export type Key = { t: number; p: V; l: V; fov?: number; arc?: number };
let KEYS: Key[] = [];
export const setKeys = (k: Key[]) => { KEYS = [...KEYS.filter((x) => !k.some((y) => Math.abs(y.t - x.t) < 1e-6)), ...k].sort((a, b) => a.t - b.t); };
export const camAt = (t: number) => {
  if (!KEYS.length) return { p: v3([0.1, TOP + 0.3, 0.55]), l: v3([0.05, TOP + 0.1, -0.2]), fov: 34 };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc;
  // CamaraMano en 3D: el balanceo lento de alguien que sostiene la cámara (giro sobre el punto mirado, poco desplazamiento)
  const m = manoCam(t, 1, 7), d = p.distanceTo(l);
  const dir = l.clone().sub(p).normalize(), right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  l.addScaledVector(right, Math.tan((m.pan * Math.PI) / 180) * d).y += Math.tan((m.tilt * Math.PI) / 180) * d;
  return { p, l, fov: lerp(a.fov ?? 34, b.fov ?? 34, k), roll: (m.roll * Math.PI) / 180 };
};
type CamS = { p: THREE.Vector3; l: THREE.Vector3; fov: number; roll?: number };
const mkCam = (cm: CamS) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l);
  if (cm.roll) cam.rotateZ(cm.roll);
  cam.updateMatrixWorld(); cam.updateProjectionMatrix(); return cam;
};
export const project = (cm: CamS, q: THREE.Vector3) => { const v = q.clone().project(mkCam(cm)); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H }; };
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
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); if (k.roll) cm.rotateZ(k.roll);
  cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas procedurales ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTx = () => useMemo(() => ({
  // madera clara de hinoki, veta larga y un par de marcas de agua viejas
  madera: mk(1024, 512, (g) => {
    g.fillStyle = "#cdb48c"; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 260; i++) { const y = rnd(i, 1) * 512, v = rnd(i, 2); g.strokeStyle = `rgba(${120 + v * 40},${85 + v * 30},${45 + v * 20},${0.08 + rnd(i, 3) * 0.16})`; g.lineWidth = 0.6 + rnd(i, 4) * 2.4; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(300, y + (rnd(i, 5) - 0.5) * 14, 700, y + (rnd(i, 6) - 0.5) * 14, 1024, y + (rnd(i, 7) - 0.5) * 6); g.stroke(); }
  }, [3, 1]),
  // revoque cálido con manchitas, pared de un departamento viejo de Osaka
  revoque: mk(512, 512, (g) => {
    g.fillStyle = "#d9cfbf"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { const v = 180 + rnd(i, 1) * 60; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.25)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
    for (let i = 0; i < 40; i++) { const x = rnd(i, 4) * 512, y = rnd(i, 5) * 512, r = 30 + rnd(i, 6) * 90; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(150,130,100,.07)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  }, [3, 2]),
  // papel washi de la pantalla de la lámpara: fibras
  washi: mk(512, 512, (g) => {
    g.fillStyle = "#f3e6c8"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 500; i++) { g.strokeStyle = `rgba(190,160,110,${0.1 + rnd(i, 1) * 0.2})`; g.lineWidth = 0.5 + rnd(i, 2); g.beginPath(); const x = rnd(i, 3) * 512, y = rnd(i, 4) * 512, a = rnd(i, 5) * 6.3, l = 10 + rnd(i, 6) * 40; g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 1) * l * 0.5, y + Math.sin(a + 1) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    for (let x = 0; x < 512; x += 64) { g.fillStyle = "rgba(120,90,50,.25)"; g.fillRect(x, 0, 3, 512); } // varillas de bambú
  }),
  // toalla de rizo
  rizo: mk(256, 256, (g) => { g.fillStyle = "#f1eee8"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 4000; i++) { const v = 205 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v},${v},${v - 6},.8)`; g.beginPath(); g.arc(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 1.4, 0, 6.3); g.fill(); } }, [2, 2]),
  // superficie de piel: poros y micro-líneas (la del ojo, más fina y con más líneas)
  piel: (lineas: number) => mk(512, 512, (g) => {
    // piel de verdad: tono con manchitas suaves, poros y la red de surcos cortos en rombos (no líneas largas: parecían tablas)
    g.fillStyle = "#e4b19a"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40; i++) { const x = rnd(i, 11) * 512, y = rnd(i, 12) * 512, r = 30 + rnd(i, 13) * 70, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rnd(i, 14) > 0.5 ? "214,140,120" : "240,200,180"},.35)`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512); }
    const n = 900 + lineas * 60;
    for (let i = 0; i < n; i++) { const a = [0, 1.05, 2.1][i % 3] + (rnd(i, 15) - 0.5) * 0.3, L = 8 + rnd(i, 16) * (lineas > 10 ? 34 : 18), x = rnd(i, 17) * 512, y = rnd(i, 18) * 512;
      g.strokeStyle = `rgba(150,88,70,${0.1 + rnd(i, 19) * 0.16})`; g.lineWidth = 0.6 + rnd(i, 20) * 0.9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(140,82,64,${0.12 + rnd(i, 1) * 0.16})`; g.beginPath(); g.arc(rnd(i, 2) * 512, rnd(i, 3) * 512, 0.7 + rnd(i, 4) * 1.3, 0, 6.3); g.fill(); }
  }, [1, 1]),
  // corte: capas (epidermis rosada fina, dermis con fibras, grasa amarilla en celdas)
  corte: mk(512, 512, (g) => {
    g.fillStyle = "#e8b2a0"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) { const y0 = rnd(i, 4) * 512, a = 6 + rnd(i, 5) * 10, ph = rnd(i, 6) * 6; g.strokeStyle = `rgba(255,${222 + rnd(i, 1) * 20},${210 + rnd(i, 2) * 20},${0.35 + rnd(i, 3) * 0.35})`; g.lineWidth = 3 + rnd(i, 7) * 5; g.beginPath(); for (let x = -10; x <= 522; x += 8) { const y = y0 + Math.sin(x * 0.03 + ph) * a; x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    for (let i = 0; i < 7; i++) { g.strokeStyle = "rgba(180,40,40,.55)"; g.lineWidth = 2.5; g.beginPath(); let x = rnd(i, 8) * 512, y = 512; g.moveTo(x, y); for (let k = 0; k < 12; k++) { x += (rnd(i * 13 + k, 9) - 0.5) * 50; y -= 30 + rnd(i * 7 + k, 10) * 20; g.lineTo(x, y); } g.stroke(); }
  }),
  grasa: mk(256, 256, (g) => {
    g.fillStyle = "#e9c77a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { const x = rnd(i, 1) * 256, y = rnd(i, 2) * 256, r = 10 + rnd(i, 3) * 14; g.fillStyle = `rgba(255,236,170,${0.5 + rnd(i, 4) * 0.4})`; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill(); g.strokeStyle = "rgba(180,130,60,.5)"; g.lineWidth = 1.5; g.stroke(); }
  }, [2, 1]),
  dot: mk(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  vapor: mk(128, 128, (g) => { for (let i = 0; i < 24; i++) { const x = 64 + (rnd(i, 1) - 0.5) * 60, y = 64 + (rnd(i, 2) - 0.5) * 60, r = 18 + rnd(i, 3) * 26; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(255,255,255,.2)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); } }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; map?: Tx; rad?: number; rot?: V; e?: string; ei?: number; o?: number }> = ({ p, s, c, r = 0.8, m = 0, map, rad = 0.004, rot, e, ei = 0, o = 1 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o < 1} opacity={o} /></mesh>
);
const Cyl: React.FC<{ p: V; r1: number; r2?: number; h: number; c: string; r?: number; m?: number; seg?: number; rot?: V; e?: string; ei?: number; map?: Tx; o?: number; open?: boolean }> = ({ p, r1, r2, h, c, r = 0.6, m = 0, seg = 32, rot, e, ei = 0, map, o = 1, open }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r1, r2 ?? r1, h, seg, 1, open]} /><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} side={open ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
);

// perfil del frasquito boston de vidrio ámbar (torno)
const frascoGeo = () => {
  const { R, Hc } = BOT, pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0, 0), new THREE.Vector2(R - 0.003, 0), new THREE.Vector2(R, 0.003));
  pts.push(new THREE.Vector2(R, Hc * 0.62));
  for (let i = 1; i <= 10; i++) { const a = (i / 10) * (Math.PI / 2); pts.push(new THREE.Vector2(0.009 + (R - 0.009) * Math.cos(a), Hc * 0.62 + (Hc * 0.3) * Math.sin(a))); }
  pts.push(new THREE.Vector2(0.009, Hc), new THREE.Vector2(0.0095, Hc + 0.008));
  return new THREE.LatheGeometry(pts, 48);
};
const aceiteGeo = (lvl: number) => {
  const { R, Hc } = BOT, h = Hc * 0.6 * lvl, pts = [new THREE.Vector2(0, 0.002), new THREE.Vector2(R - 0.0025, 0.002), new THREE.Vector2(R - 0.0025, h), new THREE.Vector2(0, h)];
  return new THREE.LatheGeometry(pts, 40);
};

// EL FRASCO: vidrio ámbar con transmisión, aceite dorado adentro, gotero de goma negra.
// lift 0..1 = el gotero sale del frasco y queda arriba · glow = la lámpara lo atraviesa (resalto)
const Frasco: React.FC<{ lift: number; lvl: number; glow: number }> = ({ lift, lvl, glow }) => {
  const g = useMemo(frascoGeo, []), a = useMemo(() => aceiteGeo(lvl), [Math.round(lvl * 20)]);
  const up = sm(lift) * 0.13, tilt = sm(lift) * 0.12;
  return <group position={[BOT.x, TOP, BOT.z]}>
    <mesh geometry={g} castShadow receiveShadow userData={{ noAO: true }}><meshPhysicalMaterial color="#9a4a10" roughness={0.06} metalness={0} transmission={0.72} thickness={0.01} ior={1.5} attenuationColor="#6a2a04" attenuationDistance={0.03} transparent opacity={0.92} emissive="#ff9a3a" emissiveIntensity={0.25 * glow} /></mesh>
    <mesh geometry={a} userData={{ noAO: true }}><meshPhysicalMaterial color="#e8a83a" roughness={0.1} transmission={0.4} thickness={0.02} emissive="#ffb54a" emissiveIntensity={0.18 + 0.4 * glow} transparent opacity={0.9} /></mesh>
    {/* rosca + gotero */}
    <group position={[0, BOT.Hc + 0.008 + up, 0]} rotation={[0, 0, tilt]}>
      <Cyl p={[0, 0.006, 0]} r1={0.0125} h={0.014} c="#141414" r={0.45} />
      <mesh position={[0, 0.03, 0]} scale={[1, 1.5, 1]} castShadow><sphereGeometry args={[0.0105, 24, 16]} /><meshStandardMaterial color="#1b1b1b" roughness={0.55} /></mesh>
      {lift > 0.02 && <mesh position={[0, -0.045, 0]} userData={{ noAO: true }}><cylinderGeometry args={[0.0032, 0.0016, 0.09, 16, 1, true]} /><meshPhysicalMaterial color="#f4e2b8" roughness={0.05} transmission={0.85} thickness={0.002} transparent opacity={0.6} side={THREE.DoubleSide} /></mesh>}
      {lift > 0.02 && <mesh position={[0, -0.06, 0]} userData={{ noAO: true }}><cylinderGeometry args={[0.0022, 0.0013, 0.06, 12]} /><meshStandardMaterial color="#e6a030" emissive="#ffb040" emissiveIntensity={0.3} roughness={0.15} /></mesh>}
    </group>
  </group>;
};

// LA GOTA: se hincha en la punta (form 0..1) y cae (fall 0..1) hasta la mesada; al tocar, se abre en un charquito
const Gota: React.FC<{ form: number; fall: number }> = ({ form, fall }) => {
  if (form <= 0.01) return null;
  const tip = PT.punta, f = sm(fall), y = tip[1] - 0.004 - f * f * (tip[1] - TOP - 0.004);
  const r = 0.0035 * Math.min(1, form * 1.2), st = 1 + (1 - form) * 0.4 + f * 0.25;
  const splash = fall > 0.98 ? sm((fall - 0.98) / 0.02) : 0;
  return <group>
    {splash < 1 && <mesh position={[tip[0] + Math.sin(0.12) * 0.13, y, tip[2]]} scale={[1, st, 1]} userData={{ noAO: true }}><sphereGeometry args={[r, 24, 16]} /><meshPhysicalMaterial color="#f0b040" roughness={0.02} transmission={0.6} thickness={0.004} ior={1.47} emissive="#ffb84a" emissiveIntensity={0.35} /></mesh>}
    {splash > 0 && <mesh position={[tip[0] + Math.sin(0.12) * 0.13, TOP + 0.0006, tip[2]]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noAO: true }}><circleGeometry args={[0.006 * splash, 24]} /><meshPhysicalMaterial color="#e8a838" roughness={0.03} transmission={0.4} transparent opacity={0.85} emissive="#ffb040" emissiveIntensity={0.2} /></mesh>}
  </group>;
};

// LÁMPARA de pantalla de papel: cilindro de washi que se enciende; la luz sale de adentro
const Lampara: React.FC<{ on: number; tx: THREE.Texture; t: number }> = ({ on, tx, t }) => {
  const fl = 1 + 0.015 * Math.sin(t * 7.3) + 0.01 * Math.sin(t * 13.1);
  return <group position={[PT.lampara[0], TOP, PT.lampara[2]]}>
    <Cyl p={[0, 0.012, 0]} r1={0.05} r2={0.055} h={0.024} c="#3a2a1c" r={0.5} />
    <Cyl p={[0, 0.07, 0]} r1={0.006} h={0.1} c="#2a1e14" r={0.4} m={0.3} />
    <mesh position={[0, 0.2, 0]} userData={{ noAO: true }}><cylinderGeometry args={[0.085, 0.1, 0.17, 40, 1, true]} /><meshStandardMaterial map={tx} color="#ffffff" roughness={0.9} emissive="#ffc27a" emissiveMap={tx} emissiveIntensity={0.55 * on * fl} side={THREE.DoubleSide} transparent opacity={0.97} /></mesh>
    <pointLight position={[0, 0.2, 0]} intensity={1.6 * on * fl} distance={2.4} decay={1.7} color="#ffb766" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0004} />
  </group>;
};

// TOALLA tibia doblada con vapor
const Toalla: React.FC<{ t: number; steam: number; tx: ReturnType<typeof useTx> }> = ({ t, steam, tx }) => (
  <group position={[PT.toalla[0], TOP, PT.toalla[2]]} rotation={[0, -0.25, 0]}>
    <Box p={[0, 0.012, 0]} s={[0.16, 0.024, 0.1]} c="#ffffff" map={tx.rizo} r={0.95} rad={0.01} />
    <Box p={[0, 0.034, 0.004]} s={[0.155, 0.022, 0.095]} c="#ffffff" map={tx.rizo} r={0.95} rad={0.01} />
    {steam > 0.01 && Array.from({ length: 16 }, (_, i) => {
      const life = 3.6, ph = ((t + rnd(i, 1) * life) % life) / life, sc = 0.03 + ph * 0.12;
      return <sprite key={i} position={[(rnd(i, 2) - 0.5) * 0.12 + Math.sin(t * 0.7 + i) * 0.02 * ph, 0.05 + ph * 0.32, (rnd(i, 3) - 0.5) * 0.06]} scale={[sc, sc, sc]}><spriteMaterial map={tx.vapor} color="#fff6ea" transparent opacity={steam * 0.3 * Math.sin(Math.PI * ph)} depthWrite={false} /></sprite>;
    })}
  </group>
);

// ---------------- BLOQUE DE PIEL en corte ----------------
// Dos porciones sobre negro: a la izquierda la de DEBAJO DEL OJO (fina), a la derecha la de la MEJILLA (gruesa).
// film 0..1 = la película de aceite se extiende sobre la fina · loss 0..1 = humedad que se escapa (gotitas azules que suben;
// el aceite las frena) · press 0..1 = el toque del dedo anular (hunde un poco la superficie) · rub 0..1 = el frotado (la piel se arrastra)
export type PielS = { on: number; film: number; loss: number; press: number; rub: number; thick: number; dirt?: number; slide?: number; shine?: number };
const Porcion: React.FC<{ p: V; w: number; hEpi: number; hDer: number; hFat: number; tx: ReturnType<typeof useTx>; surf: THREE.Texture; press: number; rub: number }> = ({ p, w, hEpi, hDer, hFat, tx, surf, press, rub }) => {
  const d = 0.5, yF = hFat / 2, yD = hFat + hDer / 2, yE = hFat + hDer + hEpi / 2, top = hFat + hDer + hEpi;
  return <group position={p}>
    <Box p={[0, yF, 0]} s={[w, hFat, d]} c="#ffffff" map={tx.grasa} r={0.55} rad={0.006} />
    <Box p={[0, yD, 0]} s={[w, hDer, d]} c="#ffffff" map={tx.corte} r={0.5} rad={0.01} />
    <Box p={[0, yE, 0]} s={[w, hEpi, d]} c="#c98a72" r={0.45} rad={0.004} />
    {/* superficie (relieve de poros / líneas) que se arruga con el frotado */}
    <mesh position={[0, top + 0.0012, 0]} rotation={[-Math.PI / 2, 0, rub * 0.04]} scale={[1 - rub * 0.06, 1 + rub * 0.04, 1]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={surf} bumpMap={surf} bumpScale={0.6} roughness={0.55} color="#ffffff" /></mesh>
    {press > 0.01 && <mesh position={[0, top + 0.003 - press * 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noAO: true }}><circleGeometry args={[0.05 + press * 0.03, 32]} /><meshStandardMaterial color="#d9907a" transparent opacity={0.35 * press} roughness={0.5} /></mesh>}
  </group>;
};
const BloquePiel: React.FC<{ t: number; s: PielS; tx: ReturnType<typeof useTx>; finaTx: THREE.Texture; gruesaTx: THREE.Texture }> = ({ t, s, tx, finaTx, gruesaTx }) => {
  const [x, y, z] = PIEL, fina: V = [x - 0.36, y - 0.3, z], gruesa: V = [x + 0.36, y - 0.3, z];
  const topF = y - 0.3 + 0.12 + 0.2 + 0.025 * (1 + s.thick * 0.0);
  const film = sm(s.film);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, y - 0.302, z]} receiveShadow><circleGeometry args={[3, 64]} /><meshStandardMaterial color="#0d0b0a" roughness={0.3} metalness={0.25} /></mesh>
    <pointLight position={[x - 0.9, y + 1.4, 1.3]} intensity={2.2 * s.on} distance={6} decay={1.6} color="#fff0dc" castShadow />
    <pointLight position={[x + 1.2, y + 0.8, -0.9]} intensity={1.1 * s.on} distance={4} color="#9db8ff" />
    <Porcion p={fina} w={0.6} hEpi={0.025} hDer={0.2} hFat={0.12} tx={tx} surf={finaTx} press={s.press} rub={s.rub} />
    <Porcion p={gruesa} w={0.6} hEpi={0.05} hDer={0.34} hFat={0.2} tx={tx} surf={gruesaTx} press={0} rub={0} />
    {/* película de aceite: crece desde el centro de la porción fina, brillante */}
    {film > 0.01 && <mesh position={[fina[0] + sm(s.slide ?? 0) * 0.26, topF + 0.004, fina[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={[film * (1 + sm(s.slide ?? 0) * 0.5), film * (1 - sm(s.slide ?? 0) * 0.35), 1 + (s.shine ?? 0) * 2]} userData={{ noAO: true }}><circleGeometry args={[0.24, 48]} /><meshStandardMaterial color="#ffd07a" roughness={0.12} metalness={0} transparent opacity={0.36 + 0.3 * (s.shine ?? 0)} emissive="#f0a83a" emissiveIntensity={0.3 + 0.6 * (s.shine ?? 0)} depthWrite={false} /></mesh>}
    {/* el aceite que se pasa del borde y chorrea (demasiado aceite se resbala) */}
    {(s.slide ?? 0) > 0.3 && Array.from({ length: 5 }, (_, i) => { const k = sm(((s.slide ?? 0) - 0.3) / 0.7 - i * 0.08); return k > 0 ? <mesh key={i} position={[fina[0] + 0.3, topF - k * 0.12, fina[2] - 0.18 + i * 0.09]} scale={[1, 1 + k * 3, 1]} userData={{ noAO: true }}><sphereGeometry args={[0.009, 16, 12]} /><meshPhysicalMaterial color="#f0b040" roughness={0.03} emissive="#ffb040" emissiveIntensity={0.25} /></mesh> : null; })}
    {/* lo que había sobre la piel (maquillaje, protector, humo): puntitos oscuros que la película deja pegados */}
    {(s.dirt ?? 0) > 0.01 && Array.from({ length: 70 }, (_, i) => <mesh key={i} position={[fina[0] + (rnd(i, 21) - 0.5) * 0.52, topF + 0.003, fina[2] + (rnd(i, 22) - 0.5) * 0.42]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noAO: true }}><circleGeometry args={[0.004 + rnd(i, 23) * 0.006, 10]} /><meshStandardMaterial color={rnd(i, 24) > 0.5 ? "#4a3a30" : "#8a6a5a"} transparent opacity={(s.dirt ?? 0) * 0.9} roughness={0.8} /></mesh>)}
    {/* humedad que se escapa de la piel fina: sube y se pierde; con la película, casi no sale */}
    {s.loss > 0.01 && Array.from({ length: 34 }, (_, i) => {
      const life = 2.4, ph = ((t + rnd(i, 1) * life) % life) / life, frena = 1 - film * 0.85;
      if (rnd(i, 9) > frena) return null;
      const sc = 0.018 + rnd(i, 4) * 0.012;
      return <sprite key={i} position={[fina[0] + (rnd(i, 2) - 0.5) * 0.55, topF + 0.01 + ph * 0.5 * frena, fina[2] + (rnd(i, 3) - 0.5) * 0.4]} scale={[sc, sc, sc]}><spriteMaterial map={tx.dot} color="#8fd0ff" transparent opacity={s.loss * 0.8 * Math.sin(Math.PI * ph)} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>;
    })}
  </group>;
};

// ---------------- MUNDO ----------------
export type WorldProps = {
  t: number;
  lamp: number;       // 0 apagada · 1 encendida
  lift: number;       // gotero alzado
  dropForm: number; dropFall: number;
  lvl: number;        // nivel del aceite en el frasco (0..1)
  glow: number;       // resalto del frasco ámbar
  steam: number;      // vapor de la toalla
  piel: PielS;
};
export const World: React.FC<WorldProps> = (pr) => {
  const { t, lamp } = pr;
  const tx = useTx();
  const finaTx = useMemo(() => tx.piel(26), [tx]), gruesaTx = useMemo(() => tx.piel(4), [tx]);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.3} threshold={0.92} exposure={lerp(0.7, 0.95, lamp)} env={lerp(0.04, 0.1, lamp)} />
      <color attach="background" args={["#0b0907"]} />
      <ambientLight intensity={0.03 + 0.03 * lamp} color="#ffd8b0" />
      {/* resplandor frío de la ventana del pasillo, muy bajo: que la noche tenga dos colores */}
      <directionalLight position={[1.4, 2.2, 1.6]} intensity={0.18} color="#9bb2d8" />

      {/* EL LAVABO */}
      <group>
        <Box p={[0, TOP / 2, -0.15]} s={[1.5, TOP, 0.62]} c="#efe9df" r={0.7} rad={0.01} />
        <Box p={[0, TOP - 0.012, -0.15]} s={[1.56, 0.028, 0.66]} c="#ffffff" map={tx.madera} r={0.55} rad={0.006} />
        <Box p={[0, 1.4, -0.5]} s={[3, 2.8, 0.04]} c="#ffffff" map={tx.revoque} r={0.95} />
        {/* espejo redondo con marco fino de madera */}
        <mesh position={PT.espejo}><circleGeometry args={[0.3, 64]} /><meshStandardMaterial color="#3a3836" metalness={0.6} roughness={0.12} /></mesh>
        <mesh position={[PT.espejo[0], PT.espejo[1], PT.espejo[2] - 0.004]}><torusGeometry args={[0.305, 0.012, 12, 80]} /><meshStandardMaterial color="#8a6a44" roughness={0.6} /></mesh>
        <Lampara on={lamp} tx={tx.washi} t={t} />
        <Frasco lift={pr.lift} lvl={pr.lvl} glow={pr.glow} />
        <Gota form={pr.dropForm} fall={pr.dropFall} />
        <Toalla t={t} steam={pr.steam} tx={tx} />
        {/* taza de cerámica sin asa */}
        <Cyl p={PT.taza} r1={0.038} r2={0.03} h={0.07} c="#6f7f86" r={0.4} />
        <mesh position={[PT.taza[0], PT.taza[1] + 0.03, PT.taza[2]]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.034, 32]} /><meshStandardMaterial color="#7d8a3a" roughness={0.15} /></mesh>
        {/* discos de algodón */}
        {[0, 1, 2].map((i) => <Cyl key={i} p={[PT.algodon[0] + i * 0.012, TOP + 0.004 + i * 0.006, PT.algodon[2] - i * 0.006]} r1={0.028} h={0.006} c="#fbfaf7" r={1} />)}
        {/* pañuelo de papel doblado */}
        <Box p={[-0.3, TOP + 0.004, 0.02]} s={[0.1, 0.006, 0.08]} c="#f7f5f0" r={1} rad={0.002} rot={[0, 0.3, 0]} />
      </group>

      {/* ESCENARIO DEL BLOQUE DE PIEL */}
      {pr.piel.on > 0.01 && <BloquePiel t={t} s={pr.piel} tx={tx} finaTx={finaTx} gruesaTx={gruesaTx} />}
    </ThreeCanvas>
  );
};
