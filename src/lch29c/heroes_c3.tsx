// lch29c · componentes únicos 15-21 (el agua que se pone marrón, la lana de acero, la tapa de mamá, aceite contra grasa, las cuatro pasadas, la veta, el aluminio oscuro).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Blob, Boil, Bottle, Burner, Cloth, Filter, Hand, Pot, Vapor } from "./hood";

const PI = Math.PI;
const grainTex = () => tex.text("grain", 512, 256, (g) => { g.fillStyle = "#c3c7cb"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 700; i++) { const v = 150 + 80 * rn(i, 2); g.strokeStyle = `rgba(${v},${v + 3},${v + 6},0.5)`; g.lineWidth = 1; const y = rn(i, 3) * 256; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + (rn(i, 4) - 0.5) * 2); g.stroke(); } });

// ---- 9:00 · 20 AÑOS DE POLLO FRITO SE VAN: la olla con el filtro adentro; el agua pasa de clara a amarilla a marrón y suben gotas de grasa ----
export const HBrownWater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#14110d"
  cam={{ at: [0, 0.14, 0], az: [0.2, 0.1], el: [0.62, 0.7], r: [0.8, 0.68], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.3, 4.8), col = k < 0.5 ? new THREE.Color("#bcd8e6").lerp(new THREE.Color("#d8c26a"), k * 2) : new THREE.Color("#d8c26a").lerp(new THREE.Color("#6e4a1e"), (k - 0.5) * 2);
  return <>
    <Burner on={0.5} />
    <group position={[0, 0.01, 0]}><Pot level={0.78} water={"#" + col.getHexString()} wop={lerp(0.6, 0.92, k)} /></group>
    {/* el filtro asomando, sumergido */}
    <group position={[0, 0.1, 0]} rotation={[0.2, 0.3, 0]} scale={0.7}><Filter dirt={1 - k} /></group>
    {/* gotas de grasa que suben y flotan arriba */}
    {Array.from({ length: 14 }, (_, i) => { const t0 = 0.8 + rn(i, 2) * 3.4, ph = cl((tt - t0) / 0.9), a = rn(i, 3) * PI * 2, rr = 0.03 + rn(i, 4) * 0.1;
      return ph > 0 && <group key={i} position={[Math.cos(a) * rr + 0.01 * Math.sin(tt + i), 0.165, Math.sin(a) * rr]} scale={[1.2, 0.5, 1.2]}><Blob s={0.01 + 0.006 * rn(i, 5)} col="#e2b24a" /></group>; })}
    <Boil tt={tt} k={0.4} y={0.157} n={14} col="#fff4d0" />
    <Vapor tt={tt} k={1} p={[0, 0.2, 0]} spread={0.15} h={0.25} />
  </>;
}}</Scene3D>;

// ---- 9:50 · LA LANA DE ACERO ROMPE LA MALLA: la virulana pasa; los hilos se cortan y las capas se separan ----
export const HMeshTear: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#121110" key1={[-0.8, 1.0, 1.0]}
  cam={{ at: [0.02, 0.03, 0], az: [0.35, 0.2], el: [0.42, 0.5], r: [0.5, 0.42], fov: 30 }}>{(tt) => {
  const x = lerp(-0.18, 0.16, eio(tt, 0.6, 3.6));
  return <>
    {/* hilos de la malla: los que ya pasó la virulana quedan cortados y levantados */}
    {Array.from({ length: 22 }, (_, i) => { const xi = -0.21 + i * 0.02, cut = xi < x && (i % 3 === 0 || i % 5 === 1);
      return <group key={i}>
        {cut ? <>
          <mesh position={[xi, 0.012, -0.06]} rotation={[PI / 2 + 0.5, 0, 0.2]}><cylinderGeometry args={[0.0022, 0.0022, 0.1, 6]} />{M.steel()}</mesh>
          <mesh position={[xi + 0.006, 0.014, 0.06]} rotation={[PI / 2 - 0.6, 0, -0.3]}><cylinderGeometry args={[0.0022, 0.0022, 0.09, 6]} />{M.steel()}</mesh>
        </> : <mesh position={[xi, 0.004, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0022, 0.0022, 0.24, 6]} />{M.steel()}</mesh>}
      </group>; })}
    {Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[0, 0.006, -0.11 + j * 0.02]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0022, 0.0022, 0.44, 6]} />{M.steel({ col: "#b8bcc0" })}</mesh>)}
    {/* la virulana: bollo de hilitos */}
    {/* hilitos cortados que saltan en arco detrás de la virulana */}
    {Array.from({ length: 14 }, (_, i) => { const t0 = 0.8 + i * 0.2, ph = cl((tt - t0) / 0.7); return ph > 0 && ph < 1 && <mesh key={i} position={[x - 0.03 - 0.12 * ph * (0.5 + rn(i, 2)), 0.02 + 0.1 * Math.sin(ph * PI) * (0.5 + rn(i, 3)), (rn(i, 4) - 0.5) * 0.12]} rotation={[rn(i, 5) * 3, 0, ph * 6]}><cylinderGeometry args={[0.0015, 0.0015, 0.025, 4]} />{M.steel({ col: "#d8dade" })}</mesh>; })}
    <group position={[x + 0.02, 0.075, 0.0]} rotation={[PI, 0.2, 0]} scale={1.2}><Hand grip={0.55} /></group>
    <group position={[x, 0.04, 0]} rotation={[0, tt * 2, 0]} scale={1.8}>
      {Array.from({ length: 50 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.08, (rn(i, 3) - 0.5) * 0.04, (rn(i, 4) - 0.5) * 0.06]} rotation={[rn(i, 5) * PI, rn(i, 6) * PI, 0]}><torusGeometry args={[0.012 + 0.01 * rn(i, 7), 0.0012, 4, 12]} />{M.steel({ col: "#9c9a92" })}</mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 10:35 · LA TAPA AL LADO DE LA SARTÉN: sin tapa salta todo hacia arriba; con la tapa a medias casi nada llega a la campana ----
export const HHalfLid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" bg="#14110d"
  cam={{ at: [0, 0.2, 0], az: [0.1, 0.0], el: [0.08, 0.14], r: [1.25, 1.1], fov: 32 }}>{(tt) => {
  const lid = eio(tt, 0.8, 1.6);
  const pan = (x: number, covered: boolean) => <group position={[x, 0.04, 0]}>
    <mesh><cylinderGeometry args={[0.13, 0.11, 0.04, 40, 1, true]} /><meshStandardMaterial color="#1b1b1c" metalness={0.6} roughness={0.5} side={2} /></mesh>
    <mesh position={[0, -0.018, 0]}><cylinderGeometry args={[0.11, 0.11, 0.006, 40]} /><meshStandardMaterial color="#1b1b1c" /></mesh>
    {[-0.04, 0.04].map((dx, i) => <mesh key={i} position={[dx, -0.004, 0]} scale={[1.3, 0.5, 0.8]}><sphereGeometry args={[0.04, 18, 12]} /><meshStandardMaterial color="#b8742e" roughness={0.6} /></mesh>)}
    {covered && <group position={[0.03 + 0.1 * (1 - lid), 0.035 + 0.15 * (1 - lid), 0]} rotation={[0, 0, -0.08]}>
      <mesh scale={[1, 0.18, 1]}><sphereGeometry args={[0.13, 32, 16, 0, PI * 2, 0, PI / 2]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.028, 0]}><sphereGeometry args={[0.014, 14, 10]} /><meshStandardMaterial color="#222" /></mesh>
    </group>}
    {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 1.1 + rn(i, 2)) % 1, blocked = covered && lid > 0.8 && rn(i, 3) > 0.15; const top = blocked ? 0.05 : 0.45;
      return <mesh key={i} position={[(rn(i, 4) - 0.5) * 0.2 * (1 + ph), 0.02 + top * Math.sin(ph * PI), (rn(i, 5) - 0.5) * 0.15]}><sphereGeometry args={[0.007, 8, 6]} />{M.grease({ col: "#e9c062" })}</mesh>; })}
  </group>;
  return <>
    <group position={[0, -0.04, 0]} scale={[1.6, 1, 1]}><Burner on={1} /></group>
    {pan(-0.24, false)}
    {pan(0.24, true)}
    <RBox s={[1.1, 0.05, 0.4]} p={[0, 0.55, -0.05]} r={0.01}>{M.steel()}</RBox>
  </>;
}}</Scene3D>;

// ---- 11:35 · SEMEJANTE DISUELVE SEMEJANTE: la gota de aceite fresco toca la grasa barnizada; se ablanda, se corre y el trapo la levanta ----
export const HOilSoften: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121110" key1={[-0.6, 0.5, 1.2]}
  cam={{ at: [0, 0.02, 0], az: [0.3, 0.15], el: [0.42, 0.48], r: [0.68, 0.6], fov: 30 }}>{(tt) => {
  const drop = cl((tt - 0.4) / 0.6), soft = eio(tt, 1.0, 2.6), wipe = eio(tt, 3.0, 4.6);
  return <>
    {/* la chapa de acero de la campana */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.5]} /><meshStandardMaterial map={grainTex()} metalness={0.85} roughness={0.3} /></mesh>
    <group position={[0.02, 0.3 - 0.04 * eio(tt, 0.0, 0.4), 0.0]} rotation={[0, 0, -2.2 * eio(tt, 0.0, 0.4)]} scale={0.6}><Bottle col="#e9c13a" glass h={0.24} cap="#d23a2a" /></group>
    {/* costra de grasa barnizada: lisa y oscura; con aceite se vuelve blanda y brillante; el trapo la barre */}
    {Array.from({ length: 22 }, (_, i) => { const x = -0.12 + (i % 6) * 0.05 + (rn(i, 2) - 0.5) * 0.02, z = -0.06 + Math.floor(i / 6) * 0.04; if (x < lerp(-0.2, 0.25, wipe) - 0.1 && wipe > 0) return null;
      return <mesh key={i} position={[x + 0.04 * soft * (rn(i, 3) - 0.5), 0.004, z]} rotation={[0, rn(i, 4) * PI, 0]} scale={[1 + 0.35 * soft, lerp(0.35, 0.12, soft), 1 + 0.35 * soft]}><sphereGeometry args={[0.03 + 0.012 * rn(i, 5), 16, 10]} /><meshPhysicalMaterial color={soft > 0.5 ? "#9a6426" : "#4a2e10"} roughness={lerp(0.85, 0.08, soft)} clearcoat={soft} /></mesh>; })}
    {/* la gota de aceite que cae */}
    {drop < 1 && drop > 0 && <mesh position={[0, 0.2 - 0.2 * drop * drop, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 16, 12]} />{M.grease({ col: "#f0cb52" })}</mesh>}
    {drop >= 1 && <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]} scale={1 + 3 * soft}><circleGeometry args={[0.02, 24]} /><meshPhysicalMaterial color="#f0cb52" roughness={0.05} clearcoat={1} transparent opacity={0.55 * (1 - wipe)} /></mesh>}
    <group position={[lerp(-0.2, 0.14, wipe) - 0.3 * (1 - eio(tt, 2.4, 3.0)), 0.012 + 0.08 * (1 - eio(tt, 2.4, 3.0)), 0]}><Cloth dirt={wipe} /></group>
  </>;
}}</Scene3D>;

// ---- 12:25 · ACEITE, JABÓN, AGUA, TOALLA: una franja de la campana y cuatro pasadas, cada una deja su color ----
export const HFourPass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#121110"
  cam={{ at: [0, 0.03, 0], az: [0.15, -0.05], el: [0.45, 0.5], r: [0.9, 0.78], fov: 32 }}>{(tt) => {
  const P = [0.3, 1.5, 2.7, 3.9], x = (k: number) => lerp(-0.4, 0.4, k);
  const k = P.map((a) => eio(tt, a, a + 1.0));
  const cur = k.findIndex((v) => v < 1);
  const COL = ["#e9cb6a", "#cfe6c9", "#bfe0f2", "#f4efe2"], strip = ["#6b4318", "#a8946a", "#c2c5c4", "#cfd3d7", "#dfe3e7"];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.0, 0.36]} /><meshStandardMaterial color="#cfd3d7" metalness={0.85} roughness={0.25} /></mesh>
    {/* la franja: cada pasada la deja un paso más limpia */}
    {[0, 1, 2, 3].map((i) => { const w = 0.8 * k[i]; return w > 0.005 && <mesh key={i} position={[-0.4 + w / 2, 0.001 + 0.0005 * i, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[w, 0.14]} /><meshPhysicalMaterial color={strip[i + 1]} metalness={0.5 + 0.1 * i} roughness={0.5 - 0.1 * i} /></mesh>; })}
    <mesh position={[0, 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.14]} /><meshStandardMaterial color={strip[0]} roughness={0.6} transparent opacity={1 - k[0]} /></mesh>
    {/* los cuatro elementos esperando arriba: aceite, bol con jabón, bol con agua, toalla; el que trabaja baja */}
    {cur >= 0 && <group position={[x(k[cur]), 0.014, 0]}><Cloth col={COL[cur]} /></group>}
    <group position={[-0.32, 0, -0.26]} scale={0.6}><Bottle col="#e9c13a" glass h={0.24} cap="#d23a2a" /></group>
    {[[-0.08, "#cfe6c9"], [0.14, "#bfe0f2"]].map(([bx, c], i) => <group key={i} position={[bx as number, 0, -0.26]}>
      <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.06, 30, 16, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.026, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.055, 30]} /><meshPhysicalMaterial color={c as string} roughness={0.05} transparent opacity={0.8} /></mesh>
    </group>)}
    <RBox s={[0.12, 0.03, 0.08]} p={[0.36, 0.015, -0.26]} r={0.01}><meshStandardMaterial color="#f4efe2" roughness={1} /></RBox>
  </>;
}}</Scene3D>;

// ---- 13:15 · CON LA VETA: el acero cepillado de cerca; el trapo cruzado deja rayas, el trapo a favor de la veta deja espejo ----
export const HGrainWipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#101112" key1={[-1.4, 0.4, 0.6]}
  cam={{ at: [0, 0.0, 0], az: [0.0, 0.08], el: [0.9, 1.0], r: [1.0, 0.92], fov: 30 }}>{(tt) => {
  const a = eio(tt, 0.4, 2.2), b = eio(tt, 2.6, 4.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.45]} /><meshStandardMaterial map={grainTex()} metalness={0.9} roughness={0.32} /></mesh>
    {/* arriba: a contraveta, el trapo hace círculos y deja rayas marrones */}
    {Array.from({ length: 9 }, (_, i) => { const x = -0.3 + i * 0.075; return x < lerp(-0.35, 0.35, a) && <mesh key={i} position={[x, 0.001, -0.1]} rotation={[-PI / 2, 0, 0.9 + 0.4 * rn(i, 2)]}><planeGeometry args={[0.1, 0.006]} /><meshBasicMaterial color="#7d6646" transparent opacity={0.6} /></mesh>; })}
    {a > 0 && a < 1 && <group position={[lerp(-0.35, 0.35, a), 0.012, -0.1 + 0.03 * Math.sin(tt * 9)]}><Cloth col="#e6e0d0" w={0.09} d={0.07} /></group>}
    {/* abajo: a favor de la veta, queda una franja espejada */}
    {b > 0 && <mesh position={[-0.35 + 0.35 * b, 0.001, 0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7 * b, 0.12]} /><meshStandardMaterial color="#f4f7fa" metalness={0.55} roughness={0.12} emissive="#3a3d40" /></mesh>}
    {b > 0 && b < 1 && <group position={[lerp(-0.35, 0.35, b), 0.012, 0.1]}><Cloth col="#e6e0d0" w={0.09} d={0.07} /></group>}
  </>;
}}</Scene3D>;

// ---- 14:20 · EL LAVAVAJILLAS OSCURECE EL ALUMINIO: dos filtros iguales; el de la pastilla fuerte sale gris oscuro y opaco ----
export const HDarkAlu: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121110"
  cam={{ at: [0, 0.14, 0], az: [0.12, 0.0], el: [0.1, 0.16], r: [0.85, 0.75], fov: 32 }} key1={[-1.2, 0.6, 1.0]}>{(tt) => {
  const dk = eio(tt, 1.4, 4.0), rack = phys(tt, 0.3, 7, 0.5);
  return <>
    {/* la rejilla del lavavajillas */}
    <group position={[0, -0.12 * (1 - cl(rack)), 0]}>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.32 + i * 0.08, 0, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.4, 6]} /><meshStandardMaterial color="#d4d6d8" roughness={0.4} /></mesh>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0, 0, -0.18 + i * 0.07]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.7, 6]} /><meshStandardMaterial color="#d4d6d8" roughness={0.4} /></mesh>)}
      <group position={[-0.17, 0.12, 0]} rotation={[PI / 2 - 0.12, 0, 0]}><Filter dirt={0} w={0.28} d={0.22} /></group>
      <group position={[0.17, 0.12, 0]} rotation={[PI / 2 - 0.12, 0, 0]}><Filter dirt={0} dark={dk} w={0.28} d={0.22} /></group>
    </group>
    {/* la pastilla fuerte, del lado derecho */}
    <RBox s={[0.07, 0.035, 0.05]} p={[0.17, 0.02 + 0.25 * (1 - cl(phys(tt, 0.6, 9, 0.5))), 0.12]} r={0.008}>{M.plastic({ col: "#3a6fd8" })}</RBox>
    <Vapor tt={tt} k={dk * 0.6} p={[0.17, 0.02, -0.12]} spread={0.2} h={0.3} />
  </>;
}}</Scene3D>;
void Boil; void Burner;
