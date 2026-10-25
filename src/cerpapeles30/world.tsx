// cer30 · EL MUNDO de los videos largos de Claudio: una maqueta en corte de casa de muñecas por video (scene).
// papeles = la casa de cerpapeles (garaje, cocina, sala, estudio, dormitorio, placard) · joyas = cocina, baño, dormitorio
// grande (cómoda con joyero, mesita con platito, cama con valija debajo, ropero con abrigos y la lata arriba) y el cuarto de
// costura (caja de costura = donde las guarda el cerrajero, caja atornillada detrás del baúl) · llave = de día, la entrada
// vista desde la vereda (felpudo, maceta, piedra falsa, farol, buzón, marco), el garaje con el auto, el pasillo con el gancho
// de llaves, el patio de atrás, la caja con combinación en la pared del costado y la casa del vecino (= la copia anónima).
// Todo lo que se mueve sale del estado st (lo arma el motor desde plan.json). Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export type V3 = [number, number, number];
export type Scene = "papeles" | "joyas" | "llave";

// ---------------- puntos del mundo por escena ----------------
export const PTS: Record<Scene, Record<string, V3>> = {
  papeles: {
    glove: [-7.05, 0.78, -0.35], freezer: [-4.3, 1.6, -1.55], mail: [-0.2, 0.78, -1.7], desk: [2.97, 0.62, -1.5], pad: [2.2, 0.79, -1.72],
    cabinet: [3.95, 1.13, -1.6], box: [6.35, 0.18, -1.9], manuals: [9.28, 1.7, -1.8], safe: [9.2, 0.2, -2.05], center: [0.6, 0.8, -0.8],
  },
  joyas: {
    cookie: [-4.6, 1.02, -1.95], bath: [-1.75, 0.9, -1.85], tank: [-0.95, 0.7, -2.0], dish: [0.6, 0.6, -1.86], bed: [2.0, 0.55, -1.2],
    suitcase: [2.0, 0.14, -0.35], jbox: [3.75, 1.02, -1.95], drawer2: [3.75, 0.5, -1.7], coats: [5.35, 1.35, -1.85], shoes: [5.35, 1.92, -1.9],
    wtop: [5.35, 2.18, -1.95], sewing: [7.25, 1.27, -2.0], safe: [8.55, 0.2, -2.05], center: [1.8, 0.8, -0.8],
  },
  llave: {
    garage: [-8.0, 1.3, -1.9], car: [-6.4, 0.8, -0.3], mat: [-2.2, 0.04, -0.3], frame: [-2.2, 2.12, -0.95], lamp: [-1.25, 1.85, -0.9],
    pot: [-1.3, 0.3, -0.45], rock: [-3.5, 0.08, 0.5], mail: [-0.2, 1.0, 1.55], hooks: [1.55, 1.4, -2.15], window: [2.6, 1.25, -0.6],
    backmat: [4.6, 0.04, -0.3], keybox: [6.7, 0.95, -0.95], neighbor: [9.6, 1.0, -0.95], center: [0.5, 0.8, -0.6],
  },
};
// los escondites que mira el ladrón, en el orden de su recorrido (heatall / trail)
export const SPOTS: Record<Scene, string[]> = {
  papeles: ["desk", "cabinet", "box", "freezer", "glove"],
  joyas: ["jbox", "drawer2", "coats", "bed", "bath"],
  llave: ["mat", "pot", "frame", "hooks", "car"],
};
const GOODS: Record<Scene, string[]> = { papeles: ["manuals", "safe"], joyas: ["sewing", "safe", "jbox"], llave: ["neighbor", "keybox"] };

// ---------------- poses de cámara ----------------
export type Pose = { p: V3; l: V3; fov: number };
const over = (x: number, y = 4.6, z = 2.9, fov = 50): Pose => ({ p: [x, y, z], l: [x, 0.3, -1.6], fov });
const near = (q: V3, dx = 0.55, dy = 0.75, dz = 2.0, fov = 36): Pose => ({ p: [q[0] + dx, q[1] + dy, q[2] + dz], l: q, fov });
export const posesOf = (sc: Scene): Record<string, Pose> => {
  const P = PTS[sc], o: Record<string, Pose> = {};
  for (const k of Object.keys(P)) o[k] = near(P[k]);
  if (sc === "papeles") Object.assign(o, {
    desk: { p: [3.6, 1.45, 0.25], l: [2.85, 0.7, -1.55], fov: 36 }, cabinet: { p: [4.7, 1.75, 0.7], l: [3.95, 1.05, -1.6], fov: 36 },
    box: { p: [5.9, 1.35, 0.9], l: [6.35, 0.3, -1.8], fov: 38 }, freezer: { p: [-2.7, 2.3, 1.5], l: [-3.9, 1.15, -1.8], fov: 40 },
    glove: { p: [-5.15, 1.95, 1.0], l: [-7.0, 0.8, -0.25], fov: 40 }, mail: { p: [0.6, 1.5, 0.6], l: [-0.2, 0.78, -1.7], fov: 36 },
    manuals: { p: [9.1, 2.05, 0.9], l: [9.22, 1.35, -1.9], fov: 42 }, safe: { p: [8.6, 1.0, 0.4], l: [9.2, 0.3, -2.0], fov: 36 },
    pad: { p: [2.7, 1.55, -0.6], l: [2.2, 0.79, -1.72], fov: 32 }, over0: over(0), over2: over(2.5), over4: over(4.5), overG: over(-3.5), wide: over(0.5, 7.5, 7.0, 50),
  });
  if (sc === "joyas") Object.assign(o, {
    dresser: { p: [4.3, 1.55, 0.6], l: [3.7, 0.8, -1.8], fov: 38 }, dish: { p: [1.35, 1.7, -0.35], l: [0.58, 0.82, -1.9], fov: 34 },
    bed: { p: [3.4, 2.0, 1.6], l: [2.0, 0.4, -1.0], fov: 42 }, wardrobe: { p: [5.9, 1.9, 0.9], l: [5.35, 1.4, -1.8], fov: 40 },
    bath: { p: [-1.0, 1.7, 0.9], l: [-1.5, 0.95, -1.9], fov: 40 }, cookie: { p: [-4.0, 1.7, 0.6], l: [-4.6, 1.0, -1.9], fov: 38 },
    sewing: { p: [7.7, 1.8, 0.3], l: [7.25, 1.2, -2.0], fov: 36 }, safe: { p: [8.0, 1.0, 0.4], l: [8.55, 0.3, -2.0], fov: 36 },
    overB: over(2.4), over0: over(-2.0), wide: over(1.8, 7.5, 7.0, 50),
  });
  if (sc === "llave") Object.assign(o, {
    entry: over(-1.6, 3.4, 4.6, 50), mat: { p: [-1.7, 1.2, 1.4], l: [-2.2, 0.1, -0.4], fov: 38 }, pot: { p: [-0.7, 1.2, 1.2], l: [-1.4, 0.3, -0.5], fov: 38 },
    frame: { p: [-1.6, 2.2, 1.4], l: [-2.2, 1.8, -1.0], fov: 38 }, hooks: { p: [1.9, 1.6, 0.6], l: [1.55, 1.3, -2.1], fov: 38 },
    back: { p: [5.2, 1.7, 1.8], l: [4.5, 0.7, -0.9], fov: 42 }, car: { p: [-3.7, 2.3, 3.3], l: [-6.6, 0.8, -0.6], fov: 44 },
    keybox: { p: [7.2, 1.3, 1.0], l: [6.7, 0.9, -0.95], fov: 34 }, neighbor: { p: [10.2, 1.7, 2.4], l: [9.6, 1.0, -0.9], fov: 40 },
    wide: over(0.5, 7.0, 8.0, 50),
  });
  return o;
};
// la toma de un gráfico (fondo de cartel): vista general de la maqueta
export const WIDE = "wide";

// ---------------- CÁMARA ----------------
export type Key = { t: number; p: V3; l: V3; fov?: number; arc?: number };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
export const makeCam = (KEYS: Key[], center: V3) => {
  const camAt = (t: number) => {
    if (!KEYS.length) return { p: v3([0, 4, 6]), l: v3([0, 0.5, -1]), fov: 45 };
    let lo = 0, hi = KEYS.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (KEYS[m].t <= t) lo = m; else hi = m - 1; }
    const a = KEYS[lo], b = KEYS[Math.min(lo + 1, KEYS.length - 1)];
    const k = b.t > a.t ? ease((t - a.t) / (b.t - a.t)) : 0;
    const p = v3(a.p).lerp(v3(b.p), k), l = v3(a.l).lerp(v3(b.l), k);
    if (b.arc) p.y += Math.sin(Math.PI * k) * b.arc * v3(a.p).distanceTo(v3(b.p));
    p.x += Math.sin(t * 0.53) * 0.012; p.y += Math.sin(t * 0.71 + 1) * 0.008;
    return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
  };
  const project = (cm: { p: THREE.Vector3; l: THREE.Vector3; fov: number }, q: THREE.Vector3) => {
    const c = new THREE.PerspectiveCamera(cm.fov, W / H, 0.05, 200); c.position.copy(cm.p); c.lookAt(cm.l); c.updateMatrixWorld(); c.updateProjectionMatrix();
    const v = q.clone().project(c); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, front: v.z < 1 };
  };
  const screenOf = (t: number, q: V3) => project(camAt(t), v3(q));
  const camSpeed = (t: number) => {
    const a = screenOf(t - 1 / FPS, center), b = screenOf(t, center);
    return { bx: Math.abs(b.x - a.x) * 0.06, by: Math.abs(b.y - a.y) * 0.06 };
  };
  return { camAt, screenOf, camSpeed };
};
export type Cam = ReturnType<typeof makeCam>;

const CamSet: React.FC<{ t: number; camAt: Cam["camAt"] }> = ({ t, camAt }) => {
  const { camera } = useThree();
  const c = camAt(t), pc = camera as THREE.PerspectiveCamera;
  pc.position.copy(c.p); pc.lookAt(c.l); pc.fov = c.fov; pc.near = 0.05; pc.far = 200; pc.updateProjectionMatrix();
  return null;
};

// ---------------- texturas ----------------
type Tx = THREE.Texture;
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const label = (txt: string, bg: string, fg: string, w = 512, h = 160, size = 78) => mk(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${0.05 * rnd(i, 2)})`; g.fillRect(rnd(i, 3) * w, rnd(i, 4) * h, 3, 3); }
  g.fillStyle = fg; g.font = `900 ${size}px Montserrat, Arial Black, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 4);
});
const useCasaTex = () => useMemo(() => ({
  plaster: mk(256, 256, (g) => { g.fillStyle = "#cfc6b6"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1500; i++) { const v = 180 + rnd(i, 1) * 40; g.fillStyle = `rgba(${v},${v - 8},${v - 20},.25)`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 2, 2); } }, [3, 1]),
  grass: mk(256, 256, (g) => { g.fillStyle = "#24331f"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${40 + rnd(i, 1) * 40},${70 + rnd(i, 2) * 50},${30 + rnd(i, 3) * 20},.6)`; g.fillRect(rnd(i, 4) * 256, rnd(i, 5) * 256, 1.5, 4); } }, [10, 4]),
  soil: mk(256, 256, (g) => { const cs = ["#3a2a1c", "#4a3524", "#5a4632", "#6b6256"]; for (let r = 0; r < 4; r++) { g.fillStyle = cs[r]; g.fillRect(0, r * 64, 256, 64); } for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(20,14,8,${0.3 * rnd(i, 2)})`; g.beginPath(); g.arc(rnd(i, 3) * 256, rnd(i, 4) * 256, 1 + rnd(i, 5) * 3, 0, 6.3); g.fill(); } }, [6, 1]),
  folderBlue: label("IMPORTANTE", "#2c5fb3", "#f2f2f2", 512, 160, 70),
  manuals: label("MANUALES", "#6f6a5e", "#f1ead7", 512, 200, 84),
  mailTop: mk(256, 160, (g) => { g.fillStyle = "#f1ece0"; g.fillRect(0, 0, 256, 160); g.fillStyle = "#b9b2a2"; for (let k = 0; k < 6; k++) g.fillRect(24, 30 + k * 18, 140 - k * 8, 6); g.fillStyle = "#2c5fb3"; g.fillRect(186, 20, 46, 32); }),
  pad: mk(128, 160, (g) => { g.fillStyle = "#d8b24a"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#f6f0de"; g.fillRect(10, 10, 108, 140); g.fillStyle = "#555"; for (let k = 0; k < 7; k++) g.fillRect(18, 24 + k * 17, 60 + rnd(k, 3) * 30, 4); }),
  quilt: mk(256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = ["#b8574a", "#e5d6b8", "#6d8a9e", "#d9a441"][(x + y * 3) % 4]; g.fillRect(x * 32, y * 32, 32, 32); } g.strokeStyle = "rgba(0,0,0,.18)"; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, 256); g.moveTo(0, i * 32); g.lineTo(256, i * 32); g.stroke(); } }),
  bathTile: mk(256, 256, (g) => { g.fillStyle = "#dfe8ea"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#a9b8bc"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, 256); g.moveTo(0, i * 32); g.lineTo(256, i * 32); g.stroke(); } }, [3, 2]),
  sky: mk(64, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#8fbbe8"); gr.addColorStop(1, "#e9f0f3"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); }),
  ivy: mk(256, 256, (g) => { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${30 + rnd(i, 1) * 40},${90 + rnd(i, 2) * 70},${30 + rnd(i, 3) * 30},.85)`; g.beginPath(); g.ellipse(rnd(i, 4) * 256, rnd(i, 5) * 256, 6, 4, rnd(i, 6) * 3, 0, 6.3); g.fill(); } }),
  sewTin: label("COSTURA", "#2f6b8f", "#f4ecd8", 512, 160, 70),
}), []);
type TX = ReturnType<typeof useCasaTex>;

// ---------------- piezas comunes ----------------
const Box: React.FC<{ p: V3; s: V3; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V3 }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.02, rot }) => (
  <mesh position={p} rotation={rot} geometry={rbox(s[0], s[1], s[2], rad)} castShadow={cast} receiveShadow><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} /></mesh>
);
const Cyl: React.FC<{ p: V3; r: number; h: number; c: string; rough?: number; m?: number; rot?: V3; r2?: number }> = ({ p, r, h, c, rough = 0.7, m = 0, rot, r2 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, 28]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} /></mesh>
);
const Plane: React.FC<{ p: V3; s: [number, number]; map: Tx; rot?: V3 }> = ({ p, s, map, rot }) => (
  <mesh position={p} rotation={rot}><planeGeometry args={s} /><meshStandardMaterial map={map} roughness={0.8} /></mesh>
);

// halo pulsante = "el ladrón lo piensa" (rojo) o "aquí no mira" (verde)
const Heat: React.FC<{ p: V3; on: number; t: number; col?: string; r?: number }> = ({ p, on, t, col = "#ff3a2a", r = 0.42 }) => {
  if (on < 0.01) return null;
  const pul = 0.75 + 0.25 * Math.sin(t * 6);
  return (
    <group position={[p[0], 0.012, p[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.82, r, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * on} toneMapped={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r * 0.82, 48]} /><meshBasicMaterial color={col} transparent opacity={0.18 * on * pul} toneMapped={false} /></mesh>
      <mesh position={[0, (p[1] + 0.5) / 2, 0]}><cylinderGeometry args={[r * 0.3, r * 0.6, p[1] + 0.5, 32, 1, true]} /><meshBasicMaterial color={col} transparent opacity={0.07 * on * pul} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight position={[0, p[1] + 0.2, 0.25]} color={col} intensity={1.7 * on * pul} distance={1.3} />
    </group>
  );
};

// recorrido del ladrón: puntos rojos en el piso, pasando por los escondites en orden
const Trail: React.FC<{ k: number; path: V3[] }> = ({ k, path }) => {
  if (k < 0.005 || path.length < 2) return null;
  const pts: V3[] = [];
  for (let i = 0; i < path.length - 1; i++) { const a = path[i], b = path[i + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[2] - a[2]) / 0.22); for (let j = 0; j < n; j++) pts.push([lerp(a[0], b[0], j / n), 0.02, lerp(a[2], b[2], j / n)]); }
  const shown = Math.floor(pts.length * k);
  return <>{pts.slice(0, shown).map((q, i) => <mesh key={i} position={q} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.045, 12]} /><meshBasicMaterial color="#ff5040" toneMapped={false} transparent opacity={0.85} /></mesh>)}</>;
};

const Room: React.FC<{ x0: number; x1: number; floor: string; tex: TX; planks?: Tx; wall?: Tx; wallC?: string }> = ({ x0, x1, floor, tex, planks, wall, wallC = "#cfc6b6" }) => {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  return (
    <group>
      <mesh position={[cx, 0, -1.05]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 2.3]} /><meshStandardMaterial color={floor} map={planks} roughness={0.8} /></mesh>
      <Box p={[cx, 1.3, -2.25]} s={[w, 2.6, 0.1]} c={wallC} map={wall ?? tex.plaster} r={0.95} rad={0.01} />
      <Box p={[x1, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
    </group>
  );
};
const Ground: React.FC<{ tex: TX; w?: number; cx?: number }> = ({ tex, w = 26, cx = 0.5 }) => (
  <>
    <mesh position={[cx, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, 7]} /><meshStandardMaterial map={tex.grass} roughness={1} /></mesh>
    <Box p={[cx, -0.64, 0]} s={[w, 1.2, 7]} c="#3a2a1c" map={tex.soil} r={1} rad={0.01} cast={false} />
  </>
);
const Car: React.FC<{ x: number; glove: number }> = ({ x, glove }) => (
  <group position={[x, 0, -0.5]}>
    <Box p={[0, 0.48, 0]} s={[1.8, 0.6, 3.6]} c="#5d6b78" r={0.35} m={0.55} rad={0.18} />
    <Box p={[0, 0.98, -0.15]} s={[1.6, 0.5, 1.9]} c="#4a5662" r={0.3} m={0.4} rad={0.2} />
    <Box p={[0, 0.98, 0.83]} s={[1.5, 0.42, 0.06]} c="#1c2630" r={0.05} m={0.2} rad={0.02} />
    {[[-0.85, 1.25], [0.85, 1.25], [-0.85, -1.25], [0.85, -1.25]].map(([a, z], i) => <mesh key={i} position={[a, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 24]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>)}
    <group position={[0.15, 0.78, 0.15]} rotation={[-1.1 * glove, 0, 0]}><Box p={[0, -0.06, 0.06]} s={[0.42, 0.12, 0.02]} c="#2d343b" r={0.6} /></group>
    {glove > 0.05 && <Box p={[0.15, 0.74, 0.12]} s={[0.3, 0.02, 0.2]} c="#efe8d6" r={0.9} />}
  </group>
);
const Trunk: React.FC<{ x: number; k: number }> = ({ x, k }) => (
  <group position={[x, 0, -2.0]}>
    <Box p={[0, 0.2, -0.05]} s={[0.46, 0.36, 0.36]} c="#3a3f44" r={0.35} m={0.7} />
    {[-0.17, 0.17].map((a, i) => <mesh key={i} position={[a, 0.025, 0.12]}><cylinderGeometry args={[0.02, 0.02, 0.03, 12]} /><meshStandardMaterial color="#c9c9c9" metalness={1} roughness={0.3} /></mesh>)}
    <Box p={[0.55 * k, 0.24, 0.42]} s={[0.9, 0.46, 0.44]} c="#5b3b22" r={0.7} rad={0.04} />
  </group>
);

// ======================= ESCENA · PAPELES (la casa de cerpapeles) =======================
const Papeles: React.FC<{ tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number> }> = ({ tex, tx, a }) => (
  <>
    <Ground tex={tex} />
    <Room x0={-9} x1={-5.5} floor="#55585b" tex={tex} /><Room x0={-5.5} x1={-2} floor="#b8b0a2" tex={tex} />
    <Room x0={-2} x1={1.5} floor="#9a7b5a" tex={tex} planks={tx.planks} /><Room x0={1.5} x1={4.5} floor="#9a7b5a" tex={tex} planks={tx.planks} />
    <Room x0={4.5} x1={8.5} floor="#8e7a63" tex={tex} planks={tx.planks} /><Room x0={8.5} x1={10} floor="#9a7b5a" tex={tex} planks={tx.planks} />
    <Box p={[-9, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
    <Box p={[-1.95, 1.0, -0.6]} s={[0.12, 2.0, 0.9]} c="#5b3b22" r={0.6} />
    <Box p={[0.6, 0.35, -1.7]} s={[1.6, 0.7, 0.7]} c="#4f5d6e" r={0.95} rad={0.12} />
    <Box p={[-0.2, 0.38, -1.7]} s={[0.5, 0.76, 0.4]} c="#6b4426" />
    <Plane p={[-0.2, 0.79, -1.7]} s={[0.32, 0.2]} map={tex.mailTop} rot={[-Math.PI / 2, 0, 0.15]} />
    <Box p={[-3.1, 0.45, -1.95]} s={[1.8, 0.9, 0.6]} c="#7c6a55" r={0.7} /><Box p={[-3.1, 0.92, -1.95]} s={[1.84, 0.05, 0.64]} c="#d9d4ca" r={0.4} />
    <Box p={[-3.1, 1.85, -2.05]} s={[1.8, 0.6, 0.36]} c="#6d5c48" r={0.7} />
    <Box p={[-2.5, 1.05, -2.0]} s={[0.32, 0.2, 0.2]} c="#a33a2c" r={0.5} rad={0.04} />
    {/* heladera con congelador */}
    <group position={[-4.3, 0, -1.95]}>
      <Box p={[0, 0.9, 0]} s={[0.78, 1.8, 0.7]} c="#8f979e" r={0.35} m={0.55} rad={0.05} />
      <group position={[-0.39, 1.6, 0.36]} rotation={[0, -1.6 * (a.freezer ?? 0), 0]}><Box p={[0.39, 0, 0.02]} s={[0.78, 0.4, 0.05]} c="#98a0a7" r={0.35} m={0.55} /></group>
      {(a.freezer ?? 0) > 0.05 && <Box p={[0, 1.6, 0.05]} s={[0.66, 0.32, 0.5]} c="#b8dcf0" r={0.6} e="#9ad4ff" ei={0.6 * (a.freezer ?? 0)} />}
    </group>
    <Car x={-7.2} glove={a.glove ?? 0} />
    {/* escritorio con el primer cajón */}
    <group position={[2.55, 0, -1.85]}>
      <Box p={[0, 0.74, 0]} s={[1.4, 0.05, 0.7]} c="#6b4426" r={0.6} />
      <Box p={[-0.62, 0.36, 0]} s={[0.06, 0.72, 0.66]} c="#5a381f" /><Box p={[0.42, 0.36, 0]} s={[0.5, 0.72, 0.66]} c="#5a381f" />
      <group position={[0.42, 0.62, 0.05 + 0.32 * (a.drawer ?? 0)]}>
        <Box p={[0, 0, 0]} s={[0.46, 0.14, 0.6]} c="#6e4628" /><Box p={[0, 0.02, 0.31]} s={[0.12, 0.025, 0.02]} c="#c9b07a" m={0.8} r={0.3} />
        <Plane p={[0, 0.075, 0]} s={[0.36, 0.26]} map={tex.folderBlue} rot={[-Math.PI / 2, 0, 0]} />
      </group>
      <Box p={[-0.35, 0.79, 0.05]} s={[0.3, 0.06, 0.22]} c="#ece6d8" r={0.95} />
      <Plane p={[-0.35, 0.785, 0.13]} s={[0.1, 0.13]} map={tex.pad} rot={[-Math.PI / 2, 0, 0.2]} />
    </group>
    {/* archivador con llavecita */}
    <group position={[3.95, 0, -1.95]}>
      <Box p={[0, 0.66, 0]} s={[0.5, 1.32, 0.62]} c="#7d858c" r={0.4} m={0.6} />
      {[0, 1, 2, 3].map((k) => <group key={k} position={[0, 0.2 + k * 0.31, 0.31 + (k === 3 ? 0.12 * (a.pry ?? 0) : 0)]}><Box p={[0, 0, 0]} s={[0.46, 0.28, 0.02]} c="#8c949b" r={0.35} m={0.6} /></group>)}
    </group>
    {/* ropero con la caja contra el fuego */}
    <group position={[6.35, 0, -2.0]}>
      <Box p={[0, 1.05, -0.05]} s={[1.3, 2.1, 0.56]} c="#7a5634" r={0.7} /><Box p={[0, 1.05, 0.2]} s={[1.18, 1.98, 0.06]} c="#3a2a1d" r={0.9} />
      <group position={[-0.62, 1.05, 0.26]} rotation={[0, -1.9 * (a.wardrobe ?? 0), 0]}><Box p={[0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
      <group position={[0.62, 1.05, 0.26]} rotation={[0, 1.9 * (a.wardrobe ?? 0), 0]}><Box p={[-0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
      {[-0.4, -0.2, 0.05, 0.3].map((x, i) => <Box key={i} p={[x, 1.45, 0.12]} s={[0.16, 0.8, 0.3]} c={["#4b5a73", "#7b2f2f", "#c8c1b0", "#2f4a3a"][i]} r={0.95} />)}
      <group position={[0, 0.17 + 0.9 * (a.lift ?? 0), 0.1 + 0.6 * (a.lift ?? 0)]}><Box p={[0, 0, 0]} s={[0.44, 0.3, 0.34]} c="#6f767c" r={0.45} m={0.5} rad={0.03} /></group>
    </group>
    <Box p={[7.75, 0.28, -0.9]} s={[1.3, 0.4, 2.0]} c="#d9d2c4" r={0.95} rad={0.08} />
    {/* placard con MANUALES y la caja atornillada detrás del baúl */}
    <group position={[9.2, 0, -2.0]}>
      <Box p={[0, 1.15, -0.05]} s={[1.1, 2.3, 0.5]} c="#bfb39c" r={0.85} />
      {[0.8, 1.5].map((y, i) => <Box key={i} p={[0, y, 0.05]} s={[1.02, 0.03, 0.42]} c="#d8cdb6" r={0.8} />)}
      {[-0.36, -0.26, -0.17].map((x, i) => <Box key={i} p={[x, 1.68, 0.05]} s={[0.08, 0.34, 0.3]} c={["#8a6b4a", "#5f6e57", "#7a7466"][i]} />)}
      <group position={[0.08, 1.7, 0.05]}><Box p={[0, 0, 0]} s={[0.2, 0.38, 0.32]} c="#6f6a5e" /><Plane p={[0, 0, 0.165]} s={[0.18, 0.08]} map={tex.manuals} /></group>
    </group>
    <Trunk x={9.2} k={a.trunk ?? 0} />
  </>
);

// ======================= ESCENA · JOYAS =======================
const Joyas: React.FC<{ tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number> }> = ({ tex, tx, a }) => {
  const dr = a.drawer2 ?? 0, jb = a.jbox ?? 0, mt = a.mattress ?? 0, sc = a.suitcase ?? 0, mi = a.mirror ?? 0, wd = a.wardrobe ?? 0;
  return (
    <>
      <Ground tex={tex} />
      <Room x0={-6} x1={-2.6} floor="#b8b0a2" tex={tex} />
      <Room x0={-2.6} x1={-0.3} floor="#cdd6d8" tex={tex} wall={tex.bathTile} wallC="#dfe8ea" />
      <Room x0={-0.3} x1={6.3} floor="#9a7b5a" tex={tex} planks={tx.planks} wallC="#d8c8b4" />
      <Room x0={6.3} x1={9.6} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[-6, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      {/* COCINA: mesada, alacena, lata de galletas y tarro de azúcar */}
      <Box p={[-4.3, 0.45, -1.95]} s={[2.4, 0.9, 0.6]} c="#7c6a55" r={0.7} /><Box p={[-4.3, 0.92, -1.95]} s={[2.44, 0.05, 0.64]} c="#d9d4ca" r={0.4} />
      <Box p={[-4.3, 1.85, -2.05]} s={[2.4, 0.6, 0.36]} c="#6d5c48" r={0.7} />
      <Cyl p={[-4.6, 1.02, -1.95]} r={0.13} h={0.14} c="#2f5f9e" m={0.6} rough={0.35} />
      <Cyl p={[-4.15, 1.06, -2.0]} r={0.08} h={0.22} c="#e8eef0" rough={0.15} />
      <Box p={[-3.5, 1.05, -2.0]} s={[0.32, 0.2, 0.2]} c="#a33a2c" r={0.5} rad={0.04} />
      {/* BAÑO: lavabo con botiquín de espejo (se abre) e inodoro con tanque */}
      <Box p={[-1.75, 0.42, -1.95]} s={[0.7, 0.84, 0.5]} c="#efefea" r={0.3} />
      <Cyl p={[-1.75, 0.86, -1.9]} r={0.2} h={0.06} c="#fafafa" rough={0.2} />
      <Box p={[-1.75, 1.6, -2.18]} s={[0.62, 0.62, 0.12]} c="#d7dcde" r={0.3} />
      <group position={[-2.06, 1.6, -2.1]} rotation={[0, -1.7 * mi, 0]}><Box p={[0.31, 0, 0.02]} s={[0.6, 0.6, 0.03]} c="#bfe0ee" r={0.05} m={0.9} /></group>
      {mi > 0.05 && [-0.15, 0, 0.15].map((x, i) => <Cyl key={i} p={[-1.75 + x, 1.5, -2.14]} r={0.04} h={0.12} c={["#e07b39", "#f2f2f2", "#7fb6d9"][i]} />)}
      <Box p={[-0.95, 0.22, -1.8]} s={[0.4, 0.44, 0.55]} c="#f4f4f0" r={0.3} rad={0.1} />
      <Box p={[-0.95, 0.72, -2.08]} s={[0.46, 0.5, 0.2]} c="#f4f4f0" r={0.3} rad={0.05} />
      {/* DORMITORIO: mesita con platito, cama con colchón y valija, cómoda con joyero, ropero */}
      <Box p={[0.55, 0.28, -1.95]} s={[0.5, 0.56, 0.44]} c="#6b4426" />
      <Cyl p={[0.6, 0.575, -1.86]} r={0.12} h={0.02} c="#e9d9c7" rough={0.3} />
      {[[0.56, -1.84], [0.65, -1.89]].map(([x, z], i) => <mesh key={i} position={[x, 0.6, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.007, 8, 20]} /><meshStandardMaterial color="#ffd27a" metalness={1} roughness={0.2} /></mesh>)}
      <Cyl p={[0.38, 0.68, -2.12]} r={0.06} h={0.22} c="#d9c39a" r2={0.09} />
      <group position={[2.0, 0, -1.2]}>
        <Box p={[0, 0.22, 0]} s={[1.6, 0.26, 2.0]} c="#5a381f" r={0.7} />
        <Box p={[0, 0.7, -1.0]} s={[1.7, 1.0, 0.08]} c="#5a381f" r={0.7} />
        <group position={[0, 0.4, -0.9]} rotation={[0.55 * mt, 0, 0]}>
          <Box p={[0, 0.07, 0.9]} s={[1.5, 0.18, 1.85]} c="#f1ede4" r={0.95} rad={0.06} />
          <Plane p={[0, 0.165, 1.0]} s={[1.46, 1.5]} map={tex.quilt} rot={[-Math.PI / 2, 0, 0]} />
        </group>
        <Box p={[-0.4, 0.62, -0.75]} s={[0.5, 0.12, 0.3]} c="#f6f3ec" r={0.95} rad={0.05} /><Box p={[0.4, 0.62, -0.75]} s={[0.5, 0.12, 0.3]} c="#f6f3ec" r={0.95} rad={0.05} />
        <Box p={[0.1, 0.14, 0.85 + 0.9 * sc]} s={[0.7, 0.2, 0.5]} c="#7a4b2a" r={0.6} rad={0.03} />
      </group>
      <group position={[3.75, 0, -1.98]}>
        <Box p={[0, 0.45, 0]} s={[1.2, 0.9, 0.5]} c="#7a5634" r={0.65} />
        {[0.2, 0.48, 0.74].map((y, k) => <group key={k} position={[0, y, 0.26 + (k === 1 ? 0.34 * dr : 0)]}>
          <Box p={[0, 0, -0.17 * (k === 1 ? 1 : 0)]} s={[1.1, 0.22, k === 1 ? 0.42 : 0.04]} c="#86603b" r={0.6} />
          {k === 1 && dr > 0.05 && [-0.3, -0.05, 0.2, 0.4].map((x, i) => <Box key={i} p={[x, 0.08, -0.15]} s={[0.18, 0.06, 0.25]} c={["#f0e6e6", "#c9d6e8", "#e8d9c0", "#ddd"][i]} r={0.95} rad={0.03} />)}
          <Box p={[0, 0.02, 0.03]} s={[0.16, 0.025, 0.02]} c="#c9b07a" m={0.8} r={0.3} />
        </group>)}
        <Box p={[0, 1.5, -0.2]} s={[0.8, 1.0, 0.04]} c="#bcd3dd" m={0.9} r={0.05} />
        {/* el joyero: tapa que se abre + brillo dorado */}
        <group position={[0.1, 0.97, 0.05]}>
          <Box p={[0, 0, 0]} s={[0.34, 0.14, 0.22]} c="#8a2f3f" r={0.5} rad={0.02} />
          <group position={[0, 0.07, -0.11]} rotation={[-1.4 * jb, 0, 0]}><Box p={[0, 0.02, 0.11]} s={[0.35, 0.04, 0.23]} c="#9a3747" r={0.5} rad={0.015} /></group>
          {jb > 0.05 && <Box p={[0, 0.06, 0]} s={[0.28, 0.02, 0.16]} c="#ffd27a" e="#ffb94a" ei={0.8 * jb} m={1} r={0.2} />}
        </group>
      </group>
      <group position={[5.35, 0, -2.0]}>
        <Box p={[0, 1.05, -0.05]} s={[1.3, 2.1, 0.56]} c="#7a5634" r={0.7} /><Box p={[0, 1.05, 0.2]} s={[1.18, 1.98, 0.06]} c="#3a2a1d" r={0.9} />
        <group position={[-0.62, 1.05, 0.26]} rotation={[0, -1.9 * wd, 0]}><Box p={[0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
        <group position={[0.62, 1.05, 0.26]} rotation={[0, 1.9 * wd, 0]}><Box p={[-0.31, 0, 0]} s={[0.6, 2.0, 0.04]} c="#86603b" r={0.65} /></group>
        {[-0.4, -0.15, 0.1, 0.35].map((x, i) => <Box key={i} p={[x, 1.2, 0.12]} s={[0.2, 1.0, 0.32]} c={["#2f3b4f", "#6e2a2a", "#3b4a3a", "#141414"][i]} r={0.95} />)}
        {[-0.3, 0.05, 0.38].map((x, i) => <Box key={i} p={[x, 1.92, 0.1]} s={[0.3, 0.16, 0.3]} c={["#c9b38f", "#b5a07d", "#d8c7a6"][i]} r={0.9} />)}
        <Cyl p={[0.2, 2.18, -0.05]} r={0.12} h={0.12} c="#7d8b95" m={0.6} rough={0.4} />
      </group>
      {/* CUARTO DE COSTURA: mesa con máquina, estante con la caja de costura, placard con caja atornillada */}
      <Box p={[7.1, 0.38, -1.75]} s={[1.2, 0.05, 0.6]} c="#6b4426" r={0.6} />
      {[-0.55, 0.55].map((x, i) => <Box key={i} p={[7.1 + x, 0.18, -1.75]} s={[0.05, 0.36, 0.55]} c="#5a381f" />)}
      <Box p={[6.9, 0.55, -1.8]} s={[0.45, 0.3, 0.22]} c="#e6e1d2" r={0.4} rad={0.04} />
      <Box p={[7.25, 1.12, -2.08]} s={[1.0, 0.04, 0.3]} c="#d8cdb6" r={0.8} />
      <group position={[7.25, 1.22, -2.05]}>
        <Cyl p={[0, 0, 0]} r={0.16} h={0.16} c="#2f6b8f" m={0.6} rough={0.35} />
        <Plane p={[0, 0, 0.162]} s={[0.22, 0.07]} map={tex.sewTin} />
      </group>
      <Cyl p={[7.6, 1.2, -2.05]} r={0.05} h={0.14} c="#e9eef0" rough={0.1} />
      <Trunk x={8.55} k={a.trunk ?? 0} />
    </>
  );
};

// ======================= ESCENA · LLAVE (de día) =======================
const Llave: React.FC<{ tex: TX; tx: ReturnType<typeof useTextures>; a: Record<string, number> }> = ({ tex, tx, a }) => {
  const mat = a.mat ?? 0, pot = a.pot ?? 0, rock = a.rock ?? 0, fr = a.frame ?? 0, ml = a.mail ?? 0, fish = a.fish ?? 0, kb = a.keybox ?? 0;
  const LlaveM = ({ p, rot = [0, 0, 0] as V3, c = "#d9b45a" }: { p: V3; rot?: V3; c?: string }) => (
    <group position={p} rotation={rot}><mesh><torusGeometry args={[0.035, 0.012, 8, 20]} /><meshStandardMaterial color={c} metalness={1} roughness={0.25} /></mesh><Box p={[0.08, 0, 0]} s={[0.1, 0.018, 0.01]} c={c} m={1} r={0.25} rad={0.003} /></group>
  );
  return (
    <>
      <Ground tex={tex} w={30} cx={1.0} />
      {/* vereda */}
      <Box p={[1.0, 0.01, 2.6]} s={[30, 0.04, 1.6]} c="#a8a49b" r={0.95} rad={0.01} cast={false} />
      {/* GARAJE con el auto y la llave colgada al lado del portón */}
      <Room x0={-9.2} x1={-4.6} floor="#6a6c6e" tex={tex} />
      <Box p={[-9.2, 0.7, -1.1]} s={[0.1, 1.4, 2.3]} c="#c4baa8" r={0.95} rad={0.01} />
      <Car x={-6.6} glove={a.glove ?? 0} />
      <Box p={[-8.0, 1.3, -2.18]} s={[0.04, 0.08, 0.04]} c="#555" m={0.8} /><LlaveM p={[-8.0, 1.2, -2.17]} rot={[0, 0, -1.4]} />
      {/* FRENTE de la casa: pared con puerta, marco, farol, ventana y enredadera */}
      <Box p={[-1.6, 1.4, -1.05]} s={[6.0, 2.8, 0.14]} c="#e3d8c4" map={tex.plaster} r={0.95} rad={0.01} />
      <Box p={[-2.2, 1.0, -0.97]} s={[0.95, 2.0, 0.06]} c="#6b3e22" r={0.55} />
      <Box p={[-2.2, 2.05, -0.95]} s={[1.15, 0.1, 0.12]} c="#f2ece0" r={0.7} /><Box p={[-2.72, 1.0, -0.95]} s={[0.1, 2.0, 0.12]} c="#f2ece0" r={0.7} /><Box p={[-1.68, 1.0, -0.95]} s={[0.1, 2.0, 0.12]} c="#f2ece0" r={0.7} />
      <Cyl p={[-1.92, 1.0, -0.92]} r={0.03} h={0.05} c="#d9b45a" m={1} rough={0.25} rot={[Math.PI / 2, 0, 0]} />
      {fr > 0.05 && <LlaveM p={[-2.2, 2.11, -0.93]} />}
      <group position={[-1.25, 1.85, -0.92]}><Box p={[0, 0, 0]} s={[0.2, 0.28, 0.16]} c="#2a2a2a" m={0.6} r={0.4} /><Box p={[0, -0.02, 0.02]} s={[0.14, 0.18, 0.12]} c="#fff4d0" e="#ffd98a" ei={0.6} r={0.2} /></group>
      <Box p={[0.1, 1.45, -0.97]} s={[1.0, 0.9, 0.05]} c="#9cc6dc" m={0.5} r={0.05} /><Box p={[0.1, 1.45, -0.95]} s={[1.08, 0.98, 0.04]} c="#f2ece0" r={0.7} />
      <Plane p={[-3.6, 1.2, -0.96]} s={[0.9, 1.9]} map={tex.ivy} />
      {/* escalones, felpudo (se levanta la esquina) y la llave */}
      <Box p={[-2.2, 0.06, -0.55]} s={[1.6, 0.12, 0.9]} c="#b4ada2" r={0.9} rad={0.02} />
      <group position={[-2.2, 0.13, -0.3]}>
        {/* el felpudo gira sobre su borde izquierdo y deja ver la llave */}
        <group position={[-0.42, 0, 0]} rotation={[0, 0, -0.9 * mat]}><Box p={[0.42, 0.012, 0]} s={[0.84, 0.025, 0.5]} c="#7a5a35" r={1} rad={0.01} /></group>
        <LlaveM p={[0.1, 0.02, 0.05]} rot={[-Math.PI / 2, 0, 0.3]} />
      </group>
      {/* maceta (se inclina) y piedra falsa en el cantero */}
      <group position={[-1.3, 0.12, -0.45]} rotation={[0, 0, -0.5 * pot]}>
        <Cyl p={[0, 0.17, 0]} r={0.2} r2={0.15} h={0.34} c="#b5583a" />
        <mesh position={[0, 0.48, 0]}><sphereGeometry args={[0.24, 16, 12]} /><meshStandardMaterial color="#3f7a3a" roughness={0.9} /></mesh>
      </group>
      {pot > 0.05 && <LlaveM p={[-1.3, 0.13, -0.45]} rot={[-Math.PI / 2, 0, 1]} />}
      <Box p={[-3.5, 0.03, 0.45]} s={[1.6, 0.06, 0.8]} c="#4a3524" map={tex.soil} r={1} />
      {[[-3.9, 0.35], [-3.7, 0.6], [-3.25, 0.3], [-3.05, 0.6], [-3.45, 0.75]].map(([x, z], i) => <mesh key={i} position={[x, 0.09, z]} castShadow><dodecahedronGeometry args={[0.08 + 0.02 * (i % 2), 0]} /><meshStandardMaterial color="#7e7a72" roughness={1} /></mesh>)}
      <mesh position={[-3.5, 0.09 + 0.25 * rock, 0.5]} castShadow><dodecahedronGeometry args={[0.09, 1]} /><meshStandardMaterial color="#b8b4ab" roughness={0.45} /></mesh>
      {/* reja + buzón de la entrada */}
      {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[-4.4 + i * 0.36, 0.5, 1.75]} s={[0.04, 1.0, 0.04]} c="#2a2a2a" m={0.7} r={0.4} />)}
      <Box p={[-2.4, 0.95, 1.75]} s={[4.4, 0.05, 0.05]} c="#2a2a2a" m={0.7} r={0.4} />
      <group position={[-0.2, 1.0, 1.6]}><Box p={[0, 0, 0]} s={[0.36, 0.26, 0.2]} c="#2f5d3a" m={0.4} r={0.5} /><group position={[0, 0.13, 0.1]} rotation={[-1.2 * ml, 0, 0]}><Box p={[0, 0, 0.0]} s={[0.36, 0.03, 0.2]} c="#2f5d3a" m={0.4} r={0.5} /></group></group>
      {/* PASILLO (en corte): gancho de llaves en la pared del fondo, ventana al frente, ranura del buzón */}
      <Room x0={1.4} x1={3.6} floor="#9a7b5a" tex={tex} planks={tx.planks} />
      <Box p={[1.55, 1.4, -2.17]} s={[0.6, 0.3, 0.04]} c="#7a5634" r={0.6} />
      {[-0.2, -0.07, 0.07, 0.2].map((x, i) => <LlaveM key={i} p={[1.55 + x, 1.3 - (i === 1 ? 0.25 * fish : 0), -2.13 + (i === 1 ? 1.2 * fish : 0)]} rot={[0, 0, -1.4]} c={["#d9b45a", "#c0c0c0", "#d9b45a", "#b87333"][i]} />)}
      <Box p={[2.6, 1.25, -0.0]} s={[1.0, 0.9, 0.04]} c="#9cc6dc" m={0.5} r={0.05} />
      <Box p={[2.6, 0.4, -0.0]} s={[2.2, 0.8, 0.1]} c="#e3d8c4" map={tex.plaster} r={0.95} />
      {/* PATIO de atrás: puerta con felpudo y la ventana del lavadero */}
      <Box p={[5.0, 1.4, -1.05]} s={[2.6, 2.8, 0.14]} c="#d9cdb6" map={tex.plaster} r={0.95} rad={0.01} />
      <Box p={[4.6, 1.0, -0.97]} s={[0.9, 2.0, 0.06]} c="#8a8f94" m={0.3} r={0.4} /><Box p={[4.6, 1.3, -0.94]} s={[0.6, 0.8, 0.02]} c="#a9d2e6" m={0.6} r={0.05} />
      <Box p={[4.6, 0.02, -0.3]} s={[0.8, 0.025, 0.45]} c="#6e5233" r={1} rad={0.01} />
      {/* pared del costado con la CAJA CON COMBINACIÓN (detrás de un muro bajo) */}
      <Box p={[6.7, 1.0, -1.02]} s={[1.6, 2.0, 0.12]} c="#cdbfa6" map={tex.plaster} r={0.95} />
      <group position={[6.7, 0.95, -0.93]}>
        <Box p={[0, 0, 0]} s={[0.2, 0.26, 0.1]} c="#1e1f22" m={0.6} r={0.35} rad={0.02} />
        <group position={[0, -0.13, 0.05]} rotation={[-1.3 * kb, 0, 0]}><Box p={[0, 0.0, 0.0]} s={[0.2, 0.04, 0.02]} c="#2b2d31" m={0.6} r={0.35} /></group>
        {[-0.06, -0.02, 0.02, 0.06].map((x, i) => <Box key={i} p={[x, 0.05, 0.055]} s={[0.03, 0.05, 0.01]} c="#c9ccd0" m={0.9} r={0.2} />)}
      </group>
      <Box p={[6.7, 0.35, -0.4]} s={[1.8, 0.7, 0.15]} c="#a69a86" r={0.9} />
      {/* la casa del VECINO (la copia anónima) */}
      <Box p={[9.6, 1.3, -1.05]} s={[2.6, 2.6, 0.14]} c="#c9d8c2" map={tex.plaster} r={0.95} rad={0.01} />
      <Box p={[9.6, 1.0, -0.97]} s={[0.9, 2.0, 0.06]} c="#2f4a6b" r={0.55} />
      <mesh position={[9.6, 2.85, -1.05]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.95, 0.8, 4]} /><meshStandardMaterial color="#8a4a3a" roughness={0.8} /></mesh>
      <mesh position={[-1.6, 3.2, -1.05]} rotation={[0, Math.PI / 4, 0]} scale={[1.6, 1, 0.5]}><coneGeometry args={[2.6, 0.9, 4]} /><meshStandardMaterial color="#9a5a42" roughness={0.8} /></mesh>
    </>
  );
};

export type WorldState = { lamps: number; anim: Record<string, number>; heat: Record<string, number>; good: Record<string, number>; trail: number; hot: string };

export const World: React.FC<{ t: number; cam: Cam; st: WorldState; scene: Scene }> = ({ t, cam, st, scene }) => {
  const tx = useTextures(), tex = useCasaTex();
  const P = PTS[scene], day = scene === "llave";
  const path = useMemo(() => SPOTS[scene].map((k) => [P[k][0], 0.02, Math.max(-1.2, P[k][2] + 0.5)] as V3), [scene, P]);
  const bg = day ? "#a9c6de" : "#0e1626";
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 38, position: [0, 3, 8] }}>
      <CamSet t={t} camAt={cam.camAt} />
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 14, 42]} />
      {day ? <>
        <ambientLight intensity={0.75} color="#fff6e6" />
        <hemisphereLight args={["#cfe3ff", "#4a5a3a", 0.6]} />
        <directionalLight position={[-5, 9, 7]} intensity={1.6} color="#fff1d6" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={9} shadow-camera-bottom={-9} />
      </> : <>
        <pointLight position={[0.5, 2.2, 3.0]} intensity={4} distance={7} color="#b9c8ff" />
        <ambientLight intensity={0.22} color="#7d8fb8" />
        <directionalLight position={[-6, 9, 6]} intensity={0.55} color="#9fb6ff" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />
        {[-4.2, -1.4, 1.5, 4.2, 7.4].map((x, i) => <pointLight key={i} position={[x, 2.2, -1.2]} intensity={2.4 * st.lamps} distance={4.5} color="#ffcf8f" castShadow={i === 2} />)}
      </>}
      {scene === "papeles" && <Papeles tex={tex} tx={tx} a={st.anim} />}
      {scene === "joyas" && <Joyas tex={tex} tx={tx} a={st.anim} />}
      {scene === "llave" && <Llave tex={tex} tx={tx} a={st.anim} />}
      <Trail k={st.trail} path={path} />
      {Object.entries(st.heat).map(([k, v]) => P[k] ? <Heat key={"h" + k} p={P[k]} on={v} t={t} col={st.hot} /> : null)}
      {st.hot !== "#ffffff" && Object.entries(st.good).map(([k, v]) => P[k] && GOODS[scene] ? <Heat key={"g" + k} p={P[k]} on={v} t={t} col="#3fe08a" r={0.5} /> : null)}
      <Post bloom={day ? 0.4 : 0.85} threshold={day ? 0.92 : 0.78} exposure={day ? 1.0 : 1.05} env={day ? 0.35 : 0.18} />
    </ThreeCanvas>
  );
};
