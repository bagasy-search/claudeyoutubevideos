// lfh29b · piezas propias del video de las latas de café: la lata con aros, el botón de cuatro agujeros, el huevo y la mano simple.
import React from "react";
import * as THREE from "three";
import { M, tex } from "./h3d";

const PI = Math.PI;

// lata de café de chapa: cuerpo pintado, aros de refuerzo y tapa opcional (lid 0..1 = levantada)
export const Can: React.FC<{ r?: number; h?: number; col?: string; band?: string; lid?: number; open?: boolean; side?: boolean }> = ({ r = 0.06, h = 0.15, col = "#a8322a", band = "#e9dcc0", lid = -1, open = true, side = false }) => {
  const tx = tex.text("canb" + col + band, 512, 128, (g) => { g.fillStyle = col; g.fillRect(0, 0, 512, 128); g.fillStyle = band; g.fillRect(0, 44, 512, 40); g.fillStyle = col; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(32 + i * 64, 64, 9, 0, 6.3); g.fill(); } });
  return <group>
    <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[r, r, h, 48, 1, open]} /><meshStandardMaterial map={tx} metalness={0.45} roughness={0.38} side={side ? THREE.DoubleSide : THREE.FrontSide} /></mesh>
    {open && <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[r * 0.985, r * 0.985, h, 48, 1, true]} />{M.steel({ col: "#b9bcbf", side: THREE.BackSide })}</mesh>}
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r, 40]} />{M.steel({ col: "#a5a8ab" })}</mesh>
    {[0.006, h * 0.33, h * 0.66, h - 0.004].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r + 0.0012, 0.0022, 6, 48]} />{M.steel({ col: "#c4c7ca" })}</mesh>)}
    {lid >= 0 && <group position={[0, h + 0.004 + lid * 0.12, 0]} rotation={[lid * 0.5, 0, 0]}>
      <mesh><cylinderGeometry args={[r + 0.003, r + 0.003, 0.01, 48]} /><meshStandardMaterial color={col} metalness={0.4} roughness={0.4} /></mesh>
    </group>}
  </group>;
};

// botón de camisa: disco con borde y cuatro agujeros
export const Button: React.FC<{ r?: number; col?: string; holes?: number }> = ({ r = 0.012, col = "#f2efe6", holes = 4 }) => <group>
  <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[r, r, r * 0.28, 28]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.7} /></mesh>
  <mesh position={[0, r * 0.15, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r * 0.88, r * 0.1, 6, 28]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.7} /></mesh>
  {Array.from({ length: holes }, (_, i) => { const a = (i / holes) * 2 * PI + PI / 4; return <mesh key={i} position={[Math.cos(a) * r * 0.3, r * 0.145, Math.sin(a) * r * 0.3]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[r * 0.12, 10]} /><meshBasicMaterial color="#1c1814" /></mesh>; })}
</group>;

// huevo (marrón de granja por defecto)
export const Egg: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = "#c98d5a" }) => <mesh scale={[s, s * 1.3, s]} castShadow><sphereGeometry args={[0.022, 24, 18]} /><meshPhysicalMaterial color={col} roughness={0.55} clearcoat={0.2} /></mesh>;

// moneda: cara de cobre (penny) o plateada
export const Coin: React.FC<{ r?: number; col?: string }> = ({ r = 0.012, col = "#c9cbcf" }) => <group>
  <mesh castShadow><cylinderGeometry args={[r, r, r * 0.14, 32]} /><meshStandardMaterial color={col} metalness={0.9} roughness={0.3} /></mesh>
  <mesh rotation={[PI / 2, 0, 0]} position={[0, r * 0.07, 0]}><torusGeometry args={[r * 0.9, r * 0.05, 4, 32]} /><meshStandardMaterial color={col} metalness={0.9} roughness={0.25} /></mesh>
</group>;

// mano simple de abuela (palma + cuatro dedos + pulgar), mira hacia -z; curl 0..1 cierra los dedos
export const Hand: React.FC<{ curl?: number; col?: string }> = ({ curl = 0, col = "#e7b392" }) => {
  const mat = <meshPhysicalMaterial color={col} roughness={0.55} sheen={0.3} />;
  return <group>
    <mesh scale={[1, 0.42, 1.15]}><sphereGeometry args={[0.04, 22, 16]} />{mat}</mesh>
    {[-0.027, -0.009, 0.009, 0.026].map((x, i) => <group key={i} position={[x, 0, -0.04]} rotation={[-curl * 1.3, 0, 0]}>
      <mesh position={[0, 0, -0.022 + Math.abs(i - 1.5) * 0.003]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0085, 0.032 - Math.abs(i - 1.5) * 0.004, 6, 12]} />{mat}</mesh>
    </group>)}
    <group position={[0.04, -0.004, -0.008]} rotation={[0, -0.7 - curl * 0.4, 0]}><mesh position={[0, 0, -0.02]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0095, 0.026, 6, 12]} />{mat}</mesh></group>
    <mesh position={[0, 0, 0.05]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.033, 0.06, 18]} />{mat}</mesh>
  </group>;
};
