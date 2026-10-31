// lsm29c · utilería de la Navidad de Loretta para los componentes únicos (kit h3d): sobre de la plata, banco de iglesia,
// pino con mitones, mitón, adorno de vidrio, pesebre tallado y figuras de madera, reloj de arena, ponchera, casita de jengibre,
// teléfono amarillo de disco con cable en espiral, valija, caja con carta, cielo de diciembre y piso nevado.
import React from "react";
import * as THREE from "three";
import { M, RBox, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
type V = [number, number, number];

// cielo de diciembre al atardecer + campo nevado (para que nunca quede el vacío negro)
const skyTex = () => tex.text("xsky", 512, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#1d2740"); gr.addColorStop(0.6, "#7a6f8f"); gr.addColorStop(1, "#e9b98a"); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); });
export const XSky: React.FC<{ z?: number; y?: number }> = ({ z = -6, y = 1.2 }) => <mesh position={[0, y, z]}><planeGeometry args={[18, 6]} /><meshBasicMaterial map={skyTex()} toneMapped={false} /></mesh>;
const snowTex = () => tex.text("xsnow", 256, 256, (g) => { g.fillStyle = "#e9eef3"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${170 + 60 * rn(i, 1)},${185 + 50 * rn(i, 2)},${205 + 40 * rn(i, 3)},.35)`; g.fillRect(rn(i, 4) * 256, rn(i, 5) * 256, 2, 2); } });
export const SnowGround: React.FC<{ w?: number; d?: number }> = ({ w = 10, d = 6 }) => <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={snowTex()} roughness={0.9} /></mesh>;

// sobre blanco común: frente con «Christmas», dorso con la lista; flap 0..1 abre la solapa
export const Envelope: React.FC<{ p?: V; rot?: V; front?: THREE.Texture; back?: THREE.Texture; flap?: number; s?: number }> = ({ p = [0, 0, 0], rot = [-PI / 2, 0, 0], front, back, flap = 0, s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh castShadow receiveShadow><boxGeometry args={[0.24, 0.105, 0.004]} /><meshStandardMaterial color="#f6f3ea" roughness={0.85} /></mesh>
  {front && <mesh position={[0, 0, 0.0022]}><planeGeometry args={[0.236, 0.101]} /><meshStandardMaterial map={front} roughness={0.85} /></mesh>}
  {back && <mesh position={[0, 0, -0.0022]} rotation={[0, PI, 0]}><planeGeometry args={[0.236, 0.101]} /><meshStandardMaterial map={back} roughness={0.85} /></mesh>}
  <group position={[0, 0.0525, -0.0025]} rotation={[-PI * 0.95 * flap, 0, 0]}>
    <mesh position={[0, -0.03, 0]} rotation={[0, 0, PI / 4]}><planeGeometry args={[0.12, 0.12]} /><meshStandardMaterial color="#efeadf" roughness={0.85} side={THREE.DoubleSide} /></mesh>
  </group>
</group>;

// banco de iglesia de roble con respaldo y libro de himnos en el estante
export const Pew: React.FC<{ p?: V; w?: number; ry?: number }> = ({ p = [0, 0, 0], w = 1.4, ry = 0 }) => <group position={p} rotation={[0, ry, 0]}>
  <RBox s={[w, 0.04, 0.36]} r={0.01} p={[0, 0.44, 0]}>{M.wood({ base: [120, 74, 40] })}</RBox>
  <RBox s={[w, 0.5, 0.04]} r={0.012} p={[0, 0.72, -0.17]} rot={[-0.12, 0, 0]}>{M.wood({ base: [112, 68, 36] })}</RBox>
  {[-1, 1].map((k) => <RBox key={k} s={[0.05, 0.95, 0.42]} r={0.02} p={[k * (w / 2 + 0.02), 0.47, -0.02]}>{M.wood({ base: [100, 60, 32] })}</RBox>)}
  <RBox s={[w, 0.06, 0.08]} r={0.01} p={[0, 0.62, -0.22]}>{M.wood({ base: [96, 58, 30] })}</RBox>
</group>;

// pino de Navidad hecho de conos apilados
export const Pine: React.FC<{ p?: V; s?: number; snow?: number }> = ({ p = [0, 0, 0], s = 1, snow = 0 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.04, 0.12, 12]} />{M.wood({ base: [90, 56, 30] })}</mesh>
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, 0.2 + i * 0.16, 0]} castShadow><coneGeometry args={[0.32 - i * 0.07, 0.3, 28]} /><meshStandardMaterial color={snow ? "#2f5a3a" : "#24533a"} roughness={0.85} /></mesh>)}
</group>;

// mitón tejido (palma + pulgar + puño acanalado)
export const Mitten: React.FC<{ p?: V; rot?: V; col?: string; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], col = "#b52a22", s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh scale={[1, 1.35, 0.45]} castShadow><sphereGeometry args={[0.04, 18, 14]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
  <mesh position={[0.038, -0.005, 0]} rotation={[0, 0, -0.6]} scale={[0.5, 1, 0.42]}><sphereGeometry args={[0.03, 14, 10]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
  <mesh position={[0, -0.058, 0]}><cylinderGeometry args={[0.032, 0.03, 0.03, 18]} /><meshStandardMaterial color="#f1ece2" roughness={1} /></mesh>
</group>;

// adorno de vidrio con su tapita
export const Bauble: React.FC<{ p?: V; col?: string; r?: number }> = ({ p = [0, 0, 0], col = "#b3261e", r = 0.03 }) => <group position={p}>
  <mesh castShadow><sphereGeometry args={[r, 24, 18]} /><meshPhysicalMaterial color={col} roughness={0.08} metalness={0.4} clearcoat={1} /></mesh>
  <mesh position={[0, r + 0.006, 0]}><cylinderGeometry args={[r * 0.3, r * 0.3, 0.012, 12]} />{M.brass()}</mesh>
</group>;

// figura de pino tallada a navaja (muñeco de clavija con capa); bebé = sólo el cuerpito envuelto
export const Figure: React.FC<{ p?: V; s?: number; col?: string; head?: boolean; ry?: number }> = ({ p = [0, 0, 0], s = 1, col = "#d8b483", head = true, ry = 0 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.05, 0]} castShadow><coneGeometry args={[0.03, 0.1, 10]} /><meshStandardMaterial map={tex.wood(1, 1, [214, 176, 124])} color={col} roughness={0.7} flatShading /></mesh>
  {head && <mesh position={[0, 0.11, 0]} castShadow><sphereGeometry args={[0.018, 10, 8]} /><meshStandardMaterial map={tex.wood(1, 1, [220, 184, 134])} roughness={0.7} flatShading /></mesh>}
</group>;
export const Sheep: React.FC<{ p?: V; s?: number; ry?: number; crooked?: number }> = ({ p = [0, 0, 0], s = 1, ry = 0, crooked = 0.35 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  <mesh position={[0, 0.05, 0]} scale={[1.4, 0.9, 0.9]} castShadow><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#efe6d2" roughness={0.9} flatShading /></mesh>
  <mesh position={[0.045, 0.06, 0]}><sphereGeometry args={[0.015, 8, 6]} /><meshStandardMaterial color="#d8b483" roughness={0.8} flatShading /></mesh>
  {[[-0.025, -1], [0.025, -1], [-0.025, 1], [0.025, 1]].map(([x, z], i) => <mesh key={i} position={[x, 0.018, z * 0.015]} rotation={[0, 0, i === 3 ? crooked : 0]}><cylinderGeometry args={[0.005, 0.005, 0.036, 6]} /><meshStandardMaterial color="#d8b483" roughness={0.8} /></mesh>)}
</group>;
export const Manger: React.FC<{ p?: V; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  {[-1, 1].map((k) => <group key={k}>
    <RBox s={[0.012, 0.06, 0.012]} r={0.002} p={[k * 0.05, 0.03, 0.025]} rot={[0, 0, k * 0.35]}>{M.wood({ base: [170, 128, 80] })}</RBox>
    <RBox s={[0.012, 0.06, 0.012]} r={0.002} p={[k * 0.05, 0.03, -0.025]} rot={[0, 0, k * 0.35]}>{M.wood({ base: [170, 128, 80] })}</RBox>
    <RBox s={[0.12, 0.008, 0.06]} r={0.002} p={[0, 0.055, 0]} rot={[k * 0.5, 0, 0]}>{M.wood({ base: [186, 142, 92] })}</RBox>
  </group>)}
  {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.04 + 0.08 * rn(i, 2), 0.062, -0.015 + 0.03 * rn(i, 3)]} rotation={[0, rn(i, 4) * PI, 1.4]}><cylinderGeometry args={[0.0015, 0.0015, 0.04, 4]} /><meshStandardMaterial color="#e2c06a" roughness={0.9} /></mesh>)}
</group>;

// reloj de arena: sand 0..1 = cuánto bajó
export const Hourglass: React.FC<{ p?: V; sand?: number; s?: number }> = ({ p = [0, 0, 0], sand = 0, s = 1 }) => <group position={p} scale={s}>
  {[0, 0.22].map((y) => <RBox key={y} s={[0.14, 0.018, 0.14]} r={0.006} p={[0, y, 0]}>{M.wood({ base: [110, 66, 34] })}</RBox>)}
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.055, 0.11, z * 0.055]}><cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />{M.wood({ base: [110, 66, 34] })}</mesh>)}
  <mesh position={[0, 0.165, 0]}><coneGeometry args={[0.045, 0.1, 28, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
  <mesh position={[0, 0.055, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.045, 0.1, 28, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
  <mesh position={[0, 0.115 + 0.05 * (1 - sand) * 0.5 + 0.03, 0]} rotation={[PI, 0, 0]} scale={[Math.max(0.05, 1 - sand), Math.max(0.05, 1 - sand), Math.max(0.05, 1 - sand)]} visible={sand < 0.98}><coneGeometry args={[0.038, 0.07, 24]} /><meshStandardMaterial color="#d9b77a" roughness={0.9} /></mesh>
  <mesh position={[0, 0.012 + 0.02 * sand, 0]} scale={[Math.max(0.05, sand), Math.max(0.05, sand), Math.max(0.05, sand)]} visible={sand > 0.02}><coneGeometry args={[0.04, 0.05, 24]} /><meshStandardMaterial color="#d9b77a" roughness={0.9} /></mesh>
  <mesh position={[0, 0.07, 0]} visible={sand > 0.01 && sand < 0.99}><cylinderGeometry args={[0.0015, 0.0015, 0.09, 6]} /><meshStandardMaterial color="#d9b77a" /></mesh>
</group>;

// teléfono de pared amarillo, de disco, con el cable en espiral hasta el tubo (stretch 0..1 estira el cable)
export const YellowPhone: React.FC<{ p?: V; lift?: number; dial?: number; hand?: V }> = ({ p = [0, 0, 0], lift = 0, dial = 0, hand = [0.25, -0.3, 0.2] }) => {
  const yl = <meshPhysicalMaterial color="#f0c43a" roughness={0.3} clearcoat={0.8} />;
  const base: V = [-0.11, -0.12, 0.05], rx: V = [lerp(-0.0, hand[0], lift), lerp(0.02, hand[1], lift), lerp(0.07, hand[2], lift)];
  const pts: number[][] = []; const N = 160;
  for (let i = 0; i <= N; i++) { const u = i / N, a = u * PI * 2 * 22, x = lerp(base[0], rx[0], u), y = lerp(base[1], rx[1], u) - 0.25 * Math.sin(PI * u) * (1 - 0.5 * lift), z = lerp(base[2], rx[2], u); pts.push([x + 0.018 * Math.cos(a), y + 0.018 * Math.sin(a), z]); }
  return <group position={p}>
    <RBox s={[0.2, 0.3, 0.07]} r={0.03}>{yl}</RBox>
    <group position={[0, -0.03, 0.037]} rotation={[0, 0, dial]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.065, 0.065, 0.008, 40]} /><meshPhysicalMaterial color="#e8e2d0" roughness={0.3} transparent opacity={0.8} /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.045 * Math.cos(i * 0.5 + 0.6), 0.045 * Math.sin(i * 0.5 + 0.6), 0.005]}><circleGeometry args={[0.009, 14]} /><meshBasicMaterial color="#3a3226" /></mesh>)}
    </group>
    {/* el tubo */}
    <group position={rx} rotation={[0, 0, lerp(PI / 2, 0.3, lift)]}>
      <RBox s={[0.22, 0.04, 0.045]} r={0.018}>{yl}</RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.095, 0, 0.02]} scale={[1, 1, 0.6]}><sphereGeometry args={[0.032, 18, 12]} />{yl}</mesh>)}
    </group>
    <mesh geometry={tubeG("ycord2" + Math.round(lift * 40), pts, 0.005, 900, 6)}>{yl}</mesh>
  </group>;
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// valija vieja de cartón con esquinas de cuero; open 0..1 levanta la tapa
export const Suitcase: React.FC<{ p?: V; open?: number; ry?: number }> = ({ p = [0, 0, 0], open = 0, ry = 0 }) => <group position={p} rotation={[0, ry, 0]}>
  <RBox s={[0.5, 0.1, 0.34]} r={0.015} p={[0, 0.05, 0]}><meshStandardMaterial color="#7a4e2c" roughness={0.75} /></RBox>
  <mesh position={[0, 0.102, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.47, 0.31]} /><meshStandardMaterial color="#c9b48a" roughness={0.95} /></mesh>
  <group position={[0, 0.1, -0.17]} rotation={[-1.9 * open, 0, 0]}>
    <RBox s={[0.5, 0.06, 0.34]} r={0.015} p={[0, 0.03, 0.17]}><meshStandardMaterial color="#7a4e2c" roughness={0.75} /></RBox>
    <RBox s={[0.12, 0.015, 0.03]} r={0.006} p={[0, 0.065, 0.33]}><meshStandardMaterial color="#3a2414" roughness={0.6} /></RBox>
  </group>
  {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <RBox key={i} s={[0.05, 0.105, 0.05]} r={0.01} p={[x * 0.235, 0.05, z * 0.155]}><meshStandardMaterial color="#3a2414" roughness={0.6} /></RBox>)}
</group>;

// ponchera de vidrio: nivel de ponche rojo y bochas de sorbete que flotan
export const PunchBowl: React.FC<{ p?: V; scoops?: number; tt?: number }> = ({ p = [0, 0, 0], scoops = 0, tt = 0 }) => <group position={p}>
  <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.05, 0.07, 0.04, 32]} />{M.glass({ op: 0.4 })}</mesh>
  <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.18, 40, 20, 0, PI * 2, PI / 2, PI / 2.6]} />{M.glass({ op: 0.3, side: THREE.DoubleSide })}</mesh>
  <mesh position={[0, 0.1, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.165, 40]} /><meshPhysicalMaterial color="#c4172a" roughness={0.05} clearcoat={1} transparent opacity={0.9} /></mesh>
  <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.165, 40, 16, 0, PI * 2, PI / 2 + 0.25, PI / 2 - 0.25]} /><meshPhysicalMaterial color="#a8102a" roughness={0.1} transparent opacity={0.75} side={THREE.DoubleSide} /></mesh>
  {Array.from({ length: 6 }, (_, i) => { const k = Math.min(1, Math.max(0, scoops * 6 - i)), a = i * 1.05 + 0.4, r = 0.04 + 0.07 * rn(i, 2);
    return <mesh key={i} visible={k > 0.01} position={[Math.cos(a) * r, 0.1 + 0.4 * (1 - k) * (1 - k) + 0.004 * Math.sin(tt * 2 + i), Math.sin(a) * r]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.032, 18, 12]} /><meshStandardMaterial color={i % 2 ? "#f6b7c4" : "#f9d38c"} roughness={0.85} /></mesh>; })}
</group>;

// persona sin cara (arcilla): piernas, abrigo, brazos y cabeza con pelo; hold = brazos al frente (plato, vela)
export const Person: React.FC<{ p?: V; s?: number; ry?: number; coat?: string; hair?: string; hold?: number }> = ({ p = [0, 0, 0], s = 1, ry = 0, coat = "#5a6a80", hair = "#d8d4cc", hold = 0 }) => <group position={p} scale={s} rotation={[0, ry, 0]}>
  {[-1, 1].map((k) => <mesh key={k} position={[k * 0.045, 0.2, 0]} castShadow><capsuleGeometry args={[0.035, 0.32, 6, 12]} /><meshStandardMaterial color="#3a3530" roughness={0.8} /></mesh>)}
  <mesh position={[0, 0.58, 0]} castShadow><cylinderGeometry args={[0.1, 0.14, 0.5, 24]} /><meshStandardMaterial color={coat} roughness={0.9} /></mesh>
  <mesh position={[0, 0.84, 0]}><sphereGeometry args={[0.1, 20, 14, 0, PI * 2, 0, PI / 2]} /><meshStandardMaterial color={coat} roughness={0.9} /></mesh>
  <mesh position={[0, 0.98, 0]} castShadow><sphereGeometry args={[0.085, 24, 18]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>
  <mesh position={[0, 1.01, -0.01]} scale={[1.08, 0.9, 1.08]}><sphereGeometry args={[0.088, 24, 16, 0, PI * 2, 0, PI / 1.9]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
  {[-1, 1].map((k) => <group key={k} position={[k * 0.12, 0.8, 0]} rotation={[-1.2 * hold, 0, k * (0.15 - 0.1 * hold)]}>
    <mesh position={[0, -0.16, 0]} castShadow><capsuleGeometry args={[0.03, 0.26, 6, 12]} /><meshStandardMaterial color={coat} roughness={0.9} /></mesh>
    <mesh position={[0, -0.33, 0]}><sphereGeometry args={[0.032, 12, 10]} /><meshStandardMaterial color="#e2b48e" roughness={0.6} /></mesh>
  </group>)}
</group>;
// pino de verdad: siete pisos de ramas que se abren hacia abajo
export const TierPine: React.FC<{ p?: V; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.04, 0.12, 12]} />{M.wood({ base: [90, 56, 30] })}</mesh>
  {Array.from({ length: 7 }, (_, i) => <group key={i} position={[0, 0.16 + i * 0.1, 0]} rotation={[0, i * 0.7, 0]}>
    {Array.from({ length: 9 }, (_, j) => <mesh key={j} position={[Math.cos(j * 0.7) * (0.3 - i * 0.04) * 0.5, -0.02, Math.sin(j * 0.7) * (0.3 - i * 0.04) * 0.5]} rotation={[0, -j * 0.7, PI / 2 - 0.35]} castShadow><coneGeometry args={[0.035, 0.32 - i * 0.04, 6]} /><meshStandardMaterial color={i % 2 ? "#24533a" : "#2b5f42"} roughness={0.85} flatShading /></mesh>)}
    <mesh><coneGeometry args={[0.3 - i * 0.04, 0.16, 18]} /><meshStandardMaterial color="#21492f" roughness={0.9} /></mesh>
  </group>)}
</group>;
