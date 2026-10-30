// lin29b · componentes 11-20 (cruceros)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn, cl, tex } from "./h3d";
import { Coin, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Plane, Sea, Ship, Suitcase } from "./lkit_b";

// ---- 9:12 · PEDIR NO CUESTA NADA: la campana de plata se levanta con resorte y debajo está el bife, $0 ----
export const HCloche: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1b1512" warm={0.8}
  cam={{ at: [0.04, 0.08, 0], az: [-0.15, 0.12], el: [0.36, 0.3], r: [0.44, 0.38], fov: 30 }}>{(tt) => {
  const up = phys(tt, 1.4, 7, 0.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial color="#f4f1ea" roughness={0.9} /></mesh>
    <mesh position={[0, 0.006, 0]} scale={pop(tt, 0.1)}><cylinderGeometry args={[0.13, 0.11, 0.012, 48]} />{M.porcelain()}</mesh>
    <group position={[0, 0.014, 0]} scale={pop(tt, 0.2)}>
      <RBox s={[0.12, 0.025, 0.08]} p={[0, 0.012, 0]} r={0.012}><meshStandardMaterial color="#5a2e18" roughness={0.6} /></RBox>
      {[-0.03, 0, 0.03].map((x) => <mesh key={x} position={[x, 0.0255, 0]} rotation={[-PI / 2, 0, 0.5]}><planeGeometry args={[0.006, 0.07]} />{M.matte({ col: "#2a140a" })}</mesh>)}
      <mesh position={[0.07, 0.01, 0.03]}><sphereGeometry args={[0.012, 14, 10]} />{M.matte({ col: "#3f7a2a" })}</mesh>
    </group>
    <group position={[0.05 * up, 0.012 + 0.22 * up, -0.04 * up]} rotation={[-0.5 * up, 0, 0.3 * up]} scale={pop(tt, 0.3)}>
      <mesh castShadow><sphereGeometry args={[0.12, 48, 24, 0, 2 * PI, 0, PI / 2]} />{M.chrome({ col: "#dfe3e8" })}</mesh>
      <mesh position={[0, 0.125, 0]}><sphereGeometry args={[0.014, 16, 12]} />{M.chrome()}</mesh>
    </group>
    <group position={[0.1, 0.12, 0.06]} scale={pop(tt, 2.4)}><PriceTag lines={["$0", "just ask"]} col="#e6f2e6" fg="#2f5d4a" s={1.1} /></group>
  </>;
}}</Scene3D>;

// la «foto» de un recuerdo de crucero pintada (cielo, mar y una pareja en silueta)
const memTex = (i: number) => tex.text("mem" + i, 256, 192, (g) => {
  const sky = ["#f2a65a", "#8ec3e6", "#e88a6a", "#9fd0c8", "#f4c27a"][i % 5];
  const gr = g.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, sky); gr.addColorStop(1, "#fff4e0"); g.fillStyle = gr; g.fillRect(0, 0, 256, 120);
  g.fillStyle = "#2f6f9a"; g.fillRect(0, 120, 256, 72);
  g.fillStyle = "#1b1b22"; [0, 1].forEach((k) => { const x = 100 + k * 46 + (i % 3) * 8; g.beginPath(); g.arc(x, 92, 13, 0, 2 * PI); g.fill(); g.fillRect(x - 15, 104, 30, 70); });
});
// ---- 10:06 · TU CARA EN LA PARED: los cuadros entran de a uno con su precio; se van todos menos uno ----
export const HFrames: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.16, 0], az: [-0.1, 0.1], el: [0.08, 0.1], r: [0.95, 0.86], fov: 30 }}>{(tt) => {
  const out = eio(tt, 3.6, 4.4);
  return <>
    {Array.from({ length: 6 }, (_, i) => { const x = -0.3 + (i % 3) * 0.3, y = 0.24 - Math.floor(i / 3) * 0.17, keep = i === 1, k = keep ? 0 : out;
      return <group key={i} position={[x * (keep ? 1 - out : 1), (keep ? lerp(y, 0.15, out) : y - 0.5 * k * k), 0.02 + (keep ? 0.12 * out : 0)]} rotation={[0, 0, (rn(i, 2) - 0.5) * 0.06 + k * (i % 2 ? 0.8 : -0.8)]} scale={pop(tt, 0.3 + i * 0.35) * (keep ? 1 + 0.35 * out : 1)}>
        <RBox s={[0.22, 0.15, 0.012]} r={0.004}>{M.wood({ base: [60, 40, 26] })}</RBox>
        <mesh position={[0, 0, 0.0065]}><planeGeometry args={[0.19, 0.12]} /><meshStandardMaterial map={memTex(i)} roughness={0.5} /></mesh>
        {!keep && <group position={[0.08, -0.07, 0.01]} scale={0.8}><PriceTag lines={["$30"]} col="#b8302a" fg="#fff4e6" /></group>}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 11:25 · FUERA DE ESTADOS UNIDOS: el barco cruza la fila de boyas y la tarjeta de Medicare se apaga ----
export const HBorder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#a9cbe0" warm={0.8}
  cam={{ at: [0, 0.08, 0], az: [-0.2, 0.05], el: [0.5, 0.44], r: [1.15, 1.05], fov: 30 }}>{(tt) => {
  const x = lerp(-0.3, 0.3, eio(tt, 0.8, 3.6)), off = cl((x - 0.02) / 0.1);
  return <>
    <Sea t={tt} />
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.06, 0.012 + 0.004 * Math.sin(tt * 3 + i), -0.4 + i * 0.1]} scale={pop(tt, 0.2 + i * 0.06)}><sphereGeometry args={[0.014, 16, 12]} />{M.plastic({ col: i % 2 ? "#f2f2ee" : "#d9342a" })}</mesh>)}
    <group position={[x, 0, -0.03]} scale={0.7 * pop(tt, 0.4)}><Ship /></group>
    <group position={[-0.18, 0.2, 0.18]} rotation={[-0.2, 0.15, -0.05]} scale={1.9 * pop(tt, 0.6)}>
      <RBox s={[0.12, 0.075, 0.003]} r={0.006}><meshStandardMaterial color={off > 0.5 ? "#8c9096" : "#f4f6fa"} roughness={0.6} /></RBox>
      <mesh position={[0, 0, 0.0018]}><planeGeometry args={[0.112, 0.068]} /><meshStandardMaterial transparent opacity={1 - 0.65 * off} map={txt("mcard2", ["MEDICARE", "HEALTH INSURANCE"], { w: 384, h: 224, bg: "#f4f6fa", fg: "#1d3f7a", size: 36, cols: ["#1d3f7a", "#b8302a"] })} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 11:57 · MEDICARE NO PAGÓ NI UN CENTAVO: caen las muletas, la cuenta de $1.900 se desenrolla y el sobre de Medicare queda vacío ----
export const HCrutch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile"
  cam={{ at: [0, 0.2, 0], az: [-0.2, 0.1], el: [0.18, 0.16], r: [1.12, 1.02], fov: 30 }}>{(tt) => {
  const lean = eio(tt, 0.4, 1.2), roll = eio(tt, 1.6, 3.0);
  return <>
    {[-1, 1].map((sd) => <group key={sd} position={[-0.2 + sd * 0.045, 0, -0.05]} rotation={[0, 0, -0.18 * lean + sd * 0.02]} scale={1.5 * pop(tt, 0.2)}>
      {[-0.012, 0.012].map((z) => <mesh key={z} position={[0, 0.17, z]}><cylinderGeometry args={[0.004, 0.004, 0.3, 10]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.33, 0]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.008, 0.03, 6, 12]} />{M.rubber({ col: "#2b2d31" })}</mesh>
      <mesh position={[0, 0.2, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.04, 10]} />{M.rubber({ col: "#2b2d31" })}</mesh>
    </group>)}
    <group position={[0.02, 0.3 - 0.12 * roll, 0]} scale={pop(tt, 1.4)}>
      <Sheet map={txt("medbill3", ["SHIP DOCTOR", "$1,900"], { w: 320, h: 300, bg: "#fbf8f0", size: 40, lh: 120, cols: ["#1d2f5a", "#b8302a"] })} w={0.17} h={0.16 * Math.max(0.05, roll)} />
    </group>
    <group position={[0.13, 0.05, 0.12]} rotation={[0, -0.25, 0]} scale={pop(tt, 3.2)}><PriceTag lines={["MEDICARE", "PAID $0"]} col="#f4f6fa" fg="#b8302a" s={1.6} /></group>
  </>;
}}</Scene3D>;

// ---- 12:18 · EL SEGURO CON EVACUACIÓN: el paraguas se abre con resorte sobre el barquito y la lluvia rebota ----
export const HUmbrella: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#3b4a5a" warm={0.75}
  cam={{ at: [0, 0.15, 0], az: [-0.25, -0.1], el: [0.2, 0.16], r: [1.0, 0.9], fov: 30 }}>{(tt) => {
  const op = Math.max(0.05, phys(tt, 1.2, 8, 0.35));
  return <>
    <Sea t={tt} col="#2c5672" />
    <group position={[0, 0.005 + 0.004 * Math.sin(tt * 2), 0]} scale={0.6 * pop(tt, 0.1)}><Ship /></group>
    <group position={[-0.02, 0.32, 0]} scale={pop(tt, 0.6)}>
      <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.003, 0.003, 0.24, 8]} />{M.steel()}</mesh>
      <mesh scale={[op, 1, op]} castShadow><coneGeometry args={[0.28, 0.1, 8, 1, true]} /><meshStandardMaterial color="#b8302a" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.04 - 0.002, 0]} scale={[op, 1, op]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.28, 0.003, 6, 8]} />{M.steel()}</mesh>
    </group>
    {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 1.4 + rn(i, 1)) % 1, x = (rn(i, 2) - 0.5) * 0.8, z = (rn(i, 3) - 0.5) * 0.5, inside = Math.hypot(x + 0.02, z) < 0.28 * op;
      const y = 0.7 - ph * 0.7; if (inside && y < 0.3) return null;
      return <mesh key={i} position={[x, y, z]}><capsuleGeometry args={[0.0018, 0.02, 2, 6]} />{M.glass({ col: "#cfe8ff", op: 0.6 })}</mesh>; })}
    <group position={[0.24, 0.1, 0.12]} scale={pop(tt, 2.6)}><PriceTag lines={["MEDICAL", "+ EVAC"]} col="#f6f1e4" fg="#1d2f5a" s={1.5} /></group>
  </>;
}}</Scene3D>;

// ---- 12:49 · NO EN LA VALIJA: la valija grande se va por la cinta; la bolsita de remedios salta al bolso de mano ----
export const HPillPouch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.3, -0.15], el: [0.32, 0.28], r: [0.95, 0.85], fov: 30 }}>{(tt) => {
  const belt = eio(tt, 1.4, 4.4), hop = eio(tt, 0.8, 1.5);
  return <>
    <RBox s={[1.2, 0.03, 0.18]} p={[0.25, 0.015, -0.08]} r={0.006}>{M.rubber({ col: "#2b2d31" })}</RBox>
    <group position={[lerp(0.0, 0.6, belt), 0.03, -0.08]} rotation={[0, 0, -PI / 2]} scale={pop(tt, 0.1)}><group rotation={[0, 0, PI / 2]}><Suitcase col="#1d2f5a" s={1.1} /></group></group>
    <group position={[-0.22, 0, 0.1]} scale={pop(tt, 0.3)}>
      <RBox s={[0.16, 0.1, 0.09]} p={[0, 0.05, 0]} r={0.02}><meshStandardMaterial color="#7a5a3a" roughness={0.8} /></RBox>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.05, 0.006, 8, 24, PI]} />{M.matte({ col: "#3a2a1a" })}</mesh>
    </group>
    <group position={[lerp(0.02, -0.22, hop), 0.06 + 0.14 * Math.sin(PI * hop) + 0.04 * (1 - hop), lerp(-0.02, 0.1, hop)]} rotation={[0, 0, 0.6 * Math.sin(PI * hop)]} scale={1.8 * pop(tt, 0.2)}>
      <RBox s={[0.08, 0.04, 0.05]} r={0.015}><meshStandardMaterial color="#d8cdb4" roughness={0.9} /></RBox>
      {[-0.02, 0, 0.02].map((x) => <mesh key={x} position={[x, 0.03, 0]}><cylinderGeometry args={[0.008, 0.008, 0.025, 14]} />{M.plastic({ col: "#e8822a", op: 0.85 })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 13:53 · UN DÍA ANTES: el avión aterriza en el bloque del viernes; el barco espera tranquilo en el del sábado ----
export const HDayBefore: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.06, 0.02], az: [-0.1, 0.05], el: [0.5, 0.44], r: [0.8, 0.72], fov: 30 }}>{(tt) => {
  const land = eio(tt, 1.0, 2.4);
  const Tile: React.FC<{ x: number; d: string; a: number }> = ({ x, d, a }) => <group position={[x, 0, 0]} scale={pop(tt, a)}>
    <RBox s={[0.26, 0.03, 0.22]} p={[0, 0.015, 0]} r={0.01}>{M.porcelain({ col: "#fbf8f0" })}</RBox>
    <mesh position={[0, 0.031, 0.075]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.26, 0.07]} /><meshStandardMaterial map={txt("day" + d, [d], { w: 512, h: 140, bg: "#b8302a", fg: "#fff", size: 90 })} /></mesh>
  </group>;
  return <>
    <Tile x={-0.16} d="FRIDAY" a={0.1} /><Tile x={0.16} d="SATURDAY" a={0.3} />
    <Plane p={[lerp(-0.45, -0.16, land), 0.05 + 0.25 * (1 - land) * (1 - land), -0.04]} r={[0, 0, -0.25 * (1 - land)]} s={0.55 * pop(tt, 0.6)} />
    <group position={[0.16, 0.03, -0.04]} scale={0.42 * pop(tt, 2.6)}><Ship /></group>
    <group position={[-0.06, 0.035, -0.06]} scale={pop(tt, 3.2)}>
      <mesh><boxGeometry args={[0.07, 0.03, 0.03]} />{M.porcelain({ col: "#e9eef3" })}</mesh>
      <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.06, 0.01, 0.025]} />{M.plastic({ col: "#1d2f5a" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 14:45 · ENROLLADO Y APRETADO: cada prenda se enrolla y salta a la bolsa de lavandería transparente ----
export const HRollBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.08, 0], az: [-0.2, 0.1], el: [0.35, 0.3], r: [0.85, 0.76], fov: 30 }}>{(tt) => {
  const cols = ["#f2f0ea", "#8fb3d9", "#d9a0a0", "#2f4a6a", "#c9b38a", "#e8e0f0"];
  return <>
    <group position={[0.15, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.2, 0.2, 0.14]} />{M.glass({ col: "#eaf4ff", op: 0.18 })}</mesh>
      <mesh position={[0, 0.205, 0]}><torusGeometry args={[0.03, 0.004, 8, 20]} />{M.plastic({ col: "#d0d6dc", op: 0.7 })}</mesh>
    </group>
    {cols.map((c, i) => { const a = 0.6 + i * 0.6, r = eio(tt, a, a + 0.3), j = eio(tt, a + 0.3, a + 0.6);
      const x = lerp(-0.18, 0.12 + (i % 2) * 0.06, j), y = 0.02 + 0.16 * Math.sin(PI * j) + j * (0.02 + Math.floor(i / 2) * 0.045), z = lerp(0.02, -0.02 + (i % 2) * 0.02, j);
      return <group key={i} position={[x, y, z]} scale={tt > a - 0.2 ? 1 : 0.001}>
        {r < 0.99 ? <mesh rotation={[-PI / 2, 0, 0]} scale={[1, 1 - 0.8 * r, 1]}><planeGeometry args={[0.13, 0.1]} /><meshStandardMaterial color={c} roughness={0.95} side={THREE.DoubleSide} /></mesh> : null}
        <mesh position={[0, 0.02 * r, 0]} rotation={[0, 0, PI / 2]} scale={Math.max(0.001, r)}><cylinderGeometry args={[0.02, 0.02, 0.12, 20]} /><meshStandardMaterial color={c} roughness={0.95} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 15:00 · SECO A LA MAÑANA: la ropa gotea en la soga del baño; la luna da paso al sol y las gotas paran ----
export const HSoapSink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile"
  cam={{ at: [0.02, 0.2, 0], az: [-0.1, 0.1], el: [0.1, 0.12], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const day = eio(tt, 2.2, 4.0), drip = 1 - day;
  return <>
    <mesh position={[0, 0.3, -0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.7, 8]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
    {[{ x: -0.16, w: 0.06, hh: 0.12, c: "#e8846a" }, { x: -0.06, w: 0.06, hh: 0.12, c: "#e8846a" }, { x: 0.1, w: 0.18, hh: 0.2, c: "#6f95c9" }].map((g, i) =>
      <group key={i} position={[g.x, 0.3 - g.hh / 2, -0.02]} rotation={[0, 0, 0.03 * Math.sin(tt * 1.5 + i)]} scale={pop(tt, 0.2 + i * 0.3)}>
        {[-1, 1].map((sd) => <RBox key={sd} s={[0.008, 0.026, 0.01]} p={[sd * g.w * 0.35, g.hh / 2, 0.004]} r={0.002}>{M.wood({ base: [190, 150, 100] })}</RBox>)}
        <mesh castShadow><planeGeometry args={[g.w, g.hh]} /><meshStandardMaterial color={new THREE.Color(g.c).multiplyScalar(0.75 + 0.25 * day)} roughness={1} side={THREE.DoubleSide} /></mesh>
        {[0, 1].map((k) => { const ph = (tt * 1.2 + k * 0.5 + i * 0.3) % 1; return <mesh key={k} position={[(k - 0.5) * g.w * 0.5, -g.hh / 2 - ph * 0.2, 0]} scale={drip > 0.05 ? drip : 0.001}><sphereGeometry args={[0.009, 12, 10]} />{M.water({ op: 0.85 })}</mesh>; })}
      </group>)}
    <group position={[0.3, lerp(0.42, 0.22, day), -0.2]}><mesh scale={Math.max(0.001, 1 - day)}><sphereGeometry args={[0.035, 24, 18]} />{M.glow({ col: "#dfe6ff" })}</mesh></group>
    <group position={[-0.3, lerp(0.1, 0.42, day), -0.2]}><mesh scale={Math.max(0.001, day)}><sphereGeometry args={[0.045, 24, 18]} />{M.glow({ col: "#ffd27a" })}</mesh></group>
    <group position={[0.24, 0, 0.08]} scale={pop(tt, 0.5)}>
      <mesh position={[0, 0.04, 0]} castShadow><cylinderGeometry args={[0.018, 0.02, 0.08, 20]} />{M.plastic({ col: "#5fb2a8", op: 0.9 })}</mesh>
      <mesh position={[0, 0.088, 0]}><cylinderGeometry args={[0.01, 0.01, 0.016, 16]} />{M.plastic({ col: "#f2f2ee" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 15:36 · ES PUBLICIDAD: en el mapa del puerto, cada tienda «recomendada» se levanta y debajo hay una moneda; cae la calcomanía AD ----
export const HAdMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0, 0.03, 0.02], az: [0.1, -0.05], el: [0.75, 0.68], r: [0.75, 0.67], fov: 30 }}>{(tt) => {
  const mp = tex.text("pmap", 512, 384, (g) => {
    g.fillStyle = "#efe3c4"; g.fillRect(0, 0, 512, 384); g.fillStyle = "#8ec3e6"; g.fillRect(0, 290, 512, 94);
    g.strokeStyle = "#c9b38a"; g.lineWidth = 10; [[0, 120, 512, 120], [0, 220, 512, 220], [140, 0, 140, 290], [330, 0, 330, 290]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
  });
  return <>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={pop(tt, 0.1)}><planeGeometry args={[0.5, 0.375]} /><meshStandardMaterial map={mp} roughness={0.9} /></mesh>
    {[[-0.14, -0.06], [0.04, 0.04], [0.17, -0.08]].map(([x, z], i) => { const a = 0.6 + i * 0.3, lift = eio(tt, 1.6 + i * 0.5, 2.0 + i * 0.5), st = phys(tt, 2.4 + i * 0.5, 9, 0.5);
      return <group key={i}>
        <Coin p={[x, 0.004, z]} s={1.6 * pop(tt, 1.5 + i * 0.5)} />
        <group position={[x, 0.004 + 0.07 * lift, z]} rotation={[0.3 * lift, 0, 0]} scale={pop(tt, a)}>
          <RBox s={[0.06, 0.05, 0.05]} p={[0, 0.025, 0]} r={0.004}>{M.pvc({ col: ["#d9342a", "#2f6f9a", "#3f8f5a"][i] })}</RBox>
          <mesh position={[0, 0.06, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.048, 0.025, 4]} />{M.matte({ col: "#5a3a2a" })}</mesh>
          <mesh position={[0, 0.03, 0.0255]} scale={Math.max(0.001, cl(st))}><planeGeometry args={[0.05, 0.03]} /><meshStandardMaterial map={txt("adst", ["AD"], { w: 128, h: 80, bg: "#f2d23a", fg: "#1b1b1b", size: 64 })} /></mesh>
        </group>
      </group>; })}
  </>;
}}</Scene3D>;
