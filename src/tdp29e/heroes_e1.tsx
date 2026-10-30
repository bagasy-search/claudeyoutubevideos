// tdp29e · componentes 1-12: el onigiri al bolsillo, la reverencia al guardia, la billetera devuelta, una de cada cinco, el té, el número que baja, la viuda, la pensión, las cuentas, la etiqueta amarilla, el meiwaku, el pasillo de las etiquetas.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, rn } from "./h3d";
import { Bill, Coin, HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Fig, Onigiri, Passbook } from "./tkit3d";

type P3 = [number, number, number];
const g = (p?: number[]) => (p ?? [0, 0, 0]) as P3;
// abuela: figura con pelo gris recogido y cárdigan
export const Gran: React.FC<{ p?: number[]; r?: number[]; s?: number; bow?: number; sit?: number; arm?: number; arm2?: number; head?: number; cloth?: string }> = ({ p, r, s = 1, bow = 0, sit = 0, arm = 0, arm2 = 0, head = 0, cloth = "#8a8a8e" }) => <group position={g(p)} rotation={g(r)}>
  <Fig s={s} bow={bow} sit={sit} arm={arm} arm2={arm2} head={head} cloth={cloth} />
  <group position={[0, (0.16 - 0.07 * sit) * s * 0.57, 0]} rotation={[bow, 0, 0]}><group position={[0, 0.165 * s * 0.57, 0]} rotation={[head, 0, 0]}>
    <mesh position={[0, 0.012 * s * 0.57, -0.004 * s * 0.57]} scale={s * 0.57}><sphereGeometry args={[0.032, 20, 14, 0, 2 * PI, 0, PI * 0.55]} />{M.hair({ col: "#c8c6c2" })}</mesh>
    <mesh position={[0, 0.02 * s * 0.57, -0.03 * s * 0.57]} scale={s * 0.57}><sphereGeometry args={[0.014, 14, 10]} />{M.hair({ col: "#c8c6c2" })}</mesh>
  </group></group>
</group>;
// heladera de góndola con estantes iluminados
export const Fridge: React.FC<{ p?: number[]; w?: number; rows?: number }> = ({ p, w = 0.6, rows = 3 }) => <group position={g(p)}>
  <RBox s={[w + 0.04, 0.42, 0.01]} r={0.003} p={[0, 0.21, -0.165]}>{M.matte({ col: "#e9ebec" })}</RBox>
  <RBox s={[w + 0.04, 0.03, 0.17]} r={0.004} p={[0, 0.435, -0.08]}>{M.matte({ col: "#e9ebec" })}</RBox>
  <RBox s={[w + 0.04, 0.06, 0.17]} r={0.004} p={[0, 0.03, -0.08]}>{M.matte({ col: "#d8dadc" })}</RBox>
  {[-1, 1].map((k) => <RBox key={k} s={[0.02, 0.42, 0.17]} r={0.003} p={[k * (w / 2 + 0.01), 0.21, -0.08]}>{M.matte({ col: "#e9ebec" })}</RBox>)}
  <mesh position={[0, 0.22, -0.155]}><planeGeometry args={[w, 0.36]} /><meshStandardMaterial color="#cfd8de" emissive="#eaf4ff" emissiveIntensity={0.25} /></mesh>
  {Array.from({ length: rows }, (_, i) => <RBox key={i} s={[w, 0.006, 0.12]} r={0.002} p={[0, 0.08 + i * 0.11, -0.06]}>{M.steel({ col: "#b8bcc2" })}</RBox>)}
</group>;

// ---- 0:14 · EL ONIGIRI AL BOLSILLO: la góndola fría llena de onigiris con precio; una mano toma el más barato (¥130) y lo mete en el bolsillo de un cárdigan gris ----
export const HOnigiri: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#cfd6da" lamp={[0, 0.7, 0.6]}
  cam={{ at: [0.06, 0.2, 0], at1: [0.12, 0.17, 0.08], az: [-0.32, -0.05], el: [0.2, 0.15], r: [1.1, 0.85], fov: 32 }}>{(tt) => {
  const grab = eio(tt, 1.2, 2.6), slide = eio(tt, 3.0, 4.8);
  const ox = lerp(lerp(0.0, 0.06, grab), 0.17, slide), oy = lerp(lerp(0.2, 0.24, grab), 0.11, slide), oz = lerp(lerp(-0.04, 0.06, grab), 0.12, slide);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#c9c6be" roughness={0.6} /></mesh>
    <Fridge p={[0, 0, 0]} w={0.6} />
    {Array.from({ length: 21 }, (_, i) => { const r = Math.floor(i / 7), c = i % 7; if (r === 1 && c === 3) return null;
      return <Onigiri key={i} p={[-0.24 + c * 0.08, 0.115 + r * 0.11, -0.04]} s={0.75} price={["¥160", "¥180", "¥150", "¥200"][(i + r) % 4]} />; })}
    <Onigiri p={[ox, oy, oz]} r={[0, 0, -0.3 * slide]} s={0.75} price="¥130" />
    <Gran p={[0.24, 0, 0.17]} r={[0, -0.9, 0]} s={1.7} cloth="#8a8a8e" arm={0.5 * grab * (1 - slide)} head={0.25} />
    <mesh position={[0.33, 0.085, 0.2]} rotation={[0, 0, 0.12]}><cylinderGeometry args={[0.004, 0.004, 0.17, 8]} />{M.wood({ base: [90, 60, 40] })}</mesh>
    <mesh position={[0.34, 0.16, 0.2]}><sphereGeometry args={[0.008, 12, 10]} />{M.brass({})}</mesh>
    <Sheet map={txt("oni130", ["salmon · ¥130", "the cheapest one"], { w: 460, h: 160, bg: "#f6f1e4", fg: "#2a2420", size: 54, font: HANDF })} w={0.17} h={0.059} p={[-0.12, 0.004, 0.2]} r={[-PI / 2, 0, 0]} s={pop(tt, 1.6)} em={0.25} />
    <group position={[ox + 0.03, oy + 0.02, oz + 0.02]} rotation={[0.3, 0, 0.4]} visible={grab > 0.02 && slide < 0.95}><mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.014, 0.06, 6, 12]} />{M.matte({ col: "#d8b89a" })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- 0:31 · LA REVERENCIA: en la puerta de vidrio del súper, la abuela con bastón y cascabel espera; el guardia sale; ella se inclina hondo ante él ----
export const HBow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#d9dcd6" lamp={[0.2, 0.8, 0.5]}
  cam={{ at: [0, 0.12, 0], az: [0.55, 0.35], el: [0.12, 0.08], r: [0.75, 0.6], fov: 32 }}>{(tt) => {
  const out = eio(tt, 0.8, 2.4), bow = eio(tt, 3.0, 4.0) * (1 - eio(tt, 5.8, 6.6));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#9a9890" roughness={0.8} /></mesh>
    <RBox s={[0.9, 0.42, 0.04]} r={0.004} p={[0, 0.21, -0.2]}>{M.matte({ col: "#e8e4da" })}</RBox>
    {[-0.08, 0.08].map((x, i) => <mesh key={i} position={[x - (i ? -1 : 1) * 0.06 * out, 0.15, -0.178]}><planeGeometry args={[0.15, 0.28]} />{M.glass({ col: "#a8c4d0", op: 0.55 })}</mesh>)}
    <mesh position={[0, 0.35, -0.177]}><planeGeometry args={[0.36, 0.05]} /><meshStandardMaterial color="#2a6a3a" emissive="#2a6a3a" emissiveIntensity={0.3} /></mesh>
    <Fig p={[lerp(0, 0.08, out), 0, lerp(-0.18, -0.02, out)]} r={[0, -0.6, 0]} s={1.25} cloth="#1d2f5a" hat="#1d2f5a" />
    <Gran p={[-0.12, 0, 0.12]} r={[0, 2.5, 0]} s={1.05} bow={0.9 * bow} cloth="#8a8a8e" />
    <group position={[-0.17, 0, 0.16]} rotation={[0.1, 0, 0.12]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 8]} />{M.wood({ base: [90, 60, 40] })}</mesh>
      <mesh position={[0, 0.1, 0.006]}><sphereGeometry args={[0.006, 12, 10]} />{M.brass()}</mesh>
    </group>
    <Sheet map={txt("bowty", ["thank you.", "please call the police."], { w: 520, h: 180, bg: "#f6f1e4", fg: "#2a2420", size: 54, font: HANDF })} w={0.2} h={0.069} p={[-0.2, 0.32, 0.1]} r={[0, 0.45, 0]} s={pop(tt, 4.2)} em={0.15} />
  </>;
}}</Scene3D>;

// ---- 0:48 · LA BILLETERA DEVUELTA: en el mostrador del koban, una billetera perdida se abre: los billetes siguen todos ahí, contados uno por uno ----
export const HWallet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a1d24" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.04, 0.02], az: [-0.2, 0.08], el: [0.8, 0.68], r: [0.5, 0.42], fov: 32 }}>{(tt) => {
  const slide = eio(tt, 0.3, 1.4), open = eio(tt, 1.6, 2.6), fan = eio(tt, 2.8, 4.2);
  return <>
    <RBox s={[1.2, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [140, 104, 70] })}</RBox>
    <RBox s={[0.5, 0.004, 0.22]} r={0.002} p={[0.0, 0.002, -0.14]}>{M.matte({ col: "#2a3a5a" })}</RBox>
    <Sheet map={txt("koban", ["LOST & FOUND"], { w: 480, h: 90, bg: "#2a3a5a", fg: "#f6f1e4", size: 56 })} w={0.2} h={0.038} p={[0, 0.005, -0.2]} r={[-PI / 2, 0, 0]} em={0.3} />
    <group position={[lerp(0.3, 0, slide), 0.004, 0.02]}>
      <RBox s={[0.13, 0.01, 0.09]} r={0.008} p={[-0.065, 0.005, 0]}>{M.matte({ col: "#4a2e1e" })}</RBox>
      <group position={[0, 0.01, 0]} rotation={[0, 0, PI * (1 - open)]}><RBox s={[0.13, 0.01, 0.09]} r={0.008} p={[-0.065, 0.005, 0]}>{M.matte({ col: "#5a3624" })}</RBox></group>
      {[0, 1, 2, 3, 4, 5].map((i) => <group key={i} position={[-0.065 + i * 0.006 * fan, 0.012 + i * 0.0025, -0.004 + i * 0.004 * fan]} rotation={[0, -0.12 * i * fan, 0]} visible={open > 0.5}>
        <RBox s={[0.1, 0.002, 0.05]} r={0.001}>{M.matte({ col: "#d8cfa8" })}</RBox>
        <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.095, 0.046]} /><meshStandardMaterial map={txt("yen10k", ["¥10,000"], { w: 300, h: 140, bg: "#d8cfa8", fg: "#5a4a2a", size: 64 })} /></mesh>
      </group>)}
    </group>
    <Sheet map={txt("wl", ["every yen", "still inside"], { w: 420, h: 180, bg: "#f6f1e4", fg: "#2a2420", size: 60, font: HANDF })} w={0.15} h={0.064} p={[0.13, 0.004, 0.13]} r={[-PI / 2, 0, 0.08]} s={pop(tt, 4.6)} em={0.2} />
  </>;
}}</Scene3D>;

// ---- 1:03 · UNA DE CADA CINCO: cinco reclusas en fila; la cuarta tiene pelo blanco y andador; su foco se enciende y las demás se apagan ----
export const HOneFive: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#14161c" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0.08, 0.1, 0], az: [-0.1, 0.05], el: [0.18, 0.12], r: [0.9, 0.62], fov: 32 }}>{(tt) => {
  const pick = eio(tt, 2.2, 3.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#3a3c40" roughness={0.9} /></mesh>
    <mesh position={[0, 0.3, -0.2]}><planeGeometry args={[3, 0.8]} /><meshStandardMaterial color="#4a4e56" /></mesh>
    {[0, 1, 2, 3, 4].map((i) => { const x = -0.32 + i * 0.16, me = i === 3, dim = me ? 1 : 1 - 0.7 * pick;
      return <group key={i}>
        {me ? <Gran p={[x, 0, 0]} s={1.25} bow={0.25} cloth="#7a8a9a" arm={0.35} arm2={0.35} /> : <Fig p={[x, 0, 0]} s={1.25} cloth="#7a8a9a" />}
        {me && <group position={[x, 0, 0.07]}>{[[-0.04, -0.03], [0.04, -0.03], [-0.04, 0.03], [0.04, 0.03]].map(([dx, dz], k) => <mesh key={k} position={[dx, 0.05, dz]}><cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />{M.steel({ col: "#b8bcc2" })}</mesh>)}<RBox s={[0.09, 0.005, 0.07]} r={0.002} p={[0, 0.1, 0]}>{M.steel({ col: "#b8bcc2" })}</RBox></group>}
        <mesh position={[x, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 32]} />{M.glow({ col: me ? "#ffd59a" : "#9fb4d8", op: 0.35 * dim })}</mesh>
        <pointLight position={[x, 0.35, 0.1]} intensity={me ? 0.4 + 0.6 * pick : 0.25 * dim} distance={0.4} color={me ? "#ffd59a" : "#cfdcff"} />
      </group>; })}
    <Sheet map={txt("1in5", ["1 in 5", "over 65"], { w: 360, h: 200, bg: "#f6f1e4", fg: "#7a1d12", size: 80 })} w={0.14} h={0.078} p={[0.16, 0.3, 0.06]} s={pop(tt, 3.6)} em={0.3} />
  </>;
}}</Scene3D>;

// ---- 2:24 · LA TAZA DE TÉ: en la oficina del encargado, la tetera se inclina y sirve; sube el vapor; la taza queda frente a una silla vacía ----
export const HTea: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [0.02, 0.07, 0.03], az: [-0.3, -0.1], el: [0.42, 0.34], r: [0.62, 0.52], fov: 32 }}>{(tt) => {
  const tilt = eio(tt, 0.8, 1.6) * (1 - eio(tt, 3.8, 4.6)), pour = cl((tt - 1.4) / 0.3) * (1 - cl((tt - 3.8) / 0.3)), fill = eio(tt, 1.5, 3.8);
  return <>
    <RBox s={[1.0, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [120, 86, 56] })}</RBox>
    <group position={[0.02, 0, 0.02]}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.03, 0.025, 0.06, 32, 1, true]} />{M.porcelain({ col: "#e9e2d2" })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.025, 0.025, 0.004, 32]} />{M.porcelain({ col: "#e9e2d2" })}</mesh>
      <mesh position={[0, 0.005 + 0.048 * fill, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.025 + 0.004 * fill, 32]} /><meshStandardMaterial color="#8a9a3a" roughness={0.2} /></mesh>
    </group>
    <group position={[-0.1, 0.12, 0.02]} rotation={[0, 0, -0.9 * tilt]}>
      <mesh scale={[1, 0.78, 1]}><sphereGeometry args={[0.045, 32, 20]} />{M.porcelain({ col: "#5a6a4a" })}</mesh>
      <mesh position={[0, 0.036, 0]}><cylinderGeometry args={[0.026, 0.03, 0.008, 28]} />{M.porcelain({ col: "#4a5a3a" })}</mesh>
      <mesh position={[0, 0.045, 0]}><sphereGeometry args={[0.007, 12, 10]} />{M.porcelain({ col: "#4a5a3a" })}</mesh>
      <mesh position={[0.055, 0.012, 0]} rotation={[0, 0, -1.15]}><cylinderGeometry args={[0.005, 0.009, 0.045, 12]} />{M.porcelain({ col: "#5a6a4a" })}</mesh>
      <mesh position={[0, 0, -0.06]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.05, 12]} />{M.wood({ base: [80, 56, 36] })}</mesh>
    </group>
    {pour > 0 && <mesh position={[0.02, 0.09, 0.02]}><cylinderGeometry args={[0.0025, 0.0025, 0.07 * pour, 8]} /><meshStandardMaterial color="#9aa84a" transparent opacity={0.85} /></mesh>}
    {Array.from({ length: 24 }, (_, i) => { const k = ((tt * 0.35 + rn(i, 2)) % 1); return fill > 0.3 ? <mesh key={i} position={[0.02 + Math.sin(i + tt * 1.5) * 0.012 * k, 0.07 + k * 0.16, 0.02]} scale={0.006 + 0.01 * k}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.18 * (1 - k)} depthWrite={false} /></mesh> : null; })}
    <group position={[0.02, 0, -0.2]}><RBox s={[0.14, 0.12, 0.012]} r={0.004} p={[0, 0.16, -0.05]}>{M.matte({ col: "#3a3c44" })}</RBox><RBox s={[0.14, 0.012, 0.12]} r={0.004} p={[0, 0.09, 0]}>{M.matte({ col: "#3a3c44" })}</RBox></group>
    <Sheet map={txt("teaq", ["first time in a month", "anybody made me tea"], { w: 560, h: 170, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.2} h={0.061} p={[0.04, 0.004, 0.13]} r={[-PI / 2, 0, 0]} s={pop(tt, 4.6)} em={0.2} />
  </>;
}}</Scene3D>;

// ---- 2:45 · EL NÚMERO QUE BAJA: barras de delitos que bajan año tras año; adentro de cada barra, una franja ámbar (mujeres mayores) que crece ----
export const HFalling: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#101318" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.14, 0], az: [-0.35, -0.15], el: [0.25, 0.2], r: [0.85, 0.75], fov: 32 }}>{(tt) => {
  const N = 8;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#1e2128" /></mesh>
    {Array.from({ length: N }, (_, i) => { const k = eio(tt, 0.4 + i * 0.35, 1.2 + i * 0.35), hT = (0.34 - i * 0.03) * k, f = (0.04 + i * 0.022) * k, x = -0.35 + i * 0.1;
      return <group key={i}>
        <RBox s={[0.07, Math.max(0.002, hT), 0.07]} r={0.004} p={[x, hT / 2, 0]}>{M.matte({ col: "#5a6070" })}</RBox>
        <RBox s={[0.072, Math.max(0.002, f), 0.072]} r={0.004} p={[x, f / 2, 0]}>{M.matte({ col: "#e0a040", em: "#e0a040", emI: 0.35 })}</RBox>
        <mesh position={[x, 0.002, 0.06]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.08, 0.025]} /><meshStandardMaterial map={txt("yr" + i, [String(2000 + i * 3)], { w: 200, h: 64, bg: "#1e2128", fg: "#c8ccd4", size: 44 })} /></mesh>
      </group>; })}
    <Sheet map={txt("fl1", ["older women"], { w: 380, h: 90, bg: "#e0a040", fg: "#1a1208", size: 54 })} w={0.15} h={0.036} p={[0.3, 0.24, 0.06]} s={pop(tt, 3.8)} em={0.3} />
    <mesh position={[0.3, 0.2, 0.05]}><cylinderGeometry args={[0.002, 0.002, 0.04, 6]} />{M.glow({ col: "#e0a040" })}</mesh>
    <Sheet map={txt("fl2", ["all crime"], { w: 300, h: 90, bg: "#5a6070", fg: "#f2f2f2", size: 54 })} w={0.12} h={0.036} p={[-0.3, 0.4, 0.06]} s={pop(tt, 1.6)} em={0.2} />
  </>;
}}</Scene3D>;

// ---- 3:25 · LA VIUDA: dos columnas de monedas lado a lado (la pensión de él, alta; la de ella, baja); la foto de él se oscurece y su columna se va ----
export const HWidow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [0, 0.1, 0], az: [-0.2, 0.05], el: [0.25, 0.2], r: [0.6, 0.5], fov: 32 }}>{(tt) => {
  const go = eio(tt, 2.8, 4.6), dark = eio(tt, 2.2, 3.2);
  return <>
    <RBox s={[1.0, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    {Array.from({ length: 22 }, (_, i) => { const gone = cl(go * 22 - (21 - i)); return gone < 1 ? <Coin key={"h" + i} p={[-0.08, 0.003 + i * 0.0085 + 0.15 * gone, 0.02 - 0.2 * gone]} s={1.2} /> : null; })}
    {Array.from({ length: 6 }, (_, i) => <Coin key={"w" + i} p={[0.08, 0.003 + i * 0.0085, 0.02]} s={1.2} />)}
    <group position={[-0.08, 0.0, -0.12]} rotation={[-0.25, 0, 0]}>
      <RBox s={[0.1, 0.13, 0.008]} r={0.003} p={[0, 0.065, 0]}>{M.matte({ col: "#1a1a1a" })}</RBox>
      <mesh position={[0, 0.07, 0.005]}><planeGeometry args={[0.08, 0.1]} /><meshStandardMaterial color={new THREE.Color("#a8987a").lerp(new THREE.Color("#2a2620"), dark)} /></mesh>
      <group position={[0, 0.03, 0.006]} scale={0.38}><Fig s={1} cloth="#2a2c34" /></group>
    </group>
    <Sheet map={txt("wd1", ["his pension"], { w: 330, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 52, font: HANDF })} w={0.12} h={0.033} p={[-0.08, 0.004, 0.1]} r={[-PI / 2, 0, 0]} em={0.15} />
    <Sheet map={txt("wd2", ["hers"], { w: 200, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 52, font: HANDF })} w={0.08} h={0.036} p={[0.08, 0.004, 0.1]} r={[-PI / 2, 0, 0]} em={0.15} />
  </>;
}}</Scene3D>;

// ---- 3:48 · LA PENSIÓN: la libreta del banco se abre; los tambores ruedan hasta ¥68,000; al lado, la equivalencia en dólares ----
export const HPension: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#101318" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.1, 0], az: [-0.15, 0.1], el: [0.3, 0.22], r: [0.6, 0.5], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.8, 4.0), n = Math.round(68000 * k), dg = String(n).padStart(5, "0");
  return <>
    <RBox s={[1.0, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    <Passbook p={[-0.06, 0.002, 0.08]} r={[0, 0.15, 0]} s={1.1} lines={["NATIONAL PENSION", "monthly · full amount", "40 years paid in"]} n={3} key0="pens" />
    <RBox s={[0.36, 0.1, 0.07]} r={0.01} p={[0.02, 0.14, -0.08]}>{M.matte({ col: "#1a1c22" })}</RBox>
    <mesh position={[-0.13, 0.14, -0.044]}><planeGeometry args={[0.05, 0.06]} /><meshStandardMaterial map={txt("yen", ["¥"], { w: 120, h: 140, bg: "#1a1c22", fg: "#f2ead8", size: 110 })} /></mesh>
    {dg.split("").map((d, i) => <DigitDrum key={i} v={+d} p={[-0.08 + i * 0.055, 0.14, -0.044]} r={0.03} w={0.046} />)}
    <Sheet map={txt("usd", ["≈ $450 a month"], { w: 520, h: 110, bg: "#f2ead8", fg: "#7a1d12", size: 64 })} w={0.22} h={0.047} p={[0.1, 0.06, 0.0]} r={[-0.4, 0, 0]} s={pop(tt, 4.2)} em={0.3} />
  </>;
}}</Scene3D>;

// ---- 4:03 · LAS CUENTAS: la pila de ¥68,000 en monedas; llegan los sobres (alquiler, luz y gas, salud, teléfono) y cada uno se lleva su parte; queda un puñito ----
export const HBills: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [0, 0.0, 0.02], az: [-0.03, 0.03], el: [0.95, 0.85], r: [1.0, 0.92], fov: 32 }}>{(tt) => {
  const E: [string, number, number][] = [["rent|¥35,000", 35, -0.3], ["power, gas|¥10,000", 10, -0.1], ["medicine|¥6,000", 6, 0.1], ["phone|¥4,000", 4, 0.3]];
  let used = 0;
  return <>
    <RBox s={[1.1, 0.03, 0.7]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    {E.map(([l, n, x], i) => { const a = 0.6 + i * 1.3, k = eio(tt, a + 0.4, a + 1.1), u0 = used; used += n;
      return <group key={i}>
        <group position={[x, 0.002, -0.12 + fallY(tt, a, 0.0)]} scale={pop(tt, a)}>
          <RBox s={[0.16, 0.004, 0.09]} r={0.002}>{M.matte({ col: "#f2ead8" })}</RBox>
          <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.08]} /><meshStandardMaterial map={txt("bl2" + i, l.split("|"), { w: 480, h: 260, bg: "#f2ead8", fg: "#7a1d12", size: 78 })} /></mesh>
        </group>
        {Array.from({ length: Math.ceil(n / 4) }, (_, j) => { const idx = Math.floor(u0 / 4) + j; return <Coin key={j} p={[lerp(-0.02 + (idx % 3) * 0.04, x + (j % 2) * 0.03, k), 0.004 + Math.floor(idx / 3) * 0.008 * (1 - k) + j * 0.008 * k * 0.4, lerp(0.14, -0.035, k)]} s={1.1} />; })}
      </group>; })}
    {Array.from({ length: 3 }, (_, j) => <Coin key={"left" + j} p={[0.0 + j * 0.03, 0.004, 0.2]} s={1.1} />)}
    <Sheet map={txt("bleft", ["left for the month: ¥10,000"], { w: 640, h: 100, bg: "#f6f1e4", fg: "#2a2420", size: 48, font: HANDF })} w={0.3} h={0.047} p={[0.02, 0.004, 0.24]} r={[-PI / 2, 0, 0]} s={pop(tt, 6.0)} em={0.3} />
  </>;
}}</Scene3D>;

// ---- 4:37 · LA ETIQUETA AMARILLA: de noche, la góndola de pan; la pistola de etiquetas estampa un «HALF PRICE» amarillo sobre una bolsa de pan ----
export const HSticker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0c0e12" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.06, 0], az: [-0.25, -0.08], el: [0.5, 0.42], r: [0.62, 0.5], fov: 32 }}>{(tt) => {
  const gun = eio(tt, 1.0, 2.0) * (1 - eio(tt, 2.6, 3.4)), stamp = tt > 2.1;
  return <>
    <RBox s={[0.8, 0.02, 0.3]} r={0.004} p={[0, -0.01, 0]}>{M.steel({ col: "#b8bcc2" })}</RBox>
    {[-0.2, -0.05, 0.1, 0.25].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <RBox s={[0.12, 0.012, 0.08]} r={0.004} p={[0, 0.006, 0]}>{M.plastic({ col: "#1a1a1a" })}</RBox>
      {i % 2 === 0 ? Array.from({ length: 6 }, (_, k) => <group key={k} position={[-0.04 + (k % 3) * 0.04, 0.02, -0.018 + Math.floor(k / 3) * 0.036]}>
        <RBox s={[0.03, 0.014, 0.018]} r={0.006}>{M.matte({ col: "#f4f1ea" })}</RBox>
        <RBox s={[0.032, 0.006, 0.02]} r={0.003} p={[0, 0.009, 0]}>{M.matte({ col: k % 2 ? "#e8704a" : "#c8303a" })}</RBox></group>)
      : Array.from({ length: 5 }, (_, k) => <mesh key={k} position={[-0.035 + (k % 3) * 0.035, 0.024, -0.015 + Math.floor(k / 3) * 0.03]} scale={[1, 0.75, 1]}><dodecahedronGeometry args={[0.019, 1]} />{M.matte({ col: "#b8742a" })}</mesh>)}
      <RBox s={[0.122, 0.04, 0.082]} r={0.006} p={[0, 0.026, 0]}><meshPhysicalMaterial color="#ffffff" roughness={0.1} transparent opacity={0.18} /></RBox>
    </group>)}
    {stamp && <group position={[-0.05, 0.048, 0.0]} scale={pop(tt, 2.1)}><mesh rotation={[-PI / 2, 0, 0.1]}><circleGeometry args={[0.032, 32]} /><meshStandardMaterial map={txt("half", ["50%", "OFF"], { w: 200, h: 200, bg: "#f4d03f", fg: "#b8302a", size: 60 })} emissive="#f4d03f" emissiveIntensity={0.2} /></mesh></group>}
    <group position={[-0.05, 0.14 - 0.06 * gun, 0.04]} rotation={[0.5, 0, 0]}>
      <RBox s={[0.05, 0.035, 0.12]} r={0.008}>{M.plastic({ col: "#d8342a" })}</RBox>
      <RBox s={[0.025, 0.07, 0.03]} r={0.006} p={[0, -0.04, 0.03]}>{M.plastic({ col: "#2a2a2e" })}</RBox>
    </group>
    <pointLight position={[0, 0.3, 0.2]} intensity={0.9} distance={0.8} color="#eaf4ff" />

  </>;
}}</Scene3D>;

// ---- 5:03 · MEIWAKU: el formulario de ayuda social sobre la mesa; una mano con la lapicera se acerca... duda... y lo devuelve al sobre; la foto del hijo queda mirando ----
export const HBurdenE: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [0, 0.06, 0], az: [-0.1, 0.08], el: [0.75, 0.62], r: [0.55, 0.48], fov: 32 }}>{(tt) => {
  const near = eio(tt, 0.6, 1.8) * (1 - eio(tt, 3.0, 3.8)), back = eio(tt, 3.6, 5.2);
  return <>
    <RBox s={[1.0, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    <group position={[lerp(0, 0.18, back), 0.002, lerp(0.03, -0.06, back)]} rotation={[0, 0.4 * back, 0]} scale={1 - 0.5 * back}>
      <RBox s={[0.16, 0.003, 0.21]} r={0.002}>{M.matte({ col: "#f6f1e4" })}</RBox>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.2]} /><meshStandardMaterial map={txt("welf", ["APPLICATION", "public assistance", "", "family contact: ____", "", "signature: ____"], { w: 420, h: 560, bg: "#f6f1e4", fg: "#22304e", size: 40 })} /></mesh>
    </group>
    <RBox s={[0.17, 0.012, 0.11]} r={0.002} p={[0.2, 0.006, -0.08]}>{M.matte({ col: "#d8c8a0" })}</RBox>
    <group position={[lerp(-0.2, -0.03, near), 0.05 - 0.03 * near, 0.12 - 0.05 * near]} rotation={[0, 0, 0.6]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.11, 10]} />{M.plastic({ col: "#1d2f5a" })}</mesh>
    </group>
    <group position={[-0.24, 0, -0.16]} rotation={[-0.3, 0.3, 0]}>
      <RBox s={[0.09, 0.11, 0.008]} r={0.003} p={[0, 0.055, 0]}>{M.wood({ base: [70, 50, 34] })}</RBox>
      <mesh position={[0, 0.058, 0.005]}><planeGeometry args={[0.07, 0.085]} /><meshStandardMaterial color="#9ab0c0" /></mesh>
      <group position={[0, 0.022, 0.006]} scale={0.32}><Fig s={1} cloth="#2a3a5a" /></group>
    </group>
    <Sheet map={txt("mwk", ["meiwaku", "being trouble for someone"], { w: 560, h: 170, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.2} h={0.061} p={[-0.02, 0.004, 0.2]} r={[-PI / 2, 0, 0]} s={pop(tt, 4.2)} em={0.25} />
  </>;
}}</Scene3D>;

// ---- 5:19 · EL PASILLO DE LAS ETIQUETAS: la empleada avanza con la pistola; detrás de ella, los mayores se acercan despacio, como palomas; cada bandeja etiquetada desaparece ----
export const HAisle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#cfd6da" lamp={[0, 0.8, 0.5]}
  cam={{ at: [0, 0.12, 0], at1: [0.15, 0.1, 0], az: [-0.75, -0.6], el: [0.4, 0.35], r: [1.0, 0.85], fov: 32 }}>{(tt) => {
  const u = eio(tt, 0.4, 6.4), ex = lerp(-0.4, 0.4, u);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#d8d6ce" roughness={0.5} /></mesh>
    <RBox s={[1.0, 0.12, 0.14]} r={0.006} p={[0, 0.06, -0.12]}>{M.steel({ col: "#c8ccd2" })}</RBox>
    {Array.from({ length: 9 }, (_, i) => { const x = -0.4 + i * 0.1, tag = ex > x + 0.02, gone = cl((ex - x - 0.12) / 0.08);
      return gone < 1 ? <group key={i} position={[x, 0.12 + 0.12 * gone, -0.12 + 0.2 * gone]} scale={1 - 0.6 * gone}>
        <RBox s={[0.08, 0.015, 0.06]} r={0.004} p={[0, 0.0075, 0]}>{M.matte({ col: i % 2 ? "#c87a3a" : "#e8d8b8" })}</RBox>
        {tag && <mesh position={[0.02, 0.016, 0.01]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012, 20]} /><meshStandardMaterial color="#f4d03f" emissive="#f4d03f" emissiveIntensity={0.3} /></mesh>}
      </group> : null; })}
    <Fig p={[ex, 0, 0.02]} r={[0, -PI / 2, 0]} s={1.25} cloth="#2a6a3a" arm={0.5} />
    {[0, 1, 2, 3].map((i) => { const fx = lerp(-0.55 + i * 0.12, ex - 0.12 - i * 0.07, eio(tt, 0.8 + i * 0.4, 6.0)); return <Gran key={i} p={[fx, 0, 0.14 + (i % 2) * 0.06]} r={[0, -PI / 2 + 0.3, 0]} s={1.1} bow={0.2} cloth={["#6a5a4a", "#7a7a80", "#5a6a7a", "#8a7060"][i]} />; })}
  </>;
}}</Scene3D>;
