// gary8pa · humo suave compartido
import React from "react";
const PI = Math.PI;
const z1 = (k: number) => Math.max(0.001, k);
type V = [number, number, number];
export const Puffs: React.FC<{ tt: number; p: V; n?: number; per?: number; dir?: V; op?: number; col?: string; s?: number }> = ({ tt, p, n = 5, per = 1.4, dir = [0.25, 0.35, 0], op = 0.5, col = "#9aa0a6", s = 1 }) => <>
  {Array.from({ length: n }, (_, i) => { const u = ((tt + i * per / n) % per) / per;
    return <mesh key={i} position={[p[0] + dir[0] * u, p[1] + dir[1] * u, p[2] + dir[2] * u]} scale={z1(s * (0.03 + 0.09 * u))}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color={col} transparent opacity={op * Math.sin(PI * u)} depthWrite={false} roughness={1} /></mesh>; })}
</>;
