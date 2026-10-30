// tdp29a · componentes 12-22 (hikikomori): el tren de las 8:12, el 80-50, la libreta del banco, Edogawa, la pandemia, Kenta.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Block, Can, Fig, House, Passbook, Shoji, TrainCar } from "./tkit3d";

// ---- 5:59 · LA MISMA CAMADA: filas de figuritas de traje negro avanzan juntas hacia la empresa bajo pétalos de abril ----
export const HSuits: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="none" bg="#1a1c22"
  cam={{ at: [0, 0.12, -0.1], az: [0.6, 0.3], el: [0.35, 0.25], r: [1.2, 1.0], fov: 32 }}>{(tt) => {
  const walk = 0.35 * eio(tt, 0.8, 5.5);
  return <>
    <group position={[0, 0, -0.62]} scale={pop(tt, 0.2)}>
      <RBox s={[0.9, 0.5, 0.2]} r={0.01} p={[0, 0.25, 0]}>{M.matte({ col: "#cfd3d8" })}</RBox>
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[-0.37 + (i % 8) * 0.105, 0.12 + Math.floor(i / 8) * 0.13, 0.101]}><planeGeometry args={[0.08, 0.09]} /><meshStandardMaterial color="#5e7a95" metalness={0.6} roughness={0.15} /></mesh>)}
      <Sheet map={txt("apr", ["APRIL 1"], { w: 384, h: 96, bg: "#f4efe3", fg: "#8a2a22", size: 64 })} w={0.24} h={0.06} p={[0, 0.54, 0.11]} />
    </group>
    {Array.from({ length: 30 }, (_, i) => { const x = -0.3 + (i % 6) * 0.12, z = 0.45 - Math.floor(i / 6) * 0.12 - walk, odd = i === 26;
      return <group key={i} position={[x, 0, odd ? 0.45 - Math.floor(i / 6) * 0.12 - Math.min(walk, 0.35 * eio(3.0, 0.8, 5.5)) + 0.2 * eio(tt, 3.6, 5.2) : z]} scale={(odd ? 1.0 : 0.75) * pop(tt, 0.1 + i * 0.03)}>
        {odd ? <mesh position={[0, 0.11, 0]}><sphereGeometry args={[0.12, 24, 16]} />{M.glow({ col: "#ffd59a", op: 0.22 * eio(tt, 3.0, 3.6) })}</mesh> : null}
        <Fig col={odd ? "#c9a27a" : "#2a2c33"} r={[0, odd ? PI * (1 - eio(tt, 3.0, 3.6)) : PI, 0]} head={odd ? 0.4 * eio(tt, 3.6, 4.5) : 0} />
      </group>; })}
    
  </>;
}}</Scene3D>;

// ---- 6:18 · NO HABÍA SEGUNDO TREN: el de las 8:12 llega, espera, la figurita no sube; el tren se va y el andén queda vacío ----
export const HTrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#151a22" lamp={[-0.2, 0.5, 0.3]}
  cam={{ at: [-0.05, 0.14, 0.05], az: [0.5, 0.3], el: [0.16, 0.14], r: [1.2, 1.05], fov: 32 }}>{(tt) => {
  const x = lerp(-2.6, -0.3, eio(tt, 0.2, 1.6)) + 2.8 * Math.pow(eio(tt, 3.4, 5.4), 1.6);
  return <>
    <RBox s={[1.8, 0.06, 0.3]} r={0.004} p={[0, 0.03, 0.2]}>{M.matte({ col: "#8d8f92" })}</RBox>
    <mesh position={[0, 0.061, 0.06]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.8, 0.02]} /><meshStandardMaterial color="#e6c84a" /></mesh>
    {[-0.07, 0.07].map((z, i) => <mesh key={i} position={[0, 0.005, -0.08 + z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 3, 8]} />{M.steel({})}</mesh>)}
    {[0, 1, 2].map((k) => <TrainCar key={k} p={[x + k * 0.82, 0.005, -0.08]} />)}
    <group position={[0.02, 0.06, 0.17]} rotation={[0, PI * 1.05, 0]} scale={1.5 * pop(tt, 0.3)}><Fig head={0.35 * eio(tt, 2.4, 3.2)} bow={0.15 * eio(tt, 2.4, 3.2)} /></group>
    <group position={[-0.32, 0.3, 0.3]} rotation={[0, 0.35, 0]} scale={pop(tt, 0.5)}>
      <RBox s={[0.2, 0.08, 0.03]} r={0.01}>{M.matte({ col: "#1b1d22" })}</RBox>
      <Sheet map={txt("812", ["8:12"], { w: 256, h: 100, bg: "#1b1d22", fg: "#ff9a3a", size: 80, font: "700 {s}px Courier New" })} w={0.18} h={0.07} p={[0, 0, 0.016]} />
      <mesh position={[0, -0.17, 0]}><cylinderGeometry args={[0.005, 0.005, 0.26, 8]} />{M.steel({})}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 6:54 · UNOS DÍAS, UNAS SEMANAS, AÑOS: la figurita baja la escalera; cada escalón es más tiempo y la puerta de atrás engorda ----
export const HSteps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#121315"
  cam={{ at: [-0.02, 0.2, 0], az: [-0.6, -0.35], el: [0.28, 0.22], r: [1.2, 1.08], fov: 32 }}>{(tt) => {
  const labs = ["A FEW DAYS", "A FEW WEEKS", "MONTHS", "YEARS"], k = cl((tt - 0.8) / 3.6) * 4, i = Math.min(3, Math.floor(k)), f = k - i;
  const sx = (j: number) => -0.3 + j * 0.2, sy = (j: number) => 0.3 - j * 0.07;
  return <>
    {labs.map((l, j) => <group key={j} scale={pop(tt, 0.2 + j * 0.15)}>
      <RBox s={[0.2, sy(j), 0.25]} r={0.006} p={[sx(j), sy(j) / 2, 0]}>{M.wood({ base: [110, 74, 44] })}</RBox>
      <Sheet map={txt("st" + j, [l], { w: 384, h: 120, bg: "#6e4a2c", fg: "#f6e7c8", size: 70 })} w={0.19} h={0.06} p={[sx(j), sy(j) / 2, 0.126]} />
    </group>)}
    <group position={[lerp(sx(i), sx(Math.min(3, i + 1)), i < 3 ? eio(f, 0.6, 1) : 0), sy(i) + (i < 3 ? 0.03 * Math.sin(PI * eio(f, 0.6, 1)) : 0), 0]} scale={1.2 * pop(tt, 0.5)}><Fig r={[0, PI / 2, 0]} /></group>
    <group position={[-0.55, 0, -0.05]} rotation={[0, PI / 2, 0]}>
      <Shoji s={0.55} light={0.15} />
      <RBox s={[0.6, 0.55, 0.02 + 0.2 * eio(tt, 0.8, 5)]} r={0.004} p={[0.25, 0.28, -0.03 - 0.1 * eio(tt, 0.8, 5)]}>{M.matte({ col: "#3a3530" })}</RBox>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:27 · EL 80-50: dos figuritas viejas, encorvadas, sostienen una tabla; arriba, sentado, el hijo de cincuenta ----
export const HParents: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" lamp={[0, 0.7, 0.3]}
  cam={{ at: [0, 0.29, 0], az: [-0.25, 0.25], el: [0.1, 0.16], r: [1.15, 1.02], fov: 30 }}>{(tt) => {
  const sag = 0.02 * eio(tt, 2.5, 5.5) + 0.004 * Math.sin(tt * 3);
  return <>
    {[-0.14, 0.14].map((x, i) => <group key={i} position={[x, 0, 0]} scale={1.5 * pop(tt, 0.2 + i * 0.2)}><Fig bow={0.45} arm={0.55} col="#8a6a4a" /></group>)}
    <group position={[0, 0.27 - sag, 0]} scale={pop(tt, 0.8)}>
      <RBox s={[0.5, 0.02, 0.14]} r={0.004}>{M.wood({ base: [150, 100, 60] })}</RBox>
      <group position={[0, -0.065, 0]} scale={1.5}><Fig sit={1} r={[0, 0.3, 0]} /></group>
    </group>
    {[["80", -0.32, 1.6], ["50", 0.32, 2.2]].map(([n, x, a]) => <group key={n as string} position={[(x as number) * 0.95, 0.14, 0.12]} scale={1.5 * pop(tt, a as number)}>
      <RBox s={[0.12, 0.08, 0.06]} r={0.01}>{M.brass({ col: "#b88a34" })}</RBox>
      {[0, 1].map((d) => <DigitDrum key={d} v={Number((n as string)[d]) * eio(tt, a as number, (a as number) + 1.2)} p={[-0.025 + d * 0.05, 0, 0.031]} r={0.025} w={0.04} />)}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 8:01 · LOS MESES HASTA CERO: la libreta del banco; cada renglón le resta un mes y el tambor de meses cae hasta cero ----
const pbLines = ["18,400,000", "-230,000 / MONTH"];
export const HMonths: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0.06, 0.03, 0.02], az: [0.25, 0.05], el: [0.95, 0.85], r: [0.72, 0.64], fov: 32 }}>{(tt) => {
  const n = 1 + 6 * eio(tt, 0.3, 3.0), m = Math.max(0, 80 - 80 * eio(tt, 3.2, 6.0));
  return <>
    <group scale={1.3 * pop(tt, 0.1)}><Passbook p={[-0.06, 0, 0]} lines={pbLines} n={n} key0="pbm" /></group>
    {Array.from({ length: 14 }, (_, i) => i < Math.ceil(14 * m / 80) ? <mesh key={"c" + i} position={[0.22, 0.004 + i * 0.0075, -0.12]} rotation={[0, i, 0]}><cylinderGeometry args={[0.028, 0.028, 0.006, 32]} />{M.brass({ col: "#c9a24a" })}</mesh> : null)}
    <group position={[0.2, 0.05, 0.04]} rotation={[-0.6, -0.3, 0]} scale={1.2 * pop(tt, 2.8)}>
      <RBox s={[0.14, 0.09, 0.07]} r={0.012}>{M.brass({ col: "#9a6a24" })}</RBox>
      {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? m / 10 : m % 10} p={[-0.025 + d * 0.05, 0.008, 0.036]} r={0.026} w={0.04} />)}
      <Sheet map={txt("mon", ["MONTHS LEFT"], { w: 320, h: 64, bg: "#9a6a24", fg: "#20160a", size: 40 })} w={0.12} h={0.024} p={[0, -0.03, 0.036]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 9:05 · EDOGAWA TOCÓ LA PUERTA: un barrio en miniatura; los sobres vuelan a las casas y en una de cada tantas se prende la ventana de arriba ----
export const HSurvey: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f141c"
  cam={{ at: [0, 0, 0], at1: [0.05, 0.02, 0], az: [0.3, -0.2], el: [0.85, 0.65], r: [1.3, 1.05], fov: 32 }}>{(tt) => {
  const n = 7800 * eio(tt, 2.4, 5.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial color="#2a2f36" roughness={0.9} /></mesh>
        {Array.from({ length: 48 }, (_, i) => { const x = -0.65 + (i % 8) * 0.16, z = -0.4 + Math.floor(i / 8) * 0.16, hit = rn(i, 5) > 0.82;
      return <group key={i} position={[x, 0, z]} scale={0.32 * pop(tt, 0.05 + rn(i, 2) * 0.6)}><House lit={[hit ? eio(tt, 2.4 + rn(i, 6) * 2, 3 + rn(i, 6) * 2) : 0.08, 0.08, 0.3, 0.3]} /></group>; })}
    {Array.from({ length: 20 }, (_, i) => { const a = 0.6 + i * 0.08, k = eio(tt, a, a + 0.9);
      return k > 0 && k < 1 ? <mesh key={"e" + i} position={[lerp(-0.9, -0.65 + (i % 8) * 0.16, k), 0.3 * Math.sin(PI * k) + 0.05, lerp(0.6, -0.4 + Math.floor(i / 4) % 6 * 0.16, k)]} rotation={[-PI / 2, 0, k * 6]}><planeGeometry args={[0.05, 0.032]} /><meshStandardMaterial color="#f7f3ea" side={THREE.DoubleSide} /></mesh> : null; })}
    <group position={[0.15, 0.2, 0.2]} rotation={[-0.7, 0.2, 0]} scale={2.0 * pop(tt, 2.3)}>
      {[0, 1, 2, 3].map((d) => <DigitDrum key={d} v={Math.floor(n / Math.pow(10, 3 - d)) % 10} p={[-0.075 + d * 0.05, 0, 0]} r={0.03} w={0.045} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 9:59 · POR PRIMERA VEZ NO ERAN RAROS: tres edificios; de golpe se prenden todas las ventanas; después se apagan y quedan más prendidas que antes ----
export const HLockdown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#0b0e15"
  cam={{ at: [0, 0.3, -0.1], az: [-0.45, 0.3], el: [0.1, 0.18], r: [1.6, 1.35], fov: 34 }}>{(tt) => {
  const all = (i: number, b: number) => eio(tt, 1.0 + rn(i + b * 81, 4) * 0.8, 1.4 + rn(i + b * 81, 4) * 0.8) * (1 - eio(tt, 3.3 + (8 - Math.floor(i / 6)) * 0.12, 3.6 + (8 - Math.floor(i / 6)) * 0.12));
  return <>
    {[[-0.5, -0.35, 0.5], [0, 0, 0], [0.5, -0.35, -0.5]].map(([x, z, r], b) => <group key={b} position={[x, 0, z]} rotation={[0, r, 0]} scale={pop(tt, 0.1 + b * 0.15)}>
      <Block cols={6} rows={9} on={(i) => (rn(i + b * 81, 9) > 0.92 ? 1 : 0) + all(i, b) + (rn(i + b * 81, 11) > 0.72 ? eio(tt, 4.2, 4.8) : 0)} /></group>)}
  </>;
}}</Scene3D>;

// ---- 10:57 · UNA SOLA COSA: a las 3 de la mañana, de la heladera del konbini sale una sola lata y una moneda gira sobre el mostrador ----
export const HCoffee: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#0d1117" lamp={[0, 0.6, 0.2]}
  cam={{ at: [0, 0.14, 0], az: [-0.3, 0.12], el: [0.2, 0.26], r: [1.0, 0.85], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 1.8), coin = phys(tt, 2.4, 6, 0.3), spin = tt > 2.4 ? (tt - 2.4) * 14 * Math.max(0, 1 - (tt - 2.4) / 2.6) : 0;
  return <>
    <group position={[0, 0, -0.3]} scale={pop(tt, 0.1)}>
      <RBox s={[0.8, 0.5, 0.04]} r={0.008} p={[0, 0.25, -0.03]}>{M.steel({ col: "#cfd3d8" })}</RBox>
      <mesh position={[0, 0.26, -0.008]}><planeGeometry args={[0.76, 0.46]} />{M.glow({ col: "#e6f2ff", op: 0.5 })}</mesh>
      {Array.from({ length: 33 }, (_, i) => i === 16 ? null : <Can key={i} p={[-0.33 + (i % 11) * 0.066, 0.04 + Math.floor(i / 11) * 0.15, 0.03]} col={["#6b3a22", "#2f4f7a", "#7a2a22", "#3a5a3a"][i % 4]} />)}
    </group>
    <group position={[lerp(0.0, -0.05, k), lerp(0.19, 0, eio(tt, 1.2, 1.8)) + 0.05 * Math.sin(PI * k), lerp(-0.27, 0.08, k)]} scale={1.5}><Can col="#6b3a22" /></group>
    <group position={[0.12, 0.05 + 0.08 * (1 - coin), 0.1]} rotation={[PI / 2 - 0.2, spin, 0]} scale={2.2 * pop(tt, 2.3)}>
      <mesh><cylinderGeometry args={[0.022, 0.022, 0.004, 32]} />{M.brass({ col: "#c9a24a" })}</mesh>
    </group>
    
  </>;
}}</Scene3D>;

// ---- 11:11 · ARRIBA DE LA PANADERÍA: edificio en corte; la madre sube sola, un año; un día sube él, detrás ----
export const HBakery: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#1e1710" lamp={[0, 0.6, 0.5]} warm={0.6}
  cam={{ at: [0.05, 0.14, 0], az: [0.3, 0.15], el: [0.2, 0.16], r: [0.85, 0.75], fov: 32 }}>{(tt) => {
  const bag = eio(tt, 1.2, 2.2), son = eio(tt, 3.4, 4.6);
  return <>
    <RBox s={[0.6, 0.12, 0.18]} r={0.006} p={[0, 0.06, -0.06]}>{M.wood({ base: [110, 72, 40] })}</RBox>
    <mesh position={[0, 0.16, -0.06]}><boxGeometry args={[0.58, 0.08, 0.16]} /><meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.05} thickness={0.01} transparent opacity={0.35} /></mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[-0.22 + (i % 4) * 0.08 + (i === 3 ? 0.25 * bag : 0), 0.14 + (i === 3 ? 0.08 * Math.sin(PI * bag) : 0), -0.09 + Math.floor(i / 4) * 0.06 + (i === 3 ? 0.12 * bag : 0)]} scale={[1, 0.6, 0.7]}>
      <sphereGeometry args={[0.028, 16, 12]} /><meshStandardMaterial color="#c08540" roughness={0.6} /></mesh>)}
    <RBox s={[0.06, 0.08, 0.04]} r={0.004} p={[0.12, 0.16, 0.08]}>{M.matte({ col: "#d9c9a6" })}</RBox>
    <group position={[0.2, 0, 0.12]} rotation={[0, -PI / 2, 0]} scale={1.5 * pop(tt, 0.3)}><Fig col="#8a6a4a" arm={0.5 * Math.sin(PI * bag)} /></group>
    <group position={[lerp(0.55, 0.36, son), 0, lerp(0.3, 0.22, son)]} rotation={[0, -PI / 2 - 0.4, 0]} scale={1.5 * Math.max(0.001, son)}><Fig head={0.25} /></group>
  </>;
}}</Scene3D>;

// ---- 14:14 · LA HELADERA DE LAS 3 AM: la puerta de vidrio se abre, la luz fría cae sobre la figurita; el «buenas noches» del cajero llega en ondas y él se encoge ----
export const HFridge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#0d1015"
  cam={{ at: [0, 0.22, 0], at1: [0.04, 0.25, 0.04], az: [0.95, 0.85], el: [0.12, 0.08], r: [1.15, 0.72], fov: 32 }}>{(tt) => {
  const door = eio(tt, 0.6, 1.6), flinch = phys(tt, 2.8, 14, 0.25), take = eio(tt, 3.6, 4.6), dark = eio(tt, 3.0, 4.0);
  return <>
    <group position={[0, 0, -0.25]} scale={pop(tt, 0.1)}>
      <RBox s={[0.7, 0.62, 0.04]} r={0.01} p={[0, 0.31, -0.05]}>{M.steel({ col: "#d8dbe0" })}</RBox>
      <mesh position={[0, 0.32, -0.028]}><planeGeometry args={[0.64, 0.54]} />{M.glow({ col: "#e9f4ff", op: 0.55 * (1 - 0.95 * dark) })}</mesh>
      <mesh position={[0, 0.32, 0.075]}><planeGeometry args={[0.7, 0.62]} /><meshBasicMaterial color="#05070a" transparent opacity={0.9 * dark} depthWrite={false} /></mesh>
      {Array.from({ length: 40 }, (_, i) => i === 24 ? <group key={i} position={[lerp(-0.03, 0.06, take), lerp(0.34, 0.24, take), lerp(0.0, 0.3, take)]} scale={1 + 0.3 * take}><Can col="#6b3a22" /><pointLight position={[0, 0.05, 0.05]} intensity={0.25 * take} distance={0.4} color="#ffd9a0" /></group>
        : <Can key={i} p={[-0.27 + (i % 10) * 0.06, 0.08 + Math.floor(i / 10) * 0.13, 0.0]} col={["#6b3a22", "#2f4f7a", "#7a2a22", "#3a5a3a"][i % 4]} />)}
      <group position={[-0.34, 0, 0.05]} rotation={[0, -1.6 * door, 0]}>
        <mesh position={[0.34, 0.32, 0]}><boxGeometry args={[0.68, 0.58, 0.008]} />{M.glass({})}</mesh>
        <RBox s={[0.012, 0.18, 0.02]} r={0.004} p={[0.64, 0.32, 0.02]}>{M.steel({})}</RBox>
      </group>
    </group>
    <mesh position={[0, 0.002, 0.08]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.3 + 0.7 * door, 1]}><planeGeometry args={[0.6, 0.45]} />{M.glow({ col: "#dfeeff", op: 0.22 * door })}</mesh>
    <group position={[0.03, 0, 0.14]} rotation={[0, PI, 0]} scale={1.7 * (1 - 0.08 * flinch)}><Fig head={0.3 * (1 - eio(tt, 3.4, 3.8))} bow={0.15 + 0.25 * flinch} arm={0.95 * eio(tt, 3.0, 3.8)} /></group>
    {[2.6, 2.9].map((a, i) => { const k = cl((tt - a) / 1.0); return k > 0 && k < 1 ? <mesh key={i} position={[0.55, 0.3, 0.2]} rotation={[0, -0.9, 0]} scale={0.05 + 0.4 * k}><torusGeometry args={[0.5, 0.015, 8, 48, PI / 2]} />{M.glow({ col: "#ffd59a", op: 1 - k })}</mesh> : null; })}
  </>;
}}</Scene3D>;
