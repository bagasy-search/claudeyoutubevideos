// apa30b · piezas del granero para los componentes: el balde con la lata que rueda (rolling log), rampa, bosta, bolsa de alimento.
import React from "react";
import * as THREE from "three";
import { M, RBox, tubeG, rn } from "./h3d";
import { Rodent, barnT } from "./farmkit";

type V = [number, number, number];
const PI = Math.PI;
export const RIM = 0.34, BR = 0.15;

// balde de 5 galones; op < 1 = se ve adentro (corte de vidrio esmerilado, no fantasma)
export const TBucket: React.FC<{ p?: V; s?: number; op?: number; col?: string; lid?: number }> = ({ p = [0, 0, 0], s = 1, op = 1, col = "#ecebe4", lid = 0 }) => <group position={p} scale={s}>
  <mesh position={[0, RIM / 2, 0]} castShadow={op > 0.9} receiveShadow><cylinderGeometry args={[BR, 0.125, RIM, 48, 1, true]} />
    <meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.5} transparent={op < 1} opacity={op} side={THREE.DoubleSide} depthWrite={op > 0.9} /></mesh>
  <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.125, 0.125, 0.006, 40]} />{M.pvc({ col })}</mesh>
  <mesh position={[0, RIM, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[BR + 0.001, 0.008, 8, 48]} />{M.pvc({ col })}</mesh>
  {[0.08, 0.2].map((y) => <mesh key={y} position={[0, RIM - y * 0.25, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[BR - 0.004 - y * 0.02, 0.003, 6, 48]} />{M.pvc({ col, op })}</mesh>)}
  {/* asa de alambre */}
  <mesh geometry={tubeG("asa", [[-BR, RIM - 0.03, 0], [-0.1, RIM + 0.1, 0], [0, RIM + 0.13, 0], [0.1, RIM + 0.1, 0], [BR, RIM - 0.03, 0]], 0.003, 40, 6)}>{M.steel()}</mesh>
  {lid > 0 && <mesh position={[0, RIM + 0.012 + 0.25 * (1 - lid), 0]} rotation={[0.4 * (1 - lid), 0, 0]} castShadow><cylinderGeometry args={[BR + 0.012, BR + 0.012, 0.022, 48]} />{M.pvc({ col: "#e9e6dc" })}</mesh>}
</group>;

// lata de gaseosa acostada en el alambre, a una pulgada del borde; spin = vueltas; pb = manteca de maní (0-1); tape = cinta en las puntas
export const SodaCan: React.FC<{ y?: number; spin?: number; pb?: number; licked?: number; tape?: number; wire?: boolean; col?: string }> = ({ y = RIM - 0.024, spin = 0, pb = 0, licked = 0, tape = 0, wire = true, col = "#b8352a" }) => <group position={[0, y, 0]}>
  {wire && <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0016, 0.0016, 2 * BR + 0.03, 6]} />{M.steel()}</mesh>}
  <group rotation={[spin * 2 * PI, 0, 0]}><group rotation={[0, 0, PI / 2]}>
    <mesh castShadow><cylinderGeometry args={[0.033, 0.033, 0.122, 40]} /><meshStandardMaterial color={col} metalness={0.6} roughness={0.32} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[0, sd * 0.062, 0]}><cylinderGeometry args={[0.028, 0.033, 0.006, 40]} />{M.chrome()}</mesh>)}
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.0332, 0.0332, 0.012, 40, 1, true]} /><meshStandardMaterial color="#f2efe6" metalness={0.4} roughness={0.4} /></mesh>
    {pb > 0 && <mesh><cylinderGeometry args={[0.0345, 0.0345, 0.045 * pb * (1 - 0.85 * licked), 40, 1, true]} /><meshPhysicalMaterial color="#a8692e" roughness={0.55} clearcoat={0.3} side={THREE.DoubleSide} /></mesh>}
  </group></group>
  {tape > 0 && [-1, 1].map((sd) => <RBox key={sd} s={[0.012, 0.03, 0.026]} p={[sd * (BR - 0.004), 0.004 + (1 - tape) * 0.08, (1 - tape) * 0.05 * sd]} rot={[0, 0, (1 - tape) * sd]} r={0.002}><meshStandardMaterial color="#e8dcb0" roughness={0.8} transparent opacity={tape} /></RBox>)}
</group>;

// rampa de tabla rústica apoyada en el borde: len = largo, ang = inclinación
export const Ramp: React.FC<{ p?: V; ry?: number; len?: number; ang?: number; show?: number }> = ({ p = [0.42, 0, 0], ry = 0, len = 0.5, ang = 0.75, show = 1 }) => <group position={p} rotation={[0, ry, 0]}>
  <group rotation={[0, 0, -ang]} scale={[show, 1, 1]}><RBox s={[len, 0.016, 0.075]} p={[-len / 2, 0.008, 0]} r={0.003}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox></group>
</group>;

// ratones adentro del balde, apilados en el fondo (n hasta 31)
export const MicePile: React.FC<{ n: number; tt: number; deer?: number; r?: number }> = ({ n, tt, deer = 0, r = 0.1 }) => <>
  {Array.from({ length: Math.max(0, Math.floor(n)) }, (_, i) => {
    const a = i * 2.39996, rr = r * Math.sqrt((i + 0.5) / 31), lay = Math.floor(i / 12);
    return <Rodent key={i} p={[rr * Math.cos(a), 0.006 + lay * 0.03, rr * Math.sin(a)]} rot={[0, a + 1.2 + 0.3 * Math.sin(tt * 1.5 + i), 0]} s={0.62} deer={rn(i, 9) < deer} walk={tt * 0.4 + rn(i, 2)} />;
  })}
</>;

// bosta de ratón: granitos negros alargados
export const Droppings: React.FC<{ n?: number; c?: V; spread?: number[]; seed?: number; wet?: number }> = ({ n = 24, c = [0, 0, 0], spread = [0.2, 0.05], seed = 1, wet = 0 }) => <group position={c}>
  {Array.from({ length: n }, (_, i) => <mesh key={i} position={[(rn(i, seed) - 0.5) * spread[0], 0.003, (rn(i, seed + 1) - 0.5) * spread[1]]} rotation={[0, rn(i, seed + 2) * PI, PI / 2]} scale={[1, 1, 1]}>
    <capsuleGeometry args={[0.0025, 0.006, 3, 6]} /><meshPhysicalMaterial color={new THREE.Color("#2a1e14").lerp(new THREE.Color("#120c08"), wet).getStyle()} roughness={0.8 - 0.65 * wet} clearcoat={wet} /></mesh>)}
</group>;

// bolsa de alimento de arpillera con agujeros de mordida (bite 0-1)
export const FeedSack: React.FC<{ p?: V; bite?: number; s?: number }> = ({ p = [0, 0, 0], bite = 0, s = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.26, 0.36, 0.16]} p={[0, 0.18, 0]} r={0.05}><meshStandardMaterial color="#c2a777" roughness={1} /></RBox>
  <RBox s={[0.27, 0.05, 0.17]} p={[0, 0.34, 0]} r={0.02}><meshStandardMaterial color="#a88c5c" roughness={1} /></RBox>
  {bite > 0 && [0, 1, 2].map((i) => <group key={i}>
    <mesh position={[-0.06 + i * 0.05, 0.05 + 0.02 * i, 0.081]}><circleGeometry args={[0.018 * Math.min(1, bite * 3 - i), 14]} /><meshStandardMaterial color="#1a120a" /></mesh>
    {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[-0.07 + i * 0.05 + rn(j + i * 7, 3) * 0.05, 0.004, 0.11 + rn(j, 4) * 0.06]}><sphereGeometry args={[0.004, 6, 4]} /><meshStandardMaterial color="#d7b56a" /></mesh>)}
  </group>)}
</group>;

// lata de metal galvanizada con tapa (para el alimento)
export const MetalCan: React.FC<{ p?: V; lid?: number; s?: number }> = ({ p = [0, 0, 0], lid = 1, s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.15, 0.14, 0.4, 48]} /><meshStandardMaterial color="#b9bfc4" metalness={0.85} roughness={0.38} /></mesh>
  {[0.08, 0.2, 0.32].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.147, 0.005, 6, 48]} />{M.steel()}</mesh>)}
  <group position={[0, 0.41 + 0.3 * (1 - lid), 0.1 * (1 - lid)]} rotation={[-0.5 * (1 - lid), 0, 0]}>
    <mesh castShadow><cylinderGeometry args={[0.158, 0.158, 0.03, 48]} /><meshStandardMaterial color="#c4c9ce" metalness={0.85} roughness={0.32} /></mesh>
    <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.08, 0.012, 0.02]} />{M.steel()}</mesh>
  </group>
</group>;

// lechuza (maqueta): cuerpo pera, disco facial claro, ojos negros
export const Owl: React.FC<{ p?: V; rot?: V; s?: number; blink?: number; wing?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, blink = 0, wing = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[0.09, 0.13, 0.085]} position={[0, 0.13, 0]} castShadow><sphereGeometry args={[1, 28, 20]} /><meshStandardMaterial color="#b88a52" roughness={0.9} /></mesh>
  <mesh scale={[0.075, 0.075, 0.03]} position={[0, 0.2, 0.06]}><sphereGeometry args={[1, 28, 16]} /><meshStandardMaterial color="#f4ead6" roughness={0.9} /></mesh>
  {[-1, 1].map((sd) => <group key={sd}>
    <mesh position={[sd * 0.028, 0.205, 0.085]} scale={[1, 1 - 0.9 * blink, 1]}><sphereGeometry args={[0.013, 14, 10]} />{M.porcelain({ col: "#0b0b0b" })}</mesh>
    <mesh position={[sd * 0.085, 0.13, -0.005]} rotation={[0, 0, sd * (0.15 + 1.1 * wing)]} scale={[0.02, 0.1, 0.07]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#8f6a3e" roughness={0.9} /></mesh>
  </group>)}
  <mesh position={[0, 0.18, 0.09]} rotation={[PI, 0, 0]}><coneGeometry args={[0.008, 0.022, 8]} /><meshStandardMaterial color="#d8b25a" /></mesh>
</group>;

// pájaro chico (gorrión) para el «se puede soltar»
export const Bird: React.FC<{ p?: V; rot?: V; s?: number; flap?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, flap = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[0.03, 0.028, 0.05]} position={[0, 0.03, 0]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#4f74b8" roughness={0.6} /></mesh>
  <mesh scale={[0.024, 0.02, 0.03]} position={[0, 0.022, 0.018]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#e08a3c" roughness={0.7} /></mesh>
  <mesh position={[0, 0.05, 0.04]}><sphereGeometry args={[0.02, 16, 12]} /><meshStandardMaterial color="#3d5f9e" roughness={0.6} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.012, 0.055, 0.056]}><sphereGeometry args={[0.0035, 8, 6]} /><meshStandardMaterial color="#0a0a0a" roughness={0.2} /></mesh>)}
  <mesh position={[0, 0.048, 0.064]} rotation={[PI / 2, 0, 0]}><coneGeometry args={[0.005, 0.016, 6]} /><meshStandardMaterial color="#2a2018" /></mesh>
  <mesh position={[0, 0.036, -0.06]} rotation={[-1.9, 0, 0]} scale={[1, 1, 0.25]}><coneGeometry args={[0.018, 0.05, 4]} /><meshStandardMaterial color="#3d5f9e" roughness={0.6} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.03, 0.04, 0]} rotation={[0, 0, sd * (0.2 + 1.2 * flap)]} scale={[0.045, 0.006, 0.035]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#3a5a9a" roughness={0.6} /></mesh>)}
</group>;
