// tdp29c · componentes 1-9 (Corea, godoksa): la calle de neón, el contador, el edificio de cuatro pisos, el calendario, los tres años, el goshiwon, el cajón de estacionamiento, el banjiha.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Block, Calendar, Fig } from "./tkit3d";

// ---- piezas propias del video
export const Desk: React.FC<{ p?: number[]; s?: number; r?: number[] }> = ({ p = [0, 0, 0], s = 1, r = [0, 0, 0] }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.12, 0.008, 0.07]} r={0.002} p={[0, 0.075, 0]}>{M.wood({ base: [170, 128, 80] })}</RBox>
  {[[-0.054, -0.03], [0.054, -0.03], [-0.054, 0.03], [0.054, 0.03]].map(([x, z], i) => <mesh key={i} position={[x, 0.037, z]}><cylinderGeometry args={[0.003, 0.003, 0.074, 8]} />{M.steel({ col: "#5a5e66" })}</mesh>)}
</group>;
export const Bed: React.FC<{ p?: number[]; s?: number; r?: number[]; col?: string }> = ({ p = [0, 0, 0], s = 1, r = [0, 0, 0], col = "#8a9bb0" }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.1, 0.035, 0.22]} r={0.004} p={[0, 0.018, 0]}>{M.wood({ base: [120, 86, 52] })}</RBox>
  <RBox s={[0.096, 0.016, 0.21]} r={0.006} p={[0, 0.043, 0]}>{M.matte({ col })}</RBox>
  <RBox s={[0.07, 0.014, 0.04]} r={0.006} p={[0, 0.056, -0.08]}>{M.matte({ col: "#efeae0" })}</RBox>
</group>;
export const Door: React.FC<{ p?: number[]; r?: number[]; s?: number; open?: number; col?: string; n?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, open = 0, col = "#7a8088", n }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <group rotation={[0, -1.4 * open, 0]} position={[-0.035, 0, 0]}>
    <RBox s={[0.07, 0.15, 0.006]} r={0.002} p={[0.035, 0.075, 0]}>{M.steel({ col })}</RBox>
    <mesh position={[0.06, 0.075, 0.005]}><sphereGeometry args={[0.004, 10, 8]} />{M.brass()}</mesh>
    {n && <mesh position={[0.035, 0.125, 0.0035]}><planeGeometry args={[0.03, 0.014]} /><meshStandardMaterial map={txt("dn" + n, [n], { w: 128, h: 60, bg: "#f2efe6", fg: "#222", size: 40 })} /></mesh>}
  </group>
</group>;
export const Scooter: React.FC<{ p?: number[]; r?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, col = "#d23a2a" }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  {[-0.04, 0.04].map((x, i) => <mesh key={i} position={[x, 0.016, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.012, 16]} />{M.rubber({ col: "#1a1a1a" })}</mesh>)}
  <RBox s={[0.1, 0.02, 0.03]} r={0.006} p={[0, 0.035, 0]}>{M.plastic({ col })}</RBox>
  <RBox s={[0.04, 0.035, 0.035]} r={0.006} p={[-0.035, 0.065, 0]}>{M.plastic({ col: "#f2efe6" })}</RBox>
  <mesh position={[0.045, 0.06, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />{M.steel({ col: "#333" })}</mesh>
  <mesh position={[0.058, 0.05, 0]}><sphereGeometry args={[0.006, 10, 8]} />{M.glow({ col: "#fff6d8" })}</mesh>
</group>;
// cartel de neón: caja con borde de luz (sin letras: se lee como cartel, sin texto que traducir)
export const Neon: React.FC<{ p: number[]; w?: number; h?: number; col: string; on?: number }> = ({ p, w = 0.12, h = 0.05, col, on = 1 }) => <group position={p as [number, number, number]}>
  <RBox s={[w, h, 0.012]} r={0.004}>{M.matte({ col: "#14161c" })}</RBox>
  <mesh position={[0, 0, 0.0065]}><planeGeometry args={[w * 0.86, h * 0.7]} />{M.glow({ col, op: 0.85 * on })}</mesh>
  {[0.25, 0.5, 0.75].map((k, i) => <mesh key={i} position={[-w / 2 + k * w, 0, 0.007]}><planeGeometry args={[w * 0.13, h * 0.45]} /><meshBasicMaterial color="#14161c" /></mesh>)}
</group>;

// ---- 0:04 · SEÚL, DOS DE LA MAÑANA: la calle de neón apilado seis pisos, motos de reparto que pasan; la cámara sube hasta una sola ventana apagada ----
export const HNeon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#06070d" lamp={[0, 0.5, 0.8]}
  cam={{ at: [0, 0.32, -0.1], at1: [0.16, 0.5, -0.1], az: [0.18, 0.06], el: [0.06, 0.02], r: [1.6, 0.55], fov: 34 }}>{(tt) => {
  const cols = ["#ff3b6b", "#3bd6ff", "#ffd23b", "#9b5bff", "#3bff9b", "#ff8a3b"];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#14161c" roughness={0.3} metalness={0.25} /></mesh>
    {Array.from({ length: 4 }, (_, b) => { const x = -0.6 + b * 0.38;
      return <group key={"b" + b}>
        <RBox s={[0.34, 0.7, 0.2]} r={0.004} p={[x, 0.35, -0.2]}>{M.matte({ col: "#2e313a" })}</RBox>
        {Array.from({ length: 6 }, (_, f) => b === 2 && f >= 4 ? null : <group key={f} scale={pop(tt, 0.1 + f * 0.12 + b * 0.05)}><Neon p={[x + (rn(b * 7 + f, 3) - 0.5) * 0.12, 0.06 + f * 0.1, -0.095]} col={cols[(b * 3 + f) % 6]} on={0.75 + 0.25 * Math.sin(tt * 3 + f + b)} /></group>)}
      </group>; })}
    <pointLight position={[0, 0.3, 0.3]} intensity={0.7} distance={1.4} color="#ffd8e8" />
    <group position={[0.16, 0.5, -0.097]}>
      <mesh position={[0, 0, -0.001]}><planeGeometry args={[0.12, 0.11]} /><meshStandardMaterial color="#6a6e78" /></mesh>
      <mesh><planeGeometry args={[0.1, 0.09]} /><meshBasicMaterial color="#05060a" /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.005, 0.09]} /><meshBasicMaterial color="#2a2d36" /></mesh>
    </group>
    {[0, 1, 2].map((i) => { const k = ((tt * 0.35 + i * 0.33) % 1); return <group key={"s" + i} position={[lerp(-1.0, 1.0, k), 0, 0.05 + (i - 1) * 0.07]} rotation={[0, i % 2 ? PI : 0, 0]}><Scooter s={1.2} col={["#d23a2a", "#2a7ad2", "#e0b030"][i]} /></group>; })}
    <group position={[0.42, 0, 0.2]}><RBox s={[0.16, 0.1, 0.08]} r={0.004} p={[0, 0.05, 0]}>{M.glow({ col: "#e9fbff", op: 0.9 })}</RBox></group>
  </>;
}}</Scene3D>;

// ---- 0:27 · GODOKSA: 3.661 ventanas en una pared de departamentos; las que se apagan para siempre caen como fichas y el tambor cuenta ----
export const HCounter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0b0d14"
  cam={{ at: [0, 0.38, 0], az: [-0.12, 0.1], el: [0.1, 0.06], r: [1.55, 1.3], fov: 32 }}>{(tt) => {
  const n = Math.round(3661 * eio(tt, 0.8, 5.8));
  return <>
    {[-0.62, -0.2, 0.22, 0.64].map((x, b) => <Block key={b} p={[x, 0, -0.1]} s={0.95} cols={5} rows={10} col="#3a3e48"
      on={(i) => { const off = 0.8 + rn(i + b * 50, 3) * 5.0; return 0.95 - 0.9 * eio(tt, off, off + 0.35); }} />)}
    <group position={[0, 0.52, 0.25]} scale={1.7 * pop(tt, 0.4)}>
      <RBox s={[0.23, 0.08, 0.06]} r={0.01}>{M.brass({ col: "#b88a34" })}</RBox>
      {[0, 1, 2, 3].map((d) => <DigitDrum key={d} v={Math.floor(n / Math.pow(10, 3 - d)) % 10} p={[-0.075 + d * 0.05, 0, 0.031]} r={0.025} w={0.04} />)}
    </group>
    <Sheet map={txt("godoksa", ["GODOKSA", "a lonely death"], { w: 640, h: 220, bg: "#f2ead8", fg: "#2a2420", size: 84, font: HANDF })} w={0.32} h={0.11} p={[0, 0.3, 0.3]} r={[0, 0, -0.02]} s={pop(tt, 1.2)} em={0.12} />
  </>;
}}</Scene3D>;

// ---- 1:34 · EL EDIFICIO DE CUATRO PISOS: corte de frente; la tienda de abajo prendida, la escalera angosta, el tercer piso a oscuras y el buzón que rebalsa ----
export const HBuilding: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#11141b" lamp={[0.3, 0.6, 0.6]}
  cam={{ at: [0, 0.32, 0], at1: [0.04, 0.42, 0], az: [-0.25, -0.1], el: [0.1, 0.06], r: [1.3, 0.95], fov: 32 }}>{(tt) => {
  const mail = eio(tt, 2.0, 5.5);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#262830" roughness={0.6} /></mesh>
    <RBox s={[0.5, 0.02, 0.3]} r={0.002} p={[0, 0.0, -0.05]}>{M.matte({ col: "#3a3c44" })}</RBox>
    <RBox s={[0.5, 0.72, 0.02]} r={0.002} p={[0, 0.36, -0.2]}>{M.matte({ col: "#8a6a52" })}</RBox>
    {[0, 1, 2, 3].map((f) => <group key={f} position={[0, f * 0.18, 0]} scale={pop(tt, 0.1 + f * 0.25)}>
      <RBox s={[0.5, 0.014, 0.3]} r={0.002} p={[0, 0.18, -0.05]}>{M.matte({ col: "#b9b4aa" })}</RBox>
      <RBox s={[0.012, 0.18, 0.3]} r={0.002} p={[-0.25, 0.09, -0.05]}>{M.matte({ col: "#9a8a76" })}</RBox>
      <RBox s={[0.012, 0.18, 0.3]} r={0.002} p={[0.25, 0.09, -0.05]}>{M.matte({ col: "#9a8a76" })}</RBox>
      <RBox s={[0.012, 0.18, 0.3]} r={0.002} p={[-0.12, 0.09, -0.05]}>{M.matte({ col: "#b9b4aa" })}</RBox>
      {Array.from({ length: 5 }, (_, k) => <RBox key={k} s={[0.1, 0.012, 0.03]} r={0.001} p={[-0.185, 0.02 + k * 0.034, -0.15 + k * 0.05]}>{M.matte({ col: "#7a7c80" })}</RBox>)}
      <mesh position={[0.07, 0.11, -0.185]}><planeGeometry args={[0.1, 0.07]} /><meshBasicMaterial color={f === 2 ? "#06070a" : f === 0 ? "#ffe0a8" : "#ffd59a"} toneMapped={false} /></mesh>
      {f === 0 && <>{Array.from({ length: 6 }, (_, k) => <RBox key={k} s={[0.04, 0.03, 0.03]} r={0.003} p={[0.0 + (k % 3) * 0.06, 0.03 + Math.floor(k / 3) * 0.035, -0.12]}>{M.matte({ col: ["#c94a3a", "#e0b030", "#3a7ac9"][k % 3] })}</RBox>)}
        <Fig p={[0.18, 0, -0.02]} s={0.75} cloth="#4a5a6a" /></>}
      {f === 1 && <Fig p={[0.05, 0, -0.06]} s={0.75} cloth="#7a4a3a" sit={1} r={[0, 0.4, 0]} />}
      {f === 3 && <Fig p={[0.1, 0, -0.04]} s={0.75} cloth="#3a5a4a" arm={0.4} />}
      {f === 2 && <><Desk p={[0.08, 0, -0.08]} s={0.8} /><mesh position={[0.08, 0.064, -0.08]}><boxGeometry args={[0.05, 0.002, 0.04]} /><meshStandardMaterial color="#f2efe6" /></mesh></>}
    </group>)}
    <group position={[-0.32, 0, 0.12]} scale={pop(tt, 1.0)}>
      <RBox s={[0.1, 0.12, 0.05]} r={0.004} p={[0, 0.16, 0]}>{M.steel({ col: "#8a9098" })}</RBox>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.05, 0.22 + fallY(tt, 2.0 + i * 0.4, -0.02) * 0 + 0.006 * i * mail, 0.03]} rotation={[0.3, rn(i, 3) - 0.5, 0.2]} scale={pop(tt, 2.0 + i * 0.4)}><boxGeometry args={[0.06, 0.002, 0.035]} /><meshStandardMaterial color={i % 3 ? "#f2efe6" : "#e0d0a0"} /></mesh>)}
      {Array.from({ length: 4 }, (_, i) => <mesh key={"g" + i} position={[-0.03 + i * 0.025, 0.002, 0.06 + (i % 2) * 0.02]} rotation={[-PI / 2, 0, rn(i, 5)]} scale={pop(tt, 3.6 + i * 0.4)}><planeGeometry args={[0.05, 0.03]} /><meshStandardMaterial color="#f2efe6" side={THREE.DoubleSide} /></mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 2:24 · EL CALENDARIO: las cruces avanzan prolijas día por día hasta la mitad del mes; la birome rueda y se queda quieta ----
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#15130f" lamp={[-0.4, 0.7, 0.4]} warm={0.6}
  cam={{ at: [0, 0.12, 0], at1: [0.04, 0.1, 0.06], az: [-0.15, 0.05], el: [0.75, 0.62], r: [0.85, 0.62], fov: 32 }}>{(tt) => {
  const n = Math.min(16, 16 * eio(tt, 0.4, 4.0)), roll = eio(tt, 4.4, 5.6), dim = eio(tt, 4.6, 6.2);
  return <>
    <Calendar p={[0, 0.004, 0]} r={[-PI / 2, 0, 0]} s={1.1} n={n} title="MARCH" />
    <group position={[lerp(-0.12 + (Math.floor(n) % 7) * 0.044, 0.22, roll), 0.012, lerp(0.07 - Math.floor(n / 7) * 0.05, 0.2, roll)]} rotation={[PI / 2, 0, 0.6 + 6 * roll]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.13, 12]} />{M.plastic({ col: "#2a4a9a" })}</mesh>
    </group>
    <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.2]} /><meshBasicMaterial color="#000" transparent opacity={0.45 * dim} depthWrite={false} /></mesh>
  </>;
}}</Scene3D>;

// ---- 2:47 · SIGUE SUBIENDO: tres columnas de fichas de dominó negras (2021, 2022, 2023) que crecen; la del 2023 es la más alta ----
export const HRising: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#14120f" lamp={[0, 0.7, 0.4]}
  cam={{ at: [0, 0.2, 0], az: [-0.3, 0.2], el: [0.2, 0.16], r: [1.1, 0.95], fov: 30 }}>{(tt) => {
  const vals = [3378, 3559, 3661];
  return <>
    {vals.map((v, i) => { const k = eio(tt, 0.5 + i * 1.3, 1.8 + i * 1.3), hgt = 0.42 * (v - 3000) / 700 * k + 0.02, x = -0.28 + i * 0.28;
      return <group key={i} position={[x, 0, 0]}>
        <RBox s={[0.16, Math.max(0.004, hgt), 0.16]} r={0.004} p={[0, hgt / 2, 0]}>{M.matte({ col: i === 2 ? "#3a3d48" : "#5a5e6a" })}</RBox>
        {Array.from({ length: Math.floor(hgt / 0.03) }, (_, j) => <mesh key={j} position={[0, 0.015 + j * 0.03, 0.081]}><planeGeometry args={[0.14, 0.002]} /><meshBasicMaterial color="#7a7e8a" /></mesh>)}
        <Sheet map={txt("ry" + i, [String(2021 + i)], { w: 256, h: 96, bg: "#5e3d24", fg: "#f3e2c0", size: 64 })} w={0.14} h={0.05} p={[0, 0.03, 0.12]} r={[-0.3, 0, 0]} />
        <Sheet map={txt("rv" + i, [v.toLocaleString("en-US")], { w: 300, h: 110, bg: "#f2ead8", fg: "#2a2420", size: 76, font: HANDF })} w={0.15} h={0.055} p={[0, hgt + 0.05, 0.02]} s={pop(tt, 1.8 + i * 1.3)} em={0.1} />
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 3:16 · EL GOSHIWON: el pasillo largo de puertas iguales; en cada cuarto un escritorio con libros que se vuelve una cama y una chaqueta de trabajo ----
export const HGoshiwon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f1116" lamp={[0, 0.7, 0.3]}
  cam={{ at: [0, 0.07, 0.3], at1: [0, 0.07, -0.4], az: [0.0, 0.0], el: [0.12, 0.1], r: [0.5, 0.45], fov: 40 }}>{(tt) => {
  const swap = eio(tt, 3.0, 4.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 2.4]} /><meshStandardMaterial color="#6b6a64" roughness={0.6} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.1, 0.1, 0]} rotation={[0, -sd * PI / 2, 0]}><planeGeometry args={[2.4, 0.2]} /><meshStandardMaterial color="#d8d2c4" roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.2, 0]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.2, 2.4]} /><meshStandardMaterial color="#b9b4aa" /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={"l" + i} position={[0, 0.198, 0.9 - i * 0.36]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[0.05, 0.05]} />{M.glow({ col: "#f2f6ff", op: 0.9 })}</mesh>)}
    {Array.from({ length: 24 }, (_, i) => { const sd = i % 2 ? 1 : -1, z = 1.0 - Math.floor(i / 2) * 0.18;
      return <Door key={i} p={[sd * 0.098, 0, z]} r={[0, -sd * PI / 2, 0]} s={1.0} n={String(201 + i)} open={i === 6 ? 0.35 * eio(tt, 1.2, 2.0) : 0} col="#8a9098" />; })}
    <group position={[-0.2, 0, 0.46]}>
      <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.18]} /><meshStandardMaterial color="#8a7a62" /></mesh>
      <pointLight position={[0, 0.15, 0]} intensity={0.4 * eio(tt, 1.2, 2.0)} distance={0.4} color="#ffd59a" />
      <group scale={Math.max(0.001, 1 - swap)}><Desk p={[-0.03, 0, 0]} s={0.9} r={[0, PI / 2, 0]} />{[0, 1, 2].map((k) => <RBox key={k} s={[0.035, 0.012, 0.05]} r={0.002} p={[-0.03, 0.074 + k * 0.012, 0]}>{M.matte({ col: ["#c94a3a", "#3a6ac9", "#e0b030"][k] })}</RBox>)}</group>
      <group scale={Math.max(0.001, swap)}><Bed p={[-0.03, 0, 0]} s={0.75} col="#5a6470" /><RBox s={[0.004, 0.08, 0.05]} r={0.002} p={[-0.095, 0.1, -0.03]}>{M.matte({ col: "#2a3a5a" })}</RBox></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:47 · MENOS QUE UN CAJÓN DE ESTACIONAMIENTO: un auto estacionado entre líneas blancas se va; la cama, el escritorio y la ventana entran justo en ese rectángulo ----
export const HParking: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1c22" lamp={[0.2, 0.7, 0.5]}
  cam={{ at: [0, 0.03, 0], az: [-0.5, -0.35], el: [0.9, 0.75], r: [1.0, 0.85], fov: 32 }}>{(tt) => {
  const out = eio(tt, 0.8, 2.4), wallsUp = eio(tt, 3.6, 4.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#3a3c42" roughness={0.85} /></mesh>
    {[-0.13, 0.13].map((x, i) => <mesh key={i} position={[x, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.012, 0.5]} /><meshBasicMaterial color="#f2f2ea" /></mesh>)}
    <group position={[0, 0, 0.6 * out * out]}>
      <RBox s={[0.2, 0.06, 0.42]} r={0.03} p={[0, 0.045, 0]}>{M.pvc({ col: "#b8c2cc" })}</RBox>
      <RBox s={[0.17, 0.05, 0.2]} r={0.03} p={[0, 0.095, -0.02]}>{M.glass({ col: "#8ab0d0", op: 0.7 })}</RBox>
      {[[-0.1, -0.13], [0.1, -0.13], [-0.1, 0.13], [0.1, 0.13]].map(([x, z], i) => <mesh key={i} position={[x, 0.02, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />{M.rubber({ col: "#1a1a1a" })}</mesh>)}
    </group>
    <group scale={pop(tt, 2.6)}><Bed p={[-0.07, 0, -0.08]} s={1.0} col="#6a7484" /></group>
    <group scale={pop(tt, 3.0)}><Desk p={[0.075, 0, -0.1]} s={0.9} r={[0, PI / 2, 0]} /></group>
    <group scale={pop(tt, 3.3)}><RBox s={[0.08, 0.1, 0.05]} r={0.004} p={[0.075, 0.05, 0.12]}>{M.wood({ base: [130, 96, 60] })}</RBox></group>
    {[[0, -0.25, 0.26, 0], [-0.13, 0, 0.5, PI / 2], [0.13, 0, 0.5, PI / 2]].map(([x, z, w, ry], i) => <mesh key={"w" + i} position={[x, 0.07 * wallsUp, z]} rotation={[0, ry, 0]} scale={[1, Math.max(0.001, wallsUp), 1]}><boxGeometry args={[w, 0.14, 0.008]} />{M.matte({ col: "#d8d2c4", op: 0.85 })}</mesh>)}
    <mesh position={[0, 0.09 * wallsUp, -0.246]}><planeGeometry args={[0.06, 0.05]} /><meshBasicMaterial color="#9aa4b0" transparent opacity={wallsUp} /></mesh>
  </>;
}}</Scene3D>;

// ---- 4:57 · EL BANJIHA: la ventana a la altura de la vereda; desde adentro se ven pasar zapatos; afuera llueve y el agua corre hacia el vidrio ----
export const HBanjiha: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0d0f14" lamp={[0, 0.45, 0.6]}
  cam={{ at: [0.02, 0.2, 0], at1: [0, 0.27, -0.2], az: [0.12, 0.02], el: [-0.04, 0.02], r: [0.85, 0.36], fov: 34 }}>{(tt) => <>
  <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 1.2]} /><meshStandardMaterial color="#4a443c" /></mesh>
  <mesh position={[0, 0.5, 0.2]} rotation={[PI / 2, 0, 0]}><planeGeometry args={[2, 1.0]} /><meshStandardMaterial color="#6a645a" /></mesh>
  {[[-0.5, 0.25, 0.6, 0.5], [0.5, 0.25, 0.6, 0.5], [0, 0.105, 0.4, 0.21], [0, 0.415, 0.4, 0.17]].map(([x, y, w, hh], i) =>
    <mesh key={"w" + i} position={[x, y, -0.2]}><planeGeometry args={[w, hh]} /><meshStandardMaterial color="#8a8070" roughness={0.95} /></mesh>)}
  <mesh position={[0, 0.27, -0.198]}><planeGeometry args={[0.4, 0.12]} />{M.glass({ col: "#b8c8d8", op: 0.12 })}</mesh>
  {[-0.1, 0, 0.1].map((x, i) => <mesh key={i} position={[x, 0.27, -0.197]}><planeGeometry args={[0.006, 0.12]} /><meshStandardMaterial color="#2a2c30" /></mesh>)}
  <mesh position={[0, 0.236, -0.35]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 0.3]} /><meshStandardMaterial color="#5a5c62" roughness={0.25} metalness={0.25} /></mesh>
  <mesh position={[0, 0.4, -0.48]}><planeGeometry args={[1.4, 0.4]} /><meshStandardMaterial color="#2a2e38" /></mesh>
  <pointLight position={[0.1, 0.42, -0.36]} intensity={0.9} distance={0.7} color="#ffe2b0" />
  {[0, 1, 2, 3].map((i) => { const k = ((tt * 0.24 + i * 0.27) % 1), x = lerp(-0.55, 0.55, i % 2 ? 1 - k : k), step = Math.sin(tt * 8 + i) * 0.014;
    return <group key={i} position={[x, 0.236, -0.3 - (i % 2) * 0.06]} rotation={[0, i % 2 ? PI : 0, 0]}>
      {[-1, 1].map((f) => <group key={f} position={[f * step, 0, f * 0.012]}>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.009, 0.01, 0.14, 10]} />{M.matte({ col: ["#2a3a5a", "#3a3a3a", "#5a4030", "#7a8088"][i] })}</mesh>
        <RBox s={[0.04, 0.016, 0.02]} r={0.005} p={[0.009, 0.008, 0]}>{M.matte({ col: ["#1a1a1a", "#e9e4d8", "#6a3a2a", "#1a1a1a"][i] })}</RBox>
      </group>)}
    </group>; })}
  {Array.from({ length: 40 }, (_, i) => { const y = 0.5 - ((tt * 0.9 + rn(i, 2)) % 1) * 0.28; return <mesh key={"r" + i} position={[(rn(i, 3) - 0.5) * 0.4, y, -0.26 - rn(i, 4) * 0.12]}><boxGeometry args={[0.0015, 0.025, 0.0015]} />{M.glow({ col: "#cfe0ff", op: 0.4 })}</mesh>; })}
  <group position={[-0.32, 0, 0.0]} rotation={[0, 0.3, 0]}><Bed s={1.1} col="#5a6470" /></group>
  <group position={[0.34, 0, -0.02]} rotation={[0, -0.6, 0]}><Fig sit={1} head={0.35} cloth="#4a4a52" s={1.0} /></group>
  <pointLight position={[0.2, 0.4, 0.2]} intensity={0.25} distance={0.8} color="#ffe9c8" />
</>}</Scene3D>;
