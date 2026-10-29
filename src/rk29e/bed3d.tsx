// rk29e · kit del dormitorio (29-oct): cama, cómoda, mesa de luz, billetes, billetera, media, caja de zapatos, cajita de acero, libro.
// Todo con RB redondeado + materiales con textura de tela/madera; objetos grandes y reconocibles (vara EVALUADOR).
import React from "react";
import * as THREE from "three";
import { Studio, Wall3, RB, Mat, spr, sm, c01, rnd, type V3 } from "./studio3d";
import { useTxt } from "./lock3d";

export const cam = (p: V3, l: V3, fov = 42): any[] => {
  // entrada planeando desde atrás y de costado (nunca arranca quieta) + deriva lenta
  const d: V3 = [(p[0] - l[0]) * 0.86, (p[1] - l[1]) * 0.86, (p[2] - l[2]) * 0.86];
  p = [l[0] + d[0], l[1] + d[1], l[2] + d[2]];
  return [{ t: 0, p: [l[0] + d[0] * 1.22 - 0.35, l[1] + d[1] * 1.12, l[2] + d[2] * 1.22], l, fov }, { t: 1.5, p, l, fov }, { t: 12, p: [p[0] + 0.2, p[1] + 0.03, p[2] + 0.1], l, fov, arc: 0.03 }];
};
type WK = "brick" | "wood" | "drywall";
type FL = "wood" | "concrete" | "tile" | "paper" | "none";
export const Room: React.FC<{ tt: number; c: any[]; wall?: WK; floor?: FL; z?: number; warm?: number; night?: number; children: React.ReactNode }> = ({ tt, c, wall = "drywall", floor = "wood", z = -0.8, warm = 0.9, night = 0, children }) =>
  <Studio tt={tt} floor={floor} warm={warm} night={night} photo={0} keys={c}>{wall && <Wall3 p={[0, 1.7, z]} s={[14, 3.8, 0.1]} kind={wall} />}{children}</Studio>;
export const Plate: React.FC<{ p: V3; w: number; h: number; txt: string[]; bg?: string; fg?: string; size?: number; rot?: V3; op?: number }> = ({ p, w, h, txt, bg = "#f6f3ec", fg = "#22252b", size = 120, rot, op }) => {
  const m = useTxt(txt, 1024, Math.round(1024 * h / w), bg, fg, size, "Arial Black");
  return <group position={p} rotation={rot}><RB p={[0, 0, -0.012]} s={[w + 0.03, h + 0.03, 0.02]} rad={0.008} c="#2a2c31" r={0.5} op={op} /><mesh><planeGeometry args={[w, h]} /><meshBasicMaterial map={m} transparent={op !== undefined} opacity={op ?? 1} /></mesh></group>;
};
export const drop = (tt: number, a: number, hgt = 1.2) => (1 - spr(tt, a, 8, 0.5)) * hgt;

// ---------- billete (verde, con óvalo y borde) ----------
export const useBillTex = () => React.useMemo(() => {
  const c = document.createElement("canvas"); c.width = 512; c.height = 216; const g = c.getContext("2d")!;
  g.fillStyle = "#cfdcc2"; g.fillRect(0, 0, 512, 216); g.strokeStyle = "#3f6a4a"; g.lineWidth = 10; g.strokeRect(10, 10, 492, 196);
  g.lineWidth = 3; g.strokeRect(26, 26, 460, 164); g.fillStyle = "#5d8a68"; g.beginPath(); g.ellipse(256, 108, 62, 78, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#cfdcc2"; g.beginPath(); g.ellipse(256, 98, 34, 42, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#2f5a3a"; g.font = "bold 54px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("20", 72, 64); g.fillText("20", 440, 152);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}, []);
export const Bill3: React.FC<{ p?: V3; rot?: V3; s?: number; tex: THREE.Texture; curl?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, tex, curl = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow><planeGeometry args={[0.31, 0.13, 8, 1]} /><meshStandardMaterial map={tex} roughness={0.85} side={THREE.DoubleSide} /></mesh>
    {curl > 0 && <mesh position={[0.155, 0.01 * curl, 0]} rotation={[-Math.PI / 2, -0.4 * curl, 0]}><planeGeometry args={[0.02, 0.13]} /><meshStandardMaterial color="#b9c8ac" roughness={0.85} side={THREE.DoubleSide} /></mesh>}
  </group>
);
// fajo de billetes (pila con bordes y una faja)
export const Stack3: React.FC<{ p?: V3; rot?: V3; s?: number; n?: number; tex: THREE.Texture; band?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, n = 12, tex, band = "#c9a25a" }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.0035 * n, 0]} s={[0.31, 0.007 * n, 0.13]} rad={0.004} c="#bccab0" r={0.9} />
    <mesh position={[0, 0.007 * n + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.31, 0.13]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
    {band && <RB p={[0, 0.0035 * n, 0]} s={[0.06, 0.007 * n + 0.006, 0.135]} rad={0.002} c={band} r={0.6} />}
  </group>
);

// ---------- cama (cabecera de madera, colchón, sommier, almohada, frazada) ----------
export const Bed3: React.FC<{ p?: V3; rot?: V3; s?: number; lift?: number; shove?: number; quilt?: string; children?: React.ReactNode }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, lift = 0, shove = 0, quilt = "#6b7f9a", children }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.55, -1.02]} s={[1.5, 1.1, 0.08]} rad={0.04} c="#6a4a32" r={0.55} />
    {[-0.72, 0.72].map((x, i) => <RB key={i} p={[x, 0.12, 0.98]} s={[0.07, 0.24, 0.07]} rad={0.015} c="#5a3c28" r={0.6} />)}
    <RB p={[0, 0.27, 0]} s={[1.44, 0.22, 2.0]} rad={0.05} c="#d8d0c0" r={0.9} />
    <group position={[-0.72, 0.38, 1.0]} rotation={[lift * 0.5, shove * 0.18, 0]}>
      <group position={[0.72 + shove * 0.12, 0.13, -1.0]}>
        <RB s={[1.42, 0.26, 1.98]} rad={0.09} c="#ece6da" r={0.95} />
        <RB p={[0, 0.15, 0.25]} s={[1.46, 0.06, 1.5]} rad={0.03} c={quilt} r={0.95} />
        <RB p={[0, 0.2, -0.72]} s={[1.0, 0.14, 0.38]} rad={0.07} c="#f4f0e8" r={0.95} />
      </group>
    </group>
    {children}
  </group>
);

// ---------- cómoda con 3 cajones (open: cuánto sale cada uno; flip: el de arriba se da vuelta) ----------
export const Dresser3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number[]; col?: string; top?: React.ReactNode; inDrawer?: React.ReactNode[] }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = [0, 0, 0], col = "#7a5638", top, inDrawer = [] }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.55, 0]} s={[1.2, 1.1, 0.55]} rad={0.03} c={col} r={0.55} />
    <RB p={[0, 1.11, 0]} s={[1.26, 0.04, 0.6]} rad={0.015} c="#5e412a" r={0.45} />
    {[0, 1, 2].map((i) => { const y = 0.88 - i * 0.33, o = open[i] ?? 0; return <group key={i} position={[0, y, 0.02 + o * 0.5]}>
      <RB p={[0, 0, 0.26]} s={[1.1, 0.28, 0.04]} rad={0.015} c="#8a6444" r={0.5} />
      {o > 0.02 && <><RB p={[0, -0.1, 0]} s={[1.04, 0.02, 0.5]} rad={0.004} c="#c9a882" r={0.8} />{[-0.51, 0.51].map((x, j) => <RB key={j} p={[x, -0.01, 0]} s={[0.02, 0.2, 0.5]} rad={0.004} c="#b8936a" r={0.8} />)}<RB p={[0, -0.01, -0.24]} s={[1.04, 0.2, 0.02]} rad={0.004} c="#b8936a" r={0.8} /></>}
      {o > 0.02 && inDrawer[i]}
      {[-0.3, 0.3].map((x, j) => <mesh key={j} position={[x, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.04, 16]} /><Mat c="#c9a25a" m={0.9} r={0.3} /></mesh>)}
    </group>; })}
    {top}
  </group>
);

// ---------- mesa de luz con un cajón y lámpara ----------
export const Night3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; lamp?: number; inDrawer?: React.ReactNode; top?: React.ReactNode }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, lamp = 1, inDrawer, top }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.3, 0]} s={[0.55, 0.6, 0.45]} rad={0.025} c="#7a5638" r={0.55} />
    <RB p={[0, 0.62, 0]} s={[0.6, 0.04, 0.5]} rad={0.012} c="#5e412a" r={0.45} />
    <group position={[0, 0.45, 0.02 + open * 0.38]}>
      <RB p={[0, 0, 0.21]} s={[0.5, 0.2, 0.04]} rad={0.012} c="#8a6444" r={0.5} />
      {open > 0.02 && <><RB p={[0, -0.08, 0]} s={[0.46, 0.015, 0.4]} rad={0.003} c="#c9a882" r={0.8} /><RB p={[0, -0.01, -0.19]} s={[0.46, 0.15, 0.015]} rad={0.003} c="#b8936a" r={0.8} />{[-0.22, 0.22].map((x, j) => <RB key={j} p={[x, -0.01, 0]} s={[0.015, 0.15, 0.4]} rad={0.003} c="#b8936a" r={0.8} />)}</>}
      {open > 0.02 && inDrawer}
      <mesh position={[0, 0, 0.245]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.03, 16]} /><Mat c="#c9a25a" m={0.9} r={0.3} /></mesh>
    </group>
    <group position={[-0.14, 0.64, -0.05]}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.07, 0.08, 0.04, 24]} /><Mat c="#3a3a3e" r={0.4} m={0.4} /></mesh>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.012, 0.012, 0.26, 10]} /><Mat c="#c9a25a" m={0.9} r={0.3} /></mesh>
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.08, 0.14, 0.16, 28, 1, true]} /><meshStandardMaterial color="#efe2c4" emissive="#ffd9a0" emissiveIntensity={0.25 * lamp} side={THREE.DoubleSide} roughness={0.9} /></mesh>
      {lamp > 0.01 && <pointLight position={[0, 0.3, 0.05]} intensity={1.2 * lamp} distance={2.2} color="#ffd9a0" />}
    </group>
    {top}
  </group>
);

// ---------- billetera de cuero gastada (abre como libro) ----------
export const Wallet3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; col?: string; worn?: number; thick?: number; children?: React.ReactNode }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, col = "#6a4024", worn = 1, thick = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0.0, 0.012 * thick, 0]} s={[0.22, 0.024 * thick, 0.16]} rad={0.012 * Math.min(1.5, thick)} c={col} r={0.7} />
    <group position={[-0.11, 0.024 * thick, 0]} rotation={[0, 0, -open * Math.PI * 0.95]}>
      <RB p={[0.11, 0.012, 0]} s={[0.22, 0.024, 0.16]} rad={0.012} c={col} r={0.72} />
    </group>
    {worn > 0 && [[-0.1, 0.075], [0.1, 0.075], [-0.1, -0.075], [0.1, -0.075]].map(([x, z], i) => <mesh key={i} position={[x, 0.025 * thick + 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.022, 16]} /><meshStandardMaterial color="#d8c2a6" transparent opacity={0.55 * worn} roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.025 * thick + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.065, 0.07, 32]} /><meshStandardMaterial color="#4a2a16" roughness={0.9} /></mesh>
  </group>
);

// ---------- media de lana enrollada (bulto con rayas) ----------
export const Sock3: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string; stripe?: string; open?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#8a7a64", stripe = "#b22a22", open = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <mesh castShadow scale={[1, 0.8 - 0.3 * open, 1]}><sphereGeometry args={[0.1, 28, 20]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
    {[-0.04, 0.0, 0.04].map((z, i) => <mesh key={i} position={[0, 0, z]} rotation={[0, 0, 0]}><torusGeometry args={[0.096 - Math.abs(z) * 0.4, 0.008, 8, 32]} /><meshStandardMaterial color={i === 1 ? stripe : "#e8e0cc"} roughness={1} /></mesh>)}
    <mesh position={[0.08, 0.02, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.05, 0.06, 0.06, 20]} /><meshStandardMaterial color={col} roughness={1} /></mesh>
  </group>
);

// ---------- caja de zapatos (tapa aparte) ----------
export const ShoeBox3: React.FC<{ p?: V3; rot?: V3; s?: number; lid?: number; col?: string; lidCol?: string; children?: React.ReactNode }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, lid = 0, col = "#d8b48a", lidCol = "#c49a6a", children }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.07, 0]} s={[0.36, 0.14, 0.22]} rad={0.006} c={col} r={0.85} />
    <RB p={[0, 0.141, 0]} s={[0.34, 0.004, 0.2]} rad={0.001} c="#8a6a44" r={0.9} />
    <group position={[0.18 * lid, 0.15 + 0.25 * Math.sin(lid * Math.PI), 0]} rotation={[0, 0, -lid * 1.2]}><RB s={[0.375, 0.04, 0.235]} rad={0.006} c={lidCol} r={0.85} /></group>
    {children}
  </group>
);

// ---------- cajita de acero atornillada (tapa con bisagra atrás) ----------
export const LockBox3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; bolts?: number; col?: string; scr?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, bolts = 0, col = "#4a5058", scr = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.14, 0]} s={[0.5, 0.28, 0.36]} rad={0.02} c={col} m={0.7} r={0.35} />
    <group position={[0, 0.28, -0.18]} rotation={[-open * 1.4, 0, 0]}><RB p={[0, 0.015, 0.18]} s={[0.51, 0.03, 0.37]} rad={0.012} c={col} m={0.7} r={0.32} /></group>
    <RB p={[0, 0.2, 0.182]} s={[0.12, 0.08, 0.01]} rad={0.006} c="#c9ced4" m={0.9} r={0.25} />
    <mesh position={[0, 0.2, 0.19]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.01, 16]} /><Mat c="#1a1a1e" m={0.6} r={0.4} /></mesh>
    {[[-0.2, -0.13], [0.2, -0.13], [-0.2, 0.13], [0.2, 0.13]].map(([x, z], i) => { const b = c01(bolts * 4 - i); return <group key={i} position={[x, 0.005 + 0.12 * (1 - b), z]} rotation={[0, b * 12, 0]}>
      <mesh><cylinderGeometry args={[0.022, 0.022, 0.012, 6]} /><Mat c="#c9ced4" m={0.95} r={0.2} /></mesh>
      {b < 0.99 && <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.008, 0.008, 0.12, 10]} /><Mat c="#9aa0a8" m={0.9} r={0.3} /></mesh>}
    </group>; })}
    {scr > 0 && [...Array(7)].map((_, i) => <RB key={i} p={[-0.18 + i * 0.06, 0.05 + rnd(i, 3) * 0.12, 0.181]} rot={[0, 0, 0.6 + rnd(i, 5) * 0.5]} s={[0.06 * scr, 0.004, 0.002]} rad={0.001} c="#d8dde2" m={1} r={0.2} />)}
  </group>
);

// ---------- libro (tapa dura, lomo con bandas) ----------
export const Book3: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string; w?: number; h?: number; d?: number; open?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#7a2a22", w = 0.06, h = 0.3, d = 0.22, open = 0 }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, h / 2, 0]} s={[w, h, d]} rad={0.006} c={col} r={0.6} />
    <RB p={[0.003, h / 2, 0.004]} s={[w - 0.012, h - 0.01, d - 0.004]} rad={0.002} c="#efe6d2" r={0.95} />
    {[0.22, 0.78].map((k, i) => <RB key={i} p={[0, h * k, d / 2 + 0.001]} s={[w + 0.002, 0.012, 0.004]} rad={0.001} c="#c9a25a" m={0.8} r={0.35} />)}
    {open > 0 && <group position={[w / 2, 0, -d / 2]} rotation={[0, -open * 1.2, 0]}><RB p={[0.005, h / 2, d / 2]} s={[0.008, h, d]} rad={0.002} c={col} r={0.6} /></group>}
  </group>
);

// ---------- placar con estante alto y piso ----------
export const Closet3: React.FC<{ p?: V3; s?: number; doors?: number; children?: React.ReactNode }> = ({ p = [0, 0, 0], s = 1, doors = 1, children }) => (
  <group position={p} scale={s}>
    <RB p={[0, 1.2, -0.32]} s={[1.6, 2.4, 0.04]} rad={0.01} c="#e8e2d6" r={0.9} />
    {[-0.8, 0.8].map((x, i) => <RB key={i} p={[x, 1.2, 0]} s={[0.05, 2.4, 0.68]} rad={0.01} c="#d8d0c0" r={0.85} />)}
    <RB p={[0, 1.85, 0]} s={[1.56, 0.04, 0.62]} rad={0.008} c="#cfc6b4" r={0.8} />
    <mesh position={[0, 1.7, -0.05]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 1.56, 12]} /><Mat c="#c9ced4" m={0.95} r={0.25} /></mesh>
    <RB p={[0, 0.01, 0]} s={[1.56, 0.02, 0.62]} rad={0.004} c="#a8916f" r={0.85} />
    {[-1, 1].map((sd) => <group key={sd} position={[sd * 0.8, 0, 0.36]} rotation={[0, sd * (1 - doors) * 1.6, 0]}><RB p={[-sd * 0.39, 1.2, 0]} s={[0.78, 2.4, 0.04]} rad={0.01} c="#f2eee6" r={0.8} /></group>)}
    {children}
  </group>
);
// prenda colgada (perchero + saco)
export const Coat3: React.FC<{ p?: V3; col?: string; sw?: number }> = ({ p = [0, 0, 0], col = "#4a5a6e", sw = 0 }) => (
  <group position={p} rotation={[0, 0, sw]}>
    <mesh position={[0, -0.03, 0]}><torusGeometry args={[0.03, 0.006, 6, 16, Math.PI]} /><Mat c="#c9ced4" m={0.9} r={0.3} /></mesh>
    <RB p={[0, -0.36, 0]} s={[0.36, 0.6, 0.12]} rad={0.05} c={col} r={0.95} />
  </group>
);
export { sm, spr, c01, rnd };
