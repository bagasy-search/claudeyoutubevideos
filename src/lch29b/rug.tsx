// lch29b · kit de alfombra: pelo instanciado que se aplasta y se levanta, plancha de vapor, tenedor, cubito, sillón, toalla.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, rn, tex } from "./h3d";

const PI = Math.PI;

// fondo de alfombra (la trama que se ve entre los mechones)
export const rugTex = (col = "#cbb894") => tex.text("rug" + col, 256, 256, (g) => {
  g.fillStyle = col; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { const v = rn(i, 2) * 40 - 20; g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 250 : 0},${v > 0 ? 240 : 0},${Math.abs(v) / 260})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 2); }
});

// en qué medida un punto cae dentro de un pozo redondo (1 adentro, 0 afuera, borde suave)
export const dent = (x: number, z: number, cx: number, cz: number, r: number) => cl((r - Math.hypot(x - cx, z - cz)) / (r * 0.35) + 0.5);
export const dentLine = (x: number, z: number, x0: number, x1: number, cz: number, w: number) => (x < x0 || x > x1 ? 0 : cl((w - Math.abs(z - cz)) / (w * 0.35) + 0.5));

// PELO: grilla de mechones. sq(x,z) 0 = parado, 1 = aplastado; wet(x,z) oscurece; col base
const _o = new THREE.Object3D(), _c = new THREE.Color();
export const Pile: React.FC<{ w: number; d: number; step?: number; h?: number; r?: number; col?: string; sq?: (x: number, z: number) => number; wet?: (x: number, z: number) => number; shine?: (x: number, z: number) => number; tt: number; p?: number[] }> =
  ({ w, d, step = 0.009, h = 0.022, r = 0.0036, col = "#cbb894", sq, wet, shine, tt, p = [0, 0, 0] }) => {
  const nx = Math.round(w / step), nz = Math.round(d / step), N = nx * nz;
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const geo = React.useMemo(() => { const g = new THREE.CylinderGeometry(r * 0.7, r, h, 6, 1); g.translate(0, h / 2, 0); return g; }, [r, h]);
  React.useLayoutEffect(() => {
    const m = ref.current; if (!m) return;
    const base = new THREE.Color(col);
    for (let i = 0; i < N; i++) {
      const ix = i % nx, iz = Math.floor(i / nx);
      const x = -w / 2 + (ix + 0.5 + 0.35 * (rn(i, 2) - 0.5)) * step, z = -d / 2 + (iz + 0.5 + 0.35 * (rn(i, 3) - 0.5)) * step;
      const s = sq ? cl(sq(x, z)) : 0, a = rn(i, 4) * PI * 2;
      _o.position.set(x, 0, z);
      _o.rotation.set(Math.cos(a) * (0.12 + 1.25 * s), 0, Math.sin(a) * (0.12 + 1.25 * s));
      _o.scale.set(1 + 0.25 * s, Math.max(0.05, (0.85 + 0.3 * rn(i, 5)) * (1 - 0.8 * s)), 1 + 0.25 * s);
      _o.updateMatrix(); m.setMatrixAt(i, _o.matrix);
      const wv = wet ? cl(wet(x, z)) : 0, sh = shine ? cl(shine(x, z)) : 0;
      _c.copy(base).multiplyScalar((0.82 + 0.3 * rn(i, 6)) * (1 - 0.18 * s) * (1 - 0.35 * wv)).lerp(new THREE.Color("#f2ead8"), 0.5 * sh);
      m.setColorAt(i, _c);
    }
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return <group position={p as [number, number, number]}>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={rugTex(col)} color={col} roughness={1} /></mesh>
    <instancedMesh ref={ref} args={[geo, undefined, N]} castShadow receiveShadow><meshStandardMaterial roughness={0.95} /></instancedMesh>
  </group>;
};

// plancha de vapor: suela de punta (chapa cromada con agujeros), cuerpo, tanque transparente, manija y perilla
let _sole: THREE.ExtrudeGeometry | null = null;
const soleG = () => {
  if (_sole) return _sole;
  const s = new THREE.Shape(); s.moveTo(-0.07, -0.045); s.lineTo(0.03, -0.045); s.quadraticCurveTo(0.085, -0.03, 0.105, 0); s.quadraticCurveTo(0.085, 0.03, 0.03, 0.045); s.lineTo(-0.07, 0.045); s.quadraticCurveTo(-0.078, 0, -0.07, -0.045);
  _sole = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 3, curveSegments: 18 });
  _sole.rotateX(-PI / 2); return _sole;
};
export const Iron: React.FC<{ col?: string; hot?: number }> = ({ col = "#2f6fd0", hot = 0 }) => <group>
  <mesh geometry={soleG()} castShadow>{M.chrome()}</mesh>
  {hot > 0 && <mesh position={[0.01, -0.0005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 24]} /><meshBasicMaterial color="#ff8a3a" transparent opacity={0.25 * hot} depthWrite={false} /></mesh>}
  <mesh position={[0.005, 0.03, 0]} scale={[1.05, 0.38, 0.72]} castShadow><sphereGeometry args={[0.085, 32, 18, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color={col} roughness={0.25} clearcoat={0.9} /></mesh>
  <mesh position={[-0.03, 0.035, 0]} scale={[0.7, 0.28, 0.6]}><sphereGeometry args={[0.08, 24, 14, 0, PI * 2, 0, PI / 2]} />{M.glass({ col: "#bfe4ff", op: 0.45 })}</mesh>
  <mesh position={[-0.005, 0.06, 0]}><torusGeometry args={[0.045, 0.011, 12, 28, PI]} /><meshPhysicalMaterial color="#e9e6df" roughness={0.35} clearcoat={0.6} /></mesh>
  <mesh position={[0.045, 0.06, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.009, 0.009, 0.01, 18]} /><meshPhysicalMaterial color="#d23b2c" roughness={0.3} clearcoat={0.6} /></mesh>
  <mesh position={[-0.075, 0.035, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.03, 10]} /><meshStandardMaterial color="#222" /></mesh>
</group>;

// vapor: bocanadas que salen hacia abajo/arriba (k 0..1 intensidad)
export const Steam: React.FC<{ tt: number; k: number; n?: number; up?: number; spread?: number; p?: number[] }> = ({ tt, k, n = 16, up = 1, spread = 0.05, p = [0, 0, 0] }) => <group position={p as [number, number, number]}>
  {k > 0.01 && Array.from({ length: n }, (_, i) => { const ph = (tt * 0.7 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 3) - 0.5) * spread * (1 + ph), up * ph * 0.14, (rn(i, 4) - 0.5) * spread * (1 + ph)]} scale={0.01 + 0.03 * ph}>
    <sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={k * 0.35 * (1 - ph)} roughness={1} depthWrite={false} /></mesh>; })}
</group>;

// tenedor de acero: mango, cuello y cuatro dientes
export const Fork: React.FC = () => <group>
  <RBox s={[0.13, 0.004, 0.016]} p={[-0.075, 0, 0]} r={0.0018}>{M.chrome()}</RBox>
  <RBox s={[0.03, 0.004, 0.022]} p={[0.015, 0, 0]} r={0.0018}>{M.chrome()}</RBox>
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.055, 0, -0.009 + i * 0.006]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0016, 0.0016, 0.05, 6]} />{M.chrome()}</mesh>)}
</group>;

export const IceCube: React.FC<{ s?: number; melt?: number }> = ({ s = 0.026, melt = 0 }) => <group scale={[1 - 0.4 * melt, Math.max(0.05, 1 - 0.85 * melt), 1 - 0.4 * melt]}>
  <RBox s={[s, s, s]} r={s * 0.18}>{M.glass({ col: "#e4f6ff", op: 0.55 })}</RBox>
  <mesh scale={[0.5, 0.5, 0.5]}><boxGeometry args={[s, s, s]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.25} /></mesh>
</group>;

// toalla doblada (con rayita) — wet oscurece
export const Towel: React.FC<{ w?: number; d?: number; col?: string; wet?: number; stripe?: string }> = ({ w = 0.2, d = 0.14, col = "#f6f3ec", wet = 0, stripe = "#bcd4e6" }) => <group>
  <RBox s={[w, 0.012, d]} p={[0, 0.006, 0]} r={0.005}><meshStandardMaterial map={tex.text("towel" + col + stripe, 128, 128, (g) => { g.fillStyle = col; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${0.04 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 128, rn(i, 4) * 128, 1, 2); } g.fillStyle = stripe; g.fillRect(0, 100, 128, 8); })} color={new THREE.Color(col).multiplyScalar(1 - 0.18 * wet)} roughness={1 - 0.3 * wet} /></RBox>
</group>;

// sillón reclinable de corderoy marrón con patas de madera
export const Recliner: React.FC<{ col?: string }> = ({ col = "#6b4a33" }) => {
  const cord = tex.text("cord" + col, 128, 128, (g) => { g.fillStyle = col; g.fillRect(0, 0, 128, 128); for (let x = 0; x < 128; x += 6) { g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x, 0, 2, 128); } });
  const m = <meshStandardMaterial map={cord} roughness={0.95} />;
  return <group>
    <RBox s={[0.42, 0.14, 0.4]} p={[0, 0.16, 0]} r={0.05}>{m}</RBox>
    <RBox s={[0.42, 0.42, 0.12]} p={[0, 0.38, -0.17]} r={0.05}>{m}</RBox>
    {[-1, 1].map((sx) => <RBox key={sx} s={[0.09, 0.2, 0.42]} p={[sx * 0.22, 0.24, 0]} r={0.04}>{m}</RBox>)}
    {[[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]].map(([x, z], i) => <mesh key={i} position={[x, 0.045, z]} castShadow><cylinderGeometry args={[0.018, 0.014, 0.09, 14]} /><meshStandardMaterial map={tex.wood(1, 1, [92, 58, 32])} roughness={0.6} /></mesh>)}
  </group>;
};
export const LEGS = [[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]];

// moneda de 25 centavos, con canto estriado
export const Coin: React.FC<{ r?: number }> = ({ r = 0.012 }) => <group>
  <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[r, r, 0.0018, 40]} /><meshPhysicalMaterial color="#cfd2d6" metalness={1} roughness={0.25} /></mesh>
  {[1, -1].map((s) => <mesh key={s} position={[0, 0, s * 0.00095]} rotation={[0, s < 0 ? PI : 0, 0]}><circleGeometry args={[r * 0.8, 32]} /><meshPhysicalMaterial color="#b9bdc2" metalness={1} roughness={0.45} /></mesh>)}
</group>;
