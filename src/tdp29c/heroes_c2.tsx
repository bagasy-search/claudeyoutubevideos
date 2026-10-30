// tdp29c · componentes 10-19: el país que cambió rápido, la puerta que no se abre, la heladera de las notas, las fotos, la maqueta, la ley, el enchufe, la pantalla de los puntos, un tercio solos, los jóvenes encerrados.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, rn, tubeG } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Block, Calendar, Fig, House } from "./tkit3d";
import { Bed, Desk, Door } from "./heroes_c1";

// ---- 5:39 · COREA CAMBIÓ RAPIDÍSIMO: un pueblito de techos de teja; en pocos segundos crecen las torres alrededor y el pueblo queda chiquito al pie ----
export const HFast: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#c9d2da" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0], at1: [0, 0.32, 0], az: [-0.4, 0.3], el: [0.45, 0.22], r: [1.1, 1.45], fov: 32 }}>{(tt) => {
  const grow = eio(tt, 1.6, 5.4), dusk = eio(tt, 3.5, 6.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial color={new THREE.Color("#7a8a52").lerp(new THREE.Color("#5a5e64"), grow)} roughness={0.95} /></mesh>
    {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * 2 * PI, r = 0.12 + (i % 2) * 0.06;
      return <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[0, -a, 0]} scale={0.22 * pop(tt, 0.1 + i * 0.06)}><House lit={[0.6 * dusk, 0, 0.8 * dusk, 0]} col="#e2d8c2" roof="#2e3440" /></group>; })}
    {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 2) * 2 * PI, r = 0.4 + rn(i, 3) * 0.45, k = eio(tt, 1.6 + rn(i, 4) * 3.0, 2.4 + rn(i, 4) * 3.0);
      return <group key={"t" + i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} scale={[0.55, Math.max(0.001, 0.4 + 0.9 * rn(i, 5)) * k, 0.55]}><Block cols={4} rows={14} col={["#e9e6df", "#cfd3d8", "#dcd6cc"][i % 3]} on={(j) => (rn(j, i) > 0.55 ? dusk : 0)} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 6:40 · NUNCA LES ENSEÑARON A PEDIR AYUDA: el hombre sentado detrás de su puerta; la mano sube al picaporte, se queda, baja; afuera el pasillo con luz ----
export const HNoHelp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0c0e12" lamp={[-0.3, 0.6, 0.5]}
  cam={{ at: [-0.08, 0.12, 0.04], at1: [-0.04, 0.1, 0.04], az: [-0.75, -0.5], el: [0.14, 0.1], r: [0.95, 0.55], fov: 32 }}>{(tt) => {
  const reach = eio(tt, 1.2, 2.4) * (1 - eio(tt, 4.2, 5.2));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#3a342c" /></mesh>
    <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.012, 0.3, 0.8]} />{M.matte({ col: "#cfc8b8" })}</mesh>
    <group position={[0.007, 0, 0.04]} rotation={[0, PI / 2, 0]}><Door s={1.4} col="#7a8088" /></group>
    <group position={[-0.007, 0, 0.04]} rotation={[0, -PI / 2, 0]}><Door s={1.4} col="#7a8088" /></group>
    <mesh position={[0.3, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.8]} /><meshStandardMaterial color="#b8b0a0" /></mesh>
    <pointLight position={[0.3, 0.25, 0.04]} intensity={0.5} distance={0.6} color="#fff1d0" />
    <mesh position={[-0.04, 0.002, 0.04]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.08, 0.12]} />{M.glow({ col: "#fff1d0", op: 0.35 })}</mesh>
    <pointLight position={[-0.03, 0.02, 0.04]} intensity={0.35} distance={0.3} color="#fff1d0" />
    <group position={[-0.1, 0, 0.06]} rotation={[0, PI / 2, 0]}><Fig sit={1} cloth="#4a4a52" bow={0.15} head={-0.25 + 0.2 * reach} arm={1.3 * reach} s={1.15} /></group>
    <Bed p={[-0.3, 0, -0.1]} s={1.1} col="#4a5260" />
  </>;
}}</Scene3D>;

// ---- 7:14 · LO QUE QUEDA: la heladera con notas e imanes, la lista de remedios, las boletas pagadas; un sobre con plata y una nota encima ----
export const HNotes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#16140f" lamp={[-0.3, 0.7, 0.5]} warm={0.6}
  cam={{ at: [0, 0.22, 0], at1: [0.08, 0.2, 0.05], az: [-0.2, 0.12], el: [0.1, 0.28], r: [0.9, 0.72], fov: 32 }}>{(tt) => {
  const notes = [["pills 8:00", "pills 20:00"], ["electric", "PAID"], ["water", "PAID"], ["rent", "on the 5th"]];
  return <>
    <RBox s={[0.24, 0.46, 0.2]} r={0.02} p={[-0.05, 0.23, -0.05]}>{M.pvc({ col: "#e9e6de" })}</RBox>
    <RBox s={[0.008, 0.08, 0.012]} r={0.003} p={[0.06, 0.32, 0.055]}>{M.steel({ col: "#9a9ea4" })}</RBox>
    {notes.map((l, i) => <group key={i} scale={pop(tt, 0.3 + i * 0.4)}>
      <Sheet map={txt("nt" + i, l, { w: 300, h: 240, bg: ["#f6eb9a", "#f2efe6", "#dfe9f2", "#f2dcd6"][i], fg: "#2a2420", size: 52, font: HANDF })} w={0.08} h={0.064} p={[-0.1 + (i % 2) * 0.09, 0.38 - Math.floor(i / 2) * 0.09, 0.0515]} r={[0, 0, (rn(i, 3) - 0.5) * 0.12]} />
      <mesh position={[-0.1 + (i % 2) * 0.09, 0.405 - Math.floor(i / 2) * 0.09, 0.054]}><sphereGeometry args={[0.006, 12, 8]} />{M.plastic({ col: ["#c94a3a", "#3a7ac9", "#e0b030", "#3ac97a"][i] })}</mesh>
    </group>)}
    <RBox s={[0.3, 0.02, 0.2]} r={0.004} p={[0.22, 0.1, 0.12]}>{M.wood({ base: [130, 96, 60] })}</RBox>
    {[[0.15, 0.06], [0.29, 0.06], [0.15, 0.18], [0.29, 0.18]].map(([x, z], i) => <mesh key={i} position={[x, 0.045, z]}><cylinderGeometry args={[0.005, 0.005, 0.09, 8]} />{M.wood({ base: [100, 70, 44] })}</mesh>)}
    <group position={[0.22, 0.111 + fallY(tt, 2.2, 0.08), 0.12]} scale={pop(tt, 2.2)}>
      <RBox s={[0.11, 0.004, 0.06]} r={0.002}>{M.matte({ col: "#f6f3ea" })}</RBox>
      <RBox s={[0.07, 0.002, 0.03]} r={0.001} p={[0.012, 0.004, 0.0]}>{M.matte({ col: "#b9c9a4" })}</RBox>
    </group>
    <Sheet map={txt("ntland", ["For the landlord.", "Sorry for the trouble."], { w: 512, h: 220, bg: "#fbf8f0", fg: "#22304e", size: 52, font: HANDF })} w={0.17} h={0.073}
      p={[0.225, 0.118 + fallY(tt, 3.0, 0.06), 0.13]} r={[-PI / 2.6, 0, 0.06]} s={pop(tt, 3.0)} />
  </>;
}}</Scene3D>;

// ---- 7:58 · LA MAQUETA: una caja de vidrio sobre una mesa; adentro, en miniatura, la cama, el escritorio, las botellas, el calendario, las fotos; la cámara se mete ----
export const HDiorama: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#121014" lamp={[0, 0.8, 0.4]} warm={0.5}
  cam={{ at: [0, 0.1, 0], at1: [0.0, 0.05, 0.0], az: [-0.4, 0.2], el: [0.42, 0.3], r: [1.0, 0.42], fov: 32 }}>{(tt) => <>
  <RBox s={[0.5, 0.02, 0.36]} r={0.004} p={[0, 0.01, 0]}>{M.wood({ base: [70, 48, 30] })}</RBox>
  <RBox s={[0.4, 0.008, 0.28]} r={0.002} p={[0, 0.024, 0]}>{M.matte({ col: "#b8a888" })}</RBox>
  <mesh position={[0, 0.1, -0.14]}><planeGeometry args={[0.4, 0.16]} /><meshStandardMaterial color="#d8d0c0" side={THREE.DoubleSide} /></mesh>
  <mesh position={[-0.2, 0.1, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.28, 0.16]} /><meshStandardMaterial color="#cfc6b4" side={THREE.DoubleSide} /></mesh>
  <group position={[-0.1, 0.028, -0.03]} scale={pop(tt, 0.4)}><Bed s={0.9} col="#7a8496" /></group>
  <group position={[0.1, 0.028, -0.09]} scale={pop(tt, 0.8)}><Desk s={0.8} /></group>
  {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.03 + i * 0.022, 0.045, 0.08 + (i % 2) * 0.02]} scale={pop(tt, 1.2 + i * 0.15)}><cylinderGeometry args={[0.006, 0.007, 0.034, 12]} />{M.glass({ col: ["#4a8a5a", "#4a8a5a", "#c9b07a", "#4a8a5a", "#8a5a3a"][i], op: 0.8 })}</mesh>)}
  <group scale={pop(tt, 1.8)}><Calendar p={[0.08, 0.13, -0.137]} s={0.18} n={14} title="MAY" /></group>
  {[0, 1, 2].map((i) => <mesh key={"p" + i} position={[-0.17 + i * 0.03, 0.03, 0.09]} rotation={[-PI / 2, 0, rn(i, 2) - 0.5]} scale={pop(tt, 2.2 + i * 0.2)}><planeGeometry args={[0.024, 0.018]} /><meshStandardMaterial color={["#e9d7b0", "#d7c9b8", "#e0d0c0"][i]} /></mesh>)}
  <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.42, 0.2, 0.3]} />{M.glass({ col: "#eaf4ff", op: 0.12 })}</mesh>
  <mesh position={[0.1, 0.14, -0.03]}><sphereGeometry args={[0.012, 12, 8]} />{M.glow({ col: "#ffe2b0", op: 0.9 })}</mesh>
  <pointLight position={[0.1, 0.14, -0.03]} intensity={0.25} distance={0.25} color="#ffe2b0" />
</>}</Scene3D>;

// ---- 8:24 · LA LEY DE 2021: la hoja de la ley con el sello; de ella salen hilos a las oficinas de cada distrito, que se encienden en un mapa ----
export const HLaw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#10141c" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.02, 0.36], at1: [0, 0.04, 0.1], az: [-0.15, 0.12], el: [0.95, 0.85], r: [0.55, 1.3], fov: 32 }}>{(tt) => {
  const stamp = eio(tt, 1.0, 1.3), sp = eio(tt, 2.0, 5.5);
  const offs = Array.from({ length: 18 }, (_, i) => [-0.55 + (i % 6) * 0.22 + (rn(i, 2) - 0.5) * 0.06, -0.5 + Math.floor(i / 6) * 0.19 + (rn(i, 3) - 0.5) * 0.05]);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.3]} /><meshStandardMaterial color="#2a3a2e" roughness={0.95} /></mesh>
    <group position={[0, 0.003, 0.36]} rotation={[-PI / 2, 0, 0]} scale={pop(tt, 0.2)}>
      <mesh><planeGeometry args={[0.22, 0.28]} /><meshStandardMaterial map={txt("lawdoc", ["LONELY DEATH", "PREVENTION ACT", "", "find people at risk", "build support", "count every few years"], { w: 440, h: 560, bg: "#f6f1e4", fg: "#22304e", size: 40, lh: 66 })} roughness={0.9} /></mesh>
      <mesh position={[0.06, -0.09, 0.002 + 0.06 * (1 - stamp)]}><circleGeometry args={[0.035, 32]} /><meshBasicMaterial color="#c0392b" transparent opacity={0.85 * stamp} /></mesh>
      <mesh position={[0.06, -0.09, 0.003]}><planeGeometry args={[0.05, 0.02]} /><meshStandardMaterial map={txt("law21", ["2021"], { w: 200, h: 80, bg: "#c0392b", fg: "#fbe9e0", size: 60 })} transparent opacity={stamp} /></mesh>
    </group>
    {offs.map(([x, z], i) => { const d = Math.hypot(x, z - 0.36), k = cl(sp * 1.6 - d * 1.2);
      return <group key={i}>
        <mesh position={[x / 2, 0.004, (z + 0.36) / 2]} rotation={[-PI / 2, 0, -Math.atan2(z - 0.36, x)]} scale={[Math.max(0.001, k), 1, 1]}><planeGeometry args={[d, 0.004]} />{M.glow({ col: "#ffd59a", op: 0.6 })}</mesh>
        <group position={[x, 0, z]} scale={0.18}><House lit={[k, k, k, k]} col="#cfd3d8" roof="#3a4250" /></group>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 9:08 · EL ENCHUFE INTELIGENTE: la cajita blanca entre la pared y la heladera; la luz late con el consumo; cuando se queda quieta, sale un aviso por el cable ----
export const HPlug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#14130f" lamp={[-0.3, 0.7, 0.5]}
  cam={{ at: [-0.14, 0.12, 0.0], at1: [-0.17, 0.2, -0.04], az: [1.05, 1.2], el: [0.12, 0.08], r: [0.62, 0.6], fov: 32 }}>{(tt) => {
  const flat = eio(tt, 3.0, 3.4), alert = eio(tt, 4.4, 5.0);
  const beat = (1 - flat) * (0.5 + 0.5 * Math.sin(tt * 6));
  return <>
    <mesh position={[-0.2, 0.25, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[1.4, 0.6]} /><meshStandardMaterial color="#e8dcc0" /></mesh>
    <RBox s={[0.012, 0.05, 0.04]} r={0.004} p={[-0.194, 0.08, 0]}>{M.pvc({ col: "#f2efe6" })}</RBox>
    <group position={[-0.17, 0.08, 0]} scale={2.0 * pop(tt, 0.3)}>
      <RBox s={[0.035, 0.05, 0.04]} r={0.008}>{M.pvc({ col: "#fbfaf6" })}</RBox>
      <mesh position={[0.0185, 0.012, 0]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.006, 16]} />{M.glow({ col: flat > 0.5 ? (alert > 0.1 ? "#ffcf3a" : "#9aa4b0") : "#3ae07a", op: 0.4 + 0.6 * (flat > 0.5 ? 0.5 + 0.5 * Math.sin(tt * 10) * alert : beat) })}</mesh>
    </group>
    <mesh position={[-0.15, 0.03, -0.13]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.22, 6]} />{M.rubber({ col: "#2a2a2a" })}</mesh>
    <RBox s={[0.16, 0.34, 0.16]} r={0.02} p={[-0.1, 0.17, -0.3]}>{M.pvc({ col: "#e6e2d8" })}</RBox>
    {Array.from({ length: 12 }, (_, i) => { const x = -0.07 + i * 0.012, y = 0.22 + 0.03 * (1 - flat) * Math.sin(tt * 6 - i * 0.8);
      return <mesh key={i} position={[-0.193, y, x]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.008, 0.003]} />{M.glow({ col: flat > 0.5 ? "#9aa4b0" : "#3ae07a", op: 0.9 })}</mesh>; })}
    <mesh geometry={tubeG("plugln", [[-0.185, 0.1, 0.0], [-0.19, 0.24, -0.04], [-0.17, 0.33, -0.1]], 0.003, 40, 6)} scale={[1, 1, 1]} visible={alert > 0.02}>{M.glow({ col: "#ffcf3a", op: 0.9 * alert })}</mesh>
    <group position={[-0.15, 0.27, -0.11]} rotation={[0, PI / 2, 0]} scale={pop(tt, 4.4)}><House s={0.38} lit={[eio(tt, 5.4, 5.8), 0, eio(tt, 5.4, 5.8), 0]} col="#e9dcc4" roof="#2a2e36" /></group>
    <RBox s={[0.008, 0.03, 1.4]} r={0.002} p={[-0.196, 0.015, 0]}>{M.wood({ base: [120, 86, 52] })}</RBox>
    <RBox s={[0.14, 0.02, 0.5]} r={0.004} p={[-0.13, 0.045, 0.12]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    <mesh position={[-0.199, 0.3, 0.2]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.16, 0.12]} /><meshStandardMaterial color="#cfe0ef" /></mesh>
  </>;
}}</Scene3D>;

// ---- 9:38 · LA PANTALLA DE LA ASISTENTE: 400 puntos verdes en un monitor; uno se vuelve amarillo; ella sola frente a todos ----
export const HScreen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0b0e14" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.22, 0], at1: [0.0, 0.18, 0.1], az: [0.0, -0.3], el: [0.08, 0.2], r: [0.55, 1.0], fov: 34 }}>{(tt) => {
  const y = eio(tt, 1.6, 2.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#2a2c32" /></mesh>
    <RBox s={[0.6, 0.02, 0.24]} r={0.004} p={[0, 0.12, 0.05]}>{M.wood({ base: [140, 110, 80] })}</RBox>
    <RBox s={[0.44, 0.27, 0.02]} r={0.008} p={[0, 0.29, -0.02]}>{M.matte({ col: "#14161c" })}</RBox>
    <mesh position={[0, 0.29, -0.009]}><planeGeometry args={[0.42, 0.25]} /><meshBasicMaterial color="#0c1a14" /></mesh>
    {Array.from({ length: 400 }, (_, i) => { const c = i % 25, r = Math.floor(i / 25), on = pop(tt, 0.2 + (i / 400) * 1.2, 12), yel = i === 187 ? y : 0;
      return <mesh key={i} position={[-0.195 + c * 0.0163, 0.395 - r * 0.0138, -0.008]} scale={on}><circleGeometry args={[0.0045 + 0.004 * yel * (0.6 + 0.4 * Math.sin(tt * 8)), 10]} />{M.glow({ col: yel > 0.5 ? "#ffcf3a" : "#3ae07a", op: 0.9 })}</mesh>; })}
    <pointLight position={[0, 0.3, 0.2]} intensity={0.35} distance={0.8} color="#7affb0" />
    <group position={[0.0, 0, 0.3]} rotation={[0, PI, 0]}><Fig sit={1} cloth="#5a3a4a" s={1.4} head={-0.1} /></group>
    <Sheet map={txt("sc400", ["400+", "just me"], { w: 360, h: 200, bg: "#f6eb9a", fg: "#2a2420", size: 80, font: HANDF })} w={0.09} h={0.05} p={[0.26, 0.36, -0.005]} r={[0, -0.2, 0.05]} s={pop(tt, 3.6)} />
  </>;
}}</Scene3D>;

// ---- 10:20 · UNO DE CADA TRES: una cuadrícula de 30 casas; un tercio pasa a tener una sola ventana prendida y un solo cepillo; el contador «7 million homes» ----
export const HThird: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0e1218" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.05, 0], az: [-0.25, 0.15], el: [0.6, 0.48], r: [1.35, 1.15], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.4]} /><meshStandardMaterial color="#232a24" /></mesh>
  {Array.from({ length: 30 }, (_, i) => { const x = -0.6 + (i % 6) * 0.24, z = -0.38 + Math.floor(i / 6) * 0.19, one = i % 3 === 1, k = one ? eio(tt, 1.2 + rn(i, 2) * 2.4, 1.8 + rn(i, 2) * 2.4) : 0;
    return <group key={i} position={[x, 0, z]} scale={0.3 * pop(tt, 0.05 + i * 0.025)}>
      <House lit={one ? [0, 0, 0, 0.3 + 0.7 * k] : [0.9, 0.8, 0.9, 0.7]} col={one ? new THREE.Color("#d8d0c0").lerp(new THREE.Color("#8a8e98"), k).getStyle() : "#d8d0c0"} roof="#3a4250" />
      {!one && [0, 1, 2].map((m) => <Fig key={m} p={[-0.12 + m * 0.1, 0, 0.2]} s={0.9} cloth={["#5a4a3a", "#8a4a3a", "#3a5a6a"][m]} />)}
      {one && <Fig p={[0, 0, 0.2]} s={0.9 * Math.max(0.001, 1 - 0.0 * k)} cloth="#4a4a52" head={-0.2 * k} />}
    </group>; })}
  <Sheet map={txt("th7", ["1 in 3 homes", "7 million"], { w: 520, h: 220, bg: "#f2ead8", fg: "#2a2420", size: 76, font: HANDF })} w={0.3} h={0.127} p={[0, 0.32, 0.1]} r={[-0.5, 0, -0.02]} s={pop(tt, 4.4)} em={0.12} />
</>}</Scene3D>;

// ---- 11:05 · LA VERSIÓN JOVEN: un cuarto con la cortina cerrada; afuera pasan días y noches por la ventana; adentro sólo cambia el brillo de la pantalla ----
export const HYounger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0b0c10" lamp={[0, 0.5, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0, 0.14, -0.02], az: [-0.3, 0.2], el: [0.18, 0.12], r: [0.95, 0.72], fov: 32 }}>{(tt) => {
  const day = 0.5 + 0.5 * Math.sin(tt * 2.4 - 1.5), days = Math.floor(tt * 2.4 / (2 * PI));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1, 1]} /><meshStandardMaterial color="#4a4038" /></mesh>
    <mesh position={[0, 0.22, -0.25]}><planeGeometry args={[1, 0.44]} /><meshStandardMaterial color="#8a8478" /></mesh>
    <mesh position={[0.15, 0.26, -0.249]}><planeGeometry args={[0.2, 0.16]} /><meshBasicMaterial color={new THREE.Color("#0a1020").lerp(new THREE.Color("#bfe0ff"), day)} toneMapped={false} /></mesh>
    <mesh position={[0.15, 0.26, -0.245]}><planeGeometry args={[0.22, 0.18]} /><meshStandardMaterial color="#3a3a5a" transparent opacity={0.88} /></mesh>
    <mesh position={[0.15, 0.26, -0.244]}><planeGeometry args={[0.005, 0.18]} /><meshBasicMaterial color={new THREE.Color("#0a1020").lerp(new THREE.Color("#f2f8ff"), day)} toneMapped={false} /></mesh>
    <Bed p={[-0.2, 0, -0.08]} r={[0, 0, 0]} s={1.2} col="#3a4252" />
    <Desk p={[0.12, 0, -0.12]} s={1.2} />
    <mesh position={[0.12, 0.13, -0.15]}><boxGeometry args={[0.09, 0.055, 0.004]} /><meshBasicMaterial color={new THREE.Color("#3a5a9a").lerp(new THREE.Color("#a0c0ff"), 0.5 + 0.5 * Math.sin(tt * 7))} toneMapped={false} /></mesh>
    <pointLight position={[0.12, 0.13, -0.08]} intensity={0.4} distance={0.35} color="#9ab8ff" />
    <group position={[0.12, 0, -0.03]} rotation={[0, PI, 0]}><Fig sit={1} cloth="#2a2a30" head={-0.15} s={1.15} /></group>
    {Array.from({ length: Math.min(12, days + 1) }, (_, i) => <RBox key={i} s={[0.022, 0.03, 0.022]} r={0.004} p={[0.32 - (i % 4) * 0.026, 0.015 + Math.floor(i / 4) * 0.031, 0.08]}>{M.matte({ col: "#e9e4d8" })}</RBox>)}
  </>;
}}</Scene3D>;
