// MIO apa8pa · piezas 3D propias de los videos de jardín (escala: 1 pulgada = 0,02 unidades).
import React from "react";
import * as THREE from "three";
import { M, RBox, rn, tex, lerp, tubeG } from "./h3d";
import { grassT, soilT } from "./farmkit";

export type V = [number, number, number];
export const PI = Math.PI;
export const I = 0.02;

// textura repetida a partir de una de canvas (el cache global da repeat fijo)
const REP = new Map<string, THREE.Texture>();
export const rep = (k: string, t: THREE.Texture, x: number, y: number) => { const key = `${k}${x}x${y}`; let c = REP.get(key); if (!c) { c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(x, y); c.needsUpdate = true; REP.set(key, c); } return c; };

export const Lawn: React.FC<{ w?: number; d?: number; y?: number; rx?: number }> = ({ w = 9, d = 9, y = 0, rx = 14 }) =>
  <mesh rotation={[-PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={rep("lawn", grassT(), rx, rx)} roughness={0.95} /></mesh>;
export const Dirt: React.FC<{ w?: number; d?: number; p?: V; rx?: number }> = ({ w = 2, d = 2, p = [0, 0.001, 0], rx = 4 }) =>
  <mesh rotation={[-PI / 2, 0, 0]} position={p} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={rep("dirt", soilT(), rx, rx)} roughness={1} /></mesh>;

// briznas sueltas: part(x,z) devuelve [inclinación x, inclinación z]
export const Blades: React.FC<{ w: number; d: number; n?: number; h?: number; p?: V; col?: string; part?: (x: number, z: number) => [number, number]; seed?: number; skip?: (x: number, z: number) => boolean }> = ({ w, d, n = 240, h = 0.09, p = [0, 0, 0], col = "#5d8a3a", part, seed = 3, skip }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => {
    const x = (rn(i, seed) - 0.5) * w, z = (rn(i, seed + 1) - 0.5) * d; if (skip && skip(x, z)) return null;
    const [lx, lz] = part ? part(x, z) : [0, 0], hh = h * (0.7 + 0.6 * rn(i, seed + 2));
    return <mesh key={i} position={[x + lx * hh * 0.5, hh * 0.5, z + lz * hh * 0.5]} rotation={[lz + (rn(i, seed + 3) - 0.5) * 0.3, rn(i, seed + 4) * 6, -lx + (rn(i, seed + 5) - 0.5) * 0.3]} castShadow>
      <coneGeometry args={[0.0055, hh, 3]} /><meshStandardMaterial color={i % 5 === 0 ? "#7da04a" : i % 7 === 0 ? "#8a8a4a" : col} roughness={0.8} />
    </mesh>;
  })}
</group>;

// EL TOPILLO: rechoncho, orejas chicas, cola corta. Mira hacia +X.
export const Vole: React.FC<{ p?: V; rot?: V; s?: number; walk?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, walk = 0, col = "#6b4f33" }) => {
  const f = (k: number) => 0.012 * Math.sin(walk * 9 + k * PI);
  return <group position={p} rotation={rot} scale={s}>
    <mesh position={[0, 0.042, 0]} scale={[1.42, 0.88, 0.95]} castShadow><sphereGeometry args={[0.05, 32, 24]} />{M.hair({ col })}</mesh>
    <mesh position={[0.058, 0.05, 0]} scale={[1.05, 0.9, 0.95]} castShadow><sphereGeometry args={[0.034, 28, 20]} />{M.hair({ col: "#755739" })}</mesh>
    <mesh position={[0.089, 0.046, 0]} castShadow><sphereGeometry args={[0.0075, 12, 10]} /><meshStandardMaterial color="#c88a80" roughness={0.45} /></mesh>
    {[1, -1].map((k) => <group key={k}>
      <mesh position={[0.07, 0.062, 0.022 * k]}><sphereGeometry args={[0.0058, 14, 12]} /><meshPhysicalMaterial color="#090706" roughness={0.1} clearcoat={1} /></mesh>
      <mesh position={[0.045, 0.078, 0.026 * k]} scale={[0.5, 1, 1]}><sphereGeometry args={[0.009, 12, 10]} /><meshStandardMaterial color="#5c432c" roughness={0.8} /></mesh>
      <mesh position={[0.04 + f(k), 0.006, 0.03 * k]} scale={[1.5, 0.6, 1]} castShadow><sphereGeometry args={[0.009, 10, 8]} /><meshStandardMaterial color="#b89a86" /></mesh>
      <mesh position={[-0.04 - f(k), 0.006, 0.03 * k]} scale={[1.7, 0.6, 1]} castShadow><sphereGeometry args={[0.01, 10, 8]} /><meshStandardMaterial color="#b89a86" /></mesh>
      {[0, 1, 2].map((w2) => <mesh key={w2} position={[0.08, 0.044, (0.012 + 0.004 * w2) * k]} rotation={[0, (0.2 + 0.25 * w2) * k, 0]}><boxGeometry args={[0.04, 0.0006, 0.0006]} /><meshBasicMaterial color="#e8e0d0" /></mesh>)}
    </group>)}
    <mesh position={[-0.078, 0.034, 0]} rotation={[0, 0, 1.25]} castShadow><capsuleGeometry args={[0.0042, 0.03, 6, 10]} /><meshStandardMaterial color="#7a5f4a" roughness={0.7} /></mesh>
  </group>;
};

// LA T de PVC. Brazos sobre X, chimenea hacia +Y. cut = mitad trasera a la vista (corte); door = agujero 1,5" en las tapas
const cylR = 1.5 * I;
const half = (cut: boolean): [number, number] => (cut ? [PI / 2, PI] : [0, PI * 2]);
export const Tee: React.FC<{ p?: V; rot?: V; s?: number; cut?: boolean; arm?: number; riser?: boolean; door?: boolean; r?: number; capGone?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, cut = false, arm = 14, riser = true, door = true, r = cylR, capGone = 0, col = "#f1efe7" }) => {
  const L = arm * I, [ts, tl] = half(cut), mat = M.pvc({ side: THREE.DoubleSide, col });
  return <group position={p} rotation={rot} scale={s}>
    {[1, -1].map((k) => <group key={k}>
      <mesh position={[k * (L / 2 + 0.045), r, 0]} rotation={[0, 0, PI / 2]} castShadow receiveShadow><cylinderGeometry args={[r, r, L, 48, 1, true, ts, tl]} />{mat}</mesh>
      <group position={[k * (L + 0.05 + capGone * 0.25), r, 0]}>
        <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[r * 1.08, r * 1.08, 0.03, 48, 1, true, ts, tl]} />{mat}</mesh>
        {!cut && <mesh position={[k * 0.0151, 0, 0]} rotation={[0, k * PI / 2, 0]}>
          {door ? <ringGeometry args={[0.75 * I, r * 1.08, 48]} /> : <circleGeometry args={[r * 1.08, 48]} />}{mat}</mesh>}
        {cut && door && <mesh position={[k * 0.0151, 0, 0]} rotation={[0, k * PI / 2, 0]}><ringGeometry args={[0.75 * I, r * 1.08, 48, 1, PI / 2 * (k > 0 ? 1 : 1), PI]} />{mat}</mesh>}
        {door && !cut && <mesh position={[k * 0.012, 0, 0]} rotation={[0, k * PI / 2, 0]}><circleGeometry args={[0.75 * I, 32]} /><meshBasicMaterial color="#0a0806" /></mesh>}
      </group>
    </group>)}
    <mesh position={[0, r, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[r * 1.1, r * 1.1, 0.1, 48, 1, true, ts, tl]} />{mat}</mesh>
    {riser && <group>
      <mesh position={[0, r * 2 + 0.06, 0]} castShadow><cylinderGeometry args={[r, r, 0.14, 48, 1, true]} />{mat}</mesh>
      <mesh position={[0, r + 0.02, 0]} castShadow><cylinderGeometry args={[r * 1.1, r * 1.1, 0.07, 48, 1, true]} />{mat}</mesh>
      <mesh position={[0, r * 2 + 0.13, 0]} castShadow><cylinderGeometry args={[r * 1.1, r * 1.1, 0.024, 48]} />{mat}</mesh>
    </group>}
  </group>;
};

// trampa de ratón de madera (mira hacia +X). snap 0 = armada, 1 = cerrada. Largo 4" ancho 1,75"
export const SnapTrap: React.FC<{ p?: V; rot?: V; s?: number; snap?: number; rat?: boolean; dab?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, snap = 0, rat, dab = 0 }) => {
  const k = rat ? 1.9 : 1, a = lerp(PI * 0.96, 0.06, snap);
  return <group position={p} rotation={rot} scale={s * k}>
    <RBox s={[0.08, 0.008, 0.035]} p={[0, 0.004, 0]} r={0.002}><meshStandardMaterial map={tex.wood(1, 1, [188, 148, 96])} roughness={0.8} /></RBox>
    <mesh position={[-0.002, 0.012, 0]} rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[0.006, 0.0018, 8, 20]} />{M.steel({})}</mesh>
    <RBox s={[0.02, 0.0028, 0.012]} p={[0.028, 0.012, 0]} r={0.001}><meshStandardMaterial color="#d8b34a" metalness={0.6} roughness={0.4} /></RBox>
    {dab > 0 && <mesh position={[0.03, 0.016, 0]} scale={[dab, dab * 0.6, dab]}><sphereGeometry args={[0.0065, 16, 12]} />{M.grease({ col: "#b98238" })}</mesh>}
    <group position={[-0.002, 0.011, 0]} rotation={[0, 0, -a]}>
      <mesh position={[0.0, 0, 0.015]} rotation={[0, 0, 0]}><boxGeometry args={[0.001, 0.001, 0.001]} /><meshBasicMaterial color="#000" /></mesh>
      {[0.016, -0.016].map((z) => <mesh key={z} position={[0.018, 0, z]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.0012, 0.0012, 0.036, 8]} />{M.steel({})}</mesh>)}
      <mesh position={[0.036, 0, 0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.0012, 0.0012, 0.033, 8]} />{M.steel({})}</mesh>
    </group>
  </group>;
};

// palito de pintura (1" x 13") con la marca de lápiz a 12"
export const Stick: React.FC<{ p?: V; rot?: V; s?: number; mark?: boolean }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, mark }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.28, 0.005, 0.024]} r={0.002}><meshStandardMaterial map={tex.wood(1, 1, [226, 200, 150])} roughness={0.75} /></RBox>
  {mark && <mesh position={[-0.1, 0.0029, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.003, 0.024]} /><meshBasicMaterial color="#26221c" /></mesh>}
</group>;

export const Shingle: React.FC<{ p?: V; rot?: V; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={rot} scale={s}><RBox s={[0.3, 0.012, 0.24]} r={0.003}><meshStandardMaterial color="#3d3a37" roughness={1} /></RBox>
    {Array.from({ length: 90 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.28, 0.0068, (rn(i, 3) - 0.5) * 0.22]}><sphereGeometry args={[0.0028, 5, 4]} /><meshStandardMaterial color={i % 3 ? "#5a5650" : "#7b736a"} roughness={1} /></mesh>)}
  </group>;

// rodaja de manzana (vista cara arriba) con mordidas de a pares: bites = cantidad
export const AppleSlice: React.FC<{ p?: V; rot?: V; s?: number; bites?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, bites = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.01, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.02, 48]} /><meshPhysicalMaterial color="#b82a24" roughness={0.3} clearcoat={0.7} /></mesh>
  <mesh position={[0, 0.0202, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.067, 48]} /><meshStandardMaterial color="#e6d6a8" roughness={0.7} /></mesh>
  <mesh position={[0, 0.0206, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.019, 0.021, 40]} /><meshBasicMaterial color="#cdbb7e" /></mesh>
  {Array.from({ length: Math.min(bites, 14) }, (_, i) => { const a = i * 0.19 - 1.1, r = 0.058 - 0.008 * (i % 3);
    return <group key={i} position={[r * Math.cos(a), 0.0212, r * Math.sin(a)]} rotation={[-PI / 2, 0, a]}>
      {[-0.0028, 0.0028].map((o) => <mesh key={o} position={[0.0, o, 0]}><planeGeometry args={[0.0085, 0.0036]} /><meshBasicMaterial color="#4e3517" /></mesh>)}
    </group>; })}
</group>;

// tronco joven; ring = fracción de corteza comida alrededor (0..1), band = alto de la banda
const barkT = () => tex.text("bark8", 512, 512, (g) => { g.fillStyle = "#4e3b2a"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 320; i++) { g.strokeStyle = `rgba(${20 + rn(i, 1) * 60},${14 + rn(i, 2) * 40},${8 + rn(i, 3) * 20},.7)`; g.lineWidth = 1 + 4 * rn(i, 4); const x = rn(i, 5) * 512, y = rn(i, 6) * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18 * (rn(i, 7) - 0.5), y + 40 + 90 * rn(i, 8)); g.stroke(); } });
export const Trunk: React.FC<{ p?: V; r?: number; h?: number; ring?: number; band?: number; y0?: number }> = ({ p = [0, 0, 0], r = 0.09, h = 1.3, ring = 0, band = 0.2, y0 = 0.06 }) => <group position={p}>
  <mesh position={[0, h / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[r * 0.82, r, h, 48]} /><meshStandardMaterial map={barkT()} roughness={1} /></mesh>
  {ring > 0 && <mesh position={[0, y0 + band / 2, 0]}><cylinderGeometry args={[r * 1.012, r * 1.016, band, 64, 1, true, 0.4, ring * 2 * PI]} /><meshStandardMaterial color="#efe3bf" roughness={0.75} side={THREE.DoubleSide} /></mesh>}
  {ring > 0 && Array.from({ length: Math.floor(ring * 70) }, (_, i) => { const a = 0.4 + i / 70 * 2 * PI, y = y0 + 0.012 + rn(i, 2) * (band - 0.024);
    return <mesh key={i} position={[(r * 1.02) * Math.sin(a), y, (r * 1.02) * Math.cos(a)]} rotation={[0, a, (rn(i, 3) - 0.5) * 1.6]}><planeGeometry args={[0.0048, 0.018]} /><meshBasicMaterial color="#b89765" side={THREE.DoubleSide} /></mesh>; })}
</group>;

// halcón posado (cola roja). Mira +X
export const Hawk: React.FC<{ p?: V; rot?: V; s?: number; head?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, head = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.16, 0]} rotation={[0, 0, -0.34]} scale={[0.62, 1.18, 0.66]} castShadow><sphereGeometry args={[0.11, 32, 24]} /><meshStandardMaterial color="#5a4029" roughness={0.75} /></mesh>
  <mesh position={[0.03, 0.14, 0]} rotation={[0, 0, -0.34]} scale={[0.5, 1.05, 0.58]}><sphereGeometry args={[0.105, 28, 20]} /><meshStandardMaterial color="#e7d8b6" roughness={0.8} /></mesh>
  {[1, -1].map((k) => <mesh key={k} position={[-0.03, 0.15, 0.066 * k]} rotation={[0.1 * k, 0, -0.42]} scale={[0.46, 1.3, 0.18]} castShadow><sphereGeometry args={[0.1, 24, 16]} /><meshStandardMaterial color="#47321f" roughness={0.8} /></mesh>)}
  <mesh position={[-0.1, 0.0, 0]} rotation={[0, 0, -0.3]} scale={[0.42, 1.4, 0.12]} castShadow><sphereGeometry args={[0.09, 20, 14]} /><meshStandardMaterial color="#a6492a" roughness={0.7} /></mesh>
  <group position={[0.06, 0.285, 0]} rotation={[0, head, 0]}>
    <mesh scale={[1.1, 0.95, 0.95]} castShadow><sphereGeometry args={[0.058, 28, 20]} /><meshStandardMaterial color="#5e442c" roughness={0.75} /></mesh>
    <mesh position={[0.06, -0.008, 0]} rotation={[0, 0, -1.9]} castShadow><coneGeometry args={[0.016, 0.05, 12]} /><meshStandardMaterial color="#2d2a28" roughness={0.3} /></mesh>
    <mesh position={[0.045, 0.002, 0]}><sphereGeometry args={[0.014, 12, 10]} /><meshStandardMaterial color="#e6c23a" roughness={0.5} /></mesh>
    {[1, -1].map((k) => <mesh key={k} position={[0.03, 0.016, 0.044 * k]}><sphereGeometry args={[0.0095, 14, 12]} /><meshPhysicalMaterial color="#1a0f05" roughness={0.1} clearcoat={1} /></mesh>)}
  </group>
  {[1, -1].map((k) => <mesh key={k} position={[0.03, 0.02, 0.03 * k]} castShadow><capsuleGeometry args={[0.009, 0.05, 6, 10]} /><meshStandardMaterial color="#d9b13a" roughness={0.5} /></mesh>)}
</group>;

// pata de gato que se estira por +X (reach 0..1)
export const CatPaw: React.FC<{ p?: V; rot?: V; s?: number; reach?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, reach = 1, col = "#8a6a44" }) => {
  const L = 0.34 * reach + 0.02;
  return <group position={p} rotation={rot} scale={s}>
    <mesh position={[L / 2 - 0.02, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.024, L, 8, 16]} />{M.hair({ col })}</mesh>
    <mesh position={[L + 0.008, 0, 0]} scale={[1.2, 0.72, 1.05]} castShadow><sphereGeometry args={[0.03, 24, 16]} />{M.hair({ col: "#a18158" })}</mesh>
    {[-0.02, -0.007, 0.007, 0.02].map((z) => <mesh key={z} position={[L + 0.036, -0.006, z]} rotation={[0, 0, -1.2]}><coneGeometry args={[0.003, 0.016, 6]} /><meshStandardMaterial color="#e8e2d6" /></mesh>)}
  </group>;
};

// nariz de perro que se acerca por +X
export const DogNose: React.FC<{ p?: V; s?: number; rot?: V }> = ({ p = [0, 0, 0], s = 1, rot = [0, 0, 0] }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[-0.08, 0, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.92]} castShadow><capsuleGeometry args={[0.075, 0.2, 10, 24]} />{M.hair({ col: "#b9925c" })}</mesh>
  <mesh position={[0.078, 0.022, 0]} scale={[0.78, 0.72, 1.05]} castShadow><sphereGeometry args={[0.058, 28, 20]} /><meshPhysicalMaterial color="#1b1716" roughness={0.3} clearcoat={0.8} /></mesh>
</group>;

export const Robin: React.FC<{ p?: V; rot?: V; s?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.06, 0]} scale={[1.3, 1, 1]} castShadow><sphereGeometry args={[0.046, 24, 16]} /><meshStandardMaterial color="#5a5148" roughness={0.75} /></mesh>
  <mesh position={[0.02, 0.054, 0]} scale={[1.05, 0.9, 0.92]}><sphereGeometry args={[0.043, 24, 16]} /><meshStandardMaterial color="#c1602c" roughness={0.75} /></mesh>
  <mesh position={[0.05, 0.1, 0]} castShadow><sphereGeometry args={[0.03, 20, 14]} /><meshStandardMaterial color="#4a423a" roughness={0.75} /></mesh>
  <mesh position={[0.086, 0.1, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.008, 0.03, 8]} /><meshStandardMaterial color="#d6a62e" /></mesh>
  {[1, -1].map((k) => <mesh key={k} position={[0.063, 0.108, 0.022 * k]}><sphereGeometry args={[0.005, 10, 8]} /><meshBasicMaterial color="#0a0a0a" /></mesh>)}
  {[1, -1].map((k) => <mesh key={k} position={[0.01, 0.012, 0.016 * k]}><cylinderGeometry args={[0.002, 0.002, 0.03, 6]} /><meshStandardMaterial color="#5a4a3a" /></mesh>)}
</group>;

// víbora: cadena de esferas que sigue un camino a lo largo del tiempo
export const Snake: React.FC<{ path: (u: number) => number[]; head: number; n?: number; r?: number; col?: string }> = ({ path, head, n = 170, r = 0.017, col = "#191816" }) => <>
  {Array.from({ length: n }, (_, i) => { const u = head - i * 0.0058; const q = path(u), rr = r * (i > n - 44 ? (n - i) / 44 : 1) * (i < 8 ? 0.8 + i * 0.03 : 1);
    return <mesh key={i} position={q as V} castShadow><sphereGeometry args={[Math.max(rr, 0.0015), 14, 10]} /><meshPhysicalMaterial color={col} roughness={0.5} clearcoat={0.3} /></mesh>; })}
</>;

// cortadora de pasto vieja: se mueve por +X, altura de cubierta con deck 0..1
export const Mower: React.FC<{ p?: V; rot?: V; s?: number; deck?: number; spin?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, deck = 0, spin = 0 }) => {
  const y = 0.1 - 0.035 * deck;
  return <group position={p} rotation={rot} scale={s}>
    <RBox s={[0.42, 0.06, 0.42]} p={[0, y, 0]} r={0.03}><meshStandardMaterial color="#8b2a22" roughness={0.45} metalness={0.35} /></RBox>
    <mesh position={[0, y + 0.08, 0]} castShadow><cylinderGeometry args={[0.08, 0.1, 0.11, 32]} /><meshStandardMaterial color="#303236" roughness={0.45} metalness={0.5} /></mesh>
    <mesh position={[0, y + 0.145, 0]} castShadow><cylinderGeometry args={[0.04, 0.05, 0.03, 20]} />{M.brass({})}</mesh>
    <mesh position={[0, y - 0.035, 0]} rotation={[0, spin, 0]}><boxGeometry args={[0.36, 0.006, 0.04]} />{M.steel({})}</mesh>
    {[[0.18, 0.2], [0.18, -0.2], [-0.18, 0.2], [-0.18, -0.2]].map(([x, z], i) => <mesh key={i} position={[x, 0.06, z]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.04, 28]} /><meshStandardMaterial color="#1b1b1b" roughness={0.8} /></mesh>)}
    {[0.17, -0.17].map((z) => <mesh key={z} position={[-0.38, 0.36, z]} rotation={[0, 0, 0.82]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.75, 12]} />{M.steel({ col: "#7e8084" })}</mesh>)}
    <mesh position={[-0.63, 0.635, 0]} rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.36, 12]} /><meshStandardMaterial color="#1b1b1b" roughness={0.8} /></mesh>
  </group>;
};

export const Snow: React.FC<{ s: number[]; p?: V }> = ({ s, p = [0, 0, 0] }) => <RBox s={s} p={p} r={0.03}><meshPhysicalMaterial color="#eef3f8" roughness={0.75} sheen={1} sheenColor={"#ffffff" as unknown as THREE.Color} /></RBox>;

// camino pelado en el pasto: cinta curva sobre el suelo. pts = [[x,z]…]; u = cuánto ya se dibujó (0..1)
const RG = new Map<string, THREE.BufferGeometry>();
export const roadG = (id: string, pts: number[][], w: number) => { let g = RG.get(id); if (g) return g;
  const c = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z))), N = pts.length * 16, P: number[] = [], Ix: number[] = [];
  for (let i = 0; i <= N; i++) { const k = i / N, o = c.getPoint(k), d = c.getTangent(k), ww = w * (0.8 + 0.3 * rn(i, 4)) / 2; P.push(o.x - d.z * ww, 0, o.z + d.x * ww, o.x + d.z * ww, 0, o.z - d.x * ww); if (i < N) { const a = i * 2; Ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
  g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setIndex(Ix); g.computeVertexNormals(); RG.set(id, g); return g; };
export const Road: React.FC<{ id: string; pts: number[][]; w?: number; col?: string; u?: number; y?: number }> = ({ id, pts, w = 0.06, col = "#6e5233", u = 1, y = 0.004 }) => { const g = roadG(id, pts, w); g.setDrawRange(0, Math.floor(u * g.index!.count / 6) * 6);
  return <mesh geometry={g} position={[0, y, 0]} receiveShadow><meshStandardMaterial color={col} roughness={1} side={THREE.DoubleSide} /></mesh>; };
