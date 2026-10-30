// lin29a · componentes 1-10 (hoteles): cada idea es un objeto 3D con material y luz que se entiende sin leer.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, phys, rn, cl } from "./h3d";
import { Coin, HANDF, KeyCard, PI, PriceTag, Sheet, TapeRoll, TapeStrip, fallY, pop, txt } from "./lkit3d";

// ---- 0:35 · 4.000 NOCHES: llueven tarjetas llave sobre el mostrador y el contador de bronce rueda hasta 4000 ----
export const HNights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.3, 0.6, 0.4]}
  cam={{ at: [0, 0.1, 0], at1: [0.05, 0.12, 0], az: [-0.2, -0.05], el: [0.32, 0.22], r: [0.72, 0.6], fov: 30 }}>{(tt) => {
  const n = 4000 * eio(tt, 0.6, 4.6), cols = ["#1d2f5a", "#8a2a22", "#2f5d4a", "#c9a24a", "#3b3f46"];
  return <>
    <RBox s={[0.9, 0.04, 0.4]} p={[0, 0.02, 0]} r={0.01}>{M.wood({ base: [120, 78, 44] })}</RBox>
    {Array.from({ length: 46 }, (_, i) => { const a = 0.3 + i * 0.09, y = 0.042 + 0.0028 * i + fallY(tt, a, 0.7, 9, 0.5);
      return <KeyCard key={i} col={cols[i % 5]} label={i % 3 ? "ROOM KEY" : "WELCOME"} p={[-0.2 + (rn(i, 1) - 0.5) * 0.16, y, (rn(i, 2) - 0.5) * 0.14]} r={[-PI / 2, 0, rn(i, 3) * 3]} s={tt > a - 0.05 ? 1 : 0.001} />; })}
    {/* el contador mecánico de bronce */}
    <group position={[0.16, 0.11, 0.06]} scale={1.35 * pop(tt, 0.2)}>
      <RBox s={[0.24, 0.1, 0.09]} r={0.012}>{M.brass({ col: "#b88a34" })}</RBox>
      {[0, 1, 2, 3].map((d) => { const v = Math.floor(n / Math.pow(10, 3 - d)) % 10 + (d === 3 ? (n % 1) : 0); return <DigitDrum key={d} v={d === 0 ? n / 1000 : v} p={[-0.075 + d * 0.05, 0, 0.046]} r={0.03} w={0.04} />; })}
      <Sheet map={txt("nights", ["NIGHTS"], { w: 256, h: 64, bg: "#b88a34", fg: "#2a1c08", size: 44 })} w={0.12} h={0.03} p={[0, -0.072, 0.046]} />
    </group>
  </>;
}}</Scene3D>;

// ---- 1:53 · LA SEGUNDA CUENTA: debajo del recibo de la habitación, la impresora escupe otra cuenta que no termina nunca ----
const secondLines = ["PARKING  $34", "BREAKFAST  $59", "RESORT FEE  $45", "WI-FI  $14.95", "PHONE  $80", "MINIBAR  $22", "EARLY IN  $40", "SAFE FEE  $3"];
export const HSecondBill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="dark"
  cam={{ at: [-0.02, 0.04, 0.02], at1: [0.05, 0.03, 0.1], az: [0.3, 0.1], el: [0.75, 0.9], r: [0.7, 0.62], fov: 32 }}>{(tt) => {
  const len = 0.02 + 0.42 * eio(tt, 0.9, 4.8), m = txt("bill2", ["THE SECOND BILL", ...secondLines], { w: 320, h: 720, bg: "#fbf8f0", fg: "#2a2a30", size: 30, lh: 74, align: "left", cols: ["#b8302a"] });
  m.repeat.set(1, len / 0.44); m.offset.set(0, 1 - len / 0.44);
  return <>
    {/* el recibo prolijo de la habitación */}
    <group scale={pop(tt, 0.15)}><Sheet map={txt("bill1r", ["ROOM", "$149", "1 NIGHT"], { w: 256, h: 320, bg: "#fbf8f0", size: 56, lh: 80 })} w={0.12} h={0.15} p={[-0.17, 0.003, 0.05]} r={[-PI / 2, 0, 0.12]} /></group>
    {/* la impresora térmica y el papel que sale y se enrolla sobre el mostrador */}
    <group position={[0.08, 0, -0.18]} scale={pop(tt, 0.35)}>
      <RBox s={[0.18, 0.08, 0.12]} p={[0, 0.04, 0]} r={0.015}>{M.plastic({ col: "#2b2d31" })}</RBox>
      <mesh position={[0.05, 0.081, 0.03]}><cylinderGeometry args={[0.006, 0.006, 0.002, 16]} />{M.glow({ col: tt % 0.5 < 0.25 ? "#6fe39a" : "#2a6a3f" })}</mesh>
    </group>
    <mesh position={[0.08, 0.004, -0.12 + len / 2]} rotation={[-PI / 2, 0, 0]} castShadow receiveShadow><planeGeometry args={[0.13, len]} /><meshStandardMaterial map={m} roughness={0.9} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.08, 0.016, -0.12 + len]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.13, 24]} />{M.porcelain({ col: "#f3efe6" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 2:56 · CUATRO MINUTOS: el cronómetro marca 4 minutos y la tarjeta de socio gratis tapa la etiqueta «SENIOR» ----
export const HFourMin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0.03, 0.08, 0], az: [0.3, 0.1], el: [0.5, 0.42], r: [0.8, 0.68], fov: 30 }}>{(tt) => {
  const hand = eio(tt, 0.5, 3.4) * (4 / 60) * 2 * PI * 15, slide = eio(tt, 2.6, 3.8);
  return <>
    <group position={[-0.16, 0.1, 0]} rotation={[-0.15, 0.25, 0]} scale={pop(tt, 0.1)}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.09, 0.09, 0.03, 64]} />{M.chrome()}</mesh>
      <mesh position={[0, 0, 0.0155]}><circleGeometry args={[0.082, 64]} /><meshStandardMaterial map={txt("dial", ["0  ·  15  ·  30  ·  45"], { w: 512, h: 512, bg: "#f7f3ea", size: 30 })} roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.018]} rotation={[0, 0, -hand]}><boxGeometry args={[0.004, 0.07, 0.002]} />{M.matte({ col: "#b8302a" })}</mesh>
      <mesh position={[0, 0.105, 0]}><cylinderGeometry args={[0.012, 0.012, 0.025, 20]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.03, 0.019]} scale={pop(tt, 3.4)}><planeGeometry args={[0.08, 0.025]} /><meshStandardMaterial map={txt("4min", ["4 MIN"], { w: 256, h: 80, bg: "#f7f3ea", fg: "#b8302a", size: 60 })} /></mesh>
    </group>
    <group position={[0.17, 0.004, 0.02]}>
      <PriceTag lines={["SENIOR", "$139 / night"]} p={[0, 0.002, 0]} r={[-PI / 2, 0, -0.1]} s={1.9 * pop(tt, 0.3)} />
      <group position={[lerp(0.35, 0, slide), 0.012 + 0.05 * Math.sin(PI * slide), 0]} rotation={[-PI / 2, 0, 0.08]}>
        <KeyCard col="#c9a24a" label="MEMBER · FREE" s={2.6} />
      </group>
      <mesh position={[0, 0.03, -0.09]} scale={pop(tt, 4.0)}><planeGeometry args={[0.16, 0.05]} /><meshStandardMaterial map={txt("11less", ["$11 LESS", "every night"], { w: 384, h: 128, bg: "#1d2f5a", fg: "#f4efe3", size: 54 })} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:15 · TRES NÚMEROS: tres etiquetas cuelgan y se balancean; la más baja sube y una birome la encierra en un círculo ----
export const HThreeRates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#1a1410"
  cam={{ at: [0, 0.3, 0], az: [-0.2, 0.15], el: [0.06, 0.1], r: [0.95, 0.85], fov: 32 }}>{(tt) => {
  const rates = [["SENIOR", "$139"], ["MEMBER", "$128"], ["CLUB", "$131"]], lift = eio(tt, 2.8, 3.6), ring = eio(tt, 3.5, 4.6);
  return <>
    <mesh position={[0.04, 0.56, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.62, 16]} />{M.brass()}</mesh>
    {rates.map((r, i) => { const x = (i - 1) * 0.2, a = 0.2 + i * 0.35, sw = 0.5 * Math.exp(-(tt - a) * 1.4) * Math.cos((tt - a) * 6) * (tt > a ? 1 : 0), L = 0.22 - (i === 1 ? 0.06 * lift : 0);
      return <group key={i} position={[x, 0.56, 0]} rotation={[0, 0, sw]}>
        <mesh position={[0, -L / 2, 0]}><cylinderGeometry args={[0.0009, 0.0009, L, 6]} />{M.matte({ col: "#d8cdb4" })}</mesh>
        <group position={[0.065, -L - 0.055 + fallY(tt, a, 0.5, 8), 0]}><PriceTag lines={r} s={1.5} col={i === 1 ? "#fff6dc" : "#f1ece0"} fg={i === 1 ? "#b8302a" : "#1d2f5a"} /></group>
      </group>; })}
    {/* el círculo a mano de birome alrededor de la ganadora */}
    <mesh position={[0.065, 0.56 - 0.16 - 0.055, 0.02]} scale={[1.15, 0.75, 1]}><torusGeometry args={[0.12, 0.004, 8, 80, 2 * PI * Math.max(0.001, ring)]} />{M.glow({ col: "#ff5a4a" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 4:07 · MISMO ANIMAL, OTRO SOMBRERO: el prisma triangular gira y cambia el nombre del cargo; el sombrero salta de cara en cara, el $45 no se mueve ----
const fees = ["RESORT FEE", "DESTINATION FEE", "AMENITY FEE", "URBAN FEE"];
export const HFeePrism: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark"
  cam={{ at: [0, 0.16, 0.04], az: [-0.55, -0.3], el: [0.2, 0.24], r: [0.92, 0.84], fov: 30 }}>{(tt) => {
  const x = Math.max(0, tt - 0.8), step = Math.min(3, Math.floor(x / 1.1)), frac = (x < 3.3 ? eio(x % 1.1, 0.5, 1.05) : 0), s = step + frac, rot = s * (2 * PI / 3);
  const hop = Math.sin(PI * frac) * 0.1, R = 0.05;
  return <>
    <group position={[0, 0.14, 0]} rotation={[rot, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[R * 2, R * 2, 0.5, 3]} />{M.matte({ col: "#cfc6b2" })}</mesh>
      {[0, 1, 2].map((j) => { const f = fees[j === 0 && s >= 2 ? 3 : j]; return <group key={j} rotation={[-(PI / 3 + j * 2 * PI / 3), 0, 0]}>
        <mesh position={[0, 0, R + 0.0012]}><planeGeometry args={[0.46, 0.15]} /><meshStandardMaterial map={txt("fee4" + f, [f], { w: 768, h: 256, bg: j % 2 ? "#ece4d2" : "#f6f1e4", fg: "#1d2f5a", size: 74 })} roughness={0.6} /></mesh></group>; })}
      {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[R * 2 + 0.002, R * 2 + 0.002, 0.004, 3]} />{M.brass()}</mesh>)}
    </group>
    <group position={[0.18, 0.14 + 0.09 + hop, 0]} rotation={[0, 0, -0.15 + frac * 0.3]} scale={pop(tt, 0.5)}>
      <mesh castShadow><cylinderGeometry args={[0.06, 0.06, 0.006, 40]} />{M.matte({ col: "#141416" })}</mesh>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.04, 0.042, 0.085, 40]} />{M.matte({ col: "#1b1b1f" })}</mesh>
      <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.0425, 0.0425, 0.014, 40]} />{M.matte({ col: "#b8302a" })}</mesh>
    </group>
    <group position={[0, 0.02, 0.16]} scale={pop(tt, 1.0)}><PriceTag lines={["$45", "a night"]} col="#b8302a" fg="#fff4e6" r={[-0.6, 0, 0]} s={2.0} /></group>
  </>;
}}</Scene3D>;

// ---- 5:46 · HACÉ LA CUENTA CON EL CARGO: la balanza de bronce: $149 + $45 de un lado pesan más que $179 del otro ----
export const HFeeScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.24, 0], az: [-0.15, 0.12], el: [0.12, 0.18], r: [0.85, 0.74], fov: 30 }}>{(tt) => {
  const fee = tt > 2.2, tilt = lerp(-0.14, 0.26, eio(tt, 2.3, 3.4)) + 0.03 * Math.exp(-(tt - 3.4) * 2) * Math.sin((tt - 3.4) * 10) * (tt > 3.4 ? 1 : 0);
  const end = (side: number) => [side * 0.24 * Math.cos(tilt), 0.36 + side * 0.24 * Math.sin(tilt) - 0.12];
  return <>
    <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.012, 0.03, 0.36, 24]} />{M.brass()}</mesh>
    <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.1, 0.12, 0.02, 40]} />{M.brass({ col: "#a97b2c" })}</mesh>
    <mesh position={[0, 0.36, 0]} rotation={[0, 0, tilt]}><boxGeometry args={[0.5, 0.012, 0.016]} />{M.brass()}</mesh>
    {[end(-1), end(1)].map((p, i) => <group key={i} position={[p[0], p[1], 0]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.001, 0.001, 0.12, 4]} />{M.steel()}</mesh>
      <mesh><cylinderGeometry args={[0.1, 0.085, 0.012, 40]} />{M.brass({ col: "#c99a3c" })}</mesh>
      {i === 0 ? <>
        <group position={[0, 0.03 + fallY(tt, 0.4, 0.4), 0]} scale={pop(tt, 0.4)}><PriceTag lines={["$149", "room"]} s={1.3} r={[-0.4, 0, 0]} /></group>
        <group position={[0.01, 0.08 + fallY(tt, 2.2, 0.5, 9, 0.4), 0.01]} scale={fee ? 1 : 0.001}><PriceTag lines={["+$45", "fee"]} col="#b8302a" fg="#fff4e6" s={1.3} r={[-0.4, 0, 0.1]} /></group>
      </> : <group position={[0, 0.03 + fallY(tt, 0.8, 0.4), 0]} scale={pop(tt, 0.8)}><PriceTag lines={["$179", "no fee"]} col="#e6f2e6" fg="#2f5d4a" s={1.3} r={[-0.4, 0, 0]} /></group>}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 6:36 · EL SENSOR: en la bandeja del minibar una botellita se levanta, la ranura se pone roja y sale el ticket de $64 ----
export const HSensor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0b0c0e" warm={0.7}
  cam={{ at: [0.03, 0.12, 0.03], az: [0.15, -0.1], el: [0.45, 0.38], r: [0.64, 0.56], fov: 30 }}>{(tt) => {
  const lift = eio(tt, 1.0, 1.8), red = tt > 1.6, tk = eio(tt, 2.4, 3.6);
  return <>
    <RBox s={[0.5, 0.3, 0.32]} p={[0, 0.15, -0.08]} r={0.01}><meshStandardMaterial color="#1a1c20" roughness={0.6} side={THREE.BackSide} /></RBox>
    <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.44, 0.012, 0.22]} />{M.steel({ col: "#9aa0a6" })}</mesh>
    {Array.from({ length: 6 }, (_, i) => { const x = -0.18 + i * 0.072, me = i === 2;
      return <group key={i} position={[x, 0.026, 0]}>
        <mesh><boxGeometry args={[0.06, 0.004, 0.08]} /><meshStandardMaterial color={me && red ? "#ff3b30" : "#3b4046"} emissive={me && red ? "#ff3b30" : "#0a2a12"} emissiveIntensity={me && red ? 2.2 : 0.6} /></mesh>
        <group position={[0, 0.003 + (me ? 0.16 * lift : 0), 0]} rotation={[0, 0, me ? 0.2 * lift : 0]} scale={pop(tt, 0.1 + i * 0.07)}>
          {i % 2 ? <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.014, 0.017, 0.09, 24]} />{M.glass({ col: i === 3 ? "#9fd0a6" : "#e3b36a", op: 0.7 })}</mesh>
            : <RBox s={[0.045, 0.07, 0.02]} p={[0, 0.035, 0]} r={0.004}>{M.plastic({ col: ["#c0392b", "#d9a84a", "#3b6ea8"][i / 2] })}</RBox>}
        </group>
      </group>; })}
    <group position={[-0.1, 0.12 + 0.08 * tk, 0.16]} rotation={[0, 0.15, 0.1 * (1 - tk)]} scale={pop(tt, 2.4)}><PriceTag lines={["$64", "MINIBAR"]} col="#fbf8f0" fg="#b8302a" s={1.4} /></group>
  </>;
}}</Scene3D>;

// ---- 7:30 · LA CINTA AZUL: el rollo cruza la puerta del minibar y deja la tira pegada ----
export const HTapeStrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.18, 0], az: [-0.35, -0.1], el: [0.12, 0.18], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const run = eio(tt, 0.9, 3.0), len = 0.36 * run, run2 = eio(tt, 3.2, 4.6);
  return <>
    <RBox s={[0.42, 0.36, 0.34]} p={[0, 0.18, -0.17]} r={0.012}>{M.wood({ base: [80, 52, 30] })}</RBox>
    <RBox s={[0.38, 0.3, 0.012]} p={[0, 0.18, 0.006]} r={0.006}><meshPhysicalMaterial color="#2b2e33" roughness={0.3} clearcoat={0.7} /></RBox>
    <mesh position={[0.15, 0.18, 0.02]}><boxGeometry args={[0.012, 0.1, 0.012]} />{M.chrome()}</mesh>
    <TapeStrip len={len} p={[-0.18, 0.2, 0.0135]} r={[0, 0, -0.08]} label="DON'T" />
    <TapeRoll p={[-0.18 + len * Math.cos(-0.08), 0.2 + len * Math.sin(-0.08), 0.04]} r={[0, 0, -run * 9]} s={pop(tt, 0.4)} />
    {/* la bandeja de snacks al lado recibe su tira */}
    <RBox s={[0.26, 0.02, 0.16]} p={[0.36, 0.37, -0.05]} r={0.006}>{M.wood({ base: [120, 80, 44] })}</RBox>
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.05, 0.07, 0.02]} p={[0.29 + i * 0.07, 0.415, -0.05]} r={0.004}>{M.plastic({ col: ["#c0392b", "#d9a84a", "#3b6ea8"][i] })}</RBox>)}
    <TapeStrip len={0.26 * run2} p={[0.23, 0.425, -0.035]} r={[0, 0, 0]} />
  </>;
}}</Scene3D>;

// ---- 8:51 · DESAYUNO DE TRES DÍAS POR $12: la bolsa de papel se vuelca y salen de a uno yogures, bananas y barritas, en fila con rebote ----
export const HGrocery: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0.02, 0.07, 0.05], az: [0.15, 0.02], el: [0.36, 0.3], r: [0.78, 0.68], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 0.7, 1.3), it = (i: number) => phys(tt, 1.1 + i * 0.32, 8, 0.4), X = (i: number) => -0.2 + i * 0.075;
  const out = (i: number, y: number) => [lerp(-0.2, X(i), cl(it(i))), y + 0.12 * Math.sin(PI * cl((tt - 1.1 - i * 0.32) / 0.45)), lerp(-0.08, 0.1, cl(it(i)))];
  return <>
    <group position={[-0.24, 0, -0.1]} rotation={[0, 0.3, -PI / 2 * 0.62 * tip]} scale={pop(tt, 0.1)}>
      <RBox s={[0.17, 0.24, 0.11]} p={[0.085, 0.12, 0]} r={0.008}><meshStandardMaterial color="#b98d5a" roughness={0.95} /></RBox>
      <mesh position={[0.085, 0.13, 0.0555]}><planeGeometry args={[0.15, 0.1]} /><meshStandardMaterial map={txt("bagp", ["GROCERY", "& PHARMACY"], { w: 384, h: 256, bg: "#b98d5a", fg: "#5a3a1c", size: 60 })} roughness={0.95} /></mesh>
    </group>
    {[0, 1, 2].map((i) => { const p = out(i, 0.03); return <mesh key={i} position={p as any} castShadow scale={0.001 + cl(it(i) * 3)}><cylinderGeometry args={[0.025, 0.02, 0.06, 28]} />{M.porcelain({ col: ["#f2f0ea", "#f6d7d7", "#e9f0f7"][i] })}</mesh>; })}
    {[3, 4].map((i) => { const p = out(i, 0.02); return <group key={i} position={[p[0], 0.032, p[2]] as any} scale={0.001 + cl(it(i) * 3)}><mesh castShadow><sphereGeometry args={[0.032, 28, 20]} /><meshStandardMaterial color="#f08a1c" roughness={0.75} /></mesh><mesh position={[0, 0.032, 0]}><cylinderGeometry args={[0.003, 0.003, 0.012, 8]} />{M.matte({ col: "#4a6b2a" })}</mesh></group>; })}
    {(() => { const p = out(5, 0.05); return <RBox s={[0.12, 0.08, 0.03]} p={p} rot={[0, 0, 0]} r={0.004}><meshStandardMaterial map={txt("granola", ["GRANOLA", "BARS"], { w: 256, h: 160, bg: "#c75b2a", fg: "#fff3dc", size: 54 })} roughness={0.7} /></RBox>; })()}
    <group position={[0.15, 0.17, 0.06]} rotation={[0, -0.2, 0]} scale={pop(tt, 3.2)}><PriceTag lines={["$12", "3 breakfasts"]} col="#e6f2e6" fg="#2f5d4a" s={1.7} /></group>
  </>;
}}</Scene3D>;

// ---- 9:58 · UNA CUADRA MÁS ALLÁ: maqueta de la cuadra: el autito sale del valet de $65 y estaciona en el garaje público de $22 ----
export const HCityBlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#101318"
  cam={{ at: [0.02, 0.08, 0.02], az: [-0.45, -0.2], el: [0.6, 0.5], r: [1.05, 0.9], fov: 30 }}>{(tt) => {
  const drive = eio(tt, 1.6, 3.8), cx = lerp(-0.26, 0.3, drive), cz = 0.12 - 0.1 * Math.sin(PI * drive) * 0;
  const win = (key: string, col: string) => txt("win" + key, Array.from({ length: 6 }, () => "▮ ▮ ▮"), { w: 128, h: 256, bg: col, fg: "#ffd890", size: 30, lh: 40 });
  return <>
    <mesh position={[0, 0.001, 0.12]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1, 0.09]} />{M.matte({ col: "#2e3136" })}</mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.45 + i * 0.1, 0.002, 0.12]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.04, 0.004]} />{M.glow({ col: "#e8d27a" })}</mesh>)}
    {/* el hotel con su toldo y su valet */}
    <group position={[-0.26, 0, -0.06]} scale={[1, pop(tt, 0.1), 1]}>
      <RBox s={[0.2, 0.42, 0.16]} p={[0, 0.21, 0]} r={0.004}><meshStandardMaterial map={win("h", "#3b4a63")} roughness={0.6} /></RBox>
      <mesh position={[0, 0.06, 0.1]}><boxGeometry args={[0.12, 0.006, 0.05]} />{M.matte({ col: "#b8302a" })}</mesh>
    </group>
    <group position={[-0.26, 0.18, 0.09]} scale={pop(tt, 0.6)}><PriceTag lines={["VALET", "$65 / night"]} col="#3a2b28" fg="#ff8a7a" s={1.5} /></group>
    {/* las casas del medio y el garaje público */}
    {[0, 1].map((i) => <RBox key={i} s={[0.1, 0.14 + 0.05 * i, 0.12]} p={[-0.05 + i * 0.12, 0.07 + 0.025 * i, -0.06]} r={0.004}>{M.matte({ col: ["#6b5a4a", "#55606b"][i] })}</RBox>)}
    <group position={[0.3, 0, -0.06]} scale={[1, pop(tt, 0.3), 1]}>
      {[0, 1, 2].map((f) => <mesh key={f} position={[0, 0.03 + f * 0.06, 0]}><boxGeometry args={[0.22, 0.012, 0.16]} />{M.matte({ col: "#9a9890" })}</mesh>)}
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.1, 0.09, 0.07]}><boxGeometry args={[0.012, 0.18, 0.012]} />{M.matte({ col: "#8a887f" })}</mesh>)}
    </group>
    <group position={[0.3, 0.24, 0.09]} scale={pop(tt, 2.9)}><PriceTag lines={["GARAGE", "$22"]} col="#e6f2e6" fg="#2f5d4a" s={1.5} /></group>
    {/* el autito */}
    <group position={[cx, 0.03, cz]} rotation={[0, 0, 0]} scale={1.6 * pop(tt, 0.9)}>
      <RBox s={[0.08, 0.025, 0.04]} p={[0, 0.0, 0]} r={0.008}><meshPhysicalMaterial color="#c9a24a" roughness={0.3} clearcoat={1} /></RBox>
      <RBox s={[0.045, 0.02, 0.036]} p={[-0.005, 0.02, 0]} r={0.008}>{M.glass({ op: 0.6, col: "#9fb8d0" })}</RBox>
      {[[-0.025, -0.022], [0.025, -0.022], [-0.025, 0.022], [0.025, 0.022]].map((w, i) => <mesh key={i} position={[w[0], -0.01, w[1]]} rotation={[PI / 2, drive * 40, 0]}><cylinderGeometry args={[0.009, 0.009, 0.006, 16]} />{M.rubber({ col: "#1a1a1a" })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;
