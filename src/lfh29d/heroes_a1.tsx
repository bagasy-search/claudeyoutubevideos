// lfh29d · componentes únicos 1-7 (siete platos de una bolsa de harina, la bolsa de talones de pan, el palote que hace pan rallado, los 10 minutos del buttermilk, las cáscaras al caldo, el hervor que apenas tiembla, la melaza que tiñe el azúcar).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Jar } from "./ck";

const PI = Math.PI;
const crust = (k: number) => `rgb(${Math.round(lerp(214, 150, k))},${Math.round(lerp(170, 96, k))},${Math.round(lerp(110, 52, k))})`;

// talón de pan: media rodaja con miga clara y corteza tostada
const Heel: React.FC<{ s?: number; dry?: number }> = ({ s = 1, dry = 0 }) => <group scale={s}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.02, 24, 1, false, 0, PI]} /><meshStandardMaterial color={crust(0.6)} roughness={0.85} /></mesh>
  <mesh position={[0, 0, 0.0102]} rotation={[0, 0, 0]}><circleGeometry args={[0.036, 24, 0, PI]} /><meshStandardMaterial color={dry > 0.5 ? "#e0cc9e" : "#ecdcb6"} roughness={1} /></mesh>
</group>;

// ---- 0:25 · SIETE PLATOS: la mesa larga de la granja; caen de a uno siete platos, cada uno con su rodaja, y al centro una sola bolsa de harina ----
export const HSevenplates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#18130e" key1={[-0.6, 1.8, 1.2]} lamp={[0, 0.7, 0]}
  cam={{ at: [0, 0.04, 0], az: [-0.5, -0.1], el: [0.72, 0.6], r: [1.25, 1.0], fov: 30 }}>{(tt) => {
  const sack = phys(tt, 0.3, 6, 0.5), pl = Array.from({ length: 7 }, (_, i) => phys(tt, 0.9 + i * 0.42, 8, 0.5));
  const seat = (i: number) => i < 3 ? [-0.3 + i * 0.3, 0.2] : i < 6 ? [-0.3 + (i - 3) * 0.3, -0.2] : [0.56, 0];
  return <>
    <RBox s={[1.34, 0.04, 0.66]} p={[0.06, 0.02, 0]} r={0.012}>{M.wood({ base: [150, 104, 62], rx: 3 })}</RBox>
    {/* la bolsa de harina de tela, con la boca atada */}
    <group position={[-0.02, 0.04 + 0.3 * (1 - sack), 0]}>
      <mesh position={[0, 0.08, 0]} scale={[1, 1.15, 0.8]}><sphereGeometry args={[0.075, 28, 20]} /><meshStandardMaterial map={tex.text("floursack", 128, 128, (g) => { g.fillStyle = "#ece2cc"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#a8322a"; g.fillRect(0, 54, 128, 6); g.fillRect(0, 66, 128, 3); g.fillStyle = "#2c4f8c"; g.font = "900 20px Georgia"; g.fillText("FLOUR", 34, 92); })} roughness={0.95} /></mesh>
      <mesh position={[0, 0.175, 0]}><cylinderGeometry args={[0.012, 0.03, 0.04, 14]} /><meshStandardMaterial color="#e2d6bc" roughness={1} /></mesh>
      <mesh position={[0, 0.165, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.016, 0.003, 6, 18]} /><meshStandardMaterial color="#8a6a40" roughness={1} /></mesh>
    </group>
    {/* los siete platos, cada uno con una rodaja de pan */}
    {pl.map((k, i) => { const [x, z] = seat(i); return <group key={i} position={[x, 0.042 + 0.25 * (1 - k), z]} scale={Math.max(0.001, cl(k * 1.4))}>
      <mesh position={[0, 0.004, 0]}><cylinderGeometry args={[0.085, 0.07, 0.01, 40]} />{M.porcelain({ col: "#f1ece1" })}</mesh>
      <mesh position={[0, 0.0095, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.072, 0.003, 6, 40]} /><meshStandardMaterial color="#3d6a9a" roughness={0.4} /></mesh>
      <RBox s={[0.07, 0.012, 0.06]} p={[0, 0.018, 0]} rot={[0, rn(i, 3), 0]} r={0.008}><meshStandardMaterial color="#e6d3a8" roughness={1} /></RBox>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 1:44 · LA BOLSA DEL CLAVO: la bolsa de papel colgada junto a la cocina; los talones de pan caen adentro y la bolsa se va inflando ----
export const HHeelsack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#1d1712" key1={[-0.8, 1.4, 1.4]}
  cam={{ at: [0.08, 0.3, 0], az: [0.22, 0.05], el: [0.06, 0.1], r: [0.78, 0.68], fov: 30 }}>{(tt) => {
  const drops = [0, 1, 2, 3, 4].map((i) => cl((tt - 0.5 - i * 0.8) / 0.55)), full = drops.reduce((a, b) => a + b, 0) / 5;
  return <>
    <RBox s={[1.4, 0.9, 0.02]} p={[0, 0.25, -0.06]} r={0.004}><meshStandardMaterial color="#2f4a3e" roughness={0.75} /></RBox>
    {/* el clavo y la bolsa colgando */}
    <mesh position={[0, 0.52, -0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.007, 0.07, 10]} />{M.steel({ col: "#3a3430" })}</mesh>
    <mesh position={[0, 0.52, 0.016]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.006, 16]} />{M.steel({ col: "#3a3430" })}</mesh>
    <group position={[0, 0.5, 0.02]} rotation={[0, 0, Math.sin(tt * 2.2) * 0.02 * (1 - full)]}>
      <mesh position={[0, -0.02, 0]}><torusGeometry args={[0.012, 0.0025, 6, 16]} /><meshStandardMaterial color="#c8a878" roughness={1} /></mesh>
      <mesh position={[0, -0.2, 0]} scale={[1 + 0.25 * full, 1, 0.75 + 0.35 * full]}><boxGeometry args={[0.2, 0.3, 0.12, 6, 6, 4]} /><meshStandardMaterial map={tex.text("papersack2", 128, 128, (g) => { g.fillStyle = "#94632e"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "rgba(90,60,30,.25)"; for (let i = 0; i < 18; i++) { g.beginPath(); g.moveTo(rn(i, 2) * 128, 0); g.lineTo(rn(i, 3) * 128, 128); g.stroke(); } })} roughness={1} /></mesh>
      <mesh position={[0, -0.04, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.2 * (1 + 0.25 * full), 0.03, 0.12 * (0.75 + 0.35 * full)]} /><meshStandardMaterial color="#7e5226" roughness={1} side={THREE.DoubleSide} /></mesh>
    </group>
    {/* la estufa a la derecha: plancha negra y el borde de la hornalla */}
    <RBox s={[0.42, 0.22, 0.3]} p={[0.5, -0.06, 0.05]} r={0.01}><meshStandardMaterial color="#1e1d1c" metalness={0.5} roughness={0.5} /></RBox>
    <mesh position={[0.5, 0.055, 0.05]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.065, 32]} />{M.steel({ col: "#55524e" })}</mesh>
    {/* los talones que caen de a uno, girando */}
    {drops.map((k, i) => k <= 0 || k >= 1 ? null : <group key={i} position={[(rn(i, 4) - 0.5) * 0.06, lerp(0.85, 0.42, k * k), 0.03]} rotation={[k * 3 + i, k * 2, i]}><Heel s={1.7} /></group>)}
    {drops.map((k, i) => k < 1 ? null : <group key={"in" + i} position={[(rn(i, 4) - 0.5) * 0.08, 0.38 - i * 0.012, 0.075]} rotation={[0.2, 0, rn(i, 5) - 0.5]}><Heel s={1.35} /></group>)}
  </>;
}}</Scene3D>;

// ---- 2:04 · EL PALOTE: la bolsa de tela con los trozos de pan duro abajo; el palote pasa y donde pasó quedan migas; el frasco se llena ----
export const HRollpin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#1a1510" lamp={[0, 0.5, 0.2]}
  cam={{ at: [0.03, 0.04, -0.02], az: [-0.3, 0.15], el: [0.62, 0.5], r: [0.98, 0.86], fov: 30 }}>{(tt) => {
  const pass = eio(tt, 0.5, 3.6), x = lerp(-0.3, 0.3, pass), jar = eio(tt, 3.4, 5.2);
  return <>
    <RBox s={[0.9, 0.03, 0.5]} p={[-0.05, 0.015, 0]} r={0.01}>{M.wood({ base: [170, 128, 84], rx: 2 })}</RBox>
    {/* bultos de pan seco bajo la tela: se aplastan detrás del palote */}
    {Array.from({ length: 16 }, (_, i) => { const bx = -0.27 + (i % 8) * 0.075, bz = i < 8 ? -0.05 : 0.06, flat = bx < x ? 1 : 0;
      return <mesh key={i} position={[bx, 0.04, bz]} scale={[1, lerp(0.75, 0.18, flat), 1]}><sphereGeometry args={[0.03 + 0.008 * rn(i, 2), 14, 10]} /><meshStandardMaterial color="#e5dccb" roughness={1} /></mesh>; })}
    <mesh position={[0, 0.035, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.66, 0.28, 32, 16]} /><meshStandardMaterial map={tex.text("sackcloth", 128, 64, (g) => { g.fillStyle = "#34506c"; g.fillRect(0, 0, 128, 64); g.strokeStyle = "rgba(200,210,225,.18)"; for (let i = 0; i < 128; i += 3) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 64); g.stroke(); } })} roughness={1} transparent opacity={0.88} side={THREE.DoubleSide} /></mesh>
    {/* el palote rueda (gira según lo que avanza) */}
    <group position={[x, 0.085, 0.005]} rotation={[0, 0, 0]}>
      <mesh rotation={[PI / 2, 0, -x / 0.035]}><cylinderGeometry args={[0.035, 0.035, 0.36, 32]} />{M.wood({ base: [214, 176, 124], rx: 1 })}</mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0, sd * 0.24]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.014, 0.016, 0.12, 16]} />{M.wood({ base: [190, 150, 100] })}</mesh>)}
    </group>
    {/* el frasco al costado que se llena de pan rallado dorado */}
    <group position={[0.34, 0.03, -0.12]}>
      <Jar fill={0} lid={0}>
        <mesh position={[0, 0.004 + 0.065 * jar, 0]} visible={jar > 0.02}><cylinderGeometry args={[0.05, 0.05, Math.max(0.002, 0.13 * jar), 30]} /><meshStandardMaterial map={tex.text("crumbs", 64, 64, (g) => { g.fillStyle = "#c99a5a"; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 200; i++) { g.fillStyle = ["#e0b878", "#a8743a", "#d8c08a"][i % 3]; g.fillRect(rn(i, 2) * 64, rn(i, 3) * 64, 2, 2); } })} roughness={1} /></mesh>
      </Jar>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:05 · DIEZ MINUTOS: la taza medidora con leche y una cucharada de vinagre; el reloj de la pared avanza diez minutos y la leche se corta ----
export const HTenmin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile" bg="#1d1a17" key1={[-0.8, 1.5, 1.3]}
  cam={{ at: [0.04, 0.17, 0], az: [-0.18, 0.08], el: [0.16, 0.12], r: [0.92, 0.8], fov: 30 }}>{(tt) => {
  const min = eio(tt, 0.6, 4.6), curd = eio(tt, 2.4, 5.0);
  return <>
    {/* reloj de pared: el minutero barre 60 grados (diez minutos) */}
    <group position={[0.24, 0.3, -0.25]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.02, 48]} /><meshStandardMaterial color="#efe8d8" roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.011]}><ringGeometry args={[0.104, 0.115, 48]} />{M.wood({ base: [120, 80, 46] })}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.09, Math.cos(i * PI / 6) * 0.09, 0.012]}><boxGeometry args={[0.005, i % 3 ? 0.01 : 0.018, 0.002]} /><meshStandardMaterial color="#2a2622" /></mesh>)}
      <mesh position={[0, 0, 0.016]} rotation={[0, 0, -PI / 3 * min]}><boxGeometry args={[0.005, 0.16, 0.002]} /><meshStandardMaterial color="#1f1b18" /></mesh>
      <group rotation={[0, 0, -PI / 3 * min]}><mesh position={[0, 0.04, 0.016]}><boxGeometry args={[0.006, 0.08, 0.002]} /><meshStandardMaterial color="#1f1b18" /></mesh></group>
      <group rotation={[0, 0, -2.6 - min * 0.09]}><mesh position={[0, 0.03, 0.018]}><boxGeometry args={[0.008, 0.06, 0.002]} /><meshStandardMaterial color="#1f1b18" /></mesh></group>
      {/* la porción de diez minutos sombreada */}
      <mesh position={[0, 0, 0.013]} rotation={[0, 0, PI / 2 - PI / 3 * min]}><circleGeometry args={[0.085, 32, 0, PI / 3 * Math.max(0.01, min)]} /><meshBasicMaterial color="#c8281e" transparent opacity={0.22} depthWrite={false} /></mesh>
    </group>
    {/* taza medidora de vidrio con la línea de una taza */}
    <group position={[-0.08, 0, 0.05]}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.06, 0.055, 0.14, 40, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0.065, 0.09, 0]}><torusGeometry args={[0.03, 0.008, 8, 20, PI]} />{M.glass({ op: 0.35 })}</mesh>
      {[0.04, 0.07, 0.1, 0.12].map((y, i) => <mesh key={i} position={[0, y, 0.058]}><boxGeometry args={[i === 3 ? 0.04 : 0.02, 0.003, 0.001]} /><meshBasicMaterial color="#c8281e" /></mesh>)}
      <mesh position={[0, 0.062, 0]}><cylinderGeometry args={[0.056, 0.052, 0.118, 36]} /><meshStandardMaterial color="#eae4d6" roughness={0.45} /></mesh>
      {/* el cuajo: grumos que aparecen en la superficie */}
      {Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, r = 0.048 * Math.sqrt((i + 0.5) / 26); return <mesh key={i} position={[Math.cos(a) * r, 0.122, Math.sin(a) * r]} scale={[1, 0.5, 1]} visible={curd > i / 30}><sphereGeometry args={[0.009 + 0.005 * rn(i, 3), 10, 8]} /><meshStandardMaterial color="#d6c07e" roughness={0.9} /></mesh>; })}
    </group>
    {/* la botellita de vinagre al lado */}
    <mesh position={[-0.24, 0.07, -0.05]}><cylinderGeometry args={[0.025, 0.03, 0.14, 24]} />{M.glass({ op: 0.6, col: "#b8843a" })}</mesh>
    <mesh position={[-0.24, 0.15, -0.05]}><cylinderGeometry args={[0.012, 0.012, 0.025, 14]} />{M.plastic({ col: "#c8281e" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 3:43 · LAS CÁSCARAS: al bol entran de a una la cáscara de cebolla, la de zanahoria y las hojas del apio ----
export const HScraps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#1b1712" lamp={[0, 0.5, 0.2]}
  cam={{ at: [0, 0.06, 0], az: [0.3, -0.1], el: [0.55, 0.62], r: [0.62, 0.52], fov: 30 }}>{(tt) => {
  const f = (i: number) => cl((tt - 0.4 - i * 0.55) / 0.6);
  const land = (i: number) => [Math.cos(i * 2.1) * 0.05 * rn(i, 3), 0.05 + i * 0.004, Math.sin(i * 2.1) * 0.05 * rn(i, 4)];
  const from = (i: number) => [i % 3 === 0 ? -0.5 : i % 3 === 1 ? 0.5 : 0.1, 0.45, i % 3 === 2 ? 0.4 : -0.1];
  const pos = (i: number) => { const k = f(i), a = from(i), b = land(i); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * PI) * 0.1, lerp(a[2], b[2], k)]; };
  return <>
    {/* bol de loza crema con borde azul */}
    <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.15, 40, 20, 0, PI * 2, PI / 2, PI / 2.4]} />{M.porcelain({ col: "#efe6d2", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.06, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.005, 8, 48]} /><meshStandardMaterial color="#3d6a9a" roughness={0.4} /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const k = f(i); if (k <= 0) return null; const [x, y, z] = pos(i), kind = i % 3;
      return <group key={i} position={[x, y, z]} rotation={[k * 4 + i, i * 1.3, k * 2]}>
        {kind === 0 && <mesh scale={[1, 0.4, 0.8]}><sphereGeometry args={[0.035, 16, 10, 0, PI * 1.2]} /><meshStandardMaterial color="#b8783a" roughness={0.7} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh>}
        {kind === 1 && <mesh><torusGeometry args={[0.025, 0.006, 6, 20, PI * 1.6]} /><meshStandardMaterial color="#e8792a" roughness={0.6} /></mesh>}
        {kind === 2 && <group>{[0, 1, 2].map((j) => <mesh key={j} position={[j * 0.012 - 0.012, 0.01 * j, 0]} scale={[1, 0.35, 1.3]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color={j % 2 ? "#6a9a3a" : "#7fb04a"} roughness={0.8} /></mesh>)}
          <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.004, 0.005, 0.05, 8]} /><meshStandardMaterial color="#a8c870" /></mesh></group>}
      </group>; })}
    {/* la tabla con el cuchillo y media cebolla */}
    <RBox s={[0.3, 0.02, 0.18]} p={[0.3, 0.01, 0.12]} rot={[0, -0.4, 0]} r={0.01}>{M.wood({ base: [196, 154, 104] })}</RBox>
    <mesh position={[0.3, 0.035, 0.1]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.035, 24, 12, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color="#efe3c8" roughness={0.5} /></mesh>
  </>;
}}</Scene3D>;

// ---- 4:11 · QUE APENAS TIEMBLE: dos ollas; la de la izquierda hierve fuerte y el caldo sale turbio; la de la derecha apenas tiembla y queda dorado y claro ----
export const HTremble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#191512" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.1, 0.1], el: [0.5, 0.44], r: [0.9, 0.8], fov: 30 }}>{(tt) => {
  const clear = eio(tt, 1.0, 4.4);
  const pot = (x: number, hard: boolean) => <group position={[x, 0, 0]}>
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.15, 0.14, 0.14, 48, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.17, 0.12, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.02, 0.005, 8, 16, PI]} />{M.steel()}</mesh>)}
    <mesh position={[0, 0.125 + (hard ? Math.sin(tt * 18) * 0.003 : Math.sin(tt * 5) * 0.0007), 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.145, 48]} />
      <meshPhysicalMaterial color={hard ? "#bfa67a" : "#c88a2c"} roughness={hard ? 0.7 : 0.08} transparent opacity={hard ? 0.98 : lerp(0.92, 0.72, clear)} clearcoat={hard ? 0 : 1} /></mesh>
    {/* burbujas: muchas y grandes vs. pocas y chiquitas */}
    {Array.from({ length: hard ? 22 : 5 }, (_, i) => { const u = (tt * (hard ? 1.6 : 0.4) + rn(i, 2)) % 1, a = rn(i, 3) * 6.3, r = 0.12 * Math.sqrt(rn(i, 4));
      return <mesh key={i} position={[Math.cos(a) * r, 0.127, Math.sin(a) * r]} scale={[1, 0.5, 1]}><sphereGeometry args={[(hard ? 0.018 : 0.005) * Math.sin(u * PI) + 0.001, 10, 8]} /><meshStandardMaterial color={hard ? "#d8c49c" : "#e6b25a"} roughness={0.2} transparent opacity={0.9} /></mesh>; })}
    {/* manchas de grasa en la turbia */}
    {hard && Array.from({ length: 10 }, (_, i) => <mesh key={"g" + i} position={[Math.cos(i * 2.3) * 0.09 * rn(i, 6), 0.1265, Math.sin(i * 2.3) * 0.09 * rn(i, 6)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012 + 0.01 * rn(i, 7), 16]} /><meshStandardMaterial color="#e6cf7a" roughness={0.2} transparent opacity={0.7} /></mesh>)}
    {/* el vapor */}
    {Array.from({ length: hard ? 7 : 3 }, (_, i) => { const u = (tt * 0.5 + i / 7) % 1; return <mesh key={"s" + i} position={[(rn(i, 9) - 0.5) * 0.12, 0.16 + u * 0.3, (rn(i, 8) - 0.5) * 0.1]}><sphereGeometry args={[0.03 + 0.04 * u, 12, 8]} /><meshBasicMaterial color="#d8d4cc" transparent opacity={(hard ? 0.12 : 0.06) * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
    {/* la perilla: fuerte vs. al mínimo */}
    <group position={[0, 0.02, 0.22]} rotation={[PI / 2, 0, hard ? -1.2 : lerp(-1.2, 0.9, eio(tt, 0.3, 1.2))]}>
      <mesh><cylinderGeometry args={[0.025, 0.028, 0.02, 24]} /><meshStandardMaterial color="#1e1c1a" roughness={0.4} /></mesh>
      <mesh position={[0, 0.012, 0.015]}><boxGeometry args={[0.005, 0.004, 0.02]} /><meshStandardMaterial color="#e9e2d0" /></mesh>
    </group>
  </group>;
  return <>
    <RBox s={[1.0, 0.03, 0.5]} p={[0, -0.015, 0.05]} r={0.006}><meshStandardMaterial color="#1f1e1d" metalness={0.5} roughness={0.5} /></RBox>
    {pot(-0.22, true)}{pot(0.22, false)}
  </>;
}}</Scene3D>;

// ---- 5:04 · LA MELAZA EN EL AZÚCAR: una cucharada de melaza cae en el azúcar blanco; el tenedor pisa y todo se vuelve del mismo marrón ----
export const HMashsugar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="none" bg="#1a1511" lamp={[0, 0.45, 0.2]}
  cam={{ at: [0, 0.06, 0], az: [-0.2, 0.25], el: [0.75, 0.68], r: [0.58, 0.5], fov: 30 }}>{(tt) => {
  const drip = eio(tt, 0.3, 1.2), mix = eio(tt, 1.4, 4.8), fx = Math.sin(tt * 7) * 0.08 * (mix > 0 && mix < 1 ? 1 : 0.2), fz = Math.cos(tt * 4.3) * 0.05;
  return <>
    <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.15, 40, 20, 0, PI * 2, PI / 2, PI / 2.5]} />{M.porcelain({ col: "#e9dfcc", side: THREE.DoubleSide })}</mesh>
    {/* los granos: blancos, los cercanos a la mancha se tiñen primero */}
    {Array.from({ length: 260 }, (_, i) => { const a = i * 2.399, r = 0.125 * Math.sqrt((i + 0.5) / 260), x = Math.cos(a) * r, z = Math.sin(a) * r;
      const k = cl(mix * 1.6 - Math.hypot(x, z) * 4 * (1 - mix) + rn(i, 2) * 0.2 - 0.1), c = Math.round(lerp(226, 150, k)), g = Math.round(lerp(220, 104, k)), b = Math.round(lerp(208, 58, k));
      return <mesh key={i} position={[x, 0.052 + rn(i, 5) * 0.008, z]} rotation={[rn(i, 3), rn(i, 4), 0]}><boxGeometry args={[0.009, 0.009, 0.009]} /><meshStandardMaterial color={`rgb(${c},${g},${b})`} roughness={0.85} /></mesh>; })}
    {/* la cucharada de melaza: cae y queda la mancha oscura */}
    <group position={[0, lerp(0.3, 0.12, drip), 0]} visible={drip < 0.99}>
      <mesh rotation={[0, 0, 0.3]}><sphereGeometry args={[0.03, 20, 10, 0, PI * 2, PI / 2, PI / 2]} />{M.steel()}</mesh>
      <mesh position={[0.07, 0.02, 0]} rotation={[0, 0, 1.3]}><boxGeometry args={[0.008, 0.12, 0.004]} />{M.steel()}</mesh>
    </group>
    <mesh position={[0, 0.062, 0]} scale={[1, 0.3, 1]} visible={drip > 0.5}><sphereGeometry args={[0.028 * (1 - mix * 0.9) + 0.002, 20, 12]} /><meshPhysicalMaterial color="#2a1406" roughness={0.1} clearcoat={1} /></mesh>
    {/* el tenedor que pisa */}
    <group position={[fx, 0.07 + Math.abs(Math.sin(tt * 7)) * 0.02, fz]} rotation={[0.3, 0.4, 0]} visible={mix > 0.02}>
      {[-1.5, -0.5, 0.5, 1.5].map((j) => <mesh key={j} position={[j * 0.006, 0.02, 0]}><boxGeometry args={[0.003, 0.04, 0.002]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.012, 0.12, 0.003]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;
