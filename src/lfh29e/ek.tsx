// lfh29e · piezas propias del video del detergente: botella de detergente, hoja de rosal, pulgón, hormiga, mosquita, mariquita, pimpollo
import React from "react";
import * as THREE from "three";
import { M } from "./h3d";

const PI = Math.PI;
const soapG = new THREE.LatheGeometry([[0, 0], [0.032, 0], [0.036, 0.006], [0.036, 0.13], [0.03, 0.16], [0.012, 0.18], [0, 0.18]].map(([x, y]) => new THREE.Vector2(x, y)), 40);
const leafShape = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.03, 0.02, 0.035, 0.06, 0, 0.1); s.bezierCurveTo(-0.035, 0.06, -0.03, 0.02, 0, 0); return s; })();
const leafG = new THREE.ShapeGeometry(leafShape, 16);

// botella de detergente de plástico: cuerpo de color, tapa a presión, etiqueta lisa clara (sin letras)
export const SoapBottle: React.FC<{ col?: string; cap?: string; s?: number; lab?: string; liq?: number }> = ({ col = "#3fa35a", cap = "#f4f1ea", s = 1, lab = "#f6f2e6", liq = 1 }) =>
  <group scale={s}>
    <mesh geometry={soapG}><meshPhysicalMaterial color={col} roughness={0.25} clearcoat={0.8} transmission={0.25} thickness={0.03} transparent opacity={0.92} /></mesh>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0365, 0.0365, 0.06 * liq + 0.001, 40, 1, true]} /><meshStandardMaterial color={lab} roughness={0.7} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.192, 0]}><cylinderGeometry args={[0.013, 0.014, 0.026, 20]} /><meshStandardMaterial color={cap} roughness={0.4} /></mesh>
    <mesh position={[0, 0.208, 0.004]}><cylinderGeometry args={[0.004, 0.005, 0.01, 10]} /><meshStandardMaterial color={cap} roughness={0.4} /></mesh>
  </group>;

// hoja de rosal con nervadura; dull = 0..1 (verde sano → marrón quemado)
export const Leaf: React.FC<{ s?: number; col?: string; dull?: number }> = ({ s = 1, col = "#3f7d2a", dull = 0 }) => {
  const c = new THREE.Color(col).lerp(new THREE.Color("#8a5a2a"), dull);
  return <group scale={s}>
    <mesh geometry={leafG}><meshStandardMaterial color={c} roughness={0.55} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.05, 0.0008]}><boxGeometry args={[0.002, 0.095, 0.001]} /><meshStandardMaterial color={c.clone().offsetHSL(0, 0, 0.12)} /></mesh>
  </group>;
};

// pulgón: cuerpito verde en gota con patas finitas
export const Aphid: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = "#8fcf4a" }) => <group scale={s}>
  <mesh scale={[1, 0.8, 1.35]}><sphereGeometry args={[0.004, 10, 8]} /><meshPhysicalMaterial color={col} roughness={0.2} clearcoat={0.8} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.003, -0.002, 0]} rotation={[0, 0, sd * 0.9]}><cylinderGeometry args={[0.0004, 0.0004, 0.005, 4]} /><meshStandardMaterial color="#4a6a2a" /></mesh>)}
</group>;

// hormiga negra: tres segmentos y seis patas que se mueven con step
export const Ant: React.FC<{ s?: number; step?: number; col?: string }> = ({ s = 1, step = 0, col = "#1a1310" }) => <group scale={s}>
  {[[-0.006, 0.0032], [0, 0.0022], [0.0055, 0.0028]].map(([x, r], i) => <mesh key={i} position={[x, 0.003, 0]} scale={[1.3, 1, 1]}><sphereGeometry args={[r, 10, 8]} /><meshPhysicalMaterial color={col} roughness={0.25} clearcoat={1} /></mesh>)}
  {[-0.003, 0, 0.003].map((x, i) => [-1, 1].map((sd) => <mesh key={i + "" + sd} position={[x, 0.0015, sd * 0.003]} rotation={[sd * 1.1, Math.sin(step * 12 + i * 2 + sd) * 0.5, 0]}><cylinderGeometry args={[0.0003, 0.0003, 0.007, 4]} /><meshStandardMaterial color={col} /></mesh>))}
</group>;

// mosquita de la fruta: cuerpo ámbar, ojos rojos, alas de vidrio que vibran
export const Fly: React.FC<{ s?: number; t?: number; wings?: boolean }> = ({ s = 1, t = 0, wings = true }) => <group scale={s}>
  <mesh scale={[1.4, 1, 1]}><sphereGeometry args={[0.003, 10, 8]} /><meshStandardMaterial color="#b0782e" roughness={0.5} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[0.0035, 0.0008, sd * 0.0017]}><sphereGeometry args={[0.0013, 8, 6]} /><meshStandardMaterial color="#b2221a" roughness={0.4} /></mesh>)}
  {wings && [-1, 1].map((sd) => <mesh key={"w" + sd} position={[-0.001, 0.0025, sd * 0.003]} rotation={[PI / 2 + sd * (0.3 + 0.4 * Math.sin(t * 90)), 0, 0]}><planeGeometry args={[0.006, 0.004]} />{M.glass({ op: 0.45 })}</mesh>)}
</group>;

// mariquita: caparazón rojo con puntos negros
export const Ladybug: React.FC<{ s?: number }> = ({ s = 1 }) => <group scale={s}>
  <mesh scale={[1, 0.6, 1.15]}><sphereGeometry args={[0.008, 20, 14, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#c8201a" roughness={0.15} clearcoat={1} /></mesh>
  <mesh position={[0, 0.001, 0.0085]} scale={[1, 0.7, 0.8]}><sphereGeometry args={[0.0042, 12, 8]} /><meshStandardMaterial color="#141210" /></mesh>
  {[[0.004, 0.002], [-0.004, 0.002], [0.003, -0.004], [-0.003, -0.004]].map(([x, z], i) => <mesh key={i} position={[x, 0.0045, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.0016, 10]} /><meshStandardMaterial color="#141210" /></mesh>)}
</group>;

// pimpollo de rosa sobre el tallo: open = 0 cerrado, 1 abierto
export const RoseBud: React.FC<{ s?: number; open?: number; col?: string }> = ({ s = 1, open = 0, col = "#e0667a" }) => <group scale={s}>
  <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.0025, 0.003, 0.1, 8]} /><meshStandardMaterial color="#3c6a28" /></mesh>
  {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0.006, 0]} rotation={[0.25 + open * 0.7, i * PI / 3, 0]}><sphereGeometry args={[0.014, 14, 10, 0, PI / 2.2, 0, PI / 2]} /><meshPhysicalMaterial color={col} roughness={0.45} sheen={0.6} side={THREE.DoubleSide} /></mesh>)}
  <mesh position={[0, 0.005, 0]}><sphereGeometry args={[0.009, 14, 10]} /><meshPhysicalMaterial color={col} roughness={0.45} /></mesh>
</group>;
