// tdp29d · componentes 1-10: el camión de la noche, evaporarse, 90.144, los yonige-ya, las tres puertas, el embudo, el meiwaku, la carga, el traje, el portafolio vacío.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, rn } from "./h3d";
import { HANDF, PI, Sheet, fallY, pop, txt } from "./lkit3d";
import { Block, Clock24, Fig, House, TrainCar } from "./tkit3d";

export const Box: React.FC<{ p?: number[]; r?: number[]; s?: number; label?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, label }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.07, 0.05, 0.05]} r={0.003} p={[0, 0.025, 0]}>{M.matte({ col: "#b8946a" })}</RBox>
  <mesh position={[0, 0.0505, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.07, 0.008]} /><meshStandardMaterial color="#d8c8a0" roughness={0.5} /></mesh>
  {label && <mesh position={[0, 0.026, 0.0255]}><planeGeometry args={[0.05, 0.02]} /><meshStandardMaterial map={txt("bx" + label, [label], { w: 260, h: 104, bg: "#b8946a", fg: "#1e1a16", size: 56, font: HANDF })} /></mesh>}
</group>;
export const Truck: React.FC<{ p?: number[]; r?: number[]; s?: number; lights?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, lights = 0 }) => <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
  <RBox s={[0.26, 0.13, 0.12]} r={0.008} p={[-0.03, 0.095, 0]}>{M.pvc({ col: "#eef0f0" })}</RBox>
  <RBox s={[0.09, 0.09, 0.115]} r={0.012} p={[0.15, 0.075, 0]}>{M.pvc({ col: "#e6e9ea" })}</RBox>
  <mesh position={[0.196, 0.095, 0]} rotation={[0, PI / 2, 0]}><planeGeometry args={[0.1, 0.04]} />{M.glass({ col: "#30404c", op: 0.85 })}</mesh>
  {[-0.11, 0.06, 0.15].map((x, i) => [-0.06, 0.06].map((z, j) => <mesh key={i + "" + j} position={[x, 0.022, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.018, 18]} />{M.rubber({ col: "#1c1c1e" })}</mesh>))}
  {[-0.04, 0.04].map((z, i) => <mesh key={"l" + i} position={[0.197, 0.055, z]} rotation={[0, PI / 2, 0]}><circleGeometry args={[0.009, 14]} />{M.glow({ col: "#fff6dc", op: 0.15 + 0.85 * lights })}</mesh>)}
</group>;

// ---- 0:03 · EL CAMIÓN DE LAS TRES: calle dormida; una ventana encendida; dos figuras bajan cajas al camión blanco con las luces apagadas; la ventana se apaga y el camión se va ----
export const HTruck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#090b12" lamp={[0.2, 0.6, 0.6]}
  cam={{ at: [0, 0.12, 0], at1: [0.22, 0.1, 0.05], az: [-0.5, -0.25], el: [0.25, 0.18], r: [1.2, 1.05], fov: 32 }}>{(tt) => {
  const off = eio(tt, 4.6, 5.0), go = eio(tt, 5.4, 7.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#26282c" roughness={0.6} /></mesh>
    <Block p={[-0.1, 0, -0.3]} s={0.8} cols={5} rows={4} col="#cfc8bb" on={(i) => (i === 12 ? 0.9 * (1 - off) : 0.04)} />
    {Array.from({ length: 8 }, (_, i) => { const k = eio(tt, 0.5 + i * 0.45, 1.0 + i * 0.45), x = lerp(-0.05, 0.25, k);
      return k > 0 && k < 1 ? <group key={i}><Fig p={[x - 0.03, 0, 0.08 + (i % 2) * 0.03]} r={[0, PI / 2, 0]} s={1.0} cloth="#2a2c34" arm={1.1} /><Box p={[x, 0.07, 0.08 + (i % 2) * 0.03]} s={0.8} /></group> : null; })}
    <Truck p={[0.42 + go * 1.4, 0, 0.08]} r={[0, 0, 0]} s={1.0} lights={go > 0.05 ? 1 : 0} />
    <pointLight position={[0.6, 0.5, 0.4]} intensity={0.25} distance={1.4} color="#9fb4d8" />
  </>;
}}</Scene3D>;

// ---- 0:32 · EVAPORARSE: una figura en el andén; su silueta se deshace en partículas que suben como vapor; queda sólo el lugar vacío en el banco ----
export const HEvaporate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#11141a" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.1, 0], az: [-0.25, 0.1], el: [0.12, 0.1], r: [0.75, 0.6], fov: 32 }}>{(tt) => {
  const ev = eio(tt, 1.8, 5.2);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#5a5c60" /></mesh>
    <mesh position={[0, 0.003, 0.18]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 0.02]} /><meshStandardMaterial color="#e0c030" /></mesh>
    <RBox s={[0.3, 0.012, 0.06]} r={0.004} p={[0, 0.06, -0.04]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    {[-0.12, 0.12].map((x, i) => <mesh key={i} position={[x, 0.03, -0.04]}><boxGeometry args={[0.01, 0.06, 0.05]} />{M.steel({ col: "#555" })}</mesh>)}
    <group scale={Math.max(0.001, 1 - eio(tt, 3.0, 4.6))}><Fig p={[0.0, 0.0, -0.04]} s={1.3} sit={1} cloth="#2a2c34" head={-0.3} /></group>
    {Array.from({ length: 140 }, (_, i) => { const st = 1.8 + rn(i, 2) * 2.6, k = cl((tt - st) / 2.6), y0 = 0.03 + rn(i, 3) * 0.2;
      return tt > st ? <mesh key={i} position={[(rn(i, 4) - 0.5) * 0.08 + Math.sin(tt * 2 + i) * 0.02 * k, y0 + k * 0.35, -0.04 + (rn(i, 5) - 0.5) * 0.05]} scale={0.004 * (1 - k * 0.6)}><icosahedronGeometry args={[1, 0]} />{M.glow({ col: "#dfe8f6", op: 0.8 * (1 - k) })}</mesh> : null; })}
    <Sheet map={txt("evap", ["johatsu", "evaporated"], { w: 420, h: 200, bg: "#f2ead8", fg: "#2a2420", size: 70, font: HANDF })} w={0.15} h={0.071} p={[0.2, 0.2, 0.02]} r={[0, -0.25, 0.04]} s={pop(tt, 4.2)} em={0.1} />
  </>;
}}</Scene3D>;

// ---- 0:53 · 90.144: los tambores de números ruedan hasta 90144; detrás, una pared de fichas de «MISSING» que se llena sola ----
export const HNumber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#12141a" lamp={[0, 0.5, 0.7]}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.1], el: [0.05, 0.02], r: [0.7, 0.62], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.4, 4.2), n = Math.round(90144 * k), dg = String(n).padStart(5, "0");
  return <>
    {Array.from({ length: 96 }, (_, i) => { const on = i / 96 < k; return on ? <mesh key={i} position={[-0.42 + (i % 16) * 0.056, 0.02 + Math.floor(i / 16) * 0.05, -0.12]} rotation={[0, 0, (rn(i, 2) - 0.5) * 0.08]}><planeGeometry args={[0.046, 0.04]} /><meshStandardMaterial map={txt("ms" + (i % 4), ["MISSING", "[  ]"], { w: 160, h: 140, bg: ["#f2ead8", "#e8e2d2", "#f6f1e4", "#ece4d0"][i % 4], fg: "#5a2a24", size: 30 })} /></mesh> : null; })}
    <RBox s={[0.34, 0.1, 0.07]} r={0.01} p={[0, 0.16, 0]}>{M.matte({ col: "#1a1c22" })}</RBox>
    {dg.split("").map((d, i) => <DigitDrum key={i} v={+d} p={[-0.12 + i * 0.06, 0.16, 0.036]} r={0.03} w={0.05} />)}
    <Sheet map={txt("nm23", ["missing person reports · 2023"], { w: 640, h: 90, bg: "#f2ead8", fg: "#2a2420", size: 44 })} w={0.3} h={0.042} p={[0, 0.085, 0.04]} s={pop(tt, 3.8)} />
  </>;
}}</Scene3D>;

// ---- 1:51 · LOS YONIGE-YA: un mapa largo del país hecho de islas de madera; de noche, un camioncito recorre la ruta de una ciudad a otra dejando una estela; amanece al llegar ----
export const HYonige: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0b0e18" lamp={[0, 0.7, 0.5]}
  cam={{ at: [-0.32, 0.04, 0.1], at1: [0.3, 0.04, -0.1], az: [-0.55, -0.35], el: [0.32, 0.28], r: [0.58, 0.58], fov: 34 }}>{(tt) => {
  const route: number[][] = [[-0.7, 0, 0.24], [-0.35, 0, 0.12], [-0.05, 0, 0.06], [0.22, 0, -0.06], [0.6, 0, -0.26]], u = eio(tt, 0.6, 6.2), dawn = eio(tt, 5.6, 7.2);
  const c = new THREE.CatmullRomCurve3(route.map((q) => new THREE.Vector3(q[0], q[1], q[2]))), uu = 0.08 + 0.78 * u, pt = c.getPointAt(uu), tg = c.getTangentAt(uu), ang = Math.atan2(-tg.z, tg.x);
  const ah = c.getPointAt(Math.min(0.999, uu + 0.07));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color={new THREE.Color("#121a14").lerp(new THREE.Color("#5a6a58"), dawn)} roughness={0.95} /></mesh>
    <mesh geometry={new THREE.TubeGeometry(c, 160, 0.06, 10, false)} scale={[1, 0.06, 1]} position={[0, 0.002, 0]}><meshStandardMaterial color="#2c2e32" roughness={0.85} /></mesh>
    {Array.from({ length: 40 }, (_, i) => { const q = c.getPointAt(i / 40), d = c.getTangentAt(i / 40); return <mesh key={"d" + i} position={[q.x, 0.0065, q.z]} rotation={[-PI / 2, 0, Math.atan2(-d.z, d.x)]}><planeGeometry args={[0.022, 0.003]} /><meshBasicMaterial color="#d8d0b0" toneMapped={false} /></mesh>; })}
    {Array.from({ length: 14 }, (_, i) => { const q = c.getPointAt(i / 14 + 0.02), side = i % 2 ? 1 : -1; return <group key={"p" + i} position={[q.x + side * 0.03, 0, q.z + side * 0.09]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.003, 0.003, 0.12, 6]} />{M.steel({ col: "#4a4c50" })}</mesh>
      <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.006, 8, 6]} />{M.glow({ col: "#ffb860", op: 0.5 })}</mesh></group>; })}
    {[[-0.62, 0.38], [0.58, -0.44], [0.0, -0.18], [-0.3, -0.12]].map(([x, z], i) => <group key={i} position={[x, 0, z]}>{Array.from({ length: 5 }, (_, j) => <RBox key={j} s={[0.05, 0.05 + rn(i * 9 + j, 2) * 0.09, 0.05]} r={0.003} p={[(j % 3) * 0.06 - 0.06, 0.04, Math.floor(j / 3) * 0.06 - 0.03]}>{M.matte({ col: "#3a3e4a", em: "#ffd59a", emI: 0.12 * (1 - dawn) })}</RBox>)}</group>)}
    <group position={[pt.x, 0.008, pt.z]} rotation={[0, ang, 0]}>
      <Truck s={0.7} lights={1} />
      <group position={[-0.155, 0.03, 0]}>{[[0, 0, -0.025], [0, 0, 0.025], [0, 0.05, 0]].map(([x, y, z], i) => <Box key={i} p={[x - 0.04, y, z]} r={[0, PI / 2, 0]} s={0.75} label={["Kitchen", "Books", "Winter"][i]} />)}</group>
      <RBox s={[0.06, 0.006, 0.09]} r={0.002} p={[-0.2, 0.028, 0]}>{M.steel({ col: "#8a8e96" })}</RBox>
      <mesh position={[0.32, 0.03, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.07, 0.36, 24, 1, true]} /><meshBasicMaterial color="#fff2cc" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
    </group>
    <pointLight position={[ah.x, 0.06, ah.z]} intensity={1.4} distance={0.35} color="#fff2cc" />
    <mesh position={[0.7, 0.42 - 0.18 * dawn, -0.9]}><circleGeometry args={[0.07, 32]} />{M.glow({ col: dawn > 0.5 ? "#ffd59a" : "#e8ecf6", op: 0.9 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 2:34 · TRES PUERTAS: deudas (sobres rojos que se apilan), vergüenza (un hombre inclinado), violencia (una madre con dos chicos); la tercera puerta se abre a la luz ----
export const HThreeDoors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#16130f" lamp={[0, 0.7, 0.5]} warm={0.7}
  cam={{ at: [0, 0.15, 0], at1: [0.25, 0.14, 0.05], az: [-0.15, -0.05], el: [0.12, 0.08], r: [1.15, 0.8], fov: 32 }}>{(tt) => {
  const open = eio(tt, 4.6, 5.8), walk = eio(tt, 5.4, 7.0);
  return <>
    {[-0.36, 0, 0.36].map((x, i) => <group key={i} position={[x, 0, -0.1]} scale={pop(tt, 0.3 + i * 0.4)}>
      <RBox s={[0.2, 0.34, 0.02]} r={0.004} p={[0, 0.17, -0.01]}>{M.matte({ col: "#cfc6b2" })}</RBox>
      <group position={[-0.065, 0, 0.005]} rotation={[0, i === 2 ? -1.6 * open : 0, 0]}><RBox s={[0.13, 0.26, 0.012]} r={0.003} p={[0.065, 0.13, 0]}>{M.wood({ base: [[120, 70, 50], [90, 80, 70], [110, 90, 60]][i] })}</RBox></group>
      {i === 2 && <mesh position={[0, 0.13, -0.004]}><planeGeometry args={[0.13, 0.26]} />{M.glow({ col: "#ffe2b0", op: open })}</mesh>}
      <Sheet map={txt("dr" + i, [["debt", "shame", "violence"][i]], { w: 300, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 60, font: HANDF })} w={0.1} h={0.033} p={[0, 0.3, 0.008]} />
    </group>)}
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.36 + (rn(i, 2) - 0.5) * 0.08, 0.004 + i * 0.004 + fallY(tt, 1.0 + i * 0.12, 0.1), 0.06]} rotation={[-PI / 2, 0, (rn(i, 3) - 0.5) * 0.6]}><planeGeometry args={[0.05, 0.03]} /><meshStandardMaterial color={i % 3 ? "#f2ece0" : "#e8e0d0"} /><mesh position={[0.015, 0.006, 0.0005]}><planeGeometry args={[0.012, 0.01]} /><meshStandardMaterial color="#c0392b" /></mesh></mesh>)}
    <Fig p={[0, 0, 0.05]} s={1.25} cloth="#3a3a42" bow={0.6 * eio(tt, 1.8, 2.8)} />
    <group position={[0.36, 0, lerp(0.08, -0.1, walk)]} scale={pop(tt, 3.0)}>
      <Fig p={[0, 0, 0]} s={1.2} cloth="#8a5a6a" arm={0.5} />
      <Fig p={[-0.05, 0, 0.02]} s={0.7} cloth="#5a7a9a" />
      <Fig p={[0.05, 0, 0.02]} s={0.6} cloth="#c9a040" />
    </group>
  </>;
}}</Scene3D>;

// ---- 3:31 · EL EMBUDO: 90.000 bolitas caen por un embudo de vidrio; casi todas salen por la canaleta verde («found») ; unas pocas grises quedan dando vueltas adentro ----
export const HFunnel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#101318" lamp={[0, 0.7, 0.6]}
  cam={{ at: [0, 0.18, 0], az: [-0.2, 0.1], el: [0.15, 0.1], r: [0.85, 0.72], fov: 32 }}>{(tt) => <>
  <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.18, 0.025, 0.2, 48, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
  <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.025, 0.025, 0.05, 24, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
  <mesh position={[0.12, 0.08, 0]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.3, 0.008, 0.06]} />{M.plastic({ col: "#3a9a5a", op: 0.85 })}</mesh>
  <Sheet map={txt("fnd", ["found · within days"], { w: 480, h: 100, bg: "#3a9a5a", fg: "#f4f8f2", size: 54 })} w={0.25} h={0.052} p={[0.22, 0.035, 0.08]} r={[-0.4, 0, 0]} s={pop(tt, 1.6)} />
  {Array.from({ length: 160 }, (_, i) => { const st = 0.3 + (i / 160) * 5.0, k = tt - st, grey = i % 23 === 0;
    if (k < 0) return null;
    let p: number[];
    if (grey) { const a = tt * (1.5 + rn(i, 2)) + i; const r = 0.06 + rn(i, 3) * 0.08; p = [Math.cos(a) * r, 0.23 + rn(i, 4) * 0.08, Math.sin(a) * r]; }
    else if (k < 0.5) { const a = i * 2.3 + k * 6; const r = 0.15 * (1 - k * 1.8); p = [Math.cos(a) * r, 0.38 - k * 0.45, Math.sin(a) * r]; }
    else { const u = Math.min(1, (k - 0.5) / 0.6); p = [lerp(0.0, 0.27, u), lerp(0.14, 0.01, u) + 0.01, (rn(i, 5) - 0.5) * 0.04]; if (u >= 1) return null; }
    return <mesh key={i} position={p as [number, number, number]} scale={0.007}><sphereGeometry args={[1, 10, 8]} />{grey ? M.matte({ col: "#8a8c90" }) : M.plastic({ col: "#e6dcc4" })}</mesh>; })}
  <Sheet map={txt("nvr", ["never found"], { w: 360, h: 100, bg: "#2a2c32", fg: "#e8e4dc", size: 50 })} w={0.2} h={0.055} p={[0.3, 0.3, 0.02]} r={[0, -0.2, 0]} s={pop(tt, 4.2)} />
  <mesh position={[0.15, 0.28, 0.01]} rotation={[0, 0, 0]} scale={[eio(tt, 4.2, 4.8) + 0.001, 1, 1]}><planeGeometry args={[0.08, 0.002]} />{M.glow({ col: "#b8bcc4", op: 0.7 })}</mesh>
</>}</Scene3D>;

// ---- 4:34 · MEIWAKU: un vagón de tren por dentro: todos callados, nadie come, nadie habla; una gota de sonido de un hombre se expande y todos se dan vuelta a mirarlo; él baja la cabeza ----
export const HMeiwaku: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#cfd5d8" lamp={[0, 0.7, 0.4]}
  cam={{ at: [0, 0.17, -0.1], at1: [0, 0.14, -0.14], az: [-0.3, -0.15], el: [0.1, 0.08], r: [0.85, 0.5], fov: 32 }}>{(tt) => {
  const ring = eio(tt, 2.0, 3.0), look = eio(tt, 2.6, 3.4) * (1 - eio(tt, 5.6, 6.4)), bow = eio(tt, 3.6, 4.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 0.6]} /><meshStandardMaterial color="#8a8e94" /></mesh>
    <mesh position={[0, 0.2, -0.22]}><planeGeometry args={[1.6, 0.4]} /><meshStandardMaterial color="#e6e8e6" /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.6 + i * 0.3, 0.2, -0.219]}><planeGeometry args={[0.22, 0.1]} /><meshBasicMaterial color="#9ab4c8" /></mesh>)}
    <RBox s={[1.4, 0.04, 0.1]} r={0.01} p={[0, 0.05, -0.16]}>{M.matte({ col: "#3a5a8a" })}</RBox>
    {Array.from({ length: 7 }, (_, i) => { const x = -0.54 + i * 0.18, me = i === 3; return <Fig key={i} p={[x, 0.03, -0.15]} r={[0, me ? 0 : (x < -0.02 ? 0.8 : -0.8) * look, 0]} s={1.05} sit={1} cloth={["#2a2c34", "#5a5a62", "#3a3a42", "#4a4a52", "#6a5a4a", "#2a3a4a", "#5a4a5a"][i]} head={me ? -0.5 * bow : -0.2} />; })}
    {[0, 1, 2].map((j) => { const a = 2.0 + j * 0.25, k = eio(tt, a, a + 0.9); return tt > a && tt < a + 1.0 ? <mesh key={j} position={[0, 0.17, -0.12]} scale={0.03 + 0.4 * k}><ringGeometry args={[0.9, 1, 48]} />{M.glow({ col: "#c0392b", op: 0.6 * (1 - k) })}</mesh> : null; })}
    {[0, 1, 2].map((i) => <Sheet key={"r" + i} map={txt("mw" + i, [["no talking loudly", "no eating while walking", "take your trash home"][i]], { w: 520, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 46, font: HANDF })} w={0.2} h={0.038} p={[-0.45 + i * 0.45, 0.28, -0.21]} s={pop(tt, 0.3 + i * 0.4)} />)}
    <mesh visible={ring > 0} position={[0.0, 0.11, -0.1]}><boxGeometry args={[0.018, 0.03, 0.004]} />{M.matte({ col: "#14161c" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 5:19 · LA CARGA: una piedra enorme cae sobre un hombre; las grietas del piso corren hacia su mujer y sus hijos; él levanta la piedra a la espalda y se va solo, para que no los toque ----
export const HBurden: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15151a" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.1, 0], at1: [0.2, 0.1, 0], az: [-0.2, -0.1], el: [0.3, 0.2], r: [1.0, 0.85], fov: 32 }}>{(tt) => {
  const drop = eio(tt, 0.4, 1.0), crack = eio(tt, 1.2, 2.8), lift = eio(tt, 3.6, 4.4), walk = eio(tt, 4.6, 7.0);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial color="#b9b0a0" roughness={0.95} /></mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[-0.12 - i * 0.06, 0.002, 0.02 + (i - 1) * 0.04]} rotation={[-PI / 2, 0, PI + (i - 1) * 0.25]} scale={[Math.max(0.001, crack * (1 - lift)), 1, 1]}><planeGeometry args={[0.3, 0.004]} /><meshBasicMaterial color="#2a2420" /></mesh>)}
    <group position={[-0.42, 0, 0.0]}><Fig p={[0, 0, 0]} s={1.2} cloth="#8a5a6a" head={-0.25 * crack * (1 - lift)} /><Fig p={[-0.06, 0, 0.05]} s={0.75} cloth="#5a7a9a" /><Fig p={[0.06, 0, 0.06]} s={0.65} cloth="#c9a040" /></group>
    <group position={[lerp(0.0, 0.7, walk), 0, 0]}>
      <Fig p={[0, 0, 0]} r={[0, walk > 0 ? PI / 2 : 0, 0]} s={1.25} cloth="#2a2c34" bow={0.5 * (1 - lift) * drop + 0.3 * lift} />
      <mesh position={[lift > 0 ? -0.02 : 0, lerp(0.6, 0.22, drop) + 0.04 * lift, lift > 0 ? -0.03 : 0]} scale={[1, 0.8, 1]} castShadow><dodecahedronGeometry args={[0.08, 1]} /><meshStandardMaterial color="#6a6560" roughness={0.95} flatShading /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 5:47 · EL TRAJE: el reloj marca 7:15; el hombre de traje sale de casa con el portafolio, besa a la mujer en la puerta, va al banco del parque; el reloj corre a las 18:30 y vuelve: «long day at the office» ----
export const HSuit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#c7d2c4" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0.05, 0.17, 0], az: [-0.3, 0.1], el: [0.32, 0.26], r: [1.3, 1.15], fov: 32 }}>{(tt) => {
  const go = eio(tt, 0.8, 2.6), back = eio(tt, 4.8, 6.6), hr = 7.25 + 11.25 * eio(tt, 2.6, 4.8);
  const x = tt < 4.8 ? lerp(-0.42, 0.38, go) : lerp(0.38, -0.42, back), sitting = tt > 2.6 && tt < 4.8;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#8aa070" roughness={0.95} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.001, 0.05]}><planeGeometry args={[1.0, 0.06]} /><meshStandardMaterial color="#c9b894" /></mesh>
    <House p={[-0.52, 0, -0.08]} s={0.55} lit={[0.3, 0.3, 0.2, 0.2]} />
    <Fig p={[-0.44, 0, 0.0]} s={1.0} cloth="#8a5a6a" arm={0.8 * (eio(tt, 0.7, 1.0) * (1 - eio(tt, 1.4, 1.7)) + eio(tt, 6.2, 6.5))} />
    <RBox s={[0.16, 0.012, 0.05]} r={0.004} p={[0.4, 0.05, -0.05]}>{M.wood({ base: [150, 110, 70] })}</RBox>
    {[0.34, 0.46].map((xx, i) => <mesh key={i} position={[xx, 0.025, -0.05]}><boxGeometry args={[0.006, 0.05, 0.04]} />{M.steel({ col: "#444" })}</mesh>)}
    <group position={[x, sitting ? 0.0 : 0, sitting ? -0.05 : 0.05]} rotation={[0, sitting ? 0 : (tt < 4.8 ? PI / 2 : -PI / 2), 0]}>
      <Fig s={1.05} cloth="#1e2026" sit={sitting ? 1 : 0} head={sitting ? -0.35 : 0} />
      <RBox s={[0.04, 0.03, 0.008]} r={0.003} p={[sitting ? 0 : 0.025, sitting ? 0.07 : 0.06, sitting ? 0.03 : 0]}>{M.matte({ col: "#3a2418" })}</RBox>
    </group>
    <Clock24 p={[0.0, 0.32, -0.3]} s={0.6} h={hr} />
    <Sheet map={txt("ldo", ["long day at the office"], { w: 560, h: 100, bg: "#f2ead8", fg: "#2a2420", size: 50, font: HANDF })} w={0.2} h={0.036} p={[-0.38, 0.2, 0.05]} s={pop(tt, 6.3)} />
  </>;
}}</Scene3D>;

// ---- 6:45 · EL PORTAFOLIO: sobre las rodillas de un traje, a las diez de la mañana; el portafolio se abre despacio y adentro no hay nada: sólo un diario doblado y el almuerzo envuelto ----
export const HBriefcase: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#12141a" lamp={[0.2, 0.7, 0.5]}
  cam={{ at: [0, 0.06, 0], at1: [0, 0.04, 0.02], az: [-0.1, 0.15], el: [0.75, 0.95], r: [0.55, 0.38], fov: 32 }}>{(tt) => {
  const open = eio(tt, 1.6, 3.2);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.2, 1]} /><meshStandardMaterial color="#1e2026" roughness={0.8} /></mesh>
    {[-0.07, 0.07].map((x, i) => <RBox key={i} s={[0.1, 0.03, 0.3]} r={0.012} p={[x, 0.015, 0]}>{M.matte({ col: "#24262c" })}</RBox>)}
    <group position={[0, 0.03, 0.02]}>
      <RBox s={[0.24, 0.035, 0.16]} r={0.006} p={[0, 0.018, 0]}>{M.matte({ col: "#3a2418" })}</RBox>
      <mesh position={[0, 0.036, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.14]} /><meshStandardMaterial color="#2a1a12" /></mesh>
      <group position={[0, 0.035, -0.08]} rotation={[-1.9 * open, 0, 0]}><RBox s={[0.24, 0.012, 0.16]} r={0.006} p={[0, 0.006, 0.08]}>{M.matte({ col: "#3a2418" })}</RBox>{[-0.06, 0.06].map((x, i) => <RBox key={i} s={[0.02, 0.008, 0.012]} r={0.002} p={[x, 0.012, 0.16]}>{M.brass()}</RBox>)}</group>
      <group scale={open > 0.5 ? 1 : 0.001}>
        <RBox s={[0.12, 0.006, 0.08]} r={0.002} p={[-0.04, 0.04, 0.0]} rot={[0, 0.1, 0]}>{M.matte({ col: "#dcd6c8" })}</RBox>
        <mesh position={[-0.04, 0.0435, 0.0]} rotation={[-PI / 2, 0, 0.1]}><planeGeometry args={[0.11, 0.07]} /><meshStandardMaterial map={txt("np", ["JOB LISTINGS", "— — — — —", "— — — —", "— — — — — —"], { w: 400, h: 260, bg: "#e6e0d2", fg: "#3a3a3a", size: 40, align: "left", pad: 20 })} /></mesh>
        <RBox s={[0.06, 0.03, 0.05]} r={0.006} p={[0.07, 0.05, 0.01]}>{M.matte({ col: "#2a4a8a" })}</RBox>
      </group>
    </group>
  </>;
}}</Scene3D>;
