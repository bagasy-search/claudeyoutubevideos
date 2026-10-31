// lsm29e · componentes únicos 22-28 (el salón que se arma la víspera, la mesita de los abuelos, el piso de arriba al freezer, la torta en el Ford, la abuela primero, el confeti azul, el reflector que se corre).
import React from "react";
import * as THREE from "three";
import { AMB, H, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Card, FoldChair, Plate, paperTex } from "./tg";
import { Person } from "./xg";

const PI = Math.PI;

// torta de pisos blanca (para cakefreezer / confetti / fordcake)
const Tier: React.FC<{ p?: number[]; r: number; h: number; col?: string }> = ({ p = [0, 0, 0], r, h, col = "#fbf8f2" }) => <group position={p as any}>
  <mesh position={[0, h / 2, 0]} castShadow><cylinderGeometry args={[r, r, h, 48]} /><meshPhysicalMaterial color={col} roughness={0.55} clearcoat={0.3} /></mesh>
  {Array.from({ length: 24 }, (_, i) => { const a = i / 24 * PI * 2; return <mesh key={i} position={[Math.cos(a) * r, 0.006, Math.sin(a) * r]}><sphereGeometry args={[0.008, 8, 6]} /><meshPhysicalMaterial color={col} roughness={0.5} /></mesh>; })}
</group>;

// ---- 11:45 · LA VÍSPERA: el salón vacío; las mesas redondas aparecen de a una con su mantel y dejan un pasillo ancho en el medio, que se ilumina ----
export const HHallsetup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#2a2420" warm={0.8}
  cam={{ at: [0, 0, 0], at1: [0, 0, 0.1], az: [-0.35, 0.1], el: [0.95, 0.8], r: [3.4, 2.8], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="A WIDE AISLE FOR THE WALKERS" col={AMB} size={40} />}>{(tt) => {
  const pos: number[][] = []; for (const x of [-1.15, -0.62, 0.62, 1.15]) for (const z of [-0.8, 0, 0.8]) pos.push([x, z]);
  const aisle = eio(tt, 3.0, 3.8);
  return <>
    {pos.map(([x, z], i) => { const k = phys(tt, 0.3 + i * 0.2, 7, 0.5); return <group key={i} position={[x, 0, z]} visible={k > 0.01} scale={Math.max(0.05, cl(k))}>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.22, 0.22, 0.02, 40]} /><meshStandardMaterial color="#f6f2ea" roughness={0.95} /></mesh>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.225, 0.24, 0.22, 40, 1, true]} /><meshStandardMaterial color="#f2eee4" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.025, 0.03, 0.06, 16]} />{M.glass()}</mesh>
      <mesh position={[0, 0.44, 0]}><sphereGeometry args={[0.025, 10, 8]} /><meshStandardMaterial color="#fff6c8" roughness={0.8} /></mesh>
      {Array.from({ length: 6 }, (_, j) => { const a = j / 6 * PI * 2; return <RBox key={j} s={[0.1, 0.02, 0.1]} r={0.004} p={[Math.cos(a) * 0.3, 0.24, Math.sin(a) * 0.3]}><meshStandardMaterial color="#9c8c72" roughness={0.8} /></RBox>; })}
    </group>; })}
    {/* el pasillo del medio que se marca */}
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 2.4]} /><meshBasicMaterial color={AMB} transparent opacity={0.18 * aisle} depthWrite={false} toneMapped={false} /></mesh>
    {[-0.35, 0.35].map((x) => <mesh key={x} position={[x, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.015, 2.4 * aisle + 0.001]} /><meshBasicMaterial color={AMB} transparent opacity={0.8 * aisle} depthWrite={false} toneMapped={false} /></mesh>)}
    <pointLight position={[0, 2.2, 0.5]} intensity={1.8} distance={5} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 12:20 · LA MESA DE LOS ABUELOS: la mesa principal larga; una mesita redonda viene desde el rincón del fondo y se acomoda pegada a ella, con su cartelito «Grandparents» ----
export const HGrandtable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" warm={0.8}
  cam={{ at: [0, 0.45, 0], at1: [0.25, 0.6, 0.25], az: [-0.25, 0.05], el: [0.5, 0.48], r: [2.8, 2.2], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="NOT IN THE CORNER · NEXT TO THEM" col={AMB} size={38} />}>{(tt) => {
  const go = eio(tt, 0.6, 2.6), x = lerp(-1.7, 0.45, go), z = lerp(-1.2, 0.5, go), card = phys(tt, 2.7, 7, 0.5);
  const cardTex = paperTex("egrandp", ["Grandparents"], { w: 512, h: 220, font: "italic 700", bg: "#fbf8f0", ink: "#3a2e22" });
  return <>
    <RBox s={[1.8, 0.03, 0.5]} r={0.01} p={[0, 0.74, 0]}><meshStandardMaterial color="#f6f2ea" roughness={0.95} /></RBox>
    <mesh position={[0, 0.55, 0.25]}><planeGeometry args={[1.8, 0.38]} /><meshStandardMaterial color="#f2eee4" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    {[-0.6, -0.2, 0.2, 0.6].map((xx) => <mesh key={xx} position={[xx, 0.8, 0]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color="#fffaf0" roughness={0.9} /></mesh>)}
    {/* el rincón del fondo, en sombra */}
    <mesh position={[-1.7, 0.003, -1.2]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.45, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.35 * (1 - go)} depthWrite={false} /></mesh>
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.3, 0.3, 0.02, 40]} /><meshStandardMaterial color="#f6f2ea" roughness={0.95} /></mesh>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.03, 0.05, 0.72, 10]} />{M.steel()}</mesh>
      <FoldChair p={[-0.38, 0, -0.1]} ry={-1.4} /><FoldChair p={[0.38, 0, -0.1]} ry={1.4} />
      <group visible={card > 0.01} scale={Math.max(0.05, cl(card))} position={[0, 0.73, 0.05]}>
        <Card map={cardTex} w={0.44} h={0.19} p={[0, 0.1, 0.06]} rot={[1.25, 0, 0]} />
      </group>
    </group>
    <pointLight position={[0.9, 1.8, 0.8]} intensity={0.6 + 1.2 * go} distance={3} color="#ffe2b8" />
    <pointLight position={[-0.3, 1.8, 0.2]} intensity={1.0} distance={3} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 12:35 · EL PISO DE ARRIBA: la torta de tres pisos; el de arriba sube, baja dentro de la caja blanca, la caja viaja al freezer de tapa y la tapa se cierra con escarcha ----
export const HCakefreezer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile" warm={0.6}
  cam={{ at: [0.3, 0.6, 0], at1: [0.6, 0.55, 0], az: [-0.3, 0.1], el: [0.35, 0.3], r: [1.9, 1.6], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="ONE YEAR IN THE FREEZER" col={AMB} size={42} />}>{(tt) => {
  const lift = eio(tt, 0.4, 1.2), boxIn = eio(tt, 1.2, 1.8), slide = eio(tt, 1.9, 3.1), lid = eio(tt, 3.2, 3.8), frost = eio(tt, 3.8, 4.6);
  const bx = lerp(-0.2, 1.05, slide), by = lerp(0.82, 0.55, slide) + 0.18 * Math.sin(PI * slide);
  return <>
    <RBox s={[0.7, 0.04, 0.5]} r={0.01} p={[-0.2, 0.7, 0]}>{M.wood({ base: [150, 104, 60] })}</RBox>
    <Tier p={[-0.2, 0.72, 0]} r={0.18} h={0.12} /><Tier p={[-0.2, 0.84, 0]} r={0.13} h={0.1} />
    {/* el piso de arriba: sube y entra en la caja */}
    <group position={[lerp(-0.2, bx, boxIn), lerp(0.94 + 0.18 * lift, by + 0.01, boxIn), 0]}><Tier r={0.085} h={0.08} /></group>
    {/* la caja de panadería */}
    <group position={[bx, by, 0]} visible={boxIn > 0.01}>
      <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.22, 0.12, 0.22]} /><meshStandardMaterial color="#fbfaf6" roughness={0.9} transparent opacity={0.35 + 0.65 * boxIn} /></mesh>
    </group>
    {/* el freezer de tapa */}
    <group position={[1.05, 0, 0]}>
      <RBox s={[0.6, 0.5, 0.45]} r={0.03} p={[0, 0.25, 0]}><meshPhysicalMaterial color="#f2f0ea" roughness={0.35} clearcoat={0.6} /></RBox>
      <mesh position={[0, 0.5, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.52, 0.38]} /><meshStandardMaterial color="#c8dce8" roughness={0.3} emissive="#9cc8e8" emissiveIntensity={0.25} /></mesh>
      <group position={[0, 0.5, -0.225]} rotation={[-1.4 * (1 - lid) * cl(slide * 3), 0, 0]}>
        <RBox s={[0.6, 0.04, 0.45]} r={0.02} p={[0, 0.02, 0.225]}><meshPhysicalMaterial color="#f6f4ee" roughness={0.35} clearcoat={0.6} /></RBox>
        <RBox s={[0.2, 0.03, 0.03]} r={0.01} p={[0, 0.0, 0.46]}>{M.chrome()}</RBox>
        <mesh position={[0, 0.042, 0.225]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.54, 0.4]} /><meshStandardMaterial map={tex.text("efrost", 256, 200, (g) => { for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(220,240,255,${0.15 + 0.4 * rn(i, 3)})`; g.beginPath(); g.arc(rn(i, 1) * 256, rn(i, 2) * 200, 1 + 4 * rn(i, 4), 0, 7); g.fill(); } })} transparent opacity={0.9 * frost} depthWrite={false} /></mesh>
      </group>
    </group>
    {Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.5 + i / 8) % 1; return <mesh key={i} position={[1.05 + 0.2 * (rn(i, 1) - 0.5), 0.55 + 0.4 * ph, 0.1 * (rn(i, 2) - 0.5)]}><sphereGeometry args={[0.05 + 0.06 * ph, 10, 8]} /><meshBasicMaterial color="#e8f4ff" transparent opacity={0.22 * (1 - ph) * cl(slide * 2) * (1 - 0.6 * lid)} depthWrite={false} /></mesh>; })}
    <RBox s={[0.6, 0.3, 0.01]} r={0.004} p={[1.05, 0.25, 0.23]}><meshStandardMaterial color="#e8e6e0" roughness={0.4} /></RBox>
    <mesh position={[1.05, 0.42, 0.236]}><planeGeometry args={[0.22, 0.05]} /><meshStandardMaterial map={tex.text("efrzlbl", 256, 64, (g) => { g.fillStyle = "#dfe9f0"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#2a4a6a"; g.font = "900 40px Georgia"; g.textAlign = "center"; g.fillText("FREEZER", 128, 48); })} roughness={0.5} /></mesh>
    <pointLight position={[1.05, 0.9, 0.3]} intensity={0.6 + 0.6 * (1 - lid)} distance={1.6} color="#d8ecff" />
    <pointLight position={[-0.2, 1.6, 0.6]} intensity={1.4} distance={3} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 13:18 · LA TORTA EN EL PISO DEL FORD: el auto viejo traquetea por el camino de ripio; adentro, en el piso, la torta en su caja y dos manos que la sostienen en cada pozo ----
export const HFordcake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#3a3226" warm={0.8}
  cam={{ at: [0.08, 0.14, 0.02], at1: [0.1, 0.14, 0.02], az: [-0.4, -0.25], el: [0.55, 0.5], r: [1.05, 0.9], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="FORTY MILES OF GRAVEL" col={AMB} size={42} />}>{(tt) => {
  const pot = eio(tt, 2.8, 2.9) * (1 - eio(tt, 2.95, 3.4)), bump = Math.sin(tt * 9) * 0.006 + 0.045 * pot * Math.cos(tt * 18);
  const hands = eio(tt, 1.0, 1.6);
  return <>
    <group position={[0, bump, 0]} rotation={[bump * 2, 0, bump * 1.4]}>
      {/* el piso del auto, alfombra gastada y el respaldo del asiento */}
      <RBox s={[1.0, 0.03, 0.7]} r={0.01} p={[0, 0, 0]}><meshStandardMaterial color="#5a4a3a" roughness={1} /></RBox>
      <RBox s={[1.0, 0.36, 0.14]} r={0.05} p={[0, 0.24, -0.38]} rot={[0.15, 0, 0]}><meshStandardMaterial color="#8a2e26" roughness={0.6} /></RBox>
      <RBox s={[1.0, 0.1, 0.4]} r={0.04} p={[0, 0.08, -0.62]}><meshStandardMaterial color="#8a2e26" roughness={0.6} /></RBox>
      <mesh position={[0.32, 0.021, 0.22]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 24]} /><meshStandardMaterial map={tex.text("egrav" + (Math.floor(tt * 8) % 12), 128, 128, (g) => { g.fillStyle = "#8a8070"; g.fillRect(0, 0, 128, 128); const o = (Math.floor(tt * 8) % 12) * 10; for (let i = 0; i < 60; i++) { g.fillStyle = ["#6a6050", "#a89a84", "#5a5244"][i % 3]; g.fillRect((rn(i, 1) * 128 + o) % 128, rn(i, 2) * 128, 6, 5); } })} roughness={1} /></mesh>
      <mesh position={[0.32, 0.023, 0.22]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.06, 24]} /><meshStandardMaterial color="#3a2e22" roughness={0.8} /></mesh>
      <group position={[0.52, 0.35, -0.1]} rotation={[0, -PI / 2, 0]}>
        <RBox s={[0.6, 0.34, 0.03]} r={0.02} p={[0, 0, -0.01]}><meshStandardMaterial color="#3a5a6a" roughness={0.4} metalness={0.5} /></RBox>
        <mesh position={[0, 0.02, 0.008]}><planeGeometry args={[0.5, 0.22]} /><meshBasicMaterial map={tex.text("eroad" + (Math.floor(tt * 8) % 12), 256, 112, (g) => { g.fillStyle = "#d8e4c8"; g.fillRect(0, 0, 256, 112); g.fillStyle = "#7a9a4a"; g.fillRect(0, 50, 256, 62); g.fillStyle = "#b0a28a"; g.fillRect(0, 80, 256, 32); const o = (Math.floor(tt * 8) % 12) * 22; for (let i = 0; i < 40; i++) { g.fillStyle = ["#8a7a62", "#c8b896", "#6a5e4c"][i % 3]; g.fillRect((rn(i, 5) * 256 + (Math.floor(tt * 8) % 12) * 60) % 256, 84 + rn(i, 6) * 26, 8, 4); } for (let i = 0; i < 6; i++) { g.fillStyle = "#5a7a3a"; g.fillRect((i * 60 - o + 512) % 300 - 20, 30, 10, 26); g.beginPath(); g.arc((i * 60 - o + 512) % 300 - 15, 28, 16, 0, 7); g.fill(); } })} toneMapped={false} /></mesh>
      </group>
      {/* la caja abierta con la torta */}
      <mesh position={[0, 0.09, 0.05]}><boxGeometry args={[0.32, 0.15, 0.32]} /><meshStandardMaterial color="#f2ece0" roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.55} /></mesh>
      <group position={[0, 0.016, 0.05]} rotation={[0, 0, Math.sin(tt * 9) * 0.02]}>
        <Tier r={0.12} h={0.08} col="#f8f2e6" /><Tier p={[0, 0.08, 0]} r={0.09} h={0.06} col="#f8f2e6" />
      </group>
      {/* las dos manos de los costados */}
      {[-1, 1].map((k) => <group key={k} position={[k * lerp(0.4, 0.19, hands), 0.12, 0.05]} rotation={[0, 0, k * 0.2]}>
        <mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.03, 0.14, 6, 12]} /><meshStandardMaterial color="#e2b896" roughness={0.6} /></mesh>
        <mesh position={[k * 0.13, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.04, 0.045, 0.14, 16]} /><meshStandardMaterial color={k < 0 ? "#3a5a7a" : "#6a4a3a"} roughness={0.9} /></mesh>
      </group>)}
    </group>
    {/* la luz del sol que pasa por la ventanilla */}
    <pointLight position={[0.6 * Math.sin(tt * 0.8), 1.0, 0.4]} intensity={1.6} distance={2.4} color="#ffe2b0" />
  </>; }}</Scene3D>;

// ---- 13:40 · LA ABUELA PRIMERO: el salón de arriba; cada recién llegado traza su camino y todos se frenan primero en la mesa de la abuela, que se enciende ----
export const HGrandmafirst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#2a2420" warm={0.8}
  cam={{ at: [0, 0, 0], at1: [0.1, 0, 0], az: [-0.2, 0.05], el: [1.1, 1.0], r: [2.8, 2.3], fov: 36 }}
  over={(tt) => <Tag tt={tt} at={4.4} x={960} y={1010} txt="STOP AT GRANDMA'S TABLE FIRST" col={AMB} size={40} />}>{(tt) => {
  const G = [0, 0.05], paths = [[-1.3, -0.9], [1.3, -0.8], [-1.2, 0.95], [1.25, 0.9], [0.1, -1.1]];
  const glow = eio(tt, 1.2, 2.2);
  return <>
    {[[-0.85, -0.5], [0.85, -0.5], [-0.85, 0.55], [0.85, 0.55]].map(([x, z], i) => <group key={i} position={[x, 0, z]}>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.24, 0.24, 0.02, 40]} /><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />{M.steel()}</mesh>
    </group>)}
    {/* la mesa de la abuela, en el centro, con ella sentada */}
    <group position={[G[0], 0, G[1]]}>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.26, 0.26, 0.02, 40]} /><meshStandardMaterial color="#fbf6ea" roughness={0.9} emissive={AMB} emissiveIntensity={0.25 * glow} /></mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />{M.steel()}</mesh>
      <Person p={[0, 0, -0.34]} s={0.9} ry={0} coat="#9a6a8a" hair="#e8e4dc" />
      <mesh position={[0, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.36, 0.42, 48]} /><meshBasicMaterial color={AMB} transparent opacity={0.6 * glow} depthWrite={false} toneMapped={false} /></mesh>
    </group>
    {/* los caminos de cada invitado: puntos que avanzan hasta la abuela */}
    {paths.map(([x, z], i) => { const k = eio(tt, 0.4 + i * 0.35, 1.8 + i * 0.35), ex = lerp(x, G[0] + (x - G[0]) * 0.22, k), ez = lerp(z, G[1] + (z - G[1]) * 0.22, k);
      return <group key={i}>
        {Array.from({ length: 12 }, (_, j) => { const u = j / 11; return <mesh key={j} position={[lerp(x, ex, u), 0.006, lerp(z, ez, u)]} rotation={[-PI / 2, 0, 0]} visible={k > u * 0.98 + 0.01}><circleGeometry args={[0.014, 10]} /><meshBasicMaterial color={AMB} transparent opacity={0.8} depthWrite={false} toneMapped={false} /></mesh>; })}
        <Person p={[ex, 0, ez]} s={0.75} ry={Math.atan2(G[0] - x, G[1] - z)} coat={["#3a5a7a", "#6a3a3a", "#4a5a3a", "#5a4a6a", "#7a6a3a"][i]} hair={["#3a2a22", "#2a1a12", "#6a5a4a", "#c8c0b0", "#3a2a1a"][i]} />
      </group>; })}
    <pointLight position={[0, 1.8, 0]} intensity={0.8 + 1.6 * glow} distance={3} color="#ffe2b8" />
  </>; }}</Scene3D>;

// ---- 14:25 · EL CONFETI AZUL: la torta en su mesa; el cuchillo baja, corta, y de adentro sale una lluvia lenta de confeti azul que tapa la mesa de los novios ----
export const HConfetti: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#2a2420" warm={0.8}
  cam={{ at: [0, 0.85, 0], at1: [0, 0.9, 0], az: [-0.25, 0.15], el: [0.32, 0.26], r: [1.3, 1.1], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.3} x={960} y={1010} txt="ON SOMEBODY ELSE'S DAY" col={AMB} size={42} />}>{(tt) => {
  const knife = eio(tt, 0.4, 1.2), burst = tt - 1.3;
  return <>
    <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.4, 0.4, 0.72, 48, 1, true]} /><meshStandardMaterial color="#f2eee4" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.42, 0.42, 0.02, 48]} /><meshStandardMaterial color="#f6f2ea" roughness={0.95} /></mesh>
    <Tier p={[0, 0.73, 0]} r={0.2} h={0.13} /><Tier p={[0, 0.86, 0]} r={0.15} h={0.11} /><Tier p={[0, 0.97, 0]} r={0.1} h={0.09} />
    {/* el cuchillo de torta */}
    <group position={[0.06, lerp(1.12, 0.86, knife), 0.16]} rotation={[0, 0.4, 0]} scale={1.4}>
      <RBox s={[0.02, 0.22, 0.003]} r={0.001} p={[0, 0, 0]}>{M.chrome()}</RBox>
      <RBox s={[0.026, 0.1, 0.02]} r={0.008} p={[0, 0.16, 0]}><meshPhysicalMaterial color="#f6f2ea" roughness={0.3} clearcoat={1} /></RBox>
    </group>
    {/* la lluvia de confeti azul */}
    {Array.from({ length: 180 }, (_, i) => { const a = rn(i, 1) * PI * 2, sp = 0.2 + 0.5 * rn(i, 2), up = 0.5 + 0.6 * rn(i, 3), b = Math.max(0, burst);
      const y = 0.95 + up * b - 0.5 * b * b, x = 0.05 + Math.cos(a) * sp * b * 0.6, z = 0.1 + Math.sin(a) * sp * b * 0.6;
      return <mesh key={i} visible={burst > 0} position={[x, Math.max(0.735, y), z]} rotation={[b * 3 + i, b * 2 + i * 0.5, 0]}><planeGeometry args={[0.026, 0.016]} /><meshStandardMaterial color={["#3a7ad8", "#5a9ae8", "#8ab8f0", "#2a5ab0"][i % 4]} roughness={0.5} side={THREE.DoubleSide} /></mesh>; })}
    <pointLight position={[0.2, 1.8, 0.6]} intensity={1.6} distance={3} color="#fff0dc" />
  </>; }}</Scene3D>;

// ---- 14:41 · EL REFLECTOR: la pista; el círculo de luz está sobre el vestido blanco y se corre solo hacia la pareja que se arrodilla; el de la novia queda a oscuras ----
export const HSpotlight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" warm={0.5}
  cam={{ at: [0, 0.6, 0], at1: [0, 0.6, 0], az: [-0.2, 0.2], el: [0.4, 0.34], r: [2.6, 2.2], fov: 34 }}
  over={(tt) => <Tag tt={tt} at={4.2} x={960} y={1010} txt="THE LIGHT MOVES" col={RED} size={44} />}>{(tt) => {
  const mv = eio(tt, 1.2, 3.0), x = lerp(-0.6, 0.65, mv), kneel = eio(tt, 0.4, 1.2);
  return <>
    {/* la novia y el novio */}
    <Person p={[-0.68, 0, 0]} s={1} ry={0.3} coat="#2a2a30" hair="#3a2a1a" />
    <group position={[-0.5, 0, 0.02]}>
      <mesh position={[0, 0.3, 0]}><coneGeometry args={[0.2, 0.6, 32, 1, true]} /><meshPhysicalMaterial color="#fbf8f2" roughness={0.5} sheen={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.07, 0.1, 0.2, 20]} /><meshPhysicalMaterial color="#fbf8f2" roughness={0.5} /></mesh>
      <mesh position={[0, 0.83, 0]}><sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#3a2a1a" roughness={0.5} /></mesh>
    </group>
    {/* la pareja que se arrodilla */}
    <Person p={[0.7, 0, -0.05]} s={1} ry={-0.4} coat="#6a8ab0" hair="#c8a87a" />
    <group position={[0.55, -0.22 * kneel, 0.12]}><Person s={1} ry={-0.9} coat="#3a3a42" hair="#2a1a12" /></group>
    {/* el haz y su círculo */}
    <mesh position={[x, 1.2, 0.05]}><coneGeometry args={[0.32, 2.4, 32, 1, true]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
    <mesh position={[x, 0.004, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.32, 48]} /><meshBasicMaterial color="#fff6dc" transparent opacity={0.45} depthWrite={false} toneMapped={false} /></mesh>
    <pointLight position={[x, 1.1, 0.3]} intensity={2.4} distance={1.8} color="#fff6dc" />
    <pointLight position={[0, 1.6, 1]} intensity={0.35} distance={3} color="#ffd8b0" />
  </>; }}</Scene3D>;
