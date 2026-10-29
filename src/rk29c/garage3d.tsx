// rk29c · piezas 3D del garage: caja fuerte, losa, portón con ventanitas, tablero de herramientas, carrito, latas, termotanque, caja de cartón.
// Se apoyan en studio3d.tsx (RB, Mat, useTex3). heroes3*.tsx sólo las acomodan y las mueven.
import React from "react";
import * as THREE from "three";
import { RB, Mat, type V3 } from "./studio3d";

// caja fuerte: cuerpo de acero, puerta con dial y manija (open 0..1 abre hasta 100°), pernos al piso, manijas de mudanza
export const Safe3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; dial?: number; bolts?: number; boltGlow?: number; handles?: number; col?: string; ghost?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, dial = 0, bolts = 0, boltGlow = 0, handles = 0, col = "#3d4148", ghost = 0 }) => {
  const op = ghost > 0 ? 1 - 0.85 * ghost : undefined;
  return <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0.5, 0]} s={[0.7, 1.0, 0.65]} rad={0.04} c={col} r={0.35} m={0.65} op={op} />
    <group position={[-0.33, 0.5, 0.33]} rotation={[0, -open * 1.75, 0]}>
      <RB p={[0.33, 0, 0.01]} s={[0.62, 0.9, 0.04]} rad={0.02} c="#34383f" r={0.35} m={0.65} op={op} />
      <group position={[0.33, 0.12, 0.04]} rotation={[0, 0, dial]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.1, 0.035, 40]} /><Mat c="#c9ced4" m={1} r={0.2} op={op} /></mesh>
        {[...Array(12)].map((_, i) => { const a = (i / 12) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.075, Math.sin(a) * 0.075, 0.019]} rotation={[0, 0, a]}><planeGeometry args={[0.016, 0.003]} /><meshBasicMaterial color="#1a1a1a" /></mesh>; })}
      </group>
      <group position={[0.5, -0.1, 0.05]}><RB p={[0, 0, 0]} s={[0.035, 0.18, 0.04]} rad={0.012} c="#c9ced4" m={1} r={0.2} op={op} /></group>
    </group>
    {[[-0.28, -0.25], [0.28, -0.25], [-0.28, 0.25], [0.28, 0.25]].map(([x, z], i) => <mesh key={i} position={[x, -0.04 * bolts + 0.015, z]}>
      <cylinderGeometry args={[0.025, 0.025, 0.08 + 0.12 * bolts, 12]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} emissive="#ffb257" emissiveIntensity={boltGlow} toneMapped={boltGlow < 0.1} />
    </mesh>)}
    {handles > 0 && [-1, 1].map((sd) => <group key={sd} position={[sd * (0.35 + 0.05 * handles), 0.6, 0]} scale={handles}>
      <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.07, 0.015, 8, 24, Math.PI]} /><Mat c="#1a1a1a" r={0.4} /></mesh>
    </group>)}
  </group>;
};

// losa de concreto (bloque con canto visible); `cut` muestra el corte con piedras
export const Slab3: React.FC<{ p?: V3; s?: V3; cut?: boolean }> = ({ p = [0, -0.2, 0], s = [4, 0.4, 3], cut = false }) => <group position={p}>
  <RB p={[0, 0, 0]} s={s} rad={0.01} c="#9a978f" r={0.95} />
  {cut && [...Array(40)].map((_, i) => { const r1 = Math.sin(i * 12.9898) * 43758.5453 % 1, r2 = Math.sin(i * 78.233) * 43758.5453 % 1; return <mesh key={i} position={[(Math.abs(r1) - 0.5) * s[0] * 0.95, (Math.abs(r2) - 0.5) * s[1] * 0.8, s[2] / 2 + 0.002]}><circleGeometry args={[0.02 + 0.03 * Math.abs(r2), 8]} /><meshBasicMaterial color="#6e6b64" /></mesh>; })}
</group>;

// portón de garage con fila de ventanitas; up 0..1 lo levanta (los paneles se van hacia arriba y atrás)
export const GDoor3: React.FC<{ p?: V3; up?: number; w?: number; win?: boolean; frost?: number; frame?: boolean }> = ({ p = [0, 0, 0], up = 0, w = 2.8, win = true, frost = 0, frame = true }) => <group position={p}>
  {frame && <>
    <RB p={[-w / 2 - 0.5, 1.3, 0]} s={[1.0, 2.6, 0.2]} rad={0.01} c="#d8d2c4" r={0.9} />
    <RB p={[w / 2 + 0.5, 1.3, 0]} s={[1.0, 2.6, 0.2]} rad={0.01} c="#d8d2c4" r={0.9} />
    <RB p={[0, 2.45, 0]} s={[w + 2, 0.3, 0.2]} rad={0.01} c="#d8d2c4" r={0.9} />
  </>}
  {[0, 1, 2, 3].map((i) => { const y = 0.29 + i * 0.56, lift = Math.min(1, up * 1.2); return <group key={i} position={[0, y + 2.1 * lift - Math.max(0, (y + 2.1 * lift) - 2.35), 0.02 - Math.max(0, (y + 2.1 * lift) - 2.35)]} rotation={[-Math.PI / 2 * Math.min(1, Math.max(0, (y + 2.1 * lift - 2.35) / 0.5)), 0, 0]}>
    <RB s={[w, 0.54, 0.06]} rad={0.01} c="#ecebe6" r={0.6} />
    {win && i === 2 && [...Array(4)].map((_, j) => <group key={j} position={[-w / 2 + w / 8 + j * w / 4, 0, 0.032]}>
      <mesh><planeGeometry args={[w / 4 - 0.18, 0.3]} /><meshPhysicalMaterial color="#cfe4ff" transmission={0.6 - 0.5 * frost} roughness={0.05 + 0.85 * frost} transparent opacity={0.35 + 0.6 * frost} /></mesh>
    </group>)}
  </group>; })}
</group>;

// tablero de herramientas con siluetas pintadas (lit = índice de silueta prendida)
export const Peg3: React.FC<{ p?: V3; lit?: number[]; tools?: boolean }> = ({ p = [0, 0, 0], lit = [], tools = true }) => <group position={p}>
  <RB p={[0, 0, 0]} s={[1.8, 1.0, 0.03]} rad={0.005} c="#c8a878" r={0.85} />
  {[...Array(60)].map((_, i) => <mesh key={i} position={[-0.85 + (i % 12) * 0.155, -0.42 + Math.floor(i / 12) * 0.21, 0.016]}><circleGeometry args={[0.008, 6]} /><meshBasicMaterial color="#5a4630" /></mesh>)}
  {[[-0.6, 0.15, 0.5, 0.06], [-0.15, 0.1, 0.12, 0.6], [0.3, 0.12, 0.42, 0.12], [0.65, 0.0, 0.18, 0.4], [-0.55, -0.25, 0.3, 0.1], [0.2, -0.3, 0.5, 0.08]].map(([x, y, w, h], i) => <group key={i} position={[x, y, 0.017]}>
    <mesh><planeGeometry args={[w + 0.04, h + 0.04]} /><meshBasicMaterial color={lit.includes(i) ? "#ffb257" : "#2a2016"} toneMapped={!lit.includes(i)} /></mesh>
    {tools && <RB p={[0, 0, 0.02]} s={[w, h, 0.03]} rad={0.01} c={["#c9ced4", "#a33", "#2a5a9a", "#d8a030", "#c9ced4", "#444"][i]} r={0.4} m={0.6} />}
  </group>)}
</group>;

// carrito de carga (hand truck): ruedas, placa, manijas; tilt inclina hacia atrás
export const Dolly3: React.FC<{ p?: V3; rot?: V3; s?: number; tilt?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, tilt = 0, col = "#c23a2a" }) => <group position={p} rotation={rot} scale={s}>
  <group position={[0, 0.12, 0]} rotation={[-tilt, 0, 0]}>
    {[-0.2, 0.2].map((x, i) => <mesh key={i} position={[x, 0.55, -0.05]}><cylinderGeometry args={[0.02, 0.02, 1.2, 10]} /><Mat c={col} m={0.5} r={0.4} /></mesh>)}
    <RB p={[0, 1.13, -0.05]} s={[0.44, 0.04, 0.04]} rad={0.012} c="#1a1a1a" r={0.6} />
    <RB p={[0, -0.08, 0.1]} s={[0.44, 0.02, 0.24]} rad={0.004} c="#9aa0a8" m={1} r={0.3} />
  </group>
  {[-0.26, 0.26].map((x, i) => <mesh key={i} position={[x, 0.12, -0.05]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.12, 0.12, 0.06, 24]} /><Mat c="#1a1a1a" r={0.8} /></mesh>)}
</group>;

// lata de pintura (gris, con etiqueta)
export const Can3: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, c = "#c8c4ba" }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.09, 0.09, 0.2, 32]} /><Mat c="#b5b9bf" m={0.8} r={0.35} /></mesh>
  <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.0905, 0.0905, 0.12, 32, 1, true]} /><Mat c={c} r={0.8} /></mesh>
  <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.085, 0.006, 6, 32]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
</group>;

// termotanque
export const Heater3: React.FC<{ p?: V3; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.28, 0.28, 1.3, 40]} /><Mat c="#e8e6e0" r={0.4} m={0.2} /></mesh>
  <mesh position={[0, 1.31, 0]}><cylinderGeometry args={[0.24, 0.28, 0.04, 40]} /><Mat c="#c9ced4" m={0.8} r={0.3} /></mesh>
  {[-0.08, 0.08].map((x, i) => <mesh key={i} position={[x, 1.45, 0]}><cylinderGeometry args={[0.02, 0.02, 0.26, 10]} /><Mat c="#b87333" m={1} r={0.3} /></mesh>)}
</group>;

// caja de cartón
export const Box3: React.FC<{ p?: V3; rot?: V3; s?: V3; open?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = [0.6, 0.45, 0.45], open = 0 }) => <group position={p} rotation={rot}>
  <RB p={[0, s[1] / 2, 0]} s={s} rad={0.01} c="#b8905a" r={0.9} />
  <RB p={[0, s[1] + 0.002, 0]} s={[s[0], 0.004, 0.05]} rad={0.001} c="#d8c48a" r={0.6} />
  {open > 0 && [-1, 1].map((sd) => <group key={sd} position={[0, s[1], sd * s[2] / 2]} rotation={[sd * open * 2, 0, 0]}><RB p={[0, 0, -sd * s[2] / 4]} s={[s[0], 0.01, s[2] / 2]} rad={0.002} c="#b8905a" r={0.9} /></group>)}
</group>;

// silueta oscura de ladrón con foco (opcional)
export const Torch3: React.FC<{ p: V3; tgt: THREE.Object3D; on?: number; angle?: number }> = ({ p, tgt, on = 1, angle = 0.3 }) => <spotLight position={p} target={tgt} angle={angle} penumbra={0.4} intensity={28 * on} distance={8} color="#fff1d0" castShadow />;
