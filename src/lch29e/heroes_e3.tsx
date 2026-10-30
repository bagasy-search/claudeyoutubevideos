// lch29e · componentes únicos 15-21 (la lluvia que deja las cortinas colgadas, el secarropas que derrite el forro, la gravedad que plancha, la marca de la silla, la cortina de baño con toallas, el vapor a una pulgada, el sacudón limpio).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Curtain, Rod, Washer, Window, cottonTex } from "./curtain";
import { Hand, Steam } from "./sofa";

const PI = Math.PI;

// ---- 9:13 · DÍA DE LLUVIA = LAS CORTINAS SE QUEDAN: gotas que corren por el vidrio, nubes que pasan; las cortinas ni se mueven del barral; recién cuando sale el sol bajan al canasto ----
export const HRainyDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#121418" key1={[-0.7, 1.2, 1.4]}
  cam={{ at: [0, 1.0, 0.1], az: [0.22, 0.15], el: [0.08, 0.1], r: [1.55, 1.35], fov: 34 }}>{(tt) => {
  const sun = eio(tt, 3.6, 4.8), down = eio(tt, 4.8, 6.0);
  const sky = `rgb(${Math.round(lerp(92, 236, sun))},${Math.round(lerp(102, 214, sun))},${Math.round(lerp(116, 170, sun))})`;
  return <>
    <group position={[0, 1.05, -0.06]}><Window w={0.9} h={1.05} sky={sky} /></group>
    {/* nubes oscuras que cruzan detrás del vidrio */}
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.32 + ((tt * 0.08 + i * 0.15) % 0.64), 1.3 + 0.12 * rn(i, 2), -0.085]} scale={[0.09 + 0.05 * rn(i, 3), 0.05, 1]}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#545b66" transparent opacity={0.85 * (1 - sun)} /></mesh>)}
    {/* gotas que bajan por el vidrio dejando su estela */}
    {sun < 0.98 && Array.from({ length: 22 }, (_, i) => { const ph = (tt * (0.35 + 0.3 * rn(i, 4)) + rn(i, 5)) % 1, x = (rn(i, 6) - 0.5) * 0.85;
      return <group key={"g" + i}><mesh position={[x, 1.55 - ph * 1.0, -0.04]}><sphereGeometry args={[0.008, 10, 8]} />{M.water({ col: "#cfe2ee", op: 0.8 * (1 - sun) })}</mesh>
        <mesh position={[x, 1.55 - ph * 0.5, -0.045]}><planeGeometry args={[0.003, ph * 1.0]} /><meshBasicMaterial color="#b8cad6" transparent opacity={0.35 * (1 - sun)} /></mesh></group>; })}
    <group position={[0, 1.62, 0.08]}><Rod len={1.2} />
      {[-0.32, 0.32].map((x, i) => <group key={i} position={[x * (1 + 0.55 * down), 0, 0]}><Curtain w={0.44} h={1.2} folds={4} amp={0.03} col="#efe8d6" gather={0.5 * down} /></group>)}
    </group>
    {/* el canasto que espera abajo a la derecha */}
    <group position={[0.15, 0, 0.45]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.24, 0.2, 0.24, 30, 1, true]} /><meshStandardMaterial map={tex.text("wicker", 128, 64, (g) => { g.fillStyle = "#b88a52"; g.fillRect(0, 0, 128, 64); g.strokeStyle = "#7a5530"; g.lineWidth = 2; for (let y = 4; y < 64; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); } for (let x = 0; x < 128; x += 10) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 64); g.stroke(); } })} roughness={0.9} side={2} /></mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 30]} /><meshStandardMaterial color="#8a6438" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 9:47 · EL CALOR DERRITE EL FORRO: el dorso térmico blanco de la cortina se ampolla con burbujas que crecen y se raja; la perilla del secarropas vuelve a «sin calor» ----
const blisterGeo = (() => { let g: THREE.PlaneGeometry | null = null; return () => g ?? (g = new THREE.PlaneGeometry(1, 0.7, 70, 50)); })();
export const HDryerMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16110e" key1={[-0.7, 1.2, 1.0]}
  cam={{ at: [0.05, 0.02, 0.05], az: [0.3, 0.22], el: [0.55, 0.62], r: [0.8, 0.7], fov: 32 }}>{(tt) => {
  const heat = eio(tt, 0.3, 3.4), knob = eio(tt, 3.8, 4.6);
  const geo = blisterGeo(), p = geo.attributes.position as THREE.BufferAttribute;
  const B = Array.from({ length: 11 }, (_, i) => [(rn(i, 2) - 0.5) * 0.8, (rn(i, 3) - 0.5) * 0.55, 0.03 + 0.035 * rn(i, 4), cl(heat * 1.4 - rn(i, 5) * 0.5)]);
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); let z = 0;
    for (const [bx, by, br, k] of B) { const d = Math.hypot(x - bx, y - by); if (d < br) z += k * 0.045 * Math.cos((d / br) * PI / 2) ** 2; }
    p.setZ(i, z); }
  p.needsUpdate = true; geo.computeVertexNormals();
  return <>
    {/* el frente de la cortina (verde) asoma por el borde */}
    <mesh position={[0.02, -0.006, -0.01]} rotation={[-PI / 2, 0, 0.04]}><planeGeometry args={[1.04, 0.74]} /><meshStandardMaterial map={cottonTex("#41624a")} roughness={1} /></mesh>
    <mesh geometry={geo} rotation={[-PI / 2, 0, 0]}><meshStandardMaterial color={`rgb(${Math.round(lerp(240, 226, heat))},${Math.round(lerp(238, 214, heat))},${Math.round(lerp(232, 186, heat))})`} roughness={0.55} metalness={0.05} /></mesh>
    {/* rajaduras que nacen de las burbujas grandes */}
    {B.slice(0, 5).map(([bx, by, br, k], i) => k > 0.6 && <mesh key={i} position={[bx + br * 0.6, 0.004 + 0.02 * k, -by]} rotation={[-PI / 2, 0, rn(i, 7) * PI]}><planeGeometry args={[0.16 * (k - 0.6) * 2.5 + 0.001, 0.006]} /><meshBasicMaterial color="#4a3a26" /></mesh>)}
    {/* el resplandor de calor que respira encima */}
    <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1, 0.7]} />{M.glow({ col: "#ff7a3a", op: 0.12 * heat * (1 - knob) * (0.8 + 0.2 * Math.sin(tt * 5)) })}</mesh>
    {/* la perilla del secarropas, arriba a la derecha, gira a sin calor */}
    <group position={[-0.3, 0.12, 0.2]} rotation={[-PI / 2 + 0.7, 0, 0]} scale={1.5}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 40]} />{M.pvc({ col: "#e8e6df" })}</mesh>
      <mesh position={[0, 0, 0.016]} rotation={[0, 0, lerp(-1.1, 1.0, knob)]}><RBox s={[0.014, 0.11, 0.012]} r={0.004}>{M.plastic({ col: "#3a3a3a" })}</RBox></mesh>
      <mesh position={[-0.06, 0.06, 0.016]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#d23a2a" /></mesh>
      <mesh position={[0.06, 0.06, 0.016]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#3a8ad2" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 10:23 · LA GRAVEDAD PLANCHA: la cortina húmeda cuelga del barral llena de arrugas; las gotas tiran para abajo y las arrugas se van de arriba a abajo ----
export const HGravityIron: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#15110d" key1={[-0.6, 1.4, 1.3]}
  cam={{ at: [0, 0.95, 0.15], az: [-0.3, -0.2], el: [0.06, 0.1], r: [1.3, 1.12], fov: 34 }}>{(tt) => {
  const k = eio(tt, 0.6, 5.0);
  return <>
    <group position={[0, 1.05, -0.06]}><Window w={0.8} h={1.0} sky="#e9eef0" /></group>
    <group position={[0, 1.62, 0.1]}><Rod len={1.1} brass={false} />
      <Curtain w={0.95} h={1.25} folds={5} amp={lerp(0.045, 0.028, k)} wrinkle={lerp(2.6, 0.1, k)} col="#f4f1ea" rough={0.6} />
    </group>
    {/* la línea donde termina lo arrugado baja con el tiempo */}
    <mesh position={[0, 1.62 - 1.25 * k, 0.14]}><planeGeometry args={[0.95, 0.006]} />{M.glow({ col: "#ffe6b0", op: 0.35 * (1 - k) * cl(k * 6) })}</mesh>
    {/* gotas que juntan peso en el ruedo y caen */}
    {Array.from({ length: 9 }, (_, i) => { const ph = (tt * 0.6 + rn(i, 2)) % 1, x = -0.42 + i * 0.105; return <mesh key={i} position={[x, 0.37 - (ph > 0.6 ? (ph - 0.6) * 0.9 : 0), 0.1 + 0.025 * Math.sin(x * 31)]} scale={[1, 1 + (ph < 0.6 ? ph : 0.6), 1]}><sphereGeometry args={[0.009, 12, 10]} />{M.water({ col: "#dbe9f0", op: 0.85 })}</mesh>; })}
    {/* flechitas de peso: sólo la forma, sin texto */}
    {[-0.3, 0, 0.3].map((x, i) => { const y = 1.2 - ((tt * 0.25 + i * 0.3) % 0.7); return <mesh key={"a" + i} position={[x, y, 0.16]} rotation={[0, 0, PI]}><coneGeometry args={[0.018, 0.04, 3]} />{M.glow({ col: "#ffe6b0", op: 0.4 * (1 - k) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 11:13 · LA SILLA DEJA LA MARCA: la cortina húmeda doblada sobre el respaldo; al colgarla, una raya filosa le cruza el medio ----
export const HFoldLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" bg="#15110d" key1={[-0.7, 1.3, 1.3]}
  cam={{ at: [0, 0.75, 0.2], az: [0.35, 0.15], el: [0.12, 0.1], r: [1.5, 1.3], fov: 34 }}>{(tt) => {
  const move = eio(tt, 2.0, 3.4);
  return <>
    {/* la silla de madera */}
    <group position={[-0.35, 0, 0.2]} rotation={[0, 0.4, 0]}>
      <RBox s={[0.42, 0.04, 0.4]} p={[0, 0.45, 0]} r={0.01}>{M.wood({ base: [128, 82, 44] })}</RBox>
      {[[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]].map(([x, z], i) => <RBox key={i} s={[0.035, 0.45, 0.035]} p={[x, 0.225, z]} r={0.008}>{M.wood({ base: [128, 82, 44] })}</RBox>)}
      {[-0.18, 0.18].map((x, i) => <RBox key={"b" + i} s={[0.035, 0.5, 0.035]} p={[x, 0.72, -0.17]} r={0.008}>{M.wood({ base: [128, 82, 44] })}</RBox>)}
      <RBox s={[0.4, 0.05, 0.035]} p={[0, 0.95, -0.17]} r={0.01}>{M.wood({ base: [128, 82, 44] })}</RBox>
      {/* la cortina colgando a horcajadas del respaldo */}
      {move < 0.98 && <group position={[0, 0.98, -0.17]} scale={[1, 1 - move, 1]}>
        <group rotation={[-0.25, 0, 0]}><Curtain w={0.42} h={0.5} folds={6} amp={0.008} col="#e7eef2" /></group>
        <group rotation={[0.25 + PI, 0, PI]}><Curtain w={0.42} h={0.5} folds={6} amp={0.008} col="#e7eef2" /></group>
      </group>}
    </group>
    {/* colgada: la raya filosa justo a la mitad */}
    {move > 0.02 && <group position={[0.32, 1.45, 0]} scale={[move, move, move]}><Rod len={0.6} brass={false} />
      <Curtain w={0.5} h={1.0} folds={4} amp={0.02} crease={1.6} col="#e7eef2" />
      <mesh position={[0, -0.5, 0.05]}><planeGeometry args={[0.52, 0.004]} />{M.glow({ col: "#ffd27a", op: 0.7 * cl((tt - 3.6) * 2) })}</mesh>
    </group>}
  </>;
}}</Scene3D>;

const linerTex = (k: number) => tex.text("liner" + Math.round(k * 10), 256, 128, (g) => { g.fillStyle = "#f3f6f7"; g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 70; i++) { const x = rn(i, 2) * 256, y = 128 - rn(i, 3) ** 2 * 60; g.globalAlpha = (1 - k) * 0.85; g.fillStyle = i % 3 ? "#d97a92" : "#2a2a2a"; g.beginPath(); g.arc(x, y, 1.5 + 3 * rn(i, 4), 0, PI * 2); g.fill(); } });
// ---- 11:31 · LAS TOALLAS VIEJAS FREGAN: la cortina de baño de plástico gira en el lavarropas con dos toallas que la raspan; los puntos rosa y negros del ruedo se borran ----
export const HShowerTowels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="tile" bg="#13120f" key1={[-0.6, 1.3, 1.4]}
  cam={{ at: [0, 0.42, 0.3], az: [-0.15, -0.05], el: [0.08, 0.06], r: [0.8, 0.68], fov: 32 }}>{(tt) => {
  const k = eio(tt, 1.0, 5.0), rot = tt * 2.0;
  return <Washer drum={rot} water={0.5} wcol="#c9dbe4">
    {/* la cortina de plástico, un pliego translúcido que gira */}
    <group rotation={[0.2, 0.3, rot * 0.3]}><mesh position={[0, -0.05, 0]} rotation={[-0.4, 0, 0]}><planeGeometry args={[0.3, 0.16, 12, 6]} /><meshPhysicalMaterial map={linerTex(k)} roughness={0.25} clearcoat={0.6} transparent opacity={0.9} side={2} /></mesh></group>
    {/* las dos toallas viejas, una azul y una durazno, que la raspan al pasar */}
    {["#7b93b0", "#e2a888"].map((c, i) => <group key={i} rotation={[0, 0, rot * 0.9 + i * PI]}><mesh position={[0.12, 0, 0.02]} scale={[1.4, 0.7, 1]}><icosahedronGeometry args={[0.06, 2]} /><meshStandardMaterial color={c} roughness={1} /></mesh></group>)}
    {Array.from({ length: 12 }, (_, i) => { const a = rot * 0.6 + i; return <mesh key={i} position={[Math.cos(a) * 0.14, Math.sin(a) * 0.14 - 0.03, 0.05]}><sphereGeometry args={[0.006 + 0.006 * rn(i, 3), 10, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transparent opacity={0.7} /></mesh>; })}
  </Washer>;
}}</Scene3D>;

// ---- 12:35 · UNA PULGADA, NUNCA APOYAR: el vaporizador pasa frente al terciopelo verde a una pulgada; entre la boca y la tela queda una luz fija; las arrugas se van detrás del vapor ----
export const HSteamHang: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" bg="#120f0c" key1={[-0.8, 1.3, 1.2]}
  cam={{ at: [0.05, 0.95, 0.2], az: [0.55, 0.45], el: [0.05, 0.08], r: [1.1, 0.95], fov: 32 }}>{(tt) => {
  const y = lerp(1.45, 0.55, eio(tt, 0.6, 5.4)), k = eio(tt, 0.6, 5.4);
  return <>
    {/* dos paños: el de arriba ya alisado, el de abajo arrugado; la línea entre ambos baja con el vaporizador */}
    <group position={[0, 1.65, 0]}><Rod len={0.9} />
      <Curtain w={0.8} h={1.65 - y} folds={6} amp={0.035} col="#2f5a3c" rough={0.75} />
    </group>
    <group position={[0, y, 0]}><Curtain w={0.8} h={y - 0.05} folds={6} amp={0.035} wrinkle={1.3} col="#2f5a3c" rough={0.75} /></group>
    {/* el vaporizador de mano, a una pulgada */}
    <group position={[0.05 + 0.2 * Math.sin(tt * 1.4), y + 0.04, 0.12]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.05, 0.05, 30]} />{M.pvc({ col: "#ece9e2" })}</mesh>
      <mesh position={[0, -0.12, 0.05]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.025, 0.03, 0.2, 20]} />{M.plastic({ col: "#6aa7c8", op: 0.8 })}</mesh>
      <group position={[0, -0.2, 0.15]} rotation={[-0.4, 0, 0]}><Hand grip={0.8} /></group>
      {/* la pulgada de aire: una franja dorada entre la boca y la tela */}
      <mesh position={[0, 0, -0.06]}><boxGeometry args={[0.07, 0.07, 0.065]} />{M.glow({ col: "#ffd78a", op: 0.16 })}</mesh>
      <Steam tt={tt} k={1} p={[0, 0, -0.06]} spread={0.08} h={0.2} n={16} />
    </group>
  </>;
}}</Scene3D>;

// ---- 14:17 · SÓLO SALE AIRE FRESCO: la cortina limpia se sacude junto a la ventana abierta; en vez de polvo salen cintas de brisa y dos hojas que entran del campo ----
export const HFreshShake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" bg="#15110d" key1={[-0.7, 1.4, 1.4]}
  cam={{ at: [0, 1.0, 0.2], az: [-0.35, -0.25], el: [0.06, 0.1], r: [1.55, 1.35], fov: 34 }}>{(tt) => {
  const shake = phys(tt, 0.8, 7, 0.25) * (tt > 0.8 ? 1 : 0);
  return <>
    <group position={[0, 1.05, -0.06]}><Window w={0.95} h={1.05} sky="#bfe0f3" sun={0.7} /></group>
    {/* el campo afuera */}
    <mesh position={[0, 0.72, -0.085]}><planeGeometry args={[0.95, 0.3]} /><meshBasicMaterial color="#8db35a" /></mesh>
    <group position={[0, 1.62, 0.1]}><Rod len={1.2} />
      {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0, 0]}><Curtain w={0.48} h={1.25} folds={4} amp={0.03} sway={0.12 + 0.18 * Math.abs(shake)} tt={tt * 1.6 + i} col="#fbfaf5" /></group>)}
    </group>
    {/* cintas de brisa: tubos curvos que cruzan de la ventana hacia la cámara */}
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.3 + i / 6) % 1;
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.3 + 0.12 * i, 1.0 + 0.08 * rn(i, 2), -0.05), new THREE.Vector3(-0.1 + 0.12 * i, 1.05, 0.4), new THREE.Vector3(0.1 + 0.12 * i, 0.95, 0.85)]);
      return <mesh key={i} position={[0, 0, ph * 0.2]}><tubeGeometry args={[curve, 30, 0.003, 6, false]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * Math.sin(ph * PI)} depthWrite={false} /></mesh>; })}
    {/* dos hojas de arce que entran girando */}
    {[0, 1].map((i) => { const ph = cl((tt - 1.5 - i * 1.2) / 3); return ph > 0 && ph < 1 && <mesh key={"l" + i} position={[lerp(-0.2, 0.5, ph), lerp(1.2, 0.3, ph) + 0.05 * Math.sin(ph * 12), lerp(-0.05, 0.6, ph)]} rotation={[ph * 6, ph * 4, ph * 3]}><circleGeometry args={[0.03, 5]} /><meshStandardMaterial color={i ? "#d2662a" : "#e2a02a"} side={2} /></mesh>; })}
  </>;
}}</Scene3D>;
void Hand; void rn;
