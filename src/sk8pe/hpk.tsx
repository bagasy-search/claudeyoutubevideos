// premium8n · objetos compartidos de la tanda (hp.tsx de cada video). Sólo objetos: cada mecanismo vive en su hp.tsx y no se repite.
import React, { useMemo } from "react";
import * as THREE from "three";
import { lerp, cl, Box, Cyl, V } from "./hk";
import { mk } from "./casa3d";

export const STEEL = "#d5d9dd", WATER = "#8fcfff", BROTH = "#d8a94a", KOMBU = "#26332a", WOOD = "#b9844e", PINKF = "#e9b0a0";
export const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// tabla: la cara de arriba en 0,05 (nunca coplanar con el piso wood)
export const Board: React.FC<{ p?: V; w?: number; d?: number; c?: string }> = ({ p = [0, 0, 0], w = 1.2, d = 0.6, c = WOOD }) =>
  <Box p={[p[0], p[1] + 0.03, p[2]]} s={[w, 0.04, d]} c={c} r={0.75} rad={0.01} />;
export const Spoon: React.FC<{ p: V; rot?: V; s?: number; c?: string }> = ({ p, rot = [0, 0, 0], s = 1, c = STEEL }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[1, 0.35, 0.7]}><sphereGeometry args={[0.045, 22, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color={c} metalness={0.9} roughness={0.14} side={THREE.DoubleSide} /></mesh>
    <Box p={[0.12, 0.012, 0]} s={[0.18, 0.006, 0.016]} c={c} m={0.9} r={0.14} rad={0.003} />
  </group>;
export const WSpoon: React.FC<{ p: V; rot?: V; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh scale={[1, 0.4, 0.75]}><sphereGeometry args={[0.05, 22, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#a8703c" roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <Box p={[0.17, 0.012, 0]} s={[0.26, 0.012, 0.02]} c="#a8703c" r={0.6} rad={0.005} />
  </group>;
export const Hand: React.FC<{ p: V; rot?: V; s?: number; c?: string; curl?: number }> = ({ p, rot = [0, 0, 0], s = 1, c = "#dcae88", curl = 0 }) =>
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, 0]} s={[0.16, 0.04, 0.14]} c={c} r={0.6} rad={0.02} />
    {[0, 1, 2, 3].map((i) => <group key={i} position={[0.08, 0, -0.05 + 0.034 * i]} rotation={[0, 0, -curl * 1.3]}><mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.014, 0.07, 6, 10]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh></group>)}
    <mesh position={[0.05, 0.004, 0.083]} rotation={[0, -0.22, Math.PI / 2]}><capsuleGeometry args={[0.016, 0.07, 6, 10]} /><meshStandardMaterial color={c} roughness={0.6} /></mesh>
    <Cyl p={[-0.13, 0, 0]} r={0.045} h={0.08} c="#c9a23a" rough={0.9} rot={[0, 0, Math.PI / 2]} />
  </group>;
export const Drop: React.FC<{ p: V; s?: number; op?: number; c?: string }> = ({ p, s = 1, op = 0.85, c = WATER }) =>
  <group position={p} scale={s}><mesh><sphereGeometry args={[0.02, 14, 10]} /><meshStandardMaterial color={c} roughness={0.05} transparent opacity={op} /></mesh>
    <mesh position={[0, 0.022, 0]}><coneGeometry args={[0.014, 0.03, 12]} /><meshStandardMaterial color={c} roughness={0.05} transparent opacity={op} /></mesh></group>;
// olla de acero abierta, con su líquido
export const Pot: React.FC<{ p: V; s?: number; water?: string; lvl?: number; c?: string }> = ({ p, s = 1, water = BROTH, lvl = 0.7, c = "#b9bec4" }) =>
  <group position={p} scale={s}>
    <mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.3, 0.28, 0.3, 48, 1, true]} /><meshStandardMaterial color={c} metalness={0.8} roughness={0.32} side={THREE.DoubleSide} /></mesh>
    <Cyl p={[0, 0.03, 0]} r={0.28} h={0.02} c={c} m={0.8} rough={0.32} />
    <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.012, 10, 48]} /><meshStandardMaterial color={c} metalness={0.85} roughness={0.25} /></mesh>
    <mesh position={[0, 0.05 + 0.25 * lvl, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.288, 48]} /><meshStandardMaterial color={water} roughness={0.18} /></mesh>
    {[-1, 1].map((x) => <Box key={x} p={[x * 0.36, 0.25, 0]} s={[0.1, 0.03, 0.06]} c="#2c2a28" r={0.5} rad={0.01} />)}
  </group>;
// olla de vidrio para ver lo que pasa adentro (lvl = alto del líquido, de 0 a 1 sobre h)
export const Glass: React.FC<{ p: V; r?: number; h?: number; water?: string; lvl?: number; op?: number; children?: React.ReactNode }> = ({ p, r = 0.34, h = 0.46, water = BROTH, lvl = 0.75, op = 0.55, children }) =>
  <group position={p}>
    {children}
    <mesh position={[0, 0.03 + h * lvl / 2, 0]}><cylinderGeometry args={[r * 0.97, r * 0.97, h * lvl, 48]} /><meshStandardMaterial color={water} roughness={0.55} envMapIntensity={0} transparent opacity={op} depthWrite={false} /></mesh>
    <mesh position={[0, 0.03 + h / 2, 0]}><cylinderGeometry args={[r, r, h, 48, 1, true]} /><meshPhysicalMaterial color="#eef6f8" roughness={0.05} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0, 0.03 + h, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.008, 8, 48]} /><meshStandardMaterial color="#f4fbfc" roughness={0.1} /></mesh>
    <Cyl p={[0, 0.02, 0]} r={r} h={0.02} c="#dfe9ea" rough={0.2} />
  </group>;
// tazón hondo con sopa (el fill se puede teñir)
export const Dish: React.FC<{ p: V; s?: number; c?: string; fill?: string; fillK?: number }> = ({ p, s = 1, c = "#f1ebdd", fill = BROTH, fillK = 1 }) =>
  <group position={p} scale={s}>
    <mesh position={[0, 0.17, 0]} rotation={[Math.PI, 0, 0]} castShadow><sphereGeometry args={[0.24, 36, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={c} roughness={0.32} side={THREE.DoubleSide} /></mesh>
    <Cyl p={[0, 0.0, 0]} r={0.09} h={0.03} c={c} rough={0.4} />
    <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.24, 0.006, 8, 44]} /><meshStandardMaterial color="#7a5a3c" roughness={0.5} /></mesh>
    {fillK > 0.02 && <mesh position={[0, 0.08 + 0.07 * fillK, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.19 + 0.03 * fillK, 36]} /><meshStandardMaterial color={fill} roughness={0.2} /></mesh>}
  </group>;
// hoja de kombu ondulada con su polvo blanco
export const Kombu: React.FC<{ p: V; rot?: V; w?: number; d?: number; wave?: number; c?: string }> = ({ p, rot = [0, 0, 0], w = 0.5, d = 0.22, wave = 0.012, c }) => {
  const tex = useMemo(() => mk(256, 128, (g) => { g.fillStyle = KOMBU; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(235,235,225,${0.1 + 0.4 * rnd(i)})`; g.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 128, 1 + 2 * rnd(i + 3), 1 + 2 * rnd(i + 4)); } }), []);
  const geo = useMemo(() => { const g = new THREE.PlaneGeometry(w, d, 28, 6); const a = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < a.count; i++) a.setZ(i, wave * Math.sin(a.getX(i) * 22 + a.getY(i) * 7)); g.computeVertexNormals(); return g; }, [w, d, wave]);
  return <mesh geometry={geo} position={p} rotation={[-Math.PI / 2 + rot[0], rot[1], rot[2]]} castShadow><meshStandardMaterial map={tex} color={c ?? "#ffffff"} roughness={0.75} side={THREE.DoubleSide} /></mesh>;
};
// viruta de bonito
export const Flake: React.FC<{ p: V; rot?: V; s?: number; c?: string }> = ({ p, rot = [0, 0, 0], s = 1, c = PINKF }) =>
  <mesh position={p} rotation={rot} scale={s}><cylinderGeometry args={[0.03, 0.03, 0.06, 12, 1, true, 0, Math.PI * 1.1]} /><meshStandardMaterial color={c} roughness={0.7} side={THREE.DoubleSide} /></mesh>;
// olor: tres hilos de puntitos que suben ondulando
export const Waft: React.FC<{ p: V; t: number; k?: number; col?: string; s?: number }> = ({ p, t, k = 1, col: cc = "#f2a14a", s = 1 }) => k < 0.02 ? null :
  <group position={p} scale={s}>{[-0.12, 0, 0.12].map((x, j) => Array.from({ length: 14 }, (_, i) => { const u = (i / 14 + t * 0.12 + j * 0.2) % 1; return <mesh key={j + "-" + i} position={[x + 0.05 * Math.sin(u * 9 + j + t), u * 0.75, 0.04 * Math.cos(u * 7 + j)]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color={cc} transparent opacity={0.8 * k * Math.sin(Math.PI * u)} depthWrite={false} toneMapped={false} /></mesh>; }))}</group>;
// fideos en nido
export const Nest: React.FC<{ p: V; s?: number; c?: string }> = ({ p, s = 1, c = "#ecd28e" }) =>
  <group position={p} scale={s}>{Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rnd(i) - 0.5) * 0.09, (rnd(i + 5) - 0.5) * 0.05, (rnd(i + 2) - 0.5) * 0.09]} rotation={[rnd(i + 7) * 3, rnd(i + 8) * 3, rnd(i + 9) * 3]}><torusGeometry args={[0.08 + 0.03 * rnd(i + 3), 0.0065, 7, 34]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>)}</group>;
// hornallita con llama (la llama va siempre montada; flame = 0-1)
export const Burner: React.FC<{ p: V; s?: number; flame?: number; t?: number }> = ({ p, s = 1, flame = 1, t = 0 }) =>
  <group position={p} scale={s}>
    <Cyl p={[0, 0.06, 0]} r={0.26} r2={0.3} h={0.08} c="#2b2b2e" m={0.6} rough={0.5} />
    {Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2, f = Math.max(0.05, flame * (0.8 + 0.2 * Math.sin(t * 2 + i))); return <mesh key={i} position={[0.17 * Math.cos(a), 0.11, 0.17 * Math.sin(a)]} scale={[f, f, f]}><coneGeometry args={[0.018, 0.07, 8]} /><meshBasicMaterial color="#5aa8ff" toneMapped={false} /></mesh>; })}
  </group>;
export const lerpV = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
