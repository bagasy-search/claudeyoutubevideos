// apa30c · componentes únicos, minutos 14-26 (ramas, faldón, caja túnel, cebo, el plan de días, preguntas y el cierre).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Rodent, Sign, barnT, soilT } from "./farmkit";
import { Coop, TunnelBox, RatSnap, NestBox, Hen, Egg, Wire } from "./ckit";
import { Grass, Burrow } from "./heroes_1";

const PI = Math.PI;

// árbol simple: tronco + rama larga que cuelga sobre el techo (cut = 0-1 la rama cae)
const Oak: React.FC<{ p: [number, number, number]; cut?: number }> = ({ p, cut = 0 }) => <group position={p}>
  <RBox s={[0.16, 1.4, 0.16]} p={[0, 0.7, 0]} r={0.04}>{M.wood({ base: [92, 64, 40] })}</RBox>
  <group position={[0.05, 1.15 - 0.9 * cut, 0]} rotation={[0, 0, -1.87 - 0.5 * cut]} visible={cut < 0.6}>
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.022, 0.045, 1.2, 10]} />{M.wood({ base: [92, 64, 40] })}</mesh>
    {[0.5, 0.85, 1.15].map((y, i) => <mesh key={i} position={[0.07 * (i % 2 ? 1 : -1), y, -0.08]}><icosahedronGeometry args={[0.08, 0]} /><meshStandardMaterial color="#3f5a2a" roughness={0.9} flatShading /></mesh>)}
  </group>
  {[0, 1].map((i) => <mesh key={i} position={[0.1 * i - 0.05, 1.55, 0.05]}><icosahedronGeometry args={[0.32, 0]} /><meshStandardMaterial color="#3a5426" roughness={0.9} flatShading /></mesh>)}
</group>;

// ---- 14:25 · LAS RAMAS SON UN PUENTE: la rata camina por la rama hasta el techo; se corta la rama y la rata queda del lado del árbol ----
export const HLimbs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0f110c" key1={[-1, 2, 1]}
  cam={{ at: [0.35, 0.75, 0], az: [0.3, 0.12], el: [0.12, 0.08], r: [2.3, 2.0], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="CUT THE LIMBS OVER THE COOP" col={AMB} />}>{(tt) => {
  const cut = eio(tt, 2.2, 3.0), w = eio(tt, 0.3, 2.0);
  return <>
    <Grass w={4} d={3} />
    <Coop p={[0.8, 0, 0]} />
    <Oak p={[-0.2, 0, 0]} cut={cut} />
    {cut < 0.05 && <group position={[-0.15 + 0.956 * lerp(0.1, 1.1, w), 1.19 - 0.295 * lerp(0.1, 1.1, w), 0.0]} rotation={[0, 0, -0.3]}><Rodent rat rot={[0, PI / 2, 0]} s={1.6} walk={tt * 2} /></group>}
    {cut >= 0.05 && <group position={[-0.2, 1.05, 0.09]} rotation={[-PI / 2, 0, 0]}><Rodent rat s={1.6} /></group>}
  </>;
}}</Scene3D>;

// ---- 15:13 · EL FALDÓN: una tira de chapa clavada al pie de la pared; la rata la rasca y resbala ----
export const HFlashing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#110f0b" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [0.5, 0.3], el: [0.18, 0.14], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="METAL FLASHING · NOTHING TO GRIP" col={GRN} />}>{(tt) => {
  const f = eio(tt, 0.2, 1.0), sl = Math.max(0, Math.sin((tt - 1.4) * 4)) * cl(tt - 1.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.6, 1.2]} /><meshStandardMaterial map={soilT()} roughness={1} /></mesh>
    <RBox s={[1.2, 0.5, 0.04]} p={[0, 0.25, -0.02]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <RBox s={[1.2, 0.14, 0.004]} p={[0, 0.07 + 0.3 * (1 - f), 0.003]} r={0.001}><meshStandardMaterial color="#c4cacf" metalness={0.95} roughness={0.22} /></RBox>
    {[-0.5, -0.2, 0.1, 0.4].map((x) => <mesh key={x} position={[x, 0.12 + 0.3 * (1 - f), 0.007]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.003, 10]} />{M.steel()}</mesh>)}
    <group position={[0.05, 0.05 + 0.06 * sl, 0.11]} rotation={[-1.1 * cl(tt - 1.2), 0, 0]}><Rodent rat rot={[0, PI, 0]} s={1.1} walk={tt * 3} /></group>
  </>;
}}</Scene3D>;

// ---- 16:02 · TRES TABLAS: las tablas caen una a una y arman la caja túnel; los dos agujeros de 3" quedan a la vista ----
export const HTunnelBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.07, 0], az: [0.6, 0.35], el: [0.45, 0.32], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="3 BOARDS · A 3-INCH HOLE EACH END" col={AMB} />}>{(tt) => {
  const b = eio(tt, 0.2, 2.4);
  return <>
    <TunnelBox build={b} lid={0.6 * eio(tt, 2.6, 3.4)} />
  </>;
}}</Scene3D>;

// ---- 16:36 · ESPALDA CON ESPALDA: tapa abierta; dos trampas entran con los gatillos hacia cada boca ----
export const HBackToBack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.8, 1.8, 0.8]}
  cam={{ at: [0, 0.05, 0], az: [0.2, 0.05], el: [0.95, 0.85], r: [0.85, 0.75], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="TWO TRAPS · TRIGGERS FACE THE HOLES" col={TX} />}>{(tt) => {
  const a = eio(tt, 0.4, 1.4), b = eio(tt, 1.2, 2.2);
  return <>
    <TunnelBox lid={1} />
    <RatSnap p={[lerp(-0.6, -0.12, a), 0.0, 0]} ry={-PI / 2} />
    <RatSnap p={[lerp(0.6, 0.12, b), 0.0, 0]} ry={PI / 2} />
  </>;
}}</Scene3D>;

// ---- 17:09 · EL CEBO: mantequilla de maní en el gatillo y, encima, se clavan semillas de girasol una a una ----
export const HSeedPress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[-0.6, 1.4, 1]}
  cam={{ at: [0, 0.02, 0.05], az: [0.35, 0.2], el: [0.7, 0.6], r: [0.32, 0.27], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="SEEDS PRESSED IN · HE CAN'T LICK IT CLEAN" col={AMB} />}>{(tt) => {
  const pb = eio(tt, 0.2, 0.9);
  return <>
    <RatSnap />
    <mesh position={[0, 0.021, 0.055]} scale={[1, 0.5 * pb, 1]}><sphereGeometry args={[0.016 * pb + 0.0001, 16, 10]} /><meshStandardMaterial color="#a8682c" roughness={0.6} /></mesh>
    {Array.from({ length: 5 }, (_, i) => { const k = eio(tt, 1.1 + i * 0.32, 1.5 + i * 0.32); const a = i * 1.26; return <mesh key={i} position={[0.009 * Math.cos(a), 0.03 + 0.05 * (1 - k), 0.055 + 0.009 * Math.sin(a)]} rotation={[0.6 * Math.cos(a), a, 0.6]}><sphereGeometry args={[0.0045, 8, 6]} /><meshStandardMaterial color={i % 2 ? "#2a2622" : "#d8d2c4"} roughness={0.6} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 18:04 · TRES O CUATRO CAJAS: vista desde arriba del gallinero; las cajas aparecen sobre las sendas, pegadas a las paredes ----
export const HFourBoxes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f110c" key1={[-1, 2.4, 1]}
  cam={{ at: [0, 0, 0], az: [0.15, -0.1], el: [1.25, 1.15], r: [2.9, 2.6], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="ALONG THE WALLS · ON THEIR RUNS" col={GRN} />}>{(tt) => {
  const B = [[-0.6, 0.38, 0], [0.6, 0.38, 0], [-0.55, -0.38, 0], [0.62, -0.36, 0]];
  return <>
    <Grass w={4} d={3} />
    <Coop />
    {B.map(([x, z, r], i) => { const k = phys(tt, 0.6 + i * 0.45, 7, 0.5); return <group key={i} position={[x, 0.4 * (1 - k), z]} scale={0.55}><TunnelBox ry={r} /></group>; })}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-0.9 + i * 0.085, 0.002, 0.33 + 0.02 * Math.sin(i)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012, 8]} /><meshBasicMaterial color="#4a3a24" transparent opacity={0.6 * eio(tt, 0.2, 0.8)} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 19:30 · NUNCA AL AIRE: la trampa suelta en el piso, la gallina pica y se tacha; la trampa dentro de la caja, la gallina pasa de largo ----
export const HNeverOpen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f110c" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.12, 0], az: [0.2, 0.05], el: [0.4, 0.3], r: [1.3, 1.1], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.4} x={600} y={940} txt="OPEN TRAP · HENS GET HURT" col={RED} /><Tag tt={tt} at={2.4} x={1320} y={940} txt="IN A BOX · ONLY A RAT FITS" col={GRN} /></>}>{(tt) => {
  const pk = Math.max(0, Math.sin(tt * 5)) * cl((tt - 0.6) * 2);
  return <>
    <Grass />
    <RatSnap p={[-0.4, 0, 0.1]} ry={0.4} />
    <Hen p={[-0.62, 0, -0.02]} rot={[0, 1.2, 0]} s={0.9} peck={pk} />
    <mesh position={[-0.4, 0.1, 0.16]} rotation={[0, 0, PI / 4]} scale={eio(tt, 1.2, 1.6)}><boxGeometry args={[0.2, 0.02, 0.01]} />{M.glow({ col: RED })}</mesh>
    <mesh position={[-0.4, 0.1, 0.16]} rotation={[0, 0, -PI / 4]} scale={eio(tt, 1.3, 1.7)}><boxGeometry args={[0.2, 0.02, 0.01]} />{M.glow({ col: RED })}</mesh>
    <group position={[0.42, 0, 0.05]} scale={0.6}><TunnelBox /></group>
    <Hen p={[lerp(0.2, 0.7, eio(tt, 1.6, 3.6)), 0, -0.15]} rot={[0, PI / 2, 0]} s={0.9} />
  </>;
}}</Scene3D>;

// ---- 20:37 · DÍAS 3 A 6: un almanaque de tablas; cada tarde se pone cebo sin armar y a la mañana aparece comido ----
export const HFortnight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0, 0.3, 0], az: [0.2, 0.05], el: [0.12, 0.08], r: [1.45, 1.3], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={150} txt="FEED, DON'T SET · 7 NIGHTS" col={AMB} />}>{(tt) => {
  const n = Math.floor(cl(tt / 3.2) * 7);
  return <>
    {Array.from({ length: 7 }, (_, i) => { const on = i < n || (i === n && tt > 3.2), x = -0.48 + i * 0.16, set = i === 6; return <group key={i} position={[x, 0.35, 0]}>
      <Sign id={"cday" + i} txt={"DAY " + (i + 1)} p={[0, 0.12, 0]} w={0.14} h={0.07} col={set ? "#f0c9b8" : "#efe6d2"} />
      <RBox s={[0.13, 0.17, 0.02]} p={[0, -0.03, 0]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
      <mesh position={[0, -0.03, 0.012]} scale={on && !set ? 0.35 : 1}><sphereGeometry args={[0.022, 14, 10]} /><meshStandardMaterial color="#a8682c" roughness={0.6} /></mesh>
      {on && !set && <mesh position={[0, -0.03, 0.03]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.07, 0.008, 0.004]} />{M.glow({ col: GRN })}</mesh>}
      {set && on && <mesh position={[0, -0.09, 0.02]}><boxGeometry args={[0.09, 0.008, 0.02]} />{M.steel()}</mesh>}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 21:14 · DÍA 7, SE ARMAN TODAS: las cuatro trampas de la fila se arman juntas, clac clac clac clac ----
export const HSetAll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.8, 1.8, 0.8]}
  cam={{ at: [0, 0.02, 0], az: [0.5, 0.25], el: [0.55, 0.42], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="DAY 7 · SET THEM ALL THE SAME NIGHT" col={RED} />}>{(tt) => <>
  {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <RatSnap key={i} p={[x, 0, 0]} set={eio(tt, 0.8 + i * 0.35, 1.05 + i * 0.35)} />)}
</>}</Scene3D>;

// gato simple de barro: cuerpo, cabeza con orejas, cola que se mueve
const Cat: React.FC<{ p?: [number, number, number]; rot?: [number, number, number]; s?: number; tail?: number; nap?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, tail = 0, nap = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.09 - 0.03 * nap, 0]} scale={[1, 0.8 - 0.2 * nap, 1.6]}><sphereGeometry args={[0.07, 20, 14]} /><meshStandardMaterial color="#c9772e" roughness={0.8} /></mesh>
  <group position={[0, 0.15 - 0.07 * nap, 0.11]}>
    <mesh><sphereGeometry args={[0.05, 20, 14]} /><meshStandardMaterial color="#c9772e" roughness={0.8} /></mesh>
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.028, 0.045, 0]} rotation={[0, 0, -sd * 0.3]}><coneGeometry args={[0.016, 0.035, 4]} /><meshStandardMaterial color="#b0651f" roughness={0.8} /></mesh>)}
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.018, 0.008, 0.045]} scale={[1, 1 - 0.9 * nap, 1]}><sphereGeometry args={[0.007, 8, 6]} /><meshStandardMaterial color="#1a2a10" /></mesh>)}
  </group>
  {[[-0.035, 0.07], [0.035, 0.07], [-0.035, -0.07], [0.035, -0.07]].map(([x, z], i) => <mesh key={i} position={[x, 0.03, z]}><cylinderGeometry args={[0.012, 0.012, 0.06, 8]} /><meshStandardMaterial color="#c9772e" roughness={0.8} /></mesh>)}
  <group position={[0, 0.1, -0.1]} rotation={[-0.6 + 0.3 * Math.sin(tail), 0.4 * Math.sin(tail * 0.7), 0]}><mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.008, 0.012, 0.15, 8]} /><meshStandardMaterial color="#b0651f" roughness={0.8} /></mesh></group>
</group>;

// ---- 23:12 · ¿Y UN GATO?: el gato mira la rata pequeña; la rata grande sale de la cueva y el gato se echa a dormir ----
export const HCatQ: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f110c" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.1, 0], az: [0.4, 0.2], el: [0.25, 0.18], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="A CAT TAKES YOUNG ONES · NOT A BIG RAT" col={TX} />}>{(tt) => {
  const big = eio(tt, 1.2, 2.2), nap = eio(tt, 2.4, 3.4);
  return <>
    <Grass />
    <Cat p={[-0.3, 0, 0]} rot={[0, PI / 2 - 0.2, 0]} tail={tt * 3} nap={nap} />
    <Burrow p={[0.35, 0, -0.05]} r={0.07} />
    <Rodent rat p={[0.3 - 0.1 * big, 0, 0.12]} rot={[0, -PI / 2, 0]} s={0.7} walk={tt * 2} />
    <Rodent rat p={[0.35, 0, lerp(-0.05, 0.05, big)]} rot={[0, -2.2, 0]} s={lerp(0.01, 1.4, big)} walk={tt} />
  </>;
}}</Scene3D>;

// ---- 23:42 · ¿MENTA Y CAJITAS DE SONIDO?: el frasco de menta y la caja que emite ondas; la rata pasa de largo al lado y come igual ----
export const HPeppermint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f110c" key1={[-0.8, 1.6, 1.1]}
  cam={{ at: [0, 0.08, 0], az: [-0.3, -0.05], el: [0.3, 0.22], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="SMELLS AND SOUNDS · THEY GET USED TO IT" col={RED} />}>{(tt) => {
  const w = eio(tt, 0.8, 3.4);
  return <>
    <Grass />
    <group position={[-0.25, 0, 0]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.03, 0.03, 0.1, 20]} />{M.glass({ op: 0.35, col: "#bfe8d0" })}</mesh>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.027, 0.027, 0.06, 20]} />{M.water({ col: "#6fd0a0", op: 0.7 })}</mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.018, 0.018, 0.02, 14]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
    </group>
    <group position={[0.2, 0, -0.05]}>
      <RBox s={[0.08, 0.1, 0.05]} p={[0, 0.05, 0]} r={0.008}>{M.plastic({ col: "#e9e4d8" })}</RBox>
      {[0, 1, 2].map((i) => { const k = (tt * 0.8 + i / 3) % 1; return <mesh key={i} position={[0, 0.06, 0.03]} scale={0.04 + 0.25 * k}><torusGeometry args={[1, 0.02, 6, 32]} />{M.glow({ col: "#9fd8ff", op: 0.5 * (1 - k) })}</mesh>; })}
    </group>
    <Rodent rat p={[lerp(-0.5, 0.05, w), 0, 0.12]} rot={[0, PI / 2, 0]} s={1.1} walk={tt * 2} />
    <mesh position={[0.08, 0.005, 0.12]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color="#c9a45a" roughness={1} /></mesh>
  </>;
}}</Scene3D>;

// ---- 24:10 · RECORRER EL CERCO OTRA VEZ: la cámara corre a lo largo del alambre y se frena en un agujero nuevo con tierra fresca ----
export const HNewHole: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0f110c" key1={[-1, 1.8, 1]}
  cam={{ at: [0.4, 0.1, 0], az: [1.2, 0.75], el: [0.22, 0.18], r: [1.1, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="EVERY WEEK · WALK THE FENCE" col={AMB} />}>{(tt) => <>
  <Grass w={4} d={3} />
  <Wire w={2.4} h={0.5} p={[0, 0.25, 0]} hex dens={10} />
  {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.05, 0.6, 0.05]} p={[-1.15 + i * 0.46, 0.3, -0.03]} r={0.006}>{M.wood({ base: [110, 74, 44] })}</RBox>)}
  <Burrow p={[0.45, 0, 0.06]} r={0.08 * eio(tt, 0.8, 1.6) + 0.001} />
  <pointLight position={[0.45, 0.12, 0.25]} intensity={0.2 * eio(tt, 1.6, 2.4)} distance={0.4} color="#ffe2b0" />
</>}</Scene3D>;

// ---- 25:38 · SIETE HUEVOS OTRA VEZ: la gallina se levanta del nido y deja los siete huevos enteros; se cuentan uno a uno ----
export const HSevenEggs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0, 0.06, 0], az: [0.2, -0.05], el: [0.75, 0.62], r: [0.9, 0.75], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={940} txt="SEVEN EGGS A DAY · AGAIN" col={GRN} />}>{(tt) => {
  const up = eio(tt, 0.3, 1.3), n = Math.floor(cl((tt - 1.4) / 1.6) * 7.99);
  return <>
    <NestBox eggs={7} />
    <Hen p={[lerp(0, 0.5, up), 0.04 + 0.06 * Math.sin(up * PI), lerp(0, 0.25, up)]} rot={[0, -0.8 * up, 0]} s={1.1} />
    {Array.from({ length: 7 }, (_, i) => i < n && <mesh key={i} position={[-0.15 + (i % 4) * 0.1, 0.11, -0.05 + Math.floor(i / 4) * 0.11]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.03, 0.036, 24]} />{M.glow({ col: GRN, op: 0.85 })}</mesh>)}
  </>;
}}</Scene3D>;
