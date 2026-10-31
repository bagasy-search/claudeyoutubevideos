// lch29 · piezas 3D compartidas de los componentes de zócalos/limpieza: pared pintada con su zócalo (perfil con labio arriba y
// ranura al piso), polvo que se posa o se levanta, media de lana, balde galvanizado, cepillo de dientes, goma blanca.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, rn, tex } from "./h3d";

const PI = Math.PI;
// pared crema + zócalo blanco a lo largo de x (centro en x=0), apoyado en y=0, cara al +z en z=0
export const WallBB: React.FC<{ L?: number; H?: number; col?: string; wall?: string; gloss?: number; dust?: number; top?: number; line?: number; z?: number }> = ({ L = 1.2, H = 0.11, col = "#f4f1ea", wall = "#d9cdb8", gloss = 0.35, dust = 0, top, line, z = 0 }) => <group position={[0, 0, z]}>
  <mesh position={[0, 0.45, -0.012]} receiveShadow><planeGeometry args={[L + 0.4, 0.9]} /><meshStandardMaterial color={wall} roughness={0.92} /></mesh>
  <RBox s={[L, H, 0.018]} p={[0, H / 2, 0]} r={0.003}><meshPhysicalMaterial color={col} roughness={0.55 - 0.4 * gloss} clearcoat={gloss} /></RBox>
  {/* labio redondeado arriba (el «estante» donde se junta el polvo) */}
  <mesh position={[0, H + 0.004, 0.003]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.009, 0.009, L, 16]} /><meshPhysicalMaterial color={col} roughness={0.55 - 0.4 * gloss} clearcoat={gloss} /></mesh>
  <mesh position={[0, H - 0.018, 0.0095]}><boxGeometry args={[L, 0.003, 0.002]} /><meshStandardMaterial color="#cfc9bd" /></mesh>
  {/* polvo: banda gris en el estante y en la línea del piso */}
  {(top ?? dust) > 0.01 && <mesh position={[0, H + 0.0135, 0.003]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[L, 0.016]} /><meshStandardMaterial color="#8a857c" transparent opacity={0.85 * (top ?? dust)} roughness={1} depthWrite={false} /></mesh>}
  {(line ?? dust) > 0.01 && <mesh position={[0, 0.0015, 0.016]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[L, 0.02]} /><meshStandardMaterial color="#7c776e" transparent opacity={0.8 * (line ?? dust)} roughness={1} depthWrite={false} /></mesh>}
</group>;

// motas de polvo: n partículas; pos(i) devuelve [x,y,z]
export const Motes: React.FC<{ n: number; pos: (i: number) => number[]; r?: number; col?: string; op?: number | ((i: number) => number) }> = ({ n, pos, r = 0.0025, col = "#a8a296", op = 0.9 }) => <>
  {Array.from({ length: n }, (_, i) => { const p = pos(i), o = typeof op === "function" ? op(i) : op; return o > 0.01 && <mesh key={i} position={p as [number, number, number]}><sphereGeometry args={[r * (0.6 + 0.8 * rn(i, 31)), 6, 5]} /><meshStandardMaterial color={col} roughness={1} transparent opacity={o} depthWrite={false} /></mesh>; })}
</>;

// media de lana «de talón rojo» (se reconoce sin leer): caña con puño acanalado, talón y punta rojos; g = cuánto se ensució
const sockTex = (g: number) => tex.text("sock" + Math.round(g * 10), 128, 256, (c) => {
  const a = [150, 144, 134], b = [92, 88, 82];
  c.fillStyle = `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * g)).join(",")})`; c.fillRect(0, 0, 128, 256);
  for (let y = 0; y < 256; y += 5) { c.fillStyle = "rgba(0,0,0,.13)"; c.fillRect(0, y, 128, 2); }
  for (let x = 0; x < 128; x += 8) { c.fillStyle = "rgba(255,255,255,.06)"; c.fillRect(x, 0, 3, 256); }
});
const red = (g: number) => new THREE.Color("#b8322a").lerp(new THREE.Color("#5a4a44"), g * 0.7).getStyle();
export const Sock: React.FC<{ g?: number; s?: number }> = ({ g = 0, s = 1 }) => <group scale={s}>
  {/* caña (vertical) */}
  <mesh castShadow position={[-0.05, 0.075, 0]}><capsuleGeometry args={[0.03, 0.12, 10, 24]} /><meshStandardMaterial map={sockTex(g)} roughness={1} /></mesh>
  {/* puño acanalado blanco con raya roja */}
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.05, 0.17 - i * 0.007, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.031, 0.0045, 8, 28]} /><meshStandardMaterial color={i === 2 ? red(g) : "#efe9dc"} roughness={1} /></mesh>)}
  {/* talón rojo */}
  <mesh castShadow position={[-0.052, 0.0, 0]} scale={[1.05, 1, 1]}><sphereGeometry args={[0.034, 20, 14]} /><meshStandardMaterial color={red(g)} roughness={1} /></mesh>
  {/* pie (horizontal) y punta roja */}
  <mesh castShadow position={[0.035, -0.002, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.85]}><capsuleGeometry args={[0.03, 0.11, 10, 24]} /><meshStandardMaterial map={sockTex(g)} roughness={1} /></mesh>
  <mesh castShadow position={[0.11, -0.002, 0]} scale={[1.1, 0.95, 0.85]}><sphereGeometry args={[0.031, 20, 14]} /><meshStandardMaterial color={red(g)} roughness={1} /></mesh>
</group>;

// la media calzada como mitón sobre la mano: antebrazo de piel que entra por el puño; los «dedos» se ven como bultos
export const SockMitt: React.FC<{ g?: number; press?: number }> = ({ g = 0, press = 0 }) => <group>
  <mesh castShadow position={[0, -0.13, 0]}><cylinderGeometry args={[0.026, 0.03, 0.14, 24]} /><meshStandardMaterial color="#e0b394" roughness={0.65} /></mesh>
  {[0, 1, 2].map((i) => <mesh key={i} position={[0, -0.062 - i * 0.007, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.034, 0.005, 8, 28]} /><meshStandardMaterial color={i === 1 ? red(g) : "#efe9dc"} roughness={1} /></mesh>)}
  <mesh castShadow position={[0, 0.0, 0]} scale={[1, 1, 0.62 - 0.12 * press]}><capsuleGeometry args={[0.042, 0.08, 10, 24]} /><meshStandardMaterial map={sockTex(g)} roughness={1} /></mesh>
  {[-1, 0, 1].map((i) => <mesh key={i} position={[i * 0.024, 0.06, 0.004]} scale={[1, 1.2, 0.7]}><sphereGeometry args={[0.017, 14, 10]} /><meshStandardMaterial map={sockTex(g)} roughness={1} /></mesh>)}
  <mesh castShadow position={[0, 0.074, 0]} scale={[1.6, 0.8, 0.75]}><sphereGeometry args={[0.03, 18, 12]} /><meshStandardMaterial color={red(g)} roughness={1} /></mesh>
  <mesh castShadow position={[0.05, 0.0, 0]} rotation={[0, 0, -0.6]}><capsuleGeometry args={[0.014, 0.04, 8, 14]} /><meshStandardMaterial map={sockTex(g)} roughness={1} /></mesh>
</group>;

// mano con guante blanco de algodón (cinco dedos, índice estirado)
export const WhiteGloveHand: React.FC<{ tip?: number; col?: string }> = ({ tip = 0, col = "#fbfbf8" }) => {
  const mat = <meshPhysicalMaterial color={col} roughness={0.9} sheen={1} sheenColor="#ffffff" />;
  return <group>
    <RBox s={[0.085, 0.022, 0.07]} p={[-0.03, 0, 0]} r={0.011}>{mat}</RBox>
    {/* índice estirado hacia +x, con la yema gris */}
    <mesh castShadow position={[0.045, 0, 0.022]} rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.0085, 0.055, 8, 16]} />{mat}</mesh>
    <mesh position={[0.079, -0.004, 0.022]} scale={[1, 0.55, 1]}><sphereGeometry args={[0.0088, 14, 10]} /><meshStandardMaterial color="#6d675e" roughness={1} transparent opacity={tip} /></mesh>
    {/* otros tres dedos doblados */}
    {[0, 1, 2].map((i) => <mesh key={i} castShadow position={[0.018, -0.008, -0.002 - i * 0.017]} rotation={[0, 0, PI / 2 + 0.9]}><capsuleGeometry args={[0.0085, 0.026, 8, 14]} />{mat}</mesh>)}
    <mesh castShadow position={[-0.005, 0.0, 0.042]} rotation={[0.5, 0.6, PI / 2]}><capsuleGeometry args={[0.0095, 0.035, 8, 14]} />{mat}</mesh>
    {/* puño con su botón */}
    <mesh castShadow position={[-0.1, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.04, 0.034, 0.07, 24]} />{mat}</mesh>
    <mesh position={[-0.105, 0.035, 0.012]}><sphereGeometry args={[0.005, 10, 8]} />{M.porcelain()}</mesh>
  </group>;
};

// balde galvanizado con agua (nivel 0..1, color del agua)
export const Bucket: React.FC<{ lv?: number; water?: string; r?: number; suds?: number }> = ({ lv = 0.7, water = "#b9d6e2", r = 0.13, suds = 0 }) => <group>
  <mesh position={[0, r * 0.9, 0]} castShadow receiveShadow><cylinderGeometry args={[r, r * 0.82, r * 1.8, 40, 1, true]} />{M.steel({ col: "#b8bec4", side: THREE.DoubleSide })}</mesh>
  <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[r * 0.82, r * 0.82, 0.006, 40]} />{M.steel({ col: "#9aa1a8" })}</mesh>
  {[0.35, 1.45].map((k, i) => <mesh key={i} position={[0, r * k, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r * (0.82 + 0.18 * k / 1.8), 0.004, 8, 48]} />{M.steel({ col: "#8f969c" })}</mesh>)}
  <mesh position={[0, r * 1.8, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r, 0.005, 8, 48]} />{M.steel({ col: "#d6dbe0" })}</mesh>
  <mesh position={[0, r * 1.8 + r * 0.55, 0]} rotation={[0, 0, 0]}><torusGeometry args={[r * 0.98, 0.003, 6, 40, PI]} />{M.steel({ col: "#7d848a" })}</mesh>
  {lv > 0.02 && <mesh position={[0, r * 1.8 * lv, 0]}><cylinderGeometry args={[r * (0.82 + 0.18 * lv) - 0.003, r * 0.82, 0.004, 40]} />{M.water({ col: water, op: 0.8 })}</mesh>}
  {suds > 0.02 && Array.from({ length: 26 }, (_, i) => { const a = rn(i, 3) * PI * 2, d = Math.sqrt(rn(i, 4)) * r * 0.85; return <mesh key={i} position={[Math.cos(a) * d, r * 1.8 * lv + 0.004, Math.sin(a) * d]} scale={suds}><sphereGeometry args={[0.006 + 0.008 * rn(i, 5), 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.5} transparent opacity={0.85} /></mesh>; })}
</group>;

// cepillo de dientes viejo (cerdas abiertas)
export const Toothbrush: React.FC<{ col?: string }> = ({ col = "#3f8fd0" }) => <group>
  <RBox s={[0.16, 0.012, 0.016]} r={0.005}><meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.6} /></RBox>
  {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[0.055 + (i % 6) * 0.005, -0.012, -0.005 + Math.floor(i / 6) * 0.005]} rotation={[(Math.floor(i / 6) - 1) * 0.25, 0, (i % 6 - 2.5) * 0.06]}><cylinderGeometry args={[0.0018, 0.0014, 0.018, 6]} /><meshStandardMaterial color="#eef2f5" roughness={0.5} /></mesh>)}
</group>;

// goma de borrar blanca (o rosa)
export const Eraser: React.FC<{ col?: string; wear?: number }> = ({ col = "#f6f4ef", wear = 0 }) => <RBox s={[0.06 - 0.01 * wear, 0.016, 0.026]} r={0.004}><meshStandardMaterial color={col} roughness={0.8} /></RBox>;

export { cl };
