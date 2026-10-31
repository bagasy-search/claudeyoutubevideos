// apa30c · componentes únicos, minutos 9-14 (el resto de la comida, el alambre que sirve, que no cave, los dos primos).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN, TX } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Rodent, SoilBlock, barnT, grassT, soilT } from "./farmkit";
import { NestBox, Coop, Wire } from "./ckit";
import { Grass, Burrow } from "./heroes_1";

const PI = Math.PI;

// ---- 9:02 · DOS VECES AL DÍA: el sol pasa de la mañana a la tarde sobre el nido y los huevos se levantan a la canasta las dos veces ----
export const HEggTwice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-1, 1.8, 1.1]}
  cam={{ at: [0.15, 0.08, 0], az: [0.3, -0.1], el: [0.7, 0.55], r: [1.05, 0.9], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={940} txt="EGGS UP · MORNING AND AFTERNOON" col={AMB} />}>{(tt) => {
  const a = eio(tt, 0.2, 3.6), first = tt > 1.2 && tt < 2.2 ? 0 : 1, eggs = tt < 1.2 ? 4 : tt < 2.2 ? 0 : tt < 3.0 ? 3 : 0;
  return <>
    <NestBox eggs={eggs} />
    <group position={[0.45, 0, 0.05]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.11, 0.08, 0.12, 24, 1, true]} /><meshStandardMaterial color="#b88a4a" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.08, 0.08, 0.006, 24]} /><meshStandardMaterial color="#9a6e38" /></mesh>
      <mesh position={[0, 0.14, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.1, 0.006, 8, 24, PI]} /><meshStandardMaterial color="#9a6e38" /></mesh>
    </group>
    <pointLight position={[lerp(-1, 1, a), 0.6 + 0.4 * Math.sin(a * PI), 0.5]} intensity={1.6 * first + 0.6} distance={3} color="#ffe2b0" />
  </>;
}}</Scene3D>;

// ---- 9:39 · EL BEBEDERO QUE GOTEA: cae gota a gota, el charco crece; se ajusta la canilla y el charco se seca ----
export const HLeakyWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#110f0c" key1={[-0.8, 1.6, 1.1]}
  cam={{ at: [0, 0.12, 0], az: [-0.35, 0.2], el: [0.35, 0.28], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="FIX THE LEAK · A DRY COOP AT NIGHT" col={TX} />}>{(tt) => {
  const fix = eio(tt, 2.2, 2.6), pud = eio(tt, 0.2, 2.2) * (1 - eio(tt, 2.6, 3.8));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2, 1.5]} /><meshStandardMaterial map={soilT()} color="#b09a80" roughness={1} /></mesh>
    <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.09, 0.09, 0.3, 32]} />{M.plastic({ col: "#d8d4c8" })}</mesh>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.15, 0.14, 0.04, 32, 1, true]} />{M.plastic({ col: "#c33a2a", side: THREE.DoubleSide })}</mesh>
    {fix < 1 && Array.from({ length: 3 }, (_, i) => { const k = ((tt * 1.6 + i / 3) % 1); return <mesh key={i} position={[0.14, 0.03 - 0.03 * k, 0.04]}><sphereGeometry args={[0.006 * (1 - fix), 8, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
    <mesh position={[0.2, 0.002, 0.08]} rotation={[-PI / 2, 0, 0]} scale={[pud, pud * 0.7, 1]}><circleGeometry args={[0.2, 32]} />{M.water({ op: 0.55, col: "#6a5a40" })}</mesh>
  </>;
}}</Scene3D>;

// ---- 9:57 · EL ALAMBRE DE GALLINERO NO PARA RATAS: la rata se aplasta por un hexágono y pasa del otro lado ----
export const HChickenWire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f110c" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [0.7, 0.45], el: [0.18, 0.12], r: [0.75, 0.62], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="CHICKEN WIRE KEEPS CHICKENS IN" col={RED} />}>{(tt) => {
  const k = eio(tt, 0.6, 2.6), sq = Math.sin(cl((k - 0.35) / 0.3) * PI);
  return <>
    <Grass />
    <Wire w={1.2} h={0.5} p={[0, 0.25, 0]} hex dens={10} />
    <pointLight position={[0.35, 0.35, 0.5]} intensity={2.2} distance={1.4} color="#fff0d8" />
    <mesh position={[0, 0.002, lerp(-0.25, 0.25, k)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 24]} /><meshBasicMaterial color="#000" transparent opacity={0.35} /></mesh>
    <group position={[0, 0.0, lerp(-0.25, 0.25, k)]} scale={[1 - 0.3 * sq, 1 - 0.4 * sq, 1 + 0.15 * sq]}><Rodent rat rot={[0, 0, 0]} s={1.1} walk={tt * 2} /></group>
  </>;
}}</Scene3D>;

// ---- 10:11 · DEL TAMAÑO DE UNA MONEDA: la moneda de 25 centavos se apoya en el agujero de la tabla y la rata joven pasa por ahí ----
export const HQuarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#12100d" key1={[-0.6, 1.2, 1.2]}
  cam={{ at: [0, 0.1, 0], az: [0.45, 0.25], el: [0.12, 0.08], r: [0.45, 0.38], fov: 28 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={930} txt="A QUARTER-SIZE HOLE IS ENOUGH" col={AMB} />}>{(tt) => {
  const c = eio(tt, 0.3, 1.0) * (1 - eio(tt, 1.6, 2.0)), r = eio(tt, 2.0, 3.6), sq = Math.sin(r * PI);
  return <>
    <RBox s={[0.4, 0.25, 0.03]} p={[0, 0.125, -0.015]} r={0.003}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <mesh position={[0, 0.08, 0.001]}><circleGeometry args={[0.012, 24]} /><meshBasicMaterial color="#050403" /></mesh>
    <mesh position={[0, 0.08, 0.004 + 0.1 * (1 - c)]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.0018, 40]} /><meshStandardMaterial color="#d8dadc" metalness={1} roughness={0.25} /></mesh>
    {r > 0 && r < 1 && <group position={[0, 0.06, 0.12 - 0.2 * r]} scale={[1 - 0.55 * sq, 1 - 0.6 * sq, 1]}><Rodent rat rot={[0, PI, 0]} s={0.6} walk={tt * 2} /></group>}
  </>;
}}</Scene3D>;

// ---- 10:27 · MEDIA PULGADA: la malla soldada de media pulgada; la nariz de la rata empuja y no pasa; al lado la de un cuarto, para ratones también ----
export const HHalfInch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f110c" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0, 0.18, 0], az: [0.55, 0.35], el: [0.15, 0.1], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.4} x={640} y={930} txt="½ IN · STOPS RATS" col={GRN} /><Tag tt={tt} at={2.6} x={1300} y={930} txt="¼ IN · MICE TOO" col={TX} /></>}>{(tt) => {
  const push = Math.max(0, Math.sin(tt * 3)) * cl(tt - 0.6);
  return <>
    <Grass />
    <Wire w={0.5} h={0.4} p={[-0.27, 0.2, 0]} dens={16} />
    <Wire w={0.5} h={0.4} p={[0.27, 0.2, 0]} dens={30} />
    <Rodent rat p={[-0.27, 0, 0.17 - 0.03 * push]} rot={[0, PI, 0]} s={1.2} walk={tt * 0.5} />
  </>;
}}</Scene3D>;

// ---- 11:14 · COMO EL AGUA BUSCA LA GRIETA: unas gotas corren por la pared y se van todas a la rendija de la esquina; detrás llega la rata ----
export const HCornerGap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#100e0b" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0.1, 0.12, 0.1], az: [0.85, 0.6], el: [0.3, 0.22], r: [0.85, 0.72], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="NO GAPS AT THE CORNERS" col={RED} />}>{(tt) => {
  const r = eio(tt, 0.6, 2.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.5, 1.2]} /><meshStandardMaterial map={soilT()} roughness={1} /></mesh>
    <pointLight position={[0.7, 0.35, 0.5]} intensity={2.4} distance={1.6} color="#fff0d8" />
    <Wire w={0.5} h={0.35} p={[-0.05, 0.175, 0]} dens={16} />
    <Wire w={0.42} h={0.35} p={[0.2, 0.175, 0.21]} rot={[0, PI / 2, 0]} dens={16} />
    <mesh position={[0.2, 0.04, 0.004]} rotation={[0, PI / 4, 0]}><planeGeometry args={[0.025, 0.08]} /><meshBasicMaterial color="#050403" /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 0.3 - i * 0.12) / 1.4); return k > 0 && k < 1 && <mesh key={i} position={[lerp(-0.25 + 0.03 * (i % 5), 0.19, k), 0.01, lerp(0.18 - 0.02 * (i % 4), 0.02, k)]}><sphereGeometry args={[0.008, 8, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
    <Rodent rat p={[lerp(0.46, 0.25, r), 0, lerp(0.46, 0.07, r)]} rot={[0, -2.65, 0]} s={1.1} walk={tt * 2} />
  </>;
}}</Scene3D>;

// ---- 11:47 · UNA ZANJA DE UN PIE: corte del suelo junto a la pared; se cava la zanja, la malla baja hasta el fondo y se vuelve a tapar ----
export const HTrench: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#110f0b" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0.05, -0.04, 0], az: [0.2, -0.05], el: [0.14, 0.1], r: [0.95, 0.82], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="BURY IT A FOOT DOWN" col={AMB} />}>{(tt) => {
  const dig = eio(tt, 0.3, 1.4) * (1 - eio(tt, 3.0, 3.8)), w = eio(tt, 1.5, 2.8), y = lerp(0.32, -0.12, w);
  return <>
    <SoilBlock w={1.3} h={0.45} d={0.5} p={[0, 0, -0.25]} />
    <RBox s={[0.04, 0.4, 0.5]} p={[-0.02, 0.2, -0.25]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <mesh position={[0.075, -0.15 * dig, -0.006]}><boxGeometry args={[0.1, 0.3 * dig + 0.0001, 0.02]} /><meshStandardMaterial map={soilT()} color="#8a6444" roughness={1} /></mesh>
    <pointLight position={[0.2, 0.15, 0.4]} intensity={1.6} distance={1.0} color="#ffe6c0" />
    <Wire w={0.5} h={0.4} p={[0.026, y, -0.25]} rot={[0, PI / 2, 0]} dens={16} />
    <mesh position={[0.026, y, 0.004]}><boxGeometry args={[0.006, 0.4, 0.004]} />{M.glow({ col: "#dfe6ea" })}</mesh>
    <RBox s={[0.03, 0.3, 0.006]} p={[0.145, -0.15, 0.01]} r={0.002}><meshStandardMaterial map={tex.wood(1, 1, [214, 180, 110])} roughness={0.7} /></RBox>
    {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[0.135, -0.3 + i * 0.025, 0.015]}><boxGeometry args={[i % 4 ? 0.012 : 0.022, 0.002, 0.001]} /><meshBasicMaterial color="#2a1d12" /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 12:41 · CAVA JUSTO EN LA PARED: corte del suelo; la rata cava pegada al muro, choca con la falda de malla acostada y se rinde ----
export const HRatDig: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#110f0b" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0.1, -0.05, 0], az: [0.15, -0.1], el: [0.08, 0.06], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="HE DIGS AT THE WALL · HITS WIRE" col={GRN} />}>{(tt) => {
  const dig = eio(tt, 0.4, 1.8), scr = Math.sin(tt * 14) * 0.015 * cl(tt - 1.8);
  return <>
    <SoilBlock w={1.4} h={0.4} d={0.5} p={[0, 0, -0.25]} />
    <RBox s={[0.04, 0.4, 0.5]} p={[-0.3, 0.2, -0.25]} r={0.004}><meshStandardMaterial map={barnT()} roughness={0.95} /></RBox>
    <Wire w={0.6} h={0.5} p={[0.0, -0.04, -0.25]} rot={[-PI / 2, 0, 0]} dens={16} />
    <mesh position={[0.0, -0.04, 0.004]}><boxGeometry args={[0.6, 0.006, 0.004]} />{M.glow({ col: "#dfe6ea" })}</mesh>
    <mesh position={[-0.2, -0.02 - 0.02 * dig, 0.002]}><circleGeometry args={[0.07 + 0.02 * dig, 24]} /><meshStandardMaterial color="#3a2616" roughness={1} /></mesh>
    <group position={[-0.2 + scr, -0.06 - 0.02 * dig, 0.004]} rotation={[0, 0, -0.35 * dig]}><Rodent rat rot={[0, -PI / 2, 0]} s={0.9} walk={tt * 3} /></group>
  </>;
}}</Scene3D>;

// ---- 13:10 · LEVANTARLO UN PIE: el gallinero apoyado en la tierra sube sobre patas; la sombra de abajo se llena de luz y las ratas salen ----
export const HRaiseCoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f110c" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.25, 0], az: [0.55, 0.35], el: [0.22, 0.16], r: [1.6, 1.35], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={150} txt="RAISE IT A FOOT · NO DARK GAP" col={GRN} />}>{(tt) => {
  const l = eio(tt, 0.6, 2.0), run = eio(tt, 1.6, 3.4);
  return <>
    <Grass />
    <Coop lift={0.25 * l} />
    {[0, 1, 2].map((i) => <Rodent key={i} rat p={[-0.1 + 0.1 * i + 0.8 * run, 0, 0.05 * i]} rot={[0, PI / 2, 0]} s={1.1} walk={tt * 2 + i} />)}
    <pointLight position={[0, 0.12, 0.6]} intensity={1.4 * l} distance={1.2} color="#fff1d4" />
  </>;
}}</Scene3D>;

// ---- 13:32 · LOS DOS PRIMOS: la rata parda, pesada, junto a su cueva; la rata de techo, oscura y de cola larga, trepando el poste ----
export const HTwoCousins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f110c" key1={[-1, 1.8, 1]}
  cam={{ at: [0, 0.2, 0], az: [0.15, -0.1], el: [0.18, 0.12], r: [1.25, 1.05], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.4} x={600} y={150} txt="NORWAY RAT · DIGS" col={AMB} /><Tag tt={tt} at={2.4} x={1320} y={150} txt="ROOF RAT · CLIMBS" col={TX} /></>}>{(tt) => {
  const c = eio(tt, 0.6, 3.4);
  return <>
    <Grass />
    <Burrow p={[-0.4, 0, 0.0]} r={0.06} />
    <Rodent rat p={[-0.3, 0, 0.1]} rot={[0, -0.8, 0]} s={1.8} walk={tt * 0.6} />
    <RBox s={[0.07, 0.8, 0.07]} p={[0.35, 0.4, 0]} r={0.008}>{M.wood({ base: [110, 74, 44] })}</RBox>
    <group position={[0.35, 0.1 + 0.5 * c, 0.05]} rotation={[-PI / 2, 0, 0]}><Rodent rat s={1.3} walk={tt * 2} /></group>
  </>;
}}</Scene3D>;
