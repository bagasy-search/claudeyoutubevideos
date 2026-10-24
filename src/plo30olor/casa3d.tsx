// plo30olor · EL MUNDO: la casa de un cliente en corte de casa de muñecas (frente abierto, paredes a media altura) sobre un
// bloque de tierra cortado donde se VE la plomería: el caño principal que va a la calle, el tubo de ventilación que sube al
// techo y, debajo de cada desagüe, su SIFÓN DE VIDRIO (la curva con agua que hace de tapón). De izquierda a derecha:
// PATIO (coladera con plantas) · LAVADERO (lavadora + caño vertical) · COCINA (fregadero de dos tarjas, mueble abierto,
// lavavajillas) · BAÑO (lavabo con rebosadero, inodoro, coladera de piso, regadera, tina) · BAÑO DE VISITAS (polvo).
// El estado (agua del sifón, baba, espuma, tapita de aceite, gas verde que sube, anillo que marca) lo maneja Main.tsx
// segundo a segundo con at(). UNA escena y UNA cámara. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { manoCam } from "../kits/camara/CamaraMano";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type V3 = [number, number, number];

// ---------------- los desagües: dónde está su sifón y su boca ----------------
export type DK = "patio" | "washer" | "kitchen" | "dish" | "lav" | "over" | "toilet" | "floor" | "shower" | "tub" | "guest" | "vent";
type Drain = { trap: V3; mouth: V3; r: number; ring: V3 };
export const DR: Record<DK, Drain> = {
  patio: { trap: [-7.6, -0.42, -1.0], mouth: [-7.6, 0.03, -1.0], r: 0.13, ring: [-7.6, 0.02, -1.0] },
  washer: { trap: [-4.45, 0.22, -2.08], mouth: [-4.45, 1.02, -2.08], r: 0.09, ring: [-4.9, 0.02, -1.6] },
  kitchen: { trap: [-2.1, 0.42, -1.95], mouth: [-2.1, 0.9, -1.95], r: 0.1, ring: [-2.1, 0.02, -1.4] },
  dish: { trap: [-0.75, 0.2, -1.95], mouth: [-0.75, 0.55, -1.7], r: 0.07, ring: [-0.75, 0.02, -1.4] },
  lav: { trap: [0.85, 0.4, -2.1], mouth: [0.85, 0.86, -1.95], r: 0.08, ring: [0.85, 0.02, -1.55] },
  over: { trap: [0.85, 0.4, -2.1], mouth: [0.85, 0.93, -1.84], r: 0.08, ring: [0.85, 0.02, -1.55] },
  toilet: { trap: [2.05, -0.32, -1.85], mouth: [2.05, 0.45, -1.7], r: 0.13, ring: [2.05, 0.02, -1.55] },
  floor: { trap: [3.0, -0.38, -1.2], mouth: [3.0, 0.03, -1.2], r: 0.11, ring: [3.0, 0.02, -1.2] },
  shower: { trap: [4.0, -0.38, -1.55], mouth: [4.0, 0.06, -1.55], r: 0.11, ring: [4.0, 0.02, -1.55] },
  tub: { trap: [5.35, -0.36, -1.75], mouth: [4.8, 0.2, -1.75], r: 0.11, ring: [5.2, 0.02, -1.3] },
  guest: { trap: [6.75, 0.4, -2.1], mouth: [6.75, 0.84, -1.97], r: 0.08, ring: [7.1, 0.02, -1.4] },
  vent: { trap: [6.15, 2.0, -2.15], mouth: [6.15, 3.35, -2.15], r: 0.08, ring: [6.15, 0.02, -1.9] },
};
export const DKS = Object.keys(DR) as DK[];
export const PT = {
  center: [0, 0.8, -1] as V3, street: [-10.6, -0.9, -1.2] as V3, roof: [6.15, 3.4, -2.15] as V3,
  ...Object.fromEntries(DKS.map((k) => [k, DR[k].mouth])) as Record<DK, V3>,
};

// ---------------- CÁMARA (keyframes + respiración + cámara a mano virtual) ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[]) => {
  const camAt = (t: number) => {
    let lo = 0, hi = KEYS.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (KEYS[m].t <= t) lo = m; else hi = m - 1; }
    const i = lo, a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p));
    // cámara a mano virtual (balanceo lento 0,4-1,8 Hz) sobre la mirada
    const m = manoCam(t, 0.9, 7), d = p.distanceTo(l);
    l.x += (m.pan * Math.PI / 180) * d; l.y += (m.tilt * Math.PI / 180) * d; p.x += m.x * 0.0012; p.y += m.y * 0.0012;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k), roll: m.roll * Math.PI / 180 };
  };
  const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const c = new THREE.PerspectiveCamera(cm.fov, W / H, 0.05, 200); c.position.copy(cm.p); c.lookAt(cm.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = q.clone().project(c); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, front: v.z < 1 };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const l = camAt(t).l, P: [number, number, number] = [l.x, l.y, l.z];
    const a = screenOf(t - 1 / FPS, P), b = screenOf(t, P);
    return { bx: Math.abs(b.x - a.x) * 0.06, by: Math.abs(b.y - a.y) * 0.06 };
  };
  return { camAt, screenOf, camSpeed };
};
const Cam: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"] }> = ({ t, camAt }) => {
  const { camera } = useThree();
  const c = camAt(t), pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(c.p); pc.lookAt(c.l); pc.rotateZ(c.roll); pc.fov = c.fov; pc.near = 0.05; pc.far = 200; pc.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
type Tx = THREE.Texture;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useCasaTex = () => useMemo(() => ({
  plaster: mk(256, 256, (g) => { g.fillStyle = "#e3dccd"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 200 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [3, 1]),
  wtile: mk(256, 256, (g) => { g.fillStyle = "#f1efe9"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(120,130,140,.35)"; g.lineWidth = 3; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(0, k * 32); g.lineTo(256, k * 32); g.stroke(); } for (let r = 0; r < 8; r++) for (let c = 0; c <= 4; c++) { g.beginPath(); g.moveTo(c * 64 + (r % 2) * 32, r * 32); g.lineTo(c * 64 + (r % 2) * 32, r * 32 + 32); g.stroke(); } g.fillStyle = "#3e8f9a"; g.fillRect(0, 118, 256, 12); }, [4, 2]),
  ftile: mk(256, 256, (g) => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const v = 170 + rnd(r * 4 + c, 2) * 25; g.fillStyle = `rgb(${v},${v - 6},${v - 14})`; g.fillRect(c * 64, r * 64, 64, 64); } g.strokeStyle = "rgba(70,60,50,.4)"; g.lineWidth = 3; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, k * 64); g.lineTo(256, k * 64); g.stroke(); } }, [4, 2]),
  grass: mk(256, 256, (g) => { g.fillStyle = "#3d5a2c"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${60 + rnd(i, 1) * 40},${100 + rnd(i, 2) * 50},${40 + rnd(i, 3) * 20},.6)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 1.5, 4); } }, [10, 4]),
  soil: mk(256, 256, (g) => { const cs = ["#5a4330", "#4c3826", "#3f2e1f", "#33261a"]; for (let r = 0; r < 4; r++) { g.fillStyle = cs[r]; g.fillRect(0, r * 64, 256, 64); } for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(20,14,8,${0.3 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 0, 6.3); g.fill(); } }, [8, 1]),
  grate: mk(128, 128, (g) => { g.fillStyle = "#9aa0a6"; g.beginPath(); g.arc(64, 64, 62, 0, 6.3); g.fill(); g.fillStyle = "#2a2e33"; for (let k = -3; k <= 3; k++) g.fillRect(24, 60 + k * 12, 80, 5); g.strokeStyle = "#6c7278"; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 58, 0, 6.3); g.stroke(); }),
  dust: mk(128, 128, (g) => { g.fillStyle = "rgba(0,0,0,0)"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(150,140,120,${0.25 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * 128, rnd(i, 4) * 128, 2, 2); } }),
}), []);

// ---------------- piezas ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3; o?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot, o = 1 }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={o < 1} opacity={o} /></mesh>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rot?: V3; m?: number; ro?: number; o?: number; e?: string; ei?: number }> = ({ p, r, h, c, rot, m = 0.1, ro = 0.5, o = 1, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r, h, 24]} /><meshStandardMaterial color={c} metalness={m} roughness={ro} transparent={o < 1} opacity={o} depthWrite={o >= 1} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
// caño gris de PVC entre dos puntos (eje recto)
const Pipe: React.FC<{ a: V3; b: V3; r?: number; c?: string; o?: number }> = ({ a, b, r = 0.05, c = "#9aa3ab", o = 1 }) => {
  const A = v3(a), B = v3(b), mid = A.clone().add(B).multiplyScalar(0.5), len = A.distanceTo(B);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, len, 20]} /><meshStandardMaterial color={c} roughness={0.45} metalness={0.05} transparent={o < 1} opacity={o} /></mesh>;
};

// EL SIFÓN DE VIDRIO: la curva en U con su agua (nivel), la baba pegada, la espuma, la tapita de aceite
type TrapSt = { water: number; slime: number; foam: number; oil: number };
const Trap: React.FC<{ d: Drain; st: TrapSt; t: number; glow: number }> = ({ d, st, t, glow }) => {
  const R = d.r, tube = R * 0.42, arm = R * 1.6;
  const wArc = Math.PI * Math.max(0.02, Math.min(1, st.water));
  return (
    <group position={d.trap}>
      {/* vidrio */}
      <mesh rotation={[0, 0, Math.PI]}><torusGeometry args={[R, tube, 16, 40, Math.PI]} /><meshPhysicalMaterial color="#dff3ff" transmission={0.6} roughness={0.08} transparent opacity={0.32} depthWrite={false} emissive="#9fdcff" emissiveIntensity={0.25 * glow} /></mesh>
      {[-R, R].map((x, i) => <mesh key={i} position={[x, arm / 2, 0]}><cylinderGeometry args={[tube, tube, arm, 16, 1, true]} /><meshPhysicalMaterial color="#dff3ff" transmission={0.6} roughness={0.08} transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} /></mesh>)}
      {/* baba (biopelícula): capa gris verdosa pegada por dentro */}
      {st.slime > 0.02 && <mesh rotation={[0, 0, Math.PI]}><torusGeometry args={[R, tube * 0.93, 12, 40, Math.PI]} /><meshStandardMaterial color="#5f6b4a" roughness={0.9} transparent opacity={0.75 * st.slime} depthWrite={false} side={THREE.BackSide} /></mesh>}
      {st.slime > 0.02 && [-R, R].map((x, i) => <mesh key={i} position={[x, arm / 2, 0]}><cylinderGeometry args={[tube * 0.93, tube * 0.93, arm, 12, 1, true]} /><meshStandardMaterial color="#5f6b4a" roughness={0.9} transparent opacity={0.65 * st.slime} depthWrite={false} side={THREE.BackSide} /></mesh>)}
      {/* agua: arco centrado abajo, crece con el nivel; llena = sube por los dos brazos */}
      {st.water > 0.02 && <mesh rotation={[0, 0, -Math.PI / 2 - wArc / 2]}><torusGeometry args={[R, tube * 0.72, 12, 32, wArc]} /><meshPhysicalMaterial color="#4aa8e8" roughness={0.1} transmission={0.3} transparent opacity={0.85} emissive="#2b7fd0" emissiveIntensity={0.35} /></mesh>}
      {st.water > 0.98 && [-R, R].map((x, i) => <mesh key={i} position={[x, arm * 0.3, 0]}><cylinderGeometry args={[tube * 0.72, tube * 0.72, arm * 0.6, 12]} /><meshPhysicalMaterial color="#4aa8e8" roughness={0.1} transparent opacity={0.85} emissive="#2b7fd0" emissiveIntensity={0.35} /></mesh>)}
      {/* tapita de aceite sobre el agua (los dos brazos) */}
      {st.oil > 0.02 && st.water > 0.98 && [-R, R].map((x, i) => <mesh key={i} position={[x, arm * 0.61, 0]}><cylinderGeometry args={[tube * 0.74, tube * 0.74, 0.012 + 0.01 * st.oil, 16]} /><meshStandardMaterial color="#f2c13a" emissive="#f2a91a" emissiveIntensity={0.6 * st.oil} transparent opacity={0.95 * st.oil} toneMapped={false} /></mesh>)}
      {/* espuma: burbujas que se mueven por la curva */}
      {st.foam > 0.02 && Array.from({ length: 16 }, (_, i) => {
        const a = Math.PI + (i / 15) * Math.PI + Math.sin(t * 3 + i) * 0.08, rr = R + Math.sin(t * 5 + i * 2) * tube * 0.35;
        return <mesh key={i} position={[Math.cos(a) * rr, Math.sin(a) * rr, Math.cos(t * 4 + i) * tube * 0.3]} scale={st.foam * (0.6 + 0.4 * Math.sin(t * 7 + i))}><sphereGeometry args={[tube * 0.42, 10, 10]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} /></mesh>;
      })}
    </group>
  );
};

// el GAS que sube de la boca del desagüe (bocanadas verdosas)
const Gas: React.FC<{ p: V3; on: number; t: number }> = ({ p, on, t }) => {
  if (on < 0.02) return null;
  return <group position={p}>{Array.from({ length: 9 }, (_, i) => {
    const ph = ((t * 0.45 + i / 9) % 1), y = ph * 0.9, sc = (0.06 + ph * 0.16) * on;
    return <mesh key={i} position={[Math.sin(t * 1.3 + i * 2.1) * 0.08 * (1 + ph), y, Math.cos(t * 1.1 + i) * 0.06]} scale={sc}><sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color="#9fd65a" transparent opacity={0.32 * on * (1 - ph)} depthWrite={false} toneMapped={false} /></mesh>;
  })}<pointLight position={[0, 0.25, 0.1]} color="#a6e05c" intensity={0.9 * on} distance={0.9} /></group>;
};

// anillo que marca el desagüe del que se está hablando
const Ring: React.FC<{ p: V3; on: number; t: number; col?: string; r?: number }> = ({ p, on, t, col = "#ffb257", r = 0.36 }) => {
  if (on < 0.01) return null;
  const pul = 0.75 + 0.25 * Math.sin(t * 5);
  return (
    <group position={[p[0], p[1] + 0.005, p[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.84, r, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * on} toneMapped={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r * 0.84, 48]} /><meshBasicMaterial color={col} transparent opacity={0.14 * on * pul} toneMapped={false} /></mesh>
      <pointLight position={[0, 0.4, 0.2]} color={col} intensity={1.2 * on * pul} distance={1.2} />
    </group>
  );
};

const Grate: React.FC<{ p: V3; r: number; tex: ReturnType<typeof useCasaTex>; lift?: number }> = ({ p, r, tex, lift = 0 }) => (
  <group position={[p[0], p[1] + 0.008 + lift * 0.12, p[2] + lift * 0.18]} rotation={[-Math.PI / 2 + lift * 1.1, 0, 0]}>
    <mesh><circleGeometry args={[r, 32]} /><meshStandardMaterial map={tex.grate} roughness={0.4} metalness={0.7} /></mesh>
  </group>
);

const Washer: React.FC<{ hose: number }> = ({ hose }) => (
  <group position={[-5.1, 0, -1.85]}>
    <Box p={[0, 0.45, 0]} s={[0.66, 0.9, 0.62]} c="#eef0f1" r={0.35} m={0.1} rad={0.04} />
    <mesh position={[0, 0.48, 0.315]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.03, 32]} /><meshStandardMaterial color="#9fb3c4" roughness={0.1} metalness={0.4} /></mesh>
    <mesh position={[0, 0.48, 0.33]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.23, 0.03, 10, 32]} /><meshStandardMaterial color="#b9c0c6" metalness={0.7} roughness={0.3} /></mesh>
    <Box p={[0.2, 0.82, 0.3]} s={[0.12, 0.05, 0.02]} c="#2f3b47" />
    <Box p={[-0.22, 0.08, 0.315]} s={[0.12, 0.08, 0.01]} c="#cfd4d8" />{/* tapita del filtro */}
    {/* manguera gris al caño vertical: metida a fondo (hose=0) o a 10 cm (hose=1) */}
    <Pipe a={[0.2, 0.7, -0.28]} b={[0.55, 1.15, -0.3]} r={0.018} c="#6f7780" />
    <Pipe a={[0.55, 1.15, -0.3]} b={[0.65, 1.15 - (0.55 - 0.45 * hose), -0.23]} r={0.018} c="#6f7780" />
  </group>
);

const Sink2: React.FC<{ open: number }> = ({ open }) => (
  <group>
    {/* mueble bajo mesada con puertas que se abren (se ve el sifón) */}
    <Box p={[-2.2, 0.06, -1.95]} s={[1.6, 0.1, 0.62]} c="#5d4a37" />
    <Box p={[-2.2, 0.45, -2.24]} s={[1.6, 0.8, 0.04]} c="#5d4a37" />
    <Box p={[-2.98, 0.45, -1.95]} s={[0.04, 0.8, 0.62]} c="#6d5843" />
    <Box p={[-1.42, 0.45, -1.95]} s={[0.04, 0.8, 0.62]} c="#6d5843" />
    <group position={[-2.95, 0.45, -1.64]} rotation={[0, -1.7 * open, 0]}><Box p={[0.37, 0, 0]} s={[0.74, 0.76, 0.03]} c="#7d6650" /></group>
    <group position={[-1.45, 0.45, -1.64]} rotation={[0, 1.7 * open, 0]}><Box p={[-0.37, 0, 0]} s={[0.74, 0.76, 0.03]} c="#7d6650" /></group>
    {/* mesada con dos tarjas de acero */}
    <Box p={[-2.2, 0.88, -1.95]} s={[1.64, 0.05, 0.66]} c="#d8d2c6" r={0.4} />
    {[-2.45, -1.85].map((x, i) => <group key={i}><Box p={[x, 0.82, -1.95]} s={[0.5, 0.16, 0.42]} c="#b9bec3" m={0.85} r={0.25} rad={0.05} /><mesh position={[x, 0.905, -1.95]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.44, 0.36]} /><meshStandardMaterial color="#cfd3d6" metalness={0.9} roughness={0.2} /></mesh><Cyl p={[x, 0.91, -1.95]} r={0.035} h={0.005} c="#2a2e33" m={0.6} /></group>)}
    <Cyl p={[-2.15, 1.05, -2.2]} r={0.02} h={0.3} c="#c9cdd1" m={0.95} ro={0.15} />
    <Pipe a={[-2.15, 1.18, -2.2]} b={[-2.15, 1.18, -2.02]} r={0.018} c="#c9cdd1" />
    <Pipe a={[-2.45, 0.74, -1.95]} b={[-2.2, 0.62, -1.95]} r={0.03} />
    <Pipe a={[-1.85, 0.74, -1.95]} b={[-2.0, 0.62, -1.95]} r={0.03} />
    <Pipe a={[-2.0, 0.62, -1.95]} b={[-2.0, 0.55, -1.95]} r={0.03} />
  </group>
);

const Lavabo: React.FC<{ x: number; small?: boolean; tapon: number }> = ({ x, small, tapon }) => {
  const k = small ? 0.85 : 1;
  return (
    <group position={[x, 0, -2.0]}>
      <Cyl p={[0, 0.38, 0.02]} r={0.09 * k} h={0.76} c="#f4f3ef" ro={0.25} />
      <mesh position={[0, 0.84, 0.06]} castShadow><cylinderGeometry args={[0.28 * k, 0.2 * k, 0.16, 32]} /><meshStandardMaterial color="#f7f6f2" roughness={0.18} /></mesh>
      <mesh position={[0, 0.925, 0.06]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.22 * k, 32]} /><meshStandardMaterial color="#e9eaea" roughness={0.15} /></mesh>
      {/* tapón automático (sube con la mecha de pelo) + agujerito del rebosadero en el borde */}
      <Cyl p={[0, 0.93 + 0.14 * tapon, 0.06]} r={0.028} h={0.02 + 0.14 * tapon} c={tapon > 0.3 ? "#3b3428" : "#c9cdd1"} m={0.7} ro={0.3} />
      <Cyl p={[0, 0.88, 0.155]} r={0.016} h={0.01} c="#1c1c1c" rot={[Math.PI / 2, 0, 0]} />
      <Cyl p={[0, 1.02, -0.18]} r={0.018} h={0.2} c="#c9cdd1" m={0.95} ro={0.15} />
      {!small && <Box p={[0, 1.55, -0.2]} s={[0.55, 0.7, 0.03]} c="#b7c6cf" m={0.9} r={0.05} />}
    </group>
  );
};

const Toilet: React.FC<{ x: number }> = ({ x }) => (
  <group position={[x, 0, -1.9]}>
    <mesh position={[0, 0.2, 0.15]} castShadow><cylinderGeometry args={[0.16, 0.13, 0.4, 28]} /><meshStandardMaterial color="#f6f5f1" roughness={0.2} /></mesh>
    <mesh position={[0, 0.41, 0.2]} scale={[1, 0.25, 1.3]} castShadow><sphereGeometry args={[0.2, 28, 16]} /><meshStandardMaterial color="#f6f5f1" roughness={0.2} /></mesh>
    <Box p={[0, 0.65, -0.18]} s={[0.42, 0.42, 0.18]} c="#f6f5f1" r={0.2} rad={0.04} />
    <Box p={[0.14, 0.84, -0.18]} s={[0.06, 0.02, 0.03]} c="#c9cdd1" m={0.9} r={0.2} />
    {/* anillo de cera debajo (se ve en el corte del piso) */}
    <mesh position={[0, -0.02, 0.15]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.022, 10, 24]} /><meshStandardMaterial color="#d9b24a" roughness={0.6} /></mesh>
  </group>
);

const Room: React.FC<{ x0: number; x1: number; floor: string; wall: Tx; fmap?: Tx; out?: boolean }> = ({ x0, x1, floor, wall, fmap, out }) => {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  return (
    <group>
      <mesh position={[cx, 0, -1.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.4]} /><meshStandardMaterial color={floor} map={fmap} roughness={0.75} /></mesh>
      {!out && <Box p={[cx, 1.3, -2.3]} s={[w, 2.6, 0.08]} c="#ffffff" map={wall} r={0.9} rad={0.01} />}
      <Box p={[x1, 0.7, -1.1]} s={[0.08, 1.4, 2.4]} c="#d9d2c4" r={0.95} rad={0.01} />
    </group>
  );
};

export type WorldState = {
  lamps: number; xray: number; doors: number; hose: number; tapon: number; nest: number; dust: number; lift: Partial<Record<DK, number>>;
  trap: Partial<Record<DK, Partial<TrapSt>>>; gas: Partial<Record<DK, number>>; ring: Partial<Record<DK, number>>; ringCol?: string;
};
const T0: TrapSt = { water: 1, slime: 0, foam: 0, oil: 0 };
const TRAPS: DK[] = ["patio", "washer", "kitchen", "dish", "lav", "toilet", "floor", "shower", "tub", "guest"];

export const World: React.FC<{ t: number; camAt: ReturnType<typeof makeCam>["camAt"]; st: WorldState }> = ({ t, camAt, st }) => {
  const tx = useTextures(), tex = useCasaTex();
  const glass = 0.35 + 0.65 * st.xray;
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0, 3, 8] }}>
      <Cam t={t} camAt={camAt} />
      <color attach="background" args={["#1a2433"]} />
      <fog attach="fog" args={["#1a2433", 16, 42]} />
      <ambientLight intensity={0.35} color="#c9d6ee" />
      <hemisphereLight args={["#dfe9ff", "#4a3a2a", 0.45]} />
      <directionalLight position={[-5, 9, 7]} intensity={1.1} color="#fff1dc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />
      {[[-7.6, 2.2, -0.6], [-5.0, 2.2, -1.2], [-2.0, 2.2, -1.2], [1.6, 2.2, -1.2], [4.4, 2.2, -1.2], [7.0, 2.2, -1.2]].map((p, i) => <pointLight key={i} position={p as V3} intensity={2.0 * st.lamps} distance={4.5} color="#ffd9a8" castShadow={i === 3} />)}
      {/* luz fría desde abajo para el corte de tierra (los sifones se leen) */}
      <pointLight position={[0, -0.6, 1.4]} intensity={2.2 * glass} distance={14} color="#9fd2ff" />
      {/* bloque de tierra cortado + pasto alrededor */}
      <mesh position={[-0.5, -0.015, 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[26, 3]} /><meshStandardMaterial map={tex.grass} roughness={1} /></mesh>
      <Box p={[-0.5, -0.72, -1.05]} s={[26, 1.4, 2.5]} c="#6a503a" map={tex.soil} r={1} rad={0.01} cast={false} o={1 - 0.55 * st.xray} />
      {/* habitaciones */}
      <Room x0={-9.2} x1={-6.2} floor="#9a9a96" wall={tex.plaster} out />
      <Room x0={-6.2} x1={-4.0} floor="#c9c3b6" wall={tex.wtile} fmap={tex.ftile} />
      <Room x0={-4.0} x1={0.0} floor="#b9a68a" wall={tex.plaster} fmap={tx.planks} />
      <Room x0={0.0} x1={5.9} floor="#d8d1c4" wall={tex.wtile} fmap={tex.ftile} />
      <Room x0={5.9} x1={8.0} floor="#cfc8b9" wall={tex.wtile} fmap={tex.ftile} />
      <Box p={[-9.2, 0.7, -1.1]} s={[0.08, 1.4, 2.4]} c="#d9d2c4" r={0.95} rad={0.01} />
      {/* PATIO: macetas, manguera enrollada */}
      {[[-8.6, -1.9], [-8.2, -2.0], [-6.7, -1.95]].map(([x, z], i) => <group key={i}><Cyl p={[x, 0.18, z]} r={0.16} h={0.36} c="#b5653c" ro={0.9} /><mesh position={[x, 0.5, z]} castShadow><sphereGeometry args={[0.24, 14, 12]} /><meshStandardMaterial color={["#3f7a34", "#4f8a3a", "#5c8f3c"][i]} roughness={0.9} /></mesh></group>)}
      <mesh position={[-6.75, 0.35, -1.2]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.22, 0.03, 10, 30]} /><meshStandardMaterial color="#2f8f4a" roughness={0.6} /></mesh>
      <Grate p={DR.patio.mouth} r={0.15} tex={tex} lift={st.lift.patio ?? 0} />
      {/* LAVADERO */}
      <Washer hose={st.hose} />
      <Pipe a={[-4.45, -0.2, -2.12]} b={[-4.45, 1.0, -2.12]} r={0.045} />
      {/* COCINA */}
      <Sink2 open={st.doors} />
      <Box p={[-0.75, 0.43, -1.95]} s={[0.6, 0.86, 0.62]} c="#c3c8cc" m={0.6} r={0.3} />
      <Box p={[-0.75, 0.78, -1.635]} s={[0.5, 0.06, 0.02]} c="#2a2e33" />
      <Box p={[-0.75, 0.88, -1.95]} s={[0.64, 0.05, 0.66]} c="#d8d2c6" r={0.4} />
      {/* BAÑO */}
      <Lavabo x={0.85} tapon={st.tapon} />
      <Toilet x={2.05} />
      <Grate p={DR.floor.mouth} r={0.1} tex={tex} lift={st.lift.floor ?? 0} />
      <Grate p={DR.shower.mouth} r={0.1} tex={tex} lift={st.lift.shower ?? 0} />
      <Box p={[3.4, 1.0, -1.45]} s={[0.02, 2.0, 1.4]} c="#cfe6ee" r={0.05} o={0.28} />
      <Cyl p={[4.0, 2.1, -2.15]} r={0.11} h={0.03} c="#c9cdd1" m={0.95} ro={0.2} rot={[Math.PI / 2.4, 0, 0]} />
      <Box p={[5.15, 0.28, -1.75]} s={[1.4, 0.56, 0.95]} c="#f4f3ef" r={0.22} rad={0.12} />
      <Box p={[5.15, 0.5, -1.75]} s={[1.24, 0.08, 0.8]} c="#e6ecef" r={0.1} />
      <Cyl p={[5.72, 0.42, -1.75]} r={0.04} h={0.01} c="#c9cdd1" rot={[0, 0, Math.PI / 2]} m={0.9} />
      {/* BAÑO DE VISITAS (polvo, telaraña) */}
      <Lavabo x={6.75} small tapon={0} />
      <Toilet x={7.45} />
      {st.dust > 0.02 && <mesh position={[7.0, 0.01, -1.3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.9, 1.8]} /><meshBasicMaterial map={tex.dust} transparent opacity={st.dust} depthWrite={false} /></mesh>}
      {/* CAÑERÍA: bajadas de cada sifón al caño principal, y el principal a la calle */}
      <Pipe a={[7.6, -0.88, -1.2]} b={[-10.8, -0.92, -1.2]} r={0.075} c="#8d969e" o={glass} />
      {TRAPS.map((k) => { const d = DR[k]; const out: V3 = [d.trap[0] + d.r, d.trap[1] + d.r * 1.2, d.trap[2]]; return <Pipe key={k} a={out} b={[out[0], -0.88, -1.2]} r={0.035} c="#9aa3ab" o={glass} />; })}
      {/* TUBO DE VENTILACIÓN que sube al techo, con su sombrerito (y el nido que lo tapa) */}
      <Pipe a={[6.15, -0.88, -2.15]} b={[6.15, 3.3, -2.15]} r={0.05} c="#9aa3ab" />
      <Cyl p={[6.15, 3.36, -2.15]} r={0.09} h={0.04} c="#6c757d" m={0.6} />
      {st.nest > 0.02 && <mesh position={[6.15, 3.32, -2.15]} scale={st.nest}><torusGeometry args={[0.09, 0.05, 8, 18]} /><meshStandardMaterial color="#6b5235" roughness={1} /></mesh>}
      {/* los sifones, el gas y los anillos */}
      {TRAPS.map((k) => <Trap key={k} d={DR[k]} st={{ ...T0, ...(st.trap[k] ?? {}) }} t={t} glow={st.xray} />)}
      {DKS.map((k) => <Gas key={k} p={DR[k].mouth} on={st.gas[k] ?? 0} t={t + DKS.indexOf(k) * 0.37} />)}
      {DKS.map((k) => <Ring key={k} p={DR[k].ring} on={st.ring[k] ?? 0} t={t} col={st.ringCol} />)}
      <Post bloom={0.35} threshold={0.93} exposure={1.0} env={0.3} />
    </ThreeCanvas>
  );
};
