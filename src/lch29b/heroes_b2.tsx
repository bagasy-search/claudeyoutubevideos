// lch29b · componentes únicos 8-14 (tenedor, berber, toalla, plancha).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Fork, Iron, Pile, Steam, Towel, dent } from "./rug";

const PI = Math.PI;

// ---- 3:20 · EL TENEDOR PEINA: pasadas cortas hacia uno y hacia el otro lado; detrás de cada pasada el pelo se para ----
export const HForkRake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" key1={[-1.2, 1.0, 1.0]}
  cam={{ at: [0, 0.03, 0], az: [0.4, 0.2], el: [0.5, 0.56], r: [0.5, 0.44], fov: 30 }}>{(tt) => {
  const stroke = Math.max(0, tt - 0.5) * 2.2, k = stroke % 1, n = Math.floor(stroke), dir = n % 2 ? -1 : 1;
  const lift = cl(stroke / 9);
  const fz = lerp(-0.05, 0.05, ((n * 0.37) % 1)), fx = dir * lerp(-0.07, 0.07, k);
  return <>
    <Pile w={0.6} d={0.45} tt={tt} sq={(x, z) => dent(x, z, 0, 0, 0.075) * (1 - lift * cl(1.4 - Math.abs(x) * 6))} />
    {tt > 0.4 && <group position={[fx, 0.02 + 0.012 * Math.sin(k * PI), fz]} rotation={[0, -PI / 2 + 0.2 * dir, -0.45]}><group scale={1.4}><Fork /></group></group>}
  </>;
}}</Scene3D>;

// ---- 3:35 · Y DE GOLPE SE PARA: cámara rasante; el pozo tarda... y de golpe todo el pelo salta con rebote ----
export const HFluffUp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16130f" key1={[-1.6, 0.25, 0.2]}
  cam={{ at: [0, 0.015, 0], az: [0.1, -0.15], el: [0.42, 0.48], r: [0.5, 0.44], fov: 30 }}>{(tt) => {
    const rub = eio(tt, 0.5, 0.9) * (1 - eio(tt, 2.0, 2.4));
  return <>
    <Pile w={0.7} d={0.5} tt={tt} sq={(x, z) => dent(x, z, 0, 0, 0.11) * (tt < 2.2 ? 1 - 0.06 * Math.sin(tt * 5) : Math.max(0, 1 - phys(tt, 2.2 + 5 * Math.hypot(x, z), 7, 0.32)))} />
    {rub > 0.01 && <group position={[0.03 * Math.sin(tt * 9), 0.03 + 0.15 * (1 - rub), 0.02]} rotation={[0, PI / 2, 0]}>
      {[0, 1].map((i) => <mesh key={i} position={[0, 0, (i - 0.5) * 0.024]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.011, 0.075, 8, 16]} /><meshStandardMaterial color="#e2b896" roughness={0.6} /></mesh>)}
    </group>}
  </>;
}}</Scene3D>;

// ---- 3:58 · EL BERBER SE ENGANCHA: alfombra de rulos; el tenedor clavado de punta saca un rulo largo ----
const LOOP = new THREE.TorusGeometry(0.009, 0.0028, 6, 14, PI);
export const HBerberSnag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.06, 0], az: [-0.35, -0.15], el: [0.3, 0.34], r: [0.55, 0.48], fov: 30 }}>{(tt) => {
  const jab = eio(tt, 0.6, 1.3), pull = eio(tt, 1.6, 3.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#8d8a84" roughness={1} /></mesh>
    {Array.from({ length: 30 * 24 }, (_, i) => { const ix = i % 30, iz = Math.floor(i / 30), x = -0.29 + ix * 0.02, z = -0.23 + iz * 0.02; const hit = ix === 15 && iz === 12; const L = hit ? 1 + 5 * pull : 1;
      return <mesh key={i} geometry={LOOP} position={[x, 0, z]} rotation={[0, (iz % 2) * 0.2, 0]} scale={[1, L, 1]}><meshStandardMaterial color={hit && pull > 0 ? "#b8b2a6" : rn(i, 2) > 0.5 ? "#a39d92" : "#bdb7ab"} roughness={1} /></mesh>; })}
    <group position={[0.01, lerp(0.16, 0.012, jab) + 0.06 * pull, 0]} rotation={[0, 0.4, -PI / 2 + 0.15]}><group scale={1.3}><Fork /></group></group>
  </>;
}}</Scene3D>;

// ---- 4:35 · LA TOALLA ROJA DESTIÑE: vapor por la toalla navideña y la mancha rosa se abre en la alfombra crema ----
export const HDyeBleed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.03, 0], az: [0.35, 0.15], el: [0.55, 0.62], r: [0.62, 0.55], fov: 32 }}>{(tt) => {
  const st = eio(tt, 0.6, 1.2) * (1 - eio(tt, 3.4, 3.8)), off = eio(tt, 3.6, 4.6), bleed = eio(tt, 1.2, 4.0);
  return <>
    <Pile w={0.9} d={0.7} tt={tt} col="#e6dcc4" />
    {/* la mancha rosa que se abre debajo */}
    <mesh position={[0, 0.026, 0]} rotation={[-PI / 2, 0, 0]} scale={0.3 + 0.9 * bleed}><circleGeometry args={[0.15, 40]} /><meshStandardMaterial color="#e48aa0" transparent opacity={0.55 * bleed} roughness={1} depthWrite={false} /></mesh>
    <group position={[0.4 * off, 0.024 + 0.08 * off, -0.1 * off]} rotation={[0, 0.2, 0]}><Towel w={0.3} d={0.2} col="#b8231f" stripe="#2f7a3a" wet={0.7} /></group>
    <group position={[0.02, 0.06 + 0.012 * Math.sin(tt * 3), 0]} rotation={[0, 0.4, 0]}><Iron hot={st} /></group>
    <Steam tt={tt} k={st} p={[0.02, 0.04, 0]} up={-0.2} spread={0.12} />
  </>;
}}</Scene3D>;

// ---- 5:20 · SIN APOYAR: vista al ras: entre la suela y la toalla queda un dedo de aire; el vapor baja por la toalla al pelo ----
export const HHover: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16130f" key1={[-1.2, 0.8, 1.0]}
  cam={{ at: [0, 0.04, 0], az: [0.05, -0.05], el: [0.04, 0.07], r: [0.46, 0.42], fov: 30 }}>{(tt) => {
  const down = eio(tt, 0.4, 1.4), st = eio(tt, 1.2, 1.8), rise = eio(tt, 2.4, 5.2);
  return <>
    <Pile w={0.8} d={0.4} tt={tt} sq={(x, z) => dent(x, z, 0, 0, 0.09) * (1 - rise)} wet={(x, z) => st * dent(x, z, 0, 0, 0.1)} />
    <group position={[0, 0.026 - 0.012 * (1 - rise) * dent(0, 0, 0, 0, 0.09), 0]}><Towel w={0.32} d={0.2} wet={0.6} /></group>
    <group position={[0, lerp(0.2, 0.062, down), 0]}><Iron hot={st} /></group>
    {/* el aire entre la suela y la toalla: una línea de luz */}
    {down > 0.95 && <mesh position={[0.01, 0.048, 0.07]}><planeGeometry args={[0.16, 0.004]} /><meshBasicMaterial color="#fff2d6" transparent opacity={0.8} /></mesh>}
    <Steam tt={tt} k={st} p={[0.01, 0.04, 0]} up={-0.15} spread={0.14} n={22} />
  </>;
}}</Scene3D>;

// ---- 5:55 · DERRITE EL PLÁSTICO: la plancha sin toalla; el pelo debajo se funde en una costra lisa y brillante ----
export const HMeltPatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#130f0c" key1={[-1.4, 0.7, 0.8]}
  cam={{ at: [0, 0.02, 0], az: [0.5, 0.3], el: [0.45, 0.55], r: [0.52, 0.46], fov: 30 }}>{(tt) => {
  const down = eio(tt, 0.4, 1.0), up = eio(tt, 2.8, 3.6), melt = eio(tt, 1.0, 2.8);
  const inSole = (x: number, z: number) => cl(1 - (Math.abs(z) / 0.045 + Math.max(0, (x - 0.02) / 0.085))) * (x > -0.07 ? 1 : 0);
  return <>
    <Pile w={0.7} d={0.5} tt={tt} col="#d8c9a6" sq={(x, z) => melt * (inSole(x, z) > 0.02 ? 1 : 0)} shine={(x, z) => (up > 0 && inSole(x, z) > 0.02 ? 1 : 0)} />
    {/* la costra fundida: plástico liso, brillante, con forma de suela */}
    {melt > 0.2 && <mesh position={[0.01, 0.006, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.05, 0.9, 1]}><circleGeometry args={[0.07, 3, -PI / 2]} /><meshPhysicalMaterial color="#cdbb92" roughness={0.05} clearcoat={1} transparent opacity={melt} /></mesh>}
    {melt > 0.2 && <mesh position={[-0.03, 0.0062, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.08, 0.09]} /><meshPhysicalMaterial color="#cdbb92" roughness={0.05} clearcoat={1} transparent opacity={melt} /></mesh>}
    <group position={[0, lerp(0.22, 0.004, down) + 0.2 * up, 0]}><Iron hot={1 - up} /></group>
    {/* humito acre */}
    <Steam tt={tt} k={melt * (1 - up * 0.7)} p={[0, 0.03, 0]} up={1.2} spread={0.1} n={12} />
  </>;
}}</Scene3D>;

// ---- 6:30 · DIEZ SEGUNDOS Y MIRÁ: el anillo del reloj se llena, la plancha sube, el pozo sube un poco; otra vuelta ----
export const HTenSec: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16130f"
  cam={{ at: [0, 0.05, 0], az: [-0.3, -0.1], el: [0.42, 0.46], r: [0.62, 0.56], fov: 32 }}>{(tt) => {
  const r1 = cl((tt - 0.4) / 2.0), up1 = eio(tt, 2.4, 2.9), r2 = cl((tt - 3.1) / 2.0), up2 = eio(tt, 5.1, 5.6);
  const look = (up1 > 0 && r2 === 0) || up2 > 0, ring = r2 > 0 ? r2 : r1;
  const lev = 1 - 0.45 * eio(tt, 2.4, 2.9) - 0.5 * eio(tt, 5.1, 5.6);
  return <>
    <Pile w={0.8} d={0.55} tt={tt} sq={(x, z) => dent(x, z, 0, 0, 0.08) * lev} />
    {!look && <group position={[0, 0.026, 0]}><Towel w={0.3} d={0.2} wet={0.6} /></group>}
    <group position={[0, look ? 0.2 : 0.062, 0]}><Iron hot={look ? 0 : 1} /></group>
    {/* el anillo de 10 marcas sobre el piso, alrededor */}
    <group position={[0, 0.03, 0]} rotation={[-PI / 2, 0, 0]}>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.sin(i / 10 * PI * 2) * 0.2, Math.cos(i / 10 * PI * 2) * 0.2, 0]} rotation={[0, 0, -i / 10 * PI * 2]}><boxGeometry args={[0.012, 0.03, 0.004]} />{M.glow({ col: i < Math.floor(ring * 10) + (ring >= 1 ? 1 : 0) ? "#ffb54a" : "#3a3328", op: 0.95 })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;
