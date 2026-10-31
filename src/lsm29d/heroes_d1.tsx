// lsm29d · componentes únicos 1-7 (la fila de la funeraria, los 900 palotes, la tarjeta al bolsillo, las formas del duelo, la taza llena, los anillos, la esperanza al lado).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, paperTex } from "./tg";
import { Person } from "./xg";
import { Mug } from "./pg";

const PI = Math.PI;
const carpetTex = () => tex.text("dcarpet", 256, 1024, (g) => {
  g.fillStyle = "#5e1418"; g.fillRect(0, 0, 256, 1024);
  for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${30 + 40 * Math.random()},0,0,.25)`; g.fillRect(Math.random() * 256, Math.random() * 1024, 2, 2); }
  g.strokeStyle = "#8a2a24"; g.lineWidth = 10; g.strokeRect(14, -10, 228, 1044);
});
const Lily: React.FC<{ p: number[]; s?: number; tt: number }> = ({ p, s = 1, tt }) => <group position={p as [number, number, number]} scale={s}>
  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.07, 0.05, 0.4, 20]} />{M.brass()}</mesh>
  {Array.from({ length: 6 }, (_, i) => { const a = i * 1.05, sw = 0.03 * Math.sin(tt * 0.9 + i);
    return <group key={i} position={[Math.cos(a) * 0.05, 0.4, Math.sin(a) * 0.05]} rotation={[Math.sin(a) * 0.4 + sw, 0, -Math.cos(a) * 0.4]}>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.004, 0.004, 0.32, 6]} /><meshStandardMaterial color="#3f6a35" roughness={0.8} /></mesh>
      <mesh position={[0, 0.34, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.045, 0.09, 6, 1, true]} /><meshStandardMaterial color="#f7f4ec" roughness={0.5} side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={0.05} /></mesh>
    </group>; })}
</group>;

// ---- 0:18 · LA FILA DE RECEPCIÓN: alfombra roja de la funeraria; cuatro personas avanzan de a un lugar hacia la viuda, que espera junto a los lirios ----
export const HReceivingline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="wood" warm={0.85} bg="#140f0d" key1={[0.8, 2.6, 1.2]}
  cam={{ at: [0, 0.65, 0.5], at1: [0, 0.68, -0.3], az: [0.28, 0.14], el: [0.2, 0.16], r: [2.2, 1.75], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.0} x={960} y={1010} txt="THREE PEOPLE AWAY… TWO…" col={AMB} size={40} />}>{(tt) => {
  const step = (k: number) => eio(tt, 0.6 + k * 1.5, 1.6 + k * 1.5);
  const adv = step(0) + step(1);
  return <>
    <mesh position={[0, 0.004, 0.4]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.9, 3.6]} /><meshStandardMaterial map={carpetTex()} roughness={0.95} /></mesh>
    {/* las paredes de la sala de la funeraria: zócalo de madera y empapelado */}
    {[-1, 1].map((k) => <group key={"w" + k}>
      <mesh position={[k * 0.95, 1.0, -0.2]} rotation={[0, -k * PI / 2, 0]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#b9ab92" roughness={0.9} /></mesh>
      <RBox s={[0.03, 0.5, 4]} r={0.004} p={[k * 0.94, 0.25, -0.2]}>{M.wood({ base: [96, 60, 36] })}</RBox>
      {[-1.0, 0.2].map((z) => <mesh key={z} position={[k * 0.93, 1.25, z]} rotation={[0, -k * PI / 2, 0]}><planeGeometry args={[0.32, 0.42]} /><meshStandardMaterial color="#6a5240" roughness={0.6} /></mesh>)}
    </group>)}
    <mesh position={[0, 1.0, -1.7]}><planeGeometry args={[2, 2]} /><meshStandardMaterial color="#a89a82" roughness={0.9} /></mesh>
    {/* la viuda de negro con su velo, junto a los lirios */}
    <Person p={[0.05, 0, -1.25]} s={0.95} coat="#0e0e12" hair="#e2ded6" />
    <mesh position={[0.05, 0.99, -1.25]}><sphereGeometry args={[0.1, 24, 16, 0, PI * 2, 0, PI * 0.62]} /><meshStandardMaterial color="#0a0a0c" roughness={0.6} transparent opacity={0.72} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.05, 1.06, -1.25]}><cylinderGeometry args={[0.11, 0.11, 0.01, 24]} /><meshStandardMaterial color="#0a0a0c" roughness={0.7} /></mesh>
    <spotLight position={[0.3, 2.0, -0.6]} target-position={[0.05, 0.7, -1.25]} angle={0.35} penumbra={0.8} intensity={3.5} distance={3} color="#ffe6c4" />
    <Lily p={[-0.55, 0, -1.35]} s={1.1} tt={tt} /><Lily p={[0.6, 0, -1.35]} s={1.0} tt={tt + 2} />
    {/* la fila */}
    {[0, 1, 2, 3].map((i) => { const z = -0.6 + i * 0.62 - adv * 0.62 * (i === 0 ? 0 : 1), y = 0.012 * Math.abs(Math.sin(adv * PI * 2));
      return <Person key={i} p={[0.02 * Math.sin(i * 2.1), y, z]} s={0.92} ry={PI} coat={["#3a3f4a", "#4a3a34", "#2f3a46", "#3d4138"][i]} hair={["#6a5a4a", "#d8d4cc", "#3a2a22", "#b0a898"][i]} />; })}
    {/* la luz tibia del velatorio */}
    <pointLight position={[0, 1.6, -1.1]} intensity={2.2} distance={3.2} color="#ffd8a8" />
  </>; }}</Scene3D>;

const tallyTex = (n: number) => tex.text("dtally" + n, 1024, 640, (g) => {
  g.fillStyle = "#24302a"; g.fillRect(0, 0, 1024, 640);
  g.strokeStyle = "rgba(240,240,232,.9)"; g.lineWidth = 3; g.lineCap = "round";
  for (let k = 0; k < n; k++) {
    const grp = Math.floor(k / 5), j = k % 5, gx = 30 + (grp % 18) * 54, gy = 40 + Math.floor(grp / 18) * 58;
    g.beginPath();
    if (j < 4) { g.moveTo(gx + j * 9, gy); g.lineTo(gx + j * 9 + 1, gy + 40); } else { g.moveTo(gx - 4, gy + 34); g.lineTo(gx + 34, gy + 6); }
    g.stroke();
  }
});
// ---- 0:52 · NOVECIENTOS: el pizarrón de la cocina de la iglesia se llena de palotes de a cinco hasta 900, y abajo queda el número ----
export const HTallyboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.6}
  cam={{ at: [0, 0.88, 0], at1: [0, 0.86, 0], az: [-0.22, 0.1], el: [0.04, 0.02], r: [1.8, 1.55], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="ABOUT 900 FUNERAL DINNERS" col={AMB} size={42} />}>{(tt) => {
  const k = eio(tt, 0.4, 4.0), n = Math.round(Math.pow(k, 1.6) * 900);
  const quant = Math.min(900, Math.ceil(n / 20) * 20);
  return <>
    <RBox s={[1.34, 0.86, 0.04]} r={0.012} p={[0, 0.95, -0.02]}>{M.wood({ base: [110, 70, 40] })}</RBox>
    <mesh position={[0, 0.95, 0.002]}><planeGeometry args={[1.24, 0.775]} /><meshStandardMaterial map={tallyTex(quant)} roughness={0.95} /></mesh>
    {/* la tiza en el canto, que va y viene */}
    <RBox s={[1.3, 0.025, 0.07]} r={0.006} p={[0, 0.5, 0.03]}>{M.wood({ base: [110, 70, 40] })}</RBox>
    <mesh position={[lerp(-0.5, 0.5, (quant % 180) / 180), 0.98 - 0.2 * Math.floor(quant / 180) / 5, 0.03]} rotation={[0, 0, 0.6]} visible={k < 0.995}><cylinderGeometry args={[0.008, 0.008, 0.06, 10]} /><meshStandardMaterial color="#f4f2ea" roughness={0.9} /></mesh>
    {/* el número que queda, escrito en tiza abajo a la derecha */}
    <mesh position={[0.36, 0.67, 0.004]} visible={k > 0.9}><planeGeometry args={[0.42, 0.2]} /><meshBasicMaterial map={tex.text("d900", 512, 256, (g) => { g.clearRect(0, 0, 512, 256); g.fillStyle = "rgba(246,244,236,.95)"; g.font = "900 200px Georgia"; g.textAlign = "center"; g.fillText("900", 256, 210); })} transparent opacity={cl((k - 0.9) * 10)} depthWrite={false} /></mesh>
    {/* las tazas boca abajo en el estante */}
    {[-0.48, -0.34, -0.2, 0.2].map((x, i) => <group key={i} position={[x, 0.6, 0.06]} rotation={[PI, 0, 0]}><Mug p={[0, -0.07, 0]} coffee={false} col="#f2efe8" /></group>)}
  </>; }}</Scene3D>;

// ---- 1:24 · EN EL BOLSILLO: la tarjeta con las palabras exactas se escribe y se desliza en el bolsillo del saco oscuro ----
export const HPocketcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#3a332c" warm={1.1} key1={[-0.8, 1.8, 1.6]}
  cam={{ at: [0.0, -0.02, 0], at1: [0.22, -0.02, 0], az: [-0.12, 0.05], el: [0.08, 0.04], r: [1.75, 0.95], fov: 30 }}>{(tt) => {
  const ink = eio(tt, 0.4, 2.2), go = eio(tt, 2.6, 3.8), fold = eio(tt, 2.3, 2.7);
  const WOOL = "#2a2f3e", V = new THREE.Shape([new THREE.Vector2(-0.15, 0.2), new THREE.Vector2(0.15, 0.2), new THREE.Vector2(0, -0.2)]);
  return <>
    {/* el saco oscuro entero: torso, hombros, mangas */}
    <RBox s={[0.9, 1.0, 0.16]} r={0.06} p={[0, -0.28, -0.1]}><meshStandardMaterial color={WOOL} roughness={1} /></RBox>
    {[-1, 1].map((k) => <mesh key={"sh" + k} position={[k * 0.42, 0.18, -0.1]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.1, 0.14, 8, 16]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>)}
    {[-1, 1].map((k) => <mesh key={"sl" + k} position={[k * 0.54, -0.3, -0.1]}><capsuleGeometry args={[0.1, 0.8, 8, 16]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>)}
    {/* cuello, camisa blanca en V y corbata */}
    <mesh position={[0, 0.3, -0.12]}><cylinderGeometry args={[0.08, 0.09, 0.16, 20]} /><meshStandardMaterial color="#d9a882" roughness={0.7} /></mesh>
    <mesh position={[0, 0.03, -0.017]}><shapeGeometry args={[V]} /><meshStandardMaterial color="#f0ece4" roughness={0.8} /></mesh>
    <mesh position={[0, 0.0, -0.015]}><planeGeometry args={[0.045, 0.36]} /><meshStandardMaterial color="#7a1e24" roughness={0.6} /></mesh>
    {/* las solapas en V con pespunte */}
    {[-1, 1].map((k) => <group key={"lp" + k} position={[k * 0.12, 0.0, -0.012]} rotation={[0, 0, k * 0.36]}>
      <RBox s={[0.1, 0.5, 0.014]} r={0.004}><meshStandardMaterial color="#1c2030" roughness={0.85} /></RBox>
      <mesh position={[-k * 0.045, 0, 0.008]}><planeGeometry args={[0.004, 0.48]} /><meshBasicMaterial color="#8a90a4" /></mesh>
    </group>)}
    {[-0.36, -0.52].map((y) => <mesh key={y} position={[0, y, -0.016]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.01, 18]} /><meshStandardMaterial color="#1a1410" roughness={0.4} /></mesh>)}
    {/* el bolsillo del pecho: pestaña y pespunte */}
    <RBox s={[0.17, 0.11, 0.01]} r={0.003} p={[0.29, -0.06, -0.017]}><meshStandardMaterial color="#343a4e" roughness={1} /></RBox>
    <RBox s={[0.18, 0.02, 0.016]} r={0.003} p={[0.29, -0.003, -0.012]}><meshStandardMaterial color="#20253a" roughness={1} /></RBox>
    {[[0.29, -0.115, 0.16, 0.003], [0.205, -0.06, 0.003, 0.1], [0.375, -0.06, 0.003, 0.1]].map(([x, y, w, hh], i) => <mesh key={"st" + i} position={[x, y, -0.011]}><planeGeometry args={[w, hh]} /><meshBasicMaterial color="#7a8098" /></mesh>)}
    <mesh position={[0.29, -0.012, -0.0115]} visible={go > 0.6}><planeGeometry args={[0.16, 0.012]} /><meshBasicMaterial color="#000" transparent opacity={0.4 * cl((go - 0.6) * 3)} depthWrite={false} /></mesh>
    {/* la tarjeta, de frente a cámara, que se escribe y entra al bolsillo */}
    <group position={[lerp(0.05, 0.29, go), lerp(0.36, -0.03, go), lerp(0.2, -0.0135, go)]} rotation={[PI / 2 + lerp(-0.15, 0, go), 0, lerp(0.08, 0, go)]} scale={[0.72, 1, 0.72 * lerp(1, 0.85, fold)]}>
      <Card map={paperTex("dpocket", ["I'm so sorry.", "I'm here."].map((l, i) => ink > 0.2 + i * 0.4 ? l : ""), { w: 512, h: 300, font: "italic 700", bg: "#f5f0e4", ink: "#1f2c56" })} w={0.21} h={0.123} rot={[0, 0, 0]} />
    </group>
    <pointLight position={[0.2, 0.3, 0.6]} intensity={2.2} distance={2} color="#ffe2c0" />
    <spotLight position={[0.1, 0.8, 1.1]} target-position={[0.2, -0.05, 0]} angle={0.45} penumbra={0.7} intensity={3} distance={3} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 2:50 · CADA DUELO TIENE SU FORMA: cinco vasijas de arcilla, cada una distinta; una forma intenta entrar en el molde de otra y no cabe ----
const SH: [number, number][][] = [
  [[0.0, 0], [0.09, 0], [0.11, 0.08], [0.07, 0.2], [0.04, 0.26]],
  [[0.0, 0], [0.06, 0], [0.12, 0.1], [0.12, 0.16], [0.05, 0.22]],
  [[0.0, 0], [0.1, 0], [0.06, 0.1], [0.1, 0.2], [0.03, 0.3]],
  [[0.0, 0], [0.12, 0], [0.13, 0.05], [0.06, 0.12], [0.08, 0.17]],
  [[0.0, 0], [0.05, 0], [0.08, 0.14], [0.03, 0.24], [0.06, 0.34]],
];
const lathe = (i: number) => { const pts = SH[i].map(([x, y]) => new THREE.Vector2(x, y)); return new THREE.LatheGeometry(pts, 40); };
const LG = SH.map((_, i) => lathe(i));
export const HShapes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" warm={0.55}
  cam={{ at: [0.05, 0.22, 0], at1: [0.15, 0.22, 0], az: [-0.25, 0.2], el: [0.32, 0.28], r: [1.85, 1.65], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="EVERY GRIEF IS ITS OWN SHAPE" col={AMB} size={40} />}>{(tt) => {
  const COL = ["#8a6a52", "#6a7a8a", "#9a7a5a", "#7a6a7a", "#6a8070"];
  const tryk = eio(tt, 2.2, 3.0), down = eio(tt, 3.0, 3.6), lift = tryk;
  return <>
    {SH.map((_, i) => { const x = -0.6 + i * 0.3, on = phys(tt, 0.3 + i * 0.35, 6, 0.5), moving = i === 3;
      return <group key={i} position={[moving ? lerp(x, 0.6 + 0.045 * down, lift) : x, moving ? lerp(0.4 * Math.sin(PI * 0.5 * lift) + 0.1 * lift, 0.345, down) : 0, 0]} rotation={[0, 0, moving ? -0.3 * down : 0]} scale={cl(on)} visible={on > 0.01}>
        <mesh geometry={LG[i]} castShadow receiveShadow><meshPhysicalMaterial color={COL[i]} roughness={0.55} clearcoat={0.3} side={THREE.DoubleSide} /></mesh>
      </group>; })}
    {/* la vasija 2 choca contra la boca de la 5: no entra, rebota (sacudida) */}
    <mesh position={[0.6, 0.36, 0]} rotation={[-PI / 2, 0, 0]} visible={false}><ringGeometry args={[0.055, 0.07, 32]} /><meshBasicMaterial color={RED} transparent opacity={0} depthWrite={false} /></mesh>
  </>; }}</Scene3D>;

// ---- 3:04 · NO LE QUEDA LUGAR PARA ESCUCHAR: la taza ya está llena hasta el borde; la cafetera sigue sirviendo y el café se derrama en el plato ----
export const HCupfull: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.9}
  cam={{ at: [0, 0.1, 0], at1: [0, 0.08, 0], az: [-0.3, 0.05], el: [0.28, 0.22], r: [0.7, 0.55], fov: 30 }}>{(tt) => {
  const pour = eio(tt, 0.6, 1.2) * (1 - eio(tt, 4.0, 4.6)), spill = cl((tt - 1.4) / 2.6);
  return <>
    <mesh position={[0, 0.006, 0]} receiveShadow castShadow><cylinderGeometry args={[0.12, 0.1, 0.012, 48]} />{M.porcelain()}</mesh>
    {/* el charco que crece en el plato */}
    <mesh position={[0, 0.0131, 0]} rotation={[-PI / 2, 0, 0]} visible={spill > 0.01}><circleGeometry args={[0.05 + 0.06 * spill, 40]} /><meshPhysicalMaterial color="#3a1f10" roughness={0.1} clearcoat={1} /></mesh>
    <group position={[0, 0.012, 0]}>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.045, 0.035, 0.09, 36, 1, true]} /><meshPhysicalMaterial color="#fbfaf6" roughness={0.25} clearcoat={0.8} metalness={0} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.0895, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.045, 0.003, 8, 40]} /><meshPhysicalMaterial color="#fbfaf6" roughness={0.25} clearcoat={0.8} /></mesh>
      {[0, 1, 2, 3].map((i) => { const ph = (tt * 0.35 + i * 0.25) % 1; return <mesh key={"st" + i} position={[0.01 * Math.sin(i * 2 + tt), 0.11 + ph * 0.14, 0]} scale={0.6 + ph}><sphereGeometry args={[0.02, 12, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.12 * Math.sin(PI * ph)} depthWrite={false} /></mesh>; })}
      <mesh position={[0, 0.0895, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.044, 36]} /><meshPhysicalMaterial color="#3a1f10" roughness={0.1} clearcoat={1} /></mesh>
      {/* los hilos de café que caen por los costados */}
      {[0, 1, 2].map((i) => { const a = 0.6 + i * 2.1, k = cl(spill * 3 - i * 0.5);
        return <mesh key={i} position={[Math.cos(a) * 0.046, 0.09 - 0.04 * k, Math.sin(a) * 0.046]} scale={[1, Math.max(0.05, k), 1]} visible={k > 0.02}><cylinderGeometry args={[0.004, 0.006, 0.08, 8]} /><meshPhysicalMaterial color="#3a1f10" roughness={0.1} clearcoat={1} /></mesh>; })}
      <mesh position={[0.045, 0.05, 0]} rotation={[0, 0, -PI / 2]}><torusGeometry args={[0.02, 0.006, 10, 20, PI]} /><meshPhysicalMaterial color="#fbfaf6" roughness={0.25} clearcoat={0.8} /></mesh>
    </group>
    {/* la cafetera de la iglesia, inclinada */}
    <group position={[-0.14, 0.26, 0]} rotation={[0, 0, -0.9 * pour]}>
      <mesh castShadow><cylinderGeometry args={[0.06, 0.07, 0.18, 32]} />{M.steel({ col: "#cfd3d8" })}</mesh>
      <mesh position={[0.08, 0.04, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.008, 0.014, 0.08, 10]} />{M.steel({ col: "#cfd3d8" })}</mesh>
    </group>
    <mesh position={[-0.01, 0.17, 0]} scale={[1, pour, 1]} visible={pour > 0.05}><cylinderGeometry args={[0.004, 0.004, 0.16, 8]} /><meshPhysicalMaterial color="#3a1f10" roughness={0.1} clearcoat={1} /></mesh>
  </>; }}</Scene3D>;

// ---- 4:13 · CINCUENTA AÑOS: dos alianzas ruedan por el carpetín de encaje, se buscan y quedan juntas, una apoyada en la otra ----
export const HRings: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" warm={0.5}
  cam={{ at: [0, 0.03, 0], at1: [0, 0.03, 0], az: [-0.2, 0.3], el: [0.5, 0.42], r: [0.6, 0.42], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="MARRIED 50 YEARS" col={AMB} size={42} />}>{(tt) => {
  const r1 = eio(tt, 0.3, 2.8), r2 = eio(tt, 0.6, 3.1), lean = eio(tt, 3.1, 3.8);
  return <>
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.22, 64]} /><meshStandardMaterial map={tex.text("dlace", 512, 512, (g) => { g.fillStyle = "#d6cbb4"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(120,100,76,.6)"; g.lineWidth = 3; for (let r = 30; r < 256; r += 26) { g.beginPath(); g.arc(256, 256, r, 0, 6.3); g.stroke(); } for (let a = 0; a < 48; a++) { g.beginPath(); g.arc(256 + Math.cos(a / 48 * 6.283) * 230, 256 + Math.sin(a / 48 * 6.283) * 230, 18, 0, 6.3); g.stroke(); } })} roughness={0.9} transparent /></mesh>
    {/* la de él (grande) y la de ella (fina) */}
    <group position={[lerp(-0.22, -0.012, r1), 0.018, lerp(0.12, 0, r1)]} rotation={[PI / 2 - 0.0, 0, r1 * 6]}>
      <mesh castShadow><torusGeometry args={[0.016, 0.0035, 18, 48]} />{M.brass()}</mesh>
    </group>
    <group position={[lerp(0.24, 0.014, r2), 0.014 + 0.003 * lean, lerp(-0.1, 0.002, r2)]} rotation={[PI / 2 - 0.35 * lean, 0, -r2 * 6]}>
      <mesh castShadow><torusGeometry args={[0.013, 0.0025, 18, 48]} />{M.brass()}</mesh>
    </group>
    <pointLight position={[0.1, 0.25, 0.15]} intensity={0.15 + 0.45 * lean} distance={0.9} color="#ffe2a8" />
    {[[lerp(-0.22, -0.012, r1), lerp(0.12, 0, r1), 0.02], [lerp(0.24, 0.014, r2), lerp(-0.1, 0.002, r2), 0.016]].map(([x, z, rr], i) => <mesh key={"sh" + i} position={[x, 0.0035, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[rr, 24]} /><meshBasicMaterial color="#000" transparent opacity={0.28} depthWrite={false} /></mesh>)}
  </>; }}</Scene3D>;

// ---- 4:41 · LA ESPERANZA CAMINA AL LADO: una persona sigue su camino bajo una nube gris; una lucecita tibia aparece y camina con ella, sin quitar la nube ----
export const HHopewalks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#3a4250" warm={0.8} key1={[0.4, 2.6, 1.8]}
  cam={{ at: [-0.4, 0.82, 0], at1: [0.6, 0.82, 0], az: [0.4, 0.32], el: [0.1, 0.08], r: [1.8, 1.65], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="HOPE WALKS NEXT TO THE SORROW" col={AMB} size={38} />}>{(tt) => {
  const walk = 0.45 * eio(tt, 0, 5.6) + 0.55 * cl(tt / 5.6), x = lerp(-0.5, 0.75, walk), hop = eio(tt, 1.4, 2.4);
  return <>
    {/* el camino de tierra */}
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[6, 2.4]} /><meshStandardMaterial color="#3a3a34" roughness={1} /></mesh>
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 0.5]} /><meshStandardMaterial color="#6a5e4c" roughness={1} /></mesh>
    <Person p={[x, 0.01 * Math.abs(Math.sin(tt * 4)), 0]} s={0.82} ry={PI / 2} coat="#2a3040" hair="#d8d4cc" />
    {/* la nube gris que la sigue (no se va) */}
    <group position={[x, 1.2, 0]}>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[(i - 2) * 0.13, 0.03 * Math.sin(i * 2 + tt), 0.02 * i]}><sphereGeometry args={[0.13 + 0.03 * (i % 2), 18, 12]} /><meshStandardMaterial color="#5a606a" roughness={1} /></mesh>)}
      {Array.from({ length: 16 }, (_, i) => { const ph = (tt * 1.2 + rn(i, 3)) % 1; return <mesh key={"r" + i} position={[(rn(i, 1) - 0.5) * 0.5, -0.15 - ph * 0.9, (rn(i, 2) - 0.5) * 0.2]}><boxGeometry args={[0.003, 0.05, 0.003]} /><meshBasicMaterial color="#9fb0c8" transparent opacity={0.5} /></mesh>; })}
    </group>
    {/* la lucecita */}
    <group position={[x + 0.22, 0.62 + 0.03 * Math.sin(tt * 2.4), 0.12]} visible={hop > 0.01} scale={0.3 + 0.7 * hop}>
      <mesh><sphereGeometry args={[0.05, 20, 14]} />{M.glow({ col: "#ffd890", op: 0.95 })}</mesh>
      <mesh><sphereGeometry args={[0.16, 20, 14]} />{M.glow({ col: "#ffc070", op: 0.18 })}</mesh>
    </group>
    <pointLight position={[x + 0.22, 0.62, 0.15]} intensity={1.8 * hop} distance={1.6} color="#ffd08a" />
  </>; }}</Scene3D>;
