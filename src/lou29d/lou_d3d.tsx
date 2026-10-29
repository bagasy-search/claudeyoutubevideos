// lou29d · componentes 3D de los almuerzos de Frank: UN objeto grande y centrado que hace lo que Lou dice en ese segundo;
// la comida va como foto real adentro de la loza. Ninguno repite un componente de lou29a, b ni c.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { preload, G, Plate, Pot, Pour, Sheet, Skillet, Std, Steam3, Tool, ez, lerp, rnd, sp, useTex, useFoodTex, V3 } from "./props3d";
import { R3, Cap, drop } from "./lou_r3a";
import { FONT } from "./lib";

preload(["ld_n15a", "ld_n14a", "ld_n13a", "ld_n12a", "ld_n11a", "ld_n10a", "ld_n09a", "ld_n08a", "ld_n07a", "ld_n06a", "ld_n05a", "ld_n04a", "ld_n03a", "ld_n02a", "ld_n01a"]);
type P = { t: number; h: H };
const steel = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.22 });
const chrome = new THREE.MeshStandardMaterial({ color: "#f4f6f8", metalness: 1, roughness: 0.12 });
const glass = new THREE.MeshPhysicalMaterial({ color: "#eef6f4", roughness: 0.04, transparent: true, opacity: 0.25, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
const china = new THREE.MeshPhysicalMaterial({ color: "#f4f1ea", roughness: 0.25, clearcoat: 1, side: THREE.DoubleSide });
const wood = new THREE.MeshStandardMaterial({ color: "#8a5a32", roughness: 0.62 });
const BOWL = new THREE.LatheGeometry(([[0.001, 0], [0.2, 0], [0.32, 0.06], [0.42, 0.2], [0.44, 0.24], [0.425, 0.24], [0.4, 0.2], [0.3, 0.075], [0.19, 0.02], [0.001, 0.02]] as [number, number][]).map(([r, y]) => new THREE.Vector2(r, y)), 64);
const k0 = (tt: number, a: number, w = 8, z = 0.42) => sp(tt, a, w, z);
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), k).getStyle();
const FoodMesh: React.FC<{ tex: string; c?: string; cc?: number; r0?: number; children: React.ReactNode; p?: V3; r?: V3; s?: V3 | number }> = ({ tex, c = "#ffffff", cc = 0.2, r0 = 0.7, children, p, r, s }) => {
  const ft = useFoodTex(tex);
  return <G p={p} r={r} s={s}><mesh castShadow>{children}<meshPhysicalMaterial key={ft ? "t" : "n"} map={ft ?? undefined} color={c} roughness={r0} clearcoat={cc} /></mesh></G>;
};
const TexMat: React.FC<{ id: string; w: number; h: number; draw: (g: CanvasRenderingContext2D, w: number, h: number) => void; r0?: number; m?: number }> = ({ id, w, h, draw, r0 = 0.6, m = 0 }) => {
  const tx = useTex(id, w, h, draw);
  return <meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={r0} metalness={m} />;
};
const Bowl: React.FC<{ p?: V3; s?: number; mat?: THREE.Material }> = ({ p, s = 1, mat = china }) => <G p={p} s={s}><mesh geometry={BOWL} material={mat} castShadow receiveShadow /></G>;
const TOP: { p: V3; l: V3; fov: number } = { p: [0, 1.25, 1.3], l: [0, 0.1, 0], fov: 34 };
const TOP2: { p: V3; l: V3; fov: number } = { p: [0.06, 1.12, 1.12], l: [0, 0.1, 0], fov: 32 };

// d00 · el plato de dieta: la latita de pimentón espolvorea rojo sobre el copo de queso cottage
export const RPaprika: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 0.95], l: [0, 0.08, 0], fov: 34 }} cam2={{ p: [0.05, 0.85, 0.82], l: [0, 0.08, 0], fov: 32 }} f={(tt) => {
  const sh = tt > 1.0 && tt < 3.6, dust = ez(tt, 1.1, 3.6);
  return <>
    <Plate rad={0.55} />
    <G p={[-0.12, 0.03, 0]} s={[1.3, 0.7, 1.3]}><mesh castShadow><sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#f3efe4" roughness={0.55} clearcoat={0.3} side={THREE.DoubleSide} /></mesh></G>
    {[...Array(26)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.15 * Math.sqrt(rnd(i, 2)); return <mesh key={i} position={[-0.12 + Math.cos(a) * r, 0.06 + 0.07 * (1 - r / 0.15) + 0.02 * rnd(i, 3), Math.sin(a) * r]} castShadow><sphereGeometry args={[0.035, 12, 8]} /><Std c="#fbf8ee" r={0.55} /></mesh>; })}
    {[...Array(60)].map((_, i) => { const k = ez(tt, 1.1 + i * 0.04, 1.4 + i * 0.04); const a = rnd(i, 4) * 6.28, r = 0.13 * Math.sqrt(rnd(i, 5)); return k > 0.01 ? <mesh key={"p" + i} position={[-0.12 + Math.cos(a) * r, 0.16 + 0.4 * (1 - k), Math.sin(a) * r]}><boxGeometry args={[0.012, 0.006, 0.012]} /><Std c="#c4321a" r={0.8} /></mesh> : null; })}
    <G p={[0.28, 0.04, 0.05]} s={1.1}><FoodMesh tex="dough" c="#f2a83a" cc={1} r0={0.25}><sphereGeometry args={[0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></FoodMesh></G>
    <G p={[-0.08 + 0.03 * Math.sin(tt * 18) * (sh ? 1 : 0), 0.62 - 0.1 * (1 - dust) * 0, 0]} r={[0, 0, 2.5 * ez(tt, 0.6, 1.0) * (1 - ez(tt, 3.6, 4.0))]}>
      <mesh castShadow><cylinderGeometry args={[0.07, 0.07, 0.18, 32]} /><Std c="#b3241b" r={0.35} cc={1} /></mesh>
      <mesh position={[0, 0.095, 0]} material={chrome}><cylinderGeometry args={[0.072, 0.072, 0.02, 32]} /></mesh>
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1460} y={150} txt="PAPRIKA" col="#c4321a" />} />;

// d01 · la carne demasiado magra: la de 95 % se encoge y se raja; la de 85 % queda gorda y brillante
const Patty: React.FC<{ p: V3; k: number; lean: boolean }> = ({ p, k, lean }) => <G p={p}>
  <FoodMesh tex="cooked" c={lean ? col("#ffffff", "#b49a88", k) : "#ffffff"} cc={lean ? 0.1 : 0.4 + 0.6 * k} r0={lean ? 0.85 : 0.35} s={lean ? [1 - 0.28 * k, 1 - 0.2 * k, 1 - 0.28 * k] : [1, 1 + 0.15 * k, 1]}><cylinderGeometry args={[0.24, 0.24, 0.07, 48]} /></FoodMesh>
  {lean && k > 0.4 && [...Array(5)].map((_, i) => <mesh key={i} position={[0.12 * Math.cos(i * 1.3), 0.04, 0.12 * Math.sin(i * 1.3)]} rotation-y={i * 1.3}><boxGeometry args={[0.1 * (k - 0.4) * 1.6, 0.004, 0.008]} /><Std c="#3a2018" /></mesh>)}
</G>;
export const RLean85: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0, 1.25, 1.5], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0.05, 1.15, 1.35], l: [0, 0.05, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.9, 4.0);
  return <>
    <G s={1.5}><Patty p={[-0.3, 0.03, 0]} k={k} lean={true} /><Patty p={[0.3, 0.03, 0]} k={k} lean={false} /></G>
    {k > 0.2 && <Steam3 tt={tt} p={[0.45, 0.15, 0]} n={6} spread={0.25} />}
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.6} x={620} y={150} txt="95% LEAN" col="#9a9a96" /><Cap tt={tt} at={1.0} x={1300} y={150} txt="85% · JUICY" col="#e4572e" /></>} />;

// d02 · el chili del día anterior: la hoja del taco de almanaque cae (MON → TUE) y el chili se oscurece
const DayPage: React.FC<{ day: string; p: V3; r?: V3 }> = ({ day, p, r }) => <Sheet id={"day" + day} w={0.42} h={0.42} th={0.006} p={p} r={r} draw={(g, w, hh) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, w, hh); g.fillStyle = "#b3241b"; g.fillRect(0, 0, w, hh * 0.24); g.fillStyle = "#fff"; g.font = `900 ${Math.round(hh * 0.16)}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("DAY", w / 2, hh * 0.12); g.fillStyle = "#1d2440"; g.font = `900 ${Math.round(hh * 0.42)}px ${FONT}`; g.fillText(day, w / 2, hh * 0.62); }} />;
export const RDayTwo: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 1.55], l: [0.05, 0.28, 0], fov: 34 }} cam2={{ p: [0.05, 1.1, 1.38], l: [0.05, 0.3, 0], fov: 32 }} f={(tt) => {
  const fl = ez(tt, 1.4, 2.2), dk = ez(tt, 1.8, 3.6);
  return <>
    <G p={[-0.28, 0, 0]}><Pot rad={0.36} h={0.36} fill={col("#9a3a1c", "#5a1d0c", dk)} level={0.85} /></G>
    {dk > 0.05 && <Steam3 tt={tt} p={[-0.28, 0.4, 0]} n={6} spread={0.3} a={dk} />}
    <G p={[0.42, 0, -0.05]}>
      <mesh position={[0, 0.25, -0.03]} material={wood} castShadow><boxGeometry args={[0.46, 0.5, 0.05]} /></mesh>
      <DayPage day="2" p={[0, 0.25, 0.0]} />
      {fl < 0.99 && <G p={[0, 0.46, 0.01]} r={[-fl * 2.6, 0, 0]}><DayPage day="1" p={[0, -0.21, 0.003]} /></G>}
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.4} x={1460} y={150} txt="BETTER ON DAY 2" col="#e4572e" />} />;

// d03 · el atún en trozos: el tenedor levanta las lascas y las deja enteras (no pasta)
export const RTunaChunks: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 0.95], l: [0, 0.08, 0], fov: 34 }} cam2={{ p: [0.05, 0.85, 0.82], l: [0, 0.08, 0], fov: 32 }} f={(tt) => {
  const lift = Math.max(0, Math.sin(Math.PI * ez(tt, 1.0, 2.2))) + Math.max(0, Math.sin(Math.PI * ez(tt, 2.6, 3.8)));
  return <>
    <Bowl s={1.35} />
    {[...Array(16)].map((_, i) => { const a = rnd(i, 1) * 6.28, r = 0.3 * Math.sqrt(rnd(i, 2)), up = i < 3 ? lift * 0.18 : 0; return <G key={i} p={[Math.cos(a) * r, 0.1 + 0.05 * rnd(i, 3) + up, Math.sin(a) * r]} r={[rnd(i, 4), rnd(i, 5) * 3, rnd(i, 6)]}><FoodMesh tex="dough" c="#efd9c0" cc={0.3} r0={0.55}><dodecahedronGeometry args={[0.07 + 0.03 * rnd(i, 7), 0]} /></FoodMesh></G>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={150} txt="LEAVE CHUNKS" col="#efd9c0" />} />;

// d04 · los porotos: la cazuela con tapa y el anillo de 6 horas que se llena despacio (horno bajo)
export const RBeanCrock: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 1.3], l: [0, 0.28, 0], fov: 34 }} cam2={{ p: [0.05, 0.95, 1.15], l: [0, 0.3, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.8, 5.0), rock = 0.02 * Math.sin(tt * 3) * (k > 0 && k < 1 ? 1 : 0);
  return <>
    <mesh position={[0, 0.003, 0]} rotation-x={-Math.PI / 2}><ringGeometry args={[0.5, 0.58, 96, 1, Math.PI / 2, -Math.PI * 2 * k]} /><meshStandardMaterial color="#e4572e" emissive="#e4572e" emissiveIntensity={0.25} /></mesh>
    {[...Array(6)].map((_, i) => { const a = Math.PI / 2 - (i / 6) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.54, 0.004, -Math.sin(a) * 0.54]} rotation-y={a}><boxGeometry args={[0.1, 0.006, 0.012]} /><Std c="#1d2440" /></mesh>; })}
    <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.3, 0.24, 0.4, 48]} /><meshPhysicalMaterial color="#7a3e1e" roughness={0.3} clearcoat={1} /></mesh>
    <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.305, 0.305, 0.14, 48]} /><meshPhysicalMaterial color="#e9d9b8" roughness={0.3} clearcoat={1} /></mesh>
    <G p={[0, 0.41 + Math.abs(rock), 0]} r={[rock, 0, rock]}>
      <mesh castShadow><cylinderGeometry args={[0.29, 0.31, 0.04, 48]} /><meshPhysicalMaterial color="#7a3e1e" roughness={0.3} clearcoat={1} /></mesh>
      <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.05, 24, 12]} /><meshPhysicalMaterial color="#7a3e1e" roughness={0.3} clearcoat={1} /></mesh>
    </G>
    {k > 0.1 && <Steam3 tt={tt} p={[0.2, 0.42, 0]} n={4} spread={0.15} a={0.6} />}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.0} x={1440} y={150} txt={`LOW OVEN · ${Math.min(6, Math.floor(ez(tt, 0.8, 5.0) * 6 + 0.001))} HRS`} col="#e4572e" />} />;

// d05 · el pimiento: tiras rojas caen sobre la salsa blanca del pollo a la king y le dan el dulce
export const RPimiento: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 0.95], l: [0, 0.08, 0], fov: 34 }} cam2={{ p: [0.05, 0.85, 0.82], l: [0, 0.08, 0], fov: 32 }} f={(tt) => <>
  <Plate rad={0.55} photo="ld_n10a" />
  {[...Array(6)].map((_, i) => { const a = 0.9 + i * 0.3, k = ez(tt, a, a + 0.45); const ang = rnd(i, 1) * 6.28, r = 0.25 * Math.sqrt(rnd(i, 2)); return tt > a ? <G key={i} p={[Math.cos(ang) * r, 0.08 + 0.6 * (1 - k) * (1 - k), Math.sin(ang) * r]} r={[0, rnd(i, 3) * 3, 0.1 * (1 - k)]}><mesh castShadow><boxGeometry args={[0.14, 0.012, 0.03]} /><meshPhysicalMaterial color="#d42a1e" roughness={0.2} clearcoat={1} /></mesh></G> : null; })}
</>} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={150} txt="PIMIENTO = SWEET" col="#d42a1e" />} />;

// d06 · el truco de arriba: el palote aplasta las papitas y las migas doradas cubren la cazuela
export const RChipCrush: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 1.15], l: [0, 0.12, 0], fov: 34 }} cam2={{ p: [0.05, 0.92, 1.02], l: [0, 0.12, 0], fov: 32 }} f={(tt) => {
  const roll = ez(tt, 0.7, 2.2), fall = ez(tt, 2.4, 4.2);
  return <>
    <mesh position={[0, 0.06, 0.05]} castShadow receiveShadow><boxGeometry args={[1.0, 0.12, 0.66]} /><meshPhysicalMaterial color="#f2ede2" roughness={0.25} clearcoat={1} /></mesh>
    <FoodMesh tex="dough" c="#f4e3b8" cc={0.6} p={[0, 0.121, 0.05]}><boxGeometry args={[0.92, 0.004, 0.58]} /></FoodMesh>
    {[...Array(90)].map((_, i) => { const k = ez(tt, 2.4 + i * 0.02, 2.8 + i * 0.02); return k > 0.01 ? <mesh key={i} position={[0.85 * (rnd(i, 1) - 0.5), 0.13 + 0.45 * (1 - k), 0.05 + 0.5 * (rnd(i, 2) - 0.5)]} rotation={[rnd(i, 3) * 3, rnd(i, 4) * 3, 0]}><boxGeometry args={[0.03, 0.006, 0.025]} /><Std c={i % 3 ? "#e9b44c" : "#d79a34"} r={0.4} cc={0.6} /></mesh> : null; })}
    {fall < 0.95 && <G p={[0, 0.42, -0.05]} s={1 - 0.9 * fall}>
      {[...Array(14)].map((_, i) => <mesh key={i} position={[0.4 * (rnd(i, 1) - 0.5), 0.01 + 0.012 * (i % 3), 0.2 * (rnd(i, 2) - 0.5)]} rotation={[0, rnd(i, 3) * 3, 0]} scale={[1, 1 - 0.85 * roll, 1]}><cylinderGeometry args={[0.055, 0.055, 0.008, 18]} /><Std c="#e9b44c" r={0.35} cc={0.7} /></mesh>)}
      <G p={[-0.3 + 0.6 * roll, 0.07 - 0.03 * roll, 0]} r={[Math.PI / 2, 0, 0]}><mesh material={wood} castShadow><cylinderGeometry args={[0.05, 0.05, 0.6, 24]} /></mesh></G>
    </G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1440} y={150} txt="CHIPS + BUTTER" col="#e9b44c" />} />;

// d07 · la ensalada mojada: en la hoja con gotas el aderezo resbala; en la hoja seca se queda
const Leaf: React.FC<{ p: V3 }> = ({ p }) => <G p={p} s={1.5}><mesh rotation-x={-Math.PI / 2} scale={[1, 1.45, 1]} castShadow><circleGeometry args={[0.24, 48]} /><meshPhysicalMaterial color="#7cbf4a" roughness={0.35} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[0.66, 0.012]} /><Std c="#d9efb8" /></mesh></G>;
export const RDressingSlide: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 1.15], l: [0, 0.05, 0], fov: 34 }} cam2={{ p: [0.05, 1.1, 1.0], l: [0, 0.05, 0], fov: 32 }} f={(tt) => {
  const d = drop(tt, 1.0, 0.7), slide = ez(tt, 1.8, 3.4);
  return <>
    <Leaf p={[-0.4, 0.01, 0]} />
    <Leaf p={[0.4, 0.01, 0]} />
    {[...Array(14)].map((_, i) => <mesh key={i} position={[-0.4 + 0.22 * (rnd(i, 1) - 0.5) * 2, 0.02, 0.4 * (rnd(i, 2) - 0.5) * 2]} scale={[1, 0.5, 1]}><sphereGeometry args={[0.024, 12, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={0.7} transparent opacity={0.75} clearcoat={1} /></mesh>)}
    {d.on && <>
      <G p={[-0.4, 0.03 + d.y, 0.3 * slide]} s={[1 + 0.4 * slide, 0.4, 1 - 0.3 * slide]}><mesh><sphereGeometry args={[0.07, 24, 12]} /><meshPhysicalMaterial color="#f0a24a" roughness={0.15} clearcoat={1} /></mesh></G>
      <G p={[0.4, 0.03 + d.y, 0]} s={[1 + 0.5 * slide, 0.35, 1 + 0.5 * slide]}><mesh><sphereGeometry args={[0.07, 24, 12]} /><meshPhysicalMaterial color="#f0a24a" roughness={0.15} clearcoat={1} /></mesh></G>
    </>}
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.6} x={600} y={150} txt="WET" col="#5a8fd0" /><Cap tt={tt} at={0.9} x={1320} y={150} txt="DRY" col="#3fae5b" /></>} />;

// d08 · el sándwich de queso: la campana baja sobre la plancha; al subir, el queso ya chorrea por los costados
export const RLidMelt: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0, 1.0, 1.45], l: [0, 0.15, 0], fov: 34 }} cam2={{ p: [0.05, 0.92, 1.25], l: [0, 0.16, 0], fov: 32 }} f={(tt) => {
  const dn = ez(tt, 0.7, 1.4), up = ez(tt, 3.4, 4.2), lid = dn * (1 - up), melt = ez(tt, 1.6, 3.4);
  return <>
    <FoodMesh tex="crust" c={col("#f2d9a0", "#d9a050", melt)} cc={0.3} p={[0, 0.025, 0]}><boxGeometry args={[0.5, 0.04, 0.5]} /></FoodMesh>
    <mesh position={[0, 0.055, 0]} scale={[1 + 0.12 * melt, 1, 1 + 0.12 * melt]}><boxGeometry args={[0.48, 0.018, 0.48]} /><meshPhysicalMaterial color="#f5b82e" roughness={0.25} clearcoat={0.8} /></mesh>
    {[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI * 2; return <mesh key={i} position={[0.27 * Math.cos(a), 0.05 - 0.02 * melt, 0.27 * Math.sin(a)]} scale={[1, 0.6 + 1.6 * melt, 1]}><sphereGeometry args={[0.03, 16, 10]} /><meshPhysicalMaterial color="#f5b82e" roughness={0.25} clearcoat={0.8} /></mesh>; })}
    <FoodMesh tex="crust" c={col("#f2d9a0", "#d9a050", melt)} cc={0.3} p={[0, 0.085, 0]}><boxGeometry args={[0.5, 0.04, 0.5]} /></FoodMesh>
    <G p={[0, 0.02 + 0.32 * (1 - lid), -0.05 - 0.45 * up]}>
      <mesh material={steel} castShadow><sphereGeometry args={[0.42, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh position={[0, 0.44, 0]} material={steel}><cylinderGeometry args={[0.04, 0.05, 0.06, 24]} /></mesh>
    </G>
    {up > 0.2 && <Steam3 tt={tt} p={[0, 0.15, 0]} n={6} spread={0.3} />}
  </>;
}} over={(tt) => <Cap tt={tt} at={0.9} x={1440} y={150} txt="LOW & SLOW · A LID" col="#f5b82e" />} />;

// d09 · error uno, pan frío: la tostadora cromada salta y suben dos tostadas doradas
export const RToaster: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.75, 1.25], l: [0, 0.38, 0], fov: 34 }} cam2={{ p: [0.05, 0.72, 1.12], l: [0, 0.4, 0], fov: 32 }} f={(tt) => {
  const pop = k0(tt, 2.4, 9, 0.45), lever = 1 - ez(tt, 2.3, 2.45);
  return <>
    <mesh position={[0, 0.25, 0]} material={chrome} castShadow><boxGeometry args={[0.62, 0.42, 0.36]} /></mesh>
    {[0.25, -0.25].map((z) => <mesh key={z} position={[0, 0.25, z * 0.73]} rotation-x={Math.PI / 2} material={chrome}><cylinderGeometry args={[0.21, 0.21, 0.005, 4, 1, false, Math.PI / 4]} /></mesh>)}
    {[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.461, 0]}><boxGeometry args={[0.07, 0.004, 0.3]} /><Std c="#141414" /></mesh>)}
    {[-0.12, 0.12].map((x, i) => <FoodMesh key={x} tex="crust" c="#ffffff" cc={0.2} p={[x, 0.33 + 0.12 * pop + 0.02 * i, 0]} r={[0, Math.PI / 2, 0]}><boxGeometry args={[0.26, 0.26, 0.06]} /></FoodMesh>)}
    <mesh position={[0.33, 0.18 + 0.18 * lever, 0]} castShadow><boxGeometry args={[0.06, 0.04, 0.1]} /><Std c="#1a1a1a" r={0.4} cc={1} /></mesh>
    <mesh position={[0, 0.03, 0]} castShadow><boxGeometry args={[0.66, 0.04, 0.4]} /><Std c="#1a1a1a" r={0.4} cc={1} /></mesh>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.6} x={460} y={930} txt="WARM THE BREAD" col="#e4b23a" />} />;

// d10 · error dos: la feta de queso cae sobre la carne CALIENTE y se derrite por los bordes
export const RCheeseDrape: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0, 0.7, 0.85], l: [0, 0.08, 0], fov: 34 }} cam2={{ p: [0.05, 0.65, 0.75], l: [0, 0.08, 0], fov: 32 }} f={(tt) => {
  const d = drop(tt, 0.8, 0.7), melt = ez(tt, 1.5, 3.8);
  return <>
    <FoodMesh tex="cooked" c="#ffffff" cc={0.6} r0={0.4} p={[0, 0.045, 0]}><cylinderGeometry args={[0.26, 0.26, 0.08, 48]} /></FoodMesh>
    {d.on && <G p={[0, 0.095 + d.y, 0]} r={[0, 0.4, 0]}>
      <mesh scale={[1, 1, 1]}><boxGeometry args={[0.4 - 0.05 * melt, 0.012, 0.4 - 0.05 * melt]} /><meshPhysicalMaterial color="#f5b82e" roughness={0.25 - 0.15 * melt} clearcoat={0.6 + 0.4 * melt} /></mesh>
      {[0, 1, 2, 3].map((i) => { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; return <mesh key={i} position={[0.2 * Math.cos(a), -0.04 * melt, 0.2 * Math.sin(a)]} rotation={[Math.sin(a) * 1.2 * melt, 0, -Math.cos(a) * 1.2 * melt]}><boxGeometry args={[0.1, 0.012, 0.1]} /><meshPhysicalMaterial color="#f5b82e" roughness={0.15} clearcoat={1} /></mesh>; })}
    </G>}
    <Steam3 tt={tt} p={[0, 0.12, 0]} n={6} spread={0.3} a={0.8} />
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1440} y={150} txt="ON THE HOT MEAT" col="#f5b82e" />} />;

// d11 · error tres: la canasta de papas entra al aceite, sale, descansa y entra OTRA vez; recién ahí doradas
export const RTwiceFried: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0, 1.15, 1.6], l: [0, 0.2, 0], fov: 34 }} cam2={{ p: [0.05, 1.05, 1.4], l: [0, 0.22, 0], fov: 32 }} f={(tt) => {
  const d1 = Math.sin(Math.PI * ez(tt, 0.6, 2.2)), d2 = Math.sin(Math.PI * ez(tt, 3.0, 4.8)), dn = Math.max(d1, d2), gold = 0.35 * ez(tt, 0.8, 2.0) + 0.65 * ez(tt, 3.2, 4.6);
  return <>
    {([[0, 0.17, 0.28, 0.9, 0.04], [0, 0.17, -0.28, 0.9, 0.04], [0.43, 0.17, 0, 0.04, 0.6], [-0.43, 0.17, 0, 0.04, 0.6]] as number[][]).map(([x, y, z, w, d], i) => <mesh key={i} position={[x, y, z]} material={steel} castShadow><boxGeometry args={[w, 0.34, d]} /></mesh>)}
    <mesh position={[0, 0.01, 0]} material={steel}><boxGeometry args={[0.9, 0.02, 0.6]} /></mesh>
    <mesh position={[0, 0.27, 0]}><boxGeometry args={[0.82, 0.004, 0.52]} /><meshPhysicalMaterial color="#d9a234" roughness={0.05} clearcoat={1} transparent opacity={0.55} depthWrite={false} /></mesh>
    <G p={[0, 0.62 - 0.32 * dn, 0]}>
      {[[-0.2, 0], [0.2, 0], [0, -0.14], [0, 0.14]].map(([x, z], i) => <mesh key={i} position={[x, 0, z]} rotation={i < 2 ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]} material={chrome}><cylinderGeometry args={[0.006, 0.006, i < 2 ? 0.28 : 0.4, 6]} /></mesh>)}
      <mesh position={[0, -0.06, 0]} material={chrome}><boxGeometry args={[0.4, 0.006, 0.28]} /></mesh>
      {[...Array(22)].map((_, i) => <mesh key={i} position={[0.32 * (rnd(i, 1) - 0.5), -0.03 + 0.04 * rnd(i, 2), 0.2 * (rnd(i, 3) - 0.5)]} rotation={[0, rnd(i, 4) * 3, Math.PI / 2 * rnd(i, 5)]} castShadow><boxGeometry args={[0.025, 0.025, 0.16]} /><Std c={col("#f6e7b6", "#d9922a", gold)} r={0.45} cc={0.5} /></mesh>)}
    </G>
    {dn > 0.6 && [...Array(14)].map((_, i) => { const ph = (tt * 2 + i / 14) % 1; return <mesh key={i} position={[0.36 * (rnd(i, 1) - 0.5), 0.275 + ph * 0.05, 0.24 * (rnd(i, 2) - 0.5)]}><sphereGeometry args={[0.012, 8, 6]} /><meshBasicMaterial color="#fff1c9" transparent opacity={0.7 * (1 - ph)} /></mesh>; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={0.8} x={1440} y={150} txt={tt < 2.8 ? "FRY ONCE…" : "…AND AGAIN"} col="#d9922a" />} />;

// d12 · error cuatro: la salsa se reduce: el nivel baja de la marca de arriba a la del medio y se espesa
export const RCookDown: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.25, 1.6], l: [0, 0.25, 0], fov: 34 }} cam2={{ p: [0.05, 1.15, 1.4], l: [0, 0.27, 0], fov: 32 }} f={(tt) => {
  const k = ez(tt, 0.8, 4.6);
  return <>
    <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.42, 0.4, 0.44, 64, 1, true]} /><meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.22} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.005, 0]} material={steel}><cylinderGeometry args={[0.4, 0.4, 0.01, 64]} /></mesh>
    <mesh position={[0, 0.39 - 0.17 * k, 0]}><cylinderGeometry args={[0.41, 0.41, 0.01, 64]} /><meshPhysicalMaterial color={col("#c2452a", "#7a1e10", k)} roughness={0.25} clearcoat={1} /></mesh>
    {[...Array(10)].map((_, i) => { const ph = (tt * 1.2 + i / 10) % 1, a = rnd(i, 1) * 6.28; return <mesh key={i} position={[0.3 * Math.cos(a) * rnd(i, 2), 0.39 - 0.17 * k + 0.01, 0.3 * Math.sin(a) * rnd(i, 2)]} scale={Math.sin(ph * Math.PI)}><sphereGeometry args={[0.025, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color={col("#c2452a", "#7a1e10", k)} roughness={0.2} clearcoat={1} /></mesh>; })}
    <Steam3 tt={tt} p={[0, 0.45, 0]} n={8} spread={0.4} />
  </>;
}} over={(tt) => <Cap tt={tt} at={1.0} x={1440} y={150} txt="COOK IT DOWN" col="#c2452a" />} />;

// d13 · el remojo: los bastones de papa en el bol de vidrio y el agua que se pone turbia (almidón afuera)
export const RSoakStarch: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.9, 1.5], l: [0, 0.22, 0], fov: 34 }} cam2={{ p: [0.05, 0.85, 1.3], l: [0, 0.24, 0], fov: 32 }} f={(tt) => {
  const cl = ez(tt, 1.2, 4.6);
  return <>
    <G s={1.4}><mesh geometry={BOWL} material={glass} /></G>
    {[...Array(18)].map((_, i) => <mesh key={i} position={[0.36 * (rnd(i, 1) - 0.5), 0.1 + 0.1 * rnd(i, 2), 0.36 * (rnd(i, 3) - 0.5)]} rotation={[rnd(i, 4) * 0.5, rnd(i, 5) * 3, Math.PI / 2]} castShadow><boxGeometry args={[0.035, 0.035, 0.3]} /><Std c="#f6ebc4" r={0.5} /></mesh>)}
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.56, 0.36, 0.26, 64]} /><meshPhysicalMaterial color={col("#bfe0f2", "#f2f0ea", cl)} roughness={0.1} transparent opacity={0.16 + 0.22 * cl} depthWrite={false} /></mesh>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={110} txt="SOAK = STARCH OUT" col="#9fb7c9" />} />;

// d14 · el truco del pan: el cuchillo unta mayonesa por AFUERA del centeno, hasta los bordes
const RYE = (g: CanvasRenderingContext2D, w: number, hh: number) => { g.fillStyle = "#b07a4a"; g.fillRect(0, 0, w, hh); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${70 + 40 * rnd(i, 1)},${40 + 20 * rnd(i, 1)},20,.5)`; g.beginPath(); g.ellipse(rnd(i, 2) * w, rnd(i, 3) * hh, 3, 2, rnd(i, 4) * 3, 0, 6.3); g.fill(); } g.strokeStyle = "#5a3418"; g.lineWidth = 24; g.strokeRect(0, 0, w, hh); };
export const RMayoEdge: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={TOP} cam2={TOP2} f={(tt) => {
  const k = ez(tt, 0.8, 3.8);
  return <>
    <mesh position={[0, 0.03, 0]} castShadow><boxGeometry args={[0.7, 0.05, 0.7]} /><TexMat id="rye" w={512} h={512} draw={RYE} r0={0.85} /></mesh>
    <mesh position={[0, 0.057, 0.33 - 0.33 * k]} scale={[1, 1, Math.max(0.01, k)]}><boxGeometry args={[0.64, 0.004, 0.66]} /><meshPhysicalMaterial color="#fbf6e6" roughness={0.3} clearcoat={0.7} /></mesh>
    <G p={[0.1 * Math.sin(tt * 5), 0.09, 0.33 - 0.66 * k]} r={[0, Math.PI / 2, 0.25]}><Tool kind="knife" s={1.3} /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.2} x={1340} y={150} txt="MAYO TO THE EDGE" col="#fbf6e6" />} />;

// d15 · siempre de esquina a esquina: el cuchillo cruza la diagonal y las dos mitades se abren
const triShape = (a: [number, number][]) => { const sh = new THREE.Shape(); sh.moveTo(a[0][0], a[0][1]); a.slice(1).forEach(([x, y]) => sh.lineTo(x, y)); sh.closePath(); return new THREE.ExtrudeGeometry(sh, { depth: 0.11, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 }); };
const TRI_A = triShape([[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3]]), TRI_B = triShape([[0.3, 0.3], [-0.3, 0.3], [0.3, -0.3]]);
const rye = new THREE.MeshPhysicalMaterial({ color: "#a8703f", roughness: 0.8, clearcoat: 0.1 });
export const RCornerCut: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={TOP} cam2={TOP2} f={(tt) => {
  const cut = ez(tt, 0.8, 2.2), open = k0(tt, 2.5, 7, 0.55), o = 0.07 * open;
  return <>
    <Plate rad={0.62} />
    {[[TRI_A, -1], [TRI_B, 1]].map(([g, s], i) => <G key={i} p={[(s as number) * o, 0.025, -(s as number) * o]}>
      <mesh geometry={g as THREE.ExtrudeGeometry} material={rye} rotation-x={-Math.PI / 2} castShadow />
      <mesh geometry={g as THREE.ExtrudeGeometry} rotation-x={-Math.PI / 2} position={[0, 0.06, 0]} scale={[0.97, 0.97, 0.12]}><meshPhysicalMaterial color="#f5b82e" roughness={0.2} clearcoat={0.8} /></mesh>
    </G>)}
    <G p={[lerp(-0.42, 0.42, cut), 0.15 - 0.05 * Math.sin(Math.PI * cut), lerp(0.42, -0.42, cut)]} r={[0, -Math.PI / 4, Math.PI / 2]}><Tool kind="knife" s={1.4} /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.0} x={500} y={150} txt="CORNER TO CORNER" col="#e4b23a" />} />;

// d16 · las especias de Frank: la lata de café se llena de capas (chile, comino, pimentón, ajo) cada lunes
const LAYERS = ["#a8261a", "#8a5a26", "#d24a1e", "#e9d6a6", "#5a2a14"];
export const RSpiceCan: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.8, 1.3], l: [0, 0.34, 0], fov: 34 }} cam2={{ p: [0.05, 0.78, 1.15], l: [0, 0.36, 0], fov: 32 }} f={(tt) => <>
  <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.245, 0.245, 0.66, 64, 1, true]} /><meshPhysicalMaterial color="#eef6f4" roughness={0.04} transparent opacity={0.22} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.25, 0.25, 0.1, 64, 1, true, -0.6, 1.2]} /><TexMat id="can2" w={512} h={170} m={0.6} r0={0.35} draw={(g, w, hh) => { g.fillStyle = "#c8261e"; g.fillRect(0, 0, w, hh); g.fillStyle = "#f2e6c4"; g.fillRect(0, hh * 0.18, w, hh * 0.64); g.fillStyle = "#1d2440"; g.font = `900 ${Math.round(hh * 0.4)}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MONDAY MIX", w / 2, hh * 0.5); }} /></mesh>
  <mesh position={[0, 0.665, 0]} rotation-x={Math.PI / 2} material={chrome}><torusGeometry args={[0.245, 0.012, 8, 64]} /></mesh>
  <mesh position={[0, 0.005, 0]} material={steel}><cylinderGeometry args={[0.24, 0.24, 0.01, 64]} /></mesh>
  {LAYERS.map((c, i) => { const k = ez(tt, 0.6 + i * 0.75, 1.2 + i * 0.75); return k > 0.01 ? <mesh key={i} position={[0, 0.01 + i * 0.09 + 0.045 * k, 0]} scale={[1, k, 1]}><cylinderGeometry args={[0.235, 0.235, 0.09, 64]} /><Std c={c} r={0.9} /></mesh> : null; })}
  {LAYERS.map((c, i) => { const a = 0.6 + i * 0.75; return tt > a - 0.1 && tt < a + 0.6 ? <Pour key={"p" + i} x={0.02} z={0} y0={1.1} y1={0.1 + i * 0.09} c={c} w={0.018} /> : null; })}
</>} over={(tt) => <Cap tt={tt} at={1.0} x={1440} y={150} txt="NO BOTTLED SAUCE" col="#c8261e" />} />;

// d17 · las galletitas de agua no se cobran: la caja vuelca y vuelca sobre el chili y el cartel dice FREE
export const RCrackers: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 1.45], l: [0, 0.15, 0], fov: 34 }} cam2={{ p: [0.05, 1.05, 1.25], l: [0, 0.16, 0], fov: 32 }} f={(tt) => {
  const tip = ez(tt, 0.6, 1.2);
  return <>
    <Bowl s={1.25} />
    <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.5, 0.3, 0.02, 64]} /><Std c="#8e2a14" r={0.4} cc={0.8} /></mesh>
    {[...Array(70)].map((_, i) => { const a = 1.0 + i * 0.05, k = ez(tt, a, a + 0.5); const ang = rnd(i, 1) * 6.28, r = 0.4 * Math.sqrt(rnd(i, 2)); return tt > a ? <G key={i} p={[lerp(0.3, Math.cos(ang) * r, k), lerp(0.5, 0.3 + 0.03 * Math.floor(i / 25), k), lerp(0, Math.sin(ang) * r, k)]} r={[rnd(i, 3) * 3, rnd(i, 4) * 3, 0]}><mesh castShadow><cylinderGeometry args={[0.03, 0.03, 0.016, 6]} /><Std c="#f2dca6" r={0.7} /></mesh></G> : null; })}
    <G p={[0.4, 0.5, 0]} r={[0, 0, 2.0 * tip]} s={0.8}><mesh castShadow><boxGeometry args={[0.2, 0.3, 0.12]} /><TexMat id="crbox" w={256} h={256} draw={(g, w) => { g.fillStyle = "#1d3f9e"; g.fillRect(0, 0, w, w); g.fillStyle = "#f6f1e4"; g.font = `900 36px ${FONT}`; g.textAlign = "center"; g.fillText("OYSTER", w / 2, w * 0.45); g.fillText("CRACKERS", w / 2, w * 0.65); }} /></mesh></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={620} y={150} txt="EXTRA CRACKERS: FREE" col="#3fae5b" />} />;

export const R3X: Record<string, React.FC<P>> = {
  paprika: RPaprika, lean85: RLean85, dayTwo: RDayTwo, tunaChunks: RTunaChunks, beanCrock: RBeanCrock, pimiento: RPimiento,
  chipCrush: RChipCrush, dressingSlide: RDressingSlide, lidMelt: RLidMelt, toaster: RToaster, cheeseDrape: RCheeseDrape, twiceFried: RTwiceFried,
  cookDown: RCookDown, soakStarch: RSoakStarch, mayoEdge: RMayoEdge, cornerCut: RCornerCut, spiceCan: RSpiceCan, crackers: RCrackers,
};
