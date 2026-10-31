// tdp29d · componentes 11-20: San'ya y Kamagasaki, la doya, cuarenta y cuatro, el registro, caerse de todo, en medias, las naranjas, la detective, la luz del porche, la sopa.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, rn, tubeG } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Bowl, Calendar, Can, Fig, House, Tatami } from "./tkit3d";
import { Box } from "./heroes_d1";

const Pin3: React.FC<{ p: number[]; col?: string; s?: number }> = ({ p, col = "#c0392b", s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.04, 6]} />{M.steel()}</mesh>
  <mesh position={[0, 0.043, 0]}><sphereGeometry args={[0.008, 16, 12]} />{M.plastic({ col })}</mesh>
</group>;

// ---- 7:03 · SAN'YA Y KAMAGASAKI: el archipiélago de madera; se clavan dos alfileres rojos en Tokio y Osaka; de cada uno sube un barrio en miniatura de pensiones viejas con carteles ----
export const HMapDistricts: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#e8e2d4" lamp={[0.2, 0.8, 0.5]}
  cam={{ at: [0, 0.03, 0], at1: [0.12, 0.05, -0.05], az: [-0.2, 0.15], el: [0.85, 0.55], r: [1.1, 0.75], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#b9d0dc" /></mesh>
  {[[-0.5, 0.25, 0.2, 0.14, 0.3], [-0.15, 0.1, 0.36, 0.17, 0.15], [0.25, -0.05, 0.38, 0.15, -0.2], [0.55, -0.25, 0.2, 0.12, -0.5]].map(([x, z, w, d, r], i) =>
    <RBox key={i} s={[w, 0.03, d]} r={0.02} p={[x, 0.015, z]} rot={[0, r, 0]}>{M.wood({ base: [200, 180, 140] })}</RBox>)}
  {[[0.3, -0.08, "Tokyo · San'ya"], [-0.05, 0.08, "Osaka · Kamagasaki"]].map(([x, z, l], i) => <group key={i} position={[x as number, 0.03, z as number]}>
    <group position={[0, fallY(tt, 0.5 + i * 0.8, 0.2), 0]}><Pin3 p={[0, 0, 0]} s={1.4} /></group>
    {Array.from({ length: 7 }, (_, j) => <group key={j} scale={pop(tt, 1.6 + i * 0.8 + j * 0.15)}><RBox s={[0.025, 0.03 + rn(i * 7 + j, 2) * 0.03, 0.022]} r={0.002} p={[Math.cos(j * 0.9) * 0.06, 0.025, Math.sin(j * 0.9) * 0.04]}>{M.matte({ col: ["#a89a88", "#8a8e94", "#b8a890"][j % 3], em: "#ffd59a", emI: 0.15 })}</RBox></group>)}
    <Sheet map={txt("dst" + i, [l as string], { w: 520, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 50 })} w={0.17} h={0.033} p={[0, 0.1, 0.02]} r={[-0.5, 0, 0]} s={pop(tt, 1.2 + i * 0.8)} />
  </group>)}
</>}</Scene3D>;

// ---- 7:18 · LA DOYA: corte de un edificio de pensiones; un cuarto de tres tatamis con futón, tele chiquita, perchero, ventana de papel; 2.000 yenes en monedas sobre la ventanilla; la llave con su tablita de plástico ----
export const HDoya: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#14120e" lamp={[-0.2, 0.6, 0.6]} warm={0.8}
  cam={{ at: [0, 0.14, 0], at1: [-0.04, 0.08, 0.02], az: [-0.3, 0.1], el: [0.3, 0.42], r: [1.0, 0.68], fov: 32 }}>{(tt) => <>
  {Array.from({ length: 6 }, (_, i) => { const x = -0.32 + (i % 3) * 0.32, y = Math.floor(i / 3) * 0.17, me = i === 1;
    return <group key={i} position={[x, y, 0]} scale={pop(tt, 0.2 + i * 0.12)}>
      <RBox s={[0.3, 0.16, 0.2]} r={0.003} p={[0, 0.08, -0.1]}>{M.matte({ col: "#2a2620", side: THREE.BackSide })}</RBox>
      <group position={[0, 0.004, -0.1]} scale={0.28}><Tatami w={1.0} d={0.7} /></group>
      <RBox s={[0.12, 0.012, 0.06]} r={0.004} p={[-0.06, 0.012, -0.12]}>{M.matte({ col: me ? "#e8e2d4" : "#c9c2b4" })}</RBox>
      <RBox s={[0.04, 0.03, 0.02]} r={0.002} p={[0.1, 0.09, -0.19]}>{M.matte({ col: "#1a1c22" })}</RBox>
      <mesh position={[0.1, 0.09, -0.179]}><planeGeometry args={[0.034, 0.022]} /><meshBasicMaterial color={me ? "#7aa0d0" : "#3a4a5a"} toneMapped={false} /></mesh>
      <mesh position={[0, 0.1, -0.199]}><planeGeometry args={[0.07, 0.05]} /><meshBasicMaterial color={new THREE.Color("#e8dcc0").multiplyScalar(0.5 + 0.5 * rn(i, 2))} toneMapped={false} /></mesh>
      {me && <pointLight position={[0, 0.12, -0.05]} intensity={0.3} distance={0.3} color="#ffe2b0" />}
    </group>; })}
  <group position={[0.0, 0.0, 0.16]}>
    <RBox s={[0.5, 0.06, 0.06]} r={0.006} p={[0, 0.03, 0]}>{M.wood({ base: [120, 86, 52] })}</RBox>
    {[0, 1].map((i) => <group key={i} position={[-0.06 + i * 0.03, 0.06 + fallY(tt, 2.4 + i * 0.3, 0.1), 0.01]} scale={pop(tt, 2.4 + i * 0.3)}><mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.05, 0.025]} /><meshStandardMaterial color="#d8d2b8" /></mesh></group>)}
    <Sheet map={txt("2000", ["¥2,000 a night"], { w: 400, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 56, font: HANDF })} w={0.13} h={0.033} p={[-0.17, 0.075, 0.035]} s={pop(tt, 2.0)} />
    <group position={[0.08, 0.063 + 0.03 * eio(tt, 3.6, 4.2), 0.0]} scale={pop(tt, 3.4)}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.002, 0.002, 0.03, 8]} />{M.brass()}</mesh>
      <RBox s={[0.022, 0.05, 0.006]} r={0.004} p={[0.026, -0.01, 0]}>{M.plastic({ col: "#d8483a" })}</RBox>
    </group>
  </group>
</>}</Scene3D>;

// ---- 8:36 · CUARENTA Y CUATRO: de noche, la máquina expendedora; dos latas de café en el cordón; el viejo se levanta, se lleva una sola lata y entra; queda una lata y un «44» en el vapor ----
export const HFortyFour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#06070c" lamp={[0, 0.5, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0.05, 0.1, 0.05], az: [-0.3, -0.1], el: [0.15, 0.1], r: [1.0, 0.75], fov: 32 }}>{(tt) => {
  const up = eio(tt, 2.6, 3.4), walk = eio(tt, 3.4, 5.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2a2c30" roughness={0.4} metalness={0.2} /></mesh>
    <RBox s={[0.18, 0.36, 0.12]} r={0.008} p={[-0.3, 0.18, -0.15]}>{M.pvc({ col: "#d8e2ea" })}</RBox>
    <mesh position={[-0.3, 0.24, -0.089]}><planeGeometry args={[0.15, 0.18]} />{M.glow({ col: "#eaf6ff", op: 0.92 })}</mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.355 + (i % 4) * 0.037, 0.3 - Math.floor(i / 4) * 0.055, -0.088]}><cylinderGeometry args={[0.009, 0.009, 0.03, 12]} /><meshStandardMaterial color={["#c0392b", "#2a6ab0", "#e0b030", "#3a3a3a"][i % 4]} /></mesh>)}
    <pointLight position={[-0.3, 0.2, 0.05]} intensity={0.7} distance={0.8} color="#eaf6ff" />
    <RBox s={[0.6, 0.03, 0.06]} r={0.004} p={[0.05, 0.015, 0.05]}>{M.matte({ col: "#7a7a7c" })}</RBox>
    <Fig p={[-0.04, 0.03, 0.06]} s={1.1} sit={1} cloth="#5a6a7a" head={0.15 * Math.sin(tt * 2)} />
    <group position={[lerp(0.1, 0.42, walk), lerp(0.03, 0, up), lerp(0.06, -0.2, walk)]} rotation={[0, walk > 0.01 ? -0.6 : 0, 0]}><Fig s={1.1} sit={1 - up} cloth="#3a3a3a" head={-0.3} arm={0.6 * up} /></group>
    <group position={[0.02, 0.03, 0.08]} scale={0.32}><Can col="#7a4a2a" /></group>
    <group position={[lerp(0.06, 0.42, walk), 0.03 + 0.06 * up, lerp(0.09, -0.2, walk)]} scale={0.32}><Can col="#7a4a2a" /></group>
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.4 + rn(i, 2)) % 1); return <mesh key={i} position={[0.02 + Math.sin(i + tt) * 0.01, 0.06 + k * 0.12, 0.08]} scale={0.006 + 0.012 * k}><sphereGeometry args={[1, 8, 6]} />{M.glow({ col: "#e8ecf2", op: 0.18 * (1 - k) })}</mesh>; })}
    <Sheet map={txt("44", ["She would be 44 now."], { w: 520, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 50, font: HANDF })} w={0.19} h={0.037} p={[0.14, 0.2, 0.0]} s={pop(tt, 1.2) * (1 - eio(tt, 6.6, 7.2) * 0.999)} />
  </>;
}}</Scene3D>;

// ---- 8:55 · EL REGISTRO: una tarjeta de residencia en el centro; de ella salen hilos de luz a las piezas de la vida: seguro, jubilación, escuela, impuestos, voto, banco ----
const LIFE = ["health insurance", "pension", "kids' school", "tax", "voting card", "bank letters"];
export const HRegistry: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#101318" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.05, 0], az: [-0.2, 0.15], el: [0.8, 0.7], r: [0.95, 0.85], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#3a3226" roughness={0.9} /></mesh>
  <group scale={pop(tt, 0.2)}>
    <RBox s={[0.17, 0.006, 0.11]} r={0.006} p={[0, 0.01, 0]}>{M.matte({ col: "#f2ead8" })}</RBox>
    <mesh position={[0, 0.0135, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.1]} /><meshStandardMaterial map={txt("reg", ["RESIDENCE", "REGISTRATION", "address: ______"], { w: 480, h: 300, bg: "#f2ead8", fg: "#22304e", size: 46 })} /></mesh>
  </group>
  {LIFE.map((l, i) => { const a = (i / LIFE.length) * 2 * PI + 0.3, x = Math.cos(a) * 0.36, z = Math.sin(a) * 0.24, k = eio(tt, 1.0 + i * 0.5, 1.8 + i * 0.5);
    return <group key={i}>
      <mesh geometry={tubeG("rg" + i, [[0, 0.015, 0], [x * 0.5, 0.05, z * 0.5], [x, 0.015, z]], 0.0022, 30, 6)} scale={[1, 1, 1]} visible={k > 0.05}>{M.glow({ col: "#ffcf8a", op: 0.8 * k })}</mesh>
      <group position={[x, 0.012, z]} scale={pop(tt, 1.0 + i * 0.5)}><Sheet map={txt("lf" + i, [l], { w: 400, h: 110, bg: "#f6f1e4", fg: "#2a2420", size: 50 })} w={0.14} h={0.038} r={[-PI / 2, 0, 0]} em={0.15 * k} /></group>
    </group>; })}
</>}</Scene3D>;

// ---- 9:21 · CAERSE DE TODO: el mismo tablero; la tarjeta se da vuelta en blanco; los hilos se cortan de a uno; la figura parada sobre la tarjeta se vuelve transparente ----
export const HFallOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0c0e12" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.07, 0], az: [0.15, -0.1], el: [0.85, 0.78], r: [0.95, 0.88], fov: 32 }}>{(tt) => {
  const flip = eio(tt, 0.6, 1.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2a2620" roughness={0.9} /></mesh>
    <group rotation={[0, 0, PI * flip]} position={[0, 0.01 + 0.04 * Math.sin(PI * flip), 0]}>
      <RBox s={[0.17, 0.006, 0.11]} r={0.006}>{M.matte({ col: "#f2ead8" })}</RBox>
      <mesh position={[0, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.1]} /><meshStandardMaterial map={txt("reg2", ["RESIDENCE", "REGISTRATION", "address: ______"], { w: 480, h: 300, bg: "#f2ead8", fg: "#22304e", size: 46 })} /></mesh>
    </group>
    {LIFE.map((l, i) => { const a = (i / LIFE.length) * 2 * PI + 0.3, x = Math.cos(a) * 0.26, z = Math.sin(a) * 0.17, cut = eio(tt, 1.6 + i * 0.75, 2.0 + i * 0.75);
      return <group key={i}>
        <mesh geometry={tubeG("fo" + i, [[0, 0.015, 0], [x * 0.5, 0.05, z * 0.5], [x, 0.015, z]], 0.0022, 30, 6)} scale={[1, Math.max(0.001, 1 - cut), 1]}>{M.glow({ col: "#ffcf8a", op: 0.8 * (1 - cut) })}</mesh>
        <group position={[x * (1 + 0.12 * cut), 0.014, z * (1 + 0.12 * cut)]}><Sheet map={txt("lf" + i, [l], { w: 400, h: 110, bg: "#f6f1e4", fg: "#2a2420", size: 56 })} w={0.18} h={0.05} r={[-PI / 2, 0, (rn(i, 7) - 0.5) * 0.3 * cut]} em={0.45 - 0.25 * cut} /></group>
      </group>; })}
    <group position={[0, 0.02, 0]} scale={1.4}>
      <mesh position={[0, 0.06, 0]}><capsuleGeometry args={[0.018, 0.06, 6, 12]} /><meshStandardMaterial color="#2a2c34" transparent opacity={1} /></mesh>
      <mesh position={[0, 0.125, 0]}><sphereGeometry args={[0.018, 16, 12]} /><meshStandardMaterial color="#d8b89a" transparent opacity={1} /></mesh>
    </group>
    <pointLight position={[0.2, 0.35, 0.3]} intensity={0.35} distance={1.0} color="#fff0d0" />
  </>;
}}</Scene3D>;

// ---- 10:34 · EN MEDIAS: la escalera metálica de tres tramos de noche; cajas rotuladas a mano «Kitchen», «Books», «Winter» bajan; los pies van en medias y no hacen ruido ----
export const HSocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0b0d14" lamp={[-0.3, 0.7, 0.5]}
  cam={{ at: [-0.08, 0.2, 0], at1: [0.04, 0.13, 0], az: [-0.12, 0.06], el: [0.16, 0.12], r: [0.92, 0.82], fov: 32 }}>{(tt) => {
  const N = 12, sx = (k: number) => -0.28 + k * 0.04, sy = (k: number) => 0.36 - (k + 1) * 0.03;
  return <>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.002, 0]}><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#3a3c42" roughness={0.9} /></mesh>
  <mesh position={[0, 0.45, -0.1]}><planeGeometry args={[2.4, 1]} /><meshStandardMaterial color="#6a6e76" roughness={0.9} /></mesh>
  <RBox s={[0.24, 0.36, 0.14]} r={0.002} p={[-0.42, 0.18, -0.025]}>{M.matte({ col: "#8a8e96" })}</RBox>
  {Array.from({ length: N }, (_, k) => <RBox key={k} s={[0.04, sy(k), 0.12]} r={0.001} p={[sx(k) + 0.02, sy(k) / 2, -0.035]}>{M.matte({ col: k % 2 ? "#8a8e96" : "#868a92" })}</RBox>)}
  {Array.from({ length: N }, (_, k) => <mesh key={"n" + k} position={[sx(k) + 0.02, sy(k) + 0.001, 0.0255]}><boxGeometry args={[0.04, 0.003, 0.003]} />{M.steel({ col: "#c9a040" })}</mesh>)}
  {Array.from({ length: 5 }, (_, k) => { const x = -0.26 + k * 0.11, kk = Math.max(0, Math.min(N - 1, Math.floor((x + 0.28) / 0.04))), y0 = x < -0.28 ? 0.36 : sy(kk);
    return <mesh key={"po" + k} position={[x, y0 + 0.06, 0.02]}><cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />{M.steel({ col: "#4a4e56" })}</mesh>; })}
  <mesh position={[-0.04, 0.27, 0.02]} rotation={[0, 0, -Math.atan2(0.03, 0.04)]}><cylinderGeometry args={[0.005, 0.005, 0.62, 10]} />{M.wood({ base: [110, 80, 54] })}</mesh>
  <group position={[-0.42, 0.36, -0.096]}>
    <RBox s={[0.12, 0.22, 0.01]} r={0.003} p={[0, 0.11, 0]}>{M.matte({ col: "#3c3a36" })}</RBox>
    <RBox s={[0.1, 0.2, 0.008]} r={0.003} p={[0, 0.105, 0.006]}>{M.wood({ base: [130, 92, 60] })}</RBox>
    <mesh position={[0.035, 0.1, 0.012]}><sphereGeometry args={[0.006, 10, 8]} />{M.brass({})}</mesh>
    <mesh position={[0, 0.25, 0.01]}><planeGeometry args={[0.04, 0.02]} /><meshBasicMaterial color="#ffe2b0" toneMapped={false} /></mesh>
  </group>
  {["Kitchen", "Books", "Winter"].map((l, i) => { const k = eio(tt, 0.6 + i * 1.6, 3.4 + i * 1.6), pos = k * (N + 1), si = Math.min(N, Math.floor(pos)), fr = pos - si;
    const px = (q: number) => (q === 0 ? -0.36 : sx(q - 1) + 0.02), py = (q: number) => (q === 0 ? 0.36 : sy(q - 1)), q1 = Math.min(N, si + 1);
    const e = fr < 0.6 ? 0 : (fr - 0.6) / 0.4, ee = e * e * (3 - 2 * e), lift = Math.sin(PI * ee) * 0.015;
    return k > 0 ? <group key={i} position={[lerp(px(si), px(q1), ee), lerp(py(si), py(q1), ee) + lift, -0.035]} rotation={[0, 0, -0.08 * Math.sin(PI * ee)]}>
      <Box p={[0, 0, 0]} s={1.2} label={l} />
      {[-0.02, 0.02].map((dx, j) => <mesh key={j} position={[dx, 0.004, 0.04]} scale={[1, 0.7, 1.6]}><sphereGeometry args={[0.01, 14, 10]} />{M.matte({ col: "#d8d4cc" })}</mesh>)}
    </group> : null; })}
  <pointLight position={[-0.1, 0.5, 0.3]} intensity={1.2} distance={1.4} color="#fff0d0" />
  <pointLight position={[0.3, 0.15, 0.4]} intensity={0.5} distance={1.2} color="#cfdcff" />
</>; }}</Scene3D>;

// ---- 10:54 · LAS NARANJAS: un sobrecito se desliza bajo la puerta de la vecina; del otro lado, en el piso del pasillo, dos naranjas que ella le dejaba; la tarjeta dice «thank you» ----
export const HOranges: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16181e" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0.04, 0.09, 0.02], az: [-0.4, -0.02], el: [0.3, 0.22], r: [0.8, 0.6], fov: 32 }}>{(tt) => {
  const slide = eio(tt, 1.2, 3.0), open = eio(tt, 3.4, 7.0); // la puerta se entreabre despacio y sale la luz de adentro: el final nunca queda quieto
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#5a5a5c" roughness={0.7} /></mesh>
    <mesh position={[0, 0.215, -0.022]}><planeGeometry args={[0.26, 0.42]} /><meshBasicMaterial color="#ffd9a0" /></mesh>
    <mesh rotation={[-PI / 2, 0, 0.35 * open]} position={[0.14, 0.0015, 0.07]}><planeGeometry args={[0.07 * open + 0.001, 0.16]} /><meshBasicMaterial color="#ffcf8a" transparent opacity={0.35 * open} /></mesh>
    <group position={[-0.13, 0, -0.01]} rotation={[0, -0.55 * open, 0]}>
      <RBox s={[0.26, 0.42, 0.02]} r={0.004} p={[0.13, 0.215, 0]}>{M.steel({ col: "#7a8a96" })}</RBox>
      <mesh position={[0.23, 0.2, 0.011]}><sphereGeometry args={[0.008, 12, 8]} />{M.chrome()}</mesh>
    </group>
    <group position={[-0.02, 0.002, lerp(0.14, -0.02, slide)]} rotation={[0, 0.05, 0]}>
      <RBox s={[0.08, 0.002, 0.055]} r={0.001}>{M.matte({ col: "#f6f3ea" })}</RBox>
      <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.07, 0.045]} /><meshStandardMaterial map={txt("ty", ["thank you"], { w: 300, h: 190, bg: "#f6f3ea", fg: "#2a2420", size: 60, font: HANDF })} /></mesh>
    </group>
    {[[0.18, 0.08], [0.21, 0.05], [0.16, 0.04]].map(([x, z], i) => { const roll = 0.05 * eio(tt, 1.4 + i * 0.5, 6.8); // ruedan despacio hacia la puerta: el plano nunca queda quieto
      return <mesh key={i} position={[x - roll * 0.6, 0.02, z + roll]} rotation={[roll / 0.02, 0, -roll * 0.6 / 0.02]} scale={pop(tt, 0.3 + i * 0.25)}><sphereGeometry args={[0.02, 24, 18]} /><meshStandardMaterial color="#e8862a" roughness={0.6} /></mesh>; })}
    <Sheet map={txt("or", ["She used to leave me oranges."], { w: 640, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 46, font: HANDF })} w={0.2} h={0.031} p={[-0.02, 0.32, 0.01]} s={pop(tt, 3.4)} />
  </>;
}}</Scene3D>;

// ---- 11:34 · LA DETECTIVE: el corcho con el mapa, fotos sin cara y hilo rojo; el hilo llega a un alfiler; aparece la pregunta: «If I find him and he doesn't want to come back?» ----
export const HDetective: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#14120e" lamp={[-0.2, 0.6, 0.6]} warm={0.8}
  cam={{ at: [0, 0.2, 0], az: [-0.15, 0.12], el: [0.06, 0.04], r: [0.75, 0.62], fov: 32 }}>{(tt) => {
  const P = [[-0.22, 0.3], [-0.08, 0.14], [0.06, 0.28], [0.2, 0.12], [0.12, 0.34]], u = eio(tt, 0.6, 4.0);
  return <>
    <RBox s={[0.62, 0.4, 0.02]} r={0.008} p={[0, 0.22, -0.02]}>{M.matte({ col: "#b8946a" })}</RBox>
    <mesh position={[0, 0.22, -0.009]}><planeGeometry args={[0.4, 0.3]} /><meshStandardMaterial color="#e8e2c8" /></mesh>
    {[[-0.12, 0.25, 0.14, 0.04, 0.4], [0.02, 0.2, 0.16, 0.05, 0.2], [0.13, 0.15, 0.1, 0.04, -0.3]].map(([x, y, w, d, r], i) => <mesh key={i} position={[x, y, -0.008]} rotation={[0, 0, r]}><planeGeometry args={[w, d]} /><meshStandardMaterial color="#b0c4a0" /></mesh>)}
    {P.map(([x, y], i) => <group key={i} position={[x, y, -0.006]} scale={pop(tt, 0.3 + i * 0.6)}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.007, 0.007, 0.012, 14]} />{M.plastic({ col: i === 4 ? "#c0392b" : "#e6dccc" })}</mesh></group>)}
    {P.slice(0, -1).map(([x, y], i) => { const [x2, y2] = P[i + 1], k = cl(u * 4 - i); return <mesh key={"s" + i} position={[lerp(x, x2, k / 2), lerp(y, y2, k / 2), 0.0]} rotation={[0, 0, Math.atan2(y2 - y, x2 - x)]}><planeGeometry args={[Math.hypot(x2 - x, y2 - y) * k, 0.0025]} /><meshBasicMaterial color="#c0392b" /></mesh>; })}
    <Sheet map={txt("dq", ["If I find him, and he", "doesn't want to come back,", "can you accept that?"], { w: 640, h: 260, bg: "#fbf8f0", fg: "#22304e", size: 46, font: HANDF })} w={0.22} h={0.09} p={[0.0, 0.08, 0.03]} r={[0, 0, -0.03]} s={pop(tt, 4.2)} em={0.08} />
  </>;
}}</Scene3D>;

// ---- 11:44 · LA LUZ DEL PORCHE: la casa vieja de noche, el farol de la entrada prendido; el calendario pasa los años 1 a 11; las estaciones cambian alrededor (nieve, hojas) y la luz no se apaga nunca ----
export const HPorch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#05060a" lamp={[0, 0.4, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0.0, 0.14, 0.02], az: [-0.25, 0.1], el: [0.18, 0.12], r: [0.95, 0.7], fov: 32 }}>{(tt) => {
  // estaciones con fundido suave (1¼ vuelta lineal, ~1 s por estación; nieve apagada): antes cambiaban a golpes 4 por año = destellos de 8 Hz
  const yr = 1 + Math.min(10, Math.floor(eio(tt, 0.8, 6.0) * 11)), season = (Math.min(1, Math.max(0, (tt - 0.8) / 5.6)) * 1.25 * 4) % 4;
  const SC = ["#3a4a2a", "#2a3a1a", "#5a3a1a", "#8a909a"], s0 = Math.floor(season), sf = season - s0, sk = sf * sf * (3 - 2 * sf);
  const ground = new THREE.Color(SC[s0]).lerp(new THREE.Color(SC[(s0 + 1) % 4]), sk);
  const wSnow = s0 === 3 ? 1 - sk : s0 === 2 ? sk : 0, wLeaf = s0 === 2 ? 1 - sk : s0 === 1 ? sk : 0;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color={ground.multiplyScalar(0.5)} /></mesh>
    <House p={[0, 0, -0.1]} s={0.8} lit={[0, 0, 0, 0]} col="#8a7a68" roof="#3a3e46" />
    <mesh position={[0.06, 0.12, 0.09]}><sphereGeometry args={[0.012, 16, 12]} />{M.glow({ col: "#ffd59a" })}</mesh>
    <pointLight position={[0.06, 0.12, 0.12]} intensity={0.9} distance={0.6} color="#ffcf8a" />
    {Array.from({ length: 50 }, (_, i) => <mesh key={i} visible={wSnow > 0.01} position={[(rn(i, 2) - 0.5) * 1.2, 0.5 - ((tt * 0.15 + rn(i, 3)) % 1) * 0.5, (rn(i, 4) - 0.5) * 0.6]} scale={0.004}><sphereGeometry args={[1, 6, 4]} />{M.glow({ col: "#f2f4f8", op: 0.8 * wSnow })}</mesh>)}
    {Array.from({ length: 24 }, (_, i) => <mesh key={"l" + i} visible={wLeaf > 0.01} position={[(rn(i, 2) - 0.5) * 1.0, 0.4 - ((tt * 0.1 + rn(i, 3)) % 1) * 0.4, (rn(i, 4) - 0.3) * 0.5]} rotation={[tt + i, i, 0]} scale={0.01}><planeGeometry args={[1, 0.6]} /><meshStandardMaterial color="#c0602a" side={THREE.DoubleSide} transparent opacity={wLeaf} /></mesh>)}
    <group position={[0.3, 0.1, 0.06]}><Sheet map={txt("yr" + yr, [yr === 1 ? "1 year" : yr + " years"], { w: 300, h: 110, bg: "#f2ead8", fg: "#2a2420", size: 64, font: HANDF })} w={0.14} h={0.05} s={pop(tt, 0.6)} em={0.1} /></group>
  </>;
}}</Scene3D>;

// ---- 12:30 · LA SOPA: mesas plegables en un estacionamiento; el cucharón sirve el cuenco «no muy lleno»; los cuencos pasan de mano en mano por la fila, cada uno con una pequeña reverencia ----
export const HSoup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#c9cdd0" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.08, 0], at1: [0.12, 0.08, 0.05], az: [-0.45, -0.2], el: [0.3, 0.22], r: [1.1, 0.85], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#6a6a6c" /></mesh>
  {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.6 + i * 0.25, 0.001, 0.25]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.01, 0.2]} /><meshBasicMaterial color="#e8e8e0" /></mesh>)}
  <RBox s={[0.5, 0.012, 0.14]} r={0.004} p={[-0.1, 0.08, -0.08]}>{M.plastic({ col: "#e6e3dc" })}</RBox>
  {[-0.3, 0.1].map((x, i) => <mesh key={i} position={[x, 0.04, -0.08]}><cylinderGeometry args={[0.004, 0.004, 0.08, 6]} />{M.steel()}</mesh>)}
  <mesh position={[-0.24, 0.12, -0.1]}><cylinderGeometry args={[0.05, 0.045, 0.07, 28]} />{M.steel({ col: "#b0b4b8" })}</mesh>
  {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.4 + i * 0.08) % 1); return <mesh key={"st" + i} position={[-0.24 + Math.sin(i + tt) * 0.02, 0.16 + k * 0.12, -0.1]} scale={0.01 + 0.02 * k}><sphereGeometry args={[1, 8, 6]} />{M.glow({ col: "#f2f2f0", op: 0.25 * (1 - k) })}</mesh>; })}
  <Fig p={[-0.24, 0, -0.22]} s={1.15} cloth="#e6dcc8" arm={0.8 + 0.3 * Math.sin(tt * 3)} />
  {Array.from({ length: 6 }, (_, i) => { const x = 0.0 + i * 0.13, k = eio(tt, 0.8 + i * 0.9, 1.6 + i * 0.9), bw = Math.sin(PI * cl((tt - 1.6 - i * 0.9) / 0.8));
    return <group key={i}>
      <Fig p={[x, 0, 0.08]} r={[0, -PI / 2 - 0.4, 0]} s={1.05} cloth={["#4a4a52", "#5a4a3a", "#3a4a5a", "#6a6a72", "#2a2a30", "#5a5a4a"][i]} bow={0.35 * Math.max(0, bw)} arm={0.7 * k} />
      <group position={[lerp(-0.18, x - 0.03, k), 0.085 + 0.02 * Math.sin(PI * k), lerp(-0.06, 0.05, k)]} scale={pop(tt, 0.6 + i * 0.9)}><Bowl s={0.3} soup steam={0.4} /></group>
    </group>; })}
  <Sheet map={txt("ntf", ["Not too full. They have to carry it."], { w: 720, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 44, font: HANDF })} w={0.26} h={0.036} p={[-0.2, 0.26, -0.14]} s={pop(tt, 1.0)} />
</>}</Scene3D>;
