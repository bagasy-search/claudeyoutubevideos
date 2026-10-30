// tdp29e · componentes 25-35: las cinco de la tarde, la pava, la radio, tres generaciones, los hijos a la ciudad, tres preguntas, qué roban, el salón, cada una su silla, el delantal, el jueves.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, rn } from "./h3d";
import { Coin, HANDF, PI, Sheet, pop, txt } from "./lkit3d";
import { Block, Bowl, Calendar, Clock24, Fig, House, Onigiri, Tatami } from "./tkit3d";
import { Gran } from "./heroes_e1";

// ---- 12:53 · LAS CINCO DE LA TARDE: el reloj marca las 17; a la izquierda, adentro, una bandeja de cena aparece; a la derecha, afuera, una mesa vacía; enfrente, el súper encendido con onigiris ----
export const HFivePM: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0c0e14" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0.08, 0.1, 0.0], az: [-0.1, 0.12], el: [0.38, 0.3], r: [1.0, 0.85], fov: 32 }}>{(tt) => {
  const hr = lerp(16.5, 17, eio(tt, 0.4, 1.6)), tray = pop(tt, 1.8), glow = eio(tt, 3.6, 5.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#22252c" /></mesh>
    <Clock24 p={[0, 0.3, -0.45]} s={0.45} h={hr} />
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.004, 0.6]} />{M.glow({ col: "#ffd59a", op: 0.5 })}</mesh>
    <group position={[-0.2, 0, 0]}>
      <RBox s={[0.22, 0.012, 0.14]} r={0.004} p={[0, 0.08, 0]}>{M.wood({ base: [130, 96, 64] })}</RBox>
      <group position={[0, 0.086, 0]} scale={tray}><RBox s={[0.14, 0.008, 0.09]} r={0.006} p={[0, 0.004, 0]}>{M.plastic({ col: "#8a9aa8" })}</RBox><Bowl p={[-0.03, 0.008, 0]} s={0.5} /><Bowl p={[0.03, 0.008, 0.01]} s={0.45} soup /></group>
      <Sheet map={txt("fp1", ["inside: dinner"], { w: 380, h: 80, bg: "#f6f1e4", fg: "#2a2420", size: 56, font: HANDF })} w={0.2} h={0.042} p={[0, 0.004, 0.15]} r={[-PI / 2, 0, 0]} em={0.2} />
      <pointLight position={[0, 0.25, 0.05]} intensity={0.6} distance={0.4} color="#ffcf8a" />
    </group>
    <group position={[0.2, 0, 0]}>
      <RBox s={[0.22, 0.012, 0.14]} r={0.004} p={[0, 0.08, 0]}>{M.wood({ base: [90, 70, 50] })}</RBox>
      <Sheet map={txt("fp2", ["outside: nothing"], { w: 400, h: 80, bg: "#f6f1e4", fg: "#7a1d12", size: 56, font: HANDF })} w={0.2} h={0.04} p={[0, 0.004, 0.2]} r={[-PI / 2, 0, 0]} em={0.2} />
      <Gran p={[0.0, 0, 0.1]} r={[0, PI, 0]} s={1.1} head={0.2} />
      <group position={[0.12, 0, -0.35]}>
        <RBox s={[0.26, 0.14, 0.1]} r={0.004} p={[0, 0.07, 0]}>{M.matte({ col: "#e8e4da" })}</RBox>
        <mesh position={[0, 0.07, 0.051]}><planeGeometry args={[0.22, 0.1]} /><meshBasicMaterial color={new THREE.Color("#2a2e36").lerp(new THREE.Color("#eaf4ff"), 0.4 + 0.6 * glow)} toneMapped={false} /></mesh>
        {[-0.06, 0, 0.06].map((x, i) => <Onigiri key={i} p={[x, 0.05, 0.06]} s={0.45} />)}
        <pointLight position={[0, 0.08, 0.2]} intensity={0.8 * glow} distance={0.5} color="#eaf4ff" />
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 13:45 · LA PAVA: se abre la puerta de una pieza chica; adentro, un futón tendido, una pava que humea y un plato caliente; en la puerta, una tarjetita con su nombre ----
export const HKettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [0, 0.08, -0.05], at1: [0.04, 0.06, -0.12], az: [-0.2, 0.05], el: [0.5, 0.42], r: [1.0, 0.72], fov: 32 }}>{(tt) => {
  const op = eio(tt, 0.4, 1.8);
  return <>
    <Tatami p={[0, 0, -0.1]} w={0.7} d={0.5} />
    <RBox s={[0.7, 0.36, 0.02]} r={0.002} p={[0, 0.18, -0.36]}>{M.matte({ col: "#e8dcc0" })}</RBox>
    <RBox s={[0.02, 0.36, 0.5]} r={0.002} p={[-0.35, 0.18, -0.1]}>{M.matte({ col: "#e0d4b8" })}</RBox>
    <RBox s={[0.02, 0.36, 0.5]} r={0.002} p={[0.35, 0.18, -0.1]}>{M.matte({ col: "#e0d4b8" })}</RBox>
    <group position={[0.35, 0, 0.12]} rotation={[0, -1.3 * op, 0]}><RBox s={[0.012, 0.3, 0.17]} r={0.002} p={[0, 0.15, -0.085]}>{M.wood({ base: [130, 92, 60] })}</RBox></group>
    <group position={[-0.02, 0.0, 0.08]} scale={pop(tt, 2.2)}><RBox s={[0.1, 0.004, 0.05]} r={0.002} p={[0, 0.003, 0]}>{M.matte({ col: "#f6f1e4" })}</RBox>
      <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.095, 0.045]} /><meshStandardMaterial map={txt("ntag", ["welcome,", "Mrs. Sato"], { w: 300, h: 140, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} /></mesh></group>
    <RBox s={[0.16, 0.02, 0.3]} r={0.01} p={[-0.18, 0.01, -0.15]}>{M.matte({ col: "#f2f0ea" })}</RBox>
    <RBox s={[0.15, 0.024, 0.18]} r={0.01} p={[-0.18, 0.03, -0.1]}>{M.matte({ col: "#c8d8e8" })}</RBox>
    <RBox s={[0.16, 0.06, 0.12]} r={0.004} p={[0.12, 0.03, -0.2]}>{M.wood({ base: [90, 60, 40] })}</RBox>
    <group position={[0.09, 0.06, -0.2]}>
      <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.032, 24, 16, 0, 2 * PI, 0, PI * 0.6]} />{M.steel({ col: "#b8bcc2" })}</mesh>
      <mesh position={[0.035, 0.03, 0]} rotation={[0, 0, -0.8]}><cylinderGeometry args={[0.004, 0.007, 0.04, 10]} />{M.steel({ col: "#b8bcc2" })}</mesh>
      {Array.from({ length: 16 }, (_, i) => { const q = ((tt * 0.45 + rn(i, 3)) % 1); return <mesh key={i} position={[0.05 + Math.sin(i + tt) * 0.01 * q, 0.05 + q * 0.12, 0]} scale={0.005 + 0.01 * q}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.22 * (1 - q)} depthWrite={false} /></mesh>; })}
    </group>
    <Bowl p={[0.16, 0.06, -0.2]} s={0.5} soup />
    <pointLight position={[0, 0.3, -0.05]} intensity={0.9 * op} distance={0.8} color="#ffcf8a" />
    <Sheet map={txt("kexp", ["somebody expected you"], { w: 580, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.22} h={0.034} p={[0.0, 0.004, 0.18]} r={[-PI / 2, 0, 0]} s={pop(tt, 4.6)} em={0.3} />
  </>;
}}</Scene3D>;

// ---- 14:16 · LA RADIO: pieza a oscuras; una abuela acostada en el futón; una radio chiquita con su lucecita; de ella salen anillos de sonido que llenan la pieza ----
export const HRadio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#06070c" lamp={[0, 0.4, 0.5]}
  cam={{ at: [0.02, 0.03, -0.02], az: [-0.45, -0.1], el: [0.6, 0.38], r: [0.75, 0.45], fov: 32 }}>{(tt) => <>
  <Tatami p={[0, 0, 0]} w={0.9} d={0.6} />
  <RBox s={[0.16, 0.02, 0.32]} r={0.01} p={[-0.06, 0.01, 0]}>{M.matte({ col: "#d8dde6" })}</RBox>
  <RBox s={[0.17, 0.028, 0.22]} r={0.012} p={[-0.06, 0.03, 0.04]}>{M.matte({ col: "#7a5a8a" })}</RBox>
  {[0, 1, 2, 3].map((k) => <mesh key={k} position={[-0.06, 0.045, -0.04 + k * 0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.17, 0.012]} /><meshStandardMaterial color="#c8a8d8" /></mesh>)}
  <RBox s={[0.08, 0.02, 0.04]} r={0.01} p={[-0.06, 0.03, -0.13]}>{M.matte({ col: "#f2f0ea" })}</RBox>
  <mesh position={[-0.06, 0.035, -0.12]}><sphereGeometry args={[0.022, 16, 12]} />{M.matte({ col: "#d8b89a" })}</mesh>
  <mesh position={[-0.06, 0.042, -0.135]}><sphereGeometry args={[0.022, 16, 12, 0, 2 * PI, 0, PI * 0.6]} />{M.hair({ col: "#c8c6c2" })}</mesh>
  <group position={[0.12, 0, -0.1]} scale={1.6}>
    <RBox s={[0.08, 0.05, 0.03]} r={0.006} p={[0, 0.025, 0]}>{M.plastic({ col: "#5a3a2a" })}</RBox>
    <mesh position={[-0.015, 0.025, 0.016]}><circleGeometry args={[0.014, 24]} />{M.matte({ col: "#2a2a2a" })}</mesh>
    <mesh position={[0.025, 0.035, 0.016]}><circleGeometry args={[0.003, 12]} />{M.glow({ col: "#ff9a3a" })}</mesh>
    <mesh position={[0.025, 0.05, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.001, 0.001, 0.06, 4]} />{M.chrome()}</mesh>
    {Array.from({ length: 5 }, (_, i) => { const q = ((tt * 0.35 + i / 5) % 1); return <mesh key={i} position={[0, 0.025, 0]} scale={(0.03 + q * 0.35) * (0.3 + 0.7 * eio(tt, 0.3, 4.5))}><torusGeometry args={[1, 0.012, 6, 48]} />{M.glow({ col: "#ffcf8a", op: 0.4 * (1 - q) * eio(tt, 0.2, 2.0) })}</mesh>; })}
    <pointLight position={[0, 0.06, 0.03]} intensity={0.35} distance={0.4} color="#ffb860" />
  </group>
  <Sheet map={txt("rad", ["just to have voices"], { w: 520, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.2} h={0.035} p={[0.06, 0.003, 0.2]} r={[-PI / 2, 0, 0]} s={pop(tt, 3.6)} em={0.2} />
</>}</Scene3D>;

// ---- 15:54 · TRES GENERACIONES: la casa grande de campo en corte, llena: la abuela al centro en la cocina, la nuera, el hijo, los nietos; el humo de la olla ----
export const HThreeGen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1a1610" lamp={[-0.2, 0.7, 0.5]} warm={0.9}
  cam={{ at: [0, 0.09, 0], at1: [0.0, 0.08, 0.04], az: [-0.15, 0.12], el: [0.45, 0.36], r: [0.95, 0.78], fov: 32 }}>{(tt) => {
  const F: [number, number, string, number][] = [[-0.22, 0.04, "#4a6a8a", 1.2], [-0.12, 0.08, "#8a4a4a", 1.15], [0.14, 0.06, "#5a7a5a", 0.8], [0.22, 0.02, "#d8a848", 0.75]];
  return <>
    <Tatami p={[0, 0, 0]} w={0.8} d={0.5} />
    <RBox s={[0.8, 0.28, 0.02]} r={0.002} p={[0, 0.14, -0.25]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    <group position={[0, 0, -0.12]}>
      <RBox s={[0.1, 0.04, 0.08]} r={0.004} p={[0, 0.02, 0]}>{M.matte({ col: "#5a4a3a" })}</RBox>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.035, 0.03, 0.04, 24]} />{M.steel({ col: "#3a3a3a" })}</mesh>
      {Array.from({ length: 14 }, (_, i) => { const q = ((tt * 0.4 + rn(i, 2)) % 1); return <mesh key={i} position={[Math.sin(i + tt) * 0.015 * q, 0.09 + q * 0.14, 0]} scale={0.006 + 0.012 * q}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.2 * (1 - q)} depthWrite={false} /></mesh>; })}
      <pointLight position={[0, 0.1, 0.05]} intensity={0.7} distance={0.4} color="#ff9a5a" />
    </group>
    <Gran p={[0, 0, -0.04]} r={[0, 0, 0]} s={1.15} arm={0.4} />
    {F.map(([x, z, c, s], i) => <group key={i} scale={1}><Fig p={[x + (x < 0 ? -0.4 : 0.4) * (1 - eio(tt, 0.2 + i * 0.25, 1.4 + i * 0.25)), 0, z]} r={[0, (x < 0 ? 0.5 : -0.5), 0]} s={s} cloth={c} sit={i > 1 ? 1 : 0} /></group>)}
    <Sheet map={txt("3g", ["three generations, one roof"], { w: 640, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 48, font: HANDF })} w={0.26} h={0.037} p={[0, 0.004, 0.2]} r={[-PI / 2, 0, 0]} s={pop(tt, 3.4)} em={0.25} />
  </>;
}}</Scene3D>;

// ---- 16:36 · A LA CIUDAD: de la casa del pueblo salen figuras por la ruta hacia las torres de la ciudad; las ventanas de la casa se apagan; queda una sola ----
export const HCityMove: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#101318" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.1, 0], az: [-0.25, -0.1], el: [0.35, 0.3], r: [1.05, 0.9], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2a3a2a" roughness={0.95} /></mesh>
  <mesh rotation={[-PI / 2, 0, 0.1]} position={[0, 0.001, 0.02]}><planeGeometry args={[0.9, 0.05]} /><meshStandardMaterial color="#4a4a48" /></mesh>
  <House p={[-0.38, 0, 0]} s={0.45} lit={[1, 1 - eio(tt, 2.0, 2.6), 1 - eio(tt, 3.0, 3.6), 1 - eio(tt, 4.0, 4.6)]} col="#c8b89a" roof="#3a3428" />
  <Block p={[0.38, 0, -0.06]} s={0.7} cols={4} rows={8} col="#9aa0aa" on={(i) => 0.2 + 0.6 * rn(i, 5) * eio(tt, 1.5, 5.0)} />
  {[0, 1, 2].map((i) => { const k = eio(tt, 1.0 + i * 1.0, 3.6 + i * 1.0); return k > 0 && k < 1 ? <Fig key={i} p={[lerp(-0.28, 0.28, k), 0, 0.02 + (0.28 - lerp(-0.28, 0.28, k)) * 0.05]} r={[0, PI / 2, 0]} s={1.1} cloth={["#4a6a8a", "#8a4a4a", "#5a7a5a"][i]} arm={0.3 * Math.sin(tt * 8)} arm2={-0.3 * Math.sin(tt * 8)} /> : null; })}
  <Gran p={[-0.3, 0, 0.1]} r={[0, 1.2, 0]} s={1.0} head={0.15} />
  <Sheet map={txt("cm", ["millions now live alone"], { w: 580, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.22} h={0.034} p={[-0.05, 0.004, 0.22]} r={[-PI / 2, 0, 0]} s={pop(tt, 5.0)} em={0.25} />
</>}</Scene3D>;

// ---- 16:59 · TRES PREGUNTAS: tres tarjetas boca abajo sobre la mesa se dan vuelta de a una, cada una con su pregunta ----
export const HQuestionsE: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#16130f" lamp={[0, 0.7, 0.5]} warm={0.7}
  cam={{ at: [0, 0.03, 0], az: [-0.1, 0.08], el: [0.85, 0.75], r: [0.65, 0.58], fov: 32 }}>{(tt) => <>
  {[["Do men", "do this too?"], ["What do", "they steal?"], ["Is Japan doing", "anything?"]].map((q, i) => { const f = eio(tt, 0.8 + i * 1.6, 1.5 + i * 1.6), x = -0.2 + i * 0.2;
    return <group key={i} position={[x, 0.01 + 0.04 * Math.sin(PI * f), 0]} rotation={[0, 0, PI * (1 - f)]}>
      <RBox s={[0.17, 0.006, 0.23]} r={0.006}>{M.matte({ col: "#f6f1e4" })}</RBox>
      <mesh position={[0, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.22]} /><meshStandardMaterial map={txt("q3" + i, [String(i + 1), "", ...q], { w: 340, h: 470, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} /></mesh>
      <mesh position={[0, -0.0035, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.16, 0.22]} /><meshStandardMaterial color="#7a1d12" /></mesh>
    </group>; })}
</>}</Scene3D>;

// ---- 17:16 · QUÉ ROBAN: en el platillo de una balanza caen onigiri, pan, una fruta; el contador marca menos de 5 dólares; al lado, un monedero abierto con monedas adentro ----
export const HSteal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#101318" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0.04, 0.05, 0.03], az: [-0.2, 0.05], el: [0.5, 0.42], r: [0.72, 0.62], fov: 32 }}>{(tt) => {
  const n = [pop(tt, 0.6), pop(tt, 1.4), pop(tt, 2.2), pop(tt, 3.0)], tot = Math.round(lerp(0, 480, eio(tt, 0.6, 3.4)) / 10) * 10;
  return <>
    <RBox s={[1.0, 0.03, 0.6]} r={0.006} p={[0, -0.015, 0]}>{M.matte({ col: "#3a3e48" })}</RBox>
    <RBox s={[0.22, 0.03, 0.18]} r={0.01} p={[-0.05, 0.015, 0]}>{M.steel({ col: "#c8ccd2" })}</RBox>
    <RBox s={[0.2, 0.006, 0.16]} r={0.004} p={[-0.05, 0.034, 0]}>{M.steel({ col: "#e8eaec" })}</RBox>
    <group position={[-0.05, 0.037, 0]}>
      <Onigiri p={[-0.05, 0.03 + 0.1 * (1 - n[0]), -0.02]} s={0.6} />
      <RBox s={[0.07, 0.035, 0.045]} r={0.015} p={[0.03, 0.018 + 0.1 * (1 - n[1]), -0.03]}>{M.matte({ col: "#d8a868" })}</RBox>
      <mesh position={[0.04, 0.02 + 0.1 * (1 - n[2]), 0.04]}><sphereGeometry args={[0.02, 20, 14]} />{M.matte({ col: "#e88a2a" })}</mesh>
      <RBox s={[0.05, 0.015, 0.035]} r={0.004} p={[-0.03, 0.01 + 0.1 * (1 - n[3]), 0.045]}>{M.plastic({ col: "#e8e2d2" })}</RBox>
    </group>
    <RBox s={[0.12, 0.05, 0.012]} r={0.004} p={[-0.05, 0.03, 0.095]}>{M.matte({ col: "#1a1c22" })}</RBox>
    <mesh position={[-0.05, 0.03, 0.102]}><planeGeometry args={[0.1, 0.035]} /><meshStandardMaterial map={txt("sty" + tot, ["¥" + tot], { w: 280, h: 100, bg: "#1a1c22", fg: "#9ad89a", size: 76 })} emissive="#9ad89a" emissiveIntensity={0.15} /></mesh>
    <group position={[0.2, 0, 0.04]} rotation={[0, -0.4, 0]}>
      <RBox s={[0.1, 0.02, 0.06]} r={0.01} p={[0, 0.01, 0]}>{M.matte({ col: "#8a3a4a" })}</RBox>
      <group position={[0, 0.02, -0.03]} rotation={[-1.45, 0, 0]}><RBox s={[0.1, 0.006, 0.05]} r={0.01} p={[0, 0, 0.025]}>{M.matte({ col: "#8a3a4a" })}</RBox></group>
      {[0, 1, 2].map((i) => <group key={i} position={[(i - 1) * 0.012, 0.04 + i * 0.004, 0.005 + i * 0.006]} rotation={[0.55, 0.15 * (i - 1), 0]}><RBox s={[0.09, 0.002, 0.045]} r={0.001}>{M.matte({ col: "#d8cfa8" })}</RBox><mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.085, 0.04]} /><meshStandardMaterial map={txt("yen10k", ["¥10,000"], { w: 300, h: 140, bg: "#d8cfa8", fg: "#5a4a2a", size: 64 })} /></mesh></group>)}
    </group>
    <Sheet map={txt("stl", ["money in her purse"], { w: 480, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.2} h={0.038} p={[0.12, 0.003, 0.17]} r={[-PI / 2, 0, 0]} s={pop(tt, 4.4)} em={0.25} />
  </>;
}}</Scene3D>;

// ---- 18:11 · EL SALÓN: el salón comunitario se arma: mesas plegables que se abren, sillas de metal, la cocina al fondo, el calendario de cumpleaños en la pared; miércoles, mediodía ----
export const HHall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#d8d4c8" lamp={[0.2, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0], at1: [0.04, 0.1, -0.04], az: [-0.45, -0.3], el: [0.4, 0.32], r: [1.05, 0.9], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#b8a888" roughness={0.6} /></mesh>
  <mesh position={[0, 0.25, -0.35]}><planeGeometry args={[1.6, 0.5]} /><meshStandardMaterial color="#e8e4d8" /></mesh>
  <Calendar p={[-0.32, 0.26, -0.345]} s={0.45} n={0} title="BIRTHDAYS" />
  <RBox s={[0.36, 0.1, 0.08]} r={0.004} p={[0.25, 0.05, -0.3]}>{M.steel({ col: "#c8ccd2" })}</RBox>
  {[0.16, 0.26, 0.34].map((x, i) => <mesh key={i} position={[x, 0.11, -0.3]}><cylinderGeometry args={[0.025, 0.02, 0.03, 20]} />{M.steel({ col: "#8a8e96" })}</mesh>)}
  {[-0.12, 0.08].map((z, r) => <group key={r}>{[0, 1].map((c) => { const k = eio(tt, 0.5 + (r * 2 + c) * 0.5, 1.2 + (r * 2 + c) * 0.5), x = -0.2 + c * 0.32;
    return <group key={c} position={[x, 0, z]}>
      <group rotation={[0, 0, 0]}><RBox s={[0.28, 0.008, 0.1]} r={0.003} p={[0, 0.02 + 0.08 * k, 0]} rot={[PI / 2 * (1 - k), 0, 0]}>{M.matte({ col: "#e8e2d2" })}</RBox></group>
      {[-0.12, 0.12].map((a, j) => <mesh key={j} position={[a, 0.05 * k, 0]} scale={[1, Math.max(0.01, k), 1]}><cylinderGeometry args={[0.004, 0.004, 0.1, 8]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
      {Array.from({ length: 6 }, (_, j) => { const cx = -0.1 + (j % 3) * 0.1, cz = j < 3 ? -0.09 : 0.09; return <group key={"c" + j} position={[cx, 0, cz]} scale={pop(tt, 2.6 + (r * 2 + c) * 0.3 + j * 0.08)} rotation={[0, j < 3 ? 0 : PI, 0]}>
        <RBox s={[0.045, 0.004, 0.045]} r={0.002} p={[0, 0.05, 0]}>{M.steel({ col: "#9aa0aa" })}</RBox>
        <RBox s={[0.045, 0.05, 0.004]} r={0.002} p={[0, 0.075, -0.022]}>{M.steel({ col: "#9aa0aa" })}</RBox>
      </group>; })}
    </group>; })}</group>)}
  <Sheet map={txt("wed", ["Wednesday · 12:00"], { w: 480, h: 100, bg: "#f6f1e4", fg: "#2a2420", size: 60 })} w={0.2} h={0.042} p={[0.0, 0.004, 0.27]} r={[-PI / 2, 0, 0]} s={pop(tt, 4.6)} em={0.25} />
</>}</Scene3D>;

// ---- 19:18 · CADA UNA SU SILLA: la mesa larga con tarjetitas con nombre; las sillas se llenan; del centro salen anillos de charla y risa; el teléfono con la foto del bisnieto pasa de mano en mano ----
export const HSeat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a1610" lamp={[-0.2, 0.7, 0.5]} warm={0.9}
  cam={{ at: [0, 0.08, 0], az: [-0.5, -0.3], el: [0.45, 0.38], r: [0.95, 0.8], fov: 32 }}>{(tt) => {
  const C = ["#8a6a5a", "#5a6a8a", "#7a8a6a", "#9a7a8a", "#6a7a8a", "#8a7a5a", "#5a7a7a", "#9a6a5a"];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#b8a888" roughness={0.6} /></mesh>
    <RBox s={[0.8, 0.012, 0.18]} r={0.003} p={[0, 0.1, 0]}>{M.matte({ col: "#e8e2d2" })}</RBox>
    {[-0.36, 0.36].map((x, i) => <mesh key={i} position={[x, 0.05, 0]}><boxGeometry args={[0.008, 0.1, 0.16]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
    {C.map((c, i) => { const x = -0.3 + (i % 4) * 0.2, side = i < 4 ? -1 : 1, k = pop(tt, 0.4 + i * 0.35);
      return <group key={i}>
        <Bowl p={[x, 0.106, side * 0.05]} s={0.45} soup={i % 2 === 0} />
        <mesh position={[x + 0.035, 0.112, side * 0.07]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.035, 0.014]} /><meshStandardMaterial map={txt("nm" + i, [["Kazu", "Emi", "Hana", "Yoshi", "Mitsu", "Fumi", "Sachi", "Toshi"][i]], { w: 160, h: 64, bg: "#f6f1e4", fg: "#2a2420", size: 40, font: HANDF })} /></mesh>
        <group scale={k}><Gran p={[x, 0, side * 0.14]} r={[0, side < 0 ? 0 : PI, 0]} s={1.05} sit={1} cloth={c} head={0.1 * Math.sin(tt * 3 + i)} arm={0.3 + 0.15 * Math.sin(tt * 4 + i * 2)} /></group>
      </group>; })}
    {Array.from({ length: 4 }, (_, i) => { const q = ((tt * 0.5 + i / 4) % 1); return tt > 3.2 ? <mesh key={"r" + i} position={[0, 0.2, 0]} rotation={[-PI / 2, 0, 0]} scale={0.05 + q * 0.5}><ringGeometry args={[0.95, 1, 48]} />{M.glow({ col: "#ffcf8a", op: 0.3 * (1 - q) })}</mesh> : null; })}
    <group position={[lerp(-0.22, 0.12, eio(tt, 4.0, 6.0)), 0.13, 0.02]}><RBox s={[0.025, 0.004, 0.045]} r={0.003}>{M.matte({ col: "#1a1a1a" })}</RBox><mesh position={[0, 0.0025, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.038]} /><meshBasicMaterial color="#9ac4e8" toneMapped={false} /></mesh></group>
    <pointLight position={[0, 0.4, 0.1]} intensity={0.9} distance={1.0} color="#ffe2b0" />
  </>;
}}</Scene3D>;

// ---- 20:00 · EL DELANTAL: tres miércoles en el calendario ella está sola en la punta; el cuarto miércoles se pone el delantal y pasa a la cocina; un pescado sobre la tabla ----
export const HApron: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#d8d4c8" lamp={[0.2, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0], at1: [0.12, 0.1, -0.06], az: [-0.35, -0.2], el: [0.35, 0.3], r: [0.95, 0.72], fov: 32 }}>{(tt) => {
  const wk = Math.min(4, Math.floor(eio(tt, 0.4, 3.4) * 4.99)), go = eio(tt, 3.6, 5.2), apron = eio(tt, 3.4, 3.9);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#b8a888" roughness={0.6} /></mesh>
    <mesh position={[0, 0.25, -0.35]}><planeGeometry args={[1.6, 0.5]} /><meshStandardMaterial color="#e8e4d8" /></mesh>
    <group position={[-0.3, 0.16, -0.344]}>{[0, 1, 2, 3].map((i) => <group key={i} position={[i * 0.06, 0, 0]}>
      <mesh><planeGeometry args={[0.05, 0.05]} /><meshStandardMaterial map={txt("wd" + i, ["Wed", String(i + 1)], { w: 120, h: 120, bg: i < wk ? "#ffd59a" : "#f6f1e4", fg: "#2a2420", size: 40 })} /></mesh></group>)}</group>
    <RBox s={[0.5, 0.012, 0.16]} r={0.003} p={[-0.1, 0.1, 0.05]}>{M.matte({ col: "#e8e2d2" })}</RBox>
    {[-0.3, 0.1].map((x, i) => <mesh key={i} position={[x, 0.05, 0.05]}><boxGeometry args={[0.008, 0.1, 0.14]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
    {[-0.24, -0.14, -0.04, 0.06].map((x, i) => <Gran key={i} p={[x, 0, -0.06]} r={[0, 0, 0]} s={1.0} sit={1} cloth={["#8a6a5a", "#5a6a8a", "#7a8a6a", "#9a7a8a"][i]} head={0.2 * Math.sin(tt * 2.5 + i)} />)}
    <RBox s={[0.3, 0.1, 0.1]} r={0.004} p={[0.28, 0.05, -0.28]}>{M.steel({ col: "#c8ccd2" })}</RBox>
    <RBox s={[0.1, 0.006, 0.06]} r={0.003} p={[0.28, 0.103, -0.26]}>{M.wood({ base: [180, 150, 110] })}</RBox>
    <mesh position={[0.28, 0.112, -0.26]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.5]}><capsuleGeometry args={[0.009, 0.05, 6, 12]} />{M.chrome()}</mesh>
    <RBox s={[0.045, 0.004, 0.045]} r={0.002} p={[0.24, 0.05, 0.16]}>{M.steel({ col: "#9aa0aa" })}</RBox>
    <RBox s={[0.045, 0.05, 0.004]} r={0.002} p={[0.24, 0.075, 0.182]}>{M.steel({ col: "#9aa0aa" })}</RBox>
    {[[-0.02, -0.02], [0.02, -0.02], [-0.02, 0.02], [0.02, 0.02]].map(([dx, dz], i) => <mesh key={"cl" + i} position={[0.24 + dx, 0.025, 0.16 + dz]}><cylinderGeometry args={[0.002, 0.002, 0.05, 6]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
    <group position={[lerp(0.24, 0.28, go), 0, lerp(0.16, -0.2, go)]}>
      <Gran r={[0, go > 0.5 ? PI : 0, 0]} s={1.05} sit={1 - go} head={lerp(0.45, 0, apron)} cloth="#7a7a80" arm={0.4 * go} arm2={0.4 * go} />
      {apron > 0 && <RBox s={[0.04, 0.05, 0.004]} r={0.002} p={[0, 0.1 - 0.04 * (1 - go), go > 0.5 ? -0.02 : 0.02]}><meshStandardMaterial color="#f2f0ea" transparent opacity={apron} /></RBox>}
    </group>
    <Sheet map={txt("ap", ["best cook in the room"], { w: 540, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.21} h={0.035} p={[0.25, 0.25, -0.2]} s={pop(tt, 5.4)} em={0.25} />
  </>;
}}</Scene3D>;

// ---- 20:13 · EL JUEVES: el miércoles su silla queda vacía; el jueves, en su casa, suena el teléfono: anillos de sonido; una ventana se enciende ----
export const HThursday: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#101318" lamp={[0, 0.6, 0.6]}
  cam={{ at: [-0.16, 0.08, 0], at1: [0.18, 0.08, 0], az: [-0.2, 0.15], el: [0.3, 0.26], r: [0.75, 0.7], fov: 32 }}>{(tt) => {
  const ring = tt > 3.4 && tt < 6.2, lit = eio(tt, 5.6, 6.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#22252c" /></mesh>
    <group position={[-0.24, 0, 0]}>
      <RBox s={[0.28, 0.012, 0.14]} r={0.003} p={[0, 0.1, 0]}>{M.matte({ col: "#e8e2d2" })}</RBox>
      {[-0.08, 0, 0.08].map((x, i) => <group key={i}>
        <RBox s={[0.045, 0.004, 0.045]} r={0.002} p={[x, 0.05, 0.1]}>{M.steel({ col: "#9aa0aa" })}</RBox>
        <RBox s={[0.045, 0.05, 0.004]} r={0.002} p={[x, 0.075, 0.122]}>{M.steel({ col: "#9aa0aa" })}</RBox>
        {i !== 1 && <Gran p={[x, 0, 0.1]} r={[0, PI, 0]} s={1.0} sit={1} cloth={i ? "#5a6a8a" : "#8a6a5a"} />}
      </group>)}
      <mesh position={[0, 0.002, 0.1]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.034, 32]} />{M.glow({ col: "#ffcf8a", op: 0.6 })}</mesh>
      <Sheet map={txt("thw", ["Wednesday"], { w: 320, h: 80, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.12} h={0.03} p={[0, 0.003, 0.22]} r={[-PI / 2, 0, 0]} em={0.2} />
    </group>
    <group position={[0.24, 0, -0.02]}>
      <House p={[0, 0, -0.12]} s={0.4} lit={[0, 0, 0, lit]} col="#c8b89a" roof="#3a3428" />
      <RBox s={[0.06, 0.03, 0.04]} r={0.006} p={[0, 0.015, 0.1]}>{M.plastic({ col: "#e8e2d2" })}</RBox>
      <mesh position={[0, 0.036, 0.1]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.008, 0.05, 6, 12]} />{M.plastic({ col: "#e8e2d2" })}</mesh>
      {ring && Array.from({ length: 3 }, (_, i) => { const q = ((tt * 1.2 + i / 3) % 1); return <mesh key={i} position={[0, 0.03, 0.1]} scale={0.03 + 0.12 * q}><torusGeometry args={[1, 0.03, 6, 40]} />{M.glow({ col: "#9ac4ff", op: 0.6 * (1 - q) })}</mesh>; })}
      <Sheet map={txt("tht", ["Thursday: someone calls"], { w: 560, h: 80, bg: "#ffd59a", fg: "#2a2420", size: 48, font: HANDF })} w={0.21} h={0.03} p={[0, 0.003, 0.2]} r={[-PI / 2, 0, 0]} s={pop(tt, 3.4)} em={0.3} />
      <pointLight position={[0, 0.12, 0.05]} intensity={0.8 * lit} distance={0.4} color="#ffcf8a" />
    </group>
  </>;
}}</Scene3D>;
