// lhh29d · componentes únicos 1-9 (kit h3d + saltkit): quince montoncitos, la iglesia Zion y sus 60 años, las cuatro tartas que rebalsan,
// el jarabe que se hace vidrio negro, el cuarto de pulgada de sal, la costra que sale entera, la Pascua del 88, la sal que chupa el jugo y el agua fría.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Grains, SaltBox, SaltPile, Stream, lg, saltMat, card } from "./saltkit";

const PI = Math.PI;
type V = [number, number, number];

// tarta de cereza con enrejado (local: sólo la usan estos héroes)
const CherryPie: React.FC<{ p?: number[]; s?: number; boil?: number; tt?: number }> = ({ p = [0, 0, 0], s = 1, boil = 0, tt = 0 }) =>
  <group position={p as V} scale={s}>
    <mesh geometry={lg("piedish", [[0, 0], [0.09, 0], [0.12, 0.035], [0.135, 0.038], [0.136, 0.034]], 48)} castShadow>{M.glass({ col: "#e8f3ff", op: 0.5 })}</mesh>
    <mesh position={[0, 0.031 + 0.004 * boil * Math.sin(tt * 9), 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.113, 48]} /><meshPhysicalMaterial color="#9c1424" roughness={0.25} clearcoat={0.9} /></mesh>
    {[-1, 1].map((k) => [-0.06, -0.02, 0.02, 0.06].map((o, i) => <RBox key={k + "" + i} s={k > 0 ? [0.22 - Math.abs(o) * 1.4, 0.006, 0.016] : [0.016, 0.006, 0.22 - Math.abs(o) * 1.4]}
      p={k > 0 ? [0, 0.036, o] : [o, 0.037, 0]} r={0.003}><meshStandardMaterial color="#e2b46e" roughness={0.7} /></RBox>))}
    {Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.118, 0.037, Math.sin(a) * 0.118]} scale={[0.8, 0.55, 1.1]} rotation={[0, -a, 0]}>
      <sphereGeometry args={[0.014, 10, 8]} /><meshStandardMaterial color="#d9a35c" roughness={0.7} /></mesh>; })}
  </group>;
// interior del horno: paredes esmaltadas oscuras, piso y una rejilla
const OvenBox: React.FC<{ glow?: number; rack?: number }> = ({ glow = 0, rack = 0.22 }) => <>
  <RBox s={[0.9, 0.012, 0.6]} p={[0, -0.006, 0]} r={0.004}><meshStandardMaterial color="#1b1c20" roughness={0.45} metalness={0.3} /></RBox>
  <RBox s={[0.9, 0.55, 0.012]} p={[0, 0.27, -0.3]} r={0.004}><meshStandardMaterial color="#202227" roughness={0.5} metalness={0.3} /></RBox>
  {[-1, 1].map((k) => <RBox key={k} s={[0.012, 0.55, 0.6]} p={[k * 0.45, 0.27, 0]} r={0.004}><meshStandardMaterial color="#1d1f23" roughness={0.5} metalness={0.3} /></RBox>)}
  {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.4 + i * 0.1, rack, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.56, 8]} />{M.chrome({})}</mesh>)}
  <mesh position={[0, 0.02, 0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.012]} /><meshStandardMaterial color="#331008" emissive="#ff4a14" emissiveIntensity={0.6 + glow * 1.6} /></mesh>
  <pointLight position={[0, 0.12, 0.1]} color="#ff7a3a" intensity={1.2 + glow * 2} distance={0.9} />
</>;

// ---- 0:26 · UNA CAJA, QUINCE TRABAJOS: la caja azul se inclina y siembra quince montoncitos en la pizarra; cada uno se enciende al nacer ----
export const HGrains15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0.05, 0.03, 0.02], az: [-0.5, -0.2], el: [0.62, 0.52], r: [0.92, 0.78], fov: 32 }}
  over={(tt) => { const n = Math.min(15, Math.max(0, Math.floor((tt - 1.2) / 0.3) + 1));
    return <><Head tt={tt} kick="" title="ONE BOX · 15 JOBS" col={AMB} /><Tag tt={tt} at={1.2} x={1450} y={830} txt={`${n} OF 15`} col={AMB} size={46} /></>; }}>{(tt) => {
  const i = Math.min(14, Math.max(0, Math.floor((tt - 1.2) / 0.3))), x = -0.14 + (i % 5) * 0.075, z = -0.08 + Math.floor(i / 5) * 0.08, pour = tt > 1.0 && tt < 5.8 ? 1 : 0;
  const bx = lerp(-0.28, x + 0.03, eio(tt, 0.4, 1.2)), bz = lerp(0.1, z, eio(tt, 0.4, 1.2));
  return <>
    <RBox s={[0.5, 0.01, 0.32]} p={[0.01, 0.005, 0]} r={0.004}><meshStandardMaterial color="#26292b" roughness={0.9} /></RBox>
    {Array.from({ length: 15 }, (_, k) => { const a = cl((tt - 1.2 - k * 0.3) / 0.35); if (a <= 0) return null; const px = -0.14 + (k % 5) * 0.075, pz = -0.08 + Math.floor(k / 5) * 0.08;
      return <group key={k}><SaltPile r={0.026} h={0.016 * a} p={[px, 0.01, pz]} />
        <mesh position={[px, 0.011, pz]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.033, 40]} />{M.glow({ col: k === 14 ? "#ffffff" : "#ffcf4a", op: 0.8 * a })}</mesh></group>; })}
    <SaltBox p={[bx, 0.16, bz]} rot={[0, 0, 1.9 * eio(tt, 0.5, 1.0)]} s={0.8} spout={1} />
    <Stream tt={tt} p={[bx + 0.02, 0.14, bz]} y1={0.02} on={pour} n={18} />
  </>;
}}</Scene3D>;

// ---- 0:41 · SESENTA AÑOS EN ZION: la iglesita blanca de campo sobre la mesa; el contador rueda de 00 a 60 y la ventana se enciende ----
export const HZion60: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.3, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [0.55, 0.25], el: [0.28, 0.2], r: [0.9, 0.76], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="60 YEARS AT ZION" col={AMB} /><Tag tt={tt} at={1.2} x={1450} y={240} txt="AMES, IOWA" col={ICE} size={42} /></>}>{(tt) => {
  const v = 60 * eio(tt, 0.8, 4.2), win = eio(tt, 3.6, 4.6), grow = phys(tt, 0.1, 6, 0.5);
  const white = M.porcelain({ col: "#bdb6a8" });
  return <>
    <group scale={cl(grow)} position={[-0.12, 0, 0]}>
      <RBox s={[0.22, 0.12, 0.14]} p={[0, 0.06, 0]} r={0.004}>{white}</RBox>
      {[-1, 1].map((k) => <mesh key={k} position={[0, 0.15, k * 0.038]} rotation={[k * 0.88, 0, 0]}><boxGeometry args={[0.24, 0.004, 0.11]} /><meshStandardMaterial color="#5a3a2a" roughness={0.8} /></mesh>)}
      <RBox s={[0.05, 0.12, 0.05]} p={[0.08, 0.2, 0]} r={0.003}>{white}</RBox>
      <mesh position={[0.08, 0.3, 0]}><coneGeometry args={[0.038, 0.09, 4]} /><meshStandardMaterial color="#5a3a2a" roughness={0.8} /></mesh>
      <mesh position={[0.08, 0.36, 0]}><boxGeometry args={[0.003, 0.03, 0.003]} />{M.brass({})}</mesh><mesh position={[0.08, 0.365, 0]}><boxGeometry args={[0.016, 0.003, 0.003]} />{M.brass({})}</mesh>
      {[-0.06, -0.02, 0.02].map((x, i) => <mesh key={i} position={[x, 0.07, 0.071]}><planeGeometry args={[0.022, 0.04]} /><meshStandardMaterial color="#2a2018" emissive="#ffb84a" emissiveIntensity={win * 0.3} /></mesh>)}
      <pointLight position={[-0.02, 0.07, 0.12]} color="#ffb84a" intensity={0.45 * win} distance={0.4} />
    </group>
    <group position={[0.15, 0.07, 0.15]} rotation={[0, -0.45, 0]} scale={1.6}>
      <RBox s={[0.1, 0.08, 0.06]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(v / 10) + (v % 10 > 9.5 ? (v % 10) - 9.5 : 0) * 2} p={[-0.02, 0, 0.03]} r={0.025} w={0.03} />
      <DigitDrum v={v % 10} p={[0.02, 0, 0.03]} r={0.025} w={0.03} />
    </group>
  </>;
}}</Scene3D>;

// ---- 1:58 · CUATRO TARTAS QUE REBALSAN: corte del horno con cuatro tartas en la rejilla; el jarabe rojo hierve, cae en hilos y hace charco ----
export const HFourPies: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [0, 0.16, 0], az: [-0.12, 0.1], el: [0.32, 0.24], r: [1.05, 0.9], fov: 32 }}
  over={(tt) => <><Head tt={tt} kick="" title="ALL FOUR BUBBLED OVER" col={RED} /><Tag tt={tt} at={1.0} x={1450} y={840} txt="BAKE SALE · 1971" col={AMB} size={42} /></>}>{(tt) => {
  const boil = eio(tt, 0.6, 2.0), drip = cl((tt - 2.0) / 3.5);
  return <>
    <OvenBox glow={boil} rack={0.22} />
    {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <group key={i}>
      <CherryPie p={[x, 0.224, 0]} s={0.7} boil={boil} tt={tt + i} />
      {Array.from({ length: 3 }, (_, k) => { const u = ((tt - 2 - i * 0.2 - k * 0.37) * 0.9) % 1; if (tt < 2 + i * 0.2 + k * 0.37) return null;
        return <mesh key={k} position={[x + 0.09 * (k - 1) * 0.6, 0.2 - u * 0.19, 0.06 * (k - 1)]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.006, 10, 8]} /><meshPhysicalMaterial color="#8e0f1e" roughness={0.2} clearcoat={1} /></mesh>; })}
      <mesh position={[x, 0.001, 0]} rotation={[-PI / 2, 0, 0]} scale={[1, 0.7, 1]}><circleGeometry args={[0.02 + 0.06 * drip, 32]} /><meshPhysicalMaterial color="#7a0c18" roughness={0.15} clearcoat={1} /></mesh>
    </group>)}
  </>;
}}</Scene3D>;

// ---- 2:11 · SE HACE VIDRIO NEGRO: el charco rojo se oscurece, se vuelve negro brillante y se raja; el rascador choca y rebota ----
export const HBlackGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.01, 0], az: [0.3, 0.15], el: [0.75, 0.62], r: [0.55, 0.44], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="IT TURNS TO BLACK GLASS" col={RED} /><Tag tt={tt} at={2.4} x={1450} y={840} txt="AN HOUR ON YOUR KNEES" col={AMB} size={40} /></>}>{(tt, u) => {
  const b = eio(u, 0.06, 0.45), sc = eio(u, 0.6, 0.76), bump = u > 0.76 ? Math.abs(Math.sin((u - 0.76) * 70)) * 0.014 * Math.max(0, 1 - (u - 0.76) * 4) : 0;
  const c = new THREE.Color("#8e0f1e").lerp(new THREE.Color("#0a0606"), b);
  return <>
    <RBox s={[0.8, 0.012, 0.6]} p={[0, -0.006, 0]} r={0.004}><meshStandardMaterial color="#25262b" roughness={0.45} metalness={0.3} /></RBox>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.2, 0.85, 1]}><circleGeometry args={[0.13, 64]} /><meshPhysicalMaterial color={c} roughness={0.05 + 0.2 * (1 - b)} clearcoat={1} metalness={0.2} /></mesh>
    {b > 0.6 && Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.0035, 0]} rotation={[-PI / 2, 0, rn(i, 2) * 6.28]}><planeGeometry args={[0.24 * cl((b - 0.6) * 3), 0.0016]} /><meshBasicMaterial color="#6a5a50" /></mesh>)}
    <group position={[lerp(0.45, 0.04, sc) + bump, 0.012, 0.02]} rotation={[0, 0.2, 0.25]}>
      <RBox s={[0.06, 0.003, 0.08]} r={0.001}>{M.steel({})}</RBox>
      <RBox s={[0.16, 0.022, 0.03]} p={[0.11, 0.006, 0]} r={0.008}>{M.wood({ base: [150, 100, 60] })}</RBox>
    </group>
  </>;
}}</Scene3D>;

// ---- 2:18 · UN CUARTO DE PULGADA: el chorro de sal tapa el charco caliente; al lado la regla de costura marca 1/4 y se enciende ----
export const HQuarterInch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark"
  cam={{ at: [0, 0.02, 0], az: [-0.95, -0.8], el: [0.14, 0.12], r: [0.5, 0.42], fov: 28 }}
  over={(tt) => <><Head tt={tt} kick="" title="A QUARTER INCH DEEP" col={AMB} /><Tag tt={tt} at={3.0} x={1450} y={840} txt="WHILE IT'S STILL HOT" col={RED} size={40} /></>}>{(tt) => {
  const fill = eio(tt, 0.4, 3.0), mark = eio(tt, 2.8, 3.5);
  return <>
    <RBox s={[0.8, 0.012, 0.6]} p={[0, -0.006, 0]} r={0.004}><meshStandardMaterial color="#25262b" roughness={0.45} metalness={0.3} /></RBox>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.12, 64]} /><meshPhysicalMaterial color="#8e0f1e" roughness={0.1} clearcoat={1} /></mesh>
    <SaltPile r={0.13} h={0.006 + 0.03 * fill} p={[0, 0.001, 0]} tint={fill < 0.3 ? "#f1d0d4" : "#ffffff"} />
    <Stream tt={tt} p={[0.02, 0.3, 0]} y1={0.03} on={tt < 3 ? 1 : 0} n={30} spread={0.02} />
    <group position={[0.16, 0.05, 0.05]}>
      <RBox s={[0.012, 0.1, 0.03]} r={0.002}><meshStandardMaterial color="#e8c94a" roughness={0.6} /></RBox>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.0065, -0.045 + i * 0.0112, 0]}><boxGeometry args={[0.002, 0.0012, i % 4 === 0 ? 0.02 : 0.01]} /><meshBasicMaterial color="#222" /></mesh>)}
      <mesh position={[-0.008, -0.045 + 0.036, 0]}><boxGeometry args={[0.003, 0.003, 0.05 * mark]} />{M.glow({ col: GRN })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 2:32 · SALE ENTERA EN UNA COSTRA: horno frío a la mañana; la espátula se mete debajo y levanta la costra rosada de una pieza; abajo, limpio ----
export const HCrustLift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.03, 0], az: [0.7, 0.5], el: [0.38, 0.3], r: [0.64, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="IT LIFTS OFF IN ONE PIECE" col={GRN} /><Tag tt={tt} at={0.8} x={1450} y={840} txt="NEXT MORNING · COLD" col={ICE} size={40} /></>}>{(tt, u) => {
  const slide = eio(u, 0.06, 0.32), lift = eio(u, 0.36, 0.62), shine = eio(u, 0.6, 0.82), roll = eio(u, 0.66, 0.96);
  return <>
    <RBox s={[0.8, 0.012, 0.6]} p={[0, -0.006, 0]} r={0.004}><meshStandardMaterial color={new THREE.Color("#2e3036").lerp(new THREE.Color("#4a4c54"), shine)} roughness={0.45 - 0.25 * shine} metalness={0.4} /></RBox>
    <pointLight position={[0, 0.2, -0.1]} intensity={0.35 + 0.8 * Math.max(lift, shine)} distance={0.7} color="#ffe6b8" />
    <pointLight position={[0.04, 0.015, 0.16]} intensity={1.0 * lift} distance={0.45} color="#ffb070" />
    <group position={[0.06 * roll, 0.001 + lift * 0.085, 0.03 * roll]} rotation={[lift * 0.18, 1.8 * roll, lift * 0.45]}>
      <mesh geometry={lg("crust", [[0, 0.016], [0.08, 0.014], [0.12, 0.008], [0.13, 0]], 40)} scale={[1, 1, 0.85]} castShadow><meshStandardMaterial color="#e4b3b6" roughness={0.9} bumpMap={tex.paper(2, 2)} bumpScale={3} /></mesh>
      <mesh rotation={[PI / 2, 0, 0]} scale={[1, 0.85, 1]}><circleGeometry args={[0.13, 48]} /><meshStandardMaterial color="#5e1a20" roughness={0.8} side={THREE.DoubleSide} /></mesh>
      <group position={[lerp(0.36, 0.04, slide), -0.004, 0]} rotation={[0, 0, -0.08]}>
        <RBox s={[0.13, 0.003, 0.09]} r={0.001}>{M.steel({})}</RBox>
        <RBox s={[0.18, 0.02, 0.03]} p={[0.16, 0.012, 0]} rot={[0, 0, 0.18]} r={0.008}>{M.plastic({ col: "#1a1a1a" })}</RBox>
      </group>
    </group>
    
  </>;
}}</Scene3D>;

// ---- 3:09 · PASCUA DEL 88: la mesa de domingo con el mantel de lino y los lirios; el vaso de jugo de uva se vuelca y la mancha violeta se abre ----
export const HEaster88: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.3, 0.6, 0.2]}
  cam={{ at: [0, 0.06, 0], az: [-0.35, -0.15], el: [0.55, 0.45], r: [0.8, 0.66], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="EASTER SUNDAY · 1988" col={AMB} /><Tag tt={tt} at={2.2} x={1450} y={840} txt="WALT'S GRAPE JUICE" col={RED} size={40} /></>}>{(tt) => {
  const tip = eio(tt, 1.2, 1.8), spread = eio(tt, 1.7, 4.6);
  return <>
    <RBox s={[0.9, 0.01, 0.5]} p={[0, 0.005, 0]} r={0.004}><meshStandardMaterial color="#f7f4ec" roughness={0.95} bumpMap={tex.paper(6, 6)} bumpScale={2} /></RBox>
    <mesh position={[0.02, 0.0105, 0.03]} rotation={[-PI / 2, 0, 0.3]} scale={[1.3, 0.9, 1]}><circleGeometry args={[0.01 + 0.1 * spread, 48]} /><meshStandardMaterial color="#5a1f5e" roughness={0.9} transparent opacity={0.85} /></mesh>
    {/* lirios en florero */}
    <mesh position={[-0.25, 0.07, -0.1]}><cylinderGeometry args={[0.03, 0.025, 0.12, 32, 1, true]} />{M.glass({ op: 0.35 })}</mesh>
    {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.25 + Math.cos(i * 1.7) * 0.03, 0.16, -0.1 + Math.sin(i * 1.7) * 0.03]} rotation={[Math.cos(i * 1.7) * 0.4, 0, Math.sin(i * 1.7) * 0.4]}>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.002, 0.002, 0.1, 6]} /><meshStandardMaterial color="#3f6a2a" /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.022, 0.05, 6, 1, true]} /><meshStandardMaterial color="#fbfaf2" roughness={0.6} side={THREE.DoubleSide} /></mesh></group>)}
    {/* plato de la loza buena */}
    <mesh position={[0.22, 0.012, -0.08]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.08, 48]} />{M.porcelain({})}</mesh>
    <mesh position={[0.22, 0.013, -0.08]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.07, 0.074, 48]} />{M.brass({})}</mesh>
    {/* el vaso que se vuelca */}
    <group position={[-0.05, 0.01, -0.02]} rotation={[0, 0, tip * 1.45]}>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.026, 0.022, 0.09, 32, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.03 * (1 - tip * 0.8), 0]} scale={[1, 1 - tip * 0.85, 1]}><cylinderGeometry args={[0.024, 0.021, 0.06, 32]} /><meshPhysicalMaterial color="#4a1250" roughness={0.1} transparent opacity={0.85} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:38 · LA SAL CHUPA EL JUGO: corte del lino (hilos en fila) con el violeta adentro; encima el montón de sal se va tiñendo y la tela se aclara ----
export const HWick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, 0.03, 0], az: [0.05, -0.05], el: [0.12, 0.1], r: [0.42, 0.34], fov: 28 }}
  over={(tt) => <><Head tt={tt} kick="" title="SALT DRINKS THE JUICE" col={GRN} /><Tag tt={tt} at={1.0} x={420} y={840} txt="LINEN · CUT OPEN" col={ICE} size={36} anchor="l" />
    <Tag tt={tt} at={4.5} x={1450} y={840} txt="LIKE A SPONGE" col={GRN} size={42} /></>}>{(tt) => {
  const k = eio(tt, 1.2, 5.6), purple = new THREE.Color("#5a1f5e");
  return <>
    {Array.from({ length: 2 }, (_, r) => Array.from({ length: 16 }, (_, i) => <mesh key={r + "_" + i} position={[-0.15 + i * 0.02, 0.006 + r * 0.011, 0]} rotation={[PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.0058, 0.0058, 0.16, 16]} /><meshStandardMaterial color={new THREE.Color("#f4f0e6").lerp(purple, 0.8 * (1 - k * (0.8 - 0.3 * Math.abs(i - 7.5) / 8)) * (Math.abs(i - 7.5) < 6 ? 1 : 0.15))} roughness={1} /></mesh>))}
    <SaltPile r={0.08} h={0.05} p={[0, 0.017, 0]} tint={"#" + new THREE.Color("#ffffff").lerp(new THREE.Color("#a77aa8"), k * 0.85).getHexString()} />
    {Array.from({ length: 12 }, (_, i) => { const u = ((tt * 0.6 + i / 12) % 1); if (tt < 1.2) return null;
      return <mesh key={i} position={[-0.06 + (i % 6) * 0.024, 0.02 + u * 0.035, (i < 6 ? -1 : 1) * 0.02]}><sphereGeometry args={[0.0026, 8, 6]} />{M.glow({ col: "#c58ad0", op: 0.8 * (1 - u) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 4:13 · SIEMPRE AGUA FRÍA: dos canillas; la caliente (roja) oscurece y fija la mancha con un candado de calor; la fría (azul) la lava ----
export const HColdWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.08, 0.08], el: [0.26, 0.2], r: [0.9, 0.78], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ALWAYS COLD WATER" col={ICE} /><Tag tt={tt} at={1.2} x={560} y={860} txt="HOT · SETS IT" col={RED} size={42} />
    <Tag tt={tt} at={2.0} x={1360} y={860} txt="COLD · RINSES IT" col={ICE} size={42} /></>}>{(tt) => {
  const run = eio(tt, 0.6, 1.2), k = eio(tt, 1.2, 5.0);
  return <>{[-1, 1].map((s) => { const hot = s < 0, x = s * 0.2;
    return <group key={s} position={[x, 0, 0]}>
      <mesh position={[0, 0.3, -0.06]}><cylinderGeometry args={[0.012, 0.012, 0.12, 16]} />{M.chrome({})}</mesh>
      <mesh position={[0, 0.36, -0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.08, 16]} />{M.chrome({})}</mesh>
      <mesh position={[0.03, 0.34, -0.06]}><sphereGeometry args={[0.012, 16, 12]} /><meshStandardMaterial color={hot ? "#c8322a" : "#2a6fc8"} emissive={hot ? "#c8322a" : "#2a6fc8"} emissiveIntensity={0.6} /></mesh>
      <mesh position={[0, 0.36 - 0.17 * run, 0.02]} scale={[1, run, 1]}><cylinderGeometry args={[0.006, 0.008, 0.34, 12]} />{M.water({ col: hot ? "#e8a080" : "#9fd0ff", op: 0.55 })}</mesh>
      {hot && Array.from({ length: 5 }, (_, i) => { const u = ((tt * 0.5 + i / 5) % 1); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.08, 0.04 + u * 0.2, 0.02]} scale={0.6 + u}><sphereGeometry args={[0.012, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.18 * (1 - u) * run} depthWrite={false} /></mesh>; })}
      <RBox s={[0.26, 0.006, 0.18]} p={[0, 0.003, 0.02]} r={0.003}><meshStandardMaterial color="#f7f4ec" roughness={0.95} /></RBox>
      <mesh position={[0, 0.0065, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.055, 40]} />
        <meshStandardMaterial color={hot ? new THREE.Color("#5a1f5e").lerp(new THREE.Color("#3a1414"), k) : new THREE.Color("#5a1f5e")} transparent opacity={hot ? 0.85 : 0.85 * (1 - k * 0.9)} roughness={0.9} /></mesh>
      {hot && k > 0.7 && <group position={[0.09, 0.05, 0.08]} scale={cl((k - 0.7) * 4)}><RBox s={[0.034, 0.028, 0.012]} r={0.004}>{M.brass({})}</RBox>
        <mesh position={[0, 0.022, 0]}><torusGeometry args={[0.011, 0.003, 8, 20, PI]} />{M.chrome({})}</mesh></group>}
    </group>; })}</>;
}}</Scene3D>;
