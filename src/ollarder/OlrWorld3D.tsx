// OlrWorld3D — piezas 3D de la despensa (barril, cajón, bolsa, papas, cebollas, manzanas, repollo, zanahorias, frasco, res congelada,
// farol, termómetro) + la CÁMARA por keyframes. three.js por useCurrentFrame (nada de useFrame ni Math.random).
import React, { useMemo } from "react";
import * as THREE from "three";
import { clamp01, smooth, canvasTex, dots } from "./OleDutchOven3D";
import { rnd } from "./OleTheme";

export const camAt = (keys: { t: number; pos: [number, number, number]; tgt: [number, number, number] }[], t: number) => {
  if (t <= keys[0].t) return { pos: keys[0].pos, tgt: keys[0].tgt };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const u = smooth((t - a.t) / Math.max(0.001, b.t - a.t));
      const L = (p: [number, number, number], q: [number, number, number]) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2] + (q[2] - p[2]) * u] as [number, number, number];
      return { pos: L(a.pos, b.pos), tgt: L(a.tgt, b.tgt) };
    }
  }
  const l = keys[keys.length - 1]; return { pos: l.pos, tgt: l.tgt };
};

// ── texturas (una vez por componente)
export const useTex = () => useMemo(() => {
  const wood = canvasTex((c, W, H) => {
    c.fillStyle = "#C79A62"; c.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 32) { c.fillStyle = `rgba(${40 + rnd(y) * 40},${22 + rnd(y + 1) * 20},10,0.35)`; c.fillRect(0, y, W, 3); c.fillStyle = `rgba(255,220,170,${0.05 + rnd(y + 2) * 0.08})`; c.fillRect(0, y + 4, W, 10); }
    dots(c, W, H, 7, 60, "#4A2E14", 1, 3, 0.4);
  }, 256, 256, 2, 2);
  const log = canvasTex((c, W, H) => {
    c.fillStyle = "#B8824E"; c.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 64) { c.fillStyle = "rgba(30,16,6,0.55)"; c.fillRect(0, y, W, 6); c.fillStyle = "rgba(255,210,150,0.12)"; c.fillRect(0, y + 8, W, 18); }
    dots(c, W, H, 3, 80, "#3C2610", 1, 3, 0.35);
  }, 256, 256, 3, 2);
  const earth = canvasTex((c, W, H) => { c.fillStyle = "#8A6642"; c.fillRect(0, 0, W, H); dots(c, W, H, 11, 400, "#3E2A16", 1, 5, 0.6); dots(c, W, H, 17, 200, "#7B5A38", 1, 4, 0.5); dots(c, W, H, 21, 40, "#8A8A86", 2, 6, 0.8); }, 256, 256, 3, 1);
  const snow = canvasTex((c, W, H) => { c.fillStyle = "#EEF3F7"; c.fillRect(0, 0, W, H); dots(c, W, H, 5, 120, "#D3DFE8", 2, 8, 0.6); }, 256, 256, 6, 3);
  const burlap = canvasTex((c, W, H) => { c.fillStyle = "#C9AB74"; c.fillRect(0, 0, W, H); for (let i = 0; i < W; i += 6) { c.fillStyle = "rgba(120,86,40,0.28)"; c.fillRect(i, 0, 2, H); c.fillRect(0, i, W, 2); } }, 128, 128, 1, 1);
  return { wood, log, earth, snow, burlap };
}, []);
export type Tex = ReturnType<typeof useTex>;

const M: React.FC<{ color: string; r?: number; m?: number; map?: any; e?: string; ei?: number; o?: number }> = ({ color, r = 0.8, m = 0, map, e, ei = 0, o }) => (
  <meshStandardMaterial color={color} roughness={r} metalness={m} map={map} emissive={e ?? "#000"} emissiveIntensity={ei} transparent={o !== undefined} opacity={o ?? 1} />
);
type V3 = [number, number, number];
export const Box: React.FC<{ p: V3; s: V3; c?: string; map?: any; o?: number; r?: number; rot?: V3; e?: string; ei?: number }> = ({ p, s, c = "#fff", map, o, r = 0.85, rot, e, ei }) => (
  <mesh position={p} rotation={rot}><boxGeometry args={s} /><M color={map ? "#ffffff" : c} map={map} o={o} r={r} e={e} ei={ei} /></mesh>
);

export const Barrel: React.FC<{ p: V3; s?: number; map: any; lid?: boolean }> = ({ p, s = 1, map }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.36, 0.36, 1, 20]} /><M color="#B5864F" map={map} /></mesh>
    <mesh position={[0, 0.5, 0]} scale={[1.07, 1, 1.07]}><cylinderGeometry args={[0.36, 0.36, 0.7, 20, 1, true]} /><M color="#B5864F" map={map} /></mesh>
    {[0.12, 0.36, 0.64, 0.88].map((y, i) => (<mesh key={i} position={[0, y, 0]}><cylinderGeometry args={[0.375, 0.375, 0.05, 20]} /><M color="#3E3E3C" m={0.6} r={0.45} /></mesh>))}
    <mesh position={[0, 1.005, 0]}><cylinderGeometry args={[0.35, 0.35, 0.03, 20]} /><M color="#C79A60" map={map} /></mesh>
  </group>
);
export const Crate: React.FC<{ p: V3; s?: V3; map: any; children?: React.ReactNode }> = ({ p, s = [0.9, 0.5, 0.6], map, children }) => (
  <group position={p}>
    {[-0.5, -0.17, 0.17, 0.5].map((k, i) => (<mesh key={i} position={[0, (k * s[1]) * 0.9, s[2] / 2]}><boxGeometry args={[s[0], s[1] * 0.2, 0.03]} /><M color="#B88E58" map={map} /></mesh>))}
    {[-0.5, -0.17, 0.17, 0.5].map((k, i) => (<mesh key={"b" + i} position={[0, (k * s[1]) * 0.9, -s[2] / 2]}><boxGeometry args={[s[0], s[1] * 0.2, 0.03]} /><M color="#B88E58" map={map} /></mesh>))}
    <mesh position={[s[0] / 2, 0, 0]}><boxGeometry args={[0.03, s[1], s[2]]} /><M color="#A87F4A" map={map} /></mesh>
    <mesh position={[-s[0] / 2, 0, 0]}><boxGeometry args={[0.03, s[1], s[2]]} /><M color="#A87F4A" map={map} /></mesh>
    <mesh position={[0, -s[1] / 2 + 0.02, 0]}><boxGeometry args={[s[0], 0.04, s[2]]} /><M color="#8F6A3C" map={map} /></mesh>
    {children}
  </group>
);
export const Sack: React.FC<{ p: V3; s?: number; map: any; color?: string }> = ({ p, s = 1, map, color = "#D2B47C" }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.34, 0]} scale={[0.34, 0.42, 0.24]}><sphereGeometry args={[1, 18, 14]} /><M color={color} map={map} r={1} /></mesh>
    <mesh position={[0, 0.74, 0]}><cylinderGeometry args={[0.07, 0.15, 0.14, 10]} /><M color="#B79A62" map={map} r={1} /></mesh>
  </group>
);
/** montón de papas (n elipsoides) */
export const Potatoes: React.FC<{ p: V3; n?: number; w?: number; d?: number; seed?: number; sprout?: number; green?: number }> = ({ p, n = 18, w = 0.7, d = 0.46, seed = 1, sprout = 0, green = 0 }) => (
  <group position={p}>
    {Array.from({ length: n }, (_, i) => {
      const x = (rnd(seed + i) - 0.5) * w, z = (rnd(seed + i + 50) - 0.5) * d, y = 0.06 + rnd(seed + i + 90) * 0.08;
      const s = 0.08 + rnd(seed + i + 130) * 0.04;
      return (
        <group key={i} position={[x, y, z]} rotation={[rnd(i + seed) * 3, rnd(i + 9) * 3, 0]}>
          <mesh scale={[1.25 * s / 0.1, 0.85 * s / 0.1, s / 0.1]}><sphereGeometry args={[0.1, 12, 10]} /><M color={green > 0.4 && rnd(i + 3) > 0.5 ? "#8FA05A" : i % 3 ? "#B98C5A" : "#A87E4E"} r={0.95} /></mesh>
          {sprout > 0 && i % 2 === 0 ? [0, 1, 2].map((k) => (<mesh key={k} position={[0.02 * k - 0.02, 0.09 + 0.07 * sprout, 0.01 * k]} rotation={[0.3 * (k - 1), 0, 0.25 * (k - 1)]}><cylinderGeometry args={[0.006, 0.006, 0.16 * sprout + 0.001, 5]} /><M color="#F1F4DC" r={0.6} /></mesh>)) : null}
        </group>
      );
    })}
  </group>
);
export const Apples: React.FC<{ p: V3; n?: number; w?: number; d?: number; seed?: number }> = ({ p, n = 12, w = 0.7, d = 0.46, seed = 3 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => (<mesh key={i} position={[(rnd(seed + i) - 0.5) * w, 0.06 + rnd(seed + i + 40) * 0.07, (rnd(seed + i + 80) - 0.5) * d]}><sphereGeometry args={[0.075, 12, 10]} /><M color={i % 4 === 0 ? "#B02A24" : "#C93A30"} r={0.45} /></mesh>))}</group>
);
export const Cabbages: React.FC<{ p: V3; n?: number }> = ({ p, n = 3 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => (<mesh key={i} position={[(i - (n - 1) / 2) * 0.3, 0.14, 0]}><sphereGeometry args={[0.15, 14, 12]} /><M color={i % 2 ? "#86B862" : "#78AD55"} r={0.7} /></mesh>))}</group>
);
export const OnionBraid: React.FC<{ p: V3; n?: number }> = ({ p, n = 7 }) => (
  <group position={p}>
    <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.012, 0.012, 0.9, 6]} /><M color="#A88A4E" /></mesh>
    {Array.from({ length: n }, (_, i) => (<mesh key={i} position={[(i % 2 ? 0.05 : -0.05), -0.12 - i * 0.1, (i % 3 - 1) * 0.02]} scale={[1, 0.85, 1]}><sphereGeometry args={[0.065, 12, 10]} /><M color={i % 2 ? "#E1B552" : "#D9A63F"} r={0.55} /></mesh>))}
  </group>
);
export const Carrots: React.FC<{ p: V3; n?: number; bitter?: number }> = ({ p, n = 8, bitter = 0 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => (<mesh key={i} position={[(rnd(i + 2) - 0.5) * 0.22, 0.17, (rnd(i + 8) - 0.5) * 0.18]} rotation={[0, 0, (rnd(i + 5) - 0.5) * 0.25]}><coneGeometry args={[0.028, 0.34, 7]} /><M color={bitter > 0.5 ? "#8C6335" : "#E4772B"} r={0.7} /></mesh>))}</group>
);
export const Jar: React.FC<{ p: V3; s?: number; fill?: string }> = ({ p, s = 1, fill = "#E8C26A" }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.07, 0.07, 0.24, 14]} /><meshStandardMaterial color="#DCEBF2" transparent opacity={0.35} roughness={0.1} /></mesh>
    <mesh position={[0, 0.095, 0]}><cylinderGeometry args={[0.062, 0.062, 0.17, 14]} /><M color={fill} r={0.5} /></mesh>
    <mesh position={[0, 0.255, 0]}><cylinderGeometry args={[0.066, 0.066, 0.03, 14]} /><M color="#8D9399" m={0.5} /></mesh>
  </group>
);
export const BeefQuarter: React.FC<{ p: V3; frost?: number; rot?: number }> = ({ p, frost = 1, rot = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.26, 0]} scale={[0.32, 0.46, 0.2]}><sphereGeometry args={[1, 16, 12]} /><M color="#8E2F2A" r={0.6} /></mesh>
    <mesh position={[0, 0.3, 0]} scale={[0.335, 0.48, 0.215]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#DDEBF5" transparent opacity={0.3 * frost} roughness={0.9} /></mesh>
    <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[0.012, 0.012, 0.5, 6]} /><M color="#3E3E3C" m={0.6} /></mesh>
  </group>
);
export const Lantern3D: React.FC<{ p: V3; flick?: number; color?: string }> = ({ p, flick = 1, color = "#FFB45E" }) => (
  <group position={p}>
    <mesh><cylinderGeometry args={[0.06, 0.06, 0.2, 10]} /><meshStandardMaterial color="#FFE2A0" emissive="#FFB45E" emissiveIntensity={1.4 * flick} transparent opacity={0.85} /></mesh>
    <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.07, 0.04, 0.05, 10]} /><M color="#3E3E3C" m={0.5} /></mesh>
    <pointLight intensity={4.2 * flick} distance={5} decay={1.6} color={color} />
  </group>
);
/** termómetro 3D: tubo + bulbo + líquido a altura `lvl` (0-1) */
export const Thermo3D: React.FC<{ p: V3; lvl: number; color: string; s?: number }> = ({ p, lvl, color, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.09, 0.62, 0.02]} /><M color="#F4EFE3" /></mesh>
    <mesh position={[0, 0.06 + 0.26 * lvl, 0.012]}><boxGeometry args={[0.025, 0.12 + 0.52 * lvl, 0.012]} /><M color={color} e={color} ei={0.55} /></mesh>
    <mesh position={[0, 0.02, 0.012]}><sphereGeometry args={[0.05, 12, 10]} /><M color={color} e={color} ei={0.55} /></mesh>
  </group>
);
/** tabla cortada de un recinto: suelo + 3 paredes de troncos (el frente queda abierto) */
export const Room: React.FC<{ x0: number; x1: number; y0?: number; h: number; z0: number; z1: number; tex: Tex; wall?: string; floor?: string; wallOp?: number }> = ({ x0, x1, y0 = 0, h, z0, z1, tex, wall = "#9A6C3E", floor = "#B88E58", wallOp }) => {
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  return (
    <group>
      <Box p={[cx, y0 - 0.04, cz]} s={[w, 0.08, d]} c={floor} map={tex.wood} />
      <Box p={[cx, y0 + h / 2, z0]} s={[w, h, 0.12]} c={wall} map={tex.log} o={wallOp} />
      <Box p={[x0, y0 + h / 2, cz]} s={[0.12, h, d]} c={wall} map={tex.log} o={wallOp} />
      <Box p={[x1, y0 + h / 2, cz]} s={[0.12, h, d]} c={wall} map={tex.log} o={wallOp} />
    </group>
  );
};
export { clamp01, smooth };
