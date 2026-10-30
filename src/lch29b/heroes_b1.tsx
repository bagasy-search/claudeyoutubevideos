// lch29b · componentes únicos 1-7 (alfombra con pelo real que se aplasta y se levanta, cámara que orbita en curva).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Coin, Fork, IceCube, Iron, LEGS, Pile, Recliner, Steam, Towel, dent } from "./rug";

const PI = Math.PI;
void Coin;

// ---- 0:05 · CUATRO CRÁTERES: el sillón de Harold se levanta y se corre; debajo, los cuatro pozos hondos en el pelo beige ----
export const HReclinerLift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" key1={[-1.4, 1.0, 0.9]}
  cam={{ at: [0.05, 0.14, 0.02], az: [0.45, 0.3], el: [0.34, 0.42], r: [1.6, 1.3], fov: 32 }}>{(tt) => {
  const lift = phys(tt, 0.5, 5, 0.6), slide = eio(tt, 1.3, 2.8), tilt = eio(tt, 0.5, 1.3) * (1 - slide);
  return <>
    <Pile w={0.9} d={0.7} tt={tt} sq={(x, z) => Math.max(...LEGS.map(([lx, lz]) => dent(x, z, lx, lz, 0.05)))} />
    <group position={[-0.62 * slide, 0.04 * tilt, -0.1 * slide]} rotation={[0, 0.35 * slide, 0.06 * tilt]}><Recliner /></group>
    {/* sombra dentro de cada pozo (luz rasante) */}
    {LEGS.map(([x, z], i) => <mesh key={i} position={[x + 0.006, 0.0015, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.04, 24]} /><meshBasicMaterial color="#2b2216" transparent opacity={0.6 * slide} depthWrite={false} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 0:20 · UN TRACTOR EN LA SALA: un tractor verde de juguete cruza la alfombra y deja dos huellas hundidas ----
export const HTractor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#17140f"
  cam={{ at: [-0.3, 0.03, 0], at1: [0.22, 0.03, 0], az: [-0.45, -0.3], el: [0.3, 0.36], r: [0.8, 0.72], fov: 32 }}>{(tt) => {
  const x = lerp(-0.6, 0.3, eio(tt, 0.4, 4.6));
  const G = <meshPhysicalMaterial color="#2f8a3a" roughness={0.3} clearcoat={0.8} />, Y = <meshPhysicalMaterial color="#f2c230" roughness={0.3} clearcoat={0.7} />, T = <meshStandardMaterial color="#1c1c1c" roughness={0.9} />;
  const sp = tt * 6;
  return <>
    <Pile w={1.2} d={0.6} tt={tt} sq={(px, pz) => (px < x - 0.06 ? Math.max(cl((0.04 - Math.abs(pz - 0.09)) / 0.01), cl((0.04 - Math.abs(pz + 0.09)) / 0.01)) : 0)} />
    <group position={[x, 0, 0]}>
      <RBox s={[0.16, 0.07, 0.1]} p={[0.02, 0.09, 0]} r={0.015}>{G}</RBox>
      <RBox s={[0.08, 0.1, 0.1]} p={[-0.06, 0.15, 0]} r={0.012}>{G}</RBox>
      <RBox s={[0.07, 0.06, 0.09]} p={[-0.06, 0.15, 0]} r={0.01}>{M.glass({ col: "#cfe8ff", op: 0.4 })}</RBox>
      <mesh position={[0.06, 0.16, 0.025]}><cylinderGeometry args={[0.006, 0.006, 0.07, 10]} /><meshStandardMaterial color="#333" /></mesh>
      {[-1, 1].map((s) => <group key={s}>
        <mesh position={[-0.06, 0.065, s * 0.09]} rotation={[PI / 2, 0, sp]} castShadow><cylinderGeometry args={[0.065, 0.065, 0.04, 28]} />{T}</mesh>
        <mesh position={[-0.06, 0.065, s * 0.112]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.004, 20]} />{Y}</mesh>
        <mesh position={[0.08, 0.035, s * 0.07]} rotation={[PI / 2, 0, sp * 1.8]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.025, 22]} />{T}</mesh>
        <mesh position={[0.08, 0.035, s * 0.084]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.017, 0.017, 0.004, 16]} />{Y}</mesh>
      </group>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 1:05 · TRES COSAS QUE YA TENÉS: el cubito, la plancha y el tenedor caen de a uno sobre la toalla blanca ----
export const HThreeTools: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.03, 0], az: [-0.25, 0.15], el: [0.62, 0.5], r: [0.78, 0.6], fov: 32 }}>{(tt) => {
  const a = phys(tt, 0.7, 9, 0.5), b = phys(tt, 2.0, 8, 0.45), c = phys(tt, 3.3, 10, 0.5);
  return <>
    <Pile w={1.0} d={0.7} tt={tt} />
    <group position={[0, 0.02, 0]}><Towel w={0.5} d={0.28} /></group>
    <group position={[-0.17, 0.047 + 0.4 * (1 - cl(a)), 0.02]} rotation={[0.3 * (1 - cl(a)), 0.4, 0]}><IceCube s={0.04} /></group>
    <group position={[0.02, 0.034 + 0.4 * (1 - cl(b)), -0.01]} rotation={[0, -0.3, 0.15 * (1 - cl(b))]}><Iron /></group>
    <group position={[0.19, 0.036 + 0.4 * (1 - cl(c)), 0.04]} rotation={[0, 0.9, 0]}><Fork /></group>
  </>;
}}</Scene3D>;

// ---- 1:50 · DOBLADAS, NO ROTAS: macro de la fibra: los mechones acostados como pelo de almohada, y uno se para ----
const fib = (k: number, bend: number) => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 10; i++) { const u = i / 10; const ang = bend * u * 1.5; pts.push(new THREE.Vector3(Math.sin(ang) * u * 0.14 * 0.8, Math.cos(ang) * u * 0.14, 0)); } return new THREE.CatmullRomCurve3(pts); };
const fibG: Record<string, THREE.TubeGeometry> = {};
const fibGeo = (bend: number) => { const k = bend.toFixed(2); return fibG[k] ?? (fibG[k] = new THREE.TubeGeometry(fib(0, bend), 24, 0.006, 8, false)); };
export const HBentFiber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a1712" key1={[-1.0, 1.2, 1.2]}
  cam={{ at: [0, 0.07, 0], az: [0.15, -0.1], el: [0.1, 0.16], r: [0.5, 0.44], fov: 32 }}>{(tt) => {
  const up = eio(tt, 2.6, 4.6);
  return <>
    <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.6]} /><meshStandardMaterial color="#8a7a5c" roughness={1} /></mesh>
    {Array.from({ length: 21 }, (_, i) => { const x = -0.3 + i * 0.03, inDent = Math.abs(x) < 0.13; const bend = inDent ? lerp(1.25, 0.05 + 0.1 * rn(i, 2), cl(up * 1.2 - Math.abs(x) * 2)) : 0.05 + 0.12 * rn(i, 3); return <group key={i} position={[x, 0, (rn(i, 4) - 0.5) * 0.06]} rotation={[0, (rn(i, 5) - 0.5) * 0.6, 0]}>
      <mesh geometry={fibGeo(Math.round(bend * 20) / 20)} castShadow><meshPhysicalMaterial color={inDent ? "#d8c49c" : "#cdb68a"} roughness={0.5} sheen={1} sheenColor="#fff2d0" /></mesh>
    </group>; })}
    {/* una gota de agua que baja a la raíz justo antes de que se paren */}
    {tt > 1.6 && tt < 2.7 && <mesh position={[0, lerp(0.2, 0.01, cl((tt - 1.6) / 1.0)), 0.02]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 16, 12]} />{M.water({ op: 0.85 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 2:15 · UN CUBITO POR POZO: el cubito se apoya en el centro del pozo y de a poco se derrite sobre el pelo ----
export const HIceCube: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" key1={[-1.2, 0.9, 1.0]}
  cam={{ at: [0, 0.02, 0], az: [0.6, 0.35], el: [0.45, 0.5], r: [0.42, 0.36], fov: 30 }}>{(tt) => {
  const drop = phys(tt, 0.5, 8, 0.5), melt = eio(tt, 2.2, 5.6);
  return <>
    <Pile w={0.6} d={0.5} tt={tt} sq={(x, z) => dent(x, z, 0, 0, 0.05)} wet={(x, z) => melt * dent(x, z, 0, 0, 0.05 + 0.02 * melt)} />
    <group position={[0, 0.006 + 0.016 * (1 - 0.85 * melt) + 0.3 * (1 - cl(drop)), 0]} rotation={[0, 0.5, 0.25 * (1 - cl(drop))]}><IceCube s={0.034} melt={melt} /></group>
    {melt > 0.05 && <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]} scale={0.3 + 0.9 * melt}><circleGeometry args={[0.045, 32]} />{M.water({ op: 0.4 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 2:35 · DE NOCHE, GOTA A GOTA: corte de la alfombra: el agua del hielo baja hasta la raíz y el pelo del pozo se para ----
const Cut: React.FC<{ tt: number; pad?: number; up: number; flood?: number }> = ({ tt, pad = 0, up, flood = 0 }) => <group>
  {/* capas: pelo / trama / bajo-alfombra / piso */}
  <mesh position={[0, -0.006, 0]}><boxGeometry args={[0.7, 0.008, 0.2]} /><meshStandardMaterial color="#9b8e76" roughness={1} /></mesh>
  <mesh position={[0, -0.028, 0]}><boxGeometry args={[0.7, 0.036, 0.2]} /><meshStandardMaterial color={new THREE.Color("#7aa07c").lerp(new THREE.Color("#3e5f7a"), pad)} roughness={1} /></mesh>
  <mesh position={[0, -0.056, 0]}><boxGeometry args={[0.72, 0.02, 0.22]} /><meshStandardMaterial map={tex.wood(2, 1, [120, 80, 46])} roughness={0.7} /></mesh>
  {flood > 0 && <mesh position={[0, -0.028, 0.101]}><planeGeometry args={[0.7 * flood, 0.036]} /><meshStandardMaterial color="#2d4f6e" transparent opacity={0.8} /></mesh>}
  <Pile w={0.7} d={0.2} step={0.012} h={0.04} r={0.005} tt={tt} sq={(x) => (Math.abs(x) < 0.12 ? 1 - up : 0)} wet={(x) => (Math.abs(x) < 0.12 ? up : 0)} />
</group>;
export const HMeltSoak: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15130f"
  cam={{ at: [0, 0.0, 0], az: [0.08, -0.08], el: [0.12, 0.18], r: [0.62, 0.56], fov: 32 }}>{(tt) => {
  const melt = eio(tt, 0.4, 3.2), up = eio(tt, 2.4, 5.4);
  return <>
    <Cut tt={tt} up={up} />
    <group position={[0, 0.03 + 0.02 * (1 - melt), 0]}><IceCube s={0.05} melt={melt} /></group>
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.8 + i / 8) % 1, on = tt > 0.5 && tt < 3.6; return on && <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.1, lerp(0.02, -0.004, ph), 0.08]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.004, 10, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 2:55 · LA TAZA DE GOLPE: la taza vuelca y el agua atraviesa todo hasta el bajo-alfombra, que se empapa a lo ancho ----
export const HCupFlood: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15130f"
  cam={{ at: [0, 0.06, 0], az: [-0.08, 0.08], el: [0.16, 0.2], r: [0.58, 0.52], fov: 32 }}>{(tt) => {
  const tip = eio(tt, 0.5, 1.2), pour = cl((tt - 1.0) / 0.4) * (1 - eio(tt, 2.4, 2.8)), soak = eio(tt, 1.4, 4.4);
  return <>
    <Cut tt={tt} up={0} pad={soak} flood={soak} />
    <group position={[0.03, 0.14, 0.0]} rotation={[0, 0, 1.9 * tip]}>
      <mesh><cylinderGeometry args={[0.04, 0.034, 0.09, 28, 1, true]} /><meshPhysicalMaterial color="#efe9de" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.05, 0, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.006, 10, 20]} /><meshPhysicalMaterial color="#efe9de" roughness={0.3} clearcoat={0.8} /></mesh>
    </group>
    {pour > 0 && Array.from({ length: 22 }, (_, i) => { const ph = (tt * 2.2 + i / 22) % 1; return <mesh key={i} position={[-0.03 - 0.03 * ph + (rn(i, 2) - 0.5) * 0.02 * ph, 0.11 - 0.11 * ph * ph, (rn(i, 3) - 0.5) * 0.02 * ph]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.006 + 0.004 * rn(i, 4), 10, 8]} />{M.water({ op: 0.85 * pour })}</mesh>; })}
    {soak > 0 && <mesh position={[-0.04, 0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={[0.2 + 1.8 * soak, 0.2 + 0.8 * soak, 1]}><circleGeometry args={[0.06, 32]} />{M.water({ op: 0.5 })}</mesh>}
    {/* el anillo marrón que queda */}
    {tt > 4.4 && <mesh position={[-0.04, 0.0025, 0]} rotation={[-PI / 2, 0, 0]} scale={[2, 1, 1]}><ringGeometry args={[0.105, 0.118, 48]} /><meshBasicMaterial color="#6e4a26" transparent opacity={0.7 * cl((tt - 4.4) * 2)} /></mesh>}
  </>;
}}</Scene3D>;
