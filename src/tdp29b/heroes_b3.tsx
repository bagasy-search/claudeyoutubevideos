// tdp29b · componentes 19-27: el departamento del piso 12, la bifurcación, la plata contra las cunas, el día del pueblo, el bebé de casa en casa, las tres cosas, Aya, la bicicleta, las muñecas al final.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Block, Fig, House, TrainCar } from "./tkit3d";
import { Coin } from "./lkit3d";
import { Bus, Crib, Doll, Mountain, School } from "./heroes_b1";

// ---- 16:05 · PISO 12, 30 m²: la torre de noche; la cámara entra en la única ventana prendida: la pareja y el nene en un cuarto mínimo ----
export const HApartment: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0b0e15"
  cam={{ at: [0, 0.6, 0], at1: [0.07, 0.86, 0.12], az: [-0.2, 0.0], el: [0.1, 0.05], r: [1.7, 0.42], fov: 32 }}>{(tt) => <>
  <Block p={[0, 0, 0]} s={1.1} cols={6} rows={14} on={(i) => (i === 11 * 6 + 3 ? 1 : rn(i, 9) > 0.8 ? 0.6 * eio(tt, 0.2 + rn(i, 2), 1 + rn(i, 2)) : 0)} />
  <group position={[0.071, 0.835, 0.112]} scale={0.32}>
    <mesh position={[0, 0.06, -0.03]}><planeGeometry args={[0.2, 0.14]} /><meshStandardMaterial color="#e8dcc4" emissive="#ffcf8a" emissiveIntensity={0.25} /></mesh>
    <RBox s={[0.2, 0.004, 0.06]} r={0.001} p={[0, 0.0, 0]}>{M.wood({ base: [170, 128, 80] })}</RBox>
    <Fig p={[-0.05, 0, 0]} s={0.42} cloth="#3a4a5a" sit={1} />
    <Fig p={[0.02, 0, 0]} s={0.4} cloth="#8a4a3a" sit={1} />
    <Fig p={[0.065, 0, 0.01]} s={0.22} cloth="#e0b030" />
  </group>
</>}</Scene3D>;

// ---- 17:12 · O CARRERA O FAMILIA: el camino se abre en dos; a un lado la torre de oficinas, al otro la casita con la cuna; ella mira a uno y a otro ----
export const HFork: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#14171d" lamp={[0, 0.8, 0.5]}
  cam={{ at: [0, 0.1, -0.15], az: [0.0, 0.0], el: [0.45, 0.38], r: [1.25, 1.1], fov: 32 }}>{(tt) => {
  const grow = eio(tt, 0.4, 1.8), look = Math.sin(tt * 1.6) * 0.9 * eio(tt, 2.0, 2.5);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#2a2e34" roughness={0.95} /></mesh>
    <mesh position={[0, 0.003, 0.25]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.14, 0.5]} /><meshStandardMaterial color="#c9b896" /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.2 * grow, 0.003, -0.15]} rotation={[-PI / 2, 0, sd * 0.75]} scale={[1, Math.max(0.001, grow), 1]}><planeGeometry args={[0.12, 0.6]} /><meshStandardMaterial color="#c9b896" /></mesh>)}
    <group position={[-0.48, 0, -0.45]} scale={0.7 * pop(tt, 1.0)}><Block cols={4} rows={10} on={(i) => (rn(i, 3) > 0.35 ? 1 : 0)} col="#9aa4b0" /></group>
    <group position={[0.48, 0, -0.4]} scale={0.6 * pop(tt, 1.3)}><House lit={[0.9, 0.9, 0.9, 0.9]} col="#e8dcc4" roof="#7a3a2c" /></group>
    <group position={[0.48, 0.0, -0.18]} scale={0.9 * pop(tt, 1.8)}><Crib p={[0, 0, 0]} /></group>
    <group position={[0, 0, 0.18]} rotation={[0, PI + look, 0]} scale={1.5 * pop(tt, 0.2)}><Fig cloth="#3a3a44" head={0.1} /></group>
  </>;
}}</Scene3D>;

// ---- 17:52 · LA PLATA NO ALCANZA: las pilas de monedas suben y suben; al lado, la fila de cunas se achica igual ----
export const HMoney: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="dark" lamp={[0, 0.8, 0.4]}
  cam={{ at: [0, 0.16, 0], az: [-0.3, 0.2], el: [0.25, 0.25], r: [1.25, 1.1], fov: 30 }}>{(tt) => {
  const cribs = Math.round(lerp(10, 4, eio(tt, 1.0, 5.6)));
  return <>
    {Array.from({ length: 5 }, (_, c) => { const nC = Math.floor(22 * eio(tt, 0.4 + c * 0.25, 5.4)); return <group key={c} position={[-0.42 + c * 0.07, 0, -0.05 + (c % 2) * 0.05]}>
      {Array.from({ length: nC }, (_, i) => <Coin key={i} p={[rn(i, c) * 0.004, 0.003 + i * 0.0105, 0]} s={1.4} />)}</group>; })}
    {Array.from({ length: 10 }, (_, i) => <group key={"c" + i} position={[0.06 + (i % 5) * 0.11, -0.25 * eio(tt, 1.0 + (9 - i) * 0.46, 1.6 + (9 - i) * 0.46), -0.08 + Math.floor(i / 5) * 0.14]} scale={Math.max(0.001, (i < cribs ? 1 : 1 - eio(tt, 1.2 + (9 - i) * 0.46, 1.6 + (9 - i) * 0.46)) * pop(tt, 0.2 + i * 0.05))}><Crib p={[0, 0, 0]} /></group>)}
  </>;
}}</Scene3D>;

// ---- 18:47 · UN DÍA EN UN PUEBLO DE 30: el sol cruza; el viejo barre, la radio, la tienda, la campana, el micro vacío, la tele; al final sólo la escuela sigue con su reloj ----
export const HVillageDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1f2a" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0.02, 0.08, 0.0], at1: [-0.05, 0.08, -0.15], az: [-0.18, 0.1], el: [0.32, 0.28], r: [1.1, 0.8], fov: 32 }}>{(tt) => {
  const d = cl((tt - 0.3) / 6.2), sun = Math.sin(PI * cl(d * 1.15)), night = 1 - sun, bus = eio(tt, 3.6, 4.8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color={new THREE.Color("#1e2a20").lerp(new THREE.Color("#5f7f42"), sun)} roughness={0.95} /></mesh>
    <mesh position={[lerp(-0.9, 0.9, d), 0.2 + 0.6 * sun, -0.9]}><sphereGeometry args={[0.07, 24, 16]} />{M.glow({ col: sun > 0.2 ? "#fff1b8" : "#dfe6ff", op: 0.95 })}</mesh>
    <mesh position={[0, 0.003, 0.22]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 0.14]} /><meshStandardMaterial color="#55575c" /></mesh>
    {[[-0.55, -0.2], [-0.25, -0.3], [0.3, -0.25]].map(([x, z], i) => <group key={i} position={[x, 0, z]} scale={0.4}><House lit={[night * 0.9 * (d < 0.9 ? 1 : 0), night * 0.6, night * (d < 0.9 ? 1 : 0), 0.2 * night]} col="#d8c9a8" roof="#4a3a30" /></group>)}
    <group position={[0.0, 0, -0.32]} scale={0.32}><School lit={0.2 + 0.8 * night} /></group>
    <mesh position={[0.0, 0.29 * 0.32 + 0.002, -0.32 + 0.051 * 0.32 + 0.002]} rotation={[0, 0, -tt * 3]}><boxGeometry args={[0.002, 0.012, 0.001]} /><meshStandardMaterial color="#222" /></mesh>
    <group position={[-0.34, 0, 0.08]} rotation={[0, 0.6, 0]} scale={1.2 * pop(tt, 0.3)}><Fig cloth="#5a5a5a" bow={0.35} arm={(0.3 + 0.25 * Math.sin(tt * 7)) * cl(sun * 3)} /></group>
    <mesh position={[-0.3, 0.03, 0.15]} rotation={[0.3 + 0.25 * Math.sin(tt * 7), 0.6, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 6]} />{M.wood({ base: [150, 110, 60] })}</mesh>
    {[0.9, 1.3].map((a, i) => { const k = cl((tt - a) / 1.0); return k > 0 && k < 1 ? <mesh key={i} position={[0.32, 0.1, -0.1]} rotation={[0, -0.6, 0]} scale={0.03 + 0.2 * k}><torusGeometry args={[0.5, 0.02, 8, 40, PI / 2]} />{M.glow({ col: "#ffd59a", op: 1 - k })}</mesh> : null; })}
    <group position={[0.55, 0, -0.1]} scale={pop(tt, 0.2)}>
      {[-0.03, 0.03].map((x, i) => <RBox key={i} s={[0.01, 0.16, 0.01]} r={0.002} p={[x, 0.08, 0]}>{M.wood({ base: [90, 60, 40] })}</RBox>)}
      <RBox s={[0.1, 0.012, 0.03]} r={0.002} p={[0, 0.165, 0]}>{M.wood({ base: [90, 60, 40] })}</RBox>
      <mesh position={[0, 0.13, 0]} rotation={[Math.sin(tt * 5) * 0.4 * eio(tt, 2.2, 2.4) * (1 - eio(tt, 3.2, 3.6)), 0, 0]}><cylinderGeometry args={[0.018, 0.024, 0.04, 16]} />{M.brass({ col: "#8a6a2a" })}</mesh>
    </group>
    <group position={[lerp(-1.3, 1.3, bus), 0, 0.22]} scale={0.4}><Bus /></group>
    {[-0.16, 0.06].map((x, i) => <RBox key={"lp" + i} s={[0.006, 0.12, 0.006]} r={0.001} p={[x, 0.06, -0.05]}>{M.wood({ base: [90, 60, 40] })}</RBox>)}
    <mesh position={[-0.05, 0.115, -0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.001, 0.001, 0.22, 4]} /><meshStandardMaterial color="#ddd" /></mesh>
    {[-0.12, -0.06, 0.0].map((x, i) => <mesh key={"cl" + i} position={[x, 0.09, -0.05]} rotation={[0.15 * Math.sin(tt * 3 + i), 0, 0]} scale={Math.max(0.001, cl(sun * 3))}><planeGeometry args={[0.04, 0.045]} /><meshStandardMaterial color={["#e9e4d8", "#9ab0c8", "#d88a6a"][i]} side={THREE.DoubleSide} /></mesh>)}
    <group position={[-0.1, 0, 0.0]} scale={1.2 * Math.max(0.001, cl(sun * 3))}><Fig cloth="#8a5a6a" arm={0.9} arm2={0.9} /></group>
    <group position={[lerp(0.3, 0.62, d), 0, 0.16]} rotation={[0, PI / 2, 0]} scale={1.2 * Math.max(0.001, cl(sun * 3))}><Fig cloth="#4a4a52" bow={0.35} /></group>
    {[0.16, 0.26].map((x, i) => <group key={"bn" + i} position={[x, 0, 0.02]} rotation={[0, i ? -PI / 2 : PI / 2, 0]} scale={1.2 * Math.max(0.001, cl(sun * 3))}><Fig cloth={i ? "#6a5a3a" : "#3a5a6a"} sit={1} head={0.1 * Math.sin(tt * 2 + i)} /></group>)}
    <RBox s={[0.16, 0.012, 0.04]} r={0.002} p={[0.21, 0.05, 0.02]}>{M.wood({ base: [120, 86, 52] })}</RBox>
  </>;
}}</Scene3D>;

// ---- 19:40 · TODO EL PUEBLO CRIABA AL CHICO: el bebé salta de puerta en puerta por la fila de casas; en cada una, una abuela lo recibe ----
export const HRaised: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#b9c4b4" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.08, 0], az: [-0.25, 0.1], el: [0.3, 0.26], r: [1.3, 1.15], fov: 32 }}>{(tt) => {
  const k = cl((tt - 0.8) / 5.0) * 4, i = Math.min(3, Math.floor(k)), f = k - i, xs = [-0.6, -0.3, 0, 0.3, 0.6];
  const bx = lerp(xs[i], xs[Math.min(4, i + 1)], eio(f, 0.4, 0.9)), by = 0.13 + 0.12 * Math.sin(PI * eio(f, 0.4, 0.9));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#6a8a4a" roughness={0.95} /></mesh>
    {xs.map((x, j) => <group key={j}>
      <group position={[x, 0, -0.18]} scale={0.48 * pop(tt, 0.1 + j * 0.1)}><House lit={[0.4, 0.4, 0.6, 0.6]} col="#d8c9a8" roof={["#4a3a30", "#5a3a2c", "#3a3d44"][j % 3]} /></group>
      <group position={[x, 0, 0.02]} scale={1.15 * pop(tt, 0.3 + j * 0.1)}><Fig cloth={["#6a4a5a", "#4a5a6a", "#7a6a4a", "#5a4a4a", "#4a6a5a"][j]} bow={0.3} arm={Math.abs(bx - x) < 0.08 ? 0.5 : 0.15} arm2={Math.abs(bx - x) < 0.08 ? 0.5 : 0.1} /></group>
    </group>)}
    <mesh position={[bx, by, 0.07]} scale={[1, 0.8, 0.8]}><sphereGeometry args={[0.022, 16, 12]} />{M.matte({ col: "#f6efe2" })}</mesh>
    <mesh position={[bx, by + 0.025, 0.07]}><sphereGeometry args={[0.014, 16, 12]} />{M.wood({ base: [214, 180, 140] })}</mesh>
  </>;
}}</Scene3D>;

// ---- 20:20 · LAS TRES COSAS: suben tres pedestales: el barco de un trabajo, la casa arreglada, la escuela con chicos ----
export const HThree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" lamp={[0, 0.8, 0.5]} warm={0.8}
  cam={{ at: [0, 0.16, 0], az: [-0.2, 0.2], el: [0.22, 0.25], r: [1.2, 1.05], fov: 30 }}>{(tt) => {
  const ped = (x: number, a: number, ch: React.ReactNode) => { const up = phys(tt, a, 7, 0.5); return <group position={[x, -0.15 * (1 - cl(up)), 0]} scale={Math.max(0.001, pop(tt, a))}>
    <RBox s={[0.24, 0.1, 0.24]} r={0.01} p={[0, 0.05, 0]}>{M.wood({ base: [110, 74, 44] })}</RBox>
    <mesh position={[0, 0.101, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.09, 0.1, 48]} />{M.glow({ col: "#ffd59a", op: 0.6 })}</mesh>
    <group position={[0, 0.1, 0]}>{ch}</group></group>; };
  return <>
    {ped(-0.32, 0.6, <group rotation={[0, 0.5 + tt * 0.2, 0]}>
      <mesh position={[0, 0.03, 0]} scale={[1, 0.5, 0.45]}><sphereGeometry args={[0.08, 24, 12, 0, 2 * PI, PI / 2, PI / 2]} />{M.pvc({ col: "#f2efe6" })}</mesh>
      <RBox s={[0.05, 0.04, 0.04]} r={0.004} p={[-0.02, 0.05, 0]}>{M.pvc({ col: "#2f6a9a" })}</RBox>
      <mesh position={[0.02, 0.09, 0]}><cylinderGeometry args={[0.003, 0.003, 0.09, 6]} />{M.steel({})}</mesh></group>)}
    {ped(0, 2.0, <group scale={0.32} rotation={[0, -0.3 + tt * 0.15, 0]}><House lit={[0.9, 0.9, 0.9, 0.9]} col="#efe2c4" roof="#7a3a2c" /></group>)}
    {ped(0.32, 3.4, <group rotation={[0, -0.4 + tt * 0.15, 0]}><group scale={0.3}><School lit={1} /></group>
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => <Fig key={i} p={[x, 0, 0.06]} s={0.35 * pop(tt, 4.2 + i * 0.2)} cloth={["#e0b030", "#c94a3a", "#2f6a9a", "#4a8a4a"][i]} />)}</group>)}
  </>;
}}</Scene3D>;

// ---- 21:00 · AYA: el puertito; ella en el puesto; los viejos pescadores le acercan pescados; el puesto se llena; al final, dos nenes al lado ----
export const HAya: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#a9bcc8" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.08, 0], az: [-0.35, -0.15], el: [0.28, 0.24], r: [1.1, 0.98], fov: 32 }}>{(tt) => {
  const shelves = Math.floor(12 * eio(tt, 1.6, 4.4));
  return <>
    <mesh position={[0, -0.002, -0.55]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.6, 1.0]} />{M.water({ col: "#3a7a9a", op: 0.9 })}</mesh>
    <mesh position={[0, 0, 0.25]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.6, 1.0]} /><meshStandardMaterial color="#9a9a96" roughness={0.9} /></mesh>
    <group position={[-0.5, 0.01 + 0.006 * Math.sin(tt * 2), -0.35]} rotation={[0, 0.2, 0]}>
      <mesh scale={[1.6, 0.45, 0.55]}><sphereGeometry args={[0.1, 24, 12, 0, 2 * PI, PI / 2, PI / 2]} />{M.pvc({ col: "#f2efe6" })}</mesh>
      <RBox s={[0.06, 0.05, 0.05]} r={0.004} p={[-0.04, 0.03, 0]}>{M.pvc({ col: "#2f6a9a" })}</RBox>
    </group>
    <group position={[0.15, 0, 0.0]} scale={pop(tt, 0.2)}>
      <RBox s={[0.34, 0.1, 0.12]} r={0.006} p={[0, 0.05, 0]}>{M.wood({ base: [150, 106, 64] })}</RBox>
      {[-0.16, 0.16].map((x, i) => <RBox key={i} s={[0.01, 0.22, 0.01]} r={0.002} p={[x, 0.11, -0.05]}>{M.wood({ base: [110, 74, 44] })}</RBox>)}
      <RBox s={[0.36, 0.012, 0.14]} r={0.002} p={[0, 0.225, -0.02]}>{M.matte({ col: "#2f6a9a" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => i < shelves ? <mesh key={i} position={[-0.14 + (i % 6) * 0.055, 0.105 + Math.floor(i / 6) * 0.0, 0.02 - Math.floor(i / 6) * 0.04]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.35]}><capsuleGeometry args={[0.01, 0.035, 4, 8]} />{M.matte({ col: i % 2 ? "#e9d9b4" : "#b8c4cc" })}</mesh> : null)}
    </group>
    <group position={[0.15, 0, -0.1]} rotation={[0, 0, 0]} scale={1.3 * pop(tt, 0.4)}><Fig cloth="#c94a3a" /></group>
    {[[-0.3, 0.1], [-0.15, 0.22]].map(([x, z], i) => { const g = eio(tt, 0.8 + i * 0.6, 1.8 + i * 0.6); return <group key={i} position={[lerp(-0.7, x, g), 0, z]} rotation={[0, PI / 2, 0]} scale={1.25}><Fig cloth="#3a4a5a" hat="#e9e2cf" bow={0.3} arm={0.4 * g} /></group>; })}
    <group position={[0.36, 0, 0.0]} rotation={[0, -0.4, 0]} scale={1.3 * pop(tt, 4.6)}><Fig cloth="#2a2a30" /></group>
    {[0.04, 0.26].map((x, i) => <group key={"k" + i} position={[x, 0, 0.12]} scale={0.65 * pop(tt, 5.0 + i * 0.3)}><Fig cloth={i ? "#e0b030" : "#4a8a4a"} /></group>)}
  </>;
}}</Scene3D>;

// ---- 21:55 · TRES VIENEN CORRIENDO: el nene se cae de la bici; de tres casas salen tres viejos a la vez ----
export const HBicycle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#b4c4b0" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.06, 0.05], az: [-0.3, 0.1], el: [0.42, 0.36], r: [1.1, 0.98], fov: 32 }}>{(tt) => {
  const ride = eio(tt, 0.3, 1.6), fallK = eio(tt, 1.6, 2.0), run = (i: number) => eio(tt, 2.3 + i * 0.15, 4.0 + i * 0.15);
  const bx = lerp(-0.5, 0.0, ride);
  const homes = [[-0.5, -0.35], [0.1, -0.42], [0.55, -0.2]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#6a8a4a" roughness={0.95} /></mesh>
    <mesh position={[0, 0.003, 0.12]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 0.2]} /><meshStandardMaterial color="#b9a888" /></mesh>
    {homes.map(([x, z], i) => <group key={i} position={[x, 0, z - 0.1]} scale={0.45}><House lit={[0.4, 0.4, 0.6, 0.6]} col="#d8c9a8" roof="#4a3a30" /></group>)}
    <group position={[bx, 0, 0.12]} rotation={[fallK * 1.3, 0, 0]}>
      {[-0.035, 0.035].map((x, i) => <mesh key={i} position={[x, 0.025, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.022, 0.004, 8, 24]} />{M.rubber({ col: "#222" })}</mesh>)}
      <mesh position={[0, 0.04, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.07, 6]} />{M.plastic({ col: "#c94a3a" })}</mesh>
      <group position={[0, 0.02, 0]} rotation={[0, PI / 2, 0]} scale={0.7}><Fig cloth="#e0b030" sit={0.6} arm={0.5} arm2={0.5} /></group>
    </group>
    {homes.map(([x, z], i) => <group key={"o" + i} position={[lerp(x, bx + (i - 1) * 0.08, run(i)), 0, lerp(z + 0.05, 0.02 + (i === 1 ? -0.05 : 0.04), run(i))]} rotation={[0, Math.atan2(bx - x, 0.12 - z), 0]} scale={1.15 * pop(tt, 2.2 + i * 0.15)}>
      <Fig cloth={["#6a4a5a", "#4a5a6a", "#7a6a4a"][i]} bow={0.25 + 0.15 * Math.abs(Math.sin(tt * 9))} arm={0.3 * Math.abs(Math.sin(tt * 9 + i))} /></group>)}
  </>;
}}</Scene3D>;

// ---- 23:20 · DE TELA Y DE PAJA: de noche, en la parada; una muñeca, después otra y otra, hasta llenar la ruta; la cámara se aleja al valle con unas pocas ventanas prendidas ----
export const HDollsEnd: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0d1118" lamp={[0.2, 0.6, 0.4]} warm={0.5}
  cam={{ at: [0, 0.1, 0.1], at1: [0, 0.1, -0.2], az: [-0.3, -0.1], el: [0.2, 0.4], r: [0.7, 2.0], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial color="#1e2a20" roughness={0.95} /></mesh>
  <mesh position={[0, 0.003, 0.15]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[4, 0.18]} /><meshStandardMaterial color="#2a2c30" /></mesh>
  <mesh position={[0.12, 0.25, 0.0]}><sphereGeometry args={[0.02, 16, 12]} />{M.glow({ col: "#ffd59a" })}</mesh>
  <RBox s={[0.008, 0.25, 0.008]} r={0.002} p={[0.12, 0.125, 0.0]}>{M.steel({ col: "#555" })}</RBox>
  {Array.from({ length: 22 }, (_, i) => { const sd = i % 2 ? 1 : -1, x = sd * (0.06 + Math.floor(i / 2) * 0.12) + (i === 0 ? 0.06 : 0), z = 0.02 + rn(i, 3) * 0.06;
    return <Doll key={i} p={[i === 0 ? 0 : x, 0, i === 0 ? 0.02 : z]} r={[0, rn(i, 4) * 0.6 - 0.3, 0]} s={1.1 * pop(tt, i === 0 ? 0.2 : 1.0 + i * 0.2)} sit={i % 3 === 0 ? 1 : 0} cloth={["#4a4038", "#5a3a3a", "#3a4a5a", "#5a5a3a"][i % 4]} hat={i % 2 === 0 ? "#c9a75a" : undefined} />; })}
  {Array.from({ length: 12 }, (_, i) => <group key={"m" + i}><Mountain p={[-1.6 + i * 0.3, 0.3, -1.1 - rn(i, 2) * 0.4]} s={[1.6, 1.3 + rn(i, 3), 1.2]} col="#18241a" /></group>)}
  {Array.from({ length: 7 }, (_, i) => <group key={"h" + i} position={[-1.0 + i * 0.33, 0, -0.6 - rn(i, 5) * 0.3]} scale={0.35}><House lit={[i % 3 === 0 ? 0.9 : 0, 0, 0, i === 4 ? 0.8 : 0]} col="#5a5248" roof="#2a2420" /></group>)}
</>}</Scene3D>;

// ---- 15:35 · LA LLAMADA DE LAS SEIS: casa de noche con la tele; un hilo de luz cruza la montaña desde la torre de Osaka y trae las tres preguntas de siempre ----
const callArc = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.62, 0.42, -0.35), new THREE.Vector3(0.1, 0.78, -0.3), new THREE.Vector3(-0.36, 0.2, 0.02));
export const HPhoneCall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0a0d16" lamp={[-0.3, 0.5, 0.5]}
  cam={{ at: [0.15, 0.3, -0.15], at1: [-0.3, 0.2, 0.0], az: [0.1, -0.15], el: [0.18, 0.14], r: [1.45, 0.95], fov: 32 }}>{(tt) => {
  const line = eio(tt, 0.8, 2.0), tv = 0.55 + 0.12 * Math.sin(tt * 2 * PI * 0.9), ring = eio(tt, 1.6, 2.0);
  const qs = ["Did you eat?", "Your medicine?", "Is it cold?"];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.6, 1.6]} /><meshStandardMaterial color="#141a14" roughness={0.95} /></mesh>
    <Mountain p={[0.1, 0, -0.45]} s={[1.1, 0.9, 0.7]} col="#1c2a20" />
    <Mountain p={[0.45, 0, -0.6]} s={[0.8, 0.7, 0.6]} col="#18221c" />
    <group position={[0.68, 0, -0.42]} scale={pop(tt, 0.2) * 0.75}><Block cols={4} rows={9} on={(i) => (i * 37) % 5 < 2 ? 1 : 0.1} col="#6f7480" /></group>
    <group position={[-0.42, 0, -0.08]} scale={0.55}><House lit={[0, 0, 0.9 * tv, 0]} col="#bfae8c" roof="#3e3028" /></group>
    <mesh position={[-0.36, 0.06, 0.08]}><boxGeometry args={[0.07, 0.05, 0.01]} /><meshBasicMaterial color={new THREE.Color("#2a3a5a").lerp(new THREE.Color("#9fc3ff"), tv)} toneMapped={false} /></mesh>
    <group position={[-0.26, 0, 0.12]} rotation={[0, -1.1, 0]} scale={0.9}><Fig cloth="#6a5244" sit={0.9} arm={0.55 * ring} head={-0.15} /></group>
    <mesh><tubeGeometry args={[callArc, 80, 0.0035, 8, false]} />{M.glow({ col: "#ffcf8a", op: 0.6 * line })}</mesh>
    {[0, 1, 2].map((i) => { const a = 2.2 + i * 1.4, k = eio(tt, a, a + 1.0), pt = callArc.getPoint(0.15 + 0.7 * k), stay = pt.clone().add(new THREE.Vector3(0, 0.07, 0.05));
      return tt > a ? <group key={i}>
        <mesh position={pt.toArray() as [number, number, number]}><sphereGeometry args={[0.014, 16, 12]} />{M.glow({ col: "#ffe2b0", op: 1 - eio(tt, a + 0.9, a + 1.2) })}</mesh>
        <Sheet map={txt("pc" + i, [qs[i]], { w: 420, h: 110, bg: "#f4ecd8", fg: "#2a2420", size: 56, font: HANDF })} w={0.2} h={0.052}
          p={[-0.52 + i * 0.03, 0.42 - i * 0.075, 0.12]} r={[0, 0.25, -0.03 + i * 0.03]} s={pop(tt, a + 1.0)} em={0.15} />
      </group> : null; })}
  </>;
}}</Scene3D>;

// ---- 18:10 · LA ESCUELA QUE RECIBE CHICOS DE LA CIUDAD: el tren cruza el puente a la isla y los pupitres vacíos se van llenando, de 3 a 14 ----
export const HCityKids: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16202c" lamp={[0.2, 0.7, 0.5]}
  cam={{ at: [-0.2, 0.12, 0], at1: [0.3, 0.1, 0.05], az: [-0.2, 0.15], el: [0.32, 0.26], r: [1.35, 1.0], fov: 32 }}>{(tt) => {
  const ride = eio(tt, 0.5, 2.8), n = Math.round(3 + 11 * eio(tt, 3.0, 6.0));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.005, 0]}><planeGeometry args={[3, 2]} />{M.water({ col: "#3d7fa8", op: 0.9 })}</mesh>
    <mesh position={[-0.75, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.32, 40]} /><meshStandardMaterial color="#6b6f62" /></mesh>
    <group position={[-0.8, 0.02, -0.08]} scale={0.55}><Block cols={3} rows={8} on={(i) => (i * 13) % 4 === 0 ? 1 : 0.2} col="#8d929b" /></group>
    <mesh position={[0.45, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.38, 48]} /><meshStandardMaterial color="#5c7a3c" roughness={0.95} /></mesh>
    <RBox s={[0.9, 0.012, 0.06]} r={0.004} p={[-0.13, 0.05, 0.05]}>{M.steel({ col: "#8a8f96" })}</RBox>
    {[-0.45, -0.15, 0.15].map((x, i) => <RBox key={i} s={[0.014, 0.05, 0.014]} r={0.003} p={[x, 0.025, 0.05]}>{M.steel({ col: "#7a7f86" })}</RBox>)}
    <group position={[lerp(-0.6, 0.22, ride), 0.056, 0.05]} rotation={[0, PI / 2, 0]} scale={0.32}><TrainCar col="#d9dcd2" lit={1} /></group>
    <group position={[0.5, 0.02, -0.12]} scale={0.34}><School lit={0.3 + 0.7 * eio(tt, 3.0, 6.0)} /></group>
    {Array.from({ length: 14 }, (_, i) => { const x = 0.32 + (i % 7) * 0.05, z = 0.1 + Math.floor(i / 7) * 0.07, on = i < n;
      return <group key={i} position={[x, 0.02, z]}>
        <RBox s={[0.034, 0.018, 0.024]} r={0.002} p={[0, 0.009, 0]}>{M.wood({ base: [176, 132, 86] })}</RBox>
        {on ? <group position={[0, 0.0, -0.018]} scale={Math.max(0.001, i < 3 ? 0.42 : 0.42 * pop(tt, 3.0 + (i - 3) * 0.27))}><Fig cloth={["#2f4f7a", "#7a2a22", "#3a5a3a", "#b88a34"][i % 4]} sit={0.8} /></group> : null}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 21:36 · EL PRÓXIMO VIAJE: el ferry sale de la costa de Japón, de noche, hacia las torres encendidas de Corea ----
const KFlag: React.FC<{ p: number[]; s?: number; tt: number }> = ({ p, s = 1, tt }) => <group position={p as [number, number, number]} scale={s}>
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.2, 8]} />{M.steel({ col: "#cfd3d8" })}</mesh>
  <group position={[0.048, 0.175, 0]} rotation={[0, 0.25 * Math.sin(tt * 2.2), 0.03 * Math.sin(tt * 3.1)]}>
    <mesh><planeGeometry args={[0.09, 0.06]} /><meshStandardMaterial color="#f4f4f2" side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={0.25} /></mesh>
    <mesh position={[0, 0, 0.001]} rotation={[0, 0, -0.6]}><circleGeometry args={[0.015, 32, 0, PI]} /><meshBasicMaterial color="#cd2e3a" side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0, 0.001]} rotation={[0, 0, -0.6]}><circleGeometry args={[0.015, 32, PI, PI]} /><meshBasicMaterial color="#0047a0" side={THREE.DoubleSide} /></mesh>
    {[[-0.03, 0.018, 0.6], [0.03, -0.018, 0.6], [0.03, 0.018, -0.6], [-0.03, -0.018, -0.6]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0.001]} rotation={[0, 0, r]}><planeGeometry args={[0.014, 0.01]} /><meshBasicMaterial color="#111" side={THREE.DoubleSide} /></mesh>)}
  </group>
</group>;

export const HFerry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0a0f1a" lamp={[0, 0.6, 0.6]}
  cam={{ at: [-0.45, 0.08, 0], at1: [0.62, 0.12, -0.05], az: [0.05, -0.15], el: [0.2, 0.12], r: [0.9, 0.78], fov: 34 }}>{(tt) => {
  const go = eio(tt, 0.6, 6.8), bx = lerp(-0.55, 0.45, go);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3.4, 2]} />{M.water({ col: "#1d3a58", op: 0.95 })}</mesh>
    <mesh position={[-1.0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.45, 40]} /><meshStandardMaterial color="#2c3326" /></mesh>
    {[[-0.95, -0.15], [-0.8, 0.05], [-1.05, 0.15]].map(([x, z], i) => <group key={i} position={[x, 0.02, z]} scale={0.3}><House lit={[0.8, 0, 0.6, 0]} col="#bba98a" roof="#3e3028" /></group>)}
    {[[0.95, -0.35, 9], [1.1, -0.2, 12], [0.85, -0.12, 7], [1.2, -0.45, 10]].map(([x, z, r], i) => <group key={i} position={[x, 0, z]} scale={0.5 * pop(tt, 1.5 + i * 0.4)}><Block cols={4} rows={r} on={(k) => ((k * 7 + i) % 3 === 0 ? 0.35 + 0.65 * go : 0.1 + 0.3 * go * rn(k, i))} col="#5f6672" /></group>)}
    <RBox s={[0.22, 0.02, 0.08]} r={0.004} p={[0.68, 0.01, -0.02]}>{M.wood({ base: [80, 60, 44] })}</RBox>
    <KFlag p={[0.74, 0.02, -0.03]} s={1.3} tt={tt} />
    <group position={[bx, 0.0, 0.02]} rotation={[0, 0, 0.02 * Math.sin(tt * 1.4)]}>
      <RBox s={[0.2, 0.035, 0.06]} r={0.01} p={[0, 0.017, 0]}>{M.matte({ col: "#e9ecef" })}</RBox>
      <RBox s={[0.1, 0.03, 0.045]} r={0.006} p={[-0.015, 0.05, 0]}>{M.matte({ col: "#d8dde2" })}</RBox>
      {[-0.05, -0.02, 0.01, 0.04].map((x, i) => <mesh key={i} position={[x, 0.025, 0.0305]}><planeGeometry args={[0.014, 0.008]} /><meshBasicMaterial color="#ffd08a" toneMapped={false} /></mesh>)}
      <group position={[0.05, 0.035, 0]} scale={0.22}><Fig cloth="#3b4a5e" head={-0.1} /></group>
      <KFlag p={[-0.08, 0.06, 0]} s={0.45} tt={tt} />
    </group>
    <mesh position={[bx - 0.28, 0.002, 0.02]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, go), 1, 1]}><planeGeometry args={[0.36, 0.03]} />{M.glow({ col: "#b8d6f0", op: 0.35 })}</mesh>
  </>;
}}</Scene3D>;
