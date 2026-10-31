// apa30c · piezas del gallinero para los componentes: alambre de gallinero (hexágono), malla de media pulgada, caja túnel,
// trampa de golpe grande, comedero colgante y comedero a pedal, nido con huevos, bebedero.
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn } from "./h3d";
import { Hen, Egg, barnT } from "./farmkit";

type V = [number, number, number];
const PI = Math.PI;

// textura de alambre hexagonal (chicken wire): celda grande, alambre fino
export const hexT = () => tex.text("hexw", 256, 256, (g) => {
  g.clearRect(0, 0, 256, 256); g.strokeStyle = "#cfd3d6"; g.lineWidth = 2.4;
  const r = 21, w = r * Math.sqrt(3);
  for (let row = -1; row < 9; row++) for (let col = -1; col < 8; col++) {
    const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * r * 1.5; g.beginPath();
    for (let k = 0; k <= 6; k++) { const a = PI / 6 + k * PI / 3; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); k ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
});
// textura de malla cuadrada soldada (hardware cloth)
export const gridT = (cell = 16) => tex.text("grid" + cell, 256, 256, (g) => {
  g.clearRect(0, 0, 256, 256); g.strokeStyle = "#c4c9cd"; g.lineWidth = 3.2;
  for (let k = 0; k <= 256; k += cell) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); }
});
// panel de alambre (hex o grilla), w×h en metros; dens = repeticiones por metro
export const Wire: React.FC<{ w: number; h: number; p?: V; rot?: V; hex?: boolean; dens?: number; col?: string }> = ({ w, h, p = [0, 0, 0], rot = [0, 0, 0], hex, dens = 6, col }) => {
  const t = (hex ? hexT() : gridT()).clone(); t.repeat.set(w * dens, h * dens); t.needsUpdate = true;
  return <mesh position={p} rotation={rot}><planeGeometry args={[w, h]} /><meshStandardMaterial map={t} color={col ?? "#ffffff"} transparent alphaTest={0.3} metalness={0.8} roughness={0.32} side={THREE.DoubleSide} /></mesh>;
};

// gallinero: caja de tablas con techo a dos aguas; lift = alzado sobre patas
export const Coop: React.FC<{ p?: V; s?: number; lift?: number; door?: number }> = ({ p = [0, 0, 0], s = 1, lift = 0, door = 0 }) => <group position={p} scale={s}>
  <RBox s={[0.8, 0.5, 0.55]} p={[0, 0.25 + lift, 0]} r={0.01}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
  {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.6 + lift, sd * 0.15]} rotation={[sd * 0.55, 0, 0]} castShadow><boxGeometry args={[0.9, 0.02, 0.38]} /><meshStandardMaterial color="#6a3a24" roughness={0.85} /></mesh>)}
  <mesh position={[0.15, 0.17 + lift, 0.277]}><planeGeometry args={[0.14, 0.2]} /><meshStandardMaterial color="#120c08" /></mesh>
  <group position={[0.08, 0.07 + lift, 0.278]} rotation={[0, -1.2 * door, 0]}><RBox s={[0.14, 0.2, 0.012]} p={[0.07, 0.1, 0]} r={0.003}><meshStandardMaterial map={barnT()} color="#c8b090" roughness={0.95} /></RBox></group>
  {lift > 0.01 && [[-0.37, -0.24], [0.37, -0.24], [-0.37, 0.24], [0.37, 0.24]].map(([x, z], i) => <RBox key={i} s={[0.05, lift, 0.05]} p={[x, lift / 2, z]} r={0.004}>{M.wood({ base: [110, 74, 44] })}</RBox>)}
</group>;

// caja túnel de tres tablas con agujero de 3" en cada punta; open = se levanta la tapa
export const TunnelBox: React.FC<{ p?: V; ry?: number; s?: number; lid?: number; build?: number }> = ({ p = [0, 0, 0], ry = 0, s = 1, lid = 0, build = 1 }) => {
  const b = (i: number) => Math.min(1, Math.max(0, build * 3 - i));
  return <group position={p} rotation={[0, ry, 0]} scale={s}>
    {[-1, 1].map((sd, i) => <group key={sd} position={[0, (1 - b(i)) * 0.3, 0]}><RBox s={[0.6, 0.12, 0.018]} p={[0, 0.06, sd * 0.07]} r={0.003}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox></group>)}
    <group position={[0, 0.129 + (1 - b(2)) * 0.3, -0.08]} rotation={[-1.4 * lid, 0, 0]}><RBox s={[0.6, 0.018, 0.16]} p={[0, 0, 0.08]} r={0.003}><meshStandardMaterial map={barnT()} color="#d8c0a0" roughness={0.95} /></RBox></group>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.301, 0.06, 0]}>
      <mesh rotation={[0, PI / 2, 0]}><ringGeometry args={[0.038, 0.075, 28]} /><meshStandardMaterial map={barnT()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    </group>)}
  </group>;
};

// trampa de golpe grande (tamaño rata); set = brazo armado (1) o cerrado (0)
export const RatSnap: React.FC<{ p?: V; ry?: number; set?: number; s?: number }> = ({ p = [0, 0, 0], ry = 0, set = 1, s = 1 }) => <group position={p} rotation={[0, ry, 0]} scale={s}>
  <RBox s={[0.09, 0.014, 0.18]} p={[0, 0.007, 0]} r={0.003}>{M.wood({ base: [196, 160, 110] })}</RBox>
  <group position={[0, 0.016, 0]} rotation={[-(PI - 0.05) * set, 0, 0]}><mesh position={[0, 0, 0.04]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.04, 0.0022, 6, 24, PI]} />{M.steel()}</mesh></group>
  <mesh position={[0, 0.017, 0.055]}><boxGeometry args={[0.035, 0.004, 0.03]} /><meshStandardMaterial color="#c8a33a" metalness={0.6} roughness={0.4} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.03, 0.02, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.008, 0.002, 6, 14]} />{M.steel()}</mesh>)}
</group>;

// comedero colgante galvanizado; fill = nivel de alimento 0-1
export const Feeder: React.FC<{ p?: V; fill?: number; s?: number; hang?: boolean }> = ({ p = [0, 0, 0], fill = 1, s = 1, hang = false }) => <group position={p} scale={s}>
  <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.3, 40, 1, true]} /><meshStandardMaterial color="#b9bfc4" metalness={0.85} roughness={0.36} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh>
  <mesh position={[0, 0.36, 0]}><coneGeometry args={[0.12, 0.06, 40]} /><meshStandardMaterial color="#c4c9ce" metalness={0.85} roughness={0.32} /></mesh>
  <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.17, 0.15, 0.05, 40]} /><meshStandardMaterial color="#b0b6bb" metalness={0.85} roughness={0.38} side={THREE.DoubleSide} /></mesh>
  {fill > 0.01 && <mesh position={[0, 0.06 + 0.14 * fill, 0]}><cylinderGeometry args={[0.096, 0.096, 0.28 * fill, 32]} /><meshStandardMaterial color="#c9a45a" roughness={1} /></mesh>}
  {hang && <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.002, 0.002, 0.45, 6]} />{M.steel()}</mesh>}
</group>;

// comedero a pedal: caja con tapa que se abre cuando el escalón baja (step 0-1)
export const Treadle: React.FC<{ p?: V; step?: number; s?: number; prop?: number }> = ({ p = [0, 0, 0], step = 0, s = 1, prop = 0 }) => {
  const open = Math.max(step, prop);
  return <group position={p} scale={s}>
    <RBox s={[0.26, 0.3, 0.24]} p={[0, 0.15, 0]} r={0.008}><meshStandardMaterial color="#9aa2a8" metalness={0.75} roughness={0.4} /></RBox>
    <mesh position={[0, 0.2, 0.121]}><planeGeometry args={[0.18, 0.08]} /><meshStandardMaterial color="#c9a45a" roughness={1} /></mesh>
    <group position={[0, 0.245, 0.122]} rotation={[-1.3 * (1 - open), 0, 0]}><RBox s={[0.2, 0.012, 0.1]} p={[0, 0, 0.05]} r={0.003}><meshStandardMaterial color="#aab2b8" metalness={0.75} roughness={0.35} /></RBox></group>
    {/* varilla que une el escalón con la tapa */}
    <mesh position={[0.12, 0.13, 0.2]} rotation={[0.9 - 0.4 * step, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 8]} />{M.steel()}</mesh>
    <RBox s={[0.26, 0.012, 0.16]} p={[0, 0.04 - 0.025 * step, 0.24]} rot={[0.12 * (1 - step), 0, 0]} r={0.003}><meshStandardMaterial color="#8a9298" metalness={0.75} roughness={0.4} /></RBox>
    {prop > 0.5 && <mesh position={[0.08, 0.28, 0.17]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.1, 6]} />{M.wood({ base: [190, 150, 96] })}</mesh>}
  </group>;
};

// nido de tablas con paja; eggs = cuántos hay (de 7); bad = índice del huevo mordido
export const NestBox: React.FC<{ p?: V; eggs?: number; bad?: number; s?: number }> = ({ p = [0, 0, 0], eggs = 7, bad = -1, s = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.5, 0.025, 0.32]} p={[0, 0.012, 0]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
  {[[0, -0.16, 0.5, 0], [-0.25, 0, 0.32, 1], [0.25, 0, 0.32, 1]].map(([x, z, l, r], i) => <RBox key={i} s={[l, 0.12, 0.02]} p={[x, 0.06, z]} rot={[0, r ? PI / 2 : 0, 0]} r={0.003}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>)}
  {Array.from({ length: 90 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.44, 0.03 + rn(i, 2) * 0.02, (rn(i, 3) - 0.5) * 0.28]} rotation={[0, rn(i, 4) * PI, PI / 2]}><cylinderGeometry args={[0.0015, 0.0015, 0.07, 4]} /><meshStandardMaterial color="#d9bd72" roughness={1} /></mesh>)}
  {Array.from({ length: 7 }, (_, i) => i < eggs && <Egg key={i} p={[-0.15 + (i % 4) * 0.1, 0.04, -0.05 + Math.floor(i / 4) * 0.11]} s={1.4} crack={i === bad} brown={i % 3 !== 1} />)}
</group>;

export { Hen, Egg };
