// dur29c · piezas compartidas de los componentes de las 8 ciudades: ladrillo, empedrado, túnel abierto al frente, agua, farol,
// postal con foto real, moneda y hueso. Todo con escala mínima > 0 y luces siempre montadas (rampa de intensidad).
import React from "react";
import * as THREE from "three";
import { M, cl, rn, tex } from "./h3d";
import { useImg } from "./k3";
import { latheG } from "./kb";

export const PI = Math.PI;
export const sm = (x: number) => Math.max(0.001, x);
export const brickT = (b: number[] = [120, 62, 40], rx = 3, ry = 2) => { const t = tex.text("brick" + b.join(",") + rx, 512, 256, (g) => {
  g.fillStyle = "#2a1c14"; g.fillRect(0, 0, 512, 256);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) { const v = (rn(r * 9 + c, 1) - 0.5) * 40, x = c * 64 - (r % 2) * 32; g.fillStyle = `rgb(${b[0] + v},${b[1] + v * 0.6},${b[2] + v * 0.5})`; g.fillRect(x + 2, r * 32 + 2, 60, 28); }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(20,14,10,${0.15 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 256, 2, 2); }
}); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t; };
export const cobbleT = () => { const t = tex.text("cobble", 512, 512, (g) => {
  g.fillStyle = "#26221e"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) { const v = 70 + rn(i, 1) * 50; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.beginPath(); g.ellipse((i % 16) * 32 + 16 + (Math.floor(i / 16) % 2) * 12, Math.floor(i / 16) * 32 + 16, 13, 12, rn(i, 2), 0, 7); g.fill(); }
}); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); return t; };

// medio caño de ladrillo a lo largo de X, abierto hacia la cámara (+Z): se ve el interior
export const Tunnel: React.FC<{ L?: number; R?: number; p?: number[]; col?: number[]; open?: number }> = ({ L = 3, R = 0.45, p = [0, 0, 0], col, open = 0.55 }) =>
  <group position={p as any}>
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[R, R, L, 40, 1, true, PI * (0.5 + open / 2), PI * (2 - open)]} /><meshStandardMaterial map={brickT(col, Math.round(L * 3), 3)} side={THREE.BackSide} roughness={0.9} /></mesh>
  </group>;

export const Water: React.FC<{ w: number; dpt: number; y: number; p?: number[]; col?: string; op?: number }> = ({ w, dpt, y, p = [0, 0, 0], col = "#3a3022", op = 0.82 }) =>
  <mesh position={[p[0], y, p[2]]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w, dpt]} /><meshPhysicalMaterial color={col} roughness={0.08} clearcoat={1} transparent opacity={op} depthWrite={false} /></mesh>;

// farol de hojalata con su luz (la luz está siempre montada; on = 0..1)
export const Lantern: React.FC<{ p?: number[]; s?: number; on?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, on = 1, col = "#ffb860" }) =>
  <group position={p as any} scale={sm(s)}>
    <mesh position={[0, 0.07, 0]}><coneGeometry args={[0.035, 0.03, 12]} />{M.steel({ col: "#5a5650" })}</mesh>
    <mesh><cylinderGeometry args={[0.03, 0.03, 0.1, 12, 1, true]} /><meshStandardMaterial color="#fff2c8" emissive={col} emissiveIntensity={1.5 * on} transparent opacity={0.75} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.055, 0]}><cylinderGeometry args={[0.034, 0.034, 0.012, 12]} />{M.steel({ col: "#5a5650" })}</mesh>
    <mesh position={[0, 0.1, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.018, 0.003, 6, 16]} />{M.steel({ col: "#4a4640" })}</mesh>
    <pointLight intensity={2.2 * on} distance={1.6 * s} decay={1.6} color={col} />
  </group>;

// postal: tarjeta con foto real (frente) y dorso de papel; flip 0..1 la da vuelta
export const Postal: React.FC<{ src: string; back?: string; p?: number[]; rot?: number[]; s?: number; flip?: number; w?: number }> = ({ src, back, p = [0, 0, 0], rot = [0, 0, 0], s = 1, flip = 0, w = 0.3 }) => {
  const a = useImg(src, 0), b = useImg(back ?? src, 0), h = w * 0.66;
  return <group position={p as any} rotation={rot as any} scale={sm(s)}><group rotation={[0, PI * flip, 0]}>
    <mesh position={[0, 0, -0.002]}><boxGeometry args={[w + 0.02, h + 0.02, 0.003]} /><meshStandardMaterial map={tex.paper()} roughness={0.9} /></mesh>
    <mesh position={[0, 0, 0.0005]}><planeGeometry args={[w, h]} /><meshStandardMaterial key={a ? "a1" : "a0"} map={a ?? undefined} color={a ? "#fff" : "#8a7a60"} roughness={0.6} /></mesh>
    <mesh position={[0, 0, -0.0045]} rotation={[0, PI, 0]}><planeGeometry args={[w, h]} /><meshStandardMaterial key={b ? "b1" : "b0"} map={back ? b ?? undefined : tex.paper()} color={back ? "#fff" : "#efe6d2"} roughness={0.8} /></mesh>
  </group></group>;
};

export const Coin: React.FC<{ p: number[]; r?: number; silver?: boolean; rot?: number[] }> = ({ p, r = 0.018, silver, rot = [PI / 2, 0, 0] }) =>
  <mesh position={p as any} rotation={rot as any}><cylinderGeometry args={[r, r, r * 0.18, 20]} />{silver ? M.chrome({ col: "#d8dce0" }) : M.brass({ col: "#b8743a" })}</mesh>;

export const Bone: React.FC<{ p: number[]; rot?: number[]; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p as any} rotation={rot as any} scale={sm(s)}>
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />{M.matte({ col: "#e4d8bc" })}</mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.1, 0, 0]} scale={[1, 1.2, 1]}><sphereGeometry args={[0.022, 10, 8]} />{M.matte({ col: "#e4d8bc" })}</mesh>)}
  </group>;
export const Skull: React.FC<{ p: number[]; rot?: number[]; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) =>
  <group position={p as any} rotation={rot as any} scale={sm(s)}>
    <mesh scale={[1, 0.92, 1.1]}><sphereGeometry args={[0.05, 16, 12]} />{M.matte({ col: "#e6dac0" })}</mesh>
    <mesh position={[0, -0.035, 0.025]} scale={[0.8, 0.5, 0.8]}><sphereGeometry args={[0.04, 12, 8]} />{M.matte({ col: "#dccfb2" })}</mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * 0.018, -0.005, 0.045]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#1a120c" /></mesh>)}
  </group>;

// cuenco/vaso por torno (copa de vidrio, balde, jarro)
export const Goblet: React.FC<{ p?: number[]; s?: number; col?: string; op?: number }> = ({ p = [0, 0, 0], s = 1, col = "#bfe6ff", op = 0.45 }) =>
  <mesh position={p as any} scale={sm(s)} geometry={latheG("copa29c", [[0, 0], [0.06, 0], [0.06, 0.008], [0.008, 0.02], [0.007, 0.1], [0.05, 0.13], [0.07, 0.2], [0.066, 0.2], [0.046, 0.135], [0, 0.12]], 36)}>
    <meshPhysicalMaterial color={col} roughness={0.03} transmission={0.6} transparent opacity={op} clearcoat={1} side={THREE.DoubleSide} />
  </mesh>;

export const ramp = (tt: number, a: number, b: number) => cl((tt - a) / Math.max(0.001, b - a));
