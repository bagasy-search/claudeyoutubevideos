// lin29a · componentes 20-28 (hoteles).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, rn, cl, tex } from "./h3d";
import { Bill, Coin, HANDF, KeyCard, PI, Pin, PriceTag, Sheet, TapeRoll, fallY, pop, txt } from "./lkit3d";

// ---- 18:49 · LA FRASE: en la libreta de Linda la frase se escribe renglón por renglón y la birome subraya ----
const SL = ["Before I sign,", "can you walk me", "through every", "charge?"];
export const HSentence: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.02, 0.02], az: [-0.12, 0.08], el: [0.95, 1.08], r: [0.62, 0.55], fov: 30 }}>{(tt) => {
  const w = (i: number) => eio(tt, 0.6 + i * 0.85, 1.4 + i * 0.85), under = eio(tt, 4.2, 4.9);
  const pen = SL.findIndex((_, i) => w(i) < 1), pi = pen < 0 ? 3 : pen, px = -0.1 + 0.2 * (pen < 0 ? 1 : w(pi));
  return <>
    <RBox s={[0.28, 0.008, 0.34]} p={[0, 0.004, 0]} r={0.006}><meshStandardMaterial color="#1d2f5a" roughness={0.7} /></RBox>
    <mesh position={[0, 0.0085, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.32]} /><meshStandardMaterial map={txt("ruled", [""], { w: 256, h: 320, bg: "#fbf8ef", rule: true, lh: 40 })} roughness={0.95} /></mesh>
    {SL.map((l, i) => { const m = txt("sl" + i, [l], { w: 640, h: 96, bg: "#fbf8ef", fg: "#1d2f5a", size: 70, font: HANDF, align: "left" }); const k = Math.max(0.001, w(i)); m.repeat.set(k, 1); m.offset.set(0, 0);
      return <mesh key={i} position={[-0.12 + 0.12 * k, 0.009, -0.1 + i * 0.055]} rotation={[-PI / 2, 0, 0]} scale={[k, 1, 1]}><planeGeometry args={[0.24, 0.036]} /><meshStandardMaterial map={m} roughness={0.95} /></mesh>; })}
    {/* el renglón se «escribe»: la malla crece y la textura se recorta igual (repeat), sin aplastar la letra */}
    <mesh position={[-0.12 + 0.11 * under, 0.0095, 0.08]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, under), 1, 1]}><planeGeometry args={[0.22, 0.004]} />{M.glow({ col: "#d9342a" })}</mesh>
    <group position={[px, 0.03, -0.1 + pi * 0.055 + 0.01]} rotation={[0.6, 0.4, -0.5]} scale={pop(tt, 0.3)}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.005, 0.005, 0.14, 16]} />{M.plastic({ col: "#1d2f5a" })}</mesh>
      <mesh position={[-0.075, 0, 0]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.005, 0.014, 16]} />{M.chrome()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 19:43 · RENGLÓN POR RENGLÓN: la lupa baja por la cuenta final y cada línea se tilda ----
export const HMagnifier: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark"
  cam={{ at: [0, 0.02, 0], az: [0.15, -0.08], el: [0.9, 1.0], r: [0.7, 0.62], fov: 30 }}>{(tt) => {
  const rows = 6, k = eio(tt, 0.7, 4.4) * rows, row = Math.min(rows - 1, Math.floor(k));
  return <>
    <Sheet map={txt("folioL", ["FINAL BILL", "ROOM", "TAX", "RESORT FEE", "PARKING", "MINIBAR", "PHONE"], { w: 384, h: 560, bg: "#fbf8f0", size: 40, lh: 74, align: "left" })} w={0.22} h={0.32} p={[0, 0.002, 0]} r={[-PI / 2, 0, 0]} s={pop(tt, 0.1)} />
    {Array.from({ length: rows }, (_, i) => <mesh key={i} position={[0.085, 0.004, -0.095 + i * 0.042]} rotation={[-PI / 2, 0, 0]} scale={k > i + 0.8 ? 1 : 0.001}><planeGeometry args={[0.03, 0.03]} /><meshBasicMaterial map={txt("chk", ["✓"], { w: 64, h: 64, bg: "#fbf8f0", fg: "#2f7d4a", size: 60 })} toneMapped={false} /></mesh>)}
    <group position={[-0.02, 0.06, -0.095 + lerp(row, k - 0.5, 0.5) * 0.042]} rotation={[-PI / 2 + 0.15, 0, 0]} scale={pop(tt, 0.4)}>
      <mesh><torusGeometry args={[0.07, 0.008, 16, 64]} />{M.brass()}</mesh>
      <mesh><circleGeometry args={[0.068, 48]} />{M.glass({ op: 0.18 })}</mesh>
      <mesh position={[0.1, -0.04, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.01, 0.012, 0.09, 16]} />{M.wood({ base: [90, 52, 28] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 20:36 · LA RETENCIÓN EN DÉBITO: la tarjeta de débito encima del frasco de la cuenta y el agua (la plata) baja ----
export const HHold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.17, 0], az: [-0.25, 0.1], el: [0.3, 0.26], r: [0.9, 0.8], fov: 30 }}>{(tt) => {
  const lvl = 0.22 - 0.15 * eio(tt, 1.2, 4.2), cardY = 0.3 + fallY(tt, 0.6, 0.3, 9, 0.4);
  return <>
    <group position={[-0.05, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.1, 0.1, 0.26, 48, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
      <mesh position={[0, lvl / 2, 0]} scale={[1, Math.max(0.001, lvl), 1]}><cylinderGeometry args={[0.095, 0.095, 1, 48]} />{M.water({ col: "#7fc59a" })}</mesh>
      <Sheet map={txt("chk2", ["CHECKING"], { w: 384, h: 96, bg: "#f4efe3", fg: "#2f5d4a", size: 54 })} w={0.14} h={0.035} p={[0, 0.06, 0.101]} />
    </group>
    <group position={[-0.05, cardY, 0]} rotation={[-0.3, 0.3, 0.15]} scale={pop(tt, 0.6)}><KeyCard col="#2a3346" label="DEBIT" s={2} /></group>
    {/* la pinza de la retención que «muerde» */}
    <group position={[0.17, 0.12, 0.05]} scale={pop(tt, 1.6)}><PriceTag lines={["HOLD", "$200/night"]} col="#3a2b28" fg="#ff8a7a" s={1.5} /></group>
    {Array.from({ length: 5 }, (_, i) => { const a = 1.4 + i * 0.6, k = cl((tt - a) / 0.7); return <mesh key={i} position={[-0.05 + 0.15 * k, 0.04 - 0.02 * k, 0.12 * k]} scale={tt > a && k < 1 ? 1 : 0.001}><sphereGeometry args={[0.007, 12, 10]} />{M.water({ col: "#7fc59a" })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 21:39 · LA RUTINA: seis etiquetas de valija en un riel se encienden en orden, del día que reservo al día que me voy ----
const RT = ["BOOK", "DAY BEFORE", "ARRIVE", "THE DESK", "THE ROOM", "LEAVE"];
export const HRoutine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" bg="#1a1410"
  cam={{ at: [0.03, 0.38, 0], at1: [0.08, 0.38, 0], az: [-0.25, 0.25], el: [0.06, 0.08], r: [0.95, 0.85], fov: 32 }}>{(tt) => <>
  <mesh position={[0, 0.48, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.9, 16]} />{M.brass()}</mesh>
  {RT.map((r, i) => { const a = 0.4 + i * 0.6, on = tt > a + 0.3, sw = 0.35 * Math.exp(-(tt - a) * 1.6) * Math.cos((tt - a) * 6) * (tt > a ? 1 : 0);
    return <group key={i} position={[-0.375 + i * 0.15, 0.48, 0]} rotation={[0, 0, sw]}>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.0009, 0.0009, 0.08, 6]} />{M.matte({ col: "#9c2a22" })}</mesh>
      <group position={[0.05, -0.13 + fallY(tt, a, 0.4, 8), 0]}><PriceTag lines={[String(i + 1), r]} s={1.3} col={on ? "#fff3d6" : "#c9c2b2"} fg={on ? "#b8302a" : "#5a5650"} /></group>
    </group>; })}
</>}</Scene3D>;

// ---- 22:02 · EL MAPA DEL DÍA ANTES: el plano se despliega y caen tres alfileres: almacén, farmacia, garaje ----
export const HTripMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.02, 0.02], az: [0.25, 0.05], el: [0.85, 0.95], r: [0.8, 0.68], fov: 30 }}>{(tt) => {
  const un = eio(tt, 0.3, 1.5), mapT = txt("map", ["", "", ""], { w: 512, h: 512, bg: "#e9e2cf" });
  const pins: [string, number[], string][] = [["#c0392b", [-0.1, 0, -0.05], "GROCERY"], ["#2f7d4a", [0.06, 0, -0.08], "PHARMACY"], ["#2b5aa8", [0.09, 0, 0.07], "GARAGE"]];
  return <>
    <mesh position={[-0.085, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.17, 0.3]} /><meshStandardMaterial color="#e9e2cf" roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <group position={[0, 0.003, 0]} rotation={[0, 0, PI * (1 - un)]}><mesh position={[0.085, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.17, 0.3]} /><meshStandardMaterial color="#e3dbc6" roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
    {/* calles */}
    {[-0.08, 0.0, 0.08].map((z, i) => <mesh key={i} position={[0, 0.004, z]} rotation={[-PI / 2, 0, 0]} scale={[un, 1, 1]}><planeGeometry args={[0.32, 0.008]} />{M.matte({ col: "#c9b98a" })}</mesh>)}
    {[-0.1, 0.02, 0.12].map((x, i) => <mesh key={i} position={[x, 0.0041, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, un, 1]}><planeGeometry args={[0.008, 0.28]} />{M.matte({ col: "#c9b98a" })}</mesh>)}
    <RBox s={[0.04, 0.02, 0.03]} p={[0.0, 0.01, 0.0]} r={0.003}>{M.matte({ col: "#1d2f5a" })}</RBox>
    {pins.map(([c, p], i) => <Pin key={i} col={c} p={[p[0], fallY(tt, 1.8 + i * 0.6, 0.3, 10, 0.35), p[2]]} s={tt > 1.75 + i * 0.6 ? 1.6 : 0.001} />)}
    {pins.map(([c, p, l], i) => <mesh key={"r" + i} position={[p[0], 0.005, p[2]]} rotation={[-PI / 2, 0, 0]} scale={eio(tt, 2.0 + i * 0.6, 2.5 + i * 0.6) + 0.001}><ringGeometry args={[0.022, 0.026, 40]} /><meshBasicMaterial color={c} toneMapped={false} /></mesh>)}
    {pins.map(([c, p, l], i) => <Sheet key={"l" + i} map={txt("pl" + l, [l], { w: 256, h: 64, bg: "#fbf8f0", fg: c, size: 40 })} w={0.08} h={0.02} p={[p[0], 0.006, p[2] + 0.035]} r={[-PI / 2, 0, 0]} s={pop(tt, 2.2 + i * 0.6)} />)}
  </>;
}}</Scene3D>;

// ---- 23:36 · LA CAJA FUERTE: se abre vacía, se prueba el código, se cierra y la luz verde confirma ----
export const HSafe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0.03, 0.14, 0], az: [0.4, 0.2], el: [0.18, 0.15], r: [0.95, 0.84], fov: 30 }}>{(tt) => {
  const door = -1.6 * eio(tt, 0.5, 1.4) + 1.6 * eio(tt, 2.6, 3.2), ok = tt > 3.3;
  return <>
    <RBox s={[0.3, 0.22, 0.24]} p={[0, 0.11, -0.12]} r={0.008}><meshStandardMaterial color="#2b2d31" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} /></RBox>
    <mesh position={[0, 0.11, 0.0005]}><planeGeometry args={[0.26, 0.18]} />{M.matte({ col: "#121315" })}</mesh>
    <group position={[-0.15, 0.11, 0.004]} rotation={[0, door, 0]}>
      <RBox s={[0.3, 0.22, 0.02]} p={[0.15, 0, 0.01]} r={0.006}><meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} /></RBox>
      {Array.from({ length: 12 }, (_, i) => { const pr = tt > 1.6 + i * 0.07 && tt < 2.5 && i % 4 === Math.floor((tt - 1.6) * 5) % 4;
        return <mesh key={i} position={[0.11 + (i % 3) * 0.022, 0.04 - Math.floor(i / 3) * 0.022, 0.0205 - (pr ? 0.003 : 0)]}><boxGeometry args={[0.016, 0.016, 0.004]} />{M.steel()}</mesh>; })}
      <mesh position={[0.24, 0.06, 0.021]}><circleGeometry args={[0.014 * (ok ? 1.4 + 0.2 * Math.sin(tt * 8) : 1), 20]} /><meshBasicMaterial color={ok ? "#4ef08a" : "#5a1410"} toneMapped={false} /></mesh>
      <mesh position={[0.24, -0.04, 0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.015, 30]} />{M.chrome()}</mesh>
    </group>
    <group position={[0.2, 0.2, 0.14]} scale={pop(tt, 1.0)}><PriceTag lines={["TRY IT", "EMPTY"]} s={1.2} /></group>
  </>;
}}</Scene3D>;

// ---- 24:45 · LA PROPINA: sobre la almohada cae la notita «thank you» y bajan planeando los billetes ----
export const HPillow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#151210"
  cam={{ at: [0, 0.07, 0], az: [-0.3, 0.1], el: [0.62, 0.52], r: [0.62, 0.54], fov: 30 }} warm={0.7}>{(tt) => <>
  <mesh position={[0, -0.02, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.4, 1.0]} /><meshStandardMaterial map={tex.tile(10, 8, "#7d5f4c", "#6d5140")} roughness={0.95} /></mesh>
  <RBox s={[0.36, 0.07, 0.2]} p={[0, 0.03, -0.05]} r={0.034}><meshStandardMaterial color="#efe9df" roughness={0.9} /></RBox>
  <group position={[0.02, 0.095 + fallY(tt, 0.5, 0.35, 7, 0.4), -0.04]} rotation={[-PI / 2 + 0.1, 0, 0.2 + 0.4 * (1 - eio(tt, 0.5, 1.4))]} scale={pop(tt, 0.4)}>
    <Sheet map={txt("ty", ["Thank you,", "housekeeping!"], { w: 384, h: 192, bg: "#fffaf0", fg: "#1d2f5a", size: 52, font: HANDF })} w={0.17} h={0.085} />
  </group>
  {[0, 1, 2].map((i) => { const a = 1.4 + i * 0.5, k = eio(tt, a, a + 1.4); return <group key={i} position={[-0.06 + i * 0.012 + (i - 1) * 0.12 * (1 - k) + 0.05 * Math.sin(tt * 3 + i) * (1 - k), 0.088 + i * 0.002 + 0.4 * (1 - k), 0.07 - i * 0.004]} rotation={[-PI / 2 + 0.6 * Math.sin(tt * 4 + i) * (1 - k), 0, 0.12 * i - 0.12]} scale={tt > a ? 1 : 0.001}><Sheet map={txt("billp", ["$1", "ONE DOLLAR"], { w: 384, h: 168, bg: "#b9c9a4", fg: "#2f4a28", size: 72 })} w={0.15} h={0.066} /></group>; })}
</>}</Scene3D>;

// ---- 25:17 · NO PAGUES DOS VECES: dos escudos iguales; el de la tarjeta queda, el «plan del hotel» se cae de la mesa ----
export const HTwice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [0.2, -0.1], el: [0.2, 0.18], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const push = eio(tt, 2.4, 3.2), fall = cl((tt - 3.2) / 0.8), fx = 0.17 + 0.2 * push, fy = 0.13 - 1.2 * fall * fall;
  const Shield: React.FC<{ lab: string; col: string }> = ({ lab, col }) => <>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.02, 6]} /><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={1} /></mesh>
    <mesh position={[0, 0, 0.0105]}><planeGeometry args={[0.13, 0.08]} /><meshStandardMaterial map={txt("sh" + lab, [lab, "covers it"], { w: 320, h: 196, bg: col, fg: "#fff", size: 38 })} /></mesh>
  </>;
  return <>
    <RBox s={[0.7, 0.03, 0.3]} p={[-0.08, 0.015, 0]} r={0.008}>{M.wood({ base: [120, 78, 44] })}</RBox>
    <group position={[-0.17, 0.13, 0]} scale={pop(tt, 0.2)}><Shield lab="YOUR CARD" col="#2f5d4a" /></group>
    <group position={[fx, fy + fallY(tt, 0.7, 0.3), 0]} rotation={[0, 0, -fall * 1.8]} scale={pop(tt, 0.7)}><Shield lab="HOTEL PLAN" col="#8a2a22" /></group>
    <group position={[0.0, 0.26, 0.08]} scale={pop(tt, 1.4)}><PriceTag lines={["SAME", "COVER"]} s={1.2} /></group>
  </>;
}}</Scene3D>;

// ---- 26:07 · LA SEGUNDA CUENTA SE ACHICA: el recibo largo se enrolla y achica mientras el frasco de ahorro se llena de monedas ----
export const HJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.12, 0], az: [-0.3, 0.1], el: [0.3, 0.26], r: [0.85, 0.74], fov: 30 }}>{(tt) => {
  const shrink = 1 - 0.75 * eio(tt, 0.6, 3.6), n = Math.floor(28 * eio(tt, 0.8, 4.6));
  const m = txt("bill2s", ["SECOND BILL", "PARKING", "BREAKFAST", "RESORT FEE", "WI-FI", "PHONE", "MINIBAR"], { w: 256, h: 560, bg: "#fbf8f0", size: 30, lh: 74, align: "left", cols: ["#b8302a"] });
  return <>
    <mesh position={[-0.17, 0.003, 0.2 * shrink - 0.12]} rotation={[-PI / 2, 0, 0.1]} scale={[1, Math.max(0.001, shrink), 1]}><planeGeometry args={[0.1, 0.4]} /><meshStandardMaterial map={m} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <group position={[0.1, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.085, 0.08, 0.22, 48, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.225, 0]}><cylinderGeometry args={[0.07, 0.07, 0.012, 40]} />{M.brass()}</mesh>
      <mesh position={[0, 0.225, 0]}><boxGeometry args={[0.05, 0.014, 0.008]} />{M.matte({ col: "#141414" })}</mesh>
      {Array.from({ length: n }, (_, i) => <Coin key={i} p={[(rn(i, 1) - 0.5) * 0.1, 0.006 + Math.floor(i / 4) * 0.006 + (i === n - 1 ? fallY(tt, 0.8 + (i / 28) * 3.8, 0.2, 12) : 0), (rn(i, 2) - 0.5) * 0.1]} r={[0.2 * rn(i, 3), 0, 0.2 * rn(i, 4)]} s={1.3} />)}
      <Sheet map={txt("jarl", ["GRANDKIDS"], { w: 320, h: 96, bg: "#f4efe3", fg: "#1d2f5a", size: 50, font: HANDF })} w={0.11} h={0.032} p={[0, 0.1, 0.087]} />
    </group>
  </>;
}}</Scene3D>;
