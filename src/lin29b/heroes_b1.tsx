// lin29b · componentes 1-10 (cruceros): cada idea es un objeto 3D con peso y luz que se entiende sin leer.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn, cl, tubeG } from "./h3d";
import { Coin, KeyCard, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone, Plane, Sea, Ship, StampMark, Suitcase, WineGlass } from "./lkit_b";

// ---- 0:43 · LA CABINA DEL TAMAÑO DE UNA CIUDAD: el avión se aleja hacia arriba y del mar sube el crucero; se prenden 7 luces, una por día ----
export const HPlaneShip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#9fc3dc" warm={0.8}
  cam={{ at: [0, 0.15, 0], az: [-0.35, -0.15], el: [0.2, 0.16], r: [1.25, 1.12], fov: 30 }}>{(tt) => {
  const up = eio(tt, 1.2, 2.4), rise = eio(tt, 1.6, 3.0), days = cl((tt - 3.0) / 2.4);
  return <>
    <Sea t={tt} />
    <Plane p={[lerp(-0.05, 0.4, up), 0.16 + 0.3 * up, 0]} r={[0, 0, 0.25 * up]} s={(1.5 - 0.9 * up) * pop(tt, 0.2)} />
    <group position={[0, -0.12 + 0.12 * rise + 0.004 * Math.sin(tt * 2), 0]} rotation={[0, 0, 0.015 * Math.sin(tt * 1.3)]} scale={Math.max(0.001, 1.0 * rise)}><Ship lit={days} /></group>
    {Array.from({ length: 7 }, (_, i) => { const on = days * 7 > i; return <mesh key={i} position={[-0.21 + i * 0.07, 0.07 * rise - 0.12 * (1 - rise) + 0.06, 0.07]} scale={on ? 1 + 0.4 * Math.exp(-8 * (days * 7 - i)) : 0.001}><sphereGeometry args={[0.012, 16, 12]} />{M.glow({ col: "#ffd27a" })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 1:32 · LA PLATA QUE NO VES IRSE: cada toque de la tarjeta se lleva una moneda de la pila, sin ruido ----
export const HTapCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [-0.25, -0.1], el: [0.42, 0.36], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const taps = [1.0, 1.8, 2.6, 3.4, 4.2], tapY = taps.reduce((a, b) => a + Math.exp(-((tt - b) ** 2) / 0.02), 0), gone = taps.filter((b) => tt > b + 0.1).length;
  return <>
    <group position={[0.12, 0, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.12, 0.05, 0.16]} p={[0, 0.025, 0]} r={0.012}>{M.plastic({ col: "#25272c" })}</RBox>
      <mesh position={[0, 0.0505, 0.03]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.08, 0.06]} />{M.matte({ col: "#3a3d44" })}</mesh>
      <mesh position={[0, 0.051, -0.05]}><cylinderGeometry args={[0.008, 0.008, 0.002, 16]} />{M.glow({ col: tapY > 0.3 ? "#5cf08a" : "#2a4a34" })}</mesh>
    </group>
    <group position={[0.12, 0.07 + 0.08 * (1 - Math.min(1, tapY)), 0.03]} rotation={[-PI / 2, 0, 0.2]} scale={pop(tt, 0.4)}><KeyCard col="#1d2f5a" label="SEA PASS" s={1.4} /></group>
    {Array.from({ length: 8 }, (_, i) => { const lost = i >= 8 - gone, k = lost ? eio(tt, taps[7 - i] + 0.05, taps[7 - i] + 0.5) : 0;
      return <Coin key={i} p={[lerp(-0.2 + (i % 4) * 0.05, 0.12, k), 0.005 + 0.12 * Math.sin(PI * k) + 0.05 * k, lerp(-0.03 + Math.floor(i / 4) * 0.06, 0.03, k)]} r={[0, i, 0]} s={(1.5 * (1 - 0.999 * k)) * pop(tt, 0.2 + i * 0.05)} />; })}
  </>;
}}</Scene3D>;

// ---- 2:37 · CINCO COPAS Y MUCHO TÉ FRÍO: las copas llegan de a una, el té gratis al lado, cae la etiqueta del paquete ----
export const HFiveGlasses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#151719"
  cam={{ at: [0, 0.1, 0], az: [-0.12, 0.1], el: [0.18, 0.22], r: [0.86, 0.78], fov: 30 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial color="#f4f1ea" roughness={0.9} /></mesh>
  {[0, 1, 2, 3, 4].map((i) => <group key={i} position={[-0.26 + i * 0.075, fallY(tt, 0.1 + i * 0.25, 0.25), -0.02]} scale={tt > 0.08 + i * 0.25 ? 1.5 : 0.001}><WineGlass fill={0.15} /></group>)}
  <group position={[0.18, 0, 0.02]} scale={pop(tt, 2.0)}>
    <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.028, 0.024, 0.12, 28, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.025, 0.022, 0.095, 28]} /><meshPhysicalMaterial color="#b0651c" transparent opacity={0.75} roughness={0.1} /></mesh>
    {[0, 1, 2].map((k) => <mesh key={k} position={[0.008 * (k - 1), 0.088 + 0.006 * Math.sin(tt * 2 + k), 0.005 * k]} rotation={[k, k * 2, 0]}><boxGeometry args={[0.014, 0.014, 0.014]} />{M.glass({ col: "#ffffff", op: 0.6 })}</mesh>)}
    <mesh position={[0.024, 0.12, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.018, 0.018, 0.004, 24]} />{M.plastic({ col: "#f2d23a" })}</mesh>
  </group>
  <group position={[0.18, 0.2, 0.04]} scale={pop(tt, 2.6)}><PriceTag lines={["FREE"]} col="#e6f2e6" fg="#2f5d4a" s={1.2} /></group>
  <group position={[-0.12, 0.19 + fallY(tt, 3.0, 0.3), 0.06]} rotation={[0, 0, -0.05]} scale={pop(tt, 3.0)}><PriceTag lines={["$600", "PACKAGE"]} col="#b8302a" fg="#fff4e6" s={1.3} /></group>
</>}</Scene3D>;

// ---- 3:10 · TU PROPIA BOTELLA: el vino baja envuelto en el suéter, la valija se cierra; en el camarote no paga nada ----
export const HBottleBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.08, 0], az: [0.3, 0.12], el: [0.5, 0.42], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const down = eio(tt, 0.8, 2.0), lid = eio(tt, 2.6, 3.4);
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.34, 0.07, 0.22]} p={[0, 0.035, 0]} r={0.02}>{M.plastic({ col: "#1d2f5a" })}</RBox>
      <mesh position={[0, 0.071, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.31, 0.19]} />{M.matte({ col: "#3a4a6a" })}</mesh>
      <group position={[0, 0.07, -0.11]} rotation={[-PI * 0.55 * (1 - lid), 0, 0]}>
        <RBox s={[0.34, 0.06, 0.22]} p={[0, 0.03 - 0.0, 0.11]} r={0.02}>{M.plastic({ col: "#22386a" })}</RBox>
      </group>
    </group>
    <group position={[0, 0.07 + 0.25 * (1 - down), 0.01]} rotation={[0, 0, PI / 2]} scale={2.1 * pop(tt, 0.4) * (1 - 0.999 * lid)}>
      <mesh castShadow><cylinderGeometry args={[0.028, 0.028, 0.18, 28]} /><meshPhysicalMaterial color="#3a0d16" roughness={0.15} clearcoat={1} /></mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.011, 0.02, 0.06, 20]} /><meshPhysicalMaterial color="#3a0d16" roughness={0.15} clearcoat={1} /></mesh>
      <mesh position={[0, -0.01, 0]}><cylinderGeometry args={[0.036, 0.036, 0.11, 28]} /><meshStandardMaterial color="#efe6d2" roughness={1} map={txt("knit", [""], { w: 64, h: 64, bg: "#efe6d2" })} /></mesh>
    </group>
    <group position={[0.14, 0.2, 0.12]} scale={pop(tt, 3.6)}><PriceTag lines={["$0", "CABIN"]} col="#e6f2e6" fg="#2f5d4a" s={1.6} /></group>
  </>;
}}</Scene3D>;

// ---- 4:30 · LA PROPINA DOBLE: el sello «18 % INCLUDED» cae sobre el ticket; la segunda propina llega y la tacha una raya roja ----
export const HDoubleTip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.02, 0.02], az: [0.1, -0.05], el: [1.0, 1.1], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const st = phys(tt, 1.0, 9, 0.5), tip = eio(tt, 2.2, 2.6), cross = eio(tt, 3.3, 3.8);
  return <>
    <group scale={pop(tt, 0.1)}><Sheet map={txt("rcpt", ["POOL BAR", "2 PIÑA COLADA", "$26.00", "", "TIP ______"], { w: 320, h: 480, bg: "#fbf8f0", size: 40, lh: 82 })} w={0.16} h={0.24} p={[-0.06, 0.002, 0]} r={[-PI / 2, 0, 0]} /></group>
    <StampMark id="svc" lines={["18%", "INCLUDED"]} p={[0.1, 0.003, -0.05]} s={1.6 * Math.max(0.001, cl(st * 1.2))} />
    <group position={[0.1, 0.004 + 0.08 * (1 - cl(st)), -0.05]} scale={Math.max(0.001, 1 - eio(tt, 1.3, 1.6))}>
      <RBox s={[0.1, 0.03, 0.1]} p={[0, 0.015, 0]} r={0.005}>{M.wood({ base: [120, 78, 44] })}</RBox></group>
    <mesh position={[-0.06, 0.003, 0.09]} rotation={[-PI / 2, 0, 0]} scale={[1, 1, 1]}><planeGeometry args={[0.12, 0.035]} /><meshStandardMaterial transparent opacity={tip} map={txt("tip20", ["+20%"], { w: 256, h: 76, bg: "#fbf8f0", fg: "#1d2f5a", size: 64, font: "italic 700 {s}px Georgia" })} /></mesh>
    <mesh position={[-0.06, 0.0045, 0.09]} rotation={[-PI / 2, 0, 0.12]} scale={[Math.max(0.001, cross), 1, 1]}><planeGeometry args={[0.15, 0.008]} />{M.matte({ col: "#c0392b" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 5:21 · LA BIBLIOTECARIA: los anteojos cuelgan de la cadenita de cuentas y se mecen; las cuentas aparecen de a una ----
export const HBeadChain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1614" warm={0.8}
  cam={{ at: [0, 0.15, 0], az: [-0.1, 0.1], el: [0.08, 0.1], r: [0.82, 0.76], fov: 30 }}>{(tt) => {
  const sw = 0.35 * Math.sin(tt * 2.1) * Math.exp(-0.25 * Math.max(0, tt - 1)), n = 26, shown = cl((tt - 0.3) / 1.6) * n;
  const pt = (u: number) => { const a = (u - 0.5) * 2; return [0.16 * a, 0.27 - 0.17 * (1 - a * a), 0]; };
  return <group rotation={[0, 0, sw * 0.4]} position={[0, 0, 0]}>
    {Array.from({ length: n }, (_, i) => { const p = pt(i / (n - 1)); return <mesh key={i} position={p as any} scale={shown > i ? 1 : 0.001} castShadow><sphereGeometry args={[0.006, 14, 10]} />{(i % 3 ? M.porcelain({ col: "#e9dcc4" }) : M.brass())}</mesh>; })}
    <group position={[0, 0.07, 0.01]} rotation={[0.2, sw, 0]} scale={1.8 * pop(tt, 1.6)}>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.042, 0, 0]}>
        <mesh><torusGeometry args={[0.032, 0.003, 10, 40]} />{M.matte({ col: "#3a2a20" })}</mesh>
        <mesh><circleGeometry args={[0.031, 40]} />{M.glass({ op: 0.18 })}</mesh></group>)}
      <mesh position={[0, 0.012, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.012, 0.0025, 8, 20, PI]} />{M.matte({ col: "#3a2a20" })}</mesh>
    </group>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.08, 0.085, 0]}><cylinderGeometry args={[0.001, 0.001, 0.03, 6]} />{M.brass()}</mesh>)}
  </group>;
}}</Scene3D>;

// ---- 5:56 · EL BARCO NO ESPERA: el reloj del muelle pasa la hora y el crucero se aparta; la valija queda sola en el muelle ----
export const HShipLeaves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#e7b98a" warm={0.75}
  cam={{ at: [0.05, 0.08, 0], az: [-0.5, -0.4], el: [0.22, 0.2], r: [1.0, 0.92], fov: 30 }}>{(tt) => {
  const go = eio(tt, 2.0, 5.0), hand = -2 * PI * eio(tt, 0.4, 2.0) * 0.25;
  return <>
    <Sea t={tt} col="#3b6f8f" y={-0.01} />
    <RBox s={[0.5, 0.03, 0.18]} p={[-0.2, 0.0, 0.16]} r={0.004}>{M.wood({ base: [130, 96, 60] })}</RBox>
    <group position={[lerp(0.05, 0.42, go), 0, lerp(-0.05, -0.25, go)]} rotation={[0, 0.25 * go, 0]} scale={1.1 * pop(tt, 0.1)}><Ship /></group>
    <group position={[-0.3, 0.015, 0.2]} scale={0.6 * pop(tt, 0.5)}><Suitcase col="#b8302a" /></group>
    <group position={[-0.13, 0.015, 0.2]} scale={pop(tt, 0.3)}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.004, 0.004, 0.14, 10]} />{M.steel()}</mesh>
      <mesh position={[0, 0.16, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.012, 32]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.16, 0.007]} rotation={[0, 0, hand]}><boxGeometry args={[0.003, 0.03, 0.002]} /><meshBasicMaterial color="#b8302a" /></mesh>
      <mesh position={[0, 0.16, 0.007]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.004, 0.022, 0.002]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 6:45 · FÁCIL, MODERADO, EXIGENTE: tres escaleras crecen de a un escalón; el bastón se apoya frente a la más alta ----
export const HStairs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.3, -0.12], el: [0.3, 0.26], r: [1.12, 1.02], fov: 30 }}>{(tt) => {
  const S = [{ n: 1, c: "#3f8f5a", l: "EASY" }, { n: 3, c: "#d9a84a", l: "MODERATE" }, { n: 7, c: "#b8302a", l: "STRENUOUS" }];
  return <>
    {S.map((s, j) => <group key={j} position={[-0.24 + j * 0.24, 0, 0]}>
      {Array.from({ length: s.n }, (_, k) => { const a = 0.4 + j * 0.9 + k * 0.12; return <RBox key={k} s={[0.14, 0.03, 0.12 - k * 0.014]} p={[0, 0.015 + k * 0.03 + fallY(tt, a, 0.3), -k * 0.007]} r={0.004}>{M.pvc({ col: s.c })}</RBox>; })}
      <group position={[0, 0.03 * s.n + 0.05, 0.02]} scale={pop(tt, 0.7 + j * 0.9)}><Sheet map={txt("stl" + s.l, [s.l], { w: 512, h: 128, bg: "#f6f1e4", fg: s.c, size: 70 })} w={0.2} h={0.05} /></group>
    </group>)}
    <group position={[0.2, 0, 0.12]} rotation={[0.18 * eio(tt, 3.6, 4.2), 0, 0]} scale={pop(tt, 3.4)}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.005, 0.005, 0.18, 12]} />{M.wood({ base: [110, 70, 40] })}</mesh>
      <mesh position={[0.02, 0.18, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.02, 0.005, 10, 20, PI]} />{M.wood({ base: [110, 70, 40] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:17 · EL SATÉLITE COBRA: cada onda que baja a la cúpula del barco suma en el contador de dólares por día ----
export const HSatDish: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0d1a2c" warm={0.7}
  cam={{ at: [0, 0.14, 0], az: [-0.2, 0.1], el: [0.15, 0.12], r: [0.9, 0.82], fov: 30 }}>{(tt) => {
  const v = 30 * eio(tt, 1.0, 4.4);
  return <>
    <RBox s={[0.7, 0.04, 0.3]} p={[0, 0.02, 0]} r={0.01}>{M.pvc({ col: "#f2f2ee" })}</RBox>
    <group position={[-0.12, 0.04, 0]} scale={pop(tt, 0.2)}>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.03, 0.04, 0.06, 24]} />{M.pvc({ col: "#e8e8e4" })}</mesh>
      <mesh position={[0, 0.075, 0]}><cylinderGeometry args={[0.008, 0.008, 0.05, 12]} />{M.steel()}</mesh>
      <group position={[0, 0.12, 0]} rotation={[0, 0, 0.55 + 0.08 * Math.sin(tt * 0.8)]}>
        <mesh castShadow><sphereGeometry args={[0.11, 48, 16, 0, 2 * PI, 0, 0.75]} /><meshStandardMaterial color="#f4f4f1" roughness={0.45} side={THREE.DoubleSide} /></mesh>
        {[0, 1, 2].map((k) => <mesh key={k} position={[0.035 * Math.cos(k * 2.1), 0.03, 0.035 * Math.sin(k * 2.1)]} rotation={[0.35 * Math.sin(k * 2.1), 0, -0.35 * Math.cos(k * 2.1)]}><cylinderGeometry args={[0.0025, 0.0025, 0.1, 8]} />{M.steel()}</mesh>)}
        <mesh position={[0, -0.03, 0]}><sphereGeometry args={[0.012, 16, 12]} />{M.plastic({ col: "#3a3d42" })}</mesh>
      </group>
    </group>
    {[0, 1, 2, 3, 4].map((i) => { const k = ((tt - 0.6 - i * 0.7) / 1.2); return k > 0 && k < 1 ? <mesh key={i} position={[-0.12, 0.42 - 0.24 * k, 0]} rotation={[PI / 2, 0, 0]} scale={0.6 + 0.6 * k}><torusGeometry args={[0.08, 0.003, 8, 48]} />{M.glow({ col: "#7fd0ff", op: 1 - k })}</mesh> : null; })}
    <group position={[0.15, 0.15, 0.08]} scale={1.7 * pop(tt, 0.6)}>
      <RBox s={[0.17, 0.08, 0.06]} r={0.01}>{M.brass({ col: "#b88a34" })}</RBox>
      <Sheet map={txt("usd", ["$"], { w: 64, h: 64, bg: "#b88a34", fg: "#2a1c08", size: 54 })} w={0.03} h={0.03} p={[-0.065, 0, 0.031]} />
      {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? v / 10 : v % 10} p={[-0.025 + d * 0.045, 0, 0.032]} r={0.026} w={0.036} />)}
      <Sheet map={txt("pday", ["A DAY"], { w: 256, h: 64, bg: "#b88a34", fg: "#2a1c08", size: 44 })} w={0.1} h={0.025} p={[0, -0.058, 0.031]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 8:04 · MODO AVIÓN: el interruptor gigante del teléfono se pasa a naranja y un avioncito cruza la pantalla ----
export const HToggle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16181c"
  cam={{ at: [0, 0.14, 0], az: [-0.2, 0.15], el: [0.08, 0.1], r: [0.6, 0.54], fov: 30 }}>{(tt) => {
  const sw = eio(tt, 1.6, 2.1), fly = eio(tt, 2.2, 3.8);
  const scr = txt("pscr3", ["✈", "AIRPLANE", "MODE"], { w: 256, h: 512, bg: "#e9edf2", fg: "#1d2f5a", size: 52, lh: 80 });
  return <>
    <group position={[0, 0.12, 0]} rotation={[0, 0, 0.04]} scale={1.6 * pop(tt, 0.1)}><Phone map={scr} em={0.25} /></group>
    <group position={[0, 0.07, 0.02]} scale={1.6 * pop(tt, 0.6)}>
      <RBox s={[0.06, 0.03, 0.01]} r={0.015}><meshStandardMaterial color={sw > 0.5 ? "#f0952a" : "#b5bac2"} roughness={0.4} /></RBox>
      <mesh position={[lerp(-0.015, 0.015, sw), 0, 0.007]} castShadow><sphereGeometry args={[0.013, 24, 18]} />{M.porcelain()}</mesh>
    </group>
    <Plane p={[lerp(-0.3, 0.3, fly), 0.2 + 0.03 * Math.sin(fly * PI), 0.08]} r={[0.3, 0, 0.1]} s={0.6 * (tt > 2.2 ? 1 : 0.001)} />
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[0, 0.06 - i * 0.025 + 0.12, 0.03]} visible={false}><boxGeometry args={[0.01, 0.01, 0.01]} /></mesh>)}
  </>;
}}</Scene3D>;
