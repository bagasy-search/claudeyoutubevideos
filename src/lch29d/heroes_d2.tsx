// lch29d · componentes únicos 8-14 (secar sin frotar, el vapor que baja y la mancha que sube, la quemadura, la toalla corrida, el pelo mojado, la carpetita-armadura, las capas del brazo).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import * as THREE from "three";
import { Arm, Doily, Fabric, Hand, Spot, Steam, SteamIron, Towel } from "./sofa";

const PI = Math.PI;
// suela de plancha: gota con punta
const sole = (() => { const sh = new THREE.Shape(); sh.moveTo(0.13, 0); sh.quadraticCurveTo(0.04, 0.07, -0.08, 0.065); sh.quadraticCurveTo(-0.11, 0.06, -0.11, 0); sh.quadraticCurveTo(-0.11, -0.06, -0.08, -0.065); sh.quadraticCurveTo(0.04, -0.07, 0.13, 0); return sh; })();

// ---- 5:54 · SECAR, NO FROTAR: dos manchas iguales; arriba la mano frota en círculos y la mancha se agranda; abajo aprieta y la mancha se achica ----
export const HBlotNotRub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110e" key1={[-0.7, 1.3, 1.2]}
  cam={{ at: [0, 0.0, 0], az: [0.0, 0.05], el: [0.75, 0.82], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.2), press = Math.max(0, Math.sin(tt * 2.4)) * cl((tt - 0.6) * 2);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.0, 0.6]} /><Fabric rep={2} /></mesh>
    <RBox s={[1.0, 0.004, 0.006]} p={[0, 0.003, 0]} r={0.001}><meshStandardMaterial color="#9a8b74" /></RBox>
    {/* izquierda: frotar → crece */}
    <Spot r={lerp(0.07, 0.21, k)} col="#6a2a4a" op={lerp(0.9, 0.7, k)} p={[-0.25, 0.002, 0]} />
    {k > 0 && k < 1 && <group position={[-0.25 + 0.07 * Math.cos(tt * 7), 0.012, 0.07 * Math.sin(tt * 7)]} rotation={[0, tt * 3, 0]}><Towel w={0.16} d={0.12} marks={[{ x: 0, z: 0, r: 0.05, k: 0.3, col: "#7a3a5a" }]} /><group position={[0, 0.03, -0.02]}><Hand grip={0.1} /></group></group>}
    {/* derecha: apretar → se achica y pasa a la toalla */}
    <Spot r={lerp(0.07, 0.03, k)} col="#6a2a4a" op={lerp(0.85, 0.3, k)} p={[0.25, 0.002, 0]} />
    {k > 0 && k < 1 && <group position={[0.25, 0.02 + 0.03 * (1 - press), 0]}>
      <Towel w={0.16} d={0.12} marks={[{ x: 0, z: 0, r: 0.045, k: 0.7 * k, col: "#7a3a5a" }]} />
      <group position={[0, 0.03, -0.02]} rotation={[0, 0, 0]} scale={1.1}><Hand grip={0.1} /></group>
    </group>}
  </>;
}}</Scene3D>;

// ---- 6:41 · EL VAPOR BAJA, LA MANCHA SUBE: corte de plancha, toalla, tela y espuma; el vapor entra hacia abajo; al levantar, la mancha sube a la toalla ----
export const HSteamDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#13100d" key1={[-1.0, 1.2, 1.4]}
  cam={{ at: [0, 0.08, 0], az: [0.0, 0.18], el: [0.08, 0.14], r: [0.62, 0.55], fov: 32 }}>{(tt) => {
  const down = eio(tt, 0.4, 2.4), up = eio(tt, 2.8, 4.6);
  return <>
    {/* el corte: espuma amarilla, tela floreada, toalla blanca */}
    <RBox s={[0.6, 0.12, 0.2]} p={[0, -0.06, 0]} r={0.004}><meshStandardMaterial color="#e8d27a" roughness={1} /></RBox>
    {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.58, -0.06 + (rn(i, 3) - 0.5) * 0.1, 0.1]} ><circleGeometry args={[0.004 + 0.006 * rn(i, 4), 10]} /><meshBasicMaterial color="#c8b05a" /></mesh>)}
    <RBox s={[0.6, 0.02, 0.2]} p={[0, 0.01, 0]} r={0.003}><Fabric rep={1} /></RBox>
    <group position={[0, 0.03 + 0.06 * up, 0]}><RBox s={[0.42, 0.02, 0.2]} r={0.003}><meshStandardMaterial color="#f6f5f0" roughness={1} /></RBox>
      {/* la mancha que ya pasó a la toalla */}
      <mesh position={[0, -0.0105, 0.101]}><planeGeometry args={[0.16 * up, 0.018]} /><meshBasicMaterial color="#7a5a3a" transparent opacity={0.8 * up} /></mesh>
    </group>
    {/* la mancha dentro de la tela: partículas marrones que se aflojan y suben */}
    {Array.from({ length: 26 }, (_, i) => { const x = (rn(i, 5) - 0.5) * 0.16, y0 = 0.008 + 0.01 * rn(i, 6); const ph = cl((up - rn(i, 7) * 0.4) / 0.6);
      return <mesh key={i} position={[x, lerp(y0, 0.03 + 0.06 * up, ph) + 0.002 * Math.sin(tt * 9 + i) * down, 0.101]}><circleGeometry args={[0.0035, 8]} /><meshBasicMaterial color="#6b4a2a" /></mesh>; })}
    {/* las flechas de vapor: chorritos blancos que bajan */}
    <Steam tt={tt} k={down * (1 - up)} p={[0, 0.12, 0.05]} spread={0.3} h={0.09} down n={18} />
    <group position={[0, 0.045 + 0.2 * up, 0]}><SteamIron /></group>
  </>;
}}</Scene3D>;

// ---- 7:13 · LA PLANCHA DIRECTO = QUEMADURA: la plancha toca la tela de poliéster y, al levantarla, queda la marca brillante con forma de plancha ----
export const HScorch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#14110e" key1={[-0.8, 0.8, 1.2]}
  cam={{ at: [0, 0.03, 0], az: [0.4, 0.25], el: [0.42, 0.5], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const touch = phys(tt, 0.4, 7, 0.5), lift = eio(tt, 2.6, 3.6), mark = eio(tt, 1.2, 2.6);
  return <>
    <RBox s={[0.7, 0.08, 0.5]} p={[0, -0.04, 0]} r={0.03}><meshStandardMaterial color="#cdbf9f" roughness={0.95} /></RBox>
    {/* la marca: brillante, plástico derretido, con la forma de la suela */}
    <mesh position={[0.0, 0.0016, 0]} rotation={[-PI / 2, 0, 0.3]} scale={[0.9, 0.9, 1]}><shapeGeometry args={[sole]} /><meshPhysicalMaterial color="#8f7c55" roughness={0.12} clearcoat={1} transparent opacity={mark} /></mesh>
    <mesh position={[0.0, 0.0010, 0]} rotation={[-PI / 2, 0, 0.3]} scale={[1.06, 1.06, 1]}><shapeGeometry args={[sole]} /><meshBasicMaterial color="#4a2e12" transparent opacity={0.9 * mark} /></mesh>
    {mark > 0.2 && <Steam tt={tt} k={mark * (1 - lift * 0.5)} p={[0, 0.02, 0]} spread={0.15} h={0.15} />}
    <group position={[0, 0.002 + 0.25 * (1 - cl(touch)) + 0.2 * lift, 0]} rotation={[0, -0.3 + 0.0, 0]}><group rotation={[0, 0.6, 0]}><SteamIron /></group></group>
  </>;
}}</Scene3D>;

// ---- 7:44 · CORRÉ LA TOALLA A LA PARTE LIMPIA: la toalla con la marca marrón se desliza; la parte blanca queda arriba de la mancha y se marca de nuevo, más clarito ----
export const HTowelShift: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15110e" key1={[-0.7, 1.3, 1.2]}
  cam={{ at: [0.05, 0.02, 0], az: [0.2, 0.1], el: [0.7, 0.76], r: [0.75, 0.66], fov: 30 }}>{(tt) => {
  const s1 = eio(tt, 1.0, 2.0), r2 = eio(tt, 2.2, 3.4), s2 = eio(tt, 3.6, 4.6);
  const off = 0.11 * s1 + 0.11 * s2;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.9, 0.6]} /><Fabric rep={2} /></mesh>
    <Spot r={0.06} col="#5a3a1c" op={lerp(0.8, 0.4, r2)} p={[0, 0.001, 0]} />
    <group position={[-off + 0.11, 0.009, 0]}>
      <Towel w={0.5} d={0.2} marks={[{ x: -0.11, z: 0, r: 0.055, k: 0.75 }, { x: 0.0, z: 0, r: 0.055, k: 0.45 * r2 }]} />
    </group>
    {/* la mano que tira la toalla de la punta */}
    <group position={[-off + 0.38, 0.03, 0.0]} rotation={[0, -PI / 2, 0]}><Hand grip={0.5} /></group>
  </>;
}}</Scene3D>;

// ---- 8:33 · PELO MOJADO = SOMBRA EN EL RESPALDO: una cabeza de arcilla con el pelo mojado se apoya; al irse, queda el óvalo oscuro donde estuvo ----
export const HWetHair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" bg="#16110d" key1={[-0.6, 1.2, 1.4]}
  cam={{ at: [0, 0.6, 0.1], az: [0.35, 0.2], el: [0.1, 0.16], r: [0.9, 0.78], fov: 32 }}>{(tt) => {
  const lean = eio(tt, 0.3, 1.2), go = eio(tt, 2.9, 4.0), mark = eio(tt, 1.2, 3.2);
  return <>
    <RBox s={[1.0, 0.55, 0.2]} p={[0, 0.55, -0.1]} r={0.06}><Fabric rep={2} /></RBox>
    <RBox s={[1.0, 0.16, 0.6]} p={[0, 0.26, 0.2]} r={0.04}><Fabric rep={2} /></RBox>
    <Spot r={0.13} col="#3d2a16" op={0.9 * mark} p={[-0.14, 0.66, 0.0015]} rot={[0, 0, 0]} />
    {/* la cabeza: pelo oscuro brillante con gotas */}
    <group position={[-0.14 + 0.85 * go, 0.66 + 0.1 * go, 0.1 + 0.25 * (1 - lean) + 0.1 * go]}>
      <mesh scale={[1, 1.15, 1]}><sphereGeometry args={[0.1, 32, 24]} /><meshStandardMaterial color="#d9a888" roughness={0.65} /></mesh>
      <mesh position={[0, 0.02, -0.02]} scale={[1.05, 1.15, 1.02]}><sphereGeometry args={[0.1, 32, 24, 0, PI * 2, 0, PI * 0.62]} /><meshPhysicalMaterial color="#3a2a1c" roughness={0.15} clearcoat={1} /></mesh>
      {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.6 + rn(i, 2)) % 1; return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.14, -0.04 - 0.1 * ph, -0.08]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ op: 0.8 * (1 - ph) })}</mesh>; })}
    </group>
    <mesh position={[-0.14 + 0.85 * go, 0.48 + 0.1 * go, 0.12 + 0.25 * (1 - lean) + 0.1 * go]}><cylinderGeometry args={[0.13, 0.16, 0.2, 24]} /><meshStandardMaterial color="#f2ede0" roughness={0.9} /></mesh>
  </>;
}}</Scene3D>;

// ---- 9:04 · LAS CARPETITAS ERAN ARMADURA: la carpetita de crochet cae sobre el brazo; la mano grasosa baja tres veces y la tela de abajo queda limpia ----
export const HDoilyArmor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#17120e" key1={[-0.7, 1.3, 1.3]}
  cam={{ at: [0, 0.55, 0.05], az: [0.5, 0.35], el: [0.35, 0.42], r: [0.72, 0.62], fov: 32 }}>{(tt) => {
  const fall = cl(phys(tt, 0.2, 6, 0.45)), dirt = new THREE.Color("#ffffff").lerp(new THREE.Color("#a88e62"), eio(tt, 1.4, 3.8)), pat = Math.max(0, Math.sin((tt - 1.4) * 4)) * cl(tt - 1.4) * (1 - cl(tt - 3.8));
  return <>
    <group position={[0, 0.5, 0]}><Arm len={0.66} /></group>
    {/* la carpetita, curvada sobre el brazo */}
    <group position={[0.35 * eio(tt, 3.9, 4.6), 0.5 + 0.093 + 0.3 * (1 - fall) + 0.15 * eio(tt, 3.9, 4.6), 0]} rotation={[0, 0, -0.6 * eio(tt, 3.9, 4.6)]}><Doily r={0.13} col={dirt} /></group>
    {/* fuera de la carpetita, el brazo ya está oscuro; debajo, limpio */}
    <group position={[0, 0.5, 0]}><mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.22]}><cylinderGeometry args={[0.0915, 0.0915, 0.2, 40, 1, true, -1.3, 2.6]} /><meshPhysicalMaterial color="#5c4430" roughness={0.3} clearcoat={0.7} transparent opacity={0.65} depthWrite={false} /></mesh></group>
    {/* la mano que se apoya, una y otra vez, sobre la carpetita */}
    <group position={[0.0, 0.62 + 0.06 * (1 - pat) + (tt < 1.4 ? 0.2 : 0), 0.0]} rotation={[0, PI / 2, 0]}><Hand /></group>
  </>;
}}</Scene3D>;

// ---- 9:21 · VEINTE AÑOS DE CAPAS: el brazo del sofá en corte; caen y se apilan las capas (aceite de la piel, crema de manos, manteca de pochoclo, tinta de diario), cada una con lo que la dejó al lado ----
const inkTex = () => tex.text("ink", 256, 64, (g) => { g.fillStyle = "#4a4a50"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#26262c"; for (let i = 0; i < 40; i++) g.fillRect(rn(i, 2) * 256, rn(i, 3) * 64, 10 + 20 * rn(i, 4), 3); });
export const HArmLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" bg="#16110d" key1={[-0.8, 1.3, 1.4]}
  cam={{ at: [0, 0.3, 0], az: [0.3, 0.45], el: [0.22, 0.28], r: [1.05, 0.92], fov: 32 }}>{(tt) => {
  const L: [string, number, string][] = [["#e8c9a0", 0.6, "piel"], ["#fbf3e2", 1.4, "crema"], ["#e9c25a", 2.2, "manteca"], ["#4a4a50", 3.0, "tinta"]];
  const ks = L.map(([, a]) => cl(phys(tt, a, 7, 0.5)));
  return <>
    {/* el brazo en corte: bloque floreado con la espuma adentro */}
    <RBox s={[0.7, 0.22, 0.34]} p={[0, 0.11, 0]} r={0.05}><Fabric rep={1} /></RBox>
    <RBox s={[0.6, 0.16, 0.002]} p={[0, 0.11, 0.171]} r={0.001}><meshStandardMaterial color="#e8d27a" roughness={1} /></RBox>
    {/* las capas: cada una cae y se apoya sobre la anterior */}
    {L.map(([c], i) => ks[i] > 0.01 && <RBox key={i} s={[0.66 - i * 0.02, 0.022, 0.32 - i * 0.01]} p={[0, 0.231 + i * 0.023 + 0.35 * (1 - ks[i]), 0]} r={0.01}>
      {i === 3 ? <meshStandardMaterial map={inkTex()} roughness={0.5} /> : <meshPhysicalMaterial color={c} roughness={0.3} clearcoat={0.7} />}</RBox>)}
    {/* lo que dejó cada capa, al costado del brazo */}
    {ks[0] > 0.01 && <group position={[0.48, 0.0 + 0.3 * (1 - ks[0]), 0.1]} rotation={[0, -0.5, 0]} scale={0.8}><Hand /></group>}
    {ks[1] > 0.01 && <group position={[-0.48, 0.3 * (1 - ks[1]), 0.12]}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.035, 0.035, 0.08, 28]} />{M.plastic({ col: "#f3efe4" })}</mesh>
      <mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.018, 0.022, 0.02, 20]} />{M.plastic({ col: "#3d6fb0" })}</mesh></group>}
    {ks[2] > 0.01 && Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.36 + (rn(i, 2) - 0.5) * 0.12, 0.02 + 0.3 * (1 - ks[2]) + 0.015 * rn(i, 3), -0.12 + (rn(i, 4) - 0.5) * 0.1]} rotation={[rn(i, 5) * 3, rn(i, 6) * 3, 0]}><dodecahedronGeometry args={[0.018, 0]} /><meshStandardMaterial color="#f6e8b4" roughness={0.9} /></mesh>)}
    {ks[3] > 0.01 && <RBox s={[0.2, 0.012, 0.14]} p={[-0.4, 0.006 + 0.3 * (1 - ks[3]), -0.1]} rot={[0, 0.4, 0]} r={0.002}><meshStandardMaterial map={tex.paper()} /></RBox>}
  </>;
}}</Scene3D>;
void lerp;
