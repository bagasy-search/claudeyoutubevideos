// tdp29b · componentes 1-9 (pueblos sin chicos): las muñecas de Nagoro, las escuelas que cierran, el valle de Iya, los nacimientos.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tubeG } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Fig, House } from "./tkit3d";

const UNI = "#24304a", SKIRT = "#2b2b33";
// ---- piezas propias del video
export const Desk: React.FC<{ p: number[]; s?: number }> = ({ p, s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <RBox s={[0.1, 0.008, 0.07]} r={0.002} p={[0, 0.075, 0]}>{M.wood({ base: [170, 128, 80] })}</RBox>
  {[[-0.044, -0.03], [0.044, -0.03], [-0.044, 0.03], [0.044, 0.03]].map(([x, z], i) => <mesh key={i} position={[x, 0.037, z]}><cylinderGeometry args={[0.003, 0.003, 0.074, 8]} />{M.steel({ col: "#5a5e66" })}</mesh>)}
</group>;
export const School: React.FC<{ p?: number[]; s?: number; lit?: number; r?: number[] }> = ({ p = [0, 0, 0], s = 1, lit = 1, r = [0, 0, 0] }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.5, 0.2, 0.16]} r={0.006} p={[0, 0.1, 0]}>{M.matte({ col: "#efe9dc" })}</RBox>
  <RBox s={[0.54, 0.02, 0.2]} r={0.004} p={[0, 0.21, 0]}>{M.matte({ col: "#7a3a2c" })}</RBox>
  <RBox s={[0.1, 0.1, 0.1]} r={0.004} p={[0, 0.27, 0]}>{M.matte({ col: "#efe9dc" })}</RBox>
  <mesh position={[0, 0.29, 0.051]}><circleGeometry args={[0.025, 24]} /><meshStandardMaterial color="#f8f6f0" /></mesh>
  {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.2 + (i % 5) * 0.1, 0.06 + Math.floor(i / 5) * 0.08, 0.081]}><planeGeometry args={[0.06, 0.05]} />
    <meshBasicMaterial color={new THREE.Color("#1a1d24").lerp(new THREE.Color("#ffd59a"), cl(lit * (0.6 + 0.4 * rn(i, 3))))} toneMapped={false} /></mesh>)}
</group>;
export const Mountain: React.FC<{ p: number[]; s?: number[]; col?: string }> = ({ p, s = [1, 1, 1], col = "#3f6a3a" }) =>
  <mesh position={p as [number, number, number]} scale={s as [number, number, number]} castShadow receiveShadow><coneGeometry args={[0.3, 0.5, 7]} /><meshStandardMaterial color={col} roughness={0.95} flatShading /></mesh>;
export const Bus: React.FC<{ p?: number[]; r?: number[]; s?: number; door?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, door = 0 }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.34, 0.13, 0.12]} r={0.025} p={[0, 0.085, 0]}>{M.pvc({ col: "#f2efe6" })}</RBox>
  <mesh position={[0, 0.098, 0.0605]}><planeGeometry args={[0.3, 0.05]} />{M.glass({ col: "#9cc3e0", op: 0.7 })}</mesh>
  <mesh position={[0, 0.05, 0.0606]}><planeGeometry args={[0.34, 0.014]} /><meshStandardMaterial color="#2f6a9a" /></mesh>
  <mesh position={[0.12 + 0.04 * door, 0.075, 0.061]}><planeGeometry args={[0.045, 0.1]} /><meshStandardMaterial color="#c9ced3" /></mesh>
  {[-0.11, 0.11].map((x, i) => <mesh key={i} position={[x, 0.022, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.13, 16]} />{M.rubber({ col: "#222" })}</mesh>)}
</group>;
// muñeca de trapo y paja: ropa gastada, sombrero de paja
export const Doll: React.FC<{ p?: number[]; r?: number[]; s?: number; cloth?: string; hat?: string; sit?: number; bow?: number; arm?: number; head?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, cloth = "#6a5a48", hat, sit = 0, bow = 0, arm = 0, head = 0 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]}><Fig s={s} col="#e9d9bf" cloth={cloth} hat={hat} sit={sit} bow={bow} arm={arm} head={head} /></group>;

// ---- 0:12 · TODOS LOS PUPITRES OCUPADOS: el aula de madera; en cada pupitre aparece, de a una, una muñeca de uniforme; la maestra en el pizarrón ----
export const HDolls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#17130e" lamp={[-0.5, 0.7, 0.3]} warm={0.8}
  cam={{ at: [0, 0.1, -0.1], at1: [0, 0.1, -0.2], az: [0.25, 0.05], el: [0.32, 0.22], r: [1.25, 0.95], fov: 32 }}>{(tt) => <>
  <RBox s={[0.7, 0.3, 0.02]} r={0.004} p={[0, 0.3, -0.55]}>{M.matte({ col: "#2c4a3a" })}</RBox>
  <RBox s={[0.74, 0.34, 0.015]} r={0.004} p={[0, 0.3, -0.565]}>{M.wood({ base: [110, 74, 44] })}</RBox>
  {[0, 1, 2].map((i) => <mesh key={i} position={[-0.75, 0.32, -0.3 + i * 0.32]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.24, 0.3]} />{M.glow({ col: "#fff1d0", op: 0.55 })}</mesh>)}
  {Array.from({ length: 12 }, (_, i) => { const x = -0.33 + (i % 4) * 0.22, z = -0.25 + Math.floor(i / 4) * 0.22, a = 0.6 + i * 0.32;
    return <group key={i}><Desk p={[x, 0, z]} s={1.3} />
      <group scale={pop(tt, a, 9, 0.5)}><Doll p={[x, 0, z + 0.07]} r={[0, PI, 0]} s={1.15} sit={1} cloth={i % 3 === 1 ? SKIRT : UNI} /></group></group>; })}
  <Doll p={[0.22, 0, -0.48]} s={1.5 * pop(tt, 0.3)} cloth="#5a4a3c" arm={0.5} />
</>}</Scene3D>;

// ---- 0:39 · 450 POR AÑO: un tablero de escuelitas; se apagan de a una y se hunden; el tambor cuenta ----
export const HSchools: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0e1218"
  cam={{ at: [0, 0.05, 0], az: [-0.3, 0.2], el: [0.62, 0.5], r: [1.55, 1.3], fov: 32 }}>{(tt) => {
  const n = Math.round(450 * eio(tt, 0.8, 5.6));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.0, 1.2]} /><meshStandardMaterial color="#3d5a38" roughness={0.95} /></mesh>
    {Array.from({ length: 48 }, (_, i) => { const x = -0.82 + (i % 8) * 0.235, z = -0.45 + Math.floor(i / 8) * 0.18, off = 0.8 + rn(i, 7) * 4.6, k = eio(tt, off, off + 0.5);
      return <group key={i} position={[x + (rn(i, 2) - 0.5) * 0.05, -0.12 * eio(tt, off + 0.4, off + 1.4), z]} scale={0.3 * pop(tt, 0.05 + rn(i, 1) * 0.5)}><School lit={1 - k} /></group>; })}
    <group position={[0, 0.3, 0.35]} rotation={[-0.5, 0, 0]} scale={1.6 * pop(tt, 0.5)}>
      <RBox s={[0.17, 0.08, 0.06]} r={0.01}>{M.brass({ col: "#b88a34" })}</RBox>
      {[0, 1, 2].map((d) => <DigitDrum key={d} v={Math.floor(n / Math.pow(10, 2 - d)) % 10} p={[-0.05 + d * 0.05, 0, 0.031]} r={0.025} w={0.04} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 1:55 · EL VALLE DE IYA: un micro sube por la ruta junto al río verde; las montañas se cierran; un puente de lianas cruza ----
const road = [[-0.9, 0.012, 0.35], [-0.5, 0.012, 0.2], [-0.1, 0.012, 0.28], [0.3, 0.012, 0.05], [0.7, 0.012, -0.15], [1.0, 0.012, -0.35]];
const river = [[-0.9, 0.004, 0.15], [-0.5, 0.004, 0.0], [-0.1, 0.004, 0.08], [0.3, 0.004, -0.15], [0.7, 0.004, -0.35], [1.0, 0.004, -0.55]];
export const HValley: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#c9d6d2" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [-0.45, 0.02, 0.22], at1: [0.35, 0.02, -0.08], az: [0.35, 0.28], el: [1.15, 0.95], r: [2.3, 1.8], fov: 34 }}>{(tt) => {
  const c = new THREE.CatmullRomCurve3(road.map((v) => new THREE.Vector3(v[0], v[1], v[2]))), u = 0.05 + 0.7 * eio(tt, 0.4, 6.8), pt = c.getPoint(u), tg = c.getTangent(u);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.6, 2.0]} /><meshStandardMaterial color="#56763c" roughness={0.95} /></mesh>
    <mesh geometry={tubeG("riv", river, 0.07, 80, 2)} scale={[1, 0.05, 1]}>{M.water({ col: "#3fb39a", op: 0.9 })}</mesh>
    <mesh geometry={tubeG("road", road, 0.035, 80, 2)} scale={[1, 0.2, 1]}><meshStandardMaterial color="#5a5a5e" roughness={0.8} /></mesh>
    {Array.from({ length: 16 }, (_, i) => { const sd = i % 2 ? 1 : -1, x = -0.95 + Math.floor(i / 2) * 0.27;
      return <group key={i} scale={pop(tt, 0.05 + i * 0.05)}><Mountain p={[x, 0.24 + rn(i, 3) * 0.1, sd * (0.66 + rn(i, 4) * 0.2) - x * 0.25]} s={[1.3, 1 + rn(i, 5), 1.1]} col={["#3f6a3a", "#4a7a42", "#355a32"][i % 3]} /></group>; })}
    <mesh geometry={tubeG("vine", [[0.15, 0.09, 0.2], [0.2, 0.04, 0.0], [0.27, 0.09, -0.22]], 0.006, 40, 6)} scale={[1, pop(tt, 1.2), 1]}><meshStandardMaterial color="#6a5a32" roughness={0.9} /></mesh>
    <group position={[pt.x, 0.012, pt.z]} rotation={[0, Math.atan2(-tg.z, tg.x), 0]} scale={0.5}><Bus /></group>
  </>;
}}</Scene3D>;

// ---- 2:31 · LA PARADA DEL MICRO: una muñeca de sombrero espera sentada; el micro llega, abre, espera y se va; ella no se mueve ----
export const HBusStop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#9fb4ad" lamp={[0.4, 0.7, 0.5]}
  cam={{ at: [0.05, 0.12, 0], az: [-0.35, -0.2], el: [0.16, 0.13], r: [0.95, 0.82], fov: 32 }}>{(tt) => {
  const arr = eio(tt, 0.8, 2.2), leave = eio(tt, 4.2, 5.8), door = eio(tt, 2.3, 2.7) * (1 - eio(tt, 3.6, 4.0));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial color="#6b8a4a" roughness={0.95} /></mesh>
    <mesh position={[0, 0.002, 0.28]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 0.24]} /><meshStandardMaterial color="#55575c" roughness={0.85} /></mesh>
    <group position={[0, 0, -0.02]} scale={pop(tt, 0.1)}>
      <RBox s={[0.4, 0.012, 0.18]} r={0.004} p={[0, 0.3, 0]}>{M.wood({ base: [90, 64, 40] })}</RBox>
      {[-0.18, 0.18].map((x, i) => <RBox key={i} s={[0.014, 0.3, 0.014]} r={0.003} p={[x, 0.15, -0.07]}>{M.wood({ base: [80, 56, 36] })}</RBox>)}
      <RBox s={[0.36, 0.25, 0.01]} r={0.003} p={[0, 0.16, -0.085]}>{M.wood({ base: [120, 88, 56] })}</RBox>
      <RBox s={[0.3, 0.012, 0.07]} r={0.003} p={[0, 0.07, -0.04]}>{M.wood({ base: [140, 100, 64] })}</RBox>
      <RBox s={[0.012, 0.32, 0.012]} r={0.003} p={[0.28, 0.16, 0.08]}>{M.steel({})}</RBox>
      <mesh position={[0.28, 0.33, 0.08]}><circleGeometry args={[0.04, 24]} /><meshStandardMaterial color="#2f6a9a" side={THREE.DoubleSide} /></mesh>
    </group>
    <Doll p={[-0.04, 0, -0.03]} s={1.3 * pop(tt, 0.3)} sit={1} cloth="#4a4038" hat="#c9a75a" bow={0.1} />
    <group position={[lerp(-1.4, 0.05, arr) + 1.6 * eio(leave, 0, 1) * eio(leave, 0, 1), 0, 0.28]} scale={0.95}><Bus door={door} /></group>
  </>;
}}</Scene3D>;

// ---- 3:02 · CADA MUÑECA ES ALGUIEN: en la huerta aparece la primera (el padre) y espanta los pájaros; después, alrededor, brotan las demás ----
export const HScarecrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#b9c7b8" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.25], el: [0.35, 0.28], r: [1.05, 1.25], fov: 32 }}>{(tt) => {
  const fly = eio(tt, 0.9, 2.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#6a5236" roughness={0.98} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.012, -0.5 + i * 0.16]} scale={[1, 1, 1]}><boxGeometry args={[1.6, 0.024, 0.06]} /><meshStandardMaterial color="#4f7a34" roughness={0.9} /></mesh>)}
    <Doll p={[0, 0, 0]} s={1.6 * pop(tt, 0.3)} cloth="#5a4a3a" hat="#c9a75a" arm={0.45} />
    {Array.from({ length: 8 }, (_, i) => { const a = rn(i, 2) * 2 * PI;
      return <mesh key={"b" + i} position={[Math.cos(a) * (0.12 + fly * 0.9), 0.05 + fly * (0.4 + rn(i, 3) * 0.3), Math.sin(a) * (0.12 + fly * 0.6)]} rotation={[0, a, Math.sin(tt * 18 + i) * 0.6]} scale={fly < 0.98 ? 1 : 0.001}>
        <coneGeometry args={[0.012, 0.04, 3]} /><meshStandardMaterial color="#1e1e22" /></mesh>; })}
    {Array.from({ length: 14 }, (_, i) => { const a = i / 14 * 2 * PI + 0.3, rr = 0.35 + 0.22 * (i % 2), at = 2.6 + i * 0.22;
      return <group key={i}><Doll p={[Math.cos(a) * rr, 0, Math.sin(a) * rr * 0.75]} r={[0, -a - PI / 2, 0]} s={1.25 * pop(tt, at)} cloth={["#6a3a2c", "#3a4a5a", "#5a5a3a", "#7a6a5a", "#2f3a4a"][i % 5]} hat={i % 3 === 0 ? "#c9a75a" : undefined} sit={i % 4 === 1 ? 1 : 0} />
        <mesh position={[Math.cos(a) * rr, 0.004, Math.sin(a) * rr * 0.75]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, (1 - cl((tt - at) / 1.2)) * 2.4)}><ringGeometry args={[0.03, 0.036, 32]} />{M.glow({ col: "#fff1c0", op: 0.7 })}</mesh></group>; })}
  </>;
}}</Scene3D>;

// ---- 4:10 · DOS MILLONES → 686.000: dos columnas de cunitas; la de 1973 alta, la de hoy se achica hasta un tercio ----
export const Crib: React.FC<{ p: number[]; s?: number }> = ({ p, s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <RBox s={[0.1, 0.012, 0.06]} r={0.004} p={[0, 0.004, 0]}>{M.wood({ base: [214, 190, 150] })}</RBox>
  {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.045 + i * 0.018, 0.025, 0.028]}><cylinderGeometry args={[0.002, 0.002, 0.04, 6]} />{M.wood({ base: [214, 190, 150] })}</mesh>)}
  <RBox s={[0.1, 0.006, 0.006]} r={0.002} p={[0, 0.045, 0.028]}>{M.wood({ base: [214, 190, 150] })}</RBox>
  <mesh position={[0, 0.016, 0]} scale={[1.4, 0.5, 1]}><sphereGeometry args={[0.025, 16, 12]} />{M.matte({ col: "#f2e8d6" })}</mesh>
</group>;
export const HBirths: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0, 0.8, 0.4]}
  cam={{ at: [0, 0.32, 0], az: [-0.25, 0.15], el: [0.14, 0.2], r: [1.55, 1.4], fov: 30 }}>{(tt) => {
  const rows = 12, keep = Math.round(lerp(rows, 4, eio(tt, 2.6, 5.4)));
  const n = Math.round(lerp(2000000, 686000, eio(tt, 2.6, 5.4)));
  const stack = (x: number, nr: number, a0: number, seed: number) => Array.from({ length: rows }, (_, j) => j < nr ? Array.from({ length: 3 }, (_, k) => <group key={j * 3 + k} position={[0, fallY(tt, a0 + j * 0.12, 0.3), 0]}><Crib p={[x + (k - 1) * 0.11, j * 0.052, (rn(j * 3 + k, seed) - 0.5) * 0.02]} /></group>) : null);
  return <>
    {stack(-0.32, rows, 0.3, 2)}
    {stack(0.18, keep, 1.2, 5)}
    <group position={[0.18, 0.72 - 0.4 * eio(tt, 2.6, 5.4), 0.1]} scale={1.3 * pop(tt, 1.6)}>
      <RBox s={[0.36, 0.08, 0.06]} r={0.01}>{M.brass({ col: "#b88a34" })}</RBox>
      {Array.from({ length: 7 }, (_, d) => <DigitDrum key={d} v={Math.floor(n / Math.pow(10, 6 - d)) % 10} p={[-0.15 + d * 0.05, 0, 0.031]} r={0.025} w={0.04} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 4:40 · 2,1 HACEN FALTA, NACEN 1,15: la pareja con dos chicos y un pedacito; uno se vuelve contorno vacío ----
export const HReplace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#15130f" lamp={[0, 0.7, 0.4]}
  cam={{ at: [0.04, 0.17, 0], az: [-0.1, 0.06], el: [0.16, 0.14], r: [1.4, 1.28], fov: 30 }}>{(tt) => {
  const sink = eio(tt, 3.2, 5.0);
  return <>
    {[-0.32, 0.32].map((x, i) => <group key={i} position={[x, 0, 0]} scale={pop(tt, 0.2 + i * 0.6)}>
      <RBox s={[0.5, 0.1, 0.26]} r={0.008} p={[0, 0.05, 0]}>{M.wood({ base: [96, 66, 42] })}</RBox>
      <Sheet map={txt("rep" + i, [i ? "1.15" : "2.1"], { w: 300, h: 110, bg: "#5e3d24", fg: "#f3e2c0", size: 84, font: HANDF })} w={0.2} h={0.072} p={[0, 0.05, 0.1305]} />
      <Fig p={[-0.16, 0.1, 0]} s={1.3} cloth="#3a4a5a" />
      <Fig p={[-0.06, 0.1, 0]} s={1.25} cloth="#8a4a3a" />
      <Fig p={[0.06, 0.1, 0.03]} s={0.8 * pop(tt, 0.9 + i * 0.6)} cloth="#c9a24a" />
    </group>)}
    <group position={[-0.32, 0, 0]} scale={pop(tt, 0.2)}><Fig p={[0.16, 0.1, 0.03]} s={0.8 * pop(tt, 1.3)} cloth="#4a7a5a" /></group>
    <Fig p={[0.48, 0.1 - 0.125 * sink, 0.03]} s={0.8 * pop(tt, 2.2)} cloth="#4a7a5a" />
    <mesh position={[0.48, 0.1005, 0.03]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.022, 0.03, 32]} /><meshBasicMaterial color="#ffd59a" transparent opacity={0.7 * sink} /></mesh>
  </>;
}}</Scene3D>;

// ---- 5:05 · 40 → 3 → 1 → 0: la tribuna de sillitas con chicos; se vacían en olas ----
export const HGrades: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#17130e" lamp={[0.2, 0.7, 0.5]}
  cam={{ at: [0, 0.08, 0], az: [-0.35, 0.2], el: [0.55, 0.42], r: [1.25, 1.05], fov: 30 }}>{(tt) => {
  const keepIdx = [17, 22, 30];
  return <>
    {Array.from({ length: 40 }, (_, i) => { const x = -0.45 + (i % 8) * 0.13, z = -0.3 + Math.floor(i / 8) * 0.14, rank = keepIdx.indexOf(i);
      const a = rank < 0 ? 1.6 + rn(i, 3) * 0.8 : rank === 0 ? 4.8 : 3.4, gone = eio(tt, a, a + 0.5);
      return <group key={i}>
        <RBox s={[0.06, 0.006, 0.05]} r={0.002} p={[x, 0.04, z]}>{M.wood({ base: [170, 128, 80] })}</RBox>
        <RBox s={[0.06, 0.05, 0.006]} r={0.002} p={[x, 0.065, z - 0.025]}>{M.wood({ base: [160, 118, 72] })}</RBox>
        <group position={[x, lerp(0, 0.25, gone), z + 0.005]} scale={Math.max(0.001, 0.75 * pop(tt, 0.1 + i * 0.03) * (1 - gone))}><Fig sit={1} r={[0, PI, 0]} cloth={i % 2 ? UNI : "#8a3a3a"} /></group>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 5:32 · LO QUE QUEDÓ DE LAS ESCUELAS: la escuela en corte; un aula se vuelve pecera, otra bodega de sake, otra hotel; el reloj quieto ----
export const HReuse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#101318" lamp={[0, 0.7, 0.6]}
  cam={{ at: [0, 0.22, 0], az: [-0.2, 0.15], el: [0.1, 0.16], r: [1.2, 1.05], fov: 30 }}>{(tt) => {
  const k1 = eio(tt, 1.0, 1.8), k2 = eio(tt, 2.4, 3.2), k3 = eio(tt, 3.8, 4.6);
  const room = (x: number, ch: React.ReactNode) => <group position={[x, 0.02, 0]}>
    <RBox s={[0.36, 0.008, 0.26]} r={0.002} p={[0, 0.004, 0]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    <RBox s={[0.36, 0.3, 0.01]} r={0.002} p={[0, 0.15, -0.13]}>{M.matte({ col: "#e8e2d4" })}</RBox>{ch}</group>;
  return <>
    <RBox s={[1.2, 0.02, 0.3]} r={0.004} p={[0, 0.34, 0]}>{M.matte({ col: "#7a3a2c" })}</RBox>
    {room(-0.39, <group scale={Math.max(0.001, k1)}>
      <mesh position={[0, 0.12, -0.02]}><boxGeometry args={[0.3, 0.2, 0.14]} />{M.water({ col: "#2f8fc6", op: 0.6 })}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.1 + ((tt * 0.08 + rn(i, 2)) % 0.2), 0.07 + rn(i, 3) * 0.12, -0.04 + rn(i, 4) * 0.06]} rotation={[0, 0, 0]} scale={[1.6, 0.7, 0.5]}><sphereGeometry args={[0.012, 12, 8]} />{M.plastic({ col: ["#ff8a3a", "#ffd23a", "#e9f0f2"][i % 3] })}</mesh>)}
    </group>)}
    {room(0, <group scale={Math.max(0.001, k2)}>{[-0.09, 0, 0.09].map((x, i) => <mesh key={i} position={[x, 0.06, -0.03]}><cylinderGeometry args={[0.04, 0.04, 0.11, 24]} />{M.wood({ base: [180, 140, 90] })}</mesh>)}
      {[-0.09, 0, 0.09].map((x, i) => <mesh key={"r" + i} position={[x, 0.06, -0.03]}><torusGeometry args={[0.041, 0.003, 6, 24]} />{M.steel({ col: "#4a4a4e" })}</mesh>)}</group>)}
    {room(0.39, <group scale={Math.max(0.001, k3)}>{[-0.08, 0.08].map((x, i) => <group key={i}><RBox s={[0.1, 0.02, 0.18]} r={0.008} p={[x, 0.012, 0.0]}>{M.matte({ col: "#f2efe6" })}</RBox><RBox s={[0.08, 0.02, 0.04]} r={0.008} p={[x, 0.028, -0.06]}>{M.matte({ col: "#d8e2ea" })}</RBox></group>)}</group>)}
    <group position={[0, 0.25, -0.12]} scale={pop(tt, 0.3)}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.01, 32]} />{M.porcelain({})}</mesh>
      <mesh position={[0, 0.012, 0.006]} rotation={[0, 0, -0.6]}><boxGeometry args={[0.004, 0.028, 0.002]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0.008, 0, 0.007]} rotation={[0, 0, -2.0]}><boxGeometry args={[0.004, 0.02, 0.002]} /><meshStandardMaterial color="#222" /></mesh>
    </group>
  </>;
}}</Scene3D>;
