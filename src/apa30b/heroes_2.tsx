// apa30b · componentes únicos, minutos 7-14 (dónde va el balde, el cebado sin cerrar, limpieza segura).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Rodent, Sign, barnT } from "./farmkit";
import { TBucket, SodaCan, Ramp, MicePile, Droppings, FeedSack, RIM, BR } from "./bkit";

const PI = Math.PI;
// planta del granero vista desde arriba: piso + cuatro paredes bajas
const Floorplan: React.FC<{ w?: number; d?: number }> = ({ w = 1.6, d = 1.0 }) => <>
  <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={tex.wood(5, 3, [112, 80, 50])} roughness={0.9} /></mesh>
  {[[0, -d / 2, w, 0], [0, d / 2, w, 0], [-w / 2, 0, d, 1], [w / 2, 0, d, 1]].map(([x, z, l, r], i) =>
    <RBox key={i} s={[l, 0.08, 0.03]} p={[r ? x : x, 0.04, z]} rot={[0, r ? PI / 2 : 0, 0]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>)}
</>;
// recorrido pegado a la pared: punto u (0-1) del perímetro, con margen m
const perim = (u: number, w: number, d: number, m: number) => {
  const W = w - 2 * m, D = d - 2 * m, L = 2 * (W + D); let s = ((u % 1) + 1) % 1 * L;
  if (s < W) return [-W / 2 + s, -D / 2, 0]; s -= W;
  if (s < D) return [W / 2, -D / 2 + s, PI / 2]; s -= D;
  if (s < W) return [W / 2 - s, D / 2, PI]; s -= W;
  return [-W / 2, D / 2 - s, -PI / 2];
};

// ---- 6:48 · LA AUTOPISTA DEL ZÓCALO: desde arriba, el ratón corre pegado a las paredes y deja una estela; el medio del piso queda vacío ----
export const HBaseboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#100d0a" key1={[-0.6, 2.2, 0.6]}
  cam={{ at: [0, 0, 0], az: [0.2, -0.15], el: [1.25, 1.05], r: [1.7, 1.45], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="ALONG THE WALL · NEVER ACROSS" col={AMB} />}>{(tt) => {
  const u = tt * 0.16;
  return <>
    <Floorplan />
    {Array.from({ length: 40 }, (_, i) => { const k = u - i * 0.006; if (k < 0) return null; const [x, z] = perim(k, 1.6, 1.0, 0.06);
      return <mesh key={i} position={[x, 0.004, z]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012, 10]} />{M.glow({ col: "#ffb35a", op: 0.6 * (1 - i / 40) })}</mesh>; })}
    {(() => { const [x, z, a] = perim(u, 1.6, 1.0, 0.06); return <Rodent p={[x, 0, z]} rot={[0, PI / 2 - a, 0]} s={0.9} walk={tt * 2} />; })()}
    <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.18, 0.2, 40]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={0.6 * cl(tt - 2)} /></mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, PI / 4]}><planeGeometry args={[0.36, 0.02]} /><meshBasicMaterial color="#ff5a4a" transparent opacity={0.6 * cl(tt - 2)} /></mesh>
  </>;
}}</Scene3D>;

// ---- 7:38 · LAS SEÑALES: la linterna barre el piso en la penumbra y va prendiendo la bosta, la bolsa mordida y el papel deshecho ----
export const HSigns: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" bg="#070605" warm={0.25} key1={[-1, 1.6, 1]}
  cam={{ at: [0, 0.08, 0], az: [-0.3, 0.3], el: [0.55, 0.45], r: [1.2, 1.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={150} txt="DROPPINGS · CHEWING · NESTS" col={TX} />}>{(tt) => {
  const sx = -0.5 + 1.0 * eio(tt, 0.3, 3.6);
  return <>
    <group scale={1.5} position={[0.2, 0, -0.05]}><Droppings n={30} c={[-0.4, 0, 0.1]} spread={[0.2, 0.06]} /></group>
    <FeedSack p={[0.02, 0, -0.15]} bite={1} s={0.68} />
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[0.3 + (rn(i, 1) - 0.5) * 0.14, 0.006 + rn(i, 2) * 0.03, 0.1 + (rn(i, 3) - 0.5) * 0.1]} rotation={[rn(i, 4) * PI, rn(i, 5) * PI, 0]}><planeGeometry args={[0.03, 0.012]} /><meshStandardMaterial map={tex.paper()} side={THREE.DoubleSide} /></mesh>)}
    <pointLight position={[sx, 0.22, 0.25]} intensity={0.7} distance={0.55} decay={2} color="#fff1d4" />
    <mesh position={[sx, 0.003, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} />{M.glow({ col: "#fff1d4", op: 0.04 })}</mesh>
  </>;
}}</Scene3D>;

// ---- 7:56 · CONTRA LA PARED, SOBRE EL CAMINO: tres baldes van a donde está la bosta, pegados a la pared; el del medio del piso se tacha ----
export const HWallMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#100d0a" key1={[-0.6, 2.2, 0.6]}
  cam={{ at: [0, 0, 0.05], az: [-0.2, 0.15], el: [1.0, 0.85], r: [1.75, 1.5], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="EVERY ONE AGAINST A WALL" col={GRN} />}>{(tt) => <>
  <Floorplan />
  {[[-0.55, -0.4], [0.62, -0.1], [0.1, 0.4]].map(([x, z], i) => <group key={i}>
    <Droppings n={20} c={[x + 0.12, 0, z]} spread={[0.16, 0.05]} seed={i + 3} />
    <group position={[x, 0.6 * (1 - cl(phys(tt, 0.5 + i * 0.5, 7, 0.45))), z]}><TBucket s={0.35} /></group>
  </group>)}
  <group position={[0, 0, 0]}><TBucket s={0.35} op={1 - 0.6 * cl(tt - 2.2)} /></group>
  <mesh position={[0, 0.16, 0]} rotation={[-PI / 2, 0, PI / 4]}><planeGeometry args={[0.24 * cl((tt - 2.2) * 2), 0.018]} /><meshBasicMaterial color="#ff5a4a" /></mesh>
  <mesh position={[0, 0.16, 0]} rotation={[-PI / 2, 0, -PI / 4]}><planeGeometry args={[0.24 * cl((tt - 2.4) * 2), 0.018]} /><meshBasicMaterial color="#ff5a4a" /></mesh>
</>}</Scene3D>;

// ---- 8:30 · COMIDA GRATIS: la lata está trabada con cinta; pasan tres noches (la luz baja y sube) y cada noche suben más ratones a comer ----
export const HPreBait: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0.1, 0.25, 0], az: [0.7, 0.45], el: [0.35, 0.28], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={150} txt="TAPED · 2 TO 3 NIGHTS · FREE FOOD" col={AMB} />}>{(tt) => {
  const night = Math.min(2, Math.floor(tt / 1.6)), ph = (tt % 1.6) / 1.6, dark = 0.5 + 0.5 * Math.cos(ph * 2 * PI);
  return <>
    <TBucket />
    <SodaCan pb={1 - 0.6 * ph} tape={1} />
    <Ramp p={[BR + 0.37, 0, 0]} />
    {Array.from({ length: night + 1 }, (_, i) => <group key={i} position={[BR + 0.05 + 0.08 * i, RIM - 0.03 - 0.07 * i, 0.03 - 0.04 * i]} rotation={[0, 0, -0.75]}><Rodent rot={[0, -PI / 2, 0]} s={0.55} walk={tt + i} /></group>)}
    <pointLight position={[-0.6, 1.2, 0.8]} intensity={0.5 + 1.4 * dark} distance={3} color={dark > 0.5 ? "#ffe2b0" : "#7d8fc8"} />
  </>;
}}</Scene3D>;

// ---- 9:13 · LA NOCHE DE SACAR LA CINTA: las dos tiras se despegan y salen volando; la lata queda girando libre con manteca nueva ----
export const HTapeOff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0e0c0a" key1={[-0.5, 1.2, 1.3]}
  cam={{ at: [0, RIM - 0.03, 0], az: [-0.55, -0.2], el: [0.3, 0.22], r: [0.6, 0.5], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={930} txt="TAPE OFF · THAT IS THE NIGHT" col={GRN} />}>{(tt) => {
  const off = 1 - eio(tt, 0.6, 1.6), sp = tt < 1.8 ? 0 : (1 - Math.exp(-(tt - 1.8) * 0.5)) * 2.5;
  return <><TBucket /><SodaCan pb={eio(tt, 0.2, 1.0)} tape={off} spin={sp} /></>;
}}</Scene3D>;

// ---- 10:21 · LOS ATREVIDOS: sin cebar antes, sólo los dos primeros de la fila suben; el resto da media vuelta y se va ----
export const HBoldOnes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#110e0b" key1={[-1, 1.8, 1]}
  cam={{ at: [0.35, 0.1, 0.15], az: [0.55, 0.35], el: [0.6, 0.5], r: [1.5, 1.3], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="SKIP THE PRE-BAIT = ONLY THE BOLD ONES" col={RED} />}>{(tt) => {
  const turn = eio(tt, 1.6, 2.4);
  return <>
    <TBucket /><SodaCan pb={1} /><Ramp p={[BR + 0.37, 0, 0]} />
    {Array.from({ length: 7 }, (_, i) => { const bold = i < 2, x = BR + 0.42 + (i % 4) * 0.1, go = bold ? eio(tt, 0.4 + i * 0.3, 1.6 + i * 0.3) : 0;
      return bold ? <group key={i} position={[x - go * (x - BR - 0.1), go * 0.25, 0]} rotation={[0, 0, -0.75 * cl(go * 3)]}><Rodent rot={[0, -PI / 2, 0]} s={0.72} walk={tt * 1.4} /></group>
        : <Rodent key={i} p={[x + turn * 0.12, 0, 0.14 + 0.12 * Math.floor(i / 4)]} rot={[0, -PI / 2 + PI * turn, 0]} s={0.72} walk={tt * (turn > 0 ? 1.4 : 0.2)} deer={i === 4} />; })}
  </>;
}}</Scene3D>;

// ---- 10:43 · UNA CAMA Y ALGO DE COMER: corte del fondo del balde; cae una capa de viruta, después unas semillas y una tajada de manzana ----
export const HBedding: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#13100c" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0, 0.08, 0], az: [0.3, 0.1], el: [0.55, 0.42], r: [0.7, 0.58], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="BEDDING · SEED · A BIT OF APPLE" col={TX} />}>{(tt) => {
  const b = eio(tt, 0.3, 1.4);
  return <>
    <TBucket op={0.3} />
    {Array.from({ length: 70 }, (_, i) => { const fall = cl(b * 1.6 - rn(i, 6) * 0.6); return <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.2, 0.01 + rn(i, 2) * 0.014 + (1 - fall) * 0.4, (rn(i, 3) - 0.5) * 0.2]} rotation={[rn(i, 7) * PI, rn(i, 4) * PI, PI / 2]}>
      <boxGeometry args={[0.022, 0.002, 0.008]} /><meshStandardMaterial color="#e0c690" roughness={1} /></mesh>; })}
    {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 8) - 0.5) * 0.08, 0.03 + (1 - cl(phys(tt, 1.6 + i * 0.05, 8, 0.5))) * 0.35, (rn(i, 9) - 0.5) * 0.08]} scale={[1, 0.6, 1.6]}><sphereGeometry args={[0.005, 8, 6]} /><meshStandardMaterial color="#3a3026" roughness={0.6} /></mesh>)}
    <group position={[0.04, 0.035 + (1 - cl(phys(tt, 2.4, 7, 0.45))) * 0.35, -0.02]} rotation={[PI / 2, 0, 0.4]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.012, 24, 1, false, 0, PI * 0.6]} /><meshStandardMaterial color="#f2e6c4" roughness={0.6} /></mesh>
      <mesh><cylinderGeometry args={[0.0305, 0.0305, 0.0125, 24, 1, true, 0, PI * 0.6]} /><meshStandardMaterial color="#b8282a" roughness={0.4} side={THREE.DoubleSide} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 11:30 · TAPA PUESTA Y GUANTES: la mano enguantada baja la tapa, la traba y levanta el balde por el asa ----
export const HLidGloves: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.3, 0], az: [-0.4, 0.15], el: [0.32, 0.25], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="GLOVES ON · LID ON · NO BARE HANDS" col={AMB} />}>{(tt) => {
  const lid = eio(tt, 0.4, 1.4), lift = eio(tt, 2.0, 3.2);
  return <>
    <group position={[0, 0.18 * lift, 0]}><TBucket lid={lid} /><MicePile n={9} tt={tt} /></group>
    <group position={[0, RIM + 0.15 + 0.18 * lift - 0.02 * lid, 0]}>
      <mesh scale={[0.05, 0.035, 0.07]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#c9b48a" roughness={0.95} /></mesh>
      <mesh position={[0, -0.03, 0.05]} scale={[0.04, 0.016, 0.05]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#c9b48a" roughness={0.95} /></mesh>
      <mesh position={[0, 0.04, -0.06]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.04, 0.05, 0.1, 20]} /><meshStandardMaterial color="#a8925e" roughness={0.95} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 12:19 · HANTAVIRUS: un ratón de campo en la penumbra; alrededor flotan las partículas del virus, grandes y lentas, sin dramatismo ----
export const HHanta: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#1e2126" warm={0.5} key1={[-0.6, 1.2, 1]}
  cam={{ at: [0, 0.06, 0], az: [0.5, 0.1], el: [0.3, 0.22], r: [0.65, 0.52], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={930} txt="HANTAVIRUS · MOSTLY DEER MICE" col={RED} />}>{(tt) => <>
  <Rodent deer s={1.8} rot={[0, 0.5 + 0.1 * Math.sin(tt), 0]} walk={tt * 0.3} />
  {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7 + tt * 0.25, r = 0.16 + 0.05 * rn(i, 2), y = 0.06 + 0.12 * rn(i, 3) + 0.01 * Math.sin(tt + i), s = 0.012 + 0.006 * rn(i, 4);
    return <group key={i} position={[r * Math.cos(a), y, r * Math.sin(a)]} rotation={[tt * 0.3, a, 0]} scale={cl(tt - 0.6 - i * 0.12)}>
      <mesh><icosahedronGeometry args={[s, 1]} /><meshStandardMaterial color="#c86a5a" roughness={0.5} emissive="#5a1a14" emissiveIntensity={0.5} /></mesh>
      {Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[s * 1.25 * Math.cos(j * 2.4), s * 1.25 * Math.sin(j * 1.3), s * 1.25 * Math.sin(j * 2.4)]}><sphereGeometry args={[s * 0.22, 6, 4]} /><meshStandardMaterial color="#ffb09a" /></mesh>)}
    </group>; })}
</>}</Scene3D>;

// ---- 12:43 · SE RESPIRA EN EL POLVO: la escoba pasa por la bosta seca y la nube sube hasta la altura de la cara ----
export const HDustAir: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0, 0.3, 0], az: [0.35, 0.2], el: [0.25, 0.18], r: [1.2, 1.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.6} x={960} y={150} txt="IT IS IN THE DUST YOU BREATHE" col={RED} />}>{(tt) => {
  const sw = Math.sin(tt * 3) * 0.12 * (1 - eio(tt, 1.6, 2.0));
  return <>
    <Droppings n={40} c={[0, 0, 0.05]} spread={[0.3, 0.12]} />
    <group position={[sw, 0, 0.05]} rotation={[0, 0, sw * 1.5]}>
      <RBox s={[0.16, 0.05, 0.03]} p={[0, 0.03, 0]} r={0.008}><meshStandardMaterial color="#c8a050" roughness={1} /></RBox>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.008, 0.008, 0.7, 10]} />{M.wood({ base: [150, 104, 60] })}</mesh>
    </group>
    {Array.from({ length: 140 }, (_, i) => { const k = cl((tt - 0.3 - rn(i, 1) * 1.2) / 2.6); return k <= 0 ? null :
      <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.3 * (1 + k), 0.02 + 0.62 * k * (0.6 + 0.4 * rn(i, 3)), 0.05 + (rn(i, 4) - 0.5) * 0.2 * (1 + k)]}><sphereGeometry args={[0.005 + 0.014 * k, 8, 6]} /><meshStandardMaterial color="#cfc3a8" transparent opacity={0.16 * (1 - k * 0.6)} depthWrite={false} /></mesh>; })}
    <mesh position={[0, 0.62, 0.05]}><boxGeometry args={[0.9, 0.002, 0.002]} /><meshBasicMaterial color="#ff8a5a" transparent opacity={0.5 * cl(tt - 1.8)} /></mesh>
  </>;
}}</Scene3D>;

// ---- 13:30 · UNO DE LAVANDINA, DIEZ DE AGUA: la jarra llena diez medidas de agua y una de lavandina; el rociador moja la bosta hasta que brilla ----
export const HSoak5: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#100e0b" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.12, 0], az: [-0.2, 0.2], el: [0.42, 0.34], r: [1.1, 0.92], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="1 PART BLEACH · 10 PARTS WATER · SOAK IT" col={TX} />}>{(tt) => {
  const w = eio(tt, 0.3, 1.6), bl = eio(tt, 1.6, 2.0), wet = eio(tt, 2.4, 3.6);
  return <>
    {Array.from({ length: 11 }, (_, i) => { const on = i < 10 ? cl(w * 10 - i) : bl, x = -0.5 + i * 0.07 + (i === 10 ? 0.06 : 0); return <group key={i} position={[x, 0, -0.18]}>
      <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.026, 0.024, 0.09, 24, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      {on > 0.02 && <mesh position={[0, 0.04 * on, 0]}><cylinderGeometry args={[0.023, 0.022, 0.08 * on, 24]} />{i < 10 ? M.water({ op: 0.55 }) : <meshPhysicalMaterial color="#f2e98a" transparent opacity={0.75} roughness={0.1} clearcoat={1} />}</mesh>}
    </group>; })}
    <Sign id="sk10b" txt="10 WATER" p={[-0.19, 0.04, -0.1]} rot={[-0.5, 0, 0]} w={0.3} h={0.07} />
    <Sign id="sk1b" txt="1 BLEACH" p={[0.27, 0.04, -0.1]} rot={[-0.5, 0, 0]} w={0.18} h={0.07} col="#f2e98a" />
    <Droppings n={36} c={[0.15, 0, 0.12]} spread={[0.24, 0.1]} wet={wet} />
    <group position={[0.3, 0.2, 0.3]} rotation={[0, -0.8, 0.3]}>
      <RBox s={[0.06, 0.14, 0.04]} r={0.012}>{M.plastic({ col: "#e9e6dc" })}</RBox>
      <RBox s={[0.04, 0.03, 0.05]} p={[0, 0.08, 0.02]} r={0.006}>{M.plastic({ col: "#2a6aa8" })}</RBox>
    </group>
    {Array.from({ length: 30 }, (_, i) => { const k = ((tt * 1.4 + rn(i, 1)) % 1); return tt > 2.2 && tt < 3.8 ?
      <mesh key={i} position={[lerp(0.28, 0.15 + (rn(i, 2) - 0.5) * 0.2, k), lerp(0.28, 0.01, k), lerp(0.32, 0.12, k)]}><sphereGeometry args={[0.004, 6, 4]} />{M.water({ op: 0.6 })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 13:53 · NUNCA EN SECO: la escoba y la aspiradora quedan tachadas; la toalla de papel pasa y levanta la bosta mojada ----
export const HNoSweep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.2, 0], az: [0.3, -0.2], el: [0.35, 0.28], r: [1.3, 1.1], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="NEVER SWEEP OR VACUUM IT DRY" col={RED} />}>{(tt) => {
  const x1 = cl((tt - 0.8) * 2), wipe = eio(tt, 2.0, 3.4);
  return <>
    <group position={[-0.45, 0, 0]}>
      <RBox s={[0.16, 0.05, 0.03]} p={[0, 0.03, 0]} r={0.008}><meshStandardMaterial color="#c8a050" roughness={1} /></RBox>
      <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.008, 0.008, 0.66, 10]} />{M.wood({ base: [150, 104, 60] })}</mesh>
    </group>
    <group position={[-0.15, 0, 0]}>
      <RBox s={[0.14, 0.1, 0.2]} p={[0, 0.06, 0]} r={0.03}>{M.plastic({ col: "#8a2a2a" })}</RBox>
      <mesh position={[0, 0.35, -0.05]} rotation={[0.15, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.5, 10]} />{M.steel()}</mesh>
    </group>
    {[-0.45, -0.15].map((x, i) => [1, -1].map((sd) => <mesh key={i + "" + sd} position={[x, 0.25, 0.15]} rotation={[0, 0, sd * PI / 4]}><planeGeometry args={[0.32 * x1, 0.022]} /><meshBasicMaterial color="#ff5a4a" /></mesh>))}
    <Droppings n={Math.round(30 * (1 - wipe))} c={[0.35, 0, 0.05]} spread={[0.22, 0.1]} wet={1} />
    <group position={[0.24 + 0.24 * wipe, 0.012, 0.05]}><RBox s={[0.12, 0.012, 0.12]} r={0.004}><meshStandardMaterial color="#f4f1ea" roughness={1} /></RBox></group>
  </>;
}}</Scene3D>;
