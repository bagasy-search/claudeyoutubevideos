// tdp29b · componentes 10-18: la estación de una sola chica, la graduación de uno, el tren de los 18, las akiya, el camioncito, el arroz, la tumba, el mikoshi.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tubeG } from "./h3d";
import { PI, pop } from "./lkit3d";
import { Fig, House, TrainCar } from "./tkit3d";
import { Bus, Doll, Mountain, School } from "./heroes_b1";

const Snow: React.FC<{ tt: number; n?: number; w?: number; sz?: number }> = ({ tt, n = 70, w = 1.6, sz = 0.004 }) => <>{Array.from({ length: n }, (_, i) => {
  const y = 0.9 - ((tt * (0.06 + rn(i, 5) * 0.05) + rn(i, 2)) % 1) * 0.9;
  return <mesh key={i} position={[(rn(i, 3) - 0.5) * w + Math.sin(tt * 0.8 + i) * 0.02, y, (rn(i, 4) - 0.5) * w * 0.7]}><sphereGeometry args={[sz, 6, 4]} />{M.glow({ col: "#ffffff", op: 0.85 })}</mesh>; })}</>;

// ---- 6:20 · KYU-SHIRATAKI: andén en la nieve; el tren de un vagón llega, sube una sola chica, se va; la luz del refugio se apaga ----
export const HStation: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#8e98a6" lamp={[0.2, 0.7, 0.5]} warm={0.3}
  cam={{ at: [0, 0.14, 0.04], at1: [0.03, 0.17, 0.0], az: [-0.35, -0.12], el: [0.16, 0.12], r: [0.95, 0.75], fov: 32 }}>{(tt) => {
  const arr = eio(tt, 0.3, 1.8), go = eio(tt, 3.4, 5.4), off = eio(tt, 2.2, 3.2), step = eio(tt, 2.0, 2.8), lamp = eio(tt, 4.6, 5.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#eef2f6" roughness={0.9} /></mesh>
    {[-0.06, 0.06].map((z, i) => <mesh key={i} position={[0, 0.006, 0.22 + z]}><boxGeometry args={[3, 0.008, 0.008]} />{M.steel({ col: "#6a6e74" })}</mesh>)}
    <RBox s={[0.9, 0.05, 0.16]} r={0.004} p={[0, 0.025, 0.0]}>{M.matte({ col: "#b9bec4" })}</RBox>
    <group position={[-0.3, 0.05, -0.04]}>
      <RBox s={[0.2, 0.012, 0.1]} r={0.003} p={[0, 0.17, 0]}>{M.wood({ base: [80, 56, 38] })}</RBox>
      <RBox s={[0.2, 0.16, 0.01]} r={0.003} p={[0, 0.085, -0.045]}>{M.wood({ base: [110, 80, 52] })}</RBox>
    </group>
    <RBox s={[0.008, 0.26, 0.008]} r={0.002} p={[0.07, 0.18, -0.03]}>{M.steel({ col: "#3a3e44" })}</RBox>
    <mesh position={[0.07, 0.31, -0.03]}><sphereGeometry args={[0.014, 16, 12]} />{M.glow({ col: "#ffd59a", op: 0.4 + 0.6 * lamp })}</mesh>
    <pointLight position={[0.07, 0.29, 0.0]} intensity={0.6 * lamp} distance={0.5} color="#ffd59a" />
    <mesh position={[0.02, 0.0505, 0.03]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.09, 32]} /><meshBasicMaterial color="#ffe3b0" transparent opacity={0.35 * lamp} depthWrite={false} /></mesh>
    <group position={[0.0, 0.05, lerp(0.15, 0.03, step)]} scale={1.15 * Math.max(0.001, off)}><Fig cloth="#1e2a44" head={-0.15 * lamp} /><RBox s={[0.05, 0.04, 0.02]} r={0.004} p={[0.04, 0.09, 0.0]}>{M.matte({ col: "#2a1a14" })}</RBox></group>
    <group position={[lerp(-1.6, 0, arr) + 1.9 * go * go, 0, 0.22]} scale={0.6}><TrainCar col="#e8ecef" lit={1} /></group>
    <Snow tt={tt} n={160} w={1.2} sz={0.006} />
  </>;
}}</Scene3D>;

// ---- 7:12 · GRADUACIÓN DE UNO: el gimnasio con telón rojo y blanco, sillas llenas de todo el pueblo; en el escenario un solo chico hace la reverencia ----
export const HGraduation: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#15120e" lamp={[0, 0.8, 0.5]} warm={0.8}
  cam={{ at: [0, 0.12, -0.15], at1: [0, 0.14, -0.35], az: [0.0, 0.0], el: [0.25, 0.14], r: [1.35, 0.85], fov: 32 }}>{(tt) => {
  const bow = 0.7 * eio(tt, 3.2, 3.8) * (1 - eio(tt, 4.6, 5.2));
  return <>
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[-0.9 + i * 0.075, 0.3, -0.62]}><planeGeometry args={[0.075, 0.6]} /><meshStandardMaterial color={i % 2 ? "#f4f1ea" : "#b42a2a"} roughness={0.9} side={THREE.DoubleSide} /></mesh>)}
    <RBox s={[0.9, 0.08, 0.3]} r={0.006} p={[0, 0.04, -0.45]}>{M.wood({ base: [150, 106, 64] })}</RBox>
    <RBox s={[0.08, 0.1, 0.05]} r={0.004} p={[0.22, 0.13, -0.5]}>{M.wood({ base: [110, 74, 44] })}</RBox>
    <group position={[0.22, 0.08, -0.56]} scale={1.2}><Fig cloth="#1e1e24" /></group>
    {Array.from({ length: 5 }, (_, i) => <mesh key={"fl" + i} position={[-0.38 + i * 0.03, 0.12, -0.5]} scale={pop(tt, 0.3 + i * 0.1)}><sphereGeometry args={[0.022, 12, 8]} />{M.matte({ col: ["#f2a5b5", "#ffffff", "#f2d24a"][i % 3] })}</mesh>)}
    <group position={[0, 0.08, -0.38]} rotation={[0, PI, 0]} scale={1.15 * pop(tt, 0.8)}><Fig cloth="#1e2a44" bow={bow} r={[0, PI, 0]} /></group>
    {Array.from({ length: 30 }, (_, i) => { const x = -0.5 + (i % 10) * 0.11, z = -0.15 + Math.floor(i / 10) * 0.13;
      return <group key={"c" + i} position={[x, 0, z]} rotation={[0, PI, 0]} scale={0.9 * pop(tt, 0.1 + rn(i, 2) * 0.6)}>
        <Fig sit={1} cloth={["#2a2a30", "#4a4038", "#3a3a44", "#5a4a3a"][i % 4]} bow={0.15 * Math.max(0, Math.sin((tt - 4.6) * 9 + i)) * eio(tt, 4.6, 4.8)} arm={0.25 * eio(tt, 4.6, 5.0)} arm2={0.25 * eio(tt, 4.6, 5.0)} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 9:00 · A LOS 18 SE VAN: el tren sale del valle con las ventanas llenas; vuelve en Año Nuevo con pocos y se vuelve a ir ----
export const HEighteen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#b8c8c0" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0.05], at1: [0.25, 0.1, 0.05], az: [-0.45, -0.3], el: [0.2, 0.16], r: [0.95, 1.05], fov: 32 }}>{(tt) => {
  const arr = eio(tt, 0.2, 1.6), walk = eio(tt, 1.8, 2.9), board = eio(tt, 2.9, 3.3), go = eio(tt, 3.6, 6.8), x = lerp(-1.6, 0, arr) + 1.9 * go * go;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.2, 2]} /><meshStandardMaterial color="#5f7f42" roughness={0.95} /></mesh>
    <RBox s={[1.2, 0.03, 0.12]} r={0.004} p={[0, 0.015, 0.06]}>{M.matte({ col: "#a9aeb4" })}</RBox>
    {[-0.05, 0.05].map((z, i) => <mesh key={i} position={[0, 0.005, 0.22 + z]}><boxGeometry args={[3.2, 0.008, 0.008]} />{M.steel({ col: "#6a6e74" })}</mesh>)}
    {Array.from({ length: 10 }, (_, i) => <group key={i} scale={pop(tt, 0.05 + i * 0.05)}><Mountain p={[-1.0 + i * 0.24, 0.24, -0.55 - rn(i, 2) * 0.25]} s={[1.3, 1 + rn(i, 3), 1]} col={["#3f6a3a", "#4a7a42", "#355a32"][i % 3]} /></group>)}
    <group position={[-0.32, 0, -0.18]} scale={0.45 * pop(tt, 0.2)}><House lit={[0.6, 0.6, 0.9, 0.9]} col="#d8c9a8" roof="#4a3a30" /></group>
    <group position={[-0.17, 0.03, 0.04]} scale={1.1 * pop(tt, 0.3)}><Fig cloth="#5a4a3a" bow={0.15} arm={go > 0.02 ? 0.5 + 0.35 * Math.sin(tt * 6) : 0} /></group>
    <group position={[-0.08, 0.03, 0.04]} scale={1.05 * pop(tt, 0.4)}><Fig cloth="#6a3a3a" bow={0.25 + 0.15 * go} /></group>
    <group position={[0.06, 0.03, lerp(0.02, 0.12, walk)]} rotation={[0, PI * walk, 0]} scale={1.15 * Math.max(0.001, 1 - board)}>
      <Fig cloth="#2c3a52" /><RBox s={[0.06, 0.07, 0.03]} r={0.008} p={[0, 0.13, -0.035]}>{M.matte({ col: "#b8452e" })}</RBox>
    </group>
    <group position={[x, 0, 0.22]} scale={0.6}><TrainCar col="#d9dde2" lit={1} /></group>
  </>;
}}</Scene3D>;

// ---- 9:43 · AKIYA: el barrio de casas; las ventanas se apagan de a una y aparecen las cintas en cruz ----
export const HAkiya: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#11151b" lamp={[0.2, 0.7, 0.5]}
  cam={{ at: [0, 0.05, 0], at1: [0.1, 0.05, 0.1], az: [-0.3, 0.1], el: [0.55, 0.42], r: [1.5, 1.15], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#3a4a32" roughness={0.95} /></mesh>
  {Array.from({ length: 24 }, (_, i) => { const x = -0.75 + (i % 6) * 0.3, z = -0.45 + Math.floor(i / 6) * 0.3, off = 0.8 + rn(i, 7) * 4.4, k = eio(tt, off, off + 0.6), tape = eio(tt, off + 0.6, off + 1.0), keep = i === 15;
    const L = keep ? 1 : 1 - k;
    return <group key={i} position={[x, 0, z]} scale={0.4 * pop(tt, 0.05 + rn(i, 2) * 0.5)}>
      <House lit={[L, L * 0.8, L, L * 0.6]} col="#d8c9a8" roof="#4a3a30" />
      {!keep ? [0.6, -0.6].map((rz, j) => <mesh key={j} position={[0, 0.17, 0.145]} rotation={[0, 0, rz]} scale={[Math.max(0.001, tape), 1, 1]}><boxGeometry args={[0.32, 0.018, 0.004]} /><meshStandardMaterial color="#e8c23a" /></mesh>) : null}
    </group>; })}
</>}</Scene3D>;

// ---- 10:39 · GENKAI SHURAKU: el pueblo; los jóvenes se van caminando; los que quedan se encorvan; el anillo pasa la mitad ----
export const HGenkai: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#14171c" lamp={[0, 0.8, 0.4]}
  cam={{ at: [0, 0.1, 0], az: [-0.25, 0.2], el: [0.45, 0.38], r: [1.15, 1.0], fov: 32 }}>{(tt) => {
  const ring = 0.25 + 0.4 * eio(tt, 1.6, 5.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.62, 64]} /><meshStandardMaterial color="#4a5a3a" roughness={0.95} /></mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, PI / 2]}><ringGeometry args={[0.58, 0.62, 96, 1, 0, 2 * PI * ring]} />{M.glow({ col: ring > 0.5 ? "#ff9a5a" : "#9ad0ff", op: 0.9 })}</mesh>
    {Array.from({ length: 20 }, (_, i) => { const a = i / 20 * 2 * PI, r = 0.18 + 0.22 * rn(i, 3), young = i % 3 === 0, w = young ? eio(tt, 1.2 + rn(i, 4) * 1.4, 3.0 + rn(i, 4) * 1.4) : 0, old = young ? 0 : eio(tt, 2.0 + rn(i, 5) * 2, 3.0 + rn(i, 5) * 2);
      return <group key={i} position={[Math.cos(a) * (r + w * 0.9), 0, Math.sin(a) * (r + w * 0.9)]} rotation={[0, young && w > 0 ? -a + PI / 2 : rn(i, 6) * 6, 0]} scale={1.2 * pop(tt, 0.1 + i * 0.04) * (1 - 0.15 * old)}>
        <Fig cloth={young ? "#2f6a9a" : old > 0.5 ? "#6a6a6a" : "#7a5a3a"} bow={0.45 * old} head={0.2 * old} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 11:21 · EL CAMIONCITO: sube por la ruta, para; la melodía en ondas; se abren las puertas y salen las abuelas con la bolsita ----
export const HTruck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#b9c8be" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0.05, 0.08, 0.05], az: [-0.35, -0.15], el: [0.3, 0.24], r: [1.05, 0.92], fov: 32 }}>{(tt) => {
  const arr = eio(tt, 0.4, 1.8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.6, 1.8]} /><meshStandardMaterial color="#5f7f42" roughness={0.95} /></mesh>
    <mesh position={[0, 0.003, 0.25]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.6, 0.2]} /><meshStandardMaterial color="#55575c" roughness={0.85} /></mesh>
    {[[-0.35, -0.12], [0.05, -0.18], [0.42, -0.1]].map(([x, z], i) => { const op = eio(tt, 2.4 + i * 0.5, 2.8 + i * 0.5), wk = eio(tt, 2.9 + i * 0.5, 4.2 + i * 0.5);
      return <group key={i}>
        <group position={[x, 0, z - 0.06]} scale={0.42}><House lit={[0.3, 0.3, 0.4, 0.4]} col="#d8c9a8" roof="#4a3a30" /></group>
        <mesh position={[x + 0.035 * op, 0.035, z + 0.0]}><planeGeometry args={[0.04, 0.07]} /><meshStandardMaterial color="#e9e2cf" /></mesh>
        <group position={[x, 0, lerp(z + 0.02, 0.12, wk)]} scale={1.0 * Math.max(0.001, op)}><Fig cloth={["#6a4a5a", "#4a5a6a", "#7a6a4a"][i]} bow={0.4} head={0.2} arm={0.15} /></group>
      </group>; })}
    <group position={[lerp(-1.4, 0.0, arr), 0, 0.25]} scale={0.8}>
      <RBox s={[0.16, 0.13, 0.13]} r={0.02} p={[0.13, 0.085, 0]}>{M.pvc({ col: "#f2efe6" })}</RBox>
      <RBox s={[0.26, 0.15, 0.14]} r={0.01} p={[-0.08, 0.095, 0]}>{M.pvc({ col: "#e9e4d6" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.18 + (i % 6) * 0.04, 0.07 + Math.floor(i / 6) * 0.05, 0.072]}><boxGeometry args={[0.03, 0.03, 0.01]} />{M.plastic({ col: ["#f2d24a", "#e9e9e0", "#c94a3a", "#4a8a4a"][i % 4] })}</mesh>)}
      {[-0.12, 0.13].map((x, i) => <mesh key={"w" + i} position={[x, 0.022, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.15, 16]} />{M.rubber({ col: "#222" })}</mesh>)}
    </group>
    {[1.9, 2.3, 2.7, 3.1].map((a, i) => { const k = cl((tt - a) / 1.3); return k > 0 && k < 1 ? <mesh key={"o" + i} position={[0.05, 0.18, 0.25]} rotation={[0, 0, PI / 4]} scale={0.05 + 0.5 * k}><torusGeometry args={[0.5, 0.012, 8, 48, PI / 2]} />{M.glow({ col: "#ffd59a", op: 1 - k })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 12:50 · EL ARROZ CONTRA EL MONTE: las terrazas con agua; arriba el bosque avanza; ella planta y la terraza de abajo se queda verde ----
export const HRice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#c4d0c4" lamp={[0.4, 0.8, 0.4]}
  cam={{ at: [0, 0.12, 0], az: [-0.45, -0.2], el: [0.3, 0.26], r: [1.15, 1.0], fov: 32 }}>{(tt) => {
  const forest = eio(tt, 1.0, 4.4), plant = Math.floor(12 * eio(tt, 1.6, 5.6));
  return <>
    {[0, 1, 2, 3].map((j) => <group key={j} position={[0, j * 0.07, -j * 0.2]}>
      <RBox s={[1.4, 0.07, 0.2]} r={0.01} p={[0, 0.035, 0]}>{M.matte({ col: "#6a5236" })}</RBox>
      <mesh position={[0, 0.0705, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.36, 0.18]} />{j === 0 ? M.water({ col: "#8fb8c8", op: 0.85 }) : <meshStandardMaterial color="#4f7a34" roughness={0.9} />}</mesh>
    </group>)}
    {Array.from({ length: 24 }, (_, i) => { const row = 1 + Math.floor(i / 8), x = -0.6 + (i % 8) * 0.17 + rn(i, 2) * 0.05, a = 1.0 + (3 - row) * 0.9 + rn(i, 3) * 0.6, k = eio(tt, a, a + 1.0);
      return <group key={i} position={[x, row * 0.07 + 0.07, -row * 0.2]} scale={Math.max(0.001, k * (0.7 + 0.5 * rn(i, 4)))}>
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.006, 0.008, 0.08, 8]} />{M.wood({ base: [90, 64, 40] })}</mesh>
        <mesh position={[0, 0.11, 0]}><coneGeometry args={[0.05, 0.12, 8]} /><meshStandardMaterial color={["#2f5a2a", "#3a6a32", "#284a24"][i % 3]} roughness={0.9} flatShading /></mesh></group>; })}
    {Array.from({ length: 12 }, (_, i) => i < plant ? <mesh key={"r" + i} position={[-0.5 + i * 0.07, 0.085, 0.03 + (i % 2) * 0.05]} scale={pop(tt, 1.6 + i * 0.33)}><coneGeometry args={[0.008, 0.04, 5]} /><meshStandardMaterial color="#7ab84a" /></mesh> : null)}
    <group position={[-0.5 + plant * 0.07, 0.07, 0.08]} rotation={[0, -PI / 2, 0]} scale={1.2 * pop(tt, 0.3)}><Fig cloth="#5a6a8a" hat="#d9c38a" bow={0.9} arm={0.4 + 0.2 * Math.sin(tt * 6)} /></group>
  </>;
}}</Scene3D>;

// ---- 13:40 · HAKAJIMAI: la lápida de la familia con agua e incienso; una grúa chica la levanta y la ladera queda vacía ----
export const HGrave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#9eaab0" lamp={[0.3, 0.7, 0.5]}
  cam={{ at: [0.1, 0.3, 0], az: [-0.32, -0.18], el: [0.14, 0.12], r: [1.3, 1.18], fov: 32 }}>{(tt) => {
  const lift = eio(tt, 2.6, 5.6), bow = 0.7 * eio(tt, 0.6, 1.4) * (1 - eio(tt, 2.0, 2.5)), top = 0.04 + 0.26 * lift + 0.28, tip = 0.72;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#5a6a42" roughness={0.95} /></mesh>
    <RBox s={[0.3, 0.04, 0.22]} r={0.004} p={[0, 0.02, 0]}>{M.matte({ col: "#8a8a86" })}</RBox>
    <group position={[0, 0.04 + 0.26 * lift, 0]} rotation={[0, 0.25 * lift, 0.05 * Math.sin(tt * 2.5) * lift]}>
      <RBox s={[0.18, 0.04, 0.12]} r={0.004} p={[0, 0.02, 0]}>{M.porcelain({ col: "#7d7f80" })}</RBox>
      <RBox s={[0.1, 0.24, 0.08]} r={0.004} p={[0, 0.16, 0]}>{M.porcelain({ col: "#6e7072" })}</RBox>
      {[-0.025, 0, 0.025].map((x, i) => <mesh key={i} position={[x, 0.17, 0.041]}><planeGeometry args={[0.008, 0.16]} /><meshStandardMaterial color="#4a4c4e" /></mesh>)}
      <mesh position={[0, 0.29, 0]}><torusGeometry args={[0.018, 0.004, 8, 20]} />{M.steel({ col: "#333" })}</mesh>
    </group>
    <group position={[0.62, 0, -0.12]} scale={pop(tt, 0.2)}>
      <RBox s={[0.26, 0.07, 0.16]} r={0.01} p={[0, 0.05, 0]}>{M.matte({ col: "#e0b030" })}</RBox>
      {[-0.08, 0.08].map((x, i) => <mesh key={i} position={[x, 0.025, 0.085]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.02, 20]} /><meshStandardMaterial color="#222" /></mesh>)}
      <RBox s={[0.08, 0.07, 0.1]} r={0.008} p={[0.06, 0.12, 0]}>{M.matte({ col: "#d9a42a" })}</RBox>
    </group>
    <mesh geometry={tubeG("cr2", [[0.58, 0.1, -0.12], [0.45, 0.45, -0.08], [0.0, tip, 0.0]], 0.016, 30, 8)}>{M.steel({ col: "#e0b030" })}</mesh>
    <mesh position={[0, (tip + top) / 2, 0]}><cylinderGeometry args={[0.0025, 0.0025, Math.max(0.01, tip - top), 6]} />{M.steel({ col: "#222" })}</mesh>
    {[-0.1, 0.1].map((x, i) => <mesh key={"f" + i} position={[x, 0.07, 0.08]} scale={Math.max(0.001, 1 - lift)}><sphereGeometry args={[0.022, 12, 8]} />{M.matte({ col: i ? "#f2d24a" : "#e9e9f2" })}</mesh>)}
    <group position={[-0.34, 0, 0.16]} rotation={[0, PI * 0.7, 0]} scale={1.3}><Fig cloth="#1e1e24" bow={bow} head={0.25 * lift} /></group>
  </>;
}}</Scene3D>;

// ---- 15:10 · EL MIKOSHI: el santuario portátil con veinte lugares en las varas; llegan nueve, cuatro encorvados; los demás lugares titilan vacíos ----
export const HMikoshi: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a1410" lamp={[0, 0.8, 0.5]} warm={0.9}
  cam={{ at: [0, 0.14, 0], az: [-0.5, -0.25], el: [0.42, 0.32], r: [1.15, 1.0], fov: 32 }}>{(tt) => {
  const slots = Array.from({ length: 20 }, (_, i) => [-0.42 + (i % 10) * 0.094, (Math.floor(i / 10) ? 1 : -1) * 0.16]);
  const fill = [0, 3, 5, 8, 11, 12, 15, 17, 19], lift = 0.02 * Math.max(0, Math.sin((tt - 4.5) * 5)) * eio(tt, 4.5, 4.8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#6a5a48" roughness={0.95} /></mesh>
    <group position={[0, 0.2 + lift, 0]} scale={pop(tt, 0.2)}>
      {[-0.09, 0.09].map((z, i) => <mesh key={i} position={[0, 0, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 1.0, 12]} />{M.wood({ base: [190, 150, 100] })}</mesh>)}
      <RBox s={[0.18, 0.12, 0.18]} r={0.006} p={[0, 0.08, 0]}>{M.matte({ col: "#2a1a14" })}</RBox>
      <mesh position={[0, 0.18, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.17, 0.08, 4]} />{M.brass({ col: "#c9962a" })}</mesh>
      <mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.02, 16, 12]} />{M.brass({ col: "#e0b030" })}</mesh>
      {[[-0.09, -0.09], [0.09, -0.09], [-0.09, 0.09], [0.09, 0.09]].map(([x, z], i) => <mesh key={"p" + i} position={[x, 0.04, z]}><cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />{M.brass({ col: "#c9962a" })}</mesh>)}
    </group>
    {slots.map(([x, z], i) => { const f = fill.indexOf(i), a = 0.8 + f * 0.35, old = f >= 0 && f % 2 === 1 && f < 8;
      return f >= 0 ? <group key={i} position={[x, 0, z * (1 + 0.6 * (1 - eio(tt, a, a + 0.6)))]} rotation={[0, z > 0 ? PI : 0, 0]} scale={1.2 * pop(tt, a)}><Fig cloth={old ? "#6a6a6a" : "#f4f1ea"} bow={old ? 0.35 : 0.05} arm={0.9} /></group>
        : <mesh key={i} position={[x, 0.004, z]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.022, 0.03, 32]} />{M.glow({ col: "#ffd59a", op: (0.35 + 0.35 * Math.sin(tt * 4 + i)) * eio(tt, 3.6, 4.2) })}</mesh>; })}
  </>;
}}</Scene3D>;
