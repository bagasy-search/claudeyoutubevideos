// lin29a · componentes 11-19 (hoteles).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, eio, lerp, rn, cl, tubeG } from "./h3d";
import { HANDF, KeyCard, PI, PriceTag, Sheet, TapeRoll, TapeStrip, fallY, pop, txt } from "./lkit3d";

// ---- 10:27 · PARK & FLY: el avión pasa bajo sobre el hotel del aeropuerto; el ticket une cuarto + estacionamiento en un precio ----
export const HParkFly: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#16202c"
  cam={{ at: [0, 0.16, 0.08], az: [0.2, 0.08], el: [0.28, 0.22], r: [1.0, 0.88], fov: 32 }}>{(tt) => {
  const fly = eio(tt, 0.5, 4.2), px = lerp(-0.7, 0.7, fly), py = 0.26 + 0.06 * Math.sin(PI * fly), merge = eio(tt, 3.0, 4.2);
  return <>
    <group position={[-0.15, 0, -0.1]} scale={[1, pop(tt, 0.1), 1]}><RBox s={[0.3, 0.22, 0.14]} p={[0, 0.11, 0]} r={0.004}><meshStandardMaterial map={txt("aph", Array.from({ length: 5 }, () => "▮ ▮ ▮ ▮ ▮"), { w: 256, h: 192, bg: "#55606f", fg: "#ffd890", size: 30, lh: 36 })} roughness={0.6} /></RBox></group>
    <mesh position={[0.2, 0.001, 0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.3]} />{M.matte({ col: "#2b2e33" })}</mesh>
    {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.05, 0.022, 0.028]} p={[0.04 + (i % 4) * 0.1, 0.012 + fallY(tt, 0.3 + i * 0.08, 0.3), 0.0 + Math.floor(i / 4) * 0.08]} r={0.008}><meshPhysicalMaterial color={["#c9a24a", "#8a2a22", "#e8e6e1", "#2f5d4a", "#3b4a63"][i % 5]} roughness={0.35} clearcoat={1} /></RBox>)}
    {/* el avión */}
    <group position={[px, py, 0.05]} rotation={[0, 0, 0.08 - 0.16 * fly]} scale={2.0}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.022, 0.2, 8, 20]} />{M.porcelain({ col: "#eef0f2" })}</mesh>
      <mesh position={[0.01, 0, 0]} rotation={[PI / 2, 0, 0]}><boxGeometry args={[0.06, 0.26, 0.005]} />{M.porcelain({ col: "#dfe3e8" })}</mesh>
      <mesh position={[-0.11, 0.03, 0]}><boxGeometry args={[0.04, 0.05, 0.004]} />{M.matte({ col: "#1d2f5a" })}</mesh>
    </group>
    {/* las dos etiquetas se juntan en una */}
    <group position={[lerp(-0.2, 0, merge), 0.14, 0.3]} scale={pop(tt, 1.2) * (1 - 0.999 * eio(tt, 3.9, 4.2))}><PriceTag lines={["ROOM"]} s={1.4} /></group>
    <group position={[lerp(0.2, 0, merge), 0.14, 0.3]} scale={pop(tt, 1.6) * (1 - 0.999 * eio(tt, 3.9, 4.2))}><PriceTag lines={["PARKING", "1 week"]} s={1.3} col="#e6f2e6" fg="#2f5d4a" /></group>
    <group position={[0, 0.15, 0.3]} rotation={[0, 0, 0.06 * Math.sin(tt * 2)]} scale={pop(tt, 4.0)}><KeyCard col="#c9a24a" label="PARK & STAY" s={2.4} /></group>
  </>;
}}</Scene3D>;

// ---- 11:33 · LA HABITACIÓN LISTA: el tablero de puertas del pasillo se va poniendo verde y una llave sale gratis ----
export const HRoomBoard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.22, 0], az: [-0.25, 0.1], el: [0.1, 0.15], r: [1.0, 0.85], fov: 30 }}>{(tt) => <>
  {Array.from({ length: 12 }, (_, i) => { const c = i % 4, r = Math.floor(i / 4), ready = tt > 0.8 + rn(i, 4) * 2.4;
    return <group key={i} position={[-0.27 + c * 0.18, 0.09 + r * 0.16, -0.05]} scale={pop(tt, 0.1 + i * 0.04)}>
      <RBox s={[0.12, 0.14, 0.012]} r={0.006}>{M.wood({ base: [96, 62, 36] })}</RBox>
      <mesh position={[0.04, 0, 0.01]}><sphereGeometry args={[0.006, 12, 10]} />{M.brass()}</mesh>
      <mesh position={[0, 0.05, 0.008]}><planeGeometry args={[0.06, 0.018]} /><meshStandardMaterial map={txt("rn" + (300 + i), [String(301 + i)], { w: 128, h: 48, bg: "#d9c9a4", fg: "#2a1c08", size: 38 })} /></mesh>
      <mesh position={[-0.04, 0.02, 0.008]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color={ready ? "#4ef08a" : "#ff4a3a"} toneMapped={false} /></mesh>
    </group>; })}
  <group position={[lerp(0.42, 0.0, eio(tt, 3.6, 4.4)), 0.2, 0.2]} rotation={[0, -0.1, 0.1]} scale={pop(tt, 3.6)}><KeyCard col="#2f5d4a" label="EARLY · $0" s={2.2} /></group>
</>}</Scene3D>;

// ---- 12:40 · EL WI-FI COMPARTIDO: dos aparatos chupan la misma señal; el celular se apaga y la tableta llena sus barras ----
export const HWifi: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.08, 0.04], az: [0.25, -0.05], el: [0.36, 0.3], r: [0.78, 0.68], fov: 30 }}>{(tt) => {
  const off = tt > 2.4, bars = off ? cl((tt - 2.6) / 1.2) : 0.3 + 0.1 * Math.sin(tt * 7);
  return <>
    <group position={[0, 0.03, -0.12]} scale={pop(tt, 0.1)}>
      <RBox s={[0.16, 0.03, 0.1]} r={0.01}>{M.plastic({ col: "#e8e6e1" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, 0.06, -0.04]} rotation={[0, 0, s * 0.2]}><cylinderGeometry args={[0.005, 0.006, 0.1, 12]} />{M.plastic({ col: "#e8e6e1" })}</mesh>)}
      {[0, 1, 2].map((i) => <mesh key={i} position={[-0.05 + i * 0.02, 0.016, 0.051]}><circleGeometry args={[0.004, 12]} /><meshBasicMaterial color="#4ef08a" toneMapped={false} /></mesh>)}
    </group>
    {/* anillos de señal que salen hacia cada aparato */}
    {[0, 1, 2].map((i) => { const k = ((tt * 0.8 + i / 3) % 1); return <mesh key={i} position={[0, 0.06, -0.12]} rotation={[-PI / 2, 0, 0]} scale={0.05 + 0.4 * k}><torusGeometry args={[1, 0.012, 8, 64]} />{M.glow({ col: "#7ac6ff", op: 0.5 * (1 - k) })}</mesh>; })}
    {/* tableta con la videollamada */}
    <group position={[-0.18, 0.09, 0.12]} rotation={[-0.25, 0.35, 0]} scale={pop(tt, 0.4)}>
      <RBox s={[0.2, 0.14, 0.008]} r={0.008}>{M.matte({ col: "#1b1b1f" })}</RBox>
      <mesh position={[0, 0, 0.0045]}><planeGeometry args={[0.185, 0.125]} /><meshStandardMaterial map={txt("call", ["GRANDMA ♥"], { w: 384, h: 256, bg: "#f2d6b8", fg: "#5a3a2a", size: 46 })} emissive="#ffffff" emissiveMap={txt("call", ["GRANDMA ♥"], { w: 384, h: 256, bg: "#f2d6b8", fg: "#5a3a2a", size: 46 })} emissiveIntensity={0.5} /></mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.06 + i * 0.008, -0.045 + i * 0.003, 0.006]}><planeGeometry args={[0.005, 0.008 + i * 0.006]} /><meshBasicMaterial color={i / 4 < bars ? "#4ef08a" : "#3b3f46"} toneMapped={false} /></mesh>)}
    </group>
    {/* el celular que se apaga */}
    <group position={[0.2, 0.006, 0.12]} rotation={[-PI / 2, 0, -0.3]} scale={pop(tt, 0.6)}>
      <RBox s={[0.07, 0.14, 0.008]} r={0.008}>{M.matte({ col: "#202226" })}</RBox>
      <mesh position={[0, 0, 0.0045]}><planeGeometry args={[0.062, 0.128]} /><meshBasicMaterial color={off ? "#050506" : "#5aa8ff"} toneMapped={false} /></mesh>
      <mesh position={[0, 0.03, 0.005]} scale={off ? 0.001 : 1}><planeGeometry args={[0.04, 0.012]} /><meshBasicMaterial map={txt("wf", ["Wi-Fi ON"], { w: 256, h: 64, bg: "#5aa8ff", fg: "#fff", size: 40 })} toneMapped={false} /></mesh>
    </group>
  </>;
}}</Scene3D>;

const Handset: React.FC<{ len?: number }> = ({ len = 0.16 }) => <group>
  <mesh rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.014, len, 8, 16]} />{M.plastic({ col: "#d9cfb9" })}</mesh>
  {[-1, 1].map((s) => <mesh key={s} position={[s * len / 2, -0.012, 0]} castShadow><cylinderGeometry args={[0.026, 0.02, 0.03, 28]} />{M.plastic({ col: "#d9cfb9" })}</mesh>)}
</group>;
const Cord: React.FC<{ a: number[]; b: number[]; id: string }> = ({ a, b, id }) => { const n = 90, pts = Array.from({ length: n }, (_, i) => { const u = i / (n - 1), ang = u * 60; return [lerp(a[0], b[0], u) + 0.008 * Math.cos(ang), lerp(a[1], b[1], u) - 0.04 * Math.sin(PI * u) + 0.008 * Math.sin(ang), lerp(a[2], b[2], u)]; });
  return <mesh geometry={tubeG(id, pts, 0.0025, 400, 6)}>{M.plastic({ col: "#cfc4ac" })}</mesh>; };

// ---- 13:34 · EL TELÉFONO DEL CUARTO: el tubo descolgado y el taxímetro que rueda hasta $80 ----
export const HRoomPhone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.3, 0.05], el: [0.35, 0.28], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const lift = eio(tt, 0.4, 1.1), v = 80 * eio(tt, 1.0, 4.6);
  return <>
    <group position={[-0.12, 0, 0.02]} scale={pop(tt, 0.05)}>
      <RBox s={[0.2, 0.06, 0.16]} p={[0, 0.03, 0]} r={0.02}>{M.plastic({ col: "#d9cfb9" })}</RBox>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.03 + (i % 3) * 0.03, 0.061, 0.035 - Math.floor(i / 3) * 0.022]}><boxGeometry args={[0.02, 0.006, 0.015]} />{M.plastic({ col: "#efe8d8" })}</mesh>)}
      <group position={[0.0, 0.08 + 0.12 * lift, -0.045]} rotation={[0.2 * lift, 0, 0.5 * lift]}>
        <Handset />
      </group>
      <Cord id={"rp" + Math.round(lift * 20)} a={[-0.1, 0.03, 0.06]} b={[-0.08, 0.07 + 0.12 * lift, -0.045]} />
    </group>
    {/* el taxímetro */}
    <group position={[0.14, 0.13, 0.08]} rotation={[0, -0.3, 0]} scale={1.4 * pop(tt, 0.8)}>
      <RBox s={[0.2, 0.09, 0.08]} r={0.012}>{M.matte({ col: "#1b1b1f" })}</RBox>
      <mesh position={[-0.075, 0, 0.041]}><planeGeometry args={[0.03, 0.04]} /><meshStandardMaterial map={txt("dollar", ["$"], { w: 64, h: 96, bg: "#1b1b1f", fg: "#ff5a4a", size: 80 })} /></mesh>
      {[0, 1].map((d) => <DigitDrum key={d} v={d === 0 ? v / 10 : v % 10} p={[-0.03 + d * 0.045, 0, 0.04]} r={0.028} w={0.036} />)}
      <mesh position={[0.07, 0, 0.041]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color={tt % 0.6 < 0.3 ? "#ff3b30" : "#5a1410"} toneMapped={false} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 14:37 · «FRONT DESK ONLY»: la cinta azul cruza el tubo del teléfono con la letra de Linda ----
export const HDeskOnly: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood"
  cam={{ at: [0, 0.09, -0.02], az: [0.15, -0.05], el: [0.75, 0.65], r: [0.7, 0.62], fov: 30 }}>{(tt) => {
  const run = eio(tt, 0.8, 3.0), len = 0.3 * run;
  return <>
    <RBox s={[0.24, 0.06, 0.18]} p={[0, 0.03, 0]} r={0.02}>{M.plastic({ col: "#d9cfb9" })}</RBox>
    <group position={[0, 0.095, -0.03]}><Handset len={0.18} /></group>
    <TapeStrip len={len} w={0.04} p={[-0.15, 0.11, -0.03]} r={[-PI / 2, 0, 0]} label="FRONT DESK ONLY" />
    <TapeRoll p={[-0.15 + len, 0.13, -0.03]} r={[0, run * 6, PI / 2]} s={Math.max(0.001, pop(tt, 0.3) * (1 - eio(tt, 3.1, 3.5)))} />
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.05 + (i % 3) * 0.04, 0.062, 0.03 + Math.floor(i / 3) * 0.022]}><boxGeometry args={[0.026, 0.006, 0.016]} />{M.plastic({ col: "#efe8d8" })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 15:14 · LA DUCHA SIN ESCALÓN: la silla de ruedas entra al plato a ras del piso; la etiqueta de recargo se da vuelta: $0 ----
export const HShower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [0, 0.18, 0], az: [-0.45, -0.2], el: [0.3, 0.25], r: [1.1, 0.95], fov: 30 }}>{(tt) => {
  const roll = eio(tt, 0.8, 3.0), x = lerp(0.42, 0.02, roll), flip = eio(tt, 3.4, 4.2);
  return <>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.4]} />{M.porcelain({ col: "#dfe4e8" })}</mesh>
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02, 24]} />{M.chrome()}</mesh>
    <mesh position={[-0.2, 0.25, -0.1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.3, 16]} />{M.chrome()}</mesh>
    <mesh position={[-0.05, 0.42, -0.19]}><cylinderGeometry args={[0.03, 0.022, 0.015, 28]} />{M.chrome()}</mesh>
    <RBox s={[0.16, 0.012, 0.1]} p={[0.12, 0.2, -0.18]} r={0.004}>{M.wood({ base: [170, 120, 70] })}</RBox>
    {/* la silla de ruedas */}
    <group position={[x, 0, 0.06]} scale={pop(tt, 0.3)}>
      {[-1, 1].map((s) => <mesh key={s} position={[0, 0.07, s * 0.06]} rotation={[0, 0, -roll * 12]}><torusGeometry args={[0.065, 0.006, 10, 40]} />{M.rubber({ col: "#222" })}</mesh>)}
      <RBox s={[0.1, 0.012, 0.12]} p={[-0.01, 0.1, 0]} r={0.004}>{M.matte({ col: "#2b4a7a" })}</RBox>
      <RBox s={[0.012, 0.11, 0.12]} p={[0.05, 0.16, 0]} r={0.004}>{M.matte({ col: "#2b4a7a" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[-0.06, 0.02, s * 0.05]}><sphereGeometry args={[0.015, 12, 10]} />{M.rubber({ col: "#222" })}</mesh>)}
    </group>
    <group position={[0.25, 0.3, 0.1]} rotation={[0, -0.3 + PI * flip, 0]} scale={pop(tt, 1.2)}>
      <PriceTag lines={["+$40", "ACCESSIBLE"]} col="#3a2b28" fg="#ff8a7a" s={1.5} />
      <group rotation={[0, PI, 0]} position={[0, 0, -0.003]}><PriceTag lines={["$0", "EXTRA"]} col="#e6f2e6" fg="#2f5d4a" s={1.5} /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 16:37 · NO REEMBOLSABLE: el botón rojo «SAVE 10%» se hunde y el candado cae y cierra la billetera con los $612 adentro ----
export const HNonRef: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark"
  cam={{ at: [0, 0.08, 0], az: [0.35, 0.1], el: [0.45, 0.36], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const press = Math.sin(PI * cl((tt - 1.0) / 0.5)) * 0.012, lockY = fallY(tt, 1.7, 0.4, 9, 0.35), shut = eio(tt, 2.3, 2.6);
  return <>
    <group position={[-0.17, 0, 0.02]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.07, 0.075, 0.04, 40]} />{M.matte({ col: "#2b2d31" })}</mesh>
      <mesh position={[0, 0.05 - press, 0]}><cylinderGeometry args={[0.055, 0.055, 0.025, 40]} />{M.plastic({ col: "#d9342a" })}</mesh>
      <mesh position={[0, 0.064 - press, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 40]} /><meshStandardMaterial map={txt("save10", ["SAVE", "10%"], { w: 256, h: 256, bg: "#d9342a", fg: "#fff", size: 70 })} /></mesh>
    </group>
    <group position={[0.14, 0, 0]} scale={pop(tt, 0.4)}>
      <RBox s={[0.2, 0.05, 0.12]} p={[0, 0.025, 0]} r={0.012}><meshStandardMaterial color="#6b3e22" roughness={0.6} /></RBox>
      {[0, 1, 2].map((i) => <group key={i} position={[-0.02 + i * 0.02, 0.06 - 0.005 * i, 0]} rotation={[0.2, 0, 0.1 * i]}><Sheet map={txt("b100", ["$612"], { w: 256, h: 112, bg: "#b9c9a4", fg: "#3c5a32", size: 70 })} w={0.11} h={0.048} /></group>)}
      <group position={[0, 0.07 + lockY, 0.065]} scale={pop(tt, 1.6)}>
        <RBox s={[0.06, 0.05, 0.02]} r={0.006}>{M.brass()}</RBox>
        <mesh position={[0, 0.025 + 0.015 * (1 - shut), 0]}><torusGeometry args={[0.02, 0.005, 10, 30, PI]} />{M.steel()}</mesh>
      </group>
    </group>
    <group position={[0.14, 0.2, 0.1]} scale={pop(tt, 2.8)}><PriceTag lines={["NON-", "REFUNDABLE"]} col="#3a2b28" fg="#ff8a7a" s={1.5} /></group>
  </>;
}}</Scene3D>;

// ---- 17:28 · EL PLAZO: el almanaque de escritorio pasa hojas y el reloj corre hasta la marca roja de las 48 horas ----
export const HDeadline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.14, 0], az: [-0.25, 0.1], el: [0.22, 0.2], r: [0.9, 0.78], fov: 30 }}>{(tt) => {
  const pages = Math.min(3, Math.floor(eio(tt, 0.6, 3.0) * 3.999)), flip = (eio(tt, 0.6, 3.0) * 4) % 1, hand = eio(tt, 0.6, 3.6) * 4 * PI;
  const days = ["MON 12", "TUE 13", "WED 14", "THU 15"];
  return <>
    <group position={[-0.13, 0, 0]} scale={pop(tt, 0.1)}>
      <RBox s={[0.18, 0.2, 0.04]} p={[0, 0.1, -0.02]} r={0.01}>{M.matte({ col: "#2b2d31" })}</RBox>
      <Sheet map={txt("cal" + days[pages], [days[pages], pages === 3 ? "ARRIVAL" : ""], { w: 256, h: 256, bg: "#fbf8f0", fg: pages === 3 ? "#b8302a" : "#1d2f5a", size: 54 })} w={0.16} h={0.17} p={[0, 0.1, 0.001]} />
      <group position={[0, 0.185, 0.003]} rotation={[-PI * flip, 0, 0]} scale={flip > 0.02 && flip < 0.98 && tt < 3.0 ? 1 : 0.001}><Sheet map={txt("calp", [""], { w: 64, h: 64, bg: "#efe9dc" })} w={0.16} h={0.17} p={[0, -0.085, 0.001]} /></group>
    </group>
    <group position={[0.15, 0.13, 0]} scale={pop(tt, 0.4)}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.025, 64]} />{M.brass()}</mesh>
      <mesh position={[0, 0, 0.013]}><circleGeometry args={[0.09, 64]} /><meshStandardMaterial map={txt("clk", ["XII", "", "VI"], { w: 256, h: 256, bg: "#f7f3ea", size: 40, lh: 80 })} /></mesh>
      <mesh position={[0, 0, 0.015]} rotation={[0, 0, -hand]}><boxGeometry args={[0.004, 0.07, 0.002]} />{M.matte({ col: "#1b1b1f" })}</mesh>
      <mesh position={[0.06, 0.04, 0.016]} scale={pop(tt, 3.6)}><circleGeometry args={[0.02, 24]} /><meshBasicMaterial color="#ff3b30" toneMapped={false} /></mesh>
    </group>
    <group position={[0.15, 0.27, 0.05]} scale={pop(tt, 3.7)}><PriceTag lines={["48 H", "BEFORE"]} col="#b8302a" fg="#fff4e6" s={1.3} /></group>
  </>;
}}</Scene3D>;

// ---- 18:14 · DENVER: la línea del minibar de $22 late en rojo, una raya la tacha y cae el sello «REMOVED» ----
export const HSignCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="dark"
  cam={{ at: [0, 0.02, 0.0], az: [0.1, -0.05], el: [1.0, 1.1], r: [0.7, 0.6], fov: 30 }}>{(tt) => {
  const strike = eio(tt, 1.6, 2.5), stamp = fallY(tt, 2.8, 0.25, 10, 0.3), pulse = tt < 1.6 ? 0.5 + 0.5 * Math.sin(tt * 8) : 0;
  return <>
    <Sheet map={txt("folio22", ["DENVER · FOLIO", "ROOM  $149", "TAX  $21", "MINIBAR  $22", "PARKING  $0"], { w: 384, h: 512, bg: "#fbf8f0", size: 38, lh: 86, align: "left" })} w={0.24} h={0.32} p={[0, 0.002, 0]} r={[-PI / 2, 0, 0]} s={pop(tt, 0.1)} />
    <mesh position={[0, 0.003, 0.048]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.23, 0.04]} />{M.glow({ col: "#ff5a4a", op: 0.25 * pulse })}</mesh>
    <mesh position={[-0.1 + 0.1 * strike, 0.004, 0.048]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, strike), 1, 1]}><planeGeometry args={[0.2, 0.006]} />{M.glow({ col: "#d9342a" })}</mesh>
    <group position={[0.0, 0.01 + stamp, 0.045]} rotation={[-PI / 2, 0, -0.15]} scale={tt > 2.75 ? 1 : 0.001}>
      <mesh><planeGeometry args={[0.17, 0.06]} /><meshStandardMaterial map={txt("removed", ["REMOVED"], { w: 512, h: 180, bg: "#fbf8f0", fg: "#c0392b", size: 96 })} transparent opacity={0.92} /></mesh>
    </group>
    <group position={[0.17, 0.006, -0.08]} rotation={[-PI / 2, 0, 0.5]} scale={pop(tt, 0.5)}><TapeRoll s={1} /></group>
  </>;
}}</Scene3D>;
