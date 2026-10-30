// tdp29c · componentes 20-32: el teléfono nueve días, un día del hombre, el maeul, el jeong, las torres, la mesa compartida, las cosas sin reclamar, la señora del yogur, la leche en la puerta, el café de la iglesia, el rincón, el golpe en la puerta, los dos cafés.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, rn, tubeG } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Block, Can, Clock24, Fig, House } from "./tkit3d";
import { Bed, Desk, Door } from "./heroes_c1";

const Tree: React.FC<{ p?: number[]; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p as [number, number, number]} scale={s}>
  <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.025, 0.04, 0.24, 12]} />{M.wood({ base: [90, 64, 40] })}</mesh>
  {[[0, 0.3, 0, 0.16], [-0.1, 0.26, 0.04, 0.11], [0.1, 0.27, -0.03, 0.12], [0.02, 0.36, -0.06, 0.1]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} castShadow><icosahedronGeometry args={[r, 1]} /><meshStandardMaterial color={["#4a7a3a", "#5a8a42", "#3f6a34", "#558040"][i]} roughness={0.95} flatShading /></mesh>)}
</group>;
const Hanok: React.FC<{ p?: number[]; r?: number[]; s?: number; lit?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, lit = 0 }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.3, 0.14, 0.18]} r={0.004} p={[0, 0.09, 0]}>{M.matte({ col: "#efe6d2" })}</RBox>
  <RBox s={[0.32, 0.02, 0.2]} r={0.003} p={[0, 0.01, 0]}>{M.matte({ col: "#9a8f80" })}</RBox>
  <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]} scale={[1.25, 0.5, 0.75]} castShadow><cylinderGeometry args={[0.02, 0.17, 0.18, 4, 1]} />{M.matte({ col: "#3a3e46" })}</mesh>
  {[-0.08, 0.08].map((x, i) => <mesh key={i} position={[x, 0.09, 0.091]}><planeGeometry args={[0.07, 0.08]} /><meshBasicMaterial color={new THREE.Color("#c9b894").lerp(new THREE.Color("#ffd59a"), cl(lit))} toneMapped={false} /></mesh>)}
</group>;
const PChair: React.FC<{ p?: number[]; r?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, col = "#e9e6de" }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.06, 0.006, 0.06]} r={0.003} p={[0, 0.06, 0]}>{M.plastic({ col })}</RBox>
  <RBox s={[0.06, 0.06, 0.006]} r={0.003} p={[0, 0.09, -0.028]}>{M.plastic({ col })}</RBox>
  {[[-0.025, -0.025], [0.025, -0.025], [-0.025, 0.025], [0.025, 0.025]].map(([x, z], i) => <mesh key={i} position={[x, 0.03, z]}><cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />{M.plastic({ col })}</mesh>)}
</group>;

// ---- 12:30 · EL TELÉFONO SONÓ NUEVE DÍAS: el celular sobre el colchón vibra y se ilumina; el contador de días pasa de 1 a 9; nadie lo atiende ----
export const HNineDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0b0c10" lamp={[0, 0.6, 0.5]}
  cam={{ at: [0, 0.03, 0], at1: [0.02, 0.02, 0.02], az: [-0.2, 0.1], el: [0.9, 0.95], r: [0.7, 0.45], fov: 32 }}>{(tt) => {
  const d = 1 + Math.min(8, Math.floor(eio(tt, 0.5, 5.8) * 9)), ring = Math.sin(tt * 2 * PI * 0.8) > 0.2 ? 1 : 0, dim = eio(tt, 5.6, 6.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.4, 1]} /><meshStandardMaterial color="#3a342c" /></mesh>
    <RBox s={[0.42, 0.03, 0.3]} r={0.01} p={[0, 0.015, 0]}>{M.matte({ col: "#6a7080" })}</RBox>
    <group position={[0.02 + 0.003 * ring * Math.sin(tt * 90), 0.034, 0.02]} rotation={[0, 0.3, 0]}>
      <RBox s={[0.06, 0.006, 0.12]} r={0.008}>{M.matte({ col: "#14161c" })}</RBox>
      <mesh position={[0, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.054, 0.11]} /><meshBasicMaterial color={new THREE.Color("#0a0c12").lerp(new THREE.Color("#cfe6ff"), ring * (1 - dim))} toneMapped={false} /></mesh>
    </group>
    {ring > 0 && dim < 0.9 && [0, 1].map((i) => <mesh key={i} position={[0.02, 0.036, 0.02]} rotation={[-PI / 2, 0, 0]} scale={1 + i * 0.5 + (tt * 2) % 1}><ringGeometry args={[0.07, 0.074, 40]} />{M.glow({ col: "#cfe6ff", op: 0.35 * (1 - ((tt * 2) % 1)) })}</mesh>)}
    <Sheet map={txt("nd" + d, ["day " + d], { w: 300, h: 120, bg: "#f2ead8", fg: "#2a2420", size: 80, font: HANDF })} w={0.12} h={0.048} p={[-0.13, 0.034, 0.1]} r={[-PI / 2, 0, 0.08]} />
  </>;
}}</Scene3D>;

// ---- 13:25 · UN DÍA DEL HOMBRE: el reloj de 24 horas gira; a su alrededor se prenden, de a uno, los momentos: la alarma del vecino, los fideos, el banco del río, el soju, la pantalla ----
export const HDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0e1016" lamp={[0, 0.7, 0.6]}
  cam={{ at: [0, 0.22, 0], az: [-0.15, 0.12], el: [0.1, 0.08], r: [1.2, 1.05], fov: 32 }}>{(tt) => {
  const hr = lerp(5, 24, eio(tt, 0.3, 6.6));
  const mom: [number, string][] = [[5, "alarm next door"], [7, "noodles, standing"], [10, "job listings"], [13, "a bench by the river"], [16, "soju"], [20, "old songs on the phone"], [24, "the building, listening"]];
  return <>
    <Clock24 p={[0, 0.24, 0]} s={1.1} h={hr % 24} />
    {mom.map(([hh, l], i) => { const a = (hh / 24) * 2 * PI, on = eio(tt, 0.3 + ((hh - 5) / 19) * 6.3, 0.6 + ((hh - 5) / 19) * 6.3);
      return <group key={i} position={[Math.sin(a) * 0.36, 0.24 + Math.cos(a) * 0.3, 0.02]} scale={pop(tt, 0.3 + ((hh - 5) / 19) * 6.3)}>
        <Sheet map={txt("dy" + i, [String(hh === 24 ? "0" : hh) + ":00", l], { w: 420, h: 190, bg: "#f2ead8", fg: "#2a2420", size: 64, font: HANDF })} w={0.17} h={0.077} em={0.1 + 0.2 * on} r={[0, 0, (rn(i, 2) - 0.5) * 0.1]} />
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 14:36 · EL MAEUL: veinte casas de teja alrededor de un zelkova enorme; abajo la plataforma de madera con los viejos; en el patio las tinas de kimchi pasan de casa en casa ----
export const HMaeul: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#c9d8de" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0], at1: [0.0, 0.12, 0.08], az: [-0.6, 0.2], el: [0.42, 0.22], r: [1.4, 0.85], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#8a9a5a" roughness={0.95} /></mesh>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, 0]}><circleGeometry args={[0.3, 40]} /><meshStandardMaterial color="#b8a888" /></mesh>
  <Tree p={[0, 0, -0.04]} s={1.5 * pop(tt, 0.2)} />
  <RBox s={[0.22, 0.03, 0.14]} r={0.004} p={[0, 0.03, 0.12]}>{M.wood({ base: [130, 96, 60] })}</RBox>
  {[-0.07, 0.0, 0.07].map((x, i) => <Fig key={i} p={[x, 0.045, 0.12]} s={0.8} sit={1} cloth={["#e9e4d8", "#d8d2c4", "#c9c2b4"][i]} head={0.1 * Math.sin(tt * 2 + i)} arm={i === 1 ? 0.4 + 0.2 * Math.sin(tt * 3) : 0} />)}
  {Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * 2 * PI + 0.2, r = 0.5 + (i % 3) * 0.12;
    return <Hanok key={i} p={[Math.cos(a) * r, 0, Math.sin(a) * r * 0.7]} r={[0, -a + PI / 2, 0]} s={0.55 * pop(tt, 0.3 + i * 0.06)} lit={0.3} />; })}
  {[0, 1, 2, 3].map((i) => { const k = eio(tt, 2.0 + i * 0.9, 3.0 + i * 0.9), a0 = 0.6 + i * 1.4, a1 = a0 + 1.4, a = lerp(a0, a1, k), r = 0.38;
    return <group key={"k" + i} position={[Math.cos(a) * r, 0, Math.sin(a) * r * 0.7]} scale={pop(tt, 1.8 + i * 0.9)}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.03, 0.025, 0.04, 20]} />{M.plastic({ col: "#c94a2a" })}</mesh>
      <Fig p={[0.04, 0, 0]} s={0.75} cloth="#8a5a6a" arm={0.8} bow={0.2} />
    </group>; })}
</>}</Scene3D>;

// ---- 15:08 · EL JEONG: hilos de luz tibia se tienden entre las casas del pueblo; cuando una puerta no se abre en dos días, un vecino sigue el hilo, abre y grita el nombre ----
export const HJeong: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1c1a22" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.08, 0], at1: [0.25, 0.08, 0.05], az: [-0.3, 0.1], el: [0.45, 0.3], r: [1.3, 0.9], fov: 32 }}>{(tt) => {
  const pos = [[-0.5, -0.2], [-0.2, -0.3], [0.1, -0.25], [0.4, -0.05], [-0.4, 0.15], [0.0, 0.1]], walk = eio(tt, 3.2, 4.8), open = eio(tt, 4.8, 5.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color="#3a4a32" roughness={0.95} /></mesh>
    {pos.map(([x, z], i) => <Hanok key={i} p={[x, 0, z]} s={0.6} lit={i === 3 ? 0.1 : 0.8} />)}
    {pos.flatMap(([x, z], i) => pos.slice(i + 1).map(([x2, z2], j) => { const k = eio(tt, 0.4 + (i + j) * 0.12, 1.2 + (i + j) * 0.12), mid: number[] = [(x + x2) / 2, 0.22, (z + z2) / 2];
      return <mesh key={i + "-" + j} geometry={tubeG("jg" + i + j, [[x, 0.12, z], mid, [x2, 0.12, z2]], 0.0025, 24, 5)} scale={[1, Math.max(0.001, k), 1]}>{M.glow({ col: i === 3 || i + j + 1 === 3 ? "#ffcf8a" : "#ffb86a", op: 0.55 * (i === 3 || i + j + 1 === 3 ? 0.4 + 0.6 * Math.abs(Math.sin(tt * 3)) : 1) })}</mesh>; }))}
    <group position={[lerp(0.0, 0.38, walk), 0, lerp(0.1, 0.07, walk)]} rotation={[0, PI / 2 * (walk > 0.02 && walk < 0.98 ? 1 : 0), 0]}><Fig s={1.0} cloth="#8a5a3a" arm={0.9 * open} /></group>
    <mesh position={[0.4, 0.05, 0.05]} rotation={[0, -1.3 * open, 0]}><planeGeometry args={[0.05, 0.08]} /><meshBasicMaterial color="#ffd59a" transparent opacity={open} toneMapped={false} /></mesh>
    {[0, 1, 2].map((i) => { const k = eio(tt, 5.2 + i * 0.3, 6.2 + i * 0.3); return tt > 5.2 + i * 0.3 ? <mesh key={"sh" + i} position={[0.36, 0.18, 0.08]} rotation={[0, -0.6, 0]} scale={0.04 + 0.12 * k}><torusGeometry args={[0.5, 0.03, 8, 30, PI / 2]} />{M.glow({ col: "#ffd59a", op: 1 - k })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 15:46 · A LAS TORRES: las casitas del pueblo suben como fichas a una torre de 25 pisos; el ascensor sube con cinco personas mirando cada una para otro lado ----
export const HTowers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#cdd5dc" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.35, 0], at1: [0, 0.14, 0.3], az: [-0.35, -0.2], el: [0.12, 0.05], r: [1.6, 0.75], fov: 32 }}>{(tt) => {
  const up = eio(tt, 0.4, 3.0), ride = eio(tt, 3.6, 6.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#8a8e84" /></mesh>
    <Block p={[0, 0, -0.1]} s={1.0} cols={6} rows={14} col="#e9e6df" on={(i) => (Math.floor(i / 6) / 14 < up ? (rn(i, 3) > 0.3 ? 0.9 : 0.1) : 0)} />
    {Array.from({ length: 8 }, (_, i) => { const k = eio(tt, 0.2 + i * 0.3, 1.2 + i * 0.3); return <group key={i} position={[lerp(-0.7 + i * 0.18, 0, k), lerp(0, 0.06 + i * 0.12, k), lerp(0.3, 0.0, k)]} scale={0.18 * (1 - k) + 0.001}><Hanok /></group>; })}
    <group position={[0, 0, 0.32]} scale={pop(tt, 3.2)}>
      <RBox s={[0.36, 0.16, 0.16]} r={0.004} p={[0, 0.08, 0]}>{M.glass({ col: "#fff1d0", op: 0.18 })}</RBox>
      <pointLight position={[0, 0.12, 0]} intensity={0.25 * ride + 0.1} distance={0.5} color="#fff1d0" />
      {[-0.12, -0.04, 0.04, 0.12].map((x, i) => <Fig key={i} p={[x, 0, (i % 2) * 0.04 - 0.02]} r={[0, [0.9, -1.4, 2.6, -0.4][i], 0]} s={1.0} cloth={["#2a3a5a", "#5a3a3a", "#3a3a3a", "#6a6a72"][i]} head={-0.3} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 16:53 · NADIE COMÍA SOLO: un hombre come solo en una mesita; una mano lo llama; las mesas se juntan en una sola larga y se llena ----
export const HTable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#18140f" lamp={[0, 0.7, 0.4]} warm={0.8}
  cam={{ at: [0, 0.08, 0], az: [-0.3, 0.25], el: [0.45, 0.35], r: [1.0, 0.9], fov: 32 }}>{(tt) => {
  const join = eio(tt, 2.2, 3.6);
  return <>
    {[0, 1, 2].map((i) => { const x0 = [-0.36, 0.0, 0.36][i], z0 = [0.15, -0.12, 0.15][i];
      return <group key={i} position={[lerp(x0, -0.24 + i * 0.24, join), 0, lerp(z0, 0, join)]}>
        <RBox s={[0.22, 0.012, 0.16]} r={0.004} p={[0, 0.08, 0]}>{M.wood({ base: [150, 110, 70] })}</RBox>
        {[[-0.09, -0.06], [0.09, -0.06], [-0.09, 0.06], [0.09, 0.06]].map(([x, z], j) => <mesh key={j} position={[x, 0.04, z]}><cylinderGeometry args={[0.004, 0.004, 0.08, 6]} />{M.wood({ base: [110, 80, 50] })}</mesh>)}
        {[-0.05, 0.05].map((x, j) => <mesh key={"b" + j} position={[x, 0.095, 0]}><cylinderGeometry args={[0.02, 0.015, 0.02, 16]} />{M.porcelain({ col: j ? "#c94a2a" : "#f2efe8" })}</mesh>)}
      </group>; })}
    <Fig p={[0.0, 0, -0.22]} s={1.1} sit={1} cloth="#4a4a52" head={-0.3 * (1 - join)} />
    <Fig p={[-0.36, 0, 0.3]} r={[0, PI, 0]} s={1.1} sit={1} cloth="#8a5a6a" arm={1.2 * eio(tt, 1.0, 1.6) * (1 - eio(tt, 2.4, 2.8))} />
    <Fig p={[0.36, 0, 0.3]} r={[0, PI, 0]} s={1.1} sit={1} cloth="#5a6a3a" />
    {[0, 1, 2].map((i) => <group key={"n" + i} scale={pop(tt, 3.8 + i * 0.4)}><Fig p={[-0.24 + i * 0.24, 0, 0.17]} r={[0, PI, 0]} s={1.05} sit={1} cloth={["#3a5a6a", "#7a4a3a", "#6a6a72"][i]} /></group>)}
    {[0, 1].map((i) => <group key={"m" + i} scale={pop(tt, 4.6 + i * 0.4)}><Fig p={[-0.24 + i * 0.48, 0, -0.18]} s={1.05} sit={1} cloth={["#5a4a3a", "#3a4a6a"][i]} /></group>)}
  </>;
}}</Scene3D>;

// ---- 17:21 · LO QUE NADIE RECLAMA: un estante de cajas con etiqueta; en una caja abierta, las fotos y los papeles; las etiquetas dicen «unclaimed» y la cámara pasa de largo ----
export const HUnclaimed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#121318" lamp={[-0.3, 0.6, 0.6]}
  cam={{ at: [-0.25, 0.22, 0], at1: [0, 0.42, -0.05], az: [-0.12, 0.05], el: [0.1, 0.5], r: [0.8, 0.42], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2a2c32" /></mesh>
  {[0, 1, 2].map((s) => <RBox key={s} s={[1.4, 0.012, 0.18]} r={0.002} p={[0, 0.05 + s * 0.15, -0.05]}>{M.steel({ col: "#7a8088" })}</RBox>)}
  {Array.from({ length: 27 }, (_, i) => { const x = -0.62 + (i % 9) * 0.155, y = 0.056 + Math.floor(i / 9) * 0.15, op = i === 22;
    return <group key={i} position={[x, y, -0.05]} scale={pop(tt, 0.1 + rn(i, 2) * 0.8)}>
      <RBox s={[0.13, 0.1, 0.15]} r={0.004} p={[0, 0.05, 0]}>{M.matte({ col: "#b89a70" })}</RBox>
      <mesh position={[0, 0.05, 0.076]}><planeGeometry args={[0.08, 0.035]} /><meshStandardMaterial map={txt("uc" + (i % 5), ["UNCLAIMED", "#" + (2300 + i * 7)], { w: 256, h: 112, bg: "#f6f1e4", fg: "#22304e", size: 40 })} /></mesh>
      {op && <><mesh position={[0, 0.1, -0.02]} rotation={[-1.9 * eio(tt, 2.4, 3.0), 0, 0]}><planeGeometry args={[0.13, 0.12]} /><meshStandardMaterial color="#a88a60" side={THREE.DoubleSide} /></mesh>
        {[0, 1, 2].map((k) => <mesh key={k} position={[-0.035 + k * 0.035, 0.1 + 0.015 * k + 0.07 * eio(tt, 3.0 + k * 0.3, 3.8 + k * 0.3), 0.02]} rotation={[-0.3, 0, (rn(k, 3) - 0.5) * 0.4]}><planeGeometry args={[0.055, 0.042]} /><meshStandardMaterial color={["#e9d7b0", "#d7c9b8", "#f2e0c8"][k]} side={THREE.DoubleSide} /></mesh>)}</>}
    </group>; })}
  <pointLight position={[0.02, 0.4, 0.2]} intensity={0.5} distance={0.6} color="#ffe2b0" />
</>}</Scene3D>;

// ---- 18:10 · LA SEÑORA DEL YOGUR: su carrito eléctrico recorre el pasaje; deja un frasquito en cada puerta; en una golpea y espera ----
export const HYogurt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#cfd7de" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [-0.4, 0.1, 0.0], at1: [0.0, 0.12, -0.02], az: [-0.3, -0.12], el: [0.22, 0.14], r: [0.85, 0.52], fov: 32 }}>{(tt) => {
  const x = lerp(-0.75, 0.55, eio(tt, 0.3, 6.5)), knock = eio(tt, 3.6, 3.8) * (1 - eio(tt, 4.6, 4.8));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#9a9a96" /></mesh>
    {Array.from({ length: 8 }, (_, i) => { const dx = -0.7 + i * 0.2, left = x > dx + 0.02;
      return <group key={i} position={[dx, 0, -0.12]}>
        <RBox s={[0.18, 0.22, 0.02]} r={0.002} p={[0, 0.11, -0.02]}>{M.matte({ col: ["#d8cfc0", "#cfd3d8", "#e2d6c2"][i % 3] })}</RBox>
        <Door p={[0, 0, 0]} s={0.9} col={["#5a6a7a", "#7a5a4a", "#4a6a5a"][i % 3]} />
        {left && <group position={[0.04, 0, 0.03]} scale={pop(tt, 0.3 + ((dx + 0.75) / 1.3) * 6.2)}><mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.007, 0.007, 0.024, 12]} />{M.plastic({ col: "#f2efe6" })}</mesh><mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.0072, 0.0072, 0.004, 12]} />{M.plastic({ col: "#d23a2a" })}</mesh></group>}
      </group>; })}
    <group position={[x, 0, 0.1]}>
      <RBox s={[0.12, 0.07, 0.07]} r={0.01} p={[0, 0.055, 0]}>{M.pvc({ col: "#f2efe6" })}</RBox>
      <RBox s={[0.12, 0.012, 0.07]} r={0.004} p={[0, 0.095, 0]}>{M.plastic({ col: "#e0b030" })}</RBox>
      {[-0.04, 0.04].map((wx, i) => <mesh key={i} position={[wx, 0.015, 0.0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.015, 0.015, 0.08, 14]} />{M.rubber({ col: "#222" })}</mesh>)}
      <group position={[-0.09, 0, 0]} rotation={[0, knock > 0 ? -PI / 2 : 0, 0]}><Fig s={1.0} cloth="#e0b030" hat="#e0b030" arm={knock > 0 ? 1.2 + 0.25 * Math.sin(tt * 20) : 0.3} /></group>
      {[0, 1, 2].map((i) => { const a0 = 3.7 + i * 0.3, k = eio(tt, a0, a0 + 0.55); return tt > a0 && tt < a0 + 0.6 ? <mesh key={"kn" + i} position={[-0.1, 0.16, -0.2]} scale={0.02 + 0.07 * k}><ringGeometry args={[0.8, 1, 32]} />{M.glow({ col: "#c0392b", op: 0.8 * (1 - k) })}</mesh> : null; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 18:39 · LA LECHE EN LA PUERTA: el cartón de hoy y el de ayer siguen ahí; el segundo cartón se apoya junto al primero; una mano golpea ----
export const HMilk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16181e" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.1, 0], at1: [0, 0.06, 0.02], az: [-0.3, 0.2], el: [0.2, 0.15], r: [0.75, 0.48], fov: 32 }}>{(tt) => {
  const knock = eio(tt, 3.6, 3.8);
  const Milk = ({ x, a }: { x: number; a: number }) => <group position={[x, fallY(tt, a, 0.1), 0.06]} scale={pop(tt, a)}>
    <RBox s={[0.04, 0.07, 0.04]} r={0.003} p={[0, 0.035, 0]}>{M.matte({ col: "#f6f3ea" })}</RBox>
    <mesh position={[0, 0.08, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.029, 0.02, 4]} />{M.matte({ col: "#f6f3ea" })}</mesh>
    <mesh position={[0, 0.04, 0.0205]}><planeGeometry args={[0.03, 0.03]} /><meshStandardMaterial color="#3a7ac9" /></mesh>
  </group>;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#5a5a5c" /></mesh>
    <mesh position={[0, 0.2, -0.01]}><planeGeometry args={[1.0, 0.4]} /><meshStandardMaterial color="#b9b4aa" /></mesh>
    <Door p={[0, 0, 0]} s={2.0} col="#4a5a6a" n="503" />
    <Milk x={-0.05} a={0.3} />
    <Sheet map={txt("mk1", ["yesterday"], { w: 300, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 60, font: HANDF })} w={0.08} h={0.027} p={[-0.05, 0.12, 0.09]} s={pop(tt, 1.2)} />
    <Milk x={0.02} a={2.0} />
    <Sheet map={txt("mk2", ["today"], { w: 300, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 60, font: HANDF })} w={0.08} h={0.027} p={[0.03, 0.12, 0.09]} s={pop(tt, 2.6)} />
    {[0, 1, 2].map((i) => { const a = 3.8 + i * 0.35, k = eio(tt, a, a + 0.6); return tt > a ? <mesh key={i} position={[0.14, 0.18, 0.05]} scale={0.02 + 0.08 * k}><ringGeometry args={[0.8, 1, 32]} />{M.glow({ col: "#ffd59a", op: 0.8 * (1 - k) })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 19:42 · EL CAFÉ DE LA IGLESIA: mesas simples con juegos de tablero, la cafetera, una tele que nadie mira; las mesas se llenan y la gente habla ----
export const HCafe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#1a1510" lamp={[0, 0.7, 0.4]} warm={0.9}
  cam={{ at: [0, 0.1, 0], az: [-0.35, 0.2], el: [0.42, 0.32], r: [1.15, 0.95], fov: 32 }}>{(tt) => <>
  <mesh position={[0, 0.25, -0.45]}><planeGeometry args={[1.6, 0.5]} /><meshStandardMaterial color="#d8cbb0" /></mesh>
  <RBox s={[0.18, 0.11, 0.02]} r={0.004} p={[0.45, 0.32, -0.44]}>{M.matte({ col: "#14161c" })}</RBox>
  <mesh position={[0.45, 0.32, -0.429]}><planeGeometry args={[0.16, 0.09]} /><meshBasicMaterial color="#5a7ab0" toneMapped={false} /></mesh>
  <RBox s={[0.24, 0.1, 0.1]} r={0.004} p={[-0.45, 0.05, -0.38]}>{M.wood({ base: [120, 86, 52] })}</RBox>
  <mesh position={[-0.45, 0.14, -0.38]}><cylinderGeometry args={[0.025, 0.03, 0.08, 20]} />{M.steel({ col: "#2a2a2e" })}</mesh>
  {[[-0.25, -0.05], [0.15, -0.1], [-0.05, 0.22], [0.38, 0.18]].map(([x, z], i) => <group key={i} position={[x, 0, z]}>
    <RBox s={[0.2, 0.012, 0.14]} r={0.004} p={[0, 0.08, 0]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />{M.steel({ col: "#555" })}</mesh>
    {i % 2 === 0 && <RBox s={[0.08, 0.004, 0.08]} r={0.001} p={[0, 0.088, 0]}>{M.matte({ col: "#e8d8a8" })}</RBox>}
    {[-1, 1].map((sd) => <group key={sd} scale={pop(tt, 0.4 + i * 0.6 + (sd > 0 ? 0.3 : 0))}><Fig p={[sd * 0.13, 0, 0]} r={[0, -sd * PI / 2, 0]} s={1.0} sit={1} cloth={["#5a4a3a", "#3a5a6a", "#6a6a72", "#7a4a3a", "#4a6a4a", "#5a3a4a", "#3a3a4a", "#8a6a4a"][i * 2 + (sd > 0 ? 1 : 0)]} head={0.12 * Math.sin(tt * 3 + i + sd)} arm={0.35 + 0.25 * Math.sin(tt * 4 + i * 2 + sd)} /></group>)}
    <mesh position={[0.03, 0.095, 0.03]}><cylinderGeometry args={[0.01, 0.008, 0.018, 12]} />{M.porcelain()}</mesh>
  </group>)}
</>}</Scene3D>;

// ---- 20:07 · EL RINCÓN: una silla de plástico sola en el rincón junto a la ventana con lluvia; día 1 un hombre se sienta ahí; día 2 alguien lo saluda; después es él el que cruza a saludar al nuevo ----
export const HCorner: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#14120e" lamp={[-0.2, 0.6, 0.5]} warm={0.8}
  cam={{ at: [0.12, 0.18, -0.1], at1: [0.1, 0.18, -0.1], az: [-0.55, -0.35], el: [0.16, 0.12], r: [1.3, 1.15], fov: 32 }}>{(tt) => {
  const park = eio(tt, 0.4, 1.0), greet = eio(tt, 1.8, 2.6) * (1 - eio(tt, 3.3, 3.8)), cross = eio(tt, 4.2, 5.6), newman = eio(tt, 3.8, 4.3);
  const phase = tt < 3.6 ? 0 : 1;
  return <>
    <mesh position={[0.4, 0.25, -0.35]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#cfc2a8" /></mesh>
    <mesh position={[0.1, 0.25, -0.05]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.6, 0.5]} /><meshStandardMaterial color="#c4b79c" /></mesh>
    <mesh position={[0.38, 0.27, -0.349]}><planeGeometry args={[0.16, 0.14]} /><meshBasicMaterial color="#4a5a6a" /></mesh>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0.31 + rn(i, 2) * 0.14, 0.34 - ((tt * 0.5 + rn(i, 3)) % 1) * 0.14, -0.347]}><planeGeometry args={[0.002, 0.012]} />{M.glow({ col: "#cfe0ff", op: 0.6 })}</mesh>)}
    <PChair p={[0.38, 0, -0.26]} s={1.4} r={[0, 0.2, 0]} />
    <group position={[0.38, 0, -0.26]} scale={phase ? 0.001 : pop(tt, 0.4)}><Fig s={1.2} sit={1} cloth="#4a4a52" head={-0.3 + 0.3 * greet} r={[0, 0.2, 0]} /></group>
    <group position={[lerp(-0.25, 0.25, greet), 0, -0.02]} rotation={[0, PI / 2 + 0.6, 0]} scale={phase ? 0.001 : pop(tt, 1.6)}><Fig s={1.25} cloth="#2a2a30" arm={0.9 * greet} /></group>
    <group position={[0.38, 0, -0.26]} scale={phase ? pop(tt, 3.8) : 0.001}><Fig s={1.2} sit={1} cloth="#5a6a7a" head={-0.35 + 0.3 * cross} r={[0, 0.2, 0]} /></group>
    <group position={[lerp(-0.2, 0.26, cross), 0, lerp(0.1, -0.12, cross)]} rotation={[0, PI * 0.75, 0]} scale={phase ? 1 : 0.001}><Fig s={1.2} cloth="#4a4a52" arm={0.9 * eio(tt, 5.4, 5.8)} /></group>
    <RBox s={[0.1, 0.012, 0.06]} r={0.003} p={[-0.25, 0.09 - 0.01 * newman, 0.1]}>{M.wood({ base: [150, 110, 70] })}</RBox>
  </>;
}}</Scene3D>;

// ---- 21:24 · UN GOLPE EN LA PUERTA: el sensor y el celular se apagan y se corren; queda la puerta; un calendario de días con un golpe en cada uno ----
export const HKnock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15171c" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.25, 0], az: [-0.15, 0.1], el: [0.08, 0.06], r: [1.05, 0.95], fov: 32 }}>{(tt) => {
  const gone = eio(tt, 0.8, 1.8), days = Math.floor(7 * eio(tt, 2.2, 6.2));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#4a4a4c" /></mesh>
    <mesh position={[0, 0.25, -0.02]}><planeGeometry args={[1.4, 0.5]} /><meshStandardMaterial color="#b9b4aa" /></mesh>
    <Door p={[0, 0, 0]} s={2.0} col="#5a6a7a" open={0.2 * eio(tt, 6.2, 6.8)} />
    <group position={[-0.28 - 0.4 * gone, 0.14, 0.05]} scale={Math.max(0.001, 1 - gone)}><RBox s={[0.05, 0.07, 0.05]} r={0.01}>{M.pvc({ col: "#fbfaf6" })}</RBox><mesh position={[0, 0.01, 0.026]}><circleGeometry args={[0.006, 16]} />{M.glow({ col: "#3ae07a" })}</mesh></group>
    <group position={[0.28 + 0.4 * gone, 0.14, 0.05]} scale={Math.max(0.001, 1 - gone)}><RBox s={[0.05, 0.09, 0.008]} r={0.008}>{M.matte({ col: "#14161c" })}</RBox><mesh position={[0, 0, 0.0045]}><planeGeometry args={[0.044, 0.08]} /><meshBasicMaterial color="#9ab8ff" toneMapped={false} /></mesh></group>
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[-0.27 + i * 0.09, 0.42, 0.01]} scale={pop(tt, 2.2 + i * 0.57)}>
      <Sheet map={txt("kd" + i, [["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][i], i < days ? "knock" : ""], { w: 200, h: 200, bg: "#f6f1e4", fg: i < days ? "#c0392b" : "#22304e", size: 50, font: HANDF })} w={0.075} h={0.075} />
    </group>)}
    {[0, 1].map((j) => { const a = 2.2 + Math.max(0, days - 1) * 0.57 + j * 0.25, k = eio(tt, a, a + 0.5); return tt > 2.2 ? <mesh key={j} position={[0.05, 0.16, 0.02]} scale={0.02 + 0.09 * k}><ringGeometry args={[0.8, 1, 32]} />{M.glow({ col: "#ffd59a", op: 0.7 * (1 - k) })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 22:44 · DOS CAFÉS: la tienda de conveniencia de noche; afuera, un viejo en una silla de plástico; se apoyan dos latas de café y se arrima una segunda silla ----
export const HTwoCoffees: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#06070c" lamp={[0, 0.5, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0.04, 0.08, 0.1], az: [-0.35, -0.15], el: [0.15, 0.1], r: [1.15, 0.6], fov: 32 }}>{(tt) => {
  const chair = eio(tt, 3.6, 4.8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#2a2c30" roughness={0.4} metalness={0.2} /></mesh>
    <RBox s={[0.8, 0.32, 0.25]} r={0.004} p={[0, 0.16, -0.25]}>{M.matte({ col: "#e9eef2" })}</RBox>
    <mesh position={[0, 0.15, -0.124]}><planeGeometry args={[0.74, 0.24]} />{M.glow({ col: "#eaf8ff", op: 0.92 })}</mesh>
    <mesh position={[0, 0.3, -0.123]}><planeGeometry args={[0.8, 0.03]} /><meshBasicMaterial color="#2a8a4a" toneMapped={false} /></mesh>
    {Array.from({ length: 4 }, (_, i) => <RBox key={i} s={[0.14, 0.1, 0.02]} r={0.003} p={[-0.27 + i * 0.18, 0.1, -0.135]}>{M.matte({ col: "#b9c4cc" })}</RBox>)}
    <pointLight position={[0, 0.2, 0.1]} intensity={0.8} distance={0.9} color="#eaf8ff" />
    <RBox s={[0.12, 0.006, 0.08]} r={0.003} p={[0.05, 0.075, 0.08]}>{M.plastic({ col: "#e9e6de" })}</RBox>
    <mesh position={[0.05, 0.036, 0.08]}><cylinderGeometry args={[0.004, 0.004, 0.072, 6]} />{M.plastic({ col: "#e9e6de" })}</mesh>
    <PChair p={[-0.07, 0, 0.08]} r={[0, PI / 2, 0]} s={1.3} />
    <Fig p={[-0.07, 0.0, 0.08]} r={[0, PI / 2, 0]} s={1.1} sit={1} cloth="#4a4a52" head={-0.3 + 0.35 * chair} />
    <group position={[0.03, 0.078 + fallY(tt, 1.2, 0.08), 0.08]} scale={pop(tt, 1.2) * 0.4}><Can col="#7a4a2a" /></group>
    <group position={[0.08, 0.078 + fallY(tt, 1.8, 0.08), 0.09]} scale={pop(tt, 1.8) * 0.4}><Can col="#7a4a2a" /></group>
    <PChair p={[lerp(0.45, 0.18, chair), 0, 0.08]} r={[0, -PI / 2, 0]} s={1.3} />
    <group position={[lerp(0.5, 0.18, chair), 0, 0.08]} rotation={[0, -PI / 2, 0]} scale={pop(tt, 3.2)}><Fig s={1.15} cloth="#3a4a5e" sit={chair} /></group>
  </>;
}}</Scene3D>;
