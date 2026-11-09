// ohf8pf · el taller del pececillo: bicho plateado 3D, frasco con cinta, higrómetro digital, gota y casita cortada.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, lerp, rn, tex, tubeG } from "./h3d";

export const PI = Math.PI;
export type V3 = [number, number, number];
export const sv = (k: number) => Math.max(0.001, k);

const scaleTex = (key: string, a: string, b: string) => tex.text(key, 256, 256, (g) => {
  g.fillStyle = a; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(i * 22, 0, 12, 256); }
  for (let i = 0; i < 180; i++) { g.fillStyle = `rgba(255,255,255,${0.1 + 0.35 * rn(i, 5)})`; g.fillRect(rn(i, 6) * 256, rn(i, 7) * 256, 5, 2); }
});

// pececillo apuntando a +x; largo total ≈ 0,14·s. run: fase de patas y serpenteo. brat: pariente moteado marrón. dry: 0..1 se apaga
export const Fish: React.FC<{ p?: V3; ry?: number; rz?: number; s?: number; run?: number; brat?: boolean; dry?: number }> = ({ p = [0, 0, 0], ry = 0, rz = 0, s = 1, run = 0, brat = false, dry = 0 }) => {
  const base = new THREE.Color(brat ? "#8a6a48" : "#b9c2cc").lerp(new THREE.Color("#57524c"), dry), hex = "#" + base.getHexString();
  const map = scaleTex(`sf${hex}`, hex, "#" + base.clone().multiplyScalar(0.74).getHexString());
  const seg = (i: number) => { const u = i / 7, x = lerp(0.052, -0.05, u), w = lerp(0.021, 0.006, u * u), z = Math.sin(run * 9 - u * 5) * 0.004 * (1 - dry); return { x, w, z }; };
  const leg = (i: number) => Math.sin(run * 19 + i * 2.2) * 0.008 * (1 - dry);
  return <group position={p} rotation={[0, ry, rz]} scale={sv(s)}>
    {Array.from({ length: 8 }, (_, i) => { const { x, w, z } = seg(i); return <mesh key={i} position={[x, 0.009, z]} scale={[1.05, 0.42, 1]} castShadow><sphereGeometry args={[w, 22, 14]} /><meshPhysicalMaterial map={map} metalness={brat ? 0.15 : 0.55} roughness={0.34} clearcoat={0.7} /></mesh>; })}
    <mesh position={[0.066, 0.009, 0]} scale={[0.8, 0.55, 0.9]} castShadow><sphereGeometry args={[0.013, 16, 12]} /><meshPhysicalMaterial color={hex} metalness={0.4} roughness={0.36} /></mesh>
    {[-1, 1].map((k) => <group key={k}>
      <mesh geometry={tubeG(`sa${k}`, [[0.072, 0.012, k * 0.005], [0.094, 0.02, k * 0.017], [0.124, 0.012, k * 0.036]], 0.001, 12, 5)}><meshStandardMaterial color="#6f6a62" /></mesh>
      {[0, 1, 2].map((i) => { const x = 0.05 - i * 0.021, f = leg(i + (k > 0 ? 3 : 0)); return <mesh key={i} geometry={tubeG(`sl${k}${i}${Math.round(f * 900)}`, [[x, 0.007, k * 0.018], [x + f * 0.5, 0.01, k * 0.031], [x + f, 0.001, k * 0.039]], 0.0016, 10, 5)}><meshStandardMaterial color="#8d8880" /></mesh>; })}
    </group>)}
    {[-1, 0, 1].map((k) => <mesh key={k} geometry={tubeG(`sb${k}`, [[-0.056, 0.009, k * 0.002], [-0.082, 0.012, k * 0.012], [-0.112, 0.008, k * 0.026]], 0.0011, 12, 5)}><meshStandardMaterial color="#77726a" /></mesh>)}
  </group>;
};

const glass = <meshPhysicalMaterial color="#eef6f8" transparent opacity={0.28} roughness={0.06} clearcoat={1} side={2} depthWrite={false} />;

// frasco de vidrio (alto h, radio r) con cinta de papel de 0 a tape (0..1) y miga adentro
export const TapeJar: React.FC<{ p?: V3; r?: number; h?: number; tape?: number; bread?: number; num?: string }> = ({ p = [0, 0, 0], r = 0.12, h = 0.3, tape = 1, bread = 1, num }) => <group position={p}>
  <mesh position={[0, h * 0.43, 0]}><cylinderGeometry args={[r, r, h * 0.86, 44, 1, true]} />{glass}</mesh>
  <mesh position={[0, h * 0.905, 0]}><cylinderGeometry args={[r * 0.78, r, h * 0.09, 44, 1, true]} />{glass}</mesh>
  <mesh position={[0, h * 0.975, 0]}><cylinderGeometry args={[r * 0.78, r * 0.78, h * 0.05, 44, 1, true]} />{glass}</mesh>
  <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[r, r, 0.012, 44]} />{glass}</mesh>
  <mesh position={[0, h, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r * 0.8, 0.008, 10, 44]} />{glass}</mesh>
  <mesh position={[0, h * 0.965, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[r * 0.8, 0.005, 8, 44]} />{glass}</mesh>
  {tape > 0.01 && <mesh position={[0, h * tape * 0.41 + 0.004, 0]}><cylinderGeometry args={[r + 0.004, r + 0.004, h * tape * 0.82, 44, 1, true]} /><meshStandardMaterial map={tex.text("sftapeb", 512, 256, (g) => { g.fillStyle = "#d9c493"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 5; i++) { const y = 18 + i * 52; g.fillStyle = i % 2 ? "rgba(255,244,214,.34)" : "rgba(124,96,52,.16)"; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + 8); g.lineTo(512, y + 52); g.lineTo(0, y + 44); g.fill(); g.strokeStyle = "rgba(96,72,38,.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + 8); g.stroke(); } })} roughness={0.72} side={2} /></mesh>}
  {bread > 0.01 && <RBox s={[r * 0.9, 0.05 * bread, r * 0.7]} p={[0, 0.04, 0]} r={0.012}><meshStandardMaterial color="#d3a868" roughness={0.9} /></RBox>}
  {num && <mesh position={[0, h * 0.44, r + 0.007]}><planeGeometry args={[r * 1.1, r * 1.1]} /><meshBasicMaterial map={numTex(num, "#d9c493", "#2a2119")} /></mesh>}
</group>;

export const numTex = (t: string, bg = "#dfe6d2", ink = "#20301f", fs = 150) => tex.text(`nx${t}${bg}${ink}${fs}`, 256, 256, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.fillStyle = ink; g.font = `700 ${fs}px Georgia, serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, 128, 136);
});

// higrómetro digital: caja blanca con pantalla y número (val como string ya formateado)
export const Hygro: React.FC<{ p?: V3; ry?: number; s?: number; val: string; col?: string }> = ({ p = [0, 0, 0], ry = 0, s = 1, val, col = "#20301f" }) => <group position={p} rotation={[0, ry, 0]} scale={sv(s)}>
  <RBox s={[0.26, 0.2, 0.05]} p={[0, 0.1, 0]} r={0.016}><meshStandardMaterial color="#f3f1ea" roughness={0.5} /></RBox>
  <mesh position={[0, 0.11, 0.0265]}><planeGeometry args={[0.21, 0.13]} /><meshBasicMaterial map={numTex(val, "#cfdcc0", col, 130)} /></mesh>
</group>;

// gota de agua
export const Dr: React.FC<{ p: V3; s?: number; o?: number }> = ({ p, s = 1, o = 0.85 }) => <mesh position={p} scale={[sv(s), sv(s * 1.25), sv(s)]}><sphereGeometry args={[0.02, 16, 12]} /><meshPhysicalMaterial color="#a8d8f0" transparent opacity={o} roughness={0.05} clearcoat={1} /></mesh>;

// casita cortada frente abierto: 3 pisos (sótano/planta/altillo); ancho W, cada piso alto F
export const CutHouse: React.FC<{ W?: number; F?: number; children?: React.ReactNode }> = ({ W = 1.8, F = 0.46, children }) => <group>
  <RBox s={[W, F * 3, 0.05]} p={[0, F * 1.5, -0.3]} r={0.004}><meshStandardMaterial color="#d9d0b8" roughness={0.9} /></RBox>
  {[-1, 1].map((k) => <RBox key={k} s={[0.06, F * 3, 0.64]} p={[k * W / 2, F * 1.5, 0]} r={0.004}><meshStandardMaterial color="#c9bfa4" roughness={0.9} /></RBox>)}
  {[0, 1, 2, 3].map((i) => <RBox key={i} s={[W + 0.06, 0.05, 0.64]} p={[0, i * F, 0]} r={0.004}>{M.wood({ rx: 3, ry: 1, base: i ? [132, 96, 62] : [96, 92, 86] })}</RBox>)}
  <mesh position={[0, F * 3 + 0.3, 0]} rotation={[0, PI / 4, 0]} scale={[1.05 * W / 1.8, 0.5, 0.36]} castShadow><coneGeometry args={[1.32, 1.0, 4]} /><meshStandardMaterial color="#6a3a2a" roughness={0.85} /></mesh>
  {children}
</group>;

export { cl };
