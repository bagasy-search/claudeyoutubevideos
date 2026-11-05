// plomero3d · el mundo 3D de Claudio el Plomero (tanda plo29): baño en corte de casa de muñecas (inodoro con rayos X, sifón en S,
// tanque, llave de paso, caño bajo el piso, cámara de inspección, ventilación), lavamanos de pedestal con sifón botella, y la cocina
// con la tarja doble, el mueble abierto y el sifón en P (rayos X: agua, grasa, el tapón). Cámara = KEYS2 de plan.ts + balanceo de mano.
// Estado = estado(t) de plan.ts (cada plano de mundo trae el suyo). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { desde, estado, KEYS2, USA } from "./plan";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const win = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V3 = [number, number, number];
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

// ---------------- puntos del mundo ----------------
export const PT = {
  bowl: [0, 0.4, -0.78] as V3, plug: [0, 0.34, -1.06] as V3, trap: [0, 0.2, -0.95] as V3, tank: [0, 0.85, -1.38] as V3,
  valve: [-0.24, 0.16, -1.58] as V3, drain: [0, -0.7, 1.5] as V3, chamber: [2.6, -0.75, 1.3] as V3, vent: [-1.6, 2.9, 1.45] as V3,
  bucket: [0.62, 0.0, -0.55] as V3, lav: [-1.2, 0.86, -1.38] as V3, botella: [-1.2, 0.45, -1.5] as V3,
  sink: [3.01, 0.85, -1.25] as V3, trapk: [3.09, 0.33, -1.25] as V3, kettle: [4.25, 0.96, -1.18] as V3,
};

// ---------------- CÁMARA (KEYS2 + balanceo lento de mano) ----------------
const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const ruido = (x: number, seed: number) => { const i = Math.floor(x), f = x - i, u = f * f * f * (f * (f * 6 - 15) + 10), a = hash(i + seed * 57.31) * 2 - 1, b = hash(i + 1 + seed * 57.31) * 2 - 1; return a + (b - a) * u; };
const capas = (t: number, seed: number) => ruido(t * 0.4, seed) + ruido(t * 0.9, seed + 11) * 0.35 + ruido(t * 1.8, seed + 23) * 0.06;
const manoCam = (t: number, k = 1, seed = 7) => ({ pan: capas(t, seed) * 0.6 * k, tilt: capas(t, seed + 101) * 0.45 * k, roll: capas(t, seed + 202) * 0.3 * k });
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
export const KEYS: Key[] = [...KEYS2].sort((a, b) => a.t - b.t);
export const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.005, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const pa = project(a, b.l), pb = project(b, b.l);
  const dp = a.p.distanceTo(b.p) * 60 + a.l.distanceTo(b.l) * 25;
  return { bx: Math.min(14, Math.abs(pa.x - pb.x) * 0.25 + dp * 0.18), by: Math.min(10, Math.abs(pa.y - pb.y) * 0.25 + dp * 0.08) };
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(t), m = manoCam(t, 1, 7);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l);
  cm.rotateY((m.pan * Math.PI) / 180); cm.rotateX((m.tilt * Math.PI) / 180); cm.rotateZ((m.roll * Math.PI) / 180);
  cm.fov = k.fov; cm.near = 0.005; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useTex = () => useMemo(() => ({
  subway: mk(512, 512, (g) => {
    g.fillStyle = "#9fa6a8"; g.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 16; r++) for (let c2 = -1; c2 < 5; c2++) {
      const x = c2 * 128 + (r % 2) * 64, y = r * 32, v = 222 + rnd(r * 9 + c2, 2) * 14;
      const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, `rgb(${v - 8},${v + 4},${v + 8})`); gr.addColorStop(1, `rgb(${v - 22},${v - 10},${v - 6})`);
      g.fillStyle = gr; g.fillRect(x + 3, y + 3, 122, 26);
    }
  }, [9, 7]),
  floor: mk(256, 256, (g) => {
    g.fillStyle = "#3a3d42"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) { const v = 200 + rnd(r * 4 + c2, 3) * 25; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.fillRect(c2 * 64 + 2, r * 64 + 2, 60, 60); }
  }, [8, 6]),
  kitchen: mk(256, 256, (g) => {
    g.fillStyle = "#8a5a3a"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 4; r++) { const v = 120 + rnd(r, 5) * 30; g.fillStyle = `rgb(${v + 30},${v},${v - 30})`; g.fillRect(0, r * 64 + 2, 256, 60); for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(60,30,10,.15)"; g.fillRect(0, r * 64 + rnd(i, r) * 60, 256, 1); } }
  }, [4, 4]),
  strata: mk(1400, 920, (g) => {
    const band = (y0: number, y1: number, a: string, b: string) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, 1400, y1 - y0); };
    const Y = (u: number) => u * 200;
    band(Y(0), Y(0.9), "#5b4331", "#4a3526"); band(Y(0.9), Y(1.8), "#7f7668", "#6c6457"); band(Y(1.8), Y(4.6), "#9c6c49", "#7a5236");
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(30,20,12,${0.25 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 1400, rnd(i, 3) * Y(0.9), 3, 2); }
    for (let i = 0; i < 520; i++) { const v = 90 + rnd(i, 4) * 80; g.fillStyle = `rgb(${v},${v - 6},${v - 14})`; g.beginPath(); g.ellipse(rnd(i, 5) * 1400, Y(0.9) + rnd(i, 6) * Y(0.9), 3 + rnd(i, 7) * 7, 2 + rnd(i, 8) * 5, rnd(i, 9) * 3, 0, 6.3); g.fill(); }
    for (let i = 0; i < 80; i++) { g.strokeStyle = `rgba(80,45,25,${0.2 + 0.2 * rnd(i, 3)})`; g.lineWidth = 2; g.beginPath(); const y = Y(1.8) + rnd(i, 1) * Y(2.8); g.moveTo(0, y); g.bezierCurveTo(400, y + 6 * rnd(i, 2), 900, y - 5, 1400, y + 3); g.stroke(); }
  }),
  sky: mk(64, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0d1117"); gr.addColorStop(0.45, "#2a3442"); gr.addColorStop(0.55, "#323d4c"); gr.addColorStop(1, "#0b0e12"); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); }),
  label: mk(256, 256, (g) => { g.fillStyle = "#1f8f4e"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#f6f2e6"; g.fillRect(30, 80, 196, 96); g.fillStyle = "#1f8f4e"; g.font = "bold 44px sans-serif"; g.fillText("LIMÓN", 62, 142); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
);
const CHROME = { color: "#eef1f3", metalness: 1, roughness: 0.12 };
const Porcelain: React.FC<{ xr: number }> = ({ xr }) => xr > 0.01
  ? <meshPhysicalMaterial color="#e8f2f6" roughness={0.15} clearcoat={1} transparent opacity={1 - 0.8 * xr} depthWrite={xr < 0.5} side={THREE.DoubleSide} />
  : <meshPhysicalMaterial color="#f4f3ef" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} side={THREE.DoubleSide} />;

// el sifón en S que corre por dentro de la loza (de la salida de la taza al piso)
const TRAP = new THREE.CatmullRomCurve3([[0, 0.27, -0.8], [0, 0.13, -0.88], [0, 0.12, -0.98], [0, 0.26, -1.03], [0, 0.35, -1.07], [0, 0.3, -1.14], [0, 0.12, -1.18], [0, -0.02, -1.19], [0, -0.7, -1.19]].map(v3));
const PLUG_U = 0.47;
const trapGeo = new THREE.TubeGeometry(TRAP, 120, 0.05, 20, false);
const waterGeo = (u0: number, u1: number, r: number) => {
  const pts: THREE.Vector3[] = []; for (let i = 0; i <= 40; i++) pts.push(TRAP.getPointAt(u0 + (u1 - u0) * (i / 40)));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, r, 14, false);
};
const bowlGeo = (() => {
  const prof = [[0.05, 0.2], [0.11, 0.24], [0.17, 0.3], [0.2, 0.36], [0.215, 0.41], [0.22, 0.43], [0.205, 0.43], [0.19, 0.38], [0.16, 0.33], [0.1, 0.28], [0.05, 0.25]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 48); g.scale(1, 1, 1.32); return g;
})();

const Toilet: React.FC<{ t: number; xr: number; lidOff: number; plugK: number; level: number; pour: number; hot: number; flush: number; film: number; plunge: number; wipes: number; crack: number; tinte?: number }> = ({ t, xr, lidOff, plugK, level, pour, hot, flush, film, plunge, wipes, crack, tinte = 0 }) => {
  const wG = useMemo(() => waterGeo(0.0, 0.42, 0.043), []);
  const dG = useMemo(() => waterGeo(0.02, PLUG_U - 0.01, 0.026), []);
  const pp = TRAP.getPointAt(PLUG_U);
  const lv = 0.29 + level * 0.11;
  const plunY = 0.6 + Math.max(0, Math.sin(t * 7)) * 0.05 * plunge;
  return (
    <group position={[0, 0, 0]}>
      {/* taza + pie */}
      <mesh geometry={bowlGeo} position={[0, 0, -0.78]} castShadow receiveShadow><Porcelain xr={xr} /></mesh>
      <mesh position={[0, 0.11, -0.93]} castShadow receiveShadow><cylinderGeometry args={[0.13, 0.17, 0.22, 32]} /><Porcelain xr={xr} /></mesh>
      <mesh position={[0, 0.25, -1.1]} castShadow><boxGeometry args={[0.24, 0.3, 0.26]} /><Porcelain xr={xr} /></mesh>
      {/* asiento levantado */}
      <mesh position={[0, 0.445, -0.78]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.3, 1]}><torusGeometry args={[0.19, 0.022, 12, 48]} /><meshPhysicalMaterial color="#fbfaf6" roughness={0.3} clearcoat={0.6} transparent={xr > 0.01} opacity={1 - 0.85 * xr} /></mesh>
      <mesh position={[0, 0.66, -1.07]} rotation={[-0.12, 0, 0]} scale={[1, 1.25, 1]}><cylinderGeometry args={[0.2, 0.2, 0.02, 40]} /><meshPhysicalMaterial color="#fbfaf6" roughness={0.3} clearcoat={0.6} transparent={xr > 0.01} opacity={1 - 0.85 * xr} /></mesh>
      {/* el agua de la taza: sube cuando está tapado, gira cuando se descarga */}
      <mesh position={[0, lv, -0.78]} rotation={[-Math.PI / 2, 0, flush * t * 4]} scale={[0.82 + level * 0.15, (0.82 + level * 0.15) * 1.32, 1]}>
        <circleGeometry args={[0.2, 40]} /><meshPhysicalMaterial color={level > 0.6 ? "#a59a78" : new THREE.Color("#7fb4c9").lerp(new THREE.Color("#2f5fd6"), tinte * 0.8)} roughness={0.05} transmission={0.4} transparent opacity={0.82} />
      </mesh>
      {/* el sifón con el agua y EL TAPÓN (sólo con rayos X) */}
      {xr > 0.02 && <>
        <mesh geometry={trapGeo}><meshPhysicalMaterial color="#dfeef3" roughness={0.1} transparent opacity={0.28 * xr} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh geometry={wG}><meshStandardMaterial color="#4a9cc0" emissive="#1b5d7a" emissiveIntensity={0.3} transparent opacity={0.75 * xr} /></mesh>
        {plugK > 0.02 && <mesh position={pp} scale={plugK}>
          <icosahedronGeometry args={[0.05, 2]} /><meshStandardMaterial color={hot > 0.5 ? "#e9e4d6" : "#f6f2e8"} roughness={0.95} flatShading />
        </mesh>}
        {plugK > 0.02 && Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[pp.x + (rnd(i, 1) - 0.5) * 0.07 * plugK, pp.y + (rnd(i, 2) - 0.5) * 0.06 * plugK, pp.z + (rnd(i, 3) - 0.5) * 0.06 * plugK]} scale={plugK}><sphereGeometry args={[0.018, 8, 6]} /><meshStandardMaterial color="#efe9da" roughness={1} /></mesh>)}
        {/* la cinta verde del detergente que se desliza hasta el tapón */}
        {pour > 0.01 && <mesh geometry={dG} scale={[1, 1, 1]}><meshStandardMaterial color="#3fd17a" emissive="#1f9d55" emissiveIntensity={0.6} transparent opacity={0.85 * Math.min(1, pour * 2)} /></mesh>}
        {/* calor: brillo naranja alrededor del tapón */}
        {hot > 0.01 && <mesh position={pp}><sphereGeometry args={[0.085, 20, 14]} /><meshBasicMaterial color="#ff9a3c" transparent opacity={0.22 * hot} toneMapped={false} depthWrite={false} /></mesh>}
      </>}
      {/* el tanque: tapa que se levanta, el sapito y la cadenita */}
      <Box p={[0, 0.82, -1.38]} s={[0.46, 0.36, 0.2]} c="#f4f3ef" r={0.2} rad={0.025} op={1 - 0.7 * xr} />
      <group position={[0, 1.02 + lidOff * 0.32, -1.38 + lidOff * 0.18]} rotation={[lidOff * 0.5, 0, 0]}><Box p={[0, 0, 0]} s={[0.49, 0.035, 0.23]} c="#f6f5f1" r={0.2} rad={0.012} /></group>
      {lidOff > 0.05 && <>
        <mesh position={[0, 0.9, -1.38]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.16]} /><meshPhysicalMaterial color={new THREE.Color("#8fc4d8").lerp(new THREE.Color("#1f4fd0"), tinte)} transparent opacity={0.6} roughness={0.05} /></mesh>
        <mesh position={[0, 0.68 + flush * 0.04, -1.37]} rotation={[0.2 + flush * 0.9, 0, 0]}><cylinderGeometry args={[0.04, 0.045, 0.015, 24]} /><meshStandardMaterial color="#c0392b" roughness={0.6} /></mesh>
        <mesh position={[0.06, 0.82, -1.37]}><cylinderGeometry args={[0.002, 0.002, 0.24, 6]} /><meshStandardMaterial {...CHROME} /></mesh>
        <mesh position={[-0.12, 0.78, -1.38]}><cylinderGeometry args={[0.012, 0.012, 0.22, 12]} /><meshStandardMaterial color="#d9d9d9" roughness={0.4} /></mesh>
      </>}
      <mesh position={[0.2, 0.95, -1.29]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.06, 12]} /><meshStandardMaterial {...CHROME} /></mesh>
      {/* film transparente estirado sobre la taza */}
      {film > 0.01 && <mesh position={[0, 0.447 - 0.02 * Math.max(0, Math.sin(t * 3)) * film, -0.78]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.32, 1]}><circleGeometry args={[0.235, 40]} /><meshPhysicalMaterial color="#ffffff" roughness={0.05} transparent opacity={0.35 * film} clearcoat={1} depthWrite={false} /></mesh>}
      {/* destapador de reborde */}
      {plunge > 0.01 && <group position={[0, plunY, -0.75]}>
        <mesh position={[0, -0.2, 0]}><sphereGeometry args={[0.09, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#1b1b1b" roughness={0.5} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.24, 0]}><cylinderGeometry args={[0.035, 0.045, 0.06, 16]} /><meshStandardMaterial color="#1b1b1b" roughness={0.5} /></mesh>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.013, 0.013, 0.6, 12]} /><meshStandardMaterial color="#c79a5b" roughness={0.6} /></mesh>
      </group>}
      {/* toallitas flotando (no se deshacen) */}
      {wipes > 0.01 && Array.from({ length: 3 }, (_, i) => <mesh key={i} position={[(i - 1) * 0.06, lv + 0.004, -0.78 + (i - 1) * 0.05]} rotation={[-Math.PI / 2, 0, i + t * 0.2]}><planeGeometry args={[0.1 * wipes, 0.08 * wipes]} /><meshStandardMaterial color="#f5f5f2" roughness={1} side={THREE.DoubleSide} /></mesh>)}
      {/* la grieta de la loza por el agua hirviendo */}
      {crack > 0.01 && <mesh position={[0.205, 0.36, -0.7]} rotation={[0, Math.PI / 2.4, 0]}><planeGeometry args={[0.004, 0.16 * crack]} /><meshBasicMaterial color="#2b2b2b" /></mesh>}
    </group>
  );
};

// chorro (de la taza o del balde) que cae a la taza desde la altura de la cintura
const Pour: React.FC<{ t: number; on: number; from: V3; col: string; steam: number }> = ({ t, on, from, col, steam }) => {
  if (on < 0.01) return null;
  const to: V3 = [0, 0.33, -0.78];
  const len = Math.hypot(from[0] - to[0], from[1] - to[1], from[2] - to[2]);
  const mid = new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v3([from[0] - to[0], from[1] - to[1], from[2] - to[2]]).normalize());
  return (
    <group>
      <mesh position={mid} quaternion={q}><cylinderGeometry args={[0.012 * on, 0.02 * on, len, 14]} /><meshPhysicalMaterial color={col} transparent opacity={0.75} roughness={0.05} emissive={col} emissiveIntensity={0.15} /></mesh>
      {steam > 0.01 && Array.from({ length: 18 }, (_, i) => { const u = ((t * 0.5 + i / 18) % 1); return <mesh key={i} position={[to[0] + (rnd(i, 1) - 0.5) * 0.25, to[1] + 0.1 + u * 0.5, to[2] + (rnd(i, 2) - 0.5) * 0.25]}><sphereGeometry args={[0.03 + u * 0.05, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16 * (1 - u) * steam} depthWrite={false} /></mesh>; })}
    </group>
  );
};

const Bucket: React.FC<{ p: V3; tilt: number }> = ({ p, tilt }) => (
  <group position={p} rotation={[0, 0, tilt * 1.2]}>
    <mesh position={[0, 0.15, 0]} castShadow><cylinderGeometry args={[0.15, 0.12, 0.3, 32, 1, true]} /><meshStandardMaterial color="#2f6fb3" roughness={0.5} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.12, 0.12, 0.01, 32]} /><meshStandardMaterial color="#2a62a0" /></mesh>
    <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.14, 32]} /><meshPhysicalMaterial color="#9cc9d9" transparent opacity={0.7} roughness={0.05} /></mesh>
    <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.004, 6, 40, Math.PI]} /><meshStandardMaterial {...CHROME} /></mesh>
  </group>
);

// el caño bajo el piso (corte abierto al frente) y la cámara de inspección
const DRAIN = new THREE.CurvePath<THREE.Vector3>();
([[[0, -0.7, -1.19], [0, -0.8, 1.5]], [[0, -0.8, 1.5], [2.6, -1.0, 1.5]], [[2.6, -1.0, 1.5], [4.8, -1.15, 1.5]]] as V3[][]).forEach(([a, b]) => DRAIN.add(new THREE.LineCurve3(v3(a), v3(b))));
const Pipe: React.FC<{ a: V3; b: V3; r?: number; c?: string }> = ({ a, b, r = 0.06, c = "#e3e0d6" }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), len = A.distanceTo(B);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, len, 24, 1, true]} /><meshStandardMaterial color={c} roughness={0.5} side={THREE.DoubleSide} /></mesh>;
};

const Kettle: React.FC<{ p: V3; t: number; steam: number; boil: number }> = ({ p, t, steam, boil }) => (
  <group position={p}>
    <mesh position={[0, 0.1, 0]} castShadow><sphereGeometry args={[0.11, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial {...CHROME} roughness={0.2} /></mesh>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.1, 0.1, 0.07, 32]} /><meshStandardMaterial {...CHROME} roughness={0.2} /></mesh>
    <mesh position={[0.12, 0.1, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.012, 0.02, 0.12, 12]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.07, 0.01, 8, 24, Math.PI]} /><meshStandardMaterial color="#222" /></mesh>
    {(steam + boil) > 0.01 && Array.from({ length: 16 }, (_, i) => { const u = ((t * (0.6 + boil) + i / 16) % 1); return <mesh key={i} position={[0.17 + u * 0.08 + (rnd(i, 1) - 0.5) * 0.04, 0.16 + u * 0.4, (rnd(i, 2) - 0.5) * 0.05]}><sphereGeometry args={[0.02 + u * 0.04, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.2 * (1 - u) * Math.max(steam, boil)} depthWrite={false} /></mesh>; })}
  </group>
);

const Mug: React.FC<{ p: V3; tip: number; lift: number }> = ({ p, tip, lift }) => (
  <group position={[p[0] - lift * 0.3, p[1] + lift * 0.25, p[2]]} rotation={[0, 0, tip * 1.4]}>
    <mesh castShadow position={[0, 0.05, 0]}><cylinderGeometry args={[0.045, 0.04, 0.1, 28, 1, true]} /><meshPhysicalMaterial color="#f2efe7" roughness={0.25} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.04, 0.04, 0.004, 28]} /><meshStandardMaterial color="#f2efe7" /></mesh>
    <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.042, 24]} /><meshStandardMaterial color="#3fd17a" emissive="#1f9d55" emissiveIntensity={0.25} /></mesh>
    <mesh position={[0.05, 0.05, 0]}><torusGeometry args={[0.025, 0.007, 8, 18]} /><meshPhysicalMaterial color="#f2efe7" roughness={0.25} /></mesh>
  </group>
);


// ================= LA TARJA DE LA COCINA: tarja doble de acero, mueble abierto y el sifón en P (rayos X) =================
const SX = 3.01, TOP = 0.915, BOT = 0.715, BZ = -1.25;
const BASINS = [SX - 0.2, SX + 0.2];
const STEEL = { color: "#c9ced3", metalness: 0.9, roughness: 0.28 };
// la U del sifón (de frente a cámara) y el brazo que entra a la pared
const PTRAP = new THREE.CatmullRomCurve3([[SX, 0.5, BZ], [SX, 0.33, BZ], [SX + 0.03, 0.27, BZ], [SX + 0.09, 0.255, BZ], [SX + 0.15, 0.27, BZ], [SX + 0.18, 0.33, BZ], [SX + 0.18, 0.4, BZ], [SX + 0.18, 0.42, BZ - 0.06]].map(v3));
const ptrapGeo = new THREE.TubeGeometry(PTRAP, 90, 0.034, 18, false);
const pwaterGeo = (() => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 30; i++) pts.push(PTRAP.getPointAt(0.18 + 0.52 * (i / 30))); return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 50, 0.028, 12, false); })();
const Basin: React.FC<{ x: number; lvl: number; nata: number; t: number; swirl: number }> = ({ x, lvl, nata, t, swirl }) => {
  const w = 0.36, d = 0.4, h = TOP - BOT, wy = BOT + 0.004 + h * 0.9 * lvl;
  return <group>
    <Box p={[x, BOT, BZ]} s={[w, 0.008, d]} c="#bfc5ca" m={0.85} r={0.3} rad={0.003} />
    <Box p={[x - w / 2, (TOP + BOT) / 2, BZ]} s={[0.008, h, d]} c="#c9ced3" m={0.9} r={0.25} rad={0.002} />
    <Box p={[x + w / 2, (TOP + BOT) / 2, BZ]} s={[0.008, h, d]} c="#c9ced3" m={0.9} r={0.25} rad={0.002} />
    <Box p={[x, (TOP + BOT) / 2, BZ - d / 2]} s={[w, h, 0.008]} c="#c9ced3" m={0.9} r={0.25} rad={0.002} />
    <Box p={[x, (TOP + BOT) / 2, BZ + d / 2]} s={[w, h, 0.008]} c="#c9ced3" m={0.9} r={0.25} rad={0.002} />
    <mesh position={[x, BOT + 0.006, BZ]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.022, 0.04, 28]} /><meshStandardMaterial {...STEEL} /></mesh>
    <mesh position={[x, BOT + 0.005, BZ]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.022, 20]} /><meshStandardMaterial color="#111" /></mesh>
    <mesh position={[x, wy, BZ]} rotation={[-Math.PI / 2, 0, swirl * t * 3]} visible={lvl > 0.01}><planeGeometry args={[w - 0.012, d - 0.012]} />
      <meshPhysicalMaterial color={new THREE.Color("#8fb6c4").lerp(new THREE.Color("#8a8473"), nata)} roughness={0.08} transparent opacity={0.8} /></mesh>
    {lvl > 0.01 && nata > 0.02 && Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[x + (rnd(i, 1) - 0.5) * (w - 0.06), wy + 0.002, BZ + (rnd(i, 2) - 0.5) * (d - 0.06)]} rotation={[-Math.PI / 2, 0, rnd(i, 3) * 6]}>
      <circleGeometry args={[0.012 + 0.025 * rnd(i, 4), 14]} /><meshStandardMaterial color="#e9e1c4" roughness={0.5} transparent opacity={0.85 * nata} /></mesh>)}
  </group>;
};
type SinkP = { t: number; td: number; kx: number; grasa: number; tl: number; nata: number; trap: number; sonda: number; agua: number; rejilla: number; bico: number; copa: number };
const Sink: React.FC<SinkP> = ({ t, td, kx, grasa, tl, nata, trap, sonda, agua, rejilla, bico, copa }) => {
  const door = ease(Math.max(kx, trap, sonda));
  const drop = ease(trap) * 0.16, swirl = tl < 0.3 && agua > 0.5 ? 1 : 0;
  const tp = PTRAP.getPointAt(0.45);
  return <group>
    {/* mueble: laterales, fondo, piso; la puerta se abre */}
    <Box p={[2.35, 0.45, -1.25]} s={[0.4, 0.9, 0.62]} c="#6f4b33" r={0.7} rad={0.01} />
    <Box p={[4.25, 0.45, -1.25]} s={[1.6, 0.9, 0.62]} c="#6f4b33" r={0.7} rad={0.01} />
    <Box p={[SX, 0.45, -1.55]} s={[0.9, 0.9, 0.02]} c="#5b3c28" r={0.8} rad={0.004} />
    <Box p={[SX, 0.05, -1.25]} s={[0.9, 0.03, 0.6]} c="#5b3c28" r={0.8} rad={0.004} />
    <group position={[SX - 0.45, 0.47, -0.94]} rotation={[0, -door * 1.9, 0]}><Box p={[0.22, 0, 0]} s={[0.44, 0.8, 0.025]} c="#7a5236" r={0.65} rad={0.006} /><Box p={[0.38, 0.12, 0.02]} s={[0.02, 0.14, 0.02]} c="#c7c7c7" m={0.9} r={0.2} rad={0.004} /></group>
    <group position={[SX + 0.45, 0.47, -0.94]} rotation={[0, door * 1.9, 0]}><Box p={[-0.22, 0, 0]} s={[0.44, 0.8, 0.025]} c="#7a5236" r={0.65} rad={0.006} /><Box p={[-0.38, 0.12, 0.02]} s={[0.02, 0.14, 0.02]} c="#c7c7c7" m={0.9} r={0.2} rad={0.004} /></group>
    {/* mesada con el hueco de la tarja */}
    <Box p={[2.35, TOP, -1.25]} s={[0.42, 0.03, 0.66]} c="#d9d3c6" r={0.35} rad={0.005} />
    <Box p={[4.25, TOP, -1.25]} s={[1.62, 0.03, 0.66]} c="#d9d3c6" r={0.35} rad={0.005} />
    <Box p={[SX, TOP, -1.5]} s={[0.84, 0.03, 0.16]} c="#d9d3c6" r={0.35} rad={0.005} />
    <Box p={[SX, TOP, -0.99]} s={[0.84, 0.03, 0.12]} c="#d9d3c6" r={0.35} rad={0.005} />
    {BASINS.map((x, i) => <Basin key={i} x={x} lvl={tl} nata={nata} t={t} swirl={swirl} />)}
    {/* canilla cromada; el chorro cuando corre el agua */}
    <mesh position={[SX, TOP + 0.13, -1.5]}><cylinderGeometry args={[0.018, 0.024, 0.26, 18]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[SX, TOP + 0.26, -1.42]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.08, 0.014, 10, 24, Math.PI]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[SX, TOP + 0.25, -1.34]}><cylinderGeometry args={[0.013, 0.013, 0.03, 12]} /><meshStandardMaterial {...CHROME} /></mesh>
    <mesh position={[SX, (TOP + 0.23 + BOT + 0.18 * tl) / 2, -1.34]} visible={agua > 0.01}><cylinderGeometry args={[0.001 + 0.008 * agua, 0.001 + 0.011 * agua, TOP + 0.23 - BOT - 0.18 * tl, 12]} /><meshPhysicalMaterial color="#cfe8f2" transparent opacity={0.6} roughness={0.02} /></mesh>
    {/* la rejilla fina en la boca del desagüe */}
    <mesh position={[BASINS[0], BOT + 0.012 + 0.05 * (1 - rejilla), BZ]} rotation={[-Math.PI / 2, 0, 0]} visible={rejilla > 0.01}><circleGeometry args={[0.045, 32]} /><meshStandardMaterial color="#9aa1a6" metalness={0.8} roughness={0.35} wireframe transparent opacity={rejilla} /></mesh>
    {/* bicarbonato en la boca */}
    <mesh position={[BASINS[1], BOT + 0.01, BZ]} scale={[1, 0.001 + 0.5 * bico, 1]} visible={bico > 0.01}><sphereGeometry args={[0.05, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#fbfbf7" roughness={1} /></mesh>
    {/* destapacaños de copa plana en la tarja izquierda */}
    <group position={[BASINS[0], BOT + 0.05 + Math.max(0, Math.sin(td * 6)) * 0.04 * copa + (1 - copa) * 0.4, BZ]} visible={copa > 0.01}>
      <mesh><sphereGeometry args={[0.07, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#c0392b" roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.012, 0.55, 12]} /><meshStandardMaterial color="#c79a5b" roughness={0.6} /></mesh></group>
    {/* las colas de la tarja hasta la T, y de la T al sifón */}
    <Pipe a={[BASINS[0], BOT, BZ]} b={[BASINS[0], 0.55, BZ]} r={0.02} c="#eeeeea" />
    <Pipe a={[BASINS[1], BOT, BZ]} b={[BASINS[1], 0.55, BZ]} r={0.02} c="#eeeeea" />
    <Pipe a={[BASINS[0], 0.55, BZ]} b={[BASINS[1], 0.55, BZ]} r={0.022} c="#eeeeea" />
    <Pipe a={[SX, 0.55, BZ]} b={[SX, 0.5 - drop * 0.2, BZ]} r={0.026} c="#eeeeea" />
    {/* el caño de la pared (donde se mete la sonda) */}
    <Pipe a={[SX + 0.18, 0.42, BZ - 0.06]} b={[SX + 0.18, 0.42, -1.6]} r={0.034} c="#e3e0d6" />
    <group position={[0, -drop, 0]}>
      <mesh geometry={ptrapGeo} castShadow><meshPhysicalMaterial color="#f1efe8" roughness={0.35} transparent opacity={1 - 0.75 * kx} side={THREE.DoubleSide} depthWrite={kx < 0.5} /></mesh>
      <mesh geometry={pwaterGeo} visible={kx > 0.02}><meshStandardMaterial color="#4a9cc0" emissive="#1b5d7a" emissiveIntensity={0.3} transparent opacity={0.7 * kx * (1 - ease(trap))} /></mesh>
      {kx > 0.02 && grasa > 0.02 && <>
        <mesh position={tp} scale={[grasa, grasa * 0.8, grasa]}><icosahedronGeometry args={[0.03, 2]} /><meshStandardMaterial color="#e6d9a8" roughness={0.85} flatShading /></mesh>
        {Array.from({ length: 9 }, (_, i) => { const q = PTRAP.getPointAt(0.25 + 0.5 * rnd(i, 4)); return <mesh key={i} position={[q.x + (rnd(i, 1) - 0.5) * 0.04, q.y - 0.018, q.z + (rnd(i, 2) - 0.5) * 0.03]} scale={grasa}><sphereGeometry args={[0.011, 8, 6]} /><meshStandardMaterial color="#d8c88a" roughness={0.9} /></mesh>; })}
      </>}
      {[[SX, 0.5], [SX + 0.18, 0.41]].map(([x, y], i) => <mesh key={i} position={[x, y, BZ]}><cylinderGeometry args={[0.04, 0.04, 0.04, 6]} /><meshStandardMaterial color="#f7f6f1" roughness={0.4} /></mesh>)}
    </group>
    {/* la cubeta debajo cuando se desarma */}
    <group position={[SX + 0.09, 0.065, BZ + 0.02]} scale={0.95} visible={trap > 0.01}>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.15, 0.12, 0.18, 30, 1, true]} /><meshStandardMaterial color="#c0392b" roughness={0.55} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.12, 0.12, 0.004, 30]} /><meshStandardMaterial color="#a83226" /></mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.13, 30]} /><meshPhysicalMaterial color="#7b7a6c" transparent opacity={0.75} roughness={0.1} /></mesh></group>
    {/* la sonda espiral entrando por el caño de la pared */}
    <group position={[SX + 0.18, 0.42, BZ - 0.06 + (1 - sonda) * 0.3 - (td * 0.03) % 0.1]} visible={sonda > 0.01}>
      <mesh rotation={[Math.PI / 2, 0, td * 4]}><cylinderGeometry args={[0.006, 0.006, 0.5, 8]} /><meshStandardMaterial color="#8d9399" metalness={0.9} roughness={0.3} /></mesh>
      <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.05, 20]} /><meshStandardMaterial color="#d34a2a" roughness={0.5} /></mesh></group>
  </group>;
};

// ================= EL LAVAMANOS de pedestal con el sifón botella =================
const lavGeo = (() => { const g = new THREE.LatheGeometry([[0.02, 0], [0.12, 0.01], [0.2, 0.05], [0.25, 0.1], [0.27, 0.13], [0.26, 0.135]].map(([x, y]) => new THREE.Vector2(x, y)), 48); g.scale(1, 1, 0.8); return g; })();
const Lav: React.FC<{ lx: number; pelo: number; ll: number; botella: number }> = ({ lx, pelo, ll, botella }) => {
  const [x, y, z] = PT.lav;
  const cup = ease(botella) * 0.12;
  return <group>
    <mesh geometry={lavGeo} position={[x, y - 0.1, z]} castShadow receiveShadow><Porcelain xr={0} /></mesh>
    <mesh position={[x, 0.38, z - 0.06]}><cylinderGeometry args={[0.07, 0.1, 0.76, 24]} /><meshPhysicalMaterial color="#f4f3ef" roughness={0.2} clearcoat={1} transparent opacity={1 - 0.8 * lx} depthWrite={lx < 0.5} /></mesh>
    <mesh position={[x, y - 0.09 + 0.11 * ll, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]} visible={ll > 0.01}><circleGeometry args={[0.13 + 0.12 * ll, 40]} /><meshPhysicalMaterial color={ll > 0.5 ? "#9e9a88" : "#9cc6d6"} transparent opacity={0.8} roughness={0.06} /></mesh>
    {/* tapón automático y la mata de pelo */}
    <mesh position={[x, y - 0.095 + 0.03 * pelo, z]}><cylinderGeometry args={[0.022, 0.022, 0.01, 20]} /><meshStandardMaterial {...CHROME} /></mesh>
    {pelo > 0.02 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[x + (rnd(i, 1) - 0.5) * 0.03, y - 0.1 + 0.03 * pelo - 0.012 * i * pelo, z + (rnd(i, 2) - 0.5) * 0.03]} rotation={[rnd(i, 3) * 3, rnd(i, 4) * 3, 0]} scale={pelo}>
      <torusKnotGeometry args={[0.012, 0.0025, 40, 6, 2 + (i % 3), 3]} /><meshStandardMaterial color={i % 3 ? "#2b2420" : "#6d6a5c"} roughness={0.9} /></mesh>)}
    <mesh position={[x, y + 0.06, z - 0.2]}><cylinderGeometry args={[0.014, 0.018, 0.12, 14]} /><meshStandardMaterial {...CHROME} /></mesh>
    {/* sifón botella detrás del pedestal: cuerpo + vaso que se desenrosca + salida a la pared */}
    <Pipe a={[x, y - 0.1, z]} b={[x, 0.52, z - 0.1]} r={0.016} c="#d8dadc" />
    <mesh position={[x, 0.46, z - 0.1]}><cylinderGeometry args={[0.035, 0.035, 0.1, 20]} /><meshStandardMaterial {...CHROME} /></mesh>
    <group position={[x, 0.37 - cup, z - 0.1]}>
      <mesh><cylinderGeometry args={[0.04, 0.036, 0.09, 20]} /><meshStandardMaterial {...CHROME} roughness={0.2} /></mesh>
      <mesh position={[0, 0.03, 0]} visible={botella > 0.3}><cylinderGeometry args={[0.032, 0.032, 0.02, 16]} /><meshStandardMaterial color="#4a443a" roughness={1} /></mesh>
    </group>
    <Pipe a={[x, 0.46, z - 0.1]} b={[x, 0.46, -1.6]} r={0.014} c="#d8dadc" />
    <mesh position={[x + 0.02, 0.07, z + 0.02]} visible={botella > 0.3}><cylinderGeometry args={[0.11, 0.09, 0.14, 24, 1, true]} /><meshStandardMaterial color="#2f6fb3" roughness={0.5} side={THREE.DoubleSide} /></mesh>
    {/* luces siempre montadas (rampa de intensidad, nunca cond && <Light>) */}
    <spotLight position={[x + 0.5, 0.8, z + 0.8]} angle={0.5} penumbra={1} intensity={0.01 + 2.5 * lx} distance={2.5} color="#ffffff" target-position={[x, 0.42, z - 0.1]} />
    <pointLight position={[x, 1.75, z + 0.25]} intensity={0.6} distance={1.6} color="#fff4e0" />
  </group>;
};


// ================= PATIO DE SERVICIO: el calentador de depósito (corte con rayos X: sedimento, ánodo, tubo de inmersión, quemador) =================
const CAL: V3 = [-3.3, 0, -1.15], CR = 0.27, CH = 1.3, CB = 0.14;
type CalP = { t: number; cx: number; sed: number; anodo: number; out: number; piloto: number; alivio: number; oxido: number; purga: number; dip: number; burb: number; calor: number };
const Calentador: React.FC<CalP> = ({ t, cx, sed, anodo, out, piloto, alivio, oxido, purga, dip, burb, calor }) => {
  const [x, , z] = CAL, top = CB + CH, sedH = 0.02 + 0.12 * sed;
  const shell = new THREE.Color("#f2f1ec").lerp(new THREE.Color("#a0603a"), oxido * 0.25);
  const aR = lerp(0.022, 0.006, anodo), aUp = ease(out) * 1.05;
  return <group>
    {/* patio: losa, pared del fondo y lateral */}
    <Box p={[-3.5, -0.08, -0.1]} s={[2.3, 0.16, 3.42]} c="#8f8b84" r={0.95} rad={0.01} />
    <Box p={[-3.5, 1.3, -1.65]} s={[2.3, 2.6, 0.1]} c="#d9cdb5" r={0.9} rad={0.01} />
    <Box p={[-4.6, 1.3, -0.1]} s={[0.1, 2.6, 3.2]} c="#d2c5ab" r={0.9} rad={0.01} />
    <pointLight position={[-2.9, 2.2, 0.2]} intensity={2.6} distance={5} color="#fff1dc" />
    <spotLight position={[-2.4, 1.2, 0.4]} angle={0.6} penumbra={1} intensity={1.5 + 2.5 * cx} distance={3.5} color="#ffffff" target-position={[x, 0.6, z]} />
    {[0, 1, 2].map((i) => { const a = i / 3 * Math.PI * 2; return <Box key={i} p={[x + Math.cos(a) * 0.18, CB / 2, z + Math.sin(a) * 0.18]} s={[0.03, CB, 0.03]} c="#3a3a3a" m={0.6} r={0.4} rad={0.004} />; })}
    {/* carcasa (se vuelve vidrio con rayos X) */}
    <mesh position={[x, CB + CH / 2, z]} castShadow receiveShadow><cylinderGeometry args={[CR, CR, CH, 48, 1, cx > 0.02]} />
      <meshPhysicalMaterial color={shell} roughness={0.3} clearcoat={0.6} transparent={cx > 0.01} opacity={1 - 0.82 * cx} depthWrite={cx < 0.5} side={THREE.DoubleSide} /></mesh>
    <mesh position={[x, top + 0.02, z]}><cylinderGeometry args={[CR - 0.01, CR, 0.04, 48]} /><meshStandardMaterial color="#e9e8e2" roughness={0.4} /></mesh>
    {/* óxido y humedad en la base */}
    {oxido > 0.01 && <mesh position={[x, CB + 0.06, z]}><cylinderGeometry args={[CR + 0.002, CR + 0.002, 0.12 * oxido + 0.01, 48, 1, true]} /><meshStandardMaterial color="#8a4a22" roughness={1} transparent opacity={0.85 * oxido} /></mesh>}
    {oxido > 0.01 && <mesh position={[x + 0.05, 0.005, z + 0.25]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.22 * oxido, 28]} /><meshPhysicalMaterial color="#4b4038" roughness={0.05} transparent opacity={0.55 * oxido} /></mesh>}
    {cx > 0.02 && <>
      {/* el agua: azul abajo, naranja cuando calienta */}
      <mesh position={[x, CB + 0.02 + (CH - 0.06) / 2, z]}><cylinderGeometry args={[CR - 0.015, CR - 0.015, CH - 0.06, 40]} /><meshPhysicalMaterial color={new THREE.Color("#5aa6cf").lerp(new THREE.Color("#e2894a"), calor * 0.6)} transparent opacity={0.28 * cx} roughness={0.05} depthWrite={false} /></mesh>
      {/* el sedimento duro del fondo */}
      <mesh position={[x, CB + 0.02 + sedH / 2, z]}><cylinderGeometry args={[CR - 0.016, CR - 0.016, sedH, 40]} /><meshStandardMaterial color="#d9cfb2" roughness={1} flatShading transparent opacity={cx} /></mesh>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[x + (rnd(i, 1) - 0.5) * 0.4, CB + 0.02 + sedH + 0.004, z + (rnd(i, 2) - 0.5) * 0.4]} scale={0.6 + rnd(i, 3)}><dodecahedronGeometry args={[0.012]} /><meshStandardMaterial color="#cdbf98" roughness={1} transparent opacity={cx * sed} /></mesh>)}
      {/* burbujas que revientan contra la costra (el ruido de palomitas) */}
      {burb > 0.01 && Array.from({ length: 18 }, (_, i) => { const u = (t * 1.8 + rnd(i, 4)) % 1; return <mesh key={i} position={[x + (rnd(i, 5) - 0.5) * 0.36, CB + 0.03 + sedH + u * 0.12, z + (rnd(i, 6) - 0.5) * 0.36]} scale={(0.008 + 0.012 * u) * (u > 0.85 ? 1.6 : 1)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8 * burb * (1 - u)} /></mesh>; })}
      {/* el ánodo de sacrificio (se come; con «out» sube y sale por arriba) */}
      <group position={[x, 0, z]}>
        <mesh position={[0, top - 0.5 + aUp, 0]}><cylinderGeometry args={[aR, aR * 0.9, 0.9, 16]} /><meshStandardMaterial color={new THREE.Color("#b8bcc0").lerp(new THREE.Color("#7a6e5e"), anodo)} metalness={0.6} roughness={0.5 + 0.4 * anodo} /></mesh>
        <mesh position={[0, top - 0.5 + aUp, 0]}><cylinderGeometry args={[0.003, 0.003, 0.92, 6]} /><meshStandardMaterial color="#555" metalness={1} roughness={0.3} /></mesh>
        {anodo > 0.3 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[(rnd(i, 7) - 0.5) * 0.03, top - 0.9 + aUp + i * 0.08, (rnd(i, 8) - 0.5) * 0.03]} scale={0.006 + 0.01 * anodo}><dodecahedronGeometry args={[1]} /><meshStandardMaterial color="#8b7f6a" roughness={1} /></mesh>)}
      </group>
      {/* el tubo de inmersión; roto = corto y con pedacitos abajo */}
      <mesh position={[x + 0.12, top - (dip > 0.5 ? 0.2 : 0.55), z]}><cylinderGeometry args={[0.012, 0.012, dip > 0.5 ? 0.4 : 1.1, 12]} /><meshStandardMaterial color="#f4f4f0" roughness={0.5} transparent opacity={cx} /></mesh>
      {dip > 0.5 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[x + 0.12 + (rnd(i, 9) - 0.5) * 0.1, CB + 0.05 + sedH + rnd(i, 10) * 0.2, z + (rnd(i, 11) - 0.5) * 0.1]} rotation={[rnd(i, 12) * 3, 0, rnd(i, 13) * 3]}><cylinderGeometry args={[0.01, 0.01, 0.04, 8]} /><meshStandardMaterial color="#f4f4f0" /></mesh>)}
      <mesh position={[x, CB - 0.02, z]}><cylinderGeometry args={[0.12, 0.12, 0.02, 28]} /><meshStandardMaterial color="#333" metalness={0.7} roughness={0.4} /></mesh>
    </>}
    {/* la llama del piloto */}
    <mesh position={[x + 0.02, CB - 0.01 + 0.02 * Math.sin(t * 14), z + 0.04]} scale={[0.6, 1 + 0.15 * Math.sin(t * 11), 0.6]} visible={piloto > 0.01}><coneGeometry args={[0.02 * piloto + 0.001, 0.07 * piloto + 0.001, 12]} /><meshBasicMaterial color="#5ab0ff" toneMapped={false} transparent opacity={0.9} /></mesh>
    <pointLight position={[x, CB, z + 0.1]} intensity={0.01 + 1.2 * piloto} distance={0.8} color="#7cc4ff" />
    {/* control de gas con perilla y la mirilla */}
    <Box p={[x, 0.42, z + CR + 0.03]} s={[0.12, 0.1, 0.06]} c="#2b2b2b" m={0.4} r={0.5} rad={0.008} />
    <mesh position={[x + 0.03, 0.42, z + CR + 0.065]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.015, 20]} /><meshStandardMaterial color="#c0392b" roughness={0.5} /></mesh>
    <mesh position={[x, 0.2, z + CR + 0.004]}><circleGeometry args={[0.025, 20]} /><meshBasicMaterial color={piloto > 0.3 ? "#6fb9ff" : "#1a1a1a"} toneMapped={false} /></mesh>
    {/* entrada fría con su llave, salida caliente */}
    <Pipe a={[x + 0.12, top, z]} b={[x + 0.12, 2.3, z]} r={0.014} c="#9fb6c8" />
    <Pipe a={[x - 0.12, top, z]} b={[x - 0.12, 2.3, z]} r={0.014} c="#c98a7a" />
    <mesh position={[x + 0.12, top + 0.22, z + 0.02]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.012, 6]} /><meshStandardMaterial color="#c9a35a" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[x, top + 0.05, z]}><cylinderGeometry args={[0.03, 0.03, 0.03, 6]} /><meshStandardMaterial color="#9a9a9a" metalness={0.9} roughness={0.3} /></mesh>
    {/* válvula de alivio + su tubo hasta el piso; gotas cuando gotea */}
    <group position={[x + CR + 0.02, top - 0.15, z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.06, 14]} /><meshStandardMaterial color="#c9a35a" metalness={0.8} roughness={0.3} /></mesh>
      <Box p={[0.03, 0.04, 0]} s={[0.05, 0.008, 0.015]} c="#c9a35a" m={0.8} r={0.3} rad={0.002} />
    </group>
    <Pipe a={[x + CR + 0.05, top - 0.15, z]} b={[x + CR + 0.05, 0.08, z]} r={0.011} c="#c58f5e" />
    {alivio > 0.01 && Array.from({ length: 3 }, (_, i) => { const u = (t * 0.9 + i / 3) % 1; return <mesh key={i} position={[x + CR + 0.05, 0.07 - u * 0.06, z]} scale={0.008 * alivio}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#cfe8f2" transparent opacity={0.8 * (1 - u)} roughness={0.02} /></mesh>; })}
    {/* válvula de purga + chorro café a la cubeta */}
    <mesh position={[x, CB + 0.08, z + CR + 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.06, 12]} /><meshStandardMaterial color="#f2f2f0" roughness={0.4} /></mesh>
    <mesh position={[x, (CB + 0.06 + 0.1) / 2, z + CR + 0.07]} visible={purga > 0.01}><cylinderGeometry args={[0.006 * purga + 0.001, 0.009 * purga + 0.001, CB + 0.06 - 0.1, 10]} /><meshPhysicalMaterial color="#8a6a3e" transparent opacity={0.85} roughness={0.05} /></mesh>
    <group position={[x, 0, z + CR + 0.12]} visible={purga > 0.01}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.09, 0.07, 0.12, 24, 1, true]} /><meshStandardMaterial color="#2f6fb3" roughness={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.02 + 0.08 * purga, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.085, 24]} /><meshPhysicalMaterial color="#7a5a32" transparent opacity={0.85} roughness={0.1} /></mesh>
    </group>
  </group>;
};

// ================= AZOTEA: el tinaco, la bajada (directa / con jorobas y codos / con jarro de aire) y la regadera =================
const ROOF = 2.71, TIN: V3 = [-1.0, ROOF, -1.0], TR = 0.42, TH = 0.95;
const SHOWER: V3 = [-1.92, 1.95, 0.6];
type TinP = { t: number; tx: number; tlvl: number; flot: number; lodo: number; tapa: number; baj: number; aire: number; jarro: number; codos: number; chorro: number; metro: number; alto: number; techo: number; grueso: number; rebose?: number };
const Tinaco: React.FC<TinP> = ({ t, tx, tlvl, flot, lodo, tapa, baj, aire, jarro, codos, chorro, metro, alto, grueso, rebose = 0 }) => {
  const base = ROOF + 0.12 + alto * 0.6, [x, , z] = TIN, wl = base + 0.04 + (TH - 0.12) * tlvl;
  const pts: V3[] = codos > 0.5
    ? [[x - TR, base + 0.06, z], [-1.6, base + 0.06, z], [-1.6, base + 0.32, z], [-1.9, base + 0.32, z], [-1.9, 2.3, z], [-1.9, 2.3, -0.3], [-1.9, 2.55, -0.3], [-1.9, 2.55, 0.25], [-1.9, SHOWER[1] + 0.12, 0.25], [-1.9, SHOWER[1] + 0.12, SHOWER[2]]]
    : [[x - TR, base + 0.06, z], [-1.9, base + 0.06, z], [-1.9, SHOWER[1] + 0.12, z], [-1.9, SHOWER[1] + 0.12, SHOWER[2]]];
  const r = grueso > 0.5 ? 0.032 : 0.018;
  const segs = pts.slice(1).map((b, i) => [pts[i], b] as [V3, V3]);
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])), L = lens.reduce((s, v) => s + v, 0);
  const at = (u: number): V3 => { let d = u * L; for (let i = 0; i < segs.length; i++) { if (d <= lens[i] || i === segs.length - 1) { const k = Math.min(1, d / lens[i]), [a, b] = segs[i]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]; } d -= lens[i]; } return pts[pts.length - 1]; };
  const hump = pts[codos > 0.5 ? 2 : 1];
  return <group>
    <pointLight position={[0.2, 4.2, 0.6]} intensity={2.2} distance={6} color="#fff4e2" />
    <spotLight position={[0.3, 3.4, 1.4]} angle={0.7} penumbra={1} intensity={1.2 + 2 * tx} distance={4} color="#ffffff" target-position={[x, base + 0.4, z]} />
    <Box p={[x, ROOF + (base - ROOF) / 2, z]} s={[0.95, base - ROOF, 0.95]} c="#8d8a84" r={0.95} rad={0.01} />
    <mesh position={[x, base + TH / 2, z]} castShadow><cylinderGeometry args={[TR, TR * 1.04, TH, 48, 1, tx > 0.02]} /><meshPhysicalMaterial color="#1d1f22" roughness={0.6} clearcoat={0.3} transparent={tx > 0.01} opacity={1 - 0.8 * tx} depthWrite={tx < 0.5} side={THREE.DoubleSide} /></mesh>
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[x, base + 0.18 + i * 0.2, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[TR * 1.01, 0.008, 6, 48]} /><meshStandardMaterial color="#111" roughness={0.6} transparent={tx > 0.01} opacity={1 - 0.8 * tx} /></mesh>)}
    <group position={[x, base + TH + 0.03 + tapa * 0.25, z + tapa * 0.35]} rotation={[tapa * 0.6, 0, 0]}><mesh><cylinderGeometry args={[0.2, 0.22, 0.06, 32]} /><meshStandardMaterial color="#1a1c1f" roughness={0.6} /></mesh></group>
    {(tx > 0.02 || tapa > 0.3) && <>
      <mesh position={[x, (base + 0.03 + wl) / 2, z]}><cylinderGeometry args={[TR - 0.02, TR - 0.02, Math.max(0.01, wl - base - 0.03), 40]} /><meshPhysicalMaterial color="#5aa6cf" transparent opacity={0.35 * Math.max(tx, 0.5)} roughness={0.05} depthWrite={false} /></mesh>
      <mesh position={[x, wl, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[TR - 0.02, 40]} /><meshPhysicalMaterial color="#8fc6de" transparent opacity={0.6} roughness={0.03} /></mesh>
      <mesh position={[x, base + 0.035 + 0.03 * lodo, z]}><cylinderGeometry args={[TR - 0.025, TR - 0.025, 0.06 * lodo + 0.002, 40]} /><meshStandardMaterial color="#6e5a3e" roughness={1} transparent opacity={0.9 * lodo} /></mesh>
      <group position={[x + 0.3, base + TH - 0.08, z]} rotation={[0, 0, -0.5 + 0.5 * flot]}>
        <mesh position={[-0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.26, 8]} /><meshStandardMaterial {...CHROME} /></mesh>
        <mesh position={[-0.27, 0, 0]}><sphereGeometry args={[0.06, 20, 14]} /><meshStandardMaterial color="#e8e2c8" roughness={0.5} /></mesh>
      </group>
    </>}
    <Pipe a={[x + TR, base + TH - 0.08, z]} b={[x + TR + 0.5, base + TH - 0.08, z]} r={0.012} c="#c9cdd0" />
    {/* tubo de rebose: sale arriba del tinaco hacia el borde de la azotea; con «rebose» tira agua */}
    <Pipe a={[x, base + TH - 0.12, z + TR]} b={[x, base + TH - 0.12, 0.9]} r={0.012} c="#e9e6dc" />
    <Pipe a={[x, base + TH - 0.12, 0.9]} b={[x, ROOF - 0.2, 1.6]} r={0.012} c="#e9e6dc" />
    {rebose > 0.01 && Array.from({ length: 14 }, (_, i) => { const u = (t * 1.3 + i / 14) % 1; return <mesh key={i} position={[x, ROOF - 0.22 - u * 1.2, 1.62 + u * 0.05]} scale={0.007 * rebose}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#9fd0ee" transparent opacity={0.8 * (1 - u)} /></mesh>; })}
    {segs.map(([a, b], i) => <Pipe key={i} a={a} b={b} r={r} c="#e9e6dc" />)}
    {pts.slice(1, -1).map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[r * 1.35, 14, 10]} /><meshStandardMaterial color="#f2efe6" roughness={0.5} /></mesh>)}
    <mesh position={[-1.4, base + 0.06, z]}><sphereGeometry args={[r * 1.6, 14, 10]} /><meshStandardMaterial color="#c9a35a" metalness={0.8} roughness={0.3} /></mesh>
    {jarro > 0.01 && <><Pipe a={hump} b={[hump[0], hump[1] + (base + TH + 0.35 - hump[1]) * jarro, hump[2]]} r={0.016} c="#e9e6dc" />
      <mesh position={[hump[0], base + TH + 0.36, hump[2]]} visible={jarro > 0.95} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.04, 0.012, 8, 16, Math.PI]} /><meshStandardMaterial color="#e9e6dc" /></mesh></>}
    {baj > 0.01 && Array.from({ length: 36 }, (_, i) => { const u = (i / 36 + t * 0.12 * (0.4 + 0.6 * chorro)) % 1, q = at(u); return <mesh key={i} position={q} scale={r * 0.7 * baj}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#7fc3ea" emissive="#2f86b8" emissiveIntensity={0.5} /></mesh>; })}
    {aire > 0.01 && <mesh position={[hump[0], hump[1] + 0.005, hump[2]]} scale={[r * 3 * aire, r * 0.9, r * 1.2]}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.7} roughness={0.0} /></mesh>}
    <mesh position={SHOWER} rotation={[0, 0, -Math.PI / 2.4]}><cylinderGeometry args={[0.06, 0.02, 0.06, 24]} /><meshStandardMaterial {...CHROME} /></mesh>
    {chorro > 0.01 && Array.from({ length: 30 }, (_, i) => { const u = (t * 1.6 + rnd(i, 1)) % 1, sp = 0.05 + 0.25 * chorro; return <mesh key={i} position={[SHOWER[0] + 0.05 + u * sp + (rnd(i, 2) - 0.5) * 0.04, SHOWER[1] - 0.04 - u * 1.8, SHOWER[2] + (rnd(i, 3) - 0.5) * (0.04 + 0.2 * chorro * u)]} scale={0.006}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#cfe8f2" transparent opacity={0.8 * (1 - u * 0.5)} /></mesh>; })}
    {metro > 0.01 && <>
      <mesh position={[-1.45, SHOWER[1] + (wl - SHOWER[1]) * metro / 2, 0.6]}><boxGeometry args={[0.015, (wl - SHOWER[1]) * metro + 0.001, 0.015]} /><meshBasicMaterial color="#f2c230" toneMapped={false} /></mesh>
      {Array.from({ length: Math.floor((wl - SHOWER[1]) * 10) }, (_, i) => <mesh key={i} position={[-1.45, SHOWER[1] + i * 0.1, 0.6]} visible={i / 10 < (wl - SHOWER[1]) * metro}><boxGeometry args={[0.06, 0.006, 0.006]} /><meshBasicMaterial color="#f2c230" toneMapped={false} /></mesh>)}
    </>}
  </group>;
};

// ================= MEDIDOR DE LA BANQUETA y la pared con la mancha baja (plo4e) =================
const MED: V3 = [1.2, 0.0, 1.3];
const Medidor: React.FC<{ t: number; mtapa: number; fuga: number; mancha: number; mx: number }> = ({ t, mtapa, fuga, mancha, mx }) => {
  const [x, y, z] = MED;
  return <group>
    <pointLight position={[1.4, 1.0, 2.0]} intensity={1.6} distance={2.5} color="#fff2dc" />
    <Box p={[x, y - 0.06, z]} s={[0.36, 0.14, 0.26]} c="#6b6863" r={0.95} rad={0.006} />
    <mesh position={[x, y + 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.2]} /><meshStandardMaterial color="#1e1e1e" /></mesh>
    <group position={[x - 0.15, y + 0.02, z]} rotation={[0, 0, mtapa * 1.9]}><Box p={[0.15, 0, 0]} s={[0.32, 0.015, 0.22]} c="#3e4043" m={0.6} r={0.5} rad={0.003} /></group>
    <Pipe a={[x - 0.18, y - 0.05, z]} b={[x + 0.18, y - 0.05, z]} r={0.012} c="#b08a4e" />
    <mesh position={[x, y - 0.04, z]}><cylinderGeometry args={[0.055, 0.055, 0.05, 32]} /><meshStandardMaterial color="#b08a4e" metalness={0.8} roughness={0.35} /></mesh>
    <mesh position={[x, y - 0.014, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.048, 32]} /><meshStandardMaterial color="#f3f0e6" /></mesh>
    {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[x - 0.03 + i * 0.015, y - 0.012, z - 0.02]} s={[0.012, 0.002, 0.012]} c={i > 2 ? "#b33" : "#222"} r={0.6} rad={0.001} />)}
    <group position={[x + 0.018, y - 0.01, z + 0.018]} rotation={[0, -t * 6 * fuga, 0]}>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}><boxGeometry args={[0.022, 0.002, 0.005]} /><meshBasicMaterial color="#d02a2a" toneMapped={false} /></mesh>)}
    </group>
    <mesh position={[-1.995, 0.22, 0.4]} rotation={[0, Math.PI / 2, 0]} visible={mancha > 0.01}><circleGeometry args={[0.22 * mancha + 0.001, 40]} /><meshStandardMaterial color="#5e5446" roughness={1} transparent opacity={0.55 * mancha} depthWrite={false} /></mesh>
    {mx > 0.01 && <>
      <Pipe a={[-2.02, 0.12, -1.0]} b={[-2.02, 0.12, 1.3]} r={0.012} c="#c9cdd0" />
      {Array.from({ length: 4 }, (_, i) => { const u = (t * 0.9 + i / 4) % 1; return <mesh key={i} position={[-2.02, 0.11 - u * 0.1, 0.35 + (rnd(i, 1) - 0.5) * 0.03]} scale={0.008 * mx}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#7fc3ea" toneMapped={false} transparent opacity={1 - u} /></mesh>; })}
    </>}
  </group>;
};

export const World: React.FC<{ t: number }> = ({ t }) => {
  const bt = useTex();
  const tx = useTextures();
  const S = estado(t), td = desde(t);
  const xr = S.xray, plugK = S.plug, level = S.level, pour = S.pour, hot = S.hot, bucketPour = S.bucket, flush = S.flush, lidOff = S.tank;
  const film = S.film, plunge = S.plunger, wipes = S.wipes, crack = S.crack, flow = S.flow, stuck = S.stuck, steam = S.steam, boil = S.boil, valve = S.valve;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.25} threshold={0.95} exposure={0.88} env={0.45} />
      <color attach="background" args={["#141a23"]} />
      <mesh><sphereGeometry args={[60, 32, 16]} /><meshBasicMaterial map={bt.sky} side={THREE.BackSide} toneMapped={false} /></mesh>
      <hemisphereLight args={[0xdfe8f5, 0x2a2622, 0.5]} />
      <directionalLight position={[4, 9, 7]} intensity={1.5} color="#fff3e2" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003} />
      <pointLight position={[0, 2.3, -0.6]} intensity={2.4} distance={5} color="#ffe6c4" castShadow />
      <spotLight position={[-1.6, 1.8, 0.2]} angle={0.9} penumbra={0.9} intensity={5} distance={6} color="#eef4ff" target-position={[0, 0.4, -0.9]} />
      <spotLight position={[0.5, 1.2, 0.2]} angle={0.5} penumbra={1} intensity={2.2 * Math.max(xr, 0.3)} distance={3} color="#ffffff" target-position={PT.plug} />

      {/* ===== bloque de suelo cortado (maqueta) ===== */}
      <mesh position={[1.4, -2.5, -0.25]} receiveShadow geometry={rbox(7.4, 4.6, 3.1, 0.02)}><meshStandardMaterial map={bt.strata} roughness={0.95} /></mesh>
      <Box p={[1.4, -0.1, -0.1]} s={[7.42, 0.2, 3.42]} c="#9a9894" r={0.9} map={tx.concrete} rad={0.01} />
      <Pipe a={[0, -0.2, -1.19]} b={[0, -0.8, -1.19]} />
      <Pipe a={[0, -0.8, -1.19]} b={[0, -0.8, 1.5]} />
      <Pipe a={[0, -0.8, 1.5]} b={[2.45, -0.98, 1.5]} r={0.07} />
      <Pipe a={[2.75, -1.0, 1.5]} b={[4.9, -1.15, 1.5]} r={0.08} />
      <Box p={[2.6, -0.62, 1.42]} s={[0.4, 0.8, 0.36]} c="#6e6a64" r={0.95} rad={0.01} op={0.9} />
      <mesh position={[2.6, -0.22, 1.42]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.32]} /><meshStandardMaterial color="#3b3a37" metalness={0.6} roughness={0.5} /></mesh>
      {Array.from({ length: 50 }, (_, i) => {
        const u = stuck > 0.5 ? (i / 50) * 0.3 : (i / 50 + t * 0.07) % 1; const q = DRAIN.getPointAt(u);
        return <mesh key={i} position={[q.x, q.y + 0.03, q.z + 0.07]} scale={Math.max(0.001, Math.min(1, flow + stuck))}><sphereGeometry args={[0.02, 8, 6]} /><meshStandardMaterial color={stuck > 0.5 ? "#a58a5c" : "#9fd8ff"} emissive={stuck > 0.5 ? "#000" : "#3b8fbf"} emissiveIntensity={0.4} /></mesh>;
      })}
      <Pipe a={[-0.2, -0.8, 1.45]} b={[-1.6, -0.8, 1.45]} r={0.045} />
      <Pipe a={[-1.6, -0.8, 1.45]} b={[-1.6, 3.05, 1.45]} r={0.045} />
      <Box p={[-1.6, 3.07, 1.45]} s={[0.14, 0.05, 0.14]} c="#555" r={0.6} rad={0.01} />
      <Box p={[-0.9, 2.66, -0.1]} s={[2.4, 0.1, 3.4]} c="#7b5a44" r={0.8} rad={0.01} op={0.95 - 0.7 * S.techo} />
      {Array.from({ length: 14 }, (_, i) => { const u = ((t * 0.4 + i / 14) % 1); return <mesh key={i} position={[-1.6 + (rnd(i, 1) - 0.5) * 0.1, 3.1 + u * 0.6, 1.45]}><sphereGeometry args={[0.03 + u * 0.05, 10, 8]} /><meshBasicMaterial color="#cfe3ff" transparent opacity={0.3 * (1 - u) * S.vent} depthWrite={false} /></mesh>; })}

      {/* ===== EL BAÑO ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[4, 3.2]} /><meshStandardMaterial map={bt.floor} roughness={0.35} /></mesh>
      <Box p={[0, 1.3, -1.65]} s={[4.1, 2.6, 0.1]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[-2.05, 1.3, 0]} s={[0.1, 2.6, 3.2]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[2.05, 1.3, -1.0]} s={[0.1, 2.6, 1.2]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[2.05, 1.3, 1.3]} s={[0.1, 2.6, 0.6]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[2.05, 2.3, 0.3]} s={[0.1, 0.6, 1.4]} c="#f4f2ee" r={0.45} map={bt.subway} rad={0.01} />
      <Box p={[0, 2.25, -1.55]} s={[0.5, 0.05, 0.08]} c="#fff6e2" e="#ffe2b0" ei={1.4} r={0.3} />
      <mesh position={[-1.2, 1.62, -1.59]}><planeGeometry args={[0.6, 0.75]} /><meshStandardMaterial color="#e9eef2" metalness={1} roughness={0.04} /></mesh>
      <Lav lx={S.lx} pelo={S.pelo} ll={S.ll} botella={S.botella} />
      <mesh position={[0.55, 0.7, -1.58]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.055, 0.055, 0.11, 24]} /><meshStandardMaterial color="#fbfaf4" roughness={0.95} /></mesh>
      <group position={PT.valve}>
        <Pipe a={[0, -0.16, 0.02]} b={[0, 0.0, 0.02]} r={0.012} c="#cfd3d6" />
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.06, 16]} /><meshStandardMaterial {...CHROME} /></mesh>
        <group position={[0, 0, 0.09]} rotation={[0, 0, -valve * Math.PI * 1.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.035, 0.035, 0.012, 6]} /><meshStandardMaterial color="#c9a35a" metalness={0.8} roughness={0.3} /></mesh>
        </group>
        <Pipe a={[0, 0.0, 0.05]} b={[0.24, 0.55, 0.2]} r={0.006} c="#d0d0d0" />
      </group>
      <Toilet t={t} xr={xr} lidOff={lidOff} plugK={plugK} level={level} pour={pour} hot={hot} flush={flush} film={film} plunge={plunge} wipes={wipes} crack={crack} tinte={S.tinte} />
      <Bucket p={bucketPour > 0.01 ? [0.25, 0.75, -0.55] : PT.bucket} tilt={bucketPour} />
      <Pour t={t} on={bucketPour} from={[0.12, 0.92, -0.62]} col="#a9d6e6" steam={hot} />

      {/* ===== LA COCINA (por la puerta, a la derecha) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, 0.002, -0.1]} receiveShadow><planeGeometry args={[3.1, 3.4]} /><meshStandardMaterial map={bt.kitchen} roughness={0.7} /></mesh>
      <Box p={[3.6, 1.3, -1.65]} s={[3.1, 2.6, 0.1]} c="#efe6d4" r={0.8} rad={0.01} />
      <pointLight position={[3.3, 2.1, -0.6]} intensity={2.8} distance={4} color="#ffd6a0" />
      <Box p={[3.0, 2.2, -1.58]} s={[0.6, 0.05, 0.06]} c="#fff0d0" e="#ffcf8a" ei={1.2} r={0.4} />
      <spotLight position={[3.4, 0.9, 0.4]} angle={0.6} penumbra={1} intensity={3.2} distance={3} color="#fff4e4" target-position={PT.trapk} />
      <Sink t={t} td={td} kx={S.kx} grasa={S.grasa} tl={S.tl} nata={S.nata} trap={S.trap} sonda={S.sonda} agua={S.agua} rejilla={S.rejilla} bico={S.bico} copa={S.copa} />
      <Mug p={[3.75, 0.93, -1.3]} tip={0} lift={0} />
      <group position={[2.4, 0.93, -1.35]}>
        <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.04, 0.045, 0.2, 24]} /><meshPhysicalMaterial color="#2fbf6a" roughness={0.15} transmission={0.3} clearcoat={1} map={bt.label} /></mesh>
        <mesh position={[0, 0.215, 0]}><cylinderGeometry args={[0.015, 0.02, 0.03, 12]} /><meshStandardMaterial color="#f2f2f2" /></mesh>
      </group>
      <Kettle p={PT.kettle} t={t} steam={steam} boil={boil} />
      {USA.cal && <Calentador t={t} cx={S.cx} sed={S.sed} anodo={S.anodo} out={S.out} piloto={S.piloto} alivio={S.alivio} oxido={S.oxido} purga={S.purga} dip={S.dip} burb={S.burb} calor={S.calor} />}
      {USA.tin && <Tinaco t={t} tx={S.tx} tlvl={S.tlvl} flot={S.flot} lodo={S.lodo} tapa={S.tapa} baj={S.baj} aire={S.aire} jarro={S.jarro} codos={S.codos} chorro={S.chorro} metro={S.metro} alto={S.alto} techo={S.techo} grueso={S.grueso} rebose={S.rebose} />}
      {USA.med && <Medidor t={t} mtapa={S.mtapa} fuga={S.fuga} mancha={S.mancha} mx={S.mx} />}
    </ThreeCanvas>
  );
};
