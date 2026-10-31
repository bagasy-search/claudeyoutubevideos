// lfh29e · componentes únicos 22-28 (los cuencos de duraznos, el mapa de criaderos, la baba del caño, la cinta en la rejilla, cada dos días, el frasquito de jalea, la mosca que camina sobre el vinagre)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, rn, tex, tubeG } from "./h3d";
import { Fly } from "./ek";
import { Jar } from "./ck";

const PI = Math.PI;
const Peach: React.FC<{ s?: number; ripe?: number }> = ({ s = 1, ripe = 0 }) => <group scale={s}>
  <mesh scale={[1, 0.95, 1]}><sphereGeometry args={[0.03, 24, 18]} /><meshPhysicalMaterial color={new THREE.Color("#f2a24a").lerp(new THREE.Color("#8a4a24"), ripe)} roughness={0.7} sheen={1} sheenColor="#ffd2a0" /></mesh>
  <mesh position={[0.012, 0.012, 0.022]} scale={[1, 1, 0.4]}><sphereGeometry args={[0.016, 14, 10]} /><meshStandardMaterial color="#d8442a" roughness={0.7} transparent opacity={0.7} /></mesh>
  <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.002, 0.002, 0.01, 6]} /><meshStandardMaterial color="#4a3020" /></mesh>
</group>;
const Swarm: React.FC<{ n: number; c: number[]; r: number; t: number; k?: number; seed?: number }> = ({ n, c, r, t, k = 1, seed = 0 }) => <>
  {Array.from({ length: n }, (_, i) => { const a = t * (1.2 + rn(i + seed, 2)) + i * 2.4, y = Math.sin(t * 2 + i) * r * 0.5; return <group key={i} visible={i / n < k} position={[c[0] + Math.cos(a) * r * rn(i + seed, 3), c[1] + y, c[2] + Math.sin(a) * r * rn(i + seed, 4)]} rotation={[0, -a, 0]}><Fly s={2} t={t + i} /></group>; })}
</>;

// ---- 16:16 · LAS NUBES SOBRE LOS DURAZNOS: tres cuencos en la mesada de agosto y la nube de mosquitas que crece sobre cada uno ----
export const HPeachbowls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" key1={[-0.7, 1.6, 1.3]} warm={1}
  cam={{ at: [0, 0.08, 0], az: [-0.25, 0.15], el: [0.32, 0.24], r: [0.82, 0.7], fov: 30 }}>{(tt) => {
  const grow = eio(tt, 0.8, 5.4);
  return <>
    {[-0.22, 0, 0.22].map((x, i) => <group key={i} position={[x, 0, (i % 2) * 0.06]}>
      <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.09, 32, 16, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain({ col: ["#e8c24a", "#5a8ab8", "#d8604a"][i], side: THREE.DoubleSide })}</mesh>
      {Array.from({ length: 6 }, (_, j) => <group key={j} position={[Math.cos(j * 1.1) * 0.04 * (j ? 1 : 0), 0.04 + 0.02 * (j % 2), Math.sin(j * 1.1) * 0.04 * (j ? 1 : 0)]}><Peach s={1.1} ripe={0.2 * grow * (j % 3 === 0 ? 1 : 0)} /></group>)}
      <Swarm n={18} c={[0, 0.16, 0]} r={0.06 + 0.04 * grow} t={tt} k={0.15 + 0.85 * grow} seed={i * 30} />
    </group>)}
  </>;
}}</Scene3D>;

// ---- 16:37 · EL MAPA DE LOS CRIADEROS: la cocina vista de arriba; cada lugar húmedo y dulce se prende y suelta su nubecita ----
export const HBreedmap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#181410" key1={[-0.4, 1.8, 0.8]}
  cam={{ at: [0, 0, 0.02], az: [0.0, 0.15], el: [1.15, 1.0], r: [0.95, 0.8], fov: 30 }}>{(tt) => {
  const SPOTS = [{ p: [-0.24, 0, -0.12], col: "#e8c24a", s: [0.08, 0.04, 0.05] }, { p: [0.0, 0, -0.16], col: "#b58a5a", s: [0.06, 0.05, 0.06] }, { p: [0.24, 0, -0.1], col: "#4a8a5a", s: [0.06, 0.08, 0.06] }, { p: [-0.18, 0, 0.14], col: "#8a8f94", s: [0.07, 0.03, 0.07] }, { p: [0.18, 0, 0.14], col: "#d8d0c0", s: [0.05, 0.05, 0.05] }];
  return <>
    {/* la planta de la cocina: piso a cuadros y mesadas en L */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.9, 0.6]} /><meshStandardMaterial map={tex.text("lino2", 256, 256, (g) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#d6c6a0" : "#a8865a"; g.fillRect(x * 32, y * 32, 32, 32); } })} roughness={0.6} /></mesh>
    <RBox s={[0.84, 0.03, 0.12]} p={[0, 0.015, -0.24]} r={0.004}><meshStandardMaterial map={tex.counter(4, 1)} roughness={0.5} /></RBox>
    {/* los cinco criaderos: bananas, papa blanda, botella de jugo, rejilla, trapo */}
    {SPOTS.map((s, i) => { const on = eio(tt, 0.5 + i * 0.9, 1.1 + i * 0.9); return <group key={i} position={s.p as [number, number, number]}>
      <RBox s={s.s as [number, number, number]} p={[0, (s.s[1]) / 2 + 0.03 * (i < 3 ? 1 : 0), 0]} r={0.01}><meshStandardMaterial color={s.col} roughness={0.6} /></RBox>
      {i === 0 && [0, 1, 2].map((k) => <mesh key={k} position={[-0.02 + k * 0.02, 0.07, 0]} rotation={[0, 0, 0.6 - k * 0.3]} scale={[0.4, 1.6, 0.4]}><sphereGeometry args={[0.02, 12, 10]} /><meshStandardMaterial color="#6a4a1e" roughness={0.6} /></mesh>)}
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={on + 0.001}><ringGeometry args={[0.06, 0.07, 40]} /><meshBasicMaterial color="#e84a2a" transparent opacity={0.8 * on} /></mesh>
      <Swarm n={8} c={[0, 0.12, 0]} r={0.04} t={tt} k={on} seed={i * 20} />
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 17:38 · LA BABA DEL CAÑO: corte del sifón; la capa marrón crece en la pared y las mosquitas salen de ella ----
export const HDrainslime: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#14161a" key1={[-0.5, 1.4, 1.6]}
  cam={{ at: [0, 0.04, 0], az: [0.1, -0.1], el: [0.08, 0.04], r: [0.72, 0.62], fov: 30 }}>{(tt) => {
  const slime = eio(tt, 0.6, 3.2), out = eio(tt, 3.0, 5.6);
  const pts = [[-0.08, 0.32, 0], [-0.08, 0.08, 0], [-0.06, -0.04, 0], [0.04, -0.08, 0], [0.12, -0.02, 0], [0.13, 0.08, 0], [0.3, 0.1, 0]];
  return <>
    {/* el sifón de caño en corte: medio caño gris claro */}
    <mesh geometry={tubeG("trap", pts, 0.045, 80, 24)}><meshStandardMaterial color="#c9cdd0" roughness={0.4} side={THREE.BackSide} /></mesh>
    <mesh position={[0, 0.0, 0.03]} geometry={tubeG("trap", pts, 0.045, 80, 24)}><meshStandardMaterial color="#e2e4e6" roughness={0.4} transparent opacity={0.22} depthWrite={false} /></mesh>
    {/* la capa de baba marrón que engorda adentro */}
    <mesh geometry={tubeG("slime" + Math.round(slime * 20), pts, 0.045 - 0.0001, 80, 24)} scale={1}><meshStandardMaterial color="#5a3a1a" roughness={0.3} transparent opacity={0.85 * slime} side={THREE.BackSide} depthWrite={false} /></mesh>
    {Array.from({ length: 24 }, (_, i) => { const p = pts[1 + (i % 5)], u = rn(i, 2); return <mesh key={i} position={[p[0] + (u - 0.5) * 0.05, p[1] + (rn(i, 3) - 0.5) * 0.06, -0.025]} scale={slime + 0.001}><sphereGeometry args={[0.008 + 0.006 * rn(i, 4), 10, 8]} /><meshPhysicalMaterial color="#6a4a1e" roughness={0.15} clearcoat={1} /></mesh>; })}
    {/* la rejilla arriba y las mosquitas que suben por el caño y salen */}
    <mesh position={[-0.08, 0.33, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.05, 32]} />{M.chrome()}</mesh>
    {Array.from({ length: 12 }, (_, i) => { const u = cl(out * 1.6 - i * 0.05), y = lerp(-0.02, 0.42 + rn(i, 2) * 0.1, u); return <group key={i} visible={u > 0 && u < 1} position={[-0.08 + Math.sin(tt * 3 + i) * 0.02 + (y > 0.34 ? (rn(i, 3) - 0.5) * (y - 0.34) * 2 : 0), y, 0]}><Fly s={2.2} t={tt + i} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 18:31 · LA CINTA EN LA REJILLA: se pega cinta transparente sobre la rejilla a la noche; a la mañana tiene mosquitas pegadas ----
export const HTapetest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16181c" key1={[-0.5, 1.6, 1.0]}
  cam={{ at: [0, 0, 0], az: [0.2, -0.05], el: [0.95, 0.8], r: [0.46, 0.38], fov: 30 }}>{(tt) => {
  const lay = eio(tt, 0.4, 1.6), night = eio(tt, 1.8, 2.6) * (1 - eio(tt, 3.4, 4.0)), stuck = Math.floor(eio(tt, 2.4, 3.6) * 7);
  return <>
    {/* el fondo de la pileta de acero y la rejilla */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.6]} /><meshStandardMaterial color="#7a8288" metalness={0.6} roughness={0.35} /></mesh>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshStandardMaterial color="#0e0e0e" /></mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.065, 40]} />{M.chrome()}</mesh>
    {[-0.025, 0, 0.025].map((x) => <mesh key={x} position={[x, 0.003, 0]}><boxGeometry args={[0.005, 0.002, 0.1]} />{M.chrome()}</mesh>)}
    {/* la cinta que se desenrolla encima */}
    <mesh position={[lerp(-0.1, 0, lay) - 0.0, 0.006, 0]} rotation={[-PI / 2, 0, 0]} scale={[lay + 0.001, 1, 1]}><planeGeometry args={[0.2, 0.05]} /><meshPhysicalMaterial color="#f8f4e0" roughness={0.05} clearcoat={1} transparent opacity={0.45} depthWrite={false} /></mesh>
    {/* la noche: oscuridad con una luna en el vidrio de la ventana (reflejo) */}
    <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#04060c" transparent opacity={0.75 * night} depthWrite={false} /></mesh>
    <mesh position={[0.2, 0.025, -0.14]}><sphereGeometry args={[0.025, 16, 12]} />{M.glow({ col: "#dfe8ff", op: night })}</mesh>
    {/* las mosquitas pegadas, quietas, con las alas abiertas */}
    {Array.from({ length: 7 }, (_, i) => <group key={i} visible={i < stuck} position={[-0.07 + rn(i, 2) * 0.14, 0.009, (rn(i, 3) - 0.5) * 0.04]} rotation={[0, rn(i, 4) * 6, 0]}><Fly s={2.6} t={0} /></group>)}
  </>;
}}</Scene3D>;

// ---- 19:32 · CADA DOS DÍAS: el almanaque de la cocina; el balde de compost sale en los días marcados, uno sí, uno no ----
export const HEverytwo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" key1={[-0.7, 1.5, 1.3]} warm={0.8}
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.12], el: [0.12, 0.08], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.4, 5.2), day = Math.floor(k * 14);
  return <>
    {/* el almanaque de papel colgado */}
    <RBox s={[0.42, 0.3, 0.006]} p={[-0.08, 0.22, -0.1]} r={0.004}><meshStandardMaterial color="#f4ecd8" roughness={0.8} /></RBox>
    <RBox s={[0.42, 0.05, 0.008]} p={[-0.08, 0.35, -0.098]} r={0.004}><meshStandardMaterial color="#b4382a" roughness={0.7} /></RBox>
    {Array.from({ length: 14 }, (_, i) => { const x = -0.26 + (i % 7) * 0.06, y = 0.27 - Math.floor(i / 7) * 0.09, mark = i % 2 === 1 && i < day;
      return <group key={i} position={[x, y, -0.094]}>
        <mesh><planeGeometry args={[0.054, 0.08]} /><meshBasicMaterial transparent map={tex.text("cal" + (i + 1), 64, 96, (g) => { g.strokeStyle = "rgba(90,70,50,.4)"; g.strokeRect(1, 1, 62, 94); g.fillStyle = "#3a3026"; g.font = "700 30px Georgia"; g.fillText(String(i + 1), 8, 34); })} /></mesh>
        <mesh position={[0, -0.01, 0.002]} visible={mark} scale={i === day - 1 || i === day - 2 ? cl((k * 14 - i) / 0.8) : 1}><ringGeometry args={[0.018, 0.024, 24]} /><meshBasicMaterial color="#c2302a" /></mesh>
      </group>; })}
    {/* el balde de compost con tapa que sale por la puerta en los días marcados */}
    {(() => { const odd = day % 2 === 0 && day > 0, f = (k * 14) % 1, go = odd ? Math.sin(f * PI) : 0; return <group position={[0.24 + 0.14 * go, 0, 0.05]}>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.05, 0.042, 0.1, 28]} /><meshStandardMaterial color="#5a7a4a" metalness={0.3} roughness={0.5} /></mesh>
      <mesh position={[0, 0.104 + 0.02 * go, 0]} rotation={[0, 0, -0.4 * go]}><cylinderGeometry args={[0.052, 0.052, 0.01, 28]} /><meshStandardMaterial color="#3e5a32" metalness={0.3} roughness={0.5} /></mesh>
      <mesh position={[0, 0.12, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.04, 0.003, 6, 20, PI]} />{M.steel()}</mesh>
    </group>; })()}
  </>;
}}</Scene3D>;

// ---- 20:54 · EL FRASQUITO DE JALEA: la tía pone vinagre de manzana en el frasquito; el vapor dorado de olor sube y atrae a las mosquitas ----
export const HJellyjar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile" key1={[-0.6, 1.5, 1.2]} warm={0.9}
  cam={{ at: [0, 0.09, 0], az: [0.3, -0.05], el: [0.28, 0.2], r: [0.70, 0.58], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.4, 1.6), smell = eio(tt, 1.8, 3.2), come = eio(tt, 2.6, 5.6);
  return <>
    <group scale={1.3}><Jar fill={0.12 + 0.18 * pour} liq="#c87a2a" lid={0} /></group>
    {/* la botella de vinagre de manzana inclinada */}
    <group position={[0.12, 0.24, 0]} rotation={[0, 0, 2.0 * Math.sin(Math.min(1, pour * 1.2) * PI / 2) * (1 - eio(tt, 1.6, 2.2))]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.03, 0.03, 0.14, 24]} /><meshPhysicalMaterial color="#c87a2a" roughness={0.1} transmission={0.5} thickness={0.04} /></mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0305, 0.0305, 0.05, 24, 1, true]} /><meshStandardMaterial color="#e8d8b0" roughness={0.8} /></mesh>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.012, 0.022, 0.04, 20]} /><meshPhysicalMaterial color="#c87a2a" roughness={0.1} transmission={0.5} /></mesh>
    </group>
    {/* las volutas de olor doradas que suben y se abren */}
    {[0, 1, 2].map((i) => { const pts = Array.from({ length: 7 }, (_, k) => [Math.sin(tt * 1.2 + k * 0.8 + i * 2) * 0.03 * k / 6 + (i - 1) * 0.02 * k / 6, 0.12 + k * 0.05 * smell, Math.cos(tt + k + i) * 0.02]); return <mesh key={i} visible={smell > 0.05} geometry={tubeG("smell" + i + Math.round(tt * 15), pts, (u: number) => 0.004 * (1 - u), 40, 6)}><meshBasicMaterial color="#f2c24a" transparent opacity={0.5 * smell} depthWrite={false} /></mesh>; })}
    {/* las mosquitas que bajan siguiendo el olor */}
    {Array.from({ length: 14 }, (_, i) => { const u = cl(come * 1.4 - i * 0.03), a = i * 2.4; return <group key={i} position={[lerp(Math.cos(a) * 0.3, Math.cos(a) * 0.02, u), lerp(0.3 + rn(i, 2) * 0.1, 0.14, u) + Math.sin(tt * 4 + i) * 0.01, lerp(Math.sin(a) * 0.2, Math.sin(a) * 0.02, u)]} rotation={[0, -a, 0]}><Fly s={2.2} t={tt + i} /></group>; })}
  </>;
}}</Scene3D>;

// ---- 21:14 · CAMINAN SOBRE EL VINAGRE: de cerca, las mosquitas se paran en la superficie que se hunde un poquito y no las traga ----
export const HFlywalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a120a" key1={[-0.4, 1.4, 1.0]} warm={0.9}
  cam={{ at: [0, 0.0, 0], az: [0.3, -0.2], el: [0.3, 0.22], r: [0.26, 0.2], fov: 30 }}>{(tt) => {
  return <>
    {/* la superficie del vinagre dentro del frasco: disco ámbar con borde de vidrio */}
    <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.12, 48]} /><meshPhysicalMaterial color="#c87a2a" roughness={0.02} clearcoat={1} transmission={0.3} thickness={0.02} /></mesh>
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.122, 0.122, 0.06, 48, 1, true]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
    {/* tres mosquitas caminando; bajo cada pata un hoyuelo con reflejo */}
    {[0, 1, 2].map((i) => { const a = tt * 0.4 + i * 2.1, x = Math.cos(a) * 0.05, z = Math.sin(a) * 0.05; return <group key={i} position={[x, 0.006, z]} rotation={[0, -a - PI / 2, 0]}>
      <group scale={4}><Fly t={tt + i} wings={false} /></group>
      {[-1, 0, 1].map((k) => [-1, 1].map((sd) => <group key={k + "" + sd}>
        <mesh position={[k * 0.01, -0.004, sd * 0.012]} rotation={[sd * 0.9, 0, 0]}><cylinderGeometry args={[0.0006, 0.0006, 0.014, 4]} /><meshStandardMaterial color="#3a2a1a" /></mesh>
        <mesh position={[k * 0.01, -0.0055, sd * 0.016]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.0015, 0.004, 16]} /><meshBasicMaterial color="#fff0c8" transparent opacity={0.6} /></mesh>
      </group>))}
    </group>; })}
  </>;
}}</Scene3D>;
