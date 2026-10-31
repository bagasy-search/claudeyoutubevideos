// lfh29 · utilería de la granja (caja verde de bórax, hormigas, cucarachas, frascos, azucarera, almanaque) para los componentes de a-e.
import React from "react";
import * as THREE from "three";
import { M, RBox, curve, rn, tex } from "./h3d";

const PI = Math.PI;

// etiqueta pintada de la caja verde (sin marca: sólo BORAX y una carreta dibujada)
const boxTex = (face: "front" | "side") => tex.text("bxv" + face, 256, 384, (g) => {
  g.fillStyle = "#2f7d4a"; g.fillRect(0, 0, 256, 384);
  g.fillStyle = "#f3e6b8"; g.fillRect(14, 14, 228, 356);
  g.fillStyle = "#2f7d4a"; g.fillRect(22, 22, 212, 340);
  g.fillStyle = "#f3e6b8"; g.textAlign = "center"; g.font = "900 64px Georgia"; g.fillText("BORAX", 128, face === "front" ? 120 : 200);
  if (face === "front") {
    g.font = "700 22px Georgia"; g.fillText("NATURAL LAUNDRY", 128, 158); g.fillText("BOOSTER", 128, 184);
    // carreta y mulas en línea
    g.strokeStyle = "#f3e6b8"; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 290); g.lineTo(216, 290); g.stroke();
    for (let i = 0; i < 6; i++) { g.fillRect(44 + i * 20, 262, 14, 10); g.fillRect(46 + i * 20, 272, 2, 14); g.fillRect(54 + i * 20, 272, 2, 14); }
    g.fillRect(168, 244, 44, 30); g.beginPath(); g.arc(178, 290, 9, 0, 6.3); g.arc(204, 290, 9, 0, 6.3); g.fill();
    g.font = "700 20px Georgia"; g.fillText("NET WT 4 LB", 128, 340);
  }
});
export const BoraxBox: React.FC<{ s?: number; open?: number }> = ({ s = 1, open = 0 }) => <group scale={s}>
  <mesh position={[0, 0.12, 0]} castShadow>
    <boxGeometry args={[0.16, 0.24, 0.07]} />
    <meshStandardMaterial attach="material-0" map={boxTex("side")} roughness={0.75} />
    <meshStandardMaterial attach="material-1" map={boxTex("side")} roughness={0.75} />
    <meshStandardMaterial attach="material-2" color="#2f7d4a" roughness={0.75} />
    <meshStandardMaterial attach="material-3" color="#2f7d4a" roughness={0.75} />
    <meshStandardMaterial attach="material-4" map={boxTex("front")} roughness={0.75} />
    <meshStandardMaterial attach="material-5" map={boxTex("front")} roughness={0.75} />
  </mesh>
  {/* pico vertedor que se abre */}
  <group position={[0.05, 0.24, 0.035]} rotation={[-1.1 * open, 0, 0]}><mesh position={[0, 0.012, -0.01]}><boxGeometry args={[0.04, 0.024, 0.002]} /><meshStandardMaterial color="#e9dfc2" roughness={0.8} /></mesh></group>
</group>;

// hormiga negra brillante con patas que caminan (ph = fase del paso)
export const Ant: React.FC<{ p?: number[]; yaw?: number; ph?: number; s?: number; col?: string; dust?: number }> = ({ p = [0, 0, 0], yaw = 0, ph = 0, s = 1, col = "#141110", dust = 0 }) => {
  const c = dust > 0 ? new THREE.Color(col).lerp(new THREE.Color("#f2efe6"), dust).getStyle() : col;
  const mat = <meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.8} />;
  return <group position={p as [number, number, number]} rotation={[0, yaw, 0]} scale={s * 0.026}>
    <mesh position={[-0.42, 0.22, 0]} scale={[0.5, 0.36, 0.38]}><sphereGeometry args={[1, 14, 10]} />{mat}</mesh>
    <mesh position={[0.05, 0.2, 0]} scale={[0.26, 0.15, 0.15]}><sphereGeometry args={[1, 12, 8]} />{mat}</mesh>
    <mesh position={[0.42, 0.24, 0]} scale={[0.2, 0.17, 0.19]}><sphereGeometry args={[1, 12, 8]} />{mat}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[0.62, 0.36, sd * 0.08]} rotation={[sd * 0.5, 0, -0.7]}><cylinderGeometry args={[0.03, 0.025, 0.42, 6]} />{mat}</mesh>)}
    {[0, 1, 2].map((i) => [-1, 1].map((sd) => { const sw = 0.45 * Math.sin(ph * 2 * PI + i * 2.1 + (sd > 0 ? PI : 0)); return <mesh key={i + "" + sd} position={[0.05 + (i - 1) * 0.16, 0.12, sd * 0.2]} rotation={[sd * 0.9, sw, 0]}><cylinderGeometry args={[0.04, 0.03, 0.5, 6]} />{mat}</mesh>; }))}
  </group>;
};

// cucaracha marrón (élitros brillantes + antenas largas)
export const Roach: React.FC<{ p?: number[]; yaw?: number; ph?: number; s?: number }> = ({ p = [0, 0, 0], yaw = 0, ph = 0, s = 1 }) =>
  <group position={p as [number, number, number]} rotation={[0, yaw, 0]} scale={s * 0.04}>
    <mesh position={[0, 0.16, 0]} scale={[0.7, 0.16, 0.36]}><sphereGeometry args={[1, 16, 10]} /><meshPhysicalMaterial color="#5a2f14" roughness={0.25} clearcoat={1} /></mesh>
    <mesh position={[0.62, 0.15, 0]} scale={[0.14, 0.1, 0.2]}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#3a1e0c" roughness={0.3} clearcoat={1} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[1.1, 0.2, sd * 0.25]} rotation={[sd * 0.55, 0, -1.45 + 0.08 * Math.sin(ph * 9 + sd)]}><cylinderGeometry args={[0.01, 0.006, 1.0, 4]} /><meshStandardMaterial color="#3a1e0c" /></mesh>)}
    {[0, 1, 2].map((i) => [-1, 1].map((sd) => <mesh key={i + "" + sd} position={[0.3 - i * 0.3, 0.07, sd * 0.42]} rotation={[sd * 1.1, 0.5 * Math.sin(ph * 2 * PI + i * 2), 0]}><cylinderGeometry args={[0.02, 0.012, 0.5, 5]} /><meshStandardMaterial color="#4a2610" /></mesh>))}
  </group>;

// frasco de vidrio con tapa de metal; lv = nivel de líquido (0-1), holes = agujeros en la tapa
export const Jar: React.FC<{ r?: number; h?: number; lv?: number; liq?: string; lid?: number; holes?: number; label?: string }> = ({ r = 0.05, h = 0.13, lv = 0, liq = "#e8dcc0", lid = 1, holes = 0, label }) => <group>
  <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r, r, h, 40, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
  <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r, 40]} />{M.glass({ op: 0.25 })}</mesh>
  {lv > 0.01 && <mesh position={[0, (h * 0.92 * lv) / 2 + 0.002, 0]}><cylinderGeometry args={[r * 0.96, r * 0.96, h * 0.92 * lv, 40]} />{M.water({ col: liq, op: 0.55, emI: 0.05 })}</mesh>}
  {lid > 0 && <group position={[0, h + 0.008 + (1 - lid) * 0.12, 0]}>
    <mesh><cylinderGeometry args={[r * 1.04, r * 1.04, 0.016, 40]} />{M.steel({ col: "#d8cfb8" })}</mesh>
    {Array.from({ length: holes }, (_, i) => { const a = (i / Math.max(1, holes)) * 2 * PI, rr = i === 0 ? 0 : r * 0.5; return <mesh key={i} position={[Math.cos(a) * rr, 0.0085, Math.sin(a) * rr]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#0b0b0b" /></mesh>; })}
  </group>}
  {label && <mesh position={[0, h * 0.5, r + 0.001]}><planeGeometry args={[r * 1.5, h * 0.36]} /><meshStandardMaterial map={tex.text("jl" + label, 256, 128, (g) => { g.fillStyle = "#efe2c0"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#1c1a17"; g.font = "700 40px Georgia"; g.textAlign = "center"; label.split("|").forEach((l, i, a) => g.fillText(l, 128, 64 + (i - (a.length - 1) / 2) * 44 + 14)); })} roughness={0.8} /></mesh>}
</group>;

// azucarera de vidrio prensado con tapa
export const SugarBowl: React.FC = () => <group>
  <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.06, 0.045, 0.1, 12]} />{M.glass({ op: 0.3 })}</mesh>
  <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.054, 0.042, 0.08, 12]} /><meshStandardMaterial color="#fbf8f0" roughness={0.9} /></mesh>
  <mesh position={[0, 0.108, 0]}><cylinderGeometry args={[0.064, 0.064, 0.012, 12]} />{M.glass({ op: 0.35 })}</mesh>
  <mesh position={[0, 0.125, 0]}><sphereGeometry args={[0.014, 12, 10]} />{M.glass({ op: 0.4 })}</mesh>
</group>;

// platito blanco de loza
export const Saucer: React.FC<{ r?: number }> = ({ r = 0.07 }) => <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[r, r * 0.7, 0.012, 40]} />{M.porcelain()}</mesh>;

// posición y rumbo sobre un camino (para hormigas en fila)
export const along = (key: string, pts: number[][], u: number) => {
  const c = CC.get(key) ?? (CC.set(key, curve(pts)), CC.get(key)!);
  const k = Math.max(0, Math.min(0.9999, u)), a = c.getPointAt(k), b = c.getPointAt(Math.min(1, k + 0.002));
  return { p: [a.x, a.y, a.z], yaw: -Math.atan2(b.z - a.z, b.x - a.x) };
};
const CC = new Map<string, THREE.CatmullRomCurve3>();

// polvo blanco fino (granitos) sobre un rectángulo
export const Powder: React.FC<{ n: number; w: number; d: number; y?: number; op?: (i: number) => number; r?: number; col?: string; heap?: number }> = ({ n, w, d, y = 0.001, op, r = 0.0022, col = "#f6f4ee", heap = 0 }) => <>
  {Array.from({ length: n }, (_, i) => { const x = (rn(i, 11) - 0.5) * w, z = (rn(i, 12) - 0.5) * d, o = op ? op(i) : 1; if (o <= 0.01) return null;
    const hh = heap > 0 ? heap * Math.max(0, 1 - Math.hypot(x / (w / 2), z / (d / 2))) * rn(i, 13) : 0;
    return <mesh key={i} position={[x, y + hh, z]} scale={o}><icosahedronGeometry args={[r * (0.6 + 0.8 * rn(i, 14)), 0]} /><meshStandardMaterial color={col} roughness={0.7} /></mesh>; })}
</>;

// mano enguantada simple (guante de goma amarillo): palma + 4 dedos + pulgar
export const Glove: React.FC<{ pinch?: number; col?: string }> = ({ pinch = 0, col = "#f0c43a" }) => <group>
  <RBox s={[0.08, 0.03, 0.09]} r={0.014}><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></RBox>
  {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.03 + i * 0.02, 0, 0.045]} rotation={[0.9 * pinch, 0, 0]}><mesh position={[0, 0, 0.03]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0085, 0.045, 4, 10]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></mesh></group>)}
  <group position={[0.045, 0, 0.01]} rotation={[0, -0.8 + 0.6 * pinch, 0]}><mesh position={[0.02, 0, 0.02]} rotation={[PI / 2, 0, -0.6]}><capsuleGeometry args={[0.009, 0.035, 4, 10]} /><meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /></mesh></group>
</group>;
