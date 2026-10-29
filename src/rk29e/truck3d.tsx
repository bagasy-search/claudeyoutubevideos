// rk29e · piezas 3D de la camioneta: pickup con caja, volante con barra amarilla, casa simple, gancho de llaves, parrilla de marca.
// Se apoyan en studio3d.tsx (RB, Mat). heroes3*.tsx sólo las acomodan y las mueven.
import React from "react";
import { RB, Mat, type V3 } from "./studio3d";

// camioneta pickup: cabina, caja, ruedas, faros (head 0..1), luces de freno (brake), puerta del conductor (door 0..1)
export const Truck3: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string; head?: number; brake?: number; door?: number; tail?: number; ex?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#8a2a22", head = 0, brake = 0, door = 0, tail = 0, ex = 0 }) => <group position={p} rotation={rot} scale={s}>
  {/* chasis y caja */}
  <RB p={[0, 0.42, -0.55 - 0.4 * ex]} s={[0.95, 0.42, 1.25]} rad={0.04} c={col} r={0.35} m={0.4} />
  <RB p={[0, 0.66, -0.55 - 0.4 * ex]} s={[0.85, 0.06, 1.15]} rad={0.01} c="#1a1a1a" r={0.8} />
  <group position={[0, 0.25, -1.18 - 0.6 * ex]} rotation={[tail * 1.5, 0, 0]}><RB p={[0, 0.17, 0]} s={[0.93, 0.36, 0.04]} rad={0.01} c={col} r={0.35} m={0.4} /></group>
  {/* cabina */}
  <RB p={[0, 0.45, 0.45]} s={[0.95, 0.48, 0.8]} rad={0.05} c={col} r={0.35} m={0.4} />
  <RB p={[0, 0.88, 0.3 + 0.2 * ex]} s={[0.88, 0.4, 0.62]} rad={0.08} c={col} r={0.35} m={0.4} />
  <RB p={[0, 0.9, 0.62 + 0.2 * ex]} s={[0.8, 0.3, 0.02]} rad={0.02} c="#1e2a36" r={0.05} m={0.6} />
  <group position={[0.48, 0.62, 0.65]} rotation={[0, door * 1.1, 0]}><RB p={[0, 0.1, -0.25]} s={[0.03, 0.62, 0.5]} rad={0.02} c={col} r={0.35} m={0.4} /><RB p={[0.0, 0.3, -0.25]} s={[0.035, 0.24, 0.44]} rad={0.02} c="#1e2a36" r={0.05} m={0.6} /></group>
  {/* trompa: parrilla y faros */}
  <RB p={[0, 0.42, 0.86 + 0.3 * ex]} s={[0.9, 0.26, 0.04]} rad={0.02} c="#2a2c31" m={0.8} r={0.3} />
  {[-0.36, 0.36].map((x, i) => <mesh key={i} position={[x, 0.46, 0.88 + 0.3 * ex]}><boxGeometry args={[0.16, 0.08, 0.02]} /><meshBasicMaterial color={head > 0.05 ? "#fff4d6" : "#c9ced4"} toneMapped={head < 0.05} /></mesh>)}
  {[-0.4, 0.4].map((x, i) => <mesh key={"b" + i} position={[x, 0.5, -1.205 - 0.6 * ex]}><boxGeometry args={[0.1, 0.14, 0.02]} /><meshBasicMaterial color={brake > 0.05 ? "#ff3a2a" : "#6a1a14"} toneMapped={brake < 0.05} /></mesh>)}
  {/* ruedas */}
  {[[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.85], [0.5, -0.85]].map(([x, z], i) => <group key={i} position={[x * (1 + 0.6 * ex), 0.2, z * (1 + 0.3 * ex)]}>
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.2, 0.2, 0.14, 28]} /><Mat c="#1a1a1a" r={0.9} /></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.072 : -0.072, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.01, 20]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
  </group>)}
</group>;

// volante con la barra amarilla (bar 0..1 aparece y traba)
export const Wheel3: React.FC<{ p?: V3; rot?: V3; s?: number; bar?: number; spin?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, bar = 0, spin = 0 }) => <group position={p} rotation={rot} scale={s}>
  <group rotation={[0, 0, spin]}>
    <mesh><torusGeometry args={[0.32, 0.035, 14, 48]} /><Mat c="#1e1f24" r={0.6} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.06, 28]} /><Mat c="#2a2c31" r={0.5} /></mesh>
    {[0, 2.1, 4.2].map((a, i) => <RB key={i} p={[Math.cos(a - Math.PI / 2) * 0.17, Math.sin(a - Math.PI / 2) * 0.17, 0]} rot={[0, 0, a]} s={[0.05, 0.24, 0.03]} rad={0.012} c="#2a2c31" r={0.5} />)}
  </group>
  {bar > 0 && <group position={[0, 0.0, 0.06]} scale={[bar, 1, 1]}>
    <RB p={[0, 0, 0]} s={[0.95, 0.07, 0.07]} rad={0.03} c="#f2c230" r={0.4} />
    {[-0.3, 0.3].map((x, i) => <mesh key={i} position={[x, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.015, 8, 20, Math.PI]} /><Mat c="#c9ced4" m={1} r={0.3} /></mesh>)}
  </group>}
</group>;

// casa simple con ventana (lit 0..1) y puerta
export const Home3: React.FC<{ p?: V3; rot?: V3; s?: number; col?: string; lit?: number; roof?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, col = "#e8dcc6", lit = 0, roof = "#6a3a2e" }) => <group position={p} rotation={rot} scale={s}>
  <RB p={[0, 0.5, 0]} s={[1.4, 1.0, 1.1]} rad={0.02} c={col} r={0.9} />
  <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.05, 0.5, 4]} /><Mat c={roof} r={0.85} /></mesh>
  <RB p={[-0.35, 0.6, 0.555]} s={[0.36, 0.3, 0.02]} rad={0.004} c={lit > 0.5 ? "#ffd29f" : "#3a4048"} r={0.5} />
  <RB p={[0.3, 0.33, 0.555]} s={[0.26, 0.6, 0.02]} rad={0.004} c="#5a3a2a" r={0.6} />
</group>;

// gancho de pared con llavero colgado (hang 0..1 = llavero presente)
export const Hook3: React.FC<{ p?: V3; s?: number; hang?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, hang = 1, col = "#17181c" }) => <group position={p} scale={s}>
  <RB p={[0, 0, 0]} s={[0.3, 0.08, 0.03]} rad={0.01} c="#7a4a2a" r={0.6} />
  <mesh position={[0, -0.02, 0.04]} rotation={[0, 0, 0]}><torusGeometry args={[0.025, 0.007, 8, 16, Math.PI]} /><Mat c="#c9ced4" m={1} r={0.3} /></mesh>
  {hang > 0.5 && <group position={[0, -0.12, 0.05]}><mesh position={[0, 0.06, 0]}><torusGeometry args={[0.03, 0.006, 8, 20]} /><Mat c="#c9ced4" m={1} r={0.3} /></mesh><RB p={[0, -0.03, 0]} s={[0.07, 0.12, 0.025]} rad={0.012} c={col} r={0.3} /></group>}
</group>;

// parrilla de marca (para la fila de marcas): placa con color y franjas
export const Grille3: React.FC<{ p?: V3; s?: number; col?: string }> = ({ p = [0, 0, 0], s = 1, col = "#c9ced4" }) => <group position={p} scale={s}>
  <RB s={[0.7, 0.36, 0.06]} rad={0.04} c="#2a2c31" m={0.7} r={0.35} />
  {[-0.1, 0, 0.1].map((y, i) => <RB key={i} p={[0, y, 0.035]} s={[0.6, 0.04, 0.02]} rad={0.01} c={col} m={1} r={0.2} />)}
</group>;
