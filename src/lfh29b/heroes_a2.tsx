// lfh29b · componentes únicos 7-12 (la media de nylon con jabones, el cajón que vuelve a correr, la huevera encendedora, los botones por color, el botón de abajo que sube, la costura que sale entera).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Button } from "./bk";

const PI = Math.PI;

// ---- 4:10 · LA MEDIA DE NYLON: caen las astillas de jabón adentro, se le hace el nudo y queda colgando junto a la bomba ----
export const HStocking: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#e9d9b8" key1={[0.2, 1.2, -1.4]}
  cam={{ at: [-0.06, 0.28, 0], az: [-0.25, 0.1], el: [0.06, 0.08], r: [0.5, 0.42], fov: 30 }}>{(tt) => {
  const n = Math.min(7, Math.floor(cl((tt - 0.4) / 2.6) * 8)), knot = eio(tt, 3.1, 3.6), sw = Math.sin(tt * 1.8) * 0.12 * eio(tt, 3.4, 4.0);
  const bulge = (u: number) => 0.012 + 0.024 * Math.sin(cl((u - 0.05) / 0.6) * PI) * (0.4 + 0.6 * n / 7);
  return <>
    <mesh position={[0.02, 0.43, -0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.06, 10]} />{M.steel({ col: "#6d6f71" })}</mesh>
    {/* bomba de agua de hierro al costado */}
    <group position={[-0.24, 0, -0.05]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.03, 0.035, 0.4, 20]} /><meshStandardMaterial color="#2e3a2f" metalness={0.5} roughness={0.6} /></mesh>
      <mesh position={[0.05, 0.3, 0]} rotation={[0, 0, -PI / 2.6]}><cylinderGeometry args={[0.012, 0.016, 0.1, 12]} /><meshStandardMaterial color="#2e3a2f" metalness={0.5} roughness={0.6} /></mesh>
      <mesh position={[-0.02, 0.42, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.006, 0.006, 0.22, 8]} /><meshStandardMaterial color="#2e3a2f" metalness={0.5} roughness={0.6} /></mesh>
    </group>
    <group position={[0.02, 0.43, 0.01]} rotation={[0, 0, sw]}>
      {/* la media: tubo translúcido color piel que se abulta con lo que tiene adentro */}
      <mesh geometry={tubeG("stk" + n, [[0, 0, 0], [0.004, -0.08, 0], [0, -0.17, 0.004], [-0.004, -0.26, 0]], (u) => bulge(u), 50, 18)}><meshPhysicalMaterial color="#c98f62" roughness={0.5} transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh position={[0, 0.0, 0]} scale={[1, 0.6 + 0.4 * knot, 1]}><sphereGeometry args={[0.012 + 0.004 * knot, 12, 8]} /><meshPhysicalMaterial color="#c8966c" roughness={0.6} /></mesh>
      {Array.from({ length: 7 }, (_, i) => { const p = phys(tt, 0.5 + i * 0.37, 8, 0.4), y = lerp(0.25, -0.22 + i * 0.023, p); return <RBox key={i} s={[0.034, 0.008, 0.016]} p={[(rn(i, 2) - 0.5) * 0.012, y, (rn(i, 3) - 0.5) * 0.01]} rot={[rn(i, 4), rn(i, 5) * 3, 0.3]} r={0.003}><meshStandardMaterial color={["#ef7f9c", "#7fc46b", "#f1cf45", "#6fa6dc"][i % 4]} roughness={0.4} /></RBox>; })}
    </group>
  </>;
}}</Scene3D>;

// ---- 4:45 · EL CAJÓN TRABADO: el cabo de vela frota la guía de madera, queda la raya de cera y el cajón entra solo ----
export const HDrawer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" lamp={[-0.3, 0.6, 0.2]}
  cam={{ at: [0.05, 0.22, 0.1], az: [0.65, 0.4], el: [0.4, 0.3], r: [0.8, 0.7], fov: 30 }}>{(tt) => {
  const rub = eio(tt, 0.4, 2.6), cx = lerp(-0.18, 0.18, (Math.sin(tt * 4.5 - PI / 2) + 1) / 2) * (tt < 2.8 ? 1 : 0), slide = eio(tt, 3.2, 4.2), out = 0.22 * (1 - slide) + 0.006 * Math.sin(tt * 30) * (tt < 0.4 ? 1 : 0);
  return <>
    {/* cómoda */}
    <RBox s={[0.5, 0.36, 0.34]} p={[0, 0.18, -0.17]} r={0.008}>{M.wood({ base: [120, 76, 42] })}</RBox>
    <RBox s={[0.46, 0.11, 0.004]} p={[0, 0.25, 0.001]} r={0.002}><meshStandardMaterial color="#120c08" roughness={1} /></RBox>
    {/* el cajón afuera, con la guía lateral a la vista */}
    <group position={[0, 0.25, -0.02 + out]}>
      <RBox s={[0.44, 0.1, 0.02]} p={[0, 0, 0.17]} r={0.004}>{M.wood({ base: [150, 100, 58] })}</RBox>
      <mesh position={[0, 0, 0.185]}><sphereGeometry args={[0.012, 16, 10]} />{M.brass()}</mesh>
      {[-0.215, 0.215].map((x) => <RBox key={x} s={[0.012, 0.08, 0.34]} p={[x, -0.004, 0]} r={0.002}>{M.wood({ base: [196, 150, 96] })}</RBox>)}
      <RBox s={[0.42, 0.008, 0.34]} p={[0, -0.04, 0]} r={0.002}>{M.wood({ base: [170, 128, 80] })}</RBox>
      <RBox s={[0.42, 0.07, 0.012]} p={[0, -0.008, -0.165]} r={0.002}>{M.wood({ base: [180, 136, 86] })}</RBox>
      {/* raya de cera brillante sobre el canto de la guía */}
      <mesh position={[0.215, 0.037, 0.17 - 0.17 * rub]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.014, Math.max(0.001, 0.34 * rub)]} /><meshPhysicalMaterial color="#fff3cf" emissive="#ffe6a0" emissiveIntensity={0.25} roughness={0.08} clearcoat={1} /></mesh>
    </group>
    {/* el cabo de vela que frota */}
    <group visible={tt < 2.9} position={[0.215, 0.31, -0.02 + out + cx * 0.8]} rotation={[0, 0, 0.3]}>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.016, 0.016, 0.06, 18]} /><meshStandardMaterial color="#d9c49a" roughness={0.85} /></mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.012, 6]} /><meshStandardMaterial color="#1b1612" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 5:18 · LA HUEVERA ENCENDEDORA: pelusa gris en cada hueco y la cera derretida que la tapa, hueco por hueco ----
export const HFirestarter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none"
  cam={{ at: [0, 0.02, 0], az: [-0.3, 0.1], el: [0.9, 0.8], r: [0.6, 0.5], fov: 30 }}>{(tt) => {
  const C = (i: number) => [((i % 6) - 2.5) * 0.06, (Math.floor(i / 6) - 0.5) * 0.06];
  const potx = lerp(-0.2, 0.15, cl((tt - 2.6) / 2.4));
  return <>
    <RBox s={[0.38, 0.012, 0.13]} p={[0, 0.005, 0]} r={0.004}><meshStandardMaterial color="#b9b1a4" roughness={1} /></RBox>
    {Array.from({ length: 12 }, (_, i) => { const lint = phys(tt, 0.3 + i * 0.17, 9, 0.4), wax = eio(tt, 2.8 + i * 0.18, 3.3 + i * 0.18); return <group key={i} position={[C(i)[0], 0.012, C(i)[1]]}>
      <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.027, 0.02, 0.026, 20, 1, true]} /><meshStandardMaterial color="#c4bcae" roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.012 + (1 - lint) * 0.18, 0]} scale={[1, 0.8, 1]}><icosahedronGeometry args={[0.022, 2]} /><meshPhysicalMaterial color="#5f6166" roughness={1} sheen={1} sheenColor="#a8aab0" /></mesh>
      <mesh visible={wax > 0.02} position={[0, 0.026, 0]} scale={[wax, 1, wax]}><cylinderGeometry args={[0.026, 0.026, 0.006, 24]} /><meshPhysicalMaterial color="#e2a63c" roughness={0.25} clearcoat={0.8} transparent opacity={0.85} /></mesh>
      <mesh visible={tt > 4.5 + i * 0.04} position={[0, 0.045, 0]} scale={[1, 1.6 + 0.2 * Math.sin(tt * 9 + i), 1]}><sphereGeometry args={[0.009, 10, 8]} />{M.glow({ col: "#ffb347" })}</mesh>
    </group>; })}
    {/* la latita de cera derretida que va volcando por encima */}
    <group visible={tt > 2.3} position={[potx, 0.14, -0.05]} rotation={[0, 0, -0.9]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.06, 24, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.029, 24]} /><meshStandardMaterial color="#e2a63c" roughness={0.3} /></mesh>
    </group>
    {tt > 2.6 && tt < 5.0 && <mesh position={[potx + 0.035, 0.08, -0.04]}><cylinderGeometry args={[0.003, 0.004, 0.11, 8]} /><meshPhysicalMaterial color="#e2a63c" roughness={0.2} clearcoat={1} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 6:58 · POR COLOR: el montón de botones sobre la mesa se ordena solo en cuatro hileras ----
const BCOL = ["#c0392b", "#2d5d9a", "#f2efe6", "#1d1b19"];
export const HButtonsort: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none"
  cam={{ at: [0, 0, 0.0], az: [0.1, -0.15], el: [0.95, 0.85], r: [0.72, 0.64], fov: 30 }}>{(tt) => <>
    {Array.from({ length: 40 }, (_, i) => { const c = i % 4, j = Math.floor(i / 4), k = phys(tt, 0.5 + j * 0.42 + c * 0.09, 6, 0.6);
      const a = rn(i, 2) * 6.3, r0 = 0.08 * Math.sqrt(rn(i, 3)), p0 = [Math.cos(a) * r0, 0.006 + rn(i, 4) * 0.012, Math.sin(a) * r0], p1 = [-0.22 + j * 0.049, 0.003, -0.135 + c * 0.09];
      return <group key={i} position={[lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k) + Math.sin(cl(k) * PI) * 0.05, lerp(p0[2], p1[2], k)]} rotation={[lerp(rn(i, 5) - 0.5, 0, cl(k)), 0, lerp(rn(i, 6) - 0.5, 0, cl(k))]}>
        <Button col={BCOL[c]} r={0.016 + 0.004 * rn(i, 7)} holes={rn(i, 8) > 0.5 ? 4 : 2} /></group>; })}
  </>}</Scene3D>;

// ---- 7:49 · EL BOTÓN DE ABAJO: falta uno arriba; el de la punta (el que va adentro del pantalón) sube a su lugar ----
export const HButtonswap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#3b4552" key1={[-0.8, 1.6, 1.6]}
  cam={{ at: [0, 0.02, 0], at1: [0, -0.06, 0], az: [0.25, -0.1], el: [0.1, 0.05], r: [0.6, 0.42], fov: 30 }}>{(tt) => {
  const mv = eio(tt, 1.0, 2.6), nw = phys(tt, 2.9, 7, 0.45), tuck = eio(tt, 3.8, 4.8);
  const Y = [0.24, 0.14, 0.04, -0.06, -0.16, -0.27];
  return <>
    {/* frente de la camisa de los domingos: tela blanca, tapeta con costura, ojales */}
    <RBox s={[0.42, 0.66, 0.01]} p={[0, -0.02, -0.01]} r={0.006}><meshStandardMaterial map={tex.text("shirt", 256, 256, (g) => { g.fillStyle = "#bcd3ea"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(90,120,160,.35)"; for (let i = 0; i < 256; i += 4) { g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } })} roughness={0.85} /></RBox>
    <RBox s={[0.07, 0.66, 0.006]} p={[0, -0.02, 0.0]} r={0.002}><meshStandardMaterial color="#c7dbef" roughness={0.8} /></RBox>
    {Y.map((y, i) => <group key={i} position={[0, y, 0.006]} rotation={[PI / 2, 0, 0]}>
      {i === 1 ? <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.03, 0.006]} /><meshBasicMaterial color="#2b3a4c" /></mesh> : i === 5 ? null : <Button col="#fbfbf8" r={0.017} />}
    </group>)}
    {/* el de abajo viaja en arco hasta el hueco de arriba */}
    <group position={[lerp(0, 0, mv) + Math.sin(mv * PI) * 0.12, lerp(Y[5], Y[1], mv), 0.008 + Math.sin(mv * PI) * 0.06]} rotation={[PI / 2, mv * PI * 2, 0]}><Button col="#fbfbf8" r={0.017} /></group>
    {mv >= 1 && <mesh position={[0, Y[1], 0.012]} rotation={[0, 0, PI / 4]}><boxGeometry args={[0.03, 0.005, 0.005]} /><meshStandardMaterial color="#c0392b" /></mesh>}
    {mv >= 1 && <mesh position={[0, Y[1], 0.012]} rotation={[0, 0, -PI / 4]}><boxGeometry args={[0.03 * eio(tt, 2.6, 3.0) + 0.001, 0.005, 0.005]} /><meshStandardMaterial color="#c0392b" /></mesh>}
    {/* abajo va cualquiera (uno rojo) y la pretina del pantalón lo tapa */}
    <group visible={tt > 2.8} position={[0, Y[5], 0.006 + (1 - cl(nw)) * 0.1]} rotation={[PI / 2, 0, 0]}><Button col="#b5482e" r={0.018} /></group>
    <RBox s={[0.5, 0.16, 0.03]} p={[0, -0.48 + 0.18 * tuck, 0.02]} r={0.008}><meshStandardMaterial color="#3a3f4a" roughness={0.8} /></RBox>
    <RBox s={[0.5, 0.012, 0.032]} p={[0, -0.4 + 0.18 * tuck, 0.021]} r={0.003}><meshStandardMaterial color="#2a1f18" roughness={0.6} /></RBox>
  </>;
}}</Scene3D>;

// ---- 8:10 · LA COSTURA SALE ENTERA: se tira del hilo y la boca de la bolsa de alimento se abre punto por punto ----
export const HSeam: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none"
  cam={{ at: [0.1, 0.26, 0], az: [0.15, 0.3], el: [0.34, 0.38], r: [1.3, 1.2], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.4), N = 18, pulled = Math.floor(k * N);
  const sx = (i: number) => -0.2 + (i / (N - 1)) * 0.4;
  const pts = [[sx(Math.min(N - 1, pulled)), 0.53, 0.04], [0.3, 0.55, 0.06], [0.38 + 0.2 * k, 0.45 - 0.1 * k, 0.1], [0.45 + 0.35 * k, 0.3 - 0.25 * k, 0.12]];
  return <>
    {/* bolsa de tela de alimento con flores impresas */}
    <RBox s={[0.46, 0.5, 0.2]} p={[0, 0.25, 0]} r={0.04}><meshStandardMaterial map={tex.text("sack", 256, 256, (g) => { g.fillStyle = "#e8dcc0"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#c97a6a"; for (let i = 0; i < 30; i++) { const x = rn(i, 2) * 256, y = rn(i, 3) * 256; for (let p = 0; p < 5; p++) { g.beginPath(); g.arc(x + Math.cos(p * 1.26) * 7, y + Math.sin(p * 1.26) * 7, 5, 0, 6.3); g.fill(); } } g.fillStyle = "#6b8f5a"; for (let i = 0; i < 30; i++) g.fillRect(rn(i, 4) * 256, rn(i, 5) * 256, 6, 3); })} roughness={0.95} /></RBox>
    {/* la boca de la bolsa: dos solapas que se separan donde ya no hay punto */}
    {[-1, 1].map((sd) => <mesh key={sd} position={[0, 0.53, sd * 0.03 * (0.3 + k)]} rotation={[sd * 0.9 * k, 0, 0]}><boxGeometry args={[0.44, 0.06, 0.006]} /><meshStandardMaterial color="#e3d6b8" roughness={0.95} /></mesh>)}
    {/* los puntos de cadeneta que quedan */}
    {Array.from({ length: N }, (_, i) => i < pulled ? null : <mesh key={i} position={[sx(i), 0.535, 0.002]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.011, 0.0035, 6, 14]} /><meshStandardMaterial color="#b8322a" roughness={0.8} /></mesh>)}
    {/* el hilo largo que sale de una pieza */}
    <mesh geometry={tubeG("seam" + Math.round(k * 90), pts, 0.0035, 60, 6)}><meshStandardMaterial color="#b8322a" roughness={0.8} /></mesh>
    {Array.from({ length: 30 }, (_, i) => { const u = phys(tt, 2.4 + i * 0.07, 7, 0.4); return <mesh key={"c" + i} visible={k > 0.5} position={[-0.18 + 0.36 * rn(i, 2), 0.53 + 0.05 * u + 0.02 * rn(i, 4), 0.06 * u * (rn(i, 3) - 0.3)]}><sphereGeometry args={[0.009, 8, 6]} /><meshStandardMaterial color="#e8b630" roughness={0.5} /></mesh>; })}
  </>;
}}</Scene3D>;
