// lin29d · componentes 21-29 (alquiler de autos)
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Bill, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Suitcase } from "./lkit_b";
import { Car, Drums } from "./heroes_d1";

// ---- 14:20 · LA PLATA CONGELADA: los billetes de la cuenta quedan atrapados en un bloque de hielo con HOLD $300 ----
export const HDebitHold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.07, 0], az: [-0.2, 0.1], el: [0.26, 0.22], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const ice = eio(tt, 1.0, 2.4);
  return <>
    <group position={[-0.04, 0, 0]}>
      {Array.from({ length: 5 }, (_, i) => <Bill key={i} p={[0, 0.006 + i * 0.006 + fallY(tt, 0.2 + i * 0.12, 0.2), 0]} r={[0, (rn(i) - 0.5) * 0.3, 0]} s={1.8} />)}
      <mesh position={[0, 0.045, 0]} scale={[Math.max(0.001, ice), Math.max(0.001, ice), Math.max(0.001, ice)]}><boxGeometry args={[0.2, 0.09, 0.13]} /><meshPhysicalMaterial color="#cfe8f6" roughness={0.08} transmission={0.3} thickness={0.05} transparent opacity={0.72} clearcoat={1} /></mesh>
    </group>
    <PriceTag lines={["HOLD", "$300"]} col="#2f6fb0" fg="#ffffff" p={[-0.04, 0.16, 0]} s={pop(tt, 2.2)} />
    
    <group position={[0.17, 0.05, 0.02]} rotation={[0, -0.4, 0]} scale={pop(tt, 2.8)}>
      <RBox s={[0.09, 0.056, 0.004]} r={0.006}>{M.plastic({ col: "#1d2f5a" })}</RBox>
      <RBox s={[0.016, 0.012, 0.002]} p={[-0.025, 0.006, 0.003]} r={0.002}>{M.brass({})}</RBox>
      <PriceTag lines={["CREDIT", "NO CASH OUT"]} col="#2e8b57" fg="#ffffff" p={[0, 0.08, 0]} s={0.75} />
    </group>
  </>;
}}</Scene3D>;

// ---- 15:10 · LOS PRECIOS SUBEN Y BAJAN: el autito sube y baja en el elevador del taller y el tambor del precio lo sigue ----
export const HCarLift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="dark"
  cam={{ at: [0.07, 0.13, 0], az: [-0.2, 0.08], el: [0.12, 0.1], r: [0.9, 0.84], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.4, 4.4), hgt = 0.04 + 0.12 * Math.abs(Math.sin(k * PI * 2.5)) * (0.6 + 0.4 * Math.sin(k * 9));
  return <>
    <group scale={pop(tt, 0.1)}>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.13, 0, -0.02]}>
        <RBox s={[0.03, 0.34, 0.03]} p={[0, 0.17, 0]} r={0.004}>{M.pvc({ col: "#c9302a" })}</RBox>
        <RBox s={[0.06, 0.01, 0.06]} p={[0, 0.005, 0]} r={0.003}>{M.steel({})}</RBox>
      </group>)}
      <RBox s={[0.3, 0.012, 0.12]} p={[0, hgt, 0]} r={0.004}>{M.steel({})}</RBox>
      <mesh position={[0, hgt / 2, 0]}><cylinderGeometry args={[0.008, 0.008, hgt, 12]} />{M.chrome({})}</mesh>
      <Car p={[0, hgt + 0.006, 0]} s={1.1} col="#2f6fb0" />
    </group>
    <Drums id="cl" v={Math.round(190 + (hgt - 0.04) * 2000)} n={3} p={[0.27, 0.2, -0.02]} s={0.8 * pop(tt, 0.3)} />
  </>;
}}</Scene3D>;

// ---- 16:10 · UNA SEMANA ANTES, CON EL CAFÉ: junto a la taza el tambor rueda de 412 a 248 y aparece "$164 SAVED" ----
export const HPriceDrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [-0.02, 0.11, 0], az: [-0.2, 0.08], el: [0.2, 0.17], r: [0.7, 0.64], fov: 30 }}>{(tt) => {
  const v = Math.round(412 - 164 * eio(tt, 1.0, 3.0)), steam = (tt * 0.3) % 1;
  return <>
    <group position={[-0.15, 0, 0.04]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.032, 0.028, 0.07, 32]} />{M.porcelain({ col: "#f6f1e4" })}</mesh>
      <mesh position={[0, 0.068, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.029, 32]} /><meshStandardMaterial color="#4a2c1a" roughness={0.3} /></mesh>
      <mesh position={[0.036, 0.04, 0]}><torusGeometry args={[0.014, 0.004, 8, 20]} />{M.porcelain({ col: "#f6f1e4" })}</mesh>
      {[0, 1].map((i) => { const s = (steam + i * 0.5) % 1; return <mesh key={i} position={[(i - 0.5) * 0.012, 0.08 + s * 0.06, 0]} scale={0.008 + s * 0.008}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.25 * (1 - s)} /></mesh>; })}
    </group>
    <Drums id="pd" v={v} n={3} p={[0.04, 0.11, -0.02]} s={1.2 * pop(tt, 0.3)} />
    <group position={[0.04, 0.2, -0.02]} scale={pop(tt, 3.2)}><PriceTag lines={["$164", "SAVED"]} col="#2e8b57" fg="#ffffff" /></group>
  </>;
}}</Scene3D>;

// ---- 17:30 · LÍNEA POR LÍNEA: los anteojos bajan sobre el contrato y el resaltador va marcando cargo por cargo ----
export const HGlasses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.03, 0.02], az: [-0.1, 0.06], el: [0.85, 0.8], r: [0.5, 0.46], fov: 30 }}>{(tt) => {
  const lines = ["Daily rate ........ $39", "Airport fee ....... $38", "Facility charge ... $27", "Fuel option ....... $65", "TOTAL ............ $412"];
  const g = eio(tt, 0.5, 1.3);
  return <>
    <group position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]} scale={pop(tt, 0.1)}>
      <Sheet map={txt("gl", ["CONTRACT", ...lines], { w: 360, h: 420, bg: "#f6f1e4", size: 26, lh: 62, cols: ["#1d2f5a", "#333", "#333", "#333", "#333", "#b8302a"] })} w={0.2} h={0.233} />
      {lines.map((_, i) => { const k = eio(tt, 1.5 + i * 0.45, 1.8 + i * 0.45); return <mesh key={i} position={[-0.09 + 0.09 * k, 0.074 - (i + 1) * 0.0345 + 0.004, 0.001]} scale={[Math.max(0.001, k), 1, 1]}><planeGeometry args={[0.18, 0.02]} /><meshBasicMaterial color={i === 4 ? "#ff8a6a" : "#ffe14a"} transparent opacity={0.45} /></mesh>; })}
    </group>
    <group position={[lerp(0.02, 0.16, g), lerp(0.25, 0.03, g), lerp(-0.05, 0.12, g)]} rotation={[-0.9, 0, 0]} scale={pop(tt, 0.5)}>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.035, 0, 0]}>
        <mesh><torusGeometry args={[0.026, 0.003, 10, 32]} />{M.plastic({ col: "#3a2418" })}</mesh>
        <mesh><circleGeometry args={[0.025, 32]} />{M.glass({ op: 0.2 })}</mesh>
      </group>)}
      <mesh position={[0, 0.006, 0]}><torusGeometry args={[0.01, 0.003, 8, 16, PI]} />{M.plastic({ col: "#3a2418" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 18:10 · "NO, GRACIAS" EN EL MOSTRADOR: las cuatro ofertas se dan vuelta una por una y del otro lado dicen NO THANKS ----
export const HNoThanks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark"
  cam={{ at: [0, 0.07, 0], az: [-0.12, 0.08], el: [0.2, 0.16], r: [0.8, 0.74], fov: 30 }}>{(tt) => {
  const offers = ["PROTECTION", "PREPAID FUEL", "GPS", "UPGRADE"];
  return <>
    {offers.map((o, i) => { const f = eio(tt, 1.0 + i * 0.6, 1.5 + i * 0.6); return <group key={i} position={[-0.21 + i * 0.14, 0.07 + 0.015 * Math.sin(f * PI), 0]} rotation={[0, f * PI, 0]} scale={pop(tt, 0.1 + i * 0.1)}>
      <RBox s={[0.12, 0.09, 0.008]} r={0.008}>{M.pvc({ col: "#ffffff" })}</RBox>
      <Sheet map={txt("nt" + i, [o, "YES?"], { w: 256, h: 192, bg: "#b8302a", fg: "#fff4e6", size: 36, lh: 60 })} w={0.11} h={0.082} p={[0, 0, 0.0045]} />
      <Sheet map={txt("ntb" + i, ["NO", "THANKS ✓"], { w: 256, h: 192, bg: "#2e8b57", fg: "#ffffff", size: 44, lh: 66 })} w={0.11} h={0.082} p={[0, 0, -0.0045]} r={[0, PI, 0]} />
      <mesh position={[0, -0.06, 0]}><boxGeometry args={[0.004, 0.04, 0.004]} />{M.steel({})}</mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 19:00 · ESPEJOS ANTES DEL PRIMER METRO: el espejo lateral gira, la ruta entra en el reflejo y se traba con un clic ----
export const HMirrors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#bccbd6"
  cam={{ at: [0.1, 0.16, 0], az: [-0.55, -0.4], el: [0.08, 0.06], r: [0.36, 0.33], fov: 30 }}>{(tt) => {
  const a = lerp(0.7, 0, eio(tt, 0.8, 2.6)) + 0.03 * (1 - phys(tt, 2.6, 9, 0.3)), see = eio(tt, 1.6, 2.6), lock = pop(tt, 2.6);
  return <>
    <RBox s={[0.4, 0.2, 0.03]} p={[0, 0.06, -0.06]} r={0.02}>{M.pvc({ col: "#2f6fb0" })}</RBox>
    <RBox s={[0.36, 0.1, 0.02]} p={[0, 0.2, -0.065]} r={0.01}>{M.glass({ col: "#bcd6ea", op: 0.6 })}</RBox>
    <group position={[0.1, 0.16, -0.03]} rotation={[0, a, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.02, 0.02, 0.04]} p={[0, 0, 0.02]} r={0.006}>{M.pvc({ col: "#2f6fb0" })}</RBox>
      <RBox s={[0.13, 0.08, 0.03]} p={[0, 0, 0.05]} r={0.02}>{M.pvc({ col: "#2f6fb0" })}</RBox>
      <mesh position={[0, 0, 0.066]}><planeGeometry args={[0.115, 0.066]} /><meshStandardMaterial color="#9fb9cc" metalness={0.6} roughness={0.08} /></mesh>
      <group position={[lerp(0.05, 0, see), 0, 0.067]}>
        <mesh position={[0, -0.015, 0]}><planeGeometry args={[0.1, 0.03]} /><meshBasicMaterial color="#4a4e55" transparent opacity={see} /></mesh>
        {[-0.03, 0, 0.03].map((x) => <mesh key={x} position={[x, -0.015, 0.0005]}><planeGeometry args={[0.012, 0.003]} /><meshBasicMaterial color="#f2f2ee" transparent opacity={see} /></mesh>)}
        <mesh position={[0.02, -0.006, 0.0008]}><planeGeometry args={[0.022, 0.012]} /><meshBasicMaterial color="#c9453a" transparent opacity={see} /></mesh>
      </group>
    </group>
    <mesh position={[0.1, 0.16, 0.01]} rotation={[PI / 2, 0, 0]} scale={Math.max(0.001, lock)}><torusGeometry args={[0.085, 0.003, 8, 48, 0.9]} />{M.glow({ col: "#7cff8a" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 19:40 · "TURISTA": con la valija y la campera a la vista sale el cartel TOURIST; se guardan en el baúl y el cartel se hunde ----
export const HTouristSign: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" bg="#c9d3dc"
  cam={{ at: [0, 0.17, 0], az: [-0.26, -0.1], el: [0.2, 0.17], r: [0.9, 0.84], fov: 30 }}>{(tt) => {
  const up = eio(tt, 0.6, 1.2) * (1 - eio(tt, 3.0, 3.6)), hide = eio(tt, 2.0, 2.8);
  return <>
    <Car s={1.8 * pop(tt, 0.1)} col="#f2f2ee" />
    <group position={[lerp(-0.02, -0.25, hide), lerp(0.12, 0.0, hide) + 0.03 * Math.sin(hide * PI), 0.03]} rotation={[0, 0.5 * hide, 0]}>
      <Suitcase col="#b8302a" s={0.45} />
      <mesh position={[0, 0.155, -0.02]}><boxGeometry args={[0.004, 0.06, 0.004]} />{M.chrome({})}</mesh>
      <RBox s={[0.07, 0.035, 0.05]} p={[0.0, 0.14, 0.0]} r={0.012}>{M.matte({ col: "#6b4f3a" })}</RBox>
    </group>
    <group position={[0.03, 0.22 + up * 0.14, 0]} rotation={[0, 0, 0.18 * Math.sin(tt * 7) * eio(tt, 2.6, 3.0) * (1 - eio(tt, 3.3, 3.6))]} scale={Math.max(0.001, up)}>
      <mesh position={[0, -0.09, 0]}><boxGeometry args={[0.006, 0.18, 0.006]} />{M.steel({})}</mesh>
      <RBox s={[0.27, 0.07, 0.012]} r={0.008}>{M.pvc({ col: "#e8822a" })}</RBox>
      <Sheet map={txt("tsg2", ["TOURIST!"], { w: 512, h: 128, bg: "#e8822a", fg: "#1b1b1b", size: 76 })} w={0.25} h={0.0625} p={[0, 0, 0.0065]} />
    </group>
    <PriceTag lines={["IN THE", "TRUNK"]} col="#2e8b57" fg="#ffffff" p={[-0.25, 0.2, 0.04]} s={pop(tt, 3.0) * 0.85} />
  </>;
}}</Scene3D>;

// ---- 20:30 · CAMBIO DE AUTO: el auto bajo sale del lugar y entra uno alto; las llaves se intercambian ----
export const HSwapCar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none" bg="#c9d3dc"
  cam={{ at: [0, 0.07, 0], az: [-0.3, -0.2], el: [0.4, 0.36], r: [0.82, 0.76], fov: 30 }}>{(tt) => {
  const o = eio(tt, 0.6, 2.4), i = eio(tt, 1.6, 3.2);
  return <>
    {[-0.1, 0.1].map((z) => <mesh key={z} position={[0, 0.002, z]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.004]} />{M.matte({ col: "#f2f2ee" })}</mesh>)}
    <Car p={[lerp(0, 0.5, o), 0, 0]} s={1.2 * pop(tt, 0.1)} col="#c9453a" />
    <Car p={[lerp(-0.5, 0, i), 0, 0]} s={1.2} col="#2e8b57" hi={0.035} />
    <PriceTag lines={["EASIER", "TO GET IN"]} col="#2e8b57" fg="#ffffff" p={[0, 0.2, -0.02]} s={pop(tt, 3.0) * 0.85} />
  </>;
}}</Scene3D>;

// ---- 21:30 · TODO LISTO: la carpeta de viaje recibe sus 11 tildes, se cierra y aparece ALL SET ----
export const HAllSet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.04, 0], az: [-0.15, 0.08], el: [0.6, 0.55], r: [0.56, 0.5], fov: 30 }}>{(tt) => {
  const n = Math.min(11, Math.floor(eio(tt, 0.5, 2.6) * 11.99)), close = eio(tt, 2.9, 3.6);
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.22, 0.006, 0.28]} p={[0, 0.003, 0]} r={0.004}>{M.matte({ col: "#d9b06a" })}</RBox>
      {Array.from({ length: 11 }, (_, i) => <group key={i} position={[(i % 2 ? 0.05 : -0.05), 0.008, -0.11 + Math.floor(i / 2) * 0.042]} scale={i < n ? pop(tt, 0.5 + i * 0.19) : 0.001}>
        <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.016, 24]} />{M.plastic({ col: "#2e8b57" })}</mesh>
        <Sheet map={txt("as" + i, ["✓"], { w: 64, h: 64, bg: "#2e8b57", fg: "#ffffff", size: 48 })} w={0.022} h={0.022} p={[0, 0.001, 0]} r={[-PI / 2, 0, 0]} />
      </group>)}
      <group position={[0, 0.006, -0.14]} rotation={[-PI * (1 - close) * 0.98, 0, 0]}>
        <RBox s={[0.22, 0.006, 0.28]} p={[0, 0, 0.14]} r={0.004}>{M.matte({ col: "#c99f58" })}</RBox>
        <Sheet map={txt("asl", ["ALL SET"], { w: 320, h: 96, bg: "#c99f58", fg: "#1d2f5a", size: 70 })} w={0.17} h={0.05} p={[0, 0.004, 0.14]} r={[-PI / 2, 0, 0]} />
      </group>
    </group>
  </>;
}}</Scene3D>;
