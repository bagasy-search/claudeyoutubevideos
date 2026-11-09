// ohf8pd · el taller del roedor: ratón y rata 3D, lápiz, cobre, trampa, balde, muro de piedra, bastidor de pared.
import React from "react";
import * as THREE from "three";
import { M, RBox, lerp, rn, tex, tubeG } from "./h3d";

export const PI = Math.PI;
export type V3 = [number, number, number];
export const sv = (k: number) => Math.max(0.001, k);

// ratón apuntando a +x. run = fase de trote (segundos); s = escala; stand = se para y husmea (0..1)
export const Mouse: React.FC<{ p?: V3; ry?: number; rz?: number; s?: number; run?: number; col?: string; rat?: boolean; stand?: number }> = ({ p = [0, 0, 0], ry = 0, rz = 0, s = 1, run = 0, col, rat = false, stand = 0 }) => {
  const c = col ?? (rat ? "#6a5a4b" : "#8a7d70"), b = Math.abs(Math.sin(run * 11)) * 0.006, leg = (i: number) => Math.sin(run * 11 + (i % 2 ? PI : 0)) * 0.014, ss = rat ? 1.7 : 1;
  const nod = Math.sin(run * 3.1) * 0.05;
  return <group position={p} rotation={[0, ry, rz]} scale={sv(s * ss)}>
    <group position={[0, b, 0]} rotation={[0, 0, stand * 0.5]}>
      <mesh position={[-0.008, 0.036, 0]} scale={[1.65, 1, 1]} castShadow><sphereGeometry args={[0.034, 28, 20]} /><meshStandardMaterial color={c} roughness={0.92} /></mesh>
      <mesh position={[-0.05, 0.04, 0]} scale={[1, 1, 1.05]} castShadow><sphereGeometry args={[0.03, 24, 18]} /><meshStandardMaterial color={c} roughness={0.92} /></mesh>
      <group position={[0.05, 0.052, 0]} rotation={[0, 0, nod]}>
        <mesh scale={[1.4, 0.95, 0.95]} castShadow><sphereGeometry args={[0.021, 24, 18]} /><meshStandardMaterial color={c} roughness={0.9} /></mesh>
        <mesh position={[0.031, -0.004, 0]}><sphereGeometry args={[0.0055, 14, 10]} /><meshStandardMaterial color="#d99a9a" roughness={0.4} /></mesh>
        {[-1, 1].map((k) => <group key={k}>
          <mesh position={[0.012, 0.009, k * 0.015]}><sphereGeometry args={[0.0045, 12, 10]} /><meshPhysicalMaterial color="#090909" roughness={0.1} clearcoat={1} /></mesh>
          <mesh position={[-0.008, 0.02, k * 0.017]} rotation={[0, k * 0.7, 0]} scale={[1, 1.15, 0.22]} castShadow><sphereGeometry args={[0.0125, 18, 12]} /><meshStandardMaterial color="#c9a79c" roughness={0.75} /></mesh>
          {[0, 1, 2].map((j) => <mesh key={j} position={[0.038, -0.004 + j * 0.002, k * (0.012 + j * 0.008)]} rotation={[0, k * (0.5 + j * 0.35), 0]}><boxGeometry args={[0.042, 0.0007, 0.0007]} /><meshStandardMaterial color="#e8e2d8" /></mesh>)}
        </group>)}
      </group>
      <mesh geometry={tubeG("mtail", [[-0.078, 0.032, 0], [-0.13, 0.02, 0.008], [-0.18, 0.012, -0.012], [-0.235, 0.012, 0.012]], (u) => 0.0048 * (1 - u * 0.75), 40, 8)} castShadow><meshStandardMaterial color="#c79a90" roughness={0.6} /></mesh>
    </group>
    {[[0.038, 0.016], [0.038, -0.016], [-0.05, 0.02], [-0.05, -0.02]].map(([x, z], i) => <mesh key={i} position={[x + leg(i), 0.006, z]} scale={[1.3, 0.5, 0.8]} castShadow><sphereGeometry args={[0.0085, 12, 10]} /><meshStandardMaterial color="#d3b3a8" roughness={0.7} /></mesh>)}
  </group>;
};

// lápiz amarillo de 6 caras, punta a +x. L largo
export const Pencil: React.FC<{ p?: V3; rot?: V3; L?: number; r?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], L = 0.7, r = 0.022 }) => <group position={p} rotation={rot}>
  <mesh rotation={[0, 0, -PI / 2]} position={[-L * 0.08, 0, 0]} castShadow><cylinderGeometry args={[r, r, L * 0.82, 6]} /><meshStandardMaterial color="#f0b90b" roughness={0.38} /></mesh>
  <mesh rotation={[0, 0, -PI / 2]} position={[L * 0.385, 0, 0]} castShadow><cylinderGeometry args={[r * 0.18, r, L * 0.15, 6]} /><meshStandardMaterial color="#dcb98a" roughness={0.8} /></mesh>
  <mesh rotation={[0, 0, -PI / 2]} position={[L * 0.457, 0, 0]}><coneGeometry args={[r * 0.19, L * 0.035, 12]} /><meshStandardMaterial color="#2b2b2b" roughness={0.5} /></mesh>
  <mesh rotation={[0, 0, -PI / 2]} position={[-L * 0.505, 0, 0]} castShadow><cylinderGeometry args={[r * 1.02, r * 1.02, L * 0.05, 18]} />{M.steel({ col: "#b9b5a8" })}</mesh>
  <mesh rotation={[0, 0, -PI / 2]} position={[-L * 0.56, 0, 0]} castShadow><cylinderGeometry args={[r, r, L * 0.07, 18]} /><meshStandardMaterial color="#d97a7a" roughness={0.75} /></mesh>
</group>;

// mota de malla de cobre: maraña de hebras (seed = forma). w = ancho, h = alto
export const CopperWad: React.FC<{ id: string; p?: V3; w?: number; h?: number; d?: number; rot?: V3; n?: number; k?: number }> = ({ id, p = [0, 0, 0], w = 0.16, h = 0.12, d = 0.12, rot = [0, 0, 0], n = 34, k = 1 }) => <group position={p} rotation={rot} scale={sv(k)}>
  <mesh scale={[w * 0.42, h * 0.42, d * 0.42]}><sphereGeometry args={[1, 20, 16]} /><meshStandardMaterial color="#7a4524" metalness={0.6} roughness={0.6} /></mesh>
  {Array.from({ length: n }, (_, i) => { const pts = Array.from({ length: 6 }, (_, j) => [(rn(i * 7 + j, 2) - 0.5) * w, (rn(i * 7 + j, 3) - 0.5) * h, (rn(i * 7 + j, 4) - 0.5) * d]);
    return <mesh key={i} geometry={tubeG(`cu${id}${i}`, pts, 0.0028, 30, 5)} castShadow><meshStandardMaterial color={i % 3 ? "#d98a4c" : "#f0a765"} metalness={1} roughness={0.28} /></mesh>; })}
</group>;

// trampa de madera vieja: trig = 0 cargada → 1 disparada (el arco gira)
export const SnapTrap: React.FC<{ p?: V3; ry?: number; s?: number; trig?: number; big?: boolean; set?: boolean }> = ({ p = [0, 0, 0], ry = 0, s = 1, trig = 0, big = false, set = true }) => {
  const k = big ? 1.75 : 1, bail = set ? lerp(-PI * 0.92, 0, trig) : 0;
  return <group position={p} rotation={[0, ry, 0]} scale={sv(s * k)}>
    <RBox s={[0.2, 0.012, 0.09]} p={[0, 0.008, 0]} r={0.004}>{M.wood({ rx: 1, ry: 1, base: [196, 150, 96] })}</RBox>
    <RBox s={[0.022, 0.005, 0.04]} p={[0.065, 0.017, 0]} r={0.002}>{M.brass({ col: "#b98f3e" })}</RBox>
    <mesh position={[0.064, 0.022, 0]} scale={[1, 0.45, 1]}><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color="#9c6a2e" roughness={0.75} /></mesh>
    {[-1, 1].map((m) => <mesh key={m} position={[-0.012, 0.024, m * 0.02]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.009, 0.0024, 8, 20]} />{M.steel()}</mesh>)}
    <group position={[-0.012, 0.024, 0]} rotation={[0, 0, bail]}>
      <mesh geometry={tubeG("bail", [[0, 0, -0.038], [0.09, 0, -0.038], [0.09, 0, 0.038], [0, 0, 0.038]], 0.0022, 40, 6)} castShadow>{M.steel()}</mesh>
    </group>
    {set && trig < 0.1 && <mesh geometry={tubeG("armd", [[-0.09, 0.02, 0], [0, 0.03, 0], [0.058, 0.024, 0]], 0.0016, 20, 6)}>{M.steel()}</mesh>}
  </group>;
};

// balde blanco de 20 L abierto arriba; alto 0.36
export const Bucket5: React.FC<{ p?: V3; s?: number; op?: number }> = ({ p = [0, 0, 0], s = 1, op = 1 }) => <group position={p} scale={sv(s)}>
  <mesh position={[0, 0.18, 0]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.125, 0.36, 48, 1, true]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.35} clearcoat={0.4} side={THREE.DoubleSide} transparent={op < 1} opacity={op} depthWrite={op >= 1} /></mesh>
  <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.125, 0.125, 0.004, 40]} /><meshStandardMaterial color="#d7d4cb" roughness={0.5} /></mesh>
  {[0.355, 0.32].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.151 - (0.355 - y) * 0.07, 0.0042, 10, 64]} /><meshPhysicalMaterial color="#f7f5ef" roughness={0.35} clearcoat={0.4} /></mesh>)}
</group>;

// muro de piedra vieja con junta de mortero (textura pintada)
export const stoneTex = (key = "a", rx = 2, ry = 1) => tex.text("stone" + key, 512, 256, (g) => {
  g.fillStyle = "#8c8678"; g.fillRect(0, 0, 512, 256);
  for (let r = 0; r < 5; r++) { let x = -rn(r, 2) * 60; while (x < 512) { const w = 70 + rn(r * 13 + x, 3) * 60, v = 96 + rn(r * 7 + x, 4) * 56, hh = 52;
    g.fillStyle = `rgb(${v + 18},${v + 8},${v - 8})`; g.fillRect(x + 3, r * hh + 3, w - 6, hh - 6);
    for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(30,24,16,${0.05 + 0.12 * rn(i + x, r)})`; g.fillRect(x + 3 + rn(i, x + r) * (w - 9), r * hh + 3 + rn(i, x * 2 + r) * (hh - 9), 2 + rn(i, 8) * 8, 2 + rn(i, 9) * 4); }
    x += w; } }
});

// rótulo «nace» del objeto: resorte con peso + escribe. Usa Tape del okit donde haga falta.
// anillo que abre (sonido, rasquido): plano XY
export const Ring: React.FC<{ tt: number; a: number; p?: V3; r?: number; d?: number; col?: string; rot?: V3 }> = ({ tt, a, p = [0, 0, 0], r = 0.12, d = 0.9, col = "#ffd9a0", rot = [0, 0, 0] }) => { const k = (tt - a) / d; if (k <= 0 || k >= 1) return null;
  return <mesh position={p} rotation={rot}><ringGeometry args={[r * (0.2 + k), r * (0.2 + k) + 0.006, 48]} /><meshBasicMaterial color={col} transparent opacity={0.9 * (1 - k)} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>; };
// luz que entra: rayo de día por una rendija
export const Beam: React.FC<{ p: V3; rot?: V3; len?: number; w?: number; k?: number; col?: string }> = ({ p, rot = [0, 0, 0], len = 0.7, w = 0.03, k = 1, col = "#ffe9b8" }) => <mesh position={p} rotation={rot}><planeGeometry args={[len, w]} /><meshBasicMaterial color={col} transparent opacity={0.34 * k} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>;
