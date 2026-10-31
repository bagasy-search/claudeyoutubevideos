// lfh29b · componentes únicos 19-24 (las semillas al papel, los hijos del híbrido que salen distintos, la perilla del horno a 250, la gallina que aprende a picar, la costra de borra que no deja pasar la lluvia, el clavo enderezado en el riel).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Egg } from "./bk";

const PI = Math.PI;

// ---- 11:17 · SEMILLAS AL PAPEL: el mejor tomate abierto al medio; la cucharita saca las semillas y se desparraman a secar ----
export const HSeedtowel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none"
  cam={{ at: [0.0, 0.03, 0], az: [-0.25, 0.15], el: [0.7, 0.6], r: [0.56, 0.48], fov: 30 }}>{(tt) => {
  const sc = eio(tt, 0.8, 1.8), spread = eio(tt, 2.0, 4.0);
  return <>
    {/* tabla y medio tomate */}
    <RBox s={[0.24, 0.016, 0.18]} p={[-0.15, 0.008, 0]} r={0.01}>{M.wood({ base: [190, 150, 104] })}</RBox>
    <group position={[-0.15, 0.016, 0]}>
      <mesh position={[0, 0.04, 0]} scale={[1, 0.66, 1]}><sphereGeometry args={[0.06, 32, 16, 0, 6.3, PI / 2, PI / 2]} /><meshPhysicalMaterial color="#c8281e" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.0402, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.058, 40]} /><meshStandardMaterial map={tex.text("tomx", 256, 256, (g) => { g.fillStyle = "#e0463a"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#f07a5e"; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(128 + Math.cos(k * 1.57) * 60, 128 + Math.sin(k * 1.57) * 60, 34, 22, k * 1.57, 0, 6.3); g.fill(); } g.fillStyle = "#f6e2a8"; for (let k = 0; k < 40; k++) { const a = rn(k, 2) * 6.3, r = 40 + rn(k, 3) * 40; g.beginPath(); g.ellipse(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 5, 3, a, 0, 6.3); g.fill(); } })} roughness={0.4} /></mesh>
    </group>
    {/* papel de cocina */}
    <RBox s={[0.26, 0.002, 0.2]} p={[0.14, 0.001, 0]} r={0.001}><meshStandardMaterial map={tex.text("ptowel", 256, 256, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(200,200,190,.35)"; for (let x = 0; x < 256; x += 16) for (let y = 0; y < 256; y += 16) { g.beginPath(); g.arc(x + 8, y + 8, 3, 0, 6.3); g.fill(); } })} roughness={1} /></RBox>
    {/* cucharita que va y vuelve */}
    <group position={[lerp(-0.15, 0.08, sc), 0.07 + Math.sin(sc * PI) * 0.06, 0]} rotation={[0, 0, -0.4 * Math.sin(sc * PI)]} visible={tt < 2.2}>
      <mesh scale={[1, 0.5, 0.7]}><sphereGeometry args={[0.02, 16, 8, 0, 6.3, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <RBox s={[0.09, 0.003, 0.008]} p={[-0.055, 0.004, 0]} r={0.002}>{M.steel()}</RBox>
      {sc > 0.05 && sc < 0.98 && [0, 1, 2, 3, 4].map((k) => <mesh key={k} position={[(k - 2) * 0.005, 0.004, (k % 2) * 0.005]} scale={[1, 0.4, 0.75]}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color="#e8c75a" roughness={0.5} /></mesh>)}
    </group>
    {/* las semillas: caen juntas y se separan en una grilla prolija para secar */}
    {Array.from({ length: 36 }, (_, i) => { const p0 = [0.08 + (rn(i, 2) - 0.5) * 0.03, 0.006, (rn(i, 3) - 0.5) * 0.03], p1 = [0.04 + (i % 6) * 0.04, 0.003, -0.08 + Math.floor(i / 6) * 0.032];
      return <mesh key={i} visible={tt > 1.75} position={[lerp(p0[0], p1[0], spread), lerp(p0[1], p1[1], spread), lerp(p0[2], p1[2], spread)]} rotation={[0, rn(i, 4) * 3, 0]} scale={[1, 0.4, 0.75]}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color="#e8c75a" roughness={0.5} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 12:20 · EL HÍBRIDO NO SALE IGUAL: de la planta madre salen tres semillas a tres macetas, y cada hija crece distinta ----
const Plant: React.FC<{ g: number; tall: number; fruit: string; fs: number; n: number; seed: number }> = ({ g, tall, fruit, fs, n, seed }) => <group scale={Math.max(0.01, g)}>
  <mesh position={[0, tall / 2, 0]}><cylinderGeometry args={[0.004, 0.006, tall, 8]} /><meshStandardMaterial color="#4f8a2e" /></mesh>
  {Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[Math.cos(k * 2.3 + seed) * 0.03, tall * (0.3 + k * 0.11), Math.sin(k * 2.3 + seed) * 0.03]} rotation={[0.5, k * 2.3 + seed, 0]} scale={[1, 0.22, 0.55]}><sphereGeometry args={[0.03, 12, 8]} /><meshStandardMaterial color="#5f9a3a" roughness={0.6} /></mesh>)}
  {Array.from({ length: n }, (_, k) => <mesh key={"f" + k} position={[Math.cos(k * 2.1 + seed) * 0.035, tall * (0.45 + 0.12 * k), Math.sin(k * 2.1 + seed) * 0.035]} scale={[1, 0.85, 1]}><sphereGeometry args={[fs, 18, 12]} /><meshPhysicalMaterial color={fruit} roughness={0.3} clearcoat={0.6} /></mesh>)}
</group>;
const Pot: React.FC = () => <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.045, 0.034, 0.06, 24]} /><meshStandardMaterial color="#b85f3a" roughness={0.8} /></mesh>;
export const HHybrid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.15, 0.02], az: [0.1, -0.05], el: [0.26, 0.2], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const KIDS = [{ x: -0.24, tall: 0.12, fruit: "#e8c43a", fs: 0.012, n: 3 }, { x: 0, tall: 0.3, fruit: "#5f9a3a", fs: 0.0001, n: 0 }, { x: 0.24, tall: 0.16, fruit: "#d9772e", fs: 0.024, n: 1 }];
  return <>
    {/* la madre, atrás: tomates rojos parejos */}
    <group position={[0, 0, -0.25]}><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.07, 0.055, 0.1, 28]} /><meshStandardMaterial color="#9a4e30" roughness={0.8} /></mesh><group position={[0, 0.1, 0]}><Plant g={1} tall={0.28} fruit="#cc2a1e" fs={0.024} n={3} seed={0.3} /></group></group>
    {KIDS.map((k, i) => { const fly = cl((tt - 0.5 - i * 0.3) / 0.8), grow = eio(tt, 1.6 + i * 0.25, 4.4 + i * 0.25); return <group key={i}>
      <mesh visible={fly > 0 && fly < 1} position={[lerp(0, k.x, fly), 0.3 + Math.sin(fly * PI) * 0.15 - 0.24 * fly, lerp(-0.25, 0.15, fly)]} scale={[1, 0.35, 0.75]}><sphereGeometry args={[0.007, 10, 8]} /><meshStandardMaterial color="#efdca0" /></mesh>
      <group position={[k.x, 0, 0.15]}><Pot /><group position={[0, 0.06, 0]}><Plant g={grow} tall={k.tall} fruit={k.fruit} fs={k.fs} n={k.n} seed={i * 1.7} /></group></group>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 12:57 · 250 GRADOS, 10 MINUTOS: la perilla de baquelita gira hasta 250 y el reloj de cuerda descuenta diez minutos ----
export const HOvendial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1d1b18" key1={[-0.6, 1.4, 1.6]}
  cam={{ at: [0.06, -0.1, 0], az: [0.22, -0.12], el: [0.1, 0.08], r: [1.12, 1.04], fov: 30 }}>{(tt) => {
  const turn = phys(tt, 0.5, 3.2, 0.62), run = cl((tt - 1.6) / 3.6), glow = eio(tt, 1.0, 2.4);
  const dial = tex.text("dial2", 512, 512, (g) => { g.fillStyle = "#efe8d8"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill(); g.fillStyle = "#2a2622"; g.font = "700 46px Georgia"; g.textAlign = "center"; ["OFF", "200", "250", "300", "350", "400", "450", "500"].forEach((s, i) => { const a = -PI / 2 + i * 0.62; g.save(); g.translate(256 + Math.cos(a) * 190, 256 + Math.sin(a) * 190); g.rotate(a + PI / 2); g.fillText(s, 0, 16); g.restore(); g.fillRect(256 + Math.cos(a) * 236 - 4, 256 + Math.sin(a) * 236 - 4, 8, 8); }); });
  const face = tex.text("timerface", 256, 256, (g) => { g.fillStyle = "#fbf8f0"; g.beginPath(); g.arc(128, 128, 126, 0, 6.3); g.fill(); g.strokeStyle = "#2a2622"; for (let i = 0; i < 60; i++) { const a = -PI / 2 + i * PI / 30; g.lineWidth = i % 5 ? 2 : 5; g.beginPath(); g.moveTo(128 + Math.cos(a) * (i % 5 ? 110 : 100), 128 + Math.sin(a) * (i % 5 ? 110 : 100)); g.lineTo(128 + Math.cos(a) * 120, 128 + Math.sin(a) * 120); g.stroke(); } g.fillStyle = "#2a2622"; g.font = "700 30px Georgia"; g.textAlign = "center"; [0, 10, 20, 30, 40, 50].forEach((n, i) => { const a = -PI / 2 + i * PI / 3; g.fillText(String(n), 128 + Math.cos(a) * 76, 138 + Math.sin(a) * 76); }); });
  return <>
    {/* frente del horno enlozado, ventana con marco cromado y la bandeja de cáscaras adentro */}
    <RBox s={[1.0, 0.7, 0.04]} p={[0.06, -0.06, -0.04]} r={0.01}>{M.porcelain({ col: "#d9cdb8" })}</RBox>
    <RBox s={[0.42, 0.18, 0.012]} p={[0.06, -0.27, -0.016]} r={0.012}>{M.steel()}</RBox>
    <RBox s={[0.38, 0.14, 0.01]} p={[0.06, -0.27, -0.01]} r={0.01}><meshStandardMaterial color="#241710" emissive="#ff8a3a" emissiveIntensity={0.35 * glow} roughness={0.2} /></RBox>
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.08 + (i % 7) * 0.045, -0.3 + Math.floor(i / 7) * 0.05, -0.004]} rotation={[0, 0, rn(i, 2) * 3]}><circleGeometry args={[0.014, 3]} /><meshStandardMaterial color="#f4ede0" emissive="#ffb070" emissiveIntensity={0.25 * glow} /></mesh>)}
    {/* la escala fija y la perilla grande que gira hasta 250 */}
    <mesh position={[-0.12, 0.08, -0.015]}><circleGeometry args={[0.13, 48]} /><meshStandardMaterial map={dial} roughness={0.5} /></mesh>
    <group position={[-0.12, 0.08, 0.0]} rotation={[0, 0, -1.24 * turn]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.077, 0.04, 40]} /><meshStandardMaterial color="#1c1a18" roughness={0.3} metalness={0.2} /></mesh>
      <RBox s={[0.022, 0.105, 0.034]} p={[0, 0, 0.026]} r={0.008}><meshStandardMaterial color="#232120" roughness={0.3} /></RBox>
      <mesh position={[0, 0.058, 0.022]}><boxGeometry args={[0.008, 0.026, 0.026]} /><meshStandardMaterial color="#e9c23a" emissive="#e9c23a" emissiveIntensity={0.4} /></mesh>
    </group>
    {/* reloj de cocina de cuerda: rojo, esfera blanca, la aguja vuelve de 10 a 0 */}
    <group position={[0.26, 0.06, 0.05]} rotation={[0, -0.25, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.085, 0.09, 0.07, 48]} /><meshPhysicalMaterial color="#c8322a" roughness={0.3} clearcoat={0.6} /></mesh>
      <mesh position={[0, 0, 0.0355]}><circleGeometry args={[0.072, 48]} /><meshStandardMaterial map={face} roughness={0.4} /></mesh>
      <group position={[0, 0, 0.038]} rotation={[0, 0, -(1 - run) * PI / 3]}><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.005, 0.06, 0.003]} /><meshStandardMaterial color="#c8322a" /></mesh></group>
      <mesh position={[0, 0, 0.04]}><cylinderGeometry args={[0.007, 0.007, 0.006, 16]} />{M.steel()}</mesh>
      <mesh position={[0, 0.095, 0]}><cylinderGeometry args={[0.012, 0.012, 0.02, 16]} />{M.steel()}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 13:33 · LA GALLINA APRENDE: picotea la cáscara, mira el nido y el tercer picotazo raja un huevo de verdad ----
export const HNestpeck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0.0, 0.13, 0], az: [0.45, 0.25], el: [0.16, 0.12], r: [0.58, 0.48], fov: 30 }}>{(tt) => {
  const pk = (a: number) => Math.max(0, Math.sin(cl((tt - a) / 0.35) * PI)), peck = pk(0.7) + pk(1.5) + pk(3.4), look = eio(tt, 2.1, 2.9), crack = eio(tt, 3.5, 4.1);
  return <>
    {/* nido de paja en cajón */}
    <RBox s={[0.34, 0.08, 0.26]} p={[0.06, 0.04, -0.02]} r={0.006}>{M.wood({ base: [150, 104, 64] })}</RBox>
    {Array.from({ length: 70 }, (_, i) => <mesh key={i} position={[0.06 + (rn(i, 2) - 0.5) * 0.28, 0.085 + rn(i, 3) * 0.015, -0.02 + (rn(i, 4) - 0.5) * 0.2]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, PI / 2]}><cylinderGeometry args={[0.0015, 0.0015, 0.08, 4]} /><meshStandardMaterial color="#d8b860" roughness={0.9} /></mesh>)}
    {[0, 1].map((i) => <group key={i} position={[0.0 + i * 0.07, 0.11, -0.04]}><Egg col="#c98d5a" /></group>)}
    {/* el huevo que se raja */}
    <group position={[0.14, 0.11, 0.0]}>
      <group rotation={[0, 0, 0.5 * crack]} position={[0.01 * crack, 0, 0]}><mesh scale={[1, 1.3, 1]}><sphereGeometry args={[0.022, 20, 14, 0, PI]} /><meshPhysicalMaterial color="#c98d5a" roughness={0.55} side={THREE.DoubleSide} /></mesh></group>
      <group rotation={[0, 0, -0.3 * crack]}><mesh scale={[1, 1.3, 1]}><sphereGeometry args={[0.022, 20, 14, PI, PI]} /><meshPhysicalMaterial color="#c98d5a" roughness={0.55} side={THREE.DoubleSide} /></mesh></group>
      <mesh visible={tt > 1.6 && crack < 0.3} position={[0, 0.004, 0.0225]} rotation={[0, 0, 0.2]}><boxGeometry args={[0.002, 0.03, 0.002]} /><meshBasicMaterial color="#3a2414" /></mesh>
      <mesh visible={crack > 0.05 && crack < 1} position={[0.02 + 0.05 * crack, 0.01 + 0.06 * Math.sin(crack * PI), 0.02]} rotation={[crack * 6, crack * 4, 0]}><circleGeometry args={[0.007, 3]} /><meshStandardMaterial color="#c98d5a" side={THREE.DoubleSide} /></mesh>
      <mesh visible={crack > 0.2} position={[0.01, -0.012, 0.01]} scale={[1.6 * crack, 0.3, 1.4 * crack]}><sphereGeometry args={[0.02, 16, 10]} /><meshPhysicalMaterial color="#f2a516" roughness={0.1} clearcoat={1} /></mesh>
    </group>
    {/* la gallina: cuerpo, cola, cabeza con cresta y pico; el cuello baja en cada picotazo */}
    <group position={[-0.2, 0, 0.08]} rotation={[0, -0.4 - 0.5 * look + 0.5 * eio(tt, 4.4, 5.2), 0]}>
      <mesh position={[0, 0.12, 0]} scale={[1.25, 0.9, 0.85]}><sphereGeometry args={[0.07, 24, 18]} /><meshStandardMaterial color="#8a4a22" roughness={0.8} /></mesh>
      <mesh position={[-0.09, 0.17, 0]} rotation={[0, 0, 0.7]} scale={[0.6, 1, 0.4]}><coneGeometry args={[0.05, 0.1, 12]} /><meshStandardMaterial color="#5a2c12" roughness={0.8} /></mesh>
      {[-0.02, 0.02].map((z) => <mesh key={z} position={[0.0, 0.03, z]}><cylinderGeometry args={[0.004, 0.004, 0.07, 6]} /><meshStandardMaterial color="#d9a032" /></mesh>)}
      <group position={[0.07, 0.17, 0]} rotation={[0, 0, -1.0 * peck]}>
        <mesh position={[0.025, 0.02, 0]}><sphereGeometry args={[0.03, 18, 14]} /><meshStandardMaterial color="#8a4a22" roughness={0.8} /></mesh>
        <mesh position={[0.022, 0.055, 0]} scale={[1.3, 1, 0.4]}><sphereGeometry args={[0.016, 12, 8]} /><meshStandardMaterial color="#c8281e" roughness={0.5} /></mesh>
        <mesh position={[0.058, 0.018, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.008, 0.024, 8]} /><meshStandardMaterial color="#e2b23a" /></mesh>
        {[-1, 1].map((sd) => <mesh key={sd} position={[0.035, 0.028, sd * 0.024]}><sphereGeometry args={[0.004, 8, 6]} /><meshBasicMaterial color="#141110" /></mesh>)}
      </group>
    </group>
    {/* la cáscara cruda tirada en el piso que la tienta primero */}
    <group position={[-0.06, 0.006, 0.12]} rotation={[PI, 0.4, 0]} scale={[1, 0.6, 1]}><mesh><sphereGeometry args={[0.022, 18, 12, 0, 6.3, 0, PI / 2]} /><meshStandardMaterial color="#f3ede2" side={THREE.DoubleSide} /></mesh></group>
  </>;
}}</Scene3D>;

// ---- 14:34 · LA LLUVIA NO PASA: tierra cortada al medio; a la izquierda la costra gruesa de borra hace correr el agua, a la derecha la borra fina deja que entre ----
export const HRaincrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#7f93a3" key1={[-0.6, 1.6, 1.4]}
  cam={{ at: [0, 0.0, 0], az: [0.0, 0.1], el: [0.16, 0.12], r: [0.86, 0.78], fov: 30 }}>{(tt) => {
  const soak = eio(tt, 1.4, 4.8);
  const wet = tex.text("wetfront", 128, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(40,26,16,.85)"); gr.addColorStop(0.8, "rgba(40,26,16,.6)"); gr.addColorStop(1, "rgba(40,26,16,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 256); });
  return <>
    {/* bloque de tierra en corte */}
    <RBox s={[0.9, 0.36, 0.2]} p={[0, -0.18, 0]} r={0.004}><meshStandardMaterial map={tex.text("soil", 256, 128, (g) => { g.fillStyle = "#7a5638"; g.fillRect(0, 0, 256, 128); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${60 + rn(i, 2) * 40},${40 + rn(i, 3) * 30},${25},.5)`; g.fillRect(rn(i, 4) * 256, rn(i, 5) * 128, 2 + rn(i, 6) * 3, 2); } })} roughness={1} /></RBox>
    {/* derecha: el frente mojado baja por la tierra */}
    <mesh position={[0.22, -0.003 - 0.14 * soak, 0.1005]}><planeGeometry args={[0.4, 0.28 * soak + 0.001]} /><meshStandardMaterial map={wet} transparent roughness={1} /></mesh>
    {/* izquierda: tierra seca bajo la costra (más clara) */}
    <mesh position={[-0.23, -0.08, 0.1005]}><planeGeometry args={[0.42, 0.14]} /><meshStandardMaterial color="#b08860" transparent opacity={0.45} roughness={1} /></mesh>
    {/* izquierda: costra gruesa, lisa y brillante, con un labio que sobresale */}
    <RBox s={[0.42, 0.06, 0.2]} p={[-0.23, 0.03, 0]} r={0.012}><meshPhysicalMaterial color="#24170e" roughness={0.3} clearcoat={0.6} /></RBox>
    {/* derecha: borra espolvoreada fina como pimienta */}
    {Array.from({ length: 140 }, (_, i) => <mesh key={i} position={[0.03 + rn(i, 2) * 0.4, 0.003, (rn(i, 3) - 0.5) * 0.18]}><dodecahedronGeometry args={[0.0045, 0]} /><meshStandardMaterial color="#24170e" /></mesh>)}
    {/* gotas: a la izquierda pegan en la costra y ruedan hasta caerse por el borde; a la derecha se hunden */}
    {Array.from({ length: 26 }, (_, i) => { const left = i % 2 === 0, x0 = left ? -0.4 + rn(i, 4) * 0.34 : 0.06 + rn(i, 4) * 0.36, u = ((tt - 0.3) * 0.8 + rn(i, 5)) % 1.0; if (tt < 0.3) return null;
      const fall = cl(u / 0.5), after = cl((u - 0.5) / 0.5);
      if (left) { const x = x0 - (x0 + 0.47) * after, off = x < -0.44, y = off ? 0.06 - (x0 + 0.47) * 0 - 0.4 * cl((after - (x0 + 0.03) / (x0 + 0.47)) * 2) : lerp(0.42, 0.068, fall);
        return <mesh key={i} position={[Math.max(-0.45, x), y, (rn(i, 6) - 0.5) * 0.16]} scale={u > 0.5 ? [1.6, 0.6, 1.4] : [1, 1.4, 1]}><sphereGeometry args={[0.009, 12, 8]} />{M.water({ op: 0.85 })}</mesh>; }
      return <mesh key={i} position={[x0, lerp(0.42, 0.006, fall) - 0.05 * after, (rn(i, 6) - 0.5) * 0.16]} scale={u > 0.5 ? [1.4, 0.4, 1.4] : [1, 1.4, 1]}><sphereGeometry args={[0.009, 12, 8]} />{M.water({ op: 0.85 * (1 - after) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 15:06 · EL YUNQUE DE RIEL: el clavo torcido sobre el pedazo de vía; tres golpes y queda derecho ----
export const HAnvil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0, 0.45, 0.3]}
  cam={{ at: [0.03, 0.13, 0], az: [0.3, 0.18], el: [0.32, 0.26], r: [0.46, 0.4], fov: 30 }}>{(tt) => {
  const H3 = [1.0, 2.0, 3.0], hit = H3.map((a) => cl((tt - a) / 0.12)), straight = (hit[0] + hit[1] + hit[2]) / 3;
  const swing = H3.reduce((s, a) => s + Math.max(0, Math.sin(cl((tt - a + 0.5) / 0.62) * PI)) * (tt < a + 0.12 ? 1 : 0), 0);
  const bend = 0.6 * (1 - straight);
  const nail = [[-0.08, 0, 0], [-0.025, 0.012 * (1 - straight), 0], [0.02, 0.035 * bend, 0], [0.075, 0.085 * bend, 0]];
  return <>
    {/* el riel: hongo, alma y patín */}
    <RBox s={[0.42, 0.04, 0.06]} p={[0, 0.1, 0]} r={0.008}><meshStandardMaterial color="#4a3f38" metalness={0.6} roughness={0.55} /></RBox>
    <RBox s={[0.42, 0.06, 0.018]} p={[0, 0.05, 0]} r={0.004}><meshStandardMaterial color="#3e352f" metalness={0.6} roughness={0.65} /></RBox>
    <RBox s={[0.42, 0.016, 0.12]} p={[0, 0.008, 0]} r={0.004}><meshStandardMaterial color="#3e352f" metalness={0.6} roughness={0.65} /></RBox>
    <mesh position={[0, 0.1205, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.04]} /><meshStandardMaterial color="#c9ced3" metalness={0.9} roughness={0.25} /></mesh>
    {/* el clavo */}
    <group position={[0, 0.125, 0]}>
      <mesh geometry={tubeG("nail" + Math.round(straight * 30), nail, 0.0048, 30, 8)}>{M.steel({ col: "#9da3a8" })}</mesh>
      <mesh position={[-0.08, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.004, 16]} />{M.steel({ col: "#9da3a8" })}</mesh>
    </group>
    {/* martillo que baja en cada golpe */}
    <group position={[0.0, 0.14, 0]} rotation={[0, 0, 0.9 * swing]}>
      <group position={[0.0, 0.0, 0]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />{M.steel({ col: "#5c6166" })}</mesh>
        <mesh position={[0.14, 0.02, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.009, 0.24, 12]} />{M.wood({ base: [176, 132, 86] })}</mesh>
      </group>
    </group>
    {H3.map((a, i) => <group key={i}>{Array.from({ length: 5 }, (_, j) => { const k = cl((tt - a) / 0.4); return k <= 0 || k >= 1 ? null : <mesh key={j} position={[Math.cos(j * 1.3) * 0.04 * k, 0.13 + 0.03 * Math.sin(k * PI), Math.sin(j * 1.3) * 0.04 * k]}><sphereGeometry args={[0.0035, 6, 4]} /><meshBasicMaterial color="#ffb547" transparent opacity={1 - k} /></mesh>; })}</group>)}
  </>;
}}</Scene3D>;
