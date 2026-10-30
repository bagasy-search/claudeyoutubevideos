// lin29 · EL MUNDO: el living de Linda (azafata jubilada). Mesa ratona de madera con los objetos del tema de cada video
// (hotel, crucero, aeropuerto, auto, reservas), la maqueta del avión en el estante, fotos de aviones en la pared, la valija
// de cabina vieja con su etiqueta, la ventana con cortinas y la lámpara de pie. Cada punto del video vuelve acá con un objeto
// nuevo sobre la mesa. Cámara y objetos salen de world.json (paradas y efectos anclados a frases). Render SÓLO en el farm.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Post } from "../kits/yanqui3d/fx3d";
import { M, RBox, rn, tex } from "./h3d";
import WJ from "./world.json";

export const FPS = 30, W = 1920, H = 1080;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
const PI = Math.PI;

// ---------------- cámaras con nombre ----------------
type C = { p: number[]; l: number[]; fov: number };
export const CAMS: Record<string, C> = {
  wide: { p: [0.05, 1.0, 1.75], l: [0, 0.55, -0.3], fov: 40 },
  wide2: { p: [-0.75, 1.15, 1.45], l: [0.05, 0.55, -0.35], fov: 38 },
  table: { p: [0.2, 0.92, 0.82], l: [0.0, 0.43, -0.02], fov: 38 },
  props: { p: [0.08, 0.66, 0.5], l: [0.06, 0.44, 0.0], fov: 36 },
  propsL: { p: [-0.32, 0.64, 0.42], l: [-0.12, 0.44, 0.0], fov: 36 },
  propsR: { p: [0.42, 0.64, 0.42], l: [0.2, 0.44, 0.0], fov: 36 },
  model: { p: [0.18, 1.18, -0.35], l: [-0.05, 1.12, -1.0], fov: 34 },
  wall: { p: [0.35, 1.05, 0.25], l: [0.25, 1.05, -1.1], fov: 40 },
  suitcase: { p: [0.42, 0.62, 0.62], l: [0.88, 0.38, -0.05], fov: 38 },
  window: { p: [-0.35, 0.95, 0.65], l: [-1.25, 0.95, -0.45], fov: 40 },
  low: { p: [-0.42, 0.5, 0.78], l: [0.1, 0.45, -0.05], fov: 40 },
};
type Stop = [number, string];
type FXK = [number, Record<string, number>];
const ST = (WJ as unknown as { cams: Stop[] }).cams ?? [[0, "wide"]];
const FK = (WJ as unknown as { fx: FXK[] }).fx ?? [];

// la cámara viaja entre paradas con arco (nunca zoom recto) y respira lento
export const camAt = (t: number) => {
  let i = 0; while (i < ST.length - 1 && ST[i + 1][0] <= t) i++;
  const cur = CAMS[ST[i][1]] ?? CAMS.wide, prev = i > 0 ? CAMS[ST[i - 1][1]] ?? CAMS.wide : cur;
  const D = Math.min(2.8, Math.max(1.3, (ST[i + 1]?.[0] ?? t + 9) - ST[i][0]) * 0.45);
  const k = i > 0 ? ease((t - ST[i][0]) / D) : 1;
  const p = v3(prev.p).lerp(v3(cur.p), k), l = v3(prev.l).lerp(v3(cur.l), k);
  const arc = Math.sin(PI * k) * Math.min(0.14, p.distanceTo(v3(prev.p)) * 0.25);
  p.y += arc; p.x += arc * 0.6 * (i % 2 ? 1 : -1);
  // deriva lenta dentro de la parada: la cámara nunca se queda quieta
  const dr = t - ST[i][0];
  p.x += 0.012 * Math.sin(t * 0.21) + 0.004 * dr * (i % 2 ? 1 : -1) * Math.min(1, 8 / (dr + 8));
  p.y += 0.006 * Math.sin(t * 0.17 + 1);
  return { p, l, fov: prev.fov + (cur.fov - prev.fov) * k };
};
export const camSpeed = (t: number) => {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const dp = a.p.distanceTo(b.p) * 90 + a.l.distanceTo(b.l) * 40;
  return { bx: Math.min(12, dp * 0.5), by: Math.min(8, dp * 0.25) };
};
export const fxAt = (t: number): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const [a, kv] of FK) { if (a > t) break; for (const [k, v] of Object.entries(kv)) { const from = out[k] ?? 0; out[k] = from + (v - from) * ease((t - a) / 1.0); } }
  return out;
};
const Cam: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera; const k = camAt(t);
  c.position.copy(k.p); c.up.set(0, 1, 0); c.lookAt(k.l); c.fov = k.fov; c.near = 0.01; c.far = 60; c.updateProjectionMatrix(); return null;
};

// ---------------- texturas pintadas ----------------
const planePhoto = (i: number) => tex.text("photo" + i, 256, 192, (g) => {
  const sky = g.createLinearGradient(0, 0, 0, 192); sky.addColorStop(0, ["#6f9fd0", "#e9a46a", "#8fb8de"][i]); sky.addColorStop(1, ["#cfe3f4", "#f6d7a8", "#e6eef6"][i]); g.fillStyle = sky; g.fillRect(0, 0, 256, 192);
  for (let k = 0; k < 6; k++) { g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(30 + rn(k, i) * 200, 120 + rn(k, i + 3) * 60, 40, 10, 0, 0, 7); g.fill(); }
  g.save(); g.translate(128, 80); g.rotate([-0.12, 0.05, -0.2][i]); g.fillStyle = "#f7f7f5";
  g.beginPath(); g.ellipse(0, 0, 70, 9, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(-8, 0); g.lineTo(-30, 46); g.lineTo(-16, 46); g.lineTo(14, 2); g.fill();
  g.beginPath(); g.moveTo(-8, 0); g.lineTo(-24, -40); g.lineTo(-12, -40); g.lineTo(12, -2); g.fill();
  g.fillStyle = "#1d2f5a"; g.beginPath(); g.moveTo(-56, -2); g.lineTo(-72, -30); g.lineTo(-62, -30); g.lineTo(-44, -4); g.fill(); g.restore();
  if (i === 2) { g.fillStyle = "rgba(30,30,30,.15)"; g.fillRect(0, 150, 256, 42); }
});
export const labelTex = (key: string, lines: string[], bg = "#f4efe3", fg = "#2a2a2e", w = 256, h = 128, big = 46) => tex.text("lab" + key, w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  lines.forEach((l, i) => { g.font = `${i === 0 ? 900 : 700} ${i === 0 ? big : big * 0.5}px Arial`; g.fillText(l, w / 2, h / (lines.length + 1) * (i + 1)); });
});
const linesTex = (key: string, n = 9, hl = -1) => tex.text("lines" + key, 256, 340, (g) => {
  g.fillStyle = "#f6f2e8"; g.fillRect(0, 0, 256, 340);
  g.fillStyle = "#2b2b30"; g.fillRect(22, 22, 120, 14);
  for (let i = 0; i < n; i++) { const y = 70 + i * 28; g.fillStyle = i === hl ? "rgba(255,90,74,.25)" : "transparent"; g.fillRect(14, y - 9, 228, 22); g.fillStyle = "rgba(40,40,46,.55)"; g.fillRect(22, y, 120 + 50 * rn(i, 7), 6); g.fillRect(196, y, 36, 6); }
  g.fillStyle = "#2b2b30"; g.fillRect(150, 70 + n * 28 + 8, 82, 10);
});
const screenTex = (price: string) => tex.text("scr" + price, 512, 320, (g) => {
  g.fillStyle = "#f3f6fb"; g.fillRect(0, 0, 512, 320); g.fillStyle = "#1e3c72"; g.fillRect(0, 0, 512, 40);
  g.fillStyle = "#c7d3e6"; g.fillRect(24, 64, 200, 120); g.fillStyle = "#8aa5c8"; g.fillRect(24, 140, 200, 44);
  for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(40,50,70,.4)"; g.fillRect(250, 70 + i * 26, 200 - 30 * (i % 2), 10); }
  g.fillStyle = "#e0453a"; g.font = "900 64px Arial"; g.fillText(price, 250, 250);
  g.fillStyle = "#2a8a4a"; g.fillRect(250, 270, 190, 34);
});

// ---------------- objetos de la mesa (cada uno nace con caída y rebote, siempre montado) ----------------
const pop = (k: number) => { const x = cl(k); return x <= 0 ? 0 : 1 - Math.exp(-6 * x) * Math.cos(9 * x); };
type PP = { k: number; p: number[]; r?: number; children: React.ReactNode };
const Prop: React.FC<PP> = ({ k, p, r = 0, children }) => {
  const s = pop(k);
  return <group visible={k > 0.01} position={[p[0], p[1] + 0.12 * (1 - Math.min(1, s)), p[2]]} rotation={[0, r + 0.25 * (1 - Math.min(1, s)), 0]} scale={Math.max(0.001, Math.min(1.06, s))}>{children}</group>;
};

const KeyCard: React.FC = () => <>
  <RBox s={[0.086, 0.002, 0.054]} r={0.0008}>{M.plastic({ col: "#f2f2f0" })}</RBox>
  <mesh position={[0, 0.0012, -0.012]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.086, 0.012]} />{M.matte({ col: "#1d2f5a" })}</mesh>
  <mesh position={[0.02, 0.0012, 0.012]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.03, 0.012]} />{M.brass()}</mesh>
</>;
const Bottle: React.FC<{ price: string }> = ({ price }) => <>
  <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.028, 0.03, 0.14, 32]} />{M.glass({ op: 0.35 })}</mesh>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.025, 0.027, 0.11, 32]} />{M.water({ op: 0.45 })}</mesh>
  <mesh position={[0, 0.155, 0]}><cylinderGeometry args={[0.012, 0.024, 0.03, 24]} />{M.glass({ op: 0.35 })}</mesh>
  <mesh position={[0, 0.177, 0]}><cylinderGeometry args={[0.013, 0.013, 0.016, 24]} />{M.plastic({ col: "#2c5fa8" })}</mesh>
  {/* el collar de papel con el precio */}
  <mesh position={[0.0, 0.13, 0.027]} rotation={[0, 0, 0.05]}><planeGeometry args={[0.06, 0.04]} /><meshStandardMaterial map={labelTex("collar" + price, [price, "per bottle"], "#fffaf0", "#c0392b")} roughness={0.9} side={THREE.DoubleSide} /></mesh>
</>;
const Folio: React.FC<{ hl?: number }> = ({ hl = -1 }) => <mesh rotation={[-PI / 2, 0, 0]} receiveShadow castShadow><planeGeometry args={[0.15, 0.2]} /><meshStandardMaterial map={linesTex("f" + hl, 9, hl)} roughness={0.95} side={THREE.DoubleSide} /></mesh>;
const Tape: React.FC = () => <group rotation={[PI / 2, 0, 0]}>
  <mesh castShadow><torusGeometry args={[0.03, 0.012, 16, 40]} /><meshStandardMaterial color="#4f8fd8" roughness={0.75} /></mesh>
  <mesh><cylinderGeometry args={[0.02, 0.02, 0.024, 32, 1, true]} /><meshStandardMaterial color="#c9a477" roughness={0.9} side={THREE.DoubleSide} /></mesh>
</group>;
const Mug: React.FC<{ col?: string }> = ({ col = "#e8e1d4" }) => <>
  <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.035, 0.032, 0.09, 32]} />{M.porcelain({ col })}</mesh>
  <mesh position={[0, 0.086, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.031, 32]} /><meshStandardMaterial color="#4a2c18" roughness={0.2} /></mesh>
  <mesh position={[0.04, 0.048, 0]}><torusGeometry args={[0.02, 0.006, 12, 24, PI]} />{M.porcelain({ col })}</mesh>
</>;
const Glasses: React.FC = () => <>
  {[-0.025, 0.025].map((x, i) => <mesh key={i} position={[x, 0.008, 0]} rotation={[-PI / 2 + 0.25, 0, 0]}><torusGeometry args={[0.019, 0.0022, 8, 30]} />{M.matte({ col: "#3a2a1e" })}</mesh>)}
  <mesh position={[0, 0.012, 0]}><boxGeometry args={[0.012, 0.002, 0.002]} />{M.matte({ col: "#3a2a1e" })}</mesh>
  {[-0.045, 0.045].map((x, i) => <mesh key={"a" + i} position={[x, 0.006, -0.035]} rotation={[0, 0, 0]}><boxGeometry args={[0.002, 0.002, 0.07]} />{M.matte({ col: "#3a2a1e" })}</mesh>)}
</>;
const Envelope: React.FC = () => <>
  <RBox s={[0.16, 0.003, 0.1]} r={0.001}>{M.matte({ col: "#f3efe6" })}</RBox>
  <mesh position={[0, 0.002, -0.015]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012, 24]} />{M.matte({ col: "#1d2f5a" })}</mesh>
</>;
const Ship: React.FC = () => <group scale={0.9}>
  <RBox s={[0.26, 0.04, 0.06]} r={0.012} p={[0, 0.03, 0]}>{M.matte({ col: "#1b2433" })}</RBox>
  <RBox s={[0.25, 0.012, 0.058]} r={0.005} p={[0, 0.056, 0]}>{M.matte({ col: "#b23a2a" })}</RBox>
  {[0, 1, 2].map((i) => <RBox key={i} s={[0.2 - i * 0.04, 0.026, 0.05 - i * 0.004]} r={0.004} p={[-0.01 - i * 0.008, 0.075 + i * 0.026, 0]}>{M.porcelain()}</RBox>)}
  <mesh position={[-0.04, 0.17, 0]}><cylinderGeometry args={[0.012, 0.014, 0.04, 20]} />{M.matte({ col: "#c0392b" })}</mesh>
  {Array.from({ length: 8 }, (_, i) => <mesh key={"w" + i} position={[-0.08 + i * 0.022, 0.08, 0.0255]}><planeGeometry args={[0.01, 0.006]} /><meshBasicMaterial color="#ffd89a" toneMapped={false} /></mesh>)}
</group>;
const Pass: React.FC = () => <>
  <RBox s={[0.2, 0.002, 0.08]} r={0.0008}>{M.matte({ col: "#fbfaf6" })}</RBox>
  <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.08]} /><meshStandardMaterial map={labelTex("pass", ["BOARDING PASS", "SEAT 14C  ·  GATE B22"], "#fbfaf6", "#1d2f5a", 512, 200, 50)} roughness={0.9} /></mesh>
</>;
const LugScale: React.FC = () => <>
  <RBox s={[0.05, 0.024, 0.11]} r={0.008} p={[0, 0.012, 0]}>{M.plastic({ col: "#e8e4dc" })}</RBox>
  <mesh position={[0, 0.0245, -0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.032, 0.022]} /><meshBasicMaterial map={labelTex("lcd", ["49.6 lb"], "#9fb59a", "#1a2a18", 256, 160, 64)} toneMapped={false} /></mesh>
  <mesh position={[0, 0.012, 0.075]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.004, 10, 24]} />{M.steel()}</mesh>
</>;
const CarKey: React.FC = () => <>
  <RBox s={[0.034, 0.012, 0.058]} r={0.006} p={[0, 0.006, 0]}>{M.plastic({ col: "#1d1d20" })}</RBox>
  {[-0.01, 0.0, 0.01].map((z, i) => <mesh key={i} position={[0, 0.0125, z]}><cylinderGeometry args={[0.005, 0.005, 0.002, 16]} />{M.matte({ col: "#4a4a50" })}</mesh>)}
  <mesh position={[0, 0.006, -0.06]}><boxGeometry args={[0.008, 0.003, 0.05]} />{M.steel()}</mesh>
  <mesh position={[0.0, 0.006, 0.045]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.014, 0.002, 8, 24]} />{M.chrome()}</mesh>
  <RBox s={[0.04, 0.002, 0.024]} r={0.001} p={[0.01, 0.002, 0.075]}>{M.plastic({ col: "#f2c230" })}</RBox>
</>;
const ToyCar: React.FC = () => <group scale={0.85}>
  <RBox s={[0.16, 0.035, 0.07]} r={0.012} p={[0, 0.03, 0]}>{M.plastic({ col: "#b8bcc2" })}</RBox>
  <RBox s={[0.09, 0.03, 0.062]} r={0.012} p={[-0.01, 0.06, 0]}>{M.glass({ op: 0.55, col: "#9cc4e0" })}</RBox>
  {[[-0.05, 0.034], [0.05, 0.034], [-0.05, -0.034], [0.05, -0.034]].map(([x, z], i) => <mesh key={i} position={[x, 0.016, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.012, 24]} />{M.rubber({ col: "#1b1b1d" })}</mesh>)}
</group>;
const Laptop: React.FC<{ price: string; open: number }> = ({ price, open }) => <>
  <RBox s={[0.3, 0.012, 0.2]} r={0.006} p={[0, 0.006, 0]}>{M.steel({ col: "#b9bec4" })}</RBox>
  <mesh position={[0, 0.0125, 0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.11]} />{M.matte({ col: "#2a2c30" })}</mesh>
  <group position={[0, 0.012, -0.1]} rotation={[-PI / 2 + (PI / 2 + 0.22) * open, 0, 0]}>
    <RBox s={[0.3, 0.008, 0.2]} r={0.006} p={[0, -0.004, -0.1]}>{M.steel({ col: "#b9bec4" })}</RBox>
    <mesh position={[0, 0.0005, -0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.27, 0.17]} /><meshBasicMaterial map={screenTex(price)} toneMapped={false} /></mesh>
  </group>
</>;
const Notepad: React.FC = () => <>
  <RBox s={[0.12, 0.008, 0.16]} r={0.002} p={[0, 0.004, 0]}>{M.matte({ col: "#f2e7a8" })}</RBox>
  <mesh position={[0, 0.0085, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.11, 0.15]} /><meshStandardMaterial map={labelTex("pad", ["$203", "$149 + fees", "$179"], "#f2e7a8", "#2a3a6a", 256, 340, 64)} roughness={0.95} /></mesh>
  <mesh position={[0.08, 0.012, 0.0]} rotation={[0, 0.4, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.13, 8]} />{M.plastic({ col: "#c0392b" })}</mesh>
</>;

// ---------------- el avión a escala en su pie: se inclina despacio como si volara ----------------
const ModelPlane: React.FC<{ t: number }> = ({ t }) => {
  const bank = 0.08 * Math.sin(t * 0.35), pitch = 0.03 * Math.sin(t * 0.27 + 1);
  return <group position={[-0.05, 1.08, -0.98]}>
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.004, 0.004, 0.1, 10]} />{M.chrome()}</mesh>
    <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.04, 0.045, 0.012, 32]} />{M.wood({ base: [80, 50, 30] })}</mesh>
    <group rotation={[pitch, 0.5, bank]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.022, 0.32, 8, 24]} />{M.porcelain()}</mesh>
      <mesh position={[0.0, -0.004, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0222, 0.0222, 0.26, 24, 1, true, PI * 0.95, PI * 0.1]} />{M.matte({ col: "#1d2f5a", side: THREE.DoubleSide })}</mesh>
      {[1, -1].map((s) => <mesh key={s} position={[0.0, -0.006, s * 0.11]} rotation={[0, s * 0.45, 0]}><boxGeometry args={[0.07, 0.004, 0.2]} />{M.porcelain()}</mesh>)}
      {[1, -1].map((s) => <mesh key={"e" + s} position={[0.03, -0.022, s * 0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.05, 20]} />{M.steel()}</mesh>)}
      <mesh position={[-0.165, 0.045, 0]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.07, 0.07, 0.004]} />{M.matte({ col: "#1d2f5a" })}</mesh>
      {[1, -1].map((s) => <mesh key={"h" + s} position={[-0.17, 0.0, s * 0.045]} rotation={[0, s * 0.4, 0]}><boxGeometry args={[0.04, 0.003, 0.08]} />{M.porcelain()}</mesh>)}
    </group>
  </group>;
};

export const SinkWorld: React.FC<{ t: number; fx?: Record<string, number>; post?: boolean }> = ({ t, fx: fxIn, post = true }) => {
  const fx = fxIn ?? fxAt(t), f = (k: string) => cl(fx[k] ?? 0);
  const eve = f("eve"), price = (WJ as unknown as { price?: string }).price ?? "$9";
  const TY = 0.42; // tapa de la mesa
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      {post && <Post bloom={0.12} threshold={1.0} exposure={0.95} env={0.45} />}
      <color attach="background" args={["#141210"]} />
      <fog attach="fog" args={["#141210", 4, 12]} />
      <hemisphereLight args={["#f1ece4", "#3a2c22", 0.45 - 0.15 * eve]} />
      {/* luz de la ventana (fría de día, se apaga de noche) y la lámpara de pie (cálida, siempre prendida, más fuerte de noche) */}
      <spotLight position={[-1.3, 1.5, 0.3]} angle={0.7} penumbra={0.9} intensity={22 * (1 - 0.7 * eve)} distance={6} castShadow color="#eaf2ff" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[-0.85, 1.32, -0.55]} intensity={2.2 + 2.6 * eve} distance={3.2} color="#ffcf8a" castShadow />
      <spotLight position={[0.9, 1.6, 1.4]} angle={0.5} penumbra={0.9} intensity={6} distance={5} color="#ffe6c8" />

      {/* piso de madera y alfombra */}
      <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 6]} /><meshStandardMaterial map={tex.wood(8, 4, [122, 80, 46])} roughness={0.6} /></mesh>
      <mesh position={[0, 0.003, 0.05]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.9, 1.3]} /><meshStandardMaterial color="#8a5a48" roughness={0.95} /></mesh>
      <mesh position={[0, 0.004, 0.05]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.55, 0.58, 64]} /><meshStandardMaterial color="#d8c39a" roughness={0.95} /></mesh>
      {/* pared con empapelado suave y zócalo */}
      <mesh position={[0, 1.4, -1.12]} receiveShadow><planeGeometry args={[5, 2.8]} /><meshStandardMaterial color="#cdbfa6" roughness={0.9} /></mesh>
      <mesh position={[0, 0.06, -1.11]}><boxGeometry args={[5, 0.12, 0.02]} />{M.matte({ col: "#efe8da" })}</mesh>
      {/* las fotos de aviones de su carrera */}
      {[[-0.38, 1.38], [0.22, 1.42], [0.62, 1.22]].map(([x, y], i) => <group key={i} position={[x, y, -1.1]}>
        <RBox s={[0.34, 0.26, 0.02]} r={0.004}>{M.wood({ base: [60, 40, 26] })}</RBox>
        <mesh position={[0, 0, 0.011]}><planeGeometry args={[0.29, 0.21]} /><meshStandardMaterial map={planePhoto(i)} roughness={0.5} /></mesh>
        <mesh position={[0, 0, 0.012]}><planeGeometry args={[0.29, 0.21]} />{M.glass({ op: 0.08 })}</mesh>
      </group>)}
      {/* estante con la maqueta */}
      <RBox s={[0.7, 0.025, 0.2]} r={0.004} p={[-0.05, 0.965, -1.0]}>{M.wood({ base: [96, 62, 38] })}</RBox>
      <ModelPlane t={t} />
      {/* sillón detrás de la mesa */}
      <RBox s={[1.5, 0.42, 0.7]} r={0.08} p={[0, 0.25, -0.75]}>{M.matte({ col: "#4c5a6e" })}</RBox>
      <RBox s={[1.5, 0.5, 0.18]} r={0.08} p={[0, 0.6, -1.0]}>{M.matte({ col: "#4c5a6e" })}</RBox>
      {[-0.4, 0.38].map((x, i) => <RBox key={i} s={[0.38, 0.3, 0.12]} r={0.06} p={[x, 0.6, -0.86]} rot={[-0.2, 0, (i ? -1 : 1) * 0.08]}>{M.matte({ col: i ? "#d9b26a" : "#c46a52" })}</RBox>)}
      {/* ventana con cortinas a la izquierda */}
      <mesh position={[-1.6, 1.15, -0.4]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.9, 1.1]} /><meshBasicMaterial color={new THREE.Color("#dfe9f5").lerp(new THREE.Color("#22324a"), eve)} toneMapped={false} /></mesh>
      {[-0.42, 0.42].map((z, i) => <mesh key={i} position={[-1.58, 1.15, -0.4 + z]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.3, 1.3]} /><meshStandardMaterial color="#efe6d2" roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh>)}
      {/* lámpara de pie */}
      <group position={[-0.85, 0, -0.55]}>
        <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.008, 0.008, 1.3, 10]} />{M.brass()}</mesh>
        <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.12, 0.13, 0.02, 32]} />{M.brass()}</mesh>
        <mesh position={[0, 1.36, 0]}><cylinderGeometry args={[0.12, 0.17, 0.2, 32, 1, true]} /><meshStandardMaterial color="#f3e6c8" emissive="#ffcf8a" emissiveIntensity={0.25 + 0.5 * eve} side={THREE.DoubleSide} roughness={0.9} /></mesh>
      </group>
      {/* la valija de cabina vieja con su etiqueta de cuero */}
      <group position={[0.92, 0, -0.08]} rotation={[0, -0.5, 0]}>
        <RBox s={[0.36, 0.52, 0.22]} r={0.03} p={[0, 0.3, 0]}>{M.matte({ col: "#1f2c48" })}</RBox>
        <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.16, 0.08, 0.02]} />{M.steel()}</mesh>
        {[-0.13, 0.13].map((x, i) => <mesh key={i} position={[x, 0.035, 0.08]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.025, 20]} />{M.rubber({ col: "#151515" })}</mesh>)}
        <group position={[0.12, 0.5, 0.115]} rotation={[0, 0, 0.12 * Math.sin(t * 0.8)]}>
          <mesh position={[0, -0.07, 0]}><planeGeometry args={[0.07, 0.11]} /><meshStandardMaterial map={labelTex("tag", ["LINDA", "crew"], "#8a5a2c", "#f2e6cc", 128, 200, 30)} roughness={0.8} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>
      {/* la mesa ratona */}
      <RBox s={[1.0, 0.04, 0.56]} r={0.012} p={[0, TY - 0.02, 0]}>{M.wood({ base: [138, 90, 52], rx: 3, ry: 1 })}</RBox>
      {[[-0.45, -0.24], [0.45, -0.24], [-0.45, 0.24], [0.45, 0.24]].map(([x, z], i) => <mesh key={i} position={[x, TY / 2 - 0.02, z]} castShadow><cylinderGeometry args={[0.022, 0.016, TY - 0.04, 16]} />{M.wood({ base: [110, 70, 40] })}</mesh>)}
      {/* lo de siempre: taza de café y los lentes */}
      <Prop k={1 - f("noMug")} p={[0.36, TY, 0.12]}><Mug /></Prop>
      <Prop k={1 - f("noGl")} p={[-0.36, TY, 0.16]} r={0.4}><Glasses /></Prop>
      {/* los objetos del tema (world.json → fx) */}
      <Prop k={f("card")} p={[-0.1, TY + 0.001, 0.12]} r={0.3}><KeyCard /></Prop>
      <Prop k={f("bottle")} p={[0.08, TY, -0.06]}><Bottle price={price} /></Prop>
      <Prop k={f("folio")} p={[-0.18, TY + 0.001, -0.04]} r={-0.15}><Folio hl={Math.round(fx.hl ?? -1)} /></Prop>
      <Prop k={f("tape")} p={[0.22, TY + 0.012, -0.12]}><Tape /></Prop>
      <Prop k={f("env")} p={[-0.12, TY + 0.002, 0.08]} r={0.2}><Envelope /></Prop>
      <Prop k={f("ship")} p={[0.12, TY, -0.1]} r={-0.4}><Ship /></Prop>
      <Prop k={f("pass")} p={[-0.15, TY + 0.002, 0.04]} r={-0.12}><Pass /></Prop>
      <Prop k={f("scale")} p={[0.18, TY, 0.06]} r={0.6}><LugScale /></Prop>
      <Prop k={f("key")} p={[-0.05, TY, 0.1]} r={0.8}><CarKey /></Prop>
      <Prop k={f("car")} p={[0.16, TY, -0.08]} r={-0.6}><ToyCar /></Prop>
      <Prop k={f("contract")} p={[-0.2, TY + 0.001, -0.05]} r={0.12}><Folio hl={3} /></Prop>
      <Prop k={f("laptop")} p={[0.02, TY, -0.06]}><Laptop price={price} open={cl(f("laptop") * 1.2)} /></Prop>
      <Prop k={f("pad")} p={[-0.24, TY, 0.08]} r={0.25}><Notepad /></Prop>
    </ThreeCanvas>
  );
};
