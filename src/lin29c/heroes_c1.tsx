// lin29c · componentes 1-11 (aeropuertos)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn, cl, tex, tubeG } from "./h3d";
import { Coin, KeyCard, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone, Plane, Suitcase } from "./lkit_b";

// auto de juguete (frente hacia +x)
export const Car: React.FC<{ p?: number[]; r?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, col = "#b8302a" }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.16, 0.04, 0.08]} p={[0, 0.03, 0]} r={0.014}>{M.pvc({ col })}</RBox>
    <RBox s={[0.09, 0.035, 0.07]} p={[-0.01, 0.065, 0]} r={0.014}>{M.glass({ col: "#bcd6ea", op: 0.75 })}</RBox>
    {[[-0.05, -0.04], [0.05, -0.04], [-0.05, 0.04], [0.05, 0.04]].map(([x, z], i) => <mesh key={i} position={[x, 0.014, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.014, 0.012, 20]} />{M.rubber({ col: "#151515" })}</mesh>)}
    {[-0.022, 0.022].map((z) => <mesh key={z} position={[0.081, 0.032, z]}><sphereGeometry args={[0.007, 12, 10]} />{M.glow({ col: "#fff2c0" })}</mesh>)}
  </group>;

// ---- 0:21 · $71 Y NI DESPEGASTE: cargador, almohada, sándwich y pastillas caen al mostrador y el tambor suma $71 ----
export const HReceipt71: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.07, 0], az: [-0.18, 0.1], el: [0.3, 0.26], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const v = Math.round(71 * eio(tt, 0.6, 2.8));
  return <>
    <group position={[-0.17, fallY(tt, 0.3, 0.3), 0.02]} rotation={[0, 0.3, 0]}><RBox s={[0.07, 0.03, 0.1]} p={[0, 0.015, 0]} r={0.006}>{M.plastic({ col: "#f2f2ee" })}</RBox><mesh position={[0, 0.031, 0]} rotation={[-PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.004, 8, 24]} />{M.plastic({ col: "#202226" })}</mesh></group>
    <group position={[-0.07, fallY(tt, 0.7, 0.3) + 0.03, -0.04]} rotation={[0.3, 0.4, 0]}><mesh scale={[1, 0.6, 1]}><torusGeometry args={[0.045, 0.024, 16, 32, PI * 1.6]} /><meshStandardMaterial color="#4f8fd8" roughness={0.95} /></mesh></group>
    <group position={[0.03, fallY(tt, 1.1, 0.3), 0.04]} rotation={[0, -0.3, 0]}>
      <mesh position={[0, 0.02, 0]} rotation={[PI / 2, 0, PI / 4]}><cylinderGeometry args={[0.055, 0.055, 0.04, 3]} /><meshStandardMaterial color="#e8d3a0" roughness={0.8} /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[PI / 2, 0, PI / 4]} scale={1.02}><cylinderGeometry args={[0.055, 0.055, 0.04, 3, 1, true]} />{M.glass({ op: 0.35 })}</mesh>
    </group>
    <group position={[0.1, fallY(tt, 1.5, 0.3), -0.02]}><mesh position={[0, 0.025, 0]}><cylinderGeometry args={[0.014, 0.014, 0.05, 20]} />{M.plastic({ col: "#e8822a", op: 0.85 })}</mesh><mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.015, 0.015, 0.012, 20]} />{M.plastic({ col: "#f2f2ee" })}</mesh></group>
    <group position={[0.17, 0.13, -0.04]} scale={1.2 * pop(tt, 0.2)}>
      <RBox s={[0.17, 0.08, 0.06]} r={0.01}>{M.plastic({ col: "#1b1d22" })}</RBox>
      <Sheet map={txt("usd71", ["$"], { w: 64, h: 64, bg: "#1b1d22", fg: "#f2d23a", size: 54 })} w={0.03} h={0.03} p={[-0.065, 0, 0.031]} />
      {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? Math.floor(v / 10) : v % 10} p={[-0.025 + d * 0.045, 0, 0.032]} r={0.026} w={0.036} />)}
    </group>
  </>;
}}</Scene3D>;

// ---- 1:46 · LA MÁQUINA PIDIÓ $340: el ticket entra en la máquina del estacionamiento y los rodillos suben a 340 ----
export const HGarageMeter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="dark"
  cam={{ at: [0, 0.22, 0], az: [-0.3, -0.1], el: [0.12, 0.1], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const ins = eio(tt, 0.4, 1.2), v = Math.round(340 * eio(tt, 1.3, 3.4));
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.2, 0.36, 0.12]} p={[0, 0.18, -0.02]} r={0.014}>{M.pvc({ col: "#e9b62a" })}</RBox>
      <RBox s={[0.16, 0.08, 0.01]} p={[0, 0.27, 0.042]} r={0.006}>{M.plastic({ col: "#141414" })}</RBox>
      <group position={[0.0, 0.27, 0.046]} scale={0.95}>
        <Sheet map={txt("pm$", ["$"], { w: 64, h: 64, bg: "#141414", fg: "#ff5a4a", size: 54 })} w={0.028} h={0.028} p={[-0.06, 0, 0]} />
        {[0, 1, 2].map((d) => <DigitDrum key={d} v={[Math.floor(v / 100), Math.floor(v / 10) % 10, v % 10][d]} p={[-0.03 + d * 0.036, 0, 0.002]} r={0.022} w={0.03} />)}
      </group>
      <RBox s={[0.1, 0.008, 0.01]} p={[0, 0.17, 0.042]} r={0.002}>{M.plastic({ col: "#141414" })}</RBox>
      <Sheet map={txt("pkpay", ["PAY HERE"], { w: 320, h: 80, bg: "#e9b62a", fg: "#1b1b1b", size: 52 })} w={0.14} h={0.035} p={[0, 0.21, 0.041]} />
    </group>
    <group position={[0, lerp(0.17, 0.17, ins), lerp(0.2, 0.05, ins)]} rotation={[-PI / 2 + 0.1, 0, 0]} scale={(1 - eio(tt, 1.15, 1.3) * 0.999) * pop(tt, 0.2)}>
      <Sheet map={txt("ptick", ["PARKING", "ENTRY 7:12 AM"], { w: 256, h: 160, bg: "#f6f1e4", size: 34, lh: 54, cols: ["#1d2f5a", "#555"] })} w={0.11} h={0.07} />
    </group>
  </>;
}}</Scene3D>;

// ---- 2:00 · CUANTO MÁS CERCA, MÁS CARO: tres anillos de estacionamiento alrededor de la terminal; el precio baja hacia afuera ----
export const HParkingRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#cdd8e0" warm={0.85}
  cam={{ at: [0, 0, 0.04], az: [-0.3, 0.3], el: [0.95, 0.85], r: [1.25, 1.12], fov: 30 }}>{(tt) => {
  const R = [{ r: 0.14, c: "#d9342a", p: "$48/DAY" }, { r: 0.27, c: "#e8a33a", p: "$14" }, { r: 0.4, c: "#3f8f5a", p: "$9" }];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.7, 64]} /><meshStandardMaterial color="#bfc8b0" roughness={1} /></mesh>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.14, 0.05, 0.08]} p={[0, 0.025, 0]} r={0.01}>{M.glass({ col: "#9fc0d8", op: 0.85 })}</RBox>
      <Plane p={[0, 0.07, 0]} s={0.4} />
    </group>
    {R.map((g, i) => { const k = eio(tt, 0.5 + i * 0.5, 1.2 + i * 0.5); return <group key={i}>
      <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002 + i * 0.001, 0]}><ringGeometry args={[g.r - 0.04, g.r, 64, 1, 0, 2 * PI * Math.max(0.001, k)]} /><meshStandardMaterial color={g.c} roughness={0.8} /></mesh>
      {Array.from({ length: 6 + i * 4 }, (_, j) => { const a = (j / (6 + i * 4)) * 2 * PI * k; return j / (6 + i * 4) < k ? <RBox key={j} s={[0.022, 0.012, 0.012]} p={[(g.r - 0.02) * Math.cos(a), 0.01, (g.r - 0.02) * Math.sin(a)]} r={0.004}>{M.pvc({ col: ["#f2f2ee", "#1d2f5a", "#7a8088"][(j + i) % 3] })}</RBox> : null; })}
      <group position={[[0.0, -0.27, 0.36][i], 0.07, [0.15, 0.12, 0.2][i]]} scale={pop(tt, 1.2 + i * 0.5) * 1.6}><PriceTag lines={[g.p]} col="#fbf8f0" fg={g.c} /></group>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 2:52 · EL ESTACIONAMIENTO DEL CELULAR: el auto espera; el teléfono suena y el auto va hasta la puerta 4 ----
export const HCellPhoneLot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#d6dde2" warm={0.85}
  cam={{ at: [0.0, 0.03, 0], az: [-0.2, 0.1], el: [0.6, 0.55], r: [0.95, 0.86], fov: 30 }}>{(tt) => {
  const ring = tt > 1.4 && tt < 2.6, go = eio(tt, 2.6, 4.2);
  const on = tt > 1.4;
  const scr = txt("callscr" + (on ? 1 : 0), on ? ["I'M OUTSIDE", "DOOR 4"] : ["", ""], { w: 256, h: 512, bg: on ? "#2f7a4a" : "#1b2430", fg: "#fff", size: 40, lh: 70 });
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial color="#5a5e66" roughness={0.95} /></mesh>
    {[-0.3, -0.2, -0.1, 0.0, 0.1].map((x, i) => <mesh key={i} position={[x, 0.001, -0.15]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.004, 0.14]} />{M.matte({ col: "#f2f2ee" })}</mesh>)}
    {[-0.35, 0.05].map((x) => <group key={x} position={[x, 0, -0.26]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.004, 0.005, 0.24, 10]} />{M.steel()}</mesh><mesh position={[0, 0.245, 0.015]}><boxGeometry args={[0.03, 0.008, 0.04]} />{M.steel()}</mesh><mesh position={[0, 0.239, 0.02]}><boxGeometry args={[0.024, 0.003, 0.03]} />{M.glow({ col: "#fff2c0" })}</mesh></group>)}
    <Car p={[lerp(-0.15, 0.22, go), 0, lerp(-0.15, 0.05, go)]} r={[0, -0.5 * go * (1 - go) * 2, 0]} s={0.9 * pop(tt, 0.2)} col="#2f6f9a" />
    <group position={[0.3, 0, -0.02]} scale={pop(tt, 0.4)}>
      <RBox s={[0.14, 0.13, 0.3]} p={[0.03, 0.065, 0]} r={0.006}>{M.pvc({ col: "#c9ced3" })}</RBox>
      <RBox s={[0.004, 0.1, 0.07]} p={[-0.04, 0.05, 0.05]} r={0.002}>{M.glass({ col: "#9fc0d8", op: 0.8 })}</RBox>
      <RBox s={[0.006, 0.105, 0.075]} p={[-0.042, 0.052, 0.05]} r={0.002}>{M.steel()}</RBox>
      <Sheet map={txt("door4", ["DOOR 4"], { w: 256, h: 96, bg: "#1d2f5a", fg: "#fff", size: 60 })} w={0.09} h={0.032} p={[-0.045, 0.12, 0.05]} r={[0, -PI / 2, 0]} />
    </group>
    <Phone map={scr} p={[-0.22, 0.12 + (ring ? 0.005 * Math.sin(tt * 40) : 0), 0.25]} r={[-0.3, 0.35, ring ? 0.05 * Math.sin(tt * 30) : 0]} s={1.35 * pop(tt, 0.8)} />
    <group position={[-0.05, 0.16, 0.12]} scale={pop(tt, 3.0) * 1.8}><PriceTag lines={["CELL LOT", "FREE"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 3:13 · EL TABLERO DE BANDERAS: las paletas giran como un tablero de aeropuerto y muestran la tasa mala ----
export const HExchangeBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, 0.18, 0], az: [-0.12, 0.12], el: [0.06, 0.08], r: [0.72, 0.65], fov: 30 }}>{(tt) => {
  const rows = [["EUR", "#2f4f9a", "0.71"], ["GBP", "#b8302a", "0.61"], ["MXN", "#2f7a4a", "13.9"], ["JPY", "#f2f2ee", "112"]];
  return <>
    <RBox s={[0.5, 0.32, 0.03]} p={[0, 0.18, -0.02]} r={0.01}>{M.plastic({ col: "#141414" })}</RBox>
    {rows.map(([c, col, v], i) => { const y = 0.29 - i * 0.07, flip = eio(tt, 0.4 + i * 0.35, 0.8 + i * 0.35);
      return <group key={i} position={[0, y, 0.0]}>
        <RBox s={[0.07, 0.045, 0.006]} p={[-0.18, 0, 0.0]} r={0.004}><meshStandardMaterial color={col} roughness={0.5} /></RBox>
        {[0, 1, 2, 3].map((k) => { const ch = (c + " ")[k] ?? " "; const a = Math.min(1, cl(flip * 4 - k * 0.6)); return <group key={k} position={[-0.11 + k * 0.045, 0, 0.0]} rotation={[(1 - a) * PI, 0, 0]}>
          <Sheet map={txt("flp" + ch, [ch], { w: 96, h: 112, bg: "#202226", fg: "#f2f2ee", size: 86 })} w={0.04} h={0.05} p={[0, 0, 0.004]} />
        </group>; })}
        <group position={[0.15, 0, 0.004]}><Sheet map={txt("rate" + v, [v], { w: 256, h: 112, bg: "#202226", fg: "#f2d23a", size: 80 })} w={0.1} h={0.045} s={Math.max(0.001, flip)} /></group>
      </group>; })}
    <group position={[0.17, 0.11, 0.08]} scale={pop(tt, 2.8) * 1.3}><PriceTag lines={["FEE", "+$9.95"]} col="#b8302a" fg="#fff4e6" /></group>
  </>;
}}</Scene3D>;

// ---- 4:22 · EL CAJERO DEL BANCO: la tarjeta entra y salen los billetes con mejor tasa ----
export const HAtmCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0, 0.2, 0], az: [-0.3, -0.15], el: [0.15, 0.12], r: [0.7, 0.63], fov: 30 }}>{(tt) => {
  const ins = eio(tt, 0.5, 1.3), out = eio(tt, 1.8, 3.0);
  const scr = txt("atmscr" + (out > 0.05 ? 1 : 0), out > 0.05 ? ["BANK RATE", "✓"] : ["INSERT", "CARD"], { w: 320, h: 200, bg: "#1d4f7a", fg: "#e9f2ff", size: 48, lh: 80 });
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.3, 0.4, 0.14]} p={[0, 0.2, -0.05]} r={0.016}>{M.steel()}</RBox>
      <mesh position={[0, 0.3, 0.021]} rotation={[-0.15, 0, 0]}><planeGeometry args={[0.18, 0.11]} /><meshStandardMaterial map={scr} emissive="#ffffff" emissiveMap={scr} emissiveIntensity={0.8} /></mesh>
      <RBox s={[0.08, 0.008, 0.01]} p={[0.07, 0.2, 0.022]} r={0.002}>{M.plastic({ col: "#141414" })}</RBox>
      <RBox s={[0.14, 0.008, 0.012]} p={[0, 0.12, 0.022]} r={0.002}>{M.plastic({ col: "#141414" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.022, 0.014, 0.006]} p={[-0.1 + (i % 3) * 0.028, 0.21 - Math.floor(i / 3) * 0.02, 0.022]} r={0.003}>{M.plastic({ col: "#d0d4da" })}</RBox>)}
    </group>
    <group position={[0.07, 0.2, lerp(0.17, 0.03, ins)]} rotation={[PI / 2, 0, 0]} scale={1.5 * pop(tt, 0.3) * (1 - 0.999 * eio(tt, 1.25, 1.4))}><KeyCard label="BANK" col="#2f7a4a" /></group>
    {[0, 1, 2, 3, 4].map((i) => <group key={i} position={[0, 0.123 - 0.004 * i, 0.03 + 0.11 * eio(tt, 1.8 + i * 0.15, 2.6 + i * 0.15)]} rotation={[-0.3, 0, 0]}>
      <Sheet map={txt("euro" + i, ["€20"], { w: 256, h: 128, bg: "#6fa0d8", fg: "#1d2f5a", size: 70 })} w={0.13} h={0.065} s={Math.max(0.001, eio(tt, 1.8 + i * 0.25, 2.0 + i * 0.25))} />
    </group>)}
  </>;
}}</Scene3D>;

// ---- 4:53 · $7 POR UN CARRITO: cae la moneda en la ranura, los carritos encadenados se sueltan uno ----
export const HCartCoin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="dark"
  cam={{ at: [-0.06, 0.1, 0.02], az: [-0.45, -0.3], el: [0.25, 0.22], r: [1.0, 0.92], fov: 30 }}>{(tt) => {
  const free = eio(tt, 1.6, 3.0);
  const Cart: React.FC<{ x: number; z: number }> = ({ x, z }) => <group position={[x, 0, z]}>
    <RBox s={[0.16, 0.006, 0.09]} p={[0, 0.03, 0]} r={0.002}>{M.steel()}</RBox>
    <mesh position={[-0.075, 0.08, 0]}><boxGeometry args={[0.006, 0.1, 0.09]} />{M.steel()}</mesh>
    <mesh position={[-0.09, 0.13, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.1, 10]} />{M.rubber({ col: "#b8302a" })}</mesh>
    {[[-0.06, -0.04], [0.06, -0.04], [-0.06, 0.04], [0.06, 0.04]].map(([a, b], i) => <mesh key={i} position={[a, 0.012, b]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.008, 14]} />{M.rubber({ col: "#151515" })}</mesh>)}
  </group>;
  return <>
    {[0, 1, 2, 3].map((i) => <group key={i} scale={pop(tt, 0.1 + i * 0.1)}><Cart x={-0.1 - i * 0.05 + (i === 0 ? 0.25 * free : 0)} z={i === 0 ? 0.12 * free : 0} /></group>)}
    <group position={[0.06, 0, -0.06]} scale={pop(tt, 0.3)}>
      <RBox s={[0.06, 0.2, 0.05]} p={[0, 0.1, 0]} r={0.008}>{M.pvc({ col: "#e9b62a" })}</RBox>
      <RBox s={[0.026, 0.004, 0.004]} p={[0, 0.16, 0.026]} r={0.001}>{M.plastic({ col: "#141414" })}</RBox>
    </group>
    <Coin p={[0.06, lerp(0.32, 0.16, eio(tt, 0.6, 1.2)), -0.03]} r={[PI / 2, 0, 0]} s={1.4 * (1 - 0.999 * eio(tt, 1.2, 1.3))} />
    <group position={[0.13, 0.22, 0.0]} scale={pop(tt, 1.5) * 1.7}><PriceTag lines={["$7"]} col="#fbf8f0" fg="#b8302a" /></group>
  </>;
}}</Scene3D>;

// ---- 5:14 · COMO UN PERRITO CON CORREA: la valija de 4 ruedas gira y avanza sola al lado de la mano ----
export const HSpinnerLeash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none" bg="#e6e9ec" warm={0.85}
  cam={{ at: [-0.03, 0.22, 0], az: [-0.4, 0.2], el: [0.3, 0.26], r: [1.05, 0.96], fov: 30 }}>{(tt) => {
  const a = eio(tt, 0.3, 4.6) * 1.6 * PI;
  const x = 0.16 * Math.cos(a), z = 0.1 * Math.sin(a);
  return <>
    <group position={[x, 0, z]} rotation={[0, -a - PI / 2, 0]} scale={pop(tt, 0.1)}>
      <Suitcase col="#1d2f5a" s={1.2} />
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />{M.steel()}</mesh>
      <RBox s={[0.06, 0.014, 0.014]} p={[0, 0.4, 0]} r={0.006}>{M.rubber({ col: "#141414" })}</RBox>
      <mesh position={[0, 0.418, 0]} scale={[1.3, 0.75, 0.95]}><sphereGeometry args={[0.026, 24, 18]} /><meshStandardMaterial color="#e8b894" roughness={0.8} /></mesh>
      <mesh position={[0, 0.45, -0.01]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.02, 0.022, 0.07, 20]} /><meshStandardMaterial color="#4f6f9a" roughness={0.9} /></mesh>
    </group>
    {Array.from({ length: 14 }, (_, i) => { const b = a - i * 0.12; return b > 0 ? <mesh key={i} position={[0.16 * Math.cos(b), 0.001, 0.1 * Math.sin(b)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.006, 10]} /><meshBasicMaterial color="#9aa3ad" transparent opacity={0.6 * (1 - i / 14)} /></mesh> : null; })}
    <mesh geometry={tubeG("leash" + Math.round(a * 20), [[-0.24, 0.42, 0.12], [lerp(-0.24, x, 0.5), 0.36, lerp(0.12, z, 0.5)], [x, 0.49, z]], 0.004, 30, 8)}>{M.rubber({ col: "#d9342a" })}</mesh>
    <group position={[-0.24, 0.42, 0.12]} scale={pop(tt, 0.3)}><mesh scale={[1.3, 0.8, 1]}><sphereGeometry args={[0.03, 24, 18]} /><meshStandardMaterial color="#e8b894" roughness={0.8} /></mesh><mesh position={[-0.03, 0.04, 0]} rotation={[0, 0, 0.8]}><cylinderGeometry args={[0.024, 0.026, 0.09, 20]} /><meshStandardMaterial color="#4f6f9a" roughness={0.9} /></mesh></group>
    <group position={[0.2, 0.1, 0.12]} scale={pop(tt, 1.6) * 1.2}><PriceTag lines={["4 WHEELS", "NO CART"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;

// ---- 6:05 · LA PUERTA DEL LOUNGE: el vidrio esmerilado se corre, adentro un sillón; la etiqueta de $80 se balancea ----
export const HLoungeDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.16, 0], az: [-0.2, 0.12], el: [0.1, 0.1], r: [0.8, 0.72], fov: 30 }}>{(tt) => {
  const op = eio(tt, 0.8, 2.0), sw = phys(tt, 2.2, 6, 0.25);
  return <>
    <group position={[0, 0, -0.12]} scale={pop(tt, 0.2)}>
      <RBox s={[0.16, 0.08, 0.08]} p={[0, 0.04, 0]} r={0.02}><meshStandardMaterial color="#7a3a2a" roughness={0.9} /></RBox>
      <RBox s={[0.16, 0.08, 0.025]} p={[0, 0.1, -0.03]} r={0.012}><meshStandardMaterial color="#7a3a2a" roughness={0.9} /></RBox>
      <mesh position={[0.12, 0.05, 0]}><cylinderGeometry args={[0.025, 0.025, 0.1, 20]} />{M.wood({ base: [120, 80, 46] })}</mesh>
      <mesh position={[0.12, 0.11, 0]}><cylinderGeometry args={[0.012, 0.01, 0.025, 16]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.3, -0.05]}><sphereGeometry args={[0.02, 16, 12]} />{M.glow({ col: "#ffe2a0" })}</mesh>
    </group>
    {[-1, 1].map((sd) => <group key={sd} position={[sd * (0.075 + 0.14 * op), 0.16, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.15, 0.32, 0.012]} r={0.004}><meshPhysicalMaterial color="#e9f1f6" roughness={0.6} transmission={0.4} transparent opacity={0.88} /></RBox>
      <mesh position={[0, 0.03, 0.007]}><planeGeometry args={[0.12, 0.04]} /><meshStandardMaterial transparent map={txt("lng" + sd, [sd < 0 ? "LOUN" : "GE"], { w: 256, h: 96, bg: "rgba(0,0,0,0)", fg: "#1d2f5a", size: 72 })} /></mesh>
    </group>)}
    <group position={[0.17, 0.22, 0.08]} rotation={[0, 0, 0.35 * Math.sin(tt * 3) * (1 - sw)]} scale={pop(tt, 2.0) * 1.3}><PriceTag lines={["DAY PASS", "$80"]} col="#b8302a" fg="#fff4e6" /></group>
  </>;
}}</Scene3D>;

// ---- 6:38 · REVISÁ LA BILLETERA: las tarjetas salen en abanico; una se ilumina con el lounge incluido ----
export const HWalletCards: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.05, 0.06], az: [-0.1, 0.1], el: [0.75, 0.68], r: [0.44, 0.4], fov: 30 }}>{(tt) => {
  const fan = eio(tt, 0.6, 2.0), glow = eio(tt, 2.4, 3.0);
  const cols = ["#1d2f5a", "#7a1426", "#2f7a4a", "#3a3d42"];
  return <>
    <group position={[0, 0.0, 0.05]} scale={pop(tt, 0.1)}>
      <RBox s={[0.26, 0.02, 0.15]} p={[0, 0.01, 0]} r={0.01}><meshStandardMaterial color="#5a3420" roughness={0.75} /></RBox>
      <RBox s={[0.26, 0.012, 0.06]} p={[0, 0.026, 0.04]} r={0.006}><meshStandardMaterial color="#4a2a18" roughness={0.75} /></RBox>
    </group>
    {cols.map((c, i) => { const a = (i - 1.5) * 0.35 * fan, hi = i === 2;
      return <group key={i} position={[0, 0.03 + i * 0.003 + (hi ? 0.03 * glow : 0), 0.03]} rotation={[-PI / 2, 0, a]}>
        <group position={[0, 0.09 * fan, 0]}>
          <RBox s={[0.085, 0.054, 0.003]} r={0.005}><meshStandardMaterial color={c} roughness={0.35} metalness={0.2} emissive={hi ? "#f2d23a" : "#000000"} emissiveIntensity={hi ? 0.35 * glow : 0} /></RBox>
          <mesh position={[-0.025, 0.008, 0.002]}><planeGeometry args={[0.014, 0.011]} />{M.brass()}</mesh>
          {hi && <mesh position={[0.01, -0.012, 0.0018]} scale={Math.max(0.001, glow)}><planeGeometry args={[0.07, 0.018]} /><meshStandardMaterial transparent map={txt("lngin", ["LOUNGE ✓"], { w: 320, h: 80, bg: "rgba(0,0,0,0)", fg: "#f2d23a", size: 58 })} /></mesh>}
        </group>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 7:46 · 75 Y MÁS, ZAPATOS PUESTOS: la bandeja pasa por el escáner y los zapatos se quedan en los pies ----
export const HShoesOn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="dark"
  cam={{ at: [0, 0.12, 0], az: [-0.5, -0.3], el: [0.2, 0.18], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const walk = eio(tt, 0.8, 3.0), lit = eio(tt, 1.8, 2.2);
  const Shoe: React.FC<{ z: number; ph: number }> = ({ z, ph }) => <group position={[lerp(-0.3, 0.16, walk) + 0.02 * Math.sin(ph), 0.012 + 0.008 * Math.max(0, Math.sin(tt * 8 + ph)), z]}>
    <RBox s={[0.1, 0.03, 0.04]} p={[0, 0.0, 0]} r={0.014}><meshStandardMaterial color="#5a3420" roughness={0.5} /></RBox>
    <RBox s={[0.05, 0.03, 0.036]} p={[-0.02, 0.025, 0]} r={0.012}><meshStandardMaterial color="#5a3420" roughness={0.5} /></RBox>
    <mesh position={[-0.02, 0.07, 0]}><cylinderGeometry args={[0.016, 0.016, 0.08, 16]} /><meshStandardMaterial color="#2f3e5a" roughness={0.9} /></mesh>
  </group>;
  return <>
    <group scale={pop(tt, 0.1)}>
      {[-0.1, 0.1].map((z) => <RBox key={z} s={[0.03, 0.36, 0.03]} p={[0, 0.18, z]} r={0.006}>{M.plastic({ col: "#d0d4da" })}</RBox>)}
      <RBox s={[0.03, 0.03, 0.23]} p={[0, 0.36, 0]} r={0.006}>{M.plastic({ col: "#d0d4da" })}</RBox>
      <mesh position={[0.016, 0.33, 0]}><boxGeometry args={[0.004, 0.02, 0.06]} /><meshBasicMaterial color={lit > 0.5 ? "#3fd27a" : "#555"} toneMapped={false} /></mesh>
    </group>
    <group scale={1.4}><Shoe z={-0.03} ph={0} /><Shoe z={0.03} ph={PI} /></group>
    <group position={[0.12, 0.22, 0.1]} scale={pop(tt, 2.2) * 1.3}><PriceTag lines={["75+", "SHOES ON"]} col="#e6f2e6" fg="#2f5d4a" /></group>
  </>;
}}</Scene3D>;
