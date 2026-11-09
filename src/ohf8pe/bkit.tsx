// ohf8pe · el taller de la chinche: chinche 3D (hambrienta→llena), colchón acolchado, cama chica, vaso liso, puntos, vapor.
import React from "react";
import * as THREE from "three";
import { M, RBox, lerp, rn, tex, tubeG } from "./h3d";

export const PI = Math.PI;
export type V3 = [number, number, number];
export const sv = (k: number) => Math.max(0.001, k);

const bandTex = (key: string, a: string, b: string) => tex.text(key, 256, 256, (g) => {
  g.fillStyle = a; g.fillRect(0, 0, 256, 256); g.fillStyle = b; for (let i = 0; i < 9; i++) g.fillRect(i * 29 + 12, 0, 7, 256);
});

// chinche apuntando a +x; largo ≈ 0,1·s. fed: 0 plana y canela → 1 redonda y rojo oscuro. run: fase de patas. dead: 0..1 se apaga a ceniza. pale: ninfa traslúcida
export const Bug: React.FC<{ p?: V3; ry?: number; rz?: number; s?: number; fed?: number; run?: number; dead?: number; pale?: boolean }> = ({ p = [0, 0, 0], ry = 0, rz = 0, s = 1, fed = 0, run = 0, dead = 0, pale = false }) => {
  const c0 = new THREE.Color(pale ? "#e6d3b0" : "#a4683a"), c1 = new THREE.Color(pale ? "#c9503f" : "#6d1712"), col = c0.lerp(c1, fed).lerp(new THREE.Color("#2b2723"), dead);
  const hex = "#" + col.getHexString(), H = lerp(0.24, 0.62, fed), W = lerp(1, 1.1, fed), y0 = 0.003 + 0.04 * H;
  const leg = (i: number) => Math.sin(run * 13 + i * 2.1) * 0.012 * (1 - dead);
  const map = bandTex(`bug${hex}`, hex, "#" + col.clone().multiplyScalar(0.72).getHexString());
  return <group position={p} rotation={[0, ry, rz]} scale={sv(s)}>
    <mesh position={[-0.008, y0, 0]} scale={[1.12, H, 1.12 * W]} castShadow><sphereGeometry args={[0.04, 36, 24]} /><meshPhysicalMaterial map={map} roughness={0.32} clearcoat={0.8} clearcoatRoughness={0.3} /></mesh>
    <mesh position={[0.04, y0 + 0.001, 0]} scale={[0.72, Math.max(0.34, H * 0.8), 1.18]} castShadow><sphereGeometry args={[0.03, 24, 16]} /><meshPhysicalMaterial color={hex} roughness={0.36} clearcoat={0.7} /></mesh>
    <mesh position={[0.066, y0 + 0.001, 0]} scale={[0.9, 0.55, 0.8]} castShadow><sphereGeometry args={[0.012, 18, 12]} /><meshPhysicalMaterial color={hex} roughness={0.34} clearcoat={0.7} /></mesh>
    {[-1, 1].map((k) => <group key={k}>
      <mesh position={[0.072, y0 + 0.005, k * 0.0105]}><sphereGeometry args={[0.0034, 10, 8]} /><meshPhysicalMaterial color="#160b08" roughness={0.1} clearcoat={1} /></mesh>
      <mesh geometry={tubeG(`ant${k}`, [[0.075, y0, k * 0.006], [0.086, y0 + 0.007, k * 0.014], [0.098, y0 + 0.004, k * 0.024]], 0.0014, 14, 6)}><meshStandardMaterial color={hex} roughness={0.5} /></mesh>
      {[0, 1, 2].map((i) => { const x = 0.034 - i * 0.032, f = leg(i + (k > 0 ? 3 : 0)); return <mesh key={i} geometry={tubeG(`lg${k}${i}${Math.round(f * 900)}`, [[x, y0 - 0.002, k * 0.03], [x + f * 0.5, y0 + 0.002, k * 0.054], [x + f, 0.001, k * (0.058 + i * 0.003)]], 0.0027, 12, 6)}><meshStandardMaterial color={hex} roughness={0.5} /></mesh>; })}
    </group>)}
  </group>;
};

export const quilt = (key: string, base = "#f1ece0", line = "#d6cfbf") => <meshStandardMaterial map={tex.text(key, 512, 512, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512); g.strokeStyle = line; g.lineWidth = 4;
  for (let i = -512; i < 1024; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 512, 512); g.moveTo(i + 512, 0); g.lineTo(i, 512); g.stroke(); }
})} roughness={0.95} />;

// puntos de felpa negros; k 0..1 los va mostrando
export const Specks: React.FC<{ id: number; n: number; w: number; d: number; p?: V3; k?: number; size?: number }> = ({ id, n, w, d, p = [0, 0, 0], k = 1, size = 0.011 }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const v = sv(k * n > i ? 1 : 0.001), x = (rn(i, id) - 0.5) * w, z = (rn(i, id + 1) - 0.5) * d, r = size * (0.6 + rn(i, id + 2) * 0.8);
    return <mesh key={i} position={[x, 0.004, z]} scale={[v, 0.32 * v, v]}><sphereGeometry args={[r, 10, 8]} /><meshStandardMaterial color="#14100e" roughness={0.7} /></mesh>; })}
</group>;

// cama chica (largo 0,9 en x, ancho 0,56 en z, patas 0,16)
export const MiniBed: React.FC<{ p?: V3; ry?: number; s?: number; messy?: boolean; id?: string; legs?: boolean }> = ({ p = [0, 0, 0], ry = 0, s = 1, messy = false, id = "b", legs = true }) => <group position={p} rotation={[0, ry, 0]} scale={sv(s)}>
  {legs && [[-0.4, -0.24], [0.4, -0.24], [-0.4, 0.24], [0.4, 0.24]].map(([x, z], i) => <RBox key={i} s={[0.05, 0.16, 0.05]} p={[x, 0.08, z]} r={0.005}>{M.wood({ rx: 1, ry: 2, base: [120, 84, 52] })}</RBox>)}
  <RBox s={[0.92, 0.05, 0.56]} p={[0, 0.18, 0]} r={0.008}>{M.wood({ rx: 2, ry: 1, base: [132, 94, 60] })}</RBox>
  <RBox s={[0.05, 0.42, 0.56]} p={[-0.46, 0.3, 0]} r={0.01}>{M.wood({ rx: 1, ry: 2, base: [116, 80, 50] })}</RBox>
  <RBox s={[0.88, 0.1, 0.52]} p={[0, 0.25, 0]} r={0.03}>{quilt(`qm${id}`)}</RBox>
  <RBox s={[0.58, 0.04, 0.54]} p={[0.15, 0.315, 0]} rot={messy ? [0.05, 0.1, 0.03] : [0, 0, 0]} r={0.016}><meshStandardMaterial color={messy ? "#8d6a55" : "#5d7b8e"} roughness={0.95} /></RBox>
  <RBox s={[0.2, 0.06, 0.34]} p={[-0.3, 0.335, 0]} rot={messy ? [0.2, 0.3, 0.1] : [0, 0, 0]} r={0.028}><meshStandardMaterial color="#f7f4ec" roughness={0.9} /></RBox>
</group>;

// vaso liso abierto arriba (alto h, radio r); sentado en p
export const SlickCup: React.FC<{ p?: V3; r?: number; h?: number }> = ({ p = [0, 0, 0], r = 0.07, h = 0.07 }) => <mesh position={[p[0], p[1] + h / 2, p[2]]}><cylinderGeometry args={[r * 1.08, r, h, 40, 1, true]} /><meshPhysicalMaterial color="#e8f2f4" transparent opacity={0.34} roughness={0.08} clearcoat={1} side={2} depthWrite={false} /></mesh>;

// vapor o aire: bolitas que suben; dir (x,z) tuerce
export const Steam: React.FC<{ tt: number; p: V3; n?: number; w?: number; h?: number; col?: string; o?: number; dir?: [number, number] }> = ({ tt, p, n = 16, w = 0.12, h = 0.6, col = "#f2f2ee", o = 0.34, dir = [0, 0] }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const u = (tt * 0.55 + rn(i, 7)) % 1, r = 0.02 + u * 0.06; return <mesh key={i} position={[(rn(i, 8) - 0.5) * w * (1 + u) + dir[0] * u, u * h, (rn(i, 9) - 0.5) * w + dir[1] * u]}><sphereGeometry args={[r, 12, 9]} /><meshStandardMaterial color={col} roughness={1} transparent opacity={o * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
</group>;

// número/palabra pintados en una tapa
export const faceTex = (key: string, txt: string, bg = "#e9dfc9", ink = "#2a2119", fs = 150) => tex.text(key, 256, 256, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, 256, 256); g.fillStyle = ink; g.font = `800 ${fs}px Georgia, serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 138);
});

// camina por una lista de puntos (x,z) a tramos iguales, u 0..1 → posición y rumbo (rotación y para Bug)
export const walk = (pts: [number, number][], u: number) => {
  const n = pts.length - 1, f = Math.min(n - 1e-4, Math.max(0, u) * n), i = Math.floor(f), k = f - i, [a, b] = pts[i], [c, d] = pts[i + 1];
  return { x: a + (c - a) * k, z: b + (d - b) * k, ry: Math.atan2(-(d - b), c - a) };
};
