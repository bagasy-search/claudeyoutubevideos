// tdp29 · EL MUNDO: el cuarto alquilado del presentador en Tokio, de noche. Tatami gastado, mesa baja (chabudai) con la
// notebook, el cuaderno de tapas duras y la lata de café de konbini; la mochila abierta contra la pared, la lámpara de
// escritorio, la ventana con las luces de los edificios y el resplandor azul de la tele del vecino en la pared (lento, <2 Hz).
// Cada punto del video vuelve acá con un objeto nuevo sobre la mesa (world.json → fx). Luces SIEMPRE montadas. Render SÓLO en el farm.
// (se llama linda3d.tsx para que parts.tsx no cambie; exporta lo mismo)
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
const TY = 0.33; // tapa de la mesa baja

// ---------------- cámaras con nombre (mismos nombres que el kit, otra geometría) ----------------
type C = { p: number[]; l: number[]; fov: number };
export const CAMS: Record<string, C> = {
  wide: { p: [0.1, 0.95, 1.6], l: [0, 0.4, -0.35], fov: 42 },
  wide2: { p: [-0.8, 1.05, 1.3], l: [0.1, 0.42, -0.4], fov: 40 },
  table: { p: [0.22, 0.8, 0.75], l: [0.0, 0.34, -0.02], fov: 38 },
  props: { p: [0.08, 0.56, 0.48], l: [0.06, 0.35, 0.0], fov: 36 },
  propsL: { p: [-0.32, 0.55, 0.42], l: [-0.12, 0.35, 0.0], fov: 36 },
  propsR: { p: [0.42, 0.55, 0.42], l: [0.2, 0.35, 0.0], fov: 36 },
  model: { p: [0.05, 0.95, 0.2], l: [0.2, 0.95, -1.1], fov: 40 },      // la ventana con la ciudad
  wall: { p: [-0.35, 0.85, 0.3], l: [-1.4, 0.95, -0.5], fov: 42 },     // la pared con la luz de la tele del vecino
  suitcase: { p: [0.4, 0.55, 0.55], l: [0.88, 0.28, -0.45], fov: 38 }, // la mochila abierta
  window: { p: [-0.1, 0.75, 0.45], l: [0.35, 1.0, -1.1], fov: 38 },
  low: { p: [-0.45, 0.4, 0.75], l: [0.1, 0.36, -0.05], fov: 40 },
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
export const labelTex = (key: string, lines: string[], bg = "#f4efe3", fg = "#2a2a2e", w = 256, h = 128, big = 46) => tex.text("lab" + key, w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  lines.forEach((l, i) => { g.font = `${i === 0 ? 900 : 700} ${i === 0 ? big : big * 0.5}px Arial`; g.fillText(l, w / 2, h / (lines.length + 1) * (i + 1)); });
});
// tatami: paja verde-beige con hilos finos y el borde de tela oscura
const tatamiTex = () => tex.text("tatami", 512, 1024, (g) => {
  g.fillStyle = "#b8ad7c"; g.fillRect(0, 0, 512, 1024);
  for (let y = 0; y < 1024; y += 3) { g.fillStyle = `rgba(${90 + rn(y, 1) * 40},${80 + rn(y, 2) * 30},40,${0.12 + rn(y, 3) * 0.12})`; g.fillRect(0, y, 512, 1); }
  for (let k = 0; k < 40; k++) { g.fillStyle = "rgba(70,55,30,.08)"; g.fillRect(rn(k, 5) * 512, rn(k, 6) * 1024, 30 + rn(k, 7) * 90, 18); }
  g.fillStyle = "#2a2b26"; g.fillRect(0, 0, 26, 1024); g.fillRect(486, 0, 26, 1024);
});
// la ciudad de noche por la ventana: siluetas de edificios con ventanas prendidas (fijas, algunas cálidas, otras frías)
const cityTex = () => tex.text("city", 1024, 768, (g) => {
  const sky = g.createLinearGradient(0, 0, 0, 768); sky.addColorStop(0, "#0b1224"); sky.addColorStop(1, "#2a2440"); g.fillStyle = sky; g.fillRect(0, 0, 1024, 768);
  for (let b = 0; b < 14; b++) {
    const x = b * 78 - 20 + rn(b, 1) * 30, w = 70 + rn(b, 2) * 60, top = 160 + rn(b, 3) * 380, far = b % 2;
    g.fillStyle = far ? "#141a2c" : "#0d1120"; g.fillRect(x, top, w, 768 - top);
    for (let yy = top + 14; yy < 760; yy += 22) for (let xx = x + 8; xx < x + w - 10; xx += 16) {
      const r = rn(xx * 3 + yy, b); if (r > 0.42) continue;
      g.fillStyle = r < 0.12 ? "#ffd89a" : r < 0.3 ? "#f3e6c0" : "#9fc4ff"; g.globalAlpha = far ? 0.55 : 0.9; g.fillRect(xx, yy, 8, 10); g.globalAlpha = 1;
    }
  }
  g.fillStyle = "#ff4a3a"; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(120 + k * 330, 170 + rn(k, 9) * 120, 4, 0, 7); g.fill(); }
});
const notebookTex = (txt: string[]) => tex.text("nb" + txt.join("|"), 256, 340, (g) => {
  g.fillStyle = "#f6f2e6"; g.fillRect(0, 0, 256, 340);
  for (let y = 40; y < 340; y += 24) { g.fillStyle = "rgba(90,120,170,.35)"; g.fillRect(10, y, 236, 1); }
  g.fillStyle = "#c0392b"; g.fillRect(34, 0, 1.5, 340);
  g.fillStyle = "#1f2a44"; g.textAlign = "left"; g.textBaseline = "alphabetic";
  txt.forEach((l, i) => { g.font = `${i === 0 ? 700 : 500} ${i === 0 ? 40 : 26}px Georgia`; g.fillText(l, 44, 70 + i * 48); });
});
const screenTex = () => tex.text("scrT", 512, 320, (g) => {
  g.fillStyle = "#e9eef5"; g.fillRect(0, 0, 512, 320); g.fillStyle = "#28303e"; g.fillRect(0, 0, 512, 30);
  g.fillStyle = "#b8c4d4"; g.fillRect(24, 54, 300, 170); g.fillStyle = "#7d8ea6"; g.fillRect(24, 180, 300, 44);
  for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(40,50,70,.35)"; g.fillRect(346, 60 + i * 26, 140 - 30 * (i % 2), 8); }
  g.fillStyle = "#c0392b"; g.beginPath(); g.moveTo(160, 120); g.lineTo(196, 140); g.lineTo(160, 160); g.fill();
});

// ---------------- objetos de la mesa (cada uno nace con caída y rebote, siempre montado) ----------------
const pop = (k: number) => { const x = cl(k); return x <= 0 ? 0 : 1 - Math.exp(-6 * x) * Math.cos(9 * x); };
type PP = { k: number; p: number[]; r?: number; children: React.ReactNode };
const Prop: React.FC<PP> = ({ k, p, r = 0, children }) => {
  const s = pop(k);
  return <group visible={k > 0.01} position={[p[0], p[1] + 0.12 * (1 - Math.min(1, s)), p[2]]} rotation={[0, r + 0.25 * (1 - Math.min(1, s)), 0]} scale={Math.max(0.001, Math.min(1.06, s))}>{children}</group>;
};

const CoffeeCan: React.FC = () => <>
  <mesh position={[0, 0.055, 0]} castShadow><cylinderGeometry args={[0.026, 0.026, 0.11, 32]} />{M.steel({ col: "#6b3a22" })}</mesh>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0262, 0.0262, 0.05, 32, 1, true]} /><meshStandardMaterial color="#efe3c8" roughness={0.6} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.111, 0]}><cylinderGeometry args={[0.022, 0.026, 0.006, 32]} />{M.chrome()}</mesh>
</>;
const Notebook: React.FC<{ lines: string[] }> = ({ lines }) => <>
  <RBox s={[0.16, 0.012, 0.21]} r={0.003} p={[0, 0.006, 0]}>{M.matte({ col: "#2c3a2e" })}</RBox>
  <mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.2]} /><meshStandardMaterial map={notebookTex(lines)} roughness={0.95} /></mesh>
  <mesh position={[0.1, 0.016, 0.02]} rotation={[0, 0.35, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.13, 8]} />{M.plastic({ col: "#1b1b1f" })}</mesh>
</>;
const Laptop: React.FC<{ open: number }> = ({ open }) => <>
  <RBox s={[0.3, 0.012, 0.2]} r={0.006} p={[0, 0.006, 0]}>{M.steel({ col: "#8d939a" })}</RBox>
  <mesh position={[0, 0.0125, 0.02]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.11]} />{M.matte({ col: "#2a2c30" })}</mesh>
  <group position={[0, 0.012, -0.1]} rotation={[-PI / 2 + (PI / 2 + 0.22) * open, 0, 0]}>
    <RBox s={[0.3, 0.008, 0.2]} r={0.006} p={[0, -0.004, -0.1]}>{M.steel({ col: "#8d939a" })}</RBox>
    <mesh position={[0, 0.0005, -0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.27, 0.17]} /><meshBasicMaterial map={screenTex()} toneMapped={false} /></mesh>
  </group>
</>;
// la bandeja de comida (arroz, sopa, plato tapado) — el tema del video a
const Tray: React.FC = () => <>
  <RBox s={[0.28, 0.014, 0.2]} r={0.01} p={[0, 0.007, 0]}>{M.plastic({ col: "#5a1a14" })}</RBox>
  <mesh position={[-0.07, 0.035, 0.03]} castShadow><sphereGeometry args={[0.04, 32, 16, 0, 2 * PI, PI / 2, PI / 2]} />{M.porcelain({ col: "#f2efe8" })}</mesh>
  <mesh position={[-0.07, 0.034, 0.03]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.036, 32]} /><meshStandardMaterial color="#fbfaf4" roughness={0.9} /></mesh>
  <mesh position={[0.06, 0.035, 0.03]} castShadow><sphereGeometry args={[0.038, 32, 16, 0, 2 * PI, PI / 2, PI / 2]} />{M.matte({ col: "#3a1a10" })}</mesh>
  <mesh position={[0.06, 0.032, 0.03]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.034, 32]} /><meshStandardMaterial color="#b98a4a" roughness={0.3} /></mesh>
  <mesh position={[0.0, 0.03, -0.055]} castShadow><sphereGeometry args={[0.035, 32, 16, 0, 2 * PI, 0, PI / 2]} />{M.porcelain({ col: "#d9d2c2" })}</mesh>
</>;
const Onigiri: React.FC = () => <group rotation={[-PI / 2 + 0.3, 0, 0]}>
  <mesh castShadow><cylinderGeometry args={[0.035, 0.035, 0.022, 3]} /><meshStandardMaterial color="#f7f4ec" roughness={0.8} /></mesh>
  <mesh position={[0, 0, -0.012]}><boxGeometry args={[0.03, 0.023, 0.03]} /><meshStandardMaterial color="#1c2a1c" roughness={0.6} /></mesh>
</group>;
const Letter: React.FC = () => <>
  <RBox s={[0.15, 0.002, 0.1]} r={0.001}>{M.matte({ col: "#f6f1e4" })}</RBox>
  <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0.02]}><planeGeometry args={[0.13, 0.08]} /><meshStandardMaterial map={notebookTex(["", "", ""])} transparent opacity={0.5} /></mesh>
</>;
const Coins: React.FC = () => <>{Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[(i % 3) * 0.03 - 0.03, 0.003 + Math.floor(i / 3) * 0.0035, 0]} castShadow>
  <cylinderGeometry args={[0.012, 0.012, 0.003, 24]} />{i % 2 ? M.brass({ col: "#b88a34" }) : M.steel({ col: "#c9ccd0" })}</mesh>)}</>;
const Yogurt: React.FC = () => <>
  <mesh position={[0, 0.035, 0]} castShadow><cylinderGeometry args={[0.016, 0.02, 0.07, 24]} /><meshStandardMaterial color="#f4ece0" roughness={0.4} /></mesh>
  <mesh position={[0, 0.072, 0]}><cylinderGeometry args={[0.016, 0.016, 0.004, 24]} />{M.matte({ col: "#c0392b" })}</mesh>
</>;
const Chalk: React.FC = () => <mesh rotation={[0, 0.4, PI / 2]} position={[0, 0.006, 0]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.07, 12]} /><meshStandardMaterial color="#f7f6f0" roughness={1} /></mesh>;
const RoomKey: React.FC = () => <>
  <mesh position={[0, 0.003, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.05, 0.003, 0.012]} />{M.brass()}</mesh>
  <RBox s={[0.03, 0.008, 0.08]} r={0.004} p={[0.04, 0.004, 0.03]} rot={[0, 0.3, 0]}>{M.plastic({ col: "#c0392b" })}</RBox>
</>;
const Clipping: React.FC = () => <mesh rotation={[-PI / 2, 0, 0.1]} position={[0, 0.001, 0]} receiveShadow><planeGeometry args={[0.13, 0.17]} /><meshStandardMaterial map={labelTex("clip", ["MISSING", "1998"], "#e8dfc8", "#3a3428", 256, 340, 54)} roughness={0.95} /></mesh>;
const Photo: React.FC = () => <>
  <RBox s={[0.1, 0.002, 0.075]} r={0.001}>{M.matte({ col: "#f2efe8" })}</RBox>
  <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.088, 0.063]} /><meshStandardMaterial color="#8aa0b4" roughness={0.4} /></mesh>
</>;

// ---------------- la mochila abierta contra la pared ----------------
const Backpack: React.FC = () => <group position={[0.92, 0, -0.5]} rotation={[0, -0.6, 0]}>
  <RBox s={[0.32, 0.46, 0.2]} r={0.07} p={[0, 0.23, 0]}>{M.matte({ col: "#4a5040" })}</RBox>
  <RBox s={[0.26, 0.2, 0.06]} r={0.04} p={[0, 0.16, 0.12]}>{M.matte({ col: "#3c4234" })}</RBox>
  <RBox s={[0.3, 0.05, 0.18]} r={0.03} p={[0, 0.47, -0.02]} rot={[-0.5, 0, 0]}>{M.matte({ col: "#3c4234" })}</RBox>
  <RBox s={[0.12, 0.08, 0.02]} r={0.01} p={[0.04, 0.5, 0.05]} rot={[0.2, 0.2, 0]}>{M.matte({ col: "#e6dcc4" })}</RBox>
  {[-0.08, 0.08].map((x, i) => <mesh key={i} position={[x, 0.3, -0.11]}><boxGeometry args={[0.04, 0.36, 0.015]} />{M.matte({ col: "#2c3026" })}</mesh>)}
</group>;

export const SinkWorld: React.FC<{ t: number; fx?: Record<string, number>; post?: boolean }> = ({ t, fx: fxIn, post = true }) => {
  const fx = fxIn ?? fxAt(t), f = (k: string) => cl(fx[k] ?? 0);
  const late = f("eve"), tv = 0.75 + 0.25 * Math.sin(t * 1.1) + 0.12 * Math.sin(t * 0.43 + 2); // tele del vecino: pulso lento
  const nb = ((WJ as unknown as { nb?: string[] }).nb) ?? ["Tokyo", "notes"];
  return (
    <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true } as unknown as THREE.WebGLRendererParameters} style={{ position: "absolute", inset: 0 }}>
      <Cam t={t} />
      {post && <Post bloom={0.14} threshold={1.0} exposure={0.95} env={0.45} />}
      <color attach="background" args={["#0e0f14"]} />
      <fog attach="fog" args={["#0e0f14", 4, 11]} />
      <hemisphereLight args={["#c9d4ec", "#2a2218", 0.32]} />
      {/* lámpara de escritorio (cálida, la que manda), ciudad por la ventana (fría) y tele del vecino (azul, pulso lento) */}
      <spotLight position={[-0.32, 0.72, -0.05]} angle={0.9} penumbra={0.8} intensity={9 + 3 * late} distance={3} castShadow color="#ffc98a" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <pointLight position={[0.25, 1.0, -0.95]} intensity={1.6} distance={3} color="#8fb0ff" />
      <pointLight position={[-1.2, 1.1, -0.3]} intensity={1.4 * tv} distance={2.4} color="#5d86ff" />
      <spotLight position={[0.9, 1.7, 1.4]} angle={0.5} penumbra={0.9} intensity={3.5} distance={5} color="#ffe6c8" />

      {/* piso de tatami (tres esteras) */}
      {[-0.95, 0, 0.95].map((x, i) => <mesh key={i} position={[x, 0, 0]} rotation={[-PI / 2, 0, i % 2 ? PI / 2 : 0]} receiveShadow><planeGeometry args={i % 2 ? [1.9, 0.94] : [0.94, 1.9]} /><meshStandardMaterial map={tatamiTex()} roughness={0.9} /></mesh>)}
      {/* pared del fondo (revoque claro) con zócalo de madera y la ventana */}
      <mesh position={[0, 1.3, -1.12]} receiveShadow><planeGeometry args={[4, 2.6]} /><meshStandardMaterial color="#cfc6b4" roughness={0.95} /></mesh>
      <mesh position={[0, 0.05, -1.11]}><boxGeometry args={[4, 0.1, 0.02]} />{M.wood({ base: [96, 64, 40] })}</mesh>
      <group position={[0.3, 1.0, -1.105]}>
        <mesh><planeGeometry args={[0.95, 0.75]} /><meshBasicMaterial map={cityTex()} toneMapped={false} /></mesh>
        {[[0, 0.39, 1.0, 0.04], [0, -0.39, 1.0, 0.04], [-0.49, 0, 0.04, 0.82], [0.49, 0, 0.04, 0.82], [0, 0, 0.025, 0.78]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.03]} r={0.004} p={[x, y, 0.012]}>{M.matte({ col: "#d8d4ca" })}</RBox>)}
        <mesh position={[0, 0, 0.004]}><planeGeometry args={[0.95, 0.75]} />{M.glass({ op: 0.06 })}</mesh>
        {/* la cortina corrida a medias */}
        <mesh position={[-0.42, -0.02, 0.03]}><planeGeometry args={[0.32, 0.9]} /><meshStandardMaterial color="#9a8f78" roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.94} /></mesh>
      </group>
      {/* pared izquierda: donde pega la luz de la tele del vecino */}
      <mesh position={[-1.42, 1.3, 0]} rotation={[0, PI / 2, 0]} receiveShadow><planeGeometry args={[2.4, 2.6]} /><meshStandardMaterial color="#c4bca9" roughness={0.95} /></mesh>
      <mesh position={[-1.41, 1.0, -0.35]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.7, 0.45]} /><meshBasicMaterial color="#4f6fd8" transparent opacity={0.1 + 0.08 * tv} toneMapped={false} /></mesh>
      <Backpack />
      {/* futón doblado en la esquina */}
      <RBox s={[0.7, 0.16, 0.45]} r={0.06} p={[-0.95, 0.08, -0.75]}>{M.matte({ col: "#e9e2d2" })}</RBox>
      <RBox s={[0.68, 0.1, 0.43]} r={0.05} p={[-0.95, 0.21, -0.75]}>{M.matte({ col: "#5b6a82" })}</RBox>
      {/* la mesa baja (chabudai) */}
      <RBox s={[0.95, 0.035, 0.6]} r={0.015} p={[0, TY - 0.018, 0]}>{M.wood({ base: [104, 66, 38], rx: 3, ry: 1 })}</RBox>
      {[[-0.4, -0.23], [0.4, -0.23], [-0.4, 0.23], [0.4, 0.23]].map(([x, z], i) => <RBox key={i} s={[0.05, TY - 0.035, 0.05]} r={0.006} p={[x, (TY - 0.035) / 2, z]}>{M.wood({ base: [84, 52, 30] })}</RBox>)}
      {/* lámpara de escritorio de brazo */}
      <group position={[-0.36, TY, -0.18]}>
        <mesh position={[0, 0.008, 0]}><cylinderGeometry args={[0.05, 0.055, 0.016, 32]} />{M.matte({ col: "#1e1f22" })}</mesh>
        <mesh position={[0.02, 0.16, 0]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.006, 0.006, 0.32, 10]} />{M.matte({ col: "#1e1f22" })}</mesh>
        <mesh position={[0.1, 0.31, 0.02]} rotation={[0.3, 0, 0.9]}><coneGeometry args={[0.05, 0.08, 32, 1, true]} /><meshStandardMaterial color="#1e1f22" side={THREE.DoubleSide} roughness={0.5} /></mesh>
        <mesh position={[0.12, 0.29, 0.03]}><sphereGeometry args={[0.018, 16, 12]} /><meshBasicMaterial color="#fff1d6" toneMapped={false} /></mesh>
      </group>
      {/* lo de siempre: notebook, cuaderno, lata de café */}
      <Prop k={1 - f("noLap")} p={[0.06, TY, -0.1]}><Laptop open={1 - f("lapClosed")} /></Prop>
      <Prop k={1 - f("noNb")} p={[-0.2, TY, 0.13]} r={0.25}><Notebook lines={nb} /></Prop>
      <Prop k={1 - f("noCan")} p={[0.33, TY, 0.14]}><CoffeeCan /></Prop>
      {/* los objetos del tema (world.json → fx) */}
      <Prop k={f("tray")} p={[0.12, TY, 0.12]} r={-0.1}><Tray /></Prop>
      <Prop k={f("onigiri")} p={[0.18, TY + 0.02, 0.17]} r={0.4}><Onigiri /></Prop>
      <Prop k={f("letter")} p={[-0.02, TY + 0.001, 0.16]} r={-0.2}><Letter /></Prop>
      <Prop k={f("coins")} p={[0.2, TY, 0.06]}><Coins /></Prop>
      <Prop k={f("yogurt")} p={[0.24, TY, 0.0]}><Yogurt /></Prop>
      <Prop k={f("chalk")} p={[0.16, TY, 0.18]}><Chalk /></Prop>
      <Prop k={f("key")} p={[0.14, TY, 0.1]} r={0.8}><RoomKey /></Prop>
      <Prop k={f("clip")} p={[0.1, TY + 0.001, 0.14]} r={0.15}><Clipping /></Prop>
      <Prop k={f("photo")} p={[-0.05, TY + 0.002, 0.2]} r={-0.3}><Photo /></Prop>
    </ThreeCanvas>
  );
};
