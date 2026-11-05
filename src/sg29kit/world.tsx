// sg29kit · EL JARDÍN DE SACHIKO (común a los 5 videos de la tanda): casa vieja de madera blanca con porche y mesa, cantero grande,
// cantero de tomates, caqui, roble, cerca, comedero, galpón con ristras de ají. UNA escena, UNA cámara (keys del video).
// Cada video mete SUS objetos como children (frascos, balde, rociadores, césped, hojas) y su estado (estación, luz, crecimiento).
// Anti-bugs 3D de la casa: nada a escala 0 (bloom → NaN, rectángulo negro), tablas ≥0,04 sobre el piso, luces siempre montadas.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../cme3d01/fx3d";

export const W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
export const ease3 = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export type V = [number, number, number];
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// ---------------- puntos fijos del jardín ----------------
export const PT = {
  table: [1.2, 0.98, -1.9] as V, porch: [0.9, 0.35, -2.3] as V, door: [1.3, 1.1, -3.0] as V,
  bed: [3.2, 0.1, 0.6] as V, tomato: [5.6, 0.9, -0.6] as V, feeder: [2.6, 1.7, 3.2] as V,
  oak: [7.6, 2.4, 1.6] as V, fence: [6.6, 1.25, 9.4] as V, persimmon: [-2.6, 2.2, 1.6] as V,
  shed: [-4.6, 1.4, -0.4] as V, lawn: [4.5, 0.02, 4.8] as V, curb: [2.0, 0.05, 8.5] as V,
};

// ---------------- encuadres con nombre (cada video suma los suyos) ----------------
export const F0: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [7.6, 3.6, 5.6], l: [1.4, 1.0, -1.4], fov: 50 },
  wideLow: { p: [6.2, 1.25, 3.05], l: [1.4, 1.2, -1.8], fov: 56 },
  high: { p: [3.2, 10.5, 6.2], l: [2.4, 0, -0.6], fov: 50 },
  porch: { p: [1.3, 1.55, -0.45], l: [1.2, 0.98, -1.95], fov: 40 },
  table: { p: [1.22, 1.3, -1.15], l: [1.2, 0.98, -1.95], fov: 34 },
  tableTop: { p: [1.2, 1.85, -1.5], l: [1.2, 0.96, -1.95], fov: 36 },
  bed: { p: [3.2, 1.6, 2.8], l: [3.2, 0.1, 0.45], fov: 42 },
  bedLow: { p: [2.6, 0.62, 1.75], l: [3.3, 0.06, 0.45], fov: 38 },
  bedTop: { p: [3.25, 2.6, 1.1], l: [3.2, 0.05, 0.55], fov: 40 },
  tomato: { p: [4.1, 1.35, 1.0], l: [5.6, 0.8, -0.6], fov: 40 },
  tomatoClose: { p: [4.7, 1.0, 0.25], l: [5.6, 0.85, -0.6], fov: 34 },
  feeder: { p: [1.2, 1.85, 1.5], l: [2.6, 1.72, 3.2], fov: 38 },
  oak: { p: [4.4, 2.0, -1.4], l: [7.2, 3.0, 1.6], fov: 48 },
  persimmon: { p: [0.2, 1.75, 3.05], l: [-3.0, 1.5, 0.6], fov: 50 },
  shed: { p: [-2.4, 1.5, 0.6], l: [-3.6, 1.2, -0.4], fov: 38 },
  fence: { p: [5.3, 1.35, 6.4], l: [6.6, 1.2, 9.3], fov: 40 },
  lawn: { p: [1.0, 1.4, 1.2], l: [5.0, 0.0, 5.5], fov: 50 },
  lawnLow: { p: [3.0, 0.35, 3.0], l: [5.5, 0.05, 5.6], fov: 44 },
  curb: { p: [0.4, 1.6, 4.6], l: [2.2, 0.2, 8.6], fov: 46 },
  step: { p: [3.0, 0.9, 0.6], l: [1.6, 0.4, -1.6], fov: 44 },
};
/** arma la cámara única: una lista [segundo, encuadre, empuje?, arco?] → keys ordenadas */
export const mkKeys = (F: Record<string, { p: number[]; l: number[]; fov: number }>, list: [number, string, number?, number?][]): Key[] =>
  list.slice().sort((a, b) => a[0] - b[0]).map(([t, n, push = 0, arc]) => {
    const f = F[n]; if (!f) throw new Error("encuadre desconocido " + n);
    const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
    return { t, p, l: f.l, fov: f.fov - push * 6, arc };
  });

// ---------------- CÁMARA ----------------
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const camAt = (KEYS: Key[], t: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t <= t) i++;
  const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  // viaje de 3,2 s como máximo al llegar a la nueva key (el resto del tramo, deriva lenta hacia adentro: cámara siempre viva)
  const dur = Math.min(3.2, Math.max(0.01, b.t - a.t));
  const k = b.t > a.t ? ease3((t - (b.t - dur)) / dur) : 0;
  const drift = b.t > a.t ? cl((t - a.t) / (b.t - a.t)) : 0;
  const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
  p.lerp(l, 0.06 * drift * (1 - k));
  if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * 3;
  else p.x += Math.sin(Math.PI * k) * 0.25 * p.distanceTo(l) * 0.15; // nunca recta: curva suave lateral
  p.x += Math.sin(t * 2.6) * 0.006 + Math.sin(t * 0.9) * 0.01; p.y += Math.sin(t * 3.4 + 1) * 0.005 + Math.sin(t * 1.3) * 0.006;
  l.x += Math.sin(t * 1.1 + 2) * 0.008;
  return { p, l, fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
};
export const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
  const cam = new THREE.PerspectiveCamera(cm.fov, W / H, 0.02, 400); cam.position.copy(cm.p); cam.lookAt(cm.l); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = q.clone().project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};
export const screenOf = (KEYS: Key[], t: number, q: V) => project(camAt(KEYS, t), v3(q));
const Cam: React.FC<{ keys: Key[]; t: number }> = ({ keys, t }) => {
  const { camera } = useThree(); const cm = camera as THREE.PerspectiveCamera;
  const k = camAt(keys, t);
  cm.position.copy(k.p); cm.up.set(0, 1, 0); cm.lookAt(k.l); cm.fov = k.fov; cm.near = 0.02; cm.far = 400; cm.updateProjectionMatrix();
  return null;
};

// ---------------- texturas propias (deterministas) ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
export const useTex = () => useMemo(() => ({
  clap: mk(256, 256, (g) => {
    g.fillStyle = "#ece8de"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 32) { g.fillStyle = "rgba(90,85,70,.28)"; g.fillRect(0, y + 28, 256, 4); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(0, y, 256, 2); }
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(120,110,90,${0.1 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 6, 1); }
  }, [3, 2]),
  wood: mk(256, 256, (g) => {
    g.fillStyle = "#9a7650"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(70,45,22,${0.12 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(80, y + 4 * rnd(k, 3), 170, y - 4, 256, y + 2); g.stroke(); }
  }, [2, 1]),
  grey: mk(256, 256, (g) => {
    g.fillStyle = "#7d7568"; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(30,26,20,.5)"; g.fillRect(x, 0, 3, 256); }
    for (let k = 0; k < 60; k++) { g.strokeStyle = `rgba(40,34,26,${0.1 + rnd(k, 1) * 0.2})`; g.lineWidth = 1; g.beginPath(); const x = rnd(k, 2) * 256; g.moveTo(x, 0); g.lineTo(x + (rnd(k, 3) - 0.5) * 8, 256); g.stroke(); }
  }, [2, 1]),
  shingle: mk(256, 256, (g) => {
    g.fillStyle = "#4a4440"; g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = 55 + rnd(r * 8 + c, 1) * 30; g.fillStyle = `rgb(${v},${v - 4},${v - 8})`; g.fillRect(c * 32 + (r % 2) * 16, r * 32, 30, 28); }
  }, [4, 3]),
  soil: mk(256, 256, (g) => {
    g.fillStyle = "#3a2a1e"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { const v = 30 + rnd(i, 1) * 50; g.fillStyle = `rgba(${v + 20},${v + 8},${v},.6)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); }
  }, [2, 2]),
  grass: mk(256, 256, (g) => {
    g.fillStyle = "#5d7a3a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) { const v = rnd(i, 1); g.fillStyle = `rgba(${60 + v * 60},${90 + v * 60},${30 + v * 20},.5)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1, 3); }
  }, [30, 30]),
  label: (txt: string, col: string) => mk(256, 128, (g) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 256, 128); g.fillStyle = col; g.font = "700 60px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 68); }),
}), []);
export type Tx = THREE.Texture | undefined;

// ---------------- piezas ----------------
export const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
export const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; seg?: number; r2?: number; op?: number; map?: Tx; e?: string; ei?: number }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, seg = 20, r2, op, map, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} transparent={op !== undefined} opacity={op ?? 1} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
export const Ball: React.FC<{ p: V; r: number; c: string; s?: V; rough?: number; flat?: boolean; e?: string; ei?: number }> = ({ p, r, c, s, rough = 0.8, flat, e, ei = 0 }) => (
  <mesh position={p} scale={s} castShadow><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color={c} roughness={rough} flatShading={flat} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
/** aparece/desaparece SIN escala 0 (bloom con escala 0 = rectángulo negro): visible sólo si k>0.02 */
export const Pop: React.FC<{ k: number; p: V; drop?: number; children: React.ReactNode }> = ({ k, p, drop = 0.5, children }) => {
  if (k <= 0.02) return null;
  const q = ease3(k);
  return <group position={[p[0], p[1] + (1 - q) * drop, p[2]]} scale={Math.max(0.05, q)}>{children}</group>;
};
export const Jar: React.FC<{ fill: string; lid: string; tex?: Tx; h?: number; r?: number; level?: number }> = ({ fill, lid, tex, h = 0.16, r = 0.055, level = 0.78 }) => (
  <group>
    <Cyl p={[0, h / 2, 0]} r={r} h={h} c="#dfeaf0" rough={0.05} op={0.35} />
    <Cyl p={[0, h * level * 0.5 + 0.005, 0]} r={r * 0.9} h={Math.max(0.01, h * level)} c={fill} rough={0.9} />
    <Cyl p={[0, h + 0.015, 0]} r={r * 1.02} h={0.03} c={lid} m={0.5} rough={0.3} />
    {tex && <mesh position={[0, h * 0.5, r + 0.002]}><planeGeometry args={[r * 1.5, r * 0.75]} /><meshStandardMaterial map={tex} roughness={0.8} /></mesh>}
  </group>
);

const Tree: React.FC<{ p: V; t: number; h: number; spread: number; cols: string[]; trunk?: string; n?: number; bare?: number; fruit?: number }> = ({ p, t, h, spread, cols, trunk = "#4a3a2c", n = 22, bare = 0, fruit = 0 }) => (
  <group position={p}>
    <Cyl p={[0, h * 0.45, 0]} r={0.12 * h / 3} r2={0.2 * h / 3} h={h * 0.9} c={trunk} rough={0.95} />
    {[0, 1, 2, 3].map((i) => <Cyl key={i} p={[Math.cos(i * 1.6) * 0.35, h * 0.78, Math.sin(i * 1.6) * 0.35]} r={0.03} r2={0.06} h={h * 0.4} c={trunk} rot={[Math.sin(i * 1.6) * 0.7, 0, -Math.cos(i * 1.6) * 0.7]} />)}
    {Array.from({ length: n }, (_, i) => {
      if (rnd(i, 9) < bare) return null;
      return <mesh key={i} position={[(rnd(i, 1) - 0.5) * spread + Math.sin(t * 0.6 + i) * 0.015, h * 0.8 + rnd(i, 2) * h * 0.45, (rnd(i, 3) - 0.5) * spread * 0.8]} castShadow>
        <icosahedronGeometry args={[0.35 + rnd(i, 4) * 0.3, 1]} /><meshStandardMaterial color={cols[i % cols.length]} roughness={0.9} flatShading /></mesh>;
    })}
    {fruit > 0 && Array.from({ length: 26 }, (_, i) => <Ball key={"f" + i} p={[(rnd(i, 11) - 0.5) * spread * 0.9, h * 0.8 + rnd(i, 12) * h * 0.4, (rnd(i, 13) - 0.5) * spread * 0.7 + 0.2]} r={0.06} c="#e8771c" rough={0.4} />)}
  </group>
);

/** estado común del jardín (cada video lo calcula con su línea de tiempo) */
export type GState = { season: number; dawn: number; frost: number; shade: number; tom: number; ripe: number; bedSoil?: number; lawnBrown?: number };

// ===================================================================================================
export const Garden: React.FC<{ t: number; keys: Key[]; st: GState; children?: React.ReactNode }> = ({ t, keys, st, children }) => {
  const tt = useTex();
  const se = st.season;
  const leafCols = se < 1 ? ["#c9562f", "#d98a2f", "#b8442a", "#e0a63a"] : se < 2 ? ["#6f6a60"] : se < 3 ? ["#8fbf5a", "#a6cf6a", "#79ad4c"] : ["#4f7f34", "#5d8f3a", "#3f6f2c"];
  const bare = se >= 1 && se < 2 ? 0.85 : 0;
  const { frost, dawn } = st;
  const sky = new THREE.Color("#c9d3d8").lerp(new THREE.Color("#e8c9a8"), dawn * 0.6).lerp(new THREE.Color("#dfe6ea"), frost * 0.5);
  const grassCol = new THREE.Color("#ffffff").lerp(new THREE.Color("#e6eef2"), frost).lerp(new THREE.Color("#c9b27a"), (st.lawnBrown ?? 0) * 0.6);
  const sunCol = new THREE.Color("#fff1dc").lerp(new THREE.Color("#ffc68a"), dawn);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam keys={keys} t={t} />
      <Post bloom={0.45} threshold={0.9} exposure={0.92 * (1 - 0.28 * st.shade)} env={0.45} />
      <color attach="background" args={[sky.getStyle()]} />
      <fogExp2 attach="fog" args={[sky.getStyle(), 0.02]} />
      <hemisphereLight args={["#f3efe6", "#6a5a40", 0.72]} />
      <directionalLight position={[10, lerp(9, 3.5, dawn), 6]} intensity={lerp(1.8, 1.4, dawn)} color={sunCol.getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[1.2, 2.2, -1.6]} intensity={0.5} distance={4} color="#fff0dc" />

      {/* césped (cara en y=0) y camino de ladrillo apoyado en 0,04 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[90, 90]} /><meshStandardMaterial map={tt.grass} color={grassCol} roughness={1} /></mesh>
      {Array.from({ length: 14 }, (_, i) => <Box key={i} p={[1.6 + i * 0.22, 0.02, -0.6 + i * 0.06]} s={[0.2, 0.04, 0.42]} c={["#8a4a36", "#7a4030", "#94523c"][i % 3]} r={0.95} rad={0.008} />)}

      {/* ===== LA CASA (cerrada) ===== */}
      <Box p={[-0.8, 1.3, -4.5]} s={[6.4, 2.6, 3]} c="#ffffff" map={tt.clap} r={0.85} rad={0.01} />
      {[-2.6, 0.0].map((x) => <group key={x}>
        <Box p={[x, 1.5, -2.99]} s={[0.9, 1.0, 0.04]} c="#9fb7c4" r={0.1} m={0.2} rad={0.01} />
        <Box p={[x, 1.5, -2.97]} s={[1.0, 0.06, 0.04]} c="#f5f2ea" rad={0.005} /><Box p={[x, 1.5, -2.97]} s={[0.06, 1.1, 0.04]} c="#f5f2ea" rad={0.005} />
      </group>)}
      {[-1, 1].map((sd) => <group key={sd} position={[-0.8, 3.45, -4.5 + sd * 0.82]} rotation={[sd * 0.78, 0, 0]}>
        <Box p={[0, 0, 0]} s={[6.7, 0.08, 2.3]} c="#ffffff" map={tt.shingle} r={0.9} rad={0.01} />
      </group>)}
      {[-4.0, 2.4].map((x) => <mesh key={x} position={[x, 2.6, -4.5]} rotation={[0, -Math.PI / 2, 0]}><shapeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-1.55, 0); sh.lineTo(1.55, 0); sh.lineTo(0, 1.55); sh.closePath(); return sh; })()]} /><meshStandardMaterial map={tt.clap} color="#ffffff" side={THREE.DoubleSide} /></mesh>)}
      <Box p={[-0.8, 2.95, -2.92]} s={[6.7, 0.16, 0.05]} c="#f4f1ea" rad={0.005} />
      <Cyl p={[-0.8, 2.86, -2.82]} r={0.06} h={6.7} c="#c8ccd0" m={0.6} rough={0.4} rot={[0, 0, Math.PI / 2]} />
      <Box p={[-2.9, 4.1, -4.4]} s={[0.5, 1.4, 0.5]} c="#8a4a36" r={0.95} rad={0.01} />

      {/* ===== EL PORCHE y LA MESA ===== */}
      <Box p={[0.9, 0.3, -2.3]} s={[2.4, 0.08, 1.5]} c="#9a7650" map={tt.wood} r={0.8} rad={0.01} />
      {[[-0.25, -1.6], [2.05, -1.6]].map(([x, z], i) => <Box key={i} p={[x, 1.5, z]} s={[0.1, 2.4, 0.1]} c="#f4f1ea" rad={0.01} />)}
      <Box p={[0.9, 2.65, -2.1]} s={[2.5, 0.06, 1.3]} c="#f4f1ea" rad={0.01} />
      <Box p={[1.3, 1.1, -3.0]} s={[0.9, 1.9, 0.05]} c="#5d6f63" r={0.6} rad={0.01} />
      {[0, 1].map((i) => <Box key={i} p={[1.6, 0.1 + i * 0.1, -1.4 - i * 0.2]} s={[1.0, 0.1, 0.3]} c="#8a6a48" map={tt.wood} rad={0.01} />)}
      <Box p={[PT.table[0], 0.93, PT.table[2]]} s={[1.0, 0.05, 0.6]} c="#7a5a3a" map={tt.wood} rad={0.01} />
      {[[-0.42, -0.24], [0.42, -0.24], [-0.42, 0.24], [0.42, 0.24]].map(([x, z], i) => <Box key={i} p={[PT.table[0] + x, 0.62, PT.table[2] + z]} s={[0.05, 0.6, 0.05]} c="#5a3d26" rad={0.008} />)}

      {/* ===== EL CANTERO GRANDE ===== */}
      <group position={PT.bed}>
        <Box p={[0, 0.06, 0]} s={[2.4, 0.36, 1.3]} c="#7a5a3a" map={tt.wood} rad={0.01} />
        <Box p={[0, 0.22, 0]} s={[2.3, 0.06, 1.2]} c="#ffffff" map={tt.soil} r={1} rad={0.01} />
      </group>
      {/* ===== EL CANTERO DE TOMATES ===== */}
      <group position={[PT.tomato[0], 0, PT.tomato[2]]}>
        <Box p={[0, 0.18, 0]} s={[1.4, 0.36, 2.2]} c="#7a5a3a" map={tt.wood} rad={0.01} />
        <Box p={[0, 0.37, 0]} s={[1.3, 0.04, 2.1]} c="#ffffff" map={tt.soil} r={1} rad={0.01} />
        {[-0.7, 0, 0.7].map((z, i) => { const g = Math.max(0.15, st.tom);
          return <group key={i} position={[0, 0.38, z]}>
            <Cyl p={[0.1, 0.6, 0]} r={0.012} h={1.2} c="#8a6a3a" />
            {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[(rnd(j + i * 9, 1) - 0.5) * 0.4, 0.15 + rnd(j + i * 9, 2) * 0.9 * g, (rnd(j + i * 9, 3) - 0.5) * 0.4]} scale={g}><icosahedronGeometry args={[0.13, 0]} /><meshStandardMaterial color="#4f7f34" flatShading /></mesh>)}
            {[0, 1, 2, 3].map((j) => { const ripe = cl(st.ripe * 4 - j * 0.6);
              return <Ball key={"t" + j} p={[0.14 * Math.cos(j * 1.7), 0.35 + j * 0.15, 0.14 * Math.sin(j * 1.7)]} r={0.055 * g} c={new THREE.Color("#6f9f3a").lerp(new THREE.Color("#d42a1e"), ripe).getStyle()} rough={0.35} />; })}
          </group>; })}
      </group>

      {/* ===== EL CAQUI, EL ROBLE, LA CERCA ===== */}
      <Tree p={[PT.persimmon[0], 0, PT.persimmon[2]]} t={t} h={2.4} spread={2.2} cols={leafCols} n={18} bare={bare} fruit={se < 1 ? 1 : 0} />
      <Tree p={[PT.oak[0], 0, PT.oak[2]]} t={t + 3} h={4.2} spread={4.2} cols={leafCols} trunk="#3d3226" n={30} bare={bare} />
      {Array.from({ length: 26 }, (_, i) => <Box key={i} p={[-6 + i * 0.6, 0.72, 9.4]} s={[0.55, 1.4, 0.05]} c="#ffffff" map={tt.grey} r={0.95} rad={0.005} />)}
      {Array.from({ length: 22 }, (_, i) => <Box key={"z" + i} p={[9.6, 0.72, 9.1 - i * 0.6]} s={[0.05, 1.4, 0.55]} c="#ffffff" map={tt.grey} r={0.95} rad={0.005} />)}

      {/* ===== EL COMEDERO ===== */}
      <group position={[PT.feeder[0], 0, PT.feeder[2]]}>
        <Cyl p={[0, 0.85, 0]} r={0.025} h={1.7} c="#2a2a2a" m={0.7} rough={0.3} />
        <Box p={[0, 1.78, 0]} s={[0.22, 0.24, 0.22]} c="#dfeaf0" r={0.05} op={0.4} rad={0.01} />
        <Box p={[0, 1.72, 0]} s={[0.2, 0.14, 0.2]} c="#c9a86a" r={1} rad={0.01} />
        <mesh position={[0, 1.95, 0]}><coneGeometry args={[0.2, 0.12, 4]} /><meshStandardMaterial color="#5a3d26" /></mesh>
        <Box p={[0, 1.6, 0]} s={[0.34, 0.02, 0.34]} c="#5a3d26" rad={0.004} />
      </group>

      {/* ===== EL GALPÓN con las ristras de ají ===== */}
      <group position={[PT.shed[0], 0, PT.shed[2]]}>
        <Box p={[0, 1.02, 0]} s={[1.8, 2.0, 1.6]} c="#ffffff" map={tt.grey} r={0.95} rad={0.01} />
        <group position={[0, 2.2, 0]}><Box p={[0, 0, 0]} s={[2.2, 0.08, 2.0]} c="#3a3430" rot={[0, 0, 0.2]} rad={0.01} /></group>
        <Box p={[0.91, 0.92, 0.1]} s={[0.04, 1.7, 0.8]} c="#5a4a38" rad={0.005} />
        {[-0.5, 0, 0.5].map((z, i) => <group key={i} position={[1.0, 1.5, z]}>
          {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[0, -j * 0.08, Math.sin(t * 1.4 + j + i) * 0.006]} rotation={[0, 0, 0.3 * (j % 2 ? 1 : -1)]}><coneGeometry args={[0.022, 0.09, 8]} /><meshStandardMaterial color={["#b8321e", "#9e2a18", "#c8401e"][j % 3]} roughness={0.5} /></mesh>)}
        </group>)}
      </group>

      {/* ===== lo propio de cada video ===== */}
      {children}

      {/* escarcha (siempre montada, opacidad por estado) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}><planeGeometry args={[90, 90]} /><meshStandardMaterial color="#f2f6f8" transparent opacity={0.35 * frost} roughness={0.6} depthWrite={false} /></mesh>
    </ThreeCanvas>
  );
};
