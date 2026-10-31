// lfh29c · piezas propias del video de los 13 productos de limpieza: botella de vidrio, frasco de conserva, caja de bicarbonato, medio limón, jarra de un galón, trapo.
import React from "react";
import * as THREE from "three";
import { M, tex } from "./h3d";

const PI = Math.PI;
const bottleG = new THREE.LatheGeometry([[0, 0], [0.034, 0], [0.036, 0.004], [0.036, 0.12], [0.03, 0.15], [0.013, 0.18], [0.012, 0.22], [0.013, 0.225], [0, 0.225]].map(([x, y]) => new THREE.Vector2(x, y)), 40);
const liquidG = (k: number) => new THREE.LatheGeometry([[0, 0.004], [0.033, 0.004], [0.033, 0.004 + 0.13 * k], [0, 0.004 + 0.13 * k]].map(([x, y]) => new THREE.Vector2(x, y)), 32);

// botella de vidrio de vinagre (o lo que sea): vidrio, líquido hasta fill, tapa y etiqueta de papel sin letras
export const Bottle: React.FC<{ fill?: number; liq?: string; cap?: string; label?: string; s?: number }> = ({ fill = 0.85, liq = "#f2ead0", cap = "#c8281e", label = "#efe3c4", s = 1 }) => <group scale={s}>
  <mesh geometry={bottleG}>{M.glass({ op: 0.3 })}</mesh>
  {fill > 0.01 && <mesh geometry={liquidG(fill)}><meshPhysicalMaterial color={liq} roughness={0.1} transparent opacity={0.75} /></mesh>}
  <mesh position={[0, 0.231, 0]}><cylinderGeometry args={[0.015, 0.015, 0.016, 20]} />{M.plastic({ col: cap })}</mesh>
  <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0368, 0.0368, 0.06, 40, 1, true]} /><meshStandardMaterial color={label} roughness={0.9} /></mesh>
</group>;

// frasco de conserva con tapa de rosca
export const Jar: React.FC<{ fill?: number; liq?: string; lid?: number; s?: number; children?: React.ReactNode }> = ({ fill = 0, liq = "#f2ead0", lid = 0, s = 1, children }) => <group scale={s}>
  <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.055, 0.055, 0.15, 40, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
  <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.055, 40]} />{M.glass({ op: 0.3 })}</mesh>
  {fill > 0.01 && <mesh position={[0, 0.004 + 0.07 * fill, 0]}><cylinderGeometry args={[0.052, 0.052, 0.14 * fill, 36]} /><meshPhysicalMaterial color={liq} roughness={0.1} transparent opacity={0.6} depthWrite={false} /></mesh>}
  {children}
  <group position={[0, 0.158 + lid * 0.1, lid * 0.05]} rotation={[lid * 0.6, 0, 0]}>
    <mesh><cylinderGeometry args={[0.058, 0.058, 0.018, 40]} /><meshStandardMaterial color="#c9a43a" metalness={0.8} roughness={0.3} /></mesh>
  </group>
</group>;

// caja de bicarbonato: cartón naranja con una franja crema; open 0..1 levanta la solapa
export const SodaBox: React.FC<{ open?: number; s?: number }> = ({ open = 0, s = 1 }) => {
  const t = tex.text("sodabox", 256, 256, (g) => { g.fillStyle = "#e8742a"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#f6e6c4"; g.fillRect(0, 96, 256, 64); g.fillStyle = "#b8461a"; g.beginPath(); g.arc(128, 128, 22, 0, 6.3); g.fill(); });
  return <group scale={s}>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.07, 0.12, 0.045]} /><meshStandardMaterial map={t} roughness={0.85} /></mesh>
    <group position={[0, 0.12, -0.0225]} rotation={[-open * 1.9, 0, 0]}><mesh position={[0, 0, 0.0225]}><boxGeometry args={[0.07, 0.003, 0.045]} /><meshStandardMaterial color="#e8742a" roughness={0.85} /></mesh></group>
    {open > 0.3 && <mesh position={[0, 0.119, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.066, 0.041]} /><meshStandardMaterial color="#fbfaf5" roughness={1} /></mesh>}
  </group>;
};

// medio limón: cáscara, la pulpa con gajos hacia +y
export const Lemon: React.FC<{ s?: number; salt?: number }> = ({ s = 1, salt = 0 }) => {
  const pulp = tex.text("lemonpulp", 256, 256, (g) => { g.fillStyle = "#f7f1c8"; g.beginPath(); g.arc(128, 128, 126, 0, 6.3); g.fill(); g.fillStyle = "#f2d64a"; g.beginPath(); g.arc(128, 128, 112, 0, 6.3); g.fill(); g.strokeStyle = "#fbf4cf"; g.lineWidth = 6; for (let i = 0; i < 10; i++) { const a = i * PI / 5; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); } });
  return <group scale={s}>
    <mesh scale={[1, 0.8, 1]}><sphereGeometry args={[0.045, 32, 16, 0, PI * 2, PI / 2, PI / 2]} /><meshPhysicalMaterial color="#f2c81e" roughness={0.45} clearcoat={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.0005, 0]}><circleGeometry args={[0.045, 40]} /><meshStandardMaterial map={pulp} roughness={0.35} /></mesh>
    {salt > 0 && Array.from({ length: 40 }, (_, i) => { const a = i * 2.4, r = 0.04 * Math.sqrt((i + 0.5) / 40); return <mesh key={i} visible={i / 40 < salt} position={[Math.cos(a) * r, 0.002, Math.sin(a) * r]}><boxGeometry args={[0.004, 0.003, 0.004]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>; })}
  </group>;
};

// jarra de un galón de plástico translúcido con asa
export const Jug: React.FC<{ fill?: number; liq?: string; cap?: string; s?: number }> = ({ fill = 0.9, liq = "#f2ead0", cap = "#c8281e", s = 1 }) => <group scale={s}>
  <mesh position={[0, 0.11, 0]}><boxGeometry args={[0.15, 0.22, 0.15]} /><meshPhysicalMaterial color="#f4f1e8" roughness={0.35} transparent opacity={0.45} depthWrite={false} /></mesh>
  <mesh position={[0, 0.005 + 0.105 * fill, 0]}><boxGeometry args={[0.144, 0.21 * fill, 0.144]} /><meshPhysicalMaterial color={liq} roughness={0.2} transparent opacity={0.6} depthWrite={false} /></mesh>
  <mesh position={[0.04, 0.245, 0]}><cylinderGeometry args={[0.022, 0.03, 0.05, 24]} /><meshPhysicalMaterial color="#f4f1e8" roughness={0.35} transparent opacity={0.6} /></mesh>
  <mesh position={[0.04, 0.275, 0]}><cylinderGeometry args={[0.024, 0.024, 0.02, 24]} />{M.plastic({ col: cap })}</mesh>
  <mesh position={[-0.045, 0.24, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.03, 0.009, 8, 20, PI]} /><meshPhysicalMaterial color="#f4f1e8" roughness={0.35} transparent opacity={0.7} /></mesh>
</group>;

// trapo de algodón a cuadros (col = color de la línea)
export const Rag: React.FC<{ w?: number; d?: number; col?: string; key2?: string }> = ({ w = 0.12, d = 0.1, col = "#2d5d9a", key2 = "a" }) => <mesh>
  <boxGeometry args={[w, 0.014, d]} />
  <meshStandardMaterial roughness={0.95} map={tex.text("ragc" + col + key2, 128, 128, (g) => { g.fillStyle = "#f4efe6"; g.fillRect(0, 0, 128, 128); g.fillStyle = col; g.globalAlpha = 0.7; for (let i = 0; i < 128; i += 24) { g.fillRect(i, 0, 10, 128); g.fillRect(0, i, 128, 10); } })} />
</mesh>;
