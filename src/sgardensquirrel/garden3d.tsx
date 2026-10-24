// sgardensquirrel · EL MUNDO: el fondo de la casa de Sachiko (casa vieja de madera blanca en un pueblo de EE. UU., arreglada a la japonesa).
// La casa tiene el ALTILLO EN CORTE (falta el hastial derecho: se ve adentro las cabriadas, la lana rosa, el nido, los algodones con menta,
// la radio). Afuera: el porche con la MESA de las 3 cosas (ají, jabón, menta), los canteros (tulipanes con los pozos de la ardilla, la malla de
// gallinero, el anillo de narcisos, los tomates), el caqui, el ROBLE junto a la cerca con la ardilla, el comedero en su caño de metal y el galpón
// con las ristras de ají secándose. Estaciones (otoño→invierno→primavera→verano) y amanecer. UNA escena y UNA cámara (KEYS en tl.ts).
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, rbox } from "../cme3d01/fx3d";
import { KEYS, ST } from "./tl";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- puntos del mundo (portales y rótulos HTML) ----------------
export const PT = {
  hole: [2.25, 3.02, -3.0] as V,       // el agujero de la ardilla en la tabla de alero (esquina derecha de la casa)
  nest: [1.2, 2.8, -4.7] as V,         // el nido en el altillo
  cotton: [1.8, 2.82, -3.6] as V,
  radio: [0.4, 2.8, -4.1] as V,
  table: [1.2, 0.98, -1.9] as V,        // la mesa del porche
  chili: [0.95, 1.08, -1.9] as V, soap: [1.2, 1.1, -1.9] as V, mint: [1.45, 1.05, -1.9] as V,
  tulips: [3.2, 0.32, 0.6] as V,        // el cantero de los tulipanes
  tomato: [5.6, 0.9, -0.6] as V,
  feeder: [2.6, 1.7, 3.2] as V,
  oak: [7.6, 2.4, 1.6] as V,
  branch: [2.9, 3.62, -2.2] as V,
  fence: [6.6, 1.25, 3.0] as V,
  persimmon: [-2.6, 2.2, 1.6] as V,
  shed: [-4.6, 1.4, -0.4] as V,
  dish: [8.0, 0.08, -1.6] as V,
  door: [1.3, 1.1, -3.0] as V,
  chimney: [-2.9, 4.6, -4.4] as V,
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
  // cámara en mano virtual (balanceo lento 0,4-1,8 Hz, no el temblor rápido)
  p.x += Math.sin(t * 2.6) * 0.006 + Math.sin(t * 0.9) * 0.01; p.y += Math.sin(t * 3.4 + 1) * 0.005 + Math.sin(t * 1.3) * 0.006;
  l.x += Math.sin(t * 1.1 + 2) * 0.008;
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
const useTex = () => useMemo(() => ({
  // tablas de madera blanca (clapboard) pintadas y gastadas
  clap: mk(256, 256, (g) => {
    g.fillStyle = "#ece8de"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 32) { g.fillStyle = "rgba(90,85,70,.28)"; g.fillRect(0, y + 28, 256, 4); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(0, y, 256, 2); }
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(120,110,90,${0.1 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * 256, rnd(i, 3) * 256, 1 + rnd(i, 4) * 6, 1); }
  }, [3, 2]),
  wood: mk(256, 256, (g) => {
    g.fillStyle = "#9a7650"; g.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(70,45,22,${0.12 + rnd(k, 1) * 0.15})`; g.lineWidth = 1 + rnd(k, 2) * 2; g.beginPath(); const y = k * 6.4; g.moveTo(0, y); g.bezierCurveTo(80, y + 4 * rnd(k, 3), 170, y - 4, 256, y + 2); g.stroke(); }
  }, [2, 1]),
  grey: mk(256, 256, (g) => {   // madera vieja gris del galpón y la cerca
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
  insul: mk(128, 128, (g) => {
    g.fillStyle = "#e9a3a8"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,${190 + rnd(i, 1) * 40},${190 + rnd(i, 2) * 40},.5)`; g.fillRect(rnd(i, 3) * 128, rnd(i, 4) * 128, 2 + rnd(i, 5) * 4, 1); }
  }, [3, 2]),
  mesh: mk(128, 128, (g) => {  // malla de gallinero (hexagonal)
    g.clearRect(0, 0, 128, 128); g.strokeStyle = "rgba(200,205,210,1)"; g.lineWidth = 3;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const x = c * 28 + (r % 2) * 14, y = r * 26; g.beginPath(); for (let k = 0; k <= 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; g.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); } g.stroke(); }
  }, [6, 4]),
  hcloth: mk(64, 64, (g) => { g.clearRect(0, 0, 64, 64); g.strokeStyle = "#b9bcbe"; g.lineWidth = 3; for (let x = 0; x <= 64; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 64); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(64, x); g.stroke(); } }, [3, 3]),
  label: (txt: string, col: string) => mk(256, 128, (g) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 256, 128); g.fillStyle = col; g.font = "700 64px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 68); }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, map, rad = 0.02, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; seg?: number; r2?: number; op?: number; map?: Tx; e?: string; ei?: number }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, seg = 20, r2, op, map, e, ei = 0 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} transparent={op !== undefined} opacity={op ?? 1} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);
const Ball: React.FC<{ p: V; r: number; c: string; s?: V; rough?: number; flat?: boolean; e?: string; ei?: number }> = ({ p, r, c, s, rough = 0.8, flat, e, ei = 0 }) => (
  <mesh position={p} scale={s} castShadow><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color={c} roughness={rough} flatShading={flat} emissive={e ?? "#000"} emissiveIntensity={ei} /></mesh>
);

// la ardilla gris: cuerpo, cabeza, orejas, cola en S de esferas que se mece. pose: 0 sentada, 1 cavando, 2 corriendo, 3 frotándose la cara
export const Squirrel: React.FC<{ p: V; rot?: number; t: number; pose?: number; s?: number; cheek?: number }> = ({ p, rot = 0, t, pose = 0, s = 1, cheek = 0 }) => {
  const g = "#8d877e", w = "#d8d2c6";
  const dig = pose === 1 ? Math.sin(t * 18) * 0.02 : 0;
  const run = pose === 2 ? Math.abs(Math.sin(t * 14)) * 0.05 : 0;
  const rub = pose === 3 ? Math.sin(t * 16) * 0.025 : 0;
  const lean = pose === 1 ? 0.6 : pose === 2 ? 1.1 : 0;
  return <group position={[p[0], p[1] + run, p[2]]} rotation={[0, rot, 0]} scale={s * 0.42}>
    <group rotation={[0, 0, -lean]}>
      <Ball p={[0, 0.2, 0]} r={0.14} c={g} s={[1, 1.25, 0.95]} />
      <Ball p={[0.05, 0.17, 0]} r={0.1} c={w} s={[0.8, 1.2, 0.85]} />
      <group position={[0.04 + dig, 0.42, 0]}>
        <Ball p={[0, 0, 0]} r={0.09} c={g} s={[1.15, 1, 0.95]} />
        <Ball p={[0.06, -0.02, 0.05]} r={0.04 + cheek * 0.02} c={g} />
        <Ball p={[0.06, -0.02, -0.05]} r={0.04 + cheek * 0.02} c={g} />
        <Ball p={[0.1, 0.0, 0]} r={0.025} c="#3a3430" />
        <Ball p={[0.05, 0.03, 0.06]} r={0.016} c="#0c0c0c" rough={0.1} />
        <Ball p={[0.05, 0.03, -0.06]} r={0.016} c="#0c0c0c" rough={0.1} />
        <mesh position={[-0.02, 0.09, 0.04]} rotation={[0.3, 0, 0]}><coneGeometry args={[0.025, 0.06, 8]} /><meshStandardMaterial color={g} /></mesh>
        <mesh position={[-0.02, 0.09, -0.04]} rotation={[-0.3, 0, 0]}><coneGeometry args={[0.025, 0.06, 8]} /><meshStandardMaterial color={g} /></mesh>
      </group>
      {/* patas delanteras */}
      {[0.05, -0.05].map((z) => <Ball key={z} p={[0.12 + rub, 0.3 + (pose === 3 ? 0.08 : 0) + dig, z]} r={0.03} c={g} s={[1, 1.6, 1]} />)}
      {/* cola */}
      {Array.from({ length: 9 }, (_, i) => { const k = i / 8, sw = Math.sin(t * 2.2 - i * 0.4) * 0.04 * k;
        return <Ball key={i} p={[-0.16 - Math.sin(k * 2.2) * 0.14, 0.1 + k * 0.5, sw]} r={0.07 + Math.sin(k * Math.PI) * 0.05} c={i % 2 ? g : "#9a948a"} />; })}
    </group>
    <Ball p={[-0.02, 0.06, 0.07]} r={0.06} c={g} s={[1.6, 0.6, 1]} />
    <Ball p={[-0.02, 0.06, -0.07]} r={0.06} c={g} s={[1.6, 0.6, 1]} />
  </group>;
};

// árbol: tronco + copa de esferas; col = color de la estación
const Tree: React.FC<{ p: V; t: number; h: number; spread: number; cols: string[]; trunk?: string; n?: number; bare?: number; fruit?: number }> = ({ p, t, h, spread, cols, trunk = "#4a3a2c", n = 22, bare = 0, fruit = 0 }) => (
  <group position={p}>
    <Cyl p={[0, h * 0.45, 0]} r={0.12 * h / 3} r2={0.2 * h / 3} h={h * 0.9} c={trunk} rough={0.95} />
    {[0, 1, 2, 3].map((i) => <Cyl key={i} p={[Math.cos(i * 1.6) * 0.35, h * 0.78, Math.sin(i * 1.6) * 0.35]} r={0.03} r2={0.06} h={h * 0.4} c={trunk} rot={[Math.sin(i * 1.6) * 0.7, 0, -Math.cos(i * 1.6) * 0.7]} />)}
    {Array.from({ length: n }, (_, i) => {
      if (rnd(i, 9) < bare) return null;
      return <mesh key={i} position={[(rnd(i, 1) - 0.5) * spread + Math.sin(t * 0.6 + i) * 0.015, h * 0.8 + rnd(i, 2) * h * 0.45, (rnd(i, 3) - 0.5) * spread * 0.8]} castShadow>
        <icosahedronGeometry args={[0.35 + rnd(i, 4) * 0.3, 1]} /><meshStandardMaterial color={cols[i % cols.length]} roughness={0.9} flatShading /></mesh>;
    })}
    {fruit > 0 && Array.from({ length: 26 }, (_, i) => <Ball key={"f" + i} p={[(rnd(i, 11) - 0.5) * spread * 0.9, h * 0.8 + rnd(i, 12) * h * 0.4, (rnd(i, 13) - 0.5) * spread * 0.7 + 0.2]} r={0.06 * fruit} c="#e8771c" rough={0.4} />)}
  </group>
);

// rama recta de a hacia b; cut 0..1 la acorta desde la punta (b)
const Branch: React.FC<{ a: V; b: V; cut: number }> = ({ a, b, cut }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b).lerp(new THREE.Vector3(...a), 0.62 * cut);
  const d = B.clone().sub(A), L = d.length(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const m = A.clone().add(B).multiplyScalar(0.5);
  return <group position={[m.x, m.y, m.z]} quaternion={q}>
    <mesh castShadow><cylinderGeometry args={[0.05, 0.11, L, 10]} /><meshStandardMaterial color="#3d3226" roughness={0.95} /></mesh>
    {[0.15, 0.3, 0.42].map((k, i) => <mesh key={i} position={[0, L * (k - 0.5) + 0.2, 0]} rotation={[0.6 * (i % 2 ? 1 : -1), 0, 0.5]}><cylinderGeometry args={[0.015, 0.03, 0.7, 6]} /><meshStandardMaterial color="#3d3226" /></mesh>)}
  </group>;
};

// el frasco / botella / gotero de la mesa
const Jar: React.FC<{ p: V; k: number; fill: string; lid: string; tex?: Tx; h?: number; r?: number }> = ({ p, k, fill, lid, tex, h = 0.16, r = 0.055 }) => k <= 0.01 ? null : (
  <group position={[p[0], p[1] + (1 - ease(k)) * 0.6, p[2]]} scale={ease(k)}>
    <Cyl p={[0, h / 2, 0]} r={r} h={h} c="#dfeaf0" rough={0.05} op={0.35} />
    <Cyl p={[0, h * 0.4, 0]} r={r * 0.9} h={h * 0.78} c={fill} rough={0.9} />
    <Cyl p={[0, h + 0.015, 0]} r={r * 1.02} h={0.03} c={lid} m={0.5} rough={0.3} />
    {tex && <mesh position={[0, h * 0.5, r + 0.002]}><planeGeometry args={[r * 1.5, r * 0.75]} /><meshStandardMaterial map={tex} roughness={0.8} /></mesh>}
  </group>
);

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tt = useTex();
  const labels = useMemo(() => ({ chili: tt.label("CHILI", "#b8321e"), soap: tt.label("SOAP", "#2b6a3f"), mint: tt.label("MINT", "#2b3f63") }), [tt]);
  const s = ST(t);
  // estación: 0 otoño · 1 invierno · 2 primavera · 3 verano (continuo)
  const se = s.season;
  const leafCols = se < 1 ? ["#c9562f", "#d98a2f", "#b8442a", "#e0a63a"] : se < 2 ? ["#6f6a60"] : se < 3 ? ["#8fbf5a", "#a6cf6a", "#79ad4c"] : ["#4f7f34", "#5d8f3a", "#3f6f2c"];
  const bare = se >= 1 && se < 2 ? 0.85 : 0;
  const frost = s.frost, dawn = s.dawn;
  const sky = new THREE.Color("#c9d3d8").lerp(new THREE.Color("#e8c9a8"), dawn * 0.6).lerp(new THREE.Color("#dfe6ea"), frost * 0.5);
  const grassCol = new THREE.Color("#ffffff").lerp(new THREE.Color("#e6eef2"), frost);
  const sunCol = new THREE.Color("#fff1dc").lerp(new THREE.Color("#ffc68a"), dawn);
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.5} threshold={0.88} exposure={0.92 * (1 - 0.28 * s.shade)} env={0.3} />
      <color attach="background" args={[sky.getStyle()]} />
      <fogExp2 attach="fog" args={[sky.getStyle(), 0.022]} />
      <hemisphereLight args={["#f3efe6", new THREE.Color("#6a5a40").getStyle(), 0.72]} />
      <directionalLight position={[10, lerp(9, 3.5, dawn), 6]} intensity={lerp(1.8, 1.4, dawn)} color={sunCol.getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      {/* luz del altillo (linterna) */}
      <pointLight position={[1.4, 3.4, -4.2]} intensity={1.1 + s.attic * 1.4} distance={4} color="#ffd9a6" />
      <pointLight position={[1.2, 2.2, -1.6]} intensity={0.4} distance={4} color="#fff0dc" />

      {/* césped */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[90, 90]} /><meshStandardMaterial map={tt.grass} color={grassCol} roughness={1} /></mesh>
      {/* camino de ladrillo del porche al cantero */}
      {Array.from({ length: 14 }, (_, i) => <Box key={i} p={[1.6 + i * 0.22, 0.015, -0.6 + i * 0.06]} s={[0.2, 0.03, 0.42]} c={["#8a4a36", "#7a4030", "#94523c"][i % 3]} r={0.95} rad={0.008} />)}

      {/* ===== LA CASA: cuerpo de madera blanca (x -4..0, z -6..-3), techo a dos aguas; el hastial derecho del altillo NO está (corte) ===== */}
      <Box p={[-0.8, 1.3, -4.5]} s={[6.4, 2.6, 3]} c="#ffffff" map={tt.clap} r={0.85} rad={0.01} />
      {/* ventana y puerta de atrás */}
      <Box p={[-2.6, 1.5, -2.99]} s={[0.9, 1.0, 0.04]} c="#9fb7c4" r={0.1} m={0.2} rad={0.01} />
      <Box p={[-2.6, 1.5, -2.97]} s={[1.0, 0.06, 0.04]} c="#f5f2ea" rad={0.005} /><Box p={[-2.6, 1.5, -2.97]} s={[0.06, 1.1, 0.04]} c="#f5f2ea" rad={0.005} />
      {/* piso del altillo (cielorraso) */}
      <Box p={[-0.8, 2.63, -4.5]} s={[6.45, 0.06, 3.05]} c="#8a6a48" map={tt.wood} rad={0.005} />
      {/* faldones del techo */}
      {[-1, 1].map((sd) => <group key={sd} position={[-0.8, 3.45, -4.5 + sd * 0.82]} rotation={[sd * 0.78, 0, 0]}>
        <Box p={[0, 0, 0]} s={[6.7, 0.08, 2.3]} c="#ffffff" map={tt.shingle} r={0.9} rad={0.01} />
      </group>)}
      {/* hastial izquierdo (cerrado) */}
      <mesh position={[-4.0, 2.66, -4.5]} rotation={[0, -Math.PI / 2, 0]}><shapeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-1.55, 0); sh.lineTo(1.55, 0); sh.lineTo(0, 1.55); sh.closePath(); return sh; })()]} /><meshStandardMaterial map={tt.clap} color="#ffffff" side={THREE.DoubleSide} /></mesh>
      {/* cabriadas del altillo (se ven por el corte) */}
      {[-3.5, -2.7, -1.9, -1.1, -0.3, 0.5, 1.3, 2.1].map((x) => <group key={x}>
        {[-1, 1].map((sd) => <Box key={sd} p={[x, 3.4, -4.5 + sd * 0.75]} s={[0.06, 0.1, 2.15]} c="#a07a4c" rot={[sd * 0.78, 0, 0]} rad={0.005} />)}
        <Box p={[x, 2.75, -4.5]} s={[0.06, 0.12, 2.9]} c="#a07a4c" rad={0.005} />
      </group>)}
      {/* lana de vidrio rosa entre los tirantes */}
      <Box p={[-0.8, 2.72, -4.5]} s={[6.3, 0.08, 2.8]} c="#ffffff" map={tt.insul} r={1} rad={0.02} />
      {/* alero frontal (tabla de alero, canaleta) y EL AGUJERO */}
      <Box p={[-0.8, 2.95, -2.92]} s={[6.7, 0.16, 0.05]} c="#f4f1ea" rad={0.005} />
      <Cyl p={[-0.8, 2.86, -2.82]} r={0.06} h={6.7} c="#c8ccd0" m={0.6} rough={0.4} rot={[0, 0, Math.PI / 2]} />
      {s.hole < 2.5 && <mesh position={[PT.hole[0], PT.hole[1] - 0.07, -2.89]}><circleGeometry args={[0.055, 20]} /><meshBasicMaterial color="#120e0b" /></mesh>}
      {s.hole >= 0.5 && s.hole < 1.5 && <group position={[PT.hole[0], PT.hole[1] - 0.07, -2.84]}>{/* puerta de un solo sentido */}
        <Cyl p={[0, 0, 0.08]} r={0.07} h={0.18} c="#b9bcbe" m={0.6} rough={0.4} rot={[Math.PI / 2, 0, 0]} op={0.75} />
      </group>}
      {s.hole >= 1.5 && <mesh position={[PT.hole[0], PT.hole[1] - 0.07, -2.885]}><planeGeometry args={[0.26, 0.2]} /><meshStandardMaterial map={tt.hcloth} transparent alphaTest={0.3} metalness={0.6} roughness={0.4} side={THREE.DoubleSide} /></mesh>}
      {s.hole >= 2.5 && <Box p={[PT.hole[0], PT.hole[1] - 0.07, -2.88]} s={[0.28, 0.22, 0.012]} c="#f4f1ea" rad={0.004} />}
      {/* chimenea con su sombrero de malla */}
      <Box p={[PT.chimney[0], 4.1, PT.chimney[2]]} s={[0.5, 1.4, 0.5]} c="#8a4a36" r={0.95} rad={0.01} />
      {s.cap > 0.01 && <group position={[PT.chimney[0], 4.85 + (1 - ease(s.cap)) * 0.6, PT.chimney[2]]}><Box p={[0, 0.15, 0]} s={[0.6, 0.03, 0.6]} c="#9aa0a4" m={0.7} rad={0.005} /><Box p={[0, 0.06, 0]} s={[0.52, 0.16, 0.52]} c="#b9bcbe" m={0.6} op={0.5} rad={0.005} /></group>}

      {/* ===== ADENTRO DEL ALTILLO: nido, bebés, algodones con menta, radio, linterna ===== */}
      {s.nest > 0.01 && <group position={PT.nest} scale={ease(s.nest)}>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.4, rnd(i, 2) * 0.12, (rnd(i, 3) - 0.5) * 0.35]}><icosahedronGeometry args={[0.07 + rnd(i, 4) * 0.05, 0]} /><meshStandardMaterial color={["#b88a5a", "#e9a3a8", "#8a6a3a", "#d9cfb6"][i % 4]} roughness={1} flatShading /></mesh>)}
        {s.babies > 0.01 && [0, 1, 2].map((i) => <Ball key={i} p={[(i - 1) * 0.08, 0.16, 0.02]} r={0.045 * ease(s.babies)} c="#d9b7a8" s={[1.3, 0.8, 0.9]} />)}
      </group>}
      {s.cotton > 0.01 && [[1.8, -3.6], [0.9, -3.4], [-0.4, -3.5], [1.6, -5.3], [0.2, -5.4]].map(([x, z], i) => {
        const k = ease(cl(s.cotton * 5 - i)); if (k <= 0.01) return null;
        return <group key={i} position={[x, 2.79, z]} scale={k}><Cyl p={[0, 0.01, 0]} r={0.05} h={0.02} c="#c0c4c8" m={0.6} /><Ball p={[0, 0.045, 0]} r={0.035} c="#ffffff" rough={1} />
          {s.mintAir > 0.01 && <Ball p={[0, 0.12 + (t * 0.1 % 0.2), 0]} r={0.06} c="#bfe8d0" s={[1, 1.4, 1]} e="#bfe8d0" ei={0.2 * s.mintAir} />}</group>;
      })}
      {s.radio > 0.01 && <group position={[PT.radio[0], 2.79, PT.radio[2]]} scale={ease(s.radio)}><Box p={[0, 0.07, 0]} s={[0.24, 0.14, 0.08]} c="#7a2a1e" r={0.5} rad={0.015} /><Cyl p={[0.03, 0.08, 0.042]} r={0.04} h={0.005} c="#2a2a2a" rot={[Math.PI / 2, 0, 0]} /><Cyl p={[-0.08, 0.2, 0]} r={0.004} h={0.2} c="#999" m={0.8} rot={[0, 0, 0.4]} /></group>}
      <group position={[1.9, 2.8, -4.2]}><Cyl p={[0, 0.06, 0]} r={0.03} h={0.16} c="#2a2a2a" m={0.4} rot={[0, 0, Math.PI / 2]} /></group>

      {/* ===== EL PORCHE y LA MESA de las 3 cosas ===== */}
      <Box p={[0.9, 0.3, -2.3]} s={[2.4, 0.08, 1.5]} c="#9a7650" map={tt.wood} r={0.8} rad={0.01} />
      {[[-0.25, -1.6], [2.05, -1.6]].map(([x, z], i) => <Box key={i} p={[x, 1.5, z]} s={[0.1, 2.4, 0.1]} c="#f4f1ea" rad={0.01} />)}
      <Box p={[0.9, 2.65, -2.1]} s={[2.5, 0.06, 1.3]} c="#f4f1ea" rad={0.01} />
      <Box p={[1.3, 1.1, -3.0]} s={[0.9, 1.9, 0.05]} c="#5d6f63" r={0.6} rad={0.01} />
      {/* escalones */}
      {[0, 1].map((i) => <Box key={i} p={[1.6, 0.1 + i * 0.1, -1.4 - i * 0.2]} s={[1.0, 0.1, 0.3]} c="#8a6a48" map={tt.wood} rad={0.01} />)}
      {/* la mesa de jardín */}
      <Box p={[PT.table[0], 0.93, PT.table[2]]} s={[1.0, 0.05, 0.6]} c="#7a5a3a" map={tt.wood} rad={0.01} />
      {[[-0.42, -0.24], [0.42, -0.24], [-0.42, 0.24], [0.42, 0.24]].map(([x, z], i) => <Box key={i} p={[PT.table[0] + x, 0.62, PT.table[2] + z]} s={[0.05, 0.6, 0.05]} c="#5a3d26" rad={0.008} />)}
      <Jar p={[PT.chili[0], 0.955, PT.chili[2]]} k={s.items[0]} fill="#b8321e" lid="#7a1d12" tex={labels.chili} />
      <Jar p={[PT.soap[0], 0.955, PT.soap[2]]} k={s.items[1]} fill="#5fae6a" lid="#e8e8e8" tex={labels.soap} h={0.22} r={0.045} />
      <Jar p={[PT.mint[0], 0.955, PT.mint[2]]} k={s.items[2]} fill="#3a2414" lid="#111" tex={labels.mint} h={0.09} r={0.028} />
      {s.spray > 0.01 && <group position={[PT.table[0] + 0.05, 0.955 + (1 - ease(s.spray)) * 0.5, PT.table[2] + 0.18]} scale={ease(s.spray)}>
        <Cyl p={[0, 0.1, 0]} r={0.045} h={0.2} c="#d2c8bc" rough={0.3} op={0.6} /><Cyl p={[0, 0.08, 0]} r={0.04} h={0.15} c="#c8501e" />
        <Box p={[0, 0.24, 0.01]} s={[0.05, 0.07, 0.08]} c="#f0f0f0" rad={0.01} /><Box p={[0, 0.2, 0.04]} s={[0.015, 0.06, 0.02]} c="#f0f0f0" rad={0.004} />
      </group>}

      {/* ===== LOS CANTEROS ===== */}
      {/* el de los tulipanes: tierra con los pozos de la ardilla */}
      <group position={PT.tulips}>
        <Box p={[0, -0.12, 0]} s={[2.4, 0.36, 1.3]} c="#7a5a3a" map={tt.wood} rad={0.01} />
        <Box p={[0, 0.04, 0]} s={[2.3, 0.06, 1.2]} c="#ffffff" map={tt.soil} r={1} rad={0.01} />
        {Array.from({ length: 12 }, (_, i) => { const k = cl(s.holes * 12 - i); if (k <= 0.01) return null;
          const x = (rnd(i, 1) - 0.5) * 2.0, z = (rnd(i, 2) - 0.5) * 1.0;
          return <group key={i}><mesh position={[x, 0.075, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.07 * k, 14]} /><meshBasicMaterial color="#140d08" /></mesh>
            <Ball p={[x + 0.1, 0.08, z + 0.05]} r={0.05 * k} c="#3f2d20" s={[1.4, 0.4, 1]} /></group>; })}
        {/* bulbos (rojos de cayena si ya los espolvoreó) */}
        {s.bulbs > 0.01 && Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.9 + (i % 5) * 0.45, 0.1 + (1 - ease(s.bulbs)) * 0.4, -0.25 + Math.floor(i / 5) * 0.5]} scale={[1, 1.25, 1]}>
          <sphereGeometry args={[0.05, 12, 10]} /><meshStandardMaterial color={new THREE.Color("#c9a77a").lerp(new THREE.Color("#c0391b"), s.red).getStyle()} roughness={0.9} /></mesh>)}
        {/* la línea fina de cayena */}
        {s.line > 0.01 && <mesh position={[-1.05 + 1.05 * s.line, 0.076, 0.42]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.1 * s.line, 0.03]} /><meshBasicMaterial color="#c0391b" toneMapped={false} /></mesh>}
        {/* la malla de gallinero, plana con 4 piedras */}
        {s.wire > 0.01 && <group position={[0, 0.09 + (1 - ease(s.wire)) * 0.7, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.1]} /><meshStandardMaterial map={tt.mesh} transparent alphaTest={0.3} metalness={0.5} roughness={0.5} side={THREE.DoubleSide} /></mesh>
          {[[-1.05, -0.5], [1.05, -0.5], [-1.05, 0.5], [1.05, 0.5]].map(([x, z], i) => <mesh key={i} position={[x, 0.04, z]} scale={[1, 0.55, 1]}><dodecahedronGeometry args={[0.09, 0]} /><meshStandardMaterial color="#86837a" flatShading /></mesh>)}
        </group>}
        {/* primavera: tulipanes rojos que atraviesan la malla + el anillo de narcisos + las cebollas moradas */}
        {s.bloom > 0.01 && Array.from({ length: 10 }, (_, i) => { const x = -0.9 + (i % 5) * 0.45, z = -0.25 + Math.floor(i / 5) * 0.5, h = 0.4 * ease(s.bloom);
          return <group key={i}><Cyl p={[x, 0.08 + h / 2, z]} r={0.01} h={h} c="#4f7f34" /><Ball p={[x, 0.1 + h, z]} r={0.05} c="#c8321e" s={[1, 1.4, 1]} /></group>; })}
        {s.daff > 0.01 && Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, x = Math.cos(a) * 1.05, z = Math.sin(a) * 0.52, h = 0.32 * ease(s.daff);
          return <group key={i}><Cyl p={[x, 0.08 + h / 2, z]} r={0.009} h={h} c="#5d8f3a" /><Ball p={[x, 0.1 + h, z]} r={0.04 * ease(s.daff)} c="#f2c230" s={[1.3, 0.6, 1.3]} /></group>; })}
        {s.allium > 0.01 && [[-0.68, 0], [0.22, 0], [0.68, 0.25]].map(([x, z], i) => { const h = 0.7 * ease(s.allium);
          return <group key={i}><Cyl p={[x, 0.08 + h / 2, z]} r={0.01} h={h} c="#5d8f3a" /><Ball p={[x, 0.12 + h, z]} r={0.08 * ease(s.allium)} c="#8a5ab8" /></group>; })}
        {s.mintCrush > 0.01 && Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[(rnd(i, 5) - 0.5) * 2, 0.08, (rnd(i, 6) - 0.5) * 1.0]} rotation={[-Math.PI / 2, 0, rnd(i, 7) * 6]} scale={s.mintCrush}><planeGeometry args={[0.06, 0.035]} /><meshStandardMaterial color="#4f9f5a" side={THREE.DoubleSide} /></mesh>)}
      </group>
      {/* el de los tomates */}
      <group position={[PT.tomato[0], 0, PT.tomato[2]]}>
        <Box p={[0, 0.18, 0]} s={[1.4, 0.36, 2.2]} c="#7a5a3a" map={tt.wood} rad={0.01} />
        <Box p={[0, 0.37, 0]} s={[1.3, 0.04, 2.1]} c="#ffffff" map={tt.soil} r={1} rad={0.01} />
        {[-0.7, 0, 0.7].map((z, i) => { const g = s.tom; if (g <= 0.01) return <Cyl key={i} p={[0, 0.9, z]} r={0.012} h={1.1} c="#8a6a3a" />;
          return <group key={i} position={[0, 0.38, z]}>
            <Cyl p={[0.1, 0.6, 0]} r={0.012} h={1.2} c="#8a6a3a" />
            {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[(rnd(j + i * 9, 1) - 0.5) * 0.4, 0.15 + rnd(j + i * 9, 2) * 0.9 * g, (rnd(j + i * 9, 3) - 0.5) * 0.4]} scale={g}><icosahedronGeometry args={[0.13, 0]} /><meshStandardMaterial color="#4f7f34" flatShading /></mesh>)}
            {[0, 1, 2, 3].map((j) => { const ripe = cl(s.ripe * 4 - j * 0.6);
              return <Ball key={"t" + j} p={[0.14 * Math.cos(j * 1.7), 0.35 + j * 0.15, 0.14 * Math.sin(j * 1.7)]} r={0.055 * g} c={new THREE.Color("#6f9f3a").lerp(new THREE.Color("#e8614a"), ripe * 0.6).lerp(new THREE.Color("#d42a1e"), ripe > 0.95 ? 1 : 0).getStyle()} rough={0.35} />; })}
          </group>; })}
      </group>
      {/* el plato de agua al fondo del patio */}
      {s.dish > 0.01 && <group position={PT.dish} scale={ease(s.dish)}><Cyl p={[0, 0.03, 0]} r={0.22} r2={0.16} h={0.06} c="#a8643a" rough={0.8} /><Cyl p={[0, 0.055, 0]} r={0.19} h={0.01} c="#7fa6b8" rough={0.05} m={0.3} /></group>}

      {/* ===== EL CAQUI, EL ROBLE, LA CERCA ===== */}
      <Tree p={[PT.persimmon[0], 0, PT.persimmon[2]]} t={t} h={2.4} spread={2.2} cols={leafCols} n={18} bare={bare} fruit={se < 1 ? 1 : 0} />
      <Tree p={[PT.oak[0], 0, PT.oak[2]]} t={t + 3} h={4.2} spread={4.2} cols={leafCols} trunk="#3d3226" n={30} bare={bare} />
      {/* la rama del roble que llega al techo (se corta) */}
      {s.branchCut < 0.99 && <Branch a={[PT.oak[0] - 0.3, 3.9, PT.oak[2] - 0.2]} b={PT.branch} cut={ease(s.branchCut)} />}
      {Array.from({ length: 26 }, (_, i) => <Box key={i} p={[-6 + i * 0.6, 0.7, 3.4]} s={[0.55, 1.4, 0.05]} c="#ffffff" map={tt.grey} r={0.95} rad={0.005} />)}
      {Array.from({ length: 12 }, (_, i) => <Box key={"z" + i} p={[9.6, 0.7, 3.1 - i * 0.6]} s={[0.05, 1.4, 0.55]} c="#ffffff" map={tt.grey} r={0.95} rad={0.005} />)}

      {/* ===== EL COMEDERO en su caño de metal ===== */}
      <group position={[PT.feeder[0], 0, PT.feeder[2]]}>
        <Cyl p={[0, 0.85, 0]} r={0.025} h={1.7} c="#2a2a2a" m={0.7} rough={0.3} />
        <Box p={[0, 1.78, 0]} s={[0.22, 0.24, 0.22]} c="#dfeaf0" r={0.05} op={0.4} rad={0.01} />
        <Box p={[0, 1.72, 0]} s={[0.2, 0.14, 0.2]} c={new THREE.Color("#c9a86a").lerp(new THREE.Color("#c0391b"), s.feedRed * 0.6).getStyle()} r={1} rad={0.01} />
        <mesh position={[0, 1.95, 0]}><coneGeometry args={[0.2, 0.12, 4]} /><meshStandardMaterial color="#5a3d26" /></mesh>
        <Box p={[0, 1.6, 0]} s={[0.34, 0.02, 0.34]} c="#5a3d26" rad={0.004} />
        {s.birds > 0.01 && <group scale={ease(s.birds)}><Ball p={[0.15, 1.66, 0]} r={0.045} c="#c8201e" s={[1.3, 1, 0.9]} /><mesh position={[0.2, 1.7, 0]} rotation={[0, 0, -1.2]}><coneGeometry args={[0.015, 0.04, 6]} /><meshStandardMaterial color="#e6a03a" /></mesh>
          <Ball p={[-0.15, 1.65, 0.04]} r={0.035} c="#3a3a3a" s={[1.2, 1, 0.9]} /><Ball p={[-0.15, 1.645, 0.06]} r={0.025} c="#f2f0ea" /></group>}
      </group>

      {/* ===== EL GALPÓN con las ristras de ají ===== */}
      <group position={[PT.shed[0], 0, PT.shed[2]]}>
        <Box p={[0, 1.0, 0]} s={[1.8, 2.0, 1.6]} c="#ffffff" map={tt.grey} r={0.95} rad={0.01} />
        <group position={[0, 2.2, 0]}><Box p={[0, 0, 0]} s={[2.2, 0.08, 2.0]} c="#3a3430" rot={[0, 0, 0.2]} rad={0.01} /></group>
        <Box p={[0.91, 0.9, 0.1]} s={[0.04, 1.7, 0.8]} c="#5a4a38" rad={0.005} />
        {[-0.5, 0, 0.5].map((z, i) => <group key={i} position={[1.0, 1.5, z]}>
          {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[0, -j * 0.08, Math.sin(t * 1.4 + j + i) * 0.006]} rotation={[0, 0, 0.3 * (j % 2 ? 1 : -1)]}><coneGeometry args={[0.022, 0.09, 8]} /><meshStandardMaterial color={["#b8321e", "#9e2a18", "#c8401e"][j % 3]} roughness={0.5} /></mesh>)}
        </group>)}
      </group>

      {/* ===== LA ARDILLA (o dos): la mueve ST ===== */}
      {s.sq.map((q, i) => q.on > 0.01 ? <Squirrel key={i} p={q.p} rot={q.rot} t={t + i} pose={q.pose} cheek={q.cheek} s={q.on} /> : null)}

      {/* escarcha de diciembre */}
      {frost > 0.01 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}><planeGeometry args={[90, 90]} /><meshStandardMaterial color="#f2f6f8" transparent opacity={0.35 * frost} roughness={0.6} /></mesh>}
    </ThreeCanvas>
  );
};
