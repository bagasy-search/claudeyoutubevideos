// lin29b · piezas de crucero que comparten los componentes (barco, mar, avión, teléfono, valija, copa).
import React from "react";
import * as THREE from "three";
import { M, RBox, tex } from "./h3d";
import { PI, txt } from "./lkit3d";

// fila de ojos de buey pintada (casco y cubiertas)
const winTex = (key: string, n: number, bg: string, on: string, lit = 1) => tex.text("win" + key + n + lit, 512, 64, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 512, 64);
  for (let i = 0; i < n; i++) { g.fillStyle = i / n < lit ? on : "#2c3440"; g.beginPath(); g.arc((i + 0.5) * 512 / n, 32, 12, 0, 2 * PI); g.fill(); }
});

// crucero de juguete de largo ~0.5 (proa hacia +x); lit = fracción de ventanas encendidas
export const Ship: React.FC<{ p?: number[]; r?: number[]; s?: number; lit?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, lit = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.5, 0.07, 0.1]} p={[0, 0.035, 0]} r={0.02}>{M.pvc({ col: "#f4f4f1" })}</RBox>
    <RBox s={[0.5, 0.025, 0.102]} p={[0, 0.012, 0]} r={0.01}>{M.plastic({ col: "#1d2f5a" })}</RBox>
    <mesh position={[0.25, 0.035, 0]} rotation={[0, 0, 0]} castShadow><coneGeometry args={[0.05, 0.12, 4, 1]} />{M.pvc({ col: "#f4f4f1" })}</mesh>
    <mesh position={[0, 0.05, 0.0515]}><planeGeometry args={[0.46, 0.02]} /><meshStandardMaterial map={winTex("h", 18, "#f4f4f1", "#ffd98a", lit)} emissive="#ffcf7a" emissiveIntensity={0.25} /></mesh>
    {[0, 1, 2].map((d) => <group key={d}>
      <RBox s={[0.42 - d * 0.08, 0.035, 0.085]} p={[-0.02 - d * 0.01, 0.087 + d * 0.035, 0]} r={0.008}>{M.pvc({ col: d === 2 ? "#e9eef3" : "#f8f8f5" })}</RBox>
      <mesh position={[-0.02 - d * 0.01, 0.087 + d * 0.035, 0.0431]}><planeGeometry args={[0.4 - d * 0.08, 0.016]} /><meshStandardMaterial map={winTex("d" + d, 14 - d * 3, "#f8f8f5", "#ffd98a", lit)} emissive="#ffcf7a" emissiveIntensity={0.25} /></mesh>
    </group>)}
    <mesh position={[-0.1, 0.21, 0]} castShadow><cylinderGeometry args={[0.022, 0.028, 0.06, 24]} />{M.plastic({ col: "#b8302a" })}</mesh>
    <mesh position={[-0.1, 0.241, 0]}><cylinderGeometry args={[0.022, 0.022, 0.006, 24]} />{M.matte({ col: "#1b1b1f" })}</mesh>
  </group>;

// mar: plano azul con ondas que se mueven (t = segundos)
export const Sea: React.FC<{ t: number; w?: number; d?: number; col?: string; y?: number }> = ({ t, w = 2.4, d = 1.6, col = "#2f6f9a", y = 0 }) => {
  const m = tex.text("sea" + col, 256, 256, (g) => {
    g.fillStyle = col; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(255,255,255,${0.08 + 0.1 * ((i * 37) % 7) / 7})`; g.lineWidth = 2; g.beginPath(); const x = (i * 53) % 256, yy = (i * 97) % 256; g.moveTo(x, yy); g.quadraticCurveTo(x + 10, yy - 5, x + 22, yy); g.stroke(); }
  });
  m.wrapS = m.wrapT = THREE.RepeatWrapping; m.repeat.set(5, 3); m.offset.set(t * 0.02, t * 0.01);
  return <mesh rotation={[-PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshPhysicalMaterial map={m} roughness={0.25} clearcoat={0.8} /></mesh>;
};

// avión de juguete (nariz hacia +x)
export const Plane: React.FC<{ p?: number[]; r?: number[]; s?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <mesh rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.022, 0.2, 8, 20]} />{M.pvc({ col: "#f4f4f1" })}</mesh>
    <RBox s={[0.07, 0.006, 0.26]} p={[0.0, 0, 0]} r={0.003}>{M.pvc({ col: "#e6e8ec" })}</RBox>
    <RBox s={[0.04, 0.05, 0.006]} p={[-0.1, 0.035, 0]} r={0.003}>{M.plastic({ col: "#1d2f5a" })}</RBox>
    <RBox s={[0.03, 0.004, 0.09]} p={[-0.1, 0.004, 0]} r={0.002}>{M.pvc({ col: "#e6e8ec" })}</RBox>
  </group>;

// teléfono celular parado (pantalla hacia +z) con la textura de pantalla que se le pase
export const Phone: React.FC<{ map: THREE.Texture; p?: number[]; r?: number[]; s?: number; em?: number }> = ({ map, p = [0, 0, 0], r = [0, 0, 0], s = 1, em = 0.9 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.09, 0.18, 0.01]} r={0.012}>{M.plastic({ col: "#202226" })}</RBox>
    <mesh position={[0, 0, 0.0052]}><planeGeometry args={[0.08, 0.165]} /><meshStandardMaterial map={map} emissive="#ffffff" emissiveMap={map} emissiveIntensity={em} roughness={0.3} /></mesh>
  </group>;

// valija rígida con manija
export const Suitcase: React.FC<{ col?: string; p?: number[]; r?: number[]; s?: number; lid?: number }> = ({ col = "#1d2f5a", p = [0, 0, 0], r = [0, 0, 0], s = 1, lid = 0 }) =>
  <group position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <RBox s={[0.16, 0.22, 0.08]} p={[0, 0.12, 0]} r={0.014}>{M.plastic({ col })}</RBox>
    {[-0.05, 0, 0.05].map((x) => <mesh key={x} position={[x, 0.12, 0.0405]}><planeGeometry args={[0.006, 0.2]} />{M.matte({ col: "#0f1a33" })}</mesh>)}
    <mesh position={[0, 0.24 + lid, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.005, 8, 20, PI]} />{M.matte({ col: "#141414" })}</mesh>
    {[-0.06, 0.06].map((x) => <mesh key={x} position={[x, 0.008, 0.02]}><sphereGeometry args={[0.009, 12, 10]} />{M.rubber({ col: "#141414" })}</mesh>)}
  </group>;

// copa de vino (fill 0-1 de vino)
export const WineGlass: React.FC<{ p?: number[]; s?: number; fill?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, fill = 0.6, col = "#7a1426" }) =>
  <group position={p as [number, number, number]} scale={s}>
    <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.022, 0.022, 0.003, 28]} />{M.glass({ op: 0.5 })}</mesh>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.055, 10]} />{M.glass({ op: 0.5 })}</mesh>
    <mesh position={[0, 0.078, 0]}><sphereGeometry args={[0.03, 28, 20, 0, 2 * PI, PI * 0.35, PI * 0.65]} />{M.glass({ op: 0.3 })}</mesh>
    {fill > 0.02 && <mesh position={[0, 0.062 + 0.012 * fill, 0]}><cylinderGeometry args={[0.022 + 0.004 * fill, 0.012, 0.012 + 0.022 * fill, 28]} /><meshPhysicalMaterial color={col} roughness={0.1} transparent opacity={0.85} clearcoat={1} /></mesh>}
  </group>;

// sello de goma con mango
export const StampTool: React.FC<{ p?: number[]; s?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, col = "#b8302a" }) =>
  <group position={p as [number, number, number]} scale={s}>
    <RBox s={[0.07, 0.012, 0.05]} p={[0, 0.006, 0]} r={0.003}>{M.rubber({ col })}</RBox>
    <RBox s={[0.074, 0.02, 0.054]} p={[0, 0.022, 0]} r={0.004}>{M.wood({ base: [120, 78, 44] })}</RBox>
    <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.01, 0.014, 0.05, 20]} />{M.wood({ base: [90, 58, 32] })}</mesh>
    <mesh position={[0, 0.09, 0]} castShadow><sphereGeometry args={[0.02, 20, 16]} />{M.plastic({ col: "#1b1b1f" })}</mesh>
  </group>;

// marca de sello (círculo de tinta con texto)
export const StampMark: React.FC<{ id: string; lines: string[]; col?: string; p?: number[]; r?: number[]; s?: number }> = ({ id, lines, col = "#b8302a", p = [0, 0, 0], r = [-PI / 2, 0, 0], s = 1 }) =>
  <mesh position={p as [number, number, number]} rotation={r as [number, number, number]} scale={s}>
    <planeGeometry args={[0.08, 0.08]} />
    <meshStandardMaterial transparent roughness={0.9} map={tex.text("stm" + id, 256, 256, (g) => {
      g.clearRect(0, 0, 256, 256); g.strokeStyle = col; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 112, 0, 2 * PI); g.stroke();
      g.lineWidth = 4; g.beginPath(); g.arc(128, 128, 92, 0, 2 * PI); g.stroke();
      g.fillStyle = col; g.textAlign = "center"; g.textBaseline = "middle";
      lines.forEach((l, i) => { g.font = `900 ${i === 0 ? 50 : 34}px Arial`; g.fillText(l, 128, 128 + (i - (lines.length - 1) / 2) * 50); });
    })} />
  </mesh>;

export { txt };
