// ohf30d · kit del zócalo de agua caliente (hot water baseboard) en 3D: el caño de cobre con sus aletas de aluminio (instanciadas,
// cada una con su color de calor / polvo / torcida), la tapa frontal pintada con su rejilla, las tapas de punta, el damper, la
// purga de moneda (coin vent), la válvula esférica, la manguera, el balde, la caldera con su manómetro y la pared del cuarto.
// Nada se exporta con prefijo H (body_gen sólo mapea los H…).
import React from "react";
import * as THREE from "three";
import { M, RBox, eio, lerp, tubeG } from "./h3d";

const PI = Math.PI;
type V3 = [number, number, number];
export const BH = 0.2, BD = 0.085, PY = 0.075; // alto y fondo del zócalo; altura del caño
export const CU = "#b8703a";
const enamel = (c = "#e7dfcf") => <meshStandardMaterial color={c} roughness={0.42} metalness={0.25} />;
const C_AL = new THREE.Color("#b9bec4"), C_HOT = new THREE.Color("#ff8a3a"), C_COLD = new THREE.Color("#7fa6d8"), C_DUST = new THREE.Color("#6d6458"), _c = new THREE.Color();

// pared del cuarto (yeso pintado) con zócalo de madera abajo; z=0 es la cara de la pared
export const RoomWall: React.FC<{ w?: number; h?: number; col?: string; z?: number }> = ({ w = 4, h = 2.2, col = "#d9cdb8", z = -0.005 }) => <>
  <mesh position={[0, h / 2, z - 0.01]} receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial color={col} roughness={0.92} /></mesh>
</>;

// aletas instanciadas a lo largo de x (u 0..1): heat 0..1 = frío azulado → aluminio → naranja; dust 0..1 = gris pelusa; bent 0..1 = torcida
export const Fins: React.FC<{ len: number; n?: number; heat?: (u: number) => number; dust?: (u: number) => number; bent?: (u: number) => number; p?: V3; fs?: number }> = ({ len, n, heat, dust, bent, p = [0, PY, 0], fs = 0.066 }) => {
  const N = n ?? Math.round(len / 0.011);
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const m = React.useMemo(() => new THREE.Matrix4(), []), q = React.useMemo(() => new THREE.Quaternion(), []), e = React.useMemo(() => new THREE.Euler(), []);
  React.useLayoutEffect(() => {
    const im = ref.current; if (!im) return;
    for (let i = 0; i < N; i++) {
      const u = (i + 0.5) / N, b = bent ? bent(u) : 0, x = -len / 2 + u * len;
      e.set(0, 0, b * (0.35 + 0.25 * Math.sin(i * 2.3))); q.setFromEuler(e);
      m.compose(new THREE.Vector3(x, 0, 0), q, new THREE.Vector3(1, 1 - b * 0.18, 1)); im.setMatrixAt(i, m);
      const h = heat ? heat(u) : 0.5, d = dust ? dust(u) : 0;
      _c.copy(h < 0.5 ? C_COLD.clone().lerp(C_AL, h * 2) : C_AL.clone().lerp(C_HOT, (h - 0.5) * 2)).lerp(C_DUST, d * 0.85);
      im.setColorAt(i, _c);
    }
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
  });
  return <group position={p}>
    <instancedMesh ref={ref} args={[undefined, undefined, N]} castShadow>
      <boxGeometry args={[0.0016, fs, fs]} /><meshStandardMaterial color="#ffffff" metalness={0.55} roughness={0.35} />
    </instancedMesh>
  </group>;
};

// pelusa / polvo entre las aletas: motas grises
export const Lint: React.FC<{ len: number; k: number; p?: V3; seed?: number; col?: string }> = ({ len, k, p = [0, PY, 0], seed = 1, col = "#8a8072" }) => k <= 0.01 ? null : <group position={p}>
  {Array.from({ length: 46 }, (_, i) => { const r = (j: number) => { const x = Math.sin((i + seed * 31) * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); };
    return <mesh key={i} position={[-len / 2 + r(1) * len, -0.03 + r(2) * 0.06, -0.02 + r(3) * 0.04]} scale={k * (0.6 + r(4))}><sphereGeometry args={[0.007, 6, 5]} /><meshStandardMaterial color={col} roughness={1} /></mesh>; })}
</group>;

// el zócalo completo. x centrado, y=0 piso, contra la pared en z=0, el cuarto hacia +z.
// cover 0..1 = la tapa frontal se va hacia adelante y abajo; capL/capR 0..1 = la tapa de punta se levanta; damper 0..1 abierto
export const Baseboard: React.FC<{
  len?: number; p?: V3; cover?: number; capL?: number; capR?: number; damper?: number; heat?: (u: number) => number; dust?: (u: number) => number;
  bent?: (u: number) => number; vent?: number; ventA?: number; elec?: boolean; risers?: boolean; col?: string; ghost?: number; children?: React.ReactNode;
}> = ({ len = 1.2, p = [0, 0, 0], cover = 0, capL = 0, capR = 0, damper = 1, heat, dust, bent, vent = -1, ventA = 0, elec = false, risers = true, col = "#e7dfcf", ghost = 1, children }) => {
  const L = len, cv = eio(cover, 0, 1), op = ghost;
  return <group position={p}>
    {/* chapa trasera atornillada a la pared */}
    <RBox s={[L, BH, 0.006]} p={[0, BH / 2 + 0.01, 0.004]} r={0.002}><meshStandardMaterial color="#8d8c86" metalness={0.5} roughness={0.5} /></RBox>
    {/* el elemento: caño de cobre con aletas, o la resistencia eléctrica con su cable */}
    {!elec ? <>
      <mesh rotation={[0, 0, PI / 2]} position={[0, PY, BD / 2]} castShadow><cylinderGeometry args={[0.011, 0.011, L + 0.16, 22]} /><meshStandardMaterial color={CU} metalness={0.9} roughness={0.3} /></mesh>
      <Fins len={L - 0.12} p={[0, PY, BD / 2]} heat={heat} dust={dust} bent={bent} />
      {risers && [-1, 1].map((s) => <group key={s}>
        <mesh position={[s * (L / 2 + 0.08), PY / 2 - 0.02, BD / 2]}><cylinderGeometry args={[0.011, 0.011, PY + 0.04, 18]} /><meshStandardMaterial color={CU} metalness={0.9} roughness={0.3} /></mesh>
        <mesh position={[s * (L / 2 + 0.08), PY, BD / 2]}><sphereGeometry args={[0.0135, 16, 12]} /><meshStandardMaterial color={CU} metalness={0.9} roughness={0.3} /></mesh>
      </group>)}
      {vent >= 0 && <CoinVent p={[-L / 2 + 0.04 + vent * 0, PY + 0.011, BD / 2]} a={ventA} />}
    </> : <>
      <RBox s={[L - 0.1, 0.03, 0.03]} p={[0, PY, BD / 2]} r={0.005}><meshStandardMaterial color="#5a5b5e" metalness={0.6} roughness={0.4} /></RBox>
      {Array.from({ length: Math.round((L - 0.12) / 0.02) }, (_, i) => <RBox key={i} s={[0.003, 0.05, 0.05]} p={[-(L - 0.12) / 2 + i * 0.02, PY, BD / 2]} r={0.001}><meshStandardMaterial color="#9a9da1" metalness={0.6} roughness={0.4} /></RBox>)}
      <RBox s={[0.06, 0.07, 0.05]} p={[-L / 2 + 0.03, PY, BD / 2]} r={0.006}><meshStandardMaterial color="#3c3d40" roughness={0.6} /></RBox>
      <mesh geometry={tubeG("bbwire" + L, [[-L / 2 + 0.03, PY + 0.02, BD / 2 + 0.02], [-L / 2 + 0.0, PY + 0.06, BD / 2 + 0.03], [-L / 2 - 0.02, PY + 0.02, BD / 2 + 0.02], [-L / 2 - 0.03, 0.0, BD / 2]], 0.004)}><meshStandardMaterial color="#1b1b1b" roughness={0.5} /></mesh>
      <mesh geometry={tubeG("bbwire2" + L, [[-L / 2 + 0.035, PY + 0.02, BD / 2 + 0.02], [-L / 2 + 0.01, PY + 0.07, BD / 2 + 0.035], [-L / 2 - 0.015, PY + 0.03, BD / 2 + 0.03], [-L / 2 - 0.02, 0.0, BD / 2]], 0.004)}><meshStandardMaterial color="#e8e6e0" roughness={0.5} /></mesh>
    </>}
    {/* tapa frontal: pantalla pintada con labio arriba (la salida de aire) y el damper; se va hacia el cuarto */}
    <group position={[0, -0.1 * cv, BD + 0.25 * cv]} rotation={[0.5 * cv, 0, 0]} visible={cv < 0.995}>
      <RBox s={[L, BH - 0.03, 0.006]} p={[0, (BH - 0.03) / 2 + 0.012, 0]} r={0.003}>{op < 1 ? <meshStandardMaterial color={col} transparent opacity={op} roughness={0.45} depthWrite={false} /> : enamel(col)}</RBox>
      <RBox s={[L, 0.006, 0.05]} p={[0, BH - 0.012, -0.022]} r={0.002}>{enamel(col)}</RBox>
    </group>
    {/* el damper: una aleta larga articulada adentro, bajo la salida de arriba */}
    <group position={[0, BH - 0.03, BD - 0.02]} rotation={[-(1 - damper) * 1.1, 0, 0]}>
      <RBox s={[L - 0.06, 0.004, 0.05]} p={[0, 0, -0.025]} r={0.0015}><meshStandardMaterial color="#9b9a94" metalness={0.5} roughness={0.45} /></RBox>
    </group>
    {/* tapas de punta: se levantan y quedan flotando */}
    {[[-1, capL], [1, capR]].map(([s, c]) => <group key={s} position={[s * (L / 2 + 0.045), 0.06 * eio(c, 0, 1), 0.04 * eio(c, 0, 1)]} rotation={[0, 0, -s * 0.25 * eio(c, 0, 1)]} visible={c < 0.995}>
      <RBox s={[0.09, BH + 0.004, BD + 0.012]} p={[0, BH / 2 + 0.008, BD / 2 + 0.004]} r={0.008}>{op < 1 ? <meshStandardMaterial color={col} transparent opacity={op * (1 - c)} roughness={0.45} depthWrite={false} /> : <meshStandardMaterial color={col} roughness={0.42} metalness={0.25} transparent={c > 0.6} opacity={1 - Math.max(0, c - 0.6) * 2.5} />}</RBox>
    </group>)}
    {children}
  </group>;
};

// purga de moneda: cuerpo de bronce hexagonal sobre el caño, tornillo con ranura ancha que gira (a en radianes)
export const CoinVent: React.FC<{ p?: V3; a?: number; s?: number; crust?: number }> = ({ p = [0, 0, 0], a = 0, s = 1, crust = 0 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.006, 0]} castShadow><cylinderGeometry args={[0.009, 0.01, 0.012, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
  <mesh position={[0, 0.016, 0]}><cylinderGeometry args={[0.006, 0.006, 0.008, 20]} />{M.brass()}</mesh>
  <group position={[0, 0.021 + a * 0.0012, 0]} rotation={[0, a, 0]}>
    <mesh><cylinderGeometry args={[0.0085, 0.0085, 0.004, 24]} />{M.brass({ col: "#e0b45a" })}</mesh>
    <RBox s={[0.0175, 0.0026, 0.0028]} p={[0, 0.0015, 0]} r={0.0004}><meshStandardMaterial color="#3b2a10" roughness={0.8} /></RBox>
  </group>
  <mesh position={[0.008, 0.012, 0]} rotation={[0, 0, -PI / 2]}><cylinderGeometry args={[0.0018, 0.0018, 0.008, 10]} />{M.brass({ col: "#c99a45" })}</mesh>
  {crust > 0 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[0.011 * Math.cos(i * 1.7), 0.004 + (i % 4) * 0.004, 0.011 * Math.sin(i * 1.7)]} scale={crust}><sphereGeometry args={[0.0035, 6, 5]} /><meshStandardMaterial color={i % 3 ? "#e9ecdf" : "#7fb59a"} roughness={1} /></mesh>)}
</group>;

// moneda (cuarto de dólar genérico, sin cara): canto estriado
export const Coin: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh castShadow><cylinderGeometry args={[0.012, 0.012, 0.0018, 40]} /><meshStandardMaterial color="#c6c8c9" metalness={1} roughness={0.22} /></mesh>
  <mesh><torusGeometry args={[0.0105, 0.0006, 6, 40]} /><meshStandardMaterial color="#9fa3a6" metalness={1} roughness={0.3} /></mesh>
</group>;

// destornillador plano
export const Screwdriver: React.FC<{ p?: V3; rot?: V3; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.012, 0.014, 0.08, 16]} />{M.plastic({ col: "#c9382c" })}</mesh>
  <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.06, 10]} />{M.steel()}</mesh>
  <RBox s={[0.008, 0.008, 0.0015]} p={[0, -0.032, 0]} r={0.0004}>{M.steel()}</RBox>
</group>;

// válvula esférica en línea (eje x): cuerpo de bronce y palanca; open 1 = palanca a lo largo del caño, 0 = cruzada
export const BallValve: React.FC<{ p?: V3; open: number; rot?: V3; s?: number; col?: string }> = ({ p = [0, 0, 0], open, rot = [0, 0, 0], s = 1, col = "#c2302a" }) => <group position={p} rotation={rot} scale={s}>
  <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.07, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
  <mesh castShadow><sphereGeometry args={[0.028, 20, 16]} />{M.brass()}</mesh>
  <mesh position={[0, 0.034, 0]}><cylinderGeometry args={[0.007, 0.007, 0.016, 12]} />{M.steel()}</mesh>
  <group position={[0, 0.044, 0]} rotation={[0, (1 - open) * PI / 2, 0]}>
    <RBox s={[0.1, 0.008, 0.018]} p={[0.04, 0, 0]} r={0.004}>{M.rubber({ col })}</RBox>
  </group>
</group>;

// caño recto de cobre entre dos puntos
export const Cu: React.FC<{ a: V3; b: V3; r?: number; col?: string; em?: string; emI?: number }> = ({ a, b, r = 0.016, col = CU, em = "#000", emI = 0 }) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), L = d.length(), mid = A.clone().add(B).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return <mesh position={mid} quaternion={q} castShadow><cylinderGeometry args={[r, r, L, 20]} /><meshStandardMaterial color={col} metalness={0.9} roughness={0.32} emissive={em} emissiveIntensity={emI} /></mesh>;
};

// manguera de jardín verde por una curva (con su acople de bronce en la punta a)
export const Hose: React.FC<{ id: string; pts: number[][]; r?: number; col?: string }> = ({ id, pts, r = 0.011, col = "#2f7d3a" }) => <>
  <mesh geometry={tubeG("hose" + id, pts, r, 140, 16)} castShadow><meshPhysicalMaterial color={col} roughness={0.38} clearcoat={0.4} /></mesh>
  <mesh position={pts[0] as V3}><cylinderGeometry args={[r * 1.6, r * 1.6, 0.024, 16]} />{M.brass()}</mesh>
</>;

// balde de plástico con agua (y, si se pasa, un tono de agua sucia)
export const Bucket: React.FC<{ p?: V3; s?: number; fill?: number; water?: string; col?: string }> = ({ p = [0, 0, 0], s = 1, fill = 0.7, water = "#6db0dd", col = "#e8e2d4" }) => <group position={p} scale={s}>
  <mesh position={[0, 0.11, 0]} castShadow><cylinderGeometry args={[0.13, 0.11, 0.22, 36, 1, true]} /><meshPhysicalMaterial color={col} roughness={0.4} clearcoat={0.3} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.11, 32]} /><meshStandardMaterial color={col} roughness={0.5} /></mesh>
  <mesh position={[0, 0.22, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.006, 8, 40]} /><meshPhysicalMaterial color={col} roughness={0.4} /></mesh>
  <mesh position={[0, 0.22 * fill, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.11 + 0.02 * fill, 36]} />{M.water({ col: water, op: 0.8 })}</mesh>
</group>;

// caldera de hierro vieja (gabinete) con puerta del quemador; los caños de ida y retorno salen por arriba
export const Boiler: React.FC<{ p?: V3; s?: number; fire?: number; col?: string; children?: React.ReactNode }> = ({ p = [0, 0, 0], s = 1, fire = 0, col = "#2f4a5c", children }) => <group position={p} scale={s}>
  <RBox s={[0.5, 0.74, 0.4]} p={[0, 0.37, 0]} r={0.03}><meshStandardMaterial color={col} metalness={0.35} roughness={0.45} /></RBox>
  <RBox s={[0.3, 0.16, 0.01]} p={[0, 0.18, 0.2]} r={0.01}><meshStandardMaterial color="#1c2a34" metalness={0.4} roughness={0.5} /></RBox>
  {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.24, 0.008, 0.006]} p={[0, 0.13 + i * 0.02, 0.207]} r={0.002}><meshStandardMaterial color="#0e1418" emissive="#ff6a1a" emissiveIntensity={fire * (0.8 + 0.2 * Math.sin(i))} /></RBox>)}
  <RBox s={[0.52, 0.02, 0.42]} p={[0, 0.745, 0]} r={0.008}><meshStandardMaterial color="#26394a" metalness={0.4} roughness={0.4} /></RBox>
  {children}
</group>;

// puntitos que viajan por una polilínea (el agua que circula): u avanza con tt; stop corta en esa fracción
export const FlowDots: React.FC<{ tt: number; pts: V3[]; n?: number; v?: number; r?: number; col?: string; k?: number; stop?: number; z?: number }> = ({ tt, pts, n = 24, v = 0.12, r = 0.007, col = "#ff9a4a", k = 1, stop = 1 }) => {
  if (k <= 0.01) return null;
  const seg = pts.slice(1).map((b, i) => new THREE.Vector3(...b).distanceTo(new THREE.Vector3(...pts[i]))), tot = seg.reduce((a, b) => a + b, 0);
  const at = (u: number): V3 => { let d = u * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const q = d / seg[i], a = pts[i], b = pts[i + 1]; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q)]; } d -= seg[i]; } return pts[pts.length - 1]; };
  return <>{Array.from({ length: n }, (_, i) => { const u = ((tt * v + i / n) % 1); if (u > stop) return null;
    return <mesh key={i} position={at(u)}><sphereGeometry args={[r, 8, 8]} /><meshBasicMaterial color={col} toneMapped={false} transparent opacity={k} /></mesh>; })}</>;
};
