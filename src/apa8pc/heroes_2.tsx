// MIO apa8pc · componentes únicos, segunda mitad: la puerta de una vía, la malla en L y el olor.
import React from "react";
import { puffT } from "./heroes_1";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Boot, Grub, MeshPanel, Sign, SoilBlock } from "./farmkit";
import { Blades, Dirt, Lawn, PI } from "./akit";
import { Lattice, P_, Skunk, UnderDeck } from "./heroes_1";

// ---- SIN NAFTALINAS: las bolitas se derriten con la lluvia y bajan al agua de la napa ----
export const HMothDrip: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.4]} cam={{ at: [0, -0.2, 0.2], az: [-0.08, 0.08], el: [0.05, 0.06], r: [1.6, 1.34], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.1} x={960} y={940} txt="POISON IN THE GROUND" col={RED} />}>{(tt) => {
  const melt = eio(tt, 1.0, 3.8);
  return <>
    <SoilBlock w={3.4} h={1.0} d={0.6} p={[0, 0, 0]} grass />
    <mesh position={[0, -0.86, 0.3045]}><planeGeometry args={[3.4, 0.28]} /><meshStandardMaterial color="#3d6a86" roughness={0.3} /></mesh>
    {Array.from({ length: 7 }, (_, i) => { const x = -0.5 + i * 0.17, r = 0.05 * (1 - melt * 0.72); return <mesh key={i} position={[x, r * 0.8, 0.26]} castShadow><sphereGeometry args={[r, 22, 16]} />{M.porcelain({ col: "#f3f1ea" })}</mesh>; })}
    {Array.from({ length: 7 }, (_, j) => Array.from({ length: 7 }, (_, n) => { const ph = (tt * 0.38 + n / 7 + rn(j, 2)) % 1, x = -0.5 + j * 0.17 + 0.035 * Math.sin(ph * 9 + j); return <mesh key={j + "_" + n} visible={melt > 0.06} position={[x, -0.02 - ph * 0.84, 0.309]}><sphereGeometry args={[0.012 + ph * 0.008, 10, 8]} /><meshBasicMaterial color="#d7e36f" transparent opacity={0.85 * Math.sin(ph * PI + 0.2)} /></mesh>; }))}
    <mesh position={[0, -0.74, 0.306]}><planeGeometry args={[Math.max(0.01, 2.4 * melt), 0.05]} /><meshBasicMaterial color="#b6c75a" transparent opacity={0.8} /></mesh>
  </>;
}}</Scene3D>;

// ---- CUATRO PULGADAS: un aro de alambre recorre la celosía y sólo un hueco lo deja pasar ----
export const HFourRing: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.8]} cam={{ at: [0.02, 0.2, 0.5], az: [-0.16, 0.14], el: [0.08, 0.06], r: [1.2, 0.98], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="FOUR INCHES IS PLENTY" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.6, 3.0), x = lerp(-0.7, 0.28, k), y = 0.18 + 0.03 * Math.sin(k * PI * 3);
  return <>
    <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.25, 0.5]}><planeGeometry args={[2.4, 0.5]} /><meshBasicMaterial color="#121010" /></mesh>
    <group position={[0, 0, 0.52]}><Lattice w={2.1} h={0.5} gapX={0.28} gapW={0.16} /></group>
    <mesh position={[x, y, 0.6]} rotation={[0, 0, k * 2]}><torusGeometry args={[0.08, 0.005, 10, 48]} />{M.steel({ col: "#d7d4c7" })}</mesh>
    <group position={[x + 0.082, y - 0.07, 0.6]} rotation={[0, 0, -0.4]}><mesh position={[0.06, -0.06, 0]} rotation={[0, 0, 0.7]}><cylinderGeometry args={[0.005, 0.005, 0.18, 8]} />{M.steel({ col: "#d7d4c7" })}</mesh></group>
    <Blades w={3.4} d={1.4} n={150} h={0.05} p={[0, 0, 1.5]} />
  </>;
}}</Scene3D>;

// ---- LA PUERTA DE UNA VÍA: empuja, sale, la tapa cae y desde afuera ya no abre ----
export const HSwingOut: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [0, 0.18, 0.56], az: [1.2, 0.84], el: [0.13, 0.1], r: [1.6, 1.3], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={940} txt="OUT ONLY" col={GRN} />}>{(tt) => {
  const w = eio(tt, 0.4, 3.6), z = lerp(0.1, 1.1, w), open = eio(tt, 1.2, 1.8) * (1 - eio(tt, 2.9, 3.4)), block = eio(tt, 4.4, 4.9) * (1 - eio(tt, 5.3, 5.8)), S = 0.3, back = eio(tt, 3.8, 4.5), hide = 1 - eio(tt, 3.7, 3.8);
  return <>
    <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.25, 0.5]}><planeGeometry args={[2.4, 0.5]} /><meshBasicMaterial color="#121010" /></mesh>
    <group position={[0, 0, 0.51]}><Lattice w={2.1} h={0.5} gapX={0} gapW={S + 0.06} /></group>
    {[[-S / 2 - 0.02, 0.17, 0.05, 0.34], [S / 2 + 0.02, 0.17, 0.05, 0.34]].map((q, i) => <RBox key={i} s={[q[2], q[3], 0.05]} p={[q[0], q[1], 0.54]} r={0.006}>{M.wood({ base: [132, 96, 60] })}</RBox>)}
    <RBox s={[S + 0.09, 0.05, 0.05]} p={[0, 0.36, 0.54]} r={0.006}>{M.wood({ base: [124, 90, 58] })}</RBox>
    <group position={[0, 0.335, 0.572]} rotation={[-(open * 1.15), 0, 0]}><group position={[0, -0.16, 0]}><MeshPanel w={S} h={0.32} p={[0, 0, 0]} cell={32} rep={4} /><RBox s={[S, 0.012, 0.01]} p={[0, -0.16, 0]} r={0.002}>{M.steel({ col: "#7b7d7e" })}</RBox></group></group>
    {[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.335, 0.575]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.06, 12]} />{M.brass()}</mesh>)}
    <group visible={hide > 0.5}><Skunk p={[0.02, 0, z]} rot={[0, -PI / 2, 0]} s={0.72} walk={tt * 2.2 * (w > 0 && w < 1 ? 1 : 0)} /></group>
    <group visible={hide <= 0.5}><Skunk p={[0.02, 0, lerp(1.1, 0.75, back)]} rot={[0, PI / 2, 0]} s={0.72} walk={tt * 2 * (back < 1 ? 1 : 0)} /></group>
    {[0, 1, 2].map((i) => <mesh key={i} visible={block > 0.05} position={[0.02, 0.1 + i * 0.02, 0.598 + block * 0.01]}><ringGeometry args={[0.03 + i * 0.03, 0.036 + i * 0.03, 40]} /><meshBasicMaterial color="#f5d58a" transparent opacity={0.5 * block} depthWrite={false} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- SIETE NOCHES: siete lunas cruzan el cielo por encima de la puerta, una por una ----
export const HSevenMoons: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#10142c" key1={[-1, 1.6, 1.4]} cam={{ at: [0, 0.68, 0], az: [0.05, -0.05], el: [-0.02, 0.0], r: [2.6, 2.3], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={4.7} x={960} y={940} txt="A FULL WEEK" col={AMB} />}>{(tt) => <>
  <mesh position={[0, 1.2, -1.6]}><planeGeometry args={[9, 4]} /><meshBasicMaterial color="#10142c" /></mesh>
  {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[-3 + rn(i, 2) * 6, 0.3 + rn(i, 3) * 2.2, -1.55]}><circleGeometry args={[0.006 + rn(i, 4) * 0.008, 8]} /><meshBasicMaterial color="#f2eed8" transparent opacity={0.4 + 0.5 * Math.abs(Math.sin(tt * 1.5 + i))} /></mesh>)}
  <Lawn />
  <group position={[0, 0, -0.3]}><mesh position={[0, 0.25, -0.02]}><planeGeometry args={[2.6, 0.5]} /><meshBasicMaterial color="#0a0908" /></mesh><Lattice w={2.4} h={0.5} gapX={0} gapW={0.3} /></group>
  {Array.from({ length: 7 }, (_, i) => { const a = eio(tt, 0.3 + i * 0.58, 0.95 + i * 0.58), sx = -1.5 + i * 0.5, y = 0.85 + 0.42 * Math.sin((i / 6) * PI); return <group key={i} position={[sx, y + 0.3 * (1 - a), -1.4]}>
    <mesh visible={a > 0.01}><circleGeometry args={[0.095, 40]} /><meshBasicMaterial color="#f3eed6" transparent opacity={a} /></mesh>
    <mesh visible={a > 0.01} position={[0.05 + i * 0.012, 0.018, 0.002]}><circleGeometry args={[0.095, 40]} /><meshBasicMaterial color="#10142c" transparent opacity={i === 3 ? 0 : a * 0.92} /></mesh>
  </group>; })}
</>}</Scene3D>;

// ---- LOS BEBÉS: se levanta el cuadradito de malla y aparecen narices chiquitas detrás ----
export const HWindowLift: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [0, 0.16, 0.5], az: [0.2, -0.05], el: [0.1, 0.07], r: [0.92, 0.72], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="LIFT IT. LOOK FOR BABIES." col={AMB} />}>{(tt) => {
  const u = phys(tt, 0.6, 5, 0.6), n = eio(tt, 2.4, 3.6);
  return <>
    <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.25, 0.49]}><planeGeometry args={[2, 0.5]} /><meshBasicMaterial color="#0d0b0a" /></mesh>
    <group position={[0, 0, 0.5]}><Lattice w={1.9} h={0.5} gapX={0} gapW={0.36} /></group>
    {[-1, 1].map((sgn, i) => <group key={i} position={[sgn * 0.075, 0.03, lerp(0.42, 0.5, n)]}>
      <mesh scale={[0.8, 0.6, 1]}><sphereGeometry args={[0.042, 18, 14]} />{M.hair({ col: "#17161a" })}</mesh>
      <mesh position={[0, 0.0, 0.04]}><sphereGeometry args={[0.009, 12, 8]} /><meshPhysicalMaterial color="#0c0b0c" roughness={0.3} clearcoat={0.8} /></mesh>
      <mesh position={[0, 0.024, 0.006]} scale={[0.2, 0.2, 1]}><sphereGeometry args={[0.04, 12, 8]} />{M.hair({ col: "#ece8df" })}</mesh>
    </group>)}
    <group position={[0, 0.17 + 0.1 * u, 0.53]}><MeshPanel w={0.3} h={0.3} p={[0, 0, 0]} cell={8} rep={3} /></group>
    {[-0.15, 0.15].map((x) => <mesh key={x} position={[x, 0.25, 0.54]}><cylinderGeometry args={[0.004, 0.004, 0.5, 8]} />{M.steel({ col: "#5d5e5f" })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- SELLADO, NO: la tabla tapa el agujero y atrás queda él, a oscuras y mordiendo ----
export const HSealDark: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.1, 2, 1.8]} cam={{ at: [0, 0.3, 0.2], az: [0.42, 0.28], el: [0.08, 0.08], r: [2.0, 1.72], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="HE WON'T STAY QUIET" col={RED} />}>{(tt) => {
  const p = phys(tt, 1.0, 9, 0.35), bite = eio(tt, 2.1, 2.3);
  return <UnderDeck dark={0.14 + 0.5 * p}>
    <Skunk p={[0.18, bite * 0.01 * Math.sin(tt * 18), 0.34]} rot={[0, -1.3, 0]} s={1.0} tail={0.8} />
    <RBox s={[0.56, 0.5, 0.03]} p={[0.2, 0.25, 0.645 + 0.8 * (1 - p)]} r={0.008}>{M.wood({ base: [146, 106, 66] })}</RBox>
    {[-0.22, 0.22].flatMap((x) => [0.08, 0.42].map((y) => <mesh key={x + "_" + y} position={[0.2 + x, y, 0.661 + 0.8 * (1 - p)]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.009, 0.006, 12]} />{M.steel({})}</mesh>))}
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} visible={bite > 0.5} position={[0.08 + rn(i, 2) * 0.24, 0.05 + rn(i, 3) * 0.12 + (tt % 0.6) * 0.1, 0.62]}><boxGeometry args={[0.01, 0.024, 0.005]} /><meshStandardMaterial color="#c79a62" /></mesh>)}
  </UnderDeck>;
}}</Scene3D>;

// ---- CUARENTA GRADOS: el termómetro de pared sube hasta la marca y recién ahí vale ----
export const HThermo40: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#3d4252" key1={[-1, 1.9, 1.5]} cam={{ at: [0, 0.36, 0], az: [-0.2, 0.12], el: [0.03, 0.05], r: [1.1, 0.92], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.4} x={960} y={940} txt="ABOVE 40 AT NIGHT" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.3, 2.3), H_ = 0.5, y0 = 0.11;
  return <>
    <mesh position={[0, 0.5, -0.04]}><planeGeometry args={[4, 2]} /><meshStandardMaterial color="#5b4a39" roughness={1} /></mesh>
    <RBox s={[0.28, 0.72, 0.02]} p={[0, 0.38, -0.02]} r={0.02}><meshStandardMaterial color="#efe5c9" roughness={0.65} /></RBox>
    <mesh position={[0, y0 + H_ / 2, 0.012]}><cylinderGeometry args={[0.012, 0.012, H_, 16]} />{M.glass({})}</mesh>
    <mesh position={[0, y0 - 0.01, 0.012]}><sphereGeometry args={[0.032, 20, 16]} /><meshStandardMaterial color="#c7341f" roughness={0.3} /></mesh>
    <mesh position={[0, y0 + (0.05 + 0.4 * k) / 2, 0.012]}><cylinderGeometry args={[0.008, 0.008, 0.05 + 0.4 * k, 12]} /><meshStandardMaterial color="#c7341f" roughness={0.3} /></mesh>
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[0.06, y0 + 0.05 + i * 0.04, 0.0015]}><planeGeometry args={[i === 10 ? 0.07 : 0.04, 0.0035]} /><meshBasicMaterial color={i === 10 ? "#c7341f" : "#4b3c2b"} /></mesh>)}
    <Sign id="th40" txt="40" p={[-0.08, y0 + 0.45, 0.002]} w={0.09} h={0.07} col="#efe5c9" />
  </>;
}}</Scene3D>;

let crG_: THREE.BufferGeometry | null = null;
const crG = () => { if (!crG_) { const g = new THREE.IcosahedronGeometry(1, 3), P = g.attributes.position, v = new THREE.Vector3(); for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const f = 1 + 0.24 * Math.sin(7 * v.x + 1.3) * Math.cos(6 * v.y + 0.4) * Math.sin(5 * v.z + 2) + 0.1 * Math.sin(13 * v.x + 11 * v.y); P.setXYZ(i, v.x * f, v.y * f, v.z * f); } g.computeVertexNormals(); crG_ = g; } return crG_; };
const Crumple: React.FC<{ s: number[]; rot?: number[] }> = ({ s, rot = [0, 0, 0] }) => <mesh geometry={crG()} scale={s as any} rotation={rot as any} castShadow><meshStandardMaterial color="#e8e0cc" roughness={0.92} flatShading /></mesh>;

// ---- EL BOLLO DE PAPEL: la hoja se arruga y entra suelta en la boca del pozo ----
export const HPaperStuff: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.6]} cam={{ at: [0, 0.14, 0.4], az: [0.34, 0.14], el: [0.26, 0.2], r: [0.92, 0.76], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.7} x={960} y={940} txt="LOOSE. NOT TIGHT." col={AMB} />}>{(tt) => {
  const c = eio(tt, 0.3, 1.6), m = eio(tt, 1.7, 2.8), sz = lerp(0.2, 0.09, c), N = 7;
  return <>
    <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.25, 0.38]}><planeGeometry args={[2.2, 0.5]} /><meshStandardMaterial color="#2a2722" roughness={1} /></mesh>
    <mesh position={[0, 0.13, 0.385]}><circleGeometry args={[0.13, 40]} /><meshBasicMaterial color="#090706" /></mesh>
    <group position={[lerp(-0.44, 0, m), lerp(0.28, 0.13, m), lerp(0.62, 0.42, m)]}>
      <Crumple s={[lerp(0.2, 0.085, c), lerp(0.2, 0.085, c), lerp(0.006, 0.085, c)]} rot={[0.5 + c, c * 2, 0.3]} />
    </group>
  </>;
}}</Scene3D>;

// ---- LA HARINA NO MIENTE: el papel salió, y huellas van de adentro hacia afuera ----
export const HPaperOut: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1.1, 2.1, 1.4]} cam={{ at: [0.06, 0.04, 0.72], az: [0.2, 0.0], el: [0.82, 0.72], r: [1.3, 1.1], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="SOMEBODY'S STILL HOME" col={RED} />}>{(tt) => {
  const fall = phys(tt, 0.3, 7, 0.4);
  return <>
    <Dirt w={7} d={5} rx={6} p={[0, 0, 0]} />
    <mesh position={[0, 0.25, 0.38]}><planeGeometry args={[2.2, 0.5]} /><meshStandardMaterial color="#2a2722" roughness={1} /></mesh>
    <mesh position={[0, 0.13, 0.385]}><circleGeometry args={[0.13, 40]} /><meshBasicMaterial color="#090706" /></mesh>
    <mesh position={[0.02, 0.006, 0.7]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.72, 0.5]} /><meshStandardMaterial color="#f0ebdc" roughness={1} /></mesh>
    <group position={[-0.02, lerp(0.28, 0.06, fall), lerp(0.42, 0.53, fall)]} rotation={[0.4, 1, 0.3]}><Crumple s={[0.06, 0.06, 0.06]} /></group>
    {Array.from({ length: 8 }, (_, i) => { const on = eio(tt, 1.2 + i * 0.22, 1.42 + i * 0.22), x = (i % 2 ? 0.07 : -0.03), z = 0.5 + i * 0.06; return <group key={i} position={[x, 0.0075, z]} scale={on + 0.001}>
      <mesh rotation={[-PI / 2, 0, 0]} scale={[1, 0.8, 1]}><circleGeometry args={[0.022, 18]} /><meshStandardMaterial color="#6f5639" roughness={1} /></mesh>
      {[-0.024, -0.012, 0, 0.012, 0.024].map((d, j) => <mesh key={j} position={[d, 0, 0.024 - Math.abs(d) * 0.3]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.006, 10]} /><meshStandardMaterial color="#6f5639" roughness={1} /></mesh>)}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- LA TIRA A MEDIDA: el rollo baja desde el deck y se le suman veinticuatro bajo tierra ----
export const HRollMeasure: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.6]} cam={{ at: [0, 0.14, 0.6], az: [0.46, 0.28], el: [0.05, 0.05], r: [1.72, 1.44], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={2.9} x={960} y={940} txt="HEIGHT PLUS 24 INCHES" col={AMB} />}>{(tt) => {
  const a = eio(tt, 0.4, 1.9), b = eio(tt, 2.3, 3.7), L1 = 0.5 * a, L2 = 0.42 * b, W = 0.9;
  return <>
    <SoilBlock w={3.4} h={0.5} d={1.2} p={[0, 0, 0]} grass={false} />
    <RBox s={[3, 0.1, 0.06]} p={[0, 0.55, 0.57]} r={0.008}>{M.wood({ base: [108, 78, 50] })}</RBox>
    <group position={[0, 0.5, 0.6065]}><group position={[0, -L1 / 2, 0]}><MeshPanel w={W} h={Math.max(0.01, L1)} p={[0, 0, 0]} cell={8} rep={8} /></group></group>
    <group position={[0, 0.0, 0.6065]}><group position={[0, -L2 / 2, 0.001]}><MeshPanel w={W} h={Math.max(0.01, L2)} p={[0, 0, 0]} cell={8} rep={8} /></group><mesh visible={b > 0.05} position={[0, -L2 / 2, 0.003]}><planeGeometry args={[W, Math.max(0.01, L2)]} /><meshBasicMaterial color="#e0a93c" transparent opacity={0.2} depthWrite={false} /></mesh></group>
    <mesh position={[0, 0.5 - L1 + 0.02, 0.64]} rotation={[0, 0, PI / 2]} visible={b < 0.95}><cylinderGeometry args={[0.07 - 0.03 * a, 0.07 - 0.03 * a, W + 0.02, 32]} /><meshStandardMaterial color="#6d6e70" metalness={0.5} roughness={0.5} /></mesh>
    <RBox s={[0.05, 0.92, 0.012]} p={[W / 2 + 0.1, 0.04, 0.64]} r={0.003}><meshStandardMaterial color="#e6c042" roughness={0.45} /></RBox>
    {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[W / 2 + 0.1, -0.42 + i * 0.077, 0.6465]}><planeGeometry args={[0.03, 0.005]} /><meshBasicMaterial color="#1b1a16" /></mesh>)}
  </>;
}}</Scene3D>;

// ---- ESCARBA Y SE RINDE: el pozo baja, topa la L y se va ----
export const HDigQuits: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1.2, 2, 1.8]} cam={{ at: [0, -0.1, 0.1], az: [0.02, -0.02], el: [0.04, 0.05], r: [1.7, 1.42], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.5} x={960} y={940} txt="HE DIGS AND QUITS" col={GRN} />}>{(tt) => {
  const d = eio(tt, 0.5, 2.2), q = eio(tt, 3.7, 5.6), holeH = 0.26 * d, Lz = 0.307, wx = 0.1;
  return <>
    <SoilBlock w={3.4} h={0.7} d={0.6} p={[0, 0, 0]} grass />
    <RBox s={[0.02, 0.26, 0.008]} p={[wx, -0.13, Lz]} r={0.001}><meshStandardMaterial color="#7b7d7e" metalness={0.6} roughness={0.5} /></RBox>
    <RBox s={[0.72, 0.012, 0.008]} p={[wx - 0.36, -0.26, Lz]} r={0.001}><meshStandardMaterial color="#7b7d7e" metalness={0.6} roughness={0.5} /></RBox>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[wx - 0.03 - i * 0.043, -0.26, Lz + 0.005]}><planeGeometry args={[0.004, 0.03]} /><meshBasicMaterial color="#c8cacb" /></mesh>)}
    <RBox s={[0.06, 0.62, 0.06]} p={[wx + 0.03, 0.31, 0.27]} r={0.008}>{M.wood({ base: [108, 78, 50] })}</RBox>
    <mesh position={[-0.28, -holeH / 2, 0.3065]} scale={[0.115, Math.max(0.006, holeH / 2), 1]}><circleGeometry args={[1, 44]} /><meshBasicMaterial color="#26180d" /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const u = (tt * 2 + i * 0.3) % 1; return <mesh key={i} visible={d > 0.04 && d < 0.98} position={[-0.28 - 0.14 * u, 0.06 + 0.24 * Math.sin(u * PI), 0.3]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#4e3522" roughness={1} /></mesh>; })}
    <Skunk p={[lerp(-0.42, -1.25, q), 0.0, 0.18]} rot={[q > 0.02 ? 0 : 0.2, q > 0.02 ? PI : 0, 0]} s={0.82} walk={q > 0 && q < 1 ? tt * 2 : tt * 6 * d * (1 - d)} tail={0.4} />
  </>;
}}</Scene3D>;

// ---- LOS GUSANITOS BUENOS: las gotas caen y los hilos van a buscar la larva ----
export const HNemaDrop: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" key1={[-1, 2, 1.4]} cam={{ at: [0, -0.1, 0.25], az: [0.22, -0.06], el: [0.05, 0.06], r: [1.04, 0.84], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="TINY WORMS. OVER 55°." col={GRN} />}>{(tt) => {
  const f = phys(tt, 0.4, 6, 0.5), g = 1 - eio(tt, 4.2, 5.4);
  return <>
    <SoilBlock w={3.4} h={0.5} d={0.6} p={[0, 0, 0]} grass />
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 1.1 + i / 12) % 1; return <mesh key={i} position={[-0.3 + i * 0.054, 0.6 - ph * 0.6, 0.27]}><sphereGeometry args={[0.009, 10, 8]} />{M.water({})}</mesh>; })}
    <group position={[0.02, -0.24, 0.31]} scale={[g + 0.001, g + 0.001, 1]}><Grub p={[0, 0, 0]} s={1.9} rot={[0, 0, 0.4]} /></group>
    {Array.from({ length: 10 }, (_, i) => { const a = i * 0.63, k = cl(eio(tt, 1.0 + i * 0.1, 3.8) * f), sx = -0.34 + i * 0.076, x = lerp(sx, 0.02 + Math.cos(a) * 0.03, k), y = lerp(-0.015, -0.24 + Math.sin(a) * 0.02, k); return <group key={i} position={[x, y, 0.3095]} rotation={[0, 0, Math.atan2(-0.22, 0.02 - sx) + Math.sin(tt * 12 + i) * 0.5]}><mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.003, 0.05, 3, 6]} /><meshBasicMaterial color="#f7ecd2" /></mesh></group>; })}
  </>;
}}</Scene3D>;

// ---- LA CUENTA: tablas de deck arrancadas salen volando ----
export const HDeckPull: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" key1={[-1, 2, 1.4]} cam={{ at: [0, 0.3, 0], az: [-0.46, -0.3], el: [0.42, 0.32], r: [2.1, 1.76], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={940} txt="DON'T TEAR IT UP FIRST" col={RED} />}>{(tt) => <>
  <Lawn />
  {[-0.82, 0, 0.82].flatMap((x) => [-0.46, 0.46].map((z) => <RBox key={x + "_" + z} s={[0.08, 0.32, 0.08]} p={[x, 0.16, z]} r={0.01}>{M.wood({ base: [98, 72, 48] })}</RBox>))}
  {[-0.3, 0.3].map((z) => <RBox key={z} s={[1.8, 0.09, 0.05]} p={[0, 0.355, z]} r={0.006}>{M.wood({ base: [108, 78, 50] })}</RBox>)}
  {Array.from({ length: 11 }, (_, i) => { const k = eio(tt, 0.4 + i * 0.26, 1.1 + i * 0.26), f = i % 2 ? 1 : -1, x = -0.8 + i * 0.16; return <group key={i} position={[x + f * k * 0.7, 0.42 + 0.78 * Math.sin(k * PI) * (1 - k * 0.3) - k * 0.38, 0.75 * k * f * 0.5]} rotation={[k * 1.3 * f, k * 2.2 * f, k * 2]}>
    <RBox s={[0.15, 0.03, 1.2]} p={[0, 0, 0]} r={0.006}>{M.wood({ base: [146 - (i % 3) * 8, 106, 66] })}</RBox>
    {[-0.5, 0, 0.5].map((z) => <mesh key={z} position={[0, -0.03, z]}><cylinderGeometry args={[0.004, 0.0008, 0.08, 6]} />{M.steel({ col: "#68615a" })}</mesh>)}
  </group>; })}
  <Blades w={3.2} d={1.9} n={230} h={0.05} />
</>}</Scene3D>;

// ---- LA LINTERNA: el cono barre la pared y un rincón revela la segunda salida ----
export const HFlashGap: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f0e12" key1={[-1, 0.5, 1]} cam={{ at: [0.42, 0.22, 0.5], az: [0.28, 0.08], el: [0.08, 0.06], r: [1.5, 1.24], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="THE SECOND DOOR" col={AMB} />}>{(tt) => {
  const s = eio(tt, 0.3, 3.2), lx = lerp(-1.0, 0.72, s), lit = (x: number) => cl(1 - Math.abs(x - lx) / 0.34), hex = (v: number) => Math.round(Math.min(1, v) * 255).toString(16).padStart(2, "0");
  return <>
    <mesh position={[0, 0.0, 1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color="#14110e" /></mesh>
    {Array.from({ length: 26 }, (_, i) => { const x = -1.3 + i * 0.1, g = i === 20 || i === 21, b = lit(x); return <mesh key={i} position={[x, g ? 0.36 : 0.26, 0.5]}><planeGeometry args={[0.092, g ? 0.28 : 0.5]} /><meshBasicMaterial color={"#" + hex(0.18 + 0.48 * b) + hex(0.15 + 0.4 * b) + hex(0.12 + 0.26 * b)} /></mesh>; })}
    <mesh position={[0.75, 0.11, 0.499]}><planeGeometry args={[0.2, 0.22]} /><meshBasicMaterial color="#000" /></mesh>
    <mesh position={[0.75, 0.005, 0.74]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.46]} /><meshBasicMaterial color={"#" + hex(0.12 + 0.34 * lit(0.75)) + hex(0.09 + 0.26 * lit(0.75)) + hex(0.06 + 0.16 * lit(0.75))} /></mesh>
    <sprite position={[lx, 0.27, 0.503]} scale={[1.0, 1.0, 1]}><spriteMaterial map={puffT()} color="#ffeec0" transparent opacity={0.4} depthWrite={false} depthTest={false} /></sprite>
    <group position={[lerp(-0.2, 0.2, s), 0.3, 1.25]} rotation={[0.1, lerp(-0.7, 0.42, s) + PI, 0]}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.022, 0.2, 20]} />{M.steel({ col: "#50504e" })}</mesh>
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.12]}><cylinderGeometry args={[0.044, 0.03, 0.05, 24]} />{M.steel({ col: "#68686a" })}</mesh>
      <mesh position={[0, 0, 0.1455]}><circleGeometry args={[0.04, 24]} />{M.glow({ col: "#fff2cd" })}</mesh>
    </group>
    {Array.from({ length: 12 }, (_, i) => { const a = lerp(lerp(-0.2, 0.2, s), lx, (i + 1) / 13), zz = lerp(1.25, 0.51, (i + 1) / 13), r = 0.02 + 0.3 * ((i + 1) / 13); return <sprite key={i} position={[a, 0.28, zz]} scale={[r * 3.2, r * 3.2, 1]}><spriteMaterial map={puffT()} color="#ffeec0" transparent opacity={0.07} depthWrite={false} depthTest={false} /></sprite>; })}
  </>;
}}</Scene3D>;

// ---- DÍA OCHO: un nudo por noche en la soga que cuelga del poste ----
export const HKnotRope: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-1, 2, 1.4]} cam={{ at: [0, 0.42, 0], az: [0.22, -0.1], el: [0.04, 0.05], r: [1.46, 1.2], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="DAY EIGHT" col={AMB} />}>{(tt) => {
  const Y0 = 0.8, st = 0.082;
  return <>
    <Lawn />
    <RBox s={[0.16, 1.0, 0.14]} p={[0, 0.5, -0.12]} r={0.012}>{M.wood({ base: [116, 84, 54] })}</RBox>
    <mesh position={[0, Y0 + 0.012, -0.034]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.06, 10]} />{M.steel({})}</mesh>
    <mesh position={[0, Y0 - 0.34, -0.03]}><cylinderGeometry args={[0.009, 0.009, 0.7, 14]} /><meshStandardMaterial color="#b89f74" roughness={1} /></mesh>
    {Array.from({ length: 8 }, (_, i) => { const k = phys(tt, 0.2 + i * 0.42, 9, 0.35); return <mesh key={i} position={[0, Y0 - 0.06 - i * st, -0.03]} scale={Math.max(0.001, k)} rotation={[i, i * 2, 0]} castShadow><torusKnotGeometry args={[0.018, 0.009, 44, 8, 2, 3]} /><meshStandardMaterial color="#a78c5f" roughness={1} /></mesh>; })}
    <group position={[0.5, 0, 0.26]} rotation={[0, -0.5, 0]}><Boot s={1.2} /></group>
    <Blades w={3} d={1.8} n={240} h={0.05} />
  </>;
}}</Scene3D>;

// ---- LAS LLAVES: el manojo tiembla en primer plano y las ondas se abren ----
export const HShakeKeys: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#1a1712" key1={[-1, 1.9, 1.4]} cam={{ at: [0, 0.32, 0], az: [-0.14, 0.14], el: [0.03, 0.05], r: [0.62, 0.5], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="SO HE KNOWS YOU'RE COMING" col={AMB} />}>{(tt) => {
  const sh = Math.sin(tt * 22) * (0.6 + 0.4 * Math.sin(tt * 1.6));
  return <group position={[0, 0.4, 0]} rotation={[0, 0, sh * 0.08]}>
    <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.006, 10, 44]} />{M.steel({ col: "#d0d0cb" })}</mesh>
    {Array.from({ length: 6 }, (_, i) => <group key={i} position={[Math.cos(i * 1.04 - 2.6) * 0.05, -0.04, 0.002 * i]} rotation={[0.02 * i, 0.1 * i, (-0.6 + i * 0.24) + sh * 0.3 * (i % 2 ? 1 : -1)]}>
      <mesh position={[0, -0.04, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.024, 0.006, 20]} />{i % 2 ? M.brass() : M.steel({ col: "#c4c5c1" })}</mesh>
      <RBox s={[0.018, 0.12, 0.004]} p={[0, -0.12, 0]} r={0.001}>{i % 2 ? M.brass() : M.steel({ col: "#c4c5c1" })}</RBox>
      {[0, 1, 2].map((k) => <RBox key={k} s={[0.008, 0.012, 0.0045]} p={[0.012, -0.16 + k * 0.024, 0]} r={0.001}>{i % 2 ? M.brass() : M.steel({ col: "#c4c5c1" })}</RBox>)}
    </group>)}
    {[0, 1, 2].map((i) => { const ph = (tt * 0.9 + i / 3) % 1; return <mesh key={"r" + i} position={[0, -0.1, -0.04]}><ringGeometry args={[0.16 + ph * 0.42, 0.166 + ph * 0.42, 56]} /><meshBasicMaterial color="#f5d58a" transparent opacity={0.34 * (1 - ph)} depthWrite={false} /></mesh>; })}
  </group>;
}}</Scene3D>;

// ---- EL ASPERSOR HELADO: dispara, el chorro se congela en el aire y él pasa por abajo ----
export const HSprinklerIce: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" key1={[-1, 2, 1.2]} bg="#23283f" cam={{ at: [0.05, 0.24, 0], az: [0.26, 0.02], el: [0.13, 0.1], r: [1.95, 1.62], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.5} x={960} y={940} txt="FOR A WHILE. THEN HE LEARNS." col={AMB} />}>{(tt) => {
  const fr = eio(tt, 2.0, 2.9), T = tt < 2.4 ? tt : 2.4 + (tt - 2.4) * 0.03, w = eio(tt, 3.1, 6.0);
  return <>
    <Lawn />
    <group position={[0.7, 0, 0]}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.02, 0.05, 0.18, 18]} /><meshStandardMaterial color="#c49a2c" roughness={0.3} metalness={0.6} /></mesh>
      <mesh position={[0, 0.19, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.012, 0.012, 0.12, 12]} /><meshStandardMaterial color="#c49a2c" roughness={0.3} metalness={0.6} /></mesh>
      <mesh position={[-0.02, 0.26, 0]}><sphereGeometry args={[0.01 + 0.02 * fr, 12, 10]} />{M.glow({ col: "#ff5344", op: 1 - fr * 0.7 })}</mesh>
    </group>
    {Array.from({ length: 58 }, (_, i) => { const u = ((T * 0.8 + i / 58) % 1), x = lerp(0.68, -0.8 - rn(i, 3) * 0.1, u), y = 0.22 + 0.48 * Math.sin(u * PI * 0.92) - u * 0.2, z = (rn(i, 2) - 0.5) * 0.18 * u; return <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.009 + 0.009 * fr, 8, 6]} /><meshPhysicalMaterial color={fr > 0.5 ? "#d7f0fc" : "#bfe6f6"} roughness={0.2} transparent opacity={0.85} /></mesh>; })}
    <Skunk p={[lerp(-1.3, 1.25, w), 0, 0.22]} s={0.76} walk={tt * 2.2} tail={0.2} />
    <Blades w={3} d={1.7} n={230} h={0.05} />
  </>;
}}</Scene3D>;

// ---- LA HOJA GRATIS: el papel doblado se abre sobre la mesa y aparecen las huellas ----
export const HDkBag: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" key1={[-1, 2, 1.4]} cam={{ at: [0, 0.16, 0], az: [-0.08, 0.1], el: [0.82, 0.68], r: [0.96, 0.8], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="FREE. NO EMAIL." col={GRN} />}>{(tt) => {
  const o1 = eio(tt, 0.5, 1.4), o2 = eio(tt, 1.5, 2.4), W = 0.56, D = 0.34, y = 0.05;
  return <>
    <RBox s={[1.6, 0.04, 0.9]} p={[0, 0.02, 0]} r={0.01}>{M.wood({ base: [146, 106, 66] })}</RBox>
    <group position={[0, y, 0]}>
      <Sign id="dkb" txt="DIG KEY" sub="WHO DUG IT?" p={[0, 0.002, 0]} rot={[-PI / 2, 0, 0]} w={W} h={D} col="#efe5c9" />
      <group position={[W / 2, 0.006, 0]} rotation={[0, 0, (1 - o1) * PI * 0.98]}><mesh position={[-W / 4, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W / 2, D]} /><meshStandardMaterial color="#e8dfc7" roughness={0.9} side={2} /></mesh></group>
      <group position={[-W / 2, 0.007, 0]} rotation={[0, 0, -(1 - o2) * PI * 0.98]}><mesh position={[W / 4, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W / 2, D]} /><meshStandardMaterial color="#ded4ba" roughness={0.9} side={2} /></mesh></group>
    </group>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} visible={o2 > 0.9} position={[-0.17 + i * 0.085, 0.056, 0.13 - 0.02 * (i % 2)]} rotation={[-PI / 2, 0, i]} scale={phys(tt, 2.6 + i * 0.16, 9, 0.35) + 0.001}><circleGeometry args={[0.014, 18]} /><meshStandardMaterial color="#54381f" roughness={1} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- JUGO DE TOMATE: la lata cae sobre el perro y sale rosado, olor intacto ----
export const HTomatoJuice: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" key1={[-1, 2, 1.4]} cam={{ at: [0, 0.2, 0], az: [0.24, 0.0], el: [0.18, 0.13], r: [1.2, 1.0], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.8} x={960} y={940} txt="PINK DOG. SAME SMELL." col={RED} />}>{(tt) => {
  const p = eio(tt, 0.3, 1.0), fl = eio(tt, 1.0, 3.0), body = fl > 0.4 ? "#d98a84" : "#e5dcc8", pts = 8;
  return <>
    <group position={[-0.05, 0, 0]}>
      <mesh position={[0, 0.17, 0]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.1, 0.32, 12, 26]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>
      <mesh position={[0.28, 0.29, 0]} castShadow><sphereGeometry args={[0.095, 26, 20]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>
      <mesh position={[0.37, 0.27, 0]} scale={[1.2, 0.8, 0.8]}><sphereGeometry args={[0.055, 20, 14]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>
      <mesh position={[0.427, 0.28, 0]}><sphereGeometry args={[0.016, 14, 10]} /><meshPhysicalMaterial color="#111" roughness={0.3} clearcoat={0.8} /></mesh>
      {[0.09, -0.09].map((z) => <mesh key={z} position={[0.26, 0.31, z]} rotation={[0.4 * Math.sign(z), 0, -0.3]}><capsuleGeometry args={[0.03, 0.09, 6, 12]} /><meshStandardMaterial color="#a4766c" roughness={0.9} /></mesh>)}
      {[[0.16, 0.075], [0.16, -0.075], [-0.16, 0.075], [-0.16, -0.075]].map((q, i) => <mesh key={i} position={[q[0], 0.06, q[1]]}><capsuleGeometry args={[0.03, 0.07, 6, 12]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>)}
      <mesh position={[-0.28, 0.26, 0]} rotation={[0, 0, 0.9 + 0.15 * Math.sin(tt * 2)]}><capsuleGeometry args={[0.018, 0.14, 6, 10]} /><meshStandardMaterial color={body} roughness={0.9} /></mesh>
    </group>
    <group position={[0.02, 0.74, 0]} rotation={[0, 0, lerp(0, PI * 0.74, p)]}>
      <mesh castShadow><cylinderGeometry args={[0.078, 0.078, 0.2, 32]} />{M.steel({ col: "#c4c5c1" })}</mesh>
      <mesh position={[0, 0, 0.0795]}><planeGeometry args={[0.15, 0.11]} /><meshStandardMaterial color="#b33623" roughness={0.6} /></mesh>
    </group>
    {Array.from({ length: 26 }, (_, i) => { const u = (tt * 1.7 + i / 26) % 1; return <mesh key={i} visible={p > 0.8 && fl < 0.97} position={[-0.04 + (rn(i, 2) - 0.5) * 0.2, 0.7 - u * 0.44, (rn(i, 3) - 0.5) * 0.14]}><sphereGeometry args={[0.012, 8, 6]} /><meshPhysicalMaterial color="#b33623" roughness={0.3} /></mesh>; })}
    {Array.from({ length: pts }, (_, i) => { const u = (tt * 0.4 + i / pts) % 1; return <mesh key={"s" + i} visible={fl > 0.7} position={[-0.06 + Math.sin(u * 7 + i) * 0.06 + (i - 4) * 0.05, 0.3 + u * 0.56, 0]}><sphereGeometry args={[0.03 + u * 0.05, 14, 10]} /><meshBasicMaterial color="#b9c15b" transparent opacity={0.32 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- LO CAMBIA QUÍMICAMENTE: la molécula amarilla se parte cuando la toca la burbuja ----
export const HSulfurBreak: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1e2a3a" key1={[-1, 2, 1.5]} cam={{ at: [0, 0.42, 0], az: [0.3, -0.15], el: [0.06, 0.05], r: [1.38, 1.14], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="CHANGE IT. DON'T COVER IT." col={GRN} />}>{(tt) => {
  const b = eio(tt, 0.3, 1.9), br = phys(tt, 1.9, 8, 0.45);
  return <>
    <mesh position={[0, 0.5, -1]}><planeGeometry args={[6, 3]} /><meshBasicMaterial color="#1e2a3a" /></mesh>
    {[-1, 1].map((sg) => <group key={sg} position={[sg * (0.09 + br * 0.5), 0.42 + sg * br * 0.1, 0]}>
      <mesh castShadow><sphereGeometry args={[0.13, 40, 28]} /><meshPhysicalMaterial color="#e6c23a" roughness={0.3} clearcoat={0.7} /></mesh>
      {[0, 1].map((i) => <mesh key={i} position={[sg * 0.13, (i ? -1 : 1) * 0.1, 0]}><sphereGeometry args={[0.052, 24, 18]} />{M.porcelain({ col: "#edece6" })}</mesh>)}
    </group>)}
    <mesh position={[0, 0.42, 0]} rotation={[0, 0, PI / 2]} visible={br < 0.1}><cylinderGeometry args={[0.03, 0.03, 0.2, 18]} />{M.steel({ col: "#d0d0cb" })}</mesh>
    <mesh position={[lerp(1.3, 0.1, b), 0.54 - 0.12 * b, 0.1]} visible={br < 0.5}><sphereGeometry args={[0.09, 32, 24]} /><meshPhysicalMaterial color="#cce7f8" roughness={0.05} transparent opacity={0.45} clearcoat={1} /></mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.28, r = 0.08 + br * 0.8; return <mesh key={i} visible={br > 0.04 && br < 0.99} position={[Math.cos(a) * r, 0.42 + Math.sin(a) * r * 0.7, 0.04]}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#e6f5ff" transparent opacity={1 - br} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- BOTELLA CERRADA: se hincha, la tapa salta y revienta ----
export const HBottleBurst: React.FC<P_> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" key1={[-1, 2, 1.4]} cam={{ at: [0, 0.26, 0], az: [0.26, -0.04], el: [0.12, 0.09], r: [1.06, 0.88], fov: 26 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="NEVER CAP IT" col={RED} />}>{(tt) => {
  const s = eio(tt, 0.3, 2.3), burst = cl((tt - 2.3) * 1.6), on = tt < 2.3, W = 1 + s * 0.3 + (s > 0.8 ? 0.01 * Math.sin(tt * 44) : 0);
  return <>
    <group visible={on} scale={[W, 1 + s * 0.05, W]}>
      <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.09, 0.09, 0.3, 40]} /><meshPhysicalMaterial color="#d7eefc" roughness={0.12} transparent opacity={0.55} /></mesh>
      <mesh position={[0, 0.355, 0]}><cylinderGeometry args={[0.035, 0.088, 0.06, 32]} /><meshPhysicalMaterial color="#d7eefc" roughness={0.12} transparent opacity={0.55} /></mesh>
      <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.083, 0.083, 0.26, 36]} /><meshPhysicalMaterial color="#f0ebdb" roughness={0.2} transparent opacity={0.72} /></mesh>
    </group>
    {Array.from({ length: 16 }, (_, i) => { const u = (tt * 0.9 + i / 16) % 1; return <mesh key={i} visible={on} position={[Math.sin(i * 2) * 0.05, 0.05 + u * 0.3, Math.cos(i * 2) * 0.05]}><sphereGeometry args={[0.009, 8, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.8} /></mesh>; })}
    <mesh visible={!on} position={[0.3 * burst, Math.max(0.056, 0.42 + 1.1 * burst - 1.5 * burst * burst), 0.1 * burst]} rotation={[burst < 1 ? burst * 8 : 0, 0, burst < 1 ? burst * 4 : 0]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.03, 24]} /><meshStandardMaterial color="#c6352c" roughness={0.35} /></mesh>
    {Array.from({ length: 36 }, (_, i) => { const a = i * 1.47, sp = 0.16 + rn(i, 2) * 0.6, v = 0.9 + rn(i, 3) * 0.5, x = Math.cos(a) * sp * burst, z = Math.sin(a) * sp * 0.5 * burst, y = Math.max(0.047, 0.18 + v * burst - (v + 0.14) * burst * burst), land = burst >= 0.98; return <mesh key={i} visible={!on} position={[x, y, z]} rotation={land ? [-PI / 2, 0, a] : [a * burst * 4, a, burst * 5]}><boxGeometry args={[i % 3 ? 0.03 : 0.052, i % 3 ? 0.052 : 0.03, 0.002]} /><meshPhysicalMaterial color="#d7eefc" roughness={0.12} transparent opacity={0.7} side={2} /></mesh>; })}
    <mesh visible={!on} position={[0.02, 0.0445, 0.02]} rotation={[-PI / 2, 0, 0]} scale={[burst + 0.001, burst * 0.7 + 0.001, 1]}><circleGeometry args={[0.36, 48]} /><meshPhysicalMaterial color="#efe9d6" roughness={0.16} clearcoat={0.7} /></mesh>
    {Array.from({ length: 28 }, (_, i) => { const a = i * 2.13, k = burst, r = (0.1 + rn(i, 2) * 0.5) * k; return <mesh key={"f" + i} visible={!on && k < 1} position={[Math.cos(a) * r, 0.22 + rn(i, 3) * 0.3 * k, Math.sin(a) * r * 0.5]}><sphereGeometry args={[0.03 + rn(i, 4) * 0.03, 12, 10]} /><meshBasicMaterial color="#f7f3e6" transparent opacity={0.9 * (1 - k)} /></mesh>; })}
  </>;
}}</Scene3D>;
