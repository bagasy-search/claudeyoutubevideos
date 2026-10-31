// lfh29c · componentes únicos 15-21 (el galón que rinde cien lavados, la olla que perfuma, la caja abierta en la heladera, la plata que se limpia sola, el mameluco embarrado, agua fría contra agua caliente, el agua oxigenada que burbujea la sangre).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Jug, SodaBox } from "./ck";

const PI = Math.PI;

// ---- 9:27 · UN GALÓN, CIEN LAVADOS: la jarra sirve tapitas y al lado crece la pila de ropa doblada mientras el contador del tambor llega a 100 ----
export const HGallon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#1e1915" lamp={[0.1, 0.5, 0.3]}
  cam={{ at: [0.04, 0.14, 0], az: [-0.25, 0.1], el: [0.18, 0.14], r: [0.86, 0.74], fov: 30 }}>{(tt) => {
  const n = 100 * eio(tt, 0.4, 4.8), fill = 0.95 - 0.8 * eio(tt, 0.4, 4.8), stack = Math.floor(cl(n / 100) * 12);
  const COLS = ["#f4f1ea", "#a8c4de", "#e8b0b8", "#f2dd8a", "#b8d4a8", "#d9cbb4"];
  return <>
    <group position={[-0.2, 0, 0]} rotation={[0, 0, -0.35 * Math.abs(Math.sin(tt * 2.2)) * (tt < 4.8 ? 1 : 0)]}><Jug s={1.3} fill={fill} liq="#f2ead0" /></group>
    {/* la pila de ropa doblada que sube */}
    {Array.from({ length: stack }, (_, i) => <RBox key={i} s={[0.16, 0.022, 0.12]} p={[0.08 + 0.004 * Math.sin(i * 2), 0.011 + i * 0.023, 0]} r={0.008}><meshStandardMaterial color={COLS[i % 6]} roughness={0.95} /></RBox>)}
    {/* contador de tambores en una plaquita de madera, adelante */}
    <RBox s={[0.16, 0.07, 0.03]} p={[0.28, 0.035, 0.08]} r={0.006}>{M.wood({ base: [120, 80, 46] })}</RBox>
    {[0, 1, 2].map((d) => { const v = d === 0 ? Math.floor(n / 100) : d === 1 ? Math.floor(n / 10) % 10 + (n % 10 > 9 ? n % 10 - 9 : 0) : n % 10; return <DigitDrum key={d} v={v} p={[0.24 + d * 0.04, 0.045, 0.1]} r={0.022} w={0.034} />; })}
  </>;
}}</Scene3D>;

// ---- 9:49 · LA OLLITA QUE PERFUMA: caen la naranja, la canela y los clavos al agua y el vapor sube en espirales por la cocina ----
export const HSimmerpot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#1a1512" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0, 0.14, 0], az: [0.2, -0.05], el: [0.42, 0.34], r: [0.66, 0.56], fov: 30 }}>{(tt) => {
  const drops = [0.3, 0.9, 1.5, 1.8, 2.1].map((a) => phys(tt, a, 7, 0.45)), steam = eio(tt, 1.6, 3.4);
  return <>
    {/* hornalla con la llama azul */}
    <RBox s={[0.7, 0.04, 0.5]} p={[0, -0.02, 0]} r={0.01}>{M.porcelain({ col: "#ece6da" })}</RBox>
    {Array.from({ length: 18 }, (_, i) => { const a = i * PI / 9; return <mesh key={i} position={[Math.cos(a) * 0.09, 0.008, Math.sin(a) * 0.09]} scale={[1, 1.6 + 0.3 * Math.sin(tt * 12 + i), 1]}><coneGeometry args={[0.007, 0.018, 8]} />{M.glow({ col: "#5aa0ff", op: 0.8 })}</mesh>; })}
    {/* olla esmaltada roja con agua */}
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.13, 0.12, 0.14, 48, 1, true]} /><meshPhysicalMaterial color="#b8322a" roughness={0.25} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.15, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.005, 8, 48]} />{M.steel()}</mesh>
    <mesh position={[0, 0.13, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.125, 48]} />{M.water({ op: 0.75, col: "#c88a4a" })}</mesh>
    {/* rodajas de naranja, ramita de canela, clavos */}
    {[0, 1].map((i) => <mesh key={i} position={[-0.04 + i * 0.07, lerp(0.45, 0.133, drops[i]), 0.01 - i * 0.03]} rotation={[-PI / 2 + 0.1, 0, i]}><cylinderGeometry args={[0.035, 0.035, 0.008, 24]} /><meshStandardMaterial map={tex.text("orange", 128, 128, (g) => { g.fillStyle = "#e8741e"; g.beginPath(); g.arc(64, 64, 63, 0, 6.3); g.fill(); g.fillStyle = "#f6a43a"; g.beginPath(); g.arc(64, 64, 54, 0, 6.3); g.fill(); g.strokeStyle = "#fbd28a"; g.lineWidth = 4; for (let k = 0; k < 10; k++) { const a = k * PI / 5; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.cos(a) * 54, 64 + Math.sin(a) * 54); g.stroke(); } })} roughness={0.5} /></mesh>)}
    <mesh position={[0.02, lerp(0.45, 0.136, drops[2]), 0.05]} rotation={[PI / 2, 0, 0.6]}><cylinderGeometry args={[0.008, 0.008, 0.11, 12]} /><meshStandardMaterial color="#7a4222" roughness={0.9} /></mesh>
    {[3, 4].map((j) => [0, 1, 2].map((k) => <mesh key={j + "" + k} position={[-0.05 + k * 0.03 + (j - 3) * 0.012, lerp(0.45, 0.134, drops[j]), -0.05 + (j - 3) * 0.02]} rotation={[k, j, 0]}><cylinderGeometry args={[0.002, 0.0025, 0.016, 6]} /><meshStandardMaterial color="#3a2012" /></mesh>))}
    {/* vapor en espirales */}
    {[0, 1, 2, 3].map((i) => <mesh key={i} visible={steam > 0.05} geometry={tubeG("steam" + i + Math.round(tt * 10), Array.from({ length: 8 }, (_, k) => [Math.sin(k * 0.9 + tt * 1.4 + i * 1.6) * 0.04 * (1 + k * 0.2) + (i - 1.5) * 0.04, 0.16 + k * 0.05 * steam, Math.cos(k * 0.7 + i) * 0.03]), (u) => 0.008 * (1 - u * 0.7), 40, 8)}><meshStandardMaterial color="#ffffff" transparent opacity={0.22 * steam} depthWrite={false} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 10:05 · LA CAJA ABIERTA EN LA HELADERA: se abre la solapa y los hilos de olor de los frascos se doblan hacia la caja y desaparecen ----
export const HFridgebox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#232b30" key1={[0.2, 1.4, 1.4]}
  cam={{ at: [0, 0.1, 0], az: [-0.15, 0.12], el: [0.12, 0.08], r: [0.7, 0.6], fov: 30 }}>{(tt) => {
  const open = eio(tt, 0.3, 1.0), pull = eio(tt, 1.4, 4.6);
  const SRC = [[-0.24, 0.12, 0.02], [0.22, 0.1, 0.04], [-0.12, 0.3, -0.05], [0.16, 0.32, -0.04]];
  return <>
    {/* interior blanco de heladera vieja con dos estantes de alambre */}
    <RBox s={[0.7, 0.5, 0.02]} p={[0, 0.2, -0.16]} r={0.01}>{M.porcelain({ col: "#a9c8c2" })}</RBox>
    {[-0.36, 0.36].map((x) => <RBox key={x} s={[0.02, 0.5, 0.34]} p={[x, 0.2, 0]} r={0.01}>{M.porcelain({ col: "#98b9b3" })}</RBox>)}
    {[0.0, 0.21].map((y) => Array.from({ length: 12 }, (_, i) => <mesh key={y + "" + i} position={[0, y, -0.15 + i * 0.027]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.002, 0.002, 0.7, 6]} />{M.chrome()}</mesh>))}
    {/* lo que hay: una cebolla cortada, un plato de pescado, un frasco de pepinos, queso */}
    <mesh position={[-0.24, 0.035, 0.02]}><sphereGeometry args={[0.035, 20, 14, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#e9d9e6" roughness={0.6} /></mesh>
    <mesh position={[0.22, 0.012, 0.04]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 32]} />{M.porcelain({ col: "#d9e6f2" })}</mesh>
    <mesh position={[0.22, 0.02, 0.04]} scale={[1.6, 0.4, 0.6]}><sphereGeometry args={[0.03, 16, 10]} /><meshStandardMaterial color="#c8b8a8" roughness={0.4} /></mesh>
    <mesh position={[-0.12, 0.26, -0.05]}><cylinderGeometry args={[0.035, 0.035, 0.09, 24]} />{M.glass({ op: 0.4, col: "#b8d49a" })}</mesh>
    <RBox s={[0.08, 0.04, 0.06]} p={[0.16, 0.235, -0.04]} r={0.004}><meshStandardMaterial color="#f2c84a" roughness={0.6} /></RBox>
    {/* la caja de bicarbonato que se abre en el medio del estante */}
    <group position={[0.0, 0.002, 0.06]} scale={1.0}><SodaBox open={open} /></group>
    {/* hilos de olor verdosos: ondean, después se doblan hacia la caja y se acortan */}
    {SRC.map(([x, y, z], i) => { const tx = 0, ty = 0.11, tz = 0.06, len = 1 - pull * 0.85; const pts = Array.from({ length: 6 }, (_, k) => { const u = k / 5; const fx = lerp(x, lerp(x, tx, pull), u), fy = lerp(y, lerp(y + 0.15, ty, pull), u), fz = lerp(z, tz, u * pull); return [fx + Math.sin(tt * 3 + k + i) * 0.015 * (1 - pull), fy, fz]; });
      return <mesh key={i} visible={len > 0.04} geometry={tubeG("odor" + i + Math.round(tt * 12), pts, (u) => 0.006 * (1 - u * 0.5) * len, 30, 6)}><meshStandardMaterial color="#7fbf2a" emissive="#4a7a10" emissiveIntensity={0.5} transparent opacity={0.8 * len + 0.15} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 10:54 · LA PLATA SE LIMPIA SOLA: el tenedor negro baja al agua con bicarbonato sobre papel de aluminio y sale brillando ----
export const HSilverbath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#1c1a18" key1={[-0.5, 1.6, 1.2]}
  cam={{ at: [0, 0.07, 0.02], az: [0.25, 0.1], el: [0.5, 0.42], r: [0.74, 0.64], fov: 30 }}>{(tt) => {
  const dip = eio(tt, 0.3, 1.2) * (1 - eio(tt, 4.0, 4.8)), clean = eio(tt, 1.4, 3.8), cq = Math.round(clean * 10) / 10;
  const silver = `rgb(${lerp(40, 222, cq) | 0},${lerp(36, 224, cq) | 0},${lerp(32, 228, cq) | 0})`;
  return <>
    {/* fuente de vidrio forrada de aluminio arrugado, con agua caliente */}
    <RBox s={[0.46, 0.05, 0.28]} p={[0, 0.02, 0]} r={0.012}>{M.glass({ op: 0.35, col: "#cfe0e6" })}</RBox>
    <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.24, 30, 20]} /><meshStandardMaterial map={tex.text("foilc", 256, 256, (g) => { g.fillStyle = "#c9ced3"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 160; i++) { g.strokeStyle = rn(i, 2) > 0.5 ? "rgba(255,255,255,.6)" : "rgba(90,96,104,.5)"; g.beginPath(); g.moveTo(rn(i, 3) * 256, rn(i, 4) * 256); g.lineTo(rn(i, 5) * 256, rn(i, 6) * 256); g.stroke(); } })} metalness={0.9} roughness={0.3} /></mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.24]} />{M.water({ op: 0.5, col: "#bcd4e2" })}</mesh>
    {/* burbujitas en el agua mientras reacciona */}
    {Array.from({ length: 40 }, (_, i) => { const u = (tt * 0.8 + rn(i, 2)) % 1; return <mesh key={i} visible={dip > 0.8 && clean < 0.98} position={[-0.18 + rn(i, 3) * 0.36, 0.01 + u * 0.035, (rn(i, 4) - 0.5) * 0.12]}><sphereGeometry args={[0.004, 8, 6]} />{M.glass({ op: 0.6 })}</mesh>; })}
    {/* el tenedor: mango y cuatro dientes, de negro a plata */}
    <group position={[0.02, lerp(0.16, 0.035, dip), 0.02]} rotation={[0, 0.3, -0.1 + 0.1 * dip]} scale={2.3}>
      <RBox s={[0.17, 0.006, 0.022]} p={[0.05, 0, 0]} r={0.003}><meshStandardMaterial color={silver} metalness={1} roughness={lerp(0.7, 0.12, clean)} /></RBox>
      <RBox s={[0.045, 0.005, 0.03]} p={[-0.055, 0, 0]} r={0.003}><meshStandardMaterial color={silver} metalness={1} roughness={lerp(0.7, 0.12, clean)} /></RBox>
      {[-0.011, -0.0037, 0.0037, 0.011].map((z) => <RBox key={z} s={[0.05, 0.004, 0.004]} p={[-0.1, 0, z]} r={0.0015}><meshStandardMaterial color={silver} metalness={1} roughness={lerp(0.7, 0.12, clean)} /></RBox>)}
    </group>
    {/* un destello cuando sale limpio */}
    <mesh visible={tt > 4.6} position={[0.02, 0.2, 0.02]} rotation={[0, 0, tt]} scale={eio(tt, 4.6, 5.0) * (1 - eio(tt, 5.0, 5.5)) + 0.001}><octahedronGeometry args={[0.02, 0]} />{M.glow({ col: "#ffffff" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 11:26 · PASTO EN LAS RODILLAS, BARRO EN TODO: el mameluco de jean tendido en la mesa y las manchas que aparecen de a una ----
const SPL = [[-0.06, -0.12, "#4f8a2a", 0.03], [0.07, -0.12, "#4f8a2a", 0.028], [-0.02, 0.06, "#6a4628", 0.04], [0.09, 0.0, "#6a4628", 0.024], [-0.1, -0.22, "#6a4628", 0.03], [0.04, 0.12, "#6a4628", 0.022], [0.0, -0.28, "#5a3a20", 0.035]] as const;
export const HStains: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#1c1814" key1={[-0.4, 1.8, 1.0]}
  cam={{ at: [0, 0, -0.04], az: [0.05, -0.05], el: [1.15, 1.05], r: [0.86, 0.76], fov: 30 }}>{(tt) => {
  const denim = tex.text("denim", 256, 256, (g) => { g.fillStyle = "#3d5f8c"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(220,230,240,.18)"; for (let i = -256; i < 256; i += 5) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); } });
  return <>
    {/* el mameluco: pechera, tiradores y dos piernas */}
    <group position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]}>
      <RBox s={[0.16, 0.12, 0.012]} p={[0, 0.15, 0.006]} r={0.005}><meshStandardMaterial map={denim} roughness={0.9} /></RBox>
      <RBox s={[0.26, 0.13, 0.016]} p={[0, 0.04, 0.008]} r={0.007}><meshStandardMaterial map={denim} roughness={0.9} /></RBox>
      {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.068, -0.17, 0.008]} rotation={[0, 0, sd * 0.05]}>
        <RBox s={[0.12, 0.32, 0.016]} p={[0, 0, 0]} r={0.007}><meshStandardMaterial map={denim} roughness={0.9} /></RBox>
        {/* arrugas de la tela */}
        {[-0.1, -0.03, 0.05, 0.12].map((y, j) => <mesh key={j} position={[0, y, 0.009]} rotation={[0, PI / 2, 0.15 * sd]} scale={[1, 1, 1]}><cylinderGeometry args={[0.004, 0.004, 0.1, 8]} /><meshStandardMaterial color="#35557e" roughness={0.9} /></mesh>)}
        {/* la costura del costado */}
        <mesh position={[sd * 0.056, 0, 0.0085]}><planeGeometry args={[0.003, 0.3]} /><meshStandardMaterial color="#d8a04a" roughness={0.8} /></mesh>
      </group>)}
      {[-1, 1].map((sd) => <mesh key={"t" + sd} position={[sd * 0.06, 0.27, 0]} rotation={[0, 0, sd * 0.25]}><planeGeometry args={[0.03, 0.16]} /><meshStandardMaterial map={denim} roughness={0.9} /></mesh>)}
      {[-1, 1].map((sd) => <mesh key={"b" + sd} position={[sd * 0.06, 0.2, 0.001]}><circleGeometry args={[0.009, 16]} />{M.brass()}</mesh>)}
      {/* las manchas: verde de pasto en las rodillas, barro por todos lados */}
      {SPL.map(([x, y, c, r], i) => { const k = phys(tt, 0.4 + i * 0.55, 8, 0.45); return <group key={i} position={[x, y, 0.002]} scale={Math.max(0.001, k)}>
        <mesh position={[0, 0, 0.018]}><planeGeometry args={[r * 3.2, r * 3.2]} /><meshStandardMaterial map={tex.text("splat" + i, 128, 128, (g) => { g.fillStyle = c; for (let j = 0; j < 26; j++) { const a = rn(i * 40 + j, 2) * 6.3, d = rn(i * 40 + j, 3) * 34; g.globalAlpha = 0.35 + rn(i * 40 + j, 4) * 0.4; g.beginPath(); g.ellipse(64 + Math.cos(a) * d, 64 + Math.sin(a) * d, 8 + rn(i * 40 + j, 5) * 18, 6 + rn(i * 40 + j, 6) * 12, a, 0, 6.3); g.fill(); } g.globalAlpha = 1; })} transparent roughness={1} depthWrite={false} /></mesh>
      </group>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 11:42 · CALIENTE FIJA, FRÍA SACA: dos palanganas con el mismo trapo manchado; en la caliente la mancha se vuelve marrón y queda, en la fría se va ----
export const HColdwater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#1a1715" key1={[-0.3, 1.8, 1.0]}
  cam={{ at: [0, 0.02, 0], az: [0.0, 0.05], el: [0.75, 0.66], r: [0.78, 0.68], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.8, 4.4);
  return <>
    {[-1, 1].map((sd) => { const hot = sd < 0; return <group key={sd} position={[sd * 0.2, 0, 0]}>
      {/* palangana enlozada con borde azul */}
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.16, 0.12, 0.08, 48, 1, true]} />{M.porcelain({ col: "#f2f0ea", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.08, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.16, 0.006, 8, 48]} /><meshStandardMaterial color="#2d5d9a" /></mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.15, 48]} />{M.water({ op: 0.45, col: hot ? "#f2c8a8" : "#a8d4f2" })}</mesh>
      {/* el trapo blanco en el agua con la mancha */}
      <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.16, 0.14]} /><meshStandardMaterial color="#f8f6f0" roughness={0.95} /></mesh>
      <mesh position={[0, 0.047, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.04, 24]} /><meshStandardMaterial color={hot ? `rgb(${lerp(178, 110, k) | 0},${lerp(30, 56, k) | 0},${lerp(36, 30, k) | 0})` : "#b21e24"} roughness={1} transparent opacity={hot ? 0.9 : 0.9 * (1 - k)} /></mesh>
      {/* vapor rojizo a la izquierda, cubitos de hielo a la derecha */}
      {hot ? [0, 1, 2].map((i) => <mesh key={i} geometry={tubeG("hotst" + i + Math.round(tt * 10), Array.from({ length: 6 }, (_, j) => [Math.sin(j + tt * 1.6 + i * 2) * 0.03 + (i - 1) * 0.05, 0.08 + j * 0.035, 0]), (u) => 0.006 * (1 - u * 0.6), 30, 6)}><meshStandardMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} /></mesh>)
        : [0, 1, 2].map((i) => <RBox key={i} s={[0.03, 0.026, 0.03]} p={[-0.07 + i * 0.06, 0.066 + 0.003 * Math.sin(tt * 2 + i), 0.08 - i * 0.05]} rot={[0.2, i, 0.1]} r={0.006}>{M.glass({ op: 0.55, col: "#e8f6ff" })}</RBox>)}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 12:03 · EL AGUA OXIGENADA: la botella marrón vierte sobre la mancha de sangre y la espuma blanca la levanta ----
export const HPeroxide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1e1b19" key1={[-0.4, 1.6, 1.0]}
  cam={{ at: [0, 0.02, 0], az: [0.25, 0.1], el: [0.62, 0.52], r: [0.5, 0.42], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.4, 1.6), foam = eio(tt, 1.0, 2.6) * (1 - eio(tt, 3.8, 5.0)), gone = eio(tt, 1.6, 4.4);
  return <>
    <RBox s={[0.7, 0.02, 0.5]} p={[0, -0.01, 0]} r={0.004}><meshStandardMaterial map={tex.text("chambray", 128, 128, (g) => { g.fillStyle = "#5f80a6"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "rgba(180,170,150,.25)"; for (let i = 0; i < 128; i += 3) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); } })} roughness={0.95} /></RBox>
    {/* la mancha de sangre: se achica y se aclara */}
    <mesh position={[0, 0.0012, 0]} rotation={[-PI / 2, 0, 0.4]} scale={[1.3 * (1 - gone * 0.85) + 0.001, 1 - gone * 0.85 + 0.001, 1]}><circleGeometry args={[0.07, 24]} /><meshStandardMaterial color="#8e1a1e" roughness={1} transparent opacity={0.92 * (1 - gone * 0.7)} /></mesh>
    {/* la espuma: burbujas blancas que crecen encima y se rosan un poco */}
    {Array.from({ length: 80 }, (_, i) => { const a = i * 2.4, r = 0.075 * Math.sqrt((i + 0.5) / 80); return <mesh key={i} visible={foam > 0.02 && i / 80 < foam * 1.1} position={[Math.cos(a) * r * 1.3, 0.004 + 0.012 * foam * (1 - r / 0.075), Math.sin(a) * r]}><sphereGeometry args={[0.005 + 0.006 * rn(i, 2), 10, 8]} /><meshPhysicalMaterial color={rn(i, 3) > 0.7 ? "#f6dcdc" : "#ffffff"} roughness={0.15} clearcoat={1} transparent opacity={0.9} /></mesh>; })}
    {/* la botella marrón de agua oxigenada inclinada */}
    <group visible={tt < 2.0} position={[0.05, 0.22, 0]} rotation={[0, 0, 2.2 * pour]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.03, 0.12, 28]} /><meshPhysicalMaterial color="#5a2a10" roughness={0.15} clearcoat={1} transparent opacity={0.9} /></mesh>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.012, 0.022, 0.03, 20]} /><meshPhysicalMaterial color="#5a2a10" roughness={0.15} clearcoat={1} /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0305, 0.0305, 0.05, 28, 1, true]} /><meshStandardMaterial color="#f4f1ea" roughness={0.9} /></mesh>
    </group>
    <mesh visible={pour > 0.4 && tt < 1.9} position={[0.0, 0.1, 0]}><cylinderGeometry args={[0.004, 0.005, 0.2, 8]} />{M.water({ op: 0.6, col: "#eef4f8" })}</mesh>
  </>;
}}</Scene3D>;
