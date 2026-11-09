// MIO apa8pa · componentes únicos 0-9 min: el camino en el pasto, qué es un topillo, la prueba de la manzana. (v2)
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Mole, Mound, SoilBlock } from "./farmkit";
import { AppleSlice, Blades, Dirt, Lawn, PI, Road, Shingle, SnapTrap, Tee, Trunk, Vole } from "./akit";

type P_ = { t: number; h: H };

// ---- EL CAMINITO: el pasto se abre sobre una calle curva, pelada; baja el palo de escoba y mide el ancho ----
const brZ = (x: number) => 0.06 * Math.sin(x * 2.6 + 0.6);
const BRPTS = Array.from({ length: 11 }, (_, i) => { const x = -1.3 + i * 0.26; return [x, brZ(x)]; });
export const HBroomRoad: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.02, 0], az: [0.5, 0.18], el: [0.62, 0.46], r: [0.92, 0.7], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.4} x={960} y={940} txt="WIDE AS A BROOM HANDLE" col={AMB} />}>{(tt) => {
  const o = eio(tt, 0.2, 1.5), bm = phys(tt, 1.9, 6, 0.5);
  return <>
    <Lawn /><Road id="brm" pts={BRPTS} w={0.075} />
    <Road id="brm2" pts={BRPTS} w={0.036} col="#7f6240" y={0.0055} />
    <Blades w={2.4} d={1.3} n={1050} h={0.13} part={(x, z) => { const dz = z - brZ(x), s = Math.sign(dz || 1), near = Math.exp(-Math.abs(dz) / 0.1); return [0, s * (0.1 + 1.25 * near * o)]; }} skip={(x, z) => Math.abs(z - brZ(x)) < 0.044 + 0.014 * o} />
    <mesh position={[0.05, 0.03 + 0.5 * (1 - bm), 0.14]} rotation={[0, 0.02, PI / 2]} castShadow><cylinderGeometry args={[0.024, 0.024, 1.8, 24]} /><meshStandardMaterial color="#b98a52" roughness={0.55} /></mesh>
  </>;
}}</Scene3D>;

// ---- YA ESTÁ MUERTO Y NO LO SABE: la corteza se come en anillo; la copa suelta las hojas ----
export const HRingBare: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1.2, 2, 1.2]}
  cam={{ at: [0, 0.34, 0], at1: [0, 0.56, 0], az: [-0.5, 0.3], el: [0.16, 0.2], r: [1.4, 1.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="DEAD. IT JUST DOESN'T KNOW." col={RED} />}>{(tt) => {
  const r = eio(tt, 0.3, 2.4), lf = eio(tt, 1.6, 5.4);
  return <>
    <Lawn /><Trunk r={0.1} h={1.5} ring={r} band={0.24} />
    {Array.from({ length: 130 }, (_, i) => { const a = rn(i, 2) * 6.28, rr = 0.12 + rn(i, 3) * 0.75, y0 = 1.0 + rn(i, 4) * 0.5, d = cl(lf * 1.6 - rn(i, 5) * 0.6);
      return <mesh key={i} position={[Math.cos(a) * (rr + d * 0.18), lerp(y0, 0.012, d), Math.sin(a) * (rr + d * 0.18)]} rotation={[rn(i, 6) * 6 + d * 4, rn(i, 7) * 6, d * 3]} castShadow><circleGeometry args={[0.03, 8]} /><meshStandardMaterial color={d > 0.2 ? "#b08a34" : "#5e8a3a"} side={THREE.DoubleSide} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- TRES COSAS: cae el caño en T con peso, salta la trampa de un dólar, y llega el maní en la punta del cuchillo ----
export const HThreeThings: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-1, 1.9, 1.1]}
  cam={{ at: [0.04, 0.08, 0.05], az: [-0.32, 0.2], el: [0.5, 0.38], r: [1.0, 0.82], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="NOT ONE CRUMB OF POISON" col={GRN} />}>{(tt) => {
  const a = phys(tt, 0.1, 7, 0.34), b = phys(tt, 1.1, 8, 0.36), c = phys(tt, 2.0, 6, 0.55);
  return <>
    <Tee p={[-0.22, 0.04 + 0.6 * (1 - a), -0.08]} rot={[0, 0.25, 0]} arm={8} />
    <SnapTrap p={[0.2, 0.04 + 0.5 * (1 - b), 0.13]} rot={[0, 0.5, 0]} s={2.8} dab={c} />
    <group position={[0.34, 0.09 + 0.5 * (1 - c), 0.06]} rotation={[0, 0.3, 0.32]}><RBox s={[0.16, 0.004, 0.022]} r={0.001}>{M.steel({})}</RBox><RBox s={[0.1, 0.024, 0.03]} p={[0.125, 0, 0]} r={0.01}>{M.wood({ base: [80, 50, 30] })}</RBox></group>
  </>;
}}</Scene3D>;

// ---- NO ES UN TOPO: corte de la tierra; el topo abajo en su túnel, el topillo arriba, en el pasto ----
export const HMoleVole: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 1.8, 1.3]}
  cam={{ at: [0, -0.17, 0], az: [0.14, -0.14], el: [0.05, 0.09], r: [1.7, 1.42], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={940} txt="UNDER IT · ON TOP OF IT" col={TX} />}>{(tt) => {
  const m = phys(tt, 0.3, 5, 0.6), v = phys(tt, 1.2, 6, 0.5);
  return <>
    <SoilBlock w={3.6} h={0.95} d={0.6} p={[0, 0, 0]} />
    <mesh position={[-0.28, -0.39, 0.304]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.01]}><capsuleGeometry args={[0.078, 0.95, 10, 24]} /><meshBasicMaterial color="#1c120a" /></mesh>
    <group position={[lerp(-0.72, -0.34, m), -0.42, 0.33]}><Mole s={0.9} paddle={tt * 6} nose={tt} /></group>
    <Blades w={3.4} d={0.6} n={420} h={0.11} />
    <Vole p={[lerp(0.8, 0.34, v), 0.012, 0.16]} rot={[0, PI, 0]} s={1.25} walk={tt * (v < 0.98 ? 1 : 0)} />
  </>;
}}</Scene3D>;

// ---- CORTADO EN BISEL: tallitos cortados en diagonal, con la cara pálida; abajo el grano de arroz junto a la cagadita ----
const SL = new Map<string, THREE.BufferGeometry>();
const slantG = (r: number, h: number, k = 0.9) => { const key = `${r}|${h}|${k}`; let g = SL.get(key); if (g) return g;
  g = new THREE.CylinderGeometry(r, r * 1.14, h, 24, 1); const P = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < P.count; i++) if (P.getY(i) > 0) P.setY(i, P.getY(i) + P.getX(i) * k);
  P.needsUpdate = true; g.computeVertexNormals(); SL.set(key, g); return g; };
export const HScissorCut: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-0.8, 1.4, 1]}
  cam={{ at: [0, 0.06, 0], az: [0.55, 0.26], el: [0.34, 0.26], r: [0.74, 0.58], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={940} txt="CUT ON A SLANT" col={AMB} />}>{(tt) => {
  const f = eio(tt, 0.5, 1.5), r = phys(tt, 2.3, 7, 0.45);
  return <>
    <Dirt w={3} d={3} rx={6} p={[0, 0, 0]} />
    {Array.from({ length: 26 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 0.62, z = (rn(i, 3) - 0.5) * 0.34, hh = 0.05 + rn(i, 4) * 0.05, rs = 0.0026 + rn(i, 5) * 0.0014, ry = rn(i, 6) * 6.28, ca = 0.02 + rn(i, 7) * 0.05, dl = rn(i, 8) * 0.35, ff = eio(tt, 0.5 + dl, 1.3 + dl);
      return <group key={i}>
        <group position={[x, 0, z]} rotation={[0, ry, 0]}><mesh position={[0, hh / 2, 0]} geometry={slantG(rs, hh)} castShadow><meshStandardMaterial attach="material-0" color="#6d9a3e" roughness={0.6} /><meshStandardMaterial attach="material-1" color="#dceab0" roughness={0.5} /><meshStandardMaterial attach="material-2" color="#6d9a3e" /></mesh></group>
        <mesh position={[x + ca * Math.cos(ry) * ff, lerp(hh + 0.03, 0.004, ff), z + ca * Math.sin(ry) * ff]} rotation={[0, ry, lerp(0.1, PI / 2 - 0.04, ff)]} castShadow><cylinderGeometry args={[rs * 0.7, rs, 0.05 + rn(i, 9) * 0.03, 10]} /><meshStandardMaterial color="#79a548" roughness={0.6} /></mesh>
      </group>; })}
    <mesh position={[0.1, 0.006 + 0.3 * (1 - r), 0.17]} rotation={[0, 0.4, PI / 2]} castShadow><capsuleGeometry args={[0.0058, 0.022, 6, 12]} /><meshStandardMaterial color="#efe9d8" roughness={0.5} /></mesh>
    <mesh position={[0.05, 0.006 + 0.3 * (1 - r), 0.18]} rotation={[0, -0.3, PI / 2]} castShadow><capsuleGeometry args={[0.0058, 0.022, 6, 12]} /><meshStandardMaterial color="#5a6a30" roughness={0.9} /></mesh>
    <mesh position={[0.02, 0.005 + 0.3 * (1 - r), 0.21]} rotation={[0, 0.9, PI / 2]} castShadow><capsuleGeometry args={[0.0052, 0.02, 6, 12]} /><meshStandardMaterial color="#4a5a28" roughness={0.9} /></mesh>
  </>;
}}</Scene3D>;

// ---- LOS TRES AGUJEROS: montículo del topo, de la tuza, y uno limpio sin una miga; una luz se enciende sobre ese ----
export const HCleanHole: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.06, 0], az: [-0.2, 0.2], el: [0.3, 0.22], r: [1.85, 1.55], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="NO DIRT AT ALL" col={AMB} />}>{(tt) => {
  const a = phys(tt, 0.2, 6, 0.5), b = phys(tt, 0.9, 6, 0.5), c = eio(tt, 2.2, 3.0);
  return <>
    <Lawn />
    <group position={[-0.62, 0, 0]} scale={Math.max(0.001, a)}><Mound p={[0, 0, 0]} s={1.3} /></group>
    <group position={[0, 0, 0]} scale={Math.max(0.001, b)}><Mound p={[0, 0, 0]} s={1.2} half /></group>
    <mesh position={[0.62, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshBasicMaterial color="#060403" /></mesh>
    <mesh position={[0.62, 0.0035, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.066, 32]} /><meshStandardMaterial color="#6a4a2e" roughness={1} /></mesh>
    <mesh position={[0.62, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.14, 0.15, 56]} />{M.glow({ op: c })}</mesh>
    <pointLight position={[0.62, 0.6, 0.2]} intensity={2.4 * c} distance={1.4} color="#ffd08a" />
    <Blades w={2.6} d={1.5} n={460} h={0.08} skip={(x, z) => Math.hypot(x + 0.62, z) < 0.2 || Math.hypot(x, z) < 0.2 || Math.hypot(x - 0.62, z) < 0.12} />
  </>;
}}</Scene3D>;

// ---- DE FAMILIA A PUEBLO: desde arriba, una calle se ramifica como un árbol hasta ser un pueblo; agosto pasa a noviembre ----
const MS = ["AUG", "SEP", "OCT", "NOV"];
const TW: { id: string; pts: number[][]; d: number }[] = [];
for (let a = 0; a < 7; a++) { const an = a * 0.9 + 0.3, arm: number[][] = [], L = 0.85 + rn(a, 2) * 0.4;
  for (let k = 0; k <= 5; k++) { const r = (L * k) / 5, w = an + 0.5 * Math.sin(k * 1.3 + a) * (k / 5); arm.push([r * Math.cos(w), r * Math.sin(w) * 0.62]); }
  TW.push({ id: "tw" + a, pts: arm, d: a * 0.03 });
  [2, 3, 4].forEach((b) => { const [x0, z0] = arm[b], s = b % 2 ? 1 : -1, w2 = an + s * 1.05, l2 = 0.32 + rn(a * 7 + b, 3) * 0.2; TW.push({ id: `tw${a}_${b}`, d: 0.3 + b * 0.08, pts: [[x0, z0], [x0 + l2 * 0.5 * Math.cos(w2 + 0.2 * s), z0 + l2 * 0.5 * Math.sin(w2 + 0.2 * s) * 0.62], [x0 + l2 * Math.cos(w2), z0 + l2 * Math.sin(w2) * 0.62]] }); }); }
export const HTownGrow: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 3, 1]}
  cam={{ at: [0, 0, 0], az: [0.05, -0.1], el: [1.2, 1.05], r: [2.6, 2.25], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={0.4} x={960} y={930} txt={MS[Math.min(3, Math.floor(eio(tt, 0.6, 3.8) * 4))]} col={AMB} size={70} />}>{(tt) => {
  const g = eio(tt, 0.2, 4.2);
  return <>
    <Lawn />
    {TW.map((r) => { const u = cl((g - r.d) / 0.5), e0 = r.pts[r.pts.length - 1]; return <group key={r.id}><Road id={r.id} pts={r.pts} w={0.04} u={u} /><mesh visible={u > 0.98} position={[e0[0], 0.007, e0[1]]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.026, 20]} /><meshBasicMaterial color="#0b0704" /></mesh></group>; })}
    <mesh position={[0, 0.007, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.034, 24]} /><meshBasicMaterial color="#0b0704" /></mesh>
  </>;
}}</Scene3D>;

// ---- AÑO DE OLA: estacas que suben y bajan como un mar; se frena y la cresta cae justo en la estaca de este otoño ----
export const HWaveYears: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-1, 2, 1.2]} bg="#100c08"
  cam={{ at: [0.05, 0.15, 0], az: [0.5, 0.3], el: [0.3, 0.22], r: [1.75, 1.45], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="YOU'RE IN A WAVE YEAR" col={AMB} />}>{(tt) => {
  const ph = lerp(-3, 0.27, eio(tt, 0.1, 3.5)), f = (x: number) => 0.05 + 0.26 * Math.pow(0.5 + 0.5 * Math.sin(x * 0.9 + ph), 3), S = 34, hot = eio(tt, 3.1, 3.6);
  return <>{Array.from({ length: S }, (_, i) => { const x = (i - S / 2) * 0.052, hh = f(x * 18), me = i === S - 8;
    return <mesh key={i} position={[x, 0.04 + hh / 2, 0]} castShadow><boxGeometry args={[0.034, hh, 0.034]} />{me ? <meshStandardMaterial color={hot > 0.5 ? "#e8a13c" : "#b08654"} emissive="#ff8b1f" emissiveIntensity={0.8 * hot} /> : M.wood({ base: [176, 134, 84] })}</mesh>; })}</>;
}}</Scene3D>;

// ---- LA RODAJA EN EL CAMINO: cae la rodaja en la calle, se la ve bien, y recién entonces la teja la tapa ----
export const HAppleTest: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1]}
  cam={{ at: [0, 0.03, 0], az: [-0.4, 0.2], el: [0.62, 0.46], r: [0.72, 0.58], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="ONE SLICE · EVERY FIFTEEN FEET" col={TX} />}>{(tt) => {
  const a = phys(tt, 0.2, 8, 0.36), s = eio(tt, 3.0, 4.2);
  return <>
    <Lawn /><Road id="apt" pts={[[-1.4, 0.05], [-0.6, -0.03], [0, 0], [0.7, 0.04], [1.4, -0.03]]} w={0.15} />
    <Blades w={2} d={1.2} n={520} h={0.08} skip={(x, z) => Math.abs(z) < 0.1 || Math.hypot(x, z) < 0.2} />
    <AppleSlice s={1.35} p={[0, 0.006 + 0.5 * (1 - a), 0]} />
    <Shingle p={[lerp(0.8, 0, s), 0.04 + 0.03 * Math.sin(s * PI), 0]} rot={[0, 0.1 - 0.1 * s, lerp(0.14, 0, s)]} />
  </>;
}}</Scene3D>;

// ---- LAS MARCAS DE A PARES: se levanta la teja y en un costado de la pulpa aparecen las rayitas de dos en dos ----
export const HToothMarks: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-0.6, 1.4, 0.9]}
  cam={{ at: [0.02, 0.02, 0], az: [0.3, 0.05], el: [0.86, 0.72], r: [0.48, 0.38], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.7} x={960} y={940} txt="PAIRED TOOTH MARKS = VOLES" col={AMB} />}>{(tt) => {
  const s = eio(tt, 0.1, 0.9), n = Math.round(14 * eio(tt, 1.0, 3.2));
  return <>
    <Dirt w={3} d={3} rx={6} /><AppleSlice s={1.7} p={[0, 0.002, 0]} bites={n} />
    <Shingle p={[0.05 + 0.6 * s, 0.1 + 0.35 * s, -0.25 * s]} rot={[0.9 * s, 0, 1.0 * s]} s={1.5} />
  </>;
}}</Scene3D>;
