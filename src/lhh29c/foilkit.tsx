// lhh29c · piezas compartidas del papel de aluminio: textura arrugada, hoja con pliegues, bollito, caja del rollo, pavo, tarta,
// tijera, cuchara (con sarro que se va) y frasco. No exporta nada que empiece con H (body_gen sólo cuenta los héroes).
import React from "react";
import * as THREE from "three";
import { M, RBox, tex, rn } from "./h3d";

const PI = Math.PI;
export const SERIF = "Georgia, 'Times New Roman', serif";
export const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const GC = new Map<string, THREE.BufferGeometry>();
const gk = <T extends THREE.BufferGeometry>(k: string, mk: () => T): T => { const c = GC.get(k) as T | undefined; if (c) return c; const g = mk(); GC.set(k, g); return g; };

// arruga del aluminio: facetas grises con bordes claros (sirve de mapa y de relieve)
export const foilTex = () => tex.text("foilcr", 512, 512, (g) => {
  g.fillStyle = "#c9cdd1"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 320; i++) { const x = rn(i, 2) * 512, y = rn(i, 3) * 512, r = 14 + 40 * rn(i, 4), v = 150 + rn(i, 5) * 100;
    g.fillStyle = `rgba(${v},${v + 3},${v + 6},.55)`; g.beginPath();
    for (let k = 0; k < 5; k++) { const a = (k / 5) * 6.28 + rn(i, 6 + k); g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * (0.5 + rn(i, 12))); } g.closePath(); g.fill(); }
  for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(255,255,255,${0.15 + 0.3 * rn(i, 20)})`; g.lineWidth = 1 + 1.5 * rn(i, 21); g.beginPath();
    const x = rn(i, 22) * 512, y = rn(i, 23) * 512; g.moveTo(x, y); g.lineTo(x + (rn(i, 24) - 0.5) * 140, y + (rn(i, 25) - 0.5) * 140); g.stroke(); }
});
// material del aluminio: la cara brillante («shiny») y la mate («dull»)
export const Foil: React.FC<{ dull?: boolean; op?: number; col?: string; side?: THREE.Side }> = ({ dull, op = 1, col, side = THREE.DoubleSide }) =>
  <meshStandardMaterial color={col ?? (dull ? "#aeb2b6" : "#cdd1d6")} metalness={dull ? 0.7 : 0.95} roughness={dull ? 0.5 : 0.3} map={foilTex()} bumpMap={foilTex()} bumpScale={1.2}
    transparent={op < 1} opacity={op} side={side} />;

// hoja de aluminio con pliegues suaves (crumple 0 = lisa)
export const sheetG = (w: number, d: number, crumple: number) => gk(`fsheet${w}|${d}|${Math.round(crumple * 20)}`, () => {
  const g = new THREE.PlaneGeometry(w, d, 40, 40); const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i);
    const n = Math.sin(x * 61 + Math.sin(y * 37) * 2) * 0.5 + Math.sin(y * 53 + x * 17) * 0.5 + (rn(i, 3) - 0.5) * 0.6;
    p.setZ(i, n * 0.004 * (0.25 + crumple * 3)); }
  g.computeVertexNormals(); return g;
});
export const FoilSheet: React.FC<{ w?: number; d?: number; p?: number[]; rot?: number[]; crumple?: number; dull?: boolean; op?: number }> = ({ w = 0.3, d = 0.2, p = [0, 0, 0], rot = [-PI / 2, 0, 0], crumple = 0.1, dull, op }) =>
  <mesh geometry={sheetG(w, d, crumple)} position={p as [number, number, number]} rotation={rot as [number, number, number]} castShadow receiveShadow><Foil dull={dull} op={op} /></mesh>;

// bollito: icosaedro deformado con facetas (como el aluminio estrujado)
export const ballG = (seed: number) => gk("fball3_" + seed, () => {
  const g = new THREE.SphereGeometry(1, 96, 64); const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)); const k = 0.86 + 0.16 * rn(Math.round((v.x + v.y * 3 + v.z * 7) * 12), seed) + 0.07 * rn(Math.round((v.x * 5 + v.y + v.z * 3) * 45), seed + 3); v.multiplyScalar(k); p.setXYZ(i, v.x, v.y, v.z); }
  g.computeVertexNormals(); return g;
});
export const FoilBall: React.FC<{ r?: number; p?: number[]; rot?: number[]; seed?: number }> = ({ r = 0.04, p = [0, 0, 0], rot = [0, 0, 0], seed = 1 }) =>
  <mesh geometry={ballG(seed)} position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={r} castShadow>
    <meshStandardMaterial color="#d0d4d8" metalness={0.95} roughness={0.3} /></mesh>;

// la caja larga del rollo con la tapa abierta y el rollo asomando
const boxTex = () => tex.text("foilbox", 1024, 128, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "#2f5fae"); gr.addColorStop(1, "#1d3f7a"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 128);
  g.fillStyle = "#e9edf2"; g.fillRect(0, 92, 1024, 36); g.fillStyle = "#fff"; g.font = "bold 62px " + SERIF; g.fillText("ALUMINUM FOIL", 40, 72);
  g.fillStyle = "#c0392b"; g.font = "bold 26px Arial"; g.fillText("75 SQ FT · STANDARD", 620, 118);
});
export const FoilBox: React.FC<{ p?: number[]; rot?: number[]; s?: number; pull?: number; open?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, pull = 0, open = 1 }) =>
  <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    <RBox s={[0.34, 0.05, 0.05]} p={[0, 0.025, 0]} r={0.003}><meshStandardMaterial map={boxTex()} roughness={0.55} /></RBox>
    <mesh position={[0, 0.03, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.019, 0.019, 0.31, 40]} /><Foil /></mesh>
    <group position={[0, 0.05, -0.025]} rotation={[-open * 1.9, 0, 0]}><RBox s={[0.34, 0.003, 0.05]} p={[0, 0, 0.025]} r={0.001}><meshStandardMaterial color="#2f5fae" roughness={0.6} /></RBox></group>
    {pull > 0 && <FoilSheet w={0.3} d={pull} p={[0, 0.05, 0.025 + pull / 2]} rot={[-PI / 2 + 0.12, 0, 0]} crumple={0.05} />}
  </group>;

// pavo asado: cuerpo, pechuga y dos patas; brown 0 = crudo, 1 = dorado
export const Turkey: React.FC<{ p?: number[]; s?: number; rot?: number[]; brown?: number; dry?: number }> = ({ p = [0, 0, 0], s = 1, rot = [0, 0, 0], brown = 1, dry = 0 }) => {
  const c = new THREE.Color("#e8c4a0").lerp(new THREE.Color("#a0521c"), brown).lerp(new THREE.Color("#7a4a24"), dry * 0.6);
  const mat = <meshPhysicalMaterial color={c} roughness={0.45} clearcoat={0.7 * brown} clearcoatRoughness={0.3} bumpMap={tex.paper(5, 5)} bumpScale={4} />;
  return <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    <mesh scale={[1.25, 0.72, 1]} position={[0, 0.06, 0]} castShadow>{<sphereGeometry args={[0.09, 48, 32]} />}{mat}</mesh>
    <mesh scale={[0.9, 0.55, 0.8]} position={[0.02, 0.1, 0]} castShadow><sphereGeometry args={[0.08, 40, 24]} />{mat}</mesh>
    {[-1, 1].map((k) => <group key={k} position={[0.08, 0.05, k * 0.06]} rotation={[k * 0.3, 0, -0.5]}>
      <mesh position={[0.03, 0, 0]} scale={[1.4, 0.8, 0.8]} castShadow><sphereGeometry args={[0.035, 24, 16]} />{mat}</mesh>
      <mesh position={[0.085, 0.01, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.011, 0.05, 12]} /><meshStandardMaterial color="#f3e6d2" roughness={0.6} /></mesh>
      <mesh position={[0.115, 0.01, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.013, 0.009, 0.022, 16, 1, true]} /><meshStandardMaterial color="#ffffff" roughness={0.9} side={THREE.DoubleSide} bumpMap={tex.paper(1, 4)} bumpScale={6} /></mesh></group>)}
    {[-1, 1].map((k) => <mesh key={"w" + k} position={[-0.05, 0.07, k * 0.085]} rotation={[k * 0.4, 0.3, 0.3]} scale={[1.3, 0.5, 0.6]} castShadow><sphereGeometry args={[0.035, 20, 14]} />{mat}</mesh>)}
  </group>;
};
// fuente de horno de acero (bandeja abierta de bordes altos)
export const Roaster: React.FC<{ p?: number[]; s?: number }> = ({ p = [0, 0, 0], s = 1 }) =>
  <group position={p as [number, number, number]} scale={s}>
    <RBox s={[0.42, 0.006, 0.28]} p={[0, 0.003, 0]} r={0.002}>{M.steel({})}</RBox>
    {[[0, 0.03, 0.14, 0.42, 0.006], [0, 0.03, -0.14, 0.42, 0.006], [0.21, 0.03, 0, 0.006, 0.28], [-0.21, 0.03, 0, 0.006, 0.28]].map(([x, y, z, w, d], i) =>
      <RBox key={i} s={[w, 0.06, d]} p={[x, y, z]} r={0.002}>{M.steel({})}</RBox>)}
  </group>;

// tarta: plato, relleno y borde de masa repulgado; edge 0..1 = de dorado claro a quemado
export const Pie: React.FC<{ p?: number[]; s?: number; edge?: number; mid?: number; fill?: string }> = ({ p = [0, 0, 0], s = 1, edge = 0.3, mid = 0.3, fill = "#d27a2c" }) => {
  const ec = new THREE.Color("#f0d7a0").lerp(new THREE.Color("#c98a3a"), cl1(edge * 1.6)).lerp(new THREE.Color("#4a2a12"), cl1(edge * 1.6 - 0.6));
  const fc = new THREE.Color("#f2b36a").lerp(new THREE.Color(fill), mid);
  return <group position={p as [number, number, number]} scale={s}>
    <mesh geometry={lathe([[0, 0], [0.09, 0], [0.12, 0.035], [0.135, 0.038], [0.136, 0.034]], 64)} castShadow receiveShadow>{M.glass({ col: "#e8f3ff", op: 0.5 })}</mesh>
    <mesh position={[0, 0.03, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.112, 64]} /><meshPhysicalMaterial color={fc} roughness={0.5} clearcoat={0.3} /></mesh>
    {Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.118, 0.036, Math.sin(a) * 0.118]} rotation={[0, -a, 0]} scale={[0.7, 0.55, 1.2]} castShadow>
      <sphereGeometry args={[0.016, 12, 10]} /><meshStandardMaterial color={ec} roughness={0.7} /></mesh>; })}
  </group>;
};
const cl1 = (x: number) => Math.max(0, Math.min(1, x));

// tijera de sastre de mango negro: open = ángulo de apertura
export const Shears: React.FC<{ p?: number[]; rot?: number[]; s?: number; open?: number; dull?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0.3, dull = 0 }) => {
  const blade = <meshStandardMaterial color={new THREE.Color("#eef2f5").lerp(new THREE.Color("#7b7466"), dull)} metalness={1} roughness={0.15 + 0.4 * dull} />;
  return <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    {[-1, 1].map((k) => <group key={k} rotation={[0, 0, k * open / 2]}>
      <mesh position={[0.1, 0.002 * k, 0]} scale={[1, 1, 1]} castShadow><boxGeometry args={[0.2, 0.003, 0.018]} />{blade}</mesh>
      <mesh position={[0.2, 0.002 * k, 0.004 * k]} rotation={[0, 0, 0]}><coneGeometry args={[0.009, 0.02, 4]} />{blade}</mesh>
      <mesh position={[-0.07, 0.004 * k, 0.012 * k]} rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[0.026, 0.007, 12, 32]} /><meshPhysicalMaterial color="#121212" roughness={0.35} clearcoat={0.8} /></mesh></group>)}
    <mesh position={[0, 0.006, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.012, 16]} />{M.brass({})}</mesh>
  </group>;
};

// cuchara de plata: tarnish 1 = marrón negruzca, 0 = brillante
export const Spoon: React.FC<{ p?: number[]; rot?: number[]; s?: number; tarnish?: number; fork?: boolean }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, tarnish = 0, fork }) => {
  const m = <meshStandardMaterial color={new THREE.Color("#f4f6f8").lerp(new THREE.Color("#5a4632"), tarnish)} metalness={1 - 0.45 * tarnish} roughness={0.12 + 0.5 * tarnish} />;
  return <group position={p as [number, number, number]} rotation={rot as [number, number, number]} scale={s}>
    <RBox s={[0.13, 0.004, 0.012]} p={[-0.05, 0.004, 0]} r={0.002}>{m}</RBox>
    {fork ? [-1, 0, 1].map((k) => <RBox key={k} s={[0.04, 0.003, 0.004]} p={[0.04, 0.006, k * 0.008]} r={0.0015}>{m}</RBox>)
      : <mesh position={[0.035, 0.008, 0]} scale={[1.45, 0.35, 1]} castShadow><sphereGeometry args={[0.02, 32, 16]} />{m}</mesh>}
  </group>;
};
