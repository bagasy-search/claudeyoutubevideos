// so29 · EL MUNDO: la cocina de Sachiko en corte (le falta la pared del frente), de mañana, con la luz de la ventana de la pileta.
// Al fondo, de izquierda a derecha: la puerta con el noren índigo, la mesada con la arrocera, la pileta bajo la ventana (el reloj arriba),
// la cocina a gas con la sartén de hierro y la pava, la mesada de madera con la tabla de cortar y la panera, el estante de frascos,
// y la heladera blanca con el freezer arriba (la puerta se abre y adentro están los paquetes planos). Adelante, la mesita con dos sillas.
// Sirve a los 5 videos de la tanda: cada video prende SUS estados (tlk.ts). UNA escena y UNA cámara. Render SÓLO en el farm.
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post, useTextures, rbox } from "./fx3d";
import { KEYS, ST, Item } from "./tlk";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
type V = [number, number, number];

// ---------------- medidas ----------------
const ZW = -2.9, HW = 2.6, CH = 0.9, CZ = -2.6;            // pared del fondo, alto de pared, alto y centro de la mesada
const WX0 = -1.95, WX1 = -0.85, WY0 = 1.15, WY1 = 2.0;      // la ventana sobre la pileta
const DX0 = -3.85, DX1 = -2.95, DY1 = 2.05;                 // la puerta con el noren
export const PT = {
  board: [1.0, 0.93, -2.5] as V, pan: [0.15, 0.97, -2.55] as V, kettle: [-0.2, 0.98, -2.72] as V, sink: [-1.4, 0.9, -2.6] as V,
  rice: [-2.15, 0.9, -2.65] as V, bread: [1.75, 0.9, -2.68] as V, jar: [1.35, 0.9, -2.72] as V, fridge: [2.75, 0.9, -2.5] as V,
  freezer: [2.75, 1.52, -2.25] as V, table: [-1.6, 0.74, 0.5] as V, clock: [-1.4, 2.3, -2.86] as V, noren: [-3.4, 1.6, -2.85] as V,
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
  p.x += Math.sin(t * 0.53) * 0.01; p.y += Math.sin(t * 0.71 + 1) * 0.007;
  return { p, l, fov: lerp(a.fov ?? 38, b.fov ?? 38, k) };
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

// ---------------- texturas propias ----------------
const mk = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep: [number, number] = [1, 1]) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t;
};
const useKTex = () => useMemo(() => ({
  wall: mk(512, 512, (g) => {
    g.fillStyle = "#ece2cf"; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5200; i++) { const v = 208 + rnd(i, 1) * 34; g.fillStyle = `rgba(${v},${v - 10},${v - 28},.3)`; g.fillRect(rnd(i, 2) * 512, rnd(i, 3) * 512, 2, 2); }
  }, [3, 2]),
  // azulejos blancos cuadrados con junta gris (entre la mesada y el estante)
  tiles: mk(256, 256, (g) => {
    g.fillStyle = "#b9b3a8"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const v = 240 + rnd(x + y * 4, 1) * 12; g.fillStyle = `rgb(${v},${v - 2},${v - 6})`; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(x * 64 + 6, y * 64 + 6, 22, 6); }
  }, [6, 2]),
  // madera de la mesada (veta larga, barnizada)
  wood: mk(512, 128, (g) => {
    g.fillStyle = "#a8753f"; g.fillRect(0, 0, 512, 128);
    for (let y = 0; y < 128; y += 2) { const v = rnd(y, 4); g.fillStyle = `rgba(${90 + v * 40},${55 + v * 25},${25 + v * 10},.35)`; g.fillRect(0, y, 512, 1 + v * 2); }
    for (let i = 0; i < 40; i++) { g.strokeStyle = "rgba(70,40,15,.25)"; g.lineWidth = 1; g.beginPath(); const y = rnd(i, 5) * 128; g.moveTo(0, y); g.bezierCurveTo(170, y + 6 * rnd(i, 6), 340, y - 6, 512, y + 3); g.stroke(); }
  }, [3, 1]),
  // tabla de cortar (madera clara de hinoki)
  hinoki: mk(256, 128, (g) => {
    g.fillStyle = "#e6c99a"; g.fillRect(0, 0, 256, 128);
    for (let y = 0; y < 128; y += 3) { g.fillStyle = `rgba(170,120,60,${0.12 + 0.12 * rnd(y, 7)})`; g.fillRect(0, y, 256, 1); }
  }),
  // noren índigo con el blasón blanco (círculo con tres hojas) y las rayitas de tela
  noren: mk(256, 256, (g) => {
    g.fillStyle = "#26365e"; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 6) { g.fillStyle = "rgba(255,255,255,.04)"; g.fillRect(0, y, 256, 2); }
    g.fillStyle = "#f3efe6"; for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i * 2 * Math.PI) / 5; g.beginPath(); g.arc(128 + Math.cos(an) * 22, 96 + Math.sin(an) * 22, 19, 0, 6.3); g.fill(); }
    g.fillStyle = "#26365e"; g.beginPath(); g.arc(128, 96, 9, 0, 6.3); g.fill();
    g.fillStyle = "#1b2747"; g.fillRect(126, 150, 4, 106);
  }),
  // esfera del reloj
  clock: mk(256, 256, (g) => {
    g.fillStyle = "#fffaf0"; g.beginPath(); g.arc(128, 128, 124, 0, 6.3); g.fill();
    g.fillStyle = "#2a2a2a"; g.font = "bold 30px serif"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillText(String(i), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
  }),
  // calendario de pared (grilla de días, un día marcado en rojo)
  cal: mk(256, 320, (g) => {
    g.fillStyle = "#fbf8f1"; g.fillRect(0, 0, 256, 320);
    g.fillStyle = "#b8312f"; g.fillRect(0, 0, 256, 54); g.fillStyle = "#fff"; g.font = "bold 34px sans-serif"; g.textAlign = "center"; g.fillText("10", 128, 40);
    g.fillStyle = "#333"; g.font = "18px sans-serif";
    for (let i = 0; i < 31; i++) { const x = 22 + (i % 7) * 35, y = 90 + Math.floor(i / 7) * 46; g.fillStyle = i % 7 === 0 ? "#b8312f" : "#333"; g.fillText(String(i + 1), x + 8, y); }
    g.strokeStyle = "#d62828"; g.lineWidth = 4; g.beginPath(); g.arc(22 + 3 * 35 + 8, 90 + 2 * 46 - 6, 17, 0, 6.3); g.stroke();
  }),
  // piel del salmón (filete naranja con vetas blancas)
  salmon: mk(256, 128, (g) => {
    g.fillStyle = "#f2894f"; g.fillRect(0, 0, 256, 128);
    g.strokeStyle = "rgba(255,240,225,.85)"; g.lineWidth = 3;
    for (let x = -40; x < 300; x += 22) { g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 22, 64, x - 8, 128); g.stroke(); }
  }),
  // papada: rosado pálido con vetas de grasa blanca
  pork: mk(256, 128, (g) => {
    g.fillStyle = "#f1c9bf"; g.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(255,250,244,${0.5 + 0.4 * rnd(i, 2)})`; g.lineWidth = 1 + 3 * rnd(i, 3); g.beginPath(); const x = rnd(i, 4) * 256, y = rnd(i, 5) * 128; g.moveTo(x, y); g.lineTo(x + 30 * rnd(i, 6) - 15, y + 20 * rnd(i, 7)); g.stroke(); }
  }),
  // miga del pan
  crumb: mk(128, 128, (g) => {
    g.fillStyle = "#f4e6c8"; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(200,170,110,${0.3 * rnd(i, 1)})`; g.beginPath(); g.arc(rnd(i, 2) * 128, rnd(i, 3) * 128, 1 + 2 * rnd(i, 4), 0, 6.3); g.fill(); }
  }),
}), []);

// ---------------- piezas ----------------
type Tx = THREE.Texture | undefined;
const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; e?: string; ei?: number; cast?: boolean; map?: Tx; rad?: number; rot?: V; op?: number }> = ({ p, s, c, r = 0.85, m = 0, e, ei = 0, cast = true, map, rad = 0.025, rot, op }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow geometry={rbox(s[0], s[1], s[2], rad)}><meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
const Cyl: React.FC<{ p: V; r: number; h: number; c: string; rough?: number; m?: number; rot?: V; e?: string; ei?: number; seg?: number; r2?: number; op?: number; map?: Tx }> = ({ p, r, h, c, rough = 0.6, m = 0, rot, e, ei = 0, seg = 32, r2, op, map }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r2 ?? r, h, seg]} /><meshStandardMaterial color={c} roughness={rough} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} transparent={op !== undefined} opacity={op ?? 1} /></mesh>
);
// aro de luz sobre la mesada (lo que la voz nombra se ilumina sin corte): nunca parpadea, sube y baja con el estado
const Halo: React.FC<{ p: V; r: number; k: number; col?: string }> = ({ p, r, k, col = "#ffb347" }) =>
  k < 0.01 ? null : <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[r * 0.82, r, 64]} /><meshBasicMaterial color={col} transparent opacity={0.55 * k} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
// hilo de vapor/humo: 4 bocanadas que suben y se abren (ritmo lento, <1 Hz)
const Vapor: React.FC<{ p: V; t: number; k: number; col?: string; s?: number }> = ({ p, t, k, col = "#ffffff", s = 1 }) => {
  if (k < 0.02) return null;
  return <group position={p}>{[0, 1, 2, 3].map((i) => {
    const f = ((t * 0.45 + i / 4) % 1);
    return <mesh key={i} position={[Math.sin(f * 5 + i) * 0.03 * s, f * 0.45 * s, 0]}><sphereGeometry args={[(0.03 + f * 0.07) * s, 16, 12]} /><meshStandardMaterial color={col} transparent opacity={0.28 * k * Math.sin(Math.PI * f)} depthWrite={false} roughness={1} /></mesh>;
  })}</group>;
};

// lo que hay sobre la tabla (cambia por video y por momento)
const OnBoard: React.FC<{ item: Item; t: number; slices: number; tt: ReturnType<typeof useKTex> }> = ({ item, t, slices, tt }) => {
  const n = Math.round(slices * 6);
  if (item === "salmon") return <group>
    <Box p={[0, 0.006, 0]} s={[0.34, 0.01, 0.16]} c="#8d939b" r={0.35} m={0.3} rad={0.005} />
    <Box p={[0, 0.022, 0]} s={[0.33, 0.026, 0.15]} c="#ffffff" map={tt.salmon} r={0.3} rad={0.009} />
  </group>;
  if (item === "pork") return <group>
    <Box p={[-0.05 - 0.02 * n, 0.04, 0]} s={[Math.max(0.06, 0.24 - 0.025 * n), 0.07, 0.17]} c="#ffffff" map={tt.pork} r={0.45} rad={0.025} />
    {Array.from({ length: n }, (_, i) => <Box key={i} p={[0.11 + i * 0.02, 0.012 + i * 0.004, 0.02 * Math.sin(i)]} s={[0.012, 0.012, 0.16]} c="#ffffff" map={tt.pork} r={0.45} rad={0.004} rot={[0, 0, -0.5]} />)}
  </group>;
  if (item === "bread") return <group>
    <Box p={[-0.04 - 0.012 * n, 0.07, 0]} s={[Math.max(0.08, 0.24 - 0.02 * n), 0.13, 0.13]} c="#c88a45" r={0.7} rad={0.04} />
    <mesh position={[0.08 - 0.012 * n - 0.012 * n + 0.012, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.12, 0.12]} /><meshStandardMaterial map={tt.crumb} roughness={0.9} /></mesh>
    {Array.from({ length: n }, (_, i) => <Box key={i} p={[0.14 + i * 0.016, 0.06, 0]} s={[0.012, 0.12, 0.125]} c="#f4e6c8" map={tt.crumb} r={0.9} rad={0.006} rot={[0, 0, -0.18]} />)}
  </group>;
  if (item === "ginger") return <group>
    {[[-0.06, 0, 0], [0.02, 0.01, 0.03], [0.06, 0, -0.03], [-0.02, 0, -0.04], [0.1, 0, 0.02]].map(([x, y, z], i) =>
      <mesh key={i} position={[x, 0.03 + y, z]} rotation={[Math.PI / 2, 0.6 * i, 0.4 * i]} castShadow><capsuleGeometry args={[0.022, 0.06 + 0.02 * (i % 2), 6, 12]} /><meshStandardMaterial color={i < n ? "#f2d37a" : "#c8a66e"} roughness={0.75} /></mesh>)}
    <group position={[0.17, 0.012, 0.05]} rotation={[0, -0.6, 0]}><Box p={[0, 0, 0]} s={[0.1, 0.006, 0.012]} c="#cfd3d8" r={0.25} m={0.9} rad={0.003} /><mesh position={[0.06, 0.003, 0]} scale={[1, 0.3, 0.75]}><sphereGeometry args={[0.022, 16, 12]} /><meshStandardMaterial color="#d4d8dd" roughness={0.2} metalness={0.95} /></mesh></group>
  </group>;
  if (item === "rice") return <group>
    {[0, 1, 2].map((i) => <Box key={i} p={[-0.1 + i * 0.1, 0.012 + (i === 1 ? 0 : 0), 0]} s={[0.09, 0.022, 0.09]} c="#f7f5ee" r={0.35} rad={0.01} op={0.95} />)}
  </group>;
  return <group>{[0, 1].map((i) => <Box key={i} p={[-0.06 + i * 0.13, 0.012, 0]} s={[0.12, 0.02, 0.12]} c="#b9655a" r={0.5} rad={0.01} />)}</group>;
};

// ===================================================================================================
export const World: React.FC<{ t: number }> = ({ t }) => {
  const tx = useTextures(), tt = useKTex();
  const s = ST(t);
  const sun = s.eve;
  const doorA = ease(s.freezer) * 1.9;                   // la puerta del freezer se abre hacia la derecha
  const lidA = -ease(s.breadBox) * 1.25;                 // la tapa de la panera
  const sz = s.sizzle;
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      <Post bloom={0.35} threshold={0.97} exposure={1.15} env={0.5} />
      <color attach="background" args={[new THREE.Color("#d9e3ea").lerp(new THREE.Color("#ead0a8"), sun * 0.6).getStyle()]} />
      <fog attach="fog" args={["#dde4ea", 14, 40]} />
      <hemisphereLight args={[0xf2ece0, 0x7a6650, 0.95]} />
      {/* el sol de la mañana: entra por la ventana de la pileta (siempre montado; sólo cambia el color con la hora) */}
      <directionalLight position={[-2.5, 4.5, -9]} intensity={2.0} color={new THREE.Color("#fff0d6").lerp(new THREE.Color("#ffc890"), sun).getStyle()} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <directionalLight position={[3, 5, 6]} intensity={0.9} color="#fff6ea" />
      <pointLight position={[0.4, 2.3, -1.4]} intensity={1.4} distance={7} color="#fff1dc" />
      <pointLight position={[-1.6, 2.1, 1.2]} intensity={0.9} distance={6} color="#fff1dc" />
      {/* el foco cálido que marca lo que se nombra (siempre montado; sube con el estado) */}
      <spotLight position={[s.spot[0], 2.5, s.spot[2] + 0.9]} target-position={[s.spot[0], s.spot[1], s.spot[2]]} angle={0.4} penumbra={0.85} intensity={0.2 + 4.5 * s.spotK} distance={5} color="#ffd9a0" />
      {/* resplandor de la hornalla (rampa; siempre montado) */}
      <pointLight position={[0.15, 0.95, -2.5]} intensity={0.05 + 0.9 * sz} distance={1.2} color="#ff9b4a" />

      {/* piso de madera y suelo de afuera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#b8b0a2" roughness={0.97} /></mesh>
      <Box p={[0, 0.02, -0.6]} s={[8.2, 0.04, 4.8]} c="#8a6a4a" map={tx.planks} r={0.6} rad={0.005} />

      {/* ===== pared del fondo con el hueco de la puerta y de la ventana ===== */}
      <Box p={[(-4.1 + DX0) / 2, HW / 2, ZW - 0.1]} s={[DX0 + 4.1, HW, 0.2]} c="#ece2cf" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(DX0 + DX1) / 2, (DY1 + HW) / 2, ZW - 0.1]} s={[DX1 - DX0, HW - DY1, 0.2]} c="#ece2cf" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(DX1 + WX0) / 2, HW / 2, ZW - 0.1]} s={[WX0 - DX1, HW, 0.2]} c="#ece2cf" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WX0 + WX1) / 2, WY0 / 2, ZW - 0.1]} s={[WX1 - WX0, WY0, 0.2]} c="#ece2cf" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WX0 + WX1) / 2, (WY1 + HW) / 2, ZW - 0.1]} s={[WX1 - WX0, HW - WY1, 0.2]} c="#ece2cf" map={tt.wall} r={0.92} rad={0.01} />
      <Box p={[(WX1 + 4.1) / 2, HW / 2, ZW - 0.1]} s={[4.1 - WX1, HW, 0.2]} c="#ece2cf" map={tt.wall} r={0.92} rad={0.01} />
      {/* pared del costado izquierdo (corta, para que la cocina tenga esquina) */}
      <Box p={[-4.1, HW / 2, -1.9]} s={[0.2, HW, 2.2]} c="#e6dcc8" map={tt.wall} r={0.92} rad={0.01} />
      {/* zócalo */}
      <Box p={[0, 0.06, ZW + 0.01]} s={[8.2, 0.12, 0.03]} c="#6e5038" r={0.6} rad={0.005} />
      {/* azulejos entre la mesada y el estante */}
      <mesh position={[0.15, 1.27, ZW + 0.005]}><planeGeometry args={[4.4, 0.72]} /><meshStandardMaterial map={tt.tiles} roughness={0.35} /></mesh>

      {/* ===== la puerta con el noren (afuera, el pasillo con luz) ===== */}
      <mesh position={[(DX0 + DX1) / 2, DY1 / 2, ZW - 0.45]}><planeGeometry args={[DX1 - DX0, DY1]} /><meshStandardMaterial color="#efe3cc" emissive="#fff0d8" emissiveIntensity={0.25} roughness={0.9} /></mesh>
      <Box p={[(DX0 + DX1) / 2, DY1 + 0.03, ZW + 0.02]} s={[DX1 - DX0 + 0.1, 0.06, 0.1]} c="#7a5634" r={0.6} rad={0.008} />
      <Cyl p={[(DX0 + DX1) / 2, DY1 - 0.04, ZW + 0.06]} r={0.012} h={1.0} c="#5a3d22" rot={[0, 0, Math.PI / 2]} />
      {[-1, 1].map((sd) => <mesh key={sd} position={[(DX0 + DX1) / 2 + sd * 0.215, DY1 - 0.36, ZW + 0.07]} rotation={[0.02 * Math.sin(t * 0.6 + sd) * (1 + 2 * s.noren), 0, 0]}>
        <planeGeometry args={[0.42, 0.62]} /><meshStandardMaterial map={tt.noren} roughness={0.95} side={THREE.DoubleSide} emissive="#ffb347" emissiveIntensity={0.15 * s.noren} /></mesh>)}

      {/* ===== la ventana de la pileta ===== */}
      <mesh position={[(WX0 + WX1) / 2, (WY0 + WY1) / 2, ZW - 0.12]}><planeGeometry args={[WX1 - WX0, WY1 - WY0]} /><meshStandardMaterial color="#cfe2ee" emissive="#eaf4ff" emissiveIntensity={0.55} roughness={0.2} /></mesh>
      {[WY0, WY1].map((y, i) => <Box key={"wy" + i} p={[(WX0 + WX1) / 2, y, ZW + 0.02]} s={[WX1 - WX0 + 0.08, 0.05, 0.1]} c="#f3efe6" r={0.5} rad={0.008} />)}
      {[WX0, WX1, (WX0 + WX1) / 2].map((x, i) => <Box key={"wx" + i} p={[x, (WY0 + WY1) / 2, ZW + 0.02]} s={[0.04, WY1 - WY0, 0.08]} c="#f3efe6" r={0.5} rad={0.008} />)}
      {/* plantita en el alféizar */}
      <Cyl p={[WX1 - 0.15, WY0 + 0.07, ZW + 0.05]} r={0.05} r2={0.04} h={0.1} c="#b5653f" rough={0.85} />
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[WX1 - 0.15 + 0.03 * Math.cos(i * 1.6), WY0 + 0.16, ZW + 0.05 + 0.03 * Math.sin(i * 1.6)]} rotation={[0.3 * Math.cos(i), i, 0.3 * Math.sin(i)]} scale={[1, 1.6, 0.5]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#4f8a3c" roughness={0.7} /></mesh>)}
      {/* el reloj sobre la ventana */}
      <group position={PT.clock}>
        <Cyl p={[0, 0, 0]} r={0.16} h={0.04} c="#6b4a2c" rot={[Math.PI / 2, 0, 0]} rough={0.5} />
        <mesh position={[0, 0, 0.022]}><circleGeometry args={[0.14, 48]} /><meshStandardMaterial map={tt.clock} roughness={0.6} emissive="#ffb347" emissiveIntensity={0.25 * s.clock} /></mesh>
        <mesh position={[0, 0, 0.026]} rotation={[0, 0, -t * 0.1]}><boxGeometry args={[0.006, 0.11, 0.004]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, -2.1]}><boxGeometry args={[0.009, 0.075, 0.004]} /><meshStandardMaterial color="#222" /></mesh>
      </group>
      {/* el calendario */}
      <mesh position={[-2.55, 1.6, ZW + 0.01]}><planeGeometry args={[0.36, 0.45]} /><meshStandardMaterial map={tt.cal} roughness={0.85} emissive="#ffb347" emissiveIntensity={0.2 * s.calendar} /></mesh>

      {/* ===== mesada izquierda + pileta + mesada derecha (muebles blancos abajo, tapa de madera barnizada) ===== */}
      <Box p={[-1.4, CH / 2 - 0.03, CZ]} s={[2.0, CH - 0.06, 0.6]} c="#f1ece2" r={0.55} rad={0.01} />
      <Box p={[1.3, CH / 2 - 0.03, CZ]} s={[1.8, CH - 0.06, 0.6]} c="#f1ece2" r={0.55} rad={0.01} />
      {[-2.15, -1.4, -0.65, 0.65, 1.3, 1.95].map((x, i) => <group key={"pu" + i}>
        <Box p={[x, 0.45, CZ + 0.305]} s={[0.66, 0.74, 0.01]} c="#ece6da" r={0.5} rad={0.004} />
        <Box p={[x + 0.24, 0.62, CZ + 0.32]} s={[0.012, 0.12, 0.02]} c="#a6a9ad" r={0.3} m={0.9} rad={0.004} />
      </group>)}
      <Box p={[-1.4, CH, CZ]} s={[2.04, 0.05, 0.64]} c="#ffffff" map={tt.wood} r={0.35} rad={0.008} />
      <Box p={[1.3, CH, CZ]} s={[1.84, 0.05, 0.64]} c="#ffffff" map={tt.wood} r={0.35} rad={0.008} />
      {/* la pileta de acero con la canilla */}
      <Box p={[-1.4, CH + 0.005, CZ + 0.02]} s={[0.62, 0.02, 0.42]} c="#c9ced3" r={0.2} m={0.9} rad={0.01} />
      <Box p={[-1.4, CH - 0.06, CZ + 0.02]} s={[0.56, 0.13, 0.36]} c="#9aa1a8" r={0.25} m={0.9} rad={0.01} />
      <Cyl p={[-1.4, CH + 0.16, CZ - 0.22]} r={0.015} h={0.3} c="#d5d9dd" m={0.95} rough={0.15} />
      <Cyl p={[-1.4, CH + 0.3, CZ - 0.14]} r={0.013} h={0.18} c="#d5d9dd" m={0.95} rough={0.15} rot={[Math.PI / 2, 0, 0]} />
      {/* la arrocera (blanca, tapa redonda) y el vapor */}
      <group position={PT.rice}>
        <Cyl p={[0, 0.12, 0]} r={0.14} r2={0.13} h={0.22} c="#f6f4ee" rough={0.3} />
        <mesh position={[0, 0.235, 0]} scale={[1, 0.35, 1]}><sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f2efe7" roughness={0.3} /></mesh>
        <Box p={[0, 0.1, 0.135]} s={[0.08, 0.05, 0.01]} c="#3a3f46" r={0.3} rad={0.004} e="#ff7a3a" ei={0.6} />
        <Vapor p={[0, 0.3, 0]} t={t} k={s.steam} />
      </group>

      {/* ===== la cocina a gas (blanca, 2 hornallas) con la sartén de hierro y la pava ===== */}
      <Box p={[0, CH / 2, CZ]} s={[0.78, CH, 0.6]} c="#f4f2ec" r={0.35} rad={0.012} />
      <Box p={[0, CH + 0.01, CZ]} s={[0.78, 0.03, 0.6]} c="#2b2d31" r={0.3} m={0.4} rad={0.008} />
      {[[-0.2, -2.72], [0.15, -2.55]].map(([x, z], i) => <group key={"ho" + i}>
        <mesh position={[x, CH + 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.09, 24]} /><meshStandardMaterial color="#1e1f22" metalness={0.6} roughness={0.4} /></mesh>
        {i === 1 && <mesh position={[x, CH + 0.032, z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.045, 0.06, 24]} /><meshBasicMaterial color="#4f8dff" transparent opacity={0.15 + 0.6 * sz} toneMapped={false} /></mesh>}
      </group>)}
      {[-0.27, -0.09, 0.09, 0.27].map((x, i) => <Cyl key={"pe" + i} p={[x, 0.78, CZ + 0.31]} r={0.025} h={0.03} c="#d9d9d9" m={0.6} rough={0.3} rot={[Math.PI / 2, 0, 0]} />)}
      <Box p={[0, 0.38, CZ + 0.305]} s={[0.66, 0.5, 0.01]} c="#2a2c30" r={0.15} m={0.3} rad={0.006} />
      {/* sartén de hierro negro con mango */}
      <group position={PT.pan}>
        <Cyl p={[0, 0.02, 0]} r={0.13} r2={0.115} h={0.04} c="#26272a" rough={0.55} m={0.65} />
        <Cyl p={[0, 0.042, 0]} r={0.115} h={0.002} c="#1a1b1d" rough={0.45} m={0.7} />
        <Box p={[0.21, 0.035, 0.05]} s={[0.17, 0.02, 0.035]} c="#26272a" r={0.55} m={0.65} rad={0.008} rot={[0, -0.3, 0]} />
        {s.panFood > 0.02 && [0, 1, 2, 3].map((i) => <Box key={i} p={[-0.05 + 0.035 * i, 0.048, -0.02 + 0.03 * Math.sin(i * 2)]} s={[0.07, 0.008, 0.035]} c={new THREE.Color("#f1c9bf").lerp(new THREE.Color("#c7843f"), 0.6 * s.panFood).getStyle()} r={0.45} rad={0.003} rot={[0, 0.5 * i, 0]} />)}
        <Vapor p={[0, 0.06, 0]} t={t} k={sz} col="#f4f1ea" s={0.8} />
      </group>
      {/* la pava de aluminio */}
      <group position={PT.kettle}>
        <Cyl p={[0, 0.08, 0]} r={0.1} r2={0.12} h={0.16} c="#c4c8cc" rough={0.25} m={0.9} />
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.06, 0.008, 8, 24, Math.PI]} /><meshStandardMaterial color="#2a2a2a" roughness={0.5} /></mesh>
        <Cyl p={[0.12, 0.12, 0]} r={0.012} r2={0.02} h={0.12} c="#c4c8cc" rough={0.25} m={0.9} rot={[0, 0, -0.9]} />
        <Vapor p={[0.17, 0.17, 0]} t={t} k={s.kettle} s={0.6} />
      </group>

      {/* ===== la mesada de la derecha: la tabla, el frasco y la panera ===== */}
      <group position={PT.board}>
        <Box p={[0, -0.005, 0]} s={[0.46, 0.025, 0.28]} c="#ffffff" map={tt.hinoki} r={0.6} rad={0.01} />
        <group position={[0, 0.008, 0]} scale={[1, 1, 1]}><OnBoard item={s.item} t={t} slices={s.slices} tt={tt} /></group>
        <Halo p={[0, 0.012, 0]} r={0.32} k={s.spotK * (s.itemK > 0.01 ? 1 : 0)} />
      </group>
      {/* el cuchillo apoyado al costado de la tabla */}
      <group position={[1.32, 0.935, -2.42]} rotation={[0, 0.25, 0]}>
        <Box p={[0, 0, 0]} s={[0.2, 0.004, 0.035]} c="#d9dde1" r={0.18} m={0.95} rad={0.002} />
        <Box p={[0.15, 0.006, 0]} s={[0.11, 0.018, 0.022]} c="#5b3b22" r={0.6} rad={0.006} />
      </group>
      {/* frasco de vidrio con agua (y jengibre adentro cuando toca) */}
      <group position={PT.jar}>
        <Cyl p={[0, 0.08, 0]} r={0.055} h={0.16} c="#dff0f5" rough={0.05} op={0.35} />
        <Cyl p={[0, 0.065, 0]} r={0.05} h={0.13 * (0.3 + 0.7 * Math.max(s.jar, 0.2))} c="#bfe0ee" rough={0.05} op={0.45} />
        <Cyl p={[0, 0.17, 0]} r={0.057} h={0.02} c="#c9a24a" m={0.7} rough={0.35} />
        {s.jar > 0.05 && [0, 1].map((i) => <mesh key={i} position={[-0.015 + 0.03 * i, 0.06, 0]} rotation={[0.3, i, 1.2]}><capsuleGeometry args={[0.014, 0.05, 4, 8]} /><meshStandardMaterial color="#e8c46c" roughness={0.6} /></mesh>)}
      </group>
      {/* la panera de madera (la tapa se abre) con el pan adentro */}
      <group position={PT.bread}>
        <Box p={[0, 0.1, 0]} s={[0.42, 0.2, 0.26]} c="#9b6a3b" map={tt.wood} r={0.5} rad={0.012} />
        <Box p={[0, 0.17, 0.0]} s={[0.36, 0.13, 0.2]} c="#c88a45" r={0.7} rad={0.04} />
        <group position={[0, 0.2, -0.13]} rotation={[lidA, 0, 0]}><Box p={[0, 0.0, 0.13]} s={[0.43, 0.02, 0.27]} c="#9b6a3b" map={tt.wood} r={0.5} rad={0.008} e="#ffb347" ei={0.15 * s.breadBox} /></group>
      </group>
      {/* el estante con los frascos (miso, arroz, té, umeboshi) */}
      <Box p={[1.3, 1.62, ZW + 0.13]} s={[1.6, 0.03, 0.24]} c="#ffffff" map={tt.wood} r={0.45} rad={0.006} />
      {[[0.65, "#d9b77a", 0.12], [0.88, "#efe9da", 0.15], [1.1, "#7c9a5a", 0.11], [1.33, "#b33a3a", 0.1], [1.57, "#e6d6b4", 0.14], [1.82, "#4f3b2a", 0.12]].map(([x, c, h], i) =>
        <group key={"fr" + i} position={[x as number, 1.635, ZW + 0.13]}>
          <Cyl p={[0, (h as number) / 2, 0]} r={0.045} h={h as number} c={c as string} rough={0.3} />
          <Cyl p={[0, (h as number) + 0.01, 0]} r={0.047} h={0.02} c="#2f2f2f" rough={0.4} m={0.5} />
        </group>)}

      {/* ===== la heladera (freezer arriba, la puerta se abre) ===== */}
      <group position={[2.75, 0, -2.5]}>
        <Box p={[0, 0.62, 0]} s={[0.78, 1.24, 0.7]} c="#e8e7e2" r={0.25} rad={0.03} />
        {/* el freezer es una caja ABIERTA adelante (5 paredes): con la puerta abierta se ve adentro */}
        <Box p={[0, 1.79, -0.02]} s={[0.78, 0.04, 0.66]} c="#ecebe7" r={0.25} rad={0.012} />
        <Box p={[0, 1.27, -0.02]} s={[0.78, 0.04, 0.66]} c="#ecebe7" r={0.25} rad={0.012} />
        {[-1, 1].map((k) => <Box key={k} p={[k * 0.37, 1.53, -0.02]} s={[0.04, 0.56, 0.66]} c="#ecebe7" r={0.25} rad={0.012} />)}
        <Box p={[0, 1.53, -0.33]} s={[0.78, 0.56, 0.04]} c="#ecebe7" r={0.25} rad={0.012} />
        <Box p={[-0.33, 0.85, 0.355]} s={[0.025, 0.4, 0.03]} c="#c9ccd0" r={0.2} m={0.9} rad={0.008} />
        {/* adentro del freezer: escarcha, estantes de alambre y los paquetes planos apilados como libros */}
        <Box p={[0, 1.53, -0.3]} s={[0.68, 0.48, 0.02]} c="#dceaf3" r={0.6} rad={0.004} e="#cfe9ff" ei={0.05 + 0.1 * s.freezer} />
        <Box p={[0, 1.47, 0.0]} s={[0.64, 0.01, 0.52]} c="#d0d6dc" r={0.3} m={0.8} rad={0.003} />
        {[0, 1, 2, 3].map((i) => <Box key={"pq" + i} p={[-0.2, 1.49 + i * 0.03, 0.05]} s={[0.17, 0.022, 0.17]} c="#f7f5ee" r={0.2} rad={0.008} op={0.9} />)}
        {[0, 1, 2].map((i) => <Box key={"pc" + i} p={[0.05, 1.49 + i * 0.025, 0.05]} s={[0.2, 0.018, 0.16]} c="#b8645a" r={0.3} rad={0.008} />)}
        <Box p={[0.22, 1.54, 0.05]} s={[0.12, 0.12, 0.16]} c="#d9b98a" r={0.6} rad={0.01} />
        {s.frost > 0.02 && <Box p={[0, 1.53, -0.32]} s={[0.64, 0.42, 0.01]} c="#ffffff" r={0.9} rad={0.003} op={0.5 * s.frost} />}
        {/* la puerta del freezer, con bisagra a la derecha */}
        <group position={[0.39, 1.53, 0.31]} rotation={[0, doorA, 0]}>
          <Box p={[-0.39, 0, 0.02]} s={[0.78, 0.55, 0.05]} c="#e8e7e2" r={0.25} rad={0.02} />
          <Box p={[-0.72, -0.02, 0.06]} s={[0.025, 0.22, 0.03]} c="#c9ccd0" r={0.2} m={0.9} rad={0.008} />
        </group>
        {/* luz fría que sale del freezer abierto (rampa, siempre montada) */}
        <pointLight position={[0, 1.53, 0.35]} intensity={0.02 + 0.45 * s.freezer} distance={1.4} color="#cfe9ff" />
        {/* imanes y una lista en la puerta de abajo */}
        <mesh position={[0.05, 0.95, 0.356]}><planeGeometry args={[0.18, 0.24]} /><meshStandardMaterial color="#fbf8f0" roughness={0.9} /></mesh>
        {[[-0.0, 1.05, "#d62828"], [0.18, 0.7, "#2a9d8f"]].map(([x, y, c], i) => <Cyl key={i} p={[x as number, y as number, 0.36]} r={0.018} h={0.012} c={c as string} rot={[Math.PI / 2, 0, 0]} />)}
      </group>

      {/* ===== la mesita de madera con dos sillas, adelante a la izquierda ===== */}
      <group position={[-1.6, 0, 0.5]}>
        <Box p={[0, 0.72, 0]} s={[0.95, 0.04, 0.72]} c="#ffffff" map={tt.wood} r={0.4} rad={0.012} e="#ffb347" ei={0.08 * s.table} />
        {[[-0.42, -0.31], [0.42, -0.31], [-0.42, 0.31], [0.42, 0.31]].map(([x, z], i) => <Box key={i} p={[x, 0.35, z]} s={[0.05, 0.7, 0.05]} c="#8a5d35" r={0.5} rad={0.008} />)}
        {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.72, 0, 0]} rotation={[0, sd * Math.PI / 2, 0]}>
          <Box p={[0, 0.45, 0]} s={[0.42, 0.04, 0.42]} c="#9b6a3b" r={0.5} rad={0.01} />
          <Box p={[0, 0.72, 0.19]} s={[0.4, 0.5, 0.03]} c="#9b6a3b" r={0.5} rad={0.01} />
          {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([x, z], j) => <Box key={j} p={[x, 0.22, z]} s={[0.035, 0.45, 0.035]} c="#8a5d35" r={0.5} rad={0.006} />)}
        </group>)}
        {/* la tetera azul y blanca, dos tazas y un bol de arroz */}
        <group position={[-0.2, 0.74, -0.08]}>
          <mesh position={[0, 0.08, 0]} scale={[1, 0.85, 1]}><sphereGeometry args={[0.09, 24, 16]} /><meshStandardMaterial color="#f4f6fb" roughness={0.25} /></mesh>
          <mesh position={[0, 0.08, 0]} scale={[1.005, 0.86, 1.005]}><sphereGeometry args={[0.09, 24, 16, 0, Math.PI * 2, 1.2, 0.5]} /><meshStandardMaterial color="#2c4a8a" roughness={0.3} /></mesh>
          <Cyl p={[0.11, 0.1, 0]} r={0.01} r2={0.016} h={0.08} c="#f4f6fb" rot={[0, 0, -0.9]} rough={0.25} />
        </group>
        {[[0.15, -0.15], [0.3, 0.12]].map(([x, z], i) => <Cyl key={i} p={[x, 0.78, z]} r={0.035} r2={0.03} h={0.07} c="#e8e3d6" rough={0.3} />)}
        <group position={[0.05, 0.74, 0.18]} visible={s.plates > 0.02}>
          <Cyl p={[0, 0.035, 0]} r={0.08} r2={0.05} h={0.07} c="#2c4a8a" rough={0.3} />
          <mesh position={[0, 0.07, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.07, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#fbfaf5" roughness={0.6} /></mesh>
        </group>
      </group>
    </ThreeCanvas>
  );
};
